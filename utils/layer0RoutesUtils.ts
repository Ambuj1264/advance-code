import { BACKENDS } from "@layer0/core/constants";
import { ResponseWriter, RouteHandler, Router } from "@layer0/core/router";
import { CacheOptions } from "@layer0/core/router/CacheOptions";

import appRouter from "../shared/routes";
import {
  disabledCaching,
  getLayer0CacheOptions,
  graphql,
  ssr,
  ssrPrivateCaching,
  staticAssets,
} from "../cache";
import { GTEHost, GTIHost, HostToOriginMap, localePathsToSkip } from "../layer0RoutesConstants";
import { backends } from "../../layer0.config";

import { getBackendName } from "./layer0RoutesAdditionalUtils";
import { TRAVELSHIFT_EXPERIMENT_COOKIE_NAME } from "./constants";
import {
  getCorrectCountryUrl,
  getUnsupportedLangRedirect,
  stripAmpFromUrl,
  stripWwwFromHost,
} from "./commonServerUtils";

import { ActiveExperiments } from "components/ui/Experiments/experimentEnums";
import { MarketplaceName, SupportedLanguages, TravelshiftCustomHeader } from "types/enums";
import Route from "shared/LocaleRouter/Route";
import { ROUTE_NAMES } from "shared/routeNames";

const isDev = process.env.NODE_ENV !== "production";
const isIndexingDisabled = process.env.ALLOW_INDEXING !== "true";
const optionalGroupPattern = /\(([\w-|/{}]+)\)/;
const hosts = Object.keys(HostToOriginMap);
export const errorContextCookie =
  // eslint-disable-next-line no-template-curly-in-string
  "error-context=${req:x-0-error-status-code} // ${req:x-request-id} // ${req:x-0-status}; path=/";

type ProxyNameType = keyof typeof backends;

type Layer0Route = {
  name: ROUTE_NAMES;
  path: string;
  pattern: string;
};

export const languageParam = "{:lang(zh_CN|\\w{2})/}";

const buildL0RoutesAndSplitPaths = (route: Route): Layer0Route[] => {
  const { pattern: path, name } = route;
  const result = path.match(optionalGroupPattern);
  if (!result) {
    return [{ path, name, pattern: route.pattern }];
  }
  return result[1].split("|").map(option => {
    return {
      path: path.replace(optionalGroupPattern, option),
      name,
      pattern: route.pattern,
    };
  });
};

export const findLocalePaths = (routes: Map<string, Layer0Route>) => (route: Layer0Route) => {
  // eslint-disable-next-line
  for (const lang in appRouter.translations) {
    let { path } = route;
    path =
      path === "/{locale}"
        ? path.replace(`{locale}`, "")
        : path.replace(`{locale}/`, `${languageParam}?`);

    // eslint-disable-next-line
    for (const key in appRouter.translations[lang]) {
      const word = `{${key.substr(4)}}`;
      const value = appRouter.translations[lang][key];
      path = path.replace(word, value);
    }

    if (path.length === 0 || localePathsToSkip.includes(path)) {
      // Lang does not contain this variable
      // or we are skipping with path
    } else if (!routes.has(path)) {
      routes.set(path, {
        name: route.name,
        path,
        pattern: route.pattern,
      });
    }
  }
};

export const getLayer0Routes = (marketplace?: MarketplaceName) => {
  const routes = new Map<string, Layer0Route>();

  const findLocalePath = findLocalePaths(routes);

  const allowedRoutes = marketplace
    ? (appRouter.routes as Route[]).filter(route => {
        return route.marketplace?.some((mp: string) => mp === marketplace);
      })
    : (appRouter.routes as Route[]).filter(route => !route.marketplace);
  allowedRoutes.forEach(route => buildL0RoutesAndSplitPaths(route).forEach(findLocalePath));

  // Need to add all translation routes for homepage for avoiding conflicts with other routes
  if (routes.has("/")) {
    // eslint-disable-next-line
    for (const lang in appRouter.translations) {
      routes.set(`/${lang}`, {
        pattern: `/${lang}`,
        path: `/${lang}`,
        name: routes.get("/")?.name ?? ("" as ROUTE_NAMES),
      });
    }
  }

  return routes;
};

