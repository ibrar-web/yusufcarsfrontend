"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { environment } from "@/utils/environment";

const JOSE_SECRET = environment.security.joseSecret;
const secret = new TextEncoder().encode(JOSE_SECRET);

const ADMIN_FALLBACK = "/admin/overview";
const SUPPLIER_FALLBACK = "/supplier/requests";

const getBearerToken = (value?: string | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.toLowerCase().startsWith("bearer ")) {
    return trimmed.slice(7).trim();
  }
  return trimmed;
};

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
    "/blogs",
    "/services",
    "/cart",
    "/request-flow",
    "/new-supplier",
    "/how-it-works",
  ];

  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  const authHeader = req.headers.get("authorization");
  const cookieToken = req.cookies.get(environment.cookies.name)?.value;
  const token = getBearerToken(authHeader) ?? cookieToken;
  const role = await getRoleFromToken(token);

  // Not logged in
  if (!role) {
    if (isPublic) return NextResponse.next();
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (role === "admin") {
    if (!pathname.startsWith("/admin")) {
      const url = new URL(ADMIN_FALLBACK, req.url);
      return NextResponse.redirect(url);
    }
  }

  if (role === "supplier") {
    if (!pathname.startsWith("/supplier")) {
      const url = new URL(SUPPLIER_FALLBACK, req.url);
      return NextResponse.redirect(url);
    }
  }

  // Logged in users accessing incorrect sections
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
