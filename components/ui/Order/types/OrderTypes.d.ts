declare namespace OrderTypes {
  import { TourTypes, QueryTourPickup } from "types/enums";

  export type CartFlightBaggage = {
    id: string;
    category: string;
    length: number;
    width: number;
    height: number;
    weight: number;
    count: number;
  };

  export type CartFlightItinerary = {
    id: string;
    numberOfPassengers: number;
    cartItemId: string;
    nightsInDestination?: number;
    isEditable: boolean;
    baggage: CartFlightBaggage[];
    adults: number;
    children: number;
    infants: number;
    available: boolean;
    priceObject: SharedTypes.PriceObject;
  } & FlightSearchTypes.FlightItinerary;

  export type QueryFlightItineraryCart = {
    id: string;
    numberOfPassengers: number;
    cartItemId: string;
    isEditable: boolean;
    baggage: CartFlightBaggage[];
    adults: number;
    children: number;
    infants: number;
    title: string;
    documentNeed?: number;
    available: boolean;
    priceObject: SharedTypes.PriceObject;
  } & FlightSearchTypes.QueryFlightItinerary;

  export type QueryCarCartAddon = {
    id?: string;
    name?: string;
    count: number;
    price: number;
    translationKeys?: CarTypes.TranslationKeys;
  };

  export type QueryOrderPrice = {
    id?: string;
    name?: string;
    currency?: string;
    quantity: number;
    pricePerUnit: number;
    pricePerUnitDisplay?: string;
    totalPrice: number;
    totalPriceDisplay?: string;
    isMinAmount: boolean;
    isMaxAmount: boolean;
    includeInBasePrice: boolean;
    type?: string;
    translationKeys?: CarTypes.TranslationKeys;
    priceObject: SharedTypes.PriceObject;
  };

  export type QueryCarCartOpeningHours = {
    dayOfWeek: number;
    isOpen: boolean;
    openFrom: string;
    openTo: string;
  };

  export type QyeryCarCartLocation = {
    address: string;
    streetNumber: string;
    cityName: string;
    postalCode: string;
    state: string;
    country: string;
    phoneNumber: string;
    openingHours: QueryCarCartOpeningHours[];
  };

  export type QueryCarCartLocationDetails = {
    pickup?: QyeryCarCartLocation;
    dropoff?: QyeryCarCartLocation;
  };

  export type QueryCarRental = {
    id: string;
    cartItemId: string;
    offerId: string;
    category?: string;
    pickupLocation?: string;
    pickupSpecify?: string;
    dropoffLocation?: string;
    dropoffSpecify?: string;
    pickupId?: string;
    dropoffId?: string;
    discountAmount?: number;
    discountAmountPriceObject?: SharedTypes.PriceObject;
    discountPercentage?: number;
    provider?: string;
    numberOfDays: number;
    priceOnArrival: number;
    priceOnArrivalPriceObject?: SharedTypes.PriceObject;
    priceBreakdown: QueryOrderPrice[];
    payOnArrival: QueryOrderPrice[];
    extras: QueryCarCartAddon[];
    insurances: QueryCarCartAddon[];
    title?: string;
    totalPrice: number;
    imageUrl?: string;
    available: boolean;
    editable: boolean;
    from?: SharedTypes.iso8601DateTime;
    to?: SharedTypes.iso8601DateTime;
    updated: SharedTypes.iso8601DateTime;
    createdTime: SharedTypes.iso8601DateTime;
    expiredTime?: SharedTypes.iso8601DateTime;
    advanceNoticeSec?: number;
    driverAge?: number;
    driverCountry?: string;
    flightNumber?: string;
    locationDetails?: QueryCarCartLocationDetails;
    vendor?: {
      name: string;
    };
    priceObject: SharedTypes.PriceObject;
  };

  export type CarRental = QueryCarRental & {
    cartItemIdParsed: number;
    from: Date;
    to: Date;
    updated: Date;
    createdTime: Date;
    expiredTime?: Date;
    provider?: import("types/enums").CarProvider;
    clientRoute: SharedTypes.ClientRoute;
    linkUrl: string;
    editLinkUrl: string;
    priceObject: SharedTypes.PriceObject;
  };

  export type CarRentalSearchUrl = {
    from: Date;
    to: Date;
    pickupId?: string;
    dropoffId?: string;
    driverAge?: number;
    driverCountry?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
  };

  export type QueryToursExtras = {
    extraId: string;
    name: string;
    answer: string;
    answers?: string[] | null;
    included: boolean;
    price: number;
    required: boolean;
  };

  export type QueryTourWhatToBring = {
    id: number;
    name: string;
    included: boolean;
  };

  export type QueryTourPickupKeys = keyof typeof QueryTourPickup;
  export type QueryTourPickupValues = typeof QueryTourPickup[QueryTourPickupKeys];

  export type QueryTour = {
    tourId: number;
    type: TourTypes;
    adults: number;
    teenagers: number;
    children: number;
    extras: QueryToursExtras[];
    valueProps: SharedTypes.QueryProductProp[];
    specs: SharedTypes.QueryProductSpec[];
    durationSec: number;
    durationText: string;
    title: string;
    cartItemId: string;
    discountAmount?: number;
    discountAmountPriceObject?: SharedTypes.PriceObject;
    discountPercentage?: number;
    totalPrice: number;
    imageUrl: string;
    available: boolean;
    editable: boolean;
    from: SharedTypes.iso8601DateTime;
    to: SharedTypes.iso8601DateTime;
    updated: SharedTypes.iso8601DateTime;
    createdTime: SharedTypes.iso8601DateTime;
    linkUrl: string;
    category: {
      id?: number;
      name?: string;
      uri?: string;
    };
    advanceNoticeSec?: number;
    whatToBringItems: QueryTourWhatToBring[];
    pickup: QueryTourPickupValues;
    pickupLocation?: string;
    departurePoint?: string;
    departureInformation?: string;
    startingLocation?: {
      locationName: string;
    };
    endingLocation?: {
      locationName: string;
    };
    priceObject: SharedTypes.PriceObject;
  };

  export type CartStaysRoom = Omit<
    AccommodationTypes.QueryRoom,
    "roomImages" | "bedOptions" | "privateBathroom" | "advancedNotice"
  > & {
    type?: string;
    privateBathroom?: boolean;
    roomBookings?: {
      extraBedCount: number;
      adults: number;
      children: number;
      mesh?: string;
      requestId?: string;
      source?: string;
      masterRateCode?: string;
      extras: QueryStayCartExtra[];
    }[];
  };

  type StaysServiceDetails = {
    productId: number;
    numberOfNights: number;
    title: string;
  };

  export type QueryStayCartExtra = {
    id: number;
    name: string;
    price: number;
    childPrice: number;
    required: number;
    count: number;
    chargeType?: string;
  };

  export type QueryStayProductCartRoom = {
    availabilityId?: string;
    dateFreeCancellationUntil: SharedTypes.iso8601DateTime;
    mealType?: string;
    name?: string;
    number: number;
    cancellationType?: string;
  };

  export type QueryStayProductCartProduct = {
    address?: string;
    cmsImageHandle?: string;
    name?: string;
    openStreetMapEntries?: {
      defaultName?: string;
      openStreetMapId?: string;
      type?: string;
    };
    timeCheckingIn?: string | null;
    timeCheckingOut?: string | null;
    productId: number;
    productPageUri?: string;
    productType?: string;
    specs?: SharedTypes.QueryProductSpec[];
    valueProps?: SharedTypes.QueryProductProp[];
  };

  export type QueryGTEStay = {
    available: boolean;
    cartItemId?: string;
    childrenAges: number[];
    currency?: string;
    discountAmount?: number;
    discountAmountPriceObject?: SharedTypes.PriceObject;
    discountPercentage?: number;
    editable: boolean;
    id?: string;
    imageUrl?: string;
    isForVacationPackage: boolean;
    product?: QueryStayProductCartProduct;
    rooms?: QueryStayProductCartRoom[];
    title?: string;
    totalNumberOfAdults: number;
    totalNumberOfChildren: number;
    totalPrice: number;

    createdTime: SharedTypes.iso8601DateTime;
    updated: SharedTypes.iso8601DateTime;
    dateCreated: SharedTypes.iso8601DateTime;
    dateUpdated: SharedTypes.iso8601DateTime;
    dateCheckingIn: SharedTypes.iso8601DateTime;
    dateCheckingOut: SharedTypes.iso8601DateTime;
    from: SharedTypes.iso8601DateTime;
    to: SharedTypes.iso8601DateTime;
    priceObject: SharedTypes.PriceObject;
  };

  export type QueryStay = {
    id: number;
    productId: number;
    address?: string;
    uri: string;
    type?: string;
    numberOfGuests: number;
    numberOfAdults: number;
    numberOfChildren: number;
    childrenAges?: number[];
    valueProps?: SharedTypes.QueryProductProp[];
    rooms?: CartStaysRoom[];
    specs: SharedTypes.QueryProductSpec[];
    title?: string;
    cartItemId: string;
    totalPrice: number;
    discountAmount?: number;
    discountAmountPriceObject?: SharedTypes.PriceObject;
    discountPercentage?: number;
    imageUrl?: string;
    available: boolean;
    editable: boolean;
    cancellationString?: string;
    from?: SharedTypes.iso8601DateTime;
    to?: SharedTypes.iso8601DateTime;
    updated?: SharedTypes.iso8601DateTime;
    createdTime?: SharedTypes.iso8601DateTime;
    cancellationPolicy?: SharedTypes.iso8601DateTime;
    cityOsmId?: number;
    cityName?: string;
    countryOsmId?: number;
    countryName?: string;
    priceObject: SharedTypes.PriceObject;
  };

  export type QueryStayConstructBase = {
    title?: string;
    from: Date;
    to: Date;
    updated: Date;
    createdTime: Date;
    clientRoute: SharedTypes.ClientRoute;
    linkUrl: string;
    imageUrl?: string;
    productId: number;
  };

  export type QueryStayConstruct = Omit<
    OrderTypes.QueryStay,
    "from" | "to" | "updated" | "createdTime"
  > &
    QueryStayConstructBase;

  export type QueryGTEStayConstruct = Omit<
    OrderTypes.QueryGTEStay,
    "from" | "to" | "updated" | "createdTime"
  > &
    QueryStayConstructBase;

  export type StaySearchUrl = Pick<
    QueryStayConstruct,
    "from" | "to" | "rooms" | "address" | "cityOsmId" | "cityName" | "countryOsmId" | "countryName"
  >;

  export type GTEStaySearchUrl = Pick<
    QueryGTEStayConstruct,
    "from" | "to" | "totalNumberOfAdults" | "totalNumberOfChildren" | "rooms" | "product"
  >;

  export type QueryPaymentLinkProduct = {
    invoiceNumber?: string;
    bookingId?: string;
    expiresAt?: SharedTypes.iso8601DateTime;
    type?: import("../../../features/Cart/types/cartEnums").OrderPayByLinkType;
    pickupLocation?: string;
    deliveryDate?: SharedTypes.iso8601DateTime;
    numberOfTravelers?: number;
  };

  export type QueryCustomProduct = {
    date: SharedTypes.iso8601DateTime;
    totalPrice: number;
    editable: boolean;
    available: boolean;
    description: string;
    discountAmount: number;
    discountAmountPriceObject?: SharedTypes.PriceObject;
    title?: string;
    discountPercentage: number;
    price: number;
    imageUrl?: string;
    options?: {
      attachments: string[];
      includedKm: { km: number; unlimited: boolean } | null;
      quantity: number;
      pickup: string | null;
      dropoff: string | null;
      flightNumber: string | null;
      travelers: string | null;
      email: string | null;
      phone: string | null;
    };
    days: number | null;
    createdTime: SharedTypes.iso8601DateTime;
    currency: string;
    from: SharedTypes.iso8601DateTime;
    id: string;
    to: SharedTypes.iso8601DateTime;
    updated: SharedTypes.iso8601DateTime;
    cartItemId: string;
    isPaymentLink: boolean;
    priceObject: SharedTypes.PriceObject;
  } & QueryPaymentLinkProduct;

  export type QueryCustomsConstruct = Omit<
    OrderTypes.QueryCustomProduct,
    "from" | "to" | "updated" | "createdTime" | "date"
  > & {
    date: Date;
    from: Date;
    to: Date;
    updated: Date;
    createdTime: Date;
  };

  export type QueryGTETour = {
    id: number;
    productCode: string;
    productOptionCode?: string;
    linkUrl: string;
    paxMix: GTETourBookingWidgetTypes.AgeBand[];
    languageGuide?: {
      language: string;
      type: string;
    };
    extras: QueryToursExtras[];
    durationSec: number;
    durationText?: null | string;
    pickup: string;
    advancedNoticeSec: number;
    bookingRef: string;
    startTime: string;
    title: string;
    cartItemId: string;
    totalPrice: number;
    imageUrl: string;
    available: boolean;
    editable: boolean;
    currency: string;
    valueProps: SharedTypes.QueryProductProp[];
    bookingQuestionAnswers: GTETourBookingWidgetTypes.MutationBookingQuestionAnswer[];
    startingLocation?: {
      locationName: string;
    };
    createdTime: SharedTypes.iso8601DateTime;
    from: SharedTypes.iso8601DateTime;
    to: SharedTypes.iso8601DateTime;
    updated: SharedTypes.iso8601DateTime;
    priceObject: SharedTypes.PriceObject;
    guidedLanguage?: GTETourBookingWidgetTypes.TourOptionLanguage & {
      language: string;
    };
    endingLocation?: {
      locationName: string;
    };
    type?: string;
    discountAmount?: number;
    discountAmountPriceObject?: SharedTypes.PriceObject;
    discountPercentage?: number;
    option?: {
      id: number;
      title?: null | string;
    };
  };

  export type QueryVacationPackageProduct = {
    id: string;
    title?: string;
    cartItemId: string;
    imageUrl: string;
    totalPrice: number;
    editable: boolean;
    available: boolean;
    discountAmount?: number;
    discountAmountPriceObject?: SharedTypes.PriceObject;
    discountPercentage?: number;
    currency: string;
    flights: OrderTypes.QueryFlightItineraryCart[];
    cars: OrderTypes.QueryCarRental[];
    stays: OrderTypes.QueryStay[];
    gteStays: OrderTypes.QueryGTEStay[];
    toursAndTickets: OrderTypes.QueryGTETour[];
    startPlace?: string;
    endPlace?: string;
    createdTime: SharedTypes.iso8601DateTime;
    expiredTime: SharedTypes.iso8601DateTime;
    from: SharedTypes.iso8601DateTime;
    to: SharedTypes.iso8601DateTime;
    updated: SharedTypes.iso8601DateTime;
    searchLink?: string;
    children: number;
    infants: number;
    adults: number;
    priceObject: SharedTypes.PriceObject;
  };

  export type QueryVacationPackageConstruct = Omit<
    OrderTypes.QueryVacationPackageProduct,
    | "from"
    | "to"
    | "updated"
    | "createdTime"
    | "flights"
    | "cars"
    | "stays"
    | "expiredTime"
    | "toursAndTickets"
  > & {
    flights: OrderTypes.CartFlightItinerary[];
    cars: OrderTypes.CarRental[];
    gteStays: OrderTypes.QueryGTEStayConstruct[];
    stays: OrderTypes.QueryStayConstruct[];
    toursAndTickets: OrderTypes.QueryGTETour[];
    createdTime: Date;
    expiredTime: Date;
    from: Date;
    to: Date;
    updated: Date;
  };

  export type VoucherSection = {
    label: string;
    values: (string | React.ReactNode)[];
    shouldStartFromNewLine?: boolean;
    isEmptySection?: boolean;
    subtitles?: VoucherSection[] | null[];
    isExtras?: boolean;
  };

  export type VoucherProduct = {
    title: string;
    sections: VoucherSection[];
  };

  export type CustomerInfo = {
    name: string;
    surname?: string;
    email?: string;
    phoneNumber?: string;
    nationality: string;
    companyId?: string;
    companyName?: string;
    companyAddress?: string;
    termsAgreed: boolean;
  };

  export type Tour = Omit<QueryTour, "tourId" | "advanceNoticeSec"> & {
    id: string;
    from: Date;
    to: Date;
    createdTime: Date;
    updated: Date;
    numberOfTravelers: number;
    clientRoute: SharedTypes.ClientRoute;
    editLinkUrl: string;
  };

  export type GTETour = QueryGTETour & {
    from: Date;
    to: Date;
    createdTime: Date;
    updated: Date;
    numberOfTravelers: number;
    clientRoute: SharedTypes.ClientRoute;
    editLinkUrl: string;
  };

  export type TourSearchUrl = Pick<Tour, "adults" | "children" | "from" | "to"> & {
    startingLocationId?: string;
    category?: {
      id?: number;
      name?: string;
      uri?: string;
    };
  };

  export type MarketplacePhoneNumber = {
    phone: string;
    isTollFree: boolean;
    country: {
      alpha2Code: string;
      flag: {
        id: string;
        url: string;
        name: string;
      };
    }[];
  };
  export type MarketplaceInformation = {
    contactEmail: string;
    helpCenterTimePeriod: {
      value: string;
    };
    phoneNumbers: MarketplacePhoneNumber[];
  };
}
