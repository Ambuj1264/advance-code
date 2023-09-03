import { addDays } from "date-fns";
import { NextRouter } from "next/router";

import {
  mockCarSelectedInfo,
  mockCombinedCars,
  mockCombinedCarsNoMedium,
  mockCombinedCarsOnlySmall,
  mockVPCarsOnlySmall,
  mockVPCars,
  mockVPCarsNoMedium,
} from "../VPCarSection/mockData/vpCarSectionMockData";
import {
  mock2xCheckedBag,
  mock2xCheckedCombo,
  mockCombinationResult,
  mockCountedDuplicates,
  mockPassengers,
  mockSelectedBaggage,
  mockSingleBag,
  mockVPProduct,
  mockVPQueryResult,
  mockQueryVacationPackageDays,
  mockVPDestinationsInfo,
  mockQueryVacationPackageDays2,
  mockVPDestinationsInfo2,
} from "../mockData/vpProductPageMockData";

import {
  calculateFlightDuration,
  constructVacationPackageContent,
  getFlightsbyRankings,
  constructVPCarProducts,
  constructStaysQuickFacts,
  sortStaysArray,
  constructStaysSearchParams,
  constructCheapestOrNearestDates,
  constructVacationDateTo,
  constructPriceLabel,
  extractGroupedDaysValue,
  constructStayPriceInput,
  getSelectedRoomTypes,
  getVPLandingUrl,
  getMissingDaysString,
  getAllSelectedBaggage,
  getPassengerSelectedBaggage,
  getCombination,
  getBaggageText,
  countBagTypes,
  constructVPIncluded,
  constructVPDestinationsInfo,
} from "./vacationPackageUtils";

import {
  mockComplexFlightItinerary0,
  mockItineraryArray,
  sortedFlights,
} from "components/ui/FlightsShared/flightsMockData";
import {
  mockStayProduct,
  mockHotels,
  mockStayProductNoQuickFacts,
  mockProductsArrayUnsorted,
  mockProductsArraySorted,
  mockVPSearchPageQueryParams,
  mockVPStaysSearchQueryParams,
  mockVPSearchPageQueryParamsInfantsChildren,
  mockVPStaysSearchQueryParamsInfantsChildren,
  mockSelectedRooms,
  mockSelectedRoomTypes,
} from "components/features/VacationPackageProductPage/VPStaysSection/VPStaysMockData/VPStaysMockData";
import { useTranslation } from "i18n";
import Icon from "components/ui/GraphCMSIcon";
import { Namespaces } from "shared/namespaces";
import {
  sortCarSearchResults,
  constructCarSearch,
} from "components/features/CarSearchPage/utils/carSearchUtils";
import { Marketplace, OrderBy, SupportedLanguages } from "types/enums";
import { normaliseDates } from "components/ui/DatePicker/utils/datePickerUtils";
import { emptyArray } from "utils/constants";
import { mockRoomCombination1 } from "components/features/StayProductPage/utils/stayMockData";

const fakeTranslate = (value: string) => value;

jest.mock("components/ui/GraphCMSIcon", () => ({
  __esModule: true,
  default: jest.fn(() => "mockedIcon"),
}));

// CONTENT

describe("constructVacationPackageContent", () => {
  test("should return correctly constructed vacation package product page", () => {
    expect(
      JSON.parse(
        JSON.stringify(
          constructVacationPackageContent([mockVPQueryResult], fakeTranslate as TFunction, "")
        )
      )
    ).toEqual(mockVPProduct);
  });
});

