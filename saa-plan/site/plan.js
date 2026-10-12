// Plan data. Edit freely: ids must stay unique (they key your saved progress).
// Each item is one step, shown alone on its own card: [id, text, note].
// Group fields: t = type, label, where, link (key in LINKS or "own"), min = estimated minutes for the whole block.
// Optional day fields: quiz (see above the plan), tools = extra buttons ("notebook", "weak"), decision = id of the step that shows the go/no-go verdict, notesHint.
// The number of days is whatever the plan holds: add, remove or reorder days freely. A {week: "…"} entry starts a new week.

window.LINKS = {
  sb:      { label: "Skill Builder",      url: "https://skillbuilder.aws/" },
  sa:      { label: "Solutions Architect plan", url: "https://skillbuilder.aws/learning-plan/EB6SVX4CTK/aws-solutions-architect-learning-plan-includes-labs/SAJSTUCC44" },
  epp:     { label: "Exam Prep Plan",     url: "https://skillbuilder.aws/learning-plan/UYRXS2DF85/exam-prep-plan-aws-certified-solutions-architect--associate-saac03--english/U991QUF9C3" },
  console: { label: "AWS Console",        url: "https://console.aws.amazon.com/" },
  calc:    { label: "Pricing Calculator", url: "https://calculator.aws/" },
  cert:    { label: "aws.training",       url: "https://aws.training/" },
  signup:  { label: "aws.amazon.com",     url: "https://aws.amazon.com/", hidden: true },
  credly:  { label: "Credly",             url: "https://www.credly.com/", hidden: true },
  idc:     { label: "Identity Center docs", url: "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html", hidden: true },
  overview: { label: "Overview of Amazon Web Services", url: "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/amazon-web-services-cloud-platform.html", hidden: true },
  // the lecture courses of the Solutions Architect plan (the Open button of each lecture block)
  c1:      { label: "Fundamentals of Architecting on AWS", url: "https://skillbuilder.aws/learn/ACYHAC5Q6K/aws-solutions-architect--fundamentals-of-architecting-on-aws/HNFECXKH8Q", hidden: true },
  c2:      { label: "Fundamentals of Security on AWS", url: "https://skillbuilder.aws/learn/3B33SJUS2V/aws-solutions-architect--fundamentals-of-security-on-aws/1YKQRRTHA7", hidden: true },
  c3:      { label: "Designing a Three-Tier Web Architecture", url: "https://skillbuilder.aws/learn/PQYQ64WVFD/aws-solutions-architect--designing-a-threetier-web-architecture/KH6CK2W6WM", hidden: true },
  c4:      { label: "Designing a Containerized Architecture", url: "https://skillbuilder.aws/learn/BPQP9DU1AG/aws-solutions-architect--designing-a-containerized-architecture/UQD1FWDFGM", hidden: true },
  c5:      { label: "Designing a Compliant, Secure, and Governed Architecture", url: "https://skillbuilder.aws/learn/Y6T231PY1H/aws-solutions-architect--designing-a-compliant-secure-and-governed-architecture/SA4FYZ29G8", hidden: true },
  c6:      { label: "Designing a Hybrid Architecture", url: "https://skillbuilder.aws/learn/1Z49U3PWM5/aws-solutions-architect--designing-a-hybrid-architecture/APTCHP874H", hidden: true },
  c7:      { label: "Designing a Serverless Architecture with Event-Driven Microservices", url: "https://skillbuilder.aws/learn/9PGAGSGUET/aws-solutions-architect--designing-a-serverless-architecture-with-eventdriven-microservices/PHC714WA2R", hidden: true },
  c8:      { label: "Designing a Data-Driven Architecture", url: "https://skillbuilder.aws/learn/51T7ZFDHNN/aws-solutions-architect--designing-a-datadriven-architecture/4M4324FXX2", hidden: true },
  c9:      { label: "Summary and Resources", url: "https://skillbuilder.aws/learn/CFGG4KAPWM/aws-solutions-architect--summary-and-resources/NC8SEUT17U", hidden: true }
};

// The plan follows two Skill Builder learning plans, as listed there on 2026-10-12:
// "AWS Solutions Architect Learning Plan (Includes Labs)" (Days 1–16: each lecture course, then its labs) and
// "Exam Prep Plan: AWS Certified Solutions Architect - Associate (SAA-C03 - English)" (Days 7 and 17–20).
// Day fields: quiz = "tags" (the topics of the day's steps), "review" (everything taught so far), "dom:1,2" (exam domains),
// "weak" (your weakest topics), "exam" (weighted like the exam); no quiz field = no quiz that day.
window.PLAN = [
{week: "Week 1 — Foundations and a three-tier application"},

{id:"d1", day:1, title:"Set up, and how an architect thinks",
 goal:"Enroll, start the subscription, set up ③ your own AWS account safely (~1 h), then the first half of Fundamentals of Architecting.",
 groups:[
 {t:"setup", label:"Setup: enroll on Skill Builder", where:"skillbuilder.aws → sign in with your AWS Builder ID", link:"sb", min:15, items:[
  ["d8s1","<b>Buy one month</b> of the Individual subscription (top menu → Subscriptions).","27 of the 36 trainings in the Solutions Architect plan need it, and so do Domain Practice and the Official Practice Exam. Turn off auto-renew right after buying; one month covers these three weeks."],
  ["s0a","Enroll in the learning plan <a href=\"https://skillbuilder.aws/learning-plan/EB6SVX4CTK/aws-solutions-architect-learning-plan-includes-labs/SAJSTUCC44\" target=\"_blank\" rel=\"noopener\"><b>AWS Solutions Architect Learning Plan (Includes Labs)</b></a>.","36 trainings, 66 h 45 min: eight lecture courses, each followed by its labs. This is the backbone of Days 1–16."],
  ["d1e3","Enroll in the learning plan <a href=\"https://skillbuilder.aws/learning-plan/UYRXS2DF85/exam-prep-plan-aws-certified-solutions-architect--associate-saac03--english/U991QUF9C3\" target=\"_blank\" rel=\"noopener\"><b>Exam Prep Plan: AWS Certified Solutions Architect - Associate (SAA-C03 - English)</b></a>.","18 trainings. Days 7 and 17–20 use it: overviews, the Official Practice Question Set, a review, practice questions and a lab per exam domain, and the Official Practice Exam."]]},
 {t:"setup", label:"Setup: create the account", where:"aws.amazon.com (public website, not Skill Builder)", link:"signup", min:20, items:[
  ["d1a1","Open <b>aws.amazon.com</b> → click <b>Create an AWS Account</b>.","Use your normal email. Account name: anything, e.g. <code>stepan-lab</code>. AWS is rolling out a new sign-up to some customers (a Google, GitHub, Apple or Amazon login, with \"projects\" and \"AWS Settings\"). If you get that one, follow its screens: you then have a personal login from the start, and the admin-user block below does not apply."],
  ["d1a2","Choose the <b>Free plan</b> when asked.","Gives credits (currently $100, plus up to $100 more for onboarding tasks) for up to 6 months. You aren't charged while the account stays on the Free plan. Creating or joining an AWS Organization upgrades it to the Paid plan automatically, which is why this plan never enables AWS Organizations or IAM Identity Center in your account."],
  ["d1a3","Enter card details and verify your phone.","AWS may place a small temporary hold on the card to verify it."],
  ["d1a4","Support plan: pick <b>Basic support (free)</b>. Finish sign-up and wait for the confirmation email."]]},
 {t:"setup", label:"Setup: lock down the root user", where:"console.aws.amazon.com → sign in as Root user (the email + password you just created)", link:"console", min:10, items:[
  ["d1b1","Top-right: your account name → <b>Security credentials</b> → <b>Assign MFA device</b> → authenticator app or passkey.","The root user can do anything, including closing the account. MFA on it is mandatory."],
  ["d1b2","Top-right Region selector → <b>Europe (Ireland) eu-west-1</b>. Use this Region for everything.","Working in one Region avoids 'where did my resource go' and forgotten resources that cost money."]]},
 {t:"setup", label:"Setup: your everyday admin login", where:"console.aws.amazon.com → search bar → \"IAM\"", link:"console", min:20, items:[
  ["d1u1","<b>Users</b> → <b>Create user</b> → your user name → tick <b>Provide user access to the AWS Management Console</b> → <b>I want to create an IAM user</b> → set a password.","An IAM user keeps the account on the Free plan. If the console offers no way to create a user with console access, you are on the new AWS experience and already sign in with a personal login: mark this block complete."],
  ["d1u2","<b>Set permissions</b> → <b>Add user to group</b> → <b>Create group</b> <code>Admins</code> with the <b>AdministratorAccess</b> policy → select the group → <b>Create user</b>.","The last page shows the console sign-in URL, the user name and the password. Keep it open for the next two steps."],
  ["d1u3","Open the new user → <b>Security credentials</b> → <b>Assign MFA device</b>.","An administrator without MFA is one leaked password away from a hijacked account."],
  ["d1u4","Copy the <b>console sign-in URL</b> (<code>https://&lt;account-id&gt;.signin.aws.amazon.com/console</code>) into ⚙ Settings here. Sign out of root and sign in as the new user.","Root is for emergencies only. The \"Open\" buttons for ③ will then take you to your sign-in page."]]},
 {t:"setup", label:"Setup: protect your wallet", where:"console.aws.amazon.com → search bar → \"Budgets\"", link:"console", min:10, items:[
  ["d1d1","<b>Create budget</b> → <b>Use a template</b> → <b>Zero spend budget</b> → your email.","Emails you once anything costs money beyond credits. Budget data refreshes a few times a day, so alerts can lag by hours."],
  ["d1d2","Search <b>Billing and Cost Management</b> → <b>Credits</b>: note your credit balance and expiry.","Check this page every few days."]]},
 {t:"watch", label:"Lecture", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs) → AWS Solutions Architect - Fundamentals of Architecting on AWS", link:"c1", min:120, items:[
  ["c1a","<b>Fundamentals of Architecting on AWS</b> → Foundations of AWS solution design: Solutions Architect Role, Cloud Architecting","Free. Watch at 1.25–1.5×; stop and replay whatever is new to you."],
  ["c1b","<b>Fundamentals of Architecting on AWS</b> → AWS Well-Architected Tool, Best Practices, Tech Talk: AWS Well-Architected Framework"]]},
 {t:"check", label:"Self-check", min:5, items:[
  ["d6c2","The six Well-Architected pillars."]]}
]},

