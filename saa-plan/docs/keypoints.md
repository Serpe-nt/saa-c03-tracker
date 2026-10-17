# Key points per step: authoring, checking, status

Each plan step is shown alone on a card. Under the step text the card shows "Key points": what to take away from the step, and the trap the exam sets on that topic. The learner reads them right before doing the step and again when a quiz question sends them back to it. A wrong sentence here is studied as fact, so the rules are the same as for the question bank: verify, don't guess.

## Where it lives

| File | Holds |
|---|---|
| `site/keys/*.js` | `window.KEYS`, keyed by plan item id. The file follows the id: `dNN.js` holds ids that start with `dN` (steps kept from the 14-day plan, wherever they sit now), `cN.js` holds lecture course N (`cNa`…) and its labs (`lNa`…), `r1.js` the reading block |
| `site/app.js` → `stepCardHTML` | renders the box, then "AWS docs", "Exam topics", "Terms", "Exam wording" |
| `tests/data.test.mjs` | shape, ids, markup, coverage, closed-service wording |
| `tools/links.mjs` | every `docs` URL (and every `DOCS` URL) answers a plain 200 |

182 of the 196 steps have an entry. The fourteen without one are pure admin: `d8s1` (buy the subscription), `s0a`, `s0b` and `d1e3` (enrolling), `d1a3`, `d1a4`, `d1d2`, `d4s1`, `t1g` (the Technical Essentials assessment), `d8e7`, `d9e6`, `d11e7` (the Domain Practice labs), `d13e4` and `d13l3` (cancel the renewal).

## Format

```js
// Key points per plan step for … Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c1d: {
    head: "Public and private subnets in your own network",                  // the article's headline: 8–80 characters, plain text
    why: "Some of your servers must be reachable from the internet and others must never be.",   // the problem: 80–420 characters
    idea: "Amazon VPC gives you a private network in AWS, and its subnets decide …",               // the answer to it: 40–300 characters
    do: ["VPC → <b>Create VPC</b> → …", "…"],                                     // a step you carry out: 1–8 actions, 10–240 characters each
    done: "What you see when it worked …",                                        // with do: 20–260 characters
    k: [
      ["Public or private", "A subnet is public when its route table has a route to an internet gateway, and private when it has none. …"],
      ["NAT gateway", "Lets instances in a private subnet connect out, while external services cannot start a connection to them."]
    ],                                                                           // up to 6 points: [label, text]
    trap: "How the exam tries to catch you on this topic.",                      // optional, 40–280 characters
    docs: [["Page title", "https://docs.aws.amazon.com/…"]]                      // optional, at most 3
  }
});
```

