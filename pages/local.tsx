import React from "react";
import { NextPageContext } from "next";

import Header from "components/features/Header/MainHeader";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import TravelCommunityContainer from "components/features/TravelCommunity/TravelCommunityContainer";
import { Namespaces } from "shared/namespaces";
import { getTravelCommunityQueries } from "components/features/TravelCommunity/utils/travelCommunityUtils";
import { LandingPageType, PageType, Direction } from "types/enums";
import { cleanAsPath, removeEnCnLocaleCode } from "utils/routerUtils";
import { getLanguageFromContext } from "utils/apiUtils";

const LocalTravelCommunityPage = () => {
  return (
    <>
      <Header />
      <QueryParamProvider>
        <TravelCommunityContainer isLocals />
      </QueryParamProvider>
    </>
  );
};

LocalTravelCommunityPage.getInitialProps = async (ctx: NextPageContext) => {
  const locale = getLanguageFromContext(ctx);
  const slug = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);
  const queries = getTravelCommunityQueries({
    slug,
    pageType: PageType.LOCALCOMMUNITY,
    landingPageType: LandingPageType.LOCALBLOGGERS,
  });
  return {
    namespacesRequired: [
      Namespaces.commonNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.commonSearchNs,
      Namespaces.travelCommunityNs,
      Namespaces.reviewsNs,
      Namespaces.countryNs,
    ],
    queries,
    contactUsButtonPosition: Direction.Right,
  };
};

export default LocalTravelCommunityPage;
