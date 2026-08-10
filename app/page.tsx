import Link from "next/link";
import TypedTitle from "./TypedTitle";

const PROJECTS = [
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
          <a href="#archive">Archive</a>
          <a href="#me">Me</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href="mailto:shorra.enis@hotmail.com">Get in touch</a>
      </nav>

      {/* ─── INTRO ─── */}
      <section className="intro">
        <div className="intro-inner">
          <div>
            <span className="stamp">Est. 2024 · Aargau</span>
            <TypedTitle />
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
              <article className="card-l">
                <div className="thumb thumb-3 hero" />
                <div className="chips">
                  <span className="chip red">Featured</span>
                  <span className="chip hollow">C# · WPF</span>
                </div>
                <h3 className="title-lg">
                  whiteplayer &mdash; the music player I ended up using every day.
                </h3>
                <p className="lead">
                  I got tired of bloated players so I wrote my own. A quiet,
                  keyboard-driven WPF app for a big local library &mdash; no ads,
                  no sync, no telemetry. Started as a weekend project and
                  quietly took over my desktop.
                </p>
                <span className="meta">Windows · 2026</span>
              </article>
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

      {/* ─── ME · Q&A ─── */}
      <section className="me" id="me">
        <div className="me-inner">
          <div className="me-head">
            <h2>Me<em>.</em></h2>
            <span className="meta">A short interview with myself</span>
          </div>

          <div className="qa">
            <article className="qa-item">
              <span className="q">Q.&nbsp;&nbsp;What actually got you into coding?</span>
              <p className="a">
                The Informatikmittelschule at KAnti Baden, and then BBB
                Baden. Before that it was Scratch and toys &mdash; nothing
                serious. School was the actual switch. That&apos;s where I
                first thought this is the thing I want to be quietly good at.
              </p>
            </article>

            <article className="qa-item">
              <span className="q">Q.&nbsp;&nbsp;What&apos;s the real goal for 2026?</span>
              <p className="a">
                All of it, honestly. A top run at ICT Regios. One product
                that people actually use. The right internship. And &mdash; the
                one nobody puts on a portfolio &mdash; being a better person.
                Gym, focus, family. Same energy across the board.
              </p>
            </article>

            <article className="qa-item">
              <span className="q">Q.&nbsp;&nbsp;What would you tell your fifteen-year-old self?</span>
              <p className="a">
                Start earlier. Skip half the tutorials, build the ugly
                version. Ask more people for help &mdash; the stolz just costs
                you months. Stop overthinking. Ship the thing. And keep going,
                especially the weeks it feels pointless.
              </p>
            </article>

            <article className="qa-item">
              <span className="q">Q.&nbsp;&nbsp;In five years &mdash; what do you want to be true?</span>
              <p className="a">
                A good coder. A good person. In that order? Sometimes.
                Mostly at the same time.
              </p>
            </article>
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
              Write me &rarr;
            </a>
          </div>

          <aside className="cta-card">
            <span className="cta-stamp">Available &middot; 2026</span>
            <ul>
              <li><span>Mail</span><a href="mailto:shorra.enis@hotmail.com">shorra.enis@hotmail.com</a></li>
              <li><span>GitHub</span><a href="https://github.com/Ni7i" target="_blank" rel="noreferrer">@Ni7i</a></li>
              <li><span>LinkedIn</span><a href="https://linkedin.com/in/enis-shorra" target="_blank" rel="noreferrer">enis-shorra</a></li>
              <li><span>Discord</span><a href="https://discord.com/users/nisi_17" target="_blank" rel="noreferrer">nisi_17</a></li>
              <li><span>Base</span><em>Rudolfstetten, CH</em></li>
            </ul>
            <small>Answers usually within 48h.</small>
          </aside>
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
