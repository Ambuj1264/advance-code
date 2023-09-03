import React, { ReactNode, useCallback, SyntheticEvent } from "react";
import useReducerWithSideEffects, {
  Update,
  UpdateWithSideEffect,
  SideEffect,
  NoUpdate,
} from "use-reducer-with-side-effects";
import { addDays, setHours, setMinutes } from "date-fns";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";

import { Provider as StateProvider, StateContext } from "./contexts/CarSearchWidgetStateContext";
import { Provider as CallbackProvider } from "./contexts/CarSearchWidgetCallbackContext";
import { StepsEnum } from "./enums";

import { useSettings } from "contexts/SettingsContext";
import {
  getAdjustedTime,
  isSameSelectedDates,
} from "components/ui/DatePicker/utils/datePickerUtils";
import { CarSearchTimeType } from "types/enums";
import {
  getAdjustedDatesInLocalStorage,
  setDatesInLocalStorage,
  getDriverAgeFromLocalStorage,
  getDriverCountryFromLocalStorage,
  setDriverAgeInLocalStorage,
  setDriverCountryInLocalStorage,
  getPickUpDropOffLocations,
  setPickUpDropOffLocations,
} from "utils/localStorageUtils";

enum ActionType {
  OnDateSelection,
  OnDateSelectionWithAdjustedTime,
  OnPickupLocationChange,
  OnDropoffLocationChange,
  OnSetHour,
  OnSetMinute,
  onToggleModal,
  onOpenModal,
  onCloseModal,
  onSetSearchWidgetStep,
  onSetCalendarOpen,
  onSetPickupTime,
  onSetDropoffTime,
  onSetDriverAge,
  onSetDriverCountry,
}

type Action =
  | {
      type: ActionType.OnDateSelection;
      selectedDates: SharedTypes.SelectedDates;
    }
  | {
      type: ActionType.OnDateSelectionWithAdjustedTime;
      selectedDates: SharedTypes.SelectedDates;
    }
  | {
      type: ActionType.OnPickupLocationChange;
      item?: SharedTypes.AutocompleteItem;
    }
  | {
      type: ActionType.OnDropoffLocationChange;
      item?: SharedTypes.AutocompleteItem;
    }
  | {
      type: ActionType.OnSetHour;
      hour: number;
      timeType: SharedCarTypes.SearchTimeTypes;
    }
  | {
      type: ActionType.OnSetMinute;
      minute: number;
      timeType: SharedCarTypes.SearchTimeTypes;
    }
  | {
      type: ActionType.onToggleModal;
    }
  | {
      type: ActionType.onOpenModal;
    }
  | {
      type: ActionType.onCloseModal;
    }
  | {
      type: ActionType.onSetSearchWidgetStep;
      searchWidgetStep: StepsEnum;
    }
  | {
      type: ActionType.onSetCalendarOpen;
      isCalendarOpen: boolean;
    }
  | {
      type: ActionType.onSetPickupTime;
      time: SharedTypes.Time;
    }
  | {
      type: ActionType.onSetDropoffTime;
      time: SharedTypes.Time;
    }
  | {
      type: ActionType.onSetDriverAge;
      driverAge: string;
    }
  | {
      type: ActionType.onSetDriverCountry;
      driverCountry: string;
    };

