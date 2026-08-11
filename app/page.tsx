import Link from "next/link";
import TypedTitle from "./TypedTitle";
import ImageReveal from "./ImageReveal";

const PROJECTS = [
  { name: "Twinn",              tag: "match a friend by traits — or talk to an AI stand-in", stack: "C# · .NET",    year: 2026 },
  { name: "memyselfandi",       tag: "this website",                 stack: "TypeScript",     year: 2026, url: "https://github.com/Ni7i/memyselfandi" },
  { name: "Quizlot",            tag: "flashcards, done right",       stack: "TypeScript",     year: 2026 },
  { name: "ICT Regios",         tag: "regional dev championship · 2× entrant", stack: "Competition", year: 2026 },
  { name: "HPGarage",           tag: "web app for a local garage — a real client job", stack: "C# · ASP.NET", year: 2025 },
  { name: "FilmFlix",           tag: "one film dataset, two databases — graded 6.0", stack: "C# · Mongo/Neo4j", year: 2025 },
  { name: "impostergame",       tag: "who am I? — party game",       stack: "JavaScript",     year: 2025 },
  { name: "screentime-blocker", tag: "less phone, more life",        stack: "JavaScript",     year: 2025 },
  { name: "Oase Jugendraum",    tag: "web app for a youth room",     stack: "Python",         year: 2025 },
  { name: "midnight-calculator",tag: "calculator for a local SME",   stack: "C#",             year: 2025 },
];

const GROUPED = PROJECTS.reduce<Record<number, typeof PROJECTS>>((acc, p) => {
  (acc[p.year] ||= []).push(p);
  return acc;
}, {});
const YEARS = Object.keys(GROUPED).map(Number).sort((a, b) => b - a);

export default function Home() {
  return (
    <>
      <ImageReveal />
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
            The personal site of a seventeen-year-old developer from
            Switzerland &mdash; what I build, what I&apos;m into, and
            where this is going.
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
                  Kosovar parents, raised in the Aargau. As a kid I clicked
                  Scratch blocks together like everyone else &mdash; it went
                  nowhere. Then came the Informatikmittelschule at the KanTi
                  Baden and BBB Baden, and coding turned from a subject into
                  the thing I do. C# stuck first. Everything else followed.
                </p>
                <span className="meta">IMS Baden &middot; since 2024</span>
              </article>

              <article className="card-l">
                <div className="thumb thumb-2 landscape" />
                <div className="chips"><span className="chip grey">Long game</span></div>
                <h3>What I&apos;m working towards.</h3>
                <p>
                  A strong run at ICT Regios. One product with real users,
                  not just repos. The right Praxisjahr placement for 2027/28,
                  lined up early on purpose. And enough discipline to keep the
                  gym, the bike and the family in every week &mdash; not just
                  the calm ones.
                </p>
                <span className="meta">2026 &rarr; 2028</span>
              </article>
            </div>

            {/* CENTER — Featured */}
            <div className="tri-col" id="work">
              <article className="card-l">
                <div className="thumb thumb-3 hero" />
                <div className="chips">
                  <span className="chip red">Featured</span>
                  <span className="chip hollow">C# · .NET</span>
                </div>
                <h3 className="title-lg">
                  Twinn &mdash; find your person, or let the app become one.
                </h3>
                <p className="lead">
                  Twinn matches people by the traits they actually put in,
                  not by a feed. You describe yourself; it looks for someone
                  who fits. And when nobody does &mdash; the part I&apos;m
                  proudest of &mdash; it spins up an AI stand-in you can really
                  talk to, so an empty match is never just a blank screen.
                </p>
                <span className="meta">C# · .NET · 2026</span>
              </article>
            </div>

            {/* RIGHT COLUMN — Interests */}
            <div className="tri-col" id="interests">
              <article className="card-l">
                <div className="thumb thumb-4 square" />
                <div className="chips"><span className="chip grey">Interests</span></div>
                <h3>Bike, gym, family, food &mdash; in that rotation.</h3>
                <p>
                  Rides around the Reuss when the weather plays along,
                  lifting when it doesn&apos;t. Sundays belong to the family
                  table. The laptop stays closed until it doesn&apos;t.
                </p>
                <span className="meta">Weekly</span>
              </article>

              <article className="card-l">
                <div className="thumb thumb-5 portrait" />
                <div className="chips"><span className="chip grey">Weekends</span></div>
                <h3>On the pitch with a whistle.</h3>
                <p>
                  I hold an AFV referee licence and ref matches around the
                  Aargau. Twenty-two players, one decision, no replay &mdash;
                  it&apos;s the fastest feedback loop I know, and it carries
                  straight back into how I work.
                </p>
                <span className="meta">Referee &middot; since 2023</span>
              </article>
            </div>

          </div>
        </div>
      </section>

      {/* ─── PROJECTS INDEX ─── */}
      <section className="idx" id="archive">
        <div className="idx-inner">
          <div className="idx-head">
            <h2>The <em>archive.</em></h2>
            <span className="meta">{PROJECTS.length} projects &middot; an index</span>
          </div>

          {YEARS.map((year) => (
            <div className="idx-year" key={year}>
              <div className="idx-year-label">{year}</div>
              <div className="idx-entries">
                {GROUPED[year].map((p) => {
                  const inner = (
                    <>
                      <span className="e-name">
                        {p.name}
                        {p.url && <i className="e-arrow" aria-hidden="true">&#8599;</i>}
                      </span>
                      <span className="e-tag">{p.tag}</span>
                      <span className="e-dots" aria-hidden="true" />
                      <span className="e-stack">{p.stack}</span>
                    </>
                  );
                  return p.url ? (
                    <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="entry">{inner}</a>
                  ) : (
                    <div key={p.name} className="entry">{inner}</div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ME · essay ─── */}
      <section className="me" id="me">
        <div className="me-inner">
          <div className="me-head">
            <h2>Me<em>.</em></h2>
            <span className="meta">In my own words</span>
          </div>

          <div className="essay">
            <p className="essay-lead">
              I&apos;m Enis &mdash; seventeen, from Rudolfstetten, with
              Kosovar roots and a childhood spent between the Mutschellen
              and a keyboard.
            </p>
            <p>
              As a kid I snapped Scratch blocks together and figured that
              was the whole of it. The switch actually flipped at the
              Informatikmittelschule at the Kantonsschule Baden &mdash;
              somewhere in the first year, code stopped being a subject and
              started being the thing I do. Nobody in my family writes
              software; school lit the fuse and I kept it burning.{" "}
              <strong>C# and .NET are home now</strong>, with TypeScript,
              SQL and a bit of Docker around the edges.
            </p>
            <p>
              I&apos;d rather show it than claim it. <em>FilmFlix</em> &mdash;
              one film dataset mapped cleanly into both MongoDB and Neo4j
              behind a single interface &mdash; was graded a 6.0.{" "}
              <em>HPGarage</em> is a real client job for a local business,
              from the first requirements call to deployment. At{" "}
              <em>Baden hackt</em> I finished fourth under time pressure,
              and I&apos;ve entered the regional dev championship twice. The
              work I&apos;m proudest of always has someone on the other end
              of it.
            </p>
            <p>
              Away from the screen I&apos;m on the bike or in the gym, at
              the family table on Sundays, or somewhere on a pitch with a
              whistle &mdash; I hold a referee licence, and it teaches
              decisions faster than any codebase. I get by in five
              languages. Ask me where all of this is heading and I&apos;ll
              keep it deliberately short:
            </p>
            <span className="essay-sign">a good coder, and a good person.</span>
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
