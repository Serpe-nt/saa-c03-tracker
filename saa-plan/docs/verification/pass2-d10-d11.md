# Second verification pass: d10.js and d11.js

Date: 2026-10-12. Pools: `site/quiz/d10.js` (Domain 3, 50 questions) and `site/quiz/d11.js` (Domain 4, 50 questions). Independent of the first pass (`d10-d11.md`), whose log was used only as a list of things to look at harder.

Method: every question was read in full: stem, key, and each wrong option's explanation. Each factual statement was looked up on a page fetched with curl from `docs.aws.amazon.com` or `aws.amazon.com` (about 280 pages), requested without following redirects, so a page that does not exist showed up as a 301/302 and was not used. A fact counts as confirmed only when the sentence or table entry was found in the page text. A statement that a service cannot do something had to be backed by a sentence stating the limit or by the authoritative list (listener protocols, endpoint types, volume table, engine comparison); where neither was found, the explanation was rewritten to say only what is documented.

| | d10 | d11 | Total |
|---|---|---|---|
| Checked | 50 | 50 | 100 |
| Changed | 27 | 17 | 44 |
| of which `doc` only | 2 | 6 | 8 |
| Answer key changed | 0 | 0 | 0 |
| Not reached | 0 | 0 | 0 |

No answer key changed. No stem changed. Two option texts changed without changing their meaning (q10-018, q10-034). Every keyed answer was confirmed as the single best answer against the pages below.

## Changed questions

One line per id; "rewritten" entries are detailed in the next section.

d10:

- **q10-006** – Max I/O is now called "previous-generation" in the explanation, as in q10-007. https://docs.aws.amazon.com/efs/latest/ug/performance.html
- **q10-010** – rewritten (FSx for Lustre scratch).
- **q10-011** – `doc` `ec2` → `placement`.
- **q10-012** – `doc` `ec2` → `placement`; two wrong-option explanations rewritten; the keyed explanation said the group "exposes the partition number to instances", the page says each partition "has its own set of racks" and that you "can see which instances are in which partitions". https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html
- **q10-013** – "steady microservice load would accrue surplus credit charges" was too absolute: charges apply when average CPU use over 24 hours exceeds the baseline. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances-unlimited-mode.html
- **q10-018** – this was the question `qstats` counted as "keyed option clearly longest". One distractor gained a word ("…business-hours peak load"); key and meaning unchanged.
- **q10-020** – rewritten (Elastic Beanstalk).
- **q10-021** – rewritten (Lambda); `doc` set to `batch`.
- **q10-022** – the first-pass doubt is settled: "AWS announced that the end-of-life date for Performance Insights was July 31, 2026, and has migrated Performance Insights users to Database Insights." The explanation now says Database Insights replaced Performance Insights. Also rewritten (RDS Proxy). https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights.html
- **q10-023** – "Changing an instance class requires a reboot or failover" now says what the settings table says ("An outage occurs during this change"). "Within seconds while connections stay open" in the keyed explanation was not found on a page; it now says "in increments as small as 0.5 ACU, typically with no pause in processing". https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Modifying.html and https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html
- **q10-027**, **q10-028**, **q10-029** – rewritten (Memcached, DAX, DynamoDB rank).
- **q10-031** – rewritten (Keyspaces); `doc` set to `neptune`.
- **q10-032** – rewritten (Keyspaces); `doc` set to `opensearch`.
- **q10-033**, **q10-035** – rewritten (Global Accelerator).
- **q10-034** – rewritten (AWS WAF); the option now uses the current name "protection pack (web ACL)". https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-action.html
- **q10-037** – rewritten (ALB, Classic Load Balancer).
- **q10-040** – rewritten (CloudFront); `doc` set to `vpn`.
- **q10-042**, **q10-043** – rewritten (MSK; Firehose and SNS).
- **q10-044** – rewritten (Amazon MQ); `doc` set to `msk`.
- **q10-046** – `doc` set to `transfer`.
- **q10-047** – rewritten (AWS Glue).
- **q10-049** – rewritten (S3 access points); `doc` set to `lakeformation`.
- **q10-050** – rewritten (Managed Grafana); "scales to many thousands of users" → "hundreds of thousands", the figure on the page. https://aws.amazon.com/quick/quicksight/faqs/

d11:

