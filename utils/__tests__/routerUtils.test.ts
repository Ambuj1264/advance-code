import {
  asPathWithoutQueryParams,
  getPathWithoutSlashes,
  getUrlWithAdditionalQueryParam,
  getProductSlugFromHref,
  getPathWithoutSections,
  removeLocaleFromPath,
  cleanAsPath,
  removeEnCnLocaleCode,
  makeAbsoluteLink,
  constructLocalizedUrl,
  normalizePathForSurrogateKeys,
  extractPageTypeFromRoute,
  getPathWithoutSlugAndQueryParams,
  removeEnLocaleCode,
  removeLocaleCode,
  getMarketplaceHostWithGTICn,
  getUrlWithoutTrailingSlash,
  cleanAsPathWithLocale,
} from "../routerUtils";
import { stripAmpFromUrl } from "../commonServerUtils";

import { SupportedLanguages, PageType } from "types/enums";

describe("asPathWithoutQueryParams", () => {
  test("should return the same url since there are now query params", () => {
    expect(asPathWithoutQueryParams("/api/v2")).toEqual("/api/v2");
  });
  test("should return remove the query params and only return the url", () => {
    expect(asPathWithoutQueryParams("/api/v2?amp=1#crazyParam")).toEqual("/api/v2");
  });
});

describe("getPathWithoutSlashes", () => {
  const url = "url/with/slash";

  test("should return the same url since there are no open or close slash", () => {
    expect(getPathWithoutSlashes(url)).toEqual(url);
  });
  test("should return url without open slash", () => {
    expect(getPathWithoutSlashes(`/${url}`)).toEqual(url);
  });
  test("should return url without close slash", () => {
    expect(getPathWithoutSlashes(`${url}/`)).toEqual(url);
  });
  test("should return url without open and close slash", () => {
    expect(getPathWithoutSlashes(`/${url}/`)).toEqual(url);
  });
});

describe("getUrlWithAdditionalQueryParam", () => {
  test("should add query param to an provided url without query params", () => {
    expect(
      getUrlWithAdditionalQueryParam({
        baseUrl: "http://guidetoiceland.is",
        param: "testParam",
        value: "testValue",
      })
    ).toBe("http://guidetoiceland.is?testParam=testValue");

    expect(
      getUrlWithAdditionalQueryParam({
        baseUrl: "http://guidetoiceland.is/",
        param: "testParam",
        value: "testValue",
      })
    ).toBe("http://guidetoiceland.is/?testParam=testValue");
  });

  test("should keep existing query params", () => {
    expect(
      getUrlWithAdditionalQueryParam({
        baseUrl: "http://guidetoiceland.is/?existingParam1=param1&existingParam2=param2",
        param: "testParam",
        value: "testValue",
      })
    ).toBe(
      "http://guidetoiceland.is/?existingParam1=param1&existingParam2=param2&testParam=testValue"
    );
  });

  test("should replace existing query param with new value", () => {
    expect(
      getUrlWithAdditionalQueryParam({
        baseUrl: "http://guidetoiceland.is/?testParam=oldValue",
        param: "testParam",
        value: "newValue",
      })
    ).toBe("http://guidetoiceland.is/?testParam=newValue");
    expect(
      getUrlWithAdditionalQueryParam({
        baseUrl: "http://guidetoiceland.is/?existingParam=1&testParam=oldValue",
        param: "testParam",
        value: "newValue",
      })
    ).toBe("http://guidetoiceland.is/?existingParam=1&testParam=newValue");
  });

  test("should remove query param when value is undefined", () => {
    expect(
      getUrlWithAdditionalQueryParam({
        baseUrl: "http://guidetoiceland.is/?testParam=oldValue",
        param: "testParam",
        value: undefined,
      })
    ).toBe("http://guidetoiceland.is/");
    expect(
      getUrlWithAdditionalQueryParam({
        baseUrl:
          "http://guidetoiceland.is/?existingParam1=param1&existingParam2=param2&testParam=oldValue",
        param: "testParam",
        value: undefined,
      })
    ).toBe("http://guidetoiceland.is/?existingParam1=param1&existingParam2=param2");
  });

  test("should support url without host", () => {
    expect(
      getUrlWithAdditionalQueryParam({
        baseUrl: "/book-trips-holiday/",
        param: "testParam",
        value: "testValue",
      })
    ).toBe("/book-trips-holiday/?testParam=testValue");
  });
});

