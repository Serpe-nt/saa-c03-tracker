# Second verification pass: mock set 2 (`site/quiz/mock2.js`)

Date: 2026-10-12

Method: an independent second read of all 65 questions by a session that neither wrote nor first-checked them. Every stem, option and explanation was compared with pages fetched the same day from `docs.aws.amazon.com` and `aws.amazon.com` (a Node script fetched each page, stripped the markup and printed the sentences that matched). A fact counts as confirmed only when the sentence or table row was found in the page text. Pages that answered with a redirect to a guide's landing page were treated as missing and another page was found. No subagents were used. The first-pass log (`mock2.md`) was used only as a list of things to look at harder.

## Totals

| | Count |
|---|---|
| Questions checked | 65 of 65 |
| Questions changed | 29 (25 with reworded explanations, 4 with only a `doc` key added) |
| Answer keys changed | 0 |
| Stems or options changed | 0 |
| `dom` changed | 0 |
| Not reached | 0 |

Every keyed answer was confirmed as the best answer against a fetched page. All changes are in explanations (`x`) and `doc`.

## Changed questions

- **m2-001** – the prefix-list distractor said "any CloudFront distribution, including one an attacker creates, can still reach it". The page says only that the list admits all CloudFront origin-facing servers; reworded to that. https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/LocationsOfEdgeServers.html
- **m2-002** – keyed explanation now adds that usage plan throttles are applied on a best-effort basis ("not hard limits"). https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html
- **m2-003** – Transfer Acceleration distractor said same-Region uploads "gain little or nothing" (not on a page). Now: designed for transfers over long distances through edge locations. https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html
- **m2-004** – "storage is billed only for the pages that each clone changes" was too narrow: additional storage is allocated when the source or the clone changes data. https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html
- **m2-008** – Session Manager distractor claimed "no built-in rate or error control" (see section below). `doc:"ssm"` added. https://docs.aws.amazon.com/systems-manager/latest/userguide/send-commands-multiple.html
- **m2-014** – both certificate distractors now quote AWS instead of an inferred rule (see "First-pass doubts"). https://docs.aws.amazon.com/acm/latest/userguide/troubleshooting-DNS-validation.html , https://aws.amazon.com/private-ca/faqs/
- **m2-015** – FSx for Lustre distractor (see section below). https://aws.amazon.com/fsx/lustre/faqs/ , https://aws.amazon.com/fsx/when-to-choose-fsx/
- **m2-016** – ID-token distractor (see section below). `doc:"cognito"` added. https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv.html , https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html
- **m2-018** – keyed explanation said Memcached "deliberately omits persistence and replication" and that keys are "distributed by the client"; neither was found. Now: nodes found through auto discovery, no native replication or failover. https://aws.amazon.com/elasticache/faqs/ , https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/AutoDiscovery.html
- **m2-022** – keyed explanation reworded so it holds whichever way S3 fills in the KMS key condition for uploads without encryption headers (see "First-pass doubts"). https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html , https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html , https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html
- **m2-023** – Firehose distractor said results arrive "minutes late"; the buffer interval can be 0 to 900 seconds. Reworded to the once-a-minute query and the missing windowed state. `doc:"flink"` added. https://aws.amazon.com/firehose/faqs/
- **m2-024** – S3 distractor said latency is "typically tens to hundreds of milliseconds"; the page says roughly 100–200 milliseconds for small objects. https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html
- **m2-026** – maximum-price distractor said interruptions are "not because of your maximum price". Price is one of the three documented interruption reasons. Now: a request is capped at the On-Demand price by default and instances with a specified maximum price are interrupted more often. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-interruptions.html , https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-requests.html
- **m2-032** – Classic Load Balancer distractor (see section below). https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/introduction.html , https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html
- **m2-033** – Firehose distractor (see section below). https://docs.aws.amazon.com/firehose/latest/APIReference/API_Operations.html
- **m2-035** – VPN appliance distractor claimed "per-tunnel bandwidth limits" for software appliances on EC2 (not on a page); now says throughput is bounded by the instances. Peering, Transit Gateway and PrivateLink charges confirmed in words. https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html
- **m2-037** – Glue distractor (see section below). https://docs.aws.amazon.com/glue/latest/dg/add-job.html
- **m2-039** – `doc:"parameter-store"` added. Facts confirmed: standard tier "No additional charge", customer managed key for SecureString, ECS `secrets`. https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-advanced-parameters.html
- **m2-040** – cross-Region copy distractor said "the same standard snapshot price" (prices differ by Region); now "again a standard-tier snapshot". Archive tier facts confirmed: up to 75% lower, 90 days, restore up to 72 hours. https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-archive-considerations.html
- **m2-041** – failover distractor said failover routing "supports one primary and one secondary per record"; the page says records can point to a tree of records. Now: active-passive, latency never considered. https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-failover.html
- **m2-046** – Trusted Advisor distractor (see section below). https://docs.aws.amazon.com/awssupport/latest/user/organizational-view.html
- **m2-047** – `doc:"opensearch"` added. Confirmed: the integration is an OpenSearch Ingestion pipeline that loads an export and then reads DynamoDB Streams "in near real time". https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/OpenSearchIngestionForDynamoDB.html
- **m2-048** – removed "available since late 2025" for the regional NAT gateway (the date is on no page I fetched). https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html
- **m2-050** – Firehose and MediaConvert distractors (see section below). `doc:"kvs"` added. Key re-confirmed, see "m2-050".
- **m2-052** – EventBridge distractor (see section below). https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEventsRequestEntry.html
- **m2-054** – keyed explanation said AWS manages "replication across AZs" for Keyspaces (not found); now "no servers to provision, patch, or manage". `doc:"keyspaces"` added. https://aws.amazon.com/keyspaces/faqs/
- **m2-063** – `doc:"mq"` added. Confirmed: JMS, AMQP, STOMP, MQTT, OpenWire; active/standby is two brokers in two Availability Zones. https://aws.amazon.com/amazon-mq/faqs/ , https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-broker-architecture.html
- **m2-064** – Wavelength distractor said zones sit "inside telecom carriers' 5G networks to serve mobile devices"; the guide now says "the edge of communications service providers' (CSP) networks" with a carrier gateway for traffic from the carrier network. Reworded. Los Angeles Local Zone row lists G4dn and G5. https://docs.aws.amazon.com/wavelength/latest/developerguide/what-is-wavelength.html , https://aws.amazon.com/about-aws/global-infrastructure/localzones/features/
- **m2-065** – `doc:"cost-anomaly"` added. Confirmed: machine learning models, root causes, individual alerts and daily or weekly summaries. https://docs.aws.amazon.com/cost-management/latest/userguide/manage-ad.html

