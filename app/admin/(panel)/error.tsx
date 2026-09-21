"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="adm-notice" data-tone="error" role="alert">
      <strong>Diese Seite konnte nicht geladen werden</strong>
      <span>Meist ist der Speicher kurz nicht erreichbar. Details stehen in den Vercel-Logs.</span>
      <div style={{ marginTop: 10 }}>
        <button className="adm-button-ghost" type="button" onClick={reset}>Erneut versuchen</button>
      </div>
    </div>
  );
}
