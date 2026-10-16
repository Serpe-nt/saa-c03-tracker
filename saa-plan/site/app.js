(() => {
"use strict";

const PLAN = window.PLAN, LINKS = window.LINKS, GLOSS = window.GLOSSARY, CLEANUP = window.CLEANUP;
const QZ = window.QZ, BANK = window.QUIZ || [], DOCS = window.DOCS || {};
const CARDS = window.CARDS || {}, DRILL = window.DRILL || [], CUES = window.CUES || [];
const KEYS = window.KEYS || {}, CUE_TAGS = window.CUE_TAGS || {}, SCORE_AT = window.SCORE_AT || {}, STEP_TAGS = window.STEP_TAGS || {};
const KEY = "saa-plan-v2";
// Bumped when the plan's days change meaning: entries keyed by a day (quiz results, completion dates) then start again.
// 2 = the 21-day plan on the Solutions Architect learning plan.
// 3 = 22 days: AWS Technical Essentials in front, a new Day 2, every later day one further down.
const PLAN_V = 3;
const DEF = {
  ticks: {}, notes: {}, scores: {}, dayDone: {},
  planV: 0,    // the plan these entries were saved under (see PLAN_V)
  inotes: {},  // step id → your own note on that step
  quiz: {},    // day id → { best, passed: date or "", tries: [{ at, score, n }] }
  qs: {},      // question id → { seen, right, last, at }
  srs: {},     // question id → { step, due }: missed questions waiting for review
  book: {},    // question id → { at, misses, note, fixed }: wrong-answer notebook
  run: null,   // quiz or mock exam in progress; survives a reload
  mocks: [],   // finished mock exams
  conf: {},    // self-check id → "ok" | "shaky"
  kconf: {},   // "<step id>:<point index>" → "ok" | "shaky": key points recalled with "Test me"
  log: {},     // day id → minutes logged by the focus timer
  warm: {},    // date → "done" | "skip"
  slips: [],   // schedule shifts: [{ from: day, n: days }]
  slipSkip: "",
  drill: { best: 0, runs: 0 },
  ach: {},     // badge id → date earned
  rowBest: 0,  // most quiz answers right in a row, ever
  settings: { start: "2026-10-12", portal: "", exam: "", fx: true, sound: true, gif: true },
  // Focus (mode "focus") counts down: endAt, left, from. The break (mode "rest") has no set length and counts up:
  // at = when it last started running, up = seconds banked before a pause.
  // ts = when the timer last changed (merges keep the later one), day = the day a focus block credits, ask = the "done" prompt waits.
  timer: { mode: "focus", running: false, endAt: 0, left: 50 * 60, from: 0, at: 0, up: 0, ts: 0, day: "", ask: false, min: matchMedia("(max-width:640px)").matches },
  savedAt: 0
};
const FOCUS = 50 * 60;      // a focus block, in seconds
const REST_NAG = 10 * 60;   // a break longer than this gets a reminder every minute
const TAGS = { watch: "Watch", play: "Play", prep: "Exam prep", build: "Build", check: "Self-check", setup: "Setup" };
const DOMAINS = ["Secure", "Resilient", "High-performing", "Cost"];
const QUIZ_MIN = 30;
const NOTE_MAX = 2000;
const LETTERS = "ABCDE";

// ---------- state ----------
const clone = o => JSON.parse(JSON.stringify(o));
const kind = v => v === null ? "null" : Array.isArray(v) ? "array" : typeof v;
const isObj = v => kind(v) === "object";
// Overlay b onto a. Where the default has a value, b's value must have the same type, so an
// import or a server copy can't swap an object for null (or a number for markup) and break the page.
function merge(a, b) {
  if (!isObj(b)) return a;
  for (const k in b) {
    if (k === "__proto__" || k === "constructor" || k === "prototype") continue;   // JSON.parse makes these own keys: never walk into a prototype
    const ka = kind(a[k]), kb = kind(b[k]);
    if (k in a && ka !== "null" && ka !== kb) continue;
    if (ka === "object" && kb === "object") merge(a[k], b[k]);
    else a[k] = b[k];
  }
  return a;
}
// Entries inside the maps have no defaults to check against, so validate them one by one.
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const isDay = v => typeof v === "string" && ISO.test(v) && v >= "2000-01-01" && v <= "2999-12-31" && !isNaN(Date.parse(v));
const int0 = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.round(num0(v))));
const num0 = (v, d = 0) => (typeof v === "number" && isFinite(v) ? v : d);
const str0 = v => (typeof v === "string" ? v : "");
const ints = v => Array.isArray(v) && v.every(Number.isInteger);
// A day was inserted in front of Day `from`: what was saved for Day n (n ≥ from) belongs to Day n + 1 now.
function shiftDays(s, from) {
  const up = k => { const m = /^d(\d+)$/.exec(k); return m && +m[1] >= from ? "d" + (+m[1] + 1) : k; };
  for (const f of ["quiz", "dayDone", "notes", "log"]) if (isObj(s[f])) s[f] = Object.fromEntries(Object.entries(s[f]).map(([k, v]) => [up(k), v]));
  if (Array.isArray(s.slips)) s.slips.forEach(x => { if (isObj(x) && Number.isInteger(x.from) && x.from >= from) x.from++; });
  if (isObj(s.run) && typeof s.run.day === "string") s.run.day = up(s.run.day);
}
function clean(s) {
  const keep = (m, ok) => { for (const k of Object.keys(m)) if (!ok(m[k])) delete m[k]; };
  // Saved under an earlier plan: steps keep their ids, so ticks, step notes and answers carry over,
  // but "Day 5" is now a different day, so its quiz result and completion date do not.
  if (s.planV === 2) { shiftDays(s, 2); s.planV = 3; }   // same days, one place further down: nothing is lost
  if (s.planV !== PLAN_V) {
    s.quiz = {}; s.dayDone = {};
    if (isObj(s.run) && s.run.kind === "day") s.run = null;
    s.planV = PLAN_V;
  }
  keep(s.ticks, v => v === true);
  keep(s.notes, v => typeof v === "string");
  keep(s.inotes, v => typeof v === "string");
  for (const k in s.inotes) s.inotes[k] = s.inotes[k].slice(0, NOTE_MAX);
  keep(s.scores, v => typeof v === "string" || typeof v === "number");
  keep(s.dayDone, isDay);
  keep(s.quiz, v => isObj(v) && Array.isArray(v.tries));
  for (const r of Object.values(s.quiz)) {
    r.best = num0(r.best); r.passed = isDay(r.passed) ? r.passed : "";
    r.tries = r.tries.filter(isObj).map(t => ({ at: str0(t.at), score: num0(t.score), n: num0(t.n) }));
  }
  keep(s.qs, isObj);
  for (const k in s.qs) {
    const q = s.qs[k], seen = int0(q.seen, 0, 1e6), right = int0(q.right, 0, seen);
    // xp = the right answers that earned XP; an entry from before that rule keeps all of them, so no level drops
    s.qs[k] = { seen, right, last: q.last ? 1 : 0, at: str0(q.at), xp: typeof q.xp === "number" ? int0(q.xp, 0, right) : right };
  }
  keep(s.srs, v => isObj(v) && isDay(v.due));
  for (const k in s.srs) s.srs[k] = { step: num0(s.srs[k].step), due: s.srs[k].due };
  keep(s.book, isObj);
  for (const k in s.book) { const b = s.book[k]; s.book[k] = { at: str0(b.at), misses: num0(b.misses, 1), note: str0(b.note).slice(0, 300), fixed: !!b.fixed }; }
  s.mocks = s.mocks.filter(isObj).map(m => ({ at: str0(m.at), score: num0(m.score), n: num0(m.n), pct: num0(m.pct), mins: num0(m.mins),
    dom: Array.isArray(m.dom) ? m.dom.slice(0, 4).map(x => (Array.isArray(x) ? [num0(x[0]), num0(x[1])] : [0, 0])) : [] }));
  keep(s.conf, v => v === "ok" || v === "shaky");
  keep(s.kconf, v => v === "ok" || v === "shaky");
  for (const k of Object.keys(s.kconf)) if (!/^[\w-]{1,40}:\d{1,2}$/.test(k)) delete s.kconf[k];
  keep(s.log, v => typeof v === "number" && isFinite(v) && v >= 0);
  for (const k in s.log) s.log[k] = Math.min(s.log[k], 24 * 60);
  keep(s.warm, v => v === "done" || v === "skip");
  s.slips = s.slips.filter(x => isObj(x) && Number.isInteger(x.from) && Number.isInteger(x.n) && x.n > 0 && x.n < 100).map(x => ({ from: x.from, n: x.n }));
  s.drill = { best: num0(s.drill.best), runs: num0(s.drill.runs) };
  keep(s.ach, isDay);
  s.rowBest = int0(s.rowBest, 0, 1000);
  if (!ISO.test(s.settings.start)) s.settings.start = DEF.settings.start;
  if (s.settings.exam && !ISO.test(s.settings.exam)) s.settings.exam = "";
  if (!/^https?:\/\//i.test(s.settings.portal)) s.settings.portal = "";
  const t = s.timer;
  // The break used to be a 10-minute countdown called "break": such a copy starts the open-ended break afresh.
  if (t.mode === "break") { t.mode = "rest"; t.running = false; t.up = 0; }
  if (t.mode !== "focus" && t.mode !== "rest") t.mode = "focus";
  t.left = Math.min(FOCUS, Math.max(0, Math.round(num0(t.left, FOCUS))));
  t.endAt = num0(t.endAt); t.from = Math.min(FOCUS, Math.max(0, num0(t.from))); t.at = num0(t.at);
  t.up = Math.min(86400, Math.max(0, num0(t.up)));
  t.ts = num0(t.ts);
  if (!PLAN.some(d => d.id === t.day)) t.day = "";
  if (t.ask && (t.mode !== "rest" || t.running)) t.ask = false;   // the prompt only waits on a break not yet started
  // Running needs a clock that makes sense: a focus block ends within 50 minutes from now, a break began in the last day.
  const now = Date.now();
  if (t.running && !(t.mode === "rest" ? t.at > now - 864e5 && t.at < now + 6e4 : t.endAt > 0 && t.endAt < now + FOCUS * 1000 + 6e4)) t.running = false;
  s.savedAt = num0(s.savedAt);
  s.run = cleanRun(s.run);
  return s;
}
function cleanRun(r) {
  if (!isObj(r) || !["day", "mock", "review", "warm", "step"].includes(r.kind) || !Array.isArray(r.ids) || !r.ids.every(x => typeof x === "string")) return null;
  if (r.kind === "day" && !PLAN.some(d => d.id === r.day)) return null;
  const out = {
    kind: r.kind, day: str0(r.day), item: str0(r.item), ids: r.ids, ord: {}, ans: {}, flag: {}, i: Number.isInteger(r.i) && r.i >= 0 ? r.i : 0,
    t0: num0(r.t0), end: num0(r.end), done: !!r.done, view: r.view === "grid" ? "grid" : "", seen: !!r.seen, only: r.only !== false,
    score: num0(r.score), mins: num0(r.mins), cel: ["all", "week", "day"].includes(r.cel) ? r.cel : "", mockNew: !!r.mockNew,
    // right answers in a row now and at most in this run; XP when it started (-1: not known, a run from before XP)
    row: int0(r.row, 0, r.ids.length), rowMax: int0(r.rowMax, 0, r.ids.length), best0: int0(r.best0, 0, 1000), xp0: num0(r.xp0, -1), rec: !!r.rec,   // rec: "New record" said in this run
    xp1: num0(r.xp1, -1), gif: typeof r.gif === "string" && /^[A-Za-z0-9]{1,32}$/.test(r.gif) ? r.gif : ""   // XP and the GIF at the finish
  };
  for (const id of r.ids) {
    if (isObj(r.ord) && ints(r.ord[id])) out.ord[id] = r.ord[id];
    if (isObj(r.ans) && ints(r.ans[id])) out.ans[id] = r.ans[id];
    if (isObj(r.flag) && r.flag[id]) out.flag[id] = 1;
  }
  if (isObj(r.res) && ints(r.res.dom ? r.res.dom.flat() : null)) out.res = { score: num0(r.res.score), n: num0(r.res.n), pct: num0(r.res.pct), dom: r.res.dom };
  if (out.kind === "mock" && out.done && !out.res) return null;
  return out;
}
const parseState = obj => clean(merge(clone(DEF), obj));
function load() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  return parseState(s);
}
let S = load();
// Server sync bookkeeping (see "server sync" below): last revision seen, unsaved changes, save count.
const SYNC_KEY = KEY + "-sync";
const sync = { on: false, rev: 0, dirty: false, busy: false, again: false, n: 0 };
const firstSync = localStorage.getItem(SYNC_KEY) === null;
try { Object.assign(sync, JSON.parse(localStorage.getItem(SYNC_KEY)) || {}, { on: false, busy: false, again: false, n: 0 }); } catch (e) {}
// Progress saved before the server existed must be merged into the server copy, not replaced by it.
if (firstSync && (Object.keys(S.ticks).length || Object.keys(S.notes).length || Object.keys(S.qs).length)) sync.dirty = true;
const syncMeta = () => { try { localStorage.setItem(SYNC_KEY, JSON.stringify({ rev: sync.rev, dirty: sync.dirty })); } catch (e) {} };
function save() {
  S.savedAt = Date.now();
  sync.n++;
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  syncLater();
}

// ---------- indexes ----------
const DAYS = PLAN.filter(d => d.id);
const itemIndex = Object.create(null);
DAYS.forEach(d => d.groups.forEach((g, gi) => {
  g.key = d.id + "g" + gi;
  g.items.forEach(it => { itemIndex[it[0]] = { d, g, it }; });
}));
const LAST = DAYS[DAYS.length - 1].day;
const TP = QZ.topics(PLAN, STEP_TAGS);   // what each day teaches; the day quizzes are drawn from it
// Questions by id and by plan step (the ones that name the step, plus the ones on a topic it teaches), and the steps that teach each topic.
const QBY = Object.create(null), QREF = {}, TAG_STEPS = {}, ORDER = {};
BANK.forEach(q => { QBY[q.id] = q; });
Object.keys(itemIndex).forEach((id, i) => {
  ORDER[id] = i;
  const qs = QZ.forStep(id, STEP_TAGS[id], BANK);
  if (qs.length) QREF[id] = qs;
  (STEP_TAGS[id] || []).forEach(t => { (TAG_STEPS[t] = TAG_STEPS[t] || []).push(id); });
});
// Weeks are whatever the plan's {week: "…"} entries make them.
const WEEK = {}, WEEKS = [];
PLAN.forEach(d => { if (d.week) WEEKS.push(d.week); else if (d.id) WEEK[d.id] = Math.max(0, WEEKS.length - 1); });
const dayOf = id => DAYS.find(x => x.id === id);
const done = id => !!S.ticks[id];
const gIds = g => g.items.map(i => i[0]);
const dIds = d => d.groups.flatMap(gIds);
const groupDone = g => gIds(g).every(done);
const hasQuiz = d => QZ.hasQuiz(d);
const quizOk = d => !hasQuiz(d) || !!(S.quiz[d.id] && S.quiz[d.id].passed);
const itemsDone = d => dIds(d).every(done);
const dayDone = d => itemsDone(d) && quizOk(d);
// The cards of a day, in order: one per step, then the quiz.
const stepIds = d => (hasQuiz(d) ? [...dIds(d), "quiz"] : dIds(d));
const groupLeft = g => { const ids = gIds(g); return (g.min || 0) * ids.filter(i => !done(i)).length / ids.length; };
const dayLeft = d => d.groups.reduce((a, g) => a + groupLeft(g), 0) + (quizOk(d) ? 0 : QUIZ_MIN);
const dayPlanned = d => d.groups.reduce((a, g) => a + (g.min || 0), 0) + (hasQuiz(d) ? QUIZ_MIN : 0);
const weekOf = d => DAYS.filter(x => WEEK[x.id] === WEEK[d.id]);
// The mock exam opens once the days of new material are done (MOCK_AFTER in plan.js; without it, every day but the last).
const MOCK_AFTER = Number.isInteger(window.MOCK_AFTER) ? window.MOCK_AFTER : LAST - 1;
const mockDays = DAYS.filter(d => d.day <= MOCK_AFTER);
const mockOpen = () => mockDays.every(dayDone);
function markDayDone(d) {
  if (dayDone(d)) { if (!S.dayDone[d.id]) S.dayDone[d.id] = today(); }
  else delete S.dayDone[d.id];
}

