"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const WARN_SECONDS = 2 * 60;

function subscribe(onTick: () => void) {
  const timer = setInterval(onTick, 1000);
  return () => clearInterval(timer);
}

const nowInSeconds = () => Math.floor(Date.now() / 1000);
// No clock on the server: the countdown only appears after hydration.
const noClock = () => null;

/** Counts down to the end of the session, which ends after a fixed time without extension. */
export default function SessionTimer({ expiresAt }: { expiresAt: number }) {
  const now = useSyncExternalStore(subscribe, nowInSeconds, noClock);
  const pathname = usePathname();

  if (now === null) return <span className="adm-session">Sitzung aktiv</span>;

  const remaining = expiresAt - now;
  if (remaining <= 0) {
    return (
      <Link className="adm-session" data-tone="error" href={`/admin/login?expired=1&next=${encodeURIComponent(pathname)}`}>
        Sitzung abgelaufen · neu anmelden
      </Link>
    );
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = String(remaining % 60).padStart(2, "0");
  return (
    <span className="adm-session" data-tone={remaining <= WARN_SECONDS ? "warn" : undefined} title="Danach ist eine neue Anmeldung nötig">
      Abmeldung in {minutes}:{seconds}
    </span>
  );
}
