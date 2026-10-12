# Key points per step: authoring, checking, status

Each plan step is shown alone on a card. Under the step text the card shows "Key points": what to take away from the step, and the trap the exam sets on that topic. The learner reads them right before doing the step and again when a quiz question sends them back to it. A wrong sentence here is studied as fact, so the rules are the same as for the question bank: verify, don't guess.

## Where it lives

| File | Holds |
|---|---|
| `site/keys/d01.js` … `d14.js` | `window.KEYS`, one file per day, keyed by plan item id |
| `site/app.js` → `stepCardHTML` | renders the box, then "AWS docs", "Exam topics", "Terms", "Exam wording" |
| `tests/data.test.mjs` | shape, ids, markup, coverage, closed-service wording |
| `tools/links.mjs` | every `docs` URL (and every `DOCS` URL) answers a plain 200 |

151 of the 160 steps have an entry. The nine without one are pure admin: `d1a3`, `d1a4`, `d1d2`, `d4s1`, `d6w6`, `d7h1`, `d8s1`, `d8e7`, `d9e6`.

## Format

```js
// Key points per plan step for Day 2. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d2w1: {
    k: ["One or two full sentences stating a fact or a decision rule.", "…"],   // 1–5, each 40–260 characters
    trap: "How the exam tries to catch you on this topic.",                      // optional, 40–280 characters
    docs: [["Page title", "https://docs.aws.amazon.com/…"]]                      // optional, at most 3
  }
});
```

- Key: an item id of that day (the file name fixes the day). An entry needs `k` or `trap`.
- `docs`: only `https://aws.amazon.com/…` or `https://docs.aws.amazon.com/…`, and only pages that were fetched while writing the entry.
- Markup: plain text plus `<b>` and `<code>`. Write a literal `<` as `&lt;`.

What the card adds by itself, with no authoring: AWS pages and exam topics come from the quiz questions whose `ref` names the step (`DOCS` keys and `tags`), terms come from `GLOSSARY` matches in the step text and its key points, and exam wording comes from `CUE_TAGS` (extras.js) for the step's topics.

## Writing rules

- Each point is a fact or a decision rule ("X when Y, because Z"). Never "understand X" or "know the difference".
- Cover what the day's questions test for that step: read the questions whose `ref` includes the step id first.
- By step type:
  - **Watch** and Exam Prep **task statements**: 3–5 points and a trap.
  - **Play** and **Build**: 2–4 points on what to notice while doing it.
  - **Self-check**: the model answer is in `CARDS`, so give only the trap and docs; add a point only for something the quiz tests that the card lacks.
  - **Setup** and admin steps: an entry only for a real exam fact, a cost fact or a safety tip.
- Don't repeat the step's own note from plan.js.
- No volatile numbers (prices, most quotas). Stable limits that decide exam answers are fine.
- Current service names; a closed or retired service may be named only with its status (see "AWS changes" in `questions.md`).
- Nothing about what a Skill Builder lesson or lab contains beyond what plan.js already says: those pages need a login and were never opened.

## Checks to run after an edit

```
node --test              # shape, ids, markup, coverage of Watch/Play/Build/Self-check steps, closed-service wording
node tools/links.mjs     # needs network; a redirect counts as broken (docs.aws.amazon.com redirects missing pages to the guide's landing page)
```

## Verification status (as of 2026-10-12)

Written on 2026-10-12 by five writer agents, one group of days each, on the owner's PC where `aws.amazon.com` and `docs.aws.amazon.com` can be fetched directly. Each writer checked its statements against fetched AWS pages (roughly 110–190 pages per writer) and cited only pages it fetched. Afterwards: the data tests pass, every cited link answers a plain 200, and Days 1–2 were read through in full. Days 3–14 had no second, independent read. The entries for `d1u1`–`d1u4` and the rewritten `d4s2` were added the same day with the Free-plan change, each sentence taken from the IAM and CLI pages they cite.

Sentences the writers marked as inferred from the docs rather than stated by them. They are believed correct; reword or re-check before building on one:

- **Day 1:** credits after the Free plan upgrade (`d1a2`, `d1c1` state only the upgrade, because the Identity Center page says credits expire immediately and the Billing page says remaining credits apply); "standard" Lambda invocations cap at 15 minutes while Managed Instances and MicroVMs run longer (`d1w3`); EC2 needed for kernel modules, host agents or GPUs (`d1w3`); edge locations don't satisfy residency and host no EC2 or RDS (`d1b2`, `d1w4`, `d1c6`); a certificate uploaded as an object does nothing (`d1p1`); custom AMI when bootstrapping is too slow (`d1p3`).
- **Day 2:** 1024–65535 covers every client's ephemeral ports (`d2b4`); "low cost" means Site-to-Site VPN (`d2w1`); the "VPC and more" wizard's exact labels (`d2b1`).
- **Day 3:** a DELETE replicates to the standby and every replica (`d3p1`); lifecycle transitions only move down the waterfall (`d3b2`).
- **Day 4:** an Identity Center profile shows an assumed-role ARN (`d4s3`); `assume-role` is denied until the trust policy allows it (`d4b2`); AWS patches the OS on RDS and Lambda, simplified (`d4w1`).
- **Day 5:** check auto-assign public IPv4 on the wizard's public subnets (`d5b1`); a termination lifecycle hook only delays the instance already picked (`d5p1`).
- **Day 6:** basic cost drivers, from a whitepaper AWS now marks historical (`d6w3`); task nodes as the place for Spot (`d6w1`); exam domains mirror four of the six pillars (`d6w5`); 730 hours per month is arithmetic (`d6b4`).
- **Day 7:** a scaled 720 is not 72% of questions (`d7e3`, `d7e4`).
- **Day 8:** keep Terraform state out of Git (`d8b1`, standard practice rather than an AWS statement); Flow Logs hold no packet contents (`d8e3`); revoking sessions rather than shortening them (`d8e2`).
- **Day 9:** the Terraform wording for the Lambda permission (`d9b3`); more capacity in front of a saturated database raises the pressure (`d9e2`); S3 Replication Time Control percentage left out because the user guide says 99.9% and the product page 99.99% (`d9e3`).
- **Day 10:** Transfer Acceleration doesn't help inside the bucket's Region (`d10e2`); "storage optimized for local disk I/O" as a descriptor (`d10e3`).
- **Day 11:** a cache costs less than more read replicas (`d11e4`); Direct Connect "can reduce" network cost (`d11e5`); Graviton price performance is product-page wording (`d11e3`).

Left out because no AWS page confirmed them: how long Direct Connect takes to provision, EFS One Zone being cheaper than Regional, whether a KMS key is billed while pending deletion.

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
