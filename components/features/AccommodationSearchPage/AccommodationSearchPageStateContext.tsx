import React, {
  createContext,
  ReactNode,
  useCallback,
  SyntheticEvent,
  Dispatch,
  useEffect,
} from "react";
import Router from "next/router";
import useReducerWithSideEffects, { Update } from "use-reducer-with-side-effects";
import { stringify } from "use-query-params";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { addDays } from "date-fns";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";

import useAccommodationSearchQueryParams, {
  decodeOccupanciesArray,
  encodeOccupanciesToArrayString,
} from "./utils/useAccommodationSearchQueryParams";
import { StepsEnum } from "./AccommodationSearchWidgetModal/enums";
import { normalizeLocationItems } from "./utils/accommodationSearchUtils";
import GetPlaceNameTranslatedQuery from "./queries/GetPlaceNameTranslatedQuery.graphql";

import { PageType, Marketplace, CursorPaginationQueryParams } from "types/enums";
import { useSettings } from "contexts/SettingsContext";
import { updateChildrenAgesValue, changeChildrenAgesLength } from "utils/sharedAccommodationUtils";
import AutocompleteHotelsQuery from "components/features/AccommodationSearchPage/queries/AutocompleteStaysQuery.graphql";
import {
  constructSelectedDatesFromQuery,
  constructQueryFromSelectedDates,
  isSameSelectedDates,
  getDatesInFuture,
} from "components/ui/DatePicker/utils/datePickerUtils";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import {
  getAdjustedDatesInLocalStorage,
  setDatesInLocalStorage,
  setNumberOfRoomsInLocalStorage,
  setNumberOfGuestsInLocalStorage,
  clearDatesInLocalStorage,
  setAccommodationLocation,
  getAccommodationLocation,
} from "utils/localStorageUtils";
import useActiveLocale from "hooks/useActiveLocale";
import { getClientSideUrl } from "utils/helperUtils";
import { useGlobalContext } from "contexts/GlobalContext";
import { ActiveLocationAutocomplete } from "components/ui/FrontSearchWidget/utils/FrontEnums";

type AccommodationSearchPageState = {
  selectedDates: SharedTypes.SelectedDates;
  isSearchWidgetModalOpen: boolean;
  isSearchResultsPage?: boolean;
  searchWidgetModalStep: StepsEnum;
  searchWidgetOpenedStep: StepsEnum;
  location: AccommodationSearchTypes.LocationObject;
  defaultLocation?: AccommodationSearchTypes.LocationObject;
  locationItems?: SharedTypes.AutocompleteItem[];
  numberOfGuests: SharedTypes.NumberOfGuests;
  numberOfRooms: number;
  isDesktopCalendarOpen: boolean;
  activeLocationAutocomplete: ActiveLocationAutocomplete;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  useNewGuestPicker: boolean;
};

export enum ActionType {
  OnDateSelection,
  ToggleSearchWidget,
  OnChangeModalStep,
  OnSetModalOpenedStep,
  OnLocationInputChange,
  OnLocationItemSelect,
  OnNumberOfGuestsChange,
  OnSetOccupancies,
  OnNumberOfRoomsChange,
  OnChildrenAgeChange,
  onSearchWidgetToggle,
  SetDefaultLocation,
  OnSetActiveLocationAutocomplete,
  SetIsSearchResultsPage,
}

export type ActionTypes =
  | {
      type: ActionType.OnDateSelection;
      selectedDates: SharedTypes.SelectedDates;
    }
  | {
      type: ActionType.ToggleSearchWidget;
      isOpen?: boolean;
    }
  | {
      type: ActionType.OnChangeModalStep;
      step: StepsEnum;
    }
  | {
      type: ActionType.OnSetModalOpenedStep;
      step: StepsEnum;
    }
  | {
      type: ActionType.OnLocationInputChange;
      name?: string;
      locationItems?: SharedTypes.AutocompleteItem[];
    }
  | {
      type: ActionType.OnLocationItemSelect;
      id?: string;
      name?: string;
      accommodationType?: string;
    }
  | {
      type: ActionType.OnNumberOfGuestsChange;
      adults: number;
      children: number;
    }
  | {
      type: ActionType.OnSetOccupancies;
      occupancies: StayBookingWidgetTypes.Occupancy[];
    }
  | {
      type: ActionType.OnNumberOfRoomsChange;
      numberOfRooms: number;
    }
  | {
      type: ActionType.OnChildrenAgeChange;
      value: number;
      index: number;
    }
  | {
      type: ActionType.SetDefaultLocation;
      locationItems: SharedTypes.AutocompleteItem[];
      defaultLocation?: AccommodationSearchTypes.LocationObject;
    }
  | {
      type: ActionType.OnSetActiveLocationAutocomplete;
      activeLocationAutocomplete: ActiveLocationAutocomplete;
    }
  | {
      type: ActionType.SetIsSearchResultsPage;
      value: boolean;
    };