## Wrong-option claims rewritten because no page backs them

| Id | Claim that was removed | What the explanation says now |
|---|---|---|
| m2-001 | "any CloudFront distribution, including one an attacker creates, can still reach it" | the prefix list admits all CloudFront origin-facing servers, and the ALB stays internet-facing |
| m2-008 | Session Manager has "no built-in rate or error control" | concurrency and error thresholds are Run Command settings |
| m2-014 | "Public certificate authorities do not issue certificates for internal names" (a CA/Browser Forum rule) | AWS's own sentence: public certificates "are strictly limited to identifying resources with public DNS names" |
| m2-015 | FSx for Lustre "does not serve Windows SMB shares with Active Directory permissions" | Linux clients mount it with the Lustre client over its own protocol, not SMB |
| m2-016 | S3 "does not accept Cognito JWTs as authorization" | AWS API requests are authenticated by a Signature Version 4 signature made with AWS credentials; a token must be exchanged for them |
| m2-032 | Classic Load Balancer has "no static IP addresses and less capacity to absorb sudden spikes" | it is the previous generation; one static or Elastic IP address per AZ is a Network Load Balancer capability |
| m2-033 | Firehose "offers no per-consumer, ordered stream reading" | it is a delivery service that writes buffered batches to a destination (its API has only put operations) |
| m2-035 | software VPN appliances have "per-tunnel bandwidth limits" | throughput is bounded by the instances |
| m2-037 | Glue "does not let you use Spot Instances" | the Glue version determines the Spark version, and a serverless job has no cluster instances to buy as Spot |
| m2-046 | Trusted Advisor "cannot evaluate resources with the company's own set of parameterized Config rules" | the organizational view aggregates Trusted Advisor's own checks |
| m2-050 | Firehose "provides no live viewing, time-indexed playback, or image extraction"; MediaConvert "does not ingest live streams" | those are Kinesis Video Streams features; MediaConvert is "a file-based video processing service" for offline content |
| m2-052 | "EventBridge does not preserve event order or deduplicate retried publishes" | a PutEvents entry has no message group ID or deduplication ID (fields: Detail, DetailType, EventBusName, Resources, Source, Time, TraceHeader) |

## Wrong-option "cannot" claims kept, with the page that backs them

