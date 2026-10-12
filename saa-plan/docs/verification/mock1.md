# Verification log: mock set 1 (`site/quiz/mock1.js`)

Date: 2026-10-12. Checked against pages fetched directly from `docs.aws.amazon.com` and `aws.amazon.com` (curl, tags stripped, matching sentences read). No web search was used.

## Result

| | |
|---|---|
| Questions checked | 65 of 65 (the 29 knowledge-only ids first, then the other 36) |
| Questions changed | 3 (m1-043, m1-056, m1-061) |
| Answer keys changed | 0 |
| Domains, tags, refs, doc keys changed | 0 |
| Not reached | none |

No keyed option relies on a service in maintenance, sunset or shutdown. Every `doc` key used by mock1 exists in `DOCS`, and all 31 of those URLs answer 200 (`aurora` redirects to the Aurora FAQ on docs.aws.amazon.com).

Checks after the edits: `node --test` 26/26 pass; `node tools/qstats.mjs mock1` reports 65 questions, 20/17/15/13, 10 Choose two, "keyed option clearly longest" 0; `node tools/similar.mjs 0.38` lists the same 5 day-pool pairs as before and none that involves mock1.

## Changed questions

- **m1-061** (stem and the explanation of the keyed option). The stem required "99.99% of new objects within 15 minutes, backed by an SLA". The S3 RTC SLA commits to 99.9%, not 99.99%; 99.99% is only the design target in the S3 FAQ, and the User Guide page says 99.9 percent. The stem now asks for a predictable replication time within 15 minutes with an AWS SLA, and the explanation quotes only the SLA figure. Key unchanged. Sources: https://aws.amazon.com/s3/faqs/ ("backed by a Service Level Agreement (SLA) commitment that 99.9% of objects will be replicated in 15 minutes"), https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-time-control.html, https://aws.amazon.com/s3/sla-rtc/
- **m1-043** (explanation of the keyed option). It said Athena federated query uses "Lambda-based connectors". Since 2026-04-21 some newly created Glue Data Catalog federated connectors do not use a Lambda function, and both DynamoDB and PostgreSQL are listed with and without Lambda. Now says "data source connectors". Source: https://docs.aws.amazon.com/athena/latest/ug/federated-queries.html
- **m1-056** (explanation of the VPN distractor). It said each tunnel carries "only a small fraction of 100 Gbps" and that line rate would need "dozens of tunnels". Site-to-Site VPN tunnels are 1.25 Gbps, or up to 5 Gbps with a Large Bandwidth Tunnel on Transit Gateway or Cloud WAN, so the count was loose. Now says "at most a few Gbps" and "many tunnels", and adds that only traffic routed into the tunnels is encrypted. Source: https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html

## Open doubts from docs/questions.md that this pass settles

- **Closures (m1-026, m1-038):** Amazon AppFlow and Amazon Detective are on none of the three official lifecycle lists, so both are open to new customers. Sources: https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html, https://docs.aws.amazon.com/general/latest/gr/sunset_services.html, https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html. A summary of those lists is in the shared notes folder for the other sessions.

## Still uncertain or worth knowing

- **m1-061:** two official pages disagree on the RTC design target (FAQ: 99.99% within 15 minutes; User Guide: 99.9 percent). The question no longer depends on either number.
- **m1-021:** changing a Valkey cluster from cluster mode disabled to enabled requires automatic failover and at least one replica first, and the stem's cluster has none. The keyed options describe the correct end state and never claim it is a one-step change, so I left them. Source: https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/modify-cluster-mode.html
- **m1-034:** an existing .zip function cannot be switched to a container image; a new function has to be created. The keyed option ("package … as a container image … and deploy it to Lambda") stays true. Source: https://docs.aws.amazon.com/lambda/latest/dg/configuration-function-zip.html
- **Relative price statements** were checked only as far as AWS states them in words, not by comparing price tables: gp3 "lowest cost SSD volume" (m1-024), HTTP APIs "offered at a lower price" (m1-036), DynamoDB Standard-IA "lower storage costs but higher costs for reads and writes" (m1-019), Graviton "best price performance" (m1-047). The claim in m1-024 that io2 costs more than gp3, and the cost ordering of the DR strategies in m1-022 and m1-049, rest on general knowledge.
- **Qualitative statements with no single source page:** "many smaller parts uploaded in parallel are usually faster" (m1-055), CloudFront speeding up uncached dynamic requests over the AWS backbone (m1-012), "Java runs on Arm without code changes" (m1-047).
- **Missing `DOCS` keys** (nothing added, as instructed): eleven mock1 questions have no `doc` because no key fits: OpenSearch Service (m1-004), AppFlow (m1-026), Directory Service (m1-027), Artifact (m1-029), Detective (m1-038), MemoryDB (m1-048), Compute Optimizer (m1-058), cost categories and tag policies (m1-062), EventBridge Scheduler (m1-065), and the two DR-strategy questions (m1-022, m1-049). m1-007 is about Cognito but points at `apigw` because there is no Cognito key. No tag was missing.

