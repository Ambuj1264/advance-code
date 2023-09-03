/* eslint-disable camelcase */
declare namespace TourBookingWidgetTypes {
  import { SupportedCurrencies } from "types/enums";

  export type OnSetDefaultNumberOfTravelers = (
    numberOfTravelers: SharedTypes.NumberOfTravelers,
    editItem?: TourBookingWidgetTypes.EditItem
  ) => void;

  export type OnSetInitialNumberOfTravelers = (
    numberOfTravelers: SharedTypes.NumberOfTravelers
  ) => void;

  export type OnSetSelectedExperience = (selectedExperience: SelectedExperience) => void;

  export type GTIVpPrice = {
    selectedOptionDiff: number;
    discountValue?: number;
  };

  export type SelectedTravelerExperience = Readonly<{
    experienceId: string;
    count: number;
    price: number;
    discountValue?: number;
    answers?: {
      externalId: number;
      question: string;
      answer: string;
    }[];
    calculatePricePerPerson: boolean;
  }>;

  export type SelectedGroupExperience = Readonly<{
    experienceId: string;
    answerId: string;
    prices: number[];
    vpPrice: GTIVpPrice;
    calculatePricePerPerson: boolean;
  }>;

  export type SelectedExperience = SelectedGroupExperience | SelectedTravelerExperience;

  export type SelectedExperiences = ReadonlyArray<SelectedExperience>;

  export type QueryDates = Readonly<{
    unavailableDates: Array<string>;
    min: string | boolean;
    max: string | boolean;
    availableDates: Array<string>;
  }>;

  export type BookingWidgetTourData = Readonly<{
    basePrice: number;
    lengthOfTour: number;
  }>;

  export type QueryPickupPrices = {
    pickup_priced_per_person: boolean;
    price_pickup: number;
    price_pickup_child: number;
    price_pickup_teenager: number;
  };

  export type QueryOptionPrice = {
    price: number | string;
    disabled: number;
  };

  export type QueryOption = {
    id: string;
    prices: QueryOptionPrice[];
    included: number;
  };

  export type QueryExtra = {
    disabled: number;
    id: number;
    options?: QueryOption[];
    price: string;
  };

  export type QueryTimeWithPrices = {
    id: number;
    pickup_time: string | null;
    departure_flex: number;
    min: number;
    max: number;
    extras: [
      {
        price: string;
        id: number;
        per_person: number;
        disabled: 0;
        is_multiple: number;
        options: [
          {
            prices: [
              {
                price: number;
                disabled: number;
                type: string;
                price_display: number;
              }
            ];
            included: number;
            id: string;
          }
        ];
        price_display: number;
      }
    ];
    has_required_options: boolean;
    available: boolean;
    advance_notice: {
      y: boolean;
      m: boolean;
      d: number;
      h: boolean;
      i: boolean;
      s: boolean;
      f: boolean;
      weekday: number;
      weekday_behavior: number;
      first_last_day_of: number;
      invert: number;
      days: boolean;
      special_type: number;
      special_amount: number;
      have_weekday_relative: number;
      have_special_relative: number;
    };
    pickup_prices: {
      price_pickup: number;
      price_pickup_teenager: number;
      price_pickup_child: number;
      pickup_priced_per_person: boolean;
    };
    pickup_available: boolean;
    price_adult: number;
    price_adult_2: number;
    price_adult_3: number;
    price_adult_4: number;
    price_adult_5: number;
    price_adult_lowest: number;
    price_adult_display: number;
    price_teenager: number;
    price_teenager_2: number;
    price_teenager_3: number;
    price_teenager_4: number;
    price_teenager_5: number;
    price_teenager_lowest: number;
    price_teenager_display: number;
    price_child: number;
    price_child_2: number;
    price_child_3: number;
    price_child_4: number;
    price_child_5: number;
    price_child_lowest: number;
    price_child_display: number;
    time: string;
    time_plus_pickup_duration: string;
  };

  export type QueryVpOptionPrice = {
    currency: SupportedCurrencies;
    value: number;
    discount: number;
  };

  export type QueryVpOptions = {
    id: number;
    name: string;
    price?: QueryVpOptionPrice;
    isRequired: boolean;
    perPerson: boolean;
    question?: string;
    items: {
      id: string;
      name: string;
      isDefault: boolean;
      isIncluded: boolean;
      price?: QueryVpOptionPrice;
    }[];
  };

