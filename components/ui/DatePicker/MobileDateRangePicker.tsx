import React from "react";
import styled from "@emotion/styled";

import { DoubleLabel } from "../MobileSteps/AutocompleteModalHelpers";

import { DateRangeEnum } from "./utils/datePickerUtils";
import { DisplayWrapper, ClearWrapper, CloseStyled } from "./MobileMultiRangeDatePicker";

import MobileDatePickerHeader from "components/ui/DatePicker/MobileDatePickerHeader";
import DateRangePicker from "components/ui/DatePicker/DateRangePicker";
import { Trans } from "i18n";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import CalendarDropdownDisplay from "components/ui/DatePicker/CalendarDropdownDisplay";
import { getShortMonthNumbericDateFormat } from "utils/dateUtils";

export const StyledMobileDatePickerSectionHeading = styled(MobileSectionHeading)();

const MobileDateRangePicker = ({
  selectedDates,
  onDateSelection,
  dates,
  color,
  hasNoAvailableDates,
  activeLocale,
  onClear,
  fromPlaceholder,
  toPlaceholder,
  showDateFrom,
  showDateTo,
  setActiveDateType,
  fromLabel,
  toLabel,
  allowSeparateSelection,
  activeInputType,
  allowSameDateSelection = true,
  className,
}: {
  selectedDates: SharedTypes.SelectedDates;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  dates: SharedTypes.Dates;
  color?: "action" | "primary";
  hasNoAvailableDates: boolean;
  activeLocale: string;
  onClear?: () => void;
  fromPlaceholder: string;
  toPlaceholder: string;
  showDateFrom?: boolean;
  showDateTo?: boolean;
  setActiveDateType: (activeDateType: DateRangeEnum) => void;
  fromLabel: string;
  toLabel: string;
  allowSeparateSelection?: boolean;
  activeInputType: DateRangeEnum;
  allowSameDateSelection?: boolean;
  className?: string;
}) => {
  const canClearDates = selectedDates.from || selectedDates.to;
  const startDate = selectedDates.from
    ? getShortMonthNumbericDateFormat(selectedDates.from, activeLocale)
    : undefined;
  const endDate = selectedDates.to
    ? getShortMonthNumbericDateFormat(selectedDates.to, activeLocale)
    : undefined;
  return (
    <div className={className}>
      <MobileDatePickerHeader activeLocale={activeLocale}>
        <StyledMobileDatePickerSectionHeading>
          <Trans>Select dates</Trans>
          {onClear && canClearDates && (
            <ClearWrapper onClick={onClear}>
              <Trans>Clear</Trans>
              <CloseStyled />
            </ClearWrapper>
          )}
        </StyledMobileDatePickerSectionHeading>
        <DoubleLabel leftLabel={fromLabel} rightLabel={showDateTo ? toLabel : undefined} />
        <DisplayWrapper>
          <CalendarDropdownDisplay
            from={startDate}
            to={endDate}
            fromPlaceholder={fromPlaceholder}
            toPlaceholder={toPlaceholder}
            onFromClick={() => setActiveDateType(DateRangeEnum.onFromActive)}
            onToClick={() => setActiveDateType(DateRangeEnum.onToActive)}
            activeInput={activeInputType}
            onClear={onClear}
            showDateFrom={showDateFrom}
            showDateTo={showDateTo}
          />
        </DisplayWrapper>
      </MobileDatePickerHeader>
      <DateRangePicker
        shouldScrollSelectedDateIntoView
        canChangeMonth={false}
        showWeekdays={false}
        numberOfMonths={24}
        selectedDates={selectedDates}
        onDateSelection={onDateSelection}
        initialMonth={new Date()}
        dates={dates}
        hasNoAvailableDates={hasNoAvailableDates}
        color={color}
        allowSeparateSelection={allowSeparateSelection}
        activeInputType={activeInputType}
        allowSameDateSelection={allowSameDateSelection}
      />
    </div>
  );
};

export default MobileDateRangePicker;
