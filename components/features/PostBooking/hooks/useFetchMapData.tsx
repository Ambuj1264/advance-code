import { usePostBookingQueryParams } from "../components/hooks/usePostBookingQueryParams";
import { PostBookingTypes } from "../types/postBookingTypes";

import TravelPlanItineraryMap from "components/features/PostBooking/queries/TravelPlanItineraryMap.graphql";
import useActiveLocale from "hooks/useActiveLocale";
import { noCacheHeaders } from "utils/apiUtils";
import useQueryClient from "hooks/useQueryClient";

const useFetchMapData = ({ skip = false } = {}) => {
  const [{ tripId }] = usePostBookingQueryParams();
  const locale = useActiveLocale();

  const result = useQueryClient<PostBookingTypes.QueryItineraryMap>(TravelPlanItineraryMap, {
    variables: {
      request: {
        bookingId: Number(tripId),
        locale,
      },
    },
    context: {
      headers: noCacheHeaders,
    },
    skip,
  });

  return result;
};

export default useFetchMapData;
