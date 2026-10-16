# SAA-C03 study tracker

Personal 22-day study tracker for the AWS Certified Solutions Architect – Associate (SAA-C03) exam. The owner starts with no AWS experience.
Static site (vanilla HTML/CSS/JS, no build step, no npm deps) served by a small Go server (with SQLite progress storage) in Docker on localhost.
The plan follows two Skill Builder learning plans: "AWS Solutions Architect Learning Plan (Includes Labs)" on Days 2–17 (each lecture course, then its labs) and the Exam Prep Plan on Days 8 and 18–21. Days 1 and 2 open with the free beginner course "AWS Technical Essentials", which every course of the first plan lists as recommended previous knowledge; a few builds in the owner's own account stay in. The owner's goal is complete knowledge before the exam, lectures first and then the lab version of the same training.
The page opens on an overview (progress, numbers, one Start/Continue button, the days as tiles). A day is worked one step at a time: a single card per step with Back, Mark complete and Next under it, and the helper material for that step on the card.
A day ends with a 30-question quiz that must be passed at 90% to complete the day (not Days 1 and 2, which are setup and the beginner course, nor exam day); the quiz is drawn by the topics the day's steps teach. A 65-question mock exam unlocks when the lectures and labs (Days 1–17) are done.
The number of days is data: nothing in the code knows it (see "The plan is data" in `docs/architecture.md`).

Read before changing things:
- `docs/architecture.md` – state model, quiz/run lifecycle, selection + spaced-repetition rules, sync protocol and merge rules, server security, design decisions and why.
- `docs/questions.md` – question format and writing rules, checks to run, fact-check checklist, verification status (which ids were only knowledge-checked), AWS service changes 2024–2026 that questions must respect.
- `docs/keypoints.md` – format and writing rules for the per-step key points, how they were checked, which sentences are inferences rather than quotes.

## Layout

- `site/index.html` – page structure: title block header, blueprint SVG art, `#home` (overview), `#flow` (one-step card view), dialogs (cleanup, settings, quiz, sheet, break reminder), timer
- `site/style.css` – all styles; blueprint background, light/dark via `prefers-color-scheme`
- `site/plan.js` – DATA ONLY: `window.LINKS`, `window.PLAN` (weeks and days → groups → items; one item = one step = one card), `window.STEP_TAGS` (the exam topics each step teaches), `window.MOCK_AFTER`, `window.SCORE_AT` (steps whose card shows a 📊 Scores field), `window.CLEANUP`, `window.GLOSSARY`
- `site/quiz/meta.js` – DATA ONLY: `window.QUIZ = []`, `window.QTAGS` (allowed topic tags), `window.DOCS` (AWS FAQ links)
- `site/quiz/d01.js … d15.js` (no d07), `mock1.js`, `mock2.js` – DATA ONLY: question pools pushed onto `window.QUIZ`. The number is a pool, not a plan day: pools 1–6 are foundation level, 8–15 exam level
- `site/gifs.js` – DATA ONLY: `window.GIFS`, South Park GIFs for the quiz results by outcome (`ace`, `pass`, `fail`; at least 5 each, `[GIPHY id, description]`), loaded from media.giphy.com
- `site/extras.js` – DATA ONLY: `window.CARDS` (self-check model answers by item id), `window.DRILL`, `window.CUES`, `window.CUE_TAGS` (which quiz topics each exam-wording phrase belongs to)
- `site/keys/*.js` – DATA ONLY: `window.KEYS`, key points per step (`{why, k: [[label, text], …], trap, docs: [[title, url]]}` by item id). The file follows the id: `dNN.js` for ids that start with `dN`, `cN.js` for lecture course N (`cN…`) and its labs (`lN…`), `r1.js` for the reading block
- `site/qcore.js` – `window.QZ`: quiz logic without DOM (the topics each day teaches, picking, shuffling, grading, spaced repetition, weak spots); unit-tested in Node
- `site/fx.js` – `window.FX`: canvas confetti/fireworks + Web Audio sounds + banner, toast and badges (`FX.badge`, at the top of the screen)
- `site/app.js` – page logic: state, views (overview / day flow, mirrored in the URL hash), step cards, quizzes (day/review/warm-up/step practice, with Previous/Next), XP/levels/badges, results GIFs, mock exam, drill, notebook, weak spots, model answers, slip guard, scores/verdict, day and step notes, cleanup dialog, focus timer (50-minute focus, open-ended break with reminders) + time log, settings, export/import, server sync
- `server/` – Go 1.26+ module: `main.go` (static files, `/api/state`, `/healthz`, security headers, host allowlist, CSRF guard), `store.go` (SQLite via modernc.org/sqlite, one revisioned JSON document)
- `tests/` – `qcore.test.mjs`, `data.test.mjs` (node --test, no deps), `e2e.mjs` (Playwright run of the real page), `load.mjs` (vm loader for the browser scripts)
- `tools/` – `qstats.mjs` (per-pool stats for authors), `similar.mjs` (near-duplicate finder across pools), `links.mjs` (checks that every AWS link on the site answers a plain 200; needs network)
- `docs/` – `architecture.md`, `questions.md`, `keypoints.md`
- `Dockerfile` (golang build stage → distroless static nonroot, port 8080), `compose.yaml` (127.0.0.1:8080, `saa-data` volume at /data, read-only, cap_drop ALL, restart unless-stopped)

