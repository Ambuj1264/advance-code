import React, { createContext, ReactNode, useCallback, useContext } from "react";
import { ApolloError, ApolloQueryResult, NetworkStatus } from "apollo-client";
import { useRouter } from "next/router";
import useReducerWithSideEffects, {
  NoUpdate,
  Update,
  UpdateWithSideEffect,
} from "use-reducer-with-side-effects";

import { constructBaggageText, getFlightsbyRankings } from "../utils/vacationPackageUtils";

import { VPStateContext } from "./VPStateContext";
import { VPStayStateContext } from "./VPStayStateContext";

import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import VPFlightSearchQuery from "components/features/VacationPackageProductPage/queries/VPFlightQuery.graphql";
import { constructFlightItineraries } from "components/features/FlightSearchPage/utils/flightSearchUtils";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import { noCacheHeaders } from "utils/apiUtils";
import { getTravelersFromOccupancies } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import useQueryClient from "hooks/useQueryClient";

export type VPFlightState = {
  vacationIncludesFlight: boolean;
  selectedFlight?: VacationPackageTypes.VacationFlightItinerary;
  origin: string;
  originId: string;
  cabinType: FlightSearchTypes.CabinType;
  flightType: FlightSearchTypes.FlightType;
  baggageInfoText: string;
  hasUserSelectedFlight: boolean;
  flightsLoadError?: Error;
  isBaggageLoading?: boolean;
  flightsResults: VacationPackageTypes.VacationFlightItinerary[];
  flightSearchLoading: boolean;
  flightSearchError?: ApolloError;
  flightBaggageQueryError?: ApolloError;
  flightSearchStatus?: NetworkStatus;
  flightsRefetching: boolean;
  flightQueryData?: VacationPackageTypes.FlightIteneraryType;
};

enum ActionType {
  OnIncludeFlightsToggle,
  OnOriginLocationChange,
  OnFlightTypeChange,
  OnFlightCabinTypeChange,
  OnChangeBaggageText,
  OnFlightCabinTypeError,
  OnFlightsResultsError,
  OnSetFlightsResults,
  OnSelectFlightItinerary,
  OnSortFlightsByPrice,
  OnSetFlightsRefetching,
  OnRemoveSelectedFlight,
}

type Action =
  | {
      type: ActionType.OnIncludeFlightsToggle;
      checked: boolean;
    }
  | {
      type: ActionType.OnOriginLocationChange;
      id?: string;
      name?: string;
    }
  | {
      type: ActionType.OnFlightTypeChange;
      flightType: FlightSearchTypes.FlightType;
    }
  | {
      type: ActionType.OnFlightCabinTypeChange;
      cabinType: FlightSearchTypes.CabinType;
    }
  | {
      type: ActionType.OnChangeBaggageText;
      passengers: FlightTypes.PassengerDetails[];
      translate: TFunction;
    }
  | {
      type: ActionType.OnFlightCabinTypeError;
    }
  | {
      type: ActionType.OnFlightsResultsError;
      flightsLoadError?: Error;
      skipDefaultError?: boolean;
    }
  | {
      type: ActionType.OnSetFlightsResults;
      flightSearchData: VacationPackageTypes.VPFlightSearchResults;
      asPath: string;
      t: TFunction;
      refetchFlightSearchData: (
        variables?: VacationPackageTypes.VPFlightSearchVariable | undefined
      ) => Promise<ApolloQueryResult<VacationPackageTypes.VPFlightSearchResults>>;
      occupancies: StayBookingWidgetTypes.Occupancy[];
    }
  | {
      type: ActionType.OnSelectFlightItinerary;
      flightItinerary?: VacationPackageTypes.VacationFlightItinerary;
    }
  | {
      type: ActionType.OnSortFlightsByPrice;
      flightPrices?: VacationPackageTypes.FlightPrice[];
      refetchFlightSearchData: (
        variables?: VacationPackageTypes.VPFlightSearchVariable | undefined
      ) => Promise<ApolloQueryResult<VacationPackageTypes.VPFlightSearchResults>>;
    }
  | {
      type: ActionType.OnSetFlightsRefetching;
      isRefetching: boolean;
    }
  | {
      type: ActionType.OnRemoveSelectedFlight;
    };

