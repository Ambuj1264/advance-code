import { createContext } from "react";

export type CallbackContext = {
  onContactDetailsChange: (contactDetails: FlightTypes.ContactDetails) => void;
  onPassengerDetailsChange: (
    passengerId: number,
    passengerDetails: Partial<FlightTypes.PassengerDetails>
  ) => void;
  onPassengerBagsChange: (passengerId: number, bags: FlightTypes.BagTypes) => void;
  onPassengerCategoryChange: (passengerId: number, category: FlightTypes.PassengerCategory) => void;
  onPassengerRemove: (id: number) => void;
  onPassengerAdd: () => void;
  onNumberOfPassengersChange: (
    passengerType: FlightSearchTypes.PassengerType,
    value: number
  ) => void;
  onFormSubmit: () => void;
  onValidateContactDetails: (isInvalid: boolean) => void;
  onValidatePassenger: (id: number, isInvalid: boolean) => void;
  onHealthDeclarationChecked: () => void;
  onPassengerReplace: (passengers: FlightTypes.PassengerDetails[]) => void;
};

const context = createContext<CallbackContext>({
  onContactDetailsChange: () => {},
  onPassengerDetailsChange: () => {},
  onPassengerBagsChange: () => {},
  onPassengerCategoryChange: () => {},
  onPassengerRemove: () => {},
  onPassengerAdd: () => {},
  onNumberOfPassengersChange: () => {},
  onFormSubmit: () => {},
  onValidateContactDetails: () => {},
  onValidatePassenger: () => {},
  onHealthDeclarationChecked: () => {},
  onPassengerReplace: () => {},
});

export default context;

export const { Provider } = context;
