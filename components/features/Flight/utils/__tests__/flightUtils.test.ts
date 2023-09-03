/* eslint-disable functional/immutable-data */
import {
  constructPassengerBaggage,
  getSearchUrlFromProductUrl,
  getBagCount,
  formatDateInputParam,
  getPassengerBaggageInputParam,
  getPassengerDetailsCartInput,
  getBirthdayError,
  getCategoryFromAge,
  hasExpiryInvalid,
  hasExpiryError,
  isPrimaryPassengerAdult,
  getIsFormValid,
  isPassengerFormInvalid,
  getPassengerCategoryOptions,
  getLastPassengerOfCategory,
  removePassengerFormError,
  shouldShowPassengerRemoveButton,
  onChangeBaggageSelection,
  hasNoAvailableBaggage,
  readFlightPaxDataFromLocalStorage,
  getInitialContactDetails,
  lsKeyFlightPaxInfo,
  writeFlightDataToLocalStorage,
  lsKeyFlightContactInfo,
  constructFlightCartInput,
} from "../flightUtils";
import {
  mockQueryBaggage,
  mockAdultBaggage,
  mockChildBaggage,
  mockInfantBaggage,
  mockPassenger1,
  mockPassenger2,
  mockContactDetails,
  mockPassengerWithoutContactDetails,
  mockFlightCartInputWithoutContactDetails,
  mockFlightCartInput,
} from "../flightMockData";

import { localStorageMock } from "__mocks__/mocks";
import { SupportedCurrencies } from "types/enums";

const fakeTranslate = (value: string) => value;

describe("constructPassengerBaggage", () => {
  test("getting adult baggage", () => {
    expect(
      constructPassengerBaggage("adult", fakeTranslate as TFunction, mockQueryBaggage)
    ).toEqual(mockAdultBaggage);
  });
  test("getting child baggage", () => {
    expect(
      constructPassengerBaggage("child", fakeTranslate as TFunction, mockQueryBaggage)
    ).toEqual(mockChildBaggage);
  });
  test("getting infant baggage", () => {
    expect(
      constructPassengerBaggage("infant", fakeTranslate as TFunction, mockQueryBaggage)
    ).toEqual(mockInfantBaggage);
  });
});

describe("getSearchUrlFromProductUrl", () => {
  test("should return correct searchUrl", () => {
    const productUrl = "/flights/details";
    expect(getSearchUrlFromProductUrl(productUrl)).toEqual("/flights");
  });
  test("should return correct searchUrl", () => {
    const productUrl = "/de/fluge/details";
    expect(getSearchUrlFromProductUrl(productUrl)).toEqual("/de/fluge");
  });
  test("should return correct searchUrl", () => {
    const productUrl = "/flights/details?adults=1&bookingToken=BfoIvmwH6aFC4_j_Z_9Qs";
    expect(getSearchUrlFromProductUrl(productUrl)).toEqual("/flights");
  });
});

describe("getBagCount", () => {
  test("should return total count of selected baggage", () => {
    expect(getBagCount([mockPassenger1, mockPassenger2])).toEqual(1);
  });
});

describe("formatDateInputParam", () => {
  test("should return formatted date", () => {
    expect(formatDateInputParam({ day: "14", month: "2", year: "1995" })).toEqual("1995-02-14");
  });
});

describe("getPassengerBaggageInputParam", () => {
  test("should return list of selected bag categories for passenger", () => {
    expect(getPassengerBaggageInputParam(mockPassenger1.bags)).toEqual(["HandBag-0"]);
  });
  test("should return list of selected bag categories for passenger", () => {
    expect(getPassengerBaggageInputParam(mockPassenger2.bags)).toEqual(["HandBag-0", "HoldBag-0"]);
  });
});

describe("getBagCount", () => {
  test("should return total count of selected baggage", () => {
    expect(getBagCount([mockPassenger1, mockPassenger2])).toEqual(1);
  });
});

describe("formatDateInputParam", () => {
  test("should return formatted date", () => {
    expect(formatDateInputParam({ day: "14", month: "2", year: "1995" })).toEqual("1995-02-14");
  });
});

