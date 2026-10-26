"use client";

import { useEffect, useRef, useState } from "react";

const CHAPTERS = [
  { id: "top", label: "The bench" },
  { id: "age-three", label: "Age three" },
  { id: "curiosity", label: "Growing up" },
  { id: "stations", label: "The line so far" },
  { id: "first-game", label: "A dice game in C#" },
  { id: "work", label: "Projects" },
  { id: "proof", label: "Certificates" },
  { id: "life", label: "Outside the code" },
  { id: "how", label: "How I work" },
  { id: "facts", label: "The facts" },
  { id: "contact", label: "Contact" },
];

const RADIUS = 19;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * A small spool in the corner. Its red ring winds up as the reader goes through the story;
 * opening it lists the chapters. It works with the keyboard and closes on Escape.
 */
export default function SpoolNav() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("top");
  const ringRef = useRef<SVGCircleElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      ringRef.current?.style.setProperty("stroke-dashoffset", String(CIRCUMFERENCE * (1 - p)));
      // The current chapter is the last one whose top has passed the middle of the screen
      let id = "top";
      for (const chapter of CHAPTERS) {
        const el = document.getElementById(chapter.id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.5) id = chapter.id;
      }
      setCurrent(id);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLAnchorElement>("a[aria-current]")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onPointer);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <nav className="spool" aria-label="Chapters">
      <div ref={menuRef} id="spool-menu" className="spool-menu" hidden={!open}>
        <p className="spool-title">Der rote Faden</p>
        <ol>
          {CHAPTERS.map((chapter, i) => (
            <li key={chapter.id}>
              <a href={`#${chapter.id}`} aria-current={chapter.id === current ? "location" : undefined} onClick={() => setOpen(false)}>
                <span className="spool-number">{String(i + 1).padStart(2, "0")}</span>
                {chapter.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
      <button
        ref={buttonRef}
        type="button"
        className="spool-button"
        aria-expanded={open}
        aria-controls="spool-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="visually-hidden">{open ? "Close chapters" : "Open chapters"}</span>
        <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <circle className="spool-track" cx="24" cy="24" r={RADIUS} />
          <circle
            ref={ringRef}
            className="spool-ring"
            cx="24"
            cy="24"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            transform="rotate(-90 24 24)"
          />
          <path className="spool-body" d="M16,15 H32 M16,33 H32 M19,15 V33 M29,15 V33" />
          <path className="spool-wind" d="M19,19 L29,21 M19,23 L29,25 M19,27 L29,29" />
        </svg>
      </button>
    </nav>
  );
}
