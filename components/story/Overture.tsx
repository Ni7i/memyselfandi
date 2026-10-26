"use client";

import { useEffect, useRef } from "react";
import { Breeze } from "@/components/art/breeze";
import ArtFallback from "@/components/art/ArtFallback";
import InkArt, { inked } from "@/components/art/InkArt";
import { drawnAt, handoffX } from "./handoff";

/** Scene coordinates of the opening drawing (art/scene-bench.svg). */
const SCENE = { w: 1600, h: 900 };
/** Above his cap, in front of the brim: where the thought begins to climb. */
const ORIGIN = { x: 1112, y: 404 };
/** Narrow screens crop the scene around him. */
const FOCUS_X = 1112;

/*
 * The thread of scenes 1 and 2 is one path, drawn only by scrolling. Each piece continues
 * from where the last one ended:
 *   DROP   from above the page straight down to his hand (the same line as in the drawing)
 *   LOOP   once round his hand
 *   RISE   up in front of his face to above his cap
 *   then three small loops and the cloud, which depend on the screen and are built in thoughtPath
 */
const DROP = "M1074.6,-20 C1075.3,200 1076.1,450 1076.9,613.2";
const LOOP = " C1077.3,617.8 1076.9,620.2 1076.5,622.5 C1073,628.8 1066.8,635 1060.5,635 C1054.3,635 1054.3,628 1059.7,625.6 C1066.8,623.3 1074.6,628 1076.1,635";
const RISE = ` C1060,600 1030,560 1035,500 C1040,450 1080,420 ${ORIGIN.x},${ORIGIN.y}`;

/*
 * Pacing, as progress through the pinned overture (0 to 1). Each moment gets room to be read.
 */
const T = {
  hint: 0, // the thread already hangs into the page
  hand: 0.14, // it reaches his hand
  loop: 0.2, // and loops round it
  rise: 0.3, // climbs past his face
  loops: 0.38, // three loops of rising size
  cloud: 0.54, // and draws the thought around the sentence
  first: [0.53, 0.59, 0.7, 0.74], // the first sentence: in, out
  grow: [0.72, 0.86], // the thought opens until its light fills the page
  question: [0.84, 0.9],
  descent: [0.88, 0.995], // the thread comes down through the light and leaves for scene 3
};

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const f = (n: number) => n.toFixed(1);
const clampTo = (v: number, max: number) => (v < 0 ? 0 : v > max ? max : v);

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
    cx: narrow ? view.x + view.w * 0.5 : Math.min(ORIGIN.x - rx * 1.08, view.x + view.w * 0.52),
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
    d += `${i === 0 ? `M${f(x0)},${f(y0)}` : ""} A${f(radius)},${f(radius)} 0 0 0 ${f(x1)},${f(y1)}`;
  }
  return `${d} Z`;
}

const CLOUD_START = Math.PI * 0.32;

/** From above his cap: three small loops of rising size, then the cloud. Returns both pieces. */
function thoughtPieces(cloud: Cloud) {
  const entry = [cloud.cx + Math.cos(CLOUD_START) * cloud.rx, cloud.cy + Math.sin(CLOUD_START) * cloud.ry];
  let loops = "";
  [[0.22, 4], [0.47, 7.5], [0.74, 12]].forEach(([t, r]) => {
    const x = ORIGIN.x + (entry[0] - ORIGIN.x) * t + Math.sin(t * 7) * 6;
    const y = ORIGIN.y + (entry[1] - ORIGIN.y) * t;
    loops += ` Q${f(x + 10)},${f(y + 8)} ${f(x + r)},${f(y)} a${r},${r} 0 1 0 ${-2 * r},0 a${r},${r} 0 1 0 ${2 * r},0`;
  });
  loops += ` Q${f(entry[0] + 14)},${f(entry[1] + 26)} ${f(entry[0])},${f(entry[1])}`;
  return { loops, cloud: " " + scallops(cloud, CLOUD_START).replace(/^M[^ ]+/, "").replace(/ Z$/, "") };
}

