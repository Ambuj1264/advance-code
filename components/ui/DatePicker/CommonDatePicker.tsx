import React, { useEffect, useContext, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import { css, SerializedStyles } from "@emotion/core";
import { format, subWeeks, startOfDay } from "date-fns";
import { LocaleUtils } from "react-day-picker";

import DatePickerCaption from "./DatePickerCaption";
import DatePickerNavbar from "./DatePickerNavbar";
import { formatMonthTitle } from "./utils/datePickerUtils";

import { getWeekdays } from "utils/dateUtils";
import CustomNextDynamic from "lib/CustomNextDynamic";
import {
  breakpointsMax,
  blackColor,
  separatorColorLight,
  gutters,
  placeholderColor,
  greyColor,
} from "styles/variables";
import LocaleContext from "contexts/LocaleContext";
import { typographyCaption, typographySubtitle2, typographyCaptionSmall } from "styles/typography";
import { mqMin, mqMax } from "styles/base";
import LoadingDatePicker, { LoadingDatePickerMulti } from "components/ui/Loading/LoadingDatePicker";

const DayPickerMulti = CustomNextDynamic<any>(
  () => import(/* webpackChunkName: "reactDayPicker" */ "react-day-picker"),
  {
    ssr: false,
    loading: () => <LoadingDatePickerMulti />,
  }
);
const DayPickerSingle = CustomNextDynamic<any>(
  () => import(/* webpackChunkName: "reactDayPicker" */ "react-day-picker"),
  {
    ssr: false,
    loading: () => <LoadingDatePicker />,
  }
);

export type DateModifiers = {
  disabled?: boolean;
};

export type CaptionElementProps = {
  date: Date;
  locale: string;
  months: string[];
  localeUtils: {
    formatMonthTitle: (month: Date, locale: string) => string;
  };
  classNames: {
    caption: string;
  };
};

const styles = (
  isLoading: boolean,
  canChangeMonth: boolean,
  numberOfMonths: number,
  isMobile: boolean,
  customStyles?: SerializedStyles
) =>
  css`
    ${customStyles};
    .DayPicker {
      display: inline-block;
    }

    .DayPicker-wrapper {
      position: relative;
      flex-direction: row;
      user-select: none;
      ${mqMin.large} {
        text-align: center;
      }
    }
    .DayPicker-Months {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: ${gutters.small}px;
      width: 100%;
      padding: 0;
      ${mqMin.large} {
        flex-wrap: nowrap;
        justify-content: unset;
        margin-top: 0;
      }
    }

    .DayPicker-Month {
      display: ${numberOfMonths === 1 || isMobile ? "table" : "block"};
      margin-bottom: ${gutters.large}px;
      width: 100%;
      user-select: none;
      border-collapse: collapse;
      border-spacing: 0;
      ${mqMin.large} {
        display: ${numberOfMonths === 1 ? "table" : "block"};
        margin-bottom: 0;
      }
      &:not(:first-of-type) {
        margin-left: 0;

        ${mqMin.large} {
          margin-left: ${gutters.large}px;
        }
      }
    }
    .DayPicker-Caption {
      display: table-caption;
      margin: 0;
      padding: 0 0 ${gutters.small}px 0;
      text-align: ${canChangeMonth ? "center" : "left"};
      ${typographySubtitle2};
      ${mqMin.large} {
        padding-top: ${gutters.small / 2}px;
      }
    }

    .DayPicker-Body {
      display: table-row-group;
    }

    .DayPicker-Weekdays {
      display: table-header-group;
      margin-top: 1em;
    }

    .DayPicker-WeekdaysRow {
      display: table-row;
    }

    .DayPicker-Week {
      display: table-row;
    }

    .DayPicker-Weekday {
      display: table-cell;
      padding: ${gutters.small / 2}px;
      color: ${blackColor};
      text-align: center;
      ${typographyCaptionSmall};
    }
    /* stylelint-disable-next-line selector-max-type */
    .DayPicker-Weekday abbr[title] {
      border-bottom: none;
      text-decoration: none;
    }
    .DayPicker-Day {
      display: table-cell;
      padding: ${gutters.large / 2}px;
      cursor: pointer;
      color: ${isLoading ? "transparent" : greyColor};
      text-align: center;
      vertical-align: middle;
      ${typographyCaption};
      ${mqMax.desktop} {
        height: 34px;
        padding: ${gutters.large / 4}px;
      }
      ${mqMax.large} {
        height: auto;
        padding: ${gutters.large / 2}px;
      }
    }

    .DayPicker-Day,
    .DayPicker-Day--selected {
      border: 1px solid ${separatorColorLight};
    }

    .DayPicker--interactionDisabled .DayPicker-Day {
      cursor: default;
    }

    .DayPicker-Day--outside {
      border: 0;
      visibility: hidden;
    }

    .DayPicker-Day--disabled {
      cursor: default;
      color: ${placeholderColor};
    }
  `;

const ONE_MONTH = 1;

const DatePicker = ({
  showWeekDays,
  onDayClick,
  onDayMouseEnter,
  onDayMouseLeave,
  selectedDates,
  numberOfMonths,
  canChangeMonth,
  initialMonth,
  dates: { unavailableDates, min, max, unavailableDatesRange },
  isLoading = false,
  shouldScrollSelectedDateIntoView = false,
  hasNoAvailableDates,
  modifiers,
  selectedDays,
  customStyles,
  onMonthChange,
  className,
  currentMonth,
  isAnimating = false,
}: {
  selectedDates: SharedTypes.SelectedDates;
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
  modifiers: any;
  selectedDays: (Date | SharedTypes.SelectedDates | undefined)[];
  customStyles: SerializedStyles;
  onMonthChange?: (month: Date) => void;
  className?: string;
  currentMonth?: Date;
  isAnimating?: boolean;
}) => {
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });

  const activeLocale = useContext(LocaleContext);
  useEffect(() => {
    if (shouldScrollSelectedDateIntoView && selectedDates.from) {
      const selectedAriaLabel = format(subWeeks(selectedDates.from, 4), "eee MMM dd yyyy");
      const selectedDay = document.querySelector(`[aria-label='${selectedAriaLabel}']`);
      if (selectedDay) {
        selectedDay.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    // Stop cookie banner from closing the date picker
    const cookieButton = document.querySelector("#cookiebanner a.c-button");
    if (cookieButton) {
      cookieButton.addEventListener("click", e => e.stopPropagation(), {
        once: true,
      });
    }
  }, [selectedDates.from, shouldScrollSelectedDateIntoView]);

  const handleDayClick = useCallback(
    (day: Date, { disabled }: DateModifiers) => {
      if (!disabled) {
        onDayClick(startOfDay(day));
      }
    },
    [onDayClick]
  );

  const DayPicker = numberOfMonths === ONE_MONTH ? DayPickerSingle : DayPickerMulti;

  const handleOnMonthChange = useCallback(
    (month: Date) => {
      onMonthChange?.(month);
    },
    [onMonthChange]
  );

  const isMaxDate = Boolean(
    currentMonth &&
      currentMonth.getMonth() === max?.getMonth() &&
      currentMonth.getFullYear() === max?.getFullYear()
  );

  const isMinDate = Boolean(
    currentMonth &&
      currentMonth.getMonth() === min?.getMonth() &&
      currentMonth.getFullYear() === min?.getFullYear()
  );
  return (
    <DayPicker
      className={className}
      locale={activeLocale}
      localeUtils={{ ...LocaleUtils, formatMonthTitle }}
      weekdaysShort={getWeekdays("short", activeLocale)}
      canChangeMonth={canChangeMonth}
      showWeekDays={showWeekDays}
      initialMonth={initialMonth}
      css={styles(isLoading, Boolean(canChangeMonth), numberOfMonths, isMobile, customStyles)}
      numberOfMonths={numberOfMonths}
      selectedDays={selectedDays}
      onDayClick={handleDayClick}
      modifiers={modifiers}
      hideTodayButton
      disabledDays={[
        ...unavailableDates,
        ...(unavailableDatesRange ?? []),
        {
          before: min,
          after: max,
          daysOfWeek: hasNoAvailableDates ? [0, 1, 2, 3, 4, 5, 6] : [],
        },
      ]}
      navbarElement={
        <DatePickerNavbar
          isNextDisabled={isMaxDate || isAnimating}
          isPreviousDisabled={isMinDate || isAnimating}
        />
      }
      // eslint-disable-next-line react/no-unstable-nested-components
      captionElement={({ date, locale, localeUtils, months, classNames }: CaptionElementProps) => (
        <DatePickerCaption
          date={date}
          locale={locale}
          localeUtils={localeUtils}
          months={months}
          classNames={classNames}
        />
      )}
      onDayMouseEnter={onDayMouseEnter}
      onDayMouseLeave={onDayMouseLeave}
      onMonthChange={handleOnMonthChange}
      month={currentMonth}
      fromMonth={currentMonth ? min : undefined}
      toMonth={currentMonth ? max : undefined}
    />
  );
};

export default DatePicker;
