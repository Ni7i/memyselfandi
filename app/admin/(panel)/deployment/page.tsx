import type { Metadata } from "next";
import { getConfigChecks, getDeploymentInfo } from "@/lib/admin/deployment";
import { requireAdmin } from "@/lib/auth/guard";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = { title: "Deployment" };

function Value({ children }: { children: React.ReactNode }) {
  return <dd>{children ?? <span style={{ color: "var(--dim)" }}>—</span>}</dd>;
}

export default async function DeploymentPage() {
  await requireAdmin();
  const info = getDeploymentInfo();
  const checks = getConfigChecks();

  return (
    <>
      <div className="adm-page-head">
        <div>
          <span className="adm-kicker">Website</span>
          <h1 className="adm-title">Deployment<em>.</em></h1>
          <p className="adm-lead">Das laufende Deployment und welche Einstellungen gesetzt sind. Secrets werden nie angezeigt.</p>
        </div>
      </div>

      <section>
        <h2 className="adm-kicker" style={{ marginBottom: 14 }}>Laufendes Deployment</h2>
        <dl className="adm-dl">
          <dt>Umgebung</dt>
          <Value>
            <span className="adm-badge" data-tone={info.environment === "production" ? "ok" : undefined}>{info.environment}</span>
          </Value>
          <dt>Branch</dt>
          <Value>{info.branch && <span className="adm-mono">{info.branch}</span>}</Value>
          <dt>Commit</dt>
          <Value>
            {info.commitSha && info.commitUrl && (
              <a className="adm-link adm-mono" href={info.commitUrl} target="_blank" rel="noreferrer">{info.commitSha.slice(0, 7)}</a>
            )}
            {info.commitMessage && <> · {info.commitMessage}</>}
          </Value>
          <dt>Autor</dt>
          <Value>{info.commitAuthor}</Value>
          <dt>Deployment-URL</dt>
          <Value>
            {info.deploymentUrl && <a className="adm-link" href={info.deploymentUrl} target="_blank" rel="noreferrer">{info.deploymentUrl}</a>}
          </Value>
          <dt>Produktion</dt>
          <Value>
            <a className="adm-link" href={info.productionUrl ?? SITE_URL} target="_blank" rel="noreferrer">{info.productionUrl ?? SITE_URL}</a>
          </Value>
          <dt>Region</dt>
          <Value>{info.region && <span className="adm-mono">{info.region}</span>}</Value>
          <dt>Node.js</dt>
          <Value><span className="adm-mono">{info.nodeVersion}</span></Value>
        </dl>
      </section>

      <section className="adm-section">
        <h2 className="adm-kicker">Konfiguration</h2>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Bereich</th>
                <th>Environment Variables</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((check) => (
                <tr key={check.label}>
                  <td>
                    <span className="adm-table-title">{check.label}</span>
                    <p className="adm-table-sub">{check.note}</p>
                  </td>
                  <td className="adm-mono">{check.variables}</td>
                  <td>
                    <span className="adm-badge" data-tone={check.ok ? "ok" : "warn"}>{check.ok ? "Eingerichtet" : "Fehlt"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="adm-section">
        <h2 className="adm-kicker">Suchmaschinen</h2>
        <div className="adm-actions" style={{ justifyContent: "flex-start" }}>
          <a className="adm-button-ghost" href="/robots.txt" target="_blank" rel="noreferrer">robots.txt ↗</a>
          <a className="adm-button-ghost" href="/sitemap.xml" target="_blank" rel="noreferrer">sitemap.xml ↗</a>
        </div>
      </section>
    </>
  );
}
