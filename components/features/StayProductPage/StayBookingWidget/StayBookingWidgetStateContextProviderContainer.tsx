import React, { ReactNode } from "react";

import {
  StayBookingWidgetStateContext,
  StayBookingWidgetStateContextProvider,
} from "./StayBookingWidgetStateContext";
import useAccommodationQueryParams from "./utils/useAccommodationQueryParams";
import { MealType } from "./types/enums";

import { getAdjustedDatesInLocalStorage } from "utils/localStorageUtils";
import {
  constructQueryFromSelectedDates,
  getDatesInFuture,
} from "components/ui/DatePicker/utils/datePickerUtils";

const StayBookingWidgetStateContextProviderContainer = ({
  fromPrice,
  placeName,
  placeId,
  placeType,
  slug = "",
  minDays = 1,
  accommodationCategory,
  rooms = [],
  children,
  occupancies,
}: {
  fromPrice: number;
  placeName?: string;
  placeId?: number;
  placeType?: string;
  slug?: string;
  minDays?: number;
  accommodationCategory?: AccommodationTypes.Category;
  rooms?: AccommodationTypes.Room[];
  occupancies?: StayBookingWidgetTypes.Occupancy[];
  children: ReactNode;
}) => {
  const [{ dateFrom, dateTo, meals_included: preferredMeals }] = useAccommodationQueryParams();
  const { dateFrom: lsDateFrom, dateTo: lsDateTo } = constructQueryFromSelectedDates(
    getAdjustedDatesInLocalStorage()
  );
  const preferredMealType = preferredMeals ? (preferredMeals[0] as MealType) : undefined;
  const { fromDate, toDate } = getDatesInFuture(dateFrom || lsDateFrom, dateTo || lsDateTo);
  const combinedContext = {
    occupancies: occupancies?.length
      ? occupancies
      : ([{ numberOfAdults: 2, childrenAges: [] }] as StayBookingWidgetTypes.Occupancy[]),
    ...(fromDate &&
      toDate && {
        selectedDates: {
          from: new Date(fromDate),
          to: new Date(toDate),
        },
      }),
    fromPrice,
    placeName,
    placeId,
    placeType,
    slug,
    minDays,
    rooms,
    preferredMealType,
    ...(accommodationCategory && { accommodationCategory }),
  } as StayBookingWidgetStateContext;
  return (
    <StayBookingWidgetStateContextProvider {...combinedContext}>
      {children}
    </StayBookingWidgetStateContextProvider>
  );
};

export default StayBookingWidgetStateContextProviderContainer;
