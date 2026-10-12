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

  d1w1: {
    k: [
      "AWS secures the cloud itself: facilities, hardware, the host operating system and the virtualization layer. You secure what you put in it: your data, your configuration and who has access.",
      "Your share shrinks as the service gets more managed. On EC2 you patch the guest operating system and configure security groups; on S3 or DynamoDB AWS runs the operating system and the platform.",
      "Some duties never move to AWS: managing your data and its encryption options, and applying the right IAM permissions. On Lambda AWS patches and scales the servers, but the code and its permissions are yours.",
      "Patching is a shared control. AWS patches and fixes flaws in the infrastructure; you patch your guest operating systems and applications.",
      "The cloud trades fixed expense for variable expense and ends capacity guessing: you pay only for what you consume and can scale up or down within minutes."
    ],
    trap: "'It is a managed service, so AWS secures the data in it' is false. A bucket made public, an over-broad IAM policy or an unpatched EC2 guest operating system is always on the customer's side of the line.",
    docs: [
      ["Shared responsibility model", "https://aws.amazon.com/compliance/shared-responsibility-model/"],
      ["Six advantages of cloud computing", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html"]
    ]
  },

  d1w2: {
    k: [
      "Match the instance family to the bottleneck: C (compute optimized) for CPU-bound work, R and X (memory optimized) for large in-memory data, I and D (storage optimized) for local disk I/O, P and G (accelerated) for GPUs, M when balanced.",
      "T instances are burstable general purpose: a CPU baseline with the ability to burst above it. They are the low-cost fit for workloads that sit idle most of the time and spike briefly.",
      "Read the workload pattern: steady for one or three years means Savings Plans or Reserved Instances; short, unpredictable and uninterruptible means On-Demand; interruptible and fault-tolerant means Spot.",
      "Compute Savings Plans follow you across instance family, size, Region, operating system and tenancy and also cover Fargate and Lambda. EC2 Instance Savings Plans discount more but bind you to one family in one Region.",
      "Capacity in a specific AZ is reserved by zonal Reserved Instances and On-Demand Capacity Reservations. Regional Reserved Instances and Savings Plans are billing discounts and reserve no capacity."
    ],
    trap: "Two pairs get swapped. Dedicated Hosts show sockets and cores for per-socket or per-core licences, while Dedicated Instances only keep other accounts off the hardware. Savings Plans commit to an hourly spend, Reserved Instances to an instance configuration.",
    docs: [
      ["Amazon EC2 instance types", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html"],
      ["Amazon EC2 billing and purchasing options", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html"],
      ["Savings Plans types", "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html"]
    ]
  },

  d1w3: {
    k: [
      "Lambda runs code in response to events from S3, API Gateway, SQS, EventBridge and other services, with no servers to manage and pay-per-use billing. One invocation runs for up to 15 minutes (90 on Lambda Managed Instances when invoked asynchronously).",
      "Fargate is serverless compute for containers and works with both ECS and EKS. You state CPU and memory per task or pod and never provision, configure or scale the virtual machines underneath.",
      "ECS is AWS's own container orchestrator. EKS is managed Kubernetes and is certified conformant, so existing Kubernetes applications and community tooling move over without refactoring.",
      "Elastic Beanstalk takes your application and provisions EC2 instances (or, in its newer Cluster mode, an EKS cluster), load balancing, health monitoring and scaling in your account. It has no additional charge; you pay for those resources.",
      "Fargate gives you no host: EKS on Fargate supports no privileged containers, no DaemonSets and no GPUs. On EC2 the guest operating system is yours, so a kernel module or an OS-level agent points to EC2, directly or as cluster nodes."
    ],
    trap: "Check duration and control before picking 'serverless'. A job that computes for hours does not fit in one Lambda invocation; 'existing Kubernetes manifests' means EKS, not ECS; 'upload code but keep access to the instances' means Elastic Beanstalk.",
    docs: [
      ["What is AWS Lambda?", "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"],
      ["Architect for AWS Fargate for Amazon ECS", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html"],
      ["What is AWS Elastic Beanstalk?", "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html"]
    ]
  },

  d1w4: {
    k: [
      "Regions are isolated from each other, and AWS does not copy your resources to another Region unless you configure it. That is why choosing the Region can satisfy a data residency rule.",
      "An Availability Zone is one or more discrete data centers with redundant power, networking and connectivity. Every Region has at least three, physically separate but within 100 km of each other.",
      "Resources have different scopes: a subnet and an EBS volume live in one AZ, a VPC spans the AZs of one Region, and an AMI is Regional and must be copied before you can launch from it in another Region.",
      "CloudFront keeps cached copies of your content at edge locations and sends each user to the one with the lowest latency. The origin, such as an S3 bucket, stays in its Region.",
      "To keep full capacity through the loss of one AZ, the remaining AZs must carry the whole load. Needing 4 instances means 2 per AZ across three AZs (6 in total) but 4 per AZ across two (8 in total)."
    ],
    trap: "Edge locations are not small Regions: EC2 runs in Regions, AZs, Local Zones, Wavelength Zones and Outposts, not there. An AZ outage calls for a second AZ, not a second Region; go multi-Region only when the stem names a Regional outage or geography.",
    docs: [
      ["Regions and Zones", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"],
      ["AWS Regions and Availability Zones", "https://aws.amazon.com/about-aws/global-infrastructure/regions_az/"],
      ["What is Amazon CloudFront?", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html"]
    ]
  },

  d1p1: {
    k: [
      "S3 static hosting serves static content and client-side scripts as they are. The website endpoint supports only GET and HEAD requests on objects, so a form that saves to a database needs a backend such as API Gateway with a Lambda function.",
      "A public website endpoint needs three settings: static website hosting enabled with an index document, Block Public Access turned off for the bucket (and the account), and a bucket policy granting public read.",
      "The website endpoint speaks HTTP only and serves only publicly readable content. For HTTPS put CloudFront in front (the docs now name Amplify Hosting first); with a custom domain CloudFront uses an ACM certificate requested in us-east-1.",
      "Serving the site through a CloudFront distribution is also the documented way to publish it without turning Block Public Access off."
    ],
    trap: "S3 website endpoints do not support HTTPS at all, so an option that turns on HTTPS in the bucket's website settings is wrong. Remember also who opened the bucket: public access is a customer setting, so an exposure is the customer's responsibility.",
    docs: [
      ["Website endpoints", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html"],
      ["Setting permissions for website access", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html"],
      ["Requirements for using SSL/TLS certificates with CloudFront", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html"]
    ]
  },

  d1p2: {
    k: [
      "You pick an AZ by picking a subnet, because each subnet sits entirely inside one AZ. Running in two AZs therefore takes at least two subnets.",
      "Two instances in two AZs become one highly available application only when something spreads the traffic. Elastic Load Balancing distributes requests across AZs and sends them only to healthy targets.",
      "An EBS volume attaches only to an instance in its own AZ, so each instance keeps its volumes in the AZ where it runs."
    ],
    trap: "A larger instance type, a cluster placement group or daily snapshots do not survive an AZ outage. The first two stay inside one AZ and snapshots only help you rebuild afterwards; only instances in a second AZ keep serving.",
    docs: [
      ["Subnets for your VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html"],
      ["What is Elastic Load Balancing?", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html"],
      ["Amazon EBS volumes", "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html"]
    ]
  },

  d1p3: {
    k: [
      "To change the instance type you must stop the instance first, so plan for downtime. On an EBS-backed instance the volumes and their data are kept.",
      "A stop and start loses RAM contents, instance store data and the auto-assigned public IPv4 address. EBS volumes, private IPv4 addresses and associated Elastic IP addresses persist.",
      "User data runs as the root user and, by default, only during the first boot. It is the way to install software at launch, but everything it does adds to the time before the instance is ready.",
      "User data is not protected by authentication or encryption, and software running on the instance can read it. Never place passwords or keys there.",
      "An AMI created from a configured instance launches new instances with the same configuration, so nothing has to be installed at boot. An AMI is tied to its Region, so copy it to each Region you launch in."
    ],
    trap: "Instance metadata is information the instance reads about itself; user data is the script you pass in at launch. And more memory comes from a different instance type, never from a larger EBS volume.",
    docs: [
      ["How EC2 instance stop and start works", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-stop-start-works.html"],
      ["Run commands at launch with user data", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html"],
      ["Use instance metadata to manage your EC2 instance", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html"]
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
