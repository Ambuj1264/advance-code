export type VendorModelType = {
  name: string;
  __typename: string;
};

export const getVendorModel = (): VendorModelType => ({
  name: "Europcar",
  __typename: "OrderCarCartVendor",
});

export type OpeningHoursEntityModelType = {
  isOpen: boolean;
  openFrom: string;
  openTo: string;
  dayOfWeek: number;
  __typename: string;
};

export const getOpeningHoursEntityModel = (): OpeningHoursEntityModelType => ({
  isOpen: true,
  openFrom: "08:00",
  openTo: "17:00",
  dayOfWeek: 1,
  __typename: "OrderCarCartOpeningHours",
});

export type VariablesEntityModelType = {
  key: string;
  value: string;
  __typename: string;
};

export const getVariablesEntityModel = (): VariablesEntityModelType => ({
  key: "YY0",
  value: "8",
  __typename: "OrderTranslationVariables",
});

export type KeysEntityModelType = {
  key: string;
  variables: VariablesEntityModelType[];
  __typename: string;
};

export const getKeysEntityModel = (): KeysEntityModelType => ({
  key: "rental_name",
  variables: [getVariablesEntityModel()],
  __typename: "OrderTranslationKey",
});

export type TranslationKeysModelType = {
  keys: KeysEntityModelType[];
  __typename: string;
};

export const getTranslationKeysModel = (): TranslationKeysModelType => ({
  keys: [getKeysEntityModel()],
  __typename: "OrderTranslationKeys",
});

export type PriceBreakdownEntityModelType = {
  id: string;
  name: string;
  currency: string;
  quantity: number;
  pricePerUnit: number;
  pricePerUnitDisplay: string;
  totalPrice: number;
  totalPriceDisplay: string;
  isMinAmount: boolean;
  isMaxAmount: boolean;
  includeInBasePrice: boolean;
  type: string;
  translationKeys: TranslationKeysModelType;
  __typename: string;
};

export const getPriceBreakdownEntityModel = (): PriceBreakdownEntityModelType => ({
  id: "ff8dea18-77e5-4121-a9d9-1f5dbaa63708",
  name: "Car rental for 8 days.",
  currency: "ISK",
  quantity: 1,
  pricePerUnit: 130922.6,
  pricePerUnitDisplay: "130,923",
  totalPrice: 130922.6,
  totalPriceDisplay: "130,923",
  isMinAmount: false,
  isMaxAmount: false,
  includeInBasePrice: true,
  type: "Rental",
  translationKeys: getTranslationKeysModel(),
  __typename: "OrderCartPriceBreakdown",
});

export type PickupOrDropoffModelType = {
  address: string;
  streetNumber: string;
  cityName: string;
  postalCode: string;
  state?: null;
  country: string;
  phoneNumber: string;
  openingHours: OpeningHoursEntityModelType[];
  __typename: string;
};

export const getPickupOrDropoffModel = (): PickupOrDropoffModelType => ({
  address: "KEFLAVIK INTERNATIONAL AIRPORT, KEFLAVIK",
  streetNumber: "KEFLAVIK INTERNATIONAL AIRPORT",
  cityName: "KEFLAVIK",
  postalCode: "235",
  state: null,
  country: "Iceland",
  phoneNumber: "+354  4616000",
  openingHours: [getOpeningHoursEntityModel()],
  __typename: "OrderCarCartLocation",
});

export type LocationDetailsModelType = {
  pickup: PickupOrDropoffModelType;
  dropoff: PickupOrDropoffModelType;
  __typename: string;
};

export const getLocationDetailsModel = (): LocationDetailsModelType => ({
  pickup: getPickupOrDropoffModel(),
  dropoff: getPickupOrDropoffModel(),
  __typename: "OrderCarCartLoctionDetails",
});

export type CarModelType = {
  id: string;
  offerId: string;
  cartItemId: string;
  category: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupId: string;
  dropoffId: string;
  flightNumber?: string;
  provider: string;
  numberOfDays: number;
  priceOnArrival: number;
  discountAmount: number;
  discountPercentage: number;
  extras: any;
  insurances: any;
  title: string;
  totalPrice: number;
  priceBreakdown: PriceBreakdownEntityModelType[];
  payOnArrival: any;
  imageUrl: string;
  available: boolean;
  editable: boolean;
  from: string;
  to: string;
  updated: string;
  createdTime: string;
  expiredTime: string;
  advancedNoticeSec?: null;
  driverAge: number;
  driverCountry: string;
  locationDetails: LocationDetailsModelType;
  vendor: VendorModelType;
  pickupSpecify?: string;
  dropoffSpecify?: string;
  __typename: string;
};

export const getCarModel = (title?: string, totalPrice?: number): CarModelType => ({
  id: "",
  offerId: "",
  cartItemId: "",
  category: "Small",
  pickupSpecify: "",
  dropoffSpecify: "",
  pickupLocation: "Keflavik International Airport",
  dropoffLocation: "Akureyri",
  pickupId: "701,2",
  dropoffId: "1167,2",
  flightNumber: "FG4567",
  provider: "Carnect",
  numberOfDays: 8,
  priceOnArrival: 31547.87,
  discountAmount: 0,
  discountPercentage: 0,
  extras: [],
  insurances: [],
  title: title ?? "TEST KIA PICANTO",
  totalPrice: totalPrice ?? 130922,
  priceBreakdown: [getPriceBreakdownEntityModel()],
  payOnArrival: [],
  imageUrl: "https://static.carhire-solutions.com/images/car/Europcar/large/t_MDMN_IS.jpg",
  available: true,
  editable: false,
  from: "2024-09-16T10:00:00.000Z",
  to: "2024-09-24T10:00:00.000Z",
  updated: "2022-12-09T07:49:01.000Z",
  createdTime: "2022-12-09T07:49:05.122Z",
  expiredTime: "2030-12-09T08:15:05.122Z",
  advancedNoticeSec: null,
  driverAge: 45,
  driverCountry: "IS",
  locationDetails: getLocationDetailsModel(),
  vendor: getVendorModel(),
  __typename: "OrderCarCartInfo",
});
