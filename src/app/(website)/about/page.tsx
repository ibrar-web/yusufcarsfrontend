"use client";

import { AboutPage } from "@/page-components/about";
import { useAppState } from "@/hooks/use-app-state";

export default function About() {
  const { handleNavigate } = useAppState();

  return <AboutPage onNavigate={handleNavigate} />;
}
