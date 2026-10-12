# Second verification pass: d01, d02, d03

Date: 2026-10-12

Scope: `site/quiz/d01.js`, `d02.js`, `d03.js` (ids `q01-001` … `q03-050`). Independent second read; the first-pass log (`d01-d03.md`) was used only as a list of things to look at harder.

## Result

| | Count |
|---|---|
| Questions checked | 150 of 150 |
| Questions changed | 64 (d01 16, d02 24, d03 24) |
| of which only the `doc` link changed | 14 (11 in d02, 3 in d03) |
| Answer keys changed | 0 |
| Stems changed | 1 (q02-005) |

No answer key changed. One stem was tightened because a wrong option had become a second defensible answer:

- **q02-005**: inter-AZ data transfer through a transit gateway has been free since 2022-04-01, so "replace the peering connection with a transit gateway" did remove the charge the stem asked about. The stem now asks to remove the charge "without adding other charges", and the explanation says what a transit gateway bills instead (attachment-hours and GB processed). Same key (align subnets by AZ ID).

## Method

Every stem, option and explanation was read again. Statements were checked on pages fetched with a small Node script (`fetch` with a browser User-Agent, redirects reported, text of `main-col-body` extracted, then searched by regular expression). 264 pages on `docs.aws.amazon.com` and `aws.amazon.com` were fetched; the 12 that came back as a 404 or as a redirect to a guide's landing page were not used. A statement counts as confirmed only where the sentence or table row was found in the page text.

Wrong-option explanations got the most attention: wherever one said a service cannot do, does not support or has no something, I looked for the sentence or the authoritative list (quotas page, feature table, API reference). Where neither was found, the explanation was rewritten to say only what the page says.

Checks after editing: `node --test` (33 pass), `node tools/qstats.mjs d01|d02|d03` (50 questions each, "keyed option clearly longest: 0"), `node tools/similar.mjs 0.38` (the same 5 known pairs, no new pair).

## Changed questions

Format: id, what was wrong, source.

### d01

- **q01-001**, **q01-004** (edge location explanations). "You cannot launch EC2 instances in edge locations" is not stated on a page; reworded to what edge locations are used for and where instances run. https://aws.amazon.com/about-aws/global-infrastructure/regions_az/ and https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/global-services.html
- **q01-006** (paired-Region option). Now follows AWS's own sentence: content is not moved or replicated outside the chosen Region without the customer's agreement. https://aws.amazon.com/compliance/data-privacy-faq/
- **q01-007** (Identity Center option). "Users can then work in any Region" was not found on the Identity Center Region page; reworded. https://docs.aws.amazon.com/singlesignon/latest/userguide/regions.html
- **q01-009** (key and certificate-object option). Dropped "free" for the ACM certificate (a price statement; the ACM pricing page loads its figures by script). The option about uploading a certificate now rests on "website endpoints do not support HTTPS". https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html
- **q01-019** (Reserved Instance option; `doc`). Explanation now uses the page's definition of an RI (a billing discount on On-Demand Instances that match its attributes). `doc` changed from `ec2-pricing` to `savings-plans`, the service the key is about. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html and https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html
- **q01-029** ("deleted after first boot" option). The first pass listed this as inferred. Replaced with what the page says: user data is an instance attribute that can be viewed for any instance. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html (exposure of user data confirmed at https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html)
- **q01-030** (Beanstalk option). "Still runs EC2 instances" → "compute", because of the Cluster mode on EKS. https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html
- **q01-031** (key and Beanstalk option). "Fargate puts no time limit on a task" was not found on a page; the key's explanation now says only that the job is an ordinary ECS task started on a schedule. The web server environment explanation uses the page's resource list. https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tasks-scheduled-eventbridge-scheduler.html and https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts-webserver.html
- **q01-032** (key explanation). "Runs upstream Kubernetes" → "certified Kubernetes-conformant", the wording on the page. https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html
- **q01-034** (Lambda and both Fargate options). See the section below. https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-security-considerations.html, https://docs.aws.amazon.com/eks/latest/userguide/fargate.html, https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
- **q01-038** (IAM role option). Now rests on "website endpoints support only publicly readable content". https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html
- **q01-039** (PHP option). The S3 hosting page no longer carries the sentence about server-side scripting. Reworded to the current page text (static content, client-side scripts) and the website settings that exist. https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html and https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketWebsite.html
- **q01-045** (key and three wrong options). The key's explanation now quotes the template: it "notifies you after your spending exceeds AWS Free Tier limits" (the first pass had this under "Still uncertain"). The other three explanations say what each tool is, without a claim about what it lacks. https://docs.aws.amazon.com/cost-management/latest/userguide/budget-templates.html, https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html, https://docs.aws.amazon.com/pricing-calculator/latest/userguide/what-is-pricing-calculator.html, https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html
- **q01-046** (Cost Anomaly Detection option). Page wording ("machine learning models to detect and alert on anomalous spend patterns"). https://docs.aws.amazon.com/cost-management/latest/userguide/manage-ad.html
- **q01-047** (Pricing Calculator option). Reworded without "has no enforcement capability". https://docs.aws.amazon.com/pricing-calculator/latest/userguide/what-is-pricing-calculator.html

