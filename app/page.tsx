import ContactForm from "@/components/ContactForm";
import CyclingWords from "@/components/CyclingWords";
import Scene from "@/components/Scene";
import ScrollReveal from "@/components/ScrollReveal";
import Showcase, { type ShowcaseItem } from "@/components/Showcase";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import Thread from "@/components/Thread";
import { getPublishedProjects } from "@/lib/content/projects";
import type { Project } from "@/lib/content/types";

// Projects are managed in /admin and read on every request.
export const dynamic = "force-dynamic";

/** Thoughts and experiences that cycle behind the name. */
const THOUGHTS = [
  "a kid who wanted to play",
  "a father with a plan",
  "late nights and curiosity",
  "how does any of this work?",
  "Kosovo, then the Limmattal",
  "Arabic, self-taught",
  "C#, .NET and the web",
  "still asking questions",
];

const CERTIFICATES = [
  { title: "Baden hackt", detail: "4th place · Competition", url: "/certificates/baden-hackt.jpg", size: { width: 347, height: 491 } },
  { title: "AFV Referee Diploma", detail: "Football referee qualification", url: "/certificates/afv-referee-diploma.jpg", size: { width: 1290, height: 1906 } },
  { title: "Web APIs with ASP.NET Core 8", detail: "LinkedIn Learning", url: "/certificates/web-apis-aspnet-core-8.png", size: { width: 1925, height: 1487 } },
  { title: "Python Essentials 1", detail: "Cisco Networking Academy", url: "https://www.credly.com/badges/a83657ef-3959-4ced-abf1-cc5dd7ad43d3/linked_in_profile" },
  { title: "Networking Basics", detail: "Cisco Networking Academy", url: "https://www.credly.com/badges/9905e43b-c420-468e-9b75-b6b1bace4b87" },
];

const PROMISES = ["I don't give up.", "I work hard.", "I keep my word.", "I don't lie."];

const PROJECT_IMAGES: Record<string, { src: string; width: number; height: number }> = {
  quizlot: { src: "/projects/quizlot.jpg", width: 1800, height: 1200 },
};

const withoutProtocol = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** CSS custom properties for a step that shows up at scene progress `at`. */
const step = (at: number, extra: Record<string, number> = {}) => ({ "--at": at, ...extra }) as React.CSSProperties;

function projectItem(project: Project): ShowcaseItem {
  const image = PROJECT_IMAGES[project.slug];
  const links = [
    ...(project.repoUrl ? [{ label: "View code", href: project.repoUrl, external: true }] : []),
    ...(project.liveUrl ? [{ label: "Open live", href: project.liveUrl, external: true }] : []),
    { label: "Details", href: `/projects/${project.slug}`, external: false },
  ];
  return {
    id: project.slug,
    title: project.title,
    text: project.description,
    tags: project.stack,
    links,
    address: withoutProtocol(project.liveUrl || project.repoUrl) || `enisshorra.ch/projects/${project.slug}`,
    image: image && { ...image, alt: `Screenshot of ${project.title}` },
    fallback: project.repoUrl
      ? [`$ git clone ${project.repoUrl}`, `# ${project.stack.join(" · ")}`, ...(project.year ? [`# ${project.year}`] : [])]
      : [project.title, project.stack.join(" · ")],
  };
}

const CERTIFICATE_ITEMS: ShowcaseItem[] = CERTIFICATES.map((certificate) => {
  const external = certificate.url.startsWith("http");
  return {
    id: certificate.title,
    title: certificate.title,
    text: certificate.detail,
    tags: [],
    links: [{ label: external ? "View badge" : "Open certificate", href: certificate.url, external: true }],
    address: external ? "credly.com" : `enisshorra.ch${certificate.url}`,
    image: "size" in certificate && certificate.size ? { src: certificate.url, ...certificate.size, alt: `${certificate.title} certificate` } : undefined,
    fallback: ["Verified badge on Credly", certificate.title, certificate.detail],
  };
});

