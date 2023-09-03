import { some, none } from "fp-ts/lib/Option";
import { advanceTo, clear } from "jest-date-mock";

import {
  constructPluralText,
  constructDates,
  constructBookingWidgetTourData,
  getPickupPrices,
  calculatePickupPrice,
  calculateTourTotalPrice,
  calculateGTIVpTotalPrice,
  constructFlexibleAvailableTime,
  constructTourTimesAvailability,
  constructGTIVpTimesAvailability,
  filterOutUnavailableTimes,
  getSelectedExperienceTotalPrice,
  getExperiencePrices,
  constructTravelerPrices,
  constructFormData,
  constructOptions,
  constructTourExtras,
  constructGTIVpExtras,
  getExtrasFromSelectedPickupTime,
  constructOptionPrices,
  getTourDiscountPrice,
  getPickupLocationId,
  constructFormErrors,
  getFormErrorText,
  getSelectedPickupTimeMaxTravelers,
  shouldShowDepartureNote,
  getBookingWidgetInitialState,
  getSelectedPickupTime,
  getSelectedPickupTimeDepartureTime,
  isValidMobileFormError,
  updateTravelerExperiences,
  getDropoffType,
  calculateOptimalAmountOfPrivateOptions,
  getSelectedPrivateOptions,
  getDefaultGroupExperiencesAnswers,
  updateSelectedExperiencePrices,
  normalizeLivePricingData,
  normalizeLivePricingCachedData,
} from "../tourBookingWidgetUtils";
import {
  mockDates1,
  mockAdminDates1,
  mockQueryDate,
  mockBookingWidgetTourData0,
  mockQueryTimes0,
  mockTimes0,
  mockTimes1,
  mockSelectedExperiences,
  mockDate1,
  mockPickupPrices,
  mockTravellers12PrivateOption,
  mockTravellers8PrivateOption,
  mockTravellers6PrivateOption,
  mockTravellers4PrivateOption,
  mockVpSelectedExperiences,
  mockVpTimes0,
  mockQueryTime0,
  mockVpSelectedExperiences1,
  mockVpExperiences1,
  mockVpDefaultExperienceAnswers1,
  mockVpExperiences,
  mockVpExtra1WithUpdatedPrices,
  mockVpExperiences1WitSelectedPrices,
  mockVpExtraWithUpdatedPrices,
} from "../mockBookingWidgetData";
import BookingWidgetView, { OrderBookingWidgetView } from "../../types/enums";
import {
  mockLivePricingCachedData,
  mockLivePriceDefaultOptionsData,
  mockLivePriceNonDefaultOptionsData,
  mockExperiencesWithDiscount,
  mockExtrasWithDiscount,
  mockSelectedExperiencesWithDiscount,
  mockLivePriceDefaultOptionsData1,
  mockLivePriceNonDefaultOptionsData1,
  mockLivePriceMergedLivePriceData,
  livePricingOptionsDataset,
} from "../mockData/tourBookingWidgetMockData";

import { BookingWidgetState } from "components/features/TourBookingWidget/BookingWidgetState";
import { mockQueryTour0 } from "components/features/Tour/utils/mockTourData";
import { TransportPickup, BookingWidgetFormError } from "types/enums";

describe("constructPluralTest", () => {
  const singleText = "adult";
  const pluralText = "adults";
  test("should return empty string when number of adults is 0", () => {
    expect(constructPluralText(0, singleText, pluralText)).toEqual("");
  });
  test("should return single text when number of adults is 1", () => {
    expect(constructPluralText(1, singleText, pluralText)).toEqual(`1 ${singleText}`);
  });
  test("should return plural text when number of adults is higher then 1", () => {
    expect(constructPluralText(5, singleText, pluralText)).toEqual(`5 ${pluralText}`);
  });
});

describe("constructDates", () => {
  test("should return correctly constructed dates", () => {
    expect(constructDates(mockQueryDate)).toEqual(mockDates1);
  });
  test("should return correctly constructed dates where min is undefined because the user is admin", () => {
    expect(constructDates(mockQueryDate, true)).toEqual(mockAdminDates1);
  });
});

describe("constructBookingWidgetTourData", () => {
  test("should return correctly constructed bookingWidgetTourData for regular tour", () => {
    expect(
      constructBookingWidgetTourData({
        tour: mockQueryTour0,
        isLivePricing: false,
      })
    ).toEqual(mockBookingWidgetTourData0);
  });
  test("should return correctly constructed bookingWidgetTourData for vacation package", () => {
    expect(
      constructBookingWidgetTourData({
        tour: mockQueryTour0,
        isLivePricing: true,
        livePriceBasePrice: 1234,
      })
    ).toEqual({
      ...mockBookingWidgetTourData0,
      basePrice: 1234,
    });
  });
});

describe("constructFlexibleAvailableTime", () => {
  const mockAvailableTimes = [
    {
      time: "00:00",
      minNumberOfTravelers: 0,
      maxNumberOfTravelers: 100,
      available: true,
      departureTime: "00:00",
      isPickupAvailable: true,
      prices: [],
      pickupPrices: {
        pickupPricedPerPerson: true,
        prices: {
          adults: 0,
          teenagers: 0,
          children: 0,
        },
      },
    },
    {
      time: "00:30",
      minNumberOfTravelers: 0,
      maxNumberOfTravelers: 100,
      available: true,
      departureTime: "00:30",
      isPickupAvailable: true,
      prices: [],
      pickupPrices: {
        pickupPricedPerPerson: true,
        prices: {
          adults: 0,
          teenagers: 0,
          children: 0,
        },
      },
    },
  ];
  test("should return correctly constructed flexible time", () => {
    expect(constructFlexibleAvailableTime(mockQueryTimes0, "Flexible", mockAvailableTimes)).toEqual(
      {
        isFlexible: true,
        maybeFlexibleOption: [
          {
            available: true,
            departureTime: "Flexible",
            isPickupAvailable: true,
            maxNumberOfTravelers: 100,
            minNumberOfTravelers: 0,
            pickupPrices: {
              pickupPricedPerPerson: true,
              prices: {
                adults: 0,
                children: 0,
                teenagers: 0,
              },
            },
            prices: [],
            time: "Flexible",
          },
        ],
      }
    );
  });
  test("should return empty array if there is no flexible options", () => {
    expect(
      constructFlexibleAvailableTime(
        mockQueryTimes0.map(queryTime => ({ ...queryTime, isFlexible: false })),
        "Flexible",
        mockAvailableTimes
      )
    ).toEqual({
      isFlexible: false,
      maybeFlexibleOption: [],
    });
  });
});

describe("constructTourTimesAvailability", () => {
  test("should return empty array of no available times", () => {
    expect(constructTourTimesAvailability([], "Flexible").times).toEqual([]);
  });
  test("should return correctly constructed array of available times", () => {
    expect(constructTourTimesAvailability(mockQueryTimes0, "Flexible").times).toEqual(mockTimes0);
  });
  test("correctly assigns isFlexible", () => {
    expect(
      constructTourTimesAvailability([{ ...mockQueryTime0, isFlexible: 0 }], "Flexible").isFlexible
    ).toBeFalsy();

    expect(
      constructTourTimesAvailability([{ ...mockQueryTime0, isFlexible: 1 }], "Flexible").isFlexible
    ).toBeTruthy();
  });
});

describe("constructVpTimesAvailability", () => {
  test("should return empty array of no available times", () => {
    expect(constructGTIVpTimesAvailability([], "Flexible").times).toEqual([]);
  });
  test("should return correctly constructed array of available times", () => {
    expect(constructGTIVpTimesAvailability(mockQueryTimes0, "Flexible").times).toEqual(
      mockVpTimes0
    );
  });
});

describe("getPickupPrices", () => {
  const pickupPrices = {
    pickupPricedPerPerson: true,
    prices: {
      adults: 0,
      teenagers: 0,
      children: 0,
    },
  };

  test("Should return the correct pickupPrices for selected pickup time", () => {
    expect(getPickupPrices(mockTimes0, "11:00")).toEqual(mockPickupPrices);
  });
  test("Should return pickupPrices with no price for travelers, since the pickup list was empty", () => {
    expect(getPickupPrices([], "11:00")).toEqual(pickupPrices);
  });
  test("Should return pickupPrices with no price for travelers, since selected pickup time was not in available times list", () => {
    expect(getPickupPrices(mockTimes0, "20:00")).toEqual(pickupPrices);
  });
});

describe("calculatePickupPrice", () => {
  const numberOfTravelers0 = {
    adults: 4,
    children: 0,
    teenagers: 1,
  };
  const numberOfTravelers1 = {
    adults: 7,
    children: 3,
    teenagers: 1,
  };
  const numberOfTravelers2 = {
    adults: 0,
    children: 0,
    teenagers: 0,
  };
  test("Should return the correct total pickup price when there is a price per traveler", () => {
    expect(calculatePickupPrice(numberOfTravelers0, mockTimes0, "11:00")).toEqual(900);
  });
  test("Should return the correct total pickupPrice when there is one price for all travelers", () => {
    expect(calculatePickupPrice(numberOfTravelers1, mockTimes0, "10:00")).toEqual(200);
  });
  test("Should return 0 because there are no passengers", () => {
    expect(calculatePickupPrice(numberOfTravelers2, mockTimes0, "11:00")).toEqual(0);
  });
});

describe("calculateTotalPrice", () => {
  const numberOfTravelers0 = {
    adults: 4,
    children: 0,
    teenagers: 1,
  };
  const numberOfTravelers1 = {
    adults: 7,
    children: 3,
    teenagers: 1,
  };
  const numberOfTravelers2 = {
    adults: 0,
    children: 0,
    teenagers: 0,
  };
  test("Should return the correct total amount", () => {
    expect(
      calculateTourTotalPrice({
        numberOfTravelers: numberOfTravelers0,
        availableTimes: mockTimes0,
        selectedExperiences: [],
        hasPickup: true,
        selectedPickupTime: "11:00",
        isFullPriceDiscount: false,
        discount: none,
        isPrivate: false,
        selectedPrivateOptions: [],
      })
    ).toEqual([95900, 95900]);
  });
  test("Should return the correct total amount with respect to the number of each travelerType", () => {
    expect(
      calculateTourTotalPrice({
        numberOfTravelers: numberOfTravelers1,
        availableTimes: mockTimes0,
        selectedExperiences: [],
        hasPickup: false,
        selectedPickupTime: "Flexible",
        isFullPriceDiscount: false,
        discount: none,
        isPrivate: false,
        selectedPrivateOptions: [],
      })
    ).toEqual([149000, 149000]);
  });
  test("Should return the correct total amount with respect to the number of each travelerType and selected experiences", () => {
    expect(
      calculateTourTotalPrice({
        numberOfTravelers: numberOfTravelers1,
        availableTimes: mockTimes0,
        selectedExperiences: mockSelectedExperiences,
        hasPickup: false,
        selectedPickupTime: "Flexible",
        isFullPriceDiscount: false,
        discount: none,
        isPrivate: false,
        selectedPrivateOptions: [],
      })
    ).toEqual([159050, 159050]);
  });
  test("Should return 0 total price because no travelers or experience are selected", () => {
    expect(
      calculateTourTotalPrice({
        numberOfTravelers: numberOfTravelers2,
        availableTimes: mockTimes0,
        selectedExperiences: [],
        hasPickup: false,
        selectedPickupTime: "Flexible",
        isFullPriceDiscount: false,
        discount: none,
        isPrivate: false,
        selectedPrivateOptions: [],
      })
    ).toEqual([0, 0]);
  });
  test("Should return the correct total amount applying discount to the base price", () => {
    expect(
      calculateTourTotalPrice({
        numberOfTravelers: numberOfTravelers1,
        availableTimes: mockTimes0,
        selectedExperiences: mockSelectedExperiences,
        hasPickup: false,
        selectedPickupTime: "Flexible",
        isFullPriceDiscount: false,
        discount: some(10),
        isPrivate: false,
        selectedPrivateOptions: [],
      })
    ).toEqual([144150, 159050]);
  });
  test("Should return the correct total amount applying discount to the full price", () => {
    expect(
      calculateTourTotalPrice({
        numberOfTravelers: numberOfTravelers1,
        availableTimes: mockTimes0,
        selectedExperiences: mockSelectedExperiences,
        hasPickup: false,
        selectedPickupTime: "Flexible",
        isFullPriceDiscount: true,
        discount: some(10),
        isPrivate: false,
        selectedPrivateOptions: [],
      })
    ).toEqual([143145, 159050]);
  });
});

