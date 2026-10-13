# SAA-C03 three-week plan

Study tracker for the AWS Certified Solutions Architect – Associate exam: a 22-day plan you work through one step at a time, a quiz at the end of a day that you must pass at 90%, spaced review of what you missed, and a full mock exam. Static HTML/CSS/JS (no frameworks) served by a small Go server that also keeps your progress in SQLite.

The plan follows two learning plans on AWS Skill Builder: the **AWS Solutions Architect Learning Plan (Includes Labs)** on Days 2–17 (each lecture course, then its labs) and the **Exam Prep Plan** for SAA-C03 on Days 8 and 18–21. It starts from zero: Days 1 and 2 open with the free course **AWS Technical Essentials**, which every course of the first plan lists as recommended previous knowledge. Day 1 tells you what to enroll in. One month of the Skill Builder subscription is needed from Day 1: most of the courses and labs are behind it. A few builds in your own AWS account (a VPC, IAM roles and policies, one Terraform project) stay in the plan; that account is on the Paid plan, because the subscription is billed to it, so Day 1 also sets up budgets.

```
site/
  index.html     page layout: overview, one-step card view, dialogs
  style.css      styles (light/dark)
  plan.js        the plan: days, steps, links, time estimates, the topics each step teaches, glossary, cleanup list
  quiz/          question pools: meta.js (topics, AWS links), d01–d15.js (no d07), mock1–2.js (65 each)
  extras.js      self-check model answers, "Which service?" drill, exam-wording cheat sheet
  keys/          key points per step (what to take away, the exam trap, AWS pages): d01–d14.js, c1–c9.js (courses and labs), r1.js
  qcore.js       quiz logic without the DOM: picking, grading, spaced repetition, weak spots
  fx.js          confetti, fireworks, sounds
  app.js         page logic: overview, step cards, quizzes, mock exam, notebook, timer, settings, server sync
server/          Go: serves site/ and stores progress in SQLite (GET/PUT /api/state)
tests/           node --test unit + data tests, Playwright end-to-end script
tools/           qstats.mjs (question pool stats), similar.mjs (near-duplicate finder), links.mjs (AWS link check)
docs/            architecture.md (how it works, why), questions.md (writing + checking questions, status),
                 keypoints.md (writing + checking the key points per step)
Dockerfile       two stages: Go build → distroless, non-root
compose.yaml
```

## Run

```
docker compose up -d --build
```

Open http://localhost:8080

## How a day works

- **Overview.** The first screen shows where you stand (steps, days, focus time, quiz accuracy, streak), the day to work on with one button (Start Day 1, Continue Day 3, Take the Day 3 quiz), and the days as tiles. Any tile opens its day.
- **One step at a time.** A day opens as a single card with three buttons under it: Back, Mark complete, Next. Mark complete moves you to the next open step; Next skips a step without marking it, and the row of dots above the card shows what is still open. The arrow keys and Enter work too.
- **Purpose first.** Each card opens with why the thing exists: the problem it was made to solve. Only then come where to do it and the details, as short labelled points.
- **Something happens when you finish something.** A step gets a burst and a note that climbs through the day, a block of the day gets a banner and fireworks, and the day, the week and the whole plan get more. Right answers in a row and a perfect quiz are called out too. Effects and sounds each have a switch in the header.
- **Everything for that step is on its card:** where to do it and the link, key points and the exam trap, the AWS pages to read, the exam topics it feeds with your accuracy so far, glossary terms, exam wording, your own notes, and three practice questions on exactly that step.
- **The last card of a day is its quiz** (Days 3–21). Pass it and you get the day's summary and the button for the next day.
- **The length of the plan is data.** Days, weeks and quizzes come from `plan.js`: add, remove or reorder days there and the page follows.

## How the quizzes work

- **End of the day:** when every step of a day is complete, its 30-question quiz unlocks. After each answer you see why every option is right or wrong, plus the plan steps that teach that topic (lecture first, then lab), with their Open links. A day counts as complete only at 27 of 30 (90%).
- **The quiz follows what the day taught.** Each step names the exam topics it teaches; a day's quiz draws on the topics of its steps and never asks about a topic that comes later in the plan. New questions come first, so a retake draws different ones as long as the day's topics have any left. Option order is shuffled every time.
- **Days 8, 13 and 17** review everything taught so far. **Days 18 and 19** take the exam domains two at a time. **Day 20** is built from your weakest topics and past misses. **Day 21** mixes all four domains, weighted like the exam.
- **Missed questions come back** after 1, 2 and 4 days, as a morning warm-up or a review. Each one also goes into the **wrong-answer notebook**, with a line for why you missed it. You can export the notebook as Markdown.
- **Mock exam:** unlocks when Days 1–17 (the lectures and labs) are complete. It has 65 questions in 130 minutes, split by domain like the exam guide, with no feedback until the end. Each attempt draws different questions.
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
node tools/qstats.mjs && node tools/similar.mjs          # after editing questions
cd server && go vet ./... && go test -race ./...         # backend
NODE_PATH=$(npm root -g) BASE=http://localhost:8080/ node tests/e2e.mjs   # browser end-to-end (needs Playwright)
```