export default async function Home() {
  const projects = await getPublishedProjects();
  const topProjects = projects.filter((project) => project.featured);
  const moreProjects = projects.filter((project) => !project.featured);

  return (
    <>
      <SiteHeader onHome />
      <ScrollReveal />

      <main className="flow">
        {/* Intro: the name, cycling thoughts, a note, and the man on the bench who tells the story */}
        <Scene id="top" className="intro" length={4} mood="dawn">
          <Thread shape="bench" anchor=".bench-anchor" pinned={{ from: 0.2, to: 0.9 }} />
          <div className="intro-head">
            <p className="disclaimer" style={step(0)}>A personal story. I gave it real care.</p>
            <h1 className="intro-name">Enis</h1>
            <CyclingWords words={THOUGHTS} className="intro-thought" />
          </div>
          <p className="intro-invite" style={step(0.24, { "--until": 0.95 })}>Sit down. Let me tell you how I got here.</p>
          <div className="bench-anchor" aria-hidden="true" />
          <span className="scroll-hint" aria-hidden="true">Scroll</span>
        </Scene>

        {/* Age 3 */}
        <Scene id="story" className="chapter" length={3.4} mood="sepia">
          <Thread shape="controller" anchor=".thread-anchor" pinned={{ from: 0.55, to: 0.9 }} />
          <p className="chapter-kicker" style={step(0.04)}>Age three</p>
          <h2 className="chapter-line">
            <span style={step(0.08)}>My father sat me in front of a computer.</span>
            <span style={step(0.3)}>He wanted a developer.</span>
            <span className="accent" style={step(0.5)}>I wanted to play.</span>
          </h2>
          <div className="thread-anchor anchor-controller" aria-hidden="true" />
        </Scene>

        {/* The kid who found a way in */}
        <Scene className="chapter" length={4.2} mood="night">
          <Thread shape="key" anchor=".thread-anchor" pinned={{ from: 0.5, to: 0.82 }} />
          <p className="chapter-kicker" style={step(0.04, { "--until": 0.36 })}>Still a kid</p>
          <div className="chapter-seq">
            <h2 className="chapter-line" style={step(0, { "--until": 0.36 })}>
              <span style={step(0.08, { "--until": 0.36 })}>Games cost money I didn&apos;t have.</span>
              <span style={step(0.2, { "--until": 0.36 })}>So I found the apps that installed them for free.</span>
            </h2>
            <p className="chapter-note" style={step(0.42, { "--until": 0.64 })}>Then I got curious about passwords, and guessed my way into a few family accounts. It worked more often than it should have.</p>
            <p className="chapter-turn" style={step(0.7)}>
              <span style={step(0.7)}>That curiosity never left. It just grew up.</span>
              <strong style={step(0.8)}>Today I build LockBox, so that doesn&apos;t work on anyone else.</strong>
            </p>
          </div>
          <div className="thread-anchor anchor-key" aria-hidden="true" />
        </Scene>

        {/* The question */}
        <Scene id="curiosity" className="chapter" length={3.8} mood="deep">
          <Thread shape="globe" anchor=".thread-anchor" pinned={{ from: 0.5, to: 0.86 }} />
          <h2 className="chapter-line">
            <span style={step(0.06)}>One question never left me.</span>
            <span className="big" style={step(0.24)}>How does any of this actually work?</span>
          </h2>
          <p className="chapter-note" style={step(0.46)}>How a message crosses the world in a second. How a login knows it&apos;s you. I still don&apos;t have every answer. I&apos;m still asking.</p>
          <div className="thread-anchor anchor-globe" aria-hidden="true" />
        </Scene>

        {/* Arabic */}
        <Scene className="chapter" length={3.2} mood="forest">
          <Thread shape="waw" anchor=".thread-anchor" pinned={{ from: 0.5, to: 0.86 }} />
          <h2 className="chapter-line">
            <span style={step(0.06)}>Why Arabic?</span>
          </h2>
          <p className="chapter-note" style={step(0.3)}>Nobody made me. I taught myself, because I wanted to read the Quran in its own words, not someone else&apos;s translation.</p>
          <div className="thread-anchor anchor-waw" aria-hidden="true" />
        </Scene>

        {/* Grades */}
        <Scene className="chapter" length={3.2} mood="paper">
          <Thread shape="six" anchor=".thread-anchor" pinned={{ from: 0.5, to: 0.84 }} />
          <h2 className="chapter-line">
            <span style={step(0.06)}>If you&apos;re so into this,</span>
            <span style={step(0.2)}>why isn&apos;t your report full of sixes?</span>
          </h2>
          <p className="chapter-turn" style={step(0.46)}>
            <strong>I don&apos;t care about the number.</strong>
            <span style={step(0.6)}>I care about knowing the thing.</span>
          </p>
          <div className="thread-anchor anchor-six" aria-hidden="true" />
        </Scene>

        {/* Who I am now, resolving into the man on the bench */}
        <Scene id="about" className="traits" length={7} mood="dawn">
          <Thread shape="bench" anchor=".thread-anchor" pinned={{ from: 0.62, to: 0.94 }} />
          <p className="chapter-kicker" style={step(0.02)}>All of that made someone.</p>
          <div className="trait-stage">
            <p className="trait" style={step(0.08, { "--until": 0.2 })}>I care about what I build. A lot.</p>
            <p className="trait" style={step(0.18, { "--until": 0.3 })}>I use AI to go faster, not to think less.</p>
            <p className="trait" style={step(0.28, { "--until": 0.4 })}>I ship real work. Not AI slop.</p>
            <p className="trait" style={step(0.38, { "--until": 0.5 })}>If I say it&apos;s done, it&apos;s done.</p>
            <p className="trait" style={step(0.48, { "--until": 0.6 })}>I stay with a problem until it gives up first.</p>
          </div>
          <p className="trait-close" style={step(0.66)}>So here I am.</p>
          <div className="thread-anchor anchor-bench" aria-hidden="true" />
        </Scene>

        {/* In my own words */}
        <section className="block scene words" data-mood="paper">
          <Thread shape="line" />
          <div className="words-grid" data-reveal>
            <div className="about-text">
              <h2 className="side-title">In my own words</h2>
              <p>I&apos;m usually the person who gives a group structure and keeps its energy up. I like knowing what everyone is working on, bringing people together and making sure an idea actually turns into something finished.</p>
              <p>When a problem refuses to work, I stay with it for a long time. I try every angle I can before asking for help. What keeps me going is progress. Competition adds fuel, but seeing something improve is what matters most to me.</p>
              <p>Outside coding, I spend most of my time with my family. Under stress, I slow things down, relax or have a good conversation. I want to be known as someone who is eager to learn, dependable and a good person to ask for advice.</p>
            </div>
            <aside className="about-aside">
              <p className="facts-line">IMS Baden. Informatikmittelschule. EFZ Informatiker and Berufsmatura, 2024 to 2028. Based in the Limmattal.</p>
              <p className="facts-line">Along the way: a year of Unity prototypes, then plain C#. Fourth place at Baden hackt. This whole site, built and run by me.</p>
            </aside>
          </div>
        </section>

        {/* Certificates */}
        <section className="block scene" id="certificates" data-mood="paper">
          <Thread shape="trophy" anchor=".thread-anchor" />
          <div className="block-head" data-reveal>
            <div>
              <h2>I can do a lot.</h2>
              <p className="lead-on">For some of it, I even have the paper.</p>
            </div>
            <div className="thread-anchor anchor-trophy" aria-hidden="true" />
          </div>
          <div data-reveal>
            <Showcase label="Certificates" variant="frame" items={CERTIFICATE_ITEMS} />
          </div>
        </section>

        {/* Projects */}
        <section className="block scene" id="archive" data-mood="night">
          <Thread shape="terminal" anchor=".thread-anchor" />
          <div className="block-head" data-reveal>
            <div>
              <h2>I build what I need.</h2>
              <p className="lead-on">Things I didn&apos;t want to pay for, or needed right now. Built from scratch, no tutorials.</p>
              <span className="idx-count">{projects.length} projects</span>
            </div>
            <div className="thread-anchor anchor-terminal" aria-hidden="true" />
          </div>
          <div data-reveal>
            <Showcase label="Projects" variant="laptop" items={[...topProjects, ...moreProjects].map(projectItem)} />
          </div>
        </section>

        {/* Why hire me */}
        <Scene id="hire" className="hire" length={4.5} mood="night">
          <Thread shape="seal" anchor=".seal-anchor" pinned={{ from: 0.62, to: 0.95 }} />
          <h2 className="hire-q" style={step(0.02)}>Why should you hire me?</h2>
          <ul className="promises">
            {PROMISES.map((promise, index) => (
              <li key={promise} style={step(0.12 + index * 0.1)}>{promise}</li>
            ))}
          </ul>
          <p className="guarantee">
            <span style={step(0.56)}>And one thing I can guarantee:</span>
            <strong style={step(0.7)}>I always give my best.</strong>
          </p>
          <div className="seal-anchor" aria-hidden="true" />
        </Scene>

        {/* Contact */}
        <section className="block scene contact" id="contact" data-mood="dawn">
          <Thread shape="plane" anchor=".thread-anchor" />
          <div className="contact-grid" data-reveal>
            <div>
              <h2 className="contact-title">Looking for the right team. Maybe it&apos;s yours.</h2>
              <p className="contact-sub">I&apos;m looking for an internship for my practical year. Write to me right here. I read every message myself.</p>
              <div className="thread-anchor anchor-plane" aria-hidden="true" />
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter onHome />
    </>
  );
}