describe("getDefaultGroupExperiencesAnswer", () => {
  test("Should return included experience answers", () => {
    expect(getDefaultGroupExperiencesAnswers([mockVpExperiences1])).toEqual(
      mockVpDefaultExperienceAnswers1
    );
  });
  test("Should return included experience answers", () => {
    expect(getDefaultGroupExperiencesAnswers(undefined)).toEqual([]);
  });
});

describe("calculateGTIVpTotalPrice", () => {
  test("Should return correct total price for vacation package if we have only cached price", () => {
    expect(
      calculateGTIVpTotalPrice({
        basePrice: 1000,
        selectedExperiences: [],
      })
    ).toEqual({ price: 1000, discountValue: 0 });
  });

  const vpBasePrice = 93460.5;
  const vpBasePrice1 = 52680;

  test("Should return correct total price for vacation package for default state (none of options is selected by user)", () => {
    expect(
      calculateGTIVpTotalPrice({
        basePrice: vpBasePrice,
        selectedExperiences: mockVpSelectedExperiences,
        experiences: [],
      })
    ).toEqual({ price: vpBasePrice, discountValue: 0 });

    expect(
      calculateGTIVpTotalPrice({
        basePrice: vpBasePrice1,
        selectedExperiences: mockVpSelectedExperiences1,
        experiences: [mockVpExperiences1],
      })
    ).toEqual({ price: vpBasePrice1, discountValue: 0 });
  });

  test("Should return correct total price for vacation package with discount for default state (none of options is selected by user)", () => {
    const vpBasePriceWithDiscount = 68999.53213329765;
    const discountValue = 7666.614681477513;

    expect(
      calculateGTIVpTotalPrice({
        selectedExperiences: [
          {
            experienceId: "82802",
            answerId: "c629a1b3439efec443",
            prices: [41666.36338329764],
            vpPrice: {
              selectedOptionDiff: 0,
              discountValue: 0,
            },
            calculatePricePerPerson: false,
          },
          {
            experienceId: "82803",
            answerId: "4e4bc9bb992630d7a8",
            prices: [16164.16875],
            vpPrice: {
              selectedOptionDiff: 0,
              discountValue: 0,
            },
            calculatePricePerPerson: false,
          },
          {
            experienceId: "82804",
            answerId: "5d2f1c7b47910a9c3f",
            prices: [11169.9],
            vpPrice: {
              selectedOptionDiff: 0,
              discountValue: 0,
            },
            calculatePricePerPerson: false,
          },
        ],
        basePrice: vpBasePriceWithDiscount,
        baseDiscountValue: discountValue,
        experiences: [
          [
            {
              id: "82802",
              name: "Inside the Volcano departure time",
              price: 46295.95931477516,
              questions: [],
              calculatePricePerPerson: false,
              required: true,
              answers: [
                {
                  id: "c629a1b3439efec443",
                  name: "Morning departure",
                  prices: [41666.36338329764],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 4629.595931477517,
                  },
                  included: false,
                  isDefault: true,
                },
                {
                  id: "1d00a454b98d0c9225",
                  name: "Afternoon departure",
                  prices: [41666.36338329764],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 50000,
                  },
                  included: false,
                  isDefault: false,
                },
              ],
            },
            {
              id: "82803",
              name: "Snorkeling departure",
              price: 17960.1875,
              questions: [],
              calculatePricePerPerson: false,
              required: true,
              answers: [
                {
                  id: "d05505bd0074df2501",
                  name: "Morning departure",
                  prices: [16164.16875],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 60000,
                  },
                  included: false,
                  isDefault: true,
                },
                {
                  id: "4e4bc9bb992630d7a8",
                  name: "Afternoon departure",
                  prices: [16164.16875],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 1796.0187499999993,
                  },
                  included: false,
                  isDefault: false,
                },
              ],
            },
            {
              id: "82804",
              name: "Glacier hike departure",
              price: 12411,
              questions: [],
              calculatePricePerPerson: false,
              required: true,
              answers: [
                {
                  id: "06a6ae154f491b4da2",
                  name: "Morning departure no hiking boots rental",
                  prices: [11169.9],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 1241.1000000000004,
                  },
                  included: true,
                  isDefault: true,
                },
                {
                  id: "5d2f1c7b47910a9c3f",
                  name: "Morning departure with hiking boots rental",
                  prices: [11169.9],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 70000,
                  },
                  included: false,
                  isDefault: false,
                },
                {
                  id: "4bfa5c8b5b0e78378c",
                  name: "Afternoon departure no hiking boots rental",
                  prices: [11169.9],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 1241.1000000000004,
                  },
                  included: false,
                  isDefault: false,
                },
                {
                  id: "81ff7782b9df06d248",
                  name: "Afternoon departure with hiking boots rental",
                  prices: [11169.9],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 1241.1000000000004,
                  },
                  included: false,
                  isDefault: false,
                },
              ],
            },
          ],
          [],
          [],
          [],
        ],
      })
    ).toEqual({
      price: vpBasePriceWithDiscount,
      discountValue,
    });
  });

  test("Should return correct total price for vacation package with discount with selected options by user", () => {
    const vpBasePriceWithDiscount = 68999.53213329765;
    const discountValue = 7666;

    expect(
      calculateGTIVpTotalPrice({
        selectedExperiences: [
          {
            experienceId: "82802",
            answerId: "1d00a454b98d0c9225",
            prices: [41666.36338329764],
            vpPrice: {
              selectedOptionDiff: 0,
              discountValue: 50000,
            },
            calculatePricePerPerson: false,
          },
          {
            experienceId: "82803",
            answerId: "4e4bc9bb992630d7a8",
            prices: [16164.16875],
            vpPrice: {
              selectedOptionDiff: 0,
              discountValue: 60000,
            },
            calculatePricePerPerson: false,
          },
          {
            experienceId: "82804",
            answerId: "5d2f1c7b47910a9c3f",
            prices: [11169.9],
            vpPrice: {
              selectedOptionDiff: 0,
              discountValue: 70000,
            },
            calculatePricePerPerson: false,
          },
        ],
        basePrice: vpBasePriceWithDiscount,
        baseDiscountValue: discountValue,
        experiences: [
          [
            {
              id: "82802",
              name: "Inside the Volcano departure time",
              price: 46295.95931477516,
              questions: [],
              calculatePricePerPerson: false,
              required: true,
              answers: [
                {
                  id: "c629a1b3439efec443",
                  name: "Morning departure",
                  prices: [41666.36338329764],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 10000,
                  },
                  included: false,
                  isDefault: true,
                },
                {
                  id: "1d00a454b98d0c9225",
                  name: "Afternoon departure",
                  prices: [41666.36338329764],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 50000,
                  },
                  included: false,
                  isDefault: false,
                },
              ],
            },
            {
              id: "82803",
              name: "Snorkeling departure",
              price: 17960.1875,
              questions: [],
              calculatePricePerPerson: false,
              required: true,
              answers: [
                {
                  id: "d05505bd0074df2501",
                  name: "Morning departure",
                  prices: [16164.16875],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 10000,
                  },
                  included: false,
                  isDefault: true,
                },
                {
                  id: "4e4bc9bb992630d7a8",
                  name: "Afternoon departure",
                  prices: [16164.16875],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 60000,
                  },
                  included: false,
                  isDefault: false,
                },
              ],
            },
            {
              id: "82804",
              name: "Glacier hike departure",
              price: 12411,
              questions: [],
              calculatePricePerPerson: false,
              required: true,
              answers: [
                {
                  id: "06a6ae154f491b4da2",
                  name: "Morning departure no hiking boots rental",
                  prices: [11169.9],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 10000,
                  },
                  included: true,
                  isDefault: true,
                },
                {
                  id: "5d2f1c7b47910a9c3f",
                  name: "Morning departure with hiking boots rental",
                  prices: [11169.9],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 70000,
                  },
                  included: false,
                  isDefault: false,
                },
                {
                  id: "4bfa5c8b5b0e78378c",
                  name: "Afternoon departure no hiking boots rental",
                  prices: [11169.9],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 1241.1000000000004,
                  },
                  included: false,
                  isDefault: false,
                },
                {
                  id: "81ff7782b9df06d248",
                  name: "Afternoon departure with hiking boots rental",
                  prices: [11169.9],
                  vpPrice: {
                    selectedOptionDiff: 0,
                    discountValue: 1241.1000000000004,
                  },
                  included: false,
                  isDefault: false,
                },
              ],
            },
          ],
          [],
          [],
          [],
        ],
      })
    ).toEqual({
      price: vpBasePriceWithDiscount,
      discountValue: 157666,
    });
  });

  test("Should return correct total price for vacation package with selected group experiences", () => {
    const selectedExperience: TourBookingWidgetTypes.SelectedGroupExperience = {
      experienceId: "83383",
      answerId: "22b5bbff15dcf5f81c",
      prices: [11281.5],
      vpPrice: {
        selectedOptionDiff: 11281.5,
      },
      calculatePricePerPerson: false,
    };
    const defaultExperience =
      mockVpSelectedExperiences[0] as TourBookingWidgetTypes.SelectedGroupExperience;
    expect(
      calculateGTIVpTotalPrice({
        basePrice: vpBasePrice,
        selectedExperiences: [
          selectedExperience,
          mockVpSelectedExperiences[1],
          mockVpSelectedExperiences[2],
          mockVpSelectedExperiences[3],
        ],
        experiences: [mockVpExperiences],
      })
    ).toEqual({
      price: vpBasePrice - defaultExperience.prices[0] + selectedExperience.prices[0],
      discountValue: 0,
    });

    const selectedExperience1: TourBookingWidgetTypes.SelectedGroupExperience = {
      experienceId: "76871",
      answerId: "567a666fd27587b4ae",
      prices: [29880],
      vpPrice: {
        selectedOptionDiff: 4800,
      },
      calculatePricePerPerson: false,
    };
    const defaultExperience1 =
      mockVpSelectedExperiences1[1] as TourBookingWidgetTypes.SelectedGroupExperience;

    expect(
      calculateGTIVpTotalPrice({
        basePrice: vpBasePrice1,
        selectedExperiences: [
          mockVpSelectedExperiences1[0],
          selectedExperience1,
          mockVpSelectedExperiences1[2],
        ],
        experiences: [mockVpExperiences1],
      })
    ).toEqual({
      price: vpBasePrice1 - defaultExperience1.prices[0] + selectedExperience1.prices[0],
      discountValue: 0,
    });

    const selectedExperience2: TourBookingWidgetTypes.SelectedGroupExperience = {
      experienceId: "76869",
      answerId: "49b7bdb78cfb8a1007",
      prices: [13788],
      vpPrice: {
        selectedOptionDiff: 3000,
      },
      calculatePricePerPerson: false,
    };
    const defaultExperience2 =
      mockVpSelectedExperiences1[2] as TourBookingWidgetTypes.SelectedGroupExperience;

    expect(
      calculateGTIVpTotalPrice({
        basePrice: vpBasePrice1,
        selectedExperiences: [
          mockVpSelectedExperiences1[0],
          selectedExperience1,
          selectedExperience2,
        ],
        experiences: [mockVpExperiences1],
      })
    ).toEqual({
      price:
        vpBasePrice1 -
        defaultExperience1.prices[0] +
        selectedExperience1.prices[0] -
        defaultExperience2.prices[0] +
        selectedExperience2.prices[0],
      discountValue: 0,
    });

    const selectedExperience3: TourBookingWidgetTypes.SelectedGroupExperience = {
      experienceId: "83384",
      answerId: "01119b7f4ddfdc6fa8",
      prices: [13788],
      vpPrice: {
        selectedOptionDiff: 13788,
      },
      calculatePricePerPerson: false,
    };
    expect(
      calculateGTIVpTotalPrice({
        basePrice: vpBasePrice,
        selectedExperiences: [
          mockVpSelectedExperiences[0],
          selectedExperience3,
          mockVpSelectedExperiences[2],
          mockVpSelectedExperiences[3],
        ],
        experiences: [mockVpExperiences],
      })
    ).toEqual({
      price: vpBasePrice + selectedExperience3.prices[0],
      discountValue: 0,
    });
  });

  test("Should return correct total price for vacation package with selected travel experiences", () => {
    const selectedExperience: TourBookingWidgetTypes.SelectedTravelerExperience = {
      experienceId: "87313",
      count: 1,
      price: 6900,
      calculatePricePerPerson: false,
    };
    expect(
      calculateGTIVpTotalPrice({
        basePrice: vpBasePrice,
        selectedExperiences: [
          mockVpSelectedExperiences[0],
          mockVpSelectedExperiences[1],
          selectedExperience,
          mockVpSelectedExperiences[3],
        ],
        experiences: [mockVpExperiences],
      })
    ).toEqual({
      price: vpBasePrice + selectedExperience.price,
      discountValue: 0,
    });
  });

  test("Should return correct total price for vacation package with selected travel experiences with discount", () => {
    const mockVpBasePrice = 108352.65373048004;
    const mockVpDiscountPrice = 12039.183747831106;
    const mockTravelerExperiencesWithDiscount = [
      [],
      [
        {
          id: "83285",
          name: "Hiking boots for South Coast tour",
          price: 1552.5,
          discountValue: 172.5,
          questions: [
            {
              id: 83285,
              name: "Size in EU",
              question: "Size in EU",
              externalId: null,
              answers: [],
              required: false,
              selector: false,
            },
          ],
          calculatePricePerPerson: true,
          required: false,
          answers: [],
        },
        {
          id: "87307",
          name: "Single room supplement (mandatory for solo travelers) ",
          price: 15525,
          discountValue: 1725,
          questions: [],
          calculatePricePerPerson: true,
          required: false,
          answers: [],
        },
        {
          id: "87308",
          name: "Luggage storage on the 3-day south coast tour",
          price: 1552.5,
          discountValue: 172.5,
          questions: [],
          calculatePricePerPerson: true,
          required: false,
          answers: [],
        },
      ],
      [],
      [],
    ];
    const mockTravelerSelectedExperiencesWithDiscount = [
      {
        experienceId: "83285",
        count: 0,
        price: 1552.5,
        discountValue: 172.5,
        calculatePricePerPerson: false,
      },
      {
        experienceId: "87307",
        count: 0,
        price: 15525,
        discountValue: 1725,
        calculatePricePerPerson: false,
      },
      {
        experienceId: "87308",
        count: 0,
        price: 1552.5,
        discountValue: 172.5,
        calculatePricePerPerson: false,
      },
    ];

    expect(
      calculateGTIVpTotalPrice({
        selectedExperiences: mockTravelerSelectedExperiencesWithDiscount,
        basePrice: mockVpBasePrice,
        baseDiscountValue: mockVpDiscountPrice,
        experiences: mockTravelerExperiencesWithDiscount,
      })
    ).toEqual({
      price: mockVpBasePrice,
      discountValue: mockVpDiscountPrice,
    });

    expect(
      calculateGTIVpTotalPrice({
        selectedExperiences: [
          mockTravelerSelectedExperiencesWithDiscount[0],
          {
            ...mockTravelerSelectedExperiencesWithDiscount[1],
            count: 1,
          },
          mockTravelerSelectedExperiencesWithDiscount[2],
        ],
        basePrice: mockVpBasePrice,
        baseDiscountValue: mockVpDiscountPrice,
        experiences: mockTravelerExperiencesWithDiscount,
      })
    ).toEqual({
      price: mockVpBasePrice + mockTravelerSelectedExperiencesWithDiscount[1].price,
      discountValue:
        mockVpDiscountPrice + mockTravelerSelectedExperiencesWithDiscount[1].discountValue,
    });
  });
});

