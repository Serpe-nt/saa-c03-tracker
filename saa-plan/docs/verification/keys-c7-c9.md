# Key points for c7a–c7f, l7a–l7e, c8a–c8c, l8a–l8c, c9a: sources

Written on 2026-10-12/13 for the 21-day plan. Files: `site/keys/c7.js`, `site/keys/c8.js`, `site/keys/c9.js` (18 entries, 91 key points and traps).

## How it was checked

- **Writer pass.** About 190 pages on docs.aws.amazon.com and aws.amazon.com were fetched with redirects not followed (a redirect counted as a wrong URL), stripped to text and searched for the words of each claim. Sentences reused from the retired steps `d9b1`, `d9b2`, `d10b2`, `d6w1` and `d10e6` (checked twice on 2026-10-12) were searched again where their wording changed.
- **Second read.** Two sub-agents that had not seen the writer's sources each fetched AWS pages themselves and looked up every sentence: one for `c7.js`, one for `c8.js` and `c9.js`. Result: no sentence wrong, 10 partly supported. All 10 were reworded to what the page says, or kept and listed under "Inferences" below. Seven link titles were corrected to the page titles.
- **Labs.** The eight lab description pages on skillbuilder.aws are public and were read in a browser (description, objectives, services). The lab points are about the services and objectives named there; no point claims what a lab step looks like. The lecture videos were not opened: lecture points follow the lesson titles in plan.js.
- **Checks.** `node --check` on the three files; `node --test` (41 of 42 pass; the remaining one lists steps of other sessions and none of these 18 ids); `node tools/links.mjs` (317 links, 0 broken).

What this was: reads by AI agents, not a review by a human AWS expert.

## Changed by the second read

| Entry | Was | Now | Why |
|---|---|---|---|
| c7a k4 | "An EventBridge event bus is a router: a rule matches…" | names the default bus and Custom Event Bus - Classic | EventBridge now has a new "Custom Event Bus" that routes to subscribers; rules and five targets describe the default and Classic buses |
| c7b trap | "Lambda is wrong for a single run longer than 15 minutes" | 15 minutes at most, Lambda Managed Instances up to 90 for asynchronous work | Lambda quotas page |
| c7b trap | "served directly by a Regional endpoint" | "a Regional endpoint is intended for clients in the same Region" | page wording |
| l7c k2 | no bus type | "On a default or Classic event bus" | as c7a k4 |
| l7c k3 | resource-based policy as the only way | adds "or an IAM execution role set on the target" | eb-use-resource-based.html |
| l7e k1 | "(formerly service map)" | "(the service map in the X-Ray console)" | the page says the two maps are combined into the trace map; the X-Ray console still says Service map |
| l7e k2 | "appear only when you add subsegments" | "instrument the code, for example with X-Ray SDK subsegments" | the page says "can" |
| c8a trap | "An SQS message is processed by one consumer and then deleted" | "the consumer that processes it deletes it" | SQS does not delete a processed message itself |
| c8b k1 | "so each can be sized and paid for separately" | "which traditional Hadoop and data warehouse solutions couple tightly" | page wording |
| l8b k2 | "Keep the raw layer…" | "If possible, keep…" | page wording |
| l8c k3 | "Connectors used to be Lambda functions" | "Many connectors run as a Lambda function…, and custom connectors still do" | federated-queries.html |

## Sentences and their sources

Markup is shown as backticks. Each sentence is followed by the pages that support it.

### c7a

- **k1** Serverless means AWS runs the servers: Lambda manages capacity provisioning, scaling and patching, and you pay only for what you use. It fits short, event-driven work with unpredictable traffic and a wish for the least operational overhead.
  - https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
  - https://docs.aws.amazon.com/lambda/latest/dg/concepts-event-driven-architectures.html
- **k2** Lambda is invoked in two ways. Push: a service such as S3 or API Gateway invokes the function directly. Pull: an event source mapping makes Lambda fetch from a queue or stream (SQS, DynamoDB Streams) and invoke the function with batches.
  - https://docs.aws.amazon.com/lambda/latest/dg/concepts-event-driven-architectures.html
  - https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html
- **k3** A synchronous caller waits for the response. An asynchronous invocation is queued and Lambda answers at once; after a function error Lambda retries two more times, and an on-failure destination or dead-letter queue keeps events that still fail.
  - https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html
  - https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-error-handling.html
  - https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-retain-records.html
