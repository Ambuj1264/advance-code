import {
  constructAttractions,
  constructSimilarStays,
  constructReviews,
  getStaySearchUrl,
} from "./stayUtils";

import {
  StaySearchBreakfastAvailabilities,
  StaySearchGTEValueProp,
} from "components/features/StaysSearch/types/staysSearchEnums";
import { PageType, ThemeColor, TravelStopType } from "types/enums";
import { gteImgixUrl } from "utils/imageUtils";
import { fakeTranslateWithValues, NotImportantIconMock } from "utils/testUtils";

const fakeTranslate = (value: string) => value;

describe("constructAttractions", () => {
  const sharedAttraction = {
    description: "this is a description",
    location: {
      latitude: 64.922772,
      longitude: -18.257224,
      distance: 1234,
    },
    type: "City",
    region: "Northern Norway",
    timezone: "GMT",
    size: "38154.6",
    population: 213,
    language: "Norwegian",
    lifeExpectancy: "73",
    yearlyVisitors: 123,
    website: "www.example.com",
    elevationAboveSea: "40",
    quickfactsList: {
      quickfacts: [],
    },
  };
  const attraction1 = {
    id: "2",
    title: "Hallgrímskirkja",
    mainImage: {
      id: "23",
      caption: "hallgrimskirkja",
      handle: "adjgl235zs",
    },
    reviewScore: 4,
    reviewCount: 123,
    ...sharedAttraction,
  };
  const attraction2 = {
    id: "3",
    title: "Gullfoss",
    mainImage: {
      id: "24",
      caption: "gullfoss",
      handle: "gkp235jog",
    },
    reviewScore: 4.5,
    reviewCount: 234,
    ...sharedAttraction,
  };
  const result = [
    {
      info: {
        id: "2",
        title: "Hallgrímskirkja",
        subtitle: "{distance} km",
        description: "this is a description",
        isClickable: true,
        image: {
          id: "23",
          name: "hallgrimskirkja",
          url: `${gteImgixUrl}/adjgl235zs`,
        },
      },
      type: TravelStopType.ATTRACTION,
      productSpecs: [],
    },
    {
      info: {
        id: "3",
        title: "Gullfoss",
        subtitle: "{distance} km",
        description: "this is a description",
        isClickable: true,
        image: {
          id: "24",
          name: "gullfoss",
          url: `${gteImgixUrl}/gkp235jog`,
        },
      },
      type: TravelStopType.ATTRACTION,
      productSpecs: [],
    },
  ];
  test("should return correctly constructed attractions", () => {
    expect(constructAttractions([attraction1, attraction2], fakeTranslate as TFunction)).toEqual(
      result
    );
  });
});

