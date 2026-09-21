import type { Metadata } from "next";
import Link from "next/link";
import { getDeploymentInfo } from "@/lib/admin/deployment";
import { loadForAdmin } from "@/lib/admin/load";
import { requireAdmin } from "@/lib/auth/guard";
import { postStore } from "@/lib/content/posts";
import { projectStore } from "@/lib/content/projects";
import { REPOSITORY_URL } from "@/lib/site";
import { formatTimestamp } from "../_components/format";
import StorageNotice from "../_components/StorageNotice";

export const metadata: Metadata = { title: "Dashboard" };

function countLabel(published: number, drafts: number) {
  return `${published} veröffentlicht · ${drafts} ${drafts === 1 ? "Entwurf" : "Entwürfe"}`;
}

export default async function DashboardPage() {
  await requireAdmin();
  const [projects, posts] = await Promise.all([loadForAdmin(projectStore), loadForAdmin(postStore)]);
  const deployment = getDeploymentInfo();
  const storage = projects.status;

  const recent = [
    ...projects.items.map((item) => ({ kind: "Projekt", title: item.title, href: `/admin/projects/${item.slug}`, updatedAt: item.updatedAt })),
    ...posts.items.map((item) => ({ kind: "Blogpost", title: item.title, href: `/admin/blog/${item.slug}`, updatedAt: item.updatedAt })),
  ]
    .filter((item): item is typeof item & { updatedAt: string } => item.updatedAt !== null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6);

  const publishedProjects = projects.items.filter((item) => item.published).length;
  const publishedPosts = posts.items.filter((item) => item.published).length;

  return (
    <>
      <div className="adm-page-head">
        <div>
          <span className="adm-kicker">Übersicht</span>
          <h1 className="adm-title">Dashboard<em>.</em></h1>
          <p className="adm-lead">Inhalte und Zustand von enisshorra.ch auf einen Blick.</p>
        </div>
      </div>

      <StorageNotice connected={storage.connected} reachable={storage.reachable} />

      <div className="adm-grid">
        <Link className="adm-card" href="/admin/projects">
          <span className="adm-kicker">Projekte</span>
          <div className="adm-stat">{projects.items.length}</div>
          <p className="adm-stat-note">{countLabel(publishedProjects, projects.items.length - publishedProjects)}</p>
        </Link>
        <Link className="adm-card" href="/admin/blog">
          <span className="adm-kicker">Blogposts</span>
          <div className="adm-stat">{posts.items.length}</div>
          <p className="adm-stat-note">{countLabel(publishedPosts, posts.items.length - publishedPosts)}</p>
        </Link>
        <div className="adm-card">
          <span className="adm-kicker">Speicher</span>
          <p style={{ marginTop: 14 }}>
            {!storage.connected ? (
              <span className="adm-badge" data-tone="warn">Nicht verbunden</span>
            ) : storage.reachable ? (
              <span className="adm-badge" data-tone="ok">Redis verbunden</span>
            ) : (
              <span className="adm-badge" data-tone="error">Nicht erreichbar</span>
            )}
          </p>
          <p className="adm-stat-note">
            {storage.connected && storage.reachable && !storage.seeded
              ? "Wird bei der ersten Änderung mit dem Standardinhalt befüllt."
              : storage.connected
                ? "Änderungen sind sofort live."
                : "Website zeigt den Standardinhalt."}
          </p>
        </div>
        <Link className="adm-card" href="/admin/deployment">
          <span className="adm-kicker">Deployment</span>
          <p style={{ marginTop: 14 }}>
            <span className="adm-badge" data-tone={deployment.environment === "production" ? "ok" : undefined}>
              {deployment.environment}
            </span>
          </p>
          <p className="adm-stat-note adm-mono">{deployment.commitSha?.slice(0, 7) ?? "lokal"}</p>
        </Link>
      </div>

      <section className="adm-section">
        <h2 className="adm-kicker">Zuletzt bearbeitet</h2>
        {recent.length === 0 ? (
          <div className="adm-table-wrap"><p className="adm-empty">Noch nichts im Admin geändert.</p></div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <tbody>
                {recent.map((item) => (
                  <tr key={item.href}>
                    <td><Link className="adm-table-title" href={item.href}>{item.title}</Link></td>
                    <td>{item.kind}</td>
                    <td style={{ textAlign: "right" }}>{formatTimestamp(item.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="adm-section">
        <h2 className="adm-kicker">Schnellzugriff</h2>
        <div className="adm-actions" style={{ justifyContent: "flex-start" }}>
          <Link className="adm-button" href="/admin/projects/new">Neues Projekt</Link>
          <Link className="adm-button" href="/admin/blog/new">Neuer Blogpost</Link>
          <a className="adm-button-ghost" href="/" target="_blank" rel="noreferrer">Website ansehen ↗</a>
          <a className="adm-button-ghost" href={REPOSITORY_URL} target="_blank" rel="noreferrer">GitHub-Repository ↗</a>
        </div>
      </section>
    </>
  );
}
