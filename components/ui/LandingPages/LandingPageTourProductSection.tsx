import React from "react";
import { useTranslation } from "react-i18next";

import LandingPageProductSectionLoading from "./LandingPageProductSectionLoading";
import {
  constructLandingPageTourProductSectionCards,
  isOnTypeAndTagPage,
} from "./utils/productSectionLandingPageUtils";
import LandingPageProductCardSection from "./LandingPageProductCardSection";
import { useTourProductPageSection } from "./hooks/useLandingPageSections";
import { constructPlaceNames, getSubTypeModifierTitle } from "./utils/landingPageUtils";

import { GraphCMSPageVariation, GraphCMSPageType } from "types/enums";
import { Namespaces } from "shared/namespaces";

const LandingPageTourProductSection = ({
  isFirstSection,
  pageVariation,
  sectionCondition,
  destination,
  subtype,
  tagId,
  isFrontOrCountry = false,
}: {
  isFirstSection: boolean;
  pageVariation: GraphCMSPageVariation;
  sectionCondition?: LandingPageTypes.SectionWhereCondition;
  destination?: LandingPageTypes.Place;
  subtype?: string;
  tagId?: number;
  isFrontOrCountry?: boolean;
}) => {
  const { t: tourT } = useTranslation(Namespaces.tourNs);
  const [section, sectionContent, loadingSection, paginationParams] = useTourProductPageSection({
    sectionCondition,
  });
  if (!section) {
    return loadingSection ? (
      <LandingPageProductSectionLoading customTotalCards={isFrontOrCountry ? 4 : undefined} />
    ) : null;
  }

  if (sectionContent?.length === 0) return null;
  const sectionCards = constructLandingPageTourProductSectionCards(
    sectionContent,
    pageVariation,
    tourT
  );
  const subType = sectionContent?.[0]?.subTypes?.find(sub =>
    isOnTypeAndTagPage(pageVariation) ? sub.tagId === tagId : sub.subtype === subtype
  );
  const pluralType = subType?.pluralName?.value;
  const subTypeModifier = getSubTypeModifierTitle(
    section?.sectionAdjective,
    subType?.subTypeModifiers,
    pluralType
  );
  const placeNames = constructPlaceNames(
    undefined,
    destination,
    subType?.name?.value,
    pluralType,
    subType?.parentSubType?.name?.value,
    subType?.parentSubType?.pluralName?.value,
    subTypeModifier
  );
  const title = section.applicationStringTitle?.value ?? "";
  return (
    <LandingPageProductCardSection
      title={title}
      sectionCards={sectionCards}
      isFirstSection={isFirstSection}
      placeNames={placeNames}
      isFrontOrCountry={isFrontOrCountry}
      sectionPageType={isFrontOrCountry ? GraphCMSPageType.Tours : undefined}
      paginationParams={paginationParams}
    />
  );
};

export default LandingPageTourProductSection;
