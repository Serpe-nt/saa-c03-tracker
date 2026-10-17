// Key points for the plan steps whose id starts with d7 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d7e1: {
    head: "What the exam measures, and how the prep plan is laid out",
    why: "You learn service facts by heart, then meet questions that describe a company's problem and ask for the best design. Recall alone doesn't answer them. Before you choose how to practise, you need to know what the exam really measures.",
    idea: "SAA-C03 validates the ability to design solutions based on the AWS Well-Architected Framework. The Exam Prep Plan is built to practise exactly that, one step at a time.",
    k: [
      ["Who it is written for", "Someone with at least 1 year of hands-on experience designing cloud solutions on AWS. So expect design decisions, not recall of console steps."],
      ["Existing systems too", "Besides new designs, the exam guide lists reviewing existing solutions and determining improvements. Be ready for stems that describe a running system and ask what to change."]
    ],
    q: {
      q: "Which kind of question should you expect most often on SAA-C03?",
      o: [
        "A scenario that asks for the best design under a stated requirement",
        "The exact console clicks that create a given resource",
        "The launch years and price lists of AWS services",
        "The precise syntax of AWS CLI commands"
      ],
      a: [0],
      x: [
        "Right. The exam validates designing solutions based on the Well-Architected Framework, for someone with a year of design experience: decisions, not recall.",
        "Console steps are recall. The exam asks which design fits a requirement.",
        "Dates and prices are not what a design decision turns on.",
        "Command syntax is recall too. The exam is about choosing the right architecture."
      ],
      doc: "wa"
    },
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]
    ]
  },

  d7e2: {
    head: "How the questions are built and scored",
    why: "Stuck on a hard question, you leave it blank to come back to, and the clock runs out first. A question you understand can still be lost to the format. You need to know how the questions are built and scored, so that doubt has a routine.",
    idea: "Knowing the format gives doubt a routine: eliminate what you can, choose on the stem's qualifier, flag the question, move on, and never leave one blank.",
    k: [
      ["Two question types", "Multiple choice has one correct response and three distractors. Multiple response has two or more correct responses out of five or more options."],
      ["Never leave a blank", "Unanswered questions are scored as incorrect, and there is no penalty for guessing."],
      ["Distractors look workable", "Distractors are written to be plausible to someone with incomplete knowledge, so several options usually look workable."],
      ["The qualifier decides", "The qualifier in the stem picks the best option: least operational overhead, most cost-effective or most secure."]
    ],
    q: {
      q: "A stem asks for the option with the least operational overhead. Two options would both work: a cron job on an EC2 instance that you patch, and a Lambda function started on a schedule. Which do you choose?",
      o: [
        "The Lambda function, because it has no servers for you to manage",
        "The cron job, because EC2 gives you full control",
        "The cron job, because it was the first option that worked",
        "Either one, because both meet the requirement"
      ],
      a: [0],
      x: [
        "Right. When several options work, the qualifier decides. Lambda runs the code with no servers to manage, so it has the least overhead.",
        "Control is what EC2 offers, but the qualifier asks for least overhead, and patching an instance is overhead.",
        "Distractors are written to look workable. The first option that works is not the best one.",
        "Only one option is the best under the qualifier, and the exam scores only that one."
      ],
      dom: 3, tags: ["Lambda"], doc: "lambda"
    },
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]
    ]
  },

  d7e3: {
    head: "Read the exam guide: what is tested and how it is scored",
    why: "Without the exam guide you study by feel: days on services that never appear, and too little time on the domain worth almost a third of the score. You need AWS's own statement of what is tested and how it is scored.",
    idea: "The SAA-C03 exam guide gives the four domains with their weights, how the exam is scored, and the services in scope and out of scope.",
    k: [
      ["65 questions, 130 minutes", "That is 2 minutes per question. Only 50 affect your score. The other 15 are unscored questions that are not identified, so treat every question as scored."],
      ["Passing score", "Results are a scaled score from 100 to 1,000, and the minimum passing score is 720. Scoring is compensatory: you need to pass the exam as a whole, not each section."],
      ["Domain weights", "Share of the scored content: Design Secure Architectures 30%, Design Resilient Architectures 26%, Design High-Performing Architectures 24%, Design Cost-Optimized Architectures 20%."],
      ["In scope, out of scope", "Both lists say they are not exhaustive. Out of scope are, for example, CodeBuild, CodeDeploy, Lightsail and all IoT services. Spend no study time there."],
      ["Short service names", "Services appear under their short official names: Amazon SNS, not Amazon Simple Notification Service. The Help feature on every question lists the short names with their full names."]
    ],
    trap: "The 720 is a point on a scale from 100 to 1,000, not 72% of the questions. The guide says scaled scoring equates exam forms of slightly different difficulty. Do not neglect Domain 4 for being the smallest: it is still a fifth of the scored content.",
    q: {
      q: "A friend plans to skip cost optimization, because Design Cost-Optimized Architectures is the smallest exam domain. What share of the scored content does that domain carry?",
      o: [
        "20%, a fifth of the scored content",
        "5%, so skipping it costs almost nothing",
        "It is unscored, like the 15 trial questions",
        "26%, the same as Design Resilient Architectures"
      ],
      a: [0],
      x: [
        "Right. The weights are 30%, 26%, 24% and 20%. The smallest domain is still a fifth of what is scored.",
        "No domain is that small. Cost-optimized design is 20%.",
        "The 15 unscored questions are single questions that are not identified, not a domain. Every domain counts toward the score.",
        "Design Resilient Architectures is 26%. Cost-optimized design is 20%."
      ]
    },
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["In-scope AWS services", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html"],
      ["AWS Certified Solutions Architect - Associate", "https://aws.amazon.com/certification/certified-solutions-architect-associate/"]
    ]
  },

  d7e4: {
    head: "Take the Official Practice Question Set",
    why: "Reading about services doesn't show whether you can pick the best of four plausible designs against the clock. This first set of official questions shows it early, while there is still time to fix what it reveals.",
    idea: "Its value is in the explanations and in your reason for each miss, not in the score. Twenty questions, free: read them slowly.",
    do: [
      "Open <b>Official Practice Question Set</b>: 20 questions, free.",
      "Before reading the options, find the deciding requirement in the stem: least operational overhead, most cost-effective, highest availability or no code changes.",
      "Read every explanation, right or wrong, and note the cause of each miss.",
      "Enter your score below."
    ],
    k: [
      ["Argue every option", "For every option, right or wrong, say in one sentence why it fits or fails this stem. An option you can't argue against is a gap to write down, even when you answered correctly."],
      ["Sort each miss by cause", "Did not know the service: study the topic. Misread the requirement: slow down. Chose an option that works but is not the best: compare the options against the qualifier."],
      ["Eliminate in two passes", "First strike every option that breaks a stated requirement or uses the wrong kind of service. Then choose between the survivors on the stem's qualifier."],
      ["Timing drill", "The real exam allows 130 minutes for 65 questions. Give each question about 2 minutes: choose, flag it if unsure and move on."]
    ],
    trap: "The real exam reports a scaled score, not a percentage, so do not convert today's percentage into a predicted result. Use it only to rank your weak domains.",
    q: {
      q: "A nightly batch job saves its progress and can restart if its instances are taken away. Both On-Demand and Spot Instances survive your first pass. The stem asks for the most cost-effective option. Which do you choose?",
      o: [
        "Spot Instances, because the work can be interrupted and Spot costs least",
        "On-Demand Instances, because they can never be interrupted",
        "On-Demand Instances, because they were the safer survivor",
        "Either one, because both survived the first pass"
      ],
      a: [0],
      x: [
        "Right. The second pass decides on the qualifier. Work that can be interrupted fits Spot, which is the cheapest.",
        "Not being interrupted is not what this stem asks for. It asks for the lowest cost.",
        "Safety is not the qualifier here. Cost is.",
        "The first pass only removes options that break a requirement. The qualifier then picks one."
      ],
      dom: 4, tags: ["EC2 purchase options"], doc: "ec2-pricing"
    },
    docs: [
      ["AWS Certified Solutions Architect - Associate", "https://aws.amazon.com/certification/certified-solutions-architect-associate/"]
    ]
  },

  d7e6: {
    head: "Write down your three weakest topics",
    why: "A vague feeling of being weak at databases gives you nothing to practise. Written down as concrete decisions, the gaps become a list you can drill and tick off, ranked by what they cost.",
    idea: "A weak topic written as a decision, with its exam domain beside it, tells you both what to drill and how much it is worth.",
    do: [
      "Open 📝 Day notes and write down your 3 weakest topics from today's question set.",
      "Write each one as a decision, such as \"Multi-AZ or read replica\", and put its exam domain next to it."
    ],
    k: [
      ["A decision can be drilled", "\"RDS\" can't be practised. \"Multi-AZ or read replica\" can: it has one rule and one question that tests it."],
      ["Domains 1 and 2 weigh most", "Together they are 56% of the scored content, so a gap in either costs the most points."]
    ],
    q: {
      q: "Which of these notes about a weak spot gives you the most to practise?",
      o: [
        "\"Security group or network ACL\" (Domain 1)",
        "\"Networking\"",
        "\"VPC: read more\"",
        "\"Study harder on security\""
      ],
      a: [0],
      x: [
        "Right. It names a decision, which has a rule you can drill, and its domain, which tells you what a gap there costs.",
        "A whole subject has no single rule to drill, so it gives nothing to practise.",
        "A service name is not a decision. Which choice inside the VPC is the weak one?",
        "An intention is not a topic. Name the decision you got wrong."
      ]
    },
    docs: [
      ["Exam guide: AWS Certified Solutions Architect - Associate (SAA-C03)", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]
    ]
  },

  d7h2: {
    head: "Check the bill for anything still running",
    why: "A NAT gateway left over from a build bills every hour with no traffic at all. A stopped database quietly starts itself again. A regular look at the bill, and at the services that are easy to forget, catches them while the amount is still small.",
    idea: "Bills shows what has been charged this month, and Credits what is left. A look at EC2, VPC and RDS in your Region shows anything still running.",
    do: [
      "In ③ your AWS account: <b>Billing and Cost Management</b> → <b>Bills</b> and <b>Credits</b>. Confirm that nothing unexpected is running.",
      "Also check EC2 (instances and Elastic IPs), VPC (NAT gateways) and RDS in eu-west-1."
    ],
    done: "Bills shows no charge you can't explain, and EC2, VPC and RDS list nothing you have forgotten.",
    k: [
      ["Stopped EC2 instance", "Stopping does not end the cost. A stopped instance still bills for its EBS volumes and for any Elastic IP address. Terminate what you no longer need."],
      ["Public IPv4 addresses", "A public IPv4 address is charged whether it is in use or idle. Release unused Elastic IP addresses."],
      ["NAT gateway and load balancer", "Both are easy to leave behind. A NAT gateway is charged for every hour it is provisioned. An Application Load Balancer is charged for every hour it exists, even with no traffic."],
      ["Stopped RDS instance", "Stopping does not park a database for long. Storage is still billed, and RDS starts the instance again automatically after 7 days. Delete lab databases instead."]
    ],
    q: {
      q: "Two weeks ago you stopped a test RDS database to save money. Today the bill shows it running again. Why?",
      o: [
        "RDS starts a stopped instance again automatically after 7 days",
        "Stopped RDS instances bill at the full running price",
        "Someone must have started it, because RDS never starts by itself",
        "Stopping an RDS instance only pauses its billing for 24 hours"
      ],
      a: [0],
      x: [
        "Right. A stopped RDS instance comes back after 7 days, and its storage was billed all along. Delete lab databases instead of stopping them.",
        "While stopped, an instance bills for its storage. The charge grew because RDS started it again.",
        "RDS does start a stopped instance by itself, after 7 days.",
        "The stop lasts up to 7 days, not 24 hours."
      ],
      dom: 4, tags: ["RDS"], doc: "rds"
    },
    docs: [
      ["How EC2 instance stop and start works", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-stop-start-works.html"],
      ["Amazon VPC pricing", "https://aws.amazon.com/vpc/pricing/"],
      ["Stopping an Amazon RDS DB instance temporarily", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html"]
    ]
  },

  d7h3: {
    head: "Look at exam dates, without booking yet",
    why: "The date you want may be gone if you look too late, and the request for extra time has to be made before you register. Checking the dates now, without paying, shows what is available and leaves time to do things in the right order.",
    idea: "You book the exam through your AWS Certification account and take it with Pearson VUE, online from home or at a test centre. Looking costs nothing until you pay.",
    do: [
      "Go to <b>aws.training</b> → <b>Certification</b> → AWS Certification Account → <b>Schedule New Exam</b>.",
      "SAA-C03 → <b>Schedule at Pearson VUE</b>. Look at dates around Day 22, online from home or at a test centre.",
      "Close without paying: today you are only checking availability."
    ],
    k: [
      ["Extra time (ESL +30)", "For candidates whose first language is not English. It adds 30 minutes. Request it in your AWS Certification account before you register. It is requested once and then applies to all later registrations."],
      ["Rescheduling", "A booked exam can be rescheduled up to 24 hours before its start time, and at most twice per appointment. A third change means cancelling and booking again."],
      ["Cancelling", "Cancelling more than 24 hours ahead refunds the exam fee."]
    ],
    q: {
      q: "Four days before your booked exam, you find out you can't make it. What keeps your exam fee safe?",
      o: [
        "Reschedule or cancel now, more than 24 hours before the start: cancelling then refunds the fee",
        "Wait until the morning of the exam, then cancel",
        "Stay booked and simply not show up",
        "Ask for a refund after the exam date has passed"
      ],
      a: [0],
      x: [
        "Right. An exam can be rescheduled up to 24 hours before its start, at most twice, and cancelling more than 24 hours ahead refunds the fee.",
        "Within the last 24 hours you can no longer reschedule, and the refund is for cancelling more than 24 hours ahead.",
        "The refund rule rewards cancelling in time. Not showing up uses none of it.",
        "The refund comes from cancelling more than 24 hours before the start, not afterwards."
      ]
    },
    docs: [
      ["AWS Certification policies: before testing", "https://aws.amazon.com/certification/policies/before-testing/"],
      ["AWS Certified Solutions Architect - Associate", "https://aws.amazon.com/certification/certified-solutions-architect-associate/"]
    ]
  }
});
