import type { UserRole } from "@/utils/api/types";
import { environment } from "@/utils/environment";
import { decodeJwt } from "jose";

const AUTH_TOKEN_KEY = "partsquote_access_token";
const COOKIE_NAME = environment.cookies.name;

const isBrowser = typeof window !== "undefined";

function getStorage() {
  return isBrowser ? window.localStorage : null;
}

export function getStoredAuthToken(): string | null {
  const storage = getStorage();
  const token = storage?.getItem(AUTH_TOKEN_KEY) ?? null;
  if (!token || isTokenExpired(token)) {
    clearAuthSession();
    return null;
  }
  return token;
}

function isTokenExpired(token: string) {
  const payload = extractTokenPayload(token);
  if (!payload) {
    return true;
  }
  if (typeof payload.exp !== "number") {
    return false;
  }
  return payload.exp * 1000 <= Date.now();
}

function extractTokenPayload(token: string) {
  try {
    return decodeJwt(token);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
}

export function persistAuthSession(token: string) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(AUTH_TOKEN_KEY, token);
  setAuthCookie(token);
}

export function clearAuthSession() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(AUTH_TOKEN_KEY);
  setAuthCookie("");
}

function setAuthCookie(value: string) {
  if (typeof document === "undefined") return;
  if (!COOKIE_NAME) return;

  const safeValue = value ? value : "";
  const expires = value ? "; max-age=86400" : "; max-age=0";
  document.cookie = `${COOKIE_NAME}=${safeValue}; path=/${expires}`;
}

type StoredSessionUser = {
  id?: string;
  email?: string;
  role?: UserRole;
};

export function getStoredUser(): StoredSessionUser | null {
  const token = getStoredAuthToken();
  if (!token) return null;
  const payload = extractTokenPayload(token);
  if (!payload) return null;
  const role =
    typeof payload.role === "string" &&
    ["user", "supplier", "admin"].includes(payload.role)
      ? (payload.role as UserRole)
      : undefined;
  return {
    id: typeof payload.sub === "string" ? payload.sub : undefined,
    email: typeof payload.email === "string" ? payload.email : undefined,
    role,
  };
}
