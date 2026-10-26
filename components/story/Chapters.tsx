import Image from "next/image";
import Link from "next/link";
import ArtFallback from "@/components/art/ArtFallback";
import InkArt from "@/components/art/InkArt";
import ContactForm from "@/components/ContactForm";
import ProjectRow from "@/components/ProjectRow";
import { projectLink } from "@/lib/content/format";
import type { Project } from "@/lib/content/types";
import { THREAD_DICE, THREAD_OBJECTS, type ThreadObject } from "./threads";

/*
 * Scenes 3 to 11 of the illustrated autobiography. Every chapter is complete as rendered;
 * StoryMotion ties its drawings, threads and lines to the scroll when motion is welcome.
 * Facts in this file follow the CV. Nothing here names a client.
 */

/** One of the thread's objects, drawn as the element passes through the screen. */
function ThreadMark({ name, className = "thread-mark" }: { name: ThreadObject; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 160" aria-hidden="true" focusable="false">
      <path className="thread-line" d={THREAD_OBJECTS[name]} pathLength={1} data-thread="0 0.9" data-own />
    </svg>
  );
}

/* ─────────────── SCENE 3: AGE THREE ─────────────── */

export function AgeThree() {
  const lines = [
    "My father introduced me to computers when I was three.",
    "I wanted to play games.",
    "Then I kept asking how everything worked.",
    "The questions got harder. I never stopped asking.",
  ];
  return (
    <section id="age-three" className="chapter ch-desk" data-chapter="pin" aria-labelledby="age-three-title">
      <div className="ch-stage">
        <div className="ch-copy">
          <p className="ch-kicker" data-show="0 0.03">Age three</p>
          <h2 id="age-three-title" className="ch-lines">
            {lines.map((line, i) => (
              <span key={line} className="ch-line" data-show={`${0.14 + i * 0.16} ${0.22 + i * 0.16}`}>
                {line}{" "}
              </span>
            ))}
          </h2>
        </div>
        <svg className="ch-art desk-art ink-host" viewBox="0 0 1300 900" preserveAspectRatio="xMidYMax meet" role="img" aria-labelledby="desk-desc">
          <desc id="desk-desc">
            Illustration: Enis at three, standing on a step stool at the family computer, both hands on the mouse.
            His father&apos;s hand rests on his back. The red mouse cable runs into the computer.
          </desc>
          <g data-drawing="0.01 0.86"><InkArt name="scene-desk" /></g>
        </svg>
        <ArtFallback name="scene-desk" className="ch-art desk-art" alt="Enis at three at the family computer, his father's hand on his back." />
      </div>
    </section>
  );
}

/* ─────────────── SCENE 4: CURIOSITY ─────────────── */

const CURIOSITY: { mark: ThreadObject; title: string; text: string }[] = [
  { mark: "padlock", title: "Facebook", text: "I was curious how passwords and account security work." },
  { mark: "phone", title: "TutuApp", text: "I experimented with apps from outside the official store." },
  { mark: "onion", title: "Tor Browser", text: "I explored it and the darknet, to see how they work." },
  { mark: "keys", title: "Counter-Strike", text: "And I played CS." },
];