describe("getPassengerDetailsCartInput", () => {
  test("should return a list of passenger cart input", () => {
    expect(
      getPassengerDetailsCartInput([mockPassenger1, mockPassenger2], mockContactDetails, true)
    ).toEqual([
      {
        baggage: ["HandBag-0"],
        birthday: "1995-01-01",
        category: "adult",
        email: "test@test.is",
        expiration: null,
        name: "Hekla",
        surname: "Amundadottir",
        nationality: "IS",
        passportNumber: "A1029374",
        phone: "+3541234567",
        title: "ms",
      },
      {
        baggage: ["HandBag-0", "HoldBag-0"],
        birthday: "1994-02-12",
        category: "adult",
        email: undefined,
        expiration: "2024-03-01",
        name: "Anna",
        surname: "Jonsdottir",
        nationality: "IS",
        passportNumber: "A36SGJ2352345",
        phone: undefined,
        title: "ms",
      },
    ]);
  });

  test("should return a list of passenger cart input without contactData", () => {
    expect(getPassengerDetailsCartInput([mockPassenger1, mockPassenger2])).toEqual([
      {
        baggage: ["HandBag-0"],
        birthday: "1995-01-01",
        category: "adult",
        email: undefined,
        expiration: null,
        name: "Hekla",
        surname: "Amundadottir",
        nationality: "IS",
        passportNumber: null,
        phone: undefined,
        title: "ms",
      },
      {
        baggage: ["HandBag-0", "HoldBag-0"],
        birthday: "1994-02-12",
        category: "adult",
        email: undefined,
        expiration: null,
        name: "Anna",
        surname: "Jonsdottir",
        nationality: "IS",
        passportNumber: null,
        phone: undefined,
        title: "ms",
      },
    ]);
  });

  test("should return a list of passenger cart input without birtday date", () => {
    expect(
      // @ts-ignore
      getPassengerDetailsCartInput([{ ...mockPassenger1, birthday: undefined }])
    ).toEqual([
      {
        baggage: ["HandBag-0"],
        birthday: undefined,
        category: "adult",
        email: undefined,
        expiration: null,
        name: "Hekla",
        surname: "Amundadottir",
        nationality: "IS",
        passportNumber: null,
        phone: undefined,
        title: "ms",
      },
    ]);
    expect(
      getPassengerDetailsCartInput([
        {
          ...mockPassenger1,
          birthday: {
            // @ts-ignore
            date: "15",
          },
        },
      ])
    ).toEqual([
      {
        baggage: ["HandBag-0"],
        birthday: undefined,
        category: "adult",
        email: undefined,
        expiration: null,
        name: "Hekla",
        surname: "Amundadottir",
        nationality: "IS",
        passportNumber: null,
        phone: undefined,
        title: "ms",
      },
    ]);
    expect(
      getPassengerDetailsCartInput([
        {
          ...mockPassenger1,
          birthday: {
            // @ts-ignore
            date: "15",
            month: "1",
          },
        },
      ])
    ).toEqual([
      {
        baggage: ["HandBag-0"],
        birthday: undefined,
        category: "adult",
        email: undefined,
        expiration: null,
        name: "Hekla",
        surname: "Amundadottir",
        nationality: "IS",
        passportNumber: null,
        phone: undefined,
        title: "ms",
      },
    ]);
  });
});
describe("getBirthdayError", () => {
  test("should return an error because day cannot be 54", () => {
    const date = {
      day: "54",
      month: "1",
      year: "1995",
    };
    expect(getBirthdayError(date, 2, "2024-12-12", "adult", fakeTranslate as TFunction)).toEqual(
      "Date is invalid"
    );
  });
  test("should return no error because date of birth is valid", () => {
    const date = {
      day: "12",
      month: "1",
      year: "2020",
    };
    expect(getBirthdayError(date, 1, "2024-12-12", "adult", fakeTranslate as TFunction)).toEqual(
      "Primary passenger must be older than 16 years old"
    );
  });
  test("should return no error because date of birth is valid", () => {
    const date = {
      day: "12",
      month: "1",
      year: "2021",
    };
    expect(getBirthdayError(date, 2, "2024-12-12", "adult", fakeTranslate as TFunction)).toEqual(
      "Adults must be older than 16 years old"
    );
  });
  test("should return no error because date of birth is valid", () => {
    const date = {
      day: "12",
      month: "1",
      year: "1995",
    };
    expect(getBirthdayError(date, 2, "2024-12-12", "child", fakeTranslate as TFunction)).toEqual(
      "Children must be between 2 and 16 years old"
    );
  });
  test("should return no error because date of birth is valid", () => {
    const date = {
      day: "12",
      month: "1",
      year: "1995",
    };
    expect(getBirthdayError(date, 2, "2024-12-12", "infant", fakeTranslate as TFunction)).toEqual(
      "Infants must be younger than 2 years old"
    );
  });
  test("should return no error because date of birth is valid", () => {
    const date = {
      day: "12",
      month: "1",
      year: "1995",
    };
    expect(getBirthdayError(date, 2, "2024-12-12", "adult", fakeTranslate as TFunction)).toEqual(
      undefined
    );
  });
});

