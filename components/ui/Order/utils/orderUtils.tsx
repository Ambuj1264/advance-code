import React from "react";
import { head } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { toUndefined } from "fp-ts/lib/Option";
import { addHours, differenceInCalendarDays } from "date-fns";
import { parseUrl } from "use-query-params";

import OrderOpeningHours from "../OrderOpeningHours";

import {
  getTotalTravelers,
  getGuidedLanguageName,
} from "components/features/GTETourProductPage/GTETourBookingWidget/utils/gteTourBookingWidgetUtils";
import { capitalize } from "utils/globalUtils";
import {
  getTravelerText,
  getHttpsUrl,
  getAgeBandsText,
  decodeHtmlEntity,
  isNullOrUndefined,
  removeHTMLCharactersFromText,
} from "utils/helperUtils";
import { getSearchPageLink } from "components/ui/CarSearchWidget/utils/carSearchWidgetUtils";
import {
  AccommodationFilterQueryParam,
  CarProvider,
  FilterQueryEnum,
  OrderBy,
  PageType,
  SupportedLanguages,
  TourType,
  TourTypes,
} from "types/enums";
import TourRoute from "components/icons/tour-route.svg";
import DayTourIcon from "components/icons/traveler.svg";
import {
  constructFlightItinerary,
  constructSearchUrl,
  getBagTitle,
  getCabinType,
  getCondensedFlightItinerary,
  getCondensedQueryFlightItinerary,
  constructFlightTitle,
} from "components/ui/FlightsShared/flightsSharedUtils";
import {
  encodeAccomodationQueryParams,
  encodeTourQueryParams,
} from "components/ui/FrontSearchWidget/utils/frontUtils";
import { FrontSearchStateContext } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import { getProductSlugFromHref } from "utils/routerUtils";
import {
  getFormattedDate,
  hourMinuteFormat,
  shortMonthDayYearFormat,
  toLocalizedLongDateFormat,
  yearMonthDayFormat,
  convertDateStringIntoTimezoneAgnosticDate,
  shortMonthDayFormat,
  toDateWithoutTimezone,
  formatLocalizedUrl,
} from "utils/dateUtils";
import { BagType } from "components/features/FlightSearchPage/types/flightEnums";
import {
  getDriverAgeFromLocalStorage,
  getDriverCountryFromLocalStorage,
} from "utils/localStorageUtils";
import {
  constructCarProductUrl,
  getFormattedPriceValue,
  getCarnectKey,
  getTranslationByKey,
} from "utils/sharedCarUtils";
import {
  getIncludedCancellation,
  getIncludedMeal,
} from "components/features/StayProductPage/StayBookingWidget/utils/stayBookingWidgetUtils";
import {
  MealType,
  OrderStayCancellationType,
} from "components/features/StayProductPage/StayBookingWidget/types/enums";
import { GTETourGuidedLanguageType } from "components/features/GTETourProductPage/GTETourBookingWidget/types/enums";
import lazyCaptureException from "lib/lazyCaptureException";

export enum carExtrasIdMap {
  ADDITIONAL_DRIVER = "5",
}

export const constructCartFlightItinerary = (
  flight: OrderTypes.QueryFlightItineraryCart,
  flightT: TFunction,
  flightSearchBaseUrl?: string,
  cartItemId?: string
) => {
  const { firstOutboundFlight, lastInboundFlight, lastOutboundFlight } =
    getCondensedQueryFlightItinerary(flight);
  const linkUrl =
    flightSearchBaseUrl && firstOutboundFlight && lastOutboundFlight
      ? constructSearchUrl({
          searchUrl: flightSearchBaseUrl,
          adults: flight.adults,
          children: flight.children,
          infants: flight.infants,
          dateFrom: new Date(firstOutboundFlight.localDeparture),
          returnDateFrom:
            lastInboundFlight?.localArrival !== undefined
              ? new Date(lastInboundFlight.localArrival)
              : undefined,
          origin: firstOutboundFlight.cityFrom.name,
          originId: firstOutboundFlight.flyFrom.code,
          destination: lastOutboundFlight.cityTo.name,
          destinationId: lastOutboundFlight.flyTo.code,
          cabinType: getCabinType(firstOutboundFlight.flightClass),
          flightType: lastInboundFlight ? "round" : "oneway",
          cartItemId,
        })
      : undefined;

  const title = constructFlightTitle({
    isRound: Boolean(lastInboundFlight),
    origin: firstOutboundFlight!.cityFrom.name,
    destination: lastOutboundFlight!.cityTo.name,
    t: flightT,
  });

  return {
    title,
    ...constructFlightItinerary({
      ...flight,
      linkUrl: linkUrl || undefined,
      clientRoute: linkUrl
        ? {
            query: parseUrl(linkUrl).query,
            route: `/${PageType.FLIGHTSEARCH}`,
            as: linkUrl,
          }
        : undefined,
      isOneway: lastInboundFlight === undefined,
    }),
  };
};

export const constructCartFlights = (
  queryFlights: OrderTypes.QueryFlightItineraryCart[],
  flightT: TFunction,
  flightSearchBaseUrl?: string
) =>
  queryFlights.map(flight => ({
    ...flight,
    ...constructCartFlightItinerary(flight, flightT, flightSearchBaseUrl, flight.cartItemId),
  }));

export const constructFlightsBagsServiceDetails = (
  flight: OrderTypes.CartFlightItinerary,
  orderT: TFunction
) =>
  flight.baggage.length > 0
    ? [
        {
          label: orderT("Bags"),
          values: flight.baggage.map(
            bag =>
              `${bag.count}x ${getBagTitle(bag.category as BagType, 0, orderT)}: ${bag.length} × ${
                bag.width
              } × ${bag.height} cm - ${bag.weight} kg`
          ),
        },
      ]
    : [];

export const constructFlightServiceDetails = ({
  flight,
  orderT,
  activeLocale,
}: {
  flight: OrderTypes.CartFlightItinerary;
  orderT: TFunction;
  activeLocale: SupportedLanguages;
}) => {
  const { firstOutboundFlight, lastOutboundFlight, firstInboundFlight, lastInboundFlight } =
    getCondensedFlightItinerary(flight);

  return {
    title: orderT("Service details"),
    sections: [
      ...(flight.nightsInDestination
        ? [
            {
              label: orderT("Duration"),
              values: [
                orderT("{nightsInDestination} nights in {destination}", {
                  nightsInDestination: flight.nightsInDestination,
                  destination: lastOutboundFlight!.destination,
                }),
              ],
            },
          ]
        : []),
      {
        label: orderT("Travellers"),
        values: [
          orderT("{totalTravellers} travellers", {
            totalTravellers: flight.numberOfPassengers,
          }),
        ],
      },
      {
        label: orderT("Departure"),
        values: [
          toLocalizedLongDateFormat(new Date(firstOutboundFlight!.localDeparture), activeLocale, {
            hourCycle: "h23",
          }),
        ],
      },
      {
        label: orderT("Depart from"),
        values: [
          `${firstOutboundFlight?.originAirport} (${firstOutboundFlight?.originAirportCode})`,
        ],
      },
      {
        label: orderT("Arrival"),
        values: [
          toLocalizedLongDateFormat(new Date(lastOutboundFlight!.localArrival), activeLocale, {
            hourCycle: "h23",
          }),
        ],
      },
      {
        label: orderT("Arrive to"),
        values: [
          `${lastOutboundFlight?.destinationAirport} (${lastOutboundFlight?.destinationAirportCode})`,
        ],
      },
      ...(firstInboundFlight && lastInboundFlight
        ? [
            {
              label: orderT("Return"),
              values: [
                toLocalizedLongDateFormat(
                  new Date(firstInboundFlight!.localDeparture),
                  activeLocale,
                  {
                    hourCycle: "h23",
                  }
                ),
              ],
            },
            {
              label: orderT("Return from"),
              values: [
                `${firstInboundFlight?.originAirport} (${firstInboundFlight?.originAirportCode})`,
              ],
            },
            {
              label: orderT("Arrival"),
              values: [
                toLocalizedLongDateFormat(new Date(lastInboundFlight!.localArrival), activeLocale, {
                  hourCycle: "h23",
                }),
              ],
            },
            {
              label: orderT("Arrive to"),
              values: [
                `${lastInboundFlight?.destinationAirport} (${lastInboundFlight?.destinationAirportCode})`,
              ],
            },
          ]
        : []),
      ...constructFlightsBagsServiceDetails(flight, orderT),
    ],
  };
};

