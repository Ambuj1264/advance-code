import React from "react";
import { NextPageContext } from "next";

import {
  Direction,
  FlightFunnelType,
  GraphCMSDisplayType,
  GraphCMSPageType,
  GraphCMSPageVariation,
  PageType,
} from "../types/enums";
import { getInitialPropsWithApollo } from "../lib/apollo/initApollo";
import FrontCountryPageContentQuery from "../components/ui/LandingPages/queries/FrontCountryPageContentQuery.graphql";

import { toursEnabledForLocale } from "components/features/GTETourProductPage/utils/gteTourUtils";
import DefaultDriverCountryQuery from "components/ui/CarSearchWidget/DriverInformation/queries/DefaultDriverCountryQuery.graphql";
import CarPickupLocationsQuery from "components/ui/CarSearchWidget/LocationPicker/queries/CarPickupLocationsQuery.graphql";
import useLandingPageLocaleLinks from "components/ui/LandingPages/hooks/useLandingPageLocaleLinks";
import Header from "components/features/Header/MainHeader";
import { getLanguageFromContext, getMarketplaceUrl } from "utils/apiUtils";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import {
  getFrontPageQueryCondition,
  getLandingPageUriQueryCondition,
} from "components/features/FrontPage/utils/frontPageUtils";
import FlightLocationsQuery from "components/ui/FlightSearchWidget/queries/FlightLocations.graphql";
import { Namespaces } from "shared/namespaces";
import LandingPageUriQuery from "components/ui/LandingPages/queries/LandingPageUriQuery.graphql";
import {
  constructLandingPageSectionsQuery,
  getFrontCountryLandingPageCommonQueries,
} from "components/ui/LandingPages/utils/landingPageQueryUtils";
import FrontCountryPageContentContainer from "components/ui/LandingPages/FrontCountryPageContentContainer";
import { getNrOfItemsPerPage } from "components/ui/LandingPages/utils/landingPageUtils";

const FrontPage = ({
  queryCondition,
  landingPageUriQueryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  landingPageUriQueryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const localeLinks = useLandingPageLocaleLinks(queryCondition);
  const gteFrontPageMobileImageUrl = "https://gte-gcms.imgix.net/LJH9F69ySI2ZTne8WWup";
  return (
    <>
      <Header gteLocaleLinks={localeLinks} />
      <FrontCountryPageContentContainer
        queryCondition={queryCondition}
        landingPageUriQueryCondition={landingPageUriQueryCondition}
        gteFrontPageMobileImageUrl={gteFrontPageMobileImageUrl}
      />
    </>
  );
};

FrontPage.getInitialProps = getInitialPropsWithApollo(
  PageType.GTE_FRONT_PAGE,
  async (ctx: NextPageContext, apollo) => {
    const locale = getLanguageFromContext(ctx);
    const { asPath } = ctx;
    const normalizesAsPath = cleanAsPathWithLocale(asPath);
    const queryCondition = getFrontPageQueryCondition(normalizesAsPath);
    const landingPageUriQueryCondition = getLandingPageUriQueryCondition();
    const marketplaceUrl = getMarketplaceUrl(ctx);

    const { queries: landingPageSectionsQueries, errorStatusCode } =
      await getFrontCountryLandingPageCommonQueries(
        apollo,
        queryCondition,
        locale,
        ctx,
        FrontCountryPageContentQuery
      );
    const firstSectionConditions = landingPageSectionsQueries?.[0].variables;
    const vpSectionWhereConditions = {
      where: firstSectionConditions?.where,
      sectionWhere: {
        pageVariation_in: [GraphCMSPageVariation.inContinentWithType],
        pageType_in: [GraphCMSPageType.VacationPackages],
        isDeleted: false,
      },
      orderBy: undefined,
      locale,
    };
    return {
      queryCondition,
      landingPageUriQueryCondition,
      namespacesRequired: [
        Namespaces.headerNs,
        Namespaces.flightSearchNs,
        Namespaces.flightNs,
        Namespaces.commonSearchNs,
        Namespaces.countryNs,
        Namespaces.commonNs,
        Namespaces.vacationPackageNs,
        Namespaces.vacationPackagesSearchN,
        Namespaces.accommodationBookingWidgetNs,
        Namespaces.accommodationSearchNs,
        Namespaces.accommodationNs,
        Namespaces.footerNs,
        Namespaces.tourSearchNs,
      ],
      queries: [
        // TODO: Remove when all VP will be released
        ...(toursEnabledForLocale(locale)
          ? [
              constructLandingPageSectionsQuery({
                ...vpSectionWhereConditions,
                first: getNrOfItemsPerPage(
                  GraphCMSDisplayType.IMAGE_WITH_SVG_ICON,
                  GraphCMSPageVariation.inContinentWithType,
                  true
                ),
              }),
            ]
          : []),
        {
          query: FlightLocationsQuery,
          variables: {
            input: {
              searchQuery: "",
              type: "From",
              funnel: FlightFunnelType.FLIGHT,
            },
          },
        },
        {
          query: FlightLocationsQuery,
          variables: {
            input: {
              searchQuery: "",
              type: "From",
              funnel: FlightFunnelType.VACATION_PACKAGE,
            },
          },
        },
        {
          query: FlightLocationsQuery,
          variables: {
            input: {
              searchQuery: "",
              type: "To",
              funnel: FlightFunnelType.FLIGHT,
            },
          },
        },
        {
          query: FlightLocationsQuery,
          variables: {
            input: {
              searchQuery: "",
              type: "To",
              funnel: FlightFunnelType.VACATION_PACKAGE,
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
          query: LandingPageUriQuery,
          variables: {
            locale,
            where: landingPageUriQueryCondition,
          },
          isRequiredForPageRendering: true,
        },
        {
          query: DefaultDriverCountryQuery,
          variables: {
            url: marketplaceUrl,
            locale,
          },
        },
        ...landingPageSectionsQueries,
      ],
      isMobileFooterShown: false,
      contactUsButtonPosition: Direction.Right,
      errorStatusCode,
    };
  }
);

export default FrontPage;
