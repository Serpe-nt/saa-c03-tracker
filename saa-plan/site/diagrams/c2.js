// DATA ONLY: the diagram for lecture course 2 and its labs (format: site/diagram.js, rules: docs/diagrams.md).
window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.c2 = {
  title: "Who may do what in an AWS account",
  why: "Every request to AWS raises two questions: who is asking, and may they do this? This picture shows how an account answers them. The root user is locked away, people work as IAM users in groups, applications and other accounts use roles, and policies decide each request. Below it all, AWS secures the cloud itself.",
  w: 20.4, h: 10.3,
  areas: [
    { id: "acct", label: "Your AWS account (security in the cloud)", x: 0.2, y: 0.2, w: 15.2, h: 7.8 },
    { id: "acct-b", label: "Another AWS account", x: 15.7, y: 0.2, w: 4.5, h: 2.5 },
    { id: "grp", label: "User group", x: 0.4, y: 5.3, w: 4.1, h: 2.5 },
    { id: "aws", label: "AWS's part (security of the cloud)", x: 0.2, y: 8.35, w: 20.0, h: 1.75 }
  ],
  nodes: [
    { id: "root", label: "Root user", x: 0.6, y: 1.0, w: 3.7, h: 1.1 },
    { id: "role", label: "IAM role", x: 5.8, y: 1.0, w: 4.0, h: 1.1 },
    { id: "other", label: "Principal in account B", x: 15.9, y: 1.0, w: 4.15, h: 1.1 },
    { id: "mfa", label: "MFA", x: 0.6, y: 3.3, w: 3.7, h: 1.1 },
    { id: "ec2", label: "Application on EC2", x: 5.8, y: 3.3, w: 4.0, h: 1.1 },
    { id: "s3", label: "S3 bucket", x: 11.3, y: 3.3, w: 3.8, h: 1.1 },
    { id: "users", label: "IAM users", x: 0.7, y: 6.0, w: 3.5, h: 1.1 },
    { id: "policy", label: "Identity-based policy", x: 5.8, y: 6.0, w: 4.0, h: 1.1 },
    { id: "analyzer", label: "IAM Access Analyzer", x: 11.3, y: 6.0, w: 3.8, h: 1.1 },
    { id: "hosts", label: "Hosts, network, facilities", x: 7.6, y: 8.9, w: 5.2, h: 0.95 }
  ],
  links: [
    ["mfa", "root", "sign-in"],
    ["mfa", "users"],
    ["policy", "grp", "attached"],
    ["other", "role", "AssumeRole"],
    ["ec2", "role", "assumes"],
    ["ec2", "s3", "reads"],
    ["analyzer", "policy", "generates"]
  ],
  parts: {
    root: {
      name: "Root user",
      why: "The root user can do anything in the account, including closing it. You cannot attach identity-based policies or a permissions boundary to it, so it is guarded with MFA and kept out of daily use.",
      k: [
        ["Only a few tasks", "Root is required for only a short list of tasks, such as closing the account or changing the root email address and password."],
        ["No access keys", "Do not create access keys for the root user. Create a separate administrative user for everyday tasks."],
        ["In an organization", "SCPs restrict a member account's root user, and its credentials can be removed centrally."]
      ],
      trap: "'Rotate the root access keys every 90 days' and 'share the root password between admins' sound like good hygiene but are wrong. The right choices are MFA on root, no root access keys and a separate identity for daily work.",
      tags: ["Root user & MFA"]
    },
    mfa: {
      name: "Multi-factor authentication",
      why: "A stolen password alone should not be enough to get in. With MFA the password is not enough to sign in. AWS requires it for the root user, and advises it wherever IAM users are still needed.",
      k: [
        ["A second device", "The root user and each IAM user can register up to eight MFA devices. Register a second one, so that a lost phone does not lock you out."],
        ["Requiring MFA", "To demand MFA for a sensitive action, deny it under <code>BoolIfExists</code> with <code>aws:MultiFactorAuthPresent</code> set to false. That also blocks long-term access keys."],
        ["MFA on the CLI", "CLI users get MFA-backed temporary credentials with <code>GetSessionToken</code>."]
      ],
      tags: ["Root user & MFA"]
    },
    users: {
      name: "IAM users in a user group",
      why: "Giving permissions to people one at a time does not scale. A user group lets you manage people by the job they do: attach the policies to the group, then add and remove its members.",
      k: [
        ["A new user has nothing", "A new IAM user has no permissions at all. A user added to a group automatically has that group's permissions."],
        ["Groups hold users only", "Groups cannot be nested, and a group cannot be named as a Principal in a policy. A user can belong to several groups."],
        ["Signing in", "IAM users sign in at the account's own sign-in URL with a user name and password. The root user signs in with the account's email address."]
      ],
      trap: "An application on EC2 or a principal from another account cannot join a group. It should not get an IAM user with access keys either: it assumes a role and works with temporary credentials.",
      tags: ["IAM policies"]
    },
    policy: {
      name: "Identity-based policy",
      why: "Each person should be able to do their job and nothing more. An identity-based policy attaches to a user, group or role and states what that principal can do. Anything no statement allows stays denied.",
      k: [
        ["How a request is decided", "Requests are denied by default. An Allow grants access, and an explicit Deny in any applicable policy overrides every Allow."],
        ["Three kinds", "AWS managed: created by AWS, not editable by you. Customer managed: yours to change and reuse. Inline: embedded in exactly one user, group or role."],
        ["Least privilege", "AWS managed policies are a starting point, but they may grant more than your case needs. Reduce the permissions further with customer managed policies."]
      ],
      trap: "Permissions boundaries and SCPs never grant anything. They only limit, so a principal can do only what both its identity policy and the limit allow.",
      tags: ["IAM policies"]
    },
    role: {
      name: "IAM role",
      why: "Applications and people from other accounts need permissions too, and a stored long-term key can leak. A role has no long-term credentials: whoever is allowed to assume it gets temporary security credentials for the session.",
      k: [
        ["Two policies", "The trust policy says who may assume the role. The permissions policy says what the session may do."],
        ["Session", "<code>AssumeRole</code> returns credentials that expire. A session lasts one hour by default and can be set up to the role's maximum, 1 to 12 hours."],
        ["Who uses roles", "Applications on EC2, users from another account and federated users. None of them needs a stored access key."]
      ],
      trap: "While you use a role you have its permissions instead of your own, not both together.",
      tags: ["IAM roles & cross-account"]
    },
    ec2: {
      name: "Application on EC2",
      why: "Code on a server needs permission to call AWS, for example to read a bucket. An access key on the server is long-term and must be guarded. A role attached through an instance profile gives the code temporary credentials instead.",
      k: [
        ["Instance profile", "How EC2 receives a role. It is a container for exactly one role. Launching an instance with a role also requires <code>iam:PassRole</code> permission for that role."],
        ["No key on disk", "The application gets the role's temporary credentials from the instance metadata service. They are renewed before they expire."],
        ["Trust policy", "The role's trust policy names the service <code>ec2.amazonaws.com</code>, so EC2 is the principal that may assume it."]
      ],
      trap: "An access key kept in Secrets Manager, in user data or in an environment variable is still a long-term key to manage. For code on EC2 the answer is a role attached through an instance profile.",
      tags: ["IAM roles & cross-account"]
    },
    s3: {
      name: "S3 bucket and its bucket policy",
      why: "Sometimes the question is not what a person may do, but who may touch one resource. A resource-based policy, such as an S3 bucket policy, is attached to the resource and names the principals it allows.",
      k: [
        ["Same account", "Inside one account, an Allow in either the identity-based or the resource-based policy is enough."],
        ["Across accounts", "When the caller is in another account, both sides must allow: the caller's identity policy and the bucket policy."],
        ["No role switch", "A resource-based policy can grant cross-account access without the caller switching roles."]
      ],
      trap: "An explicit Deny in the bucket policy overrides an Allow in the caller's identity policy. A Deny in any applicable policy wins.",
      tags: ["IAM policies", "S3 security"]
    },
    other: {
      name: "A principal in another account",
      why: "Someone in another account must work in yours. Handing over access keys would mean sharing a long-term secret. Instead they assume a role in your account and get temporary credentials.",
      k: [
        ["Your side", "The role's trust policy names the other account, or a role in it, as a principal allowed to call <code>sts:AssumeRole</code>."],
        ["Their side", "The caller's own identity policy must allow <code>sts:AssumeRole</code> on that role's ARN."],
        ["Third parties", "A vendor that assumes roles in many customers' accounts gets a unique <code>sts:ExternalId</code> condition in each trust policy. That stops the confused-deputy problem."]
      ],
      tags: ["IAM roles & cross-account"]
    },
    analyzer: {
      name: "IAM Access Analyzer",
      why: "Policies tend to grant more than people really use, and finding the excess by reading logs by hand is slow. IAM Access Analyzer generates a fine-grained policy from the CloudTrail activity of a user or role.",
      k: [
        ["Validate", "It can also validate a policy you wrote."],
        ["Last accessed information", "Shows the permissions and credentials that are no longer needed, so you can remove them."]
      ],
      trap: "An engineer who must look but not change is not served by <code>ReadOnlyAccess</code>, which covers all AWS services. Least privilege names the services and resources of that one job.",
      tags: ["IAM policies"]
    },
    hosts: {
      name: "Shared responsibility",
      why: "When your systems run in someone else's buildings, each side may assume the other secured something. The shared responsibility model draws the line. AWS secures the cloud itself, from the host operating system and virtualization layer down to the facilities.",
      k: [
        ["Your side", "What you run in it: the guest operating system, applications, security groups, data and permissions."],
        ["The line moves", "On EC2 you patch the guest operating system. On RDS and Lambda AWS does that patching, but your data, encryption options and IAM permissions stay yours."],
        ["AWS Artifact", "Where you download AWS's compliance reports, such as SOC and PCI. They cover AWS's side. The controls for what you build on top remain yours."]
      ],
      trap: "'It is a managed service, so AWS secures the data in it' is false. A public bucket or an over-broad IAM policy is on the customer's side.",
      tags: ["Shared responsibility"]
    }
  }
};
