import type { IncomingHttpHeaders, IncomingMessage, Server, ServerResponse } from "http";
import URL from "node:url";
import type { Http2ServerRequest, IncomingHttpHeaders as Http2IncomingHttpHeaders } from "http2";

import type { FastifyBaseLogger, FastifyPlugin, RawRequestDefaultExpression } from "fastify";
import type { RouteHandlerMethod, RouteOptions } from "fastify/types/route";
import type { FastifyHttpProxyOptions } from "@fastify/http-proxy";
import i18nextMiddleware from "i18next-http-middleware";
import type { NextUrlWithParsedQuery } from "next/dist/server/request-meta";
import type { FastifyRequestType, FastifyTypeProviderDefault } from "fastify/types/type-provider";
import type { FastifyInstance } from "fastify/types/instance";
import type { RawReplyDefaultExpression } from "fastify/types/utils";
import fastifyProxy from "@fastify/http-proxy";
import { RawServerDefault } from "fastify/types/utils";

import routes from "../shared/routes";
import { i18next } from "../shared/i18n";
import { SupportedLanguages } from "../types/enums";

import {
  getEnvWithDefaults,
  getHostHeader,
  hostToOriginMap,
  isDevGTICn,
  rewriteDevCookieDomain,
  setRawHeaders,
} from "./serverUtils";
import type { CustomHandlerType } from "./getFastifyServer";
import { replyFromProxyOptions } from "./serverConstants";
import MarketplaceSpecificRequestHeaders from "./marketplaceSpecificRequestHeaders";

export type FastifyRouteHandlerType<T = {}> = RouteHandlerMethod<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  T
>;
export type FastifyServerType = FastifyInstance<
  Server,
  RawRequestDefaultExpression<Server>,
  RawReplyDefaultExpression<Server>,
  FastifyBaseLogger,
  FastifyTypeProviderDefault
> &
  PromiseLike<
    FastifyInstance<
      Server,
      RawRequestDefaultExpression<Server>,
      RawReplyDefaultExpression<Server>,
      FastifyBaseLogger,
      FastifyTypeProviderDefault
    >
  >;

const { RUNTIME_ENV, APP_VERSION } = getEnvWithDefaults();

export const hidePoweredBy: FastifyPlugin<{}> = (app, _opts, next) => {
  app.addHook("onSend", (_request, reply, _payload, nextOnSend) => {
    reply.removeHeader("X-Powered-By");
    nextOnSend();
  });

  next();
};

// export const devErrorPrint: FastifyPlugin<{}> = (app, _opts, next) => {
//   app.addHook("onError", (_request, reply, error, done) => {
//     reply.status(500);
//     done()
//   });
//
//   next();
// };

export const healthCheck: FastifyRouteHandlerType = (_request, reply) => {
  reply.status(200).send();
};

export const getProxyToServiceOpts = (
  upstream: string,
  prefix: string,
  constraints?: { [key: string]: string | boolean | RegExp },
  rewriteRequestHeaders?:
    | ((
        req: IncomingMessage | Http2ServerRequest,
        headers: IncomingHttpHeaders | Http2IncomingHttpHeaders
      ) => IncomingHttpHeaders | Http2IncomingHttpHeaders)
    | undefined
): FastifyHttpProxyOptions => ({
  ...replyFromProxyOptions,
  prefix,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  upstream,
  rewritePrefix: "",
  constraints,
  replyOptions: {
    rewriteRequestHeaders: (req, headers) => {
      const originalHeaders = req.headers;
      const { referer } = req.headers;
      const cbHeaders = rewriteRequestHeaders ? rewriteRequestHeaders(req, headers) : null;

      return {
        ...originalHeaders,
        ...(!referer
          ? {
              referer: getHostHeader(req),
            }
          : null),
        ...cbHeaders,
      };
    },
  },
});

