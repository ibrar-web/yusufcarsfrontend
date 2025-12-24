import "reflect-metadata";
import { config as loadEnv } from "dotenv";
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

// Ensure environment variables are loaded when running locally.
loadEnv({ path: ".env" });
if (process.env.NODE_ENV === "production") {
  loadEnv({ path: ".env.production" });
}

function buildDataSource() {
  const {
    DATABASE_HOST = "localhost",
    DATABASE_PORT = "5432",
    DATABASE_URL,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME,
    NODE_ENV,
  } = process.env;

  if (
    !DATABASE_URL &&
    (!DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME)
  ) {
    throw new Error(
      "Database credentials are missing. Provide DATABASE_URL or DATABASE_USER, DATABASE_PASSWORD and DATABASE_NAME."
    );
  }

  const connectionOptions = DATABASE_URL
    ? {
        type: "postgres" as const,
        url: DATABASE_URL,
      }
    : {
        type: "postgres" as const,
        host: DATABASE_HOST,
        port: Number(DATABASE_PORT),
        username: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_NAME,
      };

  const dataSource = new DataSource({
    ...connectionOptions,
    entities,
    synchronize: false,
    logging: NODE_ENV === "development",
  });
  if (NODE_ENV === "development") {
    console.log("[db] Initializing datasource with entities:", entities);
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