- **k4** On the EventBridge default bus and on a Custom Event Bus - Classic, a rule matches events with a JSON event pattern and sends them to up to five targets. The default bus receives AWS service events automatically; your own are sent with `PutEvents`.
  - https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html
  - https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-bus.html
  - https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-putevents.html
- **k5** Event-driven services talk over the network, so latency varies and data across services is often eventually consistent, which makes handling duplicates harder. That is the price for services that scale and fail independently.
  - https://docs.aws.amazon.com/lambda/latest/dg/concepts-event-driven-architectures.html
- **trap** One function that handles every route and event (the Lambda monolith) works but is an anti-pattern. Workloads that need very low latency, such as real-time trading, are a poor fit for event-driven design.
  - https://docs.aws.amazon.com/lambda/latest/dg/concepts-event-driven-architectures.html

### c7b

- **k1** A standard Lambda function runs for at most 15 minutes per invocation with 128 MB to 10,240 MB of memory. Lambda allocates CPU in proportion to memory, so more memory speeds up a CPU-bound function; a longer timeout does not.
  - https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
  - https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html
  - https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html
- **k2** Reserved concurrency sets aside part of the account's concurrency for one function and also caps it, at no additional charge. Provisioned concurrency keeps execution environments initialized, which reduces cold starts and costs extra.
  - https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html
  - https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html
- **k3** HTTP APIs have minimal features at a lower price. Choose a REST API for API keys, per-client throttling, request validation, AWS WAF or a private endpoint. A WebSocket API keeps a connection open, so the backend can send messages to clients.
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html
- **k4** API Gateway shields a backend: above the rate and burst limits callers get `429 Too Many Requests`, and stage caching answers repeated requests from a cache for a TTL (300 seconds by default, 3,600 at most) without calling the backend.
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html
- **k5** Compute choice: Lambda for short event-driven code; Fargate to run containers without managing servers or clusters, for example jobs longer than 15 minutes; EC2 for control of the operating system. A function can also be a container image of up to 10 GB.
  - https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
  - https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html
  - https://docs.aws.amazon.com/lambda/latest/dg/images-create.html
  - https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
- **trap** A Lambda function times out after 15 minutes at most (Lambda Managed Instances allow up to 90 for asynchronous work). An edge-optimized REST endpoint routes requests through a CloudFront point of presence; a Regional endpoint is intended for clients in the same Region.
  - https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html

### c7c

- **k1** SQS decouples producer and consumer: the queue keeps messages (4 days by default, up to 14) until a consumer is ready, so a burst or a consumer outage loses nothing. A consumer receives a message, processes it and deletes it.
  - https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html
  - https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html
- **k2** Standard queues give at-least-once delivery and best-effort ordering at nearly unlimited throughput. FIFO queues keep strict order within a message group and introduce no duplicates; one group ID per order or account keeps each of them in sequence.
  - https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html
  - https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-fifo-queues.html
- **k3** SNS is publish/subscribe: a publisher sends a message to a topic and every subscription receives it (SQS, Lambda, HTTP(S), email, SMS, Firehose). A filter policy on a subscription lets through only the messages that match.
  - https://docs.aws.amazon.com/sns/latest/dg/welcome.html
  - https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html
- **k4** Fan-out is one SNS topic with one SQS queue per consumer. Each queue holds its own copy until its consumer is ready, so services work at their own pace and a new one subscribes without any change to the publisher.
  - https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html
- **k5** Lambda reads a queue through an event source mapping, and its maximum concurrency setting caps how many invocations run at once, which protects a database behind the consumer. Ordered fan-out needs an SNS FIFO topic with SQS FIFO queues.
  - https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
  - https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html
  - https://docs.aws.amazon.com/sns/latest/dg/sns-fifo-topics.html
- **trap** Consumers that share one queue do not each see every message. Without a queue in between, SNS discards a message once its delivery retries are exhausted. A standard queue can deliver a message twice, so make consumers idempotent.
  - https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html
  - https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html
  - https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html

### l7a

- **k1** Every function has an execution role, an IAM role that grants it permission to use AWS services. Its logs reach CloudWatch Logs only if that role allows it, by default in a log group named `/aws/lambda/<function-name&gt;`.
  - https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html
  - https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html
