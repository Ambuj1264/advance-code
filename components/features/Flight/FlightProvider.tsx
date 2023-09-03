import React, { ReactNode, useCallback } from "react";
import useReducerWithSideEffects, { Update } from "use-reducer-with-side-effects";

import useFlightQueryParams from "./utils/useFlightQueryParams";
import { Provider as ConstantProvider } from "./contexts/FlightConstantContext";
import { Provider as StateProvider } from "./contexts/FlightStateContext";
import { Provider as CallbackProvider } from "./contexts/FlightCallbackContext";
import {
  createNewPassenger,
  getNumberOfPassengerCategory,
  getPassengerCategoryFromType,
  removePassengerOfCategory,
  updatePassengerIds,
  getPassengersCount,
  removePassengerFormError,
  updatePassengerFormErrorIds,
  getFlightProviderInitialState,
} from "./utils/flightUtils";

import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";

type State = {
  contactDetails: FlightTypes.ContactDetails;
  passengers: FlightTypes.PassengerDetails[];
  formErrors: FlightTypes.FormErrors;
  formSubmitted: boolean;
  healthDeclarationChecked: boolean;
};

enum ActionType {
  ResetPassengers,
  OnContactDetailsChange,
  OnPassengerDetailsChange,
  OnPassengerBagsChange,
  OnPassengerCategoryChange,
  OnPassengerRemove,
  OnPassengerAdd,
  OnNumberOfPassengersChange,
  ValidateContactDetails,
  ValidatePassenger,
  OnHealthDeclarationChecked,
  onFormSubmit,
  ReplacePassengers,
}

type Action =
  | {
      type: ActionType.ResetPassengers;
      passengers: FlightTypes.PassengerDetails[];
    }
  | {
      type: ActionType.OnContactDetailsChange;
      contactDetails: FlightTypes.ContactDetails;
    }
  | {
      type: ActionType.OnPassengerDetailsChange;
      passengerId: number;
      passengerDetails: Partial<FlightTypes.PassengerDetails>;
    }
  | {
      type: ActionType.OnPassengerCategoryChange;
      passengerId: number;
      category: FlightTypes.PassengerCategory;
      bags?: FlightTypes.PassengersBaggage;
      setQueryParams: any;
    }
  | {
      type: ActionType.OnPassengerBagsChange;
      passengerId: number;
      bags?: FlightTypes.BagTypes;
      setQueryParams: any;
    }
  | {
      type: ActionType.OnPassengerRemove;
      id: number;
      setQueryParams: any;
    }
  | {
      type: ActionType.OnPassengerAdd;
      bags?: FlightTypes.BagTypes;
      setQueryParams: any;
    }
  | {
      type: ActionType.OnNumberOfPassengersChange;
      passengerType: FlightSearchTypes.PassengerType;
      value: number;
      bags?: FlightTypes.PassengersBaggage;
      setQueryParams: any;
    }
  | {
      type: ActionType.ValidateContactDetails;
      isInvalid: boolean;
    }
  | {
      type: ActionType.ValidatePassenger;
      id: number;
      isInvalid: boolean;
    }
  | {
      type: ActionType.onFormSubmit;
    }
  | {
      type: ActionType.OnHealthDeclarationChecked;
    }
  | {
      type: ActionType.ReplacePassengers;
      passengers: FlightTypes.PassengerDetails[];
    };

