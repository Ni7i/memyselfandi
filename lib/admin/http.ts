import "server-only";
import { NextResponse } from "next/server";
import { isAdminRequest, isSameOrigin } from "@/lib/auth/verify";
import { ConflictError, NotFoundError, StorageUnavailableError } from "@/lib/content/collection";
import type { FieldErrors } from "@/lib/content/validation";

const MAX_BODY_BYTES = 100_000;
const NO_STORE = { "Cache-Control": "no-store" };

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

export function noContent() {
  return new NextResponse(null, { status: 204, headers: NO_STORE });
}

export function errorResponse(status: number, error: string, fields?: FieldErrors) {
  return json(fields ? { error, fields } : { error }, status);
}

/** Every admin route calls this itself; the proxy check alone is not relied on. */
export function rejectUnauthenticated(request: Request) {
  return isAdminRequest(request) ? null : errorResponse(401, "Nicht angemeldet.");
}

export function rejectUnauthorizedMutation(request: Request) {
  if (!isSameOrigin(request)) return errorResponse(403, "Anfrage von fremder Herkunft abgelehnt.");
  return rejectUnauthenticated(request);
}

export async function readJsonBody(request: Request): Promise<{ ok: true; body: unknown } | { ok: false; response: NextResponse }> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return { ok: false, response: errorResponse(413, "Anfrage ist zu gross.") };

  const raw = await request.text();
  if (Buffer.byteLength(raw) > MAX_BODY_BYTES) return { ok: false, response: errorResponse(413, "Anfrage ist zu gross.") };
  try {
    return { ok: true, body: JSON.parse(raw) };
  } catch {
    return { ok: false, response: errorResponse(400, "Ungültiges JSON.") };
  }
}

export function storeErrorResponse(error: unknown) {
  if (error instanceof ConflictError) return errorResponse(409, error.message, { slug: error.message });
  if (error instanceof NotFoundError) return errorResponse(404, error.message);
  if (error instanceof StorageUnavailableError) return errorResponse(503, error.message);
  console.error("Unexpected admin API error", error instanceof Error ? error.name : error);
  return errorResponse(500, "Unerwarteter Fehler.");
}