describe("normaliseDates in vacation package", () => {
  const mockVacationLength = 7;
  const mockPastSelectedDates = {
    from: new Date("2021-07-07T00:00:00.000Z"),
    to: new Date("2021-07-14T00:00:00.000Z"),
  };
  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = addDays(today, 1);
  test("should return the day after current day for 'from' date and current day plus the vacation length for 'to' date when those are in the past", () => {
    const mockFixedDate = {
      from: tomorrow,
      to: constructVacationDateTo(mockVacationLength, tomorrow),
    };
    expect(normaliseDates(mockPastSelectedDates, true)).toEqual(mockFixedDate);
  });
  test("should return the same 'from' and 'to' when those are not in the past", () => {
    const futureTime = addDays(today, 10);
    const mockFutureSelectedDates = {
      from: futureTime,
      to: constructVacationDateTo(mockVacationLength, futureTime),
    };
    expect(normaliseDates(mockFutureSelectedDates, true)).toEqual(mockFutureSelectedDates);
  });
  test("should return the same 'from' and 'to' when 'from' is set to tomorrow and 'to' is set to tomorrow plus the vacation length", () => {
    const mockFutureSelectedDates = {
      from: tomorrow,
      to: constructVacationDateTo(mockVacationLength, tomorrow),
    };
    expect(normaliseDates(mockFutureSelectedDates, true)).toEqual(mockFutureSelectedDates);
  });
});

// FLIGHT SECTION

describe("calculateFlightDuration", () => {
  const calculatedTotalDuration = 128800;
  test("should return correctly calculated flight duration", () => {
    // TODO: add more tests with edge cases :)
    expect(calculateFlightDuration(mockComplexFlightItinerary0)).toEqual(calculatedTotalDuration);
  });
});

describe("getFlightsbyRankings", () => {
  test("should return array of sorted objects, Best, Cheapest and Fastest", () => {
    // TODO: add more tests with edge cases :)
    expect(getFlightsbyRankings(mockItineraryArray)).toEqual(sortedFlights);
  });
});

// CAR SECTION

const dummyConvert = (value: number) => value;

describe("constructVPCarProducts", () => {
  const { t: commonCarT } = useTranslation(Namespaces.commonCarNs);
  test("should return a list of three cars of types Small, Medium & Premium", () => {
    const mockConstructedCars = constructCarSearch(
      commonCarT,
      mockCarSelectedInfo,
      mockCombinedCars,
      Marketplace.GUIDE_TO_EUROPE,
      dummyConvert,
      "ISK",
      SupportedLanguages.Chinese,
      45,
      "DE"
    );
    expect(constructVPCarProducts(mockConstructedCars, mockCombinedCars)).toEqual(mockVPCars);
  });

  test("should return a list of three cars of types Small, Large & Premium", () => {
    const mockConstructedCars = constructCarSearch(
      commonCarT,
      mockCarSelectedInfo,
      mockCombinedCarsNoMedium,
      Marketplace.GUIDE_TO_EUROPE,
      dummyConvert,
      "ISK",
      SupportedLanguages.Chinese,
      45,
      "DE"
    );
    expect(constructVPCarProducts(mockConstructedCars, mockCombinedCarsNoMedium)).toEqual(
      mockVPCarsNoMedium
    );
  });

  test("should return multiple cars of a single type", () => {
    const mockConstructedCars = constructCarSearch(
      commonCarT,
      mockCarSelectedInfo,
      mockCombinedCarsOnlySmall,
      Marketplace.GUIDE_TO_EUROPE,
      dummyConvert,
      "ISK",
      SupportedLanguages.Chinese,
      45,
      "DE"
    );
    const mockSortedSmallCars = sortCarSearchResults(mockConstructedCars, OrderBy.POPULARITY);
    expect(constructVPCarProducts(mockSortedSmallCars, mockCombinedCarsOnlySmall)).toEqual(
      mockVPCarsOnlySmall
    );
  });

  test("should return an empty list", () => {
    const mockConstructedCars = constructCarSearch(
      commonCarT,
      mockCarSelectedInfo,
      [],
      Marketplace.GUIDE_TO_EUROPE,
      dummyConvert,
      "ISK",
      SupportedLanguages.Chinese,
      45,
      "DE"
    );
    expect(constructVPCarProducts(mockConstructedCars, [])).toEqual([]);
  });
});

// STAYS SECTION

