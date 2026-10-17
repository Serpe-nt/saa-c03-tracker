# The article rewrite, part A (2026-10-17)

Scope: every plan step whose id files in `site/keys/d01.js`, `t1.js`, `s0.js`, `d02.js` … `d07.js`: 65 steps. The pilots `d1a1` and `d4b2` are unchanged (checked with `git diff`). The other 63 cards got `head`, `idea` and their own question `q`; the why was rewritten as a short scene plus the need; points were reordered from need to mechanism to exam detail, relabelled to say what they say, and kept at five or fewer. Eight steps had no entry and got one: `d1a3`, `d1a4`, `d1d2`, `d1e3`, `s0a`, `s0b`, `t1g`, `d4s1`.

30 cards have `do` (every Setup and Build step, plus `t1g`, `d7e4`, `d7e6`), 18 of them a `done`. `do` holds everything the step text and its note say; where a note's message went into `why` or `idea` instead (as the pilot `d4b2` did), it is said there.

Checks: `node --check` on the nine files, `node --test` (50 pass), `node tools/similar.mjs 0.30 2000` lists no pair with a `card-` question (the 60 pairs it lists are bank-only, as before this change). No new `DOCS` keys: every question's `doc` is an existing key.

## Decisions worth a look at merge time

- **No `do` on `s0a`, `s0b`, `d1e3` and `d7e3`**, although they are steps you carry out: their step text holds the link to the learning plan, course or exam guide, and `do` (which replaces the step text on screen) allows only `<b>` and `<code>`. Without `do` the card shows the step text with its link and the note under the headline. The same for the two Exam Prep videos `d7e1` and `d7e2`, which are watched, like a lecture.
- **Questions on admin and exam-technique cards still need a QTAGS topic.** Where the card's point is a cost (`d1a2`, `d1a4`, `d1d1`–`d1d3`, `d1d2`, `d1e3`, `s0a`, `s0b`, `d7h3`) I used `Cost management tools`, dom 4. Where it is exam technique, the question embeds a real decision from an earlier card and is tagged by that decision: `t1g` (EFS vs EBS), `d7e2` (Lambda, least overhead), `d7e4` (Spot, most cost-effective), `d7e6` (security group vs network ACL), `d7e3` (the cost domain's weight, so `Cost management tools`). `d4s1` and `d4s2` use `IAM Identity Center & federation` for the temporary-credentials point.
- **Questions rewritten because they matched a bank question's decision** (some above 0.30, some just under it but the same scenario): `d1c3` (q01-043), `d1c7` (q01-021), `d1c8` (q01-031), `d2b4` (q02-019, q02-025: the bank already has this very build), `d2c2` (q02-033, q02-036), `d3c2` (q05-041, q09-020), `d3c3` (q03-004), `d4s2` (card-d1c5), `d4c3` (q04-049), `d5c1` (q05-007, q05-033), `d5c2` (q09-005, q05-018), `d6c2` (q06-024). The cards now ask about a point the bank doesn't decide on (for example `d2b4`: which feature shows dropped packets; `d2c2`: a Direct Connect gateway is not a hub).
- `d1c3` lost the SCP sentence in its trap (SCPs are taught on Day 11; the trap may use only what the card explains), and its SCP doc link. `d1d1`'s trap named Cost Explorer and Cost Anomaly Detection, which the card didn't explain: they are now a point ("Other cost tools"). To stay at five points, the old "Not only cost" point (Budgets also track usage and Reserved Instance and Savings Plans coverage) was dropped. `d4c1`'s trap named Block Public Access: moved into a new point that says what it is. `d1b2`'s trap named CloudFront: a point now explains it.
- Dropped points that repeated another part of the card: `d1a2` "Upgrading later" (now in `do`), "Credits still apply" (in `do` and `idea`); `d1c5` "Root stays out of daily work" (taught on `d1b1`, `d1u4`); `d4s2` "Expired session" (in `do`); `d4s3`'s only point (now the `idea`); `d7e1` "What the exam validates" (now the `idea`); `d7e6` "A decision, not a service" (now in `do`). `d2b1` "Trace the path" became the `do` and `done`.
- `d4b6`: the KMS key point stays, reworded ("Deleting the data does not remove a customer managed KMS key"), although no step of this build creates a key. Two new points: instances before roles, and leftover roles still grant access.
- `d1u1` points to Day 5 for Identity Center; `d1c8`, `d3c1` and `d2c1` refer back to Day 1, Day 2 and the Day 4 build.

## New facts and the page each rests on

