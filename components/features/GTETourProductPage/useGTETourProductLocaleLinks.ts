import { useQuery } from "@apollo/react-hooks";

import GTETourMetadataQuery from "./queries/GTETourMetadataQuery.graphql";

import { constructHreflangs } from "components/ui/utils/uiUtils";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import { Marketplace } from "types/enums";
import { hreflangLocalesByMarketplace } from "components/ui/LandingPages/utils/hreflangLocalesByMarketplace";

const useGTETourProductPageLocaleLinks = (
  queryCondition: LandingPageTypes.LandingPageQueryCondition
) => {
  const locale = useActiveLocale();
  const { marketplaceUrl } = useSettings();

  const { data } = useQuery<LandingPageTypes.LandingPageMetadataQueryData>(GTETourMetadataQuery, {
    variables: {
      where: queryCondition,
      locale: [normalizeGraphCMSLocale(locale)],
      hrefLangLocales: hreflangLocalesByMarketplace[Marketplace.GUIDE_TO_EUROPE],
    },
  });
  const hreflangs = constructHreflangs(data?.metadata?.[0]?.hreflangs ?? [], marketplaceUrl);
  return hreflangs;
};

export default useGTETourProductPageLocaleLinks;
