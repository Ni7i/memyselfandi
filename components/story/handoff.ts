/**
 * Where the thread crosses from one scene into the next: every scene's thread leaves its stage
 * at the bottom at this x, and the next one enters at the top at the same x, so the pieces join
 * into one line as the stages scroll past each other (stages are always the full window width).
 *
 * On wide screens it is the x of the waypoint the desk scene's thread drops through (between the
 * screen and the boy's face), so the thread falls straight into his hands. On narrow screens it
 * runs down the right margin, clear of the text, and crosses over once the text is passed.
 */
export function handoffX(width: number, height: number) {
  if (width < 860 || width / height <= 1) return width * 0.95;
  const run = document.querySelector<SVGSVGElement>("svg.thread-run[data-drop]");
  const stage = run?.parentElement;
  const art = run && stage?.querySelector<SVGSVGElement>(run.dataset.follow ?? "svg");
  const ctm = art?.getScreenCTM();
  if (!run || !stage || !ctm) return width * 0.62;
  const [x, y] = run.dataset.drop!.split(/[\s,]+/).map(Number);
  return ctm.a * x + ctm.c * y + ctm.e - stage.getBoundingClientRect().left;
}

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * How much of a thread is drawn at progress p, from keyframes of [progress, length].
 * Between keyframes the pen eases in and out, so the line slows into every arrival.
 */
export function drawnAt(p: number, keys: [number, number][]) {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [p1, l1] = keys[i];
    if (p <= p1) {
      const [p0, l0] = keys[i - 1];
      const t = clamp((p - p0) / Math.max(1e-6, p1 - p0));
      return l0 + (l1 - l0) * (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
    }
  }
  return keys[keys.length - 1][1];
}
