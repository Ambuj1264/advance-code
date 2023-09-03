import React, { memo, useCallback, useState } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { useTheme } from "emotion-theming";

import { DEFAULT_STREETVIEW_RADIUS, OUTER_CIRCLE } from "../mapConstants";
import { constructMapCardQueryVariables, getMapCardData } from "../mapUtils";
import MapCardQuery from "../../query/MapCardQuery.graphql";

import MapCard from "./MapCard";
import { mapDynamicStyles } from "./mapStyles";
import useOverlappingMarkerSpiderfier from "./hooks/useOverlappingMarkerSpiderfier";
import useMarkerClickCallback from "./hooks/useMarkerClickCallback";
import useMapEventHandler from "./hooks/useMapEventHandler";
import useGoogleMapAsyncInitialization from "./hooks/useGoogleMapAsyncInitialization";
import useInfoBox from "./hooks/useInfoBox";
import useMarkers from "./hooks/useMarkers";
import useMarkersClusters from "./hooks/useMarkersClusters";
import { getStreetViewDataForPoint } from "./mapUtils";

import { MAP_TYPE } from "types/enums";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { useSettings } from "contexts/SettingsContext";

const GoogleMapContainer = ({
  map,
  mapId,
  isClustersEnabled,
  onCheckForAvailableStreetView,
  useAlternateInfobox = false,
}: {
  map: SharedTypes.Map;
  mapId: string;
  isClustersEnabled: boolean;
  useAlternateInfobox?: boolean;
  onCheckForAvailableStreetView?: (hasStreetViewData: boolean) => void;
}) => {
  const { marketplace } = useSettings();
  const [infoBoxMarker, setInfoBoxMarker] = useState<GoogleMapTypes.MarkerWithData>();

  const [pointStreetViewStatus, setPointStreetViewStatus] = useState<
    google.maps.StreetViewStatus | undefined
  >();

  const [mapRadiusCircle, setMapRadiusCircle] = useState<google.maps.Circle>();

  const isMobile = useIsMobile();
  const theme: Theme = useTheme();

  const initializeHasStreetViewPanorama = useCallback(
    (_streetViewPanoramaData: any, streetViewStatus: google.maps.StreetViewStatus) => {
      const hasAvailableStreetView = streetViewStatus === google.maps.StreetViewStatus.OK;
      onCheckForAvailableStreetView?.(hasAvailableStreetView);
    },
    [onCheckForAvailableStreetView]
  );

  const initializeGoogleMap = useCallback(
    (googleMap: google.maps.Map, googleStreetView: google.maps.StreetViewService) => {
      const center = { lat: map.latitude, lng: map.longitude };
      if (mapRadiusCircle) {
        mapRadiusCircle?.setMap(null);
      }
      googleMap.setOptions({
        zoom: map.zoom,
        center,
        styles: mapDynamicStyles(theme.colors.primary, 25),
        fullscreenControlOptions: {
          position: window.google.maps.ControlPosition.LEFT_TOP,
        },
        ...(isMobile && {
          controlSize: 25,
        }),
      });
      if (map?.points && map.points.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        map.points.forEach(point => bounds.extend({ lat: point.latitude, lng: point.longitude }));

        googleMap.fitBounds(bounds, 20);
        googleMap.setCenter(bounds.getCenter());
      }

      // eslint-disable-next-line no-new
      setMapRadiusCircle(
        new window.google.maps.Circle({
          strokeWeight: 0,
          fillColor: OUTER_CIRCLE.fillColor,
          fillOpacity: OUTER_CIRCLE.fillOpacity,
          map: googleMap,
          center,
          radius: OUTER_CIRCLE.radius,
          clickable: false,
        })
      );

      if (!onCheckForAvailableStreetView || !googleStreetView) return;

      googleStreetView.getPanoramaByLocation(
        {
          lat: map.latitude,
          lng: map.longitude,
        },
        DEFAULT_STREETVIEW_RADIUS,
        initializeHasStreetViewPanorama
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMobile, map.latitude, map.longitude, map.zoom]
  );

  const mapInstance = useGoogleMapAsyncInitialization({
    mapId,
    callback: initializeGoogleMap,
    isMobile,
    map,
    options: map.options ? map.options : {},
  });

  const { infoBox, InfoBoxContainer } = useInfoBox({
    mapInstance: mapInstance?.googleMaps,
  });

  // create markers and append point data to each one
  const markers = useMarkers({
    mapInstance: mapInstance?.googleMaps,
    points: map.points,
  });

  useMarkersClusters({
    mapInstance: mapInstance?.googleMaps,
    markers,
    isClustersEnabled,
  });

  const overlappingMarkerSpiderfier = useOverlappingMarkerSpiderfier({
    mapInstance: mapInstance?.googleMaps,
    markers,
  });

  const [fetchMapCardData] = useLazyQuery<{
    [key in SharedTypes.MapPointTypeValues]: MapTypes.MapCardInfoType;
  }>(MapCardQuery, {
    fetchPolicy: "network-only",
    onCompleted: data => {
      const mapCardType = infoBoxMarker?.pointData.orm_name;
      if (data && mapCardType && infoBoxMarker?.pointData) {
        const mapCardItem = data[mapCardType] || data?.itineraryMapDetail || {};

        setInfoBoxMarker({
          ...infoBoxMarker,
          pointData: getMapCardData(mapCardItem, infoBoxMarker.pointData),
        } as GoogleMapTypes.MarkerWithData);

        if (useAlternateInfobox) {
          getStreetViewDataForPoint(mapInstance?.googleStreetView, infoBoxMarker.pointData).then(
            streetViewData => {
              setPointStreetViewStatus(streetViewData.status);
            }
          );
        }
      }
    },
  });

  const showInfoBoxOnMarkerClick = useCallback(
    (marker: GoogleMapTypes.MarkerWithData) => {
      if (infoBoxMarker?.pointData.id === marker.pointData.id) {
        return;
      }
      setInfoBoxMarker(marker);

      if (infoBox && mapInstance?.googleMaps) {
        infoBox?.open(mapInstance?.googleMaps, marker as google.maps.MVCObject);
      }

      if (marker.pointData && marker.pointData.id && !marker.pointData.title) {
        setPointStreetViewStatus(undefined);
        fetchMapCardData({
          variables: constructMapCardQueryVariables(marker.pointData, MAP_TYPE.GOOGLE, marketplace),
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [infoBox, mapInstance?.googleMaps, infoBoxMarker]
  );

  useMarkerClickCallback({
    overlappingMarkerSpiderfier,
    callback: showInfoBoxOnMarkerClick,
  });

  const closeInfobox = useCallback(() => {
    infoBox?.close();
    setInfoBoxMarker(undefined);
  }, [infoBox]);

  const closeInfoBoxOnClickOutside = useCallback(
    (event: google.maps.MouseEvent) => {
      if (!infoBox) {
        return;
      }

      const clickedOutsideInfoBox = !infoBox.contains(event.latLng);
      if (clickedOutsideInfoBox) {
        closeInfobox();
      }
    },
    [closeInfobox, infoBox]
  );

  useMapEventHandler({
    mapInstance: mapInstance?.googleMaps,
    event: "click",
    handler: closeInfoBoxOnClickOutside,
  });

  return (
    <InfoBoxContainer>
      <MapCard
        onClose={closeInfobox}
        key={infoBoxMarker?.pointData.id ?? "info-box-container"}
        pointData={infoBoxMarker?.pointData}
        isStreetViewAvailable={useAlternateInfobox && pointStreetViewStatus === "OK"}
        isStreetViewStatusLoading={useAlternateInfobox && pointStreetViewStatus === undefined}
        useAlternateInfobox={useAlternateInfobox}
      />
    </InfoBoxContainer>
  );
};

export default memo(GoogleMapContainer);
