import { UserContextObject, UserInfo, userPreferences } from "../types/userTypes";

import contextFactory from "contexts/contextFactory";

export interface UserProfileStateContext {
  // main traveller base information
  mainUserInfo: UserInfo;
  travelCompanions: UserInfo[];
  travelStyle: userPreferences[];
  travelInterests: userPreferences[];

  profileImageUpload?: File;

  travelBudget: {
    min: number;
    max: number;
  };

  isSaving: boolean;
  saveSuccess: boolean;

  originalState?: UserContextObject;

  setContextState: (state: Partial<this>) => void;
}

export const defaultState: UserProfileStateContext = {
  // main traveller
  mainUserInfo: {
    id: "",
    email: "",
    picture: "",
    imageHandle: "",
    firstName: "",
    lastName: "",
    nationality: undefined,
    gender: undefined,
    birthdate: { day: undefined, month: undefined, year: undefined },
    passportno: "",
    passportExpiration: { day: undefined, month: undefined, year: undefined },
    noPassportExpiration: false,
    phone: "",
    relation: undefined,
    newlyAdded: undefined,
    profileImageUpload: undefined,
  },

  travelCompanions: [],
  travelStyle: [],
  travelInterests: [],
  travelBudget: {
    min: 351,
    max: 5332,
  },

  // saving info variables
  isSaving: false,
  saveSuccess: false,

  originalState: undefined,

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setContextState: () => {},
};

const { context, Provider, useContext } = contextFactory<UserProfileStateContext>(defaultState);

export default context;
export const UserProfileStatecontextProvider = Provider;
export const useUserProfileStateContext = useContext;