{id:"d2", day:2, title:"Global infrastructure and the core services", quiz:"tags",
 goal:"Finish Fundamentals of Architecting, then the first two labs.",
 groups:[
 {t:"watch", label:"Lecture", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs) → AWS Solutions Architect - Fundamentals of Architecting on AWS", link:"c1", min:180, items:[
  ["c1c","<b>Fundamentals of Architecting on AWS</b> → Introduction to the AWS Global Infrastructure: AWS Global Infrastructure, Security and the AWS Shared Responsibility Model"],
  ["c1d","<b>Fundamentals of Architecting on AWS</b> → Networking Fundamentals"],
  ["c1e","<b>Fundamentals of Architecting on AWS</b> → Compute as a Service"],
  ["c1f","<b>Fundamentals of Architecting on AWS</b> → Cloud Storage, Database Services, Knowledge check"]]},
 {t:"play", label:"Labs", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs). Each lab opens a temporary AWS sandbox: nothing runs in your own account.", link:"sa", min:120, items:[
  ["l1a","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/JUV48NHGQY/aws-simulearn-cloud-computing-essentials/QB768XECES\" target=\"_blank\" rel=\"noopener\"><b>Cloud Computing Essentials</b></a>","Free, about 1 h. You talk to a simulated customer, design the solution, then build it in a sandbox."],
  ["l1b","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/W94AYNMYDS/aws-simulearn-cloud-first-steps/B8K46VES8S\" target=\"_blank\" rel=\"noopener\"><b>Cloud First Steps</b></a>","Free, about 1 h."]]},
 {t:"check", label:"Self-check", min:15, items:[
  ["d1c6","Region vs Availability Zone vs edge location."],
  ["d1c7","EC2 purchase options: On-Demand, Savings Plans, Reserved, Spot, Dedicated."],
  ["d1c8","When to pick EC2 vs Lambda vs ECS on Fargate."]]}
]},

{id:"d3", day:3, title:"Networking, compute and databases, hands-on", quiz:"tags",
 goal:"Three guided labs, then build a VPC yourself with nobody guiding you.",
 groups:[
 {t:"play", label:"Labs", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs). Each lab opens a temporary AWS sandbox: nothing runs in your own account.", link:"sa", min:180, items:[
  ["l1c","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/XCEMH2NXKJ/aws-simulearn-networking-concepts/QN5P4AJMUV\" target=\"_blank\" rel=\"noopener\"><b>Networking Concepts</b></a>","Free, about 1 h."],
  ["l1d","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/NZ6D7QYABD/aws-simulearn-computing-solutions/YQA9623D5T\" target=\"_blank\" rel=\"noopener\"><b>Computing Solutions</b></a>","Free, about 1 h."],
  ["l1e","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/6VTV7UQ6CY/aws-simulearn-databases-in-practice/3M6ZTC32MX\" target=\"_blank\" rel=\"noopener\"><b>Databases in Practice</b></a>","Free, about 1 h."]]},
 {t:"build", label:"Build", where:"③ Your own AWS account, signed in as your admin user (Day 1). Search bar → \"VPC\".", link:"own", min:120, items:[
  ["d2b1","<b>Create VPC</b> → <b>VPC and more</b> → 2 AZs, 2 public + 2 private subnets, NAT gateway <b>In 1 AZ</b>.","Then open each created item (subnets, route tables, IGW, NAT) and understand why it exists."],
  ["d2b2","Launch an EC2 instance (t3.micro, Amazon Linux) into a <b>private</b> subnet, no public IP, no key pair.","Advanced details → IAM instance profile: create a role with <code>AmazonSSMManagedInstanceCore</code>."],
  ["d2b3","Connect: EC2 → select instance → <b>Connect</b> → <b>Session Manager</b>.","Works with no SSH and no public IP, because the instance reaches AWS through the NAT gateway."],
  ["d2b4","Break it on purpose: in the private subnet's <b>Network ACL</b>, remove the outbound rule and watch Session Manager fail. Restore it.","Security groups remember connections (stateful); NACLs don't (stateless)."],
  ["d2b5","<b>Clean up:</b> terminate the instance → delete the NAT gateway → release the Elastic IP → delete the VPC.","The NAT gateway costs money every hour it exists."]]},
 {t:"check", label:"Self-check", min:10, items:[
  ["d2c1","Security group vs NACL."],
  ["d3c2","RDS Multi-AZ (availability) vs read replica (read scaling)."]]}
]},

