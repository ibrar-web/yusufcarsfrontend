"use client";

import { SuppliersPage } from "@/page-components/suppliers";
import { useAppState } from "@/app/providers/app-state";

export default function Suppliers() {
  const { handleNavigate } = useAppState();

  return <SuppliersPage onNavigate={handleNavigate} />;
}