type VPFlightCallback = {
  onIncludeFlightsToggle: (checked: boolean) => void;
  onOriginLocationChange: (id?: string, name?: string) => void;
  onFlightTypeChange: (flightType: FlightSearchTypes.FlightType) => void;
  onCabinTypeChange: (cabinType: FlightSearchTypes.CabinType) => void;
  onChangeBaggageText: (passengers: FlightTypes.PassengerDetails[], translate: TFunction) => void;
  onSelectFlightItinerary: (flightItinerary?: VacationPackageTypes.VacationFlightItinerary) => void;
  onSortFlightsByPrice: (flightPrices?: VacationPackageTypes.FlightPrice[]) => void;
  flightSearchRefetch: (variables?: VacationPackageTypes.VPFlightSearchVariable) => any;
  onSetFlightsRefetching: (isRefetching: boolean) => void;
  onRemoveSelectedFlight: () => void;
  onFlightsResultsError: (flightsLoadError?: Error, skipDefaultError?: boolean) => void;
};

const defaultFlightsState = {
  selectedFlight: undefined,
  flightsResults: [],
  hasUserSelectedFlight: false,
  flightsLoadError: undefined,
};

const defaultState: VPFlightState = {
  origin: "",
  originId: "",
  cabinType: "M" as FlightSearchTypes.CabinType,
  flightType: "round" as FlightSearchTypes.FlightType,
  baggageInfoText: "",
  isBaggageLoading: true,
  flightSearchLoading: false,
  flightSearchError: undefined,
  flightBaggageQueryError: undefined,
  vacationIncludesFlight: false,
  flightSearchStatus: undefined,
  flightsRefetching: false,
  flightQueryData: undefined,
  ...defaultFlightsState,
};

const defaultCallbacks: VPFlightCallback = {
  onIncludeFlightsToggle: () => {},
  onOriginLocationChange: () => {},
  onFlightTypeChange: () => {},
  onCabinTypeChange: () => {},
  onChangeBaggageText: () => {},
  onSelectFlightItinerary: () => {},
  onSortFlightsByPrice: () => {},
  flightSearchRefetch: () => {},
  onSetFlightsRefetching: () => {},
  onRemoveSelectedFlight: () => {},
  onFlightsResultsError: () => {},
};

export const VPFlightStateContext = createContext<VPFlightState>(defaultState);

export const VPFlightCallbackContext = createContext<VPFlightCallback>(defaultCallbacks);

const { Provider: StateProvider } = VPFlightStateContext;
const { Provider: CallbackProvider } = VPFlightCallbackContext;

