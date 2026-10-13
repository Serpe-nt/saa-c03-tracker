# Second verification pass: study extras and glossary

Date: 2026-10-12

Scope: `site/extras.js` (`CARDS`, `DRILL`, `CUES`) and the `GLOSSARY` object in `site/plan.js`.

Method: an independent read, not based on the first-pass log. Each statement was looked up in the text of a page fetched from `docs.aws.amazon.com` or `aws.amazon.com` with redirects not followed, so a missing page shows up as a redirect and not as a 200. A fact counted as confirmed only when the sentence or table entry was found in the page text. One figure (the disaster recovery strategies graphic) is an image and was read by eye. About 345 pages were fetched.

| Section | Entries | Checked | Changed |
|---|---|---|---|
| CARDS | 32 | 32 | 8 |
| GLOSSARY | 87 | 87 | 1 |
| DRILL | 171 | 171 | 11 |
| CUES | 45 | 45 | 2 |

No card id, glossary term or cue phrase was renamed or removed. No drill requirement is duplicated or longer than 110 characters. `CUE_TAGS` is untouched.

## CARDS (32 checked, 8 changed)

- `d1c6`: an AZ was described as having "independent power, cooling and networking". The page says "independent power, cooling, and physical security" (networking is "redundant"). https://aws.amazon.com/about-aws/global-infrastructure/regions_az/
- `d1c8`: the note on longer-running Lambda options left out durable functions, which AWS now lists beside the 15-minute limit ("multi-step workflows lasting up to a year"). Added; the cap is now worded as per invocation. https://docs.aws.amazon.com/lambda/latest/dg/welcome.html and https://aws.amazon.com/lambda/faqs/
- `d2c3`: "not from on-premises, peered VPCs or other Regions" did not match the page, which says gateway endpoints "do not allow access from on-premises networks, from peered VPCs in other AWS Regions, or through a transit gateway". Reworded to that. https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html
- `d3c1`: "Not a block device or a traditional file system" is too absolute since Amazon S3 Files (an NFS 4.1/4.2 file system on a bucket). Now says S3 itself stores objects and names S3 Files. https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-files.html
- `d5c2`: predictive scaling "uses ML". Neither predictive scaling page mentions machine learning; they say it analyzes up to 14 days of metric history to forecast daily or weekly patterns. Reworded. https://docs.aws.amazon.com/autoscaling/ec2/userguide/predictive-scaling-policy-overview.html
- `d8c3`: snapshot, encrypted copy and restore was given as the only way to encrypt an existing RDS database. The page also names a blue/green deployment. Added in brackets. https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html
- `d10c2`: ElastiCache "sub-millisecond". The product page and FAQ now say "microsecond latency"; "sub-millisecond" was not found on them. The card gives the AWS wording and notes that exam items often say sub-millisecond. https://aws.amazon.com/elasticache/faqs/
- `d11c2`: Database Savings Plans lacked their term. Added "1-year term, no upfront payment". https://aws.amazon.com/savingsplans/database-pricing/

The three points the first pass raised were re-checked and stand: `d9c3` lists IP-based routing (Route 53 has eight routing policies, https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html), `d11c2` names Database Savings Plans, and `d1c8` limits the 15 minutes to a standard function.

The other 24 cards matched the fetched pages as written. `d9c2` matches the whitepaper graphic (hours, 10s of minutes, minutes, real-time). The Reliability Pillar text splits the same strategies more finely (pilot light: RPO in minutes, RTO in tens of minutes; warm standby: RPO in seconds, RTO in minutes), which the card does not contradict. https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_planning_for_recovery_disaster_recovery.html

No card tells the learner to enable IAM Identity Center; `d8c1` only explains it.

## GLOSSARY (87 checked, 1 changed)

- `Savings Plans`: "1- or 3-year … for cheaper compute" left out Database Savings Plans, which are 1-year and cover databases. https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html and https://aws.amazon.com/savingsplans/database-pricing/

Entries that repeat a fact from a card were covered by the card checks. The glossary-only facts were looked up separately: subnet, Session Manager, RDS engines, Aurora's six storage nodes in three AZs, Parameter Store standard tier, public IPv4 billing, user data at first launch, Snowball closure and end of support, Pearson VUE, Credly, API Gateway API types, ECS, EKS.

## DRILL (171 checked, 11 changed)

Item numbers are positions in the array.

