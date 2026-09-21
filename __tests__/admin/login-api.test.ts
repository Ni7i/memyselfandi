import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as login } from "@/app/api/admin/login/route";
import { POST as logout } from "@/app/api/admin/logout/route";
import { hashPassword } from "@/lib/auth/password";
import { isAdminRequest } from "@/lib/auth/verify";
import { apiRequest, configureAuth, TEST_PASSWORD, unconfigureKv } from "../helpers/auth";

function loginRequest(password: unknown, extra: { origin?: string; ip?: string } = {}) {
  return apiRequest("/api/admin/login", {
    method: "POST",
    body: { password },
    origin: extra.origin,
    headers: { "x-forwarded-for": extra.ip ?? "203.0.113.1" },
  });
}

/** Turns a Set-Cookie header into the Cookie header a browser would send back. */
function cookieFrom(response: Response) {
  return response.headers.get("set-cookie")!.split(";")[0];
}

beforeEach(async () => {
  unconfigureKv();
  await configureAuth();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/admin/login", () => {
  it("logs in with the right password and sets a hardened session cookie", async () => {
    const response = await login(loginRequest(TEST_PASSWORD, { ip: "198.51.100.1" }));

    expect(response.status).toBe(200);
    const cookie = response.headers.get("set-cookie")!;
    expect(cookie).toMatch(/^admin_session=[\w-]+\.[\w-]+\.[\w-]+;/);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toMatch(/SameSite=strict/i);
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("Max-Age=900");
    expect(cookie).not.toContain(TEST_PASSWORD);

    const followUp = apiRequest("/api/admin/projects", { cookie: cookieFrom(response) });
    expect(isAdminRequest(followUp)).toBe(true);
  });

  it("marks the cookie Secure and __Host- in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = await login(loginRequest(TEST_PASSWORD, { ip: "198.51.100.2" }));

    const cookie = response.headers.get("set-cookie")!;
    expect(cookie).toMatch(/^__Host-admin_session=/);
    expect(cookie).toContain("Secure");
  });

  it("rejects a wrong password without setting a cookie", async () => {
    const response = await login(loginRequest("not-the-password", { ip: "198.51.100.3" }));

    expect(response.status).toBe(401);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(await response.json()).toEqual({ error: "Das Passwort ist falsch." });
  });

  it("rejects a missing password and invalid JSON with 400", async () => {
    expect((await login(loginRequest(undefined))).status).toBe(400);
    const broken = apiRequest("/api/admin/login", { method: "POST", body: "{not json" });
    expect((await login(broken)).status).toBe(400);
  });

  it("returns 503 instead of accepting anything when no credentials are configured", async () => {
    vi.stubEnv("ADMIN_PASSWORD_HASH", "");
    const response = await login(loginRequest(TEST_PASSWORD));
    expect(response.status).toBe(503);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("ignores a plaintext ADMIN_PASSWORD", async () => {
    vi.stubEnv("ADMIN_PASSWORD_HASH", "");
    vi.stubEnv("ADMIN_PASSWORD", TEST_PASSWORD);
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await login(loginRequest(TEST_PASSWORD))).status).toBe(503);
  });

  it("refuses a login posted from another site", async () => {
    const response = await login(loginRequest(TEST_PASSWORD, { origin: "https://evil.example" }));
    expect(response.status).toBe(403);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("blocks after 5 failed attempts, even with the right password", async () => {
    const ip = "192.0.2.77";
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect((await login(loginRequest("wrong-password", { ip }))).status).toBe(401);
    }
    const blocked = await login(loginRequest(TEST_PASSWORD, { ip }));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("retry-after")).toBe("900");
    expect(blocked.headers.get("set-cookie")).toBeNull();
  });

  it("signs every session out when the password changes", async () => {
    const response = await login(loginRequest(TEST_PASSWORD, { ip: "198.51.100.4" }));
    const request = apiRequest("/api/admin/projects", { cookie: cookieFrom(response) });
    expect(isAdminRequest(request)).toBe(true);

    vi.stubEnv("ADMIN_PASSWORD_HASH", await hashPassword("a completely new password", 2 ** 14));
    expect(isAdminRequest(request)).toBe(false);
  });
});

describe("POST /api/admin/logout", () => {
  it("clears the session cookie", async () => {
    const response = await logout(apiRequest("/api/admin/logout", { method: "POST" }));

    expect(response.status).toBe(204);
    const cookie = response.headers.get("set-cookie")!;
    expect(cookie).toMatch(/^admin_session=;/);
    expect(cookie).toContain("Max-Age=0");
  });
});
