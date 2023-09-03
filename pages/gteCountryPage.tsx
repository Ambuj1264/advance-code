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
import { getNrOfItemsPerPage } from "../components/ui/LandingPages/utils/landingPageUtils";

import { toursEnabledForLocale } from "components/features/GTETourProductPage/utils/gteTourUtils";
import useLandingPageLocaleLinks from "components/ui/LandingPages/hooks/useLandingPageLocaleLinks";
import LandingPageUriQuery from "components/ui/LandingPages/queries/LandingPageUriQuery.graphql";
import DefaultDriverCountryQuery from "components/ui/CarSearchWidget/DriverInformation/queries/DefaultDriverCountryQuery.graphql";
import { getLanguageFromContext, getMarketplaceUrl } from "utils/apiUtils";
import Header from "components/features/Header/MainHeader";
import { Namespaces } from "shared/namespaces";
import {
  getCountryPageQueryCondition,
  getLandingPageUriQueryCondition,
} from "components/features/GTECountryPage/utils/countryPageUtils";
import {
  constructLandingPageSectionsQuery,
  getFrontCountryLandingPageCommonQueries,
} from "components/ui/LandingPages/utils/landingPageQueryUtils";
import FlightLocationsQuery from "components/ui/FlightSearchWidget/queries/FlightLocations.graphql";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import FrontCountryPageContentContainer from "components/ui/LandingPages/FrontCountryPageContentContainer";
import { ContactUsMobileMargin } from "components/features/ContactUs/ContactUsButton";

const CountryPage = ({
  queryCondition,
  landingPageUriQueryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  landingPageUriQueryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const localeLinks = useLandingPageLocaleLinks(queryCondition);
  return (
    <>
      <Header gteLocaleLinks={localeLinks} />
      <FrontCountryPageContentContainer
        queryCondition={queryCondition}
        landingPageUriQueryCondition={landingPageUriQueryCondition}
      />
    </>
  );
};

CountryPage.getInitialProps = getInitialPropsWithApollo(
  PageType.GTE_COUNTRY_PAGE,
  async (ctx: NextPageContext, apollo) => {
    const locale = getLanguageFromContext(ctx);
    const { asPath } = ctx;
    const normalizesAsPath = cleanAsPathWithLocale(asPath);
    const country = normalizesAsPath.substring(1);
    const queryCondition = getCountryPageQueryCondition(normalizesAsPath);
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
        pageVariation_in: [GraphCMSPageVariation.inCountryWithType],
        pageType_in: [GraphCMSPageType.VacationPackages],
        destination: {
          id: firstSectionConditions?.sectionWhere?.destination?.id,
        },
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
        ...landingPageSectionsQueries,
        {
          query: LandingPageUriQuery,
          variables: {
            locale,
            where: landingPageUriQueryCondition,
          },
          isRequiredForPageRendering: true,
        },
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
              searchQuery: country,
              type: "To",
              funnel: FlightFunnelType.FLIGHT,
            },
          },
        },
        {
          query: DefaultDriverCountryQuery,
          variables: {
            url: marketplaceUrl,
            locale,
          },
        },
      ],
      contactUsButtonPosition: Direction.Right,
      contactUsMobileMargin: ContactUsMobileMargin.WithoutFooter,
      errorStatusCode,
    };
  }
);

export default CountryPage;
