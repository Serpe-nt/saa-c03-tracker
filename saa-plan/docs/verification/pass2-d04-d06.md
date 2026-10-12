# Second verification pass: d04, d05, d06

Date: 2026-10-12. Branch `claude/pass2-quiz-d04-d06-68807e`.

Scope: `site/quiz/d04.js`, `d05.js`, `d06.js` (150 questions). An independent second read by a session that neither wrote nor first-checked these questions. Every question was read in full. Facts were checked on pages fetched from `docs.aws.amazon.com` and `aws.amazon.com` with a small Node script (browser User-Agent, redirects not followed on the docs host, tags stripped, text searched for the statement). A fact counts as confirmed only when the sentence or table entry was found in the page text. 300 pages were fetched and read this way; about 30 more URLs answered with a redirect (page moved or renamed) and were not counted. No subagents were used. The first-pass log was used as a list of leads only.

## Result

| | d04 | d05 | d06 | Total |
|---|---|---|---|---|
| Questions checked | 50 | 50 | 50 | 150 |
| Questions changed | 20 | 11 | 16 | 47 |
| Answer keys changed | 0 | 0 | 0 | 0 |
| Stems changed | 1 (q04-036, one word) | 0 | 0 | 1 |
| Options changed | 0 | 0 | 0 | 0 |
| `doc` set | 2 | 0 | 1 | 3 |
| Not reached | 0 | 0 | 0 | 0 |

No wrong option turned out to be a second defensible answer. No keyed answer was contradicted by a page.

## Changed questions

Format: id, part changed, what was wrong, source.

### d04

- **q04-003** (Shield option): said Shield Advanced "does not fix or virtually patch" packages, which no page states. Now says only that it is a DDoS protection service and the package is in the guest OS. https://docs.aws.amazon.com/waf/latest/developerguide/ddos-advanced-summary-capabilities.html
- **q04-004** (second root user): "you cannot create another" is not stated. Now uses the page's wording: the root user is the single sign-in identity an account starts with. https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html
- **q04-006** (evaluation order): said there is no ordering of policies. The docs say the order of the policies affects how they are evaluated, and that one explicit deny gives a final Deny. Reworded to the second part. https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_policy-eval-denyallow.html
- **q04-014** (security group option): "S3 buckets cannot have security groups" has no page. Now says what security groups do and that the documented way to require TLS is the bucket policy condition. https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html
- **q04-023** (daily synchronization): "no daily synchronization" was unbacked. The docs say an attached SCP "takes effect immediately". https://docs.aws.amazon.com/organizations/latest/userguide/orgs_policies_attach.html
- **q04-026** (encrypting the credentials file): "the CLI needs the keys in plaintext" was an inference. Now says only that the keys stay long-term credentials. https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html
- **q04-027** (policy on the instance): "policies are not attached to the Identity Center instance" was unbacked. Now says how access is granted. https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html
- **q04-028** (AWS managed keys): "cannot let another account use it" is not a sentence in the docs. Now quotes what is: you cannot change the key policy or any property of the key. https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html
- **q04-030** (quota increase): "fixed and cannot be raised" was unbacked. The limit is in the Encrypt API definition and is absent from the KMS quotas list. https://docs.aws.amazon.com/kms/latest/APIReference/API_Encrypt.html, https://docs.aws.amazon.com/kms/latest/developerguide/resource-limits.html
- **q04-032** (remove encryption): the docs speak of DB instances, not snapshots: "You can't unencrypt an encrypted DB instance". Reworded to that. https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html
- **q04-035** (SSE-S3 and SSE-C options): "key use does not appear as KMS events" and "not logged by KMS" were unbacked absences. Now says what SSE-KMS adds (CloudTrail audit of key use, separate `kms:Decrypt`) and that KMS is not involved in the other two. https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html
- **q04-036** (stem and keyed explanation): "two independent layers" is not AWS's wording; the user guide and the launch post say "two layers of encryption". "independent" removed in both places. https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingDSSEncryption.html
- **q04-037** (imported key material): "stored in KMS hardware security modules" replaced by the page's statement that KMS uses a copy of the key material. https://docs.aws.amazon.com/kms/latest/developerguide/importing-keys.html
- **q04-040** (Parameter Store rotation): "has no built-in rotation" is not stated. The guide sends secrets that need automatic rotation to Secrets Manager; reworded to that. https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
- **q04-041** (keyed explanation, `doc`): added that AWS recommends Secrets Manager for credentials but bills it per secret, which is why the cost question still keys on standard parameters. `doc` set to `parameter-store`. https://aws.amazon.com/systems-manager/pricing/, https://aws.amazon.com/secrets-manager/pricing/
- **q04-043** (Shield and GuardDuty options, keyed explanation): two unbacked "does not" claims reworded to what each service is. Keyed explanation notes that the docs now call a web ACL a protection pack (web ACL). https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works-resources.html
- **q04-045** (keyed explanation): "Business-tier or higher" replaced by the page's wording, "the Business Support plan or the Enterprise Support plan". https://docs.aws.amazon.com/waf/latest/developerguide/ddos-srt-support.html
- **q04-048** (GuardDuty S3 Protection option, `doc`): "does not classify object contents" reworded to what it does analyze (CloudTrail data events for S3). `doc` set to `macie`. https://docs.aws.amazon.com/guardduty/latest/ug/s3-protection.html
- **q04-049** (Trusted Advisor and Config aggregator options): "does not collect ... findings" was too absolute: Trusted Advisor can display Security Hub CSPM controls. Both reworded to what each collects. https://docs.aws.amazon.com/awssupport/latest/user/security-hub-controls-with-trusted-advisor.html, https://docs.aws.amazon.com/config/latest/developerguide/aggregate-data.html
- **q04-050** (WAF and Shield options): "cannot be attached to an EC2 instance" now rests on the list of protectable resources; "no instance quarantine feature" removed. https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html

