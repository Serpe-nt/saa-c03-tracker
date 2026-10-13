# Purpose-first rewrite, session B (2026-10-13)

Files: `site/keys/c6.js`, `c7.js`, `c8.js`, `c9.js`, `d01.js`, `d02.js`, `d03.js`, `d04.js`, `d05.js`. 63 entries got a `why` and labelled points; `d2b1` and `d2c1` were already done and are unchanged.

This was a restructuring pass. The facts in `k` and `trap` were not looked up again. Only what is listed below is new.

## New factual claims (all in a `why`), each found on a page the entry already cites

| Entry | Claim | Page |
|---|---|---|
| `c6b`, `d2c3` | A gateway endpoint reaches S3 from the VPC "without requiring an internet gateway or NAT device" | https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html |
| `d5c1` | A Gateway Load Balancer distributes traffic to appliances (the page: the node "select[s] a target appliance") | https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html |
| `d5c3` | The EC2 check "checks that the instance is running" and for "underlying hardware or software issues"; the Elastic Load Balancing check confirms "whether the instance is available to handle requests" | https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html |
| `d3c3` | S3 groups its classes by access pattern (frequently, infrequently, rarely accessed); the Glacier classes are "designed for low-cost, long-term data storage and data archiving" | https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html |
| `d1c7` | A Dedicated Host is "a physical host that is fully dedicated to running your instances"; Spot "can reduce your Amazon EC2 costs significantly" | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html |

Five pages fetched with curl (plain 200, no redirect followed). Nothing else was fetched.

## Framing sentences I am less than sure of

No page was read for these. Each holds by reasoning from facts in the same entry, but the wording is mine.

- `c7a` why: "services react to events instead of calling each other directly" (a definition of event-driven design, not a quote).
- `l7c` why: services that call each other directly "must each know whom to call and wait for the answer".
- `c6e` why: without central control "accounts cannot share discounts, each builds its own network" (the reverse of the consolidated billing and AWS RAM points).
- `c8c` why: loading everything into a warehouse first "is a lot of work for an occasional question" (follows the trap: "not a warehouse to load and size").
- `l8b` why: "A database keeps only data that fits its tables".
- `d1a2` why: "The Free plan gives that protection" rests on the step's own note in plan.js (not charged while on the Free plan), not on a page I read.
- `d1u2` why: permissions attached user by user "drift apart over time".
- `d2b4` why: "from the outside a blocked connection looks the same whichever layer stopped it".
- `d3c2` why: "Multi-AZ keeps a standby that takes over when the primary fails". A fact, not a framing: it rests on the step text ("availability") and the cited failover page's title, and was not fetched.
- `d4c2` why: "the administrators of each account can grant almost anything inside it".

## Changed beyond restructuring

- `d4b6`: the point said "the customer managed key from the KMS step". Day 4 has no KMS step any more (`d4b4` and `d4b5` are not in plan.js), so it now reads "a customer managed KMS key … If you created one". The two facts (monthly fee, objects unreadable once the key is gone) are unchanged.
- Abbreviations spelled out on first use: SSRF (`d4b2`), ETL (`c8b`), RTO and RPO (`c9a`), SCP (`d1c3`, `d4c2`).
- Semicolon chains and long sentences in traps were split into shorter sentences; no fact was added or removed.

## Found elsewhere (not fixed)

- `CLAUDE.md`, "Rules": still says key points are `{k: [...], trap, docs}` with "`k` = 1–5 takeaways". The format is now `why` plus up to 6 `[label, text]` points (`docs/keypoints.md`, `data.test.mjs`).
- `d02.js` `d2c1` (a finished sample, left alone as instructed): its trap still joins two sentences with a semicolon ("…allowed inbound requests; the same change on a NACL does.").
