// Key points for the plan steps whose id starts with d4 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d4s2: {
    why: "The command line needs credentials to act as you. One way is a long-term access key kept on your PC: it never expires, and anyone who copies it can use it. Signing in through the browser gives the CLI temporary credentials instead, so nothing permanent sits on disk.",
    k: [
      ["aws login", "AWS recommends <code>aws login</code> for the CLI when you sign in as root, an IAM user or through federation with IAM. The CLI caches the temporary credentials and renews them every 15 minutes. <code>aws logout</code> deletes them."],
      ["aws configure sso", "The IAM Identity Center way. The profile it writes holds no access key, just the start URL, account ID, role name and Region. <code>aws sso login</code> then fetches temporary credentials for that role."],
      ["Long-term access keys", "An IAM user access key has no expiration, so AWS marks long-term credentials for the CLI as not recommended. Retire one by deactivating it, then deleting it once nothing breaks."],
      ["Expired session", "When your session expires, run <code>aws login --profile lab</code> again."]
    ],
    docs: [
      ["Login for AWS local development using console credentials", "https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sign-in.html"],
      ["Configuring IAM Identity Center authentication with the AWS CLI", "https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html"],
      ["Authentication and access credentials for the AWS CLI", "https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html"]
    ]
  },
  d4s3: {
    why: "Several profiles and roles on one PC make it easy to run a command as the wrong identity, or in the wrong account, without noticing. One call tells you who the CLI is acting as before you change anything.",
    k: [
      ["get-caller-identity", "Returns the account, user ID and ARN of the credentials in use. It needs no permissions, so it works even when everything else is denied. Run it whenever you are not sure which identity a profile really uses."]
    ],
    docs: [
      ["GetCallerIdentity (AWS STS API Reference)", "https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html"]
    ]
  },
  d4b1: {
    why: "An IAM user or role may do nothing until a policy allows it, and handing out full access is the easy mistake. A policy is how you state exactly what is allowed: which action, on which resource, under which condition. Writing one by hand for a single action on a single bucket shows how precise that statement has to be.",
    k: [
      ["Statement parts", "Besides Effect, Action and Resource, a statement can carry a Condition that limits when it is in effect. A request is allowed only if some statement explicitly allows it. So a policy that lists one action on one bucket permits nothing else."],
      ["Object ARN or bucket ARN", "<code>s3:GetObject</code> acts on objects, so its Resource is <code>arn:aws:s3:::bucket-name/*</code>. <code>s3:ListBucket</code> acts on the bucket itself and needs <code>arn:aws:s3:::bucket-name</code>. Mixing the two up causes AccessDenied."],
      ["IAM Access Analyzer", "Gets you to least privilege without reading logs by hand. It can generate a policy from the CloudTrail activity of a user or role, and it can validate a policy you wrote."],
      ["Bucket policies", "They use the same grammar plus a Principal. A Deny when <code>aws:SecureTransport</code> is false forces TLS. An Allow limited by <code>aws:PrincipalOrgID</code> opens the bucket only to accounts in your organization."]
    ],
    docs: [
      ["Grant read and write access to Amazon S3 bucket objects", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_rw-bucket.html"],
      ["Examples of Amazon S3 bucket policies", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html"],
      ["Using AWS Identity and Access Management Access Analyzer", "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html"]
    ]
  },
  d4b2: {
    why: "An application on a server needs permission to call AWS, for example to read a bucket. Putting an access key on the server works, but that key is long-term and someone has to manage it. An IAM role gives the application temporary credentials that are renewed for it, so no key is stored on the instance.",
    k: [
      ["Instance profile", "How EC2 receives a role. It is a container for exactly one role, and the console creates it for you. Launching an instance with a role also requires <code>iam:PassRole</code> permission for that role."],
      ["Temporary credentials", "The application gets temporary credentials for the role from the instance metadata service. SDKs and the CLI do this by themselves. The credentials are renewed before they expire, so no key is stored on the instance."],
      ["Require IMDSv2", "The defense against server-side request forgery (SSRF) attacks that try to read the role credentials through the application. IMDSv2 answers only requests that carry a session token obtained with a PUT request."],
      ["Trust policy", "The trust policy of this role names the service <code>ec2.amazonaws.com</code>, so EC2 is the only principal that may assume it. Your own <code>aws sts assume-role</code> call against it is denied until the trust policy says otherwise."]
    ],
    trap: "Storing an access key in Secrets Manager, in user data or in an environment variable still leaves a long-term key to manage. For code on EC2 the most secure answer with the least overhead is an IAM role attached through an instance profile.",
    docs: [
      ["Use an IAM role to grant permissions to applications running on Amazon EC2 instances", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html"],
      ["Use instance profiles", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html"],
      ["Use the Instance Metadata Service to access instance metadata", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html"]
    ]
  },
  d4b3: {
    why: "Sometimes a person or a service needs other permissions for a while: to work in another account, or to do one sensitive task. A second permanent login for each such case would multiply the credentials to guard. A role is a set of permissions that someone you trust takes on for a limited time. Its trust policy names who that is.",
    k: [
      ["Two policies", "A role has two policies. The trust policy says who may assume it. The permissions policy says what the session may do. <code>AssumeRole</code> returns an access key ID, a secret access key and a session token that expire."],
      ["Session", "While you use the role you have its permissions instead of your own. A session lasts one hour by default. It can be set from 15 minutes up to the role's maximum (1 to 12 hours)."],
      ["Role chaining", "Role chaining means using one role to assume a second role. Such a session is capped at one hour."],
      ["Same account or cross-account", "In the same account, a trust policy that trusts the account still needs an IAM policy allowing <code>sts:AssumeRole</code> for the caller. One that names the user itself does not. Across accounts both sides are always required, one in each account."],
      ["External ID", "For a third-party vendor that serves many customers. Trust the vendor's account and require an external ID in the trust policy. That condition is what prevents the confused deputy problem."]
    ],
    trap: "The permissions attached to a role decide what a session can do, never who may start one. When a principal cannot assume a role, look at the trust policy or at the caller's <code>sts:AssumeRole</code> permission. The fix is not in the role's permissions policy.",
    docs: [
      ["IAM roles", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html"],
      ["AssumeRole (AWS STS API Reference)", "https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html"],
      ["The confused deputy problem", "https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html"]
    ]
  },
  d4b6: {
    why: "Resources left over from a build can keep costing money after you have stopped using them. One kind of leftover needs thought before you delete it: an encryption key. Data encrypted under a key cannot be read once the key is gone.",
    k: [
      ["A KMS key stays behind", "Terminating the instance does not remove a customer managed KMS key. If you created one, it stays in place and carries a monthly fee. Before you schedule its deletion, remember that objects encrypted under it become unreadable once the key is gone."]
    ],
    docs: [
      ["Delete an AWS KMS key", "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html"]
    ]
  },
  d4c1: {
    why: "An identity-based policy answers what this user or role may do. A resource-based policy answers who may use this resource, including an identity from another account. A request can meet both, and they can disagree, so you must know how AWS combines them. One rule comes first: an explicit deny always wins.",
    trap: "An option is wrong when a broad Allow such as <code>s3:*</code> outweighs a narrow Deny, or the identity policy outranks the bucket policy. AWS checks all policies for a Deny first. A bucket policy that grants a named account is not public, so Block Public Access can stay on.",
    docs: [
      ["Policy evaluation for requests within a single account", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_policy-eval-basics.html"],
      ["Cross-account policy evaluation logic", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic-cross-account.html"],
      ["Identity-based policies and resource-based policies", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html"]
    ]
  },
  d4c2: {
    why: "In a company with many accounts, the administrators of each account can grant almost anything inside it. Some rules must hold in every account, whatever its administrators decide. A service control policy (SCP) sets that outer limit for the accounts of an organization. It only limits and never grants, and the exam tests exactly that.",
    trap: "An Allow in an SCP gives nobody access: the principal still needs an IAM Allow, so the result is the overlap of both. SCPs also skip the management account, which is why an administrator there can still do what the SCP denies.",
    docs: [
      ["Service control policies (SCPs)", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"],
      ["SCP evaluation", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_evaluation.html"]
    ]
  },
  d4c3: {
    why: "Each of these five services guards against a different kind of threat, and only some of them stop anything. GuardDuty, Inspector and Macie find problems and report them. AWS WAF and Shield stand in the path of traffic and block attacks. A stem names a threat and asks who detects it or who blocks it.",
    k: [
      ["Security Hub CSPM", "One place for the findings. AWS Security Hub CSPM (formerly Security Hub) collects the findings of GuardDuty, Inspector and Macie across accounts. It also runs its own checks against standards such as AWS Foundational Security Best Practices."]
    ],
    trap: "GuardDuty, Inspector and Macie report findings. None of them filters or blocks traffic. Filtering web requests is WAF, and DDoS protection is Shield. An automatic reaction to a finding is an EventBridge rule that triggers a Lambda function.",
    docs: [
      ["AWS WAF", "https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html"],
      ["What is Amazon GuardDuty?", "https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html"],
      ["What is Amazon Inspector?", "https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html"]
    ]
  }
});
