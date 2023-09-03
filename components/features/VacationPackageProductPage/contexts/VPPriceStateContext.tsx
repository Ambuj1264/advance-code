import React, { createContext, ReactNode, useCallback } from "react";
import useReducerWithSideEffects, { Update } from "use-reducer-with-side-effects";

export const VP_DEFAULT_CAR_DESTINATION_ID = "default";

type VPPriceState = {
  vpPriceLoading: boolean;
  vpPriceError?: Error;
  vpPrice: number;
  stayPriceInput: VacationPackageTypes.StaysPriceInput[];
  tourPriceInput: VacationPackageTypes.ToursPriceInput[];
  carPriceInput: VacationPackageTypes.CarPriceInput[];
  flightPriceInput: VacationPackageTypes.FlightPriceInput[];
  isVPPriceAvailable: boolean;
  fromPrice: number;
};

enum ActionType {
  OnSetTourPriceInput,
  OnSetStayPriceInput,
  OnSetCarPriceInput,
  OnSetFlightPriceInput,
  OnSetPrice,
  OnSetIsPriceAvailable,
  OnResetPriceData,
  OnSetPriceLoading,
}

type Action =
  | {
      type: ActionType.OnSetTourPriceInput;
      tourPriceInput: VacationPackageTypes.ToursPriceInput[];
    }
  | {
      type: ActionType.OnSetStayPriceInput;
      stayPriceInput: VacationPackageTypes.StaysPriceInput[];
    }
  | {
      type: ActionType.OnSetCarPriceInput;
      carPriceInput: VacationPackageTypes.CarPriceInput[];
    }
  | {
      type: ActionType.OnSetFlightPriceInput;
      flightPriceInput: VacationPackageTypes.FlightPriceInput[];
    }
  | {
      type: ActionType.OnSetPrice;
      price?: number;
    }
  | {
      type: ActionType.OnSetIsPriceAvailable;
      isPriceAvailable: boolean;
    }
  | {
      type: ActionType.OnResetPriceData;
    };

type VPPriceCallback = {
  onSetTourPriceInput: (tourPriceInput: VacationPackageTypes.ToursPriceInput[]) => void;
  onSetStayPriceInput: (stayPriceInput: VacationPackageTypes.StaysPriceInput[]) => void;
  onSetCarPriceInput: (carPriceInput: VacationPackageTypes.CarPriceInput[]) => void;
  onSetFlightPriceInput: (flightPriceInput: VacationPackageTypes.FlightPriceInput[]) => void;
  onSetPrice: (price?: number) => void;
  onSetIsPriceAvailable: (isPriceAvailable: boolean) => void;
  onResetPriceData: () => void;
};

const defaultState: VPPriceState = {
  vpPriceLoading: true,
  vpPriceError: undefined,
  vpPrice: 0,
  stayPriceInput: [],
  tourPriceInput: [],
  carPriceInput: [],
  flightPriceInput: [],
  isVPPriceAvailable: false,
  fromPrice: 0,
};

const defaultCallbacks: VPPriceCallback = {
  onSetTourPriceInput: () => {},
  onSetStayPriceInput: () => {},
  onSetCarPriceInput: () => {},
  onSetFlightPriceInput: () => {},
  onSetPrice: () => {},
  onSetIsPriceAvailable: () => {},
  onResetPriceData: () => {},
};

export const VPPriceStateContext = createContext<VPPriceState>(defaultState);

export const VPPriceCallbackContext = createContext<VPPriceCallback>(defaultCallbacks);

const { Provider: StateProvider } = VPPriceStateContext;
const { Provider: CallbackProvider } = VPPriceCallbackContext;

