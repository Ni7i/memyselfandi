import "server-only";
import { getAuthConfig } from "@/lib/auth/config";
import { getPublishedPosts } from "@/lib/content/posts";
import { getPublishedProjects } from "@/lib/content/projects";
import { getKv, isKvConfigured } from "@/lib/kv";
import { SITE_URL } from "@/lib/site";

export type CheckState = "ok" | "warn" | "error";

export interface StatusCheck {
  group: "Website" | "Dienste";
  label: string;
  state: CheckState;
  detail: string;
  durationMs?: number;
}

export interface StatusReport {
  checkedAt: string;
  baseUrl: string;
  overall: CheckState;
  checks: StatusCheck[];
}

const TIMEOUT_MS = 8000;

/** The deployment being checked: production checks the real domain, previews themselves. */
export function statusBaseUrl() {
  if (process.env.VERCEL_ENV === "production") return SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

function describeFailure(error: unknown) {
  return error instanceof Error && error.name === "TimeoutError" ? `Keine Antwort nach ${TIMEOUT_MS / 1000} s` : "Nicht erreichbar";
}

async function checkUrl(
  label: string,
  path: string,
  { expectStatus = 200, contains }: { expectStatus?: number; contains?: string } = {},
): Promise<StatusCheck> {
  const started = performance.now();
  const elapsed = () => Math.round(performance.now() - started);
  try {
    const response = await fetch(new URL(path, statusBaseUrl()), {
      cache: "no-store",
      redirect: "manual",
      headers: { "user-agent": "enisshorra-status-check" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.status !== expectStatus) {
      return { group: "Website", label, state: "error", detail: `${path}: HTTP ${response.status} statt ${expectStatus}`, durationMs: elapsed() };
    }
    if (contains && !(await response.text()).includes(contains)) {
      return { group: "Website", label, state: "error", detail: `${path}: Seite lädt, aber der erwartete Inhalt fehlt`, durationMs: elapsed() };
    }
    return { group: "Website", label, state: "ok", detail: `${path} · HTTP ${response.status}`, durationMs: elapsed() };
  } catch (error) {
    return { group: "Website", label, state: "error", detail: `${path}: ${describeFailure(error)}`, durationMs: elapsed() };
  }
}

async function checkFirst(label: string, basePath: string, slug: string | undefined, emptyDetail: string): Promise<StatusCheck> {
  if (!slug) return { group: "Website", label, state: "warn", detail: emptyDetail };
  return checkUrl(label, `${basePath}/${slug}`);
}

async function checkAdminProtection(): Promise<StatusCheck> {
  const result = await checkUrl("Admin geschützt", "/api/admin/projects", { expectStatus: 401 });
  return result.state === "ok"
    ? { ...result, group: "Dienste", detail: "Ohne Anmeldung gesperrt (401)" }
    : { ...result, group: "Dienste", detail: `Admin-API ohne Anmeldung nicht gesperrt – ${result.detail}` };
}

async function checkDatabase(): Promise<StatusCheck> {
  const label = "Datenbank";
  if (!isKvConfigured()) {
    return { group: "Dienste", label, state: "warn", detail: "Nicht verbunden – Inhalte kommen aus dem Code, Speichern ist nicht möglich" };
  }
  const started = performance.now();
  try {
    await getKv().ping();
    const durationMs = Math.round(performance.now() - started);
    return { group: "Dienste", label, state: "ok", detail: "Upstash Redis antwortet", durationMs };
  } catch (error) {
    return { group: "Dienste", label, state: "error", detail: `Redis antwortet nicht (${error instanceof Error ? error.name : "Fehler"})` };
  }
}

async function checkContactForm(): Promise<StatusCheck> {
  const label = "Kontaktformular";
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { group: "Dienste", label, state: "error", detail: "RESEND_API_KEY fehlt – Nachrichten können nicht versendet werden" };

  const domain = process.env.RESEND_EMAIL_DOMAIN ?? "enisshorra.ch";
  const started = performance.now();
  try {
    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const durationMs = Math.round(performance.now() - started);
    const body = (await response.json().catch(() => null)) as {
      name?: string;
      message?: string;
      data?: { name?: string; status?: string }[];
    } | null;

    // Send-only keys may not read domains; that still means sending is configured.
    if (body?.name === "restricted_api_key") {
      return { group: "Dienste", label, state: "ok", detail: "Sende-Schlüssel gesetzt (Domain-Status mit diesem Schlüssel nicht abrufbar)", durationMs };
    }
    // Resend answers an unknown key with 400 "API key is invalid", a missing one with 401.
    if ([400, 401, 403].includes(response.status) && /api.?key/i.test(`${body?.name ?? ""} ${body?.message ?? ""}`)) {
      return { group: "Dienste", label, state: "error", detail: "Resend lehnt den API-Schlüssel ab – Nachrichten kommen nicht an", durationMs };
    }
    if (!response.ok) return { group: "Dienste", label, state: "warn", detail: `Resend antwortet mit HTTP ${response.status}`, durationMs };

    const entry = body?.data?.find((item) => item.name === domain);
    if (!entry) return { group: "Dienste", label, state: "error", detail: `Absender-Domain ${domain} ist bei Resend nicht eingerichtet`, durationMs };
    if (entry.status !== "verified") {
      return { group: "Dienste", label, state: "warn", detail: `Absender-Domain ${domain}: ${entry.status ?? "unbekannt"}`, durationMs };
    }
    return { group: "Dienste", label, state: "ok", detail: `Versand über ${domain} verifiziert`, durationMs };
  } catch (error) {
    return { group: "Dienste", label, state: "warn", detail: `Resend: ${describeFailure(error)}` };
  }
}

function checkLogin(): StatusCheck {
  return getAuthConfig()
    ? { group: "Dienste", label: "Admin-Login", state: "ok", detail: "Passwort-Hash und Signaturschlüssel gesetzt" }
    : { group: "Dienste", label: "Admin-Login", state: "error", detail: "ADMIN_PASSWORD_HASH oder SESSION_SECRET fehlt" };
}

function overallState(checks: StatusCheck[]): CheckState {
  if (checks.some((check) => check.state === "error")) return "error";
  if (checks.some((check) => check.state === "warn")) return "warn";
  return "ok";
}

/** Runs every check in parallel. Each check reports its own failure instead of throwing. */
export async function runStatusChecks(): Promise<StatusReport> {
  const [posts, projects] = await Promise.all([getPublishedPosts(), getPublishedProjects()]);

  const checks = await Promise.all([
    checkUrl("Startseite", "/", { contains: 'id="archive"' }),
    checkUrl("Blog-Übersicht", "/blog", { contains: 'id="posts"' }),
    checkFirst("Blogpost", "/blog", posts[0]?.slug, "Kein veröffentlichter Blogpost"),
    checkFirst("Projektseite", "/projects", projects[0]?.slug, "Kein veröffentlichtes Projekt"),
    checkUrl("robots.txt", "/robots.txt", { contains: `Sitemap: ${SITE_URL}/sitemap.xml` }),
    checkUrl("sitemap.xml", "/sitemap.xml", { contains: "<urlset" }),
    checkContactForm(),
    checkDatabase(),
    Promise.resolve(checkLogin()),
    checkAdminProtection(),
  ]);

  return { checkedAt: new Date().toISOString(), baseUrl: statusBaseUrl(), overall: overallState(checks), checks };
}
