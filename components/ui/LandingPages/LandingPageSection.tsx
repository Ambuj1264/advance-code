import React, { memo, ReactElement } from "react";

import LandingPageSectionLoading from "./LandingPageSectionLoading";
import {
  constructPlaceNames,
  getContinentGroup,
  getSubTypeModifierTitle,
  sortServices,
} from "./utils/landingPageUtils";
import { useLandingPageSection } from "./hooks/useLandingPageSections";
import { LazyHydratedSection } from "./LazyHydratedSection";

import { GraphCMSPageType, GraphCMSDisplayType } from "types/enums";
import LandingPageImageCardSection from "components/ui/LandingPages/LandingPageImageCardSection";
import LandingPageSideImageCardSection from "components/ui/LandingPages/LandingPageSideImageCardSection";
import LandingPageImageCardWithActionSection from "components/ui/LandingPages/LandingPageImageCardWithActionSection";

export const LandingPageSection = ({
  pageType,
  origin,
  destination,
  sectionCondition,
  isFirstSection = false,
  queryCondition,
  SectionSkeleton,
  ssrRender = false,
  metadataUri,
  dataTestid,
}: {
  isFirstSection?: boolean;
  pageType?: GraphCMSPageType;
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  origin?: LandingPageTypes.Place;
  destination?: LandingPageTypes.Place;
  sectionCondition: LandingPageTypes.SectionWhereCondition;
  SectionSkeleton?: ReactElement;
  ssrRender: boolean;
  metadataUri?: string;
  dataTestid?: string;
}) => {
  const continentGroup = getContinentGroup(origin, destination);
  const isCountryPage = queryCondition.pageType === GraphCMSPageType.CountryPage;
  const isFrontPage = queryCondition.pageType === GraphCMSPageType.FrontPage;
  const isFrontOrCountry = isCountryPage || isFrontPage;
  const [section, sectionContent, loadingSection, paginationParams] = useLandingPageSection({
    sectionCondition,
    continentGroup,
    metadataUri,
  });

  const isCountryPageFirstSection = isCountryPage && isFirstSection;
  const isFrontPageFirstSection = isFrontPage && isFirstSection;

  if (!section) {
    if (!loadingSection) return null;
    if (SectionSkeleton) return SectionSkeleton;
    return <LandingPageSectionLoading key={`${pageType}LandingPageSectionLoading`} />;
  }

  if (sectionContent?.length === 0) return null;

  const sectionPageType =
    isCountryPageFirstSection || isFrontPageFirstSection
      ? queryCondition.pageType
      : sectionCondition?.sectionWhere?.pageType;
  let maybeSvgSection: LandingPageTypes.QueryLandingPageSectionData = section;
  // override type of first section for front pages
  if (isCountryPageFirstSection || isFrontPageFirstSection) {
    maybeSvgSection = {
      ...maybeSvgSection,
      displayType: GraphCMSDisplayType.IMAGE_WITH_SVG_ICON,
    };
  }
  const title = maybeSvgSection.applicationStringTitle?.value ?? "";
  const sectionContentFirst = sectionContent[0] as LandingPageTypes.QueryLandingPageSectionCardData;
  const lazyHydratedSectionKey = `${pageType}LazyHydratedSection${title}`;
  const pluralType = sectionContentFirst?.subType?.pluralName?.value;
  const subTypeModifier = getSubTypeModifierTitle(
    section?.sectionAdjective,
    sectionContentFirst?.subType?.subTypeModifiers,
    pluralType
  );
  const placeNames = constructPlaceNames(
    origin,
    destination,
    sectionContentFirst?.subType?.name?.value,
    pluralType,
    sectionContentFirst?.subType?.parentSubType?.name?.value,
    sectionContentFirst?.subType?.parentSubType?.pluralName?.value,
    subTypeModifier
  );
  if (maybeSvgSection.displayType === GraphCMSDisplayType.IMAGE_WITH_ACTION) {
    return (
      <LazyHydratedSection ssrRender={isFirstSection} key={lazyHydratedSectionKey}>
        <LandingPageImageCardWithActionSection
          title={title}
          sectionContent={sectionContent as LandingPageTypes.QueryLandingPageSectionCardData[]}
          ssrRender={ssrRender}
          isFirstSection={isFirstSection}
          placeNames={placeNames}
          shortTitle={maybeSvgSection.shortTitle?.value}
          paginationParams={paginationParams}
          dataTestid={dataTestid}
        />
      </LazyHydratedSection>
    );
  }

  if (
    maybeSvgSection.displayType === GraphCMSDisplayType.IMAGE ||
    maybeSvgSection.displayType === GraphCMSDisplayType.LARGE_IMAGE ||
    maybeSvgSection.displayType === GraphCMSDisplayType.IMAGE_WITH_SVG_ICON
  ) {
    const sortedSectioncontent =
      maybeSvgSection.displayType === GraphCMSDisplayType.IMAGE_WITH_SVG_ICON
        ? sortServices(sectionContent as LandingPageTypes.QueryLandingPageSectionCardData[])
        : sectionContent;
    return (
      <LazyHydratedSection ssrRender={isFirstSection} key={lazyHydratedSectionKey}>
        <LandingPageImageCardSection
          title={title}
          sectionContent={
            sortedSectioncontent as LandingPageTypes.QueryLandingPageSectionCardData[]
          }
          sectionType={maybeSvgSection.sectionType}
          ssrRender={ssrRender}
          isFirstSection={isFirstSection}
          placeNames={placeNames}
          useSubTypeImage={maybeSvgSection.useSubTypeImage}
          useSubTypeTitle={maybeSvgSection.useSubTypeTitle}
          shortTitle={maybeSvgSection.shortTitle?.value}
          displayType={maybeSvgSection.displayType}
          useGoogleStaticImage={maybeSvgSection.useGoogleStaticImage}
          isFrontOrCountry={isFrontOrCountry}
          sectionPageType={isFrontOrCountry ? sectionPageType : undefined}
          paginationParams={paginationParams}
          dataTestid={dataTestid}
        />
      </LazyHydratedSection>
    );
  }
  return (
    <LazyHydratedSection ssrRender={isFirstSection} key={lazyHydratedSectionKey}>
      <LandingPageSideImageCardSection
        title={title}
        sectionContent={sectionContent as LandingPageTypes.QueryLandingPageSectionCardData[]}
        ssrRender={ssrRender}
        isFirstSection={isFirstSection}
        placeNames={placeNames}
        useSubTypeImage={maybeSvgSection.useSubTypeImage}
        useSubTypeTitle={maybeSvgSection.useSubTypeTitle}
        shortTitle={maybeSvgSection.shortTitle?.value}
        useGoogleStaticImage={maybeSvgSection.useGoogleStaticImage}
        sectionPageType={isFrontOrCountry ? sectionPageType : undefined}
        paginationParams={paginationParams}
        dataTestid={dataTestid}
      />
    </LazyHydratedSection>
  );
};

export default memo(LandingPageSection);
