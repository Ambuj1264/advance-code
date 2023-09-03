/* eslint-disable react/prop-types */
import React from "react";

import { constructBaseSurrogateKeys } from "../constructSurrogateKeys";
import { logDevQueryErrors } from "../logDevQueryErrors";

import { redirectCheck } from "./redirectCheck";

import { Namespaces } from "shared/namespaces";
import { MarketplaceName } from "types/enums";
import initApollo, { initApolloFromCtx } from "lib/apollo/initApollo";
import HeaderQuery from "components/features/Header/Header/graphql/HeaderQuery.graphql";
import NewFooterQuery from "components/features/Footer/queries/NewFooterQuery.graphql";
import HeaderQueryGraphCms from "components/features/Header/Header/graphql/HeaderQueryGraphCms.graphql";
import TopServicesQuery from "components/ui/TopServices/TopServicesQuery.graphql";
import MarketplaceConfigQuery from "components/features/App/graphql/MarketplaceConfigQuery.graphql";
import CountryQuery from "hooks/queries/CountryQuery.graphql";
import NamespaceQuery from "lib/namespaceQuery.graphql";
import LocaleLinksQuery from "components/features/Header/Header/graphql/LocaleLinksQuery.graphql";
import { getMarketplaceUrl, getStrippedUrlPath, longCacheHeaders } from "utils/apiUtils";
import {
  getMissingNamespaces,
  getSplitNamespaces,
  isBrowser,
  normalizeGraphCMSLocale,
  partition,
} from "utils/helperUtils";
import { getOptimizeExperiments } from "components/ui/Experiments/experimentUtils";
import { oneDaySeconds, oneWeekSeconds } from "utils/constants";

const getIsProd = ctx =>
  ctx?.req?.headers?.["x-travelshift-env"] === "prod" ||
  (isBrowser && window.__NEXT_DATA__.props?.isRuntimeProd);

const sendQueries = (apollo, queries, abortController, key, timeout) =>
  queries.map(({ query, variables, skip, context, onCompleted }) => {
    const isPrefetchRequest = abortController && key;
    // use custom query variable to tell sw this is a prefetch request
    const vars = isPrefetchRequest ? { ...variables, layer0_prefetch: 1 } : variables;

    const headers = context?.headers ?? {};

    const queryPromise = apollo
      .query({
        query,
        variables: vars,
        skip,
        ...(process.browser
          ? {
              context: {
                headers: {
                  ...(isPrefetchRequest ? { "x-prefetch-key": encodeURIComponent(key) } : headers),
                },
                ...(timeout ? { timeout } : null),
                ...(isPrefetchRequest
                  ? {
                      timeout: 10 * 1000,
                      fetchOptions: {
                        signal: abortController.signal,
                        controller: abortController,
                      },
                    }
                  : null),
              },
            }
          : { context: { headers } }),
      })
      .then(data => {
        if (typeof onCompleted === "function") {
          onCompleted(data);
        }
        return data;
      })
      .catch(e => e);

    return queryPromise;
  });