- **The card reads like an article** (the owner reads every card top to bottom before going on): the block line, the course name, the `head`line, where to do it with its Open button, the lesson names, then the body: **Why it exists** (`why`, then `idea`, in one box), **Do it** (`do`, then `done`), the model answer of a self-check, **What to know** (`k`), the **Exam trap**, and the step's notes at the end. Exam topics, practice, look-alikes, exam wording, AWS docs and terms are in the sidebar: reference, not part of the read.
- `why` is the first explanation on the card, before every detail: the problem the thing was made to solve, the context, or the need it answers. Required on every entry. Where to do it sits above it, next to the title: it is where the step happens, not an explanation.
- `head`, `idea`, `do`, `done` belong to a rewritten card (see "The article rewrite" below); an entry without `head` shows the step text from plan.js as its title, as before. `head`: the topic in plain words, or for a step you carry out its goal ("Let an EC2 instance read S3 without an access key"). The step text then moves under it as "In this lecture: …" (the lesson names after the course's "→"), or, when there is `do`, into the numbered actions, together with the step's note: so `do` must say everything the step text and its note said. `done`: what you can see when it worked, only where there is something to see.
- `k`: each point is `[label, text]`. The label (2–40 characters, no closing full stop or colon) is what the eye scans for: a service, a choice, a rule. The text is 40–260 characters.
- Key: a plan item id; the file is fixed by the id's prefix (see above; `data.test.mjs` checks it). An entry needs `k` or `trap`.
- `docs`: only `https://aws.amazon.com/…` or `https://docs.aws.amazon.com/…`, and only pages that were fetched while writing the entry.
- Markup: plain text plus `<b>` and `<code>`. Write a literal `<` as `&lt;`.

What the card adds by itself, with no authoring: exam topics are the step's `STEP_TAGS` (plan.js), AWS pages come from the quiz questions on those topics (`DOCS` keys), terms come from `GLOSSARY` matches in the step text and its key points, and exam wording comes from `CUE_TAGS` (extras.js) for the step's topics.

## Writing rules

### Purpose first (the owner's rule)

The owner asked for this in their own words: "When explaining a concept, tool, invention, or idea, always start by describing the problem it was designed to solve, the context that led to its creation, or the need it addresses. Explain the purpose first before diving into details, mechanisms, or technical aspects." And: clearly structured, easy to follow.

- **`why`: two or three short sentences in plain words.** Start from the problem a person would have without the thing ("A private server still has to reach out, while nothing outside may reach in"). Then name the thing as the answer. No numbers, no option names, no detail: that is what the points are for. For a step that is a task rather than a concept (setup, an exam-technique step), say what goes wrong without it.
- **Each point also leads with purpose.** Say what the thing is for or when you reach for it, then how it works. "NAT gateway: lets instances in a private subnet connect out, …" and not "A NAT gateway is a managed NAT service that …".
- **One idea per sentence, short sentences.** Aim for 22 words or fewer. No chains held together by semicolons. Split a dense point into two labelled points instead.
- **Plain words.** Write the way you would explain it to a colleague who is new to AWS. Spell out an abbreviation the first time on a card unless it is the service's everyday name (VPC, S3, IAM).
- **Self-check steps:** the entry's `why` says why the things must be told apart (the need each one answers). The model answer in `CARDS` (extras.js) opens with a `<b>Why …:</b>` line, then gives one `<b>Name</b>` paragraph per thing (what it is for first, then how it works), then a `<b>Pick:</b>` line with the decision rule. `<br>` between paragraphs.
- **Restructure, do not re-research.** The facts in the entries were checked against AWS pages (see "Verification status"). Keep each fact's meaning; splitting, reordering and simpler wording are the job. A new factual claim (most often in `why`) needs an AWS page that says it: look first in the pages the entry's `docs` already cite. A framing sentence (what would go wrong, a comparison with a data center) needs no page but must hold by plain reasoning.
- `data.test.mjs` checks the shape, and that every entry has a `why` and every model answer opens with its Why line.

### The article rewrite (from 2026-10-17)

Every card gets `head` and `idea`, and steps you carry out get `do` and `done`, card by card, with the pilots `c2a`, `d4b2` and `d1a1` as the pattern:

- **`why` is the problem, `idea` the answer.** Move the sentence that names the thing as the answer out of `why` into `idea`. Together they read as one: the problem first, then the idea.
- **Labels say what the point says**, as a plain statement or a question ("What always stays yours", "Who may use the role"), never a teaser ("The line moves").
- **Points in story order:** from the need to the mechanism to the exam detail. On `d4b2`: who may use the role, how EC2 gets it, the credentials it receives, how to guard them.
- **Nothing unexplained.** No term or service on a card that the card doesn't explain or the glossary doesn't hold, and nothing new in the trap: the trap uses only what the points said.
- **Concise:** at most 5 points as a rule (6 when a topic has no other card), no sentence that repeats another part of the card.
- **Accurate:** restating needs no new source, but `do` and `done` are instructions the owner will follow in the console: each must hold for the step as the plan sets it up (the previous steps, the policies they create). Writing the pilots found two gaps that way: the role in `d4b2` also needs `AmazonSSMManagedInstanceCore` for Session Manager to connect, and the bucket policy from `d4b1` allows `s3:GetObject` only, so the test is `aws s3 cp …/hello.txt -`, not `aws s3 ls`. And the Security pillar has seven design principles; the old point listed six.
- **Teach it like a teacher** (the owner's words: "Imagine yourself as a teacher that teaches me"). `why` opens the problem as a short scene, one or two sentences in which it bites ("A script on your EC2 instance has to read files from a bucket. The quick fix is to paste an access key …"), then says the need in one plain sentence. A scene is framing: it needs no source, but it must be something that really happens, and it must not slip in a fact the card doesn't back.
- **One question per card** (`q`), on every card, setup and admin steps included (there the question is about safety, cost or exam technique). See "The card's one question" in `questions.md` for the rules.
- Points can be reordered freely: "Test me", whose marks were kept by point position, is gone.

### The rest

- Each point is a fact or a decision rule ("X when Y, because Z"). Never "understand X" or "know the difference".
- Cover what the bank's questions on the step's topics decide on: read the questions tagged with the step's `STEP_TAGS` first.
- The same topic returns on several days (a Fundamentals lecture, a lab, a design course, an Exam Prep review). Build on what the earlier step's points say instead of repeating them: basics first, trade-offs and decision rules later.
- By step type:
  - **Watch** (lecture chunks, reading steps) and Exam Prep **task statements**: 3–6 points and a trap. A "putting it all together" chunk gets points on how the pieces fit and which requirement decides each choice.
  - **Play** and **Build**: 2–4 points on what to notice while doing it.
  - **Self-check**: the model answer is in `CARDS`, so the entry gives the `why`, the trap and docs; add a point only for something the quiz tests that the card lacks.
  - **Setup** and admin steps: an entry only for a real exam fact, a cost fact or a safety tip.
- Don't repeat the step's own note from plan.js.
- No volatile numbers (prices, most quotas). Stable limits that decide exam answers are fine.
- Current service names; a closed or retired service may be named only with its status (see "AWS changes" in `questions.md`).
- Nothing about what a lecture shows: the videos are behind a login and nobody has watched them; the lesson names in plan.js are all we know. A lab's public description page (the link in the step) may be used to choose what to point out, when it could be read.

## Checks to run after an edit

```
node --test              # shape, ids, markup, coverage of Watch/Play/Build/Self-check steps, closed-service wording
node tools/links.mjs     # needs network; a redirect counts as broken (docs.aws.amazon.com redirects missing pages to the guide's landing page)
```

## Verification status (as of 2026-10-13)

### AWS Technical Essentials (2026-10-13)

Six entries in `t1.js` (`t1a`–`t1f`), one per module of the course, written by the main session at beginner level. The course page and both outline pages were read on Skill Builder that day (free, 4 hours, level Fundamental, "No prior cloud computing or AWS experience is required"); the videos were not watched.

- **Facts reused** from entries checked earlier: `c1c` (Regions, Availability Zones, shared responsibility), `c2b` (root user, IAM), `c1d` (VPC, subnets, firewalls), `c1e` (Fargate, Lambda), `c4a` (what a container packages), `c1f` (storage and databases), `c3d` and `c3e` (CloudWatch, load balancing, Auto Scaling), and the model answer `d2c1`.
- **New facts, each from a page fetched that day:** cloud computing as "the on-demand delivery of IT resources over the Internet with pay-as-you-go pricing" (https://aws.amazon.com/what-is-cloud-computing/); the console, the CLI and the SDKs (https://docs.aws.amazon.com/whitepapers/latest/aws-overview/accessing-aws-services.html); billing by instance state, including "billed for each second, with a one-minute minimum" and that EBS volumes and Elastic IP addresses "incur charges regardless of the instance's state" (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html).
- **Framing, no source by nature:** the "Choosing" points in `t1b`, `t1d` and `t1e` (they restate the points above them as a rule), and the opening of each `why`.
- No second read.

### The move to the Paid plan (2026-10-13)

The owner could not buy the Skill Builder subscription with a Free plan account and upgraded. Changed for it, each new fact found on a page fetched that day:

- `d1a2` (choose the Paid plan), the order of Day 1 (the account before the subscription), `d8s1` and the new `d13l3` (cancel the renewal): the Individual subscription "will be billed to your AWS account", renews until cancelled, and after cancelling access runs to the end of the billing period (https://aws.amazon.com/training/faqs/). What the Paid plan changes, the credits and the upgrade path: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html.
- New `d1d3` (a monthly cost budget above the subscription): "Actual alerts are only sent out once per budget, per budget period" and billing data "is updated at least once per day" (https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-best-practices.html); the template texts (https://docs.aws.amazon.com/cost-management/latest/userguide/budget-templates.html).
- `d1c1`: IAM Identity Center "is offered at no extra charge" (https://aws.amazon.com/iam/identity-center/faqs/).
- **Not stated on a page:** that a Free plan account cannot buy the Individual subscription. That is what the owner found. The Billing guide only says that Free plan accounts incur no charges and that buying a Team subscription upgrades an account automatically.
- **Not known:** whether sign-up credits pay for the subscription, and how its charge is labelled on the bill. `d1d3` therefore tells the owner to read the charge under Bills and set the budget from it.

### The purpose-first rewrite (2026-10-13)

The owner found the cards hard to follow and asked that every explanation start with the problem the thing was made to solve. All 175 entries were restructured: a `why` first, the points as `[label, text]` (627 in all), sentences shortened to an average of 13 words. The 32 model answers in `CARDS` now open with a Why line and close with a Pick line. Three entries were written as the pattern (`c1d`, `d2b1`, `d2c1`); three sessions did the rest, one group of files each.

- **It was a restructuring, not new research.** The facts in the points and traps are the ones checked earlier (below); the sessions were told not to look them up again, to keep each fact's meaning and to drop nothing an exam question turns on. Session C reports no fact left out; thirteen domain-review entries sit at the six-point limit and a few of their points still hold two ideas.
- **New factual claims** are almost all in a `why`, and each was found on a page the entry already cites (ten pages fetched in all): listed with their URLs in `docs/verification/why-b.md` and `why-c.md`. Session A added none: where it carried a fact from one entry to another, `why-a.md` says from where.
- **Framing sentences** (what goes wrong without the thing, a comparison with your own data center, study technique) have no AWS source by nature. The ones their writers were less than sure of are listed in each log under "Framing sentences".
- No second read was done on this pass, to keep it cheap. `data.test.mjs` checks the shape of every entry and that none lacks its `why`.

### Steps new with the 21-day plan

The key points for the lecture chunks, the labs and the reading block (Day 17) were written on 2026-10-12 by four sessions, one group of courses each, on separate branches. Each looked every sentence up on AWS pages it fetched (redirects not followed), read the bank's questions on the step's topics first, and then had sub-agents that had not seen its sources re-check every sentence against pages they fetched themselves.

| Files | Steps | Entries | Second read | Log in `docs/verification/` |
|---|---|---|---|---|
| `c1.js`, `c2.js` | Fundamentals of Architecting, Fundamentals of Security, their 7 labs | 15 | no sentence wrong; 4 reworded | `keys-c1-c2.md` |
| `c3.js`, `c4.js` | Three-Tier and Containerized courses, their 7 labs | 19 | 1 sentence wrong, 9 too strong: 10 sentences and 3 link titles corrected | `keys-c3-c4.md` |
| `c5.js`, `c6.js`, `r1.js` | Compliant/Secure/Governed and Hybrid courses, their 4 labs, the reading block | 18 | no sentence wrong; 13 narrower on the page than in the file, reworded | `keys-c5-c6-r1.md` |
| `c7.js`, `c8.js`, `c9.js` | Serverless, Data-Driven and Summary courses, their 8 labs | 18 | no sentence wrong; 10 partly supported, reworded or listed as inference; 7 link titles corrected | `keys-c7-c9.md` |

What these entries rest on, and what they do not:
- **Lectures were not watched.** The videos are behind the Skill Builder login. A lecture step's points follow the lesson names in plan.js and the step's topics, checked against AWS documentation; they do not claim what a video says. If a lesson turns out to teach something else, the points are still true but may miss the lesson's emphasis.
- **Lab description pages were read** (they are public): description, objectives and the list of AWS services. Lab points are about those objectives; none describes a lab's screens or steps. Nobody has done a lab.
- **Inferences** (framing, design advice, conclusions from two documented facts) are listed per file in each log under "Inferences".
- **`STEP_TAGS` for the labs** were corrected from those description pages after the merge (for example `l5a` is AWS Config only, `l6b` is endpoints and Route 53 forwarding rules, `l3a` is a serverless single-page app debugged with CloudWatch Logs). Lecture steps keep the topics their lesson names suggest.
- One read each by AI agents plus one independent re-read: not a review by a human AWS expert.

### Steps kept from the 14-day plan

The text below describes the entries written for the 14-day plan. 45 of those entries belonged to steps that the 21-day plan retired (the Cloud Practitioner Essentials modules, the Cloud Quest assignments and most own builds) and were removed; where a list below names such a step (`d1w3`, `d5b3`, `d9b2`, `d10b2`, `d6w3`, `d6p1`, `d2p2`…), the entry is in git history (commit `add330b`) and several of its checked sentences live on in the new entries.

**Written** on 2026-10-12 by five writer agents, one group of days each, on the owner's PC where `aws.amazon.com` and `docs.aws.amazon.com` can be fetched directly. Each writer checked its statements against fetched AWS pages and cited only pages it fetched. The entries for `d1u1`–`d1u4` and the rewritten `d4s2` were added the same day with the Free-plan change.

**Second read** the same day by two fresh sessions that had not written the entries. Each sentence in `k` and `trap` was looked up on a fetched page (redirects not followed) and counted as confirmed only when it was found in the page text; a sentence that could not be found was reworded to what the page says, or removed. Links were checked to be pages that support the entry.

| Days | Entries read | Changed | Log in `docs/verification/` |
|---|---|---|---|
| 1–7 | 91 of 91 | 69 entries: 87 sentences changed, added or removed; 39 links added, swapped or retitled | `pass2-keys-d01-d07.md` |
| 8–14 | 60 of 60 | 16 sentences changed, 2 links | `pass2-keys-d08-d14.md` |

The sentences the writers had marked as inferred were each sourced, reworded or removed; the logs say which, per day. After the second read the data tests pass and every cited link answers a plain 200.

What this was: two reads by AI agents on one day, not a review by a human AWS expert.

**Still uncertain** (details and sources in the logs):
- **Never tried in a real account:** the IAM admin user block (`d1u1`–`d1u4`), `aws login --profile lab` (`d4s2`), `aws sts assume-role` from that profile (`d4b3`), and what the "VPC and more" wizard builds (`d2b1`, `d5b1`). Console labels were checked in the docs, not in a console.
- **Credits after a Free plan upgrade** (`d1a2`): AWS's pages disagree. The Billing guide ("Choosing a plan") says remaining credits are applied to future bills automatically, and `d1a2` follows it; the Identity Center page says free tier credits expire immediately when an organization is created. The owner upgraded on 2026-10-13: the Credits page of their account is the answer for them.
- **Exam-framing sentences** (which option is the usual distractor, what a phrase in a stem "means") have no AWS source by nature; the facts inside them were checked.
- **Conclusions from two documented facts:** `d1w3` k5 (kernel modules or OS-level agents point to EC2), `d1w1` k3, `d1w4` k5 (arithmetic), `d5b3` k3 (design advice that q05-009 keys on), `d9b2` k1, `d10e5` trap ("never an S3 bucket" is the complement of the endpoint list), `d11p2` k1.
- **Historical or indirect sources:** the basic cost drivers in `d6w3` and `d6p1` come from a whitepaper AWS marks as historical; `d2c3` k2 and `d2p2` k4 rest on a 2024 whitepaper; the RPO and RTO ranges in `d9e3` are in a figure, not in text; `d8e2` k1 and `d8e3` k2 use policy examples that are no longer on a docs page; `d10b2` k3 ("Init Duration in the REPORT log line") was not found.
- **Left alone by the owner's decision:** price comparisons (`d11e2` trap, `d11e3` k1, `d11e5` trap among them), provisioning lead times, figures on which AWS's own pages disagree, and anything about what a Skill Builder lesson or lab contains.

Left out because no AWS page confirmed them: how long Direct Connect takes to provision, and EFS One Zone being cheaper than Regional. (A KMS key scheduled for deletion is not charged: the KMS pricing page says so.)

## Found in existing content while checking

Fixed in this change:
- `d1a2` said you aren't charged unless you upgrade, while `d1c1` (enable IAM Identity Center) creates an AWS Organization, which upgrades a Free plan account to pay-as-you-go. The owner chose to stay on the Free plan, so Day 1 now creates an IAM admin user with MFA (new steps `d1u1`–`d1u4`) and Identity Center became a reading block (`d1c1`, `d1c3`, `d1c4`, `d1c5` keep their ids, so the questions that reference them still point at the right topic; `d1c2` is retired). Day 4 signs the CLI in with `aws login` instead of `aws configure sso` (`d4s2`). Sources: the Identity Center "Enable" page, the Billing "Choosing a plan" page, the IAM "Create an IAM user" pages and the CLI "Login … using console credentials" page.
- AWS is rolling out a new sign-up ("Sign up for AWS (new)": a Google, GitHub, Apple or Amazon login, projects, AWS Settings) to a limited number of customers, and in it IAM users with console access can't be created. `d1a1` and `d1u1` say what to do if the owner lands in it.
- `d6b3`: IAM events are recorded in us-east-1, so Event history in eu-west-1 doesn't show them. The step now says to switch Region.
- `d13l1`: a test centre needs two IDs (two primary, or one primary and one secondary); only an online exam needs one.
- `d11b1`: an appointment can be rescheduled at most twice.
- `d4s2`: "no access keys on disk" → "no long-term access keys on disk" (the SSO token is cached).
- `DOCS.aurora`: the Aurora FAQ moved to docs.aws.amazon.com.

Passed on to the sessions that re-verified the question bank and the study extras the same day (what each did with it is in `docs/verification/`):
- **Quiz explanations:** q03-001 (30-day minimum age for an IA transition is no longer documented), q03-032 (blue/green deployment is now a documented way to encrypt an RDS instance), q06-007 and q06-009 (CloudTrail Insights analyses management and data events), q06-019 (Trusted Advisor plan names), q08-003 (S3 now has `UpdateObjectEncryption`, so a copy job is no longer the only path), q09-033 (Replication Time Control 99.9% vs 99.99%), q10-038, q11-044, q11-047 (Direct Connect lead time and transfer rate not confirmable), q11-046 (Price Class 100 region list not confirmable), q11-049 (EFS One Zone price not confirmable).
- **Model answers:** `d4c3` and `d8c3` list fewer AWS WAF resource types than the docs now do; `d1c8` treats the 15-minute Lambda limit as absolute; `d9c3` omits IP-based routing; `d11c2` predates Database Savings Plans.
- **Naming drift:** Elastic Beanstalk now has a Standard (EC2) and a Cluster (EKS) mode; the S3 static-hosting page recommends Amplify Hosting first; EventBridge scheduled rules are labelled legacy in favour of EventBridge Scheduler (`d9b3` still works); Snowball support ends 2026-12-31 and Data Transfer Terminal is limited to Enterprise Support customers.