describe("getProductSlugFromHref", () => {
  it("should return last pathname section from url", () => {
    expect(
      getProductSlugFromHref(
        "https://guidetoiceland.is/book-holiday-trips/8-day-summer-tour-ring-road-with-snaefellsnes?some_query=query#hashParam=hashParam"
      )
    ).toBe("8-day-summer-tour-ring-road-with-snaefellsnes");

    expect(
      getProductSlugFromHref(
        "https://guidetoiceland.is/8-day-summer-tour-ring-road-with-snaefellsnes"
      )
    ).toBe("8-day-summer-tour-ring-road-with-snaefellsnes");
  });

  it("should return empty string if no slug has been found", () => {
    expect(getProductSlugFromHref("https://guidetoiceland.is/?query=123")).toBe("");
  });

  it("should return last pathname section from relative url", () => {
    expect(
      getProductSlugFromHref(
        "/book-holiday-trips/8-day-summer-tour-ring-road-with-snaefellsnes?some_query=query#hashParam=hashParam"
      )
    ).toBe("8-day-summer-tour-ring-road-with-snaefellsnes");

    expect(getProductSlugFromHref("/8-day-summer-tour-ring-road-with-snaefellsnes")).toBe(
      "8-day-summer-tour-ring-road-with-snaefellsnes"
    );
  });

  it("should return empty string if no slug has been found in relative url", () => {
    expect(getProductSlugFromHref("/?query=123")).toBe("");
  });
});

describe("getPathWithoutSections", () => {
  it("should do nothing if there is not section in the path", () =>
    expect(getPathWithoutSections("/book-trips-holiday")).toBe("/book-trips-holiday"));
  it("should do remove the section from the path", () =>
    expect(getPathWithoutSections("/book-trips-holiday#awesomeSection")).toBe(
      "/book-trips-holiday"
    ));
});

describe("removeLocaleFromPath", () => {
  it("should remove locale from path", () => {
    expect(removeLocaleFromPath("/fr/test-path?query=123", "fr")).toBe("/test-path?query=123");

    expect(removeLocaleFromPath("fr/test-path?query=123", "fr")).toBe("test-path?query=123");
  });

  it("should keep english and chinese locales", () => {
    expect(removeLocaleFromPath("/en/test-path?query=123", "en")).toBe("en/test-path?query=123");
    expect(removeLocaleFromPath("/zh_CH/test-path?query=123", "zh_CH")).toBe(
      "zh_CH/test-path?query=123"
    );
  });

  it("should handle path with locale only", () => {
    expect(removeLocaleFromPath("/fr", "fr")).toBe("/");
  });

  it("should handle path with locale only and trailing slash", () => {
    expect(removeLocaleFromPath("/fr/", "fr")).toBe("/");
  });
});

describe("cleanAsPath", () => {
  it("should return the path complete stripped", () => {
    expect(cleanAsPath("/fr/test-path?query=123#awesomeSection", "fr")).toBe("test-path");
  });
  it("should return the index route with locale stripped", () => {
    expect(cleanAsPath("/fr/?query=123#awesomeSection", "fr")).toBe("");
  });
  it("should return the index route with locale stripped", () => {
    expect(cleanAsPath("/fr/", "fr")).toBe("");
  });
});

