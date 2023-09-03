import React, { createContext, ReactNode, useCallback } from "react";
import useReducerWithSideEffects, { Update } from "use-reducer-with-side-effects";
import { useQuery } from "@apollo/react-hooks";

import VPInvalidMonthsQuery from "../queries/VPInvalidMonthsQuery.graphql";

export type VPState = {
  tripId: string;
  requestId: string;
  preFetchRequestId: string; // passed from search page
  selectedDates: SharedTypes.SelectedDates;
  unavailableDatesRange?: SharedTypes.SelectedDates[];
  isFormLoading: boolean;
  vacationLength: number;
  vpCountryCode: string;
  isSadPathWithoutParams: boolean;
  usePrefetch: boolean;
};

enum ActionType {
  OnDateSelection,
  OnSetVPUnavailableDates,
  OnSadPathWithoutParams,
}

type Action =
  | {
      type: ActionType.OnDateSelection;
      newSelectedDates: SharedTypes.SelectedDates;
    }
  | {
      type: ActionType.OnSetVPUnavailableDates;
      unavailableDatesRange?: SharedTypes.SelectedDates[];
    }
  | {
      type: ActionType.OnSadPathWithoutParams;
      isSadPathWithoutParams: boolean;
    };

type VPCallback = {
  onDateSelection: (newSelectedDates: SharedTypes.SelectedDates) => void;
  onSadPathWithoutParams: (isSadPathWithoutParams: boolean) => void;
};

const defaultState: VPState = {
  tripId: "",
  requestId: "",
  preFetchRequestId: "",
  selectedDates: { from: undefined, to: undefined },
  unavailableDatesRange: undefined,
  isFormLoading: false,
  vacationLength: 0,
  vpCountryCode: "",
  isSadPathWithoutParams: false,
  usePrefetch: false,
};

const defaultCallbacks: VPCallback = {
  onDateSelection: () => {},
  onSadPathWithoutParams: () => {},
};

export const VPStateContext = createContext<VPState>(defaultState);

export const VPCallbackContext = createContext<VPCallback>(defaultCallbacks);

const { Provider: StateProvider } = VPStateContext;
const { Provider: CallbackProvider } = VPCallbackContext;

const reducer: React.Reducer<VPState, Action> = (state: VPState, action: Action): VPState => {
  switch (action.type) {
    case ActionType.OnDateSelection: {
      const { newSelectedDates } = action;
      return Update({
        ...state,
        selectedDates: newSelectedDates,
        isSadPathWithoutParams: false,
      });
    }
    case ActionType.OnSetVPUnavailableDates: {
      const { unavailableDatesRange } = action;
      return Update({
        ...state,
        unavailableDatesRange,
      });
    }
    case ActionType.OnSadPathWithoutParams: {
      const { isSadPathWithoutParams } = action;
      return Update({
        ...state,
        isSadPathWithoutParams,
      });
    }
    default: {
      return state;
    }
  }
};

export const VPStateContextProvider = ({
  tripId,
  requestId = "",
  preFetchRequestId = "",
  vacationLength = 0,
  selectedDates = { from: undefined, to: undefined },
  vpCountryCode = "",
  usePrefetch = false,
  children,
}: {
  tripId: string;
  requestId?: string;
  preFetchRequestId?: string;
  vacationLength?: number;
  selectedDates?: SharedTypes.SelectedDates;
  vpCountryCode?: string;
  usePrefetch?: boolean;
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducerWithSideEffects<React.Reducer<VPState, Action>>(reducer, {
    ...defaultState,
    tripId,
    requestId,
    preFetchRequestId,
    vacationLength,
    selectedDates,
    vpCountryCode,
    usePrefetch,
  });

  const onDateSelection = useCallback(
    (newSelectedDates: SharedTypes.SelectedDates) =>
      dispatch({
        type: ActionType.OnDateSelection,
        newSelectedDates,
      }),
    [dispatch]
  );
  const onSadPathWithoutParams = useCallback(
    (isSadPathWithoutParams: boolean) =>
      dispatch({
        type: ActionType.OnSadPathWithoutParams,
        isSadPathWithoutParams,
      }),
    [dispatch]
  );
  useQuery<VacationPackageTypes.QueryVPInvalidMonths>(VPInvalidMonthsQuery, {
    variables: {
      id: tripId,
    },
    onCompleted: data => {
      dispatch({
        type: ActionType.OnSetVPUnavailableDates,
        unavailableDatesRange: !data?.invalidMonths?.length
          ? undefined
          : data.invalidMonths.map(({ from, to }) => ({
              from: new Date(from),
              to: new Date(to),
            })),
      });
    },
    onError: () => {
      dispatch({
        type: ActionType.OnSetVPUnavailableDates,
        unavailableDatesRange: undefined,
      });
    },
  });
  return (
    <StateProvider value={state}>
      <CallbackProvider
        value={{
          onDateSelection,
          onSadPathWithoutParams,
        }}
      >
        {children}
      </CallbackProvider>
    </StateProvider>
  );
};
