import { useQueryParams } from "use-query-params";

import { AccommodationSearchQueryParamScheme } from "components/features/AccommodationSearchPage/types/AccommodationSearchQueryParamTypes";

const occupancyDelimeter = "_";
const occupancyAgeGroupDelimeter = "-";

export const encodeOccupanciesToArrayString = (
  occupancies?: StayBookingWidgetTypes.Occupancy[]
) => {
  if (!occupancies || occupancies.length === 0) return undefined;

  return occupancies.map(occupancy => {
    const encodedAdults = `${occupancy.numberOfAdults}`;
    const encodedChildrenAges = occupancy.childrenAges.length
      ? `${occupancy.childrenAges.join(occupancyAgeGroupDelimeter)}`
      : "";

    return encodedAdults + (encodedChildrenAges ? occupancyDelimeter + encodedChildrenAges : "");
  }, "");
};

export const decodeOccupanciesArray = (
  encodedOccupancies?: string[]
): StayBookingWidgetTypes.Occupancy[] => {
  if (!encodedOccupancies || encodedOccupancies.length === 0) return [];

  return encodedOccupancies.reduce((occupancies, encodedOccupancy) => {
    const [encodedAdult, encodedChildrenAges] = encodedOccupancy.split(occupancyDelimeter);

    const numberOfAdults = encodedAdult ? Number(encodedAdult) : 0;

    const childrenAges =
      encodedChildrenAges === ""
        ? []
        : encodedChildrenAges?.split(occupancyAgeGroupDelimeter).map(Number) ?? [];

    const occupancy = {
      numberOfAdults,
      childrenAges,
    };

    return [...occupancies, occupancy];
  }, [] as StayBookingWidgetTypes.Occupancy[]);
};

const useAccommodationSearchQueryParams = () => useQueryParams(AccommodationSearchQueryParamScheme);

export default useAccommodationSearchQueryParams;
