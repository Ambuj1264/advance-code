declare namespace FlightTypes {
  import { FlightExtraIconType } from "../../FlightSearchPage/types/flightEnums";

  type GenderType = "Male" | "Female";

  type PassengerCategory = "adult" | "child" | "infant";

  type NrOfPassengers = {
    [passengerType in FlightSearchTypes.PassengerType]: number;
  };

  type PassengerDetails = {
    id: number;
    name: string;
    surname: string;
    nationality?: string;
    gender?: GenderType;
    birthday: SharedTypes.Birthdate;
    passportno: string;
    passportExpiration: SharedTypes.Birthdate;
    noPassportExpiration: boolean;
    category: PassengerCategory;
    bags?: BagTypes;
  };

  type ContactDetails = {
    phoneNumber: string;
    contactEmail: string;
  };

  type FlightExtraInputType = "checked" | "radio";

  type FlightExtra = {
    iconId: FlightExtraIconType;
    title: string;
    description?: string;
  };

  type BaggageRestrictions = {
    weight: number;
    height: number;
    width: number;
    length: number;
  };

  type QueryBag = {
    category: string;
    count: number;
    restrictions: BaggageRestrictions;
  };

  type QueryBaggage = {
    id: string;
    price: number;
    priority?: string[];
    passengerGroups: string[];
    bags: QueryBag[];
  };

  type Bag = {
    title: string;
    count: number;
    category: string;
    highlights: FlightExtra[];
  };

  type Baggage = {
    id: string;
    isIncluded: boolean;
    isSelected: boolean;
    inputType: FlightTypes.FlightExtraInputType;
    price: number;
    bagCombination: Bag[];
    priorityAirlines?: string[];
  };

  type BagTypes = {
    handBags: Baggage[];
    holdBags: Baggage[];
  };

  type PassengersBaggage = {
    [key in PassengerCategory]: BagTypes;
  };

  type QueryFlightContentData = {
    availableBaggages: QueryBaggage[];
    nightsInDestination: number;
    bookingToken: string;
    inboundDurationSec: number;
    outboundDurationSec: number;
    totalDurationSec: number;
    documentOptions: {
      documentNeed: number;
    };
    inboundRoute?: FlightSearchTypes.QueryRoute[];
    outboundRoute: FlightSearchTypes.QueryRoute[];
  };

  type QueryFlightData = {
    flightsChecked: boolean;
    flightsInvalid: boolean;
    bookingToken: string;
    flightPrice: number;
    totalBagPrice: number;
    priceChange: boolean;
    showHealthDeclaration: boolean;
    sessionId: string;
  };

  type FlightItinerary = {
    id: string;
    inboundRoute?: FlightSearchTypes.Route;
    outboundRoute: FlightSearchTypes.Route;
  };

  type AddFlightToCartPassenger = {
    baggage: string[];
    birthday?: string;
    category: PassengerCategory;
    email?: string;
    expiration: string | null;
    name: string;
    surname: string;
    nationality?: string;
    passportNumber: string | null;
    phone?: string;
    title: string;
  };

  type MutationAddFlightToCartInput = {
    adults: number;
    children: number;
    infants: number;
    cartItemId?: string;
    bookingToken: string;
    isHold: boolean;
    numberOfBags: number;
    numberOfPassengers: number;
    passengers: AddFlightToCartPassenger[];
    flightSessionId?: string;
    healthDeclarationChecked?: boolean;
    currency: string;
  };

  type MutationAddFlightToCartData = {
    addFlightToCart: {
      available: boolean;
      success: boolean;
      price: number;
      priceChanged: boolean;
    };
  };

  type PassengerFormError = {
    id: number;
    isInvalid: boolean;
  };

  type FormErrors = {
    contactFormError: boolean;
    moreInfantsError: boolean;
    passengerFormErrors: PassengerFormError[];
  };

  type PassengerFormErrors = {
    nameError: boolean;
    surnameError: boolean;
    nationalityError: boolean;
    birthdayError: boolean;
    passportError: boolean;
    passportExpError: boolean;
    passportExpInvalidError: boolean;
    noPassportExpError: boolean;
    birthdayPrimaryError: boolean;
    birthdayCategoryError: boolean;
    genderError: boolean;
  };

  type QueryPassengerBaggage = {
    baggage: string[];
  };

  type SearchUrl = {
    searchUrl: string;
    adults: number;
    children: number;
    infants: number;
    dateFrom: Date;
    returnDateFrom?: Date;
    flightType: string;
    origin: string;
    originId: string;
    destination: string;
    destinationId: string;
    cabinType: string;
    cartItemId?: string;
  };
}
