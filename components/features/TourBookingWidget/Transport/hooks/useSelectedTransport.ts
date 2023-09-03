import { useContext } from "react";

import useEffectOnce from "hooks/useEffectOnce";
import bookingWidgetCallbackContext from "components/features/TourBookingWidget/contexts/BookingWidgetCallbackContext";
import bookingWidgetConstantContext from "components/features/TourBookingWidget/contexts/BookingWidgetConstantContext";

const useSelectedTransport = () => {
  const { editItem } = useContext(bookingWidgetConstantContext);
  const { setSelectedTransportLocation } = useContext(bookingWidgetCallbackContext);

  useEffectOnce(() => {
    setSelectedTransportLocation({
      id: editItem?.tourDetails?.placeId || 0,
      name: editItem?.tourDetails?.placeName || "",
    });
  });
};

export default useSelectedTransport;
