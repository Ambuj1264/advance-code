import { useState, useEffect } from "react";

const OPTIONS = {
  markersWontMove: true,
  markersWontHide: true,
  keepSpiderfied: true,
  nudgeRadius: 1,
};

// This would allow us to fix issue with many
// pointers in the same location
// Similar to Clustering but view like in Google Earth
const initializeAsyncOverlappingMarker = async (
  mapInstance: google.maps.Map,
  markers: GoogleMapTypes.MarkerWithData[],
  options: OverlappingMarkerSpiderfierLib.Options
) => {
  const OverlappingMarkerSpiderfier = (await import("overlapping-marker-spiderfier")).default;

  const overlappingMarkerSpiderfier = new OverlappingMarkerSpiderfier(
    mapInstance,
    options
  ) as OverlappingMarkerSpiderfierLib.OverlappingMarkerSpiderfier<GoogleMapTypes.MarkerWithData>;

  markers.map(marker => {
    return overlappingMarkerSpiderfier.addMarker(marker);
  });

  return overlappingMarkerSpiderfier;
};

const useOverlappingMarkerSpiderfier = ({
  mapInstance,
  markers,
}: {
  mapInstance?: google.maps.Map;
  markers: GoogleMapTypes.MarkerWithData[];
}) => {
  const [overlappingMarkerSpiderfier, setOverlappingMarkerSpiderfier] =
    useState<
      OverlappingMarkerSpiderfierLib.OverlappingMarkerSpiderfier<GoogleMapTypes.MarkerWithData>
    >();

  useEffect(
    function initializeMarkerSpiderfier() {
      if (mapInstance && markers.length) {
        initializeAsyncOverlappingMarker(mapInstance, markers, OPTIONS).then(
          overlappingMarkerSpiderfierInstance => {
            setOverlappingMarkerSpiderfier(overlappingMarkerSpiderfierInstance);
          }
        );
      }

      return () => {};
    },
    [mapInstance, markers]
  );

  return overlappingMarkerSpiderfier;
};

export default useOverlappingMarkerSpiderfier;
