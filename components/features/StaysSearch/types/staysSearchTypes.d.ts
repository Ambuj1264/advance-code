declare namespace StaysSearchTypes {
  type Establishment = {
    logo: Image;
    name: string;
    url: string;
  };

  type Review = {
    score: number;
    count: number;
  };

  type Location = {
    address: string;
    zipCode: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };

  type CheckInOut = {
    checkin: string;
    checkout: string;
  };

  type Spec = {
    iconId: string;
    value: string | number;
  };

  type ValueProp = {
    title: string;
    icon: SharedTypes.GraphCMSIcon;
  };

  type StaysProviderRatesType = {
    rateReference?: string;
    subProvider?: string;
    mesh?: string;
    providerCode?: string;
    providerBookingCode?: string;
    price?: {
      currency?: string;
      value: number;
    };
  };

  type StayAmenities = {
    breakfast: import("types/enums").Availability;
    wifi: import("types/enums").Availability;
    hasPrivateParking: boolean;
  };

  type StaysSearchQueryStay = {
    productId: number;
    productUrl?: string;
    name?: string;
    description?: string;
    address?: string;
    mainImage?: SharedTypes.GraphCMSAsset;
    productType?: string;
    stars: number;
    checkinTime: string;
    checkoutTime: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    amenities: StayAmenities;
    rating: number;
    distanceToCenter: number;
    userRatingsTotal: number;
    valuePropsList?: {
      valueProps: ValueProp[];
    };
  };

  type StaysSearchQueryAvailability = {
    stay: StaysSearchQueryStay;
    availabilities?: {
      name?: string;
      provider?: Provider;
      providerReference?: string;
      category?: number;
      dateCheckingIn: Date;
      dateCheckingOut: Date;
      rates?: StaysProviderRatesType;
    }[];
    uniqueId: string;
  };

  type QueryFilterOption = {
    id: string;
    label?: string;
    count: number;
  };

  type QuerySearchFilter = {
    id: string;
    options: QueryFilterOption[];
  };

  type StaysSearchQueryData = {
    filters?: QuerySearchFilter[];
    availabilities?: StaysSearchQueryAvailability[];
  };

  type StaysFilterParams = {
    reviewScore?: string[];
    categories?: string[];
    mealsIncluded?: string[];
    roomPreferences?: string[];
    hotelAmenities?: string[];
    price: string[];
  };

  type StayAvailableProduct = {
    productId: number;
    image?: SharedTypes.GraphCMSAsset;
  };

  type StayProduct = SharedTypes.Product & {
    isHighlight?: boolean;
    isAvailable?: boolean;
  };

  type StaysSearchQueryGTEQuickfact = {
    breakfast?: import("./staysSearchEnums").StaySearchBreakfastAvailabilities;
    distanceFromCityCenter?: number;
    hotelStarRating?: number;
    parking?: import("./staysSearchEnums").StaySearchParkingAvailabilities;
    productType?: import("../../../../types/enums").StayProductType;
    timeOfCheckIn?: string;
    timeOfCheckOut?: string;
    wirelessInternet?: import("./staysSearchEnums").StaySearchWifiAvailabilities;
  };

  type StaysSearchGTECard = {
    availabilityId: string;
    description?: string;
    image?: SharedTypes.GraphCMSAsset;
    isAboutToSellOut?: boolean;
    isYouJustMissedIt?: boolean;
    name?: string;
    price?: SharedTypes.PriceObject;
    id: number;
    productPageUrl?: string;
    userRatingAverage?: number;
    userRatingsTotal?: number;
    valueProps?: import("./staysSearchEnums").StaySearchGTEValueProp[];
    quickfacts?: StaysSearchQueryGTEQuickfact;
  };

  type StaysSearchQueryGTEData = {
    cards?: StaysSearchGTECard[];
    currency?: string;
    productCountTotal: number;
    productCountWithFreeCancellations: number;
    facilitiesFilters?: QuerySearchFilter;
    mealTypeFilters?: QuerySearchFilter;
    productTypeFilters?: QuerySearchFilter;
    starRatingFilters?: QuerySearchFilter;
    roomTypeFilters?: QuerySearchFilter;
    productCountTotal: number;
    currency: string;
    priceMaximum?: SharedTypes.PriceObject;
    priceMinimum?: SharedTypes.PriceObject;
    priceDistribution?: SearchPageTypes.RangeFilter[];
  };

  type StaysSearchMapCard = Pick<
    StaysSearchGTECard,
    | "description"
    | "id"
    | "name"
    | "productPageUrl"
    | "image"
    | "price"
    | "userRatingAverage"
    | "userRatingsTotal"
  > & {
    coordinates?: SharedTypes.MapCoords;
  };

  type StaysSearchMapQuery = {
    cards?: StaysSearchMapCard[];
  };

  type StaySearchQueryGTEInput = {
    bedPreferences?: string[];
    roomTypes?: string[];
    categories?: string[];
    currency?: string;
    dateCheckingIn?: string;
    dateCheckingOut: string;
    hotelAmenities?: string[];
    languageCode?: string;
    mealsIncluded?: string[];
    mealType?;

    inputValue?: string;

    orderbyType?: string;
    orderDirection?: string;
    priceFrom?: number;
    priceTo?: number;
    pricingType?;

    productTypes?: string[];
    reviewScore?: string[];
    skip?: number;
    starRatings?: string[];
    take?: number;
    timeLimitSeconds?: number;
    occupancies?: StayBookingWidgetTypes.Occupancy[];
    alpha2CountryCodeOfCustomer?: string;
  };
}
