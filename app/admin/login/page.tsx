import type { Metadata } from "next";
import Link from "next/link";
import { getAuthConfig } from "@/lib/auth/config";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Anmelden" };

// Reflects the current environment, not the one present at build time.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  const configured = getAuthConfig() !== null;

  return (
    <main className="adm-login">
      <div className="adm-login-card">
        <Link href="/" className="logo" aria-label="Zur Website">
          <span className="top">ENIS</span>
          <span className="bot">SHORRA</span>
        </Link>
        <h1 className="adm-title">Portfolio <em>Admin</em></h1>
        <p className="adm-kicker">enisshorra.ch</p>
        {configured ? (
          <LoginForm />
        ) : (
          <div className="adm-notice" data-tone="error" style={{ marginTop: 26, marginBottom: 0 }}>
            <strong>Login nicht eingerichtet</strong>
            <span>ADMIN_PASSWORD_HASH und SESSION_SECRET fehlen oder sind ungültig. Siehe README.</span>
          </div>
        )}
      </div>
    </main>
  );
}
