import React from "react";
import { useMediaQuery } from "react-responsive";
import { useTheme } from "emotion-theming";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import eachDayOfInterval from "date-fns/eachDayOfInterval";

import CommonDatePicker, { DateModifiers } from "./CommonDatePicker";

import { breakpointsMax, whiteColor, fontWeightSemibold } from "styles/variables";

/* eslint-disable prettier/prettier */
const styles = (color: string) =>
  css`
    .DayPicker-Day.DayPicker-Day--selected.DayPicker-Day.DayPicker-Day--departureSelected.DayPicker-Day.DayPicker-Day--returnSelected {
      background: linear-gradient(
        to bottom right,
        ${rgba(color, 0.6)} 50%,
        ${color} 50%
      );
      background-color: ${rgba(color, 0.4)};
      background-repeat: no-repeat;
    }
    .DayPicker-Day.DayPicker-Day--start,
    .DayPicker-Day.DayPicker-Day--returnStart,
    .DayPicker-Day.DayPicker-Day--end,
    .DayPicker-Day.DayPicker-Day--returnEnd,
    .DayPicker-Day.DayPicker-Day--selected,
    .DayPicker-Day.DayPicker-Day--departureSelected,
    .DayPicker-Day.DayPicker-Day--returnSelected {
      border-radius: 1px;
      background-color: ${color};
      color: ${whiteColor};
      font-weight: ${fontWeightSemibold};
    }
    .DayPicker-Day--selected:not(.DayPicker-Day.DayPicker-Day--departureSelected.DayPicker-Day.DayPicker-Day--returnSelected):not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--returnStart):not(.DayPicker-Day--returnEnd):not(.DayPicker-Day--hoverRange) {
      background-color: ${rgba(color, 0.6)};
      color: ${whiteColor};
    }
    .DayPicker-Day.DayPicker-Day--hoverRange:not(.DayPicker-Day--start):not(.DayPicker-Day--returnStart) {
      border-radius: 1px;
      background-color: ${rgba(color, 0.4)};
      color: ${whiteColor};
      font-weight: ${fontWeightSemibold};
    }
  `;
/* eslint-enable prettier/prettier */

const MultiDateRangePicker = ({
  showWeekdays = true,
  onDayClick,
  onDayMouseEnter,
  onDayMouseLeave,
  selectedDates,
  hoverRange,
  numberOfMonths,
  canChangeMonth,
  initialMonth,
  dates,
  isLoading = false,
  shouldScrollSelectedDateIntoView = false,
  hasNoAvailableDates,
  color = "action",
  selectedReturnDates,
  useExactDates,
}: {
  showWeekdays?: boolean;
  selectedDates: SharedTypes.SelectedDates;
  hoverRange?: SharedTypes.SelectedDates;
  dates: SharedTypes.Dates;
  canChangeMonth?: boolean;
  isLoading?: boolean;
  numberOfMonths: number;
  onDayClick: (date: Date) => void;
  onDayMouseEnter: (date: Date, modifiers: DateModifiers) => void;
  onDayMouseLeave?: () => void;
  hasNoAvailableDates: boolean;
  initialMonth?: Date;
  shouldScrollSelectedDateIntoView?: boolean;
  color?: "action" | "primary";
  selectedReturnDates: SharedTypes.SelectedDates;
  useExactDates: boolean;
}) => {
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const modifiers = {
    start: selectedDates.from,
    end: useExactDates ? selectedReturnDates.from : selectedDates.to,
    returnStart: useExactDates ? undefined : selectedReturnDates.from,
    returnEnd: useExactDates ? undefined : selectedReturnDates.to,
    hoverRange: !isMobile && hoverRange,
    hoverRangeStart: !isMobile && hoverRange?.from,
    hoverRangeEnd: !isMobile && hoverRange?.to,
    departureSelected:
      selectedDates.from &&
      eachDayOfInterval({
        start: selectedDates.from,
        end: selectedDates.to || selectedDates.from,
      }),
    returnSelected:
      selectedReturnDates.from &&
      eachDayOfInterval({
        start: selectedReturnDates.from,
        end: selectedReturnDates.to || selectedReturnDates.from,
      }),
  };

  const theme: Theme = useTheme();
  return (
    <CommonDatePicker
      canChangeMonth={canChangeMonth}
      showWeekDays={showWeekdays}
      selectedDates={selectedDates}
      initialMonth={initialMonth}
      customStyles={styles(theme.colors[color])}
      numberOfMonths={numberOfMonths}
      selectedDays={
        useExactDates
          ? [{ from: selectedDates.from, to: selectedReturnDates.from }]
          : [
              { from: selectedDates.from, to: selectedDates.to },
              {
                from: selectedReturnDates?.from,
                to: selectedReturnDates?.to,
              },
            ]
      }
      dates={dates}
      onDayClick={onDayClick}
      onDayMouseEnter={onDayMouseEnter}
      onDayMouseLeave={onDayMouseLeave}
      hasNoAvailableDates={hasNoAvailableDates}
      isLoading={isLoading}
      shouldScrollSelectedDateIntoView={shouldScrollSelectedDateIntoView}
      modifiers={modifiers}
    />
  );
};

export default MultiDateRangePicker;