type AccommodationSearchPageCallback = {
  dispatch: (action: ActionTypes) => void;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  onSearchWidgetToggle: (isOpen?: boolean) => void;
  onChangeModalStep: (step: StepsEnum) => void;
  onClearDates: () => void;
  onLocationInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationItemSelect: (item?: SharedTypes.AutocompleteItem) => void;
  onSearchClick: (e: SyntheticEvent) => void;
  onSetNumberOfGuests: (adults: number, children: number) => void;
  onSetOccupancies: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  onSetNumberOfRooms: (numberOfRooms: number) => void;
  onUpdateChildrenAges: (value: number, index: number) => void;
  openModalOnStep: (step: StepsEnum) => void;
  setDefaultLocation: (
    defaultLocationsList: SharedTypes.AutocompleteItem[],
    defaultLocationItem?: AccommodationSearchTypes.LocationObject
  ) => void;
  onSetActiveLocationAutocomplete: (activeLocationAutocomplete: ActiveLocationAutocomplete) => void;
};

const defaultState: AccommodationSearchPageState = {
  selectedDates: { from: undefined, to: undefined },
  isSearchWidgetModalOpen: false,
  isSearchResultsPage: false,
  searchWidgetModalStep: StepsEnum.Details,
  searchWidgetOpenedStep: StepsEnum.Details,
  location: {
    id: undefined,
    name: undefined,
    type: undefined,
  },
  defaultLocation: {
    id: undefined,
    name: undefined,
    type: undefined,
  },
  locationItems: undefined,
  numberOfGuests: {
    adults: 2,
    children: [],
  },
  numberOfRooms: 1,
  occupancies: [{ numberOfAdults: 2, childrenAges: [] }],
  useNewGuestPicker: false,
  isDesktopCalendarOpen: false,
  activeLocationAutocomplete: ActiveLocationAutocomplete.None,
};

const defaultCallbacks: AccommodationSearchPageCallback = {
  dispatch: () => {},
  onDateSelection: () => {},
  onSearchWidgetToggle: () => {},
  onChangeModalStep: () => {},
  onClearDates: () => {},
  onLocationInputChange: () => {},
  onLocationItemSelect: () => {},
  onSearchClick: () => {},
  onSetNumberOfGuests: () => {},
  onSetNumberOfRooms: () => {},
  onUpdateChildrenAges: () => {},
  openModalOnStep: () => {},
  setDefaultLocation: () => {},
  onSetActiveLocationAutocomplete: () => {},
  onSetOccupancies: () => {},
};

export const AccommodationSearchPageStateContext =
  createContext<AccommodationSearchPageState>(defaultState);

export const AccommodationSearchPageCallbackContext =
  createContext<AccommodationSearchPageCallback>(defaultCallbacks);

const { Provider: StateProvider } = AccommodationSearchPageStateContext;
const { Provider: CallbackProvider } = AccommodationSearchPageCallbackContext;