  export type QueryVpPrices = {
    monolithVacationPackage: {
      id: number;
      uuid: string;
      price: {
        currency: SupportedCurrencies;
        value: number;
        discount: number;
        discountPercentage: number;
      };
      options: QueryVpOptions[];
      error: string | null;
    };
  };

  export type TimeWithPricesData = Readonly<{
    isFlexible: int;
    time: string;
    available: boolean;
    pickupTime?: string;
    departureTime: string;
    extras: QueryExtra[];
    minNumberOfTravelers: number;
    maxNumberOfTravelers: number;
    priceAdult: number;
    priceAdult2: number;
    priceAdult3: number;
    priceAdult4: number;
    priceAdult5: number;
    priceChild: number;
    priceChild2: number;
    priceChild3: number;
    priceChild4: number;
    priceChild5: number;
    priceTeenager: number;
    priceTeenager2: number;
    priceTeenager3: number;
    priceTeenager4: number;
    priceTeenager5: number;
    pickupPrices: QueryPickupPrices;
    isPickupAvailable: boolean;
  }>;

  export type Prices = {
    [travelerType in SharedTypes.TravelerType]: number;
  };

  export type PickupPrices = {
    pickupPricedPerPerson: boolean;
    prices: Prices;
  };

  export type OptionPrice = {
    price: number;
    disabled: boolean;
    discountValue?: number;
  };

  export type Option = {
    id: string;
    prices: OptionPrice[];
    disabled: boolean;
    included: boolean;
  };

  export type Extra = {
    id: string;
    disabled: boolean;
    options: Option[];
    price: number;
    discountValue?: number;
  };

  export type Time = Readonly<{
    extras?: Extra[];
    prices: Prices[];
    time: string;
    available: boolean;
    minNumberOfTravelers: number;
    maxNumberOfTravelers: number;
    pickupPrices: PickupPrices;
    departureTime: string;
    isPickupAvailable: boolean;
  }>;

  export type AvailableTimes = Readonly<{
    isFlexible: boolean;
    times: Time[];
  }>;

  export type FormData = {
    date: string;
    time: string;
    departureFlex: string;
    adults: string;
    teenagers: string;
    children: string;
    childrenAges: number[];
    tourPickup: string;
    tourId: string;
    pickupType: string;
    pickupPlace?: string;
    pickupPlaceId?: number;
    pickupName?: string;
    pickupInfo?: any;
    contactInfo?: any;
    privateOptionsIds?: string[];
    livePricingUuid?: string;
    livePricingNonDefaultUuid?: string;
  };

  export type QueryDiscount = {
    tour: Readonly<{
      discount?: Readonly<{
        value: number;
        isFullPriceDiscount: boolean;
      }>;
    }>;
  };

  export type PrivateOption = Readonly<{
    id: number;
    travellers: number;
    price: number;
    season: string;
  }>;

  export type QueryPrivateOptions = {
    tour: Readonly<{
      availablePrivateOptions?: PrivateOption[];
    }>;
  };

  export type EditItem = Readonly<{
    itemId: number;
    productId: number;
    type: string;
    name: string;
    persons: number;
    adults: number;
    teenagers: number;
    children: number;
    date: Date;
    time: string;
    tourDetails: EditItemDetails;
    editLock?: boolean;
  }>;

  export type EditItemDetailsOptionAnswer = Readonly<{
    externalId: string;
    answer: string;
  }>;

  export type EditItemDetailsOption = {
    id: string;
    selectedValue: string;
    optionAnswers: {
      answers: EditItemDetailsOptionAnswer[];
    }[];
  };

  export type EditItemDetails = {
    pickupType: string;
    tourPickup: boolean;
    placeId: number;
    placeName: string;
    pickupAddress?: string;
    pickupTime?: string;
    pickupAirportId?: number;
    pickupFlightNumber?: string;
    dropoffTime?: string;
    dropoffPlaceId?: number;
    dropoffAddress?: string;
    dropoffAirportId?: number;
    dropoffFlightNumber?: string;
    options: EditItemDetailsOption[] | null;
  };
  export type TravelersByPriceGroups = Readonly<{
    adults: {
      count: number;
      childrenAges: number[];
    };
    children: {
      count: number;
      childrenAges: number[];
    };
    teenagers: {
      count: number;
      childrenAges: number[];
    };
  }>;
}
