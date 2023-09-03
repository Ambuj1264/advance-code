import { useEffect, useLayoutEffect } from "react";

import { useLeafletMapContext } from "./context/leafletContext";

const LeafletMap = () => {
  const { mapId, instance, setContextState, map, mapData, maxZoom, isClusteringEnabled } =
    useLeafletMapContext();
  useEffect(() => {
    if (!map && instance && mapData?.latitude) {
      const lMap = instance.map(mapId, {
        // this prop is available when Leaflet.GestureHandling is injected
        // please remove in case you decide to drop this plugin
        // @ts-ignore
        gestureHandling: true,
        zoom: mapData.zoom || 13,
        maxZoom,
        ...(isClusteringEnabled ? { zoomSnap: 0.3 } : null),
        center: [mapData.latitude, mapData.longitude],
      });

      // REMOVE this when Leaflet.GestureHandling is removed
      lMap.fireEvent("mouseover");

      setContextState({
        map: lMap,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance, map, mapData, mapId, setContextState]);

  useEffect(() => {
    if (map && mapData && mapData?.points) {
      const bounds = mapData.points?.map(point => [point.latitude, point.longitude]);
      if (bounds && bounds.length > 0) {
        map.fitBounds(bounds as L.LatLngBoundsExpression, {
          padding: [40, 40],
        });
      }
    }
  }, [map, mapData]);

  useLayoutEffect(() => {
    if (map && instance) {
      map.invalidateSize();
    }
  }, [instance, map]);

  useEffect(() => {
    return () => {
      map?.clearAllEventListeners();
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default LeafletMap;
