import { useState, useEffect } from "react";

import { getMarkerIconByPointType } from "../../mapUtils";
import { MARKER_SIZE } from "../../mapConstants";

const useMarkers = ({
  mapInstance,
  points,
  isClustersEnabled,
}: {
  mapInstance?: BMap.Map;
  points?: SharedTypes.MapPoint[];
  isClustersEnabled?: boolean;
}): BaiduMapTypes.MarkerWithData[] => {
  const [markerDataList, setMarkerDataList] = useState<BaiduMapTypes.MarkerWithData[]>([]);

  useEffect(
    function createMarkers() {
      if (!mapInstance) {
        return;
      }

      const markerPointList = points?.map(point => {
        const customMarkerUrl = getMarkerIconByPointType(point.type);

        const marker = new window.BMap.Marker(
          new window.BMap.Point(point.longitude, point.latitude),
          {
            icon: new window.BMap.Icon(
              customMarkerUrl,
              new window.BMap.Size(MARKER_SIZE, MARKER_SIZE)
            ),
          }
        ) as BaiduMapTypes.MarkerWithData;

        // eslint-disable-next-line functional/immutable-data
        marker.pointData = point;

        if (!isClustersEnabled) {
          mapInstance.addOverlay(marker);
        }

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