- 48 AWS Data Transfer Terminal: kept as the answer (decision below). The explanation now says that older exam items answer this with AWS Snow Family, the name the exam guide still lists. https://docs.aws.amazon.com/snowball/latest/developer-guide/doc-history.html and https://docs.aws.amazon.com/datatransferterminal/latest/userguide/what-is-dtt.html
- 54 Amazon Aurora Serverless: the answer was "Amazon Aurora Serverless v2", a name the Aurora guide no longer prints (the pages are titled "Aurora serverless"; "v2" survives only in the API and CLI names). The answer is now the name the exam guide lists, the explanation gives the former name and the 0-ACU floor, and the requirement says "OLTP" so that Redshift Serverless is no longer arguable. https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html and https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.requirements.html
- 55 Amazon Aurora Global Database: "local reads in several Regions and cross-Region failover within minutes" also fits cross-Region RDS read replicas, which is one of the wrong answers. The requirement now names the lag under a second, which only Aurora's storage-level replication documents; it also no longer leans on the recovery time AWS states two ways. https://aws.amazon.com/rds/aurora/global-database/
- 60 Amazon MemoryDB: "(formerly MemoryDB for Redis)" was found on no page and the exam guide does not list the service, so it was dropped. "Multi-AZ transactional log" now follows the page wording. https://docs.aws.amazon.com/memorydb/latest/devguide/what-is-memorydb.html
- 67 and 68 (wrong answer), 160 (answer), 161 (wrong answer): the option now reads "AWS Transform MGN (formerly AWS Application Migration Service)" in all four (decision below). https://aws.amazon.com/application-migration-service/
- 118 AWS Security Hub CSPM: the answer was "AWS Security Hub". AWS says "What you previously knew as Security Hub, focused on aggregating security findings, security best practice checks, and compliance monitoring, is now available as Security Hub CSPM", which is the requirement word for word. The option is now "AWS Security Hub CSPM (formerly AWS Security Hub)" and the explanation says which name the exam guide lists and what the new unified Security Hub adds. https://aws.amazon.com/security-hub/faqs/ and https://docs.aws.amazon.com/securityhub/latest/userguide/what-are-securityhub-services.html
- 142 Amazon Quick Sight: the option now carries "(formerly Amazon QuickSight)" and the explanation names Amazon Quick, which is what the exam guide lists. https://docs.aws.amazon.com/quick/latest/userguide/what-is.html
- 148 AWS X-Ray: "service maps" is now "trace map", the term on the X-Ray pages. https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html

Decisions on the open points of the first pass:

- **Item 48, Data Transfer Terminal.** Kept. AWS's own Snowball notice sends new customers to "AWS Data Transfer Terminal for secure physical transfers", the requirement ("bringing your own storage devices to an AWS physical location") describes that service and none of the three wrong answers, and the service is on no lifecycle list. The Enterprise Support restriction is real and stays in the explanation; it does not make another option correct.
- **Items 67, 68, 160, 161, AWS Transform MGN.** The current name stays, and the former name moved from the explanation into the option label. Reason: the drill shows an explanation only for items the learner got wrong (`drillPick` in `app.js`), so a learner who answers correctly would never see "AWS Application Migration Service", the name the exam prints. The same label is used where the service is a wrong answer, so its length gives nothing away. The labels were checked in the page at 375 px: they wrap to two lines without overflow.
- **Item 118, Security Hub.** Settled by the FAQ sentence quoted above.

For every item the keyed service was read against the requirement and the three wrong answers. Apart from items 54 and 55 none was found to have a second defensible answer.

## CUES (45 checked, 2 changed; first column untouched)

- "Unpredictable or unknown access patterns": "Aurora Serverless v2" is now "Aurora serverless (formerly Aurora Serverless v2)" (same sources as item 54).
- "Large dataset, limited bandwidth, tight deadline": now says the exam guide still lists AWS Snow Family (same sources as item 48).

The "Sub-millisecond" cue was left as it is: AWS now advertises ElastiCache and MemoryDB with microsecond latency, which is still sub-millisecond, and the phrase in the first column is the exam's.

## Still uncertain

- Four statements were left as they are under the owner's rule: three price statements whose figures load by script, and one recovery time that AWS's own pages state two ways.
- **Former names taken from identifiers, not from a sentence.** "formerly Aurora Serverless v2" rests on the CLI option `--serverless-v2-scaling-configuration` and the API attribute `ServerlessV2ScalingConfiguration` on pages now titled "Aurora serverless". "trace map" replacing "service map" rests on the page `xray-console-servicemap.html` being titled "Using the X-Ray trace map"; the explanation of item 148 says "(formerly service map)" on that basis.
- **Distractors.** That a wrong answer is not equally defensible is a judgement; no page states what a service cannot do.
- **Glossary entries not traced to a sentence:** `Terraform` (not an AWS product), the plain acronym expansions, the full SNS protocol list, the words "at a test centre" in `Pearson VUE`, and "short-lived credentials" in `IAM Identity Center`.
- **Route 53 Resolver.** The Resolver page is now titled "What is Route 53 VPC Resolver?"; its text still says "Resolver endpoints", so item 82 and the hybrid cue were not renamed. https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html

## Not reached

Nothing. All four sections had a second read.
