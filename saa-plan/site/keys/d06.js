// Key points for the plan steps whose id starts with d6 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d6c1: {
    head: "CloudWatch, CloudTrail or AWS Config",
    why: "At 2 a.m. the site slows down, and a security group turns out to be open to the whole internet. Nobody knows who changed it, or what it looked like yesterday. Running a system raises three different questions, and no single tool answers all of them.",
    idea: "CloudWatch watches how things perform. CloudTrail records who made which API call. AWS Config records how each resource was configured, and whether it complied with your rules.",
    k: [
      ["Config aggregator", "For one view of many accounts. It shows configuration and compliance across accounts and Regions."],
      ["Organization trail", "For API logs from the whole organization. One trail collects the calls from every account."],
      ["CloudWatch dashboard", "For performance at a glance. One dashboard can show several Regions."]
    ],
    trap: "Ask what the question wants to know. Who made the call is CloudTrail. What the resource looked like and whether it complied is Config. How it performed is CloudWatch. Config detects and can remediate but does not prevent. Blocking the call takes an SCP or IAM policy.",
    q: {
      q: "A security group was opened to the whole internet some time yesterday. The security team needs the name of the IAM identity that made the change, and when. Which service answers that?",
      o: [
        "AWS CloudTrail",
        "AWS Config",
        "Amazon CloudWatch metrics",
        "VPC Flow Logs"
      ],
      a: [0],
      x: [
        "Right. CloudTrail records who made which API call, when and from where, so it names the identity behind the change.",
        "Config shows what the security group looked like before and after, and that it became noncompliant. Who made the call is CloudTrail's record.",
        "CloudWatch metrics show how resources perform, not who changed them.",
        "Flow logs record traffic and whether it was accepted. They don't record API calls."
      ],
      dom: 1, tags: ["CloudTrail"], doc: "cloudtrail"
    },
    docs: [
      ["What Is AWS Config?", "https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html"],
      ["What Is AWS CloudTrail?", "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html"],
      ["Using Amazon CloudWatch dashboards", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html"]
    ]
  },

  d6c2: {
    head: "The six pillars of the Well-Architected Framework",
    why: "A design review praises a cheap, fast system. A month later it goes down in its first outage, and nobody knows how to bring it back. A design can be weak in very different ways, and a review must ask about each of them.",
    idea: "The Well-Architected Framework names one pillar for each concern: operational excellence, security, reliability, performance efficiency, cost optimization and sustainability. The exam describes a practice and asks which pillar it serves.",
    trap: "Operational excellence and reliability get mixed up. Small reversible changes, refined procedures and learning from incidents describe how you run the workload: operational excellence. Automatic recovery from failure and tested recovery procedures are reliability.",
    q: {
      q: "After an outage, a team makes its system recover from failures by itself, and tests its recovery procedures every quarter. Which Well-Architected pillar does this work serve?",
      o: [
        "Reliability",
        "Operational excellence",
        "Performance efficiency",
        "Cost optimization"
      ],
      a: [0],
      x: [
        "Right. Recovering automatically from failure and testing recovery procedures are reliability.",
        "Operational excellence is about how you run the workload: small reversible changes, refined procedures, learning from incidents. Recovery from failure is reliability.",
        "Performance efficiency is about choosing and reviewing the right resources for the load.",
        "Cost optimization is about paying only for what you need."
      ],
      dom: 2, tags: ["Well-Architected"], doc: "wa"
    },
    docs: [
      ["The pillars of the framework", "https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html"],
      ["Operational excellence design principles", "https://docs.aws.amazon.com/wellarchitected/latest/framework/oe-design-principles.html"],
      ["Reliability design principles", "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel-dp.html"]
    ]
  },

  d6c3: {
    head: "Kinesis Data Streams, Data Firehose or SQS",
    why: "Clickstream events must feed a live dashboard and a fraud model, which both read every record, and land in an archive. Meanwhile each order job must be handled by one worker only. Data that keeps arriving has to get from its producers to the code that handles it, and the needs differ.",
    idea: "SQS is a queue: each message goes to one worker, which deletes it. Kinesis Data Streams keeps records for a retention period, so several applications can read and replay them. Amazon Data Firehose delivers data into a store, with no code.",
    trap: "Decide by what happens to a record after it is read. In SQS the worker that processes a message deletes it. Kinesis Data Streams keeps it for the retention period, so several applications can read and replay it. Firehose only delivers it to a destination.",
    q: {
      q: "Clickstream records must be read by a live dashboard and by a fraud model, each at its own pace, and the fraud team wants to rerun yesterday's records after a fix. Which service fits?",
      o: [
        "Amazon Kinesis Data Streams",
        "Amazon SQS",
        "Amazon Data Firehose",
        "Amazon SQS with a FIFO queue"
      ],
      a: [0],
      x: [
        "Right. Data Streams keeps each record for the retention period, so several applications read it independently and can replay it.",
        "In SQS the worker that processes a message deletes it, so two readers can't both get every record, and nothing can be replayed.",
        "Firehose delivers data into a destination. It has no consumers of yours and no replay.",
        "A FIFO queue keeps the order, but each message is still processed by one consumer, which deletes it."
      ],
      dom: 3, tags: ["Streaming"], doc: "kinesis"
    },
    docs: [
      ["What is Amazon Kinesis Data Streams?", "https://docs.aws.amazon.com/streams/latest/dev/introduction.html"],
      ["What is Amazon Data Firehose?", "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"],
      ["What is Amazon Simple Queue Service?", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html"]
    ]
  }
});
