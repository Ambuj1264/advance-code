import { useCallback } from "react";

import { POSTBOOKING_NAVIGATION } from "../types/postBookingEnums";
import { getPBDayClientRoute, getPBReservationsClientRoute } from "../utils/postBookingUtils";
import { usePostBookingQueryParams } from "../components/hooks/usePostBookingQueryParams";

import { PageType } from "types/enums";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";

export const useGetPBClientRoutes = () => {
  const { marketplace } = useSettings();
  const activeLocale = useActiveLocale();
  const [queryParams] = usePostBookingQueryParams();

  const getDayNavigationClientRoute = useCallback(
    (dayNumber: number, replaceHistory = false): SharedTypes.ClientRoute => {
      return getPBDayClientRoute(dayNumber, queryParams, activeLocale, marketplace, replaceHistory);
    },
    [activeLocale, marketplace, queryParams]
  );

  const getReservationsClientRoute = useCallback(
    ({ tripId }: { tripId: number }) => {
      const route = getPBReservationsClientRoute(activeLocale, marketplace, tripId);

      return {
        route: PageType.GTE_POST_BOOKING,
        as: route.as,
        query: route.query,
      } as SharedTypes.ClientRoute;
    },
    [activeLocale, marketplace]
  );

  const getTravelplanClientRoute = useCallback(
    ({ tripId }: { tripId: number }) => {
      const route = getPBDayClientRoute(
        1,
        {
          day: 1,
          nav: POSTBOOKING_NAVIGATION.TRAVELPLAN,
          tripId,
        },
        activeLocale,
        marketplace
      );

      return {
        route: PageType.GTE_POST_BOOKING,
        as: route.as,
        query: {
          ...route.query,
          tripId,
        },
      } as SharedTypes.ClientRoute;
    },
    [activeLocale, marketplace]
  );

  return {
    getReservationsClientRoute,
    getTravelplanClientRoute,
    getDayNavigationClientRoute,
  };
};
