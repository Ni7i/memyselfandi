import type { Metadata } from "next";
import Link from "next/link";
import { loadForAdmin } from "@/lib/admin/load";
import { requireAdmin } from "@/lib/auth/guard";
import { postStore } from "@/lib/content/posts";
import DeleteButton from "../../_components/DeleteButton";
import { formatDay, formatTimestamp } from "../../_components/format";
import StorageNotice from "../../_components/StorageNotice";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogAdminPage() {
  await requireAdmin();
  const { items, status, error } = await loadForAdmin(postStore);

  return (
    <>
      <div className="adm-page-head">
        <div>
          <span className="adm-kicker">Inhalte</span>
          <h1 className="adm-title">Blog<em>.</em></h1>
          <p className="adm-lead">Veröffentlichte Posts sind unter /blog/&lt;slug&gt; erreichbar und stehen in der Sitemap.</p>
        </div>
        <Link className="adm-button" href="/admin/blog/new">Neuer Blogpost</Link>
      </div>

      <StorageNotice connected={status.connected} reachable={status.reachable && !error} />

      <div className="adm-table-wrap">
        {items.length === 0 ? (
          <p className="adm-empty">{error ? "Blogposts konnten nicht geladen werden." : "Noch keine Blogposts."}</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Blogpost</th>
                <th>Status</th>
                <th aria-label="Aktionen" />
              </tr>
            </thead>
            <tbody>
              {items.map((post) => (
                <tr key={post.slug}>
                  <td className="adm-mono">{formatDay(post.publishedAt)}</td>
                  <td>
                    <Link className="adm-table-title" href={`/admin/blog/${post.slug}`}>{post.title}</Link>
                    <p className="adm-table-sub">{post.tags.join(" · ") || post.slug}</p>
                    <p className="adm-table-sub">Geändert: {formatTimestamp(post.updatedAt)}</p>
                  </td>
                  <td>
                    <span className="adm-badge" data-tone={post.published ? "ok" : undefined}>
                      {post.published ? "Veröffentlicht" : "Entwurf"}
                    </span>
                  </td>
                  <td>
                    <div className="adm-actions">
                      {post.published && (
                        <a className="adm-button-ghost" href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">Ansehen ↗</a>
                      )}
                      <Link className="adm-button-ghost" href={`/admin/blog/${post.slug}`}>Bearbeiten</Link>
                      <DeleteButton endpoint={`/api/admin/posts/${encodeURIComponent(post.slug)}`} itemTitle={post.title} />
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
