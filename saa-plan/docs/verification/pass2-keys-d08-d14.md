# Second read of the key points, Days 8–14 (pass 2)

Date: 2026-10-12. Reader: one AI agent session that did not write these entries. No subagents were used.

Method: each sentence in `k` and `trap` was searched for in the text of a page fetched from `docs.aws.amazon.com` or `aws.amazon.com` during this session. Redirects were not followed, so a page that no longer exists showed up as a 301/302 and not as a 200. A fact counted as confirmed only when the wording was found in the page text. About 190 pages were fetched.

## Counts

| Day | Entries | Checked | Sentences changed | Links changed |
|---|---|---|---|---|
| 8 | 10 | 10 | 5 | 1 replaced |
| 9 | 12 | 12 | 3 | 0 |
| 10 | 14 | 14 | 4 | 0 |
| 11 | 12 | 12 | 3 | 0 |
| 12 | 4 | 4 | 0 | 0 |
| 13 | 5 | 5 | 1 | 1 added |
| 14 | 3 | 3 | 0 | 0 |
| Total | 60 | 60 | 16 | 2 |

Entries that only give study technique (`d8e5`, `d8e6`, `d9e4`, `d9e5`, `d10e7`–`d10e9`, `d11e6`, `d12e2`–`d12e4`, `d13e1`, `d13e2`) hold no AWS fact apart from the examples in them, which were checked.

## Changed sentences

Day 8
- `d8e2` trap: "AWS Config rules, GuardDuty and Access Analyzer find a problem only after it exists" → "are detective and report what already exists". Control Tower implements preventive controls with SCPs, RCPs and declarative policies and detective controls with AWS Config rules. https://docs.aws.amazon.com/controltower/latest/controlreference/control-behavior.html
- `d8e2` trap: "not by shortening the session duration" was an inference. Now: leaked role credentials work until they expire unless the role's active sessions are revoked. https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html
- `d8e3` trap: "Flow Logs … hold no packet contents" was an inference. Now says what flow logs record (addresses, ports, accept or reject) and that the payload needs Traffic Mirroring. https://aws.amazon.com/vpc/faqs/
- `d8e4` k[2]: "Convert existing S3 objects with an S3 Batch Operations job" predates `UpdateObjectEncryption`. Now adds that SSE-S3 to SSE-KMS works in place with no copy. https://docs.aws.amazon.com/AmazonS3/latest/userguide/update-sse-encryption.html
- `d8e4` k[4]: "has to be enforced" was too absolute for `rds.force_ssl`, which is on by default from RDS for PostgreSQL 15. https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html
- `d8b1` k[3]: reworded to AWS's own Terraform guidance (state can expose sensitive information; avoid static access keys when running locally). The link to the Session Manager overview was replaced by that guidance page; the Session Manager facts in k[2] are on the Systems Manager VPC endpoints page, which stays linked. https://docs.aws.amazon.com/prescriptive-guidance/latest/terraform-aws-provider-best-practices/security.html

Day 9
- `d9e2` trap: "raises the pressure" was an inference. Now: more callers add no capacity to a saturated database; a queue with a capped consumer protects it. The cap is the SQS event source mapping's maximum concurrency. https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html
- `d9e3` k[4]: "Route 53 failover depends on resolvers honouring the TTL" → "DNS failover waits until clients' cached answers expire" (Global Accelerator FAQ: no reliance on the IP address caching of client devices). https://aws.amazon.com/global-accelerator/faqs/
- `d9b3` k[1]: the Terraform wording was removed. Now names the permission (`lambda:InvokeFunction` for `events.amazonaws.com`) or an execution role on the target. https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html

