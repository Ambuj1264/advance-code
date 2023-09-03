import { getNrOfItemsPerPage, getWhereCondition } from "../landingPageUtils";

import { GraphCMSPageVariation, GraphCMSPageType, GraphCMSDisplayType } from "types/enums";

const getMarketplaceFlightSectionWhereCondition = ({
  pageVariation,
  destinationPlaceId,
  originPlaceId,
  metadataUri,
  domain,
  destinationCountryCode,
  originCountryCode,
}: LandingPageTypes.LandingPagePrefetchParams & {
  domain: GraphCMSPageType;
}): LandingPageTypes.SectionWhereCondition[] => {
  switch (pageVariation) {
    case GraphCMSPageVariation.toCountry:
      return [
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.toCity,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            NOT: { origin: { continentGroup: [] } },
            pageType: domain,
          },
          where: getWhereCondition({
            sectionId: 9103,
            domains: [domain],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.toCity
          ),
        },
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCountryToCountry,
            destinationPlaceId,
            NOT: { origin: { continentGroup: [] } },
            pageType: domain,
          },
          where: getWhereCondition({
            sectionId: 91012,
            domains: [domain],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.LARGE_IMAGE,
            GraphCMSPageVariation.fromCountryToCountry
          ),
        },
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            NOT: { origin: { continentGroup: [3, 5] } },
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            pageType: domain,
          },
          where: getWhereCondition({
            sectionId: 91013,
            domains: [domain],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            originCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            pageType: domain,
          },
          where: getWhereCondition({
            sectionId: 91014,
            domains: [domain],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
      ];
    case GraphCMSPageVariation.toCity:
      return [
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            destinationPlaceId,
            pageType: domain,
          },
          where: getWhereCondition({
            sectionId: 91011,
            domains: [domain],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            destinationPlaceId,
            originCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            pageType: domain,
          },
          where: getWhereCondition({
            sectionId: 91016,
            domains: [domain],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.toCity,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            NOT: { metadataUri },
            pageType: domain,
          },
          where: getWhereCondition({
            sectionId: 9103,
            domains: [domain],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.toCity
          ),
        },
      ];

    case GraphCMSPageVariation.fromCity:
      return [
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            originPlaceId,
            pageType: domain,
          },
          where: getWhereCondition({
            sectionId: 9107,
            domains: [domain],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            destinationCountryCodes_contains_some: originCountryCode
              ? [originCountryCode]
              : undefined,
            originCountryCodes_contains_some: originCountryCode ? [originCountryCode] : undefined,
            pageType: domain,
          },
          where: getWhereCondition({
            sectionId: 91017,
            domains: [domain],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
      ];
    case GraphCMSPageVariation.fromCityToCity:
      return [
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            originPlaceId,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            NOT: { metadataUri },
            pageType: domain,
          },
          where: getWhereCondition({
            sectionId: 9106,
            domains: [domain],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            originCountryCodes_contains_some: originCountryCode ? [originCountryCode] : undefined,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            pageType: domain,
          },
          where: getWhereCondition({
            sectionId: 9105,
            domains: [domain],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
      ];
    case GraphCMSPageVariation.fromCountryToCountry:
      return [
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            originCountryCodes_contains_some: originCountryCode ? [originCountryCode] : undefined,
            pageType: domain,
          },
          where: getWhereCondition({
            sectionId: 9105,
            domains: [domain],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
      ];
    default:
      return [];
  }
};

export default getMarketplaceFlightSectionWhereCondition;
