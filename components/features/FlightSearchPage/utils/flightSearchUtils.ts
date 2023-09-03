import { head, last, filter as listFilter, range } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { toUndefined, map } from "fp-ts/lib/Option";
import { parseUrl } from "use-query-params";
import { addDays, addYears, isBefore, subWeeks } from "date-fns";
import memoizeOne from "memoize-one";

import { FlightSearchQueryParamsType, FlightSearchQueryParam } from "./useFlightSearchQueryParams";

import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import { PageType, GraphCMSPageType, FilterType } from "types/enums";
import { urlToRelative } from "utils/apiUtils";
import {
  constructFlightItinerary,
  getCabinType,
  constructFlightTitle,
} from "components/ui/FlightsShared/flightsSharedUtils";
import { getPriceSelectedFilter } from "components/ui/Filters/utils/filtersUtils";
import { isDateInPast } from "components/ui/DatePicker/utils/datePickerUtils";

export const INFANT_MAX_AGE_DEFAULT = 2;
export const CHILDREN_MAX_AGE_DEFAULT = 11;

export const doesFlightSearchHaveFilters = ({
  originId,
  destinationId,
  dateFrom,
}: FlightSearchQueryParamsType) => Boolean(originId && destinationId && dateFrom);

export const constructFlightProductUrl = ({
  productUrl,
  bookingToken,
  adults,
  children,
  infants,
  originId,
  origin,
  destinationId,
  destination,
  dateFrom,
  returnDateFrom,
  cabinType,
  cartItemId,
}: {
  productUrl: string;
  bookingToken: string;
  adults?: number;
  children?: number;
  infants?: number;
  originId: string;
  origin: string;
  destinationId: string;
  destination: string;
  dateFrom: string;
  returnDateFrom?: string;
  cabinType: string;
  cartItemId?: string;
}) =>
  `${productUrl}/details?adults=${adults || 1}${children ? `&children=${children}` : ""}${
    infants ? `&infants=${infants}` : ""
  }&bookingToken=${bookingToken}&originId=${originId}&origin=${origin}&destinationId=${destinationId}&destination=${destination}&dateFrom=${dateFrom}${
    returnDateFrom ? `&returnDateFrom=${returnDateFrom}&flightType=round` : "&flightType=oneway"
  }&cabinType=${cabinType}${cartItemId ? `&cartItemId=${cartItemId}` : ""}`;

export const getTotalNumberOfPassengers = ({
  adults = 0,
  children = 0,
  infants = 0,
}: {
  adults?: number;
  children?: number;
  infants?: number;
}) => adults + children + infants;

export const constructFlightItineraries = (
  isOneway: boolean,
  productUrl: string,
  t: TFunction,
  adults?: number,
  children?: number,
  infants?: number,
  flightSearchData?: FlightSearchTypes.QueryFlightItinerary[],
  cartItemId?: string
) =>
  flightSearchData?.map(
    ({
      selected,
      bookingToken,
      price,
      totalDurationSec,
      nightsInDestination,
      inboundDurationSec,
      outboundDurationSec,
      inboundRoute,
      outboundRoute,
    }) => {
      const { cityFrom, flyFrom, localDeparture } = outboundRoute[0];
      const { cityTo: destinationCityTo, flyTo: destinationFlyTo } =
        outboundRoute[outboundRoute.length - 1];
      const linkUrl = constructFlightProductUrl({
        productUrl,
        bookingToken,
        adults,
        children,
        infants,
        originId: flyFrom.code,
        origin: cityFrom.name,
        destinationId: destinationFlyTo.code,
        destination: destinationCityTo.name,
        dateFrom: getFormattedDate(new Date(localDeparture), yearMonthDayFormat),
        returnDateFrom:
          inboundRoute && inboundRoute.length > 0
            ? getFormattedDate(new Date(inboundRoute[0].localDeparture), yearMonthDayFormat)
            : undefined,
        cabinType: getCabinType(outboundRoute[0].flightClass),
        cartItemId,
      });
      const { query } = parseUrl(linkUrl);
      return constructFlightItinerary({
        selected,
        id: bookingToken,
        linkUrl,
        clientRoute: {
          query: {
            ...query,
            title: constructFlightTitle({
              isRound: !isOneway,
              origin: cityFrom.name,
              destination: destinationCityTo.name,
              t,
            }),
          },
          route: `/${PageType.FLIGHT}`,
          as: urlToRelative(linkUrl),
        },
        price,
        totalDurationSec,
        nightsInDestination,
        inboundRoute,
        inboundDurationSec,
        outboundRoute,
        outboundDurationSec,
        isOneway,
        numberOfPassengers: getTotalNumberOfPassengers({
          adults,
          children,
          infants,
        }),
      });
    }
  ) ?? [];

