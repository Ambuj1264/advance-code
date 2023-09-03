import { addDays, format, parse } from "date-fns";
import { advanceTo } from "jest-date-mock";

import {
  addDayToRange,
  bothDaysSet,
  getAdjustedHourObject,
  getAdjustedTime,
  getRangePickerHoverRange,
  shouldSetInitalSelectedDates,
  getDateRangeTitle,
  normaliseDates,
  areDateIntervalsIntersectWithUnavailableDates,
  constructDaysRange,
  DateRangeEnum,
  getDatesInFuture,
} from "../datePickerUtils";

import { yearMonthDayFormat, yearMonthDayFormatWithTime } from "utils/dateUtils";
import { CarSearchTimeType } from "types/enums";

describe("addDayToRange", () => {
  test("should set the from day if no date is set", () => {
    const day = new Date();
    const selectedDates = {
      from: undefined,
      to: undefined,
    };
    expect(addDayToRange(day, selectedDates)).toEqual({
      from: day,
      to: undefined,
    });
  });
  test("should set the to day if only the from day is set", () => {
    const day = new Date();
    const from = addDays(day, -1);
    const selectedDates = {
      from,
      to: undefined,
    };
    expect(addDayToRange(day, selectedDates)).toEqual({
      from,
      to: day,
    });
  });
  test("should reset the selection and set the first day if both are set", () => {
    const day = new Date();
    const from = addDays(day, -3);
    const to = addDays(day, 5);
    const selectedDates = {
      from,
      to,
    };
    expect(addDayToRange(day, selectedDates)).toEqual({
      from: day,
      to: undefined,
    });
  });
  test("should reset from day if the day selection is before the selected from date", () => {
    const from = new Date();
    const day = addDays(from, -3);
    const to = undefined;
    const selectedDates = {
      from,
      to,
    };
    expect(addDayToRange(day, selectedDates)).toEqual({
      from: day,
      to,
    });
  });
  test("should reset from day if the day selection is the same day as the selected from date", () => {
    const day = new Date();
    const from = new Date();
    const to = undefined;
    const selectedDates = {
      from,
      to,
    };
    expect(addDayToRange(day, selectedDates)).toEqual({
      from: day,
      to,
    });
  });
});

describe("bothDaysSet", () => {
  test("should return true if both days are set", () => {
    expect(bothDaysSet({ from: new Date(), to: new Date() })).toEqual(true);
  });
  test("should return false if one day is set", () => {
    expect(bothDaysSet({ from: new Date(), to: undefined })).toEqual(false);
  });
  test("should return false if neither day is set", () => {
    expect(bothDaysSet({ from: new Date(), to: undefined })).toEqual(false);
  });
});

describe("getRangePickerHoverRange", () => {
  const today = new Date();
  test("should return hover range with only from set if both selected dates are set ", () => {
    const selectedDates = {
      from: addDays(today, 5),
      to: addDays(today, 7),
    };
    const dateMouseEntered = today;
    expect(
      getRangePickerHoverRange({
        selectedDates,
        dateMouseEntered,
      })
    ).toEqual({
      from: dateMouseEntered,
      to: undefined,
    });
  });
  test("should return hover range with only from set if only from date is selected but a date before that is hovered", () => {
    const selectedDates = {
      from: today,
      to: undefined,
    };
    const dateMouseEntered = addDays(today, -2);
    expect(
      getRangePickerHoverRange({
        selectedDates,
        dateMouseEntered,
      })
    ).toEqual({
      from: dateMouseEntered,
      to: undefined,
    });
  });
  test("should return hover range with both days set if only one day is set and the hover is after that date", () => {
    const selectedDates = {
      from: today,
      to: undefined,
    };
    const dateMouseEntered = addDays(today, 5);
    expect(
      getRangePickerHoverRange({
        selectedDates,
        dateMouseEntered,
      })
    ).toEqual({
      from: today,
      to: dateMouseEntered,
    });
  });
});

