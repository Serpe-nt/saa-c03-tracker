// Finds near-duplicate questions across all pools: Jaccard similarity of the words in the
// stem plus the keyed answer(s). A high score usually means the same scenario and the same
// decision; review each pair and rewrite the later one (mock over day, later day over earlier).
// The same concept in a different scenario with a different deciding requirement is fine.
// Usage: node tools/similar.mjs [minScore=0.38] [maxPairs=40]
import { load, pageScripts } from "../tests/load.mjs";

const MIN = +(process.argv[2] || 0.38), TOP = +(process.argv[3] || 40);
const W = load(...pageScripts().filter(s => s.startsWith("quiz/") || s === "plan.js"));
const stop = new Set(("a an the of to and or in on for with is are be by that this which from as at it its their they " +
  "company solutions architect what should do meets these requirements solution must needs wants").split(" "));
const words = s => new Set(s.toLowerCase().replace(/<[^>]+>/g, " ").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(w => w.length > 2 && !stop.has(w)));
const Q = W.QUIZ.map(q => ({ id: q.id, w: words(q.q + " " + q.a.map(i => q.o[i]).join(" ")), key: q.a.map(i => q.o[i]).join(" | ") }));
const pairs = [];
for (let i = 0; i < Q.length; i++) for (let j = i + 1; j < Q.length; j++) {
  let n = 0;
  for (const x of Q[i].w) if (Q[j].w.has(x)) n++;
  const score = n / (Q[i].w.size + Q[j].w.size - n);
  if (score >= MIN) pairs.push([score, Q[i], Q[j]]);
}
pairs.sort((a, b) => b[0] - a[0]).slice(0, TOP)
  .forEach(([s, a, b]) => console.log(`${s.toFixed(2)}  ${a.id}  ${b.id}  ${a.key.slice(0, 55)}  ||  ${b.key.slice(0, 55)}`));
console.log(`${pairs.length} pair(s) at or above ${MIN}`);
