import React from "react";
import { flatten } from "fp-ts/lib/Array";

import { EditableStatus } from "../types/VoucherEnums";
import PendingBookingNumber from "../PendingBookingNumber";
import { getTotalNumberOfPassengers } from "../../FlightSearchPage/utils/flightSearchUtils";

import { useIsMobile, useIsPrint } from "hooks/useMediaQueryCustom";
import { SupportedLanguages } from "types/enums";
import {
  constructCarRentalPaymentDetails,
  constructCarRentalsServiceDetails,
  constructCartCarRentals,
  constructCartFlights,
  constructCartStays,
  constructCartTours,
  constructCartVacationPackages,
  constructCustomProducts,
  constructCustomsServiceDetails,
  constructFlightServiceDetails,
  constructPaymentDetails,
  constructStayServiceDetails,
  constructTourServiceDetails,
  constructVacationProductServiceDetails,
  constructGTETourServiceDetails,
  constructCartGTETours,
  constructGTECartStays,
  constructGTEStayServiceDetails,
  constructGTEStayRoomDetails,
} from "components/ui/Order/utils/orderUtils";
import { toLocalizedLongDateFormat } from "utils/dateUtils";
import { getHourDaysMinutesDuration } from "utils/helperUtils";
import { OrderResultCode, PaymentMethodType } from "components/features/Cart/types/cartEnums";
import { PostBookingTypes } from "components/features/PostBooking/types/postBookingTypes";
import { fallbackCarPickupData } from "components/features/PostBooking/REMOVE_POST_BOOKING_MOCK_DATA";
import { capitalize } from "utils/globalUtils";

export const constructCustomerInfoSectionDetails = ({
  customerInfo,
  t,
  isVoucherReady,
  shouldStartFromNewLine = false,
}: {
  customerInfo: OrderTypes.CustomerInfo;
  t: TFunction;
  isVoucherReady?: boolean;
  shouldStartFromNewLine?: boolean;
}) => [
  ...(customerInfo.name
    ? [
        {
          label: t("Name"),
          values: [`${customerInfo.name}${customerInfo.surname ? ` ${customerInfo.surname}` : ""}`],
          shouldStartFromNewLine,
        },
      ]
    : []),
  ...(customerInfo.email || !isVoucherReady
    ? [
        {
          label: t("Email"),
          values: [customerInfo.email ?? null],
        },
      ]
    : []),
  ...(customerInfo.phoneNumber
    ? [
        {
          label: t("Phone"),
          values: [customerInfo.phoneNumber],
        },
      ]
    : []),
  ...(customerInfo.nationality
    ? [
        {
          label: t("Nationality"),
          values: [customerInfo.nationality.toUpperCase()],
        },
      ]
    : []),
  ...(customerInfo.companyName
    ? [
        {
          label: t("Company name"),
          values: [customerInfo.companyName],
        },
      ]
    : []),
  ...(customerInfo.companyId
    ? [
        {
          label: t("Company ID"),
          values: [customerInfo.companyId],
        },
      ]
    : []),
  ...(customerInfo.companyAddress
    ? [
        {
          label: t("Company address"),
          values: [customerInfo.companyAddress],
        },
      ]
    : []),
];

export const constructCustomerInfoSection = ({
  isPayerInfo,
  customerInfo,
  t,
}: {
  isPayerInfo?: boolean;
  customerInfo: OrderTypes.CustomerInfo;
  t: TFunction;
}) => ({
  title: isPayerInfo ? t("Customer details") : t("Traveler details"),
  sections: constructCustomerInfoSectionDetails({
    customerInfo,
    t,
  }),
});

export const constructFlightCustomerInfoSection = ({
  customerInfo,
  t,
  isVoucherReady,
}: {
  customerInfo: OrderTypes.CustomerInfo[];
  t: TFunction;
  isVoucherReady?: boolean;
}) => ({
  title: t("Traveler details"),
  sections: flatten(
    customerInfo.map((info, index) =>
      constructCustomerInfoSectionDetails({
        customerInfo: info,
        t,
        isVoucherReady,
        shouldStartFromNewLine: index === 1,
      })
    )
  ),
});

