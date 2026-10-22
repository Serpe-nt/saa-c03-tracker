// Key points for the plan steps whose id starts with d10 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d10e1: {
    head: "Domain 3: find the one thing that holds the workload back",
    why: "A report page takes eight seconds. The team doubles the instance size, pays twice as much, and the page still takes eight seconds, because the time goes to the same query running over and over. You need to find the real limit before you pay to remove it.",
    idea: "Domain 3, Design High-Performing Architectures, is 24% of the scored content, so about 12 of the 50 scored questions. Its five task statements: storage, compute, databases, networking, and data ingestion and transformation.",
    k: [
      ["Find the bottleneck first", "Performance stems name one: IOPS, throughput, latency, connection count, cache misses or request rate. Find it, then pick the option that removes that bottleneck and nothing else."]
    ],
    trap: "The usual distractors add capacity where the stem shows no shortage: a bigger instance, more provisioned IOPS or more replicas.",
    q: {
      q: "Thousands of Lambda invocations each open a new connection to an RDS database. The database runs out of connections while its CPU stays at 20%. Which bottleneck does the stem name, and which option removes it?",
      o: [
        "The connection count: put RDS Proxy between the functions and the database",
        "The CPU: move the database to a larger instance class",
        "The read load: add two read replicas behind the writer",
        "The disk: raise the provisioned IOPS of the storage"
      ],
      a: [0],
      x: [
        "Right. The stem shows connections running out, not CPU. RDS Proxy pools connections for many short-lived callers such as Lambda.",
        "CPU at 20% shows no shortage there. A bigger instance adds capacity the stem never asked for.",
        "Nothing in the stem points to read load. Replicas add read capacity, not a pool of connections.",
        "The stem says nothing about the disk. More IOPS is capacity where there is no shortage."
      ],
      dom: 3, tags: ["RDS"], doc: "rds"
    },
    docs: [["SAA-C03 exam guide: Domain 3", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain3.html"]]
  },

  d10e2: {
    head: "Task 3.1: match the storage to how the data is read and written",
    why: "A batch job uploads thousands of files in parallel and S3 starts answering 503 Slow Down. Elsewhere a database waits on a disk that was sized for capacity, not for speed. Each kind of storage is fast in its own way, and you need the one that fits how the data is really used.",
    idea: "Task statement 3.1 asks you to pick object, block or file storage, and its settings, by the access pattern: many requests, large files, small random reads, sequential scans or shared access.",
    k: [
      ["S3 scales per prefix", "For 503 Slow Down under parallel load, spread keys across more prefixes. Each prefix takes at least 3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD requests per second, and the number of prefixes has no limit."],
      ["Big S3 transfers in parallel", "Multipart upload sends parts in parallel and resends only a failed part. Distant clients add Transfer Acceleration. Large downloads use parallel byte-range GETs. S3 Express One Zone gives single-digit millisecond access in one AZ."],
      ["gp3 separates speed from size", "gp3 includes 3,000 IOPS and 125 MiB/s at any size, and you can raise both without adding capacity. gp2 is tied to size at 3 IOPS per GiB. Elastic Volumes changes the type while the volume stays in use."],
      ["The other block options", "io2 Block Express for sustained high IOPS at sub-millisecond latency. st1 for large sequential work such as log processing, sc1 for rarely read data. Instance store NVMe is fastest, but its data is lost on stop, hibernate or terminate."],
      ["EFS for shared files", "The elastic shared file system for many Linux clients across AZs, Fargate tasks included. Elastic throughput fits spiky load. Provisioned bills a fixed level. Bursting scales with the amount of data stored."]
    ],
    trap: "A volume never delivers more than the instance type's own EBS limit, so adding provisioned IOPS can change nothing. Transfer Acceleration is for long distances, and S3 may bypass it when it would not be faster. io2 Multi-Attach works only inside one AZ.",
    q: {
      q: "A database volume was raised from 3,000 to 16,000 provisioned IOPS, but the database reads no faster. The instance type's own EBS limit is lower than the new figure. What should change?",
      o: [
        "Move the database to an instance type with a higher EBS limit",
        "Change the volume from gp3 to io2 Block Express",
        "Change the volume to st1 for more throughput",
        "Make the volume larger, so that it gets more IOPS"
      ],
      a: [0],
      x: [
        "Right. A volume never delivers more than the instance type's own EBS limit, so the limit itself has to rise.",
        "io2 Block Express gives high IOPS, but the instance's EBS limit still caps whatever the volume could deliver.",
        "st1 is for large sequential work. It does not lift the instance's limit, and a database's small reads suit it poorly.",
        "On gp3, IOPS are not tied to size, and the instance's limit would still cap them."
      ],
      dom: 3, tags: ["EBS & instance store"], doc: "ebs"
    },
    docs: [
      ["Amazon EBS volume types", "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"],
      ["Optimizing Amazon S3 performance", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html"],
      ["Amazon EFS performance", "https://docs.aws.amazon.com/efs/latest/ug/performance.html"]
    ]
  },

  d10e3: {
    head: "Task 3.2: give the workload compute of the right shape",
    why: "A memory-hungry analytics job runs on an instance built for CPU work and swaps to disk all night. A two-hour batch job is put in a standard Lambda function and is cut off at fifteen minutes. Compute of the wrong shape is either slow or paid for while it waits, so the kind, size and scaling must fit what the workload does.",
    idea: "Task statement 3.2 asks you to choose between instances, containers and functions, the instance family and its placement, and how the compute scales and starts.",
    k: [
      ["Instance family by bottleneck", "Memory optimized (R) when the working set must stay in RAM. Compute optimized (C) for CPU-bound work. Storage optimized (I) for local disk I/O. Graviton gives better price performance when the software runs on Arm."],
      ["Placement groups", "Cluster packs instances into one AZ for the lowest latency (add Elastic Fabric Adapter for MPI). Partition keeps sets of instances on separate racks for HDFS, HBase or Cassandra. Spread allows only seven running instances per AZ."],
      ["Lambda memory and its time limit", "Lambda allocates CPU in proportion to memory, so more memory speeds up a CPU-bound function. A longer timeout does not. A standard function runs for at most 15 minutes per invocation, so longer jobs go to Fargate or AWS Batch."],
      ["Cold starts", "Provisioned concurrency, from the Domain 2 review, keeps environments initialized for a fee. SnapStart instead restores a snapshot of a published version. The two cannot be combined."],
      ["Many jobs at once", "AWS Batch queues and schedules container jobs, including job dependencies, on EC2, Spot or Fargate. A Step Functions Distributed Map runs up to 10,000 parallel child workflows over a set of S3 objects."]
    ],
    trap: "Reserved concurrency pre-warms nothing, so cold starts remain, and it throttles the function at that number. Provisioned concurrency is billed while configured, so a stem that refuses to pay for idle capacity rules it out.",
    q: {
      q: "A CPU-bound Lambda function that resizes images takes 40 seconds per image with 512 MB of memory. How do you make each run faster?",
      o: [
        "Raise the function's memory, which also gives it more CPU",
        "Raise the function's timeout to the maximum",
        "Give the function reserved concurrency",
        "Turn on SnapStart for the function's published version"
      ],
      a: [0],
      x: [
        "Right. Lambda allocates CPU in proportion to memory, so more memory speeds up a CPU-bound function.",
        "A longer timeout only lets a slow run go on longer. It adds no CPU.",
        "Reserved concurrency sets aside and caps how many copies run at once. Each copy is just as slow.",
        "SnapStart shortens start-up from a snapshot. It does not speed up the 40 seconds of work."
      ],
      dom: 3, tags: ["Lambda"], doc: "lambda"
    },
    docs: [
      ["Placement strategies for placement groups", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html"],
      ["Lambda function scaling and concurrency", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html"],
      ["Lambda SnapStart", "https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html"]
    ]
  },

  d10e4: {
    head: "Task 3.3: name why the database is slow, then pick the matching fix",
    why: "The shop's database slows down every afternoon. One team wants a bigger instance, another a cache, a third more replicas. Each would help with a different cause, and the wrong one costs money and changes nothing. You need to name the cause before you pick the cure.",
    idea: "Task statement 3.3 asks you to match each cause to its fix: replicas and endpoints for read load, serverless capacity for load nobody can predict, indexes for queries that read too much, and a cache for the same question asked again and again.",
    k: [
      ["Aurora endpoints route the load", "The cluster endpoint goes to the writer. The reader endpoint balances connections across Aurora Replicas. A custom endpoint targets a chosen subset, such as large replicas kept for reporting."],
      ["Load nobody can predict", "Aurora serverless (the docs' current name for Aurora Serverless v2) scales in steps as small as 0.5 ACU without disruption. DynamoDB on-demand needs no capacity planning and instantly absorbs up to double the previous peak."],
      ["DynamoDB indexes", "A global secondary index has its own partition and sort key and can be added to an existing table. A local secondary index keeps the table's partition key and is created with the table. A Scan reads every item, so query on keys."],
      ["Which cache engine", "The caching strategies are on Day 9. Valkey and Redis OSS offer sorted sets, replication and automatic failover, and Memcached offers none of them. ElastiCache Serverless when nobody should size cache nodes."],
      ["Purpose-built databases", "Neptune for multi-hop relationship queries (graph). OpenSearch Service for search over a catalog, fed from DynamoDB by a zero-ETL integration."]
    ],
    trap: "RDS Proxy pools connections. It adds no read capacity and caches nothing. A Multi-AZ standby cannot serve reads. DAX works only in front of DynamoDB. Match the fix to the symptom the stem names.",
    q: {
      q: "An existing DynamoDB table of orders has <code>customerId</code> as its partition key. A new screen lists orders by status across all customers, and today it runs a Scan of the whole table. What fixes it without rebuilding the table?",
      o: [
        "Add a global secondary index with the status as its partition key, and query that index",
        "Add a local secondary index on the status, and query that index",
        "Put DAX in front of the table and keep the Scan",
        "Switch the table to on-demand capacity mode"
      ],
      a: [0],
      x: [
        "Right. A global secondary index has its own partition key and can be added to an existing table, so the screen can query by status.",
        "A local secondary index keeps the table's partition key and can only be created with the table.",
        "A cache in front does not change what a Scan does: it still reads every item.",
        "On-demand changes how capacity is billed and scaled, not how much a Scan reads."
      ],
      dom: 3, tags: ["DynamoDB"], doc: "dynamodb"
    },
    docs: [
      ["Amazon Aurora endpoint connections", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.Endpoints.html"],
      ["DynamoDB secondary indexes", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html"],
      ["ElastiCache caching strategies", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"]
    ]
  },

  d10e5: {
    head: "Task 3.4: shorten and steady the path between users and servers",
    why: "Users in Sydney wait while every request to your servers in Ireland crosses the world. A partner's link over the public internet is fast at noon and slow at night. You need a shorter, steadier path: answers from near the user, the right entry point and load balancer, and the right link to the data center.",
    idea: "Task statement 3.4 asks you to choose that path: CloudFront caching and code at the edge, the API Gateway endpoint type, the load balancer, and a VPN or Direct Connect link.",
    k: [
      ["Fewer trips to the origin", "The cache hit ratio rises when the cache key holds only the values that change the response. Origin Shield cuts requests to the origin further: one more caching layer that every other CloudFront cache goes through."],
      ["Code at the edge", "CloudFront Functions run sub-millisecond JavaScript on viewer request and viewer response events: header changes, redirects, cache-key normalization. Lambda@Edge adds origin events, network access and access to the request body."],
      ["API Gateway endpoint types", "Edge-optimized (the default) routes through CloudFront points of presence, for spread-out clients. Regional serves callers in the same Region directly. Private is reachable only through an interface VPC endpoint."],
      ["NLB or ALB", "A Network Load Balancer works at layer 4 and handles millions of requests per second. It has one static IP per AZ (an Elastic IP is optional) and can preserve the client IP. Routing HTTP requests by URL path needs an Application Load Balancer."],
      ["A steadier link to a data center", "Direct Connect, from Day 12, bypasses the internet for a more consistent network experience. Site-to-Site VPN runs over the internet, and Accelerated VPN enters the AWS network at the nearest edge location."]
    ],
    trap: "Global Accelerator caches nothing and accepts only ALB, NLB, EC2 instance or Elastic IP endpoints, never an S3 bucket. VPN acceleration needs a transit gateway and cannot be switched on for an existing connection.",
    q: {
      q: "A site rewrites a header and redirects old URLs on every viewer request with Lambda@Edge. The code needs no network access and never reads the request body. Which choice runs this job faster at the edge?",
      o: [
        "CloudFront Functions on the viewer request event",
        "Origin Shield in front of the site's origin",
        "Global Accelerator in front of the CloudFront distribution",
        "A Regional API Gateway endpoint that does the redirects"
      ],
      a: [0],
      x: [
        "Right. CloudFront Functions run sub-millisecond JavaScript on viewer events, made for header changes and redirects. Lambda@Edge's extras, network access and the request body, are not needed here.",
        "Origin Shield is a caching layer that cuts requests to the origin. It runs no code.",
        "Global Accelerator carries traffic to Regional endpoints and caches nothing. It runs no code at the edge either.",
        "A Regional endpoint serves callers in its own Region, so every redirect would travel there instead of being answered at the edge."
      ],
      dom: 3, tags: ["CloudFront"], doc: "cloudfront"
    },
    docs: [
      ["Understand the CloudFront cache key", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/understanding-the-cache-key.html"],
      ["CloudFront Functions vs Lambda@Edge", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html"],
      ["API Gateway endpoint types", "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html"]
    ]
  },

  d10e6: {
    head: "Task 3.5: collect, reshape and deliver data as it arrives",
    why: "Ten thousand sensors send a reading every second, and the database they write to starts throttling. Records are lost, or they land in a form nobody can query cheaply. You need an intake that keeps up with the data, reshapes it and delivers it where it can be queried.",
    idea: "Task statement 3.5 asks you to pick the services that collect a stream, transform it and deliver it into a data lake: Kinesis, Firehose, MSK, EMR, Glue and Athena, each for its own need.",
    k: [
      ["Kinesis shard limits", "A shard takes 1 MB/s or 1,000 records/s in and gives 2 MB/s out, shared by all consumers. Throttled producers need more shards or on-demand mode. Lagging consumers need enhanced fan-out: 2 MB/s per shard for each consumer."],
      ["Firehose needs no consumer code", "Amazon Data Firehose buffers records and can call Lambda to transform them. It converts JSON to Parquet or ORC using a Glue table schema. With dynamic partitioning it builds S3 prefixes from keys in the data."],
      ["Keep existing Kafka or Spark", "Existing Kafka clients point to Amazon MSK, which runs open-source Apache Kafka, so applications need no code changes. Existing Spark, Hive or HBase jobs that need cluster control go to EMR. Its task nodes hold no HDFS data, so Spot fits there."],
      ["The data lake pattern", "Glue crawlers create and update Data Catalog tables. Athena and Redshift Spectrum query files in S3 without loading them. Lake Formation grants column, row and cell-level access in one place."],
      ["Files from partners", "Transfer Family is a managed SFTP, FTPS or FTP endpoint for S3 or EFS, so partners keep their clients. DataSync moves data into AWS storage and validates it."]
    ],
    trap: "Firehose only delivers to destinations. Replay, or several independent consumers reading the same records, needs Kinesis Data Streams or MSK. Kinesis keeps records 24 hours by default, so replaying days of data means raising retention.",
    q: {
      q: "Producers writing to a Kinesis data stream with four provisioned shards are being throttled. Together they send about 6 MB of records per second. What fixes the throttling?",
      o: [
        "Add shards, or switch the stream to on-demand mode",
        "Turn on enhanced fan-out for the stream's consumers",
        "Raise the stream's retention period to seven days",
        "Put Amazon Data Firehose in front of the stream"
      ],
      a: [0],
      x: [
        "Right. Each shard takes 1 MB/s in, so four shards accept about 4 MB/s. Throttled producers need more shards or on-demand mode.",
        "Enhanced fan-out gives each consumer its own 2 MB/s per shard on the way out. It does nothing for producers on the way in.",
        "Retention decides how long records are kept, not how fast they can be written.",
        "Firehose delivers records to destinations. Writing through it adds no shard capacity to this stream."
      ],
      dom: 3, tags: ["Streaming"], doc: "kinesis"
    },
    docs: [
      ["Kinesis Data Streams quotas and limits", "https://docs.aws.amazon.com/streams/latest/dev/service-sizes-and-limits.html"],
      ["Firehose: convert input data format", "https://docs.aws.amazon.com/firehose/latest/dev/record-format-conversion.html"],
      ["What is AWS Lake Formation?", "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html"]
    ]
  },

  d10e7: {
    head: "Practise Domain 3 on exam-style questions",
    why: "You miss a performance question by choosing more provisioned IOPS, and the stem never said the disk was slow: it said the same query ran thousands of times. You fixed a limit the question never mentioned. You need the habit of finding the bottleneck before you look at the options.",
    idea: "Domain 3 Practice gives you exam-style questions on its five task statements. Writing down what each miss was really limited by shows the pattern in your mistakes.",
    do: [
      "Skill Builder → <b>Domain 3 Practice</b> → the exam-style questions. It needs the subscription.",
      "For each miss, write the bottleneck the stem described and the word that ruled out your choice, such as 'sequential', 'unpredictable', 'same Region' or 'no code changes'.",
      "Log every miss under its task statement, 3.1 to 3.5.",
      "Enter your score in % in the Scores field below."
    ],
    k: [
      ["Where the misses cluster", "The task statement with the most misses is the one to revisit in the final pass on Day 21."]
    ],
    q: {
      q: "A practice stem describes a log-processing job that reads large files from start to end. You chose io2 Block Express and missed. Which note is worth writing?",
      o: [
        "Large sequential reads point to st1 throughput-optimized HDD, not to IOPS-heavy io2",
        "io2 Block Express is wrong for log files of any kind",
        "Log processing always belongs on instance store",
        "Any EBS question is decided by the lowest price per GiB"
      ],
      a: [0],
      x: [
        "Right. The deciding words were 'large' and 'from start to end'. st1 is for large sequential work such as log processing, while io2 is for sustained high IOPS.",
        "The note must name the word that decided it. io2 could be right for logs if the stem asked for high IOPS at sub-millisecond latency.",
        "Instance store is fastest but loses its data on stop, hibernate or terminate. Nothing in the stem pointed there.",
        "Price is not what the stem asked about here. The access pattern decided."
      ],
      dom: 3, tags: ["EBS & instance store"], doc: "ebs"
    }
  },

  d10e8: {
    head: "Recall Domain 3 services from a description of the workload",
    why: "The exam never shows you a card to recognise. It describes a workload, \"many Linux clients across AZs share the same files\", and you must come up with the service yourself. A fact you can only recognise turns into a guess there.",
    idea: "The Domain 3 flashcards practise that recall. A pile of missed cards, repeated until it is empty, targets exactly the facts that are not there yet.",
    do: [
      "Skill Builder → <b>Domain 3 Practice</b> → the flashcards.",
      "Say each answer aloud before you flip the card.",
      "Keep a pile of the cards you miss and repeat only that pile until it is empty. Cards you got right at once can wait for the full-deck pass before the exam."
    ],
    k: [
      ["Why only the missed pile", "Repeating cards you already know feels productive and adds nothing. The missed pile holds every fact that would cost points."]
    ],
    q: {
      q: "A flashcard reads: \"Many Linux clients in several AZs share the same files, and the throughput must follow spiky load.\" What do you say before you flip it?",
      o: [
        "Amazon EFS with Elastic throughput",
        "An io2 volume with Multi-Attach",
        "Instance store volumes on each client",
        "S3 Express One Zone"
      ],
      a: [0],
      x: [
        "Right. EFS is the elastic shared file system for many Linux clients across AZs, and Elastic throughput fits spiky load.",
        "io2 Multi-Attach works only inside one AZ, and the clients are in several.",
        "Instance store is local to one instance and loses its data on stop. It shares nothing.",
        "S3 Express One Zone is object storage in a single AZ, not a file system shared across AZs."
      ],
      dom: 3, tags: ["EFS"], doc: "efs"
    }
  },

  d10e9: {
    head: "Domain 3 in a guided lab: tie each setting to the bottleneck it removes",
    why: "In a guided lab it is easy to follow the clicks and learn nothing the exam asks for. The exam gives a symptom, \"slow for users far away\", and asks for the setting. Each lab step needs the problem it solves attached to it, or the hour teaches only a click path.",
    idea: "This AWS SimuLearn lab practises Domain 3. You gather a customer's requirements in a conversation, then build the solution in a live AWS environment.",
    do: [
      "Skill Builder → <b>Domain 3 Practice: AWS SimuLearn</b>. About an hour, and it needs the subscription.",
      "It runs in a temporary sandbox, not in ③ your account, so nothing of yours is left to clean up afterwards.",
      "During the conversation, write down what is slow, for whom, and how the customer notices it.",
      "After each build step, say which bottleneck or requirement that setting addresses."
    ],
    k: [
      ["Symptoms to listen for", "\"Slow for users far away\" points to the edge. \"The same query again and again\" points to a cache. \"Too many connections\" points to RDS Proxy. Each is a bottleneck from the Domain 3 reviews."]
    ],
    q: {
      q: "In the lab's conversation the customer says: \"Our product pages are slow for visitors on other continents, and most of each page never changes.\" Which setting addresses that?",
      o: [
        "CloudFront in front of the site, caching the unchanging content near the visitors",
        "Global Accelerator in front of the site, caching the pages at the edge",
        "A larger instance type for the web servers",
        "Two more read replicas for the product database"
      ],
      a: [0],
      x: [
        "Right. The bottleneck is distance, and the content is cacheable. CloudFront answers it from edge locations near the visitors.",
        "Global Accelerator caches nothing. It speeds up the path to a Region but every request still reaches the servers.",
        "A bigger server does not shorten the trip across continents.",
        "Replicas add database read capacity. The stem names distance, not the database."
      ],
      dom: 3, tags: ["CloudFront"], doc: "cloudfront"
    },
    docs: [["Immersive learning (AWS Cloud Quest and AWS SimuLearn)", "https://aws.amazon.com/training/digital/immersive-learning/"]]
  },

  d10c1: {
    head: "CloudFront or Global Accelerator",
    why: "Players on three continents connect over UDP to game servers in one Region, and the long route makes the game lag. A news site has the same distance problem with its pages. Both need the AWS edge network: one needs a cache near the reader, the other a faster path for traffic that cannot be cached.",
    idea: "CloudFront answers cacheable HTTP content from edge locations near the user. Global Accelerator gives two static anycast IP addresses and carries TCP or UDP traffic over the AWS network to the closest healthy Regional endpoint.",
    trap: "Both use the AWS edge network, so the stem decides. Cacheable HTTP content means CloudFront. Static IP addresses, UDP or other non-HTTP traffic, or instant rerouting between Regions mean Global Accelerator, which caches nothing.",
    q: {
      q: "A voice-call service runs over UDP in two Regions. Customers' firewalls may allow only a short, fixed list of IP addresses, and calls must move to the other Region at once if one fails. Which service fits?",
      o: [
        "AWS Global Accelerator with an endpoint group in each Region",
        "Amazon CloudFront with an origin group spanning both Regions",
        "Route 53 latency records that point to each Region",
        "A CloudFront distribution with a long cache TTL"
      ],
      a: [0],
      x: [
        "Right. Global Accelerator gives two static anycast IPs, carries UDP, and follows endpoint health without waiting for DNS caches.",
        "CloudFront caches HTTP(S) content at the edge. It does not carry UDP calls.",
        "DNS answers are cached by clients, so a switch to the other Region waits until those answers expire.",
        "Live calls cannot be cached, so a cache setting changes nothing here."
      ],
      dom: 3, tags: ["Global Accelerator"], doc: "ga"
    },
    docs: [
      ["What is AWS Global Accelerator?", "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html"],
      ["What is Amazon CloudFront?", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html"]
    ]
  },

  d10c2: {
    head: "RDS Proxy, read replicas or ElastiCache",
    why: "On launch day the database falls over three times. First thousands of Lambda functions each open a connection. Then reporting queries swamp the writer. Then every page asks for the same top-ten list. One slow database, three different causes, and the exam offers all three fixes for each.",
    idea: "Each tool removes one cause. RDS Proxy pools connections, read replicas take read queries off the writer, and ElastiCache answers repeated queries from memory.",
    trap: "A Multi-AZ standby serves no reads, so it never answers read load. And RDS Proxy adds no read capacity: a writer busy with varied reads still needs replicas.",
    q: {
      q: "Thousands of times a minute, a product page asks the database for the same \"top 10 sellers\" list, and the answer must come back in under a millisecond. Which fix fits best?",
      o: [
        "ElastiCache in front of the database, with a TTL on the cached list",
        "RDS Proxy between the application and the database",
        "Two read replicas that serve the list instead of the writer",
        "A Multi-AZ standby that takes the read load"
      ],
      a: [0],
      x: [
        "Right. The same hot data read again and again is a cache's job, and an in-memory cache answers far below a millisecond.",
        "RDS Proxy pools connections. It neither caches the list nor speeds up the query.",
        "Replicas take reads off the writer, but each one still runs the query against a database, not from memory.",
        "A Multi-AZ standby serves no reads."
      ],
      dom: 3, tags: ["Caching"], doc: "elasticache"
    },
    docs: [
      ["Amazon RDS Proxy", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html"],
      ["ElastiCache caching strategies", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"]
    ]
  },

  d10c3: {
    head: "Athena, Glue, EMR, Redshift and the Kinesis family",
    why: "A year of order logs sits in S3 as files. Finance wants one quick question answered today, the data engineers want to reshape the files every night, and the BI team wants dashboards over joined tables. Each need has its own service, and their jobs overlap enough to confuse.",
    idea: "Athena runs SQL on S3 with no servers. Glue prepares data and keeps the shared Data Catalog. EMR runs Spark or Hadoop with control over the framework. Redshift is the warehouse for repeated BI. The Kinesis family takes data that arrives as a stream.",
    trap: "The wording decides between the overlapping services. Joining warehouse tables with S3 history is Redshift Spectrum. Discovering the schema of new files is a Glue crawler. Existing Spark or Hadoop jobs are EMR.",
    q: {
      q: "Every night new CSV files land in S3, and now and then their columns change. Analysts must query them with SQL the next morning, and nobody should define the tables by hand or run servers. Which pair fits?",
      o: [
        "A Glue crawler that updates the Data Catalog, with Athena for the queries",
        "A long-running EMR cluster that loads the files into Hive tables",
        "A Redshift cluster that copies the files in each night",
        "Kinesis Data Streams feeding the files to a query application"
      ],
      a: [0],
      x: [
        "Right. A crawler discovers the schema and updates the catalog tables, and Athena runs serverless SQL on the files in S3.",
        "EMR gives control over the framework, but a cluster is servers to run, and the stem wants none.",
        "A Redshift cluster is servers to run, which the stem rules out, and a warehouse is for repeated BI over joined tables, which nobody asked for.",
        "Kinesis takes data that arrives as a stream. These are files that land once a night."
      ],
      dom: 3, tags: ["Analytics"], doc: "athena"
    },
    docs: [
      ["What is Amazon Athena?", "https://docs.aws.amazon.com/athena/latest/ug/what-is.html"],
      ["What is Amazon Data Firehose?", "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"]
    ]
  }
});
