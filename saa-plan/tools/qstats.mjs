// Per-pool statistics for question authors: counts by domain, multiple-response share,
// answer positions, tag spread, and how often the keyed option is clearly the longest
// (a give-away pattern to avoid). Structural validation lives in tests/data.test.mjs.
// Usage: node tools/qstats.mjs            (all pools)
//        node tools/qstats.mjs d08 mock1  (only these files)
import { load, pageScripts } from "../tests/load.mjs";

const want = process.argv.slice(2);
const files = pageScripts().filter(s => s.startsWith("quiz/") && s !== "quiz/meta.js")
  .filter(f => !want.length || want.some(w => f.includes(w)));
for (const f of files) {
  const W = load("plan.js", "quiz/meta.js", f);
  const qs = W.QUIZ;
  const dom = [0, 0, 0, 0], pos = [0, 0, 0, 0, 0], tags = {};
  let multi = 0, longest = 0;
  for (const q of qs) {
    dom[q.dom - 1]++;
    if (q.a.length > 1) multi++;
    q.a.forEach(i => pos[i]++);
    q.tags.forEach(t => { tags[t] = (tags[t] || 0) + 1; });
    const lens = q.o.map(o => o.length);
    if (q.a.length === 1 && lens[q.a[0]] === Math.max(...lens) && lens[q.a[0]] > 1.25 * [...lens].sort((a, b) => b - a)[1]) longest++;
  }
  console.log(`${f}: ${qs.length} questions | domains ${dom.join("/")} | choose-two ${multi} | answer positions ${pos.join("/")} | keyed option clearly longest: ${longest}`);
  console.log("  tags: " + Object.entries(tags).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} ${n}`).join(", "));
}
