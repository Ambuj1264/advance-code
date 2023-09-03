import { format } from "date-fns";

import {
  PB_CARD_TYPE,
  PB_ITINERARY_TRAVELMODE_TYPE,
  ITINERARY_TOUR_DIFFICULTY,
  PB_TICKET_TYPE,
} from "components/features/PostBooking/types/postBookingEnums";
import { PostBookingTypes } from "components/features/PostBooking/types/postBookingTypes";
import { SupportedLanguages } from "types/enums";
import { formatLocalizedUrl, toDateWithoutTimezone } from "utils/dateUtils";
import { capitalize } from "utils/globalUtils";

const toLocalizedWeekDayAndMonthFormat = (date: string, activeLocale: SupportedLanguages) => {
  if (date) {
    const dateWithoutTimezone = toDateWithoutTimezone(new Date(date));
    return formatLocalizedUrl(
      dateWithoutTimezone,
      activeLocale,
      { weekday: "short", day: "2-digit", month: "short" },
      "EEE MMM dd"
    );
  }

  return "";
};

const toLocalizedDayAndLongMonthYearFormat = (
  date: string,
  activeLocale: SupportedLanguages,
  skipDay = false
) => {
  if (date) {
    const dateWithoutTimezone = toDateWithoutTimezone(new Date(date));
    return formatLocalizedUrl(
      dateWithoutTimezone,
      activeLocale,
      {
        month: "long",
        year: "numeric",
        ...(skipDay ? {} : { day: "2-digit" }),
      },
      skipDay ? "MMM yyyy" : "MMM dd yyyy"
    );
  }

  return "";
};

const toLocalizedDayAndMonthFormat = (date: string, activeLocale: SupportedLanguages) => {
  if (date) {
    const dateWithoutTimezone = toDateWithoutTimezone(new Date(date));
    return formatLocalizedUrl(
      dateWithoutTimezone,
      activeLocale,
      { day: "2-digit", month: "short" },
      "MMM dd"
    );
  }

  return "";
};

const toHoursMinutesFormat = (date: string) => {
  if (date) {
    return format(toDateWithoutTimezone(new Date(date)), "HH:mm");
  }
  return "";
};

export const getHeadingLabel = (
  card: Pick<PostBookingTypes.ItineraryCard, "cardType">,
  t: TFunction
) => {
  switch (card.cardType) {
    case PB_CARD_TYPE.ATTRACTION:
      return t("Attraction");
    case PB_CARD_TYPE.BAR:
      return t("Drink");
    case PB_CARD_TYPE.CAR_RENTAL:
      return t("Car");

    case PB_CARD_TYPE.CITY:
      return t("City");

    case PB_CARD_TYPE.FLIGHT_ARRIVING:
    case PB_CARD_TYPE.FLIGHT_RETURN:
      return t("Flight");

    case PB_CARD_TYPE.RESTAURANT:
      return t("Restaurant");

    case PB_CARD_TYPE.STAY:
    case PB_CARD_TYPE.STAY_PRODUCT:
      return t("Hotel");

    case PB_CARD_TYPE.TRAVELPLAN:
      return t("Vacation Package");

    case PB_CARD_TYPE.TOUR:
      return t("Experience");

    default:
      return "";
  }
};

export const getTitleLabel = (
  card: Pick<
    PostBookingTypes.ItineraryCard,
    "departureCityName" | "arrivalCityName" | "name" | "cityName" | "cardType"
  >,
  t: TFunction
) => {
  switch (card.cardType) {
    case PB_CARD_TYPE.FLIGHT_ARRIVING:
    case PB_CARD_TYPE.FLIGHT_RETURN:
      return t(`Flight from {from} to {to}`, {
        from: card.departureCityName,
        to: card.arrivalCityName,
      });
    case PB_CARD_TYPE.CAR_RENTAL:
      return t(`Car rental in {cityName}`, {
        cityName: card.cityName?.includes(" ")
          ? card.cityName
          : capitalize(card.cityName?.toLowerCase() ?? ""),
      });
    default:
      return card.name ?? "";
  }
};

export const getFlightArrivalOrDepartureSummaryLabel = (
  {
    date,
    airportName,
    airportCode,
    airportCityName,
  }: {
    date?: string;
    airportName?: string;
    airportCode?: string;
    airportCityName?: string;
  },
  activeLocale: SupportedLanguages
) => {
  const arrivalDateInfo = {
    day: "",
    time: "",
  };

  if (date) {
    // eslint-disable-next-line functional/immutable-data
    arrivalDateInfo.day = toLocalizedWeekDayAndMonthFormat(date, activeLocale);

    // eslint-disable-next-line functional/immutable-data
    arrivalDateInfo.time = toHoursMinutesFormat(date);
  }

  const arrivalSummary = [
    arrivalDateInfo.day,
    airportCityName ?? "",
    airportName ?? "",
    airportCode ?? "",
    arrivalDateInfo.time,
  ]
    .filter(Boolean)
    .join(" ");

  return arrivalSummary;
};

