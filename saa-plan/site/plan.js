// Plan data. Edit freely: ids must stay unique (they key your saved progress).
// Each item is one step, shown alone on its own card: [id, text, note].
// Group fields: t = type, label, where, link (key in LINKS or "own"), min = estimated minutes for the whole block.
// Optional day fields: tools = extra buttons ("notebook", "weak"), decision = id of the step that shows the go/no-go verdict, notesHint.

window.LINKS = {
  sb:      { label: "Skill Builder",      url: "https://skillbuilder.aws/" },
  ess:     { label: "Essentials",         url: "https://skillbuilder.aws/learn/94T2BEN85A/aws-cloud-practitioner-essentials/8D79F3AVR7" },
  cq:      { label: "Cloud Quest",        url: "https://skillbuilder.aws/learn/FU5WCYVGKY/aws-cloud-quest-cloud-practitioner/JF9TKU68GT" },
  console: { label: "AWS Console",        url: "https://console.aws.amazon.com/" },
  calc:    { label: "Pricing Calculator", url: "https://calculator.aws/" },
  cert:    { label: "aws.training",       url: "https://aws.training/" },
  signup:  { label: "aws.amazon.com",     url: "https://aws.amazon.com/", hidden: true },
  credly:  { label: "Credly",             url: "https://www.credly.com/", hidden: true },
  idc:     { label: "Identity Center docs", url: "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html", hidden: true }
};

const SB  = "① Skill Builder → My training → AWS Cloud Practitioner Essentials";
const CQ  = "① Skill Builder → My training → AWS Cloud Quest: Cloud Practitioner → Launch. Labs run in ② the temporary sandbox — free.";
const OWN = "③ Your own AWS account, signed in as your admin user (Day 1).";
const EPP = "① Skill Builder → My training → Exam Prep Plan: AWS Certified Solutions Architect - Associate (SAA-C03 - English)";

