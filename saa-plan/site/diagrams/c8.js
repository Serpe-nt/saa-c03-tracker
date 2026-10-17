// DATA ONLY: the diagram for lecture course 8 and its labs (format: site/diagram.js, rules: docs/diagrams.md).
window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.c8 = {
  title: "A data lake pipeline, from streaming ingestion to dashboards",
  why: "A business collects data from many sources, often faster than anyone can look at it. To learn something from it, the data has to be taken in, stored, prepared and queried. Each stage has its own AWS service, and the data lake on S3 sits in the middle.",
  w: 20.2, h: 11.3,
  areas: [
    { id: "region", label: "AWS Region", x: 0.2, y: 2.0, w: 19.6, h: 9.0 },
    { id: "ingest", label: "Ingest", x: 0.5, y: 2.7, w: 8.8, h: 2.6, dash: true },
    { id: "lake", label: "Data lake", x: 10.7, y: 2.7, w: 8.8, h: 8.0, dash: true },
    { id: "analyze", label: "Query and visualize", x: 0.5, y: 5.7, w: 8.8, h: 5.0, dash: true }
  ],
  nodes: [
    { id: "src", label: "Apps and devices", x: 0.9, y: 0.3, w: 3.4, h: 1.2 },
    { id: "kds", label: "Kinesis Data Streams", x: 0.9, y: 3.5, w: 3.4, h: 1.4 },
    { id: "firehose", label: "Amazon Data Firehose", x: 5.5, y: 3.5, w: 3.4, h: 1.4 },
    { id: "raw", label: "S3 raw layer", x: 11.1, y: 3.5, w: 3.4, h: 1.4 },
    { id: "crawler", label: "Glue crawler", x: 15.7, y: 3.5, w: 3.4, h: 1.4 },
    { id: "etl", label: "Glue ETL job", x: 11.1, y: 6.5, w: 3.4, h: 1.4 },
    { id: "catalog", label: "Glue Data Catalog", x: 15.7, y: 6.5, w: 3.4, h: 1.4 },
    { id: "stage", label: "S3 stage layer", x: 11.1, y: 8.9, w: 3.4, h: 1.4 },
    { id: "lf", label: "Lake Formation", x: 15.7, y: 8.9, w: 3.4, h: 1.4 },
    { id: "redshift", label: "Amazon Redshift", x: 5.5, y: 6.5, w: 3.4, h: 1.4 },
    { id: "athena", label: "Amazon Athena", x: 5.5, y: 8.9, w: 3.4, h: 1.4 },
    { id: "qs", label: "Quick Sight dashboards", x: 0.9, y: 7.7, w: 3.4, h: 1.4 }
  ],
  links: [
    ["src", "kds"], ["kds", "firehose"], ["firehose", "raw", "batches"],
    ["crawler", "raw", "crawls"], ["crawler", "catalog", "tables"], ["lf", "catalog", "grants"],
    ["raw", "etl"], ["etl", "stage", "Parquet"],
    ["stage", "athena", "SQL"], ["stage", "redshift"], ["athena", "qs"], ["redshift", "qs"]
  ],
  parts: {
    kds: {
      name: "Amazon Kinesis Data Streams",
      why: "Clicks, sensor readings and logs arrive all the time, and several programs may want to read them, some right away. Kinesis Data Streams collects the records in real time and keeps them for a while, so each reader takes them at its own pace.",
      k: [
        ["Shards", "A stream is a set of shards. The partition key groups records by shard."],
        ["Retention", "Records stay readable for 24 hours by default, up to 365 days. So a consumer can read yesterday's records again."],
        ["Processing", "Managed Service for Apache Flink (formerly Kinesis Data Analytics) processes and analyzes streaming data with Java, Scala, Python or SQL."]
      ],
      trap: "Several independent consumers, or replaying old records, mean Kinesis Data Streams. Firehose only delivers, and an SQS message is deleted by the consumer that processes it.",
      tags: ["Streaming"]
    },
    firehose: {
      name: "Amazon Data Firehose",
      why: "Getting a stream of records into S3 as files would otherwise take a program of your own that collects, converts and writes them. Firehose is fully managed delivery: you write no applications.",
      k: [
        ["Stream as source", "Firehose can read from a Kinesis data stream and load the records into its destination. Producers then write to the stream, not to Firehose."],
        ["Buffering", "Firehose buffers records by size or time before it delivers them. So files appear in S3 in batches after a delay, not record by record."],
        ["On the way", "A Lambda function can transform each batch. A format setting converts JSON to Parquet or ORC, with its schema taken from a table in the Glue Data Catalog."]
      ],
      trap: "Dynamic partitioning, which builds S3 prefixes from keys in the data, must be chosen when the Firehose stream is created. Firehose was formerly called Kinesis Data Firehose.",
      tags: ["Streaming"]
    },
    lake: {
      name: "Data lake on Amazon S3",
      why: "A database keeps only data that fits its tables, and what is thrown away can never be analyzed later. A data lake stores everything as it arrived, structured or not, and processes it later.",
      k: [
        ["S3 as storage", "Virtually unlimited and highly durable. Storage is decoupled from compute and data processing, which traditional Hadoop and data warehouse solutions couple tightly."],
        ["Layers", "One bucket each. Raw: data in its original format. Stage: processed data optimized for consumption, such as Parquet. Analytics: aggregated data for specific use cases."],
        ["Raw stays raw", "If possible, keep the raw layer in its original format with versioning on, so it can be processed again. Lifecycle rules can move ageing raw files to infrequent access, later to archive."]
      ],
      trap: "Without cataloging and access control, a data lake is raw data nobody can use. That is why the Glue Data Catalog and Lake Formation belong to it.",
      tags: ["Analytics", "S3 storage classes & lifecycle"]
    },
    crawler: {
      name: "AWS Glue crawler",
      why: "Files in S3 do not say what columns they hold, and writing a table definition by hand for every dataset is slow. A crawler finds out what the data looks like and writes it into the Data Catalog.",
      k: [
        ["What it does", "Infers the format and schema of the data and creates or updates tables in the Glue Data Catalog."],
        ["Not only S3", "A crawler can also crawl a DynamoDB table and write its schema to the Data Catalog."]
      ],
      trap: "A crawler moves no data: it writes metadata to the Data Catalog. The files stay in S3, and the items stay in DynamoDB.",
      tags: ["Analytics"]
    },
    catalog: {
      name: "AWS Glue Data Catalog",
      why: "A query engine has to know where a dataset lives and what its columns are before it can read it. The Data Catalog keeps those table definitions in one place, for every service that reads the lake.",
      k: [
        ["Metadata only", "A table holds column names, data types, partition keys and the location of the data. It contains no data itself."],
        ["Who reads it", "Athena reads table definitions from it. Firehose takes its schema from a catalog table when it converts records to Parquet."],
        ["One per Region", "Each AWS account has one Data Catalog per Region."]
      ],
      tags: ["Analytics"]
    },
    etl: {
      name: "AWS Glue ETL job",
      why: "Raw files often arrive as CSV or JSON, while queries run faster on a columnar format such as Parquet. Someone has to clean and convert them. A Glue job does that extract, transform and load work, with no servers to manage.",
      k: [
        ["Raw to stage", "A job reads the raw layer and writes processed data to the stage layer, for example CSV converted to Parquet."],
        ["Job bookmarks", "Track the data that a previous run of the job already processed."]
      ],
      trap: "A Glue job changes the data, while a crawler only describes it. Converting records to Parquet as they arrive is also a Firehose setting, with no job to run.",
      tags: ["Analytics"]
    },
    lf: {
      name: "AWS Lake Formation",
      why: "Different teams may see different parts of the lake, down to single columns. A bucket per team and a pile of bucket policies is clumsy. Lake Formation grants access centrally, much like in a relational database.",
      k: [
        ["Grants", "You grant and revoke permissions on Data Catalog resources, down to column, row and cell level."],
        ["Enforced by the engines", "Athena, Redshift Spectrum, EMR and Glue enforce the permissions."]
      ],
      trap: "Hiding one column from one team is a Lake Formation grant, not a separate bucket per team.",
      tags: ["Analytics"]
    },
    athena: {
      name: "Amazon Athena",
      why: "Loading everything into a warehouse is a lot of work for an occasional question. Athena runs standard SQL on the files where they lie in S3. It is serverless, and you pay only for the queries you run.",
      k: [
        ["Scan less", "Partitioning restricts the data each query scans. Columnar formats such as Parquet are optimized for fast retrieval."],
        ["Cost controls", "A workgroup's per-query limit cancels any query that scans more data than the threshold. A per-workgroup limit can notify an SNS topic."],
        ["Federated Query", "Data source connectors let Athena run SQL on sources other than S3, such as a DynamoDB table, with no pipeline that copies the data first."]
      ],
      trap: "A few ad hoc SQL queries on files in S3 mean Athena, not a warehouse to load and size.",
      tags: ["Analytics"]
    },
    redshift: {
      name: "Amazon Redshift",
      why: "Some teams run complex queries and joins on the same data all day, for reports and BI tools. That calls for a data warehouse: structured data in tables built for fast SQL. Redshift is the fully managed one.",
      k: [
        ["Warehouse", "Redshift is the fully managed, petabyte-scale data warehouse. Redshift Serverless provisions and scales the capacity for you."],
        ["Spectrum", "Redshift Spectrum queries structured and semi-structured files in S3 without loading them into tables."]
      ],
      trap: "A central warehouse for complex joins used by BI tools all day means Redshift. A few ad hoc queries on files in S3 do not justify one.",
      tags: ["Redshift", "Analytics"]
    },
    qs: {
      name: "Amazon Quick Sight",
      why: "Rows of query results do not show a trend at a glance to the people who decide. Quick Sight turns them into interactive dashboards. It was formerly Amazon QuickSight and is now a feature of Amazon Quick.",
      k: [
        ["Sources", "Athena and Redshift, including Redshift Spectrum, are among its data sources, and so are files in S3."],
        ["SPICE", "A dataset imported into SPICE, its in-memory engine, answers faster than a direct query that waits for the source each time."]
      ],
      trap: "Data in SPICE is an imported copy that needs a refresh.",
      tags: ["Analytics"]
    }
  }
};
