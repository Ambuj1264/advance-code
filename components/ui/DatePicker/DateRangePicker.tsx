import React, { useState, useCallback } from "react";

import { DateModifiers } from "./CommonDatePicker";
import DatePicker from "./DatePicker";
import {
  addDayToRange,
  getRangePickerHoverRange,
  DateRangeEnum,
  constructDaysRange,
  areDateIntervalsIntersectWithUnavailableDates,
} from "./utils/datePickerUtils";

const DateRangePicker = ({
  onDateSelection,
  selectedDates,
  dates,
  initialMonth,
  canChangeMonth,
  numberOfMonths,
  hasNoAvailableDates,
  shouldScrollSelectedDateIntoView,
  showWeekdays,
  color,
  allowSeparateSelection,
  activeInputType = DateRangeEnum.inactive,
  allowSelectDisabledPeriodsInDatesRange = true,
  allowSameDateSelection = true,
}: {
  selectedDates: SharedTypes.SelectedDates;
  dates: SharedTypes.Dates;
  initialMonth?: Date;
  canChangeMonth?: boolean;
  showWeekdays?: boolean;
  numberOfMonths: number;
  shouldScrollSelectedDateIntoView?: boolean;
  hasNoAvailableDates: boolean;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  color?: "action" | "primary";
  allowSeparateSelection?: boolean;
  allowSelectDisabledPeriodsInDatesRange?: boolean;
  activeInputType?: DateRangeEnum;
  allowSameDateSelection?: boolean;
}) => {
  const [dateMouseEntered, setDateMouseEntered] = useState<Date | undefined>(undefined);

  const isSelectedDateContainsDisabledDates = useCallback(
    (day: Date) => {
      if (allowSelectDisabledPeriodsInDatesRange) return false;

      if (selectedDates.from && !selectedDates.to) {
        return areDateIntervalsIntersectWithUnavailableDates({ ...selectedDates, to: day }, dates);
      }

      if (selectedDates.to && !selectedDates.from) {
        return areDateIntervalsIntersectWithUnavailableDates(
          {
            ...selectedDates,
            from: day,
          },
          dates
        );
      }

      return false;
    },
    [dates, selectedDates]
  );
  const handleDayClick = useCallback(
    (day: Date) => {
      if (allowSeparateSelection) {
        onDateSelection(
          constructDaysRange(day, selectedDates, activeInputType, !allowSameDateSelection)
        );
      } else {
        if (isSelectedDateContainsDisabledDates(day)) return;
        onDateSelection(addDayToRange(day, selectedDates));
      }
    },
    [
      activeInputType,
      allowSeparateSelection,
      isSelectedDateContainsDisabledDates,
      onDateSelection,
      selectedDates,
    ]
  );

  const handleDayMouseEnter = useCallback(
    (day: Date, { disabled }: DateModifiers) => {
      if (!disabled && !isSelectedDateContainsDisabledDates(day)) {
        setDateMouseEntered(day);
      }
    },
    [isSelectedDateContainsDisabledDates]
  );

  return (
    <DatePicker
      canChangeMonth={canChangeMonth}
      dates={dates}
      showWeekDays={showWeekdays}
      numberOfMonths={numberOfMonths}
      selectedDates={selectedDates}
      initialMonth={initialMonth}
      onDayClick={handleDayClick}
      onDayMouseEnter={handleDayMouseEnter}
      hasNoAvailableDates={hasNoAvailableDates}
      hoverRange={getRangePickerHoverRange({
        selectedDates,
        dateMouseEntered,
        activeInputType,
      })}
      shouldScrollSelectedDateIntoView={shouldScrollSelectedDateIntoView}
      color={color}
    />
  );
};

export default DateRangePicker;
