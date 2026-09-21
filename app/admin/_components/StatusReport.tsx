import { runStatusChecks, type CheckState } from "@/lib/admin/status";
import { formatTimestamp } from "./format";
import RefreshButton from "./RefreshButton";

const BADGE: Record<CheckState, { tone: string; label: string }> = {
  ok: { tone: "ok", label: "OK" },
  warn: { tone: "warn", label: "Hinweis" },
  error: { tone: "error", label: "Fehler" },
};

function headline(overall: CheckState, problems: number) {
  if (overall === "ok") return { title: "Alles in Ordnung", text: "Die Website läuft, alle Prüfungen sind bestanden." };
  if (overall === "warn") return { title: "Läuft, mit Hinweisen", text: `Die Website ist erreichbar. ${problems} Punkt${problems === 1 ? "" : "e"} solltest du dir ansehen.` };
  return { title: `${problems} Problem${problems === 1 ? "" : "e"} gefunden`, text: "Mindestens eine Prüfung ist fehlgeschlagen, Details unten." };
}

/** Live checks against the running site, rendered on every visit of the dashboard. */
export default async function StatusReport() {
  const report = await runStatusChecks();
  const problems = report.checks.filter((check) => check.state !== "ok").length;
  const summary = headline(report.overall, problems);

  return (
    <div className="adm-status" data-state={report.overall}>
      <div className="adm-status-head">
        <div>
          <span className="adm-badge" data-tone={BADGE[report.overall].tone}>{BADGE[report.overall].label}</span>
          <h3 className="adm-status-title">{summary.title}</h3>
          <p className="adm-stat-note">{summary.text}</p>
        </div>
        <div className="adm-status-meta">
          <span className="adm-mono">{report.baseUrl.replace(/^https?:\/\//, "")}</span>
          <span>Geprüft {formatTimestamp(report.checkedAt)}</span>
          <RefreshButton />
        </div>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table adm-status-table">
          <tbody>
            {report.checks.map((check) => (
              <tr key={check.label}>
                <td className="adm-status-cell">
                  <span className="adm-badge" data-tone={BADGE[check.state].tone}>{BADGE[check.state].label}</span>
                </td>
                <td>
                  <span className="adm-table-title">{check.label}</span>
                  <p className="adm-table-sub">{check.detail}</p>
                </td>
                <td className="adm-mono adm-status-time">{check.durationMs !== undefined ? `${check.durationMs} ms` : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusReportFallback() {
  return (
    <div className="adm-status" aria-busy="true">
      <div className="adm-status-head">
        <div>
          <span className="adm-badge">Prüfe …</span>
          <h3 className="adm-status-title">Website wird geprüft</h3>
          <p className="adm-stat-note">Seiten, Datenbank, Login und E-Mail-Versand werden gerade getestet.</p>
        </div>
      </div>
    </div>
  );
}
