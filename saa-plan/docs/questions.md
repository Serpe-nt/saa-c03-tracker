# Question bank: authoring, checking, status

The quizzes exist to turn "I watched it" into "I can answer a scenario question about it". The learner must score 27/30 to complete a day, reads an explanation after every answer, and is sent back to a specific plan step when wrong. A wrong key or explanation teaches something false, so content quality matters more than quantity.

## What is in the bank

| File | Ids | Count | Used by |
|---|---|---|---|
| `site/quiz/d01.js` … `d06.js`, `d08.js` … `d11.js` | `q01-001` … `q11-050` | 50 per file | that day's quiz; Day 7 (Days 1–6), Day 12 (weak topics), Day 13 (all, exam-weighted), warm-up/review; the mock once mock questions run out |
| `site/quiz/mock1.js`, `mock2.js` | `m1-001` … `m2-065` | 65 per file, each split 20/17/15/13 by domain | mock exam only |
| `site/quiz/meta.js` | — | — | `QUIZ` array, `QTAGS` (allowed tags), `DOCS` (AWS FAQ links) |
| `site/extras.js` | — | 32 cards, 171 drill items, 45 cues | self-check model answers, "Which service?" drill, exam-wording cheat sheet |

Days 7, 12, 13 have no file of their own: `qcore.js` builds their quizzes from the day pools. Day 14 (exam day) has no quiz.

Why 50 per day: a quiz takes 30, so a first retake can be 20 unseen questions plus the earlier misses. Selection order is "never seen → wrong last time → seen longest ago" (`QZ.rank`). Option order is shuffled per run.

## Format

```js
{id:"q02-017", day:2, dom:1, tags:["Security groups & NACLs"],
 q:"Scenario … Which solution meets these requirements?",        // "(Choose two.)" at the end for multiple response
 o:["…","…","…","…"],                                             // 4 options, or exactly 5 for Choose two
 a:[2],                                                           // 0-based keyed option(s): 1, or 2 for Choose two
 x:["why A is wrong","…","why C is right","…"],                   // one explanation per option, same order
 ref:["d2w1","d2b4"],                                             // plan item ids, that day or earlier (mock: any)
 doc:"vpc"}                                                       // optional key in DOCS
```

- `id`: file prefix + 3-digit sequence. Ids key the learner's stats, review queue and notebook: never rename or reuse. Fix a question in place (same id). To retire one, delete it; the app drops unknown ids from saved runs.
- `dom`: exam domain the question mainly tests: 1 Secure, 2 Resilient, 3 High-performing, 4 Cost-optimized.
- `tags`: 1–2 strings copied exactly from `QTAGS`. The weak-spot map groups by them. Add a tag to `QTAGS` only if no existing one fits.
- `ref`: where to go back to study. The page sorts refs for display: Watch/Exam prep first, then Play, Build, Self-check, Setup (`REF_ORDER` in `app.js`), so the Skill Builder step shows first. Each ref shows the step's "Where:" path and Open link. Day 8–11 and mock questions should lead with the Exam Prep Plan task item (`d8e2` Task 1.1 … `d11e5` Task 4.4).
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
- Difficulty: Days 1–6 associate foundations (some short concept checks, mostly 2–4 sentence scenarios); Days 8–11 and mocks full exam level (3–6 sentences, several requirements, plausible partly-right distractors).
- Avoid volatile numbers (prices, most quotas). Stable limits are fine; see "AWS changes" below for limits that moved recently.
- Never key an answer on a retired or closed-to-new-customers service (list below). `tests/data.test.mjs` checks the common names in keyed options.
- Use current service names. Where the exam guide still uses an older name, write "new name (formerly old name)" once in the explanation.
- One question = one decision. Before adding, grep the bank for the concept and run `node tools/similar.mjs` afterwards.

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
5. First ref is the step that teaches the concept; refs from that day or earlier.
6. `doc` key exists and fits.

## Verification status (as of 2026-10-12)

**History.** All content was written on 2026-10-12 by AI writer agents working from this guide, and reviewed the same day by separate reviewer agents inside a cloud sandbox where aws.amazon.com and docs.aws.amazon.com were blocked. They worked from web-search snippets, and 90 late rewrites were reviewed from model knowledge only.

**Second pass, against the pages themselves.** Later on 2026-10-12 the whole bank was re-checked on the owner's PC, where both sites can be fetched. Seven agent sessions each took their own files and read every entry against pages fetched from `docs.aws.amazon.com` and `aws.amazon.com` (a fact counted as confirmed only when the sentence was found in the page text). Their logs, with one line and a source URL per change, are in `docs/verification/`.