describe("staysQuickFacts", () => {
  const { t: quickFactsNsT } = useTranslation(Namespaces.accommodationNs);
  const { quickFacts } = mockStayProduct;

  const translateOptions: { [p: string]: string | number } = {
    checkin: mockStayProduct.checkInTime ?? "",
    checkout: mockStayProduct.checkOutTime ?? "",
    distanceFromCenter: mockStayProduct.distanceFromCenter ?? "",
    starClass: mockStayProduct.starClass ?? 0,
    subtype: mockStayProduct?.subtype ?? "",
    numberOfGuests: 2,
    address: mockStayProduct?.address ?? "",
    roomTypes:
      mockStayProduct?.roomCombinations?.find(roomCombination => roomCombination.isSelected)
        ?.title ?? "",
  };

  test("should return formatted quickFacts", () => {
    const mockedQuickFactsFormatted = [
      {
        Icon: Icon(quickFacts?.[0]?.icon?.handle),
        name: "",
        value: quickFactsNsT(quickFacts?.[0]?.name?.value ?? "", translateOptions),
      },
      {
        Icon: Icon(quickFacts?.[1]?.icon?.handle),
        name: "Location",
        value: quickFactsNsT(quickFacts?.[1]?.name?.value ?? "", translateOptions),
      },
    ];
    expect(constructStaysQuickFacts(mockStayProduct, 2, quickFactsNsT)).toEqual(
      mockedQuickFactsFormatted
    );
  });

  test("should return empty array if product has no quick facts", () => {
    expect(constructStaysQuickFacts(mockStayProductNoQuickFacts, 2, quickFactsNsT)).toEqual([]);
  });
});

test("sortStaysArray - should sort Products array in order of [Budget, Comfort, Quality]", () => {
  expect(sortStaysArray(mockProductsArrayUnsorted, false)).toEqual(mockProductsArraySorted);
});

describe("constructStaysSearchParams", () => {
  test("constructStaysSearchParams - should return staysSearchParams", () => {
    expect(constructStaysSearchParams(mockVPSearchPageQueryParams)).toEqual(
      mockVPStaysSearchQueryParams
    );
  });

  test("constructStaysSearchParams - should return staysSearchParams with children ages calculated", () => {
    expect(constructStaysSearchParams(mockVPSearchPageQueryParamsInfantsChildren)).toEqual(
      mockVPStaysSearchQueryParamsInfantsChildren
    );
  });
});

describe("extractGroupedDaysValue", () => {
  test("extractGroupedDaysValue - should return correct value for grouped days", () => {
    expect(extractGroupedDaysValue(1, 454859)).toEqual(emptyArray);

    expect(extractGroupedDaysValue(1, 454858, mockHotels)).toEqual([1, 2]);

    expect(extractGroupedDaysValue(2, 454859, mockHotels)).toEqual([1, 2]);

    expect(extractGroupedDaysValue(3, 454862, mockHotels)).toEqual([3]);

    expect(extractGroupedDaysValue(5, 454866, mockHotels)).toEqual([4, 5]);
  });
});

describe("constructStayPriceInput", () => {
  test("should correctly construct stay price input", () => {
    expect(
      constructStayPriceInput({
        selectedStayDay: 1,
        selectedHotelsRooms: mockSelectedRooms,
      })
    ).toEqual([
      {
        key: 1,
        value: [
          {
            productId: 454858,
            availabilityId: "slobgpsj23",
            selected: true,
          },
        ],
      },
      {
        key: 2,
        value: [
          {
            productId: 454858,
            availabilityId: "slobgpsj23",
            selected: true,
          },
        ],
      },
    ]);

    expect(
      constructStayPriceInput({
        selectedStayDay: 3,
        selectedHotelsRooms: mockSelectedRooms,
      })
    ).toEqual([
      {
        key: 3,
        value: [
          {
            productId: 454862,
            availabilityId: "slobgpsj2sdvb3",
            selected: true,
          },
        ],
      },
    ]);
  });
});

describe("getSelectedRoomTypes", () => {
  test("should correctly return selected room types", () => {
    expect(getSelectedRoomTypes([])).toEqual([]);

    expect(getSelectedRoomTypes(mockSelectedRoomTypes)).toEqual(mockSelectedRoomTypes);
  });
});

