# Architecture

A single-user study tracker. The browser does all the work; the server only stores one JSON document. Everything works without the server (browser-only mode), and the server adds durability and cross-browser sync.

```
browser ─ index.html loads, in order:
          plan.js → quiz/meta.js → quiz/d01…d11.js, mock1–2.js → extras.js → qcore.js → fx.js → app.js
          app.js: state S (localStorage "saa-plan-v2") ── GET/PUT /api/state ──► Go server ── SQLite (/data/saa.db)
```

## Files and responsibilities

- **Data files** (`plan.js`, `quiz/*.js`, `extras.js`) hold no logic. They assign or push onto `window.*` globals.
- **`qcore.js`** holds the quiz logic with no DOM: picking, shuffling, grading, spaced repetition, weak-spot aggregation and mock scoring. Constants: `DAILY` 30, `PASS` 0.9, `MOCK` {65 questions, 130 min, split [20,17,15,13]}, `MIX` [9,8,7,6], `SRS_DAYS` [1,2,4]. Node tests load it through `tests/load.mjs`, a vm sandbox with a fake `window`.
- **`app.js`** is one IIFE that owns the state and all UI. Its sections, in order: state and validation, indexes, dates, dialog queue, glossary, render, refresh/status, slip guard, next up, ticking/celebrations, scores, practice panel, quizzes (shared, day/review/warm-up, mock, drill), quiz dialog events, sheets (notebook, weak spots, cues), cleanup dialog, plan events, header, settings, focus timer, server sync, boot.
- **`server/`** is a Go module (stdlib plus `modernc.org/sqlite`, pure Go, no cgo). It serves `site/` and the API.

## State (`DEF` in app.js)

| Field | Shape | Meaning |
|---|---|---|
| `ticks` | `{itemId: true}` | ticked plan steps |
| `notes`, `scores` | `{dayId: text}`, `{key: value}` | day notes; 📊 Scores inputs |
| `dayDone` | `{dayId: "YYYY-MM-DD"}` | date a day became complete (drives the streak) |
| `quiz` | `{dayId: {best, passed, tries:[{at,score,n}]}}` | day quiz results; `passed` is a date or "" |
| `qs` | `{qid: {seen, right, last, at}}` | per-question answer stats (weak spots, selection tiers) |
| `srs` | `{qid: {step, due}}` | missed questions waiting for review |
| `book` | `{qid: {at, misses, note, fixed}}` | wrong-answer notebook |
| `run` | object or null | quiz/mock in progress or on its results screen (see below) |
| `mocks` | `[{at, score, n, pct, dom, mins}]` | finished mock exams |
| `conf` | `{checkItemId: "ok"\|"shaky"}` | flip-card self-assessment |
| `log` | `{dayId: minutes}` | focus-timer time credited to the day being worked on |
| `warm` | `{date: "done"\|"skip"}` | warm-up handled that day |
| `slips`, `slipSkip` | `[{from, n}]`, date | schedule shifts; "Not now" date |
| `drill` | `{best, runs}` | "Which service?" record |
| `settings` | `{start, portal, exam, fx, sound, hideDone}` | Day 1 date, access portal URL, booked exam date, toggles |
| `timer` | `{mode, running, endAt, left, from, min}` | focus timer; `from` = seconds left when started (for the log) |
| `savedAt` | ms timestamp | last local save (sync conflict tie-breaker) |

**Every entry point validates state.** That covers load from localStorage, import, the server copy and other tabs' saves, all through `parseState = clean(merge(clone(DEF), obj))`. `merge` only accepts values whose type matches the default, and `clean` validates each entry inside the maps, the run and the timer. So a bad file can't break rendering or inject markup. New top-level fields need a default in `DEF` and, for maps, a rule in `clean()`.

Ids are permanent keys: plan item ids key `ticks`, `conf` and `notes`; question ids key `qs`, `srs` and `book`. Unknown ids are ignored (`QBY` lookups) and pruned from runs (`pruneRun`).

## Day completion

`dayDone(d) = all items ticked && quizOk(d)`. `quizOk` is true for days without a quiz (Day 14) or when `quiz[d].passed` is set (27 of 30). `markDayDone` keeps `S.dayDone` in step and runs at boot, on ticks, after quizzes and after state replacement. Progress percentages count each day's quiz as one step.

## Quiz lifecycle

1. **Prompt.** When the last item of a day is ticked, `setTick` queues `promptQuiz(d)` through `whenFree`, after the cleanup dialog if one is open. That shows an intro screen (`intro` object) in the quiz dialog. Quizzes can also be started from the day's quiz row, Next up, or the Practice panel.
2. **Start.** `startRun(kind, dayId)` picks questions (`QZ.pickDay` / `pickMock` / `pickWarmup` / `pickReview`) and stores an option order per question. It saves `S.run = {kind, day, ids, ord, ans, flag, i, t0, end, done, view, seen, only, score, mins, cel, mockNew, res}`. Only one run exists at a time; starting another asks to drop the unfinished one.
3. **Answer** (day/review/warm-up). Selecting options fills `sel`; "Check" records `run.ans[id]` and calls `learn()`, which updates `qs`, `srs` and `book`. The feedback view shows every option's explanation and the study refs (`studyRefs` sorts Skill Builder steps first). Progress persists after each answer, so closing or reloading resumes.
4. **Mock.** Selections save immediately with no feedback. The page offers a flag/review grid and a 130-minute clock (`run.end`). A 1-second ticker submits when time is up (`finishMock(true)`), even with the dialog closed or after a reload.
5. **Finish.** `finishRun` / `finishMock` compute the score. A day quiz records the try, sets `passed` at 27 or more, and works out which celebration is due (`cel`: day/week/all). It also sets `mockNew` when Day 13's pass unlocks the mock. The run stays in `S.run` with `done: true`.
6. **Results.** Rendering results sets `run.seen = true`. Closing the dialog calls `finishResults()`, which clears the run and then celebrates; that order matters because the canvas sits below the modal. If a finished run was never on screen (time ran out behind the drill, or a reload), the close handler and boot reopen it first, so results are never lost.

