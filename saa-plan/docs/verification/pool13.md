# Pool 13 (serverless, messaging and containers): sources

40 questions, `q13-001` to `q13-040`, written on 2026-10-12/13. Every page below was fetched in the writing session (plain 200, no redirect) and the sentence or table entry was read in the page text. Page prefixes: `L` = docs.aws.amazon.com/lambda/latest/dg, `AG` = docs.aws.amazon.com/apigateway/latest/developerguide, `SF` = docs.aws.amazon.com/step-functions/latest/dg, `EB` = docs.aws.amazon.com/eventbridge/latest/userguide, `SCH` = docs.aws.amazon.com/scheduler/latest/UserGuide, `SQS` = docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide, `SNS` = docs.aws.amazon.com/sns/latest/dg, `COG` = docs.aws.amazon.com/cognito/latest/developerguide, `ECS` = docs.aws.amazon.com/AmazonECS/latest/developerguide, `ECR` = docs.aws.amazon.com/AmazonECR/latest/userguide, `CWL` = docs.aws.amazon.com/AmazonCloudWatch/latest/logs, `S3` = docs.aws.amazon.com/AmazonS3/latest/userguide.

Lifecycle check: none of the keyed services is on the General Reference lists (`general/latest/gr/maintenance_services.html`, `sunset_services.html`, `full_shutdown_services.html`). On the maintenance list and therefore not used: Amazon Cognito Sync, SNS Message Data Protection.

## Per question

