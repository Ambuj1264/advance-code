import React from "react";

import LandingPageSectionLoading from "../../LandingPageSectionLoading";
import LandingPageProductSectionLoading from "../../LandingPageProductSectionLoading";
import LandingPageSideImageSectionLoading from "../../LandingPageSideImageSectionLoading";

import { GraphCMSPageVariation } from "types/enums";

const getFrontPageSkeletons = ({ pageVariation }: { pageVariation?: GraphCMSPageVariation }) => {
  switch (pageVariation) {
    case GraphCMSPageVariation.guide:
      return [
        <LandingPageSectionLoading customTotalCards={6} isFirstSection />,
        <LandingPageProductSectionLoading customTotalCards={4} />,
        <LandingPageSectionLoading customTotalCards={12} />,
        <LandingPageSectionLoading customTotalCards={12} />,
        <LandingPageSectionLoading customTotalCards={6} />,
        <LandingPageSectionLoading customTotalCards={12} />,
        <LandingPageProductSectionLoading customTotalCards={4} />,
        <LandingPageSectionLoading customTotalCards={6} />,
        <LandingPageSectionLoading customTotalCards={12} />,
        <LandingPageSectionLoading customTotalCards={8} isLargeImage />,
      ];
    default:
      return [
        <LandingPageSectionLoading customTotalCards={6} isFirstSection />,
        <LandingPageSectionLoading customTotalCards={8} isLargeImage />,
        <LandingPageSideImageSectionLoading />,
        <LandingPageSectionLoading customTotalCards={12} />,
        <LandingPageProductSectionLoading customTotalCards={4} />,
        <LandingPageSideImageSectionLoading />,
        <LandingPageSectionLoading customTotalCards={12} />,
        <LandingPageSectionLoading customTotalCards={6} />,
        <LandingPageSideImageSectionLoading />,
        <LandingPageSectionLoading customTotalCards={12} />,
        <LandingPageProductSectionLoading customTotalCards={4} />,
        <LandingPageSectionLoading customTotalCards={6} />,
        <LandingPageSideImageSectionLoading />,
        <LandingPageSectionLoading customTotalCards={12} />,
      ];
  }
};

export default getFrontPageSkeletons;