export const constructVoucherPriceLabels = (
  voucherPriceObjects?: VoucherTypes.VoucherPriceObject[] | null,
  isVat?: boolean
) => {
  if (!voucherPriceObjects || voucherPriceObjects.length === 0) return "";
  return voucherPriceObjects.reduce((priceLabel, priceObject) => {
    const { price, priceDisplayValue, currency } = isVat
      ? priceObject.vatPriceObject || {}
      : priceObject.priceObject || {};
    if (price > 0) {
      return `${priceLabel}${priceLabel.length > 0 ? " + " : ""}${priceDisplayValue} ${currency}`;
    }
    return priceLabel;
  }, "");
};

type VoucherPaymentTypeBasic = {
  orderT: TFunction;
  vatAmount?: number;
  vatPercentage?: number;
  shouldShowVat?: boolean;
};

type VoucherPaymentTypeInCard = VoucherPaymentTypeBasic & {
  isCartInfo: true;
  priceObject: SharedTypes.PriceObject;
  voucherPriceObjects?: null;
};

type VoucherPaymentTypeInVoucher = VoucherPaymentTypeBasic & {
  isCartInfo?: false;
  voucherPriceObjects: VoucherTypes.VoucherPriceObject[];
  priceObject?: null;
};

export const constructPaymentDetails = ({
  orderT,
  vatAmount,
  vatPercentage,
  shouldShowVat = true,
  isCartInfo = false,
  priceObject,
  voucherPriceObjects,
}: VoucherPaymentTypeInCard | VoucherPaymentTypeInVoucher) => {
  if (!isCartInfo && !priceObject && !voucherPriceObjects) {
    lazyCaptureException(new Error("no payment data is available for the voucher"), {
      errorInfo: {
        voucherPriceObjects,
        priceObject,
      },
    });
  }

  const priceLabel = isCartInfo
    ? getFormattedPriceValue(priceObject)
    : constructVoucherPriceLabels(voucherPriceObjects);
  const vatPriceLabel = constructVoucherPriceLabels(voucherPriceObjects, true);
  return {
    title: orderT("Payment details"),
    sections: [
      {
        label: orderT(`${isCartInfo ? "Item price" : "Total price"}`),
        values: [priceLabel],
        ...(shouldShowVat && !vatAmount && !vatPercentage
          ? {
              subtitles: [null],
            }
          : {}),
        ...(shouldShowVat && vatPercentage && vatPriceLabel !== ""
          ? {
              subtitles: [
                {
                  label: orderT(`Inclusive of VAT (${vatPercentage}%):`),
                  values: [vatPriceLabel],
                },
              ],
            }
          : {}),
      },
    ],
  };
};

export const getTourDuration = ({ from, to }: { from: Date; to: Date }) => {
  const nightsDuration = differenceInCalendarDays(to, from);

  return {
    daysDuration: nightsDuration + 1,
    nightsDuration,
  };
};

export const constructTourServiceDetails = ({
  tour,
  orderT,
  tourVoucherInfo,
}: {
  tour: OrderTypes.Tour;
  orderT: TFunction;
  tourVoucherInfo?: {
    provider?: VoucherTypes.VoucherQueryTourProvider | null;
  };
}): OrderTypes.VoucherProduct => {
  const { daysDuration, nightsDuration } = getTourDuration(tour);
  const isMultiDayTour = tour.type === TourType.MultiDay;

  const shouldAddAccommodationSection = isMultiDayTour
    ? tour?.extras.some(extra => extra.name === "Accommodation")
    : false;

  const tourExtras = tour.extras?.map(tourExtraItem => {
    const { name, answer, answers: tourAnswers } = tourExtraItem;
    let value = answer ?? "";
    const answers = tourAnswers ?? [];
    const separator = value !== "" ? "," : "";

    if (name === "Car") {
      value += `${separator} ${orderT("{numberOfDays} day rental", {
        numberOfDays: daysDuration,
      })}`;
    }

    if (name === "Accommodation" && !isMultiDayTour) {
      value += `, ${orderT("{totalNights} nights", {
        totalNights: nightsDuration,
      })}`;
    }

    value += answers.length > 0 ? `${separator} ${answers.join(", ")}` : "";

    return {
      label: name,
      values: [value],
      isExtras: true,
    };
  });

  const whatToBringItems = tour.whatToBringItems
    ?.map(whatToBringItem => whatToBringItem.name)
    .join(", ");

  return {
    title: orderT("Service details"),
    sections: [
      {
        label: orderT("Duration"),
        values: [tour.durationText],
      },
      {
        label: orderT("Travellers"),
        values: [
          getTravelerText(
            {
              adults: tour.adults,
              teenagers: tour.teenagers,
              children: tour.children,
            },
            orderT
          ),
        ],
      },
      {
        label: orderT("Starts"),
        values: [
          orderT("{date} at {time}", {
            date: getFormattedDate(tour.from, shortMonthDayYearFormat),
            time: getFormattedDate(tour.from, hourMinuteFormat),
          }),
        ],
      },
      {
        label: orderT("Ends"),
        values: [
          orderT("{date} at {time}", {
            date: getFormattedDate(tour.to, shortMonthDayYearFormat),
            time: getFormattedDate(tour.to, hourMinuteFormat),
          }),
        ],
      },
      ...(!isNullOrUndefined(tourVoucherInfo?.provider)
        ? [
            {
              label: orderT("Product provider"),
              values: [tourVoucherInfo?.provider?.name],
            },
            {
              label: orderT("Emergency phone"),
              values: [tourVoucherInfo?.provider?.phoneNumber],
            },
          ]
        : []),
      ...(tour.startingLocation
        ? [
            {
              label: orderT("Starting location"),
              values: [tour.startingLocation.locationName],
            },
          ]
        : []),
      ...(tour.departurePoint
        ? [
            {
              label: orderT("Departure location"),
              values: [tour.departurePoint],
            },
          ]
        : []),
      ...(tour.endingLocation
        ? [
            {
              label: orderT("Ending location"),
              values: [tour.endingLocation.locationName],
            },
          ]
        : []),
      ...(tour.pickupLocation
        ? [
            {
              label: orderT("Pickup"),
              values: [tour.pickupLocation],
            },
          ]
        : []),
      ...(tour.departureInformation
        ? [
            {
              label: orderT("Departure information"),
              values: [tour.departureInformation],
            },
          ]
        : []),
      ...tourExtras,
      ...(whatToBringItems
        ? [
            {
              label: orderT("What to bring"),
              values: [whatToBringItems],
            },
          ]
        : []),
      ...(shouldAddAccommodationSection
        ? [
            {
              label: orderT("Accommodation"),
              values: [
                orderT("{totalNights} nights", {
                  totalNights: nightsDuration,
                }),
              ],
            },
          ]
        : []),
    ],
  };
};