describe("shouldSetInitalSelectedDates", () => {
  const selectedDates = {
    from: parse("2019-05-07", yearMonthDayFormat, new Date()),
    to: parse("2019-05-31", yearMonthDayFormat, new Date()),
  };
  test("Should return false if from date is before min date", () => {
    const dates = {
      min: parse("2019-05-08", yearMonthDayFormat, new Date()),
      max: parse("2019-06-05", yearMonthDayFormat, new Date()),
      unavailableDates: [],
    };
    expect(shouldSetInitalSelectedDates(selectedDates, dates)).toEqual(false);
  });
  test("Should return false if to date is after max", () => {
    const dates = {
      min: parse("2019-05-05", yearMonthDayFormat, new Date()),
      max: parse("2019-05-20", yearMonthDayFormat, new Date()),
      unavailableDates: [],
    };
    expect(shouldSetInitalSelectedDates(selectedDates, dates)).toEqual(false);
  });
  test("Should return true if from to date range contains a unavailable day but it is not the from date", () => {
    const dates = {
      min: parse("2019-05-05", yearMonthDayFormat, new Date()),
      max: parse("2019-06-05", yearMonthDayFormat, new Date()),
      unavailableDates: [parse("2019-05-20", yearMonthDayFormat, new Date())],
    };
    expect(shouldSetInitalSelectedDates(selectedDates, dates)).toEqual(true);
  });
  test("Should return false if the from day is an unavailable day", () => {
    const dates = {
      min: parse("2019-05-05", yearMonthDayFormat, new Date()),
      max: parse("2019-06-05", yearMonthDayFormat, new Date()),
      unavailableDates: [
        parse("2019-05-20", yearMonthDayFormat, new Date()),
        parse("2019-05-07", yearMonthDayFormat, new Date()),
      ],
    };
    expect(shouldSetInitalSelectedDates(selectedDates, dates)).toEqual(false);
  });
  test("Should return true if the date range contains no unavailable days and is within the min max range", () => {
    const dates = {
      min: parse("2019-05-05", yearMonthDayFormat, new Date()),
      max: parse("2019-06-05", yearMonthDayFormat, new Date()),
      unavailableDates: [
        parse("2019-06-20", yearMonthDayFormat, new Date()),
        parse("2019-06-28", yearMonthDayFormat, new Date()),
      ],
    };
    expect(shouldSetInitalSelectedDates(selectedDates, dates)).toEqual(true);
  });
  describe("min=undefined", () => {
    test("Should return true when from is after max", () => {
      const dates = {
        min: undefined,
        max: parse("2019-06-05", yearMonthDayFormat, new Date()),
        unavailableDates: [],
      };
      expect(shouldSetInitalSelectedDates(selectedDates, dates)).toEqual(true);
    });
    test("Should return true if the date range contains no unavailable days and to is earlier than max", () => {
      const dates = {
        min: undefined,
        max: parse("2019-06-05", yearMonthDayFormat, new Date()),
        unavailableDates: [
          parse("2019-06-20", yearMonthDayFormat, new Date()),
          parse("2019-06-28", yearMonthDayFormat, new Date()),
        ],
      };
      expect(shouldSetInitalSelectedDates(selectedDates, dates)).toEqual(true);
    });
    test("Should return false because there are no available dates", () => {
      const dates = {
        min: undefined,
        max: undefined,
        unavailableDates: [],
      };
      expect(shouldSetInitalSelectedDates(selectedDates, dates)).toEqual(false);
    });
  });
});

describe("getAdjustedHourObject", () => {
  const selectedDates = {
    from: new Date(2020, 7, 28),
    to: new Date(2020, 7, 31),
  };
  const times = {
    pickup: { hour: 10, minute: 0 },
    dropoff: { hour: 10, minute: 0 },
  };

  test("should return the same hour", () => {
    const currentDate = new Date(2020, 7, 28, 9);
    expect(getAdjustedHourObject(selectedDates.from, times.pickup, currentDate)).toEqual({
      hour: 10,
      isNextDay: false,
    });
  });
  test("should return adjusted hour", () => {
    const currentDate = new Date(2020, 7, 28, 11);
    expect(getAdjustedHourObject(selectedDates.from, times.pickup, currentDate)).toEqual({
      hour: 13,
      isNextDay: false,
    });
  });
  test("should return adjusted hour with offset for next day", () => {
    const currentDate = new Date(2020, 7, 28, 23, 59);
    expect(getAdjustedHourObject(selectedDates.from, times.pickup, currentDate)).toEqual({
      hour: 1,
      isNextDay: true,
    });
  });
});