describe("filterOutUnavailableTimes", () => {
  test("should return a filtered array with removed times with availability less than 10", () => {
    expect(filterOutUnavailableTimes(mockTimes0)).toEqual(mockTimes1);
  });
});

describe("getSelectedExperienceTotalPrice", () => {
  const numberOfTravelers = 5;
  const price = 100;
  test("Should return correct price by calculate price per person", () => {
    const calculatePricePerPerson = true;
    expect(
      getSelectedExperienceTotalPrice(price, numberOfTravelers, calculatePricePerPerson)
    ).toEqual(numberOfTravelers * 100);
  });
  test("Should return correct prices by not calculate price per person", () => {
    const calculatePricePerPerson = false;
    expect(
      getSelectedExperienceTotalPrice(price, numberOfTravelers, calculatePricePerPerson)
    ).toEqual(price);
  });
});

describe("getExperiencePrices", () => {
  test("Should return calculated price of selected experience and take into account which should be calculated by person", () => {
    const numberOfTravelers = {
      adults: 4,
      children: 0,
      teenagers: 1,
    };
    expect(getExperiencePrices(mockSelectedExperiences, numberOfTravelers)).toEqual(
      5 * 350 + 150 + 5 * 550
    );
  });
  test("calculates price for SelectedTravelerExperience using the number of travelers in the object", () => {
    const selectedTravelerExperience = {
      experienceId: "123",
      count: 2,
      price: 100,
      calculatePricePerPerson: true,
    };
    const numberOfTravelers = {
      adults: 1,
      children: 1,
      teenagers: 1,
    };
    expect(getExperiencePrices([selectedTravelerExperience], numberOfTravelers)).toEqual(200);
  });
  test("should return 0 as the price because the number of purchased travelers experiences is 0", () => {
    const selectedTravelerExperience = {
      experienceId: "123",
      count: 0,
      price: 100,
      calculatePricePerPerson: true,
    };
    const numberOfTravelers = {
      adults: 1,
      children: 1,
      teenagers: 1,
    };
    expect(getExperiencePrices([selectedTravelerExperience], numberOfTravelers)).toEqual(0);
  });
});

describe("constructTravelerPrices", () => {
  test("Should return correct prices for number of travelers", () => {
    const input = {
      availableTimes: mockTimes0,
      numberOfTravelers: { adults: 4, teenagers: 1, children: 2 },
      hasPickup: true,
      selectedPickupTime: mockTimes0[0].time,
      isLivePricing: false,
    };
    const result = {
      adults: 17000,
      teenagers: 13000,
      children: 8000,
    };
    expect(constructTravelerPrices(input)).toEqual(result);
  });
  test("Should return correct prices for number of travelers in case when pickup is not selected", () => {
    const input = {
      availableTimes: mockTimes0,
      numberOfTravelers: { adults: 4, teenagers: 1, children: 2 },
      hasPickup: false,
      selectedPickupTime: mockTimes0[1].departureTime,
      isLivePricing: false,
    };
    const result = {
      adults: 17000,
      teenagers: 13000,
      children: 8000,
    };
    expect(constructTravelerPrices(input)).toEqual(result);
  });
  test("Should return correct prices for there is no pickup time that matches selected time", () => {
    const input = {
      availableTimes: mockTimes0,
      numberOfTravelers: { adults: 4, teenagers: 1, children: 2 },
      hasPickup: true,
      selectedPickupTime: "",
      isLivePricing: false,
    };
    const result = {
      adults: 0,
      teenagers: 0,
      children: 0,
    };
    expect(constructTravelerPrices(input)).toEqual(result);
  });
  test("Should return empty prices for vacation package", () => {
    const input = {
      availableTimes: mockTimes0,
      numberOfTravelers: { adults: 4, teenagers: 1, children: 2 },
      hasPickup: true,
      selectedPickupTime: mockTimes0[0].time,
      isLivePricing: true,
    };
    const result = {
      adults: 0,
      teenagers: 0,
      children: 0,
    };
    expect(constructTravelerPrices(input)).toEqual(result);
  });
});

