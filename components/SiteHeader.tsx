"use client";

import Link from "next/link";
import { type AnchorHTMLAttributes, useEffect, useRef, useState } from "react";

/** Scroll stops, top to bottom. Only ids that exist on the homepage are observed. */
const STOPS = [
  { id: "top", label: "Start" },
  { id: "story", label: "The start" },
  { id: "curiosity", label: "The question" },
  { id: "about", label: "Who I am" },
  { id: "certificates", label: "Certificates" },
  { id: "archive", label: "Projects" },
  { id: "hire", label: "Why me" },
  { id: "contact", label: "Contact" },
] as const;

const MENU = [
  { id: "about", label: "Who I am" },
  { id: "archive", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
] as const;

type SectionLinkProps = { id: string; label: string; onHome: boolean } & AnchorHTMLAttributes<HTMLAnchorElement>;

/** On the homepage sections are plain anchors; elsewhere they link back to the homepage. */
function SectionLink({ id, label, onHome, children, ...props }: SectionLinkProps) {
  const content = children ?? label;
  return onHome ? (
    <a {...props} href={`#${id}`}>{content}</a>
  ) : (
    <Link {...props} href={`/#${id}`}>{content}</Link>
  );
}

/**
 * Navigation on the right edge: a thin progress line with a dot per section, the current one
 * labelled. On phones a Menu button slides the links in from the right.
 */
export default function SiteHeader({ onHome = false }: { onHome?: boolean }) {
  const [open, setOpen] = useState(false);
  const railRef = useRef<HTMLElement>(null);

  // Progress fill and the current stop, from scroll position.
  useEffect(() => {
    if (!onHome) return;
    const rail = railRef.current;
    if (!rail) return;
    const dots = [...rail.querySelectorAll<HTMLElement>("[data-stop]")];
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      rail.style.setProperty("--progress", String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
      const probe = window.scrollY + window.innerHeight * 0.42;
      let current = 0;
      STOPS.forEach((stop, index) => {
        const element = document.getElementById(stop.id);
        if (element && element.getBoundingClientRect().top + window.scrollY <= probe) current = index;
      });
      dots.forEach((dot, index) => dot.classList.toggle("is-current", index === current));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [onHome]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <>
      <div className="grain" aria-hidden="true" />

      <nav ref={railRef} className="progress" aria-label="Sections">
        <Link href="/blog" className="progress-blog">Blog</Link>
        <ol className="progress-stops">
          {STOPS.map((stop) => (
            <li key={stop.id}>
              <SectionLink data-stop="" id={stop.id} label={stop.label} onHome={onHome} aria-label={stop.label}>
                <span className="progress-label">{stop.label}</span>
                <span className="progress-dot" aria-hidden="true" />
              </SectionLink>
            </li>
          ))}
        </ol>
      </nav>

      <nav className={`rail${open ? " is-open" : ""}`} aria-label="Menu">
        <button
          className="rail-toggle"
          type="button"
          aria-controls="site-menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <div className="rail-panel" id="site-menu" onClick={() => setOpen(false)}>
          <Link href="/" className="brand">Enis Shorra</Link>
          <div className="nav-links">
            {MENU.map((item) => <SectionLink key={item.id} {...item} onHome={onHome} />)}
            <Link href="/blog">Blog</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
