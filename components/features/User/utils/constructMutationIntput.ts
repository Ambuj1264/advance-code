import type { UserInfo, userMutationInput, userPreferences } from "../types/userTypes";

import {
  constructDateInput,
  constructTravelPreferenceInput,
  frequentTravelersMutationInput,
} from "./userUtils";

const constructTravelBudgetMutationInput = (travelBudget: { min: number; max: number }) => {
  const { min, max } = travelBudget;
  return {
    maximum: max,
    minimum: min,
    currency: "EUR",
  };
};
export const constructMutationIntput = (
  mainTraveler: UserInfo,
  travelCompanions: UserInfo[],
  travelStyle: userPreferences[],
  travelInterests: userPreferences[],
  travelBudget: { min: number; max: number }
): userMutationInput => {
  const {
    firstName,
    lastName,
    email,
    birthdate,
    nationality,
    phone,
    gender,
    passportno,
    passportExpiration,
    noPassportExpiration,
    base64Image,
  } = mainTraveler;
  return {
    mainUser: {
      firstName,
      lastName,
      birthDate: constructDateInput(birthdate),
      nationality,
      email,
      phone,
      gender,
      passport: {
        number: passportno,
        expirationDate: constructDateInput(passportExpiration),
        noExpiration: noPassportExpiration,
      },
      imageAsBase64String: base64Image,
    },
    frequentTravelers: frequentTravelersMutationInput(travelCompanions),
    travelStyleIds: constructTravelPreferenceInput(travelStyle),
    interestIds: constructTravelPreferenceInput(travelInterests),
    budget: constructTravelBudgetMutationInput(travelBudget),
  };
};