export const getLayer0Paths = (marketplace?: MarketplaceName) =>
  new Set(getLayer0Routes(marketplace).keys());

export const getProxyByHost = (hostName: string) => {
  const currentHost = hosts.find(hostItem => hostItem.includes(hostName)) || GTIHost;

  return getBackendName(currentHost);
};

export const getFacebookMatch = (hostRegExp: RegExp | null = null) => ({
  protocol: "https?",
  headers: {
    "user-agent": /facebookexternalhit/,
    ...(hostRegExp ? { host: hostRegExp } : {}),
  },
});

export const nonCachedGraphQlMatch = (
  hostRegExp: RegExp | null = null,
  useBackendCachedRules = false
) => {
  const headerName = useBackendCachedRules
    ? TravelshiftCustomHeader.BACKEND_CONTROLLED_CACHE
    : TravelshiftCustomHeader.SKIP_CACHE;
  return {
    path: "/client-api(.*)",
    headers: {
      [headerName]: /true/i,
      ...(hostRegExp ? { host: hostRegExp } : {}),
    },
  };
};

export const shortCacheGraphQlMatch = (hostRegExp: RegExp | null = null) => ({
  path: "/client-api(.*)",
  headers: {
    [TravelshiftCustomHeader.SHORT_CACHE]: /true/i,
    ...(hostRegExp ? { host: hostRegExp } : {}),
  },
});

export const longCacheGraphQlMatch = (hostRegExp: RegExp | null = null) => ({
  path: "/client-api(.*)",
  headers: {
    [TravelshiftCustomHeader.LONG_CACHE]: /true/i,
    ...(hostRegExp ? { host: hostRegExp } : {}),
  },
});

export const graphQlMatch = (hostRegExp: RegExp | null = null) => ({
  path: "/client-api(.*)",
  ...(hostRegExp
    ? {
        headers: { host: hostRegExp },
      }
    : {}),
});

export const routeMatcher = (path: string, hostRegExp: RegExp | null = null) => ({
  path,
  ...(hostRegExp
    ? {
        headers: { host: hostRegExp },
      }
    : {}),
});

export const previewRouteMatcher = (path: string) => ({
  path,
  cookies: { preview: "1" },
});

export const getHostMatch = (hostRegExp: RegExp | null = null) => ({
  headers: { host: hostRegExp },
});

export const proxyRules =
  (proxyName: ProxyNameType) =>
  ({ cache, proxy, setResponseHeader, setRequestHeader }: ResponseWriter) => {
    setResponseHeader("x-passthrough", "true");
    setRequestHeader("x-travelshift-url-front", `https://${backends[proxyName].hostHeader}`);
    cache({ edge: false });
    proxy(proxyName);

    if (isIndexingDisabled) {
      setResponseHeader("X-Robots-Tag", "noindex");
    }
  };

export const cachedProxyRules =
  (proxyName: string) =>
  ({
    cache,
    proxy,
    setResponseHeader,
    removeUpstreamResponseHeader,
    setUpstreamResponseHeader,
  }: ResponseWriter) => {
    setResponseHeader("x-passthrough", "true");
    removeUpstreamResponseHeader("set-cookie");
    cache(ssrPrivateCaching);
    proxy(proxyName);
    setUpstreamResponseHeader("x-0-surrogate-key", "monolith");

    if (isIndexingDisabled) {
      setResponseHeader("X-Robots-Tag", "noindex");
    }
  };

