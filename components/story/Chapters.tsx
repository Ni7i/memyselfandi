import Link from "next/link";
import type React from "react";
import ArtFallback from "@/components/art/ArtFallback";
import InkArt from "@/components/art/InkArt";
import { ART, type ArtName } from "@/components/art/manifest";
import ContactForm from "@/components/ContactForm";
import { projectLink } from "@/lib/content/format";
import type { Project } from "@/lib/content/types";
import { THREAD_OBJECTS, type ThreadObject } from "./threads";

/*
 * Scenes 3 to 11 of the illustrated autobiography. Every chapter is complete as rendered;
 * StoryMotion ties its drawings, threads and lines to the scroll when motion is welcome.
 * Facts in this file follow the CV. Nothing here names a client.
 */

/* ─────────────── ILLUSTRATED SCENES ─────────────── */

type SceneProps = {
  id: string;
  /** Extra class for the scene's light (background). */
  tone: string;
  art: ArtName;
  /** Accessible description of the drawing. */
  desc: string;
  kicker: string;
  title: React.ReactNode;
  lines: React.ReactNode[];
  /** Chapter progress over which the drawing draws itself. */
  drawing?: string;
  /** Waypoints for the thread, in drawing units, between the top of the stage and the drawing's own red line. */
  drop: string;
  /** Chapter progress over which the thread runs through the scene and out at the bottom. */
  run?: string;
  /** More inside the drawing's <svg>, in drawing units (marks the thread draws, lettering). */
  children?: React.ReactNode;
};

/**
 * A pinned scene: the drawing builds itself as the reader scrolls, the lines of text arrive one by
 * one, and the thread comes in at the top where the last scene let it go, runs through the drawing's
 * own red line and leaves at the bottom for the next scene.
 */
function Scene({ id, tone, art, desc, kicker, title, lines, drawing = "0.02 0.5", drop, run = "0.3 0.96", children }: SceneProps) {
  const { width, height } = ART[art];
  const step = 0.62 / Math.max(1, lines.length);
  return (
    <section id={id} className={`chapter ch-scene ${tone}`} data-chapter="pin" aria-labelledby={`${id}-title`}>
      <div className="ch-stage">
        <div className="ch-copy">
          <p className="ch-kicker" data-show="0 0.03">{kicker}</p>
          <h2 id={`${id}-title`} className="ch-title" data-show="0.02 0.06">{title}</h2>
          <div className="ch-lines">
            {lines.map((line, i) => (
              <p key={i} className="ch-line" data-show={`${(0.1 + i * step).toFixed(3)} ${(0.16 + i * step).toFixed(3)}`}>
                {line}
              </p>
            ))}
          </div>
        </div>
        <svg className="ch-art ink-host" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMax meet" role="img" aria-labelledby={`${id}-desc`}>
          <desc id={`${id}-desc`}>{desc}</desc>
          <g data-drawing={drawing}><InkArt name={art} /></g>
          {children}
        </svg>
        <ArtFallback name={art} className="ch-art" alt={desc} />
        <svg className="thread-run" data-run={run} data-enter="0.2" data-follow=".ch-art" data-drop={drop} data-exit="" aria-hidden="true" focusable="false">
          <path />
        </svg>
      </div>
    </section>
  );
}

/* ─────────────── SCENE 3: AGE THREE ─────────────── */

export function AgeThree() {
  return (
    <Scene
      id="age-three"
      tone="ch-desk"
      art="scene-desk"
      desc="Enis at three, standing on a step stool at the family computer, both hands on the mouse. His father's hand rests on his back. The red mouse cable runs into the computer."
      kicker="Age three"
      title={<>My father introduced me to computers <em>when I was three.</em></>}
      lines={["I wanted to play games.", "Then I kept asking how everything worked.", <em key="q">The questions got harder. I never stopped asking.</em>]}
      drawing="0 0.56"
      drop="712 150, 712 330"
      run="0.3 0.94"
    />
  );
}

/* ─────────────── SCENE 4: GROWING UP ─────────────── */

