import React from "react";

import {
  constructLandingPageSideImageSectionCards,
  getNrOfSideImageSectionCardsOnPage,
} from "./utils/landingPageUtils";
import LandingPageCardSection from "./LandingPageCardSection";
import { LandingSectionPaginationParams } from "./hooks/useSectionPagination";

import { GraphCMSDisplayType, GraphCMSPageType } from "types/enums";

const LandingPageSideImageCardSection = ({
  title,
  sectionContent,
  ssrRender,
  placeNames,
  useSubTypeImage,
  useSubTypeTitle,
  shortTitle,
  useGoogleStaticImage,
  isFirstSection,
  sectionPageType,
  paginationParams,
  dataTestid,
}: {
  title: string;
  sectionContent: LandingPageTypes.QueryLandingPageSectionCardData[];
  ssrRender: boolean;
  placeNames: LandingPageTypes.PlaceNames;
  useSubTypeImage?: boolean;
  useSubTypeTitle?: boolean;
  shortTitle?: string;
  useGoogleStaticImage?: boolean;
  isFirstSection: boolean;
  sectionPageType?: GraphCMSPageType;
  paginationParams: LandingSectionPaginationParams;
  dataTestid?: string;
}) => {
  const sectionCards = constructLandingPageSideImageSectionCards(
    sectionContent,
    useGoogleStaticImage,
    useSubTypeImage,
    useSubTypeTitle
  );

  const sectionCardsOnPage = getNrOfSideImageSectionCardsOnPage();
  return (
    <LandingPageCardSection
      title={title}
      sectionContent={sectionCards}
      cardsOnPage={sectionCardsOnPage}
      fixedHeight={249}
      mobileRows={3}
      displayType={GraphCMSDisplayType.SIDE_IMAGE}
      columnSizes={{ small: 1, large: 1 / 3, desktop: 1 / 4 }}
      mobileCardWidth={350}
      ssrRender={ssrRender}
      isFirstSection={isFirstSection}
      placeNames={placeNames}
      shortTitle={shortTitle}
      sectionPageType={sectionPageType}
      paginationParams={paginationParams}
      dataTestid={dataTestid}
    />
  );
};

export default LandingPageSideImageCardSection;
