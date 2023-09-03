import React, { createContext, ReactNode, useCallback, RefObject } from "react";
import useReducerWithSideEffects, { Update } from "use-reducer-with-side-effects";

import { BookingWidgetView } from "../VPBookingWidget/utils/vpBookingWidgetUtils";

export enum VPActiveModalTypes {
  None,
  EditCar,
  EditFlight,
  EditStay,
  EditTour,
  InfoCar,
  InfoFlight,
  InfoStay,
  InfoTour,
}

export enum VPStepsTypes {
  Location,
  Dates,
  Travellers,
}

export type VPModalState = {
  bookingWidgetView: BookingWidgetView;
  vacationSearchSteps: VPStepsTypes;
  currentStep?: VPStepsTypes.Dates | VPStepsTypes.Location | VPStepsTypes.Travellers;
  isMobileSteps: boolean;
  isMobileSearchOpen: boolean;
  isBookingStepsOpen: boolean;
  activeModalType: VPActiveModalTypes;
  activeModalId?: string | number;
};

enum ActionType {
  OnToggleBookingSearchIsOpen,
  OnToggleBookingSearchIsClosed,
  OnToggleIsOpen,
  OnToggleIsClosed,
  OnSetVPBookingWidgetView,
  OnToggleIsVPMobileSearchOpen,
  OnToggleModal,
  OnSetActiveModal,
}

type Action =
  | {
      type: ActionType.OnToggleBookingSearchIsOpen;
      vPMobileStep: VPStepsTypes;
    }
  | {
      type: ActionType.OnToggleBookingSearchIsClosed;
      ref: RefObject<HTMLDivElement>;
    }
  | {
      type: ActionType.OnToggleIsOpen;
      vPMobileStep: VPStepsTypes;
    }
  | {
      type: ActionType.OnToggleIsClosed;
    }
  | {
      type: ActionType.OnSetVPBookingWidgetView;
      bookingWidgetView: BookingWidgetView;
    }
  | {
      type: ActionType.OnToggleIsVPMobileSearchOpen;
      isOpen?: boolean;
    }
  | {
      type: ActionType.OnToggleModal;
      modalType: VPActiveModalTypes;
      modalId?: string | number;
    }
  | {
      type: ActionType.OnSetActiveModal;
      activeModalType: VPActiveModalTypes;
      activeModalId?: string | number;
    };

type VPModalCallback = {
  onToggleBookingSearchIsOpen: (vPMobileStep: VPStepsTypes) => void;
  onToggleBookingSearchIsClosed: (ref: RefObject<HTMLDivElement>) => void;
  onToggleIsOpen: (vPMobileStep: VPStepsTypes) => void;
  onToggleIsClosed: () => void;
  onSetVPBookingWidgetView: (bookingWidgetView: BookingWidgetView) => void;
  onToggleIsVPMobileSearchOpen: () => void;
  onCloseVPMobileSearch: () => void;
  onToggleModal: (modalType: VPActiveModalTypes, modalId?: string | number) => void;
  onSetActiveModal: (activeModalType: VPActiveModalTypes, activeModalId?: string | number) => void;
};

const defaultState: VPModalState = {
  bookingWidgetView: BookingWidgetView.Default,
  currentStep: undefined,
  vacationSearchSteps: VPStepsTypes.Dates,
  isMobileSteps: false,
  isMobileSearchOpen: false,
  isBookingStepsOpen: false,
  activeModalType: VPActiveModalTypes.None,
  activeModalId: undefined,
};

const defaultCallbacks: VPModalCallback = {
  onToggleBookingSearchIsOpen: () => {},
  onToggleBookingSearchIsClosed: () => {},
  onToggleIsOpen: () => {},
  onToggleIsClosed: () => {},
  onSetVPBookingWidgetView: () => {},
  onToggleIsVPMobileSearchOpen: () => {},
  onCloseVPMobileSearch: () => {},
  onToggleModal: () => {},
  onSetActiveModal: () => {},
};

export const VPModalStateContext = createContext<VPModalState>(defaultState);

export const VPModalCallbackContext = createContext<VPModalCallback>(defaultCallbacks);

const { Provider: StateProvider } = VPModalStateContext;
const { Provider: CallbackProvider } = VPModalCallbackContext;

