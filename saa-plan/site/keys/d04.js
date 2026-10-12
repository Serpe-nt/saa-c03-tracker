// Key points per plan step for Day 4. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d4w1: {
    k: [
      "AWS secures the facilities, hardware, host OS and virtualization layer. On EC2 you patch the guest OS and configure the security groups; on managed services such as RDS and Lambda AWS patches the OS too. Data, IAM and encryption choices stay yours.",
      "A permissions boundary sets the most an IAM user or role can do. Effective permissions are the overlap of the boundary and the identity policy, and the boundary itself grants nothing. Requiring one on new roles lets teams create roles safely.",
      "IAM Access Analyzer reports resources shared outside your account or organization and can generate a least-privilege policy from CloudTrail activity. The credential report is a CSV of every user's password, MFA and access key status.",
      "KMS <code>Encrypt</code> accepts at most 4,096 bytes; larger data is encrypted locally with a data key from <code>GenerateDataKey</code> (envelope encryption). EBS encryption by default is a per-Region account setting that covers every new volume.",
      "S3 encryption by who holds the key: SSE-S3 (S3, the default), SSE-KMS (a KMS key you control and audit), DSSE-KMS (two layers), SSE-C (your key sent with each request and never stored by S3), client-side (AWS never sees the plaintext)."
    ],
    trap: "Options that keep a long-term secret but handle it more carefully (rotate the access key, store it in Secrets Manager, encrypt the credentials file) lose to an IAM role or IAM Identity Center, which hand out temporary credentials.",
    docs: [
      ["Shared responsibility model", "https://aws.amazon.com/compliance/shared-responsibility-model/"],
      ["Permissions boundaries for IAM entities", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html"],
      ["Protecting data with server-side encryption (Amazon S3)", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/serv-side-encryption.html"]
    ]
  },
  d4p1: {
    k: [
      "Attach policies to a group and manage people through membership. A group holds only users (no roles, no nested groups), a user can be in several groups, and a group cannot be named as the principal in a policy.",
      "IAM users carry long-term credentials; roles are assumed and hand out temporary ones. A workload such as an EC2 instance that talks to RDS or S3 should get a role scoped to the exact actions and resources it needs.",
      "The IAM credential report is one CSV for the whole account that lists each user's password, MFA and access key status with last-used and last-rotated dates. It answers audit questions about credentials in one download."
    ],
    docs: [
      ["IAM user groups", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html"],
      ["Generate credential reports for your AWS account", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_getting-report.html"],
      ["Security best practices in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"]
    ]
  },
  d4s2: {
    k: [
      "<code>aws login</code> signs the CLI in with your console credentials: after a sign-in in the browser it holds temporary credentials and refreshes them for up to 12 hours, so no long-term access key sits on the PC.",
      "A company on IAM Identity Center uses <code>aws configure sso</code> instead. That profile holds no secret, only the portal URL, account ID, role name and Region; <code>aws sso login</code> then fetches short-term credentials.",
      "An IAM user access key has no expiration, which is why AWS marks long-term credentials for the CLI as not recommended. When your session has expired, run <code>aws login --profile lab</code> again."
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
      "Read each statement as Effect, Action, Resource and an optional Condition. A request is allowed only if some statement explicitly allows it, so a policy that lists one action on one bucket permits nothing else.",
      "<code>s3:GetObject</code> acts on objects, so its Resource is <code>arn:aws:s3:::bucket-name/*</code>. <code>s3:ListBucket</code> acts on the bucket itself and needs <code>arn:aws:s3:::bucket-name</code>. Mixing the two up causes AccessDenied.",
      "IAM Access Analyzer can generate a policy from the CloudTrail activity of a user or role and can validate a policy you wrote. That gets you to least privilege without reading logs by hand.",
      "Bucket policies use the same grammar plus a Principal. A Deny when <code>aws:SecureTransport</code> is false forces TLS, and an Allow limited by <code>aws:PrincipalOrgID</code> opens the bucket only to accounts in your organization."
    ],
    docs: [
      ["Example policy: read and write access to objects in an S3 bucket", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_rw-bucket.html"],
      ["Examples of Amazon S3 bucket policies", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html"],
      ["Using IAM Access Analyzer", "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html"]
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
      ["Use an IAM role to grant permissions to applications running on Amazon EC2", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html"],
      ["Use instance profiles", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html"],
      ["Use the Instance Metadata Service to access instance metadata", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html"]
    ]
  },
  d4b3: {
    k: [
      "A role has two policies: the trust policy says who may assume it, the permissions policy says what the session may do. <code>AssumeRole</code> returns an access key ID, a secret access key and a session token that expire.",
      "While you use the role you have its permissions instead of your own. A session lasts from 15 minutes up to the role's maximum (1 to 12 hours), but role chaining, assuming a role from a role session such as your Identity Center profile, is capped at one hour.",
      "In the same account, a trust policy that trusts the account still needs an IAM policy allowing <code>sts:AssumeRole</code> for the caller. Across accounts both sides are always required: the trust policy in one account, the IAM permission in the other.",
      "For a third-party vendor that serves many customers, trust the vendor's account and require an external ID in the trust policy. That condition is what prevents the confused deputy problem."
    ],
    trap: "The permissions attached to a role decide what a session can do, never who may start one. When a principal cannot assume a role, the fix is in the trust policy or in the caller's <code>sts:AssumeRole</code> permission, not in the role's permissions policy.",
    docs: [
      ["IAM roles", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html"],
      ["AssumeRole (AWS STS API Reference)", "https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html"],
      ["The confused deputy problem", "https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html"]
    ]
  },
  d4b4: {
    k: [
      "Only a customer managed key lets you edit the key policy, disable the key, set its rotation and share it with another account. An AWS managed key such as <code>aws/s3</code> has a policy you can read but not change and works only inside your account.",
      "The key policy is the primary access control. Its default statement that gives the account <code>kms:*</code> is what allows IAM policies to grant access; without that statement an IAM Allow for <code>kms:Decrypt</code> has no effect.",
      "With SSE-KMS a download needs <code>s3:GetObject</code> and <code>kms:Decrypt</code>, an upload needs <code>kms:GenerateDataKey</code>, and key use is recorded in CloudTrail. S3 Bucket Keys reduce the KMS requests and their cost on busy buckets.",
      "Automatic rotation is optional, yearly by default and only for symmetric keys; old key material is kept, so existing data still decrypts. Deleting a key is irreversible after a 7 to 30 day waiting period, so disable the key first when unsure."
    ],
    trap: "Resources encrypted under an AWS managed key cannot be shared with another account. To share an encrypted RDS snapshot, copy it under a customer managed key whose key policy allows the other account, then share the copy.",
    docs: [
      ["AWS KMS keys", "https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html"],
      ["Default key policy", "https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-default.html"],
      ["Using server-side encryption with AWS KMS keys (SSE-KMS)", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html"]
    ]
  },
  d4b5: {
    k: [
      "Secrets Manager is built for credentials: it rotates secrets on a schedule, natively for supported databases, and can replicate a secret to other Regions where the replicas follow each rotation. It is billed per secret and per API call.",
      "A Parameter Store SecureString is encrypted with KMS and the standard tier is free, but nothing rotates it. The advanced tier is charged and adds larger values and parameter policies.",
      "Decide by rotation. Credentials that must rotate automatically go to Secrets Manager; configuration values and rarely changing keys that only need encryption go to Parameter Store at the lowest cost."
    ],
    trap: "Rotating a KMS key changes the key material, not the password it protects, and Parameter Store has no rotation of its own. Automatic database password rotation without custom tooling means Secrets Manager.",
    docs: [
      ["What is AWS Secrets Manager?", "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html"],
      ["AWS Systems Manager Parameter Store", "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html"],
      ["Choosing parameter tiers in Parameter Store", "https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-advanced-parameters.html"]
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
    trap: "Options that say one policy type is evaluated first, or that a broad Allow such as <code>s3:*</code> outweighs a narrow Deny, are wrong. Also, a bucket policy that grants a named account is not public access, so Block Public Access can stay on.",
    docs: [
      ["How AWS enforcement code logic evaluates requests", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_policy-eval-basics.html"],
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
    trap: "GuardDuty, Inspector and Macie report findings; none of them filters or blocks traffic. Filtering web requests is WAF, DDoS protection is Shield, and an automatic reaction to a finding is an EventBridge rule that triggers a Lambda function.",
    docs: [
      ["AWS WAF", "https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html"],
      ["What is Amazon GuardDuty?", "https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html"],
      ["What is Amazon Inspector?", "https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html"]
    ]
  }
});