window.PLAN = [
{week: "Week 1 — Foundation: Essentials + Cloud Quest"},

{id:"d1", day:1, title:"Create your AWS account + compute basics",
 goal:"Morning: set up ③ your own AWS account safely (~1 h). Rest of the day: videos + first Cloud Quest assignments.",
 groups:[
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
 {t:"watch", label:"Read: IAM Identity Center", where:"docs.aws.amazon.com → IAM Identity Center User Guide. Reading only: do not enable it in your account.", link:"idc", min:25, items:[
  ["d1c1","<b>What is IAM Identity Center?</b> One sign-in at the access portal for every AWS account and application a person is assigned.","How companies give people access to AWS, and on the exam. Don't enable it here: that creates an AWS Organization, which moves a Free plan account to pay-as-you-go."],
  ["d1c3","<b>Permission sets</b>: a template of IAM policies, such as AdministratorAccess, that becomes a role in every account it is assigned to."],
  ["d1c4","<b>Assignments</b>: a user or group, an AWS account and a permission set. Access exists only for that combination."],
  ["d1c5","<b>AWS access portal</b>: people sign in at one URL, pick an account and a role, and get temporary credentials for the console and the CLI.","Compare with what you just built: your IAM user has a long-lived password and belongs to one account."]]},
 {t:"setup", label:"Setup: protect your wallet", where:"console.aws.amazon.com → search bar → \"Budgets\"", link:"console", min:10, items:[
  ["d1d1","<b>Create budget</b> → <b>Use a template</b> → <b>Zero spend budget</b> → your email.","Emails you once anything costs money beyond credits. Budget data refreshes a few times a day, so alerts can lag by hours."],
  ["d1d2","Search <b>Billing and Cost Management</b> → <b>Credits</b>: note your credit balance and expiry.","Check this page every few days."]]},
 {t:"watch", label:"Watch", where:SB, link:"ess", min:140, items:[
  ["d1w1","<b>Module 1: Introduction to the Cloud</b>"],
  ["d1w2","<b>Module 2: Compute in the Cloud</b>","EC2 instance types, purchase options, scaling basics."],
  ["d1w3","<b>Module 3: Exploring Compute Services</b>","Lambda, ECS, EKS, Fargate, Elastic Beanstalk."],
  ["d1w4","<b>Module 4: Going Global</b>","Regions, Availability Zones, edge locations, CloudFront."]]},
 {t:"play", label:"Play", where:CQ, link:"cq", min:120, items:[
  ["d1p1","<b>Cloud Computing Essentials</b>","S3 static website."],
  ["d1p2","<b>Cloud First Steps</b>","EC2 instances in two Availability Zones."],
  ["d1p3","<b>Computing Solutions</b>","EC2 instance types, resizing, user data."]]},
 {t:"check", label:"Self-check: can you explain…", min:15, items:[
  ["d1c6","Region vs Availability Zone vs edge location."],
  ["d1c7","EC2 purchase options: On-Demand, Savings Plans, Reserved, Spot, Dedicated."],
  ["d1c8","When to pick EC2 vs Lambda vs ECS on Fargate."]]}
]},

{id:"d2", day:2, title:"Networking (VPC)",
 goal:"The most-tested area. Learn in Cloud Quest, then build it yourself.",
 groups:[
 {t:"watch", label:"Watch", where:SB, link:"ess", min:40, items:[
  ["d2w1","<b>Module 5: Networking</b>","VPC, subnets, internet gateway, NAT, security groups vs NACLs, Route 53, Direct Connect, VPN."]]},
 {t:"play", label:"Play", where:CQ, link:"cq", min:100, items:[
  ["d2p1","<b>Networking Concepts</b>","VPC, subnets, internet gateway, route tables."],
  ["d2p2","<b>Connecting VPCs</b>","VPC peering."]]},
 {t:"build", label:"Build", where:OWN+" Search bar → \"VPC\".", link:"own", min:150, items:[
  ["d2b1","<b>Create VPC</b> → <b>VPC and more</b> → 2 AZs, 2 public + 2 private subnets, NAT gateway <b>In 1 AZ</b>.","Then open each created item (subnets, route tables, IGW, NAT) and understand why it exists."],
  ["d2b2","Launch an EC2 instance (t3.micro, Amazon Linux) into a <b>private</b> subnet, no public IP, no key pair.","Advanced details → IAM instance profile: create a role with <code>AmazonSSMManagedInstanceCore</code>."],
  ["d2b3","Connect: EC2 → select instance → <b>Connect</b> → <b>Session Manager</b>.","Works with no SSH and no public IP, because the instance reaches AWS through the NAT gateway."],
  ["d2b4","Break it on purpose: in the private subnet's <b>Network ACL</b>, remove the outbound rule and watch Session Manager fail. Restore it.","Security groups remember connections (stateful); NACLs don't (stateless)."],
  ["d2b5","<b>Clean up:</b> terminate the instance → delete the NAT gateway → release the Elastic IP → delete the VPC.","The NAT gateway costs money every hour it exists."]]},
 {t:"check", label:"Self-check", min:15, items:[
  ["d2c1","Security group vs NACL."],
  ["d2c2","VPC peering (non-transitive) vs Transit Gateway."],
  ["d2c3","Gateway endpoint (S3, DynamoDB) vs Interface endpoint (PrivateLink)."]]}
]},

{id:"d3", day:3, title:"Storage + databases",
 goal:"Know which storage and database fits which scenario.",
 groups:[
 {t:"watch", label:"Watch", where:SB, link:"ess", min:70, items:[
  ["d3w1","<b>Module 6: Storage</b>","S3 and storage classes, EBS, EFS, FSx, Storage Gateway."],
  ["d3w2","<b>Module 7: Databases</b>","RDS, Aurora, DynamoDB, ElastiCache, Redshift."]]},
 {t:"play", label:"Play", where:CQ, link:"cq", min:135, items:[
  ["d3p1","<b>Databases in Practice</b>","RDS Multi-AZ, read replicas, backups."],
  ["d3p2","<b>First NoSQL Database</b>","DynamoDB."],
  ["d3p3","<b>File Systems in the Cloud</b>","EFS shared across EC2 instances."]]},
 {t:"build", label:"Build", where:OWN, link:"own", min:60, items:[
  ["d3b1","Search \"S3\" → <b>Create bucket</b> → enable <b>Versioning</b>, keep <b>Block all public access</b> on.","Bucket names are globally unique — add something personal."],
  ["d3b2","Bucket → <b>Management</b> → <b>Create lifecycle rule</b>: Standard → Standard-IA after 30 days → Glacier Flexible Retrieval after 90."],
  ["d3b3","Search \"DynamoDB\" → <b>Create table</b> (on-demand capacity). Add a few items; compare <b>Query</b> vs <b>Scan</b>.","Delete the table afterwards."]]},
 {t:"check", label:"Self-check", min:20, items:[
  ["d3c1","EBS (gp3/io2/st1/sc1) vs EFS vs FSx vs S3 — when each."],
  ["d3c2","RDS Multi-AZ (availability) vs read replica (read scaling)."],
  ["d3c3","S3 storage classes and Glacier retrieval times."],
  ["d3c4","DynamoDB + DAX vs RDS + ElastiCache."]]}
]},

{id:"d4", day:4, title:"Security + IAM",
 goal:"Domain 1 is 30% of the exam. IAM must become second nature.",
 groups:[
 {t:"watch", label:"Watch", where:SB, link:"ess", min:40, items:[
  ["d4w1","<b>Module 9: Security</b>","Shared responsibility, IAM, Organizations and SCPs, KMS, WAF, Shield, GuardDuty, Inspector."]]},
 {t:"play", label:"Play", where:CQ, link:"cq", min:50, items:[
  ["d4p1","<b>Core Security Concepts</b>","IAM users, groups, roles; least privilege for EC2 and RDS."]]},
 {t:"setup", label:"Setup: AWS CLI on your PC", where:"Your terminal", min:20, items:[
  ["d4s1","Install AWS CLI v2 (distro package or the official installer).","Check with <code>aws --version</code>: <code>aws login</code> needs 2.32.0 or newer."],
  ["d4s2","<code>aws login --profile lab</code> → Region <code>eu-west-1</code> → sign in as your admin user in the browser window that opens.","No long-term access keys on disk: the CLI gets temporary credentials from your console sign-in and refreshes them for up to 12 hours. A company on IAM Identity Center uses <code>aws configure sso</code> instead."],
  ["d4s3","Test: <code>aws sts get-caller-identity --profile lab</code>"]]},
 {t:"build", label:"Build", where:OWN+" Search bar → \"IAM\" (classic IAM, not Identity Center).", link:"own", min:150, items:[
  ["d4b1","<b>Policies</b> → <b>Create policy</b> (JSON): allow <code>s3:GetObject</code> only on your Day 3 bucket.","Read the JSON line by line: Effect, Action, Resource."],
  ["d4b2","<b>Roles</b> → <b>Create role</b> → trusted entity <b>EC2</b> → attach your policy. Launch an instance with this role and read from the bucket with no access keys.","This is how apps on AWS get permissions."],
  ["d4b3","Create a second role trusted by your own account; assume it from your PC: <code>aws sts assume-role --role-arn &lt;arn&gt; --role-session-name test --profile lab</code>.","The trust policy decides who may assume the role."],
  ["d4b4","Search \"KMS\" → create a customer managed key → set it as default encryption on your Day 3 bucket.","Read the key policy."],
  ["d4b5","Compare: a secret in <b>Secrets Manager</b> vs a SecureString in <b>Systems Manager → Parameter Store</b>.","Note rotation and price. Delete the secret afterwards."],
  ["d4b6","<b>Clean up</b> the instance."]]},
 {t:"check", label:"Self-check", min:20, items:[
  ["d4c1","Identity-based vs resource-based policies; an explicit deny always wins."],
  ["d4c2","SCPs in AWS Organizations — what they can and cannot do."],
  ["d4c3","WAF vs Shield vs GuardDuty vs Inspector vs Macie."]]}
]},

{id:"d5", day:5, title:"High availability + scaling",
 goal:"Load balancer + Auto Scaling across AZs — the core resilient pattern.",
 groups:[
 {t:"play", label:"Play", where:CQ, link:"cq", min:120, items:[
  ["d5p1","<b>Auto-healing and Scaling Applications</b>","EC2 Auto Scaling."],
  ["d5p2","<b>Highly Available Web Applications</b>","Load balancer + Auto Scaling across AZs."]]},
 {t:"build", label:"Build", where:OWN+" Search bar → \"EC2\" (left menu: Launch Templates, Auto Scaling Groups, Load Balancers).", link:"own", min:150, items:[
  ["d5b1","Create a VPC again with <b>VPC and more</b> (2 AZs, public subnets, <b>no</b> NAT)."],
  ["d5b2","<b>Launch Templates</b> → create one: t3.micro, Amazon Linux, user data that installs and starts a web server.","A Go binary that prints the instance ID is a nice touch."],
  ["d5b3","<b>Load Balancers</b> → <b>Application Load Balancer</b> across both public subnets + a target group with health checks."],
  ["d5b4","<b>Auto Scaling Groups</b> → create from your template, both AZs, attach the target group, min 2 / max 4, target tracking 50% CPU."],
  ["d5b5","Open the ALB's DNS name in your browser. Terminate one instance and watch the group replace it."],
  ["d5b6","<b>Clean up:</b> delete the Auto Scaling group → load balancer → target group → VPC."]]},
 {t:"check", label:"Self-check", min:20, items:[
  ["d5c1","ALB vs NLB vs Gateway Load Balancer."],
  ["d5c2","Scaling policies: target tracking, step, scheduled, predictive."],
  ["d5c3","EC2 vs ELB health checks in an Auto Scaling group."]]}
]},

{id:"d6", day:6, title:"Monitoring, governance, cost, Well-Architected",
 goal:"The remaining Essentials modules that matter for SAA.",
 groups:[
 {t:"watch", label:"Watch", where:SB, link:"ess", min:120, items:[
  ["d6w1","<b>Module 8: AI/ML and Data Analytics</b> — data analytics lessons only","Kinesis, Athena, Glue, EMR, Redshift. Skip the AI/ML part."],
  ["d6w2","<b>Module 10: Monitoring, Compliance, and Governance in the AWS Cloud</b>","CloudWatch, CloudTrail, Config, Trusted Advisor, Control Tower."],
  ["d6w3","<b>Module 11: Pricing and Support</b> — pricing lessons only","Skip support plans."],
  ["d6w4","<b>Module 12: Migrating to the AWS Cloud</b> — only DataSync, Snow Family, DMS","Skip the rest."],
  ["d6w5","<b>Module 13: Well-Architected Solutions</b>","Don't skip — SAA uses the pillars."],
  ["d6w6","Skip the course's final assessment.","It tests Cloud Practitioner, not SAA. Mark it complete to confirm you skipped it."]]},
 {t:"play", label:"Play", where:CQ, link:"cq", min:40, items:[
  ["d6p1","<b>Cloud Economics</b>","AWS Pricing Calculator."]]},
 {t:"build", label:"Build", where:OWN, link:"own", min:60, items:[
  ["d6b1","Search \"SNS\" → create a topic → subscribe your email → confirm the email."],
  ["d6b2","Launch a t3.micro → search \"CloudWatch\" → <b>Alarms</b> → <b>Create alarm</b> on its CPUUtilization → notify your SNS topic.","Terminate the instance afterwards."],
  ["d6b3","Search \"CloudTrail\" → switch the Region selector to <b>US East (N. Virginia)</b> → <b>Event history</b>: find the IAM actions you did on Day 4.","IAM is a global service, so its events are recorded in us-east-1, not eu-west-1. Switch back to Ireland afterwards. CloudTrail = who did what. CloudWatch = how things are performing."],
  ["d6b4","Open <b>calculator.aws</b> (no login): estimate the Day 5 setup (ALB + 2 × t3.micro, 730 h/month)."]]},
 {t:"check", label:"Self-check", min:20, items:[
  ["d6c1","CloudWatch vs CloudTrail vs AWS Config."],
  ["d6c2","The six Well-Architected pillars."],
  ["d6c3","Kinesis Data Streams vs Data Firehose vs SQS."]]}
]},

{id:"d7", day:7, title:"Baseline + catch-up",
 goal:"First contact with real exam-style questions. A low score is expected and fine. Log it in 📊 Scores.",
 notesHint:"Your 3 weakest topics from the question set…",
 groups:[
 {t:"prep", label:"Exam Prep Plan, step 1 (free)", where:EPP, link:"sb", min:120, items:[
  ["d7e1","<b>Introduction to AWS Certified Solutions Architect – Associate (SAA-C03)</b>"],
  ["d7e2","<b>Overview: AWS Certified Solutions Architect – Associate (SAA-C03)</b>"],
  ["d7e3","<b>Exam guide: AWS Certified Solutions Architect – Associate (SAA-C03)</b>","Read it fully, including the list of in-scope services."],
  ["d7e4","<b>AWS Certified Solutions Architect - Associate Official Practice Question Set (SAA-C03 - English)</b>","20 questions. Read every explanation, right or wrong. Enter your score below."],
  ["d7e5","<b>AWS Certified Solutions Architect - Associate Sample Questions (SAA-C03 - English)</b>"],
  ["d7e6","Write down your 3 weakest topics in 📝 Day notes."]]},
 {t:"setup", label:"Housekeeping", min:60, items:[
  ["d7h1","Finish any unfinished Cloud Quest assignment. Completing all issues the <b>Cloud Quest: Cloud Practitioner</b> badge — accept it on <b>credly.com</b> (you'll get an email).","Free extra line for your CV and LinkedIn."],
  ["d7h2","In ③ your AWS account: <b>Billing and Cost Management</b> → <b>Bills</b> and <b>Credits</b> — confirm nothing unexpected is running.","Also check EC2, VPC (NAT gateways) and RDS in eu-west-1."],
  ["d7h3","Go to <b>aws.training</b> → <b>Certification</b> → AWS Certification Account → <b>Schedule New Exam</b> → SAA-C03 → <b>Schedule at Pearson VUE</b>. Look at dates around Day 14, then close without paying.","Online from home or at a test centre. Just checking availability today."]]}
]},

{week: "Week 2 — Exam Prep Plan, one domain per day"},

{id:"d8", day:8, title:"Domain 1: Design Secure Architectures (30%)",
 goal:"Week 2 needs the subscription: bonus questions, flashcards, labs and the Official Practice Exam are paid content.",
 groups:[
 {t:"setup", label:"Setup", where:"① Skill Builder → top menu → Subscriptions", link:"sb", min:10, items:[
  ["d8s1","<b>Buy one month</b> of the Individual subscription.","Turn off auto-renew right after buying so it doesn't roll into a second month."]]},
 {t:"prep", label:"Exam Prep Plan", where:EPP, link:"sb", min:300, items:[
  ["d8e1","<b>Domain 1 introduction</b>"],
  ["d8e2","<b>Task 1.1: Design secure access to AWS resources</b> — review + walkthrough questions"],
  ["d8e3","<b>Task 1.2: Design secure workloads and applications</b> — review + walkthrough questions"],
  ["d8e4","<b>Task 1.3: Determine appropriate data security controls</b> — review + walkthrough questions"],
  ["d8e5","Domain 1 bonus questions","Log your % below."],
  ["d8e6","Domain 1 flashcards"],
  ["d8e7","Domain 1 lab(s)","These labs also run in a temporary sandbox, not your account."]]},
 {t:"build", label:"Build with Terraform", where:OWN+" Run Terraform from your PC with <code>AWS_PROFILE=lab</code>.", link:"own", min:120, items:[
  ["d8b1","Rebuild the Day 2 VPC in Terraform + an S3 gateway endpoint + SSM interface endpoints. Push to a public GitHub repo.","<code>terraform destroy</code> at the end of the day. If Terraform can't read the <code>lab</code> profile, add a second profile whose only setting is <code>credential_process = aws configure export-credentials --profile lab --format process</code> and use that one."]]},
 {t:"check", label:"Self-check", min:20, items:[
  ["d8c1","Cognito user pools vs identity pools; IAM Identity Center."],
  ["d8c2","Cross-account access: role trust policy, external ID."],
  ["d8c3","Encryption at rest (KMS) vs in transit (ACM/TLS); where WAF attaches (ALB, CloudFront, API Gateway)."]]}
]},

{id:"d9", day:9, title:"Domain 2: Design Resilient Architectures (26%)",
 goal:"Decoupling and disaster recovery.",
 groups:[
 {t:"prep", label:"Exam Prep Plan", where:EPP, link:"sb", min:240, items:[
  ["d9e1","<b>Domain 2 introduction</b>"],
  ["d9e2","<b>Task 2.1: Design scalable and loosely coupled architectures</b> — review + walkthrough questions"],
  ["d9e3","<b>Task 2.2: Design highly available and/or fault-tolerant architectures</b> — review + walkthrough questions"],
  ["d9e4","Domain 2 bonus questions","Log your % below."],
  ["d9e5","Domain 2 flashcards"],
  ["d9e6","Domain 2 lab(s)"]]},
 {t:"build", label:"Build with Terraform", where:OWN, link:"own", min:150, items:[
  ["d9b1","SQS queue + dead-letter queue → Lambda consumer written in Go (<code>provided.al2023</code> runtime)."],
  ["d9b2","SNS topic fanning out to two SQS queues."],
  ["d9b3","EventBridge scheduled rule triggering the Lambda. <code>terraform destroy</code> when done."]]},
 {t:"check", label:"Self-check", min:20, items:[
  ["d9c1","SQS Standard vs FIFO; visibility timeout; dead-letter queue."],
  ["d9c2","DR strategies: backup & restore → pilot light → warm standby → multi-site active/active (RPO/RTO)."],
  ["d9c3","Route 53 routing: simple, weighted, latency, failover, geolocation, geoproximity, multivalue."],
  ["d9c4","Aurora Global Database, DynamoDB global tables."]]}
]},

{id:"d10", day:10, title:"Domain 3: Design High-Performing Architectures (24%)",
 goal:"Largest number of services — pace yourself.",
 groups:[
 {t:"prep", label:"Exam Prep Plan", where:EPP, link:"sb", min:330, items:[
  ["d10e1","<b>Domain 3 introduction</b>"],
  ["d10e2","<b>Task 3.1: Determine high-performing and/or scalable storage solutions</b>"],
  ["d10e3","<b>Task 3.2: Design high-performing and elastic compute solutions</b>"],
  ["d10e4","<b>Task 3.3: Determine high-performing database solutions</b>"],
  ["d10e5","<b>Task 3.4: Determine high-performing and/or scalable network architectures</b>"],
  ["d10e6","<b>Task 3.5: Determine high-performing data ingestion and transformation solutions</b>"],
  ["d10e7","Domain 3 bonus questions","Log your % below."],
  ["d10e8","Domain 3 flashcards"],
  ["d10e9","Domain 3 lab(s)"]]},
 {t:"build", label:"Build with Terraform", where:OWN, link:"own", min:120, items:[
  ["d10b1","Private S3 bucket served through CloudFront with Origin Access Control."],
  ["d10b2","API Gateway → Lambda (Go) → DynamoDB minimal API. <code>terraform destroy</code> when done."]]},
 {t:"check", label:"Self-check", min:20, items:[
  ["d10c1","CloudFront vs Global Accelerator."],
  ["d10c2","RDS Proxy, read replicas, ElastiCache — when each."],
  ["d10c3","Athena vs Glue vs EMR vs Redshift; Kinesis family."]]}
]},

{id:"d11", day:11, title:"Domain 4: Design Cost-Optimized Architectures (20%) + checkpoint",
 goal:"Finish the domains, then take the Official Practice Exam and decide.",
 decision:"d11p2",
 notesHint:"Practice exam score, weakest domain, decision…",
 groups:[
 {t:"prep", label:"Exam Prep Plan", where:EPP, link:"sb", min:200, items:[
  ["d11e1","<b>Domain 4 introduction</b>"],
  ["d11e2","<b>Task 4.1: Design cost-optimized storage solutions</b>"],
  ["d11e3","<b>Task 4.2: Design cost-optimized compute solutions</b>"],
  ["d11e4","<b>Task 4.3: Design cost-optimized database solutions</b>"],
  ["d11e5","<b>Task 4.4: Design cost-optimized network architectures</b>"],
  ["d11e6","Domain 4 bonus questions + flashcards","Log your % below."]]},
 {t:"prep", label:"Checkpoint", where:EPP, link:"sb", min:150, items:[
  ["d11p1","<b>AWS Certified Solutions Architect – Associate Official Practice Exam (SAA-C03 - English)</b>","Timed, 130 minutes, no notes, in one sitting. Enter the scaled score below."],
  ["d11p2","<b>Decision</b> — see the verdict below.","The real exam's pass mark is 720 (scaled)."]]},
 {t:"setup", label:"Book the exam (if GO)", where:"④ aws.training → Certification → AWS Certification Account → Pearson VUE", link:"cert", min:15, items:[
  ["d11b1","<b>Schedule New Exam</b> → AWS Certified Solutions Architect – Associate → <b>Schedule at Pearson VUE</b> → online or test centre → Day 14 → pay.","Reschedule (at most twice per appointment) or cancel free up to 24 h before. After a fail you must wait 14 days to retake."]]},
 {t:"check", label:"Self-check", min:15, items:[
  ["d11c1","S3 Intelligent-Tiering; Glacier Instant / Flexible / Deep Archive."],
  ["d11c2","Compute Savings Plans vs EC2 Instance Savings Plans vs Reserved Instances vs Spot."],
  ["d11c3","NAT gateway cost vs VPC endpoints; inter-AZ and internet data transfer costs."]]}
]},

{id:"d12", day:12, title:"Weak areas", tools:["notebook","weak"],
 goal:"Turn wrong answers into understanding.",
 notesHint:"For each wrong answer: why the right one is right, why each wrong one is wrong…",
 groups:[
 {t:"prep", label:"Review", where:EPP, link:"sb", min:360, items:[
  ["d12e1","Go through every wrong practice-exam answer: write why each wrong option is wrong."],
  ["d12e2","Re-watch the task statement reviews for your weakest domain (see 📊 Scores)."],
  ["d12e3","Rebuild your weakest topic in ③ your own account."],
  ["d12e4","<b>AWS Certified Solutions Architect – Associate Bonus Questions (SAA-C03)</b> — finish any remaining."]]}
]},

{id:"d13", day:13, title:"Final pass + logistics", tools:["weak"],
 goal:"Consolidate. No new topics.",
 groups:[
 {t:"prep", label:"Final pass", where:EPP, link:"sb", min:240, items:[
  ["d13e1","Full flashcard deck; re-do the ones you miss."],
  ["d13e2","Re-do the Official Practice Question Set + Sample Questions (aim 85%+).","Log the retake below."],
  ["d13e3","Re-read the exam guide task statements; tick only the ones you can explain out loud."]]},
 {t:"setup", label:"Logistics", min:30, items:[
  ["d13l1","ID ready, name matching your certification account: one government-issued photo ID for an online exam, two IDs for a test centre.","Test centre: two primary IDs, or one primary and one secondary. If online: run Pearson VUE's system test on the exam computer; clear desk and room; webcam works."],
  ["d13l2","③ Your AWS account: delete everything still running; check Bills and Credits."]]}
]},

{id:"d14", day:14, title:"Exam", tools:["notebook"],
 goal:"65 questions, 130 minutes, pass mark 720.",
 groups:[
 {t:"prep", label:"Exam day", min:200, items:[
  ["d14e1","Max 1 hour of light review: your wrong-answer notes only."],
  ["d14e2","During the exam: eliminate two options first; flag hard questions and move on; return to flags at the end."],
  ["d14e3","After passing: accept the Credly badge; add it to your CV and LinkedIn."]]}
]}
];

