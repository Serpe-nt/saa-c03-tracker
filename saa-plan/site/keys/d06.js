// Key points per plan step for Day 6. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {










  d6c1: {
    k: [
      "Each service has its own way to centralize. A Config aggregator gives one view of configuration and compliance across accounts and Regions, an organization trail collects API logs from every account, and one CloudWatch dashboard can show several Regions."
    ],
    trap: "Ask what the question wants to know. Who made the call is CloudTrail. What the resource looked like and whether it complied is Config. How it performed is CloudWatch. Config detects and can remediate but does not prevent; blocking the call takes an SCP or IAM policy.",
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
    trap: "Decide by what happens to a record after it is read. In SQS the worker that processes a message deletes it. Kinesis Data Streams keeps it for the retention period, so several applications can read and replay it. Firehose only delivers it to a destination.",
    docs: [
      ["What is Amazon Kinesis Data Streams?", "https://docs.aws.amazon.com/streams/latest/dev/introduction.html"],
      ["What is Amazon Data Firehose?", "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"],
      ["What is Amazon Simple Queue Service?", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html"]
    ]
  }
});
