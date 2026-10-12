# SAA-C03 study tracker

Personal 14-day study tracker for the AWS Certified Solutions Architect – Associate (SAA-C03) exam.
Static site (vanilla HTML/CSS/JS, no build step, no npm deps) served by a small Go server (with SQLite progress storage) in Docker on localhost.
The page opens on an overview (progress, numbers, one Start/Continue button, the 14 days as tiles). A day is worked one step at a time: a single card per step with Back, Mark complete and Next under it, and the helper material for that step on the card.
Each of Days 1–13 ends with a 30-question quiz that must be passed at 90% to complete the day; a 65-question mock exam unlocks after Day 13.

Read before changing things:
- `docs/architecture.md` – state model, quiz/run lifecycle, selection + spaced-repetition rules, sync protocol and merge rules, server security, design decisions and why.
- `docs/questions.md` – question format and writing rules, checks to run, fact-check checklist, verification status (which ids were only knowledge-checked), AWS service changes 2024–2026 that questions must respect.
- `docs/keypoints.md` – format and writing rules for the per-step key points, how they were checked, which sentences are inferences rather than quotes.

## Layout

- `site/index.html` – page structure: title block header, blueprint SVG art, `#home` (overview), `#flow` (one-step card view), dialogs (cleanup, settings, quiz, sheet), timer
- `site/style.css` – all styles; blueprint background, light/dark via `prefers-color-scheme`
- `site/plan.js` – DATA ONLY: `window.LINKS`, `window.PLAN` (days → groups → items; one item = one step = one card), `window.SCORE_AT` (steps whose card shows a 📊 Scores field), `window.CLEANUP`, `window.GLOSSARY`
- `site/quiz/meta.js` – DATA ONLY: `window.QUIZ = []`, `window.QTAGS` (allowed topic tags), `window.DOCS` (AWS FAQ links)
- `site/quiz/d01.js … d11.js` (no d07), `mock1.js`, `mock2.js` – DATA ONLY: question pools pushed onto `window.QUIZ`
- `site/extras.js` – DATA ONLY: `window.CARDS` (self-check model answers by item id), `window.DRILL`, `window.CUES`, `window.CUE_TAGS` (which quiz topics each exam-wording phrase belongs to)
- `site/keys/d01.js … d14.js` – DATA ONLY: `window.KEYS`, key points per step (`{k: [...], trap, docs: [[title, url]]}` by item id), one file per day
- `site/qcore.js` – `window.QZ`: quiz logic without DOM (picking, shuffling, grading, spaced repetition, weak spots); unit-tested in Node
- `site/fx.js` – `window.FX`: canvas confetti/fireworks + Web Audio sounds + banner
- `site/app.js` – page logic: state, views (overview / day flow, mirrored in the URL hash), step cards, quizzes (day/review/warm-up/step practice), mock exam, drill, notebook, weak spots, model answers, slip guard, scores/verdict, day and step notes, cleanup dialog, focus timer + time log, settings, export/import, server sync
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
- Key points (`site/keys/dNN.js`): `k` = 1–5 takeaways, optional `trap`, up to 3 `docs` as `[title, url]` on aws.amazon.com or docs.aws.amazon.com; only `<b>` and `<code>` markup. Every statement must be checked against a fetched AWS page; see `docs/keypoints.md`. `data.test.mjs` enforces the shape, `tools/links.mjs` the links.
- Question IDs (`q02-017`, `m1-040`) key quiz stats, review queue and notebook — never rename or reuse. Fix a question in place; retire one by deleting it (stats for unknown ids are ignored).
- Question format: `{id, day, dom, tags, q, o, a, x, ref, doc?}` — 4 options (or 5 with "(Choose two.)" and 2 answers), one explanation per option, `ref` = plan item ids from that day or earlier, `tags` from `QTAGS`, `doc` from `DOCS`. Options are shuffled on screen: no positional wording. Only `<code>` markup.
- Quiz rules live in `qcore.js` constants: 30 questions/day, pass 90%, mock 65 q / 130 min split 20/17/15/13, review after 1/2/4 days, 3 questions per step practice. A day counts as done only when all its items are complete AND its quiz is passed (Days 1–13).
- Group fields: `t` (watch|play|prep|build|check|setup), `label`, `where`, `link` (LINKS key or `own`), `min` (estimated minutes for the whole block). Day fields: `tools`, `notesHint`, `decision` (id of the step whose card shows the go/no-go verdict).
- State lives in localStorage key `saa-plan-v2` and is mirrored to the server (`PUT /api/state`, revision-checked). On a conflict where both sides changed, `mergeDocs()` merges (ticks union, best quiz results, per-question data from the copy that answered more); otherwise the server copy is taken. Other tabs are followed via the `storage` event. If the shape changes, migrate it in `load()`; don't bump the key and lose progress. New top-level fields need a default in `DEF` and, for maps, a validation rule in `clean()` — every state entry point goes through `parseState()`. Which card is on screen is not state: it lives in the URL hash (`#d3/d3w2`, `#d3/quiz`, `#d3/done`). Which helper lists are folded open is a per-browser preference in `saa-plan-v2-ui`, not synced.
- Anything from state that reaches `innerHTML` must be escaped (`esc()`) or coerced to a number; URLs must be http(s). The e2e "hostile import" check guards this.
- No frameworks, bundlers or CDN scripts. Only external resource: Google Fonts (Barlow, Barlow Condensed) with system fallbacks. The CSP in `server/main.go` enforces this; update it if that ever changes.
- Celebrations must respect the effects/sound toggles and `prefers-reduced-motion`.
- Design: blueprint drafting sheet (Prussian-blue grid, chalk-white title block, off-white "paper" cards, AWS orange only for progress/primary actions). Sentence-case labels — no all-caps labels, no "A · B · C" meta strings, no "Word — fragment" labels.
- The owner's AWS account stays on the Free plan: no step may create or join an AWS Organization (that upgrades the account to pay-as-you-go), which rules out enabling IAM Identity Center, Control Tower and anything else that needs an organization. The daily login is an IAM admin user with MFA; Identity Center is studied by reading (`d1c1`, `d1c3`–`d1c5`).
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
The e2e run covers: overview and day tiles, one step per card (Mark complete moves on, Next skips, Back/arrow keys, Undo, double-click guard, reload stays on the card), locked quiz card, key points/docs/topics/notes on a card, step practice, model answers, quiz card after the last step (Enter starts it), pass and fail paths, day summary, retake draws unseen questions, resume after reload, notebook/weak spots/cheat sheet, warm-up + review, slip guard, timer log, drill, mock exam (split, grid, auto-submit), scores and verdict on their cards, server round trip, 390px dark mode, plus code-review regressions (two tabs, two devices merging, pre-server progress merge, retired question ids, drill restart, hostile/invalid import including notes). Look at the screenshots it writes — an earlier bug (explanations hidden by a CSS class clash) passed every functional check.

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

