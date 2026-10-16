# Course diagrams c1–c3: sources per claim

Written 2026-10-16 for `site/diagrams/c1.js`, `c2.js` and `c3.js` (format and rules: `docs/diagrams.md`).

How it was checked: in the Claude Code cloud sandbox, where aws.amazon.com and docs.aws.amazon.com cannot be fetched. Almost every statement was taken over, with its meaning kept, from key points and model answers that were checked earlier against fetched AWS pages (logs: `keys-c1-c2.md`, `keys-c3-c4.md`, `pass2-keys-d01-d07.md`, `extras.md`, `pass2-extras.md`). Those are cited below as "c1.js c1d k5" (file `site/keys/c1.js`, entry `c1d`, point 5), "c1.js c1d why/trap", or "CARDS d4c1" (`site/extras.js`). Four web searches (results from aws.amazon.com and docs.aws.amazon.com, read from the snippets) covered the few new statements; their URLs are given in place. Framing sentences (what goes wrong without the part) carry no source by nature and are marked "framing".

What the diagrams draw, and why only that: each one uses only the services that the course's key points and `STEP_TAGS` cover. c1 has no Auto Scaling group (c1 teaches the load balancer and instances in two zones; Auto Scaling is c3). c2 has no security groups, KMS, GuardDuty or Config (none of them is in the c2 key points or its `STEP_TAGS`; security groups are in c1 and c3). c3 has no CloudFront or Route 53 (taught in c4) and no ElastiCache node (c3 names it only as an example of a session store, which the Auto Scaling part repeats).

## c1 "A highly available web application in one Region"

- Diagram why: framing; the parts it lists are the parts below.
- **region**: why: c1.js c1c k1 (choose a Region close to users or to meet legal requirements). k1: c1c k1. k2: c1c k2. k3: c1c k3. trap: first sentence framing; second: c1c k1 (no automatic replication across Regions).
- **az-a**: why: c1c k2 (definition), l1b why (single point of failure). k1: l1b k1. k2: l1b k3. k3: c1c k2 (synchronous replication); "that is how the standby keeps up" combines it with l1e k1 (synchronous standby). trap: l1b trap.
- **cf**: why: c1c k4 (separate network for content delivery, lowest latency); first sentence framing. k1: c1c k4. k2: l1a k3 (no HTTPS on the website endpoint, CloudFront in front, Amplify Hosting recommended). k3: l1a k3. trap: c1c trap (Local Zone, Outposts, Wavelength Zone).
- **s3**: why: l1a why. k1: l1a k4. k2: l1a k1. k3: l1a k2. trap: l1a trap.
- **vpc**: why: c1d why. k1: c1d k1, l1c trap. k2: l1c trap. k3: c1d k1. trap: l1c k1 (reserved addresses; 251 and 11 are arithmetic, as there).
- **pub-a**: why: c1d k2. k1: c1d k3. k2: c1d k2, l1c k4. k3: c3.js c3a k3 (load balancer and NAT gateways in public subnets, servers private). trap: c1d trap.
- **priv-a**: why: c1d k2 (private when there is no route to an internet gateway); "two firewalls" framing from c1d k5–k6. k1: c1d k5; the load balancer example from c3.js c3d k6. k2: c1d k6. k3: l1c k3. trap: CARDS d2c1 (Pick line), c3.js l3b k3.
- **nat-a**: why: c1d k4, d02.js d2b1 why. k1: d2b1 k1. k2: d2b1 k2. k3: d2b1 k3 (regional NAT gateway; page https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html, cited there). trap: c1d trap, d2b1 k5.
- **elb**: why: l1b k2. k1: d2b1 k5, c3.js c3d k6. k2: c3.js c3d k6. k3: c3.js c3d k5. trap: CARDS d5c3 ("A load balancer on its own").
- **ec2-a**: why: c1e why, k1, k2. k1: c1e k1. k2: c1e k2. k3: c1f k2, l1b k4. trap: l1d trap, l1d k1 (changing the type means a stop and start).
- **rds-a**: why: l1e why, l1e k1. k1: l1e k1, c3.js c3f k6. k2: l1e k1, l1e k2. k3: c1f k3, l1e k3. trap: l1e trap.

## c2 "Who may do what in an AWS account"

