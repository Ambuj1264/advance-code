import React, { useEffect } from "react";
import { PublicConfigAPI } from "react-imgix";
// eslint-disable-next-line no-restricted-imports
import LazyHydrate from "react-lazy-hydration";
import { useQuery } from "@apollo/react-hooks";
import { css, Global } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import { register } from "next-offline/runtime";
import keyboardOnlyOutlines from "@moxy/keyboard-only-outlines";
import { useRouter } from "next/router";
import getConfig from "next/config";
import { I18nextProvider } from "react-i18next";
import { i18n } from "i18next";
import styled from "@emotion/styled";

import marketplaceConfigQuery from "./graphql/MarketplaceConfigQuery.graphql";
import { OnRoutesChangeHandlers } from "./OnProtectedRoutes";

import { Namespaces } from "shared/namespaces";
import getGlobalStyles from "styles/global?ssrOnly";
import { getMarketplaceHostWithGTICn } from "utils/routerUtils";
import {
  getMarketplaceFromUrl,
  getCurrencyFromMarketPlace,
  longCacheHeaders,
} from "utils/apiUtils";
import useEffectOnScrollMobile from "hooks/useEffectOnScrollMobile";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import CustomNextDynamic from "lib/CustomNextDynamic";
import ContactUsLoader from "components/features/ContactUs/ContactUsLoader";
import Footer from "components/features/Footer/FooterWrapper";
import UsersnapLoader from "components/ui/Usersnap/UsersnapLoader";
import { SettingsProvider } from "contexts/SettingsContext";
import { isDev } from "utils/globalUtils";
import { ExperimentContextProvider } from "components/ui/Experiments/ExperimentContext";
import ErrorPage from "pages/_error";
import { MobileFooterContextProvider } from "contexts/MobileFooterContext";
import ErrorBoundary from "components/ui/ErrorBoundary";
import { Direction, Marketplace } from "types/enums";
import { intercomConfig } from "utils/constants";
import useActiveLocale from "hooks/useActiveLocale";
import useGraphCMSNamespace from "lib/useGraphCMSNamespaces";
import { i18next } from "i18n";
import { isTouchDevice } from "utils/helperUtils";
import useEffectOnce from "hooks/useEffectOnce";
import { clearOldSWApiCaches } from "utils/swUtils";
import { ModalHistoryProvider } from "contexts/ModalHistoryContext";
import ErrorComponent from "components/ui/Error/ErrorComponent";
import useOnSoftKeyboardStateChange from "hooks/useOnSoftKeyboardStateChange";
import useGoogleTagManager from "components/ui/Tracking/useGoogleTagManager";

const { SERVICE_WORKER_DEV_MODE, NODE_ENV } = getConfig().publicRuntimeConfig;

const GridOverlay = CustomNextDynamic(() => import("components/ui/Grid/GridOverlay"), {
  ssr: false,
  loading: () => null,
});

export const defaultTheme: Theme = {
  colors: {
    primary: "#336699",
    action: "#33ab63",
  },
};

PublicConfigAPI.disableWarning("fallbackImage");

const ContentWrapper = styled.div(css`
  display: flex;
  flex-flow: column;
  min-height: 100vh;

  #content {
    flex: 1 0 auto;
  }
`);

const OnSoftKeyboardStateChange = () => {
  useOnSoftKeyboardStateChange();

  return null;
};

