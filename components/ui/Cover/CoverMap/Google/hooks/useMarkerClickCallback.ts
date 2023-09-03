import { useEffect } from "react";

const useMarkerClickCallback = ({
  overlappingMarkerSpiderfier,
  callback,
}: {
  overlappingMarkerSpiderfier?: OverlappingMarkerSpiderfierLib.OverlappingMarkerSpiderfier<GoogleMapTypes.MarkerWithData>;
  callback: (marker: GoogleMapTypes.MarkerWithData) => void;
}) => {
  useEffect(() => {
    if (!overlappingMarkerSpiderfier) {
      return () => {};
    }

    overlappingMarkerSpiderfier.addListener("click", callback);

    return () => {
      overlappingMarkerSpiderfier.removeListener("click", callback);
    };
  }, [overlappingMarkerSpiderfier, callback]);
};

export default useMarkerClickCallback;