{id:"d4", day:4, title:"Security foundations and IAM", quiz:"tags",
 goal:"Domain 1 is 30% of the exam. IAM must become second nature.",
 groups:[
 {t:"watch", label:"Lecture", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs) → AWS Solutions Architect - Fundamentals of Security on AWS", link:"c2", min:90, items:[
  ["c2a","<b>Fundamentals of Security on AWS</b> → Security best practices: Security is Job Zero, Security and the AWS Shared Responsibility Model, Tech Talk"],
  ["c2b","<b>Fundamentals of Security on AWS</b> → Access control: Protecting the AWS Root User, Managing Access with IAM, Knowledge Check"]]},
 {t:"play", label:"Labs", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs). Each lab opens a temporary AWS sandbox: nothing runs in your own account.", link:"sa", min:105, items:[
  ["l2a","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/3KYWQBTSTV/aws-simulearn-core-security-concepts/Q29T2DWZPK\" target=\"_blank\" rel=\"noopener\"><b>Core Security Concepts</b></a>","Free, about 1 h."],
  ["l2b","AWS Builder Lab: <a href=\"https://skillbuilder.aws/learn/XFPX3M7HAQ/introduction-to-aws-identity-and-access-management-iam/DQJ3N5QRRU\" target=\"_blank\" rel=\"noopener\"><b>Introduction to AWS Identity and Access Management (IAM)</b></a>","Free, about 45 min."]]},
 {t:"watch", label:"Read: IAM Identity Center", where:"docs.aws.amazon.com → IAM Identity Center User Guide. Reading only: do not enable it in your account.", link:"idc", min:25, items:[
  ["d1c1","<b>What is IAM Identity Center?</b> One sign-in at the access portal for every AWS account and application a person is assigned.","How companies give people access to AWS, and on the exam. Don't enable it here: that creates an AWS Organization, which moves a Free plan account to pay-as-you-go."],
  ["d1c3","<b>Permission sets</b>: a template of IAM policies, such as AdministratorAccess, that becomes a role in every account it is assigned to."],
  ["d1c4","<b>Assignments</b>: a user or group, an AWS account and a permission set. Access exists only for that combination."],
  ["d1c5","<b>AWS access portal</b>: people sign in at one URL, pick an account and a role, and get temporary credentials for the console and the CLI.","Compare with your own login from Day 1: an IAM user has a long-lived password and belongs to one account."]]},
 {t:"setup", label:"Setup: AWS CLI on your PC", where:"Your terminal", min:20, items:[
  ["d4s1","Install AWS CLI v2 (distro package or the official installer).","Check with <code>aws --version</code>: <code>aws login</code> needs 2.32.0 or newer."],
  ["d4s2","<code>aws login --profile lab</code> → Region <code>eu-west-1</code> → sign in as your admin user in the browser window that opens.","No long-term access keys on disk: the CLI gets temporary credentials from your console sign-in and refreshes them for up to 12 hours. A company on IAM Identity Center uses <code>aws configure sso</code> instead."],
  ["d4s3","Test: <code>aws sts get-caller-identity --profile lab</code>"]]},
 {t:"build", label:"Build", where:"③ Your own AWS account, signed in as your admin user (Day 1). Search bar → \"IAM\" (classic IAM, not Identity Center).", link:"own", min:75, items:[
  ["d4b1","Create an empty S3 bucket. Then <b>Policies</b> → <b>Create policy</b> (JSON): allow <code>s3:GetObject</code> only on that bucket.","Read the JSON line by line: Effect, Action, Resource."],
  ["d4b2","<b>Roles</b> → <b>Create role</b> → trusted entity <b>EC2</b> → attach your policy. Launch an instance with this role and read from the bucket with no access keys.","This is how apps on AWS get permissions."],
  ["d4b3","Create a second role trusted by your own account; assume it from your PC: <code>aws sts assume-role --role-arn &lt;arn&gt; --role-session-name test --profile lab</code>.","The trust policy decides who may assume the role."],
  ["d4b6","<b>Clean up:</b> terminate the instance, then delete the two roles, the policy and the bucket."]]},
 {t:"check", label:"Self-check", min:10, items:[
  ["d4c1","Identity-based vs resource-based policies; an explicit deny always wins."],
  ["d8c2","Cross-account access: role trust policy, external ID."]]}
]},

{id:"d5", day:5, title:"A three-tier web application", quiz:"tags",
 goal:"The pattern most exam scenarios are built on: network, compute, storage, then load balancing and scaling across AZs.",
 groups:[
 {t:"watch", label:"Lecture", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs) → AWS Solutions Architect - Designing a Three-Tier Web Architecture", link:"c3", min:270, items:[
  ["c3a","<b>Designing a Three-Tier Web Architecture</b> → Course Overview, Gathering the Customer Requirements, Network Requirements"],
  ["c3b","<b>Designing a Three-Tier Web Architecture</b> → Compute Requirements"],
  ["c3c","<b>Designing a Three-Tier Web Architecture</b> → Storage Requirements"],
  ["c3d","<b>Designing a Three-Tier Web Architecture</b> → Validating requirements: Monitoring, Load Balancing"],
  ["c3e","<b>Designing a Three-Tier Web Architecture</b> → Auto Scaling, Resilience"],
  ["c3f","<b>Designing a Three-Tier Web Architecture</b> → Putting it all together: Designing the Proof of Concept, Activity: Design a Basic Three-Tier Architecture"]]},
 {t:"check", label:"Self-check", min:15, items:[
  ["d5c1","ALB vs NLB vs Gateway Load Balancer."],
  ["d5c2","Scaling policies: target tracking, step, scheduled, predictive."],
  ["d5c3","EC2 vs ELB health checks in an Auto Scaling group."]]}
]},

{id:"d6", day:6, title:"Build and secure the three tiers", quiz:"tags",
 goal:"Labs for yesterday's course. The last one is three hours: start it rested.",
 groups:[
 {t:"play", label:"Labs", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs). Each lab opens a temporary AWS sandbox: nothing runs in your own account.", link:"sa", min:300, items:[
  ["l3a","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/ND365ZJBB6/aws-simulearn-singlepage-app/UT4MJDWTFW\" target=\"_blank\" rel=\"noopener\"><b>Single-Page App</b></a>","About 1 h."],
  ["l3b","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/FB9MQ41S9Z/aws-simulearn-securing-a-threetiered-architecture/NG4X64EDMC\" target=\"_blank\" rel=\"noopener\"><b>Securing a Three-Tiered Architecture</b></a>","About 1 h."],
  ["l3c","AWS Builder Lab: <a href=\"https://skillbuilder.aws/learn/V32MV5MZ6W/architecting-highly-available-multitier-applications-on-aws/M88JRR82HR\" target=\"_blank\" rel=\"noopener\"><b>Architecting Highly Available Multi-Tier Applications on AWS</b></a>","About 3 h. A load balancer, Auto Scaling and a database across Availability Zones, built step by step."]]},
 {t:"check", label:"Self-check", min:5, items:[
  ["d3c1","EBS (gp3/io2/st1/sc1) vs EFS vs FSx vs S3 — when each."]]}
]},

{id:"d7", day:7, title:"First exam questions, and catch-up", quiz:"review",
 goal:"First contact with real exam-style questions. A low score is expected and fine. The rest of the day is for anything left open from Days 1–6.",
 notesHint:"Your 3 weakest topics from the question set…",
 groups:[
 {t:"prep", label:"Exam Prep Plan, the free start", where:"① Skill Builder → My training → Exam Prep Plan: AWS Certified Solutions Architect - Associate (SAA-C03 - English)", link:"epp", min:100, items:[
  ["d7e1","<b>Exam Prep Plan Overview</b>","15 minutes: the four steps of the plan and how much time to spend on each."],
  ["d7e2","<b>Exam Prep Overview</b>","20 minutes: the scope of the exam, its audience and its topics."],
  ["d7e3","Read the <a href=\"https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html\" target=\"_blank\" rel=\"noopener\"><b>SAA-C03 exam guide</b></a> on docs.aws.amazon.com.","Read it fully, including the list of in-scope services. It is a document, not one of the plan's trainings."],
  ["d7e4","<b>Official Practice Question Set</b>","20 questions, free. Read every explanation, right or wrong. Enter your score below."],
  ["d7e6","Write down your 3 weakest topics in 📝 Day notes."]]},
 {t:"setup", label:"Housekeeping", min:30, items:[
  ["d7h2","In ③ your AWS account: <b>Billing and Cost Management</b> → <b>Bills</b> and <b>Credits</b> — confirm nothing unexpected is running.","Also check EC2, VPC (NAT gateways) and RDS in eu-west-1."],
  ["d7h3","Go to <b>aws.training</b> → <b>Certification</b> → AWS Certification Account → <b>Schedule New Exam</b> → SAA-C03 → <b>Schedule at Pearson VUE</b>. Look at dates around Day 21, then close without paying.","Online from home or at a test centre. Just checking availability today."]]}
]},

{week: "Week 2 — Containers, security, hybrid and serverless"},

{id:"d8", day:8, title:"Containers and object storage", quiz:"tags",
 goal:"First half of the longest course: containers, then S3 access control and data protection.",
 groups:[
 {t:"watch", label:"Lecture", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs) → AWS Solutions Architect - Designing a Containerized Architecture", link:"c4", min:180, items:[
  ["c4a","<b>Designing a Containerized Architecture</b> → Course Overview, Gathering the Customer Requirements, Container Fundamentals"],
  ["c4b","<b>Designing a Containerized Architecture</b> → AWS Container Services, Tech Talk: Making the Right Choices with Containers, Monitoring Containerized Workloads"],
  ["c4c","<b>Designing a Containerized Architecture</b> → Designing multi-Region storage: Access Control with Amazon S3, Demonstration: Amazon S3 Permissions Models and Access Points, Data Protection in Amazon S3"]]},
 {t:"play", label:"Labs", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs). Each lab opens a temporary AWS sandbox: nothing runs in your own account.", link:"sa", min:120, items:[
  ["l4a","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/HQQ3MWFGTB/aws-simulearn-container-services/YDGNWBZCGH\" target=\"_blank\" rel=\"noopener\"><b>Container Services</b></a>","About 1 h."],
  ["l4d","AWS Builder Lab: <a href=\"https://skillbuilder.aws/learn/CV6ZEU3NHE/working-with-amazon-elastic-container-service/X989GB8H74\" target=\"_blank\" rel=\"noopener\"><b>Working with Amazon Elastic Container Service</b></a>","About 1 h."]]},
 {t:"check", label:"Self-check", min:10, items:[
  ["d3c3","S3 storage classes and Glacier retrieval times."],
  ["d11c1","S3 Intelligent-Tiering; Glacier Instant / Flexible / Deep Archive."]]}
]},

