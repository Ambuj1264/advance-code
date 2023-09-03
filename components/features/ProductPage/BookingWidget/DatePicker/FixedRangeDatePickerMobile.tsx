import React, { useMemo, useCallback } from "react";
import { differenceInCalendarMonths } from "date-fns";

import { DoubleLabel } from "components/ui/MobileSteps/AutocompleteModalHelpers";
import MobileDatePickerHeader from "components/ui/DatePicker/MobileDatePickerHeader";
import FixedRangeDatePicker from "components/ui/DatePicker/FixedRangeDatePicker";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { Trans } from "i18n";
import CalendarDropdownDisplay from "components/ui/DatePicker/CalendarDropdownDisplay";
import {
  DisplayWrapper,
  ClearWrapper,
  CloseStyled,
} from "components/ui/DatePicker/MobileMultiRangeDatePicker";

const MobileDatePicker = ({
  onDateSelection,
  selectedDates,
  dates: { unavailableDates, min, max, unavailableDatesRange },
  lengthOfTour,
  startDateString,
  endDateString,
  activeLocale,
  allowSelectDisabledPeriodsInDatesRange = true,
  fromLabel,
  toLabel,
  fromPlaceholder,
  toPlaceholder,
  allowClearDates = true,
}: {
  selectedDates: SharedTypes.SelectedDates;
  dates: SharedTypes.Dates;
  lengthOfTour: number;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  startDateString?: string;
  endDateString?: string;
  activeLocale: string;
  allowSelectDisabledPeriodsInDatesRange?: boolean;
  fromLabel: string;
  toLabel: string;
  fromPlaceholder: string;
  toPlaceholder: string;
  allowClearDates?: boolean;
}) => {
  const hasNoAvailableDates = min === undefined && max === undefined;

  const numberOfMonths = useMemo(
    /* If min is undefined (happens with admins) we use the current date
       so that we get the number of months until the max date.
       If max is undefined (happens for sold out tours) we use the current date
       so that we get at least a correct calculation
    */
    () => differenceInCalendarMonths(max || Date.now(), min || Date.now()) + 1,
    [max, min]
  );
  const canClearDates = selectedDates.from || selectedDates.to;
  const onClearDates = useCallback(() => onDateSelection({ from: undefined, to: undefined }), []);
  return (
    <>
      <MobileDatePickerHeader activeLocale={activeLocale}>
        <MobileSectionHeading>
          <Trans>Select dates</Trans>
          {allowClearDates && canClearDates && (
            <ClearWrapper onClick={onClearDates}>
              <Trans>Clear</Trans>
              <CloseStyled />
            </ClearWrapper>
          )}
        </MobileSectionHeading>
        <DoubleLabel leftLabel={fromLabel} rightLabel={toLabel} />
        <DisplayWrapper>
          <CalendarDropdownDisplay
            from={startDateString}
            to={endDateString}
            fromPlaceholder={fromPlaceholder}
            toPlaceholder={toPlaceholder}
            onClear={allowClearDates ? onClearDates : undefined}
          />
        </DisplayWrapper>
      </MobileDatePickerHeader>
      <FixedRangeDatePicker
        fixedLength={lengthOfTour}
        shouldScrollSelectedDateIntoView
        canChangeMonth={false}
        showWeekdays={false}
        numberOfMonths={numberOfMonths}
        selectedDates={selectedDates}
        onDateSelection={onDateSelection}
        initialMonth={min}
        hasNoAvailableDates={hasNoAvailableDates}
        dates={{ min, max, unavailableDates, unavailableDatesRange }}
        allowSelectDisabledPeriodsInDatesRange={allowSelectDisabledPeriodsInDatesRange}
      />
    </>
  );
};

export default MobileDatePicker;
