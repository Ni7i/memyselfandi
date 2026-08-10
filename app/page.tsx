import Link from "next/link";

const PROJECTS = [
  { name: "Stockrendite",       tag: "the return your broker hides", stack: "C# · Blazor",   year: 2026, url: "https://stock-rendite.vercel.app/" },
  { name: "whiteplayer",        tag: "a music player I use daily",   stack: "C# · WPF",       year: 2026 },
  { name: "memyselfandi",       tag: "this website",                 stack: "TypeScript",     year: 2026, url: "https://github.com/Ni7i/memyselfandi" },
  { name: "Quizlot",            tag: "flashcards, done right",       stack: "TypeScript",     year: 2026 },
  { name: "ICT Regios 2026",    tag: "competition project",          stack: "JavaScript",     year: 2026 },
  { name: "impostergame",       tag: "who am I? — party game",       stack: "JavaScript",     year: 2026 },
  { name: "screentime-blocker", tag: "less phone, more life",        stack: "JavaScript",     year: 2026 },
  { name: "Oase Jugendraum",    tag: "web app for a youth room",     stack: "Python",         year: 2026 },
  { name: "midnight-calculator",tag: "calculator for a local SME",   stack: "C#",             year: 2025 },
  { name: "BudgetBuddy",        tag: "budget tracker",               stack: "Python",         year: 2025 },
  { name: "LCR",                tag: "little random OOP game",       stack: "C#",             year: 2025 },
  { name: "Zitate",             tag: "collected quotes",             stack: "Python",         year: 2025 },
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
          <a href="#archive">Archive</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href="mailto:shorra.enis@hotmail.com">Get in touch</a>
      </nav>

      {/* ─── INTRO ─── */}
      <section className="intro">
        <div className="intro-inner">
          <div>
            <span className="stamp">Est. 2024 · Aargau</span>
            <h1 className="intro-title">
              enisshorra<em>.ch</em>
            </h1>
          </div>
          <p className="intro-sub">
            A quiet corner for a seventeen-year-old developer from
            Switzerland. Personal notes, the things I ship, and the
            people, places and habits that made them possible.
          </p>
        </div>
      </section>

      {/* ─── MAGAZINE 3-COL ─── */}
      <section className="mag" id="about">
        <div className="mag-inner">
          <div className="mag-heads">
            <div className="mag-h">About me</div>
            <div className="mag-h middle">—</div>
            <div className="mag-h">Off the keyboard</div>
          </div>

          <div className="tri">

            {/* LEFT COLUMN — About */}
            <div className="tri-col">
              <article className="card-l">
                <div className="thumb thumb-1 portrait" />
                <div className="chips"><span className="chip">Personal</span></div>
                <h3>Seventeen, Rudolfstetten, and a lot of caffeine.</h3>
                <p>
                  Born to Kosovar parents, grew up in the Aargau countryside.
                  Started writing C# two years ago on a stubborn afternoon and
                  never really stopped. Everything since &mdash; the projects,
                  the competitions, the tools &mdash; is downstream of that one
                  afternoon.
                </p>
                <span className="meta">Since 2024</span>
              </article>

              <article className="card-l">
                <div className="thumb thumb-2 landscape" />
                <div className="chips"><span className="chip grey">Long game</span></div>
                <h3>What I&apos;m actually chasing.</h3>
                <p>
                  Getting quietly good at the things I care about. Ship a
                  product people use without being told to. Win Regios. Move
                  slower than the trend but keep every promise I make.
                </p>
                <span className="meta">2026 &rarr;</span>
              </article>
            </div>

            {/* CENTER — Featured */}
            <div className="tri-col" id="work">
              <a href="https://stock-rendite.vercel.app/" target="_blank" rel="noreferrer" className="card-link card-l">
                <div className="thumb thumb-3 hero" />
                <div className="chips">
                  <span className="chip red">Featured</span>
                  <span className="chip hollow">C# · Blazor</span>
                </div>
                <h3 className="title-lg">
                  Stockrendite &mdash; the return your broker doesn&apos;t want you to see.
                </h3>
                <p className="lead">
                  Every broker screen shows you a friendly number. Stockrendite
                  computes the honest one &mdash; after fees, dividends, currency
                  shifts and the timing of every deposit. Built the way I&apos;d
                  want to see my own money.
                </p>
                <span className="meta">Live · updated 2026</span>
              </a>
            </div>

            {/* RIGHT COLUMN — Interests */}
            <div className="tri-col" id="interests">
              <article className="card-l">
                <div className="thumb thumb-4 square" />
                <div className="chips"><span className="chip grey">Interests</span></div>
                <h3>Bike, gym, family, food &mdash; in that rotation.</h3>
                <p>
                  Rides through the Reuss valley when the weather cooperates.
                  Lifts most other days. Sundays are for cooking with the family
                  and pretending I&apos;m off my laptop.
                </p>
                <span className="meta">Weekly</span>
              </article>

              <article className="card-l">
                <div className="thumb thumb-5 portrait" />
                <div className="chips"><span className="chip grey">On repeat</span></div>
                <h3>Bilal Sonses, mostly.</h3>
                <p>
                  Something about that voice on a long train ride. Also a
                  soft spot for anything with a slow build and a payoff you
                  didn&apos;t see coming.
                </p>
                <span className="meta">Sound</span>
              </article>
            </div>

          </div>
        </div>
      </section>

      {/* ─── PROJECTS ARCHIVE ─── */}
      <section className="list" id="archive">
        <div className="list-inner">
          <div className="list-head">
            <h2>The <em>archive.</em></h2>
            <span className="meta">{PROJECTS.length} projects · 2025 &ndash; 2026</span>
          </div>
          {PROJECTS.map((p, i) => {
            const inner = (
              <>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="name">
                  {p.name} <em>&mdash; {p.tag}</em>
                </span>
                <span className="stack">{p.stack}</span>
                <span className="year">{p.year}</span>
              </>
            );
            return p.url ? (
              <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="row">{inner}</a>
            ) : (
              <div key={p.name} className="row">{inner}</div>
            );
          })}
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
              Write me &rarr;
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
        </div>
        <div className="foot-bar">
          <span>&copy; Enis Shorra &middot; 2026</span>
          <span>Rudolfstetten, Switzerland</span>
        </div>
      </footer>
    </>
  );
}