describe("constructCheapestOrNearestDates", () => {
  it("when the cheapest month date is in future builds the vacation dates considering cheapest month", () => {
    const today = new Date("2022-01-10");
    const cheapestMonthDate = "2033-07-07";
    expect(constructCheapestOrNearestDates(today, 5, cheapestMonthDate)).toEqual({
      from: new Date("2033-07-07T00:00:00.000Z"),
      to: new Date("2033-07-11T00:00:00.000Z"),
    });
  });

  it("when the cheapest month date is in the past builds the vacation dates for the nearestDateFallback period", () => {
    const nearestDateFallback = new Date("2022-01-10");
    const cheapestMonthDateInThePast = "1999-01-01";
    expect(
      constructCheapestOrNearestDates(nearestDateFallback, 5, cheapestMonthDateInThePast)
    ).toEqual({
      from: new Date("2022-01-10T00:00:00.000Z"),
      to: new Date("2022-01-14T00:00:00.000Z"),
    });
  });

  it("when the cheapest month date is absent - builds the vacation dates for the nearestDateFallback period", () => {
    const nearestDateFallback = new Date("2022-01-10");
    expect(constructCheapestOrNearestDates(nearestDateFallback, 5)).toEqual({
      from: new Date("2022-01-10T00:00:00.000Z"),
      to: new Date("2022-01-14T00:00:00.000Z"),
    });
  });

  it("when the vacation package lasts for the 1 day - has the same endDate", () => {
    const nearestDateFallback = new Date("2022-01-10");
    expect(constructCheapestOrNearestDates(nearestDateFallback, 1)).toEqual({
      from: new Date("2022-01-10T00:00:00.000Z"),
      to: new Date("2022-01-10T00:00:00.000Z"),
    });
  });

  it("when the vacation package lasts for the 0 day - has the same endDate", () => {
    const nearestDateFallback = new Date("2022-01-10");
    expect(constructCheapestOrNearestDates(nearestDateFallback, 0)).toEqual({
      from: new Date("2022-01-10T00:00:00.000Z"),
      to: new Date("2022-01-10T00:00:00.000Z"),
    });
  });
});

describe("constructVacationDateTo", () => {
  it("sets the same dateTo for 1 or less days of vacation length", () => {
    expect(constructVacationDateTo(1, new Date("2021-01-01"))).toEqual(new Date("2021-01-01"));

    expect(constructVacationDateTo(0, new Date("2021-01-01"))).toEqual(new Date("2021-01-01"));

    expect(constructVacationDateTo(-1, new Date("2021-01-01"))).toEqual(new Date("2021-01-01"));
  });

  it("sets the proper dateTo for more than 1 day of vacation length", () => {
    expect(constructVacationDateTo(2, new Date("2021-01-01"))).toEqual(new Date("2021-01-02"));
  });
});

describe("constructPriceLabel", () => {
  test("should return included price label", () => {
    expect(
      constructPriceLabel({
        tFunction: fakeTranslate as TFunction,
        currencyCode: "EUR",
        price: 0,
        isSelected: true,
      })
    ).toEqual("Selected");
  });

  test("should return selected price label", () => {
    expect(
      constructPriceLabel({
        tFunction: fakeTranslate as TFunction,
        currencyCode: "EUR",
        price: 0,
        isSelected: false,
      })
    ).toEqual("0 EUR");
  });

  test("should return selected price label when the price is per day", () => {
    expect(
      constructPriceLabel({
        tFunction: fakeTranslate as TFunction,
        currencyCode: "EUR",
        price: 0,
        isSelected: false,
        isPricePerDay: true,
      })
    ).toEqual("0 EUR per day");
  });

  test("should return correct positive price label", () => {
    expect(
      constructPriceLabel({
        tFunction: fakeTranslate as TFunction,
        currencyCode: "EUR",
        price: 123,
        isSelected: false,
      })
    ).toEqual("+123 EUR");
  });

  test("should return correct positive price with decimal label", () => {
    expect(
      constructPriceLabel({
        tFunction: fakeTranslate as TFunction,
        currencyCode: "EUR",
        price: 123.333,
        isSelected: false,
      })
    ).toEqual("+124 EUR");
    expect(
      constructPriceLabel({
        tFunction: fakeTranslate as TFunction,
        currencyCode: "EUR",
        price: 123.39999,
        isSelected: false,
      })
    ).toEqual("+124 EUR");
    expect(
      constructPriceLabel({
        tFunction: fakeTranslate as TFunction,
        currencyCode: "EUR",
        price: -123.39999,
        isSelected: false,
      })
    ).toEqual("-124 EUR");
  });

  test("should return correct negative price label", () => {
    expect(
      constructPriceLabel({
        tFunction: fakeTranslate as TFunction,
        currencyCode: "EUR",
        price: -123,
        isSelected: false,
      })
    ).toEqual("-123 EUR");
  });
});