describe("constructFormData", () => {
  test("Should return correctly constructed form data when all information is filled out", () => {
    const tourId = 150;
    const selectedDates = { from: mockDate1 };
    const selectedPickupTime = "03:00";
    const numberOfTravelers = { adults: 4, teenagers: 1, children: 1 };
    const isFlexible = true;
    const pickupType = "package_pickup";
    const pickupPlace = "Big Momma´s House";
    const pickupPlaceId = 0;
    const pickupName = "pickup";
    const hasPickup = false;
    const isPrivate = false;
    const selectedPrivateOptions: TourBookingWidgetTypes.PrivateOption[] = [];
    const result = {
      date: "2019-05-06",
      time: "03:00",
      departureFlex: "1",
      adults: "4",
      childrenAges: [],
      teenagers: "1",
      children: "1",
      tourPickup: "0",
      tourId: "150",
      pickupType,
      pickupPlace,
      pickupPlaceId,
      pickupName,
    };
    expect(
      constructFormData({
        tourId,
        selectedDates,
        numberOfTravelers,
        childrenAges: [],
        isFlexible,
        selectedPickupTime,
        pickupType,
        pickupPlace,
        pickupPlaceId,
        hasPickup,
        isPrivate,
        selectedPrivateOptions,
      })
    ).toEqual(result);
  });
  test("Should return date as empty string if from date is undefined", () => {
    const tourId = 150;

    const selectedDates = {};
    const selectedPickupTime = "03:00";
    const numberOfTravelers = { adults: 4, teenagers: 1, children: 1 };
    const isFlexible = true;
    const pickupType = "package_pickup";
    const pickupPlace = "Big Momma´s House";
    const pickupPlaceId = 0;
    const pickupName = "pickup";
    const hasPickup = true;
    const isPrivate = false;
    const selectedPrivateOptions: TourBookingWidgetTypes.PrivateOption[] = [];
    const result = {
      date: "",
      time: "03:00",
      departureFlex: "1",
      adults: "4",
      childrenAges: [],
      teenagers: "1",
      children: "1",
      tourPickup: "1",
      tourId: "150",
      pickupType,
      pickupPlace,
      pickupPlaceId,
      pickupName,
    };
    expect(
      constructFormData({
        tourId,
        selectedDates,
        numberOfTravelers,
        childrenAges: [],
        isFlexible,
        selectedPickupTime,
        pickupType,
        pickupPlace,
        pickupPlaceId,
        hasPickup,
        isPrivate,
        selectedPrivateOptions,
      })
    ).toEqual(result);
  });
  test("Should return time as empty string if it is undefined", () => {
    const tourId = 150;
    const selectedDates = {};
    const selectedPickupTime = undefined;
    const numberOfTravelers = { adults: 4, teenagers: 1, children: 1 };
    const isFlexible = true;
    const pickupType = "package_pickup";
    const pickupPlace = "Big Momma´s House";
    const pickupPlaceId = 0;
    const pickupName = "pickup";
    const hasPickup = false;
    const isPrivate = false;
    const selectedPrivateOptions: TourBookingWidgetTypes.PrivateOption[] = [];
    const result = {
      date: "",
      time: "",
      departureFlex: "1",
      adults: "4",
      childrenAges: [],
      teenagers: "1",
      children: "1",
      tourPickup: "0",
      tourId: "150",
      pickupType,
      pickupPlace,
      pickupPlaceId,
      pickupName,
    };
    expect(
      constructFormData({
        tourId,
        selectedDates,
        numberOfTravelers,
        childrenAges: [],
        isFlexible,
        selectedPickupTime,
        pickupType,
        pickupPlace,
        pickupPlaceId,
        hasPickup,
        isPrivate,
        selectedPrivateOptions,
      })
    ).toEqual(result);
  });
  test("Should return time as empty string if it is Flexible", () => {
    const tourId = 150;
    const selectedDates = {};
    const selectedPickupTime = "Flexible";
    const numberOfTravelers = { adults: 4, teenagers: 1, children: 1 };
    const isFlexible = true;
    const pickupType = "package_pickup";
    const pickupPlace = "Big Momma´s House";
    const pickupPlaceId = 0;
    const pickupName = "pickup";
    const hasPickup = true;
    const isPrivate = false;
    const selectedPrivateOptions: TourBookingWidgetTypes.PrivateOption[] = [];
    const result = {
      date: "",
      time: "",
      departureFlex: "1",
      adults: "4",
      childrenAges: [],
      teenagers: "1",
      children: "1",
      tourPickup: "1",
      tourId: "150",
      pickupType,
      pickupPlace,
      pickupPlaceId,
      pickupName,
    };
    expect(
      constructFormData({
        tourId,
        selectedDates,
        numberOfTravelers,
        childrenAges: [],
        isFlexible,
        selectedPickupTime,
        pickupType,
        pickupPlace,
        pickupPlaceId,
        hasPickup,
        isPrivate,
        selectedPrivateOptions,
      })
    ).toEqual(result);
  });
  test("Should return departure flex as 0 if not isFlexible", () => {
    const tourId = 150;
    const selectedDates = {};
    const selectedPickupTime = "03:00";
    const numberOfTravelers = { adults: 4, teenagers: 1, children: 1 };
    const isFlexible = false;
    const pickupType = "package_pickup";
    const pickupPlace = "Big Momma´s House";
    const pickupPlaceId = 0;
    const pickupName = "pickup";
    const hasPickup = false;
    const isPrivate = false;
    const selectedPrivateOptions: TourBookingWidgetTypes.PrivateOption[] = [];
    const result = {
      date: "",
      time: "03:00",
      departureFlex: "0",
      adults: "4",
      childrenAges: [],
      teenagers: "1",
      children: "1",
      tourPickup: "0",
      tourId: "150",
      pickupType,
      pickupPlace,
      pickupPlaceId,
      pickupName,
    };
    expect(
      constructFormData({
        selectedDates,
        numberOfTravelers,
        childrenAges: [],
        isFlexible,
        selectedPickupTime,
        pickupType,
        tourId,
        pickupPlace,
        pickupPlaceId,
        hasPickup,
        isPrivate,
        selectedPrivateOptions,
      })
    ).toEqual(result);
  });
  test("Should return tour pickup as 0 if its not available", () => {
    const tourId = 150;
    const selectedDates = {};
    const selectedPickupTime = "03:00";
    const numberOfTravelers = { adults: 4, teenagers: 1, children: 1 };
    const isFlexible = false;
    const pickupType = "not_available";
    const pickupPlace = "Big Momma´s House";
    const pickupPlaceId = 0;
    const pickupName = "pickup";
    const hasPickup = true;
    const isPrivate = false;
    const selectedPrivateOptions: TourBookingWidgetTypes.PrivateOption[] = [];
    const result = {
      date: "",
      time: "03:00",
      departureFlex: "0",
      adults: "4",
      childrenAges: [],
      teenagers: "1",
      children: "1",
      tourPickup: "0",
      tourId: "150",
      pickupType,
      pickupPlace,
      pickupPlaceId,
      pickupName,
    };
    expect(
      constructFormData({
        selectedDates,
        numberOfTravelers,
        childrenAges: [],
        isFlexible,
        selectedPickupTime,
        pickupType,
        tourId,
        pickupPlace,
        pickupPlaceId,
        hasPickup,
        isPrivate,
        selectedPrivateOptions,
      })
    ).toEqual(result);
  });
  test("Should return privateOptions if isPrivate true and options provided", () => {
    const tourId = 150;
    const selectedDates = {};
    const selectedPickupTime = "03:00";
    const numberOfTravelers = { adults: 4, teenagers: 1, children: 1 };
    const isFlexible = false;
    const pickupType = "not_available";
    const pickupPlace = "Big Momma´s House";
    const pickupPlaceId = 0;
    const pickupName = "pickup";
    const hasPickup = true;
    const isPrivate = true;
    const selectedPrivateOptions = [mockTravellers12PrivateOption, mockTravellers4PrivateOption];
    const result = {
      date: "",
      time: "03:00",
      departureFlex: "0",
      adults: "4",
      childrenAges: [],
      teenagers: "1",
      children: "1",
      tourPickup: "0",
      tourId: "150",
      pickupType,
      pickupPlace,
      pickupPlaceId,
      pickupName,
      privateOptionsIds: ["12", "4"],
    };
    expect(
      constructFormData({
        selectedDates,
        numberOfTravelers,
        childrenAges: [],
        isFlexible,
        selectedPickupTime,
        pickupType,
        tourId,
        pickupPlace,
        pickupPlaceId,
        hasPickup,
        isPrivate,
        selectedPrivateOptions,
      })
    ).toMatchObject(result);
  });
  test("Should return childrenAges for vacation package", () => {
    const tourId = 150;
    const selectedDates = {};
    const selectedPickupTime = "03:00";
    const numberOfTravelers = { adults: 4, teenagers: 1, children: 1 };
    const isFlexible = false;
    const pickupType = "not_available";
    const pickupPlace = "Big Momma´s House";
    const pickupPlaceId = 0;
    const pickupName = "pickup";
    const hasPickup = true;
    const isPrivate = true;
    const selectedPrivateOptions = [mockTravellers12PrivateOption, mockTravellers4PrivateOption];
    const result = {
      date: "",
      time: "03:00",
      departureFlex: "0",
      adults: "4",
      childrenAges: [1, 15],
      teenagers: "1",
      children: "1",
      tourPickup: "0",
      tourId: "150",
      pickupType,
      pickupPlace,
      pickupPlaceId,
      pickupName,
      privateOptionsIds: ["12", "4"],
    };
    expect(
      constructFormData({
        selectedDates,
        numberOfTravelers,
        childrenAges: [1, 15],
        isFlexible,
        selectedPickupTime,
        pickupType,
        tourId,
        pickupPlace,
        pickupPlaceId,
        hasPickup,
        isPrivate,
        selectedPrivateOptions,
      })
    ).toMatchObject(result);
  });
});

describe("constructOptions", () => {
  test("should construct correct options", () => {
    const queryOptions: TourBookingWidgetTypes.QueryOption[] = [
      {
        id: "1",
        prices: [
          {
            price: "",
            disabled: 0,
          },
        ],
        included: 0,
      },
      {
        id: "2",
        prices: [
          {
            price: 0,
            disabled: 1,
          },
        ],
        included: 1,
      },
      {
        id: "3",
        prices: [
          {
            price: 150,
            disabled: 0,
          },
        ],
        included: 1,
      },
    ];
    const options: TourBookingWidgetTypes.Option[] = [
      {
        id: "1",
        prices: [{ price: 0, disabled: false }],
        disabled: false,
        included: false,
      },
      {
        id: "2",
        prices: [{ price: 0, disabled: true }],
        disabled: true,
        included: true,
      },
      {
        id: "3",
        prices: [{ price: 150, disabled: false }],
        disabled: false,
        included: true,
      },
    ];
    expect(constructOptions(queryOptions)).toEqual(options);
  });
});

