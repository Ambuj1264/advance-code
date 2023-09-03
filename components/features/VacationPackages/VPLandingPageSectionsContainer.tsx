/* eslint-disable react/no-array-index-key */

import React, { memo } from "react";

import getVPSectionsWhereCondition from "components/ui/LandingPages/utils/queryConditions/vpSectionsWhereCondition";
import LandingPageSection from "components/ui/LandingPages/LandingPageSection";
import LandingPageVpProductSection from "components/ui/LandingPages/LandingPageVpProductSection";
import { GraphCMSPageType, GraphCMSPageVariation } from "types/enums";
import { LazyHydratedSection } from "components/ui/LandingPages/LazyHydratedSection";
import { SECTIONS_TO_RENDER_ON_SSR } from "utils/constants";
import { getDestinationCountryCode } from "components/ui/LandingPages/utils/landingPageUtils";

const VPLandingPageSectionsContainer = ({
  subType,
  pageVariation,
  destination,
  queryCondition,
  sectionSkeletons,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  subType?: LandingPageTypes.LandingPageSubType;
  pageVariation: GraphCMSPageVariation;
  destination?: LandingPageTypes.Place;
  sectionSkeletons: JSX.Element[];
}) => {
  const destinationCountryCode = getDestinationCountryCode(destination, pageVariation);
  const vpSectionConditions = getVPSectionsWhereCondition({
    pageVariation,
    subtype: subType?.subtype,
    destinationPlaceId: destination?.id,
    destinationCountryCode,
    metadataUri: queryCondition.metadataUri,
  });

  return (
    <>
      {vpSectionConditions.map((condition, index) => {
        if (condition?.domain === GraphCMSPageType.VpProductPage) {
          return (
            <LazyHydratedSection ssrRender={index <= 1} key="VPLazyHydratedVpProductSection">
              <LandingPageVpProductSection
                key="VPProductSection"
                isFirstSection={index === 0}
                destination={destination}
                sectionCondition={condition}
                subType={subType}
              />
            </LazyHydratedSection>
          );
        }
        return (
          <LandingPageSection
            pageType={GraphCMSPageType.VacationPackages}
            destination={destination}
            queryCondition={queryCondition}
            metadataUri={queryCondition.metadataUri}
            key={`vp-section-condition-${index}`}
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

export default memo(VPLandingPageSectionsContainer);
