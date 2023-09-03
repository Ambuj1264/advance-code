import { isEmptyString, isInvalidEmail } from "@travelshift/ui/utils/validationUtils";
import type { ApolloError } from "apollo-client";

import { querybudget, queryPreferences, UserInfo, userPreferences } from "../types/userTypes";
import { minMaxPrice } from "../mockUserData";

import nonAuthorizedCode from "./authConstants";

import { getUUID } from "utils/helperUtils";

export const addTravelCompanion = (companionArray: UserInfo[]): UserInfo[] => {
  const newCompanion = {
    id: String(getUUID()),
    picture: "",
    imageHandle: "",
    firstName: "",
    lastName: "",
    email: "",
    nationality: undefined,
    gender: undefined,
    birthdate: { day: undefined, month: undefined, year: undefined },
    passportno: "",
    passportExpiration: { day: undefined, month: undefined, year: undefined },
    noPassportExpiration: false,
    phone: "",
    relation: undefined,
    newlyAdded: true,
  };
  return [...companionArray, newCompanion];
};

export const removeTravelcompanion = (
  companionArray: UserInfo[],
  companionId: string
): UserInfo[] => {
  return companionArray.filter(companion => companion.id !== companionId);
};

export const addMainImageFile = (user: UserInfo, fileToUpload: File): UserInfo => {
  return { ...user, profileImageUpload: fileToUpload };
};

export const addCompanionImageFile = (user: UserInfo, fileToUpload: File): UserInfo => {
  return { ...user, profileImageUpload: fileToUpload };
};

export const getRelationOptions = () => [
  {
    value: "Aunt",
    nativeLabel: "Aunt",
    label: "Aunt",
  },
  {
    value: "Brother",
    nativeLabel: "Brother",
    label: "Brother",
  },
  {
    value: "Child",
    nativeLabel: "Child",
    label: "Child",
  },
  {
    value: "Cousin",
    nativeLabel: "Cousin",
    label: "Cousin",
  },
  {
    value: "Coworker",
    nativeLabel: "Coworker",
    label: "Coworker",
  },
  {
    value: "Daughter",
    nativeLabel: "Daughter",
    label: "Daughter",
  },
  {
    value: "Daughter in law",
    nativeLabel: "Daughter in law",
    label: "Daughter in law",
  },
  {
    value: "Father",
    nativeLabel: "Father",
    label: "Father",
  },
  {
    value: "Friend",
    nativeLabel: "Friend",
    label: "Friend",
  },
  {
    value: "Grandfather",
    nativeLabel: "Grandfather",
    label: "Grandfather",
  },
  {
    value: "Grandmother",
    nativeLabel: "Grandmother",
    label: "Grandmother",
  },
  {
    value: "Husband",
    nativeLabel: "Husband",
    label: "Husband",
  },
  {
    value: "Mother",
    nativeLabel: "Mother",
    label: "Mother",
  },
  {
    value: "Niece",
    nativeLabel: "Niece",
    label: "Niece",
  },
  {
    value: "Partner",
    nativeLabel: "Partner",
    label: "Partner",
  },
  {
    value: "Sister",
    nativeLabel: "Sister",
    label: "Sister",
  },
  {
    value: "Son",
    nativeLabel: "Son",
    label: "Son",
  },
  {
    value: "Son in law",
    nativeLabel: "Son in law",
    label: "Son in law",
  },
  {
    value: "Uncle",
    nativeLabel: "Uncle",
    label: "Uncle",
  },
  {
    value: "Wife",
    nativeLabel: "Wife",
    label: "Wife",
  },
];

export const toggleTravelOption = (id: string, array: userPreferences[]): userPreferences[] => {
  const updatedArray = array.map(styleOption => {
    if (styleOption.id === id) {
      const updatedStyle = {
        ...styleOption,
        checked: !styleOption.checked,
      };
      return updatedStyle;
    }
    return styleOption;
  });

  return updatedArray;
};
// TODO: align with team to decide wether we get these from api or in file.
export const getInitialTravelStyles = (chosenIds: string[]): userPreferences[] => {
  const travelStyles: userPreferences[] = [
    {
      id: "ROAD_TRIPS",
      name: "Road Trips",
      checked: false,
      disabled: false,
    },
    {
      id: "PACKAGE_VACATIONS",
      name: "Package vacations",
      checked: false,
      disabled: false,
    },
    {
      id: "CHEAP_HOLIDAYS",
      name: "Cheap holidays",
      checked: false,
      disabled: false,
    },
    {
      id: "LUXURY_PACKAGES",
      name: "Luxury packages",
      checked: false,
      disabled: false,
    },
    {
      id: "ALL_INCLUSIVE_RESORTS",
      name: "All-inclusive resorts",
      checked: false,
      disabled: false,
    },
    {
      id: "CITY_BREAKS",
      name: "City breaks",
      checked: false,
      disabled: false,
    },
    {
      id: "WEEKEND_BREAKS",
      name: "Weekend breaks",
      checked: false,
      disabled: false,
    },
    {
      id: "BEACH_VACATIONS",
      name: "Beach vacations",
      checked: false,
      disabled: false,
    },
    {
      id: "NATURE_VACATIONS",
      name: "Nature vacations",
      checked: false,
      disabled: false,
    },
    {
      id: "ACTIVITY_PACKAGES",
      name: "Activity packages",
      checked: false,
      disabled: false,
    },
    {
      id: "ROMANTIC_GETAWAYS",
      name: "Romantic getaways",
      checked: false,
      disabled: false,
    },
    {
      id: "FAMILY_HOLIDAYS",
      name: "Family holidays",
      checked: false,
      disabled: false,
    },
    {
      id: "MULTI_COUNTRY_PACKAGES",
      name: "Multi-country packages",
      checked: false,
      disabled: false,
    },
  ];
  const newArray = travelStyles.map(style => ({
    ...style,
    checked: chosenIds.includes(style.id),
  }));

  return newArray;
};