export const constructBookingDetails = ({
  bookingNumber,
  externalId,
  bookingDate,
  activeLocale,
  t,
  orderInfo,
  productTitle,
  carInfo: {
    vendorName,
    rateCode,
    accountingNumber,
    aVNumber,
    iata,
    vendorBookingReference,
    emergencyPhone,
  } = {
    vendorName: undefined,
    rateCode: undefined,
    accountingNumber: undefined,
    aVNumber: undefined,
    iata: undefined,
    vendorBookingReference: undefined,
    emergencyPhone: undefined,
  },
}: {
  bookingNumber: string;
  bookingDate: string;
  externalId?: string;
  activeLocale: SupportedLanguages;
  t: TFunction;
  orderInfo: VoucherTypes.OrderInfo;
  productTitle?: string;
  carInfo?: {
    vendorName?: string;
    emergencyPhone?: string;
  } & VoucherTypes.VoucherQueryCarnect;
}) => ({
  title: t("Booking details"),
  sections: [
    ...(productTitle
      ? [
          {
            label: t("Product name"),
            values: [productTitle],
          },
        ]
      : []),
    {
      label: t("Booking number"),
      values: [
        orderInfo.orderStatus === OrderResultCode.PENDING && orderInfo.displayedPaymentMethod ? (
          <PendingBookingNumber paymentMethod={orderInfo.displayedPaymentMethod} />
        ) : (
          bookingNumber
        ),
      ],
    },
    {
      label: t("Booking date"),
      values: [toLocalizedLongDateFormat(new Date(bookingDate), activeLocale)],
    },
    ...(vendorName
      ? [
          {
            label: t("Supplier"),
            values: [vendorName],
          },
        ]
      : []),
    ...(vendorBookingReference
      ? [
          {
            label: t("Your car rental reservation number"),
            values: [vendorBookingReference],
          },
        ]
      : []),
    ...(aVNumber
      ? [
          {
            label: t("AV. NO"),
            values: [aVNumber],
          },
        ]
      : []),
    ...(iata
      ? [
          {
            label: t("IATA-No"),
            values: [iata],
          },
        ]
      : []),
    ...(accountingNumber
      ? [
          {
            label: t("Accounting nr."),
            values: [accountingNumber],
          },
        ]
      : []),
    ...(rateCode
      ? [
          {
            label: t("Ratecode"),
            values: [rateCode],
          },
        ]
      : []),
    ...(emergencyPhone
      ? [
          {
            label: t("Emergency phone"),
            values: [emergencyPhone],
          },
        ]
      : []),
    ...(externalId && orderInfo.orderStatus !== OrderResultCode.PENDING
      ? [
          {
            label: t("Ticket number"),
            values: [externalId],
          },
        ]
      : []),
  ],
});

export const constructFlightCustomerInfo = ({
  customerInfo,
  passengers,
}: {
  customerInfo?: OrderTypes.CustomerInfo;
  passengers: OrderTypes.CustomerInfo[];
}) => {
  if (!passengers?.length && customerInfo) {
    return [customerInfo];
  }
  return customerInfo
    ? ([
        ...passengers,
        ...[
          {
            companyName: customerInfo.companyName,
            companyId: customerInfo.companyId,
            companyAddress: customerInfo.companyAddress,
          },
        ],
      ] as unknown as OrderTypes.CustomerInfo[])
    : passengers;
};