- **k2** The two settings that decide speed and cost are memory (128 MB to 10,240 MB, CPU grows with it) and timeout (3 seconds by default, 900 at most). A function that is cut off after 3 seconds has usually just hit the default timeout.
  - https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
  - https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html
- **k3** The lab's scenario is the standard argument for Lambda over EC2: no servers to provision or maintain, and pay-per-use billing instead of paying for instances that wait for work.
  - https://docs.aws.amazon.com/lambda/latest/dg/welcome.html

### l7b

- **k1** Subscribing a queue to a topic takes two things: the subscription itself and a queue policy that gives the topic `sqs:SendMessage` permission. Without the permission the subscription exists but nothing arrives in the queue.
  - https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html
- **k2** A received message is not removed: it stays in the queue, hidden for the visibility timeout (30 seconds by default). If the consumer does not delete it in time, it becomes visible again and another consumer can receive it.
  - https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html
- **k3** With raw message delivery turned off, the queue receives a JSON document with SNS metadata around your message; with it on, the subscriber gets the message as published.
  - https://docs.aws.amazon.com/sns/latest/dg/sns-large-payload-raw-message-delivery.html
- **k4** Stop the consumer and watch the queue fill: messages wait instead of being dropped. That backlog is what a fleet of workers scales on, as backlog per instance, rather than on CPU.
  - https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html
  - https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html

### l7c

- **k1** An HTTP API can call an AWS service with no Lambda function in between: a first-class integration such as `EventBridge-PutEvents` puts the request on an event bus. API Gateway needs an IAM role that allows that action.
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services.html
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services-reference.html
- **k2** On a default or Classic event bus, a rule's event pattern is JSON that lists the attributes and values an event must have. An event can match several rules, and one that matches no rule causes no action at all, so a wrong pattern fails silently.
  - https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-bus.html
  - https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html
- **k3** EventBridge needs permission to invoke a target. For a Lambda function that is a resource-based policy allowing `events.amazonaws.com` to call `lambda:InvokeFunction`, or an IAM execution role set on the target.
  - https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html
- **k4** A WebSocket API keeps a persistent connection per client. API Gateway calls the `$connect` and `$disconnect` routes when a client joins or leaves, and the backend can send messages to connected clients.
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html

### l7d

- **k1** S3 sends event notifications to an SNS topic, an SQS queue, a Lambda function or EventBridge. For a topic or queue, its policy must give Amazon S3 permission to publish to it.
  - https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-event-types-and-destinations.html
  - https://docs.aws.amazon.com/AmazonS3/latest/userguide/grant-destinations-permissions-to-s3.html
- **k2** Lambda polls the queue through an event source mapping and deletes a batch when the function succeeds. After an error the whole batch becomes visible again, unless `ReportBatchItemFailures` is on and the function returns the failed message IDs.
  - https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
  - https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html
- **k3** A dead-letter queue belongs to the source queue: its redrive policy moves a message there once it has been received `maxReceiveCount` times without being deleted. Set that count high enough to allow retries.
  - https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html
- **k4** S3 to SNS to several queues is fan-out: each queue gets its own copy of every event. The function's execution role must be allowed to read its queue; `AWSLambdaSQSQueueExecutionRole` covers that.
  - https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html
  - https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html

### l7e

- **k1** X-Ray receives segments from the services that handle a request and groups those of one request into a trace. From the traces it draws the trace map (the service map in the X-Ray console), where you see which service has errors or high latency.
  - https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html
  - https://docs.aws.amazon.com/xray/latest/devguide/xray-console-servicemap.html
- **k2** With active tracing on a Lambda function, Lambda creates the trace segments itself. To see the calls your code makes to other services, instrument the code, for example with X-Ray SDK subsegments.
  - https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html
- **k3** X-Ray samples: by default the SDK records the first request each second and five percent of any additional requests. A trace set is a representative sample, not a record of every request.
  - https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html
- **k4** Annotations are key-value pairs that X-Ray indexes, so you can filter traces by them; metadata is stored with the trace but not indexed.
  - https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html
- **trap** Slow requests through several microservices with no obvious culprit point to X-Ray. CloudWatch metrics and alarms show that something is wrong, logs show what one component wrote, and CloudTrail records who made which API call.
  - https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html
  - https://docs.aws.amazon.com/xray/latest/devguide/xray-console-servicemap.html

### c7d

