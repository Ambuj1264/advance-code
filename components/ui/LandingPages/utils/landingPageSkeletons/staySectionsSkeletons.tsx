import React from "react";

import LandingPageSectionLoading from "../../LandingPageSectionLoading";
import LandingPageProductSectionLoading from "../../LandingPageProductSectionLoading";
import LandingPageSideImageSectionLoading from "../../LandingPageSideImageSectionLoading";

import { GraphCMSPageVariation } from "types/enums";

const getStaysSectionsSkeletons = ({
  pageVariation,
}: {
  pageVariation?: GraphCMSPageVariation;
}) => {
  switch (pageVariation) {
    case GraphCMSPageVariation.inContinent:
      return [
        <LandingPageSectionLoading isFirstSection customTotalCards={6} />,
        <LandingPageSideImageSectionLoading />,
        <LandingPageSectionLoading />,
        <LandingPageProductSectionLoading />,
      ];
    case GraphCMSPageVariation.inContinentWithType:
      return [
        <LandingPageSideImageSectionLoading isFirstSection />,
        <LandingPageSectionLoading />,
        <LandingPageProductSectionLoading />,
        <LandingPageSectionLoading customTotalCards={6} />,
      ];
    case GraphCMSPageVariation.inCountryWithType:
      return [
        <LandingPageSectionLoading isFirstSection />,
        <LandingPageProductSectionLoading />,
        <LandingPageSectionLoading customTotalCards={6} />,
        <LandingPageSideImageSectionLoading />,
        <LandingPageSectionLoading />,
      ];
    case GraphCMSPageVariation.inCountry:
      return [
        <LandingPageSectionLoading isFirstSection />,
        <LandingPageSectionLoading customTotalCards={6} />,
        <LandingPageProductSectionLoading />,
        <LandingPageSideImageSectionLoading />,
        <LandingPageSectionLoading />,
      ];
    case GraphCMSPageVariation.inCityWithType:
      return [
        <LandingPageSectionLoading isFirstSection customTotalCards={6} />,
        <LandingPageProductSectionLoading />,
        <LandingPageSectionLoading />,
        <LandingPageSideImageSectionLoading />,
        <LandingPageSectionLoading />,
      ];
    case GraphCMSPageVariation.inCity:
    default:
      return [
        <LandingPageSectionLoading isFirstSection customTotalCards={6} />,
        <LandingPageProductSectionLoading />,
        <LandingPageSideImageSectionLoading />,
        <LandingPageSectionLoading />,
      ];
  }
};

export default getStaysSectionsSkeletons;