export function Curiosity() {
  return (
    <section id="curiosity" className="chapter ch-curious" data-chapter="flow" aria-labelledby="curiosity-title">
      <div className="ch-inner curious-grid">
        <header className="ch-head">
          <p className="ch-kicker">Growing up</p>
          <h2 id="curiosity-title" className="ch-title">
            After the first games on Y8, the questions moved <em>behind the screen.</em>
          </h2>
        </header>

        <svg className="teen-art ink-host" viewBox="0 0 320 620" role="img" aria-labelledby="teen-desc">
          <desc id="teen-desc">Illustration: Enis at about fifteen, headphones round his neck, looking at his phone. The headphone cable is red.</desc>
          <g data-drawing="0 1" data-own><InkArt name="scene-teen" /></g>
        </svg>
        <ArtFallback name="scene-teen" className="teen-art" alt="Enis at about fifteen, looking at his phone." />

        <ol className="rail">
          {CURIOSITY.map((item) => (
            <li key={item.title} className="rail-stop">
              <span className="rail-thread">
                <ThreadMark name={item.mark} />
                <span className="rail-run" data-show="0.6 1" data-own />
              </span>
              <span className="rail-text" data-show="0.2 0.6" data-own>
                <strong>{item.title}.</strong> {item.text}
              </span>
            </li>
          ))}
        </ol>

        <p className="ch-coda" data-show="0.1 0.6" data-own>
          None of it was a plan. It was curiosity. Today the same questions go into things I build myself.
        </p>
      </div>
    </section>
  );
}

/* ─────────────── SCENE 5: THE LINE SO FAR ─────────────── */

type Station = { when: string; name: string; detail?: string; ahead?: boolean };

const STATIONS: Station[] = [
  { when: "Aug 2021 to Jul 2024", name: "Bezirksschule, Kreisschule Mutschellen" },
  { when: "Aug 2024", name: "IMS Kantonsschule Baden and BBB Baden", detail: "Application developer EFZ with the vocational baccalaureate in business." },
  { when: "Mar 2025 and Mar 2026", name: "IT-Regionalmeisterschaften", detail: "ICT-Berufsbildung Schweiz, Skill 09. I took part twice." },
  { when: "Apr 2025 and Mar 2026", name: "Baden hackt, the hackathon at BBB Baden", detail: "Took part in 2025. Top 10 in 2026." },
  { when: "Feb 2026", name: "Tutor at Lernakademie Oase, Spreitenbach" },
  { when: "Sept 2026", name: "Web developer and SEO at LoliT, Baden", detail: "Part time, next to school." },
  { when: "27 Sept to 23 Oct 2026", name: "English Essential Centre, Manchester", detail: "C1 English preparation and Business English." },
  { when: "Aug 2027 to Jul 2028", name: "Practical year, full time", detail: "The next stop. I am looking for the team to spend it with.", ahead: true },
  { when: "Summer 2028", name: "EFZ and vocational baccalaureate", detail: "Expected.", ahead: true },
];

