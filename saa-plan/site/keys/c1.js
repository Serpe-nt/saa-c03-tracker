// Key points per plan step for the course "Fundamentals of Architecting on AWS" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c1a: {
    why: "Many different designs can run the same application. They differ in how safe, how reliable, how fast and how expensive they are, so an architect needs a shared way to judge them. The AWS Well-Architected Framework is that yardstick, and the exam asks you to design by it.",
    k: [
      ["What the exam scores", "The exam guide makes the architect's job the scope: design solutions based on the Well-Architected Framework. They must be secure (30% of the score), resilient (26%), high-performing (24%) and cost-optimized (20%)."],
      ["Trading pillars off", "Business context decides which pillar gives way. A development environment may give up reliability to cut cost. A mission-critical system pays more for reliability. Security and operational excellence are generally not traded off."],
      ["What the cloud changes", "The starting assumptions differ from a data center. You trade fixed expense for variable expense. You stop guessing capacity, because you can scale within minutes. You stop running data centers and can go global in minutes."],
      ["General design principles", "The framework's rules for any design: stop guessing capacity needs, test at production scale, automate, let the architecture evolve, drive decisions with data, and rehearse failures in game days."],
      ["Managed services", "Reach for them when a stem asks for the least operational overhead. They remove the burden of running servers, operating systems and applications. 'Use managed services' is a design principle of the framework."]
    ],
    trap: "The exam guide says wrong options are plausible responses that match the content area, so several will look workable. The qualifier in the stem decides: MOST cost-effective, LEAST operational overhead. Find it before you read the options.",
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["General design principles (Well-Architected Framework)", "https://docs.aws.amazon.com/wellarchitected/latest/framework/general-design-principles.html"],
      ["Six advantages of cloud computing", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html"]
    ]
  },

  c1b: {
    why: "A long list of best practices is hard to use until it is sorted by the goal each practice serves. The framework sorts them into pillars, one per goal. The Well-Architected Tool then lets you check one of your own workloads against them.",
    k: [
      ["Operations and reliability", "Match a practice to its pillar by the design principles. Operational excellence: frequent, small, reversible changes and learning from all operational events. Reliability: automatic recovery from failure, tested recovery procedures, horizontal scaling."],
      ["Performance and cost", "Performance efficiency: go global in minutes, use serverless architectures, experiment more often. Cost optimization: adopt a consumption model, analyze and attribute expenditure."],
      ["Security", "Its design principles: a strong identity foundation, traceability, and keeping people away from data."],
      ["Sustainability", "The sixth pillar is about environmental impact. Understand your impact, maximize utilization, and adopt more efficient hardware, software and managed services."],
      ["Well-Architected Tool", "A guided self-review of one workload. You answer the framework's questions pillar by pillar. It records high and medium risk issues with an improvement plan. A milestone saves the state at a point in time."],
      ["Lens", "A set of questions and best practices. The Well-Architected Framework lens is applied to every workload automatically. AWS maintains more in the Lens Catalog. A custom lens holds your own questions."]
    ],
    trap: "One practice can sound like two pillars, so decide by the stated goal. Switching off idle servers to cut the bill is cost optimization. To cut emissions, it is sustainability. The Well-Architected Tool asks you questions. Trusted Advisor inspects your environment.",
    docs: [
      ["The pillars of the framework", "https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html"],
      ["What is AWS Well-Architected Tool?", "https://docs.aws.amazon.com/wellarchitected/latest/userguide/tool.html"],
      ["AWS Trusted Advisor", "https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html"]
    ]
  },

  c1c: {
    why: "One data center can burn, flood or lose power, and users far away from it wait longer for every answer. AWS spreads its infrastructure over Regions, Availability Zones and edge locations, so you choose where your systems run and which failures they survive. The shared responsibility model then says which part of the security is yours.",
    k: [
      ["Region", "You choose a Region to be close to your users or to meet legal requirements. That is how a data residency rule is met. Regions are isolated from each other, and AWS does not replicate your resources across Regions automatically."],
      ["Availability Zone", "You spread a workload over AZs. Each is one or more discrete data centers with redundant power, networking and connectivity. Every Region has at least three, physically separate but within 100 km of each other, linked well enough for synchronous replication."],
      ["Scope of a resource", "Know where each resource lives. A subnet and an EBS volume live in one AZ. A VPC can span the AZs of its Region. An AMI is Region-specific, so you copy it to another Region before launching there."],
      ["Edge locations", "A separate network for content delivery. CloudFront serves each request from the edge location with the lowest latency. It fetches from the origin, such as an S3 bucket, only when the content is not already there."],
      ["Shared responsibility", "Who secures what. AWS secures the cloud itself, from the host operating system and virtualization layer down to the facilities. You secure what you run in it: guest operating system, applications, security groups, data and permissions."]
    ],
    trap: "Three ways to run instances closer than a Region: a Local Zone (an extension of a Region near a large population center), AWS Outposts (AWS-managed capacity at your own site) and a Wavelength Zone (in a carrier's 5G network). An edge location is none of them.",
    docs: [
      ["Regions and Zones", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"],
      ["AWS Regions and Availability Zones", "https://aws.amazon.com/about-aws/global-infrastructure/regions_az/"],
      ["Shared responsibility model", "https://aws.amazon.com/compliance/shared-responsibility-model/"]
    ]
  },

  c1d: {
    why: "Some of your servers must be reachable from the internet and others must never be. Amazon VPC gives you a logically isolated virtual network that you define yourself, much like the network in your own data center. Subnets, route tables and firewalls are the tools for drawing those lines.",
    k: [
      ["VPC and subnets", "A VPC can span the Availability Zones of its Region. Each subnet sits entirely in one AZ. The VPC's IPv4 range is between /16 and /28. Pick one that overlaps no VPC you will peer with."],
      ["Public or private", "A subnet is public when its route table has a route to an internet gateway, and private when it has none. To be reached from the internet over IPv4, an instance needs that route and a public IPv4 address."],
      ["Internet gateway", "Connects a VPC to the internet. It is horizontally scaled, redundant and highly available, so it needs no standby."],
      ["NAT gateway", "Lets instances in a private subnet connect out, while external services cannot start a connection to them."],
      ["Security group", "The firewall of an instance. Stateful, with allow rules only. A rule can name another security group as its source: that is how only the web tier is let through to the database tier."],
      ["Network ACL", "The firewall of a subnet. Stateless, with numbered allow and deny rules that are checked in ascending order until one matches."]
    ],
    trap: "A subnet is not public because of its name or because its instances have public IP addresses: without a route to an internet gateway they cannot communicate with the internet. A NAT gateway gives a private subnet outbound access only.",
    docs: [
      ["Subnets for your VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html"],
      ["Enable internet access for a VPC using an internet gateway", "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html"],
      ["Compare security groups and network ACLs", "https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html"]
    ]
  },

  c1e: {
    why: "An application needs something to run on, and applications differ. One needs a whole server that you control. Another runs briefly when an event arrives. AWS offers several ways to run code, from EC2 instances to Lambda functions and containers, and several ways to pay for them.",
    k: [
      ["Instance family", "Pick it by the resource that runs short. C is compute optimized, R and X are memory optimized, I and D are storage optimized. P and G carry GPUs, M is general purpose, and T is burstable for low average CPU with spikes."],
      ["Purchasing option", "Read the workload pattern. Steady for one or three years means Savings Plans or Reserved Instances. Short-term irregular work that cannot be interrupted means On-Demand. Work that can be interrupted means Spot Instances on spare capacity."],
      ["User data and AMI", "Two ways to set up an instance. User data is a script that runs when the instance first boots, and whatever it installs adds to the boot time. An AMI made from a configured instance launches instances with the same configuration. AMIs are Region-specific."],
      ["Lambda", "Runs code in response to events with no servers to manage. A standard function runs up to 15 minutes per invocation."],
      ["Fargate", "Runs containers without instances to manage. It works for ECS and for EKS, which is managed Kubernetes."],
      ["Elastic Beanstalk", "Takes your application and provisions what it needs in your account: EC2 instances (or an EKS cluster in Cluster mode), load balancing, health monitoring and scaling. You keep full control of those resources and pay only for them."]
    ],
    trap: "Two pairs get swapped. Dedicated Hosts show sockets and physical cores for per-socket or per-core licences. Dedicated Instances only keep other accounts off the hardware. Savings Plans commit to an hourly spend, Reserved Instances to an instance configuration.",
    docs: [
      ["Amazon EC2 instance type naming conventions", "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html"],
      ["Amazon EC2 billing and purchasing options", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html"],
      ["What is AWS Elastic Beanstalk?", "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html"]
    ]
  },

  c1f: {
    why: "Data comes in different shapes. A disk for one server, files shared by many servers, objects such as pictures and backups, rows in tables, items looked up by a key. No single store is good at all of them. AWS has a storage service and a database for each shape, so the first question is always which shape you have.",
    k: [
      ["Block, file, object", "Three kinds of storage. Block: an EBS volume attached to an instance in the same AZ. File: an EFS file system shared by many Linux instances. Object: S3, where S3 Standard stores objects redundantly across at least three AZs."],
      ["EBS or instance store", "An EBS volume persists independently of its instance, and a snapshot carries its data to another AZ. Instance store sits on disks physically attached to the host. Its data survives a reboot but is lost on stop, hibernate or terminate."],
      ["RDS and Aurora", "Relational databases that AWS runs for you. RDS runs Db2, MariaDB, SQL Server, MySQL, Oracle and PostgreSQL. It manages backups, software patching, automatic failure detection and recovery. Aurora is a relational engine compatible with MySQL and PostgreSQL."],
      ["DynamoDB", "A serverless NoSQL database for key-value and document data, with single-digit millisecond performance at any scale. An item is limited to 400 KB, so a large object goes to S3 and the item stores its identifier."],
      ["Purpose-built databases", "One per data model. Redshift is the data warehouse, ElastiCache the in-memory cache and Neptune the graph database. DocumentDB runs MongoDB workloads and Keyspaces runs Cassandra workloads. OpenSearch Service does search and log analytics."]
    ],
    trap: "The engine or data model named in the stem decides. Keeping SQL Server or Oracle rules out Aurora. MongoDB-compatible means DocumentDB, not DynamoDB. Ad hoc queries over normalized tables point to a relational engine, web-scale key access to DynamoDB.",
    docs: [
      ["Storage options for your Amazon EC2 instances", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Storage.html"],
      ["What is Amazon RDS?", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html"],
      ["What is Amazon DynamoDB?", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html"]
    ]
  },

  l1a: {
    why: "A website made only of files does not need a web server that you patch and keep running. Amazon S3 can serve the files itself. Building it by hand shows which settings make a bucket public and what the website endpoint cannot do.",
    k: [
      ["What it can serve", "Static content, which may include client-side scripts. The website endpoint supports only GET and HEAD requests on objects. A form that saves data therefore needs its own backend, such as API Gateway with Lambda."],
      ["Making it public", "A public website endpoint needs three things: static website hosting enabled with an index document, Block Public Access turned off for the bucket, and a bucket policy that grants public read access."],
      ["HTTPS", "The website endpoint does not support HTTPS. For HTTPS use AWS Amplify Hosting, the option AWS recommends, or put a CloudFront distribution in front. An ACM certificate for CloudFront must be requested in us-east-1."],
      ["Why it is more reliable", "Compared with one web server, there is no server to run. S3 Standard stores each object redundantly across at least three Availability Zones. It is designed for 99.999999999% durability and 99.99% availability."]
    ],
    trap: "No setting turns on HTTPS for an S3 website endpoint, so that option is always wrong. And making a bucket public is a customer decision: if data leaks from it, that is the customer's side of the shared responsibility model.",
    docs: [
      ["Hosting a static website using Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html"],
      ["Website endpoints", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html"],
      ["Setting permissions for website access", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html"]
    ]
  },

  l1b: {
    why: "An application that runs in one data center stops when that data center fails. Running copies in two Availability Zones removes that single point of failure. It only works if traffic is spread over them and enough capacity is left when one zone is gone. The lab makes you place each piece in a zone yourself.",
    k: [
      ["A subnet picks the zone", "You pick an Availability Zone by picking a subnet, because each subnet resides entirely within one AZ. Running in two AZs therefore takes at least two subnets."],
      ["Load balancer", "Instances in two AZs become one highly available application only when something spreads the traffic. Elastic Load Balancing distributes incoming traffic across targets in one or more AZs and routes only to the healthy ones."],
      ["Size for losing a zone", "The remaining AZs must carry the whole load. Needing 4 instances means 2 in each of three AZs (6 in total) or 4 in each of two (8 in total). Three AZs therefore need less spare capacity."],
      ["EBS stays in its zone", "An EBS volume and the instance it attaches to must be in the same AZ, so a volume cannot follow you to the other AZ. A snapshot can: it is restorable as a new volume in any AZ of the Region."]
    ],
    trap: "A larger instance type, a cluster placement group or daily snapshots do not survive an AZ outage. The first two stay inside one AZ and snapshots only help you rebuild afterwards. Only instances already running in a second AZ keep serving.",
    docs: [
      ["Regions and Zones", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"],
      ["What is Elastic Load Balancing?", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html"],
      ["Subnets for your VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html"]
    ]
  },

  l1c: {
    why: "A network that is planned badly is hard to repair later: addresses run out, or a server that should be reachable is not. Building a VPC by hand shows how the address ranges, the route tables and the two firewalls each decide whether a packet arrives.",
    k: [
      ["CIDR arithmetic", "A /24 holds 256 addresses and a /28 holds 16, the smallest subnet AWS allows. AWS reserves the first four addresses and the last one in every subnet. A /24 therefore leaves 251 for your resources and a /28 leaves 11."],
      ["Route tables", "Every route table contains a local route for traffic inside the VPC. The most specific matching route wins (longest prefix match). A subnet you have not explicitly associated with a route table uses the main route table."],
      ["Firewall defaults", "The defaults differ. A new security group has no inbound rules and allows all outbound traffic. The VPC's default network ACL allows all traffic in and out. In any network ACL a packet that matches no numbered rule is denied."],
      ["Internet access checklist", "Several things are needed at once: an internet gateway attached to the VPC, a route to it in the subnet's route table, a public IPv4 address on the instance, and security group and network ACL rules that allow the traffic."]
    ],
    trap: "Plan address ranges before you build. The size of an existing VPC CIDR block cannot be increased or decreased (you can only associate additional blocks), and VPCs with matching or overlapping CIDR blocks cannot be peered.",
    docs: [
      ["Subnet CIDR blocks", "https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html"],
      ["Subnet route tables", "https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html"],
      ["Security group rules", "https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html"]
    ]
  },

  l1d: {
    why: "A server that turns out to be too small has to be made bigger, and you have to get into it to operate it. Doing both by hand shows what a stop and start costs you, and what each way of connecting needs before it works.",
    k: [
      ["Changing the type", "Changing the instance type means downtime. You must stop an EBS-backed instance, change the type and start it again. The EBS volumes and their data are kept."],
      ["What a stop and start loses", "The contents of RAM, instance store data and the auto-assigned public IPv4 address are lost. EBS volumes, private IPv4 addresses and associated Elastic IP addresses persist."],
      ["Reading a type name", "Read a name such as <code>m7g.large</code> left to right: the series (M, general purpose), the generation (7), option letters (g for Graviton processors) and, after the dot, the size. Pick the series by the resource that runs short."],
      ["SSH and Instance Connect", "An SSH client needs an inbound rule and a key pair. EC2 Instance Connect needs the inbound rule and IAM permissions, but no key pair."],
      ["Session Manager", "The way in that needs no inbound rule. It needs IAM permissions, an instance profile role and the SSM Agent."]
    ],
    trap: "A bigger instance type is vertical scaling: it costs downtime and still leaves one instance to fail. The reliability pillar prefers several small resources to one large one. More memory comes from the instance type, never from a larger EBS volume.",
    docs: [
      ["Change the instance type for your Amazon EC2 instance", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/change-instance-type-of-ebs-backed-instance.html"],
      ["How EC2 instance stop and start works", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-stop-start-works.html"],
      ["Connect to your EC2 instance", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect.html"]
    ]
  },

  l1e: {
    why: "A database is the part of a system that hurts most to lose and takes the most work to run. Amazon RDS takes over much of that work. Its two kinds of copies answer two different needs: staying up when a zone fails, and serving more reads. The lab shows which copy does which job.",
    k: [
      ["Multi-AZ DB instance", "Keeps the database available. RDS keeps a synchronous standby in another AZ. On a failure it switches over automatically and repoints the instance's DNS record, typically in 60 to 120 seconds. That standby cannot serve read traffic."],
      ["Read replica", "Takes load off the primary, but only when the application routes queries to it. It is a read-only copy that RDS updates asynchronously. It can be promoted to a standalone DB instance. Its source needs automatic backups enabled."],
      ["Managed or self-hosted", "For a database on EC2 you do the OS and database patching, backups, high availability and scaling yourself. On RDS AWS does all of these. Application optimization and query tuning stay with you."],
      ["AWS DMS", "Migrates a database while the source stays fully operational. A full load copies the existing data. Change data capture then applies ongoing changes until you switch over. A different target engine also needs schema conversion."]
    ],
    trap: "RDS copies every change to the Multi-AZ standby and to read replicas, an accidental <code>DELETE</code> included. Failing over or promoting a replica therefore does not bring the rows back. A point-in-time restore does, and it always creates a new DB instance.",
    docs: [
      ["Multi-AZ DB instance deployments for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html"],
      ["Working with DB instance read replicas", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html"],
      ["What is AWS Database Migration Service?", "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html"]
    ]
  }
});
