// Geometry for the art build: SVG path parsing, affine transforms, flattening,
// arc-length resampling and polygon simplification. Pure functions, no DOM.

const COMMAND = /[MmLlHhVvCcSsQqTtZzAa]|-?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;

/** Parses a path into absolute segments: { type: "M"|"L"|"C"|"Q"|"Z", points }. */
export function parsePath(d) {
  const tokens = d.match(COMMAND) ?? [];
  const segments = [];
  let i = 0;
  let command = "";
  let x = 0, y = 0, startX = 0, startY = 0;
  let lastControl = null;
  const number = () => {
    const value = Number(tokens[i++]);
    if (Number.isNaN(value)) throw new Error(`Bad number in path: ${d.slice(0, 60)}`);
    return value;
  };
  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) command = tokens[i++];
    const relative = command === command.toLowerCase();
    const ox = relative ? x : 0, oy = relative ? y : 0;
    switch (command.toUpperCase()) {
      case "M": {
        x = ox + number(); y = oy + number();
        startX = x; startY = y;
        segments.push({ type: "M", points: [[x, y]] });
        command = relative ? "l" : "L"; // following pairs are line-tos
        lastControl = null;
        break;
      }
      case "L": {
        x = ox + number(); y = oy + number();
        segments.push({ type: "L", points: [[x, y]] });
        lastControl = null;
        break;
      }
      case "H": { x = (relative ? x : 0) + number(); segments.push({ type: "L", points: [[x, y]] }); lastControl = null; break; }
      case "V": { y = (relative ? y : 0) + number(); segments.push({ type: "L", points: [[x, y]] }); lastControl = null; break; }
      case "C": {
        const c1 = [ox + number(), oy + number()];
        const c2 = [ox + number(), oy + number()];
        x = ox + number(); y = oy + number();
        segments.push({ type: "C", points: [c1, c2, [x, y]] });
        lastControl = c2;
        break;
      }
      case "S": {
        const c1 = lastControl ? [2 * x - lastControl[0], 2 * y - lastControl[1]] : [x, y];
        const c2 = [ox + number(), oy + number()];
        x = ox + number(); y = oy + number();
        segments.push({ type: "C", points: [c1, c2, [x, y]] });
        lastControl = c2;
        break;
      }
      case "Q": {
        const c = [ox + number(), oy + number()];
        x = ox + number(); y = oy + number();
        segments.push({ type: "Q", points: [c, [x, y]] });
        lastControl = c;
        break;
      }
      case "T": {
        const c = lastControl ? [2 * x - lastControl[0], 2 * y - lastControl[1]] : [x, y];
        x = ox + number(); y = oy + number();
        segments.push({ type: "Q", points: [c, [x, y]] });
        lastControl = c;
        break;
      }
      case "Z": {
        segments.push({ type: "Z", points: [] });
        x = startX; y = startY;
        lastControl = null;
        break;
      }
      default:
        throw new Error(`Unsupported path command "${command}" (arcs are not supported, use curves)`);
    }
  }
  return segments;
}

export const IDENTITY = [1, 0, 0, 1, 0, 0];

/** Multiplies affine matrices [a b c d e f] so that the result applies `inner` first. */
export function multiply(outer, inner) {
  const [a1, b1, c1, d1, e1, f1] = outer;
  const [a2, b2, c2, d2, e2, f2] = inner;
  return [
    a1 * a2 + c1 * b2, b1 * a2 + d1 * b2,
    a1 * c2 + c1 * d2, b1 * c2 + d1 * d2,
    a1 * e2 + c1 * f2 + e1, b1 * e2 + d1 * f2 + f1,
  ];
}

/** Parses an SVG transform attribute (translate, scale, rotate, matrix, skewX/Y). */
export function parseTransform(text) {
  let m = IDENTITY;
  if (!text) return m;
  for (const [, name, args] of text.matchAll(/(\w+)\s*\(([^)]*)\)/g)) {
    const v = args.split(/[\s,]+/).filter(Boolean).map(Number);
    let t = IDENTITY;
    if (name === "translate") t = [1, 0, 0, 1, v[0], v[1] ?? 0];
    else if (name === "scale") t = [v[0], 0, 0, v[1] ?? v[0], 0, 0];
    else if (name === "rotate") {
      const r = (v[0] * Math.PI) / 180, cos = Math.cos(r), sin = Math.sin(r);
      t = [cos, sin, -sin, cos, 0, 0];
      if (v.length === 3) t = multiply(multiply([1, 0, 0, 1, v[1], v[2]], t), [1, 0, 0, 1, -v[1], -v[2]]);
    } else if (name === "matrix") t = v;
    else if (name === "skewX") t = [1, 0, Math.tan((v[0] * Math.PI) / 180), 1, 0, 0];
    else if (name === "skewY") t = [1, Math.tan((v[0] * Math.PI) / 180), 0, 1, 0, 0];
    m = multiply(m, t);
  }
  return m;
}

