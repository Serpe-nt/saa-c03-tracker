// DATA ONLY: the diagram for lecture course 4 and its labs (format: site/diagram.js, rules: docs/diagrams.md).
window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.c4 = {
  title: "A containerized web application on Amazon ECS and AWS Fargate",
  why: "Containers must be started, kept healthy and scaled with the load across many servers, while users far away still expect fast answers and the data must survive a failure. Here CloudFront serves the users, a load balancer spreads requests over an ECS service of Fargate tasks in two Availability Zones, and Aurora and ElastiCache hold the data behind them.",
  w: 22, h: 15.5,
  areas: [
    { id: "edge", label: "Edge locations", x: 3.6, y: 0.2, w: 5.6, h: 2.0, kind: "edge" },
    { id: "region", label: "AWS Region", x: 0.3, y: 2.6, w: 21.4, h: 12.6 },
    { id: "vpc", label: "VPC", x: 0.7, y: 3.2, w: 15.0, h: 11.6 },
    { id: "pub", label: "Public subnets, one per AZ", x: 1.0, y: 3.8, w: 14.3, h: 2.7, kind: "public" },
    { id: "priv", label: "Private subnets, one per AZ", x: 1.0, y: 6.9, w: 14.3, h: 7.6, kind: "private" },
    { id: "svc", label: "ECS service on Fargate", x: 1.4, y: 7.5, w: 13.6, h: 2.7, dash: true },
    { id: "aurora", label: "Aurora DB cluster", x: 1.4, y: 11.3, w: 9.7, h: 2.8, dash: true }
  ],
  nodes: [
    { id: "users", label: "Users", x: 0.4, y: 0.75, w: 2.6, h: 1.1 },
    { id: "cloudfront", label: "Amazon CloudFront", x: 4.0, y: 0.8, w: 4.8, h: 1.05 },
    { id: "alb", label: "Application Load Balancer", x: 3.0, y: 5.0, w: 10.4, h: 1.2 },
    { id: "task-a", label: "Fargate task, AZ A", x: 2.2, y: 8.3, w: 5.2, h: 1.4 },
    { id: "task-b", label: "Fargate task, AZ B", x: 9.4, y: 8.3, w: 5.2, h: 1.4 },
    { id: "writer", label: "Writer, AZ A", x: 3.0, y: 12.1, w: 3.6, h: 1.4 },
    { id: "replica", label: "Aurora Replica, AZ B", x: 7.0, y: 12.1, w: 3.8, h: 1.4 },
    { id: "cache", label: "Amazon ElastiCache", x: 11.5, y: 12.1, w: 3.4, h: 1.4 },
    { id: "s3", label: "Amazon S3 bucket", x: 18.5, y: 2.9, w: 3.0, h: 1.2 },
    { id: "ecr", label: "Amazon ECR", x: 18.5, y: 7.7, w: 3.0, h: 1.2 },
    { id: "logs", label: "Amazon CloudWatch", x: 18.5, y: 9.7, w: 3.0, h: 1.2 }
  ],
  links: [
    ["users", "cloudfront"],
    ["cloudfront", "s3", "static files"],
    ["cloudfront", "alb", "/api/*"],
    ["alb", "task-a"],
    ["alb", "task-b"],
    ["task-b", "ecr", "pull image"],
    ["task-b", "logs", "awslogs"],
    ["task-a", "writer", "SQL"],
    ["task-b", "cache", "cached reads"]
  ],
  parts: {
    cloudfront: {
      name: "Amazon CloudFront",
      why: "Users far from the Region wait longer for every request. CloudFront serves content from edge locations near them and goes back to the origin only on a cache miss.",
      k: [
        ["Two origins, one distribution", "A cache behavior ties a path pattern to one origin. The bucket serves the static files, and <code>/api/*</code> goes to the load balancer."],
        ["Private origins", "Keep the bucket private with origin access control. A load balancer can even sit in private subnets when CloudFront reaches it through a VPC origin."],
        ["Custom domain", "Your own domain name on CloudFront needs an ACM certificate in us-east-1, requested or imported."]
      ],
      trap: "Cacheable web content points to CloudFront. Non-HTTP traffic such as UDP, or HTTP that needs static IP addresses, points to Global Accelerator instead.",
      tags: ["CloudFront"]
    },
    s3: {
      name: "Amazon S3 bucket",
      why: "Static files such as images and scripts need no container to serve them. A bucket holds them, but one wrong setting can expose or lose the data, so S3 has layers of access control and protection.",
      k: [
        ["Private by default", "S3 resources are private by default and ACLs are disabled by default, so access is granted with policies. Block Public Access overrides bucket policies, access point policies and ACLs that would allow public access."],
        ["Versioning", "An overwrite becomes a new version and a delete becomes a delete marker, so earlier versions stay. Object Lock needs versioning and adds write-once retention."],
        ["Replication", "Copies new objects to another bucket, in the same or another Region or account, and needs versioning on both buckets. S3 Batch Replication handles existing objects."]
      ],
      trap: "A lifecycle rule only transitions or expires objects in its own bucket. A copy in another Region or account is replication.",
      tags: ["S3 security", "S3 features"]
    },
    alb: {
      name: "Application Load Balancer",
      why: "Tasks start, stop and are replaced, so the addresses behind the application keep changing. The load balancer gives clients one entry and sends each request only to healthy targets, in either Availability Zone.",
      k: [
        ["Where it sits", "An internet-facing load balancer goes in public subnets and must be enabled in at least two Availability Zones. It reaches the tasks on private IP addresses, so they need no public IPs."],
        ["Target type ip", "Fargate tasks require <code>awsvpc</code> network mode. Each task gets its own network interface, so the target group type must be <code>ip</code>."],
        ["One ALB, many services", "Path-based rules send each path to its own target group, so one load balancer can front many services."]
      ],
      trap: "A target group of type <code>instance</code> does not fit Fargate tasks. On EC2 capacity, several tasks on one host use dynamic port mapping and register as instance ID and port.",
      tags: ["Load balancing", "Containers"]
    },
    svc: {
      name: "Amazon ECS service",
      why: "Containers fail and the load changes, and nobody can restart and count them by hand. An ECS service keeps the desired number of tasks running, replaces any that fail and can register them with a load balancer.",
      k: [
        ["Desired count", "When a task fails or stops, the scheduler launches another. Service Auto Scaling changes the desired count with the load."],
        ["New version", "A change is a new task definition revision. Updating the service to it replaces tasks in a rolling update, within the minimum healthy percent and maximum percent."],
        ["ECS or EKS", "ECS is AWS's own orchestrator, with no control plane for you to manage. EKS is managed Kubernetes and fits a team that already runs Kubernetes."]
      ],
      trap: "On EC2 capacity there are two layers to scale: more tasks need container instances with room for them. With Fargate you manage no servers, so that second layer is gone.",
      tags: ["Containers", "Auto Scaling"]
    },
    "task-a": {
      name: "Fargate task",
      why: "A container needs CPU, memory, a network address and permissions before it can run. A task is one running copy of a task definition, and Fargate runs it with no servers for you to manage.",
      k: [
        ["Task definition", "The blueprint: the image, the CPU and memory of the task, ports and volumes. To change it you create a new revision."],
        ["Own network interface", "Each Fargate task gets its own network interface in your subnet. From a private subnet it pulls its image through a NAT gateway or VPC endpoints for ECR."],
        ["Storage", "Fargate task storage is ephemeral. Data that must outlive the task goes to a database, to S3 or to an EFS volume."]
      ],
      trap: "Three roles get swapped. The task role is what the code in the container uses to call AWS services. The task execution role lets ECS pull the image, send logs and read secrets. The container instance role is the EC2 host's.",
      tags: ["Containers", "IAM roles & cross-account"]
    },
    "task-b": {
      name: "A second task in another zone",
      why: "If every task ran in one Availability Zone, losing that zone would stop the application. Fargate spreads a service's tasks across zones, so the tasks in the other zone keep serving.",
      k: [
        ["Spread by default", "For Fargate, the scheduler tries its best to spread tasks across the Availability Zones it can reach. AWS's reliability guidance: create subnets in several zones and choose them for the service."],
        ["Replaced, not repaired", "A task that fails or stops is replaced by a new one. The load balancer sends requests only to healthy targets meanwhile."],
        ["Fargate or EC2", "EC2 capacity is for GPUs, a custom AMI, privileged capabilities or specific instance types. With ECS Managed Instances AWS manages the instances for you."]
      ],
      trap: "Running more tasks does not by itself protect against losing a zone. Choose subnets in several Availability Zones for the service, as AWS's reliability guidance says.",
      tags: ["Containers", "High availability design"]
    },
    ecr: {
      name: "Amazon ECR",
      why: "A cluster cannot run an image that sits on a developer's laptop. Amazon ECR is the registry the tasks pull their images from, with IAM permissions on who may push and pull.",
      k: [
        ["Pushing an image", "Authenticate Docker with <code>aws ecr get-login-password</code>, tag the image with the repository URI, then push it."],
        ["Housekeeping", "Private repositories offer scanning on push and lifecycle policies that clean up old images."]
      ],
      trap: "Pulling a private image is the task execution role's job, not the task role's. When a task cannot pull its image, check that role and the network path to ECR.",
      tags: ["Containers"]
    },
    logs: {
      name: "Amazon CloudWatch",
      why: "Containers come and go, and their output goes with them. CloudWatch keeps the logs and metrics, so you can still see what a task did after it has stopped.",
      k: [
        ["Container logs", "The <code>awslogs</code> log driver sends each container's output to CloudWatch Logs. The task execution role allows ECS to send them."],
        ["Metrics", "ECS sends cluster and service CPU and memory metrics to CloudWatch automatically."],
        ["Container Insights", "Adds task and container metrics, and diagnostics such as restart failures."]
      ],
      tags: ["CloudWatch", "Containers"]
    },
    aurora: {
      name: "Aurora DB cluster",
      why: "The database is the hardest tier to keep running through a failure, because its data must not be lost. An Aurora cluster volume holds copies of the data in three Availability Zones, whatever the number of instances.",
      k: [
        ["Without a replica", "A failed primary is recreated in the same zone, typically in under 10 minutes. Promoting an Aurora Replica is much faster."],
        ["Endpoints", "The cluster endpoint always points to the current primary. The reader endpoint balances connections across the replicas."],
        ["Aurora serverless", "For variable load. It scales each instance between a minimum and maximum capacity, and at a minimum of 0 ACUs an idle instance pauses."]
      ],
      trap: "Replicas and the volume's copies all sit in one Region. Surviving the loss of a Region needs a global database: one primary Region for writes and read-only secondary Regions.",
      tags: ["Aurora", "High availability design"]
    },
    writer: {
      name: "Writer instance",
      why: "Only the primary instance of an Aurora cluster accepts writes, so the application must always find it, also after a failover. The cluster endpoint always points to the current primary.",
      k: [
        ["Failover", "With an Aurora Replica in the cluster, a replica is promoted when the primary fails."],
        ["Global database", "A planned switchover to another Region loses no data. A failover after an outage has an RPO of seconds and an RTO of minutes."]
      ],
      trap: "A global database still writes in one Region. Writes accepted in every Region point to DynamoDB global tables.",
      tags: ["Aurora", "Disaster recovery"]
    },
    replica: {
      name: "Aurora Replica",
      why: "Reads can outgrow one instance, and a standby that only waits is wasted. An Aurora Replica serves reads and is also a failover target.",
      k: [
        ["Up to 15", "A cluster can have up to 15 Aurora Replicas."],
        ["Reader endpoint", "Balances connections across the replicas. A custom endpoint groups instances that you choose."]
      ],
      tags: ["Aurora"]
    },
    cache: {
      name: "Amazon ElastiCache",
      why: "Reading the same data from the database again and again is slow and loads the database. ElastiCache keeps the answers in memory, between the application and the database.",
      k: [
        ["Lazy loading or write-through", "With lazy loading the application fills the cache on a miss, so data can go stale. Write-through updates the cache on every database write. A TTL combines the advantages of both."],
        ["Availability", "Run Valkey or Redis OSS with replicas and Multi-AZ. When the primary fails, a read replica is promoted."],
        ["Only what can be rebuilt", "With lazy loading a failed node is replaced by an empty one, and the application carries on with more database queries."]
      ],
      trap: "Users who see outdated values need write-through or a TTL, not a larger node. A cache is not transparent: the application itself reads from it and writes to it.",
      tags: ["Caching"]
    }
  }
};
