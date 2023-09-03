import { createContext } from "react";

type StateContext = {
  contactDetails: FlightTypes.ContactDetails;
  passengers: FlightTypes.PassengerDetails[];
  formSubmitted: boolean;
  formErrors: FlightTypes.FormErrors;
  healthDeclarationChecked: boolean;
};

const context = createContext<StateContext>({
  contactDetails: {
    contactEmail: "",
    phoneNumber: "",
  },
  passengers: [],
  formSubmitted: false,
  healthDeclarationChecked: true,
  formErrors: {
    contactFormError: true,
    moreInfantsError: false,
    passengerFormErrors: [
      {
        id: 1,
        isInvalid: true,
      },
    ],
  },
});

export default context;

export const { Provider } = context;
