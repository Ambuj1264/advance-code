import { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";

import { useStayBookingWidgetContext } from "./StayBookingWidgetStateContext";
import StayAvailabilityQuery from "./queries/StayAvailabilityQuery.graphql";
import { useSetIsAvailabilityLoading, useSetRoomCombinations } from "./stayHooks";
import { constructRoomCombinations } from "./utils/stayBookingWidgetUtils";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import { noCacheHeaders } from "utils/apiUtils";
import { yearMonthDayFormat, getFormattedDate } from "utils/dateUtils";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

const useGetStayAvailability = ({
  productId,
  ipCountryCode,
}: {
  productId: number;
  ipCountryCode?: string;
}) => {
  const { t } = useTranslation(Namespaces.accommodationNs);
  const { currencyCode } = useCurrencyWithDefault();
  const { selectedDates, occupancies } = useStayBookingWidgetContext();
  const setIsAvailabilityLoading = useSetIsAvailabilityLoading();
  const onSetRoomCombinations = useSetRoomCombinations();
  const ipCountryCodeMissiing = ipCountryCode === "";
  const { loading: gteLoading } = useQuery<{
    productPageAvailabilites: {
      roomCombinations: StayBookingWidgetTypes.QueryRoomCombination[];
    };
  }>(StayAvailabilityQuery, {
    variables: {
      input: {
        productId,
        dateCheckingIn: selectedDates.from
          ? getFormattedDate(selectedDates.from, yearMonthDayFormat)
          : undefined,
        dateCheckingOut: selectedDates.to
          ? getFormattedDate(selectedDates.to, yearMonthDayFormat)
          : undefined,
        rooms: occupancies,
        currency: currencyCode,
        alpha2CountryCodeOfCustomer: ipCountryCode,
      },
    },
    skip: !selectedDates.from || !selectedDates.to || ipCountryCodeMissiing,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    context: {
      headers: noCacheHeaders,
    },
    onCompleted: ({ productPageAvailabilites }) => {
      const roomCombinations = constructRoomCombinations(
        productPageAvailabilites.roomCombinations,
        t
      );
      onSetRoomCombinations(roomCombinations);
    },
    onError: () => {
      setIsAvailabilityLoading(false);
    },
  });

  useEffect(() => {
    if (gteLoading || ipCountryCodeMissiing) {
      setIsAvailabilityLoading(true);
    }
  }, [gteLoading, ipCountryCodeMissiing, setIsAvailabilityLoading]);
};

export default useGetStayAvailability;
