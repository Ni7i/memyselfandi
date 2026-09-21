import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAuthConfig } from "@/lib/auth/config";
import { createSessionToken, sessionCookieName } from "@/lib/auth/session";
import { safeAdminPath } from "@/lib/auth/verify";
import { proxy } from "@/proxy";
import { adminCookie, configureAuth, params, unconfigureKv } from "../helpers/auth";

// requireAdmin() reads the cookie through next/headers and redirects through next/navigation.
const browserCookie = vi.hoisted(() => ({ value: undefined as string | undefined }));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (browserCookie.value?.startsWith(`${name}=`) ? { name, value: browserCookie.value.slice(name.length + 1) } : undefined),
  }),
}));
vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  redirect: (url: string) => {
    throw new Error(`REDIRECT ${url}`);
  },
}));

function visit(path: string, cookie?: string) {
  return proxy(new NextRequest(`http://localhost${path}`, { headers: cookie ? { cookie } : {} }));
}

beforeEach(async () => {
  unconfigureKv();
  await configureAuth();
  browserCookie.value = undefined;
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("proxy", () => {
  it("redirects /admin to the login without a session", () => {
    const response = visit("/admin");
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/admin/login");
  });

  it.each(["/admin/projects", "/admin/blog/new", "/admin/deployment"])("redirects %s to the login and remembers the page", (path) => {
    const response = visit(path);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(`http://localhost/admin/login?next=${encodeURIComponent(path)}`);
  });

  it("sends an expired session to the login with a notice and clears the cookie", () => {
    const config = getAuthConfig()!;
    const stale = createSessionToken(config.sessionKey, Date.now() - 16 * 60 * 1000);
    const response = visit("/admin/blog", `${sessionCookieName()}=${stale}`);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/admin/login?next=%2Fadmin%2Fblog&expired=1");
    expect(response.headers.get("set-cookie")).toMatch(/^admin_session=;.*Max-Age=0/);
  });

  it("rejects admin API calls without a session with 401", async () => {
    const response = visit("/api/admin/projects");
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Nicht angemeldet." });
  });

  it("rejects the old sessionStorage flag and forged cookies", () => {
    expect(visit("/admin", "admin_auth=1").status).toBe(307);
    expect(visit("/admin", "admin_session=eyJ2IjoxfQ.forged").status).toBe(307);
  });

  it("lets a valid session through", () => {
    const cookie = adminCookie();
    expect(visit("/admin", cookie).headers.get("x-middleware-next")).toBe("1");
    expect(visit("/api/admin/projects", cookie).headers.get("x-middleware-next")).toBe("1");
  });

  it("keeps login and logout reachable and sends signed-in users past the login page", () => {
    expect(visit("/admin/login").headers.get("x-middleware-next")).toBe("1");
    expect(visit("/api/admin/login").headers.get("x-middleware-next")).toBe("1");
    expect(visit("/api/admin/logout").headers.get("x-middleware-next")).toBe("1");
    expect(visit("/admin/login", adminCookie()).headers.get("location")).toBe("http://localhost/admin");
  });

  it("locks everything when the credentials are not configured", () => {
    const cookie = adminCookie();
    vi.stubEnv("SESSION_SECRET", "");
    expect(visit("/admin", cookie).status).toBe(307);
  });
});

// Each page checks the session itself, so a proxy misconfiguration cannot expose it.
const adminPages: [name: string, load: () => Promise<{ default: unknown }>, slug: string][] = [
  ["dashboard", () => import("@/app/admin/(panel)/page"), ""],
  ["projects", () => import("@/app/admin/(panel)/projects/page"), ""],
  ["new project", () => import("@/app/admin/(panel)/projects/new/page"), ""],
  ["edit project", () => import("@/app/admin/(panel)/projects/[slug]/page"), "quizlot"],
  ["blog", () => import("@/app/admin/(panel)/blog/page"), ""],
  ["new post", () => import("@/app/admin/(panel)/blog/new/page"), ""],
  ["edit post", () => import("@/app/admin/(panel)/blog/[slug]/page"), "unity-to-csharp"],
  ["deployment", () => import("@/app/admin/(panel)/deployment/page"), ""],
];

describe("admin pages without the proxy", () => {
  it.each(adminPages)("%s redirects to the login without a session", async (_name, load, slug) => {
    const Page = (await load()).default as (props: unknown) => Promise<unknown>;
    await expect(Page(params(slug))).rejects.toThrow("REDIRECT /admin/login");
  });

  it.each(adminPages)("%s renders with a valid session", async (_name, load, slug) => {
    browserCookie.value = adminCookie();
    const Page = (await load()).default as (props: unknown) => Promise<unknown>;
    await expect(Page(params(slug))).resolves.toBeTruthy();
  });
});

describe("post-login destination", () => {
  it("only allows admin paths on this site", () => {
    expect(safeAdminPath("/admin/projects/quizlot")).toBe("/admin/projects/quizlot");
    expect(safeAdminPath("/admin")).toBe("/admin");
    for (const unsafe of ["https://evil.example", "//evil.example", "/admin//evil.example", "/admin\\evil", "/adminx", "/admin/login", "/", "", null, undefined]) {
      expect(safeAdminPath(unsafe)).toBe("/admin");
    }
  });
});
