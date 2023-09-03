import React from "react";
import { NextPageContext } from "next";

import GTETourMetadataQuery from "../components/features/GTETourProductPage/queries/GTETourMetadataQuery.graphql";
import { getLanguageFromContext } from "../utils/apiUtils";
import TourContentQuery from "../components/features/GTETourProductPage/queries/TourContentQuery.graphql";
import { normalizeGraphCMSLocale } from "../utils/helperUtils";
import { getInitialPropsWithApollo } from "../lib/apollo/initApollo";
import { getPrefetchedData } from "../lib/apollo/getPrefetchedData";
import GTESimilarToursQuery from "../components/features/GTETourProductPage/queries/GTESimilarToursQuery.graphql";

import { hreflangLocalesByMarketplace } from "components/ui/LandingPages/utils/hreflangLocalesByMarketplace";
import useGTETourProductPageLocaleLinks from "components/features/GTETourProductPage/useGTETourProductLocaleLinks";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import GTETourContainer from "components/features/GTETourProductPage/GTETourContainer";
import Header from "components/features/Header/MainHeader";
import { Namespaces } from "shared/namespaces";
import { Direction, PageType, Marketplace } from "types/enums";
import { getTourProductPageQueryCondition } from "components/features/GTETourProductPage/utils/gteTourUtils";
import { ContactUsMobileMargin } from "components/features/ContactUs/ContactUsButton";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import { getSimilarToursInput } from "components/features/GTETourProductPage/useGTESimilarTours";

const GTETourProductPage = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const localeLinks = useGTETourProductPageLocaleLinks(queryCondition);
  return (
    <>
      <Header gteLocaleLinks={localeLinks} />
      <QueryParamProvider>
        <GTETourContainer queryCondition={queryCondition} />
      </QueryParamProvider>
    </>
  );
};

GTETourProductPage.getInitialProps = getInitialPropsWithApollo(
  PageType.GTE_TOUR,
  async (ctx: NextPageContext, apollo) => {
    const { asPath, query } = ctx;
    const normalizesAsPath = cleanAsPathWithLocale(asPath);
    const queryCondition = getTourProductPageQueryCondition(normalizesAsPath);
    const locale = getLanguageFromContext(ctx);
    const { result: prefetchedData, errorStatusCode } = await getPrefetchedData(apollo, ctx, {
      query: TourContentQuery,
      variables: {
        where: queryCondition,
        locale,
        isDisabled: false,
      },
    });
    const tourProductPage = prefetchedData?.data?.tourProductPages?.[0];
    const tourId = tourProductPage?.tourId;
    const startingLocationId = tourProductPage?.startPlace?.tourId;
    const adults = Number(query?.adults ?? 1);
    const children = Number(query?.children ?? 0);
    const requestId = query ? (query.requestId as string) : undefined;
    const from = query ? (query.dateFrom as string) : undefined;
    const similarToursInput = getSimilarToursInput({
      startingLocationId,
      from,
      to: from,
      adults,
      children,
      requestId,
      productId: tourId,
    });
    return {
      queryCondition,
      namespacesRequired: [
        Namespaces.headerNs,
        Namespaces.countryNs,
        Namespaces.commonBookingWidgetNs,
        Namespaces.commonNs,
        Namespaces.footerNs,
        Namespaces.tourBookingWidgetNs,
        Namespaces.tourNs,
        Namespaces.reviewsNs,
      ],
      queries: [
        {
          query: GTETourMetadataQuery,
          variables: {
            where: queryCondition,
            locale: [normalizeGraphCMSLocale(locale)],
            hrefLangLocales: hreflangLocalesByMarketplace[Marketplace.GUIDE_TO_EUROPE],
            isRequiredForPageRendering: true,
          },
        },
        ...(startingLocationId
          ? [
              {
                query: GTESimilarToursQuery,
                variables: similarToursInput,
              },
            ]
          : []),
      ],
      contactUsButtonPosition: Direction.Left,
      contactUsMobileMargin: ContactUsMobileMargin.WithoutFooter,
      errorStatusCode,
    };
  }
);

export default GTETourProductPage;
