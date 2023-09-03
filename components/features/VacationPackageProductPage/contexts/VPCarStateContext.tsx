import React, { createContext, ReactNode, useCallback, useContext } from "react";
import useReducerWithSideEffects, { Update } from "use-reducer-with-side-effects";
import { ApolloError, NetworkStatus } from "apollo-client";

import { isFallbackCarOffer } from "../VPCarSection/vpCarSectionUtils";
import {
  constructVPCarProducts,
  getCarsWithPrices,
  getCarOffersDataByAirport,
  sortCarsArray,
} from "../utils/vacationPackageUtils";
import VPCarProductsQuery from "../VPCarSection/queries/VPCarProductsQuery.graphql";

import { VP_DEFAULT_CAR_DESTINATION_ID } from "./VPPriceStateContext";
import { VPStateContext } from "./VPStateContext";
import { VPStayStateContext } from "./VPStayStateContext";

import useQueryClient from "hooks/useQueryClient";
import { Product, OrderBy } from "types/enums";
import { getFormattedDate, isoFormat } from "utils/dateUtils";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import {
  constructCarSearch,
  sortCarSearchResults,
} from "components/features/CarSearchPage/utils/carSearchUtils";
import { noCacheHeaders } from "utils/apiUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { driverAgeDefaultValue } from "components/ui/CarSearchWidget/DriverInformation/driverInformationUtils";
import { useSettings } from "contexts/SettingsContext";
import { ProductNotificationType } from "components/features/ProductPageNotification/contexts/NotificationStateContext";
import { useCurrencyWithSSR } from "hooks/useLocaleCurrency";
import { getTravelersFromOccupancies } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import { getNumberOfTravellers } from "utils/helperUtils";
import useActiveLocale from "hooks/useActiveLocale";

export const STATIC_CAR_LOCATION_INFO = {
  carLocationId: 1.1,
  carLocationName: "",
};

export type VPCarState = {
  vacationIncludesCar: boolean;
  selectedCarId?: string;
  selectedCarOffer?: CarTypes.CarOffer;
  driverAge: string;
  driverCountryCode: string;
  hasUserSelectedCar: boolean;
  destinationId: string;
  carPriceDestinationId?: string;
  carsLoadError?: Error;
  carResults: VacationPackageTypes.VPCarSearch[];
  carOffersLoading: boolean;
  carOffersError?: ApolloError;
  carOffersNetworkStatus: NetworkStatus;
  carsRefetching: boolean;
  carNotification?: ProductNotificationType;
  shouldSkipPolling: boolean;
};

enum ActionType {
  OnIncludeCarsToggle,
  OnSetDriverAge,
  OnSetDriverCountryCode,
  OnSetDestinationId,
  OnCarsResultsError,
  OnSetCarResults,
  OnSelectCarOffer,
  OnSelectCarOfferId,
  OnRemoveSelectedCar,
  OnSortCarsByPrice,
}

type Action =
  | {
      type: ActionType.OnIncludeCarsToggle;
      checked: boolean;
    }
  | {
      type: ActionType.OnSetDriverAge;
      driverAge: string;
    }
  | {
      type: ActionType.OnSetDriverCountryCode;
      countryCode: string;
    }
  | {
      type: ActionType.OnSetDestinationId;
      destinationId: string;
    }
  | {
      type: ActionType.OnCarsResultsError;
      carsLoadError?: Error;
      skipDefaultError?: boolean;
    }
  | {
      type: ActionType.OnSetCarResults;
      carResults: VacationPackageTypes.VPCarSearch[];
      carPriceDestinationId: string;
      isMobile: boolean;
    }
  | {
      type: ActionType.OnSelectCarOffer;
      carOffer: CarTypes.CarOffer;
    }
  | {
      type: ActionType.OnSelectCarOfferId;
      productId: string;
    }
  | {
      type: ActionType.OnRemoveSelectedCar;
    }
  | {
      type: ActionType.OnSortCarsByPrice;
      carPrices?: VacationPackageTypes.CarPrice[];
    };

