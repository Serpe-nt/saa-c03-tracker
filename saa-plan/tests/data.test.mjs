// Checks the content files: plan, question pools, flip cards, drill, cheat sheet, key points. Run: node --test tests/
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { load, pageScripts, SITE } from "./load.mjs";

const scripts = pageScripts();
const W = load(...scripts.filter(s => s !== "app.js" && s !== "fx.js"));
const items = {};
for (const d of W.PLAN) if (d.id) for (const g of d.groups) for (const it of g.items) items[it[0]] = { day: d.day, t: g.t };
const TAGS = new Set(W.QTAGS);
const Q = W.QUIZ;
const DAYS = W.PLAN.filter(d => d.id);
const TP = W.QZ.topics(W.PLAN, W.STEP_TAGS);
const taught = new Set(Object.values(W.STEP_TAGS).flat());

test("every quiz file in site/quiz is loaded by the page", () => {
  const files = fs.readdirSync(path.join(SITE, "quiz")).filter(f => f.endsWith(".js")).map(f => "quiz/" + f);
  for (const f of files) assert.ok(scripts.includes(f), `${f} is not in index.html`);
  assert.ok(scripts.indexOf("quiz/meta.js") < scripts.indexOf("quiz/d01.js"), "meta.js must load before the pools");
  assert.ok(scripts.indexOf("qcore.js") < scripts.indexOf("app.js"));
});

test("question ids are unique and well-formed", () => {
  const seen = new Set();
  for (const q of Q) {
    assert.match(q.id, /^(q\d\d|m\d)-\d{3}$/, q.id);
    assert.ok(!seen.has(q.id), `duplicate id ${q.id}`);
    seen.add(q.id);
  }
});

test("the plan is a run of days numbered from 1, with unique step ids", () => {
  DAYS.forEach((d, i) => { assert.equal(d.day, i + 1, d.id); assert.equal(d.id, "d" + d.day); });
  assert.ok(W.PLAN[0].week, "the plan starts with a week");
  const seen = new Set();
  for (const d of DAYS) for (const g of d.groups) {
    assert.ok(["watch", "play", "prep", "build", "check", "setup"].includes(g.t), `${d.id}: type ${g.t}`);
    if (g.link && g.link !== "own") assert.ok(W.LINKS[g.link], `${d.id}: unknown link ${g.link}`);
    for (const it of g.items) {
      assert.match(it[0], /^[a-z]\d+[a-z]\d*$/, it[0]);
      assert.ok(!seen.has(it[0]), `duplicate step id ${it[0]}`);
      seen.add(it[0]);
    }
  }
  assert.ok(Number.isInteger(W.MOCK_AFTER) && W.MOCK_AFTER >= 1 && W.MOCK_AFTER < DAYS.length, "MOCK_AFTER names a day before the last");
});

test("each day's quiz kind is one the quiz engine knows", () => {
  for (const d of DAYS) if ("quiz" in d) assert.match(d.quiz, /^(tags|review|weak|exam|dom:[1-4](,[1-4])*)$/, d.id);
  assert.ok(!W.QZ.hasQuiz(DAYS[DAYS.length - 1]), "no quiz on exam day");
});

test("step topics name real steps and real topics, and every topic is taught somewhere", () => {
  for (const [id, tags] of Object.entries(W.STEP_TAGS)) {
    assert.ok(items[id], `STEP_TAGS: unknown step ${id}`);
    assert.ok(tags.length, id);
    for (const t of tags) assert.ok(TAGS.has(t), `STEP_TAGS ${id}: unknown topic "${t}"`);
  }
  // spread: arrays made inside the sandbox have their own prototype, which deepEqual rejects
  assert.deepEqual([...W.QTAGS.filter(t => !taught.has(t))], [], "a question on a topic no step teaches has nowhere to send you back to");
});

test("each day of new material has enough questions of its own", () => {
  const study = Q.filter(q => q.day !== "mock");
  for (const d of DAYS) {
    if (d.quiz !== "tags") continue;
    const own = W.QZ.dayPool(d, TP, Q).length;
    const sofar = study.filter(q => q.tags.every(t => TP[d.id].sofar.has(t))).length;
    assert.ok(own >= 45, `Day ${d.day}: ${own} questions on its own topics; need 30 per quiz plus room for a different retake`);
    assert.ok(sofar >= own, `Day ${d.day}`);
  }
});

