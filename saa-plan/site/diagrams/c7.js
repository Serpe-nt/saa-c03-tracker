// DATA ONLY: the diagram for lecture course 7 and its labs (format: site/diagram.js, rules: docs/diagrams.md).
window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.c7 = {
  title: "A serverless order service built from event-driven microservices",
  why: "An order must be answered at once, while billing, shipping and email can follow a moment later. If each service called the next one directly, one slow or failed service would hold up the others. Lambda and the other serverless services take the servers away. An event bus, a topic and queues let each service work at its own pace.",
  w: 22, h: 12.2,
  areas: [
    { id: "region", label: "AWS Region", x: 2.9, y: 0.2, w: 18.7, h: 11.7 },
    { id: "sync", label: "Request path: the caller waits", x: 3.2, y: 0.8, w: 13.5, h: 4.8, dash: true },
    { id: "async", label: "Event path: nobody waits", x: 3.2, y: 6.4, w: 18.1, h: 5.2, dash: true }
  ],
  nodes: [
    { id: "users", label: "App users", x: 0.2, y: 2.7, w: 2.2, h: 1.4 },
    { id: "cognito", label: "Cognito user pool", x: 3.7, y: 1.6, w: 3.4, h: 1.4 },
    { id: "apigw", label: "API Gateway", x: 3.7, y: 3.8, w: 3.4, h: 1.4 },
    { id: "fn", label: "Order function (Lambda)", x: 8.3, y: 3.8, w: 3.4, h: 1.4 },
    { id: "ddb", label: "DynamoDB orders table", x: 12.9, y: 3.8, w: 3.4, h: 1.4 },
    { id: "obs", label: "CloudWatch Logs and X-Ray", x: 17.5, y: 2.7, w: 3.4, h: 1.4 },
    { id: "sfn", label: "Step Functions workflow", x: 3.7, y: 7.2, w: 3.4, h: 1.4 },
    { id: "bus", label: "EventBridge bus", x: 8.3, y: 7.2, w: 3.4, h: 1.4 },
    { id: "sns", label: "SNS topic", x: 12.9, y: 7.2, w: 3.4, h: 1.4 },
    { id: "worker", label: "Worker function (Lambda)", x: 8.3, y: 9.8, w: 3.4, h: 1.4 },
    { id: "sqs", label: "One SQS queue per service", x: 12.9, y: 9.8, w: 3.4, h: 1.4 },
    { id: "dlq", label: "Dead-letter queue", x: 17.5, y: 9.8, w: 3.4, h: 1.4 }
  ],
  links: [
    ["users", "cognito"], ["users", "apigw"], ["apigw", "cognito", "checks token"],
    ["apigw", "fn", "invoke"], ["fn", "ddb", "write"], ["fn", "bus", "PutEvents"],
    ["bus", "sfn", "rule"], ["bus", "sns", "rule"], ["sns", "sqs", "fan-out"],
    ["sqs", "worker", "batches"], ["sqs", "dlq", "redrive"]
  ],
  parts: {
    cognito: {
      name: "Amazon Cognito user pool",
      why: "An app has to know who is calling before it runs any code for them. Building sign-up, sign-in and password resets yourself is work and risk. A Cognito user pool is a ready-made user directory that does it for you.",
      k: [
        ["Tokens", "Users sign in directly or through social and other identity providers. The pool issues JSON web tokens. To call the API, the app sends the user's ID or access token in a header, <code>Authorization</code> by default."],
        ["Checked at the door", "On a REST API, a Cognito user pool authorizer checks the pool's tokens before the request reaches the backend. An HTTP API uses a JWT authorizer, which also works with Cognito."],
        ["Identity pool", "A different part of Cognito. It issues temporary AWS credentials, also to guests, so the app itself can call S3 or DynamoDB."]
      ],
      trap: "A user pool alone hands out no AWS credentials, and an identity pool alone has no sign-up or password reset.",
      tags: ["Cognito", "API Gateway"]
    },
    apigw: {
      name: "Amazon API Gateway",
      why: "Clients need one front door to call the order service. Behind it, the backend must be shielded from callers who are not allowed in and from bursts that would overwhelm it. API Gateway is that managed front door.",
      k: [
        ["Who may call", "IAM, a Cognito user pool authorizer, or a Lambda authorizer that runs your own logic on a token and returns an IAM policy. A resource policy can allow or deny by account, IP range or VPC endpoint."],
        ["Throttling and caching", "Above the rate and burst limits, callers get <code>429 Too Many Requests</code>. Stage caching answers repeated requests from a cache without calling the backend."],
        ["REST or HTTP API", "HTTP APIs have minimal features at a lower price. Choose a REST API for API keys, per-client throttling, request validation, AWS WAF or a private endpoint."]
      ],
      trap: "API keys identify a client for a usage plan. AWS says not to use them for authentication or authorization: that is what the authorizers are for.",
      tags: ["API Gateway"]
    },
    fn: {
      name: "Order function (AWS Lambda)",
      why: "The order logic has to run somewhere. A server that waits for requests must be sized, patched and paid for even when idle. Lambda runs the code only when a request comes in, and AWS handles capacity, scaling and patching.",
      k: [
        ["Synchronous", "Here API Gateway invokes the function synchronously. It waits for the response and relays the result to the caller."],
        ["Limits", "A standard function runs for at most 15 minutes per invocation, with 128 MB to 10,240 MB of memory. CPU grows with memory."],
        ["Two policies", "The execution role says what the function may use, such as the table. The resource-based policy says which service or account may invoke it."]
      ],
      trap: "A role that lets the function read a bucket does not let S3 invoke the function: that takes the resource-based policy. One function for every route and event (the Lambda monolith) is an anti-pattern.",
      tags: ["Lambda"]
    },
    ddb: {
      name: "Amazon DynamoDB table",
      why: "Each order must be kept after the function that took it has finished. DynamoDB stores it, and like Lambda it is serverless: there are no servers to provision, patch or manage.",
      k: [
        ["Encryption", "Tables are encrypted at rest, by default with an AWS owned key. Choose a customer managed key for full control over the key."],
        ["Point-in-time recovery", "Keeps up to 35 days of per-second recovery points. A restore always creates a new table."],
        ["From a VPC", "A function attached to a VPC needs a NAT gateway to reach the internet. It can reach DynamoDB privately through a gateway endpoint instead."]
      ],
      trap: "CloudTrail logs DynamoDB control plane calls by default. Item-level reads and writes are data events that you must turn on.",
      tags: ["DynamoDB", "CloudTrail"]
    },
    bus: {
      name: "Amazon EventBridge event bus",
      why: "If the order function had to call every service that cares about a new order, it would change each time one is added. With an event bus it only announces what happened, and rules decide who reacts.",
      k: [
        ["PutEvents", "Your own events are sent with <code>PutEvents</code>. The default bus also receives events from AWS services automatically."],
        ["Rules and targets", "A rule matches events with a JSON event pattern and sends them to up to five targets, such as a Step Functions state machine or an SNS topic. This holds on the default bus and on a Custom Event Bus - Classic."],
        ["Permission", "EventBridge needs permission to invoke a target: a resource-based policy on the target, or an IAM execution role set on the target."]
      ],
      trap: "An event that matches no rule causes no action at all. So a wrong event pattern fails silently.",
      tags: ["EventBridge"]
    },
    sfn: {
      name: "AWS Step Functions workflow",
      why: "Some order steps take time, fail now and then, or wait for a person. Coded inside the functions, that retry and wait logic is scattered where nobody can follow it. Step Functions runs the flow as a state machine outside the code.",
      k: [
        ["Retry and Catch", "<code>Retry</code> with a backoff rate handles transient errors. <code>Catch</code> sends a failed step to a fallback state, such as a compensation step."],
        ["Standard workflow", "Runs up to one year with exactly-once execution. Its callback pattern (<code>.waitForTaskToken</code>) can wait for a human approval."],
        ["Express workflow", "Runs up to five minutes, for high-volume event processing. It does not support the callback pattern."]
      ],
      trap: "A function that calls the next function, or sleeps while it waits, is the hand-written orchestration that Step Functions replaces.",
      tags: ["Step Functions"]
    },
    sns: {
      name: "Amazon SNS topic",
      why: "Billing, shipping and email must each react to the same new order, at their own pace. SNS publishes a message to a topic, and every subscription receives it.",
      k: [
        ["Fan-out", "One topic with one SQS queue per consumer. Each queue holds its own copy until its consumer is ready. A new consumer subscribes without any change to the publisher."],
        ["Filter policy", "Set on a subscription, it lets through only the messages that match."],
        ["Queue policy", "A subscribed queue also needs a queue policy that gives the topic <code>sqs:SendMessage</code>. Without it the subscription exists but nothing arrives."]
      ],
      trap: "Without a queue in between, SNS discards a message once its delivery retries are exhausted. Fan-out that must keep the order of messages needs an SNS FIFO topic with SQS FIFO queues.",
      tags: ["SNS", "SQS"]
    },
    sqs: {
      name: "Amazon SQS queue",
      why: "A consumer that is busy or down cannot take a message at the moment it is sent. The queue keeps the message until the consumer is ready, so a burst or an outage loses nothing.",
      k: [
        ["Retention", "A message waits 4 days by default, up to 14. A consumer receives it, processes it and deletes it."],
        ["Visibility timeout", "A received message stays in the queue, hidden for the visibility timeout (30 seconds by default). If it is not deleted in time, another consumer can receive it."],
        ["Standard or FIFO", "Standard queues deliver at least once, with best-effort ordering. FIFO queues keep strict order within a message group and introduce no duplicates."]
      ],
      trap: "Consumers that share one queue do not each see every message. A standard queue can deliver a message twice, so make consumers idempotent.",
      tags: ["SQS"]
    },
    worker: {
      name: "Worker function (AWS Lambda)",
      why: "Someone has to take the messages off the queue, and a server that polls around the clock waits most of the time. An event source mapping makes Lambda poll the queue and invoke the function with batches.",
      k: [
        ["Batch result", "Lambda deletes a batch when the function succeeds. After an error the whole batch becomes visible again, unless <code>ReportBatchItemFailures</code> is on and the function returns the failed message IDs."],
        ["Maximum concurrency", "Caps how many invocations the event source mapping runs at once. That protects a database behind the consumer."],
        ["Execution role", "Must allow the function to read its queue. <code>AWSLambdaSQSQueueExecutionRole</code> covers that."]
      ],
      tags: ["Lambda", "SQS"]
    },
    dlq: {
      name: "Dead-letter queue",
      why: "A message that fails every time comes back again and again and is never handled. A dead-letter queue sets it aside, so you can find out why its processing did not succeed.",
      k: [
        ["Redrive policy", "Set on the source queue. It moves a message to the dead-letter queue once it has been received <code>maxReceiveCount</code> times without being deleted."],
        ["The count", "Set <code>maxReceiveCount</code> high enough to allow retries. At 1, a single failed receive moves the message."],
        ["Asynchronous Lambda", "For events pushed to a function asynchronously, Lambda retries two more times after an error. An on-failure destination or a dead-letter queue keeps events that still fail."]
      ],
      trap: "A dead-letter queue only keeps failed messages. It runs no compensation and waits for no approval: that is a job for Step Functions.",
      tags: ["SQS", "Lambda"]
    },
    obs: {
      name: "CloudWatch Logs and AWS X-Ray",
      why: "One order passes through several services, and each keeps its own logs. When it is slow, no single log shows where the time went. CloudWatch Logs collects what each part wrote. X-Ray follows one request across all of them.",
      k: [
        ["CloudWatch Logs", "Lambda sends function logs there. They are kept indefinitely unless you set a retention period. A metric filter turns matching log events into a metric an alarm can watch."],
        ["X-Ray trace map", "X-Ray groups the segments of one request into a trace and draws a trace map. It shows which service has errors or high latency."],
        ["Active tracing", "Turned on for a function, Lambda creates the trace segments itself. To see the calls your code makes to other services, instrument the code."]
      ],
      trap: "Slow requests with no obvious culprit point to X-Ray. Metrics and alarms show that something is wrong, logs show what one part wrote, and CloudTrail records who made which API call.",
      tags: ["CloudWatch", "CloudTrail"]
    }
  }
};
