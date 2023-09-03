import { DecodedValueMap, stringify, encodeQueryParams } from "use-query-params";
import { flatten } from "fp-ts/lib/Array";

import { PostBookingQueryParamsScheme } from "components/features/PostBooking/components/hooks/usePostBookingQueryParams";
import {
  ITINERARY_MAP_ITEM_TYPE,
  PB_CARD_TYPE,
  POSTBOOKING_NAVIGATION,
} from "components/features/PostBooking/types/postBookingEnums";
import { MOCKED_TOURS_ANDS_EXPERIENCES } from "components/features/PostBooking/REMOVE_POST_BOOKING_MOCK_DATA";
import { PostBookingTypes } from "components/features/PostBooking/types/postBookingTypes";
import { MapPointType, Marketplace, PageType, SupportedLanguages } from "types/enums";
import { getClientSideUrl } from "utils/helperUtils";
import { toDateWithoutTimezone } from "utils/dateUtils";
import { EditableStatus } from "components/features/Voucher/types/VoucherEnums";
import {
  constructCustomerInfoSection,
  mapCarVoucherPickupData,
} from "components/features/Voucher/utils/voucherUtils";
import HotelIcon from "components/icons/house-heart.svg";
import FlightIcon from "components/icons/plane-1.svg";
import CarIcon from "components/icons/car.svg";
import TravelerIcon from "components/icons/traveler.svg";
import { OrderResultCode } from "components/features/Cart/types/cartEnums";

export const getPBDayClientRoute = (
  dayNavigateTo: number,
  queryParams: DecodedValueMap<typeof PostBookingQueryParamsScheme>,
  activeLocale: SupportedLanguages,
  marketplace: Marketplace,
  replace = false
) => {
  const baseUrl = getClientSideUrl(PageType.GTE_POST_BOOKING, activeLocale, marketplace);
  const stringifiedQuery = stringify(
    encodeQueryParams(PostBookingQueryParamsScheme, {
      ...queryParams,
      day: dayNavigateTo,
    })
  );

  return {
    query: {
      ...queryParams,
      day: dayNavigateTo,
    },
    route: `/${PageType.GTE_POST_BOOKING}`,
    as: `${baseUrl}?${stringifiedQuery}`,
    replace,
  };
};

export const getPBReservationsClientRoute = (
  activeLocale: SupportedLanguages,
  marketplace: Marketplace,
  bookingReference?: number
) => {
  const baseUrl = getClientSideUrl(PageType.GTE_POST_BOOKING, activeLocale, marketplace);
  const stringifiedQuery = stringify(
    encodeQueryParams(PostBookingQueryParamsScheme, {
      nav: POSTBOOKING_NAVIGATION.RESERVATIONS,
      ...(bookingReference ? { tripId: bookingReference } : {}),
    })
  );

  return {
    query: {
      nav: POSTBOOKING_NAVIGATION.RESERVATIONS,
      ...(bookingReference ? { tripId: bookingReference } : {}),
    },
    route: `/${PageType.GTE_POST_BOOKING}`,
    as: `${baseUrl}?${stringifiedQuery}`,
  };
};

export const getPBBookingsClientRoute = (
  activeLocale: SupportedLanguages,
  marketplace: Marketplace
) => {
  const baseUrl = getClientSideUrl(PageType.GTE_POST_BOOKING, activeLocale, marketplace);
  const stringifiedQuery = stringify(
    encodeQueryParams(PostBookingQueryParamsScheme, {
      nav: POSTBOOKING_NAVIGATION.VACATION_PACKAGES,
    })
  );

  return {
    query: {
      nav: POSTBOOKING_NAVIGATION.VACATION_PACKAGES,
    },
    route: `/${PageType.GTE_POST_BOOKING}`,
    as: `${baseUrl}?${stringifiedQuery}`,
  };
};

export const constructItineraryNavigationData = (data = {} as PostBookingTypes.QueryItinerary) => {
  return data?.itinerary?.days?.map(i => {
    return {
      dateWithoutTimezone: toDateWithoutTimezone(new Date(i.date)),
      dayNumber: i.dayNumber,
    };
  });
};

