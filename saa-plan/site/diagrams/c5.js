// DATA ONLY: the diagram for lecture course 5 and its labs (format: site/diagram.js, rules: docs/diagrams.md).
window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.c5 = {
  title: "Guardrails, logs and security tools across an organization's accounts",
  why: "A company runs many accounts, and nobody can watch each one by hand. Risky actions must be stopped everywhere, every call must be recorded where nobody can erase it, and wrong settings and attacks must be found. Here guardrails sit on the organization, logs go to their own account, security tools run in another, and the workload is protected at its door.",
  w: 23, h: 13.7,
  areas: [
    { id: "org", label: "AWS Organizations", x: 0.3, y: 0.3, w: 22.4, h: 13.1 },
    { id: "mgmt", label: "Management account", x: 0.7, y: 0.9, w: 6.0, h: 5.2 },
    { id: "ou-sec", label: "Security OU", x: 7.1, y: 0.9, w: 15.2, h: 5.2, dash: true },
    { id: "log-acct", label: "Log Archive account", x: 7.5, y: 1.5, w: 6.6, h: 4.1 },
    { id: "tool-acct", label: "Security Tooling account", x: 14.5, y: 1.5, w: 7.4, h: 4.1 },
    { id: "ou-work", label: "Workloads OU", x: 7.1, y: 6.9, w: 15.2, h: 6.1, dash: true },
    { id: "prod", label: "Production account", x: 7.5, y: 7.5, w: 14.4, h: 5.1 }
  ],
  nodes: [
    { id: "tower", label: "AWS Control Tower", x: 1.1, y: 1.6, w: 5.2, h: 1.2 },
    { id: "trail", label: "Organization trail", x: 1.1, y: 3.3, w: 5.2, h: 1.2 },
    { id: "scp", label: "Service control policy", x: 0.8, y: 8.6, w: 4.4, h: 1.4 },
    { id: "logs", label: "S3 log bucket", x: 10.3, y: 3.3, w: 3.4, h: 1.2 },
    { id: "shub", label: "Security Hub CSPM", x: 14.9, y: 2.9, w: 3.1, h: 1.3 },
    { id: "agg", label: "Config aggregator", x: 18.4, y: 2.9, w: 3.1, h: 1.3 },
    { id: "waf", label: "AWS WAF and Shield", x: 7.9, y: 8.4, w: 3.1, h: 1.3 },
    { id: "alb", label: "Load balancer, HTTPS", x: 7.9, y: 10.9, w: 3.1, h: 1.3 },
    { id: "secrets", label: "Secrets Manager", x: 11.4, y: 8.4, w: 3.1, h: 1.3 },
    { id: "kms", label: "KMS key", x: 11.4, y: 10.9, w: 3.1, h: 1.3 },
    { id: "gd", label: "Amazon GuardDuty", x: 14.9, y: 8.4, w: 3.1, h: 1.3 },
    { id: "config", label: "AWS Config rules", x: 18.4, y: 8.4, w: 3.1, h: 1.3 }
  ],
  links: [
    ["trail", "logs", "log files"],
    ["scp", "ou-work", "attached"],
    ["waf", "alb", "requests"],
    ["gd", "shub", "findings"],
    ["config", "agg", "compliance"]
  ],
  parts: {
    org: {
      name: "AWS Organizations and OUs",
      why: "An account is a wall around its workloads, so a company ends up with many accounts. AWS Organizations manages them as one: it groups them into organizational units (OUs) and sets limits no member account can step over.",
      k: [
        ["Why several accounts", "Separate accounts per workload or environment limit the impact of an incident. They allow distinct security controls and split costs and service quotas."],
        ["OUs decide the guardrails", "An SCP attached to the root or to an OU applies to every OU and account underneath it. Where an account sits decides which guardrails it gets."],
        ["A Security OU", "AWS's guidance on organizing accounts puts a Log Archive account and a Security Tooling account in a Security OU, apart from the workloads."]
      ],
      tags: ["Organizations & SCPs", "Governance"]
    },
    scp: {
      name: "Service control policy (SCP)",
      why: "Some actions must never happen in any member account, whatever its own administrators allow. An SCP sets the most that IAM users and roles in those accounts can do. It grants nothing by itself.",
      k: [
        ["Effective permissions", "The overlap of the SCPs and the IAM policies. An SCP also limits each member account's root user."],
        ["Allow at every level", "An action needs an Allow at every level from the root through each OU to the account, which is why <code>FullAWSAccess</code> is attached when SCPs are enabled. A Deny at any level blocks everything below."],
        ["Resource control policy", "An SCP does not apply to outside users of your resources. The cap on what can be done to your resources is a resource control policy (RCP)."]
      ],
      trap: "SCPs never affect the management account or service-linked roles. That is one reason AWS says to keep workloads out of the management account.",
      tags: ["Organizations & SCPs"]
    },
    tower: {
      name: "AWS Control Tower",
      why: "Setting up many accounts with the same guardrails, logging and security tools by hand is slow and easy to get wrong. Control Tower builds a landing zone on top of Organizations and provisions new accounts into it.",
      k: [
        ["Three kinds of control", "Preventive controls are SCPs and other Organizations policies. Detective controls are AWS Config rules. Proactive controls are CloudFormation hooks."],
        ["Account Factory", "Provisions new accounts in the landing zone."],
        ["Shared accounts", "Control Tower sets up shared accounts for logs and for audit. From landing zone 4.0 they are called the CloudTrail administrator account and the Config aggregator account."]
      ],
      trap: "A detective control only reports. A Config rule notices a wrong setting after it exists, and stopping the action itself takes a preventive control such as an SCP.",
      tags: ["Governance", "Organizations & SCPs"]
    },
    trail: {
      name: "CloudTrail organization trail",
      why: "After an incident you must know who made which call, in every account. An organization trail logs the events of the management account and of all member accounts in one place.",
      k: [
        ["Members cannot touch it", "Users in member accounts cannot delete or change an organization trail. It is set up from the management account or a delegated administrator account."],
        ["What it logs", "Management events by default. Data events and Insights events must be switched on. Event history alone shows only 90 days of management events in one Region."],
        ["Integrity validation", "Shows whether a log file was modified or deleted after CloudTrail delivered it."]
      ],
      trap: "CloudTrail records calls, and AWS Config judges settings. CloudTrail Insights flags unusual API call and error rates, while threats such as cryptomining are GuardDuty findings.",
      tags: ["CloudTrail"]
    },
    logs: {
      name: "S3 log bucket",
      why: "Logs kept in the account they describe can be erased by whoever breaks into that account. The Log Archive account keeps the organization's logs together, away from the accounts they describe.",
      k: [
        ["Bucket in another account", "A trail can deliver to a bucket in another account. The bucket policy must allow CloudTrail to write to it."],
        ["Object Lock", "Use compliance mode when no user, the root user included, may delete or overwrite the logs. Object Lock needs versioning."],
        ["Governance mode", "Can be bypassed with a special permission, so it does not meet a rule that nobody may delete the logs."]
      ],
      trap: "Log file integrity validation shows that a file was changed or deleted, but it does not stop it. Stopping it takes Object Lock or a policy that denies the call.",
      tags: ["CloudTrail", "S3 features"]
    },
    shub: {
      name: "Security Hub CSPM",
      why: "Findings from many services in many accounts help nobody if no one sees them together. Security Hub CSPM collects the findings in one place, run from the Security Tooling account for the whole organization.",
      k: [
        ["Security Tooling account", "AWS's guidance makes it the aggregation point for security services such as Security Hub, GuardDuty, Macie, Inspector and Firewall Manager, with delegated administration for them."],
        ["Delegated administrator", "The management account names the delegated administrator for Security Hub CSPM. AWS recommends that the management account not take that role itself."],
        ["Two relationships", "A GuardDuty administrator sees member findings in GuardDuty. Bringing them into Security Hub CSPM needs its own administrator-member relationship."]
      ],
      tags: ["Threat detection", "Governance"]
    },
    gd: {
      name: "Amazon GuardDuty",
      why: "An attack in progress shows up as unusual calls and traffic, long before anyone could read the logs by hand. GuardDuty analyzes CloudTrail management events, VPC flow logs and DNS logs and reports threats as findings.",
      k: [
        ["Across the organization", "The management account delegates GuardDuty to an administrator account. That account manages the member accounts and can turn GuardDuty on for new accounts automatically."],
        ["Inspector and Macie", "Inspector scans EC2 instances, ECR images and Lambda functions for vulnerabilities. Macie finds sensitive data in S3."]
      ],
      trap: "A finding blocks nothing until something reacts to it. Compliance reports about AWS itself, such as ISO or SOC, come from AWS Artifact, not from these services.",
      tags: ["Threat detection"]
    },
    config: {
      name: "AWS Config rules",
      why: "In an account many people use, someone will create a resource that breaks the rules, such as a bucket without versioning. AWS Config records each resource's settings over time and judges them against rules.",
      k: [
        ["Tags", "The managed rule <code>required-tags</code> checks that resources carry the tags you name, up to 6 per rule. It finds wrongly tagged resources but does not prevent their creation."],
        ["Remediation", "A noncompliant resource can be fixed by a Systems Manager Automation document, set up as manual or automatic."],
        ["Across accounts", "An aggregator collects configuration and compliance data from many accounts and Regions. A conformance pack deploys rules and remediation actions as one unit."]
      ],
      trap: "Config acts after the resource exists, so a wrong setting lives for a while. 'Must never be created' needs a preventive control such as an SCP or an IAM policy condition.",
      tags: ["AWS Config", "Governance"]
    },
    waf: {
      name: "AWS WAF and AWS Shield",
      why: "A public application is attacked at its door, with harmful requests and with floods of traffic. AWS WAF filters the HTTP(S) requests, and AWS Shield protects against attempts to flood the application, known as DDoS.",
      k: [
        ["Where WAF attaches", "A protection pack (web ACL) goes on a CloudFront distribution, an Application Load Balancer, an API Gateway REST API, an AppSync GraphQL API or a Cognito user pool, among others."],
        ["Which rule", "AWS managed rule groups for common exploits such as the OWASP Top 10. A rate-based rule for clients that send too fast. A geo match rule for countries you must block."],
        ["Shield", "Shield Standard protects against DDoS automatically at no extra charge. Shield Advanced is a subscription per resource, with the Shield Response Team and credits for attack-driven charges."]
      ],
      trap: "A Network Load Balancer cannot take a web ACL. One baseline of WAF rules across every account, including accounts added later, is AWS Firewall Manager.",
      tags: ["WAF, Shield & Firewall Manager"]
    },
    alb: {
      name: "HTTPS on the load balancer",
      why: "Traffic between users and the application can be read on the way unless it is encrypted. An Application Load Balancer's HTTPS listener uses a TLS certificate, so requests travel encrypted.",
      k: [
        ["Where TLS ends", "An HTTPS listener terminates TLS and decrypts requests before sending them to the targets. An HTTPS target group encrypts the next hop."],
        ["Passing TLS through", "When only the targets may decrypt, use a Network Load Balancer with a TCP listener on port 443. It passes the traffic through still encrypted."],
        ["ACM certificates", "ACM renews a certificate it issued with DNS validation, while it is in use and its CNAME record stays in DNS. Imported certificates get no managed renewal."]
      ],
      tags: ["Encryption in transit", "Load balancing"]
    },
    kms: {
      name: "AWS KMS customer managed key",
      why: "Encrypted data is only as safe as its key. AWS KMS keeps the keys and decides who may use them, and a customer managed key is the one whose key policy you control.",
      k: [
        ["Customer or AWS managed", "You maintain a customer managed key's policy, enable and disable it, rotate it and schedule its deletion. An AWS managed key's policy can be viewed but not changed."],
        ["Rotation and deletion", "Automatic rotation is yearly by default, and KMS keeps all earlier key material. Deleting a key is irreversible after a wait of 7 to 30 days."],
        ["Large data", "<code>Encrypt</code> takes at most 4,096 bytes. Larger data uses a data key from <code>GenerateDataKey</code>, stored encrypted next to the data."]
      ],
      trap: "Without the key policy statement that enables IAM policies, an IAM Allow on the key has no effect. Use from another account needs the key policy plus an IAM policy there.",
      tags: ["KMS & encryption"]
    },
    secrets: {
      name: "AWS Secrets Manager",
      why: "A database password written into code can be read by everyone who reads the code, and it rarely gets changed. Secrets Manager replaces it with a call at run time and rotates the secret.",
      k: [
        ["Rotation", "Managed rotation for most managed secrets and for partner-held ones. Other types rotate through a Lambda function."],
        ["Other Regions", "Secrets can be replicated to other Regions."],
        ["Parameter Store", "SecureString values are encrypted with KMS too. AWS still recommends Secrets Manager for database credentials, API keys and tokens."]
      ],
      tags: ["Secrets Manager & Parameter Store"]
    }
  }
};
