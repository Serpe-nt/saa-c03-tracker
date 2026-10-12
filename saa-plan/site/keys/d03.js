// Key points per plan step for Day 3. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d3c1: {
    trap: "EBS Multi-Attach is not shared storage across AZs: it needs io1 or io2, a single AZ and a clustered file system. Linux instances in several AZs sharing files means EFS; SMB shares with Active Directory mean FSx for Windows File Server.",
    docs: [
      ["Amazon EBS volume types", "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"],
      ["Attach an EBS volume to multiple EC2 instances using Multi-Attach", "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes-multi.html"],
      ["Help me choose an Amazon FSx file system", "https://aws.amazon.com/fsx/when-to-choose-fsx/"]
    ]
  },
  d3c2: {
    trap: "The standby of a Multi-AZ DB instance never serves reads, so it cannot take reporting load off the primary. Multi-AZ also stays inside one Region: a disaster recovery copy in another Region is a cross-Region read replica that you promote.",
    docs: [
      ["Multi-AZ DB instance deployments for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html"],
      ["Failing over a Multi-AZ DB instance for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.Failover.html"],
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
    k: [
      "Choose Valkey or Redis OSS over Memcached when you need sorted sets (leaderboards), pub/sub or replication with automatic failover. Memcached is the simplest model: simple data types on multi-threaded nodes, and no replication in a node-based cluster."
    ],
    trap: "DAX works only in front of DynamoDB, serves eventually consistent reads and is not meant for write-heavy workloads. It does nothing for an RDS database: repeated SQL results are cached in ElastiCache, which needs caching code in the application.",
    docs: [
      ["In-memory acceleration with DynamoDB Accelerator (DAX)", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html"],
      ["Caching strategies for Memcached (Amazon ElastiCache)", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"],
      ["Comparing node-based Valkey, Memcached, and Redis OSS clusters", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/SelectEngine.html"]
    ]
  }
});
