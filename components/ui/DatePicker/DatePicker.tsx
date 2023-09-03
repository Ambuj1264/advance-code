import React from "react";
import { useMediaQuery } from "react-responsive";
import { useTheme } from "emotion-theming";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import CommonDatePicker, { DateModifiers } from "./CommonDatePicker";

import { breakpointsMax, whiteColor, fontWeightSemibold } from "styles/variables";

/* eslint-disable prettier/prettier */
const styles = (color: string) =>
  css`
    .DayPicker-Day.DayPicker-Day--selected,
    .DayPicker-Day.DayPicker-Day--end {
      border-radius: 1px;
      background-color: ${color};
      color: ${whiteColor};
      font-weight: ${fontWeightSemibold};
    }
    
    .DayPicker-Day--hoverRange:not(.DayPicker-Day--hoverRangeStart):not(.DayPicker-Day--hoverRangeEnd) {
      background-color: ${rgba(color, 0.2)};
    }

    .DayPicker-Day--hoverRange,
    .DayPicker-Day.DayPicker-Day--hoverRangeStart,
    .DayPicker-Day.DayPicker-Day--hoverRangeEnd {
      border-radius: 1px;
      background-color: ${rgba(color, 0.4)};
      color: ${whiteColor};
      font-weight: ${fontWeightSemibold};
    }
    
    .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--hoverRange) {
      background-color: ${rgba(color, 0.8)};
    }
  `;
/* eslint-enable prettier/prettier */

const DatePicker = ({
  showWeekDays,
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
  onMonthChange,
  className = "",
  currentMonth,
  isAnimating,
}: {
  selectedDates: SharedTypes.SelectedDates;
  hoverRange?: SharedTypes.SelectedDates;
  dates: SharedTypes.Dates;
  canChangeMonth?: boolean;
  showWeekDays?: boolean;
  isLoading?: boolean;
  numberOfMonths: number;
  onDayClick: (date: Date) => void;
  onDayMouseEnter: (date: Date, modifiers: DateModifiers) => void;
  onDayMouseLeave?: () => void;
  hasNoAvailableDates: boolean;
  initialMonth?: Date;
  shouldScrollSelectedDateIntoView?: boolean;
  color?: "action" | "primary";
  onMonthChange?: (month: Date) => void;
  className?: string;
  currentMonth?: Date;
  isAnimating?: boolean;
}) => {
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const modifiers = {
    start: selectedDates.from,
    end: selectedDates.to,
    hoverRange: !isMobile && hoverRange,
    hoverRangeStart: !isMobile && hoverRange?.from,
    hoverRangeEnd: !isMobile && hoverRange?.to,
  };

  const theme: Theme = useTheme();

  return (
    <CommonDatePicker
      className={className}
      canChangeMonth={canChangeMonth}
      showWeekDays={showWeekDays}
      selectedDates={selectedDates}
      initialMonth={initialMonth}
      customStyles={styles(theme.colors[color])}
      numberOfMonths={numberOfMonths}
      selectedDays={[selectedDates.from, selectedDates]}
      dates={dates}
      onDayClick={onDayClick}
      onDayMouseEnter={onDayMouseEnter}
      onDayMouseLeave={onDayMouseLeave}
      hasNoAvailableDates={hasNoAvailableDates}
      isLoading={isLoading}
      shouldScrollSelectedDateIntoView={shouldScrollSelectedDateIntoView}
      modifiers={modifiers}
      onMonthChange={onMonthChange}
      currentMonth={currentMonth}
      isAnimating={isAnimating}
    />
  );
};

export default DatePicker;