export const constructVoucherSections = (sections: OrderTypes.VoucherSection[] = []) => {
  return sections.reduce(
    (acc, section) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      !section.isExtras ? acc.main.push(section) : acc.extra.push(section);

      return acc;
    },
    { main: [], extra: [] } as {
      main: OrderTypes.VoucherSection[];
      extra: OrderTypes.VoucherSection[];
    }
  );
};

export const constructGTETourServiceDetails = ({
  tour,
  orderT,
  tourVoucherInfo,
}: {
  tour: OrderTypes.GTETour;
  orderT: TFunction;
  tourVoucherInfo?: {
    provider?: VoucherTypes.VoucherQueryTourProvider;
  };
}): OrderTypes.VoucherProduct => {
  const tourSelectedOption = tour.option?.title;
  const tourExtras = tour.extras?.map((tourExtraItem: OrderTypes.QueryToursExtras) => {
    const { name } = tourExtraItem;
    return {
      label: "Included",
      values: [capitalize(name)],
    };
  });
  const bookingQuestions = tour.bookingQuestionAnswers
    .filter(
      (question: GTETourBookingWidgetTypes.MutationBookingQuestionAnswer) =>
        question.travelerNum === null && question.answer !== ""
    )
    .map((question: GTETourBookingWidgetTypes.MutationBookingQuestionAnswer) => {
      const { label, answer } = question;
      return {
        label,
        values: [answer],
      };
    });
  return {
    title: orderT("Service details"),
    sections: [
      ...(tour.durationText
        ? [
            {
              label: orderT("Duration"),
              values: [tour.durationText],
            },
          ]
        : []),
      {
        label: orderT("Travellers"),
        values: [getAgeBandsText(tour.paxMix, orderT)],
      },
      {
        label: orderT("Starts"),
        values: [
          orderT(`${getFormattedDate(tour.from, shortMonthDayFormat)} at ${tour.startTime}`),
        ],
      },
      ...(tourVoucherInfo?.provider !== undefined
        ? [
            {
              label: orderT("Product provider"),
              values: [tourVoucherInfo?.provider?.name],
            },
            {
              label: orderT("Emergency phone"),
              values: [tourVoucherInfo?.provider?.phoneNumber],
            },
          ]
        : []),
      ...(tour.startingLocation
        ? [
            {
              label: orderT("Starting location"),
              values: [tour.startingLocation.locationName],
            },
          ]
        : []),
      ...(tour.endingLocation
        ? [
            {
              label: orderT("Ending location"),
              values: [tour.endingLocation.locationName],
            },
          ]
        : []),
      ...(tour.languageGuide
        ? [
            {
              label: orderT("Guided language"),
              values: [
                getGuidedLanguageName(
                  tour.languageGuide?.language ?? "",
                  orderT,
                  tour.languageGuide?.type as GTETourGuidedLanguageType
                ),
              ],
            },
          ]
        : []),
      ...(tourSelectedOption
        ? [
            {
              label: orderT("Included"),
              values: [tourSelectedOption],
            },
          ]
        : []),
      ...tourExtras,
      ...bookingQuestions,
    ],
  };
};

export const parseCartItemId = (cartItemId?: string) =>
  cartItemId ? Number(cartItemId.replace(/[^0-9.]/g, "")) : undefined;

export const constructCartTours = (queryTours?: OrderTypes.QueryTour[]): OrderTypes.Tour[] => {
  if (!queryTours?.length) return [];

  return queryTours.map(queryTour => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tourId, adults, teenagers, children, ...restQueryTour } = queryTour;
    const { linkUrl } = queryTour;
    const cartItemIdParsed = parseCartItemId(queryTour.cartItemId);

    return {
      ...restQueryTour,
      title: decodeHtmlEntity(restQueryTour.title),
      id: String(queryTour.tourId),
      from: convertDateStringIntoTimezoneAgnosticDate(queryTour.from as string),
      to: convertDateStringIntoTimezoneAgnosticDate(queryTour.to as string),
      updated: convertDateStringIntoTimezoneAgnosticDate(queryTour.updated as string),
      createdTime: convertDateStringIntoTimezoneAgnosticDate(queryTour.createdTime as string),
      numberOfTravelers: queryTour.adults + queryTour.children + queryTour.teenagers,
      editLinkUrl: `${linkUrl}?cart_item=${cartItemIdParsed}&adults=${adults}${
        children ? `&children=${children}` : ""
      }${teenagers ? `&teenagers=${teenagers}` : ""}`,
      clientRoute: {
        query: {
          ...parseUrl(linkUrl).query,
          slug: getProductSlugFromHref(linkUrl),
        },
        route: `/${PageType.TOUR}`,
        as: linkUrl,
      },
      adults,
      teenagers,
      children,
    };
  });
};

export const constructCartGTETours = (
  queryTours?: OrderTypes.QueryGTETour[]
): OrderTypes.GTETour[] => {
  if (!queryTours?.length) return [];

  return queryTours.map(queryTour => {
    const { linkUrl } = queryTour;
    const cartItemIdParsed = parseCartItemId(queryTour.cartItemId);

    return {
      ...queryTour,
      title: queryTour.title,
      id: queryTour.id,
      from: convertDateStringIntoTimezoneAgnosticDate(queryTour.from as string),
      to: convertDateStringIntoTimezoneAgnosticDate(queryTour.to as string),
      updated: convertDateStringIntoTimezoneAgnosticDate(queryTour.updated as string),
      createdTime: convertDateStringIntoTimezoneAgnosticDate(queryTour.createdTime as string),
      numberOfTravelers: getTotalTravelers(queryTour.paxMix),
      editLinkUrl: `${linkUrl}?cart_item=${cartItemIdParsed}`,
      clientRoute: {
        query: {
          ...parseUrl(linkUrl).query,
          slug: getProductSlugFromHref(linkUrl),
        },
        route: `/${PageType.GTE_TOUR}`,
        as: linkUrl,
      },
    };
  });
};

export const getUnavailableTourClientRoute = (
  tour: OrderTypes.TourSearchUrl,
  tourSearchPageUrl: string
): SharedTypes.ClientRoute => {
  const slug = tour.category?.uri ? getProductSlugFromHref(tour.category.uri) : tourSearchPageUrl;

  return {
    route: `/${PageType.TOURCATEGORY}`,
    query: {
      slug,
      [FilterQueryEnum.STARTING_LOCATION_ID]: "0",
      // TODO: get proper starting location id
      [FilterQueryEnum.STARTING_LOCATION_ID]: tour.startingLocationId || "0",
      [FilterQueryEnum.ADULTS]: tour.adults,
      [FilterQueryEnum.CHILDREN]: tour.children,
      [FilterQueryEnum.DATE_FROM]: getFormattedDate(tour.from, yearMonthDayFormat),
      [FilterQueryEnum.DATE_TO]: getFormattedDate(tour.to, yearMonthDayFormat),
    },
    as: `${tour.category?.uri || tourSearchPageUrl}${encodeTourQueryParams({
      // TODO: get proper starting location id
      tripStartingLocationId: tour.startingLocationId || "0",
      adults: tour.adults,
      childs: tour.children,
      dateFrom: getFormattedDate(tour.from, yearMonthDayFormat),
      dateTo: getFormattedDate(tour.to, yearMonthDayFormat),
    } as FrontSearchStateContext)}`,
  };
};

