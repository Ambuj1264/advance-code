import memoizeOne from "memoize-one";

import { GraphCMSPageType, GraphCMSPageVariation } from "types/enums";

export const getCountryPageQueryCondition = memoizeOne((asPath?: string) => ({
  pageType: GraphCMSPageType.CountryPage,
  metadataUri: asPath,
}));

export const getLandingPageUriQueryCondition = () => ({
  pageVariation_in: [GraphCMSPageVariation.toContinent, GraphCMSPageVariation.inContinent],
  pageType_in: [
    GraphCMSPageType.Flights,
    GraphCMSPageType.Cars,
    GraphCMSPageType.Stays,
    GraphCMSPageType.Tours,
    GraphCMSPageType.VacationPackages,
  ],
  isDeleted: false,
});

export const getMarketplaceLandingPageUriQueryCondition = (isGTI: boolean) => {
  return isGTI
    ? {
        pageType: GraphCMSPageType.GTIFlights,
        pageVariation: GraphCMSPageVariation.toCountry,
      }
    : {
        pageType: GraphCMSPageType.GTTPFlights,
        pageVariation: GraphCMSPageVariation.toCountry,
      };
};
