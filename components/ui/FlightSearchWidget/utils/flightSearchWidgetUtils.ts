import { isBefore } from "date-fns";
import memoizeOne from "memoize-one";

import { constructSelectedDatesFromQuery } from "components/ui/DatePicker/utils/datePickerUtils";
import { SupportedLanguages, Marketplace } from "types/enums";
import { isGtiCn } from "utils/apiUtils";

export const getSumOfValues = (values: FlightSearchTypes.Passengers) =>
  Object.values(values).reduce((sum, value) => sum + value);

export const getPassengerTitle = (passenger: string, t: TFunction) => {
  switch (passenger) {
    case "infants":
    case "infant":
      return t("Infants");
    case "children":
    case "child":
      return t("Children");
    default:
      return t("Adults");
  }
};
export const constructPassengerGroups = (passengers: FlightSearchTypes.Passengers, t: TFunction) =>
  Object.keys(passengers).map(passenger => {
    return {
      id: passenger,
      title: getPassengerTitle(passenger, t),
      passengerType: passenger as FlightSearchTypes.PassengerType,
      defaultValue: passenger === "adults" ? 1 : 0,
    };
  });

export const canIncrementPassengers = (
  count: number,
  passengers: FlightSearchTypes.Passengers,
  passengerType: FlightSearchTypes.PassengerType,
  totalPassengers: number
) => {
  if (passengerType === "infants") {
    return count < passengers.adults && totalPassengers < 9;
  }
  return totalPassengers < 9;
};

export const canDecrementPassengers = (
  count: number,
  passengerType: FlightSearchTypes.PassengerType,
  defaultValue: number,
  passengers: FlightSearchTypes.Passengers
) => {
  if (passengerType === "adults") {
    return count > passengers.infants && count > defaultValue;
  }
  return count > defaultValue;
};
export const constructCabinTypes = memoizeOne((t: TFunction) => [
  {
    id: "M",
    name: t("Economy"),
  },
  {
    id: "W",
    name: t("Premium Economy"),
  },
  {
    id: "C",
    name: t("Business"),
  },
  {
    id: "F",
    name: t("First class"),
  },
]);

export const constructFlightTypes = memoizeOne((t: TFunction) => [
  {
    id: "round",
    name: t("Round-trip"),
  },
  {
    id: "oneway",
    name: t("One-way"),
  },
]);

export const getReturnDates = (
  departureDates: SharedTypes.SelectedDates,
  returnDates: SharedTypes.SelectedDates
) => {
  const { from: dFrom } = departureDates;
  const { from: rFrom, to: rTo } = returnDates;
  if (dFrom && ((rFrom && dFrom >= rFrom) || (rTo && dFrom >= rTo))) {
    return {
      from: undefined,
      to: undefined,
    };
  }
  return returnDates;
};

export const getDepartureDates = (
  departureDates: SharedTypes.SelectedDates,
  returnDates: SharedTypes.SelectedDates
) => {
  const { from: dFrom } = departureDates;
  const { from: rFrom } = returnDates;
  if (rFrom && dFrom && rFrom < dFrom) {
    return {
      from: rFrom,
      to: undefined,
    };
  }
  return departureDates;
};

export const getInitialSelectedDates = (dateFrom?: string, dateTo?: string) => {
  if (dateFrom && isBefore(new Date(dateFrom), new Date().setHours(0, 0, 0, 0))) {
    return {
      from: undefined,
      to: undefined,
    };
  }
  return constructSelectedDatesFromQuery({
    dateFrom,
    dateTo,
  });
};

export const isNewSearch = (
  sameOrigin: boolean,
  sameDestination: boolean,
  sameFrom: boolean,
  sameTo: boolean,
  sameReturnFrom: boolean,
  sameReturnTo: boolean,
  sameAdults: boolean,
  sameChildren: boolean,
  sameInfants: boolean,
  sameCabin: boolean,
  sameType: boolean
) =>
  !(
    sameOrigin &&
    sameDestination &&
    sameFrom &&
    sameTo &&
    sameReturnFrom &&
    sameReturnTo &&
    sameAdults &&
    sameChildren &&
    sameInfants &&
    sameCabin &&
    sameType
  );

export const updateChineseLocaleFlightsQueryHeader = (activeLocale: string, marketplace: string) =>
  isGtiCn(marketplace as Marketplace, activeLocale as SupportedLanguages)
    ? {
        context: {
          headers: {
            "x-travelshift-language": SupportedLanguages.LegacyChinese,
          },
        },
      }
    : null;
