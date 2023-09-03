import {
  convertAlternateQuerySSRTour,
  convertAlternateQueryClientTour,
  arrayQueryParam,
} from "../typeConversionUtils";
import { mockQueryProductProps0, mockQueryProductSpecs0 } from "../mockData/mockGlobalData";

const mockAlternateQueryTour0: SharedTypes.QueryTourAlternate = {
  id: 11,
  name: "mock-name",
  description: "mock-description",
  linkUrl: "mock-link",
  averageRating: "4.1",
  reviewsCount: 12,
  basePrice: 123,
  price: {
    display_price: "12,345",
  },
  ssrPrice: {
    display_price: "11,222",
  },
  image: {
    id: 123,
    url: "mock-imageUrl",
    alt: "1337",
  },
  banner: {
    text: "mock-banner-text",
  },

  specs: mockQueryProductSpecs0,
  props: mockQueryProductProps0,
};

const mockQueryTour0: SharedTypes.QueryTour = {
  id: 11,
  name: "mock-name",
  description: "mock-description",
  linkUrl: "mock-link",
  averageRating: "4.1",
  reviewsCount: 12,
  basePrice: 123,
  price: 12345,
  ssrPrice: 11222,
  image: {
    id: 123,
    url: "mock-imageUrl",
    alt: "1337",
  },
  banner: {
    text: "mock-banner-text",
  },

  specs: mockQueryProductSpecs0,
  props: mockQueryProductProps0,
};

describe("convertAlternateQuerySSRTour", () => {
  it("should correctly convert from a QueryTourAlternate to a QueryTour", () => {
    expect(convertAlternateQuerySSRTour(mockAlternateQueryTour0)).toEqual(mockQueryTour0);
  });
});

describe("convertAlternateQueryClientTour", () => {
  it("should correctly convert from a QueryClientTourAlternate to a TourClientData", () => {
    expect(
      convertAlternateQueryClientTour({
        id: 11,
        banner: {
          text: "mock-banner-text",
        },
        price: {
          display_price: "12,345",
        },
        basePrice: 111,
      })
    ).toEqual({
      id: 11,
      banner: {
        text: "mock-banner-text",
      },
      price: 12345,
      basePrice: 111,
    });
  });
});

describe("arrayQueryParam", () => {
  const stringParam = "123";
  const arrayParam = ["1", "2", "3"];

  it("should convert string values to an array", () => {
    const result = arrayQueryParam(stringParam);
    expect(result).toEqual(["123"]);
  });

  it("should return array if array is given", () => {
    const result = arrayQueryParam(arrayParam);
    expect(result).toEqual(arrayParam);
  });

  it("should call callback if provided", () => {
    const result = arrayQueryParam(arrayParam, Number);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should handle undefined param", () => {
    expect(arrayQueryParam()).toBe(undefined);
  });

  it("should respect falsy values", () => {
    expect(arrayQueryParam("")).toEqual([""]);
    expect(arrayQueryParam("0")).toEqual(["0"]);
  });
});
