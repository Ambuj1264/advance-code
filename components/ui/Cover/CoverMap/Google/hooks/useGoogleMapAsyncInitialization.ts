import { useState, useEffect } from "react";
import { loadScript } from "@travelshift/ui/hooks/useDynamicScript";

import { useSettings } from "contexts/SettingsContext";

const GOOGLE_MAPS_API = (googleApiKey: string) =>
  `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=drawing&callback=initMap`;

const useGoogleMapAsyncInitialization = ({
  mapId,
  options,
  callback,
  isMobile,
  map,
}: {
  mapId: string;
  options?: google.maps.MapOptions;
  callback?: (googleMap: google.maps.Map, googleStreetView: google.maps.StreetViewService) => void;
  isMobile: boolean;
  map: SharedTypes.Map;
  shouldUseGoogleStreetView?: boolean;
}):
  | {
      googleMaps?: google.maps.Map;
      googleStreetView?: google.maps.StreetViewService;
    }
  | undefined => {
  const { googleApiKey } = useSettings();
  const [mapInstance, setMapInstance] = useState<{
    googleMaps: google.maps.Map;
    googleStreetView: google.maps.StreetViewService;
  }>();

  useEffect(() => {
    const mapInitialization = () => {
      const mapDOMElement = document.getElementById(mapId);

      if (!mapDOMElement || !window.google?.maps) {
        return;
      }

      const googleMap = new window.google.maps.Map(mapDOMElement, options);
      const googleStreetView = new window.google.maps.StreetViewService();

      setMapInstance({
        googleMaps: googleMap,
        googleStreetView,
      });
      callback?.(googleMap, googleStreetView);
    };

    if (!mapInstance?.googleMaps) {
      if (window.google?.maps) {
        mapInitialization();
      } else if (googleApiKey) {
        // eslint-disable-next-line functional/immutable-data
        window.initMap = mapInitialization;
        loadScript("googleMapsAPI", GOOGLE_MAPS_API(googleApiKey), {}, mapInitialization);
      }
    } else {
      callback?.(mapInstance.googleMaps, mapInstance.googleStreetView);
    }
    // eslint-disable-next-line
  }, [isMobile, map.latitude, map.longitude, map.zoom]);

  return mapInstance;
};

export default useGoogleMapAsyncInitialization;
