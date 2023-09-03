import { useContext, useCallback } from "react";

import bookingWidgetCallbackContext from "./contexts/BookingWidgetCallbackContext";
import bookingWidgetConstantContext from "./contexts/BookingWidgetConstantContext";
import { useGetAvailableDates } from "./hooks/useGetAvailableDates";
import { onDateAvailabilityComplete } from "./utils/tourBookingWidgetUtils";

const TourBookingWidgetAvailableDatesOnLoad = () => {
  const { lengthOfTour, editItem } = useContext(bookingWidgetConstantContext);
  const { setSelectedDates } = useContext(bookingWidgetCallbackContext);

  const onAfterAvailableDatesLoaded = useCallback(
    (datesData: TourBookingWidgetTypes.QueryDates) => {
      onDateAvailabilityComplete(lengthOfTour, setSelectedDates, datesData, editItem);
    },
    [editItem, lengthOfTour, setSelectedDates]
  );

  useGetAvailableDates(onAfterAvailableDatesLoaded);

  return null;
};

export default TourBookingWidgetAvailableDatesOnLoad;
