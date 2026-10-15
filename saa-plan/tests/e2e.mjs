// End-to-end check of the real page in headless Chromium. Day and step ids are read from the plan (window.PLAN), not written here.
// Needs the site served (Go server with a fresh database for the sync checks) and Playwright on NODE_PATH:
//   NODE_PATH=$(npm root -g) BASE=http://localhost:8090/ node tests/e2e.mjs
// PW_CHANNEL=msedge (or chrome) drives an installed browser instead of Playwright's own Chromium.
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
const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {});
const errors = [];
let step = "";
const t0 = Date.now();
function log(s) { step = s; console.log(`· ${s}`); }

function track(page) {
  // A 409 is the server's normal "someone else saved first" answer; the page merges and retries.
  page.on("console", m => { if (m.type() === "error" && !/status of 409/.test(m.text())) errors.push(`[${step}] ${m.text()}`); });
  page.on("pageerror", e => errors.push(`[${step}] ${e.message}`));
  page.on("dialog", d => d.accept());
  return page;
}
async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, ...opts });
  return { ctx, page: track(await ctx.newPage()) };
}
const serverState = page => page.evaluate(() => fetch("api/state").then(r => r.ok ? r.json() : null).catch(() => null));
const hash = page => page.evaluate(() => location.hash);
// Open a day's card: a step id, "quiz", or nothing for the day's first open step.
async function openCard(page, day, at = "") {
  await page.evaluate(h => { location.hash = h; }, `#${day}${at ? "/" + at : ""}`);
  await page.waitForFunction(([d, a]) => !document.getElementById("flow").hidden && (a ? location.hash === `#${d}/${a}` : location.hash.startsWith(`#${d}/`)), [day, at]);
}
// "Mark complete" ignores clicks for a moment after a card appears (double-click guard), so wait it out.
async function complete(page) { await page.waitForTimeout(380); await page.click("#fl-nav [data-complete]"); }
const stepOn = (page, id) => page.evaluate(id => document.querySelector(`#fl-strip [data-at="${id}"]`).classList.contains("on"), id);
async function goHome(page) { if (await page.locator("#flow").isVisible()) await page.click("#flow [data-home]"); }
const kind = v => v === null ? "null" : Array.isArray(v) ? "array" : typeof v;
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

