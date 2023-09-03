import React from "react";
import { NextPageContext } from "next";

import { getInitialPropsWithApollo } from "../lib/apollo/initApollo";

import useStayProductPageLocaleLinks from "components/features/StayProductPage/useStayProductLocaleLinks";
import { getLanguageFromContext } from "utils/apiUtils";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import StayContainer from "components/features/StayProductPage/StayContainer";
import Header from "components/features/Header/MainHeader";
import { Namespaces } from "shared/namespaces";
import { Direction, PageType } from "types/enums";
import { getStayProductPageQueryCondition } from "components/features/StayProductPage/utils/stayUtils";
import { ContactUsMobileMargin } from "components/features/ContactUs/ContactUsButton";
import { getStayProductPageQueries } from "components/features/StayProductPage/utils/stayQueryUtils";

const StaysProductPage = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const localeLinks = useStayProductPageLocaleLinks(queryCondition);
  return (
    <>
      <Header gteLocaleLinks={localeLinks} />
      <StayContainer queryCondition={queryCondition} />
    </>
  );
};

StaysProductPage.getInitialProps = getInitialPropsWithApollo(
  PageType.GTE_STAY,
  async (ctx: NextPageContext, apollo) => {
    const locale = getLanguageFromContext(ctx);
    const { asPath } = ctx;
    const normalizesAsPath = cleanAsPathWithLocale(asPath);
    const queryCondition = getStayProductPageQueryCondition(normalizesAsPath);
    const { queries, errorStatusCode } = await getStayProductPageQueries(
      apollo,
      queryCondition,
      locale,
      ctx
    );

    return {
      queryCondition,
      namespacesRequired: [
        Namespaces.headerNs,
        Namespaces.countryNs,
        Namespaces.accommodationBookingWidgetNs,
        Namespaces.accommodationNs,
        Namespaces.commonBookingWidgetNs,
        Namespaces.commonNs,
        Namespaces.accommodationSearchNs,
        Namespaces.footerNs,
      ],
      queries,
      contactUsButtonPosition: Direction.Left,
      contactUsMobileMargin: ContactUsMobileMargin.WithoutFooter,
      errorStatusCode,
    };
  }
);

export default StaysProductPage;