describe("getAdjustedTime", () => {
  const times = {
    pickup: { hour: 10, minute: 0 },
    dropoff: { hour: 10, minute: 0 },
  };

  test("should return the same pickup hour", () => {
    const selectedDates = {
      from: new Date(2020, 7, 28),
    };
    const currentDate = new Date(2020, 7, 28, 9);
    expect(getAdjustedTime(selectedDates, times, currentDate)).toEqual({
      hour: 10,
      timeType: CarSearchTimeType.PICKUP,
      isNextDay: false,
    });
  });

  test("should return the same dropoff hour", () => {
    const selectedDates = {
      to: new Date(2020, 7, 31),
    };
    const currentDate = new Date(2020, 7, 28, 9);
    expect(getAdjustedTime(selectedDates, times, currentDate)).toEqual({
      hour: 10,
      timeType: CarSearchTimeType.DROPOFF,
      isNextDay: false,
    });
  });
});

describe("getDateRangeTitle", () => {
  const startDate = "Jan 10";
  const endDate = "Jan 15";
  const defaultLabel = "Departure";
  test("should return correct date range title", () => {
    expect(getDateRangeTitle(defaultLabel, startDate, endDate)).toEqual("Jan 10 - Jan 15");
  });
  test("should return correct date range title", () => {
    expect(getDateRangeTitle(defaultLabel, startDate, undefined)).toEqual("Jan 10");
  });
  test("should return correct date range title", () => {
    expect(getDateRangeTitle(defaultLabel, undefined, undefined)).toEqual("Departure");
  });
});

describe("normaliseDates, return dates in future when input dates were in past", () => {
  const realDate = Date;
  const dateNowStub = new Date("2021-04-26");
  const mockDateFromInFuture = new Date("2021-05-15");
  const mockDateToInFuture = new Date("2021-05-18");

  beforeAll(() => {
    // @ts-ignore
    // eslint-disable-next-line functional/immutable-data
    global.Date = class extends Date {
      constructor() {
        super();
        // eslint-disable-next-line no-constructor-return
        return dateNowStub;
      }
    };
  });

  test("should return empty dates", () => {
    expect(
      normaliseDates({
        from: undefined,
        to: undefined,
      })
    ).toEqual({
      from: undefined,
      to: undefined,
    });
  });

  test("should return the same dates", () => {
    expect(
      normaliseDates({
        from: mockDateFromInFuture,
        to: mockDateToInFuture,
      })
    ).toEqual({
      from: mockDateFromInFuture,
      to: mockDateToInFuture,
    });

    expect(
      normaliseDates({
        from: mockDateFromInFuture,
        to: undefined,
      })
    ).toEqual({
      from: mockDateFromInFuture,
      to: undefined,
    });

    expect(
      normaliseDates({
        from: undefined,
        to: mockDateToInFuture,
      })
    ).toEqual({
      from: undefined,
      to: mockDateToInFuture,
    });
  });

  test("should return future dates, because input dates were in past", () => {
    const mockDateFromInPast = new Date("2021-03-15");
    const mockDateToInPast = new Date("2021-03-18");
    const normalizedMockDateFrom = new Date("2021-04-28");
    const normalizedMockDateTo = new Date("2021-05-01");

    expect(
      normaliseDates({
        from: mockDateFromInPast,
        to: mockDateToInPast,
      })
    ).toEqual({
      from: normalizedMockDateFrom,
      to: normalizedMockDateTo,
    });

    const mockDateFromInPast1 = new Date("2021-01-15");
    const mockDateToInPast1 = new Date("2021-01-25");
    const normalizedMockDateFrom1 = new Date("2021-04-28");
    const normalizedMockDateTo1 = new Date("2021-05-08");

    expect(
      normaliseDates({
        from: mockDateFromInPast1,
        to: mockDateToInPast1,
      })
    ).toEqual({
      from: normalizedMockDateFrom1,
      to: normalizedMockDateTo1,
    });

    expect(
      normaliseDates({
        from: mockDateFromInPast1,
        to: undefined,
      })
    ).toEqual({
      from: normalizedMockDateFrom1,
      to: undefined,
    });
  });

  afterAll(() => {
    // eslint-disable-next-line functional/immutable-data
    global.Date = realDate;
  });
});

