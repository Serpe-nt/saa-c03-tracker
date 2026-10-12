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
- **Credits after a Free plan upgrade** (`d1a2`, `d1c1`): the Identity Center page says credits expire immediately, the Billing page says remaining credits apply to future bills. Neither entry states either.
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
