import React from "react";
import { NextPageContext } from "next";

import Header from "components/features/Header/MainHeader";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import TravelCommunityContainer from "components/features/TravelCommunity/TravelCommunityContainer";
import { Namespaces } from "shared/namespaces";
import { getTravelCommunityQueries } from "components/features/TravelCommunity/utils/travelCommunityUtils";
import { PageType, LandingPageType } from "types/enums";
import { cleanAsPath, removeEnCnLocaleCode } from "utils/routerUtils";
import { getLanguageFromContext } from "utils/apiUtils";
import { Direction } from "components/ui/ImageCarousel/ImageCarouselArrow";

const TravelCommunityPage = () => {
  return (
    <>
      <Header />
      <QueryParamProvider>
        <TravelCommunityContainer />
      </QueryParamProvider>
    </>
  );
};

TravelCommunityPage.getInitialProps = (ctx: NextPageContext) => {
  const locale = getLanguageFromContext(ctx);
  const slug = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);
  const queries = getTravelCommunityQueries({
    slug,
    pageType: PageType.TRAVELCOMMUNITY,
    landingPageType: LandingPageType.TRAVELBLOGGERS,
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

export default TravelCommunityPage;
