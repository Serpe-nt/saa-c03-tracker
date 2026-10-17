// Key points per plan step for the course "Designing a Three-Tier Web Architecture" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c3a: {
    head: "Cutting the VPC into subnets for three tiers",
    why: "A customer wants a web shop whose database is never reachable from the internet, and which stays up when a data center fails. Then they mention that the VPC will later connect to their office network. Before the first server exists, the network has to be cut so that each tier is reachable only as it should be. It must span more than one zone and leave room to grow.",
    idea: "You gather those requirements first. Then you turn them into an address plan and a subnet per tier in two or more Availability Zones. Each subnet's route table makes it public, private or isolated.",
    k: [
      ["Leave room to connect and grow", "AWS recommends CIDR blocks that overlap neither other VPCs nor on-premises networks. An existing block cannot be resized: if addresses run out, associate a secondary CIDR block."],
      ["A subnet per tier in each zone", "A subnet lives in exactly one Availability Zone, so each tier needs a subnet in at least two zones. AWS reserves five addresses in every subnet, so a /27 leaves 27 usable addresses."],
      ["Where each tier goes", "The load balancer and NAT gateways go in public subnets. Servers go in private subnets that route out through a NAT gateway. Databases go in subnets with only the local route."],
      ["Keep the main route table private", "A subnet you never associate with a route table uses the main one. Leave it in its default, local-only state and associate each subnet with a custom table. Then no subnet becomes public by accident."],
      ["Outbound-only IPv6", "An egress-only internet gateway gives IPv6 instances outbound-only access, the job a NAT gateway does for IPv4."]
    ],
    trap: "An internet gateway is already horizontally scaled, redundant and highly available, so it needs no standby. A standard (zonal) NAT gateway works in a single Availability Zone, and a tier with a subnet in only one zone fails with that zone.",
    q: {
      q: "In a three-tier design, the database subnets may neither reach the internet nor be reached from it, not even for outbound updates. Which route table should they use?",
      o: [
        "A custom route table that holds only the local route",
        "A route table with a default route to a NAT gateway",
        "A route table with a default route to the internet gateway, with no public IP addresses on the servers",
        "The VPC's main route table, after a route to the internet gateway was added to it"
      ],
      a: [0],
      x: [
        "Right. With only the local route, traffic can flow inside the VPC, such as from the servers' tier, and nowhere else.",
        "A NAT gateway route gives the subnet outbound access to the internet, which the requirement rules out.",
        "A route to the internet gateway makes the subnet public. One public address later and a server is reachable.",
        "A main route table with an internet route makes every subnet that falls back on it public. That is why it should stay local-only."
      ],
      dom: 1, tags: ["VPC & subnets"], doc: "vpc"
    },
    docs: [
      ["Subnets for your VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html"],
      ["Subnet route tables", "https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html"],
      ["Example: VPC with servers in private subnets and NAT", "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-example-private-subnets-nat.html"]
    ]
  },

  c3b: {
    head: "The right instance for each tier, and the cheapest way to pay for it",
    why: "A shop runs its web servers on large instances bought On-Demand. They sit almost idle most of the day, spike at lunchtime, and the bill keeps growing. Each tier needs the instance that fits its load, and a way to pay that fits how steady that load is.",
    idea: "You size each tier by the resource it runs short of, as Day 3 showed, and look at burstable and Graviton instances. Then you commit to a Savings Plan for the steady base and use Spot for work that may be interrupted.",
    k: [
      ["Burstable T instances", "For low average CPU with spikes. They earn CPU credits below their baseline and spend them above it. In standard mode an instance without credits drops to baseline. In unlimited mode it keeps bursting, and sustained extra use is billed."],
      ["Graviton for price performance", "Arm-based processors designed for the best price performance. Graviton instances need arm64 AMIs. Interpreted or run-time compiled languages usually run unchanged. Other software may have to be recompiled."],
      ["Two kinds of Savings Plan", "A Compute Savings Plan commits dollars per hour for 1 or 3 years. It applies across instance family, size and Region, and to Fargate and Lambda. An EC2 Instance Savings Plan has the lowest prices but is tied to one family in one Region."],
      ["Spot for interruptible work", "For stateless, fault-tolerant work. Spot uses spare capacity at a steep discount, with a two-minute warning before an interruption. Be flexible about instance types and zones, and use the <code>price-capacity-optimized</code> strategy."],
      ["Reserving capacity in one zone", "A Savings Plan is a billing discount and reserves no capacity. To be sure instances can launch in a given Availability Zone, create an On-Demand Capacity Reservation. One for immediate use has no term commitment."]
    ],
    trap: "When a stem needs instances guaranteed to launch in one zone, a Savings Plan is the wrong answer: it only lowers the price. When it needs the lowest price for flexible, interruptible work, a commitment is wrong too: that is Spot.",
    q: {
      q: "A web tier runs steadily all year on general purpose instances. Next year the team plans to move part of it to Fargate and part to another Region. Which commitment keeps the discount through those changes?",
      o: [
        "A Compute Savings Plan",
        "An EC2 Instance Savings Plan",
        "An On-Demand Capacity Reservation",
        "Spot Instances with the price-capacity-optimized strategy"
      ],
      a: [0],
      x: [
        "Right. A Compute Savings Plan applies across instance family, size and Region, and to Fargate and Lambda.",
        "Its prices are the lowest, but it is tied to one instance family in one Region, so the moves would leave it unused.",
        "A Capacity Reservation guarantees that instances can launch in a zone. It is not a discount for a steady workload.",
        "Spot suits stateless, fault-tolerant work that may be interrupted, not a steady web tier."
      ],
      dom: 4, tags: ["EC2 purchase options"], doc: "savings-plans"
    },
    docs: [
      ["Amazon EC2 billing and purchasing options", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html"],
      ["Savings Plans types", "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html"],
      ["Burstable performance instances", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances.html"]
    ]
  },

  c3c: {
    head: "Where a three-tier application keeps its data",
    why: "Your web servers save uploaded profile pictures to their own disks. When Auto Scaling replaces a server, its pictures vanish, and a user who lands on another server sees a broken image. The data has to outlive the servers, and some of it must be seen by every server at once.",
    idea: "So you choose storage by who must reach the data and how long it must live (Day 2). EBS is one server's disk, EFS holds files that every server shares, S3 holds objects. Lifecycle rules then move data that has gone cold to cheaper storage.",
    k: [
      ["Snapshots move EBS data", "Snapshots are incremental and stored in S3. A snapshot can be restored as a volume in any Availability Zone of the Region."],
      ["Instance store for scratch data", "Ideal for buffers, caches and scratch data. It is disk physically attached to the host, so its data is lost when the instance stops, hibernates or terminates."],
      ["EFS in every zone", "EFS grows and shrinks automatically and has one mount target per Availability Zone. The mount target's security group must allow NFS (TCP 2049) from the instances."],
      ["Lifecycle rules move cold data", "EFS lifecycle management moves files not accessed for a set time to Infrequent Access. S3 Lifecycle rules have two kinds of action: transitions to another storage class, and expirations that delete."],
      ["Standard-IA or One Zone-IA", "Both S3 classes still give millisecond access. One Zone-IA data is not resilient to the loss of its Availability Zone."]
    ],
    trap: "Servers in an Auto Scaling group must not keep shared files on their own EBS volume or instance store. Each instance sees only its own copy, and a replacement starts without it. Shared files go to EFS, uploads and static assets to S3.",
    q: {
      q: "Web servers copy their logs to S3 every night. The logs are read during the first week, rarely after that, and must be gone after 90 days. How do you keep the cost down without writing a script?",
      o: [
        "An S3 Lifecycle rule that moves the logs to Standard-IA and later expires them",
        "EBS snapshots of each server's log volume, deleted by hand after 90 days",
        "Instance store on each server, which clears itself whenever the server stops",
        "An EFS file system whose lifecycle management moves old files to Infrequent Access"
      ],
      a: [0],
      x: [
        "Right. A Lifecycle rule has both kinds of action: a transition to a cheaper storage class, and an expiration that deletes.",
        "Snapshots copy whole volumes, and deleting them by hand is the manual work the team wants to avoid.",
        "Instance store loses its data on a stop, before anyone has read the logs, and nothing decides when that happens.",
        "EFS lifecycle management moves files that are not accessed to Infrequent Access. Deleting them on a schedule is what an S3 expiration does."
      ],
      dom: 4, tags: ["S3 storage classes & lifecycle"], doc: "s3"
    },
    docs: [
      ["Storage options for your Amazon EC2 instances", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Storage.html"],
      ["How Amazon EFS works", "https://docs.aws.amazon.com/efs/latest/ug/how-it-works.html"],
      ["Managing the lifecycle of objects", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html"]
    ]
  },

  c3d: {
    head: "Seeing how the servers are doing, and spreading users over them",
    why: "Users complain the shop is slow every evening, but nobody can say whether the servers are short of CPU, memory or disk. And when one server hangs, the users sent to it get errors. You need numbers that show what is wrong, alarms that tell you, and one address that sends users only to servers that work.",
    idea: "CloudWatch collects the metrics and logs and raises the alarms (Day 2). An Application Load Balancer gives users one address and routes each request, by its rules, to a healthy server.",
    k: [
      ["Memory and disk need the agent", "EC2 sends metrics every 5 minutes by default, and every minute with detailed monitoring. Status check metrics are always 1-minute. Memory and disk-space use come only from the CloudWatch agent."],
      ["Composite alarms cut the noise", "A composite alarm combines other alarms with Boolean logic. For example, it notifies only when both the CPU alarm and the memory alarm have triggered."],
      ["Logs: retention and metric filters", "CloudWatch Logs keeps log data indefinitely unless you set a retention period on the log group. A metric filter turns a pattern found in the logs into a metric that you can graph or set an alarm on."],
      ["Listener rules share one load balancer", "A listener evaluates its rules, for example on host name or path, in priority order, and forwards to a target group. So one load balancer can serve several services."],
      ["Servers stay private behind it", "An Application Load Balancer reaches targets on their private IP addresses, so the servers need no public IPs. They sit in private subnets and allow traffic from the load balancer's security group."]
    ],
    trap: "Detailed monitoring adds no memory or disk-space metrics: it only delivers the metrics EC2 already sends in 1-minute periods. An alarm on memory or free disk space first needs the CloudWatch agent on the instance.",
    q: {
      q: "On-call engineers are woken at night by CPU alarms that turn out to be harmless whenever memory use is normal. They want to be paged only when CPU and memory are high at the same time. What do you set up?",
      o: [
        "A composite alarm on both the CPU alarm and the memory alarm",
        "Detailed monitoring, so that the CPU alarm sees 1-minute data points",
        "A longer retention period on the log group of the instances",
        "A listener rule on the load balancer that ignores busy targets"
      ],
      a: [0],
      x: [
        "Right. A composite alarm combines other alarms with Boolean logic to reduce noise, here CPU AND memory.",
        "Finer data points do not make the CPU alarm look at memory. It would still page on CPU alone.",
        "Retention decides how long logs are kept. It does not change when an alarm pages anyone.",
        "Listener rules route requests by host name or path. They play no part in alarms."
      ],
      dom: 2, tags: ["CloudWatch"], doc: "cloudwatch"
    },
    docs: [
      ["Monitor your instances using CloudWatch", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch.html"],
      ["Composite alarms", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-combining.html"],
      ["How Elastic Load Balancing works", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"]
    ]
  },

  c3e: {
    head: "Enough servers at every hour, and none that matters alone",
    why: "A ticket site runs the same number of servers all year. The night a big concert goes on sale they are overwhelmed, and on quiet days most of them idle. When one crashes, the users on it lose their baskets. The number of servers has to follow the load, and no single server may hold anything users would lose.",
    idea: "An Auto Scaling group keeps the right number of servers running and replaces the ones that fail (Day 2). Resilience adds the rest: enough capacity in each zone to lose one, and user state kept outside the instances.",
    k: [
      ["Scale on a metric or a date", "Target tracking needs a metric that changes in inverse proportion to capacity, such as average CPU. Known dates use scheduled actions: the group changes its capacity at the times you set."],
      ["Let the load balancer judge health", "By default the group judges health by EC2 status checks, so an instance that runs with a hung application is kept. Turn on Elastic Load Balancing health checks to replace instances the load balancer reports as unhealthy."],
      ["Static stability", "Run enough instances in each Availability Zone to carry the load if one zone is removed, instead of relying on launches during the failure. Needing 4 instances over 3 zones means 2 per zone."],
      ["Keep instances disposable", "Session state belongs in a store outside the instances, such as ElastiCache, and files in S3 or EFS. Sticky sessions bind a user's session to one target with a cookie, so that session is lost with the target."]
    ],
    trap: "Sticky sessions are a stopgap, not high availability. When the stem says any instance may be terminated without users noticing, move state out of the instance. One zonal component, such as a single NAT gateway or a Single-AZ database, undoes a multi-AZ web tier.",
    q: {
      q: "Shoppers lose their baskets whenever the Auto Scaling group scales in and terminates an instance. The load balancer uses sticky sessions. What lets any instance go without shoppers noticing?",
      o: [
        "Keep the session state in ElastiCache instead of on the instances",
        "Make the sticky-session cookie last longer",
        "Turn on Elastic Load Balancing health checks for the group",
        "Raise the group's minimum so that it never scales in"
      ],
      a: [0],
      x: [
        "Right. With session state in a store outside the instances, any instance can be terminated and the next one picks up the basket.",
        "A sticky session still lives on one target, so it is lost when that target is terminated, however long the cookie lasts.",
        "Health checks decide which instances are replaced. They do not keep the state of an instance that goes away.",
        "That keeps paying for idle servers, and a failed instance would still take its baskets with it."
      ],
      dom: 2, tags: ["High availability design"], doc: "autoscaling"
    },
    docs: [
      ["Target tracking scaling policies for Amazon EC2 Auto Scaling", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html"],
      ["About the health checks for your Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html"],
      ["REL11-BP05 Use static stability to prevent bimodal behavior", "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_withstand_component_failures_static_stability.html"]
    ]
  },

  c3f: {
    head: "One requirement, one choice: the three-tier design as a whole",
    why: "Each part of the design looked right on its own. Then a test switches off one zone, and the site goes down anyway, because the only NAT gateway and the database both sat in that zone. The parts work as a system only when every tier survives a zone failure and accepts traffic only from the tier in front of it.",
    idea: "This step puts the pieces together into one design. It ties each requirement to the one choice that meets it.",
    k: [
      ["The request path", "An internet-facing load balancer in public subnets, an Auto Scaling group of servers in private subnets, and a Multi-AZ database in subnets with no internet route. Every tier spans at least two Availability Zones."],
      ["Chained security groups", "The load balancer accepts client traffic. The servers accept traffic only from the load balancer's security group, and the database only from the servers' security group. No rule depends on instance IP addresses."],
      ["One requirement, one choice", "Survive a zone failure: every tier in two zones and a Multi-AZ database. Changing load: Auto Scaling with target tracking. Reports slowing the primary: a read replica, since the Multi-AZ standby serves no reads."],
      ["Internal load balancer in the middle", "A separate application tier is load balanced too. The web servers call it through an internal load balancer, whose nodes have only private IP addresses. Only the first load balancer is internet-facing."],
      ["The database's subnets and failover", "RDS needs a DB subnet group with subnets in two zones, advised even for Single-AZ so you can convert later. On failover RDS repoints the instance's DNS record to the standby, so the endpoint name does not change."]
    ],
    trap: "More capacity is not more availability. A bigger instance, or more instances in the same zone, still fails with that zone. A Multi-AZ standby adds no read capacity. Match the option to the stem's word: available, scalable or recoverable.",
    q: {
      q: "The web servers of a three-tier design call a separate application tier that runs in two zones. The application tier must take requests from the web servers only, never from the internet. How do the web servers reach it?",
      o: [
        "Through an internal load balancer, whose nodes have only private IP addresses",
        "Through the internet-facing load balancer, with a second listener rule",
        "Directly at each application server's public IP address",
        "Through a NAT gateway placed in front of the application tier"
      ],
      a: [0],
      x: [
        "Right. An internal load balancer spreads the calls over the application servers in both zones and has only private addresses, so the internet cannot reach it.",
        "The internet-facing load balancer accepts traffic from the internet, which the application tier must never get.",
        "Public addresses would expose the servers, and fixed addresses break as Auto Scaling replaces instances.",
        "A NAT gateway lets private instances connect out. It does not spread incoming calls over servers."
      ],
      dom: 2, tags: ["Load balancing"], doc: "elb"
    },
    docs: [
      ["Example: VPC with servers in private subnets and NAT", "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-example-private-subnets-nat.html"],
      ["How Elastic Load Balancing works", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"],
      ["Multi-AZ DB instance deployments for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html"]
    ]
  },

  l3a: {
    head: "A web page with a serverless backend, and where to look when it breaks",
    why: "A club's sign-up page is a set of files in an S3 bucket. Members fill in the form, press Send, and nothing is saved, because files alone cannot store anything. The page needs a backend, and when a joint between the parts fails, you need to know where to look.",
    idea: "The lab joins the bucket to API Gateway, a Lambda function and a DynamoDB table, none of them a server you run. Doing it by hand shows where to look when one joint does not work.",
    k: [
      ["Static and dynamic parts", "S3 static website hosting serves static content and client-side scripts only. Anything dynamic happens when the script in the browser calls an API: here API Gateway, which invokes Lambda, which writes to DynamoDB."],
      ["Start with the function's logs", "Lambda sends the logs of every invocation to CloudWatch Logs, by default to the log group <code>/aws/lambda/&lt;function-name&gt;</code>, provided the execution role has the permissions."],
      ["Invoke permission and a redeploy", "It gets permission to invoke a function from the function's resource-based policy, or from an IAM role it assumes. Every change to a REST API must be redeployed to a stage before callers see it."],
      ["What makes it answer 502", "With Lambda proxy integration the function must return the expected format. Any other output makes API Gateway answer 502 Bad Gateway."],
      ["Calls across domains need CORS", "A page that calls an API on a different domain makes a cross-origin request. The API must then return an <code>Access-Control-Allow-Origin</code> header."]
    ],
    trap: "A browser's CORS error is not fixed in the bucket or by opening a security group. The API has to return the <code>Access-Control-Allow-Origin</code> header, and a change to a REST API reaches callers only after a redeploy.",
    q: {
      q: "The sign-up function behind your API fails for some members, and you want to see what each failed invocation printed. Where do you look first?",
      o: [
        "In CloudWatch Logs, in the log group <code>/aws/lambda/&lt;function-name&gt;</code>",
        "In the S3 bucket that serves the sign-up page to members",
        "In the DynamoDB table that stores the members who signed up",
        "In the CloudWatch agent's log file on the server that runs the function"
      ],
      a: [0],
      x: [
        "Right. Lambda sends the logs of every invocation to CloudWatch Logs, to that log group by default, as long as the execution role allows it.",
        "The bucket only serves the page's files. It records nothing about what the function did.",
        "The table holds the sign-ups that were saved. A failed invocation may not have written anything to it.",
        "There is no server of yours to install an agent on. Lambda sends the logs to CloudWatch Logs by itself."
      ],
      dom: 2, tags: ["CloudWatch"], doc: "cloudwatch"
    },
    docs: [
      ["Hosting a static website using Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html"],
      ["Sending Lambda Event Function logs to CloudWatch Logs", "https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html"],
      ["CORS for REST APIs in API Gateway", "https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html"]
    ]
  },

  l3b: {
    head: "Let each tier talk only to the tier in front of it",
    why: "An attacker breaks into one web server through a bug in its software. Because every server in the VPC accepts traffic from every other, the next stop is the database with all the customer records. Each tier should accept traffic only from the tier in front of it, so that one break-in stays one break-in.",
    idea: "You build that with a security group per tier, each allowing only the group in front of it, and with network ACLs at the subnet edge. The lab shows where the two firewalls behave differently.",
    k: [
      ["One group per tier", "Give each tier its own security group, and let it accept traffic only from the security group of the tier in front. A rule that references a security group covers every instance in that group, whatever its address."],
      ["Stateful or stateless", "Security groups are stateful and hold allow rules only, so replies to allowed traffic always pass. Network ACLs are stateless and work at the subnet level. Return traffic must be allowed explicitly, including the ephemeral reply ports."],
      ["Blocking an address range", "Network ACL rules are evaluated from the lowest number, and the first match applies. Add a deny rule with a lower number than the allow rule it must beat. A security group cannot deny."],
      ["What each starts with", "The default network ACL allows all traffic in and out, while a new custom one blocks everything until you add rules. A new security group has no inbound rules and one outbound rule that allows all traffic."]
    ],
    trap: "When only the web tier may reach the database, the answer is an inbound rule on the database's security group. Its source is the web tier's security group. A rule on IP addresses breaks as instances are replaced.",
    q: {
      q: "Requests from one abusive address range flood a public subnet. Its security groups allow HTTPS from anywhere, and the subnet's network ACL allows HTTPS in rule 100. How do you block that range?",
      o: [
        "Add a deny rule for the range to the network ACL with a number lower than 100",
        "Add a deny rule for the range to the security groups of the web servers",
        "Add a deny rule for the range to the network ACL with a number higher than 100",
        "Remove the outbound rule from the web servers' security groups"
      ],
      a: [0],
      x: [
        "Right. Network ACL rules are evaluated from the lowest number and the first match applies, so the deny must come before rule 100.",
        "A security group holds allow rules only. It cannot deny a range.",
        "Rule 100 would match the HTTPS requests first and allow them, so a higher-numbered deny is never reached.",
        "Security groups are stateful: replies to allowed requests pass anyway. Removing the outbound rule does not stop the requests coming in."
      ],
      dom: 1, tags: ["Security groups & NACLs"], doc: "vpc"
    },
    docs: [
      ["Infrastructure security in Amazon VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html"],
      ["Security group rules", "https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html"],
      ["Network ACL rules", "https://docs.aws.amazon.com/vpc/latest/userguide/nacl-rules.html"]
    ]
  },

  l3c: {
    head: "Build every tier across two zones, and find what blocks it",
    why: "On paper, every tier of the design sits in two zones. On the day you build it, the web servers cannot mount the shared files, and the servers in one zone never get any traffic. What each tier needs before it can survive a failure, and what to check when one piece cannot reach the next, you learn by building it.",
    idea: "The lab builds a multi-tier application across Availability Zones. Its page names CloudFormation for the network, Amazon RDS for the database and Amazon EFS for the shared files.",
    k: [
      ["Database tier", "A Multi-AZ DB instance keeps a synchronous standby in another Availability Zone. It fails over by repointing the instance's DNS record, so the application keeps its endpoint. The DB subnet group must cover two zones."],
      ["Shared storage tier", "EFS gives the web servers in every zone the same file system through a mount target in each zone. If a mount times out, check that the mount target's security group allows inbound TCP 2049 from the servers."],
      ["Web tier", "An Auto Scaling group across the same zones as the load balancer. A target in a zone that is not enabled on an Application Load Balancer shows as <code>unused</code> and receives no requests."],
      ["Network from a template", "A CloudFormation stack is a collection of resources created, updated and deleted as a single unit. Deleting the stack deletes its resources, except those a deletion policy retains."]
    ],
    q: {
      q: "After the build, the load balancer lists the web servers of one zone as <code>unused</code>, and they receive no requests. The servers in the other zone work. What do you fix?",
      o: [
        "Enable that Availability Zone on the Application Load Balancer",
        "Attach an Elastic IP address to each server in that zone",
        "Allow inbound TCP 2049 in the web servers' security group",
        "Convert the database to a Multi-AZ DB instance"
      ],
      a: [0],
      x: [
        "Right. A target in a zone that is not enabled on an Application Load Balancer shows as <code>unused</code> and receives no requests.",
        "The load balancer reaches targets on their private IP addresses. Public addresses do not change which zones it serves.",
        "TCP 2049 is for EFS mounts, on the mount target's security group. It does not decide whether the load balancer sends requests.",
        "The database tier does not decide where the load balancer sends requests. The web tier's zone setting does."
      ],
      dom: 2, tags: ["Load balancing"], doc: "elb"
    },
    docs: [
      ["Multi-AZ DB instance deployments for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html"],
      ["How Amazon EFS works", "https://docs.aws.amazon.com/efs/latest/ug/how-it-works.html"],
      ["Health checks for Application Load Balancer target groups", "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html"]
    ]
  }
});
