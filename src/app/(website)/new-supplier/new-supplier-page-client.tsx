"use client";

import { SuppliersPage } from "@/page-components/suppliers";
import { useAppState } from "@/hooks/use-app-state";

export function NewSupplierPageClient() {
  const { handleNavigate } = useAppState();

  return <SuppliersPage onNavigate={handleNavigate} />;
}