- **k1** A Cognito user pool is a user directory that signs users in, directly or through social and other identity providers, and issues JSON web tokens. An identity pool issues temporary AWS credentials, also to guests, so the app can call S3 or DynamoDB.
  - https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html
- **k2** Who may call a REST API method: IAM roles and policies, a Cognito user pool authorizer that checks the pool's tokens, or a Lambda authorizer that runs your own logic on a bearer token or request parameters and returns an IAM policy.
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-to-api.html
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
- **k3** A resource policy on the API allows or denies callers by AWS account, source IP range or VPC endpoint. A private REST API is callable only from within a VPC through an interface endpoint, isolated from the public internet.
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html
- **k4** AWS WAF protects a REST API stage from common web exploits such as SQL injection and cross-site scripting. Usage plans with API keys throttle and set quotas per customer.
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-aws-waf.html
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html
- **k5** HTTP APIs offer a JWT authorizer for OpenID Connect and OAuth 2.0 tokens, which also works with Cognito. With authorization caching on, API Gateway caches a Lambda authorizer's policy instead of invoking the function again.
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
- **trap** A user pool alone hands out no AWS credentials, and an identity pool alone has no sign-up or password reset. API keys identify a client for a usage plan: AWS says not to use them for authentication or authorization.
  - https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html

### c7e

- **k1** Two policies guard a function. The execution role says which AWS services and resources the function may use; keep it least privilege. The resource-based policy says which service or account may invoke the function.
  - https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html
  - https://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html
- **k2** Lambda encrypts environment variables at rest with a KMS key, an AWS managed key by default or your customer managed key. For database credentials AWS recommends Secrets Manager instead, which also rotates secrets.
  - https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars-encryption.html
  - https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html
- **k3** By default a function has access to the public internet. Attached to a VPC it reaches only resources available in that VPC, so reaching the internet takes a NAT gateway. DynamoDB can be reached privately through a gateway endpoint.
  - https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html
  - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/privatelink-interface-endpoints.html
- **k4** DynamoDB encrypts tables at rest, by default with an AWS owned key; choose a customer managed key for full control over the key. Point-in-time recovery keeps up to 35 days of per-second recovery points and always restores to a new table.
  - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/EncryptionAtRest.html
  - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Point-in-time-recovery.html
  - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.Tutorial.html
- **k5** CloudTrail logs Lambda and DynamoDB control plane calls by default; function invocations and item-level DynamoDB calls are data events you must turn on. GuardDuty Lambda Protection monitors the functions' network activity logs.
  - https://docs.aws.amazon.com/lambda/latest/dg/logging-using-cloudtrail.html
  - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/logging-using-cloudtrail.html
  - https://docs.aws.amazon.com/guardduty/latest/ug/lambda-protection.html
- **trap** Permission in a function's execution role to read a bucket does not let S3 invoke the function; that takes the resource-based policy. Encrypting an environment variable does not rotate the credential inside it.
  - https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html
  - https://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html
  - https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars-encryption.html

### c7f

- **k1** Step Functions runs a workflow as a state machine, so retries and error handling live outside your code. `Retry` with a backoff rate handles transient errors; `Catch` sends a failed step to a fallback state such as a compensation step.
  - https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html
  - https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html
- **k2** Standard workflows run up to one year with exactly-once execution and support the callback pattern (`.waitForTaskToken`), as for a human approval. Express workflows run up to five minutes for high-volume event processing and do not support it.
  - https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html
  - https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html
- **k3** Lambda sends function logs to CloudWatch Logs. Log data is kept indefinitely unless you set a retention period on the log group. A metric filter turns matching log events into a metric that an alarm can watch.
  - https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html
  - https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html
  - https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html
- **k4** X-Ray traces a request across services and draws a trace map that shows where errors occur and which connections have high latency. Logs tell you what one component did; a trace tells you where in the chain the time went.
  - https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html
  - https://docs.aws.amazon.com/xray/latest/devguide/xray-console-servicemap.html
- **k5** Putting it together: API Gateway is the front door (authorization, throttling), Lambda runs the logic, SQS buffers, SNS or EventBridge fans out, Step Functions coordinates multi-step flows and DynamoDB keeps state. One stated requirement picks each.
  - https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-to-api.html
  - https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html
  - https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html
  - https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html
