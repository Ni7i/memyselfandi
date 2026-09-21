// Admin session as a JSON Web Token (RFC 7519), signed with HMAC-SHA256 (HS256).
// The signing key is derived from SESSION_SECRET and the password hash (see config.ts),
// so rotating either one signs every existing session out.
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

/** Absolute lifetime: after 15 minutes the admin has to log in again. */
export const SESSION_TTL_SECONDS = 15 * 60;

const ISSUER = "https://enisshorra.ch";
const AUDIENCE = "enisshorra.ch/admin";
const SUBJECT = "admin";
const CLOCK_SKEW_SECONDS = 60;
const MAX_TOKEN_LENGTH = 1024;

// Only this exact header is ever issued or accepted, which rules out
// alg=none and algorithm-confusion tokens without parsing the header at all.
const HEADER = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");

export interface SessionClaims {
  iss: string;
  aud: string;
  sub: string;
  /** Issued at, in seconds since the epoch. */
  iat: number;
  /** Expires at, in seconds since the epoch. */
  exp: number;
  jti: string;
}

function sign(signingInput: string, key: Buffer) {
  return createHmac("sha256", key).update(signingInput).digest();
}

function isSessionClaims(value: unknown): value is SessionClaims {
  if (typeof value !== "object" || value === null) return false;
  const claims = value as Record<string, unknown>;
  return (
    claims.iss === ISSUER &&
    claims.aud === AUDIENCE &&
    claims.sub === SUBJECT &&
    Number.isInteger(claims.iat) &&
    Number.isInteger(claims.exp) &&
    typeof claims.jti === "string"
  );
}

export function createSessionToken(key: Buffer, now = Date.now()): string {
  const iat = Math.floor(now / 1000);
  const claims: SessionClaims = {
    iss: ISSUER,
    aud: AUDIENCE,
    sub: SUBJECT,
    iat,
    exp: iat + SESSION_TTL_SECONDS,
    jti: randomUUID(),
  };
  const signingInput = `${HEADER}.${Buffer.from(JSON.stringify(claims)).toString("base64url")}`;
  return `${signingInput}.${sign(signingInput, key).toString("base64url")}`;
}

export function verifySessionToken(token: string | undefined, key: Buffer, now = Date.now()): SessionClaims | null {
  if (!token || token.length > MAX_TOKEN_LENGTH) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  if (header !== HEADER) return null;

  const expected = sign(`${header}.${payload}`, key);
  const given = Buffer.from(signature, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  let claims: unknown;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!isSessionClaims(claims)) return null;

  const nowSeconds = Math.floor(now / 1000);
  if (claims.exp <= nowSeconds) return null;
  if (claims.iat > nowSeconds + CLOCK_SKEW_SECONDS) return null;
  // A validly signed token can never outlive the configured lifetime.
  if (claims.exp - claims.iat > SESSION_TTL_SECONDS) return null;
  return claims;
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
