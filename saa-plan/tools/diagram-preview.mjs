// Renders one course diagram the way a card shows it, with its parts written out under it, to a PNG.
//   NODE_PATH=$(npm root -g) node tools/diagram-preview.mjs c3 /tmp/c3.png [dark]
// Needs Playwright (as the e2e does). Look at the picture: overlaps and cut labels pass the data checks unnoticed.
import { createRequire } from "node:module";
import { load, SITE } from "../tests/load.mjs";
import fs from "node:fs";
import path from "node:path";
const [key, out = `/tmp/${key}.png`, theme] = process.argv.slice(2);
const W = load("quiz/meta.js", `diagrams/${key}.js`, "diagram.js");
const dg = (W.DIAGRAMS || {})[key];
if (!dg) { console.error(`no DIAGRAMS.${key}`); process.exit(1); }
const css = fs.readFileSync(path.join(SITE, "style.css"), "utf8");
const parts = Object.entries(dg.parts || {}).map(([id, p]) => `<li><b>${p.name}</b> <small>(${id})</small><br>${p.why}${(p.k || []).map(([l, t]) => `<br>· <b>${l}</b>: ${t}`).join("")}${p.trap ? `<br>⚠ ${p.trap}` : ""}</li>`).join("");
const html = `<!doctype html><meta charset="utf-8"><style>${css}</style><body style="padding:20px"><div class="card" style="max-width:800px;margin:auto">` +
  `<h2 class="c-t">${dg.title}</h2><p class="c-n">${dg.why}</p>${W.DG.svg(dg, key)}<ol style="font-size:13px">${parts}</ol></div></body>`;
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 860, height: 900 }, colorScheme: theme === "dark" ? "dark" : "light" });
await p.setContent(html);
await p.screenshot({ path: out, fullPage: true });
await b.close();
console.log("wrote", out);
