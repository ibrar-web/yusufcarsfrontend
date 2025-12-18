import "reflect-metadata";
import { DataSource } from "typeorm";
import {
  ServiceCategorySchema,
  ServiceItemSchema,
  ServiceSubcategorySchema,
} from "@/data/entities/service-taxonomy.schema";

declare global {
  // eslint-disable-next-line no-var
  var __serviceDataSource: DataSource | undefined;
}

const entities = [
  ServiceCategorySchema,
  ServiceSubcategorySchema,
  ServiceItemSchema,
];

function buildDataSource() {
  const {
    DATABASE_HOST = "localhost",
    DATABASE_PORT = "5432",
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME,
    NODE_ENV,
  } = process.env;

  if (!DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME) {
    throw new Error(
      "Database credentials are missing. Ensure DATABASE_USER, DATABASE_PASSWORD and DATABASE_NAME are set.",
    );
  }

  const dataSource = new DataSource({
    type: "postgres",
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT),
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    entities,
    synchronize: false,
    logging: NODE_ENV === "development",
  });
  if (NODE_ENV === "development") {
    console.log(
      "[db] Initializing datasource with entities:",
      entities.map((entity) => entity.name),
    );
  }
  return dataSource;
}

const globalDataSource = globalThis.__serviceDataSource ?? buildDataSource();

if (process.env.NODE_ENV !== "production") {
  globalThis.__serviceDataSource = globalDataSource;
}

export async function getDataSource(): Promise<DataSource> {
  if (!globalDataSource.isInitialized) {
    await globalDataSource.initialize();
  }
  return globalDataSource;
}