describe("removeEnCnLocaleCode", () => {
  it("should remove en/ or /zh from the beginning of the url", () => {
    expect(
      removeEnCnLocaleCode("/zh/book-trips-holiday/bus-tours/airport-transfers/", "zh_CN")
    ).toBe("book-trips-holiday/bus-tours/airport-transfers/");

    expect(removeEnCnLocaleCode("/da/book-trips-holiday/bus-tours/airport-transfers/", "da")).toBe(
      "/da/book-trips-holiday/bus-tours/airport-transfers/"
    );

    expect(
      removeEnCnLocaleCode("/zh_CN/book-trips-holiday/bus-tours/airport-transfers/", "zh_CN")
    ).toBe("book-trips-holiday/bus-tours/airport-transfers/");

    expect(removeEnCnLocaleCode("zh", "zh")).toBe("");
    expect(removeEnCnLocaleCode("zh_CN", "zh_CN")).toBe("");
  });

  it("should handle urls with http(s) while using third argument", () => {
    expect(
      removeEnCnLocaleCode(
        "http://guidetoiceland.is/zh/book-trips-holiday/bus-tours/airport-transfers/",
        "zh_CN",
        true
      )
    ).toBe("http://guidetoiceland.is/book-trips-holiday/bus-tours/airport-transfers/");

    expect(
      removeEnCnLocaleCode(
        "http://guidetoiceland.is/zh/book-trips-holiday/bus-tours/airport-transfers/",
        "zh",
        true
      )
    ).toBe("http://guidetoiceland.is/book-trips-holiday/bus-tours/airport-transfers/");

    expect(
      removeEnCnLocaleCode(
        "https://guidetoiceland.is/en/book-trips-holiday/bus-tours/airport-transfers/",
        "en",
        true
      )
    ).toBe("https://guidetoiceland.is/book-trips-holiday/bus-tours/airport-transfers/");
  });
});

describe("removeEnLocaleCode", () => {
  it("should remove en/ from the beginning of the url but keep other locales intact", () => {
    expect(removeEnLocaleCode("/en/book-trips-holiday/bus-tours/airport-transfers/", "en")).toBe(
      "/book-trips-holiday/bus-tours/airport-transfers/"
    );

    expect(removeEnLocaleCode("/zh/book-trips-holiday/bus-tours/airport-transfers/", "zh_CN")).toBe(
      "/zh/book-trips-holiday/bus-tours/airport-transfers/"
    );

    expect(removeEnLocaleCode("/da/book-trips-holiday/bus-tours/airport-transfers/", "da")).toBe(
      "/da/book-trips-holiday/bus-tours/airport-transfers/"
    );

    expect(removeEnLocaleCode("en", "en")).toBe("");
  });
});

describe("removeLocaleCode", () => {
  it("should remove locale codes from url", () => {
    expect(removeLocaleCode("/en/book-trips-holiday/bus-tours/airport-transfers/", "en")).toBe(
      "/book-trips-holiday/bus-tours/airport-transfers/"
    );

    expect(removeLocaleCode("/da/book-trips-holiday/bus-tours/airport-transfers/", "da")).toBe(
      "/book-trips-holiday/bus-tours/airport-transfers/"
    );

    expect(removeLocaleCode("en", "en")).toBe("");
  });

  it("should remove Chinese locale codes from url", () => {
    expect(removeLocaleCode("/zh/book-trips-holiday/bus-tours/airport-transfers/", "zh_CN")).toBe(
      "/book-trips-holiday/bus-tours/airport-transfers/"
    );

    expect(removeLocaleCode("/zh/book-trips-holiday/bus-tours/airport-transfers/", "zh")).toBe(
      "/book-trips-holiday/bus-tours/airport-transfers/"
    );

    expect(
      removeLocaleCode("/zh_CN/book-trips-holiday/bus-tours/airport-transfers/", "zh_CN")
    ).toBe("/book-trips-holiday/bus-tours/airport-transfers/");

    expect(
      removeLocaleCode("/zh_CN/book-trips-holiday/bus-tours/airport-transferszh_CN/", "zh_CN")
    ).toBe("/book-trips-holiday/bus-tours/airport-transferszh_CN/");
  });

  it("should keep url intact if locale code was not found", () => {
    expect(removeLocaleCode("/book-trips-holiday/bus-tours/airport-transfers/", "en")).toBe(
      "/book-trips-holiday/bus-tours/airport-transfers/"
    );

    expect(removeLocaleCode("/book-trips-holiday/bus-tours/airport-transfers/", "zh_CN")).toBe(
      "/book-trips-holiday/bus-tours/airport-transfers/"
    );
  });
});

describe("makeAbsoluteLink", () => {
  it("should return absolute link", () => {
    expect(
      makeAbsoluteLink(
        "/zh/book-trips-holiday/bus-tours/airport-transfers/",
        "https://guidetoiceland.is"
      )
    ).toBe("https://guidetoiceland.is/zh/book-trips-holiday/bus-tours/airport-transfers");

    expect(
      makeAbsoluteLink(
        "zh/book-trips-holiday/bus-tours/airport-transfers/",
        "https://guidetoiceland.is"
      )
    ).toBe("https://guidetoiceland.is/zh/book-trips-holiday/bus-tours/airport-transfers");

    // url starts with absolute path
    expect(
      makeAbsoluteLink(
        "https://guidetoiceland.is/zh/book-trips-holiday/bus-tours/airport-transfers/",
        "https://guidetoiceland.is"
      )
    ).toBe("https://guidetoiceland.is/zh/book-trips-holiday/bus-tours/airport-transfers/");
  });
});

