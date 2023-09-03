import { useContext, useMemo } from "react";

import { VPFlightStateContext } from "../contexts/VPFlightStateContext";
import CalculateVPPriceQuery from "../queries/CalculateVPPriceQuery.graphql";
import { VPStateContext } from "../contexts/VPStateContext";
import { VPCarStateContext } from "../contexts/VPCarStateContext";
import { VPStayStateContext } from "../contexts/VPStayStateContext";
import {
  VPPriceStateContext,
  VPPriceCallbackContext,
  VP_DEFAULT_CAR_DESTINATION_ID,
} from "../contexts/VPPriceStateContext";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import useQueryClient from "hooks/useQueryClient";
import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import { noCacheHeaders } from "utils/apiUtils";
import { getTravelersFromOccupancies } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";

export const useVacationPackagePrices = () => {
  const { tripId, requestId, selectedDates } = useContext(VPStateContext);
  const { carPriceInput, flightPriceInput, stayPriceInput, tourPriceInput } =
    useContext(VPPriceStateContext);
  const { onResetPriceData } = useContext(VPPriceCallbackContext);
  const { onSetVPPrice } = useContext(VPActionCallbackContext);
  const { vacationIncludesFlight, flightsResults } = useContext(VPFlightStateContext);
  const { vacationIncludesCar, carResults, carPriceDestinationId } = useContext(VPCarStateContext);
  const { hotels, occupancies } = useContext(VPStayStateContext);
  const carPickupId =
    carPriceDestinationId === VP_DEFAULT_CAR_DESTINATION_ID ? undefined : carPriceDestinationId;
  const numberOfTravelers = getTravelersFromOccupancies(occupancies);
  const { adults, children, infants } = numberOfTravelers;
  const { from } = selectedDates;

  const skipFlightsCondition = vacationIncludesFlight && flightsResults.length === 0;
  const skipCarsCondition = vacationIncludesCar && carResults.length === 0;
  const skipStaysCondition = hotels.length === 0;
  const shouldSkipFetchingPrices = skipCarsCondition || skipFlightsCondition || skipStaysCondition;
  const input = useMemo(() => {
    return {
      requestId,
      tripId,
      from: getFormattedDate(from!, yearMonthDayFormat),
      adults,
      children,
      infants,
      cars: carPriceInput,
      flights: flightPriceInput,
      staysV2: stayPriceInput,
      tours: tourPriceInput,
      carPickupId,
      flightIncluded: vacationIncludesFlight,
      carIncluded: vacationIncludesCar,
    } as VacationPackageTypes.QueryCalculatePriceInput;
  }, [
    requestId,
    tripId,
    from,
    adults,
    children,
    infants,
    vacationIncludesFlight,
    vacationIncludesCar,
    carPickupId,
    flightPriceInput,
    carPriceInput,
    stayPriceInput,
    tourPriceInput,
  ]);
  useQueryClient<VacationPackageTypes.VPCalculatePriceQuery>(CalculateVPPriceQuery, {
    variables: {
      input,
    },
    context: { headers: noCacheHeaders },
    skip: shouldSkipFetchingPrices,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    onCompleted: ({ calculateVacationPackagePrice }) => {
      const price = calculateVacationPackagePrice?.amount;
      if (price > 0) {
        const flightPrices = calculateVacationPackagePrice?.flightPrices;
        const carPrices = calculateVacationPackagePrice?.carPrices;
        const stayPrices = calculateVacationPackagePrice?.stayPrices;
        onSetVPPrice(price, carPrices, flightPrices, stayPrices);
      }
    },
    onError: () => {
      onResetPriceData();
    },
  });
};
