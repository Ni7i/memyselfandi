import Link from "next/link";
import AdminNav from "../_components/AdminNav";
import LogoutButton from "../_components/LogoutButton";

// Signed-in area. The session is verified by each page (requireAdmin) and by the proxy.
export default function PanelLayout({ children }: { children: React.ReactNode }) {
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
        <LogoutButton />
      </header>
      <main className="adm-main">{children}</main>
    </>
  );
}
