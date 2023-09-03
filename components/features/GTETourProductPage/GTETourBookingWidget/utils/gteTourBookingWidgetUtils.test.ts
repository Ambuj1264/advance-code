import { startOfTomorrow, startOfToday } from "date-fns";

import { GTETourAgeBand, GTETourQuestionId } from "../types/enums";

import {
  splitTourQuestions,
  constructTourQuestions,
  updateBookingQuestionAnswer,
  updateConditionalBookingQuestionAnswer,
  updateTravelerQuestionAnswer,
  updateTourOptionTimes,
  updateTourOptionLanguages,
  getNumberOfTravelerTypeFromQuery,
  getTravelerOptions,
  getIsSelectedTime,
  getInitialSelectedTourOption,
  getDateQuestionError,
  getIsNameError,
  getIsWeightOrHeightError,
  getTravelerPassportExpiryError,
} from "./gteTourBookingWidgetUtils";
import {
  mockBookingQuestion0,
  mockBookingQuestion1,
  mockBookingQuestion2,
  mockBookingQuestion3,
  mockBookingQuestion4,
  mockTravelerQuestion0,
  mockTravelerQuestion1,
  mockTravelerQuestionAnswer0,
  mockTravelerQuestionAnswer1,
  mockBookingQuestionAnswer0,
  mockBookingQuestionAnswer1,
  mockBookingQuestionAnswer1AllowedAnswer0,
  mockBookingQuestionAnswer1AllowedAnswer1,
  mockBookingQuestionAnswer1AllowedAnswer2,
  mockBookingQuestionAnswer1AllowedAnswer0ConditionalQuestion,
  mockTravelerQuestionAnswer0Question,
  mockSelectedTourOption,
  mockSelectedTourOptionTime0,
  mockSelectedTourOptionTime1,
  mockSelectedTourOptionLanguage0,
  mockSelectedTourOptionLanguage1,
  mockTourOption,
  mockTourOptionTime0,
  mockTourOptionTime1,
  mockTourOptionLanguage0,
  mockTourOptionLanguage1,
} from "./mockGTETourBookingData";

import { getFormattedDate } from "utils/dateUtils";

const fakeTranslate = (value: string) => value;

describe("splitTourQuestions", () => {
  test("should return questions split into perBooking, perPerson, ageband and conditionalQuestions", () => {
    expect(
      splitTourQuestions([
        mockBookingQuestion0,
        mockBookingQuestion1,
        mockBookingQuestion2,
        mockBookingQuestion3,
        mockBookingQuestion4,
        mockTravelerQuestion0,
        mockTravelerQuestion1,
      ])
    ).toEqual({
      perBooking: [mockBookingQuestion0, mockBookingQuestion1],
      conditionalQuestions: [mockBookingQuestion2, mockBookingQuestion3, mockBookingQuestion4],
      perPerson: [mockTravelerQuestion0],
      ageBand: mockTravelerQuestion1,
    });
  });
});

describe("constructTourQuestions", () => {
  test("should return correctly constructed questions for tour", () => {
    expect(
      constructTourQuestions(
        [
          {
            ageBand: "ADULT",
            numberOfTravelers: 1,
          },
          {
            ageBand: "CHILD",
            numberOfTravelers: 1,
          },
        ],
        [
          mockBookingQuestion0,
          mockBookingQuestion1,
          mockBookingQuestion2,
          mockBookingQuestion3,
          mockBookingQuestion4,
          mockTravelerQuestion0,
          mockTravelerQuestion1,
        ],
        [],
        []
      )
    ).toEqual({
      perBooking: [mockBookingQuestionAnswer0, mockBookingQuestionAnswer1],
      perPerson: [mockTravelerQuestionAnswer0, mockTravelerQuestionAnswer1],
    });
  });
});

