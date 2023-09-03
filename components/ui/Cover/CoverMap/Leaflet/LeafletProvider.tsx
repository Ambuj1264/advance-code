import React, { memo } from "react";
import Leaflet from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import { GestureHandling } from "leaflet-gesture-handling";

import { LeafletMapProvider } from "./context/leafletContext";

Leaflet.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

const LeafletProvider = ({
  children,
  useAlternateInfobox,
  isDirectionsEnabled,
  mapId,
  mapData,
  isClustersEnabled,
  maxZoom,
}: {
  children: React.ReactNode;
  useAlternateInfobox: boolean;
  isDirectionsEnabled: boolean;
  isClustersEnabled: boolean;
  mapId: string;
  maxZoom: number;
  mapData: SharedTypes.Map;
}) => {
  return (
    <LeafletMapProvider
      useAlternateInfobox={useAlternateInfobox}
      isDirectionsEnabled={isDirectionsEnabled}
      mapId={mapId}
      mapData={mapData}
      isClusteringEnabled={isClustersEnabled}
      isUsingPolyLine={mapData.usePolyLine ?? false}
      maxZoom={maxZoom}
      instance={Leaflet}
    >
      {children}
    </LeafletMapProvider>
  );
};

export default memo(LeafletProvider);
