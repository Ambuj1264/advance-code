declare namespace VacationPackageTypes {
  import { VPPriceChange, VPPriceType } from "./VPProductPageEnums";

  type Name = {
    value: string;
  };

  type IncludedItems = {
    id: string;
    title: string;
    icon: SharedTypes.GraphCMSIcon;
  };

  type Quickfact = {
    id: string;
    quickfactId: string;
    title: string;
    name: Name;
    icon: SharedTypes.GraphCMSIcon;
    information?: SharedTypes.ProductSpecInfo;
  };

  type QuickfactsList = {
    quickfacts: Quickfact[];
  };

  type IconItem = {
    id: string;
    title: Name;
    icon: SharedTypes.GraphCMSIcon;
  };

  export type ValueProp = {
    title: string;
    icon: {
      handle: string;
      svgAsString: string;
    };
  };

  type VPDestinationInfo = {
    id: number;
    title: string;
    attractionLandingPages: TravelStopTypes.QueryGraphCMSAttraction[];
    destination: TravelStopTypes.QueryGraphCMSDestination;
    numberOfNights: number;
  };

  type QueryVacationPackageDay = {
    id: string;
    title: string;
    description?: string | null;
    staysDestinationId?: number;
    attractionLandingPages: TravelStopTypes.QueryGraphCMSAttraction[];
    destinationLandingPages: TravelStopTypes.QueryGraphCMSDestination[];
  };

  type VacationPackageDay = {
    id: string;
    region: string;
    description?: string;
    attractions: TravelStopTypes.TravelStops[];
    destinations: TravelStopTypes.TravelStops[];
    attractionsMapData?: SharedTypes.Map;
  };

  type VPProductSubtype =
    import("components/features/VacationPackages/utils/vacationPackagesUtils").VacationPackageVpType;

  type VisitedPlaceImages = {
    mainImage?: SharedTypes.GraphCMSAsset;
    images: SharedTypes.GraphCMSAsset[];
  }[];
  type QueryVacationPackageContent = {
    id: string;
    tripId: string;
    isDeleted?: boolean;
    title: string;
    dayData?: {
      days?: any;
      nights?: any;
    }[];
    cheapestMonth?: string;
    images: SharedTypes.GraphCMSAsset[];
    staticMap?: SharedTypes.GraphCMSAsset;
    description: string;
    metadataUri: string;
    canonicalUrl: string;
    fromPrice: number;
    quickfactsList: QuickfactsList;
    includedList: {
      includedItems: IncludedItems[];
    };
    valuePropsList: {
      valueProps: ValueProp[];
    };
    destinations: TravelStopTypes.QueryGraphCMSDestination[];
    vacationPackageAttractions: TravelStopTypes.QueryGraphCMSAttraction[];
    location: {
      latitude: number;
      longitude: number;
    };
    reviewCount: number;
    reviewScore: number;
    vacationPackageDays: QueryVacationPackageDay[];
    url?: string;
    slug?: string;
    startPlace?: LandingPageTypes.Place;
    endPlace?: LandingPageTypes.Place;
    startsIn?: string;
    endsIn?: string;
    available?: string;
    subType?: {
      subtype?: VPProductSubtype;
    };
    hreflangs: Hreflang[];
    travelplanMetadata?: {
      versions?: {
        objectid?: string;
        revision?: string;
        envelopeId?: string;
        variationId?: string;
      };
    };
    visitedPlaces?: VisitedPlaceImages;
  };

  type QueryVacationPackage = {
    cartLink: string;
    vacationPackagesProductPages: QueryVacationPackageContent[];
  };

  type VacationPackageResult = {
    id: string;
    tripId: string;
    isDeleted?: boolean;
    title: string;
    description: string;
    metadataUri: string;
    canonicalUrl: string;
    fromPrice: number;
    days: number;
    nights?: number;
    cheapestMonth?: string;
    images: ImageWithSizes[];
    productSpecs: VacationPackageTypes.Quickfact[];
    productProps: ValueProp[];
    includedList: IncludedItems[];
    mapData?: SharedTypes.Map;
    vpDestinationsInfo: VPDestinationInfo[];
    vacationPackageAttractions: TravelStops[];
    vacationPackageDestinations: TravelStops[];
    reviewCount: number;
    reviewScore: number;
    vacationPackageDays: VacationPackageTypes.VacationPackageDay[];
    startPlace?: LandingPageTypes.Place;
    endPlace?: LandingPageTypes.Place;
    startsIn?: string;
    endsIn?: string;
    available?: string;
    hreflangs: Hreflang[];
    subType?: VPProductSubtype;
    tripDatabaseId?: string;
    variationId?: string;
    envelopeId?: string;
  };

  type TranslateOptions = {
    startsIn?: string;
    endsIn?: string;
    startTime?: string;
    endTime?: string;
    days: number;
    nights?: number;
    Available?: string;
    flightClass?: string;
    pickupDestination?: string;
    dropoffDestination?: string;
    carType?: string;
  };

  type VacationFlightItinerary = FlightSearchTypes.FlightItinerary & {
    flightRanking: import("types/enums").FlightRanking;
    isSelected?: boolean;
    vpPrice?: number;
  };

  type CarSubTypesQueryResult = {
    subTypes: CarSubTypesQueryResultContent[];
  };

  type VPPlaceholderCar = {
    id: string;
    subtype: string;
    image: Image;
    carSpecs: SharedTypes.ProductSpec[];
    Icon: React.ElementType;
    price?: number;
  };

  type VPCarSearch = {
    vpPrice?: number;
    Icon: React.ElementType;
    subtype: string;
    fallBackImg: ImageWithSizes;
  } & CarSearchTypes.CarSearch;

  type VPFlightSearchVariable = {
    requestId: string;
    preFetchRequestId: string;
    vacationPackageId: string;
    adults: number;
    children: number;
    infants: number;
    departureTime: string;
    flyFrom: string;
    cabinType: FlightSearchTypes.CabinType;
    flightType: FlightSearchTypes.FlightType;
    isMobile: boolean;
    usePrefetch?: boolean;
  };

  export type VPFlightSearchResult = {
    searchId: string;
    resultCount: number;
    itineraries: FlightSearchTypes.QueryFlightItinerary[];
  };

  type VPFlightSearchResults = {
    vacationPackageFlightSearch: VPFlightSearchResult;
  };

  type CarSearchQueryFilters = {
    vacationPackageId: string;
    requestId: string;
    preFetchRequestId: string;
    sourceCountry: string;
    driverAge: string;
    from: string;
    originId?: string;
    isMobile: boolean;
    usePrefetch?: boolean;
  };

  type FlightPassengerInput = {
    baggage?: string[];
  };

  type FlightIteneraryType = {
    flightCheckFlight: {
      availableBaggages: FlightTypes.QueryBaggage[];
    } & { flightsChecked: boolean };
  };

  type FlightPriceInput = {
    bookingToken: string;
    numberOfBags: number;
    numberOfPassengers?: number;
    passengers?: FlightPassengerInput[];
    selected: boolean;
  };

  type CarPriceInput = {
    extras: CarBookingWidgetTypes.SelectedExtra[];
    insurances: string[];
    offerReference?: string;
    selected: boolean;
  };

  type StayValueInput = {
    productId: number;
    selected: boolean;
    availabilityId: string;
  };

  type TourValueInput = {
    productCode: string;
    optionCode?: string;
    startTime?: string;
    paxMix: GTETourBookingWidgetTypes.AgeBand[];
  };

  type StaysPriceInput = {
    // the key is the day value, starting from 1.
    key: number;
    value: StayValueInput[];
  };

  type ToursPriceInput = {
    // the key is the day value, starting from 1.
    key: number;
    value: TourValueInput[];
  };

  type QueryCalculatePriceInput = {
    requestId: string;
    tripId?: string;
    from: string;
    adults: number;
    children: number;
    infants: number;
    flights: FlightPriceInput[];
    cars: CarPriceInput[];
    staysV2: StaysPriceInput[];
    tours: ToursPriceInput[];
    flightIncluded: boolean;
  };

  type CalcTranslationKeys = {
    keys: CalcTranslationKey[];
  };

  type CalcTranslationKey = {
    key: string;
    variables: CalcTranslationVariable[] | null;
  };

  type CalcTranslationVariable = {
    key: string;
    value: string;
  };

  type PayOnArrival = {
    id: string | null;
    name: string | null;
    currency: string;
    quantity: number;
    pricePerUnit: number;
    pricePerUnitDisplay: string | null;
    totalPrice: number;
    totalPriceDisplay: string | null;
    isMaxAmount: boolean;
    isMinAmount: boolean;
    translationKeys: CalcTranslationKeys;
  };

  type FlightPrice = {
    bookingToken?: string;
    flightPrice: number;
    bagPrice: number;
    itineraryId?: string;
  };

  type CarPrice = {
    offerValid: boolean;
    offerReference?: string;
    totalPrice: number;
    totalOnArrival: number;
    payOnArrival?: PayOnArrival[];
  };

  type StayPriceAvailability = {
    availabilityId: string;
    price: number;
    selected: boolean;
  };

  type StayPriceValue = {
    productId: number;
    price: number;
    selected: boolean;
    roomCombinations: StayBookingWidgetTypes.QueryRoomCombination[];
  };

  type StayPrice = {
    key: number;
    value: StayPriceValue[];
  };

  type VPCalculatePriceQuery = {
    calculateVacationPackagePrice: {
      amount: number;
      currency?: string;
      flightIncluded: boolean;
      carIncluded: boolean;
      staysIncluded: boolean;
      priceType: VPPriceType;
      priceChange: VPPriceChange;
      flightPrices?: FlightPrice[];
      carPrices?: CarPrice[];
      stayPrices?: StayPrice[];
    };
  };

  type VacationPackageQuickFact = {
    icon?: {
      handle?: string;
    };
    name?: {
      value: string;
    };
    title?: string | null;
  };

  type Price = {
    currency: string;
    value: number;
  };

  type CommonVacationPackageStayProduct = {
    day: number;
    groupedWithDays: number[];
    hotelRegionId: number;
    productId: number;
    name?: string;
    rating: number;
    userRatingsTotal: number;
    lat: number;
    lng: number;
    address?: string;
    starClass: number;
    productType?: string;
    neighborhood?: string;
    price: number;
    currency?: string;
    type: string;
    mainImage?: SharedTypes.GraphCMSAsset;
    description?: string;
    distanceFromCenter: number;
    checkInTime?: string;
    checkOutTime?: string;
    dateCheckingIn?: string;
    dateCheckingOut?: string;
    quickFacts?: VacationPackageQuickFact[];
    vpPrice?: number;
    selected: boolean;
    subtype?: string;
    numberOfGuests?: number;
    roomTypes?: string;
  };

  type VacationPackageStayProduct = CommonVacationPackageStayProduct & {
    roomCombinations: StayBookingWidgetTypes.RoomCombination[];
  };

  type QueryVacationPackageStayProduct = CommonVacationPackageStayProduct & {
    roomCombinations: StayBookingWidgetTypes.QueryRoomCombination[];
  };

  type VPStaysSearchResponse = {
    products: QueryVacationPackageStayProduct[];
  };

  type VPStaysSearchQueryResponse = {
    vacationPackageStaysSearch: VPStaysSearchResponse;
  };

  type CarOfferQueryType = {
    id: "default" | string;
    results: {
      resultCount: number;
      offers?: CarSearchTypes.QueryCarSearch[];
      filters: CarSearchTypes.CarFilter[];
    };
  };

  type VPCarsSearchQueryResponse = {
    carOffers: CarOfferQueryType[];
  };

  type StaysSearchQueryParams = {
    requestId: string;
    vacationPackageId?: string;
    occupancies: StayBookingWidgetTypes.Occupancy[];
    from: string;
    isMobile: boolean;
  };

  type MutationAddVpToCartData = {
    addVacationPackageToCart: {
      success: boolean;
      message: string;
    };
  };

  type MutationAddVpToCartInput = {
    id: string;
    requestId: string;
    from: string;
    to: string;
    adults: number;
    children: number;
    infants: number;
    paxMix: StayBookingWidgetTypes.Occupancy[];
    flights: FlightTypes.MutationAddFlightToCartInput[] | [];
    cars?: CarTypes.MutationGTEAddCarToCartInput[];
    stayProducts: StayBookingWidgetTypes.MutationAddStayProductToCartInput[];
    toursAndTickets: GTETourBookingWidgetTypes.MutationAddGTETourToCartInput[];
    originCountryCode: string;
    originId?: string;
    originName?: string;
    carPickupId?: string;
  };

  type VpFlightAddToCartData = {
    passengers: FlightTypes.PassengerDetails[];
    bookingToken: string;
  };

  type VpAddToCartData = {
    vacationProductId: string;
    requestId: string;
    dateFrom: Date;
    dateTo: Date;
    occupancies: StayBookingWidgetTypes.Occupancy[];
    flightData?: VpFlightAddToCartData;
    carData?: CarTypes.AddCarGTEToCartData;
    staysData: StayBookingWidgetTypes.MutationAddStayProductToCartInput[];
    originCountryCode: string;
    originId?: string;
    originName?: string;
    selectedTours: GTETourBookingWidgetTypes.MutationAddGTETourToCartInput[];
    currencyCode: string;
    carPickupId?: string;
  };

  type SelectedVPStaysRoomType = {
    productId: number;
    day: number;
    groupedWithDays: number[];
    title: string;
    fromPrice: number;
    dateCheckingIn: string;
    dateCheckingOut: string;
    roomCombinations: StayBookingWidgetTypes.RoomCombination[];
  };

  type SelectedToursProductIds = {
    day: number;
    productId: string;
    optionCode?: string;
    startTime?: string;
    optionName: string;
    numberOfTravelers: number;
    durationInMinutes: number;
  };

  type QueryVPInvalidMonths = {
    invalidMonths: { from: string; to: stirng }[] | undefined;
  };

  type ToursSearchInput = {
    requestId: string;
    vacationPackageId?: string;
    adults: number;
    children: number;
    infants?: number;
    from: string;
  };

  type VPSearchTourQuery = {
    id: number;
    productCode: string;
    linkUrl?: string;
    name?: string;
    description?: string;
    image?: SharedTypes.GraphCMSAsset;
    likelyToSellOut: boolean;
    reviewScore: number;
    reviewCount?: number;
    price: number;
    durationInMinutes: number;
    timeFrom: number;
    timeTo: number;
    valuePropsList?: {
      valueProps: GTETourSearchTypes.QueryValueProp[];
    };
    quickFactVariables?: {
      startPlace?: string;
      languages?: string[];
      difficulty?: string;
      available?: string;
      minimumAge: number;
      duration?: string;
    };
    quickFactList?: QuickfactsList;
  };

  type VPToursQueryDay = {
    dayNumber: number;
    tours: VacationPackageTypes.VPSearchTourQuery[];
  };

  type VPToursQueryResult = {
    vacationPackageTourSearch: {
      days: VPToursQueryDay[];
    };
  };

  type ToursSearchResult = {
    dayNumber: number;
    tours: SharedTypes.Product[];
  }[];

  type BaggageTextObject = {
    [key: string]: number;
  };

  type originInputRef = {
    openDropdown: () => void;
  } | null;

  type dateInputRef = {
    toggleCalendarCb: () => void;
  } | null;

  type VpFiltersWhere = {
    and?: {
      days: {
        some: {
          dayAttractions: { some: { attractionId: { in: string[] } } };
        };
      };
    };
    days?: {
      some: {
        dayAttractions?: { some: { attractionId: { in: string[] } } };
        dayDestinations?: {};
      };
    };
    subType?: { in: string[] };
    countryCode?: { in: string[] };
    numberOfDays?: { in: number[] };
    variation?: { eq?: string; in?: string[] };
  };
}