describe("getVPLandingUrl", () => {
  test("returns correct landing url with all params set", () => {
    const mockRouterWithParams = {
      asPath: "/countryName/best-vacation-packages/sectionName/vacation-package-name",
    } as unknown as NextRouter;
    expect(
      getVPLandingUrl(
        "best-vacation-packages",
        "https://guidetoeurope.com",
        mockRouterWithParams,
        "?queryParams=blah"
      )
    ).toBe("/countryName/best-vacation-packages/sectionName?queryParams=blah");
  });

  test("returns correct landing url with none or few params set", () => {
    const mockRouterWithoutParams = {
      asPath: "",
    } as unknown as NextRouter;
    const mockRouterWithCountryParam = {
      asPath: "/countryName/best-vacation-packages",
    } as unknown as NextRouter;
    const mockRouterWithSectionParam = {
      asPath: "/countryName/best-vacation-packages/sectionName",
    } as unknown as NextRouter;
    const mockRouterWithActiveLocale = {
      asPath: "/countryName/best-vacation-packages/",
    } as unknown as NextRouter;

    expect(getVPLandingUrl("baseUrl", "https://guidetoeurope.com", mockRouterWithoutParams)).toBe(
      "/baseUrl"
    );
    expect(
      getVPLandingUrl("baseUrl", "https://guidetoeurope.com", mockRouterWithCountryParam)
    ).toBe("/countryName/baseUrl");
    expect(
      getVPLandingUrl("baseUrl", "https://guidetoeurope.com", mockRouterWithSectionParam)
    ).toBe("/countryName/baseUrl");
    expect(
      getVPLandingUrl("da/baseUrl", "https://guidetoeurope.com", mockRouterWithActiveLocale)
    ).toBe("/da/countryName/baseUrl");
  });
});

describe("getMissingDaysString", () => {
  const commonDayKeys = {
    region: "region",
    description: "description",
    attractions: [],
    destinations: [],
  };
  const vp5Days: VacationPackageTypes.VacationPackageDay[] = [
    {
      id: "id1",
      ...commonDayKeys,
    },
    {
      id: "id2",
      ...commonDayKeys,
    },
    {
      id: "id3",
      ...commonDayKeys,
    },
    {
      id: "id4",
      ...commonDayKeys,
    },
    {
      id: "id5",
      ...commonDayKeys,
    },
  ];

  const commonRoomKeys = {
    fromPrice: 50,
    rateReference: "rateReference01",
    maxOccupancy: 2,
    dateCheckingIn: "2033-07-07T00:00:00.000Z",
    dateCheckingOut: "2033-08-07T00:00:00.000Z",
    roomCombinations: [mockRoomCombination1],
  };
  const vpSelectedRooms5Days: VacationPackageTypes.SelectedVPStaysRoomType[] = [
    {
      productId: 1,
      day: 1,
      groupedWithDays: [1],
      title: "title",
      ...commonRoomKeys,
    },
    {
      productId: 2,
      groupedWithDays: [1],
      day: 1,
      title: "title2",
      ...commonRoomKeys,
    },
    {
      productId: 3,
      day: 2,
      groupedWithDays: [2],
      title: "title3",
      ...commonRoomKeys,
    },
    {
      productId: 4,
      day: 3,
      groupedWithDays: [3],
      title: "title4",
      ...commonRoomKeys,
    },
    {
      productId: 5,
      day: 4,
      groupedWithDays: [4],
      title: "title5",
      ...commonRoomKeys,
    },
  ];
  it("should return string of a comma separated days which are missing in rooms data", () => {
    expect(getMissingDaysString(vp5Days, [])).toBe("1, 2, 3, 4");
    expect(
      getMissingDaysString(vp5Days, [
        vpSelectedRooms5Days[0],
        vpSelectedRooms5Days[1],
        vpSelectedRooms5Days[2],
      ])
    ).toBe("3, 4");
    expect(getMissingDaysString(vp5Days, [vpSelectedRooms5Days[4]])).toBe("1, 2, 3");
  });
  it("should return empty string in case no days are missing", () => {
    expect(getMissingDaysString(vp5Days, vpSelectedRooms5Days)).toBe("");
  });
});

