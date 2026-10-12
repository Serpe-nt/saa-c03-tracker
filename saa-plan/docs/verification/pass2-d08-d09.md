# Second verification pass: d08.js and d09.js

Date: 2026-10-12

Scope: `site/quiz/d08.js` (q08-001 … q08-050, Domain 1) and `site/quiz/d09.js` (q09-001 … q09-050, Domain 2). An independent second read: the first-pass log (`d08-d09.md`) was used only as a list of things to look at harder.

Method: every question was read in full, and each factual statement in the stem, the keyed option and all option explanations was looked up in the text of a page fetched from `docs.aws.amazon.com` or `aws.amazon.com` (final URL and page title checked, so a redirect to a guide's landing page does not count). A statement that a service cannot do something had to be backed by a sentence stating the limit or by the authoritative list (API reference, feature list, field list) showing it is absent; otherwise the explanation was rewritten to what the pages say.

## Totals

| | Count |
|---|---|
| Questions checked | 100 |
| Questions changed | 42 (33 with text changes, 9 with only a `doc` change) |
| Answer keys changed | 0 |
| Keys that a page contradicts | 0 |
| Questions not reached | 0 |

## Changed questions

| Id | What was wrong | Source |
|---|---|---|
| q08-001 | Explanation implied task roles alone isolate containers on EC2. AWS also "strongly recommend[s]" blocking container access to the instance metadata service; added in brackets. | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html, https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html |
| q08-003 | "produces a completion report" (the report is optional). The copy job was called "older guidance" only; it is still documented, so the explanation now says an exam item may show a Batch Operations copy job that writes each object back with the new key. | https://docs.aws.amazon.com/AmazonS3/latest/userguide/update-sse-encryption.html, https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-encryption.html, https://docs.aws.amazon.com/AmazonS3/latest/userguide/batch-ops-copy-object.html, https://docs.aws.amazon.com/AmazonS3/latest/userguide/batch-ops-job-status.html |
| q08-006 | "only the management account is unaffected by SCPs" was too absolute: service-linked roles are exempt too. | https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html |
| q08-011 | "root-only tasks, such as changing account settings": in a standalone account root is needed for the root email address, password and access keys; account name, contacts and Regions are not root-only. | https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html |
| q08-014 | Macie, Trusted Advisor and keyed explanations reworded to the pages (see the next section for Trusted Advisor). Access Analyzer "continuously reports" → it monitors and re-analyzes periodically and within about 30 minutes of a policy change. | https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html, https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html |
| q08-015 | Old name. Route 53 Resolver "was previously called Route 53 Resolver" and is now Route 53 VPC Resolver: stem uses the new name, explanation says "(formerly Route 53 Resolver)". The network ACL explanation now quotes the documented reason: network ACLs can't block DNS requests to or from the Resolver. "AWS managed threat lists" → "AWS managed domain lists". | https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html, https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html, https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-dns-firewall-managed-domain-lists.html |
| q08-016 | Control Tower now calls the log archive account the "CloudTrail administrator account" and the audit account the "Config aggregator account"; both names added. "Conformance packs are detective rules only" was too absolute: a pack is "a collection of AWS Config rules and remediation actions". | https://docs.aws.amazon.com/controltower/latest/userguide/special-accounts.html, https://docs.aws.amazon.com/controltower/latest/userguide/how-control-tower-works.html, https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html |
| q08-023 | AWS WAF docs write "protection pack (web ACL)"; term added once. "API Gateway stages" → "REST API stage"; the five-minute evaluation window is now stated. | https://docs.aws.amazon.com/waf/latest/developerguide/web-acl.html, https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-aws-waf.html, https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based-high-level-settings.html |
| q08-031 | "OAI does not support SSE-KMS" was more absolute than the page ("OAI doesn't support these features or it requires extra workarounds"; OAI is "legacy, not recommended"). | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html |
| q08-033 | Client VPN explanation reworded to what connection logs contain (connect, attempt, disconnect events). | https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/connection-logging.html |
| q08-034 | Keyed explanation now uses "web ACL (protection pack in the current docs)" and the documented structure: the policy's first and last rule groups run around rules that account teams add. `doc` `waf` → `firewall-manager`. | https://docs.aws.amazon.com/waf/latest/developerguide/waf-policies-rule-groups.html, https://docs.aws.amazon.com/waf/latest/developerguide/fms-chapter.html |
| q08-050 | Old name in an option. The RDS page is now "Amazon CloudWatch Database Insights"; the option uses it and the explanation says "(formerly Performance Insights)". | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.html |
| q09-009 | "highly available scheduler" is not AWS's wording (pages say serverless, reliable). Reworded, and one sentence added that EventBridge scheduled rules are legacy next to Scheduler. `doc` `eventbridge` → `scheduler`. | https://docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html, https://docs.aws.amazon.com/scheduler/latest/UserGuide/configuring-schedule-dlq.html, https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html |
| q09-011 | "one invocation cannot run longer than 15 minutes" now says "a standard Lambda function": Lambda Managed Instances allow up to 90 minutes for asynchronous invocations. | https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html |
| q09-021, q09-028 | Multi-AZ DB cluster wording: the user guide says "two reader DB instances", the product page "two readable standbys". Options keep the product-page term; q09-028's explanation names both, q09-021's says "one writer and a fixed pair of reader DB instances". | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html, https://aws.amazon.com/rds/features/multi-az/ |
| q09-035, q09-036, q09-037 | Recovery times such as "tens of minutes" come from a figure in the whitepaper, not from its text. Explanations reworded to the text: backups are "low cost and low complexity", pilot light "cannot process requests without additional action taken first", warm standby "can handle traffic (at reduced capacity levels) immediately". q09-036 and q09-037 also get `doc` `dr`. | https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html |
| q09-043 | First pass confirmed "simple routing cannot be associated with health checks" only indirectly. Direct source found and quoted: "With simple routing, although you can specify multiple IP addresses, they are not health checked." | https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-simple.html |
| q09-046 | Volume Gateway explanation now gives the documented schedule (every 1, 2, 4, 8, 12 or 24 hours; default once a day) instead of "an RPO of hours". `doc` `drs` added. | https://docs.aws.amazon.com/storagegateway/latest/vgw/SchedulingSnapshot.html, https://docs.aws.amazon.com/storagegateway/latest/vgw/WhatIsStorageGateway.html |
| `doc` only | Added: q08-026 `macie`, q08-028 `cognito`, q08-030 `network-firewall`, q08-033 `session-manager`. Changed to a closer fit: q08-041 and q08-042 `s3` → `object-lock`, q09-027 `ec2` → `placement`, q09-032 and q09-038 `dynamodb` → `global-tables`, q09-047 `vpc` → `nat`. | `site/quiz/meta.js` |

## Wrong-option claims rewritten because no page backs them

| Id | Claim that was removed | What the explanation says now, and the page |
|---|---|---|
| q08-014 | Trusted Advisor "covers only a few resource types, runs on a schedule rather than continuously, does not use the organization as a trust boundary" | The security check list has "Amazon S3 Bucket Permissions" and "IAM Access Analyzer External Access" (which only tests whether an analyzer exists); it has no check that lists KMS keys, roles, functions or queues shared externally. https://docs.aws.amazon.com/awssupport/latest/user/security-checks.html |
| q08-019 | Shield Standard "has no customer-managed block lists" | "All AWS customers benefit from the automatic protection of Shield Standard" against common network and transport layer DDoS attacks; blocking one range is a network ACL's job. https://docs.aws.amazon.com/waf/latest/developerguide/ddos-standard-summary.html |
| q08-021 | "Customers cannot peer with AWS service VPCs" | A peering connection is between your own VPCs or with a VPC in another account; services are reached through VPC endpoints. https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html |
| q08-024 | "NAT gateways do not offer packet capture"; Flow Logs "never packet contents, even with every field enabled"; GuardDuty "does not perform full packet inspection" | NAT gateways are monitored through CloudWatch metrics (bytes, packets, connections). No sentence says flow logs exclude payload, but the list of available fields has no payload field. GuardDuty's foundational sources are CloudTrail events, VPC flow logs and DNS logs. https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway-cloudwatch.html, https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html, https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html |
| q08-032 | Access points "still require requests signed with AWS credentials" | Too absolute: each access point has its own policy and its own block public access settings. Now: the alias is another name for the bucket, access is decided by the policies, nothing makes a link expire. https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-points.html |
| q08-035 | SSE-C: "AWS keeps no key usage log"; SSE-S3: "key usage is not logged per caller in CloudTrail" | SSE-C: you supply the key with every request and "are responsible for tracking which encryption key you provided for which object"; disabled by default on new buckets since April 2026. SSE-S3: "Amazon handles key management"; with KMS "there are separate permissions for the use of the KMS key" and an audit trail. https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html, https://aws.amazon.com/s3/faqs/ |
| q08-036 | "a different KMS key cannot decrypt ciphertext produced under the original key" | Not found. Now only: KMS keys "cannot be exported in plain text from the HSMs", which already rules the option out. https://aws.amazon.com/kms/faqs/ |
| q08-044 | "KMS exposes its own API rather than a PKCS #11 interface"; "multi-tenant HSM fleet"; "do not offer PKCS#11" | No page states that KMS lacks PKCS #11. Now: KMS keys live in the HSMs that KMS operates; the KMS FAQ points to a CloudHSM-backed store for keys "required to be protected in a single tenant HSM or in an HSM over which you have direct control", and the option itself swaps PKCS#11 calls for the KMS Sign API. https://aws.amazon.com/kms/faqs/, https://aws.amazon.com/cloudhsm/faqs/ |
| q09-019 | Global Accelerator "does not cache content" | It "improves performance ... by proxying packets at the edge to applications", so every request still reaches the instances. https://aws.amazon.com/global-accelerator/faqs/ |
| q09-023 | Firehose "offers no stream that applications can read in real time" | Firehose "buffers incoming streaming data ... before delivering it to destinations"; an archive in S3 is not a stream to read in order and replay. https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html |
| q09-045 | "EC2, EBS, and EFS backups are not stored as objects in a customer's S3 bucket" | "A backup vault is a container that stores and organizes your backups", which is where Vault Lock applies. https://docs.aws.amazon.com/aws-backup/latest/devguide/vaults.html |
| q09-048 | "Mount targets can exist only in the file system's own Region" | "For One Zone file systems, you can only create a single mount target in the same Availability Zone as the file system." https://docs.aws.amazon.com/efs/latest/ug/accessing-fs.html |

## "Cannot" claims that are backed and stay

- **q08-034** an SCP cannot require a web ACL when a load balancer is created: `CreateLoadBalancer` has no web ACL parameter and `AssociateWebACL` is a separate WAFV2 action. https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_CreateLoadBalancer.html, https://docs.aws.amazon.com/waf/latest/APIReference/API_AssociateWebACL.html
- **q09-008** SNS cannot start a state machine: the `Subscribe` protocol list is http, https, email, email-json, sms, sqs, application, lambda, firehose. The explanation now cites the list. https://docs.aws.amazon.com/sns/latest/api/API_Subscribe.html
- **q08-019, q08-030, q08-040** AWS WAF does not attach to Network Load Balancers or NAT gateways: the resource list has neither. https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works-resources.html
- **q08-018 … q08-021** security groups have allow rules only; "You can't associate a security group with a NAT gateway"; gateway endpoints are for S3 and DynamoDB. https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html, https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html, https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html
- **q08-002, q08-035, q08-036** the key policy of an AWS managed key cannot be changed. https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html
- **q08-004** `AssumeRole` needs credentials ("You must call this API using active credentials"). https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_request.html
- **q08-029** ACM "does not provide managed renewal for imported certificates". https://docs.aws.amazon.com/acm/latest/userguide/import-certificate.html
- **q08-031** website endpoints support "only publicly readable content". https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html
- **q09-012** "Express Workflows do not support ... Callback (.waitForTaskToken)". https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html
- **q09-013** for dead-letter queues "Lambda only sends the content of the event, without details about the response". https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-retain-records.html
- **q09-017** Network Load Balancer rules route only by source IP address type, not by path. https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html
- **q09-020** "You can't use a standby replica to serve read traffic." https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html
- **q09-044** "Route 53 health checkers are outside the VPC." https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-private-hosted-zones.html
- **q09-050** CloudFront "supports content that can be sent using the HTTP or WebSocket protocols". https://aws.amazon.com/cloudfront/faqs/

## Questions confirmed as written

d08: q08-002, 004, 005, 007–010, 012, 013, 017, 018, 020, 022, 025, 027, 029, 037–040, 043, 045–049.
d09: q09-001–007, 010, 012–018, 020, 022, 024–026, 029–031, 033, 034, 039–042, 044, 049, 050.

For each of these the keyed answer, the stem's deciding requirements and every factual statement in the explanations were found on a fetched page, and no second option is defensible.

## AWS changes found that are not yet in docs/questions.md

- Route 53 Resolver → **Route 53 VPC Resolver** (renamed when Route 53 Global Resolver was introduced). The exam guide and some AWS pages still print the old name. https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html
- Control Tower: log archive account → **CloudTrail administrator account**, audit account → **Config aggregator account** ("service integration accounts"); landing zone 4.0 no longer requires a Security OU. https://docs.aws.amazon.com/controltower/latest/userguide/special-accounts.html
- API Gateway usage plan throttling and quotas "are not hard limits, and are applied on a best-effort basis". https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html
- "AWS managed keys are a legacy key type that is no longer being created for new AWS services as of 2021." https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html

These are also in the shared notes file `pass2-d08-d09-findings.md`.

## Doc keys

- Every `doc` used in the two files exists in `DOCS` (`node --test` checks this). All 100 questions now have one.
- `DOCS` has no CloudHSM key; q08-044 keeps `doc:"kms"`, a loose fit. A `cloudhsm` key (`https://aws.amazon.com/cloudhsm/faqs/`, fetched, 200) would fit; `meta.js` is out of scope here.
- No new tag was needed.

## Still uncertain

- **Out-of-scope categories, counted only:** figures on which AWS's own pages disagree: 2 (q09-031, q09-033); price comparisons: 2 (q09-035, q09-036; both follow the whitepaper's wording "low cost" and "minimizes the ongoing cost"); lead times: 0; `ref` against Skill Builder lessons: all 100, not checked by decision. No key depends on a disputed figure.
- **q08-030 option wording:** the distractor still says "Route 53 Resolver DNS Firewall". AWS pages write "Resolver DNS Firewall" and some still "Route 53 Resolver DNS Firewall", so it was left.
- **q08-044:** whether KMS has any PKCS #11 interface is not stated on a page either way; the explanations no longer depend on it.
- **q08-024:** that flow logs hold no payload rests on the field list, not on a sentence.
- **q08-034:** that account teams cannot remove a Firewall Manager policy's rule groups is not stated in one sentence; the page describes the first and last rule groups as "defined by you in the Firewall Manager AWS WAF policy" with account rules between them.
- **q09-010 stem:** that root user sign-in events can be matched by an EventBridge rule was not found on a page fetched. CloudTrail does record them (in us-east-1, us-east-2 or us-west-2). The key does not depend on it. https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-aws-console-sign-in-events.html
- **q08-003 and the exam:** the question keys the current "update object encryption" operation and the explanation describes the copy job, so either exam wording should be recognisable. Which one the live exam prints is unknown.

## Not reached

Nothing. All 100 questions had this second read.

## Checks

Run from `saa-plan/` after the edits:

- `node --test`: 33 tests, 33 pass.
- `node tools/qstats.mjs d08`: 50 questions, choose-two 8, keyed option clearly longest: 0.
- `node tools/qstats.mjs d09`: 50 questions, choose-two 8, keyed option clearly longest: 0.
- `node tools/similar.mjs 0.38`: the same 5 pairs as before the edits (the accepted ones listed in `docs/questions.md`, one of them q04-039/q08-049); no new pair.