export const fetchPageQueries = async ({
  key,
  pageQueries,
  apollo,
  locale,
  ctx,
  shouldManuallyCheckForRedirect,
  isPrefetch = false,
  abortController,
  namespacesRequired,
}) => {
  let errorStatusCode;
  const url = getMarketplaceUrl(ctx);
  const isGTE = url.includes(MarketplaceName.GUIDE_TO_EUROPE);
  const namespaces = [Namespaces.errorNs, ...namespacesRequired];
  const normalizedLocale = normalizeGraphCMSLocale(locale);
  const normalizedUrl = url.replace("staging.", "");
  const normalizedAsPath = getStrippedUrlPath(ctx.asPath);

  const serverSideOnlyQueries = [
    {
      query: MarketplaceConfigQuery,
      variables: { url },
      context: { headers: longCacheHeaders },
    },
    {
      query: CountryQuery,
      variables: {
        locale: normalizedLocale,
        url,
      },
      context: { headers: longCacheHeaders },
    },
    {
      query: NewFooterQuery,
      variables: {
        marketplaceUrl: normalizedUrl,
        locale,
      },
      context: { headers: longCacheHeaders },
    },
    ...(isGTE
      ? []
      : [
          {
            query: LocaleLinksQuery,
            variables: {
              url: normalizedAsPath,
            },
            context: { headers: longCacheHeaders },
          },
          {
            query: TopServicesQuery,
            context: { headers: longCacheHeaders },
          },
        ]),
  ];
  const namespacesMissing = isPrefetch ? getMissingNamespaces(namespaces, locale) : namespaces;
  const { firstNamespaces, secondNamespaces, lastNamespaces } =
    getSplitNamespaces(namespacesMissing);
  const queries = [
    ...(pageQueries ?? []),
    ...(isGTE
      ? [
          {
            query: HeaderQueryGraphCms,
            variables: {
              locale: normalizedLocale,
              url: normalizedUrl,
            },
            context: { headers: longCacheHeaders },
          },
        ]
      : [
          {
            query: HeaderQuery,
            variables: {
              url: normalizedAsPath,
            },
            context: { headers: longCacheHeaders },
          },
        ]),
    ...(firstNamespaces.length > 0
      ? [
          {
            query: NamespaceQuery,
            variables: {
              locale: normalizedLocale,
              namespaces: firstNamespaces,
            },
            context: { headers: longCacheHeaders },
          },
        ]
      : []),
    ...(secondNamespaces.length > 0
      ? [
          {
            query: NamespaceQuery,
            variables: {
              locale: normalizedLocale,
              namespaces: secondNamespaces,
            },
            context: { headers: longCacheHeaders },
          },
        ]
      : []),
    ...(lastNamespaces.length > 0
      ? [
          {
            query: NamespaceQuery,
            variables: {
              locale: normalizedLocale,
              namespaces: lastNamespaces,
            },
            context: { headers: longCacheHeaders },
          },
        ]
      : []),

    // This is only used in the server worker for prefetches, we don't care about the serverside queries since they are always cached by apollo
    ...(isPrefetch ? [] : serverSideOnlyQueries),
  ];

  const [requiredQueries, nonRequiredQueries] = partition(
    queries,
    value => value.isRequiredForPageRendering
  );

  const requireQueryResultsPromise = sendQueries(apollo, requiredQueries, abortController, key);

  const nonRequiredQueriesResultPromise = sendQueries(
    apollo,
    nonRequiredQueries,
    abortController,
    key,
    isBrowser ? 45 * 1000 : 7 * 1000
  );

  if (isPrefetch) {
    // Promise.race is used because we assume that all prefetch request in a series will have the same status.
    return Promise.race([...requireQueryResultsPromise, ...nonRequiredQueriesResultPromise]);
  }

  const [requireQueryResults, nonRequiredQueriesResult] = await Promise.all([
    Promise.all(requireQueryResultsPromise),
    Promise.allSettled(nonRequiredQueriesResultPromise),
  ]);

  const requiredQueryErrors = requireQueryResults.filter(result => result instanceof Error);

  const nonRequiredQueryErrors = nonRequiredQueriesResult.filter(
    ({ reason }) => reason instanceof Error
  );

  // Need to define queries which are not capable of encountering errors for each page using isRequiredForPageRendering
  const hasNullResultsInRequiredQuery = requireQueryResults.some(
    result =>
      result?.data &&
      Object.values(result?.data).some(value => value === null || value.length === 0)
  );

  const hasRequiredQueryErrors = requiredQueryErrors.length > 0;

  if (
    hasRequiredQueryErrors ||
    nonRequiredQueryErrors.length > 0 ||
    hasNullResultsInRequiredQuery
  ) {
    logDevQueryErrors(
      requireQueryResults,
      nonRequiredQueriesResult,
      requiredQueries,
      nonRequiredQueries
    );
  }

  if (hasRequiredQueryErrors || hasNullResultsInRequiredQuery || shouldManuallyCheckForRedirect) {
    if (hasRequiredQueryErrors) {
      errorStatusCode = 500;
    } else if (hasNullResultsInRequiredQuery || shouldManuallyCheckForRedirect) {
      errorStatusCode = 404;
    }

    errorStatusCode = await redirectCheck(apollo, ctx, errorStatusCode);
  }

  // eslint-disable-next-line consistent-return
  return errorStatusCode;
};

const isStaticExport = props => !props.apolloState && !props.locale && !props.currentRequestUrl;

