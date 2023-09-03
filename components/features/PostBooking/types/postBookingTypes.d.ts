import { ApolloError } from "apollo-client";

import {
  ITINERARY_SEGMENT_TYPE,
  PB_CARD_TYPE,
  PB_ITINERARY_ICON_TYPE,
  ITINERARY_MAP_ITEM_TYPE,
  PB_ITINERARY_TRAVELMODE_TYPE,
  ITINERARY_TOUR_DIFFICULTY,
  PB_TICKET_TYPE,
} from "components/features/PostBooking/types/postBookingEnums";

declare namespace PostBookingTypes {
  type PB_TICKET = {
    url: string;
    type: PB_TICKET_TYPE;
  };

  type ProductCard = {
    type: PB_CARD_TYPE;
    rating: number;
    reviewsCount: number;
    id: number | string;
    isExpired: boolean;
    heading: string;
    title: string;
    image?: string;
    placeImage?: string;
    photoReference?: string;
    bookingReference?: string;
    quickfacts: SharedTypes.QuickFact[];
    coords?: {
      lat?: number;
      lon?: number;
    };
    streetViewEnabled?: boolean;
    phoneno?: string;
    bookingId?: number;
    orderId?: number;
    googlePlaceId?: string;
    ticket?: PB_TICKET;
    tourId?: string;
    travelMode?: PB_ITINERARY_TRAVELMODE_TYPE;
  };

  type ItinerarySegmentContent = {
    index: number;
    icon?: PB_ITINERARY_ICON_TYPE;
    travelMode?: PB_ITINERARY_TRAVELMODE_TYPE;
    travelDuration?: string;
    travelDistanceInMeters?: number;
    title?: string;
    text?: string;
    date?: Date;
    iconAlpha2CountryCode?: string;
    iconAlpha3CountryCode?: string;
    cards?: ItineraryCard[];
  };

  type ItineraryCard = {
    id: string;
    bookingId: number;
    address?: string;
    airlineName?: string;
    // flight arrival;
    arrivalAirportCode?: string;
    arrivalAirportName?: string;
    arrivalCityName?: string;
    arrivalDate?: string;

    // flight departure;
    departureAirportCode?: string;
    departureAirportName?: string;
    departureCityName?: string;
    departureDate?: string;

    attractionName?: string;

    // flight bags
    bagsCarried?: number;
    bagsChecked?: number;
    bagsInCabin?: number;
    boardingPassButtonUrl?: string;
    eTicketUrl?: string;

    bookingNumber?: string;

    isBreakfastIncluded: boolean;
    budget?: string;
    cardType: PB_CARD_TYPE;

    dateOfCheckin?: string;
    dateOfCheckout?: string;

    cityName?: string;
    countryName?: string;
    travelDistanceInMeters?: number;

    dateOfDropoffFrom?: string;
    dateOfDropoffTo?: string;
    dateOfPickupFrom?: string;
    dateOfPickupTo?: string;
    dropOffLocation?: string;
    entrance?: string;
    flightNumber?: string;

    numberOfAdults?: number;
    numberOfChildren?: number;
    numberOfInfants?: number;
    icon?: PB_ITINERARY_ICON_TYPE;
    imageUrl?: string;
    imageHandle?: string;

    inceptionDay?: number;
    inceptionMonth?: number;
    inceptionYear?: number;

    name?: string;

    timeOpens?: string;
    timeCloses?: string;
    tourId?: string;

    pickUpLocation?: string;

    populationCount?: number;
    populationYear?: number;
    region?: string;

    roomTypes?: string[];
    size?: string;
    timeToSpend?: string;
    timezone?: string;
    type?: string;
    travelMode?: PB_ITINERARY_TRAVELMODE_TYPE;
    latitude?: number;
    longitude?: number;
    phoneNumber?: string;
    googlePlace?: {
      googlePlaceId?: string;
      latitude: number;
      longitude: number;
      userRatingAverage: number;
      userRatingCount: number;
      photoReference?: string;
    };
    difficulty?: ITINERARY_TOUR_DIFFICULTY;
    startingLocation?: string;
    voucherUrl?: string;

    orderId?: number;
    isExpired?: boolean;
    carRentalSummary?: string;
    dateOfVacationEnd?: string;
    dateOfVacationStart?: string;
    hasCarRentals?: boolean;
    hasFlights?: boolean;
    numberOfSeniors?: number;
    numberOfStayNights?: number;
    numberOfTravelers?: number;
    numberOfYouths?: number;
    startingTime?: string;
    timeOfCheckin?: string;
    timeOfCheckout?: string;
  };

  type ItinerarySegment = {
    index: number;
    segmentType: ITINERARY_SEGMENT_TYPE;
    content?: ItinerarySegmentContent[];
  };

  type ItineraryDay = {
    date: string;
    dayNumber: number;
    segments?: ItinerarySegment[];
  };

  type QueryItinerary = {
    itinerary?: {
      title?: string;
      days?: ItineraryDay[];
    };
  };

