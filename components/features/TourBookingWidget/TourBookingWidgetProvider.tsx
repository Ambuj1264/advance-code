/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useMemo, useEffect } from "react";
import useReducerWithSideEffects from "use-reducer-with-side-effects";

import BookingWidgetView, { OrderBookingWidgetView } from "./types/enums";
import {
  constructTravelerPrices,
  constructTourTimesAvailability,
  getBookingWidgetInitialState,
  getSelectedPickupTimeMaxTravelers,
  constructGTIVpTimesAvailability,
} from "./utils/tourBookingWidgetUtils";
import { Provider as BookingWidgetCallbackContextProvider } from "./contexts/BookingWidgetCallbackContext";
import { Provider as BookingWidgetConstantContextProvider } from "./contexts/BookingWidgetConstantContext";
import { Provider as BookingWidgetStateContextProvider } from "./contexts/BookingWidgetStateContext";
import useTimeAvailability from "./hooks/useTimeAvailability";
import {
  constructInitialSelectedExperiences,
  checkIsSelectedNonDefaultExperience,
} from "./Experiences/experiencesUtils";
import {
  BookingWidgetState,
  BookingWidgetActionType,
  BookingWidgetAction,
  bookingWidgetReducer,
} from "./BookingWidgetState";
import useTourDiscount from "./hooks/useTourDiscount";
import useTourEditItem from "./hooks/useTourEditItem";
import useTourPrivateOptions from "./hooks/useTourPrivateOptions";
import useTourOptions from "./hooks/useTourOptions";
import useGTIVPrices from "./hooks/useGTIVPrices";
import { getTotalNumberOfGTIVpTravelers } from "./Travelers/utils/travelersUtils";
import useSetInitialTransportLocation from "./Transport/hooks/useSetInitialTransportLocation";

import useTourSearchQueryParams from "components/features/SearchPage/useTourSearchQueryParams";
import { writeDateUrlParamToLocalStorage } from "utils/localStorageUtils";
import { BookingWidgetFormError, TransportPickup } from "types/enums";
import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import { formatMarketplace } from "utils/apiUtils";
import useToggle from "hooks/useToggle";
import { useSettings } from "contexts/SettingsContext";
import useCurrency, { useCurrencyWithDefault } from "hooks/useCurrency";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import useEffectOnce from "hooks/useEffectOnce";

