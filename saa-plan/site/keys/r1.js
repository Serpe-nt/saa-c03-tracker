// Key points per plan step for the reading block "services the courses skip" (r1a–r1d). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  r1a: {
    head: "Ready-made AI services, one job each",
    why: "A call center wants to know which recorded calls had angry customers. Building and training its own model would take data scientists, labeled data and months. Many jobs with speech, text and pictures are common enough that nobody should have to build a model for them.",
    idea: "AWS offers ready-made machine learning services that each do one such job through an API. The exam names a job, and you pick the service made for it. Amazon SageMaker AI is for when you need a model of your own.",
    k: [
      ["Text", "Meaning out of text: Amazon Comprehend uses natural language processing to recognize entities, key phrases, language and sentiment in documents. The same text in another language: Amazon Translate, a text translation service."],
      ["Speech", "Amazon Transcribe converts audio to text. Amazon Polly converts text into lifelike speech. Amazon Lex builds conversational interfaces (chatbots) that use voice and text. The current Lex guide is for Amazon Lex V2."],
      ["Documents and pictures", "Amazon Textract detects typed and handwritten text and extracts forms and tables from documents. Amazon Rekognition analyzes images and videos: objects, text, unsafe content, face comparison."],
      ["SageMaker AI for your own model", "When the need is a custom model, not a ready-made API. It is the fully managed service to build, train and deploy your own ML models. The exam guide uses this name for what used to be Amazon SageMaker."],
      ["Which features are closing", "The eight services are open. AWS lists some of their features in maintenance, closed to new customers: Rekognition streaming events, Comprehend topic modeling and event detection, and several SageMaker AI features."]
    ],
    trap: "The pairs that get swapped: Transcribe (speech to text) and Polly (text to speech). Also Textract (text out of a document), Rekognition (what a picture shows) and Comprehend (what a text says). Sentiment of recorded calls: Transcribe first, then Comprehend on the text.",
    q: {
      q: "An insurer receives thousands of scanned claim forms, some filled in by hand. The filled-in fields and tables must end up in a database, with no model to build. Which service reads them?",
      o: [
        "Amazon Textract",
        "Amazon Rekognition",
        "Amazon Comprehend",
        "Amazon SageMaker AI"
      ],
      a: [0],
      x: [
        "Right. Textract detects typed and handwritten text and extracts forms and tables from documents.",
        "Rekognition tells you what a picture shows, such as objects or faces. Pulling the fields of a form is Textract's job.",
        "Comprehend finds meaning in text that you already have. Getting the text and fields out of the scans comes first.",
        "SageMaker AI is for building your own model, which the insurer wants to avoid."
      ],
      dom: 3, tags: ["AI/ML services"], doc: "textract"
    },
    docs: [
      ["Machine learning (Overview of Amazon Web Services)", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/machine-learning.html"],
      ["What is Amazon SageMaker AI?", "https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html"],
      ["Services in Maintenance (AWS General Reference)", "https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html"]
    ]
  },

  r1b: {
    head: "Running many resources: the management services, one job each",
    why: "A company runs hundreds of resources across dozens of accounts. Each team builds its networks by hand and a little differently, nobody knows which servers miss patches, and an idle database runs for months unnoticed. Resources must be created the same way every time, servers kept in order, and waste or trouble noticed.",
    idea: "AWS has a management service for each of these jobs. The exam describes the job, and several of the names sound alike.",
    k: [
      ["Creating resources the same way", "CloudFormation creates the resources described in a template as a stack. StackSets creates stacks across multiple accounts and Regions in a single operation. Service Catalog manages catalogs of IT services approved for use on AWS."],
      ["Keeping servers in order", "Systems Manager centrally views, manages and operates nodes in AWS, on premises and in other clouds, once SSM Agent runs on them. License Manager manages software licenses from vendors such as Microsoft, SAP, Oracle and IBM."],
      ["Advice on waste and risk", "Trusted Advisor inspects your environment and makes recommendations by category, such as security, fault tolerance and service limits. Compute Optimizer analyzes utilization metrics and gives rightsizing recommendations for single resources."],
      ["AWS Health Dashboard", "The service health page shows public events for all AWS services and needs no sign-in. AWS Health itself tells you how events and planned activities affect your own resources, and delivers them through EventBridge."],
      ["Managed Prometheus and Grafana", "Open-source monitoring as a service. Amazon Managed Service for Prometheus is a serverless, Prometheus-compatible service for container metrics. Amazon Managed Grafana queries and visualizes metrics, logs and traces from many sources."]
    ],
    trap: "Trusted Advisor's full set of checks needs Business Support+, Enterprise Support or Unified Operations. Basic Support gets the service limits checks and selected security and fault tolerance checks. A size for one specific instance is Compute Optimizer.",
    q: {
      q: "A company wants the same baseline of network and logging resources in 40 accounts and three Regions, created from one template in a single operation. What should it use?",
      o: [
        "CloudFormation StackSets",
        "AWS Service Catalog",
        "AWS Systems Manager",
        "AWS Compute Optimizer"
      ],
      a: [0],
      x: [
        "Right. StackSets creates stacks from a template across multiple accounts and Regions in a single operation.",
        "Service Catalog manages catalogs of approved IT services for people to launch. It does not roll one stack out everywhere at once.",
        "Systems Manager views, manages and operates nodes. It does not create stacks of resources across accounts.",
        "Compute Optimizer gives rightsizing recommendations for single resources. It creates nothing."
      ],
      dom: 2, tags: ["Infrastructure as code"], doc: "cloudformation"
    },
    docs: [
      ["Management and governance (Overview of Amazon Web Services)", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/management-governance.html"],
      ["AWS Trusted Advisor", "https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html"],
      ["What is AWS Compute Optimizer?", "https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html"]
    ]
  },

  r1c: {
    head: "Moving servers, databases and files into AWS",
    why: "A company must leave its data center by the end of the year. It has hundreds of servers, a few databases, a file server full of project folders, and partners who upload invoices over SFTP every night. Each kind of thing is copied in its own way, and the source usually has to keep working until the switch.",
    idea: "AWS has a migration service for each. AWS Transform MGN moves whole servers and AWS DMS databases. DataSync copies files and objects, and Transfer Family handles partners' file exchanges.",
    k: [
      ["Whole servers", "AWS Application Migration Service, which the AWS docs now call AWS Transform MGN. It migrates physical, virtual and cloud servers by continuous block-level replication, with cutover windows of minutes. The exam guide prints the old name."],
      ["Databases", "AWS DMS, for a one-time migration or to replicate ongoing changes so that source and target stay in sync (Day 12). Migrating to a different database engine adds DMS Schema Conversion."],
      ["Files and objects in bulk", "DataSync, an online transfer service. It copies from NFS, SMB, HDFS, object storage and storage services in other clouds to S3, EFS and FSx."],
      ["File exchange with partners", "For partners who exchange files over SFTP, FTPS, FTP or AS2: AWS Transfer Family. It gives fully managed transfers directly into and out of S3 or EFS, with the existing client-side configuration maintained."],
      ["What is closed", "From the AWS lifecycle lists: Snowball Edge, the Snow Family device, is closed to new customers. Application Discovery Service and Migration Hub are in maintenance, which means the same. The four services of this step are open."]
    ],
    trap: "MGN and Elastic Disaster Recovery both replicate servers. The goal tells them apart. Moving the servers for good is migration, a standby to recover into is disaster recovery. SFTP in the stem means Transfer Family, not DataSync.",
    q: {
      q: "A company will close its data center and move its physical and virtual servers to AWS as they are. They must keep running until a cutover of a few minutes. Which service fits?",
      o: [
        "AWS Transform MGN (Application Migration Service)",
        "AWS Database Migration Service (AWS DMS)",
        "AWS DataSync (online data transfer)",
        "AWS Transfer Family (SFTP, FTPS, FTP)"
      ],
      a: [0],
      x: [
        "Right. It migrates physical, virtual and cloud servers by continuous block-level replication, with cutover windows of minutes.",
        "DMS moves databases. Whole servers with their operating systems and applications are MGN's job.",
        "DataSync copies files and objects, not whole running servers.",
        "Transfer Family is for partners who exchange files over SFTP, FTPS, FTP or AS2."
      ],
      dom: 2, tags: ["Migration & transfer"], doc: "mgn"
    },
    docs: [
      ["Migration and transfer (Overview of Amazon Web Services)", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/migration-services.html"],
      ["What is AWS Transform MGN?", "https://docs.aws.amazon.com/mgn/latest/ug/what-is-mgn.html"],
      ["Services in Maintenance (AWS General Reference)", "https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html"]
    ]
  },

  r1d: {
    head: "Managed services for what your application already speaks",
    why: "A company's app is written for MongoDB, its analytics team runs Kafka, and its fraud checks follow chains of links between accounts. Rewriting each for a different database would take a year. Applications need to keep what they already speak, or a database built for the shape of their data, without anyone running servers for it.",
    idea: "AWS offers managed services compatible with those systems, such as DocumentDB, Keyspaces and MSK. Others are built for one shape of data, such as Neptune for graphs and OpenSearch Service for search.",
    k: [
      ["Match what the app already speaks", "MongoDB drivers and tools: Amazon DocumentDB. Apache Cassandra: Amazon Keyspaces, which is serverless. Apache Kafka: Amazon MSK (Managed Streaming for Apache Kafka)."],
      ["Neptune for connected data", "For data that is queried by its relationships. It is a managed graph database with the query languages Gremlin, openCypher and SPARQL. AWS names recommendation engines among its use cases."],
      ["Amazon MemoryDB", "A durable in-memory database compatible with Valkey and Redis OSS. It gives microsecond reads and stores data durably across Availability Zones in a transaction log. The MemoryDB FAQ now recommends ElastiCache for new workloads."],
      ["OpenSearch Service for search and logs", "It runs managed OpenSearch clusters, a search and analytics engine for log analytics, real-time application monitoring and clickstream analysis. It is also the usual answer for full-text search over application data."],
      ["AWS Data Exchange", "Where you find, subscribe to and use third-party data in the cloud. It is not a pipeline of your own data. What you query that data with afterwards is one of the analytics services."]
    ],
    trap: "The compatibility word decides. MongoDB is DocumentDB, not DynamoDB. Cassandra is Keyspaces. Kafka is MSK, not Kinesis Data Streams. The exam guide's list of in-scope databases names DocumentDB, Keyspaces and Neptune, but not MemoryDB.",
    q: {
      q: "An application is built on Apache Cassandra's query language and drivers. The team wants to move it to AWS without changing the code, and without servers to manage. Which service fits?",
      o: [
        "Amazon Keyspaces",
        "Amazon DocumentDB",
        "Amazon Neptune",
        "Amazon MSK"
      ],
      a: [0],
      x: [
        "Right. Keyspaces is the AWS service for Apache Cassandra workloads, and it is serverless.",
        "DocumentDB is the answer for MongoDB drivers and tools, not Cassandra.",
        "Neptune is a graph database for data queried by its relationships.",
        "MSK is managed Apache Kafka, a streaming service rather than a database."
      ],
      dom: 3, tags: ["Purpose-built databases"], doc: "keyspaces"
    },
    docs: [
      ["Database (Overview of Amazon Web Services)", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/database.html"],
      ["Analytics (Overview of Amazon Web Services)", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html"],
      ["Amazon MemoryDB FAQs", "https://aws.amazon.com/memorydb/faqs/"]
    ]
  }
});
