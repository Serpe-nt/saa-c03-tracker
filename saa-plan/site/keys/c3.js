// Key points per plan step for the course "Designing a Three-Tier Web Architecture" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c3a: {
    why: "A three-tier application has parts that the internet must reach and parts it must never reach. The network has to enforce that, and it has to keep working when one data center fails. Both are decided by how you cut the VPC into subnets and which route table each subnet gets.",
    k: [
      ["Plan the CIDR first", "VPCs with overlapping CIDR blocks cannot be peered, and AWS recommends blocks that do not overlap with on-premises networks. An existing block cannot be resized. If addresses run out, associate a secondary CIDR block."],
      ["Subnets per tier", "A subnet lives in exactly one Availability Zone, so each tier needs a subnet in at least two zones. AWS reserves the first four addresses and the last one in every subnet, so a /27 leaves 27 usable addresses."],
      ["Where each tier goes", "A subnet is public only because its route table has a route to the internet gateway. Put the load balancer and NAT gateways in public subnets. Servers go in private subnets that route out through a NAT gateway, databases in subnets with only the local route."],
      ["Main route table", "A subnet you never associate with a route table uses the VPC's main route table. Leave the main table in its default, local-only state and associate each subnet explicitly with a custom table. Then no subnet becomes public by accident."],
      ["Most specific route wins", "A route table applies the most specific matching route (longest prefix match). A peering route for <code>10.50.0.0/16</code> therefore wins over <code>0.0.0.0/0</code>."],
      ["Outbound-only IPv6", "Outbound-only IPv6 uses an egress-only internet gateway. A NAT gateway does that job for IPv4."]
    ],
    trap: "An internet gateway is already horizontally scaled, redundant and highly available, so it needs no standby. A standard (zonal) NAT gateway, by contrast, works in a single Availability Zone, and a tier with a subnet in only one zone fails with that zone.",
    docs: [
      ["Subnets for your VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html"],
      ["Subnet route tables", "https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html"],
      ["Example: VPC with servers in private subnets and NAT", "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-example-private-subnets-nat.html"]
    ]
  },

  c3b: {
    why: "A server that is too big wastes money, and one of the wrong kind is slow however much you pay. The same server also costs very different amounts depending on what you promise in advance. This step is about choosing the instance that fits the workload and the cheapest way to pay for it.",
    k: [
      ["Instance family", "Pick it by the resource that runs out. Memory optimized (R) for large data sets held in memory. Compute optimized (C) for batch processing. Storage optimized (I) for heavy I/O on local storage. General purpose (M) for balance."],
      ["Burstable T instances", "Suit low average CPU with spikes. They earn CPU credits below their baseline and spend them above it. In standard mode an instance without credits drops to baseline. In unlimited mode it keeps bursting, and sustained extra use is billed."],
      ["Graviton", "Arm-based processors designed for the best price performance. Graviton instances need arm64 AMIs. Interpreted or run-time compiled languages usually run unchanged. Other software may have to be recompiled."],
      ["Compute Savings Plan", "The flexible commitment: 1 or 3 years, in dollars per hour. It applies across instance family, size and Region, and to Fargate and Lambda."],
      ["EC2 Instance Savings Plan", "Has the lowest prices but is tied to one instance family in one Region."],
      ["Spot Instances", "For stateless, fault-tolerant work. They use spare capacity at a steep discount and are interrupted with a two-minute warning. Be flexible about instance types and Availability Zones and use the <code>price-capacity-optimized</code> strategy."]
    ],
    trap: "A Savings Plan is a billing discount and reserves no capacity. To be sure instances can launch in a given Availability Zone, create an On-Demand Capacity Reservation. One for immediate use has no term commitment. Per-socket or per-core licences need Dedicated Hosts.",
    docs: [
      ["Amazon EC2 billing and purchasing options", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html"],
      ["Savings Plans types", "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html"],
      ["Burstable performance instances", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances.html"]
    ]
  },

  c3c: {
    why: "Servers in a three-tier application come and go, but the data must stay, and some of it must be seen by every server at once. A disk inside one server can do neither. So you choose storage by who has to reach the data and by how long it must live.",
    k: [
      ["EBS, EFS or S3", "Choose by who must reach the data. An EBS volume is block storage attached to an instance in the same Availability Zone. EFS is a file system that many Linux instances in several zones mount at once. S3 stores any amount of data as objects."],
      ["EBS snapshot", "The way to move EBS data. A volume persists independently of its instance but stays in its zone. Snapshots are incremental, stored in S3 and can be restored as a volume in any Availability Zone of the Region."],
      ["Instance store", "Ideal for buffers, caches and scratch data. It is disk physically attached to the host. Its data survives a reboot but is lost when the instance is stopped, hibernated or terminated."],
      ["EFS", "Grows and shrinks automatically and has one mount target per Availability Zone. The mount target's security group must allow NFS (TCP 2049) from the instances. Lifecycle management moves files not accessed for a set time to Infrequent Access."],
      ["S3 Lifecycle", "Rules have two kinds of action: transitions to another storage class and expirations that delete."],
      ["Standard-IA and One Zone-IA", "Both still give millisecond access. One Zone-IA data is not resilient to the loss of its Availability Zone."]
    ],
    trap: "Servers in an Auto Scaling group must not keep shared files on their own EBS volume or instance store: each instance sees only its own copy and a replacement starts without it. Shared files go to EFS, uploads and static assets to S3.",
    docs: [
      ["Storage options for your Amazon EC2 instances", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Storage.html"],
      ["How Amazon EFS works", "https://docs.aws.amazon.com/efs/latest/ug/how-it-works.html"],
      ["Managing the lifecycle of objects", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html"]
    ]
  },

  c3d: {
    why: "You cannot fix what you cannot see, and a group of servers is of little use if users still reach only one of them. CloudWatch collects the metrics and logs that show how the servers are doing, and raises an alarm when they go wrong. A load balancer gives users one address and sends each request to a healthy server.",
    k: [
      ["EC2 metrics", "EC2 sends metrics such as <code>CPUUtilization</code> to CloudWatch with no agent. Periods are 5 minutes by default and 1 minute with detailed monitoring. Status check metrics are always 1-minute. Memory and disk-space use come from the CloudWatch agent."],
      ["Alarms", "A metric alarm can notify an SNS topic or run an EC2 or Auto Scaling action. A composite alarm combines other alarms with Boolean logic to reduce noise. Example: notify only when both the CPU alarm and the memory alarm have triggered."],
      ["CloudWatch Logs", "Keeps log data indefinitely unless you set a retention period on the log group. A metric filter turns a pattern found in the logs into a CloudWatch metric that you can graph or set an alarm on."],
      ["ALB listener rules", "Let one load balancer serve several services. A listener evaluates its rules, for example on host name or path, in priority order and forwards to a target group."],
      ["ALB health checks", "Health checks are set per target group, and requests go only to healthy targets."],
      ["Where the ALB sits", "An Application Load Balancer must be enabled in at least two Availability Zones. It reaches targets on their private IP addresses, so the servers need no public IPs. They sit in private subnets and allow traffic from the load balancer's security group."]
    ],
    trap: "Detailed monitoring adds no memory or disk-space metrics: it only delivers the metrics EC2 already sends in 1-minute periods. An alarm on memory or free disk space first needs the CloudWatch agent on the instance.",
    docs: [
      ["Monitor your instances using CloudWatch", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch.html"],
      ["Composite alarms", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-combining.html"],
      ["How Elastic Load Balancing works", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"]
    ]
  },

  c3e: {
    why: "Load changes through the day, and servers fail. A fixed number of servers is either too many, which wastes money, or too few, which fails users. An Auto Scaling group keeps the right number running and replaces the ones that break.",
    k: [
      ["What the group guarantees", "It never goes below its minimum or above its maximum and replaces terminated or impaired instances. Across several Availability Zones it tries to spread instances evenly and can launch in another zone when one fails."],
      ["Target tracking", "The default choice. Choose a metric and a target value, such as 50% average CPU, and the group creates and manages the alarms. The metric must change in inverse proportion to capacity."],
      ["Scheduled actions", "Known dates use scheduled actions: the group changes its capacity at the times you set."],
      ["Health checks", "By default the group judges health by EC2 status checks, so an instance that runs with a hung application is kept. Turn on Elastic Load Balancing health checks so that an instance the load balancer reports as unhealthy is replaced."],
      ["Static stability", "The design for losing a zone. Run enough instances in each Availability Zone to carry the load if one zone is removed, instead of relying on launches during the failure. Needing 4 instances over 3 zones means 2 per zone."],
      ["Disposable instances", "Session state belongs in a store outside the instances, such as ElastiCache, and files in S3 or EFS. Sticky sessions bind a user's session to one target with a cookie, so that session is lost with the target."]
    ],
    trap: "Sticky sessions are a stopgap, not high availability. When the stem says any instance may be terminated without users noticing, move state out of the instance. One zonal component, such as a single NAT gateway or a Single-AZ database, undoes a multi-AZ web tier.",
    docs: [
      ["Target tracking scaling policies for Amazon EC2 Auto Scaling", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html"],
      ["About the health checks for your Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html"],
      ["REL11-BP05 Use static stability to prevent bimodal behavior", "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_withstand_component_failures_static_stability.html"]
    ]
  },

  c3f: {
    why: "The parts of a three-tier application were chosen one at a time. They only work as a system when every tier survives a failure and accepts traffic from nothing but the tier in front of it. This step puts the pieces together and ties each requirement to the one choice that meets it.",
    k: [
      ["The request path", "An internet-facing load balancer in public subnets, an Auto Scaling group of servers in private subnets, and a Multi-AZ database in subnets with no internet route. Every tier spans at least two Availability Zones."],
      ["Chained security groups", "The load balancer accepts client traffic. The servers accept traffic only from the load balancer's security group. The database accepts it only from the servers' security group. No rule then depends on instance IP addresses."],
      ["One requirement, one choice", "Survive a zone failure: every tier in two zones and a Multi-AZ database. Changing load: Auto Scaling with target tracking. Reports slowing the primary: a read replica, as a Multi-AZ DB instance standby serves no reads."],
      ["Internal load balancer", "A separate application tier is load balanced too. The web servers call it through an internal load balancer, whose nodes have only private IP addresses. Only the first load balancer is internet-facing."],
      ["DB subnet group", "RDS needs one with subnets in two Availability Zones. AWS advises this even for Single-AZ, so you can convert to Multi-AZ later."],
      ["Database failover", "On failover RDS repoints the instance's DNS record to the standby, so the endpoint name does not change."]
    ],
    trap: "More capacity is not more availability: a bigger instance, or more instances in the same Availability Zone, still fails with that zone, and a Multi-AZ DB instance adds no read capacity. Match the option to the stem's word: available, scalable or recoverable.",
    docs: [
      ["Example: VPC with servers in private subnets and NAT", "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-example-private-subnets-nat.html"],
      ["How Elastic Load Balancing works", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"],
      ["Multi-AZ DB instance deployments for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html"]
    ]
  },

  l3a: {
    why: "A page made of static files cannot save or look up anything by itself. It needs a backend, but that backend does not have to be a server you run. The lab joins a bucket, an API, a function and a table. Doing it by hand shows where to look when one of the joints does not work.",
    k: [
      ["Static and dynamic parts", "S3 static website hosting serves static content and client-side scripts only. Anything dynamic happens when the script in the browser calls an API. The lab pairs the bucket with API Gateway, Lambda and DynamoDB for that part."],
      ["Lambda logs", "Start troubleshooting a function here. Lambda sends the logs of every invocation to CloudWatch Logs, by default to the log group <code>/aws/lambda/&lt;function-name&gt;</code>, provided the execution role has the permissions."],
      ["Permission to invoke", "API Gateway gets permission to invoke a function from the function's resource-based policy, or from an IAM role it assumes."],
      ["502 Bad Gateway", "With Lambda proxy integration the function must return the expected format. Any other output makes API Gateway answer 502 Bad Gateway."],
      ["Redeploy", "Every change to a REST API must be redeployed to a stage before callers see it."],
      ["CORS", "A page that calls an API on a different domain makes a cross-origin request. The API must then return an <code>Access-Control-Allow-Origin</code> header."]
    ],
    trap: "An S3 website endpoint does not support HTTPS. HTTPS for a static site means CloudFront in front of the bucket, or Amplify Hosting, which AWS now recommends for static sites. It is not a setting on the website endpoint.",
    docs: [
      ["Hosting a static website using Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html"],
      ["Sending Lambda Event Function logs to CloudWatch Logs", "https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html"],
      ["CORS for REST APIs in API Gateway", "https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html"]
    ]
  },

  l3b: {
    why: "If every server in a VPC may talk to every other one, a single web server that is broken into opens the way to the database. Each tier should accept traffic only from the tier in front of it. The lab builds that with security groups and network ACLs, and shows where the two behave differently.",
    k: [
      ["One group per tier", "Give each tier its own security group and let it accept traffic only from the security group of the tier in front. A rule that references a security group covers the network interfaces of every instance in that group, whatever their addresses."],
      ["Stateful or stateless", "Security groups are stateful and hold allow rules only, so replies to allowed traffic always pass. Network ACLs are stateless and work at the subnet level. Return traffic must be allowed explicitly, including the ephemeral reply ports."],
      ["Blocking an address range", "Network ACL rules are evaluated from the lowest number, and the first match applies. Add a deny rule with a lower number than the allow rule it must beat. A security group cannot deny."],
      ["Defaults", "The default network ACL allows all traffic in and out, while a new custom one blocks everything until you add rules. A new security group has no inbound rules and one outbound rule that allows all traffic."]
    ],
    trap: "When only the web tier may reach the database, the expected answer is an inbound rule on the database's security group whose source is the web tier's security group, not a rule on IP addresses that change as instances are replaced.",
    docs: [
      ["Infrastructure security in Amazon VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html"],
      ["Security group rules", "https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html"],
      ["Network ACL rules", "https://docs.aws.amazon.com/vpc/latest/userguide/nacl-rules.html"]
    ]
  },

  l3c: {
    why: "Reading about a highly available design is not the same as getting one to work. Building each tier across two zones by hand shows what every tier needs before it can survive a failure. It also shows what to check when one piece cannot reach the next.",
    k: [
      ["Database tier", "A Multi-AZ DB instance keeps a synchronous standby in another Availability Zone. It fails over automatically by repointing the instance's DNS record, so the application keeps its endpoint. The DB subnet group must cover two zones."],
      ["Shared storage tier", "EFS gives the web servers in every zone the same NFS file system through a mount target in each zone. If a mount times out, check that the mount target's security group allows inbound TCP 2049 from the servers."],
      ["Web tier", "An Auto Scaling group across the same Availability Zones as the load balancer. A target in a zone that is not enabled on an Application Load Balancer shows as <code>unused</code> and receives no requests."],
      ["Network from a template", "The network comes from a CloudFormation template. A stack is a collection of resources created, updated and deleted as a single unit. Deleting the stack deletes its resources, except those a deletion policy retains."]
    ],
    docs: [
      ["Multi-AZ DB instance deployments for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html"],
      ["How Amazon EFS works", "https://docs.aws.amazon.com/efs/latest/ug/how-it-works.html"],
      ["Health checks for Application Load Balancer target groups", "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html"]
    ]
  }
});
