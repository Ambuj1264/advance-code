import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import useEventsHandlerTrigger from "../Google/hooks/useEventsHandlerTrigger";
import Cover, { RightBottomContent, RightTopContent } from "../../Cover";
import CoverMapWrapper from "../CoverMapWrapper";
import { getCoverMapImage } from "../Google/mapUtils";

import LeafletMap from "./LeafletMap";
import LeafletTile from "./LeafletTile";
import LeafletMarkers from "./LeafletMarkers";
import LeafletInfobox from "./LeafletInfobox";
import LeafletPolylineMarkers from "./LeafletPolylineMarkers";

import { useSettings } from "contexts/SettingsContext";
import useOnPageLoadWithDelay from "hooks/useOnPageLoadWithDelay";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { mqMin } from "styles/base";
import ErrorBoundary from "components/ui/ErrorBoundary";

const MapContainer = styled.div`
  z-index: 1;
  height: 100%;
`;

const StyledImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 312px;
  cursor: default;

  ${mqMin.large} {
    height: auto;
  }
`;

const LeafletChunkProvider = CustomNextDynamic(() => import("./LeafletProvider"), {
  ssr: false,
});

const StyledCover = styled(Cover)(
  () => css`
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  `
);

const MAX_ZOOM = 18;

const LeafletMapContainer = ({
  map,
  mapId = "map",
  rightTopContent,
  rightBottomContent,
  children,
  isClustersEnabled = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isDirectionsEnabled = false,
  // useSmallButtons = false,
  useAlternateInfobox = false,
  useAlternateStaticImageOnly = true,
  skipCoverImage = false,
  className,
}: {
  map: SharedTypes.Map;
  mapId?: string;
  rightTopContent?: React.ReactNode;
  rightBottomContent?: React.ReactNode;
  children?: React.ReactNode;
  isClustersEnabled?: boolean;
  isDirectionsEnabled?: boolean;
  className?: string;
  useAlternateInfobox?: boolean;
  useAlternateStaticImageOnly?: boolean;
  skipCoverImage?: boolean;
}) => {
  const { googleApiKey, mapboxAccessToken } = useSettings();

  const [mapWrapperRef, eventFiredOverMap] = useEventsHandlerTrigger({
    events: ["mouseover", "pointerenter"],
  });
  const isTimeToBeInteractive = useOnPageLoadWithDelay({ delay: 2000 });

  const showInteractiveMap = eventFiredOverMap || isTimeToBeInteractive;
  const coverMapImage = skipCoverImage ? undefined : getCoverMapImage(map, googleApiKey);

  return (
    <CoverMapWrapper ref={mapWrapperRef} className={className}>
      {useAlternateStaticImageOnly
        ? coverMapImage && <StyledImg src={coverMapImage.url} alt={coverMapImage.alt} />
        : coverMapImage && <StyledCover imageUrls={[coverMapImage]} showShadow={false} />}

      <MapContainer id={mapId} />
      {showInteractiveMap && (
        <ErrorBoundary componentName="leaflet-map">
          <LeafletChunkProvider
            mapId={mapId}
            mapData={map}
            maxZoom={MAX_ZOOM}
            isClustersEnabled={isClustersEnabled}
            useAlternateInfobox={useAlternateInfobox}
            isDirectionsEnabled={isDirectionsEnabled}
          >
            <LeafletMap />
            {map.usePolyLine ? <LeafletPolylineMarkers /> : <LeafletMarkers />}
            <LeafletInfobox />
            <LeafletTile
              tileLayerOptions={{
                // maxZoom is required for clustering to work
                maxZoom: MAX_ZOOM,
                // https://docs.mapbox.com/help/getting-started/attribution/
                attribution: `
            © <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/" target="_blank"><strong>Improve this map</strong></a>
            `,
              }}
              tileServiceURI={`https://api.mapbox.com/styles/v1/sigurdurgudbr/cl8cymrbv003614pqvug4e093/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxAccessToken}`}
            />
          </LeafletChunkProvider>
        </ErrorBoundary>
      )}
      {/* TODO - directions */}

      {/* <LeftBottomContent>
        {isDirectionsEnabled && (
          <DirectionsButton
            href={TODO}
            rel="nofollow noopener"
            target="_blank"
            isSmall={useSmallButtons}
          >
            <DirectionIcon isSmall={useSmallButtons} />
            <Trans ns={Namespaces.articleNs}>Directions</Trans>
          </DirectionsButton>
        )}
      </LeftBottomContent> */}

      {rightTopContent && <RightTopContent>{rightTopContent}</RightTopContent>}
      {rightBottomContent && <RightBottomContent>{rightBottomContent}</RightBottomContent>}
      {children}
    </CoverMapWrapper>
  );
};

export default LeafletMapContainer;
