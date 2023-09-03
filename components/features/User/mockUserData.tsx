import { UserInfo } from "./types/userTypes";

export const filters = [
  { id: "683.0666666666666", count: 11 },
  { id: "1015.1333333333332", count: 14 },
  { id: "1347.1999999999998", count: 9 },
  { id: "1679.2666666666664", count: 10 },
  { id: "2011.333333333333", count: 9 },
  { id: "2343.3999999999996", count: 8 },
  { id: "2675.4666666666662", count: 9 },
  { id: "3007.533333333333", count: 6 },
  { id: "3339.5999999999995", count: 6 },
  { id: "3671.666666666666", count: 5 },
  { id: "4003.7333333333327", count: 4 },
  { id: "4335.799999999999", count: 3 },
  { id: "4667.866666666666", count: 2 },
  { id: "5332", count: 3 },
];

export const mockQueryResult = {
  userProfile: {
    birthDate: "1995-05-08T00:00:00.000Z",
    email: "dagur@travelshift.com",
    firstName: "Dagur",
    frequentTravelers: [],
    gender: "Female",
    lastName: "Árnason",
    locale: "",
    name: "Dagur Árnason",
    nationality: "DK",
    passport: {
      expirationDate: "2027-06-05T00:00:00.000Z",
      number: "bingblau11234",
      noExpiration: false,
    },
    phone: "+3546699799",
    picture: "https://media.graphassets.com/KiQeaxu3SxaFfnbAICZb",
    imageHandle: "KiQeaxu3SxaFfnbAICZb",
    preferences: {
      budget: { minimum: 704, maximum: 4037, currency: "EUR" },
      interests: [],
      travelStyles: [],
    },
    profileData: {
      cardOnFile: true,
    },
  },
};

export const mockConstructedUserData = {
  frequentTravelers: [],
  mainUser: {
    birthdate: { year: "1995", month: "5", day: "8" },
    email: "dagur@travelshift.com",
    firstName: "Dagur",
    gender: "Female",
    id: "dagur@travelshift.com",
    lastName: "Árnason",
    nationality: "DK",
    passportExpiration: { year: "2027", month: "6", day: "5" },
    passportno: "bingblau11234",
    noPassportExpiration: false,
    phone: "+3546699799",
    picture: "https://media.graphassets.com/KiQeaxu3SxaFfnbAICZb",
    imageHandle: "KiQeaxu3SxaFfnbAICZb",
  },
  travelBudget: { min: 704, max: 4037 },
  travelStyle: [
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
  ],
  travelInterests: [
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
  ],
};

export const mockUpdatedUserData = {
  frequentTravelers: [],
  mainUser: {
    birthdate: { year: "1995", month: "5", day: "8" },
    email: "dagur@travelshift.com",
    firstName: "Dagur",
    gender: "Female",
    id: "dagur@travelshift.com",
    lastName: "Árnason",
    nationality: "DK",
    passportExpiration: { year: "2027", month: "6", day: "5" },
    passportno: "bingblau11234",
    phone: "+3546699799",
    picture: "https://media.graphassets.com/KiQeaxu3SxaFfnbAICZb",
    imageHandle: "KiQeaxu3SxaFfnbAICZb",
  },
  travelBudget: { min: 704, max: 4037 },
  travelInterests: [
    { id: "BEACHES", name: "Beaches", checked: true, disabled: false },
    {
      id: "CULTURAL_ATTRACTIONS",
      name: "Cultural attractions",
      checked: false,
      disabled: false,
    },
    {
      id: "KID_FRIENDLY",
      name: "Kid friendly",
      checked: true,
      disabled: false,
    },
    { id: "MUSEUMS", name: "Museums", checked: true, disabled: false },
    {
      id: "NATURAL_FEATURES",
      name: "Natural features",
      checked: true,
      disabled: false,
    },
    {
      id: "THINGS_TO_DO",
      name: "Things to do",
      checked: false,
      disabled: false,
    },
  ],
  travelStyle: [],
};

export const mockConstructedUpdatedInput = {
  budget: { maximum: 4037, minimum: 704, currency: "EUR" },
  frequentTravelers: [],
  interestIds: ["BEACHES", "KID_FRIENDLY", "MUSEUMS", "NATURAL_FEATURES"],
  mainUser: {
    birthDate: "1995-5-8",
    email: "dagur@travelshift.com",
    firstName: "Dagur",
    gender: "Female",
    lastName: "Árnason",
    nationality: "DK",
    passport: { number: "bingblau11234", expirationDate: "2027-6-5" },
    phone: "+3546699799",
  },
  travelStyleIds: [],
};

