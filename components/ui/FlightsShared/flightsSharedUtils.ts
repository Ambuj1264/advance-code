import { head, last } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { toUndefined, fromNullable, chain } from "fp-ts/lib/Option";
import { differenceInSeconds, parseISO } from "date-fns";

import {
  yearMonthDayFormat,
  getFormattedDate,
  shortMonthDayYearFormat,
  hourMinuteFormat,
} from "utils/dateUtils";
import { BagType } from "components/features/FlightSearchPage/types/flightEnums";

export const getFlightClassString = (
  t: TFunction,
  outbondRoute: FlightSearchTypes.Route,
  inboundRoute?: FlightSearchTypes.Route
) => {
  const flightClassInbound = inboundRoute?.flights.map(flight => t(flight.flightClass)) ?? [];
  const flightClassOutbound = outbondRoute?.flights.map(flight => t(flight.flightClass));
  return [...new Set([...flightClassInbound, ...flightClassOutbound])].join(" + ");
};

export const getCondensedFlightItinerary = (itinerary?: FlightSearchTypes.FlightItinerary) => {
  if (!itinerary) return {};

  return {
    firstOutboundFlight: pipe(head(itinerary.outboundRoute.flights), toUndefined),
    lastOutboundFlight: pipe(last(itinerary.outboundRoute.flights), toUndefined),
    firstInboundFlight: pipe(
      itinerary.inboundRoute,
      fromNullable,
      chain(route => head(route.flights)),
      toUndefined
    ),
    lastInboundFlight: pipe(
      itinerary.inboundRoute,
      fromNullable,
      chain(route => last(route.flights)),
      toUndefined
    ),
  };
};

export const getCondensedQueryFlightItinerary = (
  itinerary: FlightSearchTypes.QueryFlightItinerary
) => ({
  firstOutboundFlight: pipe(head(itinerary.outboundRoute), toUndefined),
  lastOutboundFlight: pipe(last(itinerary.outboundRoute), toUndefined),
  firstInboundFlight: pipe(
    itinerary.inboundRoute,
    fromNullable,
    chain(route => head(route)),
    toUndefined
  ),
  lastInboundFlight: pipe(
    itinerary.inboundRoute,
    fromNullable,
    chain(route => last(route)),
    toUndefined
  ),
});

export const getBagTitle = (bagType: BagType, count: number, t: TFunction) => {
  if (bagType === BagType.PERSONAL_ITEM) {
    return t("Personal item");
  }
  if (bagType === BagType.CABINBAG) {
    return t("Cabin bag");
  }
  if (count > 1) {
    return t("{count}x Checked bag", {
      count,
    });
  }
  return t("Checked bag");
};

export const constructSearchUrl = ({
  searchUrl,
  adults,
  children,
  infants,
  dateFrom,
  returnDateFrom,
  flightType,
  origin,
  originId,
  destination,
  destinationId,
  cabinType,
  cartItemId,
}: FlightTypes.SearchUrl) => {
  const formattedDateFrom = getFormattedDate(dateFrom, yearMonthDayFormat);
  const formattedReturnDateFrom = returnDateFrom
    ? getFormattedDate(returnDateFrom, yearMonthDayFormat)
    : undefined;
  return `${searchUrl}?adults=${adults}&children=${children}&infants=${infants}&dateFrom=${formattedDateFrom}${
    returnDateFrom ? `&returnDateFrom=${formattedReturnDateFrom}` : ""
  }&destinationId=${destinationId}&destinationName=${destination}&originId=${originId}&originName=${origin}&flightType=${flightType}&cabinType=${cabinType}&maxStops=any${
    cartItemId ? `&cartItemId=${cartItemId}` : ""
  }`;
};

export const getCabinType = (flightClass: string) => {
  switch (flightClass) {
    case "First Class":
      return "F";
    case "Business":
      return "C";
    case "Economy Premium":
      return "W";
    default:
      return "M";
  }
};

