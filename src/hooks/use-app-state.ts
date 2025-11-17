'use client';

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/utils/api";
import {
  useAppStore,
  resolvePage,
  pageToPath,
  type OrderDetails,
  type PartData,
  type QuoteNotificationsPayload,
  type VehicleData,
} from "@/stores/app-store";

export function useAppState() {
  const router = useRouter();
  const {
    selectedSupplierId,
    setSelectedSupplierId,
    selectedQuoteId,
    setSelectedQuoteId,
    setProfileDialogOpen,
    setNotificationDialogOpen,
    setTrackOrderDialogOpen,
    setQuoteNotifications,
    quoteNotifications,
    setConfirmedOrderDetails,
    confirmedOrderDetails,
    isAuthenticated,
    setIsAuthenticated,
    handleAuthSuccess,
    vehicleData,
    setVehicleData,
    selectedPartData,
    setSelectedPartData,
    selectedCategory,
    setSelectedCategory,
    setOrderConfirmationDialogOpen,
  } = useAppStore();

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
      } else {
        setSelectedSupplierId(null);
      }

      if (vehicleInfo) {
        setVehicleData(vehicleInfo);
      } else {
        setVehicleData(null);
      }

      if (partData) {
        setSelectedPartData(partData);
      } else {
        setSelectedPartData(null);
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
    [
      router,
      setSelectedSupplierId,
      setVehicleData,
      setSelectedPartData,
      setSelectedCategory,
      setQuoteNotifications,
    ],
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
    [router, setSelectedQuoteId, setSelectedSupplierId],
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const showOrderConfirmation = useCallback(
    (details: OrderDetails) => {
      setConfirmedOrderDetails(details);
      setOrderConfirmationDialogOpen(true);
    },
    [setConfirmedOrderDetails, setOrderConfirmationDialogOpen],
  );

  const clearQuoteNotifications = useCallback(() => {
    setQuoteNotifications(null);
  }, [setQuoteNotifications]);

  const handleSignOut = useCallback(() => {
    setIsAuthenticated(false);
    setSelectedSupplierId(null);
    setSelectedQuoteId(null);
    setConfirmedOrderDetails(null);
    router.push("/");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [
    router,
    setIsAuthenticated,
    setSelectedSupplierId,
    setSelectedQuoteId,
    setConfirmedOrderDetails,
  ]);

  const authSuccess = useCallback(
    (role?: UserRole) => {
      handleAuthSuccess(role);
    },
    [handleAuthSuccess],
  );

  return {
    handleNavigate,
    handleBack,
    handleStartChat,
    openProfileDialog: () => setProfileDialogOpen(true),
    openNotificationDialog: () => setNotificationDialogOpen(true),
    openTrackOrderDialog: () => setTrackOrderDialogOpen(true),
    showOrderConfirmation,
    clearQuoteNotifications,
    setQuoteNotifications,
    isAuthenticated,
    handleSignOut,
    handleAuthSuccess: authSuccess,
    selectedSupplierId,
    selectedQuoteId,
    vehicleData,
    selectedPartData,
    selectedCategory,
    quoteNotifications,
    confirmedOrderDetails,
  };
}
