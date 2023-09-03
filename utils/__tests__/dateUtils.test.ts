import { parseISO } from "date-fns";

import {
  dayMonthYearWithTimeFormat,
  getFormattedDate,
  fromUnixTimestamp,
  toDateWithoutTimezone,
  convertDateStringIntoTimezoneAgnosticDate,
  hourMinuteFormat,
  removeSecondsFromTimeString,
  constructSameDateInUTC,
  getDateStringFromBirthdayType,
  getBirthdayTypeFromDateString,
} from "../dateUtils";

describe("getFormattedDate", () => {
  test("should return correctly formatted date", () => {
    beforeAll(() => {
      // eslint-disable-next-line functional/immutable-data,no-extend-native
      Date.prototype.getTimezoneOffset = jest.fn(() => -180);
    });

    afterAll(() => {
      // eslint-disable-next-line functional/immutable-data,no-extend-native
      Date.prototype.getTimezoneOffset = jest.fn(() => 0);
    });

    expect(getFormattedDate(parseISO("2019-06-20 20:47:22"), dayMonthYearWithTimeFormat)).toBe(
      "20/06/2019, 20:47"
    );

    expect(getFormattedDate(parseISO("2021-10-24T16:35:00"), hourMinuteFormat)).toBe("16:35");
  });
});

describe("fromUnixTimestamp", () => {
  test("should return correct Date object", () => {
    expect(fromUnixTimestamp(1584712800)).toEqual(new Date("2020-03-20T14:00:00.000"));
  });
});

describe("toDateWithoutTimezone", () => {
  const DateReal = global.Date;
  const mockTimeZoneOffset = 120;

  // eslint-disable-next-line functional/immutable-data,no-extend-native
  Date.prototype.getTimezoneOffset = jest.fn(() => -mockTimeZoneOffset);

  jest.spyOn(global, "Date").mockImplementation(
    // @ts-ignore
    (dateOptions: string) =>
      new DateReal(
        (dateOptions ? new DateReal(dateOptions) : new DateReal()).getTime() +
          mockTimeZoneOffset * 60000
      )
  );

  test("should return correct date", () => {
    expect(toDateWithoutTimezone(new DateReal("2022-02-01T10:00:00.000Z"))).toEqual(
      new DateReal("2022-02-01T10:00:00.000Z")
    );
    expect(toDateWithoutTimezone(new Date("2022-02-01T14:30:00.000Z"))).toEqual(
      new Date("2022-02-01T14:30:00.000Z")
    );
  });

  jest.restoreAllMocks();
  // eslint-disable-next-line functional/immutable-data,no-extend-native
  Date.prototype.getTimezoneOffset = jest.fn(() => 0);
});

describe("convertDateStringIntoTimezoneAgnosticDate", () => {
  test("should return timezone agnostic date string", () => {
    expect(convertDateStringIntoTimezoneAgnosticDate("2020-03-20T14:00:00.000Z")).toEqual(
      new Date("2020-03-20T14:00:00.000Z")
    );
  });
  test("should return timezone agnostic date string", () => {
    expect(convertDateStringIntoTimezoneAgnosticDate("2020-04-13T00:00:00.000+08:00")).toEqual(
      new Date("2020-04-12T16:00:00.000Z")
    );
  });
});

describe("removeSecondsFromTimeString", () => {
  it("returns time in HH:MM if HH:MM:SS is passed", () => {
    expect(removeSecondsFromTimeString("12:00:00")).toEqual("12:00");
    expect(removeSecondsFromTimeString("12:30:00")).toEqual("12:30");
    expect(removeSecondsFromTimeString("12:30:12")).toEqual("12:30");
  });

  it("returns time in HH:MM if multiple HH:MM:SS is passed", () => {
    expect(removeSecondsFromTimeString("12:00:00 && 13:34:33")).toEqual("12:00 && 13:34");
    expect(removeSecondsFromTimeString("wake up at 06:30:12 and make coffee at 06:31")).toEqual(
      "wake up at 06:30 and make coffee at 06:31"
    );
  });

  it("does not modify HH:MM time", () => {
    expect(removeSecondsFromTimeString("12:45")).toEqual("12:45");
  });

  it("returns exiting string if no time is found", () => {
    expect(removeSecondsFromTimeString("12 AM")).toEqual("12 AM");
  });
});

describe("constructSameDateInUTC", () => {
  it("constructs the UTC date with same client date and time", () => {
    const time = "12:16:21";
    const dateString = "2023-02-13";
    const expectedUTCTime = "12:16:00";

    const date = new Date(`2023-02-13T${time}.789Z`); // UTC+2 date
    expect(constructSameDateInUTC(date).toISOString()).toEqual(
      `${dateString}T${expectedUTCTime}.000Z`
    );
  });
});

describe("getDateStringFromBirthdayType", () => {
  const birthdayObject = { day: "25", month: "2", year: "2024" } as SharedTypes.Birthdate;
  const dateString = "2024-02-25";
  const fullTimeObject = { hour: "12", minutes: "30" } as SharedTypes.TimeDropdownObject;
  const missingMinutesTimeObject = { hour: "12", minutes: "" } as SharedTypes.TimeDropdownObject;

  it("should convert a Birthday type object into a YYYY-MM-DD date string without any time", () => {
    expect(getDateStringFromBirthdayType(birthdayObject)).toEqual(dateString);
  });
  it("should add the provided time to the resulting date string in the format of YYYY-MM-DD HH:mm:ss", () => {
    const dateStringWithTime = `${dateString} ${fullTimeObject.hour}:${fullTimeObject.minutes}:00`;
    expect(getDateStringFromBirthdayType(birthdayObject, fullTimeObject)).toEqual(
      dateStringWithTime
    );
  });
  it("should add '00' to the missing minutes in the resulting YYYY-MM-DD HH:mm:ss date string", () => {
    const dateStringWithIncompleteTime = `${dateString} ${missingMinutesTimeObject.hour}:00:00`;
    expect(getDateStringFromBirthdayType(birthdayObject, missingMinutesTimeObject)).toEqual(
      dateStringWithIncompleteTime
    );
  });
});

describe("getBirthdayTypeFromDateString", () => {
  const birthdayObject = { day: "25", month: "2", year: "2025" } as SharedTypes.Birthdate;
  const ISOdateString = "2025-02-25T00:00:00.000Z";

  it("should convert an ISO8601DateTime string into a Birthday type object", () => {
    expect(getBirthdayTypeFromDateString(ISOdateString)).toEqual(birthdayObject);
  });
  it("should disregard the time substring and convert it to a Birthday type object", () => {
    const ISOdateStringWithTime = "2025-02-25T15:30:00.000Z";
    expect(getBirthdayTypeFromDateString(ISOdateStringWithTime)).toEqual(birthdayObject);
  });
  it("should return undefined as the provided string is not a valid date", () => {
    const timeStringDate = new Date("2025-02-25T15:30:00.000Z").toTimeString();
    expect(getBirthdayTypeFromDateString(timeStringDate)).toBeUndefined();
  });
});