## Run

```
docker compose up -d --build     # http://localhost:8080
cd server && go run .            # local server on :8080 using ../site and server/data/saa.db
python3 -m http.server -d site 8099   # quick preview without the backend (progress stays in the browser)
```

## Rules

- Item IDs in `plan.js` (e.g. `d2b3`) key saved progress, step notes and key points — never rename or reuse; add new IDs for new items.
- One step per screen. The day view never shows a list of steps to tick: the owner asked for a single card with Back, Mark complete and Next, because a visible list of tasks discourages them. New per-step material goes on the step's card (`stepCardHTML`), not into a list.
- Key points (`site/keys/*.js`): `why` (the need, 80–420 characters), `k` = up to 6 points as `[label, text]`, optional `trap`, up to 3 `docs` as `[title, url]` on aws.amazon.com or docs.aws.amazon.com; only `<b>` and `<code>` markup. Every statement must be checked against a fetched AWS page; see `docs/keypoints.md`. `data.test.mjs` enforces the shape, `tools/links.mjs` the links.
- Question IDs (`q02-017`, `m1-040`) key quiz stats, review queue and notebook — never rename or reuse. Fix a question in place; retire one by deleting it (stats for unknown ids are ignored).
- Question format: `{id, day, dom, tags, q, o, a, x, ref, doc?}` — 4 options (or 5 with "(Choose two.)" and 2 answers), one explanation per option, `day` = the pool number, `tags` = 1–2 from `QTAGS` (the first is the main topic), `ref` = optional ids of steps that are exactly the place to go back to (may be `[]`: the steps that teach the topic are found through `STEP_TAGS`), `doc` from `DOCS`. Options are shuffled on screen: no positional wording. Only `<code>` markup.
- Quiz rules live in `qcore.js` constants: 30 questions/day, pass 90%, mock 65 q / 130 min split 20/17/15/13, review after 1/2/4 days, 3 questions per step practice. A day counts as done only when all its items are complete AND its quiz is passed (if it has one). A day's quiz asks only about topics taught up to that day: when you add a question, its tags decide where it can appear; when you add or move a step, give it `STEP_TAGS`.
- Group fields: `t` (watch|play|prep|build|check|setup), `label`, `where`, `link` (LINKS key or `own`), `min` (estimated minutes for the whole block). Day fields: `quiz` (`tags` | `review` | `dom:1,2` | `weak` | `exam`; none = no quiz), `tools`, `notesHint`, `decision` (id of the step whose card shows the go/no-go verdict). A `{week: "…"}` entry starts a week.
- Changing what a day holds: steps keep their ids, so progress on them survives. Day-keyed state (quiz results, completion dates) does not carry over to a different plan; bump `PLAN_V` in `app.js` when days change meaning (see "Changing the plan" in `docs/architecture.md`).
- Order inside the plan: a lecture course first, then its labs, in the order of AWS's learning plan. Don't put another course between a course and its labs. When you add a course, read its page on Skill Builder for "Recommended previous knowledge" as well as its outline: the plan once left out a recommended beginner course because only the outlines were read.
- Putting a day in front of others: later days get new ids (`d5` becomes `d6`), so add a `shiftDays` step for the old `PLAN_V` in `clean()` and bump `PLAN_V`; then day quiz results, completion dates, day notes and the time log move with their days.
- State lives in localStorage key `saa-plan-v2` and is mirrored to the server (`PUT /api/state`, revision-checked). On a conflict where both sides changed, `mergeDocs()` merges (ticks union, best quiz results, per-question data from the copy that answered more); otherwise the server copy is taken. Other tabs are followed via the `storage` event. If the shape changes, migrate it in `load()`; don't bump the key and lose progress. New top-level fields need a default in `DEF` and, for maps, a validation rule in `clean()` — every state entry point goes through `parseState()`. Which card is on screen is not state: it lives in the URL hash (`#d3/d3w2`, `#d3/quiz`, `#d3/done`). Which helper lists are folded open is a per-browser preference in `saa-plan-v2-ui`, not synced.
- Anything from state that reaches `innerHTML` must be escaped (`esc()`) or coerced to a number; URLs must be http(s). The e2e "hostile import" check guards this.
- No frameworks, bundlers or CDN scripts. Only external resources: Google Fonts (Barlow, Barlow Condensed) with system fallbacks, and the results GIFs from `media.giphy.com` (images only; the page works without them). The CSP in `server/main.go` enforces this; update it if that ever changes. Don't commit GIF files: they are copyrighted clips, linked from GIPHY.
- Something earned (a run of right answers, a record, a badge, a level) is a badge at the top of the screen (`FX.badge`), not a toast; toasts stay for progress lines. New badges go in `ACH` in app.js; XP is derived from the state (`xpTotal`), never stored. Nothing may `save()` at boot before the first sync: a bumped `savedAt` makes a stale copy win the merge (`award(0, false)`).
- `merge()` skips `__proto__`, `constructor` and `prototype` keys, and lookups keyed by ids from state (`QBY`, `itemIndex`, `ACH_BY`) are null-prototype objects. Numbers from state are clamped where they feed loops or the UI (see "Bounds" in `docs/architecture.md`).
- Celebrations must respect the effects/sound toggles and `prefers-reduced-motion`. They form a ladder (step, block of the day, quiz open, quiz passed, day, week, everything), each rung bigger than the one below: the owner asked for more to see and hear on every finished thing, so don't trim them, and when you add something that can be finished, give it a rung (see "Celebrations" in `docs/architecture.md`).
- Purpose first on every card: the owner wants each explanation to open with the problem the thing was made to solve, then the details, in short plain sentences. `KEYS[id].why` is required and shown first; points are `[label, text]`; model answers open with a `<b>Why …:</b>` line (see "Purpose first" in `docs/keypoints.md`).
- Design: blueprint drafting sheet (Prussian-blue grid, chalk-white title block, off-white "paper" cards, AWS orange only for progress/primary actions). Sentence-case labels — no all-caps labels, no "A · B · C" meta strings, no "Word — fragment" labels.
- The owner's AWS account is on the Paid plan (since 2026-10-13): the Skill Builder subscription is billed to the AWS account and could not be bought on the Free plan. So real money is at stake: every Build ends with a cleanup step, Day 1 sets two budgets (zero spend, and a monthly one just above the subscription), and no step may leave something running overnight or buy a commitment (Savings Plans, Reserved Instances). The daily login is an IAM admin user with MFA. Identity Center is studied by reading (`d1c1`, `d1c3`–`d1c5`); enabling it or creating an AWS Organization is allowed now (both free) but stays optional. Labs run in Skill Builder's temporary sandboxes, never in the owner's account.
- Content facts (AWS course/module names, exam details, question keys and explanations) must be checked against official sources before changing. Don't key answers on services closed to new customers (Snow Family, FSx File Gateway, Timestream for LiveAnalytics…); `data.test.mjs` checks the common ones.

