/* eslint-disable @typescript-eslint/no-use-before-define */
import path from "path";
import type { IncomingMessage, Server, ServerResponse } from "http";

import "isomorphic-unfetch";
import fastifyCompressionPlugin from "@fastify/compress";
import fastifySentryPlugin from "@immobiliarelabs/fastify-sentry";
import fastifyStaticPlugin from "@fastify/static";
import fastifyProxy from "@fastify/http-proxy";
import fastifyReplyFrom from "@fastify/reply-from";
import fastifyUrlData from "@fastify/url-data";
import fastify from "fastify";
// eslint-disable-next-line import/no-extraneous-dependencies
import acceptHostStrategy from "find-my-way/lib/strategies/accept-host";
import pino from "pino";
// eslint-disable-next-line import/no-extraneous-dependencies
import type { ConstraintStrategy, Handler, HTTPVersion } from "find-my-way";
import type { Express } from "express";
import type { BaseNextRequest, BaseNextResponse } from "next/dist/server/base-http";
import type { NextUrlWithParsedQuery } from "next/dist/server/request-meta";
import type { HTTPMethods } from "fastify/types/utils";

import { Marketplace, SupportedLanguages } from "../types/enums";
import {
  getCorrectCountryUrl,
  getUnsupportedLangRedirect,
  stripAmpFromUrl,
  stripWwwFromHost,
} from "../utils/commonServerUtils";
import { hreflangLocalesByMarketplace } from "../components/ui/LandingPages/utils/hreflangLocalesByMarketplace";

import {
  getEnvWithDefaults,
  getHostHeader,
  getSentryOpts,
  hostToOriginMap,
  isDevGTICn,
} from "./serverUtils";
import * as handlers from "./serverSharedHandlers";
import {
  applyLegacyCommonProxies,
  FastifyRouteHandlerType,
  getProxyToOriginOpts,
} from "./serverSharedHandlers";
import {
  legacyGTIMonolithProxyRoutes,
  legacyGTTPMonolithProxyRoutes,
  legacyIPTMonolithProxyRoutes,
  legacyNTGMonolithProxyRoutes,
  replyFromProxyOptions,
} from "./serverConstants";
import { isDebugRequest } from "./isDebugRequest";
import MarketplaceSpecificRequestHeaders from "./marketplaceSpecificRequestHeaders";
import { getDevHttpsOptions } from "./getDevHttpsOptions";

const {
  INTERNAL_CLIENTAPI_URI,
  CLIENT_API_PROTOCOL,
  HTTPS_ENABLED,
  CLIENT_API_URI,
  RUNTIME_ENV,
  USER_SERVICE_URI,
} = getEnvWithDefaults();

const isStagingOrDevBranch = RUNTIME_ENV !== "prod";
const isRuntimeProd = RUNTIME_ENV === "prod";

export type CustomHandlerType = (
  req: IncomingMessage | BaseNextRequest<any>,
  res: ServerResponse<IncomingMessage> | BaseNextResponse<any>,
  urlObject?: NextUrlWithParsedQuery
) => void;

const ampRegex = /(\?|&)amp=(1|true)/;
const orderRegex = /(\?|&)order=/;

