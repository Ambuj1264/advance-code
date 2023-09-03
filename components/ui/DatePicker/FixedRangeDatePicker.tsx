import React, { useCallback, useState, useMemo } from "react";
import { addDays } from "date-fns";

import DatePicker from "./DatePicker";
import { DateModifiers } from "./CommonDatePicker";
import { areDateIntervalsIntersectWithUnavailableDates } from "./utils/datePickerUtils";

type Props = {
  selectedDates: SharedTypes.SelectedDates;
  dates: SharedTypes.Dates;
  fixedLength: number;
  initialMonth?: Date;
  canChangeMonth?: boolean;
  showWeekdays?: boolean;
  numberOfMonths: number;
  shouldScrollSelectedDateIntoView?: boolean;
  hasNoAvailableDates: boolean;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  onMonthChange?: (month: Date) => void;
  className?: string;
  currentMonth?: Date;
  isAnimating?: boolean;
  allowSelectDisabledPeriodsInDatesRange?: boolean;
};

const FixedRangeDatePicker = ({
  onDateSelection,
  selectedDates,
  dates,
  initialMonth,
  canChangeMonth,
  fixedLength,
  numberOfMonths,
  hasNoAvailableDates,
  shouldScrollSelectedDateIntoView,
  showWeekdays,
  onMonthChange,
  className,
  currentMonth,
  isAnimating,
  allowSelectDisabledPeriodsInDatesRange = true,
}: Props) => {
  const initialHoverRange: SharedTypes.SelectedDates = useMemo(
    () => ({
      from: undefined,
      to: undefined,
    }),
    []
  );

  const [hoverRange, setHoverRange] = useState<SharedTypes.SelectedDates>(initialHoverRange);

  const isSelectedDateContainsDisabledDates = useCallback(
    (day: Date) => {
      if (allowSelectDisabledPeriodsInDatesRange) return false;

      return areDateIntervalsIntersectWithUnavailableDates(
        { from: day, to: addDays(day, fixedLength - 1) },
        dates
      );
    },
    [allowSelectDisabledPeriodsInDatesRange, dates, fixedLength]
  );

  const handleDayClick = useCallback(
    (day: Date) => {
      if (isSelectedDateContainsDisabledDates(day)) {
        return;
      }
      onDateSelection({
        from: day,
        to: addDays(day, fixedLength - 1),
      });
    },
    [fixedLength, isSelectedDateContainsDisabledDates, onDateSelection]
  );

  const handleDayMouseEnter = useCallback(
    (day: Date, { disabled }: DateModifiers) => {
      if (!disabled && !isSelectedDateContainsDisabledDates(day)) {
        setHoverRange({
          from: day,
          to: addDays(day, fixedLength - 1),
        });
      }
    },
    [fixedLength, isSelectedDateContainsDisabledDates]
  );

  const handleDayMouseLeave = useCallback(
    () => setHoverRange(initialHoverRange),
    [initialHoverRange]
  );
  return (
    <DatePicker
      className={className}
      canChangeMonth={canChangeMonth}
      showWeekDays={showWeekdays}
      numberOfMonths={numberOfMonths}
      selectedDates={selectedDates}
      initialMonth={initialMonth}
      onDayClick={handleDayClick}
      onDayMouseEnter={handleDayMouseEnter}
      onDayMouseLeave={handleDayMouseLeave}
      hasNoAvailableDates={hasNoAvailableDates}
      dates={dates}
      hoverRange={hoverRange}
      shouldScrollSelectedDateIntoView={shouldScrollSelectedDateIntoView}
      onMonthChange={onMonthChange}
      currentMonth={currentMonth}
      isAnimating={isAnimating}
    />
  );
};

export default FixedRangeDatePicker;
