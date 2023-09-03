import { range, flatten } from "fp-ts/lib/Array";
import { isEmptyString, isInvalidEmail } from "@travelshift/ui/utils/validationUtils";
import { isValid, differenceInYears, isPast, isToday } from "date-fns";
import memoizeOne from "memoize-one";

import { FlightExtraIconType, BagType } from "../../FlightSearchPage/types/flightEnums";

import { cleanAsPathWithLocale } from "utils/routerUtils";
import {
  constructRoute,
  constructSearchUrl,
  getBagTitle,
} from "components/ui/FlightsShared/flightsSharedUtils";
import { isLocalStorageAvailable } from "utils/localStorageUtils";
import { emptyArray } from "utils/constants";
import { getDateStringFromBirthdayType } from "utils/dateUtils";

const MAX_CHILD_AGE = 16;
const MIN_CHILD_AGE = 2;
export const lsKeyFlightPaxInfo = "travelshift-flightPaxDetails";
export const lsKeyFlightContactInfo = "travelshift-flightContactDetails";

export const NO_CHECKED_BAGGAGE_ID = "NoCheckedBaggage";

export const getGenderOptions = (t: TFunction) => [
  {
    value: "Male",
    nativeLabel: t("Male"),
    label: t("Male"),
  },
  {
    value: "Female",
    nativeLabel: t("Female"),
    label: t("Female"),
  },
];

export const getPassengerCategoryOptions = (
  id: number,
  t: TFunction,
  nrOfAdults: number,
  nrOfInfants: number,
  category: FlightTypes.PassengerCategory
) => {
  const canAddInfant =
    (category === "adult" && nrOfAdults > nrOfInfants + 1) ||
    (category === "child" && nrOfAdults > nrOfInfants);
  const canAddChild = category === "adult" ? nrOfAdults > nrOfInfants : true;
  return [
    {
      id: "adult",
      name: t("Adult (over 16 years)"),
    },
    ...(id > 1
      ? [
          ...(canAddChild
            ? [
                {
                  id: "child",
                  name: t("Child (2 - 16 years)"),
                },
              ]
            : []),
          ...(canAddInfant || category === "infant"
            ? [
                {
                  id: "infant",
                  name: t("Infant (under 2 years)"),
                },
              ]
            : []),
        ]
      : []),
  ];
};

export const createNewPassenger = (
  id: number,
  category: FlightTypes.PassengerCategory,
  bags?: FlightTypes.BagTypes,
  nationality?: string
) => ({
  id,
  category,
  name: "",
  surname: "",
  nationality: nationality !== "EU" ? nationality : undefined,
  gender: undefined,
  birthday: {
    day: undefined,
    month: undefined,
    year: undefined,
  },
  passportno: "",
  passportExpiration: {
    day: undefined,
    month: undefined,
    year: undefined,
  },
  noPassportExpiration: false,
  bags: bags || {
    handBags: [],
    holdBags: [],
  },
});

export const getNumberOfPassengerCategory = (
  passengers: FlightTypes.PassengerDetails[],
  passengerCategory: FlightTypes.PassengerCategory
) => passengers.filter(passenger => passenger.category === passengerCategory).length;

export const constructFlightItinerary = (
  flight: FlightTypes.QueryFlightContentData
): FlightTypes.FlightItinerary => ({
  id: flight.bookingToken,
  inboundRoute: flight.inboundRoute && {
    ...constructRoute(flight.inboundRoute),
    totalDurationSec: flight.inboundDurationSec,
    airlines: flight.inboundRoute.map(route => route.airline),
  },
  outboundRoute: {
    ...constructRoute(flight.outboundRoute, flight.nightsInDestination),
    totalDurationSec: flight.outboundDurationSec,
    airlines: flight.outboundRoute.map(route => route.airline),
  },
});

export const getPassengersCount = (passengers: FlightTypes.PassengerDetails[]) => ({
  adults: getNumberOfPassengerCategory(passengers, "adult"),
  children: getNumberOfPassengerCategory(passengers, "child"),
  infants: getNumberOfPassengerCategory(passengers, "infant"),
});

export const getPassengerCategoryFromType = (passengerType: FlightSearchTypes.PassengerType) => {
  if (passengerType === "infants") return "infant";
  if (passengerType === "children") return "child";
  return "adult";
};

