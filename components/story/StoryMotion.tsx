"use client";

import { useEffect } from "react";
import { Drawing } from "@/components/art/drawing";

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
type Chapter = { el: HTMLElement; stage: HTMLElement | null; pinned: boolean; parts: Part[]; visible: boolean };

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
    parts.push({ el, a, b, own: own(el), apply: (t) => el.style.setProperty("--show", t.toFixed(3)), last: -1 });
  });
  return parts;
}

export default function StoryMotion() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chapters: Chapter[] = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]")).map((el) => {
      el.classList.add("is-live");
      const stage = el.dataset.chapter === "pin" ? el.querySelector<HTMLElement>(".ch-stage") : null;
      return { el, stage, pinned: false, parts: partsOf(el), visible: false };
    });
    const measure = () => {
      for (const chapter of chapters) chapter.pinned = !!chapter.stage && getComputedStyle(chapter.stage).position === "sticky";
    };
    measure();

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
