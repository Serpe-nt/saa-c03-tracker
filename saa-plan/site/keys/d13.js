// Key points for the plan steps whose id starts with d13 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d13e1: {
    why: "Facts learned early in the plan have partly faded, and the exam asks you to tell similar services apart from memory. One full pass through every deck brings them back. It also shows which ones are still shaky while there is time to fix them.",
    k: [
      ["Full deck, then the misses", "Go through the whole deck once, then only the missed cards until none are left."],
      ["When a card counts as known", "A card counts as known when you can also say which requirement would make a neighbouring service the answer instead."]
    ]
  },

  d13e2: {
    why: "The first run of this set showed where you stood before the domain reviews. Running it again shows whether those gaps are closed. But the questions are the same, so a better score alone proves little. What counts is whether you can now explain every option.",
    k: [
      ["Memory inflates the score", "A higher score on a set you have seen before partly reflects memory of the questions."],
      ["What counts as known", "Count an answer as known only if you can say why each other option is wrong before you read the explanation."]
    ]
  },

  d13e3: {
    why: "By now you have studied what the courses offered, and that is not exactly what the exam guide lists. Reading the guide line by line is the last check that nothing in scope was skipped. Saying each item aloud separates what you can explain from what only looks familiar.",
    k: [
      ["Knowledge and skills lines", "Each task statement in the guide lists 'Knowledge of' and 'Skills in' items. Go through them line by line and give one concrete AWS example for each."],
      ["In-scope services", "The guide also lists in-scope and out-of-scope services. For every in-scope service you cannot describe in one sentence, look up what it is for and stop there."]
    ],
    docs: [
      ["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["SAA-C03 in-scope AWS services", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html"]
    ]
  },

  d13l1: {
    why: "You can know everything and still not be allowed to sit the exam. A name that does not match, the wrong kind of ID or a late arrival can stop you at check-in. Checking these rules a day early leaves time to put them right.",
    k: [
      ["Name must match", "The first and last name on your ID must be identical to the name in your AWS Certification Account, otherwise you are not allowed to test. Correct the account name before exam day."],
      ["Primary ID", "An original, unexpired, government-issued document with your name in Roman characters, a recent photo and your signature, such as a passport or driving licence."],
      ["Secondary ID", "Needs your name plus either a signature or a recent photo."],
      ["EU ID card", "As an exception, EU candidates testing in the EU may use an EU ID card."],
      ["Not accepted", "Expired, damaged, photocopied and digital IDs are not accepted."],
      ["Check-in times", "Online, you can launch the exam up to 30 minutes early. If you are more than 15 minutes late or the computer fails the system test, the exam does not launch and the fee is forfeited. At a test center, arrive 15 to 30 minutes early."]
    ],
    docs: [
      ["AWS Certification policies: during testing", "https://aws.amazon.com/certification/policies/during-testing/"],
      ["AWS Certification policies: before testing", "https://aws.amazon.com/certification/policies/before-testing/"]
    ]
  },

  d13l2: {
    why: "Once the exam is over you may not open the account for a while, and anything left running keeps charging unnoticed. A full cleanup now, and one more look at the bill a day later, makes sure the costs end when the studying does.",
    k: [
      ["Stopped is not deleted", "A stopped EC2 instance still pays for its EBS volumes and for Elastic IP addresses associated with it. A detached volume is billed until you delete it."],
      ["KMS key deletion", "A customer managed KMS key cannot be deleted at once. You schedule its deletion with a waiting period of 7 to 30 days, and the key is unusable while it is pending deletion."],
      ["Check again tomorrow", "Cost Explorer refreshes cost data at least once every 24 hours. So look at Bills again the day after the cleanup to confirm that the charges have stopped."]
    ],
    docs: [
      ["How EC2 instance stop and start works", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-stop-start-works.html"],
      ["Amazon EC2 instance state changes (billing by state)", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html"],
      ["Delete an AWS KMS key", "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html"]
    ]
  }
});