describe("updateBookingQuestionAnswer", () => {
  test("should update correct booking question answer", () => {
    expect(
      updateBookingQuestionAnswer(12, "h", [mockBookingQuestionAnswer0, mockBookingQuestionAnswer1])
    ).toEqual([
      {
        ...mockBookingQuestionAnswer0,
        answer: "h",
      },
      mockBookingQuestionAnswer1,
    ]);
  });
});

describe("updateConditionalBookingQuestionAnswer", () => {
  test("should update correct conditional question answer", () => {
    expect(
      updateConditionalBookingQuestionAnswer(15, 16, "h", [
        mockBookingQuestionAnswer0,
        {
          ...mockBookingQuestionAnswer1,
          answer: "AIR",
        },
      ])
    ).toEqual([
      mockBookingQuestionAnswer0,
      {
        ...mockBookingQuestionAnswer1,
        answer: "AIR",
        allowedAnswers: [
          {
            ...mockBookingQuestionAnswer1AllowedAnswer0,
            conditionalQuestions: [
              {
                ...mockBookingQuestionAnswer1AllowedAnswer0ConditionalQuestion,
                answer: "h",
              },
            ],
          },
          mockBookingQuestionAnswer1AllowedAnswer1,
          mockBookingQuestionAnswer1AllowedAnswer2,
        ],
      },
    ]);
  });
});

describe("updateTravelerQuestionAnswer", () => {
  test("should update correct traveler question answer", () => {
    expect(
      updateTravelerQuestionAnswer("ADULT-1", 19, "h", [
        mockTravelerQuestionAnswer0,
        mockTravelerQuestionAnswer1,
      ])
    ).toEqual([
      {
        ...mockTravelerQuestionAnswer0,
        questions: [
          {
            ...mockTravelerQuestionAnswer0Question,
            answer: "h",
          },
        ],
      },
      mockTravelerQuestionAnswer1,
    ]);
  });
});

describe("updateTourOptionTimes", () => {
  test("should update selected tour time", () => {
    expect(updateTourOptionTimes("05:30", mockSelectedTourOption)).toEqual([
      {
        ...mockSelectedTourOptionTime0,
        isSelected: false,
      },
      {
        ...mockSelectedTourOptionTime1,
        isSelected: true,
      },
    ]);
  });
});

describe("updateTourOptionLanguages", () => {
  test("should update selected guided language", () => {
    expect(updateTourOptionLanguages("fr-GUIDE", mockSelectedTourOption)).toEqual([
      {
        ...mockSelectedTourOptionLanguage0,
        isSelected: false,
      },
      {
        ...mockSelectedTourOptionLanguage1,
        isSelected: true,
      },
    ]);
  });
});

describe("getNumberOfTravelerTypeFromQuery", () => {
  test("should return correct number of traveler types from query params", () => {
    expect(
      getNumberOfTravelerTypeFromQuery(
        [
          {
            ageBand: "ADULT",
            startAge: 16,
            endAge: 120,
            minTravelersPerBooking: 0,
            maxTravelersPerBooking: 8,
          },
          {
            ageBand: "CHILD",
            startAge: 3,
            endAge: 16,
            minTravelersPerBooking: 0,
            maxTravelersPerBooking: 8,
          },
        ],
        8,
        2,
        [9, 12, 17]
      )
    ).toEqual({
      [GTETourAgeBand.ADULT]: 3,
      [GTETourAgeBand.CHILD]: 2,
    });
  });
});

describe("getTravelerOptions", () => {
  test("should return initial age bands", () => {
    expect(
      getTravelerOptions(
        {
          minTravelersPerBooking: 0,
          maxTravelersPerBooking: 8,
          requiresAdultForBooking: false,
          ageBands: [
            {
              ageBand: "ADULT",
              startAge: 16,
              endAge: 120,
              minTravelersPerBooking: 0,
              maxTravelersPerBooking: 8,
            },
            {
              ageBand: "CHILD",
              startAge: 3,
              endAge: 16,
              minTravelersPerBooking: 0,
              maxTravelersPerBooking: 8,
            },
          ],
        },
        2,
        [9, 12, 17]
      )
    ).toEqual([
      {
        ageBand: GTETourAgeBand.ADULT,
        numberOfTravelers: 3,
      },
      {
        ageBand: GTETourAgeBand.CHILD,
        numberOfTravelers: 2,
      },
    ]);
  });
});

