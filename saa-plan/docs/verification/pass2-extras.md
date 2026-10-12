# Second verification pass: study extras and glossary

Date: 2026-10-12

Scope: `site/extras.js` (`CARDS`, `DRILL`, `CUES`) and the `GLOSSARY` object in `site/plan.js`.

**This pass is incomplete.** The session ran out of usage allowance after the model answers and the glossary. `DRILL` and `CUES` were not re-read; see "Not reached".

Method: an independent read, not based on the first-pass log. Each statement was looked up in the text of a page fetched from `docs.aws.amazon.com` or `aws.amazon.com` (no redirects followed, so a missing page shows up as a redirect and not as a 200). A fact counted as confirmed only when the sentence or table entry was found in the page text. One figure (the disaster recovery strategies graphic) is an image and was read by eye.

| Section | Entries | Checked | Changed |
|---|---|---|---|
| CARDS | 32 | 32 | 8 |
| GLOSSARY | 87 | 87 read, see note below | 1 |
| DRILL | 171 | 0 | 0 |
| CUES | 45 | 0 | 0 |

No key, card id or glossary term was renamed or removed.

## CARDS (32 checked, 8 changed)

- `d1c6`: an AZ was described as having "independent power, cooling and networking". The page says "independent power, cooling, and physical security" (networking is "redundant"). https://aws.amazon.com/about-aws/global-infrastructure/regions_az/
- `d1c8`: the note on longer-running Lambda options left out durable functions, which AWS now lists beside the 15-minute limit ("multi-step workflows lasting up to a year"). Added; the cap is now worded as per invocation. https://docs.aws.amazon.com/lambda/latest/dg/welcome.html and https://aws.amazon.com/lambda/faqs/
- `d2c3`: "not from on-premises, peered VPCs or other Regions" did not match the page, which says gateway endpoints "do not allow access from on-premises networks, from peered VPCs in other AWS Regions, or through a transit gateway". Reworded to that. https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html
- `d3c1`: "Not a block device or a traditional file system" is too absolute since Amazon S3 Files (NFS 4.1/4.2 file system on a bucket). Now says S3 itself stores objects and names S3 Files. https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-files.html
- `d5c2`: predictive scaling "uses ML". Neither predictive scaling page mentions machine learning; they say it analyzes up to 14 days of metric history to forecast daily or weekly patterns. Reworded. https://docs.aws.amazon.com/autoscaling/ec2/userguide/predictive-scaling-policy-overview.html
- `d8c3`: snapshot, encrypted copy and restore was given as the only way to encrypt an existing RDS database. The page also names a blue/green deployment. Added in brackets. https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html
- `d10c2`: ElastiCache "sub-millisecond". The product page and FAQ now say "microsecond latency"; "sub-millisecond" was not found on them. Card gives the AWS wording and notes that exam items often say sub-millisecond. https://aws.amazon.com/elasticache/faqs/
- `d11c2`: Database Savings Plans lacked their term. Added "1-year term, no upfront payment". https://aws.amazon.com/savingsplans/database-pricing/

The three points the first pass raised were re-checked and stand: `d9c3` lists IP-based routing (Route 53 has eight routing policies, https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html), `d11c2` names Database Savings Plans, and `d1c8` limits the 15 minutes to a standard function.

The other 24 cards matched the fetched pages as written. `d9c2` matches the whitepaper graphic (hours, 10s of minutes, minutes, real-time); the Reliability Pillar text splits the same strategies more finely (pilot light: RPO in minutes, RTO in tens of minutes; warm standby: RPO in seconds, RTO in minutes), which the card does not contradict. https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_planning_for_recovery_disaster_recovery.html

## GLOSSARY (87 read, 1 changed)

- `Savings Plans`: "1- or 3-year … for cheaper compute" left out Database Savings Plans, which are 1-year and cover databases. https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html and https://aws.amazon.com/savingsplans/database-pricing/

Note on coverage: every entry was read. Entries that repeat a fact from a card were covered by the card checks; the glossary-only facts were looked up separately (subnet, Session Manager, RDS engines, Aurora's six storage nodes in three AZs, Parameter Store standard tier, public IPv4 billing, user data at first launch, Snowball closure and end of support, Pearson VUE, Credly, API Gateway API types, ECS, EKS). Not traced to a sentence: `Terraform` (not an AWS product), the plain acronym expansions, the full SNS protocol list, the words "at a test centre" in `Pearson VUE`, and "short-lived credentials" in `IAM Identity Center`.

## Still uncertain

Four statements were left as they are under the owner's rule: two price statements whose figures load by script, and two points where AWS's own pages give different numbers.

## Not reached

- **DRILL, all 171 items.** No second read. The open points from the first-pass log are therefore undecided: AWS Data Transfer Terminal as the answer to item 48, and "AWS Transform MGN" against the exam guide's "AWS Application Migration Service" in items 67, 68, 160 and 161.
- **CUES, all 45 rows.**

Facts already fetched in this pass that the next reader of those two sections will need:

- The SAA-C03 in-scope list still prints "AWS Application Migration Service", "AWS Snow Family", "AWS Security Hub", "Amazon Quick", "Amazon Aurora Serverless", "Amazon Data Firehose" and "Amazon SageMaker AI". https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html
- Snowball: closed to new customers since 2025-11-07; support ends 2026-12-31. https://aws.amazon.com/snowball/ and https://docs.aws.amazon.com/snowball/latest/developer-guide/doc-history.html
- ElastiCache is described with "microsecond latency" (affects the "Sub-millisecond" cue and the ElastiCache drill items).
- Predictive scaling is no longer described as machine learning (affects the "Predictable or recurring load" cue only in wording).
- Inter-AZ data transfer through PrivateLink interface endpoints is free; cross-AZ EC2 traffic is charged in each direction. https://aws.amazon.com/ec2/pricing/on-demand/
