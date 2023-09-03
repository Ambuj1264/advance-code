import React, { memo } from "react";

import ItineraryDay from "./ItineraryDay";
import { getLocalizedWeekDays } from "./itineraryUtils";

import { TravelStopType } from "types/enums";
import useActiveLocale from "hooks/useActiveLocale";

const ItineraryContent = ({
  itinerary,
  itineraryLength,
  createHandleTravelStopModalToggle,
  itineraryWeekDays,
}: {
  itinerary: VacationPackageTypes.VacationPackageDay[];
  itineraryLength: number;
  createHandleTravelStopModalToggle: (
    itemInfo: TravelStopTypes.TravelStops[],
    currentDay: TravelStopType
  ) => (travelStopInfo?: SharedTypes.Icon) => void;
  itineraryWeekDays: string[];
}) => {
  return (
    <>
      {itinerary.map((day: VacationPackageTypes.VacationPackageDay, index: number) => {
        const dayNumber = index + 1;
        return (
          <ItineraryDay
            key={day.id}
            itineraryDay={day}
            dayNumber={dayNumber}
            itineraryLength={itineraryLength}
            createHandleTravelStopModalToggle={createHandleTravelStopModalToggle}
            currentWeekDay={itineraryWeekDays[index]}
          />
        );
      })}
    </>
  );
};

const ItineraryContentMemoized = memo(ItineraryContent);

export const Itinerary = ({
  itinerary,
  itineraryLength,
  createHandleTravelStopModalToggle,
  dateFrom,
}: {
  itinerary: VacationPackageTypes.VacationPackageDay[];
  itineraryLength: number;
  createHandleTravelStopModalToggle: (
    itemInfo: TravelStopTypes.TravelStops[],
    currentDay: TravelStopType
  ) => (travelStopInfo?: SharedTypes.Icon) => void;
  dateFrom: Date;
}) => {
  const activeLocale = useActiveLocale();
  const itineraryWeekDays = getLocalizedWeekDays(itinerary.length, activeLocale, dateFrom);

  return (
    <ItineraryContentMemoized
      itinerary={itinerary}
      itineraryLength={itineraryLength}
      createHandleTravelStopModalToggle={createHandleTravelStopModalToggle}
      itineraryWeekDays={itineraryWeekDays}
    />
  );
};
