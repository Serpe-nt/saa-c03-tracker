# Article rewrite, session B (2026-10-17)

Files: `site/keys/c1.js` … `c9.js`, `r1.js`. 69 entries: every step filed there except the pilot `c2a`, which is unchanged.

Every entry got a `head`, an `idea` and a `q`. The `why` became a short scene plus the need in one sentence; the sentence that named the answer moved to `idea`. Points were relabelled to say what they say, put in story order and cut to at most 5. Traps now use only what the points (or an earlier card) explained. No entry got `do` or `done`: all are lecture chunks, sandbox labs or reading steps, so the step text stays on screen as "In this lecture: …" / "In this lab: …".

This was a restructuring pass. Facts already in the entries were not looked up again. What is new is listed under "New facts". What was dropped to stay within 5 points, or because an earlier card already teaches it, is listed per card.

## New facts, each from a page fetched on 2026-10-17

Fetched with curl, plain 200, no redirect followed.

| Entry | Claim | Page | Sentence it rests on |
|---|---|---|---|
| `c1c` k "Closer than a Region" | A Wavelength Zone sits at the edge of a communications service provider's network (was "a carrier's 5G network") | https://docs.aws.amazon.com/wavelength/latest/developerguide/what-is-wavelength.html | "Wavelength deploys standard AWS compute and storage services to the edge of communications service providers' (CSP) networks." |
| `c4e` q, explanation 2 | After a failover an instance's own endpoint no longer leads to the writer; the cluster endpoint does | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.Endpoints.html | "The writer and reader endpoints manage DB instance failover better than instance endpoints do." / "If a failover occurs, you can use the cluster endpoint to reconnect to the newly promoted or created primary DB instance" |
| `c6c` q, explanation 4 | Peering gives no path from the data center through one VPC into its peer | https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html | "If VPC A has an Direct Connect connection to a corporate network, resources in VPC B can't use the Direct Connect connection to communicate with the corporate network." |
| `c7a` q, explanations 1–2 | An asynchronous event that still fails after the retries is not kept unless a destination or dead-letter queue catches it | https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-error-handling.html | "When an event expires or fails all processing attempts, Lambda discards it." / "To capture discarded events, configure a dead-letter queue for the function." |
| `c4d` q, explanation 3 | Global Accelerator proxies TCP or UDP traffic at the edge; it does not cache pages or route by URL path | https://aws.amazon.com/global-accelerator/faqs/ | "Global Accelerator improves performance for a wide range of applications over TCP or UDP by proxying packets at the edge to applications running in one or more AWS Regions." The "does not cache or route by path" half is my inference from the FAQ's contrast with CloudFront ("cacheable content"). |

Also fetched, not used in the end: https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html and https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html ("A transit gateway doesn't support routing between VPCs with identical CIDRs …"). The explanation that needed it went away when `c6b`'s question was rewritten.

## Facts carried from other checked entries (no fetch)

- `c2b` k1 "sign in as root only for the tasks that need it": `d1c5`.
- `c4c` k1 "one account needs one Allow, two accounts need both sides": the old `c4c` point and `c2b`.
- `c4b` q, explanation 4 (a role gives temporary credentials instead of a stored key): `d4b2`.
- `c1d` q, explanation 4 (security groups are stateful): `t1c`.
- `c7e` q, explanation 2 (gateway endpoints exist only for S3 and DynamoDB): `d2b3`.
- `c6d` k1 (DMS full load and CDC): `l1e`.
- `c3a` k3 "databases in subnets with only the local route" and `c3f`: the old `c3a` and `c3f`.
- `l8a` q (dynamic partitioning only when the stream is created): the old `l8a` point; also in questions.md, "AWS changes".

## Explanations that rest on reasoning, not on a page

The facts inside them are on the card; the conclusion is mine.