export const getFlightClass = (cabinType: FlightSearchTypes.CabinType, t: TFunction) => {
  switch (cabinType) {
    case "F":
      return t("First Class");
    case "C":
      return t("Business");
    case "W":
      return t("Premium Economy");
    default:
      return t("Economy");
  }
};

export const constructRoute = (
  route: FlightSearchTypes.QueryRoute[],
  nightsInDestination?: number
) => ({
  flights: route.map((flight, index) => ({
    id: `${flight.airline.code}${flight.flightNumber}`,
    flightNumber: `${flight.airline.code}${flight.flightNumber}`,
    destination: flight.cityTo.name,
    destinationAirport: flight.flyTo.name,
    destinationAirportCode: flight.flyTo.code,
    origin: flight.cityFrom.name,
    originAirport: flight.flyFrom.name,
    originAirportCode: flight.flyFrom.code,
    originId: flight.flyFrom.code,
    destinationId: flight.flyTo.code,
    dateOfDeparture: getFormattedDate(parseISO(flight.localDeparture), shortMonthDayYearFormat),
    dateOfArrival: getFormattedDate(parseISO(flight.localArrival), shortMonthDayYearFormat),
    timeOfDeparture: getFormattedDate(parseISO(flight.localDeparture), hourMinuteFormat),
    timeOfArrival: getFormattedDate(parseISO(flight.localArrival), hourMinuteFormat),
    localArrival: flight.localArrival,
    localDeparture: flight.localDeparture,
    layoverTimeInSec: flight.layOverSec === 0 ? undefined : flight.layOverSec,
    nightsInDestination: index === route.length - 1 ? nightsInDestination : undefined,
    flightClass: flight.flightClass,
    airline: flight.airline,
    durationInSec: flight.durationSec,
    bagsRecheckRequired: flight.bagsRecheckRequired,
    guarantee: flight.guarantee,
  })),
  numberOfStops: route?.length,
});

export const constructFlightItinerary = ({
  selected,
  id,
  linkUrl,
  clientRoute,
  price,
  totalDurationSec,
  nightsInDestination,
  isOneway,
  inboundDurationSec,
  outboundDurationSec,
  outboundRoute,
  numberOfPassengers,
  inboundRoute,
}: {
  selected?: boolean;
  id: string;
  linkUrl?: string;
  clientRoute?: SharedTypes.ClientRoute;
  price: number;
  totalDurationSec: number;
  nightsInDestination: number;
  isOneway: boolean;
  inboundDurationSec: number;
  outboundDurationSec: number;
  outboundRoute: FlightSearchTypes.QueryRoute[];
  numberOfPassengers: number;
  inboundRoute?: FlightSearchTypes.QueryRoute[];
}) => ({
  selected,
  id,
  linkUrl,
  clientRoute,
  price,
  totalDurationSec,
  nightsInDestination: isOneway ? undefined : nightsInDestination,
  inboundRoute:
    !isOneway && inboundRoute && inboundRoute.length > 0
      ? {
          ...constructRoute(inboundRoute),
          totalDurationSec: inboundDurationSec,
          airlines: inboundRoute.map(flight => flight.airline),
        }
      : undefined,
  outboundRoute: {
    ...constructRoute(outboundRoute, isOneway ? undefined : nightsInDestination),
    totalDurationSec: outboundDurationSec,
    airlines: outboundRoute.map(flight => flight.airline),
  },
  numberOfPassengers,
});

export const isExpiredFlight = (expiredTime?: string) => {
  const expiredTimeDifference = expiredTime
    ? differenceInSeconds(new Date(expiredTime), Date.now())
    : undefined;
  return {
    isExpiredOffer: expiredTimeDifference !== undefined && expiredTimeDifference <= 0,
    expiredTimeDifference,
  };
};

export const constructFlightTitle = ({
  isRound,
  origin,
  destination,
  t,
}: {
  isRound: boolean;
  origin: string;
  destination: string;
  t: TFunction;
}) =>
  isRound
    ? t("{origin} to {destination} and back", {
        origin,
        destination,
      })
    : t("{origin} to {destination}", {
        origin,
        destination,
      });
