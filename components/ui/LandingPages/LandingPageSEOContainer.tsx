import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { getHrefLangLocales, constructMetadata } from "./utils/landingPageUtils";

import { useSettings } from "contexts/SettingsContext";
import LandingPageMetadataQuery from "components/ui/LandingPages/queries/LandingPageMetadataQuery.graphql";
import useActiveLocale from "hooks/useActiveLocale";
import { GraphCMSPageType, OpenGraphType } from "types/enums";
import GraphCmsSEOContainer from "components/ui/GraphCmsSEOContainer";
import { normalizeGraphCMSLocale } from "utils/helperUtils";

const LandingPageSEOContainer = ({
  queryCondition,
  isIndexed = true,
  ogImages,
  funnelType,
  pagePlace,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  isIndexed?: boolean;
  ogImages?: Image[];
  funnelType?: GraphCMSPageType;
  pagePlace?: LandingPageTypes.Place;
}) => {
  const locale = useActiveLocale();
  const { marketplace } = useSettings();
  const { data } = useQuery<LandingPageTypes.LandingPageMetadataQueryData>(
    LandingPageMetadataQuery,
    {
      variables: {
        where: queryCondition,
        locale: normalizeGraphCMSLocale(locale),
        hrefLandLocales: getHrefLangLocales(marketplace),
      },
    }
  );

  if (!data?.metadata?.[0]) {
    return null;
  }

  const metadata = data?.metadata?.[0];
  return (
    <GraphCmsSEOContainer
      metadata={constructMetadata(metadata)}
      isIndexed={isIndexed}
      ogImages={ogImages}
      openGraphType={OpenGraphType.WEBSITE}
      funnelType={funnelType}
      pagePlace={pagePlace}
    />
  );
};

export default LandingPageSEOContainer;
