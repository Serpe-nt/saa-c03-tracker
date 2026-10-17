# Question bank: authoring, checking, status

The quizzes exist to turn "I watched it" into "I can answer a scenario question about it". The learner must score 27/30 to complete a day, reads an explanation after every answer, and is sent back to a specific plan step when wrong. A wrong key or explanation teaches something false, so content quality matters more than quantity.

## What is in the bank

| File | Ids | Count | Used by |
|---|---|---|---|
| `site/quiz/d01.js` … `d06.js` | `q01-001` … `q06-050` | 50 per file | foundation level: day quizzes (first on a topic), reviews, warm-up; the mock once mock questions run out |
| `site/quiz/d08.js` … `d11.js` | `q08-001` … `q11-050` | 50 per file, one exam domain each | exam level: the same uses, after the foundation questions on a topic |
| `site/quiz/d12.js` … `d15.js` | `q12-001` … `q15-040` | 40 per file | exam level, written for the 21-day plan on topics the exam guide's in-scope list had ahead of the bank: 12 identity and access, 13 serverless, messaging and containers, 14 data, analytics, ML services and purpose-built databases, 15 operations, governance, migration and the edge |
| `site/quiz/mock1.js`, `mock2.js` | `m1-001` … `m2-065` | 65 per file, each split 20/17/15/13 by domain | mock exam only |
| `site/quiz/meta.js` | — | — | `QUIZ` array, `QTAGS` (allowed tags), `DOCS` (AWS FAQ links) |
| `site/extras.js` | — | 32 cards, 171 drill items, 45 cues | self-check model answers, "Which service?" drill, exam-wording cheat sheet |

The number in a file name and in `day` is a **pool**, not a plan day (it was a day in the 14-day plan; there is no pool 7). Which questions a plan day asks is decided by topics: every step in `plan.js` names the `QTAGS` it teaches (`STEP_TAGS`), and a day's quiz draws the questions that are about one of the day's topics and about nothing taught later (`QZ.dayPool`). Review, exam-domain, weak-topic and exam-weighted days draw across pools. See "Selection rules" in `docs/architecture.md`.

How many are needed: a quiz takes 30, and a retake should be able to show different ones, so a day of new material needs about 45 questions on its own topics (`data.test.mjs` checks each day). Selection order is "never seen → wrong last time → seen longest ago" (`QZ.rank`), with foundation-level before exam-level among the unseen. Option order is shuffled per run.

## Format

```js
{id:"q02-017", day:2, dom:1, tags:["Security groups & NACLs"],
 q:"Scenario … Which solution meets these requirements?",        // "(Choose two.)" at the end for multiple response
 o:["…","…","…","…"],                                             // 4 options, or exactly 5 for Choose two
 a:[2],                                                           // 0-based keyed option(s): 1, or 2 for Choose two
 x:["why A is wrong","…","why C is right","…"],                   // one explanation per option, same order
 ref:["d2b4"],                                                    // optional: steps that are exactly the place to go back to; [] is fine
 doc:"vpc"}                                                       // optional key in DOCS
```

