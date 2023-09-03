import { useCallback } from "react";

import { getMapDirectionsUrl } from "../mapUtils";

import { useGetCurrentMapType } from "./useGetAvailableMap";

export const useGetMapDirectionsUrlBuilder = () => {
  const mapType = useGetCurrentMapType();

  return useCallback(
    (map: SharedTypes.Map) => {
      if (map?.latitude !== undefined) {
        return getMapDirectionsUrl(map, mapType);
      }

      return "";
    },
    [mapType]
  );
};
