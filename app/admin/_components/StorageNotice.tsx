interface Props {
  connected: boolean;
  reachable: boolean;
}

/** Explains why saving is unavailable instead of letting a save fail silently. */
export default function StorageNotice({ connected, reachable }: Props) {
  if (connected && reachable) return null;
  return (
    <div className="adm-notice" data-tone={connected ? "error" : undefined}>
      {connected ? (
        <>
          <strong>Speicher nicht erreichbar</strong>
          <span>Redis antwortet gerade nicht. Die Website zeigt so lange den Standardinhalt, Änderungen sind nicht möglich.</span>
        </>
      ) : (
        <>
          <strong>Nur Lesen: kein Speicher verbunden</strong>
          <span>
            Angezeigt wird der Standardinhalt aus dem Code. Zum Bearbeiten in Vercel unter Storage eine Upstash-Redis-Datenbank
            mit diesem Projekt verbinden (setzt KV_REST_API_URL und KV_REST_API_TOKEN) und neu deployen.
          </span>
        </>
      )}
    </div>
  );
}
