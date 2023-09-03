export type userQueryResult = {
  userProfile: userProfileQuery;
};

export type userProfileQuery = {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  locale?: string;
  birthDate?: string;
  nationality?: string;
  picture?: string;
  imageHandle?: string;
  gender?: string;
  passport?: { number: string; expirationDate: string; noExpiration: boolean };
  frequentTravelers?: queryFrequentTravelers[];
  preferences?: {
    budget?: querybudget;
    interests?: queryPreferences[];
    travelStyles?: queryPreferences[];
  };
};

export type querybudget = {
  minimum: number;
  maximum: number;
  currency: string;
};

export type queryPreferences = {
  id: string;
};

export type queryFrequentTravelers = {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  nationality?: string;
  locale?: string;
  picture?: string;
  imageHandle?: string;
  gender?: string;
  passport?: { number: string; expirationDate: string; noExpiration: boolean };
  relation?: string;
};

export type userMutationInput = {
  imageAsBase64String?: string;
  mainUser: {
    birthDate?: string;
    email: string;
    firstName: string;
    gender?: string;
    lastName: string;
    nationality?: string;
    passport: {
      expirationDate?: string;
      number?: string;
      noExpiration?: boolean;
    };
    phone?: string;
    imageAsBase64String?: string;
  };
  frequentTravelers: {
    birthDate?: string;
    email: string;
    firstName: string;
    gender?: string;
    lastName: string;
    nationality?: string;
    passport: {
      expirationDate?: string;
      number?: string;
      noExpiration?: boolean;
    };
    phone?: string;
    relation?: string;
  }[];
  travelStyleIds: string[];
  interestIds: string[];
  budget: querybudget;
};

export type UserInfo = {
  id: string;
  email: string;
  picture: string;
  imageHandle: string;
  firstName: string;
  lastName: string;
  nationality?: string;
  gender?: string;
  birthdate: SharedTypes.Birthdate;
  passportno?: string;
  passportExpiration: SharedTypes.Birthdate;
  noPassportExpiration?: boolean;
  phone?: string;
  relation?: string;
  newlyAdded?: boolean;
  profileImageUpload?: File;
  base64Image?: string;
};

export type userPreferences = {
  id: string;
  checked: boolean;
  disabled?: boolean;
  name: string;
};

export type UserContextObject = {
  mainUser: UserInfo;
  frequentTravelers: UserInfo[];
  travelStyle: userPreferences[];
  travelInterests: userPreferences[];
  travelBudget: { min: number; max: number };
};
