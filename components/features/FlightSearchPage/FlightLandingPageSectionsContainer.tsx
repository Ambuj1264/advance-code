/* eslint-disable react/no-array-index-key */

import React, { memo } from "react";

import { getFlightSectionsPagesWhereCondition } from "components/ui/LandingPages/utils/flightLandingPageQueryUtils";
import LandingPageSection from "components/ui/LandingPages/LandingPageSection";
import { GraphCMSPageType, GraphCMSPageVariation } from "types/enums";
import { SECTIONS_TO_RENDER_ON_SSR } from "utils/constants";
import {
  getCountry,
  getDestinationCountryCode,
} from "components/ui/LandingPages/utils/landingPageUtils";

const FlightLandingPageSectionsContainer = ({
  pageType,
  pageVariation,
  origin,
  destination,
  queryCondition,
  sectionSkeletons,
}: {
  pageType: GraphCMSPageType;
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  pageVariation: GraphCMSPageVariation;
  origin?: LandingPageTypes.Place;
  destination?: LandingPageTypes.Place;
  sectionSkeletons: JSX.Element[];
}) => {
  const destinationCountryCode = getDestinationCountryCode(destination, pageVariation);
  const originCountryCode = getDestinationCountryCode(origin, pageVariation);
  const originCountry = getCountry(origin?.countries);
  const flightSectionConditions = getFlightSectionsPagesWhereCondition({
    pageVariation,
    destinationPlaceId: destination?.id,
    originPlaceId: origin?.id,
    originCountryPlaceId: originCountry?.id,
    metadataUri: queryCondition.metadataUri,
    domain: pageType,
    destinationCountryCode,
    originCountryCode,
  });
  return (
    <>
      {flightSectionConditions.map((condition, index) => (
        <LandingPageSection
          pageType={pageType}
          origin={origin}
          destination={destination}
          queryCondition={queryCondition}
          metadataUri={queryCondition.metadataUri}
          key={`${pageType}-section-condition-${index}`}
          isFirstSection={index === 0}
          ssrRender={index < SECTIONS_TO_RENDER_ON_SSR}
          sectionCondition={condition}
          SectionSkeleton={sectionSkeletons.length ? sectionSkeletons[index] : undefined}
          dataTestid={`${condition.sectionWhere?.pageType}-${condition.sectionWhere?.pageVariation}-${condition.where.sectionId}`}
        />
      ))}
    </>
  );
};

export default memo(FlightLandingPageSectionsContainer);
