"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JOSE_SECRET = process.env.JOSE_SECRET!;
const secret = new TextEncoder().encode(JOSE_SECRET);

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

  // Ignore static files
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // PUBLIC ROUTES
  const publicPaths = [
    "/",
    "/auth",
    "/about",
    "/contact",
    "/products",
    "/cart",
    "/request-flow",
    "/vehicle-confirmation",
    "/new-supplier",
    "/how-it-works",
  ];

  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  // Get role
  const token = req.cookies.get("access_token")?.value;
  const role = await getRoleFromToken(token);

  console.log("ROLE:", role, "PATH:", pathname);

  // Not logged in
  if (!role) {
    if (isPublic) return NextResponse.next();
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Logged in users
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/supplier") && role !== "supplier") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
