import React from "react";

import LandingPageCardSection from "./LandingPageCardSection";
import { LandingSectionPaginationParams } from "./hooks/useSectionPagination";
import { getNrOfSectionProductCardsOnPage } from "./utils/landingPageUtils";

import { GraphCMSDisplayType, GraphCMSPageType } from "types/enums";

export const LANDING_PAGE_PRODUCT_CARD_COLUMN_SIZES = {
  small: 1,
  large: 1 / 3,
  desktop: 1 / 4,
};

export const LANDING_PAGE_PRODUCT_CARD_MOBILE_WIDTH = 340;

const LandingPageProductCardSection = ({
  title,
  sectionCards,
  isFirstSection,
  placeNames,
  shortTitle,
  isFrontOrCountry = false,
  sectionPageType,
  paginationParams,
  displayType = GraphCMSDisplayType.PRODUCT_CARD,
}: {
  title: string;
  sectionCards: LandingPageTypes.LandingPageSectionCard[];
  isFirstSection: boolean;
  placeNames: LandingPageTypes.PlaceNames;
  shortTitle?: string;
  isFrontOrCountry?: boolean;
  sectionPageType?: GraphCMSPageType;
  paginationParams: LandingSectionPaginationParams;
  displayType?: GraphCMSDisplayType;
}) => {
  const sectionCardsOnPage = getNrOfSectionProductCardsOnPage(isFrontOrCountry);
  const sectionHeight = isFrontOrCountry ? 426 : 872;
  return (
    <LandingPageCardSection
      title={title}
      sectionContent={sectionCards}
      cardsOnPage={sectionCardsOnPage}
      fixedHeight={sectionHeight}
      mobileRows={1}
      displayType={displayType}
      columnSizes={LANDING_PAGE_PRODUCT_CARD_COLUMN_SIZES}
      mobileCardWidth={LANDING_PAGE_PRODUCT_CARD_MOBILE_WIDTH}
      isFirstSection={isFirstSection}
      placeNames={placeNames}
      shortTitle={shortTitle}
      sectionPageType={sectionPageType}
      paginationParams={paginationParams}
    />
  );
};

export default LandingPageProductCardSection;
