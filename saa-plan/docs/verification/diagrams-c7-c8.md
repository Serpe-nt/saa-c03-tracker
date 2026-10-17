# Course diagrams c7 and c8: sources

Written on 2026-10-16 in the Claude Code cloud sandbox. Files: `site/diagrams/c7.js` (11 parts), `site/diagrams/c8.js` (10 parts).

## How it was checked

- **Reused facts.** Most sentences restate key points in `site/keys/c7.js` and `site/keys/c8.js`. Those were checked against fetched AWS pages on 2026-10-12/13, with a second read (log: `keys-c7-c9.md`). Such a sentence is marked "from `c7.js`, key `<id>` k<n>". The point numbers count from 1 in the order of the entry's `k` array. The page behind each key point is in `keys-c7-c9.md`.
- **New facts.** aws.amazon.com and docs.aws.amazon.com are blocked for fetch in this sandbox. So each new fact was looked up with WebSearch (9 searches, results limited to docs.aws.amazon.com and aws.amazon.com), and the result snippets of the official page were read. **These were not checked against a fetched page.** The ones the writer was unsure of were searched again by a reviewer (see "Review"); a fetched-page read on the owner's PC is still open.
- **What is drawn.** Only services that the course's key points and `STEP_TAGS` (c7a–c7f, l7a–l7e, c8a–c8c, l8a–l8c) teach. Left out on purpose: S3 and CloudFront as a front end for c7 (the c7 key points do not cover hosting; CloudFront appears only in the edge-optimized endpoint sentence of c7b). For c8: DMS, DataSync, MSK as a box, and DynamoDB as a box (federated query is a point in the Athena part). There was no room for a 13th node.
- **Framing sentences** (the problem a part solves, an example such as "billing, shipping and email") have no AWS source by nature. Their facts were checked.
- **Checks.** `node --check` on both files. `node --test`: 47 of 47 pass. Both diagrams were rendered with `tools/diagram-preview.mjs`, in light and dark, and looked at: no arrow crosses a box or a label, and no label sits on an area border.

## c7: A serverless order service built from event-driven microservices