export const constructCarRentalPaymentDetails = ({
  carRental,
  orderT,
  carnectT,
  vatAmount,
  vatPercentage,
  isCartInfo,
  voucherPriceObjects,
}: {
  carRental: OrderTypes.CarRental;
  orderT: TFunction;
  carnectT: TFunction;
  vatAmount?: number;
  vatPercentage?: number;
  paymentAmount?: number;
  paymentCurrency?: string;
  isCartInfo?: boolean;
  voucherPriceObjects?: VoucherTypes.VoucherPriceObject[];
}) => {
  const isCarnect = carRental.provider === CarProvider.CARNECT;
  const payOnLocationValues = carRental.payOnArrival.map(extra => {
    const extraPrice = getFormattedPriceValue(extra.priceObject);
    let extraName = extra.name;

    if (extra.translationKeys) {
      const nameKey = getCarnectKey(extra.translationKeys, "name");
      if (nameKey && isCarnect) extraName = getTranslationByKey(nameKey, carnectT);
    }

    return `${extraPrice} - ${extraName}`;
  });

  return {
    title: orderT("Payment details"),
    sections: [
      ...(carRental.priceOnArrival > 0
        ? [
            {
              label: orderT("Pay now"),
              values: [
                `${carRental.priceObject.priceDisplayValue} ${carRental.priceObject.currency}`,
              ],
            },
            {
              label: orderT("Pay on location"),
              values: payOnLocationValues,
            },
          ]
        : []),
      ...constructPaymentDetails(
        isCartInfo
          ? {
              priceObject: carRental.priceObject,
              orderT,
              vatAmount,
              vatPercentage,
              isCartInfo,
            }
          : {
              voucherPriceObjects: voucherPriceObjects!,
              orderT,
              vatAmount,
              vatPercentage,
              isCartInfo,
            }
      ).sections,
    ],
  };
};

export const constructCartCarRentals = (
  carProductBaseUrl: string,
  queryCarRentals?: OrderTypes.QueryCarRental[]
): OrderTypes.CarRental[] => {
  if (!queryCarRentals?.length) return [];

  return queryCarRentals.map(queryCar => {
    const from = convertDateStringIntoTimezoneAgnosticDate(queryCar.from as string);
    const to = convertDateStringIntoTimezoneAgnosticDate(queryCar.to as string);
    const provider = queryCar.provider?.toUpperCase() as CarProvider;
    const linkUrl = constructCarProductUrl(
      carProductBaseUrl,
      queryCar.offerId,
      {
        selectedDates: { from, to },
        pickupId: String(queryCar.pickupId || -1),
        dropoffId: String(queryCar.dropoffId || -1),
        dropoffLocationName: queryCar.dropoffLocation!,
        pickupLocationName: queryCar.pickupLocation!,
      },
      provider,
      queryCar.category || "",
      queryCar.title || "",
      queryCar.driverAge || getDriverAgeFromLocalStorage() || 45,
      queryCar.driverCountry || getDriverCountryFromLocalStorage() || undefined
    );
    const cartItemIdParsed = parseCartItemId(queryCar.cartItemId)!;
    const editLinkUrl = `${linkUrl}&cart_item=${cartItemIdParsed}`;
    const { query } = parseUrl(linkUrl);

    return {
      ...queryCar,
      title: queryCar.title ? decodeHtmlEntity(queryCar.title) : undefined,
      cartItemIdParsed,
      from,
      to,
      updated: convertDateStringIntoTimezoneAgnosticDate(queryCar.updated as string),
      createdTime: convertDateStringIntoTimezoneAgnosticDate(queryCar.createdTime as string),
      expiredTime: queryCar.expiredTime ? new Date(queryCar.expiredTime as string) : undefined,
      clientRoute: {
        route: `/${PageType.CAR}`,
        query: {
          ...query,
          carId: queryCar.offerId,
          carName: queryCar.title,
        },
        as: linkUrl,
      },
      linkUrl,
      editLinkUrl,
      provider,
    };
  });
};

export const getCarSearchClientRoute = (
  carProductBaseUrl: string,
  carRental: OrderTypes.CarRental | (OrderTypes.CarRentalSearchUrl & { cartItemIdParsed?: number })
): SharedTypes.ClientRoute => {
  const carSearchLink = getSearchPageLink({
    searchLink: carProductBaseUrl,
    selectedDates: { from: carRental.from, to: carRental.to },
    pickupId: carRental?.pickupId,
    dropoffId: carRental?.dropoffId,
    driverAge: carRental?.driverAge || 45,
    driverCountry: carRental?.driverCountry,
    pickupLocationName: carRental?.pickupLocation,
    dropoffLocationName: carRental?.dropoffLocation,
    editItem: carRental?.cartItemIdParsed,
  });
  const { query } = parseUrl(carSearchLink);

  return { route: `/${PageType.CARSEARCH}`, query, as: carSearchLink };
};

const isGTEStayType = (
  stay: OrderTypes.QueryStay | OrderTypes.QueryGTEStay
): stay is OrderTypes.QueryGTEStay => {
  return (
    (stay as OrderTypes.QueryGTEStay).isForVacationPackage !== undefined ||
    (stay as OrderTypes.QueryGTEStay).totalNumberOfAdults !== undefined
  );
};

const isGTEStaySearchUrlType = (
  stay: OrderTypes.StaySearchUrl | OrderTypes.GTEStaySearchUrl
): stay is OrderTypes.GTEStaySearchUrl => {
  return (stay as OrderTypes.GTEStaySearchUrl).totalNumberOfAdults !== undefined;
};

const constructCartStayCommonData = ({
  routePageName,
  productId,
  title,
  dateFrom,
  dateTo,
  createdTime,
  updated,
  productPageUri,
  imageUrl,
  cartItemId,
  buildEditBookingLink = true,
}: {
  title?: string;
  dateFrom: SharedTypes.iso8601DateTime;
  dateTo: SharedTypes.iso8601DateTime;
  createdTime: SharedTypes.iso8601DateTime;
  updated: SharedTypes.iso8601DateTime;
  productPageUri: string;
  imageUrl?: string;
  cartItemId: string;
  productId: number;
  routePageName: PageType;
  buildEditBookingLink?: boolean;
}): OrderTypes.QueryStayConstructBase => {
  const cartItemIdParsed = parseCartItemId(cartItemId);
  const from = convertDateStringIntoTimezoneAgnosticDate(dateFrom as string);
  const to = convertDateStringIntoTimezoneAgnosticDate(dateTo as string);
  const editBookingLink = buildEditBookingLink
    ? `/?cart_item=${cartItemIdParsed}&f=${from.getTime()}&t=${to.getTime()}`
    : "";

  const linkUrl = `${productPageUri}${editBookingLink}`;

  const { query } = parseUrl(linkUrl);

  return {
    productId,
    title: title ? decodeHtmlEntity(title) : undefined,
    from,
    to,
    imageUrl: getHttpsUrl(imageUrl),
    updated: convertDateStringIntoTimezoneAgnosticDate(updated as string),
    createdTime: convertDateStringIntoTimezoneAgnosticDate(createdTime as string),
    clientRoute: {
      query: {
        ...query,
        slug: productPageUri ? getProductSlugFromHref(productPageUri) : productPageUri,
      },
      route: `/${routePageName}`,
      as: linkUrl,
    },
    linkUrl,
  };
};

const constructCartStay = (
  stay: OrderTypes.QueryStay,
  isGTE: boolean
): OrderTypes.QueryStayConstruct => {
  const {
    updated = "",
    from: dateFrom = "",
    to: dateTo = "",
    createdTime = "",
    title,
    imageUrl,
    productId,
    cartItemId,
    uri,
  } = stay;

  const constructedStay = {
    ...stay,
    ...constructCartStayCommonData({
      productId,
      title,
      dateFrom,
      dateTo,
      createdTime,
      updated,
      productPageUri: uri,
      imageUrl,
      cartItemId,
      routePageName: isGTE ? PageType.GTE_STAY : PageType.ACCOMMODATION,
    }),
  };

  return constructedStay;
};

