type AppEnvironment = "development" | "production" | "staging";

const resolveEnvironment = (value?: string | null): AppEnvironment => {
  const normalized = value?.toLowerCase();

  if (normalized === "production") {
    return "production";
  }

  if (normalized === "staging") {
    return "staging";
  }

  return "development";
};

const nodeEnv = resolveEnvironment(process.env.APP_ENV ?? process.env.NODE_ENV);
console.log("nodeEnv", nodeEnv);
const buildFlags = {
  nodeEnv,
  isDevelopment: nodeEnv === "development",
  isProduction: nodeEnv === "production",
  isStaging: nodeEnv === "staging",
} as const;

const defaultApiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (buildFlags.isDevelopment ? "http://localhost:4000/api/v1" : "");

export const environment = {
  ...buildFlags,
  apiBaseUrl: defaultApiBase,
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL ?? "",
  cookieName: process.env.NEXT_PUBLIC_COOKIE_NAME ?? "access_token",
  cookies: {
    name: process.env.COOKIE_NAME ?? "access_token",
    domain: process.env.COOKIE_DOMAIN ?? undefined,
  },
  security: {
    joseSecret: process.env.JOSE_SECRET ?? "super_secret_key_here_change_me",
    tokenExpiresIn: process.env.TOKEN_EXPIRES_IN ?? "1d",
  },
  integrations: {
    dvla: {
      apiKey: process.env.DVLA_API_KEY,
      apiUrl:
        process.env.DVLA_API ??
        "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
    },
  },
  database: (() => {
    const rawDatabaseUrl = process.env.DATABASE_URL;
    const hasProtocol = Boolean(rawDatabaseUrl?.includes("://"));
    const useConnectionUrl = hasProtocol && rawDatabaseUrl;
    const hostFallback = rawDatabaseUrl && !hasProtocol ? rawDatabaseUrl : undefined;
    const resolvedHost = hostFallback ?? process.env.DATABASE_HOST;
    const useDiscreteSettings = !useConnectionUrl;
    const sslEnabled = process.env.DATABASE_SSL === "true";

    return {
      url: useConnectionUrl ?? undefined,
      host: useDiscreteSettings ? resolvedHost : undefined,
      port: useDiscreteSettings
        ? Number(process.env.DATABASE_PORT || "5432")
        : undefined,
      user: useDiscreteSettings ? process.env.DATABASE_USER : undefined,
      password: useDiscreteSettings ? process.env.DATABASE_PASSWORD : undefined,
      name: useDiscreteSettings ? process.env.DATABASE_NAME : undefined,
      ssl: sslEnabled
        ? {
            enabled: true,
            rejectUnauthorized:
              process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
          }
        : { enabled: false },
    };
  })(),
} as const;
console.log("environment", environment);
if (typeof window === "undefined") {
  console.info(
    `[env] Active environment: ${nodeEnv}. API base: ${
      environment.apiBaseUrl || "not configured"
    }`
  );
}