let srv = null;
try {
  // ---------- first visit ----------
  log("first visit renders the overview, bank loaded");
  let { ctx, page } = await newPage();
  // Run against a fresh server database: the page uploads this browser's state on first sync.
  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await setState(page, s => { s.settings = { start: new Date().toISOString().slice(0, 10), fx: false, sound: false }; });
  await page.reload();
  const bank = await page.evaluate(() => ({ n: window.QUIZ.length, days: [...new Set(window.QUIZ.map(q => q.day))] }));
  console.log(`  bank: ${bank.n} questions, pools ${bank.days.join(",")}`);
  assert.ok(bank.n >= 300, "question bank should be loaded");
  // Days and steps come from the plan, so these checks hold when the plan changes.
  const P = await page.evaluate(() => {
    const days = window.PLAN.filter(d => d.id).map(d => ({ id: d.id, day: d.day, quiz: d.quiz || "", ids: d.groups.flatMap(g => g.items.map(it => it[0])) }));
    const check = window.PLAN.filter(d => d.id).flatMap(d => d.groups.filter(g => g.t === "check" && g.items.length > 1).map(g => ({ day: d.id, ids: g.items.map(it => it[0]) })))[0];
    // a step with topics, key points and docs of its own: the card with every kind of helper material
    const help = Object.keys(window.STEP_TAGS).find(id => window.KEYS[id] && (window.KEYS[id].k || []).length >= 2 && (window.KEYS[id].docs || []).length);
    return { days, check, help, mockAfter: window.MOCK_AFTER };
  });
  const dayOfStep = id => P.days.find(d => d.ids.includes(id)).id;
  const D1 = P.days[0], LAST = P.days[P.days.length - 1];
  const QA = P.days.find(d => d.quiz === "tags");            // the first day that ends with a quiz on its own topics
  const QB = P.days[QA.day], OD = P.days[QB.day];            // the day after it (failed, then retaken), and the one after that
  assert.equal(QB.quiz, "tags", "these checks expect two quiz days in a row");
  assert.ok(P.check.day === QA.id && P.check.ids[0] !== QA.ids[QA.ids.length - 2], "these checks expect the first quiz day to have a self-check block of several cards");
  const [ck1, ck2] = P.check.ids, HELP = P.help, HELPDAY = dayOfStep(HELP);
  console.log(`  plan: ${P.days.length} days; first quiz days ${QA.day} and ${QB.day}; helper card ${HELP}`);
  assert.ok(await page.locator("#home").isVisible() && await page.locator("#flow").isHidden(), "the overview is the first screen");
  assert.equal(await page.locator("#map .dt").count(), P.days.length, "one tile per day");
  assert.equal(await page.locator("#stats .st").count(), 5);
  assert.match(await page.textContent("#next"), /Start Day 1/);
  await page.screenshot({ path: path.join(SHOTS, "01-overview.png"), fullPage: false });

  // ---------- one step per card ----------
  log("Start Day 1 opens the first step alone on a card");
  await page.click('#next a[href="#d1"]');
  await page.waitForSelector("#flow:not([hidden])");
  const [s1, s2, s3] = await page.evaluate(() => window.PLAN.find(d => d.id === "d1").groups.flatMap(g => g.items.map(it => it[0])));
  assert.equal(await hash(page), `#d1/${s1}`);
  assert.equal(await page.locator("#card .c-t").count(), 1, "one step on screen");
  const n1 = await page.evaluate(() => window.PLAN.find(d => d.id === "d1").groups.reduce((a, g) => a + g.items.length, 0));
  const q1 = D1.quiz ? 1 : 0;
  assert.equal((await page.textContent("#fl-count")).trim(), `Step 1 of ${n1 + q1}`);
  assert.equal(await page.locator("#fl-strip .dot").count(), n1 + q1, "a dot per step, plus one for the quiz on a quiz day");
  assert.ok(await page.locator(".tb").isHidden(), "the big title block steps aside");

  log("Mark complete moves on, Next skips, Back and the arrow keys return, Undo reopens");
  await complete(page);
  assert.equal(await hash(page), `#d1/${s2}`);
  assert.ok((await state(page)).ticks[s1]);
  await page.click("#fl-nav [data-complete]");            // an instant second click must not complete the next card
  assert.ok(!(await state(page)).ticks[s2], "double click completes one step only");
  await page.click("#fl-nav [data-next]");                // skip the second step
  assert.equal(await hash(page), `#d1/${s3}`);
  await page.keyboard.press("ArrowLeft");
  assert.equal(await hash(page), `#d1/${s2}`);
  await page.click("#fl-nav [data-back]");
  assert.equal(await hash(page), `#d1/${s1}`);
  assert.match(await page.textContent("#fl-nav .fl-mid"), /Completed/);
  assert.ok(await stepOn(page, s1));
  await page.click("#fl-nav [data-undo]");
  assert.ok(!(await state(page)).ticks[s1]);
  await page.reload();
  assert.equal(await hash(page), `#d1/${s1}`, "a reload stays on the card");

  // ---------- something to see when a step and a block are finished ----------
  log("finishing a step shows what is left; finishing a block of the day gets a banner");
  const g0 = await page.evaluate(() => window.PLAN.find(d => d.id === "d1").groups[0].items.map(it => it[0]));
  assert.ok(g0.length >= 2 && g0[0] === s1, "these checks expect Day 1 to open with a block of several steps");
  await goHome(page);
  await page.click("#b-fx");                                 // effects on for this part (the run starts with them off; the switch is on the overview)
  assert.equal((await state(page)).settings.fx, true);
  await openCard(page, D1.id, s1);
  await complete(page);
  await page.waitForSelector(".fx-toast.show");
  assert.match(await page.textContent(".fx-toast"), new RegExp(`1 of ${n1}`), "the toast counts the steps of the day");
  assert.ok(await page.evaluate(id => document.querySelector(`#fl-strip [data-at="${id}"]`).classList.contains("pop"), s1), "the finished step's dot pops");
  for (let i = 1; i < g0.length; i++) await complete(page);
  await page.waitForSelector(".fx-banner.k-block.show");
  assert.match(await page.textContent(".fx-banner"), /Block 1 of \d+ done/);
  assert.ok(await page.locator("#fl-strip .fl-g.wave").count() === 1, "the finished block's dots bounce");
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(SHOTS, "02a-block-done.png") });
  assert.ok(await page.locator("canvas.fx-canvas").count() === 1, "effects draw on a canvas");
  await goHome(page);
  await page.click("#b-fx");
  assert.equal((await state(page)).settings.fx, false, "effects are off again for the rest of the run");

  log("the quiz card stays locked while steps are open, and lists them");
  await openCard(page, QA.id, "quiz");
  assert.ok(await page.locator("#fl-nav [data-quiz-start]").isDisabled());
  assert.equal(await page.locator("#card .c-open li").count(), QA.ids.length);
  await page.click("#card .c-open li:first-child button");
  assert.equal(await hash(page), `#${QA.id}/${QA.ids[0]}`);

  // ---------- helper material on the card ----------
  log("a step card carries key points, AWS docs, exam topics and its own notes");
  await openCard(page, HELPDAY, HELP);
  assert.ok(await page.locator("#card .c-key li").count() >= 2, "key points");
  if (await page.evaluate(id => !!window.KEYS[id].why, HELP)) {
    assert.ok(await page.evaluate(() => { const w = document.querySelector("#card .c-why"), k = document.querySelector("#card .c-key"), where = document.querySelector("#card .c-w"); return !!w && w.compareDocumentPosition(k) & 4 && (!where || w.compareDocumentPosition(where) & 4); }), "why it exists comes before where to do it and before the details");
    assert.ok(await page.locator("#card .c-key .k-list .k-l").count() >= 2, "labelled points");
  }
  assert.ok(await page.locator("#card .c-tags li").count() >= 1, "exam topics");
  const links = await page.$$eval("#card .c-docs a", as => as.map(a => [a.href, a.target, a.rel]));
  assert.ok(links.length >= 1 && links.every(([h, t, r]) => /^https:\/\/(docs\.)?aws\.amazon\.com\//.test(h) && t === "_blank" && r.includes("noopener")), "AWS docs open in a new tab");
  await page.fill(`#card [data-inote="${HELP}"]`, "look at this again");
  await page.waitForTimeout(600);
  assert.equal((await state(page)).inotes[HELP], "look at this again");
  await page.click('#card details[data-sec="terms"] > summary');
  await page.screenshot({ path: path.join(SHOTS, "02-step-card.png"), fullPage: true });
  await page.click("#fl-nav [data-next]");
  if (await page.locator('#card details[data-sec="terms"]').count())
    assert.ok(await page.evaluate(() => document.querySelector('#card details[data-sec="terms"]').open), "an opened helper list stays open on the next card");

  log("step practice: three questions on this step");
  await openCard(page, HELPDAY, HELP);
  await page.click(`#card [data-step-quiz="${HELP}"]`);
  let s = await state(page);
  assert.equal(s.run.kind, "step");
  assert.equal(s.run.ids.length, 3);
  assert.ok(await page.evaluate(([ids, step]) => ids.every(id => { const q = window.QUIZ.find(x => x.id === id); return q.ref.includes(step) || q.tags.some(t => window.STEP_TAGS[step].includes(t)); }), [s.run.ids, HELP]), "questions that name the step or are on its topics");
  for (let i = 0; i < 3; i++) { await answer(page, true); await page.click('#qz-body [data-qz="check"]'); await page.click('#qz-body [data-qz="next"]'); }
  await page.click('#qz-body [data-qz="finish"]');
  assert.equal((await state(page)).run, null);
  assert.match(await page.textContent("#card .c-prac"), /answered 3/);

  // ---------- self-check card ----------
  log("self-check card: reveal the model answer, mark shaky");
  await openCard(page, QA.id, ck1);
  await page.click(`#card [data-flip="${ck1}"]`);
  assert.ok(await page.locator("#ca-" + ck1).isVisible());
  await page.click(`#card [data-conf="shaky"][data-cid="${ck1}"]`);
  assert.equal((await state(page)).conf[ck1], "shaky");
  assert.ok((await state(page)).ticks[ck1], "marking a card completes the step");
  assert.equal(await hash(page), `#${QA.id}/${ck2}`, "and moves on");
  await page.click("#fl-nav [data-back]");
  assert.match(await page.textContent(`#card [data-flip="${ck1}"]`), /Shaky/);

  // ---------- a day without a quiz ----------
  if (!D1.quiz) {
    log("a day without a quiz is done with its last step");
    await tickDays(page, P.days.filter(d => d.day < QA.day).map(d => d.day));   // every day in front of the first quiz day
    await page.reload();
    assert.equal(await page.getAttribute(`[data-day="${D1.id}"]`, "data-done"), "1");
    await openCard(page, D1.id);
    assert.equal(await hash(page), `#${D1.id}/done`, "a finished day opens on its summary");
    assert.equal(await page.locator("#fl-strip .dot.qd").count(), 0, "no quiz dot");
    await goHome(page);
  }

  // ---------- the first quiz day through the cards, then pass the quiz ----------
  log(`complete the last Day ${QA.day} steps → the quiz card; Enter starts the quiz`);
  // every step but the last two straight in storage; those two through the cards
  await page.evaluate(([k, ids]) => {
    const st = JSON.parse(localStorage.getItem(k));
    for (const id of ids.slice(0, -2)) st.ticks[id] = true;
    localStorage.setItem(k, JSON.stringify(st));
  }, [KEY, QA.ids]);
  await page.reload();
  await openCard(page, QA.id);
  assert.equal(await hash(page), `#${QA.id}/${QA.ids[QA.ids.length - 2]}`, "a day opens on its first open step");
  await complete(page);
  await complete(page);
  assert.equal(await hash(page), `#${QA.id}/quiz`, "after the last step comes the quiz card");
  assert.match(await page.textContent("#card"), /End-of-day quiz/);
  await page.waitForTimeout(300);                          // let the card finish fading in before the picture
  await page.screenshot({ path: path.join(SHOTS, "03-quiz-card.png") });
  await page.keyboard.press("Enter");
  await page.waitForSelector("#qz-body .qz-o");

  log("answer 30 questions right, with feedback after each");
  const asked = (await state(page)).run.ids;
  assert.equal(asked.length, 30);
  assert.ok(await page.evaluate(([ids, id]) => { const tp = window.QZ.topics(window.PLAN, window.STEP_TAGS)[id]; return ids.every(q => { const t = window.QUIZ.find(x => x.id === q).tags; return t.some(x => tp.own.has(x)) && t.every(x => tp.sofar.has(x)); }); }, [asked, QA.id]),
    "every question is on one of the day's topics, and none touches a topic taught later");
  for (let i = 0; i < 30; i++) {
    await answer(page, true);
    if (i === 0) {
      // keyboard path on the first one: Enter checks
      await page.keyboard.press("Enter");
    } else await page.click('#qz-body [data-qz="check"]');
    await page.waitForSelector("#qz-body .qz-verdict.ok");
    if (i === 2) { await page.waitForSelector("#quiz .fx-toast.show"); assert.match(await page.textContent("#quiz .fx-toast"), /3 in a row/, "a streak of right answers is called out inside the quiz"); }
    if (i === 0) {
      assert.ok(await page.locator("#qz-body .qz-study .qz-refs li").count() >= 1, "feedback shows where to study");
      // every option is explained, and the explanation sits visibly inside its option
      const inside = await page.$$eval("#qz-body .qz-fb li", lis => lis.map(li => {
        const w = li.querySelector(".qz-why"); if (!w) return false;
        const a = li.getBoundingClientRect(), b = w.getBoundingClientRect();
        return b.height > 0 && b.top >= a.top && b.bottom <= a.bottom + 1 && b.left >= a.left && b.right <= a.right + 1;
      }));
      assert.ok(inside.length >= 4 && inside.every(Boolean), "every option shows its explanation inside the option");
      await page.screenshot({ path: path.join(SHOTS, "04-feedback-right.png") });
      // on a wide screen, where to study moves out of the card into the free space to its left
      await page.setViewportSize({ width: 1600, height: 1000 });
      await page.waitForTimeout(350);                      // the panel slides in
      const [side, card] = await Promise.all(["#qz-body .qz-study", "#quiz"].map(s => page.$eval(s, el => { const b = el.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top }; })));
      assert.ok(side.r <= card.l - 8 && Math.abs(side.t - card.t) < 2, "on a wide screen, where to study sits left of the quiz card, level with its top");
      await page.screenshot({ path: path.join(SHOTS, "04b-feedback-wide.png") });
      await page.setViewportSize({ width: 1200, height: 900 });
    }
    await page.click('#qz-body [data-qz="next"]');
  }
  await page.waitForSelector("#qz-body .qz-res.ok");
  assert.match(await page.textContent("#qz-body .qz-score"), /30/);
  assert.match(await page.textContent("#quiz .fx-toast"), /Perfect score/);
  await page.screenshot({ path: path.join(SHOTS, "05-result-pass.png") });
  await page.click('#qz-body [data-qz="finish"]');
  await page.waitForFunction(h => location.hash === h, `#${QA.id}/done`, { timeout: 3000 });
  assert.match(await page.textContent("#card .c-t"), new RegExp(`Day ${QA.day} is done`));
  assert.match(await page.textContent("#fl-nav"), new RegExp(`Start Day ${QB.day}`));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SHOTS, "06-day-done.png") });
  s = await state(page);
  assert.ok(s.quiz[QA.id].passed && s.quiz[QA.id].best === 30);
  assert.ok(s.dayDone[QA.id]);
  await page.click(`#fl-nav a[href="#${QB.id}"]`);
  await page.waitForFunction(h => location.hash === h, `#${QB.id}/${QB.ids[0]}`);
  await goHome(page);
  assert.equal(await page.getAttribute(`[data-day="${QA.id}"]`, "data-done"), "1", "passing the quiz completes the day");
  assert.match(await page.textContent("#next"), new RegExp(`Start Day ${QB.day}`));

  // ---------- the next day: fail, then retake shows new questions ----------
  log(`Day ${QB.day}: miss 4 → fail at 26/30, notebook + review queue filled`);
  await tickDays(page, [QB.day]);
  await page.reload();
  assert.equal(await page.getAttribute(`[data-day="${QB.id}"]`, "data-quiz"), "1", "day shows quiz pending");
  assert.equal(await page.getAttribute(`[data-day="${QB.id}"]`, "data-done"), "0");
  assert.match(await page.textContent("#next"), new RegExp(`Take the Day ${QB.day} quiz`));
  await page.click(`#next [data-quiz-start="${QB.id}"]`);
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
      await page.screenshot({ path: path.join(SHOTS, "07-feedback-wrong.png") });
    }
    await page.click('#qz-body [data-qz="next"]');
  }
  await page.waitForSelector("#qz-body .qz-res.bad");
  assert.match(await page.textContent("#qz-body .qz-score"), /26/);
  assert.ok(await page.locator("#qz-body .qz-missed > li").count() === 4);
  await page.screenshot({ path: path.join(SHOTS, "08-result-fail.png") });
  s = await state(page);
  assert.equal(Object.keys(s.book).length, 4);
  assert.equal(s.book[first[0]].note, "mixed up stateful and stateless");
  assert.equal(Object.keys(s.srs).length, 4);
  assert.ok(!s.quiz[QB.id].passed);

  log("retake draws the unseen questions");
  // what is left unseen in the day's own pool (earlier quizzes on shared topics used some of it up)
  const unseen = await page.evaluate(([k, id]) => {
    const st = JSON.parse(localStorage.getItem(k)), d = window.PLAN.find(x => x.id === id);
    return window.QZ.dayPool(d, window.QZ.topics(window.PLAN, window.STEP_TAGS), window.QUIZ).map(q => q.id).filter(q => !st.qs[q]);
  }, [KEY, QB.id]);
  await page.click('#qz-body [data-qz="retake"]');
  const second = (await state(page)).run.ids;
  const fresh = second.filter(id => unseen.includes(id)).length;
  console.log(`  retake: ${fresh} of 30 not seen before (${unseen.length} were left in the day's pool)`);
  assert.equal(fresh, Math.min(30, unseen.length), "a retake shows every question not seen yet");
  assert.equal(new Set(second).size, 30, "and fills up with questions seen before, none twice");
  log("close mid-quiz keeps progress; resume from the overview");
  await answer(page, true);
  await page.click('#qz-body [data-qz="check"]');
  await page.click('#qz-body [data-qz="next"]');
  await page.click('#quiz .qz-x');
  await page.reload();
  assert.match(await page.textContent("#next"), /Resume quiz/);
  await page.click(`#next [data-quiz-start="${QB.id}"]`);
  assert.equal((await state(page)).run.i, 1);
  for (let i = 1; i < 30; i++) {
    await answer(page, true);
    await page.click('#qz-body [data-qz="check"]');
    await page.click('#qz-body [data-qz="next"]');
  }
  await page.waitForSelector("#qz-body .qz-res.ok");
  await page.click('#qz-body [data-qz="finish"]');
  assert.equal(await page.getAttribute(`[data-day="${QB.id}"]`, "data-done"), "1");

  // ---------- notebook, weak spots, cheat sheet ----------
  log("notebook, weak spots, exam wording");
  await openPanel(page, "practice");
  await page.click('#pr-grid [data-sheet="notebook"]');
  await page.waitForSelector("#sheet[open]");
  await page.click('#sh-body [data-nb="all"]');
  assert.equal(await page.locator("#sh-body .nb > li").count(), 4, "all four misses are in the notebook");
  await page.screenshot({ path: path.join(SHOTS, "09-notebook.png") });
  const dl = page.waitForEvent("download");
  await page.click("#sh-body [data-nb-export]");
  const md = fs.readFileSync(await (await dl).path(), "utf8");
  assert.match(md, /# SAA-C03 wrong-answer notebook/);
  await page.click("#sheet [data-sh-close]");
  await page.click('#pr-grid [data-sheet="weak"]');
  assert.ok(await page.locator("#sh-body .wk > li").count() >= 1);
  assert.match(await page.textContent("#sh-body"), /shaky/i);
  await page.screenshot({ path: path.join(SHOTS, "10-weak.png") });
  await page.click("#sh-body > .qz-refs [data-jump]");    // "Open step" leaves the sheet for that step's card
  assert.ok(await page.locator("#flow").isVisible() && await page.locator("#sheet[open]").count() === 0);
  assert.equal(await hash(page), `#${QA.id}/${ck1}`);
  await goHome(page);
  await openPanel(page, "practice");
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
  // start the plan so that the first unfinished day was planned for yesterday
  await page.evaluate(([k, n]) => { const s = JSON.parse(localStorage.getItem(k)); s.slipSkip = ""; const d = new Date(); d.setDate(d.getDate() - n); s.settings.start = d.toISOString().slice(0, 10); s.slips = []; localStorage.setItem(k, JSON.stringify(s)); }, [KEY, OD.day]);
  await page.reload();
  assert.ok(await page.locator("#slip").isVisible());
  await page.screenshot({ path: path.join(SHOTS, "11-slip.png") });
  await page.click('#slip [data-slip]:not([data-slip="skip"])');
  s = await state(page);
  assert.equal(s.slips.length, 1);
  assert.equal(s.slips[0].from, OD.day);
  assert.ok(await page.locator("#slip").isHidden(), "banner gone after the move: " + await page.textContent("#slip"));
  assert.equal(await page.getAttribute(`[data-day="${OD.id}"]`, "data-today"), "1", "the overdue day is today after the move");

  // ---------- focus timer logs time ----------
  log("focus timer logs minutes to the current day");
  await setState(page, s => { s.timer = { mode: "focus", running: true, endAt: Date.now() + 40 * 60000, left: 3000, from: 3000, min: false }; });
  await page.reload();
  await page.click('#timer [data-tm="toggle"]');
  s = await state(page);
  assert.ok(s.log[OD.id] >= 9 && s.log[OD.id] <= 11, `about 10 minutes logged, got ${s.log[OD.id]}`);

  // ---------- drill ----------
  log("which-service drill");
  await openPanel(page, "practice");
  await page.click('#pr-grid [data-drill]');
  await page.waitForSelector("#qz-body .dr-req");
  await page.keyboard.press("1");
  await page.waitForTimeout(1300);
  assert.match(await page.textContent("#qz-meta"), /Score/);
  await page.screenshot({ path: path.join(SHOTS, "12-drill.png") });
  await page.click('#quiz .qz-x');

  // ---------- mock exam ----------
  log(`mock exam locked until Days 1-${P.mockAfter} are done, then a timed 65-question run`);
  assert.ok(await page.locator("#pr-grid [data-mock]").isDisabled());
  await page.evaluate(k => {
    const s = JSON.parse(localStorage.getItem(k));
    for (const d of window.PLAN) if (d.id && d.day <= window.MOCK_AFTER) { for (const g of d.groups) for (const it of g.items) s.ticks[it[0]] = true; if (d.quiz) s.quiz[d.id] = { best: 28, passed: "2026-10-12", tries: [{ at: "2026-10-12", score: 28, n: 30 }] }; }
    localStorage.setItem(k, JSON.stringify(s));
  }, KEY);
  await page.reload();
  assert.equal(await page.locator('#map .dt[data-done="1"]').count(), P.mockAfter, "the days of new material are done, the exam-prep days are not");
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
  await page.screenshot({ path: path.join(SHOTS, "13-mock-grid.png") });
  await page.click('#qz-body [data-qz="finish-mock"]');
  await page.waitForSelector("#qz-body .qz-res");
  assert.match(await page.textContent("#qz-body .qz-score"), /5 of 65/);
  await page.screenshot({ path: path.join(SHOTS, "14-mock-result.png") });
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

  // ---------- scores and the verdict on their own cards ----------
  log("a score typed on its step's card shows in the Scores panel; the verdict sits on its step");
  await openCard(page, dayOfStep("d7e4"), "d7e4");
  await page.fill('#card [data-score="qs7"]', "15");
  assert.equal((await state(page)).scores.qs7, "15");
  assert.equal(await page.inputValue('#scores [data-score="qs7"]'), "15");
  await openCard(page, dayOfStep("d11p1"), "d11p1");
  await page.fill('#card [data-score="pe"]', "780");
  await openCard(page, dayOfStep("d11p2"), "d11p2");
  assert.match(await page.textContent("#card [data-verdict]"), /GO/);
  await goHome(page);

  // ---------- server sync ----------
  log("progress reaches the server and comes back in a fresh browser");
  await page.waitForTimeout(1500);
  srv = await serverState(page);
  if (srv) {
    assert.ok(srv.rev > 0, "server has a revision");
    assert.ok(srv.doc.quiz[QA.id].passed, "server copy has the passed quiz");
    const fresh = await newPage();
    await fresh.page.goto(BASE);
    await fresh.page.waitForFunction(id => document.querySelector(`[data-day="${id}"]`)?.dataset.done === "1", QA.id, { timeout: 5000 });
    console.log(`  server rev ${srv.rev}; fresh browser restored Day ${QA.day} as complete`);
    await fresh.ctx.close();
  } else console.log("  (no backend on this address: skipped)");
  await ctx.close();

  // ---------- mobile + dark ----------
  log("mobile width and dark mode");
  ({ ctx, page } = await newPage({ viewport: { width: 390, height: 844 }, colorScheme: "dark" }));
  await page.goto(BASE);
  if (srv) await page.waitForFunction(id => document.querySelector(`[data-day="${id}"]`)?.dataset.done === "1", QA.id, { timeout: 5000 });
  else { await tickDays(page, [D1.day, QA.day]); await page.reload(); }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert.ok(overflow <= 1, `no horizontal scroll on mobile (overflow ${overflow}px)`);
  await page.screenshot({ path: path.join(SHOTS, "15-mobile-dark.png") });
  await setState(page, s => { s.run = null; });
  await page.reload();
  await openPanel(page, "practice");
  await page.click('#pr-grid [data-sheet="notebook"]');
  await page.waitForSelector("#sheet[open]");
  await page.screenshot({ path: path.join(SHOTS, "16-mobile-notebook.png") });
  await page.click("#sheet [data-sh-close]");
  // a step card on a phone: nothing wider than the screen, the three buttons on screen
  await openCard(page, HELPDAY, HELP);
  const fit = await page.evaluate(() => ({
    over: document.documentElement.scrollWidth - innerWidth,
    nav: ["[data-back]", ".fl-mid", "[data-next]"].map(sel => { const r = document.querySelector("#fl-nav " + sel).getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1; })
  }));
  assert.ok(fit.over <= 1, `a step card fits the phone width (overflow ${fit.over}px)`);
  assert.ok(fit.nav.every(Boolean), "Back, the main action and Next are on screen");
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SHOTS, "17-mobile-card.png") });
  await openCard(page, QA.id, "quiz");
  await page.click(`#flow [data-quiz-start="${QA.id}"]`);
  await page.waitForSelector("#quiz[open]");
  await answer(page, false);
  await page.click('#qz-body [data-qz="check"]');
  await page.screenshot({ path: path.join(SHOTS, "18-mobile-feedback.png"), fullPage: false });
  const qOverflow = await page.evaluate(() => { const d = document.getElementById("quiz"); return d.scrollWidth - d.clientWidth; });
  assert.ok(qOverflow <= 1, "quiz dialog fits the phone width");
  await ctx.close();

  // ---------- regressions found in code review ----------
  if (srv) {
    log("two tabs keep each other current");
    const c = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    const a = track(await c.newPage()), b = track(await c.newPage());
    const [e1, e2, e3] = LAST.ids;
    await a.goto(BASE + `#${LAST.id}/${e1}`); await b.goto(BASE + `#${LAST.id}/${e2}`);
    await a.waitForTimeout(800);
    await complete(a);
    await b.waitForFunction(id => document.querySelector(`#fl-strip [data-at="${id}"]`).classList.contains("on"), e1, { timeout: 3000 });
    await complete(b);
    await a.waitForFunction(id => document.querySelector(`#fl-strip [data-at="${id}"]`).classList.contains("on"), e2, { timeout: 3000 });
    await b.waitForTimeout(1500);
    let st = await serverState(b);
    assert.ok(st.doc.ticks[e1] && st.doc.ticks[e2], "server has both tabs' ticks");
    await c.close();

    log("two devices editing at once: the conflict merges instead of dropping one side");
    const d1 = await newPage(), d2 = await newPage();
    await d1.page.goto(BASE + `#${LAST.id}/${e3}`); await d2.page.goto(BASE + `#${LAST.id}/${e3}`);
    await d1.page.waitForTimeout(800); await d2.page.waitForTimeout(200);
    await complete(d1.page);
    await d1.page.waitForTimeout(1500);           // d1 saved; d2 hasn't seen it
    await d2.page.click('#fl-tools [data-sheet="daynotes"]');
    await d2.page.fill(`#sh-body textarea[data-notes="${LAST.id}"]`, "note from device two");
    await d2.page.waitForTimeout(2200);           // d2 saves with an old revision, gets 409, merges, saves again
    st = await serverState(d2.page);
    assert.ok(st.doc.ticks[e3] && st.doc.ticks[e1], "device one's tick survived");
    assert.equal(st.doc.notes[LAST.id], "note from device two", "device two's note survived");
    assert.ok(await stepOn(d2.page, e3), "the merged copy is on screen");
    await d1.ctx.close(); await d2.ctx.close();

    log("progress saved before the server existed is merged, not replaced");
    const old = await newPage();
    await old.page.goto(BASE);
    await old.page.evaluate(k => { localStorage.clear(); localStorage.setItem(k, JSON.stringify({ ticks: { d13l1: true }, notes: { d13: "old note" }, inotes: { d13l1: "passport is in the drawer" }, settings: { start: "2026-10-12", fx: false, sound: false } })); }, KEY);
    await old.page.reload();
    await old.page.waitForTimeout(2000);
    st = await serverState(old.page);
    assert.ok(st.doc.notes.d13 === "old note" && st.doc.inotes.d13l1 === "passport is in the drawer" && st.doc.ticks[e3] && st.doc.notes[LAST.id] === "note from device two", "old local progress and server progress both kept");
    await old.ctx.close();
  }

  log("mock with a retired question still submits when time is up");
  ({ ctx, page } = await newPage());
  await page.goto(BASE);
  await page.waitForTimeout(500);
  await setState(page, s => { s.run = { kind: "mock", day: "", ids: ["m1-001", "m1-999", "m1-002", "m2-003"], ord: {}, ans: { "m1-999": [0] }, flag: {}, i: 2, t0: Date.now() - 7800000, end: Date.now() - 1000, done: false, view: "" }; });
  await page.reload();
  await page.waitForSelector("#quiz[open] .qz-res", { timeout: 5000 });
  assert.match(await page.textContent("#qz-body .qz-score"), /of 3/);
  await page.click('#qz-body [data-qz="finish"]');

  log("drill restarts cleanly while a quiz is unfinished");
  await tickDays(page, [QA.day]);
  await page.reload();
  await openCard(page, QA.id, "quiz");
  await page.click(`#flow [data-quiz-start="${QA.id}"]`);     // "Start quiz" under the card, or "Practice again" on it once passed
  await answer(page, true);
  await page.click('#qz-body [data-qz="check"]');
  await page.click('#quiz .qz-x');
  await goHome(page);
  await openPanel(page, "practice");
  await page.click("#pr-grid [data-drill]");
  await page.evaluate(() => document.getElementById("qz-body").insertAdjacentHTML("beforeend", '<button type="button" data-drill id="again">again</button>'));
  await page.click("#again");
  await page.waitForTimeout(1600);
  assert.notEqual((await page.textContent("#dr-time")).trim(), "60 s", "the restarted drill's clock runs");
  await page.click('#quiz .qz-x');

  log("progress saved under the old 14-day plan: steps and answers stay, day quiz results start again");
  await page.evaluate(([k, id]) => {
    const st = JSON.parse(localStorage.getItem(k));
    delete st.planV;                                   // what a copy from before the 21-day plan looks like
    st.run = null;
    st.quiz = { [id]: { best: 30, passed: "2026-10-12", tries: [{ at: "2026-10-12", score: 30, n: 30 }] } };
    st.dayDone = { [id]: "2026-10-12" };
    st.qs = { "q01-001": { seen: 2, right: 1, last: 1, at: "2026-10-12" } };
    st.inotes = { d1a1: "kept" };
    localStorage.setItem(k, JSON.stringify(st));
  }, [KEY, QA.id]);
  await page.reload();
  assert.equal(await page.getAttribute(`[data-day="${QA.id}"]`, "data-done"), "0", "an old quiz result does not complete a day of the new plan");
  assert.equal(await page.getAttribute(`[data-day="${QA.id}"]`, "data-quiz"), "1", "its steps are still done, the quiz is open again");
  await page.click("#b-snd");                          // any change saves the migrated copy
  const mig = await state(page);
  assert.deepEqual([mig.planV, Object.keys(mig.quiz).length, mig.qs["q01-001"].seen, mig.inotes.d1a1, !!mig.ticks[QA.ids[0]]], [3, 0, 2, "kept", true]);

  log("progress saved under the 21-day plan: a day was put in front, so what was saved for a day moves down with it");
  const wasDay = "d" + (QA.day - 1);                    // where this day sat in the 21-day plan
  await page.evaluate(([k, was]) => {
    const st = JSON.parse(localStorage.getItem(k));
    st.planV = 2;
    st.quiz = { [was]: { best: 29, passed: "2026-10-13", tries: [{ at: "2026-10-13", score: 29, n: 30 }] } };
    st.dayDone = { [was]: "2026-10-13" };
    st.notes = { [was]: "a note on the day that moved", d1: "a note on Day 1" };
    st.log = { [was]: 42 };
    localStorage.setItem(k, JSON.stringify(st));
  }, [KEY, wasDay]);
  await page.reload();
  assert.equal(await page.getAttribute(`[data-day="${QA.id}"]`, "data-done"), "1", "the passed quiz went along with its day");
  await page.click("#b-snd");
  const sh = await state(page);
  assert.deepEqual([sh.planV, sh.quiz[QA.id].best, sh.notes[QA.id], sh.notes.d1, sh.log[QA.id], wasDay in sh.quiz], [3, 29, "a note on the day that moved", "a note on Day 1", 42, false]);

  log("hostile import is sanitized; invalid import changes nothing");
  await openPanel(page, "practice");
  await page.click("#b-set");
  const before = Object.keys((await state(page)).ticks).length;
  await page.setInputFiles("#s-file", { name: "bad.json", mimeType: "application/json", buffer: Buffer.from("[1,2,3]") });
  await page.waitForTimeout(300);
  assert.equal(Object.keys((await state(page)).ticks).length, before, "invalid file: nothing changed");
  if (!(await page.locator("#settings[open]").count())) await page.click("#b-set");
  const evil = { settings: { start: "2026-10-12", portal: "javascript:alert(1)", fx: false }, ticks: { d1a1: true }, quiz: null,
    drill: { best: "<img src=x id=pwn>" }, mocks: [{ at: "x", pct: "<b id=pwn2>" }], book: { "q01-001": { misses: "<i id=pwn3>", note: 5 } },
    inotes: { d1a1: 5, d1a2: "<img src=x id=pwn4>" }, notes: { d1: "<img src=x id=pwn5>" } };
  await page.setInputFiles("#s-file", { name: "evil.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(evil)) });
  await page.waitForTimeout(500);
  const ev = await state(page);
  assert.deepEqual([kind(ev.quiz), ev.drill.best, ev.settings.portal, ev.mocks[0].pct, ev.book["q01-001"].misses, kind(ev.inotes.d1a1)], ["object", 0, "", 0, 1, "undefined"]);
  await openPanel(page, "practice");
  await page.click('#pr-grid [data-sheet="notebook"]');
  assert.equal(await page.locator("#pwn, #pwn2, #pwn3").count(), 0, "no injected markup");
  await page.click("#sheet [data-sh-close]");
  assert.ok(await page.locator("#next .hero-t").count() === 1, "page still renders after the import");
  await openCard(page, "d1", "d1a2");
  assert.equal(await page.inputValue('#card [data-inote="d1a2"]'), "<img src=x id=pwn4>", "a step note is shown as text");
  await page.click('#fl-tools [data-sheet="daynotes"]');
  assert.match(await page.textContent("#sh-body .in-note"), /pwn4/);
  assert.equal(await page.locator("#pwn4, #pwn5").count(), 0, "notes are never rendered as markup");
  await page.click("#sheet [data-sh-close]");
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
