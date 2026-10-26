import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import ScrollReveal from "@/components/ScrollReveal";
import Showcase, { type ShowcaseItem } from "@/components/Showcase";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getPublishedProjects } from "@/lib/content/projects";
import type { Project } from "@/lib/content/types";

// Projects are managed in /admin and read on every request.
export const dynamic = "force-dynamic";

const FACTS = [
  { label: "School", value: "IMS Baden" },
  { label: "Track", value: "Berufsmatura + EFZ Informatiker" },
  { label: "Years", value: "2024-2028" },
  { label: "Based in", value: "Limmattal, Switzerland" },
];

const SOCIALS = [
  { label: "GitHub", url: "https://github.com/Ni7i" },
  { label: "LinkedIn", url: "https://linkedin.com/in/enis-shorra" },
  { label: "Discord", url: "https://discord.com/users/nisi_17" },
];

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
        <section className="hero" id="top">
          <h1 className="hero-title">Enis<br />Shorra<span className="dot">.</span></h1>
          <div className="hero-copy">
            <p className="hero-sub">
              The personal site of an eighteen-year-old developer from
              Switzerland: what I build, what I&apos;m into, and where
              this is going.
            </p>
            <p className="hero-facts">
              {FACTS.map((fact) => fact.value).join(" / ")}
              <br />
              <span className="hero-open">Open for an apprenticeship.</span>
            </p>
            <div className="hero-actions">
              <a className="text-link" href="#archive">See projects →</a>
              <Link className="text-link" href="/blog">Read the blog →</Link>
              {SOCIALS.map((social) => (
                <a key={social.label} className="text-link quiet" href={social.url} target="_blank" rel="noreferrer">{social.label}</a>
              ))}
            </div>
          </div>
        </section>

        <section className="block about" id="about">
          <p className="about-lead" data-reveal>
            I&apos;m usually the person who gives a group structure and keeps
            its energy up. I like knowing what everyone is working on,
            bringing people together and making sure an idea actually turns
            into something <em>finished.</em>
          </p>
          <div className="about-cols" data-reveal>
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
        </section>

        <section className="block" id="archive">
          <div className="block-head" data-reveal>
            <h2>Things I&apos;ve made<span className="dot">.</span></h2>
            <p>
              The three I&apos;m proudest of come first. Point at one to see
              what it does and where the code lives.
            </p>
            <span className="idx-count">{projects.length} projects</span>
          </div>
          <div data-reveal>
            <Showcase label="Projects" variant="laptop" items={[...topProjects, ...moreProjects].map(projectItem)} />
          </div>
        </section>

        <section className="block" id="certificates">
          <div className="block-head" data-reveal>
            <h2>Certificates<span className="dot">.</span></h2>
            <p>Courses, a hackathon and a referee diploma.</p>
          </div>
          <div data-reveal>
            <Showcase label="Certificates" variant="frame" items={CERTIFICATE_ITEMS} />
          </div>
        </section>

        <section className="block contact" id="contact">
          <div className="contact-grid" data-reveal>
            <div>
              <h2 className="contact-title">Currently looking for the <em>right team.</em></h2>
              <p className="contact-sub">
                I&apos;m available for an apprenticeship anywhere. If that sounds
                useful, write to me right here, without leaving the website.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter onHome />
    </>
  );
}