const mapItineraryMapItemToMapPoint = (
  item: PostBookingTypes.ItineraryMapItem,
  bookingId?: number
) => {
  let mapPointType;

  switch (item.type) {
    case ITINERARY_MAP_ITEM_TYPE.ATTRACTION:
      mapPointType = MapPointType.ATTRACTION;
      break;
    case ITINERARY_MAP_ITEM_TYPE.CAR:
      mapPointType = MapPointType.ATTRACTION;
      break;
    case ITINERARY_MAP_ITEM_TYPE.DAY_TOUR:
      mapPointType = MapPointType.DAY_TOUR;
      break;

    case ITINERARY_MAP_ITEM_TYPE.DESTINATION:
      mapPointType = MapPointType.DESTINATION;
      break;

    case ITINERARY_MAP_ITEM_TYPE.HOTEL:
      mapPointType = MapPointType.HOTEL;
      break;

    case ITINERARY_MAP_ITEM_TYPE.PACKAGE_TOUR:
      mapPointType = MapPointType.PACKAGE_TOUR;
      break;

    case ITINERARY_MAP_ITEM_TYPE.SELF_DRIVE_TOUR:
      mapPointType = MapPointType.SELF_DRIVE_TOUR;
      break;

    case ITINERARY_MAP_ITEM_TYPE.TOUR:
      mapPointType = MapPointType.TOUR;
      break;

    case ITINERARY_MAP_ITEM_TYPE.BAR:
      mapPointType = MapPointType.BAR;
      break;

    case ITINERARY_MAP_ITEM_TYPE.RESTAURANT:
      mapPointType = MapPointType.RESTAURANT;
      break;

    default:
      break;
  }

  return {
    ...item,
    context: {
      bookingId,
    },
    type: mapPointType || item.type,
  } as SharedTypes.MapPoint;
};

export const constructItineraryMapPointsData = (
  // eslint-disable-next-line default-param-last
  data = {} as PostBookingTypes.QueryItineraryMap,
  // eslint-disable-next-line default-param-last
  selectedDayNumber = 1,
  bookingId?: number
) => {
  const { itineraryMap } = data;

  if (!itineraryMap || itineraryMap.length === 0) {
    return [] as SharedTypes.MapPoint[];
  }

  return (
    itineraryMap
      .find(i => i.dayNumber === selectedDayNumber)
      ?.items?.map(item => mapItineraryMapItemToMapPoint(item, bookingId)) ||
    ([] as SharedTypes.MapPoint[])
  );
};

const mapStayVoucherRoomValues = (
  data: PostBookingTypes.StayVoucherRoom
): OrderTypes.CartStaysRoom => {
  return {
    ...data,
    name: data?.name ?? "",
    roomBookings: data?.roomBookings?.map(roomBooking => ({
      ...roomBooking,
      extras: roomBooking.extras.map(extra => ({
        ...extra,
        required: Number(extra.isRequired),
      })),
    })),
  };
};

const mapStayProductVoucherRoomValues = (data?: PostBookingTypes.StayVoucherRoomDetails[]) => {
  if (!data) return undefined;
  const rooms = data.map(room => {
    const {
      availabilityId,
      cancellationType,
      dateFreeCancellationUntil,
      externalId,
      id,
      mealType,
      name,
    } = room;
    return {
      availabilityId,
      cancellationType,
      dateFreeCancellationUntil: dateFreeCancellationUntil ?? "",
      externalId,
      id,
      mealType,
      name,
      number: 0,
    };
  });
  return rooms;
};

const constructVoucherPriceObjectFromPaymentDetails = (
  paymentDetails?: PostBookingTypes.VoucherPaymentDetails
) => {
  return {
    priceDisplayValue: String(paymentDetails?.totalPrice || 0),
    price: paymentDetails?.totalPrice || 0,
    defaultPrice: paymentDetails?.totalPrice || 0,
    currency: paymentDetails?.currency || "EUR",
  };
};

const constructVoucherPriceObjectsFromPaymentDetails = (
  paymentDetails?: PostBookingTypes.VoucherPaymentDetails
) => {
  return [
    {
      priceObject: constructVoucherPriceObjectFromPaymentDetails(paymentDetails),
      vatPriceObject: {
        priceDisplayValue: String(paymentDetails?.vatAmount || 0),
        price: paymentDetails?.vatAmount || 0,
        defaultPrice: paymentDetails?.vatAmount || 0,
        currency: paymentDetails?.currency || "EUR",
      },
    },
  ];
};

