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
    trap: "More capacity in front of a saturated database (longer Lambda timeout, provisioned concurrency, more instances) raises the pressure; a queue with a capped consumer relieves it. FIFO deduplication covers 5 minutes only, so later resends need an idempotent consumer.",
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
      "Failover that must not wait for DNS uses a CloudFront origin group (retries the secondary origin on chosen error codes) or Global Accelerator (two static anycast IPs, traffic follows endpoint health). Route 53 failover depends on resolvers honouring the TTL."
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
  d9b1: {
    k: [
      "Lambda polls the queue through an event source mapping and deletes a batch when the function succeeds. After an error the whole batch becomes visible again, unless <code>ReportBatchItemFailures</code> is on and the function returns the failed message IDs.",
      "The dead-letter queue belongs to the source queue: its redrive policy moves a message after <code>maxReceiveCount</code> receives (at least 5 is recommended). For asynchronous invocations use an on-failure destination, which also records the error response.",
      "Set the queue's visibility timeout to at least six times the function timeout; Lambda refuses a mapping whose function timeout exceeds it. A timeout shorter than the processing time shows up as the same message handled twice.",
      "<code>provided.al2023</code> is an OS-only runtime: build for Linux (amd64 or arm64) and name the executable <code>bootstrap</code>. The execution role needs permission to read from the queue, which <code>AWSLambdaSQSQueueExecutionRole</code> provides."
    ],
    docs: [
      ["Using Lambda with Amazon SQS", "https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html"],
      ["Handling errors for an SQS event source in Lambda", "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html"],
      ["Deploy Go Lambda functions with .zip file archives", "https://docs.aws.amazon.com/lambda/latest/dg/golang-package.html"]
    ]
  },
  d9b2: {
    k: [
      "Each queue needs an access policy that lets the topic call <code>sqs:SendMessage</code>, limited with <code>aws:SourceArn</code> to that topic. Without it the subscription exists but nothing arrives in the queue.",
      "Every subscribed queue receives its own copy of each message and holds it until its consumer is ready, so a slow or offline consumer misses nothing and the publisher never needs to know who subscribes.",
      "By default the queue receives a JSON envelope with SNS metadata around your message; raw message delivery on the subscription passes the message as published. A filter policy on a subscription lets only matching messages through to that queue.",
      "A dead-letter queue for failed deliveries is attached to the subscription, not the topic. Without one, SNS discards a message once its delivery retries are used up, which is how an HTTPS endpoint that is down for hours loses events."
    ],
    docs: [
      ["Fanout Amazon SNS notifications to Amazon SQS queues", "https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html"],
      ["Subscribing an Amazon SQS queue to an Amazon SNS topic", "https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html"],
      ["Amazon SNS dead-letter queues", "https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html"]
    ]
  },
  d9b3: {
    k: [
      "A scheduled rule can exist only on the default event bus and runs its cron or rate expression in UTC. AWS now labels scheduled rules legacy and recommends EventBridge Scheduler, which adds one-time schedules, time zones, retry limits and a dead-letter queue.",
      "EventBridge may invoke the function only if the function's resource-based policy allows <code>events.amazonaws.com</code> (a Lambda permission resource in Terraform) or the target has an execution role. Without either, the rule matches and nothing runs.",
      "A rule sees only events on its own bus. Partner SaaS events arrive on a partner event bus, and another account can send to your bus only after the bus policy allows it, with a rule in the sending account that targets your bus.",
      "When a target fails, EventBridge retries for up to 24 hours and 185 attempts by default. Attach an SQS dead-letter queue to the target to keep events that still fail; errors caused by missing permissions are not retried."
    ],
    docs: [
      ["Creating a scheduled rule (legacy) in Amazon EventBridge", "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html"],
      ["What is Amazon EventBridge Scheduler?", "https://docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html"],
      ["Using resource-based policies for Amazon EventBridge", "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html"]
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
