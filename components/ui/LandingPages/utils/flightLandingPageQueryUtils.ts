import { NextPageContext } from "next";
import { ApolloClient } from "apollo-client";
import { DocumentNode } from "graphql";

import FlightLocationsQuery from "../../FlightSearchWidget/queries/FlightLocations.graphql";
import { updateChineseLocaleFlightsQueryHeader } from "../../FlightSearchWidget/utils/flightSearchWidgetUtils";

import getMarketplaceFlightSectionWhereCondition from "./queryConditions/marketplaceFlightSectionsWhereCondition";
import getGTEFlightSectionsWhereCondition from "./queryConditions/gteFlightSectionsWhereCondition";
import {
  constructLandingPageSectionsQuery,
  getLandingPageBlockingData,
  getLandingPageCommonNonPrefetchQueries,
} from "./landingPageQueryUtils";

import { normalizeGraphCMSLocale } from "utils/helperUtils";
import {
  type SupportedLanguages,
  GraphCMSPageType,
  FlightFunnelType,
  type Marketplace,
} from "types/enums";
import { getMarketplaceFromCtx, getQueryParamsViaLayer0 } from "utils/apiUtils";
import FlightLandingPageQuery from "components/features/FlightSearchPage/queries/FlightLandingPageQuery.graphql";

const globaPageConditions = {
  isDeleted: false,
};

export const getFlightSectionsPagesWhereCondition = ({
  pageVariation,
  destinationPlaceId,
  destinationCountryCode,
  originCountryCode,
  originPlaceId,
  originCountryPlaceId,
  domain,
  metadataUri,
}: LandingPageTypes.LandingPagePrefetchParams & {
  domain?: GraphCMSPageType;
}): LandingPageTypes.SectionWhereCondition[] => {
  switch (domain) {
    case GraphCMSPageType.Flights:
      return getGTEFlightSectionsWhereCondition({
        pageVariation,
        destinationPlaceId,
        destinationCountryCode,
        originCountryCode,
        originCountryPlaceId,
        originPlaceId,
        metadataUri,
      });
    case GraphCMSPageType.GTIFlights:
    case GraphCMSPageType.GTTPFlights:
      return getMarketplaceFlightSectionWhereCondition({
        pageVariation,
        destinationPlaceId,
        destinationCountryCode,
        originCountryCode,
        originPlaceId,
        metadataUri,
        domain,
      });
    default:
      return [];
  }
};

const getFlightIsomorphicSectionQueries = ({
  pageVariation,
  destinationPlaceId,
  destinationCountryCode,
  originCountryCode,
  originPlaceId,
  originCountryPlaceId,
  locale,
  metadataUri,
  pageType,
  continentGroup,
}: LandingPageTypes.LandingPagePrefetchParams & {
  pageType?: GraphCMSPageType;
  locale: SupportedLanguages;
}): LandingPageTypes.SectionQueryWithVars[] => {
  if (!pageVariation) return [];

  const sectionConditions = getFlightSectionsPagesWhereCondition({
    domain: pageType,
    pageVariation,
    destinationPlaceId,
    destinationCountryCode,
    originCountryCode,
    originCountryPlaceId,
    originPlaceId,
    metadataUri,
  });
  return sectionConditions.map(({ sectionWhere, where, orderBy, itemsPerPage, useSortedQuery }) => {
    return constructLandingPageSectionsQuery(
      {
        where,
        sectionWhere: { ...sectionWhere, ...globaPageConditions },
        locale,
        orderBy,
        continentGroup,
        metadataUri,
        first: itemsPerPage,
      },
      useSortedQuery
    );
  });
};

const getFlightLandingPageSectionQuery = async (
  apollo: ApolloClient<unknown>,
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  locale: SupportedLanguages,
  ctx: NextPageContext,
  query: DocumentNode,
  marketplace: Marketplace
) => {
  if (typeof window !== "undefined") {
    return { queries: [] };
  }

  const { result: prefetchedData, errorStatusCode } = await getLandingPageBlockingData({
    apollo,
    queryCondition,
    locale,
    ctx,
    query,
  });

  if (prefetchedData) {
    const {
      pageVariation,
      destinationPlaceId,
      destinationCountryCode,
      originCountryCode,
      originPlaceId,
      originCountryPlaceId,
      continentGroup,
      originName,
      destinationName,
    } = prefetchedData;
    const { origin, destinationName: queryDestinationName } = getQueryParamsViaLayer0(ctx);
    const updateChineseHeaders = updateChineseLocaleFlightsQueryHeader(locale, marketplace);
    const defaultOriginInput = decodeURI(origin || "") || originName || "";
    const defaultDestinationInput =
      decodeURI(queryDestinationName || "") || destinationName || "europe";

    return {
      queries: [
        ...getFlightIsomorphicSectionQueries({
          pageType: queryCondition.pageType,
          pageVariation,
          destinationPlaceId,
          destinationCountryCode,
          originCountryCode,
          originPlaceId,
          originCountryPlaceId,
          locale,
          metadataUri: queryCondition.metadataUri,
          continentGroup,
        }),
        {
          query: FlightLocationsQuery,
          variables: {
            input: {
              searchQuery: defaultOriginInput.toLowerCase(),
              type: "From",
              funnel: FlightFunnelType.FLIGHT,
            },
          },
          ...updateChineseHeaders,
        },
        {
          query: FlightLocationsQuery,
          variables: {
            input: {
              searchQuery: defaultDestinationInput.toLowerCase(),
              type: "To",
              funnel: FlightFunnelType.FLIGHT,
            },
          },
          ...updateChineseHeaders,
        },
      ],
      errorStatusCode,
    };
  }

  return { queries: [], errorStatusCode };
};

export const getFlightLandingPageCommonQueries = async (
  apollo: ApolloClient<unknown>,
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  locale: SupportedLanguages,
  ctx: NextPageContext,
  hasSearchFilters?: boolean
) => {
  const marketplace = getMarketplaceFromCtx(ctx);
  const graphCmsLocale = normalizeGraphCMSLocale(locale) as SupportedLanguages;

  const landingQueries = !hasSearchFilters
    ? await getFlightLandingPageSectionQuery(
        apollo,
        queryCondition,
        graphCmsLocale,
        ctx,
        FlightLandingPageQuery,
        marketplace
      )
    : undefined;

  return {
    queries: [
      ...(!hasSearchFilters ? landingQueries!.queries : []),
      ...getLandingPageCommonNonPrefetchQueries(queryCondition, graphCmsLocale, marketplace),
    ],
    errorStatusCode: !hasSearchFilters ? landingQueries!.errorStatusCode : undefined,
  };
};
