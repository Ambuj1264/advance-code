import React from "react";

import { useTGDestinationSection } from "./hooks/useLandingPageSections";
import LandingPageProductSectionLoading from "./LandingPageProductSectionLoading";
import LandingPageProductCardSection from "./LandingPageProductCardSection";
import { constructPlaceNames } from "./utils/landingPageUtils";
import { constructLandingPageTGSectionCards } from "./utils/productSectionLandingPageUtils";

import { GraphCMSDisplayType, GraphCMSPageType } from "types/enums";

const LandingPageTGCardSection = ({
  isFirstSection,
  sectionCondition,
  destination,
  isFrontOrCountry = false,
}: {
  isFirstSection: boolean;
  sectionCondition?: LandingPageTypes.SectionWhereCondition;
  destination?: LandingPageTypes.Place;
  isFrontOrCountry?: boolean;
}) => {
  const [section, sectionContent, loadingSection, paginationParams] = useTGDestinationSection({
    sectionCondition,
  });
  if (!section) {
    return loadingSection ? (
      <LandingPageProductSectionLoading customTotalCards={isFrontOrCountry ? 4 : undefined} />
    ) : null;
  }
  if (sectionContent?.length === 0) return null;
  const cards = constructLandingPageTGSectionCards(sectionContent);

  const placeNames = constructPlaceNames(undefined, destination);
  const title = section.applicationStringTitle?.value ?? "";

  return (
    <LandingPageProductCardSection
      title={title}
      sectionCards={cards}
      isFirstSection={isFirstSection}
      placeNames={placeNames}
      isFrontOrCountry={isFrontOrCountry}
      sectionPageType={isFrontOrCountry ? GraphCMSPageType.TravelGuides : undefined}
      paginationParams={paginationParams}
      displayType={GraphCMSDisplayType.TG_CARD}
    />
  );
};

export default LandingPageTGCardSection;