describe("getCategoryFromAge", () => {
  test("should return a list of passenger cart input", () => {
    const date = {
      day: "12",
      month: "1",
      year: "1995",
    };
    expect(getCategoryFromAge(date, "2024-12-12")).toEqual("adult");
  });
  test("should return a list of passenger cart input", () => {
    const date = {
      day: "14",
      month: "12",
      year: "2020",
    };
    expect(getCategoryFromAge(date, "2022-12-12")).toEqual("infant");
  });
  test("should return a list of passenger cart input", () => {
    const date = {
      day: "12",
      month: "1",
      year: "2018",
    };
    expect(getCategoryFromAge(date, "2024-12-12")).toEqual("child");
  });
});

describe("hasExpiryInvalid", () => {
  test("should return false because there is no passport expiration", () => {
    const date = {
      day: "12",
      month: "1",
      year: undefined,
    };
    expect(hasExpiryInvalid(true, date)).toEqual(false);
  });
  test("should return false because date is valid", () => {
    const date = {
      day: "12",
      month: "1",
      year: "2021",
    };
    expect(hasExpiryInvalid(false, date)).toEqual(false);
  });
  test("should return true because date is not valid", () => {
    const date = {
      day: "54",
      month: "1",
      year: "2020",
    };
    expect(hasExpiryInvalid(false, date)).toEqual(true);
  });
});

describe("hasExpiryError", () => {
  test("should return false because there is no passport expiration", () => {
    const date = {
      day: "12",
      month: "1",
      year: undefined,
    };
    expect(hasExpiryError(true, date)).toEqual(false);
  });
  test("should return false because date is in the future", () => {
    const date = {
      day: "12",
      month: "1",
      year: "2024",
    };
    expect(hasExpiryError(false, date)).toEqual(false);
  });
  test("should return false because date is today", () => {
    const todayDate = new Date();
    const date = {
      day: `${todayDate.getDate()}`,
      month: `${todayDate.getMonth() + 1}`,
      year: `${todayDate.getFullYear()}`,
    };
    expect(hasExpiryError(false, date)).toEqual(false);
  });
});

describe("isPrimaryPassengerAdult", () => {
  test("should return false because there is no passport expiration", () => {
    const date = {
      day: "12",
      month: "1",
      year: "2021",
    };
    expect(isPrimaryPassengerAdult(1, date, "2022-12-12")).toEqual(false);
  });
  test("should return false because date is in the future", () => {
    const date = {
      day: "12",
      month: "1",
      year: "1995",
    };
    expect(isPrimaryPassengerAdult(1, date, "2022-12-12")).toEqual(true);
  });
  test("should return true because date is in the past", () => {
    const date = {
      day: "5",
      month: "1",
      year: "2020",
    };
    expect(isPrimaryPassengerAdult(2, date, "2022-12-12")).toEqual(true);
  });
});

describe("getIsFormValid", () => {
  const passengerFormErrors: FlightTypes.PassengerFormErrors = {
    nameError: false,
    surnameError: false,
    nationalityError: false,
    birthdayError: true,
    passportError: false,
    passportExpError: false,
    passportExpInvalidError: false,
    noPassportExpError: false,
    birthdayPrimaryError: false,
    birthdayCategoryError: false,
    genderError: false,
  };

  const passengerFormErrors2 = {
    ...passengerFormErrors,
    birthdayError: false,
  };

  test("should return false because birthday field has error", () => {
    expect(getIsFormValid(passengerFormErrors)).toEqual(false);
  });
  test("should return true because passenger form has no errors", () => {
    expect(getIsFormValid(passengerFormErrors2)).toEqual(true);
  });
});

describe("isPassengerFormInvalid", () => {
  const passengerFormErrors = [
    {
      id: 1,
      isInvalid: false,
    },
    {
      id: 2,
      isInvalid: true,
    },
    {
      id: 2,
      isInvalid: false,
    },
  ];

  test("should return false because passenger with id 1 is valid", () => {
    expect(isPassengerFormInvalid(passengerFormErrors, 1, true)).toEqual(false);
  });
  test("should return true because passenger with id 1 is valid", () => {
    expect(isPassengerFormInvalid(passengerFormErrors, 1, false)).toEqual(true);
  });
});

