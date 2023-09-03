import type {
  queryFrequentTravelers,
  UserContextObject,
  userProfileQuery,
} from "../types/userTypes";

import {
  constructDateObject,
  constructTravelPreferences,
  constructUserBudget,
  getInitialTravelInterests,
  getInitialTravelStyles,
} from "./userUtils";

import { getUUID } from "utils/helperUtils";

const constructFrequentTravelers = (travelers: queryFrequentTravelers[]) => {
  return travelers.map(traveler => ({
    id: String(getUUID()),
    email: traveler.email ?? "",
    picture: traveler.picture ?? "",
    imageHandle: traveler.imageHandle ?? "",
    birthdate: constructDateObject(traveler.birthDate),
    firstName: traveler.firstName ?? "",
    lastName: traveler.lastName ?? "",
    nationality: traveler.nationality ?? "",
    gender: traveler.gender ?? "",
    passportno: traveler.passport?.number ?? "",
    passportExpiration: constructDateObject(traveler.passport?.expirationDate),
    noPassportExpiration: traveler.passport?.noExpiration ?? false,
    phone: traveler.phone ?? "",
    relation: traveler.relation ?? "",
  }));
};
export const constructUserQueryContent = (userData: userProfileQuery): UserContextObject => {
  const {
    firstName,
    lastName,
    email,
    phone,
    picture,
    imageHandle,
    birthDate,
    nationality,
    gender,
    passport,
    frequentTravelers,
    preferences,
  } = userData;

  const travelStyle = constructTravelPreferences(preferences?.travelStyles || []);
  const travelInterests = constructTravelPreferences(preferences?.interests || []);

  return {
    mainUser: {
      id: email || "",
      email: email || "",
      picture: picture || "",
      imageHandle: imageHandle || "",
      birthdate: constructDateObject(birthDate),
      firstName: firstName || "",
      lastName: lastName || "",
      nationality,
      gender,
      passportno: passport?.number ?? "",
      passportExpiration: constructDateObject(passport?.expirationDate),
      noPassportExpiration: passport?.noExpiration ?? false,
      phone,
    },
    frequentTravelers: constructFrequentTravelers(frequentTravelers || []),
    travelStyle: getInitialTravelStyles(travelStyle),
    travelInterests: getInitialTravelInterests(travelInterests),
    travelBudget: constructUserBudget(preferences?.budget),
  };
};