export const updatePassengerIds = (passengers: FlightTypes.PassengerDetails[]) =>
  passengers.map((passenger: FlightTypes.PassengerDetails, index: number) => ({
    ...passenger,
    id: index + 1,
  }));

export const getLastPassengerOfCategory = (
  passengers: FlightTypes.PassengerDetails[],
  category: FlightTypes.PassengerCategory
) => passengers.filter(passenger => passenger.category === category).pop();

export const removePassengerOfCategory = (
  passengers: FlightTypes.PassengerDetails[],
  category: FlightTypes.PassengerCategory
) => {
  const passengerToRemove = getLastPassengerOfCategory(passengers, category);
  return updatePassengerIds(passengers.filter(passenger => passenger.id !== passengerToRemove?.id));
};

export const updatePassengerFormErrorIds = (formErrors: FlightTypes.PassengerFormError[]) =>
  formErrors.map((passengerError: FlightTypes.PassengerFormError, index: number) => ({
    id: index + 1,
    isInvalid: passengerError.isInvalid,
  }));

export const removePassengerFormError = (
  formErrors: FlightTypes.PassengerFormError[],
  passengers: FlightTypes.PassengerDetails[],
  category: FlightTypes.PassengerCategory
) => {
  const passengerIdToRemove = getLastPassengerOfCategory(passengers, category)?.id;
  return updatePassengerFormErrorIds(formErrors.filter(error => error.id !== passengerIdToRemove));
};

export const constructPassengerBaggage = (
  passengerCategory: FlightTypes.PassengerCategory,
  t: TFunction,
  baggages?: FlightTypes.QueryBaggage[]
) => {
  if (baggages && baggages?.length > 0) {
    const [handBags, holdBags] = baggages
      .filter(baggage => baggage.passengerGroups.includes(passengerCategory))
      .reduce(
        ([handBaggage, holdBaggage]: FlightTypes.Baggage[][], baggage) => {
          const isHandbag = baggage.id.toLowerCase().includes("handbag");
          const isFirstHandbag = isHandbag && handBaggage.length === 0 && baggage.price === 0;
          const baggageItem = {
            id: baggage.id,
            isIncluded: baggage.price === 0,
            inputType: "radio" as FlightTypes.FlightExtraInputType,
            isSelected: isFirstHandbag,
            price: baggage.price,
            priorityAirlines: baggage.priority,
            bagCombination: baggage.bags.map(bag => {
              const { width, height, weight, length } = bag.restrictions;
              return {
                title: getBagTitle(bag.category as BagType, bag.count, t),
                count: bag.count,
                category: bag.category,
                highlights: [
                  {
                    iconId: bag.category as FlightExtraIconType,
                    title: `${length} × ${width} × ${height} cm`,
                  },
                  {
                    iconId: FlightExtraIconType.BAG_WEIGHT,
                    title: `${weight} kg`,
                  },
                ],
              };
            }),
          };
          if (isHandbag) {
            return [[...handBaggage, baggageItem], holdBaggage];
          }
          return [handBaggage, [...holdBaggage, baggageItem]];
        },
        [[], []]
      );
    return {
      handBags,
      holdBags:
        holdBags.length > 0
          ? [
              {
                id: NO_CHECKED_BAGGAGE_ID,
                isIncluded: true,
                inputType: "radio" as FlightTypes.FlightExtraInputType,
                isSelected: true,
                price: 0,
                bagCombination: [
                  {
                    title: t("No checked baggage"),
                    category: "hold_bag",
                    count: 0,
                    highlights: [],
                  },
                ],
              },
              ...holdBags,
            ]
          : holdBags,
    };
  }

  return {
    handBags: [],
    holdBags: [],
  };
};

export const constructBaggage = (t: TFunction, baggages?: FlightTypes.QueryBaggage[]) => ({
  adult: constructPassengerBaggage("adult", t, baggages),
  child: constructPassengerBaggage("child", t, baggages),
  infant: constructPassengerBaggage("infant", t, baggages),
});

export const getSearchUrl = ({
  searchUrl,
  adults,
  children,
  infants,
  originId,
  origin,
  destinationId,
  destination,
  departureDate,
  returnDate,
  cabinType,
  cartItemId,
}: {
  searchUrl: string;
  adults: number;
  children: number;
  infants: number;
  originId: string;
  origin: string;
  destinationId: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabinType: string;
  cartItemId?: string;
}) => {
  const flightType = returnDate ? "round" : "oneway";
  const dateFrom = new Date(departureDate);
  const returnDateFrom = returnDate ? new Date(returnDate) : undefined;
  return constructSearchUrl({
    searchUrl,
    adults,
    children,
    infants,
    dateFrom,
    returnDateFrom,
    flightType,
    origin,
    originId,
    destination,
    destinationId,
    cabinType,
    cartItemId,
  });
};