## Testing

```
node --test                                             # qcore unit tests + content/data checks
node tools/qstats.mjs; node tools/similar.mjs 0.38      # after content edits (see docs/questions.md)
cd server && go vet ./... && go test -race ./...        # backend
# browser end-to-end, against a server with a FRESH database:
cd server && go build -o /tmp/saa . && ADDR=127.0.0.1:8090 SITE_DIR=../site DB_PATH=/tmp/saa-e2e/test.db /tmp/saa &
NODE_PATH=$(npm root -g) BASE=http://localhost:8090/ SHOTS=/tmp/shots node tests/e2e.mjs
```
The e2e run takes day and step ids from `window.PLAN` (it expects the first two quiz days to follow each other and the first of them to have a self-check block of several cards). It covers: overview and day tiles, one step per card (Mark complete moves on, Next skips, Back/arrow keys, Undo, double-click guard, reload stays on the card), locked quiz card, key points/docs/topics/notes on a card, step practice, model answers, a day without a quiz, quiz card after the last step (Enter starts it), the topic rule for a day quiz, pass and fail paths, day summary, retake draws unseen questions, quiz Previous/Next and the question squares, streak badge at the top, stars/XP/level on results, GIF rotation per outcome (GIPHY is stubbed), badges earned, resume after reload, notebook/weak spots/cheat sheet, warm-up + review, slip guard, timer log, the break pop-up and its reminders (fake clock, off the server), drill, mock exam (unlock, split, grid, auto-submit), scores and verdict on their cards, server round trip, 390px dark mode, plus code-review regressions (two tabs, two devices merging, pre-server progress merge, progress saved under the old 14-day plan, retired question ids, drill restart, hostile/invalid import including notes, badges, the timer, `__proto__` keys and huge numbers, a tampered GIF pointer, a device earning badges at startup next to a newer server copy, the focus prompt in two tabs, timer pop-ups held during the drill and the mock, XP only for answers that teach something). Look at the screenshots it writes — an earlier bug (explanations hidden by a CSS class clash) passed every functional check.