### d02

- **q02-002** (expand-the-subnets option). The first pass listed "a subnet's CIDR block cannot be changed" as inferred. Now tied to the API reference: `ModifySubnetAttribute` has no CIDR parameter. https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifySubnetAttribute.html
- **q02-004** (spread placement group option). "Separate racks" → "distinct hardware", the page's wording. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html
- **q02-005** (stem and transit gateway option). See "Result". https://aws.amazon.com/about-aws/whats-new/2022/04/aws-data-transfer-price-reduction-privatelink-transit-gateway-client-vpn-services/ and https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html
- **q02-016** (`::/0` → NAT gateway option). See the section below. https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-nat64-dns64.html and https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway.html
- **q02-017**, **q02-044** (ALB options). "An ALB does not support Elastic IPs" is no longer accurate: ALBs use service-managed Elastic IP addresses that show in the account, and an ALB can draw from an IPAM pool. What holds is that the service assigns and releases the addresses, and that AWS points to an NLB for a static address per AZ. https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html and https://aws.amazon.com/elasticloadbalancing/faqs/
- **q02-027** (peering option; `doc`). See the section below. `doc` → `endpoints`.
- **q02-029** (security group option). See the section below. https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateVpcEndpoint.html
- **q02-030** (prefix list and NACL options). Reworded to the definition of an AWS-managed prefix list (IP address ranges of the service). https://docs.aws.amazon.com/vpc/latest/userguide/working-with-aws-managed-prefix-lists.html
- **q02-032** (transit gateway option; `doc`). See the section below. `doc` → `privatelink`. https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html
- **q02-040** (key explanation). "Can take over automatically, for example through BGP" → the FAQ's statement that VPC traffic fails over to a backup VPN connection automatically. https://aws.amazon.com/directconnect/faqs/
- **q02-042** (key explanation). Dropped "not the private VIF", which no page states; kept the two documented paths (transit VIF with private IP VPN, public VIF). https://docs.aws.amazon.com/vpn/latest/s2svpn/private-ip-dx.html
- **q02-043** (Global Accelerator option). "Improves internet traffic to public endpoints" and "does not extend a Direct Connect connection" were not found on the page; the explanation now uses the FAQ's description (static addresses, anycast from edge locations). https://aws.amazon.com/global-accelerator/faqs/
- **q02-044** (CNAME option as well). "Because the apex must also hold SOA and NS records" is not on the AWS page; now "the DNS protocol does not allow a CNAME record at the zone apex". https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html
- `doc` only: **q02-012**, **q02-013**, **q02-014**, **q02-015** `vpc` → `nat`; **q02-028**, **q02-031** `vpc` → `endpoints`; **q02-018** (had none) → `vpc`; **q02-023**, **q02-024** (had none) → `session-manager`; **q02-037**, **q02-038** (had none) → `vpn`.

### d03

