import { StateContext, defaultState } from "../context/VPSearchWidgetContext";

import { VacationSearchQueryParamsType } from "components/features/VacationPackages/utils/useVacationSearchQueryParams";
import { decodeOccupanciesArray } from "components/features/AccommodationSearchPage/utils/useAccommodationSearchQueryParams";

export const constructStateFromQueryParams = (
  queryParams: VacationSearchQueryParamsType
): Partial<StateContext> => {
  const newState = {
    occupancies: defaultState.occupancies,
    datePickerSelectedDates: {
      ...defaultState.datePickerSelectedDates,
    },
    vacationIncludesFlight: defaultState.vacationIncludesFlight,
    origin: "",
    originId: "",
    originCountryId: "",
    destinationId: "",
    destination: "",
  };

  /* eslint-disable functional/immutable-data */
  if (queryParams.dateFrom) {
    newState.datePickerSelectedDates.from = new Date(queryParams.dateFrom);
  }

  if (queryParams.dateTo) {
    newState.datePickerSelectedDates.to = new Date(queryParams.dateTo);
  }

  if (queryParams.occupancies) {
    newState.occupancies = decodeOccupanciesArray(queryParams.occupancies);
  }

  if (queryParams.originId && queryParams.originName) {
    newState.originId = queryParams.originId;
    newState.origin = queryParams.originName;
  }

  if (queryParams.destinationId && queryParams.destinationName) {
    newState.destinationId = queryParams.destinationId;
    newState.destination = queryParams.destinationName;
  }

  if (queryParams.includeFlights !== undefined) {
    newState.vacationIncludesFlight = queryParams.includeFlights;
  }

  if (queryParams.originCountryId !== undefined) {
    newState.originCountryId = queryParams.originCountryId;
  }
  /* eslint-enable functional/immutable-data */
  return newState;
};

export default constructStateFromQueryParams;
