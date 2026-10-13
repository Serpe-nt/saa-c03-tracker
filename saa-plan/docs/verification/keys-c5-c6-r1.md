# Key points for c5, c6 and r1: sources and status

Written 2026-10-12/13 for 18 new plan steps: `site/keys/c5.js` (c5a–c5e, l5a, l5b), `site/keys/c6.js` (c6a–c6e, l6a, l6b), `site/keys/r1.js` (r1a–r1d).

## How it was done

- **Bank first.** The questions tagged with the steps' topics (`STEP_TAGS`) were read before writing, 261 in all, so the points cover what those questions decide on.
- **Sources.** About 230 pages on docs.aws.amazon.com and aws.amazon.com were fetched in this session (plain 200, redirects not followed) and each sentence was looked up in the page text. The URLs under each sentence below are those pages.
- **Labs.** The four lab description pages on skillbuilder.aws were opened in the Browser pane and read (description, objectives, AWS services). The lab points are about those objectives; nothing claims what a lab step makes you click.
  - l5a Resource Governance: AWS Config rules for tagging standards and for S3 bucket versioning and encryption (services: Config, EC2, KMS, S3).
  - l5b Automate Infrastructure Compliance with AWS Config: managed rules, automated remediation, the Config dashboard.
  - l6a Connecting VPCs: VPC peering between two VPCs, including subnet-specific peering configurations.
  - l6b Securing Hybrid Access: gateway against interface endpoints, PrivateLink, forwarding rules with Route 53; services PrivateLink, Route 53, S3, Site-to-Site VPN, VPC.
- **Lectures.** The videos need a login and were not watched. The lecture points follow the lesson names in plan.js and the topics, not the videos.
- **Reuse.** Checked sentences of retired steps were adapted and looked up again: d4b4 and d4b5 (c5c), d6w2 (c5d), d6w4 (c6d), d6w3 (c6e), d2p2 (l6a).
- **Second read.** Three sub-agents that had not seen these sources each re-checked one file against pages they fetched themselves. Result: no sentence wrong, none unfindable; 13 sentences were narrower on the page than in the file and were reworded (list below). Each reworded claim was then looked up on a page fetched in this session.

## Sentences and their sources

### c5a

- **k1** An AWS account is an isolation boundary. Separate accounts per workload or environment limit the scope of impact of an incident, allow distinct security controls per environment, and split costs and service quotas.
  - https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/benefits-of-using-multiple-aws-accounts.html
- **k2** AWS Organizations groups accounts into organizational units (OUs). An SCP attached to the root or to an OU applies to every OU and member account underneath it, so where an account sits decides which guardrails it gets.
  - https://docs.aws.amazon.com/organizations/latest/userguide/orgs_getting-started_concepts.html
  - https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_evaluation.html
- **k3** An SCP grants nothing. It limits what IAM users and roles in member accounts can do, including each member account's root user, and the effective permissions are the overlap of the SCPs and the IAM policies.
  - https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html
- **k4** For an action to be allowed, an Allow must exist at every level from the root through each OU to the account, which is why Organizations attaches &lt;code>FullAWSAccess&lt;/code> when SCPs are enabled. A Deny at any one level blocks everything underneath.
  - https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_evaluation.html
- **k5** AWS Control Tower builds a landing zone on top of Organizations with preventive controls (SCPs and other Organizations policies), detective controls (AWS Config rules), proactive controls (CloudFormation hooks) and Account Factory to provision new accounts.
  - https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html
  - https://docs.aws.amazon.com/controltower/latest/controlreference/control-behavior.html
- **trap** SCPs never affect the management account or service-linked roles, so AWS says to keep workloads out of the management account. An SCP also does not apply to outside users of your resources; the cap on resources is a resource control policy (RCP).
  - https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html
  - https://docs.aws.amazon.com/organizations/latest/userguide/orgs_best-practices_mgmt-acct.html
  - https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html

### c5b

- **k1** An ALB HTTPS listener terminates TLS and decrypts requests before sending them to the targets. If only the targets may decrypt, use a Network Load Balancer with a TCP listener on port 443, which passes the traffic through still encrypted.
  - https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html
  - https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html
- **k2** ACM automatically renews a certificate it issued with DNS validation while the certificate is in use and its CNAME record stays in DNS; imported certificates get no managed renewal. A certificate for CloudFront must be requested or imported in us-east-1.
  - https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html
  - https://docs.aws.amazon.com/acm/latest/userguide/dns-renewal-validation.html
  - https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html
- **k3** AWS WAF filters HTTP(S) requests with a protection pack (web ACL) that you associate with a CloudFront distribution, an Application Load Balancer, an API Gateway REST API, an AppSync GraphQL API or a Cognito user pool, among others.
  - https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html
  - https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works-resources.html
- **k4** Pick the WAF rule by the attack: AWS managed rule groups for common exploits such as those in the OWASP Top 10, a rate-based rule for clients that send requests too fast, a geo match rule for countries you must block.
  - https://docs.aws.amazon.com/waf/latest/developerguide/waf-managed-rule-groups.html
  - https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html
  - https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-geo-match.html
