import * as Sentry from "@sentry/node";
import getConfig from "next/config";

const { SENTRY_DSN, COMMIT, NODE_ENV, RUNTIME_ENV } = (getConfig() || { publicRuntimeConfig: {} })
  .publicRuntimeConfig;

const nodeEnv = NODE_ENV || process.env.NODE_ENV;
const runtimeEnv = RUNTIME_ENV || process.env.RUNTIME_ENV;

const sentryOptions = {
  environment: nodeEnv === "production" && runtimeEnv === "dev" ? "development" : "production",
  dsn: SENTRY_DSN || process.env.SENTRY_DSN,
  release: COMMIT || process.env.COMMIT,
  maxBreadcrumbs: 50,
  attachStacktrace: true,
  maxValueLength: 10000000,
  ignoreErrors: [
    // "Network request failed",
    // "Failed to fetch",
    // "NetworkError",
    // "TLS connection",
    "ECONNRESET",
  ],
};

Sentry.init(sentryOptions);
