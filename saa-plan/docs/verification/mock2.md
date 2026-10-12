# Verification log: mock set 2 (`site/quiz/mock2.js`)

Date: 2026-10-12

Method: every question (stem, options, explanations) was read against pages fetched the same day from `docs.aws.amazon.com` and `aws.amazon.com` with `curl`, converted to text and searched for the specific claim. Two price comparisons were read from the AWS Price List bulk API (`pricing.us-east-1.amazonaws.com`), because the pricing pages on aws.amazon.com show `{priceOf!…}` placeholders instead of numbers. No subagents were used. Web search was not needed.

## Totals

| | Count |
|---|---|
| Questions checked | 65 of 65 (the 25 "knowledge-only" ids first, then the other 40) |
| Questions changed | 11 |
| Answer keys changed | 0 |
| Not reached | 0 |

m2-050 keeps its key index, but the keyed option itself was reworded because it relied on a feature that is closed to new customers.

## Changed questions

- **m2-004** – name only. The Aurora User Guide now calls the feature "Aurora serverless"; "Serverless v2" no longer appears there. Option and explanation use "Aurora serverless (formerly Aurora Serverless v2)". https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html
- **m2-022** – the keyed explanation said `IfExists` lets uploads without encryption headers through. IAM says the opposite: a Deny with a negated operator such as `StringNotEqualsIfExists` still denies when the key is missing. Explanation now says negated operators match a missing header and that a `Null` check is needed to let header-less uploads fall back to the bucket default. https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html and https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html
- **m2-026** – the distractor "many instance types + lowest-price" also gives "fewer interruptions", so it was defensible. Stem now asks for "as few interruptions as possible … Which solution BEST meets". Facts unchanged (price-capacity-optimized is the recommended strategy, lowest-price "not recommended"). https://docs.aws.amazon.com/autoscaling/ec2/userguide/allocation-strategies.html
- **m2-027** – explanation called Redshift data sharing "read-only"; datashares can now also grant writes. Removed "read-only". https://docs.aws.amazon.com/redshift/latest/dg/datashare-overview.html
- **m2-029** – (a) "Aurora Serverless v2" renamed as in m2-004. (b) Stem said the outage lasted "while Aurora tried to recreate the writer instance"; the guide says a single-instance cluster is recreated in the same AZ, and in a full AZ outage a new instance must be created in another AZ. Stem now says the cluster "had no instance in another AZ to fail over to"; one distractor explanation reworded to match. https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html
- **m2-039** – distractor explanation asserted that task definitions "cannot be encrypted with a customer managed key", which I could not confirm on any page. Replaced with what the ECS guide states: environment variables in a task definition are readable by everyone allowed `DescribeTaskDefinition`, and AWS recommends Secrets Manager or Parameter Store. https://docs.aws.amazon.com/AmazonECS/latest/developerguide/taskdef-envfiles.html
- **m2-050** – the keyed option required "Rekognition stream processors" on Kinesis Video Streams. Rekognition Streaming Video (stream processors) has been closed to new customers since 2026-04-30 (listed under maintenance, announced 2026-03-31). Stem and keyed option now ask for images extracted from the stream to S3 (a documented Kinesis Video Streams feature) for a person-detection job; the explanation names Rekognition image analysis and notes the closure. https://docs.aws.amazon.com/rekognition/latest/dg/rekognition-availability-changes.html , https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html , https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/images.html
- **m2-051** – "Fargate Spot" could be argued as the lowest-cost option, and its explanation only called it "risky". Stem now states that the API must not lose capacity to interruptions; explanation tightened. Facts confirmed: EC2 Instance Savings Plans up to 72%, Compute Savings Plans (which cover Fargate) up to 66%. https://aws.amazon.com/savingsplans/compute-pricing/
- **m2-057** – naming. EFS docs speak of "One Zone file systems" (file system type), not "One Zone storage". Option and explanation reworded. https://docs.aws.amazon.com/efs/latest/ug/features.html
- **m2-061** – (a) the stem asked which steps "reduce cost", so "30-day retention + export to S3 Standard" was also a valid pair; it now asks for "the MOST". (b) The Infrequent Access distractor's explanation missed two documented facts: a log group's class cannot be changed after creation, and the two classes differ only in ingestion price (storage costs the same). https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html
- **m2-062** – "Lambda's 15-minute limit" is no longer an absolute: functions on Lambda Managed Instances can run up to 90 minutes for asynchronous and event-source-mapping invocations. Explanation now says "a standard Lambda function's 15-minute timeout". https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html

## Open doubts from docs/questions.md that are now settled

- **Organization conformance packs (m2-046):** "If a new account joins an organization, the rule or conformance pack is deployed to that account." Deployment is retried for 7 hours if the new account has no recorder yet. The question was already correct. https://docs.aws.amazon.com/config/latest/developerguide/conformance-pack-organization-apis.html
- **Local Zone GPUs (m2-064):** the Los Angeles Local Zone row lists G4dn and G5 instances. The question was already correct. https://aws.amazon.com/about-aws/global-infrastructure/localzones/features/
- **Rekognition on Kinesis Video Streams (m2-050):** it does work on Kinesis video streams, but the feature is closed to new customers (see above), so the question was rewritten.

