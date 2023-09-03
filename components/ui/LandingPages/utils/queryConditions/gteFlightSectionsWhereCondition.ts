import { getNrOfItemsPerPage, getWhereCondition } from "../landingPageUtils";

import { GraphCMSPageVariation, GraphCMSPageType, GraphCMSDisplayType } from "types/enums";

const getGTEFlightSectionsWhereCondition = ({
  pageVariation,
  destinationPlaceId,
  originPlaceId,
  originCountryPlaceId,
  destinationCountryCode,
  originCountryCode,
  metadataUri,
}: LandingPageTypes.LandingPagePrefetchParams): LandingPageTypes.SectionWhereCondition[] => {
  const globalFlightsSectionsWhereConditions = [
    {
      sectionWhere: {
        pageVariation: GraphCMSPageVariation.toCountry,
        NOT: { metadataUri },
        pageType: GraphCMSPageType.Flights,
      },
      where: getWhereCondition({
        sectionId: 101,
        domains: [GraphCMSPageType.Flights],
      }),
      useSortedQuery: true,
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.SIDE_IMAGE,
        GraphCMSPageVariation.toCountry
      ),
    },
    {
      sectionWhere: {
        pageVariation: GraphCMSPageVariation.toCity,
        NOT: { metadataUri },
        pageType: GraphCMSPageType.Flights,
      },
      where: getWhereCondition({
        sectionId: 102,
        domains: [GraphCMSPageType.Flights],
      }),
      itemsPerPage: getNrOfItemsPerPage(GraphCMSDisplayType.IMAGE, GraphCMSPageVariation.toCity),
    },
  ];
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
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 103,
            domains: [GraphCMSPageType.Flights],
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
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 1012,
            domains: [GraphCMSPageType.Flights],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.LARGE_IMAGE,
            GraphCMSPageVariation.fromCountryToCountry
          ),
        },
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 1013,
            domains: [GraphCMSPageType.Flights],
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
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 1014,
            domains: [GraphCMSPageType.Flights],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
        ...globalFlightsSectionsWhereConditions,
      ];
    case GraphCMSPageVariation.toCity:
      return [
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            destinationPlaceId,
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 1011,
            domains: [GraphCMSPageType.Flights],
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
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            originCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 1016,
            domains: [GraphCMSPageType.Flights],
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
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 103,
            domains: [GraphCMSPageType.Flights],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.toCity
          ),
        },
        ...globalFlightsSectionsWhereConditions,
      ];
    case GraphCMSPageVariation.fromCountry:
      return [
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCountryToCountry,
            originPlaceId,
            NOT: { origin: { continentGroup: [] } },
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 1010,
            domains: [GraphCMSPageType.Flights],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.LARGE_IMAGE,
            GraphCMSPageVariation.fromCountryToCountry
          ),
        },
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            originCountryCodes_contains_some: originCountryCode ? [originCountryCode] : undefined,
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 104,
            domains: [GraphCMSPageType.Flights],
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
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 1014,
            domains: [GraphCMSPageType.Flights],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
        ...globalFlightsSectionsWhereConditions,
      ];

    case GraphCMSPageVariation.fromCity:
      return [
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            originPlaceId,
            NOT: { origin: { continentGroup: [] } },
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 107,
            domains: [GraphCMSPageType.Flights],
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
            originPlaceId,
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 1017,
            domains: [GraphCMSPageType.Flights],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
        ...globalFlightsSectionsWhereConditions,
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
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 106,
            domains: [GraphCMSPageType.Flights],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            originPlaceId,
            NOT: { metadataUri },
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 107,
            domains: [GraphCMSPageType.Flights],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCity,
            originCountryCodes_contains_some: originCountryCode ? [originCountryCode] : undefined,
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 1015,
            domains: [GraphCMSPageType.Flights],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCity
          ),
        },
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCountryToCountry,
            originPlaceId: originCountryPlaceId,
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 1010,
            domains: [GraphCMSPageType.Flights],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.LARGE_IMAGE,
            GraphCMSPageVariation.fromCountryToCountry
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
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 105,
            domains: [GraphCMSPageType.Flights],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCountryToCountry,
            originPlaceId,
            NOT: { metadataUri },
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 1010,
            domains: [GraphCMSPageType.Flights],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.LARGE_IMAGE,
            GraphCMSPageVariation.fromCountryToCountry
          ),
        },
        globalFlightsSectionsWhereConditions[0],
      ];

    case GraphCMSPageVariation.toContinent:
      return [
        ...globalFlightsSectionsWhereConditions,
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCityToCity,
            NOT: { origin: { continentGroup: [] } },
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 108,
            domains: [GraphCMSPageType.Flights],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.fromCityToCity
          ),
        },
        {
          sectionWhere: {
            pageVariation: GraphCMSPageVariation.fromCountryToCountry,
            NOT: { origin: { continentGroup: [] } },
            pageType: GraphCMSPageType.Flights,
          },
          where: getWhereCondition({
            sectionId: 109,
            domains: [GraphCMSPageType.Flights],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.LARGE_IMAGE,
            GraphCMSPageVariation.fromCountryToCountry
          ),
        },
      ];
    default:
      return [];
  }
};

export default getGTEFlightSectionsWhereCondition;