/** What the thread draws above the two boys, one after the other, each with its line. */
const CURIOUS: { mark: ThreadObject; text: React.ReactNode }[] = [
  { mark: "padlock", text: <><strong>Facebook.</strong> How do passwords and account security work?</> },
  { mark: "phone", text: <><strong>TutuApp.</strong> With friends, apps from outside the official store.</> },
  { mark: "onion", text: <><strong>Tor Browser.</strong> What is the darknet, and how does it work?</> },
  { mark: "keys", text: <><strong>Counter-Strike.</strong> And CS, of course.</> },
];

export function GrowingUp() {
  const step = 0.62 / CURIOUS.length;
  return (
    <Scene
      id="curiosity"
      tone="ch-curious"
      art="scene-friends"
      desc="Enis as a boy on a park bench, holding a phone out between him and a friend in a hooded jumper who sits facing him on an upturned crate. Above them the red thread draws a padlock, a phone, an onion and the keys W, A, S, D."
      kicker="Growing up"
      title={<>After the first games on Y8, the questions moved <em>behind the screen.</em></>}
      lines={[...CURIOUS.map((c) => c.text), <em key="coda">None of it was a plan. It was curiosity.</em>]}
      drop="660 250, 640 420"
    >
      {CURIOUS.map((c, i) => (
        <g key={c.mark} transform={`translate(${150 + i * 140} 70) scale(0.9)`}>
          <path className="thread-line" d={THREAD_OBJECTS[c.mark]} pathLength={1} data-thread={`${(0.1 + i * (0.62 / (CURIOUS.length + 1))).toFixed(3)} ${(0.1 + i * (0.62 / (CURIOUS.length + 1)) + step * 0.8).toFixed(3)}`} />
        </g>
      ))}
    </Scene>
  );
}

/* ─────────────── SCENE 5: SCHOOL ─────────────── */

export function SchoolYears() {
  return (
    <Scene
      id="school"
      tone="ch-school"
      art="scene-school"
      desc="Enis as a teenager at a school desk by a classroom window, writing in an exercise book. The line he writes is the red thread."
      kicker="Aug 2021 to Jul 2024"
      title={<>Bezirksschule, <em>Kreisschule Mutschellen.</em></>}
      lines={["Three years of Bezirksschule, before the IMS in Baden."]}
      drop="600 300, 640 480"
    />
  );
}

/* ─────────────── SCENE 6: IMS AND BADEN HACKT ─────────────── */

export function Hackathon() {
  return (
    <Scene
      id="ims"
      tone="ch-hack"
      art="scene-hack"
      desc="Enis at a long table at the hackathon Baden hackt, coding on a laptop, a wall of sticky notes and a sign behind him. The laptop's cable is the red thread."
      kicker="From Aug 2024 · IMS Kantonsschule Baden and BBB Baden"
      title={<>Application developer EFZ, <em>with the vocational baccalaureate.</em></>}
      lines={[
        <><strong>Baden hackt</strong>, the hackathon at BBB Baden: took part in 2025, top 10 in 2026.</>,
        <><strong>IT-Regionalmeisterschaften</strong>, Skill 09: took part in 2025 and 2026.</>,
      ]}
      drop="470 170, 530 430"
    >
      <text className="art-lettering" x="662" y="242" textAnchor="middle" transform="rotate(-1.1 662 230)" data-show="0.12 0.2">
        Baden hackt
      </text>
    </Scene>
  );
}

/* ─────────────── SEQUENCES ─────────────── */

type Step = { mark: ThreadObject; when?: string; title: React.ReactNode; text: React.ReactNode; meta?: React.ReactNode };

type SequenceProps = {
  id: string;
  tone: string;
  kicker: string;
  title: React.ReactNode;
  steps: Step[];
  /** A last line, once every object is drawn. */
  coda?: React.ReactNode;
};

/**
 * A pinned scene with nothing to scroll past: the stage holds still while the thread comes in at
 * the top, draws one object after the other and leaves at the bottom. Each object's words appear
 * once it is drawn, and only then do their links open.
 */
