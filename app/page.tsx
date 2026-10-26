import ContactForm from "@/components/ContactForm";
import ProjectRow from "@/components/ProjectRow";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getPublishedProjects } from "@/lib/content/projects";

// Projects are managed in /admin and read on every request.
export const dynamic = "force-dynamic";

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

const FACTS = [
  { label: "School", value: "IMS Baden" },
  { label: "Track", value: "Berufsmatura + EFZ" },
  { label: "Years", value: "2024-2028" },
  { label: "Based in", value: "Limmattal" },
];

const SIDE_LINKS = [
  { id: "top", label: "Home" },
  { id: "about", label: "About me" },
  { id: "archive", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];

/** Large heading with the same word set in faded italic behind it. */
function SectionHead({ title, align = "left" }: { title: string; align?: "left" | "right" }) {
  return (
    <div className={`sec-head sec-head-${align}`}>
      <span className="ghost" aria-hidden="true">{title}</span>
      <h2>{title}</h2>
    </div>
  );
}

function Swoosh({ className }: { className: string }) {
  return (
    <svg className={`swoosh ${className}`} viewBox="0 0 800 900" fill="none" aria-hidden="true">
      <path d="M760 40C420 10 120 120 140 300c20 190 380 260 420 450 18 90-40 120-90 110" stroke="currentColor" strokeWidth="22" strokeLinecap="round" />
    </svg>
  );
}

export default async function Home() {
  const projects = await getPublishedProjects();
  const topProjects = projects.filter((project) => project.featured);
  const moreProjects = projects.filter((project) => !project.featured);

  return (
    <>
      <SiteHeader onHome />

      <nav className="side-nav" aria-label="Sections">
        {SIDE_LINKS.map((link) => <a key={link.id} href={`#${link.id}`}>{link.label}</a>)}
      </nav>

      <section className="hero" id="top">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-inner">
          <h1 className="hero-name">Enis Shorra</h1>
          <p className="hero-tags">
            <span>Application Development</span>
            <span>IMS Baden</span>
            <span>Limmattal, Switzerland</span>
          </p>
          <p className="hero-sub">
            The personal site of an eighteen-year-old developer from
            Switzerland: what I build, what I&apos;m into, and where
            this is going.
          </p>
        </div>
        <a className="hero-scroll" href="#about">Scroll</a>
      </section>

      <section className="mag" id="about">
        <Swoosh className="swoosh-about" />
        <div className="mag-inner">
          <SectionHead title="About me" />
          <div className="about-grid">
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
            <aside className="about-side">
              <span className="side-label">Quick facts</span>
              <dl className="facts">
                {FACTS.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <span className="side-label">Right now</span>
              <ol className="now-list">
                <li><span>(01)</span>Building projects</li>
                <li><span>(02)</span>Writing on the blog</li>
                <li><span>(03)</span>Looking for a team</li>
              </ol>
            </aside>
          </div>
        </div>
      </section>

      <section className="idx" id="archive">
        <Swoosh className="swoosh-projects" />
        <div className="idx-inner">
          <SectionHead title="Projects" />
          <header className="idx-intro">
            <span className="idx-kicker">Selected &amp; ongoing</span>
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
          <SectionHead title="Certificates" align="right" />
          <span className="me-meta">Courses &amp; milestones</span>
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
                <span className="certificate-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="cta" id="contact">
        <div className="cta-inner">
          <div>
            <SectionHead title="Contact" />
            <p className="cta-title">
              Currently looking for the <em>right team.</em>
            </p>
            <p className="cta-sub">
              I&apos;m available for an apprenticeship anywhere. If that sounds
              useful, write to me right here, without leaving the website.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <SiteFooter onHome />
    </>
  );
}
