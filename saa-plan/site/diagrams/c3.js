// DATA ONLY: the diagram for lecture course 3 and its labs (format: site/diagram.js, rules: docs/diagrams.md).
window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.c3 = {
  title: "A three-tier web application across two Availability Zones",
  why: "A web application has to keep working when one data center fails, and the internet must never reach its servers or its data directly. So each tier gets its own subnets in two zones. Only the load balancer in the public subnets faces the internet, the servers run in an Auto Scaling group in private subnets, and the database sits in subnets with no internet route.",
  w: 20, h: 11.8,
  areas: [
    { id: "region", label: "Region", x: 0.2, y: 1.4, w: 19.6, h: 10.15 },
    { id: "vpc", label: "VPC 10.0.0.0/16", x: 0.4, y: 2.1, w: 14.4, h: 9.25 },
    { id: "az-a", label: "Availability Zone A", x: 0.6, y: 2.75, w: 6.6, h: 8.4, dash: true },
    { id: "az-b", label: "Availability Zone B", x: 7.9, y: 2.75, w: 6.6, h: 8.4, dash: true },
    { id: "pub-a", label: "Public subnet", x: 0.8, y: 3.3, w: 6.2, h: 2.15, kind: "public" },
    { id: "pub-b", label: "Public subnet", x: 8.1, y: 3.3, w: 6.2, h: 2.15, kind: "public" },
    { id: "asg", label: "Auto Scaling group", x: 0.7, y: 5.75, w: 13.7, h: 2.6, dash: true },
    { id: "priv-a", label: "Private subnet", x: 0.8, y: 6.3, w: 6.2, h: 1.85, kind: "private" },
    { id: "priv-b", label: "Private subnet", x: 8.1, y: 6.3, w: 6.2, h: 1.85, kind: "private" },
    { id: "data-a", label: "Database subnet", x: 0.8, y: 8.75, w: 6.2, h: 2.1, kind: "private" },
    { id: "data-b", label: "Database subnet", x: 8.1, y: 8.75, w: 6.2, h: 2.1, kind: "private" }
  ],
  nodes: [
    { id: "users", label: "Users", x: 6.25, y: 0.2, w: 2.6, h: 0.9 },
    { id: "igw", label: "Internet gateway", x: 5.95, y: 1.65, w: 3.2, h: 0.9 },
    { id: "nat-a", label: "NAT gateway", x: 1.1, y: 4.1, w: 2.8, h: 1.0 },
    { id: "alb", label: "Application Load Balancer", x: 4.6, y: 4.1, w: 5.9, h: 1.0 },
    { id: "nat-b", label: "NAT gateway", x: 11.2, y: 4.1, w: 2.8, h: 1.0 },
    { id: "app-a", label: "App server (EC2)", x: 3.6, y: 6.6, w: 3.3, h: 1.1 },
    { id: "app-b", label: "App server (EC2)", x: 10.7, y: 6.6, w: 3.3, h: 1.1 },
    { id: "db-a", label: "RDS primary", x: 3.6, y: 9.5, w: 3.3, h: 1.1 },
    { id: "db-b", label: "RDS standby", x: 10.7, y: 9.5, w: 3.3, h: 1.1 },
    { id: "s3", label: "Amazon S3", x: 15.4, y: 3.3, w: 4.0, h: 1.1 },
    { id: "efs", label: "Amazon EFS", x: 15.4, y: 6.6, w: 4.0, h: 1.1 },
    { id: "cw", label: "CloudWatch", x: 15.4, y: 9.5, w: 4.0, h: 1.1 }
  ],
  links: [
    ["users", "igw"],
    ["igw", "alb"],
    ["alb", "app-a"],
    ["alb", "app-b"],
    ["app-a", "nat-a"],
    ["app-b", "nat-b"],
    ["app-a", "db-a"],
    ["db-a", "db-b", "sync copy"],
    ["app-b", "efs", "NFS"],
    ["app-b", "s3"],
    ["cw", "asg"]
  ],
  parts: {
    vpc: {
      name: "VPC and its address plan",
      why: "Addresses that run out or overlap are hard to fix once servers run. So the VPC's CIDR block is planned first, with room for a subnet per tier in each zone.",
      k: [
        ["No overlap", "VPCs with overlapping CIDR blocks cannot be peered. AWS recommends blocks that do not overlap with your on-premises networks."],
        ["Cannot resize", "An existing block cannot be resized. If addresses run out, associate a secondary CIDR block."],
        ["Reserved addresses", "AWS reserves the first four addresses and the last one in every subnet, so a /27 leaves 27 usable addresses."]
      ],
      tags: ["VPC & subnets"]
    },
    "pub-a": {
      name: "Public subnet",
      why: "Only the entry points should face the internet. A subnet is public only because its route table has a route to the internet gateway. So the load balancer and the NAT gateways go here, and the servers do not.",
      k: [
        ["Main route table", "A subnet you never associate with a route table uses the main one. Leave it local-only and associate each subnet with a custom table, so none becomes public by accident."],
        ["Most specific route wins", "A route table applies the longest prefix match, so a route for <code>10.50.0.0/16</code> wins over <code>0.0.0.0/0</code>."],
        ["Internet gateway", "Already horizontally scaled, redundant and highly available, so it needs no standby."]
      ],
      tags: ["VPC & subnets", "Internet & NAT gateways"]
    },
    alb: {
      name: "Application Load Balancer",
      why: "Users need one address, and each request should reach a healthy server in either zone. The internet-facing load balancer gives them that address and forwards requests to its target group.",
      k: [
        ["Listener rules", "One load balancer can serve several services. A listener evaluates its rules, for example on host name or path, in priority order and forwards to a target group."],
        ["Health checks", "Set per target group. Requests go only to healthy targets."],
        ["Internal load balancer", "When the web and application tiers run on separate servers, the application tier is load balanced too. The web servers call it through an internal load balancer, whose nodes have only private IP addresses."]
      ],
      trap: "An Application Load Balancer must be enabled in at least two zones. A target in a zone that is not enabled on it shows as <code>unused</code> and receives no requests, so the Auto Scaling group uses the same zones.",
      tags: ["Load balancing"]
    },
    "nat-a": {
      name: "NAT gateway in each zone",
      why: "The servers in private subnets still have to connect out, while nothing outside may connect in. Each private subnet routes outbound traffic through a NAT gateway in a public subnet.",
      k: [
        ["One per zone", "A zonal NAT gateway works in a single zone. It is a single point of failure for outbound traffic from every zone that routes to it, so each zone gets its own, with its own private route table."],
        ["Regional mode", "A regional NAT gateway is one resource that expands across zones by itself and needs no public subnet."],
        ["IPv6", "Outbound-only IPv6 uses an egress-only internet gateway. A NAT gateway does that job for IPv4."]
      ],
      trap: "One zonal component, such as a single NAT gateway or a Single-AZ database, undoes a multi-AZ web tier.",
      tags: ["Internet & NAT gateways", "High availability design"]
    },
    asg: {
      name: "Auto Scaling group",
      why: "Load changes through the day, and servers fail. A fixed number of servers is either too many or too few. An Auto Scaling group stays between its minimum and maximum, tries to spread servers evenly over the zones and replaces the ones that break.",
      k: [
        ["Target tracking", "The default choice. Pick a metric and a target value, such as 50% average CPU, and the group creates and manages the alarms."],
        ["Health checks", "By default the group uses EC2 status checks, so a server with a hung application is kept. Turn on Elastic Load Balancing health checks to have it replaced."],
        ["Static stability", "Run enough servers in each zone to carry the load if one zone is lost, instead of relying on launches during the failure."]
      ],
      trap: "Sticky sessions are a stopgap: the session is lost with its target. When any server may be terminated without users noticing, keep session state outside the servers, for example in ElastiCache.",
      tags: ["Auto Scaling", "High availability design"]
    },
    "app-a": {
      name: "App server (EC2)",
      why: "A server that is too big wastes money, and one of the wrong kind is slow however much you pay. Each server is an EC2 instance chosen by the resource that runs out, and paid for in the cheapest way that fits.",
      k: [
        ["Instance family", "Memory optimized (R) for large data sets held in memory. Compute optimized (C) for batch processing. General purpose (M) for balance."],
        ["Paying for it", "A Compute Savings Plan applies across instance family, size and Region. Spot Instances suit stateless, fault-tolerant work and come with a two-minute interruption warning."],
        ["Disposable", "Keep nothing on the server that a replacement needs. Shared files go to EFS, uploads and static assets to S3."]
      ],
      trap: "A Savings Plan is a billing discount and reserves no capacity. To be sure instances can launch in a given zone, create an On-Demand Capacity Reservation.",
      tags: ["EC2 instance types", "EC2 purchase options"]
    },
    "data-a": {
      name: "Database subnet",
      why: "The database holds the data that hurts most to lose, so nothing on the internet should have a path to it. Its subnets have only the local route, and its security group admits only the servers.",
      k: [
        ["Chained security groups", "The load balancer accepts client traffic. The servers accept traffic only from the load balancer's security group, and the database only from the servers' security group."],
        ["DB subnet group", "RDS needs one with subnets in two zones. AWS advises this even for Single-AZ, so you can convert to Multi-AZ later."],
        ["Network ACLs", "A second, stateless layer at the subnet level. Return traffic, including the ephemeral reply ports, must be allowed explicitly."]
      ],
      trap: "When only the servers may reach the database, the answer is an inbound rule on the database's security group whose source is the servers' security group. A rule on IP addresses breaks as instances are replaced.",
      tags: ["Security groups & NACLs", "VPC & subnets"]
    },
    "db-a": {
      name: "RDS Multi-AZ database",
      why: "A database that runs in one zone fails with that zone. A Multi-AZ DB instance keeps a synchronous standby in another zone and fails over to it automatically.",
      k: [
        ["Same endpoint", "On failover RDS repoints the instance's DNS record to the standby, so the endpoint name does not change and the servers keep using it."],
        ["Reads", "The standby of a Multi-AZ DB instance serves no reads. When reports slow the primary, add a read replica."]
      ],
      trap: "More capacity is not more availability. A bigger instance, or more instances in the same zone, still fails with that zone, and a Multi-AZ DB instance adds no read capacity.",
      tags: ["RDS", "High availability design"]
    },
    efs: {
      name: "Amazon EFS",
      why: "Servers that come and go cannot keep shared files on their own disks: each would see only its own copy, and a replacement starts without it. EFS is a file system that many Linux instances in several zones mount at once.",
      k: [
        ["Mount targets", "One per zone. Its security group must allow NFS (TCP 2049) from the servers. If a mount times out, check that rule first."],
        ["Grows by itself", "It grows and shrinks automatically. Lifecycle management moves files not accessed for a set time to Infrequent Access."],
        ["Not EBS", "An EBS volume is block storage attached to an instance in the same zone. EFS is shared by many instances across zones."]
      ],
      tags: ["EFS", "EBS & instance store"]
    },
    s3: {
      name: "S3 for uploads and static assets",
      why: "Uploads and static files must outlive any server and look the same to every user. S3 stores any amount of data as objects, outside the servers.",
      k: [
        ["Lifecycle rules", "Two kinds of action: transitions move objects to another storage class, expirations delete them."],
        ["Infrequent Access", "Standard-IA and One Zone-IA still give millisecond access. One Zone-IA data is not resilient to the loss of its zone."]
      ],
      tags: ["S3 storage classes & lifecycle"]
    },
    cw: {
      name: "CloudWatch",
      why: "You cannot fix what you cannot see. CloudWatch collects the metrics and logs that show how the servers are doing, and its alarms notify people or scale the group.",
      k: [
        ["EC2 metrics", "EC2 sends metrics such as <code>CPUUtilization</code> with no agent: every 5 minutes by default, every minute with detailed monitoring."],
        ["Alarms", "A metric alarm can notify an SNS topic or run an EC2 or Auto Scaling action. A composite alarm combines other alarms with Boolean logic to reduce noise."],
        ["Logs", "A log group keeps data indefinitely unless you set a retention period. A metric filter turns a pattern in the logs into a metric you can alarm on."]
      ],
      trap: "Detailed monitoring adds no memory or disk-space metrics. It only sends the EC2 metrics every minute. An alarm on memory or free disk space first needs the CloudWatch agent.",
      tags: ["CloudWatch"]
    }
  }
};