- m2-006: Kinesis data streams have no dead-letter queue or redrive policy. The Kinesis Data Streams API action list has none; redrive policies are an SQS queue setting. https://docs.aws.amazon.com/kinesis/latest/APIReference/API_Operations.html
- m2-007: a single partition is capped at 3,000 RCUs and 1,000 WCUs; with DAX "data is first written to the DynamoDB table"; 10 GB item collection limit with an LSI. https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/burst-adaptive-capacity.html , https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.concepts.html
- m2-011: "You cannot create, modify, share, or delete an AWS-managed prefix list." https://docs.aws.amazon.com/vpc/latest/userguide/working-with-aws-managed-prefix-lists.html
- m2-013: Multi-Attach only for instances "in the same Availability Zone"; standard file systems are not designed for simultaneous access. https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes-multi.html
- m2-014, m2-036: "ACM does not provide managed renewal for imported certificates"; website endpoints "can't use OAC". https://docs.aws.amazon.com/acm/latest/userguide/import-certificate.html , https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
- m2-016: a user pool is not among the principal types of the Principal element. https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html
- m2-019: Lambda is not in the list of resources shareable through AWS RAM; "An endpoint policy does not override or replace identity-based policies or resource-based policies." https://docs.aws.amazon.com/ram/latest/userguide/shareable.html , https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html
- m2-021: "A read replica is a read-only copy of a DB instance." https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html
- m2-024: "Memcached does not support replication or failover natively." https://aws.amazon.com/elasticache/faqs/
- m2-032: Application Load Balancer listener protocols are HTTP and HTTPS. https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html
- m2-034: the password policy options contain no MFA setting; `aws:MultiFactorAuthPresent` "is not present" with long-term credentials. https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_passwords_account-policy.html , https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html
- m2-038: "You cannot use MFA delete with lifecycle configurations." https://docs.aws.amazon.com/AmazonS3/latest/userguide/MultiFactorAuthenticationDelete.html
- m2-044: `DestinationConfig` of an event source mapping is for "Kinesis, DynamoDB Streams, Amazon MSK, and self-managed Apache Kafka", not SQS. https://docs.aws.amazon.com/lambda/latest/api/API_CreateEventSourceMapping.html
- m2-046: "you cannot deploy rules through an aggregator". https://docs.aws.amazon.com/config/latest/developerguide/aggregate-data.html
- m2-048: gateway endpoints are for Amazon S3 and DynamoDB. https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html
- m2-056: "GuardDuty doesn't manage your flow logs or make them accessible in your account." https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_data-sources.html
- m2-060: resources in a peered VPC "can't use the Direct Connect connection"; participants "cannot work with route tables". https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html , https://docs.aws.amazon.com/vpc/latest/userguide/vpc-share-limitations.html
- m2-061: "After a log group is created, its log class can't be changed"; the classes "differ in ingestion costs only". https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html
- m2-062: Firehose "requires a schema" in the Glue Data Catalog for format conversion, and its sources are Direct PUT, Kinesis Data Streams and Amazon MSK. https://docs.aws.amazon.com/firehose/latest/dev/record-format-conversion.html , https://docs.aws.amazon.com/firehose/latest/dev/create-name.html

## First-pass doubts

- **m2-014 – settled.** AWS states both halves directly: "Public certificate issuance using ACM DNS validation requires that the domain records be resolvable over the public internet", and private certificates "can include information prohibited in public certificates, which are strictly limited to identifying resources with public DNS names". The explanations now use these.
- **m2-016 – settled.** "Users per account … 5,000" is in the General Reference. The explanation still gives no number. https://docs.aws.amazon.com/general/latest/gr/iam-service.html
- **m2-022 – not settled by a page; the explanation now holds under either reading.** What the pages say:
  - S3's example for one specific key is a Deny with `ArnNotEqualsIfExists` on `s3:x-amz-server-side-encryption-aws-kms-key-id`, described as: objects "can't be written to the bucket if they haven't been encrypted with the specified KMS key", even when encrypted "by using a per-request header or bucket default encryption".
  - The SSE-KMS page says "the AWS KMS key ID that Amazon S3 uses for object encryption must match the AWS KMS key ID in the policy, otherwise Amazon S3 denies the request". Both sentences read as if S3 evaluates the key it will actually use, including the bucket default.
  - The same page describes a `Null` condition on that key as denying uploads when "the request does not include an x-amz-server-side-encryption-aws-kms-key-id header", which reads as if the key reflects the request header only.
  - IAM: a negated operator is true when the key is not present, and with `…IfExists` in a Deny "the request is still denied even if the condition key is not present".
  - No page says what happens to an upload without encryption headers when the bucket default is the approved key. The explanation therefore states the documented pattern and tells the learner to test header-less uploads, which "may be denied". The key itself (a bucket policy Deny) is correct under both readings. It has still not been tried against a live bucket.