export const nonCachedGraphQlRules =
  (proxyName: ProxyNameType, useBackendCachedRules = false) =>
  ({ cache, proxy, setResponseHeader, setRequestHeader }: ResponseWriter) => {
    setResponseHeader("x-passthrough", "true");
    setRequestHeader("x-travelshift-url-front", `https://${backends[proxyName].hostHeader}`);
    cache({ edge: false });
    if (process.env.RUNTIME_ENV === "prod" || process.env.INTERNAL_CLIENTAPI_URI) {
      proxy(`clientApi`, { path: "/:0" });
    } else {
      proxy(proxyName);
    }

    if (!useBackendCachedRules) {
      /**
       * Set response headers for caching proxies like Fastly
       * Don't allow cache to be stored anywhere
       */
      setResponseHeader("Surrogate-Control", "no-store");
    }

    if (isIndexingDisabled) {
      setResponseHeader("X-Robots-Tag", "noindex");
    }
  };

export const cachedGraphQlRules =
  (proxyName: ProxyNameType, graphQlCache: CacheOptions = graphql) =>
  ({ cache, proxy, setResponseHeader, updateResponseHeader, setRequestHeader }: ResponseWriter) => {
    setRequestHeader("x-travelshift-url-front", `https://${backends[proxyName].hostHeader}`);
    cache(graphQlCache);
    if (process.env.RUNTIME_ENV === "prod" || process.env.INTERNAL_CLIENTAPI_URI) {
      proxy(`clientApi`, { path: "/:0" });
    } else {
      proxy(proxyName);
    }
    updateResponseHeader("cache-control", /(,\s*\bprivate\b\s*)|(^\s*private,\s*)/g, "");

    /**
     * Set response headers for caching proxies like Fastly
     * 1 week TTL
     * 2 weeks SWR
     */
    setResponseHeader("Surrogate-Control", "max-age=604800, stale-while-revalidate=1209600");

    if (isIndexingDisabled) {
      setResponseHeader("X-Robots-Tag", "noindex");
    }
  };

export const previewRouteRules =
  () =>
  ({ cache, proxy, setResponseHeader, updateResponseHeader, setRequestHeader }: ResponseWriter) => {
    cache({ edge: false });
    proxy(BACKENDS.js);
    setRequestHeader("x-travelshift-url-front", `https://${process.env.CLIENT_API_URI}`);
    setRequestHeader("x-travelshift-env", `${process.env.RUNTIME_ENV}`);
    setResponseHeader("x-run-on-layer0", "true");
    if (isIndexingDisabled) {
      setResponseHeader("X-Robots-Tag", "noindex");
    }
    updateResponseHeader("cache-control", /(,\s*\bprivate\b\s*)|(^\s*private,\s*)/g, "");

    /**
     * Set response headers for caching proxies like Fastly
     * 1 week TTL
     * 2 weeks SWR
     */
    setResponseHeader("Surrogate-Control", "max-age=604800, stale-while-revalidate=1209600");
  };

export const routeRules =
  (
    // eslint-disable-next-line default-param-last
    cacheOptions: CacheOptions = ssr,
    routeName?: ROUTE_NAMES
  ) =>
  ({
    cache,
    proxy,
    setResponseHeader,
    updateResponseHeader,
    setRequestHeader,
    updateRequestHeader,
  }: ResponseWriter) => {
    // force brotli compression if supported
    updateRequestHeader("accept-encoding", /.*br.*/gi, "br");
    cache(getLayer0CacheOptions(cacheOptions, routeName));
    proxy(BACKENDS.js);
    setResponseHeader("x-run-on-layer0", "true");
    setRequestHeader("x-travelshift-url-front", `https://${process.env.CLIENT_API_URI}`);
    setRequestHeader("x-travelshift-env", `${process.env.RUNTIME_ENV}`);
    if (isIndexingDisabled) {
      setResponseHeader("X-Robots-Tag", "noindex");
    }

    updateResponseHeader("cache-control", /(,\s*\bprivate\b\s*)|(^\s*private,\s*)/g, "");

    /**
     * Set response headers for caching proxies like Fastly
     * 1 week TTL
     * 2 weeks SWR
     */
    setResponseHeader("Surrogate-Control", "max-age=604800, stale-while-revalidate=1209600");
  };

