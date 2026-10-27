"use client";

import { useEffect, useRef, useState } from "react";

const CHAPTERS = [
  { id: "top", label: "The bench" },
  { id: "age-three", label: "Age three" },
  { id: "curiosity", label: "Growing up" },
  { id: "school", label: "Bezirksschule" },
  { id: "ims", label: "IMS and Baden hackt" },
  { id: "stations", label: "The next stops" },
  { id: "first-game", label: "A dice game in C#" },
  { id: "work", label: "Projects" },
  { id: "proof", label: "Certificates" },
  { id: "life", label: "Outside the code" },
  { id: "how", label: "How I work" },
  { id: "facts", label: "The facts" },
  { id: "contact", label: "Contact" },
];

/**
 * A handwritten word in the corner, "Index", that opens the table of contents of the book:
 * a drawn frame, the chapters, the one you are in underlined. Keyboard: Escape closes it.
 */
export default function IndexNav() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("top");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
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
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
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
    <nav className="index-nav" aria-label="Chapters">
      <button ref={buttonRef} type="button" className="index-button" aria-expanded={open} aria-controls="index-menu" onClick={() => setOpen((v) => !v)}>
        {open ? "Close" : "Index"}
        <svg viewBox="0 0 60 8" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M2,5 C14,3.6 28,6 42,4.2 C48,3.6 54,4.4 58,3.4" />
        </svg>
      </button>
      <div ref={menuRef} id="index-menu" className="index-menu" hidden={!open}>
        <p className="index-title">Der rote Faden</p>
        <ol>
          {CHAPTERS.map((chapter, i) => (
            <li key={chapter.id}>
              <a href={`#${chapter.id}`} aria-current={chapter.id === current ? "location" : undefined} onClick={() => setOpen(false)}>
                <span className="index-number">{String(i + 1).padStart(2, "0")}</span>
                {chapter.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
