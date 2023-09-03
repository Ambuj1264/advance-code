/**
 * @jest-environment node
 */

/* eslint-disable functional/immutable-data */
import fs from "fs";
import nodePath from "path";

import Route from "@layer0/core/router/Route";

import {
  cachedGraphQlRules,
  cachedProxyRules,
  getFacebookMatch,
  getLayer0Paths,
  graphQlMatch,
  languageParam,
  nonCachedGraphQlMatch,
  nonCachedGraphQlRules,
  previewRouteMatcher,
  // previewRouteRules,
  routeMatcher,
  sitemapProxyRules,
  staticAssetsRules,
} from "../utils/layer0RoutesUtils";
import { productionRouter } from "../layer0GTIRoutes";
import { gteProductionRouter } from "../layer0GTERoutes";
import { cachedMonolithPages } from "../layer0RoutesConstants";
import { backends } from "../../layer0.config";

export const paths = getLayer0Paths();
const gtiRoutes = productionRouter.routeGroups.getRoutes();
const gteRoutes = gteProductionRouter.routeGroups.getRoutes();

const findRouteIndex = (
  {
    path,
    protocol,
    headers,
  }: {
    path?: string;
    protocol?: string;
    headers?: any;
  },
  handler: any,
  routes: Route[]
) => {
  return routes.findIndex(route => {
    const pathMatch = path ? path === route.criteria.path : true;
    const protocolMatch = protocol ? protocol === route.criteria.protocol : true;
    const headersMatch = headers
      ? JSON.stringify(headers, Object.keys(headers).sort()) ===
        JSON.stringify(route.criteria.headers, Object.keys(route.criteria.headers || {}).sort())
      : true;

    // compare handler functions by source code... magic, but works though
    const handlerMatch = handler ? route.handler.toString() === handler().toString() : true;

    return pathMatch && protocolMatch && headersMatch && handlerMatch;
  });
};

const catchRuleExpectedHeaders = {
  // eslint-disable-next-line prettier/prettier
  "x-0-error-status-code": /530/,
};

const getExpectedHostIndexes = (routes: Route[]) => {
  const graphqlRuleIdx = findRouteIndex(nonCachedGraphQlMatch(), nonCachedGraphQlRules, routes);
  const facebookRuleIdx = findRouteIndex(getFacebookMatch(), cachedProxyRules, routes);
  const cachedGraphRuleIdx = findRouteIndex(graphQlMatch(), cachedGraphQlRules, routes);
  const catchRuleIdx = cachedGraphRuleIdx + 3;
  const catchRuleHeaders = routes[catchRuleIdx].criteria.headers;

  return {
    graphqlRuleIdx,
    facebookRuleIdx,
    cachedGraphRuleIdx,
    catchRuleHeaders,
  };
};