export const sitemapProxyRules =
  () =>
  ({
    cache,
    proxy,
    setResponseHeader,
    removeUpstreamResponseHeader,
    setUpstreamResponseHeader,
  }: ResponseWriter) => {
    setResponseHeader("x-passthrough", "true");
    removeUpstreamResponseHeader("set-cookie");
    cache(ssrPrivateCaching);
    proxy("sitemapS3", { path: "/sitemaps/sitemap-:param" });
    setUpstreamResponseHeader("x-0-surrogate-key", "sitemap");

    if (isIndexingDisabled) {
      setResponseHeader("X-Robots-Tag", "noindex");
    }
  };

export const nonCachedRouteRules =
  () =>
  ({ cache, proxy, setResponseHeader, setRequestHeader }: ResponseWriter) => {
    cache({ edge: false });
    proxy(BACKENDS.js);
    setResponseHeader("x-run-on-layer0", "true");
    setRequestHeader("x-travelshift-url-front", `https://${process.env.CLIENT_API_URI}`);
    setRequestHeader("x-travelshift-env", `${process.env.RUNTIME_ENV}`);

    /**
     * Set response headers for caching proxies like Fastly
     * Don't allow cache to be stored anywhere
     */
    setResponseHeader("Surrogate-Control", "no-store");
    if (isIndexingDisabled) {
      setResponseHeader("X-Robots-Tag", "noindex");
    }
  };

export const matchBlockedIps = (router: Router) => {
  const blockedIPs = process.env.BLOCKED_IPS;
  if (blockedIPs) {
    router.match(
      {
        headers: {
          "x-0-client-ip": new RegExp(blockedIPs),
        },
      },
      ({ send }) => {
        send("Blocked", 403);
      }
    );
  }
};

export const disableDevDeploymentIndexing = (router: Router) => {
  router.match(
    {
      headers: { host: /layer0-.*link$/i },
    },
    ({ setResponseHeader }: ResponseWriter) => {
      setResponseHeader("X-Robots-Tag", "noindex");
    }
  );
};

export const matchDevManifest = (router: Router) => {
  if (isDev) {
    router.match("/_next/static/development/_devPagesManifest.json", ({ proxy }) => {
      proxy(BACKENDS.js);
    });
  }
};

export const createHostMatcher =
  (hostRegExp: RegExp) =>
  (router: Router, path: string | string[] | Set<string>, handler: RouteHandler) => {
    if (Array.isArray(path) || path instanceof Set) {
      path.forEach((p: string) => router.match(routeMatcher(p, hostRegExp), handler));
    } else {
      router.match(routeMatcher(path, hostRegExp), handler);
    }
  };

export const staticAssetsRules =
  (path: string, permanent?: boolean) =>
  ({ cache, serveStatic, setUpstreamResponseHeader }: ResponseWriter) => {
    setUpstreamResponseHeader("x-0-surrogate-key", "static");
    cache(staticAssets);
    serveStatic(path, {
      permanent,
    });
  };

export const addAffiliateCookie = (router: Router) => {
  router.match({ query: { a: /.+/ } }, ({ setResponseHeader }) => {
    // eslint-disable-next-line no-template-curly-in-string
    setResponseHeader("set-cookie", "gti_affiliate=${query:a}; path=/");
  });
};

export const redirectWrongCountryUrl = (router: Router) => {
  const langRegex = "/th|/zh|/ja|/ko|/ru";
  const countryRegex = "macedonia|north-macedonia|netherlands|united-kingdom|channel-islands";
  router.match(`(${langRegex})?/(${countryRegex})(.*)`, ({ compute }) => {
    compute(async (request, response) => {
      const correctCountryUrl = getCorrectCountryUrl(request.url);
      response.setHeader("location", correctCountryUrl);
      // eslint-disable-next-line functional/immutable-data
      response.statusCode = 301;
    });
  });
};

export const redirectOldRoutes = (router: Router) => {
  router.match(`/:path*/(meilleure-voiture-de-location)/:rest*`, ({ redirect }) =>
    redirect("/:path/meilleure-location-de-voiture/:rest", 301)
  );
};

