import getConfig from "next/config";
import waitForServiceWorker from "@layer0/prefetch/window/waitForServiceWorker";
import Router from "next/router";
import { ApolloClient, ApolloError } from "apollo-client";

import { fetchPageQueries } from "../lib/apollo/withApolloClient";
import lazyCaptureException from "../lib/lazyCaptureException";

import { QueryParamsViaLayer0Type, isApolloErrorTimeout } from "./apiUtils";

import { i18next } from "i18n";
import { SupportedLanguages } from "types/enums";

const { isServerless, dev } = getConfig().publicRuntimeConfig;

const prefetchUrls = new Set();

export async function prefetchLegacyRoute(path: string, locale: string) {
  try {
    await waitForServiceWorker();
    navigator.serviceWorker.controller?.postMessage({
      action: "cache-path",
      cacheLinks: false,
      path,
      apiVersion: process.env.APP_VERSION, // note: APP_VERSION cannot be destructured(DefinePlugin / env next),
      locale,
    });
  } catch (e) {
    //
  }
}

export const abortSwPrefetch = async (key: string) => {
  try {
    await waitForServiceWorker();
    navigator.serviceWorker.controller?.postMessage({
      action: "abort-prefetch",
      key,
    });
  } catch (e) {
    //
  }
};

export const clearOldSWApiCaches = async (activeLocale: SupportedLanguages) => {
  try {
    await waitForServiceWorker();
    navigator.serviceWorker.controller?.postMessage({
      action: "clear-old-cache",
      apiVersion: process.env.APP_VERSION, // note: APP_VERSION cannot be destructured(DefinePlugin / env next),
      locale: activeLocale,
    });
  } catch {
    //
  }
};

const isApolloErrorCancelled = (res: Response) =>
  res instanceof ApolloError && res.message?.toLowerCase().includes("failed to fetch");

export const prefetchRouteData = async (
  route: string,
  as: string,
  ctx: { query?: QueryParamsViaLayer0Type },
  apolloClient: ApolloClient<object>,
  prefetchQueries: boolean,
  abortController?: AbortController
) => {
  const key = as;
  // do nothing when not on XDN and for dev mode or link has already been prefetched
  if (!isServerless || dev || prefetchUrls.has(key)) return;

  try {
    await waitForServiceWorker();
  } catch (e) {
    //
  }

  // prefetch route js files
  Router.prefetch(route, as);
  const routeComponent: any = await Router.router?.fetchComponent(route);

  if (routeComponent?.page?.getInitialProps) {
    prefetchUrls.add(key);

    try {
      const props = await routeComponent.page.getInitialProps(ctx);

      // prefetch page queries
      if (prefetchQueries) {
        if (abortController?.signal.aborted) {
          return;
        }

        const res = await fetchPageQueries({
          key,
          pageQueries: props.queries,
          apollo: apolloClient,
          // eslint-disable-next-line no-underscore-dangle
          locale: window.__NEXT_DATA__.props?.initialLanguage,
          ctx,
          shouldManuallyCheckForRedirect: props.redirectCheck,
          isPrefetch: true,
          abortController,
          namespacesRequired: props.namespacesRequired,
        });

        // prefetch was cancelled - can be restarted
        if (isApolloErrorTimeout(res) || isApolloErrorCancelled(res)) {
          prefetchUrls.delete(key);
        }
      }
      // prefetch page namespaces
      i18next.loadNamespaces(props.namespacesRequired);
    } catch (e) {
      lazyCaptureException(e as any, ctx);
    }
  }
};