export const isDateInvalid = (date: SharedTypes.Birthdate) =>
  !date.day || !date.month || !date.year;

export const isPrimaryPassengerAdult = (
  passengerId: number,
  birthday: SharedTypes.Birthdate,
  departureDate: string
) => {
  const dateString = getDateStringFromBirthdayType(birthday);
  if (passengerId === 1 && !isDateInvalid(birthday)) {
    const yearsOld = differenceInYears(new Date(departureDate), new Date(dateString));
    if (yearsOld >= MAX_CHILD_AGE) {
      return true;
    }
    return false;
  }
  return true;
};

export const getCategoryFromAge = (birthday: SharedTypes.Birthdate, departureDate: string) => {
  const hasDate = !isDateInvalid(birthday);
  const dateString = getDateStringFromBirthdayType(birthday);
  const isDateValid = isValid(new Date(dateString));
  const yearsOld = differenceInYears(new Date(departureDate), new Date(dateString));
  if (hasDate && isDateValid) {
    if (yearsOld < MIN_CHILD_AGE) {
      return "infant";
    }
    if (yearsOld < MAX_CHILD_AGE) {
      return "child";
    }
    return "adult";
  }
  return undefined;
};

export const checkIsContactDetailsValid = (phoneNumber: string, contactEmail: string) =>
  !isEmptyString(phoneNumber) && !isEmptyString(contactEmail) && !isInvalidEmail(contactEmail);

export const getBirthdayError = (
  birthday: SharedTypes.Birthdate,
  passengerId: number,
  dateOfDeparture: string,
  category: FlightTypes.PassengerCategory,
  t: TFunction
) => {
  const hasDate = !isDateInvalid(birthday);
  const dateString = getDateStringFromBirthdayType(birthday);
  const isDateValid = isValid(new Date(dateString));
  const isPrimaryPassengerError = !isPrimaryPassengerAdult(passengerId, birthday, dateOfDeparture);
  const categoryFromAge = getCategoryFromAge(birthday, dateOfDeparture);
  const wrongAdultAge = category === "adult" && categoryFromAge !== "adult";
  const wrongChildAge = category === "child" && categoryFromAge !== "child";
  const wrongInfantAge = category === "infant" && categoryFromAge !== "infant";
  if (hasDate) {
    if (!isDateValid) {
      return t("Date is invalid");
    }
    if (isPrimaryPassengerError) {
      return t("Primary passenger must be older than 16 years old");
    }
    if (wrongAdultAge) {
      return t("Adults must be older than 16 years old");
    }
    if (wrongChildAge) {
      return t("Children must be between 2 and 16 years old");
    }
    if (wrongInfantAge) {
      return t("Infants must be younger than 2 years old");
    }
    return undefined;
  }
  return undefined;
};

export const hasExpiryError = (
  noPassportExpiration: boolean,
  expiryDate: SharedTypes.Birthdate
) => {
  const hasDate = !isDateInvalid(expiryDate);
  const date = new Date(`${expiryDate.year}-${expiryDate.month}-${expiryDate.day}`);
  const today = isToday(date);
  const past = isPast(date);

  if (noPassportExpiration) {
    return false;
  }
  if (hasDate) {
    if (past && today) return false;
    if (past && !today) return true;
    return false;
  }
  return true;
};

export const hasExpiryInvalid = (
  noPassportExpiration: boolean,
  expiryDate: SharedTypes.Birthdate
) => {
  const hasDate = !isDateInvalid(expiryDate);
  const dateString = getDateStringFromBirthdayType(expiryDate);
  return (
    (!noPassportExpiration && ((hasDate && !isValid(new Date(dateString))) || !hasDate)) || false
  );
};

export const getFormError = (formErrors: FlightTypes.FormErrors, t: TFunction) => {
  const passengerError = formErrors.passengerFormErrors.some(passenger => passenger.isInvalid);
  if (formErrors.moreInfantsError) {
    return t("You can't have more infants than adults in a booking");
  }
  if (formErrors.contactFormError) {
    return t("Please fill in your contact details");
  }
  if (passengerError) {
    return t("Please fill in all passenger details");
  }
  return undefined;
};

