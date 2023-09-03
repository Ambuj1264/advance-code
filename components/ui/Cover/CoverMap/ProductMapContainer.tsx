import React from "react";
import styled from "@emotion/styled";

import CoverMap from "components/ui/Cover/CoverMap/CoverMapContainer";
import { gutters } from "styles/variables";
import CoverMapWrapper from "components/ui/Cover/CoverMap/CoverMapWrapper";
import { mqMin } from "styles/base";

const MapWrapper = styled.div`
  ${CoverMapWrapper} {
    width: 100%;
    height: 312px;
    overflow: hidden;
  }
  ${mqMin.large} {
    margin-top: ${gutters.small}px;
  }
`;

const ProductMapContainer = ({
  mapData,
  mapId = "product-google-map",
  className,
  useAlternateStaticImageOnly,
}: {
  mapData: SharedTypes.Map;
  mapId?: string;
  className?: string;
  useAlternateStaticImageOnly?: boolean;
}) => {
  const shouldShowStreetView = mapData.points?.length === 1;

  return (
    <MapWrapper className={className}>
      <CoverMap
        mapId={mapId}
        map={mapData}
        isDirectionsEnabled={false}
        isStreetViewEnabled={shouldShowStreetView}
        useAlternateStaticImageOnly={useAlternateStaticImageOnly}
        useSmallButtons
      />
    </MapWrapper>
  );
};

export default ProductMapContainer;