Day 10
- `d10e2` trap: "Transfer Acceleration does not help instances in the bucket's Region" was an inference. Now: it is for long distances and S3 may bypass it when it would not be faster. https://aws.amazon.com/s3/faqs/
- `d10e3` k[2]: "One invocation runs for at most 15 minutes" → "A standard function …". Lambda Managed Instances allow 90 minutes for asynchronous and event source mapping invocations. https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html
- `d10e4` k[1]: "Aurora Serverless v2" → "Aurora serverless (the docs' current name for Aurora Serverless v2)". The exam guide prints "Amazon Aurora Serverless". https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html
- `d10e6` k[4]: "Quick Sight" → "Quick Sight (in Amazon Quick, formerly QuickSight)". The exam guide's in-scope list prints "Amazon Quick"; the user guide moved to `/quick/`. https://docs.aws.amazon.com/quick/latest/userguide/spice.html

Day 11
- `d11e4` k[0]: predated Database Savings Plans. Now names them next to Reserved DB instances, and uses "Aurora serverless". https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html
- `d11e4` k[3]: "a cache … costs less than more read replicas, because every replica is another full DB instance" was an inference. Now quotes AWS: one cache node can replace a number of database instances and lower the total cost. https://aws.amazon.com/caching/
- `d11b1` k[0]: "An appointment can be rescheduled only twice" repeated the step's own note. Replaced by what the note lacks: a third change means cancelling and booking again, and a voucher's expiry date still applies. https://aws.amazon.com/certification/policies/before-testing/

Day 13
- `d13l1` k[1]: the second sentence repeated the step's note (two IDs at a test centre, one online). Replaced by the definition of a secondary ID. https://aws.amazon.com/certification/policies/during-testing/
- `d13l2` docs: added the page that states the EBS charge ("Amazon EBS volumes and Elastic IP addresses incur charges regardless of the instance's state"). https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html

## Inferred sentences listed in docs/keypoints.md

| Day | Sentence | Outcome |
|---|---|---|
| 8 | keep Terraform state out of Git (`d8b1`) | Reworded and partly sourced: AWS Prescriptive Guidance says the state file can expose sensitive information. Keeping `*.tfstate` out of Git remains standard practice, not an AWS sentence. |
| 8 | Flow Logs hold no packet contents (`d8e3`) | Sourced (VPC FAQ) and reworded. |
| 8 | revoking sessions rather than shortening them (`d8e2`) | Reworded to what the IAM page says. |
| 9 | Terraform wording for the Lambda permission (`d9b3`) | Removed. |
| 9 | more capacity in front of a saturated database (`d9e2`) | Reworded. The cap is sourced; "add no capacity" is still reasoning. |
| 9 | Replication Time Control percentage (`d9e3`) | Still left out. The user guide page fetched says 99.9% within 15 minutes. |
| 10 | Transfer Acceleration inside the bucket's Region (`d10e2`) | Reworded to the S3 FAQ. |
| 10 | "storage optimized for local disk I/O" (`d10e3`) | Sourced, unchanged: "high, sequential read and write access to very large data sets on local storage". https://docs.aws.amazon.com/ec2/latest/instancetypes/so.html |
| 11 | a cache costs less than more read replicas (`d11e4`) | Reworded to the AWS caching page. |
| 11 | Direct Connect "can reduce" network cost (`d11e5`) | Sourced, unchanged: "can reduce network costs, increase bandwidth throughput, and provide a more consistent network experience". https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/aws-direct-connect.html |
| 11 | Graviton price performance (`d11e3`) | Product-page wording, unchanged ("best price performance"). https://aws.amazon.com/ec2/graviton/ |

## Exam facts and logistics (Days 11, 13, 14)

All confirmed, none changed apart from the two rewordings above.