const createFastifyServer = (nextHandler: CustomHandlerType, dev: boolean) => {
  // https://travelshift.slite.com/app/docs/5OD_FArcZmnA5o
  const isDevHttps = dev && HTTPS_ENABLED === "true";

  let devServer: Express;

  const server = fastify({
    logger: {
      serializers: {
        req(req) {
          if (isDebugRequest(req)) {
            return {
              method: req.method,
              path: req.routerPath,
              url: req.url,
              hostname: req.hostname,
              remoteAddress: req.ip,
              remotePort: req.socket ? req.socket.remotePort : undefined,
              parameters: req.params,
              headers: JSON.stringify(req.headers, null, 2),
            };
          }

          return {
            method: req.method,
            url: req.url,
            hostname: req.hostname,
            remoteAddress: req.ip,
            remotePort: req.socket ? req.socket.remotePort : undefined,
          };
        },
        err: pino.stdSerializers.err,
        res: function asResValue(reply) {
          return {
            statusCode: reply.statusCode,
          };
        },
      },
    },
    // fix next HMR on localhost
    // next websocket works only with express, haven't fond a way without it
    ...(dev
      ? {
          serverFactory: (
            fastifyHandler: (request: IncomingMessage, response: ServerResponse) => void
          ) => {
            // eslint-disable-next-line global-require,import/no-extraneous-dependencies
            const express = require("express");
            devServer = express();
            // !! do not add any new rules here, next/static is used only because of the next HMR in dev mode
            devServer.use(/\/_next\/static/, (req, res, next) => {
              return express.static(path.join(__dirname, "./../../static"))(req, res, next);
            });
            devServer.use(/\/_next/, (req, res) => {
              nextHandler(req, res);
            });
            devServer.use(fastifyHandler);

            return devServer as unknown as Server<typeof IncomingMessage, typeof ServerResponse>;
          },
        }
      : null),
    ...(process.env.HOST_IP
      ? {
          trustProxy: [process.env.HOST_IP],
        }
      : null),
    // allow https on localhost
    ...(isDevHttps
      ? {
          https: {
            allowHTTP1: true,
            ...getDevHttpsOptions(),
          },
        }
      : null),
    constraints: {
      travelshiftHost: {
        name: "travelshiftHost",
        storage: acceptHostStrategy.storage,
        deriveConstraint: req => {
          const urlFront =
            (req.headers[MarketplaceSpecificRequestHeaders.MARKETPLACE] as string) ||
            (req.headers[MarketplaceSpecificRequestHeaders.URL_FRONT] as string | null)?.replace(
              /.+:\/\//,
              ""
            );
          if (dev || isStagingOrDevBranch) {
            return urlFront || CLIENT_API_URI;
          }
          return urlFront || req.headers.host;
        },
        validate: acceptHostStrategy.validate,
        mustMatchWhenDerived: false,
      },
      queryIsPassthrough: {
        ...constructQueryParamConstraint("queryIsPassthrough"),
        deriveConstraint: (req: IncomingMessage) => {
          return !!req.url?.endsWith("isPassthrough=1");
        },
      },
      queryOrder: {
        ...constructQueryParamConstraint("queryOrder"),
        deriveConstraint: (req: IncomingMessage) => {
          return req.url ? orderRegex.test(req.url) : false;
        },
      },
      queryAmp: {
        ...constructQueryParamConstraint("queryAmp"),
        deriveConstraint: (req: IncomingMessage) => {
          return req.url ? ampRegex.test(req.url) : false;
        },
      },
    },
  });

  return {
    devServer: devServer!,
    server,
    isDevHttps,
  };
};

const routeMethods: HTTPMethods[] = ["GET", "POST", "OPTIONS", "HEAD"];

