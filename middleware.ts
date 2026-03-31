import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { isAllowedOrigin } from "./lib/env";
import { assertSafeQueryParams } from "./lib/security";


function applySecurityHeaders(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin");
  const pathname = req.nextUrl.pathname;

  if (origin && isAllowedOrigin(origin) && pathname.startsWith("/api/")) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Vary", "Origin");
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/")) {
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return res;
}

export async function middleware(req: NextRequest) {
  if (req.method === "OPTIONS" && req.nextUrl.pathname.startsWith("/api/")) {
    const origin = req.headers.get("origin");
    if (origin && !isAllowedOrigin(origin)) {
      return NextResponse.json({ success: false, message: "Origin not allowed" }, { status: 403 });
    }

    return applySecurityHeaders(req, new NextResponse(null, { status: 204 }));
  }

  const unsafeQuery = assertSafeQueryParams(req);
  if (unsafeQuery) return applySecurityHeaders(req, unsafeQuery);

  const origin = req.headers.get("origin");
  if (origin && req.nextUrl.pathname.startsWith("/api/") && !isAllowedOrigin(origin)) {
    return applySecurityHeaders(
      req,
      NextResponse.json({ success: false, message: "Origin not allowed" }, { status: 403 })
    );
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow admin login page without auth
  if (pathname.startsWith("/admin/login")) return applySecurityHeaders(req, NextResponse.next());

  // Protect all other /admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return applySecurityHeaders(req, NextResponse.redirect(loginUrl));
    }
  }

  return applySecurityHeaders(req, NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};



