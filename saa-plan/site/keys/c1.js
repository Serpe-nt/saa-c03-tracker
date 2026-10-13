// Key points per plan step for the course "Fundamentals of Architecting on AWS" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c1a: {
    k: [
      "The exam guide makes the architect's job the scope of the exam: design solutions based on the Well-Architected Framework that are secure (30% of the score), resilient (26%), high-performing (24%) and cost-optimized (20%).",
      "Pillars are traded off by business context: a development environment may give up reliability to cut cost, a mission-critical system pays more for reliability. Security and operational excellence are generally not traded off.",
      "The cloud changes the starting assumptions: you trade fixed expense for variable expense, stop guessing capacity because you can scale within minutes, stop running data centers, and can go global in minutes.",
      "The framework's general design principles: stop guessing capacity needs, test at production scale, automate, let the architecture evolve, drive decisions with data, and rehearse failures in game days.",
      "Managed services remove the operational burden of running servers, operating systems and applications. 'Use managed services' is a design principle of the framework, which is why they fit a stem that asks for the least operational overhead."
    ],
    trap: "The exam guide says wrong options are plausible responses that match the content area, so several will look workable. The qualifier in the stem decides: MOST cost-effective, LEAST operational overhead. Find it before you read the options.",
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["General design principles (Well-Architected Framework)", "https://docs.aws.amazon.com/wellarchitected/latest/framework/general-design-principles.html"],
      ["Six advantages of cloud computing", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html"]
    ]
  },

  c1b: {
    k: [
      "Match a practice to its pillar by the design principles. Operational excellence: frequent, small, reversible changes and learning from all operational events. Reliability: automatic recovery from failure, tested recovery procedures, horizontal scaling.",
      "Performance efficiency: go global in minutes, use serverless architectures, experiment more often. Cost optimization: adopt a consumption model, analyze and attribute expenditure. Security: strong identity foundation, traceability, keep people away from data.",
      "Sustainability, the sixth pillar, is about environmental impact: understand your impact, maximize utilization, and adopt more efficient hardware, software and managed services.",
      "The AWS Well-Architected Tool is a guided self-review of one workload. You answer the framework's questions pillar by pillar; it records high and medium risk issues with an improvement plan, and a milestone saves the state at a point in time.",
      "A lens is a set of questions and best practices. The Well-Architected Framework lens is applied to every workload automatically, AWS maintains more in the Lens Catalog, and a custom lens holds your own questions."
    ],
    trap: "One practice can sound like two pillars, so decide by the stated goal: switching off idle servers to cut the bill is cost optimization, to cut emissions is sustainability. The Well-Architected Tool asks you questions; Trusted Advisor inspects your environment.",
    docs: [
      ["The pillars of the framework", "https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html"],
      ["What is AWS Well-Architected Tool?", "https://docs.aws.amazon.com/wellarchitected/latest/userguide/tool.html"],
      ["AWS Trusted Advisor", "https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html"]
    ]
  },

  c1c: {
    k: [
      "Regions are isolated from each other, and AWS does not replicate your resources across Regions automatically. You choose a Region to be close to your users or to meet legal requirements, which is how a data residency rule is met.",
      "An Availability Zone is one or more discrete data centers with redundant power, networking and connectivity. Every Region has at least three, physically separate but within 100 km of each other, linked well enough for synchronous replication.",
      "Know each resource's scope: a subnet and an EBS volume live in one AZ, a VPC can span the AZs of its Region, and an AMI is Region-specific, so you copy it to another Region before launching there.",
      "Edge locations are a separate network for content delivery: CloudFront serves each request from the edge location with the lowest latency and fetches from the origin, such as an S3 bucket, only when the content is not already there.",
      "Shared responsibility in one line: AWS secures the cloud itself, from the host operating system and virtualization layer down to the facilities. You secure what you run in it: guest operating system, applications, security groups, data and permissions."
    ],
    trap: "Three ways to run instances closer than a Region: a Local Zone (an extension of a Region near a large population center), AWS Outposts (AWS-managed capacity at your own site) and a Wavelength Zone (in a carrier's 5G network). An edge location is none of them.",
    docs: [
      ["Regions and Zones", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"],
      ["AWS Regions and Availability Zones", "https://aws.amazon.com/about-aws/global-infrastructure/regions_az/"],
      ["Shared responsibility model", "https://aws.amazon.com/compliance/shared-responsibility-model/"]
    ]
  },

  c1d: {
    k: [
      "A VPC can span the Availability Zones of its Region, while each subnet resides entirely in one AZ. The VPC's IPv4 CIDR block is between /16 and /28; choose a range that overlaps no VPC you will peer with.",
      "A subnet is public when its route table has a route to an internet gateway and private when it has none. To be reached from the internet over IPv4 an instance needs both that route and a public IPv4 address.",
      "An internet gateway is horizontally scaled, redundant and highly available, so it needs no standby. A NAT gateway lets instances in a private subnet connect out, while external services cannot initiate a connection to them.",
      "Security groups work at instance level, are stateful and hold allow rules only. Network ACLs work at subnet level, are stateless and evaluate numbered allow and deny rules in ascending order until one matches.",
      "A security group rule can name another security group as its source. It then covers every instance associated with that group, whatever its IP address, which is how only the web tier is let through to the database tier."
    ],
    trap: "A subnet is not public because of its name or because its instances have public IP addresses: without a route to an internet gateway they cannot communicate with the internet. A NAT gateway gives a private subnet outbound access only.",
    docs: [
      ["Subnets for your VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html"],
      ["Enable internet access for a VPC using an internet gateway", "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html"],
      ["Compare security groups and network ACLs", "https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html"]
    ]
  },

  c1e: {
    k: [
      "Pick the instance family by the resource that runs short: C is compute optimized, R and X are memory optimized, I and D are storage optimized, P and G carry GPUs, M is general purpose, and T is burstable for low average CPU with spikes.",
      "Read the workload pattern: steady for one or three years means Savings Plans or Reserved Instances, short-term irregular work that cannot be interrupted means On-Demand, and work that can be interrupted means Spot Instances on spare capacity.",
      "User data is a script that runs when the instance first boots, and whatever it installs adds to the boot time. An AMI made from a configured instance launches instances with the same configuration; AMIs are Region-specific.",
      "Other compute: Lambda runs code in response to events with no servers to manage, up to 15 minutes per invocation for a standard function. Fargate runs containers without instances to manage, for ECS and for EKS (managed Kubernetes).",
      "Elastic Beanstalk takes your application and provisions EC2 instances (or an EKS cluster in Cluster mode), load balancing, health monitoring and scaling in your account. You keep full control of those resources and pay only for them."
    ],
    trap: "Two pairs get swapped. Dedicated Hosts show sockets and physical cores for per-socket or per-core licences; Dedicated Instances only keep other accounts off the hardware. Savings Plans commit to an hourly spend, Reserved Instances to an instance configuration.",
    docs: [
      ["Amazon EC2 instance type naming conventions", "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html"],
      ["Amazon EC2 billing and purchasing options", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html"],
      ["What is AWS Elastic Beanstalk?", "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html"]
    ]
  },

  c1f: {
    k: [
      "Three kinds of storage: block (an EBS volume attached to an instance in the same AZ), file (an EFS file system shared by many Linux instances) and object (S3; S3 Standard stores objects redundantly across at least three AZs).",
      "An EBS volume persists independently of its instance, and a snapshot carries its data to another AZ. Instance store sits on disks physically attached to the host: data survives a reboot but is lost on stop, hibernate or terminate.",
      "RDS runs Db2, MariaDB, SQL Server, MySQL, Oracle and PostgreSQL and manages backups, software patching, automatic failure detection and recovery. Aurora is a relational engine compatible with MySQL and PostgreSQL.",
      "DynamoDB is a serverless NoSQL database for key-value and document data with single-digit millisecond performance at any scale. An item is limited to 400 KB, so a large object goes to S3 and the item stores its identifier.",
      "Purpose-built databases: Redshift is the data warehouse, ElastiCache the in-memory cache, Neptune the graph database, DocumentDB runs MongoDB workloads, Keyspaces runs Cassandra workloads, OpenSearch Service does search and log analytics."
    ],
    trap: "The engine or data model named in the stem decides. Keeping SQL Server or Oracle rules out Aurora; MongoDB-compatible means DocumentDB, not DynamoDB; ad hoc queries over normalized tables point to a relational engine, web-scale key access to DynamoDB.",
    docs: [
      ["Storage options for your Amazon EC2 instances", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Storage.html"],
      ["What is Amazon RDS?", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html"],
      ["What is Amazon DynamoDB?", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html"]
    ]
  },

  l1a: {
    k: [
      "S3 static website hosting serves static content, which may include client-side scripts. The website endpoint supports only GET and HEAD requests on objects, so a form that saves data needs its own backend, such as API Gateway with Lambda.",
      "A public website endpoint needs three things: static website hosting enabled with an index document, Block Public Access turned off for the bucket, and a bucket policy that grants public read access.",
      "The website endpoint does not support HTTPS. For HTTPS use AWS Amplify Hosting (the option AWS recommends) or put a CloudFront distribution in front; an ACM certificate for CloudFront must be requested in us-east-1.",
      "Why this is more reliable than one web server: there is no server to run, and S3 Standard stores each object redundantly across at least three Availability Zones, designed for 99.999999999% durability and 99.99% availability."
    ],
    trap: "No setting turns on HTTPS for an S3 website endpoint, so that option is always wrong. And making a bucket public is a customer decision: if data leaks from it, that is the customer's side of the shared responsibility model.",
    docs: [
      ["Hosting a static website using Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html"],
      ["Website endpoints", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html"],
      ["Setting permissions for website access", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html"]
    ]
  },

  l1b: {
    k: [
      "You pick an Availability Zone by picking a subnet, because each subnet resides entirely within one AZ. Running in two AZs therefore takes at least two subnets.",
      "Instances in two AZs become one highly available application only when something spreads the traffic. Elastic Load Balancing distributes incoming traffic across targets in one or more AZs and routes only to the healthy ones.",
      "Size for the loss of one AZ: the remaining AZs must carry the whole load. Needing 4 instances means 2 in each of three AZs (6 in total) or 4 in each of two (8 in total), so three AZs need less spare capacity.",
      "An EBS volume and the instance it attaches to must be in the same AZ, so a volume cannot follow you to the other AZ. Its data gets there only through a snapshot."
    ],
    trap: "A larger instance type, a cluster placement group or daily snapshots do not survive an AZ outage. The first two stay inside one AZ and snapshots only help you rebuild afterwards; only instances already running in a second AZ keep serving.",
    docs: [
      ["Regions and Zones", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"],
      ["What is Elastic Load Balancing?", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html"],
      ["Subnets for your VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html"]
    ]
  },

  l1c: {
    k: [
      "CIDR arithmetic: a /24 holds 256 addresses and a /28 holds 16, the smallest subnet AWS allows. AWS reserves the first four addresses and the last one in every subnet, so a /24 leaves 251 for your resources and a /28 leaves 11.",
      "Every route table contains a local route for traffic inside the VPC, and the most specific matching route wins (longest prefix match). A subnet you have not explicitly associated with a route table uses the main route table.",
      "The defaults differ. A new security group has no inbound rules and allows all outbound traffic. The VPC's default network ACL allows all traffic in and out; in any network ACL a packet that matches no numbered rule is denied.",
      "Internet access needs several things at once: an internet gateway attached to the VPC, a route to it in the subnet's route table, a public IPv4 address on the instance, and security group and network ACL rules that allow the traffic."
    ],
    trap: "Plan address ranges before you build. The size of an existing VPC CIDR block cannot be increased or decreased (you can only associate additional blocks), and VPCs with matching or overlapping CIDR blocks cannot be peered.",
    docs: [
      ["Subnet CIDR blocks", "https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html"],
      ["Subnet route tables", "https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html"],
      ["Security group rules", "https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html"]
    ]
  },

  l1d: {
    k: [
      "Changing the instance type means downtime: you must stop an EBS-backed instance, change the type and start it again. The EBS volumes and their data are kept.",
      "A stop and start loses the contents of RAM, instance store data and the auto-assigned public IPv4 address. EBS volumes, private IPv4 addresses and associated Elastic IP addresses persist.",
      "Read a type name such as <code>m7g.large</code> left to right: the series (M, general purpose), the generation (7), option letters (g for Graviton processors) and, after the dot, the size. Pick the series by the resource that runs short.",
      "Connection methods differ: an SSH client needs an inbound rule and a key pair; EC2 Instance Connect needs the inbound rule and IAM permissions but no key pair; Session Manager needs no inbound rule, only IAM permissions and an instance profile role."
    ],
    trap: "A bigger instance type is vertical scaling: it costs downtime and still leaves one instance to fail; the reliability pillar prefers several small resources to one large one. More memory comes from the instance type, never from a larger EBS volume.",
    docs: [
      ["Change the instance type for your Amazon EC2 instance", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/change-instance-type-of-ebs-backed-instance.html"],
      ["How EC2 instance stop and start works", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-stop-start-works.html"],
      ["Connect to your EC2 instance", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect.html"]
    ]
  },

  l1e: {
    k: [
      "Multi-AZ keeps a synchronous standby replica in another AZ. On a failure RDS switches over automatically and points the DB instance's DNS record at the standby, typically in 60 to 120 seconds. The standby cannot serve read traffic.",
      "A read replica is a read-only copy that RDS updates asynchronously. It takes load off the primary only when the application routes queries to it, it can be promoted to a standalone DB instance, and its source needs automatic backups enabled.",
      "Managed versus self-hosted: for a database on EC2 you do the OS and database patching, backups, high availability and scaling yourself. On RDS AWS does all of these; application optimization and query tuning stay with you.",
      "AWS DMS keeps the source database fully operational during a migration: a full load copies the existing data, then change data capture applies ongoing changes until you switch over. A different target engine also needs schema conversion."
    ],
    trap: "RDS copies every change to the Multi-AZ standby and to read replicas, an accidental <code>DELETE</code> included, so failing over or promoting a replica does not bring the rows back. A point-in-time restore does, and it always creates a new DB instance.",
    docs: [
      ["Multi-AZ DB instance deployments for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html"],
      ["Working with DB instance read replicas", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html"],
      ["What is AWS Database Migration Service?", "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html"]
    ]
  }
});
