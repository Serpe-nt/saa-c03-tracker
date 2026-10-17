# Article rewrite, session C: `keys/d08.js` – `keys/d14.js`

2026-10-17. Every plan step whose id files in these seven key files was rewritten as an article card, on the pattern of the pilots `c2a`, `d1a1` and `d4b2`: 61 cards, 55 rewritten and 6 new (`d8s1`, `d8e7`, `d9e6`, `d11e7`, `d13e4`, `d13l3`). Each card now has `head`, a `why` that opens on a short scene, `idea`, its own question `q`, and, for a step you carry out, `do` (with `done` on `d8b1` and `d13l2`, the two with something to see).

Facts already on the entries were not looked up again. What is new is listed under "New facts" with the page and the sentence it rests on. Everything else restates a fact that was on the entry, on another card (named below), in the step text and note in `plan.js`, or in the app's own behaviour (`app.js`).

Checks: `node --check` on the seven files, `node --test` (50 of 50 pass), `node tools/similar.mjs 0.30 2000` (no pair with any `card-` question; the 60 pairs it lists are bank against bank). Not done: a look at the cards in a browser (port 8099 was held by another process, and the launch configuration is outside these files), and `tools/links.mjs` (the one new link was fetched and answers a plain 200).

## How the cards are built

- **Domain reviews** (`d8e1`–`d8e4`, `d9e1`–`d9e3`, `d10e1`–`d10e6`, `d11e1`–`d11e5`): read like lectures, so no `do`. The `why` is a scene in which the task statement's problem bites (a key in a public image, a lost AZ, a slow query). The `idea` names the task statement and what it asks. The points are decision rules in story order. Where an earlier card teaches a topic, the point refers to it ("as on Day 5", "from Day 9", "Day 12 showed") instead of teaching it again.
- **Practice, flashcards, SimuLearn, checkpoint, review, logistics and exam-day steps**: steps you carry out, so they get `do`, which carries the step text and its note (score fields: "Enter your score in % in the Scores field below"). The one exception is `d11e7`: its step text holds a link, and `do` allows only `<b>` and `<code>`, so it keeps the step text on screen and has no `do`.
- **Self-checks** (`d8c1`–`d8c3`, `d9c1`–`d9c4`, `d10c1`–`d10c3`, `d11c1`–`d11c3`): the `why` is the scene that makes the services hard to tell apart, the `idea` names each service as the answer to its need (moved out of the old `why`), and the model answer in `extras.js` (not edited) carries the detail. Traps that repeated the new `idea` were cut to what the idea does not say.
- **Questions**: each one is written for its card, in a situation of its own, from the card's facts (or an earlier card's, named in its explanation). Technique cards ask the technique through a real decision where they can (`d8e6`: which note helps after missing the CIDR card; `d10e7`: which deciding word to write down).

## Per card