export const constructFlightVoucher = ({
  activeLocale,
  queryFlight,
  t,
  orderInfo,
  productTitle,
  isPaymentDetailsHidden,
  isVoucherReady,
  customerInfo,
}: {
  activeLocale: SupportedLanguages;
  currency: string;
  queryFlight: VoucherTypes.VoucherQueryFlight;
  t: TFunction;
  convertCurrency: (value: number) => number;
  orderInfo: VoucherTypes.OrderInfo;
  productTitle?: string;
  isPaymentDetailsHidden?: boolean;
  isVoucherReady: boolean;
  customerInfo?: OrderTypes.CustomerInfo;
}) => {
  const flight = constructCartFlights([queryFlight.cart], t)[0];
  const totalPassengers = getTotalNumberOfPassengers(flight);
  // We need to fill the passengers details with empty values to show skeletons.
  const flightPassengers: OrderTypes.CustomerInfo[] =
    isVoucherReady || queryFlight?.passengers?.length
      ? queryFlight.passengers
      : new Array(totalPassengers).fill({
          name: "",
          email: "",
          nationality: "",
        });

  return [
    constructBookingDetails({
      bookingNumber: queryFlight.bookingNumber,
      externalId: queryFlight.externalId,
      bookingDate: queryFlight.bookingDate,
      activeLocale,
      t,
      orderInfo,
      productTitle,
    }),
    constructFlightCustomerInfoSection({
      customerInfo: constructFlightCustomerInfo({
        customerInfo,
        passengers: flightPassengers,
      }),
      t,
      isVoucherReady,
    }),
    constructFlightServiceDetails({
      flight,
      orderT: t,
      activeLocale,
    }),
    ...(!isPaymentDetailsHidden
      ? [
          constructPaymentDetails({
            vatAmount: queryFlight.vatAmount,
            voucherPriceObjects: queryFlight.voucherPriceObjects,
            vatPercentage: queryFlight.vatPercentage,
            orderT: t,
            shouldShowVat: false,
          }),
        ]
      : []),
  ];
};

export const constructTourVoucher = ({
  activeLocale,
  queryTour,
  t,
  customerInfoSection,
  orderInfo,
  productTitle,
  isPaymentDetailsHidden,
}: {
  activeLocale: SupportedLanguages;
  currency: string;
  queryTour: VoucherTypes.VoucherQueryTour;
  t: TFunction;
  convertCurrency: (value: number) => number;
  customerInfoSection: OrderTypes.VoucherProduct;
  orderInfo: VoucherTypes.OrderInfo;
  productTitle?: string;
  isPaymentDetailsHidden?: boolean;
}) => {
  return [
    constructBookingDetails({
      bookingNumber: queryTour.bookingNumber,
      externalId: queryTour.externalId,
      bookingDate: queryTour.bookingDate,
      activeLocale,
      t,
      orderInfo,
      productTitle,
    }),
    customerInfoSection,
    constructTourServiceDetails({
      tour: constructCartTours([queryTour.cart])[0],
      orderT: t,
      tourVoucherInfo: {
        provider: queryTour.provider,
      },
    }),
    ...(!isPaymentDetailsHidden
      ? [
          constructPaymentDetails({
            vatAmount: queryTour.vatAmount,
            voucherPriceObjects: queryTour.voucherPriceObjects,
            priceObject: null,
            vatPercentage: queryTour.vatPercentage,
            orderT: t,
          }),
        ]
      : []),
  ];
};

export const constructGTETourCustomerInfoSection = ({
  tourCustomerInfo,
  customerInfo,
  t,
}: {
  tourCustomerInfo?: GTETourBookingWidgetTypes.MutationBookingQuestionAnswer[];
  customerInfo?: OrderTypes.CustomerInfo;
  t: TFunction;
}) => {
  let travelerNumber = tourCustomerInfo?.[0]?.travelerNum ?? 0;
  const tourTravelerSections = tourCustomerInfo
    ? tourCustomerInfo.map(info => {
        let shouldStartFromNewLine = false;
        if (travelerNumber !== info.travelerNum) {
          shouldStartFromNewLine = true;
          travelerNumber = info.travelerNum ?? 0;
        }
        return {
          label: `Traveler ${info.travelerNum ?? 1} ${info.label ? info.label.toLowerCase() : ""}`,
          values: [
            `${info.answer ? capitalize(info.answer.toLowerCase()) : ""} ${info.unit || ""}`,
          ],
          shouldStartFromNewLine,
        };
      })
    : [];

  const sections = [
    ...tourTravelerSections,
    ...(customerInfo?.companyName
      ? [
          {
            label: t("Company name"),
            values: [customerInfo.companyName],
          },
        ]
      : []),
    ...(customerInfo?.companyId
      ? [
          {
            label: t("Company ID"),
            values: [customerInfo.companyId],
          },
        ]
      : []),
    ...(customerInfo?.companyAddress
      ? [
          {
            label: t("Company address"),
            values: [customerInfo.companyAddress],
          },
        ]
      : []),
  ];

  return {
    title: t("Traveler details"),
    sections,
  };
};

