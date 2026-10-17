// Key points per plan step for the course "Fundamentals of Architecting on AWS" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c1a: {
    head: "How an architect chooses between designs that all work",
    why: "Two teams build the same online shop. One runs it on a single large server, the other on small servers in two data centers with a managed database. Both work on launch day, but one costs less and only one survives a power cut. You need a shared way to judge which design fits the business, and to explain why.",
    idea: "The AWS Well-Architected Framework is that yardstick. It judges a design on security, reliability, performance, cost and more. The exam asks you to design by it, so most questions are a choice between designs that would all work.",
    k: [
      ["What the cloud changes", "The starting assumptions differ from a data center. You trade fixed expense for variable expense. You stop guessing capacity, because you can scale within minutes. You stop running data centers and can go global in minutes."],
      ["Principles for any design", "Stop guessing capacity needs, test at production scale, automate, let the architecture evolve, drive decisions with data, and rehearse failures in game days."],
      ["Business need decides the trade-off", "A development environment may give up reliability to cut cost. A mission-critical system pays more for reliability. Security and operational excellence are generally not traded off."],
      ["Managed services cut overhead", "They remove the burden of running servers, operating systems and applications. Reach for them when a stem asks for the least operational overhead. 'Use managed services' is a design principle of the framework."],
      ["What the exam scores", "The exam guide's scope is this job: design solutions based on the framework. They must be secure (30% of the score), resilient (26%), high-performing (24%) and cost-optimized (20%)."]
    ],
    trap: "The exam guide says wrong options are plausible responses that match the content area, so several will look workable. The qualifier in the stem decides: most cost-effective, least operational overhead. Find it before you read the options.",
    q: {
      q: "Five developers use a test copy of an online shop on weekdays. If it is down for a few hours, no customer notices, and its budget is tight. Which design follows the framework's way of trading off pillars?",
      o: [
        "Run it in one Availability Zone with no standby copies, and keep its access controls as strict as production's",
        "Copy production exactly, with standby databases in two zones, so the two environments never differ",
        "Loosen its access controls to save effort, and keep standby copies in a second zone",
        "Set its servers up by hand instead of with scripts, since the environment is small"
      ],
      a: [0],
      x: [
        "Right. Business context decides which pillar gives way: a development environment may give up reliability to cut cost, while security is generally not traded off.",
        "Standby copies buy reliability this environment does not need. A mission-critical system pays for that; a development environment may give it up to cut cost.",
        "Security is generally not traded off, in development as in production. Reliability is the pillar this environment can spare.",
        "Automating is one of the framework's principles for any design, and operational excellence is generally not traded off either."
      ],
      dom: 4, tags: ["Well-Architected"], doc: "wa"
    },
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["General design principles (Well-Architected Framework)", "https://docs.aws.amazon.com/wellarchitected/latest/framework/general-design-principles.html"],
      ["Six advantages of cloud computing", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html"]
    ]
  },

  c1b: {
    head: "Six pillars, and a tool to check your workload against them",
    why: "Your team keeps a long wiki page of best practices. Nobody can say which ones matter for the shop you are building, or which ones it already follows. A list like that is hard to use until each practice is tied to the goal it serves, and someone checks a real workload against it.",
    idea: "The framework sorts its practices into six pillars, one per goal: operational excellence, security, reliability, performance efficiency, cost optimization and sustainability. The Well-Architected Tool then takes you through the questions for one of your own workloads.",
    k: [
      ["Operations and reliability", "Operational excellence: frequent, small, reversible changes and learning from all operational events. Reliability: automatic recovery from failure, tested recovery procedures, horizontal scaling."],
      ["Security, performance and cost", "Security: a strong identity foundation, traceability, people kept away from data. Performance efficiency: go global in minutes, use serverless, experiment more often. Cost optimization: a consumption model, expenditure analyzed and attributed."],
      ["Sustainability is the sixth", "It is about environmental impact. Understand your impact, maximize utilization, and adopt more efficient hardware, software and managed services."],
      ["The tool asks, it does not scan", "A guided self-review of one workload: you answer its questions pillar by pillar. It records high and medium risks with an improvement plan. A milestone saves the state at a point in time. Trusted Advisor, by contrast, inspects your environment."],
      ["Lenses add questions", "A lens is a set of questions and best practices. The Well-Architected Framework lens is applied to every workload automatically. AWS maintains more in the Lens Catalog, and a custom lens holds your own."]
    ],
    trap: "One practice can sound like two pillars, so decide by the stated goal. Switching off idle servers to cut the bill is cost optimization. Doing it to cut emissions is sustainability.",
    q: {
      q: "A retailer must report and shrink the environmental footprint of its workloads. The team plans to run its servers busier, so that fewer of them are needed. Which pillar does this design goal belong to?",
      o: [
        "Sustainability",
        "Cost optimization",
        "Performance efficiency",
        "Operational excellence"
      ],
      a: [0],
      x: [
        "Right. The goal is environmental impact, and maximizing utilization is one of the sustainability principles.",
        "Fewer servers also cut the bill, but the stated goal decides the pillar, and here it is the environmental footprint.",
        "Its principles are about performance: go global in minutes, use serverless, experiment more often. Nothing in the goal asks for speed.",
        "Its principles are frequent, small, reversible changes and learning from operational events, not the footprint of the servers."
      ],
      dom: 4, tags: ["Well-Architected"], doc: "wa"
    },
    docs: [
      ["The pillars of the framework", "https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html"],
      ["What is AWS Well-Architected Tool?", "https://docs.aws.amazon.com/wellarchitected/latest/userguide/tool.html"],
      ["AWS Trusted Advisor", "https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html"]
    ]
  },

  c1c: {
    head: "Where your systems run: Regions, zones and the edge",
    why: "Your shop runs in one building in Frankfurt. A flood takes the building offline for a day, and customers in Sydney found the site slow even before that. Where a system runs decides which failures it survives and how far each answer travels. You need places to run that fail separately and sit near your users.",
    idea: "AWS builds its infrastructure as Regions, each made of separate Availability Zones, plus edge locations for content delivery. You pick the Region and spread your system over its zones. The scope of each resource tells you what fails together.",
    k: [
      ["Regions stay apart", "Regions are isolated from each other, and AWS does not replicate your resources across Regions automatically. Choosing the Region is also how a data residency rule is met."],
      ["Zones are close but separate", "Each Availability Zone is one or more discrete data centers with redundant power, networking and connectivity. A Region's zones are physically separate but within 100 km of each other, linked well enough for synchronous replication."],
      ["What lives where", "A subnet and an EBS volume live in one Availability Zone. A VPC can span the zones of its Region. An AMI is Region-specific, so you copy it to another Region before launching there."],
      ["Edge locations deliver content", "A separate network for content delivery. CloudFront serves each request from the edge location with the lowest latency. It fetches from the origin, such as an S3 bucket, only when the content is not already there."],
      ["Closer than a Region", "A Local Zone extends a Region to a place near a large population center. AWS Outposts puts AWS-managed capacity at your own site. A Wavelength Zone sits at the edge of a communications service provider's network."]
    ],
    trap: "An edge location does not run your instances: it delivers content for CloudFront. To run instances nearer your users than a Region is, the answer is a Local Zone, Outposts at your own site, or a Wavelength Zone.",
    q: {
      q: "A company runs its application in eu-west-1 and launches it from its own AMIs. Its recovery plan says to start the application in eu-central-1 if eu-west-1 fails. What must be done ahead of time?",
      o: [
        "Copy the AMIs to eu-central-1, because an AMI exists only in the Region where it was made",
        "Nothing: an AMI can be launched in any Region of the account",
        "Ask AWS to replicate the account's resources to eu-central-1 when an outage starts",
        "Create the AMIs in a second Availability Zone of eu-west-1"
      ],
      a: [0],
      x: [
        "Right. AMIs are Region-specific, and AWS does not copy your resources between Regions for you. They must already be in eu-central-1 when eu-west-1 is gone.",
        "An AMI is Region-specific. To launch it in another Region you copy it there first.",
        "AWS does not replicate your resources across Regions automatically. Copying them is your job, and it has to happen before the outage.",
        "Another zone of the same Region does not help when the whole Region fails. The plan needs copies in eu-central-1."
      ],
      dom: 2, tags: ["Regions & AZs"], doc: "regions"
    },
    docs: [
      ["Regions and Zones", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"],
      ["AWS Regions and Availability Zones", "https://aws.amazon.com/about-aws/global-infrastructure/regions_az/"],
      ["Shared responsibility model", "https://aws.amazon.com/compliance/shared-responsibility-model/"]
    ]
  },

  c1d: {
    head: "Public and private subnets, and the gateways and firewalls between them",
    why: "Your web server must answer anyone on the internet, and your database must answer only the web server. Yet the database server still has to download its security patches from the internet. You need a network where reaching in and reaching out are decided separately, subnet by subnet and server by server.",
    idea: "A VPC is that network (Day 1). A route table makes each subnet public or private. A NAT gateway lets private servers reach out only. Two firewalls filter the rest: security groups per instance, network ACLs per subnet.",
    k: [
      ["Size the VPC first", "Its IPv4 range is between /16 and /28. Pick one that overlaps no VPC you will peer with."],
      ["Public takes a route and an address", "A subnet is public when its route table has a route to an internet gateway. To be reached from the internet over IPv4, an instance there also needs a public IPv4 address."],
      ["The internet gateway needs no standby", "It connects a VPC to the internet. It is horizontally scaled, redundant and highly available."],
      ["A NAT gateway lets servers out only", "Instances in a private subnet connect out through it, while external services cannot start a connection to them."],
      ["Let a tier in by its group", "A security group rule can name another security group as its source. That is how only the web tier is let through to the database tier, whatever addresses its instances have."]
    ],
    trap: "A subnet is not public because of its name, or because its instances have public IP addresses. Without a route to an internet gateway they cannot communicate with the internet. A NAT gateway gives a private subnet outbound access only.",
    q: {
      q: "Database servers in a private subnet must fetch operating system patches from the internet. Nothing on the internet may ever open a connection to them. What do you add?",
      o: [
        "A NAT gateway, and a route to it in the private subnet's route table",
        "A route from the private subnet straight to the internet gateway",
        "A public IPv4 address on each database server",
        "An inbound security group rule that allows the patch servers' addresses"
      ],
      a: [0],
      x: [
        "Right. A NAT gateway lets instances in a private subnet connect out, while external services cannot start a connection to them.",
        "A route to the internet gateway makes the subnet public, and servers there with public addresses could be reached from the internet.",
        "A public address alone does nothing without a route to an internet gateway, and with one the servers would be reachable from outside.",
        "An inbound rule lets connections in. Downloading patches needs a way out, and replies to it pass because security groups are stateful."
      ],
      dom: 1, tags: ["Internet & NAT gateways"], doc: "nat"
    },
    docs: [
      ["Subnets for your VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html"],
      ["Enable internet access for a VPC using an internet gateway", "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html"],
      ["Compare security groups and network ACLs", "https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html"]
    ]
  },

  c1e: {
    head: "Choosing an instance, paying less for it, and launching it ready",
    why: "A video service encodes clips on a general-purpose server it pays for by the hour, day and night. The jobs are slow, the server idles every night, and each new server takes an hour to set up by hand. You need to match the server to the work, the price to how you use it, and the setup to a recipe.",
    idea: "EC2 offers instance families built for different bottlenecks and purchasing options that trade a commitment or interruptions for a lower price. User data and AMIs launch instances ready to work. Elastic Beanstalk goes further and provisions the whole platform for your code.",
    k: [
      ["Family by the scarce resource", "C is compute optimized, R and X are memory optimized, I and D are storage optimized. P and G carry GPUs, M is general purpose, and T is burstable for low average CPU with spikes."],
      ["Price by the workload pattern", "Steady for one or three years means Savings Plans or Reserved Instances. Short-term irregular work that cannot be interrupted means On-Demand. Work that can be interrupted means Spot Instances on spare capacity."],
      ["Dedicated Hosts or Instances", "Dedicated Hosts show you sockets and physical cores, for per-socket or per-core licences. Dedicated Instances only keep other accounts off the hardware."],
      ["User data or an AMI", "User data is a script that runs when the instance first boots, and whatever it installs adds to the boot time. An AMI made from a configured instance launches instances with the same configuration."],
      ["Elastic Beanstalk runs the platform", "Give it your application, and it provisions what it needs in your account. That means EC2 instances (or an EKS cluster in Cluster mode), load balancing, health monitoring and scaling. You keep full control and pay only for them."]
    ],
    trap: "Two pairs get swapped. A per-socket or per-core licence needs Dedicated Hosts, not Dedicated Instances. A Savings Plan commits to an hourly spend, a Reserved Instance to an instance configuration.",
    q: {
      q: "New web servers need about twenty minutes to become ready, because their user data installs a long list of packages at first boot. Scaling out must bring servers into service much faster. What helps most?",
      o: [
        "Launch them from an AMI made from an instance that already has the packages installed",
        "Choose a larger instance from the same family so that the script runs faster",
        "Buy a Savings Plan so that new servers are kept ready in advance",
        "Move the install script to an instance store volume of each server"
      ],
      a: [0],
      x: [
        "Right. Whatever user data installs adds to the boot time. An AMI made from a configured instance starts with everything already in place.",
        "A larger instance does not remove the install work from the boot: the packages still have to be downloaded and installed each time.",
        "A Savings Plan is a pricing commitment. It changes what you pay, not how fast a new instance is ready.",
        "Where the script is stored does not matter. It still installs everything at first boot."
      ],
      dom: 3, tags: ["EC2 user data & AMIs"], doc: "ec2"
    },
    docs: [
      ["Amazon EC2 instance type naming conventions", "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html"],
      ["Amazon EC2 billing and purchasing options", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html"],
      ["What is AWS Elastic Beanstalk?", "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html"]
    ]
  },

  c1f: {
    head: "Matching each kind of data to the store built for it",
    why: "A team keeps its product photos in the relational database, next to the orders. Backups take hours, and every page with a picture is slow. No single store is good at every shape of data. You need to ask which shape you have before you pick where it goes.",
    idea: "AWS has a storage service or database for each shape, which Day 2 introduced: disks, shared files, objects, tables, key-value items, and purpose-built engines. Here is what decides between them when a stem names an engine, a size or a data model.",
    k: [
      ["Moving a volume's data", "An EBS volume stays in its Availability Zone. A snapshot carries its data to another zone, where it is restored as a new volume."],
      ["Which engines run where", "RDS runs Db2, MariaDB, SQL Server, MySQL, Oracle and PostgreSQL. Aurora is compatible with MySQL and PostgreSQL. So a stem that keeps SQL Server or Oracle rules Aurora out."],
      ["DynamoDB items stay small", "An item is limited to 400 KB. A large object goes to S3, and the item stores its identifier."],
      ["Purpose-built by data model", "Redshift is the data warehouse, ElastiCache the in-memory cache and Neptune the graph database. DocumentDB runs MongoDB workloads and Keyspaces runs Cassandra workloads. OpenSearch Service does search and log analytics."]
    ],
    trap: "The engine or data model named in the stem decides. Keeping SQL Server or Oracle rules out Aurora. MongoDB-compatible means DocumentDB, not DynamoDB. Ad hoc queries over normalized tables point to a relational engine, web-scale key access to DynamoDB.",
    q: {
      q: "An app keeps user profiles in DynamoDB. Each profile must now carry a scanned contract of about 2 MB. Where should the contract go?",
      o: [
        "In S3, with the object's key kept in the profile item",
        "In the profile item itself, as one more attribute",
        "On the EBS volume of the server that runs the app",
        "In an ElastiCache cluster, next to the profile"
      ],
      a: [0],
      x: [
        "Right. A DynamoDB item is limited to 400 KB, so large objects go to S3 and the item keeps their identifier.",
        "The item would pass DynamoDB's 400 KB limit: a 2 MB contract does not fit in one item.",
        "An EBS volume is the disk of one server in one zone. Other servers could not read the contract, and it would not live with the profile.",
        "ElastiCache is an in-memory cache, meant to speed up reads, not to be the place a document is kept."
      ],
      dom: 3, tags: ["DynamoDB"], doc: "dynamodb"
    },
    docs: [
      ["Storage options for your Amazon EC2 instances", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Storage.html"],
      ["What is Amazon RDS?", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html"],
      ["What is Amazon DynamoDB?", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html"]
    ]
  },

  l1a: {
    head: "Serve a website straight from an S3 bucket",
    why: "A dental practice wants a small site with its opening hours and a map. A web server for it would mean patching, watching and paying for a machine that mostly waits. Pages made only of files need somewhere to be served from that nobody has to run.",
    idea: "Amazon S3 can host a static website: the bucket serves the files itself from its website endpoint. In the lab you design one for a simulated customer and build it, and see which settings make the bucket public.",
    k: [
      ["What the endpoint can serve", "Static content, which may include client-side scripts. It supports only GET and HEAD requests on objects. So a form that saves data needs a backend of its own, such as API Gateway with Lambda."],
      ["Three settings make it public", "Static website hosting enabled with an index document, Block Public Access turned off for the bucket, and a bucket policy that grants public read access."],
      ["HTTPS takes another service", "The website endpoint does not support HTTPS. Use AWS Amplify Hosting, which AWS recommends, or put a CloudFront distribution in front. An ACM certificate for CloudFront must be requested in us-east-1."],
      ["More reliable than one server", "There is no server to run. S3 Standard stores each object redundantly across at least three Availability Zones. It is designed for 99.999999999% durability and 99.99% availability."]
    ],
    trap: "No setting turns on HTTPS for an S3 website endpoint, so that option is always wrong. And making a bucket public is the customer's decision: if data leaks from it, that is the customer's side of the shared responsibility model.",
    q: {
      q: "A museum serves its exhibition pages from an S3 website endpoint. Visitors' browsers now warn that the site is not secure, and the museum wants it served over HTTPS. What do you do?",
      o: [
        "Serve the site through AWS Amplify Hosting or a CloudFront distribution",
        "Turn on the HTTPS option in the bucket's static website hosting settings",
        "Attach an ACM certificate directly to the bucket's website endpoint",
        "Add a bucket policy that denies every request made without TLS"
      ],
      a: [0],
      x: [
        "Right. The website endpoint does not support HTTPS. Amplify Hosting, which AWS recommends, or CloudFront in front of the bucket serves it over HTTPS.",
        "There is no such setting: the website endpoint does not support HTTPS at all.",
        "A certificate cannot make the website endpoint speak HTTPS. The certificate goes on CloudFront, requested in us-east-1.",
        "The website endpoint answers over HTTP only, so such a policy would deny every visitor instead of securing the site."
      ],
      dom: 1, tags: ["S3 features"], doc: "s3"
    },
    docs: [
      ["Hosting a static website using Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html"],
      ["Website endpoints", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html"],
      ["Setting permissions for website access", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html"]
    ]
  },

  l1b: {
    head: "Keep an application running when one zone fails",
    why: "A school's enrollment site runs on one server in one Availability Zone. On the first morning of enrollment that zone has a power problem, and parents see an error page for hours. The application has to keep running somewhere else, with traffic sent there and enough capacity to carry it.",
    idea: "You run copies in two or more Availability Zones behind a load balancer, sized so that the zones left can carry the whole load. In the lab you place each piece in a zone yourself.",
    k: [
      ["A subnet picks the zone", "You pick an Availability Zone by picking a subnet, because each subnet resides entirely within one zone. Running in two zones therefore takes at least two subnets."],
      ["A load balancer joins the copies", "Instances in two zones become one highly available application only when something spreads the traffic. Elastic Load Balancing distributes it across targets in one or more zones and routes only to healthy ones."],
      ["Size for losing a zone", "The remaining zones must carry the whole load. Needing 4 instances means 2 in each of three zones (6 in total) or 4 in each of two (8 in total). Three zones need less spare capacity."],
      ["EBS stays in its zone", "A volume and the instance it attaches to must be in the same zone, so a volume cannot follow you to the other zone. A snapshot can: it restores as a new volume in any zone of the Region."]
    ],
    trap: "A larger instance type or daily snapshots do not survive a zone outage. The bigger instance still sits in one zone, and snapshots only help you rebuild afterwards. Only instances already running in a second zone keep serving.",
    q: {
      q: "An application needs 6 instances in service at all times, even while one Availability Zone is down. The Region has three zones. What is the smallest deployment that meets this?",
      o: [
        "3 instances in each of the three zones, 9 in total",
        "2 instances in each of the three zones, 6 in total",
        "6 instances in each of two zones, 12 in total",
        "6 instances in one zone, with snapshots copied to the other two"
      ],
      a: [0],
      x: [
        "Right. With one zone gone, the two left still run 3 + 3 = 6 instances.",
        "With one zone gone only 4 are left, two short of what the load needs.",
        "That survives the loss of a zone, but it runs 12 instances where 9 are enough. Three zones need less spare capacity.",
        "Snapshots only help you rebuild afterwards. While the one zone is down, nothing is serving."
      ],
      dom: 2, tags: ["High availability design"], doc: "regions"
    },
    docs: [
      ["Regions and Zones", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"],
      ["What is Elastic Load Balancing?", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html"],
      ["Subnets for your VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html"]
    ]
  },

  l1c: {
    head: "Plan addresses and routes so that packets arrive",
    why: "A team gives its new VPC a small address range. Within a year it runs out of addresses, and it cannot connect the VPC to a partner's network because both use the same range. Address ranges, routes and firewalls have to be planned together, before anything is built.",
    idea: "In the lab you build a VPC by hand. You see how the address ranges, the route tables and the two firewalls each decide whether a packet arrives.",
    k: [
      ["Count the usable addresses", "A /24 holds 256 addresses and a /28 holds 16, the smallest subnet AWS allows. AWS reserves the first four and the last one in every subnet. So a /24 leaves 251 for your resources and a /28 leaves 11."],
      ["How a route is chosen", "Every route table has a local route for traffic inside the VPC. The most specific matching route wins (longest prefix match). A subnet you never associated with a route table uses the main route table."],
      ["What the firewalls allow at first", "A new security group has no inbound rules and allows all outbound traffic. The VPC's default network ACL allows all traffic in and out. In any network ACL, a packet that matches no numbered rule is denied."],
      ["Internet access needs all of these", "An internet gateway attached to the VPC, and a route to it in the subnet's route table. A public IPv4 address on the instance. Security group and network ACL rules that allow the traffic."]
    ],
    trap: "Plan address ranges before you build. An existing VPC CIDR block cannot be made bigger or smaller: you can only associate additional blocks. And VPCs with matching or overlapping CIDR blocks cannot be peered.",
    q: {
      q: "A subnet must hold 25 servers, and you want the smallest subnet that fits. Which size do you give it?",
      o: [
        "A /27, which leaves 27 usable addresses",
        "A /28, which leaves 11 usable addresses",
        "A /26, which leaves 59 usable addresses",
        "A /29, which leaves 3 usable addresses"
      ],
      a: [0],
      x: [
        "Right. A /27 holds 32 addresses. AWS reserves five in every subnet, which leaves 27, enough for 25 servers.",
        "A /28 holds 16 addresses and leaves only 11 after the five that AWS reserves.",
        "A /26 fits, but it is twice the size you need. A /27 is already enough.",
        "AWS does not allow a subnet smaller than a /28."
      ],
      dom: 2, tags: ["VPC & subnets"], doc: "vpc"
    },
    docs: [
      ["Subnet CIDR blocks", "https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html"],
      ["Subnet route tables", "https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html"],
      ["Security group rules", "https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html"]
    ]
  },

  l1d: {
    head: "Make an instance bigger, and connect to it without an open port",
    why: "A reporting server runs out of memory at every month-end. You need to log in to see what is wrong, but the security team refuses to open port 22 to the internet. You need to know what resizing an instance costs you, and which ways in work without an open door.",
    idea: "Changing the instance type takes a stop and a start, which keeps some things and loses others. SSH and EC2 Instance Connect need an inbound rule. Session Manager needs none.",
    k: [
      ["Changing the type takes a stop", "That means downtime. You stop an EBS-backed instance, change the type and start it again. The EBS volumes and their data are kept."],
      ["What a stop and start loses", "The contents of RAM, instance store data and the auto-assigned public IPv4 address are lost. EBS volumes, private IPv4 addresses and associated Elastic IP addresses persist."],
      ["Reading a type name", "Read <code>m7g.large</code> left to right: the series (M, general purpose), the generation (7), option letters (g for Graviton processors) and, after the dot, the size."],
      ["SSH and Instance Connect", "An SSH client needs an inbound rule and a key pair. EC2 Instance Connect needs the inbound rule and IAM permissions, but no key pair."],
      ["Session Manager needs no open port", "It needs no inbound rule at all. It needs IAM permissions, an instance profile role and the SSM Agent."]
    ],
    trap: "A bigger instance type is vertical scaling: it costs downtime and still leaves one instance to fail. The reliability pillar prefers several small resources to one large one. More memory comes from the instance type, never from a larger EBS volume.",
    q: {
      q: "You stop an EBS-backed instance, change its type to a memory optimized one and start it again. Users reached it at its auto-assigned public IPv4 address. What do they find afterwards?",
      o: [
        "The data on its EBS volumes is still there, but its public IPv4 address has changed",
        "The data on its EBS volumes is gone, and its public IPv4 address is the same",
        "Both the data and the public IPv4 address are exactly as before",
        "The instance comes back with its RAM contents, so open sessions continue"
      ],
      a: [0],
      x: [
        "Right. EBS volumes persist through a stop and start, but the auto-assigned public IPv4 address is lost. An Elastic IP address would have stayed.",
        "It is the other way round: the EBS volumes and their data are kept, and the auto-assigned public address is lost.",
        "The data stays, but an auto-assigned public IPv4 address does not survive a stop. Only an Elastic IP address does.",
        "The contents of RAM are lost when an instance stops, so open sessions end."
      ],
      dom: 3, tags: ["EC2 instance types"], doc: "ec2"
    },
    docs: [
      ["Change the instance type for your Amazon EC2 instance", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/change-instance-type-of-ebs-backed-instance.html"],
      ["How EC2 instance stop and start works", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-stop-start-works.html"],
      ["Connect to your EC2 instance", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect.html"]
    ]
  },

  l1e: {
    head: "Keep a database up, and take the reads off it",
    why: "An online store's database server fails on a Saturday. The one person who knows how to restore it is on holiday, and the store stays closed until Monday. A database needs someone to run its backups, patches and failover, and sometimes extra copies that only serve reads.",
    idea: "Amazon RDS takes over most of that work. It offers two kinds of copies for two needs: a Multi-AZ standby to stay up when a zone fails, and read replicas to serve more reads. The lab shows which copy does which job.",
    k: [
      ["A Multi-AZ standby keeps it up", "RDS keeps a synchronous standby in another Availability Zone. On a failure it switches over automatically and repoints the instance's DNS record, typically in 60 to 120 seconds. The standby cannot serve reads."],
      ["A read replica takes reads", "It takes load off the primary, but only when the application routes queries to it. RDS updates it asynchronously. It can be promoted to a standalone DB instance, and its source needs automatic backups enabled."],
      ["What RDS takes off your hands", "On EC2 you do the operating system and database patching, backups, high availability and scaling yourself. On RDS AWS does all of these. Application optimization and query tuning stay with you."],
      ["Moving a live database in", "AWS DMS migrates a database while the source stays fully operational. A full load copies the existing data, then change data capture applies ongoing changes until you switch over. A different target engine also needs schema conversion."]
    ],
    trap: "RDS copies every change to the Multi-AZ standby and to read replicas, an accidental <code>DELETE</code> included. Failing over or promoting a replica therefore does not bring the rows back. A point-in-time restore does, and it always creates a new DB instance.",
    q: {
      q: "An engineer runs a <code>DELETE</code> without a <code>WHERE</code> clause on an RDS database that has a Multi-AZ standby and a read replica. How do you get the rows back?",
      o: [
        "Restore to a point in time just before the <code>DELETE</code>",
        "Fail over to the Multi-AZ standby, which still holds the rows from before",
        "Promote the read replica to a standalone DB instance and point the app at it",
        "Reboot the primary so that it reloads the last state it saved to disk"
      ],
      a: [0],
      x: [
        "Right. A point-in-time restore brings back the data as it was, and it always creates a new DB instance.",
        "The standby is updated synchronously, so the <code>DELETE</code> reached it too.",
        "RDS copied the <code>DELETE</code> to the replica as well. Promoting it gives you a database without the rows.",
        "A reboot does not undo committed changes. The rows are gone until you restore from backups."
      ],
      dom: 2, tags: ["RDS"], doc: "rds"
    },
    docs: [
      ["Multi-AZ DB instance deployments for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html"],
      ["Working with DB instance read replicas", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html"],
      ["What is AWS Database Migration Service?", "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html"]
    ]
  }
});