// Steps that ask for a result: the 📊 Scores field shown on that step's card (key = data-score in index.html).
window.SCORE_AT = { d7e4: "qs7", d8e5: "b1", d9e4: "b2", d10e7: "b3", d11e6: "b4", d11p1: "pe", d13e2: "qs13" };

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
  "Region": "A geographic area (e.g. eu-west-1, Ireland) containing several isolated Availability Zones.",
  "Availability Zone": "One or more data centres inside a Region, isolated from the others. Spread across ≥2 AZs for high availability.",
  "AZ": "Availability Zone — one or more isolated data centres inside a Region.",
  "edge location": "CDN point of presence used by CloudFront and Route 53 — many more of them than Regions.",
  "EC2": "Elastic Compute Cloud — virtual machines (instances).",
  "VPC": "Virtual Private Cloud — your isolated private network inside a Region.",
  "subnet": "A slice of a VPC's IP range inside one AZ. Public = has a route to an internet gateway; private = doesn't.",
  "internet gateway": "Lets a VPC's public subnets reach the internet and be reached from it.",
  "IGW": "Internet gateway — lets public subnets reach the internet.",
  "NAT gateway": "Lets private-subnet instances reach out to the internet without being reachable from it. Billed per hour.",
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
  "RDS": "Relational Database Service — managed MySQL, PostgreSQL, MariaDB, Oracle, SQL Server.",
  "Multi-AZ": "Synchronous standby in another AZ with automatic failover. For availability, not for scaling reads.",
  "read replica": "Asynchronous copy that serves read traffic. For read scaling; can be promoted to standalone.",
  "Aurora": "AWS's cloud-native MySQL/PostgreSQL-compatible database; storage replicated 6 ways across 3 AZs.",
  "DynamoDB": "Serverless key-value/document NoSQL database with single-digit-millisecond latency.",
  "DAX": "In-memory cache in front of DynamoDB (microsecond reads).",
  "ElastiCache": "Managed in-memory cache (Redis/Valkey or Memcached).",
  "KMS": "Key Management Service — create and control encryption keys; integrated with most services.",
  "SCP": "Service Control Policy — AWS Organizations guardrail limiting what accounts can do. Grants nothing on its own.",
  "ALB": "Application Load Balancer — layer 7 (HTTP/HTTPS), routes by path or host.",
  "NLB": "Network Load Balancer — layer 4 (TCP/UDP), very high throughput, static IPs.",
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
  "Lambda": "Run functions without managing servers; pay per request and duration; max 15 min per run.",
  "Fargate": "Serverless compute for containers (ECS/EKS) — no EC2 instances to manage.",
  "ECS": "Elastic Container Service — AWS's own container orchestrator.",
  "EKS": "Elastic Kubernetes Service — managed Kubernetes control plane.",
  "CloudFront": "AWS's CDN — caches content at edge locations close to users.",
  "Route 53": "DNS service with health checks and routing policies (weighted, latency, failover…).",
  "Kinesis": "Real-time streaming: Data Streams (your own consumers), Data Firehose (delivers into S3, Redshift…).",
  "Athena": "Run SQL directly on files in S3; serverless, pay per data scanned.",
  "Glue": "Serverless ETL plus the Data Catalog (table metadata used by Athena and others).",
  "EMR": "Managed Hadoop/Spark clusters for big-data processing.",
  "Redshift": "Data warehouse — columnar SQL analytics over large datasets.",
  "Savings Plans": "1- or 3-year $/hour spend commitment for cheaper compute. Compute Savings Plans are the most flexible.",
  "Spot": "Spare EC2 capacity at up to ~90% off; can be reclaimed with a 2-minute warning.",
  "Transit Gateway": "Hub router connecting many VPCs and on-prem networks; transitive, unlike peering.",
  "VPC peering": "Private link between two VPCs. Non-transitive; IP ranges must not overlap.",
  "Gateway endpoint": "Free VPC endpoint for S3 and DynamoDB, added as a route-table entry.",
  "Interface endpoint": "VPC endpoint as a network interface with a private IP (PrivateLink); billed per hour.",
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
  "Snow Family": "Physical devices (Snowball) for offline bulk data transfer.",
  "DMS": "Database Migration Service — migrate or replicate databases with minimal downtime.",
  "Pearson VUE": "The company that delivers AWS exams — online proctored or at a test centre.",
  "Credly": "Site hosting AWS digital badges you can share on LinkedIn.",
  "Global Accelerator": "Routes users over the AWS backbone via 2 static anycast IPs; for non-HTTP or fast failover.",
  "RDS Proxy": "Connection pool in front of RDS/Aurora; helps Lambda-heavy apps and speeds failover.",
  "Cognito": "User sign-up/sign-in for apps (user pools) and temporary AWS credentials for them (identity pools)."
};