{id:"d9", day:9, title:"The edge and multi-Region databases", quiz:"tags",
 goal:"Second half of the course: CloudFront, Route 53, Global Accelerator, then Aurora and ElastiCache.",
 groups:[
 {t:"watch", label:"Lecture", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs) → AWS Solutions Architect - Designing a Containerized Architecture", link:"c4", min:210, items:[
  ["c4d","<b>Designing a Containerized Architecture</b> → Operating at the edge: Amazon CloudFront, Amazon Route 53, AWS Global Accelerator, Tech Talk: Choosing an Edge Service"],
  ["c4e","<b>Designing a Containerized Architecture</b> → Designing multi-Region databases: Amazon Aurora, Aurora Design Considerations, Aurora Serverless v2, Amazon Application Recovery Controller (ARC)"],
  ["c4f","<b>Designing a Containerized Architecture</b> → In-Memory Databases, Amazon ElastiCache, Amazon ElastiCache Design Considerations, Putting it all together"]]},
 {t:"play", label:"Labs", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs). Each lab opens a temporary AWS sandbox: nothing runs in your own account.", link:"sa", min:120, items:[
  ["l4b","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/VGQ1MM79FN/aws-simulearn-dns/WF7NRGMMDP\" target=\"_blank\" rel=\"noopener\"><b>DNS</b></a>","About 1 h."],
  ["l4c","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/WGF9DWQVWD/aws-simulearn-content-delivery-networks/1R6ZM9W538\" target=\"_blank\" rel=\"noopener\"><b>Content Delivery Networks</b></a>","About 1 h."]]},
 {t:"check", label:"Self-check", min:20, items:[
  ["d9c3","Route 53 routing: simple, weighted, latency, failover, geolocation, geoproximity, multivalue."],
  ["d10c1","CloudFront vs Global Accelerator."],
  ["d9c4","Aurora Global Database, DynamoDB global tables."],
  ["d3c4","DynamoDB + DAX vs RDS + ElastiCache."]]}
]},

{id:"d10", day:10, title:"Compliant, secure and governed", quiz:"tags",
 goal:"Encryption, WAF and Shield, secrets, and the monitoring and governance services the exam likes to swap.",
 groups:[
 {t:"watch", label:"Lecture", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs) → AWS Solutions Architect - Designing a Compliant, Secure, and Governed Architecture", link:"c5", min:210, items:[
  ["c5a","<b>Designing a Compliant, Secure, and Governed Architecture</b> → Course Overview, Gathering the Customer Requirements, Tech Talk: Multi-Account Strategy: How Much is Too Much?"],
  ["c5b","<b>Designing a Compliant, Secure, and Governed Architecture</b> → Core security tools: Protecting Data In-Transit, Protecting Applications with AWS Shield and WAF, Tech Talk: AWS WAF Implementation Strategies"],
  ["c5c","<b>Designing a Compliant, Secure, and Governed Architecture</b> → Managing Secrets with AWS Secrets Manager, Securing Data with Encryption, Demo: AWS KMS"],
  ["c5d","<b>Designing a Compliant, Secure, and Governed Architecture</b> → Monitoring, auditing and compliance: Cloud Governance Essentials, Security Monitoring Strategies, Logging Strategies"],
  ["c5e","<b>Designing a Compliant, Secure, and Governed Architecture</b> → Putting it all together: Delivering the Proof of Concept, Activity: Designing Secure Multi-Tier Applications with Compliance and Auditability"]]},
 {t:"play", label:"Lab", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs). Each lab opens a temporary AWS sandbox: nothing runs in your own account.", link:"sa", min:60, items:[
  ["l5a","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/3JF3MJXNDY/aws-simulearn-resource-governance/YGB7Y2UD9W\" target=\"_blank\" rel=\"noopener\"><b>Resource Governance</b></a>","About 1 h."]]},
 {t:"check", label:"Self-check", min:20, items:[
  ["d4c2","SCPs in AWS Organizations — what they can and cannot do."],
  ["d4c3","WAF vs Shield vs GuardDuty vs Inspector vs Macie."],
  ["d6c1","CloudWatch vs CloudTrail vs AWS Config."],
  ["d8c3","Encryption at rest (KMS) vs in transit (ACM/TLS); where WAF attaches (ALB, CloudFront, API Gateway)."]]}
]},

{id:"d11", day:11, title:"Hybrid architectures", quiz:"tags",
 goal:"First the last lab of yesterday's course. Then connecting a data center to AWS: storage, endpoints, peering, Transit Gateway, Direct Connect, migration.",
 groups:[
 {t:"play", label:"Lab", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs). Each lab opens a temporary AWS sandbox: nothing runs in your own account.", link:"sa", min:60, items:[
  ["l5b","AWS Builder Lab: <a href=\"https://skillbuilder.aws/learn/83BMEAWGUC/lab--automate-infrastructure-compliance-with-aws-config/X4MXYSFS54\" target=\"_blank\" rel=\"noopener\"><b>Lab - Automate Infrastructure Compliance with AWS Config</b></a>","About 1 h."]]},
 {t:"watch", label:"Lecture", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs) → AWS Solutions Architect - Designing a Hybrid Architecture", link:"c6", min:240, items:[
  ["c6a","<b>Designing a Hybrid Architecture</b> → Course Overview, Gathering the Customer Requirements, Hybrid storage: Data Storage Solutions, Data Transfer Solutions"],
  ["c6b","<b>Designing a Hybrid Architecture</b> → Hybrid networks: VPC Endpoints, VPC Peering"],
  ["c6c","<b>Designing a Hybrid Architecture</b> → Hybrid Networking, AWS Transit Gateway, Tech Talk: AWS Direct Connect Connection Options"],
  ["c6d","<b>Designing a Hybrid Architecture</b> → Planning for the future: Database Migrations, AWS Snowball Edge, AWS Outposts","Snowball Edge is closed to new customers and its support ends on 31 December 2026; the exam guide still lists the Snow Family."],
  ["c6e","<b>Designing a Hybrid Architecture</b> → Managing Multiple Accounts, Managing Cost, Tech Talk: Control vs. Abstraction, Putting it all together"]]},
 {t:"check", label:"Self-check", min:15, items:[
  ["d2c2","VPC peering (non-transitive) vs Transit Gateway."],
  ["d2c3","Gateway endpoint (S3, DynamoDB) vs Interface endpoint (PrivateLink)."],
  ["d11c3","NAT gateway cost vs VPC endpoints; inter-AZ and internet data transfer costs."]]}
]},

{id:"d12", day:12, title:"Hybrid hands-on, Terraform, catch-up", quiz:"review",
 goal:"The two hybrid labs, one build of your own for the portfolio, and room to close anything left open this week.",
 groups:[
 {t:"play", label:"Labs", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs). Each lab opens a temporary AWS sandbox: nothing runs in your own account.", link:"sa", min:120, items:[
  ["l6a","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/46NC4HQFUY/aws-simulearn-connecting-vpcs/J7QJJRTCTG\" target=\"_blank\" rel=\"noopener\"><b>Connecting VPCs</b></a>","Free, about 1 h."],
  ["l6b","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/3SNCS7S5WY/aws-simulearn-securing-hybrid-access/PQH2FMASJA\" target=\"_blank\" rel=\"noopener\"><b>Securing Hybrid Access</b></a>","About 1 h."]]},
 {t:"build", label:"Build with Terraform", where:"③ Your own AWS account, signed in as your admin user (Day 1). Run Terraform from your PC with <code>AWS_PROFILE=lab</code>.", link:"own", min:120, items:[
  ["d8b1","Rebuild the Day 3 VPC in Terraform + an S3 gateway endpoint + SSM interface endpoints. Push to a public GitHub repo.","<code>terraform destroy</code> at the end of the day. If Terraform can't read the <code>lab</code> profile, add a second profile whose only setting is <code>credential_process = aws configure export-credentials --profile lab --format process</code> and use that one."]]}
]},