const reducer: React.Reducer<State, Action> = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ResetPassengers: {
      const { passengers } = action;
      return Update({
        ...state,
        passengers,
      });
    }
    case ActionType.OnContactDetailsChange: {
      const { contactDetails } = action;
      return Update({
        ...state,
        contactDetails,
      });
    }
    case ActionType.OnPassengerDetailsChange: {
      const { passengerId, passengerDetails } = action;
      const passengers = state.passengers.map(passenger => {
        if (passenger.id === passengerId) {
          return {
            ...passenger,
            ...passengerDetails,
          };
        }
        return passenger;
      });
      return Update({
        ...state,
        passengers,
      });
    }

    case ActionType.OnPassengerBagsChange: {
      const { passengerId, bags } = action;
      const passengers = state.passengers.map(passenger => {
        if (passenger.id === passengerId) {
          return {
            ...passenger,
            bags,
          };
        }
        return passenger;
      });
      return Update({
        ...state,
        passengers,
      });
    }
    case ActionType.OnPassengerCategoryChange: {
      const { passengerId, category, bags, setQueryParams } = action;
      const passengers = state.passengers.map(passenger => {
        if (passenger.id === passengerId) {
          if (passenger.category !== category) {
            return {
              ...passenger,
              category,
              bags: bags?.[category],
            };
          }
          return passenger;
        }
        return passenger;
      });
      const passengersCount = getPassengersCount(passengers);
      const { adults, children, infants } = passengersCount;
      setQueryParams(
        {
          adults,
          children,
          infants,
        },
        QueryParamTypes.PUSH_IN
      );
      return Update({
        ...state,
        passengers,
        formErrors: {
          ...state.formErrors,
          moreInfantsError: infants > adults,
        },
      });
    }
    case ActionType.OnPassengerRemove: {
      const { id, setQueryParams } = action;
      const passengers = updatePassengerIds(
        state.passengers.filter(passenger => passenger.id !== id)
      );
      const passengersCount = getPassengersCount(passengers);
      const { adults, children, infants } = passengersCount;
      const { contactFormError, passengerFormErrors } = state.formErrors;
      const newPassengerFormErrors = updatePassengerFormErrorIds(
        passengerFormErrors.filter(passenger => passenger.id !== id)
      );
      setQueryParams(
        {
          adults,
          children,
          infants,
        },
        QueryParamTypes.PUSH_IN
      );
      return Update({
        ...state,
        passengers,
        formErrors: {
          contactFormError,
          moreInfantsError: infants > adults,
          passengerFormErrors: newPassengerFormErrors,
        },
      });
    }
    case ActionType.OnPassengerAdd: {
      const { bags, setQueryParams } = action;
      const passengers = [
        ...state.passengers,
        createNewPassenger(state.passengers.length + 1, "adult", bags),
      ];
      const passengersCount = getPassengersCount(passengers);
      const { contactFormError, passengerFormErrors } = state.formErrors;
      const newPassengerFormErrors = [
        ...passengerFormErrors,
        {
          id: state.passengers.length + 1,
          isInvalid: true,
        },
      ];
      setQueryParams(
        {
          adults: passengersCount.adults,
        },
        QueryParamTypes.PUSH_IN
      );
      return Update({
        ...state,
        passengers,
        formErrors: {
          contactFormError,
          moreInfantsError: passengersCount.infants > passengersCount.adults,
          passengerFormErrors: newPassengerFormErrors,
        },
      });
    }
    case ActionType.OnNumberOfPassengersChange: {
      const { passengerType, value, bags, setQueryParams } = action;
      const category = getPassengerCategoryFromType(passengerType);
      const totalPassengersOfType = getNumberOfPassengerCategory(state.passengers, category);
      const isAdding = totalPassengersOfType < value;
      const passengers = isAdding
        ? [
            ...state.passengers,
            createNewPassenger(state.passengers.length + 1, category, bags?.[category]),
          ]
        : removePassengerOfCategory(state.passengers, category);
      const { contactFormError, passengerFormErrors } = state.formErrors;
      const newPassengerFormErrors = isAdding
        ? [
            ...passengerFormErrors,
            {
              id: state.passengers.length + 1,
              isInvalid: true,
            },
          ]
        : removePassengerFormError(passengerFormErrors, state.passengers, category);
      const passengersCount = getPassengersCount(passengers);
      const { adults, children, infants } = passengersCount;
      setQueryParams(
        {
          adults,
          children,
          infants,
        },
        QueryParamTypes.PUSH_IN
      );
      return Update({
        ...state,
        passengers,
        formSubmitted: false,
        formErrors: {
          contactFormError,
          moreInfantsError: infants > adults,
          passengerFormErrors: newPassengerFormErrors,
        },
      });
    }
    case ActionType.ValidateContactDetails: {
      const { isInvalid } = action;
      return Update({
        ...state,
        formErrors: {
          ...state.formErrors,
          contactFormError: isInvalid,
        },
      });
    }
    case ActionType.ValidatePassenger: {
      const { id, isInvalid } = action;
      const passengerFormErrors = state.formErrors.passengerFormErrors.map(passenger => {
        if (passenger.id === id) {
          return {
            id,
            isInvalid,
          };
        }
        return passenger;
      });
      return Update({
        ...state,
        formErrors: {
          ...state.formErrors,
          passengerFormErrors,
        },
      });
    }
    case ActionType.OnHealthDeclarationChecked: {
      return Update({
        ...state,
        healthDeclarationChecked: !state.healthDeclarationChecked,
      });
    }
    case ActionType.onFormSubmit: {
      return Update({
        ...state,
        formSubmitted: true,
      });
    }
    case ActionType.ReplacePassengers: {
      const { passengers } = action;
      return Update({
        ...state,
        passengers,
      });
    }
    default:
      return state;
  }
};

