"use client";

import { AboutPage } from "@/page-components/about";
import { useAppState } from "@/hooks/use-app-state";

export function AboutPageClient() {
  const { handleNavigate } = useAppState();

  return <AboutPage onNavigate={handleNavigate} />;
}