- 65 questions, 130 minutes, multiple choice or multiple response: https://aws.amazon.com/certification/certified-solutions-architect-associate/
- 50 scored and 15 unscored questions, unscored not identified, scaled score 100–1,000, pass mark 720, compensatory scoring, unanswered counts as incorrect, no penalty for guessing, response types, domain weights 30/26/24/20: https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html
- Reschedule only twice, up to 24 hours before; late cancellation or no-show forfeits the fee; ESL +30 requested once before registering: https://aws.amazon.com/certification/policies/before-testing/
- 14 calendar days before a retake, no limit on attempts, full fee each time, results within five business days: https://aws.amazon.com/certification/policies/after-testing/
- Names identical, primary and secondary ID, two IDs at a test centre and one primary ID online, EU ID card exception, unacceptable IDs, launch up to 30 minutes early, 15 minutes late or a failed system test forfeits the fee, arrive 15–30 minutes early, breaks: https://aws.amazon.com/certification/policies/during-testing/
- Credly email and Digital Badges tab: https://aws.amazon.com/certification/certification-digital-badges/
- 50% discount voucher: https://aws.amazon.com/certification/benefits/
- Three-year validity: "recertify every three years" https://aws.amazon.com/certification/faqs/

## Still uncertain

- `d8e2` k[0]: an SCP that denies on a missing `aws:RequestTag`. The SCP examples moved from the user guide to GitHub, so no docs page shows this one. The Region deny with `aws:RequestedRegion` is on the IAM examples page.
- `d8e3` k[1]: an endpoint policy with `aws:ResourceOrgID` blocking copies to buckets outside the organization. The key's definition was confirmed; an endpoint-policy example with it was not found on the page fetched.
- `d8e3` trap: "GuardDuty, Macie and Inspector … none of them blocks traffic" is a statement of absence, checked only against the service overviews.
- `d9b2` k[0]: "the subscription exists but nothing arrives" follows from the queue policy requirement; the page does not describe the symptom.
- `d9e3` k[2]: the RPO and RTO ranges per DR strategy are in a figure of the whitepaper, not in its text. The Reliability Pillar gives them in words and differs slightly (see below).
- `d10b2` k[2]: "Init Duration in the REPORT log line" was not found on the pages fetched. The rest of the sentence (SnapStart does not support OS-only runtimes) was.
- `d10e5` trap: "never an S3 bucket" for Global Accelerator is the complement of the endpoint list (ALB, NLB, EC2 instance, Elastic IP), not a sentence on the page.
- `d11e3` k[0], `d11e2` trap, `d11e5` trap: price comparisons ("cheaper on Spot", "costs more than S3 Standard", "neither lowers a data transfer bill"). Left alone by the owner's decision; only the fee structure was confirmed.
- `d11p2` k[0]: "not 72% of the questions" is a clarification, not AWS wording.
- The CloudFront Developer Guide page `PriceClass.html` now redirects to the pricing page. Price class is still a distribution setting (`DownloadDistValuesGeneral.html`); `d11e5` k[3] does not link the old page.

## Not reached

Nothing. All 60 entries had their second read. Not opened, by the owner's decision: Skill Builder pages.

## Found in plan.js or CARDS (not edited)

- Nothing wrong found in plan.js for Days 8–14.
- Card `d9c2`: pilot light "RPO and RTO in tens of minutes" and warm standby "RPO and RTO in minutes" follow the DR whitepaper's figure. The Reliability Pillar says pilot light "RPO in minutes, RTO in tens of minutes" and warm standby "RPO in seconds, RTO in minutes". Not an error, two AWS pages differ. https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_planning_for_recovery_disaster_recovery.html
- Card `d8c3`: nothing wrong. It does not mention that `rds.force_ssl` defaults to on from RDS for PostgreSQL 15 (same source as `d8e4` above), and it says to encrypt an existing RDS database by snapshot, encrypted copy and restore, which docs/keypoints.md already notes is no longer the only documented way.
- Card `d10c3` and drill or glossary entries that say "Quick Sight" or "QuickSight": the exam guide's in-scope list now prints "Amazon Quick". https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html
- Key file link titles: `Strategies.html` in the ElastiCache guide is now titled "Caching strategies for Memcached" (content unchanged: lazy loading, write-through, TTL). `d10e4` and `d10c2` link it as "ElastiCache caching strategies"; left as is.

## Checks

`node --test`: 33 of 33 pass. `node tools/links.mjs`: 349 links checked, 0 broken (run after the last edit to a key file).