- `id`: file prefix + 3-digit sequence. Ids key the learner's stats, review queue and notebook: never rename or reuse. Fix a question in place (same id). To retire one, delete it; the app drops unknown ids from saved runs.
- `dom`: exam domain the question mainly tests: 1 Secure, 2 Resilient, 3 High-performing, 4 Cost-optimized.
- `day`: the pool number (the file's number), or `"mock"`.
- `tags`: 1–2 strings copied exactly from `QTAGS`; the first is the main topic. Tags decide where a question appears: a day's quiz asks it only when every tag has been taught by then, so add a second tag only when the question needs that topic. The weak-spot map groups by tags. Add a tag to `QTAGS` only if no existing one fits, and then give it to the step that teaches it in `STEP_TAGS` (a test fails otherwise).
- `ref`: optional pointers to steps that are exactly the place to go back to (a self-check or a build). Where to study is otherwise derived: the steps whose `STEP_TAGS` include the question's main topic, shown lectures first, then labs, builds and self-checks (`studyRefs` in `app.js`), three at most. Never point at a retired step; a test rejects unknown ids.
- `doc`: only keys that exist in `DOCS`; omit when none fits. Never invent URLs.
- Markup: plain text, `<code>…</code>` only. Escape a literal `<` as `&lt;`.

## Writing rules

- Original wording in SAA-C03 style. Never copy exam dumps, official practice sets or course questions.
- Exactly one defensible best answer (two for Choose two). If an expert could argue for another option, change the stem's requirements until they can't.
- The stem carries the deciding requirement ("least operational overhead", "most cost-effective", "without traversing the internet", "RPO of 15 minutes").
- Options are shuffled on screen: no "all/none of the above", "both A and B", or anything positional.
- Options parallel in length and style; the keyed option must not be the longest by habit (`tools/qstats.mjs` counts this).
- Explanations say specifically why each option is right or wrong for this scenario.
- About 15% Choose two (7–8 of 50; 10 of 65 per mock).
- Difficulty: pools 1–6 associate foundations (some short concept checks, mostly 2–4 sentence scenarios); pools 8–15 and the mocks full exam level (3–6 sentences, several requirements, plausible partly-right distractors).
- Avoid volatile numbers (prices, most quotas). Stable limits are fine; see "AWS changes" below for limits that moved recently.
- Never key an answer on a retired or closed-to-new-customers service (list below). `tests/data.test.mjs` checks the common names in keyed options.
- Use current service names. Where the exam guide still uses an older name, write "new name (formerly old name)" once in the explanation.
- One question = one decision. Before adding, grep the bank for the concept and run `node tools/similar.mjs` afterwards.

## The card's one question

Every card ends with one question of its own (`KEYS[id].q` in `site/keys/*.js`, written next to the card it belongs to). It replaced "Test me" at the owner's request.

- **Asked only on its card.** It is not in the bank (`window.QUIZ`): no day quiz, mock, warm-up, drill or step practice draws it. An answer counts like a quiz answer (XP, topic accuracy, readiness; a miss goes to the notebook and comes back in review), under the id `card-<step id>`. Never rename a step id that has one.
- **Unique.** Unlike every bank question and every other card's: `data.test.mjs` rejects a shared stem, and `node tools/similar.mjs 0.30` must list no pair with a `card-` question (rewrite the card's question, never the bank's).
- **What it asks:** the one thing the card most wants you to take away, usually its idea or the decision rule in its points, in a situation of its own. Only what this card (or an earlier one) taught; nothing the exam trap or the points don't cover. On a setup or admin card: the safety, cost or exam-technique point of the step.
- **Shape:** as a bank question, without `id`, `day` and `ref`: `{q, o, a, x, dom, tags, doc?}`. Four options (five with "(Choose two.)" and two answers), one explanation per option that teaches (the right one says why it is right, each wrong one why it is wrong, from the card's own facts), `dom` 1–4 (a setup card's question belongs to the domain its point is about: safety → 1, cost → 4), 1–2 `tags` from `QTAGS`, `doc` a `DOCS` key. Only `<code>` markup, no positional wording.
- **Facts:** as for the bank (the checklist below). Most come straight from the card's own checked points; a fact that isn't on the card needs a fetched AWS page.

## Checks to run after any content edit

```
node --test                      # structure, ids, refs, tags, docs keys, closed services, duplicate stems, cards/drill/cues
node tools/qstats.mjs d08        # domains, Choose-two share, answer positions, "keyed option clearly longest"
node tools/similar.mjs 0.38      # near-duplicates across all pools; review every pair it lists
```

The remaining pairs at 0.38–0.40 (q01-049/q04-002, q10-013/q11-018, q04-039/q08-049, q06-047/q11-012, q03-016/q10-009) are the same concept on different days with different deciding requirements, which is intended spaced repetition. Lower-similarity mock vs day candidates noted but not reworked: q09-031/m1-006, q09-021/m1-060, q10-034/m2-012, q10-032/m2-047, q11-027/m1-042, q09-016/m2-058, q09-013/m1-045, q08-022 + q02-030/m1-052, q10-037/m2-032.

## Fact-check checklist (per question)

1. Every statement in the stem, options and explanations is true now. Verify anything uncertain with AWS sources (What's New, docs, FAQs).
2. Exactly one defensible key.
3. Explanations accurate and specific.
4. No closed services as keys; current names.
5. Tags are right: the first is what the question decides on, and no tag names a topic the scenario only mentions. Any `ref` names a step that exists.
6. `doc` key exists and fits.

## Verification status (as of 2026-10-13)

**History.** All content was written on 2026-10-12 by AI writer agents working from this guide, and reviewed the same day by separate reviewer agents inside a cloud sandbox where aws.amazon.com and docs.aws.amazon.com were blocked. They worked from web-search snippets, and 90 late rewrites were reviewed from model knowledge only.

**Two passes against the pages themselves.** Later on 2026-10-12 the whole bank was re-checked twice on the owner's PC, where both sites can be fetched. A fact counted as confirmed only when the sentence or table entry was found in the text of a fetched page.

- **Pass 1:** seven agent sessions, one group of files each, read every entry against the pages and corrected what disagreed.
- **Pass 2:** fresh sessions that had not seen their files before read everything again. Beyond re-checking each keyed answer they had four extra jobs: back every statement in a wrong option's explanation that a service cannot do something with a page, or rewrite it to what is documented; find a source for the statements pass 1 had only inferred, or reword them; apply the AWS changes found by any session to their own files (current names, no outdated absolutes); and give every question a `doc` link.

| Part | Entries | Changed in pass 1 | Changed in pass 2 | Answer keys changed | Logs in `docs/verification/` |
|---|---|---|---|---|---|
| `d01.js`–`d03.js` | 150 | 13 | 64 (14 only a doc link) | 0 | `d01-d03.md`, `pass2-d01-d03.md` |
| `d04.js`–`d06.js` | 150 | 5 | 47 | 0 | `d04-d06.md`, `pass2-d04-d06.md` |
| `d08.js`, `d09.js` | 100 | 8 | 42 (9 only a doc link) | 0 | `d08-d09.md`, `pass2-d08-d09.md` |
| `d10.js`, `d11.js` | 100 | 18 | 44 (8 only a doc link) | 0 | `d10-d11.md`, `pass2-d10-d11.md` |
| `mock1.js` | 65 | 3 | 38 (5 only a doc link) | 0 | `mock1.md`, `pass2-mock1.md` |
| `mock2.js` | 65 | 11 | 29 (4 only a doc link) | 0 | `mock2.md`, `pass2-mock2.md` |
| `d12.js`–`d15.js` (new with the 21-day plan) | 160 | written 2026-10-12, see below | | | `pool12.md` … `pool15.md` |
| `extras.js` and the glossary | 335 | 32 | 22 (8 model answers, 1 glossary term, 11 drill items, 2 cues) | n/a | `extras.md`, `pass2-extras.md` |

No answer key changed in either pass. Stems changed: q02-005 (a wrong option had become a second defensible answer) and one word in q04-036. Option texts reworded without changing their meaning: q10-018, q10-034, m1-042 (service name) and the keyed option of m2-050 (it relied on a feature closed to new customers). q08-003 keys the current S3 operation and its explanation describes the older copy job, so either exam wording is recognisable.

After pass 2 every one of the 630 questions had a `doc` link (`DOCS` grew from 61 to 111 keys, each checked by `tools/links.mjs`), and `tools/qstats.mjs` reports "keyed option clearly longest: 0" for every pool.

**Pools 12–15 (160 questions, 2026-10-12).** An audit of the exam guide's in-scope services against the bank found services with no question at all (the eight machine learning services, X-Ray, Service Catalog, License Manager, Application Migration Service and more) and too few questions on identity for a day of its own. Four sessions each wrote one pool of 40 on its own branch: every statement looked up on AWS pages fetched in that session, sources per question in the log. Then a sub-agent that saw only stems and options answered each pool blind and argued for any other option it could defend: in all four pools its 40 answers matched the keys, and the questions it found arguable or too easy were reworked (pool 12: 2 after the read and 2 before it; pool 13: 6; pool 14: 4; pool 15: 7). No pair with a new id shows in `tools/similar.mjs 0.38`. The bank is now 790 questions and `DOCS` has 155 keys (44 new, 443 links checked in all). Each log ends with what its session could not settle; those lists are short and name the question ids.

Each log lists, per changed entry, what was wrong and the page that says so; the pass-2 logs also list the wrong-option claims that were rewritten because no page backed them, and the ones that were kept with the page that backs them.

What these passes were: two independent reads by AI agents on one day. No human AWS expert has reviewed the content.

**Doubts from the sandbox review, now settled:**
- Organization conformance packs do deploy to accounts that join later (m2-046).
- The Los Angeles Local Zone lists GPU instances (m2-064).
- Rekognition does work on Kinesis video streams, but that feature is closed to new customers (m2-050, rewritten).
- Firehose dynamic partitioning can only be enabled when the stream is created (q10-039).
- S3 has an in-place encryption change, `UpdateObjectEncryption` (q08-003).
- Amazon AppFlow and Amazon Detective are on none of AWS's lifecycle lists, so both are open to new customers (m1-026, m1-038).

**Left alone by the owner's decision** (counted in the pass-2 logs, not rewritten because no page contradicts them):
- **Price comparisons** that AWS does not state in words: about 54 questions. AWS pricing pages load their figures by script. Keys that rest on one are named in the logs (for example q11-023, q11-030, q11-033, q11-042, m1-019, m1-022, m1-049, m2-009, m2-051).
- **Provisioning lead times** (Direct Connect weeks, VPN hours): 5 questions (q02-037, q02-043, q10-038, q10-040, q11-047).
- **Figures on which AWS's own pages disagree:** S3 Replication Time Control (SLA 99.9%, FAQ design target 99.99%), Aurora Global Database recovery time, the per-strategy recovery times in the DR whitepaper (a figure, not text).
- **Where a question sends you back to:** since the 21-day plan this is derived from topics (`STEP_TAGS`), not written per question; a `ref` survives only where its step still exists. The lectures behind the steps need a login and were never opened.

**Still open after both passes:**
- **m1-048 and q14-035 (MemoryDB).** ElastiCache for Valkey now has a durability option and the MemoryDB FAQ recommends ElastiCache for new workloads; MemoryDB is also not on the exam guide's in-scope list. Both keys still hold for the options as written (the ElastiCache options have only asynchronous replicas or are Memcached). Rewrite or retire m1-048 when there is time.
- **Flagged by the sessions that wrote the 21-day content, not changed** (each is true as written but narrower than AWS's current pages; sources in the logs named):
  - q01-036 and q10-020 speak of two ECS launch types; ECS now documents three capacity options, with ECS Managed Instances (`keys-c3-c4.md`, `pool13.md`).
  - q10-015 and q01-031 treat 15 minutes as the Lambda limit; Lambda Managed Instances allows up to 90 minutes for asynchronous and event source mapping invocations (`keys-c7-c9.md`).
  - q09-010, m1-054, m2-055 and an option of m2-052 say "custom event bus" with rules; EventBridge now calls that type Custom Event Bus - Classic and has a new subscriber-based Custom Event Bus (`keys-c7-c9.md`).
  - q06-021 names SCPs as how Control Tower implements preventive controls; they are now SCPs, RCPs and declarative policies (`pool15.md`).
  - q01-039's explanation leans on a sentence that the S3 static-hosting page no longer has (no server-side scripting); the page still says a website endpoint supports only GET and HEAD requests on objects (`keys-c1-c2.md`).
  - q08-030's explanation says what a security group rule may reference; not re-checked (`pool12.md`).
  - q04-041 and m2-039 key Parameter Store on cost for API keys and tokens. The Parameter Store guide now recommends Secrets Manager for those; both explanations say so since 2026-10-13, and the stems' cost requirement still decides.
- **Not stated on a page either way:** q05-005 and q05-039 (an own Elastic IP on an ALB), q08-024 (flow logs hold no payload: from the field list), q08-034, q08-044, q09-010 (root sign-in events matched by an EventBridge rule), q10-023 ("within seconds"), q11-008, q11-046 (price classes on a flat-rate plan), m1-022 and m1-049 (no documented lag figure for a cross-Region read replica), m2-022 (reworded, not tried on a live bucket), m2-047 and q10-032 (the words "fuzzy" and "facets").
- **Judgement statements** in explanations ("adds operational overhead", "more work") have no source page and were reviewed by reasoning.
- **General descriptions** that restate what a feature is for were read for plausibility, not traced to a sentence.
- **Names the exam may still print.** The bank uses current names with the former one once in an explanation (Aurora serverless, AWS Transform MGN, Route 53 VPC Resolver, Security Hub CSPM); which wording the live exam shows is unknown.

## Skill Builder and AWS links

- Refs point at plan steps (Essentials modules, Cloud Quest assignments, Exam Prep Plan lessons, own builds).
- **Skill Builder outlines were read on 2026-10-12.** Course pages and their Outline tab are public (no login), so course, module, lesson and training names in plan.js now follow them:
  - **AWS Cloud Practitioner Essentials:** free, 13 modules, 12 h 45 min. All 13 module names match the plan; the notes of `d4w1`, `d6w1`–`d6w4` now name the lessons. There is no course-level final assessment, only one per module (`d6w6`). Skill Builder announces a new format for the course on 2026-10-23 and warns that progress on a course in flight may be reset.
  - **AWS Cloud Quest: Cloud Practitioner:** free, 12 assignments, 12 h. All 12 names match the Play steps. Cloud Quest lists them in its own order (Cloud Economics is fifth, Connecting VPCs seventh).
  - **Exam Prep Plan: AWS Certified Solutions Architect - Associate (SAA-C03 - English):** a learning plan of 18 trainings, 18 h 25 min, last updated 2026-05-07. Free: Exam Prep Plan Overview, Official Practice Question Set (20 questions), Exam Prep Overview, Domain 1–4 Review (45 min each; one lesson per task statement), Exam Prep Summary. Subscription: Domain 1–4 Practice (exam-style questions and flashcards), Domain 1–4 Practice: AWS SimuLearn (1 h labs), AWS Escape Room, Official Practice Exam (65 questions, 130 minutes). Days 7–13 were renamed to these; the old "Sample Questions" step (`d7e5`) is not in the plan any more and was retired, and "bonus questions" are now part of Domain Practice.
- Shared responsibility questions on Day 1 (q01-048–050) reference Module 1 (d1w1): confirmed, Module 1 has the lesson "The AWS Shared Responsibility Model". Module 2 has a lesson "Messaging and Queuing", and AWS Organizations is taught in Module 10, not in Module 9.
- What is inside a lesson (the videos themselves) still needs a login and was not opened, so whether a `ref` points at the lesson that teaches exactly that fact is checked by lesson title only.
- `DOCS` holds only stable FAQ/overview URLs on aws.amazon.com and docs.aws.amazon.com. All 111 were fetched on 2026-10-12 from the owner's PC with `node tools/links.mjs` and answer a plain 200; the Aurora FAQ had moved to docs.aws.amazon.com and was repointed, and 50 keys were added that day so that every question can link a page. Re-run the tool after adding a link.

## AWS changes the reviewers found (reported via web search, 2024–2026)

Treat these as reported facts with the source type noted in git history; re-verify if a new question depends on one.

- **Closed to new customers / maintenance:**
  - Snowball Edge, and with it the Snow Family as an answer, since 2025-11-07. AWS points to DataSync or Data Transfer Terminal.
  - FSx File Gateway (late 2024).
  - Timestream for LiveAnalytics (2025-06-20). Timestream for InfluxDB is still open.
  - Kendra (maintenance, 2026-07).
  - AWS Audit Manager (2026-04-30). AWS Backup Audit Manager is a separate feature.
  - App Runner (maintenance).
  - Long retired: OpsWorks, CodeCommit (new customers), Cloud9, QLDB, Snowmobile, S3 Select, CloudSearch, Data Pipeline, EC2-Classic.
  - CloudHSM hsm1.medium reached end of support on 2025-12-01; hsm2m.medium is FIPS 140-3 Level 3.
- **Renames:**
  - Security Hub → Security Hub CSPM for posture checks. A new unified Security Hub went GA in Dec 2025.
  - QuickSight → Amazon Quick Sight, part of Amazon Quick Suite (Oct 2025, later "Amazon Quick").
  - SageMaker → SageMaker AI.
  - Kinesis Data Firehose → Amazon Data Firehose.
  - Kinesis Data Analytics → Managed Service for Apache Flink.
  - MemoryDB for Redis → Amazon MemoryDB.
  - EFS "storage class" wording → Regional / One Zone file systems.
- **Networking and load balancing:**
  - Regional NAT gateway mode (2025-11-19): spans AZs and needs no public subnet. Zonal NAT gateways still exist.
  - NLB listener rules (2026-07, IPv4 vs IPv6 source only) and NLB QUIC listeners (late 2025).
  - Accounts created after Nov 2025 get consistent AZ name mapping in older Regions.
  - EventBridge "enhanced custom event bus" can be shared through RAM (2026-09-24); the older type is "classic".
- **Storage:**
  - S3 maximum object size is 50 TB (2025-12). Single PUT is still 5 GB.
  - New S3 buckets block SSE-C by default (2026-04-06) until it is enabled with PutBucketEncryption.
  - gp3 limits raised (2025-09): 80,000 IOPS, 2,000 MiB/s, 64 TiB.
  - Amazon S3 Files (2026-04, NFS on S3, built on EFS) exists.
  - EFS Elastic throughput reads go up to 60 GiB/s.
- **Security and identity:**
  - SCPs accept the full IAM policy language, including conditions in Allow statements (2025-09-19). Resource control policies (RCPs) exist.
  - ACM can export public certificates issued as exportable (2025-06).
  - KMS automatic rotation period is configurable from 90 to 2,560 days (default 365).
  - Accounts created on or after 2024-10-01 can't create Auto Scaling launch configurations.
- **Databases and compute:**
  - Aurora Serverless v2 can scale to 0 ACUs with auto-pause on recent engine versions (2024-11).
  - Database Savings Plans (2025-12-02): 1-year only, no upfront; up to 35% off serverless and about 20% off provisioned. 3-year RDS Reserved Instances are still deeper.
  - Lambda Managed Instances bill for EC2 capacity.
- **Support plans:**
  - Developer, Business and Enterprise On-Ramp end on 2027-01-01; Business Support+ replaces them.
  - Shield Response Team access requires a Business-level or Enterprise plan.

### Added by the 2026-10-12 pass against fetched pages

Read from AWS pages by the verification sessions; the source URL for each is in `docs/verification/`.

- **Closed or ending:**
  - Snowball support ends in all commercial Regions on 2026-12-31. AWS Data Transfer Terminal is available only to Enterprise Support customers at this time.
  - Rekognition Streaming Video is closed to new customers (2026-04-30).
  - Amazon AppFlow and Amazon Detective are on none of the lifecycle lists (maintenance, sunset, full shutdown in the AWS General Reference): both are open.
- **Renames:**
  - Aurora Serverless v2 → the docs now say "Aurora serverless".
  - AWS Application Migration Service → AWS Transform MGN (the exam guide still prints the old name).
  - Performance Insights pages are retitled Database Insights; the Performance Insights API is still documented.
  - Kinesis Data Streams capacity modes are "On-demand Standard", "On-demand Advantage" and "Provisioned". EFS Max I/O is labelled "previous generation".
  - AWS WAF calls a web ACL a "protection pack (web ACL)" and also attaches to App Runner, Verified Access, Amplify and Bedrock AgentCore Gateway.
  - EventBridge scheduled rules are labelled legacy; AWS recommends EventBridge Scheduler.
- **Compute:**
  - The 15-minute Lambda limit is for standard functions. Lambda Managed Instances allow up to 90 minutes for asynchronous invocations, and Lambda MicroVMs and durable functions run longer.
  - Elastic Beanstalk has a Standard mode (EC2) and a Cluster mode (EKS).
- **Storage:**
  - S3 `UpdateObjectEncryption` changes an object from SSE-S3 to SSE-KMS (or swaps the key, or applies Bucket Keys) in place, also through Batch Operations. A copy job is no longer the only way.
  - The 30-day minimum age before a lifecycle transition to an IA class is no longer documented; the Transition API accepts 0 days. The 30-day minimum storage charge in IA remains.
  - S3 Replication Time Control: the SLA commits to 99.9%; 99.99% within 15 minutes is the design target in the FAQ.
  - SSE-C is also disabled on existing buckets in accounts that hold no SSE-C objects.
  - The S3 static-hosting page recommends Amplify Hosting first, CloudFront second.
- **Security, monitoring, networking:**
  - CloudTrail Insights analyses management and data events.
  - Trusted Advisor's full set of checks needs Business Support+, Enterprise Support or Unified Operations.
  - KMS on-demand rotation works for imported key material.
  - A CloudWatch Logs log group's class cannot be changed after creation.
  - Firehose dynamic partitioning can only be enabled when the stream is created.
  - Some Athena federated connectors created through the Glue Data Catalog no longer use a Lambda function (2026-04-21).
  - Site-to-Site VPN tunnels carry 1.25 Gbps, or up to 5 Gbps with a Large Bandwidth Tunnel on Transit Gateway or Cloud WAN.
- **Accounts and billing:**
  - A Free plan account is upgraded to the Paid plan when it creates or joins an AWS Organization, which enabling an organization instance of IAM Identity Center does in a standalone account. The plan kept the account out of Organizations for that reason until 2026-10-13, when the owner moved it to the Paid plan to buy the Skill Builder subscription.
  - AWS is rolling out a new sign-up ("Sign up for AWS (new)") to a limited number of customers: a Google, GitHub, Apple or Amazon login, projects and AWS Settings. IAM users with console access can't be created in it.

### Reported while writing the 21-day content (2026-10-12)

Seen by the eight content sessions on pages they fetched; the page for each is in the log named. Not all of them have been checked against the whole bank.

- **Names:** AWS Application Migration Service is "AWS Transform MGN" in the docs and the overview whitepaper; the exam guide keeps the old name (`keys-c5-c6-r1.md`). The exam guide's in-scope list prints "Amazon Quick"; the service page says Amazon Quick Sight, a feature of Amazon Quick (`keys-c7-c9.md`). Firehose "delivery streams" are "Firehose streams". The classic Lambda function type is called "Lambda Event Functions" next to Lambda Managed Instances (`keys-c1-c2.md`).
- **Not in scope:** Amazon MemoryDB, Amazon Timestream and QLDB are not on the exam guide's in-scope list (`pool14.md`). QLDB is shut down and Amazon Managed Blockchain is in sunset, so no ledger question was written.
- **Closed, maintenance or sunset:** Outposts 1U and 2U servers are no longer sold; Application Discovery Service, Migration Hub, Systems Manager Incident Manager, Change Manager and Application Manager, Service Catalog AppRegistry, Comprehend topic modeling and event detection, AWS Glue Ray jobs, Rekognition Batch Image Content Moderation, Amazon Cognito Sync and SNS Message Data Protection are in maintenance; AWS WAF Classic, App Mesh, Proton, Managed Blockchain and DevOps Guru are in sunset; DMS Fleet Advisor and DataSync Discovery are shut down; the ARC readiness check is closed to new customers (ARC now has Region switch); ECS Anywhere drops several operating systems from 2026-08-07 (`keys-c5-c6-r1.md`, `keys-c3-c4.md`, `pool13.md`, `pool14.md`, `pool15.md`).
- **Limits that moved:** the SQS maximum message size is 1 MiB and the Lambda asynchronous invocation payload 1 MB; an API Gateway REST API integration timeout can be raised above 29 seconds for Regional and private APIs; REST APIs support VPC links V2 to an Application Load Balancer (VPC links V1 are legacy) (`pool13.md`). The bank has no "256 KB" statement (checked 2026-10-13).
- **New options next to old ones:** regional NAT gateways next to the zonal kind; ECS Managed Instances as a third capacity option, with capacity providers recommended over launch types; Kinesis Data Streams on-demand streams can deliver to S3 without Firehose; Redshift RG instances and Redshift Serverless query the data lake on their own compute (Spectrum is the DC2 and RA3 mechanism); EventBridge has a subscriber-based Custom Event Bus next to the default bus and Custom Event Bus - Classic; an EventBridge target can be invoked through an IAM execution role instead of a resource-based policy; CloudFormation `Fn::GetStackOutput` reads outputs across accounts and Regions (`Fn::ImportValue` stays same account and Region); Control Tower preventive controls use SCPs, RCPs and declarative policies; a third Secrets Manager rotation form (managed external secrets); Cost and Usage Reports are "CUR 2.0" in Data Exports, the old kind is Legacy; MACsec is on 10, 100 and 400 Gbps dedicated Direct Connect connections only; the Well-Architected guide describes a Well-Architected Agent (preview) next to the Tool.
- **Narrower than it was written here:** only "certain newly created" Athena federated connectors run without a Lambda function; data catalog and custom connectors still need one (`keys-c7-c9.md`). ACM renews a DNS-validated certificate automatically only while it is in use by an AWS service and its CNAME records are in DNS (checked 2026-10-13; the `d8c3` model answer now says so). The Parameter Store guide recommends Secrets Manager for database credentials, API keys and tokens (checked 2026-10-13).
- **Checked and left:** the CloudTrail Insights page says Insights analyzes "management and data events", as the list above has it; the concepts page words it more narrowly.

### Added by the second pass (2026-10-12)

Read from AWS pages by the second-pass sessions; sources are in the `pass2-*.md` logs. The three marked "re-read" were also checked by the coordinating session.

- **Renames:**
  - Route 53 Resolver → Route 53 VPC Resolver, renamed when Route 53 Global Resolver was introduced (re-read). The endpoints are still called Resolver endpoints.
  - Control Tower: the log archive account is now the "CloudTrail administrator account" and the audit account the "Config aggregator account"; landing zone 4.0 no longer requires a Security OU.
  - X-Ray "service map" → "trace map".
- **Compute and containers:**
  - Lambda durable functions run multi-step workflows for up to a year; the 15-minute cap is per invocation of a standard function.
  - Predictive scaling is no longer described as machine learning.
  - Spot requests are capped at the On-Demand price by default; setting a lower maximum price means more interruptions.
  - The Wavelength guide describes communications service provider networks, not only 5G.
- **Networking:**
  - Application Load Balancers use service-managed public Elastic IPv4 addresses and can draw from an IPAM pool. "An ALB does not support Elastic IPs" should read "its addresses are assigned by the service"; a static IP per AZ still means an NLB.
  - Inter-AZ data transfer through a transit gateway, PrivateLink interface endpoints and Client VPN has been free since 2022-04-01; data processing is still charged.
  - Gateway endpoints do not allow access from on-premises networks, from peered VPCs in other Regions, or through a transit gateway.
  - API Gateway usage plan throttling and quotas are not hard limits and are applied on a best-effort basis.
- **Storage and databases:**
  - ElastiCache for Valkey has a durability option (Multi-AZ transactional log), and the MemoryDB FAQ recommends ElastiCache for new workloads (re-read).
  - The Aurora guide now says "six storage nodes" with copies across three Availability Zones.
  - S3 Block Public Access also has an organization level.
  - The S3 static-hosting page no longer prints "does not support server-side scripting".
- **Security and identity:**
  - CloudTrail Lake (event data stores) is reported as closed to new customers since 2026-03-31 (one session's reading of the General Reference lifecycle list; no question, drill item or key point uses it).
  - AWS managed KMS keys are a legacy key type, no longer created for new AWS services as of 2021.
  - ACM renews a certificate automatically only when it is DNS-validated; email-validated ones get notices (re-read).
  - Trusted Advisor can display Security Hub CSPM controls.
  - IAM best practices describe an "account access manager" that assigns existing IAM roles to Identity Center users and groups.
- **Monitoring, messaging, cost:**
  - SNS FIFO topics have message archiving and replay (up to 365 days); standard topics do not.
  - CloudWatch Logs allows 5 subscription filters per log group (not adjustable).
  - On-failure destinations of a Lambda event source mapping cover Kinesis, DynamoDB Streams, MSK and self-managed Kafka only.
  - Cost Explorer shows the last 13 months and forecasts 18 months.
