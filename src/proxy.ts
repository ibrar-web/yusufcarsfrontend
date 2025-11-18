"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JOSE_SECRET = process.env.JOSE_SECRET!;
const secret = new TextEncoder().encode(JOSE_SECRET);

// Extract role
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
  const pathname = req.nextUrl.pathname;

  // Ignore static
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // PUBLIC (exact match only)
  const isHome = pathname === "/";
  const isAuth = pathname === "/auth";
  const isPublic = isHome || isAuth;

  // Get role
  const token = req.cookies.get("access_token")?.value;
  const role = await getRoleFromToken(token);

  console.log("ROLE:", role, "PATH:", pathname);

  // ----------------------
  // 1. NOT LOGGED IN
  // ----------------------
  if (!role) {
    if (isPublic) return NextResponse.next();

    return NextResponse.redirect(new URL("/", req.url));
  }

  // ----------------------
  // 2. LOGGED IN: ROLE CHECKING
  // ----------------------

  // Admin-only
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Supplier-only
  if (pathname.startsWith("/supplier")) {
    if (role !== "supplier") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // User-only
  if (pathname.startsWith("/user")) {
    if (role !== "user") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Other pages → allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