- `l1a` q, explanation 4: a bucket policy that denies requests without TLS would block every visitor, because the website endpoint is HTTP only (from `l1a` k3 and `d4b1`'s `aws:SecureTransport` point).
- `l1e` q, explanation 4: a reboot does not undo committed changes.
- `c1e` q, explanations 2 and 4: a bigger instance or another place for the script still installs everything at boot.
- `c4c` q, explanation 4: switching versioning off and on does not turn existing objects into new ones.
- `c5c` q, explanation 3: thousands of `Encrypt` calls per file, when one data key does it locally. Explanation 4: Parameter Store is not where 50 MB files go.
- `c6b` q, explanation 4: S3 is not a VPC you can peer with.
- `c6d` q, explanation 3: database files of one engine cannot simply be attached to another.
- `l7b` q, explanation 4: with no consumer, messages pile up in the queue rather than vanish.
- `l5a` q, explanation 4: SSE-S3 counts as server-side encryption, so the buckets stay compliant under `s3-bucket-server-side-encryption-enabled` (the stem says so too).
- `c4f` q, explanation 3: replicas copy the stale value too.

## Questions rewritten because `similar.mjs 0.30` paired them with a bank question

| Card | Bank question | First version | Now asks |
|---|---|---|---|
| `c2b` | q04-006 | explicit Deny in a group beats a bucket policy Allow | inside one account, a bucket policy Allow alone is enough |
| `c3c` | q03-020 | EFS for files shared across zones | S3 Lifecycle transition plus expiration for logs |
| `c5a` | q12-026 | an SCP Allow is needed at every level | SCPs never affect the management account |
| `c6b` | q02-032 | PrivateLink endpoint service for overlapping VPCs | S3 gateway endpoint instead of the NAT gateway |
| `c6c` | q02-042 | VPN over Direct Connect for encryption | one connection to two Regions through a Direct Connect gateway |
| `l7d` | q09-025 | `ReportBatchItemFailures` | the topic policy that lets S3 publish |
| `c8c` | q06-033 | Athena per-query data usage limit | SPICE with a daily refresh |

After that, `node tools/similar.mjs 0.30 2000` lists 60 pairs, none with a `card-` question (all 60 are bank pairs that were there before).

## Per card: what changed beyond the new fields

Points merged, moved or dropped. "Earlier card" means the fact is on a card the owner reads before this one, so it was not repeated.

**c1.js**
- `c1a`: points reordered (cloud changes, principles, trade-offs, managed services, exam scores). Nothing dropped.
- `c1b`: the four pillar points became three (security joined performance and cost). "The Well-Architected Tool asks, Trusted Advisor inspects" moved from the trap into the tool point. Nothing dropped.
- `c1c`: the shared responsibility point dropped (`t1a`, Day 1, and `c2a`, Day 5). Local Zone, Outposts and Wavelength moved from the trap into a point; the trap now uses them.
- `c1d`: the network ACL point and "stateful, allow rules only" dropped (both in `t1c`, Day 1, word for word).
- `c1e`: the Lambda and Fargate points dropped (`t1b`). "AMIs are Region-specific" dropped here (kept in `c1c`). Dedicated Hosts and Instances moved from the trap into a point.
- `c1f`: block/file/object, instance store, S3 Standard's three zones, what RDS manages and the relational-or-key rule dropped (`t1d`, `t1e`, Day 2). Four points remain.
- `l1a`, `l1c`, `l1d`, `l1e`: relabelled and split into shorter sentences. Nothing dropped.
- `l1b`: "a cluster placement group" dropped from the trap (not explained on the card; placement groups are on `d09` and `d10` cards).

**c2.js**
- `c2b`: "A role's two policies" and "Who uses roles" merged. "In an organization, SCPs restrict a member account's root user" dropped here (`c5a` k3). The trap keeps the permissions boundary example and now names the boundary as taught on Day 1 (`d1u2`).
- `l2a`, `l2b`: relabelled. Nothing dropped.

**c3.js**
- `c3a`: "Most specific route wins" dropped (`l1c`, Day 4).
- `c3b`: the instance family point dropped (`c1e`), "Per-socket or per-core licences need Dedicated Hosts" dropped from the trap (`c1e`). The two Savings Plan points merged. The Capacity Reservation moved from the trap into a point, and the trap was rewritten from the points.
- `c3c`: "EBS, EFS or S3" dropped (`t1d`). EFS lifecycle and S3 Lifecycle merged into one point.
- `c3d`: "health checks per target group" and "an ALB must be enabled in two zones" dropped (`t1f`). The two ALB points became "Listener rules" and "Servers stay private behind it".
- `c3e`: "What the group guarantees" dropped (`t1f`). Target tracking and scheduled actions merged.
- `c3f`: DB subnet group and DNS failover merged.
- `l3a`: the redeploy point merged with the invoke permission. The trap was the S3 website HTTPS rule (`l1a`); it is now about CORS and the redeploy, from the points.
- `l3b`, `l3c`: relabelled. `l3c` still has no trap.

**c4.js**
- `c4a`: ECR merged into "Image and registry" ("containers are created from it" and "that clean up images" shortened away). The trap's "privileged capabilities" now reads "privileged access to the host".
- `c4b`: "One ALB, many services" dropped (`c3d` listener rules) and "Fargate tasks require `awsvpc` mode; the target group type must be `ip`" dropped (no bank question uses it; `l4a` keeps "a Fargate task gets its own network interface"). The three roles moved from the trap into a point; the new trap says which role to fix when.
- `c4c`: versioning and Object Lock merged ("WORM (write once, read many)" now "write-once retention").
- `c4d`: "Custom domain: ACM certificate in us-east-1" dropped (`l1a`, `l4c`).
- `c4e`: Aurora Replicas and endpoints merged. "A custom endpoint groups instances you choose" dropped (on a `d10` card).
- `c4f`: "Only what can be rebuilt" and "Durable in-memory data" merged.
- `l4b`: A, CNAME and alias records merged. Still no trap.
- `l4a`, `l4d`, `l4c`: relabelled. Nothing dropped.

**c5.js**
- `c5a`: RCP moved from the trap into the SCP point. The trap explains service-linked roles in passing.
- `c5b`: "Where TLS ends" dropped (`d5c1`, Day 6). Shield Standard and Advanced merged. Firewall Manager moved from the trap into a point.
- `c5c`: customer managed and AWS managed key merged.
- `c5d`: GuardDuty and Inspector/Macie/Security Hub CSPM merged.
- `c5e`, `l5a`, `l5b`: relabelled. Nothing dropped.

**c6.js**
- `c6c`: virtual interfaces and the Direct Connect gateway merged.
- `c6d`: DMS and schema conversion merged. The "Snowball Edge today" point dropped: the step's note in plan.js already says it, except the date "since 7 November 2025". "The same engine on both sides needs no conversion" is now only in the question's explanation. The other Snowball point is labelled "Instead of Snowball" (the data test needs a status word next to the name).
- `c6a`, `c6b`, `c6e`, `l6a`, `l6b`: relabelled. Nothing dropped.

**c7.js**
- `c7a`: the two EventBridge points merged.
- `c7b`: reserved and provisioned concurrency merged. The trap's "edge-optimized and Regional REST endpoints" dropped (on a `d10` card) and "Lambda Managed Instances allow up to 90 minutes" dropped (questions.md, "AWS changes"; a `d02` card names Lambda Managed Instances). The new trap is built from the memory and 15-minute points.
- `c7c`: "Fan-out" and "Ordered fan-out" merged.
- `c7d`: user pools and identity pools merged.
- `c7e`: DynamoDB encryption and point-in-time recovery merged.
- `c7f`: the CloudWatch Logs point dropped (`c3d`, Day 6: retention and metric filters).
- `l7d`: the fan-out point dropped (`c7c`, Day 14; the idea refers to it).
- `l7a`, `l7b`, `l7c`, `l7e`: relabelled. Nothing dropped.

**c8.js, c9.js, r1.js**
- `c8a`: Flink and MSK merged.
- `l8a`: "Glue Data Catalog" merged into "Format conversion needs a catalog table".
- `c9a`: high availability and disaster recovery merged into one point; the strategies point keeps all four with their order of cost and RTO/RPO.
- `r1a`: "Documents" and "Pictures and video" merged.
- `c8b`, `c8c`, `l8b`, `l8c`, `r1b`, `r1c`, `r1d`: relabelled. Nothing dropped.

## What I am unsure of

- **Reading steps show "In this lecture:".** `r1a`–`r1d` sit in a `watch` group, so `stepCardHTML` puts "In this lecture: " before their step text once they have a `head`. A label such as "To read" for the reading block would fit better; that is a change in `app.js`, outside these files.
- **Numbers in scenes.** Some `why` scenes carry a number as colour ("twenty containers on eight servers", "Thirty people", "eight seconds", "3 seconds" in `l7a`, which the card's timeout point backs). None is a fact the card relies on, but the older rule said no numbers in `why`.
- **`dom` of a few questions** is a judgement call: `c1b` (sustainability has no exam domain; I used 4), `c3d` and `l3a` (monitoring as 2), `c6b` (gateway endpoint as cost, 4).
- **`c3a`'s question** says database subnets get "a custom route table that holds only the local route". That is the card's rule ("databases in subnets with only the local route", "keep the main route table local-only"); a reader could argue the untouched main table also works.
- **`l6a`'s question** was set between two of the owner's own VPCs, so that one side controls the routes. With a partner's VPC, the partner's routes decide what the partner can reach, which the old point did not spell out.
- **Scenes as framing.** Each scene is a situation that really happens (an exposed bucket, a server that idles, a hung instance still getting traffic). None adds a fact the card does not back, but none was checked against a page.
