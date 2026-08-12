import Link from "next/link";
import TypedTitle from "./TypedTitle";
import ImageReveal from "./ImageReveal";

const PROJECTS = [
  { name: "Twinn",              tag: "match a friend by traits — or talk to an AI stand-in", stack: "C# · .NET",    year: 2026 },
  { name: "memyselfandi",       tag: "this website",                 stack: "TypeScript",     year: 2026, url: "https://github.com/Ni7i/memyselfandi" },
  { name: "Quizlot",            tag: "flashcards, done right",       stack: "TypeScript",     year: 2026 },
  { name: "ICT Regios",         tag: "regional dev championship · 2× entrant", stack: "Competition", year: 2026 },
  { name: "HPGarage",           tag: "web app for a local garage — a real client job", stack: "C# · ASP.NET", year: 2025 },
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
            The personal site of an eighteen-year-old developer from
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
                <h3>Eighteen, from Rudolfstetten.</h3>
                <p>
                  Kosovar parents, raised in the Aargau. As a kid I played
                  around with Scratch and didn&apos;t think much of it. The
                  Informatikmittelschule at the Kantonsschule Baden is where
                  it really started to click, and C# was the first thing that
                  stuck. Most of what I know since then I picked up by
                  building, breaking things, and asking when I got stuck.
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

              <article className="card-l">
                <div className="thumb thumb-quizlot landscape" />
                <div className="chips">
                  <span className="chip red">Also peak</span>
                  <span className="chip hollow">TypeScript</span>
                </div>
                <h3 className="title-lg">
                  Quizlot &mdash; flashcards without the noise.
                </h3>
                <p className="lead">
                  A small learning tool built for the way I actually study
                  &mdash; quick to fill, fast to review, and nothing on the
                  screen that isn&apos;t the card in front of you. Started
                  for my own exam weeks and grew from there.
                </p>
                <span className="meta">TypeScript &middot; 2026</span>
              </article>
            </div>

            {/* RIGHT COLUMN — Interests */}
            <div className="tri-col" id="interests">
              <article className="card-l">
                <div className="thumb thumb-4 square" />
                <div className="chips"><span className="chip grey">Interests</span></div>
                <h3>Bike, gym, family, food.</h3>
                <p>
                  When I&apos;m not coding I&apos;m usually out on the bike
                  around the Reuss or at the gym. Time with family and a good
                  meal is what actually recharges me &mdash; the rest is just
                  keeping a decent balance.
                </p>
                <span className="meta">Weekly</span>
              </article>

              <article className="card-l">
                <div className="thumb thumb-5 portrait" />
                <div className="chips"><span className="chip grey">Weekends</span></div>
                <h3>Refereeing on weekends.</h3>
                <p>
                  I have an AFV referee licence and ref football matches
                  around the Aargau. It&apos;s taught me to stay calm, make a
                  call and take responsibility for it &mdash; which turns out
                  to be useful well beyond the pitch.
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
              Everything above is the <em>what</em>. Here&apos;s a bit of the
              why.
            </p>
            <p>
              What actually keeps me at the keyboard isn&apos;t the tech for
              its own sake &mdash; it&apos;s the small moment when a messy idea
              finally turns into something that runs. I&apos;ve made peace with
              the hours before that, when nothing works yet, because that&apos;s
              usually where I end up learning the most.
            </p>
            <p>
              I&apos;d rather be reliable than impressive. If I take something
              on, I want it done properly and handed over clean &mdash; not just
              working on my own machine. I ask questions early instead of
              guessing, and I&apos;m fine admitting when I don&apos;t know
              something yet, usually right before I go and find out.
            </p>
            <p>
              Growing up with Kosovo at home and Switzerland outside the door
              taught me to move between two worlds and to actually pay
              attention to people. It&apos;s probably why I care less about
              being the smartest person in a room and more about being someone
              others want to work with.
            </p>
            <p>
              And I know I&apos;m still near the start of this. There&apos;s a
              lot I haven&apos;t done yet &mdash; which is honestly the part
              I&apos;m looking forward to most: learning next to people further
              along than me, and closing that gap faster than I could on my own.
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
