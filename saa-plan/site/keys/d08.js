// Key points per plan step for Day 8. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d8e1: {
    why: "A security requirement can be met at the wrong layer. A network rule is used where an identity rule was needed, or encryption where an access rule was needed. Then the system looks protected and is not. Domain 1 tests whether you place each control at the layer where the requirement lives.",
    k: [
      ["Weight", "Domain 1 carries 30% of the scored content, the largest share of the four domains."],
      ["Three task statements", "Secure access to AWS resources (1.1), secure workloads and applications (1.2) and data security controls (1.3)."],
      ["Name the layer first", "For each scenario, name the layer the requirement lives in. Identity: IAM policy, service control policy (SCP). Network: security group, network ACL, endpoint, firewall. Data: KMS key, resource policy, Object Lock. The right option works at that layer."]
    ],
    docs: [
      ["SAA-C03 exam guide: Domain 1", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain1.html"]
    ]
  },
  d8e2: {
    why: "When access is designed badly, people and programs hold more rights than their job needs, and long-lived keys sit in code where they leak. One stolen key then opens far more than it should. This task tests whether you can give each person and workload only the access it needs, across many accounts, without handing out permanent credentials.",
    k: [
      ["Service control policy (SCP)", "Caps member accounts and never grants. A call needs an allow from the SCPs and from an identity or resource policy. A deny on a condition such as <code>aws:RequestedRegion</code> or a missing <code>aws:RequestTag</code> binds even administrators there."],
      ["Roles for workloads", "Workloads get roles, never access keys. Use one ECS task role per service. Use IAM Roles Anywhere for on-premises servers that hold X.509 certificates from your CA. Use IAM database authentication (tokens valid 15 minutes) in place of an RDS password."],
      ["Cross-account: policy or role", "A resource-based policy such as a bucket policy lets the caller keep its own permissions. Assuming a role in the other account replaces them for that session. So one set of credentials cannot use resources in both accounts."],
      ["Require MFA", "A deny when <code>aws:MultiFactorAuthPresent</code> is false forces MFA on API calls. Write it with <code>BoolIfExists</code>, as access keys lack the key."],
      ["Tags and endpoints", "Matching principal and resource tags gives attribute-based access control (ABAC). <code>aws:SourceVpce</code> pins a bucket to one VPC endpoint."],
      ["Control Tower, Access Analyzer", "Control Tower builds a multi-account landing zone with preventive and detective controls, and Account Factory for new accounts. IAM Access Analyzer, with the organization as its zone of trust, reports resources shared with outside principals."]
    ],
    trap: "Prevent or block in every account means a preventive control such as an SCP. AWS Config rules, GuardDuty and Access Analyzer are detective: they report what already exists. Leaked role credentials work until they expire unless you revoke the role's active sessions.",
    docs: [
      ["Service control policies (SCPs)", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"],
      ["Cross account resource access in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies-cross-account-resource-access.html"],
      ["Secure API access with MFA", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_configure-api-require.html"]
    ]
  },
  d8e3: {
    why: "A workload that is open on the wrong port, reachable from the wrong network or unprotected against web attacks gets found and abused. Each kind of traffic needs its own kind of guard. This task tests whether you can put the right protection in front of each tier and keep private things off the internet.",
    k: [
      ["Security group or network ACL", "To let one tier reach another, reference the source tier's security group in the rule. That survives IP changes. To block a CIDR, add a network ACL deny numbered lower than the allow. NACLs are stateless, so return traffic needs its own rule."],
      ["Gateway or interface endpoint", "Only S3 and DynamoDB have gateway endpoints. Other services use interface endpoints with private DNS and a security group that allows HTTPS. An endpoint policy with <code>aws:ResourceOrgID</code> blocks copies to buckets outside your organization."],
      ["Firewall by traffic type", "AWS WAF for HTTP(S) on CloudFront, ALB and API Gateway: managed rule groups, rate-based rules. Network Firewall for VPC traffic: domain filtering, Suricata IPS rules. DNS Firewall for queries sent to the VPC Resolver."],
      ["Managed security services", "Firewall Manager applies WAF rules across an organization, new accounts and resources included. GuardDuty detects threats and can scan new S3 uploads for malware. Macie finds sensitive data in S3. Inspector finds software vulnerabilities."],
      ["Private S3 content", "Keep S3 content private behind CloudFront with origin access control. That also works with SSE-KMS once the key policy allows the distribution. The other way is to hand out expiring presigned URLs."],
      ["Session Manager", "Gives shell access with no inbound ports, no bastion and no SSH keys."]
    ],
    trap: "AWS WAF cannot protect a Network Load Balancer, and security groups cannot deny. GuardDuty, Macie and Inspector report, and none of them blocks traffic. Flow Logs record addresses, ports and accept or reject, not the payload. So an IDS appliance needs VPC Traffic Mirroring.",
    docs: [
      ["Infrastructure security in Amazon VPC (security groups compared with network ACLs)", "https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html"],
      ["Gateway endpoints", "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html"],
      ["Resources that you can protect with AWS WAF", "https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works-resources.html"]
    ]
  },
  d8e4: {
    why: "Data must stay unreadable to anyone who gets hold of the disk, the bucket or the network link. Some records must also be impossible to delete, or they prove nothing to an auditor. This task tests whether you can choose who controls the key, protect data at rest and in transit, and lock what must be kept.",
    k: [
      ["Customer managed KMS key", "Take one whenever the key policy must change: key access separate from bucket access, cross-account use, or letting S3 send events to an encrypted SQS queue. With it you write the key policy, audit key use and control rotation."],
      ["Envelope encryption", "KMS encrypts at most 4 KB, so bigger data uses envelope encryption (<code>GenerateDataKey</code>)."],
      ["Who may use a key, and where", "Cross-account use needs the key policy and the caller's IAM policy. <code>kms:ViaService</code> ties a key to one service. A multi-Region key decrypts in its replica Regions."],
      ["Settings cover new data only", "Default bucket encryption and EBS encryption by default (set per Region) leave existing objects and volumes untouched. S3 Batch Operations converts existing objects. SSE-S3 to SSE-KMS now works in place, with no copy."],
      ["Object Lock", "Compliance mode cannot be bypassed by anyone, root included. Governance mode can, with <code>s3:BypassGovernanceRetention</code>. A legal hold has no end date. AWS Backup Vault Lock offers the same two modes for recovery points."],
      ["TLS on every hop", "Use an HTTPS listener plus an HTTPS target group. Deny in the bucket policy when <code>aws:SecureTransport</code> is false. Set <code>rds.force_ssl</code> on RDS for PostgreSQL (the default from version 15). ACM renews only certificates it issued."]
    ],
    trap: "S3 Bucket Keys only cut KMS request cost. Key rotation re-encrypts nothing. Default encryption covers new objects only. None of them fixes an access error. S3 replication skips SSE-KMS objects until the rule opts in. Single-tenant HSMs or PKCS#11 mean CloudHSM.",
    docs: [
      ["AWS KMS keys (customer managed, AWS managed, AWS owned)", "https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html"],
      ["Locking objects with Object Lock", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html"],
      ["Updating server-side encryption for existing data", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/update-sse-encryption.html"]
    ]
  },
  d8e5: {
    why: "Reading the reviews feels like knowing the material, but only questions show whether you can apply it to a scenario. These exam-style questions give you that test for Domain 1. The score matters less than finding the phrase that decided each question.",
    k: [
      ["Name the phrase that rules it out", "For every option you reject, name the phrase in the stem that rules it out. For example, \"including account administrators\" rules out IAM policies and permissions boundaries. Review a lucky guess the same way as a miss."]
    ]
  },
  d8e6: {
    why: "A fact you only recognise when you see it is not yet a fact you can recall in the exam. Flashcards make you pull the answer out of memory. Without that practice, much of what the reviews taught is hard to find again when a question needs it.",
    k: [
      ["Answer aloud first", "Say the answer aloud before you reveal it. Only then do you know whether you could recall it."],
      ["One-line rule per miss", "Turn every card you miss into a one-line rule in your notes, for example \"block a CIDR: network ACL deny, because a security group cannot deny\". Reread those rules before tonight's quiz."]
    ]
  },
  d8b1: {
    why: "Instances in a private subnet still need S3, and you still need a way to log in to them. A NAT gateway and a bastion host answer that with extra cost and an open port. VPC endpoints give a private path to those services instead. Writing the network as Terraform code lets you build it the same way every time and delete it when you are done.",
    k: [
      ["S3 gateway endpoint", "It is only a route: AWS adds the S3 prefix list as a destination in each route table you select, at no additional charge. It does not use PrivateLink. Instance security groups must still allow outbound traffic to that prefix list."],
      ["Interface endpoint", "Each one is a network interface in your subnets. Its security group must allow inbound 443 from the instances. Private DNS works only when DNS hostnames and DNS resolution are enabled on the VPC."],
      ["Session Manager", "Replaces a bastion host, because it needs no inbound rule. It needs the <code>ssm</code> and <code>ssmmessages</code> endpoints (plus <code>ec2messages</code> for SSM Agent before 3.3.40.0) and an instance profile with Systems Manager permissions."],
      ["Terraform state", "State can expose sensitive information, and this repository is public. Keep <code>*.tfstate</code> and <code>.terraform/</code> out of Git."],
      ["Credentials for Terraform", "AWS's Terraform guidance says to avoid static access keys when you run it locally, so use the named profile."]
    ],
    docs: [
      ["Gateway endpoints for Amazon S3", "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"],
      ["VPC endpoints for Systems Manager", "https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-create-vpc.html"],
      ["Security best practices for the Terraform AWS Provider", "https://docs.aws.amazon.com/prescriptive-guidance/latest/terraform-aws-provider-best-practices/security.html"]
    ]
  },
  d8c1: {
    why: "An app must first know who its user is, and may then need to let that user call AWS directly. Those are two needs: a user pool signs users in, an identity pool hands out AWS credentials. Your own workforce signing in is a third need, answered by IAM Identity Center. The exam names the need and you pick the service.",
    trap: "A user pool only signs users in and issues tokens. It hands out no AWS credentials. Direct calls to S3 or DynamoDB from the app also need an identity pool. IAM Identity Center serves your workforce, so it is the wrong answer for an app's customers.",
    docs: [
      ["What is Amazon Cognito? (user pools compared with identity pools)", "https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html"],
      ["What is IAM Identity Center?", "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html"]
    ]
  },
  d8c2: {
    why: "Resources often live in one account and the people or programs that need them in another. Copying long-term keys between accounts is the unsafe way to bridge that. A role whose trust policy names who may assume it lets the other account in for a session. An external ID covers the case where a third party works in your account for you.",
    trap: "The external ID is not a password: it only stops a third party from being tricked into using your role. Assuming a role replaces your own permissions for the session. A KMS key in another account needs its key policy plus your IAM policy.",
    docs: [
      ["The confused deputy problem", "https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html"],
      ["Cross account resource access in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies-cross-account-resource-access.html"],
      ["Allowing users in other accounts to use a KMS key", "https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html"]
    ]
  },
  d8c3: {
    why: "Data can be read by the wrong person in two places: where it is stored and while it travels. Protecting one does nothing for the other, so each has its own tool: KMS keys at rest, TLS certificates in transit. Web attacks are a third problem, and the web firewall that stops them can only be attached to certain resources.",
    trap: "Encryption at rest never enforces TLS. A certificate on the load balancer leaves the hop to the targets in plain HTTP unless the target group uses HTTPS. ACM does not renew imported certificates. A web ACL cannot be attached to a Network Load Balancer.",
    docs: [
      ["Managed certificate renewal in ACM", "https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html"],
      ["Requirements for using SSL/TLS certificates with CloudFront", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html"],
      ["Resources that you can protect with AWS WAF", "https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works-resources.html"]
    ]
  }
});
