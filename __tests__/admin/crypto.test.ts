import { describe, expect, it } from "vitest";
import { hashPassword, parsePasswordHash, verifyPassword } from "@/lib/auth/password";
import { createSessionToken, SESSION_TTL_SECONDS, verifySessionToken } from "@/lib/auth/session";
import { TEST_PASSWORD, testPasswordHash } from "../helpers/auth";

describe("password hashing (scrypt)", () => {
  it("verifies the right password and rejects a wrong one", async () => {
    const hash = parsePasswordHash(await testPasswordHash())!;
    expect(await verifyPassword(TEST_PASSWORD, hash)).toBe(true);
    expect(await verifyPassword("correct horse battery stapl", hash)).toBe(false);
    expect(await verifyPassword("", hash)).toBe(false);
  });

  it("stores only a salted hash, never the password", async () => {
    const [first, second] = await Promise.all([hashPassword(TEST_PASSWORD, 2 ** 14), hashPassword(TEST_PASSWORD, 2 ** 14)]);
    expect(first).not.toContain(TEST_PASSWORD);
    expect(first).not.toBe(second);
    expect(first).toMatch(/^scrypt\.16384\.8\.1\.[\w-]+\.[\w-]+$/);
  });

  it("uses the OWASP scrypt cost by default", async () => {
    expect(parsePasswordHash(await hashPassword("some long password"))?.cost).toBe(2 ** 17);
  });

  it("rejects malformed or weakened hashes", () => {
    expect(parsePasswordHash("plaintext-password")).toBeNull();
    expect(parsePasswordHash("scrypt.1024.8.1.c2FsdHNhbHRzYWx0c2FsdA.a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5")).toBeNull();
    expect(parsePasswordHash("bcrypt.16384.8.1.x.y")).toBeNull();
  });
});

describe("session tokens (HMAC-SHA256)", () => {
  const key = Buffer.alloc(32, 7);

  it("accepts a fresh token signed with the same key", () => {
    expect(verifySessionToken(createSessionToken(key), key)).not.toBeNull();
  });

  it("rejects a token signed with another key", () => {
    expect(verifySessionToken(createSessionToken(Buffer.alloc(32, 8)), key)).toBeNull();
  });

  it("rejects a tampered payload", () => {
    const [, signature] = createSessionToken(key).split(".");
    const forged = Buffer.from(JSON.stringify({ v: 1, iat: 0, exp: 9_999_999_999 })).toString("base64url");
    expect(verifySessionToken(`${forged}.${signature}`, key)).toBeNull();
  });

  it("rejects an expired token", () => {
    const issued = Date.now() - (SESSION_TTL_SECONDS + 1) * 1000;
    expect(verifySessionToken(createSessionToken(key, issued), key)).toBeNull();
  });

  it("rejects garbage", () => {
    for (const token of [undefined, "", "1", "a.b.c", "admin_auth=1", "x".repeat(600)]) {
      expect(verifySessionToken(token, key)).toBeNull();
    }
  });
});
