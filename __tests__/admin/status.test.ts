import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runStatusChecks, statusBaseUrl } from "@/lib/admin/status";
import { configureAuth, configureKv, unconfigureKv } from "../helpers/auth";
import { memoryState } from "../helpers/memory-kv";

type Route = { status: number; body?: string };

const healthy: Record<string, Route> = {
  "/": { status: 200, body: '<section class="idx" id="archive">' },
  "/blog": { status: 200, body: '<main class="idx page-idx" id="posts">' },
  "/blog/unity-to-csharp": { status: 200, body: "<article>" },
  "/projects/screentime-blocker": { status: 200, body: "<article>" },
  "/robots.txt": { status: 200, body: "User-Agent: *\nSitemap: https://enisshorra.ch/sitemap.xml" },
  "/sitemap.xml": { status: 200, body: "<urlset></urlset>" },
  "/api/admin/projects": { status: 401, body: '{"error":"Nicht angemeldet."}' },
};

const verifiedDomain = { status: 200, body: JSON.stringify({ data: [{ name: "enisshorra.ch", status: "verified" }] }) };

function mockFetch(site: Record<string, Route>, resend: Route | Error = verifiedDomain) {
  const fetchMock = vi.fn<typeof fetch>(async (input) => {
    const url = new URL(String(input));
    if (url.hostname === "api.resend.com") {
      if (resend instanceof Error) throw resend;
      return new Response(resend.body ?? "", { status: resend.status });
    }
    const route = site[url.pathname];
    if (!route) return new Response("not found", { status: 404 });
    if (route.status === 0) throw Object.assign(new Error("timed out"), { name: "TimeoutError" });
    return new Response(route.body ?? "", { status: route.status });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function byLabel(report: Awaited<ReturnType<typeof runStatusChecks>>) {
  return Object.fromEntries(report.checks.map((check) => [check.label, check]));
}

beforeEach(async () => {
  memoryState.reset();
  configureKv();
  await configureAuth();
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("RESEND_EMAIL_DOMAIN", "enisshorra.ch");
  vi.stubEnv("VERCEL_ENV", "");
  vi.stubEnv("VERCEL_URL", "");
  vi.stubEnv("PORT", "3000");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("status report", () => {
  it("reports OK when every page, the database, login, protection and mail work", async () => {
    const fetchMock = mockFetch(healthy);
    const report = await runStatusChecks();

    expect(report.overall).toBe("ok");
    expect(report.checks).toHaveLength(10);
    expect(report.checks.every((check) => check.state === "ok")).toBe(true);
    expect(byLabel(report)["Kontaktformular"].detail).toBe("Versand über enisshorra.ch verifiziert");
    expect(byLabel(report)["Admin geschützt"].detail).toBe("Ohne Anmeldung gesperrt (401)");

    const requested = fetchMock.mock.calls.map(([url]) => String(url));
    expect(requested).toContain("http://localhost:3000/blog/unity-to-csharp");
    expect(requested).toContain("http://localhost:3000/projects/screentime-blocker");
    // The admin check must never carry credentials.
    const adminCall = fetchMock.mock.calls.find(([url]) => String(url).endsWith("/api/admin/projects"));
    expect(JSON.stringify(adminCall?.[1])).not.toMatch(/cookie/i);
  });

  it("flags a page that is down", async () => {
    mockFetch({ ...healthy, "/": { status: 500 } });
    const report = await runStatusChecks();

    expect(report.overall).toBe("error");
    expect(byLabel(report)["Startseite"]).toMatchObject({ state: "error", detail: "/: HTTP 500 statt 200" });
  });

  it("flags a page that loads without its content", async () => {
    mockFetch({ ...healthy, "/blog": { status: 200, body: "<html>empty</html>" } });
    expect(byLabel(await runStatusChecks())["Blog-Übersicht"].state).toBe("error");
  });

  it("raises an error if the admin API answers without a login", async () => {
    mockFetch({ ...healthy, "/api/admin/projects": { status: 200, body: "{}" } });
    const report = await runStatusChecks();

    expect(report.overall).toBe("error");
    expect(byLabel(report)["Admin geschützt"].detail).toMatch(/nicht gesperrt/);
  });

  it("reports timeouts instead of hanging", async () => {
    mockFetch({ ...healthy, "/sitemap.xml": { status: 0 } });
    expect(byLabel(await runStatusChecks())["sitemap.xml"]).toMatchObject({ state: "error", detail: "/sitemap.xml: Keine Antwort nach 8 s" });
  });

  it("warns when no database is connected and errors when it does not answer", async () => {
    mockFetch(healthy);
    unconfigureKv();
    const disconnected = await runStatusChecks();
    expect(disconnected.overall).toBe("warn");
    expect(byLabel(disconnected)["Datenbank"].state).toBe("warn");

    configureKv();
    memoryState.fail();
    expect(byLabel(await runStatusChecks())["Datenbank"].state).toBe("error");
  });

  it("checks the mail setup", async () => {
    mockFetch(healthy, { status: 401, body: JSON.stringify({ name: "restricted_api_key", message: "This API key is restricted to only send emails" }) });
    expect(byLabel(await runStatusChecks())["Kontaktformular"].state).toBe("ok");

    mockFetch(healthy, { status: 200, body: JSON.stringify({ data: [{ name: "enisshorra.ch", status: "pending" }] }) });
    expect(byLabel(await runStatusChecks())["Kontaktformular"]).toMatchObject({ state: "warn", detail: "Absender-Domain enisshorra.ch: pending" });

    // Real Resend response for an unknown key.
    mockFetch(healthy, { status: 400, body: JSON.stringify({ statusCode: 400, name: "validation_error", message: "API key is invalid" }) });
    expect(byLabel(await runStatusChecks())["Kontaktformular"].state).toBe("error");

    vi.stubEnv("RESEND_API_KEY", "");
    expect(byLabel(await runStatusChecks())["Kontaktformular"].state).toBe("error");
  });

  it("reports a missing login configuration", async () => {
    mockFetch(healthy);
    vi.stubEnv("SESSION_SECRET", "");
    expect(byLabel(await runStatusChecks())["Admin-Login"].state).toBe("error");
  });

  it("checks the real domain in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_URL", "memyselfandi-abc.vercel.app");
    expect(statusBaseUrl()).toBe("https://enisshorra.ch");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(statusBaseUrl()).toBe("https://memyselfandi-abc.vercel.app");
  });
});