const AppContainer = ({
  Component,
  pageProps = {},
  absoluteUrl,
  errorStatusCode,
  ssrI18n,
  marketplaceUrl,
  optimizeExperiments,
  isRuntimeProd,
  clientNavRef,
}: {
  Component: any;
  pageProps?: any;
  absoluteUrl: string;
  errorStatusCode?: number;
  ssrI18n?: i18n;
  marketplaceUrl: string;
  optimizeExperiments: ExperimentTypes.OptimizeExperiments;
  isRuntimeProd: boolean;
  clientNavRef: React.MutableRefObject<boolean | null>;
}) => {
  const router = useRouter();
  const isAssetError = router.asPath.match(/\.(js|png|svg|webp|json)$/g);
  const activeLocale = useActiveLocale();
  const isMobile = useIsMobile();

  const { namespacesRequired = [] } = pageProps;
  const namespaces = [Namespaces.errorNs, ...namespacesRequired];

  useEffectOnce(() => {
    clearOldSWApiCaches(activeLocale);
  });

  // on SSR we set i18nBundle property, which is then used on client to avoid using apollo cache for namespaces
  if (typeof window === "undefined") {
    // eslint-disable-next-line functional/immutable-data,no-param-reassign,react-hooks/rules-of-hooks
    pageProps.i18nBundle = useGraphCMSNamespace(namespaces, ssrI18n);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGraphCMSNamespace(namespaces, ssrI18n, pageProps.i18nBundle);
  }

  const { error, data, loading } = useQuery<QueryMarketplaceConfig>(marketplaceConfigQuery, {
    variables: { url: marketplaceUrl },
    skip: !marketplaceUrl,
    context: {
      header: longCacheHeaders,
    },
  });

  const theme =
    error || !data?.marketplaceConfig?.theme ? defaultTheme : data?.marketplaceConfig?.theme;

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const shouldRegisterServiceWorker =
      SERVICE_WORKER_DEV_MODE === "true" || NODE_ENV === "production";
    if (shouldRegisterServiceWorker) {
      register(`/sw.js`);
    }

    if (!isTouchDevice()) {
      const elementsToDisableOutlineOnFocus = "#__next input,textarea,button";
      return keyboardOnlyOutlines({
        styles: `${elementsToDisableOutlineOnFocus}:focus {outline: none !important}${elementsToDisableOutlineOnFocus}::-moz-focus-inner {border: none !important}`,
      });
    }

    if (!isMobile) {
      // eslint-disable-next-line functional/immutable-data
      window.lazySizesConfig.expand = 800;
      // eslint-disable-next-line functional/immutable-data
      window.lazySizesConfig.expFactor = 2;
    }
  }, [isMobile]);

  useEffectOnScrollMobile(() => {
    // eslint-disable-next-line functional/immutable-data
    window.lazySizesConfig.expand = 500;
    // eslint-disable-next-line functional/immutable-data
    window.lazySizesConfig.expFactor = 2;
  });
  const fallBackMarketPlace = getMarketplaceFromUrl(marketplaceUrl);

  const {
    adminUrl,
    marketplace,
    countryCode,
    googleTagManagerId,
    newGoogleTagManagerId,
    googleClientId,
    facebookAppId,
    googleApiKey,
    baiduApiKey,
    isGoogleOneTapLoginEnabled,
    imageHostingUrl,
    websiteName,
    url,
    marketplaceCurrency,
  } = data?.marketplaceConfig || {
    adminUrl: "https://admin.guidetoiceland.is",
    marketplace: fallBackMarketPlace,
    countryCode: "IS",
    trackingIds: {},
    facebookAppId: "",
    googleApiKey: "",
    baiduApiKey: null,
    isGoogleOneTapLoginEnabled: false,
    imageHostingUrl: undefined,
    marketplaceCurrency: getCurrencyFromMarketPlace(fallBackMarketPlace),
    websiteName: "Travel marketplace",
    url: marketplaceUrl || "https://guidetoiceland.is",
  };

  useGoogleTagManager(
    marketplace === Marketplace.GUIDE_TO_EUROPE,
    marketplace === Marketplace.GUIDE_TO_ICELAND
  );

  if (isAssetError) {
    return <div>404 - Not found</div>;
  }
  const host = getMarketplaceHostWithGTICn(activeLocale, url);
  const isDevVar = !isDev();

  return (
    <ErrorBoundary ErrorComponent={ErrorComponent}>
      <I18nextProvider i18n={ssrI18n || i18next}>
        <SettingsProvider
          adminUrl={adminUrl}
          host={host}
          marketplace={marketplace as Marketplace}
          countryCode={countryCode}
          absoluteUrl={absoluteUrl}
          websiteName={websiteName}
          marketplaceUrl={url}
          facebookAppId={facebookAppId}
          googleApiKey={googleApiKey}
          baiduApiKey={baiduApiKey}
          isGoogleOneTapLoginEnabled={isGoogleOneTapLoginEnabled}
          imageHostingUrl={imageHostingUrl}
          marketplaceBaseCurrency={marketplaceCurrency}
          googleTagManagerId={googleTagManagerId}
          newGoogleTagManagerId={newGoogleTagManagerId}
          googleClientId={googleClientId}
          isRuntimeProd={isRuntimeProd}
          mapboxAccessToken="pk.eyJ1Ijoic2lndXJkdXJndWRiciIsImEiOiJjbDhjeTh6NGIwNTI4M3ZuemQ1cGlrcjlmIn0.Ex3FDde1nJ3HwdiVlEL7JA"
        >
          <ExperimentContextProvider optimizeExperiments={optimizeExperiments}>
            <MobileFooterContextProvider
              isMobileFooterShown={pageProps.isMobileFooterShown ?? true}
              isContactUsHidden={pageProps.isContactUsHidden}
              contactUsButtonPosition={
                isMobile ? Direction.Right : pageProps.contactUsButtonPosition
              }
            >
              <ModalHistoryProvider>
                <ThemeProvider theme={theme}>
                  <LazyHydrate ssrOnly>
                    <Global styles={getGlobalStyles(theme)} />
                  </LazyHydrate>
                  {(!pageProps.isContactUsHidden || pageProps.contactUsButtonPosition) && (
                    <ModalHistoryProvider>
                      <ContactUsLoader
                        pageProps={pageProps}
                        useIntercom={!!intercomConfig[marketplace] && isRuntimeProd}
                      />
                    </ModalHistoryProvider>
                  )}
                  <OnSoftKeyboardStateChange />
                  <OnRoutesChangeHandlers
                    marketplaceDataLoading={loading}
                    marketplaceUrl={marketplaceUrl}
                    marketplaceData={data}
                    clientNavRef={clientNavRef}
                  />
                  <ContentWrapper>
                    <div id="content">
                      {!errorStatusCode ? (
                        <ErrorBoundary ErrorComponent={ErrorComponent}>
                          <Component {...pageProps} />
                        </ErrorBoundary>
                      ) : (
                        <ErrorPage statusCode={errorStatusCode} />
                      )}
                    </div>
                    {!pageProps.hidePageFooter && (
                      <Footer
                        theme={theme}
                        showTopServices={!pageProps.isTopServicesHidden}
                        showSubscriptionForm={!pageProps.isSubscriptionFormHidden}
                      />
                    )}
                    {isDevVar && <GridOverlay />}
                  </ContentWrapper>
                  <UsersnapLoader />
                </ThemeProvider>
              </ModalHistoryProvider>
            </MobileFooterContextProvider>
          </ExperimentContextProvider>
        </SettingsProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
};

export default AppContainer;
