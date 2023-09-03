import React from "react";

import LandingPageSectionLoading from "../../LandingPageSectionLoading";
import LandingPageProductSectionLoading from "../../LandingPageProductSectionLoading";
import LandingPageSideImageSectionLoading from "../../LandingPageSideImageSectionLoading";

import { GraphCMSPageVariation } from "types/enums";

const getTourSectionsSkeletons = ({ pageVariation }: { pageVariation?: GraphCMSPageVariation }) => {
  switch (pageVariation) {
    case GraphCMSPageVariation.inContinent:
      return [
        <LandingPageSideImageSectionLoading isFirstSection />,
        <LandingPageSectionLoading />,
        <LandingPageProductSectionLoading />,
        <LandingPageSectionLoading />,
      ];
    case GraphCMSPageVariation.inContinentWithType:
    case GraphCMSPageVariation.inContinentWithTypeAndTag:
      return [
        <LandingPageSideImageSectionLoading isFirstSection />,
        <LandingPageSectionLoading />,
        <LandingPageProductSectionLoading />,
        <LandingPageSectionLoading />,
        <LandingPageSectionLoading />,
      ];
    case GraphCMSPageVariation.inCountryWithType:
    case GraphCMSPageVariation.inCountryWithTypeAndTag:
      return [
        <LandingPageSectionLoading isFirstSection />,
        <LandingPageProductSectionLoading />,
        <LandingPageSectionLoading />,
        <LandingPageSectionLoading />,
      ];
    case GraphCMSPageVariation.inCountry:
      return [
        <LandingPageSectionLoading isFirstSection />,
        <LandingPageProductSectionLoading />,
        <LandingPageSectionLoading />,
      ];
    case GraphCMSPageVariation.inCity:
      return [<LandingPageProductSectionLoading isFirstSection />, <LandingPageSectionLoading />];
    case GraphCMSPageVariation.inCityWithType:
    case GraphCMSPageVariation.inCityWithTypeAndTag:
      return [
        <LandingPageProductSectionLoading isFirstSection />,
        <LandingPageSectionLoading />,
        <LandingPageSectionLoading />,
      ];
    default:
      return [];
  }
};

export default getTourSectionsSkeletons;
