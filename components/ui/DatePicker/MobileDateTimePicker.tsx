import React, { SyntheticEvent } from "react";
import styled from "@emotion/styled";

import SearchWidgetDatePicker from "../SearchWidget/SearchWidgetDatePicker";
import MobileTimePicker, { MobileTimePickerSharedTypes } from "../TimePicker/MobileTimePicker";
import { DisplayValue } from "../Inputs/ContentDropdown";

import { DateRangeEnum } from "./utils/datePickerUtils";

import { gutters } from "styles/variables";

const DateTimeRow = styled.div`
  display: flex;
`;

const SearchWidgetDatePickerStyled = styled(SearchWidgetDatePicker)`
  flex-basis: 50%;
  margin-right: ${gutters.small / 2}px;

  ${DisplayValue} {
    height: 38px;
  }
`;

const MobileTimePickerStyled = styled(MobileTimePicker)`
  flex-basis: 50%;
  margin-left: ${gutters.small / 2}px;
`;

const MobileDateTimePicker = ({
  className,
  name,
  selectedDates,
  onDateSelection,
  onTimeSelection,
  displayTime,
  onDateInputClick,
  fromPlaceholder,
  toPlaceholder,
  showDateTo,
  showDateFrom,
  disabled = true,
  availableTime,
}: {
  className?: string;
  name: string;
  selectedDates: SharedTypes.SelectedDates;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  onTimeSelection: MobileTimePickerSharedTypes["onTimeSelection"];
  displayTime: SharedTypes.Time;
  onDateInputClick?: (e: SyntheticEvent, type?: DateRangeEnum) => void;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  showDateTo?: boolean;
  showDateFrom?: boolean;
  disabled?: boolean;
  availableTime?: SharedTypes.AvailableTime;
}) => {
  const browserDate = new Date();
  const initialMonth = selectedDates.from || selectedDates.to || browserDate;

  return (
    <DateTimeRow className={className}>
      <SearchWidgetDatePickerStyled
        selectedDates={selectedDates}
        initialMonth={initialMonth}
        onDateSelection={onDateSelection}
        onDateInputClick={onDateInputClick}
        minDays={1}
        numberOfMonths={1}
        dates={{ unavailableDates: [], min: browserDate }}
        fromPlaceholder={fromPlaceholder}
        toPlaceholder={toPlaceholder}
        preOpenCalendar={false}
        allowSeparateSelection
        disabled={disabled}
        showDateTo={showDateTo}
        showDateFrom={showDateFrom}
      />
      <MobileTimePickerStyled
        name={name}
        displayTime={displayTime}
        onTimeSelection={onTimeSelection}
        availableTime={availableTime}
      />
    </DateTimeRow>
  );
};

export default MobileDateTimePicker;