const FlightProvider = ({
  queryAdults = 1,
  queryChildren = 0,
  queryInfants = 0,
  baggage,
  originId,
  origin,
  destinationId,
  destination,
  searchPageUrl,
  passportRequired = true,
  dateOfDeparture,
  defaultNationality,
  defaultEmail,
  children,
}: {
  queryAdults?: number;
  queryChildren?: number;
  queryInfants?: number;
  baggage?: FlightTypes.PassengersBaggage;
  originId?: string;
  origin?: string;
  destinationId?: string;
  destination?: string;
  searchPageUrl?: string;
  passportRequired: boolean;
  dateOfDeparture: string;
  defaultNationality?: string;
  defaultEmail?: string;
  children: ReactNode;
}) => {
  const [, setQueryParams] = useFlightQueryParams();
  const [state, dispatch] = useReducerWithSideEffects<React.Reducer<State, Action>>(
    reducer,
    getFlightProviderInitialState({
      queryAdults,
      queryChildren,
      queryInfants,
      baggage,
      defaultNationality,
      defaultEmail,
      dateOfDeparture,
    })
  );
  const onContactDetailsChange = useCallback(
    (contactDetails: FlightTypes.ContactDetails) =>
      dispatch({
        type: ActionType.OnContactDetailsChange,
        contactDetails,
      }),
    [dispatch]
  );

  const onPassengerDetailsChange = useCallback(
    (passengerId: number, passengerDetails: Partial<FlightTypes.PassengerDetails>) =>
      dispatch({
        type: ActionType.OnPassengerDetailsChange,
        passengerId,
        passengerDetails,
      }),
    [dispatch]
  );

  const onPassengerBagsChange = useCallback(
    (passengerId: number, bags: FlightTypes.BagTypes) =>
      dispatch({
        type: ActionType.OnPassengerBagsChange,
        passengerId,
        bags,
        setQueryParams,
      }),
    [dispatch, setQueryParams]
  );

  const onPassengerCategoryChange = useCallback(
    (passengerId: number, category: FlightTypes.PassengerCategory) =>
      dispatch({
        type: ActionType.OnPassengerCategoryChange,
        passengerId,
        category,
        bags: baggage,
        setQueryParams,
      }),
    [dispatch, baggage, setQueryParams]
  );

  const onPassengerRemove = useCallback(
    (id: number) =>
      dispatch({
        type: ActionType.OnPassengerRemove,
        id,
        setQueryParams,
      }),
    [dispatch, setQueryParams]
  );

  const onPassengerAdd = useCallback(
    () =>
      dispatch({
        type: ActionType.OnPassengerAdd,
        bags: baggage?.adult,
        setQueryParams,
      }),
    [baggage?.adult, dispatch, setQueryParams]
  );

  const onNumberOfPassengersChange = useCallback(
    (passengerType: FlightSearchTypes.PassengerType, value: number) =>
      dispatch({
        type: ActionType.OnNumberOfPassengersChange,
        passengerType,
        value,
        bags: baggage,
        setQueryParams,
      }),
    [baggage, dispatch, setQueryParams]
  );

  const onValidateContactDetails = useCallback(
    (isInvalid: boolean) =>
      dispatch({
        type: ActionType.ValidateContactDetails,
        isInvalid,
      }),
    [dispatch]
  );

  const onFormSubmit = useCallback(
    () =>
      dispatch({
        type: ActionType.onFormSubmit,
      }),
    [dispatch]
  );
  const onValidatePassenger = useCallback(
    (id: number, isInvalid: boolean) =>
      dispatch({
        type: ActionType.ValidatePassenger,
        id,
        isInvalid,
      }),
    [dispatch]
  );
  const onHealthDeclarationChecked = useCallback(
    () =>
      dispatch({
        type: ActionType.OnHealthDeclarationChecked,
      }),
    [dispatch]
  );
  const onPassengerReplace = useCallback(
    (passengers: FlightTypes.PassengerDetails[]) =>
      dispatch({
        type: ActionType.ReplacePassengers,
        passengers,
      }),
    [dispatch]
  );

  return (
    <ConstantProvider
      value={{
        originId,
        origin,
        destinationId,
        destination,
        searchPageUrl,
        passportRequired,
        dateOfDeparture,
      }}
    >
      <StateProvider
        value={{
          contactDetails: state.contactDetails,
          passengers: state.passengers,
          formSubmitted: state.formSubmitted,
          formErrors: state.formErrors,
          healthDeclarationChecked: state.healthDeclarationChecked,
        }}
      >
        <CallbackProvider
          value={{
            onContactDetailsChange,
            onPassengerDetailsChange,
            onPassengerBagsChange,
            onPassengerCategoryChange,
            onPassengerRemove,
            onPassengerAdd,
            onNumberOfPassengersChange,
            onFormSubmit,
            onValidateContactDetails,
            onValidatePassenger,
            onHealthDeclarationChecked,
            onPassengerReplace,
          }}
        >
          {children}
        </CallbackProvider>
      </StateProvider>
    </ConstantProvider>
  );
};

export default FlightProvider;