const BookingWidgetContextProvider = ({
  id,
  tourType,
  isLivePricing,
  basePrice,
  lengthOfTour,
  slug,
  isFreePickup,
  transport,
  lowestPriceGroupSize,
  children,
  title,
  currentRequestAuth,
  cartItem,
}: {
  id: number;
  tourType: string;
  isLivePricing: boolean;
  basePrice: number;
  lengthOfTour: number;
  slug: string;
  isFreePickup: boolean;
  transport: PickupTransport;
  lowestPriceGroupSize: number;
  children: React.ReactNode;
  title: string;
  currentRequestAuth?: string;
  cartItem: number;
}) => {
  const [
    {
      dateFrom: queryDateFrom,
      adults: queryAdults = 1,
      teenagers: queryTeenagers = 0,
      children: queryChildren = 0,
      childrenAges: queryChildrenAges = [],
    },
  ] = useTourSearchQueryParams();

  useEffectOnce(() => writeDateUrlParamToLocalStorage(queryDateFrom));

  const { t } = useTranslation(Namespaces.tourBookingWidgetNs);
  const { selectedTransportLocation } = useSetInitialTransportLocation(id, cartItem);
  const { isCurrencyEmpty } = useCurrency();
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();

  const initialState = getBookingWidgetInitialState({
    basePrice,
    transportPickup: transport.pickupType as TransportPickup,
    isTransportRequired: transport.required,
    adults: queryAdults,
    teenagers: queryTeenagers,
    children: queryChildren,
    childrenAges: queryChildrenAges,
    dateFrom: queryDateFrom,
    lengthOfTour,
    isLivePricing,
    selectedTransportLocation,
  });

  const [state, dispatch] = useReducerWithSideEffects<
    React.Reducer<BookingWidgetState, BookingWidgetAction>
  >(bookingWidgetReducer, initialState);

  const dateFrom = state.selectedDates.from;

  // Resets state when there is a mismatch between pickup type in state and value from the tour query
  // This can happen during client side navigation
  useEffect(() => {
    if (state.transportPickup !== transport.pickup) {
      dispatch({
        type: BookingWidgetActionType.Reset,
        initialState,
      });
    }
  }, [dispatch, initialState, state.transportPickup, transport.pickup]);

  const [isFormLoading, toggleIsFormLoading] = useToggle(false);

  const setDiscount = useCallback(
    (discount?: TourBookingWidgetTypes.QueryDiscount) => {
      if (discount?.tour) {
        dispatch({
          type: BookingWidgetActionType.SetDiscount,
          discount: discount?.tour?.discount?.value,
          isFullPriceDiscount: discount?.tour?.discount?.isFullPriceDiscount ?? false,
        });
      }
    },
    [dispatch]
  );

  const { isDiscountLoading } = useTourDiscount({
    slug,
    onCompleted: setDiscount,
    dateFrom,
    isLivePricing,
  });

  const togglePrivateState = useCallback(() => {
    dispatch({
      type: BookingWidgetActionType.TogglePrivateState,
    });
  }, [dispatch]);

  const setPrivateOptions = useCallback(
    (privateOptionsData?: TourBookingWidgetTypes.QueryPrivateOptions) => {
      const { tour } = privateOptionsData || {};
      if (tour && tour.availablePrivateOptions) {
        dispatch({
          type: BookingWidgetActionType.SetPrivateOptions,
          availablePrivateOptions: tour.availablePrivateOptions,
        });
      }
    },
    [dispatch]
  );

  useTourPrivateOptions({
    slug,
    onCompleted: setPrivateOptions,
    isLivePricing,
  });

  const setSelectedDates = useCallback(
    (selectedDates: SharedTypes.SelectedDates) => {
      dispatch({
        type: BookingWidgetActionType.SetSelectedDate,
        selectedDates,
      });
    },
    [dispatch]
  );

  const setBookingWidgetView = useCallback(
    (bookingWidgetView: BookingWidgetView) =>
      dispatch({
        type: BookingWidgetActionType.SetBookingWidgetView,
        bookingWidgetView,
      }),
    [dispatch]
  );

  const setOrderBookingWidgetView = useCallback(
    (bookingWidgetView: OrderBookingWidgetView) =>
      dispatch({
        type: BookingWidgetActionType.SetOrderBookingWidgetView,
        bookingWidgetView,
      }),
    [dispatch]
  );

  const setNumberOfTravelers = useCallback(
    (travelerType: SharedTypes.TravelerType, value: number) => {
      dispatch({
        type: BookingWidgetActionType.SetNumberOfTravelers,
        travelerType,
        value,
      });
    },
    [dispatch]
  );

  const setChildrenAges = useCallback(
    (value: number, index: number) => {
      dispatch({
        type: BookingWidgetActionType.SetChildrenAges,
        value,
        index,
      });
    },
    [dispatch]
  );

  const setTravelersPriceGroups = useCallback(
    (value: TravelersTypes.PriceGroup[]) =>
      dispatch({
        type: BookingWidgetActionType.setTravelersPriceGroups,
        value,
      }),
    [dispatch]
  );

  const setInitialNumberOfTravelers = useCallback(
    (numberOfTravelers: SharedTypes.NumberOfTravelers) =>
      dispatch({
        type: BookingWidgetActionType.SetInitialNumberOfTravelers,
        numberOfTravelers,
      }),
    [dispatch]
  );

  const setDefaultNumberOfTravelers = useCallback(
    (numberOfTravelers: SharedTypes.NumberOfTravelers) =>
      dispatch({
        type: BookingWidgetActionType.SetDefaultNumberOfTravelers,
        numberOfTravelers,
      }),
    [dispatch]
  );

  const setSelectedPickupTime = useCallback(
    (selectedPickupTime: string) =>
      dispatch({
        type: BookingWidgetActionType.SetSelectPickupTime,
        selectedPickupTime,
      }),
    [dispatch]
  );

  const setSelectedTransportLocation = useCallback(
    (selectedTransportLocationInput: PickupLocation) =>
      dispatch({
        type: BookingWidgetActionType.SetSelectedTransportLocation,
        selectedTransportLocation: selectedTransportLocationInput,
      }),
    [dispatch]
  );

  const setInitialSelectedExperiences = useCallback(
    (selectedExperiences: TourBookingWidgetTypes.SelectedExperiences) =>
      dispatch({
        type: BookingWidgetActionType.SetInitialSelectedExperiences,
        selectedExperiences,
        isLivePricing,
      }),
    [dispatch, isLivePricing]
  );

  const setSelectedExperience = useCallback(
    (selectedExperience: TourBookingWidgetTypes.SelectedExperience) => {
      dispatch({
        type: BookingWidgetActionType.SetSelectedExperience,
        selectedExperience,
        isLivePricing,
      });
    },
    [dispatch, isLivePricing]
  );

  const updateEmptyAnswerError = useCallback(
    (formError?: BookingWidgetFormError) =>
      dispatch({
        type: BookingWidgetActionType.UpdateEmptyAnswerError,
        formError,
      }),
    [dispatch]
  );

  const setHasPickup = useCallback(
    (hasPickup: boolean) =>
      dispatch({
        type: BookingWidgetActionType.SetHasPickup,
        hasPickup,
      }),
    [dispatch]
  );

  const setContactInformation = useCallback(
    (contactInformation: TourOrderTypes.ContactInformation) =>
      dispatch({
        type: BookingWidgetActionType.SetContactInformation,
        contactInformation,
      }),
    [dispatch]
  );

  const setPickupInformation = useCallback(
    (pickupInformation: TourOrderTypes.PickupInformation) =>
      dispatch({
        type: BookingWidgetActionType.SetPickupInformation,
        pickupInformation,
      }),
    [dispatch]
  );

  const availableTimes = useMemo(
    () => ({
      ...state.availableTimes,
      times: state.availableTimes.times,
    }),
    [state.availableTimes]
  );

  const setGTIVPPrice = useCallback(
    (GTIVpPricesData?: TourBookingWidgetTypes.QueryVpPrices) => {
      if (GTIVpPricesData?.monolithVacationPackage?.price?.value) {
        const { monolithVacationPackage } = GTIVpPricesData;
        const { value, discount } = GTIVpPricesData.monolithVacationPackage.price;
        dispatch({
          type: BookingWidgetActionType.SetGTIVpBasePrice,
          basePrice: value,
          baseDiscountValue: discount,
          livePricingUuid: monolithVacationPackage.uuid,
        });

        const vpDiscount = monolithVacationPackage.price.discountPercentage;

        if (vpDiscount) {
          dispatch({
            type: BookingWidgetActionType.SetDiscount,
            discount: vpDiscount,
          });
        }
      }
    },
    [dispatch]
  );

  const setGTIVpNonDefaultUuid = useCallback(
    (GTIVpPricesData?: TourBookingWidgetTypes.QueryVpPrices) => {
      if (GTIVpPricesData?.monolithVacationPackage?.uuid) {
        dispatch({
          type: BookingWidgetActionType.SetGTIVpNonDefaultUuid,
          livePricingNonDefaultUuid: GTIVpPricesData.monolithVacationPackage.uuid,
        });
      }
    },
    [dispatch]
  );

  const setVpOptions = useCallback(
    (vpPricesOptions?: TourBookingWidgetTypes.QueryVpOptions[]) => {
      if (vpPricesOptions?.length) {
        dispatch({
          type: BookingWidgetActionType.SetGTIVpData,
          vpPricesOptions,
        });
      }
    },
    [dispatch]
  );

  const { isGTIVpDefaultOptionsLoading, isGTIVpLivePriceLoading, shouldShowFromPrice } =
    useGTIVPrices({
      slug,
      startDate: dateFrom,
      travelers: getTotalNumberOfGTIVpTravelers({
        adults: state.numberOfTravelers.adults,
        childrenAges: state.childrenAges,
      }),
      childrenAges: state.childrenAges,
      isLivePricing,
      skip: !state.datesInitialized,
      onCompleted: setGTIVPPrice,
      onCompletedNonDefaultOptions: setGTIVpNonDefaultUuid,
      setVpOptions,
    });

  const { optionsError, isLoadingOptions } = useTourOptions({
    id,
    dateFrom,
    isLivePricing,
    times: state.availableTimes.times,
    dispatch,
  });

  if (optionsError) throw optionsError;

  const onTourCartQueryCompleted = useCallback(
    (tourCartItem: TourBookingWidgetTypes.EditItem) => {
      dispatch({
        type: BookingWidgetActionType.SetEditItem,
        editItem: tourCartItem,
        lengthOfTour,
        transport,
        extras: state.extras,
        enabledOptions: state.options,
      });
    },
    [dispatch, state.options, state.extras, lengthOfTour, transport]
  );

  const { editItem, isCurrentCartQueryLoading } = useTourEditItem({
    id,
    onTourCartQueryCompleted,
  });

  const isSelectedNonDefaultOption = useMemo(
    () =>
      isLivePricing
        ? checkIsSelectedNonDefaultExperience({
            selectedExperiences: state.selectedExperiences,
            multiSelectionExperiences: state.experiences?.length
              ? (state.experiences[0] as ExperiencesTypes.MultiSelectionExperience[])
              : [],
          })
        : false,
    [isLivePricing, state.experiences, state.selectedExperiences]
  );

  useEffect(() => {
    if (!state.selectedExperiences.length) {
      const selectedExperiences = constructInitialSelectedExperiences(
        state.options,
        state.extras,
        state.numberOfTravelers,
        editItem
      );
      setInitialSelectedExperiences(selectedExperiences);
    }
  }, [
    editItem,
    setInitialSelectedExperiences,
    state.extras,
    state.numberOfTravelers,
    state.options,
    state.selectedExperiences.length,
  ]);

  const travelerPrices = useMemo(
    () =>
      constructTravelerPrices({
        availableTimes: availableTimes.times,
        numberOfTravelers: state.numberOfTravelers,
        selectedPickupTime: state.selectedPickupTime,
        hasPickup: state.hasPickup,
        isLivePricing,
      }),
    [
      availableTimes.times,
      isLivePricing,
      state.hasPickup,
      state.numberOfTravelers,
      state.selectedPickupTime,
    ]
  );

  const maxTravelers = useMemo(
    () =>
      getSelectedPickupTimeMaxTravelers(
        availableTimes.times,
        state.hasPickup,
        state.selectedPickupTime
      ),
    [availableTimes.times, state.hasPickup, state.selectedPickupTime]
  );

  const price = convertCurrency(state.price);
  const date = getFormattedDate(dateFrom || new Date(), yearMonthDayFormat);
  const { marketplace } = useSettings();

  const onCompletedTimeAvailability = useCallback(
    (timeData: ReadonlyArray<TourBookingWidgetTypes.TimeWithPricesData>) => {
      const flexibleString = t("Flexible");
      const availableTimesAvailability = isLivePricing
        ? constructGTIVpTimesAvailability(timeData, flexibleString)
        : constructTourTimesAvailability(timeData, flexibleString);

      dispatch({
        type: BookingWidgetActionType.SetAvailableTimes,
        availableTimes: availableTimesAvailability,
        isLivePricing,
      });
    },
    [dispatch, isLivePricing, t]
  );
  const { isLoadingAvailableTimes, error } = useTimeAvailability({
    id,
    marketplace: formatMarketplace(marketplace),
    date,
    skip: !dateFrom,
    onCompletedTimeAvailability,
  });

  const isLivePricesLoading = isSelectedNonDefaultOption
    ? isGTIVpLivePriceLoading
    : isGTIVpDefaultOptionsLoading;

  const isPriceLoading =
    isCurrencyEmpty || state.isPriceLoading || isLoadingOptions || isCurrentCartQueryLoading;

  const isLivePricingLoading =
    !state.datesInitialized ||
    (!shouldShowFromPrice &&
      (isPriceLoading ||
        isGTIVpDefaultOptionsLoading ||
        (isSelectedNonDefaultOption && isGTIVpLivePriceLoading)));

  const isPriceLoadingNormalized = isLivePricing ? isLivePricingLoading : isPriceLoading;

  if (error) throw error;

  return (
    <BookingWidgetCallbackContextProvider
      value={{
        setSelectedDates,
        setSelectedPickupTime,
        setNumberOfTravelers,
        setChildrenAges,
        setTravelersPriceGroups,
        setDefaultNumberOfTravelers,
        setInitialNumberOfTravelers,
        setSelectedTransportLocation,
        setSelectedExperience,
        setBookingWidgetView,
        setOrderBookingWidgetView,
        updateEmptyAnswerError,
        setHasPickup,
        toggleIsFormLoading,
        setContactInformation,
        setPickupInformation,
        togglePrivateState,
      }}
    >
      <BookingWidgetConstantContextProvider
        value={{
          id,
          tourType,
          lengthOfTour,
          isFreePickup,
          slug,
          transport,
          editItem,
          lowestPriceGroupSize,
          title,
          currentRequestAuth,
        }}
      >
        <BookingWidgetStateContextProvider
          value={{
            price,
            datesInitialized: !isLivePricing || state.datesInitialized,
            fullPrice: convertCurrency(state.fullPrice),
            basePrice: state.basePrice,
            isPriceLoading: isPriceLoadingNormalized,
            isGTIVpDefaultOptionsLoading,
            isGTIVpLivePriceLoading,
            isSelectedNonDefaultOption,
            isDiscountLoading: isDiscountLoading || isPriceLoadingNormalized,
            isFormLoading: isFormLoading || isLivePricesLoading,
            isLoadingOptions,
            currency: currencyCode,
            bookingWidgetView: state.bookingWidgetView,
            orderBookingWidgetView: state.orderBookingWidgetView,
            selectedDates: state.selectedDates,
            selectedPickupTime: state.selectedPickupTime,
            numberOfTravelers: state.numberOfTravelers,
            childrenAges: state.childrenAges,
            priceGroups: state.priceGroups,
            availableTimes,
            selectedExperiences: state.selectedExperiences,
            travelerPrices,
            experiences: state.experiences,
            isLoadingAvailableTimes,
            selectedTransportLocation: state.selectedTransportLocation,
            formErrors: state.formErrors,
            hasPickup: state.hasPickup,
            orderPrice: convertCurrency(state.orderPrice),
            contactInformation: state.contactInformation,
            pickupInformation: state.pickupInformation,
            discount: state.discount,
            discountValue: state.discountValue,
            baseDiscountValue: state.baseDiscountValue,
            isPrivate: state.isPrivate,
            isLivePricing: state.isLivePricing,
            livePricingUuid: state.livePricingUuid,
            livePricingNonDefaultUuid: state.livePricingNonDefaultUuid,
            availablePrivateOptions: state.availablePrivateOptions,
            selectedPrivateOptions: state.selectedPrivateOptions,
            maxTravelers,
          }}
        >
          {children}
        </BookingWidgetStateContextProvider>
      </BookingWidgetConstantContextProvider>
    </BookingWidgetCallbackContextProvider>
  );
};
export default BookingWidgetContextProvider;
