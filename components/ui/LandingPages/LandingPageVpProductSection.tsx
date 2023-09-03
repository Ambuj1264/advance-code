import React, { memo } from "react";

import LandingPageProductCardSection from "./LandingPageProductCardSection";
import { useVpProductPageSection } from "./hooks/useLandingPageSections";
import LandingPageProductSectionLoading from "./LandingPageProductSectionLoading";
import { constructPlaceNames, getSubTypeModifierTitle } from "./utils/landingPageUtils";

import { constructVacationPackageSectionCard } from "components/features/VacationPackages/utils/vacationPackagesUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { GraphCMSPageType } from "types/enums";

const LandingPageVpProductSection = ({
  isFirstSection,
  sectionCondition,
  destination,
  subType,
  isFrontOrCountry = false,
}: {
  isFirstSection: boolean;
  sectionCondition?: LandingPageTypes.SectionWhereCondition;
  destination?: LandingPageTypes.Place;
  subType?: LandingPageTypes.LandingPageSubType;
  isFrontOrCountry?: boolean;
}) => {
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const [vacationPackages, sections, vpProductsSectionLoading, paginationParams] =
    useVpProductPageSection({
      sectionCondition,
      flightId: destination?.flightId,
    });
  if (sections.length === 0 && !vpProductsSectionLoading) return null;
  const section = sections[0] as LandingPageTypes.QueryLandingPageSectionData;

  if (vpProductsSectionLoading && !section) {
    return <LandingPageProductSectionLoading customTotalCards={isFrontOrCountry ? 4 : undefined} />;
  }
  const sectionCards = vacationPackages.map(vpProduct =>
    constructVacationPackageSectionCard({
      vacationPackageT,
      vacationProduct: vpProduct,
    })
  );
  const defaultSubtypeString = vacationPackageT("vacation packages");
  const pluralType = subType?.pluralName?.value ?? defaultSubtypeString;
  const subTypeModifier = getSubTypeModifierTitle(
    section?.sectionAdjective,
    subType?.subTypeModifiers,
    pluralType
  );
  const placeNames = constructPlaceNames(
    undefined,
    destination,
    subType?.name?.value ?? defaultSubtypeString,
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
      sectionPageType={isFrontOrCountry ? GraphCMSPageType.VacationPackages : undefined}
      paginationParams={paginationParams}
    />
  );
};

export default memo(LandingPageVpProductSection);