export const isBirthdayCategoryError = (
  birthday: SharedTypes.Birthdate,
  dateOfDeparture: string,
  category: FlightTypes.PassengerCategory
) => {
  const categoryByAge = getCategoryFromAge(birthday, dateOfDeparture);
  return category !== categoryByAge;
};

export const validatePassengerDetailsForm = (
  passenger: FlightTypes.PassengerDetails,
  passportRequired: boolean,
  dateOfDeparture: string,
  t: TFunction
): FlightTypes.PassengerFormErrors => {
  const {
    id,
    name,
    surname,
    category,
    nationality,
    birthday,
    passportno,
    noPassportExpiration,
    passportExpiration,
    gender,
  } = passenger;
  return {
    nameError: isEmptyString(name),
    surnameError: isEmptyString(surname),
    nationalityError: isEmptyString(nationality),
    birthdayError: getBirthdayError(birthday, id, dateOfDeparture, category, t) !== undefined,
    birthdayCategoryError: isBirthdayCategoryError(birthday, dateOfDeparture, category),
    birthdayPrimaryError: !isPrimaryPassengerAdult(id, birthday, dateOfDeparture),
    passportError: passportRequired && isEmptyString(passportno),
    noPassportExpError:
      passportRequired && !noPassportExpiration && isDateInvalid(passportExpiration),
    passportExpError: passportRequired && hasExpiryError(noPassportExpiration, passportExpiration),
    passportExpInvalidError:
      passportRequired && hasExpiryInvalid(noPassportExpiration, passportExpiration),
    genderError: gender === undefined,
  };
};

export const getPassportExpirationErrorMessage = (
  passportExpError: boolean,
  passportExpInvalidError: boolean,
  t: TFunction
) => {
  if (passportExpInvalidError) {
    return t("Date is invalid");
  }
  if (passportExpError) {
    return t("Date must be in the future");
  }
  return undefined;
};

export const getBagCount = memoizeOne((passengers: FlightTypes.PassengerDetails[]) =>
  passengers.reduce(
    (acc: number, passenger) =>
      acc +
      (passenger.bags
        ? passenger.bags.holdBags
            .filter(bag => bag.isSelected && !bag.isIncluded)
            .reduce((bagCount, bag) => {
              const bagOptionsCount = bag.bagCombination.reduce((count, b) => count + b.count, 0);
              return bagCount + bagOptionsCount;
            }, 0)
        : 0),
    0
  )
);

export const formatDateInputParam = (date: SharedTypes.Birthdate) =>
  getDateStringFromBirthdayType(date);

export const getPassengerBaggageInputParam = (
  bags?: FlightTypes.BagTypes,
  filterIsIncluded?: boolean
) => {
  const handBags = bags?.handBags
    .filter(bag => (filterIsIncluded ? bag.isSelected && !bag.isIncluded : bag.isSelected))
    .map(bag => bag.id);
  const holdBags = bags?.holdBags
    .filter(bag =>
      filterIsIncluded
        ? bag.isSelected && !bag.isIncluded && bag.id !== NO_CHECKED_BAGGAGE_ID
        : bag.isSelected && bag.id !== NO_CHECKED_BAGGAGE_ID
    )
    .map(bag => bag.id);
  return flatten([
    handBags || (emptyArray as unknown as string[]),
    holdBags || (emptyArray as unknown as string[]),
  ]);
};

export const getPassengerDetailsCartInput = (
  passengers: FlightTypes.PassengerDetails[],
  contactDetails?: FlightTypes.ContactDetails,
  passportRequired?: boolean
) =>
  passengers.map(passenger => {
    const isPrimaryPassenger = passenger.id === 1;
    const {
      bags,
      birthday,
      category,
      passportExpiration,
      noPassportExpiration,
      name,
      surname,
      nationality,
      passportno,
      gender,
    } = passenger;
    return {
      baggage: getPassengerBaggageInputParam(bags),
      birthday:
        birthday?.day && birthday?.month && birthday?.year
          ? formatDateInputParam(birthday)
          : undefined,
      category,
      email: isPrimaryPassenger ? contactDetails?.contactEmail : undefined,
      expiration:
        !passportExpiration?.day || noPassportExpiration || !passportRequired
          ? null
          : formatDateInputParam(passportExpiration),
      name,
      surname,
      nationality: nationality!,
      passportNumber: passportRequired ? passportno : null,
      phone: isPrimaryPassenger ? contactDetails?.phoneNumber : undefined,
      title: gender === "Male" ? "mr" : "ms",
    };
  });

