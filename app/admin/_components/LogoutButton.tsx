"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendJson } from "./api";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const logout = async () => {
    setPending(true);
    await sendJson("POST", "/api/admin/logout");
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <button className="adm-button-ghost" type="button" onClick={logout} disabled={pending}>
      {pending ? "Abmelden …" : "Abmelden"}
    </button>
  );
}
