import ContactForm from "@/components/ContactForm";
import ProjectRow from "@/components/ProjectRow";
import Link from "next/link";
import type { Project as PortfolioProject } from "@/lib/content/types";
import TypedTitle from "@/app/TypedTitle";

const CERTIFICATES = [
  {
    title: "Baden hackt",
    detail: "4th place · Competition",
    url: "/certificates/baden-hackt.jpg",
  },
  {
    title: "AFV Referee Diploma",
    detail: "Football referee qualification",
    url: "/certificates/afv-referee-diploma.jpg",
  },
  {
    title: "Web APIs with ASP.NET Core 8",
    detail: "LinkedIn Learning",
    url: "/certificates/web-apis-aspnet-core-8.png",
  },
  {
    title: "Python Essentials 1",
    detail: "Cisco Networking Academy",
    url: "https://www.credly.com/badges/a83657ef-3959-4ced-abf1-cc5dd7ad43d3/linked_in_profile",
  },
  {
    title: "Networking Basics",
    detail: "Cisco Networking Academy",
    url: "https://www.credly.com/badges/9905e43b-c420-468e-9b75-b6b1bace4b87",
  },
];

export default function MobilePortfolio({ projects }: { projects: PortfolioProject[] }) {
  const topProjects = projects.filter((project) => project.featured);
  const moreProjects = projects.filter((project) => !project.featured);

  return (
    <div className="mobile-portfolio">
      <ClassicHeader onHome />
      <main id="mobile-main">
        <section className="intro">
          <div className="intro-inner">
            <div>
              <span className="stamp">Est. 2024 · Limmattal</span>
              <TypedTitle />
            </div>
            <p className="intro-sub">
              The personal site of an eighteen-year-old developer from
              Switzerland: what I build, what I&apos;m into, and where
              this is going.
            </p>
          </div>
          <aside className="desktop-experience-note" aria-label="Desktop experience">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
              <rect x="3" y="4" width="18" height="12" rx="2" />
              <path d="M12 16v4M8 20h8" strokeLinecap="round" />
            </svg>
            <div>
              <strong>The full experience is on desktop.</strong>
              <p>
                Explore the illustrated story on a computer, or try your
                browser&apos;s desktop mode.
              </p>
            </div>
          </aside>
        </section>

        <section className="mag" id="about">
          <div className="mag-inner">
            <article className="about-sheet">
              <span className="about-label">About me</span>
              <div className="about-copy">
                <p>
                  I&apos;m usually the person who gives a group structure and keeps
                  its energy up. I like knowing what everyone is working on,
                  bringing people together and making sure an idea actually turns
                  into something finished.
                </p>
                <p>
                  When a problem refuses to work, I stay with it for a long time.
                  I try every angle I can before asking for help, sometimes until
                  I&apos;m close to giving up. What keeps me going is progress.
                  Competition adds fuel, but seeing something improve is what
                  matters most to me.
                </p>
                <p>
                  I take responsibility seriously. Nothing frustrates me faster
                  than someone ignoring the task they agreed to do. I expect
                  reliability from others because I want people to be able to
                  expect the same from me. At the same time, I want to become more
                  open to unfamiliar programming languages and approaches.
                </p>
                <p>
                  Outside coding, I spend most of my time with my family. This
                  website is the project I&apos;m proudest of because it feels the
                  most like me. Under stress, I try to slow things down, relax or
                  have a good conversation. I want to be known as someone who is
                  eager to learn, dependable and a good person to ask for advice.
                </p>
              </div>
              <footer className="about-footer">
                <span>IMS Baden, Berufsmatura + EFZ Informatiker</span>
                <span>2024-2028</span>
              </footer>
            </article>
          </div>
        </section>

        <section className="idx" id="archive">
          <div className="idx-inner">
            <header className="idx-intro">
              <span className="idx-kicker">Selected &amp; ongoing</span>
              <h2>Things I&apos;ve <em>made.</em></h2>
              <p>
                Three projects I&apos;m especially proud of, followed by more work
                worth opening. Every row links directly to the code.
              </p>
              <span className="idx-count">{projects.length} projects</span>
            </header>

            <div className="archive-group">
              <span className="archive-label">Top projects</span>
              <div className="archive-list top-list">
                {topProjects.map((project, index) => (
                  <ProjectRow key={project.slug} number={index + 1} project={project} />
                ))}
              </div>
            </div>

            <div className="archive-group more-projects">
              <span className="archive-label">More work</span>
              <div className="archive-list">
                {moreProjects.map((project) => (
                  <ProjectRow key={project.slug} project={project} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="me" id="certificates">
          <div className="me-inner certificates-inner">
            <div className="me-head">
              <h2>Certificates<em>.</em></h2>
              <span className="meta">Courses &amp; milestones</span>
            </div>
            <div className="certificate-list">
              {CERTIFICATES.map((certificate, index) => (
                <a
                  className="certificate-row"
                  href={certificate.url}
                  key={certificate.title}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="certificate-number">0{index + 1}</span>
                  <h3>{certificate.title}</h3>
                  <p>{certificate.detail}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="cta" id="contact">
          <div className="cta-inner">
            <div>
              <h2 className="cta-title">
                Currently looking for the <em>right team.</em>
              </h2>
              <p className="cta-sub">
                I&apos;m available for an apprenticeship anywhere. If that sounds
                useful, write to me right here, without leaving the website.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <ClassicFooter onHome />
    </div>
  );
}

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

function ClassicHeader({ onHome = false }: { onHome?: boolean }) {
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

function ClassicFooter({ onHome = false }: { onHome?: boolean }) {
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
