import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import ImageCarousel from "../ImageCarousel/ImageCarousel";
import CoverMapContainer from "../Cover/CoverMap/CoverMapContainer";
import MapButton, { MapButtonStyled } from "../Map/MapButton";

import useToggle from "hooks/useToggle";
import { breakpointsMin, gutters, zIndex } from "styles/variables";
import { mqMin } from "styles/base";

const ItineraryDayCarouselWrapper = styled.div<{ isMapOpen: boolean; height: number }>(
  ({ isMapOpen, height }) => [
    css`
      height: ${height}px;
      ${MapButtonStyled} {
        position: absolute;
        right: ${gutters.small / 2}px;
        bottom: ${gutters.small / 2}px;
        z-index: ${zIndex.z1};
      }
    `,
    isMapOpen &&
      css`
        position: relative;
        z-index: ${zIndex.z1};
      `,
  ]
);

const CoverMapContainerStyled = styled(CoverMapContainer)<{ height: number }>(
  ({ height }) => css`
    height: ${height}px;
    ${mqMin.medium} {
      height: ${height}px;
    }
  `
);

const ItineraryDayCarousel = ({
  mapData,
  itineraryDayNumber,
  images,
  height,
}: {
  mapData?: SharedTypes.Map;
  itineraryDayNumber: number;
  images: Image[];
  height: number;
}) => {
  const [isMapOpen, toggleMap] = useToggle();
  const hasMap = mapData !== undefined && mapData.points?.length;

  return (
    <ItineraryDayCarouselWrapper isMapOpen={isMapOpen} height={height}>
      {hasMap && isMapOpen && (
        <CoverMapContainerStyled
          height={height}
          map={mapData}
          mapId={`itinerary-day-map-${itineraryDayNumber}`}
        />
      )}
      <ImageCarousel
        id={`itinerary-day-carousel-${itineraryDayNumber}`}
        imageUrls={images}
        sizes={`(min-width: ${breakpointsMin.medium}px) ${(breakpointsMin.max * 3) / 12}px, 100vw`}
        height={height}
        imgixParams={{ ar: "3:2", crop: "faces" }}
        quality={75}
        lazy={itineraryDayNumber >= 3}
      />
      {hasMap && <MapButton onClick={toggleMap} title="map" isCompact isReversed={isMapOpen} />}
    </ItineraryDayCarouselWrapper>
  );
};

export default ItineraryDayCarousel;
