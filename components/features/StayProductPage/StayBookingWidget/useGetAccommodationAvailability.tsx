import { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";

import { getTotalGuests } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import AccommodationAvailabilityQuery from "components/features/StayProductPage/StayBookingWidget/queries/AccommodationAvailabilityQuery.graphql";
import { useStayBookingWidgetContext } from "components/features/StayProductPage/StayBookingWidget/StayBookingWidgetStateContext";
import { constructGroupedRatesToStayData } from "components/features/StayProductPage/StayBookingWidget/utils/stayBookingWidgetUtils";
import {
  useSetRoomTypes,
  useSetGroupedRates,
  useSetIsAvailabilityLoading,
} from "components/features/StayProductPage/StayBookingWidget/stayHooks";
import { noCacheHeaders } from "utils/apiUtils";
import { yearMonthDayFormat, getFormattedDate } from "utils/dateUtils";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

const useGetAccommodationAvailability = ({ productId }: { productId: number }) => {
  const { t } = useTranslation(Namespaces.accommodationNs);
  const { selectedDates, rooms, cartItem, occupancies } = useStayBookingWidgetContext();
  const setGroupedRates = useSetGroupedRates();
  const setRoomTypes = useSetRoomTypes();
  const setIsAvailabilityLoading = useSetIsAvailabilityLoading();
  const numberOfRooms = occupancies.length;
  const numberOfGuests = getTotalGuests(occupancies);
  const { loading } = useQuery<{
    monolithOrganizedHotelRates: {
      groupedRates: StayBookingWidgetTypes.QueryGroupedRate[];
    };
  }>(AccommodationAvailabilityQuery, {
    variables: {
      parameters: {
        productId,
        dateCheckingIn: selectedDates.from
          ? getFormattedDate(selectedDates.from, yearMonthDayFormat)
          : undefined,
        dateCheckingOut: selectedDates.to
          ? getFormattedDate(selectedDates.to, yearMonthDayFormat)
          : undefined,
        numberOfAdults: numberOfGuests.numberOfAdults,
        numberOfChildren: numberOfGuests.childrenAges.length,
        numberOfRooms,
      },
    },
    skip: !selectedDates.from || !selectedDates.to,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    context: {
      headers: {
        ...noCacheHeaders,
      },
    },
    onCompleted: ({ monolithOrganizedHotelRates }) => {
      const constructedRoomTypes = constructGroupedRatesToStayData(
        t,
        monolithOrganizedHotelRates.groupedRates,
        [],
        rooms || [],
        cartItem
      );
      setGroupedRates(monolithOrganizedHotelRates.groupedRates);
      setRoomTypes(constructedRoomTypes);
    },
  });

  useEffect(() => {
    if (loading) {
      setIsAvailabilityLoading(true);
    }
  }, [loading, setIsAvailabilityLoading]);
};

export default useGetAccommodationAvailability;
