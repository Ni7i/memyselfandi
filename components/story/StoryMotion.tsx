"use client";

import { useEffect } from "react";
import { Drawing } from "@/components/art/drawing";
import { drawnAt, handoffX } from "./handoff";

/**
 * Brings the chapters after the overture to life. Chapters are server-rendered and complete;
 * this finds them in the page and ties their drawings, threads and lines of text to the scroll.
 *
 *   <section data-chapter="pin">   a pinned stage (.ch-stage); progress runs while it is held on screen.
 *                                  Where the layout does not pin it (small screens), its parts
 *                                  follow their own position instead
 *   <section data-chapter="flow">  scrolls normally; progress runs while it passes through
 *   [data-drawing="a b"]           an <Art> group that draws itself between a and b
 *   [data-thread="a b"]            a path with pathLength=1 that the thread draws between a and b
 *   [data-show="a b"]              fades in between a and b, through the --show custom property
 *   [data-own]                     on any of the above: progress comes from the element's own
 *                                  position on screen instead of the chapter's
 *
 * With reduced motion nothing is touched and every chapter stays laid out complete.
 */

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

type Part = { el: Element; a: number; b: number; own: boolean; apply: (t: number) => void; last: number };
type Run = {
  svg: SVGSVGElement;
  path: SVGPathElement;
  a: number;
  b: number;
  enter: number;
  total: number;
  ready: boolean;
  /** Chapter progress at which each red line in the scene is drawn to its end (data-stops). */
  stops: number[];
  /** The thread's length at the end of each red line, in step with stops. */
  ends: number[];
};
type Chapter = { el: HTMLElement; stage: HTMLElement | null; pinned: boolean; parts: Part[]; runs: Run[]; visible: boolean };

type ToStage = (x: number, y: number) => number[];

/** A red line's points in stage pixels: its own corners where it is a polyline, samples along it where it curves. */
function trace(line: SVGPathElement, map: ToStage) {
  const d = line.getAttribute("d") ?? "";
  if (/^[ML\d\s.,-]*$/.test(d)) {
    const n = d.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    const points: number[][] = [];
    for (let i = 0; i + 1 < n.length; i += 2) points.push(map(n[i], n[i + 1]));
    return points;
  }
  const length = line.getTotalLength();
  const count = Math.min(900, Math.max(8, Math.ceil(length / 1.2)));
  return Array.from({ length: count + 1 }, (_, i) => {
    const p = line.getPointAtLength((length * i) / count);
    return map(p.x, p.y);
  });
}

/**
 * Lays out a thread run: straight down from the top edge at the handoff x, a curve into the start
 * of the scene's first red line, then along each red line in turn (the drawing's own line, or one
 * object after another), mapped from drawing to stage coordinates, and out at the bottom.
 */
