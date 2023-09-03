import { useContext, useEffect } from "react";

import { constructDates } from "../utils/tourBookingWidgetUtils";
import bookingWidgetConstantContext from "../contexts/BookingWidgetConstantContext";

import useDateAvailability from "./useDateAvailability";

import { useSettings } from "contexts/SettingsContext";
import useSession from "hooks/useSession";
import { formatMarketplace } from "utils/apiUtils";

export const useGetAvailableDates = (
  onComplete?: (dates: TourBookingWidgetTypes.QueryDates) => void
) => {
  const { user } = useSession();
  const { marketplace } = useSettings();
  const { currentRequestAuth, id } = useContext(bookingWidgetConstantContext);
  const { datesData, loading, error } = useDateAvailability({
    id,
    marketplace: formatMarketplace(marketplace),
    currentRequestAuth,
  });

  useEffect(() => {
    if (!loading) {
      onComplete?.(datesData);
    }
  }, [datesData, loading, onComplete]);

  if (error) throw error;
  if (!datesData || loading) {
    return { loading, datesData, constructedDates: undefined };
  }
  const constructedDates = constructDates(datesData, user?.isAdmin);

  return { loading, datesData, constructedDates };
};
