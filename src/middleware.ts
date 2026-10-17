import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Exclude public admin routes (login, logout)
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  // 2. Protect Admin UI Routes (/admin/*)
  if (pathname.startsWith("/admin")) {
    const adminCookie = request.cookies.get("ponchomukh_admin_session");
    const session = await verifyAdminToken(adminCookie?.value);

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Protect Admin API Routes (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    const adminCookie = request.cookies.get("ponchomukh_admin_session");
    const authHeader = request.headers.get("authorization");
    const token = adminCookie?.value || authHeader?.replace(/^Bearer\s+/i, "");

    const session = await verifyAdminToken(token);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin privileges required." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

