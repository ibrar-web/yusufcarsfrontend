import { config as loadEnvFile } from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const baseEnvPath = path.join(projectRoot, ".env");

if (existsSync(baseEnvPath)) {
  loadEnvFile({ path: baseEnvPath });
}

const resolvedAppEnv = (
  process.env.APP_ENV ||
  process.env.NODE_ENV ||
  "development"
).toLowerCase();

const envFileName =
  resolvedAppEnv === "production"
    ? ".env.production"
    : resolvedAppEnv === "staging"
      ? ".env.staging"
      : ".env";

const envFilePath = path.join(projectRoot, envFileName);

if (envFileName !== ".env" && existsSync(envFilePath)) {
  loadEnvFile({ path: envFilePath, override: true });
  console.info(`[env] Loaded ${envFileName} for APP_ENV=${resolvedAppEnv}`);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Enable experimental features if needed
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
