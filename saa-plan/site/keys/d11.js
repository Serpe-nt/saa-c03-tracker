// Key points for the plan steps whose id starts with d11 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d11e1: {
    head: "Domain 4: the cheapest design that still meets every requirement",
    why: "A design question offers four working answers. One keeps the backups in a single AZ, the cheapest, but the stem said the data must survive the loss of an AZ. Another is safe and costs three times as much. You need the cheapest option that still does everything the scenario asks.",
    idea: "Domain 4, Design Cost-Optimized Architectures, is 20% of the scored content, about 10 of the 50 scored questions. Its four task statements: storage, compute, databases and networks. Cost management tools and cost allocation tags are listed under all four.",
    k: [
      ["What \"most cost-effective\" means", "The cheapest option that still meets every stated requirement. First strike the options that break a requirement (retrieval time, availability, interruption tolerance), then compare price."],
      ["Cost allocation tags", "A tag such as <code>team</code> splits costs only after it is activated as a cost allocation tag."]
    ],
    trap: "The cheapest-looking option is often a distractor that quietly drops a requirement. Examples are a single AZ for data that must survive the loss of an AZ, or Spot for a service that cannot be interrupted.",
    q: {
      q: "A stem asks for the most cost-effective storage for backups that must survive the loss of an Availability Zone and be readable within milliseconds. Which option do you strike first, however cheap it is?",
      o: [
        "S3 One Zone-IA",
        "S3 Standard-IA",
        "S3 Glacier Instant Retrieval",
        "S3 Standard"
      ],
      a: [0],
      x: [
        "Right. One Zone-IA keeps the data in a single AZ, so it breaks the stated requirement. It is only for data you can re-create.",
        "Standard-IA keeps data across AZs with millisecond access, so it meets both requirements and stays in the comparison.",
        "Glacier Instant Retrieval gives millisecond access and keeps data across AZs, so it stays in the comparison.",
        "S3 Standard meets both requirements. It may cost more, but price is compared only after the requirements."
      ],
      dom: 4, tags: ["S3 storage classes & lifecycle"], doc: "s3-classes"
    },
    docs: [["SAA-C03 exam guide: Domain 4", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain4.html"]]
  },

  d11e2: {
    head: "Task 4.1: pay for storage by how often the data is read",
    why: "Ten years of invoices sit in S3 Standard and nobody has opened one in months, yet every gigabyte is billed at the top rate each month. Meanwhile someone moved short-lived logs to an archive class and pays minimum charges on data deleted after ten days. You need the class that matches how often, and how fast, the data is read.",
    idea: "Task statement 4.1 asks you to match each kind of data to its storage class, and to let lifecycle rules move and expire it, so that nothing sits on storage it does not need.",
    k: [
      ["S3 class by access pattern", "Intelligent-Tiering for unknown or changing access (no retrieval fees). A lifecycle rule or a direct upload to a cold class when the pattern is known. One Zone-IA only for data you can re-create."],
      ["Minimum storage durations", "30 days for Standard-IA and One Zone-IA, 90 for Glacier Instant and Flexible Retrieval, 180 for Deep Archive. These classes also add retrieval fees. Short-lived or often-read data belongs in S3 Standard."],
      ["Lifecycle rules remove waste", "Expire noncurrent versions a set number of days after they become noncurrent, and abort incomplete multipart uploads. S3 Storage Lens shows both across a whole organization and adds recommendations."],
      ["EBS waste", "gp3 costs less per GiB than gp2 and includes 3,000 IOPS and 125 MiB/s, so gp2 volumes oversized for IOPS get cheaper by changing type in place. Detached volumes bill until deleted. Data Lifecycle Manager automates snapshot retention."],
      ["EFS lifecycle management", "Moves files nobody reads to Infrequent Access or Archive inside the same file system."]
    ],
    trap: "Standard-IA for data that lives 10 days or is read often costs more than S3 Standard, because of the 30-day minimum and the retrieval fees.",
    q: {
      q: "Build logs are written to S3 every day, read a few times in their first week and deleted on day 14. Which storage choice costs least?",
      o: [
        "S3 Standard, with a lifecycle rule that expires the logs after 14 days",
        "S3 Standard-IA from the day each log is written",
        "S3 Glacier Flexible Retrieval from the day each log is written",
        "S3 Intelligent-Tiering, which moves the logs between tiers by itself"
      ],
      a: [0],
      x: [
        "Right. Short-lived, often-read data belongs in S3 Standard, and the lifecycle rule deletes it when it is no longer needed.",
        "Standard-IA bills at least 30 days per object and adds retrieval fees, so 14-day logs read several times cost more there.",
        "Glacier Flexible Retrieval bills at least 90 days and needs a restore before each read.",
        "Objects move to the infrequent tier only after 30 days without access, so these logs never leave the frequent tier and pay the monitoring fee on top."
      ],
      dom: 4, tags: ["S3 storage classes & lifecycle"], doc: "s3-classes"
    },
    docs: [
      ["Amazon S3 storage classes", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"],
      ["S3 Lifecycle configuration elements", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html"],
      ["Amazon EBS General Purpose SSD volumes", "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html"]
    ]
  },

  d11e3: {
    head: "Task 4.2: pay for compute the way the workload really runs",
    why: "A web shop's servers run at the full hourly price every hour of the year, though their load never changes. Next to them, a nightly job keeps its instances on around the clock for three hours of work. Both waste money, in opposite ways. You need the way you pay, and the kind of compute, to match how each workload runs.",
    idea: "Task statement 4.2 asks you to choose a commitment for steady load, Spot for work that can be interrupted, the right size, and compute that runs only while there is work.",
    k: [
      ["Commit only to steady usage", "A Savings Plan is a commitment to a set amount of usage per hour for 1 or 3 years. Commit only to usage that runs every hour of the term. Work that runs a few hours a day is cheaper on Spot, on a schedule or on serverless."],
      ["Which Savings Plan", "A Compute Savings Plan follows you across instance family, size, Region, OS and tenancy, and also covers Fargate and Lambda. An EC2 Instance Savings Plan discounts more but fixes one family in one Region."],
      ["Spot needs diversification", "Several instance types and AZs with the price-capacity-optimized strategy. Keep the must-run part on regular capacity: an On-Demand base in the Auto Scaling group, EMR primary and core nodes, regular Fargate beside Fargate Spot."],
      ["Right-size before you commit", "Compute Optimizer recommends sizes for EC2 instances, Auto Scaling groups, EBS volumes and Lambda memory. It sees memory use only with the CloudWatch agent. Cost Explorer recommends the Savings Plans commitment."],
      ["Match compute to how it runs", "Lambda for short event-driven bursts. Fargate tasks for long but occasional containers. Burstable T instances for low average CPU with spikes. Graviton for better price performance. Stop or scale to zero outside working hours."]
    ],
    trap: "The biggest discount is wrong when it breaks a requirement. Spot is wrong for a service that cannot be interrupted, and a commitment for a nightly job. An EC2 Instance Savings Plan is wrong when the workload will move to Fargate, Lambda or another family.",
    q: {
      q: "A rendering fleet on Spot Instances uses one instance type in one AZ. It is interrupted often and sometimes gets no capacity at all. What gives it the best chance of keeping capacity?",
      o: [
        "Allow several instance types in several AZs, with the price-capacity-optimized strategy",
        "Keep the single instance type, so that every node of the fleet is the same",
        "Cover the fleet with a 3-year EC2 Instance Savings Plan",
        "Move the fleet to one larger instance type in the same AZ"
      ],
      a: [0],
      x: [
        "Right. Spot needs diversification: more instance types and AZs give the fleet more pools of spare capacity to draw from.",
        "One type in one AZ is a single pool of spare capacity, which is exactly why the fleet keeps losing it.",
        "A Savings Plan discounts steady usage. It neither reserves Spot capacity nor stops interruptions.",
        "One larger type in one AZ is still a single pool, so the fleet stays as exposed as before."
      ],
      dom: 4, tags: ["EC2 purchase options"], doc: "ec2-pricing"
    },
    docs: [
      ["Savings Plans types", "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html"],
      ["Allocation strategies for Spot capacity", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-allocation-strategy.html"],
      ["What is AWS Compute Optimizer?", "https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html"]
    ]
  },

  d11e4: {
    head: "Task 4.3: find which line of the database bill is the problem",
    why: "A team buys a three-year reservation for a test database that sits idle most of the month. Another pays for six read replicas while most reads ask for the same few rows. A database bills for instance hours, storage, throughput and I/O at once, and a fix aimed at the wrong one saves nothing.",
    idea: "Task statement 4.3 asks you to see which part of the bill is the problem and to pick the pricing model or design that lowers it.",
    k: [
      ["Steady or idle-heavy", "A steady database gets a Reserved DB instance (1 or 3 years, Multi-AZ too) or a Database Savings Plan, valid across engines and Regions. Compute Savings Plans never cover RDS. Idle-heavy load fits Aurora serverless (pauses at 0 ACUs) or Redshift Serverless."],
      ["Used rarely, or kept long", "A stopped RDS instance still bills storage and starts again by itself after 7 days, so for a few days per quarter: snapshot, delete, restore when needed. Automated backups keep at most 35 days; longer needs manual snapshots or AWS Backup."],
      ["DynamoDB", "On-demand for unknown or spiky traffic. Provisioned capacity with auto scaling, plus reserved capacity, for steady traffic. The Standard-IA table class when storage dominates the bill. TTL to delete expired items without using write throughput."],
      ["Cache before more replicas", "When most reads repeat and some staleness is acceptable, add a cache with a matching TTL before more read replicas. AWS notes that one cache node can replace a number of database instances and so lower the total cost."],
      ["Aurora I/O-Optimized", "Has no per-request I/O charge. It pays off when I/O is 25% or more of the Aurora bill."]
    ],
    trap: "Read which line of the bill the stem blames. Storage, throughput, I/O and instance hours each have a different fix. A reservation or reserved capacity never helps a database that sits idle or has unpredictable load.",
    q: {
      q: "A DynamoDB table keeps years of order history that is rarely read. Its traffic is low and steady, and storage has become most of its bill. Which change lowers that bill?",
      o: [
        "Switch the table to the Standard-IA table class",
        "Switch the table to on-demand capacity mode",
        "Buy reserved capacity for the table's reads and writes",
        "Put a DAX cluster in front of the table"
      ],
      a: [0],
      x: [
        "Right. The Standard-IA table class is for tables whose bill is dominated by storage. The stem blames storage, so the fix is aimed there.",
        "On-demand is for unknown or spiky traffic. It changes how throughput is billed, not what storage costs.",
        "Reserved capacity lowers the price of steady throughput, not of storage, the line the stem blames.",
        "DAX is a cache that speeds up reads. It adds a cost and leaves the storage line where it was."
      ],
      dom: 4, tags: ["DynamoDB"], doc: "dynamodb"
    },
    docs: [
      ["Stopping an Amazon RDS DB instance temporarily", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html"],
      ["DynamoDB table classes", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.TableClasses.html"],
      ["Amazon Aurora storage", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.StorageReliability.html"]
    ]
  },

  d11e5: {
    head: "Task 4.4: send traffic the cheaper way round",
    why: "Private servers pull terabytes from S3 every night through a NAT gateway, and two chatty services talk across AZs over public IP addresses. Nothing is broken, yet every gigabyte pays on the way. You need to see which path the traffic takes and pick a cheaper one that still meets the requirements.",
    idea: "Task statement 4.4 asks you to price each path, through gateways, endpoints, zones, Regions, the edge and the link to a data center, and to keep traffic on the cheapest path that meets the requirements.",
    k: [
      ["Endpoints instead of the NAT gateway", "Day 12 showed that gateway endpoints for S3 and DynamoDB cost nothing while a NAT gateway bills per GB. ECR pulls need the S3 gateway endpoint plus the ECR interface endpoints, because image layers are stored in S3."],
      ["Traffic between AZs", "Traffic inside one AZ over private IPs is free. Across AZs, or to a public or Elastic IP address, it is charged in each direction. Use private IPs. Keep chatty nodes in one AZ when availability allows. Replicate only the prefixes that need a second Region."],
      ["Connecting many VPCs", "VPC peering has no connection charge, and traffic that stays in one AZ is free. Transit Gateway bills per attachment hour and per GB. With many VPCs, keep one set of interface endpoints in a shared VPC and resolve them through private hosted zones."],
      ["CloudFront and Requester Pays", "CloudFront lowers egress cost: transfer from AWS origins to CloudFront is waived and popular objects come from edge caches. A price class limits which edge locations serve you. Requester Pays moves request and download charges to the requester."],
      ["VPN, Direct Connect, the detailed bill", "Site-to-Site VPN suits low volume and fast setup. Direct Connect bills port hours even when idle but can reduce network cost for steady, heavy transfer. The Cost and Usage Report holds the most detailed hourly line items: query it with Athena."]
    ],
    trap: "A NAT gateway in every AZ removes cross-AZ hops but not the per-GB processing charge. S3 Transfer Acceleration and Global Accelerator add fees in exchange for speed. Neither lowers a data transfer bill.",
    q: {
      q: "Two services in one VPC exchange large volumes of data. One calls the other through its Elastic IP address, and they run in different AZs. Availability allows them to share an AZ. Which change lowers the transfer cost most?",
      o: [
        "Call over private IP addresses and run both services in the same AZ",
        "Add a NAT gateway in each AZ for the traffic between them",
        "Put Global Accelerator in front of the receiving service",
        "Keep the Elastic IP and move the receiving service to another Region"
      ],
      a: [0],
      x: [
        "Right. Traffic inside one AZ over private IPs is free. Through an Elastic IP or across AZs it is charged in each direction.",
        "A NAT gateway adds a per-GB processing charge and removes neither the Elastic IP hop nor the cross-AZ one.",
        "Global Accelerator adds fees in exchange for speed. It does not lower a data transfer bill.",
        "Traffic between Regions is charged too, so this only moves the cost, and adds latency."
      ],
      dom: 4, tags: ["Data transfer costs"], doc: "ec2-pricing"
    },
    docs: [
      ["Pricing for NAT gateways", "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html"],
      ["Gateway endpoints", "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html"],
      ["Amazon ECR interface VPC endpoints", "https://docs.aws.amazon.com/AmazonECR/latest/userguide/vpc-endpoints.html"]
    ]
  },

  d11e6: {
    head: "Practise Domain 4 on exam-style questions and flashcards",
    why: "Every option in a cost question works. You pick the cheapest-looking one and it quietly drops a requirement, or you pick a safe one when a cheaper option met everything. Knowing the services is not enough here: you also need what each costs you in commitments, minimums and fees.",
    idea: "Domain 4 Practice gives you exam-style questions and flashcards on its four task statements. Sorting each miss into one of two kinds shows which way you tend to go wrong.",
    do: [
      "Skill Builder → <b>Domain 4 Practice</b> → the exam-style questions and the flashcards. It needs the subscription.",
      "Sort each cost miss into one of the two kinds below.",
      "On the flashcards, say from memory the minimum storage durations and what each commitment type covers: those two lists decide many Domain 4 answers.",
      "Enter your question score in % in the Scores field below."
    ],
    k: [
      ["Two ways a cost answer goes wrong", "Your option broke a requirement, or a cheaper option met them all. The first is fixed by reading the stem's requirements before the prices. The second by knowing what each option costs."]
    ],
    q: {
      q: "A stem said the workload moves to Lambda next year. You chose an EC2 Instance Savings Plan for its steady EC2 use today, and missed. Which kind of miss is it?",
      o: [
        "Your option broke a requirement: that plan stops applying once the workload leaves EC2",
        "A cheaper option met every requirement: Spot would have covered the move",
        "No real miss: an EC2 Instance Savings Plan covers Lambda after a move",
        "A cheaper option met every requirement: On-Demand is always cheaper for a year"
      ],
      a: [0],
      x: [
        "Right. An EC2 Instance Savings Plan fixes one family in one Region. Only a Compute Savings Plan also covers Fargate and Lambda, so the stated move broke your option.",
        "Spot is for work that can be interrupted and has nothing to do with covering a move to Lambda.",
        "Only Compute Savings Plans cover Fargate and Lambda.",
        "On-Demand gives no discount at all. The steady use called for a commitment, just the flexible kind."
      ],
      dom: 4, tags: ["EC2 purchase options"], doc: "savings-plans"
    }
  },

  d11e7: {
    head: "Domain 4 in a guided lab: tie each setting to the bill it lowers",
    why: "A guided lab ends with a working build whether or not you saw what each setting saves. The exam starts from the bill instead: a line that is too high, and a requirement that must still hold. Each setting you build needs the cost it lowers attached to it, or the hour teaches only clicks.",
    idea: "This AWS SimuLearn lab practises Domain 4. You gather a customer's requirements in a conversation, then build the solution in a live AWS environment, a temporary sandbox and not your own account.",
    k: [
      ["Name the line of the bill", "After each build step, say which line that setting lowers: instance hours, storage, I/O, data transfer or the NAT gateway's per-GB charge."],
      ["Listen for what must still hold", "\"Cheaper, but it must survive the loss of an AZ\" or \"it may not be interrupted\" rule options out before price is compared, as in the Domain 4 introduction."]
    ],
    q: {
      q: "In the lab's conversation the customer says: \"Our batch servers work three hours each night, but we pay for them around the clock.\" Which change answers that?",
      o: [
        "Run the servers only during the batch window: stop them, or move the job to Spot or serverless",
        "Cover the servers with a 3-year Compute Savings Plan",
        "Buy Reserved Instances for the batch servers",
        "Move the servers to a larger instance type"
      ],
      a: [0],
      x: [
        "Right. Work that runs a few hours a day is cheaper on a schedule, on Spot or on serverless, because nothing is billed while it is idle.",
        "A Savings Plan is for usage that runs every hour of the term. This fleet idles 21 hours a day.",
        "A reservation pays for every hour of its term, the idle ones included.",
        "A larger type costs more per hour, and the servers would still run around the clock."
      ],
      dom: 4, tags: ["EC2 purchase options"], doc: "ec2-pricing"
    },
    docs: [["Immersive learning (AWS Cloud Quest and AWS SimuLearn)", "https://aws.amazon.com/training/digital/immersive-learning/"]]
  },

  d11p1: {
    head: "Sit the Official Practice Exam under real conditions",
    why: "You have answered hundreds of questions in short sets, with notes open and breaks in between. The real exam is 130 minutes in one sitting, and nobody knows how their knowledge holds up in the second hour until they try. You need one rehearsal at exam pace, without notes, before you decide to book.",
    idea: "The Official Practice Exam is the one rehearsal scored like the real thing: 65 questions in 130 minutes. Its scaled score feeds the decision on the next card.",
    do: [
      "Skill Builder → <b>Official Practice Exam</b>. It needs the subscription.",
      "Sit it in one go and without notes, as in the real exam.",
      "Answer every question on the first pass, flag the doubtful ones and come back to them with the time that is left.",
      "Enter the scaled score in the Scores field below."
    ],
    k: [
      ["Pace", "65 questions in 130 minutes is two minutes per question on average."],
      ["Unscored questions", "15 of the 65 are unscored and not marked as such, so treat every question as scored."],
      ["Why every question gets an answer", "Unanswered questions are scored as incorrect, and there is no penalty for guessing."],
      ["Question types", "Multiple choice has one correct answer among four options. Multiple response has two or more correct answers among five or more options."]
    ],
    q: {
      q: "Twenty minutes are left in the practice exam. Eight questions are still blank because you spent the time on flagged ones. What do you do?",
      o: [
        "Answer all eight now, guessing where you must, then go back to the flags",
        "Leave them blank, since a wrong answer costs more than a blank one",
        "Skip them, since some of them may be unscored anyway",
        "Spend the twenty minutes on the hardest flagged question first"
      ],
      a: [0],
      x: [
        "Right. A blank is scored as incorrect and a guess costs nothing, so every question gets an answer before any flag is revisited.",
        "There is no penalty for guessing. A blank is simply scored as incorrect.",
        "Unscored questions are not marked, so you cannot tell which ones they are. Treat every question as scored.",
        "One hard question is worth no more than each of the eight blanks. Answer those first."
      ]
    },
    docs: [
      ["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["AWS Certified Solutions Architect - Associate", "https://aws.amazon.com/certification/certified-solutions-architect-associate/"]
    ]
  },

  d11p2: {
    head: "Decide: book the exam now, or study longer",
    why: "The practice exam is behind you, and a number is on the screen. Booking too early risks a fail and a 14-day wait before a retake, and waiting too long lets the material fade. A gut feeling is a poor guide either way, so read the score for what it does and does not say.",
    idea: "The verdict below turns your scaled score into a decision: GO from 750, borderline from 720 to 749, not yet below 720. The real exam's pass mark is 720, on a scaled score.",
    do: [
      "Read the verdict below. It needs your Official Practice Exam score in the Scores field.",
      "GO: book the exam for Day 22 on the next card. Borderline: add 3 to 4 days, then book. Not yet: add a week before booking.",
      "With your Domain Practice scores entered too, the verdict names your weakest domain: study that one first."
    ],
    k: [
      ["What 720 means", "720 is a scaled score on a scale of 100 to 1,000, not 72% of the questions. Scaling evens out small differences in difficulty between exam forms."],
      ["Compensatory scoring", "You pass on the overall score and need no minimum in any domain. A weak domain still costs points in proportion to its weight (30, 26, 24 and 20%)."]
    ],
    q: {
      q: "Your practice exam score is 690. Domain 4 went well, Domain 1 went badly. What does the exam's compensatory scoring mean for your next week?",
      o: [
        "You pass on the overall score with no minimum per domain, and Domain 1 at 30% is where study wins the most points",
        "Each domain must be passed on its own, so Domain 1 alone fails you",
        "720 means 72% of the questions right, so you are three questions short",
        "Every domain counts the same, so study all four equally"
      ],
      a: [0],
      x: [
        "Right. No domain has a minimum, but a weak domain costs points in proportion to its weight, and Domain 1 weighs the most.",
        "Scoring is compensatory: only the overall score decides, with no minimum in any domain.",
        "720 is a scaled score from 100 to 1,000, not a percentage of the questions.",
        "The domains are weighted 30, 26, 24 and 20%, so a weak Domain 1 costs more than a weak Domain 4."
      ]
    },
    docs: [["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]]
  },

  d11b1: {
    head: "Book the exam for Day 22",
    why: "You pass the practice exam, wait a week to book, and the slots near your date are gone. Or you book, fall ill and cancel twenty hours before: the fee is lost. A booked date keeps you studying, and it starts rules that cost money if you learn them too late.",
    idea: "You book through your AWS Certification Account at Pearson VUE, online or at a test centre. Rescheduling or cancelling is free up to 24 hours before the appointment.",
    do: [
      "If English is not your first language, request the 30-minute extension (ESL +30) in your AWS Certification Account first, before you register.",
      "④ aws.training → <b>Certification</b> → AWS Certification Account → <b>Schedule New Exam</b> → AWS Certified Solutions Architect – Associate → <b>Schedule at Pearson VUE</b>.",
      "Choose online or test centre, pick Day 22, and pay.",
      "Remember the rules: reschedule (at most twice per appointment) or cancel free up to 24 hours before. After a fail you must wait 14 days to retake."
    ],
    k: [
      ["Late cancellation", "Cancelling less than 24 hours before the appointment, or not showing up, forfeits the exam fee."],
      ["Third change of date", "A third change of date means cancelling and booking again, so check a voucher's expiry date first."],
      ["Who gets the extension", "Non-native English speakers can request it for an exam taken in English. Requested once before you register, it then applies to all later registrations."],
      ["Retakes", "There is no limit on the number of attempts, but every attempt costs the full registration fee."]
    ],
    q: {
      q: "Your exam is booked for 09:00 on Day 22. At 18:00 on Day 21 you fall ill. What happens if you cancel now, or simply don't show up?",
      o: [
        "Either way the exam fee is forfeited, because it is less than 24 hours before the appointment",
        "Cancelling is free, because it is still the day before the exam",
        "Not showing up is free, and the exam moves to the next open slot",
        "Cancelling is free if it is your first change to this appointment"
      ],
      a: [0],
      x: [
        "Right. Changes are free only up to 24 hours before. Cancelling later, or not showing up, forfeits the fee.",
        "The limit is 24 hours before the appointment, not the calendar day. Fifteen hours before is too late.",
        "A no-show forfeits the fee. Nothing is moved for you.",
        "The two free reschedules count only up to 24 hours before. Within those 24 hours the fee is lost."
      ]
    },
    docs: [
      ["AWS Certification policies: before testing", "https://aws.amazon.com/certification/policies/before-testing/"],
      ["AWS Certification policies: after testing", "https://aws.amazon.com/certification/policies/after-testing/"]
    ]
  },

  d11c1: {
    head: "S3 Intelligent-Tiering or a Glacier class",
    why: "A company keeps every customer photo forever. Some are viewed daily, most never again, and nobody can say which will be which. Its signed contracts are different: read perhaps once a year, and then a few hours' wait is fine. Two questions decide the class: is the access pattern known, and how fast must the data come back?",
    idea: "S3 Intelligent-Tiering moves objects between tiers by itself when nobody can predict access. The Glacier classes are for data you know is rarely read, and differ in how fast it comes back: milliseconds, minutes to hours, or up to two days.",
    trap: "Intelligent-Tiering is wrong when the stem states the pattern: then a lifecycle rule or a direct upload to the right class wins. Among the Glacier classes, only Instant Retrieval needs no restore step.",
    q: {
      q: "Medical scans must be kept for 10 years. Each is read about once a quarter, and then it must open within milliseconds for the doctor. Which class costs least while meeting that?",
      o: [
        "S3 Glacier Instant Retrieval",
        "S3 Glacier Flexible Retrieval",
        "S3 Glacier Deep Archive",
        "S3 Intelligent-Tiering"
      ],
      a: [0],
      x: [
        "Right. Instant Retrieval gives millisecond access to data read about once a quarter, with no restore step.",
        "Flexible Retrieval needs a restore first, from minutes (expedited) to hours, so the doctor cannot open a scan in milliseconds.",
        "Deep Archive is the cheapest class, but a restore takes up to 12 hours, or 48 for bulk.",
        "The access pattern is known, so a direct choice of class beats a monitoring fee for tiering nobody needs."
      ],
      dom: 4, tags: ["S3 storage classes & lifecycle"], doc: "s3-classes"
    },
    docs: [
      ["Amazon S3 storage classes", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"],
      ["How S3 Intelligent-Tiering works", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering-overview.html"],
      ["Archive retrieval options", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects-retrieval-options.html"]
    ]
  },

  d11c2: {
    head: "Compute Savings Plans, EC2 Instance Savings Plans, Reserved Instances or Spot",
    why: "A company pays the full hourly price for servers that have run unchanged for two years. It could save a lot by promising something in return. But each discount asks for a different promise, and some stop applying when the workload changes. You need to tell them apart by what you give up and what each still covers.",
    idea: "Savings Plans and Reserved Instances trade a commitment to steady use for a discount. Spot trades the right to keep the capacity: AWS can take it back with a two-minute notice.",
    trap: "Only Compute Savings Plans cover Fargate and Lambda. An EC2 Instance Savings Plan stops applying when the instance family or Region changes. A regional Reserved Instance does not reserve capacity, and a zonal one does.",
    q: {
      q: "A team will run one instance type in one specific Availability Zone for three years and must be sure the capacity is there when it launches. Which purchase option reserves that capacity?",
      o: [
        "A zonal Reserved Instance in that Availability Zone",
        "A regional Reserved Instance in that Region",
        "A Compute Savings Plan for three years",
        "Spot Instances with the price-capacity-optimized strategy"
      ],
      a: [0],
      x: [
        "Right. A zonal Reserved Instance also reserves capacity in its Availability Zone.",
        "A regional Reserved Instance gives the discount but does not reserve capacity.",
        "A Savings Plan is a discount on usage. It reserves no capacity at all.",
        "Spot capacity can be taken back with a two-minute notice, the opposite of a guarantee."
      ],
      dom: 4, tags: ["EC2 purchase options"], doc: "ec2-pricing"
    },
    docs: [
      ["Savings Plans types", "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html"],
      ["Regional and zonal Reserved Instances", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/reserved-instances-scope.html"]
    ]
  },

  d11c3: {
    head: "NAT gateway or VPC endpoint, and what traffic between places costs",
    why: "Private servers back up 5 TB to S3 every night through the NAT gateway, and the NAT line of the bill grows with every gigabyte. The traffic never needed the internet: it went to an AWS service in the same Region. You need the private path that costs least, and to know which paths cost money at all.",
    idea: "A VPC endpoint is a private path to a service that does not go through the NAT gateway. Gateway endpoints, for S3 and DynamoDB only, cost nothing. Interface endpoints bill by the hour in each AZ and by the gigabyte.",
    trap: "A NAT gateway charges per GB for S3 and DynamoDB traffic in the same Region too, so \"it stays inside AWS\" does not make it free. Only a gateway endpoint removes that charge.",
    q: {
      q: "Private instances in two AZs call Amazon SQS heavily through a NAT gateway. The team wants that traffic private and the NAT processing charge gone. What do they add?",
      o: [
        "An interface endpoint for SQS",
        "A gateway endpoint for SQS",
        "A gateway endpoint for S3",
        "A second NAT gateway in the other AZ"
      ],
      a: [0],
      x: [
        "Right. SQS has no gateway endpoint, so the private path is an interface endpoint. It bills per hour and per GB, but the NAT charge for that traffic is gone.",
        "Gateway endpoints exist only for S3 and DynamoDB.",
        "An S3 gateway endpoint carries only S3 traffic. The SQS calls would still go through the NAT gateway.",
        "A second NAT gateway adds another hourly charge and keeps the per-GB processing charge."
      ],
      dom: 4, tags: ["VPC endpoints & PrivateLink"], doc: "endpoints"
    },
    docs: [
      ["Gateway endpoints", "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html"],
      ["Pricing for NAT gateways", "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html"],
      ["AWS PrivateLink pricing", "https://aws.amazon.com/privatelink/pricing/"]
    ]
  }
});
