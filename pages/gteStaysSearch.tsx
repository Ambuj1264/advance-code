import React from "react";
import { NextPageContext } from "next";

import { getInitialPropsWithApollo } from "../lib/apollo/initApollo";

import { getLanguageFromContext } from "utils/apiUtils";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import StaysLandingContainer from "components/features/StaysSearch/StaysLandingContainer";
import Header from "components/features/Header/MainHeader";
import { Namespaces } from "shared/namespaces";
import { Direction, PageType } from "types/enums";
import { getStaysSearchPageQueryCondition } from "components/features/StaysSearch/utils/staysSearchPageUtils";
import { getStayLandingPageCommonQueries } from "components/ui/LandingPages/utils/stayLandingPageQueryUtils";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import useLandingPageLocaleLinks from "components/ui/LandingPages/hooks/useLandingPageLocaleLinks";
import { ContactUsMobileMargin } from "components/features/ContactUs/ContactUsButton";

const StaysSearchPage = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const localeLinks = useLandingPageLocaleLinks(queryCondition);
  return (
    <>
      <Header gteLocaleLinks={localeLinks} />
      <QueryParamProvider>
        <StaysLandingContainer queryCondition={queryCondition} />
      </QueryParamProvider>
    </>
  );
};

StaysSearchPage.getInitialProps = getInitialPropsWithApollo(
  PageType.GTE_STAYS_SEARCH,
  async (ctx: NextPageContext, apollo) => {
    const locale = getLanguageFromContext(ctx);
    const { asPath } = ctx;
    const normalizesAsPath = cleanAsPathWithLocale(asPath);
    const queryCondition = getStaysSearchPageQueryCondition(normalizesAsPath);
    const { queries, errorStatusCode } = await getStayLandingPageCommonQueries(
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
        Namespaces.accommodationSearchNs,
        Namespaces.accommodationNs,
        Namespaces.accommodationBookingWidgetNs,
        Namespaces.commonNs,
        Namespaces.footerNs,
      ],
      queries,
      contactUsButtonPosition: Direction.Right,
      isMobileFooterShown: false,
      contactUsMobileMargin: ContactUsMobileMargin.WithoutFooter,
      errorStatusCode,
    };
  }
);

export default StaysSearchPage;