- **q11-009** – rewritten (EBS Snapshots Archive).
- **q11-010** – "much cheaper" Infrequent Access → "lower-cost"; the page gives no size for the difference. https://docs.aws.amazon.com/efs/latest/ug/lifecycle-management-efs.html
- **q11-012** – Transfer Family "bills per endpoint hour" → "for each enabled protocol endpoint and for the data transferred", which is how the page puts it. https://aws.amazon.com/aws-transfer-family/pricing/
- **q11-013**, **q11-014** – `doc` `ec2-pricing` → `savings-plans`.
- **q11-017** – `doc` set to `compute-optimizer`.
- **q11-020** – EKS "hourly control-plane charge" → "per-cluster charge" (the page says "per cluster pricing"). https://aws.amazon.com/eks/pricing/
- **q11-029** – rewritten (DAX).
- **q11-030** – reserved capacity "for 1 or 3 years" → "1 year (3 years in some Regions)". https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/reserved-capacity.html
- **q11-036** – "AWS suggests above about 25%" → "25% or more of Aurora spend". https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.StorageReliability.html
- **q11-037**, **q11-038** – `doc` `vpc` → `endpoints`.
- **q11-040** – rewritten (Transit Gateway).
- **q11-042**, **q11-046** – rewritten (Global Accelerator).
- **q11-047** – `doc` set to `vpn`.
- **q11-050** – rewritten (Cost Explorer).

## Wrong-option claims rewritten because no page backs them

- **q10-010** – "a scratch file system has fixed capacity": capacity can be increased on request for every deployment type except scratch 1. Now: the ECS volume table lists no FSx for Lustre option, scratch data "isn't replicated", and it grows only on request. https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html and https://docs.aws.amazon.com/fsx/latest/LustreGuide/managing-storage-capacity.html
- **q10-012** – a cluster placement group "exposes no rack topology", and Dedicated Hosts do "not provide rack-aware partitions": neither is stated. Now each says what the feature is for (low latency in one AZ; an instance "always restarts on the same host"). https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html and https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-understanding.html
- **q10-020** – Elastic Beanstalk "does not offer ECS's independent per-service task scaling": replaced with "each of the instances in the environment run the same set of containers". https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_docker_ecs.html
- **q10-021** – "Lambda has no job dependencies": removed; the time limit alone rules the option out. https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html
- **q10-022** – RDS Proxy "does not cache query results": replaced with what it does (pools and reuses connections). https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html
- **q10-027** – a Memcached cluster needs "manual scaling": replaced with the engine comparison (simple data types) and the fact that Auto Discovery belongs to node-based clusters. https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/SelectEngine.html
- **q10-028**, **q11-029** – "DAX accelerates/caches reads only": now what the page says (offloads read activity; "not ideal" for write-intensive applications). https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html
- **q10-029** – "DynamoDB cannot compute a player's rank natively": now reasoning about the query the application would need. The Memcached part is backed by the comparison table (replication No, automatic failover No, sorted sets No). https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/SelectEngine.html
- **q10-031**, **q10-032** – Keyspaces "has no way to traverse relationships" and "not full-text relevance search or faceting": now a Cassandra-compatible wide-column store queried with CQL. https://docs.aws.amazon.com/keyspaces/latest/devguide/what-is-keyspaces.html
- **q10-033**, **q10-035**, **q11-042**, **q11-046** – Global Accelerator "does not cache" / "has no caching": now the FAQ's own contrast (CloudFront serves cacheable content; Global Accelerator works "by proxying packets at the edge"). That it cannot front S3 is backed by the endpoint list (NLB, ALB, EC2 instances, Elastic IP addresses). https://aws.amazon.com/global-accelerator/faqs/ and https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints.html
- **q10-034** – AWS WAF "is not a tool for rewriting headers": now the documented limit: "you only add to the request. You can't modify or replace any part of the original request." https://docs.aws.amazon.com/waf/latest/developerguide/customizing-the-incoming-request.html
- **q10-037** – an ALB's "IP addresses change as it scales" and a Classic Load Balancer is "without static IP addresses": now the listener protocol list ("HTTP, HTTPS"), the FAQ answer that an NLB provides "a static IP address per Availability Zone" in front of an ALB, and "Classic Load Balancers are the previous generation". https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html, https://aws.amazon.com/elasticloadbalancing/faqs/ and https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/introduction.html
- **q10-040** – CloudFront "cannot carry IPsec tunnels": now "supports content that can be sent using the HTTP or WebSocket protocols". https://aws.amazon.com/cloudfront/faqs/
- **q10-042** – "MSK requires running a Kafka cluster": now describes what the option itself adds (cluster, Kafka Connect workers, connector).
- **q10-043** – Firehose "does not let applications re-read past records" and SNS standard topics "do not store messages for replay": now one destination per stream (FAQ) and "message archiving and replay for FIFO topics". https://aws.amazon.com/firehose/faqs/ and https://docs.aws.amazon.com/sns/latest/dg/fifo-message-archiving-replay.html
- **q10-044** – Amazon MQ brokers "do not speak the Kafka protocol": now the documented protocol list (JMS, AMQP, MQTT, STOMP, WebSocket). https://aws.amazon.com/amazon-mq/faqs/
- **q10-047** – Glue "does not run HBase or Hive services or support bootstrap actions": now AWS's own comparison: "Amazon EMR provides you with direct access to your Hadoop environment, affording you lower-level access and greater flexibility in using tools beyond Spark." https://aws.amazon.com/glue/faqs/
- **q10-049** – access points control access "not to individual columns or rows": now says an access point policy applies to whole objects and prefixes. https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-points.html
- **q10-050** – Managed Grafana "has no in-memory engine like SPICE": now what it is ("query, correlate, and visualize operational metrics, logs, and traces from multiple sources"). https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html
- **q11-009** – the archive tier "has a 90-day minimum and a restore fee": only "snapshots that you plan to store for 90 days or longer and that you rarely need to access" was found. https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-archive.html
- **q11-040** – Transit Gateway "doesn't carry traffic between subnets of the same VPC": now what it connects and that it charges "for each gigabyte" processed. https://aws.amazon.com/transit-gateway/pricing/
- **q11-050** – Cost Explorer "doesn't provide 12 months of hourly, resource-level line items": now the documented granularity (hourly data "without resource-level data", except EC2 instances). https://docs.aws.amazon.com/cost-management/latest/userguide/ce-granular-data.html

