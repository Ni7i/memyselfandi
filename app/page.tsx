import Link from "next/link";

const PROJECTS = [
  { name: "stockrendite",        desc: "Track your holdings, see the return your broker won't.", stack: "C# · Blazor", year: 2026, url: "https://stock-rendite.vercel.app/" },
  { name: "whiteplayer",         desc: "A minimal Windows music player I actually use daily.",   stack: "C# · WPF",    year: 2026 },
  { name: "memyselfandi",        desc: "This site. Rewritten more times than I'd like to admit.", stack: "TypeScript", year: 2026, url: "https://github.com/Ni7i/memyselfandi" },
  { name: "Quizlot",             desc: "A quiz platform for classmates who wouldn't pay Quizlet.", stack: "TypeScript", year: 2026 },
  { name: "ICT Regios 2026",     desc: "Competition build, one weekend, full stack.",              stack: "JavaScript", year: 2026 },
  { name: "impostergame",        desc: "First paid project. Party game for a youth event.",        stack: "JavaScript", year: 2026 },
  { name: "screentime-blocker",  desc: "Locks me out of Instagram after 30 minutes.",              stack: "JavaScript", year: 2026 },
  { name: "Oase Jugendraum",     desc: "Web app for the local youth room, actual users.",          stack: "Python",     year: 2026 },
  { name: "midnight-calculator", desc: "Custom calculator for a local SME. My first client.",      stack: "C#",         year: 2025 },
  { name: "BudgetBuddy",         desc: "Budget tracker from when I still thought CLI was cool.",   stack: "Python",     year: 2025 },
];

export default function Home() {
  const sorted = [...PROJECTS].sort((a, b) => b.year - a.year);

  return (
    <>
      {/* ─── HEADER ─── */}
      <header className="hdr">
        <a href="/" className="logo">
          Enis<sup>ES</sup>
        </a>
        <div className="hdr-right">
          <a className="pill" href="mailto:shorra.enis@hotmail.com">Enquire</a>
          <a className="pill ghost" href="#work">Work</a>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-img" />
        <div className="hero-inner">
          <h1 className="hero-title">
            Shipping
            <span className="em">extraordinary</span>
          </h1>
          <div className="hero-sub">Enis Shorra · Developer · Since 2024</div>
        </div>
      </section>

      {/* ─── INTRO ─── */}
      <section className="band">
        <div className="intro">
          <div className="intro-text">
            <p>
              I&apos;m a seventeen year old developer based near Zurich. I
              write C# by default, TypeScript on the web, and Python for
              anything that needs to move quickly.
            </p>
            <p>
              Currently mid-apprenticeship and preparing for the ICT
              Regios 2026 — the regional round of the Swiss ICT skills
              competition. Weekends are for shipping.
            </p>
            <a className="link" href="#work">
              <span className="arr">→</span> See the work
            </a>
          </div>
          <div className="card-img kosovo" aria-hidden="true" />
        </div>
      </section>

      {/* ─── FEATURED ─── */}
      <div className="featured-wrap">
        <a href="https://stock-rendite.vercel.app/" target="_blank" rel="noreferrer" className="featured">
          <div className="featured-bg" />
          <div className="featured-inner">
            <div className="featured-top">
              <span className="label">Featured</span>
              <span className="featured-cat label">Investing · Blazor</span>
            </div>
            <div className="featured-bot">
              <h3 className="featured-title">Stockrendite</h3>
              <p className="featured-sub">Track your holdings, see the return your broker won&apos;t.</p>
              <span className="link" style={{ marginTop: 8 }}>
                <span className="arr">→</span> Visit
              </span>
            </div>
          </div>
        </a>
      </div>

      {/* ─── SELECTED WORK LIST ─── */}
      <section className="works" id="work">
        <div className="works-head">
          <h2>Selected <span className="it">work.</span></h2>
          <a className="link" href="https://github.com/Ni7i" target="_blank" rel="noreferrer">
            <span className="arr">→</span> All on GitHub
          </a>
        </div>
        <ol className="works-list">
          {sorted.map((p, i) => {
            const rowProps = p.url
              ? { as: "a" as const, href: p.url, target: "_blank" as const, rel: "noreferrer" as const }
              : {};
            return (
              <li key={p.name}>
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noreferrer" className="work-row link">
                    <span className="work-num">{String(i + 1).padStart(2, "0")}</span>
                    <div className="work-name">
                      {p.name}
                      <span className="desc">{p.desc}</span>
                    </div>
                    <span className="work-stack">{p.stack}</span>
                    <span className="work-year">{p.year}</span>
                    <span className="work-arr">↗</span>
                  </a>
                ) : (
                  <div className="work-row" {...rowProps}>
                    <span className="work-num">{String(i + 1).padStart(2, "0")}</span>
                    <div className="work-name">
                      {p.name}
                      <span className="desc">{p.desc}</span>
                    </div>
                    <span className="work-stack">{p.stack}</span>
                    <span className="work-year">{p.year}</span>
                    <span className="work-arr">·</span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* ─── PHILOSOPHY ─── */}
      <div className="philo-wrap">
        <div className="philo">
          <div className="philo-left">
            <span className="label philo-label">Approach</span>
            <h3>
              Simple things done well.
              <span className="it">Not the other way around.</span>
            </h3>
            <a className="link" href="mailto:shorra.enis@hotmail.com" style={{ marginTop: 28 }}>
              <span className="arr">→</span> Get in touch
            </a>
          </div>
          <div className="philo-right" aria-hidden="true" />
        </div>
      </div>

      {/* ─── SETUP ─── */}
      <section className="setup">
        <div className="setup-head">
          <h2>What&apos;s on <span className="it">the desk.</span></h2>
          <span className="label" style={{ color: "var(--cream-dim)" }}>Setup</span>
        </div>
        <div className="setup-grid">
          <div className="setup-item">
            <div className="setup-k">Laptop</div>
            <div className="setup-v">MacBook Pro 16&Prime;</div>
            <div className="setup-sub">Apple M4 Pro · 24 GB unified · Space Black</div>
          </div>
          <div className="setup-item">
            <div className="setup-k">Desktop</div>
            <div className="setup-v">Custom Build</div>
            <div className="setup-sub">Ryzen 7 7800X3D · RTX 4070 Ti Super · 32 GB DDR5</div>
          </div>
          <div className="setup-item">
            <div className="setup-k">Keyboard</div>
            <div className="setup-v">MX Mechanical Mini</div>
            <div className="setup-sub">Tactile · low-profile · quiet</div>
          </div>
          <div className="setup-item">
            <div className="setup-k">Mouse</div>
            <div className="setup-v">MX Master 3S</div>
            <div className="setup-sub">Been on this for years now</div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <div className="cta-wrap">
        <div className="cta">
          <div>
            <span className="cta-tag">Now Available</span>
            <h3 className="cta-title">
              Looking for an internship.
              <span className="it">Zurich or Aargau.</span>
            </h3>
            <a className="link" href="mailto:shorra.enis@hotmail.com" style={{ marginTop: 32 }}>
              <span className="arr">→</span> Write me
            </a>
          </div>
          <div className="cta-right" aria-hidden="true" />
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="foot-wrap">
        <div className="foot">
          <div>
            <h4>Enis Shorra</h4>
            <p className="foot-word">
              Seventeen. Switzerland. Building things one weekend at a time.
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
              <li><a href="mailto:shorra.enis@hotmail.com">shorra.enis@hotmail.com</a></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/projects">Projects</Link></li>
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