export const constructPBCarVoucherData = ({
  data,
  t,
}: {
  data: PostBookingTypes.UnionPBInfoModalDataType;
  t: TFunction;
}) => {
  if (data && "carVoucher" in data) {
    const { carVoucher } = data;
    const pickUpOrDropOffPresent =
      carVoucher?.serviceDetails?.pickup || carVoucher?.serviceDetails?.dropOff;
    const queryCar: VoucherTypes.VoucherQueryCar = {
      cart: {
        id: carVoucher?.bookingDetails?.voucherInfo?.[0]?.voucherId ?? "",
        cartItemId: carVoucher?.bookingDetails?.voucherInfo?.[0]?.id.toString() ?? "",
        offerId: carVoucher?.bookingDetails?.voucherInfo?.[0]?.id.toString() ?? "",
        category: carVoucher?.serviceDetails?.category ?? "",
        pickupLocation: carVoucher?.serviceDetails?.pickUpLocation ?? "",
        dropoffLocation: carVoucher?.serviceDetails?.dropOffLocation ?? "",
        provider: carVoucher?.serviceDetails?.provider ?? "",
        numberOfDays: carVoucher?.serviceDetails?.numberOfDays ?? 0,
        priceOnArrival: carVoucher?.serviceDetails?.priceOnArrival ?? 0,
        priceBreakdown: carVoucher?.paymentDetails?.priceBreakDown ?? [],
        payOnArrival: carVoucher?.paymentDetails?.payOnArrival ?? [],
        priceObject: constructVoucherPriceObjectFromPaymentDetails(carVoucher.paymentDetails),
        extras: carVoucher?.serviceDetails?.extras ?? [{ count: 0, price: 0 }],
        insurances: carVoucher?.serviceDetails?.insurances ?? [],
        totalPrice: carVoucher?.paymentDetails?.totalPrice ?? 0,
        available: true,
        editable: false,
        from: carVoucher?.serviceDetails?.pickUpTime ?? "",
        to: carVoucher?.serviceDetails?.dropOffTime ?? "",
        updated: "",
        createdTime: carVoucher?.bookingDetails?.voucherInfo?.[0]?.created ?? "",
        driverCountry: carVoucher?.travelersDetails?.nationality ?? "",
        ...(pickUpOrDropOffPresent
          ? {
              locationDetails: {
                ...(carVoucher?.serviceDetails?.pickup && {
                  pickup: mapCarVoucherPickupData(carVoucher.serviceDetails.pickup),
                }),
                ...(carVoucher?.serviceDetails?.dropOff && {
                  dropoff: mapCarVoucherPickupData(carVoucher.serviceDetails.dropOff),
                }),
              },
            }
          : {}),
        vendor: { name: carVoucher?.serviceDetails?.supplier ?? "" },
      },
      bookingNumber: carVoucher?.bookingDetails?.bookingNumber ?? "",
      externalId: carVoucher?.bookingDetails?.externalBookingId ?? "",
      bookingDate: carVoucher?.bookingDetails?.bookingDate ?? "",
      editableStatus: EditableStatus.UNAVAILABLE,
      vatAmount: carVoucher?.paymentDetails?.vatAmount ?? 0,
      vatPercentage: carVoucher?.paymentDetails?.vatPercentage ?? 0,
      voucherPriceObjects: constructVoucherPriceObjectsFromPaymentDetails(
        carVoucher.paymentDetails
      ),
    };

    const customerInfo = {
      name: carVoucher?.travelersDetails?.name ?? "",
      email: carVoucher?.travelersDetails?.email ?? "",
      phoneNumber: carVoucher?.travelersDetails?.phoneNumber ?? "",
      nationality: carVoucher?.travelersDetails?.nationality ?? "",
      termsAgreed: true,
    };
    const customerInfoSection = constructCustomerInfoSection({
      customerInfo,
      t,
    });
    const orderInfo = {
      paymentMethod: null,
      orderStatus: OrderResultCode.AUTHORISED,
      paymentAmount: 0,
      paymentCurrency: "",
    };
    return { queryCar, customerInfoSection, orderInfo };
  }

  return {};
};

const filterStayVoucherProductSpecs = (
  specs: { iconId?: string; name?: string; value?: string }[]
): SharedTypes.QueryProductSpec[] => {
  if (!specs.length) {
    return [];
  }
  return specs
    .map(s => ({
      iconId: s?.iconId ?? "",
      name: s?.name ?? "",
      value: s?.value ?? "",
    }))
    .filter(spec => spec.name && spec.value);
};

const getBookingInfoReference = (roomDetails?: PostBookingTypes.StayVoucherRoomDetails[]) => {
  if (!roomDetails || roomDetails.length <= 0) return [];
  const bookingInfo = roomDetails.map(room => {
    return {
      availabilityId: room.availabilityId ?? null,
      externalId: room.externalId ?? null,
    };
  });
  return bookingInfo;
};