- **q03-001** (Glacier Instant Retrieval option). The break-even claim ("at monthly reads its retrieval charges outweigh its lower storage price") is a price calculation nobody checked. Replaced with AWS's own comparison in words: lower storage price, higher data access price than Standard-IA, for data read less often. https://aws.amazon.com/s3/faqs/ and https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html
- **q03-009** (suspend versioning option). Page wording: suspending stops new versions from accruing. https://docs.aws.amazon.com/AmazonS3/latest/userguide/VersionSuspendedBehavior.html
- **q03-012** (encryption option; `doc`). "S3 decrypts SSE-S3 objects for authorized requests" → S3 "decrypts it for you when you access it"; encryption is not an access control. `doc` → `s3-security`. https://docs.aws.amazon.com/AmazonS3/latest/userguide/serv-side-encryption.html
- **q03-013** (quota option). See the section below. https://aws.amazon.com/s3/faqs/
- **q03-019** (replication and snapshot options). See the section below. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html and https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Stop_Start.html
- **q03-021** (key explanation). "Keep the same path" was not found; now "stay in the same file system", plus the IA read charge the FAQ names. https://docs.aws.amazon.com/efs/latest/ug/lifecycle-management-efs.html and https://aws.amazon.com/efs/faq/
- **q03-022** (S3 File Gateway option). It is not on-premises only: the gateway also runs as an EC2 AMI. The deciding fact is that you deploy and run it yourself. https://aws.amazon.com/storagegateway/faqs/
- **q03-023** (EFS option). "Cannot match Lustre's latency and throughput" is a comparison no page makes; reworded. https://aws.amazon.com/fsx/lustre/faqs/
- **q03-025** (Lustre and EFS options; `doc`). See the section below. `doc` (had none) → `fsx-openzfs`. https://aws.amazon.com/fsx/when-to-choose-fsx/
- **q03-026** (Volume Gateway and Tape Gateway options). The Volume Gateway explanation now rests on the FAQ sentence "You cannot directly access them using Amazon S3 API actions"; the tape sentence is reworded to what the FAQ says (tapes are accessed through the virtual tape library). https://aws.amazon.com/storagegateway/faqs/
- **q03-030** (key explanation). "At any second within the retention period" → up to the latest restorable time (logs are uploaded every five minutes). https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html
- **q03-032** (S3 default encryption option). See the section below. https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html
- **q03-034** (key explanation). "Usually within seconds to minutes" → the FAQ's statement that lag depends on the network between the Regions; "standalone primary" → "standalone DB instance". https://aws.amazon.com/rds/faqs/ and https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.XRgn.html
- **q03-035** (key explanation). The Aurora guide now says writes go "to six storage nodes" and that the volume holds "copies of the data across three Availability Zones"; the explanation follows that and drops "tolerates the loss of an entire AZ without losing data". The keyed option ("six copies … across three Availability Zones") is unchanged. https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html and https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.StorageReliability.html
- **q03-037** (ALB option). Reworded to the FAQ ("HTTP and HTTPS"). https://aws.amazon.com/elasticloadbalancing/faqs/
- **q03-040** (DAX option). "A cache for reads" was too narrow (DAX has write-through operations); reworded. https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.concepts.html
- **q03-042** (Streams and lifecycle options), **q03-043** (read replica option), **q03-044** (quota option), **q03-047** (DAX option), **q03-048** (DynamoDB option). See the section below.
- `doc` only: **q03-024** (had none) → `fsx-ontap`; **q03-049** (had none) → `neptune`; **q03-050** (had none) → `documentdb`.

## Wrong-option claims rewritten because no page backs them

Each of these said a service cannot do, does not support or has no something, and no fetched page or authoritative list states it. The new text says what is documented and still explains why the option is wrong.

| id | Claim removed | Now rests on |
|---|---|---|
| q01-001, q01-004 | EC2 instances cannot be launched in edge locations | what edge locations are used for |
| q01-007 | Identity Center users "can work in any Region" | Identity Center manages account access |
| q01-031 | Fargate "puts no time limit on a task" | the job is an ordinary scheduled ECS task |
| q01-034 | Lambda has "no way to load kernel modules or install host-level agents" | "Lambda automatically manages the underlying infrastructure – including server maintenance … and patching" |
| q01-034 | Fargate: "cannot load custom kernel modules"; EKS on Fargate: "no access to the underlying host or its kernel" | "privileged containers or access are currently unavailable", restricted Linux capabilities; EKS: privileged containers and DaemonSets not supported |
| q01-038 | "Buckets do not have roles" | website endpoints serve only publicly readable content |
| q01-039 | S3 hosting "cannot execute server-side code" | current hosting page and `PutBucketWebsite` settings |
| q01-045 | Cost Explorer "does not alert"; Pricing Calculator "does not monitor"; CUR "do not send alerts" | what each tool is |
| q01-047 | Pricing Calculator "has no enforcement capability" | what it is |
| q02-016 | a NAT gateway "does not provide IPv6-to-IPv6 internet access" | NAT64 page and the egress-only internet gateway page |
| q02-017, q02-044 | an ALB "does not support Elastic IPs" | ALB addresses are service-managed; NLB for static addresses |
| q02-027 | "AWS services are not reached through VPC peering" | definition of a peering connection and of a VPC endpoint |
| q02-029 | gateway endpoints "do not support security groups" | `CreateVpcEndpoint`: security groups are an interface-endpoint parameter, route tables a gateway-endpoint one |
| q02-032 | a transit gateway "cannot route between overlapping CIDR blocks" | "CIDR blocks cannot overlap" in the transit gateway guide |
| q02-042 | the VPN runs "not [over] the private VIF" | the two documented paths |
| q03-013 | 5 GB PUT limit is "not an adjustable quota" | S3 FAQ: largest single PUT is 5 GB; multipart for larger objects |
| q03-019 | instance store "is not replicated anywhere"; snapshots "work only for EBS volumes" | "temporary block-level storage … physically attached to the host"; copy data to EBS or S3 |
| q03-023 | EFS "cannot match Lustre's latency and aggregate throughput" | what each file system is built for |
| q03-025 | Lustre "does not offer ZFS snapshots and clones"; EFS "does not expose ZFS features" | FSx protocol table (Lustre: its own protocol; OpenZFS: NFS) |
| q03-026 | virtual tapes "cannot be read as individual S3 objects" | tapes are read back through the gateway |
| q03-032 | RDS backups are "not in a customer bucket" | "You can only encrypt an Amazon RDS DB instance when you create it" |
| q03-042 | Streams "do not find expired items"; DynamoDB "tables do not have lifecycle rules" | what a stream records; TTL as the built-in expiry |
| q03-043 | DynamoDB "has no per-AZ read replicas to create" | DynamoDB FAQ: synchronous replication across three AZs |
| q03-044 | 400 KB limit "cannot be raised" | "limits the size of each item … to 400 KB"; store large data in S3 |
| q03-047 | DAX "works only with DynamoDB tables" | DAX is "API-compatible with DynamoDB" |
| q03-048 | DynamoDB "does not support the joins" | what DynamoDB is and what the workload needs |