- **trap** A function that calls the next function, or sleeps while it waits, is the hand-written orchestration Step Functions replaces. A dead-letter queue between steps keeps failed messages; it runs no compensation and waits for no approval.
  - https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html
  - https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html

### c8a

- **k1** A data warehouse holds structured, pre-modeled data in tables built for fast SQL (Redshift). A data lake is a central repository for raw data, structured or not, stored first and processed later (S3). A data lakehouse combines the two.
  - https://aws.amazon.com/compare/the-difference-between-a-data-warehouse-data-lake-and-data-mart/
  - https://aws.amazon.com/what-is/data-lakehouse/
- **k2** Follow the data through the pipeline and name one service per stage: ingest (Kinesis Data Streams, Data Firehose), store (S3), catalog and transform (Glue), query (Athena, Redshift), visualize (Quick Sight).
  - https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html
- **k3** Kinesis Data Streams collects and processes records in real time. A stream is a set of shards, the partition key groups records by shard, and records stay readable for the retention period: 24 hours by default, up to 365 days.
  - https://docs.aws.amazon.com/streams/latest/dev/introduction.html
  - https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html
- **k4** Amazon Data Firehose (formerly Kinesis Data Firehose) is fully managed delivery: you write no applications. It buffers records by size or time and delivers them to S3, Redshift, OpenSearch Service and other destinations.
  - https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html
- **k5** Amazon Managed Service for Apache Flink (formerly Kinesis Data Analytics) processes and analyzes streaming data with Java, Scala, Python or SQL. Amazon MSK is the managed Apache Kafka service for applications built on Kafka.
  - https://docs.aws.amazon.com/managed-flink/latest/java/what-is.html
  - https://docs.aws.amazon.com/msk/latest/developerguide/what-is-msk.html
- **trap** Firehose only delivers: several independent consumers, or replaying yesterday's records, means Kinesis Data Streams with a retention period above the 24-hour default. An SQS message is not kept for replay: the consumer that processes it deletes it from the queue.
  - https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html
  - https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html
  - https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html

### c8b

- **k1** S3 is the storage platform of a data lake on AWS: virtually unlimited and highly durable, with storage decoupled from compute and data processing, which traditional Hadoop and data warehouse solutions couple tightly.
  - https://docs.aws.amazon.com/whitepapers/latest/building-data-lakes/amazon-s3-data-lake-storage-platform.html
- **k2** Organize the lake in layers, one bucket each: raw (unprocessed data in its original format), stage (processed data optimized for consumption, for example CSV converted to Parquet) and analytics (aggregated data for specific use cases).
  - https://docs.aws.amazon.com/prescriptive-guidance/latest/defining-bucket-names-data-lakes/data-layer-definitions.html
- **k3** A Glue crawler infers the format and schema of your data and creates or updates tables in the Glue Data Catalog. AWS Glue itself is serverless data integration; job bookmarks track data that a previous run of an ETL job already processed.
  - https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html
  - https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html
  - https://docs.aws.amazon.com/glue/latest/dg/monitor-continuations.html
- **k4** Lake Formation governs the lake centrally: you grant and revoke permissions on Data Catalog resources much like in a relational database, down to column, row and cell level, and Athena, Redshift Spectrum, EMR and Glue enforce them.
  - https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html
- **trap** A crawler moves no data: it writes metadata to the Data Catalog. Hiding one column from one team is a Lake Formation grant, not a separate bucket per team. Without cataloging and access control a data lake is raw data nobody can use.
  - https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html
  - https://docs.aws.amazon.com/lake-formation/latest/dg/data-filtering.html
  - https://aws.amazon.com/what-is/data-lake/

### c8c

- **k1** Athena analyzes data directly in S3 with standard SQL; it is serverless and you pay only for the queries you run. Partitioning restricts the data each query scans, and columnar formats such as Parquet are optimized for fast retrieval.
  - https://docs.aws.amazon.com/athena/latest/ug/what-is.html
  - https://docs.aws.amazon.com/athena/latest/ug/partitions.html
  - https://docs.aws.amazon.com/athena/latest/ug/columnar-storage.html
- **k2** Athena workgroups carry two cost controls: a per-query limit cancels any query that scans more data than the threshold, and a per-workgroup limit can notify an SNS topic when the scanned total passes a threshold.
  - https://docs.aws.amazon.com/athena/latest/ug/workgroups-setting-control-limits-cloudwatch.html