## First-pass doubts, now settled

- **Performance Insights (q10-022):** end of life was July 31, 2026; users were migrated to Database Insights (URL above).
- **Glue, Managed Grafana, Elastic Beanstalk characterizations:** each now quotes a page (see the section above).
- **Lead times (q10-038, q10-040, q11-047):** the whitepaper sentence the first pass found was read again: connectivity "can be established within hours, however, it may take weeks or months if additional circuits must be installed". The page is kept "for historical reference". https://docs.aws.amazon.com/whitepapers/latest/hybrid-connectivity/time-to-deploy.html

## Keys that rest on an out-of-scope category

Left as written, because no page contradicts them:

- **q11-023** (t3.medium), **q11-033** (cache instead of more replicas): the key is the cheapest option only by comparing instance prices, which the pricing pages load by script.
- **q11-030**: that reserved capacity discounts provisioned throughput is stated ("save up to 54%"); that provisioned capacity costs less per request than on-demand for steady traffic is not stated in words.
- **q11-042**: that origin fetches from S3 are free is stated; that CloudFront's transfer-out rate is lower than S3's is not.
- **q10-040**, **q11-047**: the key also rests on Direct Connect taking longer than a VPN to set up (whitepaper sentence above).

## Still uncertain

- **q10-023** – the stem asks for scaling "within seconds"; the product page says "Instantly scale … in fine-grained increments" and the user guide "typically … no pause in processing". No page gives a time. Stem left as written. https://aws.amazon.com/rds/aurora/serverless/
- **q10-032** – full-text search, fuzzy matching and relevance are on AWS pages; the word "facets" is not (the page says OpenSearch lets you "aggregate" data). https://aws.amazon.com/what-is/opensearch/
- **q11-008** – whether a snapshot can be restored to a smaller volume was not found either way; the explanation does not claim it.
- **q11-046** – whether a price class applies to a distribution on a CloudFront flat-rate plan is still not stated on the pages fetched; the question assumes pay-as-you-go.
- Out-of-scope categories, counted only: price comparisons not stated in words, 12 questions; provisioning lead times, 3 questions; figures on which AWS pages disagree, 1 question; `ref` against Skill Builder lesson content, not evaluated for any of the 100.

## Not reached

Nothing. `ref` ids were not re-evaluated beyond what `node --test` enforces.

## Missing `DOCS` keys

No key exists for Amazon Quick Sight (q10-050) or for the Cost and Usage Report / AWS Data Exports (q11-050); both questions stay without `doc`. No tag was missing.

## Checks

`node --test` (33 pass), `node tools/qstats.mjs d10` and `d11` ("keyed option clearly longest: 0" for both), `node tools/similar.mjs 0.38` (the same five known pairs; no new pair involves d10 or d11).
