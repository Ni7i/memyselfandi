// Turns a centerline into the outline of a pen-and-ink stroke: thin entry,
// a full belly, a tapered exit and a little uneven pressure, like a dip pen.
import { lengthOf, resample, simplify } from "./geometry.mjs";

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (t) => t * t * (3 - 2 * t);

/** Deterministic pseudo random numbers per stroke. */
export function random(seed) {
  let s = (Math.floor(seed * 9301) ^ 0x5bd1e995) >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * @param points centerline polyline (already transformed)
 * @param o { width, taper: [start, end] as fractions, minRatio, pressure, seed, tolerance }
 * @returns closed outline polygon
 */
export function brushOutline(points, o) {
  const total = lengthOf(points);
  const width = o.width;
  if (total < width * 0.6) return dot(points[0], width * 0.55);

  const step = clamp(total / 80, 0.3, 0.9);
  const line = resample(points, step);
  const n = line.length;
  const rand = random(o.seed ?? 1);
  const phase1 = rand(), phase2 = rand(), phase3 = rand();
  const [taperStart, taperEnd] = o.taper ?? [0.2, 0.3];
  const minRatio = o.minRatio ?? 0.16;
  // Taper lengths are fractions of the stroke but never longer than a few pen widths times ten
  const startLength = Math.min(taperStart * total, width * 14);
  const endLength = Math.min(taperEnd * total, width * 18);
  const pressure = o.pressure ?? 0.12;

  const widths = new Array(n);
  let walked = 0;
  for (let i = 0; i < n; i++) {
    if (i > 0) walked += Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
    const u = walked / total;
    const enter = startLength > 0 ? smooth(clamp(walked / startLength)) : 1;
    const exit = endLength > 0 ? smooth(clamp((total - walked) / endLength)) : 1;
    const profile = Math.min(minRatio + (1 - minRatio) * Math.sqrt(enter), minRatio + (1 - minRatio) * Math.sqrt(exit));
    const wobble = 1
      + pressure * (0.65 * Math.sin(2 * Math.PI * (u * 1.1 + phase1)) + 0.35 * Math.sin(2 * Math.PI * (u * 2.7 + phase2)))
      + 0.035 * Math.sin(walked / 2.6 + phase3 * 6.28);
    widths[i] = Math.max(0.12, width * profile * wobble);
  }

  const left = [], right = [];
  for (let i = 0; i < n; i++) {
    const a = line[Math.max(0, i - 2)], b = line[Math.min(n - 1, i + 2)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const len = Math.hypot(tx, ty) || 1;
    tx /= len; ty /= len;
    const h = widths[i] / 2;
    left.push([line[i][0] - ty * h, line[i][1] + tx * h]);
    right.push([line[i][0] + ty * h, line[i][1] - tx * h]);
  }

  const cap = (center, from, to, radius) => {
    // Half circle from `from` to `to` around `center`, bulging away from the stroke
    const a0 = Math.atan2(from[1] - center[1], from[0] - center[0]);
    const pts = [];
    for (let k = 1; k < 6; k++) {
      const a = a0 - (Math.PI * k) / 6;
      pts.push([center[0] + Math.cos(a) * radius, center[1] + Math.sin(a) * radius]);
    }
    return pts.concat([to]);
  };

  const outline = [
    ...left,
    ...cap(line[n - 1], left[n - 1], right[n - 1], widths[n - 1] / 2),
    ...right.slice(0, -1).reverse(),
    ...cap(line[0], right[0], left[0], widths[0] / 2),
  ];
  return simplify(outline, o.tolerance ?? 0.09);
}

function dot([x, y], r) {
  const pts = [];
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2;
    pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
  }
  return pts;
}
