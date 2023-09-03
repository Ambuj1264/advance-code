import { parseTime } from "./mobileTimePickerUtils";

describe("parseTime", () => {
  const stepMinutes = 30;

  it("should parse string and return object with an hour and minute as numbers", () => {
    expect(parseTime("10:30", stepMinutes, false)).toEqual({
      hour: 10,
      minute: 30,
    });
  });

  it("should work with unexpected string", () => {
    expect(parseTime("abc", stepMinutes, false)).toEqual({
      hour: 0,
      minute: 0,
    });
  });

  it("should return closest expected time if useClosestStep is used ", () => {
    expect(parseTime("10:16", stepMinutes, true)).toEqual({
      hour: 10,
      minute: 30,
    });
    expect(parseTime("10:14", stepMinutes, true)).toEqual({
      hour: 10,
      minute: 0,
    });
  });

  it("should translate hour when closest minute points to next hour", () => {
    expect(parseTime("10:50", stepMinutes, true)).toEqual({
      hour: 11,
      minute: 0,
    });
  });

  it("should return closest expected time if minHour from availableTime is used", () => {
    const availableTime = {
      minHour: 14,
    };
    expect(parseTime("10:50", stepMinutes, true, availableTime)).toEqual({
      hour: 14,
      minute: 0,
    });
  });

  it("should return closest expected time if maxHour from availableTime is used", () => {
    const availableTime = {
      maxHour: 10,
    };
    expect(parseTime("10:50", stepMinutes, true, availableTime)).toEqual({
      hour: 10,
      minute: 0,
    });
  });
});