export function Stations() {
  return (
    <section id="stations" className="chapter ch-stations" data-chapter="flow" aria-labelledby="stations-title">
      <div className="ch-inner">
        <header className="ch-head">
          <p className="ch-kicker">The line so far</p>
          <h2 id="stations-title" className="ch-title">From one question to <em>a timetable.</em></h2>
        </header>
        <ol className="line">
          {STATIONS.map((station, i) => (
            <li key={station.name} className={`station${station.ahead ? " is-ahead" : ""}`}>
              <span className="station-track" aria-hidden="true">
                <span className="station-rail" data-show="0 1" data-own />
                <span className="station-stop" data-show="0.35 0.6" data-own />
              </span>
              <div className="station-text" data-show="0.3 0.7" data-own>
                <p className="station-when">{station.when}</p>
                <h3 className="station-name">{station.name}</h3>
                {station.detail && <p className="station-detail">{station.detail}</p>}
              </div>
              {i === 6 && <p className="station-today" aria-hidden="true">Today</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─────────────── SCENE 6: THE FIRST GAME ─────────────── */

// From Spiel.cs in my LCR repository, unchanged apart from indentation
const LCR_LOOP = `while (MehrAlsEinSpielerHatChips())
{
    Console.WriteLine($"\\nSpieler {_aktuellerSpieler.Name} ist am Zug!");
    var zahlen = _aktuellerSpieler.SpieleZug(_becher);
    Console.WriteLine(_aktuellerSpieler.PrintWuerfel(zahlen));
    GewuerfelteZahlenVerarbeiten(zahlen);

    _aktuellerSpieler = SpielerRechtsVonAktuellemSpieler();
    _gui.PrintRangliste(_spielerListe);
    Console.WriteLine("### Ende der Runde ###");
}`;

const LCR_DICE = `private void GewuerfelteZahlenVerarbeiten(List<int> zahlen)
{
    foreach (int z in zahlen)
    {
        if (z == 1) ChipNachLinksWeitergeben();
        else if (z == 2) ChipNachRechtsWeitergeben();
        else if (z == 3) ChipInDieMitteLegen();
    }
}`;

const KEYWORDS = /\b(while|var|foreach|int|in|if|else|private|void)\b/;

function Code({ source, from, to }: { source: string; from: number; to: number }) {
  const lines = source.split("\n");
  return (
    <pre className="code">
      <code>
        {lines.map((line, i) => {
          const at = from + ((to - from) * i) / lines.length;
          return (
            <span key={i} className="code-line" data-show={`${at.toFixed(3)} ${(at + 0.03).toFixed(3)}`}>
              {line.split(/(\$"[^"]*"|"[^"]*")/).map((part, j) =>
                part.startsWith('"') || part.startsWith('$"') ? (
                  <span key={j} className="code-string">{part}</span>
                ) : (
                  part.split(KEYWORDS).map((word, k) => (KEYWORDS.test(word) ? <b key={`${j}-${k}`}>{word}</b> : word))
                ),
              )}
              {"\n"}
            </span>
          );
        })}
      </code>
    </pre>
  );
}

export function FirstGame() {
  return (
    <section id="first-game" className="chapter ch-night" data-chapter="pin" aria-labelledby="first-game-title">
      <div className="ch-stage night-stage">
        <header className="night-copy">
          <p className="ch-kicker" data-show="0 0.05">IMS Baden · a school assignment</p>
          <h2 id="first-game-title" className="ch-title" data-show="0.02 0.08">A dice game, <em>in C#.</em></h2>
          <p className="night-text" data-show="0.06 0.12">
            LCR: everyone starts with three chips and rolls one die per chip, up to three. Chips go left,
            right or into the middle, and the game runs until only one player still has chips. I wrote it
            as a console program. This is the loop that keeps it going, as it stands in the repository.
          </p>
          <p className="night-note" data-show="0.1 0.16">
            The names are German: <i>Spieler</i> is player, <i>Zug</i> is turn, <i>Becher</i> is the dice cup.
            Code available on request.
          </p>
        </header>
        <div className="night-code">
          <Code source={LCR_LOOP} from={0.14} to={0.48} />
          <Code source={LCR_DICE} from={0.5} to={0.72} />
          <figure className="dice" data-show="0.7 0.76">
            <svg viewBox="0 0 360 140" aria-hidden="true" focusable="false">
              <path className="thread-line" d={THREAD_DICE} pathLength={1} data-thread="0.72 0.94" />
            </svg>
            <figcaption>1 passes a chip left. 2 passes one right. 3 puts one in the middle.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── SCENE 7: WHAT I BUILD NOW ─────────────── */

const PROJECT_MARKS: Record<string, ThreadObject> = {
  notevault: "notebook",
  lockbox: "strongbox",
  memyselfandi: "spool",
  quizlot: "card",
};

export function Work({ projects }: { projects: Project[] }) {
  // Projects come from /admin in their saved order; the ones marked featured there carry the story
  const lead = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);
  return (
    <section id="work" className="chapter ch-work" data-chapter="flow" aria-labelledby="work-title">
      <div className="ch-inner">
        <header className="ch-head">
          <p className="ch-kicker">What I build now</p>
          <h2 id="work-title" className="ch-title">The questions turned into <em>projects.</em></h2>
          <p className="ch-sub">Strongest first. {projects.length} in all, kept up to date from my own admin page.</p>
        </header>

        <ol className="work-lead">
          {lead.map((project, i) => {
            const mark = PROJECT_MARKS[project.slug];
            const { href, external } = projectLink(project);
            const isPrivate = !project.repoUrl && !project.liveUrl;
            return (
              <li key={project.slug} className="work-item">
                <span className="work-mark">{mark ? <ThreadMark name={mark} /> : <span className="work-number">{String(i + 1).padStart(2, "0")}</span>}</span>
                <div className="work-text" data-show="0.1 0.5" data-own>
                  <h3>
                    <a href={href} {...(external ? { rel: "noreferrer", target: "_blank" } : {})}>
                      {project.title}
                      <span aria-hidden="true">{external ? " ↗" : " →"}</span>
                    </a>
                  </h3>
                  <p>{project.description}</p>
                  <p className="work-meta">
                    {project.stack.join(" · ")}
                    {isPrivate && <span> · Private repository, code available on request</span>}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {rest.length > 0 && (
          <div className="work-more">
            <p className="ch-kicker">More work</p>
            <div className="archive-list">
              {rest.map((project) => (
                <ProjectRow key={project.slug} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────── SCENE 8: PROOF ─────────────── */

type Proof = { title: string; detail: string; when: string; image?: string; width?: number; height?: number; url?: string };

const PROOF: Proof[] = [
  { title: "Baden hackt", detail: "Hackathon at BBB Baden. Took part in 2025, top 10 in 2026.", when: "Apr 2025 and Mar 2026", image: "/certificates/baden-hackt.jpg", width: 347, height: 491 },
  { title: "Web APIs with ASP.NET Core 8", detail: "LinkedIn Learning.", when: "Mar 2026", image: "/certificates/web-apis-aspnet-core-8.png", width: 1925, height: 1487 },
  { title: "Referee diploma", detail: "Football referee since September 2023.", when: "Sept 2023", image: "/certificates/afv-referee-diploma.jpg", width: 1290, height: 1906 },
  { title: "Python Essentials 1", detail: "Cisco Networking Academy, through BBB Baden.", when: "Mar 2026", url: "https://www.credly.com/badges/a83657ef-3959-4ced-abf1-cc5dd7ad43d3/linked_in_profile" },
  { title: "Networking Basics", detail: "Cisco Networking Academy, through BBB Baden.", when: "Aug 2026", url: "https://www.credly.com/badges/9905e43b-c420-468e-9b75-b6b1bace4b87" },
  { title: "Prompt engineering, Claude Code and AI-assisted programming", detail: "Certificate.", when: "Apr 2026" },
  { title: "IT-Regionalmeisterschaften", detail: "ICT-Berufsbildung Schweiz, Skill 09. Took part twice.", when: "Mar 2025 and Mar 2026" },
];

/** Four red cross-stitches that hold a scan to the page. */
function Stitches() {
  return (
    <svg className="stitches" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path
        className="thread-line"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        data-thread="0.3 0.9"
        data-own
        d="M1,5 L5,1 M1,1 L5,5 L95,5 L99,1 M95,1 L99,5 L99,95 L95,99 M99,99 L95,95 L5,95 L1,99 M5,99 L1,95"
      />
    </svg>
  );
}

export function ProofSection() {
  const scans = PROOF.filter((p) => p.image);
  const others = PROOF.filter((p) => !p.image);
  return (
    <section id="proof" className="chapter ch-proof" data-chapter="flow" aria-labelledby="proof-title">
      <div className="ch-inner">
        <header className="ch-head">
          <p className="ch-kicker">Proof</p>
          <h2 id="proof-title" className="ch-title">Certificates and <em>competitions.</em></h2>
        </header>
        <ul className="proof-scans">
          {scans.map((p) => (
            <li key={p.title} className="proof-scan" data-show="0.05 0.45" data-own>
              <a href={p.image} target="_blank" rel="noreferrer" className="proof-frame">
                <Image src={p.image!} alt={`${p.title} certificate`} width={p.width} height={p.height} sizes="(max-width: 860px) 90vw, 360px" />
                <Stitches />
              </a>
              <h3>{p.title}</h3>
              <p>{p.detail}</p>
              <p className="proof-when">{p.when}</p>
            </li>
          ))}
        </ul>
        <ul className="proof-list">
          {others.map((p) => (
            <li key={p.title} data-show="0.05 0.45" data-own>
              <span className="proof-when">{p.when}</span>
              <h3>{p.url ? <a href={p.url} target="_blank" rel="noreferrer">{p.title} <span aria-hidden="true">↗</span></a> : p.title}</h3>
              <p>{p.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────── SCENE 9: OUTSIDE THE CODE ─────────────── */

const LIFE: { mark: ThreadObject; title: string; when: string; text: string }[] = [
  { mark: "browser", title: "LoliT, Baden", when: "Since Sept 2026", text: "Part time as a web developer: websites for businesses from build to launch, connected to databases, SEO, and direct contact with the clients." },
  { mark: "pencil", title: "Lernakademie Oase, Spreitenbach", when: "Since Feb 2026", text: "I give tutoring lessons." },
  { mark: "whistle", title: "Swiss Football Association", when: "Since Sept 2023", text: "I referee football matches." },
  { mark: "speech", title: "Manchester", when: "27 Sept to 23 Oct 2026", text: "Four weeks at English Essential Centre: C1 English preparation and Business English." },
];

export function Life() {
  return (
    <section id="life" className="chapter ch-life" data-chapter="flow" aria-labelledby="life-title">
      <div className="ch-inner">
        <header className="ch-head">
          <p className="ch-kicker">Outside the code</p>
          <h2 id="life-title" className="ch-title">Where I learn <em>the rest.</em></h2>
        </header>
        <ol className="rail rail-wide">
          {LIFE.map((item) => (
            <li key={item.title} className="rail-stop">
              <span className="rail-thread">
                <ThreadMark name={item.mark} />
                <span className="rail-run" data-show="0.6 1" data-own />
              </span>
              <span className="rail-text" data-show="0.2 0.6" data-own>
                <span className="rail-when">{item.when}</span>
                <strong>{item.title}.</strong> {item.text}
              </span>
            </li>
          ))}
        </ol>
        <dl className="languages" data-show="0.1 0.5" data-own>
          <div><dt>German and Swiss German</dt><dd>Native</dd></div>
          <div><dt>Albanian</dt><dd>Native</dd></div>
          <div><dt>English</dt><dd>C1</dd></div>
          <div><dt>French</dt><dd>B1</dd></div>
          <div><dt>Arabic</dt><dd>B1</dd></div>
        </dl>
      </div>
    </section>
  );
}

/* ─────────────── SCENE 10: HOW I WORK ─────────────── */

const PRINCIPLES: { claim: string; proof: string }[] = [
  { claim: "I test what I ship.", proof: "Quizlot, NoteVault and LockBox each have a test suite." },
  { claim: "I rebuild when I learn better.", proof: "LockBox version 2 moved to AES-256-GCM. NoteVault moved from a JSON file to EF Core and SQLite on .NET 10." },
  { claim: "I explain what I know.", proof: "As a tutor at Lernakademie Oase since February 2026." },
  { claim: "I use AI to explore, learn and iterate faster.", proof: "Whatever I deliver, I understand, check and test first. This website is built that way, with Claude as a coding partner." },
  { claim: "I start things myself.", proof: "websiten.ch is my own web design business." },
];

export function HowIWork() {
  return (
    <section id="how" className="chapter ch-how" data-chapter="flow" aria-labelledby="how-title">
      <div className="ch-inner">
        <header className="ch-head">
          <p className="ch-kicker">How I work</p>
          <h2 id="how-title" className="ch-title">Claims, each with <em>its proof.</em></h2>
        </header>
        <ol className="principles">
          {PRINCIPLES.map((p, i) => (
            <li key={p.claim} data-show="0.05 0.45" data-own>
              <span className="principle-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{p.claim}</h3>
              <p>{p.proof}</p>
            </li>
          ))}
        </ol>
        <p className="ch-coda promise" data-show="0.1 0.5" data-own>
          I expect reliability from others because I want people to be able to expect the same from me.
        </p>
      </div>
    </section>
  );
}

/* ─────────────── THE FAST LANE ─────────────── */

export function Facts() {
  return (
    <section id="facts" className="facts" aria-labelledby="facts-title">
      <div className="ch-inner">
        <header className="ch-head">
          <p className="ch-kicker">The fast lane</p>
          <h2 id="facts-title" className="ch-title">The facts, <em>on one page.</em></h2>
        </header>
        <dl className="facts-grid">
          <div>
            <dt>Now</dt>
            <dd>Third year at IMS Kantonsschule Baden and BBB Baden: application developer EFZ with the vocational baccalaureate in business.</dd>
          </div>
          <div>
            <dt>Looking for</dt>
            <dd>A practical-year placement from August 2027 to July 2028, full time. EFZ and vocational baccalaureate expected in summer 2028.</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>Web developer and SEO at LoliT, Baden, part time since September 2026. Tutor at Lernakademie Oase since February 2026. Football referee since September 2023.</dd>
          </div>
          <div>
            <dt>Skills</dt>
            <dd>C#, .NET and ASP.NET Core, TypeScript, React, Next.js, Python, HTML and CSS, REST APIs. SQL and data modelling. Git, CI/CD, unit tests. Claude Code every day.</dd>
          </div>
          <div>
            <dt>Competitions</dt>
            <dd>Baden hackt: took part in 2025, top 10 in 2026. IT-Regionalmeisterschaften, Skill 09, in 2025 and 2026.</dd>
          </div>
          <div>
            <dt>Certificates</dt>
            <dd>Web APIs with ASP.NET Core 8. Prompt engineering, Claude Code and AI-assisted programming. Cisco Python Essentials 1 and Networking Basics.</dd>
          </div>
          <div>
            <dt>Languages</dt>
            <dd>German and Swiss German, Albanian (native). English C1. French B1. Arabic B1.</dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>Limmattal, Switzerland.</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

/* ─────────────── SCENE 11: THE OTHER END ─────────────── */

export function OtherEnd() {
  return (
    <section id="contact" className="chapter ch-end" data-chapter="flow" aria-labelledby="contact-title">
      <div className="ch-inner end-grid">
        <div className="end-story">
          <svg className="end-art ink-host" viewBox="0 0 760 420" role="img" aria-labelledby="end-desc">
            <desc id="end-desc">Illustration: the bench from the beginning, empty now. The red thread lies on the seat and runs off toward the contact form.</desc>
            <g data-drawing="0 1" data-own><InkArt name="scene-end" /></g>
          </svg>
          <ArtFallback name="scene-end" className="end-art" alt="The bench from the beginning, empty, the red thread on its seat." />
          <h2 id="contact-title" className="end-title">The other end <em>is yours.</em></h2>
          <p className="end-text">
            I am looking for a practical-year placement from August 2027 to July 2028, full time.
            If your team builds things and wants someone who keeps asking how they work, write to me here.
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

export function StoryFooter() {
  return (
    <footer className="story-foot">
      <p className="story-foot-line">
        <span className="story-foot-thread" aria-hidden="true" />
        Der rote Faden. One thread, from a question at three to whatever comes next.
      </p>
      <p>Concept, story and creative direction by me. Built with Claude as a coding partner.</p>
      <nav className="story-foot-links" aria-label="Elsewhere">
        <a href="https://github.com/Ni7i" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://linkedin.com/in/enis-shorra" target="_blank" rel="noreferrer">LinkedIn</a>
        <Link href="/blog">Blog</Link>
      </nav>
      <p className="story-foot-small">© Enis Shorra · 2026 · Limmattal, Switzerland</p>
    </footer>
  );
}
