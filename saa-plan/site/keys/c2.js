// Key points per plan step for the course "Fundamentals of Security on AWS" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c2a: {
    head: "Who secures what: the shared responsibility model",
    why: "You move your web shop to AWS. A month later customer files leak from a storage bucket that anyone could open. You thought AWS secures everything in its cloud, and AWS expected you to lock your own bucket. When your systems run in someone else's buildings, both sides must know exactly who secures what.",
    idea: "The shared responsibility model draws that line. AWS is responsible for security of the cloud: the hardware, software, networking and facilities that run its services. You are responsible for security in the cloud, and how much that is depends on how much of the stack the service manages for you.",
    k: [
      ["The line depends on the service", "On EC2 you manage the guest operating system with its security patches, your applications and the security group. For abstracted services such as S3 and DynamoDB, AWS operates the operating system and platform."],
      ["Managed services take on more", "On RDS, AWS patches the operating system and the database software. On Lambda, AWS manages the underlying infrastructure, including server maintenance and patching."],
      ["What always stays yours", "On every service, your data and its encryption options stay yours. So do the IAM permissions that decide who reaches it, and your own code, on Lambda as on EC2."],
      ["Who owns each kind of control", "Physical and environmental controls you inherit from AWS. Patch management, configuration management, and awareness and training are shared: each side handles its own layer. Some are yours alone, such as keeping data in the security zones you choose."],
      ["Proof of AWS's side", "Auditors want evidence that the part AWS runs is compliant. AWS Artifact gives you AWS's security and compliance reports, such as SOC and PCI, on demand. They cover only AWS's side."],
      ["Security pillar", "Well-Architected's advice for designing securely, in seven principles: a strong identity foundation, traceability, security at all layers, automated security, data protected in transit and at rest, people kept away from data, and readiness for security events."]
    ],
    trap: "'It is a managed service, so AWS secures the data in it' is false. A bucket made public, an over-broad IAM policy or an unpatched EC2 guest operating system is on the customer's side.",
    q: {
      q: "A company moves its orders table to Amazon DynamoDB, so AWS now runs the servers and the database software. Which responsibility stays with the company?",
      o: [
        "Deciding with IAM permissions who may read the table, and choosing its encryption options",
        "Patching the operating system of the servers that store the table",
        "Upgrading the database software that runs the table to a newer version",
        "Securing the network hardware inside the AWS data centers"
      ],
      a: [0],
      x: [
        "Right. On abstracted services such as DynamoDB you manage your data, including its encryption options, and use IAM to decide who may reach it.",
        "For abstracted services such as S3 and DynamoDB, AWS operates the operating system and the platform.",
        "The database software is part of the platform AWS operates for an abstracted service, so there is no engine for you to upgrade.",
        "Network hardware and facilities are part of the security of the cloud, which is AWS's side."
      ],
      dom: 1, tags: ["Shared responsibility"], doc: "shared"
    },
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