- **k5** Shield Standard protects against DDoS automatically at no extra charge. Shield Advanced is a subscription with protection added per resource; it adds the Shield Response Team (needs a Business or Enterprise support plan) and credits for attack-driven charges.
  - https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html
  - https://docs.aws.amazon.com/waf/latest/developerguide/ddos-advanced-summary.html
  - https://docs.aws.amazon.com/waf/latest/developerguide/ddos-srt-support.html
  - https://docs.aws.amazon.com/waf/latest/developerguide/ddos-request-service-credit.html
- **trap** A Network Load Balancer is not among the resources a web ACL can protect. One baseline of WAF rules on every account's resources, including accounts and resources added later, is AWS Firewall Manager, which works through AWS Organizations.
  - https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works-resources.html
  - https://docs.aws.amazon.com/waf/latest/developerguide/fms-chapter.html
  - https://docs.aws.amazon.com/waf/latest/developerguide/fms-prereq.html

### c5c

- **k1** Secrets Manager replaces hard-coded credentials with a call at run time and rotates secrets: managed rotation for most managed secrets and for partner-held (managed external) ones, a Lambda function for other types. Secrets can be replicated to other Regions.
  - https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html
  - https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html
  - https://docs.aws.amazon.com/secretsmanager/latest/userguide/replicate-secrets.html
- **k2** Parameter Store SecureString values are encrypted with KMS, but AWS recommends Secrets Manager for database credentials, API keys and tokens, because it adds automatic rotation and cross-Region replication.
  - https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
- **k3** A customer managed key is the one you control: you maintain its key policy, enable and disable it, rotate it and schedule its deletion. You can view the key policy of an AWS managed key but cannot change it, rotate the key or delete it.
  - https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html
- **k4** KMS &lt;code>Encrypt&lt;/code> takes at most 4,096 bytes. Larger data uses a data key from &lt;code>GenerateDataKey&lt;/code>: encrypt locally with the plaintext copy, then store the encrypted copy of the data key with the encrypted data.
  - https://docs.aws.amazon.com/kms/latest/APIReference/API_Encrypt.html
  - https://docs.aws.amazon.com/kms/latest/APIReference/API_GenerateDataKey.html
- **k5** Automatic rotation works only for symmetric encryption KMS keys whose key material KMS generated, is yearly by default, and KMS keeps all earlier key material. Deleting a key is irreversible after a wait of 7 to 30 days; a disabled key can be re-enabled.
  - https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html
  - https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html
- **trap** Without the key policy statement that enables IAM policies, an IAM Allow on the key is ineffective. Use from another account needs the key policy plus an IAM policy in that account, and an RDS snapshot under the default KMS key cannot be shared.
  - https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-default.html
  - https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html
  - https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/share-encrypted-snapshot.html

### c5d

- **k1** CloudTrail trails log management events by default; data events and Insights events must be switched on. Event history shows only the past 90 days of management events in one Region and no data events.
  - https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html
  - https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html
- **k2** An organization trail logs events for the management account and all member accounts, and users in member accounts cannot delete it or change it. Log file integrity validation shows whether a log file was modified or deleted after delivery.
  - https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html
  - https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html
- **k3** AWS Config records how resources were configured over time and evaluates them against rules. A noncompliant resource can be remediated with a Systems Manager Automation document, manually or automatically, after the change has happened.
  - https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html
  - https://docs.aws.amazon.com/config/latest/developerguide/remediation.html
- **k4** Across accounts, a Config aggregator collects configuration and compliance data from many accounts and Regions, and a conformance pack deploys a set of rules and remediation actions as one unit, also across an organization.
  - https://docs.aws.amazon.com/config/latest/developerguide/aggregate-data.html
  - https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html
- **k5** GuardDuty analyzes CloudTrail management events, VPC flow logs and DNS logs for threats. Inspector scans EC2 instances, ECR images and Lambda functions for vulnerabilities. Macie finds sensitive data in S3. Security Hub CSPM collects the findings.
  - https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html
  - https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html
  - https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html
  - https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html
- **trap** Compliance reports about AWS itself (ISO, PCI, SOC) are downloaded from AWS Artifact; AWS Config judges your resources, not AWS. CloudTrail Insights flags unusual API call and error rates; threats such as cryptomining are GuardDuty findings.
  - https://docs.aws.amazon.com/artifact/latest/ug/what-is-aws-artifact.html
  - https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html
  - https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html

### c5e

- **k1** Read the verb in the requirement. Prevent an action in every member account: an SCP. Detect a wrong setting and correct it: a Config rule with remediation. Prove who made a call: CloudTrail. Notice an attack in progress: GuardDuty.
  - https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html
  - https://docs.aws.amazon.com/config/latest/developerguide/remediation.html
  - https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html
  - https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html
- **k2** At the edge the layers stack: Shield covers DDoS at layers 3, 4 and 7, a WAF protection pack (web ACL) on CloudFront or the ALB filters the HTTP(S) requests, and the ALB's HTTPS listener ends TLS; an HTTPS target group encrypts the next hop.
  - https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html
  - https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html
  - https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html
  - https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html
