"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JOSE_SECRET = process.env.JOSE_SECRET!;
const secret = new TextEncoder().encode(JOSE_SECRET);

// Extract role from access token
async function getRoleFromToken(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip internal Next.js assets
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Public pages (add more as needed)
  // const PUBLIC_PATHS = ["/auth", "/", "/contact", "/about"];
  // if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
  //   return NextResponse.next();
  // }

  // Get token
  const token = req.cookies.get("access_token")?.value;
  const role = await getRoleFromToken(token);
  console.log("token :", token, role);
  // Not logged in → redirect to auth
  if (!role) {
    const url = new URL("/auth", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // ROLE VALIDATION RULES
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/supplier")) {
    if (role !== "supplier")
      return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/user")) {
    if (role !== "user") return NextResponse.redirect(new URL("/", req.url));
  }

  // User has permission → continue
  return NextResponse.next();
}

// What paths the middleware applies to
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