describe("getIsSelectedTime", () => {
  it("returns true in case time is available, and nothing was selected previously", () => {
    expect(getIsSelectedTime(true, "05:00")).toBe(true);
  });

  it("returns false in case time is NOT available, and nothing was selected previously", () => {
    expect(getIsSelectedTime(false, "05:00")).toBe(false);
  });

  it("tries to preselect same time as user has chosen previously, if it's available", () => {
    expect(
      getIsSelectedTime(true, "05:00", [{ ...mockSelectedTourOptionTime0, startTime: "05:00" }])
    ).toBe(true);

    expect(
      getIsSelectedTime(true, "06:00", [{ ...mockSelectedTourOptionTime0, startTime: "06:10" }])
    ).toBe(false);
  });

  it("always return false in case time is unavailable", () => {
    expect(
      getIsSelectedTime(false, "05:00", [{ ...mockSelectedTourOptionTime0, startTime: "05:00" }])
    ).toBe(false);

    expect(
      getIsSelectedTime(false, "06:00", [{ ...mockSelectedTourOptionTime0, startTime: "06:10" }])
    ).toBe(false);
  });
});

describe("getInitialSelectedTourOption", () => {
  it("selects first available time and first language", () => {
    const tourOption: GTETourBookingWidgetTypes.TourOption = {
      ...mockTourOption,
      times: [
        { ...mockTourOptionTime0, available: false },
        { ...mockTourOptionTime1, available: true },
      ],
      guidedLanguages: [mockTourOptionLanguage0, mockTourOptionLanguage1],
    };
    const expectedSelectedTourOption: GTETourBookingWidgetTypes.SelectedTourOption = {
      ...tourOption,
      times: [
        { ...mockTourOptionTime0, available: false, isSelected: false },
        { ...mockTourOptionTime1, available: true, isSelected: true }, // first avail. time gets selected
      ],
      guidedLanguages: [{ ...mockTourOptionLanguage0, isSelected: true }, mockTourOptionLanguage1],
    };

    expect(getInitialSelectedTourOption(tourOption)).toEqual(expectedSelectedTourOption);
  });

  it("does not select options in case nothing available", () => {
    const tourOption: GTETourBookingWidgetTypes.TourOption = {
      ...mockTourOption,
      times: [
        { ...mockTourOptionTime0, available: false },
        { ...mockTourOptionTime1, available: false },
      ],
      guidedLanguages: [mockTourOptionLanguage0, mockTourOptionLanguage1],
    };
    const expectedSelectedTourOption: GTETourBookingWidgetTypes.SelectedTourOption = {
      ...tourOption,
      times: [
        { ...mockTourOptionTime0, available: false, isSelected: false },
        { ...mockTourOptionTime1, available: false, isSelected: false },
      ],
      guidedLanguages: [{ ...mockTourOptionLanguage0, isSelected: true }, mockTourOptionLanguage1],
    };

    expect(getInitialSelectedTourOption(tourOption)).toEqual(expectedSelectedTourOption);
  });

  it("pre-selects time time provided from previous user selection", () => {
    const tourOption: GTETourBookingWidgetTypes.TourOption = {
      ...mockTourOption,
      times: [
        { ...mockTourOptionTime0, available: true },
        { ...mockTourOptionTime1, available: true },
      ],
      guidedLanguages: [mockTourOptionLanguage0, mockTourOptionLanguage1],
    };
    const prevSelectedOptions: GTETourBookingWidgetTypes.SelectedTourOption = {
      ...tourOption,
      times: [
        { ...mockTourOptionTime0, available: true, isSelected: false },
        { ...mockTourOptionTime1, available: true, isSelected: true },
      ],
      guidedLanguages: [{ ...mockTourOptionLanguage0, isSelected: true }, mockTourOptionLanguage1],
    };
    // we expect second time to be selected due to prevSelectedOptions has same time already selected
    const expectedSelectedTourOption: GTETourBookingWidgetTypes.SelectedTourOption = {
      ...tourOption,
      times: [
        { ...mockTourOptionTime0, available: true, isSelected: false },
        { ...mockTourOptionTime1, available: true, isSelected: true },
      ],
      guidedLanguages: [{ ...mockTourOptionLanguage0, isSelected: true }, mockTourOptionLanguage1],
    };
    const expectedSelectedTourOptionNoPreselect = {
      ...expectedSelectedTourOption,
      times: [
        { ...mockTourOptionTime0, available: true, isSelected: true },
        { ...mockTourOptionTime1, available: true, isSelected: false },
      ],
    };

    expect(getInitialSelectedTourOption(tourOption, prevSelectedOptions)).toEqual(
      expectedSelectedTourOption
    );

    expect(getInitialSelectedTourOption(tourOption)).toEqual(expectedSelectedTourOptionNoPreselect);
  });

  it("pre-selects first avail. time when previously selected times are unavailable in current tour options", () => {
    const tourOption: GTETourBookingWidgetTypes.TourOption = {
      ...mockTourOption,
      times: [
        { ...mockTourOptionTime0, available: true },
        { ...mockTourOptionTime1, available: true },
      ],
      guidedLanguages: [mockTourOptionLanguage0, mockTourOptionLanguage1],
    };
    const prevSelectedOptions: GTETourBookingWidgetTypes.SelectedTourOption = {
      ...tourOption,
      times: [
        {
          ...mockTourOptionTime0,
          startTime: "05:01",
          available: true,
          isSelected: false,
        },
        {
          ...mockTourOptionTime1,
          startTime: "05:31",
          available: true,
          isSelected: true,
        },
      ],
      guidedLanguages: [{ ...mockTourOptionLanguage0, isSelected: true }, mockTourOptionLanguage1],
    };
    // we expect first time to be selected due to prevSelectedOptions times do not match
    const expectedSelectedTourOption: GTETourBookingWidgetTypes.SelectedTourOption = {
      ...tourOption,
      times: [
        { ...mockTourOptionTime0, available: true, isSelected: true },
        { ...mockTourOptionTime1, available: true, isSelected: false },
      ],
      guidedLanguages: [{ ...mockTourOptionLanguage0, isSelected: true }, mockTourOptionLanguage1],
    };

    expect(getInitialSelectedTourOption(tourOption, prevSelectedOptions)).toEqual(
      expectedSelectedTourOption
    );

    expect(getInitialSelectedTourOption(tourOption)).toEqual(expectedSelectedTourOption);
  });
});

