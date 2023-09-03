import React, { useState, useCallback } from "react";

import { DateRangeEnum } from "../DatePicker/utils/datePickerUtils";

import MobileDateRangePicker from "components/ui/DatePicker/MobileDateRangePicker";
import useActiveLocale from "hooks/useActiveLocale";

const MobileStepDates = ({
  selectedDates,
  dates,
  onDateSelection,
  color = "action",
  fromPlaceholder,
  toPlaceholder,
  fromLabel,
  toLabel,
  onClear,
  isSingleDate = false,
  allowSameDateSelection = true,
  className,
}: {
  selectedDates: SharedTypes.SelectedDates;
  dates?: SharedTypes.Dates;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  color?: "action" | "primary";
  fromPlaceholder: string;
  toPlaceholder: string;
  fromLabel: string;
  toLabel: string;
  onClear?: () => void;
  isSingleDate?: boolean;
  allowSameDateSelection?: boolean;
  className?: string;
}) => {
  const browserDate = new Date();
  const activeLocale = useActiveLocale();
  const [activeDateType, setActiveDateType] = useState(DateRangeEnum.onFromActive);
  const onClearDates = useCallback(() => onDateSelection({ from: undefined, to: undefined }), []);
  const onChangeDates = useCallback(
    (newDates: SharedTypes.SelectedDates) => {
      onDateSelection(newDates);
      if (activeDateType === DateRangeEnum.onFromActive && !isSingleDate) {
        setActiveDateType(DateRangeEnum.onToActive);
      }
    },
    [onDateSelection, setActiveDateType, isSingleDate]
  );
  return (
    <MobileDateRangePicker
      className={className}
      selectedDates={selectedDates}
      onDateSelection={onChangeDates}
      dates={dates || { unavailableDates: [], min: browserDate }}
      hasNoAvailableDates={false}
      color={color}
      activeLocale={activeLocale}
      onClear={onClear || onClearDates}
      fromPlaceholder={fromPlaceholder}
      toPlaceholder={toPlaceholder}
      setActiveDateType={setActiveDateType}
      fromLabel={fromLabel}
      toLabel={toLabel}
      allowSeparateSelection
      activeInputType={activeDateType}
      showDateTo={!isSingleDate}
      allowSameDateSelection={allowSameDateSelection}
    />
  );
};

export default MobileStepDates;
