import React, { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import useReducerWithSideEffects, { Update } from "use-reducer-with-side-effects";
import { ApolloError } from "apollo-client";

import { constructVPTourResults } from "../utils/vacationPackageUtils";
import VPToursSearchQuery from "../VPToursSection/queries/VPToursSearch.graphql";

import { VPFlightStateContext } from "./VPFlightStateContext";
import { VPStateContext } from "./VPStateContext";
import { VPStayStateContext } from "./VPStayStateContext";

import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { noCacheHeaders } from "utils/apiUtils";
import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import { getTravelersFromOccupancies } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import useQueryClient from "hooks/useQueryClient";

type VPTourState = {
  selectedTourDay?: number;
  selectedToursProductIds?: VacationPackageTypes.SelectedToursProductIds[];
  selectedTours: GTETourBookingWidgetTypes.MutationAddGTETourToCartInput[];
  toursLoadError?: Error;
  toursBookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[];
  toursTravelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[];
  singleTourLoading: boolean;
  toursResults: VacationPackageTypes.ToursSearchResult;
  toursResultLoading: boolean;
  toursResultError?: ApolloError;
};

enum ActionType {
  OnSetToursResultsError,
  OnSetToursResults,
  OnSelectTourProduct,
  OnSubmitTourProduct,
  OnSetSingleTourLoading,
  OnUpdateSelectedToursProductIds,
  OnRemoveSelectedTours,
}

type Action =
  | {
      type: ActionType.OnSetToursResultsError;
      error: Error;
    }
  | {
      type: ActionType.OnSetToursResults;
      days: VacationPackageTypes.VPToursQueryDay[];
      tourT: TFunction;
    }
  | {
      type: ActionType.OnSelectTourProduct;
      singleTourLoading: boolean;
      selectedTours: GTETourBookingWidgetTypes.MutationAddGTETourToCartInput[];
      selectedTourDay?: number;
      selectedToursProductIds?: VacationPackageTypes.SelectedToursProductIds[];
    }
  | {
      type: ActionType.OnSubmitTourProduct;
      toursBookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[];
      toursTravelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[];
      selectedTourDay?: number;
      selectedToursProductIds?: VacationPackageTypes.SelectedToursProductIds[];
      selectedTours: GTETourBookingWidgetTypes.MutationAddGTETourToCartInput[];
    }
  | {
      type: ActionType.OnSetSingleTourLoading;
      singleTourLoading: boolean;
    }
  | {
      type: ActionType.OnUpdateSelectedToursProductIds;
      newSelectedToursProductIds: VacationPackageTypes.SelectedToursProductIds[];
    }
  | {
      type: ActionType.OnRemoveSelectedTours;
    };

type VPTourCallback = {
  onSelectTourProduct: (
    singleTourLoading: boolean,
    selectedTours: GTETourBookingWidgetTypes.MutationAddGTETourToCartInput[],
    selectedTourDay?: number,
    selectedToursProductIds?: VacationPackageTypes.SelectedToursProductIds[]
  ) => void;
  onSubmitTourProduct: (
    toursBookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[],
    toursTravelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[],
    selectedTours: GTETourBookingWidgetTypes.MutationAddGTETourToCartInput[],
    selectedTourDay?: number,
    selectedToursProductIds?: VacationPackageTypes.SelectedToursProductIds[]
  ) => void;
  onSetSingleTourLoading: (singleTourLoading: boolean) => void;
  onUpdateSelectedToursProductIds: (
    newSelectedToursProductIds: VacationPackageTypes.SelectedToursProductIds[]
  ) => void;
  onRemoveSelectedTours: () => void;
};

const defaultState: VPTourState = {
  selectedTourDay: undefined,
  selectedToursProductIds: undefined,
  selectedTours: [],
  toursLoadError: undefined,
  toursBookingQuestions: [],
  toursTravelerQuestions: [],
  singleTourLoading: false,
  toursResults: [],
  toursResultLoading: false,
  toursResultError: undefined,
};

const defaultCallbacks: VPTourCallback = {
  onSelectTourProduct: () => {},
  onSubmitTourProduct: () => {},
  onSetSingleTourLoading: () => {},
  onUpdateSelectedToursProductIds: () => {},
  onRemoveSelectedTours: () => {},
};

export const VPTourStateContext = createContext<VPTourState>(defaultState);

export const VPTourCallbackContext = createContext<VPTourCallback>(defaultCallbacks);

const { Provider: StateProvider } = VPTourStateContext;
const { Provider: CallbackProvider } = VPTourCallbackContext;

const reducer: React.Reducer<VPTourState, Action> = (
  state: VPTourState,
  action: Action
): VPTourState => {
  switch (action.type) {
    case ActionType.OnSetToursResultsError: {
      const { error } = action;
      return Update({
        ...state,
        toursLoadError: error,
      });
    }
    case ActionType.OnSetToursResults: {
      const { days, tourT } = action;
      const toursResults = constructVPTourResults(days, tourT, undefined);
      return Update({
        ...state,
        toursResults,
      });
    }
    case ActionType.OnSelectTourProduct: {
      const { singleTourLoading, selectedTourDay, selectedTours, selectedToursProductIds } = action;
      return Update({
        ...state,
        selectedToursProductIds,
        selectedTours,
        selectedTourDay,
        singleTourLoading,
      });
    }
    case ActionType.OnSubmitTourProduct: {
      const {
        selectedToursProductIds,
        selectedTours,
        toursBookingQuestions,
        toursTravelerQuestions,
        selectedTourDay,
      } = action;

      return Update({
        ...state,
        selectedToursProductIds,
        selectedTours,
        toursBookingQuestions,
        toursTravelerQuestions,
        selectedTourDay,
      });
    }
    case ActionType.OnSetSingleTourLoading: {
      const { singleTourLoading } = action;
      return Update({
        ...state,
        singleTourLoading,
      });
    }
    case ActionType.OnUpdateSelectedToursProductIds: {
      const { newSelectedToursProductIds } = action;
      return Update({
        ...state,
        selectedToursProductIds: newSelectedToursProductIds,
      });
    }
    case ActionType.OnRemoveSelectedTours: {
      return Update({
        ...state,
        toursResults: [],
        selectedToursProductIds: undefined,
        selectedTourDay: undefined,
        selectedTours: [],
      });
    }
    default: {
      return state;
    }
  }
};

export const VPTourStateContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducerWithSideEffects<React.Reducer<VPTourState, Action>>(
    reducer,
    defaultState
  );
  const { t: tourT } = useTranslation(Namespaces.vacationPackageNs);
  const { requestId, tripId, selectedDates } = useContext(VPStateContext);
  const { vacationIncludesFlight } = useContext(VPFlightStateContext);
  const { occupancies } = useContext(VPStayStateContext);
  const numberOfTravelers = getTravelersFromOccupancies(occupancies);
  const variables: { input: VacationPackageTypes.ToursSearchInput } = useMemo(
    () => ({
      input: {
        flightIncluded: vacationIncludesFlight,
        requestId,
        vacationPackageId: tripId,
        adults: numberOfTravelers.adults,
        children: numberOfTravelers.children,
        infants: numberOfTravelers.infants,
        from: getFormattedDate(selectedDates.from!, yearMonthDayFormat),
      },
    }),
    [
      requestId,
      selectedDates.from,
      tripId,
      numberOfTravelers.adults,
      numberOfTravelers.children,
      numberOfTravelers.infants,
      vacationIncludesFlight,
    ]
  );
  const {
    data,
    loading: toursResultLoading,
    error: toursResultError,
  } = useQueryClient<VacationPackageTypes.VPToursQueryResult>(VPToursSearchQuery, {
    variables,
    skip: !variables.input.from,
    context: {
      headers: noCacheHeaders,
    },
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      const toursMissingError = !data?.vacationPackageTourSearch?.days?.length
        ? new Error(`Cannot find any tours for a VP.`)
        : undefined;

      if (toursMissingError) {
        dispatch({
          type: ActionType.OnSetToursResultsError,
          error: toursMissingError,
        });
      } else {
        dispatch({
          type: ActionType.OnSetToursResults,
          days: data!.vacationPackageTourSearch.days,
          tourT,
        });
      }
    },
    onError: () => {
      dispatch({
        type: ActionType.OnSetToursResultsError,
        error: toursResultError as Error,
      });
    },
  });
  const onSelectTourProduct = useCallback(
    (
      singleTourLoading: boolean,
      selectedTours: GTETourBookingWidgetTypes.MutationAddGTETourToCartInput[],
      selectedTourDay?: number,
      selectedToursProductIds?: VacationPackageTypes.SelectedToursProductIds[]
    ) =>
      dispatch({
        type: ActionType.OnSelectTourProduct,
        singleTourLoading,
        selectedTours,
        selectedTourDay,
        selectedToursProductIds,
      }),
    [dispatch]
  );
  const onSubmitTourProduct = useCallback(
    (
      toursBookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[],
      toursTravelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[],
      selectedTours: GTETourBookingWidgetTypes.MutationAddGTETourToCartInput[],
      selectedTourDay?: number,
      selectedToursProductIds?: VacationPackageTypes.SelectedToursProductIds[]
    ) => {
      dispatch({
        type: ActionType.OnSubmitTourProduct,
        selectedToursProductIds,
        selectedTours,
        toursBookingQuestions,
        toursTravelerQuestions,
        selectedTourDay,
      });
    },
    [dispatch]
  );
  const onSetSingleTourLoading = useCallback(
    (singleTourLoading: boolean) =>
      dispatch({
        type: ActionType.OnSetSingleTourLoading,
        singleTourLoading,
      }),
    [dispatch]
  );
  const onUpdateSelectedToursProductIds = useCallback(
    (newSelectedToursProductIds: VacationPackageTypes.SelectedToursProductIds[]) =>
      dispatch({
        type: ActionType.OnUpdateSelectedToursProductIds,
        newSelectedToursProductIds,
      }),
    [dispatch]
  );
  const onRemoveSelectedTours = useCallback(
    () =>
      dispatch({
        type: ActionType.OnRemoveSelectedTours,
      }),
    [dispatch]
  );
  const isTourSearchLoading =
    toursResultLoading ||
    (Boolean(data?.vacationPackageTourSearch?.days?.length) && state.toursResults.length === 0);
  return (
    <StateProvider
      value={{
        ...state,
        toursResultLoading: isTourSearchLoading,
        toursResultError,
      }}
    >
      <CallbackProvider
        value={{
          onSelectTourProduct,
          onSubmitTourProduct,
          onSetSingleTourLoading,
          onUpdateSelectedToursProductIds,
          onRemoveSelectedTours,
        }}
      >
        {children}
      </CallbackProvider>
    </StateProvider>
  );
};
