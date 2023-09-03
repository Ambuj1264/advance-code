import { doesTourTimeClashWithOtherTour, getPreselectedTourTime } from "./vpToursUtils";

describe("doesTourTimeClashWithOtherTour", () => {
  test("should return false because tours do not overlap", () => {
    expect(doesTourTimeClashWithOtherTour("09:00", 120, "12:00", 120)).toEqual(false);
  });
  test("should return true because tours do overlap", () => {
    expect(doesTourTimeClashWithOtherTour("10:00", 120, "12:00", 120)).toEqual(true);
  });
  test("should return false because tours do not overlap", () => {
    expect(doesTourTimeClashWithOtherTour("12:00", 120, "09:00", 120)).toEqual(false);
  });
  test("should return true because tours do overlap", () => {
    expect(doesTourTimeClashWithOtherTour("12:00", 120, "10:00", 120)).toEqual(true);
  });
});

describe("getPreselectedTourTime", () => {
  const commonTourTime = {
    available: true,
    unavailableReason: "",
    totalPrice: 123,
  };

  const commonTourProduct = {
    day: 2,
    productId: "GHI346F",
    optionCode: "FHI34FG",
    optionName: "",
    numberOfTravelers: 2,
  };

  const selectedTours = [
    {
      ...commonTourProduct,
      startTime: "09:00",
      durationInMinutes: 120,
    },
    {
      ...commonTourProduct,
      startTime: "16:00",
      durationInMinutes: 120,
    },
  ];

  const tourOption = {
    optionCode: "GSJ236",
    name: "",
    description: "",
    times: [
      {
        ...commonTourTime,
        startTime: "10:00",
      },
      {
        ...commonTourTime,
        startTime: "11:00",
      },
      {
        ...commonTourTime,
        startTime: "12:00",
      },
      {
        ...commonTourTime,
        startTime: "13:00",
      },
    ],
    guidedLanguages: [],
  };

  test("should return a tour option with selected time that does not overlap with previously selected tours", () => {
    expect(getPreselectedTourTime(selectedTours, tourOption, 2, 120)).toEqual({
      ...tourOption,
      times: [
        {
          ...commonTourTime,
          startTime: "10:00",
          isSelected: false,
        },
        {
          ...commonTourTime,
          startTime: "11:00",
          isSelected: false,
        },
        {
          ...commonTourTime,
          startTime: "12:00",
          isSelected: true,
        },
        {
          ...commonTourTime,
          startTime: "13:00",
          isSelected: false,
        },
      ],
    });
  });
});
