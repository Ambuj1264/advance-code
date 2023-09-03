import { PostBookingTypes } from "../types/postBookingTypes";

import TravelPlanUserReservationsQuery from "components/features/PostBooking/queries/TravelPlanUserReservations.graphql";
import { noCacheHeaders } from "utils/apiUtils";
import useQueryClient from "hooks/useQueryClient";

export const useFetchUserReservations = () => {
  const { data, loading, error } = useQueryClient<PostBookingTypes.QueryUserReservations>(
    TravelPlanUserReservationsQuery,
    {
      context: {
        headers: noCacheHeaders,
      },
    }
  );

  return {
    data,
    loading,
    error,
  };
};