const getFastifyServer = (
  dev: boolean,
  nextHandler: CustomHandlerType,
  routeHandler: CustomHandlerType = nextHandler
) => {
  const { server, devServer, isDevHttps } = createFastifyServer(nextHandler, dev);
  const isProd = !dev;

  server.register(handlers.hidePoweredBy);
  server.register(fastifyReplyFrom);
  server.register(fastifyUrlData);

  // attach additional request content type handlers, which are used on proxy pages by doing nothing - passthrough
  // otherwise fastify throws unsupported media type error
  server.addContentTypeParser(
    ["application/x-www-form-urlencoded", "multipart/form-data"],
    (_req, payload, done) => {
      done(null, payload);
    }
  );

  if (isProd) {
    server.register(fastifySentryPlugin, getSentryOpts());
  } else {
    // on production, compression is handled by CDN
    server.register(fastifyCompressionPlugin, {
      global: true,
      encodings: ["deflate", "gzip"],
    });
  }

  // region static
  // for local development, we serve static assets from web server

  if (dev || !RUNTIME_ENV) {
    server.register(fastifyStaticPlugin, {
      root: [path.join(__dirname, "./../../static"), path.join(__dirname, "./../../.next/static")],
      setHeaders: res => {
        res.setHeader("x-0-surrogate-key", "static static-js");
      },
      prefix: "/_next/static/",
    });
    server.register(fastifyStaticPlugin, {
      root: [path.join(__dirname, "./../../fonts")],
      prefix: "/fonts/",
      setHeaders: res => {
        res.setHeader("x-0-surrogate-key", "static static-fonts");
      },
      decorateReply: false,
    });
  } else {
    server.register(fastifyStaticPlugin, {
      root: [path.join(__dirname, "./../static")],
      setHeaders: res => {
        res.setHeader("x-0-surrogate-key", "static static-js");
      },
      // this path is not used in the app, we use this middleware for reply.sendFile
      prefix: "/travelshift_next_static/",
    });
  }

  // for prod and branch deployments, we serve static from the same domain, by proxying to s3
  if (isProd && RUNTIME_ENV) {
    const assetsS3Upstream = `https://assets.web.${RUNTIME_ENV}.tshiftcdn.com`;
    server.register(fastifyProxy, {
      ...replyFromProxyOptions,
      prefix: "/_next/static/",
      rewritePrefix: "/_next/static/",
      upstream: assetsS3Upstream,
    });
    server.register(fastifyProxy, {
      ...replyFromProxyOptions,
      prefix: "/fonts/",
      rewritePrefix: "/fonts/",
      upstream: assetsS3Upstream,
    });
  }
  // endregion static

  // region clientapi
  if (dev || INTERNAL_CLIENTAPI_URI) {
    server.register(
      fastifyProxy,
      INTERNAL_CLIENTAPI_URI
        ? handlers.getProxyToServiceOpts(INTERNAL_CLIENTAPI_URI, "/client-api")
        : // this below is used on localhost for development
          {
            ...replyFromProxyOptions,
            prefix: "/client-api",
            rewritePrefix: "/client-api",
            upstream: `${CLIENT_API_PROTOCOL}://${CLIENT_API_URI}`,
          }
    );
  }
  // endregion clientapi

  // region misc routes
  server.get("/healthz", { schema: { response: { 200: {} } } }, handlers.healthCheck);

  server.get("/sw.js", handlers.serveSwStatic);

  // redirect www
  server.route({
    method: routeMethods,
    url: "*",
    handler: (request, reply) => {
      const nonWwwHost = stripWwwFromHost(getHostHeader(request));
      reply.redirect(301, `${request.protocol}://${nonWwwHost}${request.url}`);
    },
    constraints: constructHostConstraint(/^www\./),
  });
  // redirect AMP pages
  server.route({
    method: routeMethods,
    url: "*",
    handler: (request, reply) => {
      const nonAmpUrl = stripAmpFromUrl(request.url);
      reply.redirect(301, nonAmpUrl);
    },
    constraints: {
      queryAmp: true,
    },
  });
  // endregion misc routes

  // region marketplace routes
  applyGTIRoutes(server, dev);
  applyGTERoutes(server, dev);
  if (isStagingOrDevBranch || dev) {
    applyGTIRoutes(server, dev, "staging.guidetoiceland.is");
    applyGTERoutes(server, dev, "staging.guidetoeurope.com");
  }
  applyIPTRoutes(server, dev);
  applyNTGRoutes(server);
  applyGTTPRoutes(server, dev);
  // endregion marketplace routes

  // region next routing
  const nextStaticHandler = handlers.getNextStaticHandler(nextHandler);
  server.route({
    method: "GET",
    url: "/zh/_next/*",
    onRequest: (request, _reply, done) => {
      // eslint-disable-next-line functional/immutable-data
      request.raw.url = request.raw.url?.replace(/^\/zh/, "");
      done();
    },
    handler: nextStaticHandler,
  });

  server.get("/_next/*", nextStaticHandler);

  server.route({
    method: routeMethods,
    url: "*",
    handler: handlers.getNextRouteHandler(routeHandler, dev),
  });
  // fix for legacy route which is clashing with proxy route
  // https://github.com/GuideToIceland/monorepo/blob/ef697c507931af1a1c6dd881fd222690f3f1db89/src/js/web/src/shared/tourRoutes.ts#L18-L18
  server.route({
    method: routeMethods,
    url: "/process/tours/search",
    handler: handlers.getNextRouteHandler(routeHandler, dev),
  });
  server.route({
    method: routeMethods,
    url: "/:lang/process/tours/search",
    handler: handlers.getNextRouteHandler(routeHandler, dev),
  });
  // endregion next routing

  return {
    server,
    devServer,
    isDevHttps,
  };
};

