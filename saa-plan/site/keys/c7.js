// Key points per plan step for the course "Designing a Serverless Architecture with Event-Driven Microservices" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c7a: {
    head: "Code that runs only when something happens",
    why: "A photo app runs a server around the clock to make thumbnails. Most hours it waits, and on launch day it is swamped. The upload service also calls the thumbnail service directly, so when one is down the other fails too. Work should run only when something happens, and services should not depend on each other being up.",
    idea: "Serverless hands the servers to AWS: your code runs when an event arrives (Day 1 met Lambda). Event-driven design is the matching style: services announce what happened and others react, instead of calling each other directly.",
    k: [
      ["When serverless fits", "Short, event-driven work with unpredictable traffic and a wish for the least operational overhead. Lambda manages capacity provisioning, scaling and patching, and you pay only for what you use."],
      ["Push or pull", "Push: a service such as S3 or API Gateway invokes the function directly. Pull: an event source mapping makes Lambda fetch from a queue or stream (SQS, DynamoDB Streams) and invoke the function with batches."],
      ["Waiting or not", "A synchronous caller waits for the response. An asynchronous invocation is queued and Lambda answers at once. After a function error Lambda retries two more times. An on-failure destination or a dead-letter queue keeps events that still fail."],
      ["EventBridge routes events by rules", "The default bus receives AWS service events automatically, and your own events are sent with <code>PutEvents</code>. On it, and on a Custom Event Bus - Classic, a rule matches events with a JSON pattern and sends them to up to five targets."],
      ["The price of event-driven", "Services talk over the network, so latency varies. Data across services is often eventually consistent, which makes handling duplicates harder. That is the price for services that scale and fail independently."]
    ],
    trap: "One function that handles every route and event (the Lambda monolith) works but is an anti-pattern. Workloads that need very low latency, such as real-time trading, are a poor fit for event-driven design.",
    q: {
      q: "Uploads to a bucket invoke a function asynchronously. For some corrupt files the function keeps failing, and the team must not lose those events. What do they add?",
      o: [
        "An on-failure destination or a dead-letter queue for the function",
        "Nothing, because Lambda retries a failed event until it succeeds",
        "A longer timeout, so that no invocation of the function fails",
        "An event source mapping that pulls the uploads from the bucket"
      ],
      a: [0],
      x: [
        "Right. After a function error Lambda retries two more times. An on-failure destination or a dead-letter queue keeps the events that still fail.",
        "Lambda retries two more times, not forever. Without a destination or a dead-letter queue, an event that still fails is not kept.",
        "A corrupt file fails however long the function may run. Those events still need somewhere to go.",
        "Event source mappings pull from queues and streams such as SQS. S3 pushes its events to the function."
      ],
      dom: 2, tags: ["Lambda"], doc: "lambda"
    },
    docs: [
      ["Creating event-driven architectures with Lambda", "https://docs.aws.amazon.com/lambda/latest/dg/concepts-event-driven-architectures.html"],
      ["How Lambda handles errors and retries with asynchronous invocation", "https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-error-handling.html"],
      ["Amazon EventBridge event bus (default and Classic)", "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-bus.html"]
    ]
  },

  c7b: {
    head: "Running code without servers, and a managed front door for it",
    why: "A startup's API runs on two servers. On quiet nights they idle, and when a TV ad airs they are swamped and requests time out. The team spends more time patching and scaling than writing code. The code needs to run without servers to manage, behind a front door that scales and shields it from overload.",
    idea: "AWS Lambda runs the code with no servers to manage. Amazon API Gateway is the managed front door that clients call. The limits of each tell you when a container or an instance fits better.",
    k: [
      ["Memory buys CPU", "A standard function runs for at most 15 minutes per invocation, with 128 MB to 10,240 MB of memory. Lambda allocates CPU in proportion to memory, so more memory speeds up a CPU-bound function and a longer timeout does not."],
      ["Reserved or provisioned concurrency", "Reserved concurrency sets aside part of the account's concurrency for one function and also caps it, at no additional charge. Provisioned concurrency keeps execution environments initialized to reduce cold starts, and it costs extra."],
      ["HTTP, REST or WebSocket API", "HTTP APIs have minimal features at a lower price. Choose a REST API for API keys, per-client throttling, request validation, AWS WAF or a private endpoint. A WebSocket API keeps a connection open, so the backend can send messages to clients."],
      ["Throttling and stage caching", "Both shield the backend. Above the rate and burst limits, callers get <code>429 Too Many Requests</code>. Stage caching answers repeated requests from a cache without calling the backend, for a TTL of 300 seconds by default and 3,600 at most."],
      ["Lambda, Fargate or EC2", "Lambda for short event-driven code. Fargate to run containers without managing servers or clusters, for example jobs longer than 15 minutes. EC2 for control of the operating system. A function can also be a container image of up to 10 GB."]
    ],
    trap: "A longer timeout does not speed up a CPU-bound function: more memory does, because CPU grows with it. And a job that runs longer than 15 minutes does not belong in a standard function at all: that points to Fargate.",
    q: {
      q: "A reporting function sometimes uses up so much of the account's concurrency that the checkout function is throttled. Checkout must always have capacity, at no additional charge. What do you set?",
      o: [
        "Reserved concurrency on the checkout function",
        "Provisioned concurrency on the checkout function",
        "A longer timeout on the reporting function",
        "Stage caching on the API in front of checkout"
      ],
      a: [0],
      x: [
        "Right. Reserved concurrency sets aside part of the account's concurrency for one function, at no additional charge.",
        "Provisioned concurrency keeps environments initialized to cut cold starts, and it costs extra.",
        "A timeout limits how long one invocation may run. It does not stop the reporting function from using up concurrency.",
        "Caching answers repeated requests. Checkout requests are not repeats, and the function still needs concurrency."
      ],
      dom: 2, tags: ["Lambda"], doc: "lambda"
    },
    docs: [
      ["Lambda quotas", "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html"],
      ["Choose between REST APIs and HTTP APIs", "https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html"],
      ["Understanding Lambda function scaling", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html"]
    ]
  },

  c7c: {
    head: "Decoupling services with queues and topics",
    why: "An order service calls the invoice service directly. During a sale, invoicing slows down, the order service waits on every call, and customers see checkout errors. When another team wants the order events too, the order code has to change again. A sender should hand off its message and move on, and new receivers should join without changing it.",
    idea: "A messaging service in between does that. Amazon SQS is a queue that a consumer works through at its own pace. Amazon SNS is a topic that gives every subscriber its own copy.",
    k: [
      ["A queue holds the work", "The queue keeps messages until a consumer is ready: 4 days by default, up to 14. So a burst or a consumer outage loses nothing. A consumer receives a message, processes it and deletes it."],
      ["Standard or FIFO", "Standard queues give at-least-once delivery and best-effort ordering at nearly unlimited throughput. FIFO queues keep strict order within a message group and introduce no duplicates. One group ID per order or account keeps each in sequence."],
      ["A topic gives everyone a copy", "A publisher sends a message to a topic, and every subscription receives it (SQS, Lambda, HTTP(S), email, SMS, Firehose). A filter policy on a subscription lets through only the messages that match."],
      ["Fan-out: one topic, a queue each", "One SNS topic with one SQS queue per consumer. Each queue holds its own copy until its consumer is ready, and a new consumer subscribes without any change to the publisher. Ordered fan-out needs an SNS FIFO topic and SQS FIFO queues."],
      ["Lambda as consumer", "Lambda reads a queue through an event source mapping. Its maximum concurrency setting caps how many invocations run at once, which protects a database behind the consumer."]
    ],
    trap: "Consumers that share one queue do not each see every message. SNS discards a message once its delivery retries are exhausted, unless the subscription has a dead-letter queue. A standard queue can deliver a message twice, so make consumers idempotent.",
    q: {
      q: "A function that reads an SQS queue writes each order to a database. During bursts, so many copies of the function run at once that the database runs out of connections. What protects it?",
      o: [
        "Set maximum concurrency on the event source mapping",
        "Switch the queue from standard to FIFO",
        "Subscribe the queue to an SNS topic",
        "Shorten how long the queue keeps messages"
      ],
      a: [0],
      x: [
        "Right. Maximum concurrency on the event source mapping caps how many invocations run at once. The rest of the burst waits in the queue.",
        "FIFO keeps order within a message group. It is not the setting that caps the function's invocations.",
        "A topic gives subscribers copies of messages. It does not slow down the consumer of this queue.",
        "Shorter retention would only lose messages during the burst. It does not limit the function."
      ],
      dom: 2, tags: ["SQS"], doc: "sqs"
    },
    docs: [
      ["Amazon SQS standard queues", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html"],
      ["Fanout Amazon SNS notifications to Amazon SQS queues for asynchronous processing", "https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html"],
      ["Configuring scaling behavior for SQS event source mappings", "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html"]
    ]
  },

  l7a: {
    head: "Build a function: its role, its memory and its timeout",
    why: "A team writes a small function that resizes images. It stops after exactly 3 seconds every time, and its logs are nowhere to be found. Even without servers, a function needs a few things from you. It needs permission to use AWS services, and settings for how big and how long it may run.",
    idea: "Building one by hand shows them. An execution role says what the function may do, and the memory and timeout settings decide its speed and cost.",
    k: [
      ["The execution role", "Every function has one, and it is an IAM role that grants the function permission to use AWS services. Its logs reach CloudWatch Logs only if that role allows it, by default in the log group <code>/aws/lambda/&lt;function-name&gt;</code>."],
      ["Memory and timeout", "They decide speed and cost. Memory is 128 MB to 10,240 MB, and CPU grows with it. Timeout is 3 seconds by default and 900 at most. A function that is cut off after 3 seconds has usually just hit the default timeout."],
      ["Why Lambda and not a server", "The lab's scenario is the standard argument for Lambda. There are no servers to provision or maintain. Billing is pay-per-use, instead of paying for instances that wait for work."]
    ],
    q: {
      q: "A new function that resizes images is stopped after exactly 3 seconds on every run, though its code has no error. What do you change?",
      o: [
        "Raise the function's timeout above the default of 3 seconds",
        "Give the execution role permission to write to CloudWatch Logs",
        "Move the code onto an EC2 instance, where nothing times out",
        "Lower the function's memory so that it starts faster"
      ],
      a: [0],
      x: [
        "Right. The timeout is 3 seconds by default and can go up to 900. A function cut off at exactly 3 seconds has usually hit that default.",
        "That lets the logs arrive, which helps you see the problem, but the function would still be stopped after 3 seconds.",
        "A server would have to be provisioned and maintained, and paid for while it waits. A setting fixes this.",
        "Less memory also means less CPU, so the work would take even longer."
      ],
      dom: 3, tags: ["Lambda"], doc: "lambda"
    },
    docs: [
      ["What is AWS Lambda?", "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"],
      ["Defining Lambda function permissions with an execution role", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html"],
      ["Configure Lambda function timeout", "https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html"]
    ]
  },

  l7b: {
    head: "Wire a topic to a queue, and watch the queue hold the work",
    why: "You subscribe a queue to a topic and publish a message, and the queue stays empty. Later, once messages arrive, a slow consumer sees the same message twice. A buffer between producer and consumer works only when the topic may write to the queue. Messages must also leave the queue at the right moment.",
    idea: "Wiring them by hand shows both. The queue policy lets the topic send, and the visibility timeout decides when a message can be received again.",
    k: [
      ["Subscription plus queue policy", "Subscribing a queue to a topic takes the subscription itself and a queue policy that gives the topic <code>sqs:SendMessage</code> permission. Without the permission the subscription exists, but nothing arrives in the queue."],
      ["Visibility timeout", "A received message is not removed. It stays in the queue, hidden for the visibility timeout (30 seconds by default). If the consumer does not delete it in time, it becomes visible again and another consumer can receive it."],
      ["Raw message delivery", "It decides what the queue receives. Turned off, the queue gets a JSON document with SNS metadata around your message. Turned on, the subscriber gets the message as published."],
      ["Scale workers on the backlog", "Stop the consumer and watch the queue fill: messages wait instead of being dropped. That backlog is what a fleet of workers scales on, as backlog per instance, rather than on CPU."]
    ],
    q: {
      q: "An SQS queue is subscribed to an SNS topic, and the subscription shows in both consoles. Messages published to the topic never arrive in the queue. What is most likely missing?",
      o: [
        "A queue policy granting the topic <code>sqs:SendMessage</code>",
        "Raw message delivery turned on for the queue's subscription",
        "A longer visibility timeout on the subscribed queue",
        "A consumer that is running and reading from the queue"
      ],
      a: [0],
      x: [
        "Right. Without the queue policy's permission the subscription exists, but nothing arrives in the queue.",
        "Raw message delivery only changes what the queue receives, the message with or without SNS metadata.",
        "The visibility timeout matters once a message is received. Here nothing reaches the queue at all.",
        "A queue keeps messages whether or not a consumer runs. With no consumer, they would pile up rather than vanish."
      ],
      dom: 1, tags: ["SQS"], doc: "sqs"
    },
    docs: [
      ["Subscribing an Amazon SQS queue to an Amazon SNS topic", "https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html"],
      ["Amazon SQS visibility timeout", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html"],
      ["Scaling policy based on Amazon SQS", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html"]
    ]
  },

  l7c: {
    head: "Chain an API, an event bus and functions, link by link",
    why: "An order API calls the payment, stock and email services one after another. Adding a loyalty service means changing the API code, and when email is down, orders fail. A sender should only announce what happened, and let rules decide who reacts.",
    idea: "With Amazon EventBridge in the middle, the API puts an event on a bus and rules send it to the right targets. Building the chain by hand shows what each link needs: a pattern that matches, and permission to call the next service.",
    k: [
      ["An HTTP API calls a service directly", "An HTTP API can call an AWS service with no Lambda function in between. A first-class integration such as <code>EventBridge-PutEvents</code> puts the request on an event bus. API Gateway needs an IAM role that allows that action."],
      ["A wrong pattern fails silently", "An event pattern is JSON that lists the attributes and values an event must have (default and Classic buses). An event can match several rules. One that matches no rule causes no action at all."],
      ["Permission to invoke the target", "For a Lambda function that is a resource-based policy allowing <code>events.amazonaws.com</code> to call <code>lambda:InvokeFunction</code>, or an IAM execution role set on the target."],
      ["WebSocket API talks back", "For a backend that must send messages to connected clients. It keeps a persistent connection per client. API Gateway calls the <code>$connect</code> and <code>$disconnect</code> routes when a client joins or leaves."]
    ],
    q: {
      q: "An EventBridge rule has a correct event pattern for new orders, and its target is a Lambda function. Orders arrive on the bus, but the function never runs. What is most likely missing?",
      o: [
        "Permission for EventBridge to invoke the function",
        "A second rule with the same event pattern",
        "A WebSocket API in front of the event bus",
        "A <code>$connect</code> route on the HTTP API"
      ],
      a: [0],
      x: [
        "Right. EventBridge needs permission to invoke a target: a resource-based policy that lets <code>events.amazonaws.com</code> call <code>lambda:InvokeFunction</code>, or an execution role on the target.",
        "An event can match several rules, but a second rule would run into the same missing permission.",
        "A WebSocket API keeps connections open to clients. It has nothing to do with a rule invoking a function.",
        "<code>$connect</code> belongs to WebSocket APIs, when a client joins. It does not let a rule call a function."
      ],
      dom: 1, tags: ["EventBridge"], doc: "eventbridge"
    },
    docs: [
      ["Create AWS service integrations for HTTP APIs in API Gateway", "https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services.html"],
      ["Using resource-based policies for Amazon EventBridge", "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html"],
      ["Overview of WebSocket APIs in API Gateway", "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html"]
    ]
  },

  l7d: {
    head: "From an S3 upload to a function, without losing an event",
    why: "Uploads to a bucket must start a thumbnail job and a virus scan. One day the scanner is broken for an hour, and the uploads from that hour are never scanned. Each event has to wait somewhere safe until it is processed, and end up somewhere you can see when processing keeps failing.",
    idea: "The lab builds the chain from bucket to topic to queues to a function, a fan-out as on Day 14. It shows where each event waits, who may pass it on, and where it ends up when processing keeps failing.",
    k: [
      ["S3 event notifications", "S3 sends them to an SNS topic, an SQS queue, a Lambda function or EventBridge. For a topic or a queue, its policy must give Amazon S3 permission to publish to it."],
      ["Lambda polls the queue", "It polls through an event source mapping and deletes a batch when the function succeeds. After an error the whole batch becomes visible again, unless <code>ReportBatchItemFailures</code> is on and the function returns the failed message IDs."],
      ["A dead-letter queue catches repeats", "It belongs to the source queue. Its redrive policy moves a message there once it has been received <code>maxReceiveCount</code> times without being deleted. Set that count high enough to allow retries."],
      ["A role to read the queue", "The function's execution role must be allowed to read its queue. <code>AWSLambdaSQSQueueExecutionRole</code> covers that."]
    ],
    q: {
      q: "New uploads to a bucket should send event notifications to an SNS topic, but no events ever reach the topic. What does the topic need?",
      o: [
        "A topic policy that lets Amazon S3 publish to it",
        "A dead-letter queue with a high <code>maxReceiveCount</code>",
        "<code>ReportBatchItemFailures</code> turned on for the topic",
        "The <code>AWSLambdaSQSQueueExecutionRole</code> policy on the topic"
      ],
      a: [0],
      x: [
        "Right. For a topic or a queue as the destination, its policy must give Amazon S3 permission to publish to it.",
        "A dead-letter queue belongs to a source queue and catches messages that keep failing. It does not let S3 publish.",
        "That setting belongs to Lambda's event source mapping on a queue, where it returns the failed message IDs of a batch.",
        "That policy lets a function's execution role read its queue. It gives S3 no permission on the topic."
      ],
      dom: 1, tags: ["SNS"], doc: "sns"
    },
    docs: [
      ["Event notification types and destinations (Amazon S3)", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-event-types-and-destinations.html"],
      ["Using Lambda with Amazon SQS", "https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html"],
      ["Using dead-letter queues in Amazon SQS", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html"]
    ]
  },

  l7e: {
    head: "Follow one request across services with X-Ray",
    why: "Checkout takes eight seconds, yet every service's logs look normal and every dashboard is green. Each service sees only its own part of the request. You need to see one request's whole path, with the time each step took.",
    idea: "AWS X-Ray follows a request across services and draws the path, so the slow or failing link stands out. The lab uses it with CloudWatch on a set of microservices.",
    k: [
      ["Segments, traces, trace map", "X-Ray receives segments from the services that handle a request and groups those of one request into a trace. From the traces it draws the trace map (the service map in the X-Ray console), where errors and high latency show."],
      ["Active tracing", "With active tracing on a Lambda function, Lambda creates the trace segments itself. To see the calls your code makes to other services, instrument the code, for example with X-Ray SDK subsegments."],
      ["X-Ray samples", "By default the SDK records the first request each second and five percent of any additional requests. A set of traces is a representative sample, not a record of every request."],
      ["Annotations or metadata", "Annotations are key-value pairs that X-Ray indexes, so you can filter traces by them. Metadata is stored with the trace but not indexed."]
    ],
    trap: "Slow requests through several microservices with no obvious culprit point to X-Ray. CloudWatch metrics and alarms show that something is wrong. Logs show what one component wrote. CloudTrail records who made which API call.",
    q: {
      q: "Support wants to pull up the traces of one customer's slow requests by searching for that customer's ID. How should the code record the ID in its traces?",
      o: [
        "As an annotation, which X-Ray indexes for filtering",
        "As metadata, which is stored with the trace",
        "As a log line in CloudWatch Logs",
        "As a CloudTrail data event"
      ],
      a: [0],
      x: [
        "Right. Annotations are key-value pairs that X-Ray indexes, so traces can be filtered by them.",
        "Metadata is stored with the trace but not indexed, so you cannot filter traces by it.",
        "A log line shows what one component wrote. It does not let X-Ray filter traces.",
        "CloudTrail records who made which API call. It is not where a request's trace data lives."
      ],
      dom: 3, tags: ["CloudWatch"], doc: "xray"
    },
    docs: [
      ["What is AWS X-Ray?", "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html"],
      ["AWS X-Ray concepts", "https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html"],
      ["Visualize Lambda function invocations using AWS X-Ray", "https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html"]
    ]
  },

  c7d: {
    head: "Who may call your API: Cognito and API Gateway's checks",
    why: "A fitness app's API is public, and anyone who finds its address can read other people's workouts. The team starts writing its own login system, with password resets and token checks. Before the code runs, something must establish who the caller is and what they may do, without building a user directory yourself.",
    idea: "Amazon Cognito signs users in and can hand the app temporary AWS credentials. API Gateway checks each request, with IAM, a Cognito authorizer or your own Lambda authorizer, before it reaches the backend.",
    k: [
      ["User pools and identity pools", "A user pool is a user directory: it signs users in, directly or through social and other identity providers, and issues JSON web tokens. An identity pool issues temporary AWS credentials, also to guests, so the app can call S3 or DynamoDB."],
      ["Who may call a REST API method", "IAM roles and policies. A Cognito user pool authorizer that checks the pool's tokens. Or a Lambda authorizer that runs your own logic on a bearer token or request parameters, and returns an IAM policy."],
      ["Resource policy and private API", "A resource policy on the API allows or denies callers by AWS account, source IP range or VPC endpoint. A private REST API is callable only from within a VPC through an interface endpoint, isolated from the public internet."],
      ["AWS WAF and usage plans", "AWS WAF protects a REST API stage from common web exploits such as SQL injection and cross-site scripting. Usage plans with API keys throttle and set quotas per customer."],
      ["HTTP APIs and authorizer caching", "HTTP APIs offer a JWT authorizer for OpenID Connect and OAuth 2.0 tokens, which also works with Cognito. With authorization caching on, API Gateway caches a Lambda authorizer's policy instead of invoking the function again."]
    ],
    trap: "A user pool alone hands out no AWS credentials, and an identity pool alone has no sign-up or password reset. API keys identify a client for a usage plan: AWS says not to use them for authentication or authorization.",
    q: {
      q: "A REST API must accept only callers that carry a token from the company's own older login service, which is not an OpenID Connect provider. How does API Gateway check the token?",
      o: [
        "With a Lambda authorizer that checks the token and returns an IAM policy",
        "With an API key in a usage plan for each caller",
        "With a resource policy that allows the login service's IP range",
        "With an AWS WAF managed rule group on the stage"
      ],
      a: [0],
      x: [
        "Right. A Lambda authorizer runs your own logic on a bearer token and returns an IAM policy that allows or denies the call.",
        "API keys identify a client for a usage plan. AWS says not to use them for authentication or authorization.",
        "A resource policy filters by account, IP range or VPC endpoint. It cannot read what a caller's token says.",
        "AWS WAF protects against common web exploits. It does not decide who a caller is."
      ],
      dom: 1, tags: ["API Gateway"], doc: "apigw"
    },
    docs: [
      ["What is Amazon Cognito?", "https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html"],
      ["Control and manage access to REST APIs in API Gateway", "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-to-api.html"],
      ["Usage plans and API keys for REST APIs in API Gateway", "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html"]
    ]
  },

  c7e: {
    head: "The security work that serverless leaves with you",
    why: "A team moves to Lambda and DynamoDB and decides that security is now AWS's job. Then an audit finds a function allowed to delete every table, a database password sitting in an environment variable, and no record of who changed what. Serverless takes the servers away, not the security work.",
    idea: "What remains is yours: what a function may do, who may start it, where its secrets live, how its data is protected and what gets recorded. Each has its own control.",
    k: [
      ["Two policies on a function", "The execution role says which AWS services and resources the function may use: keep it least privilege. The resource-based policy says which service or account may invoke the function."],
      ["Secrets belong in Secrets Manager", "Lambda encrypts environment variables at rest with a KMS key, an AWS managed key by default or your customer managed key. For database credentials AWS recommends Secrets Manager instead, which also rotates secrets."],
      ["A function in a VPC", "By default a function has access to the public internet. Attached to a VPC it reaches only resources available in that VPC, so reaching the internet takes a NAT gateway. DynamoDB can be reached privately through a gateway endpoint."],
      ["Protecting DynamoDB data", "DynamoDB encrypts tables at rest, by default with an AWS owned key. Choose a customer managed key for full control. Point-in-time recovery keeps up to 35 days of per-second recovery points and always restores to a new table."],
      ["What CloudTrail records", "It logs Lambda and DynamoDB control plane calls by default. Function invocations and item-level DynamoDB calls are data events you must turn on. GuardDuty Lambda Protection monitors the functions' network activity logs."]
    ],
    trap: "Permission in a function's execution role to read a bucket does not let S3 invoke the function. That takes the resource-based policy. Encrypting an environment variable does not rotate the credential inside it.",
    q: {
      q: "A function worked until it was attached to a VPC to reach a private database. Now its calls to an outside payment service on the internet time out. What gives it that path again?",
      o: [
        "A route from the function's private subnets to a NAT gateway",
        "A gateway endpoint for the payment service in the VPC",
        "A longer timeout on the function",
        "A resource-based policy that lets the payment service invoke the function"
      ],
      a: [0],
      x: [
        "Right. Attached to a VPC, a function reaches only resources available in that VPC, so reaching the internet takes a NAT gateway.",
        "Gateway endpoints exist only for S3 and DynamoDB, not for an outside service.",
        "The calls time out because there is no path to the internet. More time does not create one.",
        "A resource-based policy decides who may invoke the function. Here the function needs to call out."
      ],
      dom: 2, tags: ["Lambda"], doc: "lambda"
    },
    docs: [
      ["Defining Lambda function permissions with an execution role", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html"],
      ["Securing Lambda environment variables", "https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars-encryption.html"],
      ["DynamoDB encryption at rest", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/EncryptionAtRest.html"]
    ]
  },

  c7f: {
    head: "Coordinating multi-step work, and seeing what each part did",
    why: "An order flow charges the card, reserves stock and books a courier, each function calling the next. When the courier service is down, a function sleeps and retries in a loop. The card is already charged, and nobody can see where the order is stuck. The steps, their retries and their failure paths should live in one place you can see.",
    idea: "AWS Step Functions runs the flow as a state machine, with retries and error handling outside your code. CloudWatch Logs (Day 6) and AWS X-Ray then show what each part did and where the time went.",
    k: [
      ["Retry and Catch outside the code", "<code>Retry</code> with a backoff rate handles transient errors. <code>Catch</code> sends a failed step to a fallback state, such as a compensation step that undoes earlier work."],
      ["Standard workflows for long flows", "They run up to one year with exactly-once execution, and support the callback pattern (<code>.waitForTaskToken</code>), as for a human approval."],
      ["Express workflows for volume", "For high-volume event processing. They run up to five minutes and do not support the callback pattern."],
      ["X-Ray shows where the time went", "It traces a request across services and draws a trace map of errors and slow connections. Logs tell you what one component did. A trace tells you where in the chain the time went."],
      ["Putting it together", "API Gateway is the front door (authorization, throttling). Lambda runs the logic. SQS buffers. SNS or EventBridge fans out. Step Functions coordinates multi-step flows. DynamoDB keeps state. One stated requirement picks each."]
    ],
    trap: "A function that calls the next function, or sleeps while it waits, is the hand-written orchestration Step Functions replaces. A dead-letter queue between steps keeps failed messages. It runs no compensation and waits for no approval.",
    q: {
      q: "In an order workflow, booking the courier can fail after the card has already been charged. The customer must then get a refund automatically. How do you build that in Step Functions?",
      o: [
        "A <code>Catch</code> on the courier step that goes to a refund state",
        "A <code>Retry</code> with a backoff rate on the courier step, and nothing more",
        "A dead-letter queue between the payment step and the courier step",
        "An Express workflow, which undoes earlier steps when one fails"
      ],
      a: [0],
      x: [
        "Right. <code>Catch</code> sends a failed step to a fallback state, such as a compensation step that refunds the charge.",
        "<code>Retry</code> handles transient errors. When the retries run out, something still has to refund the charge.",
        "A dead-letter queue keeps failed messages. It runs no compensation.",
        "Express workflows are for high-volume event processing. No workflow type undoes earlier steps by itself."
      ],
      dom: 2, tags: ["Step Functions"], doc: "stepfunctions"
    },
    docs: [
      ["Choosing workflow type in Step Functions", "https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html"],
      ["Handling errors in Step Functions workflows", "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html"],
      ["Using the X-Ray trace map", "https://docs.aws.amazon.com/xray/latest/devguide/xray-console-servicemap.html"]
    ]
  }
});
