import { useQuery } from "@apollo/react-hooks";
import { useMemo } from "react";

import { getHrefLangLocales } from "../utils/landingPageUtils";

import { constructCommonLandingHreflangs } from "components/ui/utils/uiUtils";
import LandingPageMetadataQuery from "components/ui/LandingPages/queries/LandingPageMetadataQuery.graphql";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import { SupportedLanguages } from "types/enums";
import { emptyArray } from "utils/constants";

const useLandingPageLocaleLinks = (
  landingPageQueryCondition: LandingPageTypes.LandingPageQueryCondition,
  hrefLangLocales?: SupportedLanguages[]
) => {
  const locale = useActiveLocale();
  const { marketplaceUrl, marketplace } = useSettings();

  const { data } = useQuery<LandingPageTypes.LandingPageMetadataQueryData>(
    LandingPageMetadataQuery,
    {
      variables: {
        where: landingPageQueryCondition,
        locale: normalizeGraphCMSLocale(locale),
        hrefLandLocales: hrefLangLocales || getHrefLangLocales(marketplace),
      },
    }
  );
  const hreflangs = useMemo(
    () =>
      constructCommonLandingHreflangs(
        data?.metadata?.[0]?.hreflangs ?? (emptyArray as unknown as Hreflang[]),
        marketplaceUrl,
        marketplace,
        [
          {
            old: SupportedLanguages.LegacyChinese,
            new: SupportedLanguages.Chinese,
          },
        ]
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.metadata]
  );
  return hreflangs;
};

export default useLandingPageLocaleLinks;
