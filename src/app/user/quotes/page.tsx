"use client";

import { QuotesPage } from "./QuotesPage";
import { useAppState } from "@/app/providers/app-state";

export default function Quotes() {
  const {
    handleNavigate,
    handleBack,
    handleStartChat,
    openSignupDialog,
    showOrderConfirmation,
  } = useAppState();

  return (
    <QuotesPage
      onNavigate={handleNavigate}
      onBack={handleBack}
      onStartChat={handleStartChat}
      onSignupClick={openSignupDialog}
      onOrderConfirmed={showOrderConfirmation}
    />
  );
}