// ---------- dates & formatting ----------
function parseDate(s) { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, (m || 1) - 1, d || 1); }
const shift = n => S.slips.reduce((a, s) => a + (n >= s.from ? s.n : 0), 0);
function dayDate(n) { const d = parseDate(S.settings.start); d.setDate(d.getDate() + n - 1 + shift(n)); return d; }
function midnight(d = new Date()) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
const diffDays = (a, b) => Math.round((midnight(a) - midnight(b)) / 864e5);
// Which plan day today is: 0 or less before Day 1, more than the last day's number after it.
function todayIdx() {
  const t = midnight();
  if (t < dayDate(1)) return 1 + diffDays(t, dayDate(1));
  if (t > dayDate(LAST)) return LAST + diffDays(t, dayDate(LAST));
  let n = 1;
  for (let k = 1; k <= LAST; k++) if (dayDate(k) <= t) n = k;
  return n;
}
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const today = () => iso(new Date());
const examDate = () => S.settings.exam ? parseDate(S.settings.exam) : dayDate(LAST);
const fmtD = d => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const fmtH = m => m < 1 ? "0 min" : m < 60 ? `${Math.round(m / 5) * 5 || 5} min` : `${Math.round(m / 30) / 2} h`;
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const plural = (n, one, many = one + "s") => `${n} ${n === 1 ? one : many}`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const strip = h => { const t = document.createElement("div"); t.innerHTML = h; return t.textContent; };
const clock = ms => { const s = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
function linkFor(key) {
  if (!key) return null;
  if (key === "own") return (/^https?:\/\//i.test(S.settings.portal) && S.settings.portal) || LINKS.console.url;
  return LINKS[key] ? LINKS[key].url : null;
}
function download(text, name, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// One modal at a time: later dialogs (quiz prompt after the cleanup check, say) wait their turn.
const pending = [];
function whenFree(fn) { if (document.querySelector("dialog[open]")) pending.push(fn); else fn(); }
function runPending() { setTimeout(() => { if (pending.length && !document.querySelector("dialog[open]")) pending.shift()(); }, 250); }

// ---------- glossary ----------
const GL = {}, GLK = {};
Object.keys(GLOSS).forEach(k => { GL[k.toLowerCase()] = GLOSS[k]; GLK[k.toLowerCase()] = k; });
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const GRE = new RegExp(`(?<![\\w-])(${Object.keys(GLOSS).sort((a, b) => b.length - a.length).map(escRe).join("|")})(?:s|es)?(?![\\w-])`, "gi");
function applyGlossary(scope) {
  scope.querySelectorAll(".txt").forEach(el => {
    const seen = new Set();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentElement.closest("code,a,.g") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const t = n.nodeValue;
      let m, last = 0, frag = null;
      GRE.lastIndex = 0;
      while ((m = GRE.exec(t))) {
        const key = m[1].toLowerCase();
        if (seen.has(key) || !GL[key]) continue;
        seen.add(key);
        frag = frag || document.createDocumentFragment();
        frag.append(t.slice(last, m.index));
        const s = document.createElement("span");
        s.className = "g"; s.tabIndex = 0; s.textContent = m[0]; s.dataset.tip = GL[key];
        frag.append(s);
        last = m.index + m[0].length;
      }
      if (frag) { frag.append(t.slice(last)); n.replaceWith(frag); }
    });
  });
}
// Glossary terms that occur in a piece of plain text, in order of appearance: [term, definition].
function termsIn(text) {
  const out = [], seen = new Set();
  let m;
  GRE.lastIndex = 0;
  while ((m = GRE.exec(text))) {
    const k = m[1].toLowerCase();
    if (seen.has(k) || !GL[k]) continue;
    seen.add(k);
    out.push([GLK[k], GL[k]]);
  }
  return out;
}

// ---------- views: the overview, or one day shown one step at a time ----------
const homeEl = document.getElementById("home"), flowEl = document.getElementById("flow"), cardEl = document.getElementById("card");
const bodyEl = document.getElementById("fl-body"), sideL = document.getElementById("side-l"), sideR = document.getElementById("side-r");
let view = { day: "", at: "" };   // day "" = overview. at = a step id, "quiz", or "done" (the day's summary).
let shown = "", movedAt = 0;      // the card on screen and when it appeared
// A day opens on its first open step, then on its quiz, then on its summary.
const landing = d => dIds(d).find(id => !done(id)) || (dayDone(d) ? "done" : hasQuiz(d) ? "quiz" : dIds(d)[0]);
const validAt = (d, at) => (stepIds(d).includes(at) || (at === "done" && dayDone(d)) ? at : landing(d));
// The address bar mirrors the view (#d3/d3w2), so a reload stays on the card and the browser's Back returns to the overview.
function setView(day, at, push) {
  const d = day && dayOf(day);
  view = d ? { day: d.id, at: validAt(d, at || "") } : { day: "", at: "" };
  const hash = d ? `#${view.day}/${view.at}` : "";
  if (location.hash !== hash) history[push ? "pushState" : "replaceState"](null, "", hash || location.pathname + location.search);
  const key = view.day + "/" + view.at, moved = key !== shown;
  homeEl.hidden = !!d; flowEl.hidden = !d;
  document.body.classList.toggle("in-flow", !!d);
  if (d) renderFlow(moved);
  if (moved) { shown = key; movedAt = Date.now(); scrollTo(0, 0); }
}
function route() {
  const m = /^#(d\d+)(?:\/([\w-]+))?$/.exec(location.hash);
  setView(m ? m[1] : "", m ? m[2] : "", false);
}
addEventListener("hashchange", route);
// Go to another card of the day on screen, and put the keyboard on its heading.
function move(at) {
  setView(view.day, at, false);
  const h = cardEl.querySelector(".c-t");
  if (h) h.focus({ preventScroll: true });
}
const jumpTo = id => setView(itemIndex[id].d.id, id, true);

// Section choices on the card (which helper lists are folded open) stay as you left them, in this browser only.
const UI_KEY = KEY + "-ui";
let ui = {};
try { const u = JSON.parse(localStorage.getItem(UI_KEY)); if (isObj(u)) ui = u; } catch (e) {}
const saveUI = () => { try { localStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch (e) {} };
// Theme, text size and the focus view are this browser's choice (Settings, the Focus view button), never synced.
function applyDisplay() {
  const r = document.documentElement;
  if (ui.theme === "light" || ui.theme === "dark") r.dataset.theme = ui.theme; else delete r.dataset.theme;
  if (ui.size === "l" || ui.size === "xl") r.dataset.size = ui.size; else delete r.dataset.size;
  document.body.classList.toggle("focus-view", !!ui.focusView);
}
applyDisplay();

// ---------- overview: day tiles and quick links ----------
function renderMap(ti) {
  let h = "", open = false;
  for (const d of PLAN) {
    if (d.week) { h += `${open ? "</div>" : ""}<div class="week">${d.week}</div><div class="tiles">`; open = true; continue; }
    const ids = dIds(d), k = ids.filter(done).length, complete = dayDone(d), quizDue = k === ids.length && !complete;
    const st = complete ? "✓ Done" : quizDue ? "Quiz to pass" : k ? `${k} of ${ids.length} steps, ~${fmtH(dayLeft(d))} left` : `${plural(ids.length, "step")}, ~${fmtH(dayPlanned(d))}`;
    h += `<a class="dt" href="#${d.id}" data-day="${d.id}" data-done="${complete ? 1 : 0}" data-quiz="${quizDue ? 1 : 0}" data-today="${d.day === ti ? 1 : 0}">` +
      `<span class="dt-n"><small>Day</small>${d.day}</span>${d.day === ti ? `<span class="today-badge">Today</span>` : ""}` +
      `<span class="dt-t">${d.title}</span><span class="dt-d">${fmtD(dayDate(d.day))}</span><span class="dt-s">${st}</span>` +
      `<span class="pbar"><span style="width:${pct(k + (hasQuiz(d) && quizOk(d) ? 1 : 0), stepIds(d).length)}%"></span></span></a>`;
  }
  document.getElementById("map").innerHTML = h + (open ? "</div>" : "");
}
function renderLinks() {
  const nav = document.getElementById("links");
  // every link of the plan that is not marked hidden, in the plan's order; the console link becomes your own sign-in page once you set it
  const items = Object.keys(LINKS).filter(k => !LINKS[k].hidden).map(k => (k === "console" && S.settings.portal ? ["AWS sign-in", S.settings.portal] : [LINKS[k].label, LINKS[k].url]));
  nav.innerHTML = items.map(([l, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(l)} ↗</a>`).join("");
}

// ---------- status / refresh ----------
function streak() {
  const dates = new Set(Object.values(S.dayDone));
  let n = 0;
  const d = midnight();
  if (!dates.has(iso(d))) d.setDate(d.getDate() - 1);
  while (dates.has(iso(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function renderStats(dn, total) {
  const mins = Object.values(S.log).reduce((a, b) => a + b, 0), sk = streak();
  let seen = 0, right = 0;
  for (const id in S.qs) if (QBY[id]) { seen += S.qs[id].seen; right += S.qs[id].right; }
  const cells = [
    ["Steps", `${dn} <small>of ${total}</small>`],
    ["Days", `${DAYS.filter(dayDone).length} <small>of ${DAYS.length}</small>`],
    ["Focus time", mins >= 1 ? fmtH(mins) : "–"],
    ["Quiz answers right", seen ? `${pct(right, seen)}% <small>of ${seen}</small>` : "–"],
    ["Streak", sk ? `🔥 ${plural(sk, "day")}` : "–"]
  ];
  const L = levelOf(xpTotal());
  document.getElementById("stats").innerHTML = cells.map(([k, v]) => `<div class="st"><span class="tb-k">${k}</span><b>${v}</b></div>`).join("") +
    `<button type="button" class="st st-lv" data-sheet="badges" title="${L.x} XP, ${L.to - L.x} to level ${L.n + 1}. Open badges and level."><span class="tb-k">Level</span>` +
    `<b>${L.n} <small>${rankOf(L.n)}</small></b><span class="xpbar"><span style="width:${L.pct}%"></span></span></button>`;
}
function refresh() {
  const ti = todayIdx();
  let total = 0, dn = 0;
  for (const d of DAYS) {
    const ids = dIds(d), q = hasQuiz(d) ? 1 : 0;
    total += ids.length + q; dn += ids.filter(done).length + (q && quizOk(d) ? 1 : 0);
  }
  const p = pct(dn, total);
  document.getElementById("bar").style.width = p + "%";
  document.getElementById("tb-pct").textContent = p + "%";
  document.getElementById("tb-sheet").textContent = ti < 1 ? "Not started" : ti > LAST ? "Finished" : `Day ${ti} of ${LAST}`;
  const examD = examDate();
  document.getElementById("tb-exam").textContent = fmtD(examD);
  document.getElementById("tb-exam-k").textContent = S.settings.exam ? "Exam (booked)" : "Exam";

  // status line
  const st = [];
  if (ti < 1) {
    st.push(`<span>Starts <b>${fmtD(dayDate(1))}</b> (in ${plural(1 - ti, "day")})</span>`);
  } else if (ti > LAST) {
    st.push(`<span>Plan period ended ${fmtD(dayDate(LAST))}</span>`);
  } else {
    const td = DAYS[ti - 1];
    st.push(`<span><b>Today:</b> ${td.title}</span>`);
    st.push(dayDone(td) ? `<span class="pill ok">Today done</span>` : `<span>~${fmtH(dayLeft(td))} left today</span>`);
    const overdue = DAYS.filter(d => d.day < ti).reduce((a, d) => a + dayLeft(d), 0);
    if (overdue > 0) st.push(`<span class="pill ${overdue > 180 ? "bad" : "warn"}">Behind: ~${fmtH(overdue)} from earlier days</span>`);
    else if (DAYS.some(d => d.day > ti && dIds(d).some(done))) st.push(`<span class="pill ok">Ahead of plan</span>`);
    else st.push(`<span class="pill ok">On track</span>`);
  }
  if (S.settings.exam && dayDate(LAST) > parseDate(S.settings.exam)) st.push(`<span class="pill bad">Plan now ends after your booked exam</span>`);
  const daysToExam = diffDays(examD, new Date());
  if (daysToExam >= 0) st.push(`<span>${daysToExam ? `Exam in <b>${plural(daysToExam, "day")}</b>` : "<b>Exam today</b>"}</span>`);
  document.getElementById("status").innerHTML = st.join("");

  renderSlip();
  renderNext(ti);
  renderStats(dn, total);
  renderMap(ti);
  renderScores();
  renderPractice();
  if (view.day) setView(view.day, view.at, false);
}

// ---------- slip guard ----------
const overdueDay = () => DAYS.find(d => !dayDone(d) && dayDate(d.day) < midnight()) || null;
function renderSlip() {
  const el = document.getElementById("slip");
  const d = overdueDay();
  if (!d || S.slipSkip === today()) { el.hidden = true; el.innerHTML = ""; return; }
  const late = diffDays(new Date(), dayDate(d.day));
  el.hidden = false;
  el.innerHTML = `<span>Day ${d.day} was planned for <b>${fmtD(dayDate(d.day))}</b> and isn't finished.</span>` +
    `<button type="button" class="primary" data-slip="${late}">Move Day ${d.day}${d.day < LAST ? "–" + LAST : ""} ${plural(late, "day")} later</button>` +
    `<button type="button" data-slip="skip">Not now</button>` +
    (S.settings.exam ? `<span class="muted">Booked exam: ${fmtD(parseDate(S.settings.exam))}. Pearson VUE lets you reschedule up to 24 h before.</span>` : "");
}
function applySlip(v) {
  if (v === "skip") { S.slipSkip = today(); save(); refresh(); return; }
  const d = overdueDay(), n = +v;
  if (!d || !(n > 0)) return;
  S.slips.push({ from: d.day, n });
  save(); refresh();
  FX.banner("Schedule moved", `Day ${d.day} is today. Day ${LAST} is now ${fmtD(dayDate(LAST))}.`, "info");
}

// ---------- overview: the day to work on, with one button to start or continue ----------
function nextStep() {
  for (const d of DAYS) {
    for (const g of d.groups) for (const it of g.items) if (!done(it[0])) return { d, g, it };
    if (!quizOk(d)) return { d, quiz: true };
  }
  return null;
}
function warmInfo() {
  if ((S.run && !S.run.done) || todayIdx() < 2 || !BANK.length) return null;
  const t = today();
  if (!S.warm[t]) {
    const n = QZ.pickWarmup(BANK, S.qs, S.srs, t, 5).length;
    if (n) return { kind: "warm", n };
  }
  const due = QZ.dueIds(S.srs, t).filter(id => QBY[id]).length;
  return due ? { kind: "review", n: due } : null;
}
function warmHTML() {
  const w = warmInfo();
  if (!w) return "";
  return w.kind === "warm"
    ? `<div class="nx-warm"><span>☕ <b>Warm-up:</b> ${plural(w.n, "quick question")} from yesterday before you start. Recalling it now is what makes it stick.</span><span class="nx-wb"><button type="button" class="primary" data-warm="start">Start</button><button type="button" data-warm="skip">Skip today</button></span></div>`
    : `<div class="nx-warm"><span>🔁 <b>${plural(w.n, "missed question")}</b> ${w.n === 1 ? "is" : "are"} due for review.</span><span class="nx-wb"><button type="button" data-review>Review now</button></span></div>`;
}
const liveQuiz = d => !!(S.run && S.run.kind === "day" && S.run.day === d.id && !S.run.done);
function renderNext(ti) {
  const el = document.getElementById("next");
  const pre = warmHTML();
  const n = nextStep();
  if (!n) {
    el.className = "next all-done";
    el.innerHTML = pre + `<div>Every day is done. 🚀 Go pass SAA-C03.</div>` +
      `<div class="nx-a center"><button type="button" class="primary" data-mock>${S.run && S.run.kind === "mock" && !S.run.done ? "Resume mock exam" : "Take a mock exam"}</button></div>`;
    return;
  }
  el.className = "next";
  const { d } = n, ids = dIds(d), k = ids.filter(done).length;
  const when = d.day < ti ? `<span class="pill warn">from Day ${d.day}</span>` : d.day > ti && ti >= 1 ? `<span class="pill ok">working ahead</span>` : "";
  let step, act;
  if (n.quiz) {
    const r = S.quiz[d.id], tries = r ? r.tries.length : 0, live = liveQuiz(d);
    step = `<span class="tag t-quiz">Quiz</span><span>${live ? `You are on question ${S.run.i + 1} of ${S.run.ids.length}.` : tries ? `Best so far ${r.best} of ${QZ.DAILY}. A retake draws different questions.` : `Every step is done. ${QZ.DAILY} questions, pass at ${QZ.needed(QZ.DAILY)}.`}</span>`;
    act = `<button type="button" class="primary big" data-quiz-start="${d.id}">${live ? "Resume quiz" : tries ? `Retake the Day ${d.day} quiz` : `Take the Day ${d.day} quiz`}</button>` +
      `<a class="btn" href="#${d.id}/quiz">Open Day ${d.day}</a>`;
  } else {
    step = `<span class="tag t-${n.g.t}">${n.g.label || TAGS[n.g.t]}</span><span>${n.it[1]}</span>`;
    act = `<a class="btn primary big" href="#${d.id}">${k ? "Continue" : "Start"} Day ${d.day}</a>`;
  }
  el.innerHTML = pre +
    `<div class="nx-h"><span class="nx-k">${d.day === ti ? "Today" : "Next up"}</span><span>${fmtD(dayDate(d.day))}</span>${when}</div>` +
    `<div class="hero"><span class="hero-n"><small>Day</small>${d.day}</span><div><h2 class="hero-t">${d.title}</h2><p class="goal">${d.goal}</p></div></div>` +
    `<div class="hero-p"><span class="pbar"><span style="width:${pct(k, stepIds(d).length)}%"></span></span>` +
    `<span class="muted">${k} of ${ids.length} steps done${hasQuiz(d) ? ", then the quiz" : ""}. About ${fmtH(dayLeft(d))} left.</span></div>` +
    `<div class="hero-nx"><span class="muted">${n.quiz ? "Up next" : k ? "Next step" : "First step"}</span>${step}</div>` +
    `<div class="nx-a">${act}</div>`;
}

// ---------- day flow: one card at a time ----------
const plain = {};
const stepTitle = id => (id === "quiz" ? "End-of-day quiz" : plain[id] || (plain[id] = strip(itemIndex[id].it[1])));
const flipLabel = id => S.conf[id] === "shaky" ? "Shaky: show answer" : "Show answer";
function renderFlow(moved) {
  const d = dayOf(view.day), ids = stepIds(d), at = view.at, i = ids.indexOf(at);
  document.getElementById("fl-day").innerHTML = `<span class="fl-dn">Day ${d.day}</span><span class="fl-tt">${d.title}</span>` +
    `<span class="fl-dd">${fmtD(dayDate(d.day))}</span>${d.day === todayIdx() ? `<span class="today-badge">Today</span>` : ""}`;
  const tools = [`<button type="button" class="ghost" data-focus-view aria-pressed="${!!ui.focusView}" title="Hide the panels beside the card (F)">${ui.focusView ? "⤡ Show panels" : "⤢ Focus view"}</button>`,
    `<button type="button" class="ghost" data-search title="Search (Ctrl+K)">🔍</button>`,
    `<button type="button" class="ghost" data-sheet="daynotes">📝 Day notes</button>`];
  if (d.groups.some(g => g.t === "build")) tools.push(`<button type="button" class="ghost" data-cleanup="${d.id}">🧹 Cleanup check</button>`);
  for (const t of d.tools || []) tools.push(t === "notebook" ? `<button type="button" class="ghost" data-sheet="notebook">📓 Notebook</button>` : `<button type="button" class="ghost" data-sheet="weak">📈 Weak spots</button>`);
  document.getElementById("fl-tools").innerHTML = tools.join("");

  // one dot per card, grouped like the day's blocks
  const dot = id => {
    const on = id === "quiz" ? quizOk(d) : done(id), t = stepTitle(id);
    return `<button type="button" class="dot${on ? " on" : ""}${id === "quiz" ? " qd" : ""}${id === fxMark.pop ? " pop" : ""}" data-at="${id}"${id === at ? ' aria-current="step"' : ""} title="${esc(t)}" aria-label="${esc(`Step ${ids.indexOf(id) + 1}: ${t}${on ? " (done)" : ""}`)}"></button>`;
  };
  document.getElementById("fl-strip").innerHTML = d.groups.map(g => `<span class="fl-g${g.key === fxMark.wave ? " wave" : ""}">${g.items.map(it => dot(it[0])).join("")}</span>`).join("") +
    (hasQuiz(d) ? `<span class="fl-g">${dot("quiz")}</span>` : "");
  document.getElementById("fl-count").textContent = at === "done" ? "Day complete" : `Step ${i + 1} of ${ids.length}`;

  // Typing in a field on the card or its panels: leave them alone, only the frame around them changes.
  const typing = !moved && bodyEl.contains(document.activeElement) && document.activeElement.matches("textarea,input");
  if (!typing) {
    const answer = !moved && cardEl.querySelector(".card-a:not([hidden])");
    if (recall.id && recall.id !== at) recall = { id: "", open: new Set(), marks: {} };   // "Test me" ends with its card
    const step = at !== "quiz" && at !== "done", side = step ? sideHTML(at) : { l: "", r: "" };
    cardEl.innerHTML = at === "quiz" ? quizCardHTML(d) : at === "done" ? doneCardHTML(d) : stepCardHTML(at);
    sideL.innerHTML = side.l; sideR.innerHTML = side.r;
    sideL.hidden = !side.l; sideR.hidden = !side.r;
    bodyEl.classList.toggle("no-l", !side.l); bodyEl.classList.toggle("no-r", !side.r);
    applyGlossary(cardEl);
    if (answer) flip(at, true);
    if (moved) for (const el of [cardEl, sideL, sideR]) { el.classList.remove("in"); void el.offsetWidth; el.classList.add("in"); }
  }

  // Back, the card's main action, Next
  const back = at === "done" ? ids[ids.length - 1] : ids[i - 1] || "";
  const next = at === "done" ? "" : ids[i + 1] || (dayDone(d) ? "done" : "");
  let mid, isDone = false;
  if (at === "done") {
    const nx = DAYS.find(x => x.day > d.day && !dayDone(x));
    mid = nx ? `<a class="btn primary big" href="#${nx.id}" data-main>Start Day ${nx.day}</a>` : `<button type="button" class="primary big" data-home data-main>Back to the overview</button>`;
  } else if (at === "quiz") {
    const r = S.quiz[d.id], live = liveQuiz(d);
    isDone = quizOk(d) && !live;
    mid = isDone ? `<span class="fl-ok">✓ Passed</span>`
      : `<button type="button" class="primary big" data-quiz-start="${d.id}" data-main${itemsDone(d) || live ? "" : " disabled"}>${live ? "Resume quiz" : r && r.tries.length ? "Retake quiz" : "Start quiz"}</button>`;
  } else {
    isDone = done(at);
    mid = isDone ? `<span class="fl-ok">✓ Completed</span><button type="button" class="link" data-undo="${at}">Undo</button>`
      : `<button type="button" class="primary big" data-complete="${at}" data-main>✓ Mark complete</button>`;
  }
  const nextMain = isDone && next;
  document.getElementById("fl-nav").innerHTML =
    `<button type="button" class="fl-b ghost" data-back data-at="${back}"${back ? "" : " disabled"}>← Back</button>` +
    `<div class="fl-mid">${mid}</div>` +
    (at === "done" ? `<span></span>` : `<button type="button" class="fl-n ${nextMain ? "primary" : "ghost"}" data-next data-at="${next}"${nextMain ? " data-main" : ""}${next ? "" : " disabled"}>Next →</button>`);
}

// Docs for a step: the pages its key points cite, then the AWS pages its own quiz questions point to most often
// (questions that name the step or have one of its topics as their main topic).
function stepDocs(id) {
  const out = [], seen = new Set();
  const add = (label, url) => { if (/^https:\/\//.test(url) && !seen.has(url)) { seen.add(url); out.push([label, url]); } };
  ((KEYS[id] || {}).docs || []).forEach(x => add(x[0], x[1]));
  const n = {}, mine = STEP_TAGS[id] || [];
  (QREF[id] || []).forEach(q => { if (DOCS[q.doc] && (q.ref.includes(id) || mine.includes(q.tags[0]))) n[q.doc] = (n[q.doc] || 0) + 1; });
  Object.keys(n).sort((a, b) => n[b] - n[a]).forEach(k => add(DOCS[k][0], DOCS[k][1]));
  return out.slice(0, 5);
}
// Exam topics a step feeds: the ones the plan names for it, else the tags of the quiz questions that point at it, most frequent first.
function stepTags(id) {
  if (STEP_TAGS[id]) return STEP_TAGS[id].slice(0, 4);
  const n = {};
  (QREF[id] || []).forEach(q => q.tags.forEach(t => { n[t] = (n[t] || 0) + 1; }));
  return Object.keys(n).sort((a, b) => n[b] - n[a]).slice(0, 4);
}
function tagStats() {
  const m = {};
  for (const q of BANK) {
    const s = S.qs[q.id];
    if (s) for (const t of q.tags) { const a = m[t] || (m[t] = [0, 0]); a[0] += s.right; a[1] += s.seen; }
  }
  return m;
}
// A section of the card or a panel: a tinted box with an icon; its edge colour says what kind of thing it holds.
const box = (kind, icon, title, body, cls = "") =>
  `<section class="box b-${kind}${cls ? " " + cls : ""}"><h3 class="box-h"><span class="bi" aria-hidden="true">${icon}</span>${title}</h3>${body}</section>`;
// A box that folds; whether it is open is remembered across cards, in this browser.
const foldBox = (kind, icon, sec, title, n, body, openByDefault) =>
  `<details class="box b-${kind} c-fold" data-sec="${sec}"${(sec in ui ? ui[sec] : openByDefault) ? " open" : ""}><summary class="box-h"><span class="bi" aria-hidden="true">${icon}</span>${title} <span class="muted">${n}</span></summary>${body}</details>`;
function scoreFieldHTML(k) {
  const src = document.querySelector(`#scores [data-score="${k}"]`);
  if (!src) return "";
  const lab = src.closest("label").cloneNode(true);
  lab.querySelector("input").setAttribute("value", S.scores[k] ?? "");
  return `<div class="scores-grid c-score">${lab.outerHTML}</div>`;
}
// The card holds what you read for the step: why it exists, where to do it, the model answer, what to know, the exam trap.
// Everything to look up or practise with sits in the panels beside it (sideHTML).
function stepCardHTML(id) {
  const { d, g, it } = itemIndex[id], [, txt, note] = it;
  const url = linkFor(g.link), n = g.items.length, kp = KEYS[id];
  let h = `<div class="c-h"><span class="tag t-${g.t}">${g.label || TAGS[g.t]}</span>` +
    (n > 1 ? `<span class="c-meta">${g.items.indexOf(it) + 1} of ${n}</span>` : "") +
    (g.min ? `<span class="c-meta">~${fmtH(g.min)}${n > 1 ? " for this block" : ""}</span>` : "") +
    (done(id) ? `<span class="pill ok">✓ Completed</span>` : "") + `</div>` +
    `<h2 class="c-t txt" tabindex="-1">${txt}</h2>` + (note ? `<p class="c-n txt">${note}</p>` : "");
  // Purpose first: the problem or need behind the step comes before where to do it and before any detail.
  if (kp && kp.why) h += box("why", "💡", g.t === "setup" || g.t === "prep" ? "Why this step" : "Why it exists", `<p class="txt">${kp.why}</p>`, "c-why");
  if (g.where || url) h += `<div class="box b-where c-w"><span class="bi" aria-hidden="true">📍</span>${g.where ? `<span class="where">Where: ${g.where}</span>` : `<span class="where"></span>`}${url ? `<a class="btn" href="${esc(url)}" target="_blank" rel="noopener">Open ↗</a>` : ""}</div>`;
  if (SCORE_AT[id]) h += scoreFieldHTML(SCORE_AT[id]);
  if (d.decision === id) { const [cls, v] = verdictHTML(); h += `<div class="verdict ${cls}" data-verdict>${v}</div>`; }
  if (g.t === "check" && CARDS[id]) {
    h += box("check", "🧠", "Self-check", `<p class="muted">Explain it out loud first, then open the model answer and compare.</p>` +
      `<button type="button" class="flip${S.conf[id] === "shaky" ? " shaky" : ""}" data-flip="${id}" aria-expanded="false" aria-controls="ca-${id}">${flipLabel(id)}</button>` +
      `<div class="card-a" id="ca-${id}" hidden><div class="card-t">${CARDS[id]}</div><div class="card-b"><span class="muted">How close were you?</span>` +
      `<button type="button" data-conf="ok" data-cid="${id}">Got it</button><button type="button" data-conf="shaky" data-cid="${id}">Shaky</button></div></div>`, "c-check");
  }
  if (kp) {
    // a point is [label, text]; a bare string is the older form
    const pts = kp.k || [], labelled = pts.some(Array.isArray);
    if (pts.length) {
      // "Test me": only the labels show; you say each point, reveal it and mark it (S.kconf). Otherwise a mark shows next to its label.
      const testing = labelled && recall.id === id, marked = pts.filter((x, i) => recall.marks[i]).length;
      const btn = !labelled ? "" : testing ? `<button type="button" class="sm k-btn" data-test-end>Done</button>`
        : `<button type="button" class="sm k-btn" data-test="${id}" title="Hide the text, say each point, then check it">🧠 Test me</button>`;
      const li = (x, i) => {
        if (!Array.isArray(x)) return `<li>${x}</li>`;
        if (!testing) {
          const m = S.kconf[`${id}:${i}`];
          return `<li><b class="k-l">${x[0]}${m === "shaky" ? ` <span class="pill warn k-m">shaky</span>` : m === "ok" ? ` <span class="k-m ok" title="Got it in Test me">✓</span>` : ""}</b><span>${x[1]}</span></li>`;
        }
        if (!recall.open.has(i)) return `<li class="k-hid"><b class="k-l">${x[0]}</b><button type="button" class="k-rev" data-reveal="${i}">Say it out loud, then show</button></li>`;
        const m = recall.marks[i];
        return `<li class="k-shown"><b class="k-l">${x[0]}</b><span>${x[1]}<span class="k-rate">${m ? `<span class="pill ${m === "ok" ? "ok" : "warn"}">${m === "ok" ? "✓ Got it" : "Shaky"}</span>`
          : `<span class="muted">Did you have it?</span><button type="button" class="sm" data-kc="ok" data-ki="${i}">Got it</button><button type="button" class="sm" data-kc="shaky" data-ki="${i}">Shaky</button>`}</span></span></li>`;
      };
      const n = pts.filter(Array.isArray).length, got = pts.filter((x, i) => recall.marks[i] === "ok").length;
      h += box("know", "📘", (kp.why ? "What to know" : "Key points") + btn, `<ul${labelled ? ' class="k-list"' : ""}>${pts.map(li).join("")}</ul>` +
        (testing && marked === n ? `<p class="k-sum">${got} of ${n} got it.${got < n ? " The shaky ones are on your weak-spot map." : " Nice."}</p>` : ""), "c-key" + (testing ? " testing" : ""));
    }
    if (kp.trap) h += box("trap", "⚠️", "Exam trap", `<p>${kp.trap}</p>`, "c-trap");
  }
  return h;
}
// The two panels beside the card. l = "Look it up": the AWS pages and the terms. r = "On the exam": the exam topics
// with your accuracy and a practice round, how the exam words these topics, and your own notes.
function sideHTML(id) {
  const { it } = itemIndex[id], [, txt, note] = it, kp = KEYS[id], qs = QREF[id] || [];
  const docs = stepDocs(id), tags = stepTags(id);
  const terms = termsIn(strip(`${txt} ${note || ""} ${kp ? `${kp.why || ""} ${(kp.k || []).flat().join(" ")} ${kp.trap || ""}` : ""}`)).slice(0, 8);
  const cues = [];
  for (const t of tags) for (const c of CUES) if ((CUE_TAGS[c[0]] || []).includes(t) && !cues.includes(c) && cues.length < 4) cues.push(c);

  let l = "";
  if (docs.length) l += box("docs", "📄", "AWS docs", `<ul class="c-docs">${docs.map(([t, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a></li>`).join("")}</ul>`);
  if (terms.length) l += foldBox("terms", "📖", "terms", "Terms in this step", terms.length, `<dl class="c-terms">${terms.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`, true);

  let r = "";
  if (tags.length || qs.length) {
    const acc = tagStats();
    let b = "";
    if (tags.length) b += `<ul class="c-tags">${tags.map(t => {
      const a = acc[t];
      return `<li><span>${esc(t)}</span><span class="tr"><span class="fi${a && a[0] / a[1] < 0.7 ? " low" : ""}" style="width:${a ? pct(a[0], a[1]) : 0}%"></span></span><span class="wk-n">${a ? `${a[0]}/${a[1]}` : "new"}</span></li>`;
    }).join("")}</ul><p class="muted c-hint">Your quiz answers on each topic so far, right of all.</p>`;
    if (qs.length) {
      const seen = qs.filter(q => S.qs[q.id]), right = seen.filter(q => S.qs[q.id].last).length;
      const live = S.run && !S.run.done && S.run.kind === "step" && S.run.item === id;
      b += `<div class="c-prac"><span>${plural(qs.length, "quiz question")} ${qs.length === 1 ? "covers" : "cover"} this step.` +
        (seen.length ? ` You have answered ${seen.length}, ${right} right at the last try.` : "") + `</span>` +
        `<button type="button" data-step-quiz="${id}">${live ? "Resume practice" : `Try ${Math.min(QZ.STEP, qs.length)} now`}</button></div>`;
    }
    r += box("exam", "📊", "Exam topics", b);
  }
  if (cues.length) r += foldBox("cues", "🗣", "cues", "Exam wording on these topics", cues.length,
    `<ul class="cue-l">${cues.map(c => `<li><b>${esc(c[0])}</b><span>→ ${esc(c[1])}</span><span class="muted">${esc(c[2])}</span></li>`).join("")}</ul>`, true);
  r += `<label class="box b-notes c-notes"><span class="box-h"><span class="bi" aria-hidden="true">📝</span>My notes on this step <span class="saved" data-saved="${id}">saved</span></span>` +
    `<textarea data-inote="${id}" maxlength="${NOTE_MAX}" placeholder="What surprised you, what to look at again…">${esc(S.inotes[id] || "")}</textarea></label>`;
  return { l: l && `<div class="side-t">Look it up</div>${l}`, r: `<div class="side-t">On the exam</div>${r}` };
}
function quizCardHTML(d) {
  const r = S.quiz[d.id], tries = r ? r.tries.length : 0, ok = quizOk(d), live = liveQuiz(d);
  const open = dIds(d).filter(id => !done(id));
  let h = `<div class="c-h"><span class="tag t-quiz">Quiz</span><span class="c-meta">${QZ.DAILY} questions, ~${QUIZ_MIN} min</span>${ok ? `<span class="pill ok">✓ Passed</span>` : ""}</div>` +
    `<h2 class="c-t" tabindex="-1">End-of-day quiz</h2><p class="c-n">${QZ.describe(d)}. Pass at ${QZ.needed(QZ.DAILY)} of ${QZ.DAILY} to complete Day ${d.day}.</p>`;
  if (live) h += `<p class="c-st">In progress: question ${S.run.i + 1} of ${S.run.ids.length}.</p>`;
  else if (ok) h += `<p class="c-st ok">Passed with ${r.best} of ${QZ.DAILY} on ${fmtD(parseDate(r.passed))}.</p><div class="c-w"><button type="button" data-quiz-start="${d.id}">Practice again</button></div>`;
  else if (open.length) {
    h += `<p class="c-st">${plural(open.length, "step")} still open. The quiz unlocks when every step of the day is complete.</p>` +
      `<ul class="c-open">${open.map(id => `<li><button type="button" class="link" data-at="${id}">${esc(stepTitle(id))}</button></li>`).join("")}</ul>`;
  } else {
    h += (tries ? `<p class="c-st">Best so far ${r.best} of ${QZ.DAILY} after ${plural(tries, "try", "tries")}. A retake draws different questions.</p>` : "") +
      `<ul class="qz-facts"><li>After each answer you see why every option is right or wrong, and which step to go back to.</li>` +
      `<li>Questions you miss come back for review over the next days and land in your notebook.</li>` +
      `<li>You can close the quiz and resume it later; your answers are kept.</li></ul>`;
  }
  if (tries) h += `<p class="muted">Tries so far: ${r.tries.map(t => `${t.score} of ${t.n}`).join(", ")}.</p>`;
  return h;
}
function doneCardHTML(d) {
  const r = S.quiz[d.id], m = S.log[d.id] || 0, n = dIds(d).length;
  const nx = DAYS.find(x => x.day > d.day && !dayDone(x));
  const facts = [["Steps", `${n} of ${n}`]];
  if (r && r.passed) facts.push(["Quiz", `${r.best} of ${QZ.DAILY}, ${plural(r.tries.length, "try", "tries")}`]);
  if (m >= 1) facts.push(["Focus time", `${fmtH(m)} of ~${fmtH(dayPlanned(d))} planned`]);
  if (S.dayDone[d.id]) facts.push(["Finished", fmtD(parseDate(S.dayDone[d.id]))]);
  return `<div class="c-h"><span class="pill ok">✓ Day complete</span></div><h2 class="c-t" tabindex="-1">Day ${d.day} is done</h2><p class="c-n">${d.title}</p>` +
    `<dl class="c-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>` +
    (nx ? `<p class="c-st">Next: <b>Day ${nx.day}</b>, ${nx.title} (${fmtD(dayDate(nx.day))}).</p>`
      : DAYS.every(dayDone) ? `<p class="c-st">Every day is done. Take a mock exam from the overview, then go pass SAA-C03.</p>` : "");
}
function flip(id, open) {
  const panel = document.getElementById("ca-" + id), b = cardEl.querySelector(`[data-flip="${id}"]`);
  if (!panel || !b) return;
  panel.hidden = !open;
  b.setAttribute("aria-expanded", String(open));
}

// ---------- completing steps & celebrations ----------
// The ladder, small to large: a step, a block of the day, the last step (the quiz opens), the day, the week, everything.
const fxMark = { pop: "", wave: "" };   // the dot and the block to animate in the strip, for a moment
let fxMarkT = 0;
function markStrip(pop, wave) {
  fxMark.pop = pop; fxMark.wave = wave || "";
  clearTimeout(fxMarkT);
  fxMarkT = setTimeout(() => { fxMark.pop = fxMark.wave = ""; }, 900);
}
// A long step (a lab, a lecture chunk) earns a bigger burst than a two-minute setup click.
const longStep = g => (g.min || 0) / g.items.length >= 30;
// the short line above the buttons: how far the day is
function stepToast(d) {
  const ids = dIds(d), n = ids.filter(done).length, left = ids.length - n;
  const half = ids.length >= 4 && n === Math.ceil(ids.length / 2);
  FX.toast(half ? `<b>Halfway through Day ${d.day}</b> · ${plural(left, "step")} to go`
    : `<b>✓ ${n} of ${ids.length}</b> · ${left === 0 ? "every step done" : left === 1 ? "one more step" : `${left} steps to go`}`, half ? "half" : "");
}
function stepDone(d, g, el) {
  FX.step(el, { n: dIds(d).filter(done).length, big: longStep(g) });
  stepToast(d);
}
function blockDone(d, g, el) {
  const n = d.groups.filter(groupDone).length;
  stepToast(d);
  if (itemsDone(d) && hasQuiz(d)) {
    FX.quizOpen();
    FX.banner("All steps done 🔓", `The Day ${d.day} quiz is open: ${QZ.DAILY} questions, pass at ${QZ.needed(QZ.DAILY)}.`, "block");
  } else {
    FX.block(el);
    FX.banner(`${strip(g.label || TAGS[g.t])} ✅`, `Block ${n} of ${d.groups.length} done · about ${fmtH(dayLeft(d))} left today`, "block");
  }
}
function setTick(id, val, srcEl) {
  const { d, g } = itemIndex[id];
  const week = weekOf(d);
  const was = { g: groupDone(g), d: dayDone(d), w: week.every(dayDone), a: DAYS.every(dayDone) };
  if (val) S.ticks[id] = true; else delete S.ticks[id];
  markDayDone(d);
  save();
  if (val) {
    // effects start from the button that was pressed, so fire them before the card is redrawn
    const nowDay = dayDone(d);
    if (!was.a && DAYS.every(dayDone)) celebrate("all", d);
    else if (!was.w && week.every(dayDone)) celebrate("week", d);
    else if (!was.d && nowDay) celebrate("day", d);
    else if (!was.g && groupDone(g)) blockDone(d, g, srcEl);
    else stepDone(d, g, srcEl);
    markStrip(id, !was.g && groupDone(g) ? g.key : "");
    const builds = d.groups.filter(x => x.t === "build");
    if (g.t === "build" && !was.g && builds.every(groupDone)) setTimeout(() => whenFree(() => openCleanup(d.id)), nowDay ? 3400 : 1100);
  }
  showGains(val ? award() : [], 1200);
  refresh();
}
// Mark the step on screen complete and move on: to the next open step, then the quiz, then the day's summary.
function complete(id, srcEl) {
  FX.unlock();
  setTick(id, true, srcEl);
  const d = itemIndex[id].d;
  if (view.day !== d.id) return;
  const ids = dIds(d), i = ids.indexOf(id);
  move(ids.slice(i + 1).concat(ids.slice(0, i)).find(x => !done(x)) || (dayDone(d) ? "done" : hasQuiz(d) ? "quiz" : id));
}
function celebrate(kind, d) {
  const sk = streak();
  const skTxt = sk > 1 ? ` · 🔥 ${sk}-day streak` : "";
  if (kind === "all") { FX.all(); FX.banner(`All ${DAYS.length} days done 🚀`, "Go pass SAA-C03.", "all"); }
  else if (kind === "week") {
    const w = WEEK[d.id], next = WEEKS[w + 1];
    FX.week(); FX.banner(`Week ${w + 1} complete 🏆`, (next ? `Next: ${strip(next)}.` : "Only the exam left.") + skTxt, "week");
  }
  else { FX.day(); FX.banner(`Day ${d.day} complete 🎉`, `${DAYS.filter(dayDone).length}/${DAYS.length} days done${skTxt}`, "day"); }
  if ([3, 5, 7, 10, 14, 21].includes(sk)) setTimeout(() => FX.badge("🔥", `${sk} days in a row`, "A study streak", sk >= 10 ? "epic" : "gold"), 3400);
}

// ---------- XP, levels and badges ----------
// XP is worked out from what the state already holds, so syncing and merging need no rules of their own:
// right answers that teach something (qs[].xp, see learn()), completed steps, day quizzes passed, plus each badge earned.
const XP = { right: 10, step: 5, pass: 100 };
// Badges are earned once and kept with the date (S.ach). Most are read from the state, so progress made
// before badges existed earns them too (quietly, at boot); the streak ones (`row`) only while answering.
const ACH = [
  { id: "first", i: "🎯", t: "First one right", d: "Answer a quiz question right.", xp: 20, ok: c => c.right >= 1 },
  { id: "row5", i: "🔥", t: "On a roll", d: "5 right answers in a row.", xp: 50, row: 5 },
  { id: "row10", i: "🔥", t: "On fire", d: "10 right answers in a row.", xp: 100, row: 10 },
  { id: "row20", i: "🌟", t: "Legendary", d: "20 right answers in a row.", xp: 200, row: 20 },
  { id: "row30", i: "👑", t: "Flawless", d: "30 right answers in a row: a whole day quiz.", xp: 300, row: 30 },
  { id: "pass1", i: "✅", t: "First quiz passed", d: "Pass an end-of-day quiz.", xp: 50, ok: c => c.passed >= 1 },
  { id: "perfect", i: "💯", t: "Perfect score", d: "Every answer of a day quiz right.", xp: 200, ok: c => c.perfect },
  { id: "comeback", i: "🔁", t: "Comeback", d: "Pass a day quiz you failed before.", xp: 100, ok: c => c.comeback },
  { id: "right100", i: "🧠", t: "A hundred right", d: "100 right answers that earned XP.", xp: 100, ok: c => c.right >= 100 },
  { id: "right500", i: "🧠", t: "Five hundred right", d: "500 right answers that earned XP.", xp: 250, ok: c => c.right >= 500 },
  { id: "fix10", i: "🛠", t: "Mistake fixer", d: "Answer 10 notebook questions right after missing them.", xp: 100, ok: c => c.fixed >= 10 },
  { id: "warm5", i: "☕", t: "Early bird", d: "Do the morning warm-up on 5 days.", xp: 75, ok: c => c.warm >= 5 },
  { id: "drill15", i: "⚡", t: "Quick draw", d: "15 or more in the 60-second drill.", xp: 100, ok: c => c.drill >= 15 },
  { id: "focus10", i: "⏱", t: "Deep work", d: "10 hours of focus time logged.", xp: 150, ok: c => c.focus >= 600 },
  { id: "mock80", i: "🎓", t: "Exam ready", d: "80% or more on a mock exam.", xp: 300, ok: c => c.mock >= 80 }
];
const ACH_BY = Object.assign(Object.create(null), Object.fromEntries(ACH.map(a => [a.id, a])));
// A title for every two levels; the plan's XP adds up to about level 20 by exam day.
const RANKS = ["Cloud curious", "Console clicker", "IAM apprentice", "Subnet scout", "VPC builder", "Load balancer", "Auto scaler", "Multi-AZ", "Well-Architected", "Solutions architect"];
const rankOf = n => RANKS[Math.min(RANKS.length - 1, Math.floor((n - 1) / 2))];
const lvAt = n => 40 * n * (n - 1);   // XP that reaches level n: 80 for level 2, 240 for 3, 3,600 for 10
function xpTotal() {
  let x = 0;
  for (const id in S.qs) x += XP.right * S.qs[id].xp;
  x += XP.step * Object.keys(S.ticks).filter(id => itemIndex[id]).length;
  x += XP.pass * DAYS.filter(d => S.quiz[d.id] && S.quiz[d.id].passed).length;
  for (const id in S.ach) if (ACH_BY[id]) x += ACH_BY[id].xp;
  return x;
}
function levelOf(x) {
  x = Number.isFinite(x) && x > 0 ? Math.min(x, 1e12) : 0;
  let n = Math.max(1, Math.floor((1 + Math.sqrt(1 + x / 10)) / 2));
  while (lvAt(n + 1) <= x) n++;
  while (n > 1 && lvAt(n) > x) n--;
  return { n, x, from: lvAt(n), to: lvAt(n + 1), pct: (x - lvAt(n)) / (lvAt(n + 1) - lvAt(n)) * 100 };
}
function achCtx() {
  let right = 0;
  for (const id in S.qs) right += S.qs[id].xp;
  const qz = DAYS.map(d => S.quiz[d.id]).filter(Boolean);
  return {
    right,
    passed: qz.filter(q => q.passed).length,
    perfect: qz.some(q => q.tries.some(t => t.n && t.score === t.n)),
    comeback: qz.some(q => q.tries.findIndex(t => QZ.passed(t.score, t.n)) > 0),   // a try below the bar came before the first pass
    fixed: Object.values(S.book).filter(b => b.fixed).length,
    warm: Object.values(S.warm).filter(v => v === "done").length,
    drill: S.drill.best,
    focus: Object.values(S.log).reduce((a, b) => a + b, 0),
    mock: S.mocks.reduce((a, m) => Math.max(a, m.pct), 0)
  };
}
// Earn every badge whose condition holds now. row = right answers in a row in the quiz on screen.
// Returns the new ones; the caller shows them (a streak badge names the badge it earned itself).
// persist = false at boot: saving before the first sync would make this copy look newer than the server's.
function award(row = 0, persist = true) {
  const c = achCtx(), got = [];
  for (const a of ACH) if (!S.ach[a.id] && (a.row ? row >= a.row : a.ok(c))) { S.ach[a.id] = today(); got.push(a); }
  if (got.length && persist) save();
  return got;
}
let lvShown = 0;   // the highest level on screen so far; only a level above it gets announced
const syncLevel = () => { lvShown = Math.max(lvShown, levelOf(xpTotal()).n); };
// New badges, then a new level, each as a badge at the top of the screen.
function showGains(got, delay = 0) {
  got.forEach((a, k) => setTimeout(() => { FX.sound("unlock"); FX.badge(a.i, a.t, `New badge, +${a.xp} XP`, "gold"); }, delay + k * 650));
  const n = levelOf(xpTotal()).n, was = lvShown;
  if (was && n > was) setTimeout(() => { FX.sound("level"); FX.badge("⭐", `Level ${n}`, rankOf(n) !== rankOf(was) ? `New title: ${rankOf(n)}` : rankOf(n), "level"); }, delay + got.length * 650);
  lvShown = Math.max(lvShown, n);
}

// ---------- scores ----------
function num(k) { const v = S.scores[k]; return v === "" || v == null || isNaN(+v) ? null : +v; }
function verdictHTML() {
  const pe = num("pe");
  const weak = weakestDomain();
  const weakTxt = weak ? ` Focus on <b>Domain ${weak.i + 1} (${weak.name})</b>.` : "";
  const peStep = itemIndex[Object.keys(SCORE_AT).find(k => SCORE_AT[k] === "pe")];
  if (pe == null) return ["", `Enter your <b>Official Practice Exam</b> score${peStep ? ` (Day ${peStep.d.day})` : ""} in 📊 Scores to get the go/no-go decision.`];
  if (pe < 100 || pe > 1000) return ["", "Practice exam score must be between 100 and 1000."];
  if (pe >= 750) return ["go", `<b>GO</b> — ${pe}/1000. Book the exam for Day ${LAST} (${fmtD(dayDate(LAST))}).`];
  if (pe >= 720) return ["mid", `<b>BORDERLINE</b> — ${pe}/1000 passes, but with no margin. Add 3–4 days, then book.${weakTxt}`];
  return ["no", `<b>NOT YET</b> — ${pe}/1000 (pass is 720). Add a week before booking.${weakTxt}`];
}
function weakestDomain() {
  let w = null;
  for (let i = 0; i < 4; i++) {
    const v = num("b" + (i + 1));
    if (v != null && (!w || v < w.v)) w = { i, v, name: DOMAINS[i] };
  }
  return w;
}
const bar = (label, value, text, cls = "") => `<div class="db ${cls}"><span>${label}</span><span class="tr"><span class="fi" style="width:${Math.max(0, Math.min(100, value))}%;display:block"></span></span><span>${text}</span></div>`;
function renderScores() {
  const [cls, html] = verdictHTML();
  document.querySelectorAll("[data-verdict]").forEach(el => { el.className = "verdict " + cls; el.innerHTML = html; });
  const weak = weakestDomain();
  const bars = [];
  for (let i = 0; i < 4; i++) {
    const v = num("b" + (i + 1));
    if (v == null) continue;
    bars.push(bar(`D${i + 1} ${DOMAINS[i]}`, v, `${v}%`, weak && weak.i === i ? "weak" : ""));
  }
  document.getElementById("dom-bars").innerHTML = bars.join("");
  const logged = DAYS.filter(d => (S.log[d.id] || 0) >= 1);
  document.getElementById("time-log").innerHTML = logged.length
    ? `<h3 class="sub-h">Study time</h3><p class="muted">Logged by the focus timer against the day you were working on.</p>` +
      logged.map(d => bar(`Day ${d.day}`, pct(S.log[d.id], dayPlanned(d)), `${fmtH(S.log[d.id])} of ~${fmtH(dayPlanned(d))}`, "tl")).join("")
    : "";
  const sum = [];
  const q7 = num("qs7"), q13 = num("qs13"), pe = num("pe");
  if (q7 != null) sum.push(`QS ${Math.round(q7 / 20 * 100)}%`);
  if (q13 != null) sum.push(`retake ${Math.round(q13 / 20 * 100)}%`);
  if (pe != null) sum.push(`practice exam ${pe}`);
  document.getElementById("score-sum").textContent = sum.length ? "· " + sum.join(" · ") : "";
}
// A score can be typed in the 📊 Scores panel or on the card of the step that asks for it: keep both in step.
document.addEventListener("input", e => {
  const k = e.target.dataset && e.target.dataset.score;
  if (!k) return;
  S.scores[k] = e.target.value;
  document.querySelectorAll(`[data-score="${k}"]`).forEach(inp => { if (inp !== e.target) inp.value = e.target.value; });
  save(); renderScores();
});

// ---------- practice panel ----------
function renderPractice() {
  const t = today();
  const due = QZ.dueIds(S.srs, t).filter(id => QBY[id]).length;
  const book = Object.keys(S.book).filter(id => QBY[id]);
  const open = book.filter(id => !S.book[id].fixed).length;
  const weak = QZ.weakTags(BANK, S.qs)[0];
  const last = S.mocks[S.mocks.length - 1];
  const left = mockDays.filter(d => !dayDone(d)).length;
  const liveMock = S.run && S.run.kind === "mock" && !S.run.done;
  const cards = [
    ["🔁 Review", due ? `${plural(due, "missed question")} due today.` : `Nothing due. Questions you miss come back after ${QZ.SRS_DAYS.join(", ").replace(/, (\d+)$/, " and $1")} days until you get them right three times.`,
      `<button type="button" data-review${due ? ' class="primary"' : " disabled"}>Start review</button>`],
    ["🧪 Mock exam", mockOpen() || liveMock
      ? `${QZ.MOCK.n} questions in ${QZ.MOCK.minutes} minutes, results at the end like the real exam. Each attempt draws different questions.${last ? ` Last: ${last.pct}% on ${fmtD(parseDate(last.at))}.` : ""}`
      : `Unlocks when Days 1–${MOCK_AFTER} are complete (${left} to go): the lectures and labs.`,
      `<button type="button" data-mock${mockOpen() || liveMock ? ' class="primary"' : " disabled"}>${liveMock ? `Resume (${clock(S.run.end - Date.now())} left)` : "Start mock exam"}</button>`],
    ["⚡ Which service?", `60 seconds of quick picks: a requirement, four services, choose one.${S.drill.best ? ` Your best: ${S.drill.best}.` : ""}`,
      `<button type="button" data-drill${DRILL.length ? "" : " disabled"}>Start drill</button>`],
    ["📓 Wrong-answer notebook", book.length ? `${open} open, ${book.length - open} fixed.` : "Every question you miss lands here with your one-line note.",
      `<button type="button" data-sheet="notebook">Open notebook</button>`],
    ["📈 Weak spots", weak ? `Weakest topic so far: ${esc(weak.tag)} (${pct(weak.right, weak.seen)}% right).` : "Fills in as you answer questions.",
      `<button type="button" data-sheet="weak">Show weak spots</button>`],
    ["🗣 Exam wording", "What phrases like “least operational overhead” usually point to.",
      `<button type="button" data-sheet="cues"${CUES.length ? "" : " disabled"}>Open cheat sheet</button>`],
    ["🏅 Badges and level", (L => `Level ${L.n}, ${rankOf(L.n)}: ${L.to - L.x} XP to level ${L.n + 1}. ${Object.keys(S.ach).filter(id => ACH_BY[id]).length} of ${ACH.length} badges earned.`)(levelOf(xpTotal())),
      `<button type="button" data-sheet="badges">Show badges</button>`]
  ];
  document.getElementById("pr-grid").innerHTML = cards.map(([h, p, b]) => `<div class="place pr"><h3>${h}</h3><p>${p}</p>${b}</div>`).join("");
  const sum = [];
  if (due) sum.push(`${due} due for review`);
  if (liveMock) sum.push("mock exam in progress");
  else if (mockOpen()) sum.push("mock exam unlocked");
  document.getElementById("pr-sum").textContent = sum.join(", ");
}

// ---------- quizzes: shared ----------
const qzDlg = document.getElementById("quiz"), qzBody = document.getElementById("qz-body");
// The card's height lets the study panel beside it line up with its top edge (style.css, .qz-side).
new ResizeObserver(() => qzDlg.style.setProperty("--qzdh", qzDlg.offsetHeight + "px")).observe(qzDlg);
let picks = {};      // question id → options picked, not yet checked (memory only; kept while you move between questions)
let fresh = false;   // the answer on screen was checked just now: animate it (going back to it later does not); "xp" when it earned XP
let comboFx = "";    // "up" when the run of right answers just grew, "broke" when a miss ended one
// Right answers in a row (run.row) get a badge at these marks; the tier sets its look.
const ROW_TIERS = [[30, "👑", "Flawless", "epic"], [25, "💎", "Untouchable", "epic"], [20, "🌟", "Legendary", "epic"], [15, "⚡", "Unstoppable", "gold"], [10, "🔥", "On fire", "gold"], [5, "🔥", "On a roll", "silver"], [3, "🔥", "Warming up", "bronze"]];
const ROW_MARKS = ROW_TIERS.map(x => x[0]);
let intro = null;    // { title, html, go, goLabel } shown before a quiz or mock starts
let drill = null;    // "Which service?" round, kept in memory only

const runTitle = r => r.kind === "day" ? `Day ${dayOf(r.day).day} quiz` : r.kind === "mock" ? "Mock exam" : r.kind === "warm" ? "Warm-up" : r.kind === "step" ? "Step practice" : "Review";
function head(title, parts, barPct) {
  document.getElementById("qz-title").textContent = title;
  document.getElementById("qz-meta").innerHTML = parts.filter(Boolean).map(p => `<span>${p}</span>`).join("");
  document.getElementById("qz-bar").style.width = Math.max(0, Math.min(100, barPct || 0)) + "%";
}
// Put keyboard focus on the main action, not the ✕ that showModal() picks by default.
function focusMain() {
  for (const sel of ['[data-qz="go"]', '[data-qz="next"]', '[data-qz="retake"]', '[data-qz="finish"]', ".qz-o", "[data-drill]"]) {
    const el = qzBody.querySelector(sel);
    if (el) { el.focus({ preventScroll: true }); return; }
  }
}
function openQuiz() {
  renderQuiz();
  if (!qzDlg.open) qzDlg.showModal();
  qzDlg.scrollTop = 0;
  focusMain();
}
// Questions can be retired from the bank: drop them from a saved run without skipping the current one.
function pruneRun(r) {
  if (r.ids.every(id => QBY[id])) return;
  r.i = r.ids.slice(0, r.i).filter(id => QBY[id]).length;
  r.ids = r.ids.filter(id => QBY[id]);
  for (const k of Object.keys(r.ans)) if (!QBY[k]) delete r.ans[k];
  if (r.done && r.kind !== "mock") r.score = r.ids.filter(id => QZ.isRight(QBY[id], r.ans[id])).length;
}
function renderQuiz() {
  if (intro) return renderIntro();
  if (drill) return renderDrill();
  const r = S.run;
  if (!r) { if (qzDlg.open) qzDlg.close(); return; }
  pruneRun(r);
  if (!r.ids.length) { S.run = null; save(); if (qzDlg.open) qzDlg.close(); return; }
  if (r.i >= r.ids.length) r.i = r.ids.length - 1;
  if (r.done) return r.kind === "mock" ? renderMockResult() : renderResult();
  if (r.kind === "mock") return r.view === "grid" ? renderGrid() : renderMockQ();
  renderQ();
}
// of = the day id for a day quiz, the step id for step practice
function startRun(kind, of) {
  intro = null;
  if (drill) stopDrill();
  if (S.run && !S.run.done) {
    const same = S.run.kind === kind && (kind !== "day" || S.run.day === of) && (kind !== "step" || S.run.item === of);
    if (same || !confirm(`You have an unfinished ${runTitle(S.run).toLowerCase()}. Drop it and start this instead?`)) return openQuiz();
  }
  const t = today();
  const qs = kind === "day" ? QZ.pickDay(dayOf(of), TP, BANK, S.qs)
    : kind === "mock" ? QZ.pickMock(BANK, S.qs)
    : kind === "warm" ? QZ.pickWarmup(BANK, S.qs, S.srs, t, 5)
    : kind === "step" ? QZ.pickStep(of, STEP_TAGS[of], BANK, S.qs)
    : QZ.pickReview(BANK, S.srs, t, 15);
  if (!qs.length) { if (qzDlg.open) qzDlg.close(); FX.banner("No questions available yet", "", "info"); return; }
  const ord = {};
  qs.forEach(q => { ord[q.id] = QZ.order(q); });
  const now = Date.now();
  S.run = { kind, day: kind === "day" ? of : "", item: kind === "step" ? of : "", ids: qs.map(q => q.id), ord, ans: {}, flag: {}, i: 0, t0: now, end: kind === "mock" ? now + QZ.MOCK.minutes * 60000 : 0, done: false, view: "",
    row: 0, rowMax: 0, best0: S.rowBest, xp0: xpTotal(), rec: false };
  picks = {};
  save(); refresh(); openQuiz();
}
function promptMock() {
  if (S.run && S.run.kind === "mock" && !S.run.done) return openQuiz();
  intro = {
    title: "Mock exam", goLabel: `Start the ${QZ.MOCK.minutes}-minute exam`, go: () => startRun("mock"),
    html: `<p class="qz-lead">A full SAA-C03 practice run, original questions in the exam's style.</p><ul class="qz-facts">` +
      `<li>${QZ.MOCK.n} questions in ${QZ.MOCK.minutes} minutes, split by domain like the exam guide (30 / 26 / 24 / 20 %).</li>` +
      `<li>No feedback until you finish, like the real exam. Flag questions and come back to them.</li>` +
      `<li>The clock keeps running if you close this window; it submits itself when time is up.</li>` +
      `<li>Afterwards: your score by domain and every question with explanations. Each attempt draws different questions.</li></ul>`
  };
  openQuiz();
}
function renderIntro() {
  head(intro.title, [], 0);
  qzBody.innerHTML = intro.html + `<div class="qz-a"><button type="button" data-qz="close">Later</button><button type="button" class="primary" data-qz="go">${intro.goLabel}</button></div>`;
}

// what each option says, which ones were right, which one you picked, and why
function fbHTML(q, ord, ans, anim = false) {
  return `<ol class="qz-fb${anim ? " fresh" : ""}">${ord.map((oi, k) => {
    const right = q.a.includes(oi), mine = ans.includes(oi);
    return `<li class="${right ? "right" : mine ? "wrong" : ""}"><span class="qz-l">${LETTERS[k]}</span><div><div class="qz-t">${q.o[oi]}${mine ? ' <span class="mine">your answer</span>' : ""}</div><div class="qz-why">${right ? "✓ " : mine ? "✗ " : ""}${q.x[oi]}</div></div></li>`;
  }).join("")}</ol>`;
}
// Show where to watch or read first (Skill Builder), then hands-on, then self-checks; within a kind, in the plan's order.
const REF_ORDER = { watch: 0, prep: 0, play: 1, build: 2, check: 3, setup: 4 };
const byKind = ids => [...new Set(ids)].filter(id => itemIndex[id]).sort((a, b) => REF_ORDER[itemIndex[a].g.t] - REF_ORDER[itemIndex[b].g.t] || ORDER[a] - ORDER[b]);
// Where to study a topic, and a question: the steps the question names, then the steps that teach its main topic. Three at most.
const tagRefs = t => byKind(TAG_STEPS[t] || []).slice(0, 3);
const studyRefs = q => byKind([...q.ref, ...(TAG_STEPS[q.tags[0]] || []), ...(TAG_STEPS[q.tags[0]] ? [] : q.tags.flatMap(t => TAG_STEPS[t] || []))]).slice(0, 3);
function refHTML(id, extra = "") {
  const { d, g, it } = itemIndex[id];
  const url = linkFor(g.link);
  return `<li><div class="ref-h">${extra}<span class="tag t-${g.t}">${g.label || TAGS[g.t]}</span><span class="muted">Day ${d.day}</span></div><div class="ref-t">${it[1]}</div>` +
    (g.where ? `<div class="where">${g.where}</div>` : "") +
    `<div class="ref-a">${url ? `<a class="btn sm" href="${esc(url)}" target="_blank" rel="noopener">Open ↗</a>` : ""}<button type="button" class="sm" data-jump="${id}">Open step</button></div></li>`;
}
// side: the feedback on the question just answered; wide screens show it beside the quiz card (style.css, .qz-side).
function studyHTML(q, side = false) {
  const refs = studyRefs(q);
  const doc = q.doc && DOCS[q.doc];
  if (!refs.length && !doc) return "";
  return `<div class="qz-study${side ? " qz-side" : ""}"><div class="qz-sh">Where to study this</div><ul class="qz-refs">${refs.map(id => refHTML(id)).join("")}</ul>` +
    (doc ? `<div class="qz-doc">AWS page: <a href="${doc[1]}" target="_blank" rel="noopener">${doc[0]} ↗</a></div>` : "") + `</div>`;
}
const answerHTML = q => `<ul class="qz-ans">${q.a.map(i => `<li><b>✓ ${q.o[i]}</b><div class="qz-why">${q.x[i]}</div></li>`).join("")}</ul>`;
const noteHTML = q => `<label class="qz-note">Why did you miss it? One line for your notebook.<input type="text" maxlength="300" data-note="${q.id}" value="${esc((S.book[q.id] || {}).note || "")}" placeholder="e.g. mixed up gateway and interface endpoints"></label>`;
const optsHTML = (q, ord, on) => `<div class="qz-opts">${ord.map((oi, k) => `<button type="button" class="qz-o${on.includes(oi) ? " on" : ""}" data-o="${oi}" aria-pressed="${on.includes(oi)}"><span class="qz-l">${LETTERS[k]}</span><span class="qz-t">${q.o[oi]}</span></button>`).join("")}</div>`;

// Record an answer everywhere it matters: stats, spaced repetition, notebook.
// Returns whether the answer earned XP: a right answer the first time, right after a miss, or right when it was
// due for review. Answering the same question right again and again (step practice, retakes) earns nothing more.
function learn(q, ok) {
  const t = today(), s = S.qs[q.id], due = !!(S.srs[q.id] && S.srs[q.id].due <= t);
  const earns = ok && (!s || !s.right || !s.last || due);
  QZ.record(S.qs, q.id, ok, t);
  const e = S.qs[q.id];
  e.xp = Math.min(e.right, (e.xp || 0) + (earns ? 1 : 0));
  if (ok) {
    QZ.srsHit(S.srs, q.id, t);
    if (S.book[q.id]) S.book[q.id].fixed = true;
  } else {
    QZ.srsMiss(S.srs, q.id, t);
    const b = S.book[q.id] || (S.book[q.id] = { at: t, misses: 0, note: "", fixed: false });
    b.misses++; b.at = t; b.fixed = false;
  }
  return earns;
}

// ---------- quizzes: day, review, warm-up (feedback after every answer) ----------
// The run of right answers in the quiz's header: it heats up as it grows and breaks on a miss.
function comboHTML(r) {
  if (comboFx === "broke") return `<span class="qz-combo broke">💔 Streak lost</span>`;
  if (r.row < 2) return "";
  return `<span class="qz-combo h${r.row >= 10 ? 3 : r.row >= 5 ? 2 : 1}${comboFx === "up" ? " up" : ""}" title="Right answers in a row">🔥 ${r.row} in a row</span>`;
}
// One square per question: right, wrong, not answered yet. Click one to go there.
function mapHTML(r) {
  if (r.ids.length < 2) return "";
  return `<div class="qz-map">${r.ids.map((k, i) => {
    const a = r.ans[k], st = !a ? "" : QZ.isRight(QBY[k], a) ? "ok" : "bad";
    return `<button type="button" tabindex="-1" data-go="${i}" class="${st}${i === r.i ? " cur" : ""}" aria-label="Question ${i + 1}${st === "ok" ? ", right" : st ? ", wrong" : ""}"></button>`;
  }).join("")}</div>`;
}
// The next question not answered yet after the one on screen, wrapping round; -1 when every one is answered.
function nextOpen(r) {
  for (let k = 1; k <= r.ids.length; k++) { const j = (r.i + k) % r.ids.length; if (!r.ans[r.ids[j]]) return j; }
  return -1;
}
function renderQ() {
  const r = S.run, id = r.ids[r.i], q = QBY[id], ord = r.ord[id] || QZ.order(q), ans = r.ans[id], n = r.ids.length, sel = picks[id] || [];
  r.ord[id] = ord;
  const answered = Object.keys(r.ans).filter(k => QBY[k]);
  const right = answered.filter(k => QZ.isRight(QBY[k], r.ans[k])).length;
  head(runTitle(r), [`Question ${r.i + 1} of ${n}`, `<span class="ok">✓ ${right}</span>`, `<span class="bad">✗ ${answered.length - right}</span>`, comboHTML(r)], answered.length / n * 100);
  // Previous and Next move one question either way and never answer; the main button checks, then goes on to the next open question.
  const prev = n > 1 ? `<button type="button" data-qz="prev"${r.i ? "" : " disabled"}>← Previous</button>` : "";
  const skip = r.i + 1 < n ? `<button type="button" data-qz="skip">Next →</button>` : "";
  if (!ans) {
    const multi = q.a.length > 1;
    qzBody.innerHTML = mapHTML(r) + `<div class="qz-q">${q.q}</div>${optsHTML(q, ord, sel)}` +
      `<p class="qz-hint muted">${multi ? "Pick two, then check." : "Pick one, then check."} Keys A–${LETTERS[ord.length - 1]} and Enter work too, ← and → move between questions.</p>` +
      `<div class="qz-a qz-nav">${prev}${skip}<button type="button" class="primary" data-qz="check"${sel.length === q.a.length ? "" : " disabled"}>Check answer</button></div>`;
  } else {
    const ok = QZ.isRight(q, ans), to = nextOpen(r);
    const keyL = ord.map((oi, k) => q.a.includes(oi) ? LETTERS[k] : "").filter(Boolean).join(" and ");
    const main = to < 0 ? "See results" : to === r.i + 1 ? "Next question →" : `Continue at question ${to + 1} →`;
    qzBody.innerHTML = mapHTML(r) + `<div class="qz-q">${q.q}</div>` +
      `<div class="qz-verdict ${ok ? "ok" : "bad"}${fresh ? " fresh" : ""}" role="status">${ok ? "✓ Correct." : `✗ Not quite. The answer is ${keyL}.`}${fresh === "xp" ? `<span class="xp-up">+${XP.right} XP</span>` : ""}</div>` +
      fbHTML(q, ord, ans, fresh) + studyHTML(q, true) + (ok ? "" : noteHTML(q)) +
      `<div class="qz-a qz-nav">${prev}${to === r.i + 1 ? "" : skip}<button type="button" class="primary" data-qz="next">${main}</button></div>`;
  }
  fresh = false; comboFx = "";
}
// Go to question i of the run (Previous, Next, the squares, Continue). Answers stay as they are.
function goQ(i) {
  const r = S.run;
  if (!r || r.done || r.kind === "mock" || drill || intro || i < 0 || i >= r.ids.length || i === r.i) return;
  r.i = i;
  save(); renderQ(); qzDlg.scrollTop = 0;
  refocus(r.ans[r.ids[i]] ? '[data-qz="next"]' : ".qz-o");
}
// After Previous, Next or Flag in the mock: the same control again, or the main one where it is gone (the last question).
const mockFocus = a => (qzBody.querySelector(`[data-qz="${a}"]`) || qzBody.querySelector(".mk-a .primary") || qzBody).focus({ preventScroll: true });
// Re-rendering replaces the buttons; put focus back somewhere sensible inside the dialog.
function refocus(sel) {
  const el = qzBody.querySelector(sel);
  if (el) el.focus({ preventScroll: true });
}
function pick(oi) {
  const r = S.run;
  if (!r || r.done) return;
  const id = r.ids[r.i], q = QBY[id];
  if (r.kind === "mock") {
    const cur = r.ans[id] || [];
    let next;
    if (q.a.length === 1) next = [oi];
    else if (cur.includes(oi)) next = cur.filter(x => x !== oi);
    else if (cur.length < q.a.length) next = cur.concat(oi);
    else return;
    if (next.length) r.ans[id] = next; else delete r.ans[id];
    save(); renderMockQ(); refocus(`[data-o="${oi}"]`);
    return;
  }
  if (r.ans[id]) return;
  let sel = picks[id] || [];
  if (q.a.length === 1) sel = [oi];
  else if (sel.includes(oi)) sel = sel.filter(x => x !== oi);
  else if (sel.length < q.a.length) sel = sel.concat(oi);
  picks[id] = sel;
  renderQ();
  refocus(sel.length === q.a.length ? '[data-qz="check"]' : `[data-o="${oi}"]`);
}
function check() {
  const r = S.run, id = r.ids[r.i], q = QBY[id];
  const sel = picks[id] || [];
  if (r.ans[id] || sel.length !== q.a.length) return;
  r.ans[id] = sel.slice();
  delete picks[id];
  const ok = QZ.isRight(q, r.ans[id]);
  const earned = learn(q, ok);
  const was = r.row, best = r.best0;
  r.row = ok ? r.row + 1 : 0;
  r.rowMax = Math.max(r.rowMax, r.row);
  S.rowBest = Math.max(S.rowBest, r.row);
  const record = ok && r.row > best && best >= 3 && !r.rec;   // past your longest run from before this quiz, said once a quiz
  const got = award(r.row);
  fresh = earned ? "xp" : true;
  comboFx = ok ? (r.row >= 2 ? "up" : "") : was >= 2 ? "broke" : "";
  save(); renderQ();
  refocus('[data-qz="next"]');
  const verdict = qzBody.querySelector(".qz-verdict");
  verdict.scrollIntoView({ block: "nearest" });
  let rest = got;
  if (!ok) FX.sound("miss");
  else if (ROW_MARKS.includes(r.row)) {
    // the streak's badge drops in at the top; when it also earns a badge, it says so instead of a second one
    const [, icon, name, tier] = ROW_TIERS.find(x => x[0] === r.row), a = got.find(x => x.row === r.row);
    rest = got.filter(x => x !== a);
    FX.combo(r.row, verdict);
    FX.badge(icon, `${r.row} in a row`, a ? `New badge: ${a.t}, +${a.xp} XP` : name, tier);
  }
  else { FX.sound("pop"); FX.sparkle(verdict); }
  if (record) { r.rec = true; save(); const n = r.row; setTimeout(() => FX.badge("🏅", "New record", `${n} in a row beats your best of ${best}`, "gold"), 450); }
  showGains(rest, 700);
}
function nextQ() {
  const r = S.run;
  if (!r.ans[r.ids[r.i]]) return;
  const to = nextOpen(r);
  if (to < 0) finishRun(); else goQ(to);
}
function finishRun() {
  const r = S.run, t = today();
  r.score = r.ids.filter(id => QZ.isRight(QBY[id], r.ans[id])).length;
  r.done = true;
  if (r.kind === "day") {
    const d = dayOf(r.day);
    const was = { d: dayDone(d), w: weekOf(d).every(dayDone), a: DAYS.every(dayDone), m: mockOpen() };
    const rec = S.quiz[d.id] || (S.quiz[d.id] = { best: 0, passed: "", tries: [] });
    rec.tries.push({ at: t, score: r.score, n: r.ids.length });
    rec.best = Math.max(rec.best, r.score);
    if (QZ.passed(r.score, r.ids.length) && !rec.passed) rec.passed = t;
    markDayDone(d);
    r.cel = !was.a && DAYS.every(dayDone) ? "all" : !was.w && weekOf(d).every(dayDone) ? "week" : !was.d && dayDone(d) ? "day" : "";
    r.mockNew = !was.m && mockOpen();
  }
  if (r.kind === "warm") S.warm[t] = "done";
  let got = award();
  r.xp1 = xpTotal(); r.gif = pickGif(outcome(r));
  save(); refresh(); renderQuiz();
  // the results are on screen: celebrate there (the day's own celebration follows when they are closed)
  const n = r.ids.length, clean = r.score === n;
  if (r.kind === "day") {
    if (!QZ.passed(r.score, n)) FX.sound("miss");
    else if (clean) {
      const a = got.find(x => x.id === "perfect");
      got = got.filter(x => x !== a);
      FX.perfect(); FX.badge("💯", "Perfect score", a ? `New badge, +${a.xp} XP` : `All ${n} right`, "epic");
    }
    else FX.pass();
  } else if (clean) { FX.sound("chime"); FX.sparkle(qzBody.querySelector(".qz-score")); }
  showGains(got, 900);
  qzDlg.scrollTop = 0;
  focusMain();
}
function missedHTML(missed) {
  if (!missed.length) return "";
  // Group by where to study, so six misses on one module read as one place to go back to.
  const refs = {};
  missed.forEach(q => { const id = studyRefs(q)[0]; if (id) refs[id] = (refs[id] || 0) + 1; });
  const order = Object.keys(refs).sort((a, b) => refs[b] - refs[a]);
  return `<h3 class="sub-h">Go back to</h3><ul class="qz-refs">${order.map(id => refHTML(id, `<span class="pill warn">${plural(refs[id], "miss", "misses")}</span>`)).join("")}</ul>` +
    `<h3 class="sub-h">Questions you missed</h3><ol class="qz-missed">${missed.map(q => `<li><details><summary>${q.q}</summary>${answerHTML(q)}</details></li>`).join("")}</ol>`;
}
// How a finished quiz went: "ace" (every answer right), "pass" or "fail". The bar is the pass mark on a day quiz,
// 72% on a mock exam (where its results call it close to the line), 60% on a review, warm-up or step practice.
function outcome(r) {
  const [sc, n] = r.kind === "mock" ? [r.res.score, r.res.n] : [r.score, r.ids.length];
  if (n && sc === n) return "ace";
  return (r.kind === "day" ? QZ.passed(sc, n) : sc / n >= (r.kind === "mock" ? 0.72 : 0.6)) ? "pass" : "fail";
}
// Stars, the level with the XP this quiz earned, and the longest run of right answers.
function rewardHTML(r) {
  const o = outcome(r), [sc, n] = r.kind === "mock" ? [r.res.score, r.res.n] : [r.score, r.ids.length];
  const stars = o === "ace" ? 3 : o === "fail" ? 0 : sc / n >= (r.kind === "day" ? 0.95 : 0.8) ? 2 : 1;
  const L = levelOf(r.xp1 >= 0 ? r.xp1 : xpTotal()), gain = r.xp0 >= 0 ? L.x - r.xp0 : 0;
  const from = r.xp0 >= L.from ? (r.xp0 - L.from) / (L.to - L.from) * 100 : 0;   // a level gained: the bar fills from empty
  const row = r.rowMax >= 2 ? `Longest run of right answers: ${r.rowMax}${r.rowMax < 3 ? "" : r.rowMax > r.best0 ? ", your best yet" : r.rowMax === r.best0 ? ", equal to your best" : ""}. ` : "";
  return `<div class="qz-rw"><div class="stars" role="img" aria-label="${stars} of 3 stars">${[0, 1, 2].map(k => `<span class="${k < stars ? "on" : ""}" style="animation-delay:${0.2 + k * 0.25}s">★</span>`).join("")}</div>` +
    `<div class="rw-x"><div class="rw-l"><b>Level ${L.n}</b><span class="muted">${rankOf(L.n)}</span>${gain > 0 ? `<span class="xp-up">+${gain} XP</span>` : ""}</div>` +
    `<span class="xpbar"><span style="--from:${from}%;width:${L.pct}%"></span></span>` +
    `<span class="muted">${row}${L.to - L.x} XP to level ${L.n + 1}.</span></div></div>`;
}
// A South Park GIF for the outcome (gifs.js), taken in turn from its list so it changes every time.
// Loaded from GIPHY; if that fails (offline, a GIF taken down) the space closes again.
const gifList = o => ((window.GIFS || {})[o] || []).filter(g => Array.isArray(g) && /^[A-Za-z0-9]+$/.test(g[0]));
// The next GIF of an outcome's list, chosen when the quiz finishes and kept in the run.
function pickGif(o) {
  const list = gifList(o);
  if (!list.length) return "";
  const at = isObj(ui.gif) && Number.isInteger(ui.gif[o]) && ui.gif[o] >= 0 ? ui.gif[o] % list.length : Math.floor(Math.random() * list.length);
  ui.gif = { ...(isObj(ui.gif) ? ui.gif : {}), [o]: (at + 1) % list.length };
  try { localStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch (e) {}
  return list[at][0];
}
function gifHTML(r) {
  const list = gifList(outcome(r));
  if (!S.settings.gif || !list.length) return "";
  let g = list.find(x => x[0] === r.gif);
  if (!g) { r.gif = pickGif(outcome(r)); g = list.find(x => x[0] === r.gif); save(); }   // a run finished before GIFs, or the list changed
  const [id, alt] = g, still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return `<figure class="qz-gif"><img src="https://media.giphy.com/media/${id}/${still ? "giphy_s" : "giphy"}.gif" alt="${esc(alt || "South Park")}" referrerpolicy="no-referrer" decoding="async"><figcaption>via GIPHY</figcaption></figure>`;
}
// the score box: the number, what it means, and the GIF beside it
function resHTML(r, cls, score, msg) {
  const gif = gifHTML(r);
  return `<div class="qz-res ${cls}${gif ? " has-gif" : ""}"><div class="qz-res-t"><div class="qz-score">${score}</div><div>${msg}</div></div>${gif}</div>` + rewardHTML(r);
}
function hookGif() {
  const img = qzBody.querySelector(".qz-gif img");
  if (!img) return;
  const drop = () => { const f = img.closest(".qz-gif"); if (f) { f.closest(".qz-res").classList.remove("has-gif"); f.remove(); } };
  img.addEventListener("error", drop);
  setTimeout(() => { if (!img.naturalWidth) drop(); }, 20000);
}
function renderResult() {
  const r = S.run, n = r.ids.length;
  r.seen = true;
  const missed = r.ids.filter(id => !QZ.isRight(QBY[id], r.ans[id])).map(id => QBY[id]);
  head(runTitle(r), ["Results"], 100);
  const score = `${r.score} <small>of ${n}</small>`;
  if (r.kind === "day") {
    const d = dayOf(r.day), pass = QZ.passed(r.score, n);
    qzBody.innerHTML = resHTML(r, pass ? "ok" : "bad", score,
      pass ? (r.cel ? `Passed. Day ${d.day} is complete.` : "Passed.") : `You need ${QZ.needed(n)} to pass. A retake draws different questions, and the ones you missed come back for review over the next days.`) +
      missedHTML(missed) +
      `<div class="qz-a">${pass
        ? `<button type="button" class="primary" data-qz="finish">${r.cel ? `Finish Day ${d.day} 🎉` : "Close"}</button>`
        : `<button type="button" data-qz="finish">Close</button><button type="button" class="primary" data-qz="retake">Retake with new questions</button>`}</div>`;
  } else {
    qzBody.innerHTML = resHTML(r, missed.length ? (outcome(r) === "fail" ? "bad" : "") : "ok", score,
      missed.length ? "The ones you missed come back in a few days." : "All right. Nice.") + missedHTML(missed) +
      `<div class="qz-a"><button type="button" class="primary" data-qz="finish">Close</button></div>`;
  }
  hookGif();
}
// Leave the results screen: clear the run, then celebrate if the quiz finished a day.
function finishResults() {
  const r = S.run;
  if (!r || !r.done) return;
  S.run = null;
  save();
  if (qzDlg.open) qzDlg.close();
  refresh();
  if (r.kind === "day") {
    const d = dayOf(r.day);
    if (r.cel) celebrate(r.cel, d);
    if (r.cel && view.day === d.id) move("done");   // the day's summary, with the button for the next day
    if (r.mockNew) setTimeout(() => whenFree(promptMock), 3800);
  }
}

// ---------- mock exam (no feedback until the end) ----------
function renderMockQ() {
  const r = S.run, id = r.ids[r.i], q = QBY[id], ord = r.ord[id] || QZ.order(q), mine = r.ans[id] || [];
  r.ord[id] = ord;
  const answered = r.ids.filter(k => (r.ans[k] || []).length).length;
  head("Mock exam", [`Question ${r.i + 1} of ${r.ids.length}`, `<span id="mk-time">${clock(r.end - Date.now())}</span> left`, `${answered} answered`], answered / r.ids.length * 100);
  const last = r.i + 1 >= r.ids.length;
  qzBody.innerHTML = `<div class="qz-q">${q.q}</div>${optsHTML(q, ord, mine)}` +
    `<div class="qz-a mk-a"><button type="button" data-qz="prev"${r.i ? "" : " disabled"}>← Previous</button>` +
    `<button type="button" data-qz="flag" class="flagb" aria-pressed="${!!r.flag[id]}">${r.flag[id] ? "⚑ Flagged" : "⚐ Flag for review"}</button>` +
    `<button type="button" data-qz="grid">Review all</button>` +
    `<button type="button" class="primary" data-qz="${last ? "grid" : "mnext"}">${last ? "Review and finish" : "Next →"}</button></div>`;
}
function renderGrid() {
  const r = S.run;
  const un = r.ids.filter(k => !(r.ans[k] || []).length).length;
  const fl = r.ids.filter(k => r.flag[k]).length;
  head("Mock exam", ["Review", `<span id="mk-time">${clock(r.end - Date.now())}</span> left`], (r.ids.length - un) / r.ids.length * 100);
  qzBody.innerHTML = `<p>${r.ids.length - un} of ${r.ids.length} answered${fl ? `, ${fl} flagged` : ""}. Pick a number to go back to it.</p>` +
    `<div class="mk-grid">${r.ids.map((k, i) => `<button type="button" data-go="${i}" class="${(r.ans[k] || []).length ? "ans" : ""}${r.flag[k] ? " flag" : ""}">${i + 1}</button>`).join("")}</div>` +
    `<div class="mk-key"><span class="ans">Answered</span><span class="flag">Flagged</span><span>Not answered</span></div>` +
    `<div class="qz-a"><button type="button" data-qz="back">Back to the questions</button><button type="button" class="primary" data-qz="finish-mock">Finish exam</button></div>`;
}
function finishMock(auto) {
  const r = S.run;
  if (!r || r.kind !== "mock" || r.done) return;
  pruneRun(r);
  if (!auto) {
    const un = r.ids.filter(k => !(r.ans[k] || []).length).length;
    if (!confirm(un ? `${plural(un, "question")} ${un === 1 ? "is" : "are"} unanswered and will count as wrong. Finish anyway?` : "Finish the exam and see your results?")) return;
  }
  const qs = r.ids.map(id => QBY[id]);
  const res = QZ.mockResult(qs, r.ans);
  qs.forEach(q => learn(q, QZ.isRight(q, r.ans[q.id])));
  r.done = true; r.res = res; r.only = true;
  r.mins = Math.round((Math.min(Date.now(), r.end) - r.t0) / 60000);
  S.mocks.push({ at: today(), score: res.score, n: res.n, pct: res.pct, dom: res.dom, mins: r.mins });
  const got = award();
  r.xp1 = xpTotal(); r.gif = pickGif(outcome(r));
  save(); refresh();
  showGains(got, 1000);
  if (res.pct >= 80) setTimeout(() => FX.pass(), 300);   // a comfortable margin on a full mock exam
  if (qzDlg.open) { renderQuiz(); qzDlg.scrollTop = 0; focusMain(); }
  if (auto) { FX.banner("Time is up", "Your mock exam was submitted.", "info"); if (!qzDlg.open) whenFree(openQuiz); }
}
function renderMockResult() {
  const r = S.run, res = r.res;
  r.seen = true;
  head("Mock exam", ["Results"], 100);
  const doms = ["Secure", "Resilient", "High-performing", "Cost-optimized"];
  const prev = S.mocks.slice(0, -1).map(m => m.pct + "%");
  const cls = res.pct >= 80 ? "ok" : res.pct >= 72 ? "mid" : "bad";
  const msg = cls === "ok" ? "A comfortable margin. Keep your rhythm until exam day."
    : cls === "mid" ? "Close to the line. Work through the misses below and your weakest domain."
    : "Not there yet. Work through the misses below, then the weak-spot map.";
  const list = r.ids.map((id, i) => ({ q: QBY[id], i, ok: QZ.isRight(QBY[id], r.ans[id]) })).filter(x => !r.only || !x.ok);
  qzBody.innerHTML = resHTML(r, cls, `${res.pct}% <small>${res.score} of ${res.n} in ${r.mins} min</small>`, msg) +
    `<p class="muted">The real exam reports a scaled score from 100 to 1000 (720 to pass), and AWS doesn't publish how right answers map to it, so treat this percentage as a rough guide. Aim for 80% or more here.${prev.length ? ` Earlier mocks: ${prev.join(", ")}.` : ""}</p>` +
    `<div class="dom-bars">${res.dom.map(([a, n], i) => bar(`D${i + 1} ${doms[i]}`, pct(a, n), `${a}/${n}`)).join("")}</div>` +
    `<div class="mk-rev-h"><h3 class="sub-h">Review</h3><label class="chk"><input type="checkbox" data-only${r.only ? " checked" : ""}> Only the ones I got wrong</label></div>` +
    `<ol class="qz-missed">${list.map(x => `<li value="${x.i + 1}" class="${x.ok ? "right" : "wrong"}"><details><summary>${x.ok ? "✓" : "✗"} ${x.q.q}</summary>${fbHTML(x.q, r.ord[x.q.id] || QZ.order(x.q), r.ans[x.q.id] || [])}${studyHTML(x.q)}</details></li>`).join("") || "<li>Nothing wrong. 🎉</li>"}</ol>` +
    `<div class="qz-a"><button type="button" class="primary" data-qz="finish">Close</button></div>`;
  hookGif();
}

// ---------- "Which service?" drill ----------
function startDrill() {
  if (!DRILL.length) return;
  intro = null;
  stopDrill();
  drill = { end: Date.now() + 60000, items: QZ.shuffle(DRILL), i: 0, score: 0, n: 0, missed: [], lock: false, done: false, opts: [] };
  drillNext();
  if (!qzDlg.open) qzDlg.showModal();
  focusMain();
  drill.timer = setInterval(drillTick, 200);
}
function drillNext() {
  const it = drill.items[drill.i % drill.items.length];
  drill.opts = QZ.shuffle([it[1], ...it[2]]);
  renderDrill();
}
function drillTick() {
  if (!drill || drill.done) return;
  const left = drill.end - Date.now();
  if (left <= 0) return drillEnd();
  const el = document.getElementById("dr-time");
  if (el) el.textContent = Math.ceil(left / 1000) + " s";
  document.getElementById("qz-bar").style.width = (100 - left / 600) + "%";
}
function drillPick(k) {
  if (!drill || drill.lock || drill.done) return;
  const it = drill.items[drill.i % drill.items.length], ok = drill.opts[k] === it[1];
  drill.n++;
  if (ok) drill.score++; else drill.missed.push(it);
  drill.lock = true;
  qzBody.querySelectorAll("[data-dr]").forEach((b, i) => {
    if (drill.opts[i] === it[1]) b.classList.add("right");
    else if (i === k) b.classList.add("wrong");
  });
  const sc = document.getElementById("dr-score");
  if (sc) sc.textContent = `Score ${drill.score}`;
  FX.sound(ok ? "pop" : "miss");
  setTimeout(() => { if (!drill || drill.done) return; drill.lock = false; drill.i++; drillNext(); }, ok ? 350 : 1200);
}
function drillEnd() {
  drill.done = true;
  clearInterval(drill.timer);
  S.drill.runs++;
  drill.best = drill.score > S.drill.best;
  if (drill.best) S.drill.best = drill.score;
  const got = award();
  save(); renderDrill(); renderPractice();
  FX.sound("chime");
  showGains(got, 500);
}
function stopDrill() { if (drill) clearInterval(drill.timer); drill = null; }
function renderDrill() {
  if (!drill.done) {
    const it = drill.items[drill.i % drill.items.length];
    head("Which service?", [`<span id="dr-time">${Math.ceil((drill.end - Date.now()) / 1000)} s</span>`, `<span id="dr-score">Score ${drill.score}</span>`], 100 - (drill.end - Date.now()) / 600);
    qzBody.innerHTML = `<div class="dr-req">${esc(it[0])}</div><div class="qz-opts dr-opts">${drill.opts.map((o, k) => `<button type="button" class="qz-o" data-dr="${k}"><span class="qz-l">${k + 1}</span><span class="qz-t">${esc(o)}</span></button>`).join("")}</div><p class="muted">Keys 1–4 work too.</p>`;
    return;
  }
  head("Which service?", ["Time is up"], 100);
  qzBody.innerHTML = `<div class="qz-res ok"><div class="qz-score">${drill.score} <small>right of ${drill.n}</small></div><div>${drill.best ? "New personal best. 🎉" : `Your best: ${S.drill.best}.`}</div></div>` +
    (drill.missed.length ? `<h3 class="sub-h">Missed</h3><ul class="dr-missed">${drill.missed.map(it => `<li><div>${esc(it[0])}</div><div><b>${esc(it[1])}</b>: ${esc(it[3])}</div></li>`).join("")}</ul>` : "") +
    `<div class="qz-a"><button type="button" data-qz="close">Close</button><button type="button" class="primary" data-drill>Play again</button></div>`;
}

// ---------- quiz dialog events ----------
qzDlg.addEventListener("click", e => {
  const o = e.target.closest("[data-o]");
  if (o) { pick(+o.dataset.o); return; }
  const dr = e.target.closest("[data-dr]");
  if (dr) { drillPick(+dr.dataset.dr); return; }
  const go = e.target.closest("[data-go]");
  if (go && S.run) {
    if (S.run.kind !== "mock") { goQ(+go.dataset.go); return; }
    S.run.i = +go.dataset.go; S.run.view = ""; save(); renderQuiz(); qzDlg.scrollTop = 0; return;
  }
  const j = e.target.closest("[data-jump]");
  if (j) { qzDlg.close(); jumpTo(j.dataset.jump); return; }
  const b = e.target.closest("[data-qz]");
  if (!b) return;
  const a = b.dataset.qz, r = S.run;
  if (a === "close") qzDlg.close();
  else if (a === "go") { const fn = intro.go; intro = null; fn(); }
  else if (!r) qzDlg.close();   // the run went away under the dialog (another device or tab)
  else if (a === "check") check();
  else if (a === "next") nextQ();
  else if (a === "finish") finishResults();
  else if (a === "retake") { const day = r.day; S.run = null; startRun("day", day); }
  else if (a === "prev") { if (r.kind === "mock") { r.i = Math.max(0, r.i - 1); save(); renderMockQ(); mockFocus(a); } else goQ(r.i - 1); }
  else if (a === "skip") goQ(r.i + 1);
  else if (a === "mnext") { r.i = Math.min(r.ids.length - 1, r.i + 1); save(); renderMockQ(); qzDlg.scrollTop = 0; mockFocus(a); }
  else if (a === "flag") { const id = r.ids[r.i]; if (r.flag[id]) delete r.flag[id]; else r.flag[id] = 1; save(); renderMockQ(); mockFocus(a); }
  else if (a === "grid") { r.view = "grid"; save(); renderGrid(); qzDlg.scrollTop = 0; }
  else if (a === "back") { r.view = ""; save(); renderMockQ(); }
  else if (a === "finish-mock") finishMock(false);
});
qzDlg.addEventListener("change", e => {
  if (e.target.matches("[data-only]")) { S.run.only = e.target.checked; save(); renderMockResult(); }
});
// Listen on the document: re-rendering removes the focused button, which drops focus to <body>.
document.addEventListener("keydown", e => {
  if (!qzDlg.open || brkDlg.open || e.target.matches("input,textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (drill) {
    const n = k.length === 1 ? Math.max("1234".indexOf(k), "abcd".indexOf(k)) : -1;
    if (n >= 0 && !drill.done) { e.preventDefault(); drillPick(n); }
    return;
  }
  const r = S.run;
  if (intro || !r || r.done) return;
  // Enter on a focused control (Previous, Flag, Open ↗, Open step) presses that control.
  if (k === "enter" && e.target.closest("button,a") && !e.target.closest(".qz-o")) return;
  const n = k.length === 1 ? Math.max("12345".indexOf(k), "abcde".indexOf(k)) : -1;
  if (n >= 0) {
    const opt = qzBody.querySelectorAll(".qz-opts .qz-o")[n];
    if (opt) { e.preventDefault(); opt.click(); }
    return;
  }
  if (r.kind === "mock") {
    if (k === "arrowright" || k === "enter") { const nb = qzBody.querySelector(k === "enter" ? ".mk-a .primary" : '[data-qz="mnext"]'); if (nb) { e.preventDefault(); nb.click(); } }
    else if (k === "arrowleft") { e.preventDefault(); qzBody.querySelector('[data-qz="prev"]')?.click(); }
    else if (k === "f") { e.preventDefault(); qzBody.querySelector('[data-qz="flag"]')?.click(); }
    return;
  }
  if (k === "arrowleft" || k === "arrowright") { e.preventDefault(); goQ(r.i + (k === "arrowright" ? 1 : -1)); return; }
  if (k === "enter") {
    const p = qzBody.querySelector('[data-qz="check"]:not([disabled]),[data-qz="next"]');
    if (p || e.target.closest(".qz-o")) e.preventDefault();   // Space or A–E pick; Enter on an option alone does nothing
    if (p) p.click();
  }
});
qzDlg.addEventListener("close", () => {
  if (qzDlg.open) return;           // reopened before this event was delivered
  intro = null;
  if (drill) stopDrill();
  const r = S.run;
  // Results that were never on screen (time ran out behind the drill, say) get shown first.
  if (r && r.done) { if (r.seen) finishResults(); else whenFree(openQuiz); }
  else refresh();
  runPending();
});
// mock exam clock: tick the display, submit when time is up (even with the dialog closed)
setInterval(() => {
  const r = S.run;
  if (!r || r.kind !== "mock" || r.done) return;
  if (Date.now() >= r.end) return finishMock(true);
  const el = document.getElementById("mk-time");
  if (el && qzDlg.open) el.textContent = clock(r.end - Date.now());
}, 1000);

// ---------- notebook, weak spots, cheat sheet, day notes ----------
const shDlg = document.getElementById("sheet"), shBody = document.getElementById("sh-body");
let nbFilter = "open";
function openSheet(kind) {
  shDlg.dataset.kind = kind;
  renderSheet();
  if (!shDlg.open) shDlg.showModal();
  shDlg.scrollTop = 0;
}
function renderSheet() {
  const kind = shDlg.dataset.kind;
  const [title, html] = kind === "notebook" ? ["📓 Wrong-answer notebook", notebookHTML()] : kind === "weak" ? ["📈 Weak spots", weakHTML()]
    : kind === "daynotes" ? dayNotesHTML() : kind === "badges" ? ["🏅 Badges and level", badgesHTML()] : ["🗣 Exam wording", cuesHTML()];
  document.getElementById("sh-title").textContent = title;
  shBody.innerHTML = html;
}
// Notes for the day on screen, plus the notes written on its single steps.
function dayNotesHTML() {
  const d = dayOf(view.day);
  if (!d) return ["📝 Day notes", ""];
  const mine = dIds(d).filter(id => (S.inotes[id] || "").trim());
  return [`📝 Day ${d.day} notes`,
    `<label class="notes-l">Notes for the whole day <span class="saved" data-saved="${d.id}">saved</span>` +
    `<textarea data-notes="${d.id}" placeholder="${esc(d.notesHint || "Weak spots, wrong answers, things to revisit…")}">${esc(S.notes[d.id] || "")}</textarea></label>` +
    (mine.length ? `<h3 class="sub-h">Your notes on single steps</h3><ul class="qz-refs">${mine.map(id => `<li><div class="ref-t">${itemIndex[id].it[1]}</div>` +
      `<p class="in-note">${esc(S.inotes[id])}</p><div class="ref-a"><button type="button" class="sm" data-jump="${id}">Open step</button></div></li>`).join("")}</ul>`
      : `<p class="muted">Notes you write on single steps of this day are listed here too.</p>`)];
}
function bookEntries() {
  return Object.keys(S.book).filter(id => QBY[id]).map(id => ({ q: QBY[id], b: S.book[id] }))
    .sort((x, y) => (x.b.at < y.b.at ? 1 : x.b.at > y.b.at ? -1 : y.b.misses - x.b.misses));
}
function notebookHTML() {
  const all = bookEntries(), weakDay = DAYS.find(d => d.quiz === "weak");
  if (!all.length) return `<p class="muted">Empty for now. Every question you miss in a quiz, review or mock exam lands here, with a line for why you missed it.</p>`;
  const open = all.filter(e => !e.b.fixed), fixed = all.filter(e => e.b.fixed);
  const list = nbFilter === "open" ? open : nbFilter === "fixed" ? fixed : all;
  return `<div class="seg">${[["open", `Open (${open.length})`], ["fixed", `Fixed (${fixed.length})`], ["all", `All (${all.length})`]].map(([k, l]) => `<button type="button" data-nb="${k}" aria-pressed="${nbFilter === k}">${l}</button>`).join("")}<button type="button" class="nb-exp" data-nb-export>Export as Markdown</button></div>` +
    `<p class="muted">Fixed means you answered it right after missing it. ${weakDay ? `Day ${weakDay.day} and the` : "The"} morning of the exam ${weakDay ? "are" : "is"} for this list.</p>` +
    `<ol class="qz-missed nb">${list.map(({ q, b }) => `<li class="${b.fixed ? "right" : "wrong"}"><details><summary>${q.q}<span class="nb-m">${q.tags.map(esc).join(", ")}. Missed ${b.misses}×${b.fixed ? ", answered right since" : ""}.</span></summary>` +
      `${answerHTML(q)}<label class="qz-note">Why I missed it<input type="text" maxlength="300" data-note="${q.id}" value="${esc(b.note || "")}"></label>${studyHTML(q)}</details></li>`).join("") || `<li class="muted">Nothing here.</li>`}</ol>`;
}
function exportNotebook() {
  const md = ["# SAA-C03 wrong-answer notebook", "", `Exported ${fmtD(new Date())}.`, ""];
  for (const { q, b } of bookEntries()) {
    md.push(`## ${strip(q.q)}`, "");
    q.a.forEach(i => md.push(`- **Answer:** ${strip(q.o[i])}`, `  - ${strip(q.x[i])}`));
    if (b.note) md.push(`- **Why I missed it:** ${b.note}`);
    md.push(`- **Missed:** ${b.misses}×${b.fixed ? " (answered right since)" : ""}`);
    const refs = studyRefs(q).map(id => { const { d, g, it } = itemIndex[id]; return `Day ${d.day}, ${strip(g.label || TAGS[g.t])}: ${strip(it[1])}`; });
    if (refs.length) md.push(`- **Study:** ${refs.join("; ")}`);
    md.push("");
  }
  download(md.join("\n"), `saa-wrong-answers-${today()}.md`, "text/markdown");
}
function weakHTML() {
  const w = QZ.weakTags(BANK, S.qs), dom = QZ.domainAcc(BANK, S.qs);
  const shaky = Object.keys(S.conf).filter(id => S.conf[id] === "shaky" && itemIndex[id]);
  const kshaky = Object.keys(S.kconf).filter(k => S.kconf[k] === "shaky").map(k => { const [id, i] = k.split(":"); const p = ((KEYS[id] || {}).k || [])[+i]; return itemIndex[id] && Array.isArray(p) ? [id, p[0]] : null; }).filter(Boolean);
  if (!w.length && !shaky.length && !kshaky.length) return `<p class="muted">Nothing yet. This fills in as you answer quiz questions and mark self-checks as shaky.</p>`;
  let h = "";
  if (dom.some(x => x[1])) h += `<h3 class="sub-h">By exam domain</h3><div class="dom-bars">${dom.map(([a, n], i) => n ? bar(`D${i + 1} ${DOMAINS[i]}`, pct(a, n), `${pct(a, n)}%`) : "").join("")}</div>`;
  if (w.length) h += `<h3 class="sub-h">By topic, weakest first</h3><p class="muted">Share of answers right, counting every attempt. Open a topic to see where to study it.</p>` +
    `<ul class="wk">${w.map(t => `<li><details><summary><span class="wk-t">${esc(t.tag)}</span><span class="tr"><span class="fi${t.acc < 0.7 ? " low" : ""}" style="width:${Math.round(t.acc * 100)}%"></span></span><span class="wk-n">${t.right}/${t.seen}</span></summary>` +
      `<ul class="qz-refs">${tagRefs(t.tag).map(id => refHTML(id)).join("")}</ul></details></li>`).join("")}</ul>`;
  if (shaky.length) h += `<h3 class="sub-h">Self-checks you marked shaky</h3><ul class="qz-refs">${shaky.map(id => refHTML(id)).join("")}</ul>`;
  if (kshaky.length) h += `<h3 class="sub-h">Key points you marked shaky in "Test me"</h3><ul class="qz-refs">${kshaky.map(([id, label]) => refHTML(id, `<span class="pill warn">${label}</span>`)).join("")}</ul>`;
  return h;
}
function badgesHTML() {
  const L = levelOf(xpTotal()), next = Math.floor((L.n - 1) / 2) + 1;
  return `<div class="lv"><div class="lv-n"><small>Level</small>${L.n}</div><div class="lv-x"><b>${rankOf(L.n)}</b>` +
    `<span class="xpbar"><span style="width:${L.pct}%"></span></span>` +
    `<span class="muted">${L.x} XP, ${L.to - L.x} to level ${L.n + 1}.${next < RANKS.length ? ` Next title at level ${next * 2 + 1}: ${RANKS[next]}.` : ""}</span></div></div>` +
    `<p class="muted">XP: ${XP.right} for a right quiz answer the first time, right after a miss, or right when it is due for review (repeats earn nothing), ${XP.step} for a completed step, ${XP.pass} for a day quiz passed, and what each badge is worth. ` +
    `Your longest run of right answers: ${S.rowBest || "none yet"}.</p>` +
    `<ul class="ach">${ACH.map(a => `<li class="${S.ach[a.id] ? "on" : ""}"><span class="ach-i">${a.i}</span><span class="ach-x"><b>${a.t}</b><span>${a.d}</span>` +
      `<span class="muted">${S.ach[a.id] ? `Earned ${fmtD(parseDate(S.ach[a.id]))}, +${a.xp} XP` : `+${a.xp} XP`}</span></span></li>`).join("")}</ul>`;
}
// ---------- search (Ctrl+K, / or 🔍): steps, key points, terms, exam wording, your notes, the notebook ----------
const srDlg = document.getElementById("search"), srQ = document.getElementById("sr-q"), srList = document.getElementById("sr-list");
let srStatic = null, srHits = [], srAt = 0;
const plainOf = h => strip(String(h || "")).replace(/\s+/g, " ").trim();
// What the data files hold, built once: every step, its why, each key point and trap, the glossary, exam wording.
function srBuild() {
  const out = [];
  for (const id of Object.keys(itemIndex)) {
    const { d, it } = itemIndex[id], kp = KEYS[id], at = `Day ${d.day}`;
    out.push({ kind: "Step", where: at, title: plainOf(it[1]), text: plainOf(`${it[1]} ${it[2] || ""}`), go: ["step", id] });
    if (!kp) continue;
    if (kp.why) out.push({ kind: "Why it exists", where: at, title: stepTitle(id), text: plainOf(kp.why), go: ["step", id] });
    (kp.k || []).forEach(x => { if (Array.isArray(x)) out.push({ kind: "Key point", where: at, title: plainOf(x[0]), text: plainOf(`${x[0]}: ${x[1]}`), go: ["step", id] }); });
    if (kp.trap) out.push({ kind: "Exam trap", where: at, title: stepTitle(id), text: plainOf(kp.trap), go: ["step", id] });
  }
  for (const k of Object.keys(GLOSS)) out.push({ kind: "Term", where: "", title: k, text: `${k}: ${GLOSS[k]}`, go: ["term", k], full: true });
  for (const c of CUES) out.push({ kind: "Exam wording", where: "", title: c[0], text: `${c[0]}: ${c[1]}. ${c[2]}`, go: ["cues"] });
  return out;
}
// What you wrote, read fresh on every search: step notes, day notes, the notebook.
function srDynamic() {
  const out = [];
  for (const id in S.inotes) if (itemIndex[id] && S.inotes[id].trim()) out.push({ kind: "My note", where: `Day ${itemIndex[id].d.day}`, title: stepTitle(id), text: S.inotes[id], go: ["step", id] });
  for (const id in S.notes) { const d = dayOf(id); if (d && S.notes[id].trim()) out.push({ kind: "Day note", where: `Day ${d.day}`, title: d.title, text: S.notes[id], go: ["day", id] }); }
  for (const id in S.book) if (QBY[id]) {
    const q = QBY[id], b = S.book[id];
    out.push({ kind: "Notebook", where: `Missed ${b.misses}×`, title: plainOf(q.q).slice(0, 90), text: plainOf(`${b.note} ${q.q} ${q.a.map(i => q.o[i]).join(" ")}`), go: ["book", id] });
  }
  return out;
}
const srWords = q => q.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 8);
function srFind(q) {
  const words = srWords(q);
  if (!words.length) return [];
  srStatic = srStatic || srBuild();
  const hits = [];
  for (const e of [...srDynamic(), ...srStatic]) {
    const t = e.text.toLowerCase();
    if (!words.every(w => t.includes(w))) continue;
    const tl = e.title.toLowerCase();
    hits.push({ e, s: words.filter(w => tl.includes(w)).length * 10 + (/note|Notebook/.test(e.kind) ? 4 : 0) - e.text.length / 2000 });
  }
  return hits.sort((a, b) => b.s - a.s).slice(0, 40).map(h => h.e);
}
// Mark the words on the plain text and escape every piece, so nothing typed or written becomes markup.
function srMark(text, words) {
  const low = text.toLowerCase(), on = new Array(text.length).fill(false);
  for (const w of words) for (let i = low.indexOf(w); i >= 0; i = low.indexOf(w, i + w.length)) for (let k = i; k < i + w.length; k++) on[k] = true;
  let h = "", m = false;
  for (let i = 0; i < text.length; i++) { if (on[i] !== m) { h += m ? "</mark>" : "<mark>"; m = on[i]; } h += esc(text[i]); }
  return h + (m ? "</mark>" : "");
}
function srSnip(text, words) {
  const low = text.toLowerCase(), first = Math.min(...words.map(w => { const j = low.indexOf(w); return j < 0 ? Infinity : j; }));
  const from = Math.max(0, (isFinite(first) ? first : 0) - 50), s = text.slice(from, from + 180);
  return (from ? "…" : "") + s + (from + 180 < text.length ? "…" : "");
}
function srRender() {
  const q = srQ.value.trim(), words = srWords(q);
  srHits = srFind(q);
  srAt = Math.min(srAt, Math.max(0, srHits.length - 1));
  srList.innerHTML = !q ? `<li class="muted sr-none">Type a word or two.</li>`
    : !srHits.length ? `<li class="muted sr-none">Nothing found for “${esc(q)}”.</li>`
    : srHits.map((e, i) => `<li role="option" class="sr-it${i === srAt ? " on" : ""}" data-sr="${i}" aria-selected="${i === srAt}">` +
      `<span class="sr-h"><span class="sr-k">${esc(e.kind)}</span>${e.where ? `<span class="muted">${esc(e.where)}</span>` : ""}</span>` +
      `<b class="sr-t">${srMark(e.title, words)}</b><span class="sr-s">${srMark(e.full ? e.text : srSnip(e.text, words), words)}</span></li>`).join("");
}
function openSearch() {
  if (document.querySelector("dialog[open]") && !srDlg.open) return;
  if (!srDlg.open) srDlg.showModal();
  srAt = 0; srRender(); srQ.focus(); srQ.select();
}
function srOpen(i) {
  const e = srHits[i];
  if (!e || e.go[0] === "term") return;   // a term's result is its definition
  const [k, v] = e.go;
  srDlg.close();
  if (k === "step") jumpTo(v);
  else if (k === "day") { const d = dayOf(v); setView(d.id, landing(d), true); openSheet("daynotes"); }
  else if (k === "book") { nbFilter = "all"; openSheet("notebook"); }
  else openSheet("cues");
}
srQ.addEventListener("input", () => { srAt = 0; srRender(); });
srDlg.addEventListener("keydown", e => {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    srAt = Math.max(0, Math.min(srHits.length - 1, srAt + (e.key === "ArrowDown" ? 1 : -1)));
    srRender();
    const on = srList.querySelector(".on");
    if (on) on.scrollIntoView({ block: "nearest" });
  } else if (e.key === "Enter") { e.preventDefault(); srOpen(srAt); }
});
srDlg.addEventListener("click", e => {
  const it = e.target.closest("[data-sr]");
  if (it) srOpen(+it.dataset.sr);
  else if (e.target.closest("[data-sr-close]")) srDlg.close();
});
srDlg.addEventListener("close", runPending);
document.addEventListener("keydown", e => {
  const typing = e.target.matches("input,textarea,select");
  if (((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k") || (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey)) {
    if (document.querySelector("dialog[open]") && !srDlg.open) return;
    e.preventDefault();
    openSearch();
  }
});
document.getElementById("b-search").onclick = openSearch;

// ---------- the focus view and "Test me" on a step ----------
function toggleFocusView() { ui.focusView = !ui.focusView; saveUI(); applyDisplay(); if (view.day) renderFlow(false); }
let recall = { id: "", open: new Set(), marks: {} };   // the card being tested, in memory; the marks themselves go to S.kconf
function recallClick(b) {
  const ds = b.dataset;
  if ("test" in ds) recall = { id: ds.test, open: new Set(), marks: {} };
  else if ("testEnd" in ds) recall = { id: "", open: new Set(), marks: {} };
  else if ("reveal" in ds) recall.open.add(+ds.reveal);
  else if ("kc" in ds && recall.id) {
    const i = +ds.ki, pts = ((KEYS[recall.id] || {}).k || []).filter(Array.isArray).length;
    recall.marks[i] = ds.kc;
    S.kconf[`${recall.id}:${i}`] = ds.kc;
    save();
    if (ds.kc === "ok") { FX.sound("pop"); FX.sparkle(b); }
    const marks = Object.values(recall.marks);
    if (marks.length === pts && marks.every(m => m === "ok")) setTimeout(() => FX.small(cardEl.querySelector(".c-key")), 50);   // every point recalled
  }
  renderFlow(false);
  const next = cardEl.querySelector(ds.reveal !== undefined ? `[data-kc][data-ki="${ds.reveal}"]` : "[data-reveal],[data-test-end],[data-test]");
  if (next) next.focus({ preventScroll: true });
}

function cuesHTML() {
  return `<p class="muted">Exam questions hide the deciding requirement in a phrase. Spot it and half the options fall away.</p>` +
    `<table class="cues"><thead><tr><th>When you read</th><th>It usually points to</th><th>Example</th></tr></thead><tbody>` +
    CUES.map(c => `<tr><td><b>${esc(c[0])}</b></td><td>${esc(c[1])}</td><td class="muted">${esc(c[2])}</td></tr>`).join("") + `</tbody></table>`;
}
shDlg.addEventListener("click", e => {
  const f = e.target.closest("[data-nb]");
  if (f) { nbFilter = f.dataset.nb; renderSheet(); return; }
  if (e.target.closest("[data-nb-export]")) { exportNotebook(); return; }
  const j = e.target.closest("[data-jump]");
  if (j) { shDlg.close(); jumpTo(j.dataset.jump); return; }
  if (e.target.closest("[data-sh-close]")) shDlg.close();
});
shDlg.addEventListener("close", runPending);
let noteT = 0;
document.addEventListener("input", e => {
  const id = e.target.dataset && e.target.dataset.note;
  if (!id || !S.book[id]) return;
  S.book[id].note = e.target.value.slice(0, 300);
  clearTimeout(noteT);
  noteT = setTimeout(save, 400);
});

// ---------- cleanup dialog ----------
const clDlg = document.getElementById("cleanup");
function openCleanup(dayId) {
  const d = DAYS.find(x => x.id === dayId);
  document.getElementById("cl-day").textContent = d ? `· Day ${d.day}` : "";
  document.getElementById("cl-open").href = linkFor("own");
  document.getElementById("cl-ok").hidden = true;
  const ul = document.getElementById("cl-list");
  ul.innerHTML = CLEANUP.map(([t, n], i) => `<li><label><input type="checkbox" data-cl="${i}"><span>${t}${n ? `<span class="n">${n}</span>` : ""}</span></label></li>`).join("");
  if (!clDlg.open) clDlg.showModal();
}
clDlg.addEventListener("change", e => {
  if (!e.target.matches("[data-cl]")) return;
  const all = [...clDlg.querySelectorAll("[data-cl]")];
  if (e.target.checked) {
    if (all.every(c => c.checked)) { document.getElementById("cl-ok").hidden = false; FX.small(e.target); }
    else FX.sound("pop");
  } else document.getElementById("cl-ok").hidden = true;
});
clDlg.addEventListener("close", runPending);

// ---------- events: day flow ----------
flowEl.addEventListener("click", e => {
  if (e.target.closest("[data-focus-view]")) { toggleFocusView(); return; }
  if (e.target.closest("[data-search]")) { openSearch(); return; }
  const tst = e.target.closest("[data-test],[data-test-end],[data-reveal],[data-kc]");
  if (tst) { recallClick(tst); return; }
  const g = e.target.closest(".g");
  if (g) { e.preventDefault(); g.classList.toggle("show"); return; }
  if (e.target.closest("[data-home]")) { setView("", "", true); return; }
  const at = e.target.closest("[data-at]");
  if (at) { if (!at.disabled && at.dataset.at) move(at.dataset.at); return; }
  const c = e.target.closest("[data-complete]");
  // A double click must not also complete the card that slides in under the pointer.
  if (c) { if (Date.now() - movedAt > 350) complete(c.dataset.complete, c); return; }
  const u = e.target.closest("[data-undo]");
  if (u) { setTick(u.dataset.undo, false); return; }
  const cl = e.target.closest("[data-cleanup]");
  if (cl) { openCleanup(cl.dataset.cleanup); return; }
  const sq = e.target.closest("[data-step-quiz]");
  if (sq) { FX.unlock(); startRun("step", sq.dataset.stepQuiz); return; }
  const fl = e.target.closest("[data-flip]");
  if (fl) { flip(fl.dataset.flip, document.getElementById("ca-" + fl.dataset.flip).hidden); return; }
  const cf = e.target.closest("[data-conf]");
  if (cf) {
    const id = cf.dataset.cid;
    S.conf[id] = cf.dataset.conf;
    if (cf.dataset.conf === "ok") FX.sparkle(cf);
    if (!done(id)) complete(id, cf);
    else { flip(id, false); save(); refresh(); }
  }
});
// <details> toggles don't bubble: catch them on the way down (card and panels) and remember the choice.
bodyEl.addEventListener("toggle", e => {
  const sec = e.target.dataset && e.target.dataset.sec;
  if (!sec) return;
  ui[sec] = e.target.open;
  try { localStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch (err) {}
}, true);
// ← and → move between cards, Enter presses the card's main action (unless a control has the focus).
document.addEventListener("keydown", e => {
  if (!view.day || document.querySelector("dialog[open]") || e.ctrlKey || e.metaKey || e.altKey || e.target.matches("input,textarea,select")) return;
  const nav = document.getElementById("fl-nav");
  let b = null;
  if ((e.key === "f" || e.key === "F") && !e.repeat) { e.preventDefault(); toggleFocusView(); return; }
  if (e.key === "ArrowLeft") b = nav.querySelector("[data-back]");
  else if (e.key === "ArrowRight") b = nav.querySelector("[data-next]");
  else if (e.key === "Enter" && !e.repeat && !e.target.closest("button,a,summary")) b = nav.querySelector("[data-main]");
  if (b && !b.disabled) { e.preventDefault(); b.click(); }
});
// Day notes and step notes save as you type.
const noteTimers = {};
document.addEventListener("input", e => {
  const ds = e.target.dataset || {}, id = ds.notes || ds.inote;
  if (!id) return;
  if (ds.notes) S.notes[id] = e.target.value; else S.inotes[id] = e.target.value.slice(0, NOTE_MAX);
  clearTimeout(noteTimers[id]);
  noteTimers[id] = setTimeout(() => {
    save();
    const s = document.querySelector(`[data-saved="${id}"]`);
    if (s) { s.classList.add("show"); setTimeout(() => s.classList.remove("show"), 1200); }
  }, 400);
});
document.addEventListener("click", e => {
  if (!e.target.closest(".g")) document.querySelectorAll(".g.show").forEach(x => x.classList.remove("show"));
}, true);

document.getElementById("next").addEventListener("click", e => {
  const w = e.target.closest("[data-warm]");
  if (!w) return;
  if (w.dataset.warm === "skip") { S.warm[today()] = "skip"; save(); refresh(); }
  else { FX.unlock(); startRun("warm"); }
});
// buttons that can appear anywhere: overview, cards, practice panel, slip banner, dialogs
document.addEventListener("click", e => {
  const t = e.target.closest("[data-quiz-start],[data-review],[data-mock],[data-drill],[data-sheet],[data-slip]");
  if (!t || t.disabled) return;
  FX.unlock();
  if (t.dataset.quizStart) startRun("day", t.dataset.quizStart);
  else if ("review" in t.dataset) startRun("review");
  else if ("mock" in t.dataset) { if (mockOpen() || (S.run && S.run.kind === "mock")) promptMock(); }
  else if ("drill" in t.dataset) startDrill();
  else if (t.dataset.sheet) openSheet(t.dataset.sheet);
  else if (t.dataset.slip) applySlip(t.dataset.slip);
});

// ---------- header buttons ----------
const bFx = document.getElementById("b-fx"), bSnd = document.getElementById("b-snd");
function syncToggles() {
  bFx.textContent = `🎉 Effects ${S.settings.fx ? "on" : "off"}`;
  bFx.setAttribute("aria-pressed", S.settings.fx);
  bSnd.textContent = `${S.settings.sound ? "🔔" : "🔕"} Sound ${S.settings.sound ? "on" : "off"}`;
  bSnd.setAttribute("aria-pressed", S.settings.sound);
  FX.set({ fx: S.settings.fx, sound: S.settings.sound });
}
bFx.onclick = () => { S.settings.fx = !S.settings.fx; save(); syncToggles(); if (S.settings.fx) FX.tick(bFx); };
bSnd.onclick = () => { S.settings.sound = !S.settings.sound; save(); syncToggles(); if (S.settings.sound) { FX.unlock(); FX.sound("pop"); } };

// ---------- settings ----------
const setDlg = document.getElementById("settings");
function renderSettingsInfo() {
  const sl = document.getElementById("s-slips");
  const moved = S.slips.reduce((a, s) => a + s.n, 0);
  sl.hidden = !moved;
  document.getElementById("s-slips-t").textContent = moved ? `The schedule has been moved ${plural(moved, "day")} later in total. Day ${LAST} is ${fmtD(dayDate(LAST))}.` : "";
  document.getElementById("s-sync").textContent = sync.on
    ? `Progress is saved on the server (SQLite, revision ${sync.rev}) and cached in this browser.`
    : "Progress lives in this browser for this address (e.g. localhost:8080). When the site runs from the Docker image it is also saved on the server.";
}
document.getElementById("b-set").onclick = () => {
  document.getElementById("s-start").value = S.settings.start;
  document.getElementById("s-exam").value = S.settings.exam || "";
  document.getElementById("s-portal").value = S.settings.portal;
  document.getElementById("s-fx").checked = S.settings.fx;
  document.getElementById("s-snd").checked = S.settings.sound;
  document.getElementById("s-gif").checked = S.settings.gif;
  document.getElementById("s-theme").value = ui.theme === "light" || ui.theme === "dark" ? ui.theme : "";
  document.getElementById("s-size").value = ui.size === "l" || ui.size === "xl" ? ui.size : "";
  renderSettingsInfo();
  setDlg.returnValue = "";
  setDlg.showModal();
};
setDlg.addEventListener("close", () => {
  runPending();
  if (setDlg.returnValue !== "save") return;
  const start = document.getElementById("s-start").value;
  if (start) S.settings.start = start;
  S.settings.exam = document.getElementById("s-exam").value;
  const portal = document.getElementById("s-portal").value.trim();
  S.settings.portal = /^https?:\/\//i.test(portal) ? portal : "";
  S.settings.fx = document.getElementById("s-fx").checked;
  S.settings.sound = document.getElementById("s-snd").checked;
  S.settings.gif = document.getElementById("s-gif").checked;
  ui.theme = document.getElementById("s-theme").value; ui.size = document.getElementById("s-size").value;
  saveUI(); applyDisplay();
  save(); rebuild();
});
document.getElementById("s-unslip").onclick = () => { S.slips = []; S.slipSkip = ""; save(); refresh(); renderSettingsInfo(); };
document.getElementById("s-export").onclick = () => download(JSON.stringify(S, null, 2), `saa-plan-progress-${today()}.json`, "application/json");
const fileIn = document.getElementById("s-file");
document.getElementById("s-import").onclick = () => fileIn.click();
fileIn.onchange = () => {
  const f = fileIn.files[0];
  if (!f) return;
  f.text().then(t => {
    const next = JSON.parse(t);
    if (!isObj(next) || !isObj(next.settings)) throw new Error("not an export");
    S = parseState(next);
    S.timer = Object.assign(clone(DEF.timer), { min: S.timer.min });   // an export carries a timer from another time: start it idle
    DAYS.forEach(markDayDone);
    award();
    save(); setDlg.close("x"); rebuild(); restoreScores();
    FX.banner("Progress imported", "", "info");
  }).catch(() => alert("That file isn't a valid progress export. Nothing was changed."));
  fileIn.value = "";
};
document.getElementById("s-reset").onclick = () => {
  if (!confirm("Clear all ticks, notes, scores and quiz history? (Settings are kept.)")) return;
  const keep = S.settings;
  S = clone(DEF); S.settings = keep;
  lvShown = 0;
  save(); setDlg.close("x"); rebuild(); restoreScores();
};
function restoreScores() { document.querySelectorAll("[data-score]").forEach(inp => { inp.value = S.scores[inp.dataset.score] ?? ""; }); }

// ---------- focus timer ----------
// A focus block counts down from 50 minutes. When it ends, a pop-up offers a break. The break has no set length:
// it counts up, and once it passes 10 minutes it reminds you every minute to start the next focus block, with
// the pop-up when it isn't up already and with the sound alone when it is, so reminders never pile up.
// Several tabs: the "done" prompt (timer.ask) shows in each and closes in each once answered; a reminder's
// sound plays once a minute for all of them (NAG_KEY).
const tm = document.getElementById("timer");
const brkDlg = document.getElementById("brk"), brkBody = document.getElementById("brk-body");
const NAG_KEY = KEY + "-nag";   // "<break start>:<minute>" of the last reminder sound, shared by this browser's tabs
let nagKey = "";                // the same, for the pop-up of this tab
let brkAt = 0, brkGains = [];   // when the pop-up opened (a click right after is ignored); badges to show once it closes
const tmLeft = () => S.timer.running ? Math.min(FOCUS, Math.max(0, Math.round((S.timer.endAt - Date.now()) / 1000))) : S.timer.left;
const restUp = () => Math.min(86400, Math.max(0, Math.round(S.timer.up + (S.timer.running ? (Date.now() - S.timer.at) / 1000 : 0))));
const mmss = s => (s >= 3600 ? `${Math.floor(s / 3600)}:` : "") + `${String(Math.floor(s / 60) % (s >= 3600 ? 60 : 1e9)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const workDay = () => dayOf(view.day) || (nextStep() || {}).d;
// The mock exam and the drill run against a clock: the timer's pop-ups wait until they are closed or over.
const inTimed = () => qzDlg.open && (drill ? !drill.done : !intro && !!S.run && S.run.kind === "mock" && !S.run.done);
let overHeld = false;   // a "Break is over" pop-up is waiting for the mock exam or the drill
// Every change to the timer carries its own time, so a merge keeps the timer that changed last (not whichever copy saved last).
function tmSave() { S.timer.ts = Date.now(); save(); tmRender(); }
// Credit focused time to the day the block was started on (or, for a block from before that was kept, the day you're on).
function logFocus() {
  const t = S.timer;
  if (t.mode !== "focus" || !t.running) return;
  const sec = (t.from > 0 ? t.from : FOCUS) - tmLeft();
  const d = dayOf(t.day) || workDay();
  if (sec < 30 || !d) return;
  S.log[d.id] = (S.log[d.id] || 0) + sec / 60;
}
function tmRender() {
  const t = S.timer, rest = t.mode === "rest", s = rest ? restUp() : tmLeft(), over = rest && t.running && s >= REST_NAG;
  tm.classList.toggle("running", t.running);
  tm.classList.toggle("break", rest);
  tm.classList.toggle("over", over);
  tm.classList.toggle("min", !!t.min);
  tm.querySelector(".tm-mode").textContent = !rest ? "50-minute focus" : over ? "Break is over" : !t.running && s ? "Break, paused" : "Break";
  tm.querySelector(".tm-time").textContent = mmss(s);
  tm.querySelector('[data-tm="toggle"]').textContent = t.running ? "Pause" : rest ? (s ? "Resume" : "Start break") : s === FOCUS ? "Start" : "Resume";
  tm.querySelector('[data-tm="switch"]').textContent = rest ? "Focus" : "Break";
  tm.querySelector('[data-tm="min"]').textContent = t.min ? "+" : "–";
  document.title = t.running ? `${mmss(s)} ${!rest ? "🎯" : over ? "⏰" : "☕"} · SAA-C03 Plan` : t.ask ? "Focus block done 🎯 · SAA-C03 Plan" : "SAA-C03 Plan";
  const up = document.getElementById("brk-up");
  if (up) up.textContent = mmss(restUp());
}
function tmSet(mode) { Object.assign(S.timer, { mode, running: false, left: FOCUS, up: 0, at: 0, ask: false }); tmSave(); }
const startFocus = () => { logFocus(); Object.assign(S.timer, { mode: "focus", running: true, left: FOCUS, from: FOCUS, endAt: Date.now() + FOCUS * 1000, up: 0, at: 0, ask: false, day: (workDay() || {}).id || "" }); };
const startRest = () => { logFocus(); Object.assign(S.timer, { mode: "rest", running: true, up: 0, at: Date.now(), ask: false }); };
const pauseRest = () => { Object.assign(S.timer, { up: restUp(), running: false }); };
tm.addEventListener("click", e => {
  const b = e.target.closest("[data-tm]");
  const a = b ? b.dataset.tm : e.target.closest(".tm-time") && S.timer.min ? "min" : null;
  if (!a) return;
  const t = S.timer, rest = t.mode === "rest";
  if (a === "toggle") {
    if (t.running) { if (rest) pauseRest(); else { logFocus(); t.left = tmLeft(); t.running = false; } }
    else {
      FX.unlock();
      if (rest) { t.at = Date.now(); t.ask = false; }
      else { if (t.left <= 0) t.left = FOCUS; t.from = t.left; t.endAt = Date.now() + t.left * 1000; t.day = (workDay() || {}).id || ""; }   // paused at 00:00: a new block
      t.running = true;
    }
  } else if (a === "reset" || a === "switch") { logFocus(); tmSet(a === "reset" ? t.mode : rest ? "focus" : "rest"); refresh(); showGains(award()); return; }
  else if (a === "min") { t.min = !t.min; }
  tmSave();
  if (a !== "min") { refresh(); showGains(award()); }
});
// The pop-up: "done" when a focus block has just ended, "over" when the break has run past 10 minutes.
// It is a modal of its own, so it also comes up over an open quiz (and the quiz keys wait under it). The keyboard
// goes to its heading, not a button, so a key typed for something else (a note, a quiz answer) doesn't answer it.
function brkOpen(kind) {
  brkDlg.dataset.kind = kind;
  brkBody.innerHTML = kind === "done"
    ? `<h2 id="brk-t" tabindex="-1">Focus block done 🎯</h2><p>50 minutes of focus. Take a break now: it has no set length. The clock counts up, and after ${REST_NAG / 60} minutes it reminds you every minute to come back.</p>` +
      `<div class="row end"><button type="button" data-brk="focus">Skip the break, focus again</button><button type="button" class="primary" data-brk="rest">Start break ☕</button></div>`
    : `<h2 id="brk-t" tabindex="-1">Break is over ⏰</h2><p>You have been on a break for <b id="brk-up">${mmss(restUp())}</b>. Time for the next 50 minutes of focus.</p>` +
      `<p class="muted">Away for longer? Pause the break and the reminders stop until you resume it.</p>` +
      `<div class="row end"><button type="button" data-brk="pause">Pause the break</button><button type="button" data-brk="later">Not yet</button><button type="button" class="primary" data-brk="focus">Start focus 🎯</button></div>`;
  if (!brkDlg.open) brkDlg.showModal();
  brkAt = Date.now();
  document.getElementById("brk-t").focus({ preventScroll: true });
}
brkDlg.addEventListener("click", e => {
  const b = e.target.closest("[data-brk]");
  if (!b || Date.now() - brkAt < 400) return;   // a click meant for what was under the pointer when it opened
  const a = b.dataset.brk;
  brkDlg.close();
  if (a === "later") return;
  FX.unlock();
  if (a === "rest") startRest(); else if (a === "pause") pauseRest(); else startFocus();
  tmSave(); refresh();
  showGains(award());
  FX.sound("pop");
});
brkDlg.addEventListener("close", () => {
  // Esc on "done" answers it too: no break for now (the timer offers Start break)
  if (brkDlg.dataset.kind === "done" && S.timer.ask) { S.timer.ask = false; tmSave(); }
  if (brkGains.length) showGains(brkGains.splice(0), 300);
  runPending();
});
setInterval(() => {
  const t = S.timer;
  if (t.running && t.mode === "focus" && tmLeft() <= 0) {
    logFocus();
    tmSet("rest");
    t.ask = true;   // the prompt waits for an answer, in every tab and after a reload
    tmSave();
    refresh();
    FX.sound("timer");
    FX.sparkle(tm);   // a full focus block is something finished too
    brkGains.push(...award());
  }
  if (t.ask && !brkDlg.open && !inTimed()) brkOpen("done");
  if (t.running && t.mode === "rest" && restUp() >= REST_NAG) {
    const key = `${t.at}:${Math.floor((restUp() - REST_NAG) / 60)}`;   // a new or resumed break starts its own minutes
    if (key !== nagKey) {
      nagKey = key;
      let heard = "";
      try { heard = localStorage.getItem(NAG_KEY) || ""; localStorage.setItem(NAG_KEY, key); } catch (e) {}
      if (heard !== key) FX.sound("nag");   // another tab already knocked this minute
      if (!brkDlg.open) { if (inTimed()) overHeld = true; else brkOpen("over"); }
    }
    if (overHeld && !brkDlg.open && !inTimed()) { overHeld = false; brkOpen("over"); }
  } else overHeld = false;
  // the timer moved on elsewhere (another tab, the server): a pop-up that no longer fits goes away
  if (brkDlg.open && (brkDlg.dataset.kind === "over" ? !(t.mode === "rest" && t.running && restUp() >= REST_NAG) : !t.ask)) brkDlg.close();
  if (t.running) tmRender();
}, 1000);
// Browsers keep sound off after a reload until the first click or key: take the first one anywhere, so reminders can be heard.
for (const ev of ["pointerdown", "keydown"]) addEventListener(ev, () => FX.unlock(), { capture: true, passive: true });

// ---------- server sync (only when served by the Go backend; otherwise browser-only) ----------
// localStorage stays the working copy. The server keeps one revisioned document. If this copy is
// unchanged since the last sync, a newer server copy simply replaces it; if both changed (two
// devices, or offline edits), the two are merged so no tick, answer or note is lost.
let pushT = 0;
function syncLater() {
  sync.dirty = true;
  syncMeta();
  if (!sync.on) return;
  clearTimeout(pushT);
  pushT = setTimeout(push, 800);
}
// Combine two copies edited in parallel: every tick and answer, the best quiz results, the newer copy's settings.
function mergeDocs(local, remote) {
  const [older, newer] = local.savedAt > remote.savedAt ? [remote, local] : [local, remote];
  const m = clone(newer);
  const seenIn = (st, id) => (st.qs[id] ? st.qs[id].seen : 0);
  for (const k in older.ticks) m.ticks[k] = true;
  for (const f of ["notes", "inotes", "scores", "conf", "kconf", "warm"]) for (const k in older[f]) if (!(k in m[f]) || m[f][k] === "") m[f][k] = older[f][k];
  for (const k in older.dayDone) if (!m.dayDone[k] || older.dayDone[k] < m.dayDone[k]) m.dayDone[k] = older.dayDone[k];
  for (const k in older.quiz) {
    const o = older.quiz[k], n = m.quiz[k];
    if (!n) { m.quiz[k] = o; continue; }
    n.best = Math.max(n.best, o.best);
    if (o.passed && (!n.passed || o.passed < n.passed)) n.passed = o.passed;
    if (o.tries.length > n.tries.length) n.tries = o.tries;
  }
  // per question, trust whichever copy has answered it more often
  for (const id of new Set([...Object.keys(older.qs), ...Object.keys(newer.qs)])) {
    if (seenIn(older, id) <= seenIn(newer, id)) continue;
    m.qs[id] = older.qs[id];
    if (older.srs[id]) m.srs[id] = older.srs[id]; else delete m.srs[id];
    if (older.book[id]) m.book[id] = { ...older.book[id], note: (newer.book[id] && newer.book[id].note) || older.book[id].note };
  }
  for (const id in older.book) if (!m.book[id]) m.book[id] = older.book[id];
  const mk = x => `${x.at}|${x.score}|${x.pct}|${x.mins}`, have = new Set(m.mocks.map(mk));
  m.mocks = m.mocks.concat(older.mocks.filter(x => !have.has(mk(x)))).sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
  for (const k in older.log) m.log[k] = Math.max(m.log[k] || 0, older.log[k]);
  m.drill = { best: Math.max(m.drill.best, older.drill.best), runs: Math.max(m.drill.runs, older.drill.runs) };
  for (const k in older.ach) if (!m.ach[k] || older.ach[k] < m.ach[k]) m.ach[k] = older.ach[k];
  m.rowBest = Math.max(m.rowBest, older.rowBest);
  if (older.timer.ts > newer.timer.ts) m.timer = clone(older.timer);   // the timer that changed last, not the copy that saved last
  m.run = local.run || remote.run;      // the run on this screen stays
  m.savedAt = Date.now();
  return m;
}
// Re-render after the state was replaced from outside (server or another tab).
function applyState() {
  DAYS.forEach(markDayDone);
  award();
  rebuild(); restoreScores(); tmRender();
  if (qzDlg.open && !drill && !intro && S.run) renderQuiz();
  if (shDlg.open && shDlg.dataset.kind !== "daynotes") renderSheet();   // never redraw a notes box under the cursor
}
// The server holds a revision we haven't seen. Returns true when the result still needs pushing.
function absorb(cur) {
  const remote = parseState(cur.doc);
  const both = sync.dirty;
  S = both ? mergeDocs(S, remote) : remote;
  sync.rev = cur.rev;
  if (!both) sync.dirty = false;
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  syncMeta();
  applyState();
  return both;
}
async function push() {
  if (sync.busy) { sync.again = true; return; }
  sync.busy = true;
  const n = sync.n;   // only call it clean if nothing was saved while the request was in flight
  try {
    const r = await fetch("api/state", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rev: sync.rev, doc: S }) });
    if (r.ok) { sync.rev = (await r.json()).rev; if (sync.n === n) sync.dirty = false; syncMeta(); }
    else if (r.status === 409) { if (absorb(await r.json())) sync.again = true; }
  } catch (e) { /* offline: stays dirty, retried on the next save or focus */ }
  sync.busy = false;
  if (sync.again) { sync.again = false; push(); }
}
async function pull() {
  let cur;
  try {
    const r = await fetch("api/state", { cache: "no-store" });
    if (!r.ok || !(r.headers.get("Content-Type") || "").includes("application/json")) return;
    cur = await r.json();
  } catch (e) { return; }
  sync.on = true;
  if (cur.rev === sync.rev) { if (sync.dirty) push(); return; }
  if (!isObj(cur.doc)) { sync.rev = cur.rev; push(); return; }   // empty server: upload this copy
  if (absorb(cur)) push();
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") pull(); });
// Another tab of this site saved: take its copy, so this tab never writes back stale data.
addEventListener("storage", e => {
  if (e.key === SYNC_KEY && e.newValue) {
    try { const m = JSON.parse(e.newValue); sync.rev = num0(m.rev); sync.dirty = !!m.dirty; } catch (err) {}
    return;
  }
  if (e.key !== KEY || !e.newValue) return;
  let next;
  try { next = parseState(JSON.parse(e.newValue)); } catch (err) { return; }
  if (qzDlg.open && S.run) next.run = S.run;   // keep the quiz on this screen
  S = next;
  applyState();
});

// ---------- boot ----------
function rebuild() { syncLevel(); renderLinks(); syncToggles(); refresh(); }
// stay correct past midnight without reloading
let lastIdx = todayIdx(), lastDate = today();
setInterval(() => { if (todayIdx() !== lastIdx || today() !== lastDate) { lastIdx = todayIdx(); lastDate = today(); refresh(); } }, 60000);

// Days ticked off before quizzes existed count as done once their quiz is passed.
DAYS.forEach(markDayDone);
award(0, false);   // saved with the next change, or after the first sync (applyState)
document.getElementById("places").open = Object.keys(S.ticks).length === 0;
document.getElementById("tb-sub").textContent = `SAA-C03 in ${DAYS.length} days`;
restoreScores();
rebuild();
route();
tmRender();
pull();
if (S.run && S.run.kind === "mock" && !S.run.done && Date.now() >= S.run.end) finishMock(true);
else if (S.run && S.run.done) whenFree(openQuiz);   // results left open before a reload
})();
