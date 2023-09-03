import React from "react";
import { NextPageContext } from "next";

import Header from "components/features/Header/MainHeader";
import CarSearchCategoriesQuery from "components/features/CarSearchPage/queries/CarSearchCategoriesQuery.graphql";
import CarSearchLinkedCategoriesQuery from "components/features/CarSearchPage/queries/CarSearchLinkedCategoriesQuery.graphql";
import { Namespaces } from "shared/namespaces";
import CarSearchPageContainer from "components/features/CarSearchPage/CarSearchPageContainer";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import { Direction, PageType, LandingPageType } from "types/enums";
import { getCarSearchAndCategoryQueries } from "components/features/CarSearchPage/utils/carSearchUtils";
import { getLanguageFromContext, getMarketplaceUrl } from "utils/apiUtils";
import { cleanAsPath, removeEnCnLocaleCode } from "utils/routerUtils";

const CarSearchPage = () => (
  <>
    <Header />
    <QueryParamProvider>
      <CarSearchPageContainer />
    </QueryParamProvider>
  </>
);

CarSearchPage.getInitialProps = (ctx: NextPageContext) => {
  const locale = getLanguageFromContext(ctx);
  const path = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);
  const marketplaceUrl = getMarketplaceUrl(ctx);

  return {
    namespacesRequired: [
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.carSearchNs,
      Namespaces.commonCarNs,
      Namespaces.commonNs,
      Namespaces.commonSearchNs,
      Namespaces.carNs,
      Namespaces.carBookingWidgetNs,
      Namespaces.carnectNs,
      Namespaces.reviewsNs,
    ],
    queries: [
      { query: CarSearchCategoriesQuery },
      { query: CarSearchLinkedCategoriesQuery },
      ...getCarSearchAndCategoryQueries({
        path,
        pageType: PageType.CAR,
        landingPageType: LandingPageType.CARS,
        marketplaceUrl,
        locale,
      }),
    ],
    contactUsButtonPosition: Direction.Right,
    isMobileFooterShown: false,
  };
};

export default CarSearchPage;