const constructGTECartStay = (stay: OrderTypes.QueryGTEStay): OrderTypes.QueryGTEStayConstruct => {
  const {
    updated = "",
    from: dateFrom = "",
    to: dateTo = "",
    createdTime = "",
    title,
    imageUrl,
    product = {} as OrderTypes.QueryStayProductCartProduct,
    cartItemId = "",
  } = stay;

  const { productId, productPageUri = "" } = product;

  const constructedStay = {
    ...stay,
    ...constructCartStayCommonData({
      productId,
      title,
      dateFrom,
      dateTo,
      createdTime,
      updated,
      productPageUri,
      imageUrl,
      cartItemId,
      routePageName: PageType.GTE_STAY,
      buildEditBookingLink: false,
    }),
  };

  return constructedStay;
};

export const isGTEStayConstructType = (
  stay: OrderTypes.QueryGTEStayConstruct | OrderTypes.QueryStay
): stay is OrderTypes.QueryGTEStayConstruct => {
  return isGTEStayType(stay);
};

export const constructCartStays = (
  isGTE: boolean,
  queryStays?: OrderTypes.QueryStay[]
): OrderTypes.QueryStayConstruct[] => {
  if (!queryStays?.length) return [];

  return queryStays.map(stay => constructCartStay(stay, isGTE));
};

export const constructGTECartStays = (
  queryStays?: OrderTypes.QueryGTEStay[]
): OrderTypes.QueryGTEStayConstruct[] => {
  if (!queryStays?.length) return [];

  return queryStays.map(stay => constructGTECartStay(stay));
};

export const constructCustomProducts = (
  customProducts?: OrderTypes.QueryCustomProduct[]
): OrderTypes.QueryCustomsConstruct[] => {
  if (!customProducts?.length) return [];

  return customProducts.map(customProductItem => {
    return {
      ...customProductItem,
      title: customProductItem.title ? decodeHtmlEntity(customProductItem.title) : undefined,
      from: convertDateStringIntoTimezoneAgnosticDate(customProductItem.from as string),
      to: convertDateStringIntoTimezoneAgnosticDate(customProductItem.to as string),
      updated: convertDateStringIntoTimezoneAgnosticDate(customProductItem.updated as string),
      createdTime: convertDateStringIntoTimezoneAgnosticDate(
        customProductItem.createdTime as string
      ),
      date: convertDateStringIntoTimezoneAgnosticDate(customProductItem.date as string),
      deliveryDate: customProductItem?.deliveryDate
        ? (convertDateStringIntoTimezoneAgnosticDate(
            customProductItem.deliveryDate as string
          ) as unknown as string)
        : undefined,
      ...(customProductItem?.numberOfTravelers
        ? { numberOfTravelers: customProductItem.numberOfTravelers }
        : {}),
    };
  });
};

// TODO: finish this and add tests after design (if we ever get one)
export const constructCustomsServiceDetails = ({
  customProduct,
  orderT,
  paidDate,
  activeLocale,
}: {
  customProduct: OrderTypes.QueryCustomsConstruct;
  orderT: TFunction;
  paidDate?: string;
  activeLocale?: SupportedLanguages;
}): OrderTypes.VoucherProduct => {
  const paymentLinkSections = customProduct.isPaymentLink
    ? [
        ...(customProduct.bookingId
          ? [
              {
                label: orderT("Connected booking number"),
                values: [customProduct.bookingId],
              },
            ]
          : []),
        ...(customProduct.invoiceNumber
          ? [
              {
                label: orderT("Invoice number"),
                values: [customProduct.invoiceNumber],
              },
            ]
          : []),
        ...(paidDate && activeLocale
          ? [
              {
                label: orderT("Paid date"),
                values: [toLocalizedLongDateFormat(new Date(paidDate), activeLocale)],
              },
            ]
          : []),
        ...(customProduct.numberOfTravelers && customProduct.numberOfTravelers > 0
          ? [
              {
                label: orderT("Number of travelers"),
                values: [customProduct.numberOfTravelers],
              },
            ]
          : []),
        ...(customProduct.pickupLocation
          ? [
              {
                label: orderT("Pickup location"),
                values: [customProduct.pickupLocation],
              },
            ]
          : []),
        ...(customProduct.deliveryDate
          ? [
              {
                label: orderT("Delivery date"),
                values: [
                  getFormattedDate(
                    new Date(customProduct.deliveryDate as string),
                    shortMonthDayYearFormat
                  ),
                ],
              },
            ]
          : []),
        ...(customProduct.expiresAt
          ? [
              {
                label: orderT("Payment expiration date"),
                values: [
                  orderT("{date} at {time}", {
                    date: getFormattedDate(
                      new Date(customProduct.expiresAt as string),
                      shortMonthDayYearFormat
                    ),
                    time: getFormattedDate(
                      new Date(customProduct.expiresAt as string),
                      hourMinuteFormat
                    ),
                  }),
                ],
              },
            ]
          : []),
        {
          label: orderT("Description"),
          values: [removeHTMLCharactersFromText(customProduct.description)],
        },
      ]
    : [];
  return {
    title: orderT("Service details"),
    sections: [
      ...(paymentLinkSections.length
        ? paymentLinkSections
        : [
            {
              label: orderT("Description"),
              values: [customProduct.description],
            },
            {
              label: orderT("Date"),
              values: [
                orderT("{date} at {time}", {
                  date: getFormattedDate(customProduct.date, shortMonthDayYearFormat),
                  time: getFormattedDate(customProduct.date, hourMinuteFormat),
                }),
              ],
            },
          ]),
    ],
  };
};

export const constructCartVacationPackages = ({
  vacationPackages,
  flightT,
  flightSearchBaseUrl,
  carProductBaseUrl,
}: {
  vacationPackages?: OrderTypes.QueryVacationPackageProduct[];
  flightT: TFunction;
  flightSearchBaseUrl: string;
  carProductBaseUrl: string;
}): OrderTypes.QueryVacationPackageConstruct[] => {
  if (!vacationPackages?.length) return [];
  // TODO: remove once backend has ficed on their side.
  const currentDate = new Date();
  return vacationPackages.map((vacationPackage: OrderTypes.QueryVacationPackageProduct) => {
    return {
      ...vacationPackage,
      flights: constructCartFlights(vacationPackage.flights, flightT, flightSearchBaseUrl),
      cars: constructCartCarRentals(carProductBaseUrl, vacationPackage.cars),
      gteStays: constructGTECartStays(
        vacationPackage.gteStays
      ) as OrderTypes.QueryGTEStayConstruct[],
      stays: constructCartStays(true, vacationPackage.stays) as OrderTypes.QueryStayConstruct[],
      toursAndTickets: vacationPackage.toursAndTickets,
      title: vacationPackage.title ? decodeHtmlEntity(vacationPackage.title) : undefined,
      from: convertDateStringIntoTimezoneAgnosticDate(vacationPackage.from as string),
      to: convertDateStringIntoTimezoneAgnosticDate(vacationPackage.to as string),
      updated: convertDateStringIntoTimezoneAgnosticDate(vacationPackage.updated as string),
      createdTime: convertDateStringIntoTimezoneAgnosticDate(vacationPackage.createdTime as string),
      expiredTime: vacationPackage.expiredTime
        ? new Date(vacationPackage.expiredTime as string)
        : addHours(currentDate, 1),
    };
  });
};