export const constructPBStayProductVoucherData = ({
  data,
  t,
}: {
  data: PostBookingTypes.UnionPBInfoModalDataType;
  t: TFunction;
}) => {
  if (data && "stayProductVoucher" in data) {
    const {
      stayProductVoucher: {
        serviceDetails,
        paymentDetails,
        bookingDetails,
        travelersDetails,
        roomDetails,
      },
    } = data;
    const id = bookingDetails?.voucherInfo?.[0]?.id;
    const productId = bookingDetails?.voucherInfo?.[0]?.productId;
    const queryStay: VoucherTypes.VoucherQueryGTEStay = {
      cart: {
        id: String(id),
        available: true,
        editable: false,
        ...(serviceDetails?.title && { title: serviceDetails.title }),
        product: {
          productId: productId ?? 0,
          ...(serviceDetails?.address && { address: serviceDetails.address }),
          ...(serviceDetails?.title && { name: serviceDetails.title }),
          timeCheckingIn: serviceDetails.timeOfCheckin,
          timeCheckingOut: serviceDetails.timeOfCheckout,
          valueProps: [],
        },
        isForVacationPackage: false,
        currency: paymentDetails?.currency,
        ...(serviceDetails?.type && { type: serviceDetails.type }),
        totalNumberOfAdults: serviceDetails?.numberOfAdults ?? 0,
        totalNumberOfChildren: serviceDetails?.numberOfChildren ?? 0,
        ...(serviceDetails?.childrenAges && {
          childrenAges: serviceDetails?.childrenAges,
        }),
        cartItemId: bookingDetails?.voucherInfo?.[0]?.voucherId ?? "",
        totalPrice: paymentDetails?.totalPrice ?? 0,
        ...(serviceDetails?.cancellationPolicyString && {
          cancellationString: serviceDetails.cancellationPolicyString,
        }),
        from: serviceDetails?.checkIn ?? "",
        to: serviceDetails?.checkOut ?? "",
        dateCheckingIn: serviceDetails?.checkIn ?? "",
        dateCheckingOut: serviceDetails?.checkOut ?? "",
        createdTime: bookingDetails?.voucherInfo?.[0]?.created ?? "",
        dateCreated: bookingDetails?.voucherInfo?.[0]?.created ?? "",
        updated: "",
        dateUpdated: "",
        ...(serviceDetails?.cancellationPolicy && {
          cancellationPolicy: serviceDetails.cancellationPolicy,
        }),
        ...(serviceDetails?.cityName && { cityName: serviceDetails.cityName }),
        rooms: mapStayProductVoucherRoomValues(roomDetails),
        priceObject: constructVoucherPriceObjectFromPaymentDetails(paymentDetails),
      },
      bookingNumber: bookingDetails?.bookingNumber ?? "",
      externalId: bookingDetails?.externalBookingId ?? "",
      bookingInfoReference: getBookingInfoReference(roomDetails),
      bookingDate: bookingDetails?.dateBooked ?? "",
      editableStatus: EditableStatus.UNAVAILABLE,
      vatAmount: paymentDetails?.vatAmount ?? 0,
      vatPercentage: paymentDetails?.vatPercentage ?? 0,
      voucherPriceObjects: constructVoucherPriceObjectsFromPaymentDetails(paymentDetails),
    };

    const customerInfo = {
      email: travelersDetails?.email ?? "",
      phoneNumber: travelersDetails?.phoneNumber ?? "",
      termsAgreed: true,
      name: travelersDetails?.name ?? "",
      nationality: travelersDetails?.country ?? "",
    };
    const customerInfoSection = constructCustomerInfoSection({
      customerInfo,
      t,
    });
    const orderInfo = {
      paymentMethod: null,
      orderStatus: OrderResultCode.AUTHORISED,
    };
    return { queryStay, customerInfoSection, orderInfo };
  }
  return {};
};