### d05

- **q05-003** (NLB option): "cannot contain Lambda functions" now rests on the target type list (instance, ip, alb). https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html
- **q05-005**, **q05-033**, **q05-039**, **q05-046** (ALB and Elastic IPs): all four said "ALBs do not support Elastic IP addresses" or "do not have static IPs". The ALB guide now says ALBs use public Elastic IPv4 addresses from Amazon's pool, marked `service_managed`, and can take addresses from an IPAM pool. Reworded: the addresses are service-managed, not ones you attach per subnet, and AWS's documented route to a static IP per AZ is an NLB in front. Keys unchanged. https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html, https://aws.amazon.com/elasticloadbalancing/faqs/
- **q05-007** (ALB HTTP listener option): "cannot pass an encrypted TLS stream through" now quotes the ALB guide, which sends that use case to a TCP listener on an NLB. https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html
- **q05-011** (cross-zone option): "ALBs already balance across zones" qualified to "on by default"; it can be turned off per target group. https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html
- **q05-015** (live migration option): "EC2 cannot move a running instance between Availability Zones" had no page. Now describes rebalancing as documented. https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-benefits.html
- **q05-017** (keyed explanation): "keeps responding to alarms while a scaling activity is in progress" is no longer on the page. Reworded to what is: step scaling can start a scale-out immediately without waiting for the cooldown period to end. https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scaling-cooldowns.html
- **q05-019** (keyed explanation): "uses machine learning" is not in the predictive scaling pages or the FAQ. Now "analyzes historical load to detect daily and weekly patterns". https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html
- **q05-031** (keyed explanation, NLB option): ACM renews automatically only with DNS validation; with email validation it sends notices. Qualified. NLB "cannot issue redirects" now rests on its listener actions (forward only). https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html, https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html
- **q05-033** (proxy protocol option): reworded to say where proxy protocol v2 is documented (NLB target groups) and what the ALB does. https://docs.aws.amazon.com/elasticloadbalancing/latest/network/edit-target-group-attributes.html
- **q05-046** (WAF option): now rests on the list of resources WAF protects, which has no Network Load Balancer, and names the protection pack wording. https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html

### d06

