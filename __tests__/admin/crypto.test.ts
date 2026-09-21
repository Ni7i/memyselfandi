import { createHmac } from "node:crypto";
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

describe("session tokens (JWT, HS256)", () => {
  const key = Buffer.alloc(32, 7);
  const decode = (part: string) => JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
  const signWith = (header: object, claims: object, signingKey = key) => {
    const input = `${Buffer.from(JSON.stringify(header)).toString("base64url")}.${Buffer.from(JSON.stringify(claims)).toString("base64url")}`;
    return `${input}.${createHmac("sha256", signingKey).update(input).digest("base64url")}`;
  };

  it("issues a standard HS256 JWT that expires after 15 minutes", () => {
    const token = createSessionToken(key, Date.UTC(2026, 8, 21, 12, 0, 0));
    const [header, payload, signature] = token.split(".");

    expect(decode(header)).toEqual({ alg: "HS256", typ: "JWT" });
    const claims = decode(payload);
    expect(claims).toMatchObject({ iss: "https://enisshorra.ch", aud: "enisshorra.ch/admin", sub: "admin" });
    expect(claims.exp - claims.iat).toBe(15 * 60);
    expect(SESSION_TTL_SECONDS).toBe(900);
    expect(claims.jti).toMatch(/^[0-9a-f-]{36}$/);
    expect(signature).toMatch(/^[\w-]{43}$/);
  });

  it("accepts a fresh token and returns its claims", () => {
    expect(verifySessionToken(createSessionToken(key), key)?.sub).toBe("admin");
  });

  it("is valid for 15 minutes, not a second longer", () => {
    const issued = Date.UTC(2026, 8, 21, 12, 0, 0);
    const token = createSessionToken(key, issued);
    expect(verifySessionToken(token, key, issued + 14 * 60 * 1000)).not.toBeNull();
    expect(verifySessionToken(token, key, issued + 15 * 60 * 1000)).toBeNull();
  });

  it("rejects a token signed with another key", () => {
    expect(verifySessionToken(createSessionToken(Buffer.alloc(32, 8)), key)).toBeNull();
  });

  it("rejects a tampered payload", () => {
    const [header, , signature] = createSessionToken(key).split(".");
    const forged = Buffer.from(JSON.stringify({ iss: "https://enisshorra.ch", aud: "enisshorra.ch/admin", sub: "admin", iat: 0, exp: 9_999_999_999, jti: "x" })).toString("base64url");
    expect(verifySessionToken(`${header}.${forged}.${signature}`, key)).toBeNull();
  });

  it("rejects alg=none and other algorithms", () => {
    const now = Math.floor(Date.now() / 1000);
    const claims = { iss: "https://enisshorra.ch", aud: "enisshorra.ch/admin", sub: "admin", iat: now, exp: now + 60, jti: "x" };
    const unsigned = `${Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url")}.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.`;
    expect(verifySessionToken(unsigned, key)).toBeNull();
    expect(verifySessionToken(signWith({ alg: "HS512", typ: "JWT" }, claims), key)).toBeNull();
  });

  it("rejects correctly signed tokens with wrong claims or an overlong lifetime", () => {
    const now = Math.floor(Date.now() / 1000);
    const base = { iss: "https://enisshorra.ch", aud: "enisshorra.ch/admin", sub: "admin", iat: now, exp: now + 60, jti: "x" };
    const header = { alg: "HS256", typ: "JWT" };
    expect(verifySessionToken(signWith(header, base), key)).not.toBeNull();
    expect(verifySessionToken(signWith(header, { ...base, aud: "someone-else" }), key)).toBeNull();
    expect(verifySessionToken(signWith(header, { ...base, iss: "https://evil.example" }), key)).toBeNull();
    expect(verifySessionToken(signWith(header, { ...base, sub: "root" }), key)).toBeNull();
    expect(verifySessionToken(signWith(header, { ...base, exp: now + 24 * 60 * 60 }), key)).toBeNull();
  });

  it("rejects garbage", () => {
    for (const token of [undefined, "", "1", "a.b", "a.b.c.d", "admin_auth=1", "x".repeat(1100)]) {
      expect(verifySessionToken(token, key)).toBeNull();
    }
  });
});
