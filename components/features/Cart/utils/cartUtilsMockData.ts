import { getIcon, ProductPropId } from "../../../ui/utils/uiUtils";
import { CardType, OrderPaymentProvider, PaymentMethodType } from "../types/cartEnums";

import {
  BedRoom,
  BedroomIcon,
  BreakfastIcon,
  CalendarClock,
  CalendarEmpty,
  CarGarage,
  CarIcon,
  CarKey,
  CheckInDoor,
  CheckOutDoor,
  ChecksCirle,
  IconHouseHeart,
  Language,
  PlaneLand,
  TourEnd,
  TourStart,
} from "./cartUtils";

import {
  mockQueryStay0,
  mockQueryStayConstructCancellation,
} from "components/ui/Order/utils/mockOrderData";
import { SupportedCurrencies } from "types/enums";

export const dayTourQuickFacts = [
  {
    id: "starts",
    label: "Starting location",
    value: "Jökulsárlón, Iceland",
    Icon: TourStart,
  },
  {
    id: "startDate",
    label: "Starts on",
    value: "Mar 23, 00:00",
    Icon: CalendarClock,
  },
  { id: "ends", label: "Ends", value: "Mar 23, 03:00", Icon: TourEnd },
  {
    id: "language",
    label: "Guided language",
    value: "English",
    Icon: Language,
  },
];

export const selfDriveTourQuickFacts = [
  {
    id: "dates",
    label: "Dates",
    value: "Mar 24 - Mar 31",
    translateValue: true,
    Icon: CalendarEmpty,
  },
  {
    id: "accommodation",
    label: "Accommodation",
    value: { key: "{numberOfNights} nights", options: { numberOfNights: 7 } },
    translateValue: true,
    Icon: BedRoom,
  },
  {
    id: "launches",
    label: "Includes",
    value: "Accommodation",
    Icon: ChecksCirle,
  },
  {
    id: "carRental",
    label: "Car rental",
    value: { key: "{numberOfDays} days", options: { numberOfDays: 8 } },
    translateValue: true,
    Icon: CarKey,
  },
];

export const packageTourQuickFacts = [
  {
    id: "starts",
    label: "Starting location",
    value: "Keflavík Airport",
    Icon: TourStart,
  },
  {
    id: "ends",
    label: "Ending location",
    value: "Keflavík Airport",
    Icon: TourEnd,
  },
  {
    id: "startDate",
    label: "Starting date",
    value: {
      key: "{dateShort}, Flexible",
      options: { dateShort: "May 20" },
    },
    translateValue: true,

    Icon: CalendarClock,
  },
  {
    id: "endDate",
    label: "Ending date",
    value: {
      key: "{dateShort}, Flexible",
      options: { dateShort: "May 24" },
    },
    translateValue: true,
    Icon: CalendarClock,
  },
];

export const packageTourRegularDatesQuickFacts = [
  {
    id: "starts",
    label: "Starting location",
    value: "Keflavík Airport",
    Icon: TourStart,
  },
  {
    id: "ends",
    label: "Ending location",
    value: "Keflavík Airport",
    Icon: TourEnd,
  },
  {
    id: "startDate",
    label: "Starting date",
    value: {
      key: "{dateShort} at {timeShort}",
      options: { dateShort: "May 20", timeShort: "14:00" },
    },
    translateValue: true,

    Icon: CalendarClock,
  },
  {
    id: "endDate",
    label: "Ending date",
    value: {
      key: "{dateShort} at {timeShort}",
      options: { dateShort: "May 24", timeShort: "15:00" },
    },
    translateValue: true,
    Icon: CalendarClock,
  },
];

