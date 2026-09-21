import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookieName } from "./session";
import { isValidSessionToken } from "./verify";

/** For admin pages: runs on every render, independent of the proxy. */
export async function requireAdmin(): Promise<void> {
  const token = (await cookies()).get(sessionCookieName())?.value;
  if (!isValidSessionToken(token)) redirect("/admin/login");
}
