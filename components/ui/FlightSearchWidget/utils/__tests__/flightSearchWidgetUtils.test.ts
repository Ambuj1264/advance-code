import { addDays } from "date-fns";
import { advanceTo, clear } from "jest-date-mock";

import {
  canIncrementPassengers,
  getSumOfValues,
  getReturnDates,
  getDepartureDates,
  canDecrementPassengers,
  getInitialSelectedDates,
} from "../flightSearchWidgetUtils";

describe("canIncrementPassengers", () => {
  const passengers = {
    adults: 2,
    children: 1,
    infants: 1,
  };
  const passengers2 = {
    adults: 4,
    children: 3,
    infants: 2,
  };
  test("cannot add more infants because there cannot be more infants than adults", () => {
    expect(canIncrementPassengers(2, passengers, "infants", 4)).toEqual(false);
  });
  test("carn add more infants because there are less infants than adults", () => {
    expect(canIncrementPassengers(1, passengers, "infants", 4)).toEqual(true);
  });
  test("cannot add more adults because the total count of passengers cannot be more than 9", () => {
    expect(canIncrementPassengers(3, passengers2, "adults", 9)).toEqual(false);
  });
  test("can add adult because total count of passengers is less than 9", () => {
    expect(canIncrementPassengers(2, passengers, "adults", 4)).toEqual(true);
  });
});

describe("getSumOfValues", () => {
  const passengers = {
    adults: 2,
    children: 1,
    infants: 1,
  };

  test("get passenger sum", () => {
    expect(getSumOfValues(passengers)).toEqual(4);
  });
});

describe("getReturnDates", () => {
  const today = new Date();
  const returnDates = {
    from: addDays(today, 3),
    to: addDays(today, 6),
  };
  test("change return from dates because departure dates selected are later than previous selected return from date", () => {
    const departureDates = {
      from: addDays(today, 2),
      to: addDays(today, 5),
    };
    expect(getReturnDates(departureDates, returnDates)).toEqual({
      from: addDays(today, 3),
      to: addDays(today, 6),
    });
  });
  test("change return dates because both departure dates are later than return dates, so return date should have from date same as departure to date", () => {
    const departureDates = {
      from: addDays(today, 6),
      to: addDays(today, 8),
    };
    expect(getReturnDates(departureDates, returnDates)).toEqual({
      from: undefined,
      to: undefined,
    });
  });
  test("change return dates because departure to date is later than return to date, so return date should have from date same as departure to date", () => {
    const departureDates = {
      from: addDays(today, 5),
      to: addDays(today, 7),
    };
    expect(getReturnDates(departureDates, returnDates)).toEqual({
      from: undefined,
      to: undefined,
    });
  });
  test("both departure dates are earlier than return dates so no change made to return dates", () => {
    const departureDates = {
      from: today,
      to: addDays(today, 2),
    };
    expect(getReturnDates(departureDates, returnDates)).toEqual(returnDates);
  });
});

describe("getDepartureDates", () => {
  const today = new Date();
  const departureDates = {
    from: addDays(today, 3),
    to: addDays(today, 6),
  };
  test("both return from date is earlier than both departure dates, so departure from date should be the same as return from date", () => {
    const returnDates = {
      from: addDays(today, 2),
      to: addDays(today, 5),
    };
    expect(getDepartureDates(departureDates, returnDates)).toEqual({
      from: addDays(today, 2),
      to: undefined,
    });
  });
  test("return from date is earlier than departure to date, so departure to date should be the same as return from date", () => {
    const returnDates = {
      from: addDays(today, 4),
      to: addDays(today, 5),
    };
    expect(getDepartureDates(departureDates, returnDates)).toEqual({
      from: addDays(today, 3),
      to: addDays(today, 6),
    });
  });
  test("both return dates are later than departure dates so no change made to departure dates", () => {
    const returnDates = {
      from: addDays(today, 6),
      to: addDays(today, 8),
    };
    expect(getDepartureDates(departureDates, returnDates)).toEqual(departureDates);
  });
});

describe("canDecrementPassengers", () => {
  const passengers = {
    adults: 2,
    children: 1,
    infants: 1,
  };
  const passengers2 = {
    adults: 4,
    children: 1,
    infants: 4,
  };
  test("can decrement infants because you can always remove infant", () => {
    expect(canDecrementPassengers(1, "infants", 0, passengers)).toEqual(true);
  });
  test("can decrement children because you can always remove child", () => {
    expect(canDecrementPassengers(1, "children", 0, passengers)).toEqual(true);
  });
  test("cannot remove adult, because adults can not be fewer than infants", () => {
    expect(canDecrementPassengers(4, "adults", 1, passengers2)).toEqual(false);
  });
});

describe("getInitialSelectedDates", () => {
  beforeEach(() => {
    const mockToday = "2022-04-21T10:55:00.000Z";
    advanceTo(mockToday);
  });
  afterEach(() => {
    clear();
  });
  it("returns unset dates for 'past' travel period", () => {
    expect(getInitialSelectedDates("2022-04-20", "2022-04-23")).toEqual({
      from: undefined,
      to: undefined,
    });
  });
  it("returns dateFrom/dateTo for 'today' travel period", () => {
    expect(getInitialSelectedDates("2022-04-21", "2022-04-23")).toEqual({
      from: new Date("2022-04-21T00:00:00.000Z"),
      to: new Date("2022-04-23T00:00:00.000Z"),
    });
  });
  it("returns dateFrom/dateTo for 'future' travel period", () => {
    expect(getInitialSelectedDates("2022-04-22", "2022-04-23")).toEqual({
      from: new Date("2022-04-22T00:00:00.000Z"),
      to: new Date("2022-04-23T00:00:00.000Z"),
    });
  });

  it("returns dateFrom with empty dateTo for the selected travel period without end date", () => {
    expect(getInitialSelectedDates("2022-04-22", undefined)).toEqual({
      from: new Date("2022-04-22T00:00:00.000Z"),
      to: undefined,
    });
  });
});
