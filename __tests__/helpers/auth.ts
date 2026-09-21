import { vi } from "vitest";
import { getAuthConfig } from "@/lib/auth/config";
import { hashPassword } from "@/lib/auth/password";
import { createSessionToken, sessionCookieName } from "@/lib/auth/session";

export const TEST_PASSWORD = "correct horse battery staple";
export const TEST_SECRET = "test-session-secret-that-is-long-enough-0123456789";

// The lowest cost the parser accepts, so the suite stays fast. Production hashes use 2^17.
let cachedHash: Promise<string> | null = null;
export function testPasswordHash() {
  cachedHash ??= hashPassword(TEST_PASSWORD, 2 ** 14);
  return cachedHash;
}

export async function configureAuth() {
  vi.stubEnv("ADMIN_PASSWORD_HASH", await testPasswordHash());
  vi.stubEnv("SESSION_SECRET", TEST_SECRET);
}

export function configureKv() {
  vi.stubEnv("KV_REST_API_URL", "https://example.upstash.io");
  vi.stubEnv("KV_REST_API_TOKEN", "test-token");
}

export function unconfigureKv() {
  vi.stubEnv("KV_REST_API_URL", "");
  vi.stubEnv("KV_REST_API_TOKEN", "");
}

/** A valid session cookie for the currently stubbed credentials. */
export function adminCookie() {
  const config = getAuthConfig();
  if (!config) throw new Error("configureAuth() first");
  return `${sessionCookieName()}=${createSessionToken(config.sessionKey)}`;
}

export function apiRequest(
  path: string,
  { method = "GET", body, cookie, origin, headers = {} }: {
    method?: string;
    body?: unknown;
    cookie?: string;
    origin?: string;
    headers?: Record<string, string>;
  } = {},
) {
  return new Request(`http://localhost${path}`, {
    method,
    headers: {
      host: "localhost",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(cookie ? { cookie } : {}),
      ...(origin ? { origin } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
}

export function params(slug: string) {
  return { params: Promise.resolve({ slug }) };
}
