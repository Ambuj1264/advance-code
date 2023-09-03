import { useQuery } from "@apollo/react-hooks";

import { usePostBookingQueryParams } from "../components/hooks/usePostBookingQueryParams";

import TravelPlanGeneratedCheck from "components/features/PostBooking/queries/TravelPlanGeneratedCheck.graphql";
import { noCacheHeaders } from "utils/apiUtils";

type CheckGenerationResult = {
  isItineraryGenerated: {
    isItineraryGenerated: boolean;
  };
};

const GENERATION_POLL_INTERVAL_MS = 2000;

const useCheckGenerationStatus = () => {
  const [{ tripId }] = usePostBookingQueryParams();
  const {
    data: generationData,
    loading: generationLoading,
    error: generationError,
    stopPolling,
  } = useQuery<CheckGenerationResult>(TravelPlanGeneratedCheck, {
    variables: {
      request: {
        orderId: tripId,
      },
    },
    fetchPolicy: "no-cache",
    context: {
      headers: noCacheHeaders,
    },
    pollInterval: GENERATION_POLL_INTERVAL_MS,
    onError: error => {
      if (error) {
        stopPolling();
      }
    },
    onCompleted: data => {
      if (!data) return;

      if (data.isItineraryGenerated.isItineraryGenerated === true) {
        stopPolling();
      }
    },
  });

  return {
    generationData: generationData?.isItineraryGenerated.isItineraryGenerated,
    generationLoading,
    generationError,
  };
};

export default useCheckGenerationStatus;
