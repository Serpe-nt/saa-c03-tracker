# Key points for c1 and c2: sources per sentence

Written 2026-10-12/13 for the 21-day plan. Files: `site/keys/c1.js` (c1a–c1f, l1a–l1e) and `site/keys/c2.js` (c2a, c2b, l2a, l2b).

How it was checked: every page below was fetched in this session with redirects not followed (a redirect counted as a wrong URL), its text was stored, and each sentence was looked up in that text. A sentence counts as sourced only when the wording was found on the page. Sentences that are conclusions or exam framing are listed separately under "Inferences". A second read by a sub-agent that had not seen these sources is recorded at the end.

What the points are based on:
- Lesson names in `plan.js` and the public course pages on Skill Builder (Details and Outline tabs, read in the browser pane). Course objectives of "Fundamentals of Architecting on AWS": the architect's role, the six pillars, the Well-Architected Tool, the design process, global infrastructure, VPC basics, compute, databases; listed services Aurora, DynamoDB, EBS, EC2, ECS, EKS, S3, Lambda. "Fundamentals of Security on AWS": least privilege and MFA, users, groups, roles and policies, cross-account and temporary access, resource policies, data protection.
- The lab description pages (public, read in the browser pane). Objectives as printed there:
  - l1a Cloud Computing Essentials: characteristics and benefits of the cloud, cloud versus on-premises, a static webpage on Amazon S3. Scenario: improve the reliability of a web page.
  - l1b Cloud First Steps: benefits of the global infrastructure, Regions versus AZs, EC2 instances across multiple AZs for high availability.
  - l1c Networking Concepts: VPCs, subnets, internet gateways, route tables; CIDR notation; routing with gateways, NACLs and security groups.
  - l1d Computing Solutions: instance families and types, scaling concepts, connection methods for EC2, choosing a type for a workload. Scenario: more compute power and memory for an application on one instance.
  - l1e Databases in Practice: database types, Multi-AZ, read replicas, managed versus hosted databases, migration with AWS DMS.
  - l2a Core Security Concepts: users, roles and groups, the structure of IAM policies, shared responsibility and compliance programs, IAM best practices. Scenario: restrict support engineers to the actions their role needs.
  - l2b Introduction to IAM: pre-created users and groups, the policies on those groups, adding users to groups, the IAM sign-in URL, the effect of policies on service access.
- The lectures and the labs themselves are behind a login and were not opened. No point says what a video or a lab step contains.
- The questions in `site/quiz/*.js` tagged with each step's topics (about 330) were read first.
- Retired key points (commit add330b: d1w1–d1w4, d1p1–d1p3, d2w1, d2p1, d3w1, d3w2, d3p1, d4w1, d4p1, d6w5) were reused where the topic fits; every reused sentence was looked up again.

URL prefixes used below: `EC2/` = https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/, `VPC/` = https://docs.aws.amazon.com/vpc/latest/userguide/, `IAM/` = https://docs.aws.amazon.com/IAM/latest/UserGuide/, `WAF/` = https://docs.aws.amazon.com/wellarchitected/latest/framework/, `WAT/` = https://docs.aws.amazon.com/wellarchitected/latest/userguide/, `RDS/` = https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/, `S3/` = https://docs.aws.amazon.com/AmazonS3/latest/userguide/, `SRM` = https://aws.amazon.com/compliance/shared-responsibility-model/, `RAZ` = https://aws.amazon.com/about-aws/global-infrastructure/regions_az/.

## c1.js

### c1a
- k1 exam scope and domain weights: https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html
- k2 trade-offs between pillars: WAF/definitions.html (same text on WAT/waf.html)
- k3 advantages of the cloud: https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html
- k4 general design principles: WAF/general-design-principles.html
- k5 managed services: WAF/oe-design-principles.html ("Use managed services"), WAF/cost-dp.html ("removes the operational burden of managing operating systems and applications")
- trap "plausible responses that match the content area": the exam guide, section Response types

