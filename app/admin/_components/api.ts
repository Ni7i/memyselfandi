// Browser-side helper for the admin API. Holds no secrets: authentication
// travels in the HttpOnly session cookie, which scripts cannot read.

export type FieldErrors = Record<string, string>;

export interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
  fields: FieldErrors;
}

export async function sendJson<T = unknown>(method: "POST" | "PUT" | "DELETE", url: string, body?: unknown): Promise<ApiResult<T>> {
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "same-origin",
    });
  } catch {
    return { ok: false, status: 0, data: null, error: "Keine Verbindung zum Server.", fields: {} };
  }

  const payload = response.status === 204 ? null : ((await response.json().catch(() => null)) as Record<string, unknown> | null);
  return {
    ok: response.ok,
    status: response.status,
    data: response.ok ? (payload as T) : null,
    error: response.ok ? null : typeof payload?.error === "string" ? payload.error : `Fehler ${response.status}.`,
    fields: !response.ok && payload?.fields && typeof payload.fields === "object" ? (payload.fields as FieldErrors) : {},
  };
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