- **Diagram why.** Framing. "One slow or failed service would hold up the others" is from `c7.js` c7c why. "Take the servers away" is from c7a why.
- **Links.** `checks token` is from c7d k3 (a user pool authorizer checks the pool's tokens). `PutEvents` is from c7a k5. `rule` (EventBridge to Step Functions and to SNS) is from https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-targets.html (the target list names a Step Functions state machine and an SNS topic). `fan-out` is from c7c k4. `batches` is from c7a k2 and l7d k2. `redrive` is from l7d k3.

### cognito (Amazon Cognito user pool)
- why "a ready-made user directory": from c7d k1. Sign-up, sign-in and password reset are user pool features: https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html and https://docs.aws.amazon.com/cognito/latest/developerguide/managing-users-passwords.html (search snippets).
- k1 sign-in directly or through providers, JSON web tokens: from c7d k1. "To call the API, the app sends the user's ID or access token in a header, `Authorization` by default": the API Gateway Cognito authorizer pages (see "Review").
- k2 user pool authorizer on REST, JWT authorizer on HTTP APIs: from c7d k3 and k6. "Before the request reaches the backend" is from c7d why.
- k3 identity pool: from c7d k2.
- trap: from c7d trap.

### apigw (Amazon API Gateway)
- why: from c7b why.
- k1: from c7d k3 (IAM, Cognito authorizer, Lambda authorizer) and k4 (resource policy).
- k2: from c7b k5.
- k3: from c7b k4.
- trap: from c7d trap. The ending "that is what the authorizers are for" is an inference.

### fn (Order function, AWS Lambda)
- why: from c7a why and k1.
- k1 synchronous: API Gateway "waits for a response from your function and relays the result to the caller": https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html, and https://docs.aws.amazon.com/lambda/latest/dg/invocation-sync.html (search snippets). Scoped with "Here", because this sentence does not cover every integration type.
- k2: from c7b k1.
- k3: from c7e k1. "Such as the table" is an example.
- trap: from c7e trap and c7a trap.

### ddb (Amazon DynamoDB table)
- why "serverless … no servers to provision, patch or manage": https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html (search snippet: "serverless, fully managed, distributed NoSQL database"; users never provision or patch servers).
- k1: from c7e k4.
- k2: from c7e k5.
- k3: from c7e k3. "Instead" is an inference.
- trap: from c7e k6.

### bus (Amazon EventBridge event bus)
- why: framing, after l7c why.
- k1: from c7a k5.
- k2: from c7a k4. The examples "a Step Functions state machine or an SNS topic" are from https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-targets.html (search snippet).
- k3: from l7c k3.
- trap: from l7c k2 ("fails silently" is that entry's listed inference).

### sfn (AWS Step Functions workflow)
- why: from c7f why.
- k1: from c7f k1. k2: from c7f k2. k3: from c7f k3.
- trap: from c7f trap.

### sns (Amazon SNS topic)
- why: from c7c why and k3. "Billing, shipping and email" is a framing example.
- k1: from c7c k4. k2: from c7c k3. k3: from l7b k1.
- trap: from c7c trap and k6.

### sqs (Amazon SQS queue)
- why: from c7c k1 and l7b why.
- k1: from c7c k1. k2: from l7b k2. k3: from c7c k2.
- trap: from c7c trap.

### worker (Worker function, AWS Lambda)
- why "event source mapping … batches": from c7a k2. "A server that polls around the clock waits most of the time" is framing.
- k1: from l7d k2. k2: from c7c k5. k3: from l7d k5.

### dlq (Dead-letter queue)
- why "find out why its processing did not succeed": https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html (search snippet: isolate unconsumed messages to determine why their processing didn't succeed). "Comes back again and again" follows from the visibility timeout (l7b k2), as an inference.
- k1: from l7d k3.
- k2 "high enough to allow retries": from l7d k3. "At 1, a single failed receive moves the message": same SQS page (search snippet: "If the maxReceiveCount is set to a low value such as 1, one failure to receive a message would cause the message to move to the dead-letter queue").
- k3: from c7a k3.
- trap: from c7f trap.

### obs (CloudWatch Logs and AWS X-Ray)
- why: from l7e why.
- k1: from c7f k4. k2: from l7e k1. k3: from l7e k2.
- trap: from l7e trap.

## c8: A data lake pipeline, from streaming ingestion to dashboards

- **Diagram why.** From `c8.js` c8a why.
- **Links.** `kds → firehose` is from https://docs.aws.amazon.com/firehose/latest/dev/writing-with-kinesis-streams.html (search snippet). `batches` is from l8a k1. `crawls` and `tables` are from c8b k3. `grants` is from c8b k5. `raw → etl → stage`, `Parquet` is from c8b k2 and c8c k5. `SQL` (Athena on S3) is from c8c k1. `stage → redshift` (Spectrum) is from c8c k4. Athena and Redshift to Quick Sight is from https://docs.aws.amazon.com/quick/latest/userguide/supported-data-sources.html (search snippet).

### kds (Amazon Kinesis Data Streams)
- why: "several programs may want to read them" is from c8a trap. "Keeps them for a while" is from c8a k3. The rest is framing.
- k1: from c8a k3. k2: from c8a k3 and trap. k3: from c8a k5.
- trap: from c8a trap.

### firehose (Amazon Data Firehose)
- why: from l8a why and c8a k4.
- k1: a Firehose stream can read from a Kinesis data stream, and Firehose's own `PutRecord` operations are then disabled, so producers use the Kinesis Data Streams operations: https://docs.aws.amazon.com/firehose/latest/dev/writing-with-kinesis-streams.html (search snippet).
- k2: from l8a k1. k3: from l8a k2 and k3.
- trap: from l8a k5 and c8a k4 (former name).

### lake (Data lake on Amazon S3, an area)
- why: from l8b why and k1.
- k1: from c8b k1. Its source is a whitepaper that AWS marks "for historical reference only" (see `keys-c7-c9.md`).
- k2: from c8b k2.
- k3: from l8b k2 and k3.
- trap: from c8b trap and l8b k4.

### crawler (AWS Glue crawler)
- why: from c8b k3. Tables can also be created by hand: https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html (search snippet).
- k1: from c8b k3. k2: from l8c k1.
- trap: from c8b trap and l8c k1.

### catalog (AWS Glue Data Catalog)
- why: the catalog is "an index to the location, schema, and runtime metrics" of your data: https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html and https://docs.aws.amazon.com/glue/latest/dg/components-overview.html (search snippets).
- k1: column names, data types, partition keys, the location of the data; tables "contain metadata; they don't contain data from a data store": https://docs.aws.amazon.com/glue/latest/dg/tables-described.html and https://docs.aws.amazon.com/glue/latest/dg/components-key-concepts.html (search snippets).
- k2: from l8a k3 and k4.
- k3: "Each AWS account has one AWS Glue Data Catalog per region": https://docs.aws.amazon.com/glue/latest/dg/components-key-concepts.html (search snippet).

### etl (AWS Glue ETL job)
- why: "Columnar formats such as Parquet are optimized for fast retrieval" is from c8c k1. "Serverless data integration" is from c8b k4. The CSV and JSON examples are from c8b k2 and l8a k3.
- k1: from c8b k2. A Glue job that reads CSV and writes Parquet: https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/three-aws-glue-etl-job-types-for-converting-data-to-apache-parquet.html (search snippet).
- k2: from c8b k4.
- trap: "a crawler only describes it" is from c8b trap. The Firehose setting is from l8a k3. The contrast between the two is an inference.

### lf (AWS Lake Formation)
- why: from c8b k5 and trap. "A pile of bucket policies is clumsy" is framing.
- k1: from c8b k5. k2: from c8b k5.
- trap: from c8b trap.

### athena (Amazon Athena)
- why: from c8c why and k1.
- k1: from c8c k1. k2: from c8c k2. k3: from l8c k2.
- trap: from c8c trap.

### redshift (Amazon Redshift)
- why: from c8a k1 and c8c trap ("used by BI tools all day" is that entry's listed inference).
- k1: from c8c k4. k2: from c8c k4.
- trap: from c8c trap.

### qs (Amazon Quick Sight)
- why: the former name and Amazon Quick are from c8c k3. "A trend at a glance" is framing.
- k1: Athena, Amazon Redshift, Redshift Spectrum and files in S3 are among the supported data sources: https://docs.aws.amazon.com/quick/latest/userguide/supported-data-sources.html (search snippet).
- k2: from c8c k3.
- trap: from c8c trap.

## Review

Fact-check of the writer's five Unsure items plus the Quick Sight name, 2026-10-16, in the cloud sandbox. WebFetch to docs.aws.amazon.com fails here (DNS), so each verdict rests on the WebSearch summary of the official page (results limited to docs.aws.amazon.com), not on a fetched page. Quoted text is what the summary quoted from the page; "summary" marks a paraphrase.

- c7 `ddb` why ("no servers to provision, patch or manage"): **confirmed**, no change. https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html: "With DynamoDB, you don't need to provision any servers, or patch, manage, install, maintain, or operate any software."
- c7 `dlq` k2 ("At 1, a single failed receive moves the message"): **confirmed**, no change. https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html: with `maxReceiveCount` set to a low value such as 1, "one failure to receive a message would cause the message to move to the dead-letter queue". https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/avoiding-inconsistent-message-processing.html: "we don't recommend setting the number of maximum receives to 1", which fits "high enough to allow retries".
- c8 `catalog` k3 (one Data Catalog per Region per account): **confirmed**, no change. https://docs.aws.amazon.com/glue/latest/dg/components-overview.html: "Each AWS account has one AWS Glue Data Catalog per AWS Region."
- c8 `firehose` k1 ("Producers then write to the stream, not to Firehose"): **confirmed**, no change. https://docs.aws.amazon.com/firehose/latest/dev/writing-with-kinesis-streams.html: with a Kinesis data stream as the source, "the Amazon Data Firehose PutRecord and PutRecordBatch operations are disabled", and producers write with "the Kinesis Data Streams PutRecord and PutRecords operations".
- c7 `cognito` k1 ("the app sends one with each API call"): **fixed**. https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html and https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-invoke-api-integrated-with-cognito-user-pool.html (the summary did not say which of the two holds the sentence): the client must "obtain an identity or access token of the signed-in user from the user pool and include it in the Authorization header (or another header you specified when you created the authorizer)". k1 second half → "The pool issues JSON web tokens. To call the API, the app sends the user's ID or access token in a header, <code>Authorization</code> by default."
- c8 `qs` why (Quick Sight, formerly QuickSight, a feature of Amazon Quick; raised by the coordinator, not in the writer's list): **confirmed**, no change. https://docs.aws.amazon.com/quick/latest/userguide/what-is.html: Amazon Quick evolved from Amazon QuickSight, which continues as Amazon Quick Sight, a feature within Quick (summary).

## For the merge

- No new `DOCS` keys. No changes outside `site/diagrams/c7.js`, `site/diagrams/c8.js` and this log.
- Tags used are all in `QTAGS`: Cognito, API Gateway, Lambda, DynamoDB, CloudTrail, EventBridge, Step Functions, SNS, SQS, CloudWatch, Streaming, Analytics, Redshift, S3 storage classes & lifecycle.
