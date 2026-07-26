//missleware.js
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth/jwt";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/api/admin/login", "/api/admin/logout"]);

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    const isAdminArea = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
    if (!isAdminArea || PUBLIC_ADMIN_PATHS.has(pathname)) {
        return NextResponse.next();
    }

    const token = req.cookies.get("admin_session")?.value;
    const payload = token ? await verifyAdminToken(token) : null;

    if (!payload) {
        // API routes get a JSON 401 — redirecting a fetch() call to an
        // HTML login page would just leave the frontend trying to
        // JSON.parse() a login page.
        if (pathname.startsWith("/api/admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const loginUrl = new URL("/admin/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
