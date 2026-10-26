import ContactForm from "@/components/ContactForm";
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

const QUICK_FACTS = [
  { label: "School", value: "IMS Baden" },
  { label: "Programme", value: "Informatikmittelschule" },
  { label: "Diploma", value: "EFZ Informatiker + Berufsmatura" },
  { label: "Years", value: "2024-2028" },
  { label: "Based in", value: "Limmattal" },
  { label: "Age", value: "18" },
];

const CORE_SKILLS = [
  { title: "C# & .NET", note: "Desktop apps in WPF, a password manager, a REST API" },
  { title: "Web", note: "React, Next.js and TypeScript. This site is one of them." },
  { title: "Python", note: "A screen-time blocker and a web app for a youth room" },
  { title: "UI design", note: "Spacing, motion and every state in between" },
]

/** Said one at a time, large, while the thread keeps going; the short form collects below. */
const TRAITS = [
  { line: "I care about what I build. A lot.", short: "Passionate" },
  { line: "I use AI to go faster, not to think less.", short: "Works with AI" },
  { line: "I ship real work. Not AI slop.", short: "No AI slop" },
  { line: "If I say it's done, it's done.", short: "Reliable" },
  { line: "When a group gets lost, I bring structure.", short: "Brings structure" },
  { line: "I stay with a bug until it gives up first.", short: "Persistent" },
  { line: "I'm never done learning.", short: "Always learning" },
];

const PROMISES = ["I don't give up.", "I work hard.", "I keep my word.", "I don't lie."];

/** CSS custom properties for a step that shows up at scene progress `at`. */
const step = (at: number, extra: Record<string, number> = {}) => ({ "--at": at, ...extra }) as React.CSSProperties;

const PATH = [
  { when: "Before 2024", title: "Unity prototypes", text: "A year of small games that never shipped. They still taught me the one thing that matters: I love building." },
  { when: "2024", title: "IMS Baden", text: "The Informatikmittelschule: three years of school toward the EFZ Informatiker and the Berufsmatura." },
  { when: "2025", title: "Engine out, C# in", text: "I dropped Unity, wrote my own game loop in plain C# and started writing down what I learn." },
  { when: "Along the way", title: "4th at Baden hackt", text: "A hackathon, a deadline and fourth place." },
  { when: "2027-2028", title: "The practical year", text: "My last IMS year happens inside a company. That company could be yours." },
]

const CERTIFICATES = [
  {
    title: "Baden hackt",
    detail: "4th place · Competition",
    url: "/certificates/baden-hackt.jpg",
    size: { width: 347, height: 491 },
  },
  {
    title: "AFV Referee Diploma",
    detail: "Football referee qualification",
    url: "/certificates/afv-referee-diploma.jpg",
    size: { width: 1290, height: 1906 },
  },
  {
    title: "Web APIs with ASP.NET Core 8",
    detail: "LinkedIn Learning",
    url: "/certificates/web-apis-aspnet-core-8.png",
    size: { width: 1925, height: 1487 },
  },
  {
    title: "Python Essentials 1",
    detail: "Cisco Networking Academy",
    url: "https://www.credly.com/badges/a83657ef-3959-4ced-abf1-cc5dd7ad43d3/linked_in_profile",
  },
  {
    title: "Networking Basics",
    detail: "Cisco Networking Academy",
    url: "https://www.credly.com/badges/9905e43b-c420-468e-9b75-b6b1bace4b87",
  },
];

/** Screenshots for projects that have one, keyed by slug. */
const PROJECT_IMAGES: Record<string, { src: string; width: number; height: number }> = {
  quizlot: { src: "/projects/quizlot.jpg", width: 1800, height: 1200 },
};

