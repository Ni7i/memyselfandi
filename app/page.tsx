import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import TypedTitle from "./TypedTitle";

const TOP_PROJECTS = [
  {
    name: "screentime-blocker",
    description: "A macOS menu-bar app that blocks distracting websites and apps behind a personal code.",
    stack: "Python · macOS · SHA-256",
    url: "https://github.com/Ni7i/screentime-blocker",
  },
  {
    name: "memyselfandi",
    description: "This portfolio — designed, built and maintained by me.",
    stack: "Next.js · TypeScript · React",
    url: "https://github.com/Ni7i/memyselfandi",
  },
  {
    name: "Quizlot",
    description: "A focused quiz and flashcard app for creating and reviewing study material.",
    stack: "React · Vite · JavaScript",
    url: "https://github.com/Ni7i/Quizlot",
  },
];

const MORE_PROJECTS = [
  {
    name: "NoteVault",
    description: "A lightweight REST API for notes, tags and search.",
    stack: ".NET 8 · C# · Swagger",
    url: "https://github.com/Ni7i/NoteVault",
  },
  {
    name: "Twinn",
    description: "A matching app built around finding the right two people.",
    stack: "C# · Blazor",
    url: "https://github.com/Ni7i/twinn",
  },
  {
    name: "midnight-calculator",
    description: "A purpose-built calculator for a local small business.",
    stack: "JavaScript",
    url: "https://github.com/Ni7i/midnight-calculator",
  },
  {
    name: "LockBox",
    description: "A local terminal password manager with an encrypted vault and secure password generation.",
    stack: "C# · .NET 8 · AES-256",
    url: "https://github.com/Ni7i/Saveword/tree/main/LockBox-main",
  },
  {
    name: "Oase Jugendraum",
    description: "A web application created for a local youth room.",
    stack: "Python · Web app",
    url: "https://github.com/Ni7i/OaseJugendraum",
  },
];

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

export default function Home() {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="logo" aria-label="Enis Shorra">
          <span className="top">ENIS</span>
          <span className="bot">SHORRA</span>
        </Link>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#archive">Projects</a>
          <a href="#certificates">Certificates</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href="#contact">Get in touch</a>
      </nav>

      <section className="intro">
        <div className="intro-inner">
          <div>
            <span className="stamp">Est. 2024 · Limmattal</span>
            <TypedTitle />
          </div>
          <p className="intro-sub">
            The personal site of an eighteen-year-old developer from
            Switzerland &mdash; what I build, what I&apos;m into, and where
            this is going.
          </p>
        </div>
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
                I try every angle I can before asking for help — sometimes until
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
              <span>2024–2028</span>
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
            <span className="idx-count">{TOP_PROJECTS.length + MORE_PROJECTS.length} projects</span>
          </header>

          <div className="archive-group">
            <span className="archive-label">Top projects</span>
            <div className="archive-list top-list">
              {TOP_PROJECTS.map((project, index) => (
                <a className="archive-row" href={project.url} key={project.name} rel="noreferrer" target="_blank">
                  <span className="archive-number">0{index + 1}</span>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <span className="archive-stack">{project.stack}</span>
                  <span className="archive-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>

          <div className="archive-group more-projects">
            <span className="archive-label">More work</span>
            <div className="archive-list">
              {MORE_PROJECTS.map((project) => (
                <a className="archive-row" href={project.url} key={project.name} rel="noreferrer" target="_blank">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <span className="archive-stack">{project.stack}</span>
                  <span className="archive-arrow" aria-hidden="true">↗</span>
                </a>
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
              useful, write to me right here — without leaving the website.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

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
              <li><a href="#contact">Contact</a></li>
              <li><a href="#archive">Projects</a></li>
              <li><a href="#certificates">Certificates</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bar">
          <span>&copy; Enis Shorra &middot; 2026</span>
          <span>Limmattal, Switzerland</span>
        </div>
      </footer>
    </>
  );
}
