import Link from "next/link";

const FEATURED_PROJECTS = [
  {
    name: "Twinn",
    type: "Personal",
    description:
      "Twinn matches people based on the traits they enter. If nobody suitable is available, the app creates a fictional AI friend they can talk to.",
    stack: ["C#", ".NET", "Matching", "AI chat"],
    year: "2026",
  },
  {
    name: "Quizlot",
    type: "Personal",
    description:
      "A focused flashcard tool built for my own exam weeks. Creating cards is quick, reviewing stays simple, and the interface keeps everything unnecessary out of the way.",
    stack: ["TypeScript", "Learning tool"],
    year: "2026",
  },
];

const OTHER_PROJECTS = [
  {
    name: "memyselfandi",
    type: "Personal",
    description: "This portfolio — designed, built and deployed by me.",
    stack: "TypeScript · Next.js",
    url: "https://github.com/Ni7i/memyselfandi",
  },
  {
    name: "ICT Regios",
    type: "Competition",
    description: "Two participations in the regional software development championship.",
    stack: "Software development",
  },
  {
    name: "HPGarage",
    type: "Client work",
    description: "A web application for a local garage, from requirements to deployment.",
    stack: "C# · ASP.NET",
  },
  {
    name: "impostergame",
    type: "Personal",
    description: "A small party game about finding the impostor in the room.",
    stack: "JavaScript",
  },
  {
    name: "screentime-blocker",
    type: "Personal",
    description: "A practical experiment for spending less time on the phone.",
    stack: "JavaScript",
  },
  {
    name: "Oase Jugendraum",
    type: "Community",
    description: "A web application created for a local youth room.",
    stack: "Python",
  },
  {
    name: "midnight-calculator",
    type: "Client work",
    description: "A purpose-built calculator for a local small business.",
    stack: "C#",
  },
];

const SKILLS = [
  "C#",
  ".NET",
  "ASP.NET Core",
  "WPF",
  "SQL / NoSQL",
  "TypeScript",
  "Python",
  "Docker",
  "Git",
];

export default function Home() {
  return (
    <main className="site-shell">
      <nav className="site-nav" aria-label="Main navigation">
        <Link href="/" className="wordmark">Enis Shorra</Link>
        <div className="nav-items">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero" id="about">
        <div className="eyebrow">
          <span className="status-dot" aria-hidden="true" />
          Application developer · Rudolfstetten, CH
        </div>
        <h1>I&apos;m Enis.<br /><span>I build software.</span></h1>
        <p className="hero-copy">
          I&apos;m 18 and studying application development at the
          Informatikmittelschule in Baden. Most of my work is in C# and .NET.
          I enjoy starting with a rough idea and staying with it until it
          becomes something useful.
        </p>
        <div className="hero-meta">
          <span>IMS Baden · 2024–2027</span>
          <span>Praxisjahr · 2027–2028</span>
          <a href="mailto:shorra.enis@hotmail.com">Available for opportunities ↗</a>
        </div>
      </section>

      <section className="overview" aria-label="About Enis">
        <article className="info-panel">
          <header className="panel-label">Background</header>
          <div className="panel-body">
            <p>
              I first played around with Scratch as a kid. At the
              Kantonsschule Baden I started taking programming seriously.
              Since then I have learned mostly by building, asking questions
              and staying with a problem until I understand it.
            </p>
            <p>
              I&apos;ve taken part in the IT regional championships twice and
              placed fourth at Baden hackt. I&apos;m still early in the process,
              which is exactly why I&apos;m looking for a team where I can learn
              from people with more experience.
            </p>
          </div>
          <footer className="panel-footer">
            <span>EFZ Applikationsentwicklung + BM Wirtschaft</span>
            <span>2024–2028</span>
          </footer>
        </article>

        <article className="info-panel">
          <header className="panel-label">Outside code</header>
          <ul className="personal-list">
            <li><span>Football referee</span><small>AFV licence · since 2023</small></li>
            <li><span>Bike and gym</span><small>Balance away from the screen</small></li>
            <li><span>Languages</span><small>German, Albanian, English, Arabic, French</small></li>
          </ul>
          <footer className="panel-footer">
            <span>Kosovar roots · raised in Aargau</span>
          </footer>
        </article>
      </section>

      <section className="skills-section" aria-labelledby="skills-title">
        <h2 className="section-label" id="skills-title">Stack</h2>
        <div className="skill-list">
          {SKILLS.map((skill) => <span key={skill}>{skill}</span>)}
        </div>
      </section>

      <section className="projects-section" id="projects" aria-labelledby="projects-title">
        <h2 className="section-label" id="projects-title">Featured projects</h2>
        <div className="featured-list">
          {FEATURED_PROJECTS.map((project) => (
            <article className="featured-project" key={project.name}>
              <div className="project-heading">
                <h3>{project.name}</h3>
                <span className="project-type">{project.type}</span>
                <span className="project-year">{project.year}</span>
              </div>
              <p>{project.description}</p>
              <div className="project-bottom">
                <div className="tag-list">
                  {project.stack.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>

        <h2 className="section-label other-label">Other projects</h2>
        <div className="project-rows">
          {OTHER_PROJECTS.map((project) => {
            const row = (
              <>
                <div className="row-title">
                  <strong>{project.name}</strong>
                  <span>{project.type}</span>
                </div>
                <p>{project.description}</p>
                <span className="row-stack">{project.stack}</span>
                <span className="row-arrow" aria-hidden="true">{project.url ? "↗" : "—"}</span>
              </>
            );

            return project.url ? (
              <a className="project-row" href={project.url} key={project.name} rel="noreferrer" target="_blank">{row}</a>
            ) : (
              <article className="project-row" key={project.name}>{row}</article>
            );
          })}
        </div>
      </section>

      <section className="note-section" aria-labelledby="note-title">
        <h2 className="section-label" id="note-title">How I work</h2>
        <div className="note-panel">
          <p>
            When I don&apos;t know something, I ask. When I take on a task, I want
            to finish it properly and make it understandable for the next
            person.
          </p>
          <p>
            I&apos;m still at the beginning and have a lot to learn. That&apos;s why I
            want to work with people who share their experience and give honest
            feedback.
          </p>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <span className="section-label">Contact</span>
          <h2>Looking for a Praxisjahr team for 2027/28.</h2>
        </div>
        <a className="contact-link" href="mailto:shorra.enis@hotmail.com">shorra.enis@hotmail.com ↗</a>
      </section>

      <footer className="site-footer">
        <span>© Enis Shorra · 2026</span>
        <div>
          <a href="https://github.com/Ni7i" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/enis-shorra" target="_blank" rel="noreferrer">LinkedIn</a>
          <Link href="/blog">Blog</Link>
        </div>
      </footer>
    </main>
  );
}