export const getAdultsOrChildrenLabel = (
  {
    numberOfAdults: adultsCount,
    numberOfChildren: childrenCount,
    numberOfInfants: infantsCount,
  }: Pick<
    PostBookingTypes.ItineraryCard,
    "numberOfAdults" | "numberOfChildren" | "numberOfInfants"
  >,
  t: TFunction
) => {
  if (adultsCount && infantsCount && childrenCount) {
    return t(`{adultsCount} adults, {childrenCount} children and {infantsCount} infants`, {
      adultsCount,
      childrenCount,
      infantsCount,
    });
  }

  if (adultsCount && childrenCount) {
    return t(`{adultsCount} adults and {childrenCount} children`, {
      adultsCount,
      childrenCount,
    });
  }

  if (adultsCount && infantsCount) {
    return t(`{adultsCount} adults and {infantsCount} infants`, {
      adultsCount,
      infantsCount,
    });
  }

  if (adultsCount) {
    return t(`{adultsCount} adults`, { adultsCount });
  }

  return "";
};

export const getFlightBagsSummaryLabel = (
  {
    bagsCarried,
    bagsChecked,
    bagsInCabin,
  }: Pick<PostBookingTypes.ItineraryCard, "bagsCarried" | "bagsChecked" | "bagsInCabin">,
  t: TFunction
) => {
  const bagsSummary = [];

  if (bagsChecked) {
    bagsSummary.push(
      t(`{count} x Checked`, {
        count: bagsChecked,
      })
    );
  }

  if (bagsCarried) {
    bagsSummary.push(
      t(`{count} x Carried`, {
        count: bagsCarried,
      })
    );
  }

  if (bagsInCabin) {
    bagsSummary.push(
      t(`{count} x Cabin`, {
        count: bagsInCabin,
      })
    );
  }

  return bagsSummary.join(",");
};

export const getDistanceLabel = (
  card: Pick<PostBookingTypes.ItineraryCard, "travelDistanceInMeters">,
  t: TFunction
) => {
  const meters = card.travelDistanceInMeters ?? 0;
  if (meters) {
    if (meters >= 100) {
      const km = (meters / 1000).toFixed(1);
      // this way we remove .0 from the number if its integer one: 1.toFixed(1) => 1.0 => Number(1.0) => 1
      return t(`{distance} km`, { distance: Number(km) });
    }
    return t(`{distance} m`, { distance: meters });
  }

  return "";
};

export const getCheckinOrCheckoutLabel = (
  {
    date,
    timeString,
    isCheckin,
  }: {
    date: string;
    timeString: string;
    isCheckin: boolean;
  },
  activeLocale: SupportedLanguages,
  t: TFunction
) => {
  if (date) {
    const dayString = toLocalizedDayAndMonthFormat(date, activeLocale);

    return isCheckin
      ? t(`{day} from {time}`, { day: dayString, time: timeString })
      : t(`{day} before {time}`, { day: dayString, time: timeString });
  }

  return "";
};

export const getCarPickupOrDropoffDateLabel = (
  from: string,
  to: string,
  activeLocale: SupportedLanguages
) => {
  let timeFrom;
  let timeTo;

  if (from && to) {
    timeFrom = toHoursMinutesFormat(from);
    timeTo = toHoursMinutesFormat(to);

    const timeLabel = timeFrom === timeTo ? timeFrom : `${timeFrom}-${timeTo}`;

    return `${toLocalizedWeekDayAndMonthFormat(to, activeLocale)} ${timeLabel}`;
  }

  if (to) {
    timeTo = toHoursMinutesFormat(to);
    return `${toLocalizedWeekDayAndMonthFormat(to, activeLocale)} ${timeTo}`;
  }

  if (from) {
    timeFrom = toHoursMinutesFormat(from);
    return `${toLocalizedWeekDayAndMonthFormat(from, activeLocale)} ${timeFrom}`;
  }

  return "";
};

export const getInceptionLabel = (
  {
    inceptionDay: day,
    inceptionMonth: month,
    inceptionYear: year,
  }: Pick<PostBookingTypes.ItineraryCard, "inceptionDay" | "inceptionMonth" | "inceptionYear">,
  activeLocale: SupportedLanguages
) => {
  if (day && month && year) {
    const dateString = `${year}-${month}-${day}`;
    return toLocalizedDayAndLongMonthYearFormat(dateString, activeLocale);
  }

  if (month && year) {
    const dateString = `${year}-${month}-1`;
    return toLocalizedDayAndLongMonthYearFormat(dateString, activeLocale, true);
  }

  if (year) {
    return String(year);
  }

  return "";
};

