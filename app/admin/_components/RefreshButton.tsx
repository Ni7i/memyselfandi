"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

/** Re-runs the server-side checks by re-rendering the current page. */
export default function RefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button className="adm-button-ghost" type="button" disabled={pending} onClick={() => startTransition(() => router.refresh())}>
      {pending ? "Prüfe …" : "Erneut prüfen"}
    </button>
  );
}
