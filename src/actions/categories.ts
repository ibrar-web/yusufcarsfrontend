"use server";

import "server-only";
import type { FindOptionsOrder } from "typeorm";
import {
  ServiceCategorySchema,
  ServiceSubcategorySchema,
  ServiceItemSchema,
  type ServiceCategoryEntity,
  type ServiceSubcategoryEntity,
  type ServiceItemEntity,
} from "@/data/entities/service-taxonomy.schema";
import { getDataSource } from "@/lib/db";
export type ServiceItemDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
};

export type ServiceSubcategoryDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  items?: ServiceItemDTO[];
};

export type ServiceCategoryDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  subcategories?: ServiceSubcategoryDTO[];
};

type CategoryFetchOptions = {
  includeSubcategories?: boolean;
  includeItems?: boolean;
};

const defaultCategoryOptions: Required<CategoryFetchOptions> = {
  includeSubcategories: true,
  includeItems: true,
};

function mapItem(
  item: ServiceItemEntity,
  includeSubcategory = false,
  includeCategory = false,
): ServiceItemDTO {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description ?? null,
    metadata: (item.metadata as Record<string, unknown>) ?? null,
    subcategory:
      includeSubcategory && item.subcategory
        ? {
            id: item.subcategory.id,
            name: item.subcategory.name,
            slug: item.subcategory.slug,
          }
        : undefined,
    category:
      includeCategory && item.subcategory?.category
        ? {
            id: item.subcategory.category.id,
            name: item.subcategory.category.name,
            slug: item.subcategory.category.slug,
          }
        : undefined,
  };
}

function mapSubcategory(
  subcategory: ServiceSubcategoryEntity,
  includeItems = false,
  includeCategory = false,
): ServiceSubcategoryDTO {
  return {
    id: subcategory.id,
    name: subcategory.name,
    slug: subcategory.slug,
    description: subcategory.description ?? null,
    sortOrder: subcategory.sortOrder,
    category:
      includeCategory && subcategory.category
        ? {
            id: subcategory.category.id,
            name: subcategory.category.name,
            slug: subcategory.category.slug,
          }
        : undefined,
    items:
      includeItems && subcategory.items
        ? subcategory.items.map((item) => mapItem(item))
        : undefined,
  };
}

function mapCategory(
  category: ServiceCategoryEntity,
  includeSubcategories = false,
  includeItems = false,
): ServiceCategoryDTO {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? null,
    sortOrder: category.sortOrder,
    subcategories:
      includeSubcategories && category.subcategories
        ? category.subcategories.map((subcategory) =>
            mapSubcategory(subcategory, includeItems),
          )
        : undefined,
  };
}

export async function fetchServiceCategories(
  options: CategoryFetchOptions = defaultCategoryOptions,
): Promise<ServiceCategoryDTO[]> {
  const ds = await getDataSource();
  const repository = ds.getRepository<ServiceCategoryEntity>(
    ServiceCategorySchema,
  );
  const resolvedOptions = { ...defaultCategoryOptions, ...options };

  const relations = resolvedOptions.includeSubcategories
    ? {
        subcategories: resolvedOptions.includeItems ? { items: true } : true,
      }
    : undefined;

  const order: FindOptionsOrder<ServiceCategoryEntity> = {
    sortOrder: "ASC",
    name: "ASC",
  };

  if (resolvedOptions.includeSubcategories) {
    order.subcategories = {
      sortOrder: "ASC",
      name: "ASC",
    };

    if (resolvedOptions.includeItems) {
      if (!order.subcategories) {
        order.subcategories = {};
      }
      (order.subcategories as FindOptionsOrder<ServiceSubcategoryEntity>).items =
        {
          name: "ASC",
        };
    }
  }

  const categories = await repository.find({
    relations,
    order,
  });

  return categories.map((category) =>
    mapCategory(
      category,
      resolvedOptions.includeSubcategories,
      resolvedOptions.includeItems,
    ),
  );
}

export async function fetchServiceSubcategoriesByCategory(
  categorySlug: string,
): Promise<ServiceSubcategoryDTO[]> {
  if (!categorySlug) {
    throw new Error("categorySlug is required");
  }

  const ds = await getDataSource();
  const repository = ds.getRepository<ServiceSubcategoryEntity>(
    ServiceSubcategorySchema,
  );

  const subcategories = await repository.find({
    relations: { category: true, items: true },
    where: {
      category: { slug: categorySlug },
    },
    order: {
      sortOrder: "ASC",
      name: "ASC",
      items: {
        name: "ASC",
      },
    },
  });

  return subcategories.map((subcategory) =>
    mapSubcategory(subcategory, true, true),
  );
}

export async function fetchServiceItemsBySubcategory(
  subcategorySlug: string,
): Promise<ServiceItemDTO[]> {
  if (!subcategorySlug) {
    throw new Error("subcategorySlug is required");
  }

  const ds = await getDataSource();
  const repository = ds.getRepository<ServiceItemEntity>(ServiceItemSchema);

  const items = await repository.find({
    relations: { subcategory: { category: true } },
    where: {
      subcategory: { slug: subcategorySlug },
    },
    order: {
      name: "ASC",
    },
  });

  return items.map((item) => mapItem(item, true, true));
}
