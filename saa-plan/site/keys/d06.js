// Key points per plan step for Day 6. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d6w1: {
    k: [
      "Athena runs standard SQL directly on files in S3 with nothing to provision, and you pay for the data each query scans. Partitioning and columnar formats such as Parquet cut what is scanned, and a workgroup limit can cancel a query that scans too much.",
      "AWS Glue is serverless data integration. A crawler infers schemas and writes tables to the Glue Data Catalog, which Athena uses for its table metadata, and Glue ETL jobs run Apache Spark with no cluster to manage.",
      "Amazon EMR is a managed cluster platform for Hadoop and Spark. Choose it when existing jobs or custom framework settings must be kept. Task nodes hold no HDFS data, which makes them the natural place for Spot capacity.",
      "Amazon Redshift is the petabyte-scale data warehouse for complex SQL across large structured data sets. Redshift Serverless removes capacity management, and Redshift Spectrum queries files in S3 without loading them.",
      "Kinesis Data Streams keeps records (24 hours by default, up to 365 days) so that several consumers can read and replay them. Amazon Data Firehose only delivers, to S3, Redshift, OpenSearch or Splunk, and can convert JSON to Parquet on the way."
    ],
    trap: "A few ad hoc SQL queries on files in S3 is Athena, not a warehouse or cluster you must size and run. Business dashboards are Amazon Quick Sight, which the exam guide lists under Amazon Quick; CloudWatch dashboards show operational metrics.",
    docs: [
      ["What is Amazon Athena?", "https://docs.aws.amazon.com/athena/latest/ug/what-is.html"],
      ["What is AWS Glue?", "https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html"],
      ["What is Amazon Data Firehose?", "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"]
    ]
  },

  d6w2: {
    k: [
      "EC2 reports its own metrics (CPU, network, disk I/O, status checks) every 5 minutes; detailed monitoring makes that 1 minute and adds no new metrics. Memory and disk-space use are measured inside the OS, so they need the CloudWatch agent.",
      "To alert on log text, add a metric filter to the log group, alarm on the resulting metric and notify an SNS topic. A composite alarm fires only when its rule over other alarms is met, which cuts noise. Log groups keep data forever until you set retention.",
      "CloudTrail trails log management events by default. Object-level S3 calls and Lambda invocations are data events that you must switch on. An organization trail covers every account, and member accounts cannot stop or change it.",
      "Detect or prevent? AWS Config rules flag noncompliant resources after the change and can remediate through Systems Manager Automation; an aggregator shows compliance across accounts and Regions. Blocking the call itself takes an SCP or IAM policy.",
      "Control Tower builds a multi-account landing zone on AWS Organizations. Its preventive controls are Organizations policies such as SCPs; its detective controls are Config rules. Trusted Advisor checks cost, security, fault tolerance and service limits."
    ],
    trap: "Event history always covers the last 90 days of management events; longer retention or S3 object-level calls need a trail. CloudTrail Insights flags unusual API call and error rates. Proof that log files were not altered is log file integrity validation.",
    docs: [
      ["CloudTrail concepts", "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html"],
      ["Collect metrics, logs, and traces using the CloudWatch agent", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html"],
      ["Control behavior and guidance (AWS Control Tower)", "https://docs.aws.amazon.com/controltower/latest/controlreference/control-behavior.html"]
    ]
  },

  d6w3: {
    k: [
      "AWS pricing rests on three ideas: pay as you go, save when you commit, and pay less by using more. The basic cost drivers are compute, storage and outbound data transfer; inbound data transfer is free in most cases.",
      "Pick the tool by the question. Pricing Calculator prices a design before it exists. Cost Explorer charts past spend and forecasts it. Budgets alerts on actual or forecast cost and usage. The Cost and Usage Report is the most detailed data, delivered to S3.",
      "A tag appears in Cost Explorer and the cost reports only after you activate it as a cost allocation tag in the Billing and Cost Management console. Tagging the resources alone is not enough.",
      "Consolidated billing in AWS Organizations gives one bill and combines usage across accounts, so volume discounts, Reserved Instance discounts and Savings Plans are shared. It costs nothing extra.",
      "A budget can do more than send email. A budget action can apply an IAM policy or a service control policy, or target specific EC2 or RDS instances, when a threshold is crossed, either automatically or after your approval."
    ],
    trap: "Activating a cost allocation tag makes costs reportable by that tag; it does not find resources that lack the tag. That is the AWS Config <code>required-tags</code> rule. And Cost Explorer works from history, so it cannot price a design that does not exist yet.",
    docs: [
      ["Analyzing your costs and usage with AWS Cost Explorer", "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html"],
      ["Organizing and tracking costs using AWS cost allocation tags", "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html"],
      ["Managing your costs with AWS Budgets", "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html"]
    ]
  },

  d6w4: {
    k: [
      "DataSync is the online transfer service for files and objects. An agent reads NFS, SMB, HDFS or object storage on premises and copies to S3, EFS or FSx, with encryption in transit, integrity validation, incremental transfers and an optional bandwidth limit.",
      "AWS DMS migrates a database while the source stays in use. A full load copies the existing data, then change data capture (CDC) keeps the target in sync until a short cutover.",
      "The same engine on both sides needs only DMS. A different target engine (for example Oracle to Aurora PostgreSQL) first needs the schema and code converted with DMS Schema Conversion or the AWS Schema Conversion Tool.",
      "Snow Family status: new customers can no longer order Snow devices, and AWS ends support for Snowball in commercial Regions on 31 December 2026. AWS points to DataSync for online transfer and Data Transfer Terminal for physical upload.",
      "The exam guide still lists AWS Snow Family as in scope, so know the idea it stood for: when the data is too large to send over the available link before the deadline, it travels offline on a physical device instead."
    ],
    trap: "DataSync moves files and objects, DMS moves databases, and S3 File Gateway gives on-premises applications ongoing NFS or SMB access to S3. A stem that says migrate plus NFS or SMB share wants DataSync, not DMS and not a gateway.",
    docs: [
      ["What is AWS DataSync?", "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html"],
      ["What is AWS Database Migration Service?", "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html"],
      ["AWS Snowball Edge availability change", "https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html"]
    ]
  },

  d6w5: {
    k: [
      "SAA-C03 is built on this framework: the exam guide says the exam validates designing solutions based on the Well-Architected Framework, and its four domains (secure, resilient, high-performing, cost-optimized) mirror four of the six pillars.",
      "Match a practice to its pillar by the design principles. Operational excellence: frequent, small, reversible changes and learning from operational events. Reliability: automatic recovery from failure, tested recovery procedures, horizontal scaling.",
      "Performance efficiency: go global in minutes, use serverless architectures, experiment more often. Cost optimization: adopt a consumption model, analyze and attribute expenditure. Security: strong identity foundation, traceability, keep people away from data.",
      "Sustainability, the sixth pillar, is about environmental impact: understand your impact, maximize utilization, and adopt more efficient hardware and managed services.",
      "The AWS Well-Architected Tool is a guided self-review of one workload against the framework. You answer questions per pillar, it records high and medium risks with an improvement plan, and milestones track progress over time."
    ],
    trap: "One practice can sound like two pillars, so decide by the stated goal: switching off idle servers to cut the bill is cost optimization, to cut emissions is sustainability. The Well-Architected Tool asks you questions; Trusted Advisor scans the account.",
    docs: [
      ["The pillars of the framework", "https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html"],
      ["What is AWS Well-Architected?", "https://docs.aws.amazon.com/wellarchitected/latest/userguide/well-architected.html"]
    ]
  },

  d6p1: {
    k: [
      "AWS Pricing Calculator is a free web tool that prices a design before anything is built. It creates no resources, shows the calculation behind each figure, and an estimate can be saved as a shareable link or exported as CSV or PDF.",
      "Watch which inputs move the total: the hours of compute and the pricing model chosen for them, the amount of storage, and the data transferred out. Those are the three basic AWS cost drivers.",
      "An estimate is a plan, not a bill. Actual spend shows up afterwards in Cost Explorer and on the bill, and Budgets warns you when it drifts from the plan."
    ],
    trap: "'Estimate the monthly cost of a new architecture before deploying it' is Pricing Calculator. Cost Explorer and Budgets work on spend that already exists.",
    docs: [
      ["What is AWS Pricing Calculator?", "https://docs.aws.amazon.com/pricing-calculator/latest/userguide/what-is-pricing-calculator.html"]
    ]
  },

  d6b1: {
    k: [
      "SNS is push-based publish/subscribe. A publisher sends one message to a topic and every subscription gets its own copy. Subscribers can be SQS queues, Lambda functions, HTTP(S) endpoints, email addresses or mobile push.",
      "An email subscription receives nothing until the recipient confirms it from the email that SNS sends. An alarm that seems silent is often a subscription still pending confirmation.",
      "By default a subscriber receives every message published to the topic. A filter policy on the subscription narrows that to messages whose attributes or body match, with no change to the publisher.",
      "SNS pushes to subscribers; they cannot poll it for a backlog. When each consumer must process at its own pace, subscribe one SQS queue per consumer to the topic (fan-out)."
    ],
    docs: [
      ["What is Amazon SNS?", "https://docs.aws.amazon.com/sns/latest/dg/welcome.html"],
      ["Amazon SNS message filtering", "https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html"],
      ["Fanout Amazon SNS notifications to Amazon SQS queues", "https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html"]
    ]
  },

  d6b2: {
    k: [
      "A metric alarm watches one metric or math expression and has three states: <code>OK</code>, <code>ALARM</code> and <code>INSUFFICIENT_DATA</code>. A new alarm sits in <code>INSUFFICIENT_DATA</code> until enough data points have arrived.",
      "Period, evaluation periods and datapoints to alarm decide how fast it fires. With basic monitoring an EC2 data point covers 5 minutes, so the alarm reacts slowly; detailed monitoring gives 1-minute data points.",
      "Besides notifying SNS, an alarm can stop, terminate, reboot or recover the instance. Recover works only with <code>StatusCheckFailed_System</code>: it moves the instance to new hardware and keeps its instance ID, IP addresses and EBS volumes.",
      "<code>CPUUtilization</code> is there without an agent. An alarm on memory or disk-space use first needs the CloudWatch agent on the instance to publish those metrics.",
      "A CloudWatch dashboard is not tied to one Region: a single dashboard can show metrics and alarms for resources spread across several Regions."
    ],
    docs: [
      ["Alarm evaluation", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-evaluation.html"],
      ["Stop, terminate, reboot, or recover an EC2 instance", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/UsingAlarmActions.html"],
      ["Automatic instance recovery", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-recover.html"]
    ]
  },

  d6b3: {
    k: [
      "Event history is on by default and free to view: the last 90 days of management events, one Region at a time, filtered by a single attribute. It shows no data events such as S3 object reads.",
      "IAM is a global service and CloudTrail records its events in US East (N. Virginia). If your Day 4 IAM actions are missing, switch the console Region to <code>us-east-1</code>. Regional services such as KMS and EC2 are listed in the Region you worked in.",
      "Open one event and find the four answers an auditor wants: who (<code>userIdentity</code>), what (<code>eventName</code>), when (<code>eventTime</code>) and from where (<code>sourceIPAddress</code>).",
      "Event history is for looking back. For longer retention or data events create a trail that delivers to S3, and for an alert within minutes of a specific API call use an EventBridge rule that matches the CloudTrail event."
    ],
    docs: [
      ["Working with CloudTrail event history", "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html"],
      ["CloudTrail concepts", "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html"]
    ]
  },

  d6b4: {
    k: [
      "An Application Load Balancer has two charges: every hour or partial hour it exists, plus Load Balancer Capacity Units for the traffic it handles. An idle load balancer still costs the hourly part.",
      "730 is the average number of hours in a month. Two instances running all month are 1,460 instance-hours: a steady baseline, which is what Savings Plans discount. Capacity that comes and goes with scaling suits On-Demand or Spot.",
      "Change one input at a time (pricing model, instance size, data transferred out) and note which one moves the total most. The largest lever is where cost optimization should start."
    ],
    docs: [
      ["Elastic Load Balancing pricing", "https://aws.amazon.com/elasticloadbalancing/pricing/"],
      ["What is AWS Pricing Calculator?", "https://docs.aws.amazon.com/pricing-calculator/latest/userguide/what-is-pricing-calculator.html"]
    ]
  },

  d6c1: {
    k: [
      "Each service has its own way to centralize. A Config aggregator gives one view of configuration and compliance across accounts and Regions, an organization trail collects API logs from every account, and one CloudWatch dashboard can show several Regions."
    ],
    trap: "Ask what the question wants to know. Who made the call is CloudTrail. What the resource looked like and whether it complied is Config. How it performed is CloudWatch. Config detects and can remediate, but only an SCP or IAM policy prevents.",
    docs: [
      ["What Is AWS Config?", "https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html"],
      ["What Is AWS CloudTrail?", "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html"],
      ["Using Amazon CloudWatch dashboards", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html"]
    ]
  },

  d6c2: {
    trap: "Operational excellence and reliability get mixed up. Small reversible changes, refined procedures and learning from incidents describe how you run the workload: operational excellence. Automatic recovery from failure and tested recovery procedures are reliability.",
    docs: [
      ["The pillars of the framework", "https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html"],
      ["Operational excellence design principles", "https://docs.aws.amazon.com/wellarchitected/latest/framework/oe-design-principles.html"],
      ["Reliability design principles", "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel-dp.html"]
    ]
  },

  d6c3: {
    trap: "Decide by what happens to a record after it is read. In SQS it is deleted once one worker has processed it. Kinesis Data Streams keeps it for the retention period, so several applications can read and replay it. Firehose only delivers it to a destination.",
    docs: [
      ["What is Amazon Kinesis Data Streams?", "https://docs.aws.amazon.com/streams/latest/dev/introduction.html"],
      ["What is Amazon Data Firehose?", "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"],
      ["What is Amazon Simple Queue Service?", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html"]
    ]
  }
});