describe("areDateIntervalsIntersectWithUnavailableDates", () => {
  it("returns false when no intersection", () => {
    const baseDate = new Date("2020-01-01");
    expect(
      areDateIntervalsIntersectWithUnavailableDates(
        {
          from: baseDate,
          to: addDays(baseDate, 10),
        },
        {
          unavailableDates: [],
          unavailableDatesRange: [],
          max: addDays(baseDate, 10),
        }
      )
    ).toBe(false);

    expect(
      areDateIntervalsIntersectWithUnavailableDates(
        {
          from: baseDate,
          to: addDays(baseDate, 10),
        },
        {
          unavailableDates: [addDays(baseDate, -10), addDays(baseDate, 11)],
          unavailableDatesRange: [{ from: addDays(baseDate, 11), to: addDays(baseDate, 13) }],
          max: addDays(baseDate, 100),
        }
      )
    ).toBe(false);
  });

  it("returns true when intersects with unavailableDates", () => {
    const baseDate = new Date("2020-01-01");
    expect(
      areDateIntervalsIntersectWithUnavailableDates(
        {
          from: baseDate,
          to: addDays(baseDate, 10),
        },
        {
          unavailableDates: [baseDate],
        }
      )
    ).toBe(true);

    expect(
      areDateIntervalsIntersectWithUnavailableDates(
        {
          from: baseDate,
          to: addDays(baseDate, 10),
        },
        {
          unavailableDates: [addDays(baseDate, 10)],
        }
      )
    ).toBe(true);

    expect(
      areDateIntervalsIntersectWithUnavailableDates(
        {
          from: baseDate,
          to: addDays(baseDate, 10),
        },
        {
          unavailableDates: [addDays(baseDate, -1), addDays(baseDate, 2), addDays(baseDate, 11)],
        }
      )
    ).toBe(true);
  });

  it("returns true when intersects with one of unavailableDateRanges", () => {
    const baseDate = new Date("2020-01-01");
    const dayStart = baseDate;
    const dayEnd = addDays(baseDate, 10);
    const selectedDates = { from: dayStart, to: dayEnd };

    // exact date - lower bound
    expect(
      areDateIntervalsIntersectWithUnavailableDates(selectedDates, {
        unavailableDatesRange: [{ from: selectedDates.from, to: selectedDates.from }],
        unavailableDates: [],
      })
    ).toBe(true);

    // exact date - upper bound
    expect(
      areDateIntervalsIntersectWithUnavailableDates(selectedDates, {
        unavailableDatesRange: [{ from: selectedDates.to, to: selectedDates.to }],
        unavailableDates: [],
      })
    ).toBe(true);

    // date range intersect - lower bound
    expect(
      areDateIntervalsIntersectWithUnavailableDates(selectedDates, {
        unavailableDatesRange: [{ from: addDays(selectedDates.from, -10), to: selectedDates.from }],
        unavailableDates: [],
      })
    ).toBe(true);

    // date range intersect - upper bound
    expect(
      areDateIntervalsIntersectWithUnavailableDates(selectedDates, {
        unavailableDatesRange: [{ from: selectedDates.from, to: addDays(selectedDates.from, 1) }],
        unavailableDates: [],
      })
    ).toBe(true);

    // intersect in the middle of the dates
    expect(
      areDateIntervalsIntersectWithUnavailableDates(selectedDates, {
        unavailableDatesRange: [
          {
            from: addDays(selectedDates.from, 1),
            to: addDays(selectedDates.to, -1),
          },
        ],
        unavailableDates: [],
      })
    ).toBe(true);
  });

  it("returns true when start or end date greater the max date", () => {
    const baseDate = new Date("2020-01-01");
    const dayStart = baseDate;
    const dayEnd = addDays(baseDate, 10);
    const selectedDates = { from: dayStart, to: dayEnd };

    // end date greater than max
    expect(
      areDateIntervalsIntersectWithUnavailableDates(selectedDates, {
        max: addDays(baseDate, 9),
        unavailableDates: [],
      })
    ).toBeTruthy();

    // start date greater than max
    expect(
      areDateIntervalsIntersectWithUnavailableDates(selectedDates, {
        max: addDays(baseDate, -1),
        unavailableDates: [],
      })
    ).toBeTruthy();
  });

  it("returns false when dates are within the max date range", () => {
    const baseDate = new Date("2020-01-01");
    const dayStart = baseDate;
    const dayEnd = addDays(baseDate, 10);
    const selectedDates = { from: dayStart, to: dayEnd };

    // end equals to max
    expect(
      areDateIntervalsIntersectWithUnavailableDates(selectedDates, {
        max: dayEnd,
        unavailableDates: [],
      })
    ).toBeFalsy();
  });
});

