// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authed = req.cookies.get("hv_session")?.value;
  const { pathname } = req.nextUrl;

  // require auth for /dashboard/*
  if (pathname.startsWith("/dashboard")) {
    if (!authed) {
      const url = new URL("/", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // if already authed, send away from "/" to dashboard
  if (pathname === "/" && authed) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
