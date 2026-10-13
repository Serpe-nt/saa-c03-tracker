// Key points per plan step for Day 7. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d7e1: {
    k: [
      "The exam validates the ability to design solutions based on the AWS Well-Architected Framework. The target candidate has at least 1 year of hands-on experience designing cloud solutions on AWS, so expect design decisions, not recall of console steps.",
      "Besides new designs, the exam guide lists reviewing existing solutions and determining improvements. Be ready for stems that describe a running system and ask what to change."
    ],
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]
    ]
  },

  d7e2: {
    k: [
      "There are two question types: multiple choice (one correct response and three distractors) and multiple response (two or more correct responses out of five or more options).",
      "Unanswered questions are scored as incorrect and there is no penalty for guessing. Never leave a question blank: eliminate what you can, choose, flag it and move on.",
      "Distractors are written to be plausible to someone with incomplete knowledge, so several options usually look workable. The qualifier in the stem (least operational overhead, most cost-effective, most secure) picks the best one."
    ],
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]
    ]
  },

  d7e3: {
    k: [
      "65 questions in 130 minutes, which is 2 minutes per question. Only 50 affect your score: the other 15 are unscored questions that are not identified, so treat every question as scored.",
      "Results are a scaled score from 100 to 1,000 and the minimum passing score is 720. Scoring is compensatory: you need to pass the exam as a whole, not each section.",
      "Domain weights of the scored content: Design Secure Architectures 30%, Design Resilient Architectures 26%, Design High-Performing Architectures 24%, Design Cost-Optimized Architectures 20%.",
      "The guide lists in-scope and out-of-scope services, and both lists say they are not exhaustive. Out of scope are, for example, CodeBuild, CodeDeploy, Lightsail and all IoT services, so spend no study time there.",
      "Services appear under their short official names (Amazon SNS, not Amazon Simple Notification Service). The Help feature, available on every question, lists the short names with their full names."
    ],
    trap: "The 720 is a point on a scale from 100 to 1,000, not 72% of the questions: the guide says scaled scoring equates exam forms of slightly different difficulty. And do not neglect Domain 4 for being the smallest: it is still a fifth of the scored content.",
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["In-scope AWS services", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html"],
      ["AWS Certified Solutions Architect - Associate", "https://aws.amazon.com/certification/certified-solutions-architect-associate/"]
    ]
  },

  d7e4: {
    k: [
      "Before you read the options, find the deciding requirement in the stem (least operational overhead, most cost-effective, highest availability, no code changes) and say what kind of answer it calls for.",
      "For every option, right or wrong, state in one sentence why it fits or fails this stem. An option you cannot argue against is a gap to write down, even if you answered the question correctly.",
      "Sort each miss by cause: did not know the service, misread the requirement, or chose an option that works but is not the best. The fixes differ: study the topic, slow down, or compare the options against the qualifier.",
      "Use the set as a timing drill too. The real exam allows 130 minutes for 65 questions, so give each question about 2 minutes: choose, flag it if unsure and move on.",
      "Practise elimination in two passes. First strike every option that breaks a stated requirement or uses the wrong kind of service. Then choose between the survivors on the stem's qualifier."
    ],
    trap: "The real exam reports a scaled score, not a percentage, so do not convert today's percentage into a predicted result. Use it only to rank your weak domains.",
    docs: [
      ["AWS Certified Solutions Architect - Associate", "https://aws.amazon.com/certification/certified-solutions-architect-associate/"]
    ]
  },

  d7e6: {
    k: [
      "Write each weak topic as a decision, not a service: 'Multi-AZ or read replica', 'gateway or interface endpoint'. A decision can be drilled; 'RDS' cannot.",
      "Note the exam domain next to each one. A gap in Domain 1 or Domain 2 costs the most, because together they are 56% of the scored content."
    ],
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]
    ]
  },

  d7h2: {
    k: [
      "A stopped EC2 instance still bills for its EBS volumes and for any Elastic IP address, and a public IPv4 address is charged whether it is in use or idle. Terminate what you no longer need and release unused Elastic IP addresses.",
      "A NAT gateway is charged for every hour it is provisioned, and an Application Load Balancer for every hour it exists, even with no traffic. Both are easy to leave behind after a build or a lab of your own.",
      "Stopping an RDS instance does not park it for long: storage is still billed, and RDS starts the instance again automatically after 7 days. Delete lab databases instead."
    ],
    docs: [
      ["How EC2 instance stop and start works", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-stop-start-works.html"],
      ["Amazon VPC pricing", "https://aws.amazon.com/vpc/pricing/"],
      ["Stopping an Amazon RDS DB instance temporarily", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html"]
    ]
  },

  d7h3: {
    k: [
      "If English is not your first language, request the ESL +30 accommodation in your AWS Certification account before you register for the exam. It adds 30 minutes, is requested once and then applies to all later registrations.",
      "A booked exam can be rescheduled up to 24 hours before its start time, and at most twice per appointment; a third change means cancelling and booking again. Cancelling more than 24 hours ahead refunds the exam fee."
    ],
    docs: [
      ["AWS Certification policies: before testing", "https://aws.amazon.com/certification/policies/before-testing/"],
      ["AWS Certified Solutions Architect - Associate", "https://aws.amazon.com/certification/certified-solutions-architect-associate/"]
    ]
  }
});