All pages fetched with curl on 2026-10-17, no redirects followed (each answered 200), text grepped.

**Sign-up (`d1a3`, `d1a4`)**: https://docs.aws.amazon.com/accounts/latest/reference/getting-started.html (the classic sign-up is now called "Sign up for AWS (advanced)")
- "You can't proceed with the sign-up process until you add a valid payment method."
- "For Phone number , enter a phone number that can be reached in the next few minutes. Choose Send SMS . When the automated system contacts you, enter the code you receive and then choose Continue ."
- "Phone number – This number is used for identity verification purposes and to confirm the ownership of your account. You must be able to receive calls and SMS messages at this phone number."
- "If this account is for a business, use a corporate phone number so that your company can retain access to the AWS account even when an employee changes positions or leaves the company." and "use a secure corporate distribution list … Because the email address can be used to reset the account's root user credentials, protect access to this distribution list or address."
- "Choose Complete sign up . A confirmation page appears that indicates that your account is being activated. Check your email and spam folder … Activation usually takes a few minutes but can sometimes take up to 24 hours. After you receive the activation message, you can sign-in to the AWS Management Console".

**Support plans (`d1a4`)**: https://aws.amazon.com/premiumsupport/plans/
- "Basic Support included for all AWS customers": "24/7 access to customer service, documentation, whitepapers, and AWS re:Post", "AWS Trusted Advisor - Core checks and guidance to provision your resources following best practices to increase performance and improve security", "AWS Health - A personalized view of the health of AWS services, and alerts when your resources are impacted."
- The paid plans in the comparison: Business Support+ ("Minimum recommended plan for production workloads by AWS"), Enterprise Support, Unified Operations; "Full set of checks + AWS Trusted Advisor Priority"; response times; "Designated Technical Account Manager".

