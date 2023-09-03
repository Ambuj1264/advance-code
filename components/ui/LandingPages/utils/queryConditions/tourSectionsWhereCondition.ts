import { getNrOfItemsPerPage, getWhereCondition, setSubType } from "../landingPageUtils";

import { GraphCMSPageVariation, GraphCMSPageType, GraphCMSDisplayType } from "types/enums";

const getTourSectionsWhereCondition = ({
  pageVariation,
  subtype,
  tagId,
  destinationPlaceId,
  metadataUri,
  parentSubType,
  destinationCountryCode,
}: LandingPageTypes.LandingPagePrefetchParams & {
  tagId?: number;
  parentSubType?: string;
}): LandingPageTypes.SectionWhereCondition[] => {
  switch (pageVariation) {
    case GraphCMSPageVariation.inContinent:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCountry,
          },
          where: getWhereCondition({
            sectionId: 1,
            domains: [GraphCMSPageType.Tours],
          }),
          useSortedQuery: true,
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.SIDE_IMAGE,
            GraphCMSPageVariation.inCountry
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCity,
          },
          where: getWhereCondition({
            sectionId: 2,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCity
          ),
        },
        {
          domain: GraphCMSPageType.TourProductPage,
          where: getWhereCondition({
            sectionId: 3,
            domains: [GraphCMSPageType.Tours],
          }),
          sectionWhere: {
            combinedRating_not: null,
            reviewScore_gte: 4,
            isDeleted: false,
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.tourProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inContinentWithType,
          },
          where: getWhereCondition({
            sectionId: 11,
            domains: [GraphCMSPageType.Tours],
          }),
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
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCountryWithType,
            ...setSubType(subtype),
          },
          where: getWhereCondition({
            sectionId: 4,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.SIDE_IMAGE,
            GraphCMSPageVariation.inCountryWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            ...setSubType(subtype),
          },
          where: getWhereCondition({
            sectionId: 5,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
        {
          domain: GraphCMSPageType.TourProductPage,
          where: getWhereCondition({
            sectionId: 6,
            domains: [GraphCMSPageType.Tours],
          }),
          sectionWhere: {
            ...(subtype ? { subTypes_some: { subtype } } : {}),
            combinedRating_not: null,
            isDeleted: false,
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.tourProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inContinentWithTypeAndTag,
            ...(subtype
              ? {
                  subType: { parentSubType: { subtype } },
                }
              : {}),
          },
          where: getWhereCondition({
            sectionId: 15,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCountryWithTypeAndTag
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inContinentWithType,
            NOT: { metadataUri },
          },
          where: getWhereCondition({
            sectionId: 11,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inContinentWithType
          ),
        },
      ];
    case GraphCMSPageVariation.inContinentWithTypeAndTag:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCountryWithTypeAndTag,
            ...(tagId
              ? {
                  subType: { tagId },
                }
              : {}),
          },
          where: getWhereCondition({
            sectionId: 18,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.SIDE_IMAGE,
            GraphCMSPageVariation.inCountryWithTypeAndTag
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCityWithTypeAndTag,
            ...(tagId
              ? {
                  subType: { tagId },
                }
              : {}),
          },
          where: getWhereCondition({
            sectionId: 19,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithTypeAndTag
          ),
        },
        {
          domain: GraphCMSPageType.TourProductPage,
          where: getWhereCondition({
            sectionId: 20,
            domains: [GraphCMSPageType.Tours],
          }),
          sectionWhere: {
            ...(tagId ? { subTypes_some: { tagId } } : {}),
            combinedRating_not: null,
            isDeleted: false,
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.tourProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inContinentWithTypeAndTag,
            NOT: { metadataUri },
            ...(parentSubType
              ? {
                  subType: {
                    parentSubType: {
                      subtype: parentSubType,
                    },
                  },
                }
              : {}),
          },
          where: getWhereCondition({
            sectionId: 15,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCountryWithTypeAndTag
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inContinentWithType,
            ...setSubType(subtype),
          },
          where: getWhereCondition({
            sectionId: 11,
            domains: [GraphCMSPageType.Tours],
          }),
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
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCity,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
          },
          where: getWhereCondition({
            sectionId: 7,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCity
          ),
        },
        {
          domain: GraphCMSPageType.TourProductPage,
          where: getWhereCondition({
            sectionId: 8,
            domains: [GraphCMSPageType.Tours],
          }),
          sectionWhere: {
            combinedRating_not: null,
            OR: [
              { startPlace: { countries_some: { id: destinationPlaceId } } },
              { startPlace: { id: destinationPlaceId } },
            ],
            isDeleted: false,
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.tourProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCountryWithType,
            destination: {
              id: destinationPlaceId,
            },
          },
          where: getWhereCondition({
            sectionId: 12,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCountryWithType
          ),
        },
      ];
    case GraphCMSPageVariation.inCountryWithType:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            ...setSubType(subtype),
          },
          where: getWhereCondition({
            sectionId: 9,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
        {
          domain: GraphCMSPageType.TourProductPage,
          where: getWhereCondition({
            sectionId: 10,
            domains: [GraphCMSPageType.Tours],
          }),
          sectionWhere: {
            OR: [
              { startPlace: { countries_some: { id: destinationPlaceId } } },
              { startPlace: { id: destinationPlaceId } },
            ],
            combinedRating_not: null,
            ...(subtype ? { subTypes_some: { subtype } } : {}),
            isDeleted: false,
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.tourProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCountryWithType,
            NOT: { metadataUri },
            destination: {
              id: destinationPlaceId,
            },
          },
          where: getWhereCondition({
            sectionId: 12,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCountryWithType
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCountryWithTypeAndTag,
            destination: {
              id: destinationPlaceId,
            },
            ...(subtype
              ? {
                  subType: { parentSubType: { subtype } },
                }
              : {}),
          },
          where: getWhereCondition({
            sectionId: 16,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCountryWithTypeAndTag
          ),
        },
      ];
    case GraphCMSPageVariation.inCountryWithTypeAndTag:
      return [
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCityWithTypeAndTag,
            destinationCountryCodes_contains_some: destinationCountryCode
              ? [destinationCountryCode]
              : undefined,
            ...(tagId
              ? {
                  subType: { tagId },
                }
              : {}),
          },
          where: getWhereCondition({
            sectionId: 21,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithTypeAndTag
          ),
        },
        {
          domain: GraphCMSPageType.TourProductPage,
          where: getWhereCondition({
            sectionId: 22,
            domains: [GraphCMSPageType.Tours],
          }),
          sectionWhere: {
            OR: [
              { startPlace: { countries_some: { id: destinationPlaceId } } },
              { startPlace: { id: destinationPlaceId } },
            ],
            ...(tagId ? { subTypes_some: { tagId } } : {}),
            combinedRating_not: null,
            isDeleted: false,
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.tourProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCountryWithTypeAndTag,
            destination: {
              id: destinationPlaceId,
            },
            NOT: { metadataUri },
            ...(parentSubType
              ? {
                  subType: {
                    parentSubType: {
                      subtype: parentSubType,
                    },
                  },
                }
              : {}),
          },
          where: getWhereCondition({
            sectionId: 16,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCountryWithTypeAndTag
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCountryWithType,
            destination: {
              id: destinationPlaceId,
            },
          },
          where: getWhereCondition({
            sectionId: 12,
            domains: [GraphCMSPageType.Tours],
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
          domain: GraphCMSPageType.TourProductPage,
          where: getWhereCondition({
            sectionId: 14,
            domains: [GraphCMSPageType.Tours],
          }),
          sectionWhere: {
            startPlace: {
              id: destinationPlaceId,
            },
            combinedRating_not: null,
            isDeleted: false,
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.tourProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            destination: {
              id: destinationPlaceId,
            },
          },
          where: getWhereCondition({
            sectionId: 13,
            domains: [GraphCMSPageType.Tours],
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
          domain: GraphCMSPageType.TourProductPage,
          where: getWhereCondition({
            sectionId: 23,
            domains: [GraphCMSPageType.Tours],
          }),
          sectionWhere: {
            startPlace: {
              id: destinationPlaceId,
            },
            combinedRating_not: null,
            ...(subtype ? { subTypes_some: { subtype } } : {}),
            isDeleted: false,
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.tourProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCityWithTypeAndTag,
            destination: {
              id: destinationPlaceId,
            },
            ...(subtype
              ? {
                  subType: { parentSubType: { subtype } },
                }
              : {}),
          },
          where: getWhereCondition({
            sectionId: 17,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithTypeAndTag
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            NOT: { metadataUri },
            destination: {
              id: destinationPlaceId,
            },
          },
          where: getWhereCondition({
            sectionId: 13,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithType
          ),
        },
      ];
    case GraphCMSPageVariation.inCityWithTypeAndTag:
      return [
        {
          domain: GraphCMSPageType.TourProductPage,
          where: getWhereCondition({
            sectionId: 24,
            domains: [GraphCMSPageType.Tours],
          }),
          sectionWhere: {
            startPlace: {
              id: destinationPlaceId,
            },
            ...(tagId ? { subTypes_some: { tagId } } : {}),
            combinedRating_not: null,
            isDeleted: false,
          },
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.PRODUCT_CARD,
            GraphCMSPageVariation.tourProductPage
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCityWithTypeAndTag,
            NOT: { metadataUri },
            destination: {
              id: destinationPlaceId,
            },
            ...(parentSubType
              ? {
                  subType: {
                    parentSubType: {
                      subtype: parentSubType,
                    },
                  },
                }
              : {}),
          },
          where: getWhereCondition({
            sectionId: 17,
            domains: [GraphCMSPageType.Tours],
          }),
          itemsPerPage: getNrOfItemsPerPage(
            GraphCMSDisplayType.IMAGE,
            GraphCMSPageVariation.inCityWithTypeAndTag
          ),
        },
        {
          sectionWhere: {
            pageType: GraphCMSPageType.Tours,
            pageVariation: GraphCMSPageVariation.inCityWithType,
            destination: {
              id: destinationPlaceId,
            },
            ...setSubType(subtype),
          },
          where: getWhereCondition({
            sectionId: 13,
            domains: [GraphCMSPageType.Tours],
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

export default getTourSectionsWhereCondition;
