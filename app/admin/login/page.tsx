import type { Metadata } from "next";
import Link from "next/link";
import { getAuthConfig } from "@/lib/auth/config";
import { SESSION_TTL_SECONDS } from "@/lib/auth/session";
import { safeAdminPath } from "@/lib/auth/verify";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Anmelden" };

// Reflects the current environment, not the one present at build time.
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ next?: string | string[]; expired?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = safeAdminPath(typeof params.next === "string" ? params.next : null);
  const expired = params.expired === "1";
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
          <LoginForm next={next} expired={expired} sessionMinutes={SESSION_TTL_SECONDS / 60} />
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