const reducer: React.Reducer<VPFlightState, Action> = (
  state: VPFlightState,
  action: Action
): VPFlightState => {
  switch (action.type) {
    case ActionType.OnIncludeFlightsToggle: {
      const { checked } = action;
      return Update({
        ...state,
        vacationIncludesFlight: Boolean(checked && state.originId),
        ...defaultFlightsState,
      });
    }
    case ActionType.OnOriginLocationChange: {
      const { id, name } = action;
      return Update({
        ...state,
        originId: id || "",
        origin: name || "",
        vacationIncludesFlight: Boolean(id),
        ...defaultFlightsState,
      });
    }
    case ActionType.OnFlightTypeChange: {
      const { flightType } = action;
      return Update({
        ...state,
        flightType,
        ...defaultFlightsState,
      });
    }
    case ActionType.OnFlightCabinTypeChange: {
      const { cabinType } = action;
      return Update({
        ...state,
        cabinType,
        ...defaultFlightsState,
      });
    }
    case ActionType.OnChangeBaggageText: {
      const { passengers, translate } = action;
      const baggageInfoText = constructBaggageText(passengers, translate);
      return Update({
        ...state,
        baggageInfoText,
        isBaggageLoading: false,
      });
    }
    case ActionType.OnFlightCabinTypeError: {
      return Update({
        ...state,
        cabinType: "M" as FlightSearchTypes.CabinType,
        flightsRefetching: true,
      });
    }
    case ActionType.OnFlightsResultsError: {
      const { flightsLoadError, skipDefaultError = false } = action;
      return Update({
        ...state,
        flightsLoadError:
          flightsLoadError ||
          (skipDefaultError ? undefined : new Error("Unable to fetch VP flights — unknown error.")),
      });
    }
    case ActionType.OnSelectFlightItinerary: {
      const { flightItinerary } = action;
      const flightItineraryId = flightItinerary?.id;
      const isSelected = flightItineraryId && state.selectedFlight?.id === flightItineraryId;
      const flightsResults = state.flightsResults.map(flight => ({
        ...flight,
        vpPrice: undefined,
      }));
      return Update({
        ...state,
        ...(isSelected
          ? {}
          : {
              selectedFlight: flightItinerary,
              isBaggageLoading: true,
              hasUserSelectedFlight: state.selectedFlight !== undefined,
              flightsResults,
            }),
      });
    }
    case ActionType.OnSetFlightsResults: {
      const { flightSearchData, asPath, t, refetchFlightSearchData, occupancies } = action;
      const { adults, children, infants } = getTravelersFromOccupancies(occupancies);
      const flightsResults = constructFlightItineraries(
        false,
        cleanAsPathWithLocale(asPath),
        t,
        adults,
        children,
        infants,
        flightSearchData.vacationPackageFlightSearch.itineraries
      );
      const flightResultsByRanking = getFlightsbyRankings(flightsResults, undefined);
      const selectedFlightItinerary = flightsResults.find(itinerary => itinerary.selected);

      return UpdateWithSideEffect(
        {
          ...state,
          flightsLoadError: undefined,
          flightsResults: flightResultsByRanking,
        },
        (_state, dispatch) =>
          dispatch({
            type: ActionType.OnSelectFlightItinerary,
            flightItinerary: selectedFlightItinerary,
            refetchFlightSearchData,
          })
      );
    }
    case ActionType.OnSortFlightsByPrice: {
      const { flightPrices, refetchFlightSearchData } = action;

      const areFlightsTheSame = state.flightsResults.every(result =>
        flightPrices?.some(price => result.id === price.bookingToken)
      );
      if (!areFlightsTheSame) {
        refetchFlightSearchData();
        return NoUpdate();
      }

      const flightResultsByRanking = getFlightsbyRankings(state.flightsResults, flightPrices);
      return Update({
        ...state,
        flightsResults: flightResultsByRanking,
      });
    }
    case ActionType.OnSetFlightsRefetching: {
      const { isRefetching } = action;
      return Update({
        ...state,
        flightsRefetching: isRefetching,
      });
    }
    case ActionType.OnRemoveSelectedFlight: {
      return Update({
        ...state,
        ...defaultFlightsState,
      });
    }
    default: {
      return state;
    }
  }
};

