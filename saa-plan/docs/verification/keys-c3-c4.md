# Key points for c3 and c4: sources

Written 2026-10-12/13 for `site/keys/c3.js` (c3a–c3f, l3a–l3c) and `site/keys/c4.js` (c4a–c4f, l4a–l4d).

How: each page was fetched with `fetch(url, {redirect: "manual"})` and counted only on a plain 200; the text was stripped of HTML and searched for the sentence. Lecture videos were not seen: the lesson names in plan.js are all that is known about them. The seven lab description pages are public and were read in the browser pane (description, objectives, service list); nothing is claimed about a lab's steps.

Short forms below: `vpc/` = https://docs.aws.amazon.com/vpc/latest/userguide/, `ec2/` = https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/, `s3/` = https://docs.aws.amazon.com/AmazonS3/latest/userguide/, `ecs/` = https://docs.aws.amazon.com/AmazonECS/latest/developerguide/, `asg/` = https://docs.aws.amazon.com/autoscaling/ec2/userguide/, `alb/` = https://docs.aws.amazon.com/elasticloadbalancing/latest/application/, `cw/` = https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/, `cf/` = https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/, `r53/` = https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/, `aurora/` = https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/, `rds/` = https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/, `ec/` = https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/, `arc/` = https://docs.aws.amazon.com/r53recovery/latest/dg/.

## Sentence by sentence

### c3a
- k1 overlapping VPCs cannot be peered: https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html. Non-overlapping with on-premises recommended: https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html. Cannot resize, secondary CIDR: vpc/vpc-cidr-blocks.html
- k2 one AZ per subnet: vpc/configure-subnets.html. First four and last address reserved: vpc/subnet-sizing.html
- k3 public = route to internet gateway: vpc/VPC_Internet_Gateway.html. Load balancer nodes and NAT gateways in public subnets, servers private: vpc/vpc-example-private-subnets-nat.html. Isolated subnet: vpc/configure-subnets.html
- k4 implicit association with the main route table; "leave the main route table in its original default state": vpc/subnet-route-tables.html
- k5 longest prefix match: vpc/subnet-route-tables.html. Egress-only gateway for IPv6, NAT gateway for IPv4: vpc/egress-only-internet-gateway.html
- trap internet gateway redundant: vpc/VPC_Internet_Gateway.html. NAT gateway "created in a specific Availability Zone": vpc/nat-gateway-basics.html

### c3b
- k1 family descriptions: https://aws.amazon.com/ec2/instance-types/. Letters: https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html
- k2 ec2/burstable-credits-baseline-concepts.html, ec2/burstable-performance-instances.html
- k3 best price performance: ec2/instance-types.html. arm64 AMIs, recompiling: https://aws.amazon.com/ec2/faqs/
- k4 https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html, "lowest prices": https://aws.amazon.com/savingsplans/faqs/
- k5 ec2/using-spot-instances.html, ec2/spot-best-practices.html
- trap no capacity reservation: https://aws.amazon.com/savingsplans/faqs/. Capacity Reservation, no term commitment: ec2/ec2-capacity-reservations.html. Dedicated Hosts: ec2/dedicated-hosts-overview.html

### c3c
- k1 ec2/Storage.html, https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html, https://docs.aws.amazon.com/efs/latest/ug/how-it-works.html
- k2 https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html, https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html
- k3 ec2/InstanceStorage.html, ec2/instance-store-lifetime.html
- k4 https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html, .../how-it-works.html, .../network-access.html, .../lifecycle-management-efs.html
- k5 s3/object-lifecycle-mgmt.html, s3/storage-class-intro.html
- trap: inference (below)

### c3d
- k1 ec2/using-cloudwatch.html, ec2/viewing_metrics_with_cloudwatch.html, cw/Install-CloudWatch-Agent.html, cw/metrics-collected-by-CloudWatch-agent.html
- k2 cw/CloudWatch_Alarms.html, cw/alarm-combining.html
- k3 https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html, .../logs/MonitoringLogData.html
- k4 alb/introduction.html, alb/rule-condition-types.html
- k5 https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html, vpc/vpc-example-private-subnets-nat.html
- trap ec2/manage-detailed-monitoring.html, cw/Install-CloudWatch-Agent.html

### c3e
- k1 asg/what-is-amazon-ec2-auto-scaling.html, asg/auto-scaling-benefits.html
- k2 asg/as-scaling-target-tracking.html, asg/as-scale-based-on-demand.html, asg/ec2-auto-scaling-scheduled-scaling.html
- k3 asg/health-checks-overview.html
- k4 https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_withstand_component_failures_static_stability.html
- k5 session state in ElastiCache: ec/elasticache-use-cases.html. Sticky sessions: alb/edit-target-group-attributes.html
- trap vpc/nat-gateway-basics.html, rds/Concepts.MultiAZSingleStandby.html; rest is framing

