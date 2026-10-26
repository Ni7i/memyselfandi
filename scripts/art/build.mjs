#!/usr/bin/env node
// Builds the hand-authored drawings in /art into React-ready data.
//
//   node scripts/art/build.mjs            build every drawing in art/*.svg
//   node scripts/art/build.mjs bench      build one drawing
//
// Source drawings are plain SVG. Each <path> is a centerline drawn with a pen:
//   class="ink"     main contour, a brush stroke (default width 2.2)
//   class="fine"    detail stroke (default width 1.1)
//   class="thread"  the red thread, an even line
//   class="fill"    a filled shape, data-tone="dark|shade|wash|paper|thread"
//   class="hatch"   a closed region filled with hand-drawn parallel lines
//   class="guide"   construction line, only shown in the preview
// Attributes: data-w (width), data-taper="start end", data-seed, data-angle,
// data-gap (hatching), data-min-scale (skip when included smaller than this).
// <g data-include="name" transform="..."> places another drawing; its pen widths
// scale with the square root of the scale so small copies keep a readable line.
// <g data-window="0.2 0.6"> sets when a layer draws within the drawing (0 to 1).
// <g data-step="name"> marks a named moment the page can wait for.
// data-sway="curl|wisp|light" on a stroke lets it move in the breeze around its first point.
//
// Output: components/art/generated/<name>.ts and art/.preview/<name>.svg.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { flatten, parseTransform, multiply, IDENTITY, scaleOf, lengthOf, simplify, toPath, hatchSegments } from "./geometry.mjs";
import { brushOutline, random } from "./brush.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SOURCE = join(root, "art");
const OUT = join(root, "components", "art", "generated");
const PREVIEW = join(SOURCE, ".preview");

const DEFAULT_WIDTH = { ink: 2.2, fine: 1.1, hatch: 0.75 };

function attributes(text) {
  const out = {};
  for (const [, key, value] of text.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) out[key] = value;
  return out;
}

/** Reads a source drawing into a flat list of elements with their full transform. */
function readDrawing(name, stack = []) {
  if (stack.includes(name)) throw new Error(`Include cycle: ${[...stack, name].join(" > ")}`);
  const file = join(SOURCE, `${name}.svg`);
  if (!existsSync(file)) throw new Error(`Missing drawing art/${name}.svg`);
  const text = readFileSync(file, "utf8").replace(/<!--[\s\S]*?-->/g, "");
  const svg = attributes(text.match(/<svg\b([^>]*)>/)?.[1] ?? "");
  const [, , width, height] = (svg.viewBox ?? "0 0 100 100").split(/[\s,]+/).map(Number);
  const elements = [];
  const groups = [{ matrix: IDENTITY, layer: "base", window: null }];
  for (const [, closing, tag, rest, selfClosing] of text.matchAll(/<(\/?)([\w:-]+)\b([^>]*?)(\/?)>/g)) {
    if (tag === "svg" || tag === "defs" || tag === "title" || tag === "desc") continue;
    const parent = groups[groups.length - 1];
    if (closing) {
      if (tag === "g") groups.pop();
      continue;
    }
    const a = attributes(rest);
    const matrix = multiply(parent.matrix, parseTransform(a.transform));
    if (tag === "g") {
      if (a["data-include"]) {
        elements.push({ include: a["data-include"], matrix, attrs: a, layer: a.id ?? parent.layer, window: a["data-window"] ?? parent.window, step: a["data-step"] ?? parent.step });
        if (!selfClosing) groups.push({ ...parent, matrix });
      } else if (!selfClosing) {
        groups.push({
          matrix,
          layer: a.id ?? parent.layer,
          window: a["data-window"] ?? parent.window,
          step: a["data-step"] ?? parent.step,
          inherited: { ...parent.inherited, ...pick(a, ["class", "data-w", "data-tone", "data-taper", "data-min-scale", "data-angle", "data-gap"]) },
        });
      }
      continue;
    }
    const merged = { ...parent.inherited, ...a };
    let d = merged.d;
    if (tag === "circle") d = ellipsePath(+a.cx, +a.cy, +a.r, +a.r);
    else if (tag === "ellipse") d = ellipsePath(+a.cx, +a.cy, +a.rx, +a.ry);
    else if (tag === "line") d = `M${a.x1},${a.y1} L${a.x2},${a.y2}`;
    else if (tag === "polyline" || tag === "polygon") d = `M${a.points}${tag === "polygon" ? "Z" : ""}`;
    else if (tag !== "path") continue;
    elements.push({ d, matrix, attrs: merged, layer: parent.layer, window: parent.window, step: parent.step });
  }
  return { name, width, height, elements };
}

