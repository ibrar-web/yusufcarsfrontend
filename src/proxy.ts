"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPublicPath, requiredRoleForPath } from "@/utils/apiroutes";

const AUTH_COOKIE = "partsquote_authenticated";
const ROLE_COOKIE = "partsquote_role";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get(AUTH_COOKIE)?.value === "true";
  const role = request.cookies.get(ROLE_COOKIE)?.value;
  const requiredRole = requiredRoleForPath(pathname);

  if (!isAuthenticated || (requiredRole && role !== requiredRole)) {
    const url = new URL("/auth", request.url);
    url.searchParams.set("redirect", pathname);
    if (requiredRole) {
      url.searchParams.set("role", requiredRole);
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