const withoutProtocol = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

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
    image: "size" in certificate && certificate.size
      ? { src: certificate.url, ...certificate.size, alt: `${certificate.title} certificate` }
      : undefined,
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
        {/* 1. Only the name. Scrolling draws a kid at a laptop, then the same person, grown. */}
        <Scene id="top" className="intro" length={4}>
          <Thread shape="kid" anchor=".kid-anchor" pinned={{ from: 0.06, to: 0.86 }} />
          <h1 className="intro-name">Enis</h1>
          <span className="scroll-hint" aria-hidden="true">Scroll</span>
          <div className="kid-anchor" aria-hidden="true" />
          <p className="intro-line" style={step(0.18, { "--until": 0.5 })}>It started with a kid, an old screen and way too many questions.</p>
          <p className="intro-line" style={step(0.56, { "--until": 0.97 })}>The questions got harder. I never stopped asking.</p>
        </Scene>

        {/* 2. The question, crossed out, and three answers */}
        <Scene id="about" className="question" length={3}>
          <Thread shape="line" pinned={{ from: -0.3, to: 1 }} />
          <h2 className="q-text">
            <span style={step(0.02)}>Just another candidate</span>
            <span style={step(0.1)}>for an internship?</span>
            <svg className="q-strike" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M1,30 C25,20 55,38 99,24" />
              <path d="M1,80 C22,70 48,86 74,72" />
            </svg>
          </h2>
          <p className="nos" aria-label="No.">
            <span style={step(0.5, { "--tilt": -6 })}>No.</span>
            <span style={step(0.62, { "--tilt": 4 })}>No.</span>
            <span style={step(0.74, { "--tilt": -2 })}>No.</span>
          </p>
          <p className="q-after" style={step(0.88)}>Let me show you why.</p>
        </Scene>

        {/* 3. Who I am instead, one sentence at a time */}
        <Scene className="traits" length={TRAITS.length + 1}>
          <Thread shape="coil" pinned={{ from: -0.1, to: 1 }} />
          <p className="traits-kicker">Here&apos;s who you&apos;d get.</p>
          <div className="trait-stage">
            {TRAITS.map((trait, index) => (
              <p key={trait.short} className="trait" style={step((index + 0.4) / (TRAITS.length + 1), { "--until": index === TRAITS.length - 1 ? 9 : (index + 1.3) / (TRAITS.length + 1) })}>
                {trait.line}
              </p>
            ))}
          </div>
          <ul className="trait-trail" aria-label="In short">
            {TRAITS.map((trait, index) => (
              <li key={trait.short} style={step((index + 1.3) / (TRAITS.length + 1))}>{trait.short}</li>
            ))}
          </ul>
        </Scene>

        {/* 4. The story behind it */}
        <section className="block scene about-more">
          <Thread shape="line" />
          <div className="about-text" data-reveal>
            <h2 className="side-title">In my own words</h2>
            <p>
              I&apos;m usually the person who gives a group structure and keeps
              its energy up. I like knowing what everyone is working on,
              bringing people together and making sure an idea actually turns
              into something finished.
            </p>
            <p>
              When a problem refuses to work, I stay with it for a long time.
              I try every angle I can before asking for help, sometimes until
              I&apos;m close to giving up. What keeps me going is progress.
              Competition adds fuel, but seeing something improve is what
              matters most to me.
            </p>
            <p>
              I take responsibility seriously. Nothing frustrates me faster
              than someone ignoring the task they agreed to do. I expect
              reliability from others because I want people to be able to
              expect the same from me. At the same time, I want to become more
              open to unfamiliar programming languages and approaches.
            </p>
            <p>
              Outside coding, I spend most of my time with my family. This
              website is the project I&apos;m proudest of because it feels the
              most like me. Under stress, I try to slow things down, relax or
              have a good conversation. I want to be known as someone who is
              eager to learn, dependable and a good person to ask for advice.
            </p>
          </div>
          <div className="about-side" data-reveal>
            <h3 className="side-title">Quick facts</h3>
            <dl className="facts">
              {QUICK_FACTS.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <h3 className="side-title">Core skills</h3>
            <ul className="skills">
              {CORE_SKILLS.map((skill) => (
                <li key={skill.title}>
                  <strong>{skill.title}</strong>
                  <span>{skill.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="block scene" id="path">
          <Thread shape="line" />
          <div className="block-head" data-reveal>
            <div>
              <h2>The road so far</h2>
              <p>From game prototypes to the IMS Baden. Next stop: your team.</p>
            </div>
          </div>
          <ol className="timeline">
            {PATH.map((item) => (
              <li key={item.title} data-reveal>
                <span className="timeline-when">{item.when}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 5. Proof for some of it */}
        <section className="block scene" id="certificates">
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

        {/* 6. What I build */}
        <section className="block scene" id="archive">
          <Thread shape="terminal" anchor=".thread-anchor" />
          <div className="block-head" data-reveal>
            <div>
              <h2>I build what I need.</h2>
              <p className="lead-on">
                Things I didn&apos;t want to pay for, or needed right now.
                Built from scratch, no tutorials.
              </p>
              <span className="idx-count">{projects.length} projects</span>
            </div>
            <div className="thread-anchor anchor-terminal" aria-hidden="true" />
          </div>
          <div data-reveal>
            <Showcase label="Projects" variant="laptop" items={[...topProjects, ...moreProjects].map(projectItem)} />
          </div>
        </section>

        {/* 7. Why hire me, and the guarantee */}
        <Scene id="hire" className="hire" length={4}>
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

        <section className="block scene contact" id="contact">
          <Thread shape="plane" anchor=".thread-anchor" />
          <div className="contact-grid" data-reveal>
            <div>
              <h2 className="contact-title">Looking for the right team. Maybe it&apos;s yours.</h2>
              <p className="contact-sub">
                I&apos;m looking for an internship for my practical year. Write
                to me right here. I read every message myself.
              </p>
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
