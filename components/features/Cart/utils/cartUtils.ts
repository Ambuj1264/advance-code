import {
  isEmptyString,
  isFalseBoolean,
  isNotFullName,
  isInvalidEmail,
} from "@travelshift/ui/utils/validationUtils";
import memoizeOne from "memoize-one";
import { pipe } from "fp-ts/lib/pipeable";
import Router from "next/router";
import { NextPageContext } from "next";
import { CoreOptions } from "@adyen/adyen-web/dist/types/core/types";
import {
  decodeQueryParams,
  encodeQueryParams,
  parseUrl,
  stringify,
  StringParam,
} from "use-query-params";

import { asPathWithoutQueryParams, cleanAsPath, constructLocalizedUrl } from "utils/routerUtils";
import { constructFlightCartInput } from "components/features/Flight/utils/flightUtils";
import { isExpiredFlight } from "components/ui/FlightsShared/flightsSharedUtils";
import { ProductSpecId } from "components/ui/Information/informationUtils";
import { getTourDuration, isGTEStayConstructType } from "components/ui/Order/utils/orderUtils";
import { getIcon, getMetadataTitle, ProductPropId } from "components/ui/utils/uiUtils";
import { Namespaces } from "shared/namespaces";
import CustomNextDynamic from "lib/CustomNextDynamic";
import {
  CartQueryParam,
  Direction,
  Marketplace,
  MarketplaceSessionCookie,
  PageType,
  PaymentLinkQueryParam,
  Product,
  SupportedCurrencies,
  SupportedLanguages,
  TourType,
} from "types/enums";
import { getQueryParamsViaLayer0 } from "utils/apiUtils";
import {
  getFormattedDate,
  getShortMonthNumbericDateFormat,
  hourMinuteFormat,
  removeSecondsFromTimeString,
  shortMonthDayFormat,
} from "utils/dateUtils";
import { emptyFunction, getLanguagePrefix, getWithDefault } from "utils/helperUtils";
import { transformLocaleToNationality } from "utils/globalUtils";
import { datalayerBeginCheckout, datalayerPurchase } from "components/ui/Tracking/trackingUtils";
import {
  CardType,
  FinalizeCheckoutAdyenParams,
  FinalizeCheckoutSaltPayParams,
  OrderPayByLinkType,
  OrderPaymentEnvironment,
  PaymentMethodOrderType,
  OrderPaymentProvider,
  PaymentMethodName,
  PaymentMethodType,
} from "components/features/Cart/types/cartEnums";
import IconLoading from "components/ui/utils/IconLoading";
import lazyCaptureException from "lib/lazyCaptureException";
import {
  VPQueryParamScheme,
  VPQueryParamsType,
} from "components/features/VacationPackages/hooks/useVPQueryParams";
import { getCookie } from "utils/cookieUtils";
import {
  TourSearchQueryParamsScheme,
  TourSearchQueryParamsType,
} from "components/features/SearchPage/useTourSearchQueryParams";

export const BedroomIcon = CustomNextDynamic(() => import("components/icons/bedroom-hotel.svg"), {
  loading: IconLoading,
});
export const IconHouseHeart = CustomNextDynamic(() => import("components/icons/house-heart.svg"), {
  loading: IconLoading,
});
export const CarIcon = CustomNextDynamic(() => import("components/icons/car.svg"), {
  loading: IconLoading,
});
export const BreakfastIcon = CustomNextDynamic(() => import("components/icons/breakfast.svg"), {
  loading: IconLoading,
});
export const CarGarage = CustomNextDynamic(() => import("components/icons/car-garage.svg"), {
  loading: IconLoading,
});
export const CarKey = CustomNextDynamic(() => import("components/icons/car-key.svg"), {
  loading: IconLoading,
});
export const TourStart = CustomNextDynamic(() => import("components/icons/tour-start.svg"), {
  loading: IconLoading,
});
export const CheckInDoor = CustomNextDynamic(() => import("components/icons/check-in-door.svg"), {
  loading: IconLoading,
});
export const CheckOutDoor = CustomNextDynamic(() => import("components/icons/check-out-door.svg"), {
  loading: IconLoading,
});
export const TourEnd = CustomNextDynamic(() => import("components/icons/tour-end.svg"), {
  loading: IconLoading,
});
export const ChecksCirle = CustomNextDynamic(() => import("components/icons/checks-circle.svg"), {
  loading: IconLoading,
});
export const CalendarEmpty = CustomNextDynamic(
  () => import("components/icons/calendar-empty.svg"),
  {
    loading: IconLoading,
  }
);
export const CalendarClock = CustomNextDynamic(
  () => import("components/icons/calendar-clock.svg"),
  {
    loading: IconLoading,
  }
);
export const Email = CustomNextDynamic(() => import("components/icons/email.svg"), {
  loading: IconLoading,
});
export const Phone = CustomNextDynamic(() => import("components/icons/mobile-phone.svg"), {
  loading: IconLoading,
});
export const PlaneLand = CustomNextDynamic(() => import("components/icons/plane-land.svg"), {
  loading: IconLoading,
});
export const BedRoom = CustomNextDynamic(() => import("components/icons/bedroom.svg"), {
  loading: IconLoading,
});
export const Language = CustomNextDynamic(() => import("components/icons/language.svg"), {
  loading: IconLoading,
});
export const Guide = CustomNextDynamic(() => import("components/icons/guide.svg"), {
  loading: IconLoading,
});
export const Road = CustomNextDynamic(() => import("components/icons/road-straight.svg"), {
  loading: IconLoading,
});
export const Duration = CustomNextDynamic(() => import("components/icons/duration.svg"), {
  loading: IconLoading,
});
export const Location = CustomNextDynamic(() => import("components/icons/location.svg"), {
  loading: IconLoading,
});

export const constructCarQuickFactsCart = (
  carRental: OrderTypes.CarRental,
  activeLocale: SupportedLanguages
): SharedTypes.QuickFact[] => {
  const quickFacts = [];

  if (carRental.pickupLocation) {
    // eslint-disable-next-line functional/immutable-data
    quickFacts.push({
      id: "pickup",
      label: "Pick-up location",
      value: carRental.pickupLocation,
      Icon: CarKey,
    });
  }

  if (carRental.dropoffLocation) {
    // eslint-disable-next-line functional/immutable-data
    quickFacts.push({
      id: "dropoff",
      label: "Drop-off location",
      value: carRental.dropoffLocation,
      Icon: CarGarage,
    });
  }

  return [
    ...quickFacts,
    {
      id: "startDate",
      label: "Pick-up time",
      value: {
        key: "{dateShort} at {timeShort}",
        options: {
          dateShort: getShortMonthNumbericDateFormat(carRental.from, activeLocale),
          timeShort: getFormattedDate(carRental.from, hourMinuteFormat),
        },
      },
      translateValue: true,
      Icon: CalendarClock,
    },
    {
      id: "endDate",
      label: "Drop-off time",
      value: {
        key: "{dateShort} at {timeShort}",
        options: {
          dateShort: getShortMonthNumbericDateFormat(carRental.to, activeLocale),
          timeShort: getFormattedDate(carRental.to, hourMinuteFormat),
        },
      },
      translateValue: true,
      Icon: CalendarClock,
    },
  ];
};

export const constructCarProductProps = memoizeOne((t: TFunction) => [
  {
    title: t("Free cancellation"),
    Icon: getIcon(ProductPropId.FreeCancellation),
  },
  {
    title: t("24/7 customer support"),
    Icon: getIcon(ProductPropId.CustomerSupport),
  },
  {
    title: t("Best price guarantee"),
    Icon: getIcon(ProductPropId.BestPrice),
  },
]);

