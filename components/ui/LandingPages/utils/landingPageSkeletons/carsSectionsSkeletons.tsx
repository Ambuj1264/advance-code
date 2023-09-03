import React from "react";

import LandingPageSectionLoading from "../../LandingPageSectionLoading";
import LandingPageSideImageSectionLoading from "../../LandingPageSideImageSectionLoading";

import { GraphCMSPageVariation } from "types/enums";

const getCarsSectionsSkeletons = ({ pageVariation }: { pageVariation?: GraphCMSPageVariation }) => {
  switch (pageVariation) {
    case GraphCMSPageVariation.inContinent:
      return [
        <LandingPageSideImageSectionLoading isFirstSection key={`${pageVariation}_1`} />,
        <LandingPageSectionLoading key={`${pageVariation}_2`} />,
        <LandingPageSectionLoading customTotalCards={12} key={`${pageVariation}_3`} />,
      ];
    case GraphCMSPageVariation.inContinentWithType:
      return [
        <LandingPageSideImageSectionLoading isFirstSection key={`${pageVariation}_1`} />,
        <LandingPageSectionLoading key={`${pageVariation}_2`} />,
        <LandingPageSectionLoading customTotalCards={12} key={`${pageVariation}_3`} />,
        <LandingPageSideImageSectionLoading key={`${pageVariation}_4`} />,
        <LandingPageSectionLoading key={`${pageVariation}_5`} />,
      ];
    case GraphCMSPageVariation.inCountry:
      return [
        <LandingPageSectionLoading isFirstSection key={`${pageVariation}_1`} />,
        <LandingPageSectionLoading customTotalCards={12} key={`${pageVariation}_2`} />,
        <LandingPageSectionLoading key={`${pageVariation}_3`} />,
        <LandingPageSideImageSectionLoading key={`${pageVariation}_4`} />,
        <LandingPageSectionLoading key={`${pageVariation}_5`} />,
      ];
    case GraphCMSPageVariation.inCountryWithType:
      return [
        <LandingPageSectionLoading isFirstSection key={`${pageVariation}_1`} />,
        <LandingPageSectionLoading key={`${pageVariation}_2`} />,
        <LandingPageSectionLoading customTotalCards={6} key={`${pageVariation}_3`} />,
        <LandingPageSideImageSectionLoading key={`${pageVariation}_4`} />,
        <LandingPageSectionLoading customTotalCards={12} key={`${pageVariation}_5`} />,
      ];
    case GraphCMSPageVariation.inCity:
      return [
        <LandingPageSectionLoading
          isFirstSection
          customTotalCards={6}
          key={`${pageVariation}_1`}
        />,
        <LandingPageSectionLoading key={`${pageVariation}_2`} />,
        <LandingPageSideImageSectionLoading key={`${pageVariation}_3`} />,
        <LandingPageSectionLoading key={`${pageVariation}_4`} />,
      ];
    case GraphCMSPageVariation.inCityWithType:
      return [
        <LandingPageSectionLoading isFirstSection key={`${pageVariation}_1`} />,
        <LandingPageSectionLoading customTotalCards={6} key={`${pageVariation}_2`} />,
        <LandingPageSideImageSectionLoading key={`${pageVariation}_3`} />,
        <LandingPageSectionLoading key={`${pageVariation}_4`} />,
      ];
    case GraphCMSPageVariation.inAirport:
    case GraphCMSPageVariation.inAirportWithType:
      return [
        <LandingPageSectionLoading
          isFirstSection
          customTotalCards={6}
          key={`${pageVariation}_1`}
        />,
        <LandingPageSectionLoading key={`${pageVariation}_2`} />,
        <LandingPageSectionLoading key={`${pageVariation}_3`} />,
      ];
    default:
      return [
        <LandingPageSectionLoading
          isFirstSection
          customTotalCards={6}
          key={`${pageVariation}_1`}
        />,
        <LandingPageSectionLoading key={`${pageVariation}_2`} />,
        <LandingPageSectionLoading key={`${pageVariation}_3`} />,
      ];
  }
};

export default getCarsSectionsSkeletons;
