// Key points per plan step for Day 7. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d7e1: {
    why: "If you prepare for the wrong kind of exam, you learn facts by heart and then meet questions that ask for a design decision. This overview shows what the exam really measures and how the prep plan is laid out. Then your study time goes to the right kind of practice.",
    k: [
      ["What the exam validates", "The ability to design solutions based on the AWS Well-Architected Framework."],
      ["Target candidate", "The exam is written for someone with at least 1 year of hands-on experience designing cloud solutions on AWS. So expect design decisions, not recall of console steps."],
      ["Existing systems too", "Besides new designs, the exam guide lists reviewing existing solutions and determining improvements. Be ready for stems that describe a running system and ask what to change."]
    ],
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]
    ]
  },

  d7e2: {
    why: "A question you understand can still be lost to the format: you leave it blank, or you take the first option that works. Knowing how the questions are built and scored tells you what to do when you are unsure. It also tells you how to choose between options that all look workable.",
    k: [
      ["Two question types", "Multiple choice has one correct response and three distractors. Multiple response has two or more correct responses out of five or more options."],
      ["Never leave a blank", "Unanswered questions are scored as incorrect, and there is no penalty for guessing. Eliminate what you can, choose, flag the question and move on."],
      ["Distractors look workable", "Distractors are written to be plausible to someone with incomplete knowledge, so several options usually look workable."],
      ["The qualifier decides", "The qualifier in the stem picks the best option: least operational overhead, most cost-effective or most secure."]
    ],
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]
    ]
  },

  d7e3: {
    why: "Without the exam guide you study by guesswork: too long on services that never appear, too little on the domains that weigh most. The guide is AWS's own statement of what is tested, how it is scored and which services are in scope. Reading it first lets you spend your days where the points are.",
    k: [
      ["65 questions, 130 minutes", "That is 2 minutes per question. Only 50 affect your score. The other 15 are unscored questions that are not identified, so treat every question as scored."],
      ["Passing score", "Results are a scaled score from 100 to 1,000, and the minimum passing score is 720. Scoring is compensatory: you need to pass the exam as a whole, not each section."],
      ["Domain weights", "Share of the scored content: Design Secure Architectures 30%, Design Resilient Architectures 26%, Design High-Performing Architectures 24%, Design Cost-Optimized Architectures 20%."],
      ["In scope, out of scope", "The guide lists in-scope and out-of-scope services, and both lists say they are not exhaustive. Out of scope are, for example, CodeBuild, CodeDeploy, Lightsail and all IoT services. Spend no study time there."],
      ["Short service names", "Services appear under their short official names: Amazon SNS, not Amazon Simple Notification Service. The Help feature, available on every question, lists the short names with their full names."]
    ],
    trap: "The 720 is a point on a scale from 100 to 1,000, not 72% of the questions. The guide says scaled scoring equates exam forms of slightly different difficulty. Do not neglect Domain 4 for being the smallest: it is still a fifth of the scored content.",
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["In-scope AWS services", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html"],
      ["AWS Certified Solutions Architect - Associate", "https://aws.amazon.com/certification/certified-solutions-architect-associate/"]
    ]
  },

  d7e4: {
    why: "Reading about services does not show whether you can pick the best of several plausible designs against the clock. This first set of official questions shows it early, while there is still time to fix what it reveals. Its value is in the explanations and in your reason for each miss, not in the score.",
    k: [
      ["Find the deciding requirement", "Do this before you read the options. Look in the stem for least operational overhead, most cost-effective, highest availability or no code changes. Then say what kind of answer it calls for."],
      ["Argue every option", "For every option, right or wrong, state in one sentence why it fits or fails this stem. An option you cannot argue against is a gap to write down, even if you answered the question correctly."],
      ["Sort each miss by cause", "Did not know the service: study the topic. Misread the requirement: slow down. Chose an option that works but is not the best: compare the options against the qualifier."],
      ["Timing drill", "The real exam allows 130 minutes for 65 questions. Give each question about 2 minutes: choose, flag it if unsure and move on."],
      ["Eliminate in two passes", "First strike every option that breaks a stated requirement or uses the wrong kind of service. Then choose between the survivors on the stem's qualifier."]
    ],
    trap: "The real exam reports a scaled score, not a percentage, so do not convert today's percentage into a predicted result. Use it only to rank your weak domains.",
    docs: [
      ["AWS Certified Solutions Architect - Associate", "https://aws.amazon.com/certification/certified-solutions-architect-associate/"]
    ]
  },

  d7e6: {
    why: "A vague feeling of being weak at databases gives you nothing to practise. Writing the weak spots down as concrete decisions turns them into a list you can drill and tick off. It also shows which gaps cost the most points.",
    k: [
      ["A decision, not a service", "Write each weak topic as a decision: 'Multi-AZ or read replica', 'gateway or interface endpoint'. A decision can be drilled, and 'RDS' cannot."],
      ["Note the domain", "Put the exam domain next to each topic. A gap in Domain 1 or Domain 2 costs the most, because together they are 56% of the scored content."]
    ],
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]
    ]
  },

  d7h2: {
    why: "Resources left behind after a build keep charging whether or not you use them. A regular look at the bill, and at the services that are easy to forget, catches them while the amount is still small.",
    k: [
      ["Stopped EC2 instance", "Stopping does not end the cost. A stopped instance still bills for its EBS volumes and for any Elastic IP address. Terminate what you no longer need."],
      ["Public IPv4 addresses", "A public IPv4 address is charged whether it is in use or idle. Release unused Elastic IP addresses."],
      ["NAT gateway and load balancer", "Both are easy to leave behind after a build or a lab of your own. A NAT gateway is charged for every hour it is provisioned. An Application Load Balancer is charged for every hour it exists, even with no traffic."],
      ["Stopped RDS instance", "Stopping does not park a database for long. Storage is still billed, and RDS starts the instance again automatically after 7 days. Delete lab databases instead."]
    ],
    docs: [
      ["How EC2 instance stop and start works", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-stop-start-works.html"],
      ["Amazon VPC pricing", "https://aws.amazon.com/vpc/pricing/"],
      ["Stopping an Amazon RDS DB instance temporarily", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html"]
    ]
  },

  d7h3: {
    why: "The date you want may be gone if you look too late, and the request for extra time has to be made before you register. Checking the dates now, without paying, shows what is available and leaves time to do things in the right order.",
    k: [
      ["Extra time (ESL +30)", "For candidates whose first language is not English. It adds 30 minutes. Request it in your AWS Certification account before you register for the exam. It is requested once and then applies to all later registrations."],
      ["Rescheduling", "A booked exam can be rescheduled up to 24 hours before its start time, and at most twice per appointment. A third change means cancelling and booking again."],
      ["Cancelling", "Cancelling more than 24 hours ahead refunds the exam fee."]
    ],
    docs: [
      ["AWS Certification policies: before testing", "https://aws.amazon.com/certification/policies/before-testing/"],
      ["AWS Certified Solutions Architect - Associate", "https://aws.amazon.com/certification/certified-solutions-architect-associate/"]
    ]
  }
});