export const calculateGuestsInRooms = (rooms: OrderTypes.CartStaysRoom[] = []) =>
  rooms.reduce(
    (acc, { roomBookings }) => {
      // eslint-disable-next-line array-callback-return
      roomBookings?.map(({ adults, children }) => {
        // eslint-disable-next-line functional/immutable-data
        acc.numberOfAdults += adults;
        // eslint-disable-next-line functional/immutable-data
        acc.numberOfChildren += children;
      });
      return acc;
    },
    { numberOfAdults: 0, numberOfChildren: 0 }
  );

const calculateRoomsNumber = (rooms: OrderTypes.CartStaysRoom[] = []) =>
  rooms.reduce((acc, { roomBookings }) => {
    // eslint-disable-next-line array-callback-return
    if (roomBookings) {
      return acc + roomBookings.length;
    }
    return acc + 1;
  }, 0);

export const getUnavailableStayClientRoute = (
  stay: OrderTypes.StaySearchUrl | OrderTypes.GTEStaySearchUrl,
  accommodationSearchPageUrl: string,
  isGTE: boolean
): SharedTypes.ClientRoute => {
  const isGTEStaySearchUrl = isGTEStaySearchUrlType(stay);
  const { numberOfAdults, numberOfChildren } = !isGTEStaySearchUrl
    ? calculateGuestsInRooms(stay.rooms)
    : {
        numberOfAdults: stay.totalNumberOfAdults,
        numberOfChildren: stay.totalNumberOfChildren,
      };
  const rooms = !isGTEStaySearchUrl ? calculateRoomsNumber(stay.rooms) : stay.rooms?.length ?? 0;
  // TODO get proper children ages
  const childrenAges = new Array(numberOfChildren).fill(9);
  let gteAddress;
  let gteType;
  let gteId;
  if (!isGTEStaySearchUrl) {
    gteAddress = stay.cityOsmId ? stay.cityName : stay.countryName;
    gteType = stay.cityOsmId ? "CITY" : "COUNTRY";
    gteId = stay.cityOsmId || stay.countryOsmId;
  } else {
    // TODO - check how breadcrumbs are looking in this case
    gteId = stay.product?.productId;
  }
  return {
    route: `/${isGTE ? PageType.GTE_STAYS_SEARCH : PageType.ACCOMMODATION_SEARCH}`,
    query: {
      [AccommodationFilterQueryParam.ID]: isGTE ? gteId : undefined,
      [AccommodationFilterQueryParam.ROOMS]: rooms,
      [AccommodationFilterQueryParam.ADULTS]: numberOfAdults,
      // TODO: get the correct accommodation city
      ...(!isGTEStaySearchUrl && {
        [AccommodationFilterQueryParam.ADDRESS]: isGTE ? gteAddress : stay.address,
      }),
      [AccommodationFilterQueryParam.CHILDREN]: childrenAges,
      [AccommodationFilterQueryParam.TYPE]: isGTE ? gteType : undefined,
      [AccommodationFilterQueryParam.DATE_FROM]: getFormattedDate(stay.from, yearMonthDayFormat),
      [AccommodationFilterQueryParam.DATE_TO]: getFormattedDate(stay.to, yearMonthDayFormat),
      [AccommodationFilterQueryParam.ORDER_BY]: OrderBy.POPULARITY,
    },
    as: `${accommodationSearchPageUrl}${encodeAccomodationQueryParams({
      accommodationRooms: rooms,
      adults: numberOfAdults,
      childrenAges,
      // TODO: get the correct accommodation city
      ...(!isGTEStaySearchUrl && {
        accommodationAddress: isGTE ? gteAddress : stay.address,
      }),
      accommodationId: isGTE ? gteId : undefined,
      accommodationType: isGTE ? gteType : undefined,
      dateFrom: getFormattedDate(stay.from, yearMonthDayFormat),
      dateTo: getFormattedDate(stay.to, yearMonthDayFormat),
    } as FrontSearchStateContext)}`,
  };
};

export const constructCarRentalInsurances = ({
  carRental,
  orderT,
}: {
  carRental: OrderTypes.CarRental;
  orderT: TFunction;
}) =>
  carRental.insurances.length > 0
    ? [
        {
          label: orderT("Insurances"),
          values: carRental.insurances.map(insurance => insurance.name).filter(Boolean) as string[],
        },
      ]
    : [];

export const constructCarRentalExtras = ({
  carRental,
  orderT,
  carnectT,
  isCarnect,
}: {
  carRental: OrderTypes.CarRental;
  orderT: TFunction;
  carnectT: TFunction;
  isCarnect: boolean;
}) =>
  carRental.extras.length > 0
    ? [
        {
          label: orderT("Extras"),
          values: carRental.extras
            .map(extra => {
              let extraName = extra.name;

              if (!extraName && extra.translationKeys) {
                const nameKey = getCarnectKey(extra.translationKeys, "name");
                if (nameKey && isCarnect) extraName = getTranslationByKey(nameKey, carnectT);
              }

              return extraName?.length
                ? `${(extra.count ?? 0) > 1 ? `${extra.count}x ` : ""}${extraName}`
                : extraName;
            })
            .filter(Boolean) as string[],
        },
      ]
    : [];

export const constructCarRentalsServiceDetails = ({
  carRental,
  activeLocale,
  orderT,
  carnectT,
}: {
  carRental: OrderTypes.CarRental;
  activeLocale: SupportedLanguages;
  orderT: TFunction;
  carnectT: TFunction;
}): OrderTypes.VoucherProduct => {
  const additionalDrivers = carRental.extras.find(
    extra => extra.id === carExtrasIdMap.ADDITIONAL_DRIVER
  )?.count;
  const isCarnect = carRental.provider === CarProvider.CARNECT;

  const carRentalCarnectPostCode = carRental?.locationDetails?.dropoff?.postalCode
    ? `${carRental?.locationDetails?.pickup?.postalCode},`
    : "";
  return {
    title: orderT("Service details"),
    sections: [
      {
        label: orderT("Duration"),
        values: [
          orderT("{numberOfDays} day rental", {
            numberOfDays: carRental.numberOfDays,
          }),
        ],
      },
      {
        label: orderT("Drivers"),
        values: [`x ${additionalDrivers || 1}`],
      },
      ...(carRental.from
        ? [
            {
              label: orderT("Pick-up"),
              values: [toLocalizedLongDateFormat(carRental.from, activeLocale)],
            },
          ]
        : []),
      ...(carRental.to
        ? [
            {
              label: orderT("Drop-off"),
              values: [toLocalizedLongDateFormat(carRental.to, activeLocale)],
            },
          ]
        : []),
      ...(carRental.pickupLocation
        ? [
            {
              label: orderT("Pick-up location"),
              values: [carRental.pickupLocation],
              shouldStartFromNewLine: true,
            },
          ]
        : []),
      ...(carRental.pickupSpecify
        ? [
            {
              label: orderT("Pick-up details"),
              values: [carRental.pickupSpecify],
            },
          ]
        : []),
      ...(carRental.dropoffLocation
        ? [
            {
              label: orderT("Drop-off location"),
              values: [carRental.dropoffLocation],
            },
          ]
        : []),
      ...(carRental.dropoffSpecify
        ? [
            {
              label: orderT("Drop-off details"),
              values: [carRental.dropoffSpecify],
            },
          ]
        : []),
      ...(isCarnect && carRental.locationDetails?.pickup?.openingHours?.length
        ? [
            {
              label: orderT("Opening hours - Pick up station"),
              values: [
                <OrderOpeningHours
                  openingHours={carRental.locationDetails?.pickup?.openingHours}
                  activeLocale={activeLocale}
                  activeDay={new Date(carRental.from).getDay()}
                />,
              ],
            },
          ]
        : []),
      ...(isCarnect && carRental.locationDetails?.dropoff?.openingHours?.length
        ? [
            {
              label: orderT("Opening hours - Drop-off station"),
              values: [
                <OrderOpeningHours
                  openingHours={carRental.locationDetails.dropoff.openingHours}
                  activeLocale={activeLocale}
                  activeDay={new Date(carRental.to).getDay()}
                />,
              ],
            },
          ]
        : []),
      ...(isCarnect && carRental.locationDetails?.pickup?.streetNumber
        ? [
            {
              label: orderT("Pick up information"),
              values: [
                `${carRental.locationDetails.pickup.streetNumber}, ${carRentalCarnectPostCode} ${carRental.locationDetails.pickup.cityName}, ${carRental.locationDetails.pickup.country}`,
              ],
            },
          ]
        : []),
      ...(isCarnect && carRental.locationDetails?.dropoff?.streetNumber
        ? [
            {
              label: orderT("Drop off information"),
              values: [
                `${carRental.locationDetails.dropoff.streetNumber}, ${carRentalCarnectPostCode} ${carRental.locationDetails.dropoff.cityName}, ${carRental.locationDetails.dropoff.country}`,
              ],
            },
          ]
        : []),
      {
        label: orderT("Car type"),
        values: [`${carRental.category}`],
      },
      ...(carRental.flightNumber
        ? [
            {
              label: orderT("Flight number"),
              values: [carRental.flightNumber],
            },
          ]
        : []),
      ...constructCarRentalInsurances({
        carRental,
        orderT,
      }),
      ...constructCarRentalExtras({
        carRental,
        carnectT,
        orderT,
        isCarnect,
      }),
    ],
  };
};