export const dummyCompanion = [
  {
    email: "email@email.com",
    birthdate: { day: "4", month: "5", year: "2017" },
    gender: "Female",
    id: "1",
    firstName: "Hekla",
    imageHandle: "imageHandle",
    nationality: "IS",
    noPassportExpiration: false,
    passportExpiration: { day: "6", month: "6", year: "2027" },
    passportno: "1234567890F",
    phone: "+3547717947",
    picture:
      "https://t3.ftcdn.net/jpg/03/67/46/48/360_F_367464887_f0w1JrL8PddfuH3P2jSPlIGjKU2BI0rn.jpg",
    relation: "Partner",
    lastName: "Amunds",
  },
];

export const dummyCompanionArray = [
  ...dummyCompanion,
  {
    birthdate: { day: undefined, month: undefined, year: undefined },
    email: "",
    firstName: "",
    gender: undefined,
    id: "a773cb87-03e4-4dc1-08e3-73ffbde4aa69",
    imageHandle: "imageHandle",
    lastName: "",
    nationality: undefined,
    newlyAdded: true,
    noPassportExpiration: false,
    passportExpiration: { day: undefined, month: undefined, year: undefined },
    passportno: "",
    phone: "",
    picture: "",
    relation: undefined,
  },
];

export const mockTravelInterests = [
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
];

export const updatedMockTravelInterests = [
  {
    id: "BEACHES",
    name: "Beaches",
    checked: false,
    disabled: false,
  },
  {
    id: "CULTURAL_ATTRACTIONS",
    name: "Cultural attractions",
    checked: true,
    disabled: false,
  },
  {
    id: "KID_FRIENDLY",
    name: "Kid friendly",
    checked: false,
    disabled: false,
  },
];

export const userTravelStylesIds = ["citybreaks", "luxurypackages"];

export const userTravelInterestIds = ["culturalattractions", "museums"];

export const mockQueryBudget = {
  minimum: 351,
  maximum: 5332,
  currency: "EUR",
};

export const minMaxPrice = {
  min: 351,
  max: 5332,
};

export const constructedDateObject = { year: "2027", month: "6", day: "5" };

export const constructedDateStringInput = "2027-6-5";

export const mockQueryPreferences = [
  { id: "BEACHES" },
  { id: "KID_FRIENDLY" },
  { id: "MUSEUMS" },
  { id: "NATURAL_FEATURES" },
];

export const mockConstructedPreferences = [
  "BEACHES",
  "KID_FRIENDLY",
  "MUSEUMS",
  "NATURAL_FEATURES",
];

export const mockUserInput: UserInfo = {
  id: "dagur@travelshift.com",
  email: "dagur@travelshift.com",
  picture: "https://media.graphassets.com/KiQeaxu3SxaFfnbAICZb",
  imageHandle: "KiQeaxu3SxaFfnbAICZb",
  birthdate: {
    year: "1995",
    month: "5",
    day: "8",
  },
  firstName: "Dagur",
  lastName: "Árnason",
  nationality: "IS",
  gender: "Female",
  passportno: "bingblau1123422",
  passportExpiration: {
    year: "2027",
    month: "3",
    day: "3",
  },
  phone: "+3547717947",
};

export const mockInvalidUserInput: UserInfo = {
  id: "dagur@travelshift.com",
  email: "dagur@travelshift.com",
  picture: "https://media.graphassets.com/KiQeaxu3SxaFfnbAICZb",
  imageHandle: "KiQeaxu3SxaFfnbAICZb",
  birthdate: {
    year: "1995",
    month: "5",
    day: "8",
  },
  firstName: "Dagur",
  lastName: "",
  nationality: "IS",
  gender: "Female",
  passportno: "bingblau1123422",
  passportExpiration: {
    year: "2027",
    month: "3",
    day: "3",
  },
  phone: "+3547717947",
};

export const mockInvalidCompanionInput: UserInfo[] = [
  {
    id: "916c9238-d976-4be2-011d-401f60d39c03",
    email: "dagursnilli@gmail",
    picture: "https://media.graphassets.com/e3Rg56xSxilwZwONzE8Q",
    imageHandle: "KiQeaxu3SxaFfnbAICZb",
    birthdate: {
      year: "2017",
      month: "4",
      day: "5",
    },
    firstName: "Daxi",
    lastName: "as",
    nationality: "IS",
    gender: "Male",
    passportno: "HH123456",
    passportExpiration: {
      year: "2027",
      month: "8",
      day: "4",
    },
    phone: "+3547717948",
    relation: "Friend",
  },
];
