import React, { createContext, useContext, useCallback, useReducer, useEffect } from "react";

enum ModalActions {
  PUSH,
  REMOVE,
  REMOVE_ALL,
  GO_BACK,
  INTERNAL_RESET_STATE,
}

type Modal = {
  id: string;
  toRemove?: boolean;
  onClose: () => void;
};

export type ModalsStateType = {
  modals: Modal[];
  currentId: string;
  currentIndex: number;
  hasPrevious: boolean;
  prepareModalForRemoval: boolean;
  removeAllModals: boolean;
  renderCloseButton: boolean;
  onAfter?: () => void;
};

type ModalsActionType = {
  type: ModalActions;
  payload?: Modal;
  onAfter?: () => void;
};

export const defaultState: ModalsStateType = {
  modals: [],
  currentId: "",
  currentIndex: -1,
  hasPrevious: false,
  prepareModalForRemoval: false,
  removeAllModals: false,
  renderCloseButton: true,
};

type ModalHistoryContextType = ModalsStateType & {
  pushModal: (payload: Modal) => void;
  prevModal: () => Promise<unknown>;
  resetState: () => Promise<unknown>;
};

export const modalsHistoryReducer = (
  state: ModalsStateType,
  action: ModalsActionType
): ModalsStateType => {
  switch (action.type) {
    case ModalActions.PUSH: {
      if (!action.payload) {
        return state;
      }

      const { id } = action.payload;
      let modals: Modal[];
      const existingModalIndex = state.modals.findIndex(modal => modal?.id === id);
      if (existingModalIndex !== -1) {
        modals = [...state.modals.filter(modal => modal.id !== id), action.payload];
      } else {
        modals = [...state.modals, action.payload];
      }

      const currentIndex = modals.filter(m => m.toRemove !== true).length - 1;

      return {
        modals,
        currentId: modals[currentIndex].id,
        currentIndex,
        hasPrevious: currentIndex > 0,
        prepareModalForRemoval: false,
        removeAllModals: false,
        renderCloseButton: !(currentIndex > 0) || currentIndex + 1 === 1,
      };
    }

    case ModalActions.GO_BACK: {
      const { onAfter } = action;
      if (state.hasPrevious) {
        const currentIndex = state.currentIndex - 1;
        return {
          modals: state.modals.map((i, index) => ({
            ...i,
            toRemove: index === state.currentIndex,
          })),
          currentId: state.modals[currentIndex].id,
          currentIndex,
          hasPrevious: currentIndex > 0,
          prepareModalForRemoval: true,
          removeAllModals: false,
          renderCloseButton: false,
          onAfter,
        };
      }

      return {
        ...state,
        removeAllModals: true,
        renderCloseButton: true,
        onAfter,
      };
    }

    case ModalActions.REMOVE: {
      const { onAfter } = action;
      const activeModals = state.modals.filter(modal => modal.toRemove !== true);
      return {
        ...state,
        modals: activeModals,
        prepareModalForRemoval: false,
        removeAllModals: false,
        renderCloseButton: activeModals.length === 1,
        onAfter,
      };
    }

    case ModalActions.REMOVE_ALL: {
      const { onAfter } = action;
      return {
        ...state,
        removeAllModals: true,
        onAfter,
      };
    }

    case ModalActions.INTERNAL_RESET_STATE: {
      return defaultState;
    }

    default:
      return state;
  }
};

const ModalHistoryContext = createContext<ModalHistoryContextType>({
  modals: [],
  prepareModalForRemoval: false,
  removeAllModals: false,
  currentId: "",
  currentIndex: 0,
  hasPrevious: false,
  renderCloseButton: true,
  /* eslint-disable @typescript-eslint/no-empty-function */
  pushModal: () => {},
  prevModal: () => Promise.resolve(),
  resetState: () => Promise.resolve(),
  /* eslint-enable @typescript-eslint/no-empty-function */
});

export const useModalHistoryContext = () => useContext(ModalHistoryContext);

export const ModalHistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(modalsHistoryReducer, defaultState);

  const pushModal = useCallback((payload: Modal) => {
    dispatch({ type: ModalActions.PUSH, payload });
  }, []);

  const prevModal = useCallback(() => {
    let resolve;
    const promise = new Promise(res => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      resolve = res;
    });
    dispatch({ type: ModalActions.GO_BACK, onAfter: resolve });
    return promise;
  }, []);

  const resetState = useCallback(() => {
    let resolve;
    const promise = new Promise(res => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      resolve = res;
    });
    dispatch({ type: ModalActions.REMOVE_ALL, onAfter: resolve });
    return promise;
  }, []);

  const resetInternalState = useCallback(() => {
    dispatch({ type: ModalActions.INTERNAL_RESET_STATE });
  }, []);

  useEffect(() => {
    if (state.prepareModalForRemoval) {
      const toRemove = state.modals.find(modal => modal.toRemove === true);

      if (toRemove) {
        toRemove.onClose();
        dispatch({ type: ModalActions.REMOVE, onAfter: state.onAfter });
        state.onAfter?.();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.modals, state.prepareModalForRemoval, state.onAfter]);

  useEffect(() => {
    if (state.removeAllModals) {
      // eslint-disable-next-line no-plusplus
      for (let i = state.modals.length - 1; i >= 0; i--) {
        state.modals[i].onClose();
      }
      state.onAfter?.();
      resetInternalState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetInternalState, state.modals, state.removeAllModals]);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ModalHistoryContext.Provider value={{ ...state, pushModal, prevModal, resetState }}>
      {children}
    </ModalHistoryContext.Provider>
  );
};