export const buildCheckingOutDateString = (
  date: Date,
  activeLocale: SupportedLanguages,
  timeString?: string | null
) => {
  const clonedDate = new Date(date.valueOf());
  const hasTime = timeString != null && timeString.length > 2;

  if (hasTime) {
    const [hours = "", minutes = ""] = timeString.split(":");
    const numHours = parseInt(hours, 10);
    const numMinutes = parseInt(minutes, 10);
    if (!Number.isNaN(numHours) && !Number.isNaN(numMinutes)) {
      clonedDate.setHours(numHours);
      clonedDate.setMinutes(numMinutes);
      clonedDate.setSeconds(0);
      clonedDate.setMilliseconds(0);

      return toLocalizedLongDateFormat(clonedDate, activeLocale, { hourCycle: "h23" });
    }
  }

  return formatLocalizedUrl(
    clonedDate,
    activeLocale,
    { year: "numeric", month: "long", day: "numeric" },
    "MMM dd YYYY"
  );
};

export const constructGTEStayServiceDetails = ({
  stay,
  activeLocale,
  orderT,
}: {
  stay: OrderTypes.QueryGTEStayConstruct;
  activeLocale: SupportedLanguages;
  orderT: TFunction;
}): OrderTypes.VoucherProduct => {
  const address = stay.product?.address;
  const {
    totalNumberOfAdults: numberOfAdults,
    totalNumberOfChildren: numberOfChildren,
    from,
    to,
    title,
    product: { timeCheckingIn, timeCheckingOut } = {},
  } = stay;

  return {
    title: orderT("Service details"),
    sections: [
      {
        label: orderT("Duration"),
        values: [
          orderT("{totalNights} nights", {
            totalNights: differenceInCalendarDays(stay.to, stay.from) || 1,
          }),
        ],
      },
      {
        label: orderT("Guests"),
        values: (
          [
            orderT("{numberOfAdults} adults", {
              numberOfAdults,
            }),
            numberOfChildren > 0 &&
              orderT("{numberOfChildren} children", {
                numberOfChildren,
              }),
          ] as string[]
        ).filter(Boolean),
      },
      ...(from
        ? [
            {
              label: orderT("Check in"),
              values: [buildCheckingOutDateString(from, activeLocale, timeCheckingIn)],
            },
          ]
        : []),
      ...(to
        ? [
            {
              label: orderT("Check out"),
              values: [buildCheckingOutDateString(to, activeLocale, timeCheckingOut)],
            },
          ]
        : []),
      ...(title
        ? [
            {
              label: orderT("Hotel"),
              values: [title],
            },
          ]
        : []),
      ...(address
        ? [
            {
              label: orderT("Address"),
              values: [address],
            },
          ]
        : []),
    ],
  };
};

export const constructGTEStayRoomDetails = ({
  stay,
  activeLocale,
  bookingInfoReference,
  orderT,
}: {
  stay: OrderTypes.QueryGTEStayConstruct;
  bookingInfoReference?: {
    availabilityId?: string | null;
    externalId?: string | null;
  }[];
  activeLocale: SupportedLanguages;
  orderT: TFunction;
}): OrderTypes.VoucherProduct => {
  const { rooms } = stay;

  return {
    title: orderT("Room details"),
    sections: (rooms || [])?.reduce((allRoomSections, room) => {
      const { name, mealType, availabilityId, dateFreeCancellationUntil, cancellationType } = room;

      const includedMealLabel = getIncludedMeal(
        mealType as MealType,
        // @ts-ignore - I need to get the pure, not translated label
        value => value
      )[0]?.title;

      const bookingReference = bookingInfoReference?.find(
        bookingInfo => bookingInfo.availabilityId === room.availabilityId
      )?.externalId;
      const roomSectionData = [
        ...(name
          ? [
              {
                label: orderT("Room type"),
                values: [room.name],
              },
            ]
          : []),
        ...(includedMealLabel
          ? [
              {
                label: orderT("Meal"),
                values: [includedMealLabel],
              },
            ]
          : []),
        ...(cancellationType
          ? [
              {
                label: orderT("Cancellation policy"),
                values: [
                  `${
                    getIncludedCancellation(
                      activeLocale,
                      orderT,
                      cancellationType as OrderStayCancellationType,
                      new Date(dateFreeCancellationUntil as string)
                    )[0].title
                  }`,
                ],
              },
            ]
          : []),
        ...(availabilityId && bookingReference
          ? [
              {
                label: orderT("Room booking reference"),
                values: [`${bookingReference}`],
              },
            ]
          : []),
      ] as OrderTypes.VoucherSection[];

      // we should always start new room information from the new line
      if (roomSectionData?.[0]) {
        // eslint-disable-next-line functional/immutable-data
        roomSectionData[0].shouldStartFromNewLine = true;
      }

      return [...allRoomSections, ...roomSectionData];
    }, [] as OrderTypes.VoucherSection[]),
  };
};

export const constructStayServiceDetails = ({
  stay,
  activeLocale,
  orderT,
}: {
  stay: OrderTypes.QueryStayConstruct;
  activeLocale: SupportedLanguages;
  orderT: TFunction;
}): OrderTypes.VoucherProduct => {
  const { numberOfAdults, numberOfChildren } = calculateGuestsInRooms(stay.rooms);

  const { address, specs, from, to, cancellationString, rooms } = stay;

  return {
    title: orderT("Service details"),
    sections: [
      {
        label: orderT("Duration"),
        values: [
          orderT("{totalNights} nights", {
            totalNights: differenceInCalendarDays(stay.to, stay.from) || 1,
          }),
        ],
      },
      {
        label: orderT("Guests"),
        values: (
          [
            orderT("{numberOfAdults} adults", {
              numberOfAdults,
            }),
            numberOfChildren > 0 &&
              orderT("{numberOfChildren} children", {
                numberOfChildren,
              }),
          ] as string[]
        ).filter(Boolean),
      },
      ...(from
        ? [
            {
              label: orderT("Check in"),
              values: [toLocalizedLongDateFormat(from, activeLocale)],
            },
          ]
        : []),
      ...(to
        ? [
            {
              label: orderT("Check out"),
              values: [toLocalizedLongDateFormat(to, activeLocale)],
            },
          ]
        : []),
      ...(address
        ? [
            {
              label: orderT("Address"),
              values: [address],
            },
          ]
        : []),
      ...(rooms && rooms.length > 0
        ? [
            {
              label: orderT("Rooms"),
              values: rooms.map(room => room.name).filter(Boolean),
            },
          ]
        : []),
      ...(cancellationString
        ? [
            {
              label: orderT("Cancellation"),
              values: [cancellationString],
            },
          ]
        : []),
      ...(specs && specs.length > 0
        ? specs.map(({ name, value }) => ({
            label: orderT(name),
            values: [orderT(value)],
          }))
        : []),
    ],
  };
};

