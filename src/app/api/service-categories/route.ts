"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchServiceCategories } from "@/actions/categories";

type TopCategoriesResponse = {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    subcategoryCount: number;
  }>;
  items: Array<{
    id: string;
    name: string;
    category: string;
    subcategory: string | null;
  }>;
};

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit");
  const itemLimit = limitParam ? Math.max(0, Number(limitParam)) : 12;

  const categories = await fetchServiceCategories({
    includeSubcategories: true,
    includeItems: true,
  });

  const items = categories
    .flatMap((category) =>
      (category.subcategories ?? []).flatMap((subcategory) =>
        (subcategory.items ?? []).map((item) => ({
          id: item.id,
          name: item.name,
          category: category.name,
          subcategory: subcategory.name,
        }))
      )
    )
    .slice(0, itemLimit);

  const response: TopCategoriesResponse = {
    categories: categories.slice(0, 6).map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      subcategoryCount: category.subcategories?.length ?? 0,
    })),
    items,
  };

  return NextResponse.json(response);
}