type serverType = ReturnType<typeof createFastifyServer>["server"];

function applyGTIRoutes(
  server: serverType,
  dev: boolean,
  GTIHost: keyof typeof hostToOriginMap = "guidetoiceland.is"
) {
  const GTIOrigin = hostToOriginMap[GTIHost];
  // eslint-disable-next-line no-useless-escape,prettier/prettier
  const GTIHostRegexpStr = GTIHost.replace(/\./g, "\.");
  // eslint-disable-next-line no-useless-escape,prettier/prettier
  const gtiHostConstraint = constructHostConstraint(new RegExp(`^cn\.${GTIHostRegexpStr}|^${GTIHostRegexpStr}`));

  // proxy legacy apis and stuff
  applyLegacyCommonProxies(server, GTIOrigin, gtiHostConstraint);
  Object.values({ ...SupportedLanguages })
    .filter(
      lang =>
        lang !== SupportedLanguages.Chinese &&
        lang !== SupportedLanguages.Icelandic &&
        lang !== SupportedLanguages.English
    )
    .forEach(lang =>
      server.register(
        fastifyProxy,
        getProxyToOriginOpts(`/${lang}/api/v2`, GTIOrigin, gtiHostConstraint)
      )
    );

  // Allows cart page with query parameter ?isPassthrough to proxy to the monolith
  server.register(
    fastifyProxy,
    handlers.getProxyToOriginOpts("/cart", GTIOrigin, {
      ...gtiHostConstraint,
      queryIsPassthrough: true,
    })
  );
  // Temp fix for edit tour order to proxy to the monolith
  server.register(
    fastifyProxy,
    handlers.getProxyToOriginOpts("/book-holiday-trips", GTIOrigin, {
      ...gtiHostConstraint,
      queryOrder: true,
    })
  );

  if (RUNTIME_ENV === "prod") {
    const cnRedirectHandler: FastifyRouteHandlerType<{ Params: { lang: string } }> = (
      request,
      reply
    ) => {
      reply.redirect(
        301,
        `https://cn.guidetoiceland.is${request.url
          .replace(request.params.lang ? request.params.lang : /zh(_CN)?/, "/")
          .replace("//", "")}`
      );
    };
    // redirect ZH to CN subdomain
    server
      .route({
        method: routeMethods,
        url: "/:lang(^zh|^zh_CN)/*",
        handler: cnRedirectHandler,
        constraints: gtiHostConstraint,
      })
      .route({
        method: routeMethods,
        url: "/zh",
        handler: cnRedirectHandler,
        constraints: gtiHostConstraint,
      })
      .route({
        method: routeMethods,
        url: "/zh_CN",
        handler: cnRedirectHandler,
        constraints: gtiHostConstraint,
      });
    // redirect IS lang
    const isRedirectHandler: FastifyRouteHandlerType<{ Params: { lang: string } }> = (
      request,
      reply
    ) => {
      reply.redirect(301, `${request.url.replace(/is(\/)?/, "")}`);
    };
    server
      .route({
        method: routeMethods,
        url: "/is/*",
        handler: isRedirectHandler,
        constraints: gtiHostConstraint,
      })
      .route({
        method: routeMethods,
        url: "/is",
        handler: isRedirectHandler,
        constraints: gtiHostConstraint,
      });
  }

  const gtiLegacyPageHandler: FastifyRouteHandlerType = (request, reply) => {
    // custom request header x-ts-locale is set in fastly VCL (Set x-travelshift-url-front snippet)
    // https://manage.fastly.com/configure/services/lXSWJKHuOLN5md28xlwFh6/versions/54/snippets

    const isCN =
      request.headers[MarketplaceSpecificRequestHeaders.LOCALE] === SupportedLanguages.Chinese ||
      isDevGTICn(dev, request);
    reply.header("x-0-surrogate-key", "monolith");
    reply.from(`https://${GTIOrigin}${request.url}`, {
      ...replyFromProxyOptions,
      rewriteRequestHeaders: ({ headers }) => ({
        ...headers,
        host: GTIHost,
        ...(isCN ? { "Force-Locale": SupportedLanguages.Chinese } : null),
      }),
    });
  };
  legacyGTIMonolithProxyRoutes.map(route =>
    server.route({
      method: routeMethods,
      url: route,
      handler: gtiLegacyPageHandler,
      constraints: gtiHostConstraint,
    })
  );
}

