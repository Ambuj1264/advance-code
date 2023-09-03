import React, { ReactNode, useMemo } from "react";
import { addDays } from "date-fns";

import {
  GTETourBookingWidgetStateContext,
  GTETourBookingWidgetStateContextProvider,
} from "./GTETourBookingWidgetStateContext";

import { toDateWithoutTimezone } from "utils/dateUtils";

const GTETourBookingWidgetStateContextProviderContainer = ({
  dateFrom,
  numberOfDays,
  tourId,
  tourName,
  children,
}: {
  dateFrom?: string;
  numberOfDays: number;
  tourId?: string;
  tourName?: string;
  children: ReactNode;
}) => {
  const startingDate = dateFrom ? toDateWithoutTimezone(new Date(dateFrom)) : undefined;
  const tourDestinationId = tourId ? `CITY:${tourId}` : undefined;
  const combinedContext = useMemo(
    () =>
      ({
        ...(startingDate && {
          selectedDates: {
            from: startingDate,
            to: addDays(startingDate, numberOfDays - 1),
          },
        }),
        tourDestinationId,
        tourDestinationName: tourName,
      } as GTETourBookingWidgetStateContext),
    [startingDate, numberOfDays, tourDestinationId, tourName]
  );
  return (
    <GTETourBookingWidgetStateContextProvider {...combinedContext}>
      {children}
    </GTETourBookingWidgetStateContextProvider>
  );
};

export default GTETourBookingWidgetStateContextProviderContainer;
