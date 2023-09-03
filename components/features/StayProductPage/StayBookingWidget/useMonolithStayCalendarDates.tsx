import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";

import { useStayBookingWidgetContext } from "./StayBookingWidgetStateContext";
import DateAvailabilityQuery from "./queries/DateAvailabilityQuery.graphql";
import { constructDates } from "./utils/stayBookingWidgetUtils";

import { shouldSetInitalSelectedDates } from "components/ui/DatePicker/utils/datePickerUtils";
import { getSelectedDatesFromLocalStorage } from "utils/localStorageUtils";
import useSession from "hooks/useSession";
import { useSettings } from "contexts/SettingsContext";
import { Marketplace } from "types/enums";

const useMonolithStayCalendarDates = ({
  selectedDates,
  onDateSelection,
}: {
  selectedDates: SharedTypes.SelectedDates;
  onDateSelection: (newSelectedDates: SharedTypes.SelectedDates) => void;
}) => {
  const { user } = useSession();
  const { marketplace } = useSettings();
  const { slug, cartItem } = useStayBookingWidgetContext();
  const lsSelectedDates = useMemo(() => getSelectedDatesFromLocalStorage(), []);
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const { data, loading } = useQuery<StayBookingWidgetTypes.QueryAvailableDatesData>(
    DateAvailabilityQuery,
    { variables: { slug }, skip: isGTE }
  );

  useEffect(() => {
    if (isGTE) return;
    if (cartItem) {
      const { from, to } = cartItem;
      // eslint-disable-next-line consistent-return
      return onDateSelection({
        from: from ? new Date(from) : undefined,
        to: to ? new Date(to) : undefined,
      });
    }
    if (data?.dateAvailability?.min && data?.dateAvailability?.max && !selectedDates.from) {
      if (
        shouldSetInitalSelectedDates(
          lsSelectedDates,
          constructDates(data.dateAvailability, selectedDates, false)
        )
      ) {
        onDateSelection(lsSelectedDates);
      }
    }
  }, [cartItem, data?.dateAvailability]);
  const dates =
    isGTE || loading || !data?.dateAvailability
      ? { unavailableDates: [], min: new Date() }
      : constructDates(data.dateAvailability, selectedDates, user?.isAdmin);
  return {
    loading,
    dates,
  };
};

export default useMonolithStayCalendarDates;
