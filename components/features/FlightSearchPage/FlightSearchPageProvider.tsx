import React, { ReactNode, useCallback, SyntheticEvent } from "react";
import useReducerWithSideEffects, { Update } from "use-reducer-with-side-effects";

import { Provider as StateProvider, State } from "./contexts/FlightSearchPageStateContext";
import { Provider as CallbackProvider } from "./contexts/FlightSearchPageCallbackContext";
import useFlightSearchQueryParams, {
  FlightSearchQueryParam,
} from "./utils/useFlightSearchQueryParams";
import { StepsEnum } from "./FlightSearchWidget/enums";
import { Provider as ConstantProvider } from "./contexts/FlightSearchPageConstantContext";
import {
  CHILDREN_MAX_AGE_DEFAULT,
  getFlightDatesInFuture,
  INFANT_MAX_AGE_DEFAULT,
} from "./utils/flightSearchUtils";

import {
  getReturnDates,
  getDepartureDates,
  getInitialSelectedDates,
  isNewSearch,
} from "components/ui/FlightSearchWidget/utils/flightSearchWidgetUtils";
import { constructQueryFromSelectedDates } from "components/ui/DatePicker/utils/datePickerUtils";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import {
  getAdjustedDatesInLocalStorage,
  getTravelersFromLocalStorage,
  setDatesInLocalStorage,
  setFlightsTravellersInLocalstorage,
} from "utils/localStorageUtils";
import { useGlobalContext } from "contexts/GlobalContext";

enum ActionType {
  OnDepartureDateSelection,
  onReturnDateSelection,
  OnOriginLocationChange,
  OnDestinationLocationChange,
  onSearchClick,
  OnNumberOfPassengersChange,
  OnCabinTypeChange,
  OnFlightTypeChange,
  onToggleModal,
  openModal,
  closeModal,
  onSetSearchWidgetStep,
}

type Action =
  | {
      type: ActionType.OnDepartureDateSelection;
      selectedDepartureDates: SharedTypes.SelectedDates;
    }
  | {
      type: ActionType.onReturnDateSelection;
      selectedReturnDates: SharedTypes.SelectedDates;
    }
  | {
      type: ActionType.OnOriginLocationChange;
      originId?: string;
      originName?: string;
    }
  | {
      type: ActionType.OnDestinationLocationChange;
      destinationId?: string;
      destinationName?: string;
    }
  | {
      type: ActionType.OnNumberOfPassengersChange;
      passengerType: FlightSearchTypes.PassengerType;
      value: number;
    }
  | {
      type: ActionType.OnCabinTypeChange;
      cabinType: FlightSearchTypes.CabinType;
    }
  | {
      type: ActionType.OnFlightTypeChange;
      flightType: FlightSearchTypes.FlightType;
    }
  | {
      type: ActionType.onToggleModal;
    }
  | {
      type: ActionType.openModal;
    }
  | {
      type: ActionType.closeModal;
    }
  | {
      type: ActionType.onSetSearchWidgetStep;
      searchWidgetStep: StepsEnum;
    };

