(() => {
"use strict";

const PLAN = window.PLAN, LINKS = window.LINKS, GLOSS = window.GLOSSARY, CLEANUP = window.CLEANUP;
const KEY = "saa-plan-v2";
const DEF = {
  ticks: {}, notes: {}, scores: {}, dayDone: {},
  settings: { start: "2026-10-12", portal: "", fx: true, sound: true, hideDone: false },
  timer: { mode: "focus", running: false, endAt: 0, left: 50 * 60, min: matchMedia("(max-width:640px)").matches }
};
const DUR = { focus: 50 * 60, break: 10 * 60 };
const TAGS = { watch: "Watch", play: "Play", prep: "Exam prep", build: "Build", check: "Self-check", setup: "Setup" };
const DOMAINS = ["Secure", "Resilient", "High-performing", "Cost"];

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
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

// ---------- indexes ----------
const DAYS = PLAN.filter(d => d.id);
const itemIndex = {};
DAYS.forEach(d => d.groups.forEach((g, gi) => {
  g.key = d.id + "g" + gi;
  g.items.forEach(it => { itemIndex[it[0]] = { d, g, it }; });
}));
const done = id => !!S.ticks[id];
const gIds = g => g.items.map(i => i[0]);
const dIds = d => d.groups.flatMap(gIds);
const groupDone = g => gIds(g).every(done);
const dayDone = d => dIds(d).every(done);
const groupLeft = g => { const ids = gIds(g); return (g.min || 0) * ids.filter(i => !done(i)).length / ids.length; };
const dayLeft = d => d.groups.reduce((a, g) => a + groupLeft(g), 0);
const weekOf = d => DAYS.filter(x => (x.day <= 7) === (d.day <= 7));

// ---------- dates & formatting ----------
function parseDate(s) { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, (m || 1) - 1, d || 1); }
function dayDate(n) { const d = parseDate(S.settings.start); d.setDate(d.getDate() + n - 1); return d; }
function midnight(d = new Date()) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
const todayIdx = () => Math.round((midnight() - parseDate(S.settings.start)) / 864e5) + 1;
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fmtD = d => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const fmtH = m => m < 1 ? "0 min" : m < 60 ? `${Math.round(m / 5) * 5 || 5} min` : `${Math.round(m / 30) / 2} h`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const strip = h => { const t = document.createElement("div"); t.innerHTML = h; return t.textContent; };
function linkFor(key) {
  if (!key) return null;
  if (key === "own") return S.settings.portal || LINKS.console.url;
  return LINKS[key] ? LINKS[key].url : null;
}

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
function renderDay(d) {
  const det = document.createElement("details");
  det.className = "day"; det.id = d.id;
  let h = `<summary><span class="dn"><small>Day</small>${d.day}</span><span class="dd"></span><span class="tt">${d.title}</span><span class="today-badge">Today</span><span class="ct"></span></summary><div class="body"><p class="goal">${d.goal}</p>`;
  for (const g of d.groups) {
    const url = linkFor(g.link);
    h += `<div class="grp" data-g="${g.key}"><div class="gh"><span class="tag t-${g.t}">${g.label || TAGS[g.t]}</span>`;
    if (g.min) h += `<span class="gm">~${fmtH(g.min)}</span>`;
    if (url) h += `<a class="btn open" href="${url}" target="_blank" rel="noopener">Open ↗</a>`;
    h += `</div>`;
    if (g.where) h += `<div class="where">Where: ${g.where}</div>`;
    h += `<ul>`;
    for (const [id, txt, note] of g.items) {
      h += `<li data-li="${id}"><label><input type="checkbox" data-id="${id}"${done(id) ? " checked" : ""}><span class="txt">${txt}${note ? `<span class="n">${note}</span>` : ""}</span></label></li>`;
    }
    h += `</ul></div>`;
  }
  if (d.decision) h += `<div class="verdict" data-verdict></div>`;
  const hasBuild = d.groups.some(g => g.t === "build");
  if (hasBuild) h += `<div class="tools"><button type="button" data-cleanup="${d.id}">🧹 Cleanup check</button></div>`;
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
    total += ids.length; dn += k;
    det.querySelector(".dd").textContent = fmtD(dayDate(d.day));
    det.querySelector(".ct").textContent = k === ids.length ? "✓ done" : `${k} of ${ids.length}, ~${fmtH(dayLeft(d))} left`;
    det.dataset.complete = k === ids.length ? "1" : "0";
    det.dataset.today = d.day === ti ? "1" : "0";
    for (const g of d.groups) det.querySelector(`[data-g="${g.key}"]`).dataset.done = groupDone(g) ? "1" : "0";
  }
  const p = total ? Math.round(dn / total * 100) : 0;
  document.getElementById("bar").style.width = p + "%";
  const daysDone = DAYS.filter(dayDone).length;
  document.getElementById("pct").textContent = `${dn} of ${total} steps, ${daysDone} of 14 days`;
  document.getElementById("tb-pct").textContent = p + "%";
  document.getElementById("tb-sheet").textContent = ti < 1 ? "Not started" : ti > 14 ? "Finished" : `Day ${ti} of 14`;
  document.getElementById("tb-exam").textContent = fmtD(dayDate(14));

  // status line
  const st = [];
  const examD = dayDate(14);
  if (ti < 1) {
    st.push(`<span>Starts <b>${fmtD(dayDate(1))}</b> (in ${1 - ti} day${1 - ti === 1 ? "" : "s"})</span>`);
  } else if (ti > 14) {
    st.push(`<span>Plan period ended ${fmtD(examD)}</span>`);
  } else {
    const td = DAYS[ti - 1];
    st.push(`<span><b>Today:</b> ${td.title}</span>`);
    st.push(dayDone(td) ? `<span class="pill ok">Today done</span>` : `<span>~${fmtH(dayLeft(td))} left today</span>`);
    const overdue = DAYS.filter(d => d.day < ti).reduce((a, d) => a + dayLeft(d), 0);
    if (overdue > 0) st.push(`<span class="pill ${overdue > 180 ? "bad" : "warn"}">Behind: ~${fmtH(overdue)} from earlier days</span>`);
    else if (DAYS.some(d => d.day > ti && dIds(d).some(done))) st.push(`<span class="pill ok">Ahead of plan</span>`);
    else st.push(`<span class="pill ok">On track</span>`);
  }
  const daysToExam = Math.round((examD - midnight()) / 864e5);
  if (daysToExam >= 0) st.push(`<span>${daysToExam ? `Exam in <b>${daysToExam} day${daysToExam === 1 ? "" : "s"}</b>` : "<b>Exam today</b>"}</span>`);
  const sk = streak();
  if (sk > 0) st.push(`<span>🔥 ${sk}-day streak</span>`);
  document.getElementById("status").innerHTML = st.join("");

  renderNext();
  renderScores();
}