export const constructGTETourVoucher = ({
  activeLocale,
  queryTour,
  t,
  orderInfo,
  productTitle,
  isPaymentDetailsHidden,
  customerInfo,
}: {
  activeLocale: SupportedLanguages;
  currency: string;
  queryTour: VoucherTypes.VoucherQueryGTETour;
  t: TFunction;
  convertCurrency: (value: number) => number;
  orderInfo: VoucherTypes.OrderInfo;
  productTitle?: string;
  isPaymentDetailsHidden?: boolean;
  customerInfo?: OrderTypes.CustomerInfo;
}) => {
  const tourCustomerInfo = queryTour.cart.bookingQuestionAnswers.filter(
    info => info.travelerNum != null
  );

  const hasCompanyInformation = customerInfo
    ? customerInfo?.companyName || customerInfo?.companyId
    : false;

  return [
    constructBookingDetails({
      bookingNumber: queryTour.bookingNumber,
      externalId: queryTour.externalId,
      bookingDate: queryTour.bookingDate,
      activeLocale,
      t,
      orderInfo,
      productTitle,
    }),
    // eslint-disable-next-line no-nested-ternary
    ...(tourCustomerInfo.length > 0 || hasCompanyInformation
      ? [constructGTETourCustomerInfoSection({ tourCustomerInfo, t, customerInfo })]
      : customerInfo
      ? [constructCustomerInfoSection({ customerInfo, t })]
      : []),
    constructGTETourServiceDetails({
      tour: constructCartGTETours([queryTour.cart])[0],
      orderT: t,
    }),
    ...(!isPaymentDetailsHidden
      ? [
          constructPaymentDetails({
            vatAmount: queryTour.vatAmount,
            voucherPriceObjects: queryTour.voucherPriceObjects,
            vatPercentage: queryTour.vatPercentage,
            orderT: t,
          }),
        ]
      : []),
  ];
};

export const constructCarVoucher = ({
  activeLocale,
  queryCar,
  t,
  customerInfoSection,
  carnectT,
  orderInfo,
  productTitle,
  isPaymentDetailsHidden,
}: {
  activeLocale: SupportedLanguages;
  currency: string;
  queryCar: VoucherTypes.VoucherQueryCar;
  t: TFunction;
  carnectT: TFunction;
  convertCurrency: (value: number) => number;
  customerInfoSection: OrderTypes.VoucherProduct;
  orderInfo: VoucherTypes.OrderInfo;
  productTitle?: string;
  isPaymentDetailsHidden?: boolean;
}) => {
  const carRental = constructCartCarRentals("", [queryCar.cart])[0];
  const { paymentAmount, paymentCurrency } = orderInfo;
  return [
    constructBookingDetails({
      bookingNumber: queryCar.bookingNumber,
      externalId: queryCar.externalId,
      bookingDate: queryCar.bookingDate,
      carInfo: {
        vendorName: queryCar.cart.vendor?.name,
        rateCode: queryCar.rateCode,
        accountingNumber: queryCar.accountingNumber,
        aVNumber: queryCar.aVNumber,
        iata: queryCar.iata,
        vendorBookingReference: queryCar.vendorBookingReference,
        emergencyPhone: queryCar.cart.locationDetails?.pickup?.phoneNumber,
      },
      activeLocale,
      t,
      orderInfo,
      productTitle,
    }),
    customerInfoSection,
    constructCarRentalsServiceDetails({
      carRental,
      activeLocale,
      orderT: t,
      carnectT,
    }),
    ...(!isPaymentDetailsHidden
      ? [
          constructCarRentalPaymentDetails({
            carRental,
            orderT: t,
            carnectT,
            vatAmount: queryCar.vatAmount,
            voucherPriceObjects: queryCar.voucherPriceObjects,
            vatPercentage: queryCar.vatPercentage,
            paymentAmount,
            paymentCurrency,
          }),
        ]
      : []),
  ];
};