const constructFilter = (filter: FlightSearchTypes.FlightRangeFilter[]) => ({
  min: pipe(
    filter,
    listFilter(currentValue => currentValue.count > 0),
    head,
    map(({ minValue }) => minValue),
    toUndefined
  )!,
  max: pipe(
    filter,
    listFilter(currentValue => currentValue.count > 0),
    last,
    map(({ maxValue }) => maxValue),
    toUndefined
  )!,
  filters: filter
    .filter(currentValue => currentValue.count > 0)
    .map(({ maxValue, count }) => ({
      id: maxValue.toString(),
      count,
    })),
});

export const constructFlightSearchFilters = (
  flightFilters: FlightSearchTypes.FlightSearchFilters
) => ({
  priceFilters: constructFilter(flightFilters.price),
  durationFilters: constructFilter(flightFilters.durationSec),
  stopoverFilters: constructFilter(flightFilters.lengthOfLayoverSec),
});

export const getFlightPageType = (marketplaceUrl: string) => {
  const isGTI = marketplaceUrl?.includes("guidetoiceland");
  const isGTTP = marketplaceUrl?.includes("guidetothephilippines");
  if (isGTI) return GraphCMSPageType.GTIFlights;
  if (isGTTP) return GraphCMSPageType.GTTPFlights;
  return GraphCMSPageType.Flights;
};
export const getFlightQueryCondition = (marketplaceUrl: string, uri?: string) => ({
  pageType: getFlightPageType(marketplaceUrl),
  metadataUri: uri,
  isDeleted: false,
});

export const getStopsFilterList = (t: TFunction) => [
  {
    id: "any",
    name: t("Any"),
    checked: false,
  },
  {
    id: "0",
    name: t("Nonstop (direct)"),
    checked: false,
  },
  {
    id: "1",
    name: t("Up to 1 stop"),
    checked: false,
  },
  {
    id: "2",
    name: t("Up to 2 stops"),
    checked: false,
  },
];

export const getFlightSearchQueryVariables = ({
  originId,
  destinationId,
  adults,
  children,
  infants,
  cabinType,
  flightType,
  priceFrom,
  priceTo,
  durationFromSec,
  durationToSec,
  layoverLengthFromSec,
  layoverLengthToSec,
  searchId,
  departureDateFrom,
  returnDateFrom,
  orderBy,
  offset,
  departureTo,
  returnTo,
  maxNumberOfStops,
}: FlightSearchTypes.FlightSearchVariables) => ({
  originId,
  destinationId,
  adults,
  children,
  infants,
  cabinType,
  flightType,
  priceFrom,
  priceTo,
  durationFromSec,
  durationToSec,
  layoverLengthFromSec,
  layoverLengthToSec,
  searchId,
  departureDateFrom,
  returnDateFrom,
  orderBy,
  offset,
  departureTo,
  returnTo,
  maxNumberOfStops,
});

export const flightSortParameters = () => [
  { orderBy: "BEST", orderDirection: "desc" },
  { orderBy: "PRICE_FROM", orderDirection: "asc" },
  { orderBy: "PRICE_TO", orderDirection: "desc" },
  { orderBy: "DURATION_SHORTEST", orderDirection: "asc" },
];