export const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

/** Average linear scale of a matrix, used to scale line widths of included drawings. */
export const scaleOf = (m) => Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2]));

const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

function cubicAt(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}

/**
 * Flattens a path into polylines, one per subpath, after applying `matrix`.
 * Returns [{ points, closed }].
 */
export function flatten(d, matrix = IDENTITY, tolerance = 0.5) {
  const subpaths = [];
  let current = null;
  let pen = [0, 0];
  for (const segment of parsePath(d)) {
    if (segment.type === "M") {
      pen = segment.points[0];
      current = { points: [pen], closed: false };
      subpaths.push(current);
      continue;
    }
    if (!current) throw new Error("Path must start with M");
    if (segment.type === "Z") {
      const first = current.points[0];
      if (dist(pen, first) > 1e-6) current.points.push(first);
      current.closed = true;
      pen = first;
      continue;
    }
    const end = segment.points[segment.points.length - 1];
    if (segment.type === "L") {
      current.points.push(end);
    } else {
      const controls = segment.type === "Q"
        ? [pen, lerp(pen, segment.points[0], 2 / 3), lerp(end, segment.points[0], 2 / 3), end]
        : [pen, ...segment.points];
      const rough = dist(controls[0], controls[1]) + dist(controls[1], controls[2]) + dist(controls[2], controls[3]);
      const steps = Math.max(2, Math.ceil(rough / tolerance));
      for (let s = 1; s <= steps; s++) current.points.push(cubicAt(...controls, s / steps));
    }
    pen = end;
  }
  return subpaths
    .map(({ points, closed }) => ({ points: points.map((p) => apply(matrix, p)), closed }))
    .filter(({ points }) => points.length > 1);
}

export function lengthOf(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += dist(points[i - 1], points[i]);
  return total;
}

/** Resamples a polyline at (roughly) equal arc-length steps. Keeps both ends. */
export function resample(points, step) {
  const total = lengthOf(points);
  const count = Math.max(2, Math.round(total / step) + 1);
  const out = [points[0]];
  let segment = 1, walked = 0, segmentStart = 0;
  for (let k = 1; k < count - 1; k++) {
    const target = (total * k) / (count - 1);
    while (segment < points.length - 1 && segmentStart + dist(points[segment - 1], points[segment]) < target) {
      segmentStart += dist(points[segment - 1], points[segment]);
      segment++;
    }
    const length = dist(points[segment - 1], points[segment]) || 1;
    walked = (target - segmentStart) / length;
    out.push(lerp(points[segment - 1], points[segment], Math.min(1, Math.max(0, walked))));
  }
  out.push(points[points.length - 1]);
  return out;
}

/** Ramer-Douglas-Peucker on an open polyline. */
export function simplify(points, epsilon) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    const a = points[first], b = points[last];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const length = Math.hypot(dx, dy);
    let farthest = -1, max = 0;
    for (let i = first + 1; i < last; i++) {
      const p = points[i];
      // A closed outline starts and ends on the same point: measure from that point instead
      const d = length < 1e-6
        ? Math.hypot(p[0] - a[0], p[1] - a[1])
        : Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / length;
      if (d > max) { max = d; farthest = i; }
    }
    if (max > epsilon && farthest > 0) {
      keep[farthest] = 1;
      stack.push([first, farthest], [farthest, last]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const fmt = (n) => {
  const v = Math.round(n * 10) / 10;
  return Object.is(v, -0) ? "0" : String(v);
};

/** Writes points as a compact path: "M x,y x,y ..." (implicit line-tos), optionally closed. */
export function toPath(points, closed = false) {
  if (!points.length) return "";
  const body = points.map((p) => `${fmt(p[0])},${fmt(p[1])}`);
  return `M${body.join(" ")}${closed ? "Z" : ""}`;
}

/** Splits a polygon (closed polyline) into scanline segments at the given angle and spacing. */
export function hatchSegments(polygon, angleDeg, gap, phase = 0.5) {
  const r = (-angleDeg * Math.PI) / 180;
  const cos = Math.cos(r), sin = Math.sin(r);
  const rotate = ([x, y]) => [x * cos - y * sin, x * sin + y * cos];
  const back = ([x, y]) => [x * cos + y * sin, -x * sin + y * cos];
  const poly = polygon.map(rotate);
  const ys = poly.map((p) => p[1]);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const segments = [];
  for (let y = minY + gap * phase; y < maxY; y += gap) {
    const xs = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) {
        xs.push(a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
      }
    }
    xs.sort((p, q) => p - q);
    for (let i = 0; i + 1 < xs.length; i += 2) segments.push([back([xs[i], y]), back([xs[i + 1], y])]);
  }
  return segments;
}