export const getProxyToOriginOpts = (
  prefix: string,
  originUpstreamHost: string,
  constraints: { [key: string]: string | boolean | RegExp },
  customRewriteHeaders?: (
    headers: Http2IncomingHttpHeaders | IncomingHttpHeaders,
    req?: Http2ServerRequest | IncomingMessage
  ) => Http2IncomingHttpHeaders | IncomingHttpHeaders
): FastifyHttpProxyOptions => {
  const originUrl = `https://${originUpstreamHost}`;
  const hostFromOrigin = originUpstreamHost.replace("origin.", "");
  const urlFront = `https://${hostFromOrigin}`;

  return {
    ...replyFromProxyOptions,
    prefix,
    rewritePrefix: prefix,
    upstream: originUrl,
    constraints,
    replyOptions: {
      rewriteRequestHeaders: (req, headers) => {
        const hostHeader = getHostHeader(req, hostFromOrigin);
        const isGTICn =
          req.headers[MarketplaceSpecificRequestHeaders.MARKETPLACE] === "guidetoiceland.is" &&
          req.headers[MarketplaceSpecificRequestHeaders.LOCALE] ===
            SupportedLanguages.LegacyChinese;

        const { referer } = req.headers;
        return {
          ...headers,
          ...(!referer ? { referer: getHostHeader(req) } : null),
          host: hostHeader,
          [MarketplaceSpecificRequestHeaders.URL_FRONT]: urlFront,
          // we need to send this header to monolith in case of cn. subdomain,
          // because monolith does not know about this subdomain
          ...(isGTICn ? { "Force-Locale": SupportedLanguages.Chinese } : null),
        };
      },
      // rewriteHeaders = rewriteResponseHeaders
      rewriteHeaders: (headers, req) => {
        const resultHeaders = headers;
        // override set-cookie domain for dev envs
        if (RUNTIME_ENV !== "prod") {
          const setCookieheaders = resultHeaders["set-cookie"];
          if (Array.isArray(setCookieheaders)) {
            // eslint-disable-next-line functional/immutable-data
            resultHeaders["set-cookie"] = setCookieheaders.map(cookieHeader =>
              rewriteDevCookieDomain(req, cookieHeader)
            );
          } else if (setCookieheaders) {
            // eslint-disable-next-line functional/immutable-data
            resultHeaders["set-cookie"] = [rewriteDevCookieDomain(req, setCookieheaders)];
          }
        }

        return customRewriteHeaders ? customRewriteHeaders(resultHeaders, req) : resultHeaders;
      },
    },
  };
};

export const serveSwStatic: FastifyRouteHandlerType = (_request, reply) => {
  reply.header("Service-Worker-Allowed", "/");
  reply.header("x-0-surrogate-key", `static sw ${APP_VERSION}`);
  reply.sendFile("sw.js");
};

export const getNextStaticHandler: (nextHandler: CustomHandlerType) => RouteOptions["handler"] =
  nextHandler => (request, reply) => {
    reply.header("Cache-Control", "public, max-age=31557600");
    reply.header("x-0-surrogate-key", `static ${APP_VERSION}`);
    setRawHeaders(reply);
    reply.hijack();
    nextHandler(request.raw, reply.raw);
  };

const i18nextHandler = i18nextMiddleware.handle(i18next, {
  removeLngFromUrl: false,
});