describe("constructLocalizedUrl", () => {
  // NOTE: testcafe runs on localhost so constructLocalizedUrl returns http, not https here:
  it("should return default marketplace url for english", () => {
    expect(constructLocalizedUrl("guidetoiceland.is", SupportedLanguages.English)).toBe(
      "http://guidetoiceland.is"
    );
  });
  it("should return correct marketplace url for non english locales", () => {
    expect(constructLocalizedUrl("guidetoiceland.is", SupportedLanguages.Korean)).toBe(
      "http://guidetoiceland.is/ko"
    );
  });
  it("should return correct marketplace url for chinese locale on GTI", () => {
    expect(constructLocalizedUrl("cn.guidetoiceland.is", SupportedLanguages.Chinese)).toBe(
      "http://cn.guidetoiceland.is"
    );
  });
  it("should return correct marketplace url for chinese locale on non GTI marketplaces", () => {
    expect(constructLocalizedUrl("iceland-photo-tours.com", SupportedLanguages.Chinese)).toBe(
      "http://iceland-photo-tours.com/zh_CN"
    );
  });
});

describe("normalizePathForSurrogateKeys", () => {
  it("should return the same path if this is a non amp url", () => {
    expect(normalizePathForSurrogateKeys("/nature-info")).toBe("/nature-info");
  });
  it("should remove ?preview=1 from the urls", () => {
    expect(normalizePathForSurrogateKeys("/nature-info?preview=1")).toBe("/nature-info");
    expect(normalizePathForSurrogateKeys("/nature-info?preview=1&page=2")).toBe(
      "/nature-info?page=2"
    );
    expect(normalizePathForSurrogateKeys("/nature-info?page=2&preview=1")).toBe(
      "/nature-info?page=2"
    );
  });
  it("should remove hash", () => {
    expect(normalizePathForSurrogateKeys("/nature-info#hash=123")).toBe("/nature-info");
    expect(normalizePathForSurrogateKeys("/nature-info?preview=1&page=2#hash=123")).toBe(
      "/nature-info?page=2"
    );
  });
});

describe("getUrlWithoutAmp", () => {
  test("should return url without /amp", () => {
    expect(extractPageTypeFromRoute("/car")).toBe(PageType.CAR);
  });
});

describe("getPathWithoutSlugAndQueryParams", () => {
  test("should return the url without the slug and query params", () => {
    expect(getPathWithoutSlugAndQueryParams("/best-flights/details?adults=2")).toEqual(
      "/best-flights"
    );
  });
  test("should return the url without the slug and query params", () => {
    expect(getPathWithoutSlugAndQueryParams("iceland/best-flights/details")).toEqual(
      "iceland/best-flights"
    );
  });
});

describe("getMarketplaceHostWithGTICn", () => {
  it("should return hostname for given URL with en locale", () => {
    expect(getMarketplaceHostWithGTICn("en", "https://guidetoiceland.is/")).toBe(
      "guidetoiceland.is"
    );

    expect(getMarketplaceHostWithGTICn("en", "https://guidetoiceland.is/test/url?query=test")).toBe(
      "guidetoiceland.is"
    );

    expect(getMarketplaceHostWithGTICn("en", "https://guidetoeurope.com")).toBe(
      "guidetoeurope.com"
    );
  });

  it("should append cn. subdomain to host when Chinese locale is set only for GTI", () => {
    expect(getMarketplaceHostWithGTICn("zh_CN", "https://guidetoiceland.is/")).toBe(
      "cn.guidetoiceland.is"
    );
  });

  it("should not append cn. subdomain for any other hosts except GTI", () => {
    expect(getMarketplaceHostWithGTICn("zh_CN", "https://guidetoeurope.com")).toBe(
      "guidetoeurope.com"
    );

    expect(getMarketplaceHostWithGTICn("zh_CN", "https://guidetothephilippines.ph/test/url")).toBe(
      "guidetothephilippines.ph"
    );
  });

  it("should not crash when non ISO URI provided", () => {
    expect(getMarketplaceHostWithGTICn("en", "guidetoiceland.is/test/url?query=test")).toBe(
      "guidetoiceland.is/test/url?query=test"
    );
  });
});