| Part | Checked | Changed | Answer keys changed | Log |
|---|---|---|---|---|
| `d01.js`–`d03.js` | 150 of 150 | 13 | 0 | `verification/d01-d03.md` |
| `d04.js`–`d06.js` | 150 of 150 | 5 | 0 | `verification/d04-d06.md` |
| `d08.js`, `d09.js` | 100 of 100 | 8 | 0 | `verification/d08-d09.md` |
| `d10.js`, `d11.js` | 100 of 100 | 18 | 0 | `verification/d10-d11.md` |
| `mock1.js` | 65 of 65 | 3 | 0 | `verification/mock1.md` |
| `mock2.js` | 65 of 65 | 11 | 0 | `verification/mock2.md` |
| `extras.js` and the glossary | 335 of 335 | 32 (11 model answers, 9 glossary terms, 9 drill items, 3 cues) | n/a | `verification/extras.md` |

All 90 formerly knowledge-only questions are covered by this pass. No answer key changed; in m2-050 the keyed option was reworded (same index) because it relied on a feature closed to new customers, and q08-003 now keys the current S3 operation and names the older one in its explanation.

What this pass was: one read by an AI agent per file, on one day. It was not a review by a human AWS expert, and most entries had no second, independent read.

**Doubts from the first pass, now settled:**
- Organization conformance packs do deploy to accounts that join later (m2-046).
- The Los Angeles Local Zone lists GPU instances (m2-064).
- Rekognition does work on Kinesis video streams, but that feature is closed to new customers (m2-050, rewritten).
- Firehose dynamic partitioning can only be enabled when the stream is created (q10-039).
- S3 has an in-place encryption change, `UpdateObjectEncryption` (q08-003).
- Amazon AppFlow and Amazon Detective are on none of AWS's lifecycle lists, so both are open to new customers (m1-026, m1-038).

**Still not confirmed** (details per question in the logs):
- **Price comparisons.** AWS pricing pages load their figures by script, so statements such as "A costs less than B" were checked only as far as AWS says them in words (for example q03-001, q03-004, q11-002, q11-018, q11-042, m1-024, m2-051, card `d11c3`).
- **Lead times.** That Direct Connect takes weeks and a VPN hours (q02-037, q02-043, q10-038, q11-044, q11-047) is not stated on any page fetched.
- **AWS pages that disagree.** S3 Replication Time Control: the SLA says 99.9%, the FAQ's design target 99.99% (q09-033, m1-061 no longer depends on the number). Aurora Global Database recovery time: minutes in the user guide, under a minute on the product page.
- **Shield Response Team plans.** The Shield docs still name Business or Enterprise Support and not Business Support+ (q04-045 says "Business-tier or higher").
- **What a wrong option cannot do.** Explanations that say a distractor service lacks a feature were checked for plausibility against the service overview, not against a page that states the absence.
- **Inferred, not quoted:** q01-029, q02-002, q05-016, q09-043, m2-014, m2-016, m2-022 and the items listed as such in the logs.
- **Refs to Skill Builder steps.** `ref` ids were checked to exist and to fit the step titles in plan.js; the lessons behind them need a login and were never opened.
- **Names the exam may still print.** The bank uses current names ("Aurora serverless", AWS Transform MGN, Security Hub CSPM) with the older one in an explanation; exam items written earlier may show only the old name.
- **AWS Data Transfer Terminal** is available only to Enterprise Support customers at this time; drill item 48 and one cue name it with that caveat because Snowball Edge is closed.

The wording of each affected question avoids depending on these, but verify before building on them.

## Skill Builder and AWS links

- Refs point at plan steps (Essentials modules, Cloud Quest assignments, Exam Prep Plan tasks, own builds). Skill Builder needs a login, so lesson titles inside a module were never verified. Lesson-level pointers are possible if the owner pastes a module's lesson list.
- Shared responsibility questions on Day 1 (q01-048–050) reference Module 1 (d1w1). Third-party listings of the 13-module Essentials course show a shared-responsibility lesson in Module 1; Skill Builder itself couldn't be opened.
- `DOCS` holds only stable FAQ/overview URLs on aws.amazon.com and docs.aws.amazon.com. All 61 were fetched on 2026-10-12 from the owner's PC with `node tools/links.mjs` and answer a plain 200; the Aurora FAQ had moved to docs.aws.amazon.com and was repointed. Re-run the tool after adding a link.

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
  - A Free plan account is upgraded to the Paid plan when it creates or joins an AWS Organization, which enabling an organization instance of IAM Identity Center does in a standalone account. The plan therefore keeps the account out of Organizations.
  - AWS is rolling out a new sign-up ("Sign up for AWS (new)") to a limited number of customers: a Google, GitHub, Apple or Amazon login, projects and AWS Settings. IAM users with console access can't be created in it.