const reducer: React.Reducer<VPModalState, Action> = (
  state: VPModalState,
  action: Action
): VPModalState => {
  switch (action.type) {
    case ActionType.OnToggleBookingSearchIsOpen: {
      const { vPMobileStep } = action;
      return Update({
        ...state,
        isBookingStepsOpen: !state.isBookingStepsOpen,
        currentStep: vPMobileStep,
        bookingWidgetView: state.bookingWidgetView + 1,
      });
    }
    case ActionType.OnToggleBookingSearchIsClosed: {
      const { ref } = action;
      if (state.currentStep === VPStepsTypes.Dates) {
        ref.current?.scrollIntoView({ block: "start" });
      }
      return Update({
        ...state,
        isBookingStepsOpen: false,
        currentStep: undefined,
        bookingWidgetView: state.bookingWidgetView - 1,
      });
    }
    case ActionType.OnToggleIsOpen: {
      const { vPMobileStep } = action;
      return Update({
        ...state,
        isMobileSteps: !state.isMobileSteps,
        currentStep: vPMobileStep,
      });
    }
    case ActionType.OnToggleIsClosed: {
      return Update({
        ...state,
        isMobileSteps: false,
        currentStep: undefined,
      });
    }
    case ActionType.OnSetVPBookingWidgetView: {
      const { bookingWidgetView } = action;
      return Update({
        ...state,
        bookingWidgetView,
      });
    }
    case ActionType.OnToggleIsVPMobileSearchOpen: {
      const { isOpen = !state.isMobileSearchOpen } = action;
      return Update({
        ...state,
        isMobileSearchOpen: isOpen,
      });
    }
    case ActionType.OnToggleModal: {
      const { modalType, modalId } = action;
      return Update({
        ...state,
        activeModalType: modalType,
        activeModalId: modalId,
      });
    }
    case ActionType.OnSetActiveModal: {
      const { activeModalType, activeModalId } = action;
      return Update({
        ...state,
        activeModalType,
        activeModalId,
      });
    }
    default: {
      return state;
    }
  }
};

export const VPModalStateContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducerWithSideEffects<React.Reducer<VPModalState, Action>>(
    reducer,
    defaultState
  );

  const onToggleBookingSearchIsOpen = useCallback(
    (vPMobileStep: VPStepsTypes) =>
      dispatch({
        type: ActionType.OnToggleBookingSearchIsOpen,
        vPMobileStep,
      }),
    [dispatch]
  );
  const onToggleBookingSearchIsClosed = useCallback(
    (ref: RefObject<HTMLDivElement>) =>
      dispatch({
        type: ActionType.OnToggleBookingSearchIsClosed,
        ref,
      }),
    [dispatch]
  );
  const onToggleIsOpen = useCallback(
    (vPMobileStep: VPStepsTypes) =>
      dispatch({
        type: ActionType.OnToggleIsOpen,
        vPMobileStep,
      }),
    [dispatch]
  );
  const onToggleIsClosed = useCallback(
    () =>
      dispatch({
        type: ActionType.OnToggleIsClosed,
      }),
    [dispatch]
  );
  const onSetVPBookingWidgetView = useCallback(
    (bookingWidgetView: BookingWidgetView) =>
      dispatch({
        type: ActionType.OnSetVPBookingWidgetView,
        bookingWidgetView,
      }),
    [dispatch]
  );
  const onToggleIsVPMobileSearchOpen = useCallback(
    () =>
      dispatch({
        type: ActionType.OnToggleIsVPMobileSearchOpen,
      }),
    [dispatch]
  );

  const onCloseVPMobileSearch = useCallback(
    () =>
      dispatch({
        type: ActionType.OnToggleIsVPMobileSearchOpen,
        isOpen: false,
      }),
    [dispatch]
  );

  const onToggleModal = useCallback(
    (modalType: VPActiveModalTypes, modalId?: string | number) =>
      dispatch({
        type: ActionType.OnToggleModal,
        modalType,
        modalId,
      }),
    [dispatch]
  );
  const onSetActiveModal = useCallback(
    (activeModalType: VPActiveModalTypes, activeModalId?: string | number) =>
      dispatch({
        type: ActionType.OnSetActiveModal,
        activeModalType,
        activeModalId,
      }),
    [dispatch]
  );
  return (
    <StateProvider value={state}>
      <CallbackProvider
        value={{
          onToggleBookingSearchIsOpen,
          onToggleBookingSearchIsClosed,
          onToggleIsOpen,
          onToggleIsClosed,
          onSetVPBookingWidgetView,
          onToggleIsVPMobileSearchOpen,
          onCloseVPMobileSearch,
          onToggleModal,
          onSetActiveModal,
        }}
      >
        {children}
      </CallbackProvider>
    </StateProvider>
  );
};