export const constructStayVoucher = ({
  queryStay,
  activeLocale,
  t,
  customerInfoSection,
  orderInfo,
  productTitle,
  isPaymentDetailsHidden,
  isGTE,
}: {
  queryStay: VoucherTypes.VoucherQueryStay;
  t: TFunction;
  activeLocale: SupportedLanguages;
  customerInfoSection: OrderTypes.VoucherProduct;
  convertCurrency: (value: number) => number;
  currency: string;
  orderInfo: VoucherTypes.OrderInfo;
  productTitle?: string;
  isPaymentDetailsHidden?: boolean;
  isGTE?: boolean;
}) => {
  const [stay] = constructCartStays(false, [queryStay.cart]);

  return [
    constructBookingDetails({
      bookingNumber: queryStay.bookingNumber,
      externalId: queryStay.externalId,
      bookingDate: queryStay.bookingDate,
      activeLocale,
      t,
      orderInfo,
      productTitle,
    }),
    customerInfoSection,
    constructStayServiceDetails({
      stay: stay as OrderTypes.QueryStayConstruct,
      activeLocale,
      orderT: t,
    }),
    ...(!isPaymentDetailsHidden
      ? [
          constructPaymentDetails({
            vatAmount: queryStay.vatAmount,
            voucherPriceObjects: queryStay.voucherPriceObjects,
            vatPercentage: queryStay.vatPercentage,
            orderT: t,
            shouldShowVat: !isGTE,
          }),
        ]
      : []),
  ] as OrderTypes.VoucherProduct[];
};

export const constructGTEStayVoucher = ({
  queryStay,
  activeLocale,
  t,
  customerInfoSection,
  orderInfo,
  productTitle,
  isPaymentDetailsHidden,
}: {
  queryStay: VoucherTypes.VoucherQueryGTEStay;
  t: TFunction;
  activeLocale: SupportedLanguages;
  customerInfoSection: OrderTypes.VoucherProduct;
  convertCurrency: (value: number) => number;
  currency: string;
  orderInfo: VoucherTypes.OrderInfo;
  productTitle?: string;
  isPaymentDetailsHidden?: boolean;
}) => {
  const [stay] = constructGTECartStays([queryStay.cart]);

  return [
    constructBookingDetails({
      bookingNumber: queryStay.bookingNumber,
      externalId: queryStay.externalId,
      bookingDate: queryStay.bookingDate,
      activeLocale,
      t,
      orderInfo,
      productTitle,
    }),
    customerInfoSection,
    constructGTEStayServiceDetails({
      stay: stay as OrderTypes.QueryGTEStayConstruct,
      activeLocale,
      orderT: t,
    }),
    constructGTEStayRoomDetails({
      stay: stay as OrderTypes.QueryGTEStayConstruct,
      activeLocale,
      bookingInfoReference: queryStay.bookingInfoReference,
      orderT: t,
    }),
    ...(!isPaymentDetailsHidden
      ? [
          constructPaymentDetails({
            vatAmount: queryStay.vatAmount,
            vatPercentage: queryStay.vatPercentage,
            voucherPriceObjects: queryStay.voucherPriceObjects,
            orderT: t,
            shouldShowVat: false,
          }),
        ]
      : []),
  ] as OrderTypes.VoucherProduct[];
};

