import React from "react";
import { NextPageContext } from "next";

import Header from "components/features/Header/MainHeader";
import { cleanAsPath, removeEnCnLocaleCode } from "utils/routerUtils";
import AccommodationLandingContainer from "components/features/AccommodationSearchPage/AccommodationLandingContainer";
import { Namespaces } from "shared/namespaces";
import { Direction, LandingPageType } from "types/enums";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import PopularAccommodationQuery from "components/features/AccommodationSearchPage/queries/PopularAccommodationQuery.graphql";
import { getAccommodationSearchAndCategoryQueries } from "components/features/AccommodationSearchPage/utils/accommodationSearchUtils";
import { getLanguageFromContext, getSlugFromContext } from "utils/apiUtils";

const AccommodationSearchPage = () => {
  return (
    <>
      <Header />
      <QueryParamProvider>
        <AccommodationLandingContainer />
      </QueryParamProvider>
    </>
  );
};

AccommodationSearchPage.getInitialProps = async (ctx: NextPageContext) => {
  const slug = getSlugFromContext(ctx);
  const locale = getLanguageFromContext(ctx);
  const path = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);
  const queries: AccommodationSearchTypes.Query[] = [
    {
      query: PopularAccommodationQuery,
      isRequiredForPageRendering: true,
    },
    ...getAccommodationSearchAndCategoryQueries({
      slug,
      path,
      landingPageType: LandingPageType.HOTELS,
    }),
  ];
  return {
    namespacesRequired: [
      Namespaces.commonNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.commonSearchNs,
      Namespaces.accommodationSearchNs,
      Namespaces.accommodationNs,
      Namespaces.accommodationBookingWidgetNs,
    ],
    queries,
    contactUsButtonPosition: Direction.Right,
    isMobileFooterShown: false,
  };
};

export default AccommodationSearchPage;
