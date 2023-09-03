import { TGDSectionType } from "../types/travelGuideEnums";

import { getServicesWhereCondition } from "./travelGuideUtils";

import { GraphCMSPageType, GraphCMSPageVariation } from "types/enums";

const destinationTGSectionsWhereCondition = ({
  destinationPlaceId,
  destinationCountryCode,
  metadataUri,
}: LandingPageTypes.LandingPagePrefetchParams) => {
  return [
    {
      where: {
        url: {
          neq: metadataUri,
        },
      },
      input: {
        cityId: 0,
        countryCode: destinationCountryCode,
        order: "MOST_POPLUAR",
        page: 1,
      },
      sectionType: TGDSectionType.TopDestinations,
      domain: GraphCMSPageType.Destinations,
    },
    {
      where: getServicesWhereCondition(destinationPlaceId),
      sectionType: TGDSectionType.TGDTopServices,
    },
    {
      where: {
        pageType: GraphCMSPageType.CountryPage,
        pageVariation: GraphCMSPageVariation.guide,
        destinationId: destinationCountryCode,
        isDeleted: false,
      },
      sectionType: TGDSectionType.TGDLearnMoreCountry,
    },
    {
      where: { domain_in: [GraphCMSPageType.CountryPage], sectionId: 2 },
      sectionWhere: {
        pageVariation: GraphCMSPageVariation.guide,
        isDeleted: false,
      },
      first: 10,
      continentGroup: [],
      metadataUri: "/",
      sectionType: TGDSectionType.GuideToContinentSideBar,
      domain: TGDSectionType.GuideToContinentSideBar,
    },
    {
      where: {
        pageType: GraphCMSPageType.Tours,
        pageVariation: GraphCMSPageVariation.inCityWithType,
        destination: {
          id: destinationPlaceId,
        },
        isDeleted: false,
      },
      sectionType: TGDSectionType.PopularExperiencesInDestination,
    },
    {
      where: {
        combinedRating_not: null,
        startPlace: {
          id: destinationPlaceId,
        },
        isDeleted: false,
      },
      sectionType: TGDSectionType.ToursAndTicketsDestination,
      domain: GraphCMSPageType.Tours,
    },
    {
      where: {
        endPlace: {
          id: destinationPlaceId,
        },
        NOT: { fromPrice: 0 },
        isDeleted: false,
      },
      sectionType: TGDSectionType.TopVPsDestination,
      domain: GraphCMSPageType.VpProductPage,
    },
    {
      where: {
        pageType: GraphCMSPageType.VacationPackages,
        destinationPlaceId,
        isDeleted: false,
      },
      sectionType: TGDSectionType.PopularTypesOfVPsDestination,
    },
    {
      where: {
        pageVariation: GraphCMSPageVariation.fromCityToCity,
        destinationPlaceId,
        pageType: GraphCMSPageType.Flights,
        isDeleted: false,
      },
      sectionType: TGDSectionType.PopularFlightToDestination,
    },
    {
      where: {
        pageVariation: GraphCMSPageVariation.inCityWithType,
        destinationPlaceId,
        pageType: GraphCMSPageType.Stays,
        isDeleted: false,
      },
      sectionType: TGDSectionType.PopularTypesOfStaysInDestination,
    },
    {
      where: {
        combinedRating_not: null,
        NOT: { fromPrice: 0 },
        placeId: destinationPlaceId,
        isDisabled: false,
      },
      sectionType: TGDSectionType.TopHotelsInDestination,
      domain: GraphCMSPageType.Stays,
    },
    {
      orderBy: "subtypeSortingValue_ASC",
      where: {
        pageVariation: GraphCMSPageVariation.inCityWithType,
        destinationPlaceId,
        pageType: GraphCMSPageType.Cars,
        isDeleted: false,
      },
      sectionType: TGDSectionType.PopularTypesCarRentalDestination,
    },
    {
      // TODO: replace hardcoded value.
      where: {
        pageVariation: GraphCMSPageVariation.fromCityToCity,
        pageType: GraphCMSPageType.Flights,
        destinationCountryCodes_contains_some: destinationCountryCode
          ? [destinationCountryCode]
          : undefined,
        origin: {
          id: destinationPlaceId,
        },
        isDeleted: false,
      },
      sectionType: TGDSectionType.PopularDomesticFlightsFromDestination,
    },
  ];
};

export default destinationTGSectionsWhereCondition;
