import Link from "next/link";

/** Shown when a save hits an expired session. The form stays filled in. */
export default function SessionExpiredNotice() {
  return (
    <div className="adm-notice" data-tone="error" role="alert">
      <strong>Sitzung abgelaufen, nichts verloren</strong>
      <span>
        Deine Eingaben sind noch da.{" "}
        <Link className="adm-link" href="/admin/login?expired=1" target="_blank" rel="noopener">
          In neuem Tab anmelden
        </Link>
        , dann hier erneut auf Speichern klicken.
      </span>
    </div>
  );
}
