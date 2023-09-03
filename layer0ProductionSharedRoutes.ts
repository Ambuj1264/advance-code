/* eslint-disable no-restricted-syntax */

import { Router, ResponseWriter } from "@layer0/core/router";

import { backends } from "../layer0.config";

import {
  getLayer0Paths,
  nonCachedGraphQlMatch,
  graphQlMatch,
  routeMatcher,
  // previewRouteMatcher,
  proxyRules,
  nonCachedGraphQlRules,
  cachedGraphQlRules,
  // previewRouteRules,
  routeRules,
  matchBlockedIps,
  disableDevDeploymentIndexing,
  matchDevManifest,
  staticAssetsRules,
  addAffiliateCookie,
  redirectAmpToRegular,
  redirectFromTrailingSlash,
  redirectFromWww,
  addStaticLayer0ErrorHandlers,
  shortCacheGraphQlMatch,
  longCacheGraphQlMatch,
} from "./utils/layer0RoutesUtils";
import { longCacheGraphql, shortCacheGraphql } from "./cache";

export const paths = getLayer0Paths();

export type ProxyNameType = keyof typeof backends;

export const setupSharedRoutes = (router: Router, legacyProxyName: ProxyNameType) => {
  matchBlockedIps(router);
  redirectFromWww(router);
  disableDevDeploymentIndexing(router);
  matchDevManifest(router);
  addAffiliateCookie(router);
  redirectAmpToRegular(router);
  redirectFromTrailingSlash(router);

  router
    // force brotli compression if supported
    .match(
      {
        path: "/:path*(.html$|.js$|.json$|.woff2$|.woff$|.jpg$|.jpeg$|.png$|.gif$)",
        headers: {
          "accept-encoding": /br/,
        },
      },
      ({ setRequestHeader, setUpstreamResponseHeader }) => {
        setRequestHeader("accept-encoding", "br");
        setUpstreamResponseHeader("x-0-surrogate-key", "static");
      }
    )
    .match(`/sw.js`, ({ serveStatic, setResponseHeader, setUpstreamResponseHeader }) => {
      setUpstreamResponseHeader("x-0-surrogate-key", "static");
      setResponseHeader("Service-Worker-Allowed", "/");
      serveStatic(".next/static/sw.js", { expiresSeconds: 60 * 30 });
    })
    .match(`/_next/static/:path*`, staticAssetsRules(".next/static/:path*", true))
    .match("/fonts/:path*", staticAssetsRules("fonts/:path*"));

  // router.match(previewRouteMatcher("/:path*"), previewRouteRules());
  // Allows pages with query parameter ?isPassthrough to proxy to the monolith
  router.match({ query: { isPassthrough: "1" } }, proxyRules(legacyProxyName as ProxyNameType));
  paths.forEach(path => router.match(routeMatcher(path), routeRules()));

  // Temp fix for edit tour order to proxy to the monolith
  router.match({ query: { order: /.+/ } }, proxyRules(legacyProxyName as ProxyNameType));

  router.match({ path: "/healthz" }, ({ send }: ResponseWriter) => send("", 200));

  router
    // User-sensitive GraphQL requests
    .match(nonCachedGraphQlMatch(), nonCachedGraphQlRules(legacyProxyName as never))
    // User-sensitive GraphQL requests - backend-controlled cache
    .match(
      nonCachedGraphQlMatch(undefined, true),
      nonCachedGraphQlRules(legacyProxyName as never, true)
    )
    // Short-lived GraphQL requests
    .match(
      shortCacheGraphQlMatch(),
      cachedGraphQlRules(legacyProxyName as never, shortCacheGraphql)
    )
    // Long-lived GraphQL requests
    .match(longCacheGraphQlMatch(), cachedGraphQlRules(legacyProxyName as never, longCacheGraphql))
    // All other GraphQL requests
    .match(graphQlMatch(), cachedGraphQlRules(legacyProxyName as never));

  addStaticLayer0ErrorHandlers(router, legacyProxyName as never);
};
