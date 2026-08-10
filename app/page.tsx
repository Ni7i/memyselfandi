import Link from "next/link";

type Stack = "csharp" | "ts" | "js" | "py" | "hot" | "other";

const PROJECTS: {
  name: string;
  year: number;
  stack: Stack;
  tags: string[];
  initial: string;
  url?: string;
  thumbs: Stack[];
}[] = [
  { name: "stockrendite",       year: 2026, stack: "csharp", tags: ["FINANCE", "APP"],       initial: "SR", url: "https://stock-rendite.vercel.app/", thumbs: ["csharp", "csharp", "hot"] },
  { name: "whiteplayer",        year: 2026, stack: "csharp", tags: ["DESKTOP", "AUDIO"],     initial: "WP", thumbs: ["csharp", "other", "csharp"] },
  { name: "memyselfandi",       year: 2026, stack: "ts",     tags: ["PORTFOLIO", "WEB"],     initial: "MM", url: "https://github.com/Ni7i/memyselfandi", thumbs: ["ts", "hot", "ts"] },
  { name: "Quizlot",            year: 2026, stack: "ts",     tags: ["EDUCATION", "APP"],     initial: "QZ", thumbs: ["ts", "ts", "hot"] },
  { name: "ICT Regios 2026",    year: 2026, stack: "js",     tags: ["COMPETITION"],          initial: "IR", thumbs: ["js", "hot", "js"] },
  { name: "trackmyfood",        year: 2026, stack: "js",     tags: ["HEALTH", "FRONTEND"],   initial: "TF", thumbs: ["js", "hot", "js"] },
  { name: "impostergame",       year: 2026, stack: "js",     tags: ["GAME", "CLIENT"],       initial: "IG", thumbs: ["js", "js", "hot"] },
  { name: "screentime-blocker", year: 2026, stack: "js",     tags: ["TOOL", "PRODUCTIVITY"], initial: "SB", thumbs: ["js", "hot", "js"] },
  { name: "Oase Jugendraum",    year: 2026, stack: "py",     tags: ["COMMUNITY", "WEB"],     initial: "OJ", thumbs: ["py", "hot", "py"] },
  { name: "SwissSkills 25",     year: 2026, stack: "other",  tags: ["COMPETITION"],          initial: "SS", thumbs: ["other", "hot", "other"] },
  { name: "midnight-calculator",year: 2025, stack: "csharp", tags: ["CLIENT", "TOOL"],       initial: "MC", thumbs: ["csharp", "csharp", "hot"] },
  { name: "BudgetBuddy",        year: 2025, stack: "py",     tags: ["FINANCE"],              initial: "BB", thumbs: ["py", "py", "hot"] },
  { name: "ReactProjekt",       year: 2025, stack: "js",     tags: ["LEARNING"],             initial: "RP", thumbs: ["js", "hot", "js"] },
  { name: "LCR",                year: 2025, stack: "csharp", tags: ["GAME", "OOP"],          initial: "LC", thumbs: ["csharp", "hot", "csharp"] },
  { name: "Zitate",             year: 2025, stack: "py",     tags: ["APP", "TOOL"],          initial: "ZT", thumbs: ["py", "hot", "py"] },
];