{id:"d13", day:13, title:"Serverless and messaging", quiz:"tags",
 goal:"Lambda, API Gateway, SQS and SNS: the decoupling answers of Domain 2.",
 groups:[
 {t:"watch", label:"Lecture", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs) → AWS Solutions Architect - Designing a Serverless Architecture with Event-Driven Microservices", link:"c7", min:180, items:[
  ["c7a","<b>Designing a Serverless Architecture with Event-Driven Microservices</b> → Course Overview, Gathering the Customer Requirements, Thinking Serverless, Event-Driven Design"],
  ["c7b","<b>Designing a Serverless Architecture with Event-Driven Microservices</b> → AWS Lambda, Amazon API Gateway, Tech Talk: EC2 vs Serverless vs Containers"],
  ["c7c","<b>Designing a Serverless Architecture with Event-Driven Microservices</b> → Decoupling microservices with AWS messaging services: Amazon SQS, Amazon SNS"]]},
 {t:"play", label:"Labs", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs). Each lab opens a temporary AWS sandbox: nothing runs in your own account.", link:"sa", min:120, items:[
  ["l7a","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/F86F7HCD8V/aws-simulearn-serverless-foundations/S863PYJ1RZ\" target=\"_blank\" rel=\"noopener\"><b>Serverless Foundations</b></a>","About 1 h."],
  ["l7b","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/81797SZV5B/aws-simulearn-decoupling-applications/DWDUZSWM7G\" target=\"_blank\" rel=\"noopener\"><b>Decoupling Applications</b></a>","About 1 h."]]},
 {t:"check", label:"Self-check", min:5, items:[
  ["d9c1","SQS Standard vs FIFO; visibility timeout; dead-letter queue."]]}
]},

{id:"d14", day:14, title:"Secure, orchestrate and observe serverless", quiz:"tags",
 goal:"Second half of the serverless course, then a two-hour event-driven lab.",
 groups:[
 {t:"watch", label:"Lecture", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs) → AWS Solutions Architect - Designing a Serverless Architecture with Event-Driven Microservices", link:"c7", min:180, items:[
  ["c7d","<b>Designing a Serverless Architecture with Event-Driven Microservices</b> → Securing serverless architectures: Serverless Security, Amazon Cognito, Securing API Gateway"],
  ["c7e","<b>Designing a Serverless Architecture with Event-Driven Microservices</b> → AWS Lambda and Application Security, Protecting Data in your Serverless Data Stores, Enable Auditing, Traceability, and Security Automation"],
  ["c7f","<b>Designing a Serverless Architecture with Event-Driven Microservices</b> → Orchestrating workflows: AWS Step Functions, Tech Talk; Observability: Amazon CloudWatch Logs, AWS X-Ray; Putting it all together"]]},
 {t:"play", label:"Lab", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs). Each lab opens a temporary AWS sandbox: nothing runs in your own account.", link:"sa", min:120, items:[
  ["l7c","AWS Builder Lab: <a href=\"https://skillbuilder.aws/learn/CXXNWJTWM8/event-driven-architecture-with-amazon-api-gateway-amazon-eventbridge-and-aws-lambda/JDWKYUVDSE\" target=\"_blank\" rel=\"noopener\"><b>Event Driven Architecture with Amazon API Gateway, Amazon EventBridge and AWS Lambda</b></a>","About 2 h."]]},
 {t:"check", label:"Self-check", min:10, items:[
  ["d8c1","Cognito user pools vs identity pools; IAM Identity Center."],
  ["d10c2","RDS Proxy, read replicas, ElastiCache — when each."]]}
]},

{week: "Week 3 — Data, exam prep and the exam"},

{id:"d15", day:15, title:"Serverless labs and data-driven architectures", quiz:"tags",
 goal:"Two short labs to close serverless, then the last lecture course.",
 groups:[
 {t:"play", label:"Labs", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs). Each lab opens a temporary AWS sandbox: nothing runs in your own account.", link:"sa", min:105, items:[
  ["l7d","AWS Builder Lab: <a href=\"https://skillbuilder.aws/learn/NJH2F3NX87/build-a-serverless-architecture-with-amazon-simple-notification-service-amazon-simple-queue-service-and-aws-lambda/XJMZHYZQT2\" target=\"_blank\" rel=\"noopener\"><b>Build a Serverless Architecture with Amazon Simple Notification Service, Amazon Simple Queue Service, and AWS Lambda</b></a>","About 45 min."],
  ["l7e","AWS Builder Lab: <a href=\"https://skillbuilder.aws/learn/JWY7ZDN2QZ/lab--monitoring-microservice-architectures-with-aws-xray-and-amazon-cloudwatch/3FGKXM5PTR\" target=\"_blank\" rel=\"noopener\"><b>Lab - Monitoring Micro-Service Architectures with AWS X-Ray and Amazon CloudWatch</b></a>","About 1 h."]]},
 {t:"watch", label:"Lecture", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs) → AWS Solutions Architect - Designing a Data-Driven Architecture", link:"c8", min:180, items:[
  ["c8a","<b>Designing a Data-Driven Architecture</b> → Course Overview, Gathering the Customer Requirements, Tech Talk: Data Lake vs Lake House vs Traditional Warehouse, Using the Data Pipeline for Analytics, Streaming Data Services in AWS"],
  ["c8b","<b>Designing a Data-Driven Architecture</b> → Data Lake Storage, AWS Lake Formation, Data Processing with AWS Glue"],
  ["c8c","<b>Designing a Data-Driven Architecture</b> → Analytics and visualization: Query Data with Amazon Athena, Amazon QuickSight, Putting it all together"]]},
 {t:"check", label:"Self-check", min:5, items:[
  ["d6c3","Kinesis Data Streams vs Data Firehose vs SQS."]]}
]},

{id:"d16", day:16, title:"Data labs and the wrap-up", quiz:"review",
 goal:"The last three labs, the plan's summary, and a short read on the in-scope services no lecture covered. From tomorrow it is all exam preparation.",
 groups:[
 {t:"play", label:"Labs", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs). Each lab opens a temporary AWS sandbox: nothing runs in your own account.", link:"sa", min:180, items:[
  ["l8a","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/WT478HCMQE/aws-simulearn-data-ingestion-methods/MMQ3HG3UM1\" target=\"_blank\" rel=\"noopener\"><b>Data Ingestion Methods</b></a>","About 1 h."],
  ["l8b","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/6KZANCJ1Y8/aws-simulearn-data-lakes/12714B1V5G\" target=\"_blank\" rel=\"noopener\"><b>Data Lakes</b></a>","About 1 h."],
  ["l8c","AWS SimuLearn: <a href=\"https://skillbuilder.aws/learn/92XVH8EMU7/aws-simulearn-federated-queries/8T4NUKBGQG\" target=\"_blank\" rel=\"noopener\"><b>Federated Queries</b></a>","About 1 h."]]},
 {t:"watch", label:"Lecture", where:"① Skill Builder → My training → AWS Solutions Architect Learning Plan (Includes Labs) → AWS Solutions Architect - Summary and Resources", link:"c9", min:60, items:[
  ["c9a","<b>AWS Solutions Architect - Summary and Resources</b>","About 1 h: the wrap-up of the learning plan and its reference list."]]},
 {t:"watch", label:"Read: services the courses skip", where:"docs.aws.amazon.com → Overview of Amazon Web Services (whitepaper). One paragraph per service is enough: what it is for.", link:"overview", min:45, items:[
  ["r1a","<a href=\"https://docs.aws.amazon.com/whitepapers/latest/aws-overview/machine-learning.html\" target=\"_blank\" rel=\"noopener\"><b>Machine learning</b></a>: Comprehend, Lex, Polly, Rekognition, SageMaker AI, Textract, Transcribe, Translate.","The exam guide lists them as in scope. Questions ask which service fits a need, never how to train a model."],
  ["r1b","<a href=\"https://docs.aws.amazon.com/whitepapers/latest/aws-overview/management-governance.html\" target=\"_blank\" rel=\"noopener\"><b>Management and governance</b></a>: CloudFormation, Service Catalog, Systems Manager, Trusted Advisor, Compute Optimizer, License Manager, AWS Health Dashboard, Managed Grafana, Managed Service for Prometheus."],
  ["r1c","<a href=\"https://docs.aws.amazon.com/whitepapers/latest/aws-overview/migration-services.html\" target=\"_blank\" rel=\"noopener\"><b>Migration and transfer</b></a>: Application Migration Service, Database Migration Service, DataSync, Transfer Family."],
  ["r1d","<a href=\"https://docs.aws.amazon.com/whitepapers/latest/aws-overview/database.html\" target=\"_blank\" rel=\"noopener\"><b>Databases</b></a> you have not used yet: DocumentDB, Keyspaces, Neptune, MemoryDB. Then <a href=\"https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html\" target=\"_blank\" rel=\"noopener\"><b>Analytics</b></a>: Managed Streaming for Apache Kafka, OpenSearch Service, AWS Data Exchange."]]},
 {t:"check", label:"Self-check", min:5, items:[
  ["d10c3","Athena vs Glue vs EMR vs Redshift; Kinesis family."]]}
]},