describe("constructDaysRange", () => {
  test("should return only from date since to date being selected is the same as from date and same day selection is not allowed", () => {
    expect(
      constructDaysRange(
        new Date("2022-11-04"),
        { from: new Date("2022-11-04"), to: undefined },
        DateRangeEnum.onToActive,
        true
      )
    ).toEqual({ from: new Date("2022-11-04") });
  });
  test("should return both from and to date as the same date because same day selection is allowed", () => {
    expect(
      constructDaysRange(
        new Date("2022-11-04"),
        { from: new Date("2022-11-04"), to: undefined },
        DateRangeEnum.onToActive
      )
    ).toEqual({ from: new Date("2022-11-04"), to: new Date("2022-11-04") });
  });
  test("should return only from date because from date being selected is later than selected to date", () => {
    expect(
      constructDaysRange(
        new Date("2022-11-06"),
        { from: new Date("2022-11-04"), to: new Date("2022-11-05") },
        DateRangeEnum.onFromActive
      )
    ).toEqual({ from: new Date("2022-11-06"), to: undefined });
  });
});

describe("getDatesInFuture", () => {
  const todayDateString = "2020-01-01";

  beforeEach(() => {
    advanceTo(new Date(todayDateString));
  });

  it("returns from/to dates with formatting if they're not in the past", () => {
    const dateFrom = format(addDays(new Date(todayDateString), 10), yearMonthDayFormat);
    const dateTo = format(addDays(new Date(todayDateString), 20), yearMonthDayFormat);
    expect(getDatesInFuture(dateFrom, dateTo)).toEqual({
      fromDate: "2020-01-11",
      toDate: "2020-01-21",
    });
  });

  it("when from dateFrom is in the past and  dateTo is in the future - dateFrom is replaced with tomorrow date", () => {
    const dateFrom = format(addDays(new Date(todayDateString), -1), yearMonthDayFormat);
    const dateTo = format(addDays(new Date(todayDateString), 20), yearMonthDayFormat);
    expect(getDatesInFuture(dateFrom, dateTo)).toEqual({
      fromDate: "2020-01-02",
      toDate: "2020-01-21",
    });
  });

  it("when both dateFrom/dateTo is in the  past - the dateFrom becomes tomorrow and dateTo becomes day after tomorrow", () => {
    const dateFrom = format(addDays(new Date(todayDateString), -1), yearMonthDayFormat);
    const dateTo = format(addDays(new Date(todayDateString), -10), yearMonthDayFormat);
    expect(getDatesInFuture(dateFrom, dateTo)).toEqual({
      fromDate: "2020-01-02",
      toDate: "2020-01-03",
    });
  });

  it("can returns from/to dates with time formatting", () => {
    const dateFrom = format(
      addDays(new Date(todayDateString), 10).setHours(10),
      yearMonthDayFormatWithTime
    );
    const dateTo = format(
      addDays(new Date(todayDateString), 20).setHours(12),
      yearMonthDayFormatWithTime
    );
    expect(getDatesInFuture(dateFrom, dateTo, true)).toEqual({
      fromDate: "2020-01-11 10:00",
      toDate: "2020-01-21 12:00",
    });
  });
});