export const getFlightSelectedFilters = (
  currencyCode: string,
  convertCurrency: (value: number) => number,
  price?: string[],
  duration?: string[],
  stopover?: string[]
) => {
  const selectedPrice = getPriceSelectedFilter(
    FlightSearchQueryParam.PRICE,
    currencyCode,
    convertCurrency,
    price
  );
  const selectedDuration = duration
    ? {
        sectionId: FlightSearchQueryParam.DURATION,
        value: duration,
        name: `${Math.ceil(Number(duration[0]) / 3600)}-${Math.ceil(
          Number(duration[1]) / 3600
        )} hours`,
        queryParamList: duration,
        filterType: FilterType.RANGE,
      }
    : undefined;
  const selectedStopover = stopover
    ? {
        sectionId: FlightSearchQueryParam.STOPOVER,
        value: stopover,
        name: `${Math.ceil(Number(stopover[0]) / 3600)}-${Math.ceil(
          Number(stopover[1]) / 3600
        )} hour stopover`,
        queryParamList: stopover,
        filterType: FilterType.RANGE,
      }
    : undefined;
  return [
    ...(selectedPrice ? [selectedPrice] : []),
    ...(selectedDuration ? [selectedDuration] : []),
    ...(selectedStopover ? [selectedStopover] : []),
  ];
};

export const getInitialPassengers = (adults: number, children: number, infants: number) => {
  const totalPassengers = adults + children + infants;
  if (totalPassengers > 9) {
    const passengersToRemove = totalPassengers - 9;
    return range(1, passengersToRemove).reduce(
      passengers => {
        const { adults: adultPass, children: childPass, infants: infantPass } = passengers;
        const shouldRemoveInfant = infantPass > 1;
        const shouldRemoveChild = !shouldRemoveInfant && childPass > 1;
        const shouldRemoveAdult = !shouldRemoveInfant && !shouldRemoveChild;
        return {
          adults: shouldRemoveAdult ? adultPass - 1 : adultPass,
          children: shouldRemoveChild ? childPass - 1 : childPass,
          infants: shouldRemoveInfant ? infantPass - 1 : infantPass,
        };
      },
      { adults, children, infants }
    );
  }
  return { adults, children, infants };
};

export const getFlightMinMaxDates = memoizeOne(() => {
  const browserDate = new Date();
  return {
    unavailableDates: [],
    min: browserDate,
    max: subWeeks(addYears(browserDate, 1), 1),
  };
});

export const getFlightDatesInFuture = (
  dateFrom?: string,
  dateTo?: string,
  returnDateFrom?: string,
  returnDateTo?: string
) => {
  const fromDate = dateFrom ? new Date(dateFrom) : undefined;
  const returnFromDate = returnDateFrom ? new Date(returnDateFrom) : undefined;
  const toDate = dateTo ? new Date(dateTo) : undefined;
  const returnToDate = returnDateTo ? new Date(returnDateTo) : undefined;
  const isFromDateInPast = isDateInPast(fromDate);
  const fromValue = isFromDateInPast ? addDays(new Date(), 1) : fromDate;
  const isReturnFromDateInvalid =
    fromValue && returnFromDate && isBefore(returnFromDate, fromValue);
  const returnFromValue = isReturnFromDateInvalid
    ? addDays(new Date(fromValue!), 1)
    : returnFromDate;
  const isToDateInvalid = fromValue && toDate && isBefore(toDate, fromValue);
  const toValue = isToDateInvalid ? fromValue : toDate;
  const isReturnToDateInvalid = toValue && returnToDate && isBefore(returnToDate, toValue);
  const returnToValue = isReturnToDateInvalid ? addDays(toValue!, 1) : returnToDate;
  return {
    fromDate: fromValue ? getFormattedDate(fromValue, yearMonthDayFormat) : undefined,
    returnFromDate: returnFromValue
      ? getFormattedDate(returnFromValue, yearMonthDayFormat)
      : undefined,
    toDate: toValue ? getFormattedDate(toValue, yearMonthDayFormat) : undefined,
    returnToDate: returnToValue ? getFormattedDate(returnToValue, yearMonthDayFormat) : undefined,
  };
};