const reducer: React.Reducer<StateContext, Action> = (
  state: StateContext,
  action: Action
): StateContext => {
  switch (action.type) {
    case ActionType.OnDateSelection: {
      const {
        selectedDates: { from, to },
      } = action;
      const { pickup, dropoff } = state.times;
      return Update({
        ...state,
        selectedDates: {
          from: from ? setMinutes(setHours(from, pickup.hour), pickup.minute) : from,
          to: to ? setMinutes(setHours(to, dropoff.hour), dropoff.minute) : to,
        },
      });
    }
    case ActionType.OnDateSelectionWithAdjustedTime: {
      const {
        selectedDates: { from, to },
      } = action;
      const { times } = state;
      const { hour, timeType, isNextDay } = getAdjustedTime({ from, to }, times);

      const newDates = {
        from: timeType === CarSearchTimeType.PICKUP && from && isNextDay ? addDays(from, 1) : from,
        to: timeType === CarSearchTimeType.DROPOFF && to && isNextDay ? addDays(to, 1) : to,
      };

      return SideEffect([
        (_state, dispatch) => dispatch({ type: ActionType.OnSetHour, hour, timeType }),
        (_state, dispatch) =>
          dispatch({
            type: ActionType.OnDateSelection,
            selectedDates: newDates,
          }),
      ]);
    }
    case ActionType.OnSetHour: {
      const { hour, timeType } = action;
      return UpdateWithSideEffect(
        {
          ...state,
          times: {
            ...state.times,
            [timeType]: {
              ...state.times[timeType],
              hour,
            },
          },
        },
        ({ selectedDates }, dispatch) =>
          dispatch({ type: ActionType.OnDateSelection, selectedDates })
      );
    }
    case ActionType.OnSetMinute: {
      const { minute, timeType } = action;
      return UpdateWithSideEffect(
        {
          ...state,
          times: {
            ...state.times,
            [timeType]: {
              ...state.times[timeType],
              minute,
            },
          },
        },
        ({ selectedDates }, dispatch) =>
          dispatch({ type: ActionType.OnDateSelection, selectedDates })
      );
    }
    case ActionType.OnPickupLocationChange: {
      const { item } = action;
      if (!item || !item.id || !item.name) return NoUpdate();
      setPickUpDropOffLocations({
        pickupId: item.id,
        pickupGeoLocation: item.geoLocation,
        pickupLocationName: item.name,
        dropoffId: item.id,
        dropoffGeoLocation: item.geoLocation,
        dropoffLocationName: item.name,
      });
      return Update({
        ...state,
        pickupId: item!.id,
        pickupGeoLocation: item.geoLocation,
        pickupLocationName: item.name,
        dropoffId: item.id,
        dropoffGeoLocation: item.geoLocation,
        dropoffLocationName: item.name,
        carLocationType: item.type,
      });
    }
    case ActionType.OnDropoffLocationChange: {
      const { item } = action;
      if (!item || !item.id || !item.name) return NoUpdate();
      // We probably need to store the name i
      setPickUpDropOffLocations({
        dropoffId: item.id,
        dropoffGeoLocation: item.geoLocation,
        dropoffLocationName: item.name,
      });
      return Update({
        ...state,
        dropoffId: item!.id,
        dropoffGeoLocation: item.geoLocation,
        dropoffLocationName: item.name,
      });
    }
    case ActionType.onToggleModal: {
      return Update({
        ...state,
        isSearchWidgetOpen: !state.isSearchWidgetOpen,
      });
    }
    case ActionType.onOpenModal: {
      return Update({
        ...state,
        isSearchWidgetOpen: true,
      });
    }
    case ActionType.onCloseModal: {
      return Update({
        ...state,
        isSearchWidgetOpen: false,
      });
    }
    case ActionType.onSetSearchWidgetStep: {
      const { searchWidgetStep } = action;
      return Update({
        ...state,
        searchWidgetStep,
        isSearchWidgetOpen: true,
      });
    }
    case ActionType.onSetCalendarOpen: {
      const { isCalendarOpen } = action;
      return Update({
        ...state,
        isCalendarOpen,
      });
    }
    case ActionType.onSetPickupTime: {
      const { time } = action;
      return UpdateWithSideEffect(
        {
          ...state,
          times: {
            ...state.times,
            pickup: time,
          },
        },
        ({ selectedDates }, dispatch) =>
          dispatch({ type: ActionType.OnDateSelection, selectedDates })
      );
    }
    case ActionType.onSetDropoffTime: {
      const { time } = action;
      return UpdateWithSideEffect(
        {
          ...state,
          times: {
            ...state.times,
            dropoff: time,
          },
        },
        ({ selectedDates }, dispatch) =>
          dispatch({ type: ActionType.OnDateSelection, selectedDates })
      );
    }
    case ActionType.onSetDriverAge: {
      const { driverAge } = action;
      setDriverAgeInLocalStorage(driverAge);
      return Update({
        ...state,
        driverAge: Number(driverAge),
      });
    }
    case ActionType.onSetDriverCountry: {
      const { driverCountry } = action;
      setDriverCountryInLocalStorage(driverCountry);
      return Update({
        ...state,
        driverCountry,
      });
    }
    default:
      return state;
  }
};

