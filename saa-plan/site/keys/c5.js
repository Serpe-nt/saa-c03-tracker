// Key points per plan step for the course "Designing a Compliant, Secure, and Governed Architecture" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c5a: {
    head: "Many accounts, and guardrails that no account can step over",
    why: "A developer testing a script in the company's only AWS account deletes a production database by mistake. At the end of the month nobody can tell which team spent what. Workloads need walls between them, and someone must be able to set limits that hold in every account.",
    idea: "Separate AWS accounts are those walls. AWS Organizations manages them as one: it groups them into organizational units and attaches service control policies (SCPs) that cap what each account can do. AWS Control Tower builds such a setup for you.",
    k: [
      ["Why several accounts", "An AWS account is an isolation boundary. Separate accounts per workload or environment limit the scope of impact of an incident, allow distinct security controls per environment, and split costs and service quotas."],
      ["Where an account sits decides", "AWS Organizations groups accounts into organizational units (OUs). An SCP attached to the root or to an OU applies to every OU and member account underneath it."],
      ["What an SCP does", "It grants nothing. It limits what IAM users and roles in member accounts can do, each member account's root user included. Outside users of your resources are capped by a resource control policy (RCP) instead."],
      ["An Allow at every level", "An action needs an Allow at every level from the root through each OU to the account, and an IAM policy that allows it. That is why <code>FullAWSAccess</code> is attached when SCPs are enabled. A Deny at any level blocks everything underneath."],
      ["Control Tower builds the landing zone", "It sets up a landing zone on top of Organizations. Preventive controls are SCPs and other Organizations policies. Detective controls are AWS Config rules. Proactive controls are CloudFormation hooks. Account Factory provisions new accounts."]
    ],
    trap: "SCPs never affect the management account, nor the service-linked roles that AWS services use in your accounts. That is why AWS says to keep workloads out of the management account: no SCP can guard them there.",
    q: {
      q: "An SCP attached to the root of an organization denies <code>s3:DeleteBucket</code>. In which account can an administrator still delete a bucket?",
      o: [
        "In the management account",
        "In any member account, as a user with AdministratorAccess",
        "In any member account, as that account's root user",
        "In none: an SCP on the root covers every account"
      ],
      a: [0],
      x: [
        "Right. SCPs never affect the management account. That is why AWS says to keep workloads out of it.",
        "An SCP limits what IAM users and roles in member accounts can do, administrators included. AdministratorAccess cannot step over it.",
        "SCPs limit each member account's root user too.",
        "The management account is the exception: SCPs never affect it, wherever they are attached."
      ],
      dom: 1, tags: ["Organizations & SCPs"], doc: "scp"
    },
    docs: [
      ["Service control policies (SCPs)", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"],
      ["SCP evaluation", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_evaluation.html"],
      ["Benefits of using multiple AWS accounts", "https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/benefits-of-using-multiple-aws-accounts.html"]
    ]
  },

  c5b: {
    head: "Protecting a public web application on the way and at its door",
    why: "A shop's checkout page is opened on public Wi-Fi, where others on the network can read what is sent. The same week a bot tries thousands of logins a minute, and a flood of traffic from many machines knocks the site offline. Traffic must be unreadable on the way, harmful requests filtered before the app, and floods absorbed.",
    idea: "Each threat has its own answer. Certificates from AWS Certificate Manager (ACM) let the traffic travel encrypted with TLS. AWS WAF filters web requests by rules. AWS Shield protects against floods meant to knock the app offline, known as DDoS.",
    k: [
      ["ACM renews what it issued", "ACM automatically renews a certificate it issued with DNS validation, while the certificate is in use and its CNAME record stays in DNS. Imported certificates get no managed renewal. A certificate for CloudFront must be in us-east-1."],
      ["Where AWS WAF attaches", "It filters HTTP(S) requests with a protection pack (web ACL). You associate it with a CloudFront distribution or an Application Load Balancer, among others. API Gateway REST APIs, AppSync GraphQL APIs and Cognito user pools are on the list too."],
      ["Pick the WAF rule by the attack", "AWS managed rule groups for common exploits such as those in the OWASP Top 10. A rate-based rule for clients that send requests too fast. A geo match rule for countries you must block."],
      ["Shield Standard and Advanced", "Shield Standard protects against DDoS automatically at no extra charge. Shield Advanced is a subscription per resource. It adds the Shield Response Team, which needs a Business or Enterprise support plan, and credits for attack-driven charges."],
      ["One baseline for every account", "AWS Firewall Manager puts one baseline of WAF rules on the resources of every account, including accounts and resources added later. It works through AWS Organizations."]
    ],
    trap: "A Network Load Balancer is not among the resources a web ACL can protect. When an option puts WAF rules on an NLB, it is wrong.",
    q: {
      q: "A bot hammers the login page behind an Application Load Balancer from a handful of addresses, far faster than any person could type. What stops it with the least effort?",
      o: [
        "A rate-based rule in an AWS WAF web ACL on the load balancer",
        "AWS Shield Standard, which is already on for every account",
        "A geo match rule that blocks the bot's countries",
        "A new ACM certificate on the HTTPS listener"
      ],
      a: [0],
      x: [
        "Right. A rate-based rule is the WAF rule for clients that send requests too fast, and an ALB is a resource a web ACL can protect.",
        "Shield Standard protects against DDoS floods. A few clients sending login requests too fast is a job for a WAF rule.",
        "A geo match rule blocks whole countries, real users included, and the bot's addresses may move.",
        "A certificate encrypts the traffic. It does not filter what the requests do."
      ],
      dom: 1, tags: ["WAF, Shield & Firewall Manager"], doc: "waf"
    },
    docs: [
      ["Resources that you can protect with AWS WAF", "https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works-resources.html"],
      ["How AWS Shield and Shield Advanced work", "https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html"],
      ["Create an HTTPS listener for your Application Load Balancer", "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html"]
    ]
  },

  c5c: {
    head: "Keeping passwords out of code, and guarding the keys to your data",
    why: "A database password sits in the app's configuration file in a Git repository. Everyone who can read the repository can read it, and it has not changed in years. The backups are encrypted, but nobody can say who may use the key. Secrets have to be fetched at run time and rotated, and each key needs an owner who decides who may use it.",
    idea: "AWS Secrets Manager stores secrets and rotates them. AWS Key Management Service (KMS) creates and guards the keys that encrypt your data, and each key's policy decides who may use it.",
    k: [
      ["Secrets Manager", "It replaces hard-coded credentials with a call at run time and rotates secrets. Rotation is managed for most managed secrets and for partner-held (managed external) ones, and uses a Lambda function for other types. Secrets can be replicated to other Regions."],
      ["Parameter Store", "SecureString values are encrypted with KMS. AWS still recommends Secrets Manager for database credentials, API keys and tokens, because it adds automatic rotation and cross-Region replication."],
      ["Customer managed or AWS managed", "A customer managed key is yours: you maintain its key policy, enable and disable it, rotate it and schedule its deletion. An AWS managed key's policy you can view but not change, and you cannot rotate or delete that key."],
      ["Data keys for large data", "KMS <code>Encrypt</code> takes at most 4,096 bytes. Larger data uses a data key from <code>GenerateDataKey</code>. Encrypt locally with its plaintext copy, then store its encrypted copy with the encrypted data."],
      ["Rotation and deletion", "Automatic rotation works only for symmetric KMS keys whose key material KMS generated. It is yearly by default, and KMS keeps all earlier key material. Deleting a key is irreversible after a wait of 7 to 30 days. A disabled key can be re-enabled."]
    ],
    trap: "Without the key policy statement that enables IAM policies, an IAM Allow on the key is ineffective. Use from another account needs the key policy plus an IAM policy in that account. And an RDS snapshot under the default KMS key cannot be shared.",
    q: {
      q: "An app must encrypt video files of about 50 MB each under a KMS key. Its first attempt, sending each file to the KMS <code>Encrypt</code> call, fails. What should it do instead?",
      o: [
        "Encrypt locally with a data key from <code>GenerateDataKey</code>",
        "Ask AWS to raise the size limit of the <code>Encrypt</code> call for the account",
        "Split each file into chunks and send every chunk to <code>Encrypt</code> separately",
        "Store the files in Parameter Store as SecureString values"
      ],
      a: [0],
      x: [
        "Right. <code>Encrypt</code> takes at most 4,096 bytes. Larger data is encrypted locally with a data key, whose encrypted copy is stored with the data.",
        "The 4,096-byte limit is why data keys exist. The pattern for large data is to encrypt locally.",
        "That turns one file into thousands of KMS calls, when one data key does the job locally.",
        "Parameter Store holds configuration values and secrets, not 50 MB video files."
      ],
      dom: 1, tags: ["KMS & encryption"], doc: "kms"
    },
    docs: [
      ["What is AWS Secrets Manager?", "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html"],
      ["AWS KMS keys", "https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html"],
      ["Rotate AWS KMS keys", "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html"]
    ]
  },

  c5d: {
    head: "Who did what, what is set wrong, and who is attacking",
    why: "On Monday a bucket is public, a security group is open to the world, and an instance is mining cryptocurrency. Nobody can say who changed what, or since when. You need a record of every call, a record of every setting judged against rules, and services that look for attacks.",
    idea: "AWS CloudTrail records the API calls. AWS Config records how resources are set up and judges them against rules. GuardDuty, Inspector and Macie look for threats, vulnerabilities and sensitive data.",
    k: [
      ["What a trail records", "A trail logs management events by default. Data events and Insights events must be switched on. Event history shows only the past 90 days of management events in one Region, and no data events."],
      ["One trail for the organization", "An organization trail logs events for the management account and all member accounts. Users in member accounts cannot delete or change it. Log file integrity validation shows whether a log file was modified or deleted after delivery."],
      ["Config records and judges", "AWS Config records how resources were configured over time and evaluates them against rules. A noncompliant resource can be remediated with a Systems Manager Automation document, manually or automatically, after the change has happened."],
      ["Config across accounts", "An aggregator collects configuration and compliance data from many accounts and Regions. A conformance pack deploys a set of rules and remediation actions as one unit, also across an organization."],
      ["Finding threats and weak spots", "GuardDuty analyzes CloudTrail management events, VPC flow logs and DNS logs for threats. Inspector scans EC2 instances, ECR images and Lambda functions for vulnerabilities. Macie finds sensitive data in S3. Security Hub CSPM collects the findings."]
    ],
    trap: "Compliance reports about AWS itself (ISO, PCI, SOC) come from AWS Artifact, as on Day 5. AWS Config judges your resources, not AWS. CloudTrail Insights flags unusual API call and error rates. Threats such as cryptomining are GuardDuty findings.",
    q: {
      q: "A security team must find out who read certain objects in a bucket last week. The account has no trail, and the team relies on CloudTrail's Event history. What do they find, and what should they set up?",
      o: [
        "Event history holds no data events: they need a trail that logs S3 data events",
        "Event history keeps 90 days of every event, so the reads are listed there already",
        "AWS Config recorded the reads as configuration changes of the bucket",
        "GuardDuty lists every object read as a finding, so they can search its findings"
      ],
      a: [0],
      x: [
        "Right. Event history shows only management events, for 90 days in one Region. Reading objects is a data event, which only a trail with data events switched on records.",
        "Event history keeps 90 days of management events only. Data events such as object reads are not in it.",
        "Config records how resources are configured. Reading an object changes no configuration.",
        "GuardDuty looks for threats in the logs it analyzes. It is not a record of every read."
      ],
      dom: 1, tags: ["CloudTrail"], doc: "cloudtrail"
    },
    docs: [
      ["CloudTrail concepts", "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html"],
      ["Remediating noncompliant resources with AWS Config", "https://docs.aws.amazon.com/config/latest/developerguide/remediation.html"],
      ["What is Amazon GuardDuty?", "https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html"]
    ]
  },

  c5e: {
    head: "Secure by design: the right kind of control for each requirement",
    why: "A team turns on GuardDuty and calls the system secure. Then an auditor asks how they stop a member account from switching off logging, and how they prove a log was not changed. A secure design needs controls that stop an action, controls that notice it, and controls that prove later what happened.",
    idea: "This step puts the pieces together. Read what each requirement asks for, prevent, detect, correct or prove, and pick the control of that kind.",
    k: [
      ["Read the verb", "Prevent an action in every member account: an SCP. Detect a wrong setting and correct it: a Config rule with remediation. Prove who made a call: CloudTrail. Notice an attack in progress: GuardDuty."],
      ["Layers at the edge", "Shield covers DDoS at layers 3, 4 and 7. A WAF protection pack (web ACL) on CloudFront or the ALB filters the HTTP(S) requests. The ALB's HTTPS listener ends TLS, and an HTTPS target group encrypts the next hop."],
      ["A key you control for the data", "Choose a customer managed KMS key when you must decide who may use the key, or disable it. The same goes for using it from another account."],
      ["A password that rotates", "Keep the database password in Secrets Manager, so that it can rotate."],
      ["Auditability is designed too", "An organization trail that member accounts cannot change, and log file integrity validation. Add S3 Object Lock in compliance mode when no user, the root user included, may delete or overwrite the logs."]
    ],
    trap: "Controls of different kinds add up. They do not replace each other. Encryption at rest does not force TLS. A detective Config rule does not stop the call the way an SCP does. A GuardDuty finding blocks nothing until something reacts to it.",
    q: {
      q: "A database's snapshots are encrypted with KMS. The security team must be able to switch off use of the key at any moment, and a second account must restore the snapshots. Which key fits?",
      o: [
        "A customer managed KMS key, with a key policy that lets the second account use it",
        "The default AWS managed key that RDS uses for the database",
        "No KMS key: keep the snapshots unencrypted and limit who can copy them",
        "A key stored in Secrets Manager, rotated every day"
      ],
      a: [0],
      x: [
        "Right. A customer managed key is the one you can disable, and its key policy can allow use from another account.",
        "You cannot change an AWS managed key's policy, so the team cannot control its use, and a snapshot under the default key cannot be shared.",
        "Encryption at rest is not replaced by access limits. Controls of different kinds add up.",
        "Secrets Manager stores secrets such as passwords. Snapshots are encrypted with KMS keys."
      ],
      dom: 1, tags: ["KMS & encryption"], doc: "kms"
    },
    docs: [
      ["Control behavior and guidance (AWS Control Tower)", "https://docs.aws.amazon.com/controltower/latest/controlreference/control-behavior.html"],
      ["Locking objects with Object Lock", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html"],
      ["Validating CloudTrail log file integrity", "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html"]
    ]
  },

  l5a: {
    head: "Let AWS Config check every resource against your rules",
    why: "Thirty people use one account. Someone creates a bucket without versioning, and someone else launches servers without the cost-center tag. Nobody can check every resource by hand. Resources have to be checked against the rules automatically, every time they change.",
    idea: "AWS Config records each resource's settings and judges them against rules. The lab has you set that up.",
    k: [
      ["The recorder comes first", "AWS Config works from what its configuration recorder captures. The recorder stores each change to a resource type in scope as a configuration item. The rules evaluate those configuration settings."],
      ["Checking tags", "The managed rule <code>required-tags</code> checks that resources carry the tags you specify, up to 6 tags per rule, optionally with expected values. It finds resources that were launched wrongly. It does not prevent their creation."],
      ["Evaluated on change, not on a timer", "<code>s3-bucket-versioning-enabled</code> and <code>s3-bucket-server-side-encryption-enabled</code> have the trigger type configuration changes. Config evaluates a bucket when it detects a change to it."],
      ["Requiring KMS keys", "Every S3 bucket now has encryption with S3 managed keys (SSE-S3) by default, so a rule that asks for KMS keys must be stricter. <code>s3-default-encryption-kms</code> is noncompliant when a bucket is not encrypted with a KMS key."]
    ],
    trap: "A Config rule reports a resource after it exists. When an untagged or unencrypted resource must never be created, the answer is a preventive control. That is an SCP or an IAM policy condition, not one more Config rule.",
    q: {
      q: "Policy says every bucket must be encrypted with a KMS key. All buckets report compliant on <code>s3-bucket-server-side-encryption-enabled</code>, yet some use only S3 managed keys. Which managed rule finds them?",
      o: [
        "<code>s3-default-encryption-kms</code>",
        "<code>required-tags</code>",
        "<code>s3-bucket-versioning-enabled</code>",
        "<code>s3-bucket-server-side-encryption-enabled</code> with a periodic trigger"
      ],
      a: [0],
      x: [
        "Right. Every bucket now has SSE-S3 by default, so the stricter <code>s3-default-encryption-kms</code> is needed: it is noncompliant when a bucket is not encrypted with a KMS key.",
        "That rule checks tags, not how a bucket is encrypted.",
        "That rule checks versioning, which says nothing about the encryption key.",
        "Checking more often does not help: SSE-S3 counts as server-side encryption, so the buckets stay compliant under that rule."
      ],
      dom: 1, tags: ["AWS Config"], doc: "config"
    },
    docs: [
      ["required-tags", "https://docs.aws.amazon.com/config/latest/developerguide/required-tags.html"],
      ["Components of an AWS Config rule", "https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_components.html"],
      ["Setting default server-side encryption behavior for Amazon S3 buckets", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-bucket-encryption.html"]
    ]
  },

  l5b: {
    head: "Fix rule-breaking resources automatically with AWS Config",
    why: "Every Monday the Config dashboard lists a dozen buckets without versioning. Someone fixes them by hand, and by Friday new ones have appeared. Finding a resource that breaks a rule is only half the work: the fix should run by itself.",
    idea: "AWS Config can attach a remediation to a rule and run it on each noncompliant resource. The lab shows how a rule is triggered, how the fix is attached, and where you see what is still noncompliant.",
    k: [
      ["Managed rules and their triggers", "AWS managed rules are predefined and customizable: you can set the scope that limits which resources trigger an evaluation. Note each rule's trigger type: configuration changes, periodic (for example every 24 hours), or both."],
      ["Remediation runs an Automation document", "It runs a Systems Manager Automation document on the noncompliant resource. Config provides managed automation documents, and you can associate your own. Each rule's remediation is set up as manual or automatic."],
      ["Dashboard and aggregator", "The Config dashboard is the overview: your resources, rules and conformance packs with their compliance states, and which rules and resources are noncompliant. An aggregator gives that view across accounts and Regions."]
    ],
    trap: "Remediation acts after Config has evaluated the resource, so the wrong setting exists for a while. 'Detect and correct automatically' is a Config rule with automatic remediation. 'Must never happen' needs a control that denies the call.",
    q: {
      q: "Buckets without versioning keep appearing. The team wants each one found and switched to versioning without anyone acting, and accepts that a bucket may be wrong for a few minutes. What do they set up?",
      o: [
        "A Config rule with automatic remediation that runs a Systems Manager Automation document",
        "A Config rule with manual remediation, checked on the dashboard every Monday",
        "A Config aggregator across all accounts and Regions",
        "A conformance pack with the same rule and no remediation actions"
      ],
      a: [0],
      x: [
        "Right. Detect and correct automatically is a Config rule with automatic remediation, which runs an Automation document on each noncompliant resource.",
        "Manual remediation waits for a person, which is the work the team wants to stop doing.",
        "An aggregator gives one view across accounts and Regions. It fixes nothing.",
        "A conformance pack deploys rules and remediation actions as one unit. Without remediation actions, nothing is fixed."
      ],
      dom: 1, tags: ["AWS Config"], doc: "config"
    },
    docs: [
      ["AWS Config managed rules", "https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_use-managed-rules.html"],
      ["Remediating noncompliant resources with AWS Config", "https://docs.aws.amazon.com/config/latest/developerguide/remediation.html"],
      ["Viewing the AWS Config dashboard", "https://docs.aws.amazon.com/config/latest/developerguide/viewing-the-aws-config-dashboard.html"]
    ]
  }
});