export const redirectArticleAttractionCategories = (router: Router) => {
  router.match("/(articles|destinations-and-attractions)/:category?", ({ redirect }) =>
    redirect("/", 302)
  );
};

export const redirectAmpToRegular = (router: Router) => {
  router.match(
    {
      // eslint-disable-next-line prettier/prettier
      path: "/:path*",
      query: {
        amp: "1|true",
      },
    },
    ({ compute }) => {
      compute(async (request, response) => {
        const nonAmpUrl = stripAmpFromUrl(request.url);
        response.setHeader("location", nonAmpUrl);
        // eslint-disable-next-line functional/immutable-data
        response.statusCode = 301;
      });
    }
  );

  router.match(
    {
      path: "/:path*(/amp)",
    },
    ({ redirect }) => redirect("/:path", 301)
  );
};

export const redirectFromWww = (router: Router) => {
  router.match(
    {
      headers: {
        host: /^www\./,
      },
    },
    ({ compute }) => {
      compute(async (request, response) => {
        const nonWwwUrl = stripWwwFromHost(request.headers.host as string);

        response.setHeader(
          "location",
          // @ts-ignore protocol is not defined in types, but we have it
          `${request.protocol}://${nonWwwUrl}${request.url}`
        );
        // eslint-disable-next-line functional/immutable-data
        response.statusCode = 301;
      });
    }
  );
};

export const redirectFromTrailingSlash = (router: Router) => {
  router.match(
    {
      path: "/:path+(/)",
    },
    ({ redirect }) => redirect("/:path", 301)
  );
};

export const serveStaticErrorPage =
  (statusCode: number, proxyName: string) =>
  ({ cache, setResponseHeader, serveStatic }: ResponseWriter) => {
    cache(disabledCaching);
    setResponseHeader("set-cookie", errorContextCookie);
    serveStatic(`.next/serverless/pages/errorStatic-${proxyName}.html`, {
      statusCode,
    });
  };

export const addStaticLayer0ErrorHandlers = (router: Router, proxyName: string) => {
  // eslint-disable-next-line no-plusplus
  for (let statusMatch = 530; statusMatch <= 542; statusMatch++) {
    router.catch(new RegExp(`${statusMatch}`), serveStaticErrorPage(statusMatch, proxyName));
  }
};

export const createCartExperimentHandler = (variationId: string, router: Router) =>
  router.match(
    {
      path: `/${languageParam}?cart`,
      headers: {
        host: /guidetoiceland/,
      },
    },
    ({ addResponseCookie }) => {
      addResponseCookie(
        TRAVELSHIFT_EXPERIMENT_COOKIE_NAME,
        `${ActiveExperiments.NEW_CART},${process.env.CART_EXPERIMENT_ID},${variationId}`
      );
    }
  );

// fetch locale links and redirect to english
export const redirectGTELangs = (router: Router) => {
  const langsRegex = Object.values({ ...SupportedLanguages })
    // Filter out supported locales so we can view that on GTE
    .filter(
      lang =>
        lang !== SupportedLanguages.Polish &&
        lang !== SupportedLanguages.Norwegian &&
        lang !== SupportedLanguages.German &&
        lang !== SupportedLanguages.French &&
        lang !== SupportedLanguages.Danish &&
        lang !== SupportedLanguages.Japanese &&
        lang !== SupportedLanguages.Spanish &&
        lang !== SupportedLanguages.Thai &&
        lang !== SupportedLanguages.Russian &&
        lang !== SupportedLanguages.LegacyChinese &&
        lang !== SupportedLanguages.Italian &&
        lang !== SupportedLanguages.Swedish &&
        lang !== SupportedLanguages.Dutch &&
        lang !== SupportedLanguages.Korean
    )
    .join("|");

  router.match(`/(${langsRegex})/:path*`, ({ cache, compute }) => {
    cache(ssr);
    compute(async (request, response) => {
      const redirectTo = await getUnsupportedLangRedirect(GTEHost, request.url);
      response.setHeader("location", redirectTo);
      // eslint-disable-next-line functional/immutable-data
      response.statusCode = 302;
    });
  });
};
