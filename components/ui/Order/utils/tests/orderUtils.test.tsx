import React from "react";
/* eslint-disable functional/immutable-data */
import { addDays } from "date-fns";

import {
  constructCarRentalExtras,
  constructCarRentalInsurances,
  constructCarRentalPaymentDetails,
  constructCarRentalsServiceDetails,
  constructCartCarRentals,
  constructCartFlights,
  constructCartStays,
  constructCartTours,
  constructCartVacationPackages,
  constructCustomProducts,
  constructFlightsBagsServiceDetails,
  constructFlightServiceDetails,
  constructPaymentDetails,
  constructTourServiceDetails,
  constructVacationProductServiceDetails,
  constructVoucherPriceLabels,
  getUnavailableStayClientRoute,
  getUnavailableTourClientRoute,
  getTourDuration,
  getGTEStayServiceDetails,
  constructGTECartStays,
  constructGTEStayServiceDetails,
  constructGTETourServiceDetails,
  constructGTEStayRoomDetails,
  buildCheckingOutDateString,
  adjustSectionsDisplayWithEmptyLines,
  constructCustomsServiceDetails,
  constructCartGTETours,
} from "../orderUtils";
import {
  mockCarRentalCart0,
  mockCarRentalCart0ExtrasServiceDetails,
  mockCarRentalCart0InsurancesServiceDetails,
  mockCarRentalPaymentDetails,
  mockCarRentalPaymentDetails1,
  mockCarRentalPaymentDetails2,
  mockCarRentalPaymentDetailsWithBackendPrice,
  mockCarRentalQueryCart0,
  mockConstructVacationPackage,
  mockCustomProductDrink,
  mockCustomProductDrinkConstruct,
  mockCustomProductDrinkProductServiceDetails,
  mockDayTour,
  mockDayTourCart,
  mockDayTourCartWithExtras,
  mockDayTourServiceData,
  mockDayTourServiceDataWithExtraAnswers,
  mockDirectCartFlight,
  mockDirectQueryFlight,
  mockFlightCart0,
  mockFlightsBagsServiceDetails,
  mockMultiDayTourCart,
  mockMultiDayTourServiceData,
  mockPackageTourServiceData,
  mockPaidPaymentLinkInvoiceConstruct,
  mockPaidPaymentLinkInvoiceServiceDetails,
  mockPaymentDetails1,
  mockPaymentDetailsInCartInfoModal,
  mockPaymentDetailsWithBackendPrice,
  mockPaymentLinkInvoiceConstruct,
  mockPaymentLinkInvoiceServiceDetails,
  mockQueryFlightCart0,
  mockQueryGTEStay0,
  mockQueryGTEStay0Room1,
  mockQueryGTEStay0Room2,
  mockQueryGTEStay0RoomDetails,
  mockQueryGTEStay0ServiceDetails,
  mockQueryGTEStayConstruct0,
  mockQueryGTETour,
  mockQueryStay0,
  mockQueryStayConstruct0,
  mockQueryVacationPackage,
  mockSelfDriveTour,
  mockSelfDriveTourCart,
  mockSelfDriveTourServiceData,
  mockVacationPackageServiceDetails,
  mockVacationPackageTour,
  mockVacationPackageTourCart,
  mockVacationPackageWithoutFlightsServiceDetails,
  mockVoucherPaidPaymentLinkInvoice,
} from "../mockOrderData";
import OpeningHours from "../../OrderOpeningHours";

import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import {
  AccommodationFilterQueryParam,
  CarProvider,
  FilterQueryEnum,
  OrderBy,
  PageType,
  SupportedLanguages,
} from "types/enums";
import { fakeTranslate as fakeT, fakeTranslateWithValues } from "utils/testUtils";