describe("getPassengerCategoryOptions", () => {
  const adult = {
    id: "adult",
    name: "Adult (over 16 years)",
  };
  const child = {
    id: "child",
    name: "Child (2 - 16 years)",
  };
  const infant = {
    id: "infant",
    name: "Infant (under 2 years)",
  };
  test("should return list with only adult, because this is primary passenger", () => {
    expect(getPassengerCategoryOptions(1, fakeTranslate as TFunction, 1, 1, "adult")).toEqual([
      adult,
    ]);
  });
  test("should return list with adult and child, because there are 2 adults and 1 infant, so adult cannot be changed to infant", () => {
    expect(getPassengerCategoryOptions(2, fakeTranslate as TFunction, 2, 1, "adult")).toEqual([
      adult,
      child,
    ]);
  });
  test("should return list with adult, child and infant, because the pasenger is an infant so it should appear in the list", () => {
    expect(getPassengerCategoryOptions(2, fakeTranslate as TFunction, 1, 1, "infant")).toEqual([
      adult,
      child,
      infant,
    ]);
  });
  test("should return list with adult, child and infant, because there are more adults than infants so a child can be changed to all types", () => {
    expect(getPassengerCategoryOptions(2, fakeTranslate as TFunction, 2, 1, "child")).toEqual([
      adult,
      child,
      infant,
    ]);
  });
});

describe("getLastPassengerOfCategory", () => {
  const passenger1 = mockPassenger1;
  const passenger2: FlightTypes.PassengerDetails = {
    ...mockPassenger1,
    id: 2,
    category: "child",
  };
  const passenger3: FlightTypes.PassengerDetails = {
    ...mockPassenger1,
    id: 3,
    category: "child",
  };
  const passenger4: FlightTypes.PassengerDetails = {
    ...mockPassenger1,
    id: 4,
    category: "adult",
  };
  const passengers = [passenger1, passenger2, passenger3, passenger4];
  test("should return last child passenger", () => {
    expect(getLastPassengerOfCategory(passengers, "child")).toEqual(passenger3);
  });
  test("should return last adult passenger", () => {
    expect(getLastPassengerOfCategory(passengers, "adult")).toEqual(passenger4);
  });
  test("should return undefined because there is no infant", () => {
    expect(getLastPassengerOfCategory(passengers, "infant")).toEqual(undefined);
  });
});

describe("removePassengerFormError", () => {
  const formErrors = [
    {
      id: 1,
      isInvalid: true,
    },
    {
      id: 2,
      isInvalid: false,
    },
    {
      id: 3,
      isInvalid: false,
    },
    {
      id: 4,
      isInvalid: true,
    },
  ];
  const passengers: FlightTypes.PassengerDetails[] = [
    mockPassenger1,
    {
      ...mockPassenger1,
      id: 2,
      category: "child",
    },
    {
      ...mockPassenger1,
      id: 3,
      category: "child",
    },
    {
      ...mockPassenger1,
      id: 4,
      category: "adult",
    },
  ];

  test("should return last child passenger error", () => {
    expect(removePassengerFormError(formErrors, passengers, "child")).toEqual([
      {
        id: 1,
        isInvalid: true,
      },
      {
        id: 2,
        isInvalid: false,
      },
      {
        id: 3,
        isInvalid: true,
      },
    ]);
  });
  test("should return last adult passenger eror", () => {
    expect(removePassengerFormError(formErrors, passengers, "adult")).toEqual([
      {
        id: 1,
        isInvalid: true,
      },
      {
        id: 2,
        isInvalid: false,
      },
      {
        id: 3,
        isInvalid: false,
      },
    ]);
  });
});

describe("shouldShowPassengerRemoveButton", () => {
  test("should return false because you cannot remove primary passenger", () => {
    expect(shouldShowPassengerRemoveButton(1, "adult", 2, 1)).toEqual(false);
  });
  test("should return false because adults can not be fewer than infants", () => {
    expect(shouldShowPassengerRemoveButton(2, "adult", 1, 1)).toEqual(false);
  });
  test("should return true because there are more adults than infants", () => {
    expect(shouldShowPassengerRemoveButton(2, "adult", 2, 1)).toEqual(true);
  });
  test("should return true because you can always remove a child", () => {
    expect(shouldShowPassengerRemoveButton(2, "child", 1, 1)).toEqual(true);
  });
  test("should return true because you can always remove an infant", () => {
    expect(shouldShowPassengerRemoveButton(2, "infant", 1, 1)).toEqual(true);
  });
});

