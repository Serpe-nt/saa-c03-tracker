// Checks every AWS link the site shows: DOCS (quiz/meta.js) and the docs cited by key points (keys/*.js).
// Needs network access to aws.amazon.com and docs.aws.amazon.com. Run: node tools/links.mjs
// A link passes only on a plain 200. docs.aws.amazon.com answers a page that doesn't exist with a
// redirect to the guide's landing page, so a redirect counts as broken.
import { load, pageScripts } from "../tests/load.mjs";

const W = load(...pageScripts().filter(s => s !== "app.js" && s !== "fx.js"));
const uses = new Map();   // url → where it is used
const add = (url, where) => { if (!uses.has(url)) uses.set(url, []); uses.get(url).push(where); };
for (const [k, [, url]] of Object.entries(W.DOCS)) add(url, `DOCS.${k}`);
for (const [id, e] of Object.entries(W.KEYS || {})) for (const [, url] of e.docs || []) add(url, `KEYS.${id}`);

const urls = [...uses.keys()];
const bad = [];
async function check(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      const r = await fetch(url, { redirect: "manual", headers: { "User-Agent": "Mozilla/5.0 (link check)" }, signal: AbortSignal.timeout(30000) });
      await r.arrayBuffer();
      if (r.status === 200) return;
      if (attempt < 3 && (r.status === 429 || r.status >= 500)) { await new Promise(res => setTimeout(res, 2000 * attempt)); continue; }
      return bad.push(`${r.status}${r.headers.get("location") ? " → " + r.headers.get("location") : ""}  ${url}  (${uses.get(url).join(", ")})`);
    } catch (e) {
      if (attempt < 3) continue;
      return bad.push(`${e.name}  ${url}  (${uses.get(url).join(", ")})`);
    }
  }
}
let next = 0;
await Promise.all(Array.from({ length: 6 }, async () => { while (next < urls.length) await check(urls[next++]); }));

console.log(`${urls.length} links checked, ${bad.length} broken`);
bad.sort().forEach(b => console.log("  " + b));
process.exitCode = bad.length ? 1 : 0;
