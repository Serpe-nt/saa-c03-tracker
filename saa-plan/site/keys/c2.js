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
    head: "Who is asking, and may they do it: how IAM decides",
    why: "A developer leaves the company, but an access key they made two years ago still sits in a script on an old laptop. Nobody can say what that key may do. Every request to AWS has to answer two questions: who is asking, and are they allowed to do this?",
    idea: "IAM answers both. It holds the identities (users, groups and roles) and the policies that decide what each may do, and it checks every request against them. Day 1 used it for your admin user. This is how it decides.",
    k: [
      ["Root stays out of daily use", "Guard it with MFA and sign in as root only for the tasks that need it. You cannot attach identity-based policies or a permissions boundary to it. In an organization, a member account's root credentials can be removed centrally."],
      ["Users, groups and roles", "An IAM user has long-term credentials. A user group is only a collection of users for sharing permissions. A role has no long-term credentials: whoever may assume it gets temporary security credentials for the session."],
      ["How a request is decided", "Requests are implicitly denied by default (the root user aside). An Allow in an identity-based or a resource-based policy grants access, and inside one account either one is enough. An explicit Deny in any applicable policy overrides every Allow."],
      ["A role has two policies", "The trust policy says who may assume the role. The permissions policy says what the session may do. Roles serve applications on EC2, users from another account and federated users, so none of them needs a stored access key."],
      ["Requiring MFA", "To demand MFA for a sensitive action, deny it under <code>BoolIfExists</code> with <code>aws:MultiFactorAuthPresent</code> set to false. That also blocks long-term access keys. CLI users get MFA-backed temporary credentials with <code>GetSessionToken</code>."]
    ],
    trap: "Permissions boundaries (Day 1) and SCPs never grant anything: they only limit. A principal can do only what both its identity policy and the limit allow. So AdministratorAccess under a boundary that lists only S3 actions can use only S3.",
    q: {
      q: "A bucket policy in one account names the IAM user Lee and allows <code>s3:GetObject</code>. Lee is a user in the same account, and none of Lee's own policies mention S3. No policy denies anything. Can Lee read the bucket's objects?",
      o: [
        "Yes, because inside one account an Allow in either kind of policy is enough",
        "No, because Lee also needs an Allow in an identity-based policy",
        "No, because a bucket policy can grant access only to other accounts",
        "Yes, but only after Lee joins a group whose policy mentions S3"
      ],
      a: [0],
      x: [
        "Right. Requests are denied by default, and inside one account an Allow in an identity-based or a resource-based policy is enough, as long as no policy denies.",
        "That is the rule across accounts, where both sides must allow. Inside one account either policy is enough.",
        "A bucket policy can name principals in its own account too, and its Allow counts like any other.",
        "The bucket policy's Allow already grants access. A group policy would be a second way in, not a requirement."
      ],
      dom: 1, tags: ["IAM policies"], doc: "iam-policy-eval"
    },
    docs: [
      ["Policy evaluation logic", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html"],
      ["IAM roles", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html"],
      ["Secure API access with MFA", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_configure-api-require.html"]
    ]
  },

  l2a: {
    head: "Give each job exactly the access it needs",
    why: "A company gives every new engineer the same broad policy, one person at a time. A year later nobody knows who can delete what, and one stolen password could wipe the production database. Access has to be managed by job rather than by person, and each job should get only what it needs.",
    idea: "User groups let you manage people by the job they do. Least privilege means each job gets only the permissions it needs. The lab has you apply both by hand.",
    k: [
      ["Manage people through groups", "Attach policies to a user group and manage people through membership. A group contains only users, and groups cannot be nested. A user can belong to several groups. A group cannot be named as a Principal in a policy."],
      ["Three kinds of policy", "AWS managed: created and administered by AWS, not editable by you. Customer managed: yours to change, reusable on many identities. Inline: embedded in exactly one user, group or role."],
      ["Least privilege is a process", "AWS managed policies are a starting point, but they serve all customers and may grant more than your case needs. AWS recommends reducing permissions further with customer managed policies."],
      ["Tools that shrink a policy", "IAM Access Analyzer generates a fine-grained policy from the CloudTrail activity of a user or role. Last accessed information shows the permissions and credentials that are no longer needed."]
    ],
    trap: "An engineer who must look but not change is not served by the nearest broad policy. The AWS managed policy <code>ReadOnlyAccess</code> covers all AWS services and resources. Least privilege names the services and resources of that one job.",
    q: {
      q: "Twenty support engineers need the same narrow set of permissions, and that set will change as their job changes. Which setup keeps least privilege with the least effort?",
      o: [
        "A customer managed policy with just those permissions, on a group of all twenty",
        "An inline policy with those permissions, embedded in each engineer's user",
        "The AWS managed ReadOnlyAccess policy, attached to each engineer's user",
        "A bucket policy that names the engineers' user group as its Principal"
      ],
      a: [0],
      x: [
        "Right. The group lets you manage the engineers through membership, and a customer managed policy is yours to change in one place as the job changes.",
        "An inline policy is embedded in exactly one identity, so every change would have to be made twenty times.",
        "ReadOnlyAccess covers all AWS services and resources, far more than one narrow job needs.",
        "A group cannot be named as a Principal in a policy, and a bucket policy would cover only one bucket anyway."
      ],
      dom: 1, tags: ["IAM policies"], doc: "iam-managed-policies"
    },
    docs: [
      ["IAM user groups", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html"],
      ["Managed policies and inline policies", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html"],
      ["Security best practices in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"]
    ]
  },

  l2b: {
    head: "A new user starts with nothing: permissions arrive through policies",
    why: "You create a user for a new colleague and send them the sign-in link. An hour later they call: every page they open says access denied. You need to see where a user's permissions come from, so that you can give exactly the ones the job needs.",
    idea: "The lab has you create users and groups by hand. It shows that a new user starts with no permissions at all, and that everything they can do arrives through a policy.",
    k: [
      ["A new user has nothing", "By default a new IAM user has no permissions to do anything. Permissions arrive through policies. A user added to a group automatically has that group's permissions."],
      ["Where a group's permissions come from", "From managed policies attached to it and from inline policies embedded in it. Each statement allows the listed actions on the listed resources. Anything that no statement allows stays denied."],
      ["Where IAM users sign in", "At the account's own URL, <code>https://account-id.signin.aws.amazon.com/console/</code>, with a user name and password. An account alias can replace the account ID in it. The root user signs in with the account's email address."],
      ["Several groups add up", "A user who belongs to several groups receives the permissions of all of them. The policies are evaluated together: one Allow is enough, and an explicit Deny in any of them overrides it."]
    ],
    trap: "Groups hold users only. An application on EC2 or a principal from another account cannot join one. It should not get an IAM user with access keys either: it assumes a role and works with temporary credentials.",
    q: {
      q: "The user Kim belongs to two groups. One group's policy allows starting and stopping EC2 instances, the other's allows reading S3 objects. Kim has no other policies. Kim tries to delete an S3 bucket. What happens?",
      o: [
        "It is denied, because no policy that applies to Kim allows deleting buckets",
        "It succeeds, because two groups give a user full access to both services",
        "It succeeds, because read access to S3 includes managing the bucket itself",
        "It is denied, because the two groups' policies conflict with each other"
      ],
      a: [0],
      x: [
        "Right. Kim receives the permissions of both groups and nothing more. Anything that no statement allows stays denied.",
        "The groups' policies add up, but each allows only the actions it lists. Neither lists deleting a bucket.",
        "Each statement allows only the listed actions on the listed resources. Reading objects does not include deleting the bucket.",
        "Policies from several groups do not conflict: they are evaluated together. The request fails because none of them allows it."
      ],
      dom: 1, tags: ["IAM policies"], doc: "iam"
    },
    docs: [
      ["IAM users", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html"],
      ["IAM user groups", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html"],
      ["How IAM users sign in to AWS", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_sign-in.html"]
    ]
  }
});