| Card | What changed |
|---|---|
| `d8s1` | New. Buy one month; do carries the note (billed to the AWS account, 27 of 36 trainings, renews monthly, Day 21 cancels) plus "set the Day 1 monthly budget to the charge plus a few dollars", taken from the `d1d3` note. Two new facts (charge date, 3-day refund). Q: what happens if you do nothing after the exam. |
| `d8e1` | Weight and task statements into `idea`; layer list as a point; new trap from the why (strong control at the wrong layer). Q: unreadable copies → KMS. |
| `d8e2` | Six points kept (Roles Anywhere, IAM database auth and revoking sessions have no other card). MFA folded into "Conditions narrow access", referring to Day 5 (`c2b` has `BoolIfExists`). Revoking sessions moved from the trap into a point, so the trap uses only what the points explain. Q: resource policy keeps the caller's permissions, a role replaces them. |
| `d8e3` | Six points (Network Firewall, DNS Firewall, Traffic Mirroring have no other card). Flow Logs and Traffic Mirroring moved from the trap into a point ("met on Day 4": `d2b4`). "Suricata IPS rules" → "intrusion prevention rules in Suricata format". Q: inspecting packet contents → Traffic Mirroring. |
| `d8e4` | Six points. Envelope encryption, Bucket Keys, rotation and CloudHSM moved out of the trap into "What KMS options do and don't". Object Lock and replication refer to Day 9 (`c4c`). Q: default encryption covers new objects only. |
| `d8e5` | Do from step and note; example phrase as a point. Q: "including the account administrators" → SCP. |
| `d8e6` | Do from the old points; the rule example as the point. Q: which note helps after missing the CIDR flashcard. |
| `d8e7` | New. SimuLearn idea (new fact), do with the note, layer habit from `d8e1`. Q: "no one, not even administrators" may delete logs → Object Lock compliance mode. |
| `d8b1` | Do covers step text, note and where (`AWS_PROFILE=lab`, the `credential_process` fallback, `.gitignore`, destroy). Done: endpoints listed, route to the S3 prefix list (new fact). The two Git points merged. Q: what the `pl-` route is and costs. |
| `d8c1`, `d8c2`, `d8c3` | Idea from the old why and the model answer; trap trimmed (`d8c1`). Qs: identity pool for direct S3 writes; what the external ID protects against; WAF cannot attach to an NLB. |
| `d9e1` | Weight and task statements into idea. Q: the two things to look for in a Domain 2 stem. |
| `d9e2` | Six points: the five kept plus "Take reads off the writer", whose Aurora Auto Scaling and stage-caching facts have no other card that teaches them the same way. Trap: "idempotent consumer" → "a later resend must be safe to process twice". Q: days-long human approval → Standard workflow with `.waitForTaskToken`. |
| `d9e3` | Labels restated; RTO and RPO spelled out in idea. Q: why a read replica is not failover. |
| `d9e4`, `d9e5` | Do from step, note and old points. Qs: which option you strike against RPO 5 min / automatic; what a dead-letter queue protects against. |
| `d9e6` | New, as `d8e7` for Domain 2. Q: checkout must survive a slow payment provider → queue. |
| `d9c1` | Delay and retention moved from the trap into a point; trap keeps the swap of timers. Q: visibility timeout shorter than processing. |
| `d9c2`, `d9c3`, `d9c4` | Ideas from old whys and model answers; `d9c4` trap lost its first sentence (now in idea). Qs: cheapest strategy for 4 h RTO / 1 h RPO (pilot light, whose RPO and RTO the model answer puts in tens of minutes); geolocation with a default record; writes in every Region → global tables. |
| `d10e1` | Q: connections run out at 20% CPU → RDS Proxy (`d10c2`, Day 15). |
| `d10e2` | Express One Zone merged into the transfers point; five points. Q: provisioned IOPS above the instance's EBS limit. |
| `d10e3` | Lambda concurrency point replaced by "Cold starts", referring to the Domain 2 review (`d9e2` has reserved and provisioned concurrency). Q: more memory, more CPU. |
| `d10e4` | Caching strategies dropped (taught on Day 10, `c4f`), the rest of "Cache engine" kept. Q: query by status → global secondary index. |
| `d10e5` | Cache key and Origin Shield merged; Direct Connect encryption and VPN's IPsec dropped (`c6c`, Day 12). Q: CloudFront Functions for viewer-request redirects. |
| `d10e6` | Quick Sight and SPICE dropped (`c8c`, Day 16). Q: throttled producers → more shards, not enhanced fan-out. |
| `d10e7`, `d10e8` | Do from old points. Qs: "large sequential" → st1; EFS with Elastic throughput. |
| `d10e9` | Rewritten as `d8e7` for Domain 3. Q: slow far away and cacheable → CloudFront. |
| `d10c1`, `d10c2`, `d10c3` | Ideas from model answers; traps trimmed where they repeated the idea. Qs: UDP voice with fixed IPs → Global Accelerator; sub-millisecond repeated list → ElastiCache; crawler plus Athena. |
| `d11e1` | Cost allocation tag moved here as a point (it was only in the `d11e2` trap). Q: which option to strike first (One Zone-IA). |
| `d11e2` | S3 File Gateway and DataSync dropped (`c6a`, Day 12). Q: 14-day build logs → Standard with expiry. |
| `d11e3` | The two Savings Plan points merged; "size, OS and tenancy stay flexible" dropped (in the `d11c2` model answer). Q: Spot diversification. |
| `d11e4` | Rarely used instance and backup retention merged. Q: storage-heavy DynamoDB table → Standard-IA table class. The first draft (snapshot and delete a quarterly RDS database) paired with q11-028 at 0.40 and was replaced. |
| `d11e5` | NAT versus gateway endpoint now refers to Day 12 (`d11c3`); VPN/Direct Connect and the Cost and Usage Report merged. Q: private IPs in one AZ. |
| `d11e6` | Second point folded into do. Q: EC2 Instance Savings Plan against a stated move to Lambda. |
| `d11e7` | New, no `do` (see above). Q: batch servers paid around the clock. |
| `d11p1` | Do from step and note; "Answer everything" into do and a point. Q: eight blanks with 20 minutes left. |
| `d11p2` | Idea and do describe the verdict box (`verdictHTML` in `app.js`: GO from 750, borderline 720–749 with 3–4 more days, not yet below 720 with a week, weakest domain from the Domain Practice scores). Q: compensatory scoring with a weak Domain 1. |
| `d11b1` | Do from step, note and the ESL point. Q: cancelling 15 hours before. |
| `d11c1`, `d11c2`, `d11c3` | Ideas from model answers; traps trimmed. `d11c3`'s trap is new on the card: the NAT per-GB charge applies to S3 and DynamoDB traffic in the same Region, from the `d11c3` model answer. Qs: Glacier Instant Retrieval; zonal RI reserves capacity; SQS needs an interface endpoint. |
| `d12e1`–`d12e4` | Old points into do; a reason as the remaining point. Qs: misread against gap (MSK); points at risk (weight × miss rate); NAT gateway overnight; one timed block, reviewed at once. |
| `d13e1`–`d13e3` | Old points into do. Qs: when a flashcard counts as known; 13 of 18 count; an in-scope service you can't describe (Comprehend: one sentence, using the `r1a` note that questions ask which service fits a need). |
| `d13e4` | New, no `do` (a short training to watch). Q: Day 21's "no new topics" rule. |
| `d13l1` | "Name must match" into do. Q: which ID passes an online check-in. |
| `d13l2` | Do lists what to check (EC2 with volumes and Elastic IPs, NAT gateways, RDS: from the `d7h2` note and the points); done added. Why uses the `d1d3` note (the zero spend budget goes quiet). Q: a stopped instance with an Elastic IP. |
| `d13l3` | New. Do from step and note. Point: the Day 1 monthly budget sits above the charge (from `d1d3`), so a renewal sends no alert. Q: what cancelling ten days early does. |
| `d14e1`–`d14e3` | Old points into do. Qs: the morning before an online exam; two working options → the qualifier; where the 50% voucher is. |

