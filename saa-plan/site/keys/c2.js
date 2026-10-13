// Key points per plan step for the course "Fundamentals of Security on AWS" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c2a: {
    why: "When your systems run in someone else's buildings, it must be clear who secures what. Otherwise each side assumes the other did it. The shared responsibility model draws that line between AWS and you. Where the line runs depends on how much of the stack the service manages for you.",
    k: [
      ["The line moves", "Where the line sits depends on the service. On EC2 you manage the guest operating system with its security patches, your applications and the security group. For abstracted services such as S3 and DynamoDB, AWS operates the operating system and platform."],
      ["RDS and Lambda", "On RDS AWS does the operating system and database software patching. On Lambda AWS manages the underlying infrastructure, including server maintenance and patching. Your code and data, the encryption options and the IAM permissions stay yours."],
      ["Three kinds of control", "Inherited from AWS: physical and environmental. Shared: patch management, configuration management, awareness and training, where each side handles its own layer. Customer specific: such as zone security."],
      ["AWS Artifact", "Where you download AWS's security and compliance documents on demand, such as SOC and PCI reports. They cover AWS's side. Compliance is shared, and the controls for what you build on top remain yours to implement."],
      ["Security pillar", "Turns 'security first' into design principles: a strong identity foundation with least privilege, traceability, security at all layers, automated controls, data protected in transit and at rest, people kept away from data."]
    ],
    trap: "'It is a managed service, so AWS secures the data in it' is false. A bucket made public, an over-broad IAM policy or an unpatched EC2 guest operating system is on the customer's side. Amazon Inspector only reports the vulnerability. You apply the patch.",
    docs: [
      ["Shared responsibility model", "https://aws.amazon.com/compliance/shared-responsibility-model/"],
      ["What is AWS Artifact?", "https://docs.aws.amazon.com/artifact/latest/ug/what-is-aws-artifact.html"],
      ["Security pillar design principles", "https://docs.aws.amazon.com/wellarchitected/latest/framework/sec-design.html"]
    ]
  },

  c2b: {
    why: "Every request to AWS raises two questions: who is asking, and may they do this? If nothing answered them, anyone who got into the account could do anything in it. IAM holds the identities (users, groups and roles) and the policies that decide what each of them may do.",
    k: [
      ["Root user", "Guard it with MFA and keep it out of daily use, because you cannot attach identity-based policies or a permissions boundary to it. In an organization, SCPs restrict a member account's root user, and its credentials can be removed centrally."],
      ["User, group, role", "An IAM user has long-term credentials. A user group is only a collection of users for sharing permissions. A role has no long-term credentials: whoever is allowed to assume it gets temporary security credentials for the session."],
      ["How a request is decided", "Requests are implicitly denied by default (the root user aside). An Allow in an identity-based or a resource-based policy grants access, and inside one account either one is enough. An explicit Deny in any applicable policy overrides every Allow."],
      ["A role's two policies", "The trust policy says who may assume the role. The permissions policy says what the session may do."],
      ["Who uses roles", "Roles serve applications on EC2, users from another account and federated users, so none of them needs a stored access key."],
      ["Requiring MFA", "To demand MFA for a sensitive action, deny it under <code>BoolIfExists</code> with <code>aws:MultiFactorAuthPresent</code> set to false. That also blocks long-term access keys. CLI users get MFA-backed temporary credentials with <code>GetSessionToken</code>."]
    ],
    trap: "Permissions boundaries and SCPs never grant anything. They only limit. A principal can do only what both its identity policy and the limit allow, so AdministratorAccess under a boundary that lists only S3 actions can use only S3.",
    docs: [
      ["Policy evaluation logic", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html"],
      ["IAM roles", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html"],
      ["Secure API access with MFA", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_configure-api-require.html"]
    ]
  },

  l2a: {
    why: "Giving permissions to people one at a time does not scale. A policy that is too broad lets one mistake or one stolen password do more damage. User groups let you manage people by the job they do. Least privilege means each job gets only what it needs. The lab has you do both by hand.",
    k: [
      ["User groups", "Attach policies to a user group and manage people through membership. A group contains only users, and groups cannot be nested. A user can belong to several groups. A group cannot be named as a Principal in a policy."],
      ["Three kinds of policy", "AWS managed: created and administered by AWS, not editable by you. Customer managed: yours to change, reusable on many identities. Inline: embedded in exactly one user, group or role."],
      ["Least privilege", "It is a process. AWS managed policies are a starting point, but they serve all customers and may grant more than your case needs. AWS recommends reducing permissions further with customer managed policies."],
      ["Tools that shrink a policy", "IAM Access Analyzer generates a fine-grained policy from the CloudTrail activity of a user or role. Last accessed information shows the permissions and credentials that are no longer needed."]
    ],
    trap: "An engineer who must look but not change is not served by the nearest broad policy. The AWS managed policy <code>ReadOnlyAccess</code> covers all AWS services and resources. Least privilege names the services and resources of that one job.",
    docs: [
      ["IAM user groups", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html"],
      ["Managed policies and inline policies", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html"],
      ["Security best practices in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"]
    ]
  },

  l2b: {
    why: "A new person in the account should be able to do their job and nothing else. Creating users and groups by hand shows that a user starts with no permissions at all, and that everything they can do arrives through a policy.",
    k: [
      ["A new user has nothing", "By default a new IAM user has no permissions to do anything. Permissions arrive through policies. A user added to a group automatically has that group's permissions."],
      ["Where a group's permissions come from", "From managed policies attached to it and from inline policies embedded in it. Each statement allows the listed actions on the listed resources. Anything that no statement allows stays denied."],
      ["Signing in", "IAM users sign in at the account's own URL, <code>https://account-id.signin.aws.amazon.com/console/</code>, with a user name and password. An account alias can replace the account ID in it. The root user signs in with the account's email address."],
      ["Several groups", "A user who belongs to several groups receives the permissions of all of them. The policies are evaluated together: one Allow is enough, and an explicit Deny in any of them overrides it."]
    ],
    trap: "Groups hold users only. An application on EC2 or a principal from another account cannot join a group, and should not get an IAM user with access keys either: it assumes a role and works with temporary credentials.",
    docs: [
      ["IAM users", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html"],
      ["IAM user groups", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html"],
      ["How IAM users sign in to AWS", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_sign-in.html"]
    ]
  }
});
