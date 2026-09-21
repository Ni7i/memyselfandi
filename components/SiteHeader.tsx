import Link from "next/link";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "archive", label: "Projects" },
] as const;

const MORE_SECTIONS = [
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
] as const;

/** On the homepage sections are plain anchors; elsewhere they link back to the homepage. */
function SectionLink({ id, label, onHome, className }: { id: string; label: string; onHome: boolean; className?: string }) {
  return onHome ? (
    <a className={className} href={`#${id}`}>{label}</a>
  ) : (
    <Link className={className} href={`/#${id}`}>{label}</Link>
  );
}

export default function SiteHeader({ onHome = false }: { onHome?: boolean }) {
  return (
    <nav className="nav">
      <Link href="/" className="logo" aria-label="Enis Shorra">
        <span className="top">ENIS</span>
        <span className="bot">SHORRA</span>
      </Link>
      <div className="nav-links">
        {SECTIONS.map((section) => <SectionLink key={section.id} {...section} onHome={onHome} />)}
        <Link href="/blog">Blog</Link>
        {MORE_SECTIONS.map((section) => <SectionLink key={section.id} {...section} onHome={onHome} />)}
      </div>
      <SectionLink className="nav-cta" id="contact" label="Get in touch" onHome={onHome} />
    </nav>
  );
}
