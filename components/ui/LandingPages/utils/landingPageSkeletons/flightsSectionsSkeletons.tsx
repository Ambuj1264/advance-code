import React from "react";

import LandingPageSectionLoading from "../../LandingPageSectionLoading";
import LandingPageSideImageSectionLoading from "../../LandingPageSideImageSectionLoading";

import { GraphCMSPageVariation } from "types/enums";

const getFlightsSectionsSkeletons = ({
  pageVariation,
}: {
  pageVariation?: GraphCMSPageVariation;
}) => {
  switch (pageVariation) {
    case GraphCMSPageVariation.toContinent:
      return [
        <LandingPageSideImageSectionLoading isFirstSection />,
        <LandingPageSectionLoading />,
        <LandingPageSectionLoading />,
        <LandingPageSectionLoading customTotalCards={12} />,
      ];
    case GraphCMSPageVariation.toCountry:
    case GraphCMSPageVariation.fromCountry:
      return [
        <LandingPageSectionLoading isFirstSection />,
        <LandingPageSectionLoading customTotalCards={12} />,
        <LandingPageSectionLoading />,
        <LandingPageSectionLoading />,
        <LandingPageSideImageSectionLoading />,
        <LandingPageSectionLoading />,
      ];
    case GraphCMSPageVariation.toCity:
      return [
        <LandingPageSectionLoading isFirstSection />,
        <LandingPageSectionLoading />,
        <LandingPageSectionLoading />,
        <LandingPageSideImageSectionLoading />,
        <LandingPageSectionLoading />,
      ];
    case GraphCMSPageVariation.fromCity:
      return [
        <LandingPageSectionLoading isFirstSection />,
        <LandingPageSectionLoading />,
        <LandingPageSideImageSectionLoading />,
        <LandingPageSectionLoading />,
      ];
    case GraphCMSPageVariation.fromCityToCity:
      return [
        <LandingPageSectionLoading isFirstSection />,
        <LandingPageSectionLoading />,
        <LandingPageSectionLoading />,
        <LandingPageSectionLoading customTotalCards={12} />,
      ];
    case GraphCMSPageVariation.fromCountryToCountry:
    default:
      return [
        <LandingPageSectionLoading isFirstSection />,
        <LandingPageSectionLoading customTotalCards={12} />,
        <LandingPageSideImageSectionLoading />,
      ];
  }
};

export default getFlightsSectionsSkeletons;