## Environment notes (owner's Windows PC)

- aws.amazon.com and docs.aws.amazon.com are reachable (curl and WebFetch): fact-check against the fetched page, not search snippets. `docs.aws.amazon.com` answers a page that doesn't exist with a redirect to the guide's landing page, so follow no redirects when checking a link (`tools/links.mjs` does this).
- Node, Go (GOTOOLCHAIN fetches the version in `go.mod`), Python and Docker are installed. Playwright is not installed globally. To run the e2e: `npm install playwright` in a folder outside the repo with `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`, build the server (`cd server && go build -o <tmp>/saa-e2e.exe .`), start it with `ADDR=127.0.0.1:8090 SITE_DIR=<repo>/site DB_PATH=<fresh file>`, then `NODE_PATH=<that folder>/node_modules PW_CHANNEL=msedge BASE=http://localhost:8090/ SHOTS=<dir> node tests/e2e.mjs` (drives the installed Edge, about 40 s). Ask before installing anything.
- For a quick look without the backend: `python -m http.server -d site 8099` gives a throwaway copy whose progress is separate from the real one on port 8080. `.claude/launch.json` at the repo root has both as preview configurations.
- Files are checked out with CRLF line endings (`core.autocrlf`); Git Bash rewrites arguments that start with `/`, so don't pass `//`-style markers on a command line.
- Never point a test at port 8080: that is the owner's real progress.

## Environment notes (Claude Code cloud sandbox)