describe("getDateQuestionError", () => {
  test("should return an error because date selected is in the past", () => {
    expect(
      getDateQuestionError({
        t: fakeTranslate as TFunction,
        hasDateError: false,
        answer: { year: "2022", month: "07", day: "01" },
        questionId: GTETourQuestionId.TRANSFER_DEPARTURE_DATE,
        birthdayError: undefined,
        dateFrom: new Date(2022, 6, 18),
      })
    ).toEqual({
      isDateError: true,
      customErrorMessage: "Departure date must be in the future",
    });
  });
  test("should return an error because date selected is after the date of the tour", () => {
    const tourDate = new Date();
    const departureDate = startOfTomorrow();
    const year = getFormattedDate(departureDate, "yyyy");
    const month = getFormattedDate(departureDate, "MM");
    const day = getFormattedDate(departureDate, "dd");
    expect(
      getDateQuestionError({
        t: fakeTranslate as TFunction,
        hasDateError: false,
        answer: { year, month, day },
        questionId: GTETourQuestionId.TRANSFER_DEPARTURE_DATE,
        birthdayError: undefined,
        dateFrom: tourDate,
      })
    ).toEqual({
      isDateError: true,
      customErrorMessage: "Departure date cannot be later than tour date",
    });
  });
  test("should not return an error because date is in the future and before the tour starts", () => {
    const tomorrow = startOfTomorrow();
    const today = startOfToday();
    const year = getFormattedDate(today, "yyyy");
    const month = getFormattedDate(today, "MM");
    const day = getFormattedDate(today, "dd");
    expect(
      getDateQuestionError({
        t: fakeTranslate as TFunction,
        hasDateError: false,
        answer: { year, month, day },
        questionId: GTETourQuestionId.TRANSFER_DEPARTURE_DATE,
        birthdayError: undefined,
        dateFrom: tomorrow,
      })
    ).toEqual({
      isDateError: false,
      customErrorMessage: undefined,
    });
  });
  describe("when the questionId is DATE_OF_BIRTH", () => {
    const notImportantParams = {
      t: fakeTranslate as TFunction,
      hasDateError: true,
      answer: {
        year: "2020",
        month: "10",
        day: "10",
      },
      dateFrom: new Date(),
    };

    test("should return birthday error when birthday error string is passed", () => {
      expect(
        getDateQuestionError({
          ...notImportantParams,
          questionId: GTETourQuestionId.DATE_OF_BIRTH,
          birthdayError: "please correct the date of birth",
        })
      ).toEqual({
        isDateError: true,
        customErrorMessage: "please correct the date of birth",
      });
    });

    test("should not return birthday error when no birthday error string provided", () => {
      expect(
        getDateQuestionError({
          ...notImportantParams,
          questionId: GTETourQuestionId.DATE_OF_BIRTH,
          birthdayError: undefined,
        })
      ).toEqual({
        isDateError: false,
        customErrorMessage: undefined,
      });
    });
  });

  describe("when questionId is PASSPORT_EXPIRY", () => {
    const notImportantParams = {
      t: fakeTranslate as TFunction,
      hasDateError: true,
      answer: {
        year: "2020",
        month: "10",
        day: "10",
      },
      birthdayError: "birthday error",
      dateFrom: new Date(),
    };
    test("should return passport expiration error when error string is passed", () => {
      expect(
        getDateQuestionError({
          ...notImportantParams,
          questionId: GTETourQuestionId.PASSPORT_EXPIRY,
          passportExpirationError: "the passport is expired",
        })
      ).toEqual({
        isDateError: true,
        customErrorMessage: "the passport is expired",
      });
    });
    test("should not return passport expiration when error string is not passed", () => {
      expect(
        getDateQuestionError({
          ...notImportantParams,
          questionId: GTETourQuestionId.PASSPORT_EXPIRY,
          passportExpirationError: undefined,
        })
      ).toEqual({
        isDateError: false,
        customErrorMessage: undefined,
      });
    });
  });
});

