(() => {
"use strict";

const PLAN = window.PLAN, LINKS = window.LINKS, GLOSS = window.GLOSSARY, CLEANUP = window.CLEANUP;
const QZ = window.QZ, BANK = window.QUIZ || [], DOCS = window.DOCS || {};
const CARDS = window.CARDS || {}, DRILL = window.DRILL || [], CUES = window.CUES || [];
const KEY = "saa-plan-v2";
const DEF = {
  ticks: {}, notes: {}, scores: {}, dayDone: {},
  quiz: {},    // day id → { best, passed: date or "", tries: [{ at, score, n }] }
  qs: {},      // question id → { seen, right, last, at }
  srs: {},     // question id → { step, due }: missed questions waiting for review
  book: {},    // question id → { at, misses, note, fixed }: wrong-answer notebook
  run: null,   // quiz or mock exam in progress; survives a reload
  mocks: [],   // finished mock exams
  conf: {},    // self-check id → "ok" | "shaky"
  log: {},     // day id → minutes logged by the focus timer
  warm: {},    // date → "done" | "skip"
  slips: [],   // schedule shifts: [{ from: day, n: days }]
  slipSkip: "",
  drill: { best: 0, runs: 0 },
  settings: { start: "2026-10-12", portal: "", exam: "", fx: true, sound: true, hideDone: false },
  timer: { mode: "focus", running: false, endAt: 0, left: 50 * 60, from: 0, min: matchMedia("(max-width:640px)").matches },
  savedAt: 0
};
const DUR = { focus: 50 * 60, break: 10 * 60 };
const TAGS = { watch: "Watch", play: "Play", prep: "Exam prep", build: "Build", check: "Self-check", setup: "Setup" };
const DOMAINS = ["Secure", "Resilient", "High-performing", "Cost"];
const QUIZ_MIN = 30;
const LETTERS = "ABCDE";

// ---------- state ----------
const clone = o => JSON.parse(JSON.stringify(o));
function merge(a, b) {
  for (const k in b) {
    if (b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) && a[k] && typeof a[k] === "object") merge(a[k], b[k]);
    else a[k] = b[k];
  }
  return a;
}
function load() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  return merge(clone(DEF), s || {});
}
let S = load();
// Server sync bookkeeping (see "server sync" below): last revision seen, unsaved changes.
const SYNC_KEY = KEY + "-sync";
const sync = { on: false, rev: 0, dirty: false, busy: false, again: false };
try { Object.assign(sync, JSON.parse(localStorage.getItem(SYNC_KEY)) || {}, { on: false, busy: false, again: false }); } catch (e) {}
const syncMeta = () => { try { localStorage.setItem(SYNC_KEY, JSON.stringify({ rev: sync.rev, dirty: sync.dirty })); } catch (e) {} };
function save() {
  S.savedAt = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  syncLater();
}