function Sequence({ id, tone, kicker, title, steps, coda }: SequenceProps) {
  const [a, b] = [0.05, 0.96];
  const stops = steps.map((_, i) => a + ((b - a) * (i + 1)) / (steps.length + 0.5));
  const last = stops[stops.length - 1] ?? a;
  const style = { "--rows": steps.length, "--len": `${200 + steps.length * 140}vh` } as React.CSSProperties;
  return (
    <section id={id} className={`chapter ch-scene ch-seq ${tone}`} data-chapter="pin" aria-labelledby={`${id}-title`} style={style}>
      <div className="ch-stage">
        <div className="ch-copy">
          <p className="ch-kicker" data-show="0 0.03">{kicker}</p>
          <h2 id={`${id}-title`} className="ch-title" data-show="0.02 0.06">{title}</h2>
          {coda && <div className="seq-coda" data-show={`${(last + 0.02).toFixed(3)} ${(last + 0.07).toFixed(3)}`}>{coda}</div>}
        </div>
        <ol className="seq">
          {steps.map((step, i) => (
            <li key={i} className="seq-item">
              <svg className="seq-mark" viewBox="0 0 120 160" aria-hidden="true" focusable="false">
                <path className="a-t" d={THREAD_OBJECTS[step.mark]} />
              </svg>
              <div className="seq-text" data-show={`${(stops[i] + 0.004).toFixed(3)} ${(stops[i] + 0.045).toFixed(3)}`}>
                {step.when && <p className="seq-when">{step.when}</p>}
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                {step.meta && <p className="seq-meta">{step.meta}</p>}
              </div>
            </li>
          ))}
        </ol>
        <svg className="thread-run" data-run={`${a} ${b}`} data-stops={stops.map((s) => s.toFixed(3)).join(" ")} data-enter="0.04" data-follow=".seq-mark" data-exit="" aria-hidden="true" focusable="false">
          <path />
        </svg>
      </div>
    </section>
  );
}

/** An outward link that opens in a new tab. */
function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

/* ─────────────── SCENE 7: NEXT TO SCHOOL ─────────────── */

export function Stations() {
  return (
    <Sequence
      id="stations"
      tone="ch-stations"
      kicker="Next to school"
      title={<>Where I learn <em>the rest.</em></>}
      steps={[
        { mark: "whistle", when: "Since Sept 2023", title: "Football referee", text: <>Swiss Football Association. <Out href="/certificates/afv-referee-diploma.jpg">The diploma</Out></> },
        { mark: "pencil", when: "Since Feb 2026", title: "Tutor", text: "I give tutoring lessons at Lernakademie Oase, Spreitenbach." },
        { mark: "magnifier", when: "Since Sept 2026", title: "Web developer and SEO", text: "Part time at LoliT, Baden: websites for businesses from build to launch, connected to databases, with direct contact to the clients." },
        { mark: "speech", when: "27 Sept to 23 Oct 2026", title: "Manchester", text: "Four weeks at English Essential Centre: C1 English preparation and Business English." },
      ]}
    />
  );
}

/* ─────────────── SCENE 8: WHAT I BUILD NOW ─────────────── */

const PROJECT_MARKS: Record<string, ThreadObject> = {
  websiten: "browser",
  notevault: "notebook",
  lockbox: "strongbox",
  memyselfandi: "spool",
  quizlot: "card",
};

export function Work({ projects }: { projects: Project[] }) {
  // Projects come from /admin in their saved order; the first three marked featured there are drawn
  const shown = projects.filter((project) => project.featured).slice(0, 3);
  return (
    <Sequence
      id="work"
      tone="ch-work"
      kicker="What I build now"
      title={<>The questions turned into <em>projects.</em></>}
      steps={shown.map((project) => {
        const { href, external } = projectLink(project);
        const isPrivate = !project.repoUrl && !project.liveUrl;
        return {
          mark: PROJECT_MARKS[project.slug] ?? "browser",
          title: (
            <a href={href} {...(external ? { rel: "noreferrer", target: "_blank" } : {})}>
              {project.title}
              <span aria-hidden="true">{external ? " ↗" : " →"}</span>
            </a>
          ),
          text: project.description,
          meta: <>{project.stack.join(" · ")}{isPrivate && <span> · Code available on request</span>}</>,
        };
      })}
      coda={<p className="seq-more"><Out href="https://github.com/Ni7i">More on GitHub</Out></p>}
    />
  );
}