### c1b
- k1 operational excellence and reliability principles: WAF/oe-design-principles.html, WAF/rel-dp.html
- k2 performance, cost and security principles: WAF/perf-dp.html, WAF/cost-dp.html, WAF/sec-design.html
- k3 sustainability principles: WAF/sus-design-principles.html
- k4 the tool: WAT/well-architected.html ("Manual, guided self-review", HRIs and MRIs, improvement plan), WAT/tutorial.html (questions that span the pillars), WAT/workloads.html (high and medium risk issues), WAT/milestones.html
- k5 lenses: WAT/lenses.html
- trap: WAF/cost-dp.html (stop resources not in use), WAF/sus-design-principles.html (minimize idle resources), https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html ("inspects your AWS environment")

### c1c
- k1 Regions isolated, no automatic replication, choose for proximity or legal requirements: EC2/using-regions-availability-zones.html
- k2 AZ definition, at least three, 100 km, synchronous replication: RAZ; "Each Region has at least three Availability Zones": https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html
- k3 subnet in one AZ: VPC/configure-subnets.html; EBS volume and instance in the same AZ: https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html; VPC spans AZs: https://aws.amazon.com/vpc/faqs/ ("Can a VPC span multiple Availability Zones? Yes."); AMIs are Region-specific: EC2/CopyingAMIs.html
- k4 edge locations and origin: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html
- k5 the split of responsibility: SRM
- trap Local Zones, Outposts, Wavelength: EC2/using-regions-availability-zones.html, https://docs.aws.amazon.com/local-zones/latest/ug/what-is-aws-local-zones.html

### c1d
- k1: https://aws.amazon.com/vpc/faqs/, VPC/configure-subnets.html, VPC/vpc-cidr-blocks.html (/16 to /28), https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html (no peering with overlapping blocks)
- k2 public and private subnet, route plus public IPv4 address: VPC/VPC_Internet_Gateway.html, VPC/configure-subnets.html
- k3: VPC/VPC_Internet_Gateway.html, VPC/vpc-nat-gateway.html
- k4: VPC/infrastructure-security.html (comparison table), VPC/nacl-rules.html
- k5 security group as source: VPC/security-group-rules.html
- trap: VPC/VPC_Internet_Gateway.html ("can't communicate with the internet, even if they have public IP addresses"), VPC/vpc-nat-gateway.html

### c1e
- k1 series letters: https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html; burstable: EC2/burstable-performance-instances.html
- k2: EC2/instance-purchasing-options.html, EC2/ec2-on-demand-instances.html ("short-term, irregular workloads that cannot be interrupted"), EC2/using-spot-instances.html
- k3: EC2/user-data.html (first boot, adds to boot time), EC2/AMIs.html, EC2/CopyingAMIs.html
- k4: https://docs.aws.amazon.com/lambda/latest/dg/welcome.html, https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html (15 minutes; 90 for Lambda Managed Instances), https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html, https://docs.aws.amazon.com/eks/latest/userguide/fargate.html, https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html
- k5: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html, https://aws.amazon.com/elasticbeanstalk/faqs/ ("retain full control over the AWS resources")
- trap: EC2/dedicated-hosts-overview.html (comparison table: visibility of sockets and physical cores), EC2/dedicated-instance.html, EC2/instance-purchasing-options.html

### c1f
- k1: EC2/Storage.html, S3/DataDurability.html
- k2: https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html, https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html (snapshots migrate data across AZs), EC2/InstanceStorage.html, EC2/instance-store-lifetime.html
- k3: RDS/Welcome.html, https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html
- k4: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html, https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-use-s3-too.html
- k5: https://docs.aws.amazon.com/whitepapers/latest/aws-overview/database.html, https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html, https://docs.aws.amazon.com/neptune/latest/userguide/intro.html, https://docs.aws.amazon.com/documentdb/latest/devguide/what-is.html, https://docs.aws.amazon.com/keyspaces/latest/devguide/what-is-keyspaces.html, https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html
- trap relational versus DynamoDB workloads: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SQLtoNoSQL.WhyDynamoDB.html

