import * as THREE from "three";
import { PALETTE } from "@/app/constants/palette";

/**
 * Procedural CanvasTextures for the garage. Generated once on the client —
 * no downloads, no suspense. Deterministic (seeded PRNG) so screenshots are
 * reproducible between runs.
 */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  return { canvas, ctx: canvas.getContext("2d")! };
}

function toTexture(canvas: HTMLCanvasElement) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Stained concrete floor with painted pit-box markings around the car
 * footprint. Returns a color map plus a roughness map that is smoother
 * (darker) inside the worn pit box and oil stains, so reflections show up
 * only where the floor is polished by use.
 *
 * The texture maps a `width` × `depth` world-unit floor; the pit box is
 * drawn centered, sized for the hero car.
 */
export function makeFloorTextures(width: number, depth: number) {
  const SIZE = 1024;
  const rand = mulberry32(42);
  const { canvas, ctx } = makeCanvas(SIZE);
  const rough = makeCanvas(SIZE);

  // Base concrete.
  ctx.fillStyle = PALETTE.concrete;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Low-frequency mottling.
  for (let i = 0; i < 260; i++) {
    const x = rand() * SIZE;
    const y = rand() * SIZE;
    const r = 20 + rand() * 90;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const light = rand() > 0.5;
    g.addColorStop(0, light ? "rgba(66,60,54,0.10)" : "rgba(8,6,5,0.12)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Concrete expansion joints.
  ctx.strokeStyle = "rgba(0,0,0,0.28)";
  ctx.lineWidth = 2;
  const cells = 4;
  for (let i = 1; i < cells; i++) {
    const p = (i / cells) * SIZE;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, SIZE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(SIZE, p);
    ctx.stroke();
  }

  // Pit box painted around the car footprint (car ≈ 2.2 × 5.6 world units,
  // centered). Convert world units → pixels.
  const px = (wx: number) => ((wx / width) + 0.5) * SIZE;
  const pz = (wz: number) => ((wz / depth) + 0.5) * SIZE;
  const boxW = px(1.6) - px(-1.6);
  const boxD = pz(3.2) - pz(-3.2);
  ctx.strokeStyle = "rgba(226,180,66,0.55)";
  ctx.lineWidth = 10;
  ctx.strokeRect(px(-1.6), pz(-3.2), boxW, boxD);

  // Hatched stop line at the front of the box.
  ctx.lineWidth = 6;
  for (let i = 0; i < 8; i++) {
    const x0 = px(-1.6) + (i / 8) * boxW;
    ctx.beginPath();
    ctx.moveTo(x0, pz(3.2));
    ctx.lineTo(x0 + boxW / 12, pz(3.7));
    ctx.stroke();
  }

  // Oil stains inside the box.
  for (let i = 0; i < 14; i++) {
    const x = px(-1.2 + rand() * 2.4);
    const y = pz(-2.6 + rand() * 5.2);
    const r = 12 + rand() * 46;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(4,3,3,0.5)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Roughness: bright = rough. Smoother (darker) inside the worn pit box.
  rough.ctx.fillStyle = "#b9b9b9";
  rough.ctx.fillRect(0, 0, SIZE, SIZE);
  const rg = rough.ctx.createRadialGradient(
    SIZE / 2, SIZE / 2, 0,
    SIZE / 2, SIZE / 2, Math.max(boxW, boxD) * 0.75
  );
  rg.addColorStop(0, "#5a5a5a");
  rg.addColorStop(1, "#b9b9b9");
  rough.ctx.fillStyle = rg;
  rough.ctx.fillRect(0, 0, SIZE, SIZE);

  const map = toTexture(canvas);
  const roughnessMap = new THREE.CanvasTexture(rough.canvas);
  return { map, roughnessMap };
}

/** Radial dark blob used to fake ambient occlusion under props. */
export function makeAOTexture() {
  const SIZE = 256;
  const { canvas, ctx } = makeCanvas(SIZE);
  const g = ctx.createRadialGradient(
    SIZE / 2, SIZE / 2, 0,
    SIZE / 2, SIZE / 2, SIZE / 2
  );
  g.addColorStop(0, "rgba(0,0,0,0.85)");
  g.addColorStop(0.6, "rgba(0,0,0,0.35)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SIZE, SIZE);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 2;
  return tex;
}

/** Emissive sponsor/name banner with text on a dark carbon strip. */
export function makeBannerTexture(
  lines: string[],
  { accentLine = 0 }: { accentLine?: number } = {}
) {
  const W = 1024;
  const H = 256;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#111013";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, W - 12, H - 12);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lineH = H / (lines.length + 0.4);
  lines.forEach((line, i) => {
    ctx.font = `bold ${Math.floor(lineH * 0.62)}px "Arial Black", Arial, sans-serif`;
    ctx.fillStyle = i === accentLine ? PALETTE.accent : "#e8e4de";
    ctx.fillText(line.toUpperCase(), W / 2, lineH * (i + 0.75));
  });

  return toTexture(canvas);
}