function applyGTERoutes(
  server: serverType,
  dev: boolean,
  GTEHost: keyof typeof hostToOriginMap = "guidetoeurope.com"
) {
  const GTEOrigin = hostToOriginMap[GTEHost];
  const gteHostConstraint = constructHostConstraint(GTEHost);
  const sitemapS3Host = "assets.web.prod.tshiftcdn.com";

  // favicon
  server.get(
    "/res/global/img/favicons/default/favicon.ico",
    { constraints: gteHostConstraint },
    (_request, reply) => {
      reply.header("x-0-surrogate-key", "static");
      reply.sendFile("icons/gte-travelmarketplaces-com-favicon-16x16.png");
    }
  );

  // sitemap proxy to s3
  server.get<{ Params: { sitemapId: string } }>(
    "/sitemap-:sitemapId",
    { constraints: gteHostConstraint },
    (request, reply) => {
      reply.header("x-0-surrogate-key", "sitemap");
      reply.from(`https://${sitemapS3Host}/sitemaps/sitemap-${request.params.sitemapId}`, {
        rewriteRequestHeaders: ({ headers }) => ({
          ...headers,
          host: sitemapS3Host,
        }),
        rewriteHeaders: headers => {
          const { "set-cookie": _setCookie, ...headersNoCookie } = headers;
          return headersNoCookie;
        },
      });
    }
  );

  // auth proxy
  server.register(
    fastifyProxy,
    handlers.getProxyToServiceOpts(USER_SERVICE_URI, "/auth", gteHostConstraint)
  );

  // redirect unsupported langs
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const unsupportedGTELangs = Object.values({ ...SupportedLanguages }).filter(
    lang => !hreflangLocalesByMarketplace[Marketplace.GUIDE_TO_EUROPE]!.includes(lang)
  );
  // Filter out supported locales so we can view that on GTE
  const frontPageLangRedirectHandler: FastifyRouteHandlerType = (_request, reply) => {
    reply.redirect(302, "/");
  };
  const wildcardLangRedirectHandler: FastifyRouteHandlerType = async (request, reply) => {
    const redirectTo = await getUnsupportedLangRedirect(GTEHost, request.url);
    reply.redirect(302, redirectTo);
  };
  unsupportedGTELangs.forEach(lang => {
    server
      .route({
        method: routeMethods,
        url: `/${lang}`,
        handler: frontPageLangRedirectHandler,
        constraints: gteHostConstraint,
      })
      .route({
        method: routeMethods,
        url: `/${lang}/*`,
        handler: wildcardLangRedirectHandler,
        constraints: gteHostConstraint,
      });
  });

  // redirect wrong country urls
  const langsToRedirect = ["th", "zh", "ja", "ko", "ru", "fr"];
  const countriesToRedirect = [
    "macedonia",
    "north-macedonia",
    "netherlands",
    "united-kingdom",
    "channel-islands",
    "meilleure-voiture-de-location",
  ];
  const countryRedirectHandler: FastifyRouteHandlerType = async (request, reply) => {
    const correctCountryUrl = getCorrectCountryUrl(request.url);
    reply.redirect(301, correctCountryUrl);
  };
  const langsToRedirectRegex = `^${langsToRedirect.join("|^")}`;
  server.route({
    method: routeMethods,
    url: `/:lang(${langsToRedirectRegex})/:country(${`^${countriesToRedirect.join("|^")}`})/*`,
    handler: countryRedirectHandler,
    constraints: gteHostConstraint,
  });
  // fastify has a bug where last param cannot be regex param, it has to be static
  // only this way it matches, otherwise last regex param becomes optional
  countriesToRedirect.forEach(country =>
    server.route({
      method: routeMethods,
      url: `/:lang(${langsToRedirectRegex})/${country}`,
      handler: countryRedirectHandler,
      constraints: gteHostConstraint,
    })
  );

  // redirect article and attraction categories
  server.route({
    method: routeMethods,
    url: `/:match(^articles|^destinations-and-attractions)/*`,
    handler: (_request, reply) => {
      reply.redirect(302, "/");
    },
    constraints: gteHostConstraint,
  });

  // proxy legacy pages.
  // Pages list json is generated at build time, check out ./fetchFooterItems.js
  const requireFn = dev ? require : __non_webpack_require__; // eslint-disable-line camelcase
  const gteProxyPagesHandler: FastifyRouteHandlerType = (request, reply) => {
    reply.header("x-0-surrogate-key", "monolith");
    reply.from(`https://${GTEOrigin}${request.url}`, {
      ...replyFromProxyOptions,
      rewriteRequestHeaders: ({ headers }) => ({
        ...headers,
        host: GTEHost,
      }),
    });
  };
  requireFn("./gteProxyPages.json").map((route: string) =>
    server.route({
      method: routeMethods,
      url: route,
      handler: gteProxyPagesHandler,
      constraints: gteHostConstraint,
    })
  );

  // proxy legacy assets and stuff
  applyLegacyCommonProxies(server, GTEOrigin, gteHostConstraint);
}