"Cannot" statements that were kept because a page states them, for example: no security group on a NAT gateway and no port forwarding (nat-gateway-basics, vpc-nat-comparison), one internet gateway per VPC (VPC quotas), gateway endpoints not usable from on premises (vpc-endpoints-s3), no encrypted read replica of an unencrypted DB instance (Overview.Encryption), a Multi-AZ standby cannot serve reads (Concepts.MultiAZSingleStandby), instance store volumes cannot be moved to another instance (instance-store-lifetime), Multi-Attach only within one AZ and only io1/io2 (ebs-volumes-multi), bootable st1 volumes not supported (hdd-vols), EFS not supported with Windows (EFS quotas), Memcached without sorted sets or pub/sub (ElastiCache engine comparison table), FSx for OpenZFS and FSx for Windows protocols (FSx comparison table), local secondary indexes only at table creation (SecondaryIndexes), no CNAME at the zone apex (ResourceRecordTypes), security groups have no deny rules (security-group-rules), a virtual private gateway attaches to one VPC at a time (`AttachVpnGateway`), regional Reserved Instances and Savings Plans reserve no capacity (reserved-instances-scope, Savings Plans FAQ), account instances of Identity Center have no permission sets (account-instances-identity-center).

## First-pass "Still uncertain" items

- **q02-002** (subnet CIDR): now backed by the API reference and reworded. Settled.
- **q01-029** (user data not deleted): replaced by the page's own statement. Settled.
- **q01-045** (zero spend budget and the Free plan): the explanation now quotes the template text. How the alert behaves on a credit-based Free plan account is still not stated on any page fetched.
- Cost comparisons and lead times: out of scope, counted below.

## Still uncertain

Counts only, by the owner's categories:

- Price comparisons not stated in words on a fetched page: about 18 questions by my tally (5 in d01, 4 in d02, 9 in d03). No page contradicted any of them.
- Provisioning lead times (Direct Connect weeks, VPN hours): 2 questions, both in d02.
- Figures on which AWS's own pages disagree: none in these pools.
- `ref` against Skill Builder lesson content: all 150, not opened.

## Limits of this pass

- Statements were prioritised: every keyed answer's deciding fact, every "cannot / does not / has no" in a wrong option, and everything the first pass called inferred were looked up. General descriptions that restate what a feature is for (for example "tags label resources; they do not execute commands", "CloudTrail records API calls, not network traffic", "Flow Logs only record metadata") were read for plausibility and left as written; I confirmed what the feature is, not a sentence stating the absence.
- Instance family descriptions (q01-012 … q01-016) were checked against the family lists in the EC2 guide; the marketing page that describes each family loads most of its text by script.
- One read by one AI agent on one day. Not a human AWS expert.

## Not reached

Nothing. All 150 questions had this second read.

## For files outside this session's scope

- `docs/questions.md`, "AWS changes" list, candidates to add:
  - ALBs use service-managed Elastic IP addresses and can draw from IPAM pools; "an ALB does not support Elastic IPs" should be "its addresses are assigned by the service". https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html
  - Inter-AZ data transfer through Transit Gateway, PrivateLink interface endpoints and Client VPN is free (since 2022-04-01); data processing is still charged. Any question that rejects a transit gateway because of "inter-AZ transfer" needs another reason.
  - The S3 static hosting page no longer contains "Amazon S3 does not support server-side scripting".
  - The Aurora guide says "six storage nodes" and "copies of the data across three Availability Zones"; "six copies" is no longer printed there.
- `site/quiz/meta.js`: no key fits public IPv4 address / Elastic IP charges (q02-018 uses `vpc`). A key for the Elastic IP page (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html) would fit q02-017 and q02-018 better.
- Other pools may repeat the patterns above (ALB and Elastic IPs, "Fargate has no time limit", Lambda "no access to the operating system", gateway endpoints and security groups). Notes are in the shared folder as `pass2-d01-d03-findings.md`.