type VPCarCallback = {
  onIncludeCarsToggle: (checked: boolean) => void;
  onSetDriverAge: (driverAge: string) => void;
  onSetDriverCountryCode: (countryCode: string) => void;
  onSetDestinationId: (destinationId: string) => void;
  onSelectCarOffer: (productId: string) => void;
  onCarOffersRefetch: () => void;
  onRemoveSelectedCar: () => void;
  onSortCarsByPrice: (carPrices?: VacationPackageTypes.CarPrice[]) => void;
  onSetCarOffer: (carOffer: CarTypes.CarOffer) => void;
  onCarResultsError: (carsLoadError?: Error, skipDefaultError?: boolean) => void;
};

const defaultState: VPCarState = {
  vacationIncludesCar: true,
  selectedCarId: undefined,
  selectedCarOffer: undefined,
  driverAge: driverAgeDefaultValue,
  driverCountryCode: "IS",
  hasUserSelectedCar: false,
  destinationId: "",
  carPriceDestinationId: undefined,
  carsLoadError: undefined,
  carResults: [],
  carOffersLoading: false,
  carOffersError: undefined,
  carOffersNetworkStatus: NetworkStatus.ready,
  carsRefetching: false,
  carNotification: undefined,
  shouldSkipPolling: false,
};

const defaultCallbacks: VPCarCallback = {
  onIncludeCarsToggle: () => {},
  onSetDriverAge: () => {},
  onSetDriverCountryCode: () => {},
  onSetDestinationId: () => {},
  onSelectCarOffer: () => {},
  onCarOffersRefetch: () => {},
  onRemoveSelectedCar: () => {},
  onSortCarsByPrice: () => {},
  onSetCarOffer: () => {},
  onCarResultsError: () => {},
};

export const VPCarStateContext = createContext<VPCarState>(defaultState);

export const VPCarCallbackContext = createContext<VPCarCallback>(defaultCallbacks);

const { Provider: StateProvider } = VPCarStateContext;
const { Provider: CallbackProvider } = VPCarCallbackContext;

const reducer: React.Reducer<VPCarState, Action> = (
  state: VPCarState,
  action: Action
): VPCarState => {
  switch (action.type) {
    case ActionType.OnIncludeCarsToggle: {
      const { checked } = action;
      return Update({
        ...state,
        vacationIncludesCar: checked,
        ...(!checked
          ? {
              selectedCarId: undefined,
              selectedCarOffer: undefined,
              carResults: [],
              hasUserSelectedCar: false,
            }
          : {}),
      });
    }
    case ActionType.OnSetDriverAge: {
      const { driverAge } = action;
      return Update({
        ...state,
        driverAge,
        selectedCarId: undefined,
        carResults: [],
        selectedCarOffer: undefined,
        hasUserSelectedCar: false,
      });
    }
    case ActionType.OnSetDriverCountryCode: {
      const { countryCode } = action;
      return Update({
        ...state,
        driverCountryCode: countryCode,
        selectedCarId: undefined,
        carResults: [],
        selectedCarOffer: undefined,
        hasUserSelectedCar: false,
      });
    }
    case ActionType.OnSetDestinationId: {
      const { destinationId } = action;
      return Update({
        ...state,
        destinationId,
      });
    }
    case ActionType.OnCarsResultsError: {
      const { carsLoadError, skipDefaultError = false } = action;
      return Update({
        ...state,
        carsLoadError:
          carsLoadError ||
          (skipDefaultError ? undefined : new Error("Unable to fetch VP cars — unknown error.")),
      });
    }
    case ActionType.OnSetCarResults: {
      const { carResults, carPriceDestinationId, isMobile } = action;
      const productId = carResults.find(car => car.selected)?.id;
      const isFallbackOffer = isFallbackCarOffer(productId);
      const sortedCarResults = sortCarsArray(carResults, isMobile);
      return Update({
        ...state,
        carResults: sortedCarResults,
        ...(productId ? { selectedCarId: String(productId) } : {}),
        isFallbackOffer,
        carPriceDestinationId,
      });
    }
    case ActionType.OnSelectCarOfferId: {
      const { productId } = action;
      const isFallbackOffer = isFallbackCarOffer(productId);
      const carResults = state.carResults.map(car => ({
        ...car,
        vpPrice: undefined,
      }));
      return Update({
        ...state,
        selectedCarId: productId,
        isFallbackOffer,
        carResults,
        hasUserSelectedCar: state.selectedCarId !== undefined,
      });
    }
    case ActionType.OnSelectCarOffer: {
      const { carOffer } = action;
      return Update({
        ...state,
        selectedCarOffer: carOffer,
      });
    }
    case ActionType.OnRemoveSelectedCar: {
      return Update({
        ...state,
        selectedCarOffer: undefined,
        selectedCarId: undefined,
        hasUserSelectedCar: false,
        carResults: [],
      });
    }
    case ActionType.OnSortCarsByPrice: {
      const { carPrices } = action;
      const cars = getCarsWithPrices(state.carResults, carPrices);
      return Update({
        ...state,
        carResults: cars,
      });
    }
    default: {
      return state;
    }
  }
};

