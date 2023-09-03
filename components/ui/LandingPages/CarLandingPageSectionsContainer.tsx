/* eslint-disable react/no-array-index-key */

import React, { memo } from "react";

import getCarSectionsWhereCondition from "./utils/queryConditions/carSectionsWhereCondition";
import LandingPageSection from "./LandingPageSection";
import { getDestinationCountryCode } from "./utils/landingPageUtils";

import { GraphCMSPageType, GraphCMSPageVariation } from "types/enums";
import { SECTIONS_TO_RENDER_ON_SSR } from "utils/constants";

const CarLandingPageSectionsContainer = ({
  subtype,
  pageVariation,
  origin,
  destination,
  queryCondition,
  sectionSkeletons,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  subtype?: string;
  pageVariation: GraphCMSPageVariation;
  origin?: LandingPageTypes.Place;
  destination?: LandingPageTypes.Place;
  sectionSkeletons: JSX.Element[];
}) => {
  const destinationCountryCode = getDestinationCountryCode(destination, pageVariation);
  const carSectionConditions = getCarSectionsWhereCondition({
    pageVariation,
    subtype,
    destinationPlaceId: destination?.id,
    metadataUri: queryCondition.metadataUri,
    destinationCountryCode,
  });

  return (
    <>
      {carSectionConditions.map((condition, index) => (
        <LandingPageSection
          pageType={GraphCMSPageType.Cars}
          origin={origin}
          destination={destination}
          queryCondition={queryCondition}
          metadataUri={queryCondition.metadataUri}
          key={`car-section-condition-${index}`}
          isFirstSection={index === 0}
          ssrRender={index < SECTIONS_TO_RENDER_ON_SSR}
          sectionCondition={condition}
          SectionSkeleton={sectionSkeletons.length ? sectionSkeletons[index] : undefined}
        />
      ))}
    </>
  );
};

export default memo(CarLandingPageSectionsContainer);
