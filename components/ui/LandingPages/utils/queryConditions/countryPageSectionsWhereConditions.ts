import { getNrOfItemsPerPage, getWhereCondition, setSubType } from "../landingPageUtils";

import {
  GraphCMSPageVariation,
  GraphCMSPageType,
  SupportedLanguages,
  GraphCMSDisplayType,
} from "types/enums";
import { isDev } from "utils/globalUtils";
import { isStaysPageIndexed } from "components/features/StayProductPage/utils/stayUtils";
import { toursEnabledForLocale } from "components/features/GTETourProductPage/utils/gteTourUtils";
import { vpEnabledForLocale } from "components/features/VacationPackageProductPage/utils/vpEnabledForLocale";

const getCountryPageSectionsWhereConditions = ({
  destinationPlaceId,
  domain,
  metadataUri,
  locale,
  subtype,
  destinationCountryCode,
  ssrQueries,
}: LandingPageTypes.LandingPagePrefetchParams & {
  domain: GraphCMSPageType;
  locale: SupportedLanguages;
}): LandingPageTypes.SectionWhereCondition[] => {
  return [
    {
      sectionWhere: {
        pageVariation_in: [GraphCMSPageVariation.toCountry, GraphCMSPageVariation.inCountry],
        pageType_in: [
          GraphCMSPageType.Flights,
          ...(isStaysPageIndexed(true, locale) || isDev() ? [GraphCMSPageType.Stays] : []),
          ...(toursEnabledForLocale(locale) ? [GraphCMSPageType.Tours] : []),
          GraphCMSPageType.Cars,
          ...(vpEnabledForLocale(locale) ? [GraphCMSPageType.VacationPackages] : []),
          ...(locale === "en" ? [GraphCMSPageType.TravelGuidesLanding] : []),
        ],
        destination: {
          id: destinationPlaceId,
        },
      },
      where: getWhereCondition({ sectionId: 1, domains: [domain] }),
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.IMAGE,
        GraphCMSPageVariation.inCountry,
        true
      ),
    },
    ...(vpEnabledForLocale(locale)
      ? [
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
              ...setSubType(subtype),
            },
            itemsPerPage: getNrOfItemsPerPage(
              GraphCMSDisplayType.PRODUCT_CARD,
              GraphCMSPageVariation.VpProductPage,
              true
            ),
          },
          {
            sectionWhere: {
              pageType: GraphCMSPageType.VacationPackages,
              pageVariation: GraphCMSPageVariation.inCity,
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
            useSortedQuery: true,
            itemsPerPage: getNrOfItemsPerPage(
              GraphCMSDisplayType.IMAGE,
              GraphCMSPageVariation.inCityWithType,
              true
            ),
          },
        ]
      : []),
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
        GraphCMSPageVariation.inCity,
        true
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
        startPlace: {
          countries_some: {
            id: destinationPlaceId,
          },
        },
        isDeleted: false,
      },
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.PRODUCT_CARD,
        GraphCMSPageVariation.tourProductPage,
        true
      ),
    },
    {
      sectionWhere: {
        pageType: GraphCMSPageType.Flights,
        pageVariation: GraphCMSPageVariation.toCity,
        destinationCountryCodes_contains_some: destinationCountryCode
          ? [destinationCountryCode]
          : undefined,
      },
      where: getWhereCondition({
        sectionId: 103,
        domains: [GraphCMSPageType.Flights],
      }),
      useSortedQuery: true,
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.IMAGE,
        GraphCMSPageVariation.toCity,
        true
      ),
    },
    ...(isStaysPageIndexed(true, locale) || isDev()
      ? [
          {
            sectionWhere: {
              pageType: GraphCMSPageType.Stays,
              pageVariation: GraphCMSPageVariation.inCountryWithType,
              destinationPlaceId,
            },
            where: getWhereCondition({
              sectionId: 9,
              domains: [GraphCMSPageType.Stays],
            }),
            useSortedQuery: true,
            itemsPerPage: getNrOfItemsPerPage(
              GraphCMSDisplayType.IMAGE,
              GraphCMSPageVariation.inCountryWithType,
              true
            ),
          },
          {
            sectionWhere: {
              pageType: GraphCMSPageType.Stays,
              pageVariation: GraphCMSPageVariation.inCity,
              destinationCountryCodes_contains_some: destinationCountryCode
                ? [destinationCountryCode]
                : undefined,
            },
            where: getWhereCondition({
              sectionId: 8,
              domains: [GraphCMSPageType.Stays],
            }),
            orderBy: "combinedRank_DESC",
            itemsPerPage: getNrOfItemsPerPage(
              GraphCMSDisplayType.IMAGE,
              GraphCMSPageVariation.inCity,
              true
            ),
          },
          {
            domain: GraphCMSPageType.StaysProductPage,
            where: getWhereCondition({
              sectionId: 10,
              domains: [GraphCMSPageType.Stays],
            }),
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
              GraphCMSPageVariation.staysProductPage,
              true
            ),
          },
        ]
      : []),
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
      orderBy: "subtypeSortingValue_ASC",
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.IMAGE,
        GraphCMSPageVariation.inCountryWithType,
        true
      ),
    },
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
      useSortedQuery: true,
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.IMAGE,
        GraphCMSPageVariation.inCity,
        true
      ),
    },
    ...(!ssrQueries
      ? [
          {
            domain: GraphCMSPageType.TravelGuides,
            sectionWhere: {
              cityId: 0,
              countryCode: destinationCountryCode,
              order: [{ attractionReviewCountSum: "DESC" }],
            },
            where: getWhereCondition({
              sectionId: 3,
              domains: [GraphCMSPageType.CountryPage],
            }),
            itemsPerPage: getNrOfItemsPerPage(
              GraphCMSDisplayType.TG_CARD,
              GraphCMSPageVariation.travelGuidesDestination,
              true
            ),
          },
        ]
      : []),
    {
      sectionWhere: {
        pageVariation: GraphCMSPageVariation.guide,
        NOT: { metadataUri },
      },
      where: getWhereCondition({
        sectionId: 2,
        domains: [GraphCMSPageType.CountryPage],
      }),
      domain: GraphCMSPageType.CountryPage,
      useSortedQuery: true,
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.IMAGE_WITH_ACTION,
        GraphCMSPageVariation.guide,
        true
      ),
    },
  ];
};

export default getCountryPageSectionsWhereConditions;
