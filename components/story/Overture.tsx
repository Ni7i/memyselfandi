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
 *   then three small loops and a screen floating above him, where his thought appears; both depend
 *   on the size of the window and are built in thoughtPieces
 */
const DROP = "M1074.6,-20 C1075.3,200 1076.1,450 1076.9,613.2";
const LOOP = " C1077.3,617.8 1076.9,620.2 1076.5,622.5 C1073,628.8 1066.8,635 1060.5,635 C1054.3,635 1054.3,628 1059.7,625.6 C1066.8,623.3 1074.6,628 1076.1,635";
const RISE = ` C1060,600 1030,560 1035,500 C1040,450 1080,420 ${ORIGIN.x},${ORIGIN.y}`;

/*
 * Pacing, as progress through the pinned overture (0 to 1). Each moment gets room to be read.
 */
const T = {
  hint: 0, // the thread already hangs into the page
  quiet: [0.004, 0.05], // as soon as he scrolls, the town fades: only he, the bench and the tree remain
  hand: 0.12, // the thread reaches his hand
  loop: 0.17, // and loops round it
  rise: 0.26, // climbs past his face
  loops: 0.33, // three loops of rising size
  screen: 0.45, // and draws a screen in the air: his thought
  type: [0.46, 0.58], // the sentence types itself onto it
  first: [0.68, 0.71], // and leaves
  grow: [0.7, 0.83], // the screen opens until its light fills the page
  question: [0.82, 0.87],
  descent: [0.87, 0.995], // the thread comes down through the light and leaves for scene 3
};
const SENTENCE = "Everything I build goes back to one question.";

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const f = (n: number) => n.toFixed(1);
const clampTo = (v: number, max: number) => (v < 0 ? 0 : v > max ? max : v);

type View = { x: number; y: number; w: number; h: number };
/** The screen of his thought: centre and half sizes. */
type Cloud = { cx: number; cy: number; rx: number; ry: number };

function viewFor(aspect: number): View {
  // Wide screens lose a strip of sky so he is not lost in it; narrow screens crop around him
  const top = aspect > 1 ? 70 : 0;
  const h = SCENE.h - top;
  const w = Math.min(SCENE.w, h * aspect);
  return { x: Math.min(SCENE.w - w, Math.max(0, FOCUS_X - w * 0.56)), y: top, w, h };
}

function cloudFor(view: View): Cloud {
  const rx = Math.min(250, view.w * 0.4);
  const narrow = view.w < 900;
  return {
    // Up and to his left, clear of the cap, and inside the visible frame with room for the scallops
    cx: narrow ? view.x + view.w * 0.5 : Math.min(ORIGIN.x - rx * 1.08, view.x + view.w * 0.52),
    cy: view.y + view.h * (narrow ? 0.27 : 0.29),
    rx,
    ry: rx * 0.64,
  };
}

/**
 * A screen drawn as one line: a rounded rectangle that starts on its bottom edge, right of centre,
 * runs left and all the way round, and overshoots its start a little, as a hand would. Each edge
 * bows very slightly so it reads as drawn, not ruled.
 */
function screenPath({ cx, cy, rx, ry }: Cloud) {
  const r = Math.min(18, rx * 0.08);
  const [l, t, rt, b] = [cx - rx, cy - ry, cx + rx, cy + ry];
  const sx = cx + rx * 0.55;
  const edge = (x0: number, y0: number, x1: number, y1: number, bow: number) => {
    const nx = -(y1 - y0), ny = x1 - x0, n = Math.hypot(nx, ny) || 1;
    const ox = (nx / n) * bow, oy = (ny / n) * bow;
    return ` C${f(x0 + (x1 - x0) / 3 + ox)},${f(y0 + (y1 - y0) / 3 + oy)} ${f(x0 + ((x1 - x0) * 2) / 3 + ox)},${f(y0 + ((y1 - y0) * 2) / 3 + oy)} ${f(x1)},${f(y1)}`;
  };
  return `M${f(sx)},${f(b)}`
    + edge(sx, b, l + r, b, 1.2) + ` Q${f(l)},${f(b)} ${f(l)},${f(b - r)}`
    + edge(l, b - r, l, t + r, -1) + ` Q${f(l)},${f(t)} ${f(l + r)},${f(t)}`
    + edge(l + r, t, rt - r, t, 1.4) + ` Q${f(rt)},${f(t)} ${f(rt)},${f(t + r)}`
    + edge(rt, t + r, rt, b - r, -0.8) + ` Q${f(rt)},${f(b)} ${f(rt - r)},${f(b)}`
    + edge(rt - r, b, sx - 8, b + 0.6, 0.6);
}