| Id | Key rests on | Distractors rejected by |
|---|---|---|
| q13-001 | `L/configuration-concurrency.html`: reserved concurrency "acts as both a lower and upper bound", can be used "to prevent overwhelming downstream resources". `L/invocation-async-error-handling.html`: throttled events are returned to the queue and retried "for up to 6 hours by default". | Provisioned: `L/lambda-concurrency.html` (function keeps serving from unreserved concurrency when provisioned concurrency is used up). Retry/age settings: `L/invocation-async-configuring.html`. API Gateway: S3 invokes the function asynchronously, `L/invocation-async.html` (reasoning). |
| q13-002 | `L/configuration-vpc-internet.html` (private subnets reach the internet through a NAT gateway); `vpc/latest/userguide/vpc-nat-gateway.html` (public NAT gateway in a public subnet, "must associate an Elastic IP address"). | `L/configuration-vpc.html`: "Connecting a function to a public subnet doesn't give it internet access or a public IP address"; a function attached to a VPC "can only access resources available within that VPC" (and the reverse for the no-VPC option). |
| q13-003 | `L/invocation-eventsourcemapping.html` (batching window 0 to 300 s); `L/services-sqs-configure.html` (standard queue batch up to 10,000; over 10 needs a window). | Provisioned concurrency charge: `L/configuration-concurrency.html`. Partial batch responses: `L/services-sqs-errorhandling.html`. Scheduler option: reasoning. |
| q13-004 | `L/invocation-async-configuring.html` (maximum event age up to 6 hours; discarded when exceeded); `L/invocation-async-retain-records.html` (on failure: "fails all processing attempts or exceeds the maximum age"). | Retry attempts: `L/invocation-async-error-handling.html` (function errors vs throttles). SNS policy: `SNS/sns-message-delivery-retries.html` (retries when the endpoint is unavailable) and `L/invocation-async.html` (Lambda queues the event and returns success). Reserved concurrency: reasoning. |
| q13-005 | `S3/PresignedUrlUploadObject.html`; `S3/upload-objects.html` (single PUT up to 5 GB); `L/gettingstarted-limits.html` (6 MB synchronous payload); `AG/api-gateway-execution-service-limits-table.html` (payload 10 MB). | HTTP API: `AG/http-api-quotas.html` (payload 10 MB). Others: same limits. |
| q13-006 | `L/gettingstarted-limits.html` (10,240 MB, 900 s); `ECS/fargate-tasks-services.html` (16 vCPU, 32 to 120 GB); `SF/connect-ecs.html`; aws.amazon.com/fargate/faqs/ (resources counted from image pull to task end). | EC2 option and provisioned concurrency: reasoning plus `L/configuration-concurrency.html`. |
| q13-007 | `AG/http-api-vs-rest.html` (API keys, per-client throttling, request validation, AWS WAF: REST yes, HTTP no). | Same table. CloudFront and Lambda-authorizer options: work but are custom code (judgement). |
| q13-008 | `AG/api-gateway-request-throttling.html` (per-method settings on a stage; 429; best effort). | Same page (usage plans are per client key); `AG/api-gateway-caching.html` (only GET cached by default). |
| q13-009 | `AG/api-gateway-caching.html`: flush stage cache; TTL 0 disables caching; `Cache-Control: max-age=0` needs `execute-api:InvalidateCache`. | Same page. |
| q13-010 | `AG/api-gateway-control-access-using-iam-policies-to-invoke-api.html` (SigV4); `AG/apigateway-authorization-flow.html` (separate accounts: both IAM policy and resource policy must allow); `AG/apigateway-resource-policies.html`. | `AG/api-gateway-api-usage-plans.html`: "Don't use API keys for authentication or authorization". Cognito and Lambda authorizer: reasoning. |
| q13-011 | `AG/private-integration.html`, `AG/apigateway-vpc-links-v2.html`, `AG/http-api-develop-integrations-private.html`. | `AG/apigateway-private-apis.html` (private API only callable from within a VPC). |
| q13-012 | `SF/choosing-workflow-type.html` (Standard up to one year); `L/gettingstarted-limits.html` (15 minutes); `AG/api-gateway-execution-service-limits-table.html` (29 s default); `AG/http-api-quotas.html` (30 s, not increasable). | Same pages; WebSocket: reasoning. |
| q13-013 | `SF/choosing-workflow-type.html` (Express: high-volume event processing, five minutes, at-least-once, billing model). | Same page; `SF/state-map.html` (Distributed Map processes a dataset). |
| q13-014 | `SF/state-task.html` (HeartbeatSeconds; default 99,999,999); `SF/sfn-best-practices.html` (heartbeats recommended for `.waitForTaskToken`); `SF/concepts-error-handling.html` (States.Timeout also for a missed heartbeat; Retry example). | `SF/connect-to-resource.html` (Express: request-response only). DLQ and 4-hour timeout: reasoning. |
| q13-015 | `SF/connect-to-resource.html` (Run a Job, table: ECS/Fargate `.sync` on Standard); `SF/connect-ecs.html`. | Same pages; Lambda 15 minutes. |
| q13-016 | `SF/state-parallel.html` (waits for all branches; output array; "If any branch fails ... the entire Parallel state is considered to have failed"). | `SF/state-map.html`, `SF/state-choice.html`; SNS publish is request-response (`SF/connect-to-resource.html`). |
| q13-017 | `L/with-step-functions.html`, `SF/welcome.html`. | Reasoning. |
| q13-018 | `EB/eb-pipes.html`, `EB/eb-pipes-event-source.html`, `EB/pipes-enrichment.html`, `EB/eb-pipes-event-target.html`, `EB/pipes-concepts.html` (charged only for matching events). | `L/invocation-eventfiltering.html`; `sns/latest/api/API_Subscribe.html` (protocol list has no state machine). Rule on the default bus: no enrichment step (reasoning, see "Not settled"). |
| q13-019 | `EB/eb-api-destinations.html` (connections, invocation rate, retries 24 h / 185). | `EB/eb-pipes-event-source.html` (source list). Others: reasoning. |
| q13-020 | `SCH/what-is-scheduler.html`, `SCH/schedule-types.html` (one-time, time zone, 60-second precision), `SCH/managing-schedule-delete.html`. | `SQS/sqs-delay-queues.html` (15 minutes); `amazondynamodb/latest/developerguide/TTL.html` ("within a few days"); `EB/eb-create-rule-schedule.html` (legacy, UTC). |
| q13-021 | `EB/eb-rule-retry-policy.html`, `EB/eb-rule-dlq.html`; `EB/eb-targets.html` (API Gateway is a target). | `EB/eb-archive.html`, `EB/eb-replay-archived-event.html`; `EB/eb-global-endpoints.html`. |
| q13-022 | `S3/EventBridge.html`; `S3/EventNotifications.html` (destinations; FIFO queues not supported, use EventBridge); `S3/notification-how-to-filtering.html` (no overlapping prefixes); `S3/ev-events.html` (size in the event); `EB/eb-create-pattern-operators.html` (numeric); `EB/eb-targets.html` (SQS FIFO, Step Functions). | `sns/latest/api/API_Subscribe.html`. Others: reasoning. |
| q13-023 | `SQS/sqs-queue-types.html` (standard: nearly unlimited; FIFO: 300 / 3,000, high throughput mode). | Same page; aws.amazon.com/sqs/faqs/ ("How is Amazon SQS different from Amazon MQ?"). |
| q13-024 | `SQS/sqs-visibility-timeout.html` (heartbeat, `ChangeMessageVisibility`, 12-hour limit). | `SQS/sqs-short-and-long-polling.html`; others reasoning. |
| q13-025 | `SQS/sqs-configure-dead-letter-queue-redrive.html` (redrive to source queue, redrive velocity). | Reasoning; `SQS/sqs-dead-letter-queues.html`. |
| q13-026 | `amazon-mq/latest/developer-guide/rabbitmq-broker-architecture.html` (single-instance vs cluster of three nodes across AZs; AMQP 0-9-1); aws.amazon.com/amazon-mq/faqs/; aws.amazon.com/sqs/faqs/ (MQ for existing applications, SQS and SNS for new ones). | Same pages. |
| q13-027 | `SNS/sns-message-filtering.html`, `SNS/sns-message-filtering-scope.html`. | `SNS/sns-large-payload-raw-message-delivery.html`. |
| q13-028 | `SNS/subscribe-sqs-queue-to-sns-topic.html` (queue policy must allow `sqs:SendMessage`; `aws:SourceArn`). | Reasoning. |
| q13-029 | `SNS/sns-firehose-as-subscriber.html`. | `SNS/fifo-message-archiving-replay.html` (FIFO topics, 365 days). |
| q13-030 | `COG/cognito-identity.html` (guest access), `COG/what-is-amazon-cognito.html`. | Same pages. |
| q13-031 | `COG/cognito-user-pools-define-resource-servers.html` (M2M, client credentials, custom scopes), `AG/apigateway-integrate-with-cognito.html`, `COG/user-pool-accessing-resources-api-gateway-and-lambda.html`. | `AG/api-gateway-api-usage-plans.html`; others reasoning. |
| q13-032 | aws.amazon.com/ecs/faqs/ ("fully managed and versionless"); aws.amazon.com/fargate/faqs/. | `decision-guides/latest/decision-guides/choosing-aws-container-service.html` (Kubernetes releases and deprecations). |
| q13-033 | `ECS/ecs-gpu.html`; `ECS/capacity-launch-type-comparison.html` (a cluster can mix capacity providers). | `ECS/fargate-tasks-services.html` (`gpu` not valid for Fargate tasks). |
| q13-034 | `ECS/task_execution_IAM_role.html`, `ECS/task-iam-roles.html`, `ECS/security-ecs-iam-role-overview.html`, `ECS/secrets-envvar-secrets-manager.html`. | Same pages; others reasoning. |
| q13-035 | `ECR/image-scanning.html`, `ECR/image-scanning-enhanced.html`, `ECR/replication.html` (only content pushed after configuration is replicated). | Same pages; endpoint option reasoning. |
| q13-036 | `ECS/cluster-auto-scaling.html`. | `ECS/service-auto-scaling.html`; ASG CPU policy: reasoning from the CapacityProviderReservation description. |
| q13-037 | `ECS/ecs-anywhere.html` (external instances, EXTERNAL launch type, outbound or data-processing workloads). | aws.amazon.com/eks/eks-anywhere/faqs/ (customer-managed); `eks/latest/userguide/eks-deployment-options.html` (Outposts is AWS-managed infrastructure). |
| q13-038 | aws.amazon.com/eks/eks-anywhere/faqs/ (vSphere; disconnected and air-gapped); `eks/latest/userguide/eks-deployment-options.html`. | Same page: Hybrid Nodes and EKS on Outposts "require a reliable connection" to a Region. |
| q13-039 | `xray/latest/devguide/aws-xray.html`, `xray/latest/devguide/xray-services.html`, `AG/apigateway-xray.html`, `L/services-xray.html`, `SF/concepts-xray-tracing.html`. | Reasoning. |
| q13-040 | `CWL/AnalyzingLogData.html`, `CWL/Subscriptions.html` ("usually less than three minutes"). | `CWL/S3Export.html` (up to 12 hours); `CWL/MonitoringLogData.html` ("Filters do not retroactively filter data"). |

