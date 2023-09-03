import React from "react";
import { NextPageContext } from "next";

import CountryListQuery from "../hooks/queries/CountryListQuery.graphql";
import { getInitialPropsWithApollo } from "../lib/apollo/initApollo";

import { getLanguageFromContext, getQueryParamsViaLayer0, longCacheHeaders } from "utils/apiUtils";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import Header from "components/features/Header/MainHeader";
import GTECarSearchPageContainer from "components/features/GTECarSearchPage/GTECarSearchPageContainer";
import { Namespaces } from "shared/namespaces";
import { Direction, PageType } from "types/enums";
import {
  doesCarPageHasFilters,
  getCarSearchPageQueryCondition,
} from "components/features/GTECarSearchPage/utils/carSearchPageUtils";
import {
  getCarLandingPageCommonQueries,
  getCarPrefetchedLandingPageDriverQueries,
} from "components/ui/LandingPages/utils/carLandingPageQueryUtils";
import CarProvidersQuery from "components/features/CarSearchPage/queries/CarProvidersQuery.graphql";
import CarPickupLocationsQuery from "components/ui/CarSearchWidget/LocationPicker/queries/CarPickupLocationsQuery.graphql";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import useLandingPageLocaleLinks from "components/ui/LandingPages/hooks/useLandingPageLocaleLinks";
import { ContactUsMobileMargin } from "components/features/ContactUs/ContactUsButton";

const CarSearchPage = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const localeLinks = useLandingPageLocaleLinks(queryCondition);
  return (
    <>
      <Header gteLocaleLinks={localeLinks} />
      <QueryParamProvider>
        <GTECarSearchPageContainer queryCondition={queryCondition} />
      </QueryParamProvider>
    </>
  );
};

CarSearchPage.getInitialProps = getInitialPropsWithApollo(
  PageType.GTE_CAR_SEARCH,
  async (ctx: NextPageContext, apollo) => {
    const locale = getLanguageFromContext(ctx);
    const { asPath } = ctx;
    const normalizesAsPath = cleanAsPathWithLocale(asPath);
    const queryCondition = getCarSearchPageQueryCondition(normalizesAsPath);

    const { dateFrom, dateTo, pickupId, dropoffId, orderBy } = getQueryParamsViaLayer0(ctx);

    const hasFilters = doesCarPageHasFilters({
      dateFrom,
      dateTo,
      pickupId,
      dropoffId,
      orderBy,
    });

    const [carPrefetchedLandingPageDriverQueries, carLandingPageCommonQueries] = await Promise.all([
      getCarPrefetchedLandingPageDriverQueries(apollo, ctx, locale),
      getCarLandingPageCommonQueries(apollo, queryCondition, locale, ctx, hasFilters),
    ]);

    const { queries: prefetchedDriverQueries } = carPrefetchedLandingPageDriverQueries;
    const { queries: carLandingQueries, errorStatusCode: carLandingErrorStatusCode } =
      carLandingPageCommonQueries;

    return {
      queryCondition,
      namespacesRequired: [
        Namespaces.headerNs,
        Namespaces.footerNs,
        Namespaces.carSearchNs,
        Namespaces.commonCarNs,
        Namespaces.commonNs,
        Namespaces.commonSearchNs,
        Namespaces.carNs,
        Namespaces.carBookingWidgetNs,
        Namespaces.reviewsNs,
        Namespaces.carnectNs,
      ],
      queries: [
        ...carLandingQueries,
        ...prefetchedDriverQueries,
        {
          query: CountryListQuery,
          variables: {
            locale,
          },
          context: {
            headers: longCacheHeaders,
          },
        },
        {
          query: CarProvidersQuery,
        },
        {
          query: CarPickupLocationsQuery,
          variables: {
            input: {
              searchQuery: "",
              type: "To",
              limit: 10,
            },
          },
        },
        {
          query: CarPickupLocationsQuery,
          variables: {
            input: {
              searchQuery: "",
              type: "From",
              limit: 10,
            },
          },
        },
      ],
      contactUsButtonPosition: Direction.Right,
      isMobileFooterShown: false,
      contactUsMobileMargin: ContactUsMobileMargin.WithoutFooter,
      errorStatusCode: carLandingErrorStatusCode,
    };
  }
);

export default CarSearchPage;