test("mock pool covers two full exams in the exam guide's domain split", () => {
  const mock = Q.filter(q => q.day === "mock");
  assert.ok(mock.length >= 130, `mock pool has ${mock.length}`);
  const per = [1, 2, 3, 4].map(d => mock.filter(q => q.dom === d).length);
  [20, 17, 15, 13].forEach((need, i) => assert.ok(per[i] >= need * 2, `domain ${i + 1}: ${per[i]} mock questions`));
});

test("every question is structurally valid", () => {
  const problems = [];
  const bad = (q, m) => problems.push(`${q.id}: ${m}`);
  for (const q of Q) {
    const mock = q.day === "mock";
    if (!mock && !(Number.isInteger(q.day) && q.day >= 1)) bad(q, "day");   // a pool number, not a plan day
    if (!mock && q.id.slice(1, 3) !== String(q.day).padStart(2, "0")) bad(q, "id prefix vs day");
    if (![1, 2, 3, 4].includes(q.dom)) bad(q, "dom");
    if (!Array.isArray(q.tags) || q.tags.length < 1 || q.tags.length > 2) bad(q, "tags count");
    (q.tags || []).forEach(t => { if (!TAGS.has(t)) bad(q, `unknown tag ${t}`); });
    const two = /\(Choose two\.\)\s*$/.test(q.q);
    if (q.o.length !== (two ? 5 : 4)) bad(q, "option count");
    if (q.a.length !== (two ? 2 : 1)) bad(q, "answer count");
    if (new Set(q.a).size !== q.a.length || q.a.some(i => !(i >= 0 && i < q.o.length))) bad(q, "answer index");
    if (new Set(q.o).size !== q.o.length) bad(q, "duplicate option");
    if (!Array.isArray(q.x) || q.x.length !== q.o.length || q.x.some(x => typeof x !== "string" || x.length < 25)) bad(q, "explanations");
    if (!Array.isArray(q.ref) || q.ref.length > 3) bad(q, "ref count");
    q.ref.forEach(r => { if (!items[r]) bad(q, `unknown ref ${r}`); });
    if (!taught.has(q.tags[0])) bad(q, `no step teaches its main topic ${q.tags[0]}`);
    if ("doc" in q && !W.DOCS[q.doc]) bad(q, `unknown doc ${q.doc}`);
    const text = [q.q, ...q.o, ...q.x].join(" ");
    if (/all of the above|none of the above|both [a-e] and|option [a-e]\b/i.test(text)) bad(q, "positional wording (options are shuffled)");
    const tags = (text.match(/<\/?([a-z]+)/gi) || []).map(t => t.replace(/[</]/g, "").toLowerCase()).filter(t => t !== "code");
    if (tags.length) bad(q, `HTML other than <code>: ${tags.join(",")}`);
  }
  assert.deepEqual(problems, []);
});

test("each card's own question (KEYS[id].q) is valid, and unlike every bank question and every other card's", () => {
  // written for its card and asked only there: the same shape as a bank question, without id, day and ref
  const norm = s => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
  const stems = new Map(Q.map(q => [norm(q.q), q.id]));
  const closed = /Snowball|Snowcone|Snowmobile|Snow Family|FSx File Gateway|Timestream for LiveAnalytics|OpsWorks|CodeCommit|Cloud9|QLDB|S3 Select|CloudSearch|Data Pipeline|EC2-Classic|Kinesis Data Firehose|Kinesis Data Analytics/i;
  const problems = [];
  for (const [id, e] of Object.entries(W.KEYS)) {
    const q = e.q;
    if (!q) continue;
    const bad = m => problems.push(`${id}.q: ${m}`);
    if (typeof q.q !== "string" || q.q.length < 30) { bad("stem"); continue; }
    if (!Array.isArray(q.o) || !Array.isArray(q.a) || !Array.isArray(q.x)) { bad("o, a and x must be arrays"); continue; }
    // a question on exam technique or the plan itself leaves out both: it is about no exam topic and no domain
    if (("dom" in q) !== ("tags" in q)) bad("dom and tags go together: both, or neither for exam technique");
    if ("dom" in q && ![1, 2, 3, 4].includes(q.dom)) bad("dom");
    if ("tags" in q && (!Array.isArray(q.tags) || q.tags.length < 1 || q.tags.length > 2 || q.tags.some(t => !TAGS.has(t)))) bad("tags: 1–2 from QTAGS");
    const two = /\(Choose two\.\)\s*$/.test(q.q);
    if (q.o.length !== (two ? 5 : 4)) bad("option count");
    if (q.a.length !== (two ? 2 : 1)) bad("answer count");
    if (new Set(q.a).size !== q.a.length || q.a.some(i => !(i >= 0 && i < q.o.length))) bad("answer index");
    if (new Set(q.o).size !== q.o.length) bad("duplicate option");
    if (q.x.length !== q.o.length || q.x.some(x => typeof x !== "string" || x.length < 25)) bad("explanations: one per option, 25+ characters");
    if ("doc" in q && !W.DOCS[q.doc]) bad(`unknown doc ${q.doc}`);
    const text = [q.q, ...q.o, ...q.x].join(" ");
    if (/all of the above|none of the above|both [a-e] and|option [a-e]\b/i.test(text)) bad("positional wording (options are shuffled)");
    const tags = (text.match(/<\/?([a-z]+)/gi) || []).map(t => t.replace(/[</]/g, "").toLowerCase()).filter(t => t !== "code");
    if (tags.length) bad(`HTML other than <code>: ${tags.join(",")}`);
    if (q.a.some(i => closed.test(q.o[i] || ""))) bad("the right answer names a closed service");
    const k = norm(q.q);
    if (stems.has(k)) bad(`same stem as ${stems.get(k)}`); else stems.set(k, `card ${id}`);
  }
  assert.deepEqual(problems, []);
});

