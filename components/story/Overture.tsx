"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Drawing } from "@/components/art/drawing";

/** Scene coordinates of the opening drawing (art/scene-bench.svg). */
const SCENE = { w: 1600, h: 900 };
/** Top of his cap, where the thought leaves him. */
const HEAD = { x: 1141, y: 432 };
/** Narrow screens crop the scene around him. */
const FOCUS_X = 1112;
const INTRO_MS = 3600;

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

type View = { x: number; y: number; w: number; h: number };
type Cloud = { cx: number; cy: number; rx: number; ry: number };

function viewFor(aspect: number): View {
  // Wide screens lose a strip of sky so he is not lost in it; narrow screens crop around him
  const top = aspect > 1 ? 70 : 0;
  const h = SCENE.h - top;
  const w = Math.min(SCENE.w, h * aspect);
  return { x: Math.min(SCENE.w - w, Math.max(0, FOCUS_X - w * 0.56)), y: top, w, h };
}

function cloudFor(view: View): Cloud {
  const rx = Math.min(265, view.w * 0.4);
  const narrow = view.w < 900;
  return {
    // Up and to his left, clear of the cap, and inside the visible frame with room for the scallops
    cx: narrow ? view.x + view.w * 0.5 : Math.min(HEAD.x - rx * 1.08, view.x + view.w * 0.52),
    cy: view.y + view.h * (narrow ? 0.27 : 0.29),
    rx,
    ry: rx * 0.56,
  };
}

