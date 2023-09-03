import { addDays } from "date-fns";
import { range } from "fp-ts/lib/Array";
import memoizeOne from "memoize-one";

import { SupportedLanguages } from "types/enums";
import { toLocalizedWeekDateFormat } from "utils/dateUtils";

export const getMaxListIndexToShow = ({
  charLimit,
  travelStops,
}: {
  charLimit: number;
  travelStops: TravelStopTypes.TravelStops[];
}) => {
  let len = 0;
  return travelStops
    .map(stop => {
      len += stop.info.title.length;
      return len >= charLimit;
    })
    .findIndex(item => item === true);
};

export const getLocalizedWeekDays = memoizeOne(
  (vacationLength: number, activeLocale: SupportedLanguages, date?: Date) =>
    range(0, vacationLength).map(index => {
      const shouldSkipYear = !(date && date.getFullYear() === new Date().getFullYear());
      return toLocalizedWeekDateFormat(
        addDays(date ?? new Date(), index),
        activeLocale,
        shouldSkipYear
      );
    })
);