jest.mock("../../OrderOpeningHours", () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeAll(() => {
  // @ts-ignore
  OpeningHours.mockImplementation(() => {
    return <div />;
  });
});

const flightSearchBaseUrl = "/best-flights/details";
const carProductBaseUrl = "/baseUrl/search-results/book";

describe("constructFlightsBagsServiceDetails", () => {
  test("should correctly construct bags service details for the flight cart itinerary", () => {
    expect(constructFlightsBagsServiceDetails(mockFlightCart0, fakeT as TFunction)).toEqual([
      mockFlightsBagsServiceDetails,
    ]);
  });
  test("should correctly empty bags service details for the flight cart itinerary without bags", () => {
    expect(
      constructFlightsBagsServiceDetails({ ...mockFlightCart0, baggage: [] }, fakeT as TFunction)
    ).toEqual([]);
  });
});

describe("constructFlightServiceDetails", () => {
  test("should correctly construct service details for the flight cart itinerary", () => {
    expect(
      constructFlightServiceDetails({
        flight: mockFlightCart0,
        orderT: fakeT as TFunction,
        activeLocale: SupportedLanguages.English,
      })
    ).toEqual({
      title: "Service details",
      sections: [
        {
          label: "Duration",
          values: ["{nightsInDestination} nights in {destination}"],
        },
        {
          label: "Travellers",
          values: ["{totalTravellers} travellers"],
        },
        {
          label: "Departure",
          values: ["March 11, 2021, 14:55"],
        },
        {
          label: "Depart from",
          values: ["Keflavík International (KEF)"],
        },
        {
          label: "Arrival",
          values: ["March 12, 2021, 09:25"],
        },
        {
          label: "Arrive to",
          values: ["Airport Copenhagen (CPH)"],
        },
        {
          label: "Return",
          values: ["March 13, 2021, 18:25"],
        },
        {
          label: "Return from",
          values: ["Airport Copenhagen (RKE) (RKE)"],
        },
        {
          label: "Arrival",
          values: ["March 14, 2021, 14:00"],
        },
        {
          label: "Arrive to",
          values: ["Keflavík International (KEF)"],
        },
        mockFlightsBagsServiceDetails,
      ],
    });
  });
});

const mockT = (value: string) => value;

describe("constructCartFlights", () => {
  test("should correctly construct a flight itinerary from query", () => {
    expect(
      constructCartFlights([mockQueryFlightCart0], mockT as TFunction, flightSearchBaseUrl)
    ).toEqual([mockFlightCart0]);

    expect(
      constructCartFlights([mockDirectQueryFlight], mockT as TFunction, flightSearchBaseUrl)
    ).toEqual([mockDirectCartFlight]);
  });
});

describe("constructCartTours", () => {
  test("should correctly construct Self drive tour from query", () => {
    expect(constructCartTours([mockSelfDriveTour])).toEqual([mockSelfDriveTourCart]);
  });
  test("should correctly construct Day tour from query", () => {
    expect(constructCartTours([mockDayTour])).toEqual([mockDayTourCart]);
  });
  test("should correctly construct Vacation package tour from query", () => {
    expect(constructCartTours([mockVacationPackageTour])).toEqual([mockVacationPackageTourCart]);
  });
});

describe("constructTourServiceDetails", () => {
  const mockTourProvider = {
    name: "Guide To Iceland",
    phoneNumber: "+1113213",
  };
  test("should construct tours service details for Self drive tour ", () => {
    expect(
      constructTourServiceDetails({
        tour: mockSelfDriveTourCart,
        orderT: fakeT as TFunction,
        tourVoucherInfo: {
          provider: mockTourProvider,
        },
      })
    ).toEqual(mockSelfDriveTourServiceData);
  });

  test("should construct tours service details for Day tour", () => {
    expect(
      constructTourServiceDetails({
        tour: mockDayTourCart,
        orderT: fakeT as TFunction,
        tourVoucherInfo: {
          provider: mockTourProvider,
        },
      })
    ).toEqual(mockDayTourServiceData);
  });

  test("should construct tours service details for Day tour that contains extra answers", () => {
    expect(
      constructTourServiceDetails({
        tour: mockDayTourCartWithExtras,
        orderT: fakeT as TFunction,
        tourVoucherInfo: {
          provider: mockTourProvider,
        },
      })
    ).toEqual(mockDayTourServiceDataWithExtraAnswers);
  });

  test("should construct tours service details for Vacation package tour", () => {
    expect(
      constructTourServiceDetails({
        tour: mockVacationPackageTourCart,
        orderT: fakeT as TFunction,
        tourVoucherInfo: {
          provider: mockTourProvider,
        },
      })
    ).toEqual(mockPackageTourServiceData);
  });

  test("should construct tours service details for Multi-day tour", () => {
    expect(
      constructTourServiceDetails({
        tour: mockMultiDayTourCart,
        orderT: fakeT as TFunction,
        tourVoucherInfo: {
          provider: mockTourProvider,
        },
      })
    ).toEqual(mockMultiDayTourServiceData);
  });
});

describe("constructCarRentalExtras", () => {
  test("Should correctly construct car rental Extras  ", () => {
    expect(
      constructCarRentalExtras({
        carRental: mockCarRentalCart0,
        orderT: fakeT as TFunction,
        carnectT: fakeT as TFunction,
        isCarnect: mockCarRentalCart0.provider === CarProvider.CARNECT,
      })
    ).toEqual(mockCarRentalCart0ExtrasServiceDetails);
  });
  test("Should return car rental Extras ", () => {
    expect(
      constructCarRentalExtras({
        carRental: {
          ...mockCarRentalCart0,
          extras: [],
        },
        orderT: fakeT as TFunction,
        carnectT: fakeT as TFunction,
        isCarnect: mockCarRentalCart0.provider === CarProvider.CARNECT,
      })
    ).toEqual([]);
  });
});

describe("constructCarRentalInsurances", () => {
  test("Should correctly construct car rental insurances ", () => {
    expect(
      constructCarRentalInsurances({
        carRental: mockCarRentalCart0,
        orderT: fakeT as TFunction,
      })
    ).toEqual(mockCarRentalCart0InsurancesServiceDetails);
  });

  test("Should return empty car rental insurances ", () => {
    expect(
      constructCarRentalInsurances({
        carRental: {
          ...mockCarRentalCart0,
          insurances: [],
        },
        orderT: fakeT as TFunction,
      })
    ).toEqual([]);
  });
});

describe("constructCarRentalsServiceDetails", () => {
  test("should correctly construct service details for the car rental cart item", () => {
    expect(
      JSON.stringify(
        constructCarRentalsServiceDetails({
          carRental: mockCarRentalCart0,
          activeLocale: SupportedLanguages.English,
          orderT: fakeT as TFunction,
          carnectT: fakeT as TFunction,
        })
      )
    ).toEqual(
      JSON.stringify({
        title: "Service details",
        sections: [
          { label: "Duration", values: ["{numberOfDays} day rental"] },
          { label: "Drivers", values: ["x 3"] },
          { label: "Pick-up", values: ["March 6, 2021, 12:00 PM"] },
          { label: "Drop-off", values: ["March 8, 2021, 12:00 PM"] },
          {
            label: "Pick-up location",
            values: ["Keflavík Airport"],
            shouldStartFromNewLine: true,
          },
          {
            label: "Pick-up details",
            values: ["pickup specify"],
          },
          { label: "Drop-off location", values: ["Keflavík Airport"] },
          {
            label: "Drop-off details",
            values: ["dropoff specify"],
          },
          {
            label: "Opening hours - Pick up station",
            values: [
              {
                key: null,
                ref: null,
                props: {
                  openingHours: [
                    {
                      isOpen: true,
                      openFrom: "00:00",
                      openTo: "01:00",
                      dayOfWeek: 1,
                    },
                    {
                      isOpen: true,
                      openFrom: "06:00",
                      openTo: "23:59",
                      dayOfWeek: 1,
                    },
                    {
                      isOpen: true,
                      openFrom: "00:00",
                      openTo: "01:00",
                      dayOfWeek: 2,
                    },
                    {
                      isOpen: true,
                      openFrom: "06:00",
                      openTo: "23:59",
                      dayOfWeek: 2,
                    },
                    {
                      isOpen: true,
                      openFrom: "00:00",
                      openTo: "01:00",
                      dayOfWeek: 3,
                    },
                    {
                      isOpen: true,
                      openFrom: "06:00",
                      openTo: "23:59",
                      dayOfWeek: 3,
                    },
                    {
                      isOpen: true,
                      openFrom: "00:00",
                      openTo: "01:00",
                      dayOfWeek: 4,
                    },
                    {
                      isOpen: true,
                      openFrom: "06:00",
                      openTo: "23:59",
                      dayOfWeek: 4,
                    },
                    {
                      isOpen: true,
                      openFrom: "00:00",
                      openTo: "01:00",
                      dayOfWeek: 5,
                    },
                    {
                      isOpen: true,
                      openFrom: "06:00",
                      openTo: "23:59",
                      dayOfWeek: 5,
                    },
                    {
                      isOpen: true,
                      openFrom: "00:00",
                      openTo: "01:00",
                      dayOfWeek: 6,
                    },
                    {
                      isOpen: true,
                      openFrom: "06:00",
                      openTo: "23:59",
                      dayOfWeek: 6,
                    },
                    {
                      isOpen: true,
                      openFrom: "00:00",
                      openTo: "01:00",
                      dayOfWeek: 0,
                    },
                    {
                      isOpen: true,
                      openFrom: "06:00",
                      openTo: "23:59",
                      dayOfWeek: 0,
                    },
                  ],
                  activeLocale: "en",
                  activeDay: 6,
                },
                _owner: null,
                _store: {},
              },
            ],
          },
          {
            label: "Opening hours - Drop-off station",
            values: [
              {
                key: null,
                ref: null,
                props: {
                  openingHours: [
                    {
                      isOpen: true,
                      openFrom: "00:00",
                      openTo: "01:00",
                      dayOfWeek: 1,
                    },
                    {
                      isOpen: true,
                      openFrom: "06:00",
                      openTo: "23:59",
                      dayOfWeek: 1,
                    },
                    {
                      isOpen: true,
                      openFrom: "00:00",
                      openTo: "01:00",
                      dayOfWeek: 2,
                    },
                    {
                      isOpen: true,
                      openFrom: "06:00",
                      openTo: "23:59",
                      dayOfWeek: 2,
                    },
                    {
                      isOpen: true,
                      openFrom: "00:00",
                      openTo: "01:00",
                      dayOfWeek: 3,
                    },
                    {
                      isOpen: true,
                      openFrom: "06:00",
                      openTo: "23:59",
                      dayOfWeek: 3,
                    },
                    {
                      isOpen: true,
                      openFrom: "00:00",
                      openTo: "01:00",
                      dayOfWeek: 4,
                    },
                    {
                      isOpen: true,
                      openFrom: "06:00",
                      openTo: "23:59",
                      dayOfWeek: 4,
                    },
                    {
                      isOpen: true,
                      openFrom: "00:00",
                      openTo: "01:00",
                      dayOfWeek: 5,
                    },
                    {
                      isOpen: true,
                      openFrom: "06:00",
                      openTo: "23:59",
                      dayOfWeek: 5,
                    },
                    {
                      isOpen: true,
                      openFrom: "00:00",
                      openTo: "01:00",
                      dayOfWeek: 6,
                    },
                    {
                      isOpen: true,
                      openFrom: "06:00",
                      openTo: "23:59",
                      dayOfWeek: 6,
                    },
                    {
                      isOpen: true,
                      openFrom: "00:00",
                      openTo: "01:00",
                      dayOfWeek: 0,
                    },
                    {
                      isOpen: true,
                      openFrom: "06:00",
                      openTo: "23:59",
                      dayOfWeek: 0,
                    },
                  ],
                  activeLocale: "en",
                  activeDay: 1,
                },
                _owner: null,
                _store: {},
              },
            ],
          },
          {
            label: "Pick up information",
            values: ["Keflavik International Airport, 235, Keflavik, Iceland"],
          },
          {
            label: "Drop off information",
            values: ["Keflavik International Airport, 235, Keflavik, Iceland"],
          },
          { label: "Car type", values: ["Small"] },
          { label: "Flight number", values: ["mock flight number"] },
          ...mockCarRentalCart0InsurancesServiceDetails,
          ...mockCarRentalCart0ExtrasServiceDetails,
        ],
      })
    );
  });
});

describe("constructCarRentalsCart", () => {
  test("should construct car products data", () => {
    expect(constructCartCarRentals(carProductBaseUrl, [mockCarRentalQueryCart0])).toEqual([
      mockCarRentalCart0,
    ]);
  });

  test("should construct car products data only with required params", () => {
    const mockCarRentalQueryCart1 = {
      ...mockCarRentalQueryCart0,
      provider: undefined,
      title: "Supercar",
      category: undefined,
      pickupId: undefined,
      dropoffId: undefined,
    };
    const mockCarRentalCart1 = {
      ...mockCarRentalCart0,
      provider: undefined,
      title: "Supercar",
      category: undefined,
      pickupId: undefined,
      dropoffId: undefined,
      clientRoute: {
        ...mockCarRentalCart0.clientRoute,
        as: `/baseUrl/search-results/book/Supercar/offerId80?from=2021-03-06 12:00&to=2021-03-08 12:00&pickup_id=-1&dropoff_id=-1&provider=0&driverAge=45&category=&pickupLocationName=${encodeURI(
          "Keflavík Airport"
        )}&dropoffLocationName=${encodeURI("Keflavík Airport")}`,
        query: {
          ...mockCarRentalCart0.clientRoute.query,
          carName: "Supercar",
          category: "",
          dropoff_id: "-1",
          pickup_id: "-1",
          provider: "0",
          pickupLocationName: "Keflavík Airport",
        },
      },
      linkUrl: `/baseUrl/search-results/book/Supercar/offerId80?from=2021-03-06 12:00&to=2021-03-08 12:00&pickup_id=-1&dropoff_id=-1&provider=0&driverAge=45&category=&pickupLocationName=${encodeURI(
        "Keflavík Airport"
      )}&dropoffLocationName=${encodeURI("Keflavík Airport")}`,
      editLinkUrl: `/baseUrl/search-results/book/Supercar/offerId80?from=2021-03-06 12:00&to=2021-03-08 12:00&pickup_id=-1&dropoff_id=-1&provider=0&driverAge=45&category=&pickupLocationName=${encodeURI(
        "Keflavík Airport"
      )}&dropoffLocationName=${encodeURI("Keflavík Airport")}&cart_item=3`,
    };

    expect(constructCartCarRentals(carProductBaseUrl, [mockCarRentalQueryCart1])).toEqual([
      mockCarRentalCart1,
    ]);
  });

  test("should construct monolith car products data", () => {
    expect(
      constructCartCarRentals(carProductBaseUrl, [
        {
          ...mockCarRentalQueryCart0,
          expiredTime: undefined,
        },
      ])
    ).toEqual([
      {
        ...mockCarRentalCart0,
        expiredTime: undefined,
      },
    ]);
  });
});

describe("constructCustomProducts", () => {
  test("should return empty array if no data", () => {
    expect(constructCustomProducts([])).toEqual([]);
  });
  test("should construct custom products data", () => {
    expect(constructCustomProducts([mockCustomProductDrink])).toEqual([
      {
        ...mockCustomProductDrink,
        from: new Date(mockCustomProductDrink.from as string),
        to: new Date(mockCustomProductDrink.to as string),
        updated: new Date(mockCustomProductDrink.updated as string),
        createdTime: new Date(mockCustomProductDrink.createdTime as string),
        date: new Date(mockCustomProductDrink.date as string),
      },
    ]);
  });
});

describe("constructCustomsServiceDetails", () => {
  test("should construct the sevice details for a non payment link product with only description and date", () => {
    expect(
      constructCustomsServiceDetails({
        customProduct: mockCustomProductDrinkConstruct,
        orderT: fakeT as TFunction,
      })
    ).toEqual(mockCustomProductDrinkProductServiceDetails);
  });
  test("should construct the 'Sevice details' section for a payment link invoice with the connected booking number, the invoice ID, and description", () => {
    expect(
      constructCustomsServiceDetails({
        customProduct: mockPaymentLinkInvoiceConstruct,
        orderT: fakeT as TFunction,
      })
    ).toEqual(mockPaymentLinkInvoiceServiceDetails);
  });
  test("should construct the 'Sevice details' section for a payment link invoice with the connected booking number, the invoice ID, description and payment date", () => {
    expect(
      constructCustomsServiceDetails({
        customProduct: mockPaidPaymentLinkInvoiceConstruct,
        orderT: fakeT as TFunction,
        paidDate: mockVoucherPaidPaymentLinkInvoice.bookingDate,
        activeLocale: SupportedLanguages.English,
      })
    ).toEqual(mockPaidPaymentLinkInvoiceServiceDetails);
  });
});

describe("getUnavailableTourClientRoute", () => {
  const tourSearchPageUrl = "book-trips-holiday";
  const from = addDays(new Date(), 5);
  const to = addDays(new Date(), 10);
  const fromFormatted = getFormattedDate(from, yearMonthDayFormat);
  const toFormatted = getFormattedDate(to, yearMonthDayFormat);

  const expectedTourClientRoute = {
    route: `/${PageType.TOURCATEGORY}`,
    query: {
      slug: "book-trips-holiday",
      [FilterQueryEnum.STARTING_LOCATION_ID]: "0",
      [FilterQueryEnum.ADULTS]: mockDayTourCart.adults,
      [FilterQueryEnum.CHILDREN]: mockDayTourCart.children,
      [FilterQueryEnum.DATE_FROM]: fromFormatted,
      [FilterQueryEnum.DATE_TO]: toFormatted,
    },
    as: `${tourSearchPageUrl}?adults=${mockDayTourCart.adults}&children=${mockDayTourCart.children}&dateFrom=${fromFormatted}&dateTo=${toFormatted}&startingLocationId=0`,
  };

  it("should return correct clientRoute for tour category", () => {
    expect(
      getUnavailableTourClientRoute(
        {
          ...mockDayTourCart,
          from,
          to,
        },
        tourSearchPageUrl
      )
    ).toEqual(expectedTourClientRoute);

    expect(
      getUnavailableTourClientRoute(
        {
          ...mockSelfDriveTourCart,
          from,
          to,
        },
        tourSearchPageUrl
      )
    ).toEqual({
      ...expectedTourClientRoute,
      query: {
        ...expectedTourClientRoute.query,
        slug: "uri",
        [FilterQueryEnum.ADULTS]: mockSelfDriveTourCart.adults,
        [FilterQueryEnum.CHILDREN]: mockSelfDriveTourCart.children,
      },
      as: `category/uri?adults=${mockSelfDriveTourCart.adults}&children=${mockSelfDriveTourCart.children}&dateFrom=${fromFormatted}&dateTo=${toFormatted}&startingLocationId=0`,
    });

    expect(
      getUnavailableTourClientRoute(
        {
          ...mockVacationPackageTourCart,
          from,
          to,
        },
        tourSearchPageUrl
      )
    ).toEqual({
      ...expectedTourClientRoute,
      query: {
        ...expectedTourClientRoute.query,
        [FilterQueryEnum.ADULTS]: mockVacationPackageTourCart.adults,
        [FilterQueryEnum.CHILDREN]: mockVacationPackageTourCart.children,
      },
      as: `${tourSearchPageUrl}?adults=${mockVacationPackageTourCart.adults}&children=${mockVacationPackageTourCart.children}&dateFrom=${fromFormatted}&dateTo=${toFormatted}&startingLocationId=0`,
    });
  });
});

describe("getUnavailableStayClientRoute", () => {
  const accommodationSearchPageUrl = "accommodation";
  const from = addDays(new Date(), 5);
  const to = addDays(new Date(), 10);
  const fromFormatted = getFormattedDate(from, yearMonthDayFormat);
  const toFormatted = getFormattedDate(to, yearMonthDayFormat);

  const expectedStayClientRoute = {
    route: `/${PageType.ACCOMMODATION_SEARCH}`,
    query: {
      [AccommodationFilterQueryParam.ROOMS]: 3,
      [AccommodationFilterQueryParam.ADULTS]: 3,
      [AccommodationFilterQueryParam.ADDRESS]: mockQueryStayConstruct0.address,
      [AccommodationFilterQueryParam.CHILDREN]: [9, 9],
      [AccommodationFilterQueryParam.DATE_FROM]: fromFormatted,
      [AccommodationFilterQueryParam.DATE_TO]: toFormatted,
      [AccommodationFilterQueryParam.TYPE]: undefined,
      [AccommodationFilterQueryParam.ID]: undefined,
      [AccommodationFilterQueryParam.ORDER_BY]: OrderBy.POPULARITY,
    },
    as: `${accommodationSearchPageUrl}?address=${encodeURIComponent(
      mockQueryStayConstruct0.address!
    )}&adults=3&children=9&children=9&dateFrom=${fromFormatted}&dateTo=${toFormatted}&orderBy=popularity&orderDirection=desc&rooms=3`,
  };

  it("should return correct clientRoute for accommodation search", () => {
    expect(
      getUnavailableStayClientRoute(
        {
          ...mockQueryStayConstruct0,
          from,
          to,
        },
        accommodationSearchPageUrl,
        false
      )
    ).toEqual(expectedStayClientRoute);
  });
});

describe("constructPaymentDetails", () => {
  it("should return correct payment details section for cart info modal", () => {
    expect(
      constructPaymentDetails({
        priceObject: {
          priceDisplayValue: "123",
          currency: "USD",
          price: 123,
          defaultPrice: 123,
        },
        voucherPriceObjects: null,
        orderT: fakeT as TFunction,
        shouldShowVat: false,
        isCartInfo: true,
      })
    ).toEqual(mockPaymentDetailsInCartInfoModal);
  });

  it("should return correct payment details section with voucher backend price display", () => {
    expect(
      constructPaymentDetails({
        priceObject: null,
        voucherPriceObjects: [
          {
            priceObject: {
              priceDisplayValue: "123.00",
              currency: "USD",
              defaultPrice: 123,
              price: 123,
            },
            // not important as no vat price
            // @ts-ignore
            vatPriceObject: {},
          },
        ],
        orderT: fakeT as TFunction,
        shouldShowVat: false,
      })
    ).toEqual(mockPaymentDetailsWithBackendPrice);
  });

  it("should return correct payment details section with VAT", () => {
    expect(
      constructPaymentDetails({
        priceObject: null,
        voucherPriceObjects: [
          {
            priceObject: {
              priceDisplayValue: "150",
              currency: "USD",
              defaultPrice: 150,
              price: 150,
            },
            vatPriceObject: {
              priceDisplayValue: "15",
              currency: "USD",
              defaultPrice: 15,
              price: 15,
            },
          },
        ],
        orderT: fakeT as TFunction,
        vatAmount: 15,
        vatPercentage: 10,
      })
    ).toEqual(mockPaymentDetails1);
  });
});

describe("constructCarRentalPaymentDetails", () => {
  it("should return correct car rental payment details section with price on arrival ", () => {
    expect(
      constructCarRentalPaymentDetails({
        carRental: mockCarRentalCart0,
        voucherPriceObjects: [
          {
            priceObject: {
              priceDisplayValue: "315",
              currency: "USD",
              defaultPrice: 315,
              price: 315,
            },
            vatPriceObject: {
              priceDisplayValue: "0",
              currency: "USD",
              defaultPrice: 0,
              price: 0,
            },
          },
        ],
        orderT: fakeT as TFunction,
        carnectT: fakeT as TFunction,
      })
    ).toEqual(mockCarRentalPaymentDetails);
  });

  it("should return correct car rental payment details section without price on arrival", () => {
    expect(
      constructCarRentalPaymentDetails({
        carRental: {
          ...mockCarRentalCart0,
          priceOnArrival: 0,
        },
        voucherPriceObjects: [
          {
            priceObject: {
              priceDisplayValue: "315",
              currency: "USD",
              defaultPrice: 315,
              price: 315,
            },
            vatPriceObject: {
              priceDisplayValue: "0",
              currency: "USD",
              defaultPrice: 0,
              price: 0,
            },
          },
        ],
        orderT: fakeT as TFunction,
        carnectT: fakeT as TFunction,
      })
    ).toEqual(mockCarRentalPaymentDetails1);
  });

  it("should return correct car rental payment details section for car with VAT", () => {
    expect(
      constructCarRentalPaymentDetails({
        carRental: {
          ...mockCarRentalCart0,
          priceOnArrival: 0,
        },
        voucherPriceObjects: [
          {
            priceObject: {
              priceDisplayValue: "315",
              defaultPrice: 315,
              currency: "USD",
              price: 315,
            },
            vatPriceObject: {
              priceDisplayValue: "37",
              defaultPrice: 37,
              currency: "USD",
              price: 37,
            },
          },
        ],
        orderT: fakeT as TFunction,
        carnectT: fakeT as TFunction,
        vatPercentage: 11,
        vatAmount: 37,
      })
    ).toEqual(mockCarRentalPaymentDetails2);
  });

  it("should return correct car rental payment details section for car with backend price value", () => {
    expect(
      constructCarRentalPaymentDetails({
        carRental: {
          ...mockCarRentalCart0,
          totalPrice: 100000,
          priceObject: {
            price: 100,
            defaultPrice: 100,
            currency: "ISK",
            priceDisplayValue: "100,000",
          },
          priceOnArrival: 0,
        },
        voucherPriceObjects: [
          {
            priceObject: {
              price: 100,
              defaultPrice: 100,
              currency: "USD",
              priceDisplayValue: "100,000",
            },
            vatPriceObject: {
              price: 37,
              defaultPrice: 37,
              currency: "USD",
              priceDisplayValue: "37",
            },
          },
        ],
        orderT: fakeT as TFunction,
        carnectT: fakeT as TFunction,
        vatPercentage: 11,
        vatAmount: 37,
      })
    ).toEqual(mockCarRentalPaymentDetailsWithBackendPrice);
  });
});

describe("constructCartStays", () => {
  it("should construct non-GTE stay cart product", () => {
    expect(constructCartStays(false, [mockQueryStay0])).toEqual([mockQueryStayConstruct0]);
  });

  it("should construct GTE stay cart product", () => {
    expect(constructCartStays(true, [mockQueryStay0])).toEqual([
      {
        ...mockQueryStayConstruct0,
        clientRoute: {
          ...mockQueryStayConstruct0.clientRoute,
          route: `/${PageType.GTE_STAY}`,
        },
      },
    ]);
  });
});

describe("constructGTECartStays", () => {
  it("returns empty array if no stays are available", () => {
    expect(constructGTECartStays()).toEqual([]);
  });
  it("returns empty array if stays are empty", () => {
    expect(constructGTECartStays([])).toEqual([]);
  });
  it("should construct stays for cart product", () => {
    expect(constructGTECartStays([mockQueryGTEStay0])).toEqual([mockQueryGTEStayConstruct0]);
  });
});

describe("constructCartVacationPackages", () => {
  it("should construct vacation package cart product", () => {
    expect(
      constructCartVacationPackages({
        vacationPackages: [mockQueryVacationPackage],
        flightT: fakeT as TFunction,
        flightSearchBaseUrl,
        carProductBaseUrl,
      })
    ).toEqual([mockConstructVacationPackage]);
  });
});

describe("constructVacationProductServiceDetails", () => {
  test("should construct vacation package service details", () => {
    expect(
      constructVacationProductServiceDetails({
        vacationPackageProduct: mockConstructVacationPackage,
        orderT: fakeT as TFunction,
        carnectT: fakeT as TFunction,
        locale: SupportedLanguages.English,
      })
    ).toEqual(mockVacationPackageServiceDetails);
  });

  test("should construct vacation package without flight service details", () => {
    expect(
      constructVacationProductServiceDetails({
        vacationPackageProduct: {
          ...mockConstructVacationPackage,
          flights: [],
        },
        orderT: fakeT as TFunction,
        carnectT: fakeT as TFunction,
        locale: SupportedLanguages.English,
      })
    ).toEqual(mockVacationPackageWithoutFlightsServiceDetails);
  });
});

describe("getTourDuration", () => {
  test("should return total days and total nights for tour/vp product", () => {
    expect(getTourDuration(mockConstructVacationPackage)).toEqual({
      daysDuration: 3,
      nightsDuration: 2,
    });
  });
});

describe("getStayServiceDetails", () => {
  test("should group together all stays since they are all in same hotel", () => {
    expect(
      getGTEStayServiceDetails([mockQueryGTEStayConstruct0, mockQueryGTEStayConstruct0])
    ).toEqual([
      {
        productId: 479794,
        numberOfNights: 2,
        title: "Hotel Caron",
      },
      {
        productId: 479794,
        numberOfNights: 2,
        title: "Hotel Caron",
      },
    ]);
  });
  test("should group together stays in same hotel", () => {
    expect(
      getGTEStayServiceDetails([
        mockQueryGTEStayConstruct0,
        mockQueryGTEStayConstruct0,
        mockQueryGTEStayConstruct0,
      ])
    ).toEqual([
      {
        productId: 479794,
        numberOfNights: 2,
        title: "Hotel Caron",
      },
      {
        productId: 479794,
        numberOfNights: 2,
        title: "Hotel Caron",
      },
      {
        productId: 479794,
        numberOfNights: 2,
        title: "Hotel Caron",
      },
    ]);
  });
});

describe("constructGTEStayServiceDetails", () => {
  it("constructs stays service details", () => {
    expect(
      constructGTEStayServiceDetails({
        stay: mockQueryGTEStayConstruct0,
        activeLocale: SupportedLanguages.English,
        orderT: fakeTranslateWithValues,
      })
    ).toEqual(mockQueryGTEStay0ServiceDetails);
  });

  it("constructs stays service details with kids included label", () => {
    expect(
      constructGTEStayServiceDetails({
        stay: {
          ...mockQueryGTEStayConstruct0,
          totalNumberOfChildren: 2,
        },
        activeLocale: SupportedLanguages.English,
        orderT: fakeTranslateWithValues,
      }).sections
    ).toContainEqual({
      label: "label:Guests, options:undefined",
      values: [
        'label:{numberOfAdults} adults, options:{"numberOfAdults":2}',
        'label:{numberOfChildren} children, options:{"numberOfChildren":2}',
      ],
    });
  });
});

describe("constructGTEStayRoomDetails", () => {
  it("constructs stays room details info", () => {
    expect(
      constructGTEStayRoomDetails({
        stay: mockQueryGTEStayConstruct0,
        activeLocale: SupportedLanguages.English,
        orderT: fakeTranslateWithValues,
        bookingInfoReference: [
          {
            availabilityId: mockQueryGTEStay0Room1.availabilityId,
            externalId: "TF6288295",
          },
          {
            availabilityId: mockQueryGTEStay0Room2.availabilityId,
            externalId: "TF6288296",
          },
        ],
      })
    ).toStrictEqual(mockQueryGTEStay0RoomDetails);
  });
});

describe("buildCheckingOutDateString", () => {
  it("returns full date with time for a given locale when timestring is available", () => {
    expect(
      buildCheckingOutDateString(
        new Date("2022-01-01T00:00:00.000Z"),
        SupportedLanguages.English,
        "15:00"
      )
    ).toEqual("January 1, 2022, 15:00");
  });

  it("returns only full datewhen timestring is unavailable", () => {
    expect(buildCheckingOutDateString(new Date("2020-02-15"), SupportedLanguages.English)).toEqual(
      "February 15, 2020"
    );
  });

  it("returns only full datewhen timestring is invalid", () => {
    expect(
      buildCheckingOutDateString(new Date("2020-02-23"), SupportedLanguages.English, "abc:09")
    ).toEqual("February 23, 2020");
  });
});

describe("adjustSectionsDisplayWithEmptyLines - adjusts two-column display of voucher sections", () => {
  const section = {
    label: "1",
    values: [],
  } as OrderTypes.VoucherSection;

  const sectionFromNewLine = {
    label: "new-line",
    values: [],
    shouldStartFromNewLine: true,
  } as OrderTypes.VoucherSection;

  const sectionEmpty = {
    label: "",
    values: [],
    isEmptySection: true,
  } as OrderTypes.VoucherSection;
  it("should not add empty section if a section not marked to start from new line", () => {
    expect(adjustSectionsDisplayWithEmptyLines([section, section, section])).toEqual([
      section,
      section,
      section,
    ]);
  });
  it("adds empty column if the section marked to start from new line", () => {
    expect(
      adjustSectionsDisplayWithEmptyLines([
        // row1
        ...[section, sectionFromNewLine],
        // row2
        ...[section],
      ])
    ).toEqual([
      // row1
      ...[section, sectionEmpty],
      // row2
      ...[sectionFromNewLine, section],
    ]);
  });

  it("does not add empty sections when the section position is odd (already on a new line)", () => {
    expect(
      adjustSectionsDisplayWithEmptyLines([
        // row1
        ...[sectionFromNewLine, section],
        // row2
        ...[sectionFromNewLine, section],
      ])
    ).toEqual([sectionFromNewLine, section, sectionFromNewLine, section]);
  });

  it("adds empty sections for the sectins marked with new line only if their position is even", () => {
    expect(
      adjustSectionsDisplayWithEmptyLines([
        // row1
        ...[sectionFromNewLine, section],
        // row2
        ...[sectionFromNewLine, sectionFromNewLine],
        // row3
        ...[section],
      ])
    ).toEqual([
      // row1
      ...[sectionFromNewLine, section],
      // row2
      ...[sectionFromNewLine, sectionEmpty],
      // row3
      ...[sectionFromNewLine, section],
    ]);
  });
});

describe("constructVoucherPriceLabels", () => {
  it("combines multiple voucher prices in one string", () => {
    expect(
      constructVoucherPriceLabels([
        {
          priceObject: {
            currency: "EUR",
            price: 100,
            defaultPrice: 100,
            priceDisplayValue: "100",
          },
          // not important for the test
          // @ts-ignore
          vatPriceObject: undefined,
        },
      ])
    ).toEqual("100 EUR");
  });

  it("combines multiple voucher prices in one string", () => {
    expect(
      constructVoucherPriceLabels([
        {
          priceObject: {
            currency: "EUR",
            price: 100,
            defaultPrice: 100,
            priceDisplayValue: "100",
          },
          // not important for the test
          // @ts-ignore
          vatPriceObject: undefined,
        },
        {
          priceObject: {
            currency: "USD",
            price: 50.5,
            defaultPrice: 50.5,
            priceDisplayValue: "50,5",
          },
          // not important for the test
          // @ts-ignore
          vatPriceObject: undefined,
        },
      ])
    ).toEqual("100 EUR + 50,5 USD");
  });

  it("combines multiple voucher vatPrices in one string", () => {
    expect(
      constructVoucherPriceLabels(
        [
          {
            vatPriceObject: {
              currency: "EUR",
              price: 100,
              defaultPrice: 100,
              priceDisplayValue: "100",
            },
            // not important for the test
            // @ts-ignore
            priceObject: undefined,
          },
          {
            vatPriceObject: {
              currency: "USD",
              price: 50.5,
              defaultPrice: 50.5,
              priceDisplayValue: "50,5",
            },
            // not important for the test
            // @ts-ignore
            priceObject: undefined,
          },
        ],
        true
      )
    ).toEqual("100 EUR + 50,5 USD");
  });

  it("returns empty string for 0 price", () => {
    expect(
      constructVoucherPriceLabels(
        [
          {
            priceObject: {
              currency: "EUR",
              price: 0,
              defaultPrice: 0,
              priceDisplayValue: "0",
            },
            // not important for the test
            // @ts-ignore
            vatPriceObject: undefined,
          },
          {
            priceObject: {
              currency: "USD",
              price: 0,
              defaultPrice: 0,
              priceDisplayValue: "0",
            },
            // not important for the test
            // @ts-ignore
            vatPriceObject: undefined,
          },
        ],
        true
      )
    ).toEqual("");
  });
  it("returns empty string for 0 vatPrices", () => {
    expect(
      constructVoucherPriceLabels(
        [
          {
            vatPriceObject: {
              currency: "EUR",
              price: 0,
              defaultPrice: 0,
              priceDisplayValue: "0",
            },
            // not important for the test
            // @ts-ignore
            priceObject: undefined,
          },
          {
            vatPriceObject: {
              currency: "USD",
              price: 0,
              defaultPrice: 0,
              priceDisplayValue: "0",
            },
            // not important for the test
            // @ts-ignore
            priceObject: undefined,
          },
        ],
        true
      )
    ).toEqual("");
  });
});

describe("constructGTETourServiceDetails", () => {
  it("constructs tour service details", () => {
    const gteTours = constructCartGTETours([mockQueryGTETour]);
    expect(
      constructGTETourServiceDetails({
        tour: gteTours[0],
        orderT: fakeT,
      })
    ).toEqual({
      sections: [
        {
          label: "Duration",
          values: ["2 hours"],
        },
        {
          label: "Travellers",
          values: ["2 Adult"],
        },
        {
          label: "Starts",
          values: ["Apr 25 at 09:00"],
        },
        {
          label: "Starting location",
          values: [""],
        },
        {
          label: "Guided language",
          values: ["en audio guide"],
        },
        {
          label: "Included",
          values: ["08.30 - Premium Entrance "],
        },
      ],
      title: "Service details",
    });
  });
});
