import { useMemo } from "react";

import { getBaiduMapDirectionPageUrl } from "components/ui/Cover/CoverMap/Baidu/mapUtils";
import { getGoogleMapDirectionPageUrl } from "components/ui/Cover/CoverMap/Google/mapUtils";
import { useGetCurrentMapType } from "components/ui/Cover/CoverMap/hooks/useGetAvailableMap";
import { MAP_TYPE } from "types/enums";
import { PostBookingTypes } from "components/features/PostBooking/types/postBookingTypes";

export const usePBOpenMap = (
  travelMode: PostBookingTypes.TravelModeForGoogleApi,
  point?: Pick<SharedTypes.MapPoint, "latitude" | "longitude" | "title">,
  googlePlaceId?: string
) => {
  const mapType = useGetCurrentMapType();

  const openMapUrl = useMemo(() => {
    if (!point) {
      return undefined;
    }

    return mapType === MAP_TYPE.GOOGLE
      ? getGoogleMapDirectionPageUrl({
          coords: point,
          googlePlaceId,
          travelMode,
        })
      : getBaiduMapDirectionPageUrl(point);
  }, [googlePlaceId, mapType, point, travelMode]);

  return {
    openMapUrl,
  };
};
