import React from "react";
import { useQuery } from "@apollo/react-hooks";

import LatestTipsQuery from "./queries/LatestTipsQuery.graphql";
import { constructTips } from "./utils/travelCommunityUtils";

import useCountry from "hooks/useCountry";
import { useTranslation } from "i18n";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import TopTravelAdviceContainer from "components/ui/TopTravelAdviceContainer/TopTravelAdviceContainer";
import { Namespaces } from "shared/namespaces";
import { PageType } from "types/enums";
import useActiveLocale from "hooks/useActiveLocale";

const LatestTips = ({ isLocals }: { isLocals: boolean }) => {
  const { t } = useTranslation(Namespaces.travelCommunityNs);
  const isMobile = useIsMobile();
  const activeLocale = useActiveLocale();
  const { country } = useCountry();
  const { data, error } = useQuery<TravelCommunityTypes.QueryLatestTips>(LatestTipsQuery, {
    variables: {
      type: isLocals ? PageType.LOCALCOMMUNITY : PageType.TRAVELCOMMUNITY,
    },
  });
  if (!data || !data.latestTips || error) return null;
  const latestTips = constructTips(data.latestTips, activeLocale);
  const metadata = {
    title: isLocals ? t("Latest tips") : t("Newest Travel Blogs"),
    subtitle: t(`Get all the essential travel information and tips for {country}`, {
      country,
    }),
  };
  return (
    <TopTravelAdviceContainer
      articles={latestTips}
      metadata={metadata}
      usePagination={!isMobile}
      pageType={PageType.BLOG}
    />
  );
};

export default LatestTips;