{id:"d17", day:17, title:"Exam domains 1 and 2: secure, resilient (30% + 26%)", quiz:"dom:1,2",
 goal:"The Domain Reviews are free. Domain Practice (exam-style questions and flashcards) and the SimuLearn labs need the subscription.",
 groups:[
 {t:"prep", label:"Exam Prep Plan: Domain 1", where:"① Skill Builder → My training → Exam Prep Plan: AWS Certified Solutions Architect - Associate (SAA-C03 - English)", link:"epp", min:135, items:[
  ["d8e1","<b>Domain 1 Review</b> → Domain 1 Introduction"],
  ["d8e2","<b>Domain 1 Review</b> → Design secure access to AWS resources","Task statement 1.1."],
  ["d8e3","<b>Domain 1 Review</b> → Design secure workloads and applications","Task statement 1.2."],
  ["d8e4","<b>Domain 1 Review</b> → Determine appropriate data security controls","Task statement 1.3."],
  ["d8e5","<b>Domain 1 Practice</b>: the exam-style questions","Needs the subscription. Log your % below."],
  ["d8e6","<b>Domain 1 Practice</b>: the flashcards"],
  ["d8e7","<b>Domain 1 Practice: AWS SimuLearn</b>","A one-hour guided lab in a temporary sandbox, not your account. Needs the subscription."]]},
 {t:"prep", label:"Exam Prep Plan: Domain 2", where:"① Skill Builder → My training → Exam Prep Plan: AWS Certified Solutions Architect - Associate (SAA-C03 - English)", link:"epp", min:120, items:[
  ["d9e1","<b>Domain 2 Review</b> → Domain 2 Introduction"],
  ["d9e2","<b>Domain 2 Review</b> → Design scalable and loosely coupled architectures","Task statement 2.1."],
  ["d9e3","<b>Domain 2 Review</b> → Design highly available and/or fault-tolerant architectures","Task statement 2.2."],
  ["d9e4","<b>Domain 2 Practice</b>: the exam-style questions","Needs the subscription. Log your % below."],
  ["d9e5","<b>Domain 2 Practice</b>: the flashcards"],
  ["d9e6","<b>Domain 2 Practice: AWS SimuLearn</b>","A one-hour guided lab in a temporary sandbox, not your account. Needs the subscription."]]},
 {t:"check", label:"Self-check", min:5, items:[
  ["d9c2","DR strategies: backup & restore → pilot light → warm standby → multi-site active/active (RPO/RTO)."]]}
]},

{id:"d18", day:18, title:"Exam domains 3 and 4: high-performing, cost-optimized (24% + 20%)", quiz:"dom:3,4",
 goal:"Largest number of services. Pace yourself.",
 groups:[
 {t:"prep", label:"Exam Prep Plan: Domain 3", where:"① Skill Builder → My training → Exam Prep Plan: AWS Certified Solutions Architect - Associate (SAA-C03 - English)", link:"epp", min:140, items:[
  ["d10e1","<b>Domain 3 Review</b> → Domain 3 Introduction"],
  ["d10e2","<b>Domain 3 Review</b> → Determine high-performing and/or scalable storage solutions","Task statement 3.1."],
  ["d10e3","<b>Domain 3 Review</b> → Design high-performing and elastic compute solutions","Task statement 3.2."],
  ["d10e4","<b>Domain 3 Review</b> → Determine high-performing database solutions","Task statement 3.3."],
  ["d10e5","<b>Domain 3 Review</b> → Determine high-performing and/or scalable network architecture","Task statement 3.4."],
  ["d10e6","<b>Domain 3 Review</b> → Determine high-performing data ingestion and transformation solutions","Task statement 3.5."],
  ["d10e7","<b>Domain 3 Practice</b>: the exam-style questions","Needs the subscription. Log your % below."],
  ["d10e8","<b>Domain 3 Practice</b>: the flashcards"],
  ["d10e9","<b>Domain 3 Practice: AWS SimuLearn</b>","A one-hour guided lab in a temporary sandbox, not your account. Needs the subscription."]]},
 {t:"prep", label:"Exam Prep Plan: Domain 4", where:"① Skill Builder → My training → Exam Prep Plan: AWS Certified Solutions Architect - Associate (SAA-C03 - English)", link:"epp", min:140, items:[
  ["d11e1","<b>Domain 4 Review</b> → Domain 4 Introduction"],
  ["d11e2","<b>Domain 4 Review</b> → Design cost-optimized storage solutions","Task statement 4.1."],
  ["d11e3","<b>Domain 4 Review</b> → Design cost-optimized compute solutions","Task statement 4.2."],
  ["d11e4","<b>Domain 4 Review</b> → Design cost-optimized database solutions","Task statement 4.3."],
  ["d11e5","<b>Domain 4 Review</b> → Design cost-optimized network architectures","Task statement 4.4."],
  ["d11e6","<b>Domain 4 Practice</b>: the exam-style questions and the flashcards","Needs the subscription. Log your % below."],
  ["d11e7","<a href=\"https://skillbuilder.aws/learn/XYVK3NGBWU/domain-4-practice-aws-simulearn--aws-certified-solutions-architect--associate-saac03--english/YA2JFKKM9W\" target=\"_blank\" rel=\"noopener\"><b>Domain 4 Practice: AWS SimuLearn</b></a>","A one-hour guided lab in a temporary sandbox, not your account. Needs the subscription."]]},
 {t:"check", label:"Self-check", min:5, items:[
  ["d11c2","Compute Savings Plans vs EC2 Instance Savings Plans vs Reserved Instances vs Spot."]]}
]},

{id:"d19", day:19, title:"Practice exam and the decision", quiz:"weak", decision:"d11p2", tools:["notebook","weak"],
 goal:"Take the Official Practice Exam, decide, then turn every wrong answer into understanding.",
 notesHint:"Practice exam score, weakest domain, decision…",
 groups:[
 {t:"prep", label:"Checkpoint", where:"① Skill Builder → My training → Exam Prep Plan: AWS Certified Solutions Architect - Associate (SAA-C03 - English)", link:"epp", min:150, items:[
  ["d11p1","<b>Official Practice Exam</b>","65 questions, 130 minutes, scored like the real exam. No notes, in one sitting. Needs the subscription. Enter the scaled score below."],
  ["d11p2","<b>Decision</b> — see the verdict below.","The real exam's pass mark is 720 (scaled)."]]},
 {t:"setup", label:"Book the exam (if GO)", where:"④ aws.training → Certification → AWS Certification Account → Pearson VUE", link:"cert", min:15, items:[
  ["d11b1","<b>Schedule New Exam</b> → AWS Certified Solutions Architect – Associate → <b>Schedule at Pearson VUE</b> → online or test centre → Day 21 → pay.","Reschedule (at most twice per appointment) or cancel free up to 24 h before. After a fail you must wait 14 days to retake."]]},
 {t:"prep", label:"Review", where:"① Skill Builder → My training → Exam Prep Plan: AWS Certified Solutions Architect - Associate (SAA-C03 - English)", link:"epp", min:120, items:[
  ["d12e1","Go through every wrong practice-exam answer: write why each wrong option is wrong."],
  ["d12e2","Re-watch the task statement reviews for your weakest domain (see 📊 Scores)."]]}
]},

