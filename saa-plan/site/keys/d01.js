// Key points per plan step for Day 1. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d1a1: {
    k: [
      "The email address and password you enter here become the root user credentials, the one identity with complete access to every service and resource in the account. Use a unique password and a mailbox only you control."
    ],
    docs: [["AWS account root user", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html"]]
  },

  d1a2: {
    k: [
      "A Free plan account closes automatically when the plan period ends or the credits are used up, whichever comes first. Upgrading to the Paid plan keeps the account and its resources.",
      "Setting up an AWS Control Tower landing zone upgrades the account to the Paid plan just as joining an organization does. The Free plan also gives no access to Savings Plans or Reserved Instances, so you study those without buying one."
    ],
    docs: [["Choosing a plan (Free or Paid)", "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html"]]
  },

  d1b1: {
    k: [
      "Root is required for only a short list of tasks. In a standalone account these include closing the account and changing the root email address, root password or root access keys.",
      "Do not create access keys for the root user. AWS's advice is to create a separate administrative user for everyday tasks and to sign in as root only for the tasks that require it.",
      "The root user can hold up to eight MFA devices. Register a second one now, so that a lost phone does not lock you out of the account."
    ],
    trap: "Answers such as 'rotate the root access keys every 90 days' or 'share the root password between admins' sound like good hygiene but are wrong. Correct choices are MFA on root, no root access keys and a separate identity for daily work.",
    docs: [
      ["Root user best practices", "https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html"],
      ["Tasks that require root user credentials", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html"]
    ]
  },

  d1b2: {
    k: [
      "Four factors decide a Region: compliance, latency to your users, availability of the services and features you need, and price. A data residency rule overrides the other three.",
      "The console lists only the resources of the selected Region. Regions are isolated from each other and AWS does not replicate resources across them automatically.",
      "Prices differ between Regions. For work that is not sensitive to network latency, such as analytics or high performance computing, and has no residency rule, pick the lowest-cost Region that offers the needed services."
    ],
    trap: "A stem that names a law or a regulator fixes the Region, whatever the price or service list. Adding CloudFront does not move the data: edge locations hold cached copies, and the definitive version stays at the origin in its Region.",
    docs: [
      ["Regions and Zones", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"],
      ["What to consider when selecting a Region", "https://aws.amazon.com/blogs/architecture/what-to-consider-when-selecting-a-region-for-your-workloads/"],
      ["What is Amazon CloudFront?", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html"]
    ]
  },

  d1c1: {
    k: [
      "IAM Identity Center is the AWS service for workforce access. People sign in once at the AWS access portal and reach every account and application assigned to them.",
      "Permission sets and access to AWS accounts need an organization instance. In a standalone account, enabling one creates an AWS Organization with your account as its management account; an account instance cannot assign account access.",
      "Users can live in Identity Center's own directory or be synchronized from an existing identity provider, which gives a company one point of federation for all its accounts.",
      "Access works by assuming a role, so users get temporary credentials. AWS recommends this for human users instead of IAM users with long-term access keys."
    ],
    trap: "Amazon Cognito is the usual distractor. It is an identity platform for the users of your own web and mobile apps; employees who need access to AWS accounts belong in IAM Identity Center.",
    docs: [
      ["What is IAM Identity Center?", "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html"],
      ["Enable IAM Identity Center", "https://docs.aws.amazon.com/singlesignon/latest/userguide/enable-identity-center.html"],
      ["Security best practices in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"]
    ]
  },

  d1u1: {
    k: [
      "An IAM user is an identity inside one account with its own long-lived password and, optionally, access keys. AWS recommends federation with temporary credentials for people and IAM users only where federation does not fit.",
      "Create only the credentials a user needs: someone who works only in the console gets a password and no access keys."
    ],
    trap: "On the exam an IAM user per person is usually the distractor: for employees the expected answer is IAM Identity Center or federation with temporary credentials. You use an IAM user here only to keep a single learning account on the Free plan.",
    docs: [
      ["Create an IAM user in your AWS account", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html"],
      ["Security best practices in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"]
    ]
  },

  d1u2: {
    k: [
      "AWS recommends putting IAM users in groups and managing permissions through policies attached to the groups. When a person changes jobs you move them to another group instead of editing that user's permissions.",
      "A permissions boundary sets the maximum permissions a user can have and grants nothing by itself. Do not confuse it with a group policy, which does grant."
    ],
    docs: [
      ["Create an IAM user in your AWS account", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html"],
      ["IAM user groups", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html"]
    ]
  },

  d1u3: {
    k: [
      "AWS recommends a passkey or security key for MFA wherever possible, an authenticator app otherwise, and registering more than one MFA device so that a lost device does not lock you out."
    ],
    docs: [["Assign a virtual MFA device in the console", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_virtual.html"]]
  },

  d1u4: {
    k: [
      "An IAM user signs in with three things: the account ID or account alias, the user name and the password. The account's own sign-in URL carries the first of them, and an alias can stand in for the ID in that URL."
    ],
    docs: [["How IAM users sign in to AWS", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_sign-in.html"]]
  },

  d1c3: {
    k: [
      "A permission set is a template of one or more IAM policies. It grants nothing until it is assigned to a user or group for a specific account.",
      "On assignment, Identity Center creates an IAM role in that account, attaches the set's policies and lets the assigned users assume it. Edit the set and those roles are updated for you.",
      "The session duration is a property of the permission set: one hour by default, 12 hours at most.",
      "AWS suggests adding a narrower set such as PowerUserAccess next to AdministratorAccess and choosing, at sign-in, the least privileged one that can do the task."
    ],
    trap: "A permission set is neither a group nor a service control policy. A group collects users; an SCP only caps the permissions available in an organization's accounts and grants nothing; the permission set becomes the role you assume.",
    docs: [
      ["Manage AWS accounts with permission sets", "https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html"],
      ["Service control policies (SCPs)", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"]
    ]
  },

  d1c4: {
    k: [
      "AWS recommends assigning access to groups rather than to individual users. A person who moves to another team is moved to another group and receives that group's access, with nothing to edit per user.",
      "The same permission set can be assigned in many accounts, and one user can hold several sets in one account. Each one appears in the access portal as a separate role to choose."
    ],
    trap: "For many engineers and several accounts, the wrong options create IAM users with access keys in every account or one shared user per team. Central assignment of permission sets from Identity Center is the low-overhead answer.",
    docs: [
      ["Manage AWS accounts with permission sets", "https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html"],
      ["Assign user or group access to AWS accounts", "https://docs.aws.amazon.com/singlesignon/latest/userguide/assignusers.html"]
    ]
  },

  d1c5: {
    k: [
      "For the AWS CLI, <code>aws configure sso</code> creates a profile and <code>aws sso login</code> requests and retrieves temporary credentials through Identity Center, so its users need no long-term access keys.",
      "AWS strongly recommends not using the root user for everyday tasks. Keep its credentials safe and sign in as root only for the tasks that require it."
    ],
    trap: "When a stem asks for short-lived credentials, an IAM user with administrator access keys is wrong even though it works, and so are root access keys. An Identity Center user with a permission set is the match.",
    docs: [
      ["Configuring IAM Identity Center authentication with the AWS CLI", "https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html"],
      ["AWS account root user", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html"]
    ]
  },

  d1d1: {
    k: [
      "AWS Budgets can alert on actual spend (already accrued) or on forecasted spend, and can notify email addresses, an Amazon SNS topic or both.",
      "A budget action goes beyond alerting: at a threshold it can apply an IAM policy or a service control policy, or target specific EC2 or RDS instances, automatically or after your approval.",
      "Budgets are not only for cost. They also track usage, and the utilization and coverage of Reserved Instances and Savings Plans.",
      "Forecast alerts need history: AWS requires about five weeks of usage data before it can produce a budget forecast, so a new account relies on actual-spend alerts."
    ],
    trap: "Cost Explorer is for viewing, analyzing and forecasting; Cost Anomaly Detection uses machine learning to spot unusual patterns. A fixed limit with a notification or an automatic block points to AWS Budgets.",
    docs: [
      ["Managing your costs with AWS Budgets", "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html"],
      ["Configuring budget actions", "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-controls.html"],
      ["Best practices for AWS Budgets", "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-best-practices.html"]
    ]
  },








  d1c6: {
    k: [
      "An AZ name such as us-east-1a can point to different physical zones in different accounts (older Regions, accounts created before November 2025). To line up resources across accounts, compare AZ IDs such as <code>use1-az1</code>."
    ],
    trap: "Decide which failure the stem describes. A data center or AZ failure is solved inside one Region with a second AZ; residency or a Regional outage is a Region decision. An edge location holds cached copies; it is not a place to run EC2 instances.",
    docs: [
      ["Regions and Zones", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"],
      ["AZ IDs", "https://docs.aws.amazon.com/global-infrastructure/latest/regions/az-ids.html"],
      ["AWS Regions and Availability Zones", "https://aws.amazon.com/about-aws/global-infrastructure/regions_az/"]
    ]
  },

  d1c7: {
    trap: "'Most cost-effective' does not always mean Spot or the longest commitment. Rule out Spot when the work must not be interrupted, and rule out one- or three-year terms when the workload lasts weeks or its future is unknown.",
    docs: [
      ["Amazon EC2 billing and purchasing options", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html"],
      ["Savings Plans types", "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html"],
      ["On-Demand Capacity Reservations", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html"]
    ]
  },

  d1c8: {
    trap: "'No servers to manage' does not automatically mean Lambda. A container that runs for hours fits ECS on Fargate, and Elastic Beanstalk still provisions EC2 instances or an EKS cluster in your account, so it is not the least-overhead choice for short event-driven work.",
    docs: [
      ["Lambda quotas", "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html"],
      ["Architect for AWS Fargate for Amazon ECS", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html"],
      ["What is AWS Elastic Beanstalk?", "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html"]
    ]
  }
});
