// Key points for the plan steps whose id starts with d6 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d6c1: {
    why: "When something goes wrong in an account you ask three different questions: how is it performing, who changed it, and what did it look like before. No single tool answers all three. CloudWatch watches performance, CloudTrail records who made which call, and AWS Config records how each resource was configured and whether it complied.",
    k: [
      ["Config aggregator", "For one view of many accounts. It shows configuration and compliance across accounts and Regions."],
      ["Organization trail", "For API logs from the whole organization. One trail collects the calls from every account."],
      ["CloudWatch dashboard", "For performance at a glance. One dashboard can show several Regions."]
    ],
    trap: "Ask what the question wants to know. Who made the call is CloudTrail. What the resource looked like and whether it complied is Config. How it performed is CloudWatch. Config detects and can remediate but does not prevent. Blocking the call takes an SCP or IAM policy.",
    docs: [
      ["What Is AWS Config?", "https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html"],
      ["What Is AWS CloudTrail?", "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html"],
      ["Using Amazon CloudWatch dashboards", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html"]
    ]
  },

  d6c2: {
    why: "A design can be weak in very different ways: hard to run, insecure, fragile, slow, too expensive or wasteful of resources. The Well-Architected Framework names one pillar for each of these concerns, so that a review asks about all of them. You must tell the pillars apart because the exam describes a practice and asks which pillar it serves.",
    trap: "Operational excellence and reliability get mixed up. Small reversible changes, refined procedures and learning from incidents describe how you run the workload: operational excellence. Automatic recovery from failure and tested recovery procedures are reliability.",
    docs: [
      ["The pillars of the framework", "https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html"],
      ["Operational excellence design principles", "https://docs.aws.amazon.com/wellarchitected/latest/framework/oe-design-principles.html"],
      ["Reliability design principles", "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel-dp.html"]
    ]
  },

  d6c3: {
    why: "Data that arrives all the time has to get from its producers to the code that handles it, and the needs differ. Sometimes each job must be done once by one worker: a queue, SQS. Sometimes several applications must read the same records and replay them: Kinesis Data Streams. Sometimes the data only has to land in a store: Data Firehose.",
    trap: "Decide by what happens to a record after it is read. In SQS the worker that processes a message deletes it. Kinesis Data Streams keeps it for the retention period, so several applications can read and replay it. Firehose only delivers it to a destination.",
    docs: [
      ["What is Amazon Kinesis Data Streams?", "https://docs.aws.amazon.com/streams/latest/dev/introduction.html"],
      ["What is Amazon Data Firehose?", "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"],
      ["What is Amazon Simple Queue Service?", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html"]
    ]
  }
});
