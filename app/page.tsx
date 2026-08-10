import Link from "next/link";

const PROJECTS = [
  { name: "stockrendite",        stack: "C# · Blazor", year: 2026, blurb: "Track your holdings, see the return your broker doesn't want to show you.", url: "https://stock-rendite.vercel.app/" },
  { name: "whiteplayer",         stack: "C# · WPF",    year: 2026, blurb: "A minimal Windows music player. I use it every day." },
  { name: "memyselfandi",        stack: "TypeScript",  year: 2026, blurb: "This website. Rewritten more times than I care to admit.", url: "https://github.com/Ni7i/memyselfandi" },
  { name: "Quizlot",             stack: "TypeScript",  year: 2026, blurb: "A quiz platform for classmates who wouldn't pay for the other one." },
  { name: "ICT Regios 2026",     stack: "JavaScript",  year: 2026, blurb: "Competition entry — full-stack, one weekend." },
  { name: "trackmyfood",         stack: "JavaScript",  year: 2026, blurb: "Food tracking frontend. Learning what really matters in UX." },
  { name: "impostergame",        stack: "JavaScript",  year: 2026, blurb: "My first paid project. Party game for a youth event." },
  { name: "screentime-blocker",  stack: "JavaScript",  year: 2026, blurb: "Locks me out of Instagram after 30 minutes. Ironic that I built it." },
  { name: "Oase Jugendraum",     stack: "Python",      year: 2026, blurb: "Web app for the local youth room. Real users, real feedback." },
  { name: "SwissSkills 25",      stack: "—",           year: 2026, blurb: "Swiss national skills competition — the qualifier round." },
  { name: "midnight-calculator", stack: "C#",          year: 2025, blurb: "Custom calculator for a local SME. My first real client." },
  { name: "BudgetBuddy",         stack: "Python",      year: 2025, blurb: "Budgeting app. Written when I still thought CLI was cool." },
  { name: "ReactProjekt",        stack: "JavaScript",  year: 2025, blurb: "Learning React out loud. Kept for the diff." },
  { name: "LCR",                 stack: "C#",          year: 2025, blurb: "A little OOP dice game. Where I fell in love with C#." },
  { name: "Zitate",              stack: "Python",      year: 2025, blurb: "A collection app for quotes I couldn't stop screenshotting." },
];

const RECITERS = [
  { name: "Muhammad Ayyub",   where: "Al-Nabawi · Madinah" },
  { name: "Yasser Al-Dosari", where: "King Khalid · Riyadh" },
  { name: "Ali Jabir",        where: "Al-Haram · Makkah" },
  { name: "Maher Al-Muaiqly", where: "Al-Haram · Makkah" },
];