test("every step is a rewritten card: a headline, why it exists, and its own question", () => {
  const missing = Object.keys(items).filter(id => { const e = W.KEYS[id]; return !e || !e.head || !e.why || !e.q; });
  assert.deepEqual([...missing], []);
});

test("no correct answer relies on a retired or closed service", () => {
  const closed = /Snowball|Snowcone|Snowmobile|Snow Family|FSx File Gateway|Timestream for LiveAnalytics|OpsWorks|CodeCommit|Cloud9|QLDB|S3 Select|CloudSearch|Data Pipeline|EC2-Classic|Kinesis Data Firehose|Kinesis Data Analytics/i;
  // spread: arrays made inside the sandbox have their own prototype, which deepEqual rejects
  const hits = [...Q.filter(q => q.a.some(i => closed.test(q.o[i]))).map(q => q.id)];
  assert.deepEqual(hits, []);
});

test("no two questions share a stem", () => {
  const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
  const seen = new Map(), dups = [];
  for (const q of Q) { const k = norm(q.q); if (seen.has(k)) dups.push(`${seen.get(k)} = ${q.id}`); else seen.set(k, q.id); }
  assert.deepEqual(dups, []);
});

test("doc links point at aws.amazon.com or docs.aws.amazon.com over HTTPS", () => {
  for (const [k, [label, url]] of Object.entries(W.DOCS)) {
    assert.ok(label.length > 3, k);
    assert.match(url, /^https:\/\/(docs\.)?aws\.amazon\.com\//, k);
  }
});

test("every self-check item has a model answer", () => {
  const checks = Object.keys(items).filter(id => items[id].t === "check");
  for (const id of checks) assert.ok(W.CARDS[id] && W.CARDS[id].length > 80, `missing card for ${id}`);
  for (const id of Object.keys(W.CARDS)) assert.ok(items[id], `card for unknown item ${id}`);
});

test("drill and cheat sheet entries are well-formed", () => {
  assert.ok(W.DRILL.length >= 100);
  const reqs = new Set();
  for (const d of W.DRILL) {
    assert.equal(d.length, 4, JSON.stringify(d));
    const [req, ans, wrong, why] = d;
    assert.ok(req.length > 10 && req.length <= 110, req);
    assert.equal(wrong.length, 3, req);
    assert.ok(!wrong.includes(ans) && new Set(wrong).size === 3, req);
    assert.ok(why.length > 10, req);
    assert.ok(!reqs.has(req), `duplicate drill item: ${req}`);
    reqs.add(req);
  }
  assert.ok(W.CUES.length >= 30);
  for (const c of W.CUES) assert.equal(c.length, 3, JSON.stringify(c));
});

// ---------- step cards: key points, score fields, exam-wording links ----------
const keyFiles = fs.readdirSync(path.join(SITE, "keys")).filter(f => f.endsWith(".js"));

test("every key-points file in site/keys is loaded by the page, before the app", () => {
  for (const f of keyFiles) assert.ok(scripts.includes("keys/" + f), `keys/${f} is not in index.html`);
  assert.ok(scripts.indexOf("keys/" + keyFiles[0]) < scripts.indexOf("app.js"));
});

test("key points are well-formed and filed under their step's id", () => {
  // dNN.js holds the steps whose id starts with dN, cN.js a lecture course (cN…) and its labs (lN…), rN.js a reading block
  const home = id => { const m = /^([a-z])(\d+)/.exec(id); return m[1] === "d" ? "d" + m[2].padStart(2, "0") + ".js" : m[1] === "c" || m[1] === "l" ? "c" + m[2] + ".js" : m[1] + m[2] + ".js"; };
  const problems = [];
  for (const f of keyFiles) {
    const K = load("keys/" + f).KEYS;
    for (const [id, e] of Object.entries(K)) {
      const bad = m => problems.push(`${f} ${id}: ${m}`);
      if (!items[id]) { bad("unknown step id"); continue; }
      if (home(id) !== f) bad(`belongs in keys/${home(id)}`);
      const k = e.k || [];
      if (!k.length && !e.trap) bad("needs k or trap");
      // a point is [label, text]; a bare string is the older form, allowed only until the entry gets its "why"
      if (k.length > ("why" in e ? 6 : 5)) bad("too many points");
      k.forEach((p, i) => {
        if (typeof p === "string") { if ("why" in e) bad(`k[${i}] needs a label: [label, text]`); if (p.length < 40 || p.length > 260) bad(`k[${i}] length ${p.length}`); return; }
        if (!Array.isArray(p) || p.length !== 2 || typeof p[0] !== "string" || typeof p[1] !== "string") return bad(`k[${i}] must be [label, text]`);
        if (p[0].length < 2 || p[0].length > 40 || /[.:]$/.test(p[0])) bad(`k[${i}] label "${p[0]}" (2–40 characters, no closing full stop or colon)`);
        if (p[1].length < 40 || p[1].length > 260) bad(`k[${i}] text length ${p[1].length}`);
      });
      if ("why" in e && (typeof e.why !== "string" || e.why.length < 80 || e.why.length > 420)) bad(`why length ${String(e.why).length}`);
      if ("trap" in e && (typeof e.trap !== "string" || e.trap.length < 40 || e.trap.length > 280)) bad(`trap length ${String(e.trap).length}`);
      // the article fields of a rewritten card: a plain headline, the idea that answers the why, and for a step you
      // carry out its numbered actions and how you know it worked
      if ("head" in e && (typeof e.head !== "string" || e.head.length < 8 || e.head.length > 80 || /[<>]|[.:]$/.test(e.head))) bad(`head "${e.head}" (8–80 characters, plain text, no closing full stop or colon)`);
      if ("idea" in e && (typeof e.idea !== "string" || e.idea.length < 40 || e.idea.length > 300)) bad(`idea length ${String(e.idea).length}`);
      if (("idea" in e || "do" in e) && !("head" in e)) bad("idea and do belong to a rewritten card, which has a head");
      if ("do" in e && (!Array.isArray(e.do) || e.do.length < 1 || e.do.length > 8 || e.do.some(s => typeof s !== "string" || s.length < 10 || s.length > 240))) bad("do must be 1–8 actions of 10–240 characters");
      if ("done" in e && (!("do" in e) || typeof e.done !== "string" || e.done.length < 20 || e.done.length > 260)) bad(`done (20–260 characters, only with do)`);
      const text = [e.why || "", e.idea || "", ...(e.do || []), e.done || "", ...k.flat(), e.trap || ""].join(" ");
      const tags = (text.match(/<\/?([a-z]+)/gi) || []).map(t => t.replace(/[</]/g, "").toLowerCase()).filter(t => t !== "code" && t !== "b");
      if (tags.length) bad(`HTML other than <b> and <code>: ${tags.join(",")}`);
      const docs = e.docs || [];
      if (docs.length > 3) bad("more than 3 docs");
      for (const d of docs) {
        if (d.length !== 2 || String(d[0]).length < 4) bad("doc must be [title, url]");
        else if (!/^https:\/\/(docs\.)?aws\.amazon\.com\/\S+$/.test(d[1])) bad(`doc url ${d[1]}`);
      }
    }
  }
  assert.deepEqual(problems, []);
});

test("every Watch, Play, Build and Self-check step has key points", () => {
  const missing = Object.keys(items).filter(id => ["watch", "play", "build", "check"].includes(items[id].t) && !W.KEYS[id]);
  assert.deepEqual(missing, []);
});

test("every card starts with why: the problem or need comes before the details", () => {
  // spread: arrays made inside the sandbox have their own prototype, which deepEqual rejects
  assert.deepEqual([...Object.keys(W.KEYS).filter(id => !W.KEYS[id].why)], [], "entries without a why");
  const bare = Object.keys(W.CARDS).filter(id => !/^<b>Why[^<]{0,40}:<\/b>/.test(W.CARDS[id]));
  assert.deepEqual([...bare], [], "model answers that do not open with a <b>Why …:</b> line");
});

test("key points don't send the learner to a retired or closed service without saying so", () => {
  // A closed service may be named only together with its status.
  const closed = /Snowball|Snowcone|Snowmobile|Snow Family|FSx File Gateway|Timestream for LiveAnalytics|OpsWorks|CodeCommit|Cloud9|QLDB|S3 Select|CloudSearch|Data Pipeline|EC2-Classic|Kinesis Data Firehose|Kinesis Data Analytics/i;
  const status = /closed|no longer|end of support|ends|retired|formerly|legacy|older|not available|instead/i;
  const hits = [];
  for (const [id, e] of Object.entries(W.KEYS)) for (const s of [e.head || "", e.why || "", e.idea || "", ...(e.do || []), e.done || "", ...(e.k || []).map(p => (Array.isArray(p) ? p.join(": ") : p)), e.trap || ""]) if (closed.test(s) && !status.test(s)) hits.push(`${id}: ${s}`);
  assert.deepEqual(hits, []);
});

test("score fields and the verdict sit on steps that exist", () => {
  const html = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
  for (const [id, key] of Object.entries(W.SCORE_AT)) {
    assert.ok(items[id], `SCORE_AT: unknown step ${id}`);
    assert.ok(html.includes(`data-score="${key}"`), `SCORE_AT: no 📊 Scores field "${key}"`);
  }
  for (const d of W.PLAN) if (d.decision) assert.equal(items[d.decision]?.day, d.day, `Day ${d.day}: decision must name one of its own steps`);
});

test("exam-wording phrases are linked to real phrases and real topics", () => {
  const phrases = new Set(W.CUES.map(c => c[0]));
  for (const [phrase, tags] of Object.entries(W.CUE_TAGS)) {
    assert.ok(phrases.has(phrase), `CUE_TAGS: no such phrase "${phrase}"`);
    for (const t of tags) assert.ok(TAGS.has(t), `CUE_TAGS: unknown topic "${t}" for "${phrase}"`);
  }
  for (const p of phrases) assert.ok(W.CUE_TAGS[p], `CUE_TAGS: "${p}" has no topics`);
});

test("results GIFs: at least five per outcome, GIPHY ids, a description each, no repeats", () => {
  const seen = new Set();
  assert.deepEqual(Object.keys(W.GIFS).sort(), ["ace", "fail", "pass"]);
  for (const [o, list] of Object.entries(W.GIFS)) {
    assert.ok(list.length >= 5, `GIFS.${o}: ${list.length}, want 5 or more in rotation`);
    for (const [id, alt] of list) {
      assert.match(id, /^[A-Za-z0-9]{8,24}$/, `GIFS.${o}: ${id}`);
      assert.ok(typeof alt === "string" && alt.length > 3 && !/[<>]/.test(alt), `GIFS.${o} ${id}: describe it, plain text`);
      assert.ok(!seen.has(id), `GIFS: ${id} twice`);
      seen.add(id);
    }
  }
});

// ---------- course diagrams and look-alikes (docs/diagrams.md) ----------
const MARKUP = /<(?!\/?(b|code)>)[^>]*>/;
const ID = /^[a-z0-9-]+$/;
test("every diagram file in site/diagrams is loaded by the page, and diagram.js after them", () => {
  const files = fs.readdirSync(path.join(SITE, "diagrams")).filter(f => f.endsWith(".js")).map(f => "diagrams/" + f);
  for (const f of files) assert.ok(scripts.includes(f), `${f} is not in index.html`);
  assert.ok(scripts.includes("lookalikes.js"), "lookalikes.js is not in index.html");
  for (const f of files) assert.ok(scripts.indexOf(f) < scripts.indexOf("app.js"));
});
test("diagrams: shape, ids, inside the canvas, no overlapping nodes, labels fit, parts written like key points", () => {
  for (const [key, dg] of Object.entries(W.DIAGRAMS || {})) {
    const at = `DIAGRAMS.${key}`;
    assert.match(key, /^c[1-8]$/, `${at}: key is a lecture course (c1–c8)`);
    assert.ok(typeof dg.title === "string" && dg.title.length <= 80, `${at}: title`);
    assert.ok(typeof dg.why === "string" && dg.why.length >= 80 && dg.why.length <= 420 && !MARKUP.test(dg.why), `${at}: why is 80–420 characters`);
    assert.ok(dg.w > 0 && dg.w <= 24 && dg.h > 0 && dg.h <= 16, `${at}: canvas at most 24 × 16`);
    const boxes = [...(dg.areas || []), ...(dg.nodes || [])], ids = new Set();
    for (const b of boxes) {
      assert.ok(ID.test(b.id) && !ids.has(b.id), `${at}: id "${b.id}" well-formed and unique`);
      ids.add(b.id);
      assert.ok(b.x >= 0 && b.y >= 0 && b.w > 0 && b.h > 0 && b.x + b.w <= dg.w + 1e-9 && b.y + b.h <= dg.h + 1e-9, `${at}: ${b.id} inside the canvas`);
      assert.ok(typeof b.label === "string" && b.label.length >= 1, `${at}: ${b.id} has a label`);
    }
    for (const a of dg.areas || []) {
      assert.ok(a.label.length <= 40, `${at}: area ${a.id} label ≤ 40`);
      if (a.kind) assert.ok(["public", "private", "onprem", "edge"].includes(a.kind), `${at}: area ${a.id} kind`);
    }
    const U = W.DG.U, nodes = dg.nodes || [];
    for (const n of nodes) {
      assert.ok(n.label.length <= 28, `${at}: node ${n.id} label ≤ 28`);
      const ls = W.DG.lines(n.label, n.w * U - 12, 12.5);
      assert.ok(ls.length * 15 <= n.h * U - 4 && ls.every(l => l.length * 12.5 * 0.55 <= n.w * U - 8), `${at}: node ${n.id} label fits its box (${ls.join(" / ")})`);
    }
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const apart = a.x + a.w <= b.x + 0.05 || b.x + b.w <= a.x + 0.05 || a.y + a.h <= b.y + 0.05 || b.y + b.h <= a.y + 0.05;
      assert.ok(apart, `${at}: nodes ${a.id} and ${b.id} overlap`);
    }
    for (const l of dg.links || []) {
      assert.ok(Array.isArray(l) && ids.has(l[0]) && ids.has(l[1]) && l[0] !== l[1], `${at}: link ${JSON.stringify(l)} joins two existing boxes`);
      if (l[2] !== undefined) assert.ok(typeof l[2] === "string" && l[2].length <= 18, `${at}: link label ≤ 18`);
    }
    const parts = Object.entries(dg.parts || {});
    assert.ok(parts.length >= 6, `${at}: at least 6 clickable parts`);
    for (const [id, p] of parts) {
      const pa = `${at}.parts.${id}`;
      assert.ok(ids.has(id), `${pa}: no area or node with that id`);
      assert.ok(typeof p.name === "string" && p.name.length <= 40, `${pa}: name ≤ 40`);
      assert.ok(typeof p.why === "string" && p.why.length >= 60 && p.why.length <= 320, `${pa}: why is 60–320 characters (${(p.why || "").length})`);
      assert.ok(Array.isArray(p.k || []) && (p.k || []).length <= 3 && (p.k || []).every(x => Array.isArray(x) && x.length === 2 && x[1].length <= 220), `${pa}: up to 3 [label, text] points`);
      if (p.trap !== undefined) assert.ok(typeof p.trap === "string" && p.trap.length <= 260, `${pa}: trap ≤ 260`);
      assert.ok(Array.isArray(p.tags) && p.tags.length >= 1 && p.tags.every(t => TAGS.has(t)), `${pa}: tags from QTAGS`);
      for (const s of [p.name, p.why, p.trap || "", ...(p.k || []).flat()]) assert.ok(!MARKUP.test(s), `${pa}: only <b> and <code> markup`);
    }
  }
});
test("look-alikes: shape, rows that line up with the columns, tags, links", () => {
  const ids = new Set();
  for (const e of W.LOOKALIKES || []) {
    const at = `LOOKALIKES ${e.id}`;
    assert.ok(ID.test(e.id) && !ids.has(e.id), `${at}: id well-formed and unique`);
    ids.add(e.id);
    assert.ok(typeof e.title === "string" && e.title.length <= 60, `${at}: title ≤ 60`);
    assert.ok(typeof e.why === "string" && e.why.length >= 60 && e.why.length <= 360, `${at}: why 60–360`);
    assert.ok(Array.isArray(e.cols) && e.cols.length >= 2 && e.cols.length <= 4 && e.cols.every(c => typeof c === "string" && c.length <= 24), `${at}: 2–4 columns`);
    assert.ok(Array.isArray(e.match) && e.match.length === e.cols.length && e.match.every(m => Array.isArray(m) && m.length && m.every(w => typeof w === "string" && w.length >= 2)), `${at}: match words for every column`);
    assert.ok(Array.isArray(e.rows) && e.rows.length >= 3 && e.rows.length <= 6, `${at}: 3–6 rows`);
    for (const r of e.rows) assert.ok(Array.isArray(r) && r.length === e.cols.length + 1 && r.every(c => typeof c === "string" && c.length <= 220 && !MARKUP.test(c)), `${at}: row "${r[0]}" has a label and one cell per column (≤ 220, only <b>/<code>)`);
    assert.equal(e.rows[0][0], "What it's for", `${at}: first row`);
    assert.equal(e.rows[e.rows.length - 1][0], "Exam cue", `${at}: last row`);
    assert.ok(Array.isArray(e.tags) && e.tags.length >= 1 && e.tags.every(t => TAGS.has(t)), `${at}: tags from QTAGS`);
    assert.ok(Array.isArray(e.docs || []) && (e.docs || []).length <= 3 && (e.docs || []).every(d => /^https:\/\/(docs\.)?aws\.amazon\.com\//.test(d[1])), `${at}: up to 3 AWS docs`);
  }
});

// The same rule as laFor() in app.js: a right option names one column's service and a wrong option another,
// each match word whole (no letter or digit touching it). Guards the match words: a table nothing links to is never seen.
test("look-alikes: missed questions link to every table", () => {
  const rx = w => new RegExp(`(?<![A-Za-z0-9])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z0-9])`, "i");
  const plain = t => String(t).replace(/<[^>]+>/g, " ");
  const linked = new Set();
  for (const e of W.LOOKALIKES || []) {
    const cols = t => e.match.map((ws, i) => (ws.some(w => rx(w).test(plain(t))) ? i : -1)).filter(i => i >= 0);
    let n = 0;
    for (const q of W.QUIZ) {
      const rc = q.a.map(i => cols(q.o[i])), wc = q.o.map((o, i) => (q.a.includes(i) ? [] : cols(o)));
      if (rc.some(r => wc.some(w => r.some(i => w.some(j => i !== j))))) { n++; linked.add(q.id); }
    }
    assert.ok(n >= 3, `LOOKALIKES ${e.id}: only ${n} questions link to it`);
  }
  assert.ok(linked.size >= 150, `only ${linked.size} questions link to a look-alike table`);
});

test("billable things: kinds with a name and how they bill, steps that are Build steps", () => {
  const B = W.BILLABLE;
  assert.ok(B && B.kinds && B.steps, "window.BILLABLE");
  for (const [k, v] of Object.entries(B.kinds)) assert.ok(/^[a-z0-9]{2,8}$/.test(k) && typeof v[0] === "string" && v[0].length <= 24 && typeof v[1] === "string" && v[1].length <= 160 && !/[<>$€£]|\d+\s*(?:cents?|USD)/.test(v[1]), `kind ${k}: name, how it bills, no markup and no prices`);
  assert.ok(B.kinds.other, "a kind for anything else");
  const build = new Map();
  for (const d of W.PLAN) if (d.id) for (const g of d.groups) for (const it of g.items) build.set(it[0], g.t);
  for (const [id, ks] of Object.entries(B.steps)) {
    assert.equal(build.get(id), "build", `${id} is a Build step`);
    assert.ok(Array.isArray(ks) && ks.length && ks.every(k => B.kinds[k] && k !== "other"), `${id}: known kinds`);
  }
});
