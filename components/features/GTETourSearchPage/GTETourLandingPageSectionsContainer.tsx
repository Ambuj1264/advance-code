/* eslint-disable react/no-array-index-key */

import React, { memo } from "react";

import { getDestinationCountryCode } from "components/ui/LandingPages/utils/landingPageUtils";
import getTourSectionsWhereCondition from "components/ui/LandingPages/utils/queryConditions/tourSectionsWhereCondition";
import LandingPageSection from "components/ui/LandingPages/LandingPageSection";
import LandingPageTourProductSection from "components/ui/LandingPages/LandingPageTourProductSection";
import { GraphCMSPageType, GraphCMSPageVariation } from "types/enums";
import { LazyHydratedSection } from "components/ui/LandingPages/LazyHydratedSection";
import { SECTIONS_TO_RENDER_ON_SSR } from "utils/constants";

const GTETourLandingPageSectionsContainer = ({
  subtype,
  tagId,
  pageVariation,
  destination,
  queryCondition,
  sectionSkeletons,
  parentSubType,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  subtype?: string;
  tagId?: number;
  pageVariation: GraphCMSPageVariation;
  destination?: LandingPageTypes.Place;
  sectionSkeletons: JSX.Element[];
  parentSubType?: string;
}) => {
  const destinationCountryCode = getDestinationCountryCode(destination, pageVariation);
  const tourSectionConditions = getTourSectionsWhereCondition({
    pageVariation,
    subtype,
    tagId,
    destinationPlaceId: destination?.id,
    metadataUri: queryCondition.metadataUri,
    parentSubType,
    destinationCountryCode,
  });

  return (
    <>
      {tourSectionConditions.map((condition, index) => {
        if (condition?.domain === GraphCMSPageType.TourProductPage) {
          return (
            <LazyHydratedSection ssrRender={index <= 1} key="TourLazyHydratedProductSection">
              <LandingPageTourProductSection
                key="TourLazyHydratedProductSection"
                sectionCondition={condition}
                isFirstSection={index === 0}
                pageVariation={pageVariation}
                destination={destination}
                subtype={subtype}
                tagId={tagId}
              />
            </LazyHydratedSection>
          );
        }
        return (
          <LandingPageSection
            pageType={GraphCMSPageType.Tours}
            destination={destination}
            queryCondition={queryCondition}
            metadataUri={queryCondition.metadataUri}
            key={`tour-section-condition-${index}`}
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

export default memo(GTETourLandingPageSectionsContainer);
