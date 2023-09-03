import {
  guestsInRooms,
  getPrefilledCategoryIdFromSlug,
  areButtonFilterItemsOnAccommodations,
  areCheckboxFitlerItemsOnAccommodations,
  constructSearchHotel,
  sortAccommodationSearchResults,
} from "../accommodationSearchUtils";

import {
  byPriceConstructor,
  byPriceDescConstructor,
  byRating,
  byPopularityConstructor,
} from "components/ui/Sort/sortUtils";
import { mockProductProps0, mockProductSpecs0 } from "utils/mockData/mockGlobalData";
import {
  mockQuerySearchAccommodation0,
  mockQuerySearchAccommodation1,
  mockSearchAccommodationProduct1,
  mockSearchAccommodationProduct2,
  mockSearchAccommodationProduct3,
} from "components/features/Accommodation/utils/mockAccommodationData";

export const mockSearchAccommodationProduct0 = {
  amenityIds: [7061, 7064, 7069, 7099, 7111, 7114, 7145, 7158, 7168],
  averageRating: 4.1,
  categoryId: 1,
  description:
    "The hotel is perfectly situated for enjoying all that Reykjavik has to offer, on the Ingólfstorg Square in the heart of the old city. Stay right next to numerous restaurants, shopping and nightlife. The largest tourist information centre is next door. The National Theatre, galleries and museums are ...",
  headline: "CenterHotel Plaza",
  city: "Reykjavik",
  id: 1226,
  image: {
    alt: "CenterHotel Plaza",
    id: "649923",
    name: "CenterHotel Plaza",
    url: "https://guidetoiceland.imgix.net/649923/x/0/102331057-jpg",
  },
  linkUrl: "/accommodation/iceland-hotels-reykjavik/center-hotels-plaza",
  popularity: 610,
  searchBoost: 2,
  price: undefined,
  props: [
    {
      Icon: expect.any(Object),
      title: "Conditional cancellation",
    },
    {
      Icon: expect.any(Object),
      title: "24/7 customer support",
    },
    {
      Icon: expect.any(Object),
      title: "Best price guarantee",
    },
    {
      Icon: expect.any(Object),
      title: "Instant confirmation",
    },
    {
      Icon: expect.any(Object),
      title: "Free parking",
    },
  ],
  reviewsCount: 880,
  specs: [
    {
      Icon: expect.any(Object),
      name: "Category",
      value: "3 Star Hotel",
    },
    {
      Icon: expect.any(Object),
      name: "Location",
      value: "Aðalstræti 4 101, Reykjavík, Iceland",
    },
    {
      Icon: expect.any(Object),
      name: "Breakfast",
      value: "Available",
    },
    {
      Icon: expect.any(Object),
      name: "Check-in & out",
      value: "14:00; 12:00",
    },
  ],
  stars: 3,
  ssrPrice: 90742,
  isAvailable: true,
  isHighlight: true,
};

const mockSearchProduct: SharedTypes.Product = {
  id: 11,
  headline: "mock-name",
  description: "mock-description",
  linkUrl: "mock-link",
  averageRating: 4.1,
  popularity: 3,
  reviewsCount: 12,
  price: 13,
  ssrPrice: 13,
  image: {
    id: "mock-imageUrl",
    url: "mock-imageUrl",
    name: "1337",
  },
  ribbonLabelText: "mock-banner-text",

  specs: mockProductSpecs0,
  props: mockProductProps0,
};

describe("byPrice", () => {
  it("should return 1 because a has higher price than b", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, price: 5 };
    expect(byPriceConstructor("price")(a, b)).toEqual(1);
  });
  it("should return -1 because b has higher price than a", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, price: 20 };
    expect(byPriceConstructor("price")(a, b)).toEqual(-1);
  });
  it("should return -1 because b has the same price as a", () => {
    const a = mockSearchProduct;
    const b = mockSearchProduct;
    expect(byPriceConstructor("price")(a, b)).toEqual(-1);
  });
});

describe("byPriceDesc", () => {
  it("should return 1 because a has lower price than b", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, price: 20 };
    expect(byPriceDescConstructor("price")(a, b)).toEqual(1);
  });
  it("should return -1 because b has lower price than a", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, price: 5 };
    expect(byPriceDescConstructor("price")(a, b)).toEqual(-1);
  });
  it("should return -1 because b has the same price as a", () => {
    const a = mockSearchProduct;
    const b = mockSearchProduct;
    expect(byPriceDescConstructor("price")(a, b)).toEqual(-1);
  });
});

describe("byRating", () => {
  it("should return -1 because a has higher rating than b", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, averageRating: 1.0 };
    expect(byRating(a, b)).toEqual(-1);
  });
  it("should return 1 because b has higher rating than a", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, averageRating: 5.0 };
    expect(byRating(a, b)).toEqual(1);
  });
  it("should return 1 because b has the same rating as a", () => {
    const a = mockSearchProduct;
    const b = mockSearchProduct;
    expect(byRating(a, b)).toEqual(1);
  });
});