/** The thread coming down through the lit page: from the top edge at x, one loop, out of the bottom at x. */
function descentPath(x: number, view: View) {
  const top = view.y - 6;
  const bottom = view.y + view.h + 6;
  const y = view.y + view.h * 0.6;
  const r = view.h * 0.035;
  // The loop turns away from the nearer edge of the frame
  const k = x > view.x + view.w * 0.8 ? -1 : 1;
  return `M${f(x)},${f(top)} C${f(x)},${f(top + (y - top) * 0.5)} ${f(x - k * r * 0.3)},${f(y - r * 2)} ${f(x)},${f(y - r)}`
    + ` C${f(x)},${f(y + r * 1.4)} ${f(x + k * r * 1.6)},${f(y + r * 0.6)} ${f(x + k * r * 1.1)},${f(y - r * 0.4)}`
    + ` C${f(x + k * r * 0.6)},${f(y - r * 1.2)} ${f(x - k * r * 0.2)},${f(y - r * 0.2)} ${f(x)},${f(y + r * 0.8)}`
    + ` C${f(x)},${f(y + (bottom - y) * 0.4)} ${f(x)},${f(bottom - 40)} ${f(x)},${f(bottom)}`;
}

/** Length of a path drawn from `d` (the element is reused for measuring). */
function lengthOf(probe: SVGPathElement, d: string) {
  probe.setAttribute("d", d);
  return probe.getTotalLength();
}