- **k3** Amazon Quick Sight (formerly Amazon QuickSight, now a feature of Amazon Quick) builds interactive dashboards. A dataset imported into SPICE, its in-memory engine, answers faster than a direct query that waits for the source each time.
  - https://docs.aws.amazon.com/quick/latest/userguide/what-is.html
  - https://docs.aws.amazon.com/quick/latest/userguide/spice.html
- **k4** Redshift is the fully managed, petabyte-scale data warehouse. Redshift Spectrum queries structured and semi-structured files in S3 without loading them into tables, and Redshift Serverless provisions and scales capacity for you.
  - https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html
  - https://docs.aws.amazon.com/redshift/latest/dg/c-using-spectrum.html
  - https://docs.aws.amazon.com/redshift/latest/mgmt/serverless-whatis.html
- **k5** Putting it together: Firehose lands events in S3, a Glue crawler catalogs them, Glue jobs turn raw data into Parquet, Lake Formation controls who sees what, Athena or Redshift queries it, Quick Sight shows it. The stem's requirement picks each stage.
  - https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html
  - https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html
  - https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html
  - https://docs.aws.amazon.com/athena/latest/ug/what-is.html
  - https://docs.aws.amazon.com/quick/latest/userguide/what-is.html
- **trap** A few ad hoc SQL queries on files in S3 mean Athena, not a warehouse to load and size; a central warehouse for complex joins used by BI tools all day means Redshift. Data in SPICE is an imported copy that needs a refresh.
  - https://docs.aws.amazon.com/athena/latest/ug/what-is.html
  - https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html
  - https://docs.aws.amazon.com/quick/latest/userguide/spice.html
  - https://docs.aws.amazon.com/quick/latest/userguide/refreshing-imported-data.html

### l8a

- **k1** Firehose buffers incoming data to a certain size or for a certain period before delivering it, so objects appear in S3 in batches after a delay, not record by record.
  - https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html
- **k2** For preprocessing, Firehose invokes your Lambda function synchronously with each buffered batch and delivers the transformed records the function returns. No consumer application has to run.
  - https://docs.aws.amazon.com/firehose/latest/dev/data-transformation.html
- **k3** Converting JSON to Parquet or ORC on the way to S3 is a Firehose setting that takes its schema from a table in the Glue Data Catalog, so the catalog table has to exist before the stream can convert.
  - https://docs.aws.amazon.com/firehose/latest/dev/record-format-conversion.html
- **k4** The Glue Data Catalog is what makes the delivered files queryable: Athena reads table definitions from it. Dynamic partitioning, which builds S3 prefixes from keys in the data, has to be chosen when the Firehose stream is created.
  - https://docs.aws.amazon.com/athena/latest/ug/understanding-tables-databases-and-the-data-catalog.html
  - https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning.html

### l8b

- **k1** A data lake stores data as-is, structured and unstructured, at any scale, without having to structure it first. That is why records a database would delete to save space can be kept in S3 and analyzed later.
  - https://aws.amazon.com/what-is/data-lake/
- **k2** If possible, keep the raw layer in its original file format with versioning turned on, and write processed copies to a separate stage layer. Raw data that stays untouched can be processed again when a transformation changes.
  - https://docs.aws.amazon.com/prescriptive-guidance/latest/defining-bucket-names-data-lakes/data-layer-definitions.html
- **k3** The analytics layer holds aggregated data in a consumption-ready format such as Parquet. Lifecycle rules can move ageing raw files to an infrequent access class and later to archive classes.
  - https://docs.aws.amazon.com/prescriptive-guidance/latest/defining-bucket-names-data-lakes/data-layer-definitions.html
- **k4** Storing files is not enough: without mechanisms to catalog and secure the data, nobody knows what the lake contains. In AWS those are the Glue Data Catalog and Lake Formation.
  - https://aws.amazon.com/what-is/data-lake/
  - https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html

### l8c

- **k1** A Glue crawler can crawl a DynamoDB table as well as files in S3 and write its schema to the Data Catalog. It stores metadata only; the items stay in DynamoDB.
  - https://docs.aws.amazon.com/glue/latest/dg/crawler-data-stores.html
  - https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html
