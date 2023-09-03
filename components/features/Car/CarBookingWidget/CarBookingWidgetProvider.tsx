import React, { ReactNode, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";
import { differenceInHours } from "date-fns";
import useReducerWithSideEffects, {
  Update,
  SideEffect,
  UpdateWithSideEffect,
} from "use-reducer-with-side-effects";

import { BookingWidgetView } from "../types/CarEnums";
import CalculatePriceQuery from "../queries/CalculateCarPriceQuery.graphql";

import {
  constructCalculateInput,
  constructFormError,
  constructPriceBreakdownItems,
} from "./utils/carBookingWidgetUtils";
import { Provider as StateProvider } from "./contexts/CarBookingWidgetStateContext";
import { Provider as ConstantProvider } from "./contexts/CarBookingWidgetConstantContext";
import { Provider as CallbackProvider } from "./contexts/CarBookingWidgetCallbackContext";
import {
  constructInitialSelectedExtras,
  constructInitialSelectedInsurances,
  constructOptions,
  getSelectedExtrasWithEmptyAnswers,
} from "./Options/utils/optionsUtils";

import { useSettings } from "contexts/SettingsContext";
import useToggle from "hooks/useToggle";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { CarProvider, BookingWidgetFormError } from "types/enums";

type State = {
  price: number;
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[];
  selectedInsurances: CarBookingWidgetTypes.SelectedInsurance[];
  bookingWidgetView: BookingWidgetView;
  pickupSpecify: string;
  dropoffSpecify: string;
  formErrors: BookingWidgetFormError[];
};

enum ActionType {
  SetSelectedExtra,
  SetSelectedInsurance,
  SetBookingWidgetView,
  SetSpecifiedPickup,
  SetSpecifiedDropoff,
  SetSelectedExtraQuestionAnswers,
  ValidateForm,
  InitializeExtrasAndInsurances,
  ResetExtrasAndInsurances,
}

type Action =
  | {
      type: ActionType.ResetExtrasAndInsurances;
    }
  | {
      type: ActionType.InitializeExtrasAndInsurances;
      extras: OptionsTypes.Option[];
      insurances: OptionsTypes.Option[];
      isHotelPickup: boolean;
      isHotelDropoff: boolean;
      isCarnect: boolean;
    }
  | {
      type: ActionType.ValidateForm;
      isHotelPickup?: boolean;
      isHotelDropoff?: boolean;
      isCarnect?: boolean;
    }
  | {
      type: ActionType.SetSelectedExtra;
      selectedExtra: CarBookingWidgetTypes.SelectedExtra;
      isHotelPickup: boolean;
      isHotelDropoff: boolean;
      isCarnect: boolean;
    }
  | {
      type: ActionType.SetSelectedInsurance;
      selectedInsurance: CarBookingWidgetTypes.OnSelectedInsuranceInput;
    }
  | {
      type: ActionType.SetBookingWidgetView;
      bookingWidgetView: BookingWidgetView;
    }
  | {
      type: ActionType.SetSpecifiedPickup;
      pickupSpecify: string;
      isHotelPickup: boolean;
      isHotelDropoff: boolean;
      isCarnect: boolean;
    }
  | {
      type: ActionType.SetSpecifiedDropoff;
      dropoffSpecify: string;
      isHotelPickup: boolean;
      isHotelDropoff: boolean;
      isCarnect: boolean;
    }
  | {
      type: ActionType.SetSelectedExtraQuestionAnswers;
      selectedExtraId: string;
      answer: CarBookingWidgetTypes.SelectedExtraQuestionAnswer;
    };

const reducer: React.Reducer<State, Action> = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ResetExtrasAndInsurances: {
      return Update({
        ...state,
        selectedExtras: [],
        selectedInsurances: [],
        formErrors: [],
      });
    }
    case ActionType.InitializeExtrasAndInsurances: {
      const { extras, insurances, isHotelPickup, isHotelDropoff, isCarnect } = action;
      const selectedExtras = constructInitialSelectedExtras(extras);
      const selectedInsurances = constructInitialSelectedInsurances(insurances);
      return UpdateWithSideEffect(
        {
          ...state,
          selectedExtras,
          selectedInsurances,
        },
        (_state, dispatch) =>
          dispatch({
            type: ActionType.ValidateForm,
            isHotelPickup,
            isHotelDropoff,
            isCarnect,
          })
      );
    }
    case ActionType.ValidateForm: {
      const { isHotelPickup, isHotelDropoff, isCarnect } = action;
      const { selectedExtras, pickupSpecify, dropoffSpecify } = state;
      return Update({
        ...state,
        formErrors: constructFormError({
          selectedExtras,
          pickupSpecify,
          dropoffSpecify,
          isHotelPickup,
          isHotelDropoff,
          isCarnect,
        }),
      });
    }
    case ActionType.SetSelectedExtra: {
      const { selectedExtra, isHotelPickup, isHotelDropoff, isCarnect } = action;
      const selectedExtras = state.selectedExtras.map(selectedExtraOld => {
        return selectedExtraOld.id === selectedExtra.id ? selectedExtra : selectedExtraOld;
      });
      return UpdateWithSideEffect(
        {
          ...state,
          selectedExtras,
        },
        (_state, dispatch) =>
          dispatch({
            type: ActionType.ValidateForm,
            isHotelPickup,
            isHotelDropoff,
            isCarnect,
          })
      );
    }
    case ActionType.SetSelectedInsurance: {
      const { selectedInsurance } = action;
      const selectedInsurances = state.selectedInsurances.map(selectedInsuranceOld => {
        return selectedInsuranceOld.id === selectedInsurance.id
          ? {
              id: selectedInsurance.id,
              selected: selectedInsurance.selected,
              code: selectedInsuranceOld.code,
            }
          : selectedInsuranceOld;
      });
      return Update({
        ...state,
        selectedInsurances,
      });
    }
    case ActionType.SetBookingWidgetView: {
      const { bookingWidgetView } = action;
      return Update({
        ...state,
        bookingWidgetView,
      });
    }
    case ActionType.SetSpecifiedPickup: {
      const { pickupSpecify, isHotelPickup, isHotelDropoff, isCarnect } = action;
      return UpdateWithSideEffect(
        {
          ...state,
          pickupSpecify,
        },
        (_state, dispatch) =>
          dispatch({
            type: ActionType.ValidateForm,
            isHotelPickup,
            isHotelDropoff,
            isCarnect,
          })
      );
    }
    case ActionType.SetSpecifiedDropoff: {
      const { dropoffSpecify, isHotelPickup, isHotelDropoff, isCarnect } = action;
      return UpdateWithSideEffect(
        {
          ...state,
          dropoffSpecify,
        },
        (_state, dispatch) =>
          dispatch({
            type: ActionType.ValidateForm,
            isHotelPickup,
            isHotelDropoff,
            isCarnect,
          })
      );
    }
    case ActionType.SetSelectedExtraQuestionAnswers: {
      const { selectedExtraId, answer } = action;
      const selectedExtra = state.selectedExtras.find(extra => extra.id === selectedExtraId);
      const answers =
        selectedExtra && selectedExtra.count > 0
          ? selectedExtra.questionAnswers.map(selectedAnswer => {
              if (
                selectedAnswer.key === answer.key &&
                selectedAnswer.identifier === answer.identifier
              ) {
                return {
                  ...selectedAnswer,
                  answer: answer.answer,
                };
              }
              return selectedAnswer;
            })
          : [];
      const newSelectedExtra = {
        ...selectedExtra,
        questionAnswers: answers,
      };
      return SideEffect((_state, dispatch) =>
        dispatch({
          type: ActionType.SetSelectedExtra,
          selectedExtra: newSelectedExtra,
        })
      );
    }
    default:
      return state;
  }
};

