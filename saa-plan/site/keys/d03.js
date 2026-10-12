// Key points per plan step for Day 3. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d3w1: {
    k: [
      "Pick the S3 class from read frequency and the wait you can accept: Standard-IA for about monthly reads and Glacier Instant Retrieval for about quarterly reads (both in milliseconds), Flexible Retrieval for minutes to hours, Deep Archive for 12 to 48 hours.",
      "Versioning turns an overwrite into a new version and a delete into a delete marker, so earlier versions can be restored. Replication needs versioning on both buckets and copies new objects asynchronously to another Region (CRR) or within the Region (SRR).",
      "Block Public Access at account level overrides any bucket policy or ACL that would grant public access, on current and future buckets. A single PUT stops at 5 GB; multipart upload sends bigger objects as parts that upload in parallel and retry on their own.",
      "An EBS volume lives in one Availability Zone and attaches only to instances there. To move it, take a snapshot and create a new volume from it in the other AZ. Instance store data survives a reboot but is lost on stop, hibernate or terminate.",
      "Storage Gateway by protocol: S3 File Gateway gives NFS or SMB shares stored as S3 objects, Volume Gateway gives iSCSI volumes (cached keeps primary data in S3, stored keeps it on site), Tape Gateway gives backup software a virtual tape library."
    ],
    trap: "Lifecycle rules only transition or expire objects inside one bucket. An option where a lifecycle rule copies data to another Region or account is wrong; that job is replication. One Zone-IA is wrong whenever the data must survive the loss of an AZ.",
    docs: [
      ["Understanding and managing Amazon S3 storage classes", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"],
      ["Replicating objects within and across Regions", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html"],
      ["AWS Storage Gateway FAQs", "https://aws.amazon.com/storagegateway/faqs/"]
    ]
  },
  d3w2: {
    k: [
      "RDS runs Db2, MariaDB, SQL Server, MySQL, Oracle and PostgreSQL while AWS handles backups, patching and failure recovery. Aurora is MySQL- or PostgreSQL-compatible, so a SQL Server or Oracle database that must keep its engine goes to RDS.",
      "An Aurora cluster volume keeps copies of the data across three AZs and grows automatically. Up to 15 Aurora Replicas read the same volume and act as failover targets. Send writes to the cluster endpoint and reads to the reader endpoint.",
      "Automated RDS backups are kept for up to 35 days and allow a restore to any point in that window, always as a new DB instance. Manual snapshots stay until you delete them. Encryption at rest is chosen at creation; later you restore an encrypted snapshot copy.",
      "A DynamoDB item is limited to 400 KB, so large files go to S3 and the item stores only the object key. Choose on-demand capacity for unpredictable traffic and provisioned capacity for steady load you can forecast.",
      "Match the workload to a purpose-built service: Redshift is the data warehouse for SQL analytics over large history, ElastiCache is the in-memory cache and session store, Neptune handles graph relationships, DocumentDB runs MongoDB-compatible workloads."
    ],
    trap: "The deciding words are in the stem. Reporting that slows the primary means a read replica, analytics over years of data from several systems means Redshift, and microseconds on DynamoDB means DAX, which does nothing for an RDS database.",
    docs: [
      ["Amazon Aurora storage", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.StorageReliability.html"],
      ["Introduction to backups (Amazon RDS)", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html"],
      ["DynamoDB throughput capacity", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html"]
    ]
  },
  d3p1: {
    k: [
      "Multi-AZ keeps a synchronous standby in another AZ. On a failure RDS repoints the DNS record of the instance to the standby, typically within one to two minutes, so the endpoint the application uses stays the same. The standby serves no reads.",
      "A read replica is a separate read-only DB instance that is updated asynchronously. It helps only if the application connects to it for reads, and it can be promoted to a standalone database. The source must have automated backups turned on.",
      "A point-in-time restore never rewinds the running database. It creates a new DB instance from a backup plus transaction logs, and the application then has to be pointed at that new instance."
    ],
    trap: "An accidental <code>DELETE</code> is replicated to the Multi-AZ standby and to every read replica, so failing over or promoting a replica brings nothing back. Lost rows are recovered with a point-in-time restore.",
    docs: [
      ["Multi-AZ DB instance deployments for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html"],
      ["Working with DB instance read replicas", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html"],
      ["Restoring a DB instance to a specified time", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html"]
    ]
  },
  d3p2: {
    k: [
      "A table defines only its primary key: a partition key, optionally combined with a sort key. All other attributes are schemaless and can differ from item to item.",
      "DynamoDB hashes the partition key to choose a partition, and items that share a partition key are stored together in sort key order. A key with many distinct values spreads the load; one hot value such as today's date piles the writes onto one partition.",
      "A global secondary index has its own partition and sort key and can be added to an existing table. A local secondary index keeps the table's partition key with a different sort key and must be created together with the table.",
      "Time to Live deletes items after the epoch timestamp stored in a chosen attribute, typically within a few days and without consuming write throughput. That replaces any scheduled cleanup job."
    ],
    trap: "A local secondary index cannot answer a lookup by a different partition key, and a Scan with a filter still reads the whole table. A new access pattern on a non-key attribute such as email needs a global secondary index.",
    docs: [
      ["Core components of Amazon DynamoDB", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html"],
      ["Improving data access with secondary indexes", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html"],
      ["Using time to live (TTL) in DynamoDB", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html"]
    ]
  },
  d3p3: {
    k: [
      "EFS is an NFS file system that many Linux instances in different AZs mount at the same time, and it grows and shrinks as files are added and removed. It is not supported on Windows instances.",
      "You create one mount target per AZ, and instances mount the file system through the mount target in their own AZ. The mount target's security group must allow inbound NFS (TCP 2049) from the instances; check this rule first when a mount times out.",
      "Lifecycle management moves files that have not been read for a set time (30 days by default) to the cheaper Infrequent Access class and later to Archive. File names and the directory structure stay in place, so applications keep using the same paths."
    ],
    trap: "To cut the cost of rarely read files on EFS, the answer is lifecycle management. Moving them to S3 Glacier or to an EBS volume takes them out of the shared file system, and a One Zone file system gives up multi-AZ resilience for all data.",
    docs: [
      ["How Amazon EFS works", "https://docs.aws.amazon.com/efs/latest/ug/how-it-works.html"],
      ["Using VPC security groups with Amazon EFS", "https://docs.aws.amazon.com/efs/latest/ug/network-access.html"],
      ["Managing storage lifecycle (Amazon EFS)", "https://docs.aws.amazon.com/efs/latest/ug/lifecycle-management-efs.html"]
    ]
  },
  d3b1: {
    k: [
      "With versioning on, an overwrite adds a new version and a delete only adds a delete marker, so earlier versions stay restorable. Every version is billed as a full object, and versioning can later be suspended but never returned to the unversioned state.",
      "Block Public Access overrides bucket policies and ACLs that would make data public. It can be set per bucket, per account and for an organization, and the most restrictive combination applies. Set at account level it also covers buckets created later.",
      "Versioning is a prerequisite for S3 Replication on both the source and the destination bucket. A new bucket also encrypts every object with SSE-S3 by default, so encryption at rest needs no extra step."
    ],
    trap: "Suspending versioning leaves every existing version in place and billed, and it stops protecting future changes. Old versions are cleaned up by a lifecycle rule that expires noncurrent versions.",
    docs: [
      ["Retaining multiple versions of objects with S3 Versioning", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html"],
      ["Blocking public access to your Amazon S3 storage", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"]
    ]
  },
  d3b2: {
    k: [
      "A lifecycle rule has two kinds of action: transitions to another storage class and expirations that delete. Transitions only move down the waterfall (Standard, then the IA classes, then the Glacier classes), never back up.",
      "Minimum storage durations are billed even if data leaves sooner: 30 days in Standard-IA and One Zone-IA, 90 days in Glacier Instant and Flexible Retrieval, 180 days in Deep Archive. By default objects smaller than 128 KB are not transitioned at all.",
      "In a versioned bucket like yours, an expiration action only touches the current version and replaces it with a delete marker. Old versions stay, and are billed, until a noncurrent version action transitions or permanently deletes them.",
      "Once an object is in Glacier Flexible Retrieval it must be restored before it can be read, which takes minutes to hours. Objects in Standard-IA and Glacier Instant Retrieval are still read in milliseconds."
    ],
    docs: [
      ["Managing the lifecycle of objects", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html"],
      ["Transitioning objects using Amazon S3 Lifecycle", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html"],
      ["Lifecycle configuration elements", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html"]
    ]
  },
  d3b3: {
    k: [
      "On-demand mode bills per read and write request and needs no capacity planning, which suits new, spiky or unpredictable traffic. Provisioned mode fits steady load that you can forecast.",
      "A Query needs one partition key value, plus an optional condition on the sort key, and reads only the matching items. A Scan reads every item in the table, so it gets slower and more expensive as the table grows.",
      "A filter expression is applied after the items have been read. A Scan with a filter consumes the same read capacity as a Scan without one; only the result that comes back is smaller."
    ],
    docs: [
      ["Querying tables in DynamoDB", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html"],
      ["Scanning tables in DynamoDB", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html"],
      ["Best practices for querying and scanning data", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-query-scan.html"]
    ]
  },
  d3c1: {
    trap: "EBS Multi-Attach is not shared storage across AZs: it needs io1 or io2, a single AZ and a cluster-aware file system. Linux instances in several AZs sharing files means EFS; SMB shares with Active Directory mean FSx for Windows File Server.",
    docs: [
      ["Amazon EBS volume types", "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"],
      ["Attach an EBS volume to multiple EC2 instances using Multi-Attach", "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes-multi.html"],
      ["Choosing an Amazon FSx file system", "https://aws.amazon.com/fsx/when-to-choose-fsx/"]
    ]
  },
  d3c2: {
    trap: "The standby of a Multi-AZ DB instance never serves reads, so it cannot take reporting load off the primary. Multi-AZ also stays inside one Region: a disaster recovery copy in another Region is a cross-Region read replica that you promote.",
    docs: [
      ["Multi-AZ DB instance deployments for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html"],
      ["Failing over a Multi-AZ DB instance", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.Failover.html"],
      ["Working with DB instance read replicas", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html"]
    ]
  },
  d3c3: {
    trap: "A need for millisecond access rules out Flexible Retrieval and Deep Archive, which must be restored first. After that the read frequency decides: about monthly fits Standard-IA, about quarterly fits Glacier Instant Retrieval, unknown fits Intelligent-Tiering.",
    docs: [
      ["Understanding and managing Amazon S3 storage classes", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"],
      ["Understanding archive retrieval options", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects-retrieval-options.html"]
    ]
  },
  d3c4: {
    trap: "DAX works only in front of DynamoDB, serves eventually consistent reads and is not meant for write-heavy workloads. It does nothing for an RDS database: repeated SQL results are cached in ElastiCache, which needs caching code in the application.",
    docs: [
      ["In-memory acceleration with DynamoDB Accelerator (DAX)", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html"],
      ["Caching strategies for Amazon ElastiCache", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"],
      ["Comparing Valkey, Memcached and Redis OSS clusters", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/SelectEngine.html"]
    ]
  }
});
