import { useState, useEffect } from "react";

import { getMarkerIconByPointType } from "../../mapUtils";
import { MARKER_SIZE } from "../../mapConstants";

const useMarkers = ({
  mapInstance,
  points,
}: {
  mapInstance?: google.maps.Map;
  points?: SharedTypes.MapPoint[];
}): GoogleMapTypes.MarkerWithData[] => {
  const [markerDataList, setMarkerDataList] = useState<GoogleMapTypes.MarkerWithData[]>([]);

  useEffect(
    function createMarkersWithPointData() {
      if (!mapInstance) {
        return;
      }

      // Clear old map markers if map data was changed
      if (markerDataList.length) {
        markerDataList.map(item => item.setMap(null));
      }

      const markerPointList = points?.map(point => {
        const position = {
          lat: point.latitude,
          lng: point.longitude,
        };
        const customMarkerUrl = getMarkerIconByPointType(point.type);
        const marker = new window.google.maps.Marker({
          ...(customMarkerUrl && {
            icon: {
              url: customMarkerUrl,
              scaledSize: new window.google.maps.Size(MARKER_SIZE, MARKER_SIZE),
              // put marker image center on the point
              anchor: new window.google.maps.Point(MARKER_SIZE / 2, MARKER_SIZE / 2),
            },
          }),
          position,
          map: mapInstance,
        });

        // eslint-disable-next-line functional/immutable-data
        marker.pointData = point;
        return marker;
      });

      if (markerPointList) {
        setMarkerDataList(markerPointList);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapInstance, points]
  );

  return markerDataList;
};

export default useMarkers;
