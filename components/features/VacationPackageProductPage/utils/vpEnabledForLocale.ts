import { hreflangLocalesByMarketplace } from "components/ui/LandingPages/utils/hreflangLocalesByMarketplace";
import { Marketplace, SupportedLanguages } from "types/enums";

export const vpEnabledForLocale = (activeLocale: SupportedLanguages) =>
  hreflangLocalesByMarketplace[Marketplace.GUIDE_TO_EUROPE]!.some(
    enabledLocale => activeLocale === enabledLocale
  );
