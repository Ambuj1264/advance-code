import React, { FunctionComponent } from "react";
import { CacheProvider as EmotionCacheProvider } from "@emotion/core";
import createCache from "@emotion/cache";
import App from "next/app";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import SassStyleContext from "isomorphic-style-loader/StyleContext";
import smoothscroll from "smoothscroll-polyfill";
import { DocumentContext } from "next/document";
import { Router } from "next/router";

import { GlobalContextProvider } from "contexts/GlobalContext";
import withApolloClient from "lib/apollo/withApolloClient.jsx";
import lazyCaptureException, { SENTRY_INIT } from "lib/lazyCaptureException";
import AppContainer from "components/features/App/AppContainer";
import { Provider as LocaleContextProvider } from "contexts/LocaleContext";
import { SupportedLanguages } from "types/enums";
import { RouterContext, routerContextFactory } from "contexts/RouterContext";

if (typeof window !== "undefined") smoothscroll.polyfill();

function globalErrorHandler(e: ErrorEvent) {
  if (!SENTRY_INIT) {
    lazyCaptureException(e.error || new Error(e.message));
  }
  window.removeEventListener("error", globalErrorHandler);
}

type CustomAppProps = {
  Component: any;
  pageProps: any;
  apolloClient: ApolloClient<any>;
  insertCss(...styles: any[]): any;
  locale?: SupportedLanguages;
  absoluteUrl: string;
  emotionCache: any;
  errorStatusCode?: number;
  ctx: DocumentContext;
  currentRequestUrl: string;
  optimizeExperiments: ExperimentTypes.OptimizeExperiments;
  isRuntimeProd: boolean;
  router: Router;
  clientNavRef: React.Ref<boolean>;
};

class MyApp extends App<CustomAppProps> {
  private clientNavRef: React.MutableRefObject<boolean | null>;

  constructor(props: CustomAppProps) {
    super(props);

    if (typeof window !== "undefined") {
      // adding global event listener in case sentry was not loaded yet
      window.addEventListener("error", globalErrorHandler);
    }
    this.clientNavRef = React.createRef<boolean>();
    this.clientNavRef.current = false;
  }

  componentWillUnmount() {
    window.removeEventListener("error", globalErrorHandler);
  }

  componentDidCatch(error: any, errorInfo: any) {
    lazyCaptureException(error, { errorInfo });
  }

  render() {
    const {
      Component,
      pageProps,
      apolloClient,
      locale,
      absoluteUrl,
      emotionCache,
      errorStatusCode,
      ctx,
      currentRequestUrl,
      optimizeExperiments,
      isRuntimeProd,
    } = this.props;
    const ServerDummySassStyleContextProvider: FunctionComponent = ({ children }) =>
      children as React.ReactElement;
    const SassStyleContextProvider =
      typeof window !== "undefined"
        ? SassStyleContext.Provider
        : ServerDummySassStyleContextProvider;
    const cache =
      emotionCache ??
      createCache({
        key: "x",
      });

    return (
      <EmotionCacheProvider value={cache}>
        <LocaleContextProvider value={locale || SupportedLanguages.English}>
          <SassStyleContextProvider value={{ insertCss: () => {} }}>
            <RouterContext.Provider value={routerContextFactory(ctx)}>
              <ApolloProvider client={apolloClient}>
                <GlobalContextProvider isClientNavigation={this.clientNavRef}>
                  <AppContainer
                    Component={Component}
                    pageProps={pageProps}
                    absoluteUrl={absoluteUrl}
                    errorStatusCode={errorStatusCode}
                    ssrI18n={(ctx?.req as any)?.i18n}
                    marketplaceUrl={currentRequestUrl}
                    optimizeExperiments={optimizeExperiments}
                    isRuntimeProd={isRuntimeProd}
                    clientNavRef={this.clientNavRef}
                  />
                </GlobalContextProvider>
              </ApolloProvider>
            </RouterContext.Provider>
          </SassStyleContextProvider>
        </LocaleContextProvider>
      </EmotionCacheProvider>
    );
  }
}

export default withApolloClient(MyApp);