## m2-050 (reworded by the first pass)

Re-checked from scratch; the key holds.
- Kinesis Video Streams: "Automated real-time image generation - Configure Kinesis Video Streams to automatically extract images from video data in real time … and deliver the images to an S3 bucket". https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/images.html
- HLS "either for live playback or to view archived video". https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/how-playback.html
- "capture massive amounts of live video data from millions of sources"; durably stores and indexes media. https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/what-is-kinesis-video.html , https://aws.amazon.com/kinesis/video-streams/faqs/
- Rekognition image analysis returns a Person label with bounding boxes. https://docs.aws.amazon.com/rekognition/latest/dg/labels-detect-labels-image.html
- "Streaming Video and Bulk Image Analysis features will no longer be available to new customers, effective April 30, 2026." https://docs.aws.amazon.com/rekognition/latest/dg/rekognition-availability-changes.html
- Kinesis Video Streams is on none of the three lifecycle lists.

## Other first-pass changes, re-read

m2-004, m2-026, m2-027, m2-029, m2-039, m2-057, m2-061 and m2-062 hold as the first pass left them (m2-026 got one further fix, above). m2-051 depends on a price comparison, see below.

## AWS changes lists

- Names: "Aurora serverless (formerly Aurora Serverless v2)" and "AWS Security Hub CSPM (formerly AWS Security Hub)" are in place. The exam guide's in-scope list prints "AWS Security Hub", "Amazon Data Firehose", "Amazon Kinesis", "Amazon Quick" and "AWS Application Migration Service"; it has no entry for Kinesis Data Analytics, so m2-023 carries no "formerly". https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html
- No keyed option uses a service on the maintenance, sunset or full-shutdown lists. https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html
- "15 minutes" appears as a limit only in m2-062 ("a standard Lambda function's 15-minute timeout"); elsewhere it is a setting in an option or a load interval. The log-class statement in m2-061 and the regional NAT gateway note in m2-048 match the pages.

## Still uncertain

- Out-of-scope categories (counted, not listed): price comparisons that AWS does not state in words: 5 questions; lead times: 0; figures on which AWS pages disagree: 0; `ref` against Skill Builder lesson content: all 65, not evaluated.
- Two keys depend on a price comparison: **m2-009** (One Zone-IA against Glacier Instant Retrieval at one read a month) and **m2-051** (ECS on EC2 with an EC2 Instance Savings Plan against Fargate with a Compute Savings Plan). No page contradicts either, so neither was rewritten. In m2-051 the sentence that Fargate's price "includes a premium for managing the hosts" is not on a page.
- **m2-022:** see above; reworded, not tested against a live bucket.
- **m2-047:** "fuzzy matching" is an OpenSearch query feature documented on opensearch.org; on AWS pages I found full-text search, relevance scores and aggregation, but not the word "fuzzy".
- **m2-017:** the recovery times per strategy (hours, tens of minutes, minutes, real time) come from a figure in the DR whitepaper, which is an image; the page text confirms the strategies but not the numbers.

## `doc` keys

All 65 questions now have a `doc`. Set in this pass: m2-008 `ssm`, m2-016 `cognito`, m2-023 `flink`, m2-039 `parameter-store`, m2-047 `opensearch`, m2-050 `kvs`, m2-054 `keyspaces`, m2-063 `mq`, m2-065 `cost-anomaly`. m2-054 keys two services (Keyspaces and Neptune) and `doc` holds one key; `keyspaces` was chosen. No tag or doc key was missing.

## Notes for the maintainer (files outside this session's scope)

- `docs/questions.md`, "Inferred, not quoted": m2-014 and m2-016 can come off the list; m2-022 stays (reworded, untested).
- Possible additions to the AWS changes list, each read on the page named above: on-failure destinations of an event source mapping cover Kinesis, DynamoDB Streams, MSK and self-managed Kafka only; S3 Block Public Access now also has an organization level; the Wavelength guide describes CSP networks rather than 5G; Spot requests are capped at the On-Demand price by default and a specified maximum price means more interruptions.

## Not reached

Nothing. Whether each first `ref` is the step that teaches the concept was not evaluated (owner's decision).

## Checks

Run from `saa-plan/` after the last edit:

- `node --test`: 33 passed, 0 failed.
- `node tools/qstats.mjs mock2`: 65 questions, domains 20/17/15/13, choose-two 10, keyed option clearly longest 0.
- `node tools/similar.mjs 0.38`: the 5 known day-pool pairs, none involving mock2.
