# Second verification pass: key points, Days 1–7

Date: 2026-10-12. Files: `site/keys/d01.js` … `d07.js`. Branch `claude/pass2-keys-d01-d07-f6965f`.

## Method

An independent second read of every entry. Each sentence in `k` and `trap` was looked up on a page fetched from `docs.aws.amazon.com` or `aws.amazon.com` (no redirects followed, so a missing page shows as such), and counted as confirmed only when the statement was found in the page text. A sentence that could not be found was reworded to what the page says or removed. Days 1 and 7 were read by the session itself; Days 2–6 by one reader agent per file, each of which wrote an evidence line (URL plus the page's words) for every sentence. The session then re-checked what the readers flagged as unsure and audited their changes against the pages.

The sections for Days 2–6 are the readers' own logs, each preceded by the session's audit note. Remarks about tests or `tools/links.mjs` inside a reader's section describe that reader's run while other files were still being edited; the final results are under "Checks" at the end. Counts in the summary table include the session's later changes.

Not done by this pass: prices, lead times, anything behind the Skill Builder login (owner's decision), and a human AWS expert's review.

## Summary

| Day | Entries checked | Entries changed | Sentences changed, added or removed | Links added, swapped or retitled |
|---|---|---|---|---|
| 1 | 23 of 23 | 17 | 24 | 10 |
| 2 | 11 of 11 | 9 | 8 | 4 |
| 3 | 12 of 12 | 10 | 12 | 9 |
| 4 | 13 of 13 | 9 | 12 | 4 |
| 5 | 11 of 11 | 8 | 12 | 5 |
| 6 | 13 of 13 | 11 | 17 | 4 |
| 7 | 8 of 8 | 5 | 2 | 3 |
| Total | 91 of 91 | 69 | 87 | 39 |

## Day 1 (`d01.js`)

Changed sentences:

- `d1a2` k2: repeated the step's own note (an organization upgrades the Free plan). Replaced with two facts the note lacks: a Control Tower landing zone also triggers the upgrade, and the Free plan has no access to Savings Plans or Reserved Instances. The "Enable IAM Identity Center" link no longer supported the entry and was dropped. https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html
- `d1b1` k2: said AWS recommends "an administrative user in IAM Identity Center" for daily work. The page says "create an administrative user for everyday tasks" and names Identity Center only for multi-account organizations; the old wording also contradicted the plan's IAM admin user. https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html
- `d1b2` k3: "batch or analytics" → the page's own examples (analytics, HPC). https://aws.amazon.com/blogs/architecture/what-to-consider-when-selecting-a-region-for-your-workloads/
- `d1b2` trap: "edge locations inside a country do not satisfy residency" was an inference. Reworded to what the pages state: edge locations hold cached copies and the origin keeps the definitive version. Link added. https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html
- `d1c1` k3 removed: it repeated the step's note (enabling creates an organization, which ends the Free plan). k2 keeps the part the note lacks (organization instance versus account instance).
- `d1u2` k1: "every change then has to be repeated user by user" is not on the page. Reworded to the page's example (a person who changes jobs moves to another group). Link added. https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html
- `d1u4`: "IAM users do not sign in at the root sign-in page" is not what the page says (there is also a general sign-in endpoint where the account ID is typed in), and the URL repeated the step text. Now: account ID or alias plus user name plus password. https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_sign-in.html
- `d1d1` k2: "stop chosen EC2 or RDS instances" → "target specific EC2 or RDS instances"; none of the three budget-action pages says what the action does to the instance. https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-controls.html
- `d1d1` docs: "Using a budget template" supported no sentence; replaced with the page that carries k4 (about five weeks of data before a forecast). https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-best-practices.html
- `d1w2` k5: "Capacity is reserved only by…" was too absolute: the purchasing page also names Capacity Blocks. Now states the comparison table's wording (capacity in a specific AZ for zonal RIs and Capacity Reservations; none for regional RIs and Savings Plans). https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html
- `d1w3` k1: "a standard function invocation" is not an AWS term. Now the quota page's wording: up to 15 minutes, 90 on Lambda Managed Instances when invoked asynchronously. https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
- `d1w3` k4: Elastic Beanstalk now provisions "EC2 instances or EKS clusters" (Standard and Cluster mode); "the service itself is free" → the page's "no additional charge". https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html
- `d1w3` k5: "kernel modules, host-level agents or special hardware mean EC2" was an inference. Kept the documented limits of EKS on Fargate and tied the conclusion to the guest operating system being the customer's on EC2. https://docs.aws.amazon.com/eks/latest/userguide/fargate.html , https://aws.amazon.com/compliance/shared-responsibility-model/
- `d1w3` trap: "a job that runs for hours cannot be a Lambda function" → "does not fit in one Lambda invocation" (durable functions run multi-step workflows for up to a year). https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
- `d1w3`, `d1c8` docs: link title corrected to the page's title, "Architect for AWS Fargate for Amazon ECS".
- `d1w4` k3: "a VPC belongs to one Region" → "a VPC spans the AZs of one Region", which is what the VPC pages state. https://aws.amazon.com/vpc/faqs/
- `d1w4` trap: "you cannot launch EC2 instances or RDS databases there" was an inference. Now the EC2 page's list of locations where EC2 runs. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html
- `d1p1` k1: "it runs no server-side code" is no longer stated on the S3 pages. Now: static content and client-side scripts, and the website endpoint supports only GET and HEAD requests. https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html
- `d1p1` k3: the page now names Amplify Hosting first and CloudFront second for HTTPS; said so. Same page.
- `d1p1` trap: "a certificate uploaded as an object does nothing" was an inference; removed. The trap now rests on "website endpoints do not support HTTPS". Same page.
- `d1p2` docs: "Regions and Zones" did not carry the entry's claims; replaced with the pages that do (a subnet sits in one AZ; a volume and its instance must be in the same AZ). https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html , https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html
- `d1p3` k5: "when bootstrapping is too slow, build a custom AMI" was an inference. Now the AMI page's statement (an AMI created from an instance launches instances with the same configuration). https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html
- `d1p3` docs: k4 (user data is not protected by authentication or cryptographic methods) is on the instance metadata page, which was not linked; it replaces "Change the instance type". https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html
- `d1c4` k1: repeated the step text word for word. Replaced with the page's recommendation to assign access to groups rather than users. Link added. https://docs.aws.amazon.com/singlesignon/latest/userguide/assignusers.html
- `d1c5` k1: "so you never create long-term access keys for yourself" addressed the learner, who has no Identity Center; now about Identity Center users, with the page's "request and retrieve" wording. https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html
- `d1c5` k2: "even with MFA enabled" is not on the page; removed. https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html
- `d1c6` trap: "edge locations … never host your workload" was too absolute (edge functions run there) and unsourced; now "holds cached copies; not a place to run EC2 instances". https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html
- `d1c8` trap: Elastic Beanstalk "still runs EC2 instances" → "provisions EC2 instances or an EKS cluster". https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html

Confirmed without change: `d1a1`, `d1u1`, `d1u3`, `d1c3`, `d1w1`, `d1c7`, and every sentence not listed above in the other entries. Sources used beyond the linked ones: the Cognito definition in the `d1c1` trap (https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html), "retain full control over the AWS resources" for the Elastic Beanstalk clause of the `d1w3` trap (https://aws.amazon.com/elasticbeanstalk/faqs/), the instance family descriptions (https://aws.amazon.com/ec2/instance-types/), On-Demand "short-term, irregular workloads that cannot be interrupted" (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html), a cluster placement group sits in a single AZ (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html).

Inferred sentences listed in `docs/keypoints.md` for Day 1:

- Credits after the Free plan upgrade (`d1a2`, `d1c1`): still not stated in either entry, because the two AWS pages still disagree (Identity Center page: credits "expire immediately"; Billing page: remaining credits "are automatically applied to future AWS bills"). Left out on purpose.
- "Standard" Lambda invocations cap at 15 minutes (`d1w3`): reworded to the quota page.
- EC2 needed for kernel modules, host agents or GPUs (`d1w3`): reworded to documented limits plus one stated consequence.
- Edge locations don't satisfy residency and host no EC2 or RDS (`d1b2`, `d1w4`, `d1c6`): reworded to sourced statements. The residency point itself now has a direct source: "You choose the AWS Region(s) in which your content is stored … We will not move or replicate your content outside of your chosen AWS Region(s) without your agreement" (https://aws.amazon.com/compliance/data-privacy-faq/). The RDS half was dropped.
- A certificate uploaded as an object does nothing (`d1p1`): removed.
- Custom AMI when bootstrapping is too slow (`d1p3`): reworded to the AMI page.

## Day 2 (`d02.js`)

Read by a reader agent; its log follows. Audit by the session: the seven rewordings were re-read on the pages named (Direct Connect gateway exception, ephemeral port range, BYOIP addresses not charged, gateway endpoint as a route table target) and stand. One further change by the session: `d2b3` k3 ended "No gateway endpoint exists for it", which was only derived; it now says "Gateway endpoints exist only for S3 and DynamoDB" (https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html). That settles item 6 of the reader's "Still uncertain" list and makes `d2b3` a changed entry (9 in all).

### Counts

- Entries in the file: 11 (d2w1, d2p1, d2p2, d2b1–d2b5, d2c1–d2c3). The task text says 12; the id list it gives has 11, and plan.js has 11 Day 2 steps.
- Entries checked: 11 of 11. Claims checked: 122 lines in `evidence-d02.md` (107 confirmed on a fetched page, one of them by arithmetic; 7 reworded; 6 advice or framing; 2 kept without a page stating them in words).
- Entries changed: 8 (d2w1, d2p1, d2p2, d2b2, d2b4, d2b5, d2c2, d2c3). Unchanged: d2b1, d2b3, d2c1.
- Sentences changed: 7. Doc links changed: 4 (one added, three swapped). Nothing removed.

### Changed sentences

- d2w1 k3: "a Direct Connect gateway ... does not route between those VPCs" was too absolute. The page documents an exception (a supernet advertised over the same virtual interface lets the VPCs talk through the Direct Connect endpoint). Now: "as a rule it does not let those VPCs send traffic to each other". https://docs.aws.amazon.com/directconnect/latest/UserGuide/direct-connect-gateways-intro.html
- d2c2 trap: same claim, same fix ("as a rule does not let the VPCs associated with it send traffic to each other"). Same URL.
- d2p1 k2: "Reaching an instance from the internet takes ... a public IPv4 address" ignored IPv6; the page says "a public IPv4 address or an IPv6 address". Added "over IPv4". https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html
- d2b4 k2: "(1024-65535 covers every client)" was an absolute and marked inferred. The page says the range is opened "to cover the different types of clients". Now: "covers the different client types". https://docs.aws.amazon.com/vpc/latest/userguide/custom-network-acl.html
- d2b5 k3: "AWS charges for every public IPv4 address" is not true for addresses you bring yourself (BYOIP: "These public IPv4 addresses are not charged"). Now: "every public IPv4 address it provides". https://aws.amazon.com/vpc/pricing/
- d2b5 trap: "because every public IPv4 address is charged" had the same problem. Now: "because AWS charges for both" (auto-assigned and Elastic IP), which is what the EC2 page states. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html
- d2c3 trap: "A gateway endpoint ... is only a route table entry" contradicted k1 of the same entry (a gateway endpoint also carries an endpoint policy). Now: "is a target in the subnet's route table", the S3 guide's own description. https://docs.aws.amazon.com/AmazonS3/latest/userguide/privatelink-interface-endpoints.html

### Changed doc links

- d2p2: added the whitepaper page "VPC peering" (third link). It is the page that says in words that peering has "the lowest overall cost ... when compared to other options for inter-VPC connectivity", which k4's "cheapest way to join a few VPCs" needs. https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/vpc-peering.html
- d2b2: "Session Manager prerequisites" replaced by "Troubleshooting managed node availability". The new page states the "three requirements" of k1 and the two checks of the trap; it also repeats the port 443 line the old page was there for. https://docs.aws.amazon.com/systems-manager/latest/userguide/fleet-manager-troubleshooting-managed-nodes.html
- d2c2: "AWS Transit Gateway pricing" replaced by "Direct Connect gateways", the page behind the reworded trap. The billing sentence in the CARD is also stated in words on the Transit Gateway page that stays linked. https://docs.aws.amazon.com/directconnect/latest/UserGuide/direct-connect-gateways-intro.html
- d2c3: "Gateway endpoints" (generic) replaced by the whitepaper page "AWS PrivateLink", the only fetched page that states all three claims of k2 (Network Load Balancer, only consumers initiate, overlapping ranges). The gateway side is still covered by "Gateway endpoints for Amazon S3". https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/aws-privatelink.html

### Inferred sentences for Day 2 (docs/keypoints.md)

- "1024–65535 covers every client's ephemeral ports" (d2b4): sourced and reworded to the page's wording. https://docs.aws.amazon.com/vpc/latest/userguide/custom-network-acl.html
- "'low cost' means Site-to-Site VPN" (d2w1 trap): sourced, sentence unchanged. AWS's words: customers who want "a lower-cost backup connection ... can establish AWS Direct Connect connections with a VPN backup". That is the backup context only; see "Still uncertain". https://aws.amazon.com/directconnect/resiliency-recommendation/
- "the 'VPC and more' wizard's exact labels" (d2b1): the entry itself names only one console label, "Resource map" tab, and that is confirmed (https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html, https://docs.aws.amazon.com/vpc/latest/userguide/view-vpc-resource-map.html). The other labels ("VPC and more" is on the page; "In 1 AZ" is not) are in plan.js; see the last section.

### The session's doubts, one by one

- Direct Connect gateway (d2w1, d2c2): too absolute, reworded (above).
- "a VPC has only one" internet gateway: confirmed, quotas page ("You can attach only one internet gateway to a VPC at a time").
- "two tunnels", "MACsec", Route 53 policy descriptions, CNAME at the apex: all confirmed, sentences unchanged.
- "/16 and /28 and cannot be resized later": confirmed. "a /27 has 27 usable": arithmetic on the confirmed five reserved addresses. Main route table advice: confirmed ("One way to protect your VPC is to leave the main route table in its original default state").
- d2p2 "traffic that stays within one AZ is free" and "cheapest": both stated in words, the first on the peering guide, the second in the whitepaper. "Inter-Region traffic is encrypted": confirmed.
- d2b1 regional versus zonal wording, "no security group", "no port forwarding": confirmed, unchanged.
- d2b2/d2b3: SSM Agent on Amazon Linux 2023 confirmed (the page says "you'll likely find"); `ssmmessages`/`ec2messages` confirmed; "No gateway endpoint exists for it" kept but only derived (see below). d2b3 does not repeat the plan note: the note explains the NAT path, the entry explains the path without NAT.
- d2b4 Flow Logs destinations and ACCEPT/REJECT: confirmed.
- d2b5 Elastic IP after deletion and blackhole routes: confirmed. "every public IPv4 address": reworded (above).
- d2c1–d2c3 traps against CARD and docs: `aws:sourceVpce` confirmed (the page spells it this way; the quiz writes `aws:SourceVpce`, condition keys are not case-sensitive); "only consumers initiate connections" confirmed in the whitepaper; "only a route table entry" reworded.

### Still uncertain (kept without a page stating it in these words)

1. d2w1 trap, "'Low cost' ... means Site-to-Site VPN". AWS calls the VPN the "lower-cost backup connection" next to Direct Connect; no fetched page says in general that a VPN costs less. Kept because it is an exam cue, not a price figure, and q02-037 and q02-040 test it.
2. d2p1 k1, second sentence ("Auto-assigned public IP addresses, NACL rules or the subnet's name do not make it public"). The page says the subnet type "is determined by how you configure routing"; the list of things that do not count is the writer's.
3. d2p1 k5, "a /27 has 27 usable". Arithmetic (32 − 5); the page's own example is a /24.
4. d2b1 k1, "private route tables send 0.0.0.0/0 to the NAT gateway". True of the pattern and of the CLI procedure on the Create a VPC page. Which route tables the console wizard actually creates was not checked in an account; the route tables page says "If you Create a VPC and choose a NAT gateway, Amazon VPC automatically adds routes to the main route table for the gateways", which reads differently.
5. d2b2 k1, "already installed on Amazon Linux 2023 AMIs". The page hedges: "you'll likely find that the SSM Agent is already installed", and adds that an instance "might not have SSM Agent preinstalled" depending on when it was initialized.
6. d2b3 k3, "No gateway endpoint exists for it". Derived: the PrivateLink concepts page describes gateway endpoints as sending traffic "to Amazon S3 or DynamoDB", and the Systems Manager page names only interface endpoints.
7. d2b3 trap, first sentence (hardened bastion variants). Distractor framing; no page consulted.
8. d2b4 k4, "without any agent". The page says flow log data "is collected outside of the path of your network traffic"; it does not use the word agent.
9. d2b4 trap, "neither shows dropped packets". Follows from what CloudTrail and AWS Config record; no page says it.
10. d2c3 trap, "usually means ... not a missing route". Troubleshooting heuristic. The two facts behind it (the endpoint is a network interface in the subnet; its security group must allow inbound HTTPS) are confirmed.
11. d2c3 k2 and d2p2 k4 rest on a whitepaper dated April 17, 2024, not on a user guide. The PrivateLink sentence there also says "within an AWS Region", which the user guide has since widened (cross-Region endpoint services); the entry does not repeat that part.

### Not reached, not done

- Nothing in the file was skipped.
- No real AWS account was used, so console labels and the wizard's actual output are unverified.
- `tools/links.mjs` was not run (it checks every day's links). Each of the 32 links in d02.js was fetched with pg.mjs and answered a plain 200.
- Coverage gaps I left alone because the entries are at the five-point limit: q02-004 (a subnet lives in one AZ; refs d2w1, d2b1, d1c6) and q02-050 (Flow Logs to S3, queried with Athena; refs only d2w1, the fact sits in d2b4 k4).

### Link titles that are not the page's own heading (left as they are)

All are short forms or section names; each URL is the right page.

- d2p1 "Internet gateways" → page heading "Enable internet access for a VPC using an internet gateway".
- d2b1 "Regional NAT gateways" → "Regional NAT gateways for automatic multi-AZ expansion".
- d2b2 "AMIs with SSM Agent preinstalled" → "Find AMIs with the SSM Agent preinstalled".
- d2b3 "VPC endpoints for Systems Manager" → "Improve the security of EC2 instances by using VPC endpoints for Systems Manager".
- d2b4 "Network ACLs" → "Control subnet traffic with network access control lists"; "Custom network ACLs and ephemeral ports" → "Custom network ACLs for your VPC" (it has an "Ephemeral ports" section); "VPC Flow Logs" → "Logging IP traffic using VPC Flow Logs".
- d2c1 "Compare security groups and network ACLs" → this is a section of the page "Infrastructure security in Amazon VPC".
- d2c2 "What is AWS Transit Gateway?" → "What is AWS Transit Gateway for Amazon VPC?".
- d2w1 "Direct Connect resiliency recommendations" → "AWS Direct Connect Resiliency Recommendations".

### Found in plan.js or CARDS (not edited)

- plan.js d2b1, "NAT gateway In 1 AZ". The Create a VPC page does not print that label; it says "for NAT gateways, choose the number of AZs in which to create NAT gateways", and it does not mention the regional mode in the wizard at all. Not shown wrong, only unconfirmable from the docs. https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html
- plan.js d2b3. The Session Manager page now carries a notice: "The Session Manager legacy page will be deprecated on December 31, 2026. Session Manager capabilities are now part of the Systems Manager unified console experience." The step connects from the EC2 console, which the same page still lists, so it is not affected. https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html
- CARDS d2c1, d2c2, d2c3: nothing found wrong. d2c2's "cheapest for a few VPCs" has the same whitepaper source as d2p2 k4. d2c3's limits of the gateway endpoint match the page ("do not allow access from on-premises networks, from peered VPCs in other AWS Regions, or through a transit gateway").

### Tests

- `node --check site/keys/d02.js`: passes.
- `node --test`: 33 tests, 32 pass, 1 fail. The failure is `d06.js d6w1: k[4] length 264`, in another agent's file; it was still there on a second run a few minutes later. Nothing names a Day 2 id.
- Lengths in d02.js after the edits: every `k` string is between 131 and 246 characters, every `trap` between 214 and 275.

## Day 3 (`d03.js`)

Read by a reader agent; its log follows. Audit by the session: re-read on the pages were the blue/green route to encryption, the Aurora serverless wording (the exam guide's in-scope list prints "Amazon Aurora Serverless"), the cross-Region read replica, the ElastiCache engine table and the lifecycle waterfall. No further change.

### Counts

- Entries checked: 12 of 12 (d3w1, d3w2, d3p1, d3p2, d3p3, d3b1, d3b2, d3b3, d3c1, d3c2, d3c3, d3c4).
- Entries with a change to `k` or `trap`: 6 (d3w2, d3p1, d3b2, d3b3, d3c1, d3c4).
- Entries with only a `docs` change (title aligned to the page, or one link added): 4 (d3p2, d3p3, d3b1, d3c2).
- Entries unchanged: 2 (d3w1, d3c3).
- Claims checked: 136 lines in `evidence-d03.md` (114 confirmed, 16 reworded of which 8 are `docs` lines, 4 added, 2 advice, 0 removed). Every factual claim was read on a page fetched with the tool in this session, except the items under "Still uncertain".
- Checks: `node --check site/keys/d03.js` passes; `node --test` 33 of 33 pass; all 35 `docs` URLs are a plain 200 and each title matches the page; CRLF line endings kept.

### Changed sentences

- d3w2 k3: "Encryption at rest is chosen at creation; later you restore an encrypted snapshot copy" named one way as the way. The RDS page gives two: an encrypted snapshot copy, or a blue/green deployment. Now: "Encryption is set at creation; later, restore an encrypted snapshot copy or use a blue/green deployment." To stay within 260 characters, "kept for up to" became "kept up to" and "Manual snapshots stay until you delete them" became "Manual snapshots don't expire" (the page's own words). https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html , https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateSnapshot.html
- d3w2 k4: added "Unpredictable relational load fits Aurora serverless." q03-036 has d3w2 as its only ref and tests exactly this; no Day 3 entry or card named Aurora serverless. The entry was at the 5-point cap, so the sentence went into k4 and "you can forecast" was cut there (the full provisioned-mode rule is still in d3b3 k1). https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html
- d3p1 trap: "An accidental DELETE is replicated to the Multi-AZ standby and to every read replica, so failing over or promoting a replica brings nothing back" was an inference with an absolute ("every"). Now: "RDS copies every change on the primary to the Multi-AZ standby and to the read replicas, an accidental DELETE included, so failing over or promoting a replica does not bring the rows back." https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html , https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html , https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_MySQL.Replication.ReadReplicas.DelayReplication.html
- d3p1 k4 (new): cross-Region read replica (reads closer to users, promote for disaster recovery). q03-034 refs d3p1 and d3w2 and tests it; neither entry named it. https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.XRgn.html
- d3b2 k1: "Transitions only move down the waterfall ..., never back up" was an inference. Now: "Transitions follow a waterfall (...); no supported transition goes back to an earlier class." https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html
- d3b2 k3, first sentence: "replaces it with a delete marker" was wrong in detail; the current version is kept and becomes noncurrent. Now: "it adds a delete marker and the object becomes noncurrent." https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html
- d3b2 k3, second sentence: "until a noncurrent version action transitions or permanently deletes them" was wrong: a transitioned version still exists and is still billed. Now: "until a noncurrent version expiration action permanently deletes them." Same URL.
- d3b3 k1: "suits new, spiky or unpredictable traffic": no page says "spiky", and the on-demand page says throttling can occur above double the previous peak within 30 minutes. Now: "suits new or unpredictable workloads and traffic that ramps up and down." https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/on-demand-capacity-mode.html , https://aws.amazon.com/dynamodb/pricing/ , https://aws.amazon.com/dynamodb/faqs/
- d3c1 trap: "cluster-aware file system" became "clustered file system", the page's term. https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes-multi.html
- d3c4 k1 (new): Valkey or Redis OSS versus Memcached (sorted sets, pub/sub, replication with automatic failover; Memcached simple and multi-threaded). q03-045, q03-046 and q10-029 test the engine choice; the CARD names the engines but not the difference. https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/SelectEngine.html

### Changed docs

- d3p1: title "Restoring a DB instance to a specified time for Amazon RDS" (was without "for Amazon RDS").
- d3p2: title "Improving data access with secondary indexes in DynamoDB" (was without "in DynamoDB").
- d3p3: title "Using VPC security groups (Amazon EFS)" (was "Using VPC security groups with Amazon EFS"; the page title is "Using VPC security groups").
- d3b1: added "Requirements and considerations for replication" (https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-requirements.html); the versioning prerequisite in k3 rests on it and was on no linked page.
- d3b3: title "Best practices for querying and scanning data in DynamoDB" (was without "in DynamoDB").
- d3c1: title "Help me choose an Amazon FSx file system" (was "Choosing an Amazon FSx file system").
- d3c2: title "Failing over a Multi-AZ DB instance for Amazon RDS" (was without "for Amazon RDS").
- d3c4: titles "Caching strategies for Memcached (Amazon ElastiCache)" and "Comparing node-based Valkey, Memcached, and Redis OSS clusters". The first page is now titled for Memcached only; its lazy-loading and write-through text is what supports "needs caching code in the application".

### Inferred sentences listed in docs/keypoints.md for Day 3

- d3p1 "a DELETE replicates to the standby and every replica": reworded. The replica half now has a near-direct source (delayed replication page: "a table deleted unintentionally ... before the change that caused the disaster is sent to it"; read replica page: "copies them asynchronously"). The standby half rests on "synchronously replicated". The conclusion that failover or promotion does not undo it is still a consequence, see below. "every read replica" was dropped.
- d3b2 "lifecycle transitions only move down the waterfall": reworded to what the page's list of supported transitions shows, plus the two explicit sentences for Flexible Retrieval and Deep Archive. No sentence on the page says "never back up" for all classes.

### Answers to the doubts raised in the task

- S3 class read frequency and retrieval times (d3w1, d3c3): confirmed as written.
- "Replication needs versioning on both buckets and copies new objects asynchronously": confirmed.
- "A single PUT stops at 5 GB": confirmed; the same page gives 50 TB for multipart. The entry states no maximum object size.
- Instance store "lost on stop, hibernate or terminate": confirmed.
- Storage Gateway: S3 File Gateway, Volume Gateway and Tape Gateway pages carry no closure notice; only FSx File Gateway does, and the entry does not name it.
- RDS engine list, "copies of the data across three AZs", "up to 15 Aurora Replicas", "up to 35 days", 400 KB, purpose-built list: confirmed. Aurora Serverless was not named in the file; the sentence added uses the current "Aurora serverless".
- "typically within one to two minutes" (page: 60–120 seconds), "source must have automated backups turned on", point-in-time restore creating a new instance: confirmed.
- LSI and GSI rules, TTL "typically within a few days and without consuming write throughput": confirmed.
- EFS "not supported on Windows instances", "30 days by default", Archive class, Regional and One Zone file system types, Standard / Infrequent Access / Archive storage classes: confirmed.
- "can later be suspended but never returned to the unversioned state", Block Public Access levels, "SSE-S3 by default": confirmed. The page also lists access points as a level.
- Minimum storage durations (30 / 90 / 180 days) and the 128 KB default: confirmed. The transition page has no 30-day minimum age; the entry states none.
- Query, Scan and filter expression capacity statements: confirmed.
- Multi-Attach "io1 or io2": confirmed. DAX "serves eventually consistent reads and is not meant for write-heavy workloads": confirmed ("not ideal for ... write-intensive"). "about monthly" and "about quarterly": confirmed.

### Still uncertain

Kept, but not found stated in these words on a page:

- d3p1 trap: "so failing over or promoting a replica does not bring the rows back." A consequence of "copies updates" and "synchronously replicated"; no RDS page says that failover or promotion cannot recover a deleted row. Also, for the standby no page names deletes specifically. Exception not in the sentence: with RDS for MySQL delayed replication a replica can be stopped before the bad change arrives. Kept because the general rule is what q03-030 tests.
- d3w1 trap: "An option where a lifecycle rule copies data to another Region or account is wrong." Rests on the page listing exactly two types of lifecycle action; no sentence says a lifecycle rule cannot copy.
- d3w2 trap and d3c4 trap: "DAX ... does nothing for an RDS database" and "DAX works only in front of DynamoDB." Rest on "DAX is a DynamoDB-compatible caching service"; no page lists what DAX cannot front.
- d3w2 k1: "a SQL Server or Oracle database that must keep its engine goes to RDS." Decision rule from the two engine lists; not a quoted sentence.
- d3c2 trap: "Multi-AZ also stays inside one Region." The page says the standby is "in a different Availability Zone"; the word Region is not used for it.
- d3c1 trap: "it needs ... a clustered file system." The page says "You should use a clustered file system", not "must".
- d3b2 k1: "(Standard, then the IA classes, then the Glacier classes)." A simplification: in the page's list Intelligent-Tiering sits between Standard-IA and One Zone-IA, and One Zone-IA cannot transition to Glacier Instant Retrieval.
- d3p3 k3: "applications keep using the same paths." The pages say metadata (file names, directory structure) always stays in Standard and that the movement is "completely transparent to your end users and applications"; "same paths" is my reading of that.
- d3p3 trap: "Moving them to S3 Glacier or to an EBS volume takes them out of the shared file system." Distractor framing, no page sentence.
- d3b3 k2: "reads only the matching items." The page says "Query returns all items with that partition key value"; a Query reads the items that match the key condition, before any filter expression.
- d3w2 k5 and trap: "SQL analytics over large history" and "years of data from several systems" for Redshift. Cue wording; the page says "petabyte-scale data warehouse".
- d3p2 k4: "That replaces any scheduled cleanup job." Advice drawn from the TTL sentence.

### Left alone (owner's decision)

- The only price comparison in the file is d3p3 k3 "the cheaper Infrequent Access class". Confirmed in words on https://aws.amazon.com/efs/faq/ ("EFS IA offers an up to 95% lower cost than EFS Standard"). Not changed.
- Nothing in the file speaks about Skill Builder lesson content, provisioning lead times, AWS Organizations or Identity Center.

### Not reached

- Nothing in the 12 entries was skipped.
- Not done, by scope: quiz explanations and CARDS were read for fit only, not verified sentence by sentence. CARD spot checks made: gp3 baseline 3,000 IOPS and 125 MiB/s, HDD volumes not bootable, Glacier retrieval times, Intelligent-Tiering "No retrieval fees", read replica count, Multi-AZ DB cluster with two readable instances.
- "35 days", "15 Aurora Replicas" and "400 KB" in d3w2 are confirmed but sit on sub-pages outside the entry's three links (limit of 3). The backups link was left as it is.
- `tools/links.mjs` was not run; the same check (plain 200, no redirect) was made per URL with the tool.

### Found in plan.js, CARDS or other files (not edited)

- plan.js d3b1 note "Bucket names are globally unique": still true for the shared global namespace, but S3 now also has an account regional namespace (bucket names ending in `-an`) and the docs say "We recommend creating buckets in your account regional namespace". The console may offer that choice when the owner creates the bucket. https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
- CARD d3c4 names Valkey, Redis OSS and Memcached but not what separates them; q03-045 tests that. Covered now by d3c4 k1.
- CARDS d3c1, d3c2, d3c3: nothing wrong found in the spot checks above.
- Lead for the mock1 owner, not checked further: the ElastiCache engine page now lists for Valkey 9.0 "durability via a Multi-AZ transactional log for zero data loss during failures" (table row "Durability | No | No | Valkey 9.0 and later (sync/async)"). m1-048 keys Amazon MemoryDB as the Valkey-compatible store that cannot lose an acknowledged write. https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/SelectEngine.html
- Lead for the Day 10 and Day 11 key files: `site/keys/d10.js` (line 48) and `site/keys/d11.js` (line 47) say "Aurora Serverless v2"; the docs page is now "Using Aurora serverless". https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html
- Page drift seen while checking, no action needed here: DynamoDB `Query.html` is now a short hub page; the DynamoDB docs call on-demand "the default and recommended throughput option"; the ElastiCache "Caching strategies" page is titled "Caching strategies for Memcached".

## Day 4 (`d04.js`)

Read by a reader agent; its log follows. Audit by the session: re-read on the pages were the `aws login` claims ("refresh the cached credentials every 15 minutes", valid for up to 12 hours, `aws logout` deletes the cached credentials), the Parameter Store page's recommendation of Secrets Manager, the Security Hub CSPM sentence and the role chaining definition. No further change. The question the session had raised (does `assume-role` from an `aws login` profile count as role chaining?) is not answered by any page; the sentence no longer depends on it.

### Counts

- Entries checked: 13 (d4w1, d4p1, d4s2, d4s3, d4b1, d4b2, d4b3, d4b4, d4b5, d4b6, d4c1, d4c2, d4c3).
- Entries changed: 9. Text changed in 8 (d4w1, d4s2, d4b1, d4b3, d4b4, d4b5, d4c1, d4c3); d4b2 only had a doc title corrected.
- Entries unchanged: 4 (d4p1, d4s3, d4b6, d4c2).
- Sentences or claims checked: see evidence-d04.md (one line each). No sentence was removed.
- Doc links: 34, all plain 200 with the tool; 4 titles corrected, no URL changed.
- `node --check site/keys/d04.js`: ok. `node --test`: 33 of 33 pass.

### Changed sentences

- d4w1 k1: added "Your code and its libraries" to what stays with the customer, because q04-002 (Lambda) tests it and the entry did not say it; "configure the security groups" and "managed services such as" shortened to fit 260 characters. https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
- d4w1 k5: the SSE-C clause now says it is blocked on new buckets until enabled (April 2026 default); "the plaintext" became "plaintext" to fit 260 characters. https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html
- d4s2 k1: was a near-copy of the step's note in plan.js (temporary credentials, 12 hours, no long-term key). Now: AWS recommends `aws login` for root, IAM users and federation with IAM; the CLI caches the credentials, renews them every 15 minutes, `aws logout` deletes them. https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html and https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sign-in.html
- d4s2 k2: first sentence was word for word the plan.js note; "portal URL" is "start URL" on the page; "holds no secret, only ..." became "holds no access key, just ...". https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html
- d4s2 k3: added "Retire one by deactivating it, then deleting it once nothing breaks" because q04-026 keys exactly that step and the entry did not cover it; "which is why" became "so" and "has expired" became "expires" for length. https://docs.aws.amazon.com/IAM/latest/UserGuide/id-credentials-access-keys-update.html
- d4b1 k1: first sentence repeated the plan.js note ("Read the JSON line by line: Effect, Action, Resource"). Now states what a Condition does. https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html
- d4b1 docs: two titles set to the pages' own titles ("Grant read and write access to Amazon S3 bucket objects", "Using AWS Identity and Access Management Access Analyzer").
- d4b2 docs: title completed ("... running on Amazon EC2 instances").
- d4b3 k2: "role chaining, assuming a role from a role session such as your Identity Center profile" was wrong for this learner (no Identity Center profile; `lab` comes from `aws login` as an IAM user). Now the page's definition, "using one role to assume a second role", with no claim about the learner's profile. Added the one-hour default. https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html and https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html
- d4b3 k3: the same-account sentence covered only the trust policy that trusts the account. Added the other form the page gives: a trust policy that names the user directly needs no identity policy. Second sentence shortened for length, same meaning. https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html
- d4b4 k4: "yearly by default and only for symmetric keys" became "yearly by default (or every 90 to 2,560 days) and only for symmetric encryption keys" (custom rotation period; HMAC keys are symmetric and not eligible). Rest shortened for length. https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html and https://docs.aws.amazon.com/kms/latest/APIReference/API_EnableKeyRotation.html
- d4b5 k3: "configuration values and rarely changing keys that only need encryption go to Parameter Store at the lowest cost" contradicted the current Parameter Store page, which recommends Secrets Manager for "secrets such as database credentials, API keys, or tokens" and for "any other secrets". Now: Secrets Manager is what AWS recommends for every secret; Parameter Store is for configuration values; its free standard tier is the answer only when cost decides and nothing must rotate. The price comparison "at the lowest cost" is replaced by the page's words "Standard tier free". https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
- d4c1 trap: "Options that say one policy type is evaluated first ... are wrong" was too absolute (the IAM pages describe an evaluation sequence and say the order affects evaluation). Now: an option where the identity policy outranks the bucket policy is wrong, because AWS checks all policies for a Deny first. "Also," and "access" dropped for length. https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html
- d4c1 docs: the first link's title named a different page. Now "Policy evaluation for requests within a single account", which is the title of the linked URL.
- d4c3 k (new, one point): AWS Security Hub CSPM (formerly Security Hub) collects GuardDuty, Inspector and Macie findings across accounts and runs checks against standards. q04-049 (ref d4c3) keys it and neither the CARD nor the entry named it. https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html and https://aws.amazon.com/security-hub/faqs/

### Sentences listed as inferred for Day 4 in docs/keypoints.md

- "an Identity Center profile shows an assumed-role ARN" (d4s3): no longer in the file (it went with the Free-plan rewrite). Nothing to source. No AWS page I fetched shows the ARN that `get-caller-identity` returns for an `aws login` profile, and the entry claims none.
- "`assume-role` is denied until the trust policy allows it" (d4b2 k4): sourced, sentence unchanged. https://docs.aws.amazon.com/IAM/latest/UserGuide/troubleshoot_roles.html : "If your account number is not listed in the Principal element of the role's trust policy, then you cannot assume the role. It does not matter what permissions are granted to you in access policies."
- "AWS patches the OS on RDS and Lambda, simplified" (d4w1 k1): sourced, wording kept apart from the shortening. RDS: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html table row "Operating system (OS) patching | Customer | Customer | AWS". Lambda: https://docs.aws.amazon.com/lambda/latest/dg/welcome.html "Lambda automatically manages the underlying infrastructure – including server maintenance, capacity provisioning, scaling, and patching". Still a simplification: for a Lambda function deployed as a container image the customer rebuilds from the updated base image (lambda-runtimes.html).

### Still uncertain (kept or left without a sentence on a page)

1. d4b3 k2, role chaining and the `lab` profile. No page says whether `aws sts assume-role` called with `aws login` credentials of an IAM user counts as role chaining (one-hour cap, failure above 3600 seconds). Pages read: CLI sign-in page, CLI `login` reference, Sign-In user guide (command-line and OAuth pages), SDK reference, id_roles.html, troubleshoot_roles.html, id_roles_use_switch-role-cli.html, the aws login security blog. The entry now gives only the page's definition of role chaining and the one-hour default, both true either way. Unverified in practice: that `aws sts assume-role --profile lab` works at all with these credentials (CLAUDE.md backlog item 5 already says it was never tried).
2. d4s3: the ARN shown for an `aws login` IAM user profile is on no page. The entry makes no claim. The config file line is `login_session = arn:aws:iam::<account>:user/<name>`.
3. d4b1 k2, "Mixing the two up causes AccessDenied": derived from two page rules (bucket operations need the bucket ARN, object operations the object ARN) plus implicit deny. No page states it in one sentence. Kept because q04-007 tests it.
4. d4c3 trap, "none of them filters or blocks traffic": a negative no page states. The GuardDuty, Inspector and Macie overview pages describe detection, scanning and findings only. Kept as the contrast the trap needs.
5. d4s2 k2, "holds no access key, just the start URL, account ID, role name and Region": read off the config listing on the page, which also contains the output format, the session name and the registration scopes. No sentence on the page says "no secret".
6. d4b2 k2, "SDKs and the CLI do this by themselves": the IAM page says "With some AWS SDKs, the developer can use a provider that manages the temporary security credentials transparently"; the CLI page lists instance profile credentials in its credential chain. "SDKs" without "some" is a slight generalisation. Kept.
7. d4w1 k2, "Requiring one on new roles lets teams create roles safely": the boundaries page works the example with users. For roles I found the CreateRole `PermissionsBoundary` parameter and the `iam:PermissionsBoundary` condition key description, not a worked role example. Kept.
8. d4w1 k2, "sets the most an IAM user or role can do": the boundaries page's own wording, kept. API_CreateRole.html adds that a boundary does not cap what a resource-based policy can grant.
9. Exam-framing clauses with no AWS source by nature: "is the answer only when cost decides and nothing must rotate" (d4b5 k3), "the most secure answer with the least overhead" (d4b2 trap), "lose to an IAM role or IAM Identity Center" (d4w1 trap).

### Not reached

- `node tools/links.mjs` (whole-site link check) was not run; only the 34 links of d04.js were checked with pg.mjs.
- The card was not looked at in a browser.
- Quiz explanations in site/quiz/d04.js were read only to see what each step's questions test, not re-verified.
- Skill Builder content (Module 9, the Cloud Quest assignment "Core Security Concepts"): behind a login, not opened.
- Not tried against a real account: `aws login`, `get-caller-identity`, `assume-role`.

### Found in plan.js, CARDS, the quiz or the docs (not edited)

- CARD d4c3 (extras.js): the WAF resource list gives "CloudFront, ALB, API Gateway REST APIs, AppSync, Cognito user pools and a few others (App Runner, Verified Access, Amplify)". The page also lists Amazon Bedrock AgentCore Gateway. Incomplete, not wrong. https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html
- CARD d4c3 does not name Security Hub CSPM although q04-049 refs d4c3. Covered now by the new key point.
- CARD d4c1 and CARD d4c2: consistent with the pages read (single-account and cross-account evaluation; SCP page, SCP syntax page with Condition allowed in Allow and Deny).
- q04-041 (site/quiz/d04.js) keys "standard-tier SecureString parameters" for values "including several API keys". Still right on cost ("Standard tier free" against "Billed per secret per month and per API call"), but the Parameter Store page now says: "For secrets such as database credentials, API keys, or tokens, we recommend AWS Secrets Manager". Worth a look by whoever owns the quiz. https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
- docs/keypoints.md says no AWS page confirmed "whether a KMS key is billed while pending deletion". The KMS pricing page does: "There is no charge for customer managed KMS keys that you manage and are scheduled for deletion. If you cancel the deletion during the waiting period, the customer managed KMS key will incur charges as though it was never scheduled for deletion." https://aws.amazon.com/kms/pricing/
- docs/keypoints.md still lists "an Identity Center profile shows an assumed-role ARN (d4s3)" as an inferred sentence; that sentence is no longer in d04.js.
- plan.js d4s2: the CLI page lists a prerequisite the step does not mention: "Attach the SignInLocalDevelopmentAccess managed policy to your IAM user, role, or group." The learner's user is in the Admins group with AdministratorAccess, whose policy document is "Effect": "Allow", "Action": "*", "Resource": "*", so the two signin actions are allowed. No change needed; recorded in case the admin policy is ever narrowed. https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sign-in.html and https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AdministratorAccess.html
- plan.js d4b3: works only from an IAM user or role session. "You cannot assume a role when you are signed in as the AWS account root user." Relevant if `aws login` were ever done as root. https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-cli.html
- plan.js d4s2 note "refreshes them for up to 12 hours": matches the page ("The CLI will automatically refresh these credentials for up to 12 hours"; the session lasts "up to the set session duration of the IAM principal (maximum of 12 hours)").

## Day 5 (`d05.js`)

Read by a reader agent; its log follows. Audit by the session: re-read on the pages were cross-zone load balancing on an ALB ("always enabled at the load balancer level", can be disabled per target group), the cooldown wording, the termination lifecycle hook sentence and scale-in protection. One further change by the session: `d5b1` k3 ended "or the web server never installs", which nobody checked (the Amazon Linux repositories might be reachable through an S3 gateway endpoint); the point now says only what the page says, that an instance needs a public IPv4 address to reach the internet through the internet gateway (https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html).

### Counts

- Entries checked: 11 of 11 (d5p1, d5p2, d5b1–d5b6, d5c1–d5c3).
- Entries changed: 8. Six had a sentence changed (d5p1, d5b2, d5b4, d5b5, d5c1, d5c3); two had only a doc link added (d5b1, d5b6). Unchanged: d5p2, d5b3, d5c2.
- Sentences changed: 10. Doc links: 1 replaced, 4 added.
- Checks: `node --check site/keys/d05.js` passes. `node --test`: 33 of 33 pass on the last run (two earlier runs failed on `d06.js d6w1: k[4] length 264`, another agent's file mid-edit). All 32 doc links in the file answer a plain 200 with the tool and the titles match (the features page: heading "Elastic Load Balancing features", HTML title "Network Traffic Distribution – Elastic Load Balancing – Amazon Web Services"). File still CRLF, ASCII, same layout.

### Changed sentences

- d5p1 k2: said a launch hook holds the instance "until your script calls complete-lifecycle-action, so it enters service only when ready". The wait also ends when the hook times out. Now "..., before it enters service, until complete-lifecycle-action is called or the hook times out." https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks-overview.html
- d5p1 k3: "the instance keeps taking traffic" is on no page (true by implication only). Dropped; now "the instance is still replaced if it fails health checks". https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-instance-protection.html
- d5b2 k1: "accounts opened since October 2024" → "accounts opened on or after October 1, 2024" (the page's date). https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-configurations.html
- d5b4 k5: "keeps an On-Demand base and fills the rest with Spot" read as fixed behaviour; the split above the base is a setting. Now "can keep ... and fill". https://docs.aws.amazon.com/autoscaling/ec2/userguide/mixed-instances-groups-set-up-overview.html
- d5b5 k1: "Clients always use the load balancer's DNS name" → "Clients use the ALB's DNS name" ("always" for every load balancer is wider than the page; NLB static addresses are used directly). https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html
- d5b5 k3: "uses EC2 status only ... the group replaces it only if Elastic Load Balancing health checks are turned on" was too absolute (custom health checks, VPC Lattice, EBS and the new EC2 application status checks also exist). Now "By default this self-healing relies on EC2 health checks only ... so to have it replaced, turn on Elastic Load Balancing health checks for the group." https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html and https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html
- d5c1 k1 (first sentence): "Cross-zone load balancing is always on for an ALB" → "is on for an ALB (a target group can turn it off)". https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html
- d5c1 k1 (second sentence): "a zone with fewer targets is overloaded" → "a target in a zone with fewer targets gets more" (the page shows a larger share per target, not overload). https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html
- d5c1 k3: "Only an NLB TCP listener on port 443 passes the encrypted stream through" → "An NLB TCP listener on port 443 instead passes ...". "Only" is no longer safe: the NLB listeners page now has QUIC listeners that also pass traffic through. https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html
- d5c1 k5: "Every load balancer is created as internet-facing or internal" → "An Application or Network Load Balancer is created as ...". A Gateway Load Balancer has no scheme. https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_CreateLoadBalancer.html
- d5c3 trap: "Cooldown only spaces out simple scaling activities" → "Cooldown is the pause after a scaling activity before simple scaling can act again." "only" was too absolute: the cooldown page says scale-in by other policies can also be delayed during a cooldown. https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scaling-cooldowns.html

(That is 11 lines for 10 changed strings: d5c1 k1 is one string with two changed sentences.)

Doc links:
- d5p1: "Use instance scale-in protection ..." replaced by "Design your applications to gracefully handle instance termination" (states the trap in words and also says unhealthy instances bypass scale-in protection).
- d5b1: added "How Elastic Load Balancing works" (two-zone requirement, public node addresses, private-IP routing).
- d5b5: added "How Elastic Load Balancing works" (k1).
- d5b6: added "Delete an Application Load Balancer" (billing wording, charge stops on delete) and "Delete an Application Load Balancer target group" (deletion condition).

### The two sentences listed as inferred for Day 5 in docs/keypoints.md

- d5p1 trap, "a termination lifecycle hook only delays the instance the group already picked": sourced, kept as written. https://docs.aws.amazon.com/autoscaling/ec2/userguide/gracefully-handle-instance-termination.html: "A termination lifecycle hook extends the life of your Amazon EC2 instance that's already selected for termination." The second sentence (each worker protects itself) is on the same page and in the pseudocode on https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html.
- d5b1 k3, "check auto-assign public IPv4 on the public subnets or enable a public IP in the launch template": sourced, kept as written. https://docs.aws.amazon.com/vpc/latest/userguide/subnet-public-ip.html ("By default, nondefault subnets have the IPv4 public addressing attribute set to false") and https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html (the launch template setting "overrides the auto-assign public IPv4 addresses setting on the subnet"). What the "VPC and more" wizard itself sets on its public subnets is not stated on https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html; the sentence only says "check", so it does not depend on that.

### Answers to the session's doubts (all read on fetched pages)

- Lifecycle state names `Pending:Wait`, `Terminating:Wait`: confirmed.
- Standby: deregistered from the load balancer, no health checks until returned to service: confirmed. Scale-in protection does not stop health check replacement: confirmed. "Keeps taking traffic": not on a page, dropped.
- AZ rebalancing launches before terminating: confirmed in words.
- Warm pool Stopped state cost: confirmed in words ("you pay only for the volumes that you use and the Elastic IP addresses attached").
- "unused" for a target in a zone that is not enabled: confirmed (target health status table).
- "Health checkers are outside the VPC": confirmed in those words.
- NAT sentence: says "zonal", so it is not too absolute; regional mode confirmed to exist. Left unchanged, and it does not mention regional NAT gateways.
- ALB needs two AZ subnets; targets reached on private IPs: both confirmed.
- Launch configurations and new accounts: reworded to the documented date.
- User data: root, first boot only by default: confirmed.
- Rule conditions and actions, SNI, weighted target groups, slow start linear, 503 with no registered targets, fail open: all confirmed. The action list on the page now also has `jwt-validation`, which the sentence does not name.
- "Attach the target group, not the load balancer"; 300 seconds default; mixed instances need a launch template: confirmed.
- Deleting the group sets capacity to 0; target group deletable only when no forward action references it; ALB "each hour or partial hour": confirmed in words.
- NLB client IP preservation, proxy protocol v2, TLS listener versus TCP 443, ALB as NLB target: confirmed.
- d5c1 trap "Path, host and header routing, redirects and Lambda targets are ALB-only": still true. NLB listener rules accept one condition type (`source-ip`, value `ipv4` or `ipv6`) and only a forward action; QUIC listeners do not add any of these. Left unchanged.
- SQS backlog per instance; simple scaling cooldown versus step and target tracking; predictive scaling history: confirmed.
- Instance not running is replaced at once even inside the grace period: confirmed in words.

### Still uncertain (kept without a page that states it)

- d5b3 k3, second sentence: "point it at a path that tests what the application depends on, such as its database connection". No AWS page I could fetch says this. The nearest is the Elastic Beanstalk page (a static page "will not reveal issues with the application server"). Kept because it is the rule q05-009 keys on. Two web searches restricted to AWS domains found nothing closer; the Builders' Library article has moved off aws.amazon.com (301 to builder.aws.com) and was not read.
- d5p2 k1: "with a minimum of two instances" is the pattern from q05-044; the pages describe two zones, not a minimum of two.
- d5p2 k3: "need no code change" and "the session dies with the instance" are consequences of the page text (load-balancer-generated cookie; a new target is selected when the old one is gone), not page sentences.
- d5p2 k5: `HealthyHostCount` as the alarm metric is this file's example. The Route 53 page's example is EC2 `StatusCheckFailed`; the ALB metrics page confirms only that the metric exists.
- d5b1 k3: "or the web server never installs". Confirmed only that an instance needs a public IPv4 address to reach the internet through an internet gateway. Not checked: whether the wizard's default S3 gateway endpoint is attached to the public route table, which could let Amazon Linux package repositories be reached without one.
- d5b2 k1: "so a bad change is a rollback to the previous version" (the page says only that templates have multiple versions). d5b2 trap: "Rebooting instances does not change their AMI" (implied by "does not update the instances that are currently in service").
- d5b4 k3: which metric fits CPU-bound versus I/O-bound work is the rule from q05-016; the page lists both predefined metrics without that guidance. The first sentence paraphrases two page sentences.
- d5b4 k4: "Set it above your longest request, or long downloads are cut off" follows from the mechanism (q05-012); the page gives no such recommendation.
- d5b4 trap: "in a loop" is the consequence shown in q05-036; the page says the grace period prevents instances being terminated "unnecessarily".
- d5c1 trap: "one requirement only an NLB meets: fixed IP addresses" is true among load balancer types (features table); Global Accelerator in front of an ALB also gives static addresses, as q05-039's explanation says.
- d5b3 k1: the action list omits `jwt-validation`. Not wrong, incomplete.

### Not reached

- Questions in other pools that reference Day 5 steps (q06-005, q09-005, q09-026, q10-037, q11-016, q11-021, m1-002, m1-017, m1-020, m1-032, m2-032) were listed and read by stem and key only. Three test things the entries do not cover (m1-017 TLS security policy, m1-020 mutual TLS, m1-032 KMS key policy for the Auto Scaling service-linked role); d5b3 and d5b4 already hold five points each, so nothing was added.
- Console labels were not checked in a console, only in the docs.

### Found in plan.js, CARDS or the quiz (not edited)

- CARDS d5c3: "it replaces an instance only when it stops running or fails system or instance status checks". The default health check type is "Amazon EC2 status checks and scheduled events": an instance affected by a scheduled event is also replaced, and EC2 application status checks now feed the same signal when configured. Incomplete rather than wrong. https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html
- CARDS d5c1: nothing wrong found. Note only: the features table lists PrivateLink support for Gateway Load Balancer too ("✔ (GWLBE)"), so "the load balancer behind a PrivateLink endpoint service" is not exclusive to NLB. https://aws.amazon.com/elasticloadbalancing/features/
- Quiz q05-037, explanation of the scale-in protection option: "it keeps receiving traffic". Same clause I removed from d5p1 k3: true by implication, stated on no page.
- plan.js Day 5 steps: nothing wrong found.

## Day 6 (`d06.js`)

Read by a reader agent; its log follows. Audit by the session: re-read on the pages were the EC2 monitoring periods, the Trusted Advisor categories, Data Transfer Terminal availability, the Pricing Calculator needing no account and the multi-Region trail. Three further changes by the session:

- `d6w2` trap: the reader had added "or an event data store". Removed again: event data stores are CloudTrail Lake, which is closed to new customers since 2026-03-31 (https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html).
- `d6b2` k3: "Recover works only with `StatusCheckFailed_System`" was too absolute; the page allows the recover action on any per-instance metric except `StatusCheckFailed_Instance`. Now "Recover is for a failed system status check" (https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/UsingAlarmActions.html). This settles the last item of the reader's "Still uncertain" list.
- `d6c3` trap: "deleted once one worker has processed it" → "the worker that processes a message deletes it"; the consumer deletes the message, SQS does not (reader's evidence, https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html).

With these, `d6b2` and `d6c3` are changed entries too (11 in all).

### Counts

- Entries checked: 13 of 13 (d6w1–d6w5, d6p1, d6b1–d6b4, d6c1–d6c3).
- Entries changed: 9 (d6w1, d6w2, d6w4, d6w5, d6p1, d6b1, d6b3, d6b4, d6c1). Unchanged: d6w3, d6b2, d6c2, d6c3.
- Sentences checked: 122 lines in evidence-d06.md (97 confirmed on a fetched page, 14 reworded, 11 advice or framing, 0 removed).
- Sentences changed: 15 (the 14 "reworded" lines plus d6b1 k2 s2, which became advice).
- Docs: 3 links added (d6w5, d6b3, d6b4), 1 title completed (d6b1). All 37 links answer a plain 200 with the tool and the titles match.
- Checks: `node --check site/keys/d06.js` passes; `node --test` 33 of 33 pass.

### Changed sentences

- d6w1 k5 s2: the Firehose destinations (S3, Redshift, OpenSearch, Splunk) read as the complete list. Now "for example to". https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html (also lists OpenSearch Serverless, Apache Iceberg Tables, HTTP endpoints).
- d6w2 k1 s1: status check metrics were listed among the 5-minute metrics; the EC2 page says they are available in 1-minute periods under basic monitoring. "and adds no new metrics" is stated on no page and was dropped. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/manage-detailed-monitoring.html
- d6w2 k5 s3: Trusted Advisor was given four check categories; the page lists six (cost optimization, performance, security, fault tolerance, service limits, operational excellence). The Control Tower half of the point was tightened to make room (same facts). https://docs.aws.amazon.com/awssupport/latest/user/get-started-with-aws-trusted-advisor.html
- d6w2 trap s1: "always covers the last 90 days" became "shows only the last 90 days", and "need a trail" became "need a trail or an event data store". https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html
- d6w4 k3 s1: "The same engine on both sides needs only DMS" was too absolute (DMS creates only tables and primary keys; the page says to migrate the rest of the schema with native tools). Now "no schema conversion is needed". https://docs.aws.amazon.com/dms/latest/userguide/CHAP_BestPractices.html
- d6w4 k4 s2: Data Transfer Terminal read as open to anyone. Now says it is for Enterprise Support customers only. s1 was shortened to make room (same facts). https://docs.aws.amazon.com/datatransferterminal/latest/userguide/what-is-dtt.html
- d6w5 k1: "its four domains ... mirror four of the six pillars" is a mapping no AWS page states. Now the domain names and "The framework has six pillars" stand side by side. https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html and https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html
- d6p1 k1 s2: "It creates no resources" is on no page. Replaced by "It needs no AWS account". https://docs.aws.amazon.com/pricing-calculator/latest/userguide/getting-started.html
- d6b1 k1 s3: "Subscribers can be" five types read as the whole list (SMS, Firehose and service providers are also endpoints). Now "Subscribers include". https://docs.aws.amazon.com/sns/latest/dg/welcome.html
- d6b1 k2 s2: "An alarm that seems silent is often a subscription still pending confirmation" is a frequency claim no page makes. Now a check to run ("If an alarm seems silent, check first whether ..."). https://docs.aws.amazon.com/sns/latest/dg/sns-email-notifications.html
- d6b3 k2: the point restated the step's own note (IAM is global, switch to us-east-1). Replaced by two sourced facts the note lacks: Event history lists each event in the Region where it happened, and a multi-Region trail delivers events from all enabled Regions, global services included, to one S3 bucket. https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html and https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html
- d6b3 k4 s2: "an alert within minutes of a specific API call" gives a delivery time no fetched page states. Now "an alert whenever a specific API call is made". https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-service-event-cloudtrail.html
- d6b4 k2 s3: "suits On-Demand or Spot" had no condition on Spot. Now "On-Demand, or Spot if the work can be interrupted". https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html
- d6c1 trap s5: "only an SCP or IAM policy prevents" was too absolute (Control Tower also prevents with RCPs and declarative policies). Now "Config detects and can remediate but does not prevent; blocking the call takes an SCP or IAM policy". https://aws.amazon.com/config/faqs/

Docs changes:

- d6w5: added the exam guide page, which k1 rests on.
- d6b3: added "CloudTrail record contents ...", which k3 (userIdentity, eventName, eventTime, sourceIPAddress) rests on.
- d6b4: added "Calculator Assumptions", which the 730-hour sentence rests on.
- d6b1: title of the fanout page completed to the page's own title.
- d6c2: the two design-principle pages are both titled "Design principles" by AWS. The file's titles ("Operational excellence design principles", "Reliability design principles") add the pillar name so the two can be told apart. Left as they are.

### Inferred sentences for Day 6 (docs/keypoints.md)

- Basic cost drivers (d6w3 k1 s2, repeated in d6p1 k2 s2): sourced, sentence unchanged. https://docs.aws.amazon.com/whitepapers/latest/how-aws-pricing-works/key-principles.html says "There are three fundamental drivers of cost with AWS: compute, storage, and outbound data transfer" and "In most cases, there is no charge for inbound data transfer". The page carries the banner "This whitepaper is for historical reference only." No current page that states it was found. See "Still uncertain".
- Task nodes as the place for Spot (d6w1 k3 s3): sourced, sentence unchanged. https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-instances-guidelines.html: "The task nodes process data but do not hold persistent data in HDFS. If they terminate ... no data is lost and the effect on your cluster is minimal", and "Spot Instances are often used to run task nodes".
- Exam domains mirror four of the six pillars (d6w5 k1): reworded. No page states the mapping; the sentence now gives the two page facts.
- 730 hours per month (d6b4 k2 s1): sourced, sentence unchanged, page linked. https://aws.amazon.com/calculator/calculator-assumptions/: "The Calculator assumes 730 hours in a month, (365 days in a year x 24 hours in a day / 12 months in year)."

### Still uncertain (kept without the sentence being stated on a page)

- d6w3 k1 s2 and d6p1 k2 s2 (three basic cost drivers; inbound transfer free "in most cases"): the only page that states this is the whitepaper AWS marks historical. Kept because the wording is AWS's own and nothing newer contradicts the three drivers. On inbound transfer AWS pages differ: https://aws.amazon.com/pricing/ says "data transfer IN is always free of charge", the whitepaper says "In most cases". The file keeps the more careful version.
- d6w1 k3 s2 ("Choose EMR when existing jobs or custom framework settings must be kept"): a decision rule. The page says EMR runs Hadoop and Spark and "offers a variety of ways to configure software on your cluster"; it does not say "choose it when".
- d6w1 trap s1 ("Athena, not a warehouse or cluster you must size and run"): a decision rule built on "serverless ... no infrastructure to set up or manage" and "ad-hoc queries".
- d6w2 k4 s2 and d6c1 trap s5 ("blocking the call takes an SCP or IAM policy"): the Config FAQ names IAM policies (and Service Catalog) as the way to control what can be provisioned; the SCP half comes from the Organizations SCP page. It is not the whole set of preventive tools (the Control Tower page also names RCPs and declarative policies), so read it as "a deny policy", not as an exhaustive list.
- d6w3 trap s1, second half ("it does not find resources that lack the tag"): a negative that no page states. Kept as the decision rule against the required-tags rule, which is sourced.
- d6w4 k5 ("when the data is too large to send over the available link before the deadline, it travels offline on a physical device"): built on the availability-change page ("network bandwidth throughput and reliability, and size of data to be imported, should guide you on which service to use") and the Snowball Edge guide ("physically transport the data ... without using the internet"). Not a literal page sentence.
- d6w5 trap s1 (idle servers: cost optimization if the goal is the bill, sustainability if the goal is emissions): a decision rule built on the two pillar definitions.
- d6p1 k3 s2 ("Budgets warns you when it drifts from the plan"): paraphrase of budget alerts on actual and forecasted spend against a threshold.
- d6b1 k4 s1 ("they cannot poll it for a backlog"): the pages say SNS uses a push mechanism that "removes the need to check or poll" and that SQS persists messages for later. No page says "cannot poll" in those words. Note that SNS FIFO topics can archive messages for up to 365 days and replay them to subscribers (https://docs.aws.amazon.com/sns/latest/dg/fifo-message-archiving-replay.html); that replay is still pushed, so the sentence stands, but "SNS keeps nothing" would be wrong.
- d6b3 k2 s2 ("saves the switching"): my wording for the page's "You receive CloudTrail events from all enabled AWS Regions in a single Amazon S3 bucket". The trail delivers to S3; Event history itself stays per Region.
- d6b4 k1 s2 ("An idle load balancer still costs the hourly part"): follows from "charged for each hour or partial hour that an Application Load Balancer is running"; the page does not use the word idle.
- d6b4 k2 s3, first half ("Capacity that comes and goes with scaling suits On-Demand"): a decision rule; the page says On-Demand is paid by the second with no commitment.
- d6c3 trap s2 ("In SQS it is deleted once one worker has processed it"): the page says the consumer deletes the message after processing. With a standard queue (at-least-once delivery) a second worker can still receive a copy.
- d6b2 k3 s2 ("Recover works only with StatusCheckFailed_System"): this is a literal sentence on the CloudWatch page, but the same page also says "You can also add the recover action to alarms that is set on any Amazon EC2 per-instance metric except for StatusCheckFailed_Instance". The file follows the sentence the exam answer rests on.

### Not reached

- Nothing in the file was skipped. Not checked, by the brief: prices, and what the Skill Builder modules and the Cloud Economics lab contain.
- Period of the EBS volume metrics of Nitro instances (the "disk I/O" in d6w2 k1 was checked only against the AWS/EC2 instance metrics page).

### Found in plan.js, CARDS or the quiz (not edited)

- plan.js d6b3 note and step text: correct (https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html, "Global service events"). The same section adds that some global service events are logged in other Regions such as US East (Ohio) or US West (Oregon), and that STS calls to a Regional endpoint are recorded in that Region. So an `aws sts assume-role` from Day 4 may show up in eu-west-1 rather than us-east-1.
- plan.js d6w4 text names "Snow Family": no Snow device can be ordered by new customers and Snowball support ends in commercial Regions on 2026-12-31 (https://aws.amazon.com/snowball/). The exam guide still lists "AWS Snow Family", and the key points carry the status.
- CARDS d6c3: "Provisioned or on-demand capacity". The modes are now named On-demand Standard, On-demand Advantage and Provisioned (https://docs.aws.amazon.com/streams/latest/dev/how-do-i-size-a-stream.html). Not wrong, only less precise.
- CARDS d6c1 and d6c2: no conflict with the pages read.
- q06-001, explanation of the detailed-monitoring option ("only raises the frequency of the standard hypervisor-level metrics to 1 minute"): status check metrics are already 1-minute under basic monitoring, and the page gives one more effect of detailed monitoring (aggregating across groups of similar instances). The keyed answer is unaffected. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/manage-detailed-monitoring.html
- q06-031, explanation ("without creating any resources"): true, but the page's own wording is that no AWS account is needed.
- AWS pages that disagree with each other, for whoever checks next: CloudTrail concepts says Insights analyses "management activity", the Insights page says "management and data events"; the pricing page says inbound transfer is "always" free, the whitepaper "in most cases"; the alarm-actions page gives two different rules for the recover action (see above).
- The Well-Architected user guide (last updated 2026-10-01) now describes two services: the Well-Architected Tool and a Well-Architected Agent in preview. The exam guide lists only the Tool, and the key points describe only the Tool.
- Trusted Advisor plans (asked in the task, not in the file): all checks need Business Support+, Enterprise Support or Unified Operations; Basic Support gets all Service Limits checks and selected Security and Fault tolerance checks. https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html

## Day 7 (`d07.js`)

Changed:

- `d7e3` trap: "a scaled 720 is not 72% of questions correct, because scaling evens out exam forms" was an inference. Now quotes the guide: a scale from 100 to 1,000, and scaled scoring equates forms of slightly different difficulty. https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html
- `d7h3` k2: "within 24 hours you can neither cancel nor reschedule" is not on the page. Now what it says: reschedule up to 24 hours before, twice per appointment, a third change means cancel and rebook; cancelling more than 24 hours ahead is refunded. https://aws.amazon.com/certification/policies/before-testing/
- `d7e5`, `d7e6`, `d7h2` docs: a link added for the one sourced fact in each (130 minutes and 65 questions; domain weights; a stopped instance is still charged for EBS volumes and Elastic IP addresses).

Confirmed without change: `d7e1`, `d7e2`, `d7e3` k1–k5, `d7e4`, `d7h2` k1–k3, `d7h3` k1. The out-of-scope list does say "Internet of Things: All services", and the short-name rule and the Help feature are on https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-service-mentions.html (not linked: the entry already has three links).

Inferred sentence for Day 7 (`d7e3`, `d7e4`): reworded in `d7e3` as above. `d7e4` says only that the exam reports a scaled score and not a percentage, which the guide states.

Study-technique sentences with no AWS fact in them (`d7e4` k1–k3, `d7e5` k2, `d7e6` k1) were read for sense only.

## Still uncertain

Each day's own list is in its section above (Days 2–6 under "Still uncertain"). Days 1 and 7, and the items that matter most across days:

- **Never tried in a real account.** The IAM admin user block (`d1u1`–`d1u4`), `aws login --profile lab` (`d4s2`), `aws sts assume-role` from that profile (`d4b3`) and what the "VPC and more" wizard builds (`d2b1`, `d5b1`) were checked against the docs only. No page says which ARN `get-caller-identity` shows for an `aws login` profile, or whether `assume-role` from it counts as role chaining; no sentence depends on either any more.
- **Credits after a Free plan upgrade** (`d1a2`, `d1c1`): the Identity Center page says credits "expire immediately", the Billing page says remaining credits "are automatically applied to future AWS bills". Neither entry states either.
- **`d1w3` k5**: "a kernel module or an OS-level agent points to EC2" is a conclusion from two documented facts (EKS on Fargate limits; the guest operating system is the customer's on EC2). Lambda MicroVMs ("use Linux OS capabilities") were not examined for kernel modules.
- **`d1d1` k2**: the pages say a budget action can "target" specific EC2 or RDS instances; none of them says what happens to the instance.
- **`d1w1` k3**: "the code and its permissions are yours" on Lambda is put together from the Lambda welcome page and the shared responsibility page.
- **`d1w4` k5**: the 6-versus-8 instance count is arithmetic, not a page statement.
- **Exam-framing sentences** (which option is the usual distractor, what a phrase in the stem "means"): `d1u1`, `d1c4`, `d1c5`, `d1c7` traps, `d2w1` trap ("low cost" means Site-to-Site VPN), `d4b2` and `d4w1` traps, `d5c1` trap, `d6w1` trap and the like. The facts inside them were checked; the framing has no AWS source by nature.
- **Design advice with no AWS page behind it**: `d5b3` k3 (point the health check at a path that tests what the application depends on), kept because q05-009 keys on it.
- **Historical source only**: the basic cost drivers in `d6w3` and `d6p1` are stated only in a whitepaper AWS marks "for historical reference only"; `d2c3` k2 and `d2p2` k4 rest on a whitepaper dated April 2024.
- **Study-technique sentences** in `d7e4`–`d7e6` carry no AWS fact and were read for sense only.

## Not reached

- All 91 entries in the seven files were read. Nothing was skipped.
- Not done, by the owner's decision: prices and price comparisons, provisioning lead times, figures on which AWS pages disagree, and anything about what a Skill Builder lesson or lab contains.
- Console labels were checked in the docs, not in a console.
- Coverage gaps left open because the entry already holds five points: q02-004 (a subnet lives in one AZ; `d1p2` covers it), q02-050 (Flow Logs to S3 with Athena references only `d2w1`, the fact is in `d2b4`), m1-017 (TLS security policy), m1-020 (mutual TLS), m1-032 (KMS key policy for the Auto Scaling service-linked role).
- Some link titles are short forms or section names rather than the page's own heading (listed in the Day 2 section). Where a title named a different page it was corrected.
- With the three-link limit, a few sentences rest on a page that is not linked: the Cognito definition (`d1c1`), the short-name rule (`d7e3`), ALB hourly billing (`d7h2`), "must stop the instance to change its type" (`d1p3`), and the scale-in protection page (`d5p1`). Each was read on the page named in the day's section.

## Found outside the key files (not edited)

plan.js:

- `d2b1`: the label "In 1 AZ" cannot be confirmed from the Create a VPC page, which says only "choose the number of AZs in which to create NAT gateways" and does not mention the regional mode in the wizard. https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html
- `d2b3`: the Session Manager page says its legacy console page "will be deprecated on December 31, 2026". The step goes through the EC2 console and is not affected. https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html
- `d3b1` note "Bucket names are globally unique": still true for the shared global namespace; S3 now also has an account regional namespace (names ending in `-an`) that the docs recommend. https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
- `d4s2`: the CLI page lists a prerequisite the step omits, the `SignInLocalDevelopmentAccess` managed policy. The learner's `AdministratorAccess` covers it. https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sign-in.html
- `d4b3`: "You cannot assume a role when you are signed in as the AWS account root user"; matters only if `aws login` were done as root.
- `d6b3`: correct. The same CloudTrail section adds that STS calls to a Regional endpoint are recorded in that Region, so a Day 4 `assume-role` may appear in eu-west-1.
- Days 1, 5 and 7: nothing wrong found. The d1a2, d1b1 and d1d1 notes match the pages (credits and six months; MFA required for root; budget data "updated up to three times a day").

CARDS (extras.js):

- `d5c3`: "replaces an instance only when it stops running or fails system or instance status checks" is incomplete; the default health check type also covers scheduled events, and EC2 application status checks when configured. https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html
- `d6c3`: "Provisioned or on-demand capacity"; the modes are now On-demand Standard, On-demand Advantage and Provisioned. Less precise, not wrong.
- `d4c3`: the AWS WAF list omits Amazon Bedrock AgentCore Gateway. Incomplete, not wrong.
- `d1c6`–`d1c8`, `d2c1`–`d2c3`, `d3c1`–`d3c4`, `d4c1`, `d4c2`, `d5c1`, `d5c2`, `d6c1`, `d6c2`: no contradiction with the key entries or the pages read.

Quiz pools and docs (leads for whoever owns those files):

- q05-037: the explanation says an instance under scale-in protection "keeps receiving traffic"; no page says so (removed from `d5p1`).
- q06-001: the explanation says detailed monitoring "only raises the frequency"; status check metrics are 1-minute under basic monitoring already. The key is unaffected. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/manage-detailed-monitoring.html
- q04-041 keys a Parameter Store SecureString for values "including several API keys"; the Parameter Store page now recommends Secrets Manager for "database credentials, API keys, or tokens". Still right on cost. https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
- m1-048 keys MemoryDB as the Valkey-compatible store that cannot lose an acknowledged write; the ElastiCache engine page now lists durability through a Multi-AZ transactional log for Valkey 9.0. Not checked further. https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/SelectEngine.html
- `site/keys/d10.js` and `d11.js` said "Aurora Serverless v2" when a reader looked; the docs now say "Aurora serverless".
- `docs/keypoints.md` says no page confirms whether a KMS key is billed while pending deletion. https://aws.amazon.com/kms/pricing/ does: "There is no charge for customer managed KMS keys that you manage and are scheduled for deletion." It also still lists a `d4s3` sentence (an Identity Center profile shows an assumed-role ARN) that is no longer in the file, and its list of inferred sentences for Days 1–7 is now out of date (see "Inferred sentences" under each day).
- CloudTrail Lake (event data stores) is closed to new customers since 2026-03-31; the CloudTrail pages still suggest "an event data store or a trail". https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html
- The Well-Architected user guide now also describes a Well-Architected Agent in preview; the exam guide and the key points cover only the Tool.

## Checks

- `node --test`: 33 of 33 pass.
- `node tools/links.mjs`: 357 links checked, 0 broken.
- Cards for `d1w3`, `d4c3` and `d6b3` opened in the static preview (port 8099): the new points render, no raw markup.
- The per-sentence evidence files of the five readers (one line per sentence: status, URL, the page's words) are outside the repo, in the shared notes folder of this group of sessions, as `pass2-keys-d01-d07-evidence.md`.