## New facts

| Card | Fact | Page and sentence |
|---|---|---|
| `d8s1` | The charge is billed to the AWS account on the start date, then at each renewal; it renews automatically unless cancelled. | https://aws.amazon.com/training/faqs/ — "The individual subscription (monthly or annual) charge will be billed to your AWS account on your subscription start date." and "The subscription automatically renews at the selected subscription term cadence (monthly or yearly) unless cancelled by the subscriber." |
| `d8s1`, `d13l3` (q) | Within 3 calendar days of the first purchase: immediate cancellation and a full refund; after that, cancelling stops the next renewal. | Same page — "You have 3 calendar days from the date you initially purchase the subscription to submit a request for immediate cancelation and a full refund of any subscription fees charged. After that, you can cancel the renewal of your subscription on the next billing cycle at any time." |
| `d13l3` | Subscriptions Management → Cancel Subscription; access to paid content until the end of the current billing period (also in the step's note). | Same page — "To cancel your subscription, log into your Skill Builder learner account and go to your Subscriptions Management page, then select Cancel Subscription . You will continue to have access to paid subscription content through the end of your current billing period." |
| `d8e7`, `d9e6`, `d10e9`, `d11e7` | AWS SimuLearn: a conversation with an AI-powered virtual customer to gather requirements, then a build in a live AWS environment. | https://aws.amazon.com/training/digital/immersive-learning/ (the old `/aws-simulearn/` page redirects here) — "Start with AI-powered customer conversations where you practice gathering requirements and handling objections, then transition into live AWS environments to build the solutions you just discussed." That it runs in a temporary sandbox and not in the owner's account is the step's note in `plan.js`. |
| `d8b1` (done) | Each private route table gets a route that sends traffic for the S3 prefix list to the gateway endpoint; the console lists endpoints under VPC → Endpoints. | https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html — "Each subnet route table must have a route that sends traffic destined for the service to the gateway endpoint using the prefix list for the service." https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html — "In the navigation pane, choose Endpoints ." |
| `d11e1` (q) | S3 Standard-IA and Glacier Instant Retrieval keep data across AZs. | https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html — "S3 Standard-IA objects are resilient to the loss of an Availability Zone." and the table row for S3 Glacier Instant Retrieval, Availability Zones ">= 3". |

New `docs` link: `d8e7`, `d9e6`, `d10e9` and `d11e7` cite the immersive-learning page (fetched, plain 200). `d8s1` and `d13l3` cite the Training FAQs, already linked from `d1a2`. No new `DOCS` key was needed: every card question uses an existing one or none.

## Unsure

- **Tags on exam-technique questions.** Most Exam Prep steps have no `STEP_TAGS`, and `QTAGS` has no tag for exam technique. Where a question could carry a real decision, it does, and its tag is that decision's topic. Ten pure exam-mechanics questions have no fitting tag and carry `Well-Architected` as the nearest one: `d11p1`, `d11p2`, `d12e2`, `d12e4`, `d13e2`, `d13e4`, `d13l1`, `d14e1`, `d14e2`, `d14e3` (all `dom: 1`). A miss on them will count against the Well-Architected topic, and the Day 20 "weak" quiz may then draw Well-Architected questions. `d8s1`, `d11b1` and `d13l3` (subscription and exam fee) use `Cost management tools` for the same reason. An "Exam technique" tag would need `meta.js` and a `STEP_TAGS` entry, which are outside these files. Worth deciding at merge.
- **`d8s1` why**: "Later in the plan you open the next lab, and Skill Builder will not start it without a subscription." Rests on the plan's own marking (every lab up to Day 5 is noted "Free", most from Day 7 on are not) and the note's "27 of the 36 trainings … need it"; not checked on Skill Builder.
- **`d8s1` do 2 and `d13l3`'s point**: the timing of the charge under Bills, and that the monthly budget sits above it, follow the `d1d3` note; how the charge is labelled on the bill is still unknown (see "The move to the Paid plan" in `keypoints.md`).
- **`d8b1` do**: written from the docs and the plan, not tried. It rebuilds the Day 4 VPC with its NAT gateway, as the step says; with the endpoints in place the NAT gateway is not needed for S3 or Session Manager, so leaving it out would be cheaper, but that would change the step.
- **`d9c2` question**: pilot light keyed for "down up to four hours, lose up to an hour of orders". The model answer gives pilot light "RPO and RTO in tens of minutes", which fits both limits; the whitepaper's figures are a figure, not text (see `keypoints.md`).
- **`d11c3` trap and `d11e5`**: "a NAT gateway bills per GB" for S3 and DynamoDB in the same Region rests on the `d11c3` model answer, not on a page fetched here.
- **`d11e3` question**: "more pools of spare capacity" paraphrases the point's "several instance types and AZs"; the term "capacity pool" itself was not looked up.
- **Framing with no source by nature**: every opening scene (a key in a public image, a 3 a.m. AZ loss, a flash sale, scanners finding an open port "within days", Sydney users waiting on Ireland, a voucher of 50% found three weeks later), study technique (recall against recognition, reviewing a block at once, the missed pile), and the morning-of-the-exam advice.
- **App behaviour described on cards**: `d11p2`'s thresholds and advice are copied from `verdictHTML`; if those change, the card must follow. `d14e1` and `d12e3` name the notebook and the weak spots view, which those days open through their `tools`.