const reducer: React.Reducer<AccommodationSearchPageState, ActionTypes> = (
  state: AccommodationSearchPageState,
  action: ActionTypes
): AccommodationSearchPageState => {
  switch (action.type) {
    case ActionType.OnDateSelection: {
      const { selectedDates } = action;
      setDatesInLocalStorage(selectedDates);
      return Update({ ...state, selectedDates });
    }
    case ActionType.ToggleSearchWidget: {
      const { isOpen } = action;
      return Update({
        ...state,
        isDesktopCalendarOpen: Boolean(isOpen),
        isSearchWidgetModalOpen: isOpen ?? !state.isSearchWidgetModalOpen,
      });
    }
    case ActionType.OnChangeModalStep: {
      const { step } = action;
      const { from, to } = state.selectedDates;
      const shouldPreselectToDate = step === StepsEnum.Details && from && !to;
      const selectedDates = shouldPreselectToDate ? { from, to: addDays(from!, 1) } : { from, to };
      return Update({ ...state, searchWidgetModalStep: step, selectedDates });
    }
    case ActionType.OnSetModalOpenedStep: {
      const { step } = action;
      return Update({
        ...state,
        searchWidgetOpenedStep: step,
      });
    }
    case ActionType.OnLocationInputChange: {
      const { name, locationItems } = action;

      setAccommodationLocation(undefined);

      return Update({
        ...state,
        ...(name === ""
          ? {
              location: {
                id: undefined,
                type: undefined,
                name: undefined,
              },
            }
          : {}),
        ...(locationItems
          ? {
              locationItems: normalizeLocationItems(locationItems),
            }
          : {}),
      });
    }
    case ActionType.OnLocationItemSelect: {
      const { id, name, accommodationType } = action;
      const location = {
        id: id || state.location.id,
        name: name || state.location.name,
        type: accommodationType || state.location.type,
      };

      setAccommodationLocation(location);

      return Update({
        ...state,
        location,
      });
    }
    case ActionType.OnNumberOfRoomsChange: {
      const { numberOfRooms } = action;
      setNumberOfRoomsInLocalStorage(numberOfRooms);
      return Update({ ...state, numberOfRooms });
    }
    case ActionType.OnChildrenAgeChange: {
      const { value, index } = action;
      const children = updateChildrenAgesValue(state.numberOfGuests.children, value, index);
      const numberOfGuests = {
        adults: state.numberOfGuests.adults,
        children,
      };
      setNumberOfGuestsInLocalStorage(numberOfGuests);
      return Update({
        ...state,
        numberOfGuests,
      });
    }
    case ActionType.OnNumberOfGuestsChange: {
      const { adults, children } = action;
      const updatedChildren = changeChildrenAgesLength(state.numberOfGuests.children, children);
      const numberOfGuests = {
        adults,
        children: updatedChildren,
      };
      setNumberOfGuestsInLocalStorage(numberOfGuests);
      return Update({
        ...state,
        numberOfGuests,
      });
    }
    case ActionType.OnSetOccupancies: {
      const { occupancies } = action;
      return Update({
        ...state,
        occupancies,
      });
    }
    case ActionType.SetDefaultLocation: {
      return Update({
        ...state,
        defaultLocation: action.defaultLocation,
        locationItems: action.locationItems,
      });
    }
    case ActionType.OnSetActiveLocationAutocomplete: {
      return Update({
        ...state,
        activeLocationAutocomplete: action.activeLocationAutocomplete,
      });
    }
    case ActionType.SetIsSearchResultsPage: {
      return Update({
        ...state,
        isSearchResultsPage: action.value,
      });
    }
    default: {
      return state;
    }
  }
};

const queryParamsToState = (
  {
    adults,
    children,
    rooms,
    id,
    address,
    type,
    occupancies,
  }: {
    adults?: number;
    children?: number[];
    rooms?: number;
    id?: string;
    address?: string;
    type?: string;
    occupancies?: string[];
  },
  noQueryParams: boolean,
  defaultLocation?: AccommodationSearchTypes.LocationObject
) => {
  return {
    numberOfGuests: {
      adults: adults ?? defaultState.numberOfGuests.adults,
      children: children || [],
    },
    occupancies: decodeOccupanciesArray(occupancies),
    numberOfRooms: rooms ?? defaultState.numberOfRooms,
    location: {
      id: id || (noQueryParams ? defaultLocation?.id : undefined),
      name: address || (noQueryParams ? defaultLocation?.name : undefined),
      type: type || (noQueryParams ? defaultLocation?.type : undefined),
    },
  };
};

