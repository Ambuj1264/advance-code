import { usePostBookingQueryParams } from "../components/hooks/usePostBookingQueryParams";
import { PostBookingTypes } from "../types/postBookingTypes";

import TravelPlanItinerary from "components/features/PostBooking/queries/TravelPlanItinerary.graphql";
import useActiveLocale from "hooks/useActiveLocale";
import { noCacheHeaders } from "utils/apiUtils";
import useQueryClient from "hooks/useQueryClient";

const useFetchItineraryData = ({ skip = false } = {}) => {
  const [{ tripId }] = usePostBookingQueryParams();
  const locale = useActiveLocale();

  const result = useQueryClient<PostBookingTypes.QueryItinerary>(TravelPlanItinerary, {
    variables: {
      request: {
        bookingId: tripId,
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

export default useFetchItineraryData;
