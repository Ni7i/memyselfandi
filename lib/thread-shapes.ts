/**
 * Paths for the thread that runs down the homepage.
 * Every scene enters at (x0, 0) and leaves at (x0, h), so the pieces line up into one thread.
 * Drawings are one continuous line, written as SVG paths (M, L, Q, C only) in a 100 x 100 box
 * and scaled into an anchor box measured from the layout.
 */

export type ThreadShape = "kid" | "line" | "coil" | "terminal" | "trophy" | "seal" | "plane";

export interface Box { x: number; y: number; w: number; h: number }
export interface ThreadContext { w: number; h: number; x0: number; box: Box | null }

type Point = [number, number];

/**
 * A kid on a chair that is too big: feet dangling, leaning towards an old box monitor
 * with a few lines of code on it. Starts and ends on the floor.
 */
const KID = `M0,95 L14,95
  L14,42 Q14,38 18,38 Q22,38 22,42 L22,68
  L36,68 L36,95 L36,68
  L26,66
  C24.5,60 25.5,54 29.5,50
  C27,47.5 25,42 27,37.5
  C29,33 35,31 38.5,34
  C39,31 41,30 42.5,30.5 C41,31.5 40.5,33 41,35
  C43,38 42.5,43 39.5,46
  C37.5,47.5 35,48.5 33,49.5
  C35.5,52.5 37,55.5 38,58 L47,58 L38,58
  C36,59 34,61 33.5,64.5
  L39,64.5 C40,69 40.5,74 40,78 L45,78 Q46.5,78 46,76.5 L41,76 L40,78 C40.5,74 40,69 39,64.5
  L42,60 L48,60 L48,95 L48,60
  L62,60 L63,56 L63,51 L57,51
  L57,47 L64,47 L57,47 L57,43 L71,43 L57,43 L57,39 L67,39 L57,39
  L57,33 L73,33 L73,51 L66,51 L66,56
  L56,56 Q54,56 54,54 L54,32 Q54,30 56,30 L74,30 Q76,30 76,32
  L76,34 C83,34 86.5,37 86.5,42 C86.5,47 83,50 76,50
  L76,54 Q76,56 74,56 L67,56 L67.5,60
  L90,60 L90,95 L100,95`;

/**
 * The same person, grown: upright on an office chair, feet on the floor, typing on a laptop
 * next to a big monitor full of code, a mug within reach.
 */
const GROWN = `M0,95 L12,95
  L20,91 L28,95 L20,91 L20,75
  L10,75 C7,66 8,54 12,46 C13,54 13,66 15,74.5
  L32,75 L20,72
  C18,63 18.5,52 21.5,44
  C21.5,42.5 22,41.5 22.5,40.5
  C19.5,39.5 18.5,35.5 19.8,32.5
  C21.2,29.6 25.4,29 27.6,31.2
  C29.6,33.2 29.4,37.2 27.2,39
  C26.4,39.7 25.6,40.2 25,40.6
  L25.5,43.5
  C28.5,48.5 30,53 31.5,56.5 L45,57.5 L31.5,56.5
  C29.5,58 28,63 27.5,71
  L40,71.5 C41.5,78 41.5,86 41,93 L47,92.5 Q49.5,93 49.5,95 L56,95
  L56,59 L45,59
  L60,59 L63.5,45 L60,59
  L72,59 L75,57 L79,57 L79,52.5
  L67,52.5 Q65,52.5 65,50.5 L65,25.5 Q65,23.5 67,23.5 L92,23.5 Q94,23.5 94,25.5 L94,50.5 Q94,52.5 92,52.5 L81,52.5
  L81,49.5 L68,49.5
  L68,45.5 L79,45.5 L68,45.5 L68,41.5 L86,41.5 L68,41.5 L68,37.5 L76,37.5 L68,37.5
  L68,33.5 L83,33.5 L68,33.5 L68,29.5 L74,29.5 L68,29.5
  L68,26.5 L91,26.5 L91,49.5 L81,49.5
  L81,57 L85,57 L87,59
  L88,59 L88,52.5 L93,52.5 L93,54 C96,54 96,58 93,58 L93,59
  L97,59 L97,95 L100,95`;

/** A window with three dots in its title bar and a prompt: ">_" */
const TERMINAL = `M0,18 L0,8 Q0,0 8,0 L92,0 Q100,0 100,8 L100,92 L100,18
  L96,18 C96,13 93,6 90,9 C87,12 93,14 92,11 C91,7 85,6 83,9 C80,12 86,14 85,11 C84,7 78,6 76,9 C73,12 79,14 78,11 C77,8 74,9 72,18
  L0,18
  L0,34 L46,34 L0,34 L0,48 L64,48 L0,48 L0,62 L38,62 L0,62
  L0,76 L22,76 L25,76 L25,69 L32,69 L32,79 L25,79 L25,76 L0,76
  L0,92 Q0,100 8,100 L92,100 Q100,100 100,92`;

/** Starts at the middle of the base, draws the cup and a star hanging from its rim like a medal */
const TROPHY = `M50,94 L33,94 L33,81 L45,78 L45,64
  C40,62 33,57 28,45
  C1,41 1,14 18,14 L18,6 L50,6
  L50,15 L53.5,23.5 L62.5,24 L55.5,29.5 L58,38 L50,33 L42,38 L44.5,29.5 L37.5,24 L46.5,23.5 L50,15 L50,6
  L82,6 L82,14
  C99,14 99,41 72,45
  C67,57 60,62 55,64 L55,78 L67,81 L67,94 L50,94`;

