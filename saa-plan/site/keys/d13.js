// Key points for the plan steps whose id starts with d13 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d13e1: {
    head: "One last pass through every flashcard",
    why: "Facts from the first week have partly faded, and the exam asks you to tell similar services apart from memory. One full pass through every deck brings them back. It also shows which ones are still shaky while there is a day left to fix them.",
    idea: "Go through all four Domain Practice decks once, then only the missed cards until none are left.",
    do: [
      "Skill Builder → the flashcards in <b>Domain 1</b>, <b>2</b>, <b>3</b> and <b>4 Practice</b>: each whole deck, once.",
      "Then go through only the cards you missed, again and again, until none are left."
    ],
    k: [
      ["When a card counts as known", "When you can also say which requirement would make a neighbouring service the answer instead."]
    ],
    q: {
      q: "A flashcard asks for the service that gives users two static IP addresses and fast failover between Regions. You answer Global Accelerator, correctly. When does the card count as known?",
      o: [
        "When you can also say what would make CloudFront the answer instead: cacheable HTTP content",
        "Now, because the answer was right",
        "After three right answers to it in a row",
        "When you can repeat the card's wording exactly"
      ],
      a: [0],
      x: [
        "Right. The exam offers the neighbouring service as a distractor, so a card is known when you can say which requirement would make it the answer.",
        "A right answer on its own may be recognition. The exam also asks you to rule out the look-alike.",
        "Repeating the same card shows memory of the card, not that you can tell the two services apart.",
        "The exam words it differently. What counts is the requirement that decides, not the card's sentence."
      ],
      dom: 3, tags: ["Global Accelerator", "CloudFront"], doc: "ga"
    }
  },

  d13e2: {
    head: "Retake the Official Practice Question Set",
    why: "On Day 10 this set showed where you stood before any exam preparation. A retake shows whether those gaps are closed. But the 20 questions are the same, so a better score partly measures memory. What counts is whether you can now explain every option.",
    idea: "Retake the 20 questions, aim for 85% or more, and count an answer as known only when you can say why each other option is wrong.",
    do: [
      "Skill Builder → <b>Official Practice Question Set</b> again. The same 20 questions come in a different order.",
      "Before you read each explanation, say why each other option is wrong. Count only those answers as known.",
      "Aim for 85% or more, and enter the retake score in the Scores field below."
    ],
    k: [
      ["Memory inflates the score", "A higher score on a set you have seen before partly reflects memory of the questions."]
    ],
    q: {
      q: "On the retake you score 18 of 20, against 11 on Day 10. For 5 of the 18 you remembered the answer but cannot say why the other options are wrong. How many answers count as known?",
      o: [
        "13",
        "18",
        "20",
        "11"
      ],
      a: [0],
      x: [
        "Right. Only the 13 you can defend count as known. The other 5 show memory of the questions, not of the topic.",
        "18 includes 5 answers you only remembered. A higher score on a set you have seen before partly reflects memory.",
        "Only 18 were right, and 5 of those you cannot explain.",
        "Day 10's score is the starting point. Today's known answers are the ones you can defend now."
      ]
    }
  },

  d13e3: {
    head: "Tick off the exam guide, one task statement at a time",
    why: "By now you have studied what the courses offered, and that is not exactly what the exam guide lists. A topic the courses skipped can still be on the exam. Reading the guide line by line, out loud, is the last check that nothing in scope was missed.",
    idea: "Each task statement lists \"Knowledge of\" and \"Skills in\" items. Tick an item only when you can explain it out loud with one concrete AWS example.",
    do: [
      "Open the SAA-C03 exam guide from Day 10 and go through each task statement's \"Knowledge of\" and \"Skills in\" items.",
      "Say each item out loud with one concrete AWS example. Tick only the ones you can explain.",
      "Then read the list of in-scope services. For every one you cannot describe in one sentence, look up what it is for and stop there."
    ],
    k: [
      ["Out of scope too", "The guide also lists services that are out of scope. The last day is not the time for them."],
      ["Why out loud", "An item read silently looks familiar. Said out loud with an example, it shows whether you can explain it or only recognise it."]
    ],
    q: {
      q: "Reading the exam guide's in-scope list on Day 21, you reach Amazon Comprehend and cannot say what it is for. What do you do?",
      o: [
        "Look up what it is for, in one sentence, and stop there",
        "Skip it, since none of the lecture courses taught it",
        "Start a full course on it today",
        "Build it in your own account tonight"
      ],
      a: [0],
      x: [
        "Right. Questions on such services ask which one fits a need, so one sentence on what it is for is enough the day before.",
        "In scope means it can be on the exam, whether or not a course taught it.",
        "A full course the day before is new material, and Day 21 is for consolidating.",
        "A build adds cost and time, and the exam only asks which service fits a need."
      ],
      dom: 3, tags: ["AI/ML services"], doc: "comprehend"
    },
    docs: [
      ["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["SAA-C03 in-scope AWS services", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html"]
    ]
  },

  d13e4: {
    head: "Close the Exam Prep Plan with its summary",
    why: "On the evening before the exam it is tempting to start one more topic. New material now adds little and costs the calm you need tomorrow. The plan's own short summary is the better close: a look back at what you have covered, not a new start.",
    idea: "The Exam Prep Summary is the last training of the Exam Prep Plan, about five minutes long.",
    k: [
      ["No new topics today", "Day 21's goal is to consolidate. Anything new you meet in the summary goes into your notes, not into a study session tonight."]
    ],
    q: {
      q: "Day 21's plan says: consolidate, no new topics. In the Exam Prep Summary you hear of a feature you have never studied. What does that rule tell you to do?",
      o: [
        "Write it in your notes and move on: tonight is for what you already know",
        "Study it in depth tonight, in case it comes up tomorrow",
        "Re-watch the whole lecture course that covers it",
        "Rebuild it in your own account before you go to bed"
      ],
      a: [0],
      x: [
        "Right. The last evening consolidates. A new topic now adds little and costs the calm you need tomorrow.",
        "Studying in depth the night before is exactly the new material the rule keeps out.",
        "A whole course is hours of new material the evening before the exam.",
        "A build costs time and money, and tonight is for consolidating."
      ]
    }
  },

  d13l1: {
    head: "Make sure you will be let in to the exam",
    why: "You know the material, arrive on time, and are turned away at check-in: your certification account spells your last name differently from your passport, or your only photo ID expired last month. Each of these rules can stop you before the first question, and a day ahead leaves time to fix them.",
    idea: "Check-in tests three things: a valid ID, a name that matches your AWS Certification Account, and, for an online exam, a computer and a room that pass the checks.",
    do: [
      "Check that the first and last name on your ID are identical to the name in your AWS Certification Account. Correct the account before exam day if not.",
      "Online exam: one government-issued photo ID. Test centre: two IDs, either two primary IDs or one primary and one secondary.",
      "If online: run Pearson VUE's system test on the exam computer, clear your desk and room, and check that the webcam works."
    ],
    k: [
      ["Primary ID", "An original, unexpired, government-issued document with your name in Roman characters, a recent photo and your signature, such as a passport or driving licence."],
      ["Secondary ID", "Needs your name plus either a signature or a recent photo."],
      ["EU ID card", "As an exception, EU candidates testing in the EU may use an EU ID card."],
      ["Not accepted", "Expired, damaged, photocopied and digital IDs are not accepted."],
      ["Check-in times", "Online, you can launch the exam up to 30 minutes early. If you are more than 15 minutes late or the computer fails the system test, the exam does not launch and the fee is forfeited. At a test center, arrive 15 to 30 minutes early."]
    ],
    q: {
      q: "You will sit the exam online. Which of these IDs lets you check in?",
      o: [
        "An unexpired passport whose first and last name are identical to your AWS Certification Account",
        "A photo of your passport on your phone",
        "A driving licence that expired last week",
        "A company badge with your photo and name"
      ],
      a: [0],
      x: [
        "Right. An original, unexpired, government-issued photo ID whose name matches the account is what an online exam needs.",
        "Digital and photocopied IDs are not accepted.",
        "An expired ID is not accepted, even by a few days.",
        "A company badge is not government-issued, so it is not a primary ID."
      ]
    },
    docs: [
      ["AWS Certification policies: during testing", "https://aws.amazon.com/certification/policies/during-testing/"],
      ["AWS Certification policies: before testing", "https://aws.amazon.com/certification/policies/before-testing/"]
    ]
  },

  d13l2: {
    head: "Stop every charge in your AWS account",
    why: "Once the exam is over you may not open the account for weeks. A stopped instance with its volume, an Elastic IP or a forgotten KMS key keeps charging all that time. And the zero spend budget went quiet when the subscription was first charged. A full cleanup now makes sure the costs end when the studying does.",
    idea: "Delete what is still in your account, schedule the deletion of any KMS key you created, and look at the bill again the next day to confirm the charges have stopped.",
    do: [
      "③ Your AWS account, eu-west-1: check EC2 (instances, volumes, Elastic IPs), VPC (NAT gateways) and RDS, and delete everything still there.",
      "If you created a customer managed KMS key, schedule its deletion.",
      "Billing and Cost Management → <b>Bills</b> and <b>Credits</b>: note what was charged this month.",
      "Look at Bills again tomorrow."
    ],
    done: "EC2, VPC and RDS in eu-west-1 list nothing you created, and a day later the charges in Bills have stopped growing.",
    k: [
      ["Stopped is not deleted", "A stopped EC2 instance still pays for its EBS volumes and for Elastic IP addresses associated with it. A detached volume is billed until you delete it."],
      ["KMS key deletion", "A customer managed KMS key cannot be deleted at once. You schedule its deletion with a waiting period of 7 to 30 days, and the key is unusable while it is pending deletion."],
      ["Why look again tomorrow", "Cost Explorer refreshes cost data at least once every 24 hours, so today's view may not show the last charges yet."]
    ],
    q: {
      q: "In your final cleanup you want to get rid of the customer managed KMS key you created for practice. What happens when you delete it?",
      o: [
        "You schedule its deletion with a waiting period of 7 to 30 days, and the key can't be used while the deletion is pending",
        "It is deleted at once, and the data it encrypted stays readable with the AWS managed key",
        "It can only be disabled, because customer managed keys are never deleted",
        "It is deleted at once, as soon as no resource uses it any more"
      ],
      a: [0],
      x: [
        "Right. A customer managed KMS key can't be deleted at once: you schedule its deletion with a waiting period of 7 to 30 days, and it is unusable while it is pending deletion.",
        "The deletion is never immediate. And once a key is deleted, the data encrypted under it can no longer be decrypted: no other key reads it.",
        "A customer managed key can be deleted: you schedule the deletion, and the key goes when the waiting period ends.",
        "The deletion is never immediate, whether or not anything still uses the key: there is always a waiting period of 7 to 30 days."
      ],
      dom: 1, tags: ["KMS & encryption"], doc: "kms"
    },
    docs: [
      ["How EC2 instance stop and start works", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-stop-start-works.html"],
      ["Amazon EC2 instance state changes (billing by state)", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html"],
      ["Delete an AWS KMS key", "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html"]
    ]
  },

  d13l3: {
    head: "Cancel the Skill Builder subscription before it renews",
    why: "The exam is tomorrow and the plan is nearly done. If you do nothing, next month's subscription is charged to your AWS account anyway, and again the month after. The monthly budget from Day 1 sits above that charge, so it will not warn you.",
    idea: "Cancelling stops the next renewal. You keep the paid content until the end of the current billing period, so cancelling now loses nothing you have paid for.",
    do: [
      "Skill Builder → <b>Subscriptions Management</b> → <b>Cancel Subscription</b>, unless you want another month.",
      "Do it before the renewal date shown there."
    ],
    k: [
      ["Why no alert comes", "The monthly cost budget from Day 1 is a few dollars above the subscription, so a renewal alone never crosses it. Only cancelling stops the charge."]
    ],
    q: {
      q: "On Day 21 you cancel the subscription, ten days before its renewal date. What happens next?",
      o: [
        "No further charge, and the paid trainings stay open until the end of the current billing period",
        "Access ends at once, and the rest of the month is refunded",
        "It still renews once more before the cancellation takes effect",
        "Your AWS account is closed along with the subscription"
      ],
      a: [0],
      x: [
        "Right. Cancelling stops the next renewal, and you keep the paid content until the end of the current billing period.",
        "Access runs to the end of the billing period. A full refund exists only within 3 calendar days of the first purchase.",
        "Cancelling before the renewal date stops that renewal.",
        "The subscription is only billed to your AWS account. Cancelling it leaves the account as it is."
      ],
      doc: "budgets"
    },
    docs: [["AWS Training FAQs (how to cancel the Individual subscription)", "https://aws.amazon.com/training/faqs/"]]
  }
});
