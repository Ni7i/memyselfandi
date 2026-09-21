import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guard";
import AdminNav from "../_components/AdminNav";
import LogoutButton from "../_components/LogoutButton";
import SessionTimer from "../_components/SessionTimer";

// Signed-in area. The session is verified here, by each page (requireAdmin) and by the proxy.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <>
      <header className="adm-header">
        <div className="adm-brand">
          <Link href="/admin" className="logo" aria-label="Admin-Dashboard">
            <span className="top">ENIS</span>
            <span className="bot">SHORRA</span>
          </Link>
          <span className="adm-brand-name">Portfolio Admin</span>
        </div>
        <AdminNav />
        <div className="adm-header-end">
          <SessionTimer expiresAt={session.exp} />
          <LogoutButton />
        </div>
      </header>
      <main className="adm-main">{children}</main>
    </>
  );
}