/** A paper plane at the end of a loop */
const PLANE = `M0,62 C14,62 22,86 14,94 C6,100 0,86 10,76 C18,68 26,64 34,60
  L100,8 L62,90 L44,56 L100,8 L36,72 L44,56`;

/** Maps every coordinate pair of a 100-box path into `box`. */
function placePath(d: string, box: Box) {
  const numbers = d.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  let i = 0;
  const point = (): Point => {
    const x = box.x + (numbers[i++] / 100) * box.w;
    const y = box.y + (numbers[i++] / 100) * box.h;
    return [x, y];
  };
  const body = d.replace(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/g, () => point().map(r).join(","));
  const start: Point = [box.x + (numbers[0] / 100) * box.w, box.y + (numbers[1] / 100) * box.h];
  const end: Point = [box.x + (numbers[numbers.length - 2] / 100) * box.w, box.y + (numbers[numbers.length - 1] / 100) * box.h];
  return { start, end, body: body.replace(/\s+/g, " ").trim() };
}

/** A rosette traced from its left edge, then a check mark that overshoots it */
function sealPath() {
  const bumps = 18;
  const at = (a: number, radius: number) => `${(50 - Math.cos(a) * radius).toFixed(2)},${(50 - Math.sin(a) * radius).toFixed(2)}`;
  let d = `M${at(0, 46)}`;
  for (let i = 0; i < bumps; i++) {
    const a0 = (i / bumps) * Math.PI * 2;
    const a1 = ((i + 1) / bumps) * Math.PI * 2;
    d += ` Q${at((a0 + a1) / 2, 52)} ${at(a1, 46)}`;
  }
  return `${d} C10,50 18,50 26,50 L42,66 L84,14`;
}

const r = (n: number) => Math.round(n * 10) / 10;

/** From the scene's top edge at x0 into a point, and from a point down to the bottom edge at x0. */
const enter = (x0: number, [x, y]: Point, pull: number) =>
  `M ${r(x0)},0 C ${r(x0)},${r(y * 0.7)} ${r(x - pull)},${r(y)} ${r(x)},${r(y)}`;
const leave = ([x, y]: Point, x0: number, h: number) =>
  `C ${r(x)},${r(y + (h - y) * 0.45)} ${r(x0)},${r(h - (h - y) * 0.35)} ${r(x0)},${r(h)}`;

export function threadPath(shape: ThreadShape, { w, h, x0, box }: ThreadContext): string {
  if (shape === "coil") {
    // Straight down the left margin with a small loop for every sentence
    const loops = 7;
    const radius = Math.min(26, Math.max(10, x0 * 0.9));
    let d = `M ${r(x0)},0`;
    for (let i = 0; i < loops; i++) {
      const y = (h * (i + 0.5)) / loops;
      d += ` L ${r(x0)},${r(y - radius)} C ${r(x0)},${r(y + radius * 1.4)} ${r(x0 + radius * 1.6)},${r(y + radius * 0.6)} ${r(x0 + radius * 1.1)},${r(y - radius * 0.4)}`
        + ` C ${r(x0 + radius * 0.6)},${r(y - radius * 1.2)} ${r(x0 - radius * 0.2)},${r(y - radius * 0.2)} ${r(x0)},${r(y + radius * 0.8)}`;
    }
    return `${d} L ${r(x0)},${r(h)}`;
  }

  if (shape === "line" || !box) return `M ${r(x0)},0 L ${r(x0)},${r(h)}`;

  if (shape === "kid") {
    // Falls from the top of the page, draws the kid on the left, walks along the floor
    // and draws the grown-up on the right, then carries on down.
    const small: Box = { x: box.x, y: box.y + box.h * 0.22, w: box.w * 0.4, h: box.h * 0.78 };
    const big: Box = { x: box.x + box.w * 0.45, y: box.y, w: box.w * 0.55, h: box.h };
    const young = placePath(KID, small);
    const grown = placePath(GROWN, big);
    const [sx, sy] = young.start;
    const side = Math.max(x0, sx - 50);
    return `M ${r(w * 0.5)},0 C ${r(w * 0.5)},${r(box.y * 0.6)} ${r(side)},${r(box.y * 0.3)} ${r(side)},${r(box.y + box.h * 0.35)}`
      + ` C ${r(side)},${r(sy - 30)} ${r(sx - 20)},${r(sy)} ${r(sx)},${r(sy)}`
      + ` ${young.body.replace(/^M\S+/, "")} L ${r(grown.start[0])},${r(grown.start[1])} ${grown.body.replace(/^M\S+/, "")} ${leave(grown.end, x0, h)}`;
  }

  const source = shape === "terminal" ? TERMINAL : shape === "trophy" ? TROPHY : shape === "plane" ? PLANE : sealPath();
  const symbol = placePath(source, box);
  const way = `${enter(x0, symbol.start, Math.min(160, box.w))} ${symbol.body.replace(/^M\S+/, "")}`;
  if (shape === "plane") return way;
  if (shape === "seal") {
    // Leave around the right of the seal instead of across it
    const [ex, ey] = symbol.end;
    const below = box.y + box.h * 1.12;
    return `${way} C ${r(ex + box.w * 0.35)},${r(ey + box.h * 0.2)} ${r(box.x + box.w * 1.2)},${r(below)} ${r(box.x + box.w * 0.5)},${r(below)}`
      + ` ${leave([box.x + box.w * 0.5, below], x0, h)}`;
  }
  return `${way} ${leave(symbol.end, x0, h)}`;
}
