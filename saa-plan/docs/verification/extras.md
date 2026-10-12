# Verification log: study extras and glossary

Date: 2026-10-12

Scope: `site/extras.js` (`CARDS`, `DRILL`, `CUES`) and the `GLOSSARY` object in `site/plan.js`.

Method: about 320 pages were fetched directly from `docs.aws.amazon.com` and `aws.amazon.com` (HTTP 200, read as text) and each entry's claims were compared with the page for that service. No web-search snippets were used. Service availability was checked against the three AWS lifecycle lists ([maintenance](https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html), [sunset](https://docs.aws.amazon.com/general/latest/gr/sunset_services.html), [full shutdown](https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html)); names were checked against each service's own page and the [SAA-C03 in-scope services list](https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html).

| Section | Entries checked | Entries changed |
|---|---|---|
| CARDS | 32 | 9 |
| GLOSSARY | 87 | 9 |
| DRILL | 171 | 9 |
| CUES | 45 | 3 |

No key, card id, glossary term or cue phrase was renamed or removed. No drill or model answer points at a service on the maintenance, sunset or shutdown lists.

## CARDS (32 checked, 9 changed)

- `d1c6`: "normally three or more AZs" was hedged; AWS states every Region has a minimum of three. https://aws.amazon.com/about-aws/global-infrastructure/regions_az/
- `d1c8`: "up to 15 minutes" is now only the standard limit; Lambda Managed Instances allow 90 minutes for asynchronous invocations. Card now says so and the decider reads "a standard Lambda function". https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
- `d2c2`: "only data transfer" was too broad; peering traffic inside one AZ is free, only cross-AZ and cross-Region transfer is charged. https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html
- `d3c2`: "up to 15 for MySQL, MariaDB and PostgreSQL" was out of date; the quota is 15 per source instance, and the SQL Server and Oracle pages also say 15 (Db2 allows 3). Now "for most engines". https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html
- `d5c1`: NLB protocols lacked QUIC (listeners are TCP, TLS, UDP, TCP_UDP, QUIC, TCP_QUIC). https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html
- `d9c2`: pilot light and warm standby RPO/RTO did not match the AWS figure (pilot light: tens of minutes; warm standby: minutes; active/active: real time). https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html
- `d9c3`: added one line on IP-based routing, which Route 53 now lists as a routing policy beside the seven in the prompt. https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html
- `d9c4`: "promoted in about a minute" stated the marketing figure as fact; the user guide says RTO is "in the order of minutes" and RPO "typically measured in seconds". Card now gives both. https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database-disaster-recovery.html and https://aws.amazon.com/rds/aurora/global-database/
- `d11c2`: added Database Savings Plans (up to 35%), now one of four Savings Plans types. https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html

The other 23 cards matched the fetched pages as written. Discount figures kept because the official pages state them: Compute Savings Plans 66%, EC2 Instance Savings Plans and Reserved Instances 72%, Spot 90%.

## GLOSSARY (87 checked, 9 changed)

- `Region`: "several" AZs is now "at least three". https://aws.amazon.com/about-aws/global-infrastructure/regions_az/
- `NAT gateway`: billing is per hour and per GB processed, not per hour only. https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html
- `Interface endpoint`: billing is per hour and per GB, not per hour only. https://aws.amazon.com/privatelink/pricing/
- `RDS`: engine list lacked Db2. https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html
- `ElastiCache`: engine names are Valkey, Redis OSS and Memcached. https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html
- `NLB`: added TLS to the listed protocols. https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html
- `Lambda`: "max 15 min per run" is the standard limit only (see `d1c8`). https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
- `Kinesis`: used the old name "Data Firehose" as a Kinesis product; it is Amazon Data Firehose (formerly Kinesis Data Firehose). https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html
- `Snow Family`: described as a current offering. Snowball Edge closed to new customers on 2025-11-07 and support ends on 2026-12-31. https://docs.aws.amazon.com/snowball/latest/developer-guide/doc-history.html and https://aws.amazon.com/snowball/

## DRILL (171 checked, 9 changed)

Item numbers are positions in the array.

- 18 CloudFront Functions: "sub-millisecond startup" is not what AWS states; the documented figure is sub-millisecond function duration at millions of requests per second. https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html
- 48 AWS Data Transfer Terminal: explanation now also gives the Snowball end-of-support date (2026-12-31). https://aws.amazon.com/snowball/
- 55 Amazon Aurora Global Database: requirement said "recovery in about a minute"; now "failover within minutes" (same sources as `d9c4`).
- 67 AWS Database Migration Service: distractor renamed to AWS Transform MGN.
- 68 AWS DMS Schema Conversion: distractor renamed; explanation called it "the managed form of SCT", but AWS describes it as a feature of AWS DMS, with SCT a separate downloadable tool. https://docs.aws.amazon.com/dms/latest/userguide/CHAP_SchemaConversion.html
- 79 AWS Site-to-Site VPN: "Direct Connect takes weeks to provision" is not a figure AWS publishes; reworded to the mechanism (a physical connection must be provisioned first). https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html
- 154 AWS Compute Optimizer: requirement said "using ML"; current pages describe analysis of configuration and utilization metrics and no longer mention machine learning. https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html
- 160 AWS Transform MGN: the keyed name "AWS Application Migration Service" is the former name. Answer renamed; the explanation gives the old name, which the exam guide still lists. https://aws.amazon.com/application-migration-service/
- 161 AWS Elastic Disaster Recovery: distractor renamed to AWS Transform MGN.

For every item the keyed service was re-read against the requirement and the three distractors; none was found to have a second defensible answer. That part is a judgement, not something a page can confirm.

## CUES (45 checked, 3 changed; first column untouched)

- "Ordering / in order": "Kinesis shard per partition key" was wrong (many keys share a shard); now "keeps order within a shard (records with the same partition key)". https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html
- "Lift and shift / rehost": service renamed to AWS Transform MGN, old name kept in brackets. https://aws.amazon.com/application-migration-service/
- "Large dataset, limited bandwidth, tight deadline": added the Snowball end-of-support date. https://aws.amazon.com/snowball/

## Still uncertain

- **AWS Transform MGN in the drill.** The exam guide still says "AWS Application Migration Service". The drill now shows the current name as the option and the old name only in the explanation, following the rule in `docs/questions.md`. If the owner would rather drill the name the exam prints, items 67, 68, 160 and 161 are the ones to revert.
- **Drill item "AWS Security Hub"** (aggregate findings and run best-practice checks). The behaviour described belongs to Security Hub CSPM; the answer was kept as "AWS Security Hub" because the exam guide lists that name and the explanation already separates the two.
- **Aurora Global Database recovery time.** The user guide (minutes) and the product page (under 1 minute) disagree; the card quotes both.
- **`d11c3`, "a per-GB fee lower than NAT".** The NAT pricing page recommends endpoints to cut cost, but both pricing pages load their dollar figures by script, so the comparison itself was not read from a page.
- **Glossary entries with no AWS source:** `Terraform` (a HashiCorp tool). Plain expansions of acronyms (`EC2`, `VPC`, `ECS`, `EKS`, `IAM`) were accepted without tracing each to a sentence.
- **Shield Response Team support plan.** Not stated in these files, but relevant to the open doubt in `docs/questions.md`: the Shield docs still name "the Business Support plan or the Enterprise Support plan".

## Not reached

Nothing. All four sections were read in full.
