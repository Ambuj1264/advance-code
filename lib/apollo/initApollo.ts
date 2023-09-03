/* eslint-disable prefer-destructuring, no-underscore-dangle, no-console */
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import getConfig from "next/config";
import { NextPageContext } from "next";
import type { P as Pino } from "pino";

import { resolvers } from "./apolloLocalResolvers";
import {
  errorLinkMiddleware,
  getGraphCMSLinkMiddleware,
  getHttpLinkMiddleware,
  timeoutLink,
  getSetContextLinkMiddleware,
  retryLinkMiddleware,
} from "./middlewares";
import { apolloCacheArgument } from "./apolloCacheArgument";

import { isDebugRequest } from "server/isDebugRequest";
import { Marketplace, PageType, SupportedLanguages } from "types/enums";
import { getCnLocaleFromUri } from "shared/LocaleRouter/localeRouterUtils";
import {
  getAbsoluteUrl,
  getClientApiHeaders,
  getClientApiUri,
  getLanguageFromContext,
  getMarketplaceFromUrl,
  getMarketplaceUrl,
} from "utils/apiUtils";

const isBrowser = process.browser;

const { dev, CLIENT_API_URI, CLIENT_API_PROTOCOL, isServerless } = getConfig().publicRuntimeConfig;

let apolloClient: ApolloClient<unknown> | null = null;
const apolloLocaleCaches: Partial<{ [k in SupportedLanguages]: any }> = {};

function create(
  // eslint-disable-next-line default-param-last
  initialState: any = {},
  locale: SupportedLanguages,
  currentRequestUrl: string,
  currentRequestAuth: string | null,
  req: NextPageContext["req"] | null,
  cookie: string | null,
  pageRoute: string,
  absoluteUrl: string
) {
  let apolloCache;
  let ssrLogger: Pino.Logger;
  // Re-use the apollo cache on dev and on branch deployments
  // TODO: maybe use some other way to identify when we’re serving a request for the monolith proxy
  if (!isBrowser && dev) {
    apolloCache = apolloLocaleCaches[locale];
    if (!apolloCache) {
      apolloCache = new InMemoryCache(apolloCacheArgument);
      // eslint-disable-next-line functional/immutable-data
      apolloLocaleCaches[locale] = apolloCache;
    }
  } else {
    // On production we create a new cache for each session
    apolloCache = new InMemoryCache(apolloCacheArgument);
  }

  if (typeof window === "undefined" && !isServerless && isDebugRequest(req)) {
    // eslint-disable-next-line global-require
    ssrLogger = __non_webpack_require__("pino")();
  }

  const apiUrl = currentRequestUrl || `${CLIENT_API_PROTOCOL}://${CLIENT_API_URI}`;
  const clientApiHeader = {
    ...getClientApiHeaders({
      locale,
      url: apiUrl,
    }),
    "x-rsf-api-version": process.env.APP_VERSION, // note: APP_VERSION cannot be destructured(DefinePlugin / env next)
  };

  const uri = getClientApiUri({
    currentRequestUrl: apiUrl,
    isBrowser,
    absoluteUrl,
  });
  const marketplaceFromUrl = getMarketplaceFromUrl(apiUrl);
  const isGTI = marketplaceFromUrl === Marketplace.GUIDE_TO_ICELAND;
  // we use force-locale header for GTI cn. subdomain for clientapi calls
  const shouldForceLocale = !isServerless && isGTI && (locale === "zh" || locale === "zh_CN");

  const httpLink = getHttpLinkMiddleware({
    uri,
    clientApiHeader,
    currentRequestAuth,
    cookie,
    isBrowser,
    locale,
    shouldForceLocale,
  });

  const timeoutHttpLink = timeoutLink.concat(httpLink);

  const loggerLink = ssrLogger!
    ? new ApolloLink((operation, forward) => {
        const startTime = new Date().getTime();

        return forward(operation).map(result => {
          const context = operation.getContext();
          const queryName =
            operation.query.loc?.source?.body?.split("{")[0] ||
            // @ts-ignore
            operation.query.definitions[0]?.name?.value;
          // @ts-ignore
          const operationType = operation.query.definitions[0]?.operation;

          ssrLogger.info({
            elapsed: new Date().getTime() - startTime,
            queryName,
            operationType,
            url: context.response.url,
            status: context.status,
            statusText: context.statusText,
            headers: JSON.stringify(context.response.headers.raw(), null, 2),
            body: JSON.stringify(result, null, 2),
            reqContextHeaders: JSON.stringify(context.headers, null, 2),
          });
          return result;
        });
      })
    : undefined;

  const splitLink = isBrowser ? [timeoutHttpLink] : [];

  const setContextLink = getSetContextLinkMiddleware({
    currentRequestUrl,
    locale,
    pageRoute,
    req,
    isBrowser,
  });

  return new ApolloClient({
    connectToDevTools: isBrowser,
    // Disables forceFetch on the server (so queries are only run once)
    ssrMode: !isBrowser,
    link: ApolloLink.from([
      getGraphCMSLinkMiddleware(cookie),
      setContextLink,
      errorLinkMiddleware,
      ...(typeof window === `undefined` && loggerLink ? [loggerLink] : []),
      ...(typeof window !== `undefined` ? [retryLinkMiddleware] : []),
      ...(typeof window !== `undefined` ? splitLink : [timeoutHttpLink]),
    ]),
    cache: apolloCache.restore(initialState),
    resolvers,
    name: uri,
    version: !isBrowser ? "SSR" : "Browser",
  });
}

