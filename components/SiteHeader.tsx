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

const SPY_IDS = [...SECTIONS, ...MORE_SECTIONS].map((section) => section.id);

const clock = new Intl.DateTimeFormat("de-CH", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });
const readTime = () => clock.format(Date.now());
const subscribeToTime = (onChange: () => void) => {
  const timer = window.setInterval(onChange, 10_000);
  return () => window.clearInterval(timer);
};

/** On the homepage sections are plain anchors; elsewhere they link back to the homepage. */
type SectionLinkProps = { id: string; label: string; onHome: boolean } & AnchorHTMLAttributes<HTMLAnchorElement>;

function SectionLink({ id, label, onHome, ...props }: SectionLinkProps) {
  return onHome ? (
    <a {...props} href={`#${id}`}>{label}</a>
  ) : (
    <Link {...props} href={`/#${id}`}>{label}</Link>
  );
}

/** Navigation lives on the right edge only: a rail on desktop, a drawer from the right on phones. */
export default function SiteHeader({ onHome = false }: { onHome?: boolean }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const railRef = useRef<HTMLElement>(null);
  const time = useSyncExternalStore(subscribeToTime, readTime, () => "");

  // Scroll progress drives the thin line next to the links, without re-rendering.
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      railRef.current?.style.setProperty("--progress", String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Marks the part of the homepage that is in the middle of the screen.
  useEffect(() => {
    if (!onHome) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setCurrent(entry.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SPY_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  const mark = (id: string) => (current === id ? { className: "is-current", "aria-current": "true" as const } : {});

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <nav ref={railRef} className={`rail${open ? " is-open" : ""}`} aria-label="Main">
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
            {SECTIONS.map((section) => (
              <SectionLink key={section.id} {...section} onHome={onHome} {...mark(section.id)} />
            ))}
            <Link href="/blog">Blog</Link>
            {MORE_SECTIONS.map((section) => (
              <SectionLink key={section.id} {...section} onHome={onHome} {...mark(section.id)} />
            ))}
          </div>
          <SectionLink className="nav-cta" id="contact" label="Get in touch" onHome={onHome} />
          <span className="rail-time">Limmattal{time && ` ${time}`}</span>
        </div>
      </nav>
    </>
  );
}
