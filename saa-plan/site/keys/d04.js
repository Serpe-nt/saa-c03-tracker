// Key points for the plan steps whose id starts with d4 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d4s1: {
    head: "Install the AWS CLI on your PC",
    why: "In the console every action is a row of clicks that you can't save, repeat or put in a script. The next steps sign you in from your own terminal and assume a role from it. You need a way to drive AWS from the command line.",
    idea: "The AWS CLI controls AWS services from the command line and from scripts. Install version 2: the <code>aws login</code> command you use next needs 2.32.0 or newer.",
    do: [
      "On Windows, download and run the official installer: <code>https://awscli.amazonaws.com/AWSCLIV2.msi</code>. On Linux, a distro package or the official installer.",
      "Open a new command prompt and run <code>aws --version</code>. <code>aws login</code> needs 2.32.0 or newer."
    ],
    done: "<code>aws --version</code> prints a line that starts with <code>aws-cli/2.</code>, at version 2.32.0 or newer.",
    k: [
      ["Distro packages can lag", "AWS doesn't maintain third-party package repositories other than snap, so they may not hold the latest version. If yours is older than 2.32.0, use the official installer."],
      ["If aws is not found", "Close and reopen the command prompt window, so that it picks up the new path."]
    ],
    q: {
      q: "Your Linux distribution's package installed AWS CLI 2.20, and <code>aws login</code> isn't recognized. What is the right fix?",
      o: [
        "Install the CLI with AWS's official installer, since <code>aws login</code> needs 2.32.0 or newer",
        "Create an access key for your user and use <code>aws configure</code> instead",
        "Install AWS CLI version 1, which comes with <code>aws login</code>",
        "Run <code>aws login</code> as the root user, which works on any version"
      ],
      a: [0],
      x: [
        "Right. The command arrived in 2.32.0, and the distro's repository may lag behind. AWS's own installer gives you the current version.",
        "That works, but it puts a long-term access key on disk, which is what <code>aws login</code> avoids.",
        "<code>aws login</code> needs version 2.32.0 or newer. Version 1 is older still.",
        "The command is missing from the old version, whoever signs in. And root stays out of daily work."
      ],
      dom: 1, tags: ["IAM Identity Center & federation"]
    },
    docs: [["Installing or updating the AWS CLI", "https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"]]
  },
  d4s2: {
    head: "Sign the CLI in without storing an access key",
    why: "The quick way to set up the CLI is to paste an access key into it. That key never expires, sits in a file on your PC, and works for anyone who copies it. The CLI needs to act as you without a permanent secret on disk.",
    idea: "<code>aws login</code> signs the CLI in through your browser, with your console sign-in. The CLI gets temporary credentials, caches them and refreshes them for up to 12 hours.",
    do: [
      "Run <code>aws login --profile lab</code>. When it asks for a Region, enter <code>eu-west-1</code>.",
      "A browser window opens: sign in as your admin user, choose that session, then return to the terminal.",
      "No long-term access keys land on disk: the CLI gets temporary credentials from your console sign-in. When the session expires, run <code>aws login --profile lab</code> again."
    ],
    done: "The terminal ends with a message that the <code>lab</code> profile is configured. The temporary credentials are cached under <code>%USERPROFILE%\\.aws\\login\\cache</code>.",
    k: [
      ["Refreshed every 15 minutes", "The CLI refreshes the cached credentials every 15 minutes as needed. The whole session lasts up to the principal's session duration, 12 hours at most. <code>aws logout</code> deletes the cached credentials."],
      ["Who aws login is for", "AWS recommends <code>aws login</code> when you sign in as root, as an IAM user or through federation with IAM."],
      ["The Identity Center way", "A company on IAM Identity Center uses <code>aws configure sso</code> instead. Its profile holds no access key, only the start URL, account ID, role name and Region, and <code>aws sso login</code> fetches the credentials."],
      ["Long-term access keys", "An IAM user access key has no expiration, so AWS marks long-term credentials for the CLI as not recommended. Retire one by deactivating it, then deleting it once nothing breaks."]
    ],
    q: {
      q: "You signed the CLI in with <code>aws login</code> at 7 p.m. At 9 the next morning every command fails because the credentials have expired. Why, and what now?",
      o: [
        "The login session lasts at most 12 hours: run <code>aws login --profile lab</code> again",
        "The CLI refreshes credentials only while the browser stays open: reopen it",
        "<code>aws login</code> works only once per profile: create a new profile",
        "Expired credentials mean the user was deleted: create an access key instead"
      ],
      a: [0],
      x: [
        "Right. The CLI refreshes the cached credentials every 15 minutes, but the whole session ends after the principal's session duration, 12 hours at most. Then you sign in again.",
        "The cached credentials are refreshed by the CLI itself. The limit is the session's maximum length, not the browser.",
        "You can run <code>aws login</code> with the same profile as often as you need.",
        "An expired session is normal. Falling back to a long-term access key is the thing <code>aws login</code> avoids."
      ],
      dom: 1, tags: ["IAM Identity Center & federation"]
    },
    docs: [
      ["Login for AWS local development using console credentials", "https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sign-in.html"],
      ["Configuring IAM Identity Center authentication with the AWS CLI", "https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html"],
      ["Authentication and access credentials for the AWS CLI", "https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html"]
    ]
  },
  d4s3: {
    head: "Check which identity the CLI is acting as",
    why: "With two profiles on your PC, you run a command that deletes something. It runs as the wrong identity, in the wrong account, and you notice too late. Before you change anything, one call should tell you who the CLI is acting as.",
    idea: "<code>aws sts get-caller-identity</code> returns the account, user ID and ARN of the credentials in use. It needs no permissions, so it works even when everything else is denied.",
    do: [
      "Run <code>aws sts get-caller-identity --profile lab</code>."
    ],
    done: "A short JSON answer: <code>Account</code> is your account ID, and <code>Arn</code> ends in <code>user/</code> followed by your user name.",
    k: [
      ["Run it whenever in doubt", "Run it before any command that changes something with a profile you haven't used for a while."],
      ["A role shows as assumed-role", "After you assume a role, the ARN reads <code>arn:aws:sts::…:assumed-role/</code> plus the role name and the session name, so you see which role and session you are in."]
    ],
    q: {
      q: "Earlier in this terminal a script assumed a role, and you no longer know which credentials the shell uses. How do you find out before running a delete, even if those credentials have almost no permissions?",
      o: [
        "Run <code>aws sts get-caller-identity</code>: it needs no permissions and shows the ARN in use",
        "Run <code>aws iam list-users</code> and see which account answers",
        "Open the console, whose account menu shows the CLI's identity",
        "Read the profile names in the CLI's config file"
      ],
      a: [0],
      x: [
        "Right. It returns the account, user ID and ARN of the credentials in use. An ARN with <code>assumed-role/</code> names the role and the session.",
        "Listing users needs IAM permissions, which these credentials may not have, and it doesn't say who you are.",
        "The console has its own sign-in. It says nothing about the credentials in this terminal.",
        "A profile name is only a label. The call shows the identity the credentials really belong to."
      ],
      dom: 1, tags: ["IAM roles & cross-account"], doc: "iam-roles"
    },
    docs: [
      ["GetCallerIdentity (AWS STS API Reference)", "https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html"]
    ]
  },
  d4b1: {
    head: "Write a policy that allows one action on one bucket",
    why: "An app needs to read files from one bucket. Granting it full S3 access works on the first try, and also lets a bug or a thief delete every bucket in the account. You need to state exactly what is allowed: which action, on which resource.",
    idea: "An IAM policy is that statement, written in JSON: an Effect, an Action and a Resource. A request is allowed only if some statement allows it, so a policy that lists one action on one bucket permits nothing else.",
    do: [
      "S3 → <b>Create bucket</b>, Region eu-west-1. Name: lowercase letters, numbers and hyphens, unused by any other account, for example <code>lab-policy-</code> plus your initials and the date. Keep the other defaults.",
      "IAM → <b>Policies</b> → <b>Create policy</b> → <b>JSON</b>. Replace the editor's text with this policy, your bucket's name in place of <code>&lt;bucket&gt;</code>:",
      "<code>{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::&lt;bucket&gt;/*\"}]}</code>",
      "Read the JSON line by line: Effect, Action, Resource. <b>Next</b> → a name, for example <code>lab-read-objects</code> → <b>Create policy</b>."
    ],
    done: "Your policy is listed under Policies as customer managed. Nothing uses it yet: the next step attaches it to a role.",
    k: [
      ["A condition narrows it further", "Besides Effect, Action and Resource, a statement can carry a Condition that limits when it is in effect."],
      ["Object ARN or bucket ARN", "<code>s3:GetObject</code> acts on objects, so its Resource is <code>arn:aws:s3:::bucket-name/*</code>. <code>s3:ListBucket</code> acts on the bucket itself and needs <code>arn:aws:s3:::bucket-name</code>. Mixing them up causes AccessDenied."],
      ["IAM Access Analyzer", "Gets you to least privilege without reading logs by hand. It can generate a policy from the CloudTrail activity of a user or role, and it can validate a policy you wrote."],
      ["Bucket policies use the same grammar", "Plus a Principal. A Deny when <code>aws:SecureTransport</code> is false forces TLS. An Allow limited by <code>aws:PrincipalOrgID</code> opens the bucket only to accounts in your organization."]
    ],
    q: {
      q: "A policy allows <code>s3:ListBucket</code> with the Resource <code>arn:aws:s3:::invoices/*</code>. Listing the invoices bucket still returns AccessDenied. What is wrong?",
      o: [
        "ListBucket acts on the bucket itself, so the Resource must be <code>arn:aws:s3:::invoices</code>",
        "ListBucket also needs <code>s3:GetObject</code> in the same statement",
        "The Resource must name the Region and account of the bucket",
        "Policies that list one action need a Condition element to take effect"
      ],
      a: [0],
      x: [
        "Right. Object actions such as GetObject take the <code>/*</code> object ARN. ListBucket acts on the bucket and takes the bucket ARN without it.",
        "Listing and reading are separate actions. Adding GetObject wouldn't fix the wrong Resource.",
        "S3 bucket ARNs carry no Region or account: <code>arn:aws:s3:::bucket-name</code>.",
        "A Condition is optional. It only limits when a statement applies."
      ],
      dom: 1, tags: ["IAM policies", "S3 security"], doc: "iam-policies"
    },
    docs: [
      ["Grant read and write access to Amazon S3 bucket objects", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_rw-bucket.html"],
      ["Create IAM policies (console)", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html"],
      ["General purpose bucket naming rules", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html"]
    ]
  },
  d4b2: {
    head: "Let an EC2 instance read S3 without an access key",
    why: "A script on your EC2 instance has to read files from a bucket. The quick fix is to paste an access key into its config file. But that key is long-term: if it leaks, for example with the code into a public repository, it works for anyone until someone notices and deletes it.",
    idea: "An IAM role gives the application temporary credentials that are renewed for it, so no key is stored on the instance at all. This is how applications on AWS get their permissions.",
    do: [
      "Upload a small text file, for example <code>hello.txt</code>, to the bucket from the previous step: S3 → your bucket → <b>Upload</b>.",
      "IAM → <b>Roles</b> → <b>Create role</b>. Trusted entity: <b>AWS service</b>, use case <b>EC2</b>.",
      "Attach your policy from the previous step and <code>AmazonSSMManagedInstanceCore</code>, which lets Session Manager connect to the instance, as on Day 4.",
      "Launch an instance (t3.micro, Amazon Linux) in the default VPC, with no key pair. Advanced details → <b>IAM instance profile</b>: this role.",
      "EC2 → select the instance → <b>Connect</b> → <b>Session Manager</b>. Run <code>aws s3 cp s3://&lt;your bucket&gt;/hello.txt -</code>"
    ],
    done: "The file's text appears, and no access key was ever stored on the instance. <code>aws s3 ls</code> on the bucket is denied: your policy allows reading a file (<code>s3:GetObject</code>), not listing them (<code>s3:ListBucket</code>).",
    k: [
      ["Who may use the role", "The trust policy of this role names the service <code>ec2.amazonaws.com</code>, so EC2 is the only principal that may assume it. Your own <code>aws sts assume-role</code> call against it is denied until the trust policy says otherwise."],
      ["How EC2 gets the role", "Through an instance profile, a container for exactly one role that the console creates for you. Launching with a role needs <code>iam:PassRole</code> for it, so only approved users can hand a role to a service."],
      ["Temporary credentials", "The application gets temporary credentials for the role from the instance metadata service. SDKs and the CLI do this by themselves. The credentials are renewed before they expire."],
      ["Require IMDSv2", "It guards those credentials against server-side request forgery (SSRF), an attack that tricks the application into fetching them. IMDSv2 answers only requests that carry a session token obtained with a PUT request."]
    ],
    trap: "Storing an access key in Secrets Manager, in user data or in an environment variable still leaves a long-term key to manage. For code on EC2 the most secure answer with the least overhead is an IAM role attached through an instance profile.",
    q: {
      q: "Your instance runs with a role whose policy allows reading the bucket, and no access key was ever configured on it. Why does <code>aws s3 cp</code> on the instance still work?",
      o: [
        "The CLI gets temporary credentials for the role from the instance metadata service",
        "Instances may call every AWS service in their own account until a policy denies it",
        "The bucket trusts every instance that runs in the same Region as the bucket",
        "Launching with a role copied your admin user's access key onto the instance"
      ],
      a: [0],
      x: [
        "Right. The application gets the role's temporary credentials from the instance metadata service. SDKs and the CLI do this by themselves, and the credentials are renewed before they expire.",
        "Requests are denied unless a policy allows them. Without the role, the instance would have no credentials to sign a request with.",
        "A bucket trusts nobody by default. Here access comes from the permissions policy of the role the instance runs with.",
        "No key is stored on the instance: that is the point of a role. The credentials it gets are temporary and belong to the role, not to your user."
      ],
      dom: 1, tags: ["IAM roles & cross-account"], doc: "iam-roles-ec2"
    },
    docs: [
      ["Use an IAM role to grant permissions to applications running on Amazon EC2 instances", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html"],
      ["Use instance profiles", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html"],
      ["Use the Instance Metadata Service to access instance metadata", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html"]
    ]
  },
  d4b3: {
    head: "Create a role and assume it from your PC",
    why: "An engineer needs extra rights for one task this afternoon. A second permanent admin login for her means one more password and key to guard, long after the task is done. Rights should be taken on for a while and handed back, with a clear rule of who may take them.",
    idea: "A role is a set of permissions that someone you trust takes on for a limited time. Its trust policy names who that is, and <code>AssumeRole</code> hands out temporary credentials.",
    do: [
      "IAM → <b>Roles</b> → <b>Create role</b> → <b>AWS account</b> → <b>This account</b>. Leave <b>Require external ID</b> and <b>Require MFA</b> unticked.",
      "Permissions: tick none. A role has no permissions by default, and this test is only about who may assume it. Name it, for example <code>lab-assume-test</code> → <b>Create role</b>.",
      "Open the role: its trust policy names your account (<code>arn:aws:iam::&lt;account-id&gt;:root</code>). The trust policy decides who may assume the role. Copy the role's ARN.",
      "On your PC: <code>aws sts assume-role --role-arn &lt;arn&gt; --role-session-name test --profile lab</code>."
    ],
    done: "The command prints temporary credentials (access key ID, secret access key, session token, expiration) and an <code>AssumedRoleUser</code> ARN ending in <code>assumed-role/lab-assume-test/test</code>.",
    k: [
      ["Two policies", "A role has two policies. The trust policy says who may assume it. The permissions policy says what the session may do. <code>AssumeRole</code> returns an access key ID, a secret access key and a session token that expire."],
      ["Why your call works", "In the same account, a trust policy that trusts the account still needs an IAM policy that allows <code>sts:AssumeRole</code> for the caller. Your admin user's AdministratorAccess allows it. Across accounts both sides are always required."],
      ["How long a session lasts", "While you use the role you have its permissions instead of your own. A session lasts one hour by default. It can be set from 15 minutes up to the role's maximum, 1 to 12 hours."],
      ["Role chaining", "Using one role to assume a second role is role chaining. Such a session is capped at one hour."],
      ["External ID", "For a third-party vendor that serves many customers. Trust the vendor's account and require an external ID in the trust policy. That condition is what prevents the confused deputy problem."]
    ],
    trap: "The permissions attached to a role decide what a session can do, never who may start one. When a principal cannot assume a role, look at the trust policy or at the caller's <code>sts:AssumeRole</code> permission. The fix is not in the role's permissions policy.",
    q: {
      q: "A colleague gets AccessDenied when she calls <code>sts:AssumeRole</code> on your role. The role's permissions policy already allows everything her task needs. Where does the fix belong?",
      o: [
        "In the role's trust policy, or in her own permission to call <code>sts:AssumeRole</code>",
        "In the role's permissions policy, by adding <code>sts:AssumeRole</code> to it",
        "In a longer maximum session duration on the role",
        "In an external ID added to her call"
      ],
      a: [0],
      x: [
        "Right. Who may start a session is decided by the trust policy and by the caller's own permission to call <code>sts:AssumeRole</code>.",
        "The permissions policy decides what a session may do once it exists, never who may start one.",
        "Session length matters only after the role has been assumed.",
        "An external ID helps only if the trust policy requires one, and then it is a condition in the trust policy."
      ],
      dom: 1, tags: ["IAM roles & cross-account"], doc: "iam-roles"
    },
    docs: [
      ["Create a role to give permissions to an IAM user", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html"],
      ["AssumeRole (AWS STS API Reference)", "https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html"],
      ["The confused deputy problem", "https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html"]
    ]
  },
  d4b6: {
    head: "Clean up the IAM build",
    why: "The test instance from this build keeps running and billing. The two roles stay behind too, free of charge and easy to forget, still ready for anyone their trust policies name. You need to remove what costs money and what grants access, in an order that works.",
    idea: "Terminate the instance first, because a role should only be deleted once nothing runs with it. Then delete the two roles and your policy, and the bucket once it is empty.",
    do: [
      "EC2 → <b>Instances</b> → terminate the instance from this build.",
      "IAM → <b>Roles</b>: delete the EC2 role and the role you assumed from your PC. The console detaches their policies and deletes the instance profile with them.",
      "IAM → <b>Policies</b>: delete your policy from the first build step.",
      "S3 → select the bucket → <b>Empty</b>, then <b>Delete</b>, typing the bucket name to confirm. A bucket must be empty before it can be deleted."
    ],
    done: "The instance shows as terminated, IAM no longer lists the two roles or your policy, and S3 no longer lists the bucket.",
    k: [
      ["Instances before roles", "Delete a role only after the instances that use it are gone. Deleting the role or instance profile of a running instance breaks the applications on it."],
      ["Leftover roles still grant access", "IAM is offered at no additional charge, so leftover roles cost nothing and are easy to forget. A leftover role still lets whoever its trust policy names take on its permissions."],
      ["A KMS key stays behind", "Deleting the data does not remove a customer managed KMS key, and the key carries a monthly fee. Before you schedule a key's deletion, remember that data encrypted under it becomes unreadable once it is gone."]
    ],
    q: {
      q: "You try to delete the bucket from this build, and S3 refuses. What is the usual reason?",
      o: [
        "The bucket still holds objects, and a bucket must be empty before it can be deleted",
        "Buckets can be deleted only by the root user",
        "A bucket can't be deleted while an IAM policy names it",
        "Buckets in eu-west-1 must be deleted from the CLI"
      ],
      a: [0],
      x: [
        "Right. Empty it first (S3 offers an Empty button), then delete it.",
        "An admin user with permission to delete buckets can do it. Root stays for root-only tasks.",
        "A policy that names a deleted bucket simply matches nothing. It doesn't block the delete.",
        "The console deletes buckets in any Region once they are empty."
      ],
      dom: 4, tags: ["S3 features"], doc: "s3"
    },
    docs: [
      ["Delete roles or instance profiles", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_manage_delete.html"],
      ["Deleting a general purpose bucket", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/delete-bucket.html"],
      ["Delete an AWS KMS key", "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html"]
    ]
  },
  d4c1: {
    head: "Identity-based or resource-based policy, and how they combine",
    why: "A user's own policy allows her to read a bucket, and the bucket's policy denies her. Which of the two wins decides whether the data is safe. One request can meet both kinds of policy, so you must know how AWS combines them.",
    idea: "An identity-based policy says what a user or role may do. A resource-based policy, such as a bucket policy, says who may use this resource. AWS weighs them together, and an explicit deny in any of them always wins.",
    trap: "An option is wrong when a broad Allow such as <code>s3:*</code> outweighs a narrow Deny, or the identity policy outranks the bucket policy. AWS checks all policies for a Deny first.",
    k: [
      ["Granting one account is not public", "S3 Block Public Access blocks public access to buckets. A bucket policy that grants a named account is not public, so Block Public Access can stay on."]
    ],
    q: {
      q: "A role in account B has an identity policy that allows <code>s3:GetObject</code> on a bucket in account A. The bucket has no bucket policy. What happens when the role reads an object?",
      o: [
        "It is denied, because across accounts the bucket's side must allow the request too",
        "It is allowed, because the identity policy grants the action",
        "It is allowed, because an empty bucket policy allows everyone",
        "It is denied, because roles can never read buckets in another account"
      ],
      a: [0],
      x: [
        "Right. Inside one account an Allow on either side is usually enough. Across accounts both must allow: here a bucket policy in account A that names the role or account B.",
        "Account B's policy speaks only for B. Account A's bucket must allow the request as well.",
        "A request starts as an implicit deny. No policy means no Allow, not allow-all.",
        "Cross-account access works once both sides allow it, through a bucket policy or by assuming a role in account A."
      ],
      dom: 1, tags: ["IAM policies", "IAM roles & cross-account"], doc: "iam-policy-eval"
    },
    docs: [
      ["Policy evaluation for requests within a single account", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_policy-eval-basics.html"],
      ["Cross-account policy evaluation logic", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic-cross-account.html"],
      ["Identity-based policies and resource-based policies", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html"]
    ]
  },
  d4c2: {
    head: "What a service control policy can and can't do",
    why: "A company forbids any work outside the EU. In one member account, an administrator with full rights starts servers in Virginia anyway: inside the account nothing stops him. Some rules must hold in every account of an organization, whatever its own administrators allow.",
    idea: "A service control policy (SCP) sets that outer limit for the accounts of an organization. It only limits and never grants, and it doesn't restrict the management account.",
    trap: "An Allow in an SCP gives nobody access: the principal still needs an IAM Allow, so the result is the overlap of both. SCPs also skip the management account, which is why an administrator there can still do what the SCP denies.",
    q: {
      q: "An SCP that denies every Region outside the EU is attached to the organization's root. An administrator still starts instances in us-east-1, and nothing blocks him. Where is he most likely signed in?",
      o: [
        "In the organization's management account, which SCPs don't restrict",
        "In a member account, where AdministratorAccess outranks the SCP",
        "In a member account, because SCPs don't apply to EC2",
        "In any account, because an SCP needs a matching Allow before its Deny works"
      ],
      a: [0],
      x: [
        "Right. SCPs limit the users and roles of member accounts. The management account is not restricted by them.",
        "In a member account the SCP caps every principal, administrators included. An IAM Allow can't outweigh it.",
        "SCPs can deny the actions of any service, EC2 included.",
        "A Deny in an SCP works by itself. It is an Allow that needs a matching IAM Allow to mean anything."
      ],
      dom: 1, tags: ["Organizations & SCPs"], doc: "scp"
    },
    docs: [
      ["Service control policies (SCPs)", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"],
      ["SCP evaluation", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_evaluation.html"]
    ]
  },
  d4c3: {
    head: "Detect or block: WAF, Shield, GuardDuty, Inspector or Macie",
    why: "Asked what protects the shop, you name GuardDuty, Inspector and Macie. Then a wave of malicious web requests takes the site down, while all three send their findings. Some of these services only report problems, and only some stand in the path of traffic and stop attacks.",
    idea: "GuardDuty, Inspector and Macie find problems and report them. AWS WAF filters web requests and AWS Shield protects against DDoS attacks: those two stand in the path of the traffic and block.",
    k: [
      ["Security Hub CSPM", "One place for the findings. AWS Security Hub CSPM (formerly Security Hub) collects the findings of GuardDuty, Inspector and Macie across accounts. It also runs its own checks against standards such as AWS Foundational Security Best Practices."]
    ],
    trap: "GuardDuty, Inspector and Macie report findings. None of them filters or blocks traffic. Filtering web requests is WAF, and DDoS protection is Shield. An automatic reaction to a finding is an EventBridge rule that triggers a Lambda function.",
    q: {
      q: "Bots are sending SQL injection strings to a shop's Application Load Balancer. The team has already turned on GuardDuty, Inspector and Macie. Which addition stops those requests before they reach the servers?",
      o: [
        "AWS WAF on the load balancer, with a rule that matches SQL injection",
        "A GuardDuty finding type for SQL injection",
        "An Amazon Inspector scan of the servers",
        "Amazon Macie on the shop's S3 buckets"
      ],
      a: [0],
      x: [
        "Right. WAF stands in the path of the web requests and filters them, SQL injection included.",
        "GuardDuty finds threats and reports them. It doesn't filter or block traffic.",
        "Inspector scans software for vulnerabilities. It doesn't stand in the path of requests.",
        "Macie discovers sensitive data in S3. It has nothing to do with web requests."
      ],
      dom: 1, tags: ["WAF, Shield & Firewall Manager", "Threat detection"], doc: "waf"
    },
    docs: [
      ["AWS WAF", "https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html"],
      ["What is Amazon GuardDuty?", "https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html"],
      ["What is Amazon Inspector?", "https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html"]
    ]
  }
});
