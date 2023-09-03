import React from "react";
import styled from "@emotion/styled";

import { constructMapData } from "../../VacationPackageProductPage/utils/vacationPackageUtils";
import { MapLoadingSkeleton } from "../../PostBooking/components/PBLoadingSkeletons/PBItineraryLoading";
import useTGTopDestinationsQuery from "../hooks/useTGTopDestinationsQuery";
import { constructDestinationsNearbyPoints, getSectionCondition } from "../utils/travelGuideUtils";
import { TGDSectionType } from "../types/travelGuideEnums";

import TGDSection from "./TGDSection";

import LazyComponent, { LazyloadOffset } from "components/ui/Lazy/LazyComponent";
import ProductMapContainer from "components/ui/Cover/CoverMap/ProductMapContainer";
import CoverMapWrapper from "components/ui/Cover/CoverMap/CoverMapWrapper";

const StyledProductMapContainer = styled(ProductMapContainer)`
  ${CoverMapWrapper} {
    height: 400px;
  }
`;

const TGDestinationMapContainer = ({
  section,
  conditions,
}: {
  section: TravelGuideTypes.ConstructedDestinationSection;
  conditions: TravelGuideTypes.TGSectionCondition[];
}) => {
  const sectionCondition = getSectionCondition(conditions, TGDSectionType.TopDestinations);
  const { topDestinationData } = useTGTopDestinationsQuery({
    sectionCondition,
  });
  const topDestinations = topDestinationData?.[0];
  const mapData = topDestinations
    ? constructMapData(
        topDestinations.location?.latitude || 0,
        topDestinations.location?.longitude || 0,
        topDestinations.name,
        constructDestinationsNearbyPoints(topDestinationData)
      )
    : undefined;

  return mapData ? (
    <TGDSection
      key={`tg-section${section.id}`}
      section={section}
      isSubsection={section.level > 0}
      image={section.image}
      bottomContent={
        <LazyComponent lazyloadOffset={LazyloadOffset.Tiny} loadingElement={<MapLoadingSkeleton />}>
          <StyledProductMapContainer
            mapData={mapData}
            mapId={`destination-map${section.id}`}
            useAlternateStaticImageOnly
          />
        </LazyComponent>
      }
    />
  ) : null;
};

export default TGDestinationMapContainer;
