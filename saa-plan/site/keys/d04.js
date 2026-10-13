// Key points per plan step for Day 4. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d4s2: {
    k: [
      "AWS recommends <code>aws login</code> for the CLI when you sign in as root, an IAM user or through federation with IAM. The CLI caches the temporary credentials, renews them every 15 minutes, and <code>aws logout</code> deletes them.",
      "<code>aws configure sso</code> is the IAM Identity Center way. The profile it writes holds no access key, just the start URL, account ID, role name and Region; <code>aws sso login</code> then fetches temporary credentials for that role.",
      "An IAM user access key has no expiration, so AWS marks long-term credentials for the CLI as not recommended. Retire one by deactivating it, then deleting it once nothing breaks. When your session expires, run <code>aws login --profile lab</code> again."
    ],
    docs: [
      ["Login for AWS local development using console credentials", "https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sign-in.html"],
      ["Configuring IAM Identity Center authentication with the AWS CLI", "https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html"],
      ["Authentication and access credentials for the AWS CLI", "https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html"]
    ]
  },
  d4s3: {
    k: [
      "<code>get-caller-identity</code> returns the account, user ID and ARN of the credentials in use and needs no permissions, so it works even when everything else is denied. Run it whenever you are not sure which identity a profile really uses."
    ],
    docs: [
      ["GetCallerIdentity (AWS STS API Reference)", "https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html"]
    ]
  },
  d4b1: {
    k: [
      "Besides Effect, Action and Resource, a statement can carry a Condition that limits when it is in effect. A request is allowed only if some statement explicitly allows it, so a policy that lists one action on one bucket permits nothing else.",
      "<code>s3:GetObject</code> acts on objects, so its Resource is <code>arn:aws:s3:::bucket-name/*</code>. <code>s3:ListBucket</code> acts on the bucket itself and needs <code>arn:aws:s3:::bucket-name</code>. Mixing the two up causes AccessDenied.",
      "IAM Access Analyzer can generate a policy from the CloudTrail activity of a user or role and can validate a policy you wrote. That gets you to least privilege without reading logs by hand.",
      "Bucket policies use the same grammar plus a Principal. A Deny when <code>aws:SecureTransport</code> is false forces TLS, and an Allow limited by <code>aws:PrincipalOrgID</code> opens the bucket only to accounts in your organization."
    ],
    docs: [
      ["Grant read and write access to Amazon S3 bucket objects", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_rw-bucket.html"],
      ["Examples of Amazon S3 bucket policies", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html"],
      ["Using AWS Identity and Access Management Access Analyzer", "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html"]
    ]
  },
  d4b2: {
    k: [
      "EC2 receives a role through an instance profile, a container for exactly one role that the console creates for you. Launching an instance with a role also requires <code>iam:PassRole</code> permission for that role.",
      "The application gets temporary credentials for the role from the instance metadata service. SDKs and the CLI do this by themselves and the credentials are renewed before they expire, so no key is stored on the instance.",
      "Require IMDSv2 on instances. It answers only requests that carry a session token obtained with a PUT request, which is the defense against SSRF attacks that try to read the role credentials through the application.",
      "The trust policy of this role names the service <code>ec2.amazonaws.com</code>, so EC2 is the only principal that may assume it. Your own <code>aws sts assume-role</code> call against it is denied until the trust policy says otherwise."
    ],
    trap: "Storing an access key in Secrets Manager, in user data or in an environment variable still leaves a long-term key to manage. For code on EC2 the most secure answer with the least overhead is an IAM role attached through an instance profile.",
    docs: [
      ["Use an IAM role to grant permissions to applications running on Amazon EC2 instances", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html"],
      ["Use instance profiles", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html"],
      ["Use the Instance Metadata Service to access instance metadata", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html"]
    ]
  },
  d4b3: {
    k: [
      "A role has two policies: the trust policy says who may assume it, the permissions policy says what the session may do. <code>AssumeRole</code> returns an access key ID, a secret access key and a session token that expire.",
      "While you use the role you have its permissions instead of your own. A session lasts one hour by default and can be set from 15 minutes up to the role's maximum (1 to 12 hours), but role chaining, using one role to assume a second role, is capped at one hour.",
      "In the same account, a trust policy that trusts the account still needs an IAM policy allowing <code>sts:AssumeRole</code> for the caller; one that names the user itself does not. Across accounts both sides are always required, one in each account.",
      "For a third-party vendor that serves many customers, trust the vendor's account and require an external ID in the trust policy. That condition is what prevents the confused deputy problem."
    ],
    trap: "The permissions attached to a role decide what a session can do, never who may start one. When a principal cannot assume a role, the fix is in the trust policy or in the caller's <code>sts:AssumeRole</code> permission, not in the role's permissions policy.",
    docs: [
      ["IAM roles", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html"],
      ["AssumeRole (AWS STS API Reference)", "https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html"],
      ["The confused deputy problem", "https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html"]
    ]
  },
  d4b6: {
    k: [
      "Terminating the instance leaves the customer managed key from the KMS step in place, and it carries a monthly fee. Before you schedule its deletion, remember that objects encrypted under it become unreadable once the key is gone."
    ],
    docs: [
      ["Delete an AWS KMS key", "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html"]
    ]
  },
  d4c1: {
    trap: "An option where a broad Allow such as <code>s3:*</code> outweighs a narrow Deny, or the identity policy outranks the bucket policy, is wrong: AWS checks all policies for a Deny first. A bucket policy that grants a named account is not public, so Block Public Access can stay on.",
    docs: [
      ["Policy evaluation for requests within a single account", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_policy-eval-basics.html"],
      ["Cross-account policy evaluation logic", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic-cross-account.html"],
      ["Identity-based policies and resource-based policies", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html"]
    ]
  },
  d4c2: {
    trap: "An Allow in an SCP gives nobody access: the principal still needs an IAM Allow, so the result is the overlap of both. SCPs also skip the management account, which is why an administrator there can still do what the SCP denies.",
    docs: [
      ["Service control policies (SCPs)", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"],
      ["SCP evaluation", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_evaluation.html"]
    ]
  },
  d4c3: {
    k: [
      "AWS Security Hub CSPM (formerly Security Hub) collects the findings of GuardDuty, Inspector and Macie across accounts in one place and runs its own checks against standards such as AWS Foundational Security Best Practices."
    ],
    trap: "GuardDuty, Inspector and Macie report findings; none of them filters or blocks traffic. Filtering web requests is WAF, DDoS protection is Shield, and an automatic reaction to a finding is an EventBridge rule that triggers a Lambda function.",
    docs: [
      ["AWS WAF", "https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html"],
      ["What is Amazon GuardDuty?", "https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html"],
      ["What is Amazon Inspector?", "https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html"]
    ]
  }
});