export const getInitialPaymentFormValues = ({
  defaultCartCustomerInfo,
  userProfileInfo,
  activeLocale,
}: {
  defaultCartCustomerInfo?: OrderTypes.CustomerInfo;
  userProfileInfo?: User;
  activeLocale: SupportedLanguages;
}) => {
  const nationalityCode = transformLocaleToNationality(activeLocale);

  return {
    name: {
      value: getWithDefault({
        maybeValue: userProfileInfo?.name || defaultCartCustomerInfo?.name,
        defaultValue: "",
      }),
      isValueInvalid: isNotFullName,
    },
    email: {
      value: getWithDefault({
        maybeValue: userProfileInfo?.email || defaultCartCustomerInfo?.email,
        defaultValue: "",
      }),
      isValueInvalid: isInvalidEmail,
    },
    phoneNumber: {
      value: getWithDefault({
        maybeValue: userProfileInfo?.phone || defaultCartCustomerInfo?.phoneNumber,
        defaultValue: "",
      }),
    },
    country: {
      value: getWithDefault({
        maybeValue:
          userProfileInfo?.countryCode || defaultCartCustomerInfo?.nationality || nationalityCode,
        defaultValue: SupportedLanguages.Icelandic.toUpperCase(),
      }),
      isValueInvalid: isEmptyString,
    },
    isBusinessTraveller: {
      value: false,
    },
    companyName: {
      value: "",
    },
    companyId: {
      value: "",
    },
    companyAddress: {
      value: "",
    },
    cardNumber: {
      value: "",
    },
    saveCard: {
      value: false,
    },
    termsAgreed: {
      value: false,
      isValueInvalid: isFalseBoolean,
    },
  };
};

export const constructGTETourQuickFactsCart = (tour: OrderTypes.GTETour) => {
  return [
    ...(tour.startingLocation
      ? [
          {
            id: "startingLocation",
            label: "Starts in",
            value: tour.startingLocation.locationName,
            Icon: Guide,
            translateValue: true,
          },
        ]
      : []),
    {
      id: "startsOn",
      label: "Starts on",
      value: `${getFormattedDate(tour.from, shortMonthDayFormat)}${
        tour.startTime ? ` at ${tour.startTime}` : ""
      }`,
      Icon: CalendarClock,
      translateValue: true,
    },
    ...(tour.durationText
      ? [
          {
            id: "duration",
            label: "Duration",
            value: tour.durationText,
            Icon: Duration,
            translateValue: true,
          },
        ]
      : []),
    ...(tour.guidedLanguage
      ? [
          {
            id: "guidedLanguage",
            label: "Guided language",
            value: tour.guidedLanguage.language,
            Icon: Language,
            translateValue: true,
          },
        ]
      : []),
  ];
};

export const constructTourQuickFactsCart = (
  tour: OrderTypes.Tour,
  activeLocale: SupportedLanguages
): SharedTypes.QuickFact[] => {
  const { daysDuration, nightsDuration } = getTourDuration(tour);

  switch (tour.type) {
    case TourType.SelfDrive: {
      const includes = tour.extras.find(tourExtra => tourExtra.included);

      return [
        {
          id: "dates",
          label: "Dates",
          value: `${getShortMonthNumbericDateFormat(
            tour.from,
            activeLocale
          )} - ${getShortMonthNumbericDateFormat(tour.to, activeLocale)}`,
          Icon: CalendarEmpty,
          translateValue: true,
        },
        {
          id: "accommodation",
          label: "Accommodation",
          value: {
            key: "{numberOfNights} nights",
            options: {
              numberOfNights: nightsDuration,
            },
          },
          Icon: BedRoom,
          translateValue: true,
        },
        ...(includes
          ? [
              {
                id: "launches",
                label: "Includes",
                value: includes.name,
                Icon: ChecksCirle,
              },
            ]
          : []),
        {
          id: "carRental",
          label: "Car rental",
          value: {
            key: "{numberOfDays} days",
            options: {
              numberOfDays: daysDuration,
            },
          },
          Icon: CarKey,
          translateValue: true,
        },
      ];
    }
    case TourType.Package: {
      const startDate = getShortMonthNumbericDateFormat(tour.from, activeLocale);
      const startTime = getFormattedDate(tour.from, hourMinuteFormat);
      const endDate = getShortMonthNumbericDateFormat(tour.to, activeLocale);
      const endTime = getFormattedDate(tour.to, hourMinuteFormat);

      return [
        ...(tour.startingLocation && tour.endingLocation
          ? [
              {
                id: "starts",
                label: "Starting location",
                value: tour.startingLocation.locationName,
                Icon: TourStart,
              },
              {
                id: "ends",
                label: "Ending location",
                value: tour.endingLocation.locationName,
                Icon: TourEnd,
              },
            ]
          : []),
        ...(startTime === "00:00"
          ? [
              {
                id: "startDate",
                label: "Starting date",
                value: {
                  key: "{dateShort}, Flexible",
                  options: {
                    dateShort: startDate,
                  },
                },
                Icon: CalendarClock,
                translateValue: true,
              },
            ]
          : [
              {
                id: "startDate",
                label: "Starting date",
                value: {
                  key: "{dateShort} at {timeShort}",
                  options: {
                    dateShort: startDate,
                    timeShort: startTime,
                  },
                },
                Icon: CalendarClock,
                translateValue: true,
              },
            ]),
        ...(endTime === "00:00"
          ? [
              {
                id: "endDate",
                label: "Ending date",
                value: {
                  key: "{dateShort}, Flexible",
                  options: {
                    dateShort: endDate,
                  },
                },
                Icon: CalendarClock,
                translateValue: true,
              },
            ]
          : [
              {
                id: "endDate",
                label: "Ending date",
                value: {
                  key: "{dateShort} at {timeShort}",
                  options: {
                    dateShort: endDate,
                    timeShort: endTime,
                  },
                },
                Icon: CalendarClock,
                translateValue: true,
              },
            ]),
      ];
    }
    default: {
      const tourLanguage = tour.specs.find(tourSpec => tourSpec.name === "Languages");

      return [
        ...(tour.startingLocation
          ? [
              {
                id: "starts",
                label: "Starting location",
                value: tour.startingLocation.locationName,
                Icon: TourStart,
              },
            ]
          : []),
        {
          id: "startDate",
          label: "Starts on",
          value: `${getShortMonthNumbericDateFormat(tour.from, activeLocale)}, ${getFormattedDate(
            tour.from,
            hourMinuteFormat
          )}`,
          Icon: CalendarClock,
        },
        {
          id: "ends",
          label: "Ends",
          value: `${getShortMonthNumbericDateFormat(tour.to, activeLocale)}, ${getFormattedDate(
            tour.to,
            hourMinuteFormat
          )}`,
          Icon: TourEnd,
        },
        ...(tourLanguage
          ? [
              {
                id: "language",
                label: "Guided language",
                value: tourLanguage.value,
                Icon: Language,
              },
            ]
          : []),
      ];
    }
  }
};

export const constructTourProductProps = memoizeOne(
  (valueProps: SharedTypes.QueryProductProp[]) => [
    ...valueProps.map(prop => ({
      title: prop.title,
      Icon: getIcon(prop.iconId),
      description: prop.description,
    })),
  ]
);

export const constructGTETourProductProps = memoizeOne(
  (valueProps: SharedTypes.QueryProductProp[], t: TFunction) => [
    ...valueProps.map(prop => ({
      title: prop.title,
      Icon: getIcon(prop.iconId),
    })),
    {
      title: t("24/7 customer support"),
      Icon: getIcon(ProductPropId.CustomerSupport),
    },
  ]
);

export const constructStayProductProps = memoizeOne(
  (orderT: TFunction, valueProps: SharedTypes.QueryProductProp[] = []) =>
    valueProps.map((prop: SharedTypes.QueryProductProp) => ({
      Icon: getIcon(prop.iconId),
      title: orderT(prop.title),
    }))
);

