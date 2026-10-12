# SAA-C03 study tracker

Personal 14-day study tracker for the AWS Certified Solutions Architect – Associate (SAA-C03) exam.
Static site (vanilla HTML/CSS/JS, no build step, no npm deps) served by nginx in Docker on localhost.

## Layout

- `site/index.html` – page structure, title block header, blueprint SVG art, dialogs (cleanup, settings), timer
- `site/style.css` – all styles; blueprint background, light/dark via `prefers-color-scheme`
- `site/plan.js` – DATA ONLY: `window.LINKS`, `window.PLAN` (days → groups → items), `window.CLEANUP`, `window.GLOSSARY`
- `site/fx.js` – `window.FX`: canvas confetti/fireworks + Web Audio sounds + banner
- `site/app.js` – all logic: state, render, today mode, next-up, scores/verdict, notes, cleanup dialog, focus timer, settings, export/import
- `Dockerfile` (nginxinc/nginx-unprivileged:stable-alpine, port 8080), `compose.yaml` (127.0.0.1:8080, read-only, cap_drop ALL, restart unless-stopped)

## Run

```
docker compose up -d --build     # http://localhost:8080
python3 -m http.server -d site 8099   # quick local preview without Docker
```

## Rules

- Item IDs in `plan.js` (e.g. `d2b3`) key saved progress — never rename or reuse; add new IDs for new items.
- Group fields: `t` (watch|play|prep|build|check|setup), `label`, `where`, `link` (LINKS key or `own`), `min` (estimated minutes).
- State lives in localStorage key `saa-plan-v2`. If the shape changes, migrate it in `load()`; don't bump the key and lose progress.
- No frameworks, bundlers or CDN scripts. Only external resource: Google Fonts (Barlow, Barlow Condensed) with system fallbacks.
- Celebrations must respect the effects/sound toggles and `prefers-reduced-motion`.
- Design: blueprint drafting sheet (Prussian-blue grid, chalk-white title block, off-white "paper" cards, AWS orange only for progress/primary actions). Sentence-case labels — no all-caps labels, no "A · B · C" meta strings, no "Word — fragment" labels.
- Content facts (AWS course/module names, exam details) must be checked against official sources before changing.

## Testing

No test suite yet. After changes: `node --check site/*.js`, then load the page (headless Chromium/Playwright is fine) and check the console is clean, ticking works, a full day triggers the celebration, reload keeps state, mobile width (390px) and dark mode look right.

## Owner preferences

- Terse, direct answers; minimal solutions over clever ones; explain the mechanism.
- Never suggest `sed` — show the file content to edit instead.
- Go is the primary language if a backend is ever added.
- Career goal is DevSecOps — security-minded defaults welcome.

## Backlog (ideas, not commitments)

1. Daily quiz: original SAA-style scenario questions per day, wrong answers resurface (spaced repetition)
2. Study-time log from the focus timer; planned vs actual hours per day
3. "Which service?" quick drill
4. Unticked self-check items resurface in Next up
5. Structured wrong-answer log, reviewed on Day 12
6. Clickable blueprint diagrams with explanations
7. Day 10 build: host this site on S3 + CloudFront (OAC) with Terraform
8. Later: Go backend for synced progress; CI with Trivy scan, SBOM, cosign signing