describe("constructExtras", () => {
  test("should construct correct extras for regular tour", () => {
    const queryExtras: TourBookingWidgetTypes.QueryExtra[] = [
      {
        id: 1,
        disabled: 0,
        options: [],
        price: "0",
      },
      {
        id: 2,
        disabled: 1,
        options: [],
        price: "100",
      },
      {
        id: 3,
        disabled: 0,
        options: [
          {
            id: "150",
            included: 1,
            prices: [
              {
                price: 0,
                disabled: 1,
              },
              {
                price: 150,
                disabled: 1,
              },
            ],
          },
        ],
        price: "100",
      },
    ];
    const extras: TourBookingWidgetTypes.Extra[] = [
      {
        id: "1",
        disabled: false,
        options: [],
        price: 0,
      },
      {
        id: "2",
        disabled: true,
        options: [],
        price: 100,
      },
      {
        id: "3",
        disabled: true,
        options: [
          {
            disabled: true,
            id: "150",
            included: true,
            prices: [
              {
                disabled: true,
                price: 0,
              },
              {
                disabled: true,
                price: 150,
              },
            ],
          },
        ],
        price: 100,
      },
    ];
    expect(constructTourExtras(queryExtras)).toEqual(extras);
  });
});

describe("constructVpExtras", () => {
  test("should construct correct extras for vacation package tour", () => {
    const queryExtras: TourBookingWidgetTypes.QueryVpOptions[] = [
      {
        id: 76870,
        name: "Accommodation",
        price: {
          value: 62400,
          currency: "ISK",
          discount: 0,
        },
        isRequired: true,
        perPerson: false,
        items: [
          {
            id: "3d2e97301413d81220",
            isDefault: true,
            isIncluded: true,
            name: "Comfort (private bath)",
            price: {
              value: 62400,
              currency: "ISK",
              discount: 0,
            },
          },
          {
            id: "4aae67818440f37671",
            isDefault: false,
            isIncluded: false,
            name: "Quality (handpicked hotels)",
            price: {
              value: 66720,
              currency: "ISK",
              discount: 0,
            },
          },
        ],
      },
      {
        id: 76871,
        name: "Car",
        price: {
          value: 17880,
          currency: "ISK",
          discount: 0,
        },
        isRequired: true,
        perPerson: false,
        items: [
          {
            id: "23371e50ec8e854382",
            isDefault: true,
            isIncluded: true,
            name: "Super Budget 2WD Manual",
            price: {
              value: 17880,
              currency: "ISK",
              discount: 0,
            },
          },
          {
            id: "836182a58f3ab6a7ca",
            isDefault: false,
            isIncluded: false,
            name: "Super Budget 2WD Automatic",
            price: {
              value: 23040,
              currency: "ISK",
              discount: 0,
            },
          },
        ],
      },
      {
        id: 76869,
        name: "Blue Lagoon (minimum age 2)",
        price: {
          value: 0,
          currency: "ISK",
          discount: 0,
        },
        isRequired: true,
        perPerson: false,
        items: [
          {
            id: "0f086bbf325508800b",
            isDefault: true,
            isIncluded: true,
            name: "Skip the Blue Lagoon",
            price: {
              value: 0,
              currency: "ISK",
              discount: 0,
            },
          },
          {
            id: "0b44f43b6bcf3001f8",
            isDefault: false,
            isIncluded: false,
            name: "Comfort Entrance",
            price: {
              value: 10788,
              currency: "ISK",
              discount: 0,
            },
          },
        ],
      },
    ];
    const extras: TourBookingWidgetTypes.Extra[] = [
      {
        id: "76870",
        disabled: false,
        discountValue: 0,
        price: 62400,
        options: [
          {
            id: "3d2e97301413d81220",
            disabled: false,
            included: true,
            prices: [{ price: 62400, disabled: false, discountValue: 0 }],
          },
          {
            id: "4aae67818440f37671",
            disabled: false,
            included: false,
            prices: [{ price: 66720, disabled: false, discountValue: 0 }],
          },
        ],
      },
      {
        id: "76871",
        disabled: false,
        discountValue: 0,
        price: 17880,
        options: [
          {
            id: "23371e50ec8e854382",
            disabled: false,
            included: true,
            prices: [{ price: 17880, disabled: false, discountValue: 0 }],
          },
          {
            id: "836182a58f3ab6a7ca",
            disabled: false,
            included: false,
            prices: [{ price: 23040, disabled: false, discountValue: 0 }],
          },
        ],
      },
      {
        id: "76869",
        disabled: false,
        discountValue: 0,
        price: 0,
        options: [
          {
            id: "0f086bbf325508800b",
            disabled: false,
            included: true,
            prices: [{ price: 0, disabled: false, discountValue: 0 }],
          },
          {
            id: "0b44f43b6bcf3001f8",
            disabled: false,
            included: false,
            prices: [{ price: 10788, disabled: false, discountValue: 0 }],
          },
        ],
      },
    ];
    expect(constructGTIVpExtras(queryExtras)).toEqual(extras);
  });
  test("should construct correct extras for vacation package tour when price is cached", () => {
    const queryExtras: TourBookingWidgetTypes.QueryVpOptions[] = [
      {
        id: 76870,
        name: "Accommodation",
        price: undefined,
        isRequired: true,
        perPerson: false,
        items: [
          {
            id: "3d2e97301413d81220",
            isDefault: true,
            isIncluded: true,
            name: "Comfort (private bath)",
            price: undefined,
          },
          {
            id: "4aae67818440f37671",
            isDefault: false,
            isIncluded: false,
            name: "Quality (handpicked hotels)",
            price: undefined,
          },
        ],
      },
      {
        id: 76871,
        name: "Car",
        price: undefined,
        isRequired: true,
        perPerson: false,
        items: [
          {
            id: "23371e50ec8e854382",
            isDefault: true,
            isIncluded: true,
            name: "Super Budget 2WD Manual",
            price: undefined,
          },
          {
            id: "836182a58f3ab6a7ca",
            isDefault: false,
            isIncluded: false,
            name: "Super Budget 2WD Automatic",
            price: undefined,
          },
        ],
      },
      {
        id: 76869,
        name: "Blue Lagoon (minimum age 2)",
        price: undefined,
        isRequired: true,
        perPerson: false,
        items: [
          {
            id: "0f086bbf325508800b",
            isDefault: true,
            isIncluded: true,
            name: "Skip the Blue Lagoon",
            price: undefined,
          },
          {
            id: "0b44f43b6bcf3001f8",
            isDefault: false,
            isIncluded: false,
            name: "Comfort Entrance",
            price: undefined,
          },
        ],
      },
    ];
    const extras: TourBookingWidgetTypes.Extra[] = [
      {
        id: "76870",
        disabled: false,
        price: 0,
        options: [
          {
            id: "3d2e97301413d81220",
            disabled: false,
            included: true,
            prices: [{ price: 0, disabled: false }],
          },
          {
            id: "4aae67818440f37671",
            disabled: false,
            included: false,
            prices: [{ price: 0, disabled: false }],
          },
        ],
      },
      {
        id: "76871",
        disabled: false,
        price: 0,
        options: [
          {
            id: "23371e50ec8e854382",
            disabled: false,
            included: true,
            prices: [{ price: 0, disabled: false }],
          },
          {
            id: "836182a58f3ab6a7ca",
            disabled: false,
            included: false,
            prices: [{ price: 0, disabled: false }],
          },
        ],
      },
      {
        id: "76869",
        disabled: false,
        price: 0,
        options: [
          {
            id: "0f086bbf325508800b",
            disabled: false,
            included: true,
            prices: [{ price: 0, disabled: false }],
          },
          {
            id: "0b44f43b6bcf3001f8",
            disabled: false,
            included: false,
            prices: [{ price: 0, disabled: false }],
          },
        ],
      },
    ];

    expect(constructGTIVpExtras(queryExtras)).toEqual(extras);
  });
});

describe("constructOptionPrices", () => {
  test("should construct correct option prices", () => {
    const queryOptionPrices: TourBookingWidgetTypes.QueryOptionPrice[] = [
      {
        price: "",
        disabled: 0,
      },
      {
        price: 150,
        disabled: 1,
      },
    ];
    const optionPrices: TourBookingWidgetTypes.OptionPrice[] = [
      {
        price: 0,
        disabled: false,
      },
      {
        price: 150,
        disabled: true,
      },
    ];
    expect(constructOptionPrices(queryOptionPrices)).toEqual(optionPrices);
  });
});

describe("getExtrasFromSelectedPickupTime", () => {
  test("should return extras based on pickup time", () => {
    const selectedPickupTime = "08:00";
    const departureTime = "08:30";
    const pickupPrices = mockPickupPrices;
    const extras: TourBookingWidgetTypes.Extra[] = [
      {
        id: "1",
        disabled: false,
        options: [],
        price: 0,
      },
      {
        id: "2",
        disabled: true,
        options: [],
        price: 0,
      },
    ];
    const availableTimes: TourBookingWidgetTypes.Time[] = [
      {
        extras,
        prices: [],
        time: selectedPickupTime,
        available: true,
        departureTime,
        minNumberOfTravelers: 0,
        maxNumberOfTravelers: 4,
        pickupPrices,
        isPickupAvailable: true,
      },
      {
        extras: [],
        prices: [],
        time: "09:00",
        available: true,
        minNumberOfTravelers: 0,
        departureTime: "09:30",
        maxNumberOfTravelers: 4,
        pickupPrices,
        isPickupAvailable: true,
      },
    ];
    expect(getExtrasFromSelectedPickupTime(availableTimes, true, selectedPickupTime)).toEqual(
      extras
    );
  });
  test("should return empty array if selcted time does not match any available time", () => {
    const selectedPickupTime = "08:00";

    const availableTimes: TourBookingWidgetTypes.Time[] = [];
    expect(getExtrasFromSelectedPickupTime(availableTimes, true, selectedPickupTime)).toEqual([]);
  });
});

describe("getDiscountPrice", () => {
  test("should return correct discount price", () => {
    expect(getTourDiscountPrice(100, some(10))).toEqual(90);
  });
  test("should return the original price if the discount is undefined", () => {
    expect(getTourDiscountPrice(100, none)).toEqual(100);
  });
});

describe("getPickupLocationId", () => {
  test("should return the correct id of the pickupLocation", () => {
    const transport: PickupTransport = {
      pickup: "pickup_list",
      enableNotKnown: true,
      required: true,
      price: 0,
      pickupType: "pickup_list",
      places: [
        {
          id: 1,
          name: "Bus stop 1",
        },
        {
          id: 2,
          name: "Not known yet",
        },
        {
          id: 3,
          name: "Bus stop 3",
        },
      ],
    };
    expect(getPickupLocationId(transport, "Bus stop 3")).toEqual(3);
  });
  test("should return 0 because there is no location with this name", () => {
    const transport: PickupTransport = {
      pickup: "pickup_list",
      enableNotKnown: true,
      required: true,
      price: 0,
      pickupType: "pickup_list",
      places: [
        {
          id: 1,
          name: "Bus stop 2",
        },
        {
          id: 2,
          name: "Bus stop 1",
        },
        {
          id: 3,
          name: "Bus stop 3",
        },
      ],
    };
    expect(getPickupLocationId(transport, "Bus stop 4")).toEqual(0);
  });
});