export const constructDateObject = (dateString?: string) => {
  if (!dateString || dateString === "") {
    return {
      day: "",
      month: "",
      year: "",
    };
  }
  const date = new Date(dateString);

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();

  return {
    year,
    month,
    day,
  };
};

export const constructDateInput = (date: SharedTypes.Birthdate) => {
  const { year, month, day } = date;
  if (year && month && day) {
    const dateString = `${date.year}-${date.month}-${date.day}`;

    return dateString;
  }
  return undefined;
};

// TODO: align with team to decide wether we get these from api or in file.
export const getInitialTravelInterests = (chosenIds: string[]): userPreferences[] => {
  const travelInterests = [
    {
      id: "BEACHES",
      name: "Beaches",
      checked: false,
      disabled: false,
    },
    {
      id: "CULTURAL_ATTRACTIONS",
      name: "Cultural attractions",
      checked: false,
      disabled: false,
    },
    {
      id: "KID_FRIENDLY",
      name: "Kid friendly",
      checked: false,
      disabled: false,
    },
    {
      id: "MUSEUMS",
      name: "Museums",
      checked: false,
      disabled: false,
    },
    {
      id: "NATURAL_FEATURES",
      name: "Natural features",
      checked: false,
      disabled: false,
    },
    {
      id: "THINGS_TO_DO",
      name: "Things to do",
      checked: false,
      disabled: false,
    },
  ];
  const newArray = travelInterests.map(interest => ({
    ...interest,
    checked: chosenIds.includes(interest.id),
  }));

  return newArray;
};

export const constructTravelBudgetInput = (minMax: number[]) => {
  const [min, max] = minMax;
  return { min, max };
};

// TODO: take currency into account
export const constructUserBudget = (queryBudget?: querybudget) => {
  const { min, max } = minMaxPrice;
  if (queryBudget && queryBudget.minimum > 0 && queryBudget?.maximum > 0) {
    return {
      min: queryBudget.minimum,
      max: queryBudget.maximum,
    };
  }
  return {
    min,
    max,
  };
};

export const constructTravelPreferences = (preferences: queryPreferences[]) => {
  return preferences.map(preference => preference.id);
};

export const validateUserDetailsForm = (mainUser: UserInfo) => {
  const { firstName, lastName, email } = mainUser;
  return {
    nameError: isEmptyString(firstName),
    surnameError: isEmptyString(lastName),
    emailError: email ? isInvalidEmail(email) : true,
  };
};

export const isFormInvalid = (mainUser: UserInfo, companions: UserInfo[]) => {
  const { nameError, surnameError, emailError } = validateUserDetailsForm(mainUser);

  const isMainInvalid = nameError || surnameError || emailError;

  const companionErrors = companions.some(companion => {
    const {
      nameError: cNameError,
      surnameError: cSurNameError,
      emailError: cEmailError,
    } = validateUserDetailsForm(companion);
    return cNameError || cSurNameError || cEmailError;
  });
  return Boolean(isMainInvalid || companionErrors);
};

export const frequentTravelersMutationInput = (travelCompanions: UserInfo[]) => {
  const frequentTravelers = travelCompanions;
  return frequentTravelers.map(traveler => ({
    email: traveler.email,
    picture: traveler.picture,
    birthDate: constructDateInput(traveler.birthdate),
    firstName: traveler.firstName ?? "",
    lastName: traveler.lastName ?? "",
    nationality: traveler.nationality ?? "",
    gender: traveler.gender ?? "",
    passport: {
      expirationDate: constructDateInput(traveler.passportExpiration),
      number: traveler.passportno ?? "",
      noExpiration: traveler.noPassportExpiration ?? false,
    },
    phone: traveler.phone,
    relation: traveler.relation,
    imageAsBase64String: traveler.base64Image,
  }));
};

export const constructTravelPreferenceInput = (travelPreference: userPreferences[]) => {
  const checkedPreferences = travelPreference.filter(preference => preference.checked);

  return checkedPreferences.map(checked => checked.id);
};

export const isUnAuthorized = (apolloError: ApolloError) => {
  return apolloError.graphQLErrors.some(error => {
    if (error.extensions) {
      return error.extensions.code === nonAuthorizedCode;
    }
    return false;
  });
};

export const getErrorMessage = (formInvalid?: boolean) => {
  if (formInvalid !== undefined && formInvalid) {
    return "Please fill in the required fields";
  }
  return undefined;
};

export const checkForUserChanges = (current: UserInfo, original?: UserInfo) => {
  return Boolean(JSON.stringify(current) !== JSON.stringify(original));
};

export const checkForCompanionChanges = (current: UserInfo[], original?: UserInfo[]) => {
  if (!original) return false;
  if (current.length !== original.length) {
    return true;
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < current.length; i++) {
    if (checkForUserChanges(current[i], original[i])) {
      return true;
    }
  }
  return false;
};

export const checkForPreferenceChanges = (
  current: userPreferences[],
  original?: userPreferences[]
) => {
  if (!original) return false;
  if (current.length !== original.length) return true;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < current.length; i++) {
    if (current[i].checked !== original[i].checked) {
      return true;
    }
  }
  return false;
};

export const checkForbudgetChanges = (
  current: { min: number; max: number },
  original?: { min: number; max: number }
) => {
  if (!original) return false;
  return Boolean(current.min !== original.min || current.max !== original.max);
};
