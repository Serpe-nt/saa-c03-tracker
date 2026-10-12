// Checks the content files: question pools, flip cards, drill, cheat sheet. Run: node --test tests/
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

test("each study day has a pool big enough for retakes with new questions", () => {
  for (const day of [1, 2, 3, 4, 5, 6, 8, 9, 10, 11]) {
    const n = Q.filter(q => q.day === day).length;
    assert.ok(n >= 45, `Day ${day} has ${n} questions; need 30 per quiz plus room for a different retake`);
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
    if (!mock && !(Number.isInteger(q.day) && q.day >= 1 && q.day <= 11)) bad(q, "day");
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
    if (!q.ref.length || q.ref.length > 3) bad(q, "ref count");
    q.ref.forEach(r => {
      if (!items[r]) bad(q, `unknown ref ${r}`);
      else if (!mock && items[r].day > q.day) bad(q, `ref ${r} is from a later day`);
    });
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

test("doc links point at aws.amazon.com over HTTPS", () => {
  for (const [k, [label, url]] of Object.entries(W.DOCS)) {
    assert.ok(label.length > 3, k);
    assert.match(url, /^https:\/\/aws\.amazon\.com\//, k);
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
