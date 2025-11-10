"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { isPublicPath, requiredRoleForPath } from "@/utils/apiroutes";

const COOKIE_NAME = process.env.COOKIE_NAME ?? "access_token";
const JOSE_SECRET = process.env.JOSE_SECRET ?? "super_secret_key_here_change_me";

const encoder = new TextEncoder();
const secret = encoder.encode(JOSE_SECRET);

async function extractRoleFromToken(token?: string) {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, secret);
    const role = typeof payload.role === "string" ? payload.role : null;
    return role;
  } catch {
    return null;
  }
}

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

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const role = await extractRoleFromToken(token);
  const requiredRole = requiredRoleForPath(pathname);

  if (!role || (requiredRole && role !== requiredRole)) {
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