const constructCheckinOutTimeOptions = (
  date: Date,
  activeLocale: SupportedLanguages,
  overrideTimeLabel?: string
) => {
  return {
    dateShort: getShortMonthNumbericDateFormat(date, activeLocale),
    timeShort: overrideTimeLabel ?? getFormattedDate(date, hourMinuteFormat),
  };
};

export const constructStaysQuickFactsCart = (
  stay: OrderTypes.QueryStayConstruct | OrderTypes.QueryGTEStayConstruct,
  activeLocale: SupportedLanguages
): SharedTypes.QuickFact[] => {
  const quickFacts: SharedTypes.QuickFact[] = [];
  const isGTEConstructType = isGTEStayConstructType(stay);
  const specs = isGTEConstructType ? stay.product?.specs : stay.specs;
  const valueProps = isGTEStayConstructType(stay) ? stay.product?.valueProps : stay.valueProps;
  const breakfastSpec = specs?.find(({ iconId }) => iconId === ProductSpecId.HotelBreakfast);
  const cancellationProp = valueProps?.find(({ iconId }) => iconId === ProductPropId.Cancellation);

  const checkinTimeOptions = isGTEConstructType
    ? constructCheckinOutTimeOptions(
        stay.from,
        activeLocale,
        removeSecondsFromTimeString(stay.product?.timeCheckingIn || "")
      )
    : constructCheckinOutTimeOptions(stay.from, activeLocale);

  const checkinOutTimeOptions = isGTEConstructType
    ? constructCheckinOutTimeOptions(
        stay.to,
        activeLocale,
        removeSecondsFromTimeString(stay.product?.timeCheckingOut || "")
      )
    : constructCheckinOutTimeOptions(stay.to, activeLocale);
  // eslint-disable-next-line functional/immutable-data
  quickFacts.push(
    {
      id: "checkIn",
      label: "Check in",
      value: {
        key: checkinTimeOptions.timeShort ? "{dateShort} at {timeShort}" : "{dateShort}",
        options: checkinTimeOptions,
      },
      Icon: CheckInDoor,
      translateValue: true,
    },
    {
      id: "checkOut",
      label: "Check out",
      value: {
        key: checkinOutTimeOptions.timeShort ? "{dateShort} at {timeShort}" : "{dateShort}",
        options: checkinOutTimeOptions,
      },
      Icon: CheckOutDoor,
      translateValue: true,
    }
  );

  if (!isGTEConstructType && stay.rooms?.length) {
    // eslint-disable-next-line functional/immutable-data
    quickFacts.push({
      id: "rooms",
      label: "Room type",
      value: stay.rooms
        .map(staysRoom => `${staysRoom.roomBookings?.length} ${staysRoom.name}`)
        .join(", "),
      Icon: BedroomIcon,
    });
  }

  if (isGTEConstructType && stay.rooms?.length) {
    // eslint-disable-next-line functional/immutable-data
    quickFacts.push({
      id: "rooms",
      label: "Room type",
      value: stay.rooms.map(staysRoom => `${staysRoom.name}`).join(", "),
      Icon: BedroomIcon,
    });
  }

  if (breakfastSpec) {
    // eslint-disable-next-line functional/immutable-data
    quickFacts.push({
      id: "breakfast",
      label: "Breakfast",
      value: breakfastSpec.value,
      Icon: BreakfastIcon,
      translateValue: true,
    });
  }

  if (!isGTEConstructType && !breakfastSpec && cancellationProp) {
    // eslint-disable-next-line functional/immutable-data
    quickFacts.push({
      id: "cancellation",
      label: "Cancellation",
      value: cancellationProp.title,
      Icon: getIcon(ProductPropId.Cancellation),
      translateValue: true,
    });
  }

  return quickFacts;
};

// TODO: Add tests after we will have a design for this.
export const constructCustomsQuickFactsCart = (
  customProduct: OrderTypes.QueryCustomsConstruct,
  activeLocale: SupportedLanguages
): SharedTypes.QuickFact[] => {
  const quickFacts: SharedTypes.QuickFact[] = [];

  if (customProduct.description) {
    // eslint-disable-next-line functional/immutable-data
    quickFacts.push({
      id: "description",
      label: "Description",
      value: customProduct.description,
      Icon: TourStart,
    });
  }

  // eslint-disable-next-line functional/immutable-data
  if (!customProduct.isPaymentLink) {
    quickFacts.push({
      id: "Date",
      label: "Date",
      value: {
        key: "{dateShort} at {timeShort}",
        options: {
          dateShort: getShortMonthNumbericDateFormat(customProduct.from, activeLocale),
          timeShort: getFormattedDate(customProduct.from, hourMinuteFormat),
        },
      },
      Icon: CalendarEmpty,
      translateValue: true,
    });
  } else if (customProduct.isPaymentLink && customProduct.expiresAt) {
    quickFacts.push({
      id: "expires_at",
      label: "Payment expiration date",
      value: {
        key: "{dateShort} at {timeShort}",
        options: {
          dateShort: getShortMonthNumbericDateFormat(
            new Date(customProduct.expiresAt as string),
            activeLocale
          ),
          timeShort: getFormattedDate(
            new Date(customProduct.expiresAt as string),
            hourMinuteFormat
          ),
        },
      },
      Icon: CalendarClock,
      translateValue: true,
    });
  }

  if (customProduct.options?.email) {
    // eslint-disable-next-line functional/immutable-data
    quickFacts.push({
      id: "email",
      label: "Email",
      value: customProduct.options.email,
      Icon: Email,
    });
  }

  if (customProduct.options?.phone) {
    // eslint-disable-next-line functional/immutable-data
    quickFacts.push({
      id: "phone",
      label: "Phone",
      value: customProduct.options.phone,
      Icon: Phone,
    });
  }

  if (customProduct.options?.flightNumber) {
    // eslint-disable-next-line functional/immutable-data
    quickFacts.push({
      id: "email",
      label: "Flight Number",
      value: customProduct.options.flightNumber,
      Icon: PlaneLand,
    });
  }

  if (customProduct.options?.includedKm) {
    const isUnlimitedKm = customProduct.options.includedKm.unlimited;

    const distanceQuickFact = {
      id: "distance",
      label: "Included km",
      Icon: Road,
      translateValue: true,
      value: {
        key: isUnlimitedKm ? "unlimited" : "{distance} km",
        options: isUnlimitedKm
          ? undefined
          : {
              distance: customProduct.options.includedKm.km,
            },
      },
    };

    // eslint-disable-next-line functional/immutable-data
    quickFacts.push(distanceQuickFact);
  }

  if (customProduct.deliveryDate) {
    const deliveryDateQuickFact = {
      id: "delivery_date",
      label: "Delivery date",
      Icon: CalendarEmpty,
      value: getShortMonthNumbericDateFormat(
        new Date(customProduct.deliveryDate as string),
        activeLocale
      ),
    };

    // eslint-disable-next-line functional/immutable-data
    quickFacts.push(deliveryDateQuickFact);
  }

  if (customProduct.pickupLocation) {
    const pickupLocationQuickFact = {
      id: "pickup_location",
      label: "Pickup location",
      Icon: Location,
      value: customProduct.pickupLocation,
    };

    // eslint-disable-next-line functional/immutable-data
    quickFacts.push(pickupLocationQuickFact);
  }

  return quickFacts;
};

export const constructCustomProductProps = memoizeOne((t: TFunction) => [
  {
    title: t("24/7 customer support"),
    Icon: getIcon(ProductPropId.CustomerSupport),
  },
]);