  type QueryVacationReservations = {
    vacationPacakgeReservations?: ItineraryCard[];
  };

  type ItineraryMapItem = {
    type: ITINERARY_MAP_ITEM_TYPE;
    latitude: number;
    longitude: number;
    id: number;
    orm_name?: string;
  };

  type QueryItineraryMap = {
    itineraryMap?: ItineraryMapEntry[];
  };

  type ItineraryMapEntry = {
    date: string;
    dayNumber: number;
    items: ItineraryMapItem[];
  };

  type NavigationDay = {
    dateWithoutTimezone: Date;
    dayNumber: number;
  };

  type QueryCarVoucher = {
    carVoucher: {
      bookingDetails: {
        bookingNumber?: string;
        bookingDate: string;
        externalBookingId?: string;
        voucherInfo?: VoucherInfo[];
      };
      travelersDetails: {
        name?: string;
        email?: string;
        phoneNumber?: string;
        nationality?: string;
      };
      serviceDetails: {
        numberOfDays: number;
        pickUpLocation?: string;
        pickUpTime: string;
        dropOffLocation?: string;
        supplier?: string;
        provider?: string;
        dropOffTime: string;
        pickUpInformation?: string;
        dropOffInformation?: string;
        numberOfDrivers: number;
        pickup?: CarVoucherPickUp;
        dropOff?: CarVoucherPickUp;
        serviceLevel?: string;
        rentedCarType?: string;
        category?: string;
        emergencyPhoneNumber?: string;
        extras?: CarVoucherExtras[];
        insurances?: CarVoucherExtras[];
        priceOnArrival: number;
      };
      paymentDetails: VoucherPaymentDetails;
    };
  };

  type VoucherInfo = {
    id: number;
    voucherId?: string;
    url?: string;
    created: string;
  };

  type CarVoucherPickUp = {
    address?: string;
    streetNumber?: string;
    cityName?: string;
    postalCode?: string;
    state?: string;
    country?: string;
    phoneNumber?: string;
    additionalParkInfo?: string;
    counterLocation?: string;
    lat?: string;
    lng?: string;
    price: number;
    openingHours?: CarVoucherOpeningHours[];
    locationId: number;
    isPickup: boolean;
    specifyFlight: boolean;
    code?: string;
    extendedLocationCode?: string;
    name?: string;
    cityId?: string;
    airportId?: string;
  };

  type CarVoucherOpeningHours = {
    isOpen: boolean;
    openFrom?: string;
    openTo?: string;
    dayOfWeek: number;
  };

  type VoucherPaymentDetails = {
    totalPrice: number;
    currency?: string;
    vatAmount?: number;
    vatPercentage?: number;
    priceBreakDown?: VoucherPriceBreakDown[];
    payOnArrival?: VoucherPriceBreakDown[];
    priceOnArrival?: number;
    available?: boolean;
  };

  type VoucherPriceBreakDown = {
    name?: string;
    currency?: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    isMinAmount: boolean;
    isMaxAmount: boolean;
    includeInBasePrice: boolean;
    type?: string;
    priceObject: SharedTypes.PriceObject;
  };

  type CarVoucherExtras = {
    id?: string;
    name?: string;
    price: number;
    count: number;
  };

  type StayVoucherRoomDetails = {
    id?: number;
    externalId?: string;
    availabilityId?: string;
    name?: string;
    mealType?: string;
    cancellationType?: string;
    dateFreeCancellationUntil?: string;
  };

  type CommonStayVoucherInfo = {
    bookingDetails: {
      bookingNumber?: string;
      dateBooked: string;
      externalBookingId?: string;
      voucherInfo?: {
        created: string;
        id: number;
        productId: number;
        url?: string;
        voucherId?: string;
      }[];
    };
    travelersDetails: {
      name?: string;
      email?: string;
      phoneNumber?: string;
      country?: string;
    };
    serviceDetails: {
      numberOfNights: number;
      numberOfGuests: number;
      numberOfAdults: number;
      numberOfChildren: number;
      childrenAges: number[];
      checkIn: string;
      checkOut: string;
      timeOfCheckin?: string;
      timeOfCheckout?: string;
      address?: string;
      cityName?: string;
      countryName?: string;
      title?: string;
      type?: string;
      starRating: number;
      rooms?: StayVoucherRoom[];
      specs?: {
        iconId?: string;
        name?: string;
        value?: string;
      }[];
      cancellationPolicy?: string;
      cancellationPolicyString?: string;
    };
    paymentDetails: VoucherPaymentDetails;
    roomDetails?: StayVoucherRoomDetails[];
  };

  type QueryStayVoucher = {
    stayVoucher: CommonStayVoucherInfo;
  };
  type QueryStayProductVoucher = {
    stayProductVoucher: CommonStayVoucherInfo;
  };

  type StayVoucherRoom = {
    id: number;
    type?: string;
    name?: string;
    privateBathroom: boolean;
    size: number;
    maxPersons: number;
    roomBookings?: StayVoucherRoomBooking[];
  };

