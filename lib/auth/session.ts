// Stateless admin session: `<payload>.<HMAC-SHA256 signature>`, both base64url.
// The signing key is derived from SESSION_SECRET and the password hash (see config.ts),
// so rotating either one signs every existing session out.
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_TTL_SECONDS = 60 * 60 * 8;
const TOKEN_VERSION = 1;
const SIGNATURE_CONTEXT = "enisshorra.admin-session.v1.";
const MAX_TOKEN_LENGTH = 512;

export interface SessionPayload {
  v: typeof TOKEN_VERSION;
  iat: number;
  exp: number;
}

function sign(body: string, key: Buffer) {
  return createHmac("sha256", key).update(SIGNATURE_CONTEXT + body).digest();
}

function isSessionPayload(value: unknown): value is SessionPayload {
  if (typeof value !== "object" || value === null) return false;
  const payload = value as Record<string, unknown>;
  return (
    payload.v === TOKEN_VERSION &&
    Number.isInteger(payload.iat) &&
    Number.isInteger(payload.exp)
  );
}

export function createSessionToken(key: Buffer, now = Date.now()): string {
  const issuedAt = Math.floor(now / 1000);
  const payload: SessionPayload = { v: TOKEN_VERSION, iat: issuedAt, exp: issuedAt + SESSION_TTL_SECONDS };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, key).toString("base64url")}`;
}

export function verifySessionToken(token: string | undefined, key: Buffer, now = Date.now()): SessionPayload | null {
  if (!token || token.length > MAX_TOKEN_LENGTH) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, signature] = parts;

  const expected = sign(body, key);
  const given = Buffer.from(signature, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  let payload: unknown;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!isSessionPayload(payload)) return null;

  const nowSeconds = Math.floor(now / 1000);
  // Small allowance for clock drift between serverless instances.
  if (payload.exp <= nowSeconds || payload.iat > nowSeconds + 60) return null;
  return payload;
}

/** `__Host-` requires Secure, so it is only used where the site runs over HTTPS. */
export function sessionCookieName() {
  return process.env.NODE_ENV === "production" ? "__Host-admin_session" : "admin_session";
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function readCookie(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    if (part.slice(0, separator).trim() === name) return part.slice(separator + 1).trim();
  }
  return undefined;
}