function layoutRun(run: Run) {
  const stage = run.svg.parentElement!;
  const follow = run.svg.dataset.follow ?? "svg";
  const art = stage.querySelector<SVGSVGElement>(follow);
  const lines = Array.from(stage.querySelectorAll<SVGPathElement>(`${follow} path.a-t`));
  const ctm = art?.getScreenCTM();
  if (!art || !lines.length || !ctm) return;
  const box = stage.getBoundingClientRect();
  const w = box.width, h = box.height;
  const mapper = (m: DOMMatrix): ToStage => (x, y) => [m.a * x + m.c * y + m.e - box.left, m.b * x + m.d * y + m.f - box.top];
  const f = (n: number) => n.toFixed(1);
  const pieces = lines.map((line) => trace(line, mapper(line.getScreenCTM() ?? ctm)));
  const curve = ([px, py]: number[], [qx, qy]: number[]) =>
    ` C${f(px)},${f(py + (qy - py) * 0.6)} ${f(qx)},${f(qy - (qy - py) * 0.4)} ${f(qx)},${f(qy)}`;
  // Down at the handoff x until clear of the text, then through the waypoints into the first line
  const x = handoffX(w, h);
  const drop = (run.svg.dataset.drop ?? "").split(/[\s,]+/).filter(Boolean).map(Number);
  const ways: number[][] = [];
  for (let i = 0; i + 1 < drop.length; i += 2) ways.push(mapper(ctm)(drop[i], drop[i + 1]));
  const first = (ways[0] ?? pieces[0][0])[1];
  const copy = stage.querySelector(".ch-copy")?.getBoundingClientRect();
  const below = copy && copy.bottom - box.top < first ? copy.bottom - box.top + 18 : 0;
  const enter = Math.min(first - 40, Math.max(h * Number(run.svg.dataset.enter ?? 0.2), below));
  let d = `M${f(x)},-2 L${f(x)},${f(enter)}`;
  let at = [x, enter];
  for (const way of [...ways, pieces[0][0]]) {
    d += curve(at, way);
    at = way;
  }
  // Each line in turn, joined to the next by a short curve
  const prefixes: string[] = [];
  pieces.forEach((points, i) => {
    if (i) d += curve(at, points[0]);
    d += points.slice(1).map(([qx, qy]) => ` L${f(qx)},${f(qy)}`).join("");
    at = points[points.length - 1];
    prefixes.push(d);
  });
  // And on, out of the bottom at the handoff x, where the next scene picks it up
  if (run.svg.hasAttribute("data-exit")) {
    const [lx, ly] = at;
    d += ` C${f(lx)},${f(ly + (h - ly) * 0.5)} ${f(x)},${f(h - (h - ly) * 0.4)} ${f(x)},${f(h + 2)}`;
  }
  run.svg.setAttribute("viewBox", `0 0 ${f(w)} ${f(h)}`);
  run.ends = run.stops.length === prefixes.length
    ? prefixes.map((prefix) => (run.path.setAttribute("d", prefix), run.path.getTotalLength()))
    : [];
  run.path.setAttribute("d", d);
  run.total = run.path.getTotalLength();
  run.enter = enter + 2;
  run.path.style.strokeDasharray = `${run.total} ${run.total}`;
  run.path.style.strokeDashoffset = String(run.total);
  run.ready = true;
}

/**
 * While the stage scrolls in, the thread is drawn as far as the screen shows it (so it meets the
 * end of the previous scene's thread); once the stage is pinned, the scroll draws the rest. With
 * stops, the pen slows into the end of every object, where its words appear.
 */
function drawRun(run: Run, top: number, p: number) {
  if (!run.ready) return;
  let drawn: number;
  if (top > 0) drawn = clamp((innerHeight - top) / Math.max(1, run.enter)) * run.enter;
  else if (run.ends.length) {
    drawn = drawnAt(p, [[run.a, run.enter], ...run.stops.map((s, i): [number, number] => [s, run.ends[i]]), [run.b, run.total]]);
  } else {
    const t = clamp((p - run.a) / (run.b - run.a));
    drawn = run.enter + (run.total - run.enter) * ease(t);
  }
  run.path.style.strokeDashoffset = String(run.total - drawn);
}

function span(el: Element, name: string): [number, number] {
  const [a, b] = (el.getAttribute(name) ?? "0 1").split(/\s+/).map(Number);
  return [a, b ?? a + 0.1];
}

/** How far an element has travelled through the viewport: 0 as its top enters the lower part, 1 a little past the middle. */
function passing(el: Element) {
  const r = el.getBoundingClientRect();
  return clamp((innerHeight * 0.92 - r.top) / (innerHeight * 0.5));
}

