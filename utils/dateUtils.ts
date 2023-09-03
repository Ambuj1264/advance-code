import { format, getDate, getYear, isValid } from "date-fns";
import { range } from "fp-ts/lib/Array";
import memoizeOne from "memoize-one";

import { normalizeGraphCMSLocale } from "./helperUtils";

import { SupportedLanguages } from "types/enums";

export const dayMonthYearWithTimeFormat = "dd/MM/yyyy, HH:mm";
export const shortMonthDayFormat = "MMM dd";
export const shortMonthDayYearFormat = "MMM dd yyyy";
export const longMonthShortDayYearFormat = "LLLL d yyyy";
export const yearMonthDayFormat = "yyyy-MM-dd";
export const yearMonthDayFormatWithTime = "yyyy-MM-dd HH:mm";
export const dayMonthYearFormat = "dd-MM-yyyy";
export const dayMonthYearSlashFormat = "dd/MM/yyyy";
export const longMonthYearFormat = "LLLL yyyy";
export const hourMinuteFormat = "HH:mm";
export const isoFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
export const minutesSecondsFormat = "mm:ss";
export const dayHourMinuteFormat = "dd:HH:mm";

type WeekdayFormat = "long" | "short";

export const toLocaleDateStringSupportsLocales = () => {
  try {
    new Date().toLocaleDateString("i");
  } catch (e) {
    return (e as Error).name === "RangeError";
  }
  return false;
};

export const getFormattedDate = memoizeOne(
  (
    date: Date,
    dateFormat: string,
    options?: {
      locale?: Locale;
      weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      firstWeekContainsDate?: number;
      useAdditionalWeekYearTokens?: boolean;
      useAdditionalDayOfYearTokens?: boolean;
    }
  ): string => format(date, dateFormat, options)
);

export const getShortMonthNumbericDateFormat = (date: Date, activeLocale: string) => {
  if (!toLocaleDateStringSupportsLocales()) {
    return format(date, dayMonthYearSlashFormat);
  }
  const locale = normalizeGraphCMSLocale(activeLocale);
  return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
};

export const fromTimestamp = (timestamp: number): Date =>
  new Date(new Date(timestamp * 1000).toString().slice(0, -1));

export const fromUnixTimestamp = (timestamp: number): Date =>
  new Date(new Date(timestamp * 1000).toISOString().slice(0, -1));

//  use toDateWithoutTimezone when you need to convert time from backend containing timezone
//  to your local time that ignores the timezone

//  e.g. new Date("2022-10-09T20:35:00.000Z") => Sun Oct 09 2022 20:35:00 GMT+0300 (Eastern European Summer Time)

export const toDateWithoutTimezone = (date: Date): Date =>
  new Date(date.getTime() + date.getTimezoneOffset() * 60000);

export const getFormattedDateWithTime = (date: Date, activeLocale: string): string =>
  `${getShortMonthNumbericDateFormat(date, activeLocale)} ${getFormattedDate(
    date,
    hourMinuteFormat
  )}`;

export const getWeekdays = (type: WeekdayFormat, activeLocale: string) => {
  const day = new Date("October 24, 2020");
  const locale = normalizeGraphCMSLocale(activeLocale);
  return range(0, 6).map(() => {
    day.setDate(day.getDate() + 1);
    return day.toLocaleDateString(locale, { weekday: type });
  });
};

export const toLocalizedLongDateFormat = (
  date: Date,
  activeLocale: SupportedLanguages,
  options: Intl.DateTimeFormatOptions = {}
) => {
  if (!toLocaleDateStringSupportsLocales()) {
    return format(date, dayMonthYearWithTimeFormat);
  }
  const locale = normalizeGraphCMSLocale(activeLocale);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    ...options,
  });
};

export const toLocalizedWeekDateFormat = (
  date: Date,
  activeLocale: SupportedLanguages,
  shouldSkipYear = false
) => {
  if (!toLocaleDateStringSupportsLocales()) {
    return format(date, dayMonthYearSlashFormat);
  }
  const locale = normalizeGraphCMSLocale(activeLocale);
  if (!shouldSkipYear) {
    return date.toLocaleDateString(locale, {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
  }
  return date.toLocaleDateString(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatLocalizedUrl = (
  date: Date,
  activeLocale: SupportedLanguages,
  options: Intl.DateTimeFormatOptions,
  fallbackFormat: string
) => {
  if (!toLocaleDateStringSupportsLocales()) {
    return format(date, fallbackFormat);
  }
  const locale = normalizeGraphCMSLocale(activeLocale);
  return date.toLocaleDateString(locale, options);
};

export const getShortYearMonthDayFormat = (date: Date, activeLocale: SupportedLanguages) =>
  formatLocalizedUrl(
    date,
    activeLocale,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    shortMonthDayYearFormat
  );

export const convertDateStringIntoTimezoneAgnosticDate = (dateString: string) => {
  const date = new Date(dateString);
  date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  return date;
};

export const convertDateIntoTimezoneAgnosticDate = (date: Date) => {
  date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  return date;
};

export const constructSameDateInUTC = (date: Date) => {
  const clonedDate = new Date(date.valueOf());

  clonedDate.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  clonedDate.setUTCHours(date.getHours(), date.getMinutes(), 0, 0);

  return clonedDate;
};

export const removeSecondsFromTimeString = (time: string) =>
  time.replace(/(\d+):(\d+):(\d+)/g, "$1:$2");

export const addLeadingZero = (value?: string | number) => {
  if (value) {
    return +value < 10 ? `0${value}` : value.toString();
  }
  return value?.toString();
};

export const getDateStringFromBirthdayType = (
  date: SharedTypes.Birthdate,
  time?: SharedTypes.TimeDropdownObject
) => {
  const { year, month, day } = date;
  const dateString = `${year}-${`0${month}`.slice(-2)}-${`0${day}`.slice(-2)}`;
  if (time) {
    const { hour, minutes } = time;
    return `${dateString} ${hour || "00"}:${minutes || "00"}:00`;
  }
  return dateString;
};

export const getBirthdayTypeFromDateString = (date: string | Date) => {
  const formattedDate = new Date(date);
  if (isValid(formattedDate)) {
    return {
      day: getDate(formattedDate).toString(),
      month: format(formattedDate, "M"),
      year: getYear(formattedDate).toString(),
    };
  }
  return undefined;
};
