// Key points for the course "AWS Technical Essentials" (t1a–t1g), the recommended starting point before the Solutions Architect plan. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  t1a: {
    head: "What AWS is, where it runs, and who secures what",
    why: "A startup buys ten servers for its launch, waits weeks for delivery, and then uses two of them. Running your own data center means paying up front for capacity you can only guess. You need computing you can rent when you need it, and to know where it runs, how you reach it and what you secure yourself.",
    idea: "Cloud computing is the on-demand delivery of IT resources over the internet, with pay-as-you-go pricing. AWS runs those resources in Regions around the world, and you reach them through the console, the CLI or the SDKs.",
    k: [
      ["Regions and Availability Zones", "You choose a Region to be close to your users or to meet legal requirements. Every Region has at least three Availability Zones. Each is one or more discrete data centers, so one failure does not take down everything."],
      ["Three ways in", "The AWS Management Console is the web interface. The AWS CLI controls services from the command line and from scripts. The SDKs let your own programs use AWS services."],
      ["Who secures what", "AWS secures the cloud itself, from the host operating system and virtualization layer down to the facilities. You secure what you run in it: guest operating system, applications, security groups, data and permissions."],
      ["The root user", "The identity you created the account with earlier today. It can do anything in the account, so it gets MFA and stays out of daily use."],
      ["IAM decides who may do what", "A user has long-term credentials, a group shares permissions among users, and a role gives temporary credentials to whoever may assume it. Apart from the root user, a request is denied unless a policy allows it."]
    ],
    trap: "Your part of the shared responsibility model depends on the service. On EC2 you patch the guest operating system yourself. On a managed database such as RDS, AWS does the software patching, and your part shrinks to your data and who may reach it.",
    q: {
      q: "You run a small blog on an EC2 instance. A security bulletin warns that the Linux version on the instance has a flaw. Who has to install the fix?",
      o: [
        "You, because the guest operating system on an EC2 instance is your side",
        "AWS, because it secures every operating system in its data centers",
        "AWS, but only if you open a support case",
        "Nobody, because instances are rebuilt with fresh images every night"
      ],
      a: [0],
      x: [
        "Right. AWS secures the host and the layers below it. The guest operating system, the applications on it and the security groups are yours.",
        "AWS secures the host operating system and the virtualization layer, not the operating system inside your instance.",
        "A support case doesn't move the responsibility. On EC2 the guest operating system stays yours.",
        "Nothing rebuilds your instance for you. It keeps running the software you put on it until you change it."
      ],
      dom: 1, tags: ["Shared responsibility"], doc: "shared"
    },
    docs: [
      ["What is cloud computing?", "https://aws.amazon.com/what-is-cloud-computing/"],
      ["Shared responsibility model", "https://aws.amazon.com/compliance/shared-responsibility-model/"],
      ["Accessing AWS services", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/accessing-aws-services.html"]
    ]
  },
  t1b: {
    head: "Renting compute: a server, a container or a function",
    why: "Your application needs a computer to run on. Buying one takes weeks, and you pay for it whether it works hard all day or sits idle all night. You need computing you can rent, in the shape your application needs.",
    idea: "AWS rents compute in three shapes: a whole virtual server (Amazon EC2), a container (Amazon ECS or EKS), or a function that runs only when something happens (AWS Lambda).",
    k: [
      ["EC2 instance", "A virtual server that you control, operating system included. Choose it when the application needs a whole server, or software that you install yourself."],
      ["What an instance costs by state", "A running instance is billed per second, with a one-minute minimum, even when it sits idle. A stopped instance is not billed for usage. A terminated one is deleted for good."],
      ["Containers", "A container packages an application with its code, runtime, libraries and system tools, so it runs the same anywhere. ECS runs containers, EKS is managed Kubernetes, and Fargate runs either without instances to manage."],
      ["Lambda", "Runs your code when an event arrives, with no servers to manage, and you pay per use. A standard function runs up to 15 minutes per invocation."],
      ["How to choose", "A whole server or special software: EC2. An application packaged as a container: ECS or EKS, with Fargate when you don't want instances. Short code that reacts to events: Lambda."]
    ],
    trap: "Stopping an instance does not stop every charge. Some resources, such as its EBS volumes and Elastic IP addresses, cost money whatever state the instance is in.",
    q: {
      q: "You stop your EC2 test instance every evening to save money. Which part of it is still billed while it is stopped?",
      o: [
        "Its EBS volumes, and any Elastic IP address it holds",
        "Its usage per second, at a reduced rate for stopped instances",
        "Nothing at all: a stopped instance and everything attached to it are free",
        "A one-minute minimum charge for every hour it stays stopped"
      ],
      a: [0],
      x: [
        "Right. A stopped instance is not billed for usage, but EBS volumes and Elastic IP addresses cost money whatever state the instance is in.",
        "A stopped instance is not billed for usage at all. The charges that remain come from what is attached to it.",
        "The instance's usage stops, but its volumes and any Elastic IP address keep costing.",
        "The one-minute minimum applies when a running instance is billed per second, not to a stopped one."
      ],
      dom: 4, tags: ["EBS & instance store"], doc: "ec2-pricing"
    },
    docs: [
      ["Amazon EC2 instance state changes", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html"],
      ["Accessing AWS services", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/accessing-aws-services.html"]
    ]
  },
  t1c: {
    head: "A network of your own: VPC, subnets, routes and firewalls",
    why: "You start a server with a public address so you can reach it from home. Within hours, strangers' scripts are trying passwords on it. Your servers need a network of their own, in which you decide what is exposed and what stays hidden.",
    idea: "Amazon VPC gives you a logically isolated virtual network. Subnets divide it, route tables decide where traffic goes, and two kinds of firewall filter it: security groups and network ACLs.",
    k: [
      ["VPC and subnets", "A VPC is the network you define, much like the one in your own data center, and it spans the Availability Zones of its Region. Each subnet is a part of its address range that sits entirely in one zone."],
      ["Route tables make a subnet public", "A route table decides where traffic leaving a subnet goes. A subnet is public when its route table has a route to an internet gateway, and private when it has none."],
      ["Internet gateway", "Connects a VPC to the internet. To be reached from the internet over IPv4, an instance needs a route to it and a public IPv4 address."],
      ["Security group", "The firewall of an instance. It holds allow rules only and is stateful: return traffic for an allowed request is let through automatically."],
      ["Network ACL", "The firewall of a subnet. It is stateless, with numbered allow and deny rules that are checked in ascending order until one matches."]
    ],
    trap: "A subnet is not public because of its name, or because its instances have public IP addresses. Without a route to an internet gateway they cannot communicate with the internet.",
    q: {
      q: "Instances in a subnet named \"web-public\" have public IPv4 addresses, yet nobody on the internet can reach them, and the firewalls allow the traffic. What is missing?",
      o: [
        "A route to an internet gateway in the subnet's route table",
        "A second subnet in another Availability Zone",
        "A network ACL rule that denies all other traffic",
        "Elastic IP addresses in place of the public addresses"
      ],
      a: [0],
      x: [
        "Right. A subnet is public only when its route table sends internet traffic to an internet gateway. The name and the public addresses don't make it public.",
        "A second zone adds resilience. It does not give these instances a path to the internet.",
        "A deny rule blocks traffic. It can't create the missing path.",
        "Any public IPv4 address works once the route exists. Without the route, an Elastic IP is unreachable too."
      ],
      dom: 1, tags: ["VPC & subnets", "Internet & NAT gateways"], doc: "vpc"
    },
    docs: [
      ["Subnets for your VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html"],
      ["Compare security groups and network ACLs", "https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html"]
    ]
  },
  t1d: {
    head: "Block, file or object: three kinds of storage",
    why: "Your web server keeps customers' photos on its own disk. A second server, added for a busy week, can't see them, and nobody has decided where the yearly backups go. Data is used in different ways, and each way needs a different kind of storage.",
    idea: "AWS has a service for each way: Amazon EBS volumes as one server's disk, Amazon EFS and Amazon FSx for files that many servers share, and Amazon S3 for objects you keep and fetch.",
    k: [
      ["EBS is one server's disk", "The disk of one instance. An EBS volume is attached to an instance in the same Availability Zone and persists independently of that instance."],
      ["Instance store is temporary", "Temporary storage on disks physically attached to the host. Its data survives a reboot and is lost when the instance stops, hibernates or terminates."],
      ["EFS and FSx share files", "Shared files. An EFS file system is shared by many Linux instances at once. Amazon FSx is a family of managed file systems, among them Windows File Server and Lustre."],
      ["S3 keeps objects", "For objects such as pictures, backups and logs. S3 Standard stores objects redundantly across at least three Availability Zones."],
      ["How to choose", "The disk of one server: EBS. The same files on many servers: EFS for Linux, or FSx. Anything you only need to keep and fetch: S3."]
    ],
    trap: "An EBS volume attaches only to instances in its own Availability Zone. To use its data in another zone, take a snapshot: a snapshot can be restored as a volume in any Availability Zone of the Region.",
    q: {
      q: "A team must move the data on an EBS volume to a new instance in a different Availability Zone of the same Region. What should it do?",
      o: [
        "Take a snapshot of the volume and restore it as a new volume in the other zone",
        "Detach the volume and attach it to the new instance directly",
        "Copy the data to the instance store of the new instance",
        "Change the volume's Availability Zone in its settings"
      ],
      a: [0],
      x: [
        "Right. A snapshot can be restored as a volume in any Availability Zone of the Region.",
        "An EBS volume attaches only to instances in its own Availability Zone.",
        "Instance store is temporary: its data is lost when the instance stops or terminates.",
        "A volume stays in the zone where it was created. The snapshot is how its data moves."
      ],
      dom: 2, tags: ["EBS & instance store"], doc: "ebs"
    },
    docs: [
      ["Storage options for your Amazon EC2 instances", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Storage.html"]
    ]
  },
  t1e: {
    head: "Databases run for you: relational or key-value",
    why: "You install a database on your own server. Now the nightly backup, the security patches and the recovery at 3 a.m. when a disk fails are all your job. You need the database run for you, and the right kind for the shape of your data.",
    idea: "AWS runs databases for you. Amazon RDS and Amazon Aurora hold related tables that you query with SQL. Amazon DynamoDB stores items that you look up by key, at any scale.",
    k: [
      ["RDS", "Relational databases that AWS runs for you: Db2, MariaDB, SQL Server, MySQL, Oracle and PostgreSQL. It manages backups, software patching, automatic failure detection and recovery."],
      ["Aurora", "A relational engine from AWS that is compatible with MySQL and PostgreSQL."],
      ["DynamoDB", "A serverless NoSQL database for key-value and document data, with single-digit millisecond performance at any scale."],
      ["One database per data model", "ElastiCache is the in-memory cache, Neptune the graph database and Redshift the data warehouse. DocumentDB runs MongoDB workloads."],
      ["How to choose", "Normalized tables and ad hoc SQL queries point to a relational engine: RDS or Aurora. Access by key at web scale points to DynamoDB."]
    ],
    trap: "The engine named in the question decides. Keeping SQL Server or Oracle rules out Aurora. MongoDB-compatible means DocumentDB, not DynamoDB.",
    q: {
      q: "A firm moves its order system to AWS. The application uses features found only in Oracle, and the firm wants AWS to handle backups and patching. Which service fits?",
      o: [
        "Amazon RDS for Oracle",
        "Amazon Aurora",
        "Amazon DynamoDB",
        "Amazon DocumentDB"
      ],
      a: [0],
      x: [
        "Right. RDS runs Oracle among its engines, and manages backups, software patching and recovery for you.",
        "Aurora is compatible with MySQL and PostgreSQL, not Oracle.",
        "DynamoDB is a NoSQL key-value and document database. It doesn't run Oracle applications.",
        "DocumentDB runs MongoDB workloads, not Oracle."
      ],
      dom: 3, tags: ["RDS"], doc: "rds"
    },
    docs: [
      ["What is Amazon RDS?", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html"],
      ["What is Amazon DynamoDB?", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html"]
    ]
  },
  t1f: {
    head: "Watch, spread and scale: CloudWatch, load balancers and Auto Scaling",
    why: "Your shop runs on one server. On a sale day it slows to a crawl, at night it sits idle, and when it crashes nobody notices until customers complain. You need to see how your servers are doing, spread requests over several of them, and change their number as the load changes.",
    idea: "Amazon CloudWatch collects metrics and logs and raises alarms. Elastic Load Balancing spreads requests over healthy servers. Amazon EC2 Auto Scaling adds and removes instances as the load changes.",
    k: [
      ["CloudWatch", "Collects metrics and logs. EC2 sends metrics such as <code>CPUUtilization</code> with no agent. A metric alarm can notify an SNS topic or run an EC2 or Auto Scaling action."],
      ["Load balancer", "Gives users one address and sends each request to a healthy server. Health checks are set per target group, and requests go only to healthy targets."],
      ["Auto Scaling group", "Keeps the right number of instances running. It never goes below its minimum or above its maximum, and it replaces terminated or impaired instances."],
      ["Target tracking", "The default way to scale. Choose a metric and a target value, such as 50% average CPU, and the group creates and manages the alarms."],
      ["More than one zone", "Across several Availability Zones the group spreads instances evenly and can launch in another zone when one fails. An Application Load Balancer must be enabled in at least two zones."]
    ],
    trap: "EC2 sends CPU metrics to CloudWatch by itself, but not memory or free disk space. An alarm on those first needs the CloudWatch agent on the instance.",
    q: {
      q: "You create a CloudWatch alarm on the free memory of an EC2 instance, but the alarm never gets any data. What is missing?",
      o: [
        "The CloudWatch agent on the instance, which sends memory metrics",
        "Detailed monitoring, which adds memory to the metrics EC2 sends",
        "An Auto Scaling group around the instance",
        "A load balancer health check on the instance"
      ],
      a: [0],
      x: [
        "Right. EC2 sends metrics such as CPU by itself, but memory and free disk space need the CloudWatch agent.",
        "Detailed monitoring sends EC2's metrics more often. Memory is still not among them.",
        "An Auto Scaling group manages the number of instances. It doesn't add a memory metric.",
        "A health check tells the load balancer whether to send requests. It doesn't report memory to CloudWatch."
      ],
      dom: 3, tags: ["CloudWatch"], doc: "cloudwatch"
    },
    docs: [
      ["Monitor your instances using CloudWatch", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch.html"],
      ["How Elastic Load Balancing works", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"],
      ["About the health checks for your Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html"]
    ]
  },
  t1g: {
    head: "Find your gaps before the architecture courses",
    why: "Six modules felt clear while the videos played. Two weeks later the architecture courses take the basics for granted, and a gap from Day 1 trips you up in every lesson. You need to find the gaps now, while the course is fresh.",
    idea: "The course's own assessment checks each module. Every miss points to the module to look at again before the architecture courses build on it.",
    do: [
      "Open <b>AWS Technical Essentials - Assessment</b> and answer every question.",
      "For each miss, note the module it came from. Look at that module again before the architecture courses build on it."
    ],
    k: [
      ["Sort each miss by its cause", "Didn't know it: rewatch that lesson. Misread the question: slow down and find what it asks for. Two answers seemed right: compare them on the question's exact need."],
      ["Read the need before the options", "Most questions turn on one requirement, such as files shared by many servers. Find it first, and the options sort themselves."]
    ],
    q: {
      q: "A question asks for storage that many Linux instances use at the same time. You picked Amazon EBS because it is \"the disk\". Which habit would have caught the slip?",
      o: [
        "Find the deciding need first: storage shared by many instances at once points to Amazon EFS",
        "Pick the storage service you have used most often",
        "Choose the option with the most AWS services in it",
        "Answer fast, and come back only to questions you skipped"
      ],
      a: [0],
      x: [
        "Right. \"Shared by many instances at once\" is the requirement that decides. An EBS volume is the disk of one instance; EFS is shared by many Linux instances.",
        "Familiarity doesn't answer the need. The requirement in the question does.",
        "More services don't make an answer right. The one that meets the stated need does.",
        "Speed without reading the need is how this slip happens."
      ],
      dom: 3, tags: ["EFS", "EBS & instance store"], doc: "efs"
    }
  }
});