- **k2** Athena Federated Query runs SQL on sources other than S3 through data source connectors. The DynamoDB connector lets you query tables with SQL in place, with no pipeline that copies them to S3 first; writes such as `INSERT INTO` are not supported.
  - https://docs.aws.amazon.com/athena/latest/ug/federated-queries.html
  - https://docs.aws.amazon.com/athena/latest/ug/connectors-dynamodb.html
- **k3** Many connectors run as a Lambda function in your account, and custom connectors still do. Since 21 April 2026 certain newly created connectors are registered as Glue Data Catalogs and use no Lambda function in your account.
  - https://docs.aws.amazon.com/athena/latest/ug/federated-queries.html
- **trap** For a regular full-table report that must not touch production capacity, export the table to S3 instead: the export needs point-in-time recovery turned on and consumes no read capacity. Federated queries fit occasional questions on current data.
  - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/S3DataExport.HowItWorks.html

### c9a

- **k1** Decoupling: when one component fails or slows down because of another, put a queue, a stream, a workflow or a load balancer between them. Loose coupling isolates the behavior of a component from the components that depend on it.
  - https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_prevent_interaction_failure_loosely_coupled_system.html
- **k2** High availability is about the components of a workload: spread them over several Availability Zones with automatic failover. Disaster recovery is about a separate copy of the entire workload, usually in another Region, measured by RTO and RPO.
  - https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/high-availability-is-not-disaster-recovery.html
  - https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_fault_isolation_multiaz_region_system.html
- **k3** DR strategies in rising cost and falling RTO and RPO: backup and restore (RPO in hours), pilot light (data replicated, servers not deployed), warm standby (a scaled-down but fully functional copy always running), multi-site active/active.
  - https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_planning_for_recovery_disaster_recovery.html
  - https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html
- **k4** Caching answers 'the same data is read again and again': a cache improves read latency and read throughput for frequently accessed data. Do not cache data that changes frequently, and never treat a cache as durable storage.
  - https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/perf_data_access_patterns_caching.html
- **k5** Cost follows the usage pattern: components that run for extended periods take commitment discounts (Savings Plans, Reserved Instances), dynamic or short-running ones take On-Demand or Spot. Encrypt data at rest by default and in transit.
  - https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/cost_pricing_model_analysis.html
  - https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/sec_protect_data_rest_encrypt.html
  - https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/sec_protect_data_transit_encrypt.html
- **trap** Most wrong options work but miss one stated requirement. Find the qualifier in the stem (least operational overhead, most cost-effective, RTO and RPO) and strike options that add servers, manual steps or a second Region nobody asked for.
  - https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html

Further pages the second read used:
- Former names: https://aws.amazon.com/about-aws/whats-new/2024/02/amazon-data-firehose-formerly-kinesis-data-firehose/ and https://aws.amazon.com/about-aws/whats-new/2023/08/amazon-managed-service-apache-flink/
- Dynamic partitioning only on a new stream: https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning-enable.html
- SQS retention (4 days, 14 days): https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html
- FIFO message groups: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/using-messagegroupid-property.html
- SNS FIFO with SQS FIFO: https://docs.aws.amazon.com/sns/latest/dg/fifo-message-delivery.html
- Lambda in a VPC and internet access: https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc-internet.html
- DynamoDB gateway endpoint: https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-ddb.html
- `AWSLambdaSQSQueueExecutionRole`: https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-configure.html
- EC2 and operating system control: https://aws.amazon.com/ec2/faqs/
- Athena or Redshift: https://docs.aws.amazon.com/athena/latest/ug/when-should-i-use-ate.html
- HA inside one Region, RTO and RPO: https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-is-different-in-the-cloud.html and https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html

## Inferences (not a statement on a page)