export const getStayServiceDetails = (
  stays: OrderTypes.QueryStayConstruct[]
): OrderTypes.StaysServiceDetails[] =>
  stays.reduce((staysServiceDetails, currentStay) => {
    const hasStay = staysServiceDetails.find(stay => stay.productId === currentStay.productId);
    const numberOfNights = differenceInCalendarDays(currentStay.to, currentStay.from) || 1;
    if (hasStay) {
      return staysServiceDetails.map(stayItem => {
        if (stayItem.productId === currentStay.productId) {
          return {
            ...stayItem,
            numberOfNights: stayItem.numberOfNights + numberOfNights,
          };
        }
        return stayItem;
      });
    }
    return [
      ...staysServiceDetails,
      {
        productId: currentStay.productId,
        numberOfNights,
        title: currentStay.title || "",
      },
    ];
  }, [] as OrderTypes.StaysServiceDetails[]);

export const getGTEStayServiceDetails = (
  stays: OrderTypes.QueryGTEStayConstruct[]
): OrderTypes.StaysServiceDetails[] =>
  stays.map(currentStay => {
    const numberOfNights = differenceInCalendarDays(currentStay.to, currentStay.from) || 1;
    return {
      productId: currentStay.productId,
      numberOfNights,
      title: currentStay.title || "",
    };
  });

export const constructVacationProductServiceDetails = ({
  vacationPackageProduct,
  orderT,
  carnectT,
  locale,
}: {
  vacationPackageProduct: OrderTypes.QueryVacationPackageConstruct;
  orderT: TFunction;
  carnectT: TFunction;
  locale: SupportedLanguages;
}): OrderTypes.VoucherProduct => {
  const { daysDuration, nightsDuration } = getTourDuration(vacationPackageProduct);

  const vacationPackageFlight = pipe(head(vacationPackageProduct.flights), toUndefined);
  const vacationPackageCarRental = pipe(head(vacationPackageProduct.cars), toUndefined);

  const { firstOutboundFlight, lastInboundFlight } =
    getCondensedFlightItinerary(vacationPackageFlight);

  const stayServiceItems = getStayServiceDetails(vacationPackageProduct.stays);
  const gteStayServiceItems = getGTEStayServiceDetails(vacationPackageProduct.gteStays);
  const stayServices = gteStayServiceItems.length > 0 ? gteStayServiceItems : stayServiceItems;
  const numberOfAdults = vacationPackageProduct.gteStays?.[0]?.totalNumberOfAdults ?? 0;
  const numberOfChildren = vacationPackageProduct.gteStays?.[0]?.totalNumberOfChildren ?? 0;
  const numberOfGuests = vacationPackageProduct.stays?.[0]?.numberOfGuests ?? 0;
  const totalGuests = Math.max(numberOfAdults + numberOfChildren, numberOfGuests);
  return {
    title: orderT("Service details"),
    sections: [
      {
        label: orderT("Duration"),
        values: [
          orderT("{totalDays} days, {totalNights} nights", {
            totalDays: daysDuration,
            totalNights: nightsDuration,
          }),
        ],
      },
      {
        label: orderT("Travellers"),
        values: [
          orderT("{totalTravellers} travellers", {
            totalTravellers: totalGuests,
          }),
        ],
      },
      {
        label: orderT("Starts"),
        values: [
          formatLocalizedUrl(
            vacationPackageProduct.from,
            locale,
            { year: "numeric", month: "long", day: "numeric" },
            shortMonthDayYearFormat
          ),
        ],
      },
      {
        label: orderT("Ends"),
        values: [
          formatLocalizedUrl(
            vacationPackageProduct.to,
            locale,
            { year: "numeric", month: "long", day: "numeric" },
            shortMonthDayYearFormat
          ),
        ],
      },
      ...(vacationPackageFlight && firstOutboundFlight
        ? [
            {
              label: orderT("Starting location"),
              values: [
                `${firstOutboundFlight?.originAirport} (${firstOutboundFlight?.originAirportCode})`,
              ],
            },
            ...(lastInboundFlight
              ? [
                  {
                    label: orderT("Ending location"),
                    values: [
                      `${lastInboundFlight?.destinationAirport} (${lastInboundFlight?.destinationAirportCode})`,
                    ],
                  },
                ]
              : []),
            {
              label: orderT("Flights"),
              values: [vacationPackageFlight.title],
            },
            ...constructFlightsBagsServiceDetails(vacationPackageFlight, orderT),
          ]
        : [
            {
              label: orderT("Starting location"),
              values: [vacationPackageProduct.startPlace],
            },
            {
              label: orderT("Ending location"),
              values: [vacationPackageProduct.endPlace],
            },
          ]),
      {
        label: orderT("Stays"),
        // TODO: add tests
        values: stayServices.map(stayItem => {
          return orderT("{numberOfNights} nights at {stay}", {
            numberOfNights: stayItem.numberOfNights,
            stay: stayItem.title,
          });
        }),
      },
      ...(vacationPackageProduct.toursAndTickets.length > 0
        ? [
            {
              label: orderT("Experiences"),
              // TODO: add tests
              values: vacationPackageProduct.toursAndTickets.map(tourItem => {
                const { title, startTime, from } = tourItem;
                return `${title} ${startTime ? `at ${startTime}` : ""} on ${getFormattedDate(
                  toDateWithoutTimezone(new Date(from as string)),
                  shortMonthDayFormat
                )}`;
              }),
            },
          ]
        : []),
      ...(vacationPackageCarRental
        ? [
            {
              label: orderT("Car rental"),
              values: [
                `${vacationPackageCarRental.title}, ${orderT("{numberOfDays} day rental", {
                  numberOfDays: daysDuration,
                })}`,
              ],
            },
            ...constructCarRentalInsurances({
              carRental: vacationPackageCarRental,
              orderT,
            }),
            ...constructCarRentalExtras({
              carRental: vacationPackageCarRental,
              orderT,
              carnectT,
              isCarnect: vacationPackageCarRental.provider === CarProvider.CARNECT,
            }),
          ]
        : []),
    ],
  };
};

export const getTourIconByType = (tourType?: TourTypes) => {
  switch (tourType) {
    case TourType.Package:
    case TourType.SelfDrive: {
      return TourRoute;
    }

    default: {
      return DayTourIcon;
    }
  }
};

export const adjustSectionsDisplayWithEmptyLines = (sections: OrderTypes.VoucherSection[]) => {
  let constructedSections = [] as OrderTypes.VoucherSection[];
  const emptySection = {
    label: "",
    isEmptySection: true,
    values: [],
  } as OrderTypes.VoucherSection;

  sections.forEach(section => {
    if (section.shouldStartFromNewLine && constructedSections.length % 2 !== 0) {
      constructedSections = [...constructedSections, emptySection, section];
    } else {
      constructedSections = [...constructedSections, section];
    }
  });

  return constructedSections;
};