describe("getSelectedPickupTimeMaxTravelers", () => {
  test("should return 0 since available times is empty and no pickuptime has been selected", () => {
    expect(getSelectedPickupTimeMaxTravelers([], true, undefined)).toEqual(0);
  });
  test("should return 0 since selectedPickupTime is not in availableTimes list", () => {
    const availableTimes: TourBookingWidgetTypes.Time[] = [
      {
        extras: [],
        prices: [],
        time: "07:30",
        available: true,
        departureTime: "08:00",
        maxNumberOfTravelers: 1,
        minNumberOfTravelers: 0,
        pickupPrices: mockPickupPrices,
        isPickupAvailable: true,
      },
    ];
    const selectedPickupTime = "";
    expect(getSelectedPickupTimeMaxTravelers(availableTimes, true, selectedPickupTime)).toEqual(0);
  });
  test("should return correct max travelers of selected pickup time", () => {
    const availableTimes: TourBookingWidgetTypes.Time[] = [
      {
        extras: [],
        prices: [],
        time: "07:30",
        available: true,
        departureTime: "08:00",
        minNumberOfTravelers: 0,
        maxNumberOfTravelers: 1,
        pickupPrices: mockPickupPrices,
        isPickupAvailable: true,
      },
    ];
    const selectedPickupTime = "07:30";
    expect(getSelectedPickupTimeMaxTravelers(availableTimes, true, selectedPickupTime)).toEqual(1);
  });
});

describe("constructFormErrors", () => {
  test("should return correct form errors as true", () => {
    const selectedDates = {
      from: undefined,
      to: undefined,
    };
    const transportRequired = true;
    const selectedTransportLocationName = "";
    const availableTimes: TourBookingWidgetTypes.Time[] = [
      {
        extras: [],
        prices: [],
        time: "07:30",
        available: true,
        departureTime: "08:00",
        minNumberOfTravelers: 0,
        maxNumberOfTravelers: 1,
        pickupPrices: mockPickupPrices,
        isPickupAvailable: true,
      },
    ];
    const selectedPickupTime = "";
    const numberOfTravelers: SharedTypes.NumberOfTravelers = {
      adults: 2,
      teenagers: 0,
      children: 0,
    };
    expect(
      constructFormErrors(
        selectedDates,
        transportRequired,
        TransportPickup.List,
        selectedTransportLocationName,
        availableTimes,
        numberOfTravelers,
        true,
        selectedPickupTime
      )
    ).toEqual([
      BookingWidgetFormError.EMPTY_DATES,
      BookingWidgetFormError.EMPTY_PICKUP,
      BookingWidgetFormError.NO_PICKUP_TIME,
    ]);
  });
  test("should return correct form errors as false if the information is filled in", () => {
    const selectedDates = {
      from: new Date(),
      to: new Date(),
    };
    const transportRequired = true;
    const selectedTransportLocationName = "Location";
    const availableTimes: TourBookingWidgetTypes.Time[] = [];
    const selectedPickupTime = "";
    const numberOfTravelers: SharedTypes.NumberOfTravelers = {
      adults: 0,
      teenagers: 0,
      children: 0,
    };
    expect(
      constructFormErrors(
        selectedDates,
        transportRequired,
        TransportPickup.List,
        selectedTransportLocationName,
        availableTimes,
        numberOfTravelers,
        true,
        selectedPickupTime
      )
    ).toEqual([]);
  });
  test("should return correct form errors as false if location is not required", () => {
    const selectedDates = {
      from: new Date(),
      to: new Date(),
    };
    const transportRequired = false;
    const selectedTransportLocationName = "";
    const availableTimes: TourBookingWidgetTypes.Time[] = [];
    const selectedPickupTime = "";
    const numberOfTravelers: SharedTypes.NumberOfTravelers = {
      adults: 0,
      teenagers: 0,
      children: 0,
    };
    expect(
      constructFormErrors(
        selectedDates,
        transportRequired,
        TransportPickup.List,
        selectedTransportLocationName,
        availableTimes,
        numberOfTravelers,
        true,
        selectedPickupTime
      )
    ).toEqual([]);
  });
  test("should return correct form errors as false if location is required and not filled out but transport pickup is not list or address", () => {
    const selectedDates = {
      from: new Date(),
      to: new Date(),
    };
    const transportRequired = true;
    const selectedTransportLocationName = "";
    const availableTimes: TourBookingWidgetTypes.Time[] = [];
    const selectedPickupTime = "";
    const numberOfTravelers: SharedTypes.NumberOfTravelers = {
      adults: 0,
      teenagers: 0,
      children: 0,
    };
    expect(
      constructFormErrors(
        selectedDates,
        transportRequired,
        TransportPickup.NotAvailable,
        selectedTransportLocationName,
        availableTimes,
        numberOfTravelers,
        true,
        selectedPickupTime
      )
    ).toEqual([]);
  });
});

describe("getFormErrorText", () => {
  const fakeTranslate = (value: string) => value;
  test("should return correct date error text", () => {
    expect(
      getFormErrorText([BookingWidgetFormError.EMPTY_DATES], fakeTranslate as TFunction, 0)
    ).toEqual("Please choose a date");
  });
  test("should return correct date error text if both are true", () => {
    expect(
      getFormErrorText(
        [BookingWidgetFormError.EMPTY_DATES, BookingWidgetFormError.EMPTY_PICKUP],
        fakeTranslate as TFunction,
        0
      )
    ).toEqual("Please choose a date");
  });
  test("should return empty dates text", () => {
    expect(
      getFormErrorText(
        [BookingWidgetFormError.EMPTY_DATES, BookingWidgetFormError.NO_PICKUP_TIME],
        fakeTranslate as TFunction,
        0
      )
    ).toEqual("Please choose a date");
  });
  test("should return correct pickup location error text", () => {
    expect(
      getFormErrorText([BookingWidgetFormError.EMPTY_PICKUP], fakeTranslate as TFunction, 0)
    ).toEqual("Choose pickup location");
  });
  test("should return no available pickup error", () => {
    expect(
      getFormErrorText([BookingWidgetFormError.NO_PICKUP_TIME], fakeTranslate as TFunction, 0)
    ).toEqual("Selected pick up time is fully booked");
  });
});

describe("shouldShowDepartureNote", () => {
  const pickupType1 = TransportPickup.Address;
  const pickupType2 = TransportPickup.List;
  const pickupType3 = "package_pickup";
  const departureNote = "Reykjavík";
  test("should return false since pickupType is address", () => {
    expect(shouldShowDepartureNote(pickupType1, true, departureNote)).toEqual(false);
  });
  test("should return false since pickupType is list", () => {
    expect(shouldShowDepartureNote(pickupType2, true, departureNote)).toEqual(false);
  });
  test("should return true since pickupType is list but there is no pickup", () => {
    expect(shouldShowDepartureNote(pickupType2, false, departureNote)).toEqual(true);
  });
  test("should return true since pickupType is not address or list, and departureNote is not undefined and there is pickup", () => {
    expect(shouldShowDepartureNote(pickupType3, true, departureNote)).toEqual(true);
  });
  test("should return true since pickupType is not address or list, and departureNote is not undefined and there is no pickup", () => {
    expect(shouldShowDepartureNote(pickupType3, false, departureNote)).toEqual(true);
  });
  test("should return false since departureNote is undefined", () => {
    expect(shouldShowDepartureNote(pickupType1, true)).toEqual(false);
  });
  test("should return false since departureNote is undefined", () => {
    expect(shouldShowDepartureNote(pickupType2, false)).toEqual(false);
  });
  test("should return false since departureNote is undefined", () => {
    expect(shouldShowDepartureNote(pickupType3, true)).toEqual(false);
  });
  test("should return false since departureNote is empty string", () => {
    expect(shouldShowDepartureNote(pickupType3, true, "")).toEqual(false);
  });
});

describe("getBookingWidgetInitialState", () => {
  const mockDate = "2022-09-15T10:55:00.000Z";

  beforeEach(() => {
    advanceTo(mockDate);
  });
  afterEach(() => {
    clear();
  });

  const basePrice = 20;

  const initialState1: BookingWidgetState = {
    selectedDates: { from: undefined, to: undefined },
    datesInitialized: false,
    bookingWidgetView: BookingWidgetView.Default,
    orderBookingWidgetView: OrderBookingWidgetView.TravelInformation,
    numberOfTravelers: { adults: 2, teenagers: 0, children: 0 },
    childrenAges: [],
    selectedPickupTime: undefined,
    selectedTransportLocation: {
      id: 0,
      name: "",
    },
    price: basePrice,
    fullPrice: basePrice,
    basePrice,
    availableTimes: { isFlexible: false, times: [] },
    selectedExperiences: [],
    isPriceLoading: true,
    formErrors: [],
    hasPickup: true,
    discount: none,
    isFullPriceDiscount: false,
    isTransportRequired: false,
    transportPickup: TransportPickup.Address,
    orderPrice: 0,
    contactInformation: {
      name: "",
      email: "",
      phone: "",
      country: "",
    },
    pickupInformation: {
      pickupType: "",
      pickupTime: "",
      pickupAddress: "",
      placeId: 0,
      pickupFlightNumber: "",
      dropoffTime: "",
      dropoffPlaceId: 0,
      dropoffAddress: "",
      dropoffType: "",
      dropoffFlightNumber: "",
      specialRequest: "",
    },
    options: [],
    optionsInitialized: false,
    extras: [],
    isPrivate: false,
    isLivePricing: false,
    isLivePricingBasePriceLoaded: false,
    availablePrivateOptions: [],
    selectedPrivateOptions: [],
    experiences: [[], [], [], []],
  };

  test("should return correct tour initial state for edit order", () => {
    expect(
      getBookingWidgetInitialState({
        basePrice,
        transportPickup: TransportPickup.Address,
        isTransportRequired: false,
        adults: 2,
        teenagers: 0,
        children: 0,
        childrenAges: [],
        dateFrom: undefined,
        lengthOfTour: 1,
        isLivePricing: false,
      })
    ).toEqual(initialState1);
  });
});

describe("getSelectedPickupTime", () => {
  const numberOfTravelers: SharedTypes.NumberOfTravelers = {
    adults: 1,
    teenagers: 0,
    children: 0,
  };
  const numberOfTravelers2: SharedTypes.NumberOfTravelers = {
    adults: 2,
    teenagers: 0,
    children: 0,
  };

  const hugeNumberOfTravelers: SharedTypes.NumberOfTravelers = {
    adults: 7,
    teenagers: 0,
    children: 0,
  };

  const time1 = {
    extras: [],
    prices: [],
    time: "07:30",
    available: true,
    departureTime: "08:00",
    minNumberOfTravelers: 0,
    maxNumberOfTravelers: 1,
    isPickupAvailable: true,
    pickupPrices: mockPickupPrices,
  };
  const time2 = {
    extras: [],
    prices: [],
    time: "08:30",
    available: true,
    departureTime: "09:00",
    minNumberOfTravelers: 0,
    maxNumberOfTravelers: 2,
    pickupPrices: mockPickupPrices,
    isPickupAvailable: true,
  };
  const availableTimes: TourBookingWidgetTypes.Time[] = [time1];
  const availableTimes2: TourBookingWidgetTypes.Time[] = [time1, time2];

  test("should return availableTimes time because there is no cartItem", () => {
    expect(getSelectedPickupTime(availableTimes, numberOfTravelers)).toEqual("07:30");
  });
  test("should return the second available time because there are not enough spots left on the first time", () => {
    expect(getSelectedPickupTime(availableTimes2, numberOfTravelers2)).toEqual("08:30");
  });
  test("should return undefined because availableTimes is empty and there is no cartItem", () => {
    expect(getSelectedPickupTime([], numberOfTravelers)).toEqual(undefined);
  });

  test("should return first element of availableTimes because number of travelers is more than spots available but there are available times", () => {
    expect(getSelectedPickupTime(availableTimes2, hugeNumberOfTravelers)).toEqual("07:30");
  });

  test("should return undefined because availableTimes is empty", () => {
    expect(getSelectedPickupTime([], numberOfTravelers2)).toEqual(undefined);
  });
});

