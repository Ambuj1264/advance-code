import { useQuery } from "@apollo/react-hooks";
import { useMemo } from "react";

import StaticRoomsQuery from "./queries/StaticRoomsQuery.graphql";
import { useStayBookingWidgetContext } from "./StayBookingWidget/StayBookingWidgetStateContext";
import { constructStayContent, constructSimilarStays } from "./utils/stayUtils";
import StayContentQuery from "./queries/StayContentQuery.graphql";
import SimilarAvailabilityQuery from "./queries/SimilarAvailabilityQuery.graphql";
import { constructStaticRooms } from "./StayBookingWidget/utils/stayBookingWidgetUtils";

import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import useActiveLocale from "hooks/useActiveLocale";
import { yearMonthDayFormat, getFormattedDate } from "utils/dateUtils";
import { getTotalGuests } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";

const useStayContentQuery = ({
  where,
  productId,
  attractionsConditions,
  ipCountryCode,
}: {
  where?: LandingPageTypes.LandingPageQueryCondition;
  productId: number;
  attractionsConditions?: {
    latitude: number;
    longitude: number;
  };
  ipCountryCode?: string;
}) => {
  const { t } = useTranslation(Namespaces.accommodationNs);
  const locale = useActiveLocale();
  const { selectedDates, occupancies } = useStayBookingWidgetContext();
  const ipCountryCodeMissing = ipCountryCode === "";
  const numberOfRooms = occupancies.length;
  const numberOfGuests = getTotalGuests(occupancies);
  const { from, to } = selectedDates;
  const dateCheckingIn = from ? getFormattedDate(from, yearMonthDayFormat) : undefined;
  const dateCheckingOut = to ? getFormattedDate(to, yearMonthDayFormat) : undefined;
  const { data: similarData, loading: similarProductsLoading } = useQuery<{
    similarStaysProducts: {
      cards: StayTypes.SimilarStayProduct[];
    };
  }>(SimilarAvailabilityQuery, {
    variables: {
      input: {
        productId,
        dateCheckingIn,
        dateCheckingOut,
        numberOfAdults: numberOfGuests.numberOfAdults,
        childrenAges: numberOfGuests.childrenAges,
        numberOfRooms,
        alpha2CountryCodeOfCustomer: ipCountryCode,
      },
    },
    skip: ipCountryCodeMissing,
  });
  const { data, loading } = useQuery<StayTypes.QueryStay>(StayContentQuery, {
    variables: {
      where,
      attractionsConditions,
      locale,
    },
    skip: !attractionsConditions,
  });
  const { data: staticRoomData } = useQuery<{
    staticRooms: StayBookingWidgetTypes.QueryStaticRoom[];
  }>(StaticRoomsQuery, {
    variables: {
      input: {
        productId,
      },
    },
    skip: !productId,
  });
  const content = useMemo(
    () => (data?.staysProductPages ? constructStayContent(data!.staysProductPages, t) : undefined),
    [data, t]
  );

  const staticRooms: StayBookingWidgetTypes.StaticRoom[] = useMemo(
    () => (staticRoomData?.staticRooms ? constructStaticRooms(staticRoomData.staticRooms, t) : []),
    [staticRoomData, t]
  );

  const similarProducts = useMemo(
    () =>
      constructSimilarStays({
        cards: similarData?.similarStaysProducts?.cards ?? [],
        occupancies,
        dateFrom: dateCheckingIn,
        dateTo: dateCheckingOut,
        t,
      }),
    [similarData, t, occupancies, dateCheckingIn, dateCheckingOut]
  );

  return {
    content,
    loading,
    similarProducts,
    similarProductsLoading: similarProductsLoading || ipCountryCodeMissing,
    staticRooms,
  } as const;
};

export default useStayContentQuery;
