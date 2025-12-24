"use client";

import type { VehicleData } from "@/stores/app-store";

export type CartServiceItem = {
  id: string;
  label: string;
  category?: string;
  notes?: string;
};

export type CartSummary = {
  vehicle: VehicleData;
  services: CartServiceItem[];
};
export type serviceObj = {
  id: string,
}

const VEHICLE_COOKIE_KEY = "pq_vehicle_request";
const SERVICES_COOKIE_KEY = "pq_service_selection";
const CART_UPDATED_EVENT = "partsquote-cart-updated";
const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const isBrowser = () => typeof document !== "undefined";

const readCookie = (name: string) => {
  if (!isBrowser()) {
    return null;
  }
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const cookie of cookies) {
    if (!cookie.startsWith(`${name}=`)) {
      continue;
    }
    return cookie.slice(name.length + 1);
  }
  return null;
};

const setCookie = (name: string, value: string, maxAge = DEFAULT_MAX_AGE_SECONDS) => {
  if (!isBrowser()) {
    return;
  }
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
};

const deleteCookie = (name: string) => {
  if (!isBrowser()) {
    return;
  }
  document.cookie = `${name}=; path=/; max-age=0`;
};

const readJsonCookie = <T>(name: string): T | null => {
  const raw = readCookie(name);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(decodeURIComponent(raw)) as T;
  } catch {
    return null;
  }
};

const writeJsonCookie = (name: string, value: unknown) => {
  if (value === null || value === undefined) {
    deleteCookie(name);
    return;
  }
  const serialized = encodeURIComponent(JSON.stringify(value));
  setCookie(name, serialized);
};

const emitCartUpdated = () => {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

export const loadCartSummary = (): CartSummary => {
  if (!isBrowser()) {
    return { vehicle: null, services: [] };
  }
  return {
    vehicle: readJsonCookie<VehicleData>(VEHICLE_COOKIE_KEY),
    services: readJsonCookie<CartServiceItem[]>(SERVICES_COOKIE_KEY) ?? [],
  };
};

export const persistVehicleSelection = (vehicle: VehicleData | null) => {
  writeJsonCookie(VEHICLE_COOKIE_KEY, vehicle);
  emitCartUpdated();
};

export const persistServicesSelection = (services: CartServiceItem[]) => {
  writeJsonCookie(SERVICES_COOKIE_KEY, services.length ? services : null);
  emitCartUpdated();
};

export const removeVehicleFromCart = () => {
  persistVehicleSelection(null);
};

export const removeServiceByIndex = (index: number) => {
  const summary = loadCartSummary();
  const services = Array.isArray(summary.services)
    ? [...summary.services]
    : [];
  if (index < 0 || index >= services.length) {
    return;
  }
  services.splice(index, 1);
  persistServicesSelection(services);
};

export const clearCartCookies = () => {
  deleteCookie(VEHICLE_COOKIE_KEY);
  deleteCookie(SERVICES_COOKIE_KEY);
  emitCartUpdated();
};

export const subscribeToCartUpdates = (listener: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener(CART_UPDATED_EVENT, listener);
  return () => window.removeEventListener(CART_UPDATED_EVENT, listener);
};
