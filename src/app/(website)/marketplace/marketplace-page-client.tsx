"use client";

import type { ServiceCategoryDTO } from "@/actions/categories";
import { PartsSelectionPage } from "@/page-components/parts-selection";
import { useAppState } from "@/hooks/use-app-state";

type MarketplacePageClientProps = {
  categories: ServiceCategoryDTO[];
};

export function MarketplacePageClient({
  categories,
}: MarketplacePageClientProps) {
  const { handleNavigate, openSignupDialog } = useAppState();

  return (
    <PartsSelectionPage
      categories={categories}
      onNavigate={handleNavigate}
      onSignupClick={openSignupDialog}
    />
  );
}