export const staysQuickFact0 = [
  {
    id: "checkIn",
    label: "Check in",
    value: {
      key: "{dateShort} at {timeShort}",
      options: { dateShort: "Apr 25", timeShort: "15:00" },
    },
    translateValue: true,
    Icon: CheckInDoor,
  },
  {
    id: "checkOut",
    label: "Check out",
    value: {
      key: "{dateShort} at {timeShort}",
      options: { dateShort: "Apr 30", timeShort: "11:00" },
    },
    translateValue: true,
    Icon: CheckOutDoor,
  },
  {
    id: "rooms",
    label: "Room type",
    value:
      "1 Standard twin room, 1 Standard triple room, 1 Standard double room with shared bathroom",
    Icon: BedroomIcon,
  },
  {
    id: "breakfast",
    label: "Breakfast",
    value: mockQueryStay0.specs[2].value,
    Icon: BreakfastIcon,
    translateValue: true,
  },
];

export const staysGTEQuickFact0 = [
  {
    id: "checkIn",
    label: "Check in",
    value: {
      key: "{dateShort} at {timeShort}",
      options: { dateShort: "Feb 13", timeShort: "11:00" },
    },
    translateValue: true,
    Icon: CheckInDoor,
  },
  {
    id: "checkOut",
    label: "Check out",
    value: {
      key: "{dateShort} at {timeShort}",
      options: { dateShort: "Feb 15", timeShort: "14:30" },
    },
    translateValue: true,
    Icon: CheckOutDoor,
  },
  {
    id: "rooms",
    label: "Room type",
    value: "DOUBLE STANDARD, Double or Twin Room with Bath - Free WiFi",
    Icon: BedroomIcon,
  },
];

export const staysGTEQuickFact0WithoutCheckinTime = [
  {
    id: "checkIn",
    label: "Check in",
    value: {
      key: "{dateShort}",
      options: { dateShort: "Feb 13", timeShort: "" },
    },
    translateValue: true,
    Icon: CheckInDoor,
  },
  {
    id: "checkOut",
    label: "Check out",
    value: {
      key: "{dateShort} at {timeShort}",
      options: { dateShort: "Feb 15", timeShort: "14:30" },
    },
    translateValue: true,
    Icon: CheckOutDoor,
  },
  {
    id: "rooms",
    label: "Room type",
    value: "DOUBLE STANDARD, Double or Twin Room with Bath - Free WiFi",
    Icon: BedroomIcon,
  },
];

export const staysGTEQuickFact0WithoutCheckoutTime = [
  {
    id: "checkIn",
    label: "Check in",
    value: {
      key: "{dateShort} at {timeShort}",
      options: { dateShort: "Feb 13", timeShort: "11:00" },
    },
    translateValue: true,
    Icon: CheckInDoor,
  },
  {
    id: "checkOut",
    label: "Check out",
    value: {
      key: "{dateShort}",
      options: { dateShort: "Feb 15", timeShort: "" },
    },
    translateValue: true,
    Icon: CheckOutDoor,
  },
  {
    id: "rooms",
    label: "Room type",
    value: "DOUBLE STANDARD, Double or Twin Room with Bath - Free WiFi",
    Icon: BedroomIcon,
  },
];

export const staysQuickFactCalcellation = [
  staysQuickFact0[0],
  staysQuickFact0[1],
  staysQuickFact0[2],
  {
    id: "cancellation",
    label: "Cancellation",
    value: mockQueryStayConstructCancellation.valueProps![0].title,
    Icon: getIcon(ProductPropId.Cancellation),
    translateValue: true,
  },
];

export const mockCarQuickFacts0 = [
  {
    id: "pickup",
    label: "Pick-up location",
    value: "Keflavík Airport",
    Icon: CarKey,
  },
  {
    id: "dropoff",
    label: "Drop-off location",
    value: "Keflavík Airport",
    Icon: CarGarage,
  },
  {
    id: "startDate",
    label: "Pick-up time",
    value: {
      key: "{dateShort} at {timeShort}",
      options: { dateShort: "Mar 6", timeShort: "12:00" },
    },
    translateValue: true,
    Icon: CalendarClock,
  },
  {
    id: "endDate",
    label: "Drop-off time",
    value: {
      key: "{dateShort} at {timeShort}",
      options: { dateShort: "Mar 8", timeShort: "12:00" },
    },
    translateValue: true,
    Icon: CalendarClock,
  },
];

