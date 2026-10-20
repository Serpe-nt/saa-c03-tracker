// Unit tests for site/qcore.js. Run: node --test tests/
import test from "node:test";
import assert from "node:assert/strict";
import { load } from "./load.mjs";

const { QZ } = load("qcore.js");

// Seeded random so failures are reproducible.
function seeded(seed = 1) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
const TAGS = ["A", "B", "C", "D", "E"];
function q(id, day, dom, tag = TAGS[0], n = 4) {
  return { id, day, dom, tags: [tag], q: id, o: Array.from({ length: n }, (_, i) => "o" + i), a: n === 5 ? [1, 3] : [0], x: [], ref: ["r1", "r2"] };
}
function bank() {
  const b = [];
  for (const day of [1, 2, 3, 4, 5, 6, 8, 9, 10, 11])
    for (let i = 1; i <= 50; i++) b.push(q(`q${String(day).padStart(2, "0")}-${String(i).padStart(3, "0")}`, day, (i % 4) + 1, TAGS[i % 5]));
  for (let i = 1; i <= 130; i++) b.push(q(`m${i <= 65 ? 1 : 2}-${String(i).padStart(3, "0")}`, "mock", i <= 40 ? 1 : i <= 74 ? 2 : i <= 104 ? 3 : 4));
  return b;
}
const ids = qs => qs.map(x => x.id);
// Values made inside the sandbox have its own prototypes; compare plain copies.
const plain = x => JSON.parse(JSON.stringify(x));

// A small plan: new material on Days 1, 2 and 4, a review on Day 3, then the exam-prep kinds, and a last day without a quiz.
const day = (n, quiz, steps) => ({ id: "d" + n, day: n, quiz, groups: [{ items: steps.map(id => [id, id]) }] });
const PLAN = [{ week: "Week 1" }, day(1, "tags", ["s1"]), day(2, "tags", ["s2", "s3"]), day(3, "review", ["s0"]), day(4, "tags", ["s4"]),
  day(5, "dom:1,2", []), day(6, "weak", []), day(7, "exam", []), day(8, undefined, ["s9"])];
const STEP_TAGS = { s1: ["A"], s2: ["B"], s3: ["C"], s4: ["D", "E"] };
const TP = QZ.topics(PLAN, STEP_TAGS);
const D = n => PLAN.find(d => d.day === n);

test("pass mark is 24 of 30", () => {
  assert.equal(QZ.needed(30), 24);
  assert.ok(QZ.passed(24, 30));
  assert.ok(!QZ.passed(23, 30));
});

test("each day knows its own topics and everything taught up to it", () => {
  assert.deepEqual([...TP.d1.own], ["A"]);
  assert.deepEqual([...TP.d2.own].sort(), ["B", "C"]);
  assert.deepEqual([...TP.d2.sofar].sort(), ["A", "B", "C"]);
  assert.deepEqual([...TP.d3.own], []);
  assert.deepEqual([...TP.d3.sofar].sort(), ["A", "B", "C"]);
  assert.equal(TP.d8.sofar.size, 5);
});

