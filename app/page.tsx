import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import ProjectRow from "@/components/ProjectRow";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getPublishedProjects } from "@/lib/content/projects";

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
  },
  {
    title: "AFV Referee Diploma",
    detail: "Football referee qualification",
    url: "/certificates/afv-referee-diploma.jpg",
  },
  {
    title: "Web APIs with ASP.NET Core 8",
    detail: "LinkedIn Learning",
    url: "/certificates/web-apis-aspnet-core-8.png",
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

/** A homepage section: a sticky index label on the left, the content on the right. */
function Section({ id, index, label, children }: { id: string; index: string; label: string; children: React.ReactNode }) {
  return (
    <section className="section" id={id}>
      <div className="section-inner">
        <header className="section-label">
          <span>{index}</span>
          {label}
        </header>
        <div className="section-body">{children}</div>
      </div>
    </section>
  );
}

export default async function Home() {
  const projects = await getPublishedProjects();
  const topProjects = projects.filter((project) => project.featured);
  const moreProjects = projects.filter((project) => !project.featured);

  return (
    <>
      <SiteHeader onHome />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <h1 className="hero-title">Enis<br />Shorra</h1>
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
          <figure className="hero-photo">
            <Image
              src="/gallery/new-2.jpg"
              alt="Lake Lucerne with mountains under a cloudy sky"
              width={2000}
              height={1500}
              sizes="(max-width: 1080px) 100vw, 46vw"
              priority
            />
            <figcaption>Vierwaldstättersee, 2024</figcaption>
          </figure>
        </div>
      </section>

      <Section id="about" index="01" label="About">
        <p className="about-lead">
          I&apos;m usually the person who gives a group structure and keeps
          its energy up. I like knowing what everyone is working on,
          bringing people together and making sure an idea actually turns
          into something finished.
        </p>
        <div className="about-cols">
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
      </Section>

      <Section id="archive" index="02" label="Projects">
        <div className="section-head">
          <h2>Things I&apos;ve made</h2>
          <p>
            Three projects I&apos;m especially proud of, followed by more work
            worth opening. Every row links directly to the code.
          </p>
          <span className="idx-count">{projects.length} projects</span>
        </div>

        <div className="archive-list top-list">
          {topProjects.map((project, index) => (
            <ProjectRow key={project.slug} number={index + 1} project={project} />
          ))}
        </div>

        <div className="archive-group">
          <span className="archive-label">More work</span>
          <div className="archive-list">
            {moreProjects.map((project) => (
              <ProjectRow key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </Section>

      <Section id="certificates" index="03" label="Certificates">
        <div className="section-head">
          <h2>Certificates</h2>
          <p>Courses &amp; milestones</p>
        </div>
        <div className="cert-grid">
          {CERTIFICATES.map((certificate, index) => (
            <a
              className="cert-card"
              href={certificate.url}
              key={certificate.title}
              rel="noreferrer"
              target="_blank"
            >
              <span className="cert-top">
                <span>0{index + 1}</span>
                <span aria-hidden="true">↗</span>
              </span>
              <h3>{certificate.title}</h3>
              <p>{certificate.detail}</p>
            </a>
          ))}
        </div>
      </Section>

      <Section id="contact" index="04" label="Contact">
        <div className="contact-panel">
          <div>
            <h2 className="contact-title">Currently looking for the right team.</h2>
            <p className="contact-sub">
              I&apos;m available for an apprenticeship anywhere. If that sounds
              useful, write to me right here, without leaving the website.
            </p>
          </div>
          <ContactForm />
        </div>
      </Section>

      <SiteFooter onHome />
    </>
  );
}
