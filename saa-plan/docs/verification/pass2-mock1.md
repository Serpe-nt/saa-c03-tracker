# Second verification pass: mock set 1 (`site/quiz/mock1.js`)

Date: 2026-10-12. An independent second read of all 65 questions by a session that neither wrote nor first-checked them. Every fact below was read in the text of a page fetched from `docs.aws.amazon.com` or `aws.amazon.com` (Node `fetch`, tags stripped, the matching sentence or table row read; page title and length checked so that a redirect to a guide's landing page was not taken for a hit). No web search was used. The first-pass log (`mock1.md`) was used only as a list of things to look at harder.

## Result

| | |
|---|---|
| Questions checked | 65 of 65 |
| Questions changed | 38 (33 with text changes, 5 with only a `doc` key) |
| Answer keys changed | 0 |
| Keyed option reworded | 1 (m1-042, service name only, same index) |
| `doc` keys set or changed | 15 (11 added, 4 repointed) |
| Domains, tags, refs changed | 0 |
| Not reached | none |

Checks after the edits: `node --test` 33/33 pass; `node tools/qstats.mjs mock1` reports 65 questions, 20/17/15/13, 10 Choose two, "keyed option clearly longest: 0"; `node tools/similar.mjs 0.38` lists the same 5 day-pool pairs as before and none that involves mock1.

## Needs the owner's attention

- **m1-048 (MemoryDB, key kept).** Two things changed around this question. ElastiCache for Valkey now has a durability option (Multi-AZ transactional log; with synchronous writes "no acknowledged data is lost during failover"), and the MemoryDB FAQ now says "We recommend using ElastiCache for new workloads." MemoryDB is also not on the SAA-C03 in-scope services list (the list calls itself non-exhaustive). The key still holds for the options as written, because the ElastiCache option has only replicas and automatic failover, which replicate asynchronously. The explanation of that option no longer says ElastiCache "is designed as a cache, not a durable primary database". Consider rewriting or retiring the question. Sources: https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/durability.html, https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Replication.html, https://aws.amazon.com/memorydb/faqs/, https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html
- The same finding touches other files that this session may not edit: any caching or purpose-built-database question, drill item, cue, glossary term or key point that says ElastiCache cannot be a durable store. A note is in the shared notes folder (`pass2-mock1-findings.md`).

## Changed questions

One line per id: what was wrong or missing, and the page.

- **m1-001** stem said the bucket policy had "thousands of lines" while "close to its size limit"; the limit is 20 KB, so now "hundreds". The ACL explanation said ACLs "cannot restrict access to specific VPCs" with no source; it now rests on what an ACL can hold (a grantee that is an AWS account or predefined group, a finite set of permissions). https://docs.aws.amazon.com/general/latest/gr/s3.html, https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html, https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html
- **m1-004** `doc` added (`opensearch`).
- **m1-006** binlog distractor claimed "lag grows under heavy write load and promotion takes longer"; neither is on a page. Now says what is documented: engine-level replication with more lag across Regions, against storage-layer replication typically under a second. https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Replication.CrossRegion.html
- **m1-007** identity pool distractor reworded to the documented split (identity pool exchanges a token for temporary credentials; the user pool is the user directory). `doc` changed from `apigw` to `cognito`. https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html
- **m1-009** `doc` changed from `ec2-pricing` to `savings-plans`.
- **m1-011** permission set distractor said the roles have "a trust policy for the identity provider"; the page states a generated name suffix and that custom trust policies are beyond permission sets. `doc` changed from `organizations` to `cloudformation`. https://docs.aws.amazon.com/singlesignon/latest/userguide/referencingpermissionsets.html, https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html
- **m1-012** "Transfer Acceleration does no caching" and "Global Accelerator does not cache content" had no source. Now: Transfer Acceleration routes transfers to the bucket over an optimized path; Global Accelerator endpoints are load balancers, EC2 instances or Elastic IPs, and it proxies packets to the Region. The keyed explanation on dynamic content now quotes what AWS states (edge locations connected over the AWS network backbone, persistent connections to the origin). https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html, https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints.html, https://aws.amazon.com/global-accelerator/faqs/, https://aws.amazon.com/cloudfront/faqs/, https://aws.amazon.com/cloudfront/features/
- **m1-013** "Transfer Acceleration only speeds up long-distance transfers" reworded to the documented description (a bucket-level feature). https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html
- **m1-014** `aws:SourceIp` explanation now matches the page: the key cannot be used for requests that traverse a VPC endpoint; `aws:VpcSourceIp` is used instead. https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html
- **m1-017** "WAF inspects HTTP requests after the TLS handshake" had no source. Now rests on the list of request components WAF can inspect, which has no TLS protocol version, and on the listener security policy defining protocols and ciphers. https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-fields-list.html, https://docs.aws.amazon.com/elasticloadbalancing/latest/application/describe-ssl-policies.html
- **m1-020** same WAF sentence replaced by reasoning about the option itself (a header check is not chain validation). Cognito distractor now says what the page says: unauthenticated users are redirected to the identity provider's sign-in. The NLB distractor is backed as written ("Network Load Balancers do not support mutual TLS authentication"). https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-authenticate-users.html, https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html
- **m1-021** "Memcached stores only simple string values" tightened to the comparison table (data types simple, sorted sets no, replication no for node-based Memcached). https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/SelectEngine.html
- **m1-022**, **m1-049** explanations said asynchronous replication "keeps the RPO within seconds"; no page gives a lag figure for cross-Region read replicas (the RDS guide says to expect more lag across Regions). Now: the replica is updated continuously, so only its replication lag is at risk. `doc` added (`dr`). https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.XRgn.html, https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html
- **m1-023** network ACL distractor "cannot react automatically" reworded to what is documented (static rules, default quota of 20). Keyed explanation notes that AWS WAF now writes "protection pack (web ACL)". https://docs.aws.amazon.com/vpc/latest/userguide/amazon-vpc-limits.html, https://docs.aws.amazon.com/waf/latest/developerguide/web-acl.html
- **m1-026** DataSync distractor now rests on the list of supported storage systems instead of "cannot extract records". `doc` added (`appflow`). https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html
- **m1-027** Identity Center distractor now says what is documented (permission sets are assigned to users and groups for AWS accounts). `doc` added (`directory`). https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html
- **m1-029** "Security Hub CSPM (formerly AWS Security Hub)" once, because the exam guide still prints the old name. `doc` added (`artifact`). https://aws.amazon.com/security-hub/faqs/
- **m1-033** "Global tables replicate every write within seconds": the page says asynchronous replication with no figure, so the figure is gone. https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html
- **m1-035** "WAF ... cannot validate a token with the token service" replaced by reasoning about the option (a presence check validates nothing).
- **m1-036** "The endpoint type does not change the per-request price" is a price comparison that the pricing page shows only as placeholders; replaced by the fact that every request is still a REST API request. https://aws.amazon.com/api-gateway/pricing/
- **m1-038** Inspector and Macie distractors said what the services "do not" do; they now state the documented scope and why that does not answer the investigation. `doc` added (`detective`). https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html, https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html
- **m1-039** "Firehose is serverless" is not how the guide describes it ("fully managed"). "Glue crawlers ... cannot read from an SQS queue" now rests on the list of supported data stores, which has no queue. https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html, https://docs.aws.amazon.com/glue/latest/dg/crawler-data-stores.html
- **m1-042** keyed option and its explanation said "Aurora Serverless v2"; the guide now says "Aurora serverless". The explanation carries "(formerly Aurora Serverless v2)" once, and "scales up within seconds" became the documented "adjusts capacity automatically with demand". https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html, https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html
- **m1-043** "the S3 data still could not be joined from PostgreSQL" had no source; replaced by what the option leaves out.
- **m1-047** "Java runs on Arm without code changes" replaced by AWS's own sentence (applications in interpreted or JIT languages, including Java, "should run as-is or with only minor modifications"). "Larger instances cost roughly the same per vCPU" (a price claim) and "typically deliver a larger improvement" (inferred) removed. https://aws.amazon.com/ec2/graviton/getting-started/, https://aws.amazon.com/ec2/graviton/
- **m1-048** see "Needs the owner's attention". `doc` added (`memorydb`).
- **m1-050** keyed explanation aligned with the page ("verifies generally desirable bots", "browser interrogation, fingerprinting, and behavior heuristics", bots that do not self-identify) and notes the "protection pack (web ACL)" label. https://docs.aws.amazon.com/waf/latest/developerguide/waf-bot-control.html
- **m1-052** `doc` changed from `vpc` to `endpoints`.
- **m1-054** SNS distractor said the state machine "would need custom code to poll the queue". No page backs that as an absolute (EventBridge Pipes exists for point-to-point integrations between supported sources and targets). Now says what the option leaves out. https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes.html
- **m1-055** "many smaller parts uploaded in parallel are usually faster" replaced by the documented benefit ("You can upload parts in parallel to improve throughput"). https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html
- **m1-056** keyed explanation said MACsec runs "at line rate"; the pages state that MACsec is supported on 10, 100 and 400 Gbps dedicated connections and encrypts all traffic on the link, so it now says that. LAG distractor: MACsec keys can be associated with a LAG, so "does not encrypt" became "aggregation by itself does not encrypt". https://docs.aws.amazon.com/directconnect/latest/UserGuide/MACsec.html, https://docs.aws.amazon.com/directconnect/latest/UserGuide/lags.html
- **m1-058** "Config ... has no utilization data" replaced by what the approved-list rule checks. `doc` added (`compute-optimizer`). https://docs.aws.amazon.com/config/latest/developerguide/desired-instance-type.html
- **m1-060** "Cross-Region replicas are not added or removed automatically" replaced by the documented fact that a cross-Region read replica is a separate DB cluster. https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Replication.CrossRegion.html
- **m1-061** "Standard replication ... has no 15-minute guarantee or SLA" replaced by the documented behaviour (most objects within 15 minutes, large objects up to several hours; storage metrics once per day). "DataSync ... no replication SLA" replaced by a documented limit: a scheduled task cannot run more often than once an hour. https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-troubleshoot.html, https://docs.aws.amazon.com/AmazonS3/latest/userguide/cloudwatch-monitoring.html, https://docs.aws.amazon.com/datasync/latest/userguide/task-scheduling.html
- **m1-062** `doc` added (`tag-policies`).
- **m1-064** cache distractor said cached orders are "lost on node failure" and that a cache "is not a durable write queue"; with the durability option this is too absolute. Now: entries can be evicted and nothing writes them to the database.
- **m1-065** `doc` added (`scheduler`).

## Wrong-option claims rewritten because no page backs them

Each of these said that a service cannot do, does not do or lacks something, and no sentence or authoritative list was found for it. The explanation now says only what is documented, or argues from what the option itself leaves out.

| Id | Claim removed |
|---|---|
| m1-006 | binlog lag "grows under heavy write load", "promotion takes longer" |
| m1-012 | Transfer Acceleration "does no caching"; Global Accelerator "does not cache content" |
| m1-013 | Transfer Acceleration "only" speeds up transfers |
| m1-017, m1-020 | WAF "inspects HTTP requests after the TLS handshake", so it "cannot" see the protocol or validate a chain |
| m1-020 | Cognito authentication "does not verify" client certificates |
| m1-023 | network ACLs "cannot react automatically" |
| m1-027 | Identity Center "does not join EC2 instances to a Windows domain" |
| m1-035 | WAF "cannot validate a token with the token service" |
| m1-036 | endpoint type "does not change the per-request price" |
| m1-038 | Inspector "does not analyze API activity"; Macie "does not trace a role's API calls" |
| m1-043 | S3 data "could not be joined from PostgreSQL" |
| m1-047 | larger instances "cost roughly the same per vCPU" |
| m1-048 | ElastiCache "is designed as a cache, not a durable primary database" (now false) |
| m1-054 | the state machine "would need custom code to poll the queue" |
| m1-058 | Config "has no utilization data" |
| m1-060 | cross-Region replicas "are not added or removed automatically" |
| m1-061 | standard replication and DataSync have "no SLA" |
| m1-064 | a cache "is not a durable write queue" |

Negative claims that were kept because a page states them or an authoritative list shows the absence: instance store volumes cannot move between instances (m1-003); the AWS managed key cannot be used cross-account and its policy cannot be changed (m1-005); SNS discards messages after the HTTP/S retry policy, at most 3,600 seconds (m1-002, m1-010); SCPs never grant permissions and do not affect principals outside the organization (m1-011, m1-052); origin groups fail over only GET, HEAD and OPTIONS (m1-013); a CNAME must equal the bucket name (m1-013); an endpoint policy does not replace other policies (m1-014); NLBs do not support mTLS (m1-020); Memcached has no sorted sets or replication (m1-021, m1-031); security group rules are protocol, port and source only (m1-023); a Multi-AZ DB instance standby cannot serve reads (m1-025); DataSync locations are file and object stores (m1-026); layers count toward the 250 MB limit (m1-034); gateway endpoints exist for S3 and DynamoDB and are not usable from the far side of a VPN (m1-041, m1-055); key material cannot be imported into a CloudHSM key store key (m1-044); dead-letter queues receive only the event (m1-045); the credential report lists users (m1-046); Direct Connect does not encrypt by default (m1-056); website endpoints serve only public content (m1-059); Multi-Attach is io1/io2 only (m1-063); read replicas are read-only (m1-064).

## First-pass doubts, now settled

- **m1-012** CloudFront and dynamic content: sourced (CloudFront FAQ and features page).
- **m1-047** Java on Arm: sourced (Graviton getting-started page), and the explanation now carries AWS's qualifier.
- **m1-055** parallel parts: sourced (multipart upload overview).
- **m1-021** unchanged. Changing cluster mode needs automatic failover and at least one replica first; the keyed options describe the end state and do not claim one step. https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/modify-cluster-mode.html
- **m1-034** unchanged. Quotas confirmed (250 MB unzipped including layers, five layers, 10 GB image). The quota page also confirms the 15-minute limit is for standard functions (90 minutes for Lambda Managed Instances invoked asynchronously); mock1 mentions 15 minutes only inside two distractor options (m1-028, m1-045), never as an absolute in an explanation.

## Still uncertain

Out-of-scope categories, counted and not listed, as the owner decided:

- Price comparisons: 9 questions have a key or an explanation that depends on one price being lower than another. AWS states the direction in words for 6 of them; none was checked against a price table.
- Lead times: 0.
- Figures on which AWS's own pages disagree: 2 (Aurora Global Database recovery time, S3 RTC percentage). Both explanations use the more conservative figure.
- `ref` against Skill Builder lessons: all 65, not opened.

Keys that depend on one of these: m1-019 (provisioned capacity with auto scaling costs less than on-demand for steady traffic), m1-022 and m1-049 (cost ordering of the DR strategies), m1-024, m1-030, m1-036, m1-053, m1-004 and m1-047 (direction stated by AWS in words). No page contradicts any of them, so none was rewritten.

In scope but not fully closed:

- **m1-022, m1-049**: both stems require an RPO under 1 minute and are keyed on a cross-Region read replica. No page gives a typical lag for RDS cross-Region replicas. The keys stand on the other options failing (backups are periodic; active/active is ruled out by cost), not on a documented figure.
- **m1-056**: the stem asks for encryption "at close to the full line rate". The pages say MACsec is supported on 100 Gbps dedicated connections but give no throughput statement. The VPN distractor is excluded by the documented tunnel bandwidth (1.25 Gbps, 5 Gbps with a Large Bandwidth Tunnel).
- **m1-048**: see "Needs the owner's attention".
- **m1-047**: "best price performance" is AWS's own claim on the Graviton page, not a measured comparison with the newest x86 generation.

## Not reached, and gaps

- Not reached: none.
- No missing tag. No missing `doc` key: all eleven questions the first pass listed without a `doc` now have one.

## Pages read for the unchanged questions

`UG` = the service's guide on docs.aws.amazon.com.

| Id | Confirmed | Page |
|---|---|---|
| m1-002 | backlog per instance (queue length divided by InService instances), `ApproximateNumberOfMessagesVisible` in the metric math example, 14-day retention, deregistration delay | Auto Scaling UG `as-using-sqs-queue.html`, `ec2-auto-scaling-target-tracking-metric-math.html`; SQS `quotas-messages.html`; ELB `edit-target-group-attributes.html` |
| m1-003 | Multi-Attach on io1/io2, Nitro, same AZ, clustered file system | EBS UG `ebs-volumes-multi.html`; EC2 UG `instance-store-lifetime.html` |
| m1-005 | resource policy, customer managed key and identity policy for cross-account; replica keeps the account ID | Secrets Manager `auth-and-access_examples_cross.html`, `replicate-secrets.html`; KMS `concepts.html` |
| m1-008 | data in Redshift within seconds, no pipelines | aws.amazon.com/rds/aurora/zero-etl/; Aurora UG `zero-etl.html` |
| m1-010 | discard after the retry policy; fan-out to queues | SNS `sns-message-delivery-retries.html` |
| m1-015 | three automatic tiers, no retrieval charges, monitoring charge; retrieval charge on the IA classes | S3 UG `intelligent-tiering-overview.html`, `storage-class-intro.html`; aws.amazon.com/s3/storage-classes/ |
| m1-016 | `@connections`; cache TTL 0 to 3600 seconds | API Gateway `apigateway-how-to-call-websocket-api-connections.html`, `api-gateway-caching.html` |
| m1-018 | strict order per message group, 5-minute deduplication window | SQS `using-messagegroupid-property.html`, `using-messagededuplicationid-property.html`, `standard-queues.html` |
| m1-019 | provisioned for steady, forecastable load; Standard-IA "lower storage costs but higher costs for reads and writes" | DynamoDB `capacity-mode.html`, `AutoScaling.html`; aws.amazon.com/dynamodb/faqs/ |
| m1-024 | gp3 "20% lower price per GB than gp2", type change without detaching, size cannot decrease | aws.amazon.com/ebs/general-purpose/; EBS UG `ebs-modify-volume.html`, `hdd-vols.html` |
| m1-025 | two readable standbys, typically under 35 seconds, standby not readable | RDS UG `multi-az-db-clusters-concepts.html`, `Concepts.MultiAZSingleStandby.html`; aws.amazon.com/rds/features/multi-az/ |
| m1-028 | Retry and Catch | Step Functions `concepts-error-handling.html` |
| m1-030 | `price-capacity-optimized` recommended, `lowest-price` not recommended | Auto Scaling UG `allocation-strategies.html`; EC2 UG `spot-best-practices.html` |
| m1-031 | sorted sets and replication | ElastiCache `SelectEngine.html` |
| m1-032 | service-linked role has no access to customer managed keys; error text | Auto Scaling UG `key-policy-requirements-EBS-encryption.html`, `ts-as-instancelaunchfailure.html` |
| m1-034 | quotas | Lambda `gettingstarted-limits.html`, `images-create.html`, `configuration-filesystem-efs.html` |
| m1-037 | deployment policies; CNAME swap; database outside the environment | Elastic Beanstalk `using-features.rolling-version-deploy.html`, `using-features.CNAMESwap.html` |
| m1-040 | backup policies, cross-Region copy, Backup Audit Manager reports | Organizations `orgs_manage_policies_backup.html`; AWS Backup `cross-region-backup.html`, `aws-backup-audit-manager.html` |
| m1-041 | private API through an interface endpoint, Direct Connect, `aws:SourceVpce` | API Gateway `apigateway-private-apis.html`; PrivateLink `gateway-endpoints.html` |
| m1-044 | delete imported material at once, 7 to 30 day waiting period, external key manager availability, no import into CloudHSM key store keys | KMS `importing-keys-delete-key-material.html`, `deleting-keys.html`, `keystore-external.html`, `keystore-cloudhsm.html` |
| m1-045 | destination record holds request and response; DLQ only the event | Lambda `invocation-async-retain-records.html`, `invocation-async-error-handling.html` |
| m1-046 | unused roles, access keys, passwords, services and actions; delegated administrator | IAM UG `what-is-access-analyzer.html`, `access-analyzer-delegated-administrator.html`, `id_credentials_getting-report.html` |
| m1-051 | precomputed results, autorefresh, free concurrency scaling credits, ALL distribution | Redshift `materialized-view-overview.html`, `materialized-view-refresh.html`, `c_choosing_dist_sort.html`; aws.amazon.com/redshift/pricing/ |
| m1-053 | Deep Archive "lowest cost storage ... retrieval within 12 hours"; optional archive tiers | aws.amazon.com/s3/faqs/; S3 UG `intelligent-tiering-overview.html` |
| m1-057 | Service Auto Scaling through Application Auto Scaling; capacity providers for EC2 workloads | ECS `service-auto-scaling.html`, `service-autoscaling-targettracking.html`, `asg-capacity-providers.html` |
| m1-059 | presigned URL uses the creator's credentials for a limited time | S3 UG `ShareObjectPreSignedURL.html`, `WebsiteEndpoints.html` |
| m1-063 | Elastic throughput for spiky workloads, pay for data read or written; 50 KiBps per GiB baseline | EFS `performance.html` |
