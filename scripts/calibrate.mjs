// Calibration shots: frames the scene from fixed positions via the dev
// __portfolioCamera hook. Usage: node calibrate.mjs '[[px,py,pz,tx,ty,tz,"name"], ...]'
import puppeteer from "puppeteer-core";
import { mkdirSync } from "fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "/tmp/shots";
mkdirSync(OUT, { recursive: true });

const shots = JSON.parse(process.argv[2] ?? "[]");

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
await new Promise((r) => setTimeout(r, 4000));

for (const [px, py, pz, tx, ty, tz, name] of shots) {
  await page.evaluate(
    (a) => window.__portfolioCamera?.set(...a),
    [px, py, pz, tx, ty, tz]
  );
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("shot", name);
}
console.log("ERRORS", errors.slice(0, 10).join(" || ") || "none");
await browser.close();
