import React from "react";
import { UpdateWithSideEffect, SideEffect, Update, NoUpdate } from "use-reducer-with-side-effects";
import { fromNullable, Option, none } from "fp-ts/lib/Option";
import { addDays } from "date-fns";

import BookingWidgetView, { OrderBookingWidgetView } from "./types/enums";
import {
  calculateTourTotalPrice,
  calculateGTIVpTotalPrice,
  constructFormErrors,
  getTourDiscountPrice,
  getSelectedPickupTime,
  getSelectedPrivateOptions,
  getSelectedTime,
  updateTravelerExperiences,
  updateSelectedExperiencePrices,
  getPickupLocationName,
  getExtrasFromSelectedPickupTime,
  constructGTIVpExtras,
} from "./utils/tourBookingWidgetUtils";
import {
  constructTravelersByPriceGroups,
  getChildrenAgesFromPriceGroups,
} from "./Travelers/utils/travelersUtils";
import {
  constructExperiences,
  constructGTIVpOptions,
  constructInitialSelectedExperiences,
  filterDisabledTourOptionsFromExtras,
} from "./Experiences/experiencesUtils";

import {
  setNumberOfGuestsByTypeUtil,
  updateChildrenAgesUtil,
} from "components/ui/Filters/utils/filtersUtils";
import { setDatesInLocalStorage } from "utils/localStorageUtils";
import { BookingWidgetFormError, TransportPickup } from "types/enums";

export type BookingWidgetState = {
  selectedDates: SharedTypes.SelectedDates;
  datesInitialized: boolean;
  bookingWidgetView: BookingWidgetView;
  orderBookingWidgetView: OrderBookingWidgetView;
  numberOfTravelers: Readonly<SharedTypes.NumberOfTravelers>;
  childrenAges: number[];
  priceGroups?: TravelersTypes.PriceGroup[];
  selectedPickupTime?: string;
  selectedTransportLocation: PickupLocation;
  price: number;
  basePrice: number;
  availableTimes: TourBookingWidgetTypes.AvailableTimes;
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
  experiences: ExperiencesTypes.Experience[][];
  isPriceLoading: boolean;
  formErrors: BookingWidgetFormError[];
  hasPickup: boolean;
  discount: Option<number>;
  discountValue?: number;
  baseDiscountValue?: number;
  isFullPriceDiscount: boolean;
  fullPrice: number;
  transportPickup: TransportPickup;
  isTransportRequired: boolean;
  orderPrice: number;
  contactInformation: TourOrderTypes.ContactInformation;
  pickupInformation: TourOrderTypes.PickupInformation;
  options: ExperiencesTypes.TourOptions;
  optionsInitialized: boolean;
  extras: TourBookingWidgetTypes.Extra[];
  isPrivate: boolean;
  isLivePricing: boolean;
  isLivePricingBasePriceLoaded: boolean;
  livePricingUuid?: string;
  livePricingNonDefaultUuid?: string;
  availablePrivateOptions: TourBookingWidgetTypes.PrivateOption[];
  selectedPrivateOptions: TourBookingWidgetTypes.PrivateOption[];
};

export enum BookingWidgetActionType {
  SetSelectedDate,
  SetBookingWidgetView,
  SetOrderBookingWidgetView,
  SetDefaultNumberOfTravelers,
  SetNumberOfTravelers,
  SetChildrenAges,
  SetInitialNumberOfTravelers,
  setTravelersPriceGroups,
  SetSelectPickupTime,
  SetSelectedTransportLocation,
  SetAvailableTimes,
  SetTourExtras,
  SetExperiences,
  SetInitialSelectedExperiences,
  SetSelectedExperience,
  SetIsPriceLoading,
  SetHasPickup,
  SetDiscount,
  SetGTIVpBasePrice,
  SetGTIVpPrice,
  SetGTIVpNonDefaultUuid,
  SetTourPrice,
  SetPrice,
  SetTourOptions,
  SetGTIVpData,
  UpdateEmptyAnswerError,
  ValidateForm,
  SetOrderPrice,
  SetContactInformation,
  SetPickupInformation,
  Reset,
  SetPrivateOptions,
  TogglePrivateState,
  SetSelectedPrivateOptions,
  SetEditItem,
}

