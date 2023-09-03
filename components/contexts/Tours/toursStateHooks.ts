import { useCallback } from "react";
import { pipe } from "fp-ts/lib/pipeable";
import { map, getOrElse, fromNullable } from "fp-ts/lib/Option";
import { format } from "date-fns";

import { useToursContext } from "./ToursBookingWidgetSharedContext";

import { yearMonthDayFormat } from "utils/dateUtils";

const useSimilarToursDateFromChanged = () => {
  const { setAllContextState } = useToursContext();
  return useCallback(
    (selectedDates: Date | undefined) => {
      const date = pipe(
        selectedDates,
        fromNullable,
        map(fromDate => format(fromDate, yearMonthDayFormat)),
        getOrElse(() => "")
      );

      setAllContextState(prevState => ({
        ...prevState,
        similarToursDateFrom: selectedDates ? date : prevState.similarToursDateFrom,
      }));
    },
    [setAllContextState]
  );
};
export default useSimilarToursDateFromChanged;