const pick = (a, keys) => Object.fromEntries(keys.filter((k) => a[k] !== undefined).map((k) => [k, a[k]]));

function ellipsePath(cx, cy, rx, ry) {
  const k = 0.5523;
  return `M${cx - rx},${cy} C${cx - rx},${cy - ry * k} ${cx - rx * k},${cy - ry} ${cx},${cy - ry}`
    + ` C${cx + rx * k},${cy - ry} ${cx + rx},${cy - ry * k} ${cx + rx},${cy}`
    + ` C${cx + rx},${cy + ry * k} ${cx + rx * k},${cy + ry} ${cx},${cy + ry}`
    + ` C${cx - rx * k},${cy + ry} ${cx - rx},${cy + ry * k} ${cx - rx},${cy}Z`;
}

/** Expands includes recursively into primitive elements. */
function expand(drawing, outerMatrix = IDENTITY, widthScale = 1, scale = 1, stack = [], context = {}) {
  const out = [];
  for (const element of drawing.elements) {
    const layer = context.layer ?? element.layer;
    const window = context.window ?? element.window;
    const step = context.step ?? element.step;
    if (element.include) {
      const child = readDrawing(element.include, [...stack, drawing.name]);
      const matrix = multiply(outerMatrix, element.matrix);
      const s = scaleOf(matrix) * 1;
      const ws = element.attrs["data-wscale"] ? Number(element.attrs["data-wscale"]) : Math.sqrt(scaleOf(element.matrix));
      out.push(...expand(child, matrix, widthScale * ws, s, [...stack, drawing.name], { layer, window, step }));
      continue;
    }
    const minScale = Number(element.attrs["data-min-scale"] ?? 0);
    if (scale < minScale) continue;
    out.push({ ...element, matrix: multiply(outerMatrix, element.matrix), widthScale, layer, window, step });
  }
  return out;
}

function kindOf(attrs) {
  const cls = (attrs.class ?? "ink").split(/\s+/);
  for (const k of ["guide", "thread", "fill", "hatch", "fine", "ink"]) if (cls.includes(k)) return k;
  return "ink";
}

function build(name) {
  const drawing = readDrawing(name);
  const elements = expand(drawing);
  const items = [];
  let seed = 1;
  for (const element of elements) {
    const kind = kindOf(element.attrs);
    if (kind === "guide") continue;
    const a = element.attrs;
    const subpaths = flatten(element.d, element.matrix, 0.4);
    // data-sway marks hair that moves in the breeze once the drawing is finished
    const base = { layer: element.layer, window: element.window, step: element.step, sway: a["data-sway"] };
    if (kind === "fill") {
      const d = subpaths.map((s) => toPath(simplify(s.points, 0.08), true)).join("");
      items.push({ ...base, k: "f", tone: a["data-tone"] ?? "shade", d, size: Math.sqrt(area(subpaths)) });
      continue;
    }
    if (kind === "thread") {
      for (const s of subpaths) {
        const pts = simplify(s.points, 0.05);
        items.push({ ...base, k: "t", tone: a["data-tone"] ?? "thread", c: toPath(pts, false), l: lengthOf(pts), w: Number(a["data-w"] ?? 2) });
      }
      continue;
    }
    const width = Number(a["data-w"] ?? DEFAULT_WIDTH[kind]) * element.widthScale;
    const taper = (a["data-taper"] ?? (kind === "hatch" ? "0.35 0.35" : kind === "fine" ? "0.25 0.35" : "0.18 0.3")).split(/\s+/).map(Number);
    const tone = a["data-tone"] ?? (kind === "fine" || kind === "hatch" ? "fine" : "ink");
    if (kind === "hatch") {
      const rand = random(Number(a["data-seed"] ?? seed++));
      // Several angles make cross-hatching; each further layer is a little more open
      const angles = String(a["data-angle"] ?? 45).split(/\s+/).map(Number);
      const gap = Number(a["data-gap"] ?? 5) * Math.sqrt(element.widthScale);
      for (const s of subpaths) {
        const segments = angles.flatMap((angle, layer) => hatchSegments(s.points, angle, gap * (1 + layer * 0.3), 0.5 + layer * 0.17));
        for (const [p, q] of segments) {
          const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
          if (len < width * 3) continue;
          // Hand-drawn hatch: ends pulled in a little, a slight bow, uneven pressure
          const t0 = rand() * 0.08, t1 = 1 - rand() * 0.12;
          const a0 = [p[0] + (q[0] - p[0]) * t0, p[1] + (q[1] - p[1]) * t0];
          const a1 = [p[0] + (q[0] - p[0]) * t1, p[1] + (q[1] - p[1]) * t1];
          const bow = (rand() - 0.5) * len * 0.04;
          const mid = [(a0[0] + a1[0]) / 2 - ((a1[1] - a0[1]) / len) * bow, (a0[1] + a1[1]) / 2 + ((a1[0] - a0[0]) / len) * bow];
          const pts = [a0, mid, a1];
          pushStroke(items, base, pts, { width: width * (0.8 + rand() * 0.4), taper, seed: seed++, minRatio: 0.3 }, tone, "hatch");
        }
      }
      continue;
    }
    for (const s of subpaths) {
      pushStroke(items, base, s.points, {
        width,
        taper,
        seed: Number(a["data-seed"] ?? seed++),
        minRatio: a["data-min"] ? Number(a["data-min"]) : undefined,
        pressure: a["data-pressure"] ? Number(a["data-pressure"]) : undefined,
      }, tone, kind);
    }
  }
  schedule(items);
  return { drawing, items };
}

