# SAA-C03 study tracker

Personal 14-day study tracker for the AWS Certified Solutions Architect – Associate (SAA-C03) exam.
Static site (vanilla HTML/CSS/JS, no build step, no npm deps) served by a small Go server (with SQLite progress storage) in Docker on localhost.

## Layout

- `site/index.html` – page structure, title block header, blueprint SVG art, dialogs (cleanup, settings, quiz, sheet), timer
- `site/style.css` – all styles; blueprint background, light/dark via `prefers-color-scheme`
- `site/plan.js` – DATA ONLY: `window.LINKS`, `window.PLAN` (days → groups → items), `window.CLEANUP`, `window.GLOSSARY`
- `site/quiz/meta.js` – DATA ONLY: `window.QUIZ = []`, `window.QTAGS` (allowed topic tags), `window.DOCS` (AWS FAQ links)
- `site/quiz/d01.js … d11.js` (no d07), `mock1.js`, `mock2.js` – DATA ONLY: question pools pushed onto `window.QUIZ`
- `site/extras.js` – DATA ONLY: `window.CARDS` (self-check model answers by item id), `window.DRILL`, `window.CUES`
- `site/qcore.js` – `window.QZ`: quiz logic without DOM (picking, shuffling, grading, spaced repetition, weak spots); unit-tested in Node
- `site/fx.js` – `window.FX`: canvas confetti/fireworks + Web Audio sounds + banner
- `site/app.js` – page logic: state, render, today mode, next-up, quizzes (day/review/warm-up), mock exam, drill, notebook, weak spots, flip cards, slip guard, scores/verdict, notes, cleanup dialog, focus timer + time log, settings, export/import, server sync
- `server/` – Go 1.26+ module: `main.go` (static files, `/api/state`, `/healthz`, security headers, host allowlist, CSRF guard), `store.go` (SQLite via modernc.org/sqlite, one revisioned JSON document)
- `tests/` – `qcore.test.mjs`, `data.test.mjs` (node --test, no deps), `e2e.mjs` (Playwright smoke run of the real page)
- `Dockerfile` (golang build stage → distroless static nonroot, port 8080), `compose.yaml` (127.0.0.1:8080, `saa-data` volume at /data, read-only, cap_drop ALL, restart unless-stopped)

## Run

```
docker compose up -d --build     # http://localhost:8080
cd server && go run .            # local server on :8080 using ../site and server/data/saa.db
python3 -m http.server -d site 8099   # quick preview without the backend (progress stays in the browser)
```

## Rules

- Item IDs in `plan.js` (e.g. `d2b3`) key saved progress — never rename or reuse; add new IDs for new items.
- Question IDs (`q02-017`, `m1-040`) key quiz stats, review queue and notebook — never rename or reuse. Fix a question in place; retire one by deleting it (stats for unknown ids are ignored).
- Question format: `{id, day, dom, tags, q, o, a, x, ref, doc?}` — 4 options (or 5 with "(Choose two.)" and 2 answers), one explanation per option, `ref` = plan item ids from that day or earlier, `tags` from `QTAGS`, `doc` from `DOCS`. Options are shuffled on screen: no positional wording. Only `<code>` markup.
- Quiz rules live in `qcore.js` constants: 30 questions/day, pass 90%, mock 65 q / 130 min split 20/17/15/13, review after 1/2/4 days. A day counts as done only when all its items are ticked AND its quiz is passed (Days 1–13).
- Group fields: `t` (watch|play|prep|build|check|setup), `label`, `where`, `link` (LINKS key or `own`), `min` (estimated minutes).
- State lives in localStorage key `saa-plan-v2` and is mirrored to the server (`PUT /api/state`, revision-checked; newer `savedAt` wins on conflict). If the shape changes, migrate it in `load()`; don't bump the key and lose progress. New top-level fields need a default in `DEF`.
- No frameworks, bundlers or CDN scripts. Only external resource: Google Fonts (Barlow, Barlow Condensed) with system fallbacks. The CSP in `server/main.go` enforces this; update it if that ever changes.
- Celebrations must respect the effects/sound toggles and `prefers-reduced-motion`.
- Design: blueprint drafting sheet (Prussian-blue grid, chalk-white title block, off-white "paper" cards, AWS orange only for progress/primary actions). Sentence-case labels — no all-caps labels, no "A · B · C" meta strings, no "Word — fragment" labels.
- Content facts (AWS course/module names, exam details, question keys and explanations) must be checked against official sources before changing. Don't key answers on services closed to new customers (Snow Family, FSx File Gateway, Timestream for LiveAnalytics…); `data.test.mjs` checks the common ones.

## Testing

```
node --test                                             # qcore unit tests + content/data checks
cd server && go vet ./... && go test -race ./...        # backend
NODE_PATH=$(npm root -g) BASE=http://localhost:8090/ node tests/e2e.mjs   # against a server with a FRESH database
```
The e2e run covers: quiz prompt after the last tick, pass and fail paths, retake draws unseen questions, resume after reload, notebook/weak spots/cheat sheet, warm-up + review, slip guard, timer log, drill, mock exam (split, grid, auto-submit), server round trip, 390px dark mode. Also eyeball the screenshots it writes.

## Owner preferences

- Terse, direct answers; minimal solutions over clever ones; explain the mechanism.
- Never suggest `sed` — show the file content to edit instead.
- Go is the primary language if a backend is ever added.
- Career goal is DevSecOps — security-minded defaults welcome.

## Backlog (ideas, not commitments)

Done: daily quiz with 90% gate, spaced review, warm-up, wrong-answer notebook, weak-spot map, flip cards, "Which service?" drill, exam-wording cheat sheet, mock exam, slip guard, study-time log, Go + SQLite backend.

1. Clickable blueprint diagrams with explanations
2. Day 10 build: host this site on S3 + CloudFront (OAC) with Terraform (static mode; no sync there)
3. CI: node --test, go test, Playwright run, Trivy scan, SBOM, cosign signing
4. Optional login (e.g. a shared secret) if the server is ever exposed beyond localhost
