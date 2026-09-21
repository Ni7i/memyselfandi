"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendJson } from "./api";

interface Props {
  endpoint: string;
  itemTitle: string;
  /** Where to go afterwards; stays on the current page (refreshed) when omitted. */
  redirectTo?: string;
}

export default function DeleteButton({ endpoint, itemTitle, redirectTo }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`„${itemTitle}" endgültig löschen?`)) return;
    setPending(true);
    const result = await sendJson("DELETE", endpoint);
    if (result.status === 401) {
      router.replace(`/admin/login?expired=1&next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (!result.ok) {
      window.alert(result.error ?? "Löschen fehlgeschlagen.");
      setPending(false);
      return;
    }
    if (redirectTo) router.push(redirectTo);
    router.refresh();
  };

  return (
    <button className="adm-button-danger" type="button" onClick={handleDelete} disabled={pending}>
      {pending ? "Lösche …" : "Löschen"}
    </button>
  );
}
