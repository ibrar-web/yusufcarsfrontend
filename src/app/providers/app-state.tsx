"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/utils/api";
import { SignupDialog } from "@/components/signup-dialog";
import { SignInDialog } from "@/components/signin-dialog";
import { ProfileDialog } from "@/components/profile-dialog";
import { NotificationDialog } from "@/components/notification-dialog";
import { OrderConfirmationDialog } from "@/components/order-confirmation-dialog";
import { TrackOrderDialog } from "@/components/track-order-dialog";
import { Toaster } from "@/components/ui/sonner";

type Page =
  | "home"
  | "request-flow"
  | "vehicle-confirmation"
  | "parts-selection"
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
  | "history";

type OrderDetails = {
  orderNumber: string;
  supplierName: string;
  partName: string;
  price: number;
  eta: string;
};

type VehicleData = {
  make: string;
  model: string;
  year: string;
  registrationNumber?: string;
} | null;

type PartData = {
  name: string;
  category: string;
  price: number;
  image: string;
} | null;

type QuoteNotificationsPayload = {
  productName: string;
  productImage: string;
  quotes: Array<{
    id: string;
    supplierName: string;
    price: number;
    eta: string;
  }>;
};

type QuoteNotificationsState = QuoteNotificationsPayload | null;

interface AppStateContextValue {
  handleNavigate: (
    page: string,
    id?: string,
    vehicleInfo?: VehicleData,
    partData?: PartData,
    category?: string,
    quoteData?: QuoteNotificationsPayload,
  ) => void;
  handleBack: () => void;
  handleStartChat: (quoteId: string, supplierId: string) => void;
  openSignupDialog: () => void;
  openSigninDialog: () => void;
  openProfileDialog: () => void;
  openNotificationDialog: () => void;
  openTrackOrderDialog: () => void;
  showOrderConfirmation: (details: OrderDetails) => void;
  clearQuoteNotifications: () => void;
  setQuoteNotifications: (data: QuoteNotificationsPayload | null) => void;
  isAuthenticated: boolean;
  handleSignOut: () => void;
  handleAuthSuccess: (role?: UserRole) => void;
  selectedSupplierId: string | null;
  selectedQuoteId: string | null;
  vehicleData: VehicleData;
  selectedPartData: PartData;
  selectedCategory: string | null;
  quoteNotifications: QuoteNotificationsState;
  confirmedOrderDetails: OrderDetails | null;
}

const PAGE_PATHS: Record<Page, string> = {
  home: "/",
  "request-flow": "/request-flow",
  "vehicle-confirmation": "/vehicle-confirmation",
  "parts-selection": "/parts-selection",
  quotes: "/quotes",
  chat: "/chat",
  "supplier-profile": "/supplier-profile",
  "supplier-onboarding": "/supplier-onboarding",
  "supplier-dashboard": "/supplier-dashboard",
  "admin-dashboard": "/admin-dashboard",
  auth: "/auth",
  "how-it-works": "/how-it-works",
  suppliers: "/suppliers",
  "suppliers-list": "/suppliers-list",
  about: "/about",
  contact: "/contact",
  products: "/products",
  notifications: "/notifications",
  history: "/history",
};

const VALID_PAGES = new Set<Page>(Object.keys(PAGE_PATHS) as Page[]);

const AppStateContext = createContext<AppStateContextValue | null>(null);

function resolvePage(page: string): Page {
  return VALID_PAGES.has(page as Page) ? (page as Page) : "home";
}