### c3f
- k1 vpc/vpc-example-private-subnets-nat.html, rds/Concepts.MultiAZSingleStandby.html
- k2 vpc/vpc-example-web-database-servers.html, vpc/security-group-rules.html
- k3 standby cannot serve reads: rds/Concepts.MultiAZSingleStandby.html; read replica: rds/USER_ReadRepl.html
- k4 https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html
- k5 rds/USER_VPC.WorkingWithRDSInstanceinaVPC.html, rds/Concepts.MultiAZ.Failover.html
- trap: framing; facts as in k3

### l3a
- k1 s3/WebsiteHosting.html; services from the lab page
- k2 https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html
- k3 https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html, https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
- k4 https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-deploy-api.html, .../how-to-cors.html
- trap s3/WebsiteEndpoints.html, s3/WebsiteHosting.html

### l3b
- k1 vpc/security-group-rules.html
- k2 vpc/vpc-security-groups.html, vpc/vpc-network-acls.html, vpc/infrastructure-security.html, vpc/custom-network-acl.html
- k3 vpc/nacl-rules.html, vpc/security-group-rules.html
- k4 vpc/default-network-acl.html, vpc/create-network-acl.html, vpc/security-group-rules.html
- trap: framing; vpc/vpc-example-web-database-servers.html

### l3c
- k1 rds/Concepts.MultiAZSingleStandby.html, rds/Concepts.MultiAZ.Failover.html, rds/USER_VPC.WorkingWithRDSInstanceinaVPC.html
- k2 https://docs.aws.amazon.com/efs/latest/ug/how-it-works.html, .../network-access.html
- k3 alb/target-group-health-checks.html (state `unused`, reason `Target.NotInUse`)
- k4 https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html, .../Welcome.html

### c4a
- k1 https://aws.amazon.com/docker/, https://aws.amazon.com/compare/the-difference-between-containers-and-virtual-machines/
- k2 ecs/ecs-configuration.html, https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html
- k3 ecs/using_data_volumes.html, ecs/fargate-task-storage.html, ecs/efs-volumes.html
- k4 https://aws.amazon.com/what-is/containerization/, https://aws.amazon.com/microservices/
- k5 https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html, https://aws.amazon.com/ecs/faqs/
- trap ecs/ecs-configuration.html ("Use Amazon EC2 instances when")

### c4b
- k1 ecs/Welcome.html, https://aws.amazon.com/ecs/faqs/, https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html, https://docs.aws.amazon.com/decision-guides/latest/decision-guides/choosing-aws-container-service.html
- k2 ecs/ecs-configuration.html, ecs/AWS_Fargate.html
- k3 ecs/ecs-configuration.html, ecs/ecs_services.html, ecs/service-auto-scaling.html
- k4 ecs/cloudwatch-metrics.html, ecs/cloudwatch-container-insights.html, cw/ContainerInsights.html, ecs/using_awslogs.html
- k5 ecs/service-load-balancing.html, ecs/fargate-tasks-services.html, ecs/alb.html
- trap ecs/task-iam-roles.html, ecs/task_execution_IAM_role.html, ecs/instance_IAM_role.html

### c4c
- k1 s3/access-management.html, s3/about-object-ownership.html, https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html, .../reference_policies_evaluation-logic-cross-account.html
- k2 s3/access-control-block-public-access.html
- k3 s3/access-points.html, s3/access-points-vpc.html, s3/MultiRegionAccessPoints.html
- k4 s3/Versioning.html, s3/object-lock.html
- k5 s3/replication.html, s3/replication-requirements.html, s3/replication-what-is-isnot-replicated.html
- trap s3/object-lifecycle-mgmt.html, s3/Versioning.html, s3/intro-lifecycle-rules.html

### c4d
- k1 cf/Introduction.html, cf/HowCloudFrontWorks.html, cf/DownloadDistValuesCacheBehavior.html
- k2 r53/routing-policy.html, r53/resource-record-sets-values-basic.html
- k3 https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html, .../introduction-how-it-works.html
- k4 https://aws.amazon.com/global-accelerator/faqs/, r53/resource-record-sets-choosing-alias-non-alias.html
- k5 cf/cnames-and-https-requirements.html, cf/private-content-restricting-access-to-s3.html, cf/private-content-vpc-origins.html
- trap r53/resource-record-sets-values-basic.html, global-accelerator introduction-how-it-works.html, r53/routing-policy-latency.html, r53/routing-policy.html

### c4e
- k1 aurora/Aurora.Overview.StorageReliability.html, aurora/Concepts.AuroraHighAvailability.html
- k2 aurora/Concepts.AuroraHighAvailability.html, aurora/Aurora.Overview.Endpoints.html
- k3 aurora/aurora-global-database.html, aurora/aurora-global-database-disaster-recovery.html
- k4 aurora/aurora-serverless-v2.html, aurora/aurora-serverless-v2.how-it-works.html, aurora/aurora-serverless-v2-auto-pause.html, aurora/aurora-serverless-v2.create.html
- k5 arc/what-is-route53-recovery.html, arc/arc-zonal-shift.resource-types.html, arc/routing-control.html
- trap aurora/Concepts.AuroraHighAvailability.html, rds/USER_ReadRepl.html, https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html

