// Key points per plan step for Day 8. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d8e1: {
    k: [
      "Domain 1 carries 30% of the scored content, the largest share of the four domains. Its three task statements cover secure access to AWS resources (1.1), secure workloads and applications (1.2) and data security controls (1.3).",
      "For each scenario, first name the layer the requirement lives in: identity (IAM policy, SCP), network (security group, network ACL, endpoint, firewall) or data (KMS key, resource policy, Object Lock). The right option works at that layer."
    ],
    docs: [
      ["SAA-C03 exam guide: Domain 1", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain1.html"]
    ]
  },
  d8e2: {
    k: [
      "SCPs cap member accounts and never grant: a call needs an allow from the SCPs and from an identity or resource policy. An SCP deny on a condition such as <code>aws:RequestedRegion</code> or a missing <code>aws:RequestTag</code> binds even administrators there.",
      "Workloads get roles, never access keys: one ECS task role per service, IAM Roles Anywhere for on-premises servers that hold X.509 certificates from your CA, and IAM database authentication (tokens valid 15 minutes) in place of an RDS password.",
      "Across accounts, a resource-based policy such as a bucket policy lets the caller keep its own permissions. Assuming a role in the other account replaces them for that session, so one set of credentials cannot use resources in both accounts.",
      "A deny when <code>aws:MultiFactorAuthPresent</code> is false (with <code>BoolIfExists</code>, as access keys lack the key) forces MFA on API calls. Matching principal and resource tags gives ABAC. <code>aws:SourceVpce</code> pins a bucket to one VPC endpoint.",
      "Control Tower builds a multi-account landing zone with preventive and detective controls and Account Factory for new accounts. IAM Access Analyzer, with the organization as its zone of trust, reports resources shared with outside principals."
    ],
    trap: "Prevent or block in every account means a preventive control such as an SCP; AWS Config rules, GuardDuty and Access Analyzer find a problem only after it exists. Leaked role credentials are stopped with Revoke active sessions, not by shortening the session duration.",
    docs: [
      ["Service control policies (SCPs)", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"],
      ["Cross account resource access in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies-cross-account-resource-access.html"],
      ["Secure API access with MFA", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_configure-api-require.html"]
    ]
  },
  d8e3: {
    k: [
      "Let one tier reach another by referencing the source tier's security group in the rule, which survives IP changes. To block a CIDR, add a network ACL deny numbered lower than the allow; NACLs are stateless, so return traffic needs its own rule.",
      "Only S3 and DynamoDB have gateway endpoints; other services use interface endpoints with private DNS and a security group that allows HTTPS. An endpoint policy with <code>aws:ResourceOrgID</code> blocks copies to buckets outside your organization.",
      "Pick the firewall by traffic type: AWS WAF for HTTP(S) on CloudFront, ALB and API Gateway (managed rule groups, rate-based rules), Network Firewall for VPC traffic (domain filtering, Suricata IPS rules), DNS Firewall for queries sent to the VPC Resolver.",
      "Firewall Manager applies WAF rules across an organization, new accounts and resources included. GuardDuty detects threats and can scan new S3 uploads for malware, Macie finds sensitive data in S3, Inspector finds software vulnerabilities.",
      "Keep S3 content private behind CloudFront with origin access control, which also works with SSE-KMS once the key policy allows the distribution, or hand out expiring presigned URLs. Session Manager gives shell access with no inbound ports, bastion or SSH keys."
    ],
    trap: "AWS WAF cannot protect a Network Load Balancer and security groups cannot deny. GuardDuty, Macie and Inspector report; none of them blocks traffic. Flow Logs describe traffic but hold no packet contents, so an IDS appliance needs VPC Traffic Mirroring.",
    docs: [
      ["Infrastructure security in Amazon VPC (security groups compared with network ACLs)", "https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html"],
      ["Gateway endpoints", "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html"],
      ["Resources that you can protect with AWS WAF", "https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works-resources.html"]
    ]
  },
  d8e4: {
    k: [
      "With a customer managed KMS key you write the key policy, audit key use and control rotation. Take one whenever the key policy must change: key access separate from bucket access, cross-account use, or letting S3 send events to an encrypted SQS queue.",
      "KMS encrypts at most 4 KB, so bigger data uses envelope encryption (GenerateDataKey). Cross-account use needs the key policy and the caller's IAM policy. <code>kms:ViaService</code> ties a key to one service; a multi-Region key decrypts in its replica Regions.",
      "Encryption settings act on new data only: default bucket encryption and EBS encryption by default (set per Region) leave existing objects and volumes untouched. Convert existing S3 objects with an S3 Batch Operations job.",
      "Object Lock compliance mode cannot be bypassed by anyone, root included; governance mode can, with <code>s3:BypassGovernanceRetention</code>; a legal hold has no end date. AWS Backup Vault Lock offers the same two modes for recovery points.",
      "Encryption in transit has to be enforced: an HTTPS listener plus an HTTPS target group for every hop, a bucket policy deny when <code>aws:SecureTransport</code> is false, <code>rds.force_ssl</code> on RDS for PostgreSQL. ACM renews only certificates it issued."
    ],
    trap: "S3 Bucket Keys only cut KMS request cost, key rotation re-encrypts nothing and default encryption covers new objects only; none fixes an access error. S3 replication skips SSE-KMS objects until the rule opts in. Single-tenant HSMs or PKCS#11 mean CloudHSM.",
    docs: [
      ["AWS KMS keys (customer managed, AWS managed, AWS owned)", "https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html"],
      ["Locking objects with Object Lock", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html"],
      ["Updating server-side encryption for existing data", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/update-sse-encryption.html"]
    ]
  },
  d8e5: {
    k: [
      "For every option you reject, name the phrase in the stem that rules it out, for example \"including account administrators\" rules out IAM policies and permissions boundaries. Review a lucky guess the same way as a miss."
    ]
  },
  d8e6: {
    k: [
      "Say the answer aloud before you reveal it. Turn every card you miss into a one-line rule in your notes, for example \"block a CIDR: network ACL deny, because a security group cannot deny\", and reread those rules before tonight's quiz."
    ]
  },
  d8b1: {
    k: [
      "The S3 gateway endpoint is only a route: AWS adds the S3 prefix list as a destination in each route table you select, at no additional charge. It does not use PrivateLink, and instance security groups must still allow outbound traffic to that prefix list.",
      "Each interface endpoint is a network interface in your subnets. Its security group must allow inbound 443 from the instances, and private DNS works only when DNS hostnames and DNS resolution are enabled on the VPC.",
      "Session Manager needs the <code>ssm</code> and <code>ssmmessages</code> endpoints (plus <code>ec2messages</code> for SSM Agent before 3.3.40.0), an instance profile with Systems Manager permissions and no inbound rule, which is why it replaces a bastion host.",
      "Terraform state can hold sensitive values and this repository is public: keep <code>*.tfstate</code> and <code>.terraform/</code> out of Git, and never commit access keys. Run Terraform with the named profile, not with keys written into the code."
    ],
    docs: [
      ["Gateway endpoints for Amazon S3", "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"],
      ["VPC endpoints for Systems Manager", "https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-create-vpc.html"],
      ["AWS Systems Manager Session Manager", "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html"]
    ]
  },
  d8c1: {
    trap: "A user pool only signs users in and issues tokens; it hands out no AWS credentials. Direct calls to S3 or DynamoDB from the app also need an identity pool. IAM Identity Center serves your workforce, so it is the wrong answer for an app's customers.",
    docs: [
      ["What is Amazon Cognito? (user pools compared with identity pools)", "https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html"],
      ["What is IAM Identity Center?", "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html"]
    ]
  },
  d8c2: {
    trap: "The external ID is not a password: it only stops a third party from being tricked into using your role. Assuming a role replaces your own permissions for the session, and a KMS key in another account needs its key policy plus your IAM policy.",
    docs: [
      ["The confused deputy problem", "https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html"],
      ["Cross account resource access in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies-cross-account-resource-access.html"],
      ["Allowing users in other accounts to use a KMS key", "https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html"]
    ]
  },
  d8c3: {
    trap: "Encryption at rest never enforces TLS, and a certificate on the load balancer leaves the hop to the targets in plain HTTP unless the target group uses HTTPS. ACM does not renew imported certificates. A web ACL cannot be attached to a Network Load Balancer.",
    docs: [
      ["Managed certificate renewal in ACM", "https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html"],
      ["Requirements for using SSL/TLS certificates with CloudFront", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html"],
      ["Resources that you can protect with AWS WAF", "https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works-resources.html"]
    ]
  }
});
