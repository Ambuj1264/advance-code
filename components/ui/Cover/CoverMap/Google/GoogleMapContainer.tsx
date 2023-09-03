import React from "react";
import styled from "@emotion/styled";

import { CoverStyled } from "../../CountryAndArticleSearchPagesCover";

import useEventsHandlerTrigger from "./hooks/useEventsHandlerTrigger";
import { getCoverMapImage } from "./mapUtils";

import { mqMin } from "styles/base";
import MapPlaceholder from "components/ui/Cover/CoverMap/Google/MapPlaceholder";
import { useSettings } from "contexts/SettingsContext";
import useOnPageLoadWithDelay from "hooks/useOnPageLoadWithDelay";
import CustomNextDynamic from "lib/CustomNextDynamic";

const MAP_ID = "cover-google-map";

const LazyGoogleMapJs = CustomNextDynamic(
  () => import("components/ui/Cover/CoverMap/Google/CoverGoogleMapJsAPI"),
  {
    loading: () => null,
    ssr: false,
  }
);

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;

  .infoBox > img {
    display: none;
  }
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

const GoogleMapContainer = ({
  mapId = MAP_ID,
  map,
  isClustersEnabled,
  useAlternateInfobox = false,
  onCheckForAvailableStreetView,
  useAlternateStaticImageOnly = false,
}: {
  mapId?: string;
  map: SharedTypes.Map;
  isClustersEnabled: boolean;
  useAlternateInfobox?: boolean;
  onCheckForAvailableStreetView?: (hasStreetViewData: boolean) => void;
  useAlternateStaticImageOnly?: boolean;
}) => {
  const { googleApiKey } = useSettings();
  const [mapWrapperRef, eventFiredOverMap] = useEventsHandlerTrigger({
    events: ["mouseover", "pointerenter", "touchstart"],
  });
  const isTimeToBeInteractive = useOnPageLoadWithDelay({ delay: 2500 });

  const showInteractiveMap =
    !useAlternateStaticImageOnly && (eventFiredOverMap || isTimeToBeInteractive);
  const coverMapImage = getCoverMapImage(map, googleApiKey);

  return (
    <MapWrapper ref={mapWrapperRef}>
      <MapPlaceholder id={mapId} />
      {!showInteractiveMap &&
        coverMapImage.url &&
        (useAlternateStaticImageOnly ? (
          <StyledImg src={coverMapImage.url} alt={coverMapImage.alt} />
        ) : (
          <CoverStyled
            desktopHeight={430}
            imageUrls={[coverMapImage]}
            showShadow={false}
            shouldKeepQueryParams
          />
        ))}
      {showInteractiveMap && (
        <LazyGoogleMapJs
          map={map}
          mapId={mapId}
          isClustersEnabled={isClustersEnabled}
          useAlternateInfobox={useAlternateInfobox}
          onCheckForAvailableStreetView={onCheckForAvailableStreetView}
        />
      )}
    </MapWrapper>
  );
};

export { MapPlaceholder as MapWrapper };
export default GoogleMapContainer;