/** After the screen closes, the same line draws its neck and foot, like the monitor of his childhood. */
function standPath({ cx, cy, rx, ry }: Cloud) {
  const b = cy + ry, n = rx * 0.06, h = ry * 0.22, w = rx * 0.32;
  return ` C${f(cx + rx * 0.3)},${f(b + 2)} ${f(cx + n + 4)},${f(b)} ${f(cx + n)},${f(b + 2)}`
    + ` L${f(cx + n * 0.8)},${f(b + h)} C${f(cx + w * 0.6)},${f(b + h + 1)} ${f(cx + w)},${f(b + h + 3)} ${f(cx + w)},${f(b + h + 6)}`
    + ` L${f(cx - w)},${f(b + h + 6)} C${f(cx - w)},${f(b + h + 3)} ${f(cx - w * 0.6)},${f(b + h + 1)} ${f(cx - n * 0.8)},${f(b + h)}`
    + ` L${f(cx - n)},${f(b + 2)}`;
}

/** From above his cap: three small loops of rising size, then the screen. Returns both pieces. */
function thoughtPieces(cloud: Cloud) {
  const entry = [cloud.cx + cloud.rx * 0.55, cloud.cy + cloud.ry];
  let loops = "";
  [[0.22, 4], [0.47, 7.5], [0.74, 12]].forEach(([t, r]) => {
    const x = ORIGIN.x + (entry[0] - ORIGIN.x) * t + Math.sin(t * 7) * 6;
    const y = ORIGIN.y + (entry[1] - ORIGIN.y) * t;
    loops += ` Q${f(x + 10)},${f(y + 8)} ${f(x + r)},${f(y)} a${r},${r} 0 1 0 ${-2 * r},0 a${r},${r} 0 1 0 ${2 * r},0`;
  });
  loops += ` Q${f(entry[0] + 14)},${f(entry[1] + 26)} ${f(entry[0])},${f(entry[1])}`;
  return { loops, cloud: " " + screenPath(cloud).replace(/^M[^ C]+/, "") + standPath(cloud) };
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
    let setting: SVGGElement | null = null;
    let onInked = () => {};
    inked(scene).then(() => {
      if (cancelled) return;
      breeze = new Breeze(scene);
      // The plane tree leans with the same air, a moment after his hair, around the foot of its trunk
      const tree = scene.querySelector('g[data-layer="tree"]');
      if (tree) breeze.addGroup(tree, 1517, 768, -0.9, 0.9);
      setting = scene.querySelector('g[data-layer="setting"]');
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) breeze.play();
      onInked();
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
    const letters = Array.from(first.querySelectorAll<HTMLSpanElement>("span"));
    let typed = -1;

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
      fill.setAttribute("d", `${screenPath(cloud)} Z`);

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
      keys = [[T.hint, hint], [T.hand, toHand], [T.loop, toLoop], [T.rise, toRise], [T.loops, toLoops], [T.screen, total]];
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
        first.style.width = `${cloud.rx * 1.6 * ctm.a}px`;
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
      fill.style.opacity = String(range(p, T.screen - 0.02, T.screen + 0.01) * 0.96);
      // As soon as he scrolls, the town fades and leaves him alone with the bench and the tree
      if (setting) setting.style.opacity = String(1 - range(p, T.quiet[0], T.quiet[1]));
      // The sentence types itself onto the screen, letter by letter, as far as the reader has scrolled
      const shown = Math.round(range(p, T.type[0], T.type[1]) * letters.length);
      if (shown !== typed) {
        letters.forEach((letter, i) => (letter.style.opacity = i < shown ? "1" : "0"));
        typed = shown;
      }
      stage.style.setProperty("--first", String(p >= T.type[0] ? 1 - range(p, T.first[0], T.first[1]) : 0));

      // The thought opens until its lamplight fills the page; the drawn line hands over to the
      // cloud's own edge, which keeps a pen's width as it grows
      const grow = ease(range(p, T.grow[0], T.grow[1]));
      const corners = [[0, 0], [SCENE.w, 0], [0, SCENE.h], [SCENE.w, SCENE.h]];
      const reach = Math.max(...corners.map(([x, y]) => Math.max(Math.abs(x - cloud.cx) / cloud.rx, Math.abs(y - cloud.cy) / cloud.ry)));
      const s = 1 + grow * (reach * 1.15 - 1);
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
    onInked = schedule;
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

        <p ref={firstRef} className="ov-first" aria-label={SENTENCE}>
          {SENTENCE.split("").map((letter, i) => (
            <span key={i} aria-hidden="true">{letter}</span>
          ))}
        </p>

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
