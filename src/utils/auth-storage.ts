import type { LoginUser } from "@/utils/api/types";
import { environment } from "@/utils/environment";

const AUTH_TOKEN_KEY = "partsquote_access_token";
const AUTH_USER_KEY = "partsquote_current_user";
const COOKIE_NAME = environment.cookies.name;

const isBrowser = typeof window !== "undefined";

function getStorage() {
  return isBrowser ? window.localStorage : null;
}

export function getStoredAuthToken(): string | null {
  const storage = getStorage();
  return storage?.getItem(AUTH_TOKEN_KEY) ?? null;
}

export function getStoredUser(): LoginUser | null {
  const storage = getStorage();
  if (!storage) return null;
  const raw = storage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LoginUser;
  } catch (error) {
    storage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function persistAuthSession(token: string, user: LoginUser) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(AUTH_TOKEN_KEY, token);
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  setAuthCookie(token);
}

export function clearAuthSession() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(AUTH_TOKEN_KEY);
  storage.removeItem(AUTH_USER_KEY);
  setAuthCookie("");
}

function setAuthCookie(value: string) {
  if (typeof document === "undefined") return;
  if (!COOKIE_NAME) return;

  const safeValue = value ? value : "";
  const expires = value ? "; max-age=86400" : "; max-age=0";
  document.cookie = `${COOKIE_NAME}=${safeValue}; path=/${expires}`;
}
