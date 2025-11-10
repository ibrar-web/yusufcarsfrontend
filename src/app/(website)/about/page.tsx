"use client";

import { AboutPage } from "@/page-components/about";
import { useAppState } from "@/app/providers/app-state";

export default function About() {
  const { handleNavigate } = useAppState();

  return <AboutPage onNavigate={handleNavigate} />;
}
