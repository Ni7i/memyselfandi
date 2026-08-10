import Link from "next/link";

const RECENT = [
  { name: "stockrendite", desc: "Track your holdings and see returns your broker won't show.", stack: "C# · Blazor", year: 2026, url: "https://stock-rendite.vercel.app/", thumb: "thumb-city" as const },
  { name: "whiteplayer",  desc: "A minimal Windows music player. I use it every day.",           stack: "C# · WPF",    year: 2026, thumb: "thumb-still" as const },
];

const OTHER = [
  { name: "memyselfandi",        stack: "TypeScript",  year: 2026 },
  { name: "Quizlot",             stack: "TypeScript",  year: 2026 },
  { name: "ICT Regios 2026",     stack: "JavaScript",  year: 2026 },
  { name: "impostergame",        stack: "JavaScript",  year: 2026 },
  { name: "screentime-blocker",  stack: "JavaScript",  year: 2026 },
  { name: "Oase Jugendraum",     stack: "Python",      year: 2026 },
  { name: "midnight-calculator", stack: "C#",          year: 2025 },
  { name: "BudgetBuddy",         stack: "Python",      year: 2025 },
];

export default function Home() {
  return (
    <>
      {/* ─── NAV ─── */}
      <nav className="nav">
        <a href="/" className="logo" aria-label="Enis Shorra">
          <span className="top">ENIS</span>
          <span className="bot">SHORRA</span>
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#setup">Setup</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href="mailto:shorra.enis@hotmail.com">Get in touch</a>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <h1 className="hero-title">
              enisshorra<span className="dot">.</span>ch
            </h1>
            <p className="hero-sub">
              A personal corner of the internet for a 17-year-old developer
              from Switzerland. Notes on the projects I ship, the tools I
              lean on, and what I&apos;m building next.
            </p>
          </div>

          {/* Grey perspective grid + orb art (replaces Conway's orange) */}
          <div className="hero-art">
            <svg viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="orb1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#d5cfc0" />
                  <stop offset="60%" stopColor="#8a857a" />
                  <stop offset="100%" stopColor="#3a3833" />
                </radialGradient>
                <radialGradient id="orb2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#a8a396" />
                  <stop offset="100%" stopColor="#242220" />
                </radialGradient>
                <linearGradient id="fade" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#8a857a" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8a857a" stopOpacity="0" />
                </linearGradient>
                <pattern id="dots" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.6" fill="#c7c1b3" />
                </pattern>
              </defs>

              {/* Perspective grid (floor) */}
              <g stroke="#4a4841" strokeWidth="0.6" fill="none" opacity="0.85">
                {Array.from({ length: 14 }).map((_, i) => (
                  <line key={`h${i}`}
                    x1="0" y1={280 + i * 12 * (1 + i * 0.08)}
                    x2="600" y2={280 + i * 12 * (1 + i * 0.08)} />
                ))}
                {Array.from({ length: 22 }).map((_, i) => {
                  const x = i * (600 / 21);
                  return <line key={`v${i}`} x1={x} y1="280" x2={300 + (x - 300) * 3.2} y2="450" />;
                })}
              </g>

              {/* Back wall grid */}
              <g stroke="#5a564d" strokeWidth="0.5" fill="none" opacity="0.6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={`bh${i}`} x1="140" y1={40 + i * 20} x2="460" y2={40 + i * 20} />
                ))}
                {Array.from({ length: 17 }).map((_, i) => (
                  <line key={`bv${i}`} x1={140 + i * 20} y1="40" x2={140 + i * 20} y2="280" />
                ))}
              </g>

              {/* Central dotted rectangle */}
              <rect x="180" y="90" width="240" height="150" fill="url(#dots)" opacity="0.55" />
              <rect x="180" y="90" width="240" height="150" fill="none" stroke="#7a7469" strokeWidth="0.8" />

              {/* Central star burst */}
              <g transform="translate(300 165)" fill="#e6e0d1" opacity="0.9">
                <path d="M0,-14 L3,-3 L14,0 L3,3 L0,14 L-3,3 L-14,0 L-3,-3 Z" />
                <circle r="2" fill="#f4f1ea" />
              </g>

              {/* Orbs */}
              <circle cx="80" cy="380" r="60" fill="url(#orb1)" opacity="0.85" />
              <circle cx="80" cy="380" r="60" fill="none" stroke="#7a7469" strokeWidth="0.5" opacity="0.6" />

              <circle cx="530" cy="200" r="18" fill="url(#orb2)" />

              {/* Paper plane bottom-right */}
              <g transform="translate(500 320) rotate(-15)" stroke="#c7c1b3" strokeWidth="1" fill="none">
                <path d="M0,0 L60,10 L20,20 L60,10 L30,45 L20,20 Z" />
              </g>

              {/* Corner accents */}
              <line x1="20" y1="20" x2="20" y2="60" stroke="#7a7469" strokeWidth="1" />
              <line x1="20" y1="20" x2="60" y2="20" stroke="#7a7469" strokeWidth="1" />
              <line x1="580" y1="430" x2="580" y2="390" stroke="#7a7469" strokeWidth="1" />
              <line x1="580" y1="430" x2="540" y2="430" stroke="#7a7469" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </section>

      {/* ─── LIGHT MIDDLE: 3-COL LAYOUT ─── */}
      <section className="light" id="about">
        <div className="light-inner">
          <div className="tri">

            {/* LEFT: About me */}
            <div className="tri-col">
              <h2 className="tri-h">About me</h2>

              <article className="card-l">
                <div className="thumb thumb-me tall" />
                <div className="chips"><span className="chip">Personal</span></div>
                <h3>Seventeen, Rudolfstetten, and a lot of caffeine.</h3>
                <p>
                  I was born to Kosovar parents and grew up in the Aargau
                  countryside. I&apos;ve been writing code seriously for
                  over two years — started with C# and it stuck. When
                  I&apos;m not at the keyboard, I&apos;m at the gym, on the
                  bike, or eating with my family.
                </p>
                <span className="meta">Since 2024</span>
              </article>

              <article className="card-l">
                <div className="thumb thumb-view" />
                <h3>Things I&apos;m into</h3>
                <p>
                  Coding, cycling, Kosovo, my family, the gym, C# for how
                  boring-in-a-good-way it is, and Bilal Sonses on repeat.
                </p>
                <span className="meta">Right now</span>
              </article>
            </div>

            {/* CENTER: Featured */}
            <div className="tri-col center" id="work">
              <h2 className="tri-h">&nbsp;</h2>
              <a href="https://stock-rendite.vercel.app/" target="_blank" rel="noreferrer" className="card-link card-l">
                <div className="thumb thumb-city big" />
                <div className="chips">
                  <span className="chip">Featured</span>
                  <span className="chip hollow">C# · Blazor</span>
                </div>
                <h3 className="title-lg">
                  Stockrendite — the return your broker doesn&apos;t want you to see.
                </h3>
                <p className="lead">
                  A follow-up to every &ldquo;you made 12% this year&rdquo; broker
                  screen. Stockrendite tracks holdings and computes what you
                  actually earned after fees, dividends and currency shifts —
                  not what the app wants you to feel.
                </p>
                <span className="meta">Live · updated 2026</span>
              </a>
            </div>

            {/* RIGHT: Recent work */}
            <div className="tri-col" id="recent">
              <h2 className="tri-h">Recent work</h2>

              {RECENT.map((p) => (
                <article className="card-l" key={p.name}>
                  <div className={`thumb ${p.thumb}`} />
                  <div className="chips">
                    <span className="chip grey">{p.stack}</span>
                  </div>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer" className="card-link">
                      <h3>{p.name}</h3>
                    </a>
                  ) : (
                    <h3>{p.name}</h3>
                  )}
                  <p>{p.desc}</p>
                  <span className="meta">{p.year}</span>
                </article>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ─── SETUP ─── */}
      <section className="setup" id="setup">
        <div className="setup-inner">
          <div className="setup-head">
            <h2>What&rsquo;s on the desk.</h2>
            <span className="meta">Setup — 2026</span>
          </div>
          <div className="setup-grid">
            <div className="setup-item">
              <div className="setup-k">Laptop</div>
              <div className="setup-v">MacBook Pro 16&Prime;</div>
              <div className="setup-sub">M4 Pro · 24 GB unified</div>
            </div>
            <div className="setup-item">
              <div className="setup-k">Desktop</div>
              <div className="setup-v">Custom Build</div>
              <div className="setup-sub">Ryzen 7 7800X3D · RTX 4070 Ti Super</div>
            </div>
            <div className="setup-item">
              <div className="setup-k">Keyboard</div>
              <div className="setup-v">MX Mechanical Mini</div>
              <div className="setup-sub">Tactile · low-profile</div>
            </div>
            <div className="setup-item">
              <div className="setup-k">Mouse</div>
              <div className="setup-v">MX Master 3S</div>
              <div className="setup-sub">Been on it forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DARK BOTTOM ─── */}
      <section className="dark-band" id="contact">
        <div className="grid-bg" />
        <div className="dark-band-inner">
          <div>
            <h2 className="dark-title">
              Currently looking for the <em>right team.</em>
            </h2>
            <p className="dark-sub">
              I&apos;m mid-apprenticeship and open for an ICT internship near
              Zurich or Aargau. I ship, I take feedback, I don&apos;t need
              hand-holding. If that sounds useful, get in touch.
            </p>
            <a href="mailto:shorra.enis@hotmail.com" className="dark-btn">
              Write me →
            </a>
          </div>

          <div className="floppies">
            {OTHER.slice(0, 4).map((p, i) => (
              <div key={p.name} className={`floppy f${i + 1}`}>
                <div>
                  <div className="fp-tag">Project · {p.stack}</div>
                  <div className="fp-name">{p.name}</div>
                </div>
                <div className="fp-meta">{p.year}</div>
                <div className="fp-slot" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="foot-wrap">
        <div className="foot">
          <div>
            <h4>Enis Shorra</h4>
            <p className="foot-word">
              Seventeen. Switzerland. Building things,
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
            <h4>Reach me</h4>
            <ul>
              <li><a href="mailto:shorra.enis@hotmail.com">Mail</a></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/projects">Projects</Link></li>
            </ul>
          </div>
          <div>
            <h4>Also built</h4>
            <ul>
              {OTHER.slice(0, 5).map((p) => (
                <li key={p.name}>{p.name}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="foot-bar">
          <span>© Enis Shorra · 2026</span>
          <span>Rudolfstetten, Switzerland</span>
        </div>
      </footer>
    </>
  );
}
