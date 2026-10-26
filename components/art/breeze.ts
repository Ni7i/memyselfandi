/**
 * A light breeze in his hair. Every stroke marked data-sway turns a little around the point
 * where it grows from. The angle is a few slow waves that never quite repeat, plus soft gusts
 * that arrive from in front of him and travel back through the hair, so it reads as weather,
 * not as a loop.
 */
const AMPLITUDE: Record<string, number> = { curl: 6, wisp: 11, light: 3 };
/** Seconds a gust needs to travel from the curl at his brow to the wisps at the back. */
const LAG: Record<string, number> = { curl: 0, light: 0.35, wisp: 0.55 };

type Strand = { el: SVGPathElement; x: number; y: number; amp: number; lag: number; phase: number };

export class Breeze {
  private strands: Strand[];
  private frame = 0;
  private start = 0;
  private elapsed = 0;

  constructor(group: Element) {
    this.strands = Array.from(group.querySelectorAll<SVGPathElement>("path[data-sway]")).map((el, i) => {
      const kind = el.dataset.sway ?? "wisp";
      const [x, y] = (el.dataset.c ?? "M0,0").slice(1).split(/[ ,]/).map(Number);
      return { el, x, y, amp: AMPLITUDE[kind] ?? 4, lag: (LAG[kind] ?? 0.4) + i * 0.06, phase: i * 1.7 };
    });
  }

  get active() {
    return this.frame !== 0;
  }

  play() {
    if (this.frame || !this.strands.length) return;
    this.start = performance.now() - this.elapsed;
    const tick = (now: number) => {
      this.elapsed = now - this.start;
      this.apply(this.elapsed / 1000);
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  pause() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  private apply(t: number) {
    for (const s of this.strands) {
      const local = t - s.lag;
      // Slow gusts: positive only, they push the hair back and let it fall again
      const gust = Math.max(0, Math.sin(local * 0.31) * 0.6 + Math.sin(local * 0.53 + 1.3) * 0.5);
      // Restless air underneath
      const flutter = Math.sin(local * 1.3 + s.phase) * 0.28 + Math.sin(local * 2.9 + s.phase * 0.7) * 0.12;
      // Negative turns counterclockwise: the wind comes from in front of him and lays the hair back
      const angle = -s.amp * (gust * 0.8 + flutter);
      s.el.setAttribute("transform", `rotate(${angle.toFixed(2)} ${s.x} ${s.y})`);
    }
  }
}