  type StayVoucherRoomBooking = {
    extraBedCount: number;
    adults: number;
    children: number;
    mesh?: string;
    requestId?: string;
    source?: string;
    masterRateCode?: string;
    productId: number;
    breakfast: boolean;
    childrenAges: number[];
    cancellationPolicies?: StayVoucherRoomBookingCancellationPolicies[];
    extras: StayVoucherRoomBookingExtras[];
  };

  type StayVoucherRoomBookingCancellationPolicies = {
    dateFrom: string;
    dateTo: string;
    price: {
      currency?: string;
      value: number;
    };
  };

  type StayVoucherRoomBookingExtras = {
    id: number;
    name: string;
    price: number;
    childPrice: number;
    isRequired: boolean;
    chargeType?: string;
    value?: string;
    count: number;
  };

  type QueryStayVoucherExtras = {
    id: string;
    name?: string;
    price: number;
    childPrice: number;
    isRequired: boolean;
    chargeType?: string;
    value?: string;
  };

  type QueryFlightVoucher = {
    flightVoucher: {
      bookingDetails: {
        bookingNumber?: string;
        dateBooked: string;
        externalBookingId?: string;
        voucherInfo?: VoucherInfo[];
      };
      travelersDetails: {
        name?: string;
        email?: string;
        nationality?: string;
        phoneNumber?: string;
      };
      serviceDetails: {
        numberOfNights: number;
        arrivalCity?: string;
        travelers?: {
          adults: number;
          infants: number;
          children: number;
          totalPassengersCount: number;
        };
        departureRoute?: QueryFlightRoute[];
        returnRoute?: QueryFlightRoute[];
        baggage?: QueryFlightBaggage[];
      };
      paymentDetails: VoucherPaymentDetails;
    };
  };

  type QueryFlightPayment = {
    totalPrice: number;
    currency?: string;
    vatAmount?: number;
    vatPercentage?: number;
    priceBreakDown?: VoucherPriceBreakDown[];
    payOnArrival?: VoucherPriceBreakDown[];
  };

  type QueryTourVoucher = {
    tourVoucher: {
      bookingDetails: {
        bookingNumber?: string;
        dateBooked: string;
        voucherInfo?: {
          created: string;
          id: number;
          url?: string;
          voucherId?: string;
        }[];
      };
      serviceDetails: {
        title: string;
      };
      paymentDetails: VoucherPaymentDetails;
      travelersDetails: {
        nationality?: string;
        email?: string;
        name?: string;
        phoneNumber?: string;
      };
    };
  };

  type Airline = {
    code?: string;
    name?: string;
    imageUrl?: string;
  };

  type QueryFlightRoute = {
    localDeparture: string;
    localArrival: string;
    utcDeparture: string;
    utcArrival: string;
    checkin: string;
    durationSec: number;
    layOverSec: number;
    guarantee: boolean;
    bagsRecheckRequired: boolean;
    flightNumber?: string;
    price: number;
    fareCategory?: string;
    flyFrom?: QueryFlightPlaceInfo;
    flyTo?: QueryFlightPlaceInfo;
    airline?: Airline;
    operatingAirline?: Airline;
    countryFrom?: QueryFlightPlaceInfo;
    countryTo?: QueryFlightPlaceInfo;
    cityFrom?: QueryFlightPlaceInfo;
    cityTo?: QueryFlightPlaceInfo;
  };

  type QueryFlightPlaceInfo = {
    code?: string;
    name?: string;
  };

  type QueryFlightBaggage = {
    id: number;
    price: number;
    category: string;
    dimensionsSum: number;
    weight: number;
    length: number;
    height: number;
    width: number;
    count: number;
  };

  type UnionPBInfoModalDataType =
    | QueryCarVoucher
    | QueryStayVoucher
    | QueryStayProductVoucher
    | QueryFlightVoucher
    | QueryAttraction
    | QueryTourVoucher
    | undefined;

  type QueryInfoModalVariables = {
    variables: {
      input?: {
        orderId?: string | number;
        carBookingId?: string | number;
        flightBookingId?: number;
        stayBookingId?: string | number;
      };
      where?: {
        attractionId?: string;
      };
      locale?: string;
    };
  };

  type QueryAttraction = {
    attractionLandingPage: TravelStopTypes.QueryGraphCMSAttraction;
  };

  type PBInfoModalData = {
    data?: UnionPBInfoModalDataType;
    loading?: boolean;
    error?: ApolloError;
  };

  type QueryUserReservationsVacationPackage = {
    title?: string;
    card?: ItineraryCard;
    reservationCards?: ItineraryCard[];
  };

  type QueryUserReservations = {
    userReservations: {
      reservationCards?: ItineraryCard[];
      vacationPackages?: QueryUserReservationsVacationPackage[];
    };
  };

  type NormalizedReservationCard = {
    title: string;
    mainReservationCard?: PostBookingTypes.ItineraryCard;
    subReservations: PostBookingTypes.ItineraryCard[];
  };

  type TravelModeForGoogleApi = "driving" | "walking" | "transit";
}
