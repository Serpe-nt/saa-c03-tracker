// Key points per plan step for Day 11. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d11e1: {
    k: [
      "Domain 4 is 20% of the scored content, about 10 of the 50 scored questions, in four task statements: storage, compute, databases and networks. Cost management tools and cost allocation tags are listed under all four.",
      "'Most cost-effective' means the cheapest option that still meets every stated requirement. First strike the options that break a requirement (retrieval time, availability, interruption tolerance), then compare price."
    ],
    trap: "The cheapest-looking option is often a distractor that quietly drops a requirement, such as a single AZ for data that must survive the loss of an AZ, or Spot for a service that cannot be interrupted.",
    docs: [["SAA-C03 exam guide: Domain 4", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain4.html"]]
  },

  d11e2: {
    k: [
      "Pick the S3 class by access pattern: Intelligent-Tiering for unknown or changing access (no retrieval fees), a lifecycle rule or direct upload to a cold class when the pattern is known, One Zone-IA only for data you can re-create.",
      "Minimum storage durations are 30 days for Standard-IA and One Zone-IA, 90 for Glacier Instant and Flexible Retrieval and 180 for Deep Archive, and these classes add retrieval fees. Short-lived or often-read data belongs in S3 Standard.",
      "Lifecycle rules also remove waste: expire noncurrent versions a set number of days after they become noncurrent, and abort incomplete multipart uploads. S3 Storage Lens shows both across a whole organization and adds recommendations.",
      "gp3 costs less per GiB than gp2 and includes 3,000 IOPS and 125 MiB/s, so gp2 volumes that were oversized for IOPS get cheaper by changing type in place. Detached volumes bill until deleted; Data Lifecycle Manager automates snapshot retention.",
      "EFS lifecycle management moves files nobody reads to Infrequent Access or Archive inside the same file system. S3 File Gateway caches hot files on premises while the data lives in S3. DataSync is the managed service for moving data into AWS storage."
    ],
    trap: "Standard-IA for data that lives 10 days or is read often costs more than S3 Standard, because of the 30-day minimum and retrieval fees. A team tag splits costs only after it is activated as a cost allocation tag.",
    docs: [
      ["Amazon S3 storage classes", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"],
      ["S3 Lifecycle configuration elements", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html"],
      ["Amazon EBS General Purpose SSD volumes", "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html"]
    ]
  },

  d11e3: {
    k: [
      "Commit only to usage that runs every hour of the term: a Savings Plan is a commitment to a set amount of usage per hour for 1 or 3 years. Work that runs a few hours a day is cheaper on Spot, on a schedule or on serverless.",
      "Compute Savings Plans follow you across instance family, size, Region, OS and tenancy and also cover Fargate and Lambda. EC2 Instance Savings Plans discount more but fix one family in one Region; size, OS and tenancy stay flexible.",
      "Spot needs diversification: several instance types and AZs with the price-capacity-optimized strategy. Keep the must-run part on regular capacity: an On-Demand base in the Auto Scaling group, EMR primary and core nodes, regular Fargate beside Fargate Spot.",
      "Right-size before you commit. Compute Optimizer recommends sizes for EC2 instances, Auto Scaling groups, EBS volumes and Lambda memory, and it sees memory use only with the CloudWatch agent. Cost Explorer recommends the Savings Plans commitment.",
      "Match compute to the duty cycle: Lambda for short event-driven bursts, Fargate tasks for long but occasional containers, burstable T instances for low average CPU with spikes, Graviton for better price performance, stop or scale to zero outside working hours."
    ],
    trap: "The biggest discount is wrong when it breaks a requirement: Spot for a service that cannot be interrupted, a commitment for a nightly job, or an EC2 Instance Savings Plan when the workload will move to Fargate, Lambda or another family.",
    docs: [
      ["Savings Plans types", "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html"],
      ["Allocation strategies for Spot capacity", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-allocation-strategy.html"],
      ["What is AWS Compute Optimizer?", "https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html"]
    ]
  },

  d11e4: {
    k: [
      "A steady 24/7 database gets a Reserved DB instance (1 or 3 years, also valid for Multi-AZ). Compute Savings Plans never cover RDS. Idle-heavy or unpredictable load fits Aurora Serverless v2, which can pause at 0 ACUs, or Redshift Serverless.",
      "A stopped RDS instance still bills its storage and starts again automatically after 7 days. For a database used a few days per quarter, take a snapshot, delete the instance and restore from the snapshot when it is needed.",
      "DynamoDB: on-demand for unknown or spiky traffic; provisioned capacity with auto scaling, plus reserved capacity, for steady traffic; the Standard-IA table class when storage dominates the bill; TTL to delete expired items without using write throughput.",
      "When most reads repeat and some staleness is acceptable, a cache with a matching TTL costs less than more read replicas, because every replica is another full DB instance answering the same queries.",
      "RDS automated backups keep at most 35 days; longer retention needs manual snapshots or an AWS Backup plan with its own retention. Aurora I/O-Optimized has no per-request I/O charge and pays off when I/O is 25% or more of the Aurora bill."
    ],
    trap: "Read which line of the bill the stem blames. Storage, throughput, I/O and instance hours each have a different fix, and a reservation or reserved capacity never helps a database that sits idle or has unpredictable load.",
    docs: [
      ["Stopping an Amazon RDS DB instance temporarily", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html"],
      ["DynamoDB table classes", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.TableClasses.html"],
      ["Amazon Aurora storage", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.StorageReliability.html"]
    ]
  },

  d11e5: {
    k: [
      "A NAT gateway bills per hour and per GB processed. Gateway endpoints for S3 and DynamoDB cost nothing, so route that traffic through them. ECR pulls need the S3 gateway endpoint plus the ECR interface endpoints, because image layers are stored in S3.",
      "Traffic inside one AZ over private IPs is free; across AZs, or to a public or Elastic IP address, it is charged in each direction. Use private IPs, keep chatty nodes in one AZ when availability allows, and replicate only the prefixes that need a second Region.",
      "VPC peering has no connection charge, and traffic that stays in one AZ is free; Transit Gateway bills per attachment hour and per GB. With many VPCs, keep one set of interface endpoints in a shared VPC and resolve them through private hosted zones.",
      "CloudFront lowers egress cost: transfer from AWS origins to CloudFront is waived and popular objects come from edge caches; a price class limits which edge locations serve you. Requester Pays moves request and download charges to the requester.",
      "Site-to-Site VPN suits low volume and fast setup. Direct Connect bills port hours even when idle but can reduce network cost for steady, heavy transfer. The Cost and Usage Report, queried with Athena, holds the most detailed hourly line items."
    ],
    trap: "A NAT gateway in every AZ removes cross-AZ hops but not the per-GB processing charge. S3 Transfer Acceleration and Global Accelerator add fees in exchange for speed; neither lowers a data transfer bill.",
    docs: [
      ["Pricing for NAT gateways", "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html"],
      ["Gateway endpoints", "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html"],
      ["Amazon ECR interface VPC endpoints", "https://docs.aws.amazon.com/AmazonECR/latest/userguide/vpc-endpoints.html"]
    ]
  },

  d11e6: {
    k: [
      "For each cost miss, note whether your option broke a requirement or a cheaper option met them all. Those are the two ways a 'most cost-effective' answer goes wrong.",
      "On the flashcards, say the minimum storage durations and what each commitment type covers from memory; those two lists decide many Domain 4 answers."
    ]
  },

  d11p1: {
    k: [
      "The real exam has 65 questions in 130 minutes, an average of two minutes each. 15 of the 65 are unscored and not marked as such, so treat every question as scored.",
      "Unanswered questions are scored as incorrect and there is no penalty for guessing. Answer every question on the first pass, flag the doubtful ones and return to them with the time that is left.",
      "Multiple choice has one correct answer among four options. Multiple response has two or more correct answers among five or more options."
    ],
    docs: [
      ["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["AWS Certified Solutions Architect - Associate", "https://aws.amazon.com/certification/certified-solutions-architect-associate/"]
    ]
  },

  d11p2: {
    k: [
      "720 is a scaled score on a scale of 100 to 1,000, not 72% of the questions. Scaling evens out small differences in difficulty between exam forms.",
      "Scoring is compensatory: you pass on the overall score and need no minimum in any domain. A weak domain still costs points in proportion to its weight (30, 26, 24 and 20%)."
    ],
    docs: [["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]]
  },

  d11b1: {
    k: [
      "An appointment can be rescheduled only twice. Cancelling less than 24 hours before the appointment, or not showing up, forfeits the exam fee.",
      "Non-native English speakers can request a 30-minute extension (ESL +30) for an exam taken in English. Request it once in your AWS Certification Account before you register; it then applies to all later registrations.",
      "There is no limit on the number of attempts, but every attempt costs the full registration fee."
    ],
    docs: [
      ["AWS Certification policies: before testing", "https://aws.amazon.com/certification/policies/before-testing/"],
      ["AWS Certification policies: after testing", "https://aws.amazon.com/certification/policies/after-testing/"]
    ]
  },

  d11c1: {
    trap: "Intelligent-Tiering is the answer only when the access pattern is unknown or changing. When the stem states the pattern, a lifecycle rule or direct upload to the right class wins. Only Glacier Instant Retrieval needs no restore step.",
    docs: [
      ["Amazon S3 storage classes", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"],
      ["How S3 Intelligent-Tiering works", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering-overview.html"],
      ["Archive retrieval options", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects-retrieval-options.html"]
    ]
  },

  d11c2: {
    trap: "Only Compute Savings Plans cover Fargate and Lambda. An EC2 Instance Savings Plan stops applying when the instance family or Region changes. A regional Reserved Instance does not reserve capacity; a zonal one does.",
    docs: [
      ["Savings Plans types", "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html"],
      ["Regional and zonal Reserved Instances", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/reserved-instances-scope.html"]
    ]
  },

  d11c3: {
    trap: "Gateway endpoints exist only for S3 and DynamoDB. Every other service needs an interface endpoint, which bills per hour in each AZ plus per GB processed, so the lowest-cost private path to S3 from a VPC is the gateway type.",
    docs: [
      ["Gateway endpoints", "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html"],
      ["Pricing for NAT gateways", "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html"],
      ["AWS PrivateLink pricing", "https://aws.amazon.com/privatelink/pricing/"]
    ]
  }
});
