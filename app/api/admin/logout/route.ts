import { errorResponse, noContent } from "@/lib/admin/http";
import { isSameOrigin } from "@/lib/auth/verify";
import { sessionCookieName, sessionCookieOptions } from "@/lib/auth/session";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return errorResponse(403, "Anfrage von fremder Herkunft abgelehnt.");
  const response = noContent();
  // Same attributes as when it was set, otherwise the browser keeps a __Host- cookie.
  response.cookies.set(sessionCookieName(), "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
