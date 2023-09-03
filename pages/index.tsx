import React from "react";
import { NextPageContext } from "next";

import { getCarPickupCNLangContext } from "../components/ui/CarSearchWidget/useCarPickupLocationQuery";

import CarPickupLocationsQuery from "components/ui/CarSearchWidget/LocationPicker/queries/CarPickupLocationsQuery.graphql";
import LandingPageUriQuery from "components/ui/LandingPages/queries/LandingPageUriQuery.graphql";
import { getMarketplaceLandingPageUriQueryCondition } from "components/features/GTECountryPage/utils/countryPageUtils";
import Header from "components/features/Header/MainHeader";
import CarProvidersQuery from "components/features/CarSearchPage/queries/CarProvidersQuery.graphql";
import SearchCategoryQuery from "components/features/AccommodationSearchPage/queries/AccommodationSearchCategoryQuery.graphql";
import BreadcrumbsQuery from "components/ui/Breadcrumbs/BreadcrumbsQuery.graphql";
import TourSearchStartingLocationsQuery from "components/features/SearchPage/queries/TourSearchStartingLocationsQuery.graphql";
import FrontValuePropsQuery from "components/ui/FrontValuePropositions/FrontValuePropsQuery.graphql";
import PageMetadataQuery from "hooks/queries/PageMetadataQuery.graphql";
import CountryContainer from "components/features/CountryPage/CountryContainer";
import { Namespaces } from "shared/namespaces";
import CountryPageQuery from "components/features/CountryPage/queries/CountryPageQuery.graphql";
import { Direction, PageType } from "types/enums";
import DefaultDriverCountryQuery from "components/ui/CarSearchWidget/DriverInformation/queries/DefaultDriverCountryQuery.graphql";
import {
  getLanguageFromContext,
  getMarketplaceFromCtx,
  getMarketplaceUrl,
  longCacheHeaders,
} from "utils/apiUtils";
import { normalizeGraphCMSLocale } from "utils/helperUtils";

const CountryPage = ({
  landingPageUriQueryCondition,
}: {
  landingPageUriQueryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  return (
    <>
      <Header />
      <CountryContainer queryCondition={landingPageUriQueryCondition} />
    </>
  );
};

CountryPage.getInitialProps = (ctx: NextPageContext) => {
  const slug = "";
  const marketplaceUrl = getMarketplaceUrl(ctx);
  const locale = getLanguageFromContext(ctx);
  const landingPageUriQueryCondition = getMarketplaceLandingPageUriQueryCondition(
    marketplaceUrl.includes("guidetoiceland")
  );
  const marketplace = getMarketplaceFromCtx(ctx);
  const maybeCNLangContext = getCarPickupCNLangContext(marketplace, locale);
  const queries = [
    {
      query: BreadcrumbsQuery,
      variables: {
        slug: "/",
        type: PageType.PAGE.toUpperCase(),
      },
      context: { headers: longCacheHeaders },
    },
    {
      query: CountryPageQuery,
      isRequiredForPageRendering: true,
    },
    {
      query: FrontValuePropsQuery,
    },
    {
      query: PageMetadataQuery,
      variables: { path: slug },
      context: { headers: longCacheHeaders },
    },
    {
      query: TourSearchStartingLocationsQuery,
      context: {
        header: longCacheHeaders,
      },
    },
    {
      query: SearchCategoryQuery,
      variables: { slug },
    },
    {
      query: CarProvidersQuery,
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
      context: maybeCNLangContext,
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
      context: maybeCNLangContext,
    },
    {
      query: DefaultDriverCountryQuery,
      variables: {
        url: marketplaceUrl,
        locale: normalizeGraphCMSLocale(locale),
      },
    },
    {
      query: LandingPageUriQuery,
      variables: {
        locale: normalizeGraphCMSLocale(locale),
        where: landingPageUriQueryCondition,
      },
    },
  ];

  return {
    namespacesRequired: [
      Namespaces.commonNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.commonSearchNs,
      Namespaces.countryNs,
      Namespaces.commonBookingWidgetNs,
      Namespaces.tourSearchNs,
      Namespaces.accommodationNs,
      Namespaces.accommodationBookingWidgetNs,
      Namespaces.carSearchNs,
      Namespaces.flightNs,
      Namespaces.flightSearchNs,
    ],
    queries,
    isTopServicesHidden: true,
    isMobileFooterShown: false,
    contactUsButtonPosition: Direction.Right,
    landingPageUriQueryCondition,
  };
};

export default CountryPage;