describe("getUrlWithoutTrailingSlash", () => {
  it("should url without trailing slash", () => {
    expect(getUrlWithoutTrailingSlash("https://guidetoeurope.com/")).toBe(
      "https://guidetoeurope.com"
    );
    expect(getUrlWithoutTrailingSlash("/italy/")).toBe("/italy");
    expect(getUrlWithoutTrailingSlash("/italy/")).toBe("/italy");
    expect(getUrlWithoutTrailingSlash("/germany")).toBe("/germany");
  });
});

describe("cleanAsPathWithLocale", () => {
  it("should return clean asPath", () => {
    expect(cleanAsPathWithLocale("/spain")).toBe("/spain");
    expect(cleanAsPathWithLocale("/pl/hiszpania")).toBe("/pl/hiszpania");
    expect(cleanAsPathWithLocale("/pl/hiszpania#ssss")).toBe("/pl/hiszpania");
    expect(cleanAsPathWithLocale("/pl/hiszpania?someParam=true")).toBe("/pl/hiszpania");
  });
  it("should return clean asPath without trailing slash", () => {
    expect(cleanAsPathWithLocale("/best-flights/details/")).toBe("/best-flights/details");
    expect(cleanAsPathWithLocale("/spain/")).toBe("/spain");
    expect(cleanAsPathWithLocale("/pl/spain/")).toBe("/pl/spain");
  });
  it("should return clean asPath with trailing slash if the length less then 2 symbol (for the main page)", () => {
    expect(cleanAsPathWithLocale("/")).toBe("/");
    expect(cleanAsPathWithLocale("")).toBe("");
  });
});

describe("stripAmpFromUrl", () => {
  it("should strip amp query param correctly from given url", () => {
    expect(stripAmpFromUrl("?amp=1")).toBe("");
    expect(stripAmpFromUrl("?amp=true")).toBe("");
    expect(stripAmpFromUrl("/?amp=1")).toBe("/");
    expect(stripAmpFromUrl("/?amp=true")).toBe("/");
    expect(stripAmpFromUrl("/path?amp=1")).toBe("/path");
    expect(stripAmpFromUrl("/path?amp=true")).toBe("/path");
    expect(stripAmpFromUrl("/path/?amp=1")).toBe("/path/");
    expect(stripAmpFromUrl("/path/?amp=true")).toBe("/path/");
    expect(stripAmpFromUrl("/path/?query=test&amp=1")).toBe("/path/?query=test");
    expect(stripAmpFromUrl("/path/?query=test&amp=true")).toBe("/path/?query=test");
    expect(stripAmpFromUrl("/path/?amp=1&query=test")).toBe("/path/?query=test");
    expect(stripAmpFromUrl("very-long/amp-test/test/path/?query=1&param=test&amp=1")).toBe(
      "very-long/amp-test/test/path/?query=1&param=test"
    );
    expect(stripAmpFromUrl("very-long/amp-test/test/path/?query=1&param=test&amp=1")).toBe(
      "very-long/amp-test/test/path/?query=1&param=test"
    );
  });

  it("should not modify urls without amp query param", () => {
    const case0 = "";
    expect(stripAmpFromUrl(case0)).toBe(case0);

    const case1 = "/";
    expect(stripAmpFromUrl(case1)).toBe(case1);

    const case2 = "/test";
    expect(stripAmpFromUrl(case2)).toBe(case2);

    const case3 = "/test/";
    expect(stripAmpFromUrl(case3)).toBe(case3);

    const case4 = "/test/path/";
    expect(stripAmpFromUrl(case4)).toBe(case4);

    const case5 = "very-long/amp-test/test/path/?query=1&param=test";
    expect(stripAmpFromUrl(case5)).toBe(case5);

    const case6 = "/?query1=test&queryamp=2";
    expect(stripAmpFromUrl(case6)).toBe(case6);

    const case7 = "?query1=test&queryamp=2";
    expect(stripAmpFromUrl(case7)).toBe(case7);
  });
});