export const mockVacationPackagesQuickFacts0 = [
  {
    Icon: CalendarEmpty,
    id: "Dates",
    label: "Dates",
    translateValue: true,
    value: {
      key: "{dateFromShort} - {dateToShort}",
      options: {
        dateFromShort: "Dec 12",
        dateToShort: "Dec 14",
      },
    },
  },
  {
    Icon: PlaneLand,
    id: "flight",
    label: "Flights",
    value: "{origin} to {destination} and back",
  },
  {
    Icon: IconHouseHeart,
    id: "stays",
    label: "Hotels",
    translateValue: true,
    value: {
      key: "{totalNights} nights",
      options: {
        totalNights: 2,
      },
    },
  },
  {
    Icon: CarIcon,
    id: "cars",
    label: "Car rental",
    translateValue: true,
    value: {
      key: "{numberOfDays} day rental",
      options: {
        numberOfDays: 3,
      },
    },
  },
];

export const mockVacationPackagesWithoutFlightQuickFacts = [
  {
    Icon: CalendarEmpty,
    id: "Dates",
    label: "Dates",
    translateValue: true,
    value: {
      key: "{dateFromShort} - {dateToShort}",
      options: {
        dateFromShort: "Dec 12",
        dateToShort: "Dec 14",
      },
    },
  },
  {
    Icon: IconHouseHeart,
    id: "stays",
    label: "Hotels",
    translateValue: true,
    value: {
      key: "{totalNights} nights",
      options: {
        totalNights: 2,
      },
    },
  },
  {
    Icon: CarIcon,
    id: "cars",
    label: "Car rental",
    translateValue: true,
    value: {
      key: "{numberOfDays} day rental",
      options: {
        numberOfDays: 3,
      },
    },
  },
];

export const mockCreditCardBrands = [
  CardType.VISA,
  CardType.MASTERCARD,
  CardType.MAESTRO,
  CardType.AMEX,
  CardType.CARTE_BANCAIRE,
];

export const mockAdyenPaymentMethods = [
  {
    name: "Credit Card",
    type: PaymentMethodType.CREDIT_CARD,
    brands: mockCreditCardBrands,
  },
  {
    name: "Apple Pay",
    type: PaymentMethodType.APPLE_PAY,
  },
  {
    name: "PayPal",
    type: PaymentMethodType.PAYPAL,
  },
];

export const normalizedCreditCardPaymentMethod: CartTypes.PaymentMethod = {
  id: mockAdyenPaymentMethods[0].name,
  type: PaymentMethodType.CREDIT_CARD,
  name: mockAdyenPaymentMethods[0].name,
  provider: OrderPaymentProvider.ADYEN,
  brands: mockCreditCardBrands,
};
export const normalizedPayPalPaymentMethod: CartTypes.PaymentMethod = {
  id: mockAdyenPaymentMethods[2].name,
  type: PaymentMethodType.PAYPAL,
  name: mockAdyenPaymentMethods[2].name,
  provider: OrderPaymentProvider.ADYEN,
};
export const normalizedApplePayPaymentMethod: CartTypes.PaymentMethod = {
  id: mockAdyenPaymentMethods[1].name,
  type: PaymentMethodType.APPLE_PAY,
  name: mockAdyenPaymentMethods[1].name,
  provider: OrderPaymentProvider.ADYEN,
};
export const normalizedSofortPaymentMethod: CartTypes.PaymentMethod = {
  id: "sofortId",
  type: PaymentMethodType.SOFORT,
  name: "Sofort very long name",
  provider: OrderPaymentProvider.ADYEN,
};
export const normalizedKlarnaPayNowPaymentMethod: CartTypes.PaymentMethod = {
  id: PaymentMethodType.KLARNA_PAY_NOW,
  type: PaymentMethodType.KLARNA_PAY_NOW,
  name: PaymentMethodType.KLARNA_PAY_NOW,
  provider: OrderPaymentProvider.ADYEN,
};
export const normalizedKlarnaPayLaterPaymentMethod: CartTypes.PaymentMethod = {
  id: PaymentMethodType.KLARNA_PAY_LATER,
  type: PaymentMethodType.KLARNA_PAY_LATER,
  name: PaymentMethodType.KLARNA_PAY_LATER,
  provider: OrderPaymentProvider.ADYEN,
};
export const normalizedKlarnaPayOverPaymentMethod: CartTypes.PaymentMethod = {
  id: PaymentMethodType.KLARNA_PAY_OVER,
  type: PaymentMethodType.KLARNA_PAY_OVER,
  name: PaymentMethodType.KLARNA_PAY_OVER,
  provider: OrderPaymentProvider.ADYEN,
};