describe("getSelectedPickupTimeDepartureTime", () => {
  test("should return an empty string since available times is empty and no pickuptime has been selected", () => {
    expect(getSelectedPickupTimeDepartureTime([], undefined)).toEqual("");
  });
  test("should return an empty list since selectedPickupTime is not in availableTimes list", () => {
    const availableTimes: TourBookingWidgetTypes.Time[] = [
      {
        extras: [],
        prices: [],
        time: "07:30",
        available: true,
        departureTime: "08:00",
        minNumberOfTravelers: 0,
        maxNumberOfTravelers: 1,
        pickupPrices: mockPickupPrices,
        isPickupAvailable: true,
      },
    ];
    const selectedPickupTime = "";
    expect(getSelectedPickupTimeDepartureTime(availableTimes, selectedPickupTime)).toEqual("");
  });
  test("should return correct departure time of selected pickup time", () => {
    const availableTimes: TourBookingWidgetTypes.Time[] = [
      {
        extras: [],
        prices: [],
        time: "07:30",
        available: true,
        departureTime: "08:00",
        minNumberOfTravelers: 0,
        maxNumberOfTravelers: 1,
        pickupPrices: mockPickupPrices,
        isPickupAvailable: true,
      },
    ];
    const selectedPickupTime = "07:30";
    expect(getSelectedPickupTimeDepartureTime(availableTimes, selectedPickupTime)).toEqual("08:00");
  });
});

describe("isValidMobileFormError", () => {
  describe("when DATES step is active", () => {
    test("should return false when no errors", () => {
      expect(isValidMobileFormError([], BookingWidgetView.Default)).toEqual(false);
    });

    test("should return false for non-matching errors", () => {
      expect(
        isValidMobileFormError(
          [
            BookingWidgetFormError.EMPTY_PICKUP,
            BookingWidgetFormError.NO_PICKUP_TIME,
            BookingWidgetFormError.MIN_TRAVELERS,
            BookingWidgetFormError.EMPTY_ANSWER,
          ],
          BookingWidgetView.Dates
        )
      ).toEqual(false);
    });

    test("should return true for EMPTY_DATES error", () => {
      expect(
        isValidMobileFormError([BookingWidgetFormError.EMPTY_DATES], BookingWidgetView.Dates)
      ).toEqual(true);
    });
  });
  describe("when DEFAULT step is active", () => {
    test("should return false since there are no errors", () => {
      expect(isValidMobileFormError([], BookingWidgetView.Default)).toEqual(false);
    });
    test("should return false for dates errors", () => {
      expect(
        isValidMobileFormError([BookingWidgetFormError.EMPTY_DATES], BookingWidgetView.Default)
      ).toEqual(false);
    });

    test("should return true for EMPTY_ANSWER errors", () => {
      expect(
        isValidMobileFormError([BookingWidgetFormError.EMPTY_ANSWER], BookingWidgetView.Default)
      ).toEqual(true);
    });

    test("should return true for EMPTY_PICKUP errors", () => {
      expect(
        isValidMobileFormError([BookingWidgetFormError.EMPTY_PICKUP], BookingWidgetView.Default)
      ).toEqual(true);
    });

    test("should return true for MIN_TRAVELERS errors", () => {
      expect(
        isValidMobileFormError([BookingWidgetFormError.MIN_TRAVELERS], BookingWidgetView.Default)
      ).toEqual(true);
    });

    test("should return true for NO_PICKUP_TIME errors", () => {
      expect(
        isValidMobileFormError([BookingWidgetFormError.NO_PICKUP_TIME], BookingWidgetView.Default)
      ).toEqual(true);
    });
  });
});

describe("updateTravelerExperiences", () => {
  const numberOfTravelers = {
    adults: 3,
    teenagers: 2,
    children: 0,
  };
  const selectedExperiences: TourBookingWidgetTypes.SelectedExperiences = [
    {
      experienceId: "124",
      answerId: "1",
      prices: [1337],
      vpPrice: {
        selectedOptionDiff: 0,
      },
      calculatePricePerPerson: true,
    },
    {
      experienceId: "124",
      count: 2,
      price: 1337,
      calculatePricePerPerson: true,
    },
    {
      experienceId: "124",
      answerId: "1",
      prices: [1337],
      vpPrice: {
        selectedOptionDiff: 0,
      },
      calculatePricePerPerson: true,
    },
    {
      experienceId: "124",
      count: 6,
      price: 1337,
      calculatePricePerPerson: true,
    },
  ];
  const updatedSelectedExperiences: TourBookingWidgetTypes.SelectedExperiences = [
    {
      experienceId: "124",
      answerId: "1",
      prices: [1337],
      vpPrice: {
        selectedOptionDiff: 0,
      },
      calculatePricePerPerson: true,
    },
    {
      experienceId: "124",
      count: 2,
      price: 1337,
      calculatePricePerPerson: true,
    },
    {
      experienceId: "124",
      answerId: "1",
      prices: [1337],
      vpPrice: {
        selectedOptionDiff: 0,
      },
      calculatePricePerPerson: true,
    },
    {
      experienceId: "124",
      count: 5,
      price: 1337,
      calculatePricePerPerson: true,
    },
  ];
  test("should return an empty string since available times is empty and no pickup time has been selected", () => {
    expect(updateTravelerExperiences(numberOfTravelers, selectedExperiences)).toEqual(
      updatedSelectedExperiences
    );
  });
});

describe("getDropoffType", () => {
  test("Should return empty string as dropoffType", () => {
    expect(getDropoffType(undefined)).toEqual("");
  });
  test("Should return correct dropoffType if not airport", () => {
    expect(getDropoffType(0)).toEqual("package_address");
  });
  test("Should return correct dropoffType if airport", () => {
    expect(getDropoffType(1)).toEqual("package_airport");
  });
});

describe("private options utils", () => {
  const privateOptions0 = [
    mockTravellers8PrivateOption,
    mockTravellers6PrivateOption,
    mockTravellers4PrivateOption,
  ];

  const testCases0 = [
    {
      numberOfTravelers: 12,
      numberOfOptionsPerId: { 8: 0, 6: 2, 4: 0 },
      selectedOptions: [mockTravellers6PrivateOption, mockTravellers6PrivateOption],
    },
    {
      numberOfTravelers: 16,
      numberOfOptionsPerId: { 8: 2, 6: 0, 4: 0 },
    },
    {
      numberOfTravelers: 20,
      numberOfOptionsPerId: { 8: 1, 6: 2, 4: 0 },
      selectedOptions: [
        mockTravellers8PrivateOption,
        mockTravellers6PrivateOption,
        mockTravellers6PrivateOption,
      ],
    },
    {
      numberOfTravelers: 9,
      numberOfOptionsPerId: { 8: 1, 6: 0, 4: 1 },
    },
    {
      numberOfTravelers: 8,
      numberOfOptionsPerId: { 8: 1, 6: 0, 4: 0 },
    },
    {
      numberOfTravelers: 7,
      numberOfOptionsPerId: { 8: 1, 6: 0, 4: 0 },
    },
    {
      numberOfTravelers: 5,
      numberOfOptionsPerId: { 8: 0, 6: 1, 4: 0 },
    },
    {
      numberOfTravelers: 4,
      numberOfOptionsPerId: { 8: 0, 6: 0, 4: 1 },
      selectedOptions: [mockTravellers4PrivateOption],
    },
    {
      numberOfTravelers: 2,
      numberOfOptionsPerId: { 8: 0, 6: 0, 4: 1 },
    },
    {
      numberOfTravelers: 1,
      numberOfOptionsPerId: { 8: 0, 6: 0, 4: 1 },
      selectedOptions: [mockTravellers4PrivateOption],
    },
  ];

  testCases0.forEach(testCase => {
    test(`should return optimal number of options (${JSON.stringify(
      testCase.numberOfOptionsPerId
    )}) for ${testCase.numberOfTravelers} travelers`, () => {
      expect(
        calculateOptimalAmountOfPrivateOptions(privateOptions0, testCase.numberOfTravelers)
      ).toMatchObject(testCase.numberOfOptionsPerId);
    });
    if (testCase.selectedOptions) {
      test(`should return optimal options for ${testCase.numberOfTravelers} travelers`, () => {
        expect(
          getSelectedPrivateOptions(privateOptions0, {
            adults: testCase.numberOfTravelers,
          } as SharedTypes.NumberOfTravelers)
        ).toMatchObject(testCase.selectedOptions);
      });
    }
  });

  const privateOptions1 = [
    mockTravellers12PrivateOption,
    mockTravellers8PrivateOption,
    mockTravellers4PrivateOption,
  ];

  const testCases1 = [
    {
      numberOfTravelers: 17,
      numberOfOptionsPerId: { 12: 1, 8: 1, 4: 0 },
      selectedOptions: [mockTravellers12PrivateOption, mockTravellers8PrivateOption],
    },
  ];

  testCases1.forEach(testCase => {
    test(`should return optimal number of options (${JSON.stringify(
      testCase.numberOfOptionsPerId
    )}) for ${testCase.numberOfTravelers} travelers`, () => {
      expect(
        calculateOptimalAmountOfPrivateOptions(privateOptions1, testCase.numberOfTravelers)
      ).toMatchObject(testCase.numberOfOptionsPerId);
    });

    if (testCase.selectedOptions) {
      test(`should return optimal options for ${testCase.numberOfTravelers} travelers`, () => {
        expect(
          getSelectedPrivateOptions(privateOptions1, {
            adults: testCase.numberOfTravelers,
          } as SharedTypes.NumberOfTravelers)
        ).toMatchObject(testCase.selectedOptions);
      });
    }
  });
});

