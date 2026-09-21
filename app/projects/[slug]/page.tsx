import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostContent from "@/components/PostContent";
import ProjectRow from "@/components/ProjectRow";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getPublishedProject, getPublishedProjects } from "@/lib/content/projects";

// Projects are managed in /admin and read on every request.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getPublishedProject((await params).slug);
  return project ? { title: `${project.title} · Enis Shorra`, description: project.description } : { title: "Not Found" };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getPublishedProject((await params).slug);
  if (!project) notFound();

  const others = (await getPublishedProjects()).filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main className="article">
        <article className="article-inner">
          <Link className="article-back" href="/#archive">← All projects</Link>
          <header className="article-head">
            <span className="idx-kicker">Project{project.year && ` · ${project.year}`}</span>
            <h1 className="article-title">{project.title}</h1>
            <p className="article-lead">{project.description}</p>
            {project.stack.length > 0 && (
              <ul className="article-tags" aria-label="Tech stack">
                {project.stack.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
            {(project.repoUrl || project.liveUrl) && (
              <div className="article-links">
                {project.repoUrl && (
                  <a className="nav-cta" href={project.repoUrl} target="_blank" rel="noreferrer">View code ↗</a>
                )}
                {project.liveUrl && (
                  <a className="nav-cta" href={project.liveUrl} target="_blank" rel="noreferrer">Open live ↗</a>
                )}
              </div>
            )}
          </header>
          {project.longDescription && (
            <div className="article-body">
              <PostContent content={project.longDescription} />
            </div>
          )}
        </article>

        {others.length > 0 && (
          <aside className="article-inner article-more">
            <span className="archive-label">Other projects</span>
            <div className="archive-list compact-list">
              {others.map((p) => <ProjectRow key={p.slug} project={p} internal />)}
            </div>
          </aside>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
