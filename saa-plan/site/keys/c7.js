// Key points per plan step for the course "Designing a Serverless Architecture with Event-Driven Microservices" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c7a: {
    k: [
      "Serverless means AWS runs the servers: Lambda manages capacity provisioning, scaling and patching, and you pay only for what you use. It fits short, event-driven work with unpredictable traffic and a wish for the least operational overhead.",
      "Lambda is invoked in two ways. Push: a service such as S3 or API Gateway invokes the function directly. Pull: an event source mapping makes Lambda fetch from a queue or stream (SQS, DynamoDB Streams) and invoke the function with batches.",
      "A synchronous caller waits for the response. An asynchronous invocation is queued and Lambda answers at once; after a function error Lambda retries two more times, and an on-failure destination or dead-letter queue keeps events that still fail.",
      "On the EventBridge default bus and on a Custom Event Bus - Classic, a rule matches events with a JSON event pattern and sends them to up to five targets. The default bus receives AWS service events automatically; your own are sent with <code>PutEvents</code>.",
      "Event-driven services talk over the network, so latency varies and data across services is often eventually consistent, which makes handling duplicates harder. That is the price for services that scale and fail independently."
    ],
    trap: "One function that handles every route and event (the Lambda monolith) works but is an anti-pattern. Workloads that need very low latency, such as real-time trading, are a poor fit for event-driven design.",
    docs: [
      ["Creating event-driven architectures with Lambda", "https://docs.aws.amazon.com/lambda/latest/dg/concepts-event-driven-architectures.html"],
      ["How Lambda handles errors and retries with asynchronous invocation", "https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-error-handling.html"],
      ["Amazon EventBridge event bus (default and Classic)", "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-bus.html"]
    ]
  },

  c7b: {
    k: [
      "A standard Lambda function runs for at most 15 minutes per invocation with 128 MB to 10,240 MB of memory. Lambda allocates CPU in proportion to memory, so more memory speeds up a CPU-bound function; a longer timeout does not.",
      "Reserved concurrency sets aside part of the account's concurrency for one function and also caps it, at no additional charge. Provisioned concurrency keeps execution environments initialized, which reduces cold starts and costs extra.",
      "HTTP APIs have minimal features at a lower price. Choose a REST API for API keys, per-client throttling, request validation, AWS WAF or a private endpoint. A WebSocket API keeps a connection open, so the backend can send messages to clients.",
      "API Gateway shields a backend: above the rate and burst limits callers get <code>429 Too Many Requests</code>, and stage caching answers repeated requests from a cache for a TTL (300 seconds by default, 3,600 at most) without calling the backend.",
      "Compute choice: Lambda for short event-driven code; Fargate to run containers without managing servers or clusters, for example jobs longer than 15 minutes; EC2 for control of the operating system. A function can also be a container image of up to 10 GB."
    ],
    trap: "A Lambda function times out after 15 minutes at most (Lambda Managed Instances allow up to 90 for asynchronous work). An edge-optimized REST endpoint routes requests through a CloudFront point of presence; a Regional endpoint is intended for clients in the same Region.",
    docs: [
      ["Lambda quotas", "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html"],
      ["Choose between REST APIs and HTTP APIs", "https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html"],
      ["Understanding Lambda function scaling", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html"]
    ]
  },

  c7c: {
    k: [
      "SQS decouples producer and consumer: the queue keeps messages (4 days by default, up to 14) until a consumer is ready, so a burst or a consumer outage loses nothing. A consumer receives a message, processes it and deletes it.",
      "Standard queues give at-least-once delivery and best-effort ordering at nearly unlimited throughput. FIFO queues keep strict order within a message group and introduce no duplicates; one group ID per order or account keeps each of them in sequence.",
      "SNS is publish/subscribe: a publisher sends a message to a topic and every subscription receives it (SQS, Lambda, HTTP(S), email, SMS, Firehose). A filter policy on a subscription lets through only the messages that match.",
      "Fan-out is one SNS topic with one SQS queue per consumer. Each queue holds its own copy until its consumer is ready, so services work at their own pace and a new one subscribes without any change to the publisher.",
      "Lambda reads a queue through an event source mapping, and its maximum concurrency setting caps how many invocations run at once, which protects a database behind the consumer. Ordered fan-out needs an SNS FIFO topic with SQS FIFO queues."
    ],
    trap: "Consumers that share one queue do not each see every message. Without a queue in between, SNS discards a message once its delivery retries are exhausted. A standard queue can deliver a message twice, so make consumers idempotent.",
    docs: [
      ["Amazon SQS standard queues", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html"],
      ["Fanout Amazon SNS notifications to Amazon SQS queues for asynchronous processing", "https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html"],
      ["Configuring scaling behavior for SQS event source mappings", "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html"]
    ]
  },

  l7a: {
    k: [
      "Every function has an execution role, an IAM role that grants it permission to use AWS services. Its logs reach CloudWatch Logs only if that role allows it, by default in a log group named <code>/aws/lambda/&lt;function-name&gt;</code>.",
      "The two settings that decide speed and cost are memory (128 MB to 10,240 MB, CPU grows with it) and timeout (3 seconds by default, 900 at most). A function that is cut off after 3 seconds has usually just hit the default timeout.",
      "The lab's scenario is the standard argument for Lambda over EC2: no servers to provision or maintain, and pay-per-use billing instead of paying for instances that wait for work."
    ],
    docs: [
      ["What is AWS Lambda?", "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"],
      ["Defining Lambda function permissions with an execution role", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html"],
      ["Configure Lambda function timeout", "https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html"]
    ]
  },

  l7b: {
    k: [
      "Subscribing a queue to a topic takes two things: the subscription itself and a queue policy that gives the topic <code>sqs:SendMessage</code> permission. Without the permission the subscription exists but nothing arrives in the queue.",
      "A received message is not removed: it stays in the queue, hidden for the visibility timeout (30 seconds by default). If the consumer does not delete it in time, it becomes visible again and another consumer can receive it.",
      "With raw message delivery turned off, the queue receives a JSON document with SNS metadata around your message; with it on, the subscriber gets the message as published.",
      "Stop the consumer and watch the queue fill: messages wait instead of being dropped. That backlog is what a fleet of workers scales on, as backlog per instance, rather than on CPU."
    ],
    docs: [
      ["Subscribing an Amazon SQS queue to an Amazon SNS topic", "https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html"],
      ["Amazon SQS visibility timeout", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html"],
      ["Scaling policy based on Amazon SQS", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html"]
    ]
  },

  l7c: {
    k: [
      "An HTTP API can call an AWS service with no Lambda function in between: a first-class integration such as <code>EventBridge-PutEvents</code> puts the request on an event bus. API Gateway needs an IAM role that allows that action.",
      "On a default or Classic event bus, a rule's event pattern is JSON that lists the attributes and values an event must have. An event can match several rules, and one that matches no rule causes no action at all, so a wrong pattern fails silently.",
      "EventBridge needs permission to invoke a target. For a Lambda function that is a resource-based policy allowing <code>events.amazonaws.com</code> to call <code>lambda:InvokeFunction</code>, or an IAM execution role set on the target.",
      "A WebSocket API keeps a persistent connection per client. API Gateway calls the <code>$connect</code> and <code>$disconnect</code> routes when a client joins or leaves, and the backend can send messages to connected clients."
    ],
    docs: [
      ["Create AWS service integrations for HTTP APIs in API Gateway", "https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services.html"],
      ["Using resource-based policies for Amazon EventBridge", "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html"],
      ["Overview of WebSocket APIs in API Gateway", "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html"]
    ]
  },

  l7d: {
    k: [
      "S3 sends event notifications to an SNS topic, an SQS queue, a Lambda function or EventBridge. For a topic or queue, its policy must give Amazon S3 permission to publish to it.",
      "Lambda polls the queue through an event source mapping and deletes a batch when the function succeeds. After an error the whole batch becomes visible again, unless <code>ReportBatchItemFailures</code> is on and the function returns the failed message IDs.",
      "A dead-letter queue belongs to the source queue: its redrive policy moves a message there once it has been received <code>maxReceiveCount</code> times without being deleted. Set that count high enough to allow retries.",
      "S3 to SNS to several queues is fan-out: each queue gets its own copy of every event. The function's execution role must be allowed to read its queue; <code>AWSLambdaSQSQueueExecutionRole</code> covers that."
    ],
    docs: [
      ["Event notification types and destinations (Amazon S3)", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-event-types-and-destinations.html"],
      ["Using Lambda with Amazon SQS", "https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html"],
      ["Using dead-letter queues in Amazon SQS", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html"]
    ]
  },

  l7e: {
    k: [
      "X-Ray receives segments from the services that handle a request and groups those of one request into a trace. From the traces it draws the trace map (the service map in the X-Ray console), where you see which service has errors or high latency.",
      "With active tracing on a Lambda function, Lambda creates the trace segments itself. To see the calls your code makes to other services, instrument the code, for example with X-Ray SDK subsegments.",
      "X-Ray samples: by default the SDK records the first request each second and five percent of any additional requests. A trace set is a representative sample, not a record of every request.",
      "Annotations are key-value pairs that X-Ray indexes, so you can filter traces by them; metadata is stored with the trace but not indexed."
    ],
    trap: "Slow requests through several microservices with no obvious culprit point to X-Ray. CloudWatch metrics and alarms show that something is wrong, logs show what one component wrote, and CloudTrail records who made which API call.",
    docs: [
      ["What is AWS X-Ray?", "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html"],
      ["AWS X-Ray concepts", "https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html"],
      ["Visualize Lambda function invocations using AWS X-Ray", "https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html"]
    ]
  },

  c7d: {
    k: [
      "A Cognito user pool is a user directory that signs users in, directly or through social and other identity providers, and issues JSON web tokens. An identity pool issues temporary AWS credentials, also to guests, so the app can call S3 or DynamoDB.",
      "Who may call a REST API method: IAM roles and policies, a Cognito user pool authorizer that checks the pool's tokens, or a Lambda authorizer that runs your own logic on a bearer token or request parameters and returns an IAM policy.",
      "A resource policy on the API allows or denies callers by AWS account, source IP range or VPC endpoint. A private REST API is callable only from within a VPC through an interface endpoint, isolated from the public internet.",
      "AWS WAF protects a REST API stage from common web exploits such as SQL injection and cross-site scripting. Usage plans with API keys throttle and set quotas per customer.",
      "HTTP APIs offer a JWT authorizer for OpenID Connect and OAuth 2.0 tokens, which also works with Cognito. With authorization caching on, API Gateway caches a Lambda authorizer's policy instead of invoking the function again."
    ],
    trap: "A user pool alone hands out no AWS credentials, and an identity pool alone has no sign-up or password reset. API keys identify a client for a usage plan: AWS says not to use them for authentication or authorization.",
    docs: [
      ["What is Amazon Cognito?", "https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html"],
      ["Control and manage access to REST APIs in API Gateway", "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-to-api.html"],
      ["Usage plans and API keys for REST APIs in API Gateway", "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html"]
    ]
  },

  c7e: {
    k: [
      "Two policies guard a function. The execution role says which AWS services and resources the function may use; keep it least privilege. The resource-based policy says which service or account may invoke the function.",
      "Lambda encrypts environment variables at rest with a KMS key, an AWS managed key by default or your customer managed key. For database credentials AWS recommends Secrets Manager instead, which also rotates secrets.",
      "By default a function has access to the public internet. Attached to a VPC it reaches only resources available in that VPC, so reaching the internet takes a NAT gateway. DynamoDB can be reached privately through a gateway endpoint.",
      "DynamoDB encrypts tables at rest, by default with an AWS owned key; choose a customer managed key for full control over the key. Point-in-time recovery keeps up to 35 days of per-second recovery points and always restores to a new table.",
      "CloudTrail logs Lambda and DynamoDB control plane calls by default; function invocations and item-level DynamoDB calls are data events you must turn on. GuardDuty Lambda Protection monitors the functions' network activity logs."
    ],
    trap: "Permission in a function's execution role to read a bucket does not let S3 invoke the function; that takes the resource-based policy. Encrypting an environment variable does not rotate the credential inside it.",
    docs: [
      ["Defining Lambda function permissions with an execution role", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html"],
      ["Securing Lambda environment variables", "https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars-encryption.html"],
      ["DynamoDB encryption at rest", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/EncryptionAtRest.html"]
    ]
  },

  c7f: {
    k: [
      "Step Functions runs a workflow as a state machine, so retries and error handling live outside your code. <code>Retry</code> with a backoff rate handles transient errors; <code>Catch</code> sends a failed step to a fallback state such as a compensation step.",
      "Standard workflows run up to one year with exactly-once execution and support the callback pattern (<code>.waitForTaskToken</code>), as for a human approval. Express workflows run up to five minutes for high-volume event processing and do not support it.",
      "Lambda sends function logs to CloudWatch Logs. Log data is kept indefinitely unless you set a retention period on the log group. A metric filter turns matching log events into a metric that an alarm can watch.",
      "X-Ray traces a request across services and draws a trace map that shows where errors occur and which connections have high latency. Logs tell you what one component did; a trace tells you where in the chain the time went.",
      "Putting it together: API Gateway is the front door (authorization, throttling), Lambda runs the logic, SQS buffers, SNS or EventBridge fans out, Step Functions coordinates multi-step flows and DynamoDB keeps state. One stated requirement picks each."
    ],
    trap: "A function that calls the next function, or sleeps while it waits, is the hand-written orchestration Step Functions replaces. A dead-letter queue between steps keeps failed messages; it runs no compensation and waits for no approval.",
    docs: [
      ["Choosing workflow type in Step Functions", "https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html"],
      ["Handling errors in Step Functions workflows", "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html"],
      ["Using the X-Ray trace map", "https://docs.aws.amazon.com/xray/latest/devguide/xray-console-servicemap.html"]
    ]
  }
});