export const VPFlightStateContextProvider = ({
  vacationIncludesFlight = false,
  originId = "",
  origin = "",
  children,
}: {
  vacationIncludesFlight?: boolean;
  origin?: string;
  originId?: string;
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducerWithSideEffects<React.Reducer<VPFlightState, Action>>(
    reducer,
    {
      ...defaultState,
      vacationIncludesFlight,
      originId,
      origin,
    }
  );
  const { t: flightT } = useTranslation(Namespaces.flightSearchNs);
  const { asPath } = useRouter();
  const { selectedDates, tripId, requestId, preFetchRequestId, usePrefetch } =
    useContext(VPStateContext);
  const { occupancies } = useContext(VPStayStateContext);
  const onIncludeFlightsToggle = useCallback(
    (checked: boolean) => {
      dispatch({
        type: ActionType.OnIncludeFlightsToggle,
        checked,
      });
    },
    [dispatch]
  );

  const onOriginLocationChange = useCallback(
    (id?: string, name?: string) =>
      dispatch({
        type: ActionType.OnOriginLocationChange,
        id,
        name,
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

  const onCabinTypeChange = useCallback(
    (cabinType: FlightSearchTypes.CabinType) =>
      dispatch({
        type: ActionType.OnFlightCabinTypeChange,
        cabinType,
      }),
    [dispatch]
  );

  const onChangeBaggageText = useCallback(
    (passengers: FlightTypes.PassengerDetails[], translate: TFunction) =>
      dispatch({
        type: ActionType.OnChangeBaggageText,
        passengers,
        translate,
      }),
    [dispatch]
  );
  const { adults, children: vpChildren, infants } = getTravelersFromOccupancies(occupancies);
  const {
    data: flightSearchData,
    loading: flightSearchLoading,
    error: flightSearchError,
    refetch: flightSearchRefetch,
    networkStatus: flightSearchStatus,
  } = useQueryClient<
    VacationPackageTypes.VPFlightSearchResults,
    VacationPackageTypes.VPFlightSearchVariable
  >(VPFlightSearchQuery, {
    variables: {
      requestId,
      preFetchRequestId,
      vacationPackageId: tripId,
      adults,
      children: vpChildren,
      infants,
      departureTime:
        selectedDates.from !== undefined
          ? getFormattedDate(selectedDates.from, yearMonthDayFormat)
          : "",
      flyFrom: state.originId,
      flightType: state.flightType,
      cabinType: state.cabinType,
      isMobile: false,
      usePrefetch,
    },
    notifyOnNetworkStatusChange: true,
    skip: !state.originId || !selectedDates.from || !state.vacationIncludesFlight,
    context: {
      headers: noCacheHeaders,
    },
    fetchPolicy: "no-cache",
    onCompleted: () => {
      const hasFlights = Boolean(
        flightSearchData?.vacationPackageFlightSearch?.itineraries?.length
      );
      const flightsMissingError = !hasFlights
        ? new Error(`Cannot find flights for a VP.`)
        : undefined;
      if (hasFlights) {
        dispatch({
          type: ActionType.OnSetFlightsResults,
          flightSearchData: flightSearchData!,
          asPath,
          t: flightT,
          refetchFlightSearchData: flightSearchRefetch,
          occupancies,
        });
      }
      if (flightsMissingError && state.cabinType !== "M") {
        dispatch({
          type: ActionType.OnFlightCabinTypeError,
        });
        flightSearchRefetch();
        return;
      }

      if (flightsMissingError) {
        dispatch({
          type: ActionType.OnFlightsResultsError,
          flightsLoadError: flightsMissingError,
        });
      }
    },
    onError: () => {
      dispatch({
        type: ActionType.OnFlightsResultsError,
        flightsLoadError: flightSearchError,
      });
    },
  });

  const onSelectFlightItinerary = useCallback(
    (flightItinerary?: VacationPackageTypes.VacationFlightItinerary) =>
      dispatch({
        type: ActionType.OnSelectFlightItinerary,
        flightItinerary,
      }),
    [dispatch]
  );

  const onSortFlightsByPrice = useCallback(
    (flightPrices?: VacationPackageTypes.FlightPrice[]) =>
      dispatch({
        type: ActionType.OnSortFlightsByPrice,
        flightPrices,
        refetchFlightSearchData: flightSearchRefetch,
      }),
    [dispatch, flightSearchRefetch]
  );
  const onSetFlightsRefetching = useCallback(
    (isRefetching: boolean) =>
      dispatch({
        type: ActionType.OnSetFlightsRefetching,
        isRefetching,
      }),
    [dispatch]
  );
  const onRemoveSelectedFlight = useCallback(
    () =>
      dispatch({
        type: ActionType.OnRemoveSelectedFlight,
      }),
    [dispatch]
  );
  const onFlightsResultsError = useCallback(
    (flightsLoadError?: Error, skipDefaultError?: boolean) =>
      dispatch({
        type: ActionType.OnFlightsResultsError,
        flightsLoadError,
        skipDefaultError,
      }),
    [dispatch]
  );
  const isFlightSearchLoading =
    !flightSearchError &&
    (flightSearchLoading || (flightSearchData !== undefined && state.flightsResults.length === 0));

  return (
    <StateProvider
      value={{
        ...state,
        flightSearchLoading: isFlightSearchLoading,
        flightSearchError,
        flightSearchStatus,
        flightsRefetching: flightSearchStatus === NetworkStatus.refetch,
      }}
    >
      <CallbackProvider
        value={{
          onIncludeFlightsToggle,
          onOriginLocationChange,
          onFlightTypeChange,
          onCabinTypeChange,
          onChangeBaggageText,
          onSelectFlightItinerary,
          onSortFlightsByPrice,
          flightSearchRefetch,
          onSetFlightsRefetching,
          onRemoveSelectedFlight,
          onFlightsResultsError,
        }}
      >
        {children}
      </CallbackProvider>
    </StateProvider>
  );
};
