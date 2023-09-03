declare namespace CarTypes {
  import { CarProvider } from "types/enums";

  type QueryExtraType = "EXTRA" | "INSURANCE";

  type QueryExtraPeriodType = "PER_DAY" | "PER_RENTAL";

  type QuestionType = "TEXT" | "NUMBER";

  type TranslationKey = {
    key: string;
    variables: {
      key: string;
      value: string;
    }[];
  };

  type TranslationKeys = {
    keys: TranslationKey[];
  };

  type CommonInsuranceInfo = {
    policyName: string;
    description: string;
    disclaimer: string;
  };

  type InsuranceInclusion = {
    title: string;
    content: string;
  };

  type InsuranceInfo = CommonInsuranceInfo & {
    inclusionsList: InsuranceInclusion[];
  };

  type QueryInsuranceInclusion = InsuranceInclusion & {
    translationKeys: TranslationKeys;
  };

  type QueryInsuranceInfo = CommonInsuranceInfo & {
    translationKeys: TranslationKeys;
    inclusionsList: QueryInsuranceInclusion[];
  };

  type QueryExtraQuestion = {
    key: string;
    questionType: QuestionType;
  };

  type ExtraQuestion = {
    name: string;
    questionType: QuestionType;
  };

  type QueryExtra = {
    id: string;
    name: string;
    type: QueryExtraType;
    description: string;
    required: boolean;
    quantity: number;
    amount: number;
    code: string;
    periodType: QueryExtraPeriodType;
    translationKeys: TranslationKeys;
    insuranceInfo?: QueryInsuranceInfo;
    payableNow: boolean;
    questions?: QueryExtraQuestion[];
  };

  type QueryIncluded = {
    includedId: string;
    type: QueryExtraType;
    name: string;
    coverageAmount: number;
    coverageCurrency: string;
    description: string;
    code: string;
    details?: IncludedItemDetails[];
    translationKeys: TranslationKeys;
  };

  type OpeningHoursOfDay = {
    day: string;
    dayOfWeek: number;
    isOpen: boolean;
    openingHours: string[];
  };

  type QueryOpeningHour = {
    isOpen: boolean;
    openFrom: string;
    openTo: string;
    dayOfWeek: number;
  };

  type LocationDetails = {
    address: string;
    phoneNumber: string;
    cityName: string;
    locationId: number;
    streetNumber: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
    additionalParkInfo?: string;
    openingHours: QueryOpeningHour[];
    name: string;
  };

  type LocationsDetails = {
    pickup: LocationDetails & {
      isAirportPickup: boolean;
      isHotelPickup: boolean;
      mapData: SharedTypes.Map;
    };
    dropoff: LocationDetails & {
      isAirportDropoff: boolean;
      isHotelDropoff: boolean;
      mapData: SharedTypes.Map;
    };
  };

  type QueryLocationsDetails = {
    pickup: LocationDetails & {
      isAirportPickup: boolean;
      isHotelPickup: boolean;
    };
    dropoff: LocationDetails & {
      isAirportDropoff: boolean;
      isHotelDropoff: boolean;
    };
  };

  type CarEstablishment = {
    id: string;
    vendorId: string;
    reviewCount: number;
    reviewTotalScore: string;
    image: QueryImage;
    name: string;
    pickupLocation?: SharedCarTypes.VendorInfo.pickupLocation;
  };

  type AvailableLocationPickupOrDropOff = {
    name: string;
    locationType: string;
  };
  type AvailableLocation = {
    idContext: string;
    pickupLocation: AvailableLocationPickupOrDropOff;
    returnLocation: AvailableLocationPickupOrDropOff;
  };

  type QueryCarOffer = {
    title: string;
    locationDetails: QueryLocationsDetails;
    pickupId: number;
    dropoffId: number;
    pickupTime: SharedTypes.iso8601DateTime;
    returnTime: SharedTypes.iso8601DateTime;
    availableLocations?: CarTypes.AvailableLocation[];
    offer: {
      idContext: string;
      provider: CarProvider;
      extras: QueryExtra[];
      included: QueryIncluded[];
      establishment: CarEstablishment;
      carInfo: {
        name: string;
        images: QueryImage[];
        orSimilar: boolean;
        vehicleCategory?: string;
      };
      rentalRate: {
        vehicleCharges: {
          discount: {
            percent: string;
          } | null;
          deposit?: Deposit;
        };
      };
      documents?: Document[];
      quickFacts: SharedCarTypes.QueryQuickFacts;
    };
  };

  type QueryCarOfferData = {
    cartLink: string;
    searchPageUrl: string;
    searchPageUrlGTI: string;
    carOffer: QueryCarOffer;
  };

  type CarOffer = {
    pickupId: number;
    pickupLocation: string;
    isAirportPickup: boolean;
    isHotelPickup: boolean;
    dropoffId: number;
    dropoffLocation: string;
    isAirportDropoff: boolean;
    isHotelDropoff: boolean;
    includedItems: SharedTypes.Icon[];
    availableInsurancesItems: SharedTypes.Icon[];
    availableExtrasItems: SharedTypes.Icon[];
    extras: QueryExtra[];
    included: QueryIncluded[];
    deposit?: string;
    availableLocations?: AvailableLocation[];
    title?: string;
    pickupName?: string;
    dropoffName?: string;
  };

  type QueryFuelPolicy = "EMPTY_TO_EMPTY" | "FULL_TO_EMPTY" | "FULL_TO_FULL" | "LEVEL_TO_LEVEL";

  export type IncludedItemDetails = {
    charge: {
      amount: number;
      description: string;
    };
  };
  export type QueryIncludedItems = {
    id: number;
    name: string;
    description: string;
    coverageAmount: number;
    coverageCurrency: string;
  };

  export type QueryAvailableExtras = {
    id: number;
    name: string;
    code: string;
    description: string;
    required: boolean;
    chargePerDay: boolean;
    price: number;
    multiple: boolean;
  };

  export type QueryCar = {
    id: string;
    url: string;
    orSimilar: boolean;
    establishment: QueryEstablishment;
  };

  export type Car = {
    cover: Cover;
    orSimilar: boolean;
    valuePropositions: SharedTypes.ProductProp[];
    reviewTotalScore: number;
    reviewTotalCount: number;
    quickFacts: SharedTypes.QuickFact[];
    establishment: Establishment;
    discountPercent?: number;
    productInformation?: Document;
    locationDetails: LocationsDetails;
    insuranceInformation?: InsuranceInfo;
  };

  export type Cover = {
    name: string;
    images: Image[];
    fallBackImg?: ImageWithSizes;
  };

  export type QueryEstablishment = {
    id: string;
    name: string;
    image: QueryImage;
  };

  export type Establishment = {
    id: string;
    name: string;
    image: Image;
  };

  export type Deposit = {
    description?: string;
    translationKeys: TranslationKeys;
  };

  export type SearchCategory = {
    id: string;
    name: string;
    visible: boolean;
    uri: string;
    imageUrl: string;
  };

  export type Document = { type: string; url: string };

  export type SimilarCarsProps = {
    id: string;
    provider: CarProvider;
    from: string;
    to: string;
    pickupId: string;
    dropoffId: string;
    driverCountry?: string;
    driverAge?: string;
    category: string;
    carName: string;
    carProductUrl: string;
    pickupLocationName: string;
    dropoffLocationName: string;
  };

  export type AddCarToCartData = {
    id: string;
    from: Date;
    to: Date;
    pickupId: number;
    dropoffId: number;
    queryPickupId: string;
    queryDropoffId: string;
    driverAge?: string;
    driverCountryCode?: string;
    pickupSpecify: string;
    dropoffSpecify: string;
    extras: OptionsTypes.Option[];
    selectedExtras: CarBookingWidgetTypes.SelectedExtra[];
    insurances: OptionsTypes.Option[];
    selectedInsurances: CarBookingWidgetTypes.SelectedInsurance[];
    provider: CarProvider;
    cartId?: number;
  };

  export type MutationAddCarToCarInput = {
    id: number | null;
    carnectOfferId: string | null;
    carPickupDate: string;
    carPickupTime: string;
    carPickupId: number;
    carPickupSpecificValue: string;
    carDropoffDate: string;
    carDropoffTime: string;
    carDropoffId: number;
    carDropoffSpecificValue: string;
    cartId?: number;
    extras: {
      id: number;
      selected_value: string;
      questionAnswers: CarBookingWidgetTypes.SelectedExtraQuestionAnswer[];
    }[];
    insurances: string[];
    driverAge?: string;
    driverCountryCode?: string;
    externalPickupId?: string;
    externalDropoffId?: string;
  };

  export type AddCarGTEToCartData = {
    id: string;
    selectedExtras: CarBookingWidgetTypes.SelectedExtra[];
    selectedInsurances: CarBookingWidgetTypes.SelectedInsurance[];
    driverAge?: string;
    driverCountryCode?: string;
  };

  export type MutationGTEAddCarToCartInput = {
    offerId: string | null;
    extras: {
      id: number;
      count: number;
      questionAnswers: CarBookingWidgetTypes.SelectedExtraQuestionAnswer[];
    }[];
    insurances: string[];
    driverAge: number;
    driverCountryCode: string;
  };
}
