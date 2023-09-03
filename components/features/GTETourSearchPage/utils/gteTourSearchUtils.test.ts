import {
  filterQuickfactValues,
  getGTETourQueryParams,
  constructGTETourSearchResults,
} from "./gteTourSearchUtils";

const fakeTranslate = (value: string) => value;

describe("filterQuickfactValues", () => {
  test("should return quickfactValues without empty values", () => {
    expect(
      filterQuickfactValues({
        minimumAge: 0,
        difficulty: "Easy",
        duration: "30 minutes",
      })
    ).toEqual({
      difficulty: "Easy",
      duration: "30 minutes",
    });
  });
});

describe("getGTETourQueryParams", () => {
  test("should return query params for tour product page when coming from search results", () => {
    expect(getGTETourQueryParams(2, 1, [12], "2022-07-12")).toEqual(
      "?adults=2&children=1&childrenAges=12&dateFrom=2022-07-12"
    );
  });
});

describe("constructGTETourSearchResults", () => {
  const queryTour1 = {
    id: 12,
    name: "",
    linkUrl:
      "/greece/best-tours-and-tickets/details/private-helicopter-transfer-from-mykonos-to-athens",
    description: "",
    image: {
      id: "15fvs",
      handle: "25u02349125hngoe",
    },
    reviewScore: 4.5,
    reviewCount: 324,
    likelyToSellOut: false,
    price: 123,
    durationInMinutes: 123,
    valuePropsList: {
      valueProps: [],
    },
    quickFactVariables: {},
    quickFactList: {
      quickfacts: [],
    },
    productCode: "fj239",
  };
  const queryTour2 = {
    id: 14,
    name: "",
    linkUrl:
      "/italy/best-tours-and-tickets/details/enjoy-the-perfect-knowledge-and-the-perfect-smile",
    description: "",
    image: {
      id: "1vhw9w052",
      handle: "vj23rfh9235h",
    },
    reviewScore: 4,
    reviewCount: 234,
    likelyToSellOut: false,
    price: 235,
    durationInMinutes: 50,
    valuePropsList: {
      valueProps: [],
    },
    quickFactVariables: {},
    quickFactList: {
      quickfacts: [],
    },
    productCode: "j9239",
  };
  const tour1 = {
    id: "fj239",
    image: {
      id: "15fvs",
      url: "https://gte-gcms.imgix.net/25u02349125hngoe",
      name: "",
    },
    linkUrl:
      "/greece/best-tours-and-tickets/details/private-helicopter-transfer-from-mykonos-to-athens?adults=2&children=1&childrenAges=12&dateFrom=2022-07-12",
    headline: "",
    description: "",
    averageRating: 4.5,
    reviewsCount: 324,
    price: 123,
    ssrPrice: 123,
    specs: [],
    props: [],
    isLikelyToSellOut: false,
  };
  const tour2 = {
    id: "j9239",
    image: {
      id: "1vhw9w052",
      url: "https://gte-gcms.imgix.net/vj23rfh9235h",
      name: "",
    },
    linkUrl:
      "/italy/best-tours-and-tickets/details/enjoy-the-perfect-knowledge-and-the-perfect-smile?adults=2&children=1&childrenAges=12&dateFrom=2022-07-12",
    headline: "",
    description: "",
    averageRating: 4,
    reviewsCount: 234,
    price: 235,
    ssrPrice: 235,
    specs: [],
    props: [],
    isLikelyToSellOut: false,
  };
  test("should return correctly constructed tour products for search result", () => {
    expect(
      constructGTETourSearchResults(
        [queryTour1, queryTour2],
        fakeTranslate as TFunction,
        "?adults=2&children=1&childrenAges=12&dateFrom=2022-07-12"
      )
    ).toEqual([tour1, tour2]);
  });
});