- Diagram why: c2.js c2b why; the rest is framing.
- Node "Hosts, network, facilities": the shared responsibility page says AWS protects the infrastructure "composed of the hardware, software, networking, and facilities that run AWS Cloud services" (https://aws.amazon.com/compliance/shared-responsibility-model/, search snippet); "hosts" from c1.js c1c k5 (host operating system).
- **root**: why: d01.js d1b1 why (can do anything, including closing the account), c2b k1 (no identity-based policies or permissions boundary on root). k1: d1b1 k1. k2: d1b1 k2. k3: c2b k1. trap: d1b1 trap.
- **mfa**: why: first sentence framing; second: d1b1 why. "AWS requires it for the root user": https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html ("all AWS account types (standalone, management, and member accounts) require MFA to be configured for their root user", search snippet), also https://aws.amazon.com/about-aws/whats-new/2025/06/aws-iam-mfa-root-users-across-all-account-types/. "Advises it wherever IAM users are still needed": https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html (require MFA where IAM users or the root user are still needed, search snippet; see Review). k1: d1b1 k3 for the root user; "each IAM user" from the IAM MFA page (search snippet, see Review). k2: c2b k6. k3: c2b k6.
- **users**: why: l2a why, l2a k1. k1: l2b k1. k2: l2a k1. k3: l2b k3. trap: l2b trap.
- **policy**: why: CARDS d4c1 ("attaches to a user, group or role and states what that principal can do"), l2b k2 (anything no statement allows stays denied); first sentence l2b why. k1: c2b k3. k2: l2a k2. k3: l2a k3. trap: c2b trap.
- **role**: why: c2b k2, d04.js d4b2 why. k1: c2b k4. k2: d04.js d4b3 k1, k2. k3: c2b k5. trap: d4b3 k2 ("you have its permissions instead of your own").
- **ec2**: why: d4b2 why, d4b2 trap. k1: d4b2 k1. k2: d4b2 k2. k3: d4b2 k4. trap: d4b2 trap.
- **s3**: why: CARDS d4c1 (resource-based policy attaches to a resource and names the Principal). k1: c2b k3. k2: CARDS d4c1 ("Across accounts both sides must allow"). k3: CARDS d4c1. trap: c2b k3 (an explicit Deny in any applicable policy overrides every Allow).
- **other**: why: CARDS d8c2 (Why line). k1, k2, k3: CARDS d8c2 (The role, The caller, External ID).
- **analyzer**: why: l2a k4, d04.js d4b1 k ("without reading logs by hand"); "policies tend to grant more" framing from l2a k3. k1: d4b1 ("can validate a policy you wrote"). k2: l2a k4. trap: l2a trap.
- **hosts**: why: c2a why, c1.js c1c k5. k1: c1c k5. k2: c2a k1, k2. k3: c2a k4. trap: c2a trap.

## c3 "A three-tier web application across two Availability Zones"

- Diagram why: c3.js c3f k1 (the request path); first sentence framing. The why does not map the load balancer, servers and database onto the names presentation, application and data tier: AWS's serverless multi-tier whitepaper defines the presentation tier as the user-facing part (https://docs.aws.amazon.com/whitepapers/latest/serverless-multi-tier-architectures-api-gateway-lambda/presentation-tier.html, search snippet), so a load balancer is not a tier of its own.
- **vpc**: why: framing from c3a k1. k1: c3a k1. k2: c3a k1. k3: c3a k2.
- **pub-a**: why: c3a k3. k1: c3a k4. k2: c3a k5. k3: c3a trap.
- **alb**: why: c3d why, c3d k4 (forwards to a target group). k1: c3d k4. k2: c3d k5. k3: c3f k4. trap: c3d k6, l3c k3 (`unused`), l3c k3 (group across the same zones as the load balancer).
- **nat-a**: why: c3a k3. k1: c3a trap, d02.js d2b1 k2. k2: d2b1 k3. k3: c3a k6. trap: c3e trap.
- **asg**: why: c3e why, c3e k1. k1: c3e k2. k2: c3e k4, CARDS d5c3. k3: c3e k5. trap: c3e k6, c3e trap.
- **app-a**: why: c3b why; "chosen by the resource that runs out" c3b k1. k1: c3b k1. k2: c3b k4, k5. k3: c3c trap, c3e k6. trap: c3b trap.
- **data-a**: why: c3a k3 (databases in subnets with only the local route), c3f k2. k1: c3f k2. k2: c3f k5. k3: l3b k2. trap: l3b trap.
- **db-a**: why: l3c k1. k1: c3f k6, l3c k1. k2: c3f k3. trap: c3f trap.
- **efs**: why: c3c trap, c3c k1. k1: c3c k4, l3c k2. k2: c3c k4. k3: c3c k1.
- **s3**: why: c3c k1 ("S3 stores any amount of data as objects"), c3c trap; "look the same to every user" framing. k1: c3c k5. k2: c3c k6.
- **cw**: why: c3d why, c3d k2. k1: c3d k1. k2: c3d k2. k3: c3d k3. trap: c3d trap.

## Inferences and framing (not a statement on a page)

- c1 region trap, first sentence ("two zones survive the loss of a zone, not of the whole Region").
- c1 az-a k3, second sentence: links the synchronous replication between zones to the RDS standby.
- c1 cf trap: "the choices are" a Local Zone, Outposts or a Wavelength Zone follows c1c trap, which lists these three; c1c's own "an edge location is none of them" is an inference in `keys-c1-c2.md`.
- c2 role trap "not both together": restates "instead of your own".
- c2 s3 trap: applies c2b k3 to a bucket policy.
- c3 alb k3 "When the web and application tiers run on separate servers": the condition under which c3f k4 applies.
- c3 db-a k1 "and the servers keep using it".

## Review

Fact-check of the writer's two Unsure items, 2026-10-16, in the cloud sandbox. WebFetch to docs.aws.amazon.com fails here (DNS), so each verdict rests on the WebSearch summary of the official page (results limited to docs.aws.amazon.com), not on a fetched page.

- c2 mfa k1 (root user and each IAM user, up to eight MFA devices): **confirmed**, no change. https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html: "You can register up to eight MFA devices of any combination of the currently supported MFA types with your AWS account root user and IAM users."
- c2 mfa why ("advises it for every IAM user that people still sign in with"): **fixed** to the page's condition. https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html: MFA is needed when a scenario requires an IAM user, and AWS recommends roles with temporary credentials instead of long-term credentials (summary wording, not a quote). The why now ends "AWS requires it for the root user, and advises it wherever IAM users are still needed."

## For the merge

- No new `DOCS` keys. The diagrams carry no links of their own.
- Possibly worth a look: `docs/diagrams.md` gives no maximum for nodes or parts. These three have 11, 10 and 12 nodes and 11, 10 and 11 parts.
