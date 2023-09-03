import L from "leaflet";
import { useEffect } from "react";

import { useLeafletMapContext } from "./context/leafletContext";

const LeafletTile = ({
  tileServiceURI,
  tileLayerOptions,
}: {
  tileServiceURI: string;
  tileLayerOptions: L.TileLayerOptions;
}) => {
  const { instance, map } = useLeafletMapContext();

  useEffect(() => {
    if (instance && map) {
      instance.tileLayer(tileServiceURI, tileLayerOptions).addTo(map);
    }
  }, [instance, map, tileLayerOptions, tileServiceURI]);

  return null;
};

export default LeafletTile;