export const constructPBStayVoucherData = ({
  data,
  t,
}: {
  data: PostBookingTypes.UnionPBInfoModalDataType;
  t: TFunction;
}) => {
  if (data && "stayVoucher" in data) {
    const {
      stayVoucher: { serviceDetails, paymentDetails, bookingDetails, travelersDetails },
    } = data;
    const roomsAvailable = serviceDetails?.rooms?.length;
    const id = bookingDetails?.voucherInfo?.[0]?.id;
    const productId = bookingDetails?.voucherInfo?.[0]?.productId;
    const queryStay: VoucherTypes.VoucherQueryStay = {
      cart: {
        id: id ?? 0,
        productId: productId ?? 0,
        ...(serviceDetails?.address && { address: serviceDetails.address }),
        uri: "",
        ...(serviceDetails?.type && { type: serviceDetails.type }),
        numberOfGuests: serviceDetails?.numberOfGuests ?? 0,
        numberOfAdults: serviceDetails?.numberOfAdults ?? 0,
        numberOfChildren: serviceDetails?.numberOfChildren ?? 0,
        ...(serviceDetails?.childrenAges && {
          childrenAges: serviceDetails?.childrenAges,
        }),
        ...(roomsAvailable
          ? {
              rooms: serviceDetails?.rooms?.map(room => mapStayVoucherRoomValues(room)),
            }
          : {}),
        specs: filterStayVoucherProductSpecs(serviceDetails?.specs ?? []),
        cartItemId: bookingDetails?.voucherInfo?.[0]?.voucherId ?? "",
        totalPrice: paymentDetails?.totalPrice ?? 0,
        available: true,
        editable: false,
        ...(serviceDetails?.cancellationPolicyString && {
          cancellationString: serviceDetails.cancellationPolicyString,
        }),
        from: serviceDetails?.checkIn ?? "",
        to: serviceDetails?.checkOut ?? "",
        ...(bookingDetails?.voucherInfo?.[0]?.created && {
          createdTime: bookingDetails?.voucherInfo?.[0]?.created,
        }),
        ...(serviceDetails?.cancellationPolicy && {
          cancellationPolicy: serviceDetails.cancellationPolicy,
        }),
        ...(serviceDetails?.cityName && { cityName: serviceDetails.cityName }),
        priceObject: constructVoucherPriceObjectFromPaymentDetails(paymentDetails),
      },
      bookingNumber: bookingDetails?.bookingNumber ?? "",
      externalId: bookingDetails?.externalBookingId ?? "",
      bookingDate: bookingDetails?.dateBooked ?? "",
      editableStatus: EditableStatus.UNAVAILABLE,
      vatAmount: paymentDetails?.vatAmount ?? 0,
      vatPercentage: paymentDetails?.vatPercentage ?? 0,
      voucherPriceObjects: constructVoucherPriceObjectsFromPaymentDetails(paymentDetails),
    };

    const customerInfo = {
      email: travelersDetails?.email ?? "",
      phoneNumber: travelersDetails?.phoneNumber ?? "",
      termsAgreed: true,
      name: travelersDetails?.name ?? "",
      nationality: travelersDetails?.country ?? "",
    };
    const customerInfoSection = constructCustomerInfoSection({
      customerInfo,
      t,
    });
    const orderInfo = {
      paymentMethod: null,
      orderStatus: OrderResultCode.AUTHORISED,
      paymentAmount: 0,
      paymentCurrency: "",
    };
    return { queryStay, customerInfoSection, orderInfo };
  }
  return {};
};