export default function initApollo(
  // eslint-disable-next-line default-param-last
  initialState: any = {},
  locale: SupportedLanguages,
  currentRequestUrl: string,
  currentRequestAuth: string | null,
  req: NextPageContext["req"],
  cookie: string,
  pageRoute: string,
  absoluteUrl: string
) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(
      initialState,
      locale,
      currentRequestUrl,
      currentRequestAuth,
      req,
      cookie,
      pageRoute,
      absoluteUrl
    );
  }
  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(
      initialState,
      locale,
      currentRequestUrl,
      null,
      null,
      null,
      pageRoute,
      absoluteUrl
    );
  }

  return apolloClient;
}

export const initApolloFromCtx = (ctx: NextPageContext, route: PageType, skip = false) => {
  const absoluteUrl =
    typeof window !== "undefined"
      ? // eslint-disable-next-line no-underscore-dangle
        window.__NEXT_DATA__.props.absoluteUrl
      : getAbsoluteUrl(ctx.req);
  const cookies = (ctx.req && ctx.req.headers && ctx.req.headers.cookie) || "";
  const currentRequestUrl = getMarketplaceUrl(ctx);
  const currentRequestAuth = ctx.req?.headers?.authorization ?? null;
  const ctxLocale = getLanguageFromContext(ctx);
  const locale = getCnLocaleFromUri(ctxLocale, currentRequestUrl);

  return {
    apolloFromCtx: !skip
      ? initApollo(
          null,
          locale,
          currentRequestUrl,
          currentRequestAuth,
          ctx.req,
          cookies,
          route,
          absoluteUrl
        )
      : undefined,
    absoluteUrl,
    cookies,
    currentRequestUrl,
    currentRequestAuth,
    ctxLocale,
    locale,
  };
};

export const getInitialPropsWithApollo =
  (
    pageType: PageType,
    getInitialProps: (ctx: NextPageContext, apollo: ApolloClient<unknown>) => Promise<object>
  ) =>
  async (ctx: NextPageContext) => {
    const { apolloFromCtx } = initApolloFromCtx(ctx, pageType, isBrowser);
    return {
      ...(await getInitialProps(ctx, apolloFromCtx as ApolloClient<unknown>)),
      apolloInstance: apolloFromCtx,
    };
  };

export const getInitialPropsWithApolloAndPassToClientSideNav =
  (
    pageType: PageType,
    getInitialProps: (ctx: NextPageContext, apollo: ApolloClient<unknown>) => Promise<object>
  ) =>
  async (ctx: NextPageContext) => {
    const { apolloFromCtx } = initApolloFromCtx(ctx, pageType);
    return {
      ...(await getInitialProps(ctx, apolloFromCtx as ApolloClient<unknown>)),
      apolloInstance: apolloFromCtx,
    };
  };