The drill keeps its state in memory only (`drill`), runs in the same dialog, and must not close the dialog when restarting: a late `close` event would stop the new drill. The close handler starts with `if (qzDlg.open) return`.

**Dialog queue.** `whenFree(fn)` runs `fn` now if no `<dialog>` is open, otherwise queues it. Every dialog's `close` calls `runPending()`.

**Keyboard.** A document-level `keydown` handler applies while the quiz dialog is open. Re-rendering removes the focused button, which drops focus to `<body>`, so a dialog-level listener would miss keys. A–E or 1–5 pick options, and Enter checks or moves on. Enter on a focused button or link other than an option presses that control. `focusMain()` puts focus on the main action after rendering.

## Selection rules (qcore.js)

- **Tiers:** never seen → wrong last time → seen longest ago, shuffled inside each tier (`rank`).
- **Day 1–6 and 8–11 quizzes:** 30 from that day's pool, by tier.
- **Day 7:** 5 each from Days 1–6.
- **Day 13:** split 9/8/7/6 by domain, from Days 1–11.
- **Day 12:** questions scored by tag weakness plus a bonus for misses, at most 6 per tag.
- **Mock:** per domain [20,17,15,13]. Unseen mock questions come first, then unseen study questions, then misses, then the oldest seen.
- **Spaced repetition:** a miss is due again in 1 day. A correct answer counts only once the question is due, and moves it on to 2 days, then 4, then retires it. Another miss resets it to step 0.
- **Warm-up:** up to 5 questions, due reviews first, then misses from yesterday. Offered once a day from Day 2 on. **Review:** up to 15 due questions.

## Dates and slip guard

`dayDate(n) = start + (n-1) + Σ slips where n ≥ from`. `todayIdx()` finds the last day whose date is on or before today (0 or less before the start, over 14 after the end). Dates use local midnight, and `setDate` handles DST. When the earliest unfinished day's date has passed, a banner offers to push it and all later days by the number of days missed. Settings can undo all moves. If Day 14 lands after `settings.exam`, a warning pill appears.

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
  - **Notes, scores, flip-card marks, warm-ups:** the newer copy wins, and blanks are filled from the older one.
  - **Day-done dates:** the earliest date.
  - **Quiz results:** the higher best score, the earliest pass, and the longer list of tries.
  - **Per question:** answer stats, review queue entry and notebook entry come from the copy that has answered that question more often.
  - **Mock results:** union.
  - **Study time:** the maximum per day.
  - **Drill record:** the maximums.
  - **Settings, timer and schedule moves:** from the newer copy.
  - **The run:** the one on this screen.
- A 409 during a push leads to `absorb`, then another push. "Dirty" is cleared only if no save happened while the request was in flight.
- Other tabs: the `storage` event replaces S with the other tab's save, keeping this tab's run if its quiz dialog is open. Sync bookkeeping (`saa-plan-v2-sync`: rev, dirty) is shared the same way.
- First sync of a browser that has progress but no sync key (from before the server existed) counts as dirty, so it merges rather than being replaced.
- Unticking an item on one device can be undone by a merge with another device's unsynced copy. Ticks are a union, an accepted trade-off.

## Server (server/main.go, store.go)

- **Config** (env): `ADDR` (`:8080`), `SITE_DIR` (`../site`, `/srv/site` in the image), `DB_PATH` (`data/saa.db`, `/data/saa.db` in the image), `ALLOWED_HOSTS` (host names, no port; default `localhost,127.0.0.1,::1`).
- **`guard` middleware:**
  - Security headers on every response: a CSP with `script-src 'self'` and Google Fonts allowed, nosniff, frame DENY, no-referrer, COOP/CORP, and a Permissions-Policy.
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
- **Day 14 has no quiz:** it's exam day, and the plan says light review only. **The mock unlocks after Days 1–13:** the owner asked for "a mock after I finish all".
- **Feedback after every answer in day quizzes, none until the end in the mock:** the first is for learning, the second mirrors the exam.
- **50 questions per study day:** retakes draw different questions (owner request) while missed ones still come back.
- **A Go server replaces nginx:** one container and one process. The owner prefers Go, and SQLite needs no separate database service. Static hosting (`python3 -m http.server`, or S3/CloudFront later) still works in browser-only mode.
- **The quiz engine is split into `qcore.js`:** pure logic, so Node can test selection, grading and spaced repetition without a browser.
- **The mock score is shown as a percentage, not a scaled score:** AWS doesn't publish its raw-to-scaled mapping. 80% is a rule of thumb, stated as such in the UI.
