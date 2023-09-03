import React from "react";
import { NextPageContext } from "next";

import { getInitialPropsWithApollo } from "../lib/apollo/initApollo";

import { getLanguageFromContext } from "utils/apiUtils";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import GTETourLandingContainer from "components/features/GTETourSearchPage/GTETourLandingContainer";
import Header from "components/features/Header/MainHeader";
import { Namespaces } from "shared/namespaces";
import { Direction, PageType } from "types/enums";
import { getTourSearchPageQueryCondition } from "components/features/GTETourSearchPage/utils/gteTourSearchUtils";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import useLandingPageLocaleLinks from "components/ui/LandingPages/hooks/useLandingPageLocaleLinks";
import { ContactUsMobileMargin } from "components/features/ContactUs/ContactUsButton";
import { getTourLandingPageCommonQueries } from "components/ui/LandingPages/utils/tourLandingPageQueryUtils";

const GTETourSearchPage = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const localeLinks = useLandingPageLocaleLinks(queryCondition);
  return (
    <>
      <Header gteLocaleLinks={localeLinks} />
      <QueryParamProvider>
        <GTETourLandingContainer queryCondition={queryCondition} />
      </QueryParamProvider>
    </>
  );
};

GTETourSearchPage.getInitialProps = getInitialPropsWithApollo(
  PageType.GTE_TOUR_SEARCH,
  async (ctx: NextPageContext, apollo) => {
    const locale = getLanguageFromContext(ctx);
    const { asPath } = ctx;
    const normalizesAsPath = cleanAsPathWithLocale(asPath);
    const queryCondition = getTourSearchPageQueryCondition(normalizesAsPath);
    const { queries, errorStatusCode } = await getTourLandingPageCommonQueries(
      apollo,
      queryCondition,
      locale,
      ctx
    );

    return {
      queryCondition,
      namespacesRequired: [
        Namespaces.headerNs,
        Namespaces.commonSearchNs,
        Namespaces.countryNs,
        Namespaces.commonNs,
        Namespaces.footerNs,
        Namespaces.tourSearchNs,
        Namespaces.tourNs,
      ],
      queries,
      contactUsButtonPosition: Direction.Right,
      contactUsMobileMargin: ContactUsMobileMargin.WithoutFooter,
      errorStatusCode,
    };
  }
);

export default GTETourSearchPage;
