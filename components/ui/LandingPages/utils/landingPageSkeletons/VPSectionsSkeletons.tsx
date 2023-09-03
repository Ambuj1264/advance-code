import React from "react";

import LandingPageSectionLoading from "../../LandingPageSectionLoading";
import LandingPageProductSectionLoading from "../../LandingPageProductSectionLoading";
import LandingPageSideImageSectionLoading from "../../LandingPageSideImageSectionLoading";

import routes from "shared/routes";
import { GraphCMSPageVariation } from "types/enums";
import { ROUTE_NAMES } from "shared/routeNames";

export const getVPFallbackPageVariation = (asPath: string, marketplaceUrl: string) => {
  const match = routes.match(asPath, marketplaceUrl);
  switch (match.route.name) {
    case ROUTE_NAMES.GTE_VACATION_PACKAGES_LANDING_COUNTRY_WITH_SLUG:
      return GraphCMSPageVariation.inCity;
    case ROUTE_NAMES.GTE_VACATION_PACKAGES_LANDING_COUNTRY:
      return GraphCMSPageVariation.inCountry;
    case ROUTE_NAMES.GTE_VACATION_PACKAGES_LANDING_WITH_SLUG:
      return GraphCMSPageVariation.inContinentWithType;
    default:
      return GraphCMSPageVariation.inContinent;
  }
};

const getVpSectionsSkeletons = ({ pageVariation }: { pageVariation?: GraphCMSPageVariation }) => {
  switch (pageVariation) {
    case GraphCMSPageVariation.inContinent:
    case GraphCMSPageVariation.inContinentWithType:
      return [
        <LandingPageSideImageSectionLoading isFirstSection key="skeletonItem-1" />,
        <LandingPageSectionLoading key="skeletonItem-2" />,
        <LandingPageSectionLoading key="skeletonItem-3" customTotalCards={4} />,
        <LandingPageProductSectionLoading key="skeletonItem-4" />,
      ];
    case GraphCMSPageVariation.inCountry:
    case GraphCMSPageVariation.inCountryWithType:
      return [
        <LandingPageSectionLoading isFirstSection key="skeletonItem-0" customTotalCards={4} />,
        <LandingPageSectionLoading key="skeletonItem-0" />,
        <LandingPageProductSectionLoading key="skeletonItem-1" />,
        <LandingPageSideImageSectionLoading key="skeletonItem-2" />,
      ];
    case GraphCMSPageVariation.inCity:
    case GraphCMSPageVariation.inCityWithType:
      return [
        <LandingPageSectionLoading isFirstSection key="skeletonItem-0" customTotalCards={4} />,
        <LandingPageProductSectionLoading isFirstSection key="skeletonItem-1" />,
      ];
    default:
      return [
        <LandingPageProductSectionLoading isFirstSection key="skeletonItem-0" />,
        <LandingPageSectionLoading key="skeletonItem-1" />,
        <LandingPageSectionLoading key="skeletonItem-2" />,
      ];
  }
};

export default getVpSectionsSkeletons;
