import { getNrOfItemsPerPage, getWhereCondition, setSubType } from "../landingPageUtils";

import { GraphCMSPageVariation, GraphCMSPageType, GraphCMSDisplayType } from "types/enums";

const subtypeSortingValue = "subtypeSortingValue_ASC";

const getCarSectionsWhereCondition = ({
  pageVariation,
  subtype,
  destinationPlaceId,
  metadataUri,
  destinationCountryCode,
}: LandingPageTypes.LandingPagePrefetchParams): LandingPageTypes.SectionWhereCondition[] => {
  const globalCarSectionsWhereConditions = [
    {
      sectionWhere: {
        pageType: GraphCMSPageType.Cars,
        pageVariation: GraphCMSPageVariation.inCountry,
        NOT: { metadataUri },
      },
      where: getWhereCondition({
        sectionId: 7,
        domains: [GraphCMSPageType.Cars],
      }),
      useSortedQuery: true,
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.SIDE_IMAGE,
        GraphCMSPageVariation.inCountry
      ),
    },
    {
      sectionWhere: {
        pageType: GraphCMSPageType.Cars,
        pageVariation: GraphCMSPageVariation.inCity,
        NOT: { metadataUri },
      },
      where: getWhereCondition({
        sectionId: 6,
        domains: [GraphCMSPageType.Cars],
      }),
      itemsPerPage: getNrOfItemsPerPage(GraphCMSDisplayType.IMAGE, GraphCMSPageVariation.inCity),
    },
  ];
  switch (pageVariation) {
    case GraphCMSPageVariation.inContinent:
      return [
        ...globalCarSectionsWhereConditions,
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inContinentWithType,
          },
          where: getWhereCondition({
            sectionId: 9,
            domains: [GraphCMSPageType.Cars],
          }),
          orderBy: subtypeSortingValue,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inContinentWithType
          ),
        },
      ];
    case GraphCMSPageVariation.inContinentWithType:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inCountryWithType,
            ...setSubType(subtype),
          },
          where: getWhereCondition({
            sectionId: 2,
            domains: [GraphCMSPageType.Cars],
          }),
          useSortedQuery: true,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.SIDE_IMAGE,
            GraphCMSPageVariation.inCountryWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            ...setSubType(subtype),
          },
          where: getWhereCondition({
            sectionId: 1,
            domains: [GraphCMSPageType.Cars],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inContinentWithType,
            NOT: { metadataUri },
          },
          where: getWhereCondition({
            sectionId: 9,
            domains: [GraphCMSPageType.Cars],
          }),
          orderBy: subtypeSortingValue,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inContinentWithType
          ),
        },
        ...globalCarSectionsWhereConditions,
      ];
    case GraphCMSPageVariation.inCountry:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inCity,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
          },
          where: getWhereCondition({
            sectionId: 4,
            domains: [GraphCMSPageType.Cars],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCity
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inCountryWithType,
            destinationPlaceId,
          },
          where: getWhereCondition({
            sectionId: 8,
            domains: [GraphCMSPageType.Cars],
          }),
          orderBy: subtypeSortingValue,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCountryWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inAirport,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
          },
          where: getWhereCondition({
            sectionId: 11,
            domains: [GraphCMSPageType.Cars],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inAirport
          ),
        },
        ...globalCarSectionsWhereConditions,
      ];
    case GraphCMSPageVariation.inCountryWithType:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            ...setSubType(subtype),
          },
          where: getWhereCondition({
            sectionId: 10,
            domains: [GraphCMSPageType.Cars],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inAirportWithType,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            ...setSubType(subtype),
          },
          where: getWhereCondition({
            sectionId: 15,
            domains: [GraphCMSPageType.Cars],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inAirportWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inCountryWithType,
            destinationPlaceId,
            NOT: { metadataUri },
          },
          where: getWhereCondition({
            sectionId: 8,
            domains: [GraphCMSPageType.Cars],
          }),
          orderBy: subtypeSortingValue,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCountryWithType
          ),
        },
        ...globalCarSectionsWhereConditions,
      ];
    case GraphCMSPageVariation.inCity:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            destinationPlaceId,
          },
          where: getWhereCondition({
            sectionId: 3,
            domains: [GraphCMSPageType.Cars],
          }),
          orderBy: subtypeSortingValue,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCity
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inCity,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            NOT: { metadataUri },
          },
          where: getWhereCondition({
            sectionId: 4,
            domains: [GraphCMSPageType.Cars],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCity
          ),
        },
        ...globalCarSectionsWhereConditions,
      ];
    case GraphCMSPageVariation.inCityWithType:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            ...setSubType(subtype),
            NOT: { metadataUri },
          },
          where: getWhereCondition({
            sectionId: 10,
            domains: [GraphCMSPageType.Cars],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            destinationPlaceId,
            NOT: { metadataUri },
          },
          where: getWhereCondition({
            sectionId: 3,
            domains: [GraphCMSPageType.Cars],
          }),
          orderBy: subtypeSortingValue,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
        ...globalCarSectionsWhereConditions,
      ];
    case GraphCMSPageVariation.inAirport:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inAirportWithType,
            destinationPlaceId,
          },
          where: getWhereCondition({
            sectionId: 12,
            domains: [GraphCMSPageType.Cars],
          }),
          orderBy: subtypeSortingValue,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inAirportWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inAirport,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            NOT: { metadataUri },
          },
          where: getWhereCondition({
            sectionId: 11,
            domains: [GraphCMSPageType.Cars],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inAirport
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inAirport,
            NOT: { metadataUri },
          },
          where: getWhereCondition({
            sectionId: 13,
            domains: [GraphCMSPageType.Cars],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inAirport
          ),
        },
      ];
    case GraphCMSPageVariation.inAirportWithType:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inAirportWithType,
            destinationPlaceId,
            NOT: { metadataUri },
          },
          where: getWhereCondition({
            sectionId: 12,
            domains: [GraphCMSPageType.Cars],
          }),
          orderBy: subtypeSortingValue,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inAirportWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inAirportWithType,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            ...setSubType(subtype),
            NOT: { metadataUri },
          },
          where: getWhereCondition({
            sectionId: 15,
            domains: [GraphCMSPageType.Cars],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inAirportWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Cars,
            pageVariation: GraphCMSPageVariation.inAirportWithType,
            ...setSubType(subtype),
            NOT: { metadataUri },
          },
          where: getWhereCondition({
            sectionId: 16,
            domains: [GraphCMSPageType.Cars],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inAirportWithType
          ),
        },
      ];
    default:
      return [];
  }
};

export default getCarSectionsWhereCondition;