- **k3** In the data tier, choose a customer managed KMS key when the requirement is to decide who may use the key, to disable it or to use it from another account, and keep the database password in Secrets Manager so that it can rotate.
  - https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html
  - https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html
  - https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html
- **k4** Auditability is designed too: an organization trail that member accounts cannot change, log file integrity validation, and S3 Object Lock in compliance mode when no user, the root user included, may delete or overwrite the logs.
  - https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html
  - https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html
  - https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html
- **trap** Controls of different kinds add up; they do not replace each other. Encryption at rest does not force TLS, a detective Config rule does not stop the call the way an SCP does, and a finding from GuardDuty blocks nothing until something reacts to it.
  - https://docs.aws.amazon.com/controltower/latest/controlreference/control-behavior.html
  - https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html

### l5a

- **k1** AWS Config works from what its configuration recorder captures: the recorder stores each change to a resource type in scope as a configuration item, and the rules evaluate those configuration settings.
  - https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html
  - https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_components.html
- **k2** The managed rule &lt;code>required-tags&lt;/code> checks that resources carry the tags you specify, up to 6 tags per rule, optionally with expected values. It finds resources that were launched wrongly; it does not prevent their creation.
  - https://docs.aws.amazon.com/config/latest/developerguide/required-tags.html
- **k3** &lt;code>s3-bucket-versioning-enabled&lt;/code> and &lt;code>s3-bucket-server-side-encryption-enabled&lt;/code> have the trigger type configuration changes: Config evaluates a bucket when it detects a change to it, not on a timer.
  - https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-versioning-enabled.html
  - https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-server-side-encryption-enabled.html
  - https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_components.html
- **k4** Every S3 bucket now has encryption with S3 managed keys (SSE-S3) by default, so a requirement for KMS keys needs a stricter rule: &lt;code>s3-default-encryption-kms&lt;/code> is noncompliant when a bucket is not encrypted with a KMS key.
  - https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-bucket-encryption.html
  - https://docs.aws.amazon.com/config/latest/developerguide/s3-default-encryption-kms.html
- **trap** A Config rule reports a resource after it exists. When the requirement is that an untagged or unencrypted resource can never be created, the answer is a preventive control such as an SCP or an IAM policy condition, not one more Config rule.
  - https://docs.aws.amazon.com/config/latest/developerguide/required-tags.html
  - https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html

### l5b

- **k1** AWS managed rules are predefined and customizable: you can set the scope that limits which resources trigger an evaluation. Note each rule's trigger type, which is configuration changes, periodic (for example every 24 hours) or both.
  - https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_use-managed-rules.html
  - https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_components.html
- **k2** Remediation runs a Systems Manager Automation document on the noncompliant resource. Config provides managed automation documents, you can associate your own, and each rule's remediation is set up as manual or automatic.
  - https://docs.aws.amazon.com/config/latest/developerguide/remediation.html
- **k3** The Config dashboard is the overview: your resources, rules and conformance packs with their compliance states, and which rules and resources are noncompliant. An aggregator gives that view across accounts and Regions.
  - https://docs.aws.amazon.com/config/latest/developerguide/viewing-the-aws-config-dashboard.html
  - https://docs.aws.amazon.com/config/latest/developerguide/aggregate-data.html
- **trap** Remediation acts after Config has evaluated the resource, so the wrong setting exists for a while. 'Detect and correct automatically' is a Config rule with automatic remediation; 'must never happen' needs a control that denies the call.
  - https://docs.aws.amazon.com/config/latest/developerguide/remediation.html

### c6a

- **k1** Storage Gateway keeps the on-premises protocol and puts the data in AWS. S3 File Gateway: NFS or SMB shares whose files are stored as S3 objects. Volume Gateway: iSCSI volumes. Tape Gateway: virtual tapes archived to S3 Glacier storage classes.
  - https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html
  - https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html
  - https://docs.aws.amazon.com/storagegateway/latest/tgw/WhatIsStorageGateway.html
- **k2** Volume Gateway modes differ in where the primary copy lives. Cached volumes keep it in S3 and only frequently accessed data on site. Stored volumes keep the whole dataset on site for low latency and back it up to AWS asynchronously.
  - https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html
- **k3** DataSync moves data instead of serving it: it copies files and objects from NFS, SMB, HDFS or object storage to S3, EFS or FSx, encrypted in transit (TLS to AWS), with integrity checks, transferring only what changed on later runs, and with a bandwidth limit.
  - https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html
  - https://docs.aws.amazon.com/datasync/latest/userguide/how-datasync-transfer-works.html
  - https://aws.amazon.com/datasync/faqs/
  - https://docs.aws.amazon.com/datasync/latest/userguide/encryption-in-transit.html
- **k4** Transfer Family is for partners and applications that keep SFTP, FTPS, FTP or AS2: a managed endpoint that transfers directly into and out of S3 or EFS, while the existing client-side configuration stays as it is.
  - https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html
- **k5** AWS Backup manages backup plans centrally, across the accounts of an organization, and copies backups to other Regions and accounts. In a vault locked in compliance mode, no user, the root user included, can delete a backup.
  - https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html
  - https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html