describe("layer0 router", () => {
  beforeAll(() => {
    // hack to allow stringify of regexes
    // eslint-disable-next-line no-extend-native
    Object.defineProperty(RegExp.prototype, "toJSON", {
      value: RegExp.prototype.toString,
    });
  });

  afterAll(() => {
    // @ts-ignore
    // eslint-disable-next-line prettier/prettier
    delete RegExp.prototype.toJSON
  });

  it("generic order of the routes hasn't been changed for gti router", () => {
    const cnRulesIdx = findRouteIndex(routeMatcher("/(zh|zh_CN)/:path"), null, gtiRoutes);
    const swIdx = findRouteIndex(routeMatcher(`/sw.js`), null, gtiRoutes);
    const staticIdx = findRouteIndex(
      routeMatcher(`/_next/static/:path*`),
      staticAssetsRules,
      gtiRoutes
    );
    // const previewIdx = findRouteIndex(
    //   previewRouteMatcher("/:path*"),
    //   previewRouteRules,
    //   gtiRoutes
    // );
    const GtIRoutesIdx = [...paths].map(path =>
      findRouteIndex(routeMatcher(path), null, gtiRoutes)
    );

    const GtICartIdx = findRouteIndex(
      {
        path: `/${languageParam}?cart`,
      },
      null,
      gtiRoutes
    );

    const GtICachedMonolithIdx = cachedMonolithPages.map(path =>
      findRouteIndex(routeMatcher(path), cachedProxyRules, gtiRoutes)
    );

    const routeOrderResult = [
      cnRulesIdx,
      GtICartIdx,
      swIdx,
      staticIdx,
      // previewIdx,
      ...GtIRoutesIdx,
      ...GtICachedMonolithIdx,
    ];
    const routeOrderResultAscSort = routeOrderResult.slice().sort((a, b) => a - b);

    // checking that order of the routes comes as ascending
    // we'll get an error in case if we change order of any important rules in the router.
    expect(routeOrderResult).toEqual(routeOrderResultAscSort);
  });

  it("ensures that the generic order of the routes hasn't been changed for gte router", () => {
    const clientApiProxyIdx = findRouteIndex(
      previewRouteMatcher("/client-api(.*)"),
      nonCachedGraphQlRules,
      gteRoutes
    );
    const swIdx = findRouteIndex(routeMatcher(`/sw.js`), null, gteRoutes);
    const staticIdx = findRouteIndex(
      routeMatcher(`/_next/static/:path*`),
      staticAssetsRules,
      gteRoutes
    );
    // const previewIdx = findRouteIndex(
    //   previewRouteMatcher("/:path*"),
    //   previewRouteRules,
    //   gteRoutes
    // );
    const GtESitemap = findRouteIndex(
      routeMatcher("/sitemap-:param"),
      sitemapProxyRules,
      gteRoutes
    );
    const gteRoutesIdx = [...paths].map(path =>
      findRouteIndex(routeMatcher(path), undefined, gteRoutes)
    );
    const gteCachedMonolithIdx = cachedMonolithPages.map(path =>
      findRouteIndex(routeMatcher(path), cachedProxyRules, gteRoutes)
    );
    const routeOrderResult = [
      GtESitemap,
      swIdx,
      staticIdx,
      // previewIdx,
      ...gteRoutesIdx,
      clientApiProxyIdx,
      ...gteCachedMonolithIdx,
    ];
    const routeOrderResultAscSort = routeOrderResult.slice().sort((a, b) => a - b);

    // checking that order of the routes comes as ascending
    // we'll get an error in case if we change order of any important rules in the router.
    expect(routeOrderResult).toEqual(routeOrderResultAscSort);
  });

  it("should have correct rules order for GtI domain", () => {
    const { graphqlRuleIdx, cachedGraphRuleIdx, catchRuleHeaders } =
      getExpectedHostIndexes(gtiRoutes);
    expect(graphqlRuleIdx).toEqual(cachedGraphRuleIdx - 2);
    expect(catchRuleHeaders).toEqual({
      ...catchRuleExpectedHeaders,
    });
  });

  it("should have correct rules order for GtE domain", () => {
    const { graphqlRuleIdx, cachedGraphRuleIdx, catchRuleHeaders } =
      getExpectedHostIndexes(gteRoutes);

    expect(graphqlRuleIdx).toEqual(cachedGraphRuleIdx - 2);
    expect(catchRuleHeaders).toEqual({
      ...catchRuleExpectedHeaders,
    });
  });
});

describe("layer0 config", () => {
  it("each backend has dedicated error page", () => {
    Object.keys(backends).forEach(backendKey => {
      if (
        backendKey === "sitemapS3" ||
        backendKey === "clientApi" ||
        backendKey.includes("www") ||
        backendKey.includes("cn_")
      )
        return;

      const path = nodePath.join(__dirname, `./../pages/errorStatic-${backendKey}.tsx`);
      expect(fs.existsSync(path)).toBe(true);
    });
  });
});
