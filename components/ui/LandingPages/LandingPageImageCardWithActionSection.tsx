import React from "react";

import {
  constructLandingPageImageWithActionSectionCards,
  getNrOfImageWithActionSectionCardsOnPage,
} from "./utils/landingPageUtils";
import LandingPageCardSection from "./LandingPageCardSection";
import { LandingSectionPaginationParams } from "./hooks/useSectionPagination";

import { GraphCMSDisplayType, GraphCMSPageType } from "types/enums";
import useActiveLocale from "hooks/useActiveLocale";

const LandingPageImageCardWithActionSection = ({
  title,
  sectionContent,
  ssrRender,
  placeNames,
  shortTitle,
  isFirstSection,
  paginationParams,
  dataTestid,
}: {
  title: string;
  sectionContent: LandingPageTypes.QueryLandingPageSectionCardData[];
  ssrRender: boolean;
  placeNames: LandingPageTypes.PlaceNames;
  shortTitle?: string;
  isFirstSection: boolean;
  paginationParams: LandingSectionPaginationParams;
  dataTestid?: string;
}) => {
  const activeLocale = useActiveLocale();
  const sectionCards = constructLandingPageImageWithActionSectionCards(
    sectionContent,
    activeLocale
  );
  const sectionCardsOnPage = getNrOfImageWithActionSectionCardsOnPage();
  return (
    <LandingPageCardSection
      title={title}
      sectionContent={sectionCards}
      cardsOnPage={sectionCardsOnPage}
      fixedHeight={352}
      mobileRows={sectionCards.length > 2 ? 2 : 1}
      displayType={GraphCMSDisplayType.IMAGE_WITH_ACTION}
      columnSizes={{ small: 1, large: 1 / 3, desktop: 1 / 4 }}
      mobileCardWidth={260}
      ssrRender={ssrRender}
      isFirstSection={isFirstSection}
      placeNames={placeNames}
      shortTitle={shortTitle}
      sectionPageType={GraphCMSPageType.CountryPage}
      paginationParams={paginationParams}
      dataTestid={dataTestid}
    />
  );
};

export default LandingPageImageCardWithActionSection;
