// Key points per plan step for the reading block "services the courses skip" (r1a–r1d). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  r1a: {
    k: [
      "Meaning out of text: Amazon Comprehend uses natural language processing to recognize entities, key phrases, language and sentiment in documents. The same text in another language: Amazon Translate, a text translation service.",
      "Speech: Amazon Transcribe converts audio to text, Amazon Polly converts text into lifelike speech, and Amazon Lex builds conversational interfaces (chatbots) that use voice and text. The current Lex guide is for Amazon Lex V2.",
      "Documents and pictures: Amazon Textract detects typed and handwritten text and extracts forms and tables from documents. Amazon Rekognition analyzes images and videos: objects, text, unsafe content, face comparison.",
      "Amazon SageMaker AI (the exam guide's name for what used to be Amazon SageMaker) is the fully managed service to build, train and deploy your own ML models. It fits when the need is a custom model, not a ready-made API.",
      "Status: the eight services are open, but AWS lists some of their features in maintenance, closed to new customers: Rekognition streaming events, Comprehend topic modeling and event detection, and several SageMaker AI features."
    ],
    trap: "The pairs that get swapped: Transcribe (speech to text) and Polly (text to speech); Textract (text out of a document), Rekognition (what a picture shows) and Comprehend (what a text says). Sentiment of recorded calls: Transcribe first, then Comprehend on the text.",
    docs: [
      ["Machine learning (Overview of Amazon Web Services)", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/machine-learning.html"],
      ["What is Amazon SageMaker AI?", "https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html"],
      ["Services in Maintenance (AWS General Reference)", "https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html"]
    ]
  },

  r1b: {
    k: [
      "Provisioning: CloudFormation creates the resources described in a template as a stack, and StackSets creates stacks across multiple accounts and Regions in a single operation. Service Catalog manages catalogs of IT services approved for use on AWS.",
      "Running servers: Systems Manager centrally views, manages and operates nodes in AWS, on premises and in other clouds, once SSM Agent runs on them. License Manager manages software licenses from vendors such as Microsoft, SAP, Oracle and IBM.",
      "Advice: Trusted Advisor inspects your environment and makes recommendations by category, such as security, fault tolerance and service limits. Compute Optimizer analyzes utilization metrics and gives rightsizing recommendations for single resources.",
      "AWS Health Dashboard: the service health page shows public events for all AWS services and needs no sign-in. AWS Health itself tells you how events and planned activities affect your own resources, and delivers them through EventBridge.",
      "Open-source monitoring as a service: Amazon Managed Service for Prometheus is a serverless, Prometheus-compatible service for container metrics; Amazon Managed Grafana queries and visualizes metrics, logs and traces from multiple sources."
    ],
    trap: "Trusted Advisor's full set of checks needs Business Support+, Enterprise Support or Unified Operations; Basic Support gets the service limits checks and selected security and fault tolerance checks. A size for one specific instance is Compute Optimizer.",
    docs: [
      ["Management and governance (Overview of Amazon Web Services)", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/management-governance.html"],
      ["AWS Trusted Advisor", "https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html"],
      ["What is AWS Compute Optimizer?", "https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html"]
    ]
  },

  r1c: {
    k: [
      "Whole servers: AWS Application Migration Service, which the AWS docs now call AWS Transform MGN, migrates physical, virtual and cloud servers by continuous block-level replication, with cutover windows of minutes. The exam guide prints the old name.",
      "Databases: AWS DMS, for a one-time migration or to replicate ongoing changes so that source and target stay in sync. Migrating to a different database engine adds DMS Schema Conversion.",
      "Files and objects in bulk: DataSync, an online transfer service that copies from NFS, SMB, HDFS, object storage and storage services in other clouds to S3, EFS and FSx.",
      "Partners who exchange files over SFTP, FTPS, FTP or AS2: AWS Transfer Family, fully managed transfers directly into and out of S3 or EFS, with the existing client-side configuration maintained.",
      "Status, from the AWS lifecycle lists: Snowball Edge, the Snow Family device, is closed to new customers, and Application Discovery Service and Migration Hub are in maintenance, which means the same. The four services of this step are open."
    ],
    trap: "MGN and Elastic Disaster Recovery both replicate servers; the goal tells them apart. Moving the servers for good is migration, a standby to recover into is disaster recovery. SFTP in the stem means Transfer Family, not DataSync.",
    docs: [
      ["Migration and transfer (Overview of Amazon Web Services)", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/migration-services.html"],
      ["What is AWS Transform MGN?", "https://docs.aws.amazon.com/mgn/latest/ug/what-is-mgn.html"],
      ["Services in Maintenance (AWS General Reference)", "https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html"]
    ]
  },

  r1d: {
    k: [
      "Match the service to what the application already speaks. MongoDB drivers and tools: Amazon DocumentDB. Apache Cassandra: Amazon Keyspaces, which is serverless. Apache Kafka: Amazon MSK (Managed Streaming for Apache Kafka).",
      "Highly connected data that is queried by its relationships is Amazon Neptune, a managed graph database with the query languages Gremlin, openCypher and SPARQL. AWS names recommendation engines among its use cases.",
      "Amazon MemoryDB is a durable in-memory database compatible with Valkey and Redis OSS: microsecond reads, and data stored durably across Availability Zones in a transaction log. The MemoryDB FAQ now recommends ElastiCache for new workloads.",
      "Amazon OpenSearch Service runs managed OpenSearch clusters, a search and analytics engine for log analytics, real-time application monitoring and clickstream analysis. It is also the usual answer for full-text search over application data.",
      "AWS Data Exchange is not a pipeline of your own data: it is where you find, subscribe to and use third-party data in the cloud. What you query that data with afterwards is one of the analytics services."
    ],
    trap: "The compatibility word decides: MongoDB is DocumentDB, not DynamoDB; Cassandra is Keyspaces; Kafka is MSK, not Kinesis Data Streams. The exam guide's list of in-scope databases names DocumentDB, Keyspaces and Neptune, but not MemoryDB.",
    docs: [
      ["Database (Overview of Amazon Web Services)", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/database.html"],
      ["Analytics (Overview of Amazon Web Services)", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html"],
      ["Amazon MemoryDB FAQs", "https://aws.amazon.com/memorydb/faqs/"]
    ]
  }
});
