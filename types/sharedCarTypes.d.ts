declare namespace SharedCarTypes {
  export type QueryQuickFacts = {
    category: string;
    passengerQuantity: number;
    bagQuantity: number;
    manualTransmission: boolean;
    fuelPolicy: QueryFuelPolicy | null;
    milage: {
      unlimited: boolean;
      distance: string;
    };
    model: number | null;
    depositRequired: boolean;
    doors: number;
    highlandCapabilities: boolean;
    airConIncluded: boolean;
    minAge: number;
    year: number;
  };

  export type CarProductProp =
    | "snowTires"
    | "unlimitedMileage"
    | "additionalDriver"
    | "outOfHoursPickUp"
    | "windscreenTyreCoverage"
    | "extendedProtection"
    | "fullProtection"
    | "hotelDelivery"
    | "freeCancellation"
    | "priceGuarantee"
    | "gpsIncluded"
    | "customerSupport"
    | "instantConfirmation";

  export type QueryProductProp = {
    iconKey: CarProductProp;
  };

  export type SearchTimeTypes = CarSearchTimeType.PICKUP | CarSearchTimeType.DROPOFF;

  export type CarSeachTimes = {
    [searchTimeType in SearchTimeTypes]: SharedTypes.Time;
  };

  export type CarSearchHour = {
    hour: number;
    timeType: SearchTimeTypes;
  };

  export type CarIncluded = {
    includedId: string;
    name: string;
    coverageAmount: number;
    coverageCurrency: string;
  };

  export type QueryCarImage = {
    imageId: number;
    name?: string;
    url: string;
    alt?: string;
  };

  export type VendorInfo = {
    id: string;
    name: string;
    reviewCount: number;
    reviewAverageFormatted: string;
    image: Image;
    pickupLocation?: {
      locationType: string | null;
    };
  };
}