## Facts confirmed without a change (the less obvious ones)

- m2-001: CloudFront VPC origins support ALB, NLB and EC2 in private subnets. https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-vpc-origins.html
- m2-002: WAF rate-based rule windows are 60, 120, 300 or 600 seconds; API Gateway uses a token bucket and returns 429. https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based-high-level-settings.html
- m2-006: on-failure destinations for a Kinesis event source mapping receive only metadata (shard ID, sequence numbers) for SQS and SNS. https://docs.aws.amazon.com/lambda/latest/dg/kinesis-on-failure-destination.html
- m2-007: the DynamoDB guide uses the same example (GSI keyed on `status`) for GSI back pressure. https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/gsi-throttling.html
- m2-009: us-east-1 list prices give One Zone-IA the lowest monthly cost when each object is read once a month (storage + retrieval per GB: One Zone-IA 0.010 + 0.01, Standard-IA 0.0125 + 0.01, Glacier Instant Retrieval 0.004 + 0.03). Source: AWS Price List bulk API, AmazonS3, us-east-1.
- m2-012: CloudFront Functions see `CloudFront-Viewer-Country` only when it is in a cache policy or origin request policy; Lambda@Edge runs in Regional edge caches. https://aws.amazon.com/blogs/aws/introducing-cloudfront-functions-run-your-code-at-the-edge-with-low-latency-at-any-scale/
- m2-015: FSx for Windows HDD storage is available for Multi-AZ; typical deduplication savings 50–60% for general-purpose shares. https://docs.aws.amazon.com/fsx/latest/WindowsGuide/high-availability-multiAZ.html
- m2-028: KSK needs an asymmetric ECC_NIST_P256 customer managed key in us-east-1. https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-configuring-dnssec-cmk-requirements.html
- m2-038: "You cannot use MFA delete with lifecycle configurations." https://docs.aws.amazon.com/AmazonS3/latest/userguide/MultiFactorAuthenticationDelete.html
- m2-040: archive tier is up to 75% cheaper, minimum 90 days, restore up to 72 hours. https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-archive.html
- m2-042: one vCPU at 1,769 MB (https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html); up to 6 vCPUs at 10 GB (https://aws.amazon.com/blogs/aws/new-for-aws-lambda-functions-with-up-to-10-gb-of-memory-and-6-vcpus/).
- m2-044: on-failure destinations for event source mappings exist only for Kinesis, DynamoDB and Kafka, not SQS. https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-retain-records.html
- m2-048: regional NAT gateways exist next to zonal ones. https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html
- m2-053: privileged root sessions can delete a misconfigured S3 bucket policy. https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user-privileged-task.html
- m2-059: Global Datastore supports Valkey, replicates in under a second, promotion typically under a minute. https://aws.amazon.com/elasticache/faqs/
- m2-065: Cost Anomaly Detection offers individual alerts, daily and weekly summaries, and root causes. https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html
- Lifecycle lists: apart from Rekognition Streaming Events, no service used in a keyed option of this pool appears on the maintenance, sunset or full-shutdown lists. https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html

## Still uncertain

- **m2-022:** the S3 guide says the KMS key that S3 actually uses "must match the AWS KMS key ID in the policy", which may mean S3 also evaluates the condition key for uploads that rely on the bucket default. The new explanation follows the documented IAM rule for negated operators and was not tested against a live bucket.
- **m2-051:** the Fargate-specific Savings Plans rate is in a dynamic price table I could not read. Confirmed only: the 66% and 72% maxima, and that Fargate's list price for 2 vCPU + 4 GB in us-east-1 is about 0.099 USD per hour (Price List API). That EC2 is cheaper per task before discounts rests on EC2 list prices I did not fetch.
- **m2-014:** "public certificate authorities do not issue certificates for internal names" is a CA/Browser Forum rule, not something an AWS page states.
- **m2-016:** the "users per account" IAM quota exists in the General Reference, but I did not read its value; the explanation gives no number.
- `ref` values were only checked by `node --test` (they exist). Whether the first ref is the step that teaches the concept was not re-evaluated, because Skill Builder content needs a login.

## Notes for the maintainer (files outside my scope)

- `docs/questions.md`: the three mock-2 doubts above can be closed. Worth adding to "AWS changes": Aurora Serverless v2 → "Aurora serverless"; Rekognition Streaming Video closed to new customers (2026-04-30); a CloudWatch Logs log group's class cannot be changed after creation; Lambda Managed Instances allow up to 90 minutes.
- `site/quiz/meta.js`: no missing tag or `doc` key blocked a fix. Nine questions have no `doc` because `DOCS` has no page for their service (Systems Manager, Cognito, Managed Service for Apache Flink, OpenSearch Service, Kinesis Video Streams, Keyspaces/Neptune, Amazon MQ, Cost Anomaly Detection); adding keys is optional.

## Checks

Run from `saa-plan/` after the last edit:

- `node --test`: 26 passed, 0 failed.
- `node tools/qstats.mjs mock2`: 65 questions, domains 20/17/15/13, choose-two 10, keyed option clearly longest 0.
- `node tools/similar.mjs 0.38`: the 5 known day-pool pairs, none involving mock2.
