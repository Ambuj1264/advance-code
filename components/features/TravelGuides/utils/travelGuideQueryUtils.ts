import ApolloClient from "apollo-client";
import { NextPageContext } from "next";

import { TGDSectionType } from "../types/travelGuideEnums";

import destinationTGSectionsWhereCondition from "./destinationTGSectionsWhereCondition";

import { getPrefetchedData } from "lib/apollo/getPrefetchedData";
import { GraphCMSPageType, SupportedLanguages } from "types/enums";
import TGDestinationsContentQuery from "components/features/TravelGuides/queries/TGDestinationsContentQuery.graphql";
import TGDestinationsSearchQuery from "components/features/TravelGuides/queries/TGDestinationsSearchQuery.graphql";
import TGTourProductSection from "components/features/TravelGuides/queries/TGTourProductSectionQuery.graphql";
import TGVPProductSection from "components/features/TravelGuides/queries/TGVPProductSectionQuery.graphql";
import TGStayProductSectionQuery from "components/features/TravelGuides/queries/TGStayProductSectionQuery.graphql";
import LandingPageSectionsSortedQuery from "components/ui/LandingPages/queries/LandingPageSectionsSortedQuery.graphql";
import TGTopServicesQuery from "components/features/TravelGuides/queries/TGSectionsQuery.graphql";
import { constructVPSearchLandingQueryVariables } from "components/features/VacationPackages/utils/vacationPackagesUtils";

export const getTravelGuideQueryCondition = (asPath?: string) => ({
  pageType: GraphCMSPageType.TravelGuides,
  metadataUri: asPath,
});

const getTravelGuidePrefetchedData = async (
  apollo: ApolloClient<unknown>,
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  locale: SupportedLanguages,
  ctx: NextPageContext
) => {
  const { result: prefetchedData, errorStatusCode } = await getPrefetchedData(apollo, ctx, {
    query: TGDestinationsContentQuery,
    variables: {
      stage: "DRAFT",
      where: {
        metadataUri: queryCondition.metadataUri,
      },
      locale,
    },
  });
  const page = prefetchedData?.data?.destinationLandingPages?.[0];
  if (page) {
    return {
      result: page,
      errorStatusCode,
    };
  }
  return { errorStatusCode };
};

export const getWhereConditionProps = (place: TravelGuideTypes.DestinationPlace) => {
  const country = place.countries.length > 0 ? place.countries[0] : place.country;
  return {
    destinationPlaceId: place.id,
    destinationCountryCode: country.alpha2Code,
    flightId: place.flightId,
    destinationCountryPlaceId: country.id,
  };
};

export const getTravelGuideSectionQueries = async (
  apollo: ApolloClient<unknown>,
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  locale: SupportedLanguages,
  ctx: NextPageContext
): Promise<{
  queries: {
    query: any;
    variables: any;
    isRequiredForPageRendering?: boolean;
  }[];
  errorStatusCode?: number;
}> => {
  if (typeof window !== "undefined") {
    return { queries: [] };
  }
  const { result, errorStatusCode } = await getTravelGuidePrefetchedData(
    apollo,
    queryCondition,
    locale,
    ctx
  );

  if (result) {
    const { place } = result;
    const { destinationPlaceId, destinationCountryCode, flightId } = getWhereConditionProps(place);

    const missingIdOrCode = Boolean(!destinationPlaceId || !destinationCountryCode);
    const sectionWhereConditions = missingIdOrCode
      ? []
      : destinationTGSectionsWhereCondition({
          destinationPlaceId,
          destinationCountryCode,
          metadataUri: queryCondition.metadataUri,
        });

    const queries = sectionWhereConditions.map(whereCondition => {
      if (whereCondition?.domain === GraphCMSPageType.Destinations) {
        return {
          query: TGDestinationsSearchQuery,
          variables: {
            input: whereCondition.input,
          },
        };
      }
      if (whereCondition?.domain === GraphCMSPageType.Tours) {
        return {
          query: TGTourProductSection,
          variables: {
            where: whereCondition.where,
            locale,
          },
        };
      }
      if (whereCondition?.domain === GraphCMSPageType.VpProductPage) {
        return {
          query: TGVPProductSection,
          variables: constructVPSearchLandingQueryVariables(flightId),
        };
      }
      if (whereCondition?.domain === GraphCMSPageType.Stays) {
        return {
          query: TGStayProductSectionQuery,
          variables: {
            where: whereCondition.where,
            locale,
          },
        };
      }
      if (whereCondition?.domain === TGDSectionType.GuideToContinentSideBar) {
        return {
          query: LandingPageSectionsSortedQuery,
          variables: {
            where: whereCondition.where,
            sectionWhere: whereCondition.sectionWhere,
            first: whereCondition.first,
            continentGroup: whereCondition.continentGroup,
            metadataUri: whereCondition.metadataUri,
            locale,
          },
        };
      }
      return {
        query: TGTopServicesQuery,
        variables: {
          where: whereCondition.where,
          first: whereCondition.first ?? 16,
          locale,
        },
      };
    });

    return {
      queries,
      errorStatusCode,
    };
  }

  return {
    queries: [],
    errorStatusCode,
  };
};