function pageToPath(page: Page) {
  return PAGE_PATHS[page] ?? "/";
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [signupDialogOpen, setSignupDialogOpen] = useState(false);
  const [signinDialogOpen, setSigninDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [orderConfirmationDialogOpen, setOrderConfirmationDialogOpen] =
    useState(false);
  const [trackOrderDialogOpen, setTrackOrderDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [confirmedOrderDetails, setConfirmedOrderDetails] =
    useState<OrderDetails | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleData>(null);
  const [selectedPartData, setSelectedPartData] = useState<PartData>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quoteNotifications, setQuoteNotifications] =
    useState<QuoteNotificationsState>(null);

  const handleAuthSuccess = useCallback((_role?: UserRole) => {
    setIsAuthenticated(true);
  }, []);

  const handleSignOut = useCallback(() => {
    setIsAuthenticated(false);
    setSelectedSupplierId(null);
    setSelectedQuoteId(null);
    setConfirmedOrderDetails(null);
    router.push("/");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [router]);

  const handleNavigate = useCallback(
    (
      page: string,
      id?: string,
      vehicleInfo?: VehicleData,
      partData?: PartData,
      category?: string,
      quoteData?: QuoteNotificationsPayload,
    ) => {
      let targetPage = resolvePage(page);

      if (targetPage === "request-flow") {
        targetPage = "vehicle-confirmation";
      }

      if (id) {
        setSelectedSupplierId(id);
      }

      if (vehicleInfo) {
        setVehicleData(vehicleInfo);
      }

      if (partData) {
        setSelectedPartData(partData);
      }

      if (category) {
        setSelectedCategory(category);
      } else {
        setSelectedCategory(null);
      }

      if (quoteData) {
        setQuoteNotifications(quoteData);
      }

      router.push(pageToPath(targetPage));

      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [router],
  );

  const handleStartChat = useCallback(
    (quoteId: string, supplierId: string) => {
      setSelectedQuoteId(quoteId);
      setSelectedSupplierId(supplierId);
      router.push(pageToPath("chat"));
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [router],
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const showOrderConfirmation = useCallback((details: OrderDetails) => {
    setConfirmedOrderDetails(details);
    setOrderConfirmationDialogOpen(true);
  }, []);

  const clearQuoteNotifications = useCallback(() => {
    setQuoteNotifications(null);
  }, []);

  const contextValue = useMemo<AppStateContextValue>(
    () => ({
      handleNavigate,
      handleBack,
      handleStartChat,
      openSignupDialog: () => setSignupDialogOpen(true),
      openSigninDialog: () => setSigninDialogOpen(true),
      openProfileDialog: () => setProfileDialogOpen(true),
      openNotificationDialog: () => setNotificationDialogOpen(true),
      openTrackOrderDialog: () => setTrackOrderDialogOpen(true),
      showOrderConfirmation,
      clearQuoteNotifications,
      setQuoteNotifications: (data) => setQuoteNotifications(data),
      isAuthenticated,
      handleSignOut,
      handleAuthSuccess,
      selectedSupplierId,
      selectedQuoteId,
      vehicleData,
      selectedPartData,
      selectedCategory,
      quoteNotifications,
      confirmedOrderDetails,
    }),
    [
      handleNavigate,
      handleBack,
      handleStartChat,
      showOrderConfirmation,
      clearQuoteNotifications,
      isAuthenticated,
      handleSignOut,
      handleAuthSuccess,
      selectedSupplierId,
      selectedQuoteId,
      vehicleData,
      selectedPartData,
      selectedCategory,
      quoteNotifications,
      confirmedOrderDetails,
    ],
  );

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}

      <SignupDialog
        open={signupDialogOpen}
        onOpenChange={setSignupDialogOpen}
        onSignInClick={() => {
          setSignupDialogOpen(false);
          setSigninDialogOpen(true);
        }}
        onSuccess={handleAuthSuccess}
      />

      <SignInDialog
        open={signinDialogOpen}
        onOpenChange={setSigninDialogOpen}
        onSignUpClick={() => {
          setSigninDialogOpen(false);
          setSignupDialogOpen(true);
        }}
        onSuccess={handleAuthSuccess}
      />

      <ProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />

      <NotificationDialog
        open={notificationDialogOpen}
        onOpenChange={setNotificationDialogOpen}
        quoteNotifications={quoteNotifications}
        onNavigate={handleNavigate}
      />

      <OrderConfirmationDialog
        open={orderConfirmationDialogOpen}
        onOpenChange={setOrderConfirmationDialogOpen}
        orderDetails={confirmedOrderDetails}
        onNavigate={handleNavigate}
        onTrackOrder={() => {
          setOrderConfirmationDialogOpen(false);
          setTrackOrderDialogOpen(true);
        }}
      />

      <TrackOrderDialog
        open={trackOrderDialogOpen}
        onOpenChange={setTrackOrderDialogOpen}
        orderDetails={confirmedOrderDetails}
        onNavigate={handleNavigate}
      />

      <Toaster />
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