export default function Overture() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const sceneRef = useRef<SVGGElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const outlineRef = useRef<SVGPathElement>(null);
  const descentRef = useRef<SVGPathElement>(null);
  const cloudRef = useRef<SVGGElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const firstRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const scene = sceneRef.current!;
    // The drawing appears complete as soon as it arrives; from then on his hair moves in the wind
    let breeze: Breeze | null = null;
    let cancelled = false;
    inked(scene).then(() => {
      if (cancelled) return;
      breeze = new Breeze(scene);
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) breeze.play();
    });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        cancelled = true;
        breeze?.pause();
      };
    }

    // Scroll is the only clock: every line below is a function of how far the reader has scrolled
    section.classList.add("is-live");
    const stage = stageRef.current!;
    const svg = svgRef.current!;
    const thread = threadRef.current!;
    const outline = outlineRef.current!;
    const descent = descentRef.current!;
    const cloudGroup = cloudRef.current!;
    const fill = fillRef.current!;
    const first = firstRef.current!;

    let cloud = cloudFor(viewFor(innerWidth / innerHeight));
    let keys: [number, number][] = [[0, 0]];
    let total = 1;
    let toLoops = 1;
    let cloudLength = 1;
    let descentLength = 1;
    let frame = 0;

    const layout = () => {
      const view = viewFor(stage.clientWidth / stage.clientHeight);
      svg.setAttribute("viewBox", `${view.x} ${view.y} ${view.w} ${view.h}`);
      cloud = cloudFor(view);
      fill.setAttribute("d", scallops(cloud, CLOUD_START));

      // One path from above the page to the closed cloud; keyframes in length along it
      const pieces = thoughtPieces(cloud);
      const toHand = lengthOf(thread, DROP);
      const toLoop = lengthOf(thread, DROP + LOOP);
      const toRise = lengthOf(thread, DROP + LOOP + RISE);
      total = lengthOf(thread, DROP + LOOP + RISE + pieces.loops + pieces.cloud);
      toLoops = lengthOf(thread, DROP + LOOP + RISE + pieces.loops);
      // The cloud's outline is its own element, drawn above the cloud's light, so the way up
      // (below it) disappears behind the thought instead of crossing its sentence
      const entry = pieces.loops.match(/(-?[\d.]+),(-?[\d.]+)$/)!;
      cloudLength = lengthOf(outline, `M${entry[1]},${entry[2]}${pieces.cloud}`);
      outline.style.strokeDasharray = `${cloudLength} ${cloudLength}`;
      // Before the first scroll the thread already hangs well into the frame
      const hint = Math.max(0, view.y + view.h * 0.22 + 20);
      keys = [[T.hint, hint], [T.hand, toHand], [T.loop, toLoop], [T.rise, toRise], [T.loops, toLoops], [T.cloud, total]];
      thread.style.strokeDasharray = `${toLoops} ${total}`;

      // The thread leaves the scene where the next one picks it up
      const ctm = svg.getScreenCTM();
      const box = stage.getBoundingClientRect();
      if (ctm) {
        const x = new DOMPoint(box.left + handoffX(box.width, box.height), 0).matrixTransform(ctm.inverse()).x;
        descentLength = lengthOf(descent, descentPath(x, view));
        descent.style.strokeDasharray = `${descentLength} ${descentLength}`;
        // The first sentence sits in the middle of the cloud, as wide as the cloud allows
        const centre = new DOMPoint(cloud.cx, cloud.cy).matrixTransform(ctm);
        first.style.left = `${centre.x - box.left}px`;
        first.style.top = `${centre.y - box.top}px`;
        first.style.width = `${cloud.rx * 1.42 * ctm.a}px`;
      }
    };

    const render = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(1, rect.height - innerHeight));

      // The title leaves as the thread starts down towards him
      stage.style.setProperty("--intro-out", String(range(p, 0.05, 0.13)));
      const drawn = drawnAt(p, keys);
      thread.style.strokeDashoffset = String(toLoops - Math.min(drawn, toLoops));
      outline.style.strokeDashoffset = String(cloudLength - clampTo(drawn - toLoops, cloudLength));
      fill.style.opacity = String(range(p, T.cloud - 0.02, T.cloud + 0.04) * 0.96);
      stage.style.setProperty("--first", String(range(p, T.first[0], T.first[1]) * (1 - range(p, T.first[2], T.first[3]))));

      // The thought opens until its lamplight fills the page; the drawn line hands over to the
      // cloud's own edge, which keeps a pen's width as it grows
      const grow = ease(range(p, T.grow[0], T.grow[1]));
      const corners = [[0, 0], [SCENE.w, 0], [0, SCENE.h], [SCENE.w, SCENE.h]];
      const reach = Math.max(...corners.map(([x, y]) => Math.hypot((x - cloud.cx) / cloud.rx, (y - cloud.cy) / cloud.ry)));
      const s = 1 + grow * (reach * 1.4 - 1);
      cloudGroup.setAttribute("transform", `translate(${cloud.cx} ${cloud.cy}) scale(${s}) translate(${-cloud.cx} ${-cloud.cy})`);
      const handover = range(p, T.grow[0] - 0.01, T.grow[0] + 0.02);
      thread.style.opacity = String(1 - handover);
      outline.style.opacity = String(1 - handover);
      fill.style.strokeOpacity = String(handover);

      // Inside the thought: the question, and the thread coming down through the light
      stage.style.setProperty("--memory", String(range(p, T.question[0], T.question[1])));
      descent.style.strokeDashoffset = String(descentLength * (1 - ease(range(p, T.descent[0], T.descent[1]))));

      // His hair keeps moving while he is in view, scrolled or resting
      if (breeze) {
        if (p < T.grow[1] && !breeze.active) breeze.play();
        else if (p >= T.grow[1] && breeze.active) breeze.pause();
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      layout();
      schedule();
    };

    layout();
    render();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", resize);
    addEventListener("story:layout", resize);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      breeze?.pause();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", resize);
      removeEventListener("story:layout", resize);
    };
  }, []);

  return (
    <section ref={sectionRef} id="top" className="overture" aria-labelledby="overture-title">
      <div ref={stageRef} className="ov-stage">
        <svg ref={svgRef} className="ov-scene ink-host" viewBox={`0 0 ${SCENE.w} ${SCENE.h}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
          <g ref={sceneRef}><InkArt name="scene-bench" eager /></g>
          <path ref={threadRef} className="ov-thread" />
          <g ref={cloudRef} className="ov-cloud">
            <path ref={fillRef} className="ov-cloud-fill" vectorEffect="non-scaling-stroke" />
          </g>
          <path ref={outlineRef} className="ov-thread ov-outline" />
          <path ref={descentRef} className="ov-thread ov-descent" />
        </svg>
        <ArtFallback name="scene-bench" className="ov-scene" />

        <div className="ov-intro">
          <p className="ov-kicker">An illustrated autobiography · Limmattal, Switzerland</p>
          <h1 id="overture-title" className="ov-title">Enis Shorra</h1>
          <p className="ov-lede">Application developer in training. Eighteen. Still asking how things work.</p>
          <p className="ov-ways">
            <span className="ov-cue" aria-hidden="true">Scroll to follow the thread</span>
            <a className="ov-skip" href="#facts">or skip to the facts</a>
          </p>
        </div>

        <p ref={firstRef} className="ov-first">Everything I build goes back to one question.</p>

        <div className="ov-memory">
          <p className="ov-question">
            I kept asking it as a kid: <em>how does this work?</em>
          </p>
        </div>

        <p className="visually-hidden">
          Illustration: a young man in a flat cap, a long coat and an oatmeal scarf sits at the end of a park bench
          by the Limmat in Baden, looking up. A red thread drops from the top of the page and loops round his hand.
          It climbs past his face into a thought, and the thought opens into the light of a childhood memory.
        </p>
      </div>
    </section>
  );
}
