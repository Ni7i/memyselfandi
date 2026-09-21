import { NextResponse, type NextRequest } from "next/server";
import { sessionCookieName, sessionCookieOptions } from "@/lib/auth/session";
import { isValidSessionToken } from "@/lib/auth/verify";

// First line of defence only: every admin page and route handler checks the
// session again itself, so a matcher mistake cannot expose anything.
const PUBLIC_ADMIN_API = new Set(["/api/admin/login", "/api/admin/logout"]);
const NO_STORE = { "Cache-Control": "no-store" };

function toLogin(request: NextRequest, hadCookie: boolean) {
  const { pathname, search } = request.nextUrl;
  const url = new URL("/admin/login", request.url);
  if (pathname !== "/admin") url.searchParams.set("next", pathname + search);
  if (hadCookie) url.searchParams.set("expired", "1");
  const response = NextResponse.redirect(url);
  // Drop an expired or invalid cookie so the browser stops sending it.
  if (hadCookie) response.cookies.set(sessionCookieName(), "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(sessionCookieName())?.value;
  const authenticated = isValidSessionToken(token);

  if (pathname.startsWith("/api/admin")) {
    if (authenticated || PUBLIC_ADMIN_API.has(pathname)) return NextResponse.next();
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401, headers: NO_STORE });
  }

  if (pathname === "/admin/login") {
    return authenticated ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }

  return authenticated ? NextResponse.next() : toLogin(request, Boolean(token));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