export default function Home() {
  const sorted = [...PROJECTS].sort((a, b) => b.year - a.year);

  return (
    <div className="shell">
      {/* TOP STRIP */}
      <div className="strip">
        <span><span className="dot" />open to work · ict internship</span>
        <span className="strip-r">rudolfstetten, ch · 10 aug 2026</span>
      </div>

      {/* HERO */}
      <header className="hero">
        <div>
          <h1 className="hero-name">
            enis <br />shorra<span className="amp">.</span>
          </h1>
          <span className="hero-tag">Developer · 17 · Switzerland</span>
        </div>
        <aside className="hero-meta">
          <div>
            <span className="k">Currently</span>
            <span className="v">ICT apprentice · Regios 2026 prep</span>
          </div>
          <div>
            <span className="k">Based in</span>
            <span className="v">Rudolfstetten, Aargau</span>
          </div>
          <div>
            <span className="k">Write me</span>
            <a className="v" href="mailto:shorra.enis@hotmail.com">shorra.enis@hotmail.com</a>
          </div>
        </aside>
      </header>

      {/* SECTION 01 — INTRO */}
      <section className="section">
        <div className="section-head">
          <span className="section-num">01 / who</span>
          <h2 className="section-title">the short version</h2>
        </div>
        <div className="section-body">
          <p className="lead">
            <span className="drop">I&apos;m seventeen.</span> Born to Kosovar
            parents, raised in the Aargau. Muslim. I&apos;ve been writing
            code seriously for a bit over two years — mostly C#, sometimes
            whatever the problem needs.
          </p>
          <p>
            The last portfolio I built was a bento-grid dashboard with a
            testimonial carousel and a constellation of stars for the
            projects. I deleted it. This is what&apos;s left when you strip
            the template and just say what you actually do.
          </p>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="manifesto">
        <blockquote>
          Better one thing that works than ten that look nice on Dribbble.
        </blockquote>
        <cite>— what I&apos;m learning, weekend by weekend</cite>
      </section>

      {/* SECTION 02 — WORK */}
      <section className="section">
        <div className="section-head">
          <span className="section-num">02 / craft</span>
          <h2 className="section-title">what I actually write</h2>
        </div>
        <div className="section-body">
          <p>
            <strong>C#</strong> is home — .NET for backends, Blazor for the
            web, WPF for the desktop. I reach for <strong>Python</strong>
            {" "}when I need something scripted quickly.
            {" "}<strong>TypeScript</strong> with React or Next.js when it
            has to live in a browser. <strong>SQL</strong> whenever the
            data starts misbehaving.
          </p>
          <p>
            Currently training for <strong>ICT Regios 2026</strong> — the
            regional round of the Swiss ICT skills competition — after
            qualifying through SwissSkills 25. School during the week,
            projects on weekends.
          </p>
        </div>
      </section>

      {/* SECTION 03 — PROJECTS */}
      <section className="section">
        <div className="section-head">
          <span className="section-num">03 / built</span>
          <h2 className="section-title">things I&apos;ve shipped</h2>
        </div>
        <div className="section-body">
          <ul className="projects">
            {sorted.map((p) => (
              <li key={p.name} className="project">
                <span className="project-year">{p.year}</span>
                <div className="project-main">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer" className="project-name link">{p.name}</a>
                  ) : (
                    <span className="project-name">{p.name}</span>
                  )}
                  <span className="project-blurb">{p.blurb}</span>
                </div>
                <span className="project-stack">{p.stack}</span>
              </li>
            ))}
          </ul>
          <div className="gh-line">
            All source, warts and all →{" "}
            <a href="https://github.com/Ni7i" target="_blank" rel="noreferrer">github.com/Ni7i</a>
          </div>
        </div>
      </section>

      {/* SECTION 04 — SETUP */}
      <section className="section">
        <div className="section-head">
          <span className="section-num">04 / setup</span>
          <h2 className="section-title">what I type on</h2>
        </div>
        <div className="section-body">
          <div className="specs">
            <div className="spec">
              <span className="spec-k">Laptop</span>
              <div className="spec-v">MacBook Pro 16&Prime;</div>
              <div className="spec-sub">Apple M4 Pro · 24 GB · Space Black</div>
            </div>
            <div className="spec">
              <span className="spec-k">Desktop</span>
              <div className="spec-v">Custom Build</div>
              <div className="spec-sub">Ryzen 7 7800X3D · RTX 4070 Ti Super · 32 GB DDR5</div>
            </div>
            <div className="spec">
              <span className="spec-k">Keyboard</span>
              <div className="spec-v">MX Mechanical Mini</div>
              <div className="spec-sub">Tactile · low-profile · quiet</div>
            </div>
            <div className="spec">
              <span className="spec-k">Mouse</span>
              <div className="spec-v">MX Master 3S</div>
              <div className="spec-sub">Been using it forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05 — LIFE */}
      <section className="section">
        <div className="section-head">
          <span className="section-num">05 / off-screen</span>
          <h2 className="section-title">when I close the lid</h2>
        </div>
        <div className="section-body">
          <p>
            Gym. Bike. Family. Food. Nothing complicated. My phone plays
            more Qur&apos;an recitation than music these days — right now
            I&apos;m going through Surah al-Mulk again. These are the
            voices on repeat:
          </p>
          <div className="reciters" style={{ marginTop: 20 }}>
            {RECITERS.map((r) => (
              <div key={r.name} className="reciter">
                <span className="reciter-name">{r.name}</span>
                <span className="reciter-where">{r.where}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta">
        <span className="cta-tag">// looking for</span>
        <h3 className="cta-title">an ICT internship,<br />Zurich or Aargau.</h3>
        <p className="cta-body">
          I&apos;m 17, ready to start. I ship. I ask questions. I show up
          when I say I will. If your team has room for one more, I&apos;d
          love to talk.
        </p>
        <a href="mailto:shorra.enis@hotmail.com" className="cta-btn">
          Write me <span className="arr">→</span>
        </a>
      </div>

      {/* FOOT */}
      <footer className="foot">
        <span>© Enis Shorra · 2026</span>
        <div className="foot-links">
          <a href="https://github.com/Ni7i" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/enis-shorra" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://discord.com/users/nisi_17" target="_blank" rel="noreferrer">Discord</a>
          <Link href="/blog">Blog</Link>
          <Link href="/projects">Projects</Link>
        </div>
      </footer>
    </div>
  );
}
