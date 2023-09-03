import {
  StaySearchBreakfastAvailabilities,
  StaySearchGTEValueProp,
} from "../types/staysSearchEnums";

import {
  constructStaysProductGTE,
  getStarRatingValues,
  getStaySearchPriceFilter,
} from "./staysSearchPageUtils";

import PriceIcon from "components/icons/cash-payment-coin.svg";
import { defaultStaySEOImage } from "components/ui/LandingPages/utils/landingPageUtils";
import { FilterType } from "types/enums";
import { fakeTranslateWithValues, NotImportantIconMock } from "utils/testUtils";

const fakeTranslate = (value: string) => value;

describe("getStaySearchPriceFilter", () => {
  const commonProduct = {
    id: 1235,
    image: defaultStaySEOImage,
    linkUrl: "",
    averageRating: 4,
    description: "",
    headline: "",
    specs: [],
    props: [],
    reviewsCount: 12,
    latitude: undefined,
    longitude: undefined,
    isAvailable: true,
    isHighlight: true,
  };
  const products = [
    {
      ...commonProduct,
      price: 120,
      ssrPrice: 120,
    },
    {
      ...commonProduct,
      price: 120,
      ssrPrice: 120,
    },
    {
      ...commonProduct,
      price: 120,
      ssrPrice: 120,
    },
    {
      ...commonProduct,
      price: 90,
      ssrPrice: 90,
    },
    {
      ...commonProduct,
      price: 350,
      ssrPrice: 350,
    },
    {
      ...commonProduct,
      price: 1200,
      ssrPrice: 1200,
    },
    {
      ...commonProduct,
      price: 125,
      ssrPrice: 125,
    },
    {
      ...commonProduct,
      price: 165,
      ssrPrice: 165,
    },
    {
      ...commonProduct,
      price: 1000,
      ssrPrice: 1000,
    },
  ];
  const priceFilter = {
    sectionId: "price",
    title: "Price range",
    Icon: PriceIcon,
    type: FilterType.RANGE,
    filters: [
      {
        count: 1,
        id: "90",
      },
      {
        count: 4,
        id: "146",
      },
      {
        count: 1,
        id: "202",
      },
      {
        count: 0,
        id: "258",
      },
      {
        count: 0,
        id: "314",
      },
      {
        count: 1,
        id: "370",
      },
      {
        count: 0,
        id: "426",
      },
      {
        count: 0,
        id: "482",
      },
      {
        count: 0,
        id: "538",
      },
      {
        count: 0,
        id: "594",
      },
      {
        count: 0,
        id: "650",
      },
      {
        count: 0,
        id: "706",
      },
      {
        count: 0,
        id: "762",
      },
      {
        count: 0,
        id: "818",
      },
      {
        count: 0,
        id: "874",
      },
      {
        count: 0,
        id: "930",
      },
      {
        count: 0,
        id: "986",
      },
      {
        count: 1,
        id: "1042",
      },
      {
        count: 0,
        id: "1098",
      },
      {
        count: 0,
        id: "1154",
      },
      {
        count: 1,
        id: "1210",
      },
    ],
    min: 90,
    max: 1200,
  };
  test("", () => {
    expect(getStaySearchPriceFilter(products, fakeTranslate as TFunction)).toEqual(priceFilter);
  });
});

describe("getStarRatingValues", () => {
  it("returns numeric value string from the rating star strings", () => {
    expect(getStarRatingValues(["1Star", "2Star", "3Star", "4Star"])).toEqual(["1", "2", "3", "4"]);
  });

  it("returns undefined when no rating star strings provided", () => {
    expect(getStarRatingValues(undefined)).toEqual(undefined);
  });
});

describe("constructStaysProductGTE", () => {
  const productCard: StaysSearchTypes.StaysSearchGTECard = {
    availabilityId: "uuid-string",
    description: "Enjoy your vacation at the 5-star hotel",
    image: {
      id: "handleId",
      handle: "handleId",
      caption: "hotel image",
    },
    isYouJustMissedIt: false,
    isAboutToSellOut: true,
    name: "Hyatt Paris Madeleine Hotel",
    price: {
      price: 10001.89,
      currency: "USD",
      priceDisplayValue: "10,001.89",
      defaultPrice: 1234,
    },
    id: 12345,
    productPageUrl: "/france/best-hotels-and-places-to-stay/details/hyatt-paris-madeleine-hotel",
    userRatingAverage: 4.7,
    userRatingsTotal: 10839,
    valueProps: [StaySearchGTEValueProp.SUPPORT24_HOURS],
    quickfacts: {
      breakfast: StaySearchBreakfastAvailabilities.BREAKFAST_AVAILABLE,
      timeOfCheckIn: "13:45:00",
    },
  };

  const searchOptions = {
    adults: 10,
    children: [10, 2],
    rooms: 3,
    dateFrom: "2020-01-01",
    dateTo: "2020-01-10",
  };

  it("creates stays product with initialized properties", () => {
    expect(
      constructStaysProductGTE({
        card: productCard,
        t: fakeTranslateWithValues,
        ...searchOptions,
      })
    ).toEqual({
      description: "Enjoy your vacation at the 5-star hotel",
      headline: "Hyatt Paris Madeleine Hotel",
      id: 12345,
      image: {
        id: "handleId",
        name: "Hyatt Paris Madeleine Hotel",
        url: "https://gte-gcms.imgix.net/handleId",
      },
      reviewsCount: 10839,
      averageRating: 4.7,
      isAvailable: true,
      isHighlight: false,
      isLikelyToSellOut: true,
      linkUrl:
        "/france/best-hotels-and-places-to-stay/details/hyatt-paris-madeleine-hotel?adults=10&children=10&children=2&dateFrom=2020-01-01&dateTo=2020-01-10&rooms=3",
      price: 10001.89,
      priceDisplayValue: "10,001.89",
      props: [
        {
          Icon: NotImportantIconMock,
          title: "label:24/7 customer support, options:undefined",
        },
      ],
      specs: [
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
      ssrPrice: 10001.89,
    });
  });
  it("marks stays product as unavailable if it's sell out", () => {
    expect(
      constructStaysProductGTE({
        card: {
          ...productCard,
          isYouJustMissedIt: true,
        },
        t: fakeTranslateWithValues,
        ...searchOptions,
      }).isAvailable
    ).toBeFalsy();
  });

  it("marks stays product as isHighlight if it's the same as searchable product", () => {
    expect(
      constructStaysProductGTE({
        card: {
          ...productCard,
          isYouJustMissedIt: true,
        },
        t: fakeTranslateWithValues,
        ...searchOptions,
        productId: String(productCard.id),
      }).isHighlight
    ).toBeTruthy();
  });

  it("builds the product URL link with selected meals and room preferences", () => {
    expect(
      constructStaysProductGTE({
        card: {
          ...productCard,
          isYouJustMissedIt: true,
        },
        t: fakeTranslateWithValues,
        ...searchOptions,
        productId: String(productCard.id || 0),
        mealsIncluded: ["breakfast"],
        roomPreferences: ["double room"],
      }).linkUrl
    ).toBe(
      "/france/best-hotels-and-places-to-stay/details/hyatt-paris-madeleine-hotel?adults=10&children=10&children=2&dateFrom=2020-01-01&dateTo=2020-01-10&meals_included=breakfast&room_preferences=double%20room&rooms=3"
    );
  });
});
