import React, { memo } from "react";

import { useTGLandingPageSection } from "./useTGLandingPageSection";

import LandingPageSideImageCardSection from "components/ui/LandingPages/LandingPageSideImageCardSection";
import LandingPageSectionLoading from "components/ui/LandingPages/LandingPageSectionLoading";
import { GraphCMSPageType } from "types/enums";
import { LazyHydratedSection } from "components/ui/LandingPages/LazyHydratedSection";

export const TGLandingLoading = ({ pageType }: { pageType?: GraphCMSPageType }) => {
  return (
    <LazyHydratedSection ssrRender>
      <LandingPageSectionLoading
        key={`${pageType}LandingPageSectionLoading`}
        customTotalCards={12}
      />
    </LazyHydratedSection>
  );
};

export const TGLandingSectionContent = ({
  pageType,
  sectionCondition,
  ssrRender = false,
}: {
  pageType?: GraphCMSPageType;
  sectionCondition: LandingPageTypes.SectionWhereCondition;
  ssrRender?: boolean;
}) => {
  const [section, sectionContent, loadingSection, paginationParams] = useTGLandingPageSection({
    sectionCondition,
  });
  if (!section) {
    if (!loadingSection) return null;
    return <TGLandingLoading pageType={pageType} />;
  }

  if (sectionContent?.length === 0) return null;
  const title = section.applicationStringTitle.value;
  const lazyHydratedSectionKey = `${title}-LazyHydratedSection`;

  return (
    <LazyHydratedSection ssrRender={ssrRender} key={lazyHydratedSectionKey}>
      <LandingPageSideImageCardSection
        title={title}
        sectionContent={sectionContent}
        ssrRender={ssrRender}
        isFirstSection={false}
        placeNames={{}}
        paginationParams={paginationParams}
        sectionPageType={pageType}
      />
    </LazyHydratedSection>
  );
};

export default memo(TGLandingSectionContent);