- **trap** Ongoing file access from the data center is a gateway, a one-time or scheduled copy is DataSync, a database is DMS. Amazon FSx File Gateway is no longer available to new customers: SMB shares in AWS mean FSx for Windows File Server itself.
  - https://docs.aws.amazon.com/filegateway/latest/filefsxw/what-is-file-fsxw.html
  - https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html

### c6b

- **k1** A gateway endpoint (Amazon S3 and DynamoDB) is a route in the subnet's route table and has no additional charge. It works only from inside its VPC: not from on premises, not from a peered VPC in another Region, not through a transit gateway.
  - https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html
  - https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html
- **k2** An interface endpoint is a network interface in your subnet with its own security group. Because it has private IP addresses in the VPC, on-premises applications can reach it over VPN or Direct Connect; that is how they reach S3 privately.
  - https://docs.aws.amazon.com/AmazonS3/latest/userguide/privatelink-interface-endpoints.html
  - https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html
- **k3** An endpoint policy controls which principals can use the endpoint to reach the service; it does not override or replace identity-based or resource-based policies, so a bucket policy still applies.
  - https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html
- **k4** VPC peering is a one-to-one link with no transitive routing, and it cannot be created when the CIDR blocks overlap. It works across accounts and Regions, costs nothing to create, and needs routes in the route tables of both VPCs.
  - https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html
  - https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html
  - https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-routing.html
- **k5** Choose by what must be shared. Two networks talking in both directions: peering. One service offered to many VPCs, where only consumers initiate connections and IP ranges may overlap: a PrivateLink endpoint service behind a Network Load Balancer.
  - https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/aws-privatelink.html
  - https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html
- **trap** Peering gives no edge-to-edge routing: resources in VPC B cannot use VPC A's internet gateway or NAT device. A security group rule can reference a peer VPC's security group only in the same Region; for another Region use the peer's CIDR block.
  - https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html
  - https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-security-groups.html

### c6c

- **k1** A Site-to-Site VPN connection is IPsec with two tunnels; configure both, because traffic moves to the other tunnel when one is down for maintenance. On the AWS side it ends on a virtual private gateway (a single VPC) or a transit gateway.
  - https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html
  - https://docs.aws.amazon.com/vpn/latest/s2svpn/VPNTunnels.html
- **k2** Direct Connect is an Ethernet fiber link to a Direct Connect location that bypasses internet service providers. A dedicated connection is a port for one customer (1, 10, 100 or 400 Gbps); a hosted connection comes from a partner (50 Mbps to 25 Gbps).
  - https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html
  - https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithConnections.html
  - https://docs.aws.amazon.com/directconnect/latest/UserGuide/dedicated_connection.html
  - https://docs.aws.amazon.com/directconnect/latest/UserGuide/hosted_connection.html
- **k3** The virtual interface decides what the link reaches: private for a VPC, public for all public AWS services such as S3, transit for transit gateways. A Direct Connect gateway is a global resource: one connection reaches any Region except the China Regions.
  - https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html
  - https://docs.aws.amazon.com/directconnect/latest/UserGuide/direct-connect-gateways-intro.html
- **k4** Direct Connect does not encrypt traffic in transit by default. Combine it with a Site-to-Site VPN for an IPsec-encrypted private connection, or use MACsec, layer 2 encryption on 10, 100 and 400 Gbps dedicated connections, not on hosted ones.
  - https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html
  - https://docs.aws.amazon.com/directconnect/latest/UserGuide/MACsec.html
  - https://aws.amazon.com/directconnect/faqs/
- **k5** A transit gateway is a network transit hub that interconnects VPCs and on-premises networks. Additional route tables isolate subsets of attachments, and transit gateways in different Regions can be peered.
  - https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html
  - https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html
  - https://docs.aws.amazon.com/vpc/latest/tgw/tgw-peering.html
- **trap** Two connections at one Direct Connect location survive a device failure but not the loss of the location. Maximum resiliency is separate connections on separate devices in more than one location. A VPN is the cheap backup path.
  - https://aws.amazon.com/directconnect/resiliency-recommendation/
  - https://aws.amazon.com/directconnect/faqs/

### c6d

- **k1** AWS DMS migrates a database while the source stays fully operational: a full load copies the existing data, then change data capture (CDC) replicates ongoing changes until you switch over to the target.
  - https://aws.amazon.com/dms/faqs/
  - https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.html
  - https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Task.CDC.html
- **k2** Moving to a different database engine (for example Oracle to Aurora PostgreSQL) first needs the schema and code objects converted, with DMS Schema Conversion or the AWS Schema Conversion Tool. The same engine on both sides needs no conversion.
  - https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html
  - https://docs.aws.amazon.com/SchemaConversionTool/latest/userguide/CHAP_Welcome.html
- **k3** AWS Snowball Edge is no longer available to new customers (since 7 November 2025), and support for Snowball devices ends in all commercial Regions on 31 December 2026. AWS points to DataSync for online and Data Transfer Terminal for physical transfer.
  - https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html
  - https://docs.aws.amazon.com/snowball/latest/developer-guide/doc-history.html
  - https://aws.amazon.com/snowball/
