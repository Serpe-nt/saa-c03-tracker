// Key points per plan step for the course "Designing a Data-Driven Architecture" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c8a: {
    why: "A business collects data from many sources, in many shapes, often faster than anyone can look at it. To learn something from it, the data has to be taken in, stored, prepared and queried. Each stage has its own AWS service. The first choice is where the data lives: a warehouse, a lake or both.",
    k: [
      ["Warehouse, lake, lakehouse", "A data warehouse holds structured, pre-modeled data in tables built for fast SQL (Redshift). A data lake is a central repository for raw data, structured or not, stored first and processed later (S3). A data lakehouse combines the two."],
      ["Pipeline stages", "Follow the data through the pipeline and name one service per stage. Ingest: Kinesis Data Streams, Data Firehose. Store: S3. Catalog and transform: Glue. Query: Athena, Redshift. Visualize: Quick Sight."],
      ["Kinesis Data Streams", "Collects and processes records in real time. A stream is a set of shards, and the partition key groups records by shard. Records stay readable for the retention period: 24 hours by default, up to 365 days."],
      ["Amazon Data Firehose", "Formerly Kinesis Data Firehose. It is fully managed delivery: you write no applications. It buffers records by size or time and delivers them to S3, Redshift, OpenSearch Service and other destinations."],
      ["Managed Service for Apache Flink", "Formerly Kinesis Data Analytics. It processes and analyzes streaming data with Java, Scala, Python or SQL."],
      ["Amazon MSK", "The managed Apache Kafka service, for applications built on Kafka."]
    ],
    trap: "Firehose only delivers. Several independent consumers, or replaying yesterday's records, mean Kinesis Data Streams with a retention period above the 24-hour default. An SQS message is not kept for replay: the consumer that processes it deletes it from the queue.",
    docs: [
      ["Amazon Kinesis Data Streams terminology and concepts", "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html"],
      ["What is Amazon Data Firehose?", "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"],
      ["What is a data lakehouse?", "https://aws.amazon.com/what-is/data-lakehouse/"]
    ]
  },

  c8b: {
    why: "Files piled into storage are not yet a data lake anyone can use. Someone must know what each file contains, turn raw data into a usable form, and decide who may see which part. S3 holds the data, AWS Glue catalogs and transforms it, and Lake Formation governs access.",
    k: [
      ["S3 as the lake's storage", "S3 is the storage platform of a data lake on AWS: virtually unlimited and highly durable. Storage is decoupled from compute and data processing, which traditional Hadoop and data warehouse solutions couple tightly."],
      ["Layers", "Organize the lake in layers, one bucket each. Raw: unprocessed data in its original format. Stage: processed data optimized for consumption, for example CSV converted to Parquet. Analytics: aggregated data for specific use cases."],
      ["Glue crawler", "Finds out what your data looks like. It infers the format and schema of the data and creates or updates tables in the Glue Data Catalog."],
      ["AWS Glue", "Serverless data integration. Job bookmarks track data that a previous run of an extract, transform and load (ETL) job already processed."],
      ["Lake Formation", "Governs the lake centrally. You grant and revoke permissions on Data Catalog resources much like in a relational database, down to column, row and cell level. Athena, Redshift Spectrum, EMR and Glue enforce them."]
    ],
    trap: "A crawler moves no data: it writes metadata to the Data Catalog. Hiding one column from one team is a Lake Formation grant, not a separate bucket per team. Without cataloging and access control a data lake is raw data nobody can use.",
    docs: [
      ["Using crawlers to populate the Data Catalog", "https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html"],
      ["What is AWS Lake Formation?", "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html"],
      ["Recommended data layers (S3 bucket names for data lake layers)", "https://docs.aws.amazon.com/prescriptive-guidance/latest/defining-bucket-names-data-lakes/data-layer-definitions.html"]
    ]
  },

  c8c: {
    why: "Data in the lake is worth something only when people can ask it questions and see the answers. Loading everything into a warehouse first is a lot of work for an occasional question. Athena queries the files where they lie. Redshift is the warehouse for heavy analysis all day. Quick Sight turns results into dashboards.",
    k: [
      ["Athena", "For SQL on data that stays in S3. It analyzes the data directly with standard SQL, is serverless, and you pay only for the queries you run. Partitioning restricts the data each query scans. Columnar formats such as Parquet are optimized for fast retrieval."],
      ["Athena cost controls", "Workgroups carry two. A per-query limit cancels any query that scans more data than the threshold. A per-workgroup limit can notify an SNS topic when the scanned total passes a threshold."],
      ["Quick Sight", "Amazon Quick Sight (formerly Amazon QuickSight, now a feature of Amazon Quick) builds interactive dashboards. A dataset imported into SPICE, its in-memory engine, answers faster than a direct query that waits for the source each time."],
      ["Redshift", "The fully managed, petabyte-scale data warehouse. Redshift Spectrum queries structured and semi-structured files in S3 without loading them into tables. Redshift Serverless provisions and scales capacity for you."],
      ["Putting it together", "Firehose lands events in S3. A Glue crawler catalogs them. Glue jobs turn raw data into Parquet. Lake Formation controls who sees what. Athena or Redshift queries it. Quick Sight shows it. The stem's requirement picks each stage."]
    ],
    trap: "A few ad hoc SQL queries on files in S3 mean Athena, not a warehouse to load and size. A central warehouse for complex joins used by BI tools all day means Redshift. Data in SPICE is an imported copy that needs a refresh.",
    docs: [
      ["What is Amazon Athena?", "https://docs.aws.amazon.com/athena/latest/ug/what-is.html"],
      ["Configure per-query and per-workgroup data usage controls", "https://docs.aws.amazon.com/athena/latest/ug/workgroups-setting-control-limits-cloudwatch.html"],
      ["Importing data into SPICE", "https://docs.aws.amazon.com/quick/latest/userguide/spice.html"]
    ]
  },

  l8a: {
    why: "Events arrive one by one, all the time, and you want them in S3 as files that can be queried. Writing and running your own program to collect, convert and store them is work that never ends. Setting up a Firehose stream by hand shows what the service does for you, and what must exist before it can do it.",
    k: [
      ["Buffering", "Firehose buffers incoming data to a certain size or for a certain period before delivering it. So objects appear in S3 in batches after a delay, not record by record."],
      ["Lambda transformation", "For preprocessing records on the way. Firehose invokes your Lambda function synchronously with each buffered batch and delivers the transformed records the function returns. No consumer application has to run."],
      ["Format conversion", "Converting JSON to Parquet or ORC on the way to S3 is a Firehose setting. It takes its schema from a table in the Glue Data Catalog, so the catalog table has to exist before the stream can convert."],
      ["Glue Data Catalog", "This is what makes the delivered files queryable: Athena reads table definitions from it."],
      ["Dynamic partitioning", "Builds S3 prefixes from keys in the data. It has to be chosen when the Firehose stream is created."]
    ],
    docs: [
      ["Transform source data in Amazon Data Firehose", "https://docs.aws.amazon.com/firehose/latest/dev/data-transformation.html"],
      ["Convert input data format in Amazon Data Firehose", "https://docs.aws.amazon.com/firehose/latest/dev/record-format-conversion.html"],
      ["Partition streaming data in Amazon Data Firehose", "https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning.html"]
    ]
  },

  l8b: {
    why: "A database keeps only data that fits its tables, and old records are often deleted to save space. What was thrown away can never be analyzed later. A data lake keeps everything as it arrived. Building one by hand shows that the layers, the catalog and the access rules are what keep it usable.",
    k: [
      ["Store as-is", "A data lake stores data as-is, structured and unstructured, at any scale, without having to structure it first. That is why records a database would delete to save space can be kept in S3 and analyzed later."],
      ["Raw layer", "If possible, keep the raw layer in its original file format with versioning turned on, and write processed copies to a separate stage layer. Raw data that stays untouched can be processed again when a transformation changes."],
      ["Analytics layer", "Holds aggregated data in a consumption-ready format such as Parquet."],
      ["Lifecycle rules", "They can move ageing raw files to an infrequent access class and later to archive classes."],
      ["Catalog and security", "Storing files is not enough: without mechanisms to catalog and secure the data, nobody knows what the lake contains. In AWS those are the Glue Data Catalog and Lake Formation."]
    ],
    docs: [
      ["What is a data lake?", "https://aws.amazon.com/what-is/data-lake/"],
      ["Recommended data layers (S3 bucket names for data lake layers)", "https://docs.aws.amazon.com/prescriptive-guidance/latest/defining-bucket-names-data-lakes/data-layer-definitions.html"],
      ["Central storage: Amazon S3 as the data lake storage platform", "https://docs.aws.amazon.com/whitepapers/latest/building-data-lakes/amazon-s3-data-lake-storage-platform.html"]
    ]
  },

  l8c: {
    why: "Not all data sits in S3: some of it lives in a database such as DynamoDB. Copying it into the lake just to ask one question means building and running a pipeline. A federated query lets Athena ask the question where the data is.",
    k: [
      ["Crawler on DynamoDB", "A Glue crawler can crawl a DynamoDB table as well as files in S3 and write its schema to the Data Catalog. It stores metadata only. The items stay in DynamoDB."],
      ["Athena Federated Query", "Runs SQL on sources other than S3 through data source connectors. The DynamoDB connector lets you query tables with SQL in place, with no pipeline that copies them to S3 first. Writes such as <code>INSERT INTO</code> are not supported."],
      ["Where connectors run", "Many connectors run as a Lambda function in your account, and custom connectors still do. Since 21 April 2026 certain newly created connectors are registered as Glue Data Catalogs and use no Lambda function in your account."]
    ],
    trap: "For a regular full-table report that must not touch production capacity, export the table to S3 instead. The export needs point-in-time recovery turned on and consumes no read capacity. Federated queries fit occasional questions on current data.",
    docs: [
      ["Use Amazon Athena Federated Query", "https://docs.aws.amazon.com/athena/latest/ug/federated-queries.html"],
      ["Amazon Athena DynamoDB connector", "https://docs.aws.amazon.com/athena/latest/ug/connectors-dynamodb.html"],
      ["DynamoDB data export to Amazon S3: how it works", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/S3DataExport.HowItWorks.html"]
    ]
  }
});
