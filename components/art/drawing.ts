const SVG = "http://www.w3.org/2000/svg";
let maskCount = 0;

type Item = {
  el: SVGPathElement;
  kind: "b" | "f" | "t";
  t0: number;
  t1: number;
  /** Last applied local progress, so unchanged items cost nothing per frame. */
  last: number;
  mask?: SVGMaskElement;
  pen?: SVGPathElement;
};

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Draws a rendered <Art> group on and off. A pen stroke is revealed through a mask whose
 * own stroke runs along the centerline, so the ink appears the way it was laid down.
 * Masks exist only while a stroke is partly drawn; finished strokes are plain paths.
 */
export class Drawing {
  private items: Item[];
  private defs: SVGDefsElement;
  private progress = -1;

  constructor(group: SVGGElement) {
    const svg = group.ownerSVGElement!;
    let defs = svg.querySelector<SVGDefsElement>(":scope > defs.draw-masks");
    if (!defs) {
      defs = document.createElementNS(SVG, "defs");
      defs.setAttribute("class", "draw-masks");
      svg.insertBefore(defs, svg.firstChild);
    }
    this.defs = defs;
    this.items = Array.from(group.querySelectorAll<SVGPathElement>("path[data-t]")).map((el) => {
      const [t0, t1] = el.dataset.t!.split(" ").map(Number);
      const kind = el.classList.contains("a-b") ? "b" : el.classList.contains("a-t") ? "t" : "f";
      return { el, kind, t0, t1: Math.max(t1, t0 + 1e-4), last: -1 };
    });
  }

  /** Shows the drawing as it stands at `p` (0 = blank page, 1 = finished). */
  set(p: number) {
    if (p === this.progress) return;
    this.progress = p;
    for (const item of this.items) {
      const local = clamp((p - item.t0) / (item.t1 - item.t0));
      if (local === item.last) continue;
      item.last = local;
      const { el } = item;
      if (item.kind === "f") {
        el.style.opacity = String(local);
        continue;
      }
      if (item.kind === "t") {
        el.style.visibility = local > 0 ? "visible" : "hidden";
        el.style.strokeDasharray = "1 2";
        el.style.strokeDashoffset = String(1 - local);
        continue;
      }
      if (local <= 0 || local >= 1) {
        el.style.visibility = local > 0 ? "visible" : "hidden";
        if (item.mask) {
          el.removeAttribute("mask");
          item.mask.remove();
          item.mask = item.pen = undefined;
        }
        continue;
      }
      el.style.visibility = "visible";
      if (!item.mask) {
        const mask = document.createElementNS(SVG, "mask");
        mask.id = `draw-mask-${++maskCount}`;
        const pen = document.createElementNS(SVG, "path");
        pen.setAttribute("d", el.dataset.c!);
        pen.setAttribute("fill", "none");
        pen.setAttribute("stroke", "#fff");
        pen.setAttribute("stroke-width", el.dataset.w!);
        pen.setAttribute("stroke-linecap", "round");
        pen.setAttribute("stroke-linejoin", "round");
        pen.setAttribute("pathLength", "1");
        pen.setAttribute("stroke-dasharray", "1 2");
        mask.appendChild(pen);
        this.defs.appendChild(mask);
        el.setAttribute("mask", `url(#${mask.id})`);
        item.mask = mask;
        item.pen = pen;
      }
      item.pen!.setAttribute("stroke-dashoffset", String(1 - local));
    }
  }
}
