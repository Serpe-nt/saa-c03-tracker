# Pool 12 (identity and access in depth): sources per question

Written 2026-10-12/13. Every page below was fetched in this session without following redirects and answered a plain 200; a fact counts as supported when the sentence or table entry was found in the page text. Short page names used below:

- IAM = `https://docs.aws.amazon.com/IAM/latest/UserGuide/` + file name
- IdC = `https://docs.aws.amazon.com/singlesignon/latest/userguide/` + file name
- Org = `https://docs.aws.amazon.com/organizations/latest/userguide/` + file name
- Cog = `https://docs.aws.amazon.com/cognito/latest/developerguide/` + file name
- SM = `https://docs.aws.amazon.com/secretsmanager/latest/userguide/` + file name
- KMS = `https://docs.aws.amazon.com/kms/latest/developerguide/` + file name

Scope was read from the exam guide: `…/solutions-architect-associate-03-domain1.html` (Task 1.1–1.3) and `…/saa-03-in-scope-services.html` (Security, Identity, and Compliance list).

## Per question

| Id | Key rests on | Each distractor rejected by |
|---|---|---|
| q12-001 | IAM `reference_policies_evaluation-logic_policy-eval-denyallow.html`: "resource-based policies that grant permissions to an IAM user ARN … are not limited by an implicit deny in an identity-based policy or permissions boundary"; "For most resources, you only need an explicit Allow … in either" | A: IAM `reference_policies_evaluation-logic-cross-account.html` (both sides only for cross-account). C: same page (implicit vs explicit deny). D: same sentence as the key. |
| q12-002 | IAM `access_policies_boundaries.html`: "limits the user's permissions but does not provide permissions on its own"; "only the actions that are allowed by both" | A, B: same sentences. C: IAM `id_roles.html` (trust policy = who can assume). |
| q12-003 | IAM `access_policies.html`, Session policies: "the intersection of the identity-based policies … and the session policies"; passed with `AssumeRole` | B: `access_policies_boundaries.html` (boundary is set on the entity). C: reasoning from the same intersection rule. D: IAM `best-practices.html` ("Require workloads to use temporary credentials with IAM roles"). |
| q12-004 | IAM `tutorial_attribute-based-access-control.html`: first and third condition blocks (`aws:ResourceTag` = `aws:PrincipalTag`, `aws:RequestTag` = `aws:PrincipalTag`), `DenyUntag…ReservedTags` statement; IAM `access_tags.html` | A: IAM `introduction_attribute-based-access-control.html` (RBAC needs policy updates for new resources). B, D: reasoning (neither touches the tagging actions). The stem says "resources" on purpose: the tutorial shows this for Secrets Manager; the EC2 tagging pages fetched did not show the same conditions. |
| q12-005 | IAM `access-analyzer-policy-validation.html` ("against IAM policy grammar and AWS best practices … security warnings, errors, general warnings, and suggestions"; CLI/API section); IAM `access-analyzer-custom-policy-checks.html` (`check-no-new-access`, `CheckNoNewAccess`) | B, E: IAM `what-is-access-analyzer.html`. C: IAM `id_credentials_getting-report.html`. |
| q12-006 | IAM `reference_policies_examples_s3_home-directory-console.html` (`home/${aws:username}/*`; "will not work when using IAM roles"); IAM `reference_policies_variables.html` | A, B: reasoning (work, but per person). C: `access_tags.html` (tags act only through conditions). |
| q12-007 | IAM `access_policies_managed-vs-inline.html` (customer managed: you change it; AWS managed: "You cannot change the permissions"; AWS updates reach all attached identities); IAM `access_policies_managed-versioning.html` ("up to five versions"; "IAM does not support versioning for inline policies") | A: evaluation logic (allows add up). C, D: the two pages above. |
| q12-008 | IAM `confused-deputy.html`, cross-service section: CloudTrail/S3 example, "We recommend using aws:SourceArn, aws:SourceAccount …" | B: same page (external ID is a trust policy condition for `AssumeRole`). C: same page ("the resource policy … is only authorizing the AWS service principal"). D: reasoning. |
| q12-009 | IAM `reference_policies_examples_aws_deny-ip.html` (Deny with `NotIpAddress` on `aws:SourceIp`; "does not allow any actions"; requests by AWS services through forward access sessions are not denied) and the evaluation page ("An explicit deny overrides an explicit allow") | A: evaluation logic. B: `https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html`. D: reasoning. |
| q12-010 | IAM `id_roles_use_passrole.html`: "filter the iam:PassRole permission with the Resources element"; example with `role/EC2-roles-for-XYZ-*` | A: same page (trust policy names the service). C: same page, warning ("Do not try to control who can pass a role by tagging the role …"). D: reasoning. |
| q12-011 | IAM `confused-deputy.html`: "generates a unique ExternalId value for each customer … must be unique among Example Corp's customers and controlled by Example Corp, not its customers" | A, B: same sentences. C: reasoning. |
| q12-012 | IAM `id_roles_use_switch-role-ec2.html`: "you can make a change to that one role and the change propagates automatically to all the instances"; "Only one role can be assigned to an Amazon EC2 instance at a time" | B: also IAM `id_roles_use_switch-role-ec2_instance-profiles.html` ("only one IAM role"). C, D: same page (roles replace stored credentials; role can be attached to a running instance). |
| q12-013 | IAM `id_roles_create-service-linked-role.html` ("can view, but not edit the permissions"; "only that service can assume"; delete only after related resources); `https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAM.ServiceLinkedRoles.html` (name `AWSServiceRoleForRDS`; "does not allow you to edit") | A, B, D: the same two pages. |
| q12-014 | IAM `id_roles.html`, Role chaining: "limits … to a maximum of one hour. It applies regardless of the maximum session duration … the operation fails" | A: same sentence. B: IAM `id_credentials_temp_request.html` (`GetSessionToken` "to an existing IAM user"). C: `confused-deputy.html`. |
| q12-015 | IAM `reference_policies_elements_principal.html`: role ARN "transforms to the role's unique principal ID"; after delete and recreate "you must edit the role in the policy" | A, C, D: same passage. |
| q12-016 | `https://docs.aws.amazon.com/rolesanywhere/latest/userguide/trust-model.html`: subject RDNs mapped to `PrincipalTag` elements; "recommended to have additional condition statements"; example with `aws:PrincipalTag/x509Subject/CN` | A: same page (any certificate from the CA validates). B: boundaries page. D: `…/rolesanywhere/latest/userguide/introduction.html`. Note: the page's example uses CN; OU follows from "maps Relative Distinguished Names (RDNs)". |
| q12-017 | IAM `access_policies-cross-account-resource-access.html`: "Use a role as a proxy when you want to access resources in another account that do not support resource-based policies"; IAM `reference_aws-services-that-work-with-iam.html`: Amazon EC2, resource-based policies "No" | A: the table. B: cross-account evaluation page. C: stem. |
| q12-018 | IdC `provision-automatically.html` (SCIM v2.0; intervals and deprovisioning controlled by the provider); IdC `manage-your-identity-source-idp.html` ("SAML protocol does not provide a way to query the IdP") | B, D: IdC `manage-your-identity-source.html` ("only one identity source per organization"; Identity Center directory = you create users). C: IAM `id_roles_providers.html` (IAM federation: single account). |
| q12-019 | IdC `permissionsetcustom.html`: "When you create an inline policy … IAM Identity Center configures the policies in your AWS accounts for you. When you build your permission set with Customer managed policies, you must create the policies in your AWS accounts yourself" | A: same sentence. C: IdC `permissionsetsconcept.html` ("IAM Identity Center manages the role"). D: reasoning. |
| q12-020 | IAM `id_roles_providers.html` (single account without Identity Center: SAML 2.0 or OIDC); IAM `id_roles_providers_saml.html` ("map users or groups in your organization to the IAM roles"); IAM `id_roles_providers_enable-console-saml.html` | A: stem. C: Cog `what-is-amazon-cognito.html`. E: IAM `id_roles_providers_oidc.html`. |
| q12-021 | IAM `id_roles_providers_oidc.html`; IAM `id_roles_create_for-idp_oidc.html` (GitHub: `token.actions.githubusercontent.com:sub`, `sts:AssumeRoleWithWebIdentity`) | A, B: reasoning. D: `…/rolesanywhere/latest/userguide/getting-started.html` ("Certificates issued from public CAs cannot be used as trust anchors"). |
| q12-022 | `https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_SQLServerWinAuth.html` ("supports using only AWS Managed Microsoft AD … doesn't support using AD Connector"; forest trust for on-premises AD) | A, B, C: `https://docs.aws.amazon.com/directoryservice/latest/admin-guide/what_is.html` (AD Connector and Simple AD "not compatible with RDS SQL Server"; Simple AD has no trusts; Cognito for app subscribers). |
| q12-023 | IdC `enable-mfa.html` ("MFA in IAM Identity Center is currently not supported for external identity providers"); `https://aws.amazon.com/iam/identity-center/faqs/` ("you can enable multi-factor authentication capabilities of your provider"; no passwords or MFA devices held) | A: first page. C: FAQ ("does not create IAM users"). D: IdC `howtosessionduration.html`. |
| q12-024 | IAM `id_credentials_mfa.html` ("up to eight MFA devices"; "recommend that you enable multiple MFA devices"; passkeys and security keys phishing-resistant, stronger than TOTP) | B: IAM `root-user-best-practices.html`. D, E: IAM `enable-mfa-for-root.html` (all account types require root MFA). |
| q12-025 | `https://aws.amazon.com/compliance/shared-responsibility-model/`: Inherited (physical and environmental), Shared (patch management, configuration management, awareness and training), Customer specific (zone security) | Every option maps to one of those lines. |
| q12-026 | Org `orgs_manage_policies_scps_evaluation.html`: "explicit Allow statement at every level from the root through each OU" | B, C: Org `orgs_manage_policies_scps.html` (SCPs grant nothing; affect users and roles, including root). D: evaluation page. |
| q12-027 | Org `orgs_manage_policies_scps.html`: "SCPs do not affect any service-linked role"; list "Tasks and entities not restricted by SCPs". IAM `id_roles_use_passrole.html`: Auto Scaling uses `AWSServiceRoleForAutoScaling` for all operations on a group | A, B, D: same SCP page. |
| q12-028 | Org `orgs_manage_policies_rcps.html` ("Use an RCP when you need to restrict IAM principals that are external"; S3, Secrets Manager in the supported list; management account not affected); Org `orgs_manage_policies_authorization_policies.html` | A: SCP page ("don't affect users or roles from accounts outside the organization"). B: IAM `what-is-access-analyzer.html`. C: reasoning. |
| q12-029 | `https://docs.aws.amazon.com/ram/latest/userguide/getting-started-sharing.html` (enable sharing with Organizations; no invitations; a new account in the OU "automatically gets access"); `…/ram/latest/userguide/shareable.html` (transit gateways) | A, C, D: reasoning against the same pages. |
| q12-030 | Cog `what-is-amazon-cognito.html`; Cog `cognito-user-pools-identity-federation.html` ("standardize on one set of user pool tokens"); Cog `cognito-user-pools-saml-idp.html` | A: IdC `what-is.html` (workforce), `manage-your-identity-source.html`. B: IAM `id_roles_providers.html`. D: Cog overview (identity pool = AWS credentials). |
| q12-031 | Cog `what-is-amazon-cognito.html` ("limited-privilege credentials to guest users who haven't signed in"); Cog `identity-pools.html`; Cog `role-based-access-control.html` | B, C: reasoning. D: IAM `reference_policies_condition-keys.html`, `aws:UserAgent` warning. |
| q12-032 | Cog `cognito-user-pools-user-groups.html` (IAM role per group); Cog `role-based-access-control.html` (`cognito:roles`, `cognito:preferred_role`, choose role from token) | A, C, D: reasoning. |
| q12-033 | SM `rotation-strategy.html` (single user: "low risk of the database denying calls"; alternating users: "appropriate for applications that require high availability", superuser secret) | A: same page. B: SM `replicate-secrets.html` ("new secret value propagates to all of the associated replica secrets"). C: Parameter Store page, table row "Credential rotation: None". |
| q12-034 | SM `auth-and-access_resource-policies.html`, example "Require requests to come through a VPC endpoint" (Deny, `StringNotEquals`, `aws:sourceVpce`) and its note on other AWS services | A: IAM condition keys page (`aws:SourceIp` only public ranges; not available through a VPC endpoint). C, D: reasoning. |
| q12-035 | `https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html`: table "Where should I store my application data?" (use cases, rotation, cost rows), hierarchies, IAM by path | B, C, E: same table. |
| q12-036 | KMS `keystore-cloudhsm.html`; KMS `key-store-overview.html`; `https://aws.amazon.com/cloudhsm/faqs/` ("AWS services integrate with AWS Key Management Service, which in turn is integrated with AWS CloudHSM through the KMS custom key store feature"; single-tenant) | A: the FAQ sentence. B, D: `key-store-overview.html` (standard key store "tenant-agnostic fleet of HSMs"; imported material sits in the standard key store). |
| q12-037 | KMS `grants.html`: "often used for temporary permissions because you can create one, use its permissions, and delete it without changing your key policies or IAM policies"; one key, one grantee | A, B, C: reasoning against the stem. |
| q12-038 | `https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html` (stateful, IPS, NAT gateway traffic, "stateful protocol detection … independent of the port used"); `https://aws.amazon.com/network-firewall/faqs/` (AWS managed rule groups) | B: `…/vpc/latest/userguide/vpc-network-acls.html`. C: `…/guardduty/latest/ug/what-is-guardduty.html`. D: `…/waf/latest/developerguide/shield-chapter.html`. |
| q12-039 | `https://docs.aws.amazon.com/waf/latest/developerguide/security-group-policies.html` ("Audit security group rules, to locate and remediate noncompliant rules"; automatic remediation); `…/fms-chapter.html` (applies to new accounts) | A: `…/waf-chapter.html`. B: Shield page. D: reasoning. |
| q12-040 | `https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html`; `…/standards-reference.html` (PCI DSS; "don't guarantee compliance") | A: `https://docs.aws.amazon.com/artifact/latest/ug/what-is-aws-artifact.html`. C: `…/detective/latest/userguide/what-is-detective.html`. D: GuardDuty page. |