- **q06-005** (keyed explanation): "reports only through AWS Health" reworded to the page: AWS sends events to the Health Dashboard. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-recover.html
- **q06-012** (Trusted Advisor and Inspector options): two unbacked "it neither ... nor" claims reworded to what each service reports. https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html, https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html
- **q06-020** (keyed explanation): the Log Archive and Audit accounts in a Security OU are documented for landing zone version 3.3 and earlier; version 4.0 no longer requires a Security OU. Explanation now says so and cites centralized CloudTrail logging from the page. https://docs.aws.amazon.com/controltower/latest/userguide/how-control-tower-works.html, https://docs.aws.amazon.com/controltower/latest/userguide/cloudtrail.html
- **q06-022** (subscription filter option): "cannot send email" replaced by the documented destination list (Kinesis Data Streams, Lambda, Firehose, OpenSearch Service). https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html
- **q06-031**: `doc` set to `calculator`. Sharing by link confirmed. https://docs.aws.amazon.com/pricing-calculator/latest/userguide/save-share-estimate.html
- **q06-033** (IAM option): "no such policy is possible" could not be backed (see Still uncertain). Now says what IAM decides and where the documented limit is. https://docs.aws.amazon.com/athena/latest/ug/workgroups-setting-control-limits-cloudwatch.html
- **q06-037** (SQS, Firehose, SNS options): "SNS stores nothing" is false for FIFO topics, which have message archiving and replay; the option is a standard topic, and the explanation now says so. "No replay" for SQS and Firehose reworded to what those services do. https://docs.aws.amazon.com/sns/latest/dg/message-archiving-and-replay-topic-owner.html
- **q06-038** (SQS option): "delivery stream" is now "Firehose stream". https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html
- **q06-039** (SNS option): "keeps no backlog" reworded to push versus poll, as the SQS FAQ puts it. https://aws.amazon.com/sqs/faqs/
- **q06-043** (Lambda option): "limited to 15 minutes" is true for standard functions only. Now "a standard Lambda function", plus the 10,240 MB memory ceiling, which is the stronger reason. https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
- **q06-044** (Glue and Athena options): "cannot ... choose Spot task nodes" and "cannot run existing Spark" were unbacked, and Athena does run Spark. Reworded to: both are serverless with no cluster to configure. https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html, https://aws.amazon.com/athena/faqs/
- **q06-046** (keyed explanation): Quick Sight is no longer described as serverless; the pages say fully managed, no infrastructure to provision. https://docs.aws.amazon.com/quick/latest/userguide/what-is.html
- **q06-047** (File Gateway option): "not designed for" reworded to what S3 File Gateway is and what DataSync is documented to do. https://aws.amazon.com/storagegateway/faqs/, https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html
- **q06-048** (Transfer Family and DMS options): "cannot write to FSx" now rests on the list of supported storage (S3 and EFS). https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html
- **q06-049** (RMAN option): a statement about Oracle's own tool, with no AWS page. Now argues from the heterogeneous migration. https://docs.aws.amazon.com/dms/latest/userguide/CHAP_SchemaConversion.html
- **q06-050** (data directory option): "RDS does not let you attach a copied data directory" replaced by what is documented: RDS for MySQL restores a Percona XtraBackup backup file from S3. https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/MySQL.Procedural.Importing.html

## Wrong-option claims rewritten because no page backs them

These said a service cannot do, does not support or has no something, and no sentence or authoritative list was found. Each now says only what a page states and still explains why the option fails.

q04-003, q04-004, q04-014, q04-026, q04-027, q04-032, q04-035 (two options), q04-040, q04-043 (two options), q04-048, q04-049 (two options), q04-050 (Shield option), q05-015, q06-012 (two options), q06-033, q06-037 (three options), q06-039, q06-044 (two options), q06-047, q06-048 (DMS option), q06-049, q06-050.

Rewritten because a page says something different from the old claim: q04-006, q04-049 (Trusted Advisor), q05-005, q05-033, q05-039, q05-046 (ALB addresses), q06-037 (SNS FIFO replay), q06-044 (Athena runs Spark).