export const constructFlightCartInput = ({
  passengers,
  bookingToken,
  contactDetails,
  passportRequired,
  cartItemId,
  healthDeclarationChecked,
  sessionId,
  currencyCode,
}: {
  passengers: FlightTypes.PassengerDetails[];
  bookingToken: string;
  contactDetails?: FlightTypes.ContactDetails;
  passportRequired?: boolean;
  cartItemId?: string;
  healthDeclarationChecked?: boolean;
  sessionId?: string;
  currencyCode: string;
}): FlightTypes.MutationAddFlightToCartInput => {
  const { adults, children, infants } = getPassengersCount(passengers);
  return {
    adults,
    children,
    infants,
    cartItemId,
    bookingToken,
    isHold: false,
    numberOfBags: getBagCount(passengers),
    numberOfPassengers: adults + children + infants,
    flightSessionId: sessionId,
    passengers: getPassengerDetailsCartInput(passengers, contactDetails, passportRequired),
    healthDeclarationChecked,
    currency: currencyCode,
  };
};

export const getSearchUrlFromProductUrl = (asPath: string) =>
  cleanAsPathWithLocale(asPath).split("/").slice(0, -1).join("/");

export const getInitialFormErrors = (adults: number, children: number, infants: number) => {
  return {
    contactFormError: true,
    moreInfantsError: infants > adults,
    passengerFormErrors: [
      ...range(1, adults).map(i => ({
        id: i,
        isInvalid: true,
      })),
      ...(children
        ? range(1, children).map(i => ({
            id: adults + i,
            isInvalid: true,
          }))
        : []),
      ...(infants
        ? range(1, infants).map(i => ({
            id: adults + children + i,
            isInvalid: true,
          }))
        : []),
    ],
  };
};

export const getIsFormValid = (formErrors: FlightTypes.PassengerFormErrors) =>
  Object.keys(formErrors).every(k => !(formErrors as any)[k]);

export const isPassengerFormInvalid = (
  passengerFormErrors: FlightTypes.PassengerFormError[],
  id: number,
  isInvalid: boolean
) =>
  passengerFormErrors.some(
    (passengerError: FlightTypes.PassengerFormError) =>
      passengerError.id === id && passengerError.isInvalid === isInvalid
  );

export const shouldShowPassengerRemoveButton = (
  id: number,
  category: FlightTypes.PassengerCategory,
  nrOfAdults: number,
  nrOfInfants: number
) => id !== 1 && (category === "adult" ? nrOfAdults > nrOfInfants : true);

export const onChangeBaggageSelection = (
  id: string,
  passengerBags: FlightTypes.BagTypes,
  isHandbag: boolean
) => {
  const newHandBaggage = isHandbag
    ? passengerBags.handBags.map(bag => {
        if (bag.id === id) {
          return {
            ...bag,
            isSelected: !bag.isSelected,
          };
        }
        return {
          ...bag,
          isSelected: false,
        };
      })
    : passengerBags.handBags;
  const newHoldBaggage = !isHandbag
    ? passengerBags.holdBags.map(bag => {
        if (bag.id === id) {
          return {
            ...bag,
            isSelected: !bag.isSelected,
          };
        }
        return {
          ...bag,
          isSelected: false,
        };
      })
    : passengerBags.holdBags;
  return {
    handBags: newHandBaggage,
    holdBags: newHoldBaggage,
  };
};

export const hasNoAvailableBaggage = (bags: FlightTypes.BagTypes) =>
  (!bags.handBags && !bags.holdBags) ||
  (bags.handBags?.length === 0 && bags.holdBags?.length === 0);

export const getQueryBaggage = memoizeOne((passengers: FlightTypes.PassengerDetails[]) =>
  passengers.map(passenger => ({
    baggage: getPassengerBaggageInputParam(passenger.bags),
  }))
);

export const writeFlightDataToLocalStorage = <T>(flightData: T, lsKey: string) => {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(lsKey, JSON.stringify(flightData));
};

