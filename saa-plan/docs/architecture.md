# Architecture

A single-user study tracker. The browser does all the work; the server only stores one JSON document. Everything works without the server (browser-only mode), and the server adds durability and cross-browser sync.

```
browser ─ index.html loads, in order:
          plan.js → quiz/meta.js → quiz/d01…d15.js, mock1–2.js → extras.js → keys/*.js → qcore.js → fx.js → app.js
          app.js: state S (localStorage "saa-plan-v2") ── GET/PUT /api/state ──► Go server ── SQLite (/data/saa.db)
```

## Files and responsibilities

- **Data files** (`plan.js`, `quiz/*.js`, `extras.js`, `keys/*.js`) hold no logic. They assign or push onto `window.*` globals.
- **`qcore.js`** holds the quiz logic with no DOM: picking, shuffling, grading, spaced repetition, weak-spot aggregation, mock scoring, and which topics each day of the plan teaches (`topics`). Constants: `DAILY` 30, `PASS` 0.9, `MOCK` {65 questions, 130 min, split [20,17,15,13]}, `MIX` [9,8,7,6], `SRS_DAYS` [1,2,4], `STEP` 3, `FOUNDATION` 6 (question pools 1–6 are foundation level, the later ones exam level). Node tests load it through `tests/load.mjs`, a vm sandbox with a fake `window`.
- **`app.js`** is one IIFE that owns the state and all UI. Its sections, in order: state and validation, indexes, dates, dialog queue, glossary, views (overview / day flow), overview tiles, refresh (and where the plan stands), slip guard, the overview's Start/Continue card, day flow (one card at a time), completing steps and celebrations, XP/levels/badges, scores, practice panel, quizzes (shared, day/review/warm-up/step practice, mock, drill), quiz dialog events, sheets (notebook, weak spots, cues, day notes, look-alikes, the larger diagram), cost guard, cleanup dialog, day-flow events, header, settings, focus timer, server sync, boot.
- **`server/`** is a Go module (stdlib plus `modernc.org/sqlite`, pure Go, no cgo). It serves `site/` and the API.

## State (`DEF` in app.js)

