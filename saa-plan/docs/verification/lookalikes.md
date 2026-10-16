# Look-alike tables (2026-10-16)

Scope: `site/lookalikes.js`, 19 tables, 260 cells. Written in the Claude Code cloud sandbox, where aws.amazon.com and docs.aws.amazon.com cannot be fetched.

## Method

- **Facts reused first.** Almost every cell restates a fact that the site already holds in checked form: a key point (`site/keys/*.js`, read against fetched pages and logged in `keys-*.md`, `pass2-keys-*.md`), a self-check model answer (`CARDS` in `site/extras.js`, read twice: `extras.md`, `pass2-extras.md`), a cheat-sheet cue (`CUES`, same logs) or a question explanation (`site/quiz/*.js`, pools 1–11 and the mocks read twice, pools 12–15 once with a blind answer pass: `pool12.md` … `pool15.md`). The meaning of each fact was kept; the wording was shortened to fit a cell.
- **Six web searches** for the facts nobody had checked before (egress-only internet gateway, NAT instance features, Gateway Load Balancer listener, instance store, EFS Regional and One Zone twice). The search tool returns a summary with quoted sentences, not the page, so each such cell rests on the quoted sentence named below.
- **Not used:** prices, discount percentages, Direct Connect or VPN lead times, and the Aurora Global Database recovery time (AWS states it two ways: "minutes" in the key, "under a minute" in the card; the table says only that you start the failover and that a planned switchover loses no data).
- **Closed services:** none of the tables names one. Security Hub is given as Security Hub CSPM (the name AWS now uses for findings and posture checks, see "AWS changes" in `docs/questions.md`); its match words also catch "Security Hub".
- **Docs links:** every link in a table except two is one the site already cites (a key's `docs` or a `DOCS` entry), so `tools/links.mjs` has checked it. The two new ones came from the search results, with the title shown there: `https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway.html` and `https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html`. Run `node tools/links.mjs` on the owner's PC to confirm both answer a plain 200.

How sources are named below: "key c7c k1" is the first point of `KEYS.c7c` (k1…k6, "trap", "why"); "card d6c3" is the model answer `CARDS.d6c3`; "q13-021 x0" is the explanation of option 0 of that question; "cue" is a row of `CUES`; "search N" is one of the searches listed at the end.

## Sources per cell

### queue-topic-bus (SQS, SNS or EventBridge)
- What it's for: SQS key c7c why, k1, key d9e2 k1. SNS key c7c why, k3, key d9e2 k2. EventBridge key c7a k4, k5.
- How a message moves: SQS key c7a k2 (fetch from a queue), key c7c k1 (receives, processes, deletes), key c7c trap (consumers that share a queue). SNS key c7c k3 (every subscription, the list of endpoint types, filter policy). EventBridge key c7a k4 (event pattern, up to five targets on the default bus and Custom Event Bus - Classic), key l7c k2 (no matching rule, no action).
- Keeping messages: SQS key c7c k1. SNS key c7c k4; the discard condition from the SNS delivery-retries page (see Review). EventBridge q13-021 x0 ("an archive stores the events of the bus … a replay resends everything in the chosen period").
- Exam cue: SQS key d9e2 k1, key d5c2 k1 (backlog), key l7d k3 (dead-letter queue). SNS key d9e2 k2, key c7c k3 (email, SMS). EventBridge key c7a k5, q09-008 x0 and x1 (partner event source, one rule to several targets with no code).

### stream-ingest (Kinesis Data Streams, Firehose, SQS or MSK)
- What it's for: KDS key d9e2 k3. Firehose key c8a k4, key d10e6 k2. SQS card d6c3. MSK key c8a k6, key r1d k1.
- After a record is read: KDS key c8a k3. Firehose key d6c3 trap ("only delivers"), key l8a k1 (buffers by size or period), card d6c3 ("no replay"). SQS card d6c3 (deleted after processing, retention up to 14 days, no replay). MSK key d10e6 trap ("Replay, or several independent consumers reading the same records, needs Kinesis Data Streams or MSK").
- Processing: KDS card d6c3 (consumers you build: Lambda, KCL apps, Flink; ordering per shard by partition key). Firehose key d10e6 k2, key l8a k2, k3. SQS key c7a k2, key c7c k2. MSK key d10e6 k3.
- Exam cue: KDS cues "Real-time", "Ordering / in order", key d9e2 k3. Firehose cue "Near-real-time", key d10e6 k2. SQS cue "Decouple / loosely coupled", card d6c3. MSK key r1d trap ("Kafka is MSK, not Kinesis Data Streams").

### block-file-object (EBS, instance store, EFS or S3)
- What it's for: EBS key c1f k1, key t1d k1. Instance store key c3c k3. EFS key c3c k1. S3 key c3c k1, card d3c1 (static assets, data lakes, backups), key c3c trap (uploads).
- Who can reach it: EBS card d3c1, key d3c1 trap (Multi-Attach in one AZ). Instance store search 5 ("You can't detach an instance store volume from one instance and attach it to a different instance"; volumes are attached only at launch). EFS key c3c k1, k4 (NFS, one mount target per AZ), key d10e2 k6 (Fargate tasks). S3 card d3c1 ("accessed by API … S3 itself stores objects").
- What survives: EBS key c1f k2, key c3c k2. Instance store key c1f k2. EFS search 4 and search 6 (a Regional file system "keeps the data continuously available even when one or more Availability Zones in a Region are unavailable"; One Zone is "not resilient to the loss of the Availability Zone"), q11-010 x1. S3 key l1a k4, key c1f k1.
- Exam cue: EBS key d10e2 k4, k5. Instance store key d10e2 k5, key c3c k3. EFS cue "Shared file system across instances or AZs". S3 key c3c trap, key c3c k5 (lifecycle), key c8b k1 (data lake).

### load-balancers (Application, Network or Gateway Load Balancer)
- What it's for: all three card d5c1; GWLB also q05-008 x0 ("sits transparently in the traffic path").
- How it handles traffic: ALB card d5c1 (path, host, headers, query strings), key c3d k4 (rules forward to a target group), key d5c1 k2 (`X-Forwarded-For`). NLB key d5c1 k2, k3. GWLB search 3 (the listener takes all IP traffic on all ports; no protocol or port can be set; GENEVE on 6081), card d5c1 (GWLB endpoints in route tables).
- What it adds: ALB card d5c1, key d5c1 trap (redirects and Lambda targets are ALB-only), key c5b trap (WAF cannot protect an NLB). NLB card d5c1. GWLB q05-008 x0 (health-checks and scales the appliance fleet), q10-037 x1 ("not a client-facing load balancer").
- Exam cue: ALB key d5c1 trap, key c4b k5. NLB key d5c1 trap, card d5c1 Pick. GWLB card d5c1 Pick.

### vpc-endpoints (gateway endpoint, interface endpoint or NAT gateway)
- What it's for: gateway key c6b k1, key d8e3 k2. Interface card d2c3. NAT key c1d k4.
- How it works: gateway key d8b1 k1. Interface key c6b k2, key d8b1 k2 (security group allows inbound 443). NAT key d2b1 k1, k3.
- Who can use it: gateway card d2c3, key c6b k1. Interface card d2c3 (reachable over Direct Connect, VPN and peering), key c6b k2. NAT key d2b1 k5, key c6b trap (a peer cannot use the NAT device).
- Cost: gateway key c6b k1, key d8b1 k1. Interface key d11c3 trap. NAT key d11e5 k1, card d11c3 (also traffic to S3 or DynamoDB in the same Region).
- Exam cue: gateway card d2c3 Pick, card d11c3 Pick. Interface card d2c3 Pick, key d11c3 trap. NAT key c1d k4.

### sg-nacl (security group or network ACL)
- What it's for: key c1d k5, k6, card d2c1, key d2c1 why ("an additional layer of defense").
- Remembers connections: key l3b k2, key d2b4 k2, card d2c1 (1024–65535).
- Rules: card d2c1, key c1d k5, k6, key l3b k3, key d2c1 trap ("a NACL cannot reference a security group").
- Defaults: key l1c k3, key l3b k4.
- Exam cue: key l3b trap, card d2c1 Pick, key d8e3 k1.

### internet-gateways (internet, NAT or egress-only internet gateway)
- What it's for: IGW key c1d k2, k3. NAT gateway key c1d k4. Egress-only q02-016 x3, key c3a k6. NAT instance key d2b1 k4.
- Availability: IGW key c1d k3, key c3a trap. NAT gateway key d2b1 k2, k3, k4. Egress-only search 1 ("An egress-only internet gateway is a horizontally scaled, redundant, and highly available VPC component"). NAT instance q05-047 x4 ("still in one AZ"), q05-008 x3 (script-based failover).
- Setup: IGW key l1c k4, key d2b1 k1. NAT gateway key d2b1 k1, k4. Egress-only search 1 ("routes IPv6 internet traffic (::/0) to the egress-only internet gateway"). NAT instance search 2 (comparison page: security groups on the NAT instance; port forwarding "Manually customize the configuration to support port forwarding"; source/destination checking disabled for NAT on the network interface).
- Exam cue: IGW key c3a k3, key d2b1 k5. NAT gateway key c1d k4, q02-013 x2. Egress-only key c3a k6. NAT instance q02-013 x2 (patching, scaling, failover), search 2 (port forwarding; "Use as a bastion server").

### vpc-connect (VPC peering, Transit Gateway or PrivateLink)
- What it's for: peering card d2c2, key c6b k4. TGW card d2c2, key c6c k6. PrivateLink key c6b k5, key d2c3 k2.
- Routing: peering card d2c2 (not transitive, no use of the peer's gateways, no overlapping CIDRs). TGW card d2c2 (transitive, several route tables), key c6c k6 (peering across Regions). PrivateLink key c6b k5, key d2c3 k2.
- Cost: peering key l6a k4, key c6e k4. TGW key c6e k4, card d2c2. PrivateLink key d11c3 trap (interface endpoint billing).
- Exam cue: peering card d2c2 Pick, key c6b k5. TGW card d2c2 Pick, key d2c2 trap (many VPCs sharing one VPN). PrivateLink key c6b k5.

### hybrid-links (Site-to-Site VPN, Direct Connect or Client VPN)
- What it's for: S2S key c6c k1. DX key c6c k2, key d10e5 k6. Client VPN q15-030 x0.
- Who connects: S2S key c6c k1. DX key c6c k2, k3. Client VPN m2-043 x3 (certificates, Active Directory or SAML), q15-030 x0 (single sign-on through SAML-based federated authentication).
- Cost and setup: S2S key d11e5 k5. DX key d11e5 k5. Client VPN q11-047 x3.
- Exam cue: S2S key c6e k5, key c6c trap (VPN as the cheap backup path). DX key d10e5 k6, key c6c k5 (not encrypted by default; VPN over it, or MACsec on dedicated connections). Client VPN q15-030 x0.

### database-copies (Multi-AZ, read replica, Aurora Replica or global database)
- What it's for: Multi-AZ key l1e k1, card d3c2. Read replica key l1e k2. Aurora Replica key c4e k2, card d3c2 ("act as both read capacity and failover targets"). Global database key c4e k4, card d9c4.
- Serves reads: Multi-AZ key l1e k1, key d9e3 k2 (Multi-AZ DB cluster, two readable standbys). Read replica card d10c2. Aurora Replica key c4e k3. Global database key c4e k4.
- Failover: Multi-AZ key l1e k1, key c3f k6. Read replica key l1e k2, key d9e3 k2. Aurora Replica key d9e3 k2, key c4e k1. Global database key d9c4 trap ("an action you start"), key c4f k6 (promoting the secondary cluster), key c4e k4 (planned switchover).
- Reach: Multi-AZ key d3c2 trap. Read replica card d3c2. Aurora Replica key c4e trap, k1. Global database key c4e trap, key d9c4 trap (writes in every Region: DynamoDB global tables).
- Exam cue: Multi-AZ card d3c2 Pick, key c3f k6. Read replica key c3f k3, card d3c2. Aurora Replica key c4e k1, key d9e2 k6. Global database card d9c4.

### monitor-audit-config (CloudWatch, CloudTrail or AWS Config)
- What it's for: all three card d6c1.
- What it records: CloudWatch key c3d k1. CloudTrail key c5d k1. Config key l5a k1.
- What it does with it: CloudWatch key c3d k2, k3. CloudTrail card d6c1, key c5d k2. Config key c5d k3, key l5b k2, key d6c1 trap.
- Exam cue: all three key d6c1 trap; cues "Who did what / audit API calls", "Configuration compliance / drift over time"; CloudWatch also key c3d trap (memory metrics).

### keys-and-secrets (KMS, CloudHSM, Secrets Manager or Parameter Store)
- What it's for: KMS card d8c3. CloudHSM card d8c3, q08-044 x0 ("in your VPC"). Secrets Manager key c5c k1. Parameter Store key c5c k2, q12-035 x0.
- Control and features: KMS card d8c3, key d8e4 k1. CloudHSM q08-044 x0 (PKCS#11, JCE, OpenSSL; HSMs in two AZs), q12-036 x2 (CloudHSM key store as a KMS custom key store). Secrets Manager key c5c k1. Parameter Store q12-033 x2 ("no credential rotation"), q04-040 x1, q12-035 x0 (paths, `/prod/*`, free standard tier).
- Exam cue: KMS cue "Control or audit encryption keys", key c5e k3. CloudHSM key d8e4 trap ("Single-tenant HSMs or PKCS#11 mean CloudHSM"), q12-036 x2 (key material kept in the cluster). Secrets Manager key c5e k4, cue "Rotate credentials automatically". Parameter Store q12-035 x0.

### edge-network (CloudFront, Global Accelerator or Transfer Acceleration)
- What it's for: CloudFront card d10c1, key c4d k1. Global Accelerator key c4d k3, key d10e5 trap. Transfer Acceleration q01-038 x4, q02-026 x3 (through edge locations), key d10e2 k2.
- Entry point: CloudFront key l4c k4, key c4d k5. Global Accelerator key c4d k3. Transfer Acceleration q01-038 x4 ("a separate accelerate endpoint").
- Behind it: CloudFront key c4d k6, key l4c k2, k3. Global Accelerator key c4d k3, key d10e5 trap. Transfer Acceleration key d10e2 trap ("S3 may bypass it when it would not be faster").
- Cost effect: CloudFront key d11e5 k4. Global Accelerator and Transfer Acceleration key d11e5 trap.
- Exam cue: CloudFront card d10c1 Pick, key l3a trap (HTTPS for a static site), key d11e5 k4. Global Accelerator key d10c1 trap, card d10c1. Transfer Acceleration key d10e2 k2.

### web-protection (WAF, Shield, Firewall Manager or Network Firewall)
- What it's for: WAF key c5b k3, k4, card d4c3. Shield key c5b k5, k6. Firewall Manager q08-034 x0 (WAF policy), q12-039 x2 (security group policies). Network Firewall q12-038 x0.
- Where it works: WAF key c5b k3, trap. Shield card d4c3. Firewall Manager key c5b trap, q12-039 x2 (accounts and resources as they are added). Network Firewall q08-030 x3 (routing through its endpoints), q12-038 x0 (perimeter of a VPC, traffic to a NAT gateway).
- Exam cue: WAF key c5b k4. Shield key c5b k6. Firewall Manager key c5b trap, q08-034 x0, cue "Across all accounts / centrally". Network Firewall key d8e3 k3, q08-030 x3 (domain allow lists, intrusion prevention).

### app-and-workforce-sign-in (Cognito user pool, identity pool or Identity Center)
- What it's for: user pool card d8c1, key c7d k1. Identity pool key c7d k2. Identity Center key d1c1 k1.
- What it hands out: user pool key c7d k1, key d8c1 trap. Identity pool card d8c1. Identity Center key d1c1 k4, key d1c3 k2.
- Works with: user pool card d8c1. Identity pool card d8c1. Identity Center card d8c1.
- Exam cue: user pool key c7d k3 (user pool authorizer), card d8c1. Identity pool key d8c1 trap, cue "Temporary credentials". Identity Center key d1c1 trap, key d1c4 trap.

### s3-cold-classes (S3 Standard-IA or a Glacier storage class)
- What it's for: Standard-IA key d3c3 trap (about monthly), key c3c k6 (millisecond access). Instant card d3c3, key d3c3 trap. Flexible card d3c3. Deep Archive card d3c3 (lowest price), card d11c1 (multi-year compliance archives).
- Getting data back: Standard-IA card d3c3. Instant card d3c3, key d11c1 trap ("Only Glacier Instant Retrieval needs no restore step"). Flexible and Deep Archive card d3c3, card d11c1.
- Minimum storage: key d11e2 k2, card d3c3.
- Exam cue: restates the first two rows; key d3c3 trap, cue "Most cost-effective / lowest cost".

### analytics-services (Athena, Redshift, EMR or Glue)
- What it's for: Athena key c8c k1, key l8a k4 (Athena reads table definitions from the Data Catalog). Redshift card d10c3. EMR card d10c3. Glue key c8b k3, k4, card d10c3.
- How it runs: Athena card d10c3. Redshift key c8c k4. EMR card d10c3, key d10e6 k3 (task nodes, Spot). Glue key c8b k4.
- Exam cue: Athena key c8c trap, cue "Ad hoc SQL on data in S3". Redshift key c8c trap. EMR key d10e6 k3. Glue key d10c3 trap, key c8c k5.

### ec2-pricing (Savings Plans, Reserved Instances, Spot or On-Demand)
- What it's for: Savings Plans key c3b k4, key d11e3 k1. RIs card d1c7, key c1e trap. Spot key c3b k6. On-Demand card d1c7, card d11c2 ("no commitment and gives no discount").
- Flexibility: Savings Plans card d11c2, key c3b k5. RIs card d11c2. Spot key c3b k6, key d11e3 k4. On-Demand key d1c7 trap (weeks, unknown future).
- Capacity: Savings Plans key c3b trap. RIs key d11c2 trap. Spot key c3b k6. On-Demand key c3b trap (On-Demand Capacity Reservation, no term for immediate use).
- Exam cue: Savings Plans card d1c7 Pick, key d11e3 trap. RIs card d1c7 Pick, key d11e4 k1 (Reserved DB instance). Spot cue "Interruptible / can restart / flexible timing". On-Demand card d1c7 Pick, card d11c2 Pick (peaks).

### threat-detection (GuardDuty, Inspector, Macie or Security Hub CSPM)
- What it's for: GuardDuty card d4c3. Inspector card d4c3, q06-017 x2. Macie card d4c3. Security Hub key d4c3 k1.
- What it looks at: GuardDuty card d4c3, key c5d k5. Inspector card d4c3, key c5d k6. Macie key c5d k6. Security Hub key d4c3 k1.
- Exam cue: GuardDuty key c5d trap, key d4c3 trap (EventBridge rule on a finding). Inspector, Macie, Security Hub key c5d k6, card d4c3 Pick, cue "Sensitive data / PII in S3".

## Searches

1. Egress-only internet gateway: https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway.html ("horizontally scaled, redundant, and highly available"; route `::/0` from the private subnet's route table).
2. NAT gateway and NAT instance: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-comparison.html (security groups, port forwarding by manual configuration, bastion server), and the sentence "If you need to run network address translation (NAT), routing, or firewall services on your instance, you can disable source/destination checking for the network interface", from an EC2 User Guide result whose exact page the summary did not name (the results listed https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/infrastructure-security.html).
3. Gateway Load Balancer listener and GENEVE: https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/gateway-listeners.html, https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html.
4. EFS Regional and One Zone: https://docs.aws.amazon.com/efs/latest/ug/features.html, https://docs.aws.amazon.com/efs/latest/ug/availability-durability.html.
5. Instance store: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-store-lifetime.html.
6. EFS Regional availability, direct quote: https://docs.aws.amazon.com/efs/latest/ug/availability-durability.html, https://docs.aws.amazon.com/efs/latest/ug/disaster-recovery-resiliency.html.

## Match words

Matched case-insensitively as whole words. Chosen from the forms the options really use (counted over all 3,278 options), with generic words left out:
- Plural forms are listed separately ("security group", "security groups"), since a whole-word match on the singular does not catch the plural.
- RDS Multi-AZ matches only "Multi-AZ deployment(s)", "Multi-AZ DB instance", "Multi-AZ DB cluster" and "Multi-AZ standby". Plain "Multi-AZ" also linked ElastiCache options (q10-029, m1-021, m1-031) to the database table.
- Site-to-Site VPN matches "Site-to-Site VPN", "IPsec VPN" and "VPN connection(s)", not a bare "VPN". A bare "VPN" linked transit gateway questions (q02-035, q02-036) to the hybrid table.
- "egress-only internet gateway" also contains "internet gateway", so such an option names two columns of its table. That still links the right pairs (egress-only against NAT gateway or internet gateway).
- Broad on purpose: "S3" (a column of the storage table), "KMS" (also matches `SSE-KMS` and `kms:` actions) and "On-Demand" (also DynamoDB or Kinesis on-demand; a link needs a second column in another option, so these rarely fire).

Questions whose right option names one column and a wrong option another column (script `la-check.mjs`, kept outside the repo):

| Table | Links | Strict |
|---|---|---|
| queue-topic-bus | 15 | 11 |
| stream-ingest | 14 | 12 |
| block-file-object | 16 | 15 |
| load-balancers | 14 | 11 |
| vpc-endpoints | 11 | 11 |
| sg-nacl | 8 | 7 |
| internet-gateways | 10 | 8 |
| vpc-connect | 5 | 4 |
| hybrid-links | 11 | 10 |
| database-copies | 15 | 15 |
| monitor-audit-config | 9 | 9 |
| keys-and-secrets | 8 | 6 |
| edge-network | 9 | 9 |
| web-protection | 9 | 8 |
| app-and-workforce-sign-in | 9 | 9 |
| s3-cold-classes | 8 | 8 |
| analytics-services | 17 | 15 |
| ec2-pricing | 18 | 18 |
| threat-detection | 7 | 7 |

213 links in all, on 205 distinct questions of 790. "Strict" counts only pairs where neither option also names the other option's service.

## Review

Fact-check of the writer's Unsure items and the two new links, 2026-10-16, in the cloud sandbox. WebFetch to docs.aws.amazon.com fails here (DNS), so each verdict rests on the WebSearch summary of the official page (results limited to docs.aws.amazon.com), not on a fetched page. Quoted text is what the summary quoted from the page; "summary" marks a paraphrase.

- internet-gateways, egress-only cells (highly available; private route tables send `::/0` to it): **confirmed**, no change. https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway.html: a "horizontally scaled, redundant, and highly available VPC component"; you add a route that sends all IPv6 traffic (`::/0`) to it (summary).
- internet-gateways, NAT instance cells (security groups, port forwarding by hand, source/destination check off, bastion): **confirmed**, no change. https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-comparison.html: port forwarding is not supported on a NAT gateway, while for NAT instances you "manually customize the configuration to support port forwarding"; security groups attach to a NAT instance but not to a NAT gateway; a NAT instance can serve as a bastion server (summary). https://docs.aws.amazon.com/vpc/latest/userguide/work-with-nat-instances.html: each EC2 instance performs source/destination checks by default, and a NAT instance needs them turned off (Actions, Networking, Change source/destination check) (summary). This page replaces the unnamed EC2 result of search 2.
- load-balancers, GWLB listener ("all IP packets on all ports", GENEVE on 6081): **confirmed**, no change. https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/gateway-listeners.html: "Listeners for Gateway Load Balancers listen for all IP packets across all ports. You cannot specify a protocol or port when you create a listener for a Gateway Load Balancer." Target groups: "The protocol must be GENEVE and the port must be 6081."
- block-file-object, instance store ("cannot be detached and attached to another instance"): **confirmed**, no change. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-store-lifetime.html: an instance store volume exists only for the life of the instance it is attached to, and volumes can be attached only at launch (summary); https://docs.aws.amazon.com/eks/latest/best-practices/cost-opt-storage.html says they cannot be detached and reattached elsewhere (summary).
- vpc-endpoints, interface endpoints for S3 and DynamoDB, reachable from on premises and from peered VPCs: **confirmed**, no change. https://docs.aws.amazon.com/AmazonS3/latest/userguide/privatelink-interface-endpoints.html and https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/privatelink-interface-endpoints.html: both services have interface endpoints, reachable from on-premises applications over Direct Connect or Site-to-Site VPN and from a VPC in another Region through VPC peering or Transit Gateway (summary).
- queue-topic-bus, EventBridge "up to five targets" on the default bus: **confirmed**, no change. https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-targets.html: "You can define up to five targets for each rule." https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-quota.html lists Targets per rule as 5, not adjustable, for the rules-and-targets model (default bus and Custom Event Bus - Classic) (summary).
- analytics-services, Athena "Table definitions come from the Glue Data Catalog": **confirmed**, no change. https://docs.aws.amazon.com/athena/latest/ug/understanding-tables-databases-and-the-data-catalog.html: "Athena uses the AWS Glue Data Catalog to store and retrieve this metadata, using it when you run queries to analyze the underlying dataset."
- queue-topic-bus, SNS discard after retries: **fixed**. https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html (also https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html): client-side errors, or server-side errors that persist beyond the retry count, lead SNS to drop the message "unless a dead-letter queue is attached to the subscription" (summary wording around the quote). The condition is a dead-letter queue on the subscription, not "a queue in between" (an SQS subscriber). The cell "Without a queue in between, SNS discards a message once its delivery retries are exhausted." now reads "SNS discards a message once its delivery retries are exhausted, unless the subscription has a dead-letter queue." Key c7c trap (`site/keys/c7.js`) had the same condition and was fixed the same way at the merge.
- New links `https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway.html` and `https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html`: **confirmed** as AWS docs pages. Both came back in the search index under the titles the table gives ("Enable outbound IPv6 traffic using an egress-only internet gateway", "What is a Gateway Load Balancer?"). The plain-200 check (`node tools/links.mjs`) still has to run on the owner's PC.

## Framing, no source by nature

- The `why` of every table (the confusion it clears up) and the row labels.
- internet-gateways, NAT instance exam cue: "Usually the wrong option". It restates q02-013 x2 and q05-008 x3 as advice.
- vpc-endpoints, NAT gateway exam cue: "for example for updates".
- monitor-audit-config, CloudTrail exam cue: "who … deleted the resource" (who made a call, applied to a delete call).
- The exam-cue rows in general put the facts of the rows above them, and the cheat-sheet cues, in the words a stem uses.
