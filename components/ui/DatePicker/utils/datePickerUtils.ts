/* eslint-disable import/no-duplicates */
import {
  isValid,
  addHours,
  isSameDay,
  isBefore,
  addDays,
  differenceInDays,
  areIntervalsOverlapping,
  isPast,
  isToday,
} from "date-fns";
import { range } from "fp-ts/lib/Array";
import dateFnsParse from "date-fns/parse";
import format from "date-fns/format";

import {
  toLocaleDateStringSupportsLocales,
  getFormattedDate,
  yearMonthDayFormat,
  yearMonthDayFormatWithTime,
} from "utils/dateUtils";
import {
  getFixedSelectedDatesFromLocalStorage,
  getSelectedDatesFromLocalStorage,
} from "utils/localStorageUtils";
import { CarSearchTimeType } from "types/enums";

export const addDayToRange = (
  day: Date,
  { from, to }: SharedTypes.SelectedDates
): SharedTypes.SelectedDates => {
  if (from === undefined || day <= from || to !== undefined) {
    return {
      from: day,
      to: undefined,
    };
  }
  return {
    from,
    to: day,
  };
};

export enum DateRangeEnum {
  onFromActive = "from",
  onToActive = "to",
  inactive = "inactive",
}

export const constructDaysRange = (
  day: Date,
  { from, to }: SharedTypes.SelectedDates,
  type: DateRangeEnum,
  noSameDateSelection?: boolean
): SharedTypes.SelectedDates => {
  const isFromDate = type === DateRangeEnum.onFromActive;
  const isToDate = type === DateRangeEnum.onToActive;
  if (
    isToDate &&
    from &&
    ((noSameDateSelection && day <= from) || (!noSameDateSelection && day < from))
  ) {
    return {
      from: day,
    };
  }
  if (isFromDate && to && day >= to) {
    return {
      from: day,
      to: undefined,
    };
  }
  if (isFromDate && to) {
    return {
      from: day,
    };
  }

  return {
    from,
    to,
    [type]: day,
  };
};

export const bothDaysSet = ({ from, to }: SharedTypes.SelectedDates) =>
  isValid(from) && isValid(to);

export const getMonths = (activeLocale: string) => {
  let locale = activeLocale;
  const today = new Date();
  if (locale === "zh_CN") {
    locale = "zh";
  }
  if (!toLocaleDateStringSupportsLocales()) {
    locale = "en";
  }
  if (locale === "no") {
    locale = "nb";
  }
  return range(0, 11).map(index =>
    new Date(today.getFullYear(), index, 2).toLocaleDateString(locale, {
      month: "long",
    })
  );
};

export const formatMonthTitle = (d: Date, locale: string) => {
  let activeLocale = locale;
  if (locale === "zh_CN") {
    activeLocale = "zh";
  }
  if (!toLocaleDateStringSupportsLocales()) {
    activeLocale = "en";
  }
  if (locale === "no") {
    activeLocale = "nb";
  }
  return d.toLocaleDateString(activeLocale, {
    year: "numeric",
    month: "long",
  });
};

export const getRangePickerHoverRange = ({
  selectedDates,
  dateMouseEntered,
  activeInputType,
}: {
  selectedDates: SharedTypes.SelectedDates;
  dateMouseEntered?: Date;
  activeInputType?: DateRangeEnum;
}) => {
  const { from, to } = selectedDates;
  const dayBeforeSelectedDate = from && !to && dateMouseEntered && dateMouseEntered < from;
  if (
    bothDaysSet({ from, to }) ||
    dayBeforeSelectedDate ||
    activeInputType === DateRangeEnum.onFromActive
  ) {
    return { from: dateMouseEntered, to: undefined };
  }
  return { from, to: dateMouseEntered };
};

export const shouldSetInitalSelectedDates = (
  { to, from }: SharedTypes.SelectedDates,
  { min, max, unavailableDates }: SharedTypes.Dates
) => {
  if (!from || !to || (!min && !max)) {
    return false;
  }
  const formattedFromDate = getFormattedDate(from, yearMonthDayFormat);
  const tooEarly = min && formattedFromDate < getFormattedDate(min, yearMonthDayFormat);
  const tooLate =
    max && getFormattedDate(to, yearMonthDayFormat) > getFormattedDate(max, yearMonthDayFormat);
  const containsDisabledDate =
    unavailableDates.find(
      unavailableDate => getFormattedDate(unavailableDate, yearMonthDayFormat) === formattedFromDate
    ) !== undefined;
  return !tooEarly && !tooLate && !containsDisabledDate;
};

