"use client";

import { useEffect, useRef } from "react";
import { threadPath, type ThreadShape } from "@/lib/thread-shapes";

/** Where the "pen" sits in the viewport: the thread is drawn down to this height. */
const PEN = 0.65;
const SAMPLES = 240;

interface Props {
  shape: ThreadShape;
  /** Selector of an element inside the same scene whose box the symbol fills. */
  anchor?: string;
  /**
   * Inside a pinned Scene: draw the whole piece while the scene's progress runs from `from`
   * to `to`. `from` may be negative, so the thread is already on its way as the scene arrives.
   */
  pinned?: { from: number; to: number };
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** One piece of the thread, drawn behind its scene as you scroll through it. */
export default function Thread({ shape, anchor, pinned }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const from = pinned?.from;
  const to = pinned?.to;

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const scene = svg?.parentElement;
    if (!svg || !path || !scene) return;
    const track = from !== undefined ? svg.closest<HTMLElement>(".pin") ?? scene : scene;

    let length = 0;
    let reach: number[] = [];
    let frame = 0;

    const layout = () => {
      const w = scene.clientWidth;
      const h = scene.clientHeight;
      const sceneRect = scene.getBoundingClientRect();
      const x0 = Math.max(10, parseFloat(getComputedStyle(scene).paddingLeft) / 2);
      const target = anchor ? scene.querySelector<HTMLElement>(anchor) : null;
      const rect = target?.getBoundingClientRect();
      const box = rect && rect.width > 0
        ? { x: rect.left - sceneRect.left, y: rect.top - sceneRect.top, w: rect.width, h: rect.height }
        : null;

      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      path.setAttribute("d", threadPath(shape, { w, h, x0, box }));
      length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;

      // For each step along the thread: the lowest point reached so far.
      // Scrolling then reveals the thread exactly as far as the pen has come down.
      reach = [];
      let lowest = 0;
      for (let i = 0; i <= SAMPLES; i++) {
        lowest = Math.max(lowest, path.getPointAtLength((length * i) / SAMPLES).y);
        reach.push(lowest);
      }
      update();
    };

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const rect = track.getBoundingClientRect();
      let drawn: number;
      if (from !== undefined && to !== undefined) {
        const progress = -rect.top / Math.max(1, rect.height - vh);
        drawn = (progress - from) / (to - from);
      } else {
        const pen = vh * PEN - rect.top;
        let index = 0;
        while (index < SAMPLES && reach[index + 1] <= pen) index++;
        drawn = pen <= 0 ? 0 : index / SAMPLES;
      }
      path.style.strokeDashoffset = `${length * (1 - clamp(drawn))}`;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(layout);
    observer.observe(scene);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [shape, anchor, from, to]);

  return (
    <svg ref={svgRef} className="thread" aria-hidden="true" preserveAspectRatio="none">
      <path ref={pathRef} />
    </svg>
  );
}
