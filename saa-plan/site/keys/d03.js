// Key points for the plan steps whose id starts with d3 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d3c1: {
    why: "Storage needs differ: a disk for a server, a file system that many Linux servers share, Windows file shares, or a store for objects. Each AWS storage service answers one of these needs, and they are not interchangeable. The stem says who must reach the data and how, and that picks the service.",
    trap: "EBS Multi-Attach is not shared storage across AZs: it needs io1 or io2, a single AZ and a clustered file system. Linux instances in several AZs sharing files means EFS. SMB shares with Active Directory mean FSx for Windows File Server.",
    docs: [
      ["Amazon EBS volume types", "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"],
      ["Attach an EBS volume to multiple EC2 instances using Multi-Attach", "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes-multi.html"],
      ["Help me choose an Amazon FSx file system", "https://aws.amazon.com/fsx/when-to-choose-fsx/"]
    ]
  },
  d3c2: {
    why: "A database can fail, and a database can be too busy with reads. These are two different problems, and RDS has a separate answer for each. Multi-AZ keeps a standby that takes over when the primary fails. A read replica is a copy that serves read queries. The exam checks that you do not use one for the other's job.",
    trap: "The standby of a Multi-AZ DB instance never serves reads, so it cannot take reporting load off the primary. Multi-AZ also stays inside one Region. A disaster recovery copy in another Region is a cross-Region read replica that you promote.",
    docs: [
      ["Multi-AZ DB instance deployments for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html"],
      ["Failing over a Multi-AZ DB instance for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.Failover.html"],
      ["Working with DB instance read replicas", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html"]
    ]
  },
  d3c3: {
    why: "Some data is read all the time, some now and then, and some almost never. S3 has storage classes for each of these access patterns, down to low-cost archive classes for data that is rarely read. The catch is that some archived data must be restored before it can be read. So two clues in the stem decide: how often the data is read, and how fast it must be available.",
    trap: "A need for millisecond access rules out Flexible Retrieval and Deep Archive, which must be restored first. After that the read frequency decides. About monthly fits Standard-IA, about quarterly fits Glacier Instant Retrieval, unknown fits Intelligent-Tiering.",
    docs: [
      ["Understanding and managing Amazon S3 storage classes", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"],
      ["Understanding archive retrieval options", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects-retrieval-options.html"]
    ]
  },
  d3c4: {
    why: "When the same data is read again and again, the database does the same work each time and becomes the bottleneck. A cache in memory answers the repeated reads instead. Which cache depends on the database behind it: DAX belongs to DynamoDB, and ElastiCache is the cache you put next to a relational database.",
    k: [
      ["ElastiCache engine", "Choose Valkey or Redis OSS over Memcached when you need sorted sets (leaderboards), pub/sub or replication with automatic failover. Memcached is the simplest model: simple data types on multi-threaded nodes, and no replication in a node-based cluster."]
    ],
    trap: "DAX works only in front of DynamoDB, serves eventually consistent reads and is not meant for write-heavy workloads. It does nothing for an RDS database. Repeated SQL results are cached in ElastiCache, which needs caching code in the application.",
    docs: [
      ["In-memory acceleration with DynamoDB Accelerator (DAX)", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html"],
      ["Caching strategies for Memcached (Amazon ElastiCache)", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"],
      ["Comparing node-based Valkey, Memcached, and Redis OSS clusters", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/SelectEngine.html"]
    ]
  }
});