describe("getAllSelectedBaggage", () => {
  test("should return array of strings with the names of the bags included/selected for given flight for all passengers", () => {
    expect(getAllSelectedBaggage(mockPassengers)).toEqual(mockSelectedBaggage);
  });
});

describe("getPassengerSelectedBaggage", () => {
  test("should return array of strings with the names of the bags included/selected for given flight for a single passenger", () => {
    expect(getPassengerSelectedBaggage(mockPassengers[0].bags)).toEqual(mockSelectedBaggage);
  });
});

describe("getCombination", () => {
  test("should return array of objects with the names and count of the bag/s in the bagCombination", () => {
    expect(getCombination(mockSingleBag)).toEqual(mockCombinationResult);
  });
  test("should return array containing 1 object with the name: 'Checked bag' and count 2 in the bagCombination", () => {
    expect(getCombination(mock2xCheckedBag)).toEqual(mock2xCheckedCombo);
  });
});

describe("countBagTypes", () => {
  test("should return array of objects with the count of each type of bag included/selected", () => {
    expect(countBagTypes(mockSelectedBaggage.paidCombination)).toEqual(mockCountedDuplicates);
  });
});

describe("getBaggageText", () => {
  test("should return text containing all of the baggage the passangers have for the flight/s", () => {
    expect(getBaggageText(mockCountedDuplicates, fakeTranslate as TFunction)).toEqual(
      "{numberOfBags} personal items & {numberOfBags} cabin bags & {numberOfBags} checked bags"
    );
  });
});

describe("constructVPIncluded", () => {
  const valueProps = [
    {
      id: "car",
      title: "car title",
      icon: { handle: "" },
    },
    {
      id: "hotel",
      title: "hotel title",
      icon: { handle: "" },
    },
    {
      id: "cdw-insurance",
      title: "cdw-insurance title",
      icon: { handle: "" },
    },
  ];
  test("should return translated titles for car and hotel value props", () => {
    expect(
      constructVPIncluded({
        tFunc: fakeTranslate as TFunction,
        included: valueProps,
        vacationLength: 3,
        vacationIncludesCar: true,
      })
    ).toEqual([
      {
        icon: { handle: "" },
        id: "car",
        title: "{numberOfDays} days car rental",
      },
      {
        icon: { handle: "" },
        id: "hotel",
        title: "{numberOfNights} nights hotel",
      },
      {
        icon: { handle: "" },
        id: "cdw-insurance",
        title: "cdw-insurance title",
      },
    ]);
  });

  test("should filter out car and cdw-insurance in case cars are not included", () => {
    expect(
      constructVPIncluded({
        tFunc: fakeTranslate as TFunction,
        included: valueProps,
        vacationLength: 3,
        vacationIncludesCar: false,
      })
    ).toEqual([
      {
        icon: { handle: "" },
        id: "hotel",
        title: "{numberOfNights} nights hotel",
      },
    ]);
  });
});

describe("constructVPDestinationsInfo", () => {
  test("should return correctly constructed destination info for a single destination package", () => {
    expect(constructVPDestinationsInfo(mockQueryVacationPackageDays)).toEqual(
      mockVPDestinationsInfo
    );
  });
  test("should return correctly constructed destination info for a multi destination package", () => {
    expect(constructVPDestinationsInfo(mockQueryVacationPackageDays2)).toEqual(
      mockVPDestinationsInfo2
    );
  });
});