- **k4** The exam guide still lists AWS Snow Family, although the devices are no longer offered to new customers. The idea to keep: a rugged device shipped by carrier moves data faster than the internet could; for edge computing AWS now names Outposts.
  - https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html
  - https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html
  - https://docs.aws.amazon.com/snowball/latest/developer-guide/whatisedge.html
- **k5** AWS Outposts is AWS compute and storage capacity at your site, operated by AWS as part of a Region and used through the same APIs. Choose it for low latency to on-premises systems, local data processing or data residency.
  - https://docs.aws.amazon.com/outposts/latest/userguide/what-is-outposts.html
  - https://aws.amazon.com/outposts/
- **trap** An Outpost is not AWS without the network: it is designed for a constant connection to its Region and is homed to one Availability Zone there. AWS has discontinued sales of the 1U and 2U Outposts servers; the offering is Outposts racks.
  - https://docs.aws.amazon.com/outposts/latest/userguide/how-outposts-works.html
  - https://docs.aws.amazon.com/outposts/latest/server-userguide/what-is-outposts.html

### c6e

- **k1** Consolidated billing in AWS Organizations gives one bill and combines usage across accounts, which shares volume pricing discounts, Reserved Instance discounts and Savings Plans. It is offered at no additional cost.
  - https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html
- **k2** Share network resources across accounts instead of building them twice. AWS RAM shares a resource with other accounts or a whole organization; with VPC subnet sharing, participant accounts create their resources in a centrally managed VPC.
  - https://docs.aws.amazon.com/ram/latest/userguide/what-is.html
  - https://docs.aws.amazon.com/vpc/latest/userguide/vpc-sharing.html
- **k3** Cost tool by question: Cost Explorer shows up to the last 13 months and forecasts spend. Budgets alerts on actual and forecasted spend and can apply an IAM policy or SCP. Cost and Usage Reports (now CUR 2.0 in Data Exports) are the most detailed data, in S3.
  - https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html
  - https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html
  - https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-controls.html
  - https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html
  - https://docs.aws.amazon.com/cur/latest/userguide/what-is-data-exports.html
- **k4** A transit gateway bills each attachment by the hour plus a data processing charge per gigabyte. A VPC peering connection costs nothing to create, and data that stays within one Availability Zone over it is free.
  - https://aws.amazon.com/transit-gateway/pricing/
  - https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html
- **k5** The hybrid design by requirement: encrypted and over the internet, a VPN; a dedicated link that bypasses the internet, Direct Connect; many VPCs behind one hub, a transit gateway; NFS or SMB onto S3, a file gateway; bulk copy, DataSync.
  - https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html
  - https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html
  - https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html
  - https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html
  - https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html
- **trap** A managed service gives up control for less operational work. 'Least operational overhead' points to the managed option unless the stem demands something only the lower-level option gives, such as an on-premises protocol or data that must stay on site.
  - no AWS source: exam framing, see the inference list

### l6a

- **k1** A peering connection carries nothing until the owner of the accepter VPC accepts the request and each VPC has a route to the other's CIDR block in its route tables.
  - https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html
  - https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-routing.html
- **k2** A route does not have to cover the whole peer VPC. Routing only to a subnet's CIDR block restricts access to that subnet of the peer, which is what a subnet-specific peering configuration means.
  - https://docs.aws.amazon.com/vpc/latest/peering/peering-configurations-partial-access.html
- **k3** Security groups still decide what gets through. In the same Region a rule can reference a security group of the peer VPC; for a peer VPC in a different Region you use its CIDR block instead.
  - https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-security-groups.html
- **k4** Creating a peering connection is free, and so is data that stays within one Availability Zone, even between accounts. Data transfer is charged when it crosses Availability Zones or Regions.
  - https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html
- **trap** Transitive peering is not supported: with A peered to B and to C, VPC A cannot act as a transit point between B and C. B and C need their own peering connection, and many VPCs that must all reach each other call for a transit gateway.
  - https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html

### l6b

- **k1** A partner arriving over Site-to-Site VPN cannot use an S3 gateway endpoint, because endpoint connections cannot be extended out of a VPC. An S3 interface endpoint is reachable from on premises over VPN and Direct Connect.
  - https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html
  - https://docs.aws.amazon.com/AmazonS3/latest/userguide/privatelink-interface-endpoints.html
- **k2** The other half is DNS. An inbound Resolver endpoint allows DNS queries to your VPC from an on-premises network, so names that resolve only inside the VPC can be resolved from outside AWS.
  - https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html
- **k3** The opposite direction is an outbound Resolver endpoint with forwarding rules: one rule per domain name, forwarding queries for that domain from the VPC to an on-premises DNS resolver.
  - https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html
- **k4** A private hosted zone answers DNS queries for a domain only within the VPCs you associate with it; a client outside those VPCs, such as on premises, gets the answer only through an inbound Resolver endpoint.
  - https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-private.html
  - https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html
- **trap** For private access to S3 from outside the VPC, the gateway endpoint is the cheap but wrong answer: it has no additional charge, yet it serves only resources inside the VPC. The interface endpoint is the one with private addresses to connect to.
  - https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html
  - https://docs.aws.amazon.com/AmazonS3/latest/userguide/privatelink-interface-endpoints.html

### r1a