- Give each agent its own files; two agents editing the same pool at once clobber each other.
- Every writer/reviewer runs `node --check`, `node --test` and the tools before reporting; still re-run them yourself before committing.
- Ask writers to list facts they are unsure of, then have a separate reviewer verify exactly those (that caught SSE-C defaults, Snowball closure, Security Hub CSPM, NLB listener rules, etc.).
- After any batch of new questions, run `tools/similar.mjs`; parallel writers produce near-copies (the first pass found 49 pairs).

## Owner preferences

- Terse, direct answers; minimal solutions over clever ones; explain the mechanism.
- Never suggest `sed` — show the file content to edit instead.
- Go is the primary language if a backend is ever added.
- Career goal is DevSecOps — security-minded defaults welcome.

## Backlog (ideas, not commitments)

Done: daily quiz with 90% gate, spaced review, warm-up, wrong-answer notebook, weak-spot map, flip cards, "Which service?" drill, exam-wording cheat sheet, mock exam, slip guard, study-time log, Go + SQLite backend, overview + one-step-per-card day flow, key points per step, step practice, step notes.

0. Content was re-checked against fetched AWS pages on 2026-10-12 (logs in `docs/verification/`). What is still unconfirmed is listed under "Verification status" in docs/questions.md and in docs/keypoints.md: price comparisons, lead times, a few inferred statements, and everything behind the Skill Builder login. A human AWS expert has never reviewed it.
1. Clickable blueprint diagrams with explanations
2. Day 10 build: host this site on S3 + CloudFront (OAC) with Terraform (static mode; no sync there)
3. CI: node --test, go test, Playwright run, Trivy scan, SBOM, cosign signing
4. Optional login (e.g. a shared secret) if the server is ever exposed beyond localhost
5. Check the Day 1 and Day 4 login steps against a real account once the owner has done them: the IAM admin user block (`d1u1`–`d1u4`), `aws login --profile lab` (`d4s2`), `aws sts assume-role` with those credentials (`d4b3`) and Terraform reading the `lab` profile (`d8b1`) were written from the AWS docs, not tried.
