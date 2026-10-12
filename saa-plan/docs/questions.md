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

All content was written on 2026-10-12 by AI writer agents working from this guide. All of it was fact-checked the same day by separate reviewer agents. They used web search on AWS sources; direct fetches of aws.amazon.com/docs.aws.amazon.com are blocked in the build sandbox, so they relied on search results. No reviewer changed an answer key; they corrected many explanations and stems (see git history `8f11bb3..9c604c8`).

Later, near-duplicates across pools were rewritten so retakes and mocks stay fresh. Web search was exhausted by then, so these 90 questions were reviewed by a second agent **from model knowledge only** (no web check). Uncertain facts were worded around rather than asserted. They are the first candidates for a web-verified pass:

- Day pools (36): q04-025, q04-034, q05-004, q05-014, q05-025, q06-033, q08-002, q08-003, q08-004, q08-007, q08-008, q08-015, q08-024, q08-025, q08-027, q08-029, q08-037, q09-018, q09-027, q09-029, q09-039, q09-048, q09-049, q10-004, q10-008, q10-015, q10-016, q10-025, q10-027, q10-036, q10-039, q10-046, q11-003, q11-022, q11-037, q11-049.
- Mock set 1 (29): m1-001, m1-003, m1-004, m1-005, m1-008, m1-011, m1-013, m1-016, m1-017, m1-020, m1-021, m1-026, m1-027, m1-029, m1-032, m1-033, m1-034, m1-035, m1-036, m1-037, m1-038, m1-043, m1-044, m1-046, m1-048, m1-050, m1-051, m1-056, m1-062.
- Mock set 2 (25): m2-001, m2-004, m2-005, m2-006, m2-008, m2-011, m2-014, m2-015, m2-022, m2-023, m2-027, m2-028, m2-031, m2-040, m2-043, m2-045, m2-046, m2-050, m2-052, m2-053, m2-055, m2-059, m2-063, m2-064, m2-065.

Doubts the reviewers flagged and couldn't settle:
- **Organization conformance packs (m2-046):** whether they deploy automatically to accounts that join later.
- **Local Zone GPUs (m2-064):** which Local Zones offer GPU instances.
- **Rekognition (m2-050):** whether it works directly on Kinesis Video Streams.
- **Firehose (q10-039):** whether dynamic partitioning can only be enabled when the stream is created.
- **S3 encryption change (q08-003):** whether S3 now has an in-place encryption change API.
- **Shield Response Team plans:** whether the new Business Support+ plan qualifies (docs name Business/Enterprise).
- **Closures (m1-026, m1-038):** whether Amazon AppFlow and Amazon Detective are still open to new customers.

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