test("which days have a quiz, and what each kind says about itself", () => {
  assert.deepEqual(PLAN.filter(d => d.id && QZ.hasQuiz(d)).map(d => d.day), [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(QZ.describe(D(1)), "On today's topics");
  assert.match(QZ.describe(D(3)), /review/i);
  assert.match(QZ.describe(D(5)), /domains 1 and 2/);
  assert.match(QZ.describe(D(6)), /weakest/);
  assert.match(QZ.describe(D(7)), /weighted like the exam/);
});

test("a day quiz has 30 unique questions on that day's topics, foundation level first", () => {
  const p = QZ.pickDay(D(2), TP, bank(), {}, seeded());
  assert.equal(p.length, 30);
  assert.equal(new Set(ids(p)).size, 30);
  assert.ok(p.every(x => x.tags[0] === "B" || x.tags[0] === "C"));
  assert.ok(p.every(x => x.day <= 6), "exam-level pools wait until the foundation questions are used up");
});

test("a day quiz leaves out questions that touch a topic taught later", () => {
  const later = { ...q("q01-900", 1, 1), tags: ["A", "E"] };
  const b = bank().concat(later);
  assert.ok(!ids(QZ.dayPool(D(1), TP, b)).includes(later.id));
  assert.ok(ids(QZ.dayPool(D(4), TP, b)).includes(later.id), "Day 4 teaches E, so there it counts");
  assert.ok(!ids(QZ.dayPool(D(1), TP, b)).some(id => id.startsWith("m")), "never from the mock pool");
});

test("a retake shows every question not yet seen", () => {
  const b = bank().filter(x => x.day <= 5), stats = {}, r = seeded(7);   // 50 questions on topic A
  const first = QZ.pickDay(D(1), TP, b, stats, r);
  first.forEach(x => QZ.record(stats, x.id, true, "2026-10-13"));
  const second = QZ.pickDay(D(1), TP, b, stats, r);
  const unseen = b.filter(x => x.tags[0] === "A" && !stats[x.id]).map(x => x.id);
  assert.equal(unseen.length, 20);
  for (const id of unseen) assert.ok(ids(second).includes(id), `${id} should be in the retake`);
});

test("once all are seen, missed questions come before ones answered right", () => {
  const b = bank().filter(x => x.tags[0] === "A").slice(0, 40), stats = {};
  b.forEach((x, i) => QZ.record(stats, x.id, i >= 5, "2026-10-12"));
  const p = QZ.pickDay(D(1), TP, b, stats, seeded(3));
  for (let i = 0; i < 5; i++) assert.ok(ids(p).includes(b[i].id));
});

test("a day with few questions of its own is filled up from earlier topics", () => {
  const b = bank().filter(x => x.day === 2 || (x.day === 1 && x.tags[0] === "A"));   // 20 on B and C, 20 on A, 20 on D and E
  const p = QZ.pickDay(D(2), TP, b, {}, seeded());
  assert.equal(p.length, 30);
  assert.equal(p.filter(x => x.tags[0] === "B" || x.tags[0] === "C").length, 20, "all of the day's own questions");
  assert.equal(p.filter(x => x.tags[0] === "A").length, 10, "the rest from what was taught before, not from later topics");
});

test("a review day draws only on topics taught so far", () => {
  const p = QZ.pickDay(D(3), TP, bank(), {}, seeded());
  assert.equal(p.length, 30);
  assert.equal(new Set(ids(p)).size, 30);
  assert.ok(p.every(x => ["A", "B", "C"].includes(x.tags[0])));
  assert.ok(new Set(p.map(x => x.tags[0])).size === 3, "mixed, not one topic");
});

test("an exam-domain day splits evenly between its domains", () => {
  const p = QZ.pickDay(D(5), TP, bank(), {}, seeded());
  assert.equal(p.length, 30);
  assert.deepEqual([1, 2, 3, 4].map(d => p.filter(x => x.dom === d).length), [15, 15, 0, 0]);
  assert.ok(p.every(x => x.day !== "mock"));
});

test("the exam-weighted day uses the exam's split and only study questions", () => {
  const p = QZ.pickDay(D(7), TP, bank(), {}, seeded());
  assert.equal(p.length, 30);
  assert.deepEqual([1, 2, 3, 4].map(d => p.filter(x => x.dom === d).length), [9, 8, 7, 6]);
  assert.ok(p.every(x => x.day !== "mock"));
});

test("the weak-topics day leans on weak topics and past misses", () => {
  const b = bank(), stats = {};
  b.filter(x => typeof x.day === "number").forEach(x => QZ.record(stats, x.id, x.tags[0] !== "C", "2026-10-20"));
  const p = QZ.pickDay(D(6), TP, b, stats, seeded());
  assert.equal(p.length, 30);
  assert.ok(p.filter(x => x.tags[0] === "C").length >= 6, "the weak tag should be well represented");
  assert.equal(new Set(ids(p)).size, 30);
});

test("a day without a quiz draws nothing", () => {
  assert.equal(QZ.pickDay(D(8), TP, bank(), {}, seeded()).length, 0);
});

test("mock exam: 65 questions split 20/17/15/13, unseen mock questions first", () => {
  const b = bank();
  const p = QZ.pickMock(b, {}, seeded());
  assert.equal(p.length, 65);
  assert.deepEqual([1, 2, 3, 4].map(d => p.filter(x => x.dom === d).length), [20, 17, 15, 13]);
  assert.ok(p.every(x => x.day === "mock"));
  const stats = {};
  p.forEach(x => QZ.record(stats, x.id, true, "2026-10-25"));
  const p2 = QZ.pickMock(b, stats, seeded(9));
  assert.equal(p2.filter(x => stats[x.id]).length, 0, "a second mock should not repeat questions while unseen ones remain");
});

test("grading single and multiple-response questions", () => {
  const single = q("x", 1, 1), multi = q("y", 1, 1, "A", 5);
  assert.ok(QZ.isRight(single, [0]));
  assert.ok(!QZ.isRight(single, [1]));
  assert.ok(QZ.isRight(multi, [3, 1]));
  assert.ok(!QZ.isRight(multi, [1]));
  assert.ok(!QZ.isRight(multi, [1, 2]));
  assert.ok(!QZ.isRight(multi, undefined));
});

test("option order is a permutation", () => {
  const o = QZ.order(q("x", 1, 1, "A", 5), seeded());
  assert.deepEqual([...o].sort(), [0, 1, 2, 3, 4]);
});

test("spaced repetition: 1, 2, 4 days, early answers don't count, a miss resets", () => {
  const srs = {};
  QZ.srsMiss(srs, "a", "2026-10-30");
  assert.equal(srs.a.due, "2026-10-31");
  QZ.srsHit(srs, "a", "2026-10-30");
  assert.equal(srs.a.step, 0, "not due yet");
  QZ.srsHit(srs, "a", "2026-10-31");
  assert.deepEqual(plain(srs.a), { step: 1, due: "2026-11-02" });
  QZ.srsHit(srs, "a", "2026-11-02");
  assert.deepEqual(plain(srs.a), { step: 2, due: "2026-11-06" });
  QZ.srsMiss(srs, "a", "2026-11-06");
  assert.deepEqual(plain(srs.a), { step: 0, due: "2026-11-07" });
  QZ.srsHit(srs, "a", "2026-11-07"); QZ.srsHit(srs, "a", "2026-11-09"); QZ.srsHit(srs, "a", "2026-11-13");
  assert.equal(srs.a, undefined, "retired after three on-time correct answers");
});

test("due list is oldest first", () => {
  const srs = { a: { step: 0, due: "2026-10-14" }, b: { step: 0, due: "2026-10-13" }, c: { step: 0, due: "2026-10-20" } };
  assert.deepEqual(plain(QZ.dueIds(srs, "2026-10-15")), ["b", "a"]);
});

test("warm-up takes due reviews first, then yesterday's misses", () => {
  const b = bank().filter(x => x.day === 1), stats = {}, srs = {};
  QZ.srsMiss(srs, b[0].id, "2026-10-12");
  b.slice(1, 10).forEach((x, i) => QZ.record(stats, x.id, i > 1, "2026-10-12"));
  const w = QZ.pickWarmup(b, stats, srs, "2026-10-13", 5, seeded());
  assert.equal(w.length, 5);
  for (const id of [b[0].id, b[1].id, b[2].id]) assert.ok(ids(w).includes(id));
});

test("weak tags are sorted worst first", () => {
  const b = bank().filter(x => x.day === 1), stats = {};
  b.forEach(x => QZ.record(stats, x.id, x.tags[0] !== "B", "2026-10-12"));
  const w = QZ.weakTags(b, stats);
  assert.equal(w[0].tag, "B");
  assert.equal(w[0].acc, 0);
  assert.equal(w.length, 5);
});

test("addDays crosses month and year boundaries", () => {
  assert.equal(QZ.addDays("2026-10-31", 1), "2026-11-01");
  assert.equal(QZ.addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(QZ.addDays("2026-03-01", -1), "2026-02-28");
});

test("mock result counts per domain", () => {
  const qs = [q("a", "mock", 1), q("b", "mock", 1), q("c", "mock", 4)];
  const r = QZ.mockResult(qs, { a: [0], b: [2], c: [0] });
  assert.equal(r.score, 2);
  assert.equal(r.pct, 67);
  assert.deepEqual(plain(r.dom), [[1, 2], [0, 0], [0, 0], [1, 1]]);
});

test("step practice: questions that name the step, then its main topic, then side topics, the mock pool last", () => {
  const named = { ...q("q03-001", 3, 1, "E"), ref: ["s2"] };          // names the step, on another topic
  const side = { ...q("q03-002", 3, 1), tags: ["A", "B"] };           // the step's topic as a side topic
  const b = [named, side, q("q03-003", 3, 1, "B"), q("q09-001", 9, 2, "B"), q("m1-001", "mock", 2, "B"), q("q03-004", 3, 1, "D")].map(x => (x === named ? x : { ...x, ref: [] }));
  assert.deepEqual(plain(ids(QZ.forStep("s2", ["B"], b)).sort()), ["m1-001", "q03-001", "q03-002", "q03-003", "q09-001"]);
  const p = ids(QZ.pickStep("s2", ["B"], b, {}, 5, seeded(3)));
  assert.equal(p[0], "q03-001", "the question that names the step comes first");
  assert.deepEqual(plain(p.slice(1, 3).sort()), ["q03-003", "q09-001"], "then the step's topic as the main topic");
  assert.deepEqual(plain(p.slice(3)), ["q03-002", "m1-001"], "then side topics, and the mock pool last");
  assert.equal(QZ.pickStep("s2", ["B"], b, {}).length, QZ.STEP);
  const stats = {};
  QZ.record(stats, "q03-003", true, "2026-10-14");
  assert.equal(ids(QZ.pickStep("s2", ["B"], b, stats, 3, seeded(4)))[1], "q09-001", "unseen before seen within a group");
  assert.equal(QZ.pickStep("nope", [], b, {}).length, 0);
  assert.equal(QZ.pickStep("nope", undefined, b, {}).length, 0);
});