describe("onChangeBaggageSelection", () => {
  const result = {
    handBags: mockAdultBaggage.handBags,
    holdBags: [
      { ...mockAdultBaggage.holdBags[0], isSelected: false },
      { ...mockAdultBaggage.holdBags[1], isSelected: true },
      mockAdultBaggage.holdBags[2],
    ],
  };
  test("return bags with correct item selected", () => {
    expect(onChangeBaggageSelection("HoldBag-0", mockAdultBaggage, false)).toEqual(result);
  });
  const result2 = {
    handBags: mockAdultBaggage.handBags,
    holdBags: [
      result.holdBags[0],
      { ...result.holdBags[1], isSelected: false },
      { ...result.holdBags[2], isSelected: true },
    ],
  };

  test("return bags with correct item selected", () => {
    expect(onChangeBaggageSelection("HoldBag-1", result, false)).toEqual(result2);
  });
});

describe("hasNoAvailableBaggage", () => {
  test("should return true because there is no available baggage", () => {
    expect(hasNoAvailableBaggage({ handBags: [], holdBags: [] })).toEqual(true);
  });
  test("should return false because there is both available handBaggage and holdBaggage", () => {
    expect(hasNoAvailableBaggage(mockAdultBaggage)).toEqual(false);
  });
  test("should return false because there is available holdBaggage", () => {
    expect(
      hasNoAvailableBaggage({
        handBags: [],
        holdBags: mockAdultBaggage.holdBags,
      })
    ).toEqual(false);
  });
  test("should return false because there is available handBaggage", () => {
    expect(
      hasNoAvailableBaggage({
        handBags: mockAdultBaggage.handBags,
        holdBags: [],
      })
    ).toEqual(false);
  });
});

describe("writeFlightDataToLocalStorage / readFlightPaxDataFromLocalStorage", () => {
  const { location } = window;
  const mockBaggage: FlightTypes.PassengersBaggage = {
    adult: {
      handBags: [],
      holdBags: [],
    },
    child: {
      handBags: [],
      holdBags: [],
    },
    infant: {
      handBags: [],
      holdBags: [],
    },
  };

  beforeAll(() => {
    // @ts-ignore
    delete window.location;
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
  });

  afterAll(() => {
    window.location = location;
  });
  test("should return passenger details back since passenger numbers match", () => {
    writeFlightDataToLocalStorage([mockPassenger1, mockPassenger2], lsKeyFlightPaxInfo);

    expect(readFlightPaxDataFromLocalStorage(2, 0, 0, mockBaggage)).toEqual([
      { ...mockPassenger1, bags: mockBaggage.adult },
      { ...mockPassenger2, bags: mockBaggage.adult },
    ]);
  });
  test("should return null since passenger numbers do not match", () => {
    writeFlightDataToLocalStorage([mockPassenger1, mockPassenger2], lsKeyFlightPaxInfo);

    expect(readFlightPaxDataFromLocalStorage(2, 1, 0, mockBaggage)).toEqual(null);
  });
});

describe("getInitialContactDetails", () => {
  const { location } = window;
  beforeAll(() => {
    // @ts-ignore
    delete window.location;
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
  });

  afterAll(() => {
    window.location = location;
  });
  test("should return defaultEmail if nothing is in local storage", () => {
    expect(getInitialContactDetails("sigurdur.n@travelshift.com")).toEqual({
      contactEmail: "sigurdur.n@travelshift.com",
      phoneNumber: "",
    });
  });
  test("should return contact details from local storage if it is there", () => {
    writeFlightDataToLocalStorage<FlightTypes.ContactDetails>(
      mockContactDetails,
      lsKeyFlightContactInfo
    );

    expect(getInitialContactDetails("sigurdur.n@travelshift.com")).toEqual(mockContactDetails);
  });
});

describe("constructFlightCartInput", () => {
  const mockBookingToken = "bookingToken";

  test("should correctly construct constructFlightCartInput without contact details", () => {
    expect(
      constructFlightCartInput({
        passengers: mockPassengerWithoutContactDetails,
        bookingToken: mockBookingToken,
        currencyCode: SupportedCurrencies.EURO as string,
      })
    ).toEqual(mockFlightCartInputWithoutContactDetails);
  });

  test("should correctly construct constructFlightCartInput", () => {
    const passenger1 = mockPassenger1;
    const passenger2: FlightTypes.PassengerDetails = {
      ...mockPassenger1,
      id: 2,
      category: "child",
    };
    const passengers = [passenger1, passenger2];

    expect(
      constructFlightCartInput({
        passengers,
        bookingToken: mockBookingToken,
        currencyCode: SupportedCurrencies.EURO as string,
      })
    ).toEqual(mockFlightCartInput);
  });
});
