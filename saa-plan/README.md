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

- **Overview.** The first screen shows where you stand (steps, days, focus time, quiz accuracy, streak, level), the day to work on with one button (Start Day 1, Continue Day 3, Take the Day 3 quiz), and the days as tiles. Any tile opens its day.
- **One step at a time.** A day opens as a single card with three buttons under it: Back, Mark complete, Next. Mark complete moves you to the next open step; Next skips a step without marking it, and the row of dots above the card shows what is still open. The arrow keys and Enter work too.
- **Reading helpers.** A focus view hides the panels (button in the day header, or F). "Test me" on the key points hides their text: say each one, show it, mark it. Search (Ctrl+K or /) finds any step, key point, term, exam wording, look-alike table, diagram part, your notes and the notebook. Theme and text size are in ⚙ Settings.
- **Course diagrams.** Every card of a lecture course and its labs ends with the course's architecture as a blueprint. The parts this step is about are outlined and the first one is open; click any part (or Tab to it and press Enter) for why it is there and what the exam asks about it. "⤢ Larger" opens it full width.
- **Cost guard.** Build steps that create something billable in your own AWS account (a NAT gateway, an Elastic IP, an EC2 instance…) put it on a "Still running" list on the overview when you complete them; add anything else from a Build card. Mark each one ✓ Deleted when it's gone. From 20:00, while anything is still on the list, a reminder comes up every 30 minutes (and as a Windows notification), unless you say to keep it running tonight.
- **Today's goal and the week's challenges.** A ring on the overview fills with today's XP towards your daily goal (⚙ Settings). Three challenges a week (answer 150 questions, complete 40 steps, run the drill 3 times…) each add 50 XP. Reaching either drops a badge at the top of the screen.
- **Readiness and trends.** The 📈 panel shows, per exam domain, how many of the questions you've met you'd get right now (ready from 80%), the topic to study next with its step, why you miss (from the one-click reasons under each wrong answer), and day-by-day charts of answers right, focus time and XP (hover or use the arrow keys for the values; "Show as table" for all of them).
- **Look-alikes.** 19 tables put services that sound alike side by side (SQS, SNS or EventBridge; ALB, NLB or GWLB; EBS, EFS or S3…), row by row, ending with the exam's cue. A missed question whose right and wrong answers name two services of one table links to it, and so do the card's panel, weak spots and the practice panel.
- **Purpose first.** Each card opens with why the thing exists: the problem it was made to solve. Only then come where to do it and the details, as short labelled points.
- **Something happens when you finish something.** A step gets a burst and a note that climbs through the day, a block of the day gets a banner and fireworks, and the day, the week and the whole plan get more. Right answers in a row, records, badges, levels and a perfect quiz drop in as badges at the top of the screen. Effects and sounds each have a switch in the header.
- **Everything for that step is on its card and the two panels beside it:** the card has why it exists, where to do it and the link, the key points and the exam trap; "Look it up" has the AWS pages to read and the glossary terms; "On the exam" has the exam topics it feeds with your accuracy so far, three practice questions on exactly that step, the exam wording, and your own notes. On wide screens the panels sit left and right of the card; on smaller ones, under it.
- **The last card of a day is its quiz** (Days 3–21). Pass it and you get the day's summary and the button for the next day.
- **The length of the plan is data.** Days, weeks and quizzes come from `plan.js`: add, remove or reorder days there and the page follows.

## How the quizzes work

- **End of the day:** when every step of a day is complete, its 30-question quiz unlocks. After each answer you see why every option is right or wrong, plus the plan steps that teach that topic (lecture first, then lab), with their Open links. A day counts as complete only at 27 of 30 (90%).
- **The quiz follows what the day taught.** Each step names the exam topics it teaches; a day's quiz draws on the topics of its steps and never asks about a topic that comes later in the plan. New questions come first, so a retake draws different ones as long as the day's topics have any left. Option order is shuffled every time.
- **Days 8, 13 and 17** review everything taught so far. **Days 18 and 19** take the exam domains two at a time. **Day 20** is built from your weakest topics and past misses. **Day 21** mixes all four domains, weighted like the exam.
- **Missed questions come back** after 1, 2 and 4 days, as a morning warm-up or a review. Each one also goes into the **wrong-answer notebook**, with a line for why you missed it. You can export the notebook as Markdown.
- **Mock exam:** unlocks when Days 1–17 (the lectures and labs) are complete. It has 65 questions in 130 minutes, split by domain like the exam guide, with no feedback until the end. Each attempt draws different questions. The screen works like an exam screen: click or drag over words to highlight them, ⊘ (or Shift + the option's number) strikes an option out, flag questions for review, and the review screen shows all, flagged or unanswered ones. The clock turns red in the last 10 minutes.
- **"Which service?" drill, four ways:** 60 seconds; Reverse (a service, which requirement is it for?); Three lives (no clock, until the third miss); and the Daily five (the same five all day, your first try counts, a run of days).
- **Moving around a quiz:** ← Previous and Next → go one question either way without answering, so you can skip one and come back; the squares above the question show right, wrong and open, and jump to any of them. After an answer, the main button goes on to the next open question.
- **XP, levels and badges:** right answers earn XP the first time, after a miss, or when they were due for review (repeats don't), and so do steps and passed quizzes; levels come with titles from "Cloud curious" to "Solutions architect". 15 badges (5, 10, 20, 30 in a row, a perfect score, a comeback, 10 hours of focus, 80% on a mock…). The run of right answers shows in the quiz header and heats up; the results show stars, the XP earned and your longest run.
- **South Park on the results:** a GIF for every answer right, a pass with some wrong, and a fail, ten of each in rotation (`site/gifs.js`), loaded from GIPHY. Switch them off in ⚙ Settings.
- **Practice panel:** review queue, mock exam, a 60-second "Which service?" drill, the notebook, a weak-spot map by topic, an exam-wording cheat sheet, and your badges and level.

The questions are original practice questions in the exam's style, not official AWS questions.

## Focus timer

50 minutes of focus count down and are logged to the day you started them on. When they end, a pop-up offers a break (in every open tab, and again after a reload until you answer). The break has no set length: the clock counts up, and after 10 minutes it reminds you every minute to start the next block (a sound each minute; the pop-up only if it isn't already open). "Pause the break" in the pop-up, or Pause on the timer, stops the reminders. During the mock exam and the drill the pop-ups wait until you close them; the sound still reminds you.

The timer is the strip along the top: the bar fills as the block runs; click the time for Reset, Break now/Focus now and the minutes logged today. A block starts by itself when you start a day or mark a step complete, unless one is already running or you're on a break.

Away: in the timer's menu, "Turn on Windows notifications and away detection" lets Edge tell the page when the PC has had no mouse or keyboard for 5 minutes (when your screen goes off). The block then waits, and when you're back a pop-up asks whether that time counts. A PC that sleeps counts as away too. Notifications show the block's end and the break reminders on the other monitor, only when this window isn't the one you're using.

After updating the site (`docker compose up -d --build`), reload every open tab and device: a tab still running the old page doesn't know the open-ended break and can reset it.

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