const WithApolloClient = App => {
  return class Apollo extends React.Component {
    // eslint-disable-next-line react/static-property-placement
    static displayName = "withApollo(App)";

    static async getInitialProps(appContext) {
      const { router, ctx } = appContext;

      // next static export, which is used to export static error page.
      // In that case, props are returned by errorStatic page getStaticProps fn
      const isServer = typeof window === "undefined";

      if (
        (isServer && ctx.req.method === undefined) ||
        (!isServer && window.__NEXT_DATA__.nextExport)
      ) {
        return {};
      }

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(appContext);
      }

      const pagePropsApolloInstance = appProps.pageProps?.apolloInstance;
      const initialErrorStatusCode = appProps.pageProps?.errorStatusCode;

      const {
        apolloFromCtx,
        absoluteUrl,
        currentRequestUrl,
        currentRequestAuth,
        ctxLocale,
        locale,
      } = initApolloFromCtx(ctx, router.route, !!pagePropsApolloInstance);
      const apollo = pagePropsApolloInstance || apolloFromCtx;

      // delete apolloInstance to avoid hydrating it to client
      if (pagePropsApolloInstance) {
        // eslint-disable-next-line functional/immutable-data
        delete appProps.pageProps.apolloInstance;
      }

      // eslint-disable-next-line functional/immutable-data
      appProps.initialLanguage = normalizeGraphCMSLocale(ctxLocale);

      const ssrSurrogateKeys = constructBaseSurrogateKeys(
        router.asPath,
        currentRequestUrl,
        router.route,
        locale
      );
      const canSetResHeaders = ctx.res && !ctx.res.headersSent;

      // Setting surrogate keys for the layer0 to enable cache clearing
      if (canSetResHeaders) {
        ctx.res.setHeader?.("x-0-surrogate-key", `${ssrSurrogateKeys} web`);
      }

      // setting cache TTL on a page basis
      if (isServer && canSetResHeaders && process.env.RUNTIME_ENV) {
        const pagePropsMaxAge = appProps.pageProps?.maxAge;
        const sMaxAge = pagePropsMaxAge || oneDaySeconds;
        const swr = oneWeekSeconds * 2;

        ctx.res.setHeader?.(
          "Cache-Control",
          `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`
        );

        if (pagePropsMaxAge) {
          // eslint-disable-next-line functional/immutable-data
          delete appProps.pageProps.maxAge;
        }
      }

      let errorStatusCode = initialErrorStatusCode;
      if (!process.browser && App.getInitialProps && !initialErrorStatusCode) {
        errorStatusCode = await fetchPageQueries({
          key: getStrippedUrlPath(router.asPath),
          pageQueries: appProps.pageProps?.queries ?? [],
          apollo,
          locale,
          ctx,
          shouldManuallyCheckForRedirect: appProps.pageProps?.redirectCheck,
          namespacesRequired: appProps.pageProps.namespacesRequired,
        });
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract();
      const optimizeExperiments = getOptimizeExperiments(ctx);

      const isRuntimeProd = getIsProd(ctx);
      return {
        ...appProps,
        apolloState,
        absoluteUrl,
        currentRequestUrl,
        currentRequestAuth,
        errorStatusCode,
        pageSurrogateKeys: ssrSurrogateKeys,
        locale,
        optimizeExperiments,
        isRuntimeProd,
      };
    }

    constructor(props) {
      super(props);
      const {
        apolloState,
        locale,
        currentRequestUrl,
        currentRequestAuth,
        pageSurrogateKeys,
        absoluteUrl,
      } = isStaticExport(props) ? props.pageProps ?? {} : props;

      this.apolloClient = initApollo(
        apolloState,
        locale,
        currentRequestUrl,
        currentRequestAuth,
        null,
        null,
        pageSurrogateKeys,
        absoluteUrl
      );
    }

    render() {
      const props = isStaticExport(this.props)
        ? // eslint-disable-next-line react/destructuring-assignment
          this.props.pageProps ?? {}
        : this.props;
      const { absoluteUrl, currentRequestAuth, locale, currentRequestUrl } = props;

      return (
        <App
          {...this.props}
          locale={locale}
          apolloClient={this.apolloClient}
          absoluteUrl={absoluteUrl}
          currentRequestAuth={currentRequestAuth}
          currentRequestUrl={currentRequestUrl}
        />
      );
    }
  };
};

export default WithApolloClient;
