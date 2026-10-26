"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "archive", label: "Projects" },
] as const;

const MORE_SECTIONS = [
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
] as const;

/** Scroll distance after which the links leave the top bar and dock on the right. */
const DOCK_AFTER_PX = 320;

/** On the homepage sections are plain anchors; elsewhere they link back to the homepage. */
function SectionLink({ id, label, onHome, className }: { id: string; label: string; onHome: boolean; className?: string }) {
  return onHome ? (
    <a className={className} href={`#${id}`}>{label}</a>
  ) : (
    <Link className={className} href={`/#${id}`}>{label}</Link>
  );
}

export default function SiteHeader({ onHome = false }: { onHome?: boolean }) {
  const [docked, setDocked] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => setDocked(window.scrollY > DOCK_AFTER_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <nav className={`nav${docked ? " is-docked" : ""}${open ? " is-open" : ""}`}>
      <Link href="/" className="brand">Enis Shorra</Link>
      <div className="nav-links" id="site-menu" onClick={() => setOpen(false)}>
        {SECTIONS.map((section) => <SectionLink key={section.id} {...section} onHome={onHome} />)}
        <Link href="/blog">Blog</Link>
        {MORE_SECTIONS.map((section) => <SectionLink key={section.id} {...section} onHome={onHome} />)}
      </div>
      <SectionLink className="nav-cta" id="contact" label="Get in touch" onHome={onHome} />
      <button
        className="nav-toggle"
        type="button"
        aria-controls="site-menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Menu"}
      </button>
    </nav>
  );
}
