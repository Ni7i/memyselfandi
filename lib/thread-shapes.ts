/**
 * Paths for the thread that runs down the homepage.
 * Every scene enters at (x0, 0) and leaves at (x0, h), so the pieces line up into one thread.
 * Drawings and symbols are written in unit coordinates and scaled into an anchor box
 * measured from the layout.
 */

export type ThreadShape = "kid" | "line" | "zigzag" | "terminal" | "trophy" | "seal" | "plane";

export interface Box { x: number; y: number; w: number; h: number }
export interface ThreadContext { w: number; h: number; x0: number; box: Box | null }

type Point = [number, number];
type Segment = ["L", Point] | ["Q", Point, Point] | ["C", Point, Point, Point];
interface Stroke { start: Point; path: Segment[] }

/**
 * Someone at a desk, side view, in a 100 x 100 box: floor, desk, laptop, arm, head, back,
 * stool and legs, all in one line. `grown` adds a monitor, a longer back and a smaller head.
 */
function deskFigure(grown: boolean): Stroke {
  const shoulder: Point = grown ? [40, 44] : [42, 52];
  const hip: Point = [40, 70];
  const r = grown ? 6 : 8;
  const cx = shoulder[0] - 1;
  const cy = shoulder[1] - r - 1;
  const path: Segment[] = [
    ["L", [100, 95]], ["L", [92, 95]], ["L", [92, 60]], ["L", [56, 60]],
    ["L", [56, 95]], ["L", [56, 60]],
    ...(grown
      ? ([["L", [74, 60]], ["L", [74, 50]], ["L", [64, 50]], ["L", [64, 24]], ["L", [96, 24]], ["L", [96, 50]], ["L", [74, 50]], ["L", [74, 60]]] as Segment[])
      : []),
    ["L", [62, 60]], ["L", [80, 60]], ["L", [grown ? 84 : 85, grown ? 46 : 41]], ["L", [80, 60]],
    ["L", [66, 59]], ["L", [55, 57]], ["L", shoulder],
    ["C", [cx - r * 1.3, shoulder[1]], [cx - r * 1.3, cy - r], [cx, cy - r]],
    ["C", [cx + r * 1.3, cy - r], [cx + r * 1.3, shoulder[1] - 1], shoulder],
    ["L", hip], ["L", [38, 72]], ["L", [38, 95]], ["L", [38, 72]], ["L", [30, 72]], ["L", [47, 72]],
    ["L", [54, 71]], ["L", [55, 84]], ["L", [60, 84]],
  ];
  return { start: [0, 95], path };
}

const SYMBOLS: Record<"terminal" | "trophy" | "seal" | "plane", Stroke> = {
  // A window with a prompt: ">_"
  terminal: {
    start: [0, 0.5],
    path: [
      ["L", [0, 0.08]], ["Q", [0, 0], [0.06, 0]],
      ["L", [0.94, 0]], ["Q", [1, 0], [1, 0.08]],
      ["L", [1, 0.92]], ["Q", [1, 1], [0.94, 1]],
      ["L", [0.06, 1]], ["Q", [0, 1], [0, 0.92]],
      ["L", [0, 0.2]], ["L", [1, 0.2]],
      ["Q", [0.5, 0.26], [0.16, 0.4]],
      ["L", [0.32, 0.54]], ["L", [0.16, 0.68]],
      ["Q", [0.26, 0.74], [0.38, 0.7]], ["L", [0.6, 0.7]],
    ],
  },
  // Cup with two handles, stem and base
  trophy: {
    start: [0.2, 0.08],
    path: [
      ["L", [0.8, 0.08]], ["L", [0.8, 0.15]],
      ["C", [0.99, 0.15], [0.99, 0.42], [0.73, 0.44]],
      ["C", [0.67, 0.56], [0.61, 0.6], [0.55, 0.62]],
      ["L", [0.55, 0.78]], ["L", [0.68, 0.8]], ["L", [0.68, 0.92]],
      ["L", [0.32, 0.92]], ["L", [0.32, 0.8]], ["L", [0.45, 0.78]],
      ["L", [0.45, 0.62]],
      ["C", [0.39, 0.6], [0.33, 0.56], [0.27, 0.44]],
      ["C", [0.01, 0.42], [0.01, 0.15], [0.2, 0.15]],
      ["L", [0.2, 0.08]],
    ],
  },
  // A seal with a check mark: the guarantee
  seal: {
    start: [0.5, 0.02],
    path: [
      ["C", [0.78, 0.02], [0.98, 0.22], [0.98, 0.5]],
      ["C", [0.98, 0.78], [0.78, 0.98], [0.5, 0.98]],
      ["C", [0.22, 0.98], [0.02, 0.78], [0.02, 0.5]],
      ["C", [0.02, 0.22], [0.22, 0.02], [0.5, 0.02]],
      ["Q", [0.4, 0.2], [0.27, 0.5]],
      ["L", [0.43, 0.68]], ["L", [0.76, 0.32]],
    ],
  },
  plane: {
    start: [0, 0.46],
    path: [
      ["L", [1, 0]], ["L", [0.6, 0.72]], ["L", [0.42, 0.44]],
      ["L", [1, 0]], ["L", [0.36, 0.56]], ["L", [0.42, 0.44]],
    ],
  },
};