const mapFlightRouteData = (
  route: PostBookingTypes.QueryFlightRoute[],
  flightClass: string
): FlightSearchTypes.QueryRoute[] => {
  if (!route || !route.length) {
    return [];
  }

  return route.map(item => ({
    ...item,
    flightClass: flightClass ?? "",
    airline: {
      code: item.airline?.code ?? "",
      name: item.airline?.name ?? "",
      imageUrl: item.airline?.imageUrl ?? "",
    },
    cityFrom: {
      name: item.cityFrom?.name ?? "",
      code: item.cityFrom?.code ?? "",
    },
    cityTo: { name: item.cityTo?.name ?? "", code: item.cityTo?.code ?? "" },
    flightNumber: item.flightNumber ?? "",
    flyFrom: { code: item.flyFrom?.code ?? "", name: item.flyFrom?.name ?? "" },
    flyTo: { code: item.flyTo?.code ?? "", name: item.flyTo?.name ?? "" },
  }));
};
export const constructPBFlightVoucherData = ({
  data,
}: {
  data: PostBookingTypes.UnionPBInfoModalDataType;
}) => {
  if (data && "flightVoucher" in data) {
    const {
      flightVoucher: { bookingDetails, paymentDetails, travelersDetails, serviceDetails },
    } = data;
    const inboundDurationSec = serviceDetails?.departureRoute?.[0]?.durationSec;
    const outboundDurationSec = serviceDetails?.returnRoute?.[0]?.durationSec;
    const totalDurationSec =
      inboundDurationSec && outboundDurationSec ? inboundDurationSec + outboundDurationSec : 0;

    const flightCityFrom = serviceDetails?.departureRoute?.[0]?.cityFrom?.name ?? "";
    const flightCityTo = serviceDetails?.departureRoute?.[0]?.cityTo?.name ?? "";
    const title = `${flightCityFrom} - ${flightCityTo}`;

    const flightClassDeparture = serviceDetails?.departureRoute?.[0]?.fareCategory ?? "";
    const flightClassReturn = serviceDetails?.returnRoute?.[0]?.fareCategory ?? "";

    const queryFlight: VoucherTypes.VoucherQueryFlight = {
      cart: {
        id: bookingDetails?.voucherInfo?.[0]?.voucherId ?? "",
        numberOfPassengers: serviceDetails?.travelers?.totalPassengersCount ?? 0,
        cartItemId: bookingDetails?.voucherInfo?.[0]?.voucherId ?? "",
        isEditable: false,
        baggage: serviceDetails?.baggage?.map(b => ({ ...b, id: String(b.id) })) ?? [],
        adults: serviceDetails?.travelers?.adults ?? 0,
        children: serviceDetails?.travelers?.children ?? 0,
        infants: serviceDetails?.travelers?.infants ?? 0,
        title,
        available: true,
        nightsInDestination: serviceDetails?.numberOfNights ?? 0,
        bookingToken: bookingDetails?.externalBookingId ?? "",
        inboundDurationSec: inboundDurationSec ?? 0,
        outboundDurationSec: outboundDurationSec ?? 0,
        totalDurationSec: totalDurationSec ?? 0,
        price: paymentDetails?.totalPrice ?? 0,
        outboundRoute: mapFlightRouteData(
          serviceDetails?.departureRoute ?? [],
          flightClassDeparture
        ),
        inboundRoute: mapFlightRouteData(serviceDetails?.returnRoute ?? [], flightClassReturn),
        priceObject: constructVoucherPriceObjectFromPaymentDetails(paymentDetails),
      },
      bookingNumber: bookingDetails?.bookingNumber ?? "",
      externalId: bookingDetails?.externalBookingId ?? "",
      bookingDate: bookingDetails?.dateBooked ?? "",
      editableStatus: EditableStatus.UNAVAILABLE,
      vatAmount: paymentDetails?.vatAmount ?? 0,
      vatPercentage: paymentDetails?.vatPercentage ?? 0,
      voucherPriceObjects: constructVoucherPriceObjectsFromPaymentDetails(paymentDetails),
      passengers: travelersDetails
        ? [
            {
              name: travelersDetails?.name ?? "",
              ...(travelersDetails?.email && {
                email: travelersDetails?.email,
              }),
              ...(travelersDetails?.phoneNumber && {
                phoneNumber: travelersDetails?.phoneNumber,
              }),
              nationality: travelersDetails?.nationality ?? "",
              termsAgreed: true,
            },
          ]
        : [],
    };

    const orderInfo = {
      paymentMethod: null,
      orderStatus: OrderResultCode.AUTHORISED,
      paymentAmount: 0,
      paymentCurrency: "",
    };
    return { queryFlight, orderInfo };
  }
  return {};
};

export const constructPBTourVoucherData = (
  data: PostBookingTypes.QueryTourVoucher
):
  | {
      queryTour: VoucherTypes.VoucherQueryGTETour;
      voucherId: string;
      defaultEmail: string;
      isVoucherReady: boolean;
      pdfUrl?: string;
      orderInfo: VoucherTypes.OrderInfo;
      voucherColor?: string;
      isPaymentDetailsHidden?: boolean;
    }
  | undefined => {
  if (data.tourVoucher) {
    const { tourVoucher } = data;
    // todo - fill in mock data once backend is ready
    return {
      voucherId: tourVoucher.bookingDetails.voucherInfo?.[0]?.voucherId ?? "",
      defaultEmail: tourVoucher.travelersDetails.email ?? "",
      isVoucherReady: true,
      pdfUrl: tourVoucher.bookingDetails.voucherInfo?.[0]?.url,
      orderInfo: {
        paymentMethod: MOCKED_TOURS_ANDS_EXPERIENCES.paymentMethod,
        orderStatus: MOCKED_TOURS_ANDS_EXPERIENCES.orderStatus,
        paymentAmount: 0,
        paymentCurrency: "",
      },
      isPaymentDetailsHidden: MOCKED_TOURS_ANDS_EXPERIENCES.isPaymentDetailsHidden,
      queryTour: {
        externalId: MOCKED_TOURS_ANDS_EXPERIENCES.externalId,
        bookingNumber: tourVoucher.bookingDetails.bookingNumber ?? "",
        bookingDate: tourVoucher.bookingDetails.dateBooked ?? "",
        // @ts-ignore
        editableStatus: MOCKED_TOURS_ANDS_EXPERIENCES.editableStatus,
        vatAmount: tourVoucher.paymentDetails.vatAmount,
        vatPercentage: tourVoucher.paymentDetails.vatPercentage,
        // @ts-ignore
        cart: MOCKED_TOURS_ANDS_EXPERIENCES.cart,
      },
    };
  }

  return undefined;
};

