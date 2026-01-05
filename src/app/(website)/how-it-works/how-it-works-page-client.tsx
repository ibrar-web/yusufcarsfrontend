"use client";

import { HowItWorksPage } from "@/page-components/how-it-works";
import { useAppState } from "@/hooks/use-app-state";

export function HowItWorksPageClient() {
  const { handleNavigate } = useAppState();

  return <HowItWorksPage onNavigate={handleNavigate} />;
}
