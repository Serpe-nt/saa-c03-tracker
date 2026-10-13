// Key points per plan step for Day 10. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d10e1: {
    why: "A system that is correct but slow still fails its users. Throwing bigger hardware at it wastes money when the real limit is somewhere else. Domain 3 tests whether you can find the one thing that holds a workload back and pick the service or setting that removes it.",
    k: [
      ["Weight", "Domain 3 is 24% of the scored content, so about 12 of the 50 scored questions."],
      ["Five task statements", "Storage, compute, databases, networking, and data ingestion and transformation."],
      ["Find the bottleneck first", "Performance stems name a bottleneck: IOPS, throughput, latency, connection count, cache misses or request rate. Find it first. Then pick the option that removes that bottleneck and nothing else."]
    ],
    trap: "The usual distractors add capacity where the stem shows no shortage: a bigger instance, more provisioned IOPS or more replicas.",
    docs: [["SAA-C03 exam guide: Domain 3", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain3.html"]]
  },

  d10e2: {
    why: "Storage that cannot keep up makes the whole application wait, and the fastest storage is wasted on data that is hardly read. Each kind of storage is fast in a different way: many requests, large files, quick small reads or shared access. This task tests whether you can match the storage to how the data is really read and written.",
    k: [
      ["S3 request rate", "For 503 Slow Down under parallel load, spread keys across more prefixes. S3 scales per prefix: at least 3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD requests per second each. The number of prefixes has no limit."],
      ["Large S3 transfers", "Large uploads use multipart upload: parts go in parallel and only a failed part is resent. Distant clients add Transfer Acceleration. Large downloads use parallel byte-range GETs."],
      ["S3 Express One Zone", "For the fastest S3 access. It gives single-digit millisecond access in one AZ."],
      ["gp3 or gp2", "gp3 includes 3,000 IOPS and 125 MiB/s at any size. You can raise both without adding capacity. gp2 is tied to size at 3 IOPS per GiB. Elastic Volumes changes the type while the volume stays in use."],
      ["io2, st1, sc1, instance store", "io2 Block Express is for sustained high IOPS at sub-millisecond latency. st1 is for large sequential work such as log processing, sc1 for rarely read data. Instance store NVMe is fastest, but its data is lost on stop, hibernate or terminate."],
      ["EFS", "The elastic shared file system for many Linux clients across AZs, including Fargate tasks. Elastic throughput fits spiky load. Provisioned bills a fixed level. Bursting scales with the amount of data stored."]
    ],
    trap: "A volume never delivers more than the instance type's own EBS limit, so adding provisioned IOPS can change nothing. Transfer Acceleration is for long distances, and S3 may bypass it when it would not be faster. io2 Multi-Attach works only inside one AZ.",
    docs: [
      ["Amazon EBS volume types", "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"],
      ["Optimizing Amazon S3 performance", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html"],
      ["Amazon EFS performance", "https://docs.aws.amazon.com/efs/latest/ug/performance.html"]
    ]
  },

  d10e3: {
    why: "Compute of the wrong shape is either too slow or paid for while idle. A memory-hungry program on a machine built for CPU work is one example. A long batch job in a function with a time limit is another. This task tests whether you can match the kind of compute, its size and the way it scales to what the workload really does.",
    k: [
      ["Placement groups", "Cluster packs instances into one AZ for the lowest latency (add Elastic Fabric Adapter for MPI). Partition keeps sets of instances on separate racks for HDFS, HBase or Cassandra. Spread allows only seven running instances per AZ."],
      ["Instance family", "Choose by the bottleneck. Memory optimized (R) when the working set must stay in RAM. Compute optimized (C) for CPU-bound work. Storage optimized (I) for local disk I/O. Graviton gives better price performance when the software runs on Arm."],
      ["Lambda memory and time limit", "Lambda allocates CPU in proportion to memory, so more memory speeds up a CPU-bound function. A longer timeout does not. A standard function runs for at most 15 minutes per invocation, so longer jobs go to Fargate or AWS Batch."],
      ["Lambda concurrency", "Reserved concurrency guarantees and caps a function's concurrency at no charge. Provisioned concurrency keeps environments initialized for a fee and removes cold starts."],
      ["SnapStart", "Restores a snapshot of a published version. SnapStart and provisioned concurrency cannot be combined."],
      ["Batch and Distributed Map", "AWS Batch queues and schedules container jobs, including job dependencies, on EC2, Spot or Fargate. A Step Functions Distributed Map runs up to 10,000 parallel child workflows over a set of S3 objects."]
    ],
    trap: "Reserved concurrency pre-warms nothing, so cold starts remain, and it throttles the function at that number. Provisioned concurrency is billed while configured, so a stem that refuses to pay for idle capacity rules it out.",
    docs: [
      ["Placement strategies for placement groups", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html"],
      ["Lambda function scaling and concurrency", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html"],
      ["Lambda SnapStart", "https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html"]
    ]
  },

  d10e4: {
    why: "A database slows down for different reasons. Too many reads hit one instance, or load jumps without warning. A query reads everything, or the same question is asked again and again. Each cause has its own cure. This task tests whether you can name the cause and pick the matching fix.",
    k: [
      ["Aurora endpoints", "Route each kind of load to the right instances. The cluster endpoint goes to the writer. The reader endpoint balances connections across Aurora Replicas. A custom endpoint targets a chosen subset, such as large replicas kept for reporting."],
      ["Unpredictable load", "For unpredictable relational load, Aurora serverless (the docs' current name for Aurora Serverless v2) scales in steps as small as 0.5 ACU without disruption. DynamoDB on-demand needs no capacity planning and instantly absorbs up to double the previous peak."],
      ["DynamoDB indexes", "A global secondary index has its own partition and sort key and can be added to an existing table. A local secondary index keeps the table's partition key and is created with the table. A Scan reads every item, so query on keys."],
      ["Caching strategy", "Lazy loading fills the cache on a miss and can serve stale data. Write-through updates the cache on every write. Use both with a TTL."],
      ["Cache engine", "Valkey and Redis OSS offer sorted sets, replication and automatic failover. Memcached offers none of them. ElastiCache Serverless is the choice when nobody should size cache nodes."],
      ["Purpose-built databases", "Neptune is for multi-hop relationship queries (graph). OpenSearch Service is for search over a catalog, fed from DynamoDB by a zero-ETL integration."]
    ],
    trap: "RDS Proxy pools connections. It adds no read capacity and caches nothing. A Multi-AZ standby cannot serve reads. DAX works only in front of DynamoDB. Match the fix to the symptom the stem names.",
    docs: [
      ["Amazon Aurora endpoint connections", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.Endpoints.html"],
      ["DynamoDB secondary indexes", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html"],
      ["ElastiCache caching strategies", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"]
    ]
  },

  d10e5: {
    why: "Users far from the servers wait while every request crosses the world, and a link over the public internet behaves differently from hour to hour. This task tests whether you can shorten and steady the path. That means answering from a cache near the user and picking the right entry point and load balancer. It also means choosing the link to a data center that fits the need.",
    k: [
      ["CloudFront cache key", "The cache hit ratio rises when the cache key holds only the values that change the response."],
      ["Origin Shield", "Cuts requests to the origin. It adds one more caching layer that every other CloudFront cache goes through."],
      ["CloudFront Functions or Lambda@Edge", "CloudFront Functions run sub-millisecond JavaScript on viewer request and viewer response events: header changes, redirects, cache-key normalization. Lambda@Edge adds origin events, network access and access to the request body."],
      ["API Gateway REST endpoint types", "Edge-optimized (the default) routes through CloudFront points of presence, for spread-out clients. Regional serves callers in the same Region directly. Private is reachable only through an interface VPC endpoint."],
      ["NLB or ALB", "A Network Load Balancer works at layer 4 and handles millions of requests per second. It has one static IP per AZ (an Elastic IP is optional) and can preserve the client IP. Routing HTTP requests by URL path needs an Application Load Balancer."],
      ["Direct Connect or VPN", "Direct Connect is a private physical link that bypasses the internet for a more consistent network experience. It is not encrypted by default. Site-to-Site VPN is IPsec over the internet. Accelerated VPN enters the AWS network at the nearest edge location."]
    ],
    trap: "Global Accelerator caches nothing and accepts only ALB, NLB, EC2 instance or Elastic IP endpoints, never an S3 bucket. VPN acceleration needs a transit gateway and cannot be switched on for an existing connection.",
    docs: [
      ["Understand the CloudFront cache key", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/understanding-the-cache-key.html"],
      ["CloudFront Functions vs Lambda@Edge", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html"],
      ["API Gateway endpoint types", "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html"]
    ]
  },

  d10e6: {
    why: "Data arrives from devices, applications and partners faster and in more shapes than a database can take in directly. When the intake is designed badly, records are throttled or lost, or they land in a form nobody can query. This task tests whether you can pick the service that collects, reshapes and delivers the data for the stated need.",
    k: [
      ["Kinesis shard limits", "A shard takes 1 MB/s or 1,000 records/s in and gives 2 MB/s out, shared by all consumers. Throttled producers need more shards or on-demand mode. Lagging consumers need enhanced fan-out: 2 MB/s per shard for each consumer."],
      ["Amazon Data Firehose", "Needs no consumer code. It buffers records and can call Lambda to transform them. It converts JSON to Parquet or ORC using a Glue table schema. With dynamic partitioning it builds S3 prefixes from keys in the data."],
      ["Existing Kafka or Spark", "Existing Kafka clients point to Amazon MSK. It runs open-source Apache Kafka, so applications need no code changes. Existing Spark, Hive or HBase jobs that need cluster control point to EMR. Its task nodes hold no HDFS data, so Spot fits there."],
      ["Data lake pattern", "Glue crawlers create and update Data Catalog tables. Athena and Redshift Spectrum query files in S3 without loading them. Lake Formation grants column, row and cell-level access in one place."],
      ["Transfer Family and DataSync", "Transfer Family is a managed SFTP, FTPS or FTP endpoint for S3 or EFS, so partners keep their clients. DataSync moves data into AWS storage and validates it."],
      ["Quick Sight", "For dashboards. Quick Sight (in Amazon Quick, formerly QuickSight) runs them on SPICE, its in-memory engine."]
    ],
    trap: "Firehose only delivers to destinations. Replay, or several independent consumers reading the same records, needs Kinesis Data Streams or MSK. Kinesis keeps records 24 hours by default, so replaying days of data means raising retention.",
    docs: [
      ["Kinesis Data Streams quotas and limits", "https://docs.aws.amazon.com/streams/latest/dev/service-sizes-and-limits.html"],
      ["Firehose: convert input data format", "https://docs.aws.amazon.com/firehose/latest/dev/record-format-conversion.html"],
      ["What is AWS Lake Formation?", "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html"]
    ]
  },

  d10e7: {
    why: "A wrong answer in a performance question often means you fixed a limit the question never mentioned. Working through exam-style questions, and writing down what each one was really limited by, trains you to spot the bottleneck before you look at the options.",
    k: [
      ["Bottleneck and deciding word", "For each miss, write the bottleneck the stem described and the word that ruled out your choice. Examples are 'sequential', 'unpredictable', 'same Region' and 'no code changes'."],
      ["Log by task statement", "Log every miss under its task statement (3.1 to 3.5). The task with the most misses is the one to revisit in the final pass."]
    ]
  },

  d10e8: {
    why: "The exam never shows you a card to recognise. It describes a workload, and you must come up with the service yourself. Flashcards practise that recall. Without them you find out in the exam which facts you could only recognise.",
    k: [
      ["Answer aloud first", "Say the answer aloud before you flip the card. Recognising a card feels like knowing it, but the exam asks you to recall the service from a description of the workload."],
      ["Missed pile", "Keep a pile of missed cards and repeat only that pile until it is empty. Cards you got right at once can wait for the full-deck pass before the exam."]
    ]
  },

  d10e9: {
    why: "In a guided lab it is easy to follow the clicks and learn nothing the exam asks for. The exam gives a symptom and asks for the setting. Tying each lab step to the problem it solves turns the lab into practice for exactly that.",
    k: [
      ["Say what each setting fixes", "After each lab step, say which bottleneck or requirement that setting addresses. The exam gives the symptom and asks for the setting, never the click path."]
    ]
  },

  d10c1: {
    why: "Users far from your Region get slow responses, because every request travels the whole way to it. Both services use the AWS edge network to shorten that trip, but for different needs. One answers from a cache near the user. The other carries traffic that cannot be cached and steers it between Regions.",
    trap: "Both use the AWS edge network, so the stem decides. Cacheable HTTP content means CloudFront. Static IP addresses, UDP or other non-HTTP traffic, or instant rerouting between Regions mean Global Accelerator, which caches nothing.",
    docs: [
      ["What is AWS Global Accelerator?", "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html"],
      ["What is Amazon CloudFront?", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html"]
    ]
  },

  d10c2: {
    why: "A database can struggle for different reasons: too many connections opened at once, too many read queries on the writer, or the same query repeated endlessly. Each of these tools fixes exactly one of them. Picking the wrong one leaves the real problem in place.",
    trap: "All three are offered for the same slow database. Connections exhausted by Lambda are fixed only by RDS Proxy, a writer busy with reads needs replicas, and identical repeated queries need a cache. A Multi-AZ standby serves no reads.",
    docs: [
      ["Amazon RDS Proxy", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html"],
      ["ElastiCache caching strategies", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"]
    ]
  },

  d10c3: {
    why: "Raw data in files answers no questions until something finds its structure, reshapes it and runs queries over it. These services each do part of that work, and their jobs overlap. You must tell them apart because the exam's wording points to exactly one: no servers, existing jobs, a warehouse, or discovering the schema.",
    trap: "The services overlap, so the wording decides. Ad hoc SQL on S3 with no servers is Athena. Existing Spark or Hadoop jobs are EMR. Joining warehouse tables with S3 history is Redshift Spectrum. Discovering schemas is a Glue crawler.",
    docs: [
      ["What is Amazon Athena?", "https://docs.aws.amazon.com/athena/latest/ug/what-is.html"],
      ["What is Amazon Data Firehose?", "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"]
    ]
  }
});