function applyIPTRoutes(
  server: serverType,
  dev: boolean,
  IPTHost: keyof typeof hostToOriginMap = "iceland-photo-tours.com"
) {
  const IPTOrigin = hostToOriginMap[IPTHost];
  const iptHostConstraint = constructHostConstraint(IPTHost);

  applyLegacyCommonProxies(server, IPTOrigin, iptHostConstraint);

  // proxy legacy pages.
  // Pages list json is generated at build time, check out ./fetchFooterItems.js
  const requireFn = dev ? require : __non_webpack_require__; // eslint-disable-line camelcase
  const footerLegacyUrls = requireFn("./iptProxyPages.json");
  const iptLegacyPageHandler: FastifyRouteHandlerType = (request, reply) => {
    reply.header("x-0-surrogate-key", "monolith");
    reply.from(`https://${IPTOrigin}${request.url}`, {
      ...replyFromProxyOptions,
      rewriteRequestHeaders: ({ headers }) => ({
        ...headers,
        host: IPTHost,
      }),
    });
  };
  [...footerLegacyUrls, ...legacyIPTMonolithProxyRoutes].map((route: string) =>
    server.route({
      method: routeMethods,
      url: route,
      handler: iptLegacyPageHandler,
      constraints: iptHostConstraint,
    })
  );
}