export type BookingWidgetAction =
  | {
      type: BookingWidgetActionType.SetSelectedDate;
      selectedDates: SharedTypes.SelectedDates;
    }
  | {
      type: BookingWidgetActionType.SetBookingWidgetView;
      bookingWidgetView: BookingWidgetView;
    }
  | {
      type: BookingWidgetActionType.SetOrderBookingWidgetView;
      bookingWidgetView: OrderBookingWidgetView;
    }
  | {
      type: BookingWidgetActionType.SetNumberOfTravelers;
      travelerType: SharedTypes.TravelerType;
      value: number;
    }
  | {
      type: BookingWidgetActionType.SetChildrenAges;
      value: number;
      index: number;
    }
  | {
      type: BookingWidgetActionType.SetInitialNumberOfTravelers;
      numberOfTravelers: SharedTypes.NumberOfTravelers;
    }
  | {
      type: BookingWidgetActionType.setTravelersPriceGroups;
      value: TravelersTypes.PriceGroup[];
    }
  | {
      type: BookingWidgetActionType.SetDefaultNumberOfTravelers;
      numberOfTravelers: SharedTypes.NumberOfTravelers;
    }
  | {
      type: BookingWidgetActionType.SetSelectPickupTime;
      selectedPickupTime: string;
    }
  | {
      type: BookingWidgetActionType.SetSelectedTransportLocation;
      selectedTransportLocation: PickupLocation;
    }
  | {
      type: BookingWidgetActionType.SetAvailableTimes;
      availableTimes: TourBookingWidgetTypes.AvailableTimes;
      isLivePricing: boolean;
    }
  | {
      type: BookingWidgetActionType.SetTourExtras;
    }
  | {
      type: BookingWidgetActionType.SetInitialSelectedExperiences;
      selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
      isLivePricing: boolean;
    }
  | {
      type: BookingWidgetActionType.SetExperiences;
    }
  | {
      type: BookingWidgetActionType.SetSelectedExperience;
      selectedExperience: TourBookingWidgetTypes.SelectedExperience;
      isLivePricing: boolean;
    }
  | {
      type: BookingWidgetActionType.SetIsPriceLoading;
      isPriceLoading: boolean;
    }
  | {
      type: BookingWidgetActionType.UpdateEmptyAnswerError;
      formError?: BookingWidgetFormError;
    }
  | {
      type: BookingWidgetActionType.SetHasPickup;
      hasPickup: boolean;
    }
  | {
      type: BookingWidgetActionType.SetDiscount;
      discount?: number;
      isFullPriceDiscount?: boolean;
    }
  | {
      type: BookingWidgetActionType.SetGTIVpBasePrice;
      basePrice: number;
      baseDiscountValue: number;
      livePricingUuid: string;
    }
  | {
      type: BookingWidgetActionType.SetGTIVpPrice;
    }
  | {
      type: BookingWidgetActionType.SetGTIVpNonDefaultUuid;
      livePricingNonDefaultUuid: string;
    }
  | {
      type: BookingWidgetActionType.SetTourPrice;
    }
  | {
      type: BookingWidgetActionType.SetPrice;
    }
  | {
      type: BookingWidgetActionType.ValidateForm;
    }
  | {
      type: BookingWidgetActionType.SetTourOptions;
      options: ExperiencesTypes.TourOptions;
    }
  | {
      type: BookingWidgetActionType.SetGTIVpData;
      vpPricesOptions: TourBookingWidgetTypes.QueryVpOptions[];
    }
  | {
      type: BookingWidgetActionType.SetOrderPrice;
    }
  | {
      type: BookingWidgetActionType.SetContactInformation;
      contactInformation: TourOrderTypes.ContactInformation;
    }
  | {
      type: BookingWidgetActionType.SetPickupInformation;
      pickupInformation: TourOrderTypes.PickupInformation;
    }
  | {
      type: BookingWidgetActionType.SetPrivateOptions;
      availablePrivateOptions: TourBookingWidgetTypes.PrivateOption[];
    }
  | {
      type: BookingWidgetActionType.SetSelectedPrivateOptions;
    }
  | {
      type: BookingWidgetActionType.TogglePrivateState;
    }
  | {
      type: BookingWidgetActionType.SetEditItem;
      editItem: TourBookingWidgetTypes.EditItem;
      transport: PickupTransport;
      lengthOfTour: number;
      enabledOptions: ExperiencesTypes.TourOptions;
      extras: TourBookingWidgetTypes.Extra[];
    }
  | {
      type: BookingWidgetActionType.Reset;
      initialState: BookingWidgetState;
    };