function pushStroke(items, base, points, options, tone, kind) {
  const outline = brushOutline(points, options);
  const center = simplify(points, 0.12);
  items.push({
    ...base,
    k: "b",
    tone,
    kind,
    d: toPath(outline, true),
    c: toPath(center, false),
    l: lengthOf(center),
    w: Math.round((options.width * 1.6 + 2) * 10) / 10,
  });
}

function area(subpaths) {
  let total = 0;
  for (const { points } of subpaths) {
    let s = 0;
    for (let i = 0; i < points.length; i++) {
      const [x1, y1] = points[i], [x2, y2] = points[(i + 1) % points.length];
      s += x1 * y2 - x2 * y1;
    }
    total += Math.abs(s) / 2;
  }
  return total;
}

/**
 * Gives every item a start and end time in 0..1. Strokes draw one after the other
 * with some overlap, like a hand that starts the next line before lifting off.
 * Layers with data-window draw inside that window; others share the rest in order.
 */
function schedule(items) {
  const layers = [];
  for (const item of items) {
    let layer = layers.find((l) => l.id === item.layer);
    if (!layer) layers.push((layer = { id: item.layer, window: item.window, items: [] }));
    layer.items.push(item);
  }
  for (const layer of layers) {
    let cursor = 0, end = 0;
    for (const item of layer.items) {
      const duration = item.k === "f" ? 18 : item.kind === "hatch" ? Math.pow(item.l, 0.55) * 0.7 : Math.pow(item.l, 0.62) + 4;
      const overlap = item.kind === "hatch" ? 0.3 : item.k === "f" ? 0 : 0.6;
      item.t0 = cursor;
      item.t1 = cursor + duration;
      cursor += duration * overlap;
      end = Math.max(end, item.t1);
    }
    for (const item of layer.items) { item.t0 /= end; item.t1 /= end; }
    layer.weight = end;
  }
  const free = layers.filter((l) => !l.window);
  const freeTotal = free.reduce((s, l) => s + l.weight, 0) || 1;
  let cursor = 0;
  for (const layer of layers) {
    let a, b;
    if (layer.window) [a, b] = layer.window.split(/\s+/).map(Number);
    else { a = cursor; b = cursor + layer.weight / freeTotal; cursor = b; }
    for (const item of layer.items) {
      item.t0 = round3(a + item.t0 * (b - a));
      item.t1 = round3(a + item.t1 * (b - a));
    }
  }
}

const round3 = (n) => Math.round(n * 1000) / 1000;

