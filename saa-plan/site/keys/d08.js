// Key points for the plan steps whose id starts with d8 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d8s1: {
    head: "Buy one month of the Skill Builder subscription",
    why: "Later in the plan you open the next lab, and Skill Builder will not start it without a subscription. The same goes for the Domain Practice and the Official Practice Exam later on. And a subscription keeps charging after you stop using it. You need the access for the weeks of study, and a clear end to the charge.",
    idea: "The Individual subscription opens the paid trainings: 27 of the 36 in the Solutions Architect plan, Domain Practice and the Official Practice Exam. You pay for it through your AWS account.",
    do: [
      "Skill Builder → top menu → <b>Subscriptions</b> → buy <b>one month</b> of the Individual subscription. It is billed to ③ your AWS account, on its Paid plan.",
      "When the charge shows under <b>Bills</b> in ③ your AWS account, set the monthly cost budget from earlier today to that amount plus a few dollars.",
      "It renews every month until you cancel it: Day 21 has the step for that."
    ],
    k: [
      ["When the charge comes", "The charge is billed to your AWS account on the subscription's start date, then again at each monthly renewal."],
      ["Bought by mistake", "Within 3 calendar days of the first purchase you can ask for immediate cancellation and a full refund. After that, cancelling stops the next renewal."]
    ],
    q: {
      q: "You bought one month of the Skill Builder Individual subscription on Day 1. You pass the exam on Day 22 and change nothing in Skill Builder. What happens to the subscription?",
      o: [
        "It renews every month, billed to your AWS account, until you cancel it",
        "It ends by itself after the one month you paid for",
        "AWS ends it once your exam result is posted",
        "It turns into a free Skill Builder account that costs nothing more"
      ],
      a: [0],
      x: [
        "Right. The Individual subscription renews automatically at its term, monthly here, and each charge goes to your AWS account until you cancel it.",
        "Buying one month does not stop the renewal. The subscription renews automatically unless you cancel it.",
        "Nothing ties the subscription to the exam. It keeps renewing until you cancel it in Skill Builder.",
        "There is no automatic switch. Until you cancel, each month's charge is billed to your AWS account."
      ],
      dom: 4, tags: ["Cost management tools"], doc: "budgets"
    },
    docs: [["AWS Training FAQs (how the Individual subscription is billed)", "https://aws.amazon.com/training/faqs/"]]
  },
  d8e1: {
    head: "Domain 1: put each security control at the right layer",
    why: "An exam question asks you to stop everyone, administrators included, from turning off logging in any account. One option tightens an IAM policy, one adds a service control policy, one encrypts the log bucket. All three sound secure. You need to see which layer the requirement lives in, and which control works there.",
    idea: "Domain 1, Design Secure Architectures, carries 30% of the scored content, the most of the four domains. Its three task statements cover access to AWS resources, workloads and applications, and data. Each scenario turns on one layer: identity, network or data.",
    k: [
      ["The controls of each layer", "Identity: IAM policies and service control policies (SCPs). Network: security groups, network ACLs, endpoints and firewalls. Data: KMS keys, resource policies and Object Lock."],
      ["Name the layer before the options", "Read the requirement and name its layer first. Then strike every option that works at another layer, however secure it sounds."],
      ["The three task statements", "1.1 Design secure access to AWS resources. 1.2 Design secure workloads and applications. 1.3 Determine appropriate data security controls."]
    ],
    trap: "A strong control at the wrong layer is the usual distractor: encryption where an access rule was asked for, or a network rule where an identity rule was asked for.",
    q: {
      q: "A stem says: \"The stored files must stay unreadable even to someone who obtains a copy of them.\" Three of the options sound secure. Which one works at the layer this requirement lives in?",
      o: [
        "Encrypt the files at rest with a KMS key",
        "Allow only the application's security group to reach the instances",
        "Add a network ACL that denies unknown address ranges",
        "Attach a service control policy that denies deleting the files"
      ],
      a: [0],
      x: [
        "Right. The requirement is about the data itself, so the control belongs at the data layer: encryption with a KMS key. A copy of encrypted files cannot be read without the key.",
        "A security group is a network control. It decides which traffic reaches an instance, not whether a copy of the stored files can be read.",
        "A network ACL filters traffic in and out of a subnet. A copy that has left the network is not protected by it.",
        "An SCP is an identity control and this one is about deleting. It does nothing to make a copy unreadable."
      ],
      dom: 1, tags: ["KMS & encryption"], doc: "kms"
    },
    docs: [
      ["SAA-C03 exam guide: Domain 1", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain1.html"]
    ]
  },
  d8e2: {
    head: "Task 1.1: give each person and workload only the access it needs",
    why: "A developer pastes an access key into a container image to get a demo working. Months later the image is public, and the key still opens everything its user could reach. Access has to be narrow, temporary where it can be, and capped across all accounts.",
    idea: "Task statement 1.1 asks you to design that access. Workloads get roles with temporary credentials, policies are narrowed by conditions, and organization-wide guardrails cap what member accounts can do.",
    k: [
      ["SCPs cap every member account", "A service control policy (SCP) never grants anything. A call needs an allow from the SCPs and from an identity or resource policy. A deny on <code>aws:RequestedRegion</code> or a missing <code>aws:RequestTag</code> binds even administrators there."],
      ["Workloads get roles, never keys", "One ECS task role per service. IAM Roles Anywhere for on-premises servers that hold X.509 certificates from your certificate authority. IAM database authentication, with tokens valid 15 minutes, in place of an RDS password."],
      ["Cross-account: policy or role", "A resource-based policy such as a bucket policy lets the caller keep its own permissions. Assuming a role in the other account replaces them for that session. So one set of credentials cannot use resources in both accounts."],
      ["Conditions narrow access", "Matching principal and resource tags give attribute-based access control (ABAC). <code>aws:SourceVpce</code> pins a bucket to one VPC endpoint. A deny when <code>aws:MultiFactorAuthPresent</code> is false forces MFA, as on Day 5."],
      ["Control Tower and Access Analyzer", "Control Tower builds a multi-account landing zone with preventive and detective controls, and Account Factory for new accounts. IAM Access Analyzer, with the organization as its zone of trust, reports resources shared with outside principals."],
      ["Leaked role credentials", "Temporary credentials keep working until they expire. To stop leaked ones sooner, revoke the role's active sessions."]
    ],
    trap: "Prevent or block in every account means a preventive control such as an SCP. AWS Config rules, GuardDuty and Access Analyzer are detective: they report what already exists.",
    q: {
      q: "A Lambda function in account A must read objects from a bucket in account A and write them to a bucket in account B, using the one set of credentials it runs with. Which design allows this?",
      o: [
        "A bucket policy on the bucket in account B that allows the function's role to write",
        "The function assumes a role in account B and keeps using it for both buckets",
        "An IAM user in account B whose access key is stored in the function's settings",
        "A service control policy in account B that allows the function's role to write"
      ],
      a: [0],
      x: [
        "Right. With a resource-based policy the caller keeps its own permissions, so the function's role can read in account A and write in account B with the same credentials.",
        "Assuming a role replaces the function's own permissions for that session, so the same credentials could no longer read the bucket in account A.",
        "A stored access key is a long-term credential to guard and rotate. Workloads get roles, never keys.",
        "An SCP never grants anything. It only caps what the member account's identities may do."
      ],
      dom: 1, tags: ["IAM roles & cross-account"], doc: "iam-cross-account"
    },
    docs: [
      ["Service control policies (SCPs)", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"],
      ["Cross account resource access in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies-cross-account-resource-access.html"],
      ["Secure API access with MFA", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_configure-api-require.html"]
    ]
  },
  d8e3: {
    head: "Task 1.2: guard each tier and keep private things off the internet",
    why: "A database port left open to the internet is found by scanners within days. A web form without filtering gets probed for SQL injection. Each kind of traffic needs its own guard, placed in front of the tier it protects.",
    idea: "Task statement 1.2 asks you to choose those guards: security groups and network ACLs between tiers, endpoints that keep traffic to AWS services private, and a firewall that fits the traffic, from web requests to DNS queries.",
    k: [
      ["Tier to tier", "Reference the source tier's security group in the rule, which survives IP changes. To block a CIDR, add a network ACL deny numbered lower than the allow. NACLs are stateless, so return traffic needs its own rule."],
      ["Private paths to AWS services", "Only S3 and DynamoDB have gateway endpoints. Other services use interface endpoints with private DNS and a security group that allows HTTPS. An endpoint policy with <code>aws:ResourceOrgID</code> blocks copies to buckets outside your organization."],
      ["A firewall for each kind of traffic", "AWS WAF for HTTP(S) on CloudFront, ALB and API Gateway: managed rule groups, rate-based rules. Network Firewall for VPC traffic: domain filtering, intrusion prevention rules in Suricata format. DNS Firewall for queries sent to the VPC Resolver."],
      ["Who applies and who detects", "Firewall Manager applies WAF rules across an organization, new accounts and resources included. GuardDuty detects threats and can scan new S3 uploads for malware. Macie finds sensitive data in S3. Inspector finds software vulnerabilities."],
      ["Private content, private shells", "Keep S3 content private behind CloudFront with origin access control. It works with SSE-KMS once the key policy allows the distribution. Or hand out expiring presigned URLs. Session Manager gives a shell with no inbound port, bastion or SSH key."],
      ["Seeing the packets themselves", "VPC Flow Logs, met on Day 4, record addresses, ports and accept or reject, not the payload. An intrusion detection appliance that must inspect packets gets a copy of them through VPC Traffic Mirroring."]
    ],
    trap: "AWS WAF cannot protect a Network Load Balancer, and security groups cannot deny. GuardDuty, Macie and Inspector report, and none of them blocks traffic.",
    q: {
      q: "A company must inspect the full contents of the packets reaching its web servers with an intrusion detection appliance it already runs on EC2. Which source gives the appliance what it needs?",
      o: [
        "VPC Traffic Mirroring, which sends the appliance a copy of the packets",
        "VPC Flow Logs, published to CloudWatch Logs for the appliance to read",
        "GuardDuty findings, exported to the appliance as they arrive",
        "AWS WAF logs from a web ACL on the servers' Network Load Balancer"
      ],
      a: [0],
      x: [
        "Right. Traffic Mirroring copies the packets themselves to the appliance, so it can inspect their contents.",
        "Flow Logs record addresses, ports and whether traffic was accepted or rejected. They never hold the payload.",
        "GuardDuty reports threats it detects. Its findings are not the packets, so the appliance has nothing to inspect.",
        "A web ACL cannot be attached to a Network Load Balancer, so there would be no WAF logs from it to read."
      ],
      dom: 1, tags: ["Threat detection"], doc: "vpc"
    },
    docs: [
      ["Infrastructure security in Amazon VPC (security groups compared with network ACLs)", "https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html"],
      ["Gateway endpoints", "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html"],
      ["Resources that you can protect with AWS WAF", "https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works-resources.html"]
    ]
  },
  d8e4: {
    head: "Task 1.3: keep data unreadable, and lock what must be kept",
    why: "A stolen snapshot, a bucket opened by mistake or a link sniffed on the way: each hands out readable data unless it was encrypted. And an auditor asks for seven years of records that someone could have quietly deleted. Data needs keys you control, protection on the move, and a lock where deletion is not allowed.",
    idea: "Task statement 1.3 asks you to choose who controls the key, how data is protected at rest and in transit, and which records are locked against deletion.",
    k: [
      ["When you need your own key", "Take a customer managed KMS key whenever the key policy must change: key access separate from bucket access, cross-account use, or letting S3 send events to an encrypted SQS queue. You then write the key policy, audit key use and control rotation."],
      ["Who may use a key, and where", "Cross-account use needs the key policy and the caller's IAM policy. <code>kms:ViaService</code> ties a key to one service. A multi-Region key decrypts in its replica Regions."],
      ["What KMS options do and don't", "KMS encrypts at most 4 KB, so bigger data uses envelope encryption (<code>GenerateDataKey</code>). S3 Bucket Keys only cut KMS request cost. Key rotation re-encrypts nothing. Single-tenant HSMs or the PKCS#11 interface mean CloudHSM."],
      ["Settings cover new data only", "Default bucket encryption and EBS encryption by default (set per Region) leave existing objects and volumes untouched. S3 Batch Operations converts existing objects. SSE-S3 to SSE-KMS now works in place, with no copy."],
      ["Records nobody may delete", "Object Lock in compliance mode, from Day 9, cannot be bypassed by anyone, root included. Governance mode can, with <code>s3:BypassGovernanceRetention</code>. A legal hold has no end date. AWS Backup Vault Lock offers the same two modes for recovery points."],
      ["TLS on every hop", "An HTTPS listener plus an HTTPS target group. A bucket policy deny when <code>aws:SecureTransport</code> is false. <code>rds.force_ssl</code> on RDS for PostgreSQL (the default from version 15). ACM renews only certificates it issued."]
    ],
    trap: "Bucket Keys, key rotation and default encryption never fix an access error. And S3 replication, from Day 9, skips SSE-KMS objects until the replication rule opts in to them.",
    q: {
      q: "A team turns on default SSE-KMS encryption for a bucket that already holds two million unencrypted objects. A week later an audit still finds most of them unencrypted. Why?",
      o: [
        "Default encryption covers only new objects, so existing ones must be converted, for example with S3 Batch Operations",
        "SSE-KMS works only after the KMS key has been rotated once",
        "S3 Bucket Keys must be turned on before any existing object is encrypted",
        "Default encryption applies only to objects uploaded from inside the VPC"
      ],
      a: [0],
      x: [
        "Right. Default bucket encryption leaves existing objects untouched. S3 Batch Operations converts them, and SSE-S3 objects can now be changed to SSE-KMS in place.",
        "Key rotation re-encrypts nothing and is not a condition for using SSE-KMS.",
        "Bucket Keys only cut the cost of KMS requests. They encrypt nothing on their own.",
        "Default encryption does not depend on where an upload comes from. It covers every new object, and only new ones."
      ],
      dom: 1, tags: ["KMS & encryption", "S3 security"], doc: "kms"
    },
    docs: [
      ["AWS KMS keys (customer managed, AWS managed, AWS owned)", "https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html"],
      ["Locking objects with Object Lock", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html"],
      ["Updating server-side encryption for existing data", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/update-sse-encryption.html"]
    ]
  },
  d8e5: {
    head: "Practise Domain 1 on exam-style questions",
    why: "You read the three Domain 1 reviews and every page felt familiar. Then a practice question offers four secure-sounding options, and you cannot say why three of them are wrong. Recognising a topic is not the same as deciding a scenario, and the exam asks for the deciding.",
    idea: "Domain 1 Practice gives you exam-style questions on the three task statements. The score matters less than the phrase in each stem that decided it.",
    do: [
      "Skill Builder → <b>Domain 1 Practice</b> → the exam-style questions. It needs the subscription.",
      "For every option you reject, name the phrase in the stem that rules it out. Review a lucky guess the same way as a miss.",
      "Enter your score in % in the Scores field below."
    ],
    k: [
      ["What a deciding phrase looks like", "\"Including account administrators\" rules out IAM policies and permissions boundaries. Write such phrases down: the same ones return on the exam."],
      ["Why a lucky guess counts as a miss", "A right answer you cannot explain will not hold in the exam, where the options are worded differently. Only an answer you can defend shows that the topic is known."]
    ],
    q: {
      q: "A practice question asks to block one Region for every identity in all member accounts, \"including the account administrators\". You picked an IAM policy attached to each user and missed. Which rule belongs in your notes?",
      o: [
        "\"Including the account administrators\" rules out IAM policies: a service control policy binds them",
        "\"All member accounts\" means attaching the same policy to every user one by one",
        "A permissions boundary on each administrator is the shortest fix for that phrase",
        "Blocking a Region needs a network ACL deny in every VPC of the organization"
      ],
      a: [0],
      x: [
        "Right. That phrase rules out IAM policies and permissions boundaries. An SCP caps every identity in the member accounts, administrators included.",
        "Per-user policies are what the phrase rules out, and an administrator could change them. One SCP covers every member account.",
        "\"Including account administrators\" rules out permissions boundaries as well as IAM policies.",
        "A network ACL filters traffic in a subnet. It does not decide which Region an API call may use."
      ],
      dom: 1, tags: ["Organizations & SCPs"], doc: "scp"
    }
  },
  d8e6: {
    head: "Recall Domain 1 from the flashcards",
    why: "In the exam a stem describes a need, and the answer has to come to you from memory before the options steer you. A fact you only recognise when you see it stays out of reach. You need practice at pulling answers out of memory, not at reading them.",
    idea: "The Domain 1 flashcards make you recall each fact before you see it. Every card you miss becomes a short rule you can reread before tonight's quiz.",
    do: [
      "Skill Builder → <b>Domain 1 Practice</b> → the flashcards.",
      "Say each answer aloud before you reveal it. Only then do you know whether you could recall it.",
      "Turn every card you miss into a one-line rule in your notes on this step.",
      "Reread those rules before tonight's quiz."
    ],
    k: [
      ["What a good rule holds", "The need, the answer, and why the look-alike fails: \"block a CIDR: network ACL deny, because a security group cannot deny\". A service name alone does not tell you when to pick it."]
    ],
    q: {
      q: "You miss a flashcard that asked how to keep one address range out of a subnet. Which note will help you most in the exam?",
      o: [
        "Block a CIDR: network ACL deny, because a security group cannot deny",
        "Network ACL",
        "Block a CIDR: a security group rule that denies the range",
        "Reread the whole Domain 1 Review before the exam"
      ],
      a: [0],
      x: [
        "Right. A good rule holds the need, the answer and why the look-alike fails, so it decides the question when both appear as options.",
        "The name alone does not say when to pick it, or why the security group option is wrong.",
        "Security groups cannot deny. They only allow, so a deny for one range needs a network ACL.",
        "Rereading everything spreads the effort thin. One exact rule for the fact you missed is what fixes it."
      ],
      dom: 1, tags: ["Security groups & NACLs"], doc: "vpc"
    }
  },
  d8e7: {
    head: "Domain 1 in a guided lab: tie each setting to its requirement",
    why: "In a guided lab you can click through every step, see the final check pass and still not know why each setting was needed. The exam never asks for the clicks. It gives you a requirement and asks for the control, so each setting has to be tied to the requirement it meets.",
    idea: "AWS SimuLearn starts with a conversation in which you gather requirements from an AI-powered virtual customer. Then you build the solution in a live AWS environment. This one practises Domain 1.",
    do: [
      "Skill Builder → <b>Domain 1 Practice: AWS SimuLearn</b>. About an hour, and it needs the subscription.",
      "It runs in a temporary sandbox, not in ③ your account, so nothing of yours is left to clean up afterwards.",
      "During the conversation, write down each requirement the customer states.",
      "After each build step, name the requirement that setting meets and its layer: identity, network or data."
    ],
    k: [
      ["The conversation is the stem", "A customer's wish is an exam stem in another form. Listen for the words that decide: \"every account\", \"administrators included\", \"at rest\", \"in transit\"."]
    ],
    q: {
      q: "In the lab's conversation the customer says: \"Our auditors need proof that no one, not even our administrators, could change or delete the log files.\" Which control does this point to?",
      o: [
        "S3 Object Lock in compliance mode on the bucket that holds the logs",
        "S3 Object Lock in governance mode on the bucket that holds the logs",
        "A bucket policy that denies deletes to every IAM user in the account",
        "Default SSE-KMS encryption on the bucket that holds the logs"
      ],
      a: [0],
      x: [
        "Right. It is a data-layer requirement. In compliance mode no user can bypass the retention, the root user included.",
        "Governance mode can be bypassed by anyone with the <code>s3:BypassGovernanceRetention</code> permission, so it proves nothing about administrators.",
        "A bucket policy can be changed by an administrator, so it cannot prove that nobody could delete the files.",
        "Encryption keeps the files unreadable to outsiders. It does not stop anyone from deleting or overwriting them."
      ],
      dom: 1, tags: ["S3 security"], doc: "object-lock"
    },
    docs: [["Immersive learning (AWS Cloud Quest and AWS SimuLearn)", "https://aws.amazon.com/training/digital/immersive-learning/"]]
  },
  d8b1: {
    head: "Rebuild the Day 4 VPC as code, with private paths to S3 and Systems Manager",
    why: "Instances in a private subnet still need S3, and you still need a way to log in to them. On Day 4 the NAT gateway gave them that path, and you clicked the network together by hand. Clicks are hard to repeat and easy to leave half deleted. You need the network as code you can build, check and remove the same way every time.",
    idea: "Terraform describes the VPC as code. VPC endpoints add private paths: a gateway endpoint for S3, and interface endpoints that let Session Manager reach the instances with no inbound port and no bastion.",
    do: [
      "Write Terraform for the Day 4 VPC: 2 AZs, 2 public and 2 private subnets, an internet gateway, a NAT gateway in 1 AZ and the route tables.",
      "Add an S3 gateway endpoint on the private route tables, and interface endpoints for <code>ssm</code> and <code>ssmmessages</code> in the private subnets, with private DNS on.",
      "Give the interface endpoints a security group that allows HTTPS (443) in from the instances, and enable DNS hostnames and DNS resolution on the VPC.",
      "Run it from your PC with <code>AWS_PROFILE=lab</code>.",
      "If Terraform can't read the <code>lab</code> profile, add a second profile whose only setting is <code>credential_process = aws configure export-credentials --profile lab --format process</code> and use that one.",
      "Put <code>*.tfstate</code> and <code>.terraform/</code> in <code>.gitignore</code>, then push the code to a public GitHub repo.",
      "At the end of the day: <code>terraform destroy</code>."
    ],
    done: "VPC → <b>Endpoints</b> lists the S3 gateway endpoint and both interface endpoints. Each private route table has a route that sends traffic for the S3 prefix list to the gateway endpoint.",
    k: [
      ["The gateway endpoint is only a route", "AWS adds the S3 prefix list as a destination in each route table you select, at no additional charge. It does not use PrivateLink. Instance security groups must still allow outbound traffic to that prefix list."],
      ["Interface endpoints are interfaces", "Each one is a network interface in your subnets, so its security group must let the instances in on 443. Its private DNS works only when DNS hostnames and DNS resolution are enabled on the VPC."],
      ["What Session Manager needs", "No inbound rule, so it replaces a bastion host. It needs the <code>ssm</code> and <code>ssmmessages</code> endpoints (plus <code>ec2messages</code> for SSM Agent before 3.3.40.0) and an instance profile with Systems Manager permissions."],
      ["Why state and keys stay out of Git", "Terraform state can expose sensitive information, and this repository is public. AWS's Terraform guidance also says to avoid static access keys when you run it locally, so use the named profile."]
    ],
    q: {
      q: "After <code>terraform apply</code>, each private route table shows a new route to the S3 prefix list. What added it, and what does it cost?",
      o: [
        "The S3 gateway endpoint, at no additional charge: S3 traffic from those subnets now goes to the endpoint",
        "A PrivateLink network interface for S3 in each subnet, billed per hour and per GB",
        "The NAT gateway, which now handles S3 traffic at its usual per-GB charge",
        "A VPC peering connection to the S3 service, billed per GB that crosses it"
      ],
      a: [0],
      x: [
        "Right. A gateway endpoint is only a route: AWS adds the S3 prefix list to each route table you select, at no additional charge.",
        "A gateway endpoint does not use PrivateLink. Interface endpoints are the kind that place network interfaces in your subnets.",
        "The new route takes S3 traffic away from the NAT gateway, which is the point: it no longer pays the NAT charge.",
        "S3 is not reached through peering. The route's target is the gateway endpoint."
      ],
      dom: 1, tags: ["VPC endpoints & PrivateLink", "Infrastructure as code"], doc: "endpoints"
    },
    docs: [
      ["Gateway endpoints for Amazon S3", "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"],
      ["VPC endpoints for Systems Manager", "https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-create-vpc.html"],
      ["Security best practices for the Terraform AWS Provider", "https://docs.aws.amazon.com/prescriptive-guidance/latest/terraform-aws-provider-best-practices/security.html"]
    ]
  },
  d8c1: {
    head: "Cognito user pools, identity pools or IAM Identity Center",
    why: "Your shop app needs customer sign-in, and its mobile client must upload photos straight to S3. At the same time your own staff need one login for all the company's AWS accounts. These are three needs, and the exam lists all three services as options for each of them.",
    idea: "A Cognito user pool signs your app's users in and issues tokens. A Cognito identity pool exchanges such a token for temporary AWS credentials. IAM Identity Center gives your workforce one sign-in to AWS accounts and business apps.",
    trap: "An option that lets the app call S3 or DynamoDB with only a user pool is wrong: the user pool hands out no AWS credentials. And Identity Center is never the answer for an app's customers.",
    q: {
      q: "A fitness app signs its customers in with a Cognito user pool. The app must now write each workout file straight to an S3 bucket, with no backend in between. What else does it need?",
      o: [
        "A Cognito identity pool that exchanges the user's token for temporary AWS credentials",
        "IAM Identity Center, with a permission set assigned to each customer",
        "An IAM user per customer, with its access key stored in the app",
        "Nothing more: S3 accepts the user pool's tokens as credentials"
      ],
      a: [0],
      x: [
        "Right. The identity pool turns the user pool's token into temporary AWS credentials mapped to an IAM role, so the app can call S3 directly.",
        "Identity Center is for your workforce, not for an app's customers.",
        "Access keys in an app are long-term secrets that leak. The identity pool hands out temporary credentials instead.",
        "A user pool only signs users in and issues tokens. It hands out no AWS credentials, and S3 needs those."
      ],
      dom: 1, tags: ["Cognito"], doc: "cognito"
    },
    docs: [
      ["What is Amazon Cognito? (user pools compared with identity pools)", "https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html"],
      ["What is IAM Identity Center?", "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html"]
    ]
  },
  d8c2: {
    head: "Let another account in with a role, not a shared key",
    why: "A partner's monitoring tool must read data in your account every hour. The quick way is to create an IAM user and send them its access key. That key never expires and now sits in someone else's system. Another account needs a way in that does not hand over a long-term secret.",
    idea: "A role in your account lets them in for a session: its trust policy names who may assume it, and the session gets temporary credentials. When the caller is a third party that serves many customers, the trust policy also requires an external ID.",
    trap: "The external ID is not a password: it only stops a third party from being tricked into using your role. Assuming a role replaces your own permissions for the session. A KMS key in another account needs its key policy plus your IAM policy.",
    q: {
      q: "A SaaS vendor's tool assumes a role in each of its customers' accounts, yours included. Your role's trust policy requires an external ID unique to you. What does that protect against?",
      o: [
        "Another customer of the vendor getting the vendor's tool to act on your role",
        "The vendor's staff reading your data with the role's permissions",
        "The role's temporary credentials working after they leak",
        "Calls to the role from a Region other than your own"
      ],
      a: [0],
      x: [
        "Right. That is the confused deputy problem: without the condition, someone else could give the vendor your role's ARN and have the vendor use it for them.",
        "The vendor is trusted to assume the role. The external ID does not limit what the trusted vendor does with it.",
        "The external ID is not a password and does nothing once credentials have been issued.",
        "The external ID says nothing about Regions. It is a condition on who may assume the role."
      ],
      dom: 1, tags: ["IAM roles & cross-account"], doc: "confused-deputy"
    },
    docs: [
      ["The confused deputy problem", "https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html"],
      ["Cross account resource access in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies-cross-account-resource-access.html"],
      ["Allowing users in other accounts to use a KMS key", "https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html"]
    ]
  },
  d8c3: {
    head: "Encryption at rest, encryption in transit, and where AWS WAF attaches",
    why: "Your database volumes are encrypted with a KMS key, so the audit should pass. Then the auditor captures the traffic between the load balancer and the servers and reads customer data in plain HTTP. Stored data and data on the move each need their own protection, and web attacks need a firewall at the right entry point.",
    idea: "KMS keys encrypt data at rest. TLS, with certificates from AWS Certificate Manager (ACM), protects it in transit. AWS WAF filters web requests and attaches only to certain resources, CloudFront, ALB and API Gateway among them.",
    trap: "Encryption at rest never enforces TLS. A certificate on the load balancer leaves the hop to the targets in plain HTTP unless the target group uses HTTPS. ACM does not renew imported certificates. A web ACL cannot be attached to a Network Load Balancer.",
    q: {
      q: "A public API runs behind a Network Load Balancer, and the security team wants AWS WAF rules against SQL injection in front of it. What should the architect change?",
      o: [
        "Serve the API through an Application Load Balancer or API Gateway and attach the web ACL there",
        "Attach the web ACL to the Network Load Balancer's listener",
        "Encrypt the targets' EBS volumes with a customer managed KMS key",
        "Add a security group rule on the targets that denies SQL injection"
      ],
      a: [0],
      x: [
        "Right. AWS WAF attaches to resources such as CloudFront, an ALB and API Gateway, so the web ACL needs one of them in front of the API.",
        "A web ACL cannot be attached to a Network Load Balancer.",
        "Encryption at rest protects stored data. It does nothing against an attack inside a web request.",
        "Security groups cannot deny, and they filter by address and port, not by what a request contains."
      ],
      dom: 1, tags: ["WAF, Shield & Firewall Manager"], doc: "waf"
    },
    docs: [
      ["Managed certificate renewal in ACM", "https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html"],
      ["Requirements for using SSL/TLS certificates with CloudFront", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html"],
      ["Resources that you can protect with AWS WAF", "https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works-resources.html"]
    ]
  }
});