## New DOCS entries

The test failure "unknown doc" for exactly these keys is expected until they are added to `site/quiz/meta.js`.

```
"iam-policy-eval":      ["Policy evaluation logic (IAM User Guide)", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html"],
"iam-policies":         ["Policies and permissions in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html"],
"iam-boundaries":       ["Permissions boundaries for IAM entities", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html"],
"iam-abac":             ["Define permissions based on attributes with ABAC", "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html"],
"access-analyzer":      ["Using IAM Access Analyzer", "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html"],
"iam-variables":        ["IAM policy elements: Variables and tags", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_variables.html"],
"iam-managed-policies": ["Managed policies and inline policies", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html"],
"confused-deputy":      ["The confused deputy problem (IAM User Guide)", "https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html"],
"iam-passrole":         ["Grant a user permissions to pass a role to an AWS service", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_passrole.html"],
"iam-roles-ec2":        ["Use an IAM role for applications on Amazon EC2 instances", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html"],
"iam-slr":              ["Create a service-linked role", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create-service-linked-role.html"],
"iam-roles":            ["IAM roles (IAM User Guide)", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html"],
"iam-principal":        ["AWS JSON policy elements: Principal", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html"],
"iam-cross-account":    ["Cross account resource access in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies-cross-account-resource-access.html"],
"roles-anywhere":       ["What is IAM Roles Anywhere?", "https://docs.aws.amazon.com/rolesanywhere/latest/userguide/introduction.html"],
"iam-federation":       ["Identity providers and federation into AWS", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers.html"],
"iam-mfa":              ["AWS Multi-factor authentication in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html"],
"scp":                  ["Service control policies (AWS Organizations User Guide)", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"],
"rcp":                  ["Resource control policies (AWS Organizations User Guide)", "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html"],
"secrets-rotation":     ["Rotate AWS Secrets Manager secrets", "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html"],
"kms-grants":           ["Grants in AWS KMS", "https://docs.aws.amazon.com/kms/latest/developerguide/grants.html"],
```

