// Key points for the plan steps whose id starts with d1 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d1a1: {
    why: "Everything you build in AWS lives in an account, and whoever holds its first login controls all of it. The email address and password you choose now are that login. A weak password or a mailbox other people can open puts the whole account at risk.",
    k: [
      ["Root user credentials", "The email address and password you enter here become the root user credentials. The root user is the one identity with complete access to every service and resource in the account. Use a unique password and a mailbox only you control."]
    ],
    docs: [["AWS account root user", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html"]]
  },

  d1a2: {
    why: "A learning account should not be able to run up a bill by accident. The Free plan gives that protection, but it has limits, and a few actions move the account to the Paid plan automatically. Knowing them keeps the surprise bill away.",
    k: [
      ["When the plan ends", "A Free plan account closes automatically when the plan period ends or the credits are used up, whichever comes first. Upgrading to the Paid plan keeps the account and its resources."],
      ["What upgrades the account", "Setting up an AWS Control Tower landing zone upgrades the account to the Paid plan, just as joining an organization does."],
      ["No commitment discounts", "The Free plan gives no access to Savings Plans or Reserved Instances, so you study those without buying one."]
    ],
    docs: [["Choosing a plan (Free or Paid)", "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html"]]
  },

  d1b1: {
    why: "The root user can do anything in the account, including closing it. A stolen root password is therefore the worst thing that can happen to the account. With MFA the password alone is not enough to sign in, and a separate user for daily work keeps root out of everyday use.",
    k: [
      ["Tasks that need root", "Root is required for only a short list of tasks. In a standalone account these include closing the account and changing the root email address, root password or root access keys."],
      ["No root access keys", "Do not create access keys for the root user. AWS's advice is to create a separate administrative user for everyday tasks. Sign in as root only for the tasks that require it."],
      ["A second MFA device", "The root user can hold up to eight MFA devices. Register a second one now, so that a lost phone does not lock you out of the account."]
    ],
    trap: "'Rotate the root access keys every 90 days' and 'share the root password between admins' sound like good hygiene but are wrong. Correct choices are MFA on root, no root access keys and a separate identity for daily work.",
    docs: [
      ["Root user best practices", "https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html"],
      ["Tasks that require root user credentials", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html"]
    ]
  },

  d1b2: {
    why: "AWS runs in many separate Regions, and the console shows only what is in the Region you selected. Work in several by accident and resources seem to vanish while they keep costing money. Staying in one Region avoids that. For a real workload the choice of Region follows a few clear factors.",
    k: [
      ["Four factors", "Four factors decide a Region: compliance, latency to your users, availability of the services and features you need, and price. A data residency rule overrides the other three."],
      ["One Region at a time", "The console lists only the resources of the selected Region. Regions are isolated from each other, and AWS does not replicate resources across them automatically."],
      ["Price", "Prices differ between Regions. Some work is not sensitive to network latency, such as analytics or high performance computing. If it also has no residency rule, pick the lowest-cost Region that offers the needed services."]
    ],
    trap: "A stem that names a law or a regulator fixes the Region, whatever the price or service list. Adding CloudFront does not move the data: edge locations hold cached copies, and the definitive version stays at the origin in its Region.",
    docs: [
      ["Regions and Zones", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"],
      ["What to consider when selecting a Region", "https://aws.amazon.com/blogs/architecture/what-to-consider-when-selecting-a-region-for-your-workloads/"],
      ["What is Amazon CloudFront?", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html"]
    ]
  },

  d1c1: {
    why: "A company has many people and many AWS accounts. Giving each person a separate user and password in every account is slow, easy to get wrong and hard to undo when someone leaves. IAM Identity Center gives each person one sign-in for every account and application assigned to them.",
    k: [
      ["One sign-in", "IAM Identity Center is the AWS service for workforce access. People sign in once at the AWS access portal and reach every account and application assigned to them."],
      ["Organization instance", "Permission sets and access to AWS accounts need an organization instance. In a standalone account, enabling one creates an AWS Organization with your account as its management account. An account instance cannot assign account access."],
      ["Where users live", "Users can live in Identity Center's own directory or be synchronized from an existing identity provider. That gives a company one point of federation for all its accounts."],
      ["Temporary credentials", "Access works by assuming a role, so users get temporary credentials. AWS recommends this for human users instead of IAM users with long-term access keys."]
    ],
    trap: "Amazon Cognito is the usual distractor. It is an identity platform for the users of your own web and mobile apps. Employees who need access to AWS accounts belong in IAM Identity Center.",
    docs: [
      ["What is IAM Identity Center?", "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html"],
      ["Enable IAM Identity Center", "https://docs.aws.amazon.com/singlesignon/latest/userguide/enable-identity-center.html"],
      ["Security best practices in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"]
    ]
  },

  d1u1: {
    why: "If you sign in as the root user for daily work, every slip or leaked password hits the identity that can do anything. You need a personal login with its own credentials instead. In a single learning account that login is an IAM user.",
    k: [
      ["IAM user", "An identity inside one account with its own long-lived password and, optionally, access keys. AWS recommends federation with temporary credentials for people, and IAM users only where federation does not fit."],
      ["Only the credentials needed", "Create only the credentials a user needs. Someone who works only in the console gets a password and no access keys."]
    ],
    trap: "On the exam an IAM user per person is usually the distractor. For employees the expected answer is IAM Identity Center or federation with temporary credentials. You use an IAM user here only to keep a single learning account on the Free plan.",
    docs: [
      ["Create an IAM user in your AWS account", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html"],
      ["Security best practices in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"]
    ]
  },

  d1u2: {
    why: "Permissions attached to each user one by one drift apart over time, until nobody can say who is allowed to do what. A group holds the permissions once, and users get them by being members. That is why even a single admin user goes into a group.",
    k: [
      ["Groups carry the permissions", "AWS recommends putting IAM users in groups and managing permissions through policies attached to the groups. When a person changes jobs you move them to another group instead of editing that user's permissions."],
      ["Permissions boundary", "Sets the maximum permissions a user can have and grants nothing by itself. Do not confuse it with a group policy, which does grant."]
    ],
    docs: [
      ["Create an IAM user in your AWS account", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html"],
      ["IAM user groups", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html"]
    ]
  },

  d1u3: {
    why: "A password can be guessed, reused or phished, and an administrator's password opens the whole account. MFA asks for a second proof that a thief who has only the password cannot give.",
    k: [
      ["Which MFA", "AWS recommends a passkey or security key for MFA wherever possible, and an authenticator app otherwise. Register more than one MFA device, so that a lost device does not lock you out."]
    ],
    docs: [["Assign a virtual MFA device in the console", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_virtual.html"]]
  },

  d1u4: {
    why: "An IAM user belongs to one account. So the sign-in page must know which account you mean before it can check your name and password. The account's own sign-in URL carries that information. Saving it means you never have to look up the account ID to sign in.",
    k: [
      ["Three things to sign in", "An IAM user signs in with the account ID or account alias, the user name and the password. The account's own sign-in URL carries the first of them, and an alias can stand in for the ID in that URL."]
    ],
    docs: [["How IAM users sign in to AWS", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_sign-in.html"]]
  },

  d1c3: {
    why: "The same job, such as administrator, needs the same permissions in every account a company owns. Creating and updating a matching role by hand in each account does not scale. A permission set is the definition written once, from which Identity Center creates the role in each account.",
    k: [
      ["Permission set", "A template of one or more IAM policies. It grants nothing until it is assigned to a user or group for a specific account."],
      ["It becomes a role", "On assignment, Identity Center creates an IAM role in that account, attaches the set's policies and lets the assigned users assume it. Edit the set and those roles are updated for you."],
      ["Session duration", "A property of the permission set: one hour by default, 12 hours at most."],
      ["More than one set", "AWS suggests adding a narrower set such as PowerUserAccess next to AdministratorAccess. At sign-in you choose the least privileged one that can do the task."]
    ],
    trap: "A permission set is neither a group nor a service control policy (SCP). A group collects users. An SCP only caps the permissions available in an organization's accounts and grants nothing. The permission set becomes the role you assume.",
    docs: [
      ["Manage AWS accounts with permission sets", "https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html"],
      ["Service control policies (SCPs)", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"]
    ]
  },

  d1c4: {
    why: "A user and a permission set give nobody access yet. Someone must say who gets which permissions in which account, and be able to change that in one place when people move. An assignment is that link: a user or group, an account and a permission set.",
    k: [
      ["Assign to groups", "AWS recommends assigning access to groups rather than to individual users. A person who moves to another team is moved to another group and receives that group's access, with nothing to edit per user."],
      ["Many accounts, many sets", "The same permission set can be assigned in many accounts, and one user can hold several sets in one account. Each one appears in the access portal as a separate role to choose."]
    ],
    trap: "For many engineers and several accounts, the wrong options create IAM users with access keys in every account or one shared user per team. Central assignment of permission sets from Identity Center is the low-overhead answer.",
    docs: [
      ["Manage AWS accounts with permission sets", "https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html"],
      ["Assign user or group access to AWS accounts", "https://docs.aws.amazon.com/singlesignon/latest/userguide/assignusers.html"]
    ]
  },

  d1c5: {
    why: "Long-lived passwords and access keys get copied, forgotten and leaked, and each one keeps working until someone removes it. The access portal avoids them. A person signs in at one address, picks an account and a role, and receives temporary credentials.",
    k: [
      ["CLI with Identity Center", "<code>aws configure sso</code> creates a profile. <code>aws sso login</code> then requests and retrieves temporary credentials through Identity Center, so its users need no long-term access keys."],
      ["Root stays out of daily work", "AWS strongly recommends not using the root user for everyday tasks. Keep its credentials safe and sign in as root only for the tasks that require it."]
    ],
    trap: "When a stem asks for short-lived credentials, an IAM user with administrator access keys is wrong even though it works. So are root access keys. An Identity Center user with a permission set is the match.",
    docs: [
      ["Configuring IAM Identity Center authentication with the AWS CLI", "https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html"],
      ["AWS account root user", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html"]
    ]
  },

  d1d1: {
    why: "A forgotten resource keeps costing money, and without an alert you learn about it only from the bill. AWS Budgets watches your spending against a limit you set. It notifies you when the limit is crossed, or is forecast to be.",
    k: [
      ["Actual or forecasted", "AWS Budgets can alert on actual spend (already accrued) or on forecasted spend. It can notify email addresses, an Amazon SNS topic or both."],
      ["Budget actions", "For going beyond an alert. At a threshold an action can apply an IAM policy or a service control policy, or target specific EC2 or RDS instances. It runs automatically or after your approval."],
      ["Not only cost", "Budgets also track usage, and the utilization and coverage of Reserved Instances and Savings Plans."],
      ["Forecasts need history", "AWS requires about five weeks of usage data before it can produce a budget forecast. So a new account relies on actual-spend alerts."]
    ],
    trap: "Cost Explorer is for viewing, analyzing and forecasting. Cost Anomaly Detection uses machine learning to spot unusual patterns. A fixed limit with a notification or an automatic block points to AWS Budgets.",
    docs: [
      ["Managing your costs with AWS Budgets", "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html"],
      ["Configuring budget actions", "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-controls.html"],
      ["Best practices for AWS Budgets", "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-best-practices.html"]
    ]
  },

  d1c6: {
    why: "Three kinds of location answer three different needs. A Region decides where your data lives, which is what a residency rule is about. A second Availability Zone in the same Region protects against the failure of a data center. Edge locations hold cached copies. A stem names one of these needs, and the right location follows.",
    k: [
      ["AZ names or AZ IDs", "An AZ name such as us-east-1a can point to different physical zones in different accounts (older Regions, accounts created before November 2025). To line up resources across accounts, compare AZ IDs such as <code>use1-az1</code>."]
    ],
    trap: "Decide which failure the stem describes. A data center or AZ failure is solved inside one Region with a second AZ. Residency or a Regional outage is a Region decision. An edge location holds cached copies and is not a place to run EC2 instances.",
    docs: [
      ["Regions and Zones", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"],
      ["AZ IDs", "https://docs.aws.amazon.com/global-infrastructure/latest/regions/az-ids.html"],
      ["AWS Regions and Availability Zones", "https://aws.amazon.com/about-aws/global-infrastructure/regions_az/"]
    ]
  },

  d1c7: {
    why: "The same instance can be paid for in several ways. Each way gives something, such as a lower price or hardware dedicated to you. Each also asks for something in return, such as a commitment or the risk of interruption. The exam describes how long and how steadily a workload runs, and whether it may be interrupted. That description picks the option.",
    trap: "'Most cost-effective' does not always mean Spot or the longest commitment. Rule out Spot when the work must not be interrupted. Rule out one- or three-year terms when the workload lasts weeks or its future is unknown.",
    docs: [
      ["Amazon EC2 billing and purchasing options", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html"],
      ["Savings Plans types", "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html"],
      ["On-Demand Capacity Reservations", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html"]
    ]
  },

  d1c8: {
    why: "Code can run on a server you manage, or in a container whose servers AWS manages. It can also be a function that runs only when an event arrives. Each answers a different need: control of the operating system, containers without servers to manage, or short event-driven work. How long the work runs and how much control it needs decide.",
    trap: "'No servers to manage' does not automatically mean Lambda. A container that runs for hours fits ECS on Fargate. Elastic Beanstalk still provisions EC2 instances or an EKS cluster in your account, so it is not the least-overhead choice for short event-driven work.",
    docs: [
      ["Lambda quotas", "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html"],
      ["Architect for AWS Fargate for Amazon ECS", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html"],
      ["What is AWS Elastic Beanstalk?", "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html"]
    ]
  }
});
