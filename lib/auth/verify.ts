import "server-only";
import { getAuthConfig } from "./config";
import { readCookie, sessionCookieName, verifySessionToken, type SessionClaims } from "./session";

export function getSessionClaims(token: string | undefined): SessionClaims | null {
  const config = getAuthConfig();
  if (!config) return null;
  return verifySessionToken(token, config.sessionKey);
}

export function isValidSessionToken(token: string | undefined): boolean {
  return getSessionClaims(token) !== null;
}

/** For route handlers: checks the session cookie on the incoming request. */
export function isAdminRequest(request: Request): boolean {
  return isValidSessionToken(readCookie(request.headers.get("cookie"), sessionCookieName()));
}

/**
 * Rejects mutations sent from another site. Browsers always attach Origin to
 * cross-site POST/PUT/DELETE requests, so a mismatch means the call came from elsewhere.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === (request.headers.get("host") ?? new URL(request.url).host);
  } catch {
    return false;
  }
}

/** Only same-site admin paths are allowed as a post-login destination. */
export function safeAdminPath(value: string | null | undefined): string {
  if (!value || value.length > 200) return "/admin";
  if (value !== "/admin" && !value.startsWith("/admin/")) return "/admin";
  if (value.startsWith("/admin/login") || value.includes("//") || value.includes("\\")) return "/admin";
  return value;
}
