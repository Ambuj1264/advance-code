import { useState, useEffect } from "react";
import { loadScript } from "@travelshift/ui/hooks/useDynamicScript";

import { getMarkersByTypes } from "../../mapUtils";
import {
  CLUSTERS_MAX_ZOOM,
  CLUSTER_ICON_SIZE,
  BAIDU_CLUSTERS_MIN_SIZE,
  BAIDU_CLUSTERS_GRID_SIZE,
  CLUSTERS_MAX_ZOOM_MOBILE,
} from "../../mapConstants";

import useToggle from "hooks/useToggle";
import { getStaticDirPath } from "utils/globalUtils";
import { whiteColor } from "styles/variables";
import { useIsMobile } from "hooks/useMediaQueryCustom";

type ClustersByType = {
  [key in SharedTypes.MapPointTypeValues]?: any;
};

const BAIDU_TEXT_ICON_LIB_URL =
  "//api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js";
const BAIDU_CLUSTERS_LIB_URL = `${getStaticDirPath()}/js/baidu-maps/markerClusters.min.js`;

const useMarkersClusters = ({
  mapInstance,
  markers,
  isClustersEnabled,
}: {
  mapInstance?: BMap.Map;
  markers: BaiduMapTypes.MarkerWithData[];
  isClustersEnabled?: boolean;
}): ClustersByType => {
  const isMobile = useIsMobile();
  const [markersClusters, setMarkersClusters] = useState<ClustersByType>({});
  const [isClustersLibLoaded, toggleClustersLibLoaded] = useToggle(false);
  const [isTextLibLoaded, toggleTextLibLoaded] = useToggle(false);
  const isModulesLoaded = isClustersLibLoaded && isTextLibLoaded;

  useEffect(
    function initMarkersClusters() {
      if (!isClustersEnabled || !mapInstance || !markers) return;

      const initClusters = () => {
        const markersByTypes: MapTypes.MarkerWithDataByTypes = getMarkersByTypes(markers);

        const markerTypes = Object.keys(markersByTypes);

        markerTypes.forEach(clusterType => {
          const markersClusterByType = markersClusters[clusterType];

          if (markersClusterByType) {
            markersClusterByType.clearMarkers();
          }
        });

        let clustersByType = {};

        // eslint-disable-next-line array-callback-return
        markerTypes.map(markerType => {
          const markersByType = markersByTypes[markerType];
          const clusterIcon = `${getStaticDirPath()}/icons/map/clusters/${markerType}.png`;

          if (markersByType && markersByType.length) {
            const clusterStyles = {
              url: clusterIcon,
              size: new window.BMap.Size(CLUSTER_ICON_SIZE, CLUSTER_ICON_SIZE),
              textColor: whiteColor,
            };

            clustersByType = {
              ...clustersByType,
              [markerType]: new window.BMapLib.MarkerClusterer(mapInstance, {
                markers: markersByType,
                maxZoom: isMobile ? CLUSTERS_MAX_ZOOM_MOBILE : CLUSTERS_MAX_ZOOM,
                minClusterSize: BAIDU_CLUSTERS_MIN_SIZE,
                gridSize: BAIDU_CLUSTERS_GRID_SIZE,
                // The same styles for icons on all zoom levels.
                styles: [clusterStyles, clusterStyles, clusterStyles, clusterStyles],
              }),
            };
          }
        });

        setMarkersClusters(clustersByType);
      };

      if (window.BMap && !isModulesLoaded && markers.length) {
        loadScript("baiduTextIconLib", BAIDU_TEXT_ICON_LIB_URL, {}, toggleTextLibLoaded);
        loadScript("baiduClustersLib", BAIDU_CLUSTERS_LIB_URL, {}, toggleClustersLibLoaded);
      } else if (isModulesLoaded) {
        initClusters();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapInstance, markers, isModulesLoaded]
  );

  return markersClusters;
};

export default useMarkersClusters;
