type QueryMarketplaceConfig = Readonly<{
  marketplaceConfig: {
    url: string;
    adminUrl: string;
    websiteName: string;
    countryCode: string;
    marketplace: import("types/enums").Marketplace;
    theme: Theme;
    imageHostingUrl?: string;
    optimizeExperiments: ExperimentTypes.OptimizeExperiments;
    facebookAppId: string;
    googleApiKey: string;
    baiduApiKey: string | null;
    isGoogleOneTapLoginEnabled: boolean;
    frontTopServices: SharedTypes.PageCategories;
    marketplaceCurrency: import("types/enums").SupportedCurrencies;
    cookiebotId?: string;
    facebookPixelId?: string;
    googleTagManagerId?: string;
    newGoogleTagManagerId?: string;
    googleClientId?: string;
  };
}>;

type QueryLocaleData = Readonly<{
  activeLocale?: AppLocale;
}>;
