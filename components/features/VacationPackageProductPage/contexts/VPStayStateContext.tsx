import React, { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import useReducerWithSideEffects, { Update } from "use-reducer-with-side-effects";
import { ApolloError } from "apollo-client";

import VPStaysSearchQuery from "../VPStaysSection/queries/StaysSearch.graphql";

import { VPStateContext } from "./VPStateContext";

import useQueryClient from "hooks/useQueryClient";
import { noCacheHeaders } from "utils/apiUtils";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import {
  addVPStayPrices,
  constructStaysSearchParams,
  constructStaysSelectedData,
  getMissingDaysString,
  sortStaysArray,
} from "components/features/VacationPackageProductPage/utils/vacationPackageUtils";
import { constructRoomCombinations } from "components/features/StayProductPage/StayBookingWidget/utils/stayBookingWidgetUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import useGetIpCountryCode from "hooks/useGetIpCountryCode";

export const SKIP_SAD_PATH_MESSAGE_KEY = "[skipSadPath]";

export type VPStayState = {
  hotels: VacationPackageTypes.VacationPackageStayProduct[];
  selectedStayDay?: number;
  staysLoadError?: Error;
  staysResultLoading: boolean;
  staysResultError?: ApolloError;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[];
};

enum ActionType {
  OnSetStaysResults,
  OnSortStaysByPrice,
  OnSelectStayProduct,
  OnSetStayLoadError,
  OnRemoveSelectedStays,
  OnOccupanciesChange,
  OnOccupanciesRoomsChange,
  OnSelectStayProductRooms,
}

type Action =
  | {
      type: ActionType.OnSetStaysResults;
      products: VacationPackageTypes.VacationPackageStayProduct[];
      vacationPackageDays: VacationPackageTypes.VacationPackageDay[];
      isMobile: boolean;
    }
  | {
      type: ActionType.OnSortStaysByPrice;
      stayPrices?: VacationPackageTypes.StayPrice[];
    }
  | {
      type: ActionType.OnSelectStayProduct;
      hotels: VacationPackageTypes.VacationPackageStayProduct[];
      selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[];
      selectedStayDay?: number;
    }
  | {
      type: ActionType.OnSetStayLoadError;
      staysLoadError?: Error;
    }
  | {
      type: ActionType.OnRemoveSelectedStays;
    }
  | {
      type: ActionType.OnOccupanciesChange;
      occupancies: StayBookingWidgetTypes.Occupancy[];
    }
  | {
      type: ActionType.OnOccupanciesRoomsChange;
      occupancies: StayBookingWidgetTypes.Occupancy[];
    }
  | {
      type: ActionType.OnSelectStayProductRooms;
      hotels: VacationPackageTypes.VacationPackageStayProduct[];
      selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[];
      selectedStayDay?: number;
    };

type VPStayCallback = {
  onSortStaysByPrice: (stayPrices?: VacationPackageTypes.StayPrice[]) => void;
  onSelectStayProduct: (
    hotels: VacationPackageTypes.VacationPackageStayProduct[],
    selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[],
    selectedStayDay?: number
  ) => void;
  onRemoveSelectedStays: () => void;
  onOccupanciesChange: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  onOccupanciesRoomsChange: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  onSelectStayProductRooms: (
    hotels: VacationPackageTypes.VacationPackageStayProduct[],
    selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[],
    selectedStayDay?: number
  ) => void;
  onSetStayLoadError: (staysLoadError?: Error) => void;
};

const defaultState: VPStayState = {
  hotels: [],
  selectedStayDay: 1,
  staysLoadError: undefined,
  staysResultLoading: false,
  staysResultError: undefined,
  occupancies: [
    {
      numberOfAdults: 2,
      childrenAges: [],
    },
  ],
  selectedHotelsRooms: [],
};

const defaultCallbacks: VPStayCallback = {
  onSortStaysByPrice: () => {},
  onSelectStayProduct: () => {},
  onRemoveSelectedStays: () => {},
  onOccupanciesChange: () => {},
  onOccupanciesRoomsChange: () => {},
  onSelectStayProductRooms: () => {},
  onSetStayLoadError: () => {},
};

export const VPStayStateContext = createContext<VPStayState>(defaultState);

export const VPStayCallbackContext = createContext<VPStayCallback>(defaultCallbacks);

const { Provider: StateProvider } = VPStayStateContext;
const { Provider: CallbackProvider } = VPStayCallbackContext;

const reducer: React.Reducer<VPStayState, Action> = (
  state: VPStayState,
  action: Action
): VPStayState => {
  switch (action.type) {
    case ActionType.OnSetStaysResults: {
      const { products, vacationPackageDays, isMobile } = action;
      const errorContextStr = ` Non-cached endpoint`;
      const selectedHotelsRooms = constructStaysSelectedData(products);
      const selectedRoomDays = selectedHotelsRooms.reduce((roomDays, room) => {
        return [...roomDays, ...room.groupedWithDays];
      }, [] as number[]);
      const hasError = selectedRoomDays.length !== vacationPackageDays.length - 1;
      const daysMissing = hasError
        ? getMissingDaysString(vacationPackageDays, selectedHotelsRooms)
        : "";
      const staysMissingError = hasError
        ? new Error(`Cannot find hotels for days in a VP ${errorContextStr}: ${daysMissing}`)
        : undefined;
      const staysResult = sortStaysArray(products, isMobile);
      return Update({
        ...state,
        hotels: staysResult,
        selectedHotelsRooms,
        staysLoadError: staysMissingError,
      });
    }
    case ActionType.OnSortStaysByPrice: {
      const { stayPrices } = action;
      const { hotels, selectedHotelsRooms } = addVPStayPrices(
        (state.hotels ?? []) as VacationPackageTypes.VacationPackageStayProduct[],
        state.selectedHotelsRooms,
        stayPrices
      );

      return Update({
        ...state,
        hotels,
        selectedHotelsRooms,
      });
    }
    case ActionType.OnSelectStayProduct: {
      const { hotels, selectedHotelsRooms, selectedStayDay } = action;
      return Update({
        ...state,
        selectedHotelsRooms,
        selectedStayDay,
        hotels,
      });
    }
    case ActionType.OnSelectStayProductRooms: {
      const { hotels, selectedHotelsRooms, selectedStayDay } = action;
      return Update({
        ...state,
        selectedHotelsRooms,
        selectedStayDay,
        hotels,
      });
    }
    case ActionType.OnSetStayLoadError: {
      const { staysLoadError } = action;
      return Update({
        ...state,
        staysLoadError,
      });
    }
    case ActionType.OnRemoveSelectedStays: {
      return Update({
        ...state,
        selectedHotelsRooms: [],
        hotels: [],
      });
    }
    case ActionType.OnOccupanciesChange: {
      const { occupancies } = action;
      return Update({
        ...state,
        occupancies,
        selectedHotelsRooms: [],
        hotels: [],
      });
    }
    case ActionType.OnOccupanciesRoomsChange: {
      const { occupancies } = action;
      return Update({
        ...state,
        occupancies,
      });
    }
    default: {
      return state;
    }
  }
};

export const VPStayStateContextProvider = ({
  vacationPackageDays,
  defaultOccupancies,
  children,
}: {
  vacationPackageDays: VacationPackageTypes.VacationPackageDay[];
  defaultOccupancies: StayBookingWidgetTypes.Occupancy[];
  children: ReactNode;
}) => {
  const { t: accommodationT } = useTranslation(Namespaces.accommodationNs);
  const { ipCountryCode } = useGetIpCountryCode();
  const [state, dispatch] = useReducerWithSideEffects<React.Reducer<VPStayState, Action>>(reducer, {
    ...defaultState,
    occupancies: defaultOccupancies,
  });
  const { selectedDates, tripId, requestId } = useContext(VPStateContext);
  const isMobile = useIsMobile();
  const staySearchParams: VacationPackageTypes.StaysSearchQueryParams = useMemo(
    () =>
      constructStaysSearchParams({
        tripId,
        occupancies: state.occupancies,
        selectedDates,
        requestId,
        ipCountryCode,
      }),
    [tripId, selectedDates, requestId, state.occupancies, ipCountryCode]
  );
  const ipCountryCodeMissing = ipCountryCode === "";
  const shouldSkip =
    staySearchParams.occupancies.length === 0 ||
    !staySearchParams.from.length ||
    ipCountryCodeMissing;
  const variables = useMemo(
    () => ({
      input: staySearchParams,
    }),
    [staySearchParams]
  );
  const {
    data,
    loading: staysResultLoading,
    error: staysResultError,
  } = useQueryClient<VacationPackageTypes.VPStaysSearchQueryResponse>(VPStaysSearchQuery, {
    variables,
    skip: shouldSkip,
    context: {
      headers: noCacheHeaders,
    },
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ vacationPackageStaysSearch }) => {
      const products = vacationPackageStaysSearch.products.map(product => ({
        ...product,
        type: product.type || "budget",
        roomCombinations: constructRoomCombinations(product.roomCombinations, accommodationT) ?? [],
      }));
      dispatch({
        type: ActionType.OnSetStaysResults,
        products: products as VacationPackageTypes.VacationPackageStayProduct[],
        vacationPackageDays,
        isMobile,
      });
    },
    onError: () => {
      dispatch({
        type: ActionType.OnSetStayLoadError,
        staysLoadError: staysResultError,
      });
    },
  });

  const onSortStaysByPrice = useCallback(
    (stayPrices?: VacationPackageTypes.StayPrice[]) =>
      dispatch({
        type: ActionType.OnSortStaysByPrice,
        stayPrices,
      }),
    [dispatch]
  );

  const onSelectStayProduct = useCallback(
    (
      hotels: VacationPackageTypes.VacationPackageStayProduct[],
      selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[],
      selectedStayDay?: number
    ) =>
      dispatch({
        type: ActionType.OnSelectStayProduct,
        hotels,
        selectedHotelsRooms,
        selectedStayDay,
      }),
    [dispatch]
  );

  const onSelectStayProductRooms = useCallback(
    (
      hotels: VacationPackageTypes.VacationPackageStayProduct[],
      selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[],
      selectedStayDay?: number
    ) =>
      dispatch({
        type: ActionType.OnSelectStayProductRooms,
        hotels,
        selectedHotelsRooms,
        selectedStayDay,
      }),
    [dispatch]
  );

  const onRemoveSelectedStays = useCallback(
    () =>
      dispatch({
        type: ActionType.OnRemoveSelectedStays,
      }),
    [dispatch]
  );
  const onOccupanciesChange = useCallback(
    (occupancies: StayBookingWidgetTypes.Occupancy[]) =>
      dispatch({
        type: ActionType.OnOccupanciesChange,
        occupancies,
      }),
    [dispatch]
  );
  const onOccupanciesRoomsChange = useCallback(
    (occupancies: StayBookingWidgetTypes.Occupancy[]) =>
      dispatch({
        type: ActionType.OnOccupanciesRoomsChange,
        occupancies,
      }),
    [dispatch]
  );
  const onSetStayLoadError = useCallback(
    (staysLoadError?: Error) =>
      dispatch({
        type: ActionType.OnSetStayLoadError,
        staysLoadError,
      }),
    [dispatch]
  );
  const isStaySearchLoading =
    ipCountryCodeMissing ||
    staysResultLoading ||
    (Boolean(data?.vacationPackageStaysSearch?.products?.length) && state.hotels.length === 0);

  return (
    <StateProvider
      value={{
        ...state,
        staysResultLoading: isStaySearchLoading,
        staysResultError,
      }}
    >
      <CallbackProvider
        value={{
          onSortStaysByPrice,
          onSelectStayProduct,
          onRemoveSelectedStays,
          onOccupanciesChange,
          onOccupanciesRoomsChange,
          onSelectStayProductRooms,
          onSetStayLoadError,
        }}
      >
        {children}
      </CallbackProvider>
    </StateProvider>
  );
};