- **k1** Meaning out of text: Amazon Comprehend uses natural language processing to recognize entities, key phrases, language and sentiment in documents. The same text in another language: Amazon Translate, a text translation service.
  - https://docs.aws.amazon.com/comprehend/latest/dg/what-is.html
  - https://docs.aws.amazon.com/translate/latest/dg/what-is.html
- **k2** Speech: Amazon Transcribe converts audio to text, Amazon Polly converts text into lifelike speech, and Amazon Lex builds conversational interfaces (chatbots) that use voice and text. The current Lex guide is for Amazon Lex V2.
  - https://docs.aws.amazon.com/transcribe/latest/dg/what-is.html
  - https://docs.aws.amazon.com/polly/latest/dg/what-is.html
  - https://docs.aws.amazon.com/lexv2/latest/dg/what-is.html
- **k3** Documents and pictures: Amazon Textract detects typed and handwritten text and extracts forms and tables from documents. Amazon Rekognition analyzes images and videos: objects, text, unsafe content, face comparison.
  - https://docs.aws.amazon.com/textract/latest/dg/what-is.html
  - https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html
- **k4** Amazon SageMaker AI (the exam guide's name for what used to be Amazon SageMaker) is the fully managed service to build, train and deploy your own ML models. It fits when the need is a custom model, not a ready-made API.
  - https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html
  - https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html
- **k5** Status: the eight services are open, but AWS lists some of their features in maintenance, closed to new customers: Rekognition streaming events, Comprehend topic modeling and event detection, and several SageMaker AI features.
  - https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html
  - https://docs.aws.amazon.com/general/latest/gr/sunset_services.html
- **trap** The pairs that get swapped: Transcribe (speech to text) and Polly (text to speech); Textract (text out of a document), Rekognition (what a picture shows) and Comprehend (what a text says). Sentiment of recorded calls: Transcribe first, then Comprehend on the text.
  - https://docs.aws.amazon.com/transcribe/latest/dg/what-is.html
  - https://docs.aws.amazon.com/polly/latest/dg/what-is.html
  - https://docs.aws.amazon.com/textract/latest/dg/what-is.html
  - https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html
  - https://docs.aws.amazon.com/comprehend/latest/dg/what-is.html

### r1b

- **k1** Provisioning: CloudFormation creates the resources described in a template as a stack, and StackSets creates stacks across multiple accounts and Regions in a single operation. Service Catalog manages catalogs of IT services approved for use on AWS.
  - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html
  - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html
  - https://docs.aws.amazon.com/servicecatalog/latest/adminguide/introduction.html
- **k2** Running servers: Systems Manager centrally views, manages and operates nodes in AWS, on premises and in other clouds, once SSM Agent runs on them. License Manager manages software licenses from vendors such as Microsoft, SAP, Oracle and IBM.
  - https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html
  - https://docs.aws.amazon.com/license-manager/latest/userguide/license-manager.html
- **k3** Advice: Trusted Advisor inspects your environment and makes recommendations by category, such as security, fault tolerance and service limits. Compute Optimizer analyzes utilization metrics and gives rightsizing recommendations for single resources.
  - https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html
  - https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html
- **k4** AWS Health Dashboard: the service health page shows public events for all AWS services and needs no sign-in. AWS Health itself tells you how events and planned activities affect your own resources, and delivers them through EventBridge.
  - https://docs.aws.amazon.com/health/latest/ug/aws-health-dashboard-status.html
  - https://docs.aws.amazon.com/health/latest/ug/what-is-aws-health.html
- **k5** Open-source monitoring as a service: Amazon Managed Service for Prometheus is a serverless, Prometheus-compatible service for container metrics; Amazon Managed Grafana queries and visualizes metrics, logs and traces from multiple sources.
  - https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html
  - https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html
- **trap** Trusted Advisor's full set of checks needs Business Support+, Enterprise Support or Unified Operations; Basic Support gets the service limits checks and selected security and fault tolerance checks. A size for one specific instance is Compute Optimizer.
  - https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html
  - https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html

### r1c

- **k1** Whole servers: AWS Application Migration Service, which the AWS docs now call AWS Transform MGN, migrates physical, virtual and cloud servers by continuous block-level replication, with cutover windows of minutes. The exam guide prints the old name.
  - https://docs.aws.amazon.com/mgn/latest/ug/what-is-mgn.html
  - https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html
  - https://docs.aws.amazon.com/whitepapers/latest/aws-overview/migration-services.html
- **k2** Databases: AWS DMS, for a one-time migration or to replicate ongoing changes so that source and target stay in sync. Migrating to a different database engine adds DMS Schema Conversion.
  - https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html
- **k3** Files and objects in bulk: DataSync, an online transfer service that copies from NFS, SMB, HDFS, object storage and storage services in other clouds to S3, EFS and FSx.
  - https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html
  - https://docs.aws.amazon.com/snowball/latest/developer-guide/whatisedge.html
- **k4** Partners who exchange files over SFTP, FTPS, FTP or AS2: AWS Transfer Family, fully managed transfers directly into and out of S3 or EFS, with the existing client-side configuration maintained.
  - https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html
- **k5** Status, from the AWS lifecycle lists: Snowball Edge, the Snow Family device, is closed to new customers, and Application Discovery Service and Migration Hub are in maintenance, which means the same. The four services of this step are open.
  - https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html
  - https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html
  - https://docs.aws.amazon.com/general/latest/gr/sunset_services.html
  - https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html
- **trap** MGN and Elastic Disaster Recovery both replicate servers; the goal tells them apart. Moving the servers for good is migration, a standby to recover into is disaster recovery. SFTP in the stem means Transfer Family, not DataSync.
  - https://docs.aws.amazon.com/mgn/latest/ug/what-is-mgn.html
  - https://docs.aws.amazon.com/drs/latest/userguide/what-is-drs.html
  - https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html

### r1d

- **k1** Match the service to what the application already speaks. MongoDB drivers and tools: Amazon DocumentDB. Apache Cassandra: Amazon Keyspaces, which is serverless. Apache Kafka: Amazon MSK (Managed Streaming for Apache Kafka).
  - https://docs.aws.amazon.com/documentdb/latest/devguide/what-is.html
  - https://docs.aws.amazon.com/keyspaces/latest/devguide/what-is-keyspaces.html
  - https://docs.aws.amazon.com/msk/latest/developerguide/what-is-msk.html
- **k2** Highly connected data that is queried by its relationships is Amazon Neptune, a managed graph database with the query languages Gremlin, openCypher and SPARQL. AWS names recommendation engines among its use cases.
  - https://docs.aws.amazon.com/neptune/latest/userguide/intro.html
- **k3** Amazon MemoryDB is a durable in-memory database compatible with Valkey and Redis OSS: microsecond reads, and data stored durably across Availability Zones in a transaction log. The MemoryDB FAQ now recommends ElastiCache for new workloads.
  - https://docs.aws.amazon.com/memorydb/latest/devguide/what-is-memorydb.html
  - https://aws.amazon.com/memorydb/faqs/
- **k4** Amazon OpenSearch Service runs managed OpenSearch clusters, a search and analytics engine for log analytics, real-time application monitoring and clickstream analysis. It is also the usual answer for full-text search over application data.
  - https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html
- **k5** AWS Data Exchange is not a pipeline of your own data: it is where you find, subscribe to and use third-party data in the cloud. What you query that data with afterwards is one of the analytics services.
  - https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html
  - https://docs.aws.amazon.com/data-exchange/latest/userguide/what-is.html
- **trap** The compatibility word decides: MongoDB is DocumentDB, not DynamoDB; Cassandra is Keyspaces; Kafka is MSK, not Kinesis Data Streams. The exam guide's list of in-scope databases names DocumentDB, Keyspaces and Neptune, but not MemoryDB.
  - https://docs.aws.amazon.com/documentdb/latest/devguide/what-is.html
  - https://docs.aws.amazon.com/keyspaces/latest/devguide/what-is-keyspaces.html
  - https://docs.aws.amazon.com/msk/latest/developerguide/what-is-msk.html
  - https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html

## Changed after the second read

- c5a k2: "A policy" → "An SCP" (a declarative policy on the root also reaches the management account).
- c5a k5: added proactive controls (CloudFormation hooks); preventive controls are "SCPs and other Organizations policies".
- c5b k2: automatic renewal also needs the certificate to be in use and the CNAME record to stay in DNS.
- c5b k5: the Shield Response Team needs a Business or Enterprise support plan; cost protection is a credit you request.
- c5c k1: third rotation form (managed external secrets held by partners).
- c5c k5: automatic rotation only for keys whose material KMS generated.
- c6a k3: "encrypted with TLS" → "encrypted in transit (TLS to AWS)"; the hop from storage to agent uses the storage protocol.
- c6c k3: a Direct Connect gateway reaches any Region except the China Regions.
- c6c k4: MACsec is on 10, 100 and 400 Gbps dedicated connections (Direct Connect FAQ), not on hosted ones.
- c6e k3: Cost and Usage Reports are now "CUR 2.0 in Data Exports"; the old page is filed under Legacy.
- l6b k4: the page names the inbound Resolver endpoint.
- r1a trap: "takes Transcribe, then Comprehend" softened (Transcribe Call Analytics has sentiment of its own).
- r1c k5: status wording now names Snowball Edge and the lifecycle lists; the maintenance list replaced the Transfer Family link.

Left as written although the page is a little narrower: c6a k5 (the "no user, root included, can delete a backup" sentence is on the Vault Lock page for a locked vault; what compliance mode adds is that the lock itself cannot be removed after the grace time).

## Inferences: not a statement on a page

Exam framing (which option wins, how a stem is worded) has no AWS source by nature. The facts inside were checked.

- c5a k2, last clause ("where an account sits decides which guardrails it gets").
- c5b k4: "pick the WAF rule by the attack" is framing; the three rule types are sourced.
- c5c k2: that nothing rotates a SecureString is read from the page's comparison (Secrets Manager "provides … automatic rotation"), not stated outright.
- c5d k3: "after the change has happened". c5d trap: "AWS Config judges your resources, not AWS".
- c5e, all four points and the trap: synthesis of facts sourced in c5a–c5d. "Encryption at rest does not force TLS" and "a finding blocks nothing until something reacts" are conclusions.
- l5a trap, l5b trap: detect against prevent. The required-tags page says the rule "does not prevent you from creating resources with incorrect tags"; that an SCP or IAM condition does is from the bank (q06-015, q08-007), not from a Config page.
- c6a k1 opening clause; c6a trap first sentence and "SMB shares in AWS mean FSx for Windows File Server itself" (the lifecycle list says to switch from FSx File Gateway to FSx for Windows File Server).
- c6b k5: sourced from the multi-VPC whitepaper, not the PrivateLink guide; an endpoint service can also sit behind a Gateway Load Balancer.
- c6c trap: "A VPN is the cheap backup path" (the Direct Connect FAQ confirms VPN as a backup; no page says cheap).
- c6d k2: "The same engine on both sides needs no conversion" (the DMS guide calls these homogeneous, like-to-like migrations). The Oracle to Aurora PostgreSQL example is mine.
- c6e k5 and trap: synthesis and exam framing. The trap does not describe the Tech Talk "Control vs. Abstraction"; nobody has watched it.
- l6b k2 second half, l6b trap ("cheap but wrong").
- r1a k4 last sentence, r1a trap (the pairs), r1b trap last sentence, r1c trap, r1d k4 last sentence, r1d k5 ("not a pipeline", second sentence), r1d trap ("not DynamoDB", "not Kinesis Data Streams").
- "Open" for a service means: on none of the three lifecycle lists of the AWS General Reference (maintenance, sunset, full shutdown) on the day of the check.

## Could not settle

Nothing was left unsettled in the 18 entries. Two things are worth knowing:

- The Snowball Edge "availability change" page gives no dates. The date closed to new customers (7 November 2025) is on the developer guide's document history page, and the end of support (31 December 2026, commercial Regions) is on aws.amazon.com/snowball/.
- CloudTrail Insights: the concepts page says Insights analyzes "CloudTrail management activity", while "AWS changes" in docs/questions.md says management and data events. c5d only says what Insights flags (unusual API call and error rates).

## Found elsewhere (not fixed here)

- **plan.js `r1d`** names MemoryDB among the databases to read. The exam guide's in-scope list (Database: Aurora, Aurora Serverless, DocumentDB, DynamoDB, ElastiCache, Keyspaces, Neptune, RDS, Redshift) does not contain MemoryDB anywhere on the page. The r1d trap says so. The step's own note on r1a ("The exam guide lists them as in scope") is therefore not true for every service in r1d. Source: https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html
- **plan.js `r1c`** says "Application Migration Service". The docs and the whitepaper page the step links now say AWS Transform MGN; the exam guide still prints the old name. Worth a note on the step. Same page: it still describes the Snow Family, Application Discovery Service and Migration Hub with no word about their status (closed to new customers, maintenance, maintenance).
- **`STEP_TAGS.l6b`** is `["Hybrid connectivity"]`. The lab's objectives are gateway against interface endpoints, PrivateLink and Route 53 forwarding rules: "VPC endpoints & PrivateLink" fits better, perhaps with "Route 53".
- **`STEP_TAGS.l5a`** is `["Governance", "Organizations & SCPs"]`. The lab is AWS Config rules only (tagging, S3 versioning and encryption); it has no Organizations content. "AWS Config" fits, "Organizations & SCPs" does not.
- **`STEP_TAGS.c6a`** includes "AWS Backup" and "FSx". The lesson names (Data Storage Solutions, Data Transfer Solutions) do not say whether either is taught; c6a covers them briefly on that assumption.
- **plan.js `c6d` note** is correct (closed to new customers, support ends 31 December 2026). It could add that 1U and 2U Outposts servers are no longer sold: https://docs.aws.amazon.com/outposts/latest/server-userguide/what-is-outposts.html
- **docs/questions.md, "AWS changes"**: "CloudTrail Insights analyses management and data events" does not match the CloudTrail concepts page as fetched ("by analyzing CloudTrail management activity"). Worth a re-read before a question depends on it.
- **docs/questions.md, "AWS changes"** has no entry for: Outposts servers end of sale; Application Discovery Service and Migration Hub in maintenance; Comprehend topic modeling and event detection, eight SageMaker AI features, Service Catalog AppRegistry, Systems Manager Incident Manager, Change Manager and Application Manager in maintenance; AWS WAF Classic, App Mesh, Proton, Managed Blockchain and DevOps Guru in sunset; Legacy CUR against CUR 2.0 in Data Exports; MACsec not on 1 Gbps or hosted connections; a third Secrets Manager rotation form (managed external secrets).
- **Self-check `d8c3` (model answer)** says ACM renews DNS-validated certificates automatically; the ACM page adds two conditions (in use by an AWS service, CNAME records present).
- **Bank coverage**: the tag "AI/ML services" has one question (m2-050, about Kinesis Video Streams) and "Infrastructure as code" has one (m1-011). r1a and r1b have almost nothing to practise on until the new pools land.
- **saa-plan/CLAUDE.md and docs/keypoints.md** still describe the 14-day plan and `d01.js … d14.js` only (known, being rewritten).
