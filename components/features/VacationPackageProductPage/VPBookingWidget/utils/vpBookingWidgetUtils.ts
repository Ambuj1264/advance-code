import styled from "@emotion/styled";

import { getSelectedRoomTypes } from "../../utils/vacationPackageUtils";

import { constructFlightCartInput } from "components/features/Flight/utils/flightUtils";
import { constructGTECarRentalCartInput } from "components/features/Car/utils/carUtils";
import { getCondensedFlightItinerary } from "components/ui/FlightsShared/flightsSharedUtils";
import { getDuration } from "utils/helperUtils";
import { formatLocalizedUrl, getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import FlightIcon from "components/icons/plane-1.svg";
import {
  getTravelersFromOccupancies,
  getTotalNumberOfGuests,
} from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import { SupportedLanguages } from "types/enums";

export enum BookingWidgetView {
  Default,
  SearchStep,
}

export const getVPFooterPrice = (
  price: number,
  occupancies: StayBookingWidgetTypes.Occupancy[],
  { from, to }: SharedTypes.SelectedDates,
  t: TFunction
) => {
  if (price === 0 || !from || !to) {
    return "";
  }
  const numberOfTravelers = getTotalNumberOfGuests(occupancies);
  return t("Price for {numberOfTravelers} travelers", {
    numberOfTravelers,
  });
};

export const getSectionHeaderDate = (date: Date, locale: SupportedLanguages) => {
  const month = formatLocalizedUrl(
    date,
    locale,
    {
      month: "short",
    },
    "LLL"
  );
  const day = formatLocalizedUrl(
    date,
    locale,
    {
      day: "numeric",
    },
    "dd"
  );
  return `${month} ${day}`.replace(" ", "\n");
};

export const getExperiencesLabel = (
  vacationIncludesFlight: boolean,
  vacationIncludesCar: boolean,
  isArrivalDay: boolean,
  isDepartureDay: boolean
): string => {
  const shouldOfferTransfers =
    vacationIncludesFlight && !vacationIncludesCar && (isArrivalDay || isDepartureDay);

  if (shouldOfferTransfers) {
    return "Transfers and experiences";
  }
  return "Experiences";
};

const FlightIconFlipped = styled(FlightIcon)`
  transform: scale(-1, 1);
`;

export const constructFlightProductSpecs = ({
  itinerary,
  flightSearchT,
}: {
  itinerary: FlightSearchTypes.FlightItinerary;
  flightSearchT: TFunction;
}): SharedTypes.ProductSpec[] => {
  const { firstOutboundFlight, lastOutboundFlight, firstInboundFlight, lastInboundFlight } =
    getCondensedFlightItinerary(itinerary);
  const [outboundHours, outboundMinutes] = getDuration(
    itinerary.outboundRoute.totalDurationSec ?? 0
  );
  const [inboundHours, inboundMinutes] = getDuration(itinerary.inboundRoute?.totalDurationSec ?? 0);

  return [
    {
      Icon: FlightIcon,
      name: flightSearchT("Departure"),
      value: `${firstOutboundFlight?.timeOfDeparture} - ${lastOutboundFlight?.timeOfArrival}`,
      subtitle: flightSearchT("{hours}h {minutes}m", {
        hours: outboundHours,
        minutes: outboundMinutes,
      }),
    },
    ...(firstInboundFlight && lastInboundFlight
      ? [
          {
            Icon: FlightIconFlipped,
            name: flightSearchT("Return"),
            value: `${firstInboundFlight?.timeOfDeparture} - ${lastInboundFlight?.timeOfArrival}`,
            subtitle: flightSearchT("{hours}h {minutes}m", {
              hours: inboundHours,
              minutes: inboundMinutes,
            }),
          },
        ]
      : []),
  ];
};

export const constructVpAddToCartFlightData = ({
  vacationIncludesFlight,
  selectedFlight,
  passengers,
}: {
  vacationIncludesFlight: boolean;
  selectedFlight?: VacationPackageTypes.VacationFlightItinerary;
  passengers: FlightTypes.PassengerDetails[];
}): VacationPackageTypes.VpFlightAddToCartData | undefined => {
  if (vacationIncludesFlight && selectedFlight) {
    return {
      passengers,
      bookingToken: selectedFlight.id,
    };
  }

  return undefined;
};

export const constructVpAddToCartStaysData = ({
  selectedHotelsRooms,
}: {
  selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[];
}): StayBookingWidgetTypes.MutationAddStayProductToCartInput[] => {
  const selectedRooms = getSelectedRoomTypes(selectedHotelsRooms);
  return selectedRooms.map(selectedRoom => {
    return {
      productId: selectedRoom.productId,
      availabilityIds: selectedRoom.roomCombinations[0].availabilities
        .filter(availability => availability.isSelected)
        .map(availability => availability.availabilityId),
      isForVacationPackage: true,
    };
  });
};

export const constructVpAddToCartInput = ({
  vacationProductId,
  requestId,
  dateFrom,
  dateTo,
  occupancies,
  flightData,
  carData,
  staysData,
  selectedTours,
  originId,
  originName,
  originCountryCode,
  currencyCode,
  carPickupId,
}: VacationPackageTypes.VpAddToCartData): VacationPackageTypes.MutationAddVpToCartInput => {
  const { adults, children, infants } = getTravelersFromOccupancies(occupancies);
  return {
    id: vacationProductId,
    requestId,
    from: getFormattedDate(dateFrom!, yearMonthDayFormat),
    to: getFormattedDate(dateTo!, yearMonthDayFormat),
    adults,
    children,
    infants,
    paxMix: occupancies,
    flights: flightData?.bookingToken
      ? [
          constructFlightCartInput({
            passengers: flightData.passengers,
            bookingToken: flightData.bookingToken,
            currencyCode,
          }),
        ]
      : [],
    cars: carData ? [constructGTECarRentalCartInput(carData)] : undefined,
    stayProducts: staysData,
    toursAndTickets: selectedTours,
    originId,
    originName,
    originCountryCode,
    carPickupId,
  };
};