Page titles are the headings as fetched, shortened where long; check them with `node tools/links.mjs` after adding. If 21 new keys are too many, every IAM one can fall back to the existing `iam` key.

## Could not settle, or rests on inference

- q12-004: the conditions are documented for Secrets Manager in the ABAC tutorial. The stem therefore speaks of "resources", not of a named service.
- q12-008, option C: that delivery would fail when the statement names the account in place of the service principal is inferred from "the resource policy … is only authorizing the AWS service principal"; no page states the failure in words.
- q12-016: `x509Subject/OU` is inferred from the general RDN mapping; the page's own example uses CN.
- q12-022: RDS for SQL Server can reportedly also join a self-managed Active Directory directly. No page on that was fetched, it is not an option, and the explanation does not mention it.
- q12-028: no fetched page shows `aws:PrincipalOrgID` inside an RCP; the key combines the RCP page (restrict external principals) with the condition key's description. The explanation says exceptions for AWS services are needed.
- q12-029, option D and q12-037, options A–C: rejected by reasoning against the stem, not by a sentence.
- q12-035: "standard tier free" and the billing rows are quoted from the comparison table in the Parameter Store guide, not from a pricing page.
- Statements such as "more to maintain" are judgements.

## Second read

A sub-agent that saw only stems and options answered all 40; every answer matched the key. Reworked after its objections: q12-014 (the keyed option now says to repeat both role assumptions, and the explanation says the first role's credentials expire too), q12-036 (explanation names the external key store). Before that read: q12-038 was replaced because it repeated q08-030 (same Network Firewall decision); q12-004 options were rebalanced. Left as they are: q12-010 (the ResourceTag restriction on `iam:PassRole` is documented and the explanation states it), q12-009 (the AWS example page says service calls through forward access sessions are not denied).

## Checks

- `node --check site/quiz/d12.js`: ok.
- `node tools/qstats.mjs d12`: 40 questions, domains 38/1/0/1, choose-two 6, answer positions 10/12/10/12/2, keyed option clearly longest 0.
- `node tools/similar.mjs 0.38`: no pair with a q12 id. At 0.34 none either after q12-038 was replaced.
- `node --test`: 2 failures, both expected: key-points coverage (other sessions) and "unknown doc" for the keys above.

## Found elsewhere (not fixed)

- q04-041 and m2-039 key Parameter Store SecureString for API keys and partner tokens. The Parameter Store guide now says: "Use SecureString for configuration values that require encryption, such as service endpoints and account identifiers. For secrets such as database credentials, API keys, or tokens, we recommend AWS Secrets Manager." Both keys rest on cost and may still be defensible, but the explanations should mention the recommendation.
- q08-030 explanation says security group rules "accept only CIDR ranges, prefix lists or security groups": not checked here, noted only because q12-038 first repeated that question.
- `saa-plan/CLAUDE.md` and `docs/questions.md` still describe 14 days, pools d01–d11 and `ref` as required.
- Exam guide in-scope list now prints "Amazon Quick" and still lists "AWS Snow Family" and "AWS Application Migration Service".
