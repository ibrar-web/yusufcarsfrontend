"use client";

import { ChatPage } from "./ChatPage";
import { useAppState } from "@/app/providers/app-state";

export default function Chat() {
  const {
    handleNavigate,
    handleBack,
    openSignupDialog,
    selectedSupplierId,
    selectedQuoteId,
  } = useAppState();

  return (
    <ChatPage
      onNavigate={handleNavigate}
      onBack={handleBack}
      supplierId={selectedSupplierId ?? null}
      quoteId={selectedQuoteId ?? null}
      onSignupClick={openSignupDialog}
    />
  );
}
