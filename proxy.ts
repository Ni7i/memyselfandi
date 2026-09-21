import { NextResponse, type NextRequest } from "next/server";
import { sessionCookieName } from "@/lib/auth/session";
import { isValidSessionToken } from "@/lib/auth/verify";

// First line of defence only: every admin page and route handler checks the
// session again itself, so a matcher mistake cannot expose anything.
const PUBLIC_ADMIN_API = new Set(["/api/admin/login", "/api/admin/logout"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = isValidSessionToken(request.cookies.get(sessionCookieName())?.value);

  if (pathname.startsWith("/api/admin")) {
    if (authenticated || PUBLIC_ADMIN_API.has(pathname)) return NextResponse.next();
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  if (pathname === "/admin/login") {
    return authenticated ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }

  return authenticated ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
