import { useContext } from "react";

import { VPFlightStateContext } from "../contexts/VPFlightStateContext";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";
import { VPStayStateContext } from "../contexts/VPStayStateContext";

import FlightAvailableBaggageQuery from "components/features/VacationPackageProductPage/queries/FlightAvailableBaggageQuery.graphql";
import { noCacheHeaders } from "utils/apiUtils";
import { getTravelersFromOccupancies } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import useQueryClient from "hooks/useQueryClient";

export const useOnFlightItinerarySelect = () => {
  const { selectedFlight } = useContext(VPFlightStateContext);
  const { occupancies } = useContext(VPStayStateContext);
  const { onVPFlightBaggageCompleted } = useContext(VPActionCallbackContext);
  const { adults, children, infants } = getTravelersFromOccupancies(occupancies);
  const { error: flightBaggageQueryError, data: flightQueryData } =
    useQueryClient<VacationPackageTypes.FlightIteneraryType>(FlightAvailableBaggageQuery, {
      variables: {
        input: {
          bookingToken: selectedFlight?.id,
          adults,
          children,
          infants,
          isHold: true,
          numberOfBags: 0,
          numberOfPassengers: adults + children + infants,
        },
      },
      skip: !selectedFlight,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "no-cache",
      onCompleted: flightData => {
        onVPFlightBaggageCompleted(flightData);
      },
      context: {
        headers: noCacheHeaders,
      },
    });
  return {
    flightQueryData,
    flightBaggageQueryError,
  };
};
