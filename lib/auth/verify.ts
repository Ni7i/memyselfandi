import "server-only";
import { getAuthConfig } from "./config";
import { readCookie, sessionCookieName, verifySessionToken } from "./session";

export function isValidSessionToken(token: string | undefined): boolean {
  const config = getAuthConfig();
  if (!config) return false;
  return verifySessionToken(token, config.sessionKey) !== null;
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
