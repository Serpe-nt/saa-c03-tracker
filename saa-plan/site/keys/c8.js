// Key points per plan step for the course "Designing a Data-Driven Architecture" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c8a: {
    head: "From raw data to answers: lakes, warehouses and streams",
    why: "An online shop collects clicks, orders and support chats, each in its own format, thousands a second. Marketing wants yesterday's numbers by morning, and the fraud team wants alerts within seconds. The data has to be taken in, stored, prepared and queried, and each stage needs the right tool.",
    idea: "AWS has a service for each stage of that pipeline. The first choice is where the data lives. A warehouse holds modeled tables, a lake raw data of every shape, and a lakehouse combines them. Streaming services take the data in as it arrives.",
    k: [
      ["Warehouse, lake, lakehouse", "A data warehouse holds structured, pre-modeled data in tables built for fast SQL (Redshift). A data lake is a central repository for raw data, structured or not, stored first and processed later (S3). A data lakehouse combines the two."],
      ["One service per stage", "Ingest: Kinesis Data Streams, Data Firehose. Store: S3. Catalog and transform: Glue. Query: Athena, Redshift. Visualize: Quick Sight."],
      ["Kinesis Data Streams keeps records", "It collects and processes records in real time. A stream is a set of shards, and the partition key groups records by shard. Records stay readable for the retention period: 24 hours by default, up to 365 days."],
      ["Amazon Data Firehose delivers", "Formerly Kinesis Data Firehose. Fully managed delivery: you write no applications. It buffers records by size or time and delivers them to S3, Redshift, OpenSearch Service and other destinations."],
      ["Flink and MSK", "Managed Service for Apache Flink (formerly Kinesis Data Analytics) processes and analyzes streaming data with Java, Scala, Python or SQL. Amazon MSK is the managed Apache Kafka service, for applications built on Kafka."]
    ],
    trap: "Firehose only delivers. Several independent consumers, or replaying yesterday's records, mean Kinesis Data Streams with a retention period above the 24-hour default. An SQS message is not kept for replay: the consumer that processes it deletes it from the queue.",
    q: {
      q: "A fraud model and a live dashboard each read every card payment as it arrives. After fixing a bug, the fraud team must process the last two days of payments again. What should take the payments in?",
      o: [
        "Kinesis Data Streams, with retention raised above the 24-hour default",
        "Kinesis Data Streams, with the retention left at its default",
        "An SQS standard queue that both applications poll",
        "A Glue crawler that runs on the payments as they arrive"
      ],
      a: [0],
      x: [
        "Right. Several consumers can read the same stream, and records stay readable for the retention period, up to 365 days.",
        "The default retention is 24 hours, so records from two days ago would already be gone.",
        "Consumers that share a queue do not each see every message, and a processed message is deleted, so nothing can be replayed.",
        "A crawler writes metadata about data to the Data Catalog. It does not take in a stream of records."
      ],
      dom: 3, tags: ["Streaming"], doc: "kinesis"
    },
    docs: [
      ["Amazon Kinesis Data Streams terminology and concepts", "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html"],
      ["What is Amazon Data Firehose?", "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"],
      ["What is a data lakehouse?", "https://aws.amazon.com/what-is/data-lakehouse/"]
    ]
  },

  c8b: {
    head: "Turning a pile of files into a data lake people can use",
    why: "A company dumps every export into one bucket for two years. Now an analyst asks which files hold last year's orders and what their columns mean, and whether the support team may see the customers' phone numbers. Nobody knows. Someone must know what each file contains, turn raw data into a usable form, and decide who may see which part.",
    idea: "S3 holds the data in layers. AWS Glue catalogs and transforms it. AWS Lake Formation decides who may see which tables, columns and rows.",
    k: [
      ["S3 keeps storage apart from compute", "S3 is the storage platform of a data lake on AWS: virtually unlimited and highly durable. Storage is decoupled from compute and data processing, which traditional Hadoop and data warehouse solutions couple tightly."],
      ["Raw, stage and analytics layers", "One bucket each. Raw: unprocessed data in its original format. Stage: processed data optimized for consumption, for example CSV converted to Parquet. Analytics: aggregated data for specific use cases."],
      ["A crawler learns the schema", "A Glue crawler infers the format and schema of the data and creates or updates tables in the Glue Data Catalog."],
      ["Glue jobs remember their place", "AWS Glue is serverless data integration. Job bookmarks track the data that a previous run of an extract, transform and load (ETL) job already processed."],
      ["Lake Formation grants by column and row", "You grant and revoke permissions on Data Catalog resources much like in a relational database, down to column, row and cell level. Athena, Redshift Spectrum, EMR and Glue enforce them."]
    ],
    trap: "A crawler moves no data: it writes metadata to the Data Catalog. Hiding one column from one team is a Lake Formation grant, not a separate bucket per team. Without cataloging and access control a data lake is raw data nobody can use.",
    q: {
      q: "Every team queries the same customers table in the data lake, but the support team must never see the phone number column. How do you set that up with the least extra work?",
      o: [
        "A Lake Formation grant to the support team that leaves out that column",
        "A copy of the table without the column, in a bucket for the support team",
        "A Glue crawler that removes the column from the support team's files",
        "A bucket policy that denies the support team the whole table"
      ],
      a: [0],
      x: [
        "Right. Lake Formation grants permissions on catalog resources down to column, row and cell level, and Athena and the other engines enforce them.",
        "A separate copy per team is extra data to build and keep in step. A column-level grant does it on the one table.",
        "A crawler only writes metadata to the Data Catalog. It moves and changes no data.",
        "That blocks the whole table, while the team needs every column but one."
      ],
      dom: 1, tags: ["Analytics"], doc: "lakeformation"
    },
    docs: [
      ["Using crawlers to populate the Data Catalog", "https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html"],
      ["What is AWS Lake Formation?", "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html"],
      ["Recommended data layers (S3 bucket names for data lake layers)", "https://docs.aws.amazon.com/prescriptive-guidance/latest/defining-bucket-names-data-lakes/data-layer-definitions.html"]
    ]
  },

  c8c: {
    head: "Asking the data questions, and showing the answers",
    why: "A manager wants to know how many orders came from phones last quarter. The data sits in S3 as files, and the team's only way is to load all of it into a database first, which takes a week. Data in the lake is worth something only when people can ask it questions and see the answers.",
    idea: "Amazon Athena queries the files where they lie, with SQL. Amazon Redshift is the warehouse for heavy analysis all day. Amazon Quick Sight turns the results into dashboards.",
    k: [
      ["Athena queries files in place", "It analyzes data in S3 directly with standard SQL, is serverless, and you pay only for the queries you run. Partitioning restricts the data each query scans. Columnar formats such as Parquet are optimized for fast retrieval."],
      ["Athena cost controls", "Workgroups carry two. A per-query limit cancels any query that scans more data than the threshold. A per-workgroup limit can notify an SNS topic when the scanned total passes a threshold."],
      ["Quick Sight draws the dashboards", "Amazon Quick Sight (formerly Amazon QuickSight, now a feature of Amazon Quick) builds interactive dashboards. A dataset imported into SPICE, its in-memory engine, answers faster than a direct query that waits for the source each time."],
      ["Redshift for heavy analysis", "The fully managed, petabyte-scale data warehouse. Redshift Spectrum queries structured and semi-structured files in S3 without loading them into tables. Redshift Serverless provisions and scales capacity for you."],
      ["Putting it together", "Firehose lands events in S3. A Glue crawler catalogs them. Glue jobs turn raw data into Parquet. Lake Formation controls who sees what. Athena or Redshift queries it. Quick Sight shows it. The stem's requirement picks each stage."]
    ],
    trap: "A few ad hoc SQL queries on files in S3 mean Athena, not a warehouse to load and size. A central warehouse for complex joins used by BI tools all day means Redshift. Data in SPICE is an imported copy that needs a refresh.",
    q: {
      q: "A Quick Sight dashboard queries Athena directly each time someone opens it, and every view takes a long time to load. The data behind it changes only once a day. What makes it faster?",
      o: [
        "Import the dataset into SPICE and refresh it once a day",
        "Set a per-query data usage limit in the Athena workgroup",
        "Load the data from S3 into a larger Redshift warehouse",
        "Run a Glue crawler on the data before each dashboard view"
      ],
      a: [0],
      x: [
        "Right. A dataset imported into SPICE, Quick Sight's in-memory engine, answers faster than a direct query that waits for the source. As an imported copy it needs a refresh, here once a day.",
        "A per-query limit cancels queries that scan too much. It makes nothing faster.",
        "Loading a warehouse is a big change for a dashboard whose data changes daily. SPICE keeps a fast copy inside Quick Sight.",
        "A crawler updates the Data Catalog. It does not speed up the dashboard's queries."
      ],
      dom: 3, tags: ["Analytics"], doc: "quick"
    },
    docs: [
      ["What is Amazon Athena?", "https://docs.aws.amazon.com/athena/latest/ug/what-is.html"],
      ["Configure per-query and per-workgroup data usage controls", "https://docs.aws.amazon.com/athena/latest/ug/workgroups-setting-control-limits-cloudwatch.html"],
      ["Importing data into SPICE", "https://docs.aws.amazon.com/quick/latest/userguide/spice.html"]
    ]
  },

  l8a: {
    head: "Stream events into S3 as files you can query",
    why: "A game sends player events every second. The team writes a program to collect them, batch them, convert them and save them to S3. It breaks every few weeks, and someone has to watch over it. Events should land in S3 as queryable files, without a program of your own to keep running.",
    idea: "Amazon Data Firehose does that job. Setting up a Firehose stream by hand shows what it does for you, and what must exist before it can do it.",
    k: [
      ["Records arrive in batches", "Firehose buffers incoming data to a certain size or for a certain period before delivering it. So objects appear in S3 in batches after a delay, not record by record."],
      ["A Lambda function can transform", "For preprocessing records on the way. Firehose invokes your Lambda function synchronously with each buffered batch and delivers the transformed records the function returns. No consumer application has to run."],
      ["Format conversion needs a catalog table", "Converting JSON to Parquet or ORC is a Firehose setting. It takes its schema from a table in the Glue Data Catalog, which must exist first. Athena reads its table definitions from the same catalog."],
      ["Dynamic partitioning only at creation", "It builds S3 prefixes from keys in the data. It has to be chosen when the Firehose stream is created."]
    ],
    q: {
      q: "A Firehose stream has delivered game events to S3 for months. The team now wants the objects stored under S3 prefixes built from the player's region, a key in the data. What do they do?",
      o: [
        "Create a new Firehose stream with dynamic partitioning turned on",
        "Turn on dynamic partitioning in the existing stream's settings",
        "Raise the stream's buffer size so that the files are larger",
        "Run a Glue crawler on the bucket to sort the files by region"
      ],
      a: [0],
      x: [
        "Right. Dynamic partitioning builds S3 prefixes from keys in the data, and it has to be chosen when the stream is created.",
        "Dynamic partitioning cannot be switched on later: it is chosen when the stream is created.",
        "A larger buffer changes how often objects are delivered, not which prefix they land under.",
        "A crawler writes metadata to the Data Catalog. It does not move or sort the files."
      ],
      dom: 3, tags: ["Streaming"], doc: "firehose"
    },
    docs: [
      ["Transform source data in Amazon Data Firehose", "https://docs.aws.amazon.com/firehose/latest/dev/data-transformation.html"],
      ["Convert input data format in Amazon Data Firehose", "https://docs.aws.amazon.com/firehose/latest/dev/record-format-conversion.html"],
      ["Partition streaming data in Amazon Data Firehose", "https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning.html"]
    ]
  },

  l8b: {
    head: "Keep everything as it arrived, and keep it usable",
    why: "A retailer's database deletes order details older than a year to save space. Then the data team wants five years of buying patterns, and the old records are gone for good. Data should be kept as it arrived, at any scale, and still be findable and protected years later.",
    idea: "A data lake on S3 keeps everything as-is. Building one by hand shows that its layers, its catalog and its access rules are what keep it usable.",
    k: [
      ["Store data as-is", "A data lake stores data as-is, structured and unstructured, at any scale, without having to structure it first. So records a database would delete to save space can be kept in S3 and analyzed later."],
      ["Keep the raw layer untouched", "If possible, keep the raw layer in its original file format with versioning turned on, and write processed copies to a separate stage layer. Untouched raw data can be processed again when a transformation changes."],
      ["The analytics layer is ready to use", "It holds aggregated data in a consumption-ready format such as Parquet."],
      ["Lifecycle rules for old raw files", "They can move ageing raw files to an infrequent access class and later to archive classes."],
      ["Catalog and secure it", "Without mechanisms to catalog and secure the data, nobody knows what the lake contains. In AWS those are the Glue Data Catalog and Lake Formation."]
    ],
    q: {
      q: "A bug in a transformation job wrote wrong values into a month of Parquet files in the stage layer. The raw layer was kept in its original format, untouched. How do you repair the stage layer?",
      o: [
        "Process the raw files for that month again with the fixed job",
        "Run a Glue crawler on the stage layer to correct the values",
        "Change the Lake Formation grants so that nobody reads the bad files",
        "Move the stage files to an archive class with a lifecycle rule"
      ],
      a: [0],
      x: [
        "Right. Raw data that stays untouched can be processed again whenever a transformation changes.",
        "A crawler infers schemas and writes metadata. It does not change the data in the files.",
        "Hiding the files does not repair them. The analysts would still have no correct data for that month.",
        "Archiving moves the wrong files somewhere cheaper. They stay wrong."
      ],
      dom: 2, tags: ["Analytics"], doc: "glue"
    },
    docs: [
      ["What is a data lake?", "https://aws.amazon.com/what-is/data-lake/"],
      ["Recommended data layers (S3 bucket names for data lake layers)", "https://docs.aws.amazon.com/prescriptive-guidance/latest/defining-bucket-names-data-lakes/data-layer-definitions.html"],
      ["Central storage: Amazon S3 as the data lake storage platform", "https://docs.aws.amazon.com/whitepapers/latest/building-data-lakes/amazon-s3-data-lake-storage-platform.html"]
    ]
  },

  l8c: {
    head: "Query a DynamoDB table with SQL, where it lies",
    why: "An analyst needs one answer that joins order files in S3 with customer records in DynamoDB. The data team says a pipeline that copies the table into the lake will take two weeks to build. Sometimes the question should go to the data, not the data to the question.",
    idea: "Athena Federated Query runs SQL on sources other than S3 through connectors, so a DynamoDB table can be queried in place. In the lab you catalog the table and query it.",
    k: [
      ["A crawler can read DynamoDB too", "A Glue crawler can crawl a DynamoDB table as well as files in S3 and write its schema to the Data Catalog. It stores metadata only. The items stay in DynamoDB."],
      ["Athena Federated Query", "It runs SQL on sources other than S3 through data source connectors. The DynamoDB connector queries tables in place, with no pipeline that copies them to S3 first. Writes such as <code>INSERT INTO</code> are not supported."],
      ["Where connectors run", "Many connectors run as a Lambda function in your account, and custom connectors still do. Since 21 April 2026, certain newly created connectors are registered as Glue Data Catalogs and use no Lambda function in your account."]
    ],
    trap: "For a regular full-table report that must not touch production capacity, export the table to S3 instead. The export needs point-in-time recovery turned on and consumes no read capacity. Federated queries fit occasional questions on current data.",
    q: {
      q: "Once a month an analyst joins order files in S3 with the current customer table in DynamoDB, using SQL. Nobody wants to build or run a pipeline for it. What fits?",
      o: [
        "Athena Federated Query with the DynamoDB connector",
        "A nightly Glue job that copies the table into S3",
        "A Glue crawler that moves the table's items into S3",
        "An <code>INSERT INTO</code> from Athena that writes the files into the table"
      ],
      a: [0],
      x: [
        "Right. Federated Query runs SQL on sources other than S3 through connectors, so the table is queried in place, with no pipeline.",
        "That is a pipeline to build and run, for a question asked once a month.",
        "A crawler stores metadata only. The items stay in DynamoDB.",
        "The connector does not support writes such as <code>INSERT INTO</code>, and the job is to read both sources."
      ],
      dom: 3, tags: ["Analytics"], doc: "athena"
    },
    docs: [
      ["Use Amazon Athena Federated Query", "https://docs.aws.amazon.com/athena/latest/ug/federated-queries.html"],
      ["Amazon Athena DynamoDB connector", "https://docs.aws.amazon.com/athena/latest/ug/connectors-dynamodb.html"],
      ["DynamoDB data export to Amazon S3: how it works", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/S3DataExport.HowItWorks.html"]
    ]
  }
});