describe("getIsNameError", () => {
  const firstNameId = GTETourQuestionId.FULL_NAMES_FIRST;
  const lastNameId = GTETourQuestionId.FULL_NAMES_LAST;
  test("should return an error because first name has special characters", () => {
    expect(getIsNameError(firstNameId, "Hekla Rún123", fakeTranslate as TFunction)).toEqual({
      isNameError: true,
      customErrorMessage: "Name is not valid",
    });
  });
  test("should not return an error because first name contains no special characters", () => {
    expect(getIsNameError(firstNameId, "Hekla Rún", fakeTranslate as TFunction)).toEqual({
      isNameError: false,
      customErrorMessage: undefined,
    });
  });
  test("should return an error because last name has special characters", () => {
    expect(getIsNameError(lastNameId, "Ámundadóttir123", fakeTranslate as TFunction)).toEqual({
      isNameError: true,
      customErrorMessage: "Name is not valid",
    });
  });
  test("should not return an error because last name contains no special characters", () => {
    expect(getIsNameError(lastNameId, "Ámundadóttir", fakeTranslate as TFunction)).toEqual({
      isNameError: false,
      customErrorMessage: undefined,
    });
  });
});

describe("getIsWeightOrHeightError", () => {
  test("should return an error because weight is higher than max weight", () => {
    expect(
      getIsWeightOrHeightError(fakeTranslate as TFunction, GTETourQuestionId.WEIGHT, "301", "kg")
    ).toEqual({
      isWeightOrHeightError: true,
      customErrorMessage: "Input value must be lower than {maxValue}",
      maxValue: 300,
    });
  });
  test("should not return an error because weight is not higher than max weight", () => {
    expect(
      getIsWeightOrHeightError(fakeTranslate as TFunction, GTETourQuestionId.WEIGHT, "299", "kg")
    ).toEqual({
      isWeightOrHeightError: false,
      customErrorMessage: undefined,
      maxValue: 300,
    });
  });
  test("should return an error because weight is higher than max weight", () => {
    expect(
      getIsWeightOrHeightError(fakeTranslate as TFunction, GTETourQuestionId.WEIGHT, "601", "lb")
    ).toEqual({
      isWeightOrHeightError: true,
      customErrorMessage: "Input value must be lower than {maxValue}",
      maxValue: 600,
    });
  });
  test("should not return an error because weight is not higher than max weight", () => {
    expect(
      getIsWeightOrHeightError(fakeTranslate as TFunction, GTETourQuestionId.WEIGHT, "599", "lb")
    ).toEqual({
      isWeightOrHeightError: false,
      customErrorMessage: undefined,
      maxValue: 600,
    });
  });
  test("should return an error because height is higher than max height", () => {
    expect(
      getIsWeightOrHeightError(fakeTranslate as TFunction, GTETourQuestionId.HEIGHT, "250", "cm")
    ).toEqual({
      isWeightOrHeightError: true,
      customErrorMessage: "Input value must be lower than {maxValue}",
      maxValue: 250,
    });
  });
  test("should not return an error because height is not higher than max height", () => {
    expect(
      getIsWeightOrHeightError(fakeTranslate as TFunction, GTETourQuestionId.HEIGHT, "249", "cm")
    ).toEqual({
      isWeightOrHeightError: false,
      customErrorMessage: undefined,
      maxValue: 250,
    });
  });
  test("should return an error because height is higher than max height", () => {
    expect(
      getIsWeightOrHeightError(fakeTranslate as TFunction, GTETourQuestionId.HEIGHT, "9", "ft")
    ).toEqual({
      isWeightOrHeightError: true,
      customErrorMessage: "Input value must be lower than {maxValue}",
      maxValue: 8,
    });
  });
  test("should not return an error because height is not higher than max height", () => {
    expect(
      getIsWeightOrHeightError(fakeTranslate as TFunction, GTETourQuestionId.HEIGHT, "7.2", "ft")
    ).toEqual({
      isWeightOrHeightError: false,
      customErrorMessage: undefined,
      maxValue: 8,
    });
  });
});

describe("getTravelerPassportExpiryError", () => {
  const year = "2022";
  const month = "04";
  test("returns erorr when passport date has expired before tour travel date", () => {
    const passportExpiryDate = {
      year,
      month,
      day: "09",
    };
    const travelDate = new Date(`${year}-${month}-10`);

    expect(getTravelerPassportExpiryError({ passportExpiryDate, travelDate })).toEqual(
      "the passport is expired"
    );

    expect(
      getTravelerPassportExpiryError({
        passportExpiryDate,
        travelDate,
        t: fakeTranslate as TFunction,
      })
    ).toEqual("the passport is expired");
  });

  test("does not return erorr when passport date expires on tour travel date", () => {
    const passportExpiryDate = {
      year,
      month,
      day: "09",
    };
    const travelDate = new Date(`${year}-${month}-09`);

    expect(getTravelerPassportExpiryError({ passportExpiryDate, travelDate })).toBeUndefined();
  });
});
