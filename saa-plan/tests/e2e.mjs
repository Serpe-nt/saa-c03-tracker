// End-to-end check of the real page in headless Chromium.
// Needs the site served (Go server for the sync checks) and Playwright installed globally:
//   NODE_PATH=$(npm root -g) BASE=http://localhost:8080/ node tests/e2e.mjs
// Writes screenshots to $SHOTS (default: a temp folder). Exits non-zero on the first failure.
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://localhost:8080/";
const SHOTS = process.env.SHOTS || fs.mkdtempSync(path.join(os.tmpdir(), "saa-shots-"));
const KEY = "saa-plan-v2";
const browser = await chromium.launch();
const errors = [];
let step = "";
const t0 = Date.now();
function log(s) { step = s; console.log(`· ${s}`); }

async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, ...opts });
  const page = await ctx.newPage();
  page.on("console", m => { if (m.type() === "error") errors.push(`[${step}] ${m.text()}`); });
  page.on("pageerror", e => errors.push(`[${step}] ${e.message}`));
  page.on("dialog", d => d.accept());
  return { ctx, page };
}
const openPanel = (page, id) => page.evaluate(id => { document.getElementById(id).open = true; }, id);
const state = page => page.evaluate(k => JSON.parse(localStorage.getItem(k) || "null"), KEY);
async function setState(page, fn) {
  await page.evaluate(([k, src]) => {
    const s = JSON.parse(localStorage.getItem(k) || "{}");
    new Function("s", src)(s);
    localStorage.setItem(k, JSON.stringify(s));
  }, [KEY, `(${fn})(s)`]);
}
// Mark a day's items ticked straight in storage (the UI path is tested on Day 1).
const tickDays = (page, days) => page.evaluate(([k, days]) => {
  const s = JSON.parse(localStorage.getItem(k) || "{}");
  s.ticks = s.ticks || {};
  for (const d of window.PLAN) if (d.id && days.includes(d.day)) for (const g of d.groups) for (const it of g.items) s.ticks[it[0]] = true;
  localStorage.setItem(k, JSON.stringify(s));
}, [KEY, days]);

// Answer the question on screen: right or wrong, by reading the key from window.QUIZ.
async function answer(page, right = true) {
  const s = await state(page);
  const id = s.run.ids[s.run.i];
  const q = await page.evaluate(id => window.QUIZ.find(x => x.id === id), id);
  const picks = right ? q.a : [...Array(q.o.length).keys()].filter(i => !q.a.includes(i)).slice(0, q.a.length);
  for (const oi of picks) await page.click(`#qz-body [data-o="${oi}"]`);
  return { id, q };
}

