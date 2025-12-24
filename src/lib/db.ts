import "reflect-metadata";
import { config as loadEnv } from "dotenv";
import { DataSource } from "typeorm";
import { environment } from "@/utils/environment";
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
if (environment.isProduction || environment.isStaging) {
  const envFile = environment.isProduction ? ".env.production" : ".env.staging";
  loadEnv({ path: envFile });
}

function buildDataSource() {
  const {
    url: DATABASE_URL,
    host: DATABASE_HOST = "localhost",
    port: DATABASE_PORT = 5432,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    name: DATABASE_NAME,
    ssl,
  } = environment.database;

  if (!DATABASE_URL && (!DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME)) {
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

  const sslConfig = ssl.enabled
    ? { rejectUnauthorized: ssl.rejectUnauthorized }
    : undefined;

  const dataSource = new DataSource({
    ...connectionOptions,
    ...(sslConfig ? { ssl: sslConfig } : {}),
    entities,
    synchronize: false,
    logging: environment.isDevelopment,
  });
  if (environment.isDevelopment) {
    console.log("[db] Initializing datasource with entities:", entities);
  }
  return dataSource;
}

const globalDataSource = globalThis.__serviceDataSource ?? buildDataSource();

if (!environment.isProduction && !environment.isStaging) {
  globalThis.__serviceDataSource = globalDataSource;
}

export async function getDataSource(): Promise<DataSource> {
  if (!globalDataSource.isInitialized) {
    await globalDataSource.initialize();
  }
  return globalDataSource;
}