const DEFAULT_HOUR = 10;
const DEFAULT_MINUTE = 0;

const CarSearchWidgetProvider = ({
  children,
  selectedDates,
  pickupId,
  dropoffId,
  pickupGeoLocation,
  dropoffGeoLocation,
  queryDriverAge,
  queryDriverCountry,
  onSearchClick,
  dropoffLocationName,
  pickupLocationName,
}: {
  children: ReactNode;
  selectedDates: SharedTypes.SelectedDates;
  pickupId?: string;
  dropoffId?: string;
  pickupGeoLocation?: string;
  dropoffGeoLocation?: string;
  queryDriverAge?: number;
  queryDriverCountry?: string;
  dropoffLocationName?: string;
  pickupLocationName?: string;
  onSearchClick?: (
    selectedDates: SharedTypes.SelectedDates,
    selectedPickupId?: string,
    selectedDropoffId?: string,
    selectedPickupGeoLocation?: string,
    selectedDropoffGeoLocation?: string,
    selectedDriverAge?: number,
    selectedDriverCountry?: string,
    selectedDropoffLocationName?: string,
    selectedPickupLocationName?: string,
    selectedCarLocationType?: string
  ) => void;
}) => {
  const { countryCode } = useSettings();
  const prevSelectedDates = usePreviousState(selectedDates);
  const isSelectedDatesChanged = isSameSelectedDates(selectedDates, prevSelectedDates);
  if (isSelectedDatesChanged) {
    setDatesInLocalStorage(selectedDates);
  }
  const { from, to } = getAdjustedDatesInLocalStorage();
  const lsDriverAge = getDriverAgeFromLocalStorage();
  const lsDriverCountry = getDriverCountryFromLocalStorage();
  const {
    pickupId: lsPickupId,
    dropoffId: lsDropoffId,
    carPickupGeoLocation: lsPickupGeo,
    carDropoffGeoLocation: lsDropoffGeo,
  } = getPickUpDropOffLocations();

  const initialState = {
    selectedDates: { from, to },
    pickupId: pickupId || lsPickupId || undefined,
    dropoffId: dropoffId || lsDropoffId || undefined,
    pickupGeoLocation: pickupGeoLocation || lsPickupGeo || undefined,
    dropoffGeoLocation: dropoffGeoLocation || lsDropoffGeo || undefined,
    dropoffLocationName,
    pickupLocationName,
    times: {
      pickup: {
        hour: from?.getHours() ?? DEFAULT_HOUR,
        minute: from?.getMinutes() ?? DEFAULT_MINUTE,
      },
      dropoff: {
        hour: to?.getHours() ?? DEFAULT_HOUR,
        minute: to?.getMinutes() ?? DEFAULT_MINUTE,
      },
    },
    isSearchWidgetOpen: false,
    searchWidgetStep: StepsEnum.Details,
    isCalendarOpen: false,
    driverAge: queryDriverAge || lsDriverAge || 45,
    driverCountry: queryDriverCountry || lsDriverCountry || countryCode,
  };

  const [state, dispatch] = useReducerWithSideEffects<React.Reducer<StateContext, Action>>(
    reducer,
    initialState
  );

  const onDateSelection = useCallback(
    (dates: SharedTypes.SelectedDates) => {
      setDatesInLocalStorage(dates);
      dispatch({
        type: ActionType.OnDateSelection,
        selectedDates: dates,
      });
    },
    [dispatch]
  );

  const onDateSelectionWithAdjustedTime = useCallback(
    (dates: SharedTypes.SelectedDates) => {
      setDatesInLocalStorage(dates);
      dispatch({
        type: ActionType.OnDateSelectionWithAdjustedTime,
        selectedDates: dates,
      });
    },
    [dispatch]
  );

  const onPickupLocationChange = useCallback(
    (item?: SharedTypes.AutocompleteItem) =>
      dispatch({
        type: ActionType.OnPickupLocationChange,
        item,
      }),
    [dispatch]
  );

  const onDropoffLocationChange = useCallback(
    (item?: SharedTypes.AutocompleteItem) =>
      dispatch({
        type: ActionType.OnDropoffLocationChange,
        item,
      }),
    [dispatch]
  );

  const onSetHour = useCallback(
    (hour: number, timeType: SharedCarTypes.SearchTimeTypes) =>
      dispatch({ type: ActionType.OnSetHour, hour, timeType }),
    [dispatch]
  );

  const onSetMinute = useCallback(
    (minute: number, timeType: SharedCarTypes.SearchTimeTypes) =>
      dispatch({ type: ActionType.OnSetMinute, minute, timeType }),
    [dispatch]
  );

  const onSearchClickHandler = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      onSearchClick?.(
        state.selectedDates,
        state.pickupId,
        state.dropoffId,
        state.pickupGeoLocation,
        state.dropoffGeoLocation,
        state.driverAge,
        state.driverCountry,
        state.dropoffLocationName,
        state.pickupLocationName,
        state.carLocationType
      );
    },
    [
      onSearchClick,
      state.selectedDates,
      state.pickupId,
      state.dropoffId,
      state.pickupGeoLocation,
      state.dropoffGeoLocation,
      state.driverAge,
      state.driverCountry,
      state.dropoffLocationName,
      state.pickupLocationName,
      state.carLocationType,
    ]
  );

  const onToggleModal = useCallback(
    () =>
      dispatch({
        type: ActionType.onToggleModal,
      }),
    [dispatch]
  );

  const onOpenModal = useCallback(
    () =>
      dispatch({
        type: ActionType.onOpenModal,
      }),
    [dispatch]
  );
  const onCloseModal = useCallback(
    () =>
      dispatch({
        type: ActionType.onCloseModal,
      }),
    [dispatch]
  );

  const onSetSearchWidgetStep = useCallback(
    (searchWidgetStep: StepsEnum) =>
      dispatch({
        type: ActionType.onSetSearchWidgetStep,
        searchWidgetStep,
      }),
    [dispatch]
  );

  const openModalOnStep = useCallback(
    (step: StepsEnum) => {
      onSetSearchWidgetStep(step);
    },
    [onSetSearchWidgetStep]
  );

  const onSetCalendarOpen = useCallback(
    (isCalendarOpen: boolean) => dispatch({ type: ActionType.onSetCalendarOpen, isCalendarOpen }),
    [dispatch]
  );

  const onPickupTimeChange = useCallback(
    (time: SharedTypes.Time) => dispatch({ type: ActionType.onSetPickupTime, time }),
    [dispatch]
  );

  const onDropoffTimeChange = useCallback(
    (time: SharedTypes.Time) => dispatch({ type: ActionType.onSetDropoffTime, time }),
    [dispatch]
  );

  const onSetDriverAge = useCallback(
    (driverAge: string) => dispatch({ type: ActionType.onSetDriverAge, driverAge }),
    [dispatch]
  );

  const onSetDriverCountry = useCallback(
    (driverCountry: string) =>
      dispatch({
        type: ActionType.onSetDriverCountry,
        driverCountry,
      }),
    [dispatch]
  );

  return (
    <StateProvider
      value={{
        selectedDates: state.selectedDates,
        pickupId: state.pickupId,
        pickupLocationName: state.pickupLocationName,
        dropoffId: state.dropoffId,
        dropoffLocationName: state.dropoffLocationName,
        pickupGeoLocation: state.pickupGeoLocation,
        dropoffGeoLocation: state.dropoffGeoLocation,
        times: state.times,
        searchWidgetStep: state.searchWidgetStep,
        isSearchWidgetOpen: state.isSearchWidgetOpen,
        isCalendarOpen: state.isCalendarOpen,
        driverAge: state.driverAge,
        driverCountry: state.driverCountry,
      }}
    >
      <CallbackProvider
        value={{
          onDateSelection,
          onDateSelectionWithAdjustedTime,
          onPickupLocationChange,
          onDropoffLocationChange,
          onSetHour,
          onSetMinute,
          onSearchClick: onSearchClickHandler,
          onToggleModal,
          onCloseModal,
          onOpenModal,
          onSetSearchWidgetStep,
          openModalOnStep,
          onSetCalendarOpen,
          onPickupTimeChange,
          onDropoffTimeChange,
          onSetDriverAge,
          onSetDriverCountry,
        }}
      >
        {children}
      </CallbackProvider>
    </StateProvider>
  );
};

export default CarSearchWidgetProvider;
