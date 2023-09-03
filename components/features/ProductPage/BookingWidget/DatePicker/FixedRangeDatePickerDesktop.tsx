import React, { useCallback, useContext, useEffect } from "react";
import styled from "@emotion/styled";
import { SerializedStyles, css } from "@emotion/core";

import SectionBanner from "components/ui/BookingWidget/BookingWidgetSectionHeading";
import FixedRangeDatePicker from "components/ui/DatePicker/FixedRangeDatePicker";
import ContentDropdown from "components/ui/Inputs/ContentDropdown";
import { gutters } from "styles/variables";
import { createDateCaption } from "components/ui/BookingWidget/utils/bookingWidgetUtils";
import { getShortMonthNumbericDateFormat } from "utils/dateUtils";
import LocaleContext from "contexts/LocaleContext";
import useToggle from "hooks/useToggle";
import CalendarEmpty from "components/icons/calendar-empty.svg";
import { Namespaces } from "shared/namespaces";
import { useTranslation, Trans } from "i18n";

const Wrapper = styled.div`
  margin-top: ${gutters.large}px;
`;

export const CalendarIcon = styled(CalendarEmpty)(({ theme }) => [
  css`
    width: 16px;
    height: 16px;
    fill: ${theme.colors.primary};
  `,
]);

const FixedRangeDatePickerDesktop = ({
  onDateSelection,
  selectedDates,
  dates: { unavailableDates, min, max, unavailableDatesRange },
  initialMonth,
  lengthOfTour,
  onMonthChange,
  playAnimation,
  currentMonth,
  animationStyles,
  hideInputLabel = false,
  className,
  onDateInputClick,
  onOpenStateChange,
  isSadPathWithoutParams = false,
  allowSelectDisabledPeriodsInDatesRange = true,
  canOpenDropdown = true,
  dateInputRef,
}: {
  selectedDates: SharedTypes.SelectedDates;
  dates: SharedTypes.Dates;
  lengthOfTour: number;
  initialMonth?: Date;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  onMonthChange?: (month: Date) => void;
  playAnimation?: boolean;
  currentMonth?: Date;
  animationStyles?: SerializedStyles;
  hideInputLabel?: boolean;
  className?: string;
  onDateInputClick?: () => void;
  isSadPathWithoutParams?: boolean;
  allowSelectDisabledPeriodsInDatesRange?: boolean;
  canOpenDropdown?: boolean;
  dateInputRef?: React.MutableRefObject<VacationPackageTypes.dateInputRef>;
} & BookingWidgetTypes.onOpenStateChange) => {
  const activeLocale = useContext(LocaleContext);
  const { t } = useTranslation();
  const startDate =
    selectedDates.from && getShortMonthNumbericDateFormat(selectedDates.from, activeLocale);
  const endDate =
    selectedDates.to && getShortMonthNumbericDateFormat(selectedDates.to, activeLocale);
  const hasNoAvailableDates = min === undefined && max === undefined;
  const [isCalendarOpen, toggleCalendar] = useToggle(!startDate || !endDate);
  const toggleCalendarCb = useCallback(() => {
    toggleCalendar();
    onOpenStateChange?.(!isCalendarOpen);
  }, [isCalendarOpen, onOpenStateChange, toggleCalendar]);
  useEffect(() => {
    if (startDate && endDate) toggleCalendar(false);
    if (!dateInputRef || !isSadPathWithoutParams) return;
    // eslint-disable-next-line no-param-reassign
    dateInputRef.current = {
      toggleCalendarCb,
    };
  }, [dateInputRef, isSadPathWithoutParams, startDate, endDate]);
  const onOutsideClick = useCallback(
    () => isCalendarOpen && startDate && endDate && toggleCalendarCb(),
    [endDate, isCalendarOpen, startDate, toggleCalendarCb]
  );

  return (
    <Wrapper className={className}>
      {hasNoAvailableDates && (
        <SectionBanner color="error">
          <Trans ns={Namespaces.commonBookingWidgetNs}>No dates available</Trans>
        </SectionBanner>
      )}
      <ContentDropdown
        id="calendar"
        inputLabel={hideInputLabel ? undefined : t("Travel dates")}
        displayValue={
          <>
            <CalendarIcon />
            {startDate && endDate ? createDateCaption(startDate, endDate) : t("Select dates")}
          </>
        }
        isContentOpen={canOpenDropdown && isCalendarOpen}
        toggleContent={onDateInputClick || toggleCalendarCb}
        onOutsideClick={onOutsideClick}
      >
        <FixedRangeDatePicker
          canChangeMonth
          fixedLength={lengthOfTour}
          showWeekdays
          numberOfMonths={1}
          selectedDates={selectedDates}
          initialMonth={initialMonth}
          onDateSelection={dates => {
            onDateSelection(dates);
            toggleCalendarCb();
          }}
          hasNoAvailableDates={hasNoAvailableDates}
          dates={{ min, max, unavailableDates, unavailableDatesRange }}
          onMonthChange={onMonthChange}
          css={playAnimation ? animationStyles : ""}
          currentMonth={currentMonth}
          isAnimating={playAnimation}
          allowSelectDisabledPeriodsInDatesRange={allowSelectDisabledPeriodsInDatesRange}
        />
      </ContentDropdown>
    </Wrapper>
  );
};

export default FixedRangeDatePickerDesktop;
