import { EntitySchema } from "typeorm";

export interface ServiceCategoryEntity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  subcategories?: ServiceSubcategoryEntity[];
}

export interface ServiceSubcategoryEntity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  category?: ServiceCategoryEntity;
  items?: ServiceItemEntity[];
}

export interface ServiceItemEntity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  subcategory?: ServiceSubcategoryEntity;
}

export const ServiceCategorySchema = new EntitySchema<ServiceCategoryEntity>({
  name: "ServiceCategory",
  tableName: "service_categories",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    name: {
      type: "varchar",
      unique: true,
    },
    slug: {
      type: "varchar",
      unique: true,
    },
    description: {
      type: "text",
      nullable: true,
    },
    sortOrder: {
      name: "sort_order",
      type: "int",
      default: 0,
    },
  },
  relations: {
    subcategories: {
      type: "one-to-many",
      target: "ServiceSubcategory",
      inverseSide: "category",
      cascade: ["insert", "update"],
    },
  },
});

export const ServiceSubcategorySchema =
  new EntitySchema<ServiceSubcategoryEntity>({
    name: "ServiceSubcategory",
    tableName: "service_subcategories",
    columns: {
      id: {
        type: "uuid",
        primary: true,
        generated: "uuid",
      },
      name: {
        type: "varchar",
      },
      slug: {
        type: "varchar",
      },
      description: {
        type: "text",
        nullable: true,
      },
      sortOrder: {
        name: "sort_order",
        type: "int",
        default: 0,
      },
    },
    relations: {
      category: {
        type: "many-to-one",
        target: "ServiceCategory",
        joinColumn: {
          name: "category_id",
        },
        onDelete: "CASCADE",
      },
      items: {
        type: "one-to-many",
        target: "ServiceItem",
        inverseSide: "subcategory",
        cascade: ["insert", "update"],
      },
    },
  });

export const ServiceItemSchema = new EntitySchema<ServiceItemEntity>({
  name: "ServiceItem",
  tableName: "service_items",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    name: {
      type: "varchar",
    },
    slug: {
      type: "varchar",
      unique: true,
    },
    description: {
      type: "text",
      nullable: true,
    },
    metadata: {
      type: "jsonb",
      nullable: true,
    },
  },
  relations: {
    subcategory: {
      type: "many-to-one",
      target: "ServiceSubcategory",
      joinColumn: {
        name: "subcategory_id",
      },
      onDelete: "CASCADE",
    },
  },
});
