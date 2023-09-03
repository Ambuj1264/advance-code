import React, { useMemo, useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { getMaxMinDate } from "../utils/vacationPackageUtils";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import FixedRangeDatePickerDesktop, {
  CalendarIcon,
} from "components/features/ProductPage/BookingWidget/DatePicker/FixedRangeDatePickerDesktop";
import { DisplayValue, DropdownContainer, Wrapper } from "components/ui/Inputs/ContentDropdown";
import { gutters } from "styles/variables";
import { mqMin } from "styles/base";

const BookingDesktopDatePicker = styled(FixedRangeDatePickerDesktop)(
  ({ theme }) => css`
    margin: 0;
    ${Wrapper} {
      margin-top: ${gutters.small / 2}px;
      padding-right: 0;
      padding-left: 0;
    }
    ${DisplayValue} {
      height: 45px;
      border-color: ${theme.colors.primary};

      ${mqMin.large} {
        padding-left: 10px;
      }
    }
    ${CalendarIcon} {
      fill: ${theme.colors.primary};
    }

    ${DropdownContainer} {
      top: 50px;
      border-color: ${theme.colors.primary};
    }
  `
);

const VPDatePicker = ({
  selectedDates,
  unavailableDatesRange,
  vacationLength,
  onDateInputClick,
  onOpenStateChange,
  isSadPathWithoutParams = false,
  dateInputRef,
}: {
  selectedDates: SharedTypes.SelectedDates;
  unavailableDatesRange?: SharedTypes.SelectedDates[];
  vacationLength?: number;
  onDateInputClick?: () => void;
  isSadPathWithoutParams?: boolean;
  dateInputRef?: React.MutableRefObject<VacationPackageTypes.dateInputRef>;
} & BookingWidgetTypes.onOpenStateChange) => {
  const { onVPDateSelection } = useContext(VPActionCallbackContext);
  const availableDates = useMemo(() => getMaxMinDate(), []);
  const initialMonth = selectedDates.from || selectedDates.to || availableDates.minDate;

  const dates = useMemo(
    () => ({
      unavailableDates: [],
      unavailableDatesRange: unavailableDatesRange ?? [],
      min: availableDates.minDate,
      max: availableDates.maxDate,
    }),
    [availableDates.maxDate, availableDates.minDate, unavailableDatesRange]
  );
  return (
    <BookingDesktopDatePicker
      onDateSelection={onVPDateSelection}
      dates={dates}
      lengthOfTour={vacationLength!}
      selectedDates={selectedDates}
      initialMonth={initialMonth}
      onDateInputClick={onDateInputClick}
      onOpenStateChange={onOpenStateChange}
      isSadPathWithoutParams={isSadPathWithoutParams}
      dateInputRef={dateInputRef}
      hideInputLabel
      allowSelectDisabledPeriodsInDatesRange={false}
    />
  );
};

export default VPDatePicker;