// ---------- next up ----------
function nextItem() {
  for (const d of DAYS) for (const g of d.groups) for (const it of g.items) if (!done(it[0])) return { d, g, it };
  return null;
}
function renderNext() {
  const el = document.getElementById("next");
  const n = nextItem();
  if (!n) {
    el.className = "next all-done";
    el.innerHTML = "Every step ticked. 🚀 Go pass SAA-C03.";
    return;
  }
  el.className = "next";
  const { d, g, it } = n;
  const url = linkFor(g.link);
  const ti = todayIdx();
  const when = d.day < ti ? `<span class="pill warn">from Day ${d.day}</span>` : d.day > ti && ti >= 1 ? `<span class="pill ok">working ahead</span>` : "";
  el.innerHTML =
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

// ---------- ticking & celebrations ----------
function setTick(id, val, srcEl) {
  const { d, g } = itemIndex[id];
  const week = weekOf(d);
  const was = { g: groupDone(g), d: dayDone(d), w: week.every(dayDone), a: DAYS.every(dayDone) };
  if (val) S.ticks[id] = true; else delete S.ticks[id];
  const cb = root.querySelector(`input[data-id="${id}"]`);
  if (cb) cb.checked = val;
  if (dayDone(d)) { if (!S.dayDone[d.id]) S.dayDone[d.id] = iso(new Date()); }
  else delete S.dayDone[d.id];
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
  if (g.t === "build" && !was.g && builds.every(groupDone)) setTimeout(() => openCleanup(d.id), nowDay ? 3400 : 1100);
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
function renderScores() {
  const [cls, html] = verdictHTML();
  document.querySelectorAll("[data-verdict]").forEach(el => { el.className = "verdict " + cls; el.innerHTML = html; });
  const weak = weakestDomain();
  const bars = [];
  for (let i = 0; i < 4; i++) {
    const v = num("b" + (i + 1));
    if (v == null) continue;
    bars.push(`<div class="db${weak && weak.i === i ? " weak" : ""}"><span>D${i + 1} ${DOMAINS[i]}</span><span class="tr"><span class="fi" style="width:${Math.max(0, Math.min(100, v))}%;display:block"></span></span><span>${v}%</span></div>`);
  }
  document.getElementById("dom-bars").innerHTML = bars.join("");
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

// ---------- events: plan ----------
root.addEventListener("change", e => {
  const id = e.target.dataset && e.target.dataset.id;
  if (id) { FX.unlock(); setTick(id, e.target.checked, e.target); }
});
root.addEventListener("click", e => {
  const g = e.target.closest(".g");
  if (g) { e.preventDefault(); g.classList.toggle("show"); return; }
  const cl = e.target.closest("[data-cleanup]");
  if (cl) openCleanup(cl.dataset.cleanup);
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
  if (j) jumpTo(j.dataset.nxJump);
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
document.getElementById("b-set").onclick = () => {
  document.getElementById("s-start").value = S.settings.start;
  document.getElementById("s-portal").value = S.settings.portal;
  document.getElementById("s-fx").checked = S.settings.fx;
  document.getElementById("s-snd").checked = S.settings.sound;
  setDlg.returnValue = "";
  setDlg.showModal();
};
setDlg.addEventListener("close", () => {
  if (setDlg.returnValue !== "save") return;
  const start = document.getElementById("s-start").value;
  if (start) S.settings.start = start;
  S.settings.portal = document.getElementById("s-portal").value.trim();
  S.settings.fx = document.getElementById("s-fx").checked;
  S.settings.sound = document.getElementById("s-snd").checked;
  save(); rebuild();
});
document.getElementById("s-export").onclick = () => {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `saa-plan-progress-${iso(new Date())}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
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
  if (!confirm("Clear all ticks, notes and scores? (Settings are kept.)")) return;
  const keep = S.settings;
  S = clone(DEF); S.settings = keep;
  save(); setDlg.close("x"); rebuild(); restoreScores();
};
function restoreScores() { document.querySelectorAll("[data-score]").forEach(inp => { inp.value = S.scores[inp.dataset.score] ?? ""; }); }

// ---------- focus timer ----------
const tm = document.getElementById("timer");
const tmLeft = () => S.timer.running ? Math.max(0, Math.round((S.timer.endAt - Date.now()) / 1000)) : S.timer.left;
const mmss = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
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
    if (t.running) { t.left = tmLeft(); t.running = false; }
    else { FX.unlock(); t.endAt = Date.now() + t.left * 1000; t.running = true; }
  } else if (a === "reset") { t.running = false; t.left = DUR[t.mode]; }
  else if (a === "switch") { tmSet(t.mode === "focus" ? "break" : "focus"); return; }
  else if (a === "min") { t.min = !t.min; }
  save(); tmRender();
});
setInterval(() => {
  if (S.timer.running && tmLeft() <= 0) {
    const next = S.timer.mode === "focus" ? "break" : "focus";
    FX.sound("timer");
    FX.banner(next === "break" ? "Break time ☕" : "Back to work 🎯", next === "break" ? "10 minutes. Stand up, drink water." : "50 minutes of focus.", "info");
    tmSet(next);
  }
  if (S.timer.running) tmRender();
}, 1000);

// ---------- boot ----------
function rebuild() {
  render(); renderLinks(); syncToggles(); refresh();
  const ti = todayIdx();
  const today = DAYS.find(d => d.day === ti);
  const target = today && !dayDone(today) ? today : DAYS.find(d => !dayDone(d));
  if (target) document.getElementById(target.id).open = true;
}
// stay correct past midnight without reloading
let lastIdx = todayIdx();
setInterval(() => { if (todayIdx() !== lastIdx) { lastIdx = todayIdx(); refresh(); } }, 60000);

document.getElementById("places").open = Object.keys(S.ticks).length === 0;
rebuild();
tmRender();
})();