function writeModule({ drawing, items }) {
  const steps = {};
  for (const item of items) {
    if (!item.step) continue;
    const s = (steps[item.step] ??= [1, 0]);
    s[0] = Math.min(s[0], item.t0);
    s[1] = Math.max(s[1], item.t1);
  }
  const rows = items.map((it) => {
    const sway = it.sway ? `,${JSON.stringify(it.sway)}` : "";
    if (it.k === "f") return `["f",${JSON.stringify(it.tone)},${JSON.stringify(it.d)},${it.t0},${it.t1}${sway}]`;
    if (it.k === "t") return `["t",${JSON.stringify(it.tone)},${JSON.stringify(it.c)},${Math.round(it.l)},${it.w},${it.t0},${it.t1}${sway}]`;
    return `["b",${JSON.stringify(it.tone)},${JSON.stringify(it.d)},${JSON.stringify(it.c)},${Math.round(it.l)},${it.w},${it.t0},${it.t1}${sway}]`;
  });
  const source = `// Generated by scripts/art/build.mjs from art/${drawing.name}.svg. Do not edit by hand.
import type { ArtData } from "../types";

const art: ArtData = {
  name: ${JSON.stringify(drawing.name)},
  width: ${drawing.width},
  height: ${drawing.height},
  steps: ${JSON.stringify(steps)},
  items: [
${rows.map((r) => `    ${r},`).join("\n")}
  ],
};

export default art;
`;
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, `${drawing.name}.ts`), source);
  return source.length;
}

function writePreview({ drawing, items }, guides) {
  const tone = {
    ink: "fill:#231f1b", fine: "fill:#231f1b;fill-opacity:.82", dark: "fill:#1d1a17", shade: "fill:#231f1b;fill-opacity:.09",
    wash: "fill:#7a6a55;fill-opacity:.13", paper: "fill:#f2ebdd", thread: "fill:#b23a2e", threadwash: "fill:#b23a2e;fill-opacity:.12", face: "fill:#3b2c22;fill-opacity:.3", deep: "fill:#2a1d15;fill-opacity:.38", far: "fill:#231f1b;fill-opacity:.42", bark: "fill:#231f1b;fill-opacity:.16", brow: "fill:#1d1612;fill-opacity:.62", socket: "fill:#2a1d15;fill-opacity:.3", oat: "fill:#b5a283;fill-opacity:.3", skin: "fill:#c98f6a;fill-opacity:.0", coat: "fill:#2b2723;fill-opacity:.5", flannel: "fill:#6f6a62;fill-opacity:.22", mid: "fill:#231f1b;fill-opacity:.55",
  };
  const filter = { socket: ' filter="url(#soft)"', shade: ' filter="url(#soft)"', wash: ' filter="url(#wet)"', glow: ' filter="url(#soft)"' };
  const body = items.map((it) => it.k === "t"
    ? `<path d="${it.c}" fill="none" stroke="#b23a2e" stroke-width="${it.w}" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="${it.d}" style="${tone[it.tone] ?? tone.ink}"${it.k === "f" ? filter[it.tone] ?? "" : ""}/>`).join("\n");
  const defs = `<defs><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>`
    + `<filter id="wet" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4"/>`
    + `<feDisplacementMap in="SourceGraphic" scale="5"/><feGaussianBlur stdDeviation="0.5"/></filter></defs>`;
  const guideBody = guides.map((d) => `<path d="${d}" fill="none" stroke="#3b82f6" stroke-opacity=".35" stroke-width=".6"/>`).join("\n");
  mkdirSync(PREVIEW, { recursive: true });
  writeFileSync(join(PREVIEW, `${drawing.name}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${drawing.width} ${drawing.height}" width="${drawing.width}" height="${drawing.height}">
${defs}<rect width="100%" height="100%" fill="#f2ebdd"/>
${body}
</svg>`);
  if (guides.length) {
    writeFileSync(join(PREVIEW, `${drawing.name}.guides.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${drawing.width} ${drawing.height}" width="${drawing.width}" height="${drawing.height}">
${defs}<rect width="100%" height="100%" fill="#f2ebdd"/>
${body}
${guideBody}
</svg>`);
  }
}

function guidesOf(name) {
  const drawing = readDrawing(name);
  return expand(drawing)
    .filter((e) => kindOf(e.attrs) === "guide" || process.env.ART_CENTERLINES)
    .flatMap((e) => flatten(e.d, e.matrix, 0.5).map((s) => toPath(s.points, s.closed)));
}

const wanted = process.argv.slice(2);
const names = wanted.length
  ? wanted
  : readdirSync(SOURCE).filter((f) => f.endsWith(".svg") && !f.startsWith("_")).map((f) => f.replace(/\.svg$/, ""));
for (const name of names) {
  const result = build(name);
  // Parts (art/_name.svg) are only ever included in other drawings
  const bytes = name.startsWith("_") ? 0 : writeModule(result);
  writePreview(result, guidesOf(name));
  console.log(`${name}: ${result.items.length} items${bytes ? `, ${(bytes / 1024).toFixed(1)} KB` : " (part, preview only)"}`);
}
