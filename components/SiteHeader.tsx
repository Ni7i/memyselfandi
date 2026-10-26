"use client";

import Link from "next/link";
import { type AnchorHTMLAttributes, useEffect, useRef, useState, useSyncExternalStore } from "react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "archive", label: "Projects" },
] as const;

const MORE_SECTIONS = [
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
] as const;

/** Stops on the dial, top to bottom. */
const DIAL = [
  { id: "top", label: "Start" },
  { id: "about", label: "Who I am" },
  { id: "path", label: "My path" },
  { id: "certificates", label: "Certificates" },
  { id: "archive", label: "Projects" },
  { id: "hire", label: "Why me" },
  { id: "contact", label: "Contact" },
] as const;

/** Degrees between two stops, and the dial's radius in px (also used by the CSS via --r). */
const STEP = 22;
const RADIUS = 150;

const clock = new Intl.DateTimeFormat("de-CH", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });
const readTime = () => clock.format(Date.now());
const subscribeToTime = (onChange: () => void) => {
  const timer = window.setInterval(onChange, 10_000);
  return () => window.clearInterval(timer);
};

type SectionLinkProps = { id: string; label: string; onHome: boolean } & AnchorHTMLAttributes<HTMLAnchorElement>;

/** On the homepage sections are plain anchors; elsewhere they link back to the homepage. */
function SectionLink({ id, label, onHome, ...props }: SectionLinkProps) {
  return onHome ? (
    <a {...props} href={`#${id}`}>{label}</a>
  ) : (
    <Link {...props} href={`/#${id}`}>{label}</Link>
  );
}

/**
 * Navigation on the right edge only. On desktop a dial: part of a circle whose stops
 * turn with the scroll position, so the part you are reading sits in the middle.
 * On phones a Menu button slides the links in from the right.
 */
export default function SiteHeader({ onHome = false }: { onHome?: boolean }) {
  const [open, setOpen] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);
  const time = useSyncExternalStore(subscribeToTime, readTime, () => "");

  // Turn the dial: work out how far between two stops the reader is, then place every label.
  useEffect(() => {
    const dial = dialRef.current;
    if (!dial) return;
    const labels = [...dial.querySelectorAll<HTMLElement>("[data-stop]")];
    let frame = 0;

    const position = () => {
      frame = 0;
      let turn = 0;
      if (onHome) {
        const probe = window.scrollY + window.innerHeight * 0.45;
        const tops = DIAL.map(({ id }) => {
          const element = document.getElementById(id);
          return element ? element.getBoundingClientRect().top + window.scrollY : Infinity;
        });
        for (let i = 0; i < tops.length; i++) {
          const next = tops[i + 1] ?? Infinity;
          if (probe >= tops[i] && probe < next) {
            turn = next === Infinity ? i : i + (probe - tops[i]) / (next - tops[i]);
            break;
          }
        }
      }
      dial.style.setProperty("--turn", String(turn));
      labels.forEach((label, index) => {
        const offset = index - turn;
        const angle = (offset * STEP * Math.PI) / 180;
        const x = -RADIUS * Math.cos(angle);
        const y = RADIUS * Math.sin(angle);
        // Only the current stop and its neighbours are readable; the rest fade into the ring
        const near = Math.max(0, 1 - Math.abs(offset) / 1.6);
        label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-100%, -50%)`;
        label.style.opacity = (near ** 1.4).toFixed(3);
        label.style.pointerEvents = near > 0.2 ? "auto" : "none";
        label.classList.toggle("is-current", Math.abs(offset) < 0.5);
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(position);
    };

    position();
    dial.classList.add("is-ready");
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

      <nav className="dial" ref={dialRef} aria-label="Sections">
        <svg className="dial-ring" viewBox={`${-RADIUS - 12} ${-RADIUS - 12} ${2 * RADIUS + 24} ${2 * RADIUS + 24}`} aria-hidden="true">
          <circle r={RADIUS} />
          <g className="dial-ticks">
            {DIAL.map((stop, index) => {
              const angle = (index * STEP * Math.PI) / 180;
              const [cos, sin] = [Math.cos(angle), Math.sin(angle)];
              return <line key={stop.id} x1={-(RADIUS - 5) * cos} y1={(RADIUS - 5) * sin} x2={-(RADIUS + 5) * cos} y2={(RADIUS + 5) * sin} />;
            })}
          </g>
        </svg>
        <span className="dial-pointer" aria-hidden="true" />
        <div className="dial-stops">
          {DIAL.map((stop) => (
            <SectionLink key={stop.id} data-stop="" id={stop.id} label={stop.label} onHome={onHome} />
          ))}
        </div>
        <div className="dial-corner">
          <Link href="/blog" className="corner-link">Blog</Link>
          <SectionLink className="corner-link corner-cta" id="contact" label="Get in touch" onHome={onHome} />
          <span className="rail-time">Limmattal{time && ` ${time}`}</span>
        </div>
      </nav>

      <nav className={`rail${open ? " is-open" : ""}`} aria-label="Main">
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
            {SECTIONS.map((section) => <SectionLink key={section.id} {...section} onHome={onHome} />)}
            <Link href="/blog">Blog</Link>
            {MORE_SECTIONS.map((section) => <SectionLink key={section.id} {...section} onHome={onHome} />)}
          </div>
          <SectionLink className="nav-cta" id="contact" label="Get in touch" onHome={onHome} />
          <span className="rail-time">Limmattal{time && ` ${time}`}</span>
        </div>
      </nav>
    </>
  );
}
