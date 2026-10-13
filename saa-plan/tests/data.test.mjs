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
      if (k.length > 5) bad("more than 5 points");
      k.forEach((s, i) => { if (typeof s !== "string" || s.length < 40 || s.length > 260) bad(`k[${i}] length ${String(s).length}`); });
      if ("trap" in e && (typeof e.trap !== "string" || e.trap.length < 40 || e.trap.length > 280)) bad(`trap length ${String(e.trap).length}`);
      const text = [...k, e.trap || ""].join(" ");
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

test("key points don't send the learner to a retired or closed service without saying so", () => {
  // A closed service may be named only together with its status.
  const closed = /Snowball|Snowcone|Snowmobile|Snow Family|FSx File Gateway|Timestream for LiveAnalytics|OpsWorks|CodeCommit|Cloud9|QLDB|S3 Select|CloudSearch|Data Pipeline|EC2-Classic|Kinesis Data Firehose|Kinesis Data Analytics/i;
  const status = /closed|no longer|end of support|ends|retired|formerly|legacy|older|not available|instead/i;
  const hits = [];
  for (const [id, e] of Object.entries(W.KEYS)) for (const s of [...(e.k || []), e.trap || ""]) if (closed.test(s) && !status.test(s)) hits.push(`${id}: ${s}`);
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