export const VPCarStateContextProvider = ({
  driverAge = driverAgeDefaultValue,
  driverCountryCode = "IS",
  destinationId = "",
  vacationIncludesCar = false,
  children,
  flightIncluded = true,
}: {
  driverAge?: string;
  driverCountryCode?: string;
  destinationId?: string;
  vacationIncludesCar?: boolean;
  children: ReactNode;
  flightIncluded?: boolean;
}) => {
  const [state, dispatch] = useReducerWithSideEffects<React.Reducer<VPCarState, Action>>(reducer, {
    ...defaultState,
    driverAge,
    driverCountryCode,
    destinationId,
    vacationIncludesCar,
  });
  const isMobile = useIsMobile();
  const { currencyCode, convertCurrency } = useCurrencyWithSSR();
  const { t: commonCarT } = useTranslation(Namespaces.commonCarNs);
  const { t: vpT } = useTranslation(Namespaces.vacationPackageNs);
  const { marketplace } = useSettings();
  const { tripId, requestId, preFetchRequestId, selectedDates, usePrefetch } =
    useContext(VPStateContext);
  const { occupancies } = useContext(VPStayStateContext);
  const allTravelers = getTravelersFromOccupancies(occupancies);
  const numberOfPassengers = getNumberOfTravellers(allTravelers);
  const { carLocationId, carLocationName } = STATIC_CAR_LOCATION_INFO;
  const dateFromISO = getFormattedDate(selectedDates.from!, isoFormat);
  const activeLocale = useActiveLocale();
  const onIncludeCarsToggle = useCallback(
    (checked: boolean) => {
      dispatch({
        type: ActionType.OnIncludeCarsToggle,
        checked,
      });
    },
    [dispatch]
  );
  const onSetDriverAge = useCallback(
    (newDriverAge: string) =>
      dispatch({
        type: ActionType.OnSetDriverAge,
        driverAge: newDriverAge,
      }),
    [dispatch]
  );
  const onSetDriverCountryCode = useCallback(
    (countryCode: string) =>
      dispatch({
        type: ActionType.OnSetDriverCountryCode,
        countryCode,
      }),
    [dispatch]
  );
  const onSetDestinationId = useCallback(
    (newDestinationId: string) =>
      dispatch({
        type: ActionType.OnSetDestinationId,
        destinationId: newDestinationId,
      }),
    [dispatch]
  );
  const {
    data,
    loading,
    error,
    refetch: carOffersRefetch,
    networkStatus: carOffersNetworkStatus,
  } = useQueryClient<VacationPackageTypes.VPCarsSearchQueryResponse>(VPCarProductsQuery, {
    variables: {
      input: {
        vacationPackageId: tripId,
        driverAge: String(state.driverAge),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        sourceCountry: state.driverCountryCode!,
        from: dateFromISO,
        requestId,
        preFetchRequestId,
        flightIncluded,
        usePrefetch,
        numberOfPassengers,
      },
    },
    context: {
      headers: noCacheHeaders,
    },
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    skip: !state.vacationIncludesCar,
    onCompleted: () => {
      const { carOffersDataByAirport, carOffersDefaultData } = getCarOffersDataByAirport(
        state.destinationId,
        data
      );
      const offersDataByAirport = carOffersDataByAirport?.offers;
      const offers = offersDataByAirport || carOffersDefaultData?.offers;
      const carsMissingError = !offers?.length
        ? new Error(`Cannot find cars for a VP.`)
        : undefined;
      if (carsMissingError) {
        dispatch({
          type: ActionType.OnCarsResultsError,
          carsLoadError: carsMissingError,
        });
      } else {
        const carPriceDestinationId = offersDataByAirport
          ? state.destinationId
          : VP_DEFAULT_CAR_DESTINATION_ID;
        const constructedCarSearch = constructCarSearch(
          commonCarT,
          {
            selectedDates,
            pickupId: carLocationId.toString(),
            dropoffId: carLocationId.toString(),
            pickupLocationName: carLocationName,
            dropoffLocationName: carLocationName,
          },
          offers || [],
          marketplace,
          convertCurrency,
          currencyCode,
          activeLocale,
          Number(state.driverAge),
          state.driverCountryCode
        );
        const sortedCarsByPopularity = sortCarSearchResults(
          constructedCarSearch,
          OrderBy.POPULARITY
        );
        const vpCarsByPopularity = constructVPCarProducts(
          sortedCarsByPopularity as CarSearchTypes.CarSearch[],
          offers as CarSearchTypes.QueryCarSearch[],
          []
        ) as VacationPackageTypes.VPCarSearch[];
        dispatch({
          type: ActionType.OnSetCarResults,
          carResults: vpCarsByPopularity,
          carPriceDestinationId,
          isMobile,
        });
      }
    },
    onError: () => {
      dispatch({
        type: ActionType.OnCarsResultsError,
        carsLoadError: error,
      });
    },
  });
  const onSelectCarOffer = useCallback(
    (productId: string) => {
      dispatch({
        type: ActionType.OnSelectCarOfferId,
        productId,
      });
    },
    [dispatch]
  );
  const onSetCarOffer = useCallback(
    (carOffer: CarTypes.CarOffer) =>
      dispatch({
        type: ActionType.OnSelectCarOffer,
        carOffer,
      }),
    [dispatch]
  );

  const onRemoveSelectedCar = useCallback(
    () =>
      dispatch({
        type: ActionType.OnRemoveSelectedCar,
      }),
    [dispatch]
  );

  const onSortCarsByPrice = useCallback(
    (carPrices?: VacationPackageTypes.CarPrice[]) =>
      dispatch({
        type: ActionType.OnSortCarsByPrice,
        carPrices,
      }),
    [dispatch]
  );

  const onCarResultsError = useCallback(
    (carsLoadError?: Error, skipDefaultError?: boolean) =>
      dispatch({
        type: ActionType.OnCarsResultsError,
        carsLoadError,
        skipDefaultError,
      }),
    [dispatch]
  );

  const onCarOffersRefetch = useCallback(() => {
    onRemoveSelectedCar();
    carOffersRefetch();
  }, [onRemoveSelectedCar, carOffersRefetch]);

  const shouldSkipPolling = Boolean(
    loading ||
      error ||
      !state.selectedCarId ||
      !state.carResults ||
      isFallbackCarOffer(state.selectedCarId)
  );
  const carNotification =
    carOffersNetworkStatus === NetworkStatus.ready && state.carsRefetching
      ? {
          ribbonText: vpT(
            "The previously selected car offers have expired and we have replaced them with new offers for you!"
          ),
          productType: Product.CAR,
        }
      : undefined;
  return (
    <StateProvider
      value={{
        ...state,
        carOffersLoading: loading,
        carOffersError: error,
        carsRefetching: carOffersNetworkStatus === NetworkStatus.refetch,
        carNotification,
        shouldSkipPolling,
      }}
    >
      <CallbackProvider
        value={{
          onIncludeCarsToggle,
          onSetDriverAge,
          onSetDriverCountryCode,
          onSetDestinationId,
          onSelectCarOffer,
          onCarOffersRefetch,
          onRemoveSelectedCar,
          onSortCarsByPrice,
          onSetCarOffer,
          onCarResultsError,
        }}
      >
        {children}
      </CallbackProvider>
    </StateProvider>
  );
};