describe("constructSimilarStays", () => {
  const commonCard = {
    image: {
      id: "handleId",
      handle: "handleId",
      caption: "hotel image",
    },
    userRatingAverage: 4.7,
    userRatingsTotal: 10839,
    valueProps: [StaySearchGTEValueProp.SUPPORT24_HOURS],
    quickfacts: {
      breakfast: StaySearchBreakfastAvailabilities.BREAKFAST_AVAILABLE,
      timeOfCheckIn: "13:45:00",
    },
  };
  const card1 = {
    ...commonCard,
    name: "Hyatt Paris Madeleine Hotel",
    price: {
      price: 10001.89,
      currency: "USD",
      priceDisplayValue: "10,001.89",
      defaultPrice: 1000,
    },
    id: 12345,
    productPageUrl: "/france/best-hotels-and-places-to-stay/details/hyatt-paris-madeleine-hotel",
  };
  const card2 = {
    ...commonCard,
    name: "Radison Blue Paris Hotel",
    price: {
      price: 1012,
      currency: "USD",
      priceDisplayValue: "1012",
      defaultPrice: 1000,
    },
    id: 34567,
    productPageUrl: "/france/best-hotels-and-places-to-stay/details/radison-blue-paris-hotel",
  };
  const commonResultCard = {
    productProps: [
      {
        Icon: NotImportantIconMock,
        title: "label:24/7 customer support, options:undefined",
      },
    ],
    productSpecs: [
      {
        Icon: NotImportantIconMock,
        name: "label:Check-in, options:undefined",
        value: "13:45",
      },
      {
        Icon: NotImportantIconMock,
        name: "label:Breakfast, options:undefined",
        value: "label:Available, options:undefined",
      },
    ],
    currency: "USD",
  };
  const result = [
    {
      ...commonResultCard,
      id: "12345",
      name: "Hyatt Paris Madeleine Hotel",
      linkUrl:
        "/france/best-hotels-and-places-to-stay/details/hyatt-paris-madeleine-hotel?dateFrom=2020-01-01&dateTo=2020-01-10&occupancies=2",
      clientRoute: {
        route: `/${PageType.GTE_STAY}`,
        as: "/france/best-hotels-and-places-to-stay/details/hyatt-paris-madeleine-hotel?dateFrom=2020-01-01&dateTo=2020-01-10&occupancies=2",
      },
      lowestPrice: 10001.89,
      lowestPriceDisplayValue: "10,001.89",
      image: {
        id: "handleId",
        name: "Hyatt Paris Madeleine Hotel",
        url: "https://gte-gcms.imgix.net/handleId",
      },
      review: {
        totalCount: 10839,
        totalScore: 4.7,
      },
    },
    {
      ...commonResultCard,
      id: "34567",
      name: "Radison Blue Paris Hotel",
      linkUrl:
        "/france/best-hotels-and-places-to-stay/details/radison-blue-paris-hotel?dateFrom=2020-01-01&dateTo=2020-01-10&occupancies=2",
      clientRoute: {
        route: `/${PageType.GTE_STAY}`,
        as: "/france/best-hotels-and-places-to-stay/details/radison-blue-paris-hotel?dateFrom=2020-01-01&dateTo=2020-01-10&occupancies=2",
      },
      lowestPrice: 1012,
      lowestPriceDisplayValue: "1012",
      image: {
        id: "handleId",
        name: "Radison Blue Paris Hotel",
        url: "https://gte-gcms.imgix.net/handleId",
      },
      review: {
        totalCount: 10839,
        totalScore: 4.7,
      },
    },
  ];
  test("should return correctly constructed similarProducts", () => {
    expect(
      constructSimilarStays({
        cards: [card1, card2],
        occupancies: [
          {
            numberOfAdults: 2,
            childrenAges: [],
          },
        ],
        dateFrom: "2020-01-01",
        dateTo: "2020-01-10",
        t: fakeTranslateWithValues,
      })
    ).toEqual(result);
  });
});

describe("constructReviews", () => {
  const queryReview1 = {
    authorName: "Hekla",
    language: "en",
    profilePhotoUrl: undefined,
    rating: 4,
    relativeTimeDescription: "4 months ago",
    text: "",
    time: 12,
  };
  const queryReview2 = {
    authorName: "Anna",
    language: "en",
    profilePhotoUrl: undefined,
    rating: 5,
    relativeTimeDescription: "6 months ago",
    text: "",
    time: 12,
  };
  const results = [
    {
      id: "Hekla",
      text: "",
      userName: "Hekla",
      reviewScore: 4,
      reviewScoreText: { text: "Great!", color: ThemeColor.Action },
      createdDate: "4 months ago",
      isVerified: true,
    },
    {
      id: "Anna",
      text: "",
      userName: "Anna",
      reviewScore: 5,
      reviewScoreText: { text: "Amazing!", color: ThemeColor.Action },
      createdDate: "6 months ago",
      isVerified: true,
    },
  ];
  test("should return correctly constructed similarProducts", () => {
    expect(constructReviews([queryReview1, queryReview2])).toEqual(results);
  });
});

describe("getStaySearchUrl", () => {
  const selectedDates = {
    from: new Date("2023-11-12"),
    to: new Date("2023-11-14"),
  };
  const occupancies = [
    {
      numberOfAdults: 1,
      childrenAges: [8],
    },
    {
      numberOfAdults: 1,
      childrenAges: [12],
    },
  ];
  const searchId = "svlnq23_sdhi2";
  const productId = 12345;
  const productTitle = "Hilton Hotel Paris";
  const url = "/best-hotels-and-places-to-stay";
  const result = `/best-hotels-and-places-to-stay?address=Hilton%20Hotel%20Paris&occupancies=1_8&occupancies=1_12&dateFrom=2023-11-12&dateTo=2023-11-14&id=12345&type=PRODUCT&searchId=svlnq23_sdhi2`;
  test("should return correct search url", () => {
    expect(
      getStaySearchUrl({
        searchId,
        selectedDates,
        occupancies,
        productId,
        productTitle,
        url,
      })
    ).toEqual(result);
  });
  test("should return empty string because url is missing", () => {
    expect(
      getStaySearchUrl({
        searchId,
        selectedDates,
        occupancies,
        productId,
        productTitle,
      })
    ).toEqual("");
  });
});