## Sources per question

`UG` = the service's user or developer guide on docs.aws.amazon.com. Ids in bold were the 29 knowledge-only ones.

| Id | Fact checked | Page |
|---|---|---|
| **m1-001** | Access point policies, VPC-only network origin, delegating access control from the bucket policy | S3 UG `access-points.html`, `access-points-policies.html` |
| m1-002 | Backlog-per-instance target tracking; 14-day maximum retention | Auto Scaling UG `as-using-sqs-queue.html`; SQS `quotas-messages.html` |
| **m1-003** | Multi-Attach only on io1/io2, Nitro, same AZ, needs a clustered file system | EBS UG `ebs-volumes-multi.html` |
| **m1-004** | UltraWarm is S3-backed, read-only, lower cost per GiB; ISM automates migration | OpenSearch `ultrawarm.html` |
| **m1-005** | Cross-account needs resource policy, customer managed key policy and identity policy; `aws/secretsmanager` cannot be used; replication is cross-Region in the same account | Secrets Manager `auth-and-access_examples_cross.html`, `replicate-secrets.html` |
| m1-006 | Storage-based replication, typical lag under 1 second, RTO in minutes, RPO in seconds | aws.amazon.com/rds/aurora/global-database/; Aurora UG `aurora-global-database-disaster-recovery.html` |
| m1-007 | User pool authorizer on REST APIs; social IdPs; identity pools issue temporary credentials | API Gateway `apigateway-integrate-with-cognito.html`; Cognito `cognito-identity.html` |
| **m1-008** | Zero-ETL makes data available in Redshift within seconds, no pipelines | aws.amazon.com/rds/aurora/zero-etl/; Aurora UG `zero-etl.html` |
| m1-009 | Compute Savings Plans span family, size, OS, tenancy, Region, Fargate and Lambda | Savings Plans UG `what-is-savings-plans.html` |
| m1-010 | HTTP/S retry policy is capped; messages are discarded without a DLQ | SNS `sns-message-delivery-retries.html` |
| **m1-011** | Delegated administrators create service-managed stack sets; StackSets creates the roles; automatic deployment to new accounts | CloudFormation `stacksets-orgs-delegated-admin.html`, `stacksets-concepts.html`, `stacksets-orgs-manage-auto-deployment.html` |
| m1-012 | Global Accelerator endpoints are NLB, ALB, EC2, Elastic IP only | Global Accelerator `about-endpoints.html` |
| **m1-013** | MRAP active-passive failover controls, traffic shifts in about 2 minutes; origin groups fail over only GET, HEAD, OPTIONS | S3 UG `MrapFailover.html`, `UsingFailover.html`; CloudFront `high_availability_origin_failover.html` |
| m1-014 | `aws:SourceVpce` deny policy; `aws:SourceIp` unusable through endpoints, `aws:VpcSourceIp` instead | S3 UG `example-bucket-policies-vpc-endpoint.html`; PrivateLink `vpc-endpoints-s3.html` |
| m1-015 | Intelligent-Tiering automatic tiers, no retrieval charges, monitoring charge | aws.amazon.com/s3/faqs/ |
| **m1-016** | `@connections` callback API for WebSocket APIs; cache TTL bounds | API Gateway `apigateway-how-to-call-websocket-api-connections.html`, `api-gateway-caching.html` |
| **m1-017** | Listener security policy defines protocols and ciphers; TLS 1.2+ and 1.3 policies exist | ELB `application/describe-ssl-policies.html` |
| m1-018 | Message groups, parallel groups, 5-minute deduplication | aws.amazon.com/sqs/faqs/ |
| m1-019 | Provisioned mode for predictable load; Standard-IA trades storage price for request price | DynamoDB `capacity-mode.html`; aws.amazon.com/dynamodb/faqs/ |
| **m1-020** | ALB mTLS verify mode, trust store, revocation, `X-Amzn-Mtls` headers; NLB has no mTLS | ELB `application/mutual-authentication.html`, `network/load-balancer-listeners.html` |
| **m1-021** | Cluster mode shards and replicas; mode can change from disabled to enabled; Memcached has no replication or sorted sets | ElastiCache `Replication.Redis-RedisCluster.html`, `modify-cluster-mode.html`, `SelectEngine.html` |
| m1-022, m1-049 | Pilot light keeps data live and app tier off; warm standby runs scaled down | DR whitepaper `disaster-recovery-options-in-the-cloud.html` |
| m1-023 | Rate-based rules, scope-down statements; 20 rules per NACL by default | WAF `waf-rule-statement-type-rate-based.html`; VPC `amazon-vpc-limits.html` |
| m1-024 | gp3 performance independent of size; type change without detaching | EBS UG `general-purpose.html`, `ebs-modify-volume.html` |
| m1-025 | Two readable standbys, failover typically under 35 seconds; DB instance standby is not readable | aws.amazon.com/rds/features/multi-az/; RDS UG `multi-az-db-clusters-concepts.html`, `Concepts.MultiAZSingleStandby.html` |
| **m1-026** | Salesforce connector, scheduled incremental transfer, encryption; AppFlow still open | AppFlow `salesforce.html`, `flow-triggers.html`, `what-is-appflow.html`; lifecycle lists |
| **m1-027** | AD Connector redirects requests "without caching any information in the cloud"; seamless domain join | Directory Service `directory_ad_connector.html`, `ad_connector_join_instance.html` |
| m1-028 | Retry and Catch on Task states | Step Functions `concepts-error-handling.html` |
| **m1-029** | Artifact gives on-demand PCI and SOC reports | Artifact `what-is-aws-artifact.html` |
| m1-030 | `price-capacity-optimized` recommended; `lowest-price` has the highest interruption risk | Auto Scaling UG `allocation-strategies.html` |
| m1-031 | Sorted sets and replication in Valkey, neither in Memcached | ElastiCache `SelectEngine.html` |
| **m1-032** | Service-linked role has no access to customer managed keys; `Client.InternalError: Client error on launch` | Auto Scaling UG `key-policy-requirements-EBS-encryption.html`, `ts-as-instancelaunchfailure.html` |
| **m1-033** | PITR up to 35 days at per-second granularity; streams keep 24 hours | DynamoDB `Point-in-time-recovery.html`, `Streams.html` |
| **m1-034** | 250 MB unzipped including layers, 5 layers, 10 GB images in ECR | Lambda `gettingstarted-limits.html`, `images-create.html` |
| **m1-035** | Lambda authorizer returns an IAM policy; API Gateway caches it | API Gateway `apigateway-use-lambda-authorizer.html` |
| **m1-036** | HTTP APIs cheaper with fewer features, native JWT authorizer; same price for edge-optimized and Regional; cache billed hourly | API Gateway `http-api-vs-rest.html`, `api-gateway-caching.html`; aws.amazon.com/api-gateway/pricing/ |
| **m1-037** | Clone, deploy, swap environment URLs; database must live outside the environment; deployment policy behaviour | Elastic Beanstalk `using-features.CNAMESwap.html`, `using-features.rolling-version-deploy.html` |
| **m1-038** | Behavior graph from CloudTrail, VPC Flow Logs, GuardDuty; up to a year of history; Detective still open | Detective `what-is-detective.html`; lifecycle lists |
| m1-039 | Lambda transformation and buffering in Firehose | Firehose `data-transformation.html` |
| m1-040 | Backup Audit Manager audits backup compliance; Organizations backup policies | AWS Backup `aws-backup-audit-manager.html`; Organizations `orgs_manage_policies_backup.html` |
| m1-041 | Private APIs through an interface endpoint, reachable over Direct Connect, `aws:SourceVpce` in the resource policy | API Gateway `apigateway-private-apis.html` |
| m1-042 | Aurora Serverless v2 scales to 0 ACUs with automatic pause and resume | Aurora UG `aurora-serverless-v2-auto-pause.html` |
| **m1-043** | Federated query connectors for DynamoDB and PostgreSQL (see changes) | Athena `federated-queries.html` |
| **m1-044** | Imported key material can be deleted manually; scheduled deletion waits 7 to 30 days; XKS depends on the external key manager; CloudHSM key stores use KMS-generated material | KMS `importing-keys.html`, `keystore-external.html`, `keystore-cloudhsm.html` |
| m1-045 | On-failure destinations carry request and response; DLQs carry only the event | Lambda `invocation-async-retain-records.html` |
| **m1-046** | Unused access analyzer covers unused roles, access keys, passwords, services and actions, organization-wide, with a delegated administrator | IAM UG `what-is-access-analyzer.html`, `access-analyzer-delegated-administrator.html`, `id_credentials_getting-report.html` |
| m1-047 | Graviton price-performance; unlimited mode bills surplus CPU | aws.amazon.com/ec2/graviton/; EC2 UG `burstable-performance-instances-unlimited-mode.html` |
| **m1-048** | MemoryDB: Valkey compatible, microsecond reads, single-digit-millisecond writes, Multi-AZ transaction log | MemoryDB `what-is-memorydb.html` |
| **m1-050** | Bot Control common level verifies desirable bots; targeted level uses browser interrogation, fingerprinting, behavior heuristics | WAF `waf-bot-control.html` |
| **m1-051** | Materialized views hold precomputed results and can autorefresh; one hour of free concurrency scaling credits per day; ALL copies the table to every node | Redshift `materialized-view-overview.html`, `materialized-view-refresh.html`, `concurrency-scaling.html`, `c_choosing_dist_sort.html`; aws.amazon.com/redshift/pricing/ |
| m1-052 | Endpoint policies control what can be reached through the endpoint and do not replace other policies | PrivateLink `vpc-endpoints-access.html`; SQS `sqs-internetwork-traffic-privacy.html` |
| m1-053 | Deep Archive standard retrieval within 12 hours; lifecycle minimum-duration rules | aws.amazon.com/s3/faqs/; S3 UG `lifecycle-transition-general-considerations.html` |
| m1-054 | Receiver bus permissions for an organization; sender rules target the other account's bus | EventBridge `eb-cross-account.html` |
| m1-055 | Transfer Acceleration through edge locations; parts are 5 MiB to 5 GiB; gateway endpoints unusable from VPN | aws.amazon.com/s3/faqs/; S3 UG `qfacts.html`; PrivateLink `vpc-endpoints-s3.html` |
| **m1-056** | MACsec is layer 2 on dedicated connections and LAGs with CKN/CAK; Direct Connect is not encrypted by default; VPN tunnel bandwidth (see changes) | Direct Connect `MACsec.html`, `encryption-in-transit.html`; VPN `VPC_VPN.html` |
| m1-057 | Target tracking with `ALBRequestCountPerTarget`; Auto Scaling group capacity providers are for EC2 workloads | ECS `service-autoscaling-targettracking.html`, `asg-capacity-providers.html` |
| m1-058 | Organization-wide opt-in from the management account; memory through the CloudWatch agent | Compute Optimizer `getting-started.html`, `ec2-metrics-analyzed.html` |
| m1-059 | Website endpoints need public content and do not support HTTPS; ACLs disabled by default | S3 UG `WebsiteEndpoints.html`, `about-object-ownership.html` |
| m1-060 | Aurora Auto Scaling adjusts the number of Aurora Replicas from CloudWatch targets | Aurora UG `Aurora.Integrating.AutoScaling.html` |
| **m1-062** | Tag policies define case and allowed values, can enforce, and report compliance; cost category split charges are proportional, fixed or even | Organizations `orgs_manage_policies_tag-policies.html`; Billing `splitcharge-cost-categories.html`, `manage-cost-categories.html` |
| m1-063 | Elastic throughput for spiky workloads, pay for data read and written; bursting baseline of 50 KiBps per GiB | EFS `performance.html` |
| m1-064 | Multi-AZ failover takes one to two minutes; 14-day SQS retention | aws.amazon.com/rds/faqs/; SQS `quotas-messages.html` |
| m1-065 | Universal targets; RDS stops for at most 7 consecutive days and still bills storage | EventBridge Scheduler `managing-targets-universal.html`; RDS UG `USER_StopInstance.html` |
