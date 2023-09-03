import React, { ReactNode } from "react";

import { TravelStopType } from "types/enums";
import ItineraryDay from "components/ui/Itinerary/ItineraryDay";

const VPDay = ({
  dayNumber,
  vacationLength,
  currentWeekDay,
  itineraryDay,
  createHandleTravelStopModalToggle,
  children,
}: {
  dayNumber: number;
  vacationLength: number;
  currentWeekDay: string;
  itineraryDay: VacationPackageTypes.VacationPackageDay;
  createHandleTravelStopModalToggle: (
    travelStop: TravelStopTypes.TravelStops[],
    travelStopType: TravelStopType
  ) => (travelStopInfo?: SharedTypes.Icon) => void;
  children?: ReactNode;
}) => {
  return (
    <>
      <ItineraryDay
        itineraryLength={vacationLength}
        dayNumber={dayNumber}
        currentWeekDay={currentWeekDay}
        itineraryDay={itineraryDay}
        createHandleTravelStopModalToggle={createHandleTravelStopModalToggle}
      />
      {children}
    </>
  );
};

export default VPDay;