export const getInitialMonth = ({
  fixedLength,
  dates,
}: {
  fixedLength?: number;
  dates: SharedTypes.Dates;
}) => {
  const lsSelectedDates = fixedLength
    ? getFixedSelectedDatesFromLocalStorage(fixedLength)
    : getSelectedDatesFromLocalStorage();
  if (shouldSetInitalSelectedDates(lsSelectedDates, dates)) {
    return lsSelectedDates.from || dates.min;
  }
  return dates.min;
};

export const constructQueryFromSelectedDates = ({
  from,
  to,
  withTime = false,
}: SharedTypes.SelectedDates & {
  withTime?: boolean;
}): SharedTypes.SelectedDatesQuery => {
  const dateFormat = withTime ? yearMonthDayFormatWithTime : yearMonthDayFormat;
  return {
    dateFrom: from ? getFormattedDate(from, dateFormat) : undefined,
    dateTo: to ? getFormattedDate(to, dateFormat) : undefined,
  };
};

export const isDateInPast = (date?: Date) => {
  if (!date) return false;
  return isPast(date) && !isToday(date);
};

export const constructSelectedDatesFromQuery = ({
  dateFrom,
  dateTo,
  withTime = false,
}: SharedTypes.SelectedDatesQuery & {
  withTime?: boolean;
}) => {
  const dateFormat = withTime ? yearMonthDayFormatWithTime : yearMonthDayFormat;
  return {
    from: dateFrom ? dateFnsParse(dateFrom, dateFormat, new Date()) : undefined,
    to: dateTo ? dateFnsParse(dateTo, dateFormat, new Date()) : undefined,
  };
};

export const isCurrentDay = (selectedDate: Date | undefined, currentDate: Date = new Date()) =>
  Boolean(selectedDate && isSameDay(currentDate, selectedDate));

export const getAdjustedHourObject = (
  selectedDate: Date | undefined,
  selectedTime: SharedTypes.Time,
  currentDate = new Date()
): {
  hour: number;
  isNextDay: boolean;
} => {
  // If date is not in past, return as is
  if (!(isCurrentDay(selectedDate, currentDate) && selectedTime.hour < currentDate.getHours())) {
    return {
      hour: selectedTime.hour,
      isNextDay: false,
    };
  }
  // Otherwise get two hour later from the current moment
  const twoHourLaterDate = addHours(currentDate, 2);
  const isNextDay = selectedDate?.getDate() !== twoHourLaterDate.getDate();
  return {
    hour: twoHourLaterDate.getHours(),
    isNextDay,
  };
};

export const getAdjustedTime = (
  { from, to }: SharedTypes.SelectedDates,
  { pickup, dropoff }: SharedCarTypes.CarSeachTimes,
  currentDate: Date = new Date()
): {
  hour: number;
  timeType: SharedCarTypes.SearchTimeTypes;
  isNextDay: boolean;
} => {
  const selDate = from || to;
  const selTime = from ? pickup : dropoff;
  const timeType = from ? CarSearchTimeType.PICKUP : CarSearchTimeType.DROPOFF;
  return { timeType, ...getAdjustedHourObject(selDate, selTime, currentDate) };
};

export const getAvailableTime = (selectedDate: Date | undefined, currentDate: Date = new Date()) =>
  isCurrentDay(selectedDate, currentDate)
    ? { minHour: addHours(currentDate, 2).getHours() }
    : undefined;

export const isSameSelectedDates = (
  selectedDates: SharedTypes.SelectedDates,
  prevSelectedDates: SharedTypes.SelectedDates | undefined
) => {
  return (
    prevSelectedDates?.from?.getTime() !== selectedDates.from?.getTime() ||
    prevSelectedDates?.to?.getTime() !== selectedDates.to?.getTime()
  );
};

export const getDateRangeTitle = (defaultLabel: string, startDate?: string, endDate?: string) => {
  if (!endDate) {
    if (!startDate) {
      return defaultLabel;
    }
    return startDate;
  }
  return `${startDate} - ${endDate}`;
};

export const getBirthdayYears = () =>
  range(1900, Number(format(new Date(), "yyyy")))
    .map(i => String(i))
    .reverse();

export const getExpirationYears = (amountOfYears = 50) =>
  range(Number(format(new Date(), "yyyy")), Number(format(new Date(), "yyyy")) + amountOfYears).map(
    i => String(i)
  );

