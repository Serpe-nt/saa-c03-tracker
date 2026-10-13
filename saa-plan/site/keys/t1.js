// Key points for the course "AWS Technical Essentials" (t1a–t1f), the recommended starting point before the Solutions Architect plan. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  t1a: {
    why: "Running your own data center means buying, owning and maintaining servers before you know how many you need. Cloud computing rents the same IT resources over the internet, on demand, and you pay as you go. This module shows where those resources are, how you reach them, and which part of their security is your job.",
    k: [
      ["Region and Availability Zone", "You choose a Region to be close to your users or to meet legal requirements. Every Region has at least three Availability Zones. Each is one or more discrete data centers, so one failure does not take down everything."],
      ["Three ways in", "The AWS Management Console is the web interface. The AWS CLI controls services from the command line and from scripts. The SDKs let your own programs use AWS services."],
      ["Shared responsibility", "AWS secures the cloud itself, from the host operating system and virtualization layer down to the facilities. You secure what you run in it: guest operating system, applications, security groups, data and permissions."],
      ["Root user", "The identity you created the account with. It can do anything in the account, so guard it with MFA and keep it out of daily use."],
      ["IAM", "Decides who may do what. A user has long-term credentials, a group shares permissions among users, and a role gives temporary credentials to whoever may assume it. Apart from the root user, a request is denied unless a policy allows it."]
    ],
    trap: "Your part of the shared responsibility model depends on the service. On EC2 you patch the guest operating system yourself. On a managed database such as RDS, AWS does the software patching and your part shrinks to your data and who may reach it.",
    docs: [
      ["What is cloud computing?", "https://aws.amazon.com/what-is-cloud-computing/"],
      ["Shared responsibility model", "https://aws.amazon.com/compliance/shared-responsibility-model/"],
      ["Accessing AWS services", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/accessing-aws-services.html"]
    ]
  },
  t1b: {
    why: "Every application needs a computer to run on. Buying one takes time, and you pay for it whether it is busy or not. AWS gives you three ways to rent computing instead: a whole virtual server, a container, or a function that runs only when something happens.",
    k: [
      ["EC2 instance", "A virtual server that you control, operating system included. Choose it when the application needs a whole server or software that you install yourself."],
      ["Instance lifecycle", "A running instance is billed per second, with a one-minute minimum, even when it sits idle. A stopped instance is not billed for usage. A terminated instance is deleted for good and cannot be started again."],
      ["Container", "Packages an application with its code, runtime, libraries and system tools, so the same package runs anywhere. Amazon ECS runs containers for you, and Amazon EKS is managed Kubernetes."],
      ["Fargate", "Runs containers without instances to manage. It works for ECS and for EKS."],
      ["Lambda", "Runs code in response to events with no servers to manage. You pay per use instead of paying for instances that wait for work. A standard function runs up to 15 minutes per invocation."],
      ["Choosing", "A whole server or special software: EC2. An application packaged as a container: ECS or EKS, with Fargate when you do not want to manage instances. Short code that reacts to events: Lambda."]
    ],
    trap: "Stopping an instance does not stop every charge. Some resources, such as its EBS volumes and Elastic IP addresses, cost money whatever state the instance is in.",
    docs: [
      ["Amazon EC2 instance state changes", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html"],
      ["Accessing AWS services", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/accessing-aws-services.html"]
    ]
  },
  t1c: {
    why: "A server that anyone on the internet can reach is a server that anyone can attack. Your servers need a network of their own, in which you decide what is exposed and what stays hidden. A VPC is that network. Subnets, route tables and firewalls are how you draw the lines inside it.",
    k: [
      ["VPC", "A logically isolated virtual network that you define yourself, much like the network in your own data center. It can span the Availability Zones of its Region."],
      ["Subnet", "A part of the VPC's address range for a group of resources. Each subnet sits entirely in one Availability Zone."],
      ["Route table", "Decides where traffic leaving a subnet goes. A subnet is public when its route table has a route to an internet gateway, and private when it has none."],
      ["Internet gateway", "Connects a VPC to the internet. To be reached from the internet over IPv4, an instance needs a route to it and a public IPv4 address."],
      ["Security group", "The firewall of an instance. It holds allow rules only and is stateful: return traffic for an allowed request is let through automatically."],
      ["Network ACL", "The firewall of a subnet. It is stateless, with numbered allow and deny rules that are checked in ascending order until one matches."]
    ],
    trap: "A subnet is not public because of its name or because its instances have public IP addresses. Without a route to an internet gateway they cannot communicate with the internet.",
    docs: [
      ["Subnets for your VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html"],
      ["Compare security groups and network ACLs", "https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html"]
    ]
  },
  t1d: {
    why: "Data must outlive the server that wrote it, and data is used in different ways. One server needs a disk. Many servers need the same shared files. Pictures, backups and logs only need to be kept and fetched. Each use needs a different kind of storage, and AWS has a service for each.",
    k: [
      ["Block storage: EBS", "The disk of one instance. An EBS volume is attached to an instance in the same Availability Zone and persists independently of that instance."],
      ["Instance store", "Temporary storage on disks physically attached to the host. Its data survives a reboot and is lost when the instance stops, hibernates or terminates."],
      ["File storage: EFS and FSx", "Shared files. An EFS file system is shared by many Linux instances at once. Amazon FSx is a family of managed file systems, among them Windows File Server and Lustre."],
      ["Object storage: S3", "For objects such as pictures, backups and logs. S3 Standard stores objects redundantly across at least three Availability Zones."],
      ["Choosing", "The disk of one server: EBS. The same files on many servers: EFS for Linux, or FSx. Anything you only need to keep and fetch: S3."]
    ],
    trap: "An EBS volume attaches only to instances in its own Availability Zone. To use its data in another zone, take a snapshot: a snapshot can be restored as a volume in any Availability Zone of the Region.",
    docs: [
      ["Storage options for your Amazon EC2 instances", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Storage.html"]
    ]
  },
  t1e: {
    why: "You can install a database on a server yourself, but then backups, patches and recovery after a failure are your job. AWS runs the database for you instead. Which one you pick depends on the shape of your data: tables that relate to each other, or items that you look up by a key.",
    k: [
      ["RDS", "Relational databases that AWS runs for you: Db2, MariaDB, SQL Server, MySQL, Oracle and PostgreSQL. It manages backups, software patching, automatic failure detection and recovery."],
      ["Aurora", "A relational engine from AWS that is compatible with MySQL and PostgreSQL."],
      ["DynamoDB", "A serverless NoSQL database for key-value and document data, with single-digit millisecond performance at any scale."],
      ["Purpose-built databases", "One per data model. ElastiCache is the in-memory cache, Neptune the graph database and Redshift the data warehouse. DocumentDB runs MongoDB workloads."],
      ["Choosing", "Normalized tables and ad hoc SQL queries point to a relational engine: RDS or Aurora. Access by key at web scale points to DynamoDB."]
    ],
    trap: "The engine named in the question decides. Keeping SQL Server or Oracle rules out Aurora. MongoDB-compatible means DocumentDB, not DynamoDB.",
    docs: [
      ["What is Amazon RDS?", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html"],
      ["What is Amazon DynamoDB?", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html"]
    ]
  },
  t1f: {
    why: "A single server is a single point of failure, and it is the wrong size for most of the day. To serve users reliably you must see how your servers are doing, spread the requests over several of them, and add or remove servers as the load changes. CloudWatch, Elastic Load Balancing and EC2 Auto Scaling do these three jobs.",
    k: [
      ["CloudWatch", "Collects metrics and logs. EC2 sends metrics such as <code>CPUUtilization</code> with no agent. A metric alarm can notify an SNS topic or run an EC2 or Auto Scaling action."],
      ["Load balancer", "Gives users one address and sends each request to a healthy server. Health checks are set per target group, and requests go only to healthy targets."],
      ["Auto Scaling group", "Keeps the right number of instances running. It never goes below its minimum or above its maximum, and it replaces terminated or impaired instances."],
      ["Target tracking", "The default way to scale. Choose a metric and a target value, such as 50% average CPU, and the group creates and manages the alarms."],
      ["More than one zone", "Across several Availability Zones the group tries to spread instances evenly and can launch in another zone when one fails. An Application Load Balancer must be enabled in at least two zones."]
    ],
    trap: "EC2 sends CPU metrics to CloudWatch by itself, but not memory or free disk space. An alarm on those first needs the CloudWatch agent on the instance.",
    docs: [
      ["Monitor your instances using CloudWatch", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch.html"],
      ["How Elastic Load Balancing works", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"],
      ["About the health checks for your Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html"]
    ]
  }
});