- aws.amazon.com / docs.aws.amazon.com and Skill Builder are blocked (curl and WebFetch); WebSearch works but has a budget of ~200 searches per user turn shared by all subagents — plan fact-checking so it isn't exhausted before late rewrites.
- Go toolchain: the module needs Go ≥ 1.26; `GOTOOLCHAIN=auto` downloads it through proxy.golang.org.
- Docker: start `dockerd` yourself. Docker Hub may answer 429; pull `mirror.gcr.io/library/golang:1.27-alpine` and tag it `golang:1.27-alpine`, then `docker build --pull=false`. Inside builds, TLS to proxy.golang.org fails (intercepting proxy), so for a test build copy the repo to a scratch dir, `go mod vendor` in server/, and drop `go mod download` / add `-mod=vendor` in a scratch Dockerfile. Don't commit those workarounds.
- Playwright is installed globally (`NODE_PATH=$(npm root -g)`); never run `playwright install`.

## Working on content with parallel agents

- Give each agent its own files; two agents editing the same pool at once clobber each other. For a big job the owner prefers separate sessions, one branch each (`start_session` with its own worktree), merged by the main session: create the empty target files and their `<script>` tags first, so no two sessions touch `index.html` or `meta.js`; new `DOCS` keys are listed in each session's log and added at merge time.
- Every writer/reviewer runs `node --check`, `node --test` and the tools before reporting; still re-run them yourself before committing.
- Ask writers to list facts they are unsure of, then have a separate reviewer verify exactly those (that caught SSE-C defaults, Snowball closure, Security Hub CSPM, NLB listener rules, etc.).
- After any batch of new questions, run `tools/similar.mjs`; parallel writers produce near-copies (the first pass found 49 pairs).

## Owner preferences

- Terse, direct answers; minimal solutions over clever ones; explain the mechanism.
- Never suggest `sed` — show the file content to edit instead.
- Go is the primary language if a backend is ever added.
- Career goal is DevSecOps — security-minded defaults welcome.

## Backlog (ideas, not commitments)

Done: daily quiz with 90% gate, spaced review, warm-up, wrong-answer notebook, weak-spot map, flip cards, "Which service?" drill, exam-wording cheat sheet, mock exam, slip guard, study-time log, Go + SQLite backend, overview + one-step-per-card day flow, key points per step, step practice, step notes, 21-day plan on the Solutions Architect learning plan with quizzes drawn by topic, then 22 days with AWS Technical Essentials in front, purpose-first cards, the celebration ladder, quiz Previous/Next, XP/levels/badges with badges at the top of the screen, South Park GIFs on results, the open-ended break with reminders.

0. Content from before the 21-day plan was read twice against fetched AWS pages on 2026-10-12, by sessions that had not seen each other's files; the key points for the lecture, lab and reading steps and question pools 12–15 were written the same day with one second read each (logs in `docs/verification/`). What is still open is listed under "Verification status" in docs/questions.md and docs/keypoints.md: price comparisons, lead times and figures AWS states two ways (left alone on purpose), m1-048 (MemoryDB, worth rewriting), a short list of statements no page settles, and everything behind the Skill Builder login (nobody has watched the lectures or done the labs: the plan follows their public outlines). A human AWS expert has never reviewed it.
1. Clickable blueprint diagrams with explanations
2. A build of your own: host this site on S3 + CloudFront (OAC) with Terraform (static mode; no sync there)
3. CI: node --test, go test, Playwright run, Trivy scan, SBOM, cosign signing
4. Optional login (e.g. a shared secret) if the server is ever exposed beyond localhost
5. Check the Day 1 and Day 4 login steps against a real account once the owner has done them: the IAM admin user block (`d1u1`–`d1u4`), `aws login --profile lab` (`d4s2`), `aws sts assume-role` with those credentials (`d4b3`) and Terraform reading the `lab` profile (`d8b1`) were written from the AWS docs, not tried.
6. After the owner's first days on Skill Builder: compare the lesson names and durations on the cards with what the courses really show, and adjust `min` per block (the estimates are the durations Skill Builder lists, at normal speed).
