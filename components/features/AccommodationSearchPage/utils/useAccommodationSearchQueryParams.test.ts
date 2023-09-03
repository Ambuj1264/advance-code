import {
  encodeOccupanciesToArrayString,
  decodeOccupanciesArray,
} from "./useAccommodationSearchQueryParams";

describe("encodeOccupanciesToArrayString", () => {
  it("encodes array of occupancy as {numberOfadults}_{kidAge}-{kidAge}-...", () => {
    expect(
      encodeOccupanciesToArrayString([
        {
          numberOfAdults: 10,
          childrenAges: [1, 2, 3],
        },
      ])
    ).toEqual(["10_1-2-3"]);
  });

  it("encodes array of occupancy as {numberOfadults}_{kidAge}-{kidAge}-...", () => {
    expect(
      encodeOccupanciesToArrayString([
        {
          numberOfAdults: 5,
          childrenAges: [],
        },
      ])
    ).toEqual(["5"]);
  });

  it("returns undefined if no occupancies", () => {
    expect(encodeOccupanciesToArrayString([])).toBeUndefined();
  });
});

describe("decodeOccupanciesArray", () => {
  it("decodes occupancies encoded by encodeOccupanciesToArrayString into occupancy data structure", () => {
    expect(decodeOccupanciesArray(["10_1-2-3"])).toEqual([
      {
        numberOfAdults: 10,
        childrenAges: [1, 2, 3],
      },
    ] as StayBookingWidgetTypes.Occupancy[]);
  });

  it("decodes occupancies encoded by encodeOccupanciesToArrayString into occupancy data structure", () => {
    expect(decodeOccupanciesArray(["10_1-2-3", "1", "2_", "0_0"])).toEqual([
      {
        numberOfAdults: 10,
        childrenAges: [1, 2, 3],
      },
      {
        numberOfAdults: 1,
        childrenAges: [],
      },
      {
        numberOfAdults: 2,
        childrenAges: [],
      },
      {
        numberOfAdults: 0,
        childrenAges: [0],
      },
    ] as StayBookingWidgetTypes.Occupancy[]);
  });
});
