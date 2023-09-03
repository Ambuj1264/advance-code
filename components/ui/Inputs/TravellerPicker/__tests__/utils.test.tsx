import { getMinMaxChildrenAges } from "../utils";

describe("getMinMaxChildrenAges", () => {
  test("should return correct min max ages for children traveler picker from teenagers and children", () => {
    expect(
      getMinMaxChildrenAges([
        {
          id: "adults",
          travelerType: "adults" as SharedTypes.TravelerType,
          defaultNumberOfTravelerType: 1,
          minAge: 16,
          maxAge: null,
        },
        {
          id: "teenagers",
          travelerType: "teenagers" as SharedTypes.TravelerType,
          defaultNumberOfTravelerType: 0,
          minAge: 13,
          maxAge: 15,
        },
        {
          id: "children",
          travelerType: "children" as SharedTypes.TravelerType,
          defaultNumberOfTravelerType: 0,
          minAge: 5,
          maxAge: 12,
        },
      ])
    ).toEqual({
      minAge: 5,
      maxAge: 15,
    });
    expect(
      getMinMaxChildrenAges([
        {
          id: "adults",
          travelerType: "adults" as SharedTypes.TravelerType,
          defaultNumberOfTravelerType: 1,
          minAge: 13,
          maxAge: null,
        },
        {
          id: "children",
          travelerType: "children" as SharedTypes.TravelerType,
          defaultNumberOfTravelerType: 0,
          minAge: 0,
          maxAge: 5,
        },
        {
          id: "teenagers",
          travelerType: "teenagers" as SharedTypes.TravelerType,
          defaultNumberOfTravelerType: 0,
          minAge: 6,
          maxAge: 12,
        },
      ])
    ).toEqual({
      minAge: 0,
      maxAge: 12,
    });
  });
  test("should return correct min max ages for children traveler picker from children ", () => {
    expect(
      getMinMaxChildrenAges([
        {
          id: "adults",
          travelerType: "adults" as SharedTypes.TravelerType,
          defaultNumberOfTravelerType: 1,
          minAge: 16,
          maxAge: null,
        },
        {
          id: "children",
          travelerType: "children" as SharedTypes.TravelerType,
          defaultNumberOfTravelerType: 0,
          minAge: 0,
          maxAge: 15,
        },
      ])
    ).toEqual({
      minAge: 0,
      maxAge: 15,
    });
  });
  test("should return correct min max ages for children traveler picker from childrens ", () => {
    expect(
      getMinMaxChildrenAges([
        {
          id: "adults",
          travelerType: "adults" as SharedTypes.TravelerType,
          defaultNumberOfTravelerType: 1,
          minAge: 16,
          maxAge: null,
        },
        {
          id: "teenagers",
          travelerType: "teenagers" as SharedTypes.TravelerType,
          defaultNumberOfTravelerType: 0,
          minAge: 0,
          maxAge: 15,
        },
      ])
    ).toEqual({
      minAge: 0,
      maxAge: 15,
    });
  });
  test("should return correct min max ages for children traveler picker", () => {
    expect(getMinMaxChildrenAges()).toEqual({
      minAge: undefined,
      maxAge: undefined,
    });
    expect(getMinMaxChildrenAges([])).toEqual({
      minAge: undefined,
      maxAge: undefined,
    });
  });
});