// ---------- indexes ----------
const DAYS = PLAN.filter(d => d.id);
const itemIndex = {};
DAYS.forEach(d => d.groups.forEach((g, gi) => {
  g.key = d.id + "g" + gi;
  g.items.forEach(it => { itemIndex[it[0]] = { d, g, it }; });
}));
const QBY = {};
BANK.forEach(q => { QBY[q.id] = q; });
const dayOf = id => DAYS.find(x => x.id === id);
const done = id => !!S.ticks[id];
const gIds = g => g.items.map(i => i[0]);
const dIds = d => d.groups.flatMap(gIds);
const groupDone = g => gIds(g).every(done);
const hasQuiz = d => QZ.hasQuiz(d.day);
const quizOk = d => !hasQuiz(d) || !!(S.quiz[d.id] && S.quiz[d.id].passed);
const itemsDone = d => dIds(d).every(done);
const dayDone = d => itemsDone(d) && quizOk(d);
const groupLeft = g => { const ids = gIds(g); return (g.min || 0) * ids.filter(i => !done(i)).length / ids.length; };
const dayLeft = d => d.groups.reduce((a, g) => a + groupLeft(g), 0) + (quizOk(d) ? 0 : QUIZ_MIN);
const dayPlanned = d => d.groups.reduce((a, g) => a + (g.min || 0), 0) + (hasQuiz(d) ? QUIZ_MIN : 0);
const weekOf = d => DAYS.filter(x => (x.day <= 7) === (d.day <= 7));
const studyDays = DAYS.filter(d => d.day <= 13);
const mockOpen = () => studyDays.every(dayDone);
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
// Which plan day today is: 0 or less before Day 1, more than 14 after the last day.
function todayIdx() {
  const t = midnight();
  if (t < dayDate(1)) return 1 + diffDays(t, dayDate(1));
  if (t > dayDate(14)) return 14 + diffDays(t, dayDate(14));
  let n = 1;
  for (let k = 1; k <= 14; k++) if (dayDate(k) <= t) n = k;
  return n;
}
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const today = () => iso(new Date());
const examDate = () => S.settings.exam ? parseDate(S.settings.exam) : dayDate(14);
const fmtD = d => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const fmtH = m => m < 1 ? "0 min" : m < 60 ? `${Math.round(m / 5) * 5 || 5} min` : `${Math.round(m / 30) / 2} h`;
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const plural = (n, one, many = one + "s") => `${n} ${n === 1 ? one : many}`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const strip = h => { const t = document.createElement("div"); t.innerHTML = h; return t.textContent; };
const clock = ms => { const s = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
function linkFor(key) {
  if (!key) return null;
  if (key === "own") return S.settings.portal || LINKS.console.url;
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
const GL = {};
Object.keys(GLOSS).forEach(k => { GL[k.toLowerCase()] = GLOSS[k]; });
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

// ---------- render ----------
const root = document.getElementById("plan");
function render() {
  root.innerHTML = "";
  for (const d of PLAN) {
    if (d.week) {
      const h = document.createElement("div");
      h.className = "week"; h.textContent = d.week;
      root.appendChild(h);
      continue;
    }
    root.appendChild(renderDay(d));
  }
  applyGlossary(root);
}
const flipLabel = id => S.conf[id] === "shaky" ? "Shaky: show answer" : "Show answer";
function renderDay(d) {
  const det = document.createElement("details");
  det.className = "day"; det.id = d.id;
  let h = `<summary><span class="dn"><small>Day</small>${d.day}</span><span class="dd"></span><span class="tt">${d.title}</span><span class="today-badge">Today</span><span class="ct"></span></summary><div class="body"><p class="goal">${d.goal}</p><p class="tlog" data-tlog="${d.id}" hidden></p>`;
  for (const g of d.groups) {
    const url = linkFor(g.link);
    const cards = g.t === "check" && g.items.some(it => CARDS[it[0]]);
    h += `<div class="grp" data-g="${g.key}"><div class="gh"><span class="tag t-${g.t}">${g.label || TAGS[g.t]}</span>`;
    if (g.min) h += `<span class="gm">~${fmtH(g.min)}</span>`;
    if (url) h += `<a class="btn open" href="${url}" target="_blank" rel="noopener">Open ↗</a>`;
    h += `</div>`;
    if (g.where) h += `<div class="where">Where: ${g.where}</div>`;
    else if (cards) h += `<div class="where">Explain each one out loud first, then open the model answer and compare.</div>`;
    h += `<ul>`;
    for (const [id, txt, note] of g.items) {
      h += `<li data-li="${id}"><label><input type="checkbox" data-id="${id}"${done(id) ? " checked" : ""}><span class="txt">${txt}${note ? `<span class="n">${note}</span>` : ""}</span></label>`;
      if (g.t === "check" && CARDS[id]) {
        h += `<button type="button" class="flip${S.conf[id] === "shaky" ? " shaky" : ""}" data-flip="${id}" aria-expanded="false" aria-controls="ca-${id}">${flipLabel(id)}</button>` +
          `<div class="card-a" id="ca-${id}" hidden><div class="card-t">${CARDS[id]}</div><div class="card-b"><span class="muted">How close were you?</span>` +
          `<button type="button" data-conf="ok" data-cid="${id}">Got it</button><button type="button" data-conf="shaky" data-cid="${id}">Shaky</button></div></div>`;
      }
      h += `</li>`;
    }
    h += `</ul></div>`;
  }
  if (hasQuiz(d)) {
    h += `<div class="grp quizrow" data-quiz="${d.id}"><div class="gh"><span class="tag t-quiz">Quiz</span><span class="gm">${QZ.DAILY} questions, ~${QUIZ_MIN} min</span><button type="button" class="open" data-quiz-start="${d.id}">Start quiz</button></div>` +
      `<div class="where">${QZ.describe(d.day)}. Pass at ${QZ.needed(QZ.DAILY)} of ${QZ.DAILY} to complete the day.</div><div class="qz-st" data-qzst="${d.id}"></div></div>`;
  }
  if (d.decision) h += `<div class="verdict" data-verdict></div>`;
  const tools = [];
  if (d.groups.some(g => g.t === "build")) tools.push(`<button type="button" data-cleanup="${d.id}">🧹 Cleanup check</button>`);
  for (const t of d.tools || []) tools.push(t === "notebook" ? `<button type="button" data-sheet="notebook">📓 Wrong-answer notebook</button>` : `<button type="button" data-sheet="weak">📈 Weak spots</button>`);
  if (tools.length) h += `<div class="tools">${tools.join("")}</div>`;
  h += `<label class="notes-l">Notes <span class="saved" data-saved="${d.id}">saved</span><textarea data-notes="${d.id}" placeholder="${esc(d.notesHint || "Weak spots, wrong answers, things to revisit…")}">${esc(S.notes[d.id] || "")}</textarea></label></div>`;
  det.innerHTML = h;
  return det;
}
function renderLinks() {
  const nav = document.getElementById("links");
  const items = [];
  for (const k of ["sb", "ess", "cq"]) items.push([LINKS[k].label, LINKS[k].url]);
  items.push(S.settings.portal ? ["Access portal", S.settings.portal] : [LINKS.console.label, LINKS.console.url]);
  for (const k of ["calc", "cert"]) items.push([LINKS[k].label, LINKS[k].url]);
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
function refresh() {
  const ti = todayIdx();
  let total = 0, dn = 0;
  for (const d of DAYS) {
    const det = document.getElementById(d.id);
    const ids = dIds(d), k = ids.filter(done).length;
    const q = hasQuiz(d) ? 1 : 0;
    total += ids.length + q; dn += k + (q && quizOk(d) ? 1 : 0);
    const complete = dayDone(d), quizDue = k === ids.length && !complete;
    det.querySelector(".dd").textContent = fmtD(dayDate(d.day));
    det.querySelector(".ct").textContent = complete ? "✓ done" : quizDue ? "Quiz to pass" : `${k} of ${ids.length}, ~${fmtH(dayLeft(d))} left`;
    det.dataset.complete = complete ? "1" : "0";
    det.dataset.quiz = quizDue ? "1" : "0";
    det.dataset.today = d.day === ti ? "1" : "0";
    for (const g of d.groups) det.querySelector(`[data-g="${g.key}"]`).dataset.done = groupDone(g) ? "1" : "0";
    if (q) renderQuizRow(d);
    const tl = det.querySelector("[data-tlog]"), m = S.log[d.id] || 0;
    tl.hidden = m < 1;
    tl.textContent = m < 1 ? "" : `⏱ Planned ~${fmtH(dayPlanned(d))}, logged ${fmtH(m)} with the focus timer.`;
  }
  const p = total ? Math.round(dn / total * 100) : 0;
  document.getElementById("bar").style.width = p + "%";
  const daysDone = DAYS.filter(dayDone).length;
  document.getElementById("pct").textContent = `${dn} of ${total} steps, ${daysDone} of 14 days`;
  document.getElementById("tb-pct").textContent = p + "%";
  document.getElementById("tb-sheet").textContent = ti < 1 ? "Not started" : ti > 14 ? "Finished" : `Day ${ti} of 14`;
  const examD = examDate();
  document.getElementById("tb-exam").textContent = fmtD(examD);
  document.getElementById("tb-exam-k").textContent = S.settings.exam ? "Exam (booked)" : "Exam";

  // status line
  const st = [];
  if (ti < 1) {
    st.push(`<span>Starts <b>${fmtD(dayDate(1))}</b> (in ${plural(1 - ti, "day")})</span>`);
  } else if (ti > 14) {
    st.push(`<span>Plan period ended ${fmtD(dayDate(14))}</span>`);
  } else {
    const td = DAYS[ti - 1];
    st.push(`<span><b>Today:</b> ${td.title}</span>`);
    st.push(dayDone(td) ? `<span class="pill ok">Today done</span>` : `<span>~${fmtH(dayLeft(td))} left today</span>`);
    const overdue = DAYS.filter(d => d.day < ti).reduce((a, d) => a + dayLeft(d), 0);
    if (overdue > 0) st.push(`<span class="pill ${overdue > 180 ? "bad" : "warn"}">Behind: ~${fmtH(overdue)} from earlier days</span>`);
    else if (DAYS.some(d => d.day > ti && dIds(d).some(done))) st.push(`<span class="pill ok">Ahead of plan</span>`);
    else st.push(`<span class="pill ok">On track</span>`);
  }
  if (S.settings.exam && dayDate(14) > parseDate(S.settings.exam)) st.push(`<span class="pill bad">Plan now ends after your booked exam</span>`);
  const daysToExam = diffDays(examD, new Date());
  if (daysToExam >= 0) st.push(`<span>${daysToExam ? `Exam in <b>${plural(daysToExam, "day")}</b>` : "<b>Exam today</b>"}</span>`);
  const sk = streak();
  if (sk > 0) st.push(`<span>🔥 ${sk}-day streak</span>`);
  document.getElementById("status").innerHTML = st.join("");

  renderSlip();
  renderNext();
  renderScores();
  renderPractice();
}
function renderQuizRow(d) {
  const row = root.querySelector(`[data-quiz="${d.id}"]`);
  if (!row) return;
  const r = S.quiz[d.id], tries = r ? r.tries.length : 0;
  const live = S.run && S.run.kind === "day" && S.run.day === d.id && !S.run.done;
  const open = itemsDone(d), ok = quizOk(d);
  const btn = row.querySelector("[data-quiz-start]");
  row.dataset.done = ok ? "1" : "0";
  btn.disabled = !open && !live;
  btn.className = "open" + ((open && !ok) || live ? " primary" : "");
  btn.textContent = live ? "Resume quiz" : ok ? "Practice again" : tries ? "Retake quiz" : "Start quiz";
  row.querySelector("[data-qzst]").textContent =
    live ? `In progress: question ${S.run.i + 1} of ${S.run.ids.length}.` :
    ok ? `✓ Passed with ${r.best} of ${QZ.DAILY} on ${fmtD(parseDate(r.passed))}.` :
    !open ? "Unlocks when every step above is ticked." :
    tries ? `Best so far ${r.best} of ${QZ.DAILY} after ${plural(tries, "try", "tries")}. A retake draws different questions.` :
    "Ready when you are.";
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
    `<button type="button" class="primary" data-slip="${late}">Move Day ${d.day}${d.day < 14 ? "–14" : ""} ${plural(late, "day")} later</button>` +
    `<button type="button" data-slip="skip">Not now</button>` +
    (S.settings.exam ? `<span class="muted">Booked exam: ${fmtD(parseDate(S.settings.exam))}. Pearson VUE lets you reschedule up to 24 h before.</span>` : "");
}
function applySlip(v) {
  if (v === "skip") { S.slipSkip = today(); save(); refresh(); return; }
  const d = overdueDay(), n = +v;
  if (!d || !(n > 0)) return;
  S.slips.push({ from: d.day, n });
  save(); refresh();
  FX.banner("Schedule moved", `Day ${d.day} is today. Day 14 is now ${fmtD(dayDate(14))}.`, "info");
}

// ---------- next up ----------
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
function renderNext() {
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
  const { d } = n;
  const ti = todayIdx();
  const when = d.day < ti ? `<span class="pill warn">from Day ${d.day}</span>` : d.day > ti && ti >= 1 ? `<span class="pill ok">working ahead</span>` : "";
  if (n.quiz) {
    const r = S.quiz[d.id], tries = r ? r.tries.length : 0;
    const live = S.run && S.run.kind === "day" && S.run.day === d.id && !S.run.done;
    el.innerHTML = pre +
      `<div class="nx-h"><span class="nx-k">Next up</span><span>Day ${d.day}</span><span class="tag t-quiz">Quiz</span>${when}</div>` +
      `<div class="nx-t">End-of-day quiz: ${QZ.DAILY} questions, pass at ${QZ.needed(QZ.DAILY)}.</div>` +
      `<div class="nx-n">${QZ.describe(d.day)}. ${live ? `You're on question ${S.run.i + 1}.` : tries ? `Best so far ${r.best} of ${QZ.DAILY}. A retake draws different questions.` : "After each answer you see why each option is right or wrong, and where to study it."}</div>` +
      `<div class="nx-a"><button type="button" class="primary" data-quiz-start="${d.id}">${live ? "Resume quiz" : tries ? "Retake quiz" : "Start quiz"}</button><button type="button" data-nx-day="${d.id}">Show in plan</button></div>`;
    return;
  }
  const { g, it } = n;
  const url = linkFor(g.link);
  el.innerHTML = pre +
    `<div class="nx-h"><span class="nx-k">Next up</span><span>Day ${d.day}</span><span class="tag t-${g.t}">${g.label || TAGS[g.t]}</span>${when}</div>` +
    `<div class="nx-t">${it[1]}</div>` +
    (it[2] ? `<div class="nx-n">${it[2]}</div>` : "") +
    (g.where ? `<div class="where">Where: ${g.where}</div>` : "") +
    `<div class="nx-a">` +
    (url ? `<a class="btn primary" href="${url}" target="_blank" rel="noopener">Open ↗</a>` : "") +
    `<button type="button" data-nx-done="${it[0]}">✓ Mark done</button>` +
    `<button type="button" data-nx-jump="${it[0]}">Show in plan</button></div>`;
}
function jumpTo(id) {
  const { d } = itemIndex[id];
  const det = document.getElementById(d.id);
  det.open = true;
  const li = det.querySelector(`[data-li="${id}"]`);
  li.scrollIntoView({ behavior: "smooth", block: "center" });
  li.classList.remove("flash"); void li.offsetWidth; li.classList.add("flash");
}
function jumpDay(id) {
  const det = document.getElementById(id);
  det.open = true;
  const row = det.querySelector(".quizrow") || det;
  row.scrollIntoView({ behavior: "smooth", block: "center" });
  row.classList.remove("flash"); void row.offsetWidth; row.classList.add("flash");
}

// ---------- ticking & celebrations ----------
function setTick(id, val, srcEl) {
  const { d, g } = itemIndex[id];
  const week = weekOf(d);
  const was = { g: groupDone(g), items: itemsDone(d), d: dayDone(d), w: week.every(dayDone), a: DAYS.every(dayDone) };
  if (val) S.ticks[id] = true; else delete S.ticks[id];
  const cb = root.querySelector(`input[data-id="${id}"]`);
  if (cb) cb.checked = val;
  markDayDone(d);
  save();
  refresh();
  if (!val) return;

  const src = srcEl && srcEl.isConnected ? srcEl : cb;
  const nowDay = dayDone(d);
  if (!was.a && DAYS.every(dayDone)) celebrate("all", d);
  else if (!was.w && week.every(dayDone)) celebrate("week", d);
  else if (!was.d && nowDay) celebrate("day", d);
  else if (!was.g && groupDone(g)) FX.group(src);
  else FX.tick(src);

  const builds = d.groups.filter(x => x.t === "build");
  const cleanup = g.t === "build" && !was.g && builds.every(groupDone);
  if (cleanup) setTimeout(() => whenFree(() => openCleanup(d.id)), nowDay ? 3400 : 1100);
  if (!was.items && itemsDone(d) && !quizOk(d)) setTimeout(() => whenFree(() => promptQuiz(d)), cleanup ? 1300 : 1000);
}
function celebrate(kind, d) {
  const sk = streak();
  const skTxt = sk > 1 ? ` · 🔥 ${sk}-day streak` : "";
  if (kind === "all") { FX.all(); FX.banner("All 14 days done 🚀", "Go pass SAA-C03.", "all"); }
  else if (kind === "week") { FX.week(); FX.banner(`Week ${d.day <= 7 ? 1 : 2} complete 🏆`, (d.day <= 7 ? "Foundation done. Exam prep next." : "Only the exam left.") + skTxt, "week"); }
  else { FX.day(); FX.banner(`Day ${d.day} complete 🎉`, `${DAYS.filter(dayDone).length}/14 days done${skTxt}`, "day"); }
  // fold the finished day and open the next one
  setTimeout(() => {
    const det = document.getElementById(d.id);
    if (det) det.open = false;
    const nx = DAYS.find(x => x.day > d.day && !dayDone(x));
    if (nx) document.getElementById(nx.id).open = true;
  }, 1800);
}

// ---------- scores ----------
function num(k) { const v = S.scores[k]; return v === "" || v == null || isNaN(+v) ? null : +v; }
function verdictHTML() {
  const pe = num("pe");
  const weak = weakestDomain();
  const weakTxt = weak ? ` Focus on <b>Domain ${weak.i + 1} (${weak.name})</b>.` : "";
  if (pe == null) return ["", "Enter your <b>Official Practice Exam</b> score (Day 11) in 📊 Scores to get the go/no-go decision."];
  if (pe < 100 || pe > 1000) return ["", "Practice exam score must be between 100 and 1000."];
  if (pe >= 750) return ["go", `<b>GO</b> — ${pe}/1000. Book the exam for Day 14 (${fmtD(dayDate(14))}).`];
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
document.querySelectorAll("[data-score]").forEach(inp => {
  inp.value = S.scores[inp.dataset.score] ?? "";
  inp.addEventListener("input", () => { S.scores[inp.dataset.score] = inp.value; save(); renderScores(); });
});

// ---------- practice panel ----------
function renderPractice() {
  const t = today();
  const due = QZ.dueIds(S.srs, t).filter(id => QBY[id]).length;
  const book = Object.keys(S.book).filter(id => QBY[id]);
  const open = book.filter(id => !S.book[id].fixed).length;
  const weak = QZ.weakTags(BANK, S.qs)[0];
  const last = S.mocks[S.mocks.length - 1];
  const left = studyDays.filter(d => !dayDone(d)).length;
  const liveMock = S.run && S.run.kind === "mock" && !S.run.done;
  const cards = [
    ["🔁 Review", due ? `${plural(due, "missed question")} due today.` : `Nothing due. Questions you miss come back after ${QZ.SRS_DAYS.join(", ").replace(/, (\d+)$/, " and $1")} days until you get them right three times.`,
      `<button type="button" data-review${due ? ' class="primary"' : " disabled"}>Start review</button>`],
    ["🧪 Mock exam", mockOpen() || liveMock
      ? `${QZ.MOCK.n} questions in ${QZ.MOCK.minutes} minutes, results at the end like the real exam. Each attempt draws different questions.${last ? ` Last: ${last.pct}% on ${fmtD(parseDate(last.at))}.` : ""}`
      : `Unlocks when Days 1–13 are complete (${left} to go).`,
      `<button type="button" data-mock${mockOpen() || liveMock ? ' class="primary"' : " disabled"}>${liveMock ? `Resume (${clock(S.run.end - Date.now())} left)` : "Start mock exam"}</button>`],
    ["⚡ Which service?", `60 seconds of quick picks: a requirement, four services, choose one.${S.drill.best ? ` Your best: ${S.drill.best}.` : ""}`,
      `<button type="button" data-drill${DRILL.length ? "" : " disabled"}>Start drill</button>`],
    ["📓 Wrong-answer notebook", book.length ? `${open} open, ${book.length - open} fixed.` : "Every question you miss lands here with your one-line note.",
      `<button type="button" data-sheet="notebook">Open notebook</button>`],
    ["📈 Weak spots", weak ? `Weakest topic so far: ${esc(weak.tag)} (${pct(weak.right, weak.seen)}% right).` : "Fills in as you answer questions.",
      `<button type="button" data-sheet="weak">Show weak spots</button>`],
    ["🗣 Exam wording", "What phrases like “least operational overhead” usually point to.",
      `<button type="button" data-sheet="cues"${CUES.length ? "" : " disabled"}>Open cheat sheet</button>`]
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
let sel = [];        // options picked for the current question, not yet checked
let intro = null;    // { title, html, go, goLabel } shown before a quiz or mock starts
let drill = null;    // "Which service?" round, kept in memory only

const runTitle = r => r.kind === "day" ? `Day ${dayOf(r.day).day} quiz` : r.kind === "mock" ? "Mock exam" : r.kind === "warm" ? "Warm-up" : "Review";
function head(title, parts, barPct) {
  document.getElementById("qz-title").textContent = title;
  document.getElementById("qz-meta").innerHTML = parts.filter(Boolean).map(p => `<span>${p}</span>`).join("");
  document.getElementById("qz-bar").style.width = Math.max(0, Math.min(100, barPct || 0)) + "%";
}
function openQuiz() {
  renderQuiz();
  if (!qzDlg.open) qzDlg.showModal();
  qzDlg.scrollTop = 0;
}
function renderQuiz() {
  if (intro) return renderIntro();
  if (drill) return renderDrill();
  const r = S.run;
  if (!r) { if (qzDlg.open) qzDlg.close(); return; }
  r.ids = r.ids.filter(id => QBY[id]);
  if (!r.ids.length) { S.run = null; save(); if (qzDlg.open) qzDlg.close(); return; }
  if (r.i >= r.ids.length) r.i = r.ids.length - 1;
  if (r.done) return r.kind === "mock" ? renderMockResult() : renderResult();
  if (r.kind === "mock") return r.view === "grid" ? renderGrid() : renderMockQ();
  renderQ();
}
function startRun(kind, dayId) {
  intro = null;
  if (drill) stopDrill();
  if (S.run && !S.run.done) {
    const same = S.run.kind === kind && (kind !== "day" || S.run.day === dayId);
    if (same || !confirm(`You have an unfinished ${runTitle(S.run).toLowerCase()}. Drop it and start this instead?`)) return openQuiz();
  }
  const t = today();
  const qs = kind === "day" ? QZ.pickDay(dayOf(dayId).day, BANK, S.qs)
    : kind === "mock" ? QZ.pickMock(BANK, S.qs)
    : kind === "warm" ? QZ.pickWarmup(BANK, S.qs, S.srs, t, 5)
    : QZ.pickReview(BANK, S.srs, t, 15);
  if (!qs.length) { if (qzDlg.open) qzDlg.close(); FX.banner("No questions available yet", "", "info"); return; }
  const ord = {};
  qs.forEach(q => { ord[q.id] = QZ.order(q); });
  const now = Date.now();
  S.run = { kind, day: dayId || "", ids: qs.map(q => q.id), ord, ans: {}, flag: {}, i: 0, t0: now, end: kind === "mock" ? now + QZ.MOCK.minutes * 60000 : 0, done: false, view: "" };
  sel = [];
  save(); refresh(); openQuiz();
}
function promptQuiz(d) {
  if (quizOk(d) || (S.run && !S.run.done)) return;
  intro = {
    title: `Day ${d.day} quiz`, goLabel: "Start quiz", go: () => startRun("day", d.id),
    html: `<p class="qz-lead">Every step of Day ${d.day} is ticked. One thing left: the end-of-day quiz.</p><ul class="qz-facts">` +
      `<li>${QZ.DAILY} questions. ${QZ.describe(d.day)}.</li>` +
      `<li>After each answer you see why every option is right or wrong, and exactly where to go back and study it.</li>` +
      `<li>Pass at ${QZ.needed(QZ.DAILY)} of ${QZ.DAILY} (90%) to complete the day. A retake draws different questions.</li></ul>`
  };
  openQuiz();
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
function fbHTML(q, ord, ans) {
  return `<ol class="qz-fb">${ord.map((oi, k) => {
    const right = q.a.includes(oi), mine = ans.includes(oi);
    return `<li class="${right ? "right" : mine ? "wrong" : ""}"><span class="qz-l">${LETTERS[k]}</span><div><div class="qz-t">${q.o[oi]}${mine ? ' <span class="mine">your answer</span>' : ""}</div><div class="qz-why">${right ? "✓ " : mine ? "✗ " : ""}${q.x[oi]}</div></div></li>`;
  }).join("")}</ol>`;
}
// Show where to watch or read first (Skill Builder), then hands-on, then self-checks.
const REF_ORDER = { watch: 0, prep: 0, play: 1, build: 2, check: 3, setup: 4 };
const studyRefs = q => q.ref.filter(id => itemIndex[id]).sort((a, b) => REF_ORDER[itemIndex[a].g.t] - REF_ORDER[itemIndex[b].g.t]);
function refHTML(id, extra = "") {
  const { d, g, it } = itemIndex[id];
  const url = linkFor(g.link);
  return `<li><div class="ref-h">${extra}<span class="tag t-${g.t}">${g.label || TAGS[g.t]}</span><span class="muted">Day ${d.day}</span></div><div class="ref-t">${it[1]}</div>` +
    (g.where ? `<div class="where">${g.where}</div>` : "") +
    `<div class="ref-a">${url ? `<a class="btn sm" href="${url}" target="_blank" rel="noopener">Open ↗</a>` : ""}<button type="button" class="sm" data-jump="${id}">Show in plan</button></div></li>`;
}
function studyHTML(q) {
  const refs = studyRefs(q);
  const doc = q.doc && DOCS[q.doc];
  if (!refs.length && !doc) return "";
  return `<div class="qz-study"><div class="qz-sh">Where to study this</div><ul class="qz-refs">${refs.map(id => refHTML(id)).join("")}</ul>` +
    (doc ? `<div class="qz-doc">AWS page: <a href="${doc[1]}" target="_blank" rel="noopener">${doc[0]} ↗</a></div>` : "") + `</div>`;
}
const answerHTML = q => `<ul class="qz-ans">${q.a.map(i => `<li><b>✓ ${q.o[i]}</b><div class="qz-why">${q.x[i]}</div></li>`).join("")}</ul>`;
const noteHTML = q => `<label class="qz-note">Why did you miss it? One line for your notebook.<input type="text" maxlength="300" data-note="${q.id}" value="${esc((S.book[q.id] || {}).note || "")}" placeholder="e.g. mixed up gateway and interface endpoints"></label>`;
const optsHTML = (q, ord, on) => `<div class="qz-opts">${ord.map((oi, k) => `<button type="button" class="qz-o${on.includes(oi) ? " on" : ""}" data-o="${oi}" aria-pressed="${on.includes(oi)}"><span class="qz-l">${LETTERS[k]}</span><span class="qz-t">${q.o[oi]}</span></button>`).join("")}</div>`;

// Record an answer everywhere it matters: stats, spaced repetition, notebook.
function learn(q, ok) {
  const t = today();
  QZ.record(S.qs, q.id, ok, t);
  if (ok) {
    QZ.srsHit(S.srs, q.id, t);
    if (S.book[q.id]) S.book[q.id].fixed = true;
  } else {
    QZ.srsMiss(S.srs, q.id, t);
    const b = S.book[q.id] || (S.book[q.id] = { at: t, misses: 0, note: "", fixed: false });
    b.misses++; b.at = t; b.fixed = false;
  }
}

// ---------- quizzes: day, review, warm-up (feedback after every answer) ----------
function renderQ() {
  const r = S.run, id = r.ids[r.i], q = QBY[id], ord = r.ord[id] || QZ.order(q), ans = r.ans[id];
  r.ord[id] = ord;
  const answered = Object.keys(r.ans).filter(k => QBY[k]);
  const right = answered.filter(k => QZ.isRight(QBY[k], r.ans[k])).length;
  head(runTitle(r), [`Question ${r.i + 1} of ${r.ids.length}`, `<span class="ok">✓ ${right}</span>`, `<span class="bad">✗ ${answered.length - right}</span>`], answered.length / r.ids.length * 100);
  if (!ans) {
    const multi = q.a.length > 1;
    qzBody.innerHTML = `<div class="qz-q">${q.q}</div>${optsHTML(q, ord, sel)}` +
      `<div class="qz-a"><span class="muted">${multi ? "Pick two, then check." : "Pick one, then check."} Keys A–${LETTERS[ord.length - 1]} and Enter work too.</span>` +
      `<button type="button" class="primary" data-qz="check"${sel.length === q.a.length ? "" : " disabled"}>Check answer</button></div>`;
  } else {
    const ok = QZ.isRight(q, ans);
    const keyL = ord.map((oi, k) => q.a.includes(oi) ? LETTERS[k] : "").filter(Boolean).join(" and ");
    qzBody.innerHTML = `<div class="qz-q">${q.q}</div>` +
      `<div class="qz-verdict ${ok ? "ok" : "bad"}" role="status">${ok ? "✓ Correct." : `✗ Not quite. The answer is ${keyL}.`}</div>` +
      fbHTML(q, ord, ans) + studyHTML(q) + (ok ? "" : noteHTML(q)) +
      `<div class="qz-a"><button type="button" class="primary" data-qz="next">${r.i + 1 < r.ids.length ? "Next question →" : "See results"}</button></div>`;
  }
}
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
  if (q.a.length === 1) sel = [oi];
  else if (sel.includes(oi)) sel = sel.filter(x => x !== oi);
  else if (sel.length < q.a.length) sel.push(oi);
  renderQ();
  refocus(sel.length === q.a.length ? '[data-qz="check"]' : `[data-o="${oi}"]`);
}
function check() {
  const r = S.run, id = r.ids[r.i], q = QBY[id];
  if (r.ans[id] || sel.length !== q.a.length) return;
  r.ans[id] = sel.slice();
  sel = [];
  const ok = QZ.isRight(q, r.ans[id]);
  learn(q, ok);
  FX.sound(ok ? "pop" : "miss");
  save(); renderQ();
  refocus('[data-qz="next"]');
  qzBody.querySelector(".qz-verdict").scrollIntoView({ block: "nearest" });
}
function nextQ() {
  const r = S.run;
  if (!r.ans[r.ids[r.i]]) return;
  if (r.i + 1 < r.ids.length) { r.i++; sel = []; save(); renderQ(); qzDlg.scrollTop = 0; refocus(".qz-o"); }
  else finishRun();
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
    FX.sound(QZ.passed(r.score, r.ids.length) ? "chime" : "miss");
  }
  if (r.kind === "warm") S.warm[t] = "done";
  save(); refresh(); renderQuiz();
  qzDlg.scrollTop = 0;
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
function renderResult() {
  const r = S.run, n = r.ids.length;
  const missed = r.ids.filter(id => !QZ.isRight(QBY[id], r.ans[id])).map(id => QBY[id]);
  head(runTitle(r), ["Results"], 100);
  if (r.kind === "day") {
    const d = dayOf(r.day), pass = QZ.passed(r.score, n);
    qzBody.innerHTML = `<div class="qz-res ${pass ? "ok" : "bad"}"><div class="qz-score">${r.score} <small>of ${n}</small></div>` +
      `<div>${pass ? (r.cel ? `Passed. Day ${d.day} is complete.` : "Passed.") : `You need ${QZ.needed(n)} to pass. A retake draws different questions, and the ones you missed come back for review over the next days.`}</div></div>` +
      missedHTML(missed) +
      `<div class="qz-a">${pass
        ? `<button type="button" class="primary" data-qz="finish">${r.cel ? `Finish Day ${d.day} 🎉` : "Close"}</button>`
        : `<button type="button" data-qz="finish">Close</button><button type="button" class="primary" data-qz="retake">Retake with new questions</button>`}</div>`;
  } else {
    qzBody.innerHTML = `<div class="qz-res ${missed.length ? "" : "ok"}"><div class="qz-score">${r.score} <small>of ${n}</small></div>` +
      `<div>${missed.length ? "The ones you missed come back in a few days." : "All right. Nice."}</div></div>` + missedHTML(missed) +
      `<div class="qz-a"><button type="button" class="primary" data-qz="finish">Close</button></div>`;
  }
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
  save(); refresh();
  if (qzDlg.open) { renderQuiz(); qzDlg.scrollTop = 0; }
  if (auto) { FX.banner("Time is up", "Your mock exam was submitted.", "info"); if (!qzDlg.open) whenFree(openQuiz); }
}
function renderMockResult() {
  const r = S.run, res = r.res;
  head("Mock exam", ["Results"], 100);
  const doms = ["Secure", "Resilient", "High-performing", "Cost-optimized"];
  const prev = S.mocks.slice(0, -1).map(m => m.pct + "%");
  const cls = res.pct >= 80 ? "ok" : res.pct >= 72 ? "mid" : "bad";
  const msg = cls === "ok" ? "A comfortable margin. Keep your rhythm until exam day."
    : cls === "mid" ? "Close to the line. Work through the misses below and your weakest domain."
    : "Not there yet. Work through the misses below, then the weak-spot map.";
  const list = r.ids.map((id, i) => ({ q: QBY[id], i, ok: QZ.isRight(QBY[id], r.ans[id]) })).filter(x => !r.only || !x.ok);
  qzBody.innerHTML = `<div class="qz-res ${cls}"><div class="qz-score">${res.pct}% <small>${res.score} of ${res.n} in ${r.mins} min</small></div><div>${msg}</div></div>` +
    `<p class="muted">The real exam reports a scaled score from 100 to 1000 (720 to pass), and AWS doesn't publish how right answers map to it, so treat this percentage as a rough guide. Aim for 80% or more here.${prev.length ? ` Earlier mocks: ${prev.join(", ")}.` : ""}</p>` +
    `<div class="dom-bars">${res.dom.map(([a, n], i) => bar(`D${i + 1} ${doms[i]}`, pct(a, n), `${a}/${n}`)).join("")}</div>` +
    `<div class="mk-rev-h"><h3 class="sub-h">Review</h3><label class="chk"><input type="checkbox" data-only${r.only ? " checked" : ""}> Only the ones I got wrong</label></div>` +
    `<ol class="qz-missed">${list.map(x => `<li value="${x.i + 1}" class="${x.ok ? "right" : "wrong"}"><details><summary>${x.ok ? "✓" : "✗"} ${x.q.q}</summary>${fbHTML(x.q, r.ord[x.q.id] || QZ.order(x.q), r.ans[x.q.id] || [])}${studyHTML(x.q)}</details></li>`).join("") || "<li>Nothing wrong. 🎉</li>"}</ol>` +
    `<div class="qz-a"><button type="button" class="primary" data-qz="finish">Close</button></div>`;
}

// ---------- "Which service?" drill ----------
function startDrill() {
  if (!DRILL.length) return;
  if (S.run && !S.run.done && qzDlg.open) qzDlg.close();
  intro = null;
  stopDrill();
  drill = { end: Date.now() + 60000, items: QZ.shuffle(DRILL), i: 0, score: 0, n: 0, missed: [], lock: false, done: false, opts: [] };
  drillNext();
  if (!qzDlg.open) qzDlg.showModal();
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
  save(); renderDrill(); renderPractice();
  FX.sound("chime");
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
  if (go) { S.run.i = +go.dataset.go; S.run.view = ""; save(); renderQuiz(); qzDlg.scrollTop = 0; return; }
  const j = e.target.closest("[data-jump]");
  if (j) { qzDlg.close(); jumpTo(j.dataset.jump); return; }
  const b = e.target.closest("[data-qz]");
  if (!b) return;
  const a = b.dataset.qz, r = S.run;
  if (a === "close") qzDlg.close();
  else if (a === "go") { const fn = intro.go; intro = null; fn(); }
  else if (a === "check") check();
  else if (a === "next") nextQ();
  else if (a === "finish") finishResults();
  else if (a === "retake") { const day = r.day; S.run = null; startRun("day", day); }
  else if (a === "prev") { r.i = Math.max(0, r.i - 1); save(); renderMockQ(); }
  else if (a === "mnext") { r.i = Math.min(r.ids.length - 1, r.i + 1); save(); renderMockQ(); qzDlg.scrollTop = 0; }
  else if (a === "flag") { const id = r.ids[r.i]; if (r.flag[id]) delete r.flag[id]; else r.flag[id] = 1; save(); renderMockQ(); }
  else if (a === "grid") { r.view = "grid"; save(); renderGrid(); qzDlg.scrollTop = 0; }
  else if (a === "back") { r.view = ""; save(); renderMockQ(); }
  else if (a === "finish-mock") finishMock(false);
});
qzDlg.addEventListener("change", e => {
  if (e.target.matches("[data-only]")) { S.run.only = e.target.checked; save(); renderMockResult(); }
});
// Listen on the document: re-rendering removes the focused button, which drops focus to <body>.
document.addEventListener("keydown", e => {
  if (!qzDlg.open || e.target.matches("input,textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (drill && !drill.done) {
    const n = k.length === 1 ? Math.max("1234".indexOf(k), "abcd".indexOf(k)) : -1;
    if (n >= 0) { e.preventDefault(); drillPick(n); }
    return;
  }
  const r = S.run;
  if (intro || !r || r.done) return;
  const n = k.length === 1 ? Math.max("12345".indexOf(k), "abcde".indexOf(k)) : -1;
  if (n >= 0) {
    const opt = qzBody.querySelectorAll(".qz-opts .qz-o")[n];
    if (opt) { e.preventDefault(); opt.click(); }
    return;
  }
  if (r.kind === "mock") {
    if (k === "arrowright" || k === "enter") { const nb = qzBody.querySelector('[data-qz="mnext"]'); if (nb) { e.preventDefault(); nb.click(); } }
    else if (k === "arrowleft") { e.preventDefault(); qzBody.querySelector('[data-qz="prev"]')?.click(); }
    else if (k === "f") { e.preventDefault(); qzBody.querySelector('[data-qz="flag"]')?.click(); }
    return;
  }
  if (k === "enter") {
    const p = qzBody.querySelector('[data-qz="check"]:not([disabled]),[data-qz="next"]');
    if (p) { e.preventDefault(); p.click(); }
  }
});
qzDlg.addEventListener("close", () => {
  intro = null;
  if (drill) stopDrill();
  if (S.run && S.run.done) finishResults();
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

// ---------- notebook, weak spots, cheat sheet ----------
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
  const [title, html] = kind === "notebook" ? ["📓 Wrong-answer notebook", notebookHTML()] : kind === "weak" ? ["📈 Weak spots", weakHTML()] : ["🗣 Exam wording", cuesHTML()];
  document.getElementById("sh-title").textContent = title;
  shBody.innerHTML = html;
}
function bookEntries() {
  return Object.keys(S.book).filter(id => QBY[id]).map(id => ({ q: QBY[id], b: S.book[id] }))
    .sort((x, y) => (x.b.at < y.b.at ? 1 : x.b.at > y.b.at ? -1 : y.b.misses - x.b.misses));
}
function notebookHTML() {
  const all = bookEntries();
  if (!all.length) return `<p class="muted">Empty for now. Every question you miss in a quiz, review or mock exam lands here, with a line for why you missed it.</p>`;
  const open = all.filter(e => !e.b.fixed), fixed = all.filter(e => e.b.fixed);
  const list = nbFilter === "open" ? open : nbFilter === "fixed" ? fixed : all;
  return `<div class="seg">${[["open", `Open (${open.length})`], ["fixed", `Fixed (${fixed.length})`], ["all", `All (${all.length})`]].map(([k, l]) => `<button type="button" data-nb="${k}" aria-pressed="${nbFilter === k}">${l}</button>`).join("")}<button type="button" class="nb-exp" data-nb-export>Export as Markdown</button></div>` +
    `<p class="muted">Fixed means you answered it right after missing it. Day 12 and the morning of the exam are for this list.</p>` +
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
  if (!w.length && !shaky.length) return `<p class="muted">Nothing yet. This fills in as you answer quiz questions and mark self-checks as shaky.</p>`;
  let h = "";
  if (dom.some(x => x[1])) h += `<h3 class="sub-h">By exam domain</h3><div class="dom-bars">${dom.map(([a, n], i) => n ? bar(`D${i + 1} ${DOMAINS[i]}`, pct(a, n), `${pct(a, n)}%`) : "").join("")}</div>`;
  if (w.length) h += `<h3 class="sub-h">By topic, weakest first</h3><p class="muted">Share of answers right, counting every attempt. Open a topic to see where to study it.</p>` +
    `<ul class="wk">${w.map(t => `<li><details><summary><span class="wk-t">${esc(t.tag)}</span><span class="tr"><span class="fi${t.acc < 0.7 ? " low" : ""}" style="width:${Math.round(t.acc * 100)}%"></span></span><span class="wk-n">${t.right}/${t.seen}</span></summary>` +
      `<ul class="qz-refs">${t.refs.filter(id => itemIndex[id]).map(id => refHTML(id)).join("")}</ul></details></li>`).join("")}</ul>`;
  if (shaky.length) h += `<h3 class="sub-h">Self-checks you marked shaky</h3><ul class="qz-refs">${shaky.map(id => refHTML(id)).join("")}</ul>`;
  return h;
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

// ---------- events: plan ----------
root.addEventListener("change", e => {
  const id = e.target.dataset && e.target.dataset.id;
  if (id) { FX.unlock(); setTick(id, e.target.checked, e.target); }
});
root.addEventListener("click", e => {
  const g = e.target.closest(".g");
  if (g) { e.preventDefault(); g.classList.toggle("show"); return; }
  const cl = e.target.closest("[data-cleanup]");
  if (cl) { openCleanup(cl.dataset.cleanup); return; }
  const fl = e.target.closest("[data-flip]");
  if (fl) {
    const panel = document.getElementById("ca-" + fl.dataset.flip);
    panel.hidden = !panel.hidden;
    fl.setAttribute("aria-expanded", String(!panel.hidden));
    return;
  }
  const cf = e.target.closest("[data-conf]");
  if (cf) {
    const id = cf.dataset.cid;
    S.conf[id] = cf.dataset.conf;
    const fb = root.querySelector(`[data-flip="${id}"]`);
    fb.textContent = flipLabel(id);
    fb.classList.toggle("shaky", S.conf[id] === "shaky");
    document.getElementById("ca-" + id).hidden = true;
    fb.setAttribute("aria-expanded", "false");
    FX.unlock();
    if (!done(id)) setTick(id, true, cf.isConnected ? cf : fb);
    else { save(); refresh(); }
  }
});
const noteTimers = {};
root.addEventListener("input", e => {
  const id = e.target.dataset && e.target.dataset.notes;
  if (!id) return;
  S.notes[id] = e.target.value;
  clearTimeout(noteTimers[id]);
  noteTimers[id] = setTimeout(() => {
    save();
    const s = root.querySelector(`[data-saved="${id}"]`);
    if (s) { s.classList.add("show"); setTimeout(() => s.classList.remove("show"), 1200); }
  }, 400);
});
document.addEventListener("click", e => {
  if (!e.target.closest(".g")) document.querySelectorAll(".g.show").forEach(x => x.classList.remove("show"));
}, true);

document.getElementById("next").addEventListener("click", e => {
  const b = e.target.closest("[data-nx-done]");
  if (b) { FX.unlock(); setTick(b.dataset.nxDone, true, b); return; }
  const j = e.target.closest("[data-nx-jump]");
  if (j) { jumpTo(j.dataset.nxJump); return; }
  const dj = e.target.closest("[data-nx-day]");
  if (dj) { jumpDay(dj.dataset.nxDay); return; }
  const w = e.target.closest("[data-warm]");
  if (w) {
    if (w.dataset.warm === "skip") { S.warm[today()] = "skip"; save(); refresh(); }
    else { FX.unlock(); startRun("warm"); }
  }
});
// buttons that can appear anywhere: plan, next up, practice panel, slip banner, dialogs
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
const bFx = document.getElementById("b-fx"), bSnd = document.getElementById("b-snd"), bHide = document.getElementById("hide");
function syncToggles() {
  bFx.textContent = `🎉 Effects ${S.settings.fx ? "on" : "off"}`;
  bFx.setAttribute("aria-pressed", S.settings.fx);
  bSnd.textContent = `${S.settings.sound ? "🔔" : "🔕"} Sound ${S.settings.sound ? "on" : "off"}`;
  bSnd.setAttribute("aria-pressed", S.settings.sound);
  document.body.classList.toggle("hide-done", !!S.settings.hideDone);
  bHide.textContent = S.settings.hideDone ? "Show done" : "Hide done";
  FX.set({ fx: S.settings.fx, sound: S.settings.sound });
}
bFx.onclick = () => { S.settings.fx = !S.settings.fx; save(); syncToggles(); if (S.settings.fx) FX.tick(bFx); };
bSnd.onclick = () => { S.settings.sound = !S.settings.sound; save(); syncToggles(); if (S.settings.sound) { FX.unlock(); FX.sound("pop"); } };
bHide.onclick = () => { S.settings.hideDone = !S.settings.hideDone; save(); syncToggles(); };
document.getElementById("exp").onclick = () => document.querySelectorAll("details.day").forEach(d => d.open = true);
document.getElementById("col").onclick = () => document.querySelectorAll("details.day").forEach(d => d.open = false);

// ---------- settings ----------
const setDlg = document.getElementById("settings");
function renderSettingsInfo() {
  const sl = document.getElementById("s-slips");
  const moved = S.slips.reduce((a, s) => a + s.n, 0);
  sl.hidden = !moved;
  document.getElementById("s-slips-t").textContent = moved ? `The schedule has been moved ${plural(moved, "day")} later in total. Day 14 is ${fmtD(dayDate(14))}.` : "";
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
  S.settings.portal = document.getElementById("s-portal").value.trim();
  S.settings.fx = document.getElementById("s-fx").checked;
  S.settings.sound = document.getElementById("s-snd").checked;
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
    S = merge(clone(DEF), JSON.parse(t));
    save(); setDlg.close("x"); rebuild(); restoreScores();
    FX.banner("Progress imported", "", "info");
  }).catch(() => alert("That file isn't a valid progress export."));
  fileIn.value = "";
};
document.getElementById("s-reset").onclick = () => {
  if (!confirm("Clear all ticks, notes, scores and quiz history? (Settings are kept.)")) return;
  const keep = S.settings;
  S = clone(DEF); S.settings = keep;
  save(); setDlg.close("x"); rebuild(); restoreScores();
};
function restoreScores() { document.querySelectorAll("[data-score]").forEach(inp => { inp.value = S.scores[inp.dataset.score] ?? ""; }); }

// ---------- focus timer ----------
const tm = document.getElementById("timer");
const tmLeft = () => S.timer.running ? Math.max(0, Math.round((S.timer.endAt - Date.now()) / 1000)) : S.timer.left;
const mmss = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
// Credit focused time to the day you're working on (the one Next up points at).
function logFocus() {
  const t = S.timer;
  if (t.mode !== "focus" || !t.running) return;
  const sec = (t.from || DUR.focus) - tmLeft();
  const n = nextStep();
  if (sec < 30 || !n) return;
  S.log[n.d.id] = (S.log[n.d.id] || 0) + sec / 60;
}
function tmRender() {
  const t = S.timer, left = tmLeft();
  tm.classList.toggle("running", t.running);
  tm.classList.toggle("break", t.mode === "break");
  tm.classList.toggle("min", !!t.min);
  tm.querySelector(".tm-mode").textContent = t.mode === "focus" ? "50-minute focus" : "10-minute break";
  tm.querySelector(".tm-time").textContent = mmss(left);
  tm.querySelector('[data-tm="toggle"]').textContent = t.running ? "Pause" : left === DUR[t.mode] ? "Start" : "Resume";
  tm.querySelector('[data-tm="switch"]').textContent = t.mode === "focus" ? "Break" : "Focus";
  tm.querySelector('[data-tm="min"]').textContent = t.min ? "+" : "–";
  document.title = t.running ? `${mmss(left)} ${t.mode === "focus" ? "🎯" : "☕"} · SAA-C03 Plan` : "SAA-C03 Plan";
}
function tmSet(mode) { S.timer.mode = mode; S.timer.running = false; S.timer.left = DUR[mode]; save(); tmRender(); }
tm.addEventListener("click", e => {
  const b = e.target.closest("[data-tm]");
  const a = b ? b.dataset.tm : e.target.closest(".tm-time") && S.timer.min ? "min" : null;
  if (!a) return;
  const t = S.timer;
  if (a === "toggle") {
    if (t.running) { logFocus(); t.left = tmLeft(); t.running = false; }
    else { FX.unlock(); t.from = t.left; t.endAt = Date.now() + t.left * 1000; t.running = true; }
  } else if (a === "reset") { logFocus(); t.running = false; t.left = DUR[t.mode]; }
  else if (a === "switch") { logFocus(); tmSet(t.mode === "focus" ? "break" : "focus"); refresh(); return; }
  else if (a === "min") { t.min = !t.min; }
  save(); tmRender();
  if (a !== "min") refresh();
});
setInterval(() => {
  if (S.timer.running && tmLeft() <= 0) {
    logFocus();
    const next = S.timer.mode === "focus" ? "break" : "focus";
    FX.sound("timer");
    FX.banner(next === "break" ? "Break time ☕" : "Back to work 🎯", next === "break" ? "10 minutes. Stand up, drink water." : "50 minutes of focus.", "info");
    tmSet(next);
    refresh();
  }
  if (S.timer.running) tmRender();
}, 1000);

// ---------- server sync (only when served by the Go backend; otherwise browser-only) ----------
// localStorage stays the working copy. The server keeps one revisioned document; on a
// conflict the newer save wins, so two browsers converge instead of silently diverging.
let pushT = 0;
function syncLater() {
  sync.dirty = true;
  syncMeta();
  if (!sync.on) return;
  clearTimeout(pushT);
  pushT = setTimeout(push, 800);
}
async function push() {
  if (sync.busy) { sync.again = true; return; }
  sync.busy = true;
  try {
    const r = await fetch("api/state", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rev: sync.rev, doc: S }) });
    if (r.ok) { sync.rev = (await r.json()).rev; sync.dirty = false; syncMeta(); }
    else if (r.status === 409) resolve(await r.json());
  } catch (e) { /* offline: stays dirty, retried on the next save or focus */ }
  sync.busy = false;
  if (sync.again) { sync.again = false; push(); }
}
function resolve(cur) {
  if (!cur.doc) { sync.rev = cur.rev; push(); return; }
  if (sync.dirty && (S.savedAt || 0) >= (cur.doc.savedAt || 0)) { sync.rev = cur.rev; sync.busy = false; push(); return; }
  S = merge(clone(DEF), cur.doc);
  sync.rev = cur.rev; sync.dirty = false;
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  syncMeta();
  if (!document.querySelector("dialog[open]")) { rebuild(); restoreScores(); tmRender(); }
}
async function pull() {
  if (document.querySelector("dialog[open]")) return;
  let cur;
  try {
    const r = await fetch("api/state", { cache: "no-store" });
    if (!r.ok || !(r.headers.get("Content-Type") || "").includes("application/json")) return;
    cur = await r.json();
  } catch (e) { return; }
  sync.on = true;
  if (cur.rev === sync.rev) { if (sync.dirty) push(); return; }
  if (!cur.doc) { sync.rev = cur.rev; push(); return; }
  resolve(cur);
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") pull(); });

// ---------- boot ----------
function rebuild() {
  render(); renderLinks(); syncToggles(); refresh();
  const ti = todayIdx();
  const td = DAYS.find(d => d.day === ti);
  const target = td && !dayDone(td) ? td : DAYS.find(d => !dayDone(d));
  if (target) document.getElementById(target.id).open = true;
}
// stay correct past midnight without reloading
let lastIdx = todayIdx(), lastDate = today();
setInterval(() => { if (todayIdx() !== lastIdx || today() !== lastDate) { lastIdx = todayIdx(); lastDate = today(); refresh(); } }, 60000);

// Days ticked off before quizzes existed count as done once their quiz is passed.
DAYS.forEach(markDayDone);
document.getElementById("places").open = Object.keys(S.ticks).length === 0;
rebuild();
tmRender();
if (S.run && S.run.kind === "mock" && !S.run.done && Date.now() >= S.run.end) finishMock(true);
pull();
})();