export const constructVacationPackageQuickFactsCart = (
  vacationPackageProduct: OrderTypes.QueryVacationPackageConstruct,
  activeLocale: SupportedLanguages
): SharedTypes.QuickFact[] => {
  const quickFacts: SharedTypes.QuickFact[] = [];
  const { daysDuration, nightsDuration } = getTourDuration(vacationPackageProduct);

  // eslint-disable-next-line functional/immutable-data
  quickFacts.push({
    id: "Dates",
    label: "Dates",
    value: {
      key: "{dateFromShort} - {dateToShort}",
      options: {
        dateFromShort: getShortMonthNumbericDateFormat(vacationPackageProduct.from, activeLocale),
        dateToShort: getShortMonthNumbericDateFormat(vacationPackageProduct.to, activeLocale),
      },
    },
    Icon: CalendarEmpty,
    translateValue: true,
  });

  if (vacationPackageProduct.flights.length) {
    // TODO: should contains arrows between cities.
    // eslint-disable-next-line functional/immutable-data
    quickFacts.push({
      id: "flight",
      label: "Flights",
      value: vacationPackageProduct.flights[0].title || "",
      Icon: PlaneLand,
    });
  }

  if (vacationPackageProduct.stays.length) {
    // eslint-disable-next-line functional/immutable-data
    quickFacts.push({
      id: "stays",
      label: "Hotels",
      value: {
        key: "{totalNights} nights",
        options: {
          totalNights: nightsDuration,
        },
      },
      Icon: IconHouseHeart,
      translateValue: true,
    });
  }
  if (vacationPackageProduct.gteStays.length) {
    // eslint-disable-next-line functional/immutable-data
    quickFacts.push({
      id: "stays",
      label: "Hotels",
      value: {
        key: "{totalNights} nights",
        options: {
          totalNights: nightsDuration,
        },
      },
      Icon: IconHouseHeart,
      translateValue: true,
    });
  }
  if (vacationPackageProduct.cars.length) {
    // eslint-disable-next-line functional/immutable-data
    quickFacts.push({
      id: "cars",
      label: "Car rental",
      value: {
        key: "{numberOfDays} day rental",
        options: {
          numberOfDays: daysDuration,
        },
      },
      Icon: CarIcon,
      translateValue: true,
    });
  }

  return quickFacts;
};

export const constructVacationPackageProps = memoizeOne((t: TFunction) => [
  {
    title: t("Perfect travel plan"),
    Icon: getIcon(ProductPropId.TravelPlan),
  },
  {
    title: t("24/7 customer support"),
    Icon: getIcon(ProductPropId.CustomerSupport),
  },
]);

const constructDatalayerProducts = (cartData: CartTypes.CartData, marketplace: Marketplace) => [
  ...cartData.flights.map(flight => ({
    id: flight.bookingToken,
    cartItemId: flight.cartItemId,
    name: flight.title,
    price: flight.price.toString(),
    productType: Product.FLIGHT,
    marketplace,
  })),
  ...cartData.cars.map(car => ({
    id: car.offerId,
    cartItemId: car.cartItemId,
    name: car.title ?? "",
    price: car.totalPrice.toString(),
    productType: Product.CAR,
    marketplace,
  })),
  ...cartData.stays.map(stay => ({
    id: String(stay.id),
    cartItemId: stay.cartItemId,
    name: stay.title ?? "",
    price: stay.totalPrice.toString(),
    productType: Product.STAY,
    marketplace,
  })),
  ...cartData.gteStays.map(stay => ({
    id: stay.id || String(stay.product?.productId) || "",
    cartItemId: stay.cartItemId,
    name: stay.title ?? "",
    price: stay.totalPrice.toString(),
    productType: Product.GTEStay,
    marketplace,
  })),
  ...cartData.tours.map(tour => ({
    id: String(tour.tourId),
    cartItemId: tour.cartItemId,
    name: tour.title ?? "",
    price: tour.totalPrice.toString(),
    productType: Product.TOUR,
    marketplace,
  })),
  ...cartData.toursAndTickets.map(tour => ({
    id: String(tour.id),
    cartItemId: tour.cartItemId,
    name: tour.title ?? "",
    price: tour.totalPrice.toString(),
    productType: Product.GTETour,
    marketplace,
  })),
  ...cartData.vacationPackages.map(vacationPackage => ({
    id: vacationPackage.id,
    cartItemId: vacationPackage.cartItemId,
    name: vacationPackage.title ?? "",
    price: vacationPackage.totalPrice.toString(),
    productType: Product.VacationPackage,
    marketplace,
  })),
  ...cartData.customs.map(customProduct => ({
    id: customProduct.id,
    cartItemId: customProduct.cartItemId,
    name: customProduct.title ?? "",
    price: customProduct.totalPrice.toString(),
    productType:
      customProduct.type === OrderPayByLinkType.INVOICE || customProduct.invoiceNumber?.length
        ? Product.INVOICE
        : Product.CUSTOM,
    marketplace,
  })),
];

export const trackPurchase = ({
  cartData,
  bookedProducts,
  marketplace,
  paymentId,
  currency,
}: {
  cartData: CartTypes.CartData;
  bookedProducts?: CartTypes.CheckoutBookedProducts[];
  marketplace: Marketplace;
  paymentId: string;
  currency: SupportedCurrencies;
}) =>
  datalayerPurchase({
    products: constructDatalayerProducts(cartData, marketplace),
    bookedProducts,
    paymentId,
    currency,
  });

export const trackBeginCheckout = (cartData: CartTypes.CartData, marketplace: Marketplace) => {
  datalayerBeginCheckout(constructDatalayerProducts(cartData, marketplace));
};

export const getFlightsTotalPrice = (
  flights: OrderTypes.QueryFlightItineraryCart[],
  convertCurrency: (value: number) => number
) => {
  return flights.reduce((acc, flight) => {
    const { isExpiredOffer } = isExpiredFlight(flight.expiredTime);

    if (isExpiredOffer) return acc;
    return acc + Math.ceil(convertCurrency(flight.price));
  }, 0);
};