function partsOf(section: HTMLElement): Part[] {
  const parts: Part[] = [];
  const own = (el: Element) => el.hasAttribute("data-own");
  section.querySelectorAll<SVGGElement>("[data-drawing]").forEach((el) => {
    const [a, b] = span(el, "data-drawing");
    // The strokes arrive from public/art when the chapter comes near (see InkArt)
    let drawing: Drawing | null = null;
    const part: Part = { el, a, b, own: own(el), apply: (t) => drawing?.set(t), last: -1 };
    const take = () => {
      drawing = new Drawing(el);
      drawing.set(Math.max(0, part.last));
    };
    if (el.querySelector("[data-inked]")) take();
    else el.addEventListener("ink", take, { once: true });
    parts.push(part);
  });
  section.querySelectorAll<SVGPathElement>("[data-thread]").forEach((el) => {
    const [a, b] = span(el, "data-thread");
    el.style.strokeDasharray = "1 2";
    parts.push({ el, a, b, own: own(el), apply: (t) => (el.style.strokeDashoffset = String(1 - ease(t))), last: -1 });
  });
  section.querySelectorAll<HTMLElement>("[data-show]").forEach((el) => {
    const [a, b] = span(el, "data-show");
    // Once fully shown an element counts as there: links inside it open (see .is-shown in story.css)
    parts.push({ el, a, b, own: own(el), apply: (t) => (el.style.setProperty("--show", t.toFixed(3)), el.classList.toggle("is-shown", t >= 0.999)), last: -1 });
  });
  return parts;
}

export default function StoryMotion() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chapters: Chapter[] = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]")).map((el) => {
      el.classList.add("is-live");
      const stage = el.dataset.chapter === "pin" ? el.querySelector<HTMLElement>(".ch-stage") : null;
      const runs = Array.from(el.querySelectorAll<SVGSVGElement>("svg.thread-run")).map((svg) => {
        const [a, b] = span(svg, "data-run");
        const stops = (svg.dataset.stops ?? "").split(/\s+/).filter(Boolean).map(Number);
        return { svg, path: svg.querySelector("path")!, a, b, enter: 0, total: 1, ready: false, stops, ends: [] };
      });
      // A run follows a drawing, so it is laid out again whenever one arrives
      el.addEventListener("ink", () => {
        runs.forEach(layoutRun);
        schedule();
      });
      return { el, stage, pinned: false, parts: partsOf(el), runs, visible: false };
    });
    const measure = () => {
      // Scenes that draw a row of objects line them up under the handoff x (see .ch-seq in story.css)
      const root = document.documentElement;
      root.style.setProperty("--hx", `${handoffX(root.clientWidth, innerHeight).toFixed(1)}px`);
      for (const chapter of chapters) {
        chapter.pinned = !!chapter.stage && getComputedStyle(chapter.stage).position === "sticky";
        chapter.runs.forEach(layoutRun);
      }
    };
    measure();
    // Scenes that hand the thread over measure each other; tell them the pinned layout is in place
    dispatchEvent(new Event("story:layout"));

    let frame = 0;
    const render = () => {
      frame = 0;
      for (const chapter of chapters) {
        if (!chapter.visible) continue;
        const r = chapter.el.getBoundingClientRect();
        const p = chapter.pinned
          ? clamp(-r.top / Math.max(1, r.height - innerHeight))
          : clamp((innerHeight - r.top) / (innerHeight + r.height));
        chapter.el.style.setProperty("--p", p.toFixed(4));
        for (const run of chapter.runs) drawRun(run, r.top, p);
        for (const part of chapter.parts) {
          const source = part.own || (chapter.stage && !chapter.pinned) ? passing(part.el) : p;
          const t = clamp((source - part.a) / (part.b - part.a));
          if (t === part.last) continue;
          part.last = t;
          part.apply(t);
        }
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    // Everything starts undrawn; a chapter only does work while it is near the screen
    for (const chapter of chapters) {
      for (const part of chapter.parts) {
        part.apply(0);
        part.last = 0;
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const chapter = chapters.find((c) => c.el === entry.target);
          if (chapter) chapter.visible = entry.isIntersecting;
        }
        schedule();
      },
      { rootMargin: "50% 0px" },
    );
    chapters.forEach((c) => observer.observe(c.el));

    addEventListener("scroll", schedule, { passive: true });
    const resize = () => {
      measure();
      schedule();
    };
    addEventListener("resize", resize);
    // Text set in the web fonts moves the objects beside it
    document.fonts?.ready.then(resize);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", resize);
    };
  }, []);

  return null;
}