const r = (n: number) => Math.round(n * 10) / 10;

/** Places a stroke into a box; `unit` is the size of its coordinate system (1 or 100). */
function place({ start, path }: Stroke, box: Box, unit = 1) {
  const map = ([u, v]: Point): Point => [box.x + (u / unit) * box.w, box.y + (v / unit) * box.h];
  const at = (point: Point) => map(point).map(r).join(",");
  const body = path.map(([cmd, ...points]) => `${cmd} ${points.map(at).join(" ")}`).join(" ");
  const last = path[path.length - 1];
  return { start: map(start), end: map(last[last.length - 1] as Point), body };
}

/** From the scene's top edge at x0 into a point, and from a point down to the bottom edge at x0. */
const enter = (x0: number, [x, y]: Point, pull: number) =>
  `M ${r(x0)},0 C ${r(x0)},${r(y * 0.7)} ${r(x - pull)},${r(y)} ${r(x)},${r(y)}`;
const leave = ([x, y]: Point, x0: number, h: number) =>
  `C ${r(x)},${r(y + (h - y) * 0.45)} ${r(x0)},${r(h - (h - y) * 0.35)} ${r(x0)},${r(h)}`;

export function threadPath(shape: ThreadShape, { w, h, x0, box }: ThreadContext): string {
  if (shape === "line" || !box && shape !== "zigzag") return `M ${r(x0)},0 L ${r(x0)},${r(h)}`;

  if (shape === "zigzag") {
    // Swings across the scene and back, one loop per beat, like handwriting going on
    const turns = 6;
    let d = `M ${r(x0)},0`;
    for (let i = 0; i < turns; i++) {
      const y0 = (h * i) / turns;
      const y1 = (h * (i + 1)) / turns;
      const far = i % 2 === 0 ? w * 0.42 : x0;
      d += ` C ${r(far)},${r(y0 + (y1 - y0) * 0.1)} ${r(far)},${r(y1 - (y1 - y0) * 0.1)} ${r(i === turns - 1 ? x0 : (far + x0) / 2)},${r(y1)}`;
    }
    return d;
  }

  if (shape === "kid") {
    // The thread falls from the top of the page, draws the young version on the left,
    // walks along the floor and draws the grown-up version on the right, then carries on.
    const small: Box = { x: box!.x, y: box!.y + box!.h * 0.3, w: box!.w * 0.38, h: box!.h * 0.7 };
    const big: Box = { x: box!.x + box!.w * 0.42, y: box!.y, w: box!.w * 0.58, h: box!.h };
    const young = place(deskFigure(false), small, 100);
    const grown = place(deskFigure(true), big, 100);
    return `M ${r(w * 0.5)},0 C ${r(w * 0.5)},${r(young.start[1] * 0.5)} ${r(young.start[0])},${r(young.start[1] * 0.8)} ${r(young.start[0])},${r(young.start[1])}`
      + ` ${young.body} L ${r(grown.start[0])},${r(grown.start[1])} ${grown.body} ${leave(grown.end, x0, h)}`;
  }

  const symbol = place(SYMBOLS[shape], box!);
  const way = `${enter(x0, symbol.start, Math.min(160, box!.w))} ${symbol.body}`;
  return shape === "plane" ? way : `${way} ${leave(symbol.end, x0, h)}`;
}
