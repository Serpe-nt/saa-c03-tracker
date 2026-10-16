// Key points per plan step for the course "Designing a Serverless Architecture with Event-Driven Microservices" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c7a: {
    why: "A server you run yourself must be sized, patched and paid for, even while it waits for work. Serverless hands that to AWS, and your code runs only when something happens. Event-driven design is the matching style: services react to events instead of calling each other directly.",
    k: [
      ["Serverless", "Fits short, event-driven work with unpredictable traffic and a wish for the least operational overhead. AWS runs the servers: Lambda manages capacity provisioning, scaling and patching, and you pay only for what you use."],
      ["Push or pull", "Lambda is invoked in two ways. Push: a service such as S3 or API Gateway invokes the function directly. Pull: an event source mapping makes Lambda fetch from a queue or stream (SQS, DynamoDB Streams) and invoke the function with batches."],
      ["Synchronous or asynchronous", "A synchronous caller waits for the response. An asynchronous invocation is queued and Lambda answers at once. After a function error Lambda retries two more times. An on-failure destination or dead-letter queue keeps events that still fail."],
      ["EventBridge rule", "Decides which events go where. A rule matches events with a JSON event pattern and sends them to up to five targets. This holds on the default bus and on a Custom Event Bus - Classic."],
      ["Where events come from", "The EventBridge default bus receives AWS service events automatically. Your own events are sent with <code>PutEvents</code>."],
      ["The price of event-driven", "Services talk over the network, so latency varies. Data across services is often eventually consistent, which makes handling duplicates harder. That is the price for services that scale and fail independently."]
    ],
    trap: "One function that handles every route and event (the Lambda monolith) works but is an anti-pattern. Workloads that need very low latency, such as real-time trading, are a poor fit for event-driven design.",
    docs: [
      ["Creating event-driven architectures with Lambda", "https://docs.aws.amazon.com/lambda/latest/dg/concepts-event-driven-architectures.html"],
      ["How Lambda handles errors and retries with asynchronous invocation", "https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-error-handling.html"],
      ["Amazon EventBridge event bus (default and Classic)", "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-bus.html"]
    ]
  },

  c7b: {
    why: "Code needs somewhere to run, and clients need a front door through which to call it. Run both yourself and you manage servers, scaling and protection against overload. Lambda runs the code with no servers to manage, and API Gateway is the managed front door. The limits of each tell you when a container or an instance fits better.",
    k: [
      ["Lambda limits", "A standard function runs for at most 15 minutes per invocation, with 128 MB to 10,240 MB of memory. Lambda allocates CPU in proportion to memory. So more memory speeds up a CPU-bound function, and a longer timeout does not."],
      ["Reserved concurrency", "Guarantees one function its share and limits it to that share. It sets aside part of the account's concurrency for the function and also caps it, at no additional charge."],
      ["Provisioned concurrency", "Reduces cold starts. It keeps execution environments initialized, and it costs extra."],
      ["HTTP, REST or WebSocket API", "HTTP APIs have minimal features at a lower price. Choose a REST API for API keys, per-client throttling, request validation, AWS WAF or a private endpoint. A WebSocket API keeps a connection open, so the backend can send messages to clients."],
      ["Throttling and caching", "API Gateway shields a backend. Above the rate and burst limits callers get <code>429 Too Many Requests</code>. Stage caching answers repeated requests from a cache without calling the backend, for a TTL of 300 seconds by default and 3,600 at most."],
      ["Compute choice", "Lambda for short event-driven code. Fargate to run containers without managing servers or clusters, for example jobs longer than 15 minutes. EC2 for control of the operating system. A function can also be a container image of up to 10 GB."]
    ],
    trap: "A Lambda function times out after 15 minutes at most (Lambda Managed Instances allow up to 90 for asynchronous work). An edge-optimized REST endpoint routes requests through a CloudFront point of presence. A Regional endpoint is intended for clients in the same Region.",
    docs: [
      ["Lambda quotas", "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html"],
      ["Choose between REST APIs and HTTP APIs", "https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html"],
      ["Understanding Lambda function scaling", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html"]
    ]
  },

  c7c: {
    why: "When one service calls another directly, a slow or failed receiver stalls the sender, and a burst of requests can overwhelm it. A messaging service in between takes the message and holds or forwards it. SQS is the queue that a consumer works through at its own pace. SNS is the topic that gives every subscriber a copy.",
    k: [
      ["SQS queue", "Decouples producer and consumer. The queue keeps messages until a consumer is ready: 4 days by default, up to 14. So a burst or a consumer outage loses nothing. A consumer receives a message, processes it and deletes it."],
      ["Standard or FIFO", "Standard queues give at-least-once delivery and best-effort ordering at nearly unlimited throughput. FIFO queues keep strict order within a message group and introduce no duplicates. One group ID per order or account keeps each of them in sequence."],
      ["SNS topic", "Publish/subscribe: a publisher sends a message to a topic and every subscription receives it (SQS, Lambda, HTTP(S), email, SMS, Firehose). A filter policy on a subscription lets through only the messages that match."],
      ["Fan-out", "One SNS topic with one SQS queue per consumer. Each queue holds its own copy until its consumer is ready. So services work at their own pace, and a new one subscribes without any change to the publisher."],
      ["Lambda as consumer", "Lambda reads a queue through an event source mapping. Its maximum concurrency setting caps how many invocations run at once, which protects a database behind the consumer."],
      ["Ordered fan-out", "Fan-out that must keep the order of messages needs an SNS FIFO topic with SQS FIFO queues."]
    ],
    trap: "Consumers that share one queue do not each see every message. SNS discards a message once its delivery retries are exhausted, unless the subscription has a dead-letter queue. A standard queue can deliver a message twice, so make consumers idempotent.",
    docs: [
      ["Amazon SQS standard queues", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html"],
      ["Fanout Amazon SNS notifications to Amazon SQS queues for asynchronous processing", "https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html"],
      ["Configuring scaling behavior for SQS event source mappings", "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html"]
    ]
  },

  l7a: {
    why: "A small piece of code that runs now and then does not justify a server. A server must be provisioned, maintained and paid for while it waits. Building a function by hand shows the few things Lambda still needs from you. They are a role that says what the function may do, and the memory and timeout settings.",
    k: [
      ["Execution role", "Grants the function permission to use AWS services. Every function has one, and it is an IAM role. Its logs reach CloudWatch Logs only if that role allows it, by default in a log group named <code>/aws/lambda/&lt;function-name&gt;</code>."],
      ["Memory and timeout", "The two settings that decide speed and cost. Memory is 128 MB to 10,240 MB, and CPU grows with it. Timeout is 3 seconds by default and 900 at most. A function that is cut off after 3 seconds has usually just hit the default timeout."],
      ["Lambda over EC2", "The lab's scenario is the standard argument for Lambda. There are no servers to provision or maintain. Billing is pay-per-use instead of paying for instances that wait for work."]
    ],
    docs: [
      ["What is AWS Lambda?", "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"],
      ["Defining Lambda function permissions with an execution role", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html"],
      ["Configure Lambda function timeout", "https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html"]
    ]
  },

  l7b: {
    why: "If a producer sends straight to a consumer, a message that arrives while the consumer is down or busy can be lost. A queue in between holds it. Wiring a topic to a queue by hand shows what makes that buffer work. One part is the permission that lets the topic write to the queue. The other is the rule for when a message leaves the queue.",
    k: [
      ["Subscription plus queue policy", "Subscribing a queue to a topic takes two things: the subscription itself and a queue policy that gives the topic <code>sqs:SendMessage</code> permission. Without the permission the subscription exists but nothing arrives in the queue."],
      ["Visibility timeout", "A received message is not removed. It stays in the queue, hidden for the visibility timeout (30 seconds by default). If the consumer does not delete it in time, it becomes visible again and another consumer can receive it."],
      ["Raw message delivery", "Decides what the queue receives. Turned off, the queue gets a JSON document with SNS metadata around your message. Turned on, the subscriber gets the message as published."],
      ["Backlog", "Stop the consumer and watch the queue fill: messages wait instead of being dropped. That backlog is what a fleet of workers scales on, as backlog per instance, rather than on CPU."]
    ],
    docs: [
      ["Subscribing an Amazon SQS queue to an Amazon SNS topic", "https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html"],
      ["Amazon SQS visibility timeout", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html"],
      ["Scaling policy based on Amazon SQS", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html"]
    ]
  },

  l7c: {
    why: "Services that call each other directly must each know whom to call and wait for the answer. With an event bus in the middle, a sender only announces what happened, and rules decide who reacts. Building the chain by hand shows what each link needs: a pattern that matches, and permission to call the next service.",
    k: [
      ["HTTP API to a service", "An HTTP API can call an AWS service with no Lambda function in between. A first-class integration such as <code>EventBridge-PutEvents</code> puts the request on an event bus. API Gateway needs an IAM role that allows that action."],
      ["Event pattern", "Selects the events a rule acts on. On a default or Classic event bus it is JSON that lists the attributes and values an event must have. An event can match several rules. One that matches no rule causes no action at all, so a wrong pattern fails silently."],
      ["Permission to invoke", "EventBridge needs permission to invoke a target. For a Lambda function that is a resource-based policy allowing <code>events.amazonaws.com</code> to call <code>lambda:InvokeFunction</code>, or an IAM execution role set on the target."],
      ["WebSocket API", "For a backend that must send messages to connected clients. It keeps a persistent connection per client. API Gateway calls the <code>$connect</code> and <code>$disconnect</code> routes when a client joins or leaves."]
    ],
    docs: [
      ["Create AWS service integrations for HTTP APIs in API Gateway", "https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services.html"],
      ["Using resource-based policies for Amazon EventBridge", "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html"],
      ["Overview of WebSocket APIs in API Gateway", "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html"]
    ]
  },

  l7d: {
    why: "An upload to S3 should start work in several services, and no event may be lost when one of them fails. Building the chain by hand, from bucket to topic to queues to function, shows where each event waits and who may pass it on. It also shows where an event ends up when processing keeps failing.",
    k: [
      ["S3 event notifications", "S3 sends them to an SNS topic, an SQS queue, a Lambda function or EventBridge. For a topic or queue, its policy must give Amazon S3 permission to publish to it."],
      ["Lambda polls the queue", "Lambda polls the queue through an event source mapping and deletes a batch when the function succeeds. After an error the whole batch becomes visible again, unless <code>ReportBatchItemFailures</code> is on and the function returns the failed message IDs."],
      ["Dead-letter queue", "Belongs to the source queue. Its redrive policy moves a message there once it has been received <code>maxReceiveCount</code> times without being deleted. Set that count high enough to allow retries."],
      ["Fan-out", "S3 to SNS to several queues is fan-out: each queue gets its own copy of every event."],
      ["Role to read the queue", "The function's execution role must be allowed to read its queue. <code>AWSLambdaSQSQueueExecutionRole</code> covers that."]
    ],
    docs: [
      ["Event notification types and destinations (Amazon S3)", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-event-types-and-destinations.html"],
      ["Using Lambda with Amazon SQS", "https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html"],
      ["Using dead-letter queues in Amazon SQS", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html"]
    ]
  },

  l7e: {
    why: "When a request passes through several services and is slow, each service's own logs and metrics show only its part. You cannot see where in the chain the time went. AWS X-Ray follows one request across the services and draws the path, so the slow or failing link stands out.",
    k: [
      ["Segments, traces, trace map", "X-Ray receives segments from the services that handle a request and groups those of one request into a trace. From the traces it draws the trace map (the service map in the X-Ray console). There you see which service has errors or high latency."],
      ["Active tracing", "With active tracing on a Lambda function, Lambda creates the trace segments itself. To see the calls your code makes to other services, instrument the code, for example with X-Ray SDK subsegments."],
      ["Sampling", "X-Ray samples. By default the SDK records the first request each second and five percent of any additional requests. A trace set is a representative sample, not a record of every request."],
      ["Annotations or metadata", "Annotations are key-value pairs that X-Ray indexes, so you can filter traces by them. Metadata is stored with the trace but not indexed."]
    ],
    trap: "Slow requests through several microservices with no obvious culprit point to X-Ray. CloudWatch metrics and alarms show that something is wrong. Logs show what one component wrote. CloudTrail records who made which API call.",
    docs: [
      ["What is AWS X-Ray?", "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html"],
      ["AWS X-Ray concepts", "https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html"],
      ["Visualize Lambda function invocations using AWS X-Ray", "https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html"]
    ]
  },

  c7d: {
    why: "A public API can be called by anyone who has its address. Before it runs your code, something must establish who the caller is and what that caller may do. Amazon Cognito signs users in, so you do not build a user directory yourself. API Gateway checks each request before it reaches the backend.",
    k: [
      ["Cognito user pool", "Signs users in. It is a user directory that signs users in directly or through social and other identity providers, and it issues JSON web tokens."],
      ["Cognito identity pool", "Gives the app access to AWS. It issues temporary AWS credentials, also to guests, so the app can call S3 or DynamoDB."],
      ["Who may call a REST API method", "Three choices. IAM roles and policies. A Cognito user pool authorizer that checks the pool's tokens. Or a Lambda authorizer that runs your own logic on a bearer token or request parameters and returns an IAM policy."],
      ["Resource policy and private API", "A resource policy on the API allows or denies callers by AWS account, source IP range or VPC endpoint. A private REST API is callable only from within a VPC through an interface endpoint, isolated from the public internet."],
      ["AWS WAF and usage plans", "AWS WAF protects a REST API stage from common web exploits such as SQL injection and cross-site scripting. Usage plans with API keys throttle and set quotas per customer."],
      ["HTTP APIs and caching", "HTTP APIs offer a JWT authorizer for OpenID Connect and OAuth 2.0 tokens, which also works with Cognito. With authorization caching on, API Gateway caches a Lambda authorizer's policy instead of invoking the function again."]
    ],
    trap: "A user pool alone hands out no AWS credentials, and an identity pool alone has no sign-up or password reset. API keys identify a client for a usage plan: AWS says not to use them for authentication or authorization.",
    docs: [
      ["What is Amazon Cognito?", "https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html"],
      ["Control and manage access to REST APIs in API Gateway", "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-to-api.html"],
      ["Usage plans and API keys for REST APIs in API Gateway", "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html"]
    ]
  },

  c7e: {
    why: "Serverless takes the servers away, not the security work. What remains is yours. That is what a function may do, who may start it, where its secrets live, how its data is protected and what gets recorded. Each of these has its own control.",
    k: [
      ["Two policies on a function", "The execution role says which AWS services and resources the function may use. Keep it least privilege. The resource-based policy says which service or account may invoke the function."],
      ["Secrets", "Lambda encrypts environment variables at rest with a KMS key, an AWS managed key by default or your customer managed key. For database credentials AWS recommends Secrets Manager instead, which also rotates secrets."],
      ["Function in a VPC", "By default a function has access to the public internet. Attached to a VPC it reaches only resources available in that VPC, so reaching the internet takes a NAT gateway. DynamoDB can be reached privately through a gateway endpoint."],
      ["DynamoDB encryption", "DynamoDB encrypts tables at rest, by default with an AWS owned key. Choose a customer managed key for full control over the key."],
      ["Point-in-time recovery", "Restores a DynamoDB table to an earlier moment. It keeps up to 35 days of per-second recovery points and always restores to a new table."],
      ["Auditing", "CloudTrail logs Lambda and DynamoDB control plane calls by default. Function invocations and item-level DynamoDB calls are data events you must turn on. GuardDuty Lambda Protection monitors the functions' network activity logs."]
    ],
    trap: "Permission in a function's execution role to read a bucket does not let S3 invoke the function. That takes the resource-based policy. Encrypting an environment variable does not rotate the credential inside it.",
    docs: [
      ["Defining Lambda function permissions with an execution role", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html"],
      ["Securing Lambda environment variables", "https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars-encryption.html"],
      ["DynamoDB encryption at rest", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/EncryptionAtRest.html"]
    ]
  },

  c7f: {
    why: "A business process has many steps, and some of them fail or have to wait. Chain the steps inside your functions and the retry, wait and error logic is scattered through the code, where nobody can follow it. Step Functions keeps the flow outside the code. Logs and traces then show what each part did and where the time went.",
    k: [
      ["Step Functions", "Runs a workflow as a state machine, so retries and error handling live outside your code. <code>Retry</code> with a backoff rate handles transient errors. <code>Catch</code> sends a failed step to a fallback state such as a compensation step."],
      ["Standard workflows", "For long-running flows. They run up to one year with exactly-once execution and support the callback pattern (<code>.waitForTaskToken</code>), as for a human approval."],
      ["Express workflows", "For high-volume event processing. They run up to five minutes and do not support the callback pattern."],
      ["CloudWatch Logs", "Lambda sends function logs to CloudWatch Logs. Log data is kept indefinitely unless you set a retention period on the log group. A metric filter turns matching log events into a metric that an alarm can watch."],
      ["X-Ray", "Traces a request across services and draws a trace map that shows where errors occur and which connections have high latency. Logs tell you what one component did. A trace tells you where in the chain the time went."],
      ["Putting it together", "API Gateway is the front door (authorization, throttling). Lambda runs the logic. SQS buffers. SNS or EventBridge fans out. Step Functions coordinates multi-step flows. DynamoDB keeps state. One stated requirement picks each."]
    ],
    trap: "A function that calls the next function, or sleeps while it waits, is the hand-written orchestration Step Functions replaces. A dead-letter queue between steps keeps failed messages. It runs no compensation and waits for no approval.",
    docs: [
      ["Choosing workflow type in Step Functions", "https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html"],
      ["Handling errors in Step Functions workflows", "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html"],
      ["Using the X-Ray trace map", "https://docs.aws.amazon.com/xray/latest/devguide/xray-console-servicemap.html"]
    ]
  }
});
