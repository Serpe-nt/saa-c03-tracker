// Loads the site's browser scripts into a sandbox so tests can use window.* without a browser.
import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SITE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "site");

export function load(...files) {
  const window = {};
  window.window = window;
  const ctx = vm.createContext({ window });
  for (const f of files) vm.runInContext(fs.readFileSync(path.join(SITE, f), "utf8"), ctx, { filename: f });
  return window;
}

// Script files the page loads, in order, as listed in index.html.
export function pageScripts() {
  const html = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
  return [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
}
