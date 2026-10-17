// Key points for the plan steps whose id starts with d3 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d3c1: {
    head: "Disk, shared files or objects: EBS, EFS, FSx or S3",
    why: "A team puts shared reports on an EBS volume and tries to mount it on servers in three zones. It can't, and the Windows users wanted an SMB share anyway. Each storage service answers one way of reaching data, and they are not interchangeable.",
    idea: "As on Day 2, with more detail: EBS is one instance's disk. EFS is a file system that many Linux instances share across zones. FSx is a managed file system of a named kind, such as Windows File Server. S3 stores objects that you fetch through an API.",
    trap: "EBS Multi-Attach is not shared storage across AZs: it needs io1 or io2, a single AZ and a clustered file system. Linux instances in several AZs sharing files means EFS. SMB shares with Active Directory mean FSx for Windows File Server.",
    q: {
      q: "Linux web servers in three Availability Zones must read and write the same folder of uploaded images. A colleague proposes one io2 volume with EBS Multi-Attach. What fits instead?",
      o: [
        "An Amazon EFS file system mounted on all the servers",
        "The io2 volume with Multi-Attach, attached to every server",
        "An EBS gp3 volume per zone, copied to each other every hour",
        "Amazon FSx for Windows File Server"
      ],
      a: [0],
      x: [
        "Right. EFS is shared by many Linux instances across Availability Zones at once.",
        "Multi-Attach works only inside one Availability Zone, and it needs a clustered file system.",
        "Copies on separate disks drift apart between runs, and every server sees a different folder.",
        "FSx for Windows File Server serves SMB shares for Windows. Linux servers sharing files point to EFS."
      ],
      dom: 3, tags: ["EFS", "EBS & instance store"], doc: "efs"
    },
    docs: [
      ["Amazon EBS volume types", "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"],
      ["Attach an EBS volume to multiple EC2 instances using Multi-Attach", "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes-multi.html"],
      ["Help me choose an Amazon FSx file system", "https://aws.amazon.com/fsx/when-to-choose-fsx/"]
    ]
  },
  d3c2: {
    head: "RDS Multi-AZ or a read replica",
    why: "Every morning the sales reports slow the shop's database to a crawl. Someone turns on Multi-AZ to spread the load, and nothing gets faster. A database can fail, and it can be too busy with reads: two problems, and RDS has a separate answer for each.",
    idea: "Multi-AZ keeps a standby in another Availability Zone that takes over when the primary fails. A read replica is a copy that serves read queries, taking them off the primary.",
    trap: "The standby of a Multi-AZ DB instance never serves reads, so it cannot take reporting load off the primary. Multi-AZ also stays inside one Region. A disaster recovery copy in another Region is a cross-Region read replica that you promote.",
    q: {
      q: "An insurer's RDS database runs as a Multi-AZ DB instance in Europe (Ireland). The board now asks that the database can be brought up in another Region if Ireland as a whole goes down. What does that take?",
      o: [
        "A cross-Region read replica that can be promoted in the other Region",
        "Nothing more, because the Multi-AZ standby already sits in another Region",
        "A second Multi-AZ standby, placed in the other Region",
        "A read replica in another Availability Zone of Europe (Ireland)"
      ],
      a: [0],
      x: [
        "Right. Multi-AZ stays inside one Region. A read replica can live in another Region and be promoted to a standalone database there.",
        "The Multi-AZ standby is in another Availability Zone of the same Region, so a Regional outage takes both.",
        "A Multi-AZ standby is always in the same Region as its primary.",
        "Another zone of the same Region fails with the Region. The copy must be in another Region."
      ],
      dom: 2, tags: ["RDS", "Disaster recovery"], doc: "rds"
    },
    docs: [
      ["Multi-AZ DB instance deployments for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html"],
      ["Failing over a Multi-AZ DB instance for Amazon RDS", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.Failover.html"],
      ["Working with DB instance read replicas", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html"]
    ]
  },
  d3c3: {
    head: "Which S3 storage class: how often, and how fast",
    why: "A firm keeps ten years of scanned contracts in S3 Standard and pays full price for files read twice a year. Moving them all to the cheapest archive would leave its lawyers waiting hours on the day they need one. Each object needs the class that matches how often it is read and how fast it must come back.",
    idea: "S3's storage classes trade a lower storage price for a retrieval fee, a minimum storage time or a wait. The archive classes Glacier Flexible Retrieval and Deep Archive must restore an object before it can be read.",
    trap: "A need for millisecond access rules out Flexible Retrieval and Deep Archive, which must be restored first. After that the read frequency decides. About monthly fits Standard-IA, about quarterly fits Glacier Instant Retrieval, unknown fits Intelligent-Tiering.",
    q: {
      q: "A new photo app stores what its users upload. Nobody can say yet how often each photo will be viewed: some daily, many never again. The team wants no retrieval fees. Which storage class fits?",
      o: [
        "S3 Intelligent-Tiering",
        "S3 Standard-IA",
        "S3 Glacier Instant Retrieval",
        "S3 Glacier Deep Archive"
      ],
      a: [0],
      x: [
        "Right. Intelligent-Tiering is for unknown or changing access: it moves objects between tiers by itself, for a small monitoring fee and no retrieval fees.",
        "Standard-IA charges a retrieval fee per GB, and it suits data you know is read about monthly.",
        "Glacier Instant Retrieval suits data read about once a quarter, and it charges for retrieval.",
        "Deep Archive must restore an object before it can be read, which takes hours."
      ],
      dom: 4, tags: ["S3 storage classes & lifecycle"], doc: "s3-classes"
    },
    docs: [
      ["Understanding and managing Amazon S3 storage classes", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"],
      ["Understanding archive retrieval options", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects-retrieval-options.html"]
    ]
  },
  d3c4: {
    head: "A cache in front of the database: DAX or ElastiCache",
    why: "A product page reads the same catalog rows thousands of times a minute. The database spends its day answering the same question, and becomes the bottleneck. Repeated reads need a cache in memory, and which cache fits depends on the database behind it.",
    idea: "DynamoDB Accelerator (DAX) is a cache made only for DynamoDB. Amazon ElastiCache is the general in-memory cache that you put next to a relational database, with caching code in the application.",
    k: [
      ["Which ElastiCache engine", "Choose Valkey or Redis OSS over Memcached for sorted sets (leaderboards), pub/sub or replication with automatic failover. Memcached is the simplest: simple data types on multi-threaded nodes, and no replication in a node-based cluster."]
    ],
    trap: "DAX works only in front of DynamoDB, serves eventually consistent reads and is not meant for write-heavy workloads. It does nothing for an RDS database. Repeated SQL results are cached in ElastiCache, which needs caching code in the application.",
    q: {
      q: "A game stores players in Amazon RDS for PostgreSQL and wants a live top-100 leaderboard served from memory, with automatic failover. Which cache fits?",
      o: [
        "Amazon ElastiCache with Valkey or Redis OSS, using a sorted set",
        "DynamoDB Accelerator (DAX) in front of the RDS database",
        "Amazon ElastiCache for Memcached in a node-based cluster",
        "A read replica of the RDS database"
      ],
      a: [0],
      x: [
        "Right. Sorted sets make a leaderboard, and Valkey or Redis OSS add replication with automatic failover.",
        "DAX works only in front of DynamoDB. It does nothing for an RDS database.",
        "Memcached has simple data types only, and no replication in a node-based cluster.",
        "A read replica is a copy of the database on disk. It is not an in-memory cache, and it has no sorted sets."
      ],
      dom: 3, tags: ["Caching"], doc: "elasticache"
    },
    docs: [
      ["In-memory acceleration with DynamoDB Accelerator (DAX)", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html"],
      ["Caching strategies for Memcached (Amazon ElastiCache)", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"],
      ["Comparing node-based Valkey, Memcached, and Redis OSS clusters", "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/SelectEngine.html"]
    ]
  }
});
