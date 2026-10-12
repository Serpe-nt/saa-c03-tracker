# SAA-C03 two-week plan

Study tracker for the AWS Certified Solutions Architect – Associate exam: a 14-day plan with ticks, an end-of-day quiz you must pass at 90%, spaced review of what you missed, and a full mock exam at the end. Static HTML/CSS/JS (no frameworks) served by a small Go server that also keeps your progress in SQLite.

```
site/
  index.html     page layout, dialogs
  style.css      styles (light/dark)
  plan.js        the plan: days, steps, links, time estimates, glossary, cleanup list
  quiz/          question pools: meta.js (tags, AWS links), d01–d11.js (50 per study day), mock1–2.js (65 each)
  extras.js      self-check model answers, "Which service?" drill, exam-wording cheat sheet
  qcore.js       quiz logic without the DOM: picking, grading, spaced repetition, weak spots
  fx.js          confetti, fireworks, sounds
  app.js         page logic: ticks, quizzes, mock exam, notebook, timer, settings, server sync
server/          Go: serves site/ and stores progress in SQLite (GET/PUT /api/state)
tests/           node --test unit + data tests, Playwright end-to-end script
Dockerfile       two stages: Go build → distroless, non-root
compose.yaml
```

## Run

```
docker compose up -d --build
```

Open http://localhost:8080

## How the quizzes work

- **End of every day (Days 1–13):** when every step of a day is ticked, a 30-question quiz opens. After each answer you see why every option is right or wrong, plus the exact plan step to go back to: the Skill Builder module or Exam Prep task, with its Open link. A day counts as complete only at 27 of 30 (90%).
- **Retakes draw different questions.** Each study day has 50 questions, and new ones come first. Option order is shuffled every time.
- **Day 7** mixes Days 1–6. **Day 12** is built from your weakest topics and past misses. **Day 13** mixes all four domains, weighted like the exam.
- **Missed questions come back** after 1, 2 and 4 days, as a morning warm-up or a review. Each one also goes into the **wrong-answer notebook**, with a line for why you missed it. You can export the notebook as Markdown.
- **Mock exam:** unlocks when Days 1–13 are complete. It has 65 questions in 130 minutes, split by domain like the exam guide, with no feedback until the end. Each attempt draws different questions.
- **Practice panel:** review queue, mock exam, a 60-second "Which service?" drill, the notebook, a weak-spot map by topic, and an exam-wording cheat sheet.

The questions are original practice questions in the exam's style, not official AWS questions.

## Keep it up after reboots

`restart: unless-stopped` restarts the container whenever the Docker daemon starts, so the daemon itself must start at boot:

```
sudo systemctl enable --now docker
```

## Update after editing files

```
docker compose up -d --build
```

## Where progress is stored

- **On the server:** a SQLite file in the `saa-data` Docker volume (`/data/saa.db` in the container). Rebuilding or recreating the container keeps it. Every browser that opens the site gets the same progress. If two browsers edit at once, the newer save wins.
- **In the browser:** localStorage keeps a working copy, so the page also works without the server. For example, you can run `python3 -m http.server -d site` for a quick preview; that mode saves to the browser only.

Back up the database file:

```
docker compose cp saa-plan:/data/saa.db ./saa-backup.db
```

Or use ⚙ Settings → Export / Import (JSON).

## Security defaults

- **Network:** the port is bound to `127.0.0.1` only. The server answers only to the host names in `ALLOWED_HOSTS`, which blocks DNS rebinding. It refuses cross-site writes (CSRF) and sends a strict Content-Security-Policy.
- **Container:** distroless image, non-root user, read-only root filesystem, all capabilities dropped, `no-new-privileges`.
- **Opening it to your LAN:** change the port to `"8080:8080"` and add the PC's LAN address to `ALLOWED_HOSTS` in `compose.yaml`. There is no login, so anyone on that network can then change your progress.

## Tests

```
node --test                                              # unit + content checks (no dependencies)
cd server && go vet ./... && go test -race ./...         # backend
NODE_PATH=$(npm root -g) BASE=http://localhost:8080/ node tests/e2e.mjs   # browser end-to-end (needs Playwright)
```