/* ─────────────── SCENE 9: PROOF ─────────────── */

export function ProofSection() {
  return (
    <Sequence
      id="proof"
      tone="ch-proof"
      kicker="Proof"
      title={<>Competitions and <em>certificates.</em></>}
      steps={[
        { mark: "trophy", when: "Apr 2025 and Mar 2026", title: "Baden hackt", text: <>The hackathon at BBB Baden: took part in 2025, top 10 in 2026. <Out href="/certificates/baden-hackt.jpg">Certificate</Out></> },
        { mark: "medal", when: "Mar 2025 and Mar 2026", title: "IT-Regionalmeisterschaften", text: "ICT-Berufsbildung Schweiz, Skill 09. Took part twice." },
        { mark: "certificate", when: "Mar and Apr 2026", title: "Two certificates", text: <><Out href="/certificates/web-apis-aspnet-core-8.png">Web APIs with ASP.NET Core 8</Out>, LinkedIn Learning. Prompt engineering, Claude Code and AI-assisted programming.</> },
        { mark: "badge", when: "Mar and Aug 2026", title: "Cisco Networking Academy", text: <>Through BBB Baden: <Out href="https://www.credly.com/badges/a83657ef-3959-4ced-abf1-cc5dd7ad43d3/linked_in_profile">Python Essentials 1</Out> and <Out href="https://www.credly.com/badges/9905e43b-c420-468e-9b75-b6b1bace4b87">Networking Basics</Out>.</> },
      ]}
    />
  );
}

/* ─────────────── SCENE 10: HOW I WORK ─────────────── */

export function HowIWork() {
  return (
    <Sequence
      id="how"
      tone="ch-how"
      kicker="How I work"
      title={<>Claims, each with <em>its proof.</em></>}
      steps={[
        { mark: "flask", title: "I test what I ship.", text: "Quizlot, NoteVault and LockBox each have a test suite." },
        { mark: "cycle", title: "I rebuild when I learn better.", text: "LockBox 2 moved to AES-256-GCM. NoteVault moved to EF Core and SQLite on .NET 10." },
        { mark: "board", title: "I explain what I know.", text: "As a tutor at Lernakademie Oase since February 2026." },
        { mark: "bulb", title: "I use AI to learn and iterate faster.", text: "What I deliver, I understand, check and test first. This website is built that way." },
        { mark: "flag", title: "I start things myself.", text: "websiten.ch is my own web design business." },
      ]}
      coda={<p className="ch-coda promise">I expect reliability from others because I want people to be able to expect the same from me.</p>}
    />
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
          <p className="ch-kicker">The next stop · Aug 2027 to Jul 2028</p>
          <h2 id="contact-title" className="end-title">The other end <em>is yours.</em></h2>
          <p className="end-text">
            I am looking for a practical-year placement from August 2027 to July 2028, full time.
            If your team builds things and wants someone who keeps asking how they work, write to me here.
          </p>
        </div>
        <ContactForm />
      </div>
      {/* The thread does not end here: it runs on across the page and off its edge */}
      <div className="goes-on">
        <p className="goes-on-text" data-show="0.35 0.7" data-own>
          The red thread goes on. <em>Perhaps at your company.</em>
        </p>
        <svg className="goes-on-thread" viewBox="0 0 1200 220" preserveAspectRatio="xMinYMid slice" aria-hidden="true" focusable="false">
          <path
            className="thread-line"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            data-thread="0 0.95"
            data-own
            d="M-10,70 C200,70 320,48 430,96 C486,120 478,156 446,148 C414,140 432,106 474,110 C560,118 650,176 830,156 C970,140 1100,124 1230,122"
          />
        </svg>
      </div>
    </section>
  );
}

export function StoryFooter() {
  return (
    <footer className="story-foot">
      <p className="story-foot-line">
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
