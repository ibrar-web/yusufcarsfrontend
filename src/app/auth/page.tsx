"use client";

import { AuthPage } from "@/page-components/auth";
import { useAppState } from "../providers/app-state";

export default function Auth() {
  const { handleNavigate } = useAppState();

  return <AuthPage onNavigate={handleNavigate} />;
}