### l1a
- k1: S3/WebsiteHosting.html, S3/WebsiteEndpoints.html ("Supports only GET and HEAD requests on objects")
- k2: S3/EnableWebsiteHosting.html, S3/WebsiteAccessPermissionsReqd.html
- k3: S3/WebsiteEndpoints.html, https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html
- k4: S3/DataDurability.html, WAF/perf-dp.html (static websites remove the need for web servers)
- trap: S3/WebsiteEndpoints.html, SRM

### l1b
- k1: VPC/configure-subnets.html
- k2: https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html
- k4: https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html, https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html
- trap cluster placement group in a single AZ: EC2/placement-strategies.html

### l1c
- k1: VPC/subnet-sizing.html, VPC/vpc-cidr-blocks.html
- k2: VPC/subnet-route-tables.html, VPC/route-tables-priority.html, VPC/RouteTables.html
- k3: VPC/security-group-rules.html, VPC/default-network-acl.html, VPC/custom-network-acl.html
- k4: VPC/VPC_Internet_Gateway.html, VPC/infrastructure-security.html
- trap: VPC/vpc-cidr-blocks.html, https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html

### l1d
- k1: EC2/change-instance-type-of-ebs-backed-instance.html
- k2: EC2/how-ec2-instance-stop-start-works.html
- k3: https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html
- k4: EC2/connect.html (table of requirements per connection option)
- trap: EC2/change-instance-type-of-ebs-backed-instance.html, WAF/rel-dp.html (scale horizontally), EC2/ec2-instance-resize.html (an EBS volume adds storage)

### l1e
- k1: RDS/Concepts.MultiAZSingleStandby.html, RDS/Concepts.MultiAZ.Failover.html
- k2: RDS/USER_ReadRepl.html, RDS/USER_ReadRepl.Create.html (automatic backups on the source)
- k3: RDS/Welcome.html (table comparing on-premises, EC2 and RDS management; query tuning)
- k4: https://aws.amazon.com/dms/faqs/, https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.Creating.html, https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html
- trap point-in-time restore creates a new DB instance: RDS/USER_PIT.html

## c2.js

### c2a
- k1: SRM
- k2: RDS/Welcome.html (table), https://docs.aws.amazon.com/lambda/latest/dg/welcome.html, SRM (data, encryption options, IAM permissions), https://docs.aws.amazon.com/lambda/latest/dg/security-dataprotection.html
- k3: SRM
- k4: https://docs.aws.amazon.com/artifact/latest/ug/what-is-aws-artifact.html, https://docs.aws.amazon.com/whitepapers/latest/aws-overview/security-and-compliance.html, SRM
- k5: WAF/sec-design.html
- trap: SRM, https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html

### c2b
- k1: IAM/access_policies.html (no identity-based policies or boundary on root; SCPs affect it), IAM/id_root-enable-root-access.html, https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html
- k2: IAM/id_users.html, IAM/id_groups.html, IAM/id_roles.html
- k3: IAM/reference_policies_evaluation-logic.html, IAM/reference_policies_evaluation-logic_policy-eval-basics.html, IAM/reference_policies_evaluation-logic_policy-eval-denyallow.html
- k4: IAM/id_roles.html, IAM/id_roles_use_switch-role-ec2.html
- k5: IAM/reference_policies_condition-keys.html (aws:MultiFactorAuthPresent with BoolIfExists), IAM/id_credentials_mfa_configure-api-require.html, https://docs.aws.amazon.com/STS/latest/APIReference/API_GetSessionToken.html
- trap: IAM/access_policies_boundaries.html, https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html

### l2a
- k1: IAM/id_groups.html
- k2: IAM/access_policies_managed-vs-inline.html
- k3, k4: IAM/best-practices.html, IAM/access-analyzer-policy-generation.html
- trap ReadOnlyAccess: IAM/access_policies_managed-vs-inline.html

