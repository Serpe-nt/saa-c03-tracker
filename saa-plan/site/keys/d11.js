// Key points for the plan steps whose id starts with d11 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d11e1: {
    why: "In the cloud every design choice is also a bill, and the same workload costs far more when it is built carelessly. But a cheap design that drops a requirement is no solution. Domain 4 tests whether you can find the cheapest design that still does everything the scenario asks.",
    k: [
      ["Weight", "Domain 4 is 20% of the scored content, about 10 of the 50 scored questions."],
      ["Four task statements", "Storage, compute, databases and networks. Cost management tools and cost allocation tags are listed under all four."],
      ["What 'most cost-effective' means", "The cheapest option that still meets every stated requirement. First strike the options that break a requirement (retrieval time, availability, interruption tolerance), then compare price."]
    ],
    trap: "The cheapest-looking option is often a distractor that quietly drops a requirement. Examples are a single AZ for data that must survive the loss of an AZ, or Spot for a service that cannot be interrupted.",
    docs: [["SAA-C03 exam guide: Domain 4", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain4.html"]]
  },

  d11e2: {
    why: "Stored data is billed every month whether anyone reads it or not. Keeping rarely read data on the fastest storage wastes money, while the coldest storage adds fees and delays when the data is needed after all. This task tests whether you can match the storage class to how often and how fast the data must be read.",
    k: [
      ["S3 class by access pattern", "Intelligent-Tiering for unknown or changing access (no retrieval fees). A lifecycle rule or direct upload to a cold class when the pattern is known. One Zone-IA only for data you can re-create."],
      ["Minimum storage durations", "30 days for Standard-IA and One Zone-IA, 90 for Glacier Instant and Flexible Retrieval, 180 for Deep Archive. These classes also add retrieval fees. Short-lived or often-read data belongs in S3 Standard."],
      ["Lifecycle rules remove waste", "Expire noncurrent versions a set number of days after they become noncurrent, and abort incomplete multipart uploads. S3 Storage Lens shows both across a whole organization and adds recommendations."],
      ["EBS cost", "gp3 costs less per GiB than gp2 and includes 3,000 IOPS and 125 MiB/s. So gp2 volumes that were oversized for IOPS get cheaper by changing type in place. Detached volumes bill until deleted. Data Lifecycle Manager automates snapshot retention."],
      ["EFS lifecycle management", "Moves files nobody reads to Infrequent Access or Archive inside the same file system."],
      ["S3 File Gateway and DataSync", "S3 File Gateway caches hot files on premises while the data lives in S3. DataSync is the managed service for moving data into AWS storage."]
    ],
    trap: "Standard-IA for data that lives 10 days or is read often costs more than S3 Standard, because of the 30-day minimum and retrieval fees. A team tag splits costs only after it is activated as a cost allocation tag.",
    docs: [
      ["Amazon S3 storage classes", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"],
      ["S3 Lifecycle configuration elements", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html"],
      ["Amazon EBS General Purpose SSD volumes", "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html"]
    ]
  },

  d11e3: {
    why: "Servers are billed for every hour they run, used or not. Paying the full price for load that never stops wastes money, and so does paying around the clock for work that runs a few hours. This task tests whether you can match the way you pay, and the kind of compute, to how the workload really runs.",
    k: [
      ["Commit only to steady usage", "A Savings Plan is a commitment to a set amount of usage per hour for 1 or 3 years. Commit only to usage that runs every hour of the term. Work that runs a few hours a day is cheaper on Spot, on a schedule or on serverless."],
      ["Compute Savings Plan", "Follows you across instance family, size, Region, OS and tenancy. It also covers Fargate and Lambda."],
      ["EC2 Instance Savings Plan", "Discounts more but fixes one family in one Region. Size, OS and tenancy stay flexible."],
      ["Spot", "Spot needs diversification: several instance types and AZs with the price-capacity-optimized strategy. Keep the must-run part on regular capacity: an On-Demand base in the Auto Scaling group, EMR primary and core nodes, regular Fargate beside Fargate Spot."],
      ["Right-size before you commit", "Compute Optimizer recommends sizes for EC2 instances, Auto Scaling groups, EBS volumes and Lambda memory. It sees memory use only with the CloudWatch agent. Cost Explorer recommends the Savings Plans commitment."],
      ["Match compute to the duty cycle", "Lambda for short event-driven bursts. Fargate tasks for long but occasional containers. Burstable T instances for low average CPU with spikes. Graviton for better price performance. Stop or scale to zero outside working hours."]
    ],
    trap: "The biggest discount is wrong when it breaks a requirement. Spot is wrong for a service that cannot be interrupted, and a commitment for a nightly job. An EC2 Instance Savings Plan is wrong when the workload will move to Fargate, Lambda or another family.",
    docs: [
      ["Savings Plans types", "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html"],
      ["Allocation strategies for Spot capacity", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-allocation-strategy.html"],
      ["What is AWS Compute Optimizer?", "https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html"]
    ]
  },

  d11e4: {
    why: "A database bills for several things at once: instance hours, storage, throughput and I/O. A fix aimed at the wrong one saves nothing. This task tests whether you can see which part of the bill is the problem and pick the pricing model or design that lowers it.",
    k: [
      ["Steady or idle-heavy", "A steady database gets a Reserved DB instance (1 or 3 years, Multi-AZ too) or a Database Savings Plan, valid across engines and Regions. Compute Savings Plans never cover RDS. Idle-heavy load fits Aurora serverless (pauses at 0 ACUs) or Redshift Serverless."],
      ["Rarely used RDS instance", "A stopped RDS instance still bills its storage and starts again automatically after 7 days. For a database used a few days per quarter, take a snapshot, delete the instance and restore from the snapshot when it is needed."],
      ["DynamoDB", "On-demand for unknown or spiky traffic. Provisioned capacity with auto scaling, plus reserved capacity, for steady traffic. The Standard-IA table class when storage dominates the bill. TTL to delete expired items without using write throughput."],
      ["Cache before more replicas", "When most reads repeat and some staleness is acceptable, add a cache with a matching TTL before more read replicas. AWS notes that one cache node can replace a number of database instances and so lower the total cost."],
      ["Backup retention", "RDS automated backups keep at most 35 days. Longer retention needs manual snapshots or an AWS Backup plan with its own retention."],
      ["Aurora I/O-Optimized", "Has no per-request I/O charge. It pays off when I/O is 25% or more of the Aurora bill."]
    ],
    trap: "Read which line of the bill the stem blames. Storage, throughput, I/O and instance hours each have a different fix. A reservation or reserved capacity never helps a database that sits idle or has unpredictable load.",
    docs: [
      ["Stopping an Amazon RDS DB instance temporarily", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html"],
      ["DynamoDB table classes", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.TableClasses.html"],
      ["Amazon Aurora storage", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.StorageReliability.html"]
    ]
  },

  d11e5: {
    why: "Moving data is billed in places that are easy to overlook: between zones, through gateways and out to the internet. A design that sends traffic the long way round pays for it on every gigabyte. This task tests whether you can see which path the traffic takes and choose a cheaper one that still meets the requirements.",
    k: [
      ["NAT gateway or gateway endpoint", "A NAT gateway bills per hour and per GB processed. Gateway endpoints for S3 and DynamoDB cost nothing, so route that traffic through them. ECR pulls need the S3 gateway endpoint plus the ECR interface endpoints, because image layers are stored in S3."],
      ["Traffic between AZs", "Traffic inside one AZ over private IPs is free. Across AZs, or to a public or Elastic IP address, it is charged in each direction. Use private IPs. Keep chatty nodes in one AZ when availability allows. Replicate only the prefixes that need a second Region."],
      ["Connecting many VPCs", "VPC peering has no connection charge, and traffic that stays in one AZ is free. Transit Gateway bills per attachment hour and per GB. With many VPCs, keep one set of interface endpoints in a shared VPC and resolve them through private hosted zones."],
      ["CloudFront and Requester Pays", "CloudFront lowers egress cost: transfer from AWS origins to CloudFront is waived and popular objects come from edge caches. A price class limits which edge locations serve you. Requester Pays moves request and download charges to the requester."],
      ["VPN or Direct Connect", "Site-to-Site VPN suits low volume and fast setup. Direct Connect bills port hours even when idle but can reduce network cost for steady, heavy transfer."],
      ["Cost and Usage Report", "Holds the most detailed hourly line items. Query it with Athena."]
    ],
    trap: "A NAT gateway in every AZ removes cross-AZ hops but not the per-GB processing charge. S3 Transfer Acceleration and Global Accelerator add fees in exchange for speed. Neither lowers a data transfer bill.",
    docs: [
      ["Pricing for NAT gateways", "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html"],
      ["Gateway endpoints", "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html"],
      ["Amazon ECR interface VPC endpoints", "https://docs.aws.amazon.com/AmazonECR/latest/userguide/vpc-endpoints.html"]
    ]
  },

  d11e6: {
    why: "Cost questions offer several options that all work, so knowing the services is not enough. You must also know what each one costs you in commitments, minimums and fees. Practising them shows whether you lose points by breaking a requirement or by missing a cheaper option.",
    k: [
      ["Two ways to go wrong", "For each cost miss, note whether your option broke a requirement or a cheaper option met them all. Those are the two ways a 'most cost-effective' answer goes wrong."],
      ["Two lists from memory", "On the flashcards, say the minimum storage durations and what each commitment type covers from memory. Those two lists decide many Domain 4 answers."]
    ]
  },

  d11p1: {
    why: "Until you sit a full-length exam you do not know whether your knowledge holds for the whole sitting, at exam pace and without notes. The practice exam is the one rehearsal that is scored like the real thing. Its result feeds the decision to book or to keep studying, so take it under real conditions.",
    k: [
      ["Pace", "The real exam has 65 questions in 130 minutes, an average of two minutes each."],
      ["Unscored questions", "15 of the 65 are unscored and not marked as such, so treat every question as scored."],
      ["Answer everything", "Unanswered questions are scored as incorrect and there is no penalty for guessing. Answer every question on the first pass, flag the doubtful ones and return to them with the time that is left."],
      ["Question types", "Multiple choice has one correct answer among four options. Multiple response has two or more correct answers among five or more options."]
    ],
    docs: [
      ["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["AWS Certified Solutions Architect - Associate", "https://aws.amazon.com/certification/certified-solutions-architect-associate/"]
    ]
  },

  d11p2: {
    why: "After the practice exam you must decide: sit the real one now, or study longer. A gut feeling is a poor guide either way. Reading the score for what it does and does not say turns that into a reasoned decision.",
    k: [
      ["What 720 means", "720 is a scaled score on a scale of 100 to 1,000, not 72% of the questions. Scaling evens out small differences in difficulty between exam forms."],
      ["Compensatory scoring", "You pass on the overall score and need no minimum in any domain. A weak domain still costs points in proportion to its weight (30, 26, 24 and 20%)."]
    ],
    docs: [["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]]
  },

  d11b1: {
    why: "Without a booked date, study drifts and the slot you want may be gone. Booking also starts rules that cost money if you learn them too late. They say until when you may still move or cancel, and which request must be made before you register.",
    k: [
      ["Late cancellation", "Cancelling less than 24 hours before the appointment, or not showing up, forfeits the exam fee."],
      ["Third change of date", "A third change of date means cancelling and booking again, so check a voucher's expiry date first."],
      ["Extra time (ESL +30)", "Non-native English speakers can request a 30-minute extension for an exam taken in English. Request it once in your AWS Certification Account before you register. It then applies to all later registrations."],
      ["Retakes", "There is no limit on the number of attempts, but every attempt costs the full registration fee."]
    ],
    docs: [
      ["AWS Certification policies: before testing", "https://aws.amazon.com/certification/policies/before-testing/"],
      ["AWS Certification policies: after testing", "https://aws.amazon.com/certification/policies/after-testing/"]
    ]
  },

  d11c1: {
    why: "Data that is rarely read does not need the fastest storage. But the colder classes add fees, minimum durations or a wait before the data comes back. So two questions decide the class: is the access pattern known, and how fast must the data be there when someone asks for it?",
    trap: "Intelligent-Tiering is the answer only when the access pattern is unknown or changing. When the stem states the pattern, a lifecycle rule or direct upload to the right class wins. Only Glacier Instant Retrieval needs no restore step.",
    docs: [
      ["Amazon S3 storage classes", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"],
      ["How S3 Intelligent-Tiering works", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering-overview.html"],
      ["Archive retrieval options", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects-retrieval-options.html"]
    ]
  },

  d11c2: {
    why: "Paying the normal hourly price for load that never stops wastes money. AWS gives a discount when you give something up: you commit to usage for a term, or you accept that the capacity can be taken back. You must tell the options apart by what each one makes you give up and what it still covers when the workload changes.",
    trap: "Only Compute Savings Plans cover Fargate and Lambda. An EC2 Instance Savings Plan stops applying when the instance family or Region changes. A regional Reserved Instance does not reserve capacity, and a zonal one does.",
    docs: [
      ["Savings Plans types", "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html"],
      ["Regional and zonal Reserved Instances", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/reserved-instances-scope.html"]
    ]
  },

  d11c3: {
    why: "Private instances that reach AWS services through a NAT gateway pay the gateway's charge on every gigabyte. A VPC endpoint is a private path to the service that does not go through the gateway. The endpoint types must be told apart because their costs differ: one kind costs nothing, the other bills by the hour and by the gigabyte.",
    trap: "Gateway endpoints exist only for S3 and DynamoDB. Every other service needs an interface endpoint, which bills per hour in each AZ plus per GB processed. So the lowest-cost private path to S3 from a VPC is the gateway type.",
    docs: [
      ["Gateway endpoints", "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html"],
      ["Pricing for NAT gateways", "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html"],
      ["AWS PrivateLink pricing", "https://aws.amazon.com/privatelink/pricing/"]
    ]
  }
});
