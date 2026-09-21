import Link from "next/link";

function SectionLink({ id, label, onHome }: { id: string; label: string; onHome: boolean }) {
  return onHome ? <a href={`#${id}`}>{label}</a> : <Link href={`/#${id}`}>{label}</Link>;
}

export default function SiteFooter({ onHome = false }: { onHome?: boolean }) {
  return (
    <footer className="foot-wrap">
      <div className="foot">
        <div>
          <h4>Enis Shorra</h4>
          <p className="foot-word">
            Eighteen. Switzerland. Building things,
            <em> one weekend at a time.</em>
          </p>
        </div>
        <div>
          <h4>Elsewhere</h4>
          <ul>
            <li><a href="https://github.com/Ni7i" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href="https://linkedin.com/in/enis-shorra" target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a href="https://discord.com/users/nisi_17" target="_blank" rel="noreferrer">Discord</a></li>
          </ul>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><SectionLink id="contact" label="Contact" onHome={onHome} /></li>
            <li><SectionLink id="archive" label="Projects" onHome={onHome} /></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><SectionLink id="certificates" label="Certificates" onHome={onHome} /></li>
          </ul>
        </div>
      </div>
      <div className="foot-bar">
        <span>&copy; Enis Shorra &middot; 2026</span>
        <span>Limmattal, Switzerland</span>
      </div>
    </footer>
  );
}
