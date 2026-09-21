import { errorResponse, json, readJsonBody } from "@/lib/admin/http";
import { getAuthConfig } from "@/lib/auth/config";
import { isSameOrigin } from "@/lib/auth/verify";
import { verifyPassword } from "@/lib/auth/password";
import { clearFailedLogins, clientIdFromRequest, isLoginBlocked, recordFailedLogin } from "@/lib/auth/rate-limit";
import { createSessionToken, sessionCookieName, sessionCookieOptions } from "@/lib/auth/session";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return errorResponse(403, "Anfrage von fremder Herkunft abgelehnt.");

  const config = getAuthConfig();
  if (!config) return errorResponse(503, "Der Admin-Login ist auf diesem Server nicht eingerichtet.");

  const clientId = clientIdFromRequest(request);
  if (await isLoginBlocked(clientId)) {
    const response = errorResponse(429, "Zu viele Fehlversuche. Bitte in 15 Minuten erneut versuchen.");
    response.headers.set("Retry-After", String(15 * 60));
    return response;
  }

  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const password = (parsed.body as { password?: unknown } | null)?.password;
  if (typeof password !== "string" || password.length === 0) return errorResponse(400, "Bitte ein Passwort eingeben.");

  if (!(await verifyPassword(password, config.passwordHash))) {
    await recordFailedLogin(clientId);
    return errorResponse(401, "Das Passwort ist falsch.");
  }

  await clearFailedLogins(clientId);
  const response = json({ ok: true });
  response.cookies.set(sessionCookieName(), createSessionToken(config.sessionKey), sessionCookieOptions());
  return response;
}
