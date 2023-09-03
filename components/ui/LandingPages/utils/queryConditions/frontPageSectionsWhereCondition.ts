import { getNrOfItemsPerPage, getWhereCondition, setSubType } from "../landingPageUtils";

import {
  GraphCMSDisplayType,
  GraphCMSPageType,
  GraphCMSPageVariation,
  GraphCMSSubType,
  SupportedLanguages,
} from "types/enums";
import { isDev } from "utils/globalUtils";
import { isStaysPageIndexed } from "components/features/StayProductPage/utils/stayUtils";
import { toursEnabledForLocale } from "components/features/GTETourProductPage/utils/gteTourUtils";
import { vpEnabledForLocale } from "components/features/VacationPackageProductPage/utils/vpEnabledForLocale";

const getFrontPageSectionsWhereConditions = (
  locale: SupportedLanguages,
  ssrQueries?: boolean
): LandingPageTypes.SectionWhereCondition[] => {
  return [
    // Top travel services in Europe
    {
      sectionWhere: {
        pageVariation_in: [GraphCMSPageVariation.toContinent, GraphCMSPageVariation.inContinent],
        pageType_in: [
          GraphCMSPageType.Flights,
          ...(isStaysPageIndexed(true, locale) || isDev() ? [GraphCMSPageType.Stays] : []),
          ...(toursEnabledForLocale(locale) ? [GraphCMSPageType.Tours] : []),
          GraphCMSPageType.Cars,
          ...(vpEnabledForLocale(locale) ? [GraphCMSPageType.VacationPackages] : []),
          ...(locale === "en" ? [GraphCMSPageType.TravelGuidesLanding] : []),
        ],
      },
      where: getWhereCondition({
        sectionId: 1,
        domains: [GraphCMSPageType.FrontPage],
      }),
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.LARGE_IMAGE,
        GraphCMSPageVariation.guide,
        true
      ),
    },
    // Your guide to all countries in Europe
    {
      sectionWhere: {
        pageVariation: GraphCMSPageVariation.guide,
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
    // Vacation packages
    ...(vpEnabledForLocale(locale)
      ? [
          // Vacation packages in all countries in Europe
          {
            sectionWhere: {
              pageType: GraphCMSPageType.VacationPackages,
              pageVariation: GraphCMSPageVariation.inCountry,
              ...setSubType(GraphCMSSubType.VP_TOP_LEVEL),
            },
            where: getWhereCondition({
              sectionId: 2,
              domains: [GraphCMSPageType.VacationPackages],
            }),
            useSortedQuery: true,
            itemsPerPage: getNrOfItemsPerPage(
              GraphCMSDisplayType.SIDE_IMAGE,
              GraphCMSPageVariation.inCountryWithType,
              true
            ),
          },
          // Vacation packages starting in all the top cities in Europe
          {
            sectionWhere: {
              pageType: GraphCMSPageType.VacationPackages,
              pageVariation: GraphCMSPageVariation.inCity,
            },
            where: getWhereCondition({
              sectionId: 4,
              domains: [GraphCMSPageType.VacationPackages],
            }),
            itemsPerPage: getNrOfItemsPerPage(
              GraphCMSDisplayType.IMAGE,
              GraphCMSPageVariation.inCityWithType,
              true
            ),
          },
          // Top-rated vacation packages in Europe
          {
            domain: GraphCMSPageType.VpProductPage,
            where: getWhereCondition({
              sectionId: 7,
              domains: [GraphCMSPageType.VacationPackages],
            }),
            sectionWhere: {
              NOT: { fromPrice: 0 },
            },
            itemsPerPage: getNrOfItemsPerPage(
              GraphCMSDisplayType.PRODUCT_CARD,
              GraphCMSPageVariation.VpProductPage,
              true
            ),
          },
        ]
      : []),
    // tours
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
        GraphCMSPageVariation.inCountry,
        true
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
        GraphCMSPageVariation.inCity,
        true
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
        GraphCMSPageVariation.tourProductPage,
        true
      ),
    },
    // flights
    {
      sectionWhere: {
        pageVariation: GraphCMSPageVariation.toCountry,
        pageType: GraphCMSPageType.Flights,
      },
      where: getWhereCondition({
        sectionId: 101,
        domains: [GraphCMSPageType.Flights],
      }),
      useSortedQuery: true,
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.SIDE_IMAGE,
        GraphCMSPageVariation.toCountry,
        true
      ),
    },
    {
      sectionWhere: {
        pageVariation: GraphCMSPageVariation.toCity,
        pageType: GraphCMSPageType.Flights,
      },
      where: getWhereCondition({
        sectionId: 102,
        domains: [GraphCMSPageType.Flights],
      }),
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.IMAGE,
        GraphCMSPageVariation.toCity,
        true
      ),
    },
    // stays
    ...(isStaysPageIndexed(true, locale) || isDev()
      ? [
          {
            sectionWhere: {
              pageType: GraphCMSPageType.Stays,
              pageVariation: GraphCMSPageVariation.inContinentWithType,
            },
            where: getWhereCondition({
              sectionId: 1,
              domains: [GraphCMSPageType.Stays],
            }),
            itemsPerPage: getNrOfItemsPerPage(
              GraphCMSDisplayType.IMAGE,
              GraphCMSPageVariation.inContinentWithType,
              true
            ),
            orderBy: "combinedRank_DESC",
          },
          {
            sectionWhere: {
              pageType: GraphCMSPageType.Stays,
              pageVariation: GraphCMSPageVariation.inCountry,
            },
            where: getWhereCondition({
              sectionId: 2,
              domains: [GraphCMSPageType.Stays],
            }),
            useSortedQuery: true,
            itemsPerPage: getNrOfItemsPerPage(
              GraphCMSDisplayType.SIDE_IMAGE,
              GraphCMSPageVariation.inCountry,
              true
            ),
          },
          {
            sectionWhere: {
              pageType: GraphCMSPageType.Stays,
              pageVariation: GraphCMSPageVariation.inCity,
            },
            where: getWhereCondition({
              sectionId: 3,
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
              sectionId: 4,
              domains: [GraphCMSPageType.Stays],
            }),
            sectionWhere: {
              NOT: { fromPrice: 0 },
              combinedRating_not: null,
              isDisabled: false,
            },
            itemsPerPage: getNrOfItemsPerPage(
              GraphCMSDisplayType.PRODUCT_CARD,
              GraphCMSPageVariation.staysProductPage,
              true
            ),
          },
        ]
      : []),
    // cars
    {
      sectionWhere: {
        pageType: GraphCMSPageType.Cars,
        pageVariation: GraphCMSPageVariation.inContinentWithType,
      },
      where: getWhereCondition({
        sectionId: 9,
        domains: [GraphCMSPageType.Cars],
      }),
      orderBy: "subtypeSortingValue_ASC",
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.IMAGE,
        GraphCMSPageVariation.inContinentWithType,
        true
      ),
    },
    {
      sectionWhere: {
        pageVariation: GraphCMSPageVariation.inCountry,
        pageType: GraphCMSPageType.Cars,
      },
      where: getWhereCondition({
        sectionId: 7,
        domains: [GraphCMSPageType.Cars],
      }),
      useSortedQuery: true,
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.SIDE_IMAGE,
        GraphCMSPageVariation.inCountry,
        true
      ),
    },
    {
      sectionWhere: {
        pageVariation: GraphCMSPageVariation.inCity,
        pageType: GraphCMSPageType.Cars,
      },
      where: getWhereCondition({
        sectionId: 6,
        domains: [GraphCMSPageType.Cars],
      }),
      itemsPerPage: getNrOfItemsPerPage(
        GraphCMSDisplayType.IMAGE,
        GraphCMSPageVariation.inCity,
        true
      ),
    },
    ...(!ssrQueries
      ? [
          {
            domain: GraphCMSPageType.TravelGuidesLanding,
            where: {
              domain: GraphCMSPageType.TravelGuides,
              sectionId: 1,
            },
            sectionWhere: {
              isDeleted: false,
              NOT: { uniqueId: "EU" },
            },
            itemsPerPage: getNrOfItemsPerPage(
              GraphCMSDisplayType.SIDE_IMAGE,
              GraphCMSPageVariation.inCountry,
              true
            ),
          },
        ]
      : []),
    ...(!ssrQueries
      ? [
          {
            domain: GraphCMSPageType.TravelGuides,
            sectionWhere: {
              cityId: 0,
              countryCode: "EU",
              order: [{ attractionReviewCountSum: "DESC" }],
            },
            where: getWhereCondition({
              sectionId: 2,
              domains: [GraphCMSPageType.FrontPage],
            }),
            itemsPerPage: getNrOfItemsPerPage(
              GraphCMSDisplayType.TG_CARD,
              GraphCMSPageVariation.travelGuidesDestination,
              true
            ),
          },
        ]
      : []),
  ];
};

export default getFrontPageSectionsWhereConditions;