### c4f
- k1 ec/Strategies.html
- k2 ec/AutoFailover.html, ec/Replication.Redis-RedisCluster.html, ec/Redis-Global-Datastore.html
- k3 ec/Strategies.html, https://docs.aws.amazon.com/memorydb/latest/devguide/what-is-memorydb.html, https://aws.amazon.com/elasticache/faqs/
- k4, k5: composed from the pages of c4b, c4c, c4d, c4e and ec/Redis-Global-Datastore.html
- trap ec/Strategies.html

### l4a
- k1 https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html, .../registry_auth.html
- k2 ecs/AWS_Fargate.html, ecs/task_execution_IAM_role.html
- k3 ecs/fargate-task-networking.html
- k4 ecs/ecs-configuration.html, ecs/ecs_services.html

### l4d
- k1 ecs/update-task-definition-console-v2.html, ecs/deployment-type-ecs.html
- k2 ecs/ecs_services.html, ecs/service-auto-scaling.html
- k3 ecs/service-auto-scaling.html, ecs/cluster-auto-scaling.html
- k4 ecs/alb.html, ecs/service-load-balancing.html

### l4b
- k1 r53/hosted-zones-private.html, r53/hosted-zone-private-considerations.html
- k2 r53/ResourceRecordTypes.html, r53/resource-record-sets-choosing-alias-non-alias.html
- k3 vpc/vpc-ip-addressing.html
- k4 r53/hosted-zone-private-associate-vpcs.html, r53/hosted-zone-private-considerations.html

### l4c
- k1 cf/HowCloudFrontWorks.html, cf/Expiration.html, cf/Invalidation.html
- k2 cf/DownloadDistS3AndCustomOrigins.html, cf/using-https-cloudfront-to-s3-origin.html, cf/private-content-restricting-access-to-s3.html, s3/WebsiteEndpoints.html
- k3 cf/private-content-restricting-access-to-s3.html, cf/private-content-vpc-origins.html
- k4 cf/using-https-viewers-to-cloudfront.html, cf/cnames-and-https-requirements.html

## Inferences (not a statement on a page)

- c3a k2: "each tier needs a subnet in at least two zones" (design rule) and "a /27 leaves 27" (32 minus 5).
- c3a k3: databases in subnets with only the local route (rule from q02-009; the page defines an isolated subnet).
- c3b k1: "by the resource that runs out" is the rule the questions use; the page describes each family.
- c3c trap, c3e k5 last clause ("that session is lost with the target"), c3f k2 last sentence, l3b k1 "whatever their addresses": consequences of the documented mechanism.
- c3e k4: "4 instances over 3 zones means 2 per zone" (arithmetic, q01-010).
- c3e trap, c3f trap, l3b trap, c4a trap first sentence, c4f trap ("not a larger node"): exam framing.
- c3f k3: the mapping from requirement to choice.
- l3a k1: "the lab pairs…" rests on the lab page's service list, not on the lab itself.
- l3c k2 and l4a k3: "check this first" advice.
- c4a k3 "treat a container as disposable", c4a k5 last sentence, c4b k1 "fits a team that already runs Kubernetes": decision rules.
- c4c k3: "each application gets its own entry" (the page says access points simplify access to shared datasets).
- c4c trap first sentence: from the page listing exactly two kinds of lifecycle action.
- c4e k5 "ARC moves traffic": summary; Region switch can also run recovery steps on resources.
- c4f k3 first sentence, c4f k4, c4f k5: synthesis.
- l4b k3: "breaks when the instance is replaced" (the page says the private address is released at termination).

## Second read

Done by a sub-agent that had not seen these sources; see the end of this file for what it rejected and what was changed.

## Found elsewhere (not fixed)

- `STEP_TAGS.l3a` is only "S3 features". The lab page lists API Gateway, Lambda, DynamoDB and CloudWatch, and its objectives are about troubleshooting Lambda with CloudWatch Logs and API Gateway configuration.
- `STEP_TAGS.l3c` and the l3c note in plan.js ("A load balancer, Auto Scaling and a database across Availability Zones"): the lab's objectives also name CloudFormation and Amazon EFS; its service list is CloudFormation, EFS and RDS and does not name a load balancer.
- `STEP_TAGS.c4a`/`c4b` have only "Containers"; c4b's lesson "Monitoring Containerized Workloads" would fit "CloudWatch" too.
- ECS documents three capacity options (ECS Managed Instances, Fargate, EC2). Content that speaks of two launch types (for example q01-036, q10-020 explanations) may want a check.
- ARC readiness check "is no longer open to new customers" (arc/recovery-readiness.html). ARC now also has Region switch.
- Lambda: 15 minutes per invocation, but up to 90 minutes for Lambda Managed Instances functions in some invocation modes (already noted for `d1c8`).
- The MemoryDB FAQ recommends ElastiCache for new workloads now that ElastiCache has a durability option (m1-048, already flagged).
- docs.aws.amazon.com now writes "Aurora serverless" and "Route 53 VPC Resolver"; plan.js c4e keeps the course's lesson name "Aurora Serverless v2", which is right for a lesson title.
- `saa-plan/CLAUDE.md` and `docs/keypoints.md` still describe the 14-day plan and `dNN.js` files only (being rewritten elsewhere).
