import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookieName, type SessionClaims } from "./session";
import { getSessionClaims } from "./verify";

/** For admin pages: runs on every render, independent of the proxy. */
export async function requireAdmin(): Promise<SessionClaims> {
  const token = (await cookies()).get(sessionCookieName())?.value;
  const claims = getSessionClaims(token);
  if (!claims) redirect(token ? "/admin/login?expired=1" : "/admin/login");
  return claims;
}
