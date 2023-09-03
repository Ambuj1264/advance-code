import { createHttpLink } from "apollo-link-http";
import { RetryLink } from "apollo-link-retry";
import { ApolloLink, split } from "apollo-link";
import { onError } from "apollo-link-error";
import ApolloLinkTimeout from "apollo-link-timeout";
import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
import { setContext } from "apollo-link-context";

import { constructClientApiSurrogateKeys } from "../constructSurrogateKeys";

import { SupportedLanguages, TravelshiftCustomHeader } from "types/enums";
import { isInPreviewMode } from "utils/helperUtils";
import lazyCaptureException from "lib/lazyCaptureException";
import { isDev } from "utils/globalUtils";
import nonAuthorizedCode from "components/features/User/utils/authConstants";

const { isServerless } = getConfig().publicRuntimeConfig;

export const shouldUseGetForQueries = (locale, isBrowser) =>
  (locale !== SupportedLanguages.Chinese && locale !== SupportedLanguages.LegacyChinese) ||
  !isBrowser;

export const getHttpLinkMiddleware = ({
  uri,
  clientApiHeader,
  currentRequestAuth,
  cookie,
  locale,
  isBrowser,
  shouldForceLocale,
}) => {
  const linkCommonProps = {
    uri,
    credentials: "include",
    fetch,
    headers: {
      ...clientApiHeader,
      ...(currentRequestAuth ? { Authorization: currentRequestAuth } : {}),
      Cookie: cookie,
      // Avoids browsers from caching requests
      "Cache-Control": "no-cache, no-store, must-revalidate",
      ...(shouldForceLocale ? { "Force-Locale": "zh_CN" } : null),
    },
  };

  const defaultLink = createHttpLink({
    ...linkCommonProps,
    // using POST for client side requests of a CN locale
    useGETForQueries: shouldUseGetForQueries(locale, isBrowser),
  });

  const postLink = createHttpLink({
    ...linkCommonProps,
    useGETForQueries: false,
  });

  return split(
    operation => {
      return operation.getContext()?.fetchOptions?.method === "POST";
    },
    postLink,
    defaultLink
  );
};

/*
5 mins are set for dev branches. on prod we have LAYER0=true so we set 15s there yet.
*/
const SSR_REQUEST_TIMEOUT_SECODNS = isServerless ? 15 : 5 * 60;
const CLIENT_REQUEST_TIMEOUT_SECONDS = 45;
const TIMEOUT_SECONDS =
  typeof window !== `undefined` ? CLIENT_REQUEST_TIMEOUT_SECONDS : SSR_REQUEST_TIMEOUT_SECODNS;

export const timeoutLink = new ApolloLinkTimeout(1000 * TIMEOUT_SECONDS);

export const errorLinkMiddleware = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      if (extensions?.code === nonAuthorizedCode) return;

      const errorString = `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
        locations
      )}, Path: ${path}`;
      // eslint-disable-next-line no-console
      if (isDev()) console.error(errorString);

      lazyCaptureException(new Error(errorString));
    });
  }

  if (networkError) {
    // skip sending to sentry for failed prefetch requests
    if (
      networkError?.statusCode === 412 ||
      operation.getContext().headers["x-prefetch-key"] ||
      typeof operation.variables?.layer0_prefetch !== "undefined"
    ) {
      return;
    }

    // eslint-disable-next-line no-console
    if (isDev()) console.error(networkError);
    lazyCaptureException(networkError, {
      errorInfo: operation.getContext().headers,
      query: operation.variables,
      operationName: operation.operationName,
    });
  }
});

// Graphcms queries have a "stage" variable which control which datasets is used for the query
// this updates the variable to 'draft' which shows you the preview version of the page
// this also adds a condition to GraphCMS landingpage queries to not get deleted pages
export const getGraphCMSLinkMiddleware = cookie =>
  new ApolloLink((operation, forward) => {
    const varsHasKey = key => Object.keys(operation.variables).includes(key);

    const showPreview = isInPreviewMode(cookie);
    const isGraphCmsQuery = varsHasKey("where") || varsHasKey("sectionWhere");

    if (showPreview && varsHasKey("stage")) {
      // eslint-disable-next-line
    operation.variables.stage = "DRAFT";
    }
    if (isGraphCmsQuery && operation.operationName.includes("landingPage")) {
      // eslint-disable-next-line
      operation.variables.where.isDeleted = false;
    }

    return forward(operation);
  });

export const getSetContextLinkMiddleware = ({
  currentRequestUrl,
  locale,
  pageRoute,
  req,
  isBrowser,
}) =>
  setContext((operation, { headers, ...context }) => {
    const hasMutation =
      operation.query.definitions &&
      operation.query.definitions.some(def => def.operation === "mutation");
    const isNotCached = headers && headers[TravelshiftCustomHeader.SKIP_CACHE] === true;
    const { clientSurrogateKeys, serverSurrogateKeys } = constructClientApiSurrogateKeys({
      operation,
      currentRequestUrl,
      localeCode: locale,
      pageRoute,
      skipUniqueId: hasMutation || isNotCached,
      ssrUrl: req?.url,
      ssrRoute: pageRoute,
    });

    const addHeaders = {
      "x-travelshift-surrogate-key": isBrowser ? clientSurrogateKeys : serverSurrogateKeys,
    };

    if (req?.headers["x-bot"]) {
      // eslint-disable-next-line functional/immutable-data
      addHeaders["User-Agent"] = "Scraper - ignore in logs";
    }

    return {
      ...context,
      headers: {
        ...headers,
        ...addHeaders,
      },
    };
  });

const retryIf = error => {
  const doNotRetryCodes = [500, 412];
  return !!error && !doNotRetryCodes.includes(error.statusCode);
};
export const retryLinkMiddleware = new RetryLink({
  delay: {
    initial: 100,
    max: 2000,
    jitter: true,
  },
  attempts: {
    max: 2,
    retryIf,
  },
});