const CarBookingWidgetProvider = ({
  children,
  isModalOpen,
  toggleModal,
  cartLink,
  id,
  from,
  to,
  pickupId,
  dropoffId,
  searchPageUrl,
  carOffer,
  discount,
  editItem,
  provider,
  queryPickupId,
  queryDropoffId,
  driverAge,
  driverCountryCode,
  title,
  queryPickupLocationName,
  queryDropoffLocationName,
  skipCalculatePrice = false,
  editCarOfferCartId,
}: {
  children: ReactNode;
  isModalOpen: boolean;
  toggleModal: () => void;
  cartLink: string;
  id: string;
  from: Date;
  to: Date;
  pickupId: number;
  dropoffId: number;
  searchPageUrl: string;
  carOffer?: CarTypes.CarOffer;
  discount?: number;
  editItem?: number;
  provider: CarProvider;
  queryPickupId: string;
  queryDropoffId: string;
  queryPickupLocationName: string;
  queryDropoffLocationName: string;
  driverCountryCode?: string;
  driverAge?: string;
  title: string;
  skipCalculatePrice?: boolean;
  editCarOfferCartId?: string;
}) => {
  const { marketplaceBaseCurrency } = useSettings();
  const [isFormLoading, toggleIsFormLoading] = useToggle(false);

  const [isCalendarOpen, toggleIsCalendarOpen] = useToggle(false);

  const { t: carnectT } = useTranslation(Namespaces.carnectNs);
  const { extras, insurances } = useMemo(
    () =>
      carOffer
        ? constructOptions(
            carOffer.extras,
            carOffer.included,
            carnectT,
            provider === CarProvider.CARNECT
          )
        : { extras: [], insurances: [] },
    [carOffer, carnectT, provider]
  );

  const initialState = {
    price: 0,
    selectedExtras: constructInitialSelectedExtras(extras),
    selectedInsurances: constructInitialSelectedInsurances(insurances),
    bookingWidgetView: BookingWidgetView.Default,
    pickupSpecify: "",
    dropoffSpecify: "",
    driverAge,
    driverCountryCode,
    editCarOfferCartId,
    formErrors: [],
  };
  const [state, dispatch] = useReducerWithSideEffects<React.Reducer<State, Action>>(
    reducer,
    initialState
  );

  const extrasWithoutAnswers = getSelectedExtrasWithEmptyAnswers(state.selectedExtras);

  const setSelectedExtra = useCallback(
    (selectedExtra: CarBookingWidgetTypes.SelectedExtra) => {
      if (carOffer)
        dispatch({
          type: ActionType.SetSelectedExtra,
          selectedExtra,
          isHotelPickup: carOffer.isHotelPickup,
          isHotelDropoff: carOffer.isHotelDropoff,
          isCarnect: provider === CarProvider.CARNECT,
        });
    },
    [carOffer, dispatch, provider]
  );

  const resetExtrasAndInsurances = useCallback(
    () =>
      dispatch({
        type: ActionType.ResetExtrasAndInsurances,
      }),
    [dispatch]
  );

  const setSelectedExtraQuestionAnswers = useCallback(
    (selectedExtraId: string, answer: CarBookingWidgetTypes.SelectedExtraQuestionAnswer) =>
      dispatch({
        type: ActionType.SetSelectedExtraQuestionAnswers,
        selectedExtraId,
        answer,
      }),
    [dispatch]
  );

  const setSelectedInsurance = useCallback(
    (selectedInsurance: CarBookingWidgetTypes.OnSelectedInsuranceInput) =>
      dispatch({
        type: ActionType.SetSelectedInsurance,
        selectedInsurance,
      }),
    [dispatch]
  );

  const setBookingWidgetView = useCallback(
    (bookingWidgetView: BookingWidgetView) =>
      dispatch({
        type: ActionType.SetBookingWidgetView,
        bookingWidgetView,
      }),
    [dispatch]
  );
  const setSpecifiedPickup = useCallback(
    pickupSpecify => {
      if (carOffer)
        dispatch({
          type: ActionType.SetSpecifiedPickup,
          pickupSpecify,
          isHotelPickup: carOffer.isHotelPickup,
          isHotelDropoff: carOffer.isHotelDropoff,
          isCarnect: provider === CarProvider.CARNECT,
        });
    },
    [carOffer, dispatch, provider]
  );
  const setSpecifiedDropoff = useCallback(
    dropoffSpecify => {
      if (carOffer)
        dispatch({
          type: ActionType.SetSpecifiedDropoff,
          dropoffSpecify,
          isHotelPickup: carOffer.isHotelPickup,
          isHotelDropoff: carOffer.isHotelDropoff,
          isCarnect: provider === CarProvider.CARNECT,
        });
    },
    [carOffer, dispatch, provider]
  );
  const fromIso = from.toISOString();
  const toIso = to.toISOString();
  const { data: priceData, loading: isPriceLoading } = useQuery<{
    carCalculatePrice: {
      basePrice: number;
      totalPrice: number;
      discount: number;
      totalOnArrival: number;
      payOnArrival: CarBookingWidgetTypes.PriceBreakdownItem[];
      priceBreakdown: CarBookingWidgetTypes.PriceBreakdownItem[];
    };
  }>(CalculatePriceQuery, {
    skip: !carOffer || skipCalculatePrice,
    variables: {
      input: {
        ...constructCalculateInput(state.selectedExtras, state.selectedInsurances),
        offerReference: id.toString(),
        provider,
        from: fromIso,
        to: toIso,
        pickupId,
        dropoffId,
        currency: marketplaceBaseCurrency,
      },
    },
  });
  const { t } = useTranslation(Namespaces.carBookingWidgetNs);

  const {
    totalPrice,
    discount: discountPrice,
    basePrice,
    totalOnArrival,
    payOnArrival,
    priceBreakdown,
  } = priceData?.carCalculatePrice ?? {
    totalPrice: 0,
    discount: 0,
    basePrice: 0,
    totalOnArrival: 0,
    payOnArrival: [],
    priceBreakdown: [],
  };
  let fullPrice;
  if (priceData) {
    const hasDiscount = basePrice > totalPrice;
    fullPrice = hasDiscount ? basePrice : totalPrice + discountPrice;
  }

  useEffect(() => {
    if (carOffer && !editItem) {
      dispatch({
        type: ActionType.InitializeExtrasAndInsurances,
        extras,
        insurances,
        isHotelPickup: carOffer.isHotelPickup,
        isHotelDropoff: carOffer.isHotelDropoff,
        isCarnect: provider === CarProvider.CARNECT,
      });
    }
  }, [carOffer, dispatch, driverAge, driverCountryCode, editItem, extras, insurances, provider]);
  return (
    <StateProvider
      value={{
        price: totalPrice,
        fullPrice,
        isModalOpen,
        isFormLoading,
        isPriceLoading,
        isCalendarOpen,
        selectedExtras: state.selectedExtras,
        extras,
        selectedInsurances: state.selectedInsurances,
        insurances,
        bookingWidgetView: state.bookingWidgetView,
        pickupSpecify: state.pickupSpecify,
        dropoffSpecify: state.dropoffSpecify,
        priceOnArrival: totalOnArrival,
        payOnArrival: constructPriceBreakdownItems(payOnArrival, carnectT),
        priceBreakdown: constructPriceBreakdownItems(priceBreakdown, carnectT),
        formErrors: state.formErrors,
        extrasWithoutAnswers,
      }}
    >
      <ConstantProvider
        value={{
          cartLink,
          id,
          from,
          to,
          pickupId,
          dropoffId,
          queryPickupId,
          queryDropoffId,
          searchPageUrl,
          pickupLocation: queryPickupLocationName,
          dropoffLocation: queryDropoffLocationName,
          isAirportPickup: carOffer ? carOffer.isAirportPickup : false,
          isHotelPickup: carOffer ? carOffer.isHotelPickup : false,
          isHotelDropoff: carOffer ? carOffer.isHotelDropoff : false,
          priceSubtext: t("Price for {numberOfDays} day rental", {
            numberOfDays: Math.ceil(differenceInHours(to, from) / 24),
          }),
          discount,
          editItem,
          isCarnect: provider === CarProvider.CARNECT,
          driverAge,
          driverCountryCode,
          title,
          editCarOfferCartId,
          availableLocations: carOffer?.availableLocations ?? ([] as CarTypes.AvailableLocation[]),
        }}
      >
        <CallbackProvider
          value={{
            toggleModal,
            toggleIsFormLoading,
            toggleIsCalendarOpen,
            setSelectedExtra,
            setSelectedInsurance,
            setBookingWidgetView,
            setSpecifiedPickup,
            setSpecifiedDropoff,
            setSelectedExtraQuestionAnswers,
            resetExtrasAndInsurances,
          }}
        >
          {children}
        </CallbackProvider>
      </ConstantProvider>
    </StateProvider>
  );
};

export default CarBookingWidgetProvider;
