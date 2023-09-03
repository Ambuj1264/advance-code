import { getNrOfItemsPerPage, getWhereCondition, setSubType } from "../landingPageUtils";

import { GraphCMSDisplayType, GraphCMSPageType, GraphCMSPageVariation } from "types/enums";

const getVPSectionsWhereCondition = ({
  pageVariation,
  subtype,
  destinationPlaceId,
  destinationCountryCode,
  metadataUri,
}: LandingPageTypes.LandingPagePrefetchParams): LandingPageTypes.SectionWhereCondition[] => {
  switch (pageVariation) {
    case GraphCMSPageVariation.inContinent:
    case GraphCMSPageVariation.inContinentWithType:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.VacationPackages,
            pageVariation:
              pageVariation === GraphCMSPageVariation.inContinent
                ? GraphCMSPageVariation.inCountry
                : GraphCMSPageVariation.inCountryWithType,
            NOT: { metadataUri },
            ...setSubType(subtype),
          },
          where: getWhereCondition({
            sectionId: 601,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.SIDE_IMAGE,
            GraphCMSPageVariation.inCountry
          ),
          useSortedQuery: true,
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.VacationPackages,
            pageVariation:
              pageVariation === GraphCMSPageVariation.inContinent
                ? GraphCMSPageVariation.inCity
                : GraphCMSPageVariation.inCityWithType,
            NOT: { metadataUri },
            ...setSubType(subtype),
          },
          where: getWhereCondition({
            sectionId: 604,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCity
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.VacationPackages,
            pageVariation: GraphCMSPageVariation.inContinentWithType,
            NOT: { metadataUri },
          },
          where: getWhereCondition({
            sectionId: 602,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inContinentWithType
          ),
        },
        {
          domain: GraphCMSPageType.VpProductPage,
          where: getWhereCondition({
            sectionId: 8,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          sectionWhere: {
            NOT: { fromPrice: 0 },
            ...setSubType(subtype),
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.VpProductPage
          ),
        },
      ];
    case GraphCMSPageVariation.inCountry:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.VacationPackages,
            pageVariation: GraphCMSPageVariation.inCity,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
          },
          where: getWhereCondition({
            sectionId: 6,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
        {
          domain: GraphCMSPageType.VpProductPage,
          where: getWhereCondition({
            sectionId: 9,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          sectionWhere: {
            NOT: { fromPrice: 0 },
            endPlace: {
              countries_some: {
                id: destinationPlaceId,
              },
            },
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.VpProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.VacationPackages,
            pageVariation: GraphCMSPageVariation.inCountryWithType,
            destinationPlaceId,
            ...setSubType(subtype),
          },
          where: getWhereCondition({
            sectionId: 14,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCountryWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.VacationPackages,
            pageVariation: GraphCMSPageVariation.inCountry,
          },
          where: getWhereCondition({
            sectionId: 601,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.SIDE_IMAGE,
            GraphCMSPageVariation.inCountry
          ),
        },
      ];
    case GraphCMSPageVariation.inCountryWithType:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.VacationPackages,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            ...setSubType(subtype),
            NOT: { metadataUri },
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
          },
          where: getWhereCondition({
            sectionId: 6,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
        {
          domain: GraphCMSPageType.VpProductPage,
          where: getWhereCondition({
            sectionId: 10,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          sectionWhere: {
            NOT: { fromPrice: 0 },
            endPlace: {
              countries_some: {
                id: destinationPlaceId,
              },
            },
            ...setSubType(subtype),
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.VpProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.VacationPackages,
            pageVariation: GraphCMSPageVariation.inCountryWithType,
            destinationPlaceId,
            NOT: { metadataUri },
          },
          where: getWhereCondition({
            sectionId: 14,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCountryWithType
          ),
        },
      ];
    case GraphCMSPageVariation.inCity:
      return [
        {
          domain: GraphCMSPageType.VpProductPage,
          where: getWhereCondition({
            sectionId: 11,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          sectionWhere: {
            endPlace: {
              id: destinationPlaceId,
            },
            NOT: { fromPrice: 0 },
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.VpProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.VacationPackages,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            NOT: { metadataUri },
            destinationPlaceId,
          },
          where: getWhereCondition({
            sectionId: 15,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
      ];
    case GraphCMSPageVariation.inCityWithType:
      return [
        {
          domain: GraphCMSPageType.VpProductPage,
          where: getWhereCondition({
            sectionId: 12,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          sectionWhere: {
            endPlace: {
              id: destinationPlaceId,
            },
            NOT: { fromPrice: 0 },
            ...setSubType(subtype),
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.VpProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.VacationPackages,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            NOT: { metadataUri },
            ...setSubType(subtype),
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
          },
          where: getWhereCondition({
            sectionId: 6,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.VacationPackages,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            destinationPlaceId,
            NOT: { metadataUri },
          },
          where: getWhereCondition({
            sectionId: 15,
            domains: [GraphCMSPageType.VacationPackages],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
      ];
    default:
      return [];
  }
};

export default getVPSectionsWhereCondition;
