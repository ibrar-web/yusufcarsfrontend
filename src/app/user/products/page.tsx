"use client";

import { ProductsPage } from "./ProductsPage";
import { useAppState } from "@/hooks/use-app-state";

export default function Products() {
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
