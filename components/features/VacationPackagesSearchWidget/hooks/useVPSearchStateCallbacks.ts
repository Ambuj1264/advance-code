import { useCallback } from "react";

import { useVPSearchWidgetContext, defaultState } from "../context/VPSearchWidgetContext";
import constructStateFromQueryParams from "../utils/constructStateFromQueryParams";

import { setDatesInLocalStorage, setVpIncludesFlight } from "utils/localStorageUtils";
import useVacationSearchQueryParams, {
  VacationSearchQueryParamsType,
} from "components/features/VacationPackages/utils/useVacationSearchQueryParams";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { constructQueryFromSelectedDates } from "components/ui/DatePicker/utils/datePickerUtils";
import { encodeOccupanciesToArrayString } from "components/features/AccommodationSearchPage/utils/useAccommodationSearchQueryParams";
import { hasSameDepartureAndArrivalCities } from "components/features/VacationPackages/utils/vacationPackagesUtils";

export const useVPSearchStateCallbacks = () => {
  const {
    setContextState,
    datePickerSelectedDates,
    originId,
    origin,
    originCountryId,
    destination,
    destinationId,
    vacationIncludesFlight,
    occupancies,
  } = useVPSearchWidgetContext();

  const [, setQueryParams] = useVacationSearchQueryParams();

  const isFlightDepartureAndArrivalSame =
    vacationIncludesFlight && hasSameDepartureAndArrivalCities(originId, destinationId);

  const onSearchClick = useCallback(
    e => {
      e.preventDefault();
      const dates = constructQueryFromSelectedDates(datePickerSelectedDates);

      setQueryParams(
        {
          ...dates,
          originId,
          originName: origin,
          originCountryId,
          destinationId,
          destinationName: destination,
          occupancies: encodeOccupanciesToArrayString(occupancies),
          includeFlights: isFlightDepartureAndArrivalSame ? false : vacationIncludesFlight,

          // resetting previously selected filters except numberOfdays
          activityIds: undefined,
          destinationIds: undefined,
          price: undefined,
          // resetting the navigation
          page: undefined,
        },
        QueryParamTypes.PUSH_IN
      );
    },
    [
      isFlightDepartureAndArrivalSame,
      datePickerSelectedDates,
      destination,
      destinationId,
      origin,
      originId,
      originCountryId,
      setQueryParams,
      vacationIncludesFlight,
      occupancies,
    ]
  );

  const onOccupanciesChange = useCallback(
    (newOccupancies: StayBookingWidgetTypes.Occupancy[]) => {
      setContextState({
        occupancies: newOccupancies,
      });
    },
    [setContextState]
  );

  const onOriginLocationChange = useCallback(
    (id?: string | undefined, name?: string | undefined, countryCode?: string) => {
      setContextState({
        originId: id,
        origin: name,
        originCountryId: countryCode,
      });
    },
    [setContextState]
  );

  const onDestinationLocationChange = useCallback(
    (id?: string | undefined, name?: string | undefined) => {
      setContextState({
        destinationId: id,
        destination: name,
      });
    },
    [setContextState]
  );

  const datePickerOnDateSelection = useCallback(
    (selectedDates: SharedTypes.SelectedDates) => {
      setDatesInLocalStorage(selectedDates);
      setContextState({
        datePickerSelectedDates: selectedDates,
      });
    },
    [setContextState]
  );

  const datePickerOnDateClear = useCallback(() => {
    setContextState({
      datePickerSelectedDates: defaultState.datePickerSelectedDates,
    });
  }, [setContextState]);

  const onToggleFlightsIncluded = useCallback(
    (checked: boolean) => {
      setVpIncludesFlight(checked);
      setContextState({
        vacationIncludesFlight: checked,
        ...(!checked
          ? {
              origin: undefined,
              originId: undefined,
              defaultOrigin: undefined,
              defaultOriginId: undefined,
            }
          : {}),
      });
    },
    [setContextState]
  );

  const onQueryParamsChange = useCallback(
    (queryParams: VacationSearchQueryParamsType) => {
      const newStateSlice = constructStateFromQueryParams(queryParams);

      setContextState(newStateSlice);
    },
    [setContextState]
  );

  return {
    onOccupanciesChange,
    onOriginLocationChange,
    onDestinationLocationChange,
    datePickerOnDateSelection,
    datePickerOnDateClear,
    onToggleFlightsIncluded,
    onSearchClick,
    onQueryParamsChange,
  };
};
