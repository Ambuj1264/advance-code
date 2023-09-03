import React, { useCallback, useState } from "react";
import { css, keyframes } from "@emotion/core";
import styled from "@emotion/styled";

import FixedRangeDatePickerMobile from "../../ProductPage/BookingWidget/DatePicker/FixedRangeDatePickerMobile";

import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { SupportedLanguages } from "types/enums";
import {
  filterDatesGreaterThan,
  filterDatesLessThan,
  findInDates,
  getMonthConditions,
  reverseDatesLesserThanCurrent,
} from "components/ui/DatePicker/utils/datePickerUtils";
import FixedRangeDatePickerDesktop from "components/features/ProductPage/BookingWidget/DatePicker/FixedRangeDatePickerDesktop";
import { ArrowIcon } from "components/ui/Inputs/ContentDropdown";

const ANIMATION_DURATION = 500;

const slideInAndVisible = keyframes`
  0% {
    opacity: 0;
  }
  60% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const datePickerMonthStyles = css`
  .DayPicker-wrapper {
    overflow: hidden;
  }

  ${ArrowIcon} {
    width: 20px;
  }
`;

const animationStyleLeft = css`
  .DayPicker-Month {
    transform: translateX(-100%);
    animation: ${slideInAndVisible} ${ANIMATION_DURATION}ms both;
  }
`;

const animationStyleRight = css`
  .DayPicker-Month {
    transform: translateX(100%);
    animation: ${slideInAndVisible} ${ANIMATION_DURATION}ms both;
  }
`;

const StyledFixedRangeDatePickerDesktop = styled(FixedRangeDatePickerDesktop)(
  datePickerMonthStyles
);

const DatePickerContent = ({
  isMobile,
  onDateSelection,
  dates,
  lengthOfTour,
  startDate,
  endDate,
  selectedDates,
  activeLocale,
  initialMonth,
  onOpenStateChange,
  className,
  hideInputLabel,
  onDateInputClick,
  canOpenDropdown = true,
}: {
  isMobile: boolean;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  dates: SharedTypes.Dates;
  lengthOfTour: number;
  startDate?: string;
  endDate?: string;
  selectedDates: SharedTypes.SelectedDates;
  activeLocale: SupportedLanguages;
  initialMonth?: Date;
  className?: string;
  hideInputLabel?: boolean;
  canOpenDropdown?: boolean;
  onDateInputClick?: () => void;
} & BookingWidgetTypes.onOpenStateChange) => {
  const { t } = useTranslation(Namespaces.tourSearchNs);
  const { min, max, availableDates } = dates;
  const [currentMonth, setCurrentMonth] = useState<Date | undefined>(initialMonth);
  const [animationCurrentPosition, setAnimationCurrentPosition] = useState<
    "right" | "left" | undefined
  >();
  const [playAnimation, setPlayAnimation] = useState(false);
  const animationStyles = () => {
    switch (animationCurrentPosition) {
      case "right":
        return animationStyleRight;
      case "left":
        return animationStyleLeft;
      default:
        return undefined;
    }
  };

  const onMonthChange = useCallback(
    (changedToMonth: Date) => {
      if (availableDates) {
        const { isPastMonth, isFutureMonth, isAvailableMonth } = getMonthConditions(
          availableDates,
          changedToMonth,
          currentMonth
        );
        setAnimationCurrentPosition(undefined);

        if (isAvailableMonth || (!min && changedToMonth < new Date())) {
          setCurrentMonth(changedToMonth);
          return;
        }
        setPlayAnimation(true);
        setAnimationCurrentPosition(isPastMonth ? "left" : "right");

        if (isPastMonth) {
          setCurrentMonth(
            findInDates(
              reverseDatesLesserThanCurrent(availableDates, changedToMonth),
              filterDatesLessThan(changedToMonth)
            ) || min
          );
        }
        if (isFutureMonth || !currentMonth) {
          setCurrentMonth(
            findInDates(availableDates, filterDatesGreaterThan(changedToMonth)) || max
          );
        }
        setTimeout(() => {
          setPlayAnimation(false);
        }, ANIMATION_DURATION);
      }
    },
    [availableDates, min, currentMonth, max]
  );

  if (isMobile) {
    return (
      <FixedRangeDatePickerMobile
        onDateSelection={onDateSelection}
        dates={dates}
        lengthOfTour={lengthOfTour}
        selectedDates={selectedDates}
        startDateString={startDate}
        endDateString={endDate}
        activeLocale={activeLocale}
        fromPlaceholder={t("Starting date")}
        toPlaceholder={t("Final date")}
        fromLabel={t("From")}
        toLabel={t("To")}
      />
    );
  }

  return (
    <StyledFixedRangeDatePickerDesktop
      className={className}
      onDateSelection={onDateSelection}
      dates={dates}
      lengthOfTour={lengthOfTour}
      selectedDates={selectedDates}
      initialMonth={initialMonth}
      onMonthChange={onMonthChange}
      playAnimation={playAnimation}
      animationStyles={animationStyles()}
      currentMonth={currentMonth}
      onOpenStateChange={onOpenStateChange}
      hideInputLabel={hideInputLabel}
      onDateInputClick={onDateInputClick}
      canOpenDropdown={canOpenDropdown}
    />
  );
};

export default DatePickerContent;