export const getVoucherModalIcon = (type: PB_CARD_TYPE) => {
  switch (type) {
    case PB_CARD_TYPE.CAR_RENTAL:
      return CarIcon;
    case PB_CARD_TYPE.STAY:
    case PB_CARD_TYPE.STAY_PRODUCT:
      return HotelIcon;
    case PB_CARD_TYPE.FLIGHT_ARRIVING:
    case PB_CARD_TYPE.FLIGHT_RETURN:
      return FlightIcon;
    case PB_CARD_TYPE.TOUR:
      return TravelerIcon;
    default:
      return HotelIcon;
  }
};

const getStayVoucherData = (
  data: PostBookingTypes.UnionPBInfoModalDataType,
  productType: PB_CARD_TYPE
) => {
  if (productType === PB_CARD_TYPE.STAY_PRODUCT) {
    const { stayProductVoucher } = data as PostBookingTypes.QueryStayProductVoucher;
    return stayProductVoucher;
  }
  const { stayVoucher } = data as PostBookingTypes.QueryStayVoucher;
  return stayVoucher;
};

export const getVoucherDefaultValues = ({
  data,
  productType,
}: {
  data?: PostBookingTypes.UnionPBInfoModalDataType;
  productType: PB_CARD_TYPE;
}): { pdfUrl: string; email: string; voucherId?: string } => {
  const defaultPdfUrl = "";
  const defaultEmail = "";
  const defaultVoucherId = "";
  if (!data) {
    return {
      pdfUrl: defaultPdfUrl,
      email: defaultEmail,
      voucherId: defaultVoucherId,
    };
  }
  if (productType === PB_CARD_TYPE.CAR_RENTAL) {
    const { carVoucher } = data as PostBookingTypes.QueryCarVoucher;
    const pdfUrl = carVoucher?.bookingDetails?.voucherInfo?.[0]?.url ?? defaultPdfUrl;
    const email = carVoucher?.travelersDetails?.email ?? defaultEmail;
    const voucherId = carVoucher?.bookingDetails?.voucherInfo?.[0]?.voucherId ?? defaultVoucherId;
    return { pdfUrl, email, voucherId };
  }
  if (productType === PB_CARD_TYPE.STAY || productType === PB_CARD_TYPE.STAY_PRODUCT) {
    const stayVoucher = getStayVoucherData(data, productType);
    const pdfUrl = stayVoucher?.bookingDetails?.voucherInfo?.[0]?.url ?? defaultPdfUrl;
    const email = stayVoucher?.travelersDetails?.email ?? defaultEmail;
    const voucherId = stayVoucher?.bookingDetails?.voucherInfo?.[0]?.voucherId ?? defaultVoucherId;
    return { pdfUrl, email, voucherId };
  }
  if (productType === PB_CARD_TYPE.TOUR) {
    const { tourVoucher } = data as PostBookingTypes.QueryTourVoucher;
    const pdfUrl = tourVoucher.bookingDetails.voucherInfo?.[0]?.url ?? defaultPdfUrl;
    const email = tourVoucher.travelersDetails.email ?? defaultEmail;
    return { pdfUrl, email };
  }
  if (productType === PB_CARD_TYPE.FLIGHT_RETURN || productType === PB_CARD_TYPE.FLIGHT_ARRIVING) {
    const { flightVoucher } = data as PostBookingTypes.QueryFlightVoucher;
    const pdfUrl = flightVoucher?.bookingDetails?.voucherInfo?.[0]?.url ?? defaultPdfUrl;
    const email = flightVoucher?.travelersDetails?.email ?? defaultEmail;
    const voucherId =
      flightVoucher?.bookingDetails?.voucherInfo?.[0]?.voucherId ?? defaultVoucherId;
    return { pdfUrl, email, voucherId };
  }
  return {
    pdfUrl: defaultPdfUrl,
    email: defaultEmail,
    voucherId: defaultVoucherId,
  };
};

export const productIsVoucher = (productType: PB_CARD_TYPE) =>
  productType === PB_CARD_TYPE.STAY ||
  productType === PB_CARD_TYPE.STAY_PRODUCT ||
  productType === PB_CARD_TYPE.FLIGHT_RETURN ||
  productType === PB_CARD_TYPE.FLIGHT_ARRIVING ||
  productType === PB_CARD_TYPE.CAR_RENTAL ||
  productType === PB_CARD_TYPE.TOUR;