describe("updateSelectedExperiencePrices", () => {
  test("Should return selected experiences with updated prices for default experience (dropdown)", () => {
    expect(
      updateSelectedExperiencePrices(
        [mockVpExperiences1],
        mockVpSelectedExperiences1,
        mockVpExtra1WithUpdatedPrices
      )
    ).toEqual([
      {
        ...mockVpSelectedExperiences1[0],
        prices: [mockVpExtra1WithUpdatedPrices[0].options[0].prices[0].price],
        vpPrice: {
          selectedOptionDiff: 0,
        },
      },
      mockVpSelectedExperiences1[1],
      mockVpSelectedExperiences1[2],
    ]);
  });

  test("Should return selected experiences with updated prices for manually selected experience (dropdown)", () => {
    const selectedExperiences = {
      experienceId: "76870",
      answerId: "4aae67818440f37671",
      prices: [30960],
      vpPrice: {
        selectedOptionDiff: 3360,
      },
      calculatePricePerPerson: false,
    };

    expect(
      updateSelectedExperiencePrices(
        [mockVpExperiences1WitSelectedPrices],
        [selectedExperiences, mockVpSelectedExperiences1[1], mockVpSelectedExperiences1[2]],
        mockVpExtra1WithUpdatedPrices
      )
    ).toEqual([
      {
        ...selectedExperiences,
        prices: [mockVpExtra1WithUpdatedPrices[0].options[1].prices[0].price],
        vpPrice: {
          selectedOptionDiff: 0,
        },
      },
      mockVpSelectedExperiences1[1],
      mockVpSelectedExperiences1[2],
    ]);
  });

  test("Should return selected experiences with updated prices for manually selected experience (dropdown) which is not included by default ", () => {
    const selectedExperiences2 = {
      experienceId: "76869",
      answerId: "49b7bdb78cfb8a1007",
      prices: [41346],
      vpPrice: {
        selectedOptionDiff: 15000,
      },
      calculatePricePerPerson: false,
    };
    expect(
      updateSelectedExperiencePrices(
        [mockVpExperiences1WitSelectedPrices],
        [mockVpSelectedExperiences1[0], mockVpSelectedExperiences1[1], selectedExperiences2],
        mockVpExtra1WithUpdatedPrices
      )
    ).toEqual([
      {
        ...mockVpSelectedExperiences1[0],
        prices: [mockVpExtra1WithUpdatedPrices[0].options[0].prices[0].price],
      },
      {
        ...mockVpSelectedExperiences1[1],
        prices: [mockVpExtra1WithUpdatedPrices[1].options[0].prices[0].price],
      },
      {
        ...selectedExperiences2,
        prices: [mockVpExtra1WithUpdatedPrices[2].options[2].prices[0].price],
        vpPrice: {
          selectedOptionDiff: 0,
        },
      },
    ]);
  });

  test("Should return selected experiences with updated prices for manually selected experience (dropdown) with discount", () => {
    expect(
      updateSelectedExperiencePrices(
        mockExperiencesWithDiscount,
        mockSelectedExperiencesWithDiscount,
        mockExtrasWithDiscount
      )
    ).toEqual([
      {
        ...mockSelectedExperiencesWithDiscount[0],
        prices: [mockExtrasWithDiscount[0].options[0].prices[0].price],
        vpPrice: {
          selectedOptionDiff: 0,
          discountValue: mockExtrasWithDiscount[0].options[1].prices[0].discountValue,
        },
      },
      {
        ...mockSelectedExperiencesWithDiscount[1],
        vpPrice: {
          selectedOptionDiff: 0,
          discountValue: mockExtrasWithDiscount[1].options[0].prices[0].discountValue,
        },
      },
      {
        ...mockSelectedExperiencesWithDiscount[2],
        vpPrice: {
          selectedOptionDiff: 0,
          discountValue: mockExtrasWithDiscount[2].options[0].prices[0].discountValue,
        },
      },
    ]);
  });

  test("Should return selected experiences with updated prices for experience toggle", () => {
    expect(
      updateSelectedExperiencePrices(
        [],
        [
          mockVpSelectedExperiences[0],
          mockVpSelectedExperiences[1],
          {
            ...mockVpSelectedExperiences[2],
            count: 1,
          },
          mockVpSelectedExperiences[3],
        ],
        mockVpExtraWithUpdatedPrices
      )
    ).toEqual([
      mockVpSelectedExperiences[0],
      mockVpSelectedExperiences[1],
      {
        ...mockVpSelectedExperiences[2],
        count: 1,
        price: mockVpExtraWithUpdatedPrices[2].price,
      },
      {
        ...mockVpSelectedExperiences[3],
        price: mockVpExtraWithUpdatedPrices[3].price,
      },
    ]);
  });

  test("Should return the same price for experiences if there is no such experience in extras", () => {
    expect(updateSelectedExperiencePrices([], mockVpSelectedExperiences, [])).toEqual(
      mockVpSelectedExperiences
    );
  });
});

describe("normalizeLivePricingCachedData", () => {
  test("Should return undefined if there is no data", () => {
    expect(normalizeLivePricingCachedData(undefined, undefined)).toEqual(undefined);
  });
  test("Should return cached pricing data if there is no DEFAULT live pricing data", () => {
    expect(normalizeLivePricingCachedData(mockLivePricingCachedData, undefined)).toEqual(
      mockLivePricingCachedData
    );
  });
  test("Should return normalized cached and DEFAULT live pricing data", () => {
    expect(
      normalizeLivePricingCachedData(mockLivePricingCachedData, mockLivePriceDefaultOptionsData)
    ).toEqual({
      monolithVacationPackage: {
        ...mockLivePriceDefaultOptionsData.monolithVacationPackage,
        price: mockLivePriceDefaultOptionsData.monolithVacationPackage.price,
        options: [
          {
            ...mockLivePriceDefaultOptionsData.monolithVacationPackage.options[0],
            items: [
              mockLivePriceDefaultOptionsData.monolithVacationPackage.options[0].items[0],
              mockLivePricingCachedData.monolithVacationPackage.options[0].items[1],
              mockLivePricingCachedData.monolithVacationPackage.options[0].items[2],
            ],
          },
          {
            ...mockLivePriceDefaultOptionsData.monolithVacationPackage.options[1],
            items: [
              mockLivePriceDefaultOptionsData.monolithVacationPackage.options[1].items[0],
              mockLivePricingCachedData.monolithVacationPackage.options[1].items[1],
              mockLivePricingCachedData.monolithVacationPackage.options[1].items[2],
            ],
          },
          mockLivePriceDefaultOptionsData.monolithVacationPackage.options[2],
        ],
      },
    });
  });

  test("Should return normalized CACHED and DEFAULT live pricing with the options ordering from DEFAULT live pricing", () => {
    expect(
      normalizeLivePricingCachedData(
        {
          monolithVacationPackage: {
            ...mockLivePricingCachedData.monolithVacationPackage,
            options: [
              livePricingOptionsDataset.cached.accommodation,
              livePricingOptionsDataset.cached.horseRidingTour,
              livePricingOptionsDataset.cached.blueLagoon,
            ],
          },
        },
        {
          monolithVacationPackage: {
            ...mockLivePriceDefaultOptionsData.monolithVacationPackage,
            options: [
              livePricingOptionsDataset.default.blueLagoon,
              livePricingOptionsDataset.default.horseRidingTour,
              livePricingOptionsDataset.default.accommodation,
            ],
          },
        }
      )
    ).toEqual({
      monolithVacationPackage: {
        ...mockLivePriceDefaultOptionsData.monolithVacationPackage,
        price: mockLivePriceDefaultOptionsData.monolithVacationPackage.price,
        options: [
          {
            ...livePricingOptionsDataset.default.blueLagoon,
            items: [
              livePricingOptionsDataset.default.blueLagoon.items[0],
              livePricingOptionsDataset.cached.blueLagoon.items[1],
              livePricingOptionsDataset.cached.blueLagoon.items[2],
            ],
          },
          {
            ...livePricingOptionsDataset.default.horseRidingTour,
            items: [], // there are no items for horse riding tour
          },
          {
            ...livePricingOptionsDataset.default.accommodation,
            items: [
              livePricingOptionsDataset.default.accommodation.items[0],
              livePricingOptionsDataset.cached.accommodation.items[1],
              livePricingOptionsDataset.cached.accommodation.items[2],
            ],
          },
        ],
      },
    });
  });

  test("Should return normalized CACHED and DEFAULT live pricing by matching the available options from DEFAULT", () => {
    expect(
      normalizeLivePricingCachedData(
        {
          monolithVacationPackage: {
            ...mockLivePricingCachedData.monolithVacationPackage,
            options: [],
          },
        },
        {
          monolithVacationPackage: {
            ...mockLivePriceDefaultOptionsData.monolithVacationPackage,
            options: [livePricingOptionsDataset.default.accommodation],
          },
        }
      )
    ).toEqual({
      monolithVacationPackage: {
        ...mockLivePriceDefaultOptionsData.monolithVacationPackage,
        price: mockLivePriceDefaultOptionsData.monolithVacationPackage.price,
        options: [
          {
            ...livePricingOptionsDataset.default.accommodation,
            items: [livePricingOptionsDataset.default.accommodation.items[0]],
          },
        ],
      },
    });
  });
});

describe("normalizeLivePricingData", () => {
  test("Should return undefined if there is no data", () => {
    expect(normalizeLivePricingData(undefined, undefined)).toEqual(undefined);
  });
  test("Should return livePriceDefaultOptionsData if there is no NON_DEFAULT data", () => {
    expect(normalizeLivePricingData(mockLivePriceDefaultOptionsData, undefined)).toEqual(
      mockLivePriceDefaultOptionsData
    );
  });
  test("Should return normalized live price data", () => {
    expect(
      normalizeLivePricingData(mockLivePriceDefaultOptionsData, mockLivePriceNonDefaultOptionsData)
    ).toEqual({
      monolithVacationPackage: {
        ...mockLivePriceNonDefaultOptionsData.monolithVacationPackage,
        price: mockLivePriceDefaultOptionsData.monolithVacationPackage.price,
        options: [
          {
            ...mockLivePriceDefaultOptionsData.monolithVacationPackage.options[0],
            items: [
              mockLivePriceDefaultOptionsData.monolithVacationPackage.options[0].items[0],
              mockLivePriceNonDefaultOptionsData.monolithVacationPackage.options[0].items[0],
              mockLivePriceNonDefaultOptionsData.monolithVacationPackage.options[0].items[1],
            ],
          },
          {
            ...mockLivePriceDefaultOptionsData.monolithVacationPackage.options[1],
            items: [
              mockLivePriceDefaultOptionsData.monolithVacationPackage.options[1].items[0],
              mockLivePriceNonDefaultOptionsData.monolithVacationPackage.options[1].items[0],
              mockLivePriceNonDefaultOptionsData.monolithVacationPackage.options[1].items[1],
            ],
          },
          mockLivePriceDefaultOptionsData.monolithVacationPackage.options[2],
        ],
      },
    });

    expect(
      normalizeLivePricingData(
        mockLivePriceDefaultOptionsData1,
        mockLivePriceNonDefaultOptionsData1
      )
    ).toEqual(mockLivePriceMergedLivePriceData);
  });
});