// Borrowed from here: https://stackoverflow.com/a/30106551
export const b64DecodeUnicode = (str: string) => {
  return decodeURIComponent(
    atob(str)
      .split("")
      // eslint-disable-next-line func-names
      .map(function (c) {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join("")
  );
};

export const decodeBase64String = (base64String: string) =>
  pipe(base64String, b64DecodeUnicode, JSON.parse);

export const getAdyenConfig = ({
  paymentMethodsResponse,
  activeLocale,
  onSubmit,
  onError,
  paymentConfig,
}: {
  paymentMethodsResponse: CartTypes.AdyenPaymentMethods;
  activeLocale: SupportedLanguages;
  onSubmit: (state: any) => void;
  onError: (error?: { errorMessage?: string }) => void;
  paymentConfig: CartTypes.QueryPaymentProviderConfig;
}): CoreOptions => ({
  clientKey: paymentConfig.clientKey,
  environment: paymentConfig.environment,
  paymentMethodsResponse,
  locale: activeLocale,
  onSubmit,
  onError: () => {
    onError({ errorMessage: undefined });
  },
});

export const redirectToFrontPage = ({
  marketplace,
  activeLocale,
}: {
  marketplace: Marketplace;
  activeLocale: SupportedLanguages;
}) => {
  const languagePrefix = getLanguagePrefix(activeLocale, marketplace);
  const frontPage =
    marketplace === Marketplace.GUIDE_TO_EUROPE ? PageType.GTE_FRONT_PAGE : PageType.FRONT_PAGE;
  return () => Router.push(`/${frontPage}`, `/${languagePrefix.slice(0, -1)}`);
};

const getCartOrPaymentLinkRouteSettings = ({
  paymentLinkId,
  paymentProvider,
}: {
  paymentLinkId?: string;
  paymentProvider?: OrderPaymentProvider;
}) => {
  const query = encodeQueryParams(
    {
      [PaymentLinkQueryParam.PAYMENT_LINK_ID]: StringParam,
      [CartQueryParam.PAYMENT_PROVIDER]: StringParam,
    },
    {
      [PaymentLinkQueryParam.PAYMENT_LINK_ID]: paymentLinkId,
      [CartQueryParam.PAYMENT_PROVIDER]: paymentProvider,
    }
  );
  const queryString = stringify(query);
  return {
    filteredQuery: query,
    mobilePathname: `${paymentLinkId?.length ? PageType.PAYMENT_LINK : PageType.CART}/${
      PageType.MOBILE_PAYMENT
    }`,
    pageType: paymentLinkId?.length ? PageType.PAYMENT_LINK : PageType.CART,
    queryString: queryString?.length ? `?${queryString}` : "",
  };
};

export const redirectToCartRoute = ({
  activeLocale,
  finalizeCheckoutInput,
  paymentProvider,
}: {
  activeLocale: SupportedLanguages;
  finalizeCheckoutInput?: string;
  paymentProvider?: OrderPaymentProvider;
}) => {
  const { queryString, filteredQuery, mobilePathname } = getCartOrPaymentLinkRouteSettings({
    paymentProvider,
  });
  const cleanAsPathWithoutLocale = cleanAsPath(Router.asPath, activeLocale);
  if (cleanAsPathWithoutLocale === mobilePathname) {
    return () =>
      Router.replace(
        {
          pathname: `/${PageType.CART}`,
          query: {
            finalizeCheckoutInput,
            ...filteredQuery,
          },
        },
        `${PageType.CART}${queryString}`,
        { shallow: true }
      );
  }
  return emptyFunction;
};

export const redirectToMobilePaymentRoute = ({
  activeLocale,
  finalizeCheckoutInput,
  paymentLinkId,
  paymentProvider,
}: {
  activeLocale: SupportedLanguages;
  finalizeCheckoutInput?: string;
  paymentLinkId?: string;
  paymentProvider?: OrderPaymentProvider;
}) => {
  const { queryString, filteredQuery, mobilePathname } = getCartOrPaymentLinkRouteSettings({
    paymentLinkId,
    paymentProvider,
  });
  const cleanAsPathWithoutLocale = cleanAsPath(Router.asPath, activeLocale);
  if (cleanAsPathWithoutLocale !== mobilePathname) {
    return () =>
      Router.push(
        {
          pathname: `/${PageType.MOBILE_PAYMENT}`,
          query: {
            finalizeCheckoutInput,
            ...filteredQuery,
          },
        },
        `${asPathWithoutQueryParams(Router.asPath)}/${PageType.MOBILE_PAYMENT}${queryString}`,
        { shallow: true }
      );
  }
  return emptyFunction;
};

export const onCompletedCartQuery = ({
  cartData,
  marketplace,
  activeLocale,
  isMobile,
  paymentLinkId,
  paymentProvider,
}: {
  cartData: CartTypes.CartData;
  marketplace: Marketplace;
  activeLocale: SupportedLanguages;
  isMobile: boolean;
  paymentLinkId?: string;
  paymentProvider?: OrderPaymentProvider;
}) => {
  const languagePrefix = getLanguagePrefix(activeLocale, marketplace);
  const { pageType, queryString } = getCartOrPaymentLinkRouteSettings({
    paymentLinkId,
    paymentProvider,
  });
  if (cartData.itemCount === 0) {
    redirectToFrontPage({ marketplace, activeLocale })();
  } else if (cartData.totalPrice === 0 && !paymentLinkId) {
    // On mobile users might refresh the payment page where they don't have any expired products to "search again"
    Router.push(`/${pageType}`, `/${languagePrefix}${pageType}${queryString}`);
  } else if (!paymentLinkId && cartData.itemCount === 1 && isMobile) {
    redirectToMobilePaymentRoute({ activeLocale, paymentLinkId, paymentProvider })();
  } else {
    trackBeginCheckout(cartData, marketplace);
  }
};

const getFinalizeCheckoutInput = ({
  additionalDetails,
  redirectResult,
  payload,
}: {
  additionalDetails?: { PaRes?: string; MD?: string } | { cres?: string; pares?: string };
  redirectResult?: string;
  payload?: string;
}) => {
  if (additionalDetails) {
    return JSON.stringify(additionalDetails);
  }
  if (redirectResult || payload) {
    return JSON.stringify({
      redirectResult: decodeURIComponent((redirectResult || payload) as string),
    });
  }

  return undefined;
};

export const constructFinalizeCheckoutInput = async (ctx: NextPageContext) => {
  const streamPromise = new Promise((resolve, reject) => {
    if (ctx?.req?.method === "POST") {
      let body = "";
      ctx.req.on("data", chunk => {
        body += chunk;
      });
      ctx.req.on("end", () => {
        return resolve(
          body.split("&").reduce((acc, param) => {
            const [key, value] = param.split("=");
            // MD and PaRes are passed in into the finalizedCheckout mutation, we extract
            // them specifically here to avoid any extra values being passed into the query and apollo returning an error
            if (
              key === FinalizeCheckoutAdyenParams.PaRes ||
              key === FinalizeCheckoutAdyenParams.MD ||
              key === FinalizeCheckoutSaltPayParams.cres ||
              key === FinalizeCheckoutSaltPayParams.pares
            ) {
              return {
                ...acc,
                [key]: decodeURIComponent(value),
              };
            }
            return acc;
          }, {})
        );
      });
      ctx.req.on("error", error => {
        reject(error);
      });
    }
  }).catch(error => {
    lazyCaptureException(
      new Error("Error on cart page while parsing body for finalizing checkout"),
      {
        errorInfo: {
          // @ts-ignore
          errorMessage: error.message,
        },
      }
    );
    return {};
  });

  const additionalDetails = ctx?.req?.method === "POST" ? await streamPromise : undefined;
  const { redirectResult, payload } = getQueryParamsViaLayer0(ctx);
  const finalizeCheckoutInput = getFinalizeCheckoutInput({
    additionalDetails: additionalDetails as
      | { PaRes?: string; MD?: string }
      | { cres?: string; pares?: string },
    redirectResult,
    payload,
  });

  return finalizeCheckoutInput;
};

export const getInitialProps = (ctx: NextPageContext) => {
  const { finalizeCheckoutInput, paymentLinkId } = ctx.query;
  return {
    isTopServicesHidden: true,
    isSubscriptionFormHidden: true,
    hidePageFooter: true,
    namespacesRequired: [
      Namespaces.commonNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.cartNs,
      Namespaces.orderNs,
      Namespaces.carNs,
      Namespaces.flightNs,
      Namespaces.flightSearchNs,
      Namespaces.carnectNs,
    ],
    contactUsButtonPosition: Direction.Left,
    finalizeCheckoutInput,
    paymentLinkId,
  };
};

export const collectBrowserInfo = (): CartTypes.BrowserInfo => ({
  userAgent: window.navigator?.userAgent || "",
  acceptHeader: "*/*",
  language: window.navigator?.language || "",
  colorDepth: window.screen?.colorDepth || 0,
  screenHeight: window.screen?.height || 0,
  screenWidth: window.screen?.width || 0,
  timeZoneOffset: new Date().getTimezoneOffset(),
  javaEnabled: false,
});

// TODO: Eventually change url builder util to something more hardy
export const constructPaymentRedirectUrl = ({
  activeLocale,
  paymentLinkId,
  paymentProvider,
}: {
  activeLocale: SupportedLanguages;
  paymentLinkId?: string;
  paymentProvider?: OrderPaymentProvider;
}) => {
  const url = `${constructLocalizedUrl(window.location.host, activeLocale)}/${
    PageType.PAYMENT_REDIRECT
  }`;
  const maybePaymentLinkQueryParam = paymentLinkId
    ? `${PaymentLinkQueryParam.PAYMENT_LINK_ID}=${paymentLinkId}`
    : undefined;
  if (paymentProvider === OrderPaymentProvider.PAYMAYA) {
    return `${url}?${CartQueryParam.PAYMENT_PROVIDER}=${OrderPaymentProvider.PAYMAYA}${
      maybePaymentLinkQueryParam ? `&${maybePaymentLinkQueryParam}` : ""
    }`;
  }
  return `${url}${maybePaymentLinkQueryParam ? `?${maybePaymentLinkQueryParam}` : ""}`;
};

export const constructCommonCheckoutParams = ({
  customerInfoInput,
  currency,
  activeLocale,
  ipCountryCode,
  paymentLinkId,
  paymentProvider,
}: {
  customerInfoInput: CartTypes.CustomerInfoInput;
  currency: SupportedCurrencies;
  activeLocale: SupportedLanguages;
  ipCountryCode?: string;
  paymentLinkId?: string;
  paymentProvider?: OrderPaymentProvider;
}): CartTypes.CommonCheckoutParams => {
  const { termsAgreed: termsAgreedValue, vpFlightData, ...restCustomerInfo } = customerInfoInput;

  const vpFlightCheckoutInput = vpFlightData
    ? constructFlightCartInput({
        passengers: vpFlightData.passengers,
        bookingToken: vpFlightData.bookingToken,
        currencyCode: currency as string,
      })
    : undefined;

  const vpFlightCheckoutData = vpFlightCheckoutInput
    ? [
        {
          ...vpFlightCheckoutInput,
          passengers: vpFlightCheckoutInput.passengers.map(passenger => ({
            ...passenger,
            baggage: undefined,
          })),
        },
      ]
    : undefined;

  return {
    currency,
    ipCountryCode,
    returnUrl: constructPaymentRedirectUrl({ activeLocale, paymentLinkId, paymentProvider }),
    customerInfo: restCustomerInfo,
    termsAgreed: termsAgreedValue,
    flights: vpFlightCheckoutData,
    browserInfo: collectBrowserInfo(),
  };
};

export const constructPaymentMutationParams = ({
  checkoutParams,
  saveCardParams,
  paymentLinkId,
}: {
  checkoutParams: CartTypes.CheckoutParams;
  saveCardParams?: CartTypes.SaveCardParams;
  paymentLinkId?: string;
}): PaymentLinkTypes.PayForPaymentLinkParams | CartTypes.CheckoutWithSaveCardParams => {
  const { cardToSave, flights, ...commonValues } = checkoutParams;
  const normalizedCheckoutParams = paymentLinkId ? commonValues : checkoutParams;
  return {
    ...(paymentLinkId
      ? ({
          input: {
            ...normalizedCheckoutParams,
            payByLinkId: paymentLinkId,
            saveCardParams,
          },
        } as PaymentLinkTypes.PayForPaymentLinkParams)
      : ({
          checkoutParams: {
            ...normalizedCheckoutParams,
          },
          saveCardParams,
        } as CartTypes.CheckoutWithSaveCardParams)),
  };
};

export const normalizeSaltPay3dsFormData = (formData: CartTypes.SaltPayForm3dsData) =>
  formData.reduce(
    (result, formDataItem) => {
      if (formDataItem.Name === "actionURL") {
        return {
          ...result,
          action: formDataItem.Value,
        };
      }

      return {
        ...result,
        inputs: [
          ...result.inputs,
          {
            name: formDataItem.Name,
            value: formDataItem.Value,
          },
        ],
      };
    },
    {
      action: "",
      inputs: [],
    } as CartTypes.NormalizedForm3dsData
  );

export const normalizeAdyen3dsFormData = (
  formData: CartTypes.AdyenForm3dsData,
  returnUrl: string
): CartTypes.NormalizedForm3dsData => {
  const formInputs = Object.keys(formData.data);

  return {
    action: formData.url,
    inputs: [
      ...formInputs.map((formInput: string) => ({
        name: formInput,
        value: formData.data[formInput],
      })),
      {
        name: "TermUrl",
        value: returnUrl,
      },
    ],
  };
};

const extractYear = (expYear: string): string => {
  return expYear.slice(-2);
};

const constructCCPaymentConfig = (creditCardConfig: CartTypes.AdjustedAdyenPaymentMethod) => ({
  adyenAmount: creditCardConfig.adyenAmount,
  adyenCurrency: creditCardConfig.adyenCurrency,
  totalAmount: creditCardConfig.totalAmount,
  totalCurrency: creditCardConfig.totalCurrency,
  ...(creditCardConfig.paymentFeePercentage
    ? {
        paymentFeePercentage: creditCardConfig.paymentFeePercentage,
      }
    : {}),
});

export const normalizeSaltPaySavedCards = ({
  savedCards,
  creditCardConfig,
}: {
  savedCards?: CartTypes.QuerySaltPaySavedCard[];
  creditCardConfig?: CartTypes.AdjustedAdyenPaymentMethod;
}): CartTypes.PaymentMethod[] =>
  savedCards
    ? savedCards.map((savedCardItem, index) => ({
        id: `${savedCardItem.id}`,
        index,
        type: PaymentMethodType.SAVED_CARD,
        name: `**** ${savedCardItem.pan.slice(-4)}`,
        provider: OrderPaymentProvider.SALTPAY,
        cardType: savedCardItem.cardType,
        pan: savedCardItem.pan,
        expMonth: savedCardItem.expMonth,
        expYear: extractYear(savedCardItem.expYear),
        firstName: savedCardItem.firstName,
        lastName: savedCardItem.lastName,
        businessId: savedCardItem.businessId,
        businessName: savedCardItem.businessName,
        businessAddress: savedCardItem.businessAddress,
        isUsersPrimaryCard: savedCardItem.isUsersPrimaryCard,
        ...(creditCardConfig ? constructCCPaymentConfig(creditCardConfig) : {}),
      }))
    : [];

export const normalizeAdyenPaymentMethods = ({
  paymentMethods,
  isMobile,
}: {
  paymentMethods?: CartTypes.AdjustedAdyenPaymentMethod[];
  isMobile: boolean;
}): CartTypes.PaymentMethod[] => {
  const supportedPaymentMethods = Object.values(PaymentMethodType);
  const isWeChatApp = navigator.userAgent.toLowerCase().includes("micromessenger");
  const shouldDisableWeChat = isMobile && !isWeChatApp;
  const shouldUseMobileAlipay =
    isMobile && paymentMethods?.some(({ type }) => type === PaymentMethodType.ALI_PAY_MOBILE);

  return paymentMethods
    ? paymentMethods
        .filter(({ type }) => supportedPaymentMethods.includes(type as PaymentMethodType))
        .filter(({ type }) => {
          // If you are on mobile but not within the WeChat app, you cannot pay with WeChat, we need to block everything
          if (shouldDisableWeChat) {
            return type !== PaymentMethodType.WECHAT_QR && type !== PaymentMethodType.WECHAT_PAY;
          }
          // If you are in the WeChat app, you can pay as expected using redirets
          if (isMobile) {
            return type !== PaymentMethodType.WECHAT_QR;
          }
          // If you are on desktop you need to use QR code
          return type !== PaymentMethodType.WECHAT_PAY;
        })
        .filter(({ type }) =>
          shouldUseMobileAlipay
            ? type !== PaymentMethodType.ALI_PAY
            : type !== PaymentMethodType.ALI_PAY_MOBILE
        )
        .filter(({ type }) => !(type === PaymentMethodType.APPLE_PAY && !window.ApplePaySession))
        .map(paymentMethod => ({
          id: paymentMethod.name,
          configuration: paymentMethod.configuration,
          details: paymentMethod.details as CartTypes.PaymentMethodDetails[],
          issuers: paymentMethod.issuers as CartTypes.PaymentMethodDetailsIssuer[],
          brands: paymentMethod.brands as CardType[],
          provider: OrderPaymentProvider.ADYEN,
          ...paymentMethod,
        }))
    : [];
};

const normalizePayMayaPaymentMethodName = (paymentMethod: PaymentMethodName) => {
  switch (paymentMethod) {
    case PaymentMethodName.MAYA_CREDIT_CARD:
      return "Credit Card";
    case PaymentMethodName.MAYA_QR:
      return "QR Payment";
    case PaymentMethodName.MAYA_WALLET_SINGLE_PAYMENT:
      return "Wallet & QR";
    default:
      return paymentMethod;
  }
};

export const normalizePayMayaPaymentMethods = (
  paymentMethods?: CartTypes.AdjustedAdyenPaymentMethod[]
) => {
  const supportedPaymentMethods = Object.values(PaymentMethodType);
  return paymentMethods
    ? paymentMethods
        .filter(({ type }) => supportedPaymentMethods.includes(type as PaymentMethodType))
        .map(paymentMethod => ({
          id: paymentMethod.type,
          configuration: paymentMethod.configuration,
          details: paymentMethod.details as CartTypes.PaymentMethodDetails[],
          issuers: paymentMethod.issuers as CartTypes.PaymentMethodDetailsIssuer[],
          brands: paymentMethod.brands as CardType[],
          provider: OrderPaymentProvider.PAYMAYA,
          ...paymentMethod,
          paymentType: paymentMethod.paymentType ?? PaymentMethodOrderType.UNKNOWN,
          name: normalizePayMayaPaymentMethodName(paymentMethod.name as PaymentMethodName),
        }))
    : [];
};

export const normalizeAdyenSavedCards = ({
  savedCards,
  adyenSavedCards,
  creditCardConfig,
}: {
  adyenSavedCards?: CartTypes.StoredAdyenCards[];
  savedCards: CartTypes.QuerySaltPaySavedCard[];
  creditCardConfig?: CartTypes.AdjustedAdyenPaymentMethod;
}): CartTypes.PaymentMethod[] => {
  return adyenSavedCards
    ? adyenSavedCards.map((adyenCardItem, index) => {
        const currSavedCard: CartTypes.QuerySaltPaySavedCard | undefined = savedCards.find(
          card =>
            card.pan.slice(card.pan.length - 4) === adyenCardItem.lastFour &&
            card.expMonth === adyenCardItem.expiryMonth
        );
        return {
          id: `${adyenCardItem.id}`,
          index,
          type: PaymentMethodType.SAVED_CARD,
          name: `**** ${adyenCardItem.lastFour}`,
          provider: OrderPaymentProvider.ADYEN,
          cardType: adyenCardItem.name as CardType,
          businessId: currSavedCard?.businessId,
          businessName: currSavedCard?.businessName,
          businessAddress: currSavedCard?.businessAddress,
          isUsersPrimaryCard: currSavedCard?.isUsersPrimaryCard ?? false,
          pan: currSavedCard?.pan,
          ...(creditCardConfig ? constructCCPaymentConfig(creditCardConfig) : {}),
        };
      })
    : [];
};

export const DEFAULT_CREDIT_CARD_PAYMENT_METHOD = (
  activePaymentProvider?: OrderPaymentProvider
) => ({
  id: "creditCard",
  type:
    activePaymentProvider && activePaymentProvider === OrderPaymentProvider.PAYMAYA
      ? PaymentMethodType.MAYA_CREDIT_CARD
      : PaymentMethodType.CREDIT_CARD,
  name: "Credit Card",
});

export const constructPaymentMethods = ({
  savedAdyenCards,
  normalizedAdyenPaymentMethods,
  normalizedSaltPaySavedCards,
  isSaltPayProviderActive,
}: {
  savedAdyenCards: CartTypes.PaymentMethod[];
  normalizedAdyenPaymentMethods: CartTypes.PaymentMethod[];
  normalizedSaltPaySavedCards: CartTypes.PaymentMethod[];
  isSaltPayProviderActive: boolean;
}): CartTypes.PaymentMethod[] => {
  const constructedPaymentMethods = normalizedAdyenPaymentMethods.reduce(
    (resultPaymentMethodsInfo, paymentMethod) => {
      const { type } = paymentMethod;

      if (type === PaymentMethodType.CREDIT_CARD || type === PaymentMethodType.MAYA_CREDIT_CARD) {
        return resultPaymentMethodsInfo;
      }

      // We want to show only 1 Klarna icon and dropdown with all possible options.
      if (
        type === PaymentMethodType.KLARNA_PAY_NOW ||
        type === PaymentMethodType.KLARNA_PAY_LATER ||
        type === PaymentMethodType.KLARNA_PAY_OVER
      ) {
        if (!resultPaymentMethodsInfo.hasKlarnaPaymentMethod) {
          return {
            hasKlarnaPaymentMethod: true,
            paymentMethods: [
              ...resultPaymentMethodsInfo.paymentMethods,
              {
                ...paymentMethod,
                name: PaymentMethodName.KLARNA,
              },
            ],
          };
        }

        return resultPaymentMethodsInfo;
      }

      // Sofort has translated name in adyen, but we don't want to show it
      if (type === PaymentMethodType.SOFORT) {
        return {
          ...resultPaymentMethodsInfo,
          paymentMethods: [
            ...resultPaymentMethodsInfo.paymentMethods,
            {
              ...paymentMethod,
              name: PaymentMethodName.SOFORT,
            },
          ],
        };
      }

      return {
        ...resultPaymentMethodsInfo,
        paymentMethods: [...resultPaymentMethodsInfo.paymentMethods, paymentMethod],
      };
    },
    {
      paymentMethods: [],
      hasKlarnaPaymentMethod: false,
    } as {
      paymentMethods: CartTypes.PaymentMethod[];
      hasKlarnaPaymentMethod: boolean;
    }
  ).paymentMethods;

  const creditCardPaymentMethod = {
    ...(normalizedAdyenPaymentMethods.find(
      paymentMethod => paymentMethod.type === PaymentMethodType.CREDIT_CARD
    ) || DEFAULT_CREDIT_CARD_PAYMENT_METHOD()),
    provider: isSaltPayProviderActive ? OrderPaymentProvider.SALTPAY : OrderPaymentProvider.ADYEN,
  } as CartTypes.PaymentMethod;

  return [
    ...(isSaltPayProviderActive ? normalizedSaltPaySavedCards : savedAdyenCards),
    creditCardPaymentMethod,
    ...constructedPaymentMethods,
  ].sort((a, b) => Number(b.isUsersPrimaryCard ?? 0) - Number(a.isUsersPrimaryCard ?? 0));
};

export const constructExpiredVPSearchLink = (
  isExpiredOffer: boolean,
  vacationPackageProduct: OrderTypes.QueryVacationPackageConstruct
): SharedTypes.ClientRoute | undefined => {
  if (isExpiredOffer && Boolean(vacationPackageProduct.searchLink)) {
    const { searchLink } = vacationPackageProduct;
    const { query: queryParams = {} } = parseUrl(searchLink!);
    const query = decodeQueryParams(VPQueryParamScheme, queryParams) as VPQueryParamsType;

    return {
      route: PageType.VACATION_PACKAGES_LANDING,
      as: searchLink!,
      query,
    };
  }
  return undefined;
};

export const constructExpiredGTETourSearchLink = (
  isExpiredOffer: boolean,
  gteTourProduct: OrderTypes.QueryGTETour
): SharedTypes.ClientRoute | undefined => {
  if (isExpiredOffer && Boolean(gteTourProduct.linkUrl)) {
    const { linkUrl } = gteTourProduct;
    const { query: queryParams = {} } = parseUrl(linkUrl);
    const query = decodeQueryParams(
      TourSearchQueryParamsScheme,
      queryParams
    ) as TourSearchQueryParamsType;

    return {
      route: PageType.GTE_TOUR,
      as: linkUrl,
      query,
    };
  }
  return undefined;
};

export const getHTMLCartTitle = (
  marketplace: Marketplace,
  websiteName: string,
  tFunction: TFunction
) => {
  switch (marketplace) {
    case Marketplace.GUIDE_TO_EUROPE:
      return getMetadataTitle(tFunction("Your trip to Europe"), websiteName);
    case Marketplace.GUIDE_TO_THE_PHILIPPINES:
      return getMetadataTitle(tFunction("Your trip to the Philippines"), websiteName);
    default:
      return getMetadataTitle(tFunction("Your trip to Iceland"), websiteName);
  }
};

// https://docs.adyen.com/development-resources/live-endpoints#checkout-js-endpoints
export const getAdyenCheckoutShopperUrl = (adyenEnvironment: OrderPaymentEnvironment) =>
  `https://checkoutshopper-${adyenEnvironment}.adyen.com/checkoutshopper`;

export const constructSingularTourType = (tourType: TourType) => {
  switch (tourType) {
    case TourType.Day:
      return TourType.Day.slice(0, -1);
    case TourType.Package:
      return TourType.Package.slice(0, -1);
    case TourType.SelfDrive:
      return TourType.SelfDrive.slice(0, -1);
    case TourType.MultiDay:
      return TourType.MultiDay.slice(0, -1);
    case TourType.Bundle:
      return TourType.Bundle.slice(0, -1);
    case TourType.SpecialOffer:
      return TourType.SpecialOffer.slice(0, -1);
    default:
      return tourType;
  }
};

export const checkIfAdyenOnlyCardType = (
  activePaymentProvider: OrderPaymentProvider,
  cardType?: CardType
): boolean => {
  if (activePaymentProvider !== OrderPaymentProvider.PAYMAYA) {
    const isAmexCard = cardType === CardType.AMEX;
    const isUnionPayCard = cardType === CardType.UNIONPAY;
    const isCarteBancaireCard = cardType === CardType.CARTE_BANCAIRE;

    return isAmexCard || isUnionPayCard || isCarteBancaireCard;
  }
  return false;
};

export const getVPTitles = (vps: OrderTypes.QueryVacationPackageProduct[]) => {
  const tripTitles = vps.map(vp => {
    return vp.title;
  });
  if (tripTitles.length > 1) {
    return tripTitles.join(" & ");
  }
  return tripTitles[0] ?? "VacationPackage";
};

export const getPaymentSuccessRedirectUrl = ({
  activeLocale,
  hasVPInCart,
  forgotPasswordLink,
  userCreated,
  isPaymentLink,
}: {
  activeLocale: SupportedLanguages;
  hasVPInCart?: boolean;
  forgotPasswordLink?: string;
  userCreated?: boolean;
  isPaymentLink?: boolean;
}) => {
  let isPasswordLink = false;
  const paymentReceiptLink = `${constructLocalizedUrl(window.location.host, activeLocale)}/${
    PageType.PAYMENT_RECEIPT
  }`;
  const voucherLink = `${constructLocalizedUrl(window.location.host, activeLocale)}/${
    PageType.VOUCHER
  }`;
  const redirectLink = isPaymentLink ? paymentReceiptLink : voucherLink;
  const pBLink = `${constructLocalizedUrl(window.location.host, activeLocale)}/my-trips`;

  if (hasVPInCart && userCreated === false) return { isPasswordLink, redirectLink: pBLink };
  if (hasVPInCart && forgotPasswordLink && userCreated) {
    isPasswordLink = true;
    return { isPasswordLink, redirectLink: forgotPasswordLink };
  }
  return { isPasswordLink, redirectLink };
};

export const getCurrentSessionId = (marketplace: Marketplace) => {
  let sessionCookie: { key: string; value?: string };
  const appSessionValue = getCookie("appSession");

  switch (marketplace) {
    case Marketplace.GUIDE_TO_EUROPE:
      sessionCookie = {
        key: MarketplaceSessionCookie.GTE,
        value: getCookie(MarketplaceSessionCookie.GTE),
      };
      break;
    case Marketplace.ICELAND_PHOTO_TOURS:
      sessionCookie = {
        key: MarketplaceSessionCookie.IPT,
        value: getCookie(MarketplaceSessionCookie.IPT),
      };
      break;
    case Marketplace.GUIDE_TO_THE_PHILIPPINES:
      sessionCookie = {
        key: MarketplaceSessionCookie.GTTP,
        value: getCookie(MarketplaceSessionCookie.GTTP),
      };
      break;
    default:
      sessionCookie = {
        key: MarketplaceSessionCookie.GTI,
        value: getCookie(MarketplaceSessionCookie.GTI),
      };
      break;
  }
  return appSessionValue
    ? { appSession: appSessionValue }
    : { [sessionCookie.key]: sessionCookie.value };
};

export const normalizeAdyenConfiguration = (configArray?: CartTypes.PaymentMethodConfiguration[]) =>
  configArray?.reduce(
    (currentConfig, configItem) => ({
      ...currentConfig,
      [configItem.key]: configItem.value,
    }),
    {}
  );

export const getEachPaymentProviderConfig = (
  paymentProviders: CartTypes.QueryPaymentProviderConfig[]
) =>
  paymentProviders.reduce(
    (acc, curr) => ({
      adyenPaymentConfig:
        !acc.adyenPaymentConfig && curr.provider === OrderPaymentProvider.ADYEN
          ? curr
          : acc.adyenPaymentConfig,
      saltPayPaymentConfig:
        !acc.saltPayPaymentConfig && curr.provider === OrderPaymentProvider.SALTPAY
          ? curr
          : acc.saltPayPaymentConfig,
      payMayaPaymentConfig:
        !acc.payMayaPaymentConfig && curr.provider === OrderPaymentProvider.PAYMAYA
          ? curr
          : acc.payMayaPaymentConfig,
    }),
    {
      payMayaPaymentConfig: undefined,
      adyenPaymentConfig: undefined,
      saltPayPaymentConfig: undefined,
    } as {
      payMayaPaymentConfig?: CartTypes.QueryPaymentProviderConfig;
      adyenPaymentConfig?: CartTypes.QueryPaymentProviderConfig;
      saltPayPaymentConfig?: CartTypes.QueryPaymentProviderConfig;
    }
  );

export const getActivePaymentConfig = ({
  activePaymentProvider,
  saltPayPaymentConfig,
  adyenPaymentConfig,
  payMayaPaymentConfig,
}: {
  activePaymentProvider: OrderPaymentProvider;
  saltPayPaymentConfig?: CartTypes.QueryPaymentProviderConfig;
  adyenPaymentConfig?: CartTypes.QueryPaymentProviderConfig;
  payMayaPaymentConfig?: CartTypes.QueryPaymentProviderConfig;
}) => {
  switch (activePaymentProvider) {
    case OrderPaymentProvider.ADYEN:
      return adyenPaymentConfig;
    case OrderPaymentProvider.PAYMAYA:
      return payMayaPaymentConfig;
    default:
      return saltPayPaymentConfig;
  }
};

export const getPayMayaBaseURL = (environment: OrderPaymentEnvironment) =>
  environment === OrderPaymentEnvironment.DEVELOPMENT ||
  environment === OrderPaymentEnvironment.TEST
    ? "pg-sandbox.paymaya.com"
    : "pg.paymaya.com";
