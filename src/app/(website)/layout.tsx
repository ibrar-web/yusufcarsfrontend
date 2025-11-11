'use client';

import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { useAppState } from "@/app/providers/app-state";

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  const {
    handleNavigate,
    openSignupDialog,
    isAuthenticated,
    handleSignOut,
    openProfileDialog,
    openNotificationDialog,
    openTrackOrderDialog,
  } = useAppState();

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onNavigate={handleNavigate}
        currentPage="home"
        onSignupClick={openSignupDialog}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
        onProfileClick={openProfileDialog}
        onNotificationClick={openNotificationDialog}
        onTrackOrderClick={openTrackOrderDialog}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
