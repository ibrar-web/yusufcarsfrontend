"use client";

import { ProductsPage } from "./ProductsPage";
import { useAppState } from "@/app/providers/app-state";

export default function WebsiteProductsPage() {
  const {
    handleNavigate,
    handleBack,
    openSignupDialog,
    isAuthenticated,
    handleSignOut,
    openProfileDialog,
    openNotificationDialog,
    openTrackOrderDialog,
    selectedCategory,
  } = useAppState();

  return (
    <ProductsPage
      onNavigate={handleNavigate}
      onBack={handleBack}
      onSignupClick={openSignupDialog}
      isAuthenticated={isAuthenticated}
      onSignOut={handleSignOut}
      onProfileClick={openProfileDialog}
      onNotificationClick={openNotificationDialog}
      onTrackOrderClick={openTrackOrderDialog}
      initialCategory={selectedCategory ?? undefined}
    />
  );
}
