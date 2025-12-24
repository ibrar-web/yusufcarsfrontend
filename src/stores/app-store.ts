"use client";

import { create } from "zustand";
import type { UserRole } from "@/utils/api";

export type OrderDetails = {
  orderNumber: string;
  supplierName: string;
  partName: string;
  price: number;
  eta: string;
};

export type VehicleData = {
  inputMode?: "registration" | "manual";
  registrationNumber?: string;
  postcode?: string;
  localRequest?: boolean;
  requestType?: "local" | "national";
  make?: string;
  model?: string;
  yearOfManufacture?: string;
  fuelType?: string;
  engineSize?: string;
  engineCapacity?: number;
  co2Emissions?: number;
  colour?: string;
  wheelplan?: string;
  taxStatus?: string;
  taxDueDate?: string;
  motStatus?: string;
  motExpiryDate?: string;
  markedForExport?: boolean;
  typeApproval?: string;
  revenueWeight?: number;
  dateOfLastV5CIssued?: string;
  monthOfFirstRegistration?: string;
} | null;

export type PartData = {
  name: string;
  category: string;
  price: number;
  image: string;
} | null;

export type QuoteNotificationsPayload = {
  productName: string;
  productImage: string;
  quotes: Array<{
    id: string;
    supplierName: string;
    price: number;
    eta: string;
  }>;
};

export type QuoteNotificationsState = QuoteNotificationsPayload | null;

export type Page =
  | "home"
  | "request-flow"
  | "parts-selection"
  | "cart"
  | "quotes"
  | "chat"
  | "supplier-profile"
  | "supplier-onboarding"
  | "supplier-dashboard"
  | "admin-dashboard"
  | "auth"
  | "how-it-works"
  | "suppliers"
  | "suppliers-list"
  | "about"
  | "contact"
  | "products"
  | "notifications"
  | "history"
  | "services";

export const PAGE_PATHS: Record<Page, string> = {
  home: "/",
  "request-flow": "/request-flow",
  "parts-selection": "/parts-selection",
  cart: "/cart",
  quotes: "/quotes",
  chat: "/user/chat",
  "supplier-profile": "/supplier-profile",
  "supplier-onboarding": "/auth/supplier-onboarding",
  "supplier-dashboard": "/supplier/requests",
  "admin-dashboard": "/admin/overview",
  auth: "/auth",
  "how-it-works": "/how-it-works",
  suppliers: "/new-supplier",
  "suppliers-list": "/suppliers-list",
  about: "/about",
  contact: "/contact",
  products: "/products",
  services: "/services",
  notifications: "/notifications",
  history: "/history",
};

const VALID_PAGES = new Set<Page>(Object.keys(PAGE_PATHS) as Page[]);

export function resolvePage(page: string): Page {
  return VALID_PAGES.has(page as Page) ? (page as Page) : "home";
}

export function pageToPath(page: Page) {
  return PAGE_PATHS[page] ?? "/";
}

interface AppStore {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
  signupDialogOpen: boolean;
  setSignupDialogOpen: (open: boolean) => void;
  profileDialogOpen: boolean;
  setProfileDialogOpen: (open: boolean) => void;
  notificationDialogOpen: boolean;
  setNotificationDialogOpen: (open: boolean) => void;
  orderConfirmationDialogOpen: boolean;
  setOrderConfirmationDialogOpen: (open: boolean) => void;
  trackOrderDialogOpen: boolean;
  setTrackOrderDialogOpen: (open: boolean) => void;
  vehicleData: VehicleData;
  setVehicleData: (data: VehicleData) => void;
  selectedPartData: PartData;
  setSelectedPartData: (data: PartData) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  quoteNotifications: QuoteNotificationsState;
  setQuoteNotifications: (data: QuoteNotificationsState) => void;
  confirmedOrderDetails: OrderDetails | null;
  setConfirmedOrderDetails: (details: OrderDetails | null) => void;
  handleAuthSuccess: (role?: UserRole) => void;
}

export const useAppStore = create<AppStore>()((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  userRole: null,
  setUserRole: (userRole) => set({ userRole }),
  userId: null,
  setUserId: (userId) => set({ userId }),
  signupDialogOpen: false,
  setSignupDialogOpen: (signupDialogOpen) => set({ signupDialogOpen }),
  profileDialogOpen: false,
  setProfileDialogOpen: (profileDialogOpen) => set({ profileDialogOpen }),
  notificationDialogOpen: false,
  setNotificationDialogOpen: (notificationDialogOpen) =>
    set({ notificationDialogOpen }),
  orderConfirmationDialogOpen: false,
  setOrderConfirmationDialogOpen: (orderConfirmationDialogOpen) =>
    set({ orderConfirmationDialogOpen }),
  trackOrderDialogOpen: false,
  setTrackOrderDialogOpen: (trackOrderDialogOpen) =>
    set({ trackOrderDialogOpen }),
  vehicleData: null,
  setVehicleData: (vehicleData) => set({ vehicleData }),
  selectedPartData: null,
  setSelectedPartData: (selectedPartData) => set({ selectedPartData }),
  selectedCategory: null,
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  quoteNotifications: null,
  setQuoteNotifications: (quoteNotifications) => set({ quoteNotifications }),
  confirmedOrderDetails: null,
  setConfirmedOrderDetails: (confirmedOrderDetails) =>
    set({ confirmedOrderDetails }),
  handleAuthSuccess: (role?: UserRole) =>
    set({
      isAuthenticated: true,
      userRole: role ?? null,
    }),
}));