export const bookingWidgetReducer: React.Reducer<BookingWidgetState, BookingWidgetAction> = (
  state: BookingWidgetState,
  action: BookingWidgetAction
): BookingWidgetState => {
  switch (action.type) {
    case BookingWidgetActionType.SetSelectedDate: {
      const { selectedDates } = action;
      setDatesInLocalStorage({
        from: selectedDates.from,
        to: selectedDates.to,
      });
      return UpdateWithSideEffect(
        {
          ...state,
          selectedDates,
          datesInitialized: true,
          isPriceLoading: true,
        },
        (_state, dispatch) => {
          dispatch({ type: BookingWidgetActionType.ValidateForm });
        }
      );
    }
    case BookingWidgetActionType.SetBookingWidgetView:
      return Update({ ...state, bookingWidgetView: action.bookingWidgetView });
    case BookingWidgetActionType.SetOrderBookingWidgetView:
      return Update({
        ...state,
        orderBookingWidgetView: action.bookingWidgetView,
      });
    case BookingWidgetActionType.SetInitialNumberOfTravelers: {
      const { numberOfTravelers } = action;

      const selectedExperiences = updateTravelerExperiences(
        numberOfTravelers,
        state.selectedExperiences
      );
      return UpdateWithSideEffect(
        {
          ...state,
          numberOfTravelers,
          selectedExperiences,
        },
        (_state, dispatch) => {
          dispatch({ type: BookingWidgetActionType.SetSelectedPrivateOptions });
          dispatch({ type: BookingWidgetActionType.SetPrice });
        }
      );
    }
    case BookingWidgetActionType.SetNumberOfTravelers: {
      const { travelerType, value } = action;
      const updatedTravelers = setNumberOfGuestsByTypeUtil(
        travelerType,
        value,
        state.numberOfTravelers.adults,
        state.childrenAges || []
      );
      const updatedTravellerType = updatedTravelers.type;

      const numberOfTravelers = {
        ...state.numberOfTravelers,
        // TODO: refactor.
        [updatedTravellerType === "childs" ? "children" : updatedTravellerType]: value,
      };
      const selectedExperiences = updateTravelerExperiences(
        numberOfTravelers,
        state.selectedExperiences
      );
      return UpdateWithSideEffect(
        {
          ...state,
          numberOfTravelers,
          childrenAges: updatedTravelers.actualChildrenAges,
          selectedExperiences,
          isPriceLoading: state.isLivePricing ? true : state.isPriceLoading,
        },
        (_state, dispatch) => {
          dispatch({ type: BookingWidgetActionType.SetSelectedPrivateOptions });
          // No need to recalculate price for live pricing since we fetching new data from API.
          if (!state.isLivePricing) {
            dispatch({ type: BookingWidgetActionType.SetPrice });
          }
        }
      );
    }
    case BookingWidgetActionType.SetChildrenAges: {
      const { value, index } = action;
      const updatedChildrenAges = updateChildrenAgesUtil(
        state.childrenAges || [],
        value,
        index,
        state.numberOfTravelers.adults
      );
      return Update({
        ...state,
        childrenAges: updatedChildrenAges,
      });
    }
    case BookingWidgetActionType.setTravelersPriceGroups: {
      const { value: priceGroups } = action;

      if (!priceGroups || priceGroups.length === 0) return NoUpdate();

      const travelersByPriceGroups = constructTravelersByPriceGroups(
        state.numberOfTravelers,
        priceGroups,
        state.childrenAges
      );

      return UpdateWithSideEffect(
        {
          ...state,
          priceGroups,
          // we have to adjust children ages once we built the price groups
          // so that ages of kids considered as "children|teenagers" remain only
          childrenAges: getChildrenAgesFromPriceGroups(travelersByPriceGroups),
        },
        (_state, dispatch) => {
          dispatch({
            type: BookingWidgetActionType.SetInitialNumberOfTravelers,
            numberOfTravelers: _state.isLivePricing
              ? // in live pricing we have only adults + ALL children ( incl. teenagers ) ages
                {
                  adults: travelersByPriceGroups.adults.count,
                  teenagers: 0,
                  children:
                    travelersByPriceGroups.children.count + travelersByPriceGroups.teenagers.count,
                }
              : {
                  adults: travelersByPriceGroups.adults.count,
                  teenagers: travelersByPriceGroups.teenagers.count,
                  children: travelersByPriceGroups.children.count,
                },
          });
        }
      );
    }
    case BookingWidgetActionType.SetDefaultNumberOfTravelers: {
      const { numberOfTravelers } = action;
      const selectedPickupTime = getSelectedPickupTime(
        state.availableTimes.times,
        numberOfTravelers,
        state.selectedPickupTime
      );
      return UpdateWithSideEffect(
        {
          ...state,
          numberOfTravelers: {
            adults: 1,
            teenagers: 0,
            children: 0,
          },
          selectedPickupTime,
          isPriceLoading: state.isLivePricing ? true : state.isPriceLoading,
        },
        (_state, dispatch) => {
          dispatch({ type: BookingWidgetActionType.SetSelectedPrivateOptions });
          dispatch({ type: BookingWidgetActionType.SetPrice });
          dispatch({ type: BookingWidgetActionType.SetOrderPrice });
        }
      );
    }
    case BookingWidgetActionType.SetSelectPickupTime: {
      const { selectedPickupTime } = action;
      return UpdateWithSideEffect(
        {
          ...state,
          selectedPickupTime,
        },
        (_state, dispatch) => dispatch({ type: BookingWidgetActionType.SetPrice })
      );
    }
    case BookingWidgetActionType.SetSelectedTransportLocation: {
      const { selectedTransportLocation } = action;
      return UpdateWithSideEffect(
        {
          ...state,
          selectedTransportLocation,
        },
        (_state, dispatch) => dispatch({ type: BookingWidgetActionType.ValidateForm })
      );
    }
    case BookingWidgetActionType.SetAvailableTimes: {
      const { isLivePricing } = action;
      const availableTimes = {
        ...action.availableTimes,
        times: action.availableTimes.times,
      };
      const selectedPickupTime = getSelectedPickupTime(
        availableTimes.times,
        state.numberOfTravelers,
        state.selectedPickupTime
      );

      const hasSomeAvailablePickups = availableTimes.times.some(time => time.isPickupAvailable);
      return UpdateWithSideEffect(
        {
          ...state,
          availableTimes,
          selectedPickupTime,
          hasPickup: hasSomeAvailablePickups,
        },
        (_state, dispatch) => {
          if (!isLivePricing) {
            dispatch({ type: BookingWidgetActionType.SetTourExtras });
          }
          dispatch({ type: BookingWidgetActionType.SetPrice });
          dispatch({ type: BookingWidgetActionType.SetOrderPrice });
        }
      );
    }
    case BookingWidgetActionType.SetTourExtras: {
      const extras = getExtrasFromSelectedPickupTime(
        state.availableTimes.times,
        state.hasPickup,
        state.selectedPickupTime
      );

      return UpdateWithSideEffect(
        {
          ...state,
          extras,
        },
        (_state, dispatch) => {
          if (_state.options.length) {
            dispatch({
              type: BookingWidgetActionType.SetTourOptions,
              options: _state.options,
            });
          }
          dispatch({ type: BookingWidgetActionType.SetPrice });
          dispatch({ type: BookingWidgetActionType.SetOrderPrice });
        }
      );
    }
    case BookingWidgetActionType.SetInitialSelectedExperiences: {
      const { selectedExperiences, isLivePricing } = action;
      const experiences = constructExperiences(state.options, state.extras, selectedExperiences);

      return UpdateWithSideEffect(
        {
          ...state,
          selectedExperiences,
          experiences,
        },
        (_state, dispatch) => {
          if (!isLivePricing) {
            dispatch({ type: BookingWidgetActionType.SetPrice });
            dispatch({ type: BookingWidgetActionType.SetOrderPrice });
          }
        }
      );
    }
    case BookingWidgetActionType.SetSelectedExperience: {
      const { selectedExperience, isLivePricing } = action;
      const selectedExperiences = state.selectedExperiences.map(selectedExperienceOld => {
        return selectedExperienceOld.experienceId === selectedExperience.experienceId
          ? selectedExperience
          : selectedExperienceOld;
      });
      return UpdateWithSideEffect(
        {
          ...state,
          selectedExperiences,
        },
        (_state, dispatch) => {
          if (isLivePricing) {
            dispatch({ type: BookingWidgetActionType.SetExperiences });
          }
          dispatch({ type: BookingWidgetActionType.SetPrice });
        }
      );
    }
    case BookingWidgetActionType.SetIsPriceLoading: {
      const { isPriceLoading } = action;
      return Update({
        ...state,
        isPriceLoading,
      });
    }
    case BookingWidgetActionType.UpdateEmptyAnswerError: {
      const { formError } = action;
      const newFormErrors = formError
        ? [...state.formErrors, formError]
        : state.formErrors.filter(error => {
            return error !== BookingWidgetFormError.EMPTY_ANSWER;
          });

      return Update({
        ...state,
        formErrors: newFormErrors,
      });
    }
    case BookingWidgetActionType.SetHasPickup: {
      const { hasPickup } = action;
      const selectedTime = getSelectedTime(
        state.availableTimes.times,
        hasPickup,
        state.selectedPickupTime
      );
      return UpdateWithSideEffect(
        {
          ...state,
          hasPickup,
          selectedPickupTime: selectedTime,
        },
        (_state, dispatch) => dispatch({ type: BookingWidgetActionType.SetPrice })
      );
    }
    case BookingWidgetActionType.SetDiscount: {
      const { discount, isFullPriceDiscount = false } = action;
      const optionDiscount = fromNullable(discount);
      return UpdateWithSideEffect(
        {
          ...state,
          discount: discount === 0 ? none : optionDiscount,
          isFullPriceDiscount,
        },
        (_state, dispatch) => dispatch({ type: BookingWidgetActionType.SetPrice })
      );
    }
    case BookingWidgetActionType.SetGTIVpBasePrice: {
      const { basePrice, baseDiscountValue, livePricingUuid } = action;

      return UpdateWithSideEffect(
        {
          ...state,
          basePrice,
          baseDiscountValue,
          price: basePrice,
          fullPrice: basePrice,
          isLivePricingBasePriceLoaded: true,
          livePricingUuid,
        },
        (_state, dispatch) => dispatch({ type: BookingWidgetActionType.ValidateForm })
      );
    }
    case BookingWidgetActionType.SetGTIVpPrice: {
      const { price, discountValue } = calculateGTIVpTotalPrice({
        basePrice: state.basePrice,
        baseDiscountValue: state.baseDiscountValue,
        selectedExperiences: state.selectedExperiences,
        experiences: state.experiences,
      });

      return UpdateWithSideEffect(
        {
          ...state,
          fullPrice: price,
          price,
          discountValue,
          isPriceLoading: false,
        },
        (_state, dispatch) => dispatch({ type: BookingWidgetActionType.ValidateForm })
      );
    }
    case BookingWidgetActionType.SetGTIVpNonDefaultUuid: {
      const { livePricingNonDefaultUuid } = action;

      return Update({
        ...state,
        livePricingNonDefaultUuid,
      });
    }
    case BookingWidgetActionType.SetTourPrice: {
      const [calculatedPrice, calculatedFullPrice] = calculateTourTotalPrice({
        numberOfTravelers: state.numberOfTravelers,
        availableTimes: state.availableTimes.times,
        selectedExperiences: state.selectedExperiences,
        hasPickup: state.hasPickup,
        selectedPickupTime: state.selectedPickupTime,
        discount: state.discount,
        isFullPriceDiscount: state.isFullPriceDiscount,
        isPrivate: state.isPrivate,
        selectedPrivateOptions: state.selectedPrivateOptions,
      });
      const price = calculatedPrice || getTourDiscountPrice(state.fullPrice, state.discount);
      const fullPrice = calculatedFullPrice || state.fullPrice;

      return UpdateWithSideEffect(
        {
          ...state,
          price,
          fullPrice,
          isPriceLoading: false,
        },
        (_state, dispatch) => dispatch({ type: BookingWidgetActionType.ValidateForm })
      );
    }
    case BookingWidgetActionType.SetPrice: {
      return SideEffect((_state, dispatch) => {
        if (!_state.isLivePricing && _state.datesInitialized) {
          // if we have dates set - we should fetch options for this day before price update
          if (_state.selectedDates.from !== undefined && !_state.optionsInitialized) return;

          dispatch({ type: BookingWidgetActionType.SetTourPrice });
          return;
        }

        if (_state.isLivePricingBasePriceLoaded) {
          dispatch({ type: BookingWidgetActionType.SetGTIVpPrice });
        }
      });
    }
    case BookingWidgetActionType.ValidateForm: {
      return Update({
        ...state,
        formErrors: constructFormErrors(
          state.selectedDates,
          state.isTransportRequired,
          state.transportPickup,
          state.selectedTransportLocation.name,
          state.availableTimes.times,
          state.numberOfTravelers,
          state.hasPickup,
          state.selectedPickupTime
        ),
      });
    }
    case BookingWidgetActionType.SetTourOptions: {
      const { options } = action;

      const enabledOptions = filterDisabledTourOptionsFromExtras(options, state.extras);

      return UpdateWithSideEffect(
        {
          ...state,
          options: enabledOptions,
          optionsInitialized: true,
        },
        (_state, dispatch) => dispatch({ type: BookingWidgetActionType.SetExperiences })
      );
    }
    case BookingWidgetActionType.SetGTIVpData: {
      const { vpPricesOptions } = action;

      const extras = constructGTIVpExtras(vpPricesOptions);
      const options = constructGTIVpOptions(vpPricesOptions);

      return UpdateWithSideEffect(
        {
          ...state,
          options,
          extras,
        },
        (_state, dispatch) => dispatch({ type: BookingWidgetActionType.SetExperiences })
      );
    }
    case BookingWidgetActionType.SetExperiences: {
      const selectedExperiences = updateSelectedExperiencePrices(
        state.experiences,
        state.selectedExperiences,
        state.extras
      );
      const experiences = constructExperiences(state.options, state.extras, selectedExperiences);

      return UpdateWithSideEffect(
        {
          ...state,
          experiences,
          selectedExperiences,
        },
        (_state, dispatch) => {
          dispatch({ type: BookingWidgetActionType.SetPrice });
        }
      );
    }
    // TODO: remove this.
    case BookingWidgetActionType.SetOrderPrice: {
      return Update({
        ...state,
        orderPrice: state.price,
      });
    }
    case BookingWidgetActionType.SetContactInformation: {
      const { contactInformation } = action;
      return Update({
        ...state,
        contactInformation,
      });
    }
    case BookingWidgetActionType.SetPickupInformation: {
      const { pickupInformation } = action;
      return Update({
        ...state,
        pickupInformation,
      });
    }
    case BookingWidgetActionType.SetPrivateOptions: {
      const { availablePrivateOptions } = action;
      return Update({ ...state, availablePrivateOptions });
    }
    case BookingWidgetActionType.SetSelectedPrivateOptions: {
      if (state.availablePrivateOptions.length === 0) {
        return state;
      }
      const selectedOptions = getSelectedPrivateOptions(
        state.availablePrivateOptions,
        state.numberOfTravelers
      );
      return Update({
        ...state,
        selectedPrivateOptions: selectedOptions,
      });
    }
    case BookingWidgetActionType.TogglePrivateState: {
      const isPrivate = !state.isPrivate;
      return UpdateWithSideEffect({ ...state, isPrivate }, (_state, dispatch) => {
        dispatch({ type: BookingWidgetActionType.SetPrice });
      });
    }
    case BookingWidgetActionType.SetEditItem: {
      const { editItem, lengthOfTour, transport, enabledOptions, extras } = action;
      const numberOfTravelers = {
        adults: editItem.adults,
        teenagers: editItem.teenagers,
        children: editItem.children,
      };

      const selectedExperiences = constructInitialSelectedExperiences(
        enabledOptions,
        extras,
        numberOfTravelers,
        editItem
      );

      return UpdateWithSideEffect(
        {
          ...state,
          selectedDates: {
            from: editItem.date,
            to: addDays(editItem.date, lengthOfTour - 1),
          },
          selectedTransportLocation: {
            id: editItem.tourDetails.placeId,
            name: getPickupLocationName(transport, editItem.tourDetails.placeId),
          },
          hasPickup: editItem.tourDetails.tourPickup,
          selectedPickupTime: editItem.time,
          numberOfTravelers,
          selectedExperiences,
        },
        (_state, dispatch) => {
          dispatch({ type: BookingWidgetActionType.SetPrice });
        }
      );
    }
    case BookingWidgetActionType.Reset: {
      const { initialState } = action;
      return Update({
        ...initialState,
      });
    }
    default:
      return state;
  }
};
