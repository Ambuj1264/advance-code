import React from "react";

import LandingPageProductCardSection from "./LandingPageProductCardSection";
import { constructLandingPageStayProductSectionCards } from "./utils/productSectionLandingPageUtils";
import LandingPageProductSectionLoading from "./LandingPageProductSectionLoading";
import { useStayProductPageSection } from "./hooks/useLandingPageSections";
import { constructPlaceNames, getSubTypeModifierTitle } from "./utils/landingPageUtils";

import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { GraphCMSPageVariation, GraphCMSPageType } from "types/enums";

const LandingPageStayProductSection = ({
  isFirstSection,
  pageVariation,
  sectionCondition,
  destination,
  isFrontOrCountry = false,
}: {
  isFirstSection: boolean;
  pageVariation: GraphCMSPageVariation;
  sectionCondition?: LandingPageTypes.SectionWhereCondition;
  destination?: LandingPageTypes.Place;
  isFrontOrCountry?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.accommodationNs);
  const [section, sectionContent, loadingSection, paginationParams] = useStayProductPageSection({
    sectionCondition,
  });
  if (!section) {
    return loadingSection ? (
      <LandingPageProductSectionLoading customTotalCards={isFrontOrCountry ? 4 : undefined} />
    ) : null;
  }

  if (sectionContent?.length === 0) return null;

  const sectionCards = constructLandingPageStayProductSectionCards(
    sectionContent,
    pageVariation,
    t
  );
  const pluralType = sectionContent[0]?.subType?.pluralName?.value;
  const subTypeModifier = getSubTypeModifierTitle(
    section?.sectionAdjective,
    sectionContent[0]?.subType?.subTypeModifiers,
    pluralType
  );
  const placeNames = constructPlaceNames(
    undefined,
    destination,
    sectionContent[0]?.subType?.name?.value,
    pluralType,
    undefined,
    undefined,
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
      sectionPageType={isFrontOrCountry ? GraphCMSPageType.Stays : undefined}
      paginationParams={paginationParams}
    />
  );
};

export default LandingPageStayProductSection;