export const AccommodationSearchPageStateContextProvider = ({
  defaultLocation,
  slug,
  children,
  prefilledCategoryId,
  onLocationInputChangeOverride,
  additionalParams,
  useNewGuestPicker = false,
  isSearchResultsPage = false,
}: {
  defaultLocation?: AccommodationSearchTypes.LocationObject;
  slug: string;
  children: ReactNode;
  prefilledCategoryId?: number;
  onLocationInputChangeOverride?: (dispatch: Dispatch<ActionTypes>) => void;
  additionalParams?: object;
  useNewGuestPicker?: boolean;
  isSearchResultsPage?: boolean;
}) => {
  const activeLocale = useActiveLocale();
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const isGTI = marketplace === Marketplace.GUIDE_TO_ICELAND;
  const [queryState, setQueryParams] = useAccommodationSearchQueryParams();
  const noQueryParams = stringify(queryState) === "";

  const lsLocation = getAccommodationLocation();

  const convertedQueryState = queryParamsToState(
    queryState,
    noQueryParams,
    lsLocation ? undefined : defaultLocation
  );

  const { dateFrom, dateTo } = queryState;
  const { fromDate, toDate } = getDatesInFuture(dateFrom, dateTo);
  const querySelectedDates = constructSelectedDatesFromQuery({
    dateFrom: fromDate,
    dateTo: toDate,
  });
  const prevQuerySelectedDates = usePreviousState(querySelectedDates);
  const isQuerySelectedDatesChanged = isSameSelectedDates(
    querySelectedDates,
    prevQuerySelectedDates
  );
  const { isMobileSearchWidgetBtnClicked } = useGlobalContext();
  if (isQuerySelectedDatesChanged) {
    setDatesInLocalStorage(querySelectedDates);
  }

  const [state, dispatch] = useReducerWithSideEffects<
    React.Reducer<AccommodationSearchPageState, ActionTypes>
  >(reducer, {
    ...defaultState,
    isSearchResultsPage,
    useNewGuestPicker,
    ...convertedQueryState,
    selectedDates: getAdjustedDatesInLocalStorage(),
    defaultLocation,
  });
  const onDateSelection = useCallback(
    (selectedDates: SharedTypes.SelectedDates) => {
      setDatesInLocalStorage(selectedDates);
      dispatch({ type: ActionType.OnDateSelection, selectedDates });
    },
    [dispatch]
  );
  const onSearchWidgetToggle = useCallback(
    (isOpen?: boolean) =>
      dispatch({
        type: ActionType.ToggleSearchWidget,
        isOpen,
      }),
    [dispatch]
  );

  const onChangeModalStep = useCallback(
    (step: StepsEnum) =>
      dispatch({
        type: ActionType.OnChangeModalStep,
        step,
      }),
    [dispatch]
  );

  const onSetModalOpenedStep = useCallback(
    (step: StepsEnum) =>
      dispatch({
        type: ActionType.OnSetModalOpenedStep,
        step,
      }),
    [dispatch]
  );

  const onClearDates = useCallback(() => {
    clearDatesInLocalStorage();
    dispatch({
      type: ActionType.OnDateSelection,
      selectedDates: defaultState.selectedDates,
    });
  }, [dispatch]);

  const setDefaultLocation = useCallback(
    (
      defaultLocationsList: SharedTypes.AutocompleteItem[],
      defaultLocationItem?: AccommodationSearchTypes.LocationObject
    ) => {
      dispatch({
        type: ActionType.SetDefaultLocation,
        defaultLocation: defaultLocationItem,
        locationItems: defaultLocationsList,
      });
    },
    [dispatch]
  );

  const [fetchAutocompletePlaces] =
    useLazyQuery<AccommodationSearchTypes.QueryAccommodationAutoComplete>(AutocompleteHotelsQuery, {
      onCompleted: ({ autoCompletePlaces }) =>
        dispatch({
          type: ActionType.OnLocationInputChange,
          locationItems: autoCompletePlaces,
        }),
    });
  const onLocationInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      fetchAutocompletePlaces({
        variables: {
          text: event.target.value,
        },
      });
      dispatch({
        type: ActionType.OnLocationInputChange,
        name: event.target.value,
      });
    },
    [dispatch, fetchAutocompletePlaces]
  );
  const onLocationItemSelect = useCallback(
    (item?: SharedTypes.AutocompleteItem) => {
      if (item) {
        dispatch({
          type: ActionType.OnLocationItemSelect,
          id: item.id,
          name: item.name,
          accommodationType: item.type,
        });
      }
    },
    [dispatch]
  );
  const onSetNumberOfGuests = useCallback(
    (adults: number, numberOfChildren: number) =>
      dispatch({
        type: ActionType.OnNumberOfGuestsChange,
        adults,
        children: numberOfChildren,
      }),
    [dispatch]
  );

  const onSetOccupancies = useCallback(
    (occupancies: StayBookingWidgetTypes.Occupancy[]) =>
      dispatch({
        type: ActionType.OnSetOccupancies,
        occupancies,
      }),
    [dispatch]
  );

  const onSetNumberOfRooms = useCallback(
    (numberOfRooms: number) =>
      dispatch({
        type: ActionType.OnNumberOfRoomsChange,
        numberOfRooms,
      }),
    [dispatch]
  );
  const onUpdateChildrenAges = useCallback(
    (value: number, index: number) =>
      dispatch({
        type: ActionType.OnChildrenAgeChange,
        value,
        index,
      }),
    [dispatch]
  );
  const openModalOnStep = useCallback(
    (step: StepsEnum) => {
      onChangeModalStep(step);
      onSetModalOpenedStep(step);
      onSearchWidgetToggle();
    },
    [onChangeModalStep, onSearchWidgetToggle, onSetModalOpenedStep]
  );

  const onSetActiveLocationAutocomplete = useCallback(
    (activeLocationAutocomplete: ActiveLocationAutocomplete) => {
      dispatch({
        type: ActionType.OnSetActiveLocationAutocomplete,
        activeLocationAutocomplete,
      });
    },
    [dispatch]
  );

  useQuery<{ getPlaceNameTranslated: string }>(GetPlaceNameTranslatedQuery, {
    variables: {
      id: lsLocation?.id,
      searchType: lsLocation?.type,
    },
    skip: isSearchResultsPage || !lsLocation || !isGTI,
    onCompleted: ({ getPlaceNameTranslated }) => {
      const translatedLsLocation = {
        ...lsLocation,
        name: getPlaceNameTranslated,
      };
      onLocationItemSelect(translatedLsLocation as SharedTypes.AutocompleteItem);
    },
  });

  const onSearchClick = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      isMobileSearchWidgetBtnClicked.current = true;

      const { numberOfGuests, numberOfRooms, occupancies } = state;

      const { id, name, type } = state.location;

      const queryParams = {
        ...constructQueryFromSelectedDates(state.selectedDates),
        ...(name && {
          address: name,
        }),
        ...(id && {
          id,
        }),
        ...(type && {
          type,
        }),
        adults: numberOfGuests.adults,
        children: numberOfGuests.children,
        rooms: numberOfRooms,
        orderBy: "popularity",
        orderDirection: "desc",
        page: undefined,
        [CursorPaginationQueryParams.NEXT_PAGE_ID]: undefined,
        [CursorPaginationQueryParams.PREV_PAGE_ID]: undefined,
        occupancies: encodeOccupanciesToArrayString(occupancies),
        ...additionalParams,
      };

      if (slug !== "") {
        const params = {
          ...queryState,
          ...queryParams,
          ...(prefilledCategoryId && {
            category_ids: prefilledCategoryId,
          }),
        };

        Router.push(
          {
            pathname: `/${isGTE ? PageType.GTE_STAYS_SEARCH : PageType.ACCOMMODATION_SEARCH}`,
            query: {
              slug: "",
              ...params,
            },
          },
          {
            pathname: getClientSideUrl(
              isGTE ? "gteStaysSearch" : "accommodation",
              activeLocale,
              marketplace
            ),
            query: {
              ...params,
            },
          },
          { shallow: true }
        );
      } else {
        setQueryParams(queryParams, QueryParamTypes.PUSH_IN);
      }
    },
    [
      activeLocale,
      additionalParams,
      isGTE,
      isMobileSearchWidgetBtnClicked,
      marketplace,
      prefilledCategoryId,
      queryState,
      setQueryParams,
      slug,
      state,
    ]
  );

  const locationInputChangeCallback =
    (onLocationInputChangeOverride && onLocationInputChangeOverride(dispatch)) ||
    onLocationInputChange;

  useEffect(() => {
    dispatch({
      type: ActionType.SetIsSearchResultsPage,
      value: isSearchResultsPage,
    });
  }, [dispatch, isSearchResultsPage]);

  return (
    <StateProvider value={state}>
      <CallbackProvider
        value={{
          dispatch,
          onDateSelection,
          onSearchWidgetToggle,
          onChangeModalStep,
          onClearDates,
          onLocationInputChange: locationInputChangeCallback,
          onLocationItemSelect,
          onSearchClick,
          onSetNumberOfGuests,
          onSetOccupancies,
          onSetNumberOfRooms,
          onUpdateChildrenAges,
          openModalOnStep,
          setDefaultLocation,
          onSetActiveLocationAutocomplete,
        }}
      >
        {children}
      </CallbackProvider>
    </StateProvider>
  );
};
