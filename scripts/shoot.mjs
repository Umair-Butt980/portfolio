// Dev-only: drives the running app via the system Chrome and screenshots each
// camera view to /tmp/shots. Requires `npm run dev` and TUNING.screenshotMode.
import puppeteer from "puppeteer-core";
import { mkdirSync } from "fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "/tmp/shots";
mkdirSync(OUT, { recursive: true });

const views = process.argv.slice(2);
const all = ["idle", "frontend", "backend", "steering", "experience"];
const targets = views.length ? views : all;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  args: ["--window-size=1300,860"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 30000 });
await new Promise((r) => setTimeout(r, 2500));
await page.evaluate(() => {
  window.__portfolio?.start();
  window.__portfolio?.ready();
});
await new Promise((r) => setTimeout(r, 4500));

for (const v of targets) {
  await page.evaluate((f) => window.__portfolio?.focus(f), v);
  await new Promise((r) => setTimeout(r, 2400));
  const focus = await page.evaluate(() => window.__portfolio?.getFocus());
  await page.screenshot({ path: `${OUT}/${v}.png` });
  console.log("shot", v, "focus=", focus);
  // Settle back to idle between captures.
  await page.evaluate(() => window.__portfolio?.focus("idle"));
  await new Promise((r) => setTimeout(r, 1200));
}
console.log("DBG", JSON.stringify(await page.evaluate(() => window.__dbg)));
console.log("ERRORS", errors.slice(0, 10).join(" || ") || "none");
await browser.close();
