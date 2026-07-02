// TEMP dev tool: sets a camera pose, clicks pixels, prints SHELL-HIT console
// output so we can name shell nodes. Usage:
//   node scripts/identify.mjs px py pz tx ty tz x1,y1 x2,y2 ...
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const [px, py, pz, tx, ty, tz, ...pixels] = process.argv.slice(2);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  args: ["--window-size=1300,860"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
page.on("console", (m) => {
  if (m.text().includes("SHELL-HIT")) console.log(m.text());
});

await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 30000 });
await new Promise((r) => setTimeout(r, 2500));
await page.evaluate(() => {
  window.__portfolio?.start();
  window.__portfolio?.ready();
});
await new Promise((r) => setTimeout(r, 4000));
await page.evaluate(
  (a) => window.__portfolioCamera?.set(...a),
  [px, py, pz, tx, ty, tz].map(Number)
);
await new Promise((r) => setTimeout(r, 800));

for (const p of pixels) {
  const [x, y] = p.split(",").map(Number);
  await page.mouse.click(x, y);
  await new Promise((r) => setTimeout(r, 400));
}
await browser.close();