export default function Home() {
  const sorted = [...PROJECTS].sort((a, b) => b.year - a.year);
  const now = new Date();
  const clock = `${String(now.getUTCHours()).padStart(2, "0")} : ${String(now.getUTCMinutes()).padStart(2, "0")} : ${String(now.getUTCSeconds()).padStart(2, "0")}`;

  return (
    <>
      {/* NAV */}
      <div className="nav-wrap">
        <nav className="nav">
          <div className="nav-brand">
            <span className="glyph">E</span>
            <span>Enis Shorra</span>
          </div>
          <span className="nav-center">Nice entrance</span>
          <button className="nav-menu" aria-label="Menu">
            <span />
          </button>
        </nav>
      </div>

      {/* CORNER WIDGET */}
      <aside className="corner">
        <div className="corner-hd">
          <span className="avatar">E</span>
          <span>Get in touch</span>
        </div>
        <a className="corner-row" href="mailto:shorra.enis@hotmail.com">
          <span>Mail me</span><span className="plus">(+)</span>
        </a>
        <a className="corner-row" href="https://github.com/Ni7i" target="_blank" rel="noreferrer">
          <span>GitHub</span><span className="plus">(+)</span>
        </a>
        <a className="corner-row" href="https://linkedin.com/in/enis-shorra" target="_blank" rel="noreferrer">
          <span>LinkedIn</span><span className="plus">(+)</span>
        </a>
      </aside>

      {/* HERO */}
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-grain" />
        <div className="hero-inner">
          <span className="hero-tag">Enis Shorra · Developer</span>
          <div className="hero-grid">
            <h1 className="hero-title">
              A seventeen year old who ships code that <span className="hot">actually runs</span>.
            </h1>
            <p className="hero-side">
              Based in Switzerland, born to Kosovar parents. C# by default,
              TypeScript on the web, Python for anything sharp. Currently
              apprenticing and prepping for ICT Regios 2026.
            </p>
          </div>
        </div>
        <div className="hero-strip">
          <span className="item">15+ shipped</span>
          <span className="item hide-sm">Rudolfstetten based</span>
          <span className="item"><span className="bracket">[</span>&nbsp;{clock}&nbsp;<span className="bracket">]</span></span>
          <a className="item" href="https://github.com/Ni7i" target="_blank" rel="noreferrer">GitHub <span className="bracket">(+)</span></a>
          <a className="item" href="https://linkedin.com/in/enis-shorra" target="_blank" rel="noreferrer">LinkedIn <span className="bracket">(+)</span></a>
          <span className="item">DE / EN</span>
        </div>
      </header>

      {/* BIG STATEMENT */}
      <section className="statement">
        <h2 className="statement-text">
          <span className="indent" />I build things people
          {" "}<em>actually use</em>. Here&apos;s a taste of what&apos;s
          out there and running.
        </h2>
        <span className="statement-label">Featured work</span>
      </section>

      {/* WORKS */}
      <section className="works">
        {sorted.map((p) => (
          <div key={p.name} className="work">
            <div className="work-name">
              {p.url ? <a href={p.url} target="_blank" rel="noreferrer">{p.name}</a> : p.name}
            </div>
            <div className="work-tags">
              {p.tags.map((t) => (<span key={t} className="tag">{t}</span>))}
            </div>
            <div className="work-year">{p.year}</div>
            <div className="work-thumbs">
              {p.thumbs.map((t, i) => (
                <span key={i} className={`thumb ${t}`}>{i === 0 ? p.initial : ""}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* BAND — what I use */}
      <section className="band">
        <h2 className="band-title">
          Tools of <span className="hot">the trade</span>, in the order I reach for them.
        </h2>
        <span className="band-side">Stack</span>
        <div className="chips">
          <span className="chip hot">C#</span>
          <span className="chip">.NET</span>
          <span className="chip">Blazor</span>
          <span className="chip">WPF</span>
          <span className="chip">TypeScript</span>
          <span className="chip">React</span>
          <span className="chip">Next.js</span>
          <span className="chip">Python</span>
          <span className="chip">SQL</span>
          <span className="chip">JavaScript</span>
          <span className="chip">Git</span>
          <span className="chip">Figma</span>
        </div>
      </section>

      {/* SETUP */}
      <section className="setup">
        <h2 className="band-title">
          What&apos;s <span className="hot">on the desk</span>.
        </h2>
        <span className="band-side">Setup</span>
        <ul className="setup-list">
          <li className="setup-item">
            <div className="setup-k">Laptop</div>
            <div className="setup-v">MacBook Pro 16&Prime;</div>
            <div className="setup-sub">Apple M4 Pro · 24 GB · Space Black</div>
          </li>
          <li className="setup-item">
            <div className="setup-k">Desktop</div>
            <div className="setup-v">Custom Build</div>
            <div className="setup-sub">Ryzen 7 7800X3D · RTX 4070 Ti Super · 32 GB</div>
          </li>
          <li className="setup-item">
            <div className="setup-k">Keyboard</div>
            <div className="setup-v">MX Mechanical Mini</div>
            <div className="setup-sub">Tactile · low-profile</div>
          </li>
          <li className="setup-item">
            <div className="setup-k">Mouse</div>
            <div className="setup-v">MX Master 3S</div>
            <div className="setup-sub">Been using it forever</div>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <div className="cta-wrap">
        <div className="cta">
          <span className="cta-tag">// currently open</span>
          <h3 className="cta-title">Looking for an ICT internship near Zurich or Aargau.</h3>
          <p className="cta-body">
            I&apos;m 17, mid-apprenticeship, hungry to work with a serious
            team. I ship, I take feedback, I show up when I say I will.
            If there&apos;s room on your bench, let&apos;s talk.
          </p>
          <a href="mailto:shorra.enis@hotmail.com" className="cta-btn">
            Write me <span className="arr">→</span>
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="foot">
        <span>© Enis Shorra · 2026</span>
        <div className="foot-links">
          <a href="https://github.com/Ni7i" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/enis-shorra" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="mailto:shorra.enis@hotmail.com">Mail</a>
          <Link href="/blog">Blog</Link>
          <Link href="/projects">Projects</Link>
        </div>
      </footer>
    </>
  );
}