export const filterEmptyQuickFacts = (quickFacts: SharedTypes.QuickFact[]) => {
  return quickFacts.filter(qf => Boolean(qf.value));
};

export const getPBVPBookings = (data?: PostBookingTypes.QueryUserReservations) => {
  let vpBookings = [] as PostBookingTypes.ItineraryCard[];

  if (data?.userReservations?.vacationPackages?.length) {
    vpBookings = data.userReservations.vacationPackages
      .map(vp => vp.card)
      .filter(Boolean) as PostBookingTypes.ItineraryCard[];
  }

  return vpBookings;
};

export const getPBReservations = (data?: PostBookingTypes.QueryUserReservations) => {
  const nonVPReservations = data?.userReservations?.reservationCards || [];

  const vpReservations = flatten(
    data?.userReservations.vacationPackages?.map(vpData => {
      if (vpData.reservationCards?.length) {
        return vpData.card ? [...vpData.reservationCards, vpData.card] : vpData.reservationCards;
      }
      return [];
    }) || []
  );

  return {
    nonVPReservations,
    vpReservations,
  };
};

export const filterReservations = (
  data?: PostBookingTypes.QueryUserReservations,
  tripId?: number
): PostBookingTypes.QueryUserReservations | undefined => {
  if (tripId === undefined || !data) {
    return data;
  }

  return {
    userReservations: {
      reservationCards: [],
      vacationPackages: data.userReservations.vacationPackages?.filter(
        vp => vp.card?.bookingId === tripId
      ),
    },
  };
};

export const hasExpiredReservations = (reservations?: PostBookingTypes.ItineraryCard[]) => {
  return Boolean(reservations?.some(r => Boolean(r.isExpired)));
};

export const normalizedCardsData = (
  data?: PostBookingTypes.QueryUserReservations
): PostBookingTypes.NormalizedReservationCard[] => {
  const standaloneReservations = data?.userReservations.reservationCards || [];
  const standaloneReservationCards = standaloneReservations.map(
    card =>
      ({
        title: card.name ?? "",
        mainReservationCard: card,
        subReservations: [],
      } as PostBookingTypes.NormalizedReservationCard)
  );

  const vacationPackages = data?.userReservations.vacationPackages || [];

  const vppackageCards = vacationPackages.map(
    vp =>
      ({
        title: vp.title ?? "",
        mainReservationCard: vp.card,
        subReservations: vp.reservationCards || [],
      } as PostBookingTypes.NormalizedReservationCard)
  );

  return [...standaloneReservationCards, ...vppackageCards];
};

const removeSubReservations = (
  reservation: PostBookingTypes.NormalizedReservationCard
): PostBookingTypes.NormalizedReservationCard => {
  return {
    ...reservation,
    subReservations: [],
  };
};

export const splitForToggle = (reservations: PostBookingTypes.NormalizedReservationCard[]) => {
  let fullyExpiredReservations = reservations.filter(
    reservation => Boolean(reservation.mainReservationCard?.isExpired) === true
  );

  let nonExpiredReservations = reservations.filter(
    reservation => Boolean(reservation.mainReservationCard?.isExpired) === false
  );

  if (fullyExpiredReservations.length > 1) {
    fullyExpiredReservations = fullyExpiredReservations.map(removeSubReservations);
  }

  if (nonExpiredReservations.length > 1) {
    nonExpiredReservations = nonExpiredReservations.map(removeSubReservations);
  }

  /**
   * When we have a single unexpired reservation
   * we should move all potential "expired" subreservations to "fullyExpired" cards
   */
  if (nonExpiredReservations.length === 1) {
    const nonExpiredReservation = nonExpiredReservations[0];

    const partiallyActiveReservations: PostBookingTypes.ItineraryCard[] = [];
    const partiallyInActiveReservations: PostBookingTypes.ItineraryCard[] = [];

    nonExpiredReservation.subReservations.forEach(reservation => {
      if (reservation.isExpired) {
        partiallyInActiveReservations.push(reservation);
      } else {
        partiallyActiveReservations.push(reservation);
      }
    });

    nonExpiredReservations = [
      {
        ...nonExpiredReservations[0],
        subReservations: partiallyActiveReservations,
      },
    ];

    if (partiallyInActiveReservations.length) {
      fullyExpiredReservations = fullyExpiredReservations.map(removeSubReservations);

      fullyExpiredReservations.push({
        title: nonExpiredReservation.title,
        mainReservationCard: nonExpiredReservation.mainReservationCard,
        subReservations: partiallyInActiveReservations,
      });
    }
  }
  return {
    active: nonExpiredReservations,
    inactive: fullyExpiredReservations,
  };
};