export const mockBrokenCartWithProvidersData = {
  carProductBaseUrl: "car-rental",
  carSearchBaseUrl: "europe-car-rentals",
  cartWithPaymentProviders: {
    cart: {
      flights: [],
      cars: [],
      tours: [],
      stays: [
        {
          id: 1725257350,
          address: null,
          type: null,
          uri: "url",
          numberOfGuests: 3,
          numberOfAdults: 0,
          numberOfChildren: 0,
          childrenAges: null,
          title: null,
          cartItemId: "a4e29eb2-df47-49c7-9dff-0fb05d8eeae6",
          discountAmount: null,
          discountPercentage: null,
          totalPrice: 0,
          imageUrl: null,
          available: false,
          editable: true,
          currency: null,
          from: "2022-08-01T00:00:00.000Z",
          to: "2022-08-08T00:00:00.000Z",
          updated: "2021-10-12T12:01:18.480Z",
          createdTime: "2021-10-12T12:01:18.480Z",
          cancellationPolicy: null,
          cancellationString: null,
          cityOsmId: null,
          cityName: null,
          countryOsmId: null,
          countryName: null,
          valueProps: null,
          rooms: [],
          specs: null,
        },
        {
          id: 384541970,
          address: "Am Seegraben 2, Schönefeld",
          type: null,
          uri: "url",
          numberOfGuests: 2,
          numberOfAdults: 0,
          numberOfChildren: 0,
          childrenAges: null,
          title: "InterCityHotel Berlin-Brandenburg Airport",
          cartItemId: "87638ab4-a66f-4cab-a4e0-c5d7664b97e4",
          discountAmount: null,
          discountPercentage: null,
          totalPrice: 305.28,
          imageUrl: null,
          available: false,
          editable: true,
          currency: "EUR",
          from: "2021-11-09T00:00:00.000Z",
          to: "2021-11-13T00:00:00.000Z",
          updated: "2021-10-21T09:42:05.934Z",
          createdTime: "2021-10-21T09:42:05.934Z",
          cancellationPolicy: null,
          cancellationString: null,
          cityOsmId: null,
          cityName: null,
          countryOsmId: null,
          countryName: null,
          valueProps: [],
          rooms: [
            {
              id: 1,
              type: "DoubleRoom",
              name: "Standard Double",
              privateBathroom: false,
              size: 0,
              maxPersons: 2,
              roomBookings: [
                {
                  extraBedCount: 0,
                  adults: 2,
                  children: 0,
                  mesh: "QkVSMDAwNUJBR1RSWTAwNl5IVExCXkJFUl4xMjYyOTleREJMLlNUXlJPOkRSXyRfUk9ffF9CT09LQUJMRV98X05PUl98X0RCTC5TVF98X1RydWVffF9BVF9XRUJffF8yX3xfMF98X18kX0EyQzBJMF8qX14zMDUuMjheRVVS",
                  requestId: null,
                  source: "Anixe",
                  masterRateCode: "BER0005BAGTRY006",
                  extras: [],
                },
              ],
            },
          ],
          specs: [],
        },
        {
          id: 302807952,
          address: "Am Seegraben 2, Schönefeld",
          type: null,
          uri: "/iceland/best-hotels-and-places-to-stay/details/center-hotels-plaza",
          numberOfGuests: 1,
          numberOfAdults: 0,
          numberOfChildren: 0,
          childrenAges: null,
          title: "InterCityHotel Berlin-Brandenburg Airport",
          cartItemId: "afcae738-eeaa-4d4f-9c3d-f2bb452f6967",
          discountAmount: null,
          discountPercentage: null,
          totalPrice: 69.14,
          imageUrl: "Missing No",
          available: false,
          editable: true,
          currency: "EUR",
          from: "2021-10-29T00:00:00.000Z",
          to: "2021-10-30T00:00:00.000Z",
          updated: "2021-10-22T13:16:40.449Z",
          createdTime: "2021-10-22T13:16:40.449Z",
          cancellationPolicy: null,
          cancellationString: null,
          cityOsmId: null,
          cityName: null,
          countryOsmId: null,
          countryName: null,
          valueProps: [],
          rooms: [
            {
              id: 1,
              type: "SingleRoom",
              name: "Standard Double",
              privateBathroom: false,
              size: 0,
              maxPersons: 1,
              roomBookings: [
                {
                  extraBedCount: 0,
                  adults: 1,
                  children: 0,
                  mesh: "QkVSMDAwNUJBR1RSWTAwNl5IVExCXkJFUl4xMjYyOTleREJMLlNUXlJPOlNSXyRfUk9ffF9CT09LQUJMRV98X05PUl98X0RCTC5TVF98X1RydWVffF9BVF9XRUJffF8xX3xfMF98X18kX0ExQzBJMF8qX142OS4xNF5FVVI%3D",
                  requestId: null,
                  source: "Anixe",
                  masterRateCode: "BER0005BAGTRY006",
                  extras: [],
                },
              ],
            },
          ],
          specs: [],
        },
        {
          id: 1683388470,
          address: "Am Seegraben 2, Schönefeld",
          type: null,
          uri: "/iceland/best-hotels-and-places-to-stay/details/center-hotels-plaza",
          numberOfGuests: 1,
          numberOfAdults: 0,
          numberOfChildren: 0,
          childrenAges: null,
          title: "InterCityHotel Berlin-Brandenburg Airport",
          cartItemId: "4ed23afd-ed6a-44b1-bbd9-0bd20f85aaee",
          discountAmount: null,
          discountPercentage: null,
          totalPrice: 144.48,
          imageUrl: "Missing No",
          available: false,
          editable: true,
          currency: "EUR",
          from: "2021-10-27T00:00:00.000Z",
          to: "2021-10-29T00:00:00.000Z",
          updated: "2021-10-22T13:18:27.071Z",
          createdTime: "2021-10-22T13:18:27.071Z",
          cancellationPolicy: null,
          cancellationString: null,
          cityOsmId: null,
          cityName: null,
          countryOsmId: null,
          countryName: null,
          valueProps: [],
          rooms: [
            {
              id: 1,
              type: "SingleRoom",
              name: "Standard Double",
              privateBathroom: false,
              size: 0,
              maxPersons: 1,
              roomBookings: [
                {
                  extraBedCount: 0,
                  adults: 1,
                  children: 0,
                  mesh: "QkVSMDAwNUJBR1RSWTAwNl5IVExCXkJFUl4xMjYyOTleREJMLlNUXlJPOlNSXyRfUk9ffF9CT09LQUJMRV98X05PUl98X0RCTC5TVF98X1RydWVffF9BVF9XRUJffF8xX3xfMF98X18kX0ExQzBJMF8qX14xNDQuNDheRVVS",
                  requestId: null,
                  source: "Anixe",
                  masterRateCode: "BER0005BAGTRY006",
                  extras: [],
                },
              ],
            },
          ],
          specs: [],
        },
        {
          id: 565839017,
          address: "Am Seegraben 2, Schönefeld",
          type: null,
          uri: "/iceland/best-hotels-and-places-to-stay/details/center-hotels-plaza",
          numberOfGuests: 1,
          numberOfAdults: 0,
          numberOfChildren: 0,
          childrenAges: null,
          title: "InterCityHotel Berlin-Brandenburg Airport",
          cartItemId: "04cdc567-e86f-4766-92fd-eb29a0d2eede",
          discountAmount: null,
          discountPercentage: null,
          totalPrice: 202.68,
          imageUrl: "Missing No",
          available: false,
          editable: true,
          currency: "EUR",
          from: "2021-10-27T00:00:00.000Z",
          to: "2021-10-29T00:00:00.000Z",
          updated: "2021-10-22T15:45:18.414Z",
          createdTime: "2021-10-22T15:45:18.414Z",
          cancellationPolicy: null,
          cancellationString: null,
          cityOsmId: null,
          cityName: null,
          countryOsmId: null,
          countryName: null,
          valueProps: [],
          rooms: [
            {
              id: 1,
              type: "SingleRoom",
              name: "Standard Double",
              privateBathroom: false,
              size: 0,
              maxPersons: 1,
              roomBookings: [
                {
                  extraBedCount: 0,
                  adults: 1,
                  children: 0,
                  mesh: "QkVSMDAwNUJBR1RSWTAwNl5IVExCXkJFUl4xMjYyOTleREJMLlNUXkJCOlNSXyRfQkJffF9CT09LQUJMRV98X05PUl98X0RCTC5TVF98X0ZhbHNlX3xfQVRfV0VCX3xfMV98XzBffF9fJF9BMUMwSTBfKl9eMjAyLjY4XkVVUg%3D%3D",
                  requestId: null,
                  source: "Anixe",
                  masterRateCode: "BER0005BAGTRY006",
                  extras: [],
                },
              ],
            },
          ],
          specs: [],
        },
      ],
      customs: [],
      toursAndTickets: [],
      vacationPackages: [],
      itemCount: 5,
      totalPrice: 0,
      totalOnArrival: 0,
      customerInfo: {
        name: null,
        email: null,
        nationality: null,
        phoneNumber: null,
      },
    },
    paymentProviderSettings: {
      serverTime: "2022-04-22T11:14:58.925Z",
      preferredPaymentProvider: "ADYEN",
      paymentProviders: [
        {
          suggestedCurrency: "EUR",
          provider: "ADYEN",
          clientKey: "live_77DJWISHBFGQ5P65Y7WTHSJVGUATHWNP",
          merchantAccount: "GuideToEurope",
          environment: "live",
          enableSaveCard: true,
          clientPublicKey:
            "10001|D2C1C6C11FD8671FBF417F53B033321D33F277D1119382C254F98949D68B7D75244DD792ADE0ABE5B3FBD86E5306DA19DD9505DE9B90874E42308998225EFE4ADDC6D7A32CE97EC92AB83F5CF2461662B7B81F94ABDFE7E16CA98EBEBF2D566CAEFAEA7E12F000F518C3C22829833A83A6BD89819F6E8658308D9351F040D68871076746F40E4CD8ECCEDF2E5018EDFCF9807979C050B58BF35EA368E0A948E82A885C4473A0AAD04525FD74F32857D2F3C93433AED746276F01B698041BE87C468CC5328953A1D51544EEAB498265BC44E5510D4F755AC48FB37BC4D45A24815F1C9866CA279D69AD20FC360F7CFAF52C77A89C2BB10D3865BA50B372315EA1",
          clientLibraryLocation: "https://live.adyen.com/hpp/cse/js/2616183346474288.shtml",
          additionalProviderSettings: [],
        },
        {
          suggestedCurrency: "EUR",
          provider: "SALTPAY",
          clientKey: "729428_puZUXoz6Ew2pS34bxZfyX4l1ib6xgr2p2l",
          merchantAccount: "guidetoeurope-com",
          environment: "live",
          enableSaveCard: true,
          clientPublicKey: null,
          clientLibraryLocation: null,
          additionalProviderSettings: [
            {
              suggestedCurrency: "ISK",
              provider: "SALTPAY",
              clientKey: "990262_pub3ZKbU75/e6pyjAP0frSZ7mvfMJaMLvf",
              merchantAccount: "guidetoeurope-com",
              environment: "live",
              enableSaveCard: true,
              clientPublicKey: null,
              clientLibraryLocation: null,
            },
            {
              suggestedCurrency: "USD",
              provider: "SALTPAY",
              clientKey: "697313_pu5p/XXCNxAq0++3Z2Awzm3BImJR/XU34Q",
              merchantAccount: "guidetoeurope-com",
              environment: "live",
              enableSaveCard: true,
              clientPublicKey: null,
              clientLibraryLocation: null,
            },
            {
              suggestedCurrency: "GBP",
              provider: "SALTPAY",
              clientKey: "349654_pu0Ux+qTBe3KigU4gtUGgZbhrlRuqYaE+f",
              merchantAccount: "guidetoeurope-com",
              environment: "live",
              enableSaveCard: true,
              clientPublicKey: null,
              clientLibraryLocation: null,
            },
          ],
        },
      ],
    },
  },
} as unknown as CartTypes.QueryCartWithProviders;

