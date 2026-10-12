// Key points per plan step for Day 13. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d13e1: {
    k: [
      "Go through the whole deck once, then only the missed cards until none are left. A card counts as known when you can also say which requirement would make a neighbouring service the answer instead."
    ]
  },

  d13e2: {
    k: [
      "A higher score on a set you have seen before partly reflects memory of the questions. Count an answer as known only if you can say why each other option is wrong before you read the explanation."
    ]
  },

  d13e3: {
    k: [
      "Each task statement in the guide lists 'Knowledge of' and 'Skills in' items. Go through them line by line and give one concrete AWS example for each.",
      "The guide also lists in-scope and out-of-scope services. For every in-scope service you cannot describe in one sentence, look up what it is for and stop there."
    ],
    docs: [
      ["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["SAA-C03 in-scope AWS services", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html"]
    ]
  },

  d13l1: {
    k: [
      "The first and last name on your ID must be identical to the name in your AWS Certification Account, otherwise you are not allowed to test. Correct the account name before exam day.",
      "A primary ID is an original, unexpired, government-issued document with your name in Roman characters, a photo and a signature. A test center asks for two IDs (two primary, or one primary and one secondary); an online exam asks for one primary ID.",
      "As an exception, EU candidates testing in the EU may use an EU ID card. Expired, damaged, photocopied and digital IDs are not accepted.",
      "Online, you can launch the exam up to 30 minutes early. If you are more than 15 minutes late or the computer fails the system test, the exam does not launch and the fee is forfeited. At a test center, arrive 15 to 30 minutes early."
    ],
    docs: [
      ["AWS Certification policies: during testing", "https://aws.amazon.com/certification/policies/during-testing/"],
      ["AWS Certification policies: before testing", "https://aws.amazon.com/certification/policies/before-testing/"]
    ]
  },

  d13l2: {
    k: [
      "A stopped EC2 instance still pays for its EBS volumes and for Elastic IP addresses associated with it, and a detached volume is billed until you delete it.",
      "A customer managed KMS key cannot be deleted at once. You schedule its deletion with a waiting period of 7 to 30 days, and the key is unusable while it is pending deletion.",
      "Cost Explorer refreshes cost data at least once every 24 hours, so look at Bills again the day after the cleanup to confirm that the charges have stopped."
    ],
    docs: [
      ["How EC2 instance stop and start works", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-stop-start-works.html"],
      ["Delete an AWS KMS key", "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html"]
    ]
  }
});
