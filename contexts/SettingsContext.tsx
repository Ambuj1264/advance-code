import React, { createContext, useContext } from "react";

import { Marketplace, SupportedCurrencies } from "types/enums";

type SettingsContext = {
  adminUrl: string;
  host: string;
  marketplace: Marketplace;
  countryCode: string;
  absoluteUrl: string;
  marketplaceUrl: string;
  facebookAppId: string;
  websiteName: string;
  cookiebotId?: string;
  facebookPixelId?: string;
  googleTagManagerId?: string;
  newGoogleTagManagerId?: string;
  googleClientId?: string;
  logo?: ImageWithSizes;
  googleApiKey: string;
  mapboxAccessToken: string;
  baiduApiKey?: string | null;
  isGoogleOneTapLoginEnabled: boolean;
  imageHostingUrl?: string;
  marketplaceBaseCurrency: string;
  isRuntimeProd: boolean;
};

const SettingsContext = createContext<SettingsContext>({
  adminUrl: "",
  host: "",
  marketplace: Marketplace.GUIDE_TO_ICELAND,
  countryCode: "",
  absoluteUrl: "",
  marketplaceUrl: "",
  facebookAppId: "",
  websiteName: "",
  logo: undefined,
  googleApiKey: "",
  mapboxAccessToken: "",
  baiduApiKey: null,
  isGoogleOneTapLoginEnabled: false,
  imageHostingUrl: undefined,
  marketplaceBaseCurrency: SupportedCurrencies.ICELANDIC_KRONA,
  isRuntimeProd: false,
});

const SettingsProvider = ({
  children,
  adminUrl,
  host,
  marketplace,
  countryCode,
  absoluteUrl,
  websiteName,
  marketplaceUrl,
  cookiebotId,
  facebookPixelId,
  googleTagManagerId,
  newGoogleTagManagerId,
  googleClientId,
  facebookAppId,
  logo,
  googleApiKey,
  mapboxAccessToken,
  baiduApiKey,
  isGoogleOneTapLoginEnabled,
  imageHostingUrl,
  marketplaceBaseCurrency,
  isRuntimeProd,
}: SettingsContext & {
  children: any;
}) => {
  return (
    <SettingsContext.Provider
      value={
        /* eslint-disable-next-line react/jsx-no-constructed-context-values */
        {
          adminUrl,
          host,
          marketplace,
          countryCode,
          absoluteUrl,
          websiteName,
          marketplaceUrl,
          facebookAppId,
          cookiebotId,
          facebookPixelId,
          googleTagManagerId,
          newGoogleTagManagerId,
          googleClientId,
          logo,
          googleApiKey,
          mapboxAccessToken,
          baiduApiKey,
          isGoogleOneTapLoginEnabled,
          imageHostingUrl,
          marketplaceBaseCurrency,
          isRuntimeProd,
        }
      }
    >
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = () => useContext<SettingsContext>(SettingsContext);

export { SettingsProvider, useSettings };