export const constructCustomProductVoucher = ({
  queryCustomProduct,
  activeLocale = SupportedLanguages.English,
  t,
  customerInfoSection,
  payerInfoSection,
  orderInfo,
  productTitle,
  isPaymentLinkInvoice,
}: {
  queryCustomProduct: VoucherTypes.VoucherQueryCustomProduct;
  t: TFunction;
  activeLocale?: SupportedLanguages;
  customerInfoSection: OrderTypes.VoucherProduct;
  payerInfoSection?: OrderTypes.VoucherProduct;
  convertCurrency: (value: number) => number;
  currency: string;
  orderInfo: VoucherTypes.OrderInfo;
  productTitle?: string;
  isPaymentLinkInvoice: boolean;
}) => {
  const customProduct = constructCustomProducts([queryCustomProduct.cart])[0];
  const bookingId = queryCustomProduct.bookingNumber ?? queryCustomProduct.cart?.bookingId;
  const shouldDisplayExternalId =
    queryCustomProduct.externalId !== queryCustomProduct.cart?.invoiceNumber;
  return [
    ...(isPaymentLinkInvoice
      ? []
      : [
          constructBookingDetails({
            bookingNumber: bookingId,
            externalId: shouldDisplayExternalId ? queryCustomProduct.externalId : undefined,
            bookingDate: queryCustomProduct.bookingDate,
            activeLocale,
            t,
            orderInfo,
            productTitle,
          }),
        ]),
    isPaymentLinkInvoice && payerInfoSection ? payerInfoSection : customerInfoSection,
    constructCustomsServiceDetails({
      customProduct,
      orderT: t,
      paidDate: isPaymentLinkInvoice ? queryCustomProduct.bookingDate : undefined,
      activeLocale,
    }),
    constructPaymentDetails({
      vatAmount: queryCustomProduct.vatAmount,
      voucherPriceObjects: queryCustomProduct.voucherPriceObjects,
      vatPercentage: queryCustomProduct.vatPercentage,
      orderT: t,
    }),
  ];
};

export const constructVacationPackageVoucher = ({
  activeLocale,
  queryVacationPackage,
  t,
  carnectT,
  flightT,
  orderInfo,
  productTitle,
  carSearchBaseUrl,
  flightSearchBaseUrl,
  isVoucherReady,
  customerInfo,
  isPaymentDetailsHidden,
}: {
  activeLocale: SupportedLanguages;
  currency: string;
  queryVacationPackage: VoucherTypes.VoucherQueryVacationPackages;
  t: TFunction;
  carnectT: TFunction;
  flightT: TFunction;
  convertCurrency: (value: number) => number;
  orderInfo: VoucherTypes.OrderInfo;
  productTitle?: string;
  carSearchBaseUrl: string;
  flightSearchBaseUrl: string;
  isVoucherReady: boolean;
  customerInfo: OrderTypes.CustomerInfo;
  isPaymentDetailsHidden?: boolean;
}) => {
  const vpFlight = queryVacationPackage.flights?.[0];
  const vacationPackageProduct = constructCartVacationPackages({
    vacationPackages: [
      {
        ...queryVacationPackage.cart,
        flights: vpFlight ? [vpFlight.cart] : [],
        cars: queryVacationPackage.cars.length > 0 ? [queryVacationPackage.cars[0].cart] : [],
        stays: queryVacationPackage.stays.map(stayItem => stayItem.cart),
        gteStays: queryVacationPackage.gteStays.map(stayItem => stayItem.cart),
        toursAndTickets: queryVacationPackage.toursAndTickets.map(tourItem => tourItem.cart),
      },
    ],
    carProductBaseUrl: carSearchBaseUrl,
    flightT,
    flightSearchBaseUrl,
  })[0];

  return [
    constructBookingDetails({
      bookingNumber: queryVacationPackage.bookingNumber,
      externalId: queryVacationPackage.externalId,
      bookingDate: queryVacationPackage.bookingDate,
      activeLocale,
      t,
      orderInfo,
      productTitle,
    }),
    vpFlight &&
      constructFlightCustomerInfoSection({
        customerInfo: constructFlightCustomerInfo({
          customerInfo,
          passengers: vpFlight.passengers,
        }),
        t,
        isVoucherReady,
      }),
    constructVacationProductServiceDetails({
      vacationPackageProduct,
      orderT: t,
      carnectT,
      locale: activeLocale,
    }),
    ...(isPaymentDetailsHidden
      ? []
      : [
          constructPaymentDetails({
            vatAmount: queryVacationPackage.vatAmount,
            voucherPriceObjects: queryVacationPackage.voucherPriceObjects,
            vatPercentage: queryVacationPackage.vatPercentage,
            orderT: t,
            shouldShowVat: false,
          }),
        ]),
  ].filter(Boolean);
};