export const normaliseDates = (
  { from, to }: SharedTypes.SelectedDates,
  skipOneDayAfter?: boolean
) => {
  const currentDateWithoutTime = new Date().setHours(0, 0, 0, 0);
  const isPastDate = from && isBefore(from, currentDateWithoutTime);

  if (isPastDate) {
    const oneDayAfter = 1;
    return {
      from: addDays(currentDateWithoutTime, oneDayAfter),
      to:
        to && from
          ? addDays(
              currentDateWithoutTime,
              skipOneDayAfter
                ? differenceInDays(to, from)
                : oneDayAfter + differenceInDays(to, from)
            )
          : to,
    };
  }

  return { from, to };
};

export const filterDatesLessThan = (dateToCompare: Date) => (date: Date) => date < dateToCompare;

export const filterDatesGreaterThan = (dateToCompare: Date) => (date: Date) => date > dateToCompare;

export const reverseDatesLesserThanCurrent = (dates: Date[], dateToCompare: Date) =>
  dates.filter((date: Date) => new Date(date) < new Date(dateToCompare)).reverse();

export const findInDates = (dates: Date[], condition: (date: Date) => boolean) =>
  dates.find(condition);

export const getMonthConditions = (dates: Date[], incomingMonth: Date, currentMonth?: Date) => ({
  isPastMonth: Boolean(currentMonth && currentMonth.getMonth() > incomingMonth.getMonth()),
  isFutureMonth: Boolean(currentMonth && currentMonth.getMonth() < incomingMonth.getMonth()),
  isAvailableMonth: dates.some(
    (date: Date) =>
      date.getMonth() === incomingMonth.getMonth() &&
      date.getFullYear() === incomingMonth.getFullYear()
  ),
});

const cloneDateWithoutTime = (date: Date) =>
  new Date(new Date(date.getTime()).setHours(0, 0, 0, 0));

export const areDateIntervalsIntersect = (
  dateInterval1: SharedTypes.SelectedDates,
  dateInterval2: SharedTypes.SelectedDates,
  inclusive = true
) => {
  if (dateInterval1.from && dateInterval1.to && dateInterval2.from && dateInterval2.to) {
    return areIntervalsOverlapping(
      {
        start: cloneDateWithoutTime(dateInterval1.from),
        end: cloneDateWithoutTime(dateInterval1.to),
      },
      {
        start: cloneDateWithoutTime(dateInterval2.from),
        end: cloneDateWithoutTime(dateInterval2.to),
      },
      {
        inclusive,
      }
    );
  }

  return false;
};

export const areDateIntervalsIntersectWithUnavailableDates = (
  selectedDays: SharedTypes.SelectedDates,
  disabledDays: SharedTypes.Dates
) => {
  let matchUnavailableDate = false;
  let matchUnavailableDateRange = false;
  let matchMaxRange = false;

  if (disabledDays.max) {
    matchMaxRange =
      Boolean(
        selectedDays.from &&
          cloneDateWithoutTime(selectedDays.from).getTime() > disabledDays.max.getTime()
      ) ||
      Boolean(
        selectedDays.to &&
          cloneDateWithoutTime(selectedDays.to).getTime() > disabledDays.max.getTime()
      );
  }

  if (disabledDays.unavailableDates) {
    matchUnavailableDate = disabledDays.unavailableDates.some(unavailableDate => {
      return areDateIntervalsIntersect(
        { from: unavailableDate, to: unavailableDate },
        { from: selectedDays.from, to: selectedDays.to }
      );
    });
  }
  if (disabledDays.unavailableDatesRange) {
    matchUnavailableDateRange = disabledDays.unavailableDatesRange.some(dateRange =>
      areDateIntervalsIntersect(
        { from: dateRange.from, to: dateRange.to },
        { from: selectedDays.from, to: selectedDays.to }
      )
    );
  }

  return matchMaxRange || matchUnavailableDate || matchUnavailableDateRange;
};

export const getDatesInFuture = (dateFrom?: string, dateTo?: string, withTime?: boolean) => {
  const fromDate = dateFrom ? new Date(dateFrom) : undefined;
  const toDate = dateTo ? new Date(dateTo) : undefined;
  const isFromDateInPast = isDateInPast(fromDate);
  const fromValue = isFromDateInPast ? addDays(new Date(), 1) : fromDate;
  const isToDateInvalid = fromValue && toDate && isBefore(toDate, fromValue);
  const toValue = isToDateInvalid ? addDays(fromValue, 1) : toDate;
  const dateFormatString = withTime ? yearMonthDayFormatWithTime : yearMonthDayFormat;
  return {
    fromDate: fromValue ? getFormattedDate(fromValue, dateFormatString) : undefined,
    toDate: toValue ? getFormattedDate(toValue, dateFormatString) : undefined,
  };
};
