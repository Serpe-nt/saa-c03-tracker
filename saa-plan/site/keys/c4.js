// Key points per plan step for the course "Designing a Containerized Architecture" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c4a: {
    head: "Containers: one package that runs the same everywhere",
    why: "An app runs fine on a developer's laptop and crashes on the test server, because the server has an older version of a library. The team tries one virtual machine per app, and now every small service drags a whole operating system along. You need a package that carries the app with everything it needs, small enough to run many side by side.",
    idea: "A container is that package (Day 1). It shares the host's operating system instead of carrying its own, so it stays small. Its image is stored in a registry, and an orchestrator runs many containers for you.",
    k: [
      ["Smaller than a virtual machine", "A container virtualizes the operating system, not the hardware. Because it shares the host's operating system, its images are measured in MB rather than GB."],
      ["Image and registry", "An image is a read-only template, typically built from a Dockerfile. Images live in a registry: on AWS, Amazon ECR, with private repositories under IAM permissions, scanning on push and lifecycle policies."],
      ["Treat containers as disposable", "A bind mount and Fargate's task storage are ephemeral. Data that must outlive a task goes to a database, to S3 or to an EFS volume. EFS is persistent and gives tasks the same files wherever they run."],
      ["Built for microservices", "Each service has one function and is deployed and scaled on its own, and one faulty container does not affect the others. An orchestrator such as Amazon ECS or Amazon EKS deploys, manages and scales the containers."],
      ["Lambda runs images too, briefly", "Lambda can run a container image stored in ECR, but a function is for short-lived work: up to 15 minutes per invocation of a standard function. Long-running services and batch containers belong on ECS or EKS."]
    ],
    trap: "A container does not always mean Fargate. A workload that needs privileged access to the host, a custom AMI or a specific instance type needs EC2 instances under its containers. With Fargate you manage no servers, so none of that is yours to set.",
    q: {
      q: "A containerized app on Fargate saves uploaded files to its task storage. After each deployment replaces the tasks, the files are gone. Where should the files go so that they last and every task sees them?",
      o: [
        "An EFS volume mounted into the tasks",
        "Larger ephemeral storage for each task",
        "A bind mount inside each task",
        "A new image built with the files in it"
      ],
      a: [0],
      x: [
        "Right. EFS is persistent and gives tasks the same files wherever they run.",
        "More task storage is still ephemeral: it goes away with the task.",
        "A bind mount is ephemeral too, and each task would see only its own files.",
        "An image is a read-only template. Files uploaded while the app runs would still not be shared or kept."
      ],
      dom: 2, tags: ["Containers"], doc: "ecs"
    },
    docs: [
      ["Architect your solution for Amazon ECS", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-configuration.html"],
      ["What is Amazon Elastic Container Registry?", "https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html"],
      ["Storage options for Amazon ECS tasks", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html"]
    ]
  },

  c4b: {
    head: "Running many containers: ECS or EKS, on Fargate or on EC2",
    why: "A shop splits its app into twenty containers on eight servers. One night a server dies, four containers die with it, and someone has to start them elsewhere by hand. Many containers on many servers must be placed, restarted when they fail and scaled with the load, without anyone doing it by hand.",
    idea: "An orchestrator does that: Amazon ECS, AWS's own, or Amazon EKS, managed Kubernetes. Separately, you choose who runs the servers underneath: Fargate, your own EC2 instances, or ECS Managed Instances.",
    k: [
      ["ECS or EKS", "Amazon ECS is AWS's own fully managed orchestrator, with no control plane for you to manage. Amazon EKS is managed Kubernetes: AWS runs the control plane and you keep Kubernetes tooling. EKS fits a team that already runs Kubernetes or needs portability."],
      ["Who runs the servers", "Fargate is serverless: no servers to manage, you state CPU and memory per task. EC2 instances are yours to select and maintain, and fit GPUs or custom AMIs. With ECS Managed Instances AWS manages the instances."],
      ["Task definition, task, service", "A task definition is the blueprint: image, CPU and memory, ports, volumes. A task is one running copy of it. A service keeps the desired number of tasks, replaces any that fail and can sit behind a load balancer. Service Auto Scaling changes the number."],
      ["Three roles, three jobs", "The task role is what the application code in the container uses to call AWS services. The task execution role lets ECS pull the image, send logs and read referenced secrets. The container instance role belongs to the EC2 host and its agent."],
      ["Watching containers", "ECS sends cluster and service CPU and memory metrics to CloudWatch automatically. Container Insights adds task and container metrics and diagnostics such as restart failures. The <code>awslogs</code> log driver sends container output to CloudWatch Logs."]
    ],
    trap: "The task role and the task execution role get swapped. When the code in a container is denied access to an AWS service, fix the task role. When ECS cannot pull the image or send the logs, look at the task execution role.",
    q: {
      q: "Code running in an ECS task must read objects from an S3 bucket. Where do you grant the S3 permission?",
      o: [
        "In the task role named in the task definition",
        "In the task execution role named in the task definition",
        "In the container instance role of the EC2 hosts",
        "In an access key stored in the container's environment"
      ],
      a: [0],
      x: [
        "Right. The task role is what the application code in the container uses to call AWS services.",
        "The task execution role is for ECS itself: pulling the image, sending logs and reading referenced secrets.",
        "That role belongs to the EC2 host and its agent, not to the code in each task.",
        "A stored access key is a long-term secret to protect and rotate. A role gives the code temporary credentials instead."
      ],
      dom: 1, tags: ["Containers"], doc: "ecs"
    },
    docs: [
      ["Architect your solution for Amazon ECS", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-configuration.html"],
      ["Amazon ECS task IAM role", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html"],
      ["Monitor Amazon ECS containers using Container Insights with enhanced observability", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-container-insights.html"]
    ]
  },

  c4c: {
    head: "Who may reach a bucket, and how its data survives mistakes",
    why: "An intern makes a bucket public to share one file with a supplier. The same evening, a script deletes half the objects in another bucket by mistake. A bucket needs layers that stop one wrong setting from exposing it. It also needs ways to get data back after an overwrite, a delete or a lost Region.",
    idea: "S3 grants access through policies, with Block Public Access as a safety net above them and an access point per application. Versioning, Object Lock and replication keep older versions and copies in another place.",
    k: [
      ["Private until a policy allows", "S3 resources are private by default, and ACLs are disabled by default (Object Ownership: bucket owner enforced), so access is granted with policies. As Day 5 showed, one account needs one Allow and two accounts need both sides."],
      ["Block Public Access wins", "It overrides bucket policies, access point policies and ACLs that would allow public access. Turned on for the account, it covers all current and future buckets. The most restrictive of the access point, bucket and account settings applies."],
      ["An access point per application", "A named endpoint on a shared bucket with its own policy, which can be limited to a VPC. A Multi-Region Access Point is one global endpoint for buckets in several Regions."],
      ["Versioning and Object Lock", "With versioning, an overwrite becomes a new version and a delete becomes a delete marker. Object Lock adds write-once retention: governance mode can be bypassed with a special permission, compliance mode by no user, root included."],
      ["Replication copies new objects", "It needs versioning on both buckets, is asynchronous and copies only objects written after it is set up. S3 Batch Replication handles existing ones. Deleting a specific version is never replicated, and delete markers are not by default."]
    ],
    trap: "A lifecycle rule only transitions or expires objects in its own bucket. A copy in another Region or account is replication. And with versioning on, every old version is charged as a full object until a rule expires noncurrent versions.",
    q: {
      q: "A team sets up replication from a bucket that already holds years of objects to a bucket in another Region. A week later the destination holds only the objects written since then. How do they copy the older ones?",
      o: [
        "Run S3 Batch Replication for the existing objects",
        "Wait, because replication copies older objects in the background",
        "Add a lifecycle rule that moves the objects to the other Region",
        "Turn versioning off and on again on the source bucket"
      ],
      a: [0],
      x: [
        "Right. Live replication copies only objects written after it is set up. S3 Batch Replication handles the existing ones.",
        "Live replication copies only new objects. The older ones stay behind however long you wait.",
        "A lifecycle rule only transitions or expires objects in its own bucket. Copies elsewhere are replication.",
        "Replication needs versioning on both buckets. Switching it off and on does not turn existing objects into new ones, so live replication still skips them."
      ],
      dom: 2, tags: ["S3 features"], doc: "s3"
    },
    docs: [
      ["Access control in Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-management.html"],
      ["Locking objects with Object Lock", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html"],
      ["Replicating objects within and across Regions", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html"]
    ]
  },

  c4d: {
    head: "Bringing users to your application fast, and around failures",
    why: "A game studio hosts everything in Ireland. Players in Tokyo see lag, a trailer loads slowly in Brazil, and when the Irish Region has trouble, nobody can play at all. Users far away need shorter paths and content near them, and a way to be steered to another Region when one fails.",
    idea: "Three services do this at the edge. CloudFront keeps copies of content near users. Route 53 decides which address a name resolves to. Global Accelerator carries traffic over the AWS network to a healthy endpoint.",
    k: [
      ["CloudFront caches by path", "It serves static and dynamic content from edge locations and goes to the origin only on a cache miss. A cache behavior ties a path pattern to one origin, so one distribution can serve a bucket and send <code>/api/*</code> to a load balancer."],
      ["Route 53 picks the answer", "The routing policy picks the DNS answer. Failover is for active-passive, weighted for proportions you set, latency for the Region with the best latency, geolocation for the user's location. Resolvers cache the answer for the record's TTL."],
      ["Global Accelerator gives fixed addresses", "Two static anycast IPv4 addresses. It takes TCP or UDP traffic onto the AWS network at the closest edge location. It routes it to a healthy endpoint: a load balancer, EC2 instance or Elastic IP address, in one or more Regions."],
      ["Which one to choose", "Cacheable web content means CloudFront. Non-HTTP traffic such as UDP gaming means Global Accelerator, and so does HTTP that needs static IP addresses or fast regional failover. A Route 53 alias record can point a domain at either."],
      ["Keep the origin private", "Keep an S3 origin private with origin access control. Keep a load balancer or EC2 instance in private subnets by using a VPC origin."]
    ],
    trap: "DNS failover is not instant: resolvers keep using a cached answer until its TTL ends. Global Accelerator redirects new connections as soon as an endpoint is unhealthy. Latency routing picks the lowest-latency Region, so a rule about where users live needs geolocation.",
    q: {
      q: "One domain must serve a website's pages from an S3 bucket and send every request under <code>/api/</code> to an Application Load Balancer, with caching at the edge for the pages. What do you build?",
      o: [
        "One CloudFront distribution with a cache behavior for <code>/api/*</code>",
        "Two Route 53 records with weighted routing, one per origin",
        "A Global Accelerator with the bucket and the load balancer as endpoints",
        "A latency routing policy that picks the bucket or the load balancer per user"
      ],
      a: [0],
      x: [
        "Right. A cache behavior ties a path pattern to one origin, so one distribution serves the bucket and forwards <code>/api/*</code> to the load balancer.",
        "Weighted routing splits users by proportion, not by path, and DNS adds no caching.",
        "Global Accelerator proxies TCP or UDP traffic at the edge to endpoints such as load balancers and instances. It does not cache pages or route by URL path.",
        "Latency routing picks a Region by latency. It cannot split one user's requests by path."
      ],
      dom: 3, tags: ["CloudFront"], doc: "cloudfront"
    },
    docs: [
      ["What is Amazon CloudFront?", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html"],
      ["Choosing a routing policy", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"],
      ["What is AWS Global Accelerator?", "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html"]
    ]
  },

  c4e: {
    head: "Keeping the database alive through a zone or a Region failure",
    why: "A payments company runs its database in one Region with a standby. A rare Region-wide outage stops every payment for hours, and the team finds out that the standby sat in the same Region. The database needs an answer for each size of failure, one instance, one zone or a whole Region, without losing data.",
    idea: "Amazon Aurora has one for each: copies across zones, replicas in the Region, and a global database across Regions. Application Recovery Controller (ARC) moves the traffic away from a zone or Region in trouble.",
    k: [
      ["The cluster volume spans three zones", "It holds copies of the data in three Availability Zones, whatever the number of instances. With no Aurora Replica, a failed primary is recreated in the same zone, typically in under 10 minutes. Promoting a replica is much faster."],
      ["Replicas and endpoints", "A cluster can have up to 15 Aurora Replicas, which serve reads and are failover targets. The cluster endpoint always points to the current primary. The reader endpoint balances connections across the replicas."],
      ["A global database spans Regions", "One primary Region for writes and read-only secondary Regions, with replication lag typically under a second. A planned switchover loses no data. A failover after an outage has an RPO of seconds and an RTO of minutes."],
      ["Aurora serverless for changing load", "For variable and unpredictable workloads (the lesson's Serverless v2). It scales each instance within a minimum and maximum capacity. With a minimum of 0 ACUs an idle instance pauses. A cluster can mix serverless and provisioned instances."],
      ["ARC moves the traffic", "A zonal shift temporarily moves a load balancer's traffic away from an impaired Availability Zone. Routing controls are on-off switches on Route 53 health checks that fail traffic over between Regions."]
    ],
    trap: "Multi-AZ, Aurora Replicas and the cluster volume's copies all sit in a single Region. Surviving a Region needs a global database or a cross-Region read replica, each with one place for writes. Writes accepted in every Region point to DynamoDB global tables.",
    q: {
      q: "An app writes to an Aurora cluster with three Aurora Replicas, and a reporting tool runs heavy reads. Writes must still reach the primary after a failover, and reports should spread over the replicas. Which endpoints do they use?",
      o: [
        "The app uses the cluster endpoint, the reporting tool the reader endpoint",
        "The app uses the primary instance's own endpoint, the reporting tool one replica's",
        "Both use the reader endpoint, which also forwards writes to the primary",
        "Both use the cluster endpoint, which also balances reads over the replicas"
      ],
      a: [0],
      x: [
        "Right. The cluster endpoint always points to the current primary, and the reader endpoint balances connections across the replicas.",
        "After a failover a replica becomes the primary, and the old instance's endpoint no longer reaches the writer. One replica would also carry all the reports.",
        "The reader endpoint balances connections across the replicas, which serve reads. Writes go through the cluster endpoint.",
        "The cluster endpoint points to the primary alone. Reports there would load the writer instead of the replicas."
      ],
      dom: 2, tags: ["Aurora"], doc: "aurora"
    },
    docs: [
      ["High availability for Amazon Aurora", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html"],
      ["Using Amazon Aurora Global Database", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html"],
      ["What is ARC?", "https://docs.aws.amazon.com/r53recovery/latest/dg/what-is-route53-recovery.html"]
    ]
  },

  c4f: {
    head: "A cache in front of the database, and the multi-Region design as a whole",
    why: "A news site runs the same few database queries for every visitor to its front page. On a big news day the database falls over, though the answers barely change from one minute to the next. Repeated reads need answers kept in memory near the application, so that the database only does the work that is new.",
    idea: "Amazon ElastiCache is that cache: it sits between the application and the database and keeps answers in memory. This step also puts the whole multi-Region design together, one requirement at a time.",
    k: [
      ["How the cache is filled", "With lazy loading the application fills the cache on a miss, so data can go stale. Write-through updates the cache on every database write. Adding a TTL combines the advantages of both."],
      ["Keeping the cache available", "Run Valkey or Redis OSS with replicas and Multi-AZ: when the primary fails, a read replica is promoted. Cluster mode enabled partitions data across shards for write-heavy load. A global datastore adds read-only clusters in other Regions."],
      ["Cache only what can be rebuilt", "With lazy loading a failed node is replaced by an empty one, and the application carries on with more database queries. Data that must survive in memory needs MemoryDB, or ElastiCache's newer durability option."],
      ["One requirement, one piece", "Cacheable content: CloudFront. Static IPs or non-HTTP: Global Accelerator. No servers to manage: Fargate. A database in two Regions: Aurora Global Database. Objects in two Regions: S3 replication."],
      ["Writes stay in one place", "One Aurora primary Region and one ElastiCache primary cluster take the writes. Regional failover means promoting the secondary database cluster and the secondary cache cluster, and shifting traffic to that Region."]
    ],
    trap: "Lazy loading alone serves stale data until an item is reloaded. When users see outdated values, the fix is write-through or a TTL, not a larger node. A cache is also not transparent: the application itself reads from it and writes to it.",
    q: {
      q: "A shop caches product prices in ElastiCache with lazy loading. After a price change, customers keep seeing the old price for hours. What fixes it?",
      o: [
        "Update the cache on every price write, or give cached items a TTL",
        "Move the cache to a larger node type with more memory",
        "Add read replicas to the cache cluster with Multi-AZ",
        "Turn on cluster mode so that data is spread across shards"
      ],
      a: [0],
      x: [
        "Right. Write-through updates the cache on every database write, and a TTL makes stale items expire so they are reloaded.",
        "A larger node holds more data, but the stale price stays in it until it is reloaded.",
        "Replicas keep the cache available when the primary fails. They copy the stale price too.",
        "Shards spread write-heavy load. They do not change when an item is reloaded."
      ],
      dom: 3, tags: ["Caching"], doc: "elasticache"
    },
    docs: [
      ["Caching strategies for Memcached", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"],
      ["Minimizing downtime in ElastiCache by using Multi-AZ with Valkey and Redis OSS", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/AutoFailover.html"],
      ["Replication across AWS Regions using global datastores", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Redis-Global-Datastore.html"]
    ]
  },

  l4a: {
    head: "From an image on your machine to a running task",
    why: "A developer builds an image on their laptop and asks the cluster to run it. The task fails to start. The cluster cannot see the laptop, has no permission to fetch the image, and sits in a subnet with no way out. An image has to be stored where the cluster can fetch it, with permission and a network path to get there.",
    idea: "Amazon ECR stores the image, the task execution role lets ECS pull it, and the task's subnet gives it a route. The lab takes you through each step between an image and a running task.",
    k: [
      ["Pushing to ECR takes three steps", "Authenticate Docker with <code>aws ecr get-login-password</code> (the token is valid for 12 hours). Tag the image as <code>aws_account_id.dkr.ecr.region.amazonaws.com/repository:tag</code>. Then push it."],
      ["Task definition and execution role", "The task definition names the image and, for Fargate, the CPU and memory of the task. The task execution role lets ECS pull the image from a private ECR repository and send container logs to CloudWatch Logs."],
      ["A network path to the image", "A Fargate task gets its own network interface in your subnet and needs a route to pull its image. That is a public IP address in a public subnet, a NAT gateway for a private subnet, or VPC endpoints for ECR."],
      ["Fargate or EC2 capacity", "With Fargate you manage no servers: you run a task, or a service that keeps a number of tasks running. On EC2 capacity the cluster first needs container instances that you select, configure and maintain."]
    ],
    q: {
      q: "A Fargate task in a private subnet fails because it cannot pull its image from ECR. The task execution role is correct, and the subnet has no NAT gateway. What gives the task a way to its image?",
      o: [
        "A NAT gateway route for the subnet, or VPC endpoints for ECR",
        "A larger CPU and memory size in the task definition",
        "Pushing the image again with a new tag",
        "Adding the ECR permissions to the task role as well"
      ],
      a: [0],
      x: [
        "Right. The task needs a route to pull its image: from a private subnet that is a NAT gateway or VPC endpoints for ECR.",
        "CPU and memory decide what the task can run. They give it no route to the registry.",
        "A new tag does not change the network. The task still has no path to ECR.",
        "Pulling the image is the task execution role's job, and that role is already correct. What is missing is a network path."
      ],
      dom: 2, tags: ["Containers"], doc: "ecr"
    },
    docs: [
      ["Pushing a Docker image to an Amazon ECR private repository", "https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html"],
      ["Amazon ECS task networking options for Fargate", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html"],
      ["Amazon ECS task execution IAM role", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html"]
    ]
  },

  l4d: {
    head: "Roll out a new version, and scale an ECS service",
    why: "A team ships a fix by stopping every task and starting new ones, and the site is down while they start. Then traffic doubles, they ask for twice the tasks, and half of the new ones never start. Containers must be replaced and their number changed without an outage, with room for every new task.",
    idea: "An ECS service does both. It rolls out a new revision of the task definition a few tasks at a time, and keeps the desired number of tasks running. On EC2 capacity, the instances underneath have to grow too.",
    k: [
      ["A new revision rolls out", "To change a task definition you create a new revision. A service keeps running the old one until you update the service. ECS then replaces tasks in a rolling update, within the minimum healthy percent and maximum percent."],
      ["The desired count is kept", "A service maintains the desired number of tasks: when a task fails or stops, the scheduler launches another. Scaling the application means raising that number, by hand or with Service Auto Scaling."],
      ["Two layers to scale on EC2", "More tasks need container instances with room for them, or they cannot be placed. With managed scaling on an Auto Scaling group capacity provider, ECS scales the instances for you."],
      ["Several tasks on one instance", "Dynamic port mapping lets several tasks of one service run on the same container instance behind an Application Load Balancer. Each task gets a host port from the ephemeral range and is registered as an instance ID and port."]
    ],
    q: {
      q: "An ECS service on EC2 capacity runs 4 tasks. You raise the desired count to 8, but the 4 new tasks cannot be placed. What is missing?",
      o: [
        "Room on the container instances, for example through managed scaling",
        "A new revision of the task definition for the extra tasks",
        "A rolling update with a lower minimum healthy percent",
        "A second Application Load Balancer for the extra tasks"
      ],
      a: [0],
      x: [
        "Right. On EC2 capacity there are two layers to scale. More tasks need container instances with room for them, and managed scaling can add them for you.",
        "The same revision can run any number of tasks. A new revision is for changing what the tasks run.",
        "The minimum healthy percent shapes a deployment. It does not create room for more tasks.",
        "One load balancer can front all of the service's tasks. Placement fails before any load balancing happens."
      ],
      dom: 3, tags: ["Containers"], doc: "ecs"
    },
    docs: [
      ["Amazon ECS services", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_services.html"],
      ["Deploy Amazon ECS services by replacing tasks", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html"],
      ["Use an Application Load Balancer for Amazon ECS", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/alb.html"]
    ]
  },

  l4b: {
    head: "Names for servers inside a VPC, answered only inside it",
    why: "An app finds its database by the server's IP address. The database server is replaced one night, comes back with a new address, and the app stops working. Servers inside a VPC should find each other by names that survive a replacement, and those internal names should not be answered on the internet.",
    idea: "A Route 53 private hosted zone holds such names and answers them only inside the VPCs you associate with it. In the lab you set one up and point names at things that stay.",
    k: [
      ["Private hosted zone", "It holds the records Route 53 uses to answer queries inside the VPCs associated with it. To use one, the VPC settings <code>enableDnsHostnames</code> and <code>enableDnsSupport</code> must both be true."],
      ["A, CNAME and alias records", "An A record maps a name to an IPv4 address. A CNAME maps a name to another name and cannot be created at the zone apex. An alias record, Route 53's extension for AWS resources, works at the apex and follows the resource's changing addresses."],
      ["Point at something stable", "An instance's private IP address is released when the instance is terminated, so an A record that holds it breaks when the instance is replaced. Point names at a load balancer through an alias record, or at another name through a CNAME."],
      ["More VPCs, other accounts", "More VPCs can be associated with a private hosted zone, including VPCs of another account after authorization."],
      ["Split-view DNS", "A public and a private zone can share one name. Inside the associated VPCs the private zone is used."]
    ],
    q: {
      q: "You create a private hosted zone and associate it with a VPC, but instances there cannot resolve its names. The VPC has <code>enableDnsSupport</code> set to true and <code>enableDnsHostnames</code> set to false. What do you change?",
      o: [
        "Set <code>enableDnsHostnames</code> to true as well",
        "Make the hosted zone public so that it answers everyone",
        "Replace each A record with a CNAME at the zone apex",
        "Associate the zone with a second VPC in another account"
      ],
      a: [0],
      x: [
        "Right. A private hosted zone needs both <code>enableDnsHostnames</code> and <code>enableDnsSupport</code> set to true in the VPC.",
        "A public zone would answer the names on the internet, which internal names must avoid. The VPC setting is what is missing.",
        "A CNAME cannot be created at the zone apex, and the record type is not why resolution fails here.",
        "Another association does not fix this VPC. Its own DNS settings are incomplete."
      ],
      dom: 3, tags: ["Route 53"], doc: "route53"
    },
    docs: [
      ["Working with private hosted zones", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-private.html"],
      ["Considerations when working with a private hosted zone", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zone-private-considerations.html"],
      ["Choosing between alias and non-alias records", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html"]
    ]
  },

  l4c: {
    head: "Put CloudFront in front of a website, and keep the origin closed",
    why: "A shop's product pages come from one server in Ireland. Visitors in Australia wait for every image, and anyone who learns the server's address can bypass the delivery network and hit it directly. Content must be served from near the users, with the origin closed to everyone but CloudFront.",
    idea: "CloudFront keeps copies at edge locations near the users. Setting it up by hand shows how long a copy lives, which kind of origin you have, and how to let only CloudFront reach it.",
    k: [
      ["How long a copy lives", "On a miss the edge location gets the object from the origin and caches it. Later requests are served from the edge until it expires: 24 hours by default when no cache policy is used. Replacing a file sooner takes an invalidation or a versioned file name."],
      ["Custom origins", "A web server on EC2 and an S3 website endpoint are both custom origins. With a website endpoint CloudFront cannot use HTTPS to the origin and cannot use origin access control. A public website needs publicly readable content."],
      ["Private origins", "For a private bucket, use the bucket itself (not its website endpoint) as the origin, with origin access control. For a load balancer or instance in private subnets, use a VPC origin, which makes CloudFront the single point of entry."],
      ["HTTPS for viewers", "On the distribution's own <code>cloudfront.net</code> name CloudFront provides the certificate, and the viewer protocol policy can redirect HTTP to HTTPS. Your own domain name needs an ACM certificate in us-east-1."]
    ],
    q: {
      q: "You replace <code>logo.png</code> on the origin of a CloudFront distribution that uses no cache policy. Hours later, visitors still see the old logo. How do you get the new one out now?",
      o: [
        "Create an invalidation for the file, or publish it under a versioned file name",
        "Restart the origin server so that the edge locations reconnect",
        "Switch the viewer protocol policy to redirect HTTP to HTTPS",
        "Add origin access control so that the edges fetch the file again"
      ],
      a: [0],
      x: [
        "Right. Edges serve their copy until it expires, 24 hours by default without a cache policy. An invalidation or a new file name replaces it sooner.",
        "The edges do not ask the origin again until their copy expires, however the origin is restarted.",
        "The viewer protocol policy decides HTTP or HTTPS for viewers. It does not refresh cached copies.",
        "Origin access control keeps a bucket origin private. It does not make the edges drop their copies."
      ],
      dom: 3, tags: ["CloudFront"], doc: "cloudfront"
    },
    docs: [
      ["Use various origins with CloudFront distributions", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html"],
      ["Manage how long content stays in the cache (expiration)", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html"],
      ["Restrict access with VPC origins", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-vpc-origins.html"]
    ]
  }
});