| Field | Shape | Meaning |
|---|---|---|
| `ticks` | `{itemId: true}` | completed plan steps |
| `notes`, `scores` | `{dayId: text}`, `{key: value}` | day notes; 📊 Scores inputs |
| `inotes` | `{itemId: text}` | your own note on a single step (at most 2,000 characters) |
| `planV` | number | the plan the day-keyed entries were saved under (`PLAN_V`; see "Changing the plan") |
| `dayDone` | `{dayId: "YYYY-MM-DD"}` | date a day became complete (drives the streak) |
| `quiz` | `{dayId: {best, passed, tries:[{at,score,n}]}}` | day quiz results; `passed` is a date or "" |
| `qs` | `{qid: {seen, right, last, at, xp}}` | per-question answer stats (weak spots, selection tiers); `xp` = right answers that earned XP |
| `srs` | `{qid: {step, due}}` | missed questions waiting for review |
| `book` | `{qid: {at, misses, note, fixed, why}}` | wrong-answer notebook; `why` = the one-click reason for the miss (`WHY`: know, mix, read, word, rush, or "") |
| `run` | object or null | quiz/mock in progress or on its results screen (see below) |
| `mocks` | `[{at, score, n, pct, dom, mins}]` | finished mock exams |
| `conf` | `{checkItemId: "ok"\|"shaky"}` | flip-card self-assessment |
| `kconf` | `{"stepId:index": "ok"\|"shaky"}` | single key points marked in "Test me" (shaky ones are on the weak-spot sheet) |
| `log` | `{dayId: minutes}` | focus-timer time credited to the day being worked on |
| `warm` | `{date: "done"\|"skip"}` | warm-up handled that day |
| `slips`, `slipSkip` | `[{from, n}]`, date | schedule shifts; "Not now" date |
| `drill` | `{best, runs, rev, lives, day}` | "Which service?" records: `best` in 60 seconds, `rev` in reverse, `lives` in three lives, `day` = date → the daily five's first result (0–5); `runs` counts finished drills of every kind |
| `ach` | `{badgeId: "YYYY-MM-DD"}` | badges earned, with the date (see "XP, levels and badges") |
| `rowBest` | number | the most quiz answers right in a row, ever |
| `xpDay` | `{date: {x, at, hit}}` | the XP total when the day was first seen (today's XP = total − `x`), when that was stamped, and whether the daily goal was reached; newest 120 dates |
| `week` | `{key, at, ids, base}` | this week's challenges: Monday's date, when stamped, the three challenge ids, the counters at the week's start |
| `chal` | `{"Monday:id": date}` | weekly challenges completed (+50 XP each) |
| `cost` | `{items: [{id, k, label, day, at, gone}], snooze, night}` | cost guard: billable things in your own AWS account (`k` a kind of `BILLABLE.kinds`; `gone` = when marked deleted, 0 = still running; deleted ones leave after a week), no evening reminder before `snooze`, `night` = the date you said to keep them running |
| `daily` | `{date: {deviceId: {a, r, f}}}` | answers, right answers and focus minutes per day and device, for the trends; newest 120 dates |
| `settings` | `{start, portal, exam, fx, sound, gif, goal}` | Day 1 date, AWS sign-in URL (the field is still called `portal`), booked exam date, toggles (`gif`: South Park GIFs on results), daily XP goal (one of `GOALS`) |
| `timer` | `{mode, running, endAt, left, from, at, up, ts, day, ask, away, min}` | focus timer (see "Focus timer"). `mode` "focus" counts down: `endAt`, `left`, `from` = seconds left when started (for the log), `day` = the day the block credits. `mode` "rest" is the break and counts up: `at` = when it last started running, `up` = seconds banked before a pause. `ts` = when the timer last changed, `ask` = the "focus block done" prompt waits for an answer, `away` = when you left during a running focus block (0 = here; `min` is left over from the old corner timer) |
| `savedAt` | ms timestamp | last local save (sync conflict tie-breaker) |

**Every entry point validates state.** That covers load from localStorage, import, the server copy and other tabs' saves, all through `parseState = clean(merge(clone(DEF), obj))`. `merge` only accepts values whose type matches the default, and `clean` validates each entry inside the maps, the run and the timer. So a bad file can't break rendering or inject markup. New top-level fields need a default in `DEF` and, for maps, a rule in `clean()`.

Ids are permanent keys: plan item ids key `ticks`, `conf`, `inotes` and the key points; day ids key `notes`; question ids key `qs`, `srs` and `book`. Unknown ids are ignored (`QBY` lookups) and pruned from runs (`pruneRun`).

## The plan is data

Nothing in `app.js` or `qcore.js` knows how many days there are or what a given day holds. `plan.js` decides:

- **Days:** every `PLAN` entry with an `id` (`d1`, `d2`, …, numbered from 1 without gaps). `LAST` is the last day's number: the exam date, the "Day N of M" label and the slip guard use it.
- **Weeks:** a `{week: "…"}` entry starts a new week. `WEEK[dayId]` is the week's index, and the week celebration fires when every day between two markers is done.
- **Quizzes:** a day's `quiz` field. `"tags"` = the topics of the day's steps, `"review"` = everything taught so far, `"dom:1,2"` = those exam domains, `"weak"` = your weakest topics, `"exam"` = weighted like the exam. No field: no quiz that day (Day 1, which is setup, and exam day).
- **Topics:** `STEP_TAGS` maps a step id to the `QTAGS` it teaches. `QZ.topics(PLAN, STEP_TAGS)` turns that into, per day, `own` (that day's topics) and `sofar` (that day and all before). Everything that links questions and steps goes through topics: the day quizzes, step practice, a card's docs and exam topics, and "where to study" after a wrong answer.
- **Mock exam:** `MOCK_AFTER` is the last day of new material; the mock opens when Days 1 to `MOCK_AFTER` are done.

### Changing the plan

Step ids never change, so moving a step to another day keeps its tick, notes and key points. Entries keyed by a *day* (`quiz`, `dayDone`) are only meaningful for the plan they were saved under. `PLAN_V` in `app.js` names the current plan; `clean()` drops `quiz` and `dayDone` (and a day quiz in progress) from any copy saved under another value, on every entry point, so an old server copy or an import cannot bring them back. Bump `PLAN_V` only when days change meaning, not when a step is added. When the change is a day put in front of others (the days themselves are unchanged, only their numbers move), nothing needs dropping: `shiftDays(s, from)` moves `quiz`, `dayDone`, `notes`, `log`, schedule moves and a day quiz in progress one place down, and `clean()` runs it for copies saved under the previous value. That is how `PLAN_V` went from 2 to 3.

Not in the state: which card is on screen (the URL hash), and this browser's preferences in `saa-plan-v2-ui` (never synced): which helper lists are folded open, the theme and text size (Settings; `applyDisplay()` sets `data-theme` and `data-size` on `<html>`, which the CSS reads), the focus view, and where each GIF list is in its rotation.

## Views: overview and day flow

Two containers share the page and exactly one is visible: `#home` (the overview) and `#flow` (one day, one card at a time). The owner asked for this because a list of tasks to tick discouraged them, while a single task on screen keeps them on it.

- **`view = {day, at}`.** `day` is `""` for the overview. `at` is a step id, `"quiz"`, or `"done"` (the day's summary, valid only once the day is complete). `stepIds(d)` is the card order: every item, then `"quiz"` on a day that has one.
- **`setView(day, at, push)`** is the only way a view changes. It validates `at` (`validAt`, falling back to `landing(d)`: first open step, else the quiz, else the summary), writes the hash (`#d3/d3w2`), toggles the containers and renders. `push` makes a history entry, so the browser's Back returns to the overview; moves inside a day replace the entry. `route()` reads the hash at boot and on `hashchange`, which is how the day tiles and the Start/Continue button work: they are plain links to `#d3`.
- **`refresh()`** recomputes the overview (where the plan stands, the Start/Continue card, numbers, tiles, scores, practice) and then calls `setView` with the current view, so a state change from anywhere (a tick, the server, another tab) redraws the card and corrects a card that is no longer valid.
- **Overview, today first** (the owner's pick in the design survey of 2026-10-17). At the top, under the slip banner when there is one, the Start/Continue card (`renderNext`): its head has today's date and where the plan stands (on track, ahead, behind by how much, a plan that ends after the booked exam, the days to the exam), then the warm-up strip when one is due; on the left the day (number, title, goal, one segment per card grouped like its blocks, steps done and time left), on the right its next step in a tinted box of its block's colour (the block, the step, where it happens) with the one big orange button: "Start Day N", "Continue Day N" or "Take the Day N quiz". The day is the one `nextStep()` finds (the earliest open step or pending quiz); when that is not today's day (behind, ahead, before the start), the head says "Next up" and a line names today's day on the plan. Side by side from 900 px, one column below; from 1300 px the overview is 1240 px wide instead of 900. Further down, in this order: still running (cost guard), today's goal and the week's challenges, practice, "Where you stand" (the numbers, readiness and trends, scores), the days as tiles, quick links, where things happen. Every panel starts open (the owner's choice: nothing folded). Days are not locked: any tile opens, and working ahead only shows a pill.

**The card (`renderFlow`)** has a header (day, date, tools: day notes, cleanup check, notebook, weak spots), a strip with one dot per card grouped like the day's blocks, the card itself with its two panels (`#fl-body`), and a fixed bar with Back, the card's main action and Next.

**Layout of a step** (the owner asked for a redesign that is easier to read, with parts moved left and right, and chose this one): the card in the middle holds what you read; **"Look it up"** (`#side-l`: AWS docs, terms) and **"On the exam"** (`#side-r`: exam topics with your accuracy and the practice round, exam wording, your notes) are panels built by `sideHTML()`. From 1400 px they sit left and right of the card and stay in view while it scrolls (sticky); from 761 px they sit side by side under it; on phones they stack under it, the exam panel first. The quiz and summary cards have no panels. Every part is a tinted box with an icon (`box()`, `foldBox()`; `.b-why` orange, `.b-know` blue, `.b-trap` amber, `.b-check` grey, `.b-exam` teal, `.b-cues` purple, docs and terms grey, notes white), and terms and exam wording start open (folding one is remembered, per browser). The typing guard and the fold memory cover the panels too.

- **Step card (`stepCardHTML`):** block tag and position, the step text and note, then **why it exists** (`KEYS[id].why`: the problem the thing solves, shown before anything else because the owner asked for purpose first), where to do it with its Open link, then whatever applies: the 📊 Scores field for that step (`SCORE_AT`, cloned from the Scores panel so both stay in step), the go/no-go verdict (`decision`), the model answer (`CARDS`, self-checks), key points (`KEYS[id].k` as labelled rows under "What to know", and the exam trap), and in the panels: AWS docs and exam topics with your accuracy (the topics are the step's `STEP_TAGS`; the docs come from the quiz questions on those topics, via `QREF`), glossary terms found in the text, exam wording for the step's topics (`CUE_TAGS`), a notes box (`inotes`) and a "try 3 now" practice round.
- **Quiz card:** locked while steps are open (it lists them as links), then Start/Resume/Retake, then "passed".
- **Summary card:** steps, quiz result, focus time, date, and a button for the next day.
- **Mark complete** ticks the step and moves to the next *open* step after it (wrapping round), then to the quiz card, then to the summary. **Next** and **Back** move strictly in order and never tick, so a step can be skipped and found again as a hollow dot. A completed step shows "Completed" with Undo, and Next becomes the main action.
- **Guards:** a click on Mark complete within 350 ms of a card appearing is ignored, so a double click can't also complete the card that slid in under the pointer. While a field on the card has the focus, a redraw leaves the card alone and only updates the strip and the bar, so typing a note is never interrupted.
- **Keyboard:** ← and → press Back and Next; Enter presses the main action unless a button, link or summary has the focus. Not while a dialog is open or a field is being typed in.

**Reading helpers.** The **focus view** (button in the day header, or F) hides both panels and gives the card the width, a little larger. **"Test me"** on "What to know" hides the text of each labelled point: you say it, show it, and mark it Got it or Shaky (`S.kconf`, merged like `conf`); the run itself (`recall`) is memory only and ends with its card. **Search** (Ctrl+K, `/`, or 🔍) looks through every step, its why, key points and trap, the glossary and the exam wording (built once, `srBuild`), and through your step notes, day notes and the notebook (read fresh, `srDynamic`); every word typed must appear; matches are marked on the plain text and every piece is escaped, so a note with markup in it shows as text. Search also finds the look-alike tables and every part of the course diagrams (a part opens its course's first card with that part open).

**Readiness and trends** (the 📈 panel on the overview). *Readiness by domain:* of the questions met in a domain (`q.dom`), the share whose last answer was right (`qs[].last`), with how many were met; a domain needs 15 answers (`MIN_MET`) before it gets a verdict: ✓ Ready from 80%, ◐ Close from 70%, ✗ Not yet below (`band`; colour plus icon and word). The 80% mark is drawn on each meter. With all four measured, an overall figure weighted like the exam guide (30/26/24/20). *Study this next:* the weakest topic (`QZ.weakTags`, at least 3 answers) of the weakest measured domain, the step that teaches it (`tagRefs`), and buttons for that step, three practice questions on it (step practice) and its look-alike table. *Why you miss:* one bar per reason marked on the notebook's questions, most common first, with what helps against the top one (`WHY_TIP`); also at the top of the weak-spot sheet. *Day by day:* three single-series charts (answers right %, focus time, XP) over the last 14 or 30 days (`ui.trend`), drawn as SVG by `chartSVG()` in one validated hue (`--chart`, checked with the dataviz validator against both card surfaces), hairline grid, a labelled reference line (the 90% pass mark, the daily goal) and only the last value labelled. Hover or the arrow keys (the chart is focusable; Home/End) show a tooltip and a hairline for the day (`trendShow`, text set with `textContent`); "Show as table" lists every day (`ui.trendTable`). Answers and focus come from `daily` (per device, so two devices on one day add up and a merge keeps each device's larger count); days before `daily` existed fall back to day-quiz tries and mocks. A day's XP is the next stamped day's starting total minus its own.

**Miss reasons.** Under a wrong answer (day quiz, review, warm-up, step practice), in the mock's and the day quiz's results and in the notebook, one click says why: didn't know it, mixed up two services, misread the question, missed a key word, rushed or changed the answer (`whyHTML`, `S.book[id].why`); a second click takes it back. The text note stays, now optional.

**Cost guard** (the owner chose the "still running" list and the evening reminder). The Build steps run in the owner's own account, and some of what they create is billed by the hour until it is deleted. `BILLABLE` in `plan.js` names the kinds (with how each bills, no prices) and which steps create what (`steps`: the VPC step creates a NAT gateway and its Elastic IP, the instance steps an EC2 instance, the bucket step a bucket, the Terraform step a stack). Ticking such a step puts its items on the list (`billFor`, id `<step>:<kind>`, with a toast); Undo takes them off again unless they were marked deleted. Anything else is added by hand: the Build cards that create something and the block's last (cleanup) card have a 🧾 box with the day's items and a kind + name form; the overview's list has "+ Something else". The overview shows what is still running, since when and how it bills, with "✓ Deleted" per item (`#running`, hidden when empty); the cleanup check starts with the same list. From 20:00 (`NAG_HOUR`), while anything is running, a reminder pop-up (`#costnag`) comes up when no other dialog is open and not over the mock or the drill, with a Windows notification when this window isn't the one in use: mark items deleted in it, "In 30 minutes" (`snooze`; Esc and Done with something still running do the same), or "Keep running tonight" (`night`). Merges keep every item from both copies, and deleted on either side wins.

**Course diagrams** (`site/diagrams/cN.js`, drawn by `site/diagram.js`; content rules in `docs/diagrams.md`). Many exam questions describe an architecture in words; a picture of the course's reference architecture makes those words concrete. Every card of lecture course N and of its labs (`cNx`, `lNx`, `dgKey`) ends with a 🗺 "Course diagram" box (folds like the others, `ui.dg`): the title, why the architecture exists, the parts this step is about as buttons (parts whose `tags` meet the step's topics, `dgRel`), the SVG, and the open part explained under it (why, up to three points, the exam trap). The first of the step's parts is open when the card appears (`dgSel`, memory only); the step's parts are outlined blue, the open one orange. Parts are `role=button` with `tabindex`, so Tab and Enter work (Enter on a part never presses Mark complete). "⤢ Larger" opens the same view in the sheet (`kind "dg"`), the picture with the part beside it; a part chosen there stays open on the card. On phones the picture keeps a readable width and scrolls sideways.

**Look-alikes** (`site/lookalikes.js`). Many misses come from services that sound alike. The ⚖️ sheet (`kind "look"`) shows every table, a row of buttons to jump to one, and on each button the number of open notebook questions that link to it. A question links to a table (`laFor`) when a right option names one column's service and a wrong option another (match words whole, no letter or digit touching them, so "SSE-KMS" names KMS); the options you picked count first, then any wrong option. Links show on a missed answer's feedback and in the mock's results (the sheet opens over the quiz; the quiz keys wait under it), in the notebook, on weak-spot topics (tables with that tag), in the card's "On the exam" panel (tables with the step's topics) and on the overview's practice panel. `tests/data.test.mjs` checks that every table has at least 3 questions linking to it.

## Celebrations (fx.js, and "completing steps & celebrations" in app.js)

The owner asked for more to see and hear whenever something is finished. The effects form a ladder, and each rung is clearly bigger than the one below, so the size of the effect tells you what you just finished:

| Finished | What happens | Where it is fired |
|---|---|---|
| A step | A burst of confetti and a ring from the button, the step's dot pops, a toast says "✓ 5 of 9 · 4 steps to go". The sound is one note of a scale that climbs with the steps of the day. A long step (a lab, a lecture chunk: 30 minutes or more) adds stars and a rocket. | `stepDone` |
| Half the day's steps | The toast says so. | `stepToast` |
| A block of the day (a lecture, its labs, a build) | Corner cannons, stars, two rockets, a chord, the block's dots bounce, a banner names the block and what is left. | `blockDone` |
| The last step, when the day has a quiz | Rings and stars in blue, a banner: the quiz is open. | `blockDone` |
| A right answer in a quiz | The verdict pops with "+10 XP" and a sparkle (a wrong one shakes). The run of right answers shows in the quiz header and heats up. 3, 5, 10, 15, 20, 25, 30 right in a row: a bigger burst, rising notes and a badge that drops in at the top of the screen, bronze to "epic" as the run grows. Past your longest run ever: a "New record" badge, once a quiz. | `check` |
| A quiz finished | The results show 0–3 stars, the level with the XP the quiz earned, the longest run of right answers, and a South Park GIF for the outcome. A pass adds cannons and a fanfare; every answer right, a rain of stars and a "Perfect score" badge. | `finishRun`, `resHTML` |
| A badge earned, a level reached | A badge at the top of the screen; a level has a sound of its own. | `showGains` |
| A day | Cannons, rockets, a rain of emoji, a banner (after the results are closed, if a quiz finished the day). A streak of 3, 5, 7, 10, 14 or 21 days adds a badge at the top. | `celebrate` |
| A week, the whole plan | The same, larger and longer. | `celebrate` |
| Smaller things | "Got it" on a self-check, a review or step practice with every answer right, a full focus block, a mock exam at 80% or more. | at each handler |

- **Canvas, banner, toast and badges live in the open dialog when there is one.** A modal `<dialog>` is in the browser's top layer, above everything else on the page, so an effect drawn on `<body>` would hide behind the quiz. `host()` in fx.js picks the last open dialog in the page (the break reminder, which is last, can sit over the quiz) or the body each time.
- **Badges at the top, toasts at the bottom:** a toast is a progress line above the buttons ("✓ 5 of 9"); anything earned (a run of right answers, a record, a badge, a level, a perfect score, a study streak) is a badge that drops in at the top of the screen, bounces, shines, throws stars and floats away after three seconds. Two at most are on screen; the rest wait their turn (`bdQ` in fx.js), so a burst at the end of a quiz is seen one by one. Phones get a compact badge. When the dialog they were shown in closes, they go with it.
- **Switches:** canvas effects need the effects toggle on and no `prefers-reduced-motion`; sounds need the sound toggle. Banners, toasts and badges carry information (what was finished, what is left, what was earned), so they always show; with reduced motion they appear without animation. The GIFs have their own switch in Settings and show a still frame with reduced motion.
- **What is stored:** the run of right answers lives in the run (`run.row`, `run.rowMax`), so it survives a reload; badges and the record are state. The dot animation marks are in memory only.

## XP, levels and badges

The owner asked for the quizzes to be more of a game. Three things, all derived from or kept next to the state:

- **XP is worked out, not stored:** 10 per right answer that teaches something (`qs[].xp`: the first time a question is answered right, right after a miss, or right when it was due for review; the owner chose this so redoing step practice or retakes doesn't farm XP; `learn()` decides, and entries from before the rule keep `xp = right`), 5 per completed step, 100 per day quiz passed, plus what each badge earned is worth (`xpTotal()`). So syncing and merging need no rules for it, and progress from before XP existed counts.
- **Levels:** level n starts at 40·n·(n−1) XP (80 for level 2, 3,600 for level 10); the plan adds up to about level 20. A title every two levels, "Cloud curious" to "Solutions architect" (`RANKS`). `lvShown` is the level on screen; `showGains()` announces a higher one, and `syncLevel()` (in `rebuild()`) follows a level that changed by import, reset or another device without announcing it.
- **Badges** (`ACH`): 15, each earned once with its date in `S.ach`. Most are read from the state (`achCtx()`), so `award()` earns those quietly for progress that arrives without them: at boot (without saving: a save before the first sync would make a stale copy look newer than the server's and win the merge), after an import, and after a copy from the server or another tab (`applyState`). The streak ones (`row`) only while answering. A level is announced once per session (`lvShown` only goes up), so an untick or a merge that takes XP away for a while doesn't announce it again.
- **Daily goal and weekly challenges** (the owner chose both). The overview's goal card (under the Start/Continue card) has a ring meter of today's XP against the goal (⚙ Settings, 100–600, default 200; a day's steps with its quiz are worth about 400) and the week's three challenges with a meter each. Today's XP is `xpTotal()` minus the total stamped when the day was first seen (`xpDay`); the week's challenges measure counters (`counters()`: answers, right answers, XP, days, steps, focus minutes, fixed notebook questions, warm-ups, drill runs, key points got in Test me) from the values stamped on Monday (`week.base`). The three are drawn from the week's date, one from each group (`pickChal`), skipping one the plan no longer leaves room for (`can`), so every device draws the same. Stamping waits for the first sync try (`ready`, `markReady()` after `pull()`), so a copy that is behind can't stamp a starting point that is too low; merges keep the stamp made first (`at`). `checkGoals()` runs inside `showGains()`: reaching the goal or a challenge drops a badge once (`xpDay[].hit`, `chal`), and each challenge adds 50 XP to `xpTotal()`. A run of days with the goal reached shows under the ring.
- **"New record"** compares with your longest run from before the quiz (`run.best0`), needs a best of 3 or more, and is said once a quiz (`run.rec`).
- **Bounds:** answer counts are whole numbers with `right` between 0 and `seen` (at most a million), the record at most 1,000, a run's streak at most its length, a day's logged time at most 24 h, badge dates real dates; `levelOf` caps XP. A huge or negative number in an import can't freeze the page or show NaN. The overview has a Level cell (it opens the badges sheet) and a card in the practice panel.

**Results GIFs** (`site/gifs.js`, `window.GIFS`): ten South Park GIFs per outcome, ace (every answer right), pass, fail (`outcome()`: the pass mark on a day quiz, 72% on a mock, 60% elsewhere). One is chosen when the quiz finishes (`pickGif`, kept in `run.gif`, so a reload shows the same one), taken in turn (`ui.gif` in `saa-plan-v2-ui` remembers where each list is, per browser), loaded from GIPHY's CDN and never stored in the repo. A GIF that fails to load, or hasn't arrived after 20 s, removes itself, so the results still read right offline. Stars: 3 for every answer right, 2 at 95% on a day quiz or 80% elsewhere, 1 for a pass, 0 below.

## Focus timer

A focus block counts down from 50 minutes and logs its minutes to the day it was started on (`timer.day`, set at each start; `logFocus`), so two devices that both see a block end credit the same day and the max-per-day merge counts it once. When it ends, `timer.ask` is set and the break pop-up (`#brk`, `brkOpen("done")`) offers a break or another block; `ask` makes the prompt show in every tab, come back after a reload, and close everywhere once it is answered (Esc counts as "not now"). The break has no set length: it counts up. From 10 minutes on (`REST_NAG`) the 1-second ticker reminds you once a minute to start focusing: if the pop-up is not up, it opens (`brkOpen("over")`); the knocking sound plays every minute either way, so pop-ups never stack. The minutes are counted per break stretch (`<timer.at>:<minute>`), so a break started or resumed anywhere starts its own count and a resumed overdue break reminds at once; `NAG_KEY` in localStorage lets this browser's tabs play the sound once between them. While the mock exam or the drill is running in the quiz dialog (`inTimed()`), the pop-ups wait (`overHeld`, `timer.ask`) and come up once it is closed or over; the reminder sound still plays each minute (the owner's choice). The pop-up offers "Pause the break" (the timer under a modal can't be clicked), "Not yet" (until the next minute) and "Start focus". It is a modal of its own and comes up even over an open quiz (the quiz keys wait while it is up). The keyboard goes to its heading, not a button, and a click in its first 400 ms is ignored, so a key or click meant for something else doesn't answer it. A pop-up that no longer fits the timer (another tab or device moved it on) closes itself. Pausing at 00:00 and resuming starts a new block. An import starts the timer idle. Browsers keep sound off after a reload until the first click or key anywhere; the page unlocks it then.

**The strip.** The timer is a thin strip along the top of the page (`#timer`, sticky): a 4 px bar fills as the block runs (a break fills towards its 10 minutes, then turns red), and a chip on the right holds ▶/❚❚ and the time. Clicking the time opens a small menu (`tmMenu`): Reset, Break now / Focus now, the minutes logged for the day, and the button that asks for notifications and idle detection.

**Starts by itself** (`autoFocus`, the owner's rule): Start/Continue Day on the overview, Start Day on a day's summary (`data-start-day`) and Mark complete start a 50-minute block, unless one is running (a paused block resumes) or you are on a break (a running or paused break, or the "done" prompt waiting). A break mode that was never started doesn't count as a break.

**Away.** The owner works on two monitors, each with a full-screen Edge window, so the page stays "visible" and focused-looking while they work in the other window: visibility and focus can't tell that they left. The PC's own signals can. With Edge's idle detection allowed (`IdleDetector`, threshold 5 minutes, the time after which the owner's screen goes off), "idle" or "locked" marks `timer.away` (the moment input stopped). A sleeping or hibernating PC stops the page, so the 1-second ticker also treats a clock jump of more than 5 minutes as away from the last tick. While `away` is set the block can't end. On return (active again, not inside the mock or the drill) the "Welcome back" pop-up asks: "Count it" clears `away`; "Don't count it" moves `endAt` so the block resumes with the time it had when you left (the log then credits only the time you were there); Esc counts it. A false alarm (reading without touching the mouse for 5 minutes) costs one click.

**Notifications.** With permission, the block's end and each break reminder also show a Windows notification (`tag: "saa-timer"`, so one replaces the last), but only when this window isn't the one in use (`document.hasFocus()`), so a prompt on one monitor is seen from the other.

## Day completion

`dayDone(d) = all items complete && quizOk(d)`. `quizOk` is true for days without a quiz or when `quiz[d].passed` is set (27 of 30). `markDayDone` keeps `S.dayDone` in step and runs at boot, on ticks, after quizzes and after state replacement. Progress percentages count each day's quiz as one step.

## Quiz lifecycle

1. **Prompt.** Completing the last open step of a day moves to the day's quiz card, whose main action is Start quiz (Enter works). There is no pop-up: the card is the prompt. A pending quiz can also be started from the overview's Start/Continue card. The mock exam still uses an intro screen (`intro` object) in the quiz dialog.
2. **Start.** `startRun(kind, of)` picks questions (`QZ.pickDay` / `pickMock` / `pickWarmup` / `pickReview` / `pickStep`) and stores an option order per question. `of` is the day id for a day quiz and the step id for step practice. It saves `S.run = {kind, day, item, ids, ord, ans, flag, i, t0, end, done, view, seen, only, score, mins, cel, mockNew, res, row, rowMax, best0, rec, xp0, xp1, gif}` (`row`/`rowMax` = right answers in a row now and at most, `best0` = your longest run when it started, `rec` = "New record" said, `xp0`/`xp1` = XP at the start and the finish, `gif` = the results GIF, chosen at the finish). Only one run exists at a time; starting another asks to drop the unfinished one.
3. **Answer** (day/review/warm-up/step practice). Selecting options fills `sel`; "Check" records `run.ans[id]` and calls `learn()`, which updates `qs`, `srs` and `book`. The feedback view shows every option's explanation and up to three study refs (`studyRefs`: the steps the question names, then the steps that teach its main topic; lectures first, then labs, builds and self-checks, in the plan's order). Progress persists after each answer, so closing or reloading resumes.
   Options picked but not yet checked are kept per question in memory (`picks`), so moving away and back keeps a half-made "(Choose two.)" pick and a pick never lands on another question. **Enter** checks or moves on; on an option alone it does nothing (Space or A–E pick), so a focused option is never picked by accident.
   **Moving around** works like the day flow: ← Previous and Next → move one question either way and never answer (`goQ`), so a question can be skipped and come back to; a row of squares above the question (right, wrong, open) jumps to any of them. After Check, the main button goes on to the next question still open after this one, wrapping round (`nextOpen`), and reads "See results" once every question is answered. An answered question shows its feedback again, read-only.
4. **Mock.** Selections save immediately with no feedback. The page offers a flag/review grid and a 130-minute clock (`run.end`). A 1-second ticker submits when time is up (`finishMock(true)`), even with the dialog closed or after a reload.
5. **Finish.** `finishRun` / `finishMock` compute the score and `award()` the badges it earns. A day quiz records the try, sets `passed` at 27 or more, and works out which celebration is due (`cel`: day/week/all). It also sets `mockNew` when that pass unlocks the mock. The run stays in `S.run` with `done: true`.
6. **Results.** Rendering results sets `run.seen = true`. Closing the dialog calls `finishResults()`, which clears the run and then celebrates; that order matters because the canvas sits below the modal. If the pass completed the day on screen, it then moves to the day's summary card. If a finished run was never on screen (time ran out behind the drill, or a reload), the close handler and boot reopen it first, so results are never lost.

The drill keeps its state in memory only (`drill`), runs in the same dialog, and must not close the dialog when restarting: a late `close` event would stop the new drill. The close handler starts with `if (qzDlg.open) return`.

**Drill modes** (`DRILL_MODES`; the owner chose the three new ones): *60 seconds* (a requirement, four services), *Reverse* (60 seconds, a service and four requirements; the wrong ones are the requirements of the services it is confused with, `it[2]`, then of its neighbours in the list, `revOpts`), *Three lives* (no clock, until the third miss) and *Daily five* (five items drawn with a seeded shuffle of the date, the same all day and on every device; the first try is the day's result, `drill.day[date]`, and a run of days shows on the result). Each has its own best on the practice card; the drill's badge stays with the 60-second mode.

**The mock exam screen** works like an exam screen (the owner asked for it): ⚐ flag for review; click a word of the question to highlight it, drag over several to highlight them all (or clear them when all were highlighted; `mkWords()` numbers the words of the question in reading order, `run.hl[id]` keeps the numbers); ⊘ beside each option, or Shift + its number, strikes it out (`run.x[id]`; picking a struck option brings it back, striking the picked one unpicks it); the clock is always in the header, turns red in the last 10 minutes and says so with a toast at 10 minutes and at 1 minute (once each per tab, `mkWarned`); the review screen filters to the flagged or the unanswered questions (`gridF`). Highlights and strike-outs are part of the run, so they survive a reload and are cleaned like the rest of it (`cleanRun`).

**Dialog queue.** `whenFree(fn)` runs `fn` now if no `<dialog>` is open, otherwise queues it. Every dialog's `close` calls `runPending()`.

**Keyboard.** A document-level `keydown` handler applies while the quiz dialog is open. Re-rendering removes the focused button, which drops focus to `<body>`, so a dialog-level listener would miss keys. A–E or 1–5 pick options, Enter checks or moves on, ← and → move between questions. Not while the break reminder is up over the quiz. Enter on a focused button or link other than an option presses that control. `focusMain()` puts focus on the main action after rendering.

## Selection rules (qcore.js)

- **Tiers:** never seen → wrong last time → seen longest ago, shuffled inside each tier (`rank`).
- **A day of new material (`quiz: "tags"`):** 30 questions that are about one of the day's topics and about nothing taught later (`dayPool`: any tag in `own`, every tag in `sofar`), never from the mock pool. Order: questions you have not seen, the foundation-level pools before the exam-level ones; then the usual tiers. A day with fewer than 30 of its own is filled from earlier topics.
- **Review day (`"review"`):** 30 by tier from every question whose topics have all been taught.
- **Exam-domain day (`"dom:1,2"`):** split evenly between the named domains, from all study questions. **Exam-weighted day (`"exam"`):** split 9/8/7/6 by domain.
- **Weak-topics day (`"weak"`):** questions scored by tag weakness plus a bonus for misses, at most 6 per tag.
- **Mock:** per domain [20,17,15,13]. Unseen mock questions come first, then unseen study questions, then misses, then the oldest seen.
- **Spaced repetition:** a miss is due again in 1 day. A correct answer counts only once the question is due, and moves it on to 2 days, then 4, then retires it. Another miss resets it to step 0.
- **Warm-up:** up to 5 questions, due reviews first, then misses from yesterday. Offered once a day from Day 2 on. **Review:** up to 15 due questions.
- **Step practice:** up to 3 questions for one step (`forStep`): those that name it in `ref`, then those with one of its topics as their main topic, then as a side topic; the mock pool last, so practice does not use up the mock exam. Inside each group the usual tier order. Answers count like any other: stats, review queue and notebook.

## Dates and slip guard

`dayDate(n) = start + (n-1) + Σ slips where n ≥ from`. `todayIdx()` finds the last day whose date is on or before today (0 or less before the start, more than the last day's number after the end). Dates use local midnight, and `setDate` handles DST. When the earliest unfinished day's date has passed, a banner offers to push it and all later days by the number of days missed. Settings can undo all moves. If the last day lands after `settings.exam`, a warning pill appears.

## Sync protocol

**Server:** `GET /api/state` → `{rev, doc|null, savedAt}`. `PUT /api/state {rev, doc}` → `200 {rev: rev+1}` when `rev` matches, otherwise `409` with the current state. One SQLite row; `MaxOpenConns(1)` plus a transaction serialises the read-check-write.

**Client** (`app.js`, "server sync" section):
- localStorage is the working copy. `save()` bumps `savedAt` and `sync.n` (the save counter), marks the state dirty, and debounces a `push()` by 800 ms.
- `pull()` runs at boot and whenever the tab becomes visible. `sync.on` turns true only once a JSON API answers, so a static preview never pushes.
- When the server has a revision this copy hasn't seen, `absorb()` decides:
  - This copy is unchanged: take the server copy.
  - Both copies changed: `mergeDocs()` combines them, and the result is pushed.
- The merge rules:
  - **Ticks:** union of both copies.
  - **Day notes, step notes, scores, flip-card marks, warm-ups:** the newer copy wins, and blanks are filled from the older one.
  - **Day-done dates:** the earliest date.
  - **Quiz results:** the higher best score, the earliest pass, and the longer list of tries.
  - **Per question:** answer stats, review queue entry and notebook entry come from the copy that has answered that question more often.
  - **Mock results:** union.
  - **Study time:** the maximum per day.
  - **Drill record:** the maximums.
  - **Settings and schedule moves:** from the newer copy. **Timer:** from the copy whose timer changed last (`timer.ts`), so a stale device saving something else doesn't stop a block running on another.
  - **The run:** the one on this screen.
  - **Badges:** union, the earlier date. **Longest run of right answers:** the maximum.
- A 409 during a push leads to `absorb`, then another push. "Dirty" is cleared only if no save happened while the request was in flight.
- Other tabs: the `storage` event replaces S with the other tab's save, keeping this tab's run if its quiz dialog is open. Sync bookkeeping (`saa-plan-v2-sync`: rev, dirty) is shared the same way.
- First sync of a browser that has progress but no sync key (from before the server existed) counts as dirty, so it merges rather than being replaced.
- Unticking an item on one device can be undone by a merge with another device's unsynced copy. Ticks are a union, an accepted trade-off.

## Server (server/main.go, store.go)

- **Config** (env): `ADDR` (`:8080`), `SITE_DIR` (`../site`, `/srv/site` in the image), `DB_PATH` (`data/saa.db`, `/data/saa.db` in the image), `ALLOWED_HOSTS` (host names, no port; default `localhost,127.0.0.1,::1`).
- **`guard` middleware:**
  - Security headers on every response: a CSP with `script-src 'self'`, Google Fonts and images from `media.giphy.com` (the results GIFs) allowed, nosniff, frame DENY, no-referrer, COOP/CORP, and a Permissions-Policy.
  - An unknown `Host` gets 421. This blocks DNS rebinding. `/healthz` skips the check.
  - Non-GET requests with `Sec-Fetch-Site` other than `same-origin`, or a foreign `Origin`, get 403 (CSRF).
  - PUT requires `Content-Type: application/json`, so a cross-origin page would need a CORS preflight, which is never approved. Bodies are capped at 4 MB, the doc must be a JSON object, and `rev` must be present and 0 or more.
- **Static files:** served with `Cache-Control: no-cache` (304s via Last-Modified). Directories without `index.html` return 404, so there are no listings.
- **Health and shutdown:** `-healthcheck` probes `/healthz`, which the distroless image needs because it has no shell or wget. Shutdown waits for in-flight requests before closing the database.
- **Tests:** `main_test.go` covers the round trip, the 409, persistence across reopen, validation codes, guard cases, static headers, no listing and traversal.

## Container

The build has two stages: `golang:1.27-alpine` builds a static binary (`CGO_ENABLED=0`), and `gcr.io/distroless/static-debian12:nonroot` runs it as uid 65532. `/data` is created owned by 65532, so the named volume starts writable. `compose.yaml` binds to 127.0.0.1 only and sets `read_only`, `cap_drop: [ALL]`, `no-new-privileges` and `restart: unless-stopped`. The image is about 25 MB.

## Decisions and why

- **The quiz gates day completion at 90%:** the owner asked for it. It turns ticking into demonstrated recall.
- **The last day has no quiz:** it's exam day, and the plan says light review only. **Days 1 and 2 have none either:** they are account setup and the beginner course, which has its own knowledge checks and assessment. **The mock unlocks after the lectures and labs (Day 17):** the bank holds two full mock exams, and the exam-prep days are when they are useful.
- **Feedback after every answer in day quizzes, none until the end in the mock:** the first is for learning, the second mirrors the exam.
- **A quiz follows the day's topics, not a fixed pool:** the plan was rebuilt on AWS's own Solutions Architect learning plan (lectures, then their labs), and it should be possible to move a course to another day without rewriting questions. So questions carry topics, steps name the topics they teach, and the engine joins the two. The rule "nothing taught later" keeps the 90% gate fair.
- **Foundation-level questions before exam-level ones on a day of new material:** the first time a topic comes up, the simpler questions teach more; the exam-level ones are met in the reviews and the exam-prep days at the latest.
- **One step per card, no checklist:** the owner gets discouraged by a list of tasks and focuses when only one is on screen. The days stay visible as tiles on the overview, but a day's steps are only ever shown one at a time (plus the dot strip for orientation).
- **Mark complete goes to the next open step, Next goes to the next card:** completing should always land on work that is left; Next exists to skip a step you can't do yet (a lab that will not start, say) without marking it.
- **The plan's AWS account is on the Paid plan, with an IAM admin user:** the first version kept it on the Free plan (the owner chose free labs over practising Identity Center hands-on, because enabling Identity Center creates an AWS Organization and that upgrades a Free plan account). On 2026-10-13 the owner found that the Skill Builder subscription is billed to the AWS account and cannot be bought on the Free plan, and upgraded. Day 1 therefore creates the account first, on the Paid plan, then buys the subscription, and sets two budgets, because an alert on actual spend fires only once a month and the subscription's own charge uses up the zero spend budget. The IAM admin user stays (simplest for one person and one account); Identity Center remains a reading block, with enabling it now optional.
- **Days are not locked:** the plan already supports working ahead and catching up, and a locked tile would block both.
- **The card on screen lives in the URL hash, not in the state:** a reload or a shared link reopens the same card, the browser's Back works, and two devices can sit on different cards without fighting over a synced field.
- **Docs, topics, terms and exam wording on a card are derived, not authored:** they come from the step's topics and the quiz questions on them, so they stay right when questions change. Only the key points and the step's topics are written per step (`docs/keypoints.md`).
- **Lectures first, then their labs, in AWS's order:** the owner asked for the regular lectures followed by the lab version of the same training. A course is never split from its labs by another course.
- **AWS Technical Essentials in front (Days 1 and 2):** the owner has no AWS experience, and every course of the Solutions Architect plan lists this free four-hour course as recommended previous knowledge. The first version of the 21-day plan left it out because only the course outlines had been read, not their "Recommended previous knowledge"; the owner noticed. Its six modules are six cards with key points of their own, written at beginner level. They carry no `STEP_TAGS`, so they open no topics for the day quizzes: the first quiz is still on Day 3, on what Fundamentals of Architecting taught.
- **A reading block for in-scope services no lecture covers (`r1a`–`r1d`):** an audit of the exam guide's in-scope list against the plan found the machine learning services and several management, migration and database services untaught. One paragraph each on the AWS overview whitepaper is the proportionate fix.
- **A Go server replaces nginx:** one container and one process. The owner prefers Go, and SQLite needs no separate database service. Static hosting (`python3 -m http.server`, or S3/CloudFront later) still works in browser-only mode.
- **The quiz engine is split into `qcore.js`:** pure logic, so Node can test selection, grading and spaced repetition without a browser.
- **The break counts up, and nags after 10 minutes:** the owner asked for a prompt to take a break after 50 minutes of focus, with no fixed break length, and a reminder every minute once the break passes 10 minutes: sound each minute, the pop-up only when it isn't already up.
- **XP is derived, badges are stored:** XP from what the state already holds needs no sync rules and can't drift; a badge needs its date and must not be lost in a merge, so it is a small map merged as a union (like ticks, a badge cleared by Reset comes back from a device that still has it).
- **GIFs from GIPHY, not in the repo:** the owner asked for South Park GIFs on the results. They are copyrighted clips, so the page links GIPHY's copies (the official South Park channel, mostly) instead of storing them, and the CSP allows that one image host and nothing else.
- **The mock score is shown as a percentage, not a scaled score:** AWS doesn't publish its raw-to-scaled mapping. 80% is a rule of thumb, stated as such in the UI.
