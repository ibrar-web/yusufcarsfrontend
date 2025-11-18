"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JOSE_SECRET = process.env.JOSE_SECRET!;
const secret = new TextEncoder().encode(JOSE_SECRET);

// Extract role from token
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

  // Skip next/image, static, etc.
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // --- PUBLIC ROUTES ---

  // --- PROTECTED ROUTES ---
  const token = req.cookies.get("access_token")?.value;
  const role = await getRoleFromToken(token);
  console.log("role :", role);
  // Not logged in → send to home (NOT infinite redirect)
  if (!role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Role-based access rules
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/supplier") && role !== "supplier") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  const PUBLIC_PATHS = ["/", "/auth"];
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
