import { getAuthenticationStatus, constructNewHeader } from "../headerUtils";

import { GraphCMSPageType } from "types/enums";

describe("getAuthenticationStatus", () => {
  test("returns loading if loading is true", () => {
    const loading = true;
    const data = {
      login: {
        status: true,
      },
    };
    expect(getAuthenticationStatus(loading, true, data)).toEqual("loading");
  });
  test("returns error if loading is false and data has status that is false", () => {
    const loading = false;
    const data = {
      login: {
        status: false,
      },
    };
    expect(getAuthenticationStatus(loading, false, data)).toEqual("error");
  });
  test("returns success if loading is false and data has status that is true", () => {
    const loading = false;
    const data = {
      login: {
        status: true,
      },
    };
    expect(getAuthenticationStatus(loading, true, data)).toEqual("success");
  });
  test("returns none if loading is false and data is undefined", () => {
    const loading = false;
    const data = undefined;
    expect(getAuthenticationStatus(loading, false, data)).toEqual("none");
  });
});

describe("constructNewHeader", () => {
  test("returns undefined because there is no headerConfig", () => {
    expect(constructNewHeader(undefined)).toEqual(undefined);
  });
  const currencies = [
    {
      currencyCode: "USD",
      name: "US Dollar",
      rate: 0,
    },
    {
      currencyCode: "ISK",
      name: "Icelandic króna",
      rate: 0,
    },
  ];
  const resultLinks = [
    {
      text: "Flights to Europe",
      url: "/best-flights",
      pageType: GraphCMSPageType.Flights,
      linkClass: "flights",
      visible: "both",
    },
    {
      text: "Car rentals to Europe",
      url: "/best-car-rental",
      pageType: GraphCMSPageType.Cars,
      linkClass: "cars",
      visible: "both",
    },
  ];
  const locales = [
    {
      code: "en",
      name: "English",
    },
  ];
  const headerConfig = {
    currencies,
    links: [
      {
        text: "Flights to Europe",
        url: "/best-flights",
        pageType: GraphCMSPageType.Flights,
      },
      {
        text: "Car rentals to Europe",
        url: "/best-car-rental",
        pageType: GraphCMSPageType.Cars,
      },
    ],
    locales,
  };

  const result = {
    currencies,
    links: resultLinks,
    locales,
    searchLink: "",
    forgotPasswordLink: "/login/forgot",
    cartLink: "/cart",
  };
  test("returns correct headerConfig", () => {
    expect(constructNewHeader(headerConfig)).toEqual(result);
  });
});
