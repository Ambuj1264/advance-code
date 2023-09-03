import type { Http2ServerRequest } from "http2";
import type { IncomingMessage } from "http";

import type { FastifyReply } from "fastify";
import type { FastifyRequest } from "fastify/types/request";
import type { FastifyRequestType } from "fastify/types/type-provider";

import { SupportedLanguages } from "../types/enums";

import MarketplaceSpecificRequestHeaders from "./marketplaceSpecificRequestHeaders";

if (process.env.NODE_ENV !== "production" || !process.env.RUNTIME_ENV) {
  // eslint-disable-next-line global-require
  require("dotenv").config();
}

export const hostToOriginMap = {
  "guidetoiceland.is": "origin.guidetoiceland.is",
  "cn.guidetoiceland.is": "origin.guidetoiceland.is",
  "guidetoeurope.com": "origin.guidetoeurope.com",
  "guidetothephilippines.ph": "origin.guidetothephilippines.ph",
  "iceland-photo-tours.com": "origin.iceland-photo-tours.com",
  "norwaytravelguide.no": "origin.norwaytravelguide.no",
  "staging.guidetoiceland.is": "origin.staging.guidetoiceland.is",
  "staging.guidetoeurope.com": "origin.staging.guidetoeurope.com",
};

export const getEnv = () => process.env;

export const getEnvWithDefaults = () => {
  const {
    RUNTIME_ENV = "",
    NODE_ENV = "",
    CLIENT_API_URI = "guidetoiceland.is",
    CLIENT_API_PROTOCOL = "https",
    PORT = 3000,
    NEXTJS_DIR = ".",
    BAZEL_TARGET,
    INTERNAL_CLIENTAPI_URI,
    HTTPS_ENABLED,
    APP_VERSION,
    COMMIT,
    SENTRY_DSN,
    ALLOW_INDEXING,
    SERVICE_WORKER_DEV_MODE,
    USER_SERVICE_URI = "https://master-service-user.external.prod.gcptravelshift.com",
  } = getEnv();

  return {
    RUNTIME_ENV,
    NODE_ENV,
    CLIENT_API_URI,
    CLIENT_API_PROTOCOL,
    PORT: Number(PORT),
    NEXTJS_DIR,
    BAZEL_TARGET,
    INTERNAL_CLIENTAPI_URI,
    HTTPS_ENABLED,
    APP_VERSION,
    COMMIT,
    SENTRY_DSN,
    ALLOW_INDEXING,
    SERVICE_WORKER_DEV_MODE,
    USER_SERVICE_URI,
  };
};

export const isDev = () => {
  const { NODE_ENV } = getEnvWithDefaults();
  return NODE_ENV !== "production";
};

export const getSentryOpts = () => {
  const { NODE_ENV, RUNTIME_ENV, SENTRY_DSN, COMMIT, APP_VERSION } = getEnvWithDefaults();
  return {
    environment: NODE_ENV === "production" && RUNTIME_ENV === "dev" ? "development" : "production",
    dsn: SENTRY_DSN,
    release: COMMIT || APP_VERSION,
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
};

export const setRawHeaders = (reply: FastifyReply) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [headerName, headerValue] of Object.entries(reply.getHeaders())) {
    if (headerValue) {
      reply.raw.setHeader(headerName, headerValue);
    }
  }
};

export const rewriteDevCookieDomain = (
  req: Http2ServerRequest | IncomingMessage | undefined,
  cookieHeaderValue: string
) => {
  const hostKeyIdx = req?.rawHeaders.findIndex(h => h.toLowerCase() === "host");
  const rawHost = hostKeyIdx && hostKeyIdx !== -1 ? req?.rawHeaders[hostKeyIdx + 1] : undefined;
  return !req
    ? cookieHeaderValue
    : cookieHeaderValue.replace(
        /(domain=)(.+);|(domain=)(.+)$/,
        `$1${
          new URL(rawHost || req.headers.origin || req.headers.referer || "http://localhost")
            .hostname
        };`
      );
};

export const isDevGTICn = (dev: boolean, request: FastifyRequest) => {
  if (!dev) return false;

  const { CLIENT_API_URI, RUNTIME_ENV } = getEnvWithDefaults();

  const isDevCn =
    RUNTIME_ENV !== "prod" &&
    CLIENT_API_URI.endsWith("guidetoiceland.is") &&
    ((request.headers[MarketplaceSpecificRequestHeaders.URL_FRONT] as string)?.includes("cn.") ||
      request.hostname.includes("cn."));

  if (isDevCn) {
    // we emulate what fastly does on prod here
    // eslint-disable-next-line functional/immutable-data
    request.headers[MarketplaceSpecificRequestHeaders.MARKETPLACE] = "guidetoiceland.is";
    // eslint-disable-next-line functional/immutable-data
    request.headers[MarketplaceSpecificRequestHeaders.LOCALE] = SupportedLanguages.Chinese;
  }

  return isDevCn;
};

export const getHostHeader = (
  request: IncomingMessage | Http2ServerRequest | FastifyRequestType<any, any, any, any>,
  defaultValue?: string
): string => {
  return (
    (request.headers[MarketplaceSpecificRequestHeaders.MARKETPLACE] as string) ||
    (defaultValue ?? request.headers.host)
  );
};
