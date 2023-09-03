import { memo, useCallback } from "react";

import { OUTER_CIRCLE, DEFAULT_ZOOM } from "../mapConstants";

import useBaiduMapAsyncInitialization from "./hooks/useBaiduMapAsyncInitialization";
import useMarkers from "./hooks/useMarkers";
import useMarkersClusters from "./hooks/useMarkersClusters";
import useInfoBox from "./hooks/useInfoBox";
import useMapEventHandler from "./hooks/useMapEventHandler";

import { useIsMobile } from "hooks/useMediaQueryCustom";

const CoverBaiduJsAPI = ({
  map,
  mapId,
  isClustersEnabled,
  useAlternateInfobox,
}: {
  map: SharedTypes.Map;
  mapId: string;
  isClustersEnabled?: boolean;
  useAlternateInfobox: boolean;
}) => {
  const isMobile = useIsMobile();

  const initializeBaiduMap = useCallback(
    (baiduMap: BMap.Map) => {
      const centerPoint = new window.BMap.Point(map.longitude, map.latitude);

      baiduMap.centerAndZoom(centerPoint, map?.zoom || DEFAULT_ZOOM);

      baiduMap.clearOverlays();

      baiduMap.addOverlay(
        new window.BMap.Circle(centerPoint, OUTER_CIRCLE.radius, {
          strokeColor: OUTER_CIRCLE.fillColor,
          strokeWeight: OUTER_CIRCLE.strokeWidth,
          fillColor: OUTER_CIRCLE.fillColor,
          fillOpacity: OUTER_CIRCLE.fillOpacity,
        })
      );
      if (map.points && map.points.length > 1) {
        const baiduMapPoints = map.points.map(
          point => new window.BMap.Point(point.latitude, point.longitude)
        );
        const viewPort = baiduMap.getViewport(baiduMapPoints);
        const mapCenterPoint = new window.BMap.Point(viewPort.center.lat, viewPort.center.lng);
        baiduMap.centerAndZoom(mapCenterPoint, viewPort.zoom);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMobile, map.latitude, map.longitude, map.zoom, map.points]
  );

  const mapInstance = useBaiduMapAsyncInitialization({
    mapId,
    callback: initializeBaiduMap,
    isMobile,
    map,
    options: map.options ? map.options : {},
  });

  const markers = useMarkers({
    mapInstance,
    points: map.points,
    isClustersEnabled,
  });

  const { infoBoxCardContainer, infoBox } = useInfoBox({
    mapInstance,
    markers,
    useAlternateInfobox,
  });

  const handleCloseInfoBoxByOutsideClick = useCallback(() => {
    if (infoBox) {
      infoBox.close();
    }
  }, [infoBox]);

  useMapEventHandler({
    mapInstance,
    handler: handleCloseInfoBoxByOutsideClick,
  });

  useMarkersClusters({ mapInstance, markers, isClustersEnabled });

  return infoBoxCardContainer;
};

export default memo(CoverBaiduJsAPI);
