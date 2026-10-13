// Key points per plan step for the course "Designing a Compliant, Secure, and Governed Architecture" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c5a: {
    k: [
      "An AWS account is an isolation boundary. Separate accounts per workload or environment limit the scope of impact of an incident, allow distinct security controls per environment, and split costs and service quotas.",
      "AWS Organizations groups accounts into organizational units (OUs). An SCP attached to the root or to an OU applies to every OU and member account underneath it, so where an account sits decides which guardrails it gets.",
      "An SCP grants nothing. It limits what IAM users and roles in member accounts can do, including each member account's root user, and the effective permissions are the overlap of the SCPs and the IAM policies.",
      "For an action to be allowed, an Allow must exist at every level from the root through each OU to the account, which is why Organizations attaches <code>FullAWSAccess</code> when SCPs are enabled. A Deny at any one level blocks everything underneath.",
      "AWS Control Tower builds a landing zone on top of Organizations with preventive controls (SCPs and other Organizations policies), detective controls (AWS Config rules), proactive controls (CloudFormation hooks) and Account Factory to provision new accounts."
    ],
    trap: "SCPs never affect the management account or service-linked roles, so AWS says to keep workloads out of the management account. An SCP also does not apply to outside users of your resources; the cap on resources is a resource control policy (RCP).",
    docs: [
      ["Service control policies (SCPs)", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"],
      ["SCP evaluation", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_evaluation.html"],
      ["Benefits of using multiple AWS accounts", "https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/benefits-of-using-multiple-aws-accounts.html"]
    ]
  },

  c5b: {
    k: [
      "An ALB HTTPS listener terminates TLS and decrypts requests before sending them to the targets. If only the targets may decrypt, use a Network Load Balancer with a TCP listener on port 443, which passes the traffic through still encrypted.",
      "ACM automatically renews a certificate it issued with DNS validation while the certificate is in use and its CNAME record stays in DNS; imported certificates get no managed renewal. A certificate for CloudFront must be requested or imported in us-east-1.",
      "AWS WAF filters HTTP(S) requests with a protection pack (web ACL) that you associate with a CloudFront distribution, an Application Load Balancer, an API Gateway REST API, an AppSync GraphQL API or a Cognito user pool, among others.",
      "Pick the WAF rule by the attack: AWS managed rule groups for common exploits such as those in the OWASP Top 10, a rate-based rule for clients that send requests too fast, a geo match rule for countries you must block.",
      "Shield Standard protects against DDoS automatically at no extra charge. Shield Advanced is a subscription with protection added per resource; it adds the Shield Response Team (needs a Business or Enterprise support plan) and credits for attack-driven charges."
    ],
    trap: "A Network Load Balancer is not among the resources a web ACL can protect. One baseline of WAF rules on every account's resources, including accounts and resources added later, is AWS Firewall Manager, which works through AWS Organizations.",
    docs: [
      ["Resources that you can protect with AWS WAF", "https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works-resources.html"],
      ["How AWS Shield and Shield Advanced work", "https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html"],
      ["Create an HTTPS listener for your Application Load Balancer", "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html"]
    ]
  },

  c5c: {
    k: [
      "Secrets Manager replaces hard-coded credentials with a call at run time and rotates secrets: managed rotation for most managed secrets and for partner-held (managed external) ones, a Lambda function for other types. Secrets can be replicated to other Regions.",
      "Parameter Store SecureString values are encrypted with KMS, but AWS recommends Secrets Manager for database credentials, API keys and tokens, because it adds automatic rotation and cross-Region replication.",
      "A customer managed key is the one you control: you maintain its key policy, enable and disable it, rotate it and schedule its deletion. You can view the key policy of an AWS managed key but cannot change it, rotate the key or delete it.",
      "KMS <code>Encrypt</code> takes at most 4,096 bytes. Larger data uses a data key from <code>GenerateDataKey</code>: encrypt locally with the plaintext copy, then store the encrypted copy of the data key with the encrypted data.",
      "Automatic rotation works only for symmetric encryption KMS keys whose key material KMS generated, is yearly by default, and KMS keeps all earlier key material. Deleting a key is irreversible after a wait of 7 to 30 days; a disabled key can be re-enabled."
    ],
    trap: "Without the key policy statement that enables IAM policies, an IAM Allow on the key is ineffective. Use from another account needs the key policy plus an IAM policy in that account, and an RDS snapshot under the default KMS key cannot be shared.",
    docs: [
      ["What is AWS Secrets Manager?", "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html"],
      ["AWS KMS keys", "https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html"],
      ["Rotate AWS KMS keys", "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html"]
    ]
  },

  c5d: {
    k: [
      "CloudTrail trails log management events by default; data events and Insights events must be switched on. Event history shows only the past 90 days of management events in one Region and no data events.",
      "An organization trail logs events for the management account and all member accounts, and users in member accounts cannot delete it or change it. Log file integrity validation shows whether a log file was modified or deleted after delivery.",
      "AWS Config records how resources were configured over time and evaluates them against rules. A noncompliant resource can be remediated with a Systems Manager Automation document, manually or automatically, after the change has happened.",
      "Across accounts, a Config aggregator collects configuration and compliance data from many accounts and Regions, and a conformance pack deploys a set of rules and remediation actions as one unit, also across an organization.",
      "GuardDuty analyzes CloudTrail management events, VPC flow logs and DNS logs for threats. Inspector scans EC2 instances, ECR images and Lambda functions for vulnerabilities. Macie finds sensitive data in S3. Security Hub CSPM collects the findings."
    ],
    trap: "Compliance reports about AWS itself (ISO, PCI, SOC) are downloaded from AWS Artifact; AWS Config judges your resources, not AWS. CloudTrail Insights flags unusual API call and error rates; threats such as cryptomining are GuardDuty findings.",
    docs: [
      ["CloudTrail concepts", "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html"],
      ["Remediating noncompliant resources with AWS Config", "https://docs.aws.amazon.com/config/latest/developerguide/remediation.html"],
      ["What is Amazon GuardDuty?", "https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html"]
    ]
  },

  c5e: {
    k: [
      "Read the verb in the requirement. Prevent an action in every member account: an SCP. Detect a wrong setting and correct it: a Config rule with remediation. Prove who made a call: CloudTrail. Notice an attack in progress: GuardDuty.",
      "At the edge the layers stack: Shield covers DDoS at layers 3, 4 and 7, a WAF protection pack (web ACL) on CloudFront or the ALB filters the HTTP(S) requests, and the ALB's HTTPS listener ends TLS; an HTTPS target group encrypts the next hop.",
      "In the data tier, choose a customer managed KMS key when the requirement is to decide who may use the key, to disable it or to use it from another account, and keep the database password in Secrets Manager so that it can rotate.",
      "Auditability is designed too: an organization trail that member accounts cannot change, log file integrity validation, and S3 Object Lock in compliance mode when no user, the root user included, may delete or overwrite the logs."
    ],
    trap: "Controls of different kinds add up; they do not replace each other. Encryption at rest does not force TLS, a detective Config rule does not stop the call the way an SCP does, and a finding from GuardDuty blocks nothing until something reacts to it.",
    docs: [
      ["Control behavior and guidance (AWS Control Tower)", "https://docs.aws.amazon.com/controltower/latest/controlreference/control-behavior.html"],
      ["Locking objects with Object Lock", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html"],
      ["Validating CloudTrail log file integrity", "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html"]
    ]
  },

  l5a: {
    k: [
      "AWS Config works from what its configuration recorder captures: the recorder stores each change to a resource type in scope as a configuration item, and the rules evaluate those configuration settings.",
      "The managed rule <code>required-tags</code> checks that resources carry the tags you specify, up to 6 tags per rule, optionally with expected values. It finds resources that were launched wrongly; it does not prevent their creation.",
      "<code>s3-bucket-versioning-enabled</code> and <code>s3-bucket-server-side-encryption-enabled</code> have the trigger type configuration changes: Config evaluates a bucket when it detects a change to it, not on a timer.",
      "Every S3 bucket now has encryption with S3 managed keys (SSE-S3) by default, so a requirement for KMS keys needs a stricter rule: <code>s3-default-encryption-kms</code> is noncompliant when a bucket is not encrypted with a KMS key."
    ],
    trap: "A Config rule reports a resource after it exists. When the requirement is that an untagged or unencrypted resource can never be created, the answer is a preventive control such as an SCP or an IAM policy condition, not one more Config rule.",
    docs: [
      ["required-tags", "https://docs.aws.amazon.com/config/latest/developerguide/required-tags.html"],
      ["Components of an AWS Config rule", "https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_components.html"],
      ["Setting default server-side encryption behavior for Amazon S3 buckets", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-bucket-encryption.html"]
    ]
  },

  l5b: {
    k: [
      "AWS managed rules are predefined and customizable: you can set the scope that limits which resources trigger an evaluation. Note each rule's trigger type, which is configuration changes, periodic (for example every 24 hours) or both.",
      "Remediation runs a Systems Manager Automation document on the noncompliant resource. Config provides managed automation documents, you can associate your own, and each rule's remediation is set up as manual or automatic.",
      "The Config dashboard is the overview: your resources, rules and conformance packs with their compliance states, and which rules and resources are noncompliant. An aggregator gives that view across accounts and Regions."
    ],
    trap: "Remediation acts after Config has evaluated the resource, so the wrong setting exists for a while. 'Detect and correct automatically' is a Config rule with automatic remediation; 'must never happen' needs a control that denies the call.",
    docs: [
      ["AWS Config managed rules", "https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_use-managed-rules.html"],
      ["Remediating noncompliant resources with AWS Config", "https://docs.aws.amazon.com/config/latest/developerguide/remediation.html"],
      ["Viewing the AWS Config dashboard", "https://docs.aws.amazon.com/config/latest/developerguide/viewing-the-aws-config-dashboard.html"]
    ]
  }
});
