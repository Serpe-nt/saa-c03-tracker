// Key points per plan step for the course "Designing a Containerized Architecture" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c4a: {
    k: [
      "A container packages an application with its code, runtime, libraries and system tools and virtualizes the operating system, not the hardware. Sharing the host's operating system, images are measured in MB rather than GB and the same package runs anywhere.",
      "An image is a read-only template, typically built from a Dockerfile, and containers are created from it. Images live in a registry: Amazon ECR offers private repositories with IAM permissions, scanning on push and lifecycle policies that clean up images.",
      "Treat a container as disposable: a bind mount and Fargate's task storage are ephemeral. Data that must outlive a task goes to a database, to S3 or to an EFS volume, which is persistent and gives tasks the same files wherever they run.",
      "Containers suit microservices: each service has one function, is deployed and scaled independently, and one faulty container does not affect the others. An orchestrator such as Amazon ECS or Amazon EKS deploys, manages and scales the containers.",
      "Lambda can also run a container image stored in ECR, but a function is for short-lived work: code runs for up to 15 minutes in a single invocation of a standard function. Long-running services and batch containers belong on ECS or EKS."
    ],
    trap: "Containers are not the answer to every compute question. A workload that needs privileged capabilities, a custom AMI or specific instance types points to EC2 capacity, not Fargate, where you manage no servers at all.",
    docs: [
      ["Architect your solution for Amazon ECS", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-configuration.html"],
      ["What is Amazon Elastic Container Registry?", "https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html"],
      ["Storage options for Amazon ECS tasks", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html"]
    ]
  },

  c4b: {
    k: [
      "Amazon ECS is AWS's own fully managed orchestrator, with no control plane for you to manage. Amazon EKS is managed Kubernetes: AWS runs the control plane and you keep Kubernetes tooling, which fits a team that already runs Kubernetes or needs portability.",
      "Capacity is a separate choice. Fargate is serverless: no servers to manage, you state CPU and memory per task. EC2 instances are yours to select and maintain and fit GPUs or custom AMIs. With ECS Managed Instances AWS manages the instances.",
      "A task definition is the blueprint (image, CPU and memory, ports, volumes). A task is one running instance of it. A service keeps the desired number of tasks, replaces any that fail and can sit behind a load balancer; Service Auto Scaling changes the number.",
      "ECS sends cluster and service CPU and memory metrics to CloudWatch automatically. Container Insights adds task and container metrics and diagnostics such as restart failures. The <code>awslogs</code> log driver sends container output to CloudWatch Logs.",
      "One Application Load Balancer can front many services: path-based rules send each path to its own target group. Fargate tasks require <code>awsvpc</code> network mode: each task gets its own network interface, and the target group type must be <code>ip</code>."
    ],
    trap: "Three roles get swapped. The task role is what the application code in the container uses to call AWS services. The task execution role lets ECS pull the image, send logs and read referenced secrets. The container instance role belongs to the EC2 host and its agent.",
    docs: [
      ["Architect your solution for Amazon ECS", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-configuration.html"],
      ["Amazon ECS task IAM role", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html"],
      ["Monitor Amazon ECS containers using Container Insights with enhanced observability", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-container-insights.html"]
    ]
  },

  c4c: {
    k: [
      "S3 resources are private by default and ACLs are disabled by default (Object Ownership: bucket owner enforced), so access is granted with policies. In one account an allow in the identity policy or the bucket policy is enough; across accounts both are needed.",
      "Block Public Access overrides bucket policies, access point policies and ACLs that would allow public access. Turned on for the account it covers all current and future buckets, and the most restrictive of the access point, bucket and account settings applies.",
      "An access point is a named endpoint on a bucket with its own policy and can be limited to a VPC, so each application gets its own entry to a shared bucket. A Multi-Region Access Point is one global endpoint for buckets in several Regions.",
      "Versioning turns an overwrite into a new version and a delete into a delete marker. Object Lock adds WORM retention and needs versioning: governance mode can be bypassed with a special permission, compliance mode by no user, not even the root user.",
      "Live replication needs versioning on both buckets, is asynchronous and copies only objects written after it is set up; S3 Batch Replication handles existing ones. Deleting a specific object version is never replicated, and delete markers are not by default."
    ],
    trap: "A lifecycle rule only transitions or expires objects in its own bucket; a copy in another Region or account is replication. And with versioning on, every old version is charged as a full object until a rule expires noncurrent versions.",
    docs: [
      ["Access control in Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-management.html"],
      ["Locking objects with Object Lock", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html"],
      ["Replicating objects within and across Regions", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html"]
    ]
  },

  c4d: {
    k: [
      "CloudFront serves static and dynamic content from edge locations and goes to the origin only on a cache miss. A cache behavior ties a path pattern to one origin, so one distribution can serve a bucket and send <code>/api/*</code> to a load balancer.",
      "In Route 53 the routing policy picks the DNS answer: failover for active-passive, weighted for proportions you specify, latency for the Region with the best latency, geolocation for the user's location. Resolvers cache the answer for the record's TTL.",
      "Global Accelerator provides two static anycast IPv4 addresses, takes TCP or UDP traffic onto the AWS network at the closest edge location and routes it to a healthy endpoint: a load balancer, EC2 instance or Elastic IP address in one or more Regions.",
      "Choosing: cacheable web content means CloudFront. Non-HTTP traffic such as UDP gaming, or HTTP that needs static IP addresses or fast, deterministic regional failover, means Global Accelerator. A Route 53 alias record can point a domain at either one.",
      "A custom domain on CloudFront needs a certificate in ACM in us-east-1 (requested or imported). Keep an S3 origin private with origin access control, and keep a load balancer or EC2 instance in private subnets by using a VPC origin."
    ],
    trap: "DNS failover is not instant: resolvers keep using a cached answer until its TTL ends, while Global Accelerator redirects new connections as soon as an endpoint is unhealthy. Latency routing picks the lowest-latency Region, so a rule about where users live needs geolocation.",
    docs: [
      ["What is Amazon CloudFront?", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html"],
      ["Choosing a routing policy", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"],
      ["What is AWS Global Accelerator?", "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html"]
    ]
  },

  c4e: {
    k: [
      "An Aurora cluster volume holds copies of the data in three Availability Zones, whatever the number of instances. With no Aurora Replica, a failed primary is recreated in the same zone, typically in under 10 minutes; promoting a replica is much faster.",
      "A cluster can have up to 15 Aurora Replicas, which serve reads and are failover targets. The cluster endpoint always points to the current primary, the reader endpoint balances connections across the replicas, and a custom endpoint groups instances you choose.",
      "An Aurora global database has one primary Region for writes and read-only secondary Regions, with replication lag typically under a second. A planned switchover loses no data; a failover after an outage has an RPO of seconds and an RTO of minutes.",
      "Aurora serverless (the lesson's Serverless v2) scales each instance within a minimum and maximum capacity, for variable and unpredictable workloads; with a minimum of 0 ACUs an idle instance pauses. A cluster can mix serverless and provisioned instances.",
      "Application Recovery Controller (ARC) moves traffic. A zonal shift temporarily moves a load balancer's traffic away from an impaired Availability Zone; routing controls are on-off switches on Route 53 health checks that fail traffic over between Regions."
    ],
    trap: "Multi-AZ, Aurora Replicas and the cluster volume's copies all sit in a single Region. Surviving a Region needs a global database or a cross-Region read replica, each with one place for writes; writes accepted in every Region point to DynamoDB global tables.",
    docs: [
      ["High availability for Amazon Aurora", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html"],
      ["Using Amazon Aurora Global Database", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html"],
      ["What is ARC?", "https://docs.aws.amazon.com/r53recovery/latest/dg/what-is-route53-recovery.html"]
    ]
  },

  c4f: {
    k: [
      "ElastiCache sits between the application and its database. With lazy loading the application fills the cache on a miss, so data can go stale; write-through updates the cache on every database write; adding a TTL combines the advantages of both.",
      "For availability run Valkey or Redis OSS with replicas and Multi-AZ: when the primary fails, a read replica is promoted. Cluster mode enabled partitions data across shards for write-heavy load; a global datastore adds read-only clusters in other Regions.",
      "Keep in a cache only what can be rebuilt: with lazy loading a failed node is replaced by an empty one and the application carries on with more database queries. MemoryDB is the durable in-memory database; ElastiCache now has a durability option too.",
      "Putting it together, each requirement picks one piece: cacheable content, CloudFront; static IPs or non-HTTP, Global Accelerator; no servers to manage, Fargate; a database in two Regions, Aurora Global Database; objects in two Regions, S3 replication.",
      "The multi-Region design still writes in one place: one Aurora primary Region and one ElastiCache primary cluster. Regional failover therefore means promoting the secondary database cluster and the secondary cache cluster and shifting traffic to that Region."
    ],
    trap: "Lazy loading alone serves stale data until an item is reloaded. When users see outdated values, the fix is write-through or a TTL, not a larger node. A cache is also not transparent: the application itself reads from it and writes to it.",
    docs: [
      ["Caching strategies for Memcached", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"],
      ["Minimizing downtime in ElastiCache by using Multi-AZ with Valkey and Redis OSS", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/AutoFailover.html"],
      ["Replication across AWS Regions using global datastores", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Redis-Global-Datastore.html"]
    ]
  },

  l4a: {
    k: [
      "Pushing to ECR is three steps: authenticate Docker with <code>aws ecr get-login-password</code> (the token is valid for 12 hours), tag the image as <code>aws_account_id.dkr.ecr.region.amazonaws.com/repository:tag</code>, then push it.",
      "The task definition names the image and, for Fargate, the CPU and memory of the task. The task execution role is what lets ECS pull the image from a private ECR repository and send container logs to CloudWatch Logs.",
      "A Fargate task gets its own network interface in your subnet and needs a route to pull its image: a public IP address in a public subnet, a NAT gateway for a private subnet, or VPC endpoints for ECR. Check this first when an image cannot be pulled.",
      "With Fargate you manage no servers: you run a task, or a service that keeps a number of tasks running. On EC2 capacity the cluster first needs container instances that you select, configure and maintain."
    ],
    docs: [
      ["Pushing a Docker image to an Amazon ECR private repository", "https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html"],
      ["Amazon ECS task networking options for Fargate", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html"],
      ["Amazon ECS task execution IAM role", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html"]
    ]
  },

  l4d: {
    k: [
      "To change a task definition you create a new revision. A service keeps running the old one until you update the service to the new revision; ECS then replaces tasks in a rolling update within the minimum healthy percent and maximum percent.",
      "A service maintains the desired number of tasks: when a task fails or stops, the scheduler launches another. Scaling the application means raising that number, by hand or with Service Auto Scaling.",
      "On EC2 capacity there are two layers to scale: more tasks need container instances with room for them, or they cannot be placed. With managed scaling on an Auto Scaling group capacity provider, ECS scales the instances for you.",
      "With an Application Load Balancer and dynamic host port mapping, several tasks of one service can run on the same container instance: each gets a host port from the ephemeral range and is registered as an instance ID and port combination."
    ],
    docs: [
      ["Amazon ECS services", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_services.html"],
      ["Deploy Amazon ECS services by replacing tasks", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html"],
      ["Use an Application Load Balancer for Amazon ECS", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/alb.html"]
    ]
  },

  l4b: {
    k: [
      "A private hosted zone holds the records Route 53 uses to answer queries inside the VPCs associated with it. To use one, the VPC settings <code>enableDnsHostnames</code> and <code>enableDnsSupport</code> must both be true.",
      "An A record maps a name to an IPv4 address; a CNAME maps a name to another name and cannot be created at the zone apex. An alias record is Route 53's extension for AWS resources: it works at the apex and follows the resource's changing IP addresses.",
      "An instance's private IP address is released when the instance is terminated, so an A record that holds it breaks when the instance is replaced. Point names at something stable: a load balancer through an alias record, or another name through a CNAME.",
      "More VPCs can be associated with a private hosted zone, including VPCs of another account after authorization. A public and a private zone can share one name (split-view DNS): inside the associated VPCs the private zone is used."
    ],
    docs: [
      ["Working with private hosted zones", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-private.html"],
      ["Considerations when working with a private hosted zone", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zone-private-considerations.html"],
      ["Choosing between alias and non-alias records", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html"]
    ]
  },

  l4c: {
    k: [
      "On a miss the edge location gets the object from the origin and caches it; later requests are served from the edge until it expires (24 hours by default when no cache policy is used). Replacing a file sooner takes an invalidation or a versioned file name.",
      "A web server on EC2 and an S3 website endpoint are both custom origins. With a website endpoint CloudFront cannot use HTTPS to the origin and cannot use origin access control, and a public website needs publicly readable content.",
      "For a private bucket, use the bucket itself (not its website endpoint) as the origin with origin access control. For a load balancer or instance in private subnets, use a VPC origin, which makes CloudFront the single point of entry.",
      "On the distribution's own <code>cloudfront.net</code> name CloudFront provides the certificate, and the viewer protocol policy can redirect HTTP to HTTPS. Your own domain name needs an ACM certificate in us-east-1."
    ],
    docs: [
      ["Use various origins with CloudFront distributions", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html"],
      ["Manage how long content stays in the cache (expiration)", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html"],
      ["Restrict access with VPC origins", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-vpc-origins.html"]
    ]
  }
});