Reworded so the claim now rests on an authoritative list that was fetched: q04-028 and q04-030 (KMS concepts, Encrypt API, quotas list), q04-050 (WAF resource list), q05-003 (NLB target types), q05-031 (NLB listener actions), q05-046 (WAF resource list), q06-022 (subscription filter destinations), q06-048 (Transfer Family storage list).

## Absence claims left as written, with the page that backs them

- Root user: no identity-based policies, no permissions boundary. https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html (q04-004, q04-024)
- Groups contain only users and cannot be a principal. https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html (q04-017)
- SCPs grant nothing and do not affect the management account. https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html (q04-008, q04-013, q04-017, q04-020, q04-022, q04-023, q04-031)
- Default Regions cannot be disabled. https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-regions.html (q04-021)
- A policy that grants fixed principals is not public; Block Public Access leaves the owner's account alone. https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html (q04-007, q04-008)
- Asymmetric KMS keys are not eligible for automatic rotation; a disabled key cannot be used; deletion always waits 7 to 30 days; KMS keys cannot be downloaded. https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html, `enabling-keys.html`, `deleting-keys.html`, `data-keys.html` (q04-029, q04-030, q04-034)
- Without the key policy statement, IAM policies that allow access are ineffective. https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-default.html (q04-031)
- RDS: snapshots under the AWS managed key cannot be shared; encrypted snapshots cannot be public. https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/share-encrypted-snapshot.html (q04-032)
- EBS: existing unencrypted volumes cannot be encrypted directly. https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html (q04-033)
- Network ACL rule fields are protocol, port range and CIDR. https://docs.aws.amazon.com/vpc/latest/userguide/nacl-rules.html (q04-043)
- Service scope statements (Inspector, Macie, GuardDuty, Detective, Security Hub CSPM, Config, Trusted Advisor) were each checked on the service's "What is" page.
- ALB listeners are HTTP and HTTPS only; a listener port can be used once (`DuplicateListener`). https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html, https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_CreateListener.html (q05-002, q05-005, q05-006, q05-007, q05-046)
- NLB listener rules match only the source IP address type; NLB cross-zone is off by default. https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html, `network-load-balancers.html` (q05-001, q05-002, q05-010, q05-030)
- ALB routes only to targets in enabled Availability Zones. https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html (q05-014)
- Launch configurations cannot be modified, take no new instance types since 2023-01-01, and cannot be created by accounts from 2024-10-01. https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-configurations.html (q05-013)
- Auto Scaling ignores ELB health checks by default and treats any state other than running as unhealthy. https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html (q05-024, q05-037)
- A Multi-AZ DB instance standby cannot serve reads. https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html (q05-041)
- Route 53 health checkers are outside the VPC; simple routing values are not health checked and a simple alias takes one resource. https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-private-hosted-zones.html, `routing-policy-simple.html` (q05-029, q05-050)
- Multi-Attach: io1 or io2, same Availability Zone. https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes-multi.html (q05-045)
- One internet gateway per VPC. https://docs.aws.amazon.com/vpc/latest/userguide/amazon-vpc-limits.html (q05-047)
- EC2 publishes no memory metric; detailed monitoring only changes the period. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html, `manage-detailed-monitoring.html` (q06-001)
- A log group's class cannot be changed; logs are kept indefinitely by default. https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html (q06-003)
- Event history shows management events only, for 90 days. https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html (q06-007, q06-010)
- Member accounts cannot delete an organization trail or turn off its logging. https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html (q06-008)
- AWS Config is turned on per Region. https://aws.amazon.com/config/faqs/ (q06-014)
- DynamoDB does not support table joins. https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SQLtoNoSQL.ReadData.html (q06-045)

## First-pass "Still uncertain" items

- **q04-045** Shield Response Team plans: the Shield guide and FAQ still say Business Support or Enterprise Support and do not name Business Support+. The explanation now quotes that wording instead of "Business-tier or higher". Settled as far as the pages go.
- **q05-016** unit of `ALBRequestCountPerTarget`: a direct source exists. The predictive scaling page defines "Application Load Balancer request count per target" as "the average number of requests per minute that each instance should ideally receive". No change needed. https://docs.aws.amazon.com/autoscaling/ec2/userguide/predictive-scaling-create-policy.html
- **q06-043** Lambda limit: qualified to standard functions (see above).

