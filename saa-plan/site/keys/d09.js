// Key points per plan step for Day 9. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d9e1: {
    k: [
      "Domain 2 carries 26% of the scored content, second only to Domain 1. Its two task statements cover scalable and loosely coupled architectures (2.1) and highly available or fault-tolerant architectures (2.2).",
      "Read each scenario for two things: which component breaks when a neighbour is slow or down (decouple it with a queue, topic or event bus) and what must survive the loss of an AZ or a Region (replicate it and fail over automatically)."
    ],
    docs: [
      ["SAA-C03 exam guide: Domain 2", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain2.html"]
    ]
  },
  d9e2: {
    k: [
      "When a producer can outrun a consumer, put SQS between them: the queue absorbs the burst and the consumers drain it at their own rate. Scale EC2 workers on backlog per instance (visible messages divided by running instances), not on CPU.",
      "One event for several independent consumers is an SNS topic with one SQS queue per consumer. When several applications must each read every record in order and replay it later, use Kinesis Data Streams with a partition key (retention up to 365 days).",
      "A multi-step flow with retries, compensation or a human approval is Step Functions: Retry with a backoff rate, Catch to route errors. Standard workflows run up to one year and support <code>.waitForTaskToken</code>; Express stops at five minutes and does not.",
      "Reserved concurrency sets aside part of the account's Lambda concurrency for one function at no charge and also caps it; provisioned concurrency pre-initializes environments and costs extra. Per-customer API Gateway limits come from usage plans with API keys.",
      "Take read load off the writer before resizing it: a read replica for reporting, Aurora Auto Scaling to add and remove replicas behind the reader endpoint, API Gateway stage caching or CloudFront for repeated identical responses."
    ],
    trap: "A longer Lambda timeout, provisioned concurrency or more instances add no capacity to a saturated database; a queue with a capped consumer protects it. FIFO deduplication covers 5 minutes only, so later resends need an idempotent consumer.",
    docs: [
      ["Scaling policy based on Amazon SQS", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html"],
      ["Choosing workflow type in Step Functions", "https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html"],
      ["Configuring reserved concurrency for a function", "https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html"]
    ]
  },
  d9e3: {
    k: [
      "Remove every single-AZ dependency: an Auto Scaling group across AZs, a NAT gateway per AZ used by that AZ's private route table, Lambda subnets in several AZs. Inside one AZ, a spread placement group keeps each instance on distinct hardware.",
      "Automatic database failover comes from RDS Multi-AZ (a synchronous standby, no reads), a Multi-AZ DB cluster (two readable standbys) or an Aurora Replica that Aurora promotes. A read replica is asynchronous and promoted by you, so it is not failover.",
      "Choose the cheapest DR strategy that meets the stated RPO and RTO: hours allow backup and restore, continuous data replication with servers switched off is pilot light, a small running copy is warm standby, near zero for both needs active/active.",
      "Prefer managed replication to scripts: S3 Cross-Region Replication (versioning on both buckets, Replication Time Control for a 15-minute SLA, Batch Replication for objects older than the rule), EFS replication, Elastic Disaster Recovery for whole servers.",
      "Failover that must not wait for DNS uses a CloudFront origin group (retries the secondary origin on chosen error codes) or Global Accelerator (two static anycast IPs, traffic follows endpoint health). DNS failover waits until clients' cached answers expire."
    ],
    trap: "High availability, disaster recovery and read scaling are different asks. Backups and read replicas give no automatic failover, and an Aurora cluster with only a writer has to create a new instance when it fails, although its storage already spans several AZs.",
    docs: [
      ["Disaster recovery options in the cloud", "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html"],
      ["High availability for Amazon Aurora", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html"],
      ["CloudFront origin failover", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/high_availability_origin_failover.html"]
    ]
  },
  d9e4: {
    k: [
      "Before reading the options, write down the stem's RPO and RTO, or which component fails when another is slow. Then strike every option with a manual step if the stem says automatic, and every option that keeps a server if it says serverless."
    ]
  },
  d9e5: {
    k: [
      "For each card, name the failure it protects against (instance, AZ, Region, poison message, traffic burst) before you reveal the answer. A service you cannot tie to a failure type goes into your notes for a second pass tonight."
    ]
  },
  d9c1: {
    trap: "Four timers get swapped: delivery delay hides a new message before its first receive (15 minutes at most), visibility timeout hides it after a receive, long polling waits up to 20 seconds for a message, retention deletes it. FIFO deduplication lasts 5 minutes.",
    docs: [
      ["Amazon SQS visibility timeout", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html"],
      ["Amazon SQS delay queues", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-delay-queues.html"],
      ["Exactly-once processing in Amazon SQS", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-exactly-once-processing.html"]
    ]
  },
  d9c2: {
    trap: "Pilot light and warm standby both replicate data continuously; the difference is compute. Pilot light cannot serve requests until servers are started, warm standby already serves at reduced capacity and only scales up. How often you back up sets the RPO, not the RTO.",
    docs: [
      ["Disaster recovery options in the cloud", "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html"],
      ["Creating backup copies across AWS accounts", "https://docs.aws.amazon.com/aws-backup/latest/devguide/create-cross-account-backup.html"],
      ["What is Elastic Disaster Recovery?", "https://docs.aws.amazon.com/drs/latest/userguide/what-is-drs.html"]
    ]
  },
  d9c3: {
    trap: "Latency routing follows measured latency, not borders, so residency or licensing rules need geolocation, and geolocation without a default record gives no answer to unmatched locations. Health checkers sit outside the VPC; check private resources through a CloudWatch alarm.",
    docs: [
      ["Choosing a routing policy", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"],
      ["Geolocation routing", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-geo.html"],
      ["Configuring failover in a private hosted zone", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-private-hosted-zones.html"]
    ]
  },
  d9c4: {
    trap: "An Aurora global database writes in one Region only; write forwarding still sends writes to that primary, and cross-Region failover is an action you start. Writes in every Region means DynamoDB global tables. An Aurora Replica in the same Region covers an AZ, not a Region.",
    docs: [
      ["Using Amazon Aurora Global Database", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html"],
      ["Using switchover or failover in Amazon Aurora Global Database", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database-disaster-recovery.html"],
      ["Global tables: multi-active, multi-Region replication", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html"]
    ]
  }
});