export const getNextRouteHandler: (
  routeHandler: CustomHandlerType,
  dev: boolean
) => RouteHandlerMethod<Server<typeof IncomingMessage, typeof ServerResponse>> =
  (routeHandler, dev) => (request, reply) => {
    const parsedReq = request.urlData();
    reply.removeHeader("X-Powered-By");
    // eslint-disable-next-line functional/immutable-data
    request.headers["x-travelshift-env"] = `${process.env.RUNTIME_ENV}`;

    // add affiliate cookie
    const affiliate = (request as FastifyRequestType<unknown, { a?: string }>).query.a;
    if (affiliate) {
      reply.header("set-cookie", `gti_affiliate=${affiliate}; path=/`);
    }

    // redirect from trailing slash
    if (parsedReq.path && parsedReq.path.length > 1 && parsedReq.path?.endsWith("/")) {
      const redirectTo =
        parsedReq.path.slice(0, -1) + (parsedReq.query?.length ? parsedReq.query : "");
      if (redirectTo) reply.redirect(301, redirectTo);
    }

    // GTI cn fix
    // for cn. subdomain we hide /zh/ path for user
    // custom request headers x-ts-locale and x-ts-marketplace are set in fastly VCL (Set x-travelshift-url-front snippet)
    // https://manage.fastly.com/configure/services/lXSWJKHuOLN5md28xlwFh6/versions/54/snippets
    let reqPath = parsedReq.path || "";
    const isGTICn =
      request.headers[MarketplaceSpecificRequestHeaders.MARKETPLACE] === "guidetoiceland.is" &&
      request.headers[MarketplaceSpecificRequestHeaders.LOCALE] === SupportedLanguages.Chinese;
    if (isGTICn || isDevGTICn(dev, request)) {
      // eslint-disable-next-line functional/immutable-data
      request.raw.url = request.url.replace(/\//, `/${SupportedLanguages.Chinese}/`);
      reqPath = `/${SupportedLanguages.Chinese}/${reqPath}`.replace("//", "/");
      // eslint-disable-next-line functional/immutable-data
      request.raw.headers[MarketplaceSpecificRequestHeaders.URL_FRONT] = `https://${
        request.headers[MarketplaceSpecificRequestHeaders.MARKETPLACE]
      }`;
      // eslint-disable-next-line functional/immutable-data
      request.raw.headers["Force-Locale"] = SupportedLanguages.Chinese;
    }

    // copy headers from fastify request to original request
    setRawHeaders(reply);
    // working with a raw request
    reply.hijack();

    // ts fix
    const req: typeof request & { raw: typeof request["raw"] & { lng?: string | string[] } } =
      request;
    const { i18n } = routes.matchLocale(isGTICn ? request.raw.url : request.url);

    // required for i18next (request.lng)
    // eslint-disable-next-line functional/immutable-data
    req.raw.lng =
      i18n.locale === SupportedLanguages.Chinese ? SupportedLanguages.LegacyChinese : i18n.locale;

    // adding lang param since it's not matched in a route itself
    // eslint-disable-next-line functional/immutable-data
    (request.params as { lang?: string | string[] }).lang = req.raw.lng;

    // construct next URL object
    const { scheme, host } = parsedReq;
    const urlData = URL.parse(`${scheme}://${host}${reqPath}`);
    const urlWithQuery: NextUrlWithParsedQuery = {
      ...urlData,
      hostname: request.hostname,
      path: reqPath,
      protocol: request.protocol,
      query: { ...(request.params as object), ...(request.query as object), i18n: i18n as never },
    };

    // @ts-ignore
    i18nextHandler(req.raw, reply.raw, async () => {
      await routeHandler(request.raw, reply.raw, urlWithQuery);
    });
  };

export const applyLegacyCommonProxies = (
  server: FastifyServerType,
  origin: typeof hostToOriginMap[keyof typeof hostToOriginMap],
  hostConstraint: { travelshiftHost: string | RegExp }
) => {
  const toursBookRewriteHeaders: Parameters<typeof getProxyToOriginOpts>[3] = (headers, req) => {
    // Add to cart for tours on monolith works using POST request, so we need to change location for our dev branches.
    if (req && RUNTIME_ENV !== "prod") {
      return { ...headers, location: `${req.headers.origin}/cart` };
    }
    return headers;
  };

  server
    .register(fastifyProxy, getProxyToOriginOpts("/api", origin, hostConstraint))
    .register(fastifyProxy, getProxyToOriginOpts(`/:lang/api`, origin, hostConstraint))
    .register(fastifyProxy, getProxyToOriginOpts("/currency/list", origin, hostConstraint))
    .register(fastifyProxy, getProxyToOriginOpts(`/:lang/currency/list`, origin, hostConstraint))
    .register(fastifyProxy, getProxyToOriginOpts("/itinerary", origin, hostConstraint))
    .register(fastifyProxy, getProxyToOriginOpts("/accommodation-hotels", origin, hostConstraint))
    .register(fastifyProxy, getProxyToOriginOpts("/cart/payment_process", origin, hostConstraint))
    // proxy legacy assets (used on monolith pages)
    .register(fastifyProxy, getProxyToOriginOpts("/res", origin, hostConstraint))
    .register(fastifyProxy, getProxyToOriginOpts("/inc", origin, hostConstraint))
    .register(fastifyProxy, getProxyToOriginOpts("/image", origin, hostConstraint))
    .register(fastifyProxy, getProxyToOriginOpts("/favicon", origin, hostConstraint))
    .register(
      fastifyProxy,
      getProxyToOriginOpts("/process/tours", origin, hostConstraint, toursBookRewriteHeaders)
    )
    .register(
      fastifyProxy,
      getProxyToOriginOpts(`/:lang/process/tours`, origin, hostConstraint, toursBookRewriteHeaders)
    );
  return server;
};
