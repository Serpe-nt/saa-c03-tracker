// Key points per plan step for Day 10. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d10e1: {
    k: [
      "Domain 3 is 24% of the scored content, so about 12 of the 50 scored questions. It has five task statements: storage, compute, databases, networking, and data ingestion and transformation.",
      "Performance stems name a bottleneck: IOPS, throughput, latency, connection count, cache misses or request rate. Find it first, then pick the option that removes that bottleneck and nothing else."
    ],
    trap: "The usual distractors add capacity where the stem shows no shortage: a bigger instance, more provisioned IOPS or more replicas.",
    docs: [["SAA-C03 exam guide: Domain 3", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain3.html"]]
  },

  d10e2: {
    k: [
      "S3 scales per prefix: at least 3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD requests per second each, with no limit on the number of prefixes. For 503 Slow Down under parallel load, spread keys across more prefixes.",
      "Large uploads use multipart upload (parts in parallel, only a failed part is resent); distant clients add Transfer Acceleration; large downloads use parallel byte-range GETs. S3 Express One Zone gives single-digit millisecond access in one AZ.",
      "gp3 includes 3,000 IOPS and 125 MiB/s at any size and lets you raise both without adding capacity; gp2 is tied to size at 3 IOPS per GiB. Elastic Volumes changes the type while the volume stays in use.",
      "io2 Block Express is for sustained high IOPS at sub-millisecond latency, st1 for large sequential work such as log processing, sc1 for rarely read data. Instance store NVMe is fastest, but its data is lost on stop, hibernate or terminate.",
      "EFS is the elastic shared file system for many Linux clients across AZs, including Fargate tasks. Elastic throughput fits spiky load, Provisioned bills a fixed level, and Bursting scales with the amount of data stored."
    ],
    trap: "A volume never delivers more than the instance type's own EBS limit, so adding provisioned IOPS can change nothing. Transfer Acceleration does not help instances in the bucket's Region. io2 Multi-Attach works only inside one AZ.",
    docs: [
      ["Amazon EBS volume types", "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"],
      ["Optimizing Amazon S3 performance", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html"],
      ["Amazon EFS performance", "https://docs.aws.amazon.com/efs/latest/ug/performance.html"]
    ]
  },

  d10e3: {
    k: [
      "Cluster placement groups pack instances into one AZ for the lowest latency (add Elastic Fabric Adapter for MPI). Partition groups keep sets of instances on separate racks for HDFS, HBase or Cassandra. A spread group allows only seven running instances per AZ.",
      "Choose the instance family by the bottleneck: memory optimized (R) when the working set must stay in RAM, compute optimized (C) for CPU-bound work, storage optimized (I) for local disk I/O. Graviton gives better price performance when the software runs on Arm.",
      "Lambda allocates CPU in proportion to memory, so more memory speeds up a CPU-bound function; a longer timeout does not. One invocation runs for at most 15 minutes, so longer jobs go to Fargate or AWS Batch.",
      "Reserved concurrency guarantees and caps a function's concurrency at no charge. Provisioned concurrency keeps environments initialized for a fee and removes cold starts. SnapStart restores a snapshot of a published version; those two cannot be combined.",
      "AWS Batch queues and schedules container jobs, including job dependencies, on EC2, Spot or Fargate. A Step Functions Distributed Map runs up to 10,000 parallel child workflows over a set of S3 objects."
    ],
    trap: "Reserved concurrency pre-warms nothing, so cold starts remain, and it throttles the function at that number. Provisioned concurrency is billed while configured, so a stem that refuses to pay for idle capacity rules it out.",
    docs: [
      ["Placement strategies for placement groups", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html"],
      ["Lambda function scaling and concurrency", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html"],
      ["Lambda SnapStart", "https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html"]
    ]
  },

  d10e4: {
    k: [
      "Aurora has three kinds of endpoint to route load: the cluster endpoint goes to the writer, the reader endpoint balances connections across Aurora Replicas, and a custom endpoint targets a chosen subset, such as large replicas kept for reporting.",
      "Aurora Serverless v2 scales in steps as small as 0.5 ACU without disrupting connections, for unpredictable relational load. DynamoDB on-demand needs no capacity planning and instantly absorbs up to double the previous peak.",
      "A global secondary index has its own partition and sort key and can be added to an existing table. A local secondary index keeps the table's partition key and is created with the table. A Scan reads every item, so query on keys.",
      "Lazy loading fills the cache on a miss and can serve stale data; write-through updates the cache on every write; use both with a TTL. Valkey and Redis OSS offer sorted sets, replication and automatic failover; Memcached offers none of them.",
      "Purpose-built choices: Neptune for multi-hop relationship queries (graph), OpenSearch Service for search over a catalog, fed from DynamoDB by a zero-ETL integration, and ElastiCache Serverless when nobody should size cache nodes."
    ],
    trap: "RDS Proxy pools connections; it adds no read capacity and caches nothing. A Multi-AZ standby cannot serve reads. DAX works only in front of DynamoDB. Match the fix to the symptom the stem names.",
    docs: [
      ["Amazon Aurora endpoint connections", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.Endpoints.html"],
      ["DynamoDB secondary indexes", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html"],
      ["ElastiCache caching strategies", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"]
    ]
  },

  d10e5: {
    k: [
      "The CloudFront cache hit ratio rises when the cache key holds only the values that change the response. Origin Shield adds one more caching layer that every other CloudFront cache goes through, which cuts requests to the origin.",
      "CloudFront Functions run sub-millisecond JavaScript on viewer request and viewer response events: header changes, redirects, cache-key normalization. Lambda@Edge adds origin events, network access and access to the request body.",
      "API Gateway REST endpoint types: edge-optimized (the default) routes through CloudFront points of presence for spread-out clients; Regional serves callers in the same Region directly; private is reachable only through an interface VPC endpoint.",
      "A Network Load Balancer works at layer 4, handles millions of requests per second, has one static IP per AZ (an Elastic IP is optional) and can preserve the client IP. Routing HTTP requests by URL path needs an Application Load Balancer.",
      "Direct Connect is a private physical link that bypasses the internet for a more consistent network experience; it is not encrypted by default. Site-to-Site VPN is IPsec over the internet. Accelerated VPN enters the AWS network at the nearest edge location."
    ],
    trap: "Global Accelerator caches nothing and accepts only ALB, NLB, EC2 instance or Elastic IP endpoints, never an S3 bucket. VPN acceleration needs a transit gateway and cannot be switched on for an existing connection.",
    docs: [
      ["Understand the CloudFront cache key", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/understanding-the-cache-key.html"],
      ["CloudFront Functions vs Lambda@Edge", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html"],
      ["API Gateway endpoint types", "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html"]
    ]
  },

  d10e6: {
    k: [
      "A Kinesis shard takes 1 MB/s or 1,000 records/s in and gives 2 MB/s out, shared by all consumers. Throttled producers need more shards or on-demand mode. Lagging consumers need enhanced fan-out: 2 MB/s per shard for each consumer.",
      "Amazon Data Firehose needs no consumer code. It buffers records, can call Lambda to transform them, converts JSON to Parquet or ORC using a Glue table schema, and with dynamic partitioning builds S3 prefixes from keys in the data.",
      "Existing Kafka clients point to Amazon MSK, which runs open-source Apache Kafka, so applications need no code changes. Existing Spark, Hive or HBase jobs that need cluster control point to EMR; task nodes hold no HDFS data, so Spot fits there.",
      "Data lake pattern: Glue crawlers create and update Data Catalog tables, Athena and Redshift Spectrum query files in S3 without loading them, and Lake Formation grants column, row and cell-level access in one place.",
      "AWS Transfer Family is a managed SFTP, FTPS or FTP endpoint in front of S3 or EFS, so partners keep their clients. DataSync moves data into AWS storage with integrity validation. Quick Sight serves dashboards from its in-memory engine, SPICE."
    ],
    trap: "Firehose only delivers to destinations. Replay, or several independent consumers reading the same records, needs Kinesis Data Streams or MSK. Kinesis keeps records 24 hours by default, so replaying days of data means raising retention.",
    docs: [
      ["Kinesis Data Streams quotas and limits", "https://docs.aws.amazon.com/streams/latest/dev/service-sizes-and-limits.html"],
      ["Firehose: convert input data format", "https://docs.aws.amazon.com/firehose/latest/dev/record-format-conversion.html"],
      ["What is AWS Lake Formation?", "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html"]
    ]
  },

  d10e7: {
    k: [
      "For each miss, write the bottleneck the stem described and the word that ruled out your choice, for example 'sequential', 'unpredictable', 'same Region' or 'no code changes'.",
      "Log every miss under its task statement (3.1 to 3.5). The task with the most misses is the one to revisit on Day 12."
    ]
  },

  d10e8: {
    k: [
      "Say the answer aloud before you flip the card. Recognising a card feels like knowing it, but the exam asks you to recall the service from a description of the workload.",
      "Keep a pile of missed cards and repeat only that pile until it is empty. Cards you got right at once can wait for the full-deck pass on Day 13."
    ]
  },

  d10e9: {
    k: [
      "After each lab step, say which bottleneck or requirement that setting addresses. The exam gives the symptom and asks for the setting, never the click path."
    ]
  },

  d10b1: {
    k: [
      "With OAC, CloudFront signs its requests to S3. The bucket policy allows the service principal <code>cloudfront.amazonaws.com</code> only when <code>AWS:SourceArn</code> is your distribution, so the bucket needs no public access.",
      "The origin must be the regular S3 bucket. A bucket configured as a website endpoint counts as a custom origin, and OAC cannot be used with it.",
      "AWS recommends OAC over the older origin access identity (OAI), because OAC also supports objects encrypted with SSE-KMS, all Regions, and PUT and DELETE requests to S3.",
      "A cache behavior maps a path pattern to an origin. One distribution can therefore serve the bucket by default and send <code>/api/*</code> to an ALB origin under the same domain name."
    ],
    trap: "When the bucket must stay private, a public bucket policy or S3 static website hosting is the wrong answer; OAC plus a bucket policy scoped to the distribution is right. OAC protects the origin, signed URLs and cookies restrict viewers.",
    docs: [
      ["Restrict access to an Amazon S3 origin (OAC)", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html"],
      ["CloudFront cache behavior settings", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistValuesCacheBehavior.html"]
    ]
  },

  d10b2: {
    k: [
      "Two permission mechanisms are at work. API Gateway may invoke the function because of the function's resource-based policy; the function may call DynamoDB because of its execution role.",
      "HTTP APIs have fewer features at a lower price. REST APIs add API keys, per-client throttling, request validation, AWS WAF integration and private endpoints.",
      "The first request to a new execution environment is a cold start, visible as Init Duration in the REPORT log line. SnapStart does not support OS-only runtimes such as <code>provided.al2023</code>, which a Go function uses.",
      "Read by key with GetItem or Query. A Scan reads the entire table and filters afterwards, so it gets slower and uses more read capacity as the table grows."
    ],
    trap: "For an API over key-value data with 'least operational overhead', options that put EC2 instances, containers or a relational database behind the API add things to manage without meeting any stated requirement.",
    docs: [
      ["Choose between REST APIs and HTTP APIs", "https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html"],
      ["Invoking Lambda with API Gateway", "https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html"]
    ]
  },

  d10c1: {
    trap: "Both use the AWS edge network, so the stem decides. Cacheable HTTP content means CloudFront. Static IP addresses, UDP or other non-HTTP traffic, or instant rerouting between Regions mean Global Accelerator, which caches nothing.",
    docs: [
      ["What is AWS Global Accelerator?", "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html"],
      ["What is Amazon CloudFront?", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html"]
    ]
  },

  d10c2: {
    trap: "All three are offered for the same slow database. Connections exhausted by Lambda are fixed only by RDS Proxy, a writer busy with reads needs replicas, and identical repeated queries need a cache. A Multi-AZ standby serves no reads.",
    docs: [
      ["Amazon RDS Proxy", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html"],
      ["ElastiCache caching strategies", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"]
    ]
  },

  d10c3: {
    trap: "The services overlap, so the wording decides: ad hoc SQL on S3 with no servers is Athena, existing Spark or Hadoop jobs are EMR, joining warehouse tables with S3 history is Redshift Spectrum, discovering schemas is a Glue crawler.",
    docs: [
      ["What is Amazon Athena?", "https://docs.aws.amazon.com/athena/latest/ug/what-is.html"],
      ["What is Amazon Data Firehose?", "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"]
    ]
  }
});
