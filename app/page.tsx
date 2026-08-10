import Link from "next/link";

const RECENT = [
  { name: "whiteplayer",  desc: "A minimal Windows music player. I use it every day.",           stack: "C# · WPF",    year: 2026, thumb: "thumb-still" },
  { name: "memyselfandi", desc: "This site — Next.js, no CMS, hand-tuned.",                       stack: "TypeScript",   year: 2026, thumb: "thumb-view", url: "https://github.com/Ni7i/memyselfandi" },
];

const OTHER = [
  "Quizlot", "ICT Regios 2026", "impostergame", "screentime-blocker",
  "Oase Jugendraum", "midnight-calculator", "BudgetBuddy",
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

      {/* ─── INTRO ─── */}
      <section className="intro">
        <div className="intro-inner">
          <h1 className="intro-title">
            enisshorra<em>.ch</em>
          </h1>
          <p className="intro-sub">
            A personal corner of the internet for a seventeen-year-old
            developer from Switzerland. Notes on the projects I ship, the
            tools I lean on, and what I&apos;m building next.
          </p>
        </div>
      </section>

      {/* ─── MAGAZINE 3-COL ─── */}
      <section className="mag" id="about">
        <div className="mag-inner">

          <div className="mag-heads">
            <div className="mag-h">About me</div>
            <div className="mag-h middle">—</div>
            <div className="mag-h">Recent work</div>
          </div>

          <div className="tri">

            {/* LEFT COLUMN */}
            <div className="tri-col">
              <article className="card-l">
                <div className="thumb thumb-me portrait" />
                <div className="chips"><span className="chip">Personal</span></div>
                <h3>Seventeen, Rudolfstetten, and a lot of caffeine.</h3>
                <p>
                  Born to Kosovar parents, grew up in the Aargau countryside.
                  I&apos;ve been writing code seriously for two-plus years —
                  started with C# and it stuck. When I&apos;m not at the
                  keyboard I&apos;m at the gym, on the bike, or eating with
                  the family.
                </p>
                <span className="meta">Since 2024</span>
              </article>

              <article className="card-l">
                <div className="thumb thumb-ist landscape" />
                <h3>Things I&apos;m into right now</h3>
                <p>
                  Cycling, Kosovo summers, the gym, C# for how boring-in-a-
                  good-way it is, and Bilal Sonses on repeat.
                </p>
                <span className="meta">Right now</span>
              </article>
            </div>

            {/* CENTER — FEATURED (big) */}
            <div className="tri-col" id="work">
              <a href="https://stock-rendite.vercel.app/" target="_blank" rel="noreferrer" className="card-link card-l">
                <div className="thumb thumb-city hero" />
                <div className="chips">
                  <span className="chip">Featured</span>
                  <span className="chip hollow">C# · Blazor</span>
                </div>
                <h3 className="title-lg">
                  Stockrendite — the return your broker doesn&apos;t want you to see.
                </h3>
                <p className="lead">
                  A follow-up to every &ldquo;you made 12% this year&rdquo;
                  broker screen. Stockrendite tracks holdings and computes
                  what you actually earned after fees, dividends and currency
                  shifts — not the number the app wants you to feel.
                </p>
                <span className="meta">Live · updated 2026</span>
              </a>
            </div>

            {/* RIGHT COLUMN */}
            <div className="tri-col">
              <article className="card-l">
                <div className="thumb thumb-alp square" />
                <div className="chips">
                  <span className="chip grey">{RECENT[1].stack}</span>
                </div>
                {RECENT[1].url ? (
                  <a href={RECENT[1].url} target="_blank" rel="noreferrer" className="card-link">
                    <h3>{RECENT[1].name} — this website.</h3>
                  </a>
                ) : (
                  <h3>{RECENT[1].name}</h3>
                )}
                <p>{RECENT[1].desc}</p>
                <span className="meta">{RECENT[1].year}</span>
              </article>

              <article className="card-l">
                <div className="thumb thumb-ist2 portrait" />
                <div className="chips">
                  <span className="chip grey">{RECENT[0].stack}</span>
                </div>
                <h3>{RECENT[0].name}</h3>
                <p>{RECENT[0].desc}</p>
                <span className="meta">{RECENT[0].year}</span>
              </article>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SETUP ─── */}
      <section className="setup" id="setup">
        <div className="setup-inner">
          <div className="setup-head">
            <h2>What&rsquo;s on <em>the desk.</em></h2>
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

      {/* ─── CTA ─── */}
      <section className="cta" id="contact">
        <div className="cta-inner">
          <div>
            <h2 className="cta-title">
              Currently looking for the <em>right team.</em>
            </h2>
            <p className="cta-sub">
              I&apos;m mid-apprenticeship and open for an ICT internship near
              Zurich or Aargau. I ship, I take feedback, I don&apos;t need
              hand-holding. If that sounds useful, get in touch.
            </p>
            <a href="mailto:shorra.enis@hotmail.com" className="cta-btn">
              Write me →
            </a>
          </div>
          <div className="cta-visual" />
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
              {OTHER.slice(0, 5).map((p) => <li key={p}>{p}</li>)}
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
