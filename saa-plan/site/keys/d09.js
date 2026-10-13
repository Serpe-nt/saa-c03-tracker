// Key points per plan step for Day 9. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d9e1: {
    why: "Parts of a system fail and traffic comes in bursts. A design that assumes neither goes down as a whole when one piece is slow or one data center is lost. Domain 2 tests whether you can keep one failure from spreading and keep the service running through it.",
    k: [
      ["Weight", "Domain 2 carries 26% of the scored content, second only to Domain 1."],
      ["Two task statements", "Scalable and loosely coupled architectures (2.1), and highly available or fault-tolerant architectures (2.2)."],
      ["What breaks when a neighbour is slow", "Read each scenario for the component that breaks when a neighbour is slow or down. Decouple it with a queue, topic or event bus."],
      ["What must survive", "Read each scenario for what must survive the loss of an AZ or a Region. Replicate it and fail over automatically."]
    ],
    docs: [
      ["SAA-C03 exam guide: Domain 2", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain2.html"]
    ]
  },
  d9e2: {
    why: "When components call each other directly, a burst or one slow part drags down everything connected to it, and work in progress is lost. This task tests whether you can put a buffer or a coordinator between the parts, so that each one scales and fails on its own.",
    k: [
      ["SQS queue", "For a producer that can outrun its consumer. The queue absorbs the burst and the consumers drain it at their own rate. Scale EC2 workers on backlog per instance (visible messages divided by running instances), not on CPU."],
      ["SNS topic with SQS queues", "For one event that several independent consumers need. Use an SNS topic with one SQS queue per consumer."],
      ["Kinesis Data Streams", "For several applications that must each read every record in order and replay it later. Use a partition key. Retention goes up to 365 days."],
      ["Step Functions", "For a multi-step flow with retries, compensation or a human approval. Retry takes a backoff rate, and Catch routes errors. Standard workflows run up to one year and support <code>.waitForTaskToken</code>. Express stops at five minutes and does not."],
      ["Lambda concurrency, API limits", "Reserved concurrency sets aside part of the account's Lambda concurrency for one function at no charge, and also caps it. Provisioned concurrency pre-initializes environments and costs extra. Per-customer API Gateway limits come from usage plans with API keys."],
      ["Take reads off the writer", "Do this before resizing the writer. A read replica serves reporting. Aurora Auto Scaling adds and removes replicas behind the reader endpoint. API Gateway stage caching or CloudFront serves repeated identical responses."]
    ],
    trap: "A longer Lambda timeout, provisioned concurrency or more instances add no capacity to a saturated database. A queue with a capped consumer protects it. FIFO deduplication covers 5 minutes only, so later resends need an idempotent consumer.",
    docs: [
      ["Scaling policy based on Amazon SQS", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html"],
      ["Choosing workflow type in Step Functions", "https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html"],
      ["Configuring reserved concurrency for a function", "https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html"]
    ]
  },
  d9e3: {
    why: "Hardware, a whole data center or a whole Region can fail, and a system with one copy of anything stops when that copy is lost. This task tests whether you can remove single points of failure and make failover automatic. It also tests whether you can pick a recovery design that meets the stated limits on downtime (RTO) and data loss (RPO) without paying for more.",
    k: [
      ["No single-AZ dependency", "Spread every part: an Auto Scaling group across AZs, a NAT gateway per AZ used by that AZ's private route table, Lambda subnets in several AZs. Inside one AZ, a spread placement group keeps each instance on distinct hardware."],
      ["Automatic database failover", "Comes from RDS Multi-AZ (a synchronous standby, no reads), a Multi-AZ DB cluster (two readable standbys) or an Aurora Replica that Aurora promotes. A read replica is asynchronous and promoted by you, so it is not failover."],
      ["Disaster recovery strategy", "Choose the cheapest one that meets the stated RPO and RTO. Hours allow backup and restore. Continuous data replication with servers switched off is pilot light. A small running copy is warm standby. Near zero for both needs active/active."],
      ["Managed replication", "Prefer it to scripts. S3 Cross-Region Replication needs versioning on both buckets. Replication Time Control adds a 15-minute SLA. Batch Replication covers objects older than the rule. EFS has replication. Elastic Disaster Recovery covers whole servers."],
      ["Failover without waiting for DNS", "A CloudFront origin group retries the secondary origin on chosen error codes. Global Accelerator gives two static anycast IPs, and traffic follows endpoint health. DNS failover waits until clients' cached answers expire."]
    ],
    trap: "High availability, disaster recovery and read scaling are different asks. Backups and read replicas give no automatic failover. An Aurora cluster with only a writer has to create a new instance when it fails, although its storage already spans several AZs.",
    docs: [
      ["Disaster recovery options in the cloud", "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html"],
      ["High availability for Amazon Aurora", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html"],
      ["CloudFront origin failover", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/high_availability_origin_failover.html"]
    ]
  },
  d9e4: {
    why: "Resilience questions are lost by skipping the stated limits: an answer that works but recovers too slowly, or needs a person to act, is wrong. Practising on exam-style questions trains you to read those limits before the options pull you toward a familiar service.",
    k: [
      ["Write the limits first", "Before reading the options, write down the stem's RPO and RTO, or which component fails when another is slow."],
      ["Strike by wording", "Strike every option with a manual step if the stem says automatic. Strike every option that keeps a server if it says serverless."]
    ]
  },
  d9e5: {
    why: "Resilience services are easy to list and hard to place: each one protects against one kind of failure and does little against the others. Going through the cards with the failure in mind ties each service to the situation where it is the answer.",
    k: [
      ["Name the failure first", "For each card, name the failure it protects against before you reveal the answer: instance, AZ, Region, poison message or traffic burst."],
      ["Second pass", "A service you cannot tie to a failure type goes into your notes for a second pass tonight."]
    ]
  },
  d9c1: {
    why: "Some work breaks when a message is handled twice or out of order, and some does not care. FIFO queues answer the first need and standard queues the second. A queue must also cope with a worker that takes a message and then fails. The visibility timeout hides a message while it is being worked on, and a dead-letter queue collects messages that keep failing.",
    trap: "Four timers get swapped. Delivery delay hides a new message before its first receive (15 minutes at most). Visibility timeout hides it after a receive. Long polling waits up to 20 seconds for a message. Retention deletes it. FIFO deduplication lasts 5 minutes.",
    docs: [
      ["Amazon SQS visibility timeout", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html"],
      ["Amazon SQS delay queues", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-delay-queues.html"],
      ["Exactly-once processing in Amazon SQS", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-exactly-once-processing.html"]
    ]
  },
  d9c2: {
    why: "After a disaster two things hurt: how long the service is down and how much recent data is gone. The recovery time objective (RTO) and the recovery point objective (RPO) limit each. Tighter limits cost more, because more must be kept ready in a second place. The disaster recovery strategies are steps on that scale, and the exam asks for the cheapest step that meets the stated limits.",
    trap: "Pilot light and warm standby both replicate data continuously. The difference is compute. Pilot light cannot serve requests until servers are started. Warm standby already serves at reduced capacity and only scales up. How often you back up sets the RPO, not the RTO.",
    docs: [
      ["Disaster recovery options in the cloud", "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html"],
      ["Creating backup copies across AWS accounts", "https://docs.aws.amazon.com/aws-backup/latest/devguide/create-cross-account-backup.html"],
      ["What is Elastic Disaster Recovery?", "https://docs.aws.amazon.com/drs/latest/userguide/what-is-drs.html"]
    ]
  },
  d9c3: {
    why: "A domain name can point at several places, and something has to decide which one each user gets. The goal decides. You may want to split traffic in set proportions, or send users to the Region with the best latency. You may have to follow a rule about where the user is, or switch to a standby when the main site fails. Each routing policy answers one such goal.",
    trap: "Latency routing follows measured latency, not borders, so residency or licensing rules need geolocation. Geolocation without a default record gives no answer to unmatched locations. Health checkers sit outside the VPC, so check private resources through a CloudWatch alarm.",
    docs: [
      ["Choosing a routing policy", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"],
      ["Geolocation routing", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-geo.html"],
      ["Configuring failover in a private hosted zone", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-private-hosted-zones.html"]
    ]
  },
  d9c4: {
    why: "Users on several continents want fast reads near them, and the business wants the data to survive the loss of a whole Region. Both needs mean copying the database across Regions. The two services differ in the one thing that decides most questions: whether every Region may accept writes, or only one.",
    trap: "An Aurora global database writes in one Region only. Write forwarding still sends writes to that primary, and cross-Region failover is an action you start. Writes in every Region means DynamoDB global tables. An Aurora Replica in the same Region covers an AZ, not a Region.",
    docs: [
      ["Using Amazon Aurora Global Database", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html"],
      ["Using switchover or failover in Amazon Aurora Global Database", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database-disaster-recovery.html"],
      ["Global tables: multi-active, multi-Region replication", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html"]
    ]
  }
});
