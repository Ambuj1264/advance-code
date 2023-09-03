import React, { createContext, ReactNode, useCallback, SyntheticEvent } from "react";
import useReducerWithSideEffects, { Update } from "use-reducer-with-side-effects";

import useBloggerSearchQueryParams from "./utils/useBloggerSearchQueryParams";

import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";

type BloggerSearchPageState = {
  isSearchWidgetModalOpen: boolean;
  text: string;
  isFilterModalOpen: boolean;
};

enum ActionType {
  OnInputChange,
  OnSearchWidgetToggle,
  OnFilterModalToggle,
}

type Action =
  | {
      type: ActionType.OnSearchWidgetToggle;
    }
  | {
      type: ActionType.OnFilterModalToggle;
    }
  | {
      type: ActionType.OnInputChange;
      text: string;
    };

type BloggerSearchPageCallback = {
  onSearchWidgetModalToggle: () => void;
  onFilterModalToggle: () => void;
  onInputChange: (text: string) => void;
  onSearchClick: (e: SyntheticEvent) => void;
};

const defaultState: BloggerSearchPageState = {
  isSearchWidgetModalOpen: false,
  text: "",
  isFilterModalOpen: false,
};

const defaultCallbacks: BloggerSearchPageCallback = {
  onSearchWidgetModalToggle: () => {},
  onFilterModalToggle: () => {},
  onInputChange: () => {},
  onSearchClick: () => {},
};

export const BloggerSearchPageStateContext = createContext<BloggerSearchPageState>(defaultState);

export const BloggerSearchPageCallbackContext =
  createContext<BloggerSearchPageCallback>(defaultCallbacks);

const { Provider: StateProvider } = BloggerSearchPageStateContext;
const { Provider: CallbackProvider } = BloggerSearchPageCallbackContext;

const reducer: React.Reducer<BloggerSearchPageState, Action> = (
  state: BloggerSearchPageState,
  action: Action
): BloggerSearchPageState => {
  switch (action.type) {
    case ActionType.OnSearchWidgetToggle: {
      return Update({
        ...state,
        isSearchWidgetModalOpen: !state.isSearchWidgetModalOpen,
      });
    }
    case ActionType.OnFilterModalToggle: {
      return Update({
        ...state,
        isFilterModalOpen: !state.isFilterModalOpen,
      });
    }
    case ActionType.OnInputChange: {
      const { text } = action;
      return Update({
        ...state,
        text,
      });
    }
    default: {
      return state;
    }
  }
};

export const BloggerSearchPageStateContextProvider = ({ children }: { children: ReactNode }) => {
  const [queryState, setQueryParams] = useBloggerSearchQueryParams();

  const [state, dispatch] = useReducerWithSideEffects<
    React.Reducer<BloggerSearchPageState, Action>
  >(reducer, {
    ...defaultState,
    text: queryState.text ?? defaultState.text,
  });

  const onSearchWidgetModalToggle = useCallback(
    () =>
      dispatch({
        type: ActionType.OnSearchWidgetToggle,
      }),
    [dispatch]
  );

  const onFilterModalToggle = useCallback(
    () =>
      dispatch({
        type: ActionType.OnFilterModalToggle,
      }),
    [dispatch]
  );

  const onInputChange = useCallback(
    (text: string) => {
      dispatch({
        type: ActionType.OnInputChange,
        text,
      });
    },
    [dispatch]
  );

  const onSearchClick = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      const { text } = state;
      const queryParams = {
        ...(text && {
          text,
        }),
        page: 1,
      };
      setQueryParams(queryParams, QueryParamTypes.PUSH_IN);
    },
    [setQueryParams, state]
  );

  return (
    <StateProvider value={state}>
      <CallbackProvider
        value={{
          onInputChange,
          onSearchClick,
          onSearchWidgetModalToggle,
          onFilterModalToggle,
        }}
      >
        {children}
      </CallbackProvider>
    </StateProvider>
  );
};