### l2b
- k1: IAM/id_users.html, IAM/id_groups.html
- k2: IAM/access_policies_managed-vs-inline.html, IAM/reference_policies_evaluation-logic.html
- k3: IAM/id_users_sign-in.html, IAM/console-account-alias.html, IAM/id_root-user.html
- k4: IAM/id_groups.html, IAM/reference_policies_evaluation-logic_policy-eval-basics.html
- trap: IAM/id_groups.html, IAM/id_roles_use_switch-role-ec2.html

## Inferences (not a statement on a page)

- c1a k5 "which is why they fit a stem that asks for the least operational overhead" and the whole c1a trap after its first clause: exam framing.
- c1b trap: the pairing of one practice with two pillars is built from two design principles.
- c1c k1 "which is how a data residency rule is met": conclusion from the two sourced facts. c1c trap "An edge location is none of them": the EC2 page lists where EC2 is hosted and edge locations are not in the list.
- c1d k1 "its Region": no page says in one sentence that a VPC belongs to a single Region. c1d k5 "which is how only the web tier is let through": example. c1d trap "because of its name": complement of the definition.
- c1e k2: mapping of workload patterns to options combines three pages. c1e k4 calls a 15-minute function "standard"; the page says 15 minutes, 90 for Lambda Managed Instances.
- c1f trap "Keeping SQL Server or Oracle rules out Aurora" (Aurora is compatible with MySQL and PostgreSQL only) and "MongoDB-compatible means DocumentDB, not DynamoDB".
- l1a k1 "such as API Gateway with Lambda": advice that q01-039 keys on. l1a k4 "more reliable than one web server". l1a trap second sentence.
- l1b k3: arithmetic (q01-010). l1b trap: conclusion; only the single-AZ scope of a cluster placement group is sourced.
- l1c k1: 251 and 11 are arithmetic. l1c k4 puts the documented requirements in one list.
- l1d k3 "Pick the series by the resource that runs short". l1d trap "vertical scaling" and "never from a larger EBS volume".
- l1e trap first sentence: follows from synchronous and asynchronous replication; no page mentions an accidental DELETE.
- c2a k2 "Your code": the Lambda page says "content". c2a k4 "They cover AWS's side". c2a trap examples.
- c2b k1 "which is why it is guarded with MFA and kept out of daily use". c2b trap example with AdministratorAccess (the docs give a similar example with another user).
- l2a trap first sentence. l2b trap: advice built from the group and role pages.

## Found elsewhere (not fixed here)

- `STEP_TAGS.l2b` has "IAM roles & cross-account", but the lab's objectives name only users, groups, policies and the sign-in URL. No role appears in its description.
- `STEP_TAGS.l1d` has "EC2 user data & AMIs"; the lab's objectives are instance families, scaling and connection methods. "Instance access" would fit; user data is not mentioned.
- `STEP_TAGS.l1c` lacks "Security groups & NACLs", although the lab's objectives name NACLs and security groups.
- `STEP_TAGS.l2a` has only "IAM policies"; the objectives also name roles and the shared responsibility model with compliance programs.
- `STEP_TAGS.l1e` has only "RDS"; the objectives also name AWS DMS ("Migration & transfer").
- `c1a` has no entry in `STEP_TAGS` (nothing in QTAGS fits "solutions architect role"), so its card shows no step practice.
- The course "Fundamentals of Security on AWS" is marked "Subscription Needed" on Skill Builder; "Fundamentals of Architecting on AWS" is free and was last updated 2026-09-30. plan.js says "Free" on c1a only, which matches.
- The Well-Architected user guide now describes an "AWS Well-Architected Agent" (preview) next to the Tool. Nothing in the bank mentions it; q06-030 still keys correctly on the Tool.
- The S3 "Hosting a static website" page no longer contains the sentence that S3 does not support server-side scripting. Explanations that quote it (for example around q01-039) should rest on "Supports only GET and HEAD requests on objects" instead.
- q01-033's explanation says you keep "full access to the resources"; the words are in the Elastic Beanstalk FAQ ("retain full control"), not in the developer guide.