try {
  // ---------- first visit ----------
  log("first visit renders, bank loaded");
  let { ctx, page } = await newPage();
  // Run against a fresh server database: the page uploads this browser's state on first sync.
  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await setState(page, s => { s.settings = { start: new Date().toISOString().slice(0, 10), fx: false, sound: false }; });
  await page.reload();
  const bank = await page.evaluate(() => ({ n: window.QUIZ.length, days: [...new Set(window.QUIZ.map(q => q.day))] }));
  console.log(`  bank: ${bank.n} questions, pools ${bank.days.join(",")}`);
  assert.ok(bank.n >= 300, "question bank should be loaded");
  assert.equal(await page.locator("details.day").count(), 14);
  assert.equal(await page.locator(".quizrow").count(), 13, "Days 1-13 have a quiz row");
  assert.ok(await page.locator('[data-quiz-start="d1"]').isDisabled(), "quiz locked before the day's steps are ticked");
  await page.screenshot({ path: path.join(SHOTS, "01-home.png"), fullPage: false });

  // ---------- flip card ----------
  log("self-check flip card: reveal, mark shaky");
  await openPanel(page, "d1");
  await page.click('[data-flip="d1c6"]');
  assert.ok(await page.locator("#ca-d1c6").isVisible());
  await page.click('[data-conf="shaky"][data-cid="d1c6"]');
  assert.equal((await state(page)).conf.d1c6, "shaky");
  assert.ok((await state(page)).ticks.d1c6, "marking a card ticks the item");
  assert.match(await page.textContent('[data-flip="d1c6"]'), /Shaky/);

  // ---------- Day 1 through the UI, then pass the quiz ----------
  log("tick every Day 1 step → quiz prompt");
  const boxes = page.locator('details#d1 input[type="checkbox"]:not(:checked)');
  while (await boxes.count()) await boxes.first().check();
  await page.waitForSelector("#quiz[open]", { timeout: 5000 });
  assert.match(await page.textContent("#qz-body"), /end-of-day quiz/i);
  await page.screenshot({ path: path.join(SHOTS, "02-quiz-intro.png") });
  await page.click('#qz-body [data-qz="go"]');

  log("answer 30 questions right, with feedback after each");
  for (let i = 0; i < 30; i++) {
    await answer(page, true);
    if (i === 0) {
      // keyboard path on the first one: Enter checks
      await page.keyboard.press("Enter");
    } else await page.click('#qz-body [data-qz="check"]');
    await page.waitForSelector("#qz-body .qz-verdict.ok");
    if (i === 0) {
      assert.ok(await page.locator("#qz-body .qz-study .qz-refs li").count() >= 1, "feedback shows where to study");
      // every option is explained, and the explanation sits visibly inside its option
      const inside = await page.$$eval("#qz-body .qz-fb li", lis => lis.map(li => {
        const w = li.querySelector(".qz-why"); if (!w) return false;
        const a = li.getBoundingClientRect(), b = w.getBoundingClientRect();
        return b.height > 0 && b.top >= a.top && b.bottom <= a.bottom + 1 && b.left >= a.left && b.right <= a.right + 1;
      }));
      assert.ok(inside.length >= 4 && inside.every(Boolean), "every option shows its explanation inside the option");
      await page.screenshot({ path: path.join(SHOTS, "03-feedback-right.png") });
    }
    await page.click('#qz-body [data-qz="next"]');
  }
  await page.waitForSelector("#qz-body .qz-res.ok");
  assert.match(await page.textContent("#qz-body .qz-score"), /30/);
  await page.screenshot({ path: path.join(SHOTS, "04-result-pass.png") });
  await page.click('#qz-body [data-qz="finish"]');
  await page.waitForTimeout(300);
  assert.equal(await page.getAttribute("details#d1", "data-complete"), "1", "passing the quiz completes the day");
  let s = await state(page);
  assert.ok(s.quiz.d1.passed && s.quiz.d1.best === 30);
  assert.ok(s.dayDone.d1);

  // ---------- Day 2: fail, then retake shows new questions ----------
  log("Day 2: miss 4 → fail at 26/30, notebook + review queue filled");
  await tickDays(page, [2]);
  await page.reload();
  assert.equal(await page.getAttribute("details#d2", "data-quiz"), "1", "day shows quiz pending");
  assert.equal(await page.getAttribute("details#d2", "data-complete"), "0");
  await page.click('#next [data-quiz-start="d2"]');
  const first = (await state(page)).run.ids.slice();
  assert.equal(first.length, 30);
  assert.equal(new Set(first).size, 30);
  for (let i = 0; i < 30; i++) {
    const { q } = await answer(page, i >= 4);
    await page.click('#qz-body [data-qz="check"]');
    await page.waitForSelector(`#qz-body .qz-verdict.${i >= 4 ? "ok" : "bad"}`);
    if (i === 0) {
      assert.ok(await page.locator("#qz-body .qz-fb li.wrong").count() >= 1, "wrong pick is marked");
      assert.ok(await page.locator("#qz-body .qz-fb li.right").count() === q.a.length, "right answer is marked");
      await page.fill("#qz-body [data-note]", "mixed up stateful and stateless");
      await page.screenshot({ path: path.join(SHOTS, "05-feedback-wrong.png") });
    }
    await page.click('#qz-body [data-qz="next"]');
  }
  await page.waitForSelector("#qz-body .qz-res.bad");
  assert.match(await page.textContent("#qz-body .qz-score"), /26/);
  assert.ok(await page.locator("#qz-body .qz-missed > li").count() === 4);
  await page.screenshot({ path: path.join(SHOTS, "06-result-fail.png") });
  s = await state(page);
  assert.equal(Object.keys(s.book).length, 4);
  assert.equal(s.book[first[0]].note, "mixed up stateful and stateless");
  assert.equal(Object.keys(s.srs).length, 4);
  assert.ok(!s.quiz.d2.passed);

  log("retake draws the unseen questions");
  await page.click('#qz-body [data-qz="retake"]');
  const second = (await state(page)).run.ids;
  const fresh = second.filter(id => !first.includes(id)).length;
  const pool = await page.evaluate(() => window.QUIZ.filter(q => q.day === 2).length);
  console.log(`  retake: ${fresh} of 30 new (pool ${pool})`);
  assert.equal(fresh, Math.min(30, pool - 30), "a retake shows every question not seen yet");
  log("close mid-quiz keeps progress; resume from Next up");
  await answer(page, true);
  await page.click('#qz-body [data-qz="check"]');
  await page.click('#qz-body [data-qz="next"]');
  await page.click('#quiz .qz-x');
  await page.reload();
  assert.match(await page.textContent("#next"), /Resume quiz/);
  await page.click('#next [data-quiz-start="d2"]');
  assert.equal((await state(page)).run.i, 1);
  for (let i = 1; i < 30; i++) {
    await answer(page, true);
    await page.click('#qz-body [data-qz="check"]');
    await page.click('#qz-body [data-qz="next"]');
  }
  await page.waitForSelector("#qz-body .qz-res.ok");
  await page.click('#qz-body [data-qz="finish"]');
  assert.equal(await page.getAttribute("details#d2", "data-complete"), "1");

  // ---------- notebook, weak spots, cheat sheet ----------
  log("notebook, weak spots, exam wording");
  await openPanel(page, "practice");
  await page.click('#pr-grid [data-sheet="notebook"]');
  await page.waitForSelector("#sheet[open]");
  await page.click('#sh-body [data-nb="all"]');
  assert.equal(await page.locator("#sh-body .nb > li").count(), 4, "all four misses are in the notebook");
  await page.screenshot({ path: path.join(SHOTS, "07-notebook.png") });
  const dl = page.waitForEvent("download");
  await page.click("#sh-body [data-nb-export]");
  const md = fs.readFileSync(await (await dl).path(), "utf8");
  assert.match(md, /# SAA-C03 wrong-answer notebook/);
  await page.click("#sheet [data-sh-close]");
  await page.click('#pr-grid [data-sheet="weak"]');
  assert.ok(await page.locator("#sh-body .wk > li").count() >= 1);
  assert.match(await page.textContent("#sh-body"), /shaky/i);
  await page.screenshot({ path: path.join(SHOTS, "08-weak.png") });
  await page.click("#sheet [data-sh-close]");
  await page.click('#pr-grid [data-sheet="cues"]');
  assert.ok(await page.locator("#sh-body .cues tbody tr").count() >= 20);
  await page.click("#sheet [data-sh-close]");

  // ---------- warm-up and review (move the clock: make misses due) ----------
  log("due reviews show a warm-up, review clears them");
  await setState(page, s => { for (const id in s.srs) s.srs[id].due = "2000-01-01"; s.settings.start = "2000-01-01"; s.slipSkip = new Date().toISOString().slice(0, 10); });
  await page.reload();
  assert.ok(await page.locator("#next .nx-warm").count() === 1, "warm-up strip shown");
  await page.click('#next [data-warm="start"]');
  const wn = (await state(page)).run.ids.length;
  assert.ok(wn >= 1 && wn <= 5);
  for (let i = 0; i < wn; i++) { await answer(page, true); await page.click('#qz-body [data-qz="check"]'); await page.click('#qz-body [data-qz="next"]'); }
  await page.click('#qz-body [data-qz="finish"]');
  s = await state(page);
  assert.ok(Object.values(s.warm).includes("done"));
  assert.ok(Object.values(s.srs).every(x => x.step === 1), "on-time right answers move reviews to the next step");

  // ---------- slip guard ----------
  log("slip guard moves the remaining days");
  await setState(page, s => { s.slipSkip = ""; const d = new Date(); d.setDate(d.getDate() - 3); s.settings.start = d.toISOString().slice(0, 10); s.slips = []; });
  await page.reload();
  assert.ok(await page.locator("#slip").isVisible());
  await page.screenshot({ path: path.join(SHOTS, "09-slip.png") });
  await page.click('#slip [data-slip]:not([data-slip="skip"])');
  s = await state(page);
  assert.equal(s.slips.length, 1);
  assert.equal(s.slips[0].from, 3);
  assert.ok(await page.locator("#slip").isHidden(), "banner gone after the move: " + await page.textContent("#slip"));
  assert.equal(await page.getAttribute("details#d3", "data-today"), "1", "Day 3 is today after the move");

  // ---------- focus timer logs time ----------
  log("focus timer logs minutes to the current day");
  await setState(page, s => { s.timer = { mode: "focus", running: true, endAt: Date.now() + 40 * 60000, left: 3000, from: 3000, min: false }; });
  await page.reload();
  await page.click('#timer [data-tm="toggle"]');
  s = await state(page);
  assert.ok(s.log.d3 >= 9 && s.log.d3 <= 11, `about 10 minutes logged, got ${s.log.d3}`);

  // ---------- drill ----------
  log("which-service drill");
  await openPanel(page, "practice");
  await page.click('#pr-grid [data-drill]');
  await page.waitForSelector("#qz-body .dr-req");
  await page.keyboard.press("1");
  await page.waitForTimeout(1300);
  assert.match(await page.textContent("#qz-meta"), /Score/);
  await page.screenshot({ path: path.join(SHOTS, "10-drill.png") });
  await page.click('#quiz .qz-x');

  // ---------- mock exam ----------
  log("mock exam locked until Days 1-13 pass, then a timed 65-question run");
  assert.ok(await page.locator("#pr-grid [data-mock]").isDisabled());
  await page.evaluate(k => {
    const s = JSON.parse(localStorage.getItem(k));
    for (const d of window.PLAN) if (d.id && d.day <= 13) { for (const g of d.groups) for (const it of g.items) s.ticks[it[0]] = true; s.quiz[d.id] = { best: 28, passed: "2026-10-12", tries: [{ at: "2026-10-12", score: 28, n: 30 }] }; }
    localStorage.setItem(k, JSON.stringify(s));
  }, KEY);
  await page.reload();
  await openPanel(page, "practice");
  assert.ok(await page.locator("#pr-grid [data-mock]").isEnabled());
  await page.click("#pr-grid [data-mock]");
  await page.click('#qz-body [data-qz="go"]');
  s = await state(page);
  assert.equal(s.run.ids.length, 65);
  const doms = await page.evaluate(ids => [1, 2, 3, 4].map(d => ids.filter(id => window.QUIZ.find(q => q.id === id).dom === d).length), s.run.ids);
  console.log(`  mock domains: ${doms.join("/")}`);
  assert.deepEqual(doms, [20, 17, 15, 13]);
  assert.ok(await page.locator("#qz-body .qz-verdict").count() === 0, "no feedback during the mock");
  for (let i = 0; i < 10; i++) { await answer(page, i % 2 === 0); await page.click('#qz-body [data-qz="mnext"]'); }
  await page.click('#qz-body [data-qz="flag"]');
  await page.click('#qz-body [data-qz="grid"]');
  assert.equal(await page.locator("#qz-body .mk-grid button.ans").count(), 10);
  assert.equal(await page.locator("#qz-body .mk-grid button.flag").count(), 1);
  await page.screenshot({ path: path.join(SHOTS, "11-mock-grid.png") });
  await page.click('#qz-body [data-qz="finish-mock"]');
  await page.waitForSelector("#qz-body .qz-res");
  assert.match(await page.textContent("#qz-body .qz-score"), /5 of 65/);
  await page.screenshot({ path: path.join(SHOTS, "12-mock-result.png") });
  await page.click('#qz-body [data-qz="finish"]');
  s = await state(page);
  assert.equal(s.mocks.length, 1);
  assert.equal(s.run, null);

  log("mock clock submits by itself when time is up");
  await openPanel(page, "practice");
  await page.click("#pr-grid [data-mock]");
  await page.click('#qz-body [data-qz="go"]');
  await setState(page, s => { s.run.end = Date.now() - 1000; });
  await page.reload();
  await page.waitForSelector("#quiz[open] .qz-res", { timeout: 5000 });
  assert.equal((await state(page)).mocks.length, 2);
  await page.click('#qz-body [data-qz="finish"]');

  // ---------- server sync ----------
  log("progress reaches the server and comes back in a fresh browser");
  await page.waitForTimeout(1500);
  const srv = await page.evaluate(() => fetch("api/state").then(r => r.ok ? r.json() : null).catch(() => null));
  if (srv) {
    assert.ok(srv.rev > 0, "server has a revision");
    assert.ok(srv.doc.quiz.d1.passed, "server copy has the passed quiz");
    const fresh = await newPage();
    await fresh.page.goto(BASE);
    await fresh.page.waitForFunction(() => document.querySelector("details#d1")?.dataset.complete === "1", null, { timeout: 5000 });
    console.log(`  server rev ${srv.rev}; fresh browser restored Day 1 as complete`);
    await fresh.ctx.close();
  } else console.log("  (no backend on this address: skipped)");
  await ctx.close();

  // ---------- mobile + dark ----------
  log("mobile width and dark mode");
  ({ ctx, page } = await newPage({ viewport: { width: 390, height: 844 }, colorScheme: "dark" }));
  await page.goto(BASE);
  await page.waitForFunction(() => document.querySelector("details#d1")?.dataset.complete === "1", null, { timeout: 5000 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert.ok(overflow <= 1, `no horizontal scroll on mobile (overflow ${overflow}px)`);
  await page.screenshot({ path: path.join(SHOTS, "13-mobile-dark.png") });
  await setState(page, s => { s.run = null; });
  await page.reload();
  await openPanel(page, "practice");
  await page.click('#pr-grid [data-sheet="notebook"]');
  await page.waitForSelector("#sheet[open]");
  await page.screenshot({ path: path.join(SHOTS, "14-mobile-notebook.png") });
  await page.click("#sheet [data-sh-close]");
  await openPanel(page, "d1");
  await page.click('[data-quiz-start="d1"]');
  await page.waitForSelector("#quiz[open]");
  await answer(page, false);
  await page.click('#qz-body [data-qz="check"]');
  await page.screenshot({ path: path.join(SHOTS, "15-mobile-feedback.png"), fullPage: false });
  const qOverflow = await page.evaluate(() => { const d = document.getElementById("quiz"); return d.scrollWidth - d.clientWidth; });
  assert.ok(qOverflow <= 1, "quiz dialog fits the phone width");
  await ctx.close();

  if (errors.length) throw new Error("console errors:\n" + errors.join("\n"));
  console.log(`\nAll e2e checks passed in ${((Date.now() - t0) / 1000).toFixed(1)} s. Screenshots: ${SHOTS}`);
} catch (e) {
  console.error(`\nFAILED at "${step}": ${e.message}`);
  if (errors.length) console.error("console errors:\n" + errors.join("\n"));
  process.exitCode = 1;
} finally {
  await browser.close();
}
