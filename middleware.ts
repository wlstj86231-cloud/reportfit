import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, getExpectedSessionValue, hasPasswordConfig, isAuthEnabled } from "@/lib/auth";

const PUBLIC_PREFIXES = ["/login", "/api/auth", "/_next", "/favicon.ico"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  if (!isAuthEnabled()) {
    return NextResponse.next();
  }

  if (!hasPasswordConfig()) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("reason", "missing");
    return NextResponse.redirect(url);
  }

  const expected = await getExpectedSessionValue();
  const current = request.cookies.get(AUTH_COOKIE)?.value;

  if (expected && current === expected) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!.*\\..*).*)", "/api/:path*"]
};