{id:"d20", day:20, title:"Weak areas, final pass, logistics", quiz:"exam", tools:["weak"],
 goal:"Consolidate. No new topics.",
 notesHint:"For each wrong answer: why the right one is right, why each wrong one is wrong…",
 groups:[
 {t:"prep", label:"Final pass", where:"① Skill Builder → My training → Exam Prep Plan: AWS Certified Solutions Architect - Associate (SAA-C03 - English)", link:"epp", min:240, items:[
  ["d12e3","Redo the lab for your weakest topic, or rebuild it in ③ your own account."],
  ["d12e4","<b>Domain 1–4 Practice</b>: finish any questions you have left."],
  ["d13e1","All flashcards in the four Domain Practice trainings; re-do the ones you miss."],
  ["d13e2","Re-do the <b>Official Practice Question Set</b> (aim 85%+).","The same 20 questions in a different order. Log the retake below."],
  ["d13e3","Re-read the exam guide task statements; tick only the ones you can explain out loud."],
  ["d13e4","<b>Exam Prep Summary</b>","5 minutes: the last training of the Exam Prep Plan."]]},
 {t:"setup", label:"Logistics", min:30, items:[
  ["d13l1","ID ready, name matching your certification account: one government-issued photo ID for an online exam, two IDs for a test centre.","Test centre: two primary IDs, or one primary and one secondary. If online: run Pearson VUE's system test on the exam computer; clear desk and room; webcam works."],
  ["d13l2","③ Your AWS account: delete everything still running; check Bills and Credits."]]}
]},

{id:"d21", day:21, title:"Exam", tools:["notebook"],
 goal:"65 questions, 130 minutes, pass mark 720.",
 groups:[
 {t:"prep", label:"Exam day", min:200, items:[
  ["d14e1","Max 1 hour of light review: your wrong-answer notes only."],
  ["d14e2","During the exam: eliminate two options first; flag hard questions and move on; return to flags at the end."],
  ["d14e3","After passing: accept the Credly badge; add it to your CV and LinkedIn."]]}
]}
];

// The mock exam unlocks when Days 1 to MOCK_AFTER are complete (the last day of new material).
window.MOCK_AFTER = 16;

// Steps that ask for a result: the 📊 Scores field shown on that step's card (key = data-score in index.html).
window.SCORE_AT = { d7e4: "qs7", d8e5: "b1", d9e4: "b2", d10e7: "b3", d11e6: "b4", d11p1: "pe", d13e2: "qs13" };

// Topics (QTAGS in quiz/meta.js) each step teaches. A day's quiz draws on the topics of its steps,
// and a question sends you back to the steps that teach its topic.
window.STEP_TAGS = {
  c1b: ["Well-Architected"],
  d6c2: ["Well-Architected"],
  d1b1: ["Root user & MFA"],
  d1d1: ["Cost management tools"],
  c1c: ["Regions & AZs","Shared responsibility"],
  c1d: ["VPC & subnets","Internet & NAT gateways","Security groups & NACLs"],
  c1e: ["EC2 instance types","EC2 purchase options","EC2 user data & AMIs","Elastic Beanstalk"],
  c1f: ["EBS & instance store","RDS","DynamoDB","Purpose-built databases"],
  l1a: ["S3 features"],
  l1b: ["High availability design"],
  l1c: ["VPC & subnets","Internet & NAT gateways"],
  l1d: ["EC2 instance types","EC2 user data & AMIs"],
  l1e: ["RDS"],
  d2b1: ["VPC & subnets","Internet & NAT gateways"],
  d2b3: ["Instance access"],
  d2b4: ["Security groups & NACLs"],
  c2a: ["Shared responsibility"],
  c2b: ["Root user & MFA","IAM policies","IAM roles & cross-account"],
  l2a: ["IAM policies"],
  l2b: ["IAM policies","IAM roles & cross-account"],
  d1c1: ["IAM Identity Center & federation"],
  d4b2: ["IAM roles & cross-account"],
  c3a: ["VPC & subnets","Internet & NAT gateways"],
  c3b: ["EC2 instance types","EC2 purchase options"],
  c3c: ["EBS & instance store","EFS","S3 storage classes & lifecycle"],
  c3d: ["CloudWatch","Load balancing"],
  c3e: ["Auto Scaling","High availability design"],
  l3a: ["S3 features"],
  l3b: ["Security groups & NACLs"],
  l3c: ["High availability design","Load balancing","Auto Scaling"],
  c4a: ["Containers"],
  c4b: ["Containers"],
  c4c: ["S3 security","S3 features","S3 storage classes & lifecycle"],
  c4d: ["CloudFront","Route 53","Global Accelerator"],
  c4e: ["Aurora","RDS","Disaster recovery"],
  c4f: ["Caching"],
  l4a: ["Containers"],
  l4d: ["Containers"],
  l4b: ["Route 53"],
  l4c: ["CloudFront"],
  c5a: ["Organizations & SCPs"],
  c5b: ["Encryption in transit","WAF, Shield & Firewall Manager"],
  c5c: ["Secrets Manager & Parameter Store","KMS & encryption"],
  c5d: ["Governance","Threat detection","CloudTrail","AWS Config"],
  l5a: ["Governance","Organizations & SCPs"],
  l5b: ["AWS Config"],
  c6a: ["Storage Gateway","FSx","AWS Backup","Migration & transfer"],
  c6b: ["VPC endpoints & PrivateLink","VPC peering & Transit Gateway"],
  c6c: ["Hybrid connectivity","VPC peering & Transit Gateway"],
  c6d: ["Migration & transfer"],
  c6e: ["Organizations & SCPs","Cost management tools","Data transfer costs"],
  l6a: ["VPC peering & Transit Gateway"],
  l6b: ["Hybrid connectivity"],
  d8b1: ["Infrastructure as code","VPC endpoints & PrivateLink"],
  c7a: ["Lambda","EventBridge"],
  c7b: ["Lambda","API Gateway"],
  c7c: ["SQS","SNS"],
  c7d: ["Cognito","API Gateway"],
  c7e: ["DynamoDB","Lambda"],
  c7f: ["Step Functions","CloudWatch"],
  l7a: ["Lambda"],
  l7b: ["SQS","SNS"],
  l7c: ["EventBridge","API Gateway"],
  l7d: ["SNS","SQS"],
  l7e: ["CloudWatch"],
  c8a: ["Streaming","Analytics"],
  c8b: ["Analytics"],
  c8c: ["Analytics","Redshift"],
  l8a: ["Streaming"],
  l8b: ["Analytics"],
  l8c: ["Analytics"],
  r1a: ["AI/ML services"],
  r1b: ["Infrastructure as code","Governance"],
  r1c: ["Migration & transfer"],
  r1d: ["Purpose-built databases","Streaming","Analytics"]
};

window.CLEANUP = [
  ["EC2 → <b>Instances</b>: nothing running", ""],
  ["VPC → <b>NAT gateways</b>: none in <i>Available</i> state", "Billed per hour even when idle."],
  ["EC2 → <b>Elastic IPs</b>: none allocated", "Public IPv4 addresses are billed while allocated."],
  ["EC2 → <b>Load Balancers</b> and <b>Auto Scaling Groups</b>: none", ""],
  ["RDS → <b>Databases</b>: none", ""],
  ["Terraform: <code>terraform destroy</code> finished for today's code", ""],
  ["Billing and Cost Management → <b>Credits</b> / <b>Bills</b>: nothing unexpected", ""]
];