export const getEditableTitle = ({
  editableStatus,
  t,
  advanceNoticeSec,
}: {
  editableStatus: EditableStatus;
  t: TFunction;
  advanceNoticeSec?: number;
}) => {
  if (editableStatus === EditableStatus.UNAVAILABLE)
    return `${t("This booking cannot be edited.")} ${t(
      "Please contact support to get assistance"
    )}`;

  if (editableStatus === EditableStatus.ADVANCED_NOTICE && advanceNoticeSec)
    return t(
      "This product cannot be canceled or edited when less than {days}d:{hours}h:{minutes}m are to the departure date.",
      getHourDaysMinutesDuration({
        durationInSeconds: advanceNoticeSec,
      })
    );

  return t("Edit booking");
};

export const removeBookingNumberPrefix = (bookingNumber: string) =>
  bookingNumber.replace(/(T|H|C)-/g, "");

export const createEditVoucherUrl = ({
  baseUrl,
  bookingNumber,
}: {
  baseUrl: string;
  bookingNumber: string;
}) => `${baseUrl}?order=${removeBookingNumberPrefix(bookingNumber)}&isPassthrough=1`;

export const getVoucherTitle = ({
  t,
  orderInfo,
  numberOfItems,
}: {
  t: TFunction;
  orderInfo?: VoucherTypes.OrderInfo;
  numberOfItems?: number;
}) => {
  if (orderInfo && numberOfItems) {
    const baseMessage =
      numberOfItems === 1 ? t("Your booking is confirmed!") : t("Your bookings are confirmed!");

    if (orderInfo.orderStatus === OrderResultCode.PENDING) {
      return `${baseMessage} ${t(
        "Your booking number will appear when your payment from {paymentMethod} is confirmed. A booking confirmation will also be sent to your email.",
        { paymentMethod: orderInfo.displayedPaymentMethod }
      )}`;
    }
    return baseMessage;
  }
  return "";
};

export const mapPendingPaymentMethodsToDisplayedValue = (
  paymentMethod: PaymentMethodType | null
) => {
  if (paymentMethod?.includes("wechat")) return "WeChat";
  if (paymentMethod?.includes(PaymentMethodType.ALI_PAY)) return "Alipay";
  if (paymentMethod?.includes(PaymentMethodType.PAYPAL)) return "Paypal";
  return null;
};

export const constructOrderInfo = ({ orderInfo }: { orderInfo: VoucherTypes.OrderInfo }) => ({
  ...orderInfo,
  displayedPaymentMethod: mapPendingPaymentMethodsToDisplayedValue(orderInfo?.paymentMethod),
});

export const useProductTitle = (title?: string) => {
  const isMobile = useIsMobile();
  const isPrint = useIsPrint();

  return isMobile && !isPrint ? title : undefined;
};

export const mapCarVoucherPickupData = (
  data: PostBookingTypes.CarVoucherPickUp
): OrderTypes.QyeryCarCartLocation => {
  if (!data) {
    return fallbackCarPickupData;
  }

  const openingHours =
    data?.openingHours?.map(item => ({
      dayOfWeek: item.dayOfWeek ?? fallbackCarPickupData.openingHours[0].dayOfWeek,
      isOpen: item.isOpen ?? fallbackCarPickupData.openingHours[0].isOpen,
      openFrom: item.openFrom ?? fallbackCarPickupData.openingHours[0].openFrom,
      openTo: item.openTo ?? fallbackCarPickupData.openingHours[0].openTo,
    })) ?? fallbackCarPickupData.openingHours;

  return {
    address: data.address ?? fallbackCarPickupData.address,
    streetNumber: data.streetNumber ?? fallbackCarPickupData.streetNumber,
    cityName: data.cityName ?? fallbackCarPickupData.cityName,
    postalCode: data.postalCode ?? fallbackCarPickupData.postalCode,
    state: data.state ?? fallbackCarPickupData.state,
    country: data.country ?? fallbackCarPickupData.country,
    phoneNumber: data.phoneNumber ?? fallbackCarPickupData.phoneNumber,
    openingHours,
  };
};
