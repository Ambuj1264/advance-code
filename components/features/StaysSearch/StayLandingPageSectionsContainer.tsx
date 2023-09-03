/* eslint-disable react/no-array-index-key */

import React, { memo } from "react";

import getStaySectionsWhereCondition from "components/ui/LandingPages/utils/queryConditions/staySectionsWhereCondition";
import LandingPageSection from "components/ui/LandingPages/LandingPageSection";
import LandingPageStayProductSection from "components/ui/LandingPages/LandingPageStayProductSection";
import { GraphCMSPageType, GraphCMSPageVariation } from "types/enums";
import { LazyHydratedSection } from "components/ui/LandingPages/LazyHydratedSection";
import { SECTIONS_TO_RENDER_ON_SSR } from "utils/constants";
import { getDestinationCountryCode } from "components/ui/LandingPages/utils/landingPageUtils";

const StayLandingPageSectionsContainer = ({
  subtype,
  pageVariation,
  destination,
  queryCondition,
  sectionSkeletons,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  subtype?: string;
  pageVariation: GraphCMSPageVariation;
  destination?: LandingPageTypes.Place;
  sectionSkeletons: JSX.Element[];
}) => {
  const destinationCountryCode = getDestinationCountryCode(destination, pageVariation);
  const staySectionConditions = getStaySectionsWhereCondition({
    pageVariation,
    subtype,
    domain: GraphCMSPageType.Stays,
    destinationPlaceId: destination?.id,
    metadataUri: queryCondition.metadataUri,
    destinationCountryCode,
  });

  return (
    <>
      {staySectionConditions.map((condition, index) => {
        if (condition?.domain === GraphCMSPageType.StaysProductPage) {
          return (
            <LazyHydratedSection ssrRender={index <= 1} key="StayLazyHydratedProductSection">
              <LandingPageStayProductSection
                key="StayLazyHydratedProductSection"
                isFirstSection={index === 0}
                destination={destination}
                pageVariation={pageVariation}
                sectionCondition={condition}
              />
            </LazyHydratedSection>
          );
        }
        return (
          <LandingPageSection
            pageType={GraphCMSPageType.Stays}
            destination={destination}
            queryCondition={queryCondition}
            metadataUri={queryCondition.metadataUri}
            key={`stay-section-condition-${index}`}
            isFirstSection={index === 0}
            ssrRender={index < SECTIONS_TO_RENDER_ON_SSR}
            sectionCondition={condition}
            SectionSkeleton={sectionSkeletons.length ? sectionSkeletons[index] : undefined}
          />
        );
      })}
    </>
  );
};

export default memo(StayLandingPageSectionsContainer);
