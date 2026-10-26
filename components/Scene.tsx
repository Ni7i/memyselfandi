"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * A pinned scroll scene: the section is `length` viewport heights tall, its stage stays on
 * screen, and its progress (0 when it pins, 1 when it lets go) is written to `--p`.
 * Everything inside animates from that one number in CSS.
 */
export default function Scene({ id, className, length, mood, children }: { id?: string; className?: string; length: number; mood?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const scene = ref.current;
    if (!scene) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      scene.style.setProperty("--p", Math.min(1, Math.max(0, -rect.top / travel)).toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    scene.classList.add("is-live");
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={ref} id={id} data-mood={mood} className={`pin ${className ?? ""}`} style={{ "--length": length } as CSSProperties}>
      <div className="pin-stage">{children}</div>
    </section>
  );
}