export const getOpenCloseLabel = ({
  timeCloses,
  timeOpens,
}: Pick<PostBookingTypes.ItineraryCard, "timeCloses" | "timeOpens">) => {
  if (timeCloses && timeOpens) {
    return timeCloses === timeOpens && timeCloses === "00:00"
      ? "24h"
      : `${timeOpens}-${timeCloses}`;
  }

  return "";
};

export const getPopulationLabel = ({
  populationCount,
  populationYear,
}: Pick<PostBookingTypes.ItineraryCard, "populationCount" | "populationYear">) => {
  if (populationCount) {
    return populationYear
      ? `${populationCount.toLocaleString()} (${populationYear})`
      : populationCount.toLocaleString();
  }

  return "";
};

export const getRoomTypesLabel = ({
  roomTypes,
}: Pick<PostBookingTypes.ItineraryCard, "roomTypes">) => {
  if (roomTypes?.length) {
    const types = roomTypes.reduce((roomsPerTypes: { [key: string]: number }, roomType) => {
      if (roomsPerTypes[roomType] !== undefined) {
        // eslint-disable-next-line functional/immutable-data, no-param-reassign
        roomsPerTypes[roomType] += 1;
      } else {
        // eslint-disable-next-line functional/immutable-data, no-param-reassign
        roomsPerTypes[roomType] = 1;
      }

      return roomsPerTypes;
    }, {});

    return Object.entries(types)
      .map(([key, value]) => `${value} ${key}`)
      .join(", ");
  }

  return "";
};

export const getTimeToSpendLabel = (
  { timeToSpend }: Pick<PostBookingTypes.ItineraryCard, "timeToSpend">,
  t: TFunction
) => {
  if (timeToSpend && timeToSpend?.length > 1) {
    let hh;
    let mm;

    try {
      [hh, mm] = toHoursMinutesFormat(`2020-01-01T${timeToSpend}:00.000Z`).split(":").map(Number);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("received invalid time value", timeToSpend);

      hh = 0;
      mm = 0;
    }

    if (hh > 0 && mm > 0) {
      return t(`{hours}h {minutes}m`, { hours: hh, minutes: mm });
    }

    if (hh === 0 && mm > 0) {
      return t(`{minutes}m`, { minutes: mm });
    }

    if (mm === 0 && hh > 0) {
      return t(`{numberOfHours} hours`, { numberOfHours: hh });
    }

    return "";
  }

  return "";
};

export const getTransportationTextLabel = (
  {
    travelDistanceInMeters,
    travelDuration,
    travelMode,
  }: {
    travelMode: PB_ITINERARY_TRAVELMODE_TYPE;
    travelDuration?: string;
    travelDistanceInMeters?: number;
  },
  t: TFunction
) => {
  const distance = getDistanceLabel(
    {
      travelDistanceInMeters,
    },
    t
  );
  const duration = getTimeToSpendLabel({ timeToSpend: travelDuration }, t);

  const timingLabel = [distance, duration].filter(Boolean).join(", ");

  if (travelMode === PB_ITINERARY_TRAVELMODE_TYPE.DRIVING) {
    return `${t(`Drive `)}${timingLabel}`;
  }

  if (travelMode === PB_ITINERARY_TRAVELMODE_TYPE.WALK) {
    return `${t(`Walk `)}${timingLabel}`;
  }

  if (travelMode === PB_ITINERARY_TRAVELMODE_TYPE.FLIGHT) {
    return `${t(`Flight `)}${timingLabel}`;
  }

  return "";
};

export const getDifficultyLabel = (
  { difficulty }: { difficulty?: ITINERARY_TOUR_DIFFICULTY },
  t: TFunction
) => {
  if (difficulty) {
    if (difficulty === ITINERARY_TOUR_DIFFICULTY.EASY) {
      return t("Easy");
    }
    if (difficulty === ITINERARY_TOUR_DIFFICULTY.MEDIUM) {
      return t("Medium");
    }
    if (difficulty === ITINERARY_TOUR_DIFFICULTY.HARD) {
      return t("Hard");
    }
  }

  return "";
};

export const getTicketButtonLabel = (ticketType: PB_TICKET_TYPE, t: TFunction) => {
  switch (ticketType) {
    case PB_TICKET_TYPE.VOUCHER:
      return t("Voucher");
    case PB_TICKET_TYPE.FLIGHT_ETICKET:
      return t("Flight ticket");
    case PB_TICKET_TYPE.FLIGHT_BOARDING_PASS:
      return t("Boarding pass");
    default:
      return "";
  }
};