## New DOCS entries

Add to `DOCS` in `site/quiz/meta.js` (all fetched, plain 200):

```
pipes: ["Amazon EventBridge Pipes", "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes.html"],
"ecs-anywhere": ["Amazon ECS clusters for external instances (ECS Anywhere)", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-anywhere.html"],
"eks-anywhere": ["Amazon EKS Anywhere FAQs", "https://aws.amazon.com/eks/eks-anywhere/faqs/"],
xray: ["What is AWS X-Ray?", "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html"],
"logs-insights": ["Analyzing log data with CloudWatch Logs Insights", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html"]
```

## Second read

A sub-agent that saw only stems and options answered all 40; every answer matched the key. Reworked after its objections: q13-025 (repointing the consumers was arguable; the stem now excludes it), q13-021 (requirement softened: a dead-letter queue keeps the events, it does not resend them), q13-014 (explanation states what `States.Timeout` covers), q13-007 (two give-away distractors replaced), q13-035 (replication only covers images pushed after the rule exists), q13-001 (one call per file).

## Not settled

- q13-018: no page says in words that DynamoDB stream records do not reach the default event bus by themselves; the option is rejected because a rule has no enrichment step.
- q13-033: Amazon ECS Managed Instances also runs GPU workloads (`ECS/ecs-gpu.html`) and is not among the options; the key (GPU instances in an Auto Scaling group capacity provider) is still correct.
- q13-020: the default quota on the number of schedules was not checked; "built for millions" is from `SCH/what-is-scheduler.html`.
- q13-013: no price comparison is made; the fit is AWS's own description of Express workflows.
- Judgement statements ("code to maintain", "more to operate") have no source page.
- Domain 4 has one question (q13-003); other cost angles on these topics need price comparisons that AWS does not state in words.

## Found elsewhere

- `docs/questions.md` and `CLAUDE.md` still describe the 14-day plan and `ref` as required.
- AWS changes not yet in `docs/questions.md`: Lambda asynchronous invocation payload is 1 MB (`L/gettingstarted-limits.html`); SQS maximum message size is 1 MiB (`SQS/quotas-messages.html`); API Gateway REST APIs support VPC links V2 to Application Load Balancers and VPC links V1 are legacy (`AG/private-integration.html`); REST API integration timeout can be raised above 29 s for Regional and private APIs; ECS documents "ECS Managed Instances" and recommends capacity providers over launch types; ECS Anywhere drops several operating systems from 2026-08-07; Amazon Cognito Sync and SNS Message Data Protection are in maintenance.
- Not checked against these: existing questions that state "256 KB" for SQS or Lambda asynchronous payloads, or "VPC link needs an NLB" for REST APIs, would now be outdated.
