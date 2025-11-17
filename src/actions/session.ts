"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import type { UserRole } from "@/utils/api";

const COOKIE_NAME = process.env.COOKIE_NAME ?? "access_token";
const JOSE_SECRET =
  process.env.JOSE_SECRET ?? "super_secret_key_here_change_me";
const secretKey = new TextEncoder().encode(JOSE_SECRET);

type ValidRole = Extract<UserRole, "user" | "supplier" | "admin">;

export type SessionState = {
  isAuthenticated: boolean;
  role: ValidRole | null;
  userId?: string;
  email?: string;
  expiresAt?: number;
  error?: string;
};

export async function getSessionFromCookie(): Promise<SessionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return { isAuthenticated: false, role: null };
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);

    const role =
      typeof payload.role === "string" &&
      ["user", "supplier", "admin"].includes(payload.role)
        ? (payload.role as ValidRole)
        : null;

    const expMs = payload.exp ? payload.exp * 1000 : undefined;
    if (expMs && expMs < Date.now()) {
      return { isAuthenticated: false, role: null, error: "Token expired" };
    }
    console.log("token :", token, role);
    return {
      isAuthenticated: true,
      role,
      userId: typeof payload.sub === "string" ? payload.sub : undefined,
      email: typeof payload.email === "string" ? payload.email : undefined,
      expiresAt: expMs,
    };
  } catch (error) {
    console.error("Failed to verify access token", error);
    return { isAuthenticated: false, role: null, error: "Invalid token" };
  }
}
