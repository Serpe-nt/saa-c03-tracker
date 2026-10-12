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

test("pass mark is 27 of 30", () => {
  assert.equal(QZ.needed(30), 27);
  assert.ok(QZ.passed(27, 30));
  assert.ok(!QZ.passed(26, 30));
});

test("a day quiz has exactly 30 unique questions from that day", () => {
  const p = QZ.pickDay(3, bank(), {}, seeded());
  assert.equal(p.length, 30);
  assert.equal(new Set(ids(p)).size, 30);
  assert.ok(p.every(x => x.day === 3));
});

test("a retake shows every question not yet seen", () => {
  const b = bank(), stats = {}, r = seeded(7);
  const first = QZ.pickDay(2, b, stats, r);
  first.forEach(x => QZ.record(stats, x.id, true, "2026-10-13"));
  const second = QZ.pickDay(2, b, stats, r);
  const unseen = b.filter(x => x.day === 2 && !stats[x.id]).map(x => x.id);
  assert.equal(unseen.length, 20);
  for (const id of unseen) assert.ok(ids(second).includes(id), `${id} should be in the retake`);
});

test("once all are seen, missed questions come before ones answered right", () => {
  const b = bank().filter(x => x.day === 1), stats = {};
  b.forEach((x, i) => QZ.record(stats, x.id, i >= 5, "2026-10-12"));
  const p = QZ.pickDay(1, b, stats, seeded(3));
  for (let i = 0; i < 5; i++) assert.ok(ids(p).includes(b[i].id));
});

test("Day 7 mixes 5 questions from each of Days 1-6", () => {
  const p = QZ.pickDay(7, bank(), {}, seeded());
  assert.equal(p.length, 30);
  for (let d = 1; d <= 6; d++) assert.equal(p.filter(x => x.day === d).length, 5);
});

test("Day 13 is weighted like the exam and uses only study questions", () => {
  const p = QZ.pickDay(13, bank(), {}, seeded());
  assert.equal(p.length, 30);
  assert.deepEqual([1, 2, 3, 4].map(d => p.filter(x => x.dom === d).length), [9, 8, 7, 6]);
  assert.ok(p.every(x => x.day !== "mock"));
});

test("Day 12 leans on weak topics and past misses", () => {
  const b = bank(), stats = {};
  b.filter(x => typeof x.day === "number").forEach(x => QZ.record(stats, x.id, x.tags[0] !== "C", "2026-10-20"));
  const p = QZ.pickDay(12, b, stats, seeded());
  assert.equal(p.length, 30);
  assert.ok(p.filter(x => x.tags[0] === "C").length >= 6, "the weak tag should be well represented");
  assert.equal(new Set(ids(p)).size, 30);
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

test("weak tags are sorted worst first with study refs", () => {
  const b = bank().filter(x => x.day === 1), stats = {};
  b.forEach(x => QZ.record(stats, x.id, x.tags[0] !== "B", "2026-10-12"));
  const w = QZ.weakTags(b, stats);
  assert.equal(w[0].tag, "B");
  assert.equal(w[0].acc, 0);
  assert.deepEqual(plain(w[0].refs), ["r1", "r2"]);
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
