import { useState, useEffect } from "react";
import MarkerClusterer from "@googlemaps/markerclustererplus";

import { getMarkersByTypes } from "../../mapUtils";
import {
  CLUSTERS_MAX_ZOOM,
  CLUSTER_ICON_SIZE,
  CLUSTER_FONT_FAMILY,
  CLUSTERS_MAX_ZOOM_MOBILE,
} from "../../mapConstants";

import { getStaticDirPath } from "utils/globalUtils";
import { whiteColor } from "styles/variables";
import { useIsMobile } from "hooks/useMediaQueryCustom";

type ClustersByType = {
  [key in SharedTypes.MapPointTypeValues]?: MarkerClusterer;
};

const useMarkersClusters = ({
  mapInstance,
  markers,
  isClustersEnabled,
}: {
  mapInstance?: google.maps.Map;
  markers: GoogleMapTypes.MarkerWithData[];
  isClustersEnabled: boolean;
}): ClustersByType => {
  const isMobile = useIsMobile();
  const [markersClusters, setMarkersClusters] = useState<ClustersByType>({});

  useEffect(
    function reinitClustersOnDataChange() {
      if (!isClustersEnabled) return;

      const markersByTypes: MapTypes.MarkerWithDataByTypes = getMarkersByTypes(markers);

      if (mapInstance) {
        const markerTypes = Object.keys(markersByTypes);

        // eslint-disable-next-line array-callback-return
        markerTypes.map(clusterType => {
          const markersClusterByType = markersClusters[clusterType];

          if (markersClusterByType) {
            markersClusterByType.clearMarkers();
          }
        });

        let clustersByType = {};

        // eslint-disable-next-line array-callback-return
        markerTypes.map(markerType => {
          const markersByType = markersByTypes[markerType] as GoogleMapTypes.MarkerWithData[];
          const clusterIcon = `${getStaticDirPath()}/icons/map/clusters/${markerType}.png`;

          if (markersByType && markersByType.length) {
            const clusterStyles = {
              fontWeight: "bold",
              fontSize: 12,
              fontFamily: CLUSTER_FONT_FAMILY,
              textColor: whiteColor,
              height: CLUSTER_ICON_SIZE,
              width: CLUSTER_ICON_SIZE,
              textLineHeight: CLUSTER_ICON_SIZE,
              url: clusterIcon,
            };

            clustersByType = {
              ...clustersByType,
              [markerType]: new MarkerClusterer(mapInstance, markersByType, {
                imagePath: clusterIcon,
                minimumClusterSize: 1,
                maxZoom: isMobile ? CLUSTERS_MAX_ZOOM_MOBILE : CLUSTERS_MAX_ZOOM,
                // The same styles for icons on all zoom levels & cluster sizes
                styles: [clusterStyles, clusterStyles, clusterStyles, clusterStyles, clusterStyles],
              }),
            };
          }
        });

        setMarkersClusters(clustersByType);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [markers, isMobile]
  );

  return markersClusters;
};

export default useMarkersClusters;