## AWS changes lists

Checked across the three pools: Lambda limit (q06-043, fixed), CloudTrail Insights (q06-002, q06-007, q06-009, q06-021, all correct), Trusted Advisor plans (q06-019, correct), Shield Response Team wording (q04-045, fixed), Security Hub CSPM (q04-049, correct), regional NAT gateway (q05-047, correct), launch configurations (q05-013, correct), SSE-C default (q04-037, correct; the salted HMAC sentence is on `specifying-s3-c-encryption.html`, not on the overview page), KMS rotation range 90 to 2,560 days (q04-029, confirmed in the `EnableKeyRotation` API reference), Quick Sight (q06-046, fixed), Firehose naming (q06-038, fixed), WAF protection pack (noted once in q04-043 and q05-046). No question mentions Snowball, CloudTrail Lake, S3 Select or another closed service.

## `doc` keys

Set: q04-041 `parameter-store`, q04-048 `macie`, q06-031 `calculator`. Left without `doc`: q05-045 (sessions plus uploads, no single main service) and q06-046 (no Quick Sight key exists). q06-035 keeps `athena` because `DOCS` has no key for the Cost and Usage Report or Data Exports. Suggested new keys for `meta.js`, which this session did not edit: a Quick Sight page and https://docs.aws.amazon.com/cur/latest/userguide/what-is-data-exports.html.

## Still uncertain

- Out-of-scope categories, counted only: price comparisons 8 questions (each keyed on "most cost-effective" or "reduce cost"; the direction is stated in words on an AWS page or follows from the billing model, no figures were compared); lead times 0; figures on which AWS pages disagree 0; refs to Skill Builder steps 150, none opened.
- **q05-005, q05-039** "not Elastic IP addresses you attach per subnet": no sentence says an own Elastic IP cannot be attached to an ALB. The wording rests on the ALB page (addresses are service-managed) and the FAQ answer that static IPs for an ALB come from an NLB in front.
- **q06-020** what landing zone version 4.0 does with the Log Archive and Audit accounts: the page fetched describes them for version 3.3 and earlier and says only that 4.0 no longer requires a Security OU.
- **q06-033** Athena condition keys: `service-authorization/latest/reference/list_amazonathena.html` and `list_amazons3.html` answered with a redirect to the guide's landing page, so the condition key lists were not read. The explanation no longer depends on them.
- **q05-017** the stem asks for a policy that keeps responding while a scaling activity is in progress. That sentence is no longer on the step scaling page; the explanation uses the cooldown wording that is.
- **q04-016** that typical SSRF flaws cannot send the PUT request with its header comes from an AWS Security Blog post, not the user guide. https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/
- Judgement statements ("adds operational overhead", "more work") have no source page and were reviewed by reasoning, as in the first pass.

## For the owners of other files

Facts found here that other pools, `extras.js`, the glossary or `docs/questions.md` may contradict (also left in the shared notes folder):

- ALBs use service-managed public Elastic IPv4 addresses and can draw from an IPAM pool. "ALBs do not support Elastic IPs" is no longer safe wording.
- SNS FIFO topics have message archiving and replay (up to 365 days); standard topics do not.
- Control Tower landing zone 4.0 no longer requires a Security OU.
- CloudWatch Logs allows 5 subscription filters per log group (not adjustable).
- Predictive scaling is no longer described as machine learning.
- ACM managed renewal is automatic only for DNS-validated certificates.
- Trusted Advisor can display Security Hub CSPM controls.
- IAM best practices now describe "account access manager", which assigns existing IAM roles to Identity Center users and groups.
- Cost Explorer shows the last 13 months and forecasts 18 months.

## Checks

Run from `saa-plan/` after the edits:

- `node --check` on the three pool files: ok.
- `node --test`: 33 passed, 0 failed.
- `node tools/qstats.mjs d04`, `d05`, `d06`: 50 questions each, 7 Choose-two each, "keyed option clearly longest: 0" in all three.
- `node tools/similar.mjs 0.38`: the same 5 pairs as before the edits; no new pair.
