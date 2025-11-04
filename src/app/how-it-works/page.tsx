"use client";

import { HowItWorksPage } from "@/page-components/how-it-works";
import { useAppState } from "../providers/app-state";

export default function HowItWorks() {
  const { handleNavigate } = useAppState();

  return <HowItWorksPage onNavigate={handleNavigate} />;
}
