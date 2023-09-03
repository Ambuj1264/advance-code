import { getNrOfItemsPerPage, getWhereCondition, setSubType } from "../landingPageUtils";

import { GraphCMSPageVariation, GraphCMSPageType, GraphCMSDisplayType } from "types/enums";

const sectionSortingValue = "combinedRank_DESC";

const getStaySectionsWhereCondition = ({
  pageVariation,
  subtype,
  destinationPlaceId,
  domain,
  metadataUri,
  destinationCountryCode,
}: LandingPageTypes.LandingPagePrefetchParams & {
  domain: GraphCMSPageType;
}): LandingPageTypes.SectionWhereCondition[] => {
  const globalStaySectionsWhereConditions = [
    {
      sectionWhere: {
        pageType: GraphCMSPageType.Stays,
        pageVariation: GraphCMSPageVariation.inCountry,
        NOT: { metadataUri },
      },
      where: getWhereCondition({ sectionId: 2, domains: [domain] }),
      orderBy: sectionSortingValue,
      useSortedQuery: true,
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.SIDE_IMAGE,
        GraphCMSPageVariation.inCountry
      ),
    },
    {
      sectionWhere: {
        pageType: GraphCMSPageType.Stays,
        pageVariation: GraphCMSPageVariation.inCity,
        NOT: { metadataUri },
      },
      where: getWhereCondition({ sectionId: 3, domains: [domain] }),
      orderBy: sectionSortingValue,
      itemsPerPage: getNrOfItemsPerPage(GraphCMSDisplayType.IMAGE, GraphCMSPageVariation.inCity),
    },
  ];

  switch (pageVariation) {
    case GraphCMSPageVariation.inContinent:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inContinentWithType,
          },
          where: getWhereCondition({ sectionId: 1, domains: [domain] }),
          orderBy: sectionSortingValue,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inContinentWithType
          ),
        },
        ...globalStaySectionsWhereConditions,
        {
          domain: GraphCMSPageType.StaysProductPage,
          where: getWhereCondition({ sectionId: 4, domains: [domain] }),
          sectionWhere: {
            NOT: { fromPrice: 0 },
            combinedRating_not: null,
            isDisabled: false,
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.staysProductPage
          ),
        },
      ];
    case GraphCMSPageVariation.inContinentWithType:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inCountryWithType,
            ...setSubType(subtype),
          },
          where: getWhereCondition({ sectionId: 5, domains: [domain] }),
          orderBy: sectionSortingValue,
          useSortedQuery: true,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.SIDE_IMAGE,
            GraphCMSPageVariation.inCountryWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            ...setSubType(subtype),
          },
          where: getWhereCondition({ sectionId: 6, domains: [domain] }),
          orderBy: sectionSortingValue,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
        {
          domain: GraphCMSPageType.StaysProductPage,
          where: getWhereCondition({ sectionId: 7, domains: [domain] }),
          sectionWhere: {
            ...setSubType(subtype),
            isDisabled: false,
            NOT: { fromPrice: 0 },
            combinedRating_not: null,
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.staysProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inContinentWithType,
            NOT: { metadataUri },
          },
          where: getWhereCondition({ sectionId: 1, domains: [domain] }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inContinentWithType
          ),
        },
      ];
    case GraphCMSPageVariation.inCountry:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inCity,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
          },
          where: getWhereCondition({ sectionId: 8, domains: [domain] }),
          orderBy: sectionSortingValue,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCity
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inCountryWithType,
            destinationPlaceId,
          },
          where: getWhereCondition({ sectionId: 9, domains: [domain] }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCountryWithType
          ),
        },
        {
          domain: GraphCMSPageType.StaysProductPage,
          where: getWhereCondition({ sectionId: 10, domains: [domain] }),
          sectionWhere: {
            OR: [
              {
                cmsCountryPlaceIds_contains_some: destinationPlaceId,
              },
              { placeId: destinationPlaceId },
            ],
            NOT: { fromPrice: 0 },
            isDisabled: false,
            combinedRating_not: null,
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.staysProductPage
          ),
        },
        ...globalStaySectionsWhereConditions,
      ];
    case GraphCMSPageVariation.inCountryWithType:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            ...setSubType(subtype),
          },
          where: getWhereCondition({ sectionId: 13, domains: [domain] }),
          orderBy: sectionSortingValue,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
        {
          domain: GraphCMSPageType.StaysProductPage,
          where: getWhereCondition({ sectionId: 14, domains: [domain] }),
          sectionWhere: {
            OR: [
              {
                cmsCountryPlaceIds_contains_some: destinationPlaceId,
              },
              { placeId: destinationPlaceId },
            ],
            NOT: { fromPrice: 0 },
            isDisabled: false,
            combinedRating_not: null,
            ...setSubType(subtype),
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.staysProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inCountryWithType,
            destinationPlaceId,
            NOT: { metadataUri },
          },
          where: getWhereCondition({ sectionId: 9, domains: [domain] }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCountryWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inCountryWithType,
            ...setSubType(subtype),
          },
          where: getWhereCondition({ sectionId: 5, domains: [domain] }),
          orderBy: sectionSortingValue,
          useSortedQuery: true,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.SIDE_IMAGE,
            GraphCMSPageVariation.inCountryWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            ...setSubType(subtype),
          },
          where: getWhereCondition({ sectionId: 6, domains: [domain] }),
          orderBy: sectionSortingValue,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
      ];
    case GraphCMSPageVariation.inCity:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            destinationPlaceId,
          },
          where: getWhereCondition({ sectionId: 12, domains: [domain] }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
        {
          domain: GraphCMSPageType.StaysProductPage,
          where: getWhereCondition({ sectionId: 11, domains: [domain] }),
          sectionWhere: {
            placeId: destinationPlaceId,
            NOT: { fromPrice: 0 },
            isDisabled: false,
            combinedRating_not: null,
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.staysProductPage
          ),
        },
        ...globalStaySectionsWhereConditions,
      ];
    case GraphCMSPageVariation.inCityWithType:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            destinationPlaceId,
            NOT: { metadataUri },
          },
          where: getWhereCondition({ sectionId: 12, domains: [domain] }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
        {
          domain: GraphCMSPageType.StaysProductPage,
          where: getWhereCondition({ sectionId: 15, domains: [domain] }),
          sectionWhere: {
            placeId: destinationPlaceId,
            NOT: { fromPrice: 0 },
            combinedRating_not: null,
            isDisabled: false,
            ...setSubType(subtype),
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.staysProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            ...setSubType(subtype),
          },
          where: getWhereCondition({ sectionId: 13, domains: [domain] }),
          orderBy: sectionSortingValue,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inCountryWithType,
            ...setSubType(subtype),
          },
          where: getWhereCondition({ sectionId: 5, domains: [domain] }),
          orderBy: sectionSortingValue,
          useSortedQuery: true,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.SIDE_IMAGE,
            GraphCMSPageVariation.inCountryWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Stays,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            ...setSubType(subtype),
          },
          where: getWhereCondition({ sectionId: 6, domains: [domain] }),
          orderBy: sectionSortingValue,
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

export default getStaySectionsWhereCondition;
