import { useQuery } from "@apollo/react-hooks";

import StayMetadataQuery from "./queries/StayMetadataQuery.graphql";

import { constructHreflangs } from "components/ui/utils/uiUtils";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import { hreflangLocalesByMarketplace } from "components/ui/LandingPages/utils/hreflangLocalesByMarketplace";

const useStayProductPageLocaleLinks = (
  queryCondition: LandingPageTypes.LandingPageQueryCondition
) => {
  const locale = useActiveLocale();
  const { marketplaceUrl, marketplace } = useSettings();

  const { data } = useQuery<LandingPageTypes.LandingPageMetadataQueryData>(StayMetadataQuery, {
    variables: {
      where: queryCondition,
      locale: normalizeGraphCMSLocale(locale),
      hrefLangLocales: hreflangLocalesByMarketplace[marketplace],
    },
  });
  const hreflangs = constructHreflangs(data?.metadata?.[0]?.hreflangs ?? [], marketplaceUrl);
  return hreflangs;
};

export default useStayProductPageLocaleLinks;