const reducer: React.Reducer<State, Action> = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.OnDepartureDateSelection: {
      const {
        selectedDepartureDates: { from, to },
      } = action;
      setDatesInLocalStorage({ from });
      return Update({
        ...state,
        selectedDepartureDates: {
          from,
          to,
        },
        selectedReturnDates: getReturnDates({ from, to }, state.selectedReturnDates),
      });
    }
    case ActionType.onReturnDateSelection: {
      const {
        selectedReturnDates: { from, to },
      } = action;

      setDatesInLocalStorage({ to: from });
      return Update({
        ...state,
        selectedReturnDates: {
          from,
          to,
        },
        selectedDepartureDates: getDepartureDates(state.selectedDepartureDates, { from, to }),
      });
    }
    case ActionType.OnOriginLocationChange: {
      const { originId, originName } = action;
      return Update({
        ...state,
        originId,
        originName,
      });
    }
    case ActionType.OnDestinationLocationChange: {
      const { destinationId, destinationName } = action;
      return Update({
        ...state,
        destinationId,
        destinationName,
      });
    }
    case ActionType.OnNumberOfPassengersChange: {
      const { passengerType, value } = action;
      const passengers = {
        ...state.passengers,
        [passengerType]: value,
      };
      setFlightsTravellersInLocalstorage({
        newValue: value,
        passengerType,
        infantMaxAge: INFANT_MAX_AGE_DEFAULT,
        childrenMaxAge: CHILDREN_MAX_AGE_DEFAULT,
        numberOfChildren: state.passengers.children,
        numberOfInfants: state.passengers.infants,
      });
      return Update({
        ...state,
        passengers,
      });
    }

    case ActionType.OnCabinTypeChange: {
      const { cabinType } = action;
      return Update({
        ...state,
        cabinType,
      });
    }
    case ActionType.OnFlightTypeChange: {
      const { flightType } = action;
      const selectedReturnDates =
        flightType === "oneway" ? { from: undefined, to: undefined } : state.selectedReturnDates;
      return Update({
        ...state,
        flightType,
        selectedReturnDates,
      });
    }
    case ActionType.onToggleModal: {
      return Update({
        ...state,
        isSearchWidgetOpen: !state.isSearchWidgetOpen,
      });
    }
    case ActionType.closeModal: {
      return Update({
        ...state,
        isSearchWidgetOpen: false,
      });
    }
    case ActionType.openModal: {
      return Update({
        ...state,
        isSearchWidgetOpen: true,
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
    default:
      return state;
  }
};

const FlightSearchPageProvider = ({
  children,
  updateSearchId,
}: {
  children: ReactNode;
  updateSearchId?: (newSearchId: string | null) => void;
}) => {
  const [queryState, setQueryParams] = useFlightSearchQueryParams();
  const { dateFrom: lsDateFrom, dateTo: lsDateTo } = constructQueryFromSelectedDates(
    getAdjustedDatesInLocalStorage()
  );
  const {
    adults: lsAdults,
    children: lsInfants,
    teenagers: lsChildren,
  } = getTravelersFromLocalStorage({ childrenMaxAge: 2, teenagerMaxAge: 11 });
  const {
    dateFrom,
    dateTo,
    returnDateFrom: queryReturnDateFrom,
    returnDateTo: queryReturnDateTo,
    originId: queryOriginId,
    originName: queryOriginName,
    destinationId: queryDestinationId,
    destinationName: queryDestinationName,
    adults,
    children: queryChildren,
    infants,
    flightType: queryFlightType,
    cabinType: queryCabinType,
  } = queryState;
  const { fromDate, toDate, returnFromDate, returnToDate } = getFlightDatesInFuture(
    dateFrom || lsDateFrom,
    dateTo,
    queryReturnDateFrom || (queryFlightType === "round" ? lsDateTo : undefined),
    queryReturnDateTo
  );
  const decodedQueryOrigin = queryOriginName ? decodeURI(queryOriginName) : undefined;
  const decodedQueryDestination = queryDestinationName
    ? decodeURI(queryDestinationName)
    : undefined;
  const { isMobileSearchWidgetBtnClicked } = useGlobalContext();
  const initialState = {
    selectedDepartureDates: getInitialSelectedDates(fromDate, toDate),
    selectedReturnDates: getInitialSelectedDates(returnFromDate, returnToDate),
    originId: queryOriginId,
    originName: decodedQueryOrigin,
    destinationId: queryDestinationId,
    destinationName: decodedQueryDestination,
    passengers: {
      adults: adults || lsAdults || 1,
      children: queryChildren || lsChildren || 0,
      infants: infants || lsInfants || 0,
    },
    cabinType: (queryCabinType || "M") as FlightSearchTypes.CabinType,
    flightType: (queryFlightType || "round") as FlightSearchTypes.FlightType,
    isSearchWidgetOpen: false,
    searchWidgetStep: StepsEnum.Details,
  };

  const [state, dispatch] = useReducerWithSideEffects<React.Reducer<State, Action>>(
    reducer,
    initialState
  );

  const onDepartureDateSelection = useCallback(
    (dates: SharedTypes.SelectedDates) => {
      dispatch({
        type: ActionType.OnDepartureDateSelection,
        selectedDepartureDates: dates,
      });
    },
    [dispatch]
  );

  const onReturnDateSelection = useCallback(
    (dates: SharedTypes.SelectedDates) => {
      dispatch({
        type: ActionType.onReturnDateSelection,
        selectedReturnDates: dates,
      });
    },
    [dispatch]
  );

  const onOriginLocationChange = useCallback(
    (id?: string, name?: string) =>
      dispatch({
        type: ActionType.OnOriginLocationChange,
        originId: id,
        originName: name,
      }),
    [dispatch]
  );

  const onDestinationLocationChange = useCallback(
    (id?: string, name?: string) =>
      dispatch({
        type: ActionType.OnDestinationLocationChange,
        destinationId: id,
        destinationName: name,
      }),
    [dispatch]
  );

  const onNumberOfPassengersChange = useCallback(
    (passengerType: FlightSearchTypes.PassengerType, value: number) =>
      dispatch({
        type: ActionType.OnNumberOfPassengersChange,
        passengerType,
        value,
      }),
    [dispatch]
  );

  const onCabinTypeChange = useCallback(
    (cabinType: FlightSearchTypes.CabinType) =>
      dispatch({
        type: ActionType.OnCabinTypeChange,
        cabinType,
      }),
    [dispatch]
  );

  const onFlightTypeChange = useCallback(
    (flightType: FlightSearchTypes.FlightType) =>
      dispatch({
        type: ActionType.OnFlightTypeChange,
        flightType,
      }),
    [dispatch]
  );

  const onToggleModal = useCallback(
    () =>
      dispatch({
        type: ActionType.onToggleModal,
      }),
    [dispatch]
  );
  const openModal = useCallback(
    () =>
      dispatch({
        type: ActionType.openModal,
      }),
    [dispatch]
  );
  const closeModal = useCallback(
    () =>
      dispatch({
        type: ActionType.closeModal,
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

  const onSearchClick = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      isMobileSearchWidgetBtnClicked.current = true;

      const {
        selectedDepartureDates,
        selectedReturnDates,
        originId,
        destinationId,
        passengers,
        cabinType,
        flightType,
        originName,
        destinationName,
      } = state;
      const { dateFrom: returnDateFrom, dateTo: returnDateTo } =
        constructQueryFromSelectedDates(selectedReturnDates);
      const { dateFrom: departureDateFrom, dateTo: departureDateTo } =
        constructQueryFromSelectedDates(selectedDepartureDates);
      const shouldSearch = isNewSearch(
        queryOriginId === originId,
        queryDestinationId === destinationId,
        dateFrom === departureDateFrom,
        dateTo === departureDateTo,
        queryReturnDateFrom === returnDateFrom,
        queryReturnDateTo === returnDateTo,
        adults === passengers.adults,
        queryChildren === passengers.children,
        infants === passengers.infants,
        queryCabinType === cabinType,
        queryFlightType === flightType
      );
      if (shouldSearch) {
        updateSearchId?.(null);
        setQueryParams(
          {
            dateFrom: departureDateFrom,
            dateTo: departureDateTo,
            returnDateFrom,
            returnDateTo,
            originId,
            destinationId,
            adults: passengers.adults,
            children: passengers.children,
            infants: passengers.infants,
            cabinType,
            flightType,
            originName,
            destinationName,
            [FlightSearchQueryParam.PRICE]: undefined,
            [FlightSearchQueryParam.DURATION]: undefined,
            [FlightSearchQueryParam.STOPOVER]: undefined,
            [FlightSearchQueryParam.PAGE]: 1,
          },
          QueryParamTypes.PUSH_IN
        );
      }
    },
    [
      adults,
      dateFrom,
      dateTo,
      infants,
      isMobileSearchWidgetBtnClicked,
      queryCabinType,
      queryChildren,
      queryDestinationId,
      queryFlightType,
      queryOriginId,
      queryReturnDateFrom,
      queryReturnDateTo,
      setQueryParams,
      state,
      updateSearchId,
    ]
  );

  return (
    <StateProvider value={{ ...state }}>
      <ConstantProvider
        value={{
          defaultOriginId: queryOriginId,
          defaultOrigin: decodedQueryOrigin,
          defaultDestinationId: queryDestinationId,
          defaultDestination: decodedQueryDestination,
          rangeAsDefault:
            (dateFrom !== undefined && dateTo !== undefined) ||
            (queryReturnDateFrom !== undefined && queryReturnDateTo !== undefined),
        }}
      >
        <CallbackProvider
          value={{
            onDepartureDateSelection,
            onReturnDateSelection,
            onOriginLocationChange,
            onDestinationLocationChange,
            onSearchClick,
            onNumberOfPassengersChange,
            onCabinTypeChange,
            onFlightTypeChange,
            onSetSearchWidgetStep,
            onToggleModal,
            openModal,
            closeModal,
          }}
        >
          {children}
        </CallbackProvider>
      </ConstantProvider>
    </StateProvider>
  );
};

export default FlightSearchPageProvider;