Exam framing, with the facts inside checked:
- c7a k1 "least operational overhead"; c7a k5 last sentence ("the price for services that scale and fail independently").
- c7b k1 "a longer timeout does not"; c7b k5 "jobs longer than 15 minutes" on Fargate; "A standard Lambda function" is this plan's term for a function that is not on Lambda Managed Instances.
- c7c k1 "loses nothing"; c7c k2 "one group ID per order or account"; c7c k5 "protects a database behind the consumer" (the page says the setting limits concurrent invocations); c7c trap "Consumers that share one queue do not each see every message" (follows from the visibility timeout).
- l7a k2 last sentence (troubleshooting advice); l7a k3 uses the scenario on the lab's description page.
- l7b k1 "the subscription exists but nothing arrives"; l7b k4 "rather than on CPU".
- l7c k2 "so a wrong pattern fails silently" (the page: EventBridge takes no action).
- l7e k3 last sentence; l7e trap (which tool answers which question).
- c7d trap "an identity pool alone has no sign-up or password reset" (the Cognito comparison lists these under user pools).
- c7e trap, both sentences (conclusions from the execution role, resource-based policy and environment variable pages).
- c7f k1 "live outside your code", "compensation step"; c7f k4 second sentence; c7f k5 (summary of the entries above); c7f trap second sentence.
- c8a k1 the examples "(Redshift)" and "(S3)"; c8a k2 (one service per stage; each role is on its service page); c8a trap "Firehose only delivers" (from the description of a delivery service).
- c8b trap "moves no data", "not a separate bucket per team".
- c8c k5 (summary); c8c trap "used by BI tools all day".
- l8a k1 "in batches after a delay, not record by record"; l8a k3 "has to exist before the stream can convert" (the page: conversion requires a schema in the Data Catalog).
- l8b k1 second sentence (the scenario on the lab's description page); l8b k2 second sentence (why raw data is kept).
- l8c k1 "the items stay in DynamoDB"; l8c trap last sentence.
- c9a k2 is assembled from three pages; c9a trap is exam technique with no AWS fact in it.

Sources with a caveat:
- c8b k1 and the l8b link rest on the whitepaper "Storage Best Practices for Data and Analytics Applications", which AWS marks "for historical reference only".
- c7f trap: AWS lists "Lambda functions calling Lambda functions" as an anti-pattern but now exempts Lambda durable functions, a code-based way to orchestrate multi-step work. The sentence holds for ordinary functions.
- l7e k3: the sampling default is the X-Ray SDK's; the Lambda page adds that the sampling rate of a function cannot be configured.

Not settled: none of the 91 key points and traps was left without a source or an entry in the list above.

## Found elsewhere (not fixed here)

- **plan.js, c8c lesson title "Amazon QuickSight":** the service is now Amazon Quick Sight, a feature of Amazon Quick (https://docs.aws.amazon.com/quick/latest/userguide/what-is.html). The title may be Skill Builder's own wording, so it may have to stay; c8c k3 gives the former name once. The old user guide URLs (`/quicksight/latest/user/…`) redirect twice and end at `/quick/latest/userguide/…`.
- **plan.js, l8a:** the lab's description page lists "Amazon Kinesis" as a service and its objective says "Amazon Data Firehose delivery stream"; current docs say "Firehose stream".
- **EventBridge naming, wider than the note in `docs/questions.md`:** the user guide now describes two bus types. "Custom Event Bus" (new, recommended for new applications) routes events to subscribers that consumers create, retains events and supports replay; "Custom Event Bus - Classic" and the default bus route with rules and up to five targets (https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html). Questions and key points that say "custom event bus" with rules mean the Classic type: q09-010, m1-054, m2-055, m2-052 (an option), and the retired `d9b3`.
- **EventBridge to Lambda permission:** `eb-use-resource-based.html` now says an IAM execution role on the target is an alternative and the resource-based policy is required only when no role is set. The retired `d9b3` k2 already says "or the target has an execution role"; nothing to change there.
- **Lambda timeout:** the quotas page gives Lambda Managed Instances 90 minutes for asynchronous and event source mapping invocations. Questions that call 15 minutes "the" Lambda limit without "standard" or "default": q10-015 (stem), q01-031 (implied). q01-035 already has the caveat.
- **Athena federated connectors:** `d10c3` and m1-043 are fine; the `docs/questions.md` line "no longer use a Lambda function" is right only for "certain newly created connectors"; Athena data catalog connectors and custom connectors still need one.
- **STEP_TAGS:** `c7e` is tagged DynamoDB and Lambda; its lesson "Enable Auditing, Traceability, and Security Automation" would also fit CloudTrail. `l7c` could carry Lambda, `l7d` Lambda and S3 features, `l7e` has no X-Ray tag because QTAGS has none. `l8c` (Athena on DynamoDB) could carry DynamoDB. `c8c` is tagged Redshift although no lesson title names Redshift.
- **Lab durations and access:** all eight lab pages say "Subscription needed". l7c is 2 h, l7d 45 min, the others 1 h, which matches plan.js.