**Credits (`d1d2`, and `d1a2`'s question)**: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/useconsolidatedbilling-credits.html
- "Credits are applied until they are exhausted or they expire." "AWS credits are automatically applied to bills".
- "To view your credit balance since the last billing date, navigate to the Credits page … under the Amount remaining column. Your credit balance is updated each month at the end of the current billing cycle."
- "To view your estimated credit balance for the current month, navigate to the Bills page … and then choose the Savings tab."
- Credit details: "Estimated amount remaining — … updated daily", "Expiration date", "Applicable products — The AWS services that the credit can be applied to."
- Order: "The soonest to expire amongst the credits" comes first.
- `d1a2` question: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html, "After your free account plan expires, your account closes automatically … AWS retains your content for 90 days before permanently deleting".

**Root MFA (`d1b1`)**: https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html
- "All AWS account types (standalone, management, and member accounts) require MFA to be configured for their root user. Users must register MFA within 35 days of their first sign-in attempt to access the AWS Management Console if MFA is not already enabled."

**MFA for the IAM user (`d1u3`)**: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_virtual.html
- The wizard: "type a Device name , choose Authenticator app", "choose Show QR code", "in the MFA code 1 box, type the one-time password … Wait up to 30 seconds … type the second one-time password into the MFA code 2 box. Choose Add MFA ."
- "If you generate the codes and then wait too long to submit the request, the MFA device successfully associates with the user but the MFA device is out of sync."
- "We recommend that you use passkeys or security keys for MFA for the strongest protection against attacks such as phishing. If you are not yet able to use passkeys or security keys, we recommend that you use a [virtual MFA device]".

**Sign-in URL (`d1u4`)**: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_sign-in.html
- "https://alias.signin.aws.amazon.com/console"
- "To create a bookmark for your account sign-in page in your web browser, you should manually type the sign-in URL for your account in the bookmark entry. Do not use your web browser bookmark feature because redirects can obscure the sign-in URL."

**Budgets (`d1d1`, `d1d3`)**: https://docs.aws.amazon.com/cost-management/latest/userguide/budget-templates.html and https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-best-practices.html
- "Zero spend budget : A budget that notifies you after your spending exceeds AWS Free Tier limits."; the console path "In the navigation pane, choose Budgets … choose Create budget … choose Use a template (simplified)".
- "Forecast-based budget alerts … might alert more than once in a budgeted period if the forecasted values exceed, dip below, and then exceed the alert threshold again".

**Skill Builder (`s0a`, `s0b`, `d1e3`)**: https://aws.amazon.com/training/faqs/
- "To access our free digital training, create an account or sign into AWS Skill Builder, select a course, and start learning." "AWS Builder ID (recommended for individuals)".
- "Learning plans are a recommended collection of digital courses focused on a specific domain or job role. Each learning plan progresses a learner through a series of increasingly challenging courses".
- "The Individual monthly subscription provides access to self-paced digital training content including … AWS Certification exam prep" and "Access to live classroom training and AWS Certification exams is not included in this subscription."
- Restated from plan.js notes, not from a page: the Official Practice Exam and Domain Practice need the subscription, and 27 of the plan's 36 trainings do (`d8s1`'s note); labs run in a temporary sandbox (the lab blocks' `where`).

**Detailed monitoring (`t1f` question)**: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch.html
- "By default, Amazon EC2 sends metric data to CloudWatch in 5-minute periods. To send metric data for your instance to CloudWatch in 1-minute periods, you can enable detailed monitoring".

**VPC wizard (`d2b1`)**: https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html
- "For Resources to create , choose VPC and more . Keep Name tag auto-generation selected", "Number of Availability Zones (AZs)", "Number of public subnets and Number of private subnets", NAT gateways by number of AZs, "In the Preview pane, you can visualize the relationships … After you create the VPC, you can visualize the resources in your VPC in this format at any time using the Resource map tab."

**Launching the instance (`d2b2`)**: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-instance-wizard.html and https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-launch-parameters.html
- "you can choose Proceed without a key pair (not recommended)".
- "Auto-assign Public IP … When launching instances into a nondefault subnet the default value is Disable."
- "If you create a new security group, we automatically create an inbound rule that allows you to connect to your instance from all IP addresses over SSH … You can remove or modify this rule as needed."
- "IAM instance profile : Select an IAM instance profile to associate with the instance. This is a container for an IAM role."

**Session Manager (`d2b3`)**: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html and https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started-ssm-user-permissions.html
- "Select the instance and choose Connect . For Connection method , choose Session Manager . Choose Connect . After the connection is made, you can run bash commands".
- "This ssm-user is the default operating system (OS) user when a AWS Systems Manager Session Manager session is started."

**Default network ACL (`d2b4`)**: https://docs.aws.amazon.com/vpc/latest/userguide/default-network-acl.html and https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html
- The default network ACL has inbound and outbound rule 100, All traffic, ALLOW, then the `*` deny; "You can modify a default network ACL by adding rules or removing the default numbered rules. You can't delete a rule where the rule number is an asterisk."
- "If you don't explicitly associate a subnet with a network ACL, the subnet is automatically associated with the default network ACL." "You can associate a network ACL with multiple subnets".

**Cleanup of the VPC build (`d2b5`)**: https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-working-with.html, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-instance-addressing-eips-releasing.html, https://docs.aws.amazon.com/vpc/latest/userguide/delete-vpc.html
- "choose NAT gateways . Select the radio button for the NAT gateway, and then choose Actions , Delete NAT gateway . When prompted for confirmation, enter delete". "After you delete a NAT gateway, its entry remains visible in the Amazon VPC console for about an hour, after which it's automatically removed."
- "The Elastic IP address to release must not be currently associated with an AWS resource." "choose Elastic IPs . Select the Elastic IP address to release and choose Actions , Release Elastic IP addresses . Choose Release ."
- "If you delete a VPC using the Amazon VPC console, we also delete the following VPC components for you: DHCP options, Egress-only internet gateways, Gateway endpoints, Internet gateways, Network ACLs, Route tables, Security groups, Subnets". "Select the VPC to delete and choose Actions , Delete VPC … enter delete".

**S3 storage classes (`d3c3` question)**: https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html
- Intelligent-Tiering: "Monitoring and automation fees per object apply. No retrieval fees."; Glacier Instant Retrieval: "Per-GB retrieval fees apply."

**AWS CLI (`d4s1`, `d4s2`, `d4s3`)**: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html and https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sign-in.html
- "Download and run the AWS CLI MSI installer for Windows (64-bit): https://awscli.amazonaws.com/AWSCLIV2.msi"; sample output "aws-cli/2.27.41 Python/3.11.6 Windows/10 exe/AMD64 prompt/off"; "If Windows is unable to find the program, you might need to close and reopen the command prompt window to refresh the path".
- "Because AWS doesn't maintain third-party repositories other than snap , we can't guarantee that they contain the latest version of the AWS CLI."
- "If this is a new profile or no AWS Region has been specified, the AWS CLI prompts you to provide a region." "In the browser, select your credentials to use from the displayed list and then return to your terminal." "A final message describes the completed profile configuration."
- "The temporary cached credentials … are stored by default in … %USERPROFILE%\.aws\login\cache on Windows."
- The profile's `login_session = arn:aws:iam::0123456789012:user/username`, which is why `d4s3`'s `done` expects an ARN ending in `user/` and the user name.
- https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html: the sample `arn:aws:sts::123456789012:assumed-role/my-role-name/my-role-session-name` (the `d4s3` point on assumed roles).

**IAM build (`d4b1`, `d4b3`, `d4b6`)**
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html: "Bucket names must be between 3 (min) and 63 (max) characters long. Bucket names can consist only of lowercase letters, numbers, periods" and hyphens; "General purpose buckets exist in a global namespace, which means that each bucket name must be unique".
- https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html: "choose Policies . Choose Create policy . In the Policy editor section, choose the JSON option. Type or paste a JSON policy document … choose Next".
- https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html: "To create a role for your account, choose This account", "Require external ID", "Require MFA", "you can select no policies at this time … By default, a role has no permissions.", and the sample trust policy `"Principal": { "AWS": "arn:aws:iam::123456789012:root" }`.
- https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html: the response's `AssumedRoleUser` with `arn:aws:sts::123456789012:assumed-role/demo/TestAR`.
- https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_manage_delete.html: "When you use the AWS Management Console to delete a role, IAM automatically detaches managed policies associated with the role. It also automatically deletes any inline policies associated with the role, and any Amazon EC2 instance profile that contains the role." and "Make sure that you do not have any Amazon EC2 instances running with the role or instance profile you are about to delete. Deleting a role or instance profile that is associated with a running instance will break any applications".
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/delete-bucket.html: "You can delete an empty Amazon S3 general purpose bucket.", "confirm that you want to delete the bucket by entering the bucket name", the Empty bucket button.
- https://aws.amazon.com/iam/faqs/: "IAM is offered at no additional charge."

## Not sure, or not tried

- **`d1d1`: what the zero spend budget counts.** The step's note says it "emails you the first time anything costs money beyond credits"; the template page says it notifies "after your spending exceeds AWS Free Tier limits". No fetched page says whether credits are counted. `do` now says "beyond credits and free usage", keeping the note's meaning and the page's. If the template counts costs before credits, the owner gets the email even while credits pay; that does no harm, but the note would then be slightly off.
- **Console labels not seen in a console** (docs only): "Network settings" without an Edit button in `d2b2` (the docs list the fields, not the button), the private subnet's "Network ACL" tab in `d2b4`, "Instances → terminate" in `d2b5` and `d4b6` (I avoided the exact menu label), the trust policy shown on the role's page in `d4b3`.
- **`d2b4`**: rule 100 is the default network ACL's rule. I did not find a page that says whether "VPC and more" leaves the subnets on the default network ACL; the `do` therefore says "on a default network ACL, rule 100" and tells the owner to note which subnets share the ACL.
- **`d4b3` with `aws login` credentials**: whether `sts assume-role` works from the temporary credentials of `aws login` as it does from an IAM user's keys (backlog item 5 already lists this). The `done` follows the AssumeRole API reference. If `aws login` sessions count as role sessions, the result would be role chaining, capped at one hour, which the card's points already cover.
- **`d4s3`'s `done`** (an ARN ending in `user/<name>`) rests on the `login_session` sample on the CLI sign-in page, not on a run.
- **`d2b2`**: the instance appears as a managed node only after the agent reaches the service; no page gives a time, so `done` gives none.
- **Plain reasoning, no page**: `d1u1`'s question explanations ("an access key doesn't let anyone sign in to the console", root keys "cannot be copied to an IAM user"); `d4b6`'s "a policy that names a deleted bucket simply matches nothing"; `d4b3`'s "your admin user's AdministratorAccess allows" `sts:AssumeRole`; `d1c7`'s question ("a one-year commitment keeps costing for the 355 days a year the shop is closed").
- **Scenes in `why`** are framing by design. The two with a number in them: `d1c1` (200 engineers, 30 accounts) and `d2c2` (15 VPCs give "over a hundred connections": 15 × 14 / 2 = 105, the model answer's n(n–1)/2).

## Found elsewhere (not changed)

- `site/plan.js` `d1d1` note: see the first "Not sure" item.
- `site/plan.js` `d4s1` text says "distro package or the official installer"; the owner is on Windows, where only the MSI installers apply. The card says both.
- `d2b2` creates an IAM role (`lab-ssm` in the card) that `d2b5`'s cleanup doesn't delete. It is free and trusts only EC2, so I left the plan as it is; a line in `d2b5` could ask to delete it.
