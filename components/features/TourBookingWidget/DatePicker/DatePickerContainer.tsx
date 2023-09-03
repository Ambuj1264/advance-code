import React, { memo, useCallback } from "react";

import { onDateAvailabilityComplete } from "../utils/tourBookingWidgetUtils";
import { useGetAvailableDates } from "../hooks/useGetAvailableDates";

import DatePickerContent from "./DatePickerContent";

import useActiveLocale from "hooks/useActiveLocale";
import DatePickerLoading from "components/ui/DatePicker/DatePickerLoading";
import { getInitialMonth } from "components/ui/DatePicker/utils/datePickerUtils";
import { useIsMobile } from "hooks/useMediaQueryCustom";

type Props = {
  lengthOfTour: number;
  selectedDates: SharedTypes.SelectedDates;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  editItem?: TourBookingWidgetTypes.EditItem;
  startDate?: string;
  endDate?: string;
};

const DatePickerContainer = ({
  onDateSelection,
  selectedDates,
  lengthOfTour,
  editItem,
  startDate,
  endDate,
}: Props) => {
  const activeLocale = useActiveLocale();

  const onAfterAvailableDatesLoaded = useCallback(
    (datesData: TourBookingWidgetTypes.QueryDates) => {
      onDateAvailabilityComplete(lengthOfTour, onDateSelection, datesData, editItem);
    },
    [editItem, lengthOfTour, onDateSelection]
  );

  const { loading, datesData, constructedDates } = useGetAvailableDates(
    onAfterAvailableDatesLoaded
  );

  const isMobile = useIsMobile();

  if (!datesData || loading) {
    return <DatePickerLoading />;
  }
  const initialMonth = () => {
    if (editItem) return editItem.date;
    if (selectedDates.from) return selectedDates.from;
    return getInitialMonth({
      dates: constructedDates!,
      fixedLength: lengthOfTour,
    });
  };
  return (
    <DatePickerContent
      onDateSelection={onDateSelection}
      dates={constructedDates!}
      lengthOfTour={lengthOfTour}
      selectedDates={selectedDates}
      startDate={startDate}
      endDate={endDate}
      activeLocale={activeLocale}
      initialMonth={initialMonth()}
      isMobile={isMobile}
    />
  );
};

export default memo(DatePickerContainer);