// One-line definitions shown on hover. Matching is case-insensitive, longest term first.
window.GLOSSARY = {
  "Region": "A geographic area (e.g. eu-west-1, Ireland) containing at least three isolated Availability Zones.",
  "Availability Zone": "One or more data centres inside a Region, isolated from the others. Spread across ≥2 AZs for high availability.",
  "AZ": "Availability Zone — one or more isolated data centres inside a Region.",
  "edge location": "CDN point of presence used by CloudFront and Route 53 — many more of them than Regions.",
  "EC2": "Elastic Compute Cloud — virtual machines (instances).",
  "VPC": "Virtual Private Cloud — your isolated private network inside a Region.",
  "subnet": "A slice of a VPC's IP range inside one AZ. Public = has a route to an internet gateway; private = doesn't.",
  "internet gateway": "Lets a VPC's public subnets reach the internet and be reached from it.",
  "IGW": "Internet gateway — lets public subnets reach the internet.",
  "NAT gateway": "Lets private-subnet instances reach out to the internet without being reachable from it. Billed per hour and per GB processed.",
  "route table": "Rules deciding where traffic leaving a subnet goes (local, internet gateway, NAT, peering…).",
  "security group": "Stateful firewall on an instance. Allow rules only; return traffic is allowed automatically.",
  "NACL": "Network ACL — stateless subnet firewall. Allow and deny rules in number order; return traffic must be allowed explicitly.",
  "Network ACL": "Stateless subnet firewall. Allow and deny rules in number order; return traffic must be allowed explicitly.",
  "Session Manager": "Systems Manager feature: shell access to instances without SSH keys, bastions or open ports.",
  "IAM": "Identity and Access Management — users, groups, roles and the JSON policies that grant permissions.",
  "IAM Identity Center": "Central sign-in (SSO) for people across AWS accounts; hands out short-lived credentials via an access portal.",
  "root user": "The account's original email login. Unlimited power — protect with MFA and don't use it day to day.",
  "MFA": "Multi-factor authentication — a second factor (app code, passkey) on top of the password.",
  "S3": "Simple Storage Service — object storage in buckets; virtually unlimited, 11 nines durability.",
  "EBS": "Elastic Block Store — network disk attached to one EC2 instance, lives in one AZ.",
  "EFS": "Elastic File System — shared NFS file system many Linux instances mount at once, across AZs.",
  "FSx": "Managed third-party file systems: Windows File Server, Lustre (HPC), NetApp ONTAP, OpenZFS.",
  "Glacier": "S3 archive storage classes: cheap storage, retrieval from milliseconds (Instant) to hours (Deep Archive).",
  "RDS": "Relational Database Service — managed MySQL, PostgreSQL, MariaDB, Oracle, SQL Server and Db2.",
  "Multi-AZ": "Synchronous standby in another AZ with automatic failover. For availability, not for scaling reads.",
  "read replica": "Asynchronous copy that serves read traffic. For read scaling; can be promoted to standalone.",
  "Aurora": "AWS's cloud-native MySQL/PostgreSQL-compatible database; storage replicated 6 ways across 3 AZs.",
  "DynamoDB": "Serverless key-value/document NoSQL database with single-digit-millisecond latency.",
  "DAX": "In-memory cache in front of DynamoDB (microsecond reads).",
  "ElastiCache": "Managed in-memory cache (Valkey, Redis OSS or Memcached).",
  "KMS": "Key Management Service — create and control encryption keys; integrated with most services.",
  "SCP": "Service Control Policy — AWS Organizations guardrail limiting what accounts can do. Grants nothing on its own.",
  "ALB": "Application Load Balancer — layer 7 (HTTP/HTTPS), routes by path or host.",
  "NLB": "Network Load Balancer — layer 4 (TCP/UDP/TLS), very high throughput, static IPs.",
  "Gateway Load Balancer": "Inserts third-party virtual appliances (e.g. firewalls) into the traffic path.",
  "Application Load Balancer": "Layer 7 (HTTP/HTTPS) load balancer that routes by path or host.",
  "Auto Scaling": "Keeps a fleet of EC2 instances at the right size; replaces unhealthy ones and scales on metrics.",
  "target group": "The set of targets (instances, IPs, Lambda) a load balancer sends traffic to and health-checks.",
  "launch template": "Saved EC2 launch settings (AMI, instance type, user data) used by Auto Scaling.",
  "user data": "Script that runs on an EC2 instance's first boot.",
  "CloudWatch": "Metrics, logs and alarms — how your resources are performing.",
  "CloudTrail": "Audit log of API calls — who did what, when, from where.",
  "AWS Config": "Records resource configuration over time and checks it against compliance rules.",
  "SNS": "Simple Notification Service — pub/sub push to email, SMS, SQS, Lambda, HTTP.",
  "SQS": "Simple Queue Service — message queue that decouples producers from consumers.",
  "EventBridge": "Event bus and scheduler — routes events from AWS services and apps to targets by rules.",
  "Lambda": "Run functions without managing servers; pay per request and duration; a function runs up to 15 minutes per invocation.",
  "Fargate": "Serverless compute for containers (ECS/EKS) — no EC2 instances to manage.",
  "ECS": "Elastic Container Service — AWS's own container orchestrator.",
  "EKS": "Elastic Kubernetes Service — managed Kubernetes control plane.",
  "CloudFront": "AWS's CDN — caches content at edge locations close to users.",
  "Route 53": "DNS service with health checks and routing policies (weighted, latency, failover…).",
  "Kinesis": "Real-time streaming: Kinesis Data Streams (your own consumers) and Amazon Data Firehose, formerly Kinesis Data Firehose (delivers into S3, Redshift…).",
  "Athena": "Run SQL directly on files in S3; serverless, pay per data scanned.",
  "Glue": "Serverless ETL plus the Data Catalog (table metadata used by Athena and others).",
  "EMR": "Managed Hadoop/Spark clusters for big-data processing.",
  "Redshift": "Data warehouse — columnar SQL analytics over large datasets.",
  "Savings Plans": "$/hour spend commitment for lower rates: 1 or 3 years for compute, 1 year for databases. Compute Savings Plans are the most flexible for compute.",
  "Spot": "Spare EC2 capacity at up to ~90% off; can be reclaimed with a 2-minute warning.",
  "Transit Gateway": "Hub router connecting many VPCs and on-prem networks; transitive, unlike peering.",
  "VPC peering": "Private link between two VPCs. Non-transitive; IP ranges must not overlap.",
  "Gateway endpoint": "Free VPC endpoint for S3 and DynamoDB, added as a route-table entry.",
  "Interface endpoint": "VPC endpoint as a network interface with a private IP (PrivateLink); billed per hour and per GB.",
  "PrivateLink": "Private connectivity to services through interface endpoints, no internet or NAT needed.",
  "WAF": "Web Application Firewall — layer-7 rules (SQL injection, XSS, rate limits) on CloudFront, ALB, API Gateway.",
  "Shield": "DDoS protection. Standard is automatic and free; Advanced is paid and adds a response team.",
  "GuardDuty": "Threat detection from CloudTrail, VPC Flow Logs and DNS logs.",
  "Inspector": "Automated vulnerability scanning of EC2, container images and Lambda.",
  "Macie": "Finds sensitive data (PII) in S3.",
  "Secrets Manager": "Stores secrets with automatic rotation; paid per secret.",
  "Parameter Store": "Systems Manager key/value store; SecureString values encrypted with KMS; standard tier free.",
  "Terraform": "Infrastructure as code: describe resources in HCL; apply creates them, destroy removes them.",
  "API Gateway": "Managed front door for REST/HTTP/WebSocket APIs, often in front of Lambda.",
  "Origin Access Control": "Lets CloudFront read a private S3 bucket while the bucket stays non-public.",
  "Well-Architected": "AWS framework of 6 pillars: operational excellence, security, reliability, performance efficiency, cost optimization, sustainability.",
  "RPO": "Recovery Point Objective — how much data (in time) you can afford to lose.",
  "RTO": "Recovery Time Objective — how long recovery may take.",
  "Elastic IP": "Static public IPv4 address. Billed while allocated.",
  "DataSync": "Online transfer from on-prem storage to S3, EFS or FSx.",
  "Snow Family": "Physical devices (Snowball Edge) for offline bulk data transfer. Closed to new customers since Nov 7, 2025, with support ending Dec 31, 2026; AWS points to DataSync or Data Transfer Terminal.",
  "DMS": "Database Migration Service — migrate or replicate databases with minimal downtime.",
  "Pearson VUE": "The company that delivers AWS exams — online proctored or at a test centre.",
  "Credly": "Site hosting AWS digital badges you can share on LinkedIn.",
  "Global Accelerator": "Routes users over the AWS backbone via 2 static anycast IPs; for non-HTTP or fast failover.",
  "RDS Proxy": "Connection pool in front of RDS/Aurora; helps Lambda-heavy apps and speeds failover.",
  "Cognito": "User sign-up/sign-in for apps (user pools) and temporary AWS credentials for them (identity pools)."
};