/** A cloud drawn as one line of scallops around an ellipse, starting at its lower right. */
function scallops({ cx, cy, rx, ry }: Cloud, start: number) {
  const bumps = 11;
  const point = (a: number) => [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  let d = "";
  for (let i = 0; i < bumps; i++) {
    const a0 = start - (i / bumps) * Math.PI * 2;
    const a1 = start - ((i + 1) / bumps) * Math.PI * 2;
    const [x0, y0] = point(a0);
    const [x1, y1] = point(a1);
    const radius = Math.hypot(x1 - x0, y1 - y0) * (0.56 + (i % 3) * 0.04);
    d += `${i === 0 ? `M${x0.toFixed(1)},${y0.toFixed(1)}` : ""} A${radius.toFixed(1)},${radius.toFixed(1)} 0 0 0 ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }
  return `${d} Z`;
}

/** The thread climbing from his cap: three small loops of rising size, then the cloud. */
function thoughtPath(cloud: Cloud) {
  const start = Math.PI * 0.32;
  const entry = [cloud.cx + Math.cos(start) * cloud.rx, cloud.cy + Math.sin(start) * cloud.ry];
  let d = `M${HEAD.x},${HEAD.y}`;
  [[0.22, 4], [0.47, 7.5], [0.74, 12]].forEach(([t, r]) => {
    const x = HEAD.x + (entry[0] - HEAD.x) * t + Math.sin(t * 7) * 6;
    const y = HEAD.y + (entry[1] - HEAD.y) * t;
    d += ` Q${(x + 10).toFixed(1)},${(y + 8).toFixed(1)} ${(x + r).toFixed(1)},${y.toFixed(1)}`
      + ` a${r},${r} 0 1 0 ${-2 * r},0 a${r},${r} 0 1 0 ${2 * r},0`;
  });
  d += ` Q${(entry[0] + 14).toFixed(1)},${(entry[1] + 26).toFixed(1)} ${entry[0].toFixed(1)},${entry[1].toFixed(1)}`;
  return d + " " + scallops(cloud, start).replace(/^M[^ ]+/, "");
}

interface Props {
  /** The opening drawing, rendered on the server as <Art>. */
  scene: ReactNode;
  /** The childhood drawing that appears inside the thought. */
  memory: ReactNode;
}

export default function Overture({ scene, memory }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const sceneRef = useRef<SVGGElement>(null);
  const memoryRef = useRef<SVGGElement>(null);
  const thoughtRef = useRef<SVGPathElement>(null);
  const cloudRef = useRef<SVGGElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const firstRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const section = sectionRef.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("draw-pending");
      return;
    }
    const stage = stageRef.current!;
    const svg = svgRef.current!;
    const thought = thoughtRef.current!;
    const cloudGroup = cloudRef.current!;
    const fill = fillRef.current!;
    const first = firstRef.current!;
    const bench = new Drawing(sceneRef.current!);
    const child = new Drawing(memoryRef.current!);
    bench.set(0);
    child.set(0);
    section.classList.add("is-live");
    root.classList.remove("draw-pending");

    let cloud: Cloud = cloudFor(viewFor(innerWidth / innerHeight));
    let introStart = performance.now();
    let introDone = false;
    let frame = 0;

    const layout = () => {
      const view = viewFor(stage.clientWidth / stage.clientHeight);
      svg.setAttribute("viewBox", `${view.x} ${view.y} ${view.w} ${view.h}`);
      cloud = cloudFor(view);
      thought.setAttribute("d", thoughtPath(cloud));
      fill.setAttribute("d", scallops(cloud, Math.PI * 0.32));
      // The first sentence sits in the middle of the cloud, as wide as the cloud allows
      const ctm = svg.getScreenCTM();
      const box = stage.getBoundingClientRect();
      if (ctm) {
        const centre = new DOMPoint(cloud.cx, cloud.cy).matrixTransform(ctm);
        first.style.left = `${centre.x - box.left}px`;
        first.style.top = `${centre.y - box.top}px`;
        first.style.width = `${cloud.rx * 1.42 * ctm.a}px`;
      }
    };

    const render = (now: number) => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(1, rect.height - innerHeight));

      // Scene 1 draws itself on arrival; scrolling early finishes it quickly instead of skipping it
      if (!introDone) {
        if (p > 0.012 && now - introStart < INTRO_MS - 500) introStart = now - (INTRO_MS - 500);
        const t = clamp((now - introStart) / INTRO_MS);
        bench.set(ease(t));
        introDone = t >= 1;
        if (!introDone) frame = requestAnimationFrame(render);
      }

      // Scene 1 text leaves before the thought rises
      stage.style.setProperty("--intro-out", String(range(p, 0.07, 0.14)));
      // The thread climbs from his cap, loops three times and draws the cloud
      thought.style.strokeDashoffset = String(1 - ease(range(p, 0.12, 0.34)));
      fill.style.opacity = String(range(p, 0.3, 0.36) * 0.96);
      stage.style.setProperty("--first", String(range(p, 0.31, 0.37) * (1 - range(p, 0.5, 0.56))));
      // The cloud opens until its lamplight fills the page
      const grow = ease(range(p, 0.5, 0.72));
      const corners = [[0, 0], [SCENE.w, 0], [0, SCENE.h], [SCENE.w, SCENE.h]];
      const reach = Math.max(...corners.map(([x, y]) => Math.hypot((x - cloud.cx) / cloud.rx, (y - cloud.cy) / cloud.ry)));
      const s = 1 + grow * (reach * 1.4 - 1);
      cloudGroup.setAttribute("transform", `translate(${cloud.cx} ${cloud.cy}) scale(${s}) translate(${-cloud.cx} ${-cloud.cy})`);
      // As it opens, the drawn line hands over to the cloud's own edge, which keeps a pen's width
      const handover = range(p, 0.49, 0.52);
      thought.style.opacity = String(1 - handover);
      fill.style.strokeOpacity = String(handover);
      // Inside the thought: the question, then Enis at three with the mouse
      stage.style.setProperty("--memory", String(range(p, 0.68, 0.76)));
      child.set(range(p, 0.72, 0.95));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      layout();
      schedule();
    };

    layout();
    frame = requestAnimationFrame(render);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section ref={sectionRef} className="overture" aria-labelledby="overture-title">
      <div ref={stageRef} className="ov-stage">
        <svg ref={svgRef} className="ov-scene" viewBox={`0 0 ${SCENE.w} ${SCENE.h}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
          <g ref={sceneRef}>{scene}</g>
          <g ref={cloudRef} className="ov-cloud">
            <path ref={fillRef} className="ov-cloud-fill" vectorEffect="non-scaling-stroke" />
          </g>
          <path ref={thoughtRef} className="ov-thought" pathLength={1} />
        </svg>

        <div className="ov-intro">
          <p className="ov-kicker">An illustrated autobiography · Limmattal, Switzerland</p>
          <h1 id="overture-title" className="ov-title">Enis Shorra</h1>
          <p className="ov-lede">Application developer in training. Eighteen. Still asking how things work.</p>
          <p className="ov-cue" aria-hidden="true">Follow the thread</p>
        </div>

        <p ref={firstRef} className="ov-first">Everything I build goes back to one question.</p>

        <div className="ov-memory">
          <p className="ov-question">
            I kept asking it as a kid: <em>how does this work?</em>
          </p>
          <svg className="ov-child" viewBox="0 0 320 360" aria-hidden="true" focusable="false">
            <g ref={memoryRef}>{memory}</g>
          </svg>
        </div>

        <p className="visually-hidden">
          Illustration: a young man in a flat cap, a long coat and an oatmeal scarf sits at the end of a park bench
          by the Limmat in Baden, looking up. A red thread drops from the top of the page into his hand. It rises from
          his cap into a thought, and inside the thought he is three years old, holding a computer mouse.
        </p>
      </div>
    </section>
  );
}
