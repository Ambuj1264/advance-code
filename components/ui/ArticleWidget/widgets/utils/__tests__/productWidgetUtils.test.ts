import { constructPopularTour } from "../productWidgetUtils";

import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

describe("constructPopularTour", () => {
  const { t } = useTranslation(Namespaces.commonNs);
  const tourQueryData: QueryTour & any = {
    id: 6458,
    name: "The Circle of Iceland in Winter 8 Day Guided Adventure",
    url: "http://denys-volchenkov.traveldev.org/book-holiday-trips/8-days-7-nights-winter-guided-circle-tour-around-iceland",
    basePrice: 213900,
    reviewTotalScore: "4.9",
    reviewTotalCount: 167,
    duration: "8 days",
    priceGroups: {
      adults: { lowestPriceGroupSize: 1 },
      children: null,
      teenagers: null,
    },
    localePrice: { price: "1,674", currency: "USD" },
    image: {
      id: 354179,
      url: "https://guidetoiceland.imgix.net/354179/x/0/the-northern-lights-over-jokusarlon-glacier-lagoon?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.1.0&s=9365a6e3258d8fe1c79e9ca5a6d2ac97&w=&h=&crop=faces&fit=crop",
      name: "The northern lights over Jokusarlon glacier lagoon.",
      alt: "",
    },
    slug: "/8-days-7-nights-winter-guided-circle-tour-around-iceland",
  };

  const expectedResult = {
    id: "6458",
    name: "The Circle of Iceland in Winter 8 Day Guided Adventure",
    url: "http://denys-volchenkov.traveldev.org/book-holiday-trips/8-days-7-nights-winter-guided-circle-tour-around-iceland",
    basePrice: 213900,
    reviewTotalScore: "4.9",
    reviewTotalCount: 167,
    duration: "8 days",
    priceGroups: {
      adults: { lowestPriceGroupSize: 1 },
      children: null,
      teenagers: null,
    },
    slug: "/8-days-7-nights-winter-guided-circle-tour-around-iceland",
    clientRoute: {
      route: "/tour",
      as: "/book-holiday-trips/8-days-7-nights-winter-guided-circle-tour-around-iceland",
      slug: "/8-days-7-nights-winter-guided-circle-tour-around-iceland",
    },
    localePrice: { price: "1,674", currency: "USD" },
    image: {
      id: "354179",
      url: "https://guidetoiceland.imgix.net/354179/x/0/the-northern-lights-over-jokusarlon-glacier-lagoon",
      name: "The northern lights over Jokusarlon glacier lagoon.",
      alt: "",
    },
    lowestPrice: 1674,
    currency: "USD",
    linkUrl:
      "http://denys-volchenkov.traveldev.org/book-holiday-trips/8-days-7-nights-winter-guided-circle-tour-around-iceland",
    review: { totalScore: 4.9, totalCount: 167 },
    priceDescription: "Price for {numberOfAdults} adults",
  };

  test("construct popular tour", () => {
    expect(constructPopularTour(tourQueryData, t)).toStrictEqual(expectedResult);
  });
});
