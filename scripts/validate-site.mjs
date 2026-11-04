import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const fail = [];
const ok = (message) => console.log("✓ " + message);
const exists = async (file) => { try { await access(path.join(root, file)); return true; } catch { return false; } };

const navigation = JSON.parse(await readFile(path.join(root, "data/navigation.json"), "utf8"));
const countries = JSON.parse(await readFile(path.join(root, "data/countries.json"), "utf8"));
if (!(await exists("diplomacy-grand.js")) || !(await exists("diplomacy-grand.css"))) fail.push("shared experience assets are missing");
else ok("shared experience assets are present");
if (!Array.isArray(navigation.pages) || navigation.pages.length !== 15) fail.push("navigation.json must describe exactly 15 pages");
else ok("navigation index contains 15 pages");
if (!Array.isArray(countries.countries) || countries.countries.length !== 11) fail.push("countries.json must contain exactly 11 country records");
else ok("country index contains 11 country records");

for (const page of navigation.pages ?? []) {
  const file = page.path;
  if (!(await exists(file))) { fail.push("missing page: " + file); continue; }
  const html = await readFile(path.join(root, file), "utf8");
  if (!html.includes("diplomacy-grand.css")) fail.push(file + ": shared stylesheet is not linked");
  if (!html.includes("diplomacy-grand.js")) fail.push(file + ": shared interaction engine is not linked");
  for (const match of html.matchAll(/(?:src|href)=["\x27]([^"\x27]+)["\x27]/g)) {
    const ref = match[1].split(/[?#]/)[0];
    if (!ref || /^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(ref)) continue;
    if (/\.(?:css|js|json|svg|png|jpe?g|webp|woff2?)$/i.test(ref)) {
      const target = path.normalize(path.join(path.dirname(file), decodeURIComponent(ref)));
      if (!(await exists(target))) fail.push(file + ": missing local asset " + ref + " (resolved " + target + ")");
    }
  }
}
if (!fail.length) ok("all 15 pages and local asset references are present");

for (const item of countries.countries ?? []) {
  if (!navigation.pages.some(page => page.path === item.path && page.title === item.name)) {
    fail.push("country index mismatch: " + item.name + " (" + item.path + ")");
  }
}
if (!fail.some(x => x.startsWith("country index mismatch"))) ok("country index matches navigation");

const syntax = spawnSync(process.execPath, ["--check", "diplomacy-grand.js"], { encoding: "utf8" });
if (syntax.status !== 0) fail.push("diplomacy-grand.js syntax check failed:\n" + syntax.stderr);
else ok("shared interaction engine passes Node.js syntax check");

if (fail.length) {
  console.error("\nValidation failed:");
  for (const issue of fail) console.error(" - " + issue);
  process.exitCode = 1;
} else {
  console.log("\n萬國外交廳 static validation passed.");
}
