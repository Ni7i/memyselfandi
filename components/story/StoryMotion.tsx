"use client";

import { useEffect } from "react";
import { Drawing } from "@/components/art/drawing";
import { handoffX } from "./handoff";

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
type Run = { svg: SVGSVGElement; path: SVGPathElement; a: number; b: number; enter: number; total: number; ready: boolean };
type Chapter = { el: HTMLElement; stage: HTMLElement | null; pinned: boolean; parts: Part[]; runs: Run[]; visible: boolean };

/**
 * Lays out a thread run: straight down from the top edge at the handoff x, a curve into the start
 * of the drawing's own red line, then along that line, mapped from drawing to stage coordinates.
 */
function layoutRun(run: Run) {
  const stage = run.svg.parentElement!;
  const art = stage.querySelector<SVGSVGElement>(run.svg.dataset.follow ?? "svg");
  const line = art?.querySelector<SVGPathElement>("path.a-t");
  const ctm = art?.getScreenCTM();
  if (!art || !line || !ctm) return;
  const box = stage.getBoundingClientRect();
  const w = box.width, h = box.height;
  const map = (x: number, y: number) => [ctm.a * x + ctm.c * y + ctm.e - box.left, ctm.b * x + ctm.d * y + ctm.f - box.top];
  const f = (n: number) => n.toFixed(1);
  const numbers = (line.getAttribute("d") ?? "").match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  const points: number[][] = [];
  for (let i = 0; i + 1 < numbers.length; i += 2) points.push(map(numbers[i], numbers[i + 1]));
  const [sx, sy] = points[0];
  // Down at the handoff x until clear of the text, then through the waypoints into the drawing's line
  const x = handoffX(w, h);
  const drop = (run.svg.dataset.drop ?? `${numbers[0]} ${numbers[1]}`).split(/[\s,]+/).map(Number);
  const ways: number[][] = [];
  for (let i = 0; i + 1 < drop.length; i += 2) ways.push(map(drop[i], drop[i + 1]));
  const copy = stage.querySelector(".ch-copy")?.getBoundingClientRect();
  const below = copy && copy.bottom - box.top < ways[0][1] ? copy.bottom - box.top + 18 : 0;
  const enter = Math.min(ways[0][1] - 40, Math.max(h * Number(run.svg.dataset.enter ?? 0.2), below));
  let d = `M${f(x)},-2 L${f(x)},${f(enter)}`;
  let [px, py] = [x, enter];
  for (const [wx, wy] of [...ways, [sx, sy]]) {
    d += ` C${f(px)},${f(py + (wy - py) * 0.6)} ${f(wx)},${f(wy - (wy - py) * 0.4)} ${f(wx)},${f(wy)}`;
    [px, py] = [wx, wy];
  }
  d += points.slice(1).map(([qx, qy]) => ` L${f(qx)},${f(qy)}`).join("");
  // And on, out of the bottom at the handoff x, where the next scene picks it up
  if (run.svg.hasAttribute("data-exit")) {
    const [lx, ly] = points[points.length - 1];
    d += ` C${f(lx)},${f(ly + (h - ly) * 0.5)} ${f(x)},${f(h - (h - ly) * 0.4)} ${f(x)},${f(h + 2)}`;
  }
  run.svg.setAttribute("viewBox", `0 0 ${f(w)} ${f(h)}`);
  run.path.setAttribute("d", d);
  run.total = run.path.getTotalLength();
  run.enter = enter + 2;
  run.path.style.strokeDasharray = `${run.total} ${run.total}`;
  run.path.style.strokeDashoffset = String(run.total);
  run.ready = true;
}

/**
 * While the stage scrolls in, the thread is drawn as far as the screen shows it (so it meets the
 * end of the previous scene's thread); once the stage is pinned, the scroll draws the rest.
 */
function drawRun(run: Run, top: number, p: number) {
  if (!run.ready) return;
  const t = clamp((p - run.a) / (run.b - run.a));
  const drawn = top > 0
    ? clamp((innerHeight - top) / Math.max(1, run.enter)) * run.enter
    : run.enter + (run.total - run.enter) * (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
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
        return { svg, path: svg.querySelector("path")!, a, b, enter: 0, total: 1, ready: false };
      });
      // A run follows a drawing, so it is laid out again whenever one arrives
      el.addEventListener("ink", () => {
        runs.forEach(layoutRun);
        schedule();
      });
      return { el, stage, pinned: false, parts: partsOf(el), runs, visible: false };
    });
    const measure = () => {
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
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", resize);
    };
  }, []);

  return null;
}