export const mockCreditCardConfig = {
  id: "Credit Card",
  type: PaymentMethodType.CREDIT_CARD,
  name: "Credit Card",
  configuration: [{ key: "", value: "" }],
  issuers: [],
  brands: ["visa", "mc", "amex", "cup"],
  provider: OrderPaymentProvider.ADYEN,
  paymentFeePercentage: 10,
  adyenAmount: 46039,
  adyenCurrency: SupportedCurrencies.EURO,
  totalAmount: 460.3929,
  totalCurrency: SupportedCurrencies.EURO,
};

export const CarnectCar = {
  id: "4sl466J_wUSN3nFx-3jy2Q-167",
  offerId: "4sl466J_wUSN3nFx-3jy2Q-167",
  cartItemId: "cars-5",
  category: "Small",
  pickupLocation: "Keflavík International Airport (KEF)",
  pickupSpecify: undefined,
  dropoffLocation: "Keflavík International Airport (KEF)",
  dropoffSpecify: "",
  pickupId: "701,2",
  dropoffId: "701,2",
  flightNumber: "",
  provider: "Carnect",
  numberOfDays: 7,
  priceOnArrival: 0,
  discountAmount: 0,
  discountPercentage: 0,
  extras: [],
  insurances: [
    {
      id: "ALI",
      name: "Additional Liability Insurance",
      count: 1,
      price: 0,
    },
    {
      id: "CDW",
      name: "Collision damage waiver",
      count: 1,
      price: 0,
    },
    {
      id: "SLI",
      name: "Supplementary Liability Insurance",
      count: 1,
      price: 0,
    },
  ],
  title: "Toyota Yaris - Manual",
  totalPrice: 280.276125,
  priceBreakdown: [
    {
      id: "27c91c63-7a84-410c-b121-12d9ad6e8ec1",
      name: "Car rental for 7 days.",
      currency: "USD",
      quantity: 1,
      pricePerUnit: 280.276125,
      pricePerUnitDisplay: "39,615",
      totalPrice: 280.276125,
      totalPriceDisplay: "39,615",
      isMinAmount: false,
      isMaxAmount: false,
      includeInBasePrice: true,
      type: "Rental",
      translationKeys: {
        keys: [],
      },
    },
  ],
  payOnArrival: [],
  imageUrl: "https://static.carhire-solutions.com/images/car/City Car Rental/large/t_EDMR_IS.jpg",
  available: true,
  editable: false,
  from: "2023-04-26T10:00:00.000Z",
  to: "2023-05-03T10:00:00.000Z",
  updated: "2022-11-25T17:00:06.000Z",
  createdTime: "2022-11-25T17:00:07.478Z",
  expiredTime: "2022-11-25T18:00:05.000Z",
  advancedNoticeSec: undefined,
  driverAge: 45,
  driverCountry: "IS",
  locationDetails: {
    pickup: {
      address: "Njarðarbraut 11, Keflavík",
      streetNumber: "Njarðarbraut 11",
      cityName: "Keflavík",
      postalCode: "260",
      state: "Island",
      country: "Iceland",
      phoneNumber: "00 354 511 5660",
      openingHours: [],
    },
    dropoff: {
      address: "Njarðarbraut 11, Keflavík",
      streetNumber: "Njarðarbraut 11",
      cityName: "Keflavík",
      postalCode: "260",
      state: "Island",
      country: "Iceland",
      phoneNumber: "00 354 511 5660",
      openingHours: [],
    },
  },
  vendor: {
    name: "City Car Rental",
  },
};
