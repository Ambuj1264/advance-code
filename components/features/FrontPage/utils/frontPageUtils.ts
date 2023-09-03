import memoizeOne from "memoize-one";

import { GraphCMSPageType, GraphCMSPageVariation } from "types/enums";

export const getFrontPageQueryCondition = memoizeOne((asPath?: string) => ({
  pageType: GraphCMSPageType.FrontPage,
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