function applyGTTPRoutes(
  server: serverType,
  dev: boolean,
  GTTPHost: keyof typeof hostToOriginMap = "guidetothephilippines.ph"
) {
  const GTTPOrigin = hostToOriginMap[GTTPHost];
  const gttpHostConstraint = constructHostConstraint(GTTPHost);

  applyLegacyCommonProxies(server, GTTPOrigin, gttpHostConstraint);

  // Allows cart page with query parameter ?isPassthrough to proxy to the monolith
  server.register(
    fastifyProxy,
    handlers.getProxyToOriginOpts("/cart", GTTPOrigin, {
      ...gttpHostConstraint,
      queryIsPassthrough: true,
    })
  );

  if (isRuntimeProd) {
    // redirect unsupported langs
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const unsupportedGTTPLangs = Object.values({ ...SupportedLanguages }).filter(
      lang => !hreflangLocalesByMarketplace[Marketplace.GUIDE_TO_THE_PHILIPPINES]!.includes(lang)
    );
    const gttpLangRedirectHandler: FastifyRouteHandlerType = (_request, reply) => {
      reply.redirect(302, "/");
    };
    unsupportedGTTPLangs.forEach(lang => {
      server
        .route({
          method: routeMethods,
          url: `/${lang}`,
          handler: gttpLangRedirectHandler,
          constraints: gttpHostConstraint,
        })
        .route({
          method: routeMethods,
          url: `/${lang}/*`,
          handler: gttpLangRedirectHandler,
          constraints: gttpHostConstraint,
        });
    });
  }

  const requireFn = dev ? require : __non_webpack_require__; // eslint-disable-line camelcase
  const footerLegacyUrls = requireFn("./gttpProxyPages.json");
  const iptLegacyPageHandler: FastifyRouteHandlerType = (request, reply) => {
    reply.header("x-0-surrogate-key", "monolith");
    reply.from(`https://${GTTPOrigin}${request.url}`, {
      ...replyFromProxyOptions,
      rewriteRequestHeaders: ({ headers }) => ({
        ...headers,
        host: GTTPHost,
      }),
    });
  };
  [...footerLegacyUrls, ...legacyGTTPMonolithProxyRoutes].map((route: string) =>
    server.route({
      method: routeMethods,
      url: route,
      handler: iptLegacyPageHandler,
      constraints: gttpHostConstraint,
    })
  );
}

function applyNTGRoutes(
  server: serverType,
  NTGHost: keyof typeof hostToOriginMap = "norwaytravelguide.no"
) {
  const NTGOrigin = hostToOriginMap[NTGHost];
  const ntgHostConstraint = constructHostConstraint(NTGHost);

  applyLegacyCommonProxies(server, NTGOrigin, ntgHostConstraint);

  // We proxy cart to the monolith for NTG
  server.register(
    fastifyProxy,
    handlers.getProxyToOriginOpts("/cart", NTGOrigin, {
      ...ntgHostConstraint,
    })
  );

  // proxy legacy pages.
  const iptLegacyPageHandler: FastifyRouteHandlerType = (request, reply) => {
    reply.header("x-0-surrogate-key", "monolith");
    reply.from(`https://${NTGOrigin}${request.url}`, {
      ...replyFromProxyOptions,
      rewriteRequestHeaders: ({ headers }) => ({
        ...headers,
        host: NTGHost,
      }),
    });
  };
  legacyNTGMonolithProxyRoutes.map((route: string) =>
    server.route({
      method: routeMethods,
      url: route,
      handler: iptLegacyPageHandler,
      constraints: ntgHostConstraint,
    })
  );
}

function constructQueryParamConstraint(
  constraintName: string
): ConstraintStrategy<HTTPVersion.V1, unknown> {
  return {
    name: constraintName,
    storage() {
      const cache: { [key: string]: Handler<HTTPVersion.V1> } = {};
      return {
        get: (type: string) => {
          return cache[type] || null;
        },
        set: (type: string, store: Handler<HTTPVersion.V1>) => {
          // eslint-disable-next-line functional/immutable-data
          cache[type] = store;
        },
      };
    },
    deriveConstraint: () => "",
    validate: () => true,
    mustMatchWhenDerived: false,
  };
}

function constructHostConstraint(host: string | RegExp) {
  return {
    travelshiftHost: host,
  };
}

export default getFastifyServer;