export const readFlightPaxDataFromLocalStorage = (
  adults: number,
  children: number,
  infants: number,
  baggage?: FlightTypes.PassengersBaggage
) => {
  if (!isLocalStorageAvailable()) return null;
  try {
    const paxDetails = JSON.parse(
      localStorage.getItem(lsKeyFlightPaxInfo)!
    ) as FlightTypes.PassengerDetails[];
    const {
      adults: lsAdults,
      children: lsChildren,
      infants: lsInfants,
    } = getPassengersCount(paxDetails);
    if (adults !== lsAdults || children !== lsChildren || infants !== lsInfants) return null;
    return paxDetails.map(pax => ({
      ...pax,
      bags: baggage?.[pax.category],
    }));
  } catch {
    return null;
  }
};

export const readFlightDataFromLocalStorage = <T>(lsKey: string) => {
  if (!isLocalStorageAvailable()) return null;
  try {
    return JSON.parse(localStorage.getItem(lsKey)!) as T;
  } catch {
    return null;
  }
};

export const getInitialPassengers = (
  adults: number,
  children: number,
  infants: number,
  baggage?: FlightTypes.PassengersBaggage,
  nationality?: string
) => {
  const adultsPassengers = adults
    ? range(1, adults).map(id => createNewPassenger(id, "adult", baggage?.adult, nationality))
    : emptyArray;
  const childPassengers = children
    ? range(1, children).map(id =>
        createNewPassenger(adults + id, "child", baggage?.child, nationality)
      )
    : emptyArray;
  const infantPassengers = infants
    ? range(1, infants).map(id =>
        createNewPassenger(adults + children + id, "infant", baggage?.infant, nationality)
      )
    : emptyArray;
  return (
    readFlightPaxDataFromLocalStorage(adults, children, infants, baggage) || [
      ...adultsPassengers,
      ...childPassengers,
      ...infantPassengers,
    ]
  );
};

export const getInitialContactDetails = (defaultEmail?: string) => {
  const lsContactDetailsData = <FlightTypes.ContactDetails>(
    readFlightDataFromLocalStorage(lsKeyFlightContactInfo)
  );
  return (
    lsContactDetailsData || {
      phoneNumber: "",
      contactEmail: defaultEmail || "",
    }
  );
};

export const getFlightProviderInitialState = ({
  defaultEmail,
  queryAdults,
  queryChildren,
  queryInfants,
  baggage,
  defaultNationality,
}: {
  dateOfDeparture: string;
  defaultNationality?: string;
  queryAdults: number;
  queryChildren: number;
  queryInfants: number;
  baggage?: FlightTypes.PassengersBaggage;
  defaultEmail?: string;
}) => ({
  contactDetails: getInitialContactDetails(defaultEmail),
  passengers: getInitialPassengers(
    queryAdults,
    queryChildren,
    queryInfants,
    baggage,
    defaultNationality
  ),
  formErrors: getInitialFormErrors(queryAdults, queryChildren, queryInfants),
  formSubmitted: false,
  healthDeclarationChecked: true,
});

export const healthDeclarationList = [
  "I do not have any COVID-19 symptoms, such as a fever with a temperature over 37.5° C (99.5°F), cough, cold, headache, diarrhea, sore throat, runny nose, any respiratory problems, or a decrease or loss of smell or taste.",
  "I have not had contact with a COVID-19 confirmed case or suspected case or a person issued with a Quarantine Order/Stay-Home Notice within the last 14 days.",
  "I confirm that I have not tested positive for COVID-19 within 15 days of my planned travel date.",
  "I have not had close contact with a person affected by COVID-19 fewer than 2 days before their symptoms began and up to 14 days after their symptoms disappeared.",
  "I also undertake to inform the air carrier and Local Health Authority of any possible occurrence of the above-mentioned symptoms arising within 8 days of disembarking from the aircraft.",
  "I understand if I travel with United Airlines, face coverings are required for the duration of your flight, except when I’m eating or drinking.",
  "With Frontier Airlines, I will have my temperature screened by a touchless thermometer before boarding. Anyone with a temperature of 38°C (100.4°F) or higher will not be allowed to fly. I will wash or disinfect my hands before boarding the plane. I have noted the recommendation to carry disinfecting wipes and a hand sanitizer with an alcohol concentration of 70% or more.",
];

export const getPassengerDetailsText = (passengerId: number, t: TFunction) =>
  passengerId === 1
    ? t("Primary passenger details")
    : t("{id}. Passenger details", {
        id: passengerId,
      });
