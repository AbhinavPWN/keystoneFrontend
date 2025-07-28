
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATH = "/keystone-admin";
const LOGIN_PATH = "/keystone-access";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run on /keystone-admin pages
  if (pathname.startsWith(ADMIN_PATH)) {
    const token = req.cookies.get("keystone_token")?.value;

    if (!token) {
      const loginUrl = new URL(LOGIN_PATH, req.url);
      return NextResponse.redirect(loginUrl);
    }

    // NOTE: No jwt.verify here to avoid Edge Runtime issues
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/keystone-admin/:path*"],
};