const reducer: React.Reducer<VPPriceState, Action> = (
  state: VPPriceState,
  action: Action
): VPPriceState => {
  switch (action.type) {
    case ActionType.OnSetTourPriceInput: {
      const { tourPriceInput } = action;
      return Update({
        ...state,
        tourPriceInput,
        stayPriceInput: [],
        carPriceInput: [],
        flightPriceInput: [],
        isVPPriceAvailable: false,
        vpPriceLoading: true,
      });
    }
    case ActionType.OnSetStayPriceInput: {
      const { stayPriceInput } = action;
      return Update({
        ...state,
        stayPriceInput,
        carPriceInput: [],
        flightPriceInput: [],
        isVPPriceAvailable: false,
        vpPriceLoading: true,
      });
    }
    case ActionType.OnSetCarPriceInput: {
      const { carPriceInput } = action;
      return Update({
        ...state,
        isVPPriceAvailable: false,
        vpPriceLoading: true,
        carPriceInput,
        stayPriceInput: [],
        flightPriceInput: [],
      });
    }
    case ActionType.OnSetFlightPriceInput: {
      const { flightPriceInput } = action;
      return Update({
        ...state,
        flightPriceInput,
        stayPriceInput: [],
        carPriceInput: [],
        vpPriceLoading: true,
        isVPPriceAvailable: false,
      });
    }
    case ActionType.OnSetPrice: {
      const { price } = action;
      return Update({
        ...state,
        vpPrice: price ?? 0,
        isVPPriceAvailable: true,
        vpPriceLoading: false,
      });
    }
    case ActionType.OnSetIsPriceAvailable: {
      const { isPriceAvailable } = action;
      return Update({
        ...state,
        isVPPriceAvailable: isPriceAvailable,
        vpPriceLoading: !isPriceAvailable,
      });
    }
    case ActionType.OnResetPriceData: {
      return Update({
        ...state,
        vpPriceLoading: true,
        stayPriceInput: [],
        tourPriceInput: [],
        carPriceInput: [],
        flightPriceInput: [],
        isVPPriceAvailable: false,
      });
    }
    default: {
      return state;
    }
  }
};

export const VPPriceStateContextProvider = ({
  fromPrice = 0,
  children,
}: {
  fromPrice?: number;
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducerWithSideEffects<React.Reducer<VPPriceState, Action>>(
    reducer,
    {
      ...defaultState,
      fromPrice,
    }
  );
  const onSetTourPriceInput = useCallback(
    (tourPriceInput: VacationPackageTypes.ToursPriceInput[]) =>
      dispatch({
        type: ActionType.OnSetTourPriceInput,
        tourPriceInput,
      }),
    [dispatch]
  );
  const onSetStayPriceInput = useCallback(
    (stayPriceInput: VacationPackageTypes.StaysPriceInput[]) =>
      dispatch({
        type: ActionType.OnSetStayPriceInput,
        stayPriceInput,
      }),
    [dispatch]
  );
  const onSetCarPriceInput = useCallback(
    (carPriceInput: VacationPackageTypes.CarPriceInput[]) =>
      dispatch({
        type: ActionType.OnSetCarPriceInput,
        carPriceInput,
      }),
    [dispatch]
  );
  const onSetFlightPriceInput = useCallback(
    (flightPriceInput: VacationPackageTypes.FlightPriceInput[]) =>
      dispatch({
        type: ActionType.OnSetFlightPriceInput,
        flightPriceInput,
      }),
    [dispatch]
  );
  const onSetPrice = useCallback(
    (price?: number) =>
      dispatch({
        type: ActionType.OnSetPrice,
        price,
      }),
    [dispatch]
  );
  const onSetIsPriceAvailable = useCallback(
    (isPriceAvailable: boolean) =>
      dispatch({
        type: ActionType.OnSetIsPriceAvailable,
        isPriceAvailable,
      }),
    [dispatch]
  );
  const onResetPriceData = useCallback(
    () =>
      dispatch({
        type: ActionType.OnResetPriceData,
      }),
    [dispatch]
  );
  return (
    <StateProvider value={state}>
      <CallbackProvider
        value={{
          onSetTourPriceInput,
          onSetStayPriceInput,
          onSetCarPriceInput,
          onSetFlightPriceInput,
          onSetPrice,
          onSetIsPriceAvailable,
          onResetPriceData,
        }}
      >
        {children}
      </CallbackProvider>
    </StateProvider>
  );
};
