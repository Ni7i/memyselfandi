import type { Metadata } from "next";
import Link from "next/link";
import { loadForAdmin } from "@/lib/admin/load";
import { requireAdmin } from "@/lib/auth/guard";
import { projectStore } from "@/lib/content/projects";
import DeleteButton from "../../_components/DeleteButton";
import { formatTimestamp } from "../../_components/format";
import StorageNotice from "../../_components/StorageNotice";

export const metadata: Metadata = { title: "Projekte" };

export default async function ProjectsPage() {
  await requireAdmin();
  const { items, status, error } = await loadForAdmin(projectStore);

  return (
    <>
      <div className="adm-page-head">
        <div>
          <span className="adm-kicker">Inhalte</span>
          <h1 className="adm-title">Projekte<em>.</em></h1>
          <p className="adm-lead">Veröffentlichte Projekte erscheinen im Archiv der Startseite, Top-Projekte ganz oben.</p>
        </div>
        <Link className="adm-button" href="/admin/projects/new">Neues Projekt</Link>
      </div>

      <StorageNotice connected={status.connected} reachable={status.reachable && !error} />

      <div className="adm-table-wrap">
        {items.length === 0 ? (
          <p className="adm-empty">{error ? "Projekte konnten nicht geladen werden." : "Noch keine Projekte."}</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Projekt</th>
                <th>Status</th>
                <th aria-label="Aktionen" />
              </tr>
            </thead>
            <tbody>
              {items.map((project) => (
                <tr key={project.slug}>
                  <td className="adm-mono">{project.order}</td>
                  <td>
                    <Link className="adm-table-title" href={`/admin/projects/${project.slug}`}>{project.title}</Link>
                    <p className="adm-table-sub">{project.stack.join(" · ") || project.slug}</p>
                    <p className="adm-table-sub">Geändert: {formatTimestamp(project.updatedAt)}</p>
                  </td>
                  <td>
                    <div className="adm-actions" style={{ justifyContent: "flex-start" }}>
                      <span className="adm-badge" data-tone={project.published ? "ok" : undefined}>
                        {project.published ? "Veröffentlicht" : "Entwurf"}
                      </span>
                      {project.featured && <span className="adm-badge" data-tone="warn">Top</span>}
                    </div>
                  </td>
                  <td>
                    <div className="adm-actions">
                      {project.published && (
                        <a className="adm-button-ghost" href={`/projects/${project.slug}`} target="_blank" rel="noreferrer">Ansehen ↗</a>
                      )}
                      <Link className="adm-button-ghost" href={`/admin/projects/${project.slug}`}>Bearbeiten</Link>
                      <DeleteButton endpoint={`/api/admin/projects/${encodeURIComponent(project.slug)}`} itemTitle={project.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
