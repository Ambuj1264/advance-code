import React, { useMemo } from "react";

import {
  constructLandingPageImageSectionCards,
  getIsWithType,
  getNrOfImageCardSectionCardsOnPage,
} from "./utils/landingPageUtils";
import LandingPageCardSection from "./LandingPageCardSection";
import { LandingSectionPaginationParams } from "./hooks/useSectionPagination";

import { GraphCMSDisplayType, GraphCMSPageVariation, GraphCMSPageType } from "types/enums";

const getSectionHeight = (
  isWithType: boolean,
  isFrontOrCountry: boolean,
  isLargeImage: boolean,
  isImageWithSVGIcon: boolean
) => {
  if (isWithType || isImageWithSVGIcon) return 144;
  if (isFrontOrCountry) return 312;
  if (isLargeImage) return 540;
  return 648;
};

const LandingPageImageCardSection = ({
  title,
  sectionContent,
  sectionType,
  ssrRender,
  isFirstSection,
  placeNames,
  useSubTypeImage,
  useSubTypeTitle,
  shortTitle,
  displayType,
  useGoogleStaticImage,
  isFrontOrCountry,
  sectionPageType,
  paginationParams,
  dataTestid,
}: {
  title: string;
  sectionContent: LandingPageTypes.QueryLandingPageSectionCardData[];
  sectionType: GraphCMSPageVariation;
  ssrRender: boolean;
  placeNames: LandingPageTypes.PlaceNames;
  useSubTypeImage?: boolean;
  useSubTypeTitle?: boolean;
  shortTitle?: string;
  displayType: GraphCMSDisplayType;
  useGoogleStaticImage?: boolean;
  isFirstSection: boolean;
  isFrontOrCountry: boolean;
  sectionPageType?: GraphCMSPageType;
  paginationParams: LandingSectionPaginationParams;
  dataTestid?: string;
}) => {
  const sectionCards = constructLandingPageImageSectionCards(
    sectionContent,
    useGoogleStaticImage,
    useSubTypeImage,
    useSubTypeTitle
  );
  const isLargeImage = displayType === GraphCMSDisplayType.LARGE_IMAGE;
  const columnSizes = useMemo(
    () =>
      isLargeImage
        ? { small: 1, large: 1 / 3, desktop: 1 / 4 }
        : { small: 1 / 2, large: 1 / 4, desktop: 1 / 6 },
    [isLargeImage]
  );
  const isWithType = getIsWithType(sectionType, isFrontOrCountry);
  const sectionCardsOnPage = getNrOfImageCardSectionCardsOnPage(
    isLargeImage,
    isFrontOrCountry,
    isWithType
  );
  const sectionHeight = getSectionHeight(
    isWithType,
    isFrontOrCountry,
    isLargeImage,
    displayType === GraphCMSDisplayType.IMAGE_WITH_SVG_ICON
  );
  const mobileRows = sectionCards.length > 6 && !isWithType ? 2 : 1;
  return (
    <LandingPageCardSection
      title={title}
      sectionContent={sectionCards}
      cardsOnPage={sectionCardsOnPage}
      fixedHeight={sectionHeight}
      mobileRows={mobileRows}
      displayType={displayType}
      columnSizes={columnSizes}
      mobileCardWidth={isLargeImage ? 260 : 190}
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

export default LandingPageImageCardSection;
