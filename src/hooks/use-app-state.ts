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
import { apiPost } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";

export function useAppState() {
  const router = useRouter();
  const {
    setSignupDialogOpen,
    setProfileDialogOpen,
    setNotificationDialogOpen,
    setTrackOrderDialogOpen,
    setQuoteNotifications,
    quoteNotifications,
    setConfirmedOrderDetails,
    confirmedOrderDetails,
    isAuthenticated,
    userRole,
    setIsAuthenticated,
    setUserRole,
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
        targetPage = "cart";
      }

      if (vehicleInfo !== undefined) {
        setVehicleData(vehicleInfo);
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

      let destination = pageToPath(targetPage);
      if (id) {
        const separator = destination.includes("?") ? "&" : "?";
        destination = `${destination}${separator}supplier=${encodeURIComponent(id)}`;
      }
      router.push(destination);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [
      router,
      setVehicleData,
      setSelectedPartData,
      setSelectedCategory,
      setQuoteNotifications,
    ],
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

  const handleSignOut = useCallback(async () => {
    try {
      await apiPost(apiRoutes?.auth?.logout);
    } catch (error) {
      console.error("Failed to call logout endpoint", error);
    } finally {
      setIsAuthenticated(false);
      setUserRole(null);
      setConfirmedOrderDetails(null);
      router.push("/");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [
    router,
    setIsAuthenticated,
    setConfirmedOrderDetails,
    setUserRole,
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
    openSignupDialog: () => setSignupDialogOpen(true),
    openProfileDialog: () => setProfileDialogOpen(true),
    openNotificationDialog: () => setNotificationDialogOpen(true),
    openTrackOrderDialog: () => setTrackOrderDialogOpen(true),
    showOrderConfirmation,
    clearQuoteNotifications,
    setQuoteNotifications,
    isAuthenticated,
    userRole,
    handleSignOut,
    handleAuthSuccess: authSuccess,
    vehicleData,
    selectedPartData,
    selectedCategory,
    quoteNotifications,
    confirmedOrderDetails,
    setSelectedCategory,
  };
}
