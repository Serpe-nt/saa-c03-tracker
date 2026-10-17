// Key points for the plan steps whose id starts with d9 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d9e1: {
    head: "Domain 2: keep one failure from taking the whole system down",
    why: "A payment service slows down for ten minutes, and the order page, which calls it directly, stops taking orders too. Or one data center loses power and the only copy of the database goes with it. You need designs in which a slow part or a lost zone does not stop the service.",
    idea: "Domain 2, Design Resilient Architectures, carries 26% of the scored content, second only to Domain 1. Its two task statements: scalable and loosely coupled architectures (2.1), and highly available or fault-tolerant architectures (2.2).",
    k: [
      ["What breaks when a neighbour is slow", "Read each scenario for the component that fails when another one is slow or down. Decouple it with a queue, a topic or an event bus."],
      ["What must survive", "Read each scenario for what must survive the loss of an AZ or a Region. Replicate it and fail over automatically."]
    ],
    q: {
      q: "You start a Domain 2 question about an online shop. Before you look at the options, which two things do you look for in the stem?",
      o: [
        "The part that breaks when a neighbour is slow, and what must survive the loss of an AZ or a Region",
        "The newest service in the shop's design, and the cheapest one",
        "How many instances the shop runs today, and how large they are",
        "Which Region is closest to the shop's users, and which offers the most services"
      ],
      a: [0],
      x: [
        "Right. The first points to decoupling with a queue, topic or event bus. The second points to replication with automatic failover.",
        "Age and price do not decide a resilience question. What fails, and what must keep working, does.",
        "Size says nothing about which part stops the others when it is slow, or what a lost zone takes with it.",
        "Closeness and the service list decide where to run, not how the design survives a failure."
      ],
      dom: 2, tags: ["High availability design"], doc: "wa"
    },
    docs: [
      ["SAA-C03 exam guide: Domain 2", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain2.html"]
    ]
  },
  d9e2: {
    head: "Task 2.1: put a buffer between the parts so each scales on its own",
    why: "A flash sale brings ten times the usual orders. The web tier scales out, but it calls the order service directly, which falls over and loses the orders it was handling. You need a buffer or a coordinator between the parts, so that each one scales and fails on its own.",
    idea: "Task statement 2.1 asks you to pick that piece by the shape of the work: a queue for bursts, a topic for one event with many consumers, a stream for ordered replay, a workflow for flows with steps.",
    k: [
      ["A queue absorbs the burst", "Consumers drain an SQS queue at their own rate. Scale EC2 workers on backlog per instance (visible messages divided by running instances), not on CPU."],
      ["One event, several consumers", "Use an SNS topic with one SQS queue per consumer."],
      ["Every app reads every record", "Kinesis Data Streams is for several applications that must each read every record in order and replay it later. Use a partition key. Retention goes up to 365 days."],
      ["Flows with steps", "Step Functions runs a flow with retries, compensation or a human approval. Retry takes a backoff rate, and Catch routes errors. Standard workflows run up to one year and support <code>.waitForTaskToken</code>. Express stops at five minutes and does not."],
      ["Limits that protect the parts", "Reserved concurrency sets aside part of the account's Lambda concurrency for one function at no charge, and also caps it. Provisioned concurrency pre-initializes environments and costs extra. Per-customer API Gateway limits come from usage plans with API keys."],
      ["Take reads off the writer", "Do this before resizing the writer. A read replica serves reporting. Aurora Auto Scaling adds and removes replicas behind the reader endpoint. API Gateway stage caching or CloudFront serves repeated identical responses."]
    ],
    trap: "A longer Lambda timeout, provisioned concurrency or more instances add no capacity to a saturated database. A queue with a capped consumer protects it. FIFO deduplication covers 5 minutes only, so a later resend must be safe to process twice.",
    q: {
      q: "An expense claim must be checked, then wait for a manager's approval, which can take several days, then be paid, with retries when the payment call fails. Which design fits?",
      o: [
        "A Step Functions Standard workflow that pauses with <code>.waitForTaskToken</code> until the manager approves",
        "A Step Functions Express workflow that waits for the manager's approval",
        "One Lambda function that polls for the approval until it arrives",
        "An SQS queue with long polling between the check and the payment"
      ],
      a: [0],
      x: [
        "Right. A Standard workflow runs up to one year and supports <code>.waitForTaskToken</code>, and its Retry and Catch handle the payment errors.",
        "Express workflows stop at five minutes and do not support <code>.waitForTaskToken</code>, so they cannot wait days for a person.",
        "A standard Lambda function runs for at most 15 minutes per invocation, so it cannot wait days. Retries and error routing would all be your own code.",
        "A queue buffers messages between parts. It does not coordinate the steps, the wait for a person or the retries."
      ],
      dom: 2, tags: ["Step Functions"], doc: "stepfunctions"
    },
    docs: [
      ["Scaling policy based on Amazon SQS", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html"],
      ["Choosing workflow type in Step Functions", "https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html"],
      ["Configuring reserved concurrency for a function", "https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html"]
    ]
  },
  d9e3: {
    head: "Task 2.2: remove single points of failure and fail over by itself",
    why: "At 3 a.m. one Availability Zone goes dark. The web servers in the other zone are fine, but every private subnet routes through a NAT gateway in the lost zone, and the database has no standby. The site stays down until someone wakes up. Every part needs a second copy elsewhere, and the switch to it must not wait for a person.",
    idea: "Task statement 2.2 asks you to spread every part across AZs, make failover automatic, and pick the recovery strategy that meets the stated recovery time objective (RTO) and recovery point objective (RPO) without paying for more.",
    k: [
      ["No single-AZ dependency", "An Auto Scaling group across AZs, a NAT gateway per AZ used by that AZ's private route table, Lambda subnets in several AZs. Inside one AZ, a spread placement group keeps each instance on distinct hardware."],
      ["Failover the database does itself", "RDS Multi-AZ (a synchronous standby, no reads), a Multi-AZ DB cluster (two readable standbys) or an Aurora Replica that Aurora promotes. A read replica is asynchronous and promoted by you, so it is not failover."],
      ["The cheapest strategy that meets both", "Hours of RPO and RTO allow backup and restore. Continuous data replication with servers switched off is pilot light. A small running copy is warm standby. Near zero for both needs active/active."],
      ["Managed replication over scripts", "S3 Cross-Region Replication needs versioning on both buckets. Replication Time Control adds a 15-minute SLA. Batch Replication covers objects older than the rule. EFS has replication. Elastic Disaster Recovery covers whole servers."],
      ["Failover without waiting for DNS", "A CloudFront origin group retries the secondary origin on chosen error codes. Global Accelerator gives two static anycast IPs, and traffic follows endpoint health. DNS failover waits until clients' cached answers expire."]
    ],
    trap: "High availability, disaster recovery and read scaling are different asks. Backups and read replicas give no automatic failover. An Aurora cluster with only a writer has to create a new instance when it fails, although its storage already spans several AZs.",
    q: {
      q: "A team's runbook says: \"If the AZ of our primary RDS database fails, the read replica in the other AZ takes over.\" Why does the runbook promise too much?",
      o: [
        "A read replica is asynchronous and takes over only when someone promotes it",
        "A read replica must sit in the same AZ as the primary it copies",
        "Read replicas exist only for Aurora, not for RDS",
        "A read replica takes over only after the next automated backup completes"
      ],
      a: [0],
      x: [
        "Right. A read replica scales reads. It is asynchronous and promoted by you, so it is not failover. Automatic failover comes from Multi-AZ or a promoted Aurora Replica.",
        "A read replica can sit in another AZ. The problem is that nothing promotes it automatically.",
        "RDS has read replicas too. They just give no automatic failover.",
        "Backups play no part in promoting a replica. Promotion is an action someone has to start."
      ],
      dom: 2, tags: ["RDS", "High availability design"], doc: "rds"
    },
    docs: [
      ["Disaster recovery options in the cloud", "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html"],
      ["High availability for Amazon Aurora", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html"],
      ["CloudFront origin failover", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/high_availability_origin_failover.html"]
    ]
  },
  d9e4: {
    head: "Practise Domain 2 on exam-style questions",
    why: "A resilience option works, but recovers in an hour when the stem allowed fifteen minutes. Another needs someone to press a button when the stem said automatic. Both feel right because the service fits. You need the habit of reading the stated limits before the options pull you toward a familiar service.",
    idea: "Domain 2 Practice gives you exam-style questions on its two task statements. Practising them trains you to take the limits out of each stem first.",
    do: [
      "Skill Builder → <b>Domain 2 Practice</b> → the exam-style questions. It needs the subscription.",
      "Before reading the options, write down the stem's RPO and RTO, or which component fails when another is slow.",
      "Strike every option with a manual step if the stem says automatic. Strike every option that keeps a server if it says serverless.",
      "Enter your score in % in the Scores field below."
    ],
    k: [
      ["Why the limits come first", "Once you like an option, you read the stem looking for support for it. Limits written down beforehand rule an option out however familiar it is."]
    ],
    q: {
      q: "Before reading the options you wrote down: RPO 5 minutes, RTO 15 minutes, failover automatic. Which option do you strike at once?",
      o: [
        "Restore last night's backup into a new database by following a runbook",
        "RDS Multi-AZ, with a synchronous standby that takes over automatically",
        "An Aurora Replica in a second AZ, which Aurora promotes when the writer fails",
        "A Multi-AZ DB cluster with two readable standbys"
      ],
      a: [0],
      x: [
        "Right. A nightly backup loses up to a day of data, far beyond 5 minutes, and a runbook is a manual step where the stem said automatic.",
        "Multi-AZ fails over to its standby automatically, so it stays in the running.",
        "Aurora promotes the replica by itself, so this option meets the automatic limit.",
        "A Multi-AZ DB cluster fails over automatically to one of its standbys, so it stays in the running."
      ],
      dom: 2, tags: ["High availability design", "Disaster recovery"], doc: "rds"
    }
  },
  d9e5: {
    head: "Tie each Domain 2 flashcard to the failure it protects against",
    why: "Multi-AZ, a read replica and a dead-letter queue all sound like safety, and each protects against a different failure. In the exam the failure comes first and you have to come up with the service. A list of services you can recite does not help with that.",
    idea: "Going through the Domain 2 flashcards with the failure in mind ties each service to the situation in which it is the answer.",
    do: [
      "Skill Builder → <b>Domain 2 Practice</b> → the flashcards.",
      "For each card, name the failure it protects against before you reveal the answer: an instance, an AZ, a Region, a message that keeps failing, or a traffic burst.",
      "A service you cannot tie to a failure goes into your notes for a second pass tonight."
    ],
    k: [
      ["Why the failure first", "The exam describes what went wrong, never the service by name. A card learned from the failure side is learned the way the question will ask it."]
    ],
    q: {
      q: "Which failure does a dead-letter queue protect a queue's consumers against?",
      o: [
        "A message that keeps failing, which is set aside after a set number of receives",
        "The loss of the Availability Zone in which the queue is stored",
        "A burst of messages larger than the consumers can handle at once",
        "An outage of the whole Region in which the queue runs"
      ],
      a: [0],
      x: [
        "Right. A poison message would come back again and again. After <code>maxReceiveCount</code> failed receives it moves to the dead-letter queue for inspection.",
        "A dead-letter queue is not a copy in another zone. It only collects messages that keep failing.",
        "The queue itself absorbs a burst. The dead-letter queue is for single messages that fail every time.",
        "A dead-letter queue does nothing about a Region outage. It sets aside messages that keep failing."
      ],
      dom: 2, tags: ["SQS"], doc: "sqs"
    }
  },
  d9e6: {
    head: "Domain 2 in a guided lab: tie each setting to the failure it survives",
    why: "In a guided lab the final check passes whether or not you understood why a setting was there. The exam starts from the failure instead: a zone lost, a neighbour slow, a burst of traffic. Each setting you build needs that failure attached to it, or the lab teaches clicks.",
    idea: "This AWS SimuLearn lab practises Domain 2. You gather a customer's requirements in a conversation, then build the solution in a live AWS environment.",
    do: [
      "Skill Builder → <b>Domain 2 Practice: AWS SimuLearn</b>. About an hour, and it needs the subscription.",
      "It runs in a temporary sandbox, not in ③ your account, so nothing of yours is left to clean up afterwards.",
      "During the conversation, write down what must keep working, and how much data and time the customer can afford to lose.",
      "After each build step, name the failure that setting protects against: an instance, an AZ, a Region, a slow neighbour or a burst."
    ],
    k: [
      ["Listen for the limits", "A customer who says \"we can lose at most five minutes of orders\" has given you an RPO. \"Back within an hour\" is an RTO. Both decide which design is enough."]
    ],
    q: {
      q: "In the lab's conversation the customer says: \"When the payment provider is slow, our checkout page must still accept orders.\" Which design answers that?",
      o: [
        "The checkout page puts each order on an SQS queue that a payment worker drains at its own pace",
        "A larger instance type for the servers that run the checkout page",
        "RDS Multi-AZ for the database that stores the orders",
        "A Route 53 failover record that points the checkout page at a second Region"
      ],
      a: [0],
      x: [
        "Right. The slow neighbour is the payment provider. A queue between them lets checkout carry on while the worker drains the orders at its own rate.",
        "A bigger server does not stop the checkout page from waiting on a slow provider it calls directly.",
        "Multi-AZ protects the database against the loss of an AZ, not the checkout page against a slow provider.",
        "Failover to another Region answers a Region outage. The provider would be just as slow from there."
      ],
      dom: 2, tags: ["SQS"], doc: "sqs"
    },
    docs: [["Immersive learning (AWS Cloud Quest and AWS SimuLearn)", "https://aws.amazon.com/training/digital/immersive-learning/"]]
  },
  d9c1: {
    head: "SQS standard or FIFO, the visibility timeout and the dead-letter queue",
    why: "A payment worker takes a message, crashes halfway, and the payment is either lost or charged twice. Another job doesn't mind a duplicate or a message out of order, but must not get stuck on one bad message. A queue has to match how strict the work is, and cope with workers that fail.",
    idea: "A FIFO queue keeps order and removes duplicates, and a standard queue gives the most throughput. The visibility timeout hides a message while a worker handles it, and a dead-letter queue collects messages that keep failing.",
    k: [
      ["Delay and retention", "A delay queue hides each new message for up to 15 minutes before its first receive. Retention is how long SQS keeps a message before it deletes it."]
    ],
    trap: "Don't swap the timers. A delay hides a new message before its first receive, the visibility timeout hides it after a receive, and long polling only waits up to 20 seconds for a message to arrive. FIFO deduplication lasts 5 minutes.",
    q: {
      q: "Workers take up to four minutes per message, but the queue's visibility timeout is 30 seconds. Some orders get processed twice. What fixes it?",
      o: [
        "Set the visibility timeout longer than the time a worker needs for one message",
        "Turn on long polling, so that workers wait up to 20 seconds for messages",
        "Add a delay queue that holds each new message for four minutes",
        "Add a dead-letter queue that collects the messages that are processed twice"
      ],
      a: [0],
      x: [
        "Right. A message that is not deleted before its visibility timeout ends reappears and may be processed again. The timeout must outlast the processing.",
        "Long polling only cuts empty receives. A message still reappears when its visibility timeout runs out.",
        "A delay hides a message before its first receive. The duplicates come after a receive, when the visibility timeout ends.",
        "A dead-letter queue collects messages that keep failing. It does not stop a message from reappearing while it is still being worked on."
      ],
      dom: 2, tags: ["SQS"], doc: "sqs"
    },
    docs: [
      ["Amazon SQS visibility timeout", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html"],
      ["Amazon SQS delay queues", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-delay-queues.html"],
      ["Exactly-once processing in Amazon SQS", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-exactly-once-processing.html"]
    ]
  },
  d9c2: {
    head: "Backup and restore, pilot light, warm standby or active/active",
    why: "After a Region-wide outage two things hurt: how long the shop is down, and how many of the last orders are gone. A full copy running elsewhere would solve both, and double the bill. The business sets a limit on each, and you need the cheapest design that stays within them.",
    idea: "The recovery time objective (RTO) limits the downtime, and the recovery point objective (RPO) the data loss. The four disaster recovery strategies are steps on a scale: the tighter the limits, the more must be kept ready in a second place.",
    trap: "Pilot light and warm standby both replicate data continuously. The difference is compute. Pilot light cannot serve requests until servers are started. Warm standby already serves at reduced capacity and only scales up. How often you back up sets the RPO, not the RTO.",
    q: {
      q: "After losing its Region, a shop may be down for up to four hours and may lose up to an hour of orders. Today it relies on nightly backups. Which strategy meets both limits at the lowest cost?",
      o: [
        "Pilot light: data replicated continuously, servers in the second Region started only after a disaster",
        "Backup and restore, keeping the nightly backups in a second Region",
        "Warm standby: a scaled-down copy that is always serving",
        "Multi-site active/active at full capacity in two Regions"
      ],
      a: [0],
      x: [
        "Right. Continuous replication keeps the data loss to tens of minutes, and starting the servers fits within four hours. No compute needs to run before a disaster.",
        "Nightly backups can lose up to a day of orders, far more than an hour. How often you back up sets the RPO.",
        "Warm standby meets both limits, but keeps compute running all the time. Pilot light meets them for less.",
        "Active/active gives near-zero RPO and RTO at the highest cost, far beyond what four hours of downtime requires."
      ],
      dom: 2, tags: ["Disaster recovery"], doc: "dr"
    },
    docs: [
      ["Disaster recovery options in the cloud", "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html"],
      ["Creating backup copies across AWS accounts", "https://docs.aws.amazon.com/aws-backup/latest/devguide/create-cross-account-backup.html"],
      ["What is Elastic Disaster Recovery?", "https://docs.aws.amazon.com/drs/latest/userguide/what-is-drs.html"]
    ]
  },
  d9c3: {
    head: "Route 53 routing policies: which answer each user gets",
    why: "Your app runs in Frankfurt and in Virginia. A licence lets you serve some content only in the EU, a canary release should get 5% of the traffic, and when Frankfurt fails its users must land in Virginia. One domain name has to give different answers for each of these goals.",
    idea: "Route 53 routing policies are those rules, one per goal: weighted for set shares, latency for the fastest Region, geolocation for where the user is, failover for a standby, and a few more.",
    trap: "Latency routing follows measured latency, not borders, so residency or licensing rules need geolocation. Geolocation without a default record gives no answer to unmatched locations. Health checkers sit outside the VPC, so check private resources through a CloudWatch alarm.",
    q: {
      q: "A streaming service may show a film only to viewers in Canada. Everyone else must reach a page that explains why. Which Route 53 setup does that?",
      o: [
        "Geolocation records: Canada to the film's servers, and a default record to the explanation page",
        "Latency records, since Canadian viewers measure the lowest latency to the Canadian servers",
        "A single geolocation record for Canada that points to the film's servers",
        "Weighted records that send all traffic to Canada and none elsewhere"
      ],
      a: [0],
      x: [
        "Right. Geolocation answers by where the user is, and the default record answers every location that no other record matches.",
        "Latency routing follows measured latency, not borders, so a viewer abroad could still be sent to the film.",
        "Without a default record, viewers outside Canada get no answer at all instead of the explanation page.",
        "Weighted routing splits traffic by share. It knows nothing about where a viewer is."
      ],
      dom: 2, tags: ["Route 53"], doc: "route53"
    },
    docs: [
      ["Choosing a routing policy", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"],
      ["Geolocation routing", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-geo.html"],
      ["Configuring failover in a private hosted zone", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-private-hosted-zones.html"]
    ]
  },
  d9c4: {
    head: "Aurora Global Database or DynamoDB global tables",
    why: "Players in Tokyo, Paris and São Paulo wait for every read from a database in Virginia, and if Virginia goes down the game stops. The database has to be copied across Regions, and how depends on one question: where may writes happen?",
    idea: "Aurora Global Database copies a relational database to read-only secondary Regions, and one primary Region takes the writes. DynamoDB global tables let you read and write in every replica Region.",
    trap: "Write forwarding still sends an Aurora secondary's writes to the primary, and cross-Region failover is an action you start. Writes in every Region means DynamoDB global tables. An Aurora Replica in the same Region covers an AZ, not a Region.",
    q: {
      q: "A game keeps player inventories in a key-value table. Players in three Regions must save changes in their own Region, even while another of the Regions is down. Which design fits?",
      o: [
        "DynamoDB global tables with a replica in each of the three Regions",
        "Aurora Global Database with write forwarding turned on in the secondary Regions",
        "Aurora Global Database with a secondary cluster in each other Region",
        "One DynamoDB table with a DAX cluster in each of the three Regions"
      ],
      a: [0],
      x: [
        "Right. Global tables are multi-active: every replica Region accepts reads and writes, so players save locally whichever Region is down.",
        "Write forwarding still sends the writes to the primary Region. If that Region is down, the writes have nowhere to go.",
        "Aurora secondaries are read-only. Only the primary Region takes writes.",
        "DAX is a cache in front of a table. It adds no writable copy of the data in another Region."
      ],
      dom: 2, tags: ["DynamoDB"], doc: "global-tables"
    },
    docs: [
      ["Using Amazon Aurora Global Database", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html"],
      ["Using switchover or failover in Amazon Aurora Global Database", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database-disaster-recovery.html"],
      ["Global tables: multi-active, multi-Region replication", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html"]
    ]
  }
});