describe("byPopularity", () => {
  it("should return 1 because a has higher popularity than b", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, popularity: 1.0 };
    expect(byPopularityConstructor("popularity")(a, b)).toEqual(1);
  });
  it("should return -1 because b has higher popularity than a", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, popularity: 5.0 };
    expect(byPopularityConstructor("popularity")(a, b)).toEqual(-1);
  });
  it("should return -1 because b has the same popularity as a", () => {
    const a = mockSearchProduct;
    const b = mockSearchProduct;
    expect(byPopularityConstructor("popularity")(a, b)).toEqual(-1);
  });
});

describe("guestsInRooms", () => {
  const result1 = [
    {
      adults: 2,
      children: 0,
    },
  ];
  const result2 = [
    {
      adults: 1,
      children: 1,
    },
    {
      adults: 1,
      children: 1,
    },
    {
      adults: 1,
      children: 0,
    },
  ];
  const result3 = [
    {
      adults: 1,
      children: 1,
    },
    {
      adults: 1,
      children: 0,
    },
  ];
  it("should return 1 room with 2 adults", () => {
    expect(guestsInRooms({ adults: 2, children: undefined, rooms: 1 })).toEqual(result1);
  });
  it("should return 1 adult in each room and 1 child in all but last room", () => {
    expect(guestsInRooms({ adults: 3, children: [9, 12], rooms: 3 })).toEqual(result2);
  });
  it("should return 2 rooms instead of 3 because there are not enough adults to fill all 3 rooms", () => {
    expect(guestsInRooms({ adults: 2, children: [9], rooms: 3 })).toEqual(result3);
  });
});

describe("getPrefilledCategoryIdFromSlug", () => {
  it("should return undefined if auto filter is null", () => {
    expect(getPrefilledCategoryIdFromSlug(null)).toEqual(undefined);
  });
  it("should return undefined if auto filter is not json", () => {
    expect(getPrefilledCategoryIdFromSlug("crazy1337")).toEqual(undefined);
  });
  it("should return undefined is auto filter is json but no category id", () => {
    expect(
      getPrefilledCategoryIdFromSlug(
        '{"country":"iceland","place_id":"ChIJczDc_E0C00gRruQdiBFwSGU","distance":300}'
      )
    ).toEqual(undefined);
  });
  it("should return correct categoryId", () => {
    expect(
      getPrefilledCategoryIdFromSlug(
        '{"category_ids":1,"country":"iceland","place_id":"ChIJczDc_E0C00gRruQdiBFwSGU","distance":300}'
      )
    ).toEqual(1);
  });
});

describe("areButtonFilterItemsOnAccommodations", () => {
  const queryItems1 = [123, 456, 789];
  it("should return true because queryParams include item", () => {
    expect(areButtonFilterItemsOnAccommodations(123, queryItems1)).toEqual(true);
  });
  it("should return false because queryParams do not include item", () => {
    expect(areButtonFilterItemsOnAccommodations(234, queryItems1)).toEqual(false);
  });
  it("should return true because there are no query params", () => {
    expect(areButtonFilterItemsOnAccommodations(123, undefined)).toEqual(true);
  });
});

describe("areCheckboxFitlerItemsOnAccommodations", () => {
  const queryItems1 = [123, 456, 789];
  it("should return true because all queryParams apply for accommodation", () => {
    expect(areCheckboxFitlerItemsOnAccommodations(queryItems1, [123, 234, 345, 456, 789])).toEqual(
      true
    );
  });
  it("should return false because not all query params apply for accommodation", () => {
    expect(areCheckboxFitlerItemsOnAccommodations(queryItems1, [123, 234, 345, 456])).toEqual(
      false
    );
  });
  it("should return true because there are no query params", () => {
    expect(areCheckboxFitlerItemsOnAccommodations([], [123, 234, 456])).toEqual(true);
  });
});

describe("constructSearchHotel", () => {
  it("should correctly construct accommodation object", () => {
    expect(constructSearchHotel(mockQuerySearchAccommodation0)).toEqual(
      mockSearchAccommodationProduct0
    );

    expect(constructSearchHotel(mockQuerySearchAccommodation1)).toEqual(
      mockSearchAccommodationProduct1
    );
  });
});

describe("sortAccommodationSearchResults", () => {
  it("should correctly sort accommodation results with default parameters", () => {
    expect(
      sortAccommodationSearchResults([
        // @ts-ignore
        mockSearchAccommodationProduct0,
        mockSearchAccommodationProduct1,
        mockSearchAccommodationProduct2,
        mockSearchAccommodationProduct3,
      ])
    ).toEqual([
      mockSearchAccommodationProduct0,
      mockSearchAccommodationProduct2,
      mockSearchAccommodationProduct1,
      mockSearchAccommodationProduct3,
    ]);
  });

  it("should correctly sort accommodation results with highlighted accommodations", () => {
    expect(
      sortAccommodationSearchResults([
        mockSearchAccommodationProduct2,
        mockSearchAccommodationProduct1,
        // @ts-ignore
        mockSearchAccommodationProduct0,
        mockSearchAccommodationProduct3,
      ])
    ).toEqual([
      mockSearchAccommodationProduct0,
      mockSearchAccommodationProduct2,
      mockSearchAccommodationProduct1,
      mockSearchAccommodationProduct3,
    ]);
  });
});
