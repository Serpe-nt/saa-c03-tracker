# Pool 15 (`site/quiz/d15.js`): sources per question

Written 2026-10-12/13. 40 questions, `q15-001` … `q15-040`. Every page below was fetched without following redirects and read as text; a statement counts as supported when the sentence was found on the page. "Key" = why the keyed option holds; "Rejects" = what backs the explanation of each wrong option. Judgement statements ("more to operate", "the team would maintain it itself") have no source page.

Short names used below:

- CFN = `https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/`
- CFN-TR = `https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/`
- SSM = `https://docs.aws.amazon.com/systems-manager/latest/userguide/`
- BK = `https://docs.aws.amazon.com/aws-backup/latest/devguide/`
- GA = `https://docs.aws.amazon.com/global-accelerator/latest/dg/`
- EB = `https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/`

## Infrastructure as code

- **q15-001** Key: CFN `using-cfn-updating-stacks-changesets.html` (preview of added, modified, deleted, replaced resources; nothing changes until executed). Rejects: drift = CFN `using-cfn-stack-drift.html`; termination protection "applies only to attempts to delete stacks" = CFN `using-cfn-protect-stacks.html`. The rollback sentence is reasoning.
- **q15-002** Key: CFN-TR `aws-attribute-deletionpolicy.html` (Snapshot; list includes `AWS::Redshift::Cluster`, `AWS::EC2::Volume`). Rejects: Retain "continue to exist and continue to incur applicable charges" (same page); CFN-TR `aws-attribute-updatereplacepolicy.html`; CFN `using-cfn-protect-stacks.html`.
- **q15-003** Key: CFN `using-cfn-stack-drift.html`, `detect-drift-stack.html`. Rejects: update acts on "differences between what you submit and the stack's current template and parameters" = CFN-TR `aws-attribute-updatereplacepolicy.html`. No change-set distractor on purpose: drift-aware change sets exist (CFN `drift-aware-change-sets.html`).
- **q15-004** Key: CFN `what-is-cfnstacksets.html`, `stacksets-concepts.html`, `stacksets-prereqs-self-managed.html`. Rejects: service-managed = Organizations accounts (`stacksets-concepts.html`); nested stacks = CFN `using-cfn-nested-stacks.html`; exports same account and Region = CFN `using-cfn-stack-exports.html`.
- **q15-005** Key: `https://docs.aws.amazon.com/servicecatalog/latest/adminguide/introduction.html`, `…/constraints-launch.html` ("Without a launch constraint, end users must launch and manage products using their own IAM credentials"). Rejects: reasoning from the same two pages.
- **q15-006** Key: CFN `using-cfn-stack-exports.html` (same account and Region; exporting stack can't be deleted or the value modified while imported). Rejects: nested stacks "deploy and manage all resources from a single stack" (same page); StackSets = `stacksets-concepts.html`.

## Governance

- **q15-007** Key: `https://docs.aws.amazon.com/controltower/latest/controlreference/control-behavior.html`, `…/proactive-controls.html`. Rejects: detective = Config rules (same page); Region deny = `https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html`; drift = CFN `using-cfn-stack-drift.html`.
- **q15-008** Key: `https://docs.aws.amazon.com/license-manager/latest/userguide/license-manager.html` (vCPUs, hard or soft limits, across accounts in an organization), `…/license-rules.html` (AMI association, "can prevent resources from launching"). Rejects: Config, Inventory, Dedicated Hosts are described by reasoning; no page says they cannot do it.
- **q15-009** Key: `https://docs.aws.amazon.com/health/latest/ug/what-is-aws-health.html` (EventBridge at no additional cost for all customers; API needs Business Support+, Enterprise Support or Unified Operations), `…/cloudwatch-events-health.html`. Rejects: public page shows only public events = `…/aws-health-dashboard-status.html`; the status-check sentence is reasoning.
- **q15-010** Key: SSM `patch-manager.html` (EC2, on-premises servers, VMs; custom patch baselines; recurring patching; compliance reporting). Rejects: Inspector = `https://aws.amazon.com/inspector/faqs/` (scans for vulnerabilities and network exposure); Run Command = SSM `run-command.html`.
- **q15-011** Key: SSM `systems-manager-automation.html` (approvals, multiple accounts and Regions, concurrency and error control). Rejects: SSM `run-command.html`, `systems-manager-state.html`, `patch-manager.html`.
- **q15-012** Key: `https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_tag-policies.html`, `…/orgs_manage_policies_tag-policies-enforcement.html` ("Basic compliance rules do not enforce tag compliance on resources that are created without tags … Use SCPs …"). Rejects: reasoning.
- **q15-013** Key: `https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html`, `…/view-ec2-recommendations.html` (under-provisioned, over-provisioned, optimized). Rejects: low-utilization check criteria = `https://docs.aws.amazon.com/awssupport/latest/user/cost-optimization-checks.html`; Budgets and Savings Plans sentences are general descriptions.

## CloudWatch

- **q15-014** Key: `https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html`, `https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html` (data source, IAM Identity Center). Rejects: Container Insights = `https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html`. That page says OTel Container Insights for EKS supports PromQL, so the explanation rejects the option for rebuilding the dashboards, not for lacking PromQL.
- **q15-015** Key: `https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-combining.html`. Rejects: reasoning; the SNS filter policy sentence is from general knowledge, not a fetched page.
- **q15-016** Key: `https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html` (monitoring and source accounts; Organizations recommended so new accounts are onboarded). Rejects: general descriptions of CloudTrail and Config aggregators.

## Migration & transfer

- **q15-017** Key: `https://docs.aws.amazon.com/mgn/latest/ug/what-is-mgn.html`, `https://aws.amazon.com/application-migration-service/faqs/`. Old name still in the exam guide: `https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html`. Rejects: reasoning.
- **q15-018** Key: `https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html` (full load and CDC, CSV by default, Parquet optional), `https://aws.amazon.com/dms/faqs/` (data lake). Rejects: reasoning.
- **q15-019** Key: `https://docs.aws.amazon.com/dms/latest/userguide/CHAP_SchemaConversion.html` (assessment report; "converts your database schema, not your data"). Rejects: DMS creates tables and primary keys = `…/Welcome.html`.
- **q15-020** Key: `https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html`, `…/do-i-need-datasync-agent.html` (no agent between S3 and object storage in other clouds), `https://aws.amazon.com/datasync/faqs/` (initial copy, scheduled incremental transfers, encryption and integrity validation). Rejects: reasoning.
- **q15-021** Key: `https://aws.amazon.com/aws-transfer-family/faqs/` (fixed IPs: VPC hosted endpoint, internet-facing, Elastic IPs; not supported on PUBLIC), `https://docs.aws.amazon.com/transfer/latest/userguide/create-server-in-vpc.html`.
- **q15-022** Key: `https://aws.amazon.com/aws-transfer-family/faqs/` (identity provider options; service managed = SSH keys, SFTP only; AD groups), `https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html` (S3 and EFS only). Identity Center for web apps: same FAQ.
- **q15-023** Key: `https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html` (no longer available to new customers; DataSync, Data Transfer Terminal, partners; DataSync with a Direct Connect hosted connection from a Delivery Partner). End of support 2026-12-31: `https://aws.amazon.com/snowball/`. Hosted connection speeds up to 25 Gbps: `https://aws.amazon.com/directconnect/faqs/`. Arithmetic: 600 TB at 200 Mbps is about 278 days.

## Regions & AZs

- **q15-024** Key: `https://docs.aws.amazon.com/local-zones/latest/ug/how-local-zones-work.html`, `https://aws.amazon.com/about-aws/global-infrastructure/localzones/faqs/` (single-digit millisecond latency, no own data center). Rejects: Outposts site = `https://docs.aws.amazon.com/outposts/latest/userguide/what-is-outposts.html`; Wavelength = `https://docs.aws.amazon.com/wavelength/latest/developerguide/what-is-wavelength.html`.
- **q15-025** Key: Wavelength `what-is-wavelength.html`, `how-wavelengths-work.html` (carrier gateway). Rejects: reasoning.
- **q15-026** Key: Outposts `what-is-outposts.html`, `https://aws.amazon.com/outposts/rack/faqs/` (data that needs to remain on premises). Rejects: reasoning.

## Global Accelerator

- **q15-027** Key: `https://aws.amazon.com/global-accelerator/faqs/` (TCP and UDP; non-HTTP such as gaming, IoT, Voice over IP; single Region benefit). Rejects: CloudFront "HTTP or WebSocket" = `https://aws.amazon.com/cloudfront/faqs/`; `https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-latency.html`.
- **q15-028** Key: GA `what-is-global-accelerator.html` (two static IPv4 addresses, kept while the accelerator exists). Rejects: Elastic IP "for use in a specific Region only" = `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html`; Anycast Static IPs, 21 IPv4 for allowlisting = `https://aws.amazon.com/cloudfront/faqs/`.
- **q15-029** Key: GA `about-endpoints-endpoint-weights.unhealthy-endpoints.html` (failover ignores the traffic dial; weight must be above zero; fails open), `about-endpoint-groups-traffic-dial.html`.

## Hybrid connectivity

- **q15-030** Key: `https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/what-is.html` (managed, authorization rules by IdP group), `…/client-authentication.html` (SAML). Rejects: `https://aws.amazon.com/vpn/faqs/` (Site-to-Site vs Client VPN).
- **q15-031** Key: `https://docs.aws.amazon.com/vpn/latest/s2svpn/vpn-route-priority.html` (longest prefix first; Direct Connect BGP routes preferred over VPN routes), `https://aws.amazon.com/directconnect/faqs/` (backup VPN: "all VPC traffic will failover to the VPN connection automatically").
- **q15-032** Key: `https://docs.aws.amazon.com/vpn/latest/s2svpn/private-ip-dx.html`. Rejects: `https://docs.aws.amazon.com/directconnect/latest/UserGuide/MACsec.html` (layer 2, dedicated connections, not hosted; physical-layer encryption between locations and Regions), `…/encryption-in-transit.html`.

## AWS Backup

- **q15-033** Key: BK `vault-lock.html` (governance mode removable with sufficient IAM permissions; compliance immutable after grace time; deletes denied including root).
- **q15-034** Key: BK `cross-region-backup.html`, `restore-testing.html`, `https://aws.amazon.com/backup/faqs/`. Rejects: BK `whatisbackup.html` (Backup Audit Manager), `vault-lock.html`.
- **q15-035** Key: BK `assigning-resources.html` (tags), `manage-cross-account.html` (policy creates a plan in each account).

## Elastic Beanstalk

- **q15-036** Key: EB `environment-platform-update-managed.html` (maintenance window, no reduction in capacity), `Welcome.html` (no additional charge).
- **q15-037** Key: EB `using-features.rolling-version-deploy.html` (all five policies as described).

## Data transfer costs

- **q15-038** Key: `https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html`, `…/nat-gateway-basics.html` (resilience; extra addresses raise connections). Exam guide task 4.4 names this choice.
- **q15-039** Key: `https://aws.amazon.com/s3/pricing/` (no charge from a bucket to AWS services in the same Region), `https://aws.amazon.com/blogs/architecture/overview-of-data-transfer-costs-for-common-architectures/`. Rejects: `https://aws.amazon.com/s3/faqs/` (gateway endpoints for the same Region; CRR pays inter-Region data transfer out).
- **q15-040** Key: `https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html`. Rejects: Origin Shield = `https://aws.amazon.com/cloudfront/faqs/`; price class and Transfer Acceleration sentences are general descriptions.

## New DOCS entries

The main session adds these to `site/quiz/meta.js`; each URL answered a plain 200 when fetched.

```
"service-catalog":  ["AWS Service Catalog FAQs", "https://aws.amazon.com/servicecatalog/faqs/"],
"license-manager":  ["AWS License Manager FAQs", "https://aws.amazon.com/license-manager/faqs/"],
health:             ["What is AWS Health?", "https://docs.aws.amazon.com/health/latest/ug/what-is-aws-health.html"],
prometheus:         ["Amazon Managed Service for Prometheus FAQs", "https://aws.amazon.com/prometheus/faqs/"],
"cw-cross-account": ["CloudWatch cross-account observability", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html"],
"snowball-change":  ["AWS Snowball Edge availability change", "https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html"],
"local-zones":      ["AWS Local Zones FAQs", "https://aws.amazon.com/about-aws/global-infrastructure/localzones/faqs/"],
wavelength:         ["AWS Wavelength FAQs", "https://aws.amazon.com/wavelength/faqs/"],
"client-vpn":       ["What is AWS Client VPN?", "https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/what-is.html"]
```

## Second read

A sub-agent that saw only stems and options answered all 40 and argued for other options. Its answers matched all 40 keys. Reworked after its report:

- q15-023: stem no longer hints with "older guide … today"; it now states that a Delivery Partner can deliver a multi-gigabit connection within two weeks and that the institute never used Snow devices.
- q15-033: stem said "nobody, including the root user", which strains governance mode; reworded to "requests are denied for every user while the protection is in place".
- q15-028: "two IPv4 addresses" (a dual-stack accelerator has four).
- q15-024: the stem now says the city has a Local Zone.
- q15-029: the weight-0 explanation now gives the fail-open behaviour.
- q15-014: "move the dashboards" instead of "build".
- q15-012: "every member account" (SCPs do not act on the management account).

Left as they are: several stems the reader found easy or close to the documentation's wording (q15-035 to q15-037, q15-039).

## Not settled

- q15-003: whether drift detection shows an added inbound rule depends on how the template declares the rules (inline or as separate ingress resources). The stem does not say; no page was read for it.
- q15-008: tracking across accounts needs the self-managed license shared with the organization; the option does not spell this out.
- q15-010: the on-premises servers must first be registered as managed nodes; the option says "all managed nodes" without the registration step.
- q15-015: the SNS filter policy sentence, and q15-027's description of cross-zone load balancing, are from general knowledge.
- q15-020: "no agent" holds for S3 and object storage in other clouds; other source types in another cloud (file shares) do need one.
- q15-023: Direct Connect delivery times vary by place; the stem fixes it at two weeks.
- No prices are compared. Statements that a design "reduces a charge" rest on AWS's own wording on the pages named above.

## Found elsewhere (not changed)

- q06-021: Control Tower preventive controls are now implemented with SCPs, RCPs and declarative policies (`control-behavior.html`); the keyed option names SCPs only. True, incomplete.
- `docs/questions.md` still describes the 14-day plan and says refs are required.
- AWS lifecycle list, maintenance: Application Discovery Service, Migration Hub, Systems Manager Incident Manager and Change Manager. DMS Fleet Advisor and DataSync Discovery are fully shut down, though the DMS "What is" page still mentions Fleet Advisor.
- CloudFormation exports page: `Fn::GetStackOutput` now reads outputs across accounts and Regions, so "cross-stack references are same account and Region only" holds for `Fn::ImportValue`, not for CloudFormation as a whole.
