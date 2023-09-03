import {
  getPathWithoutSlugAndQueryParams,
  omitQueryParamsFromUrl,
  prepareGraphCmsAsPath,
} from "./routerUtils";
import { stripWwwFromHost } from "./commonServerUtils";

describe("omitQueryParamsFromUrl", () => {
  it("returns unmodified URL if no matched query names are found", () => {
    expect(
      omitQueryParamsFromUrl("https://example.com/?q1=v1&q2=v2&q3=v3", ["non-existent-query-name"])
    ).toEqual("https://example.com/?q1=v1&q2=v2&q3=v3");

    expect(omitQueryParamsFromUrl("https://example.com", ["non-existent-query-name"])).toEqual(
      "https://example.com"
    );
  });

  it("returns URL with skipped selected query params", () => {
    expect(omitQueryParamsFromUrl("https://example.com/?q1=v1&q2=v2&q3=v3", ["q2"])).toEqual(
      "https://example.com/?q1=v1&q3=v3"
    );

    expect(omitQueryParamsFromUrl("https://example.com/?q1=v1&q2=v2&q3=v3", ["q1"])).toEqual(
      "https://example.com/?q2=v2&q3=v3"
    );

    expect(
      omitQueryParamsFromUrl("https://example.com/?q1=v1&q2=v2&q3=v3", ["q1", "q2", "q3"])
    ).toEqual("https://example.com/");
  });
});

describe("getPathWithoutSlugAndQueryParams", () => {
  it("should return path without slug and query params", () => {
    expect(
      getPathWithoutSlugAndQueryParams(
        "https://guidetoeurope.com/croatia/best-vacation-packages/road-trips/3-day-croatia-road-trip-to-zadar-and-grad-makarska?a=1&b=2"
      )
    ).toBe("https://guidetoeurope.com/croatia/best-vacation-packages/road-trips");
  });

  it("should handle empty string as argument", () => {
    expect(getPathWithoutSlugAndQueryParams("")).toBe("");
  });
});

describe("stripWwwFromHost", () => {
  it("should return url without www", () => {
    expect(stripWwwFromHost("www.norwaytravelguide.no/book-trips-holiday")).toBe(
      "norwaytravelguide.no/book-trips-holiday"
    );
    expect(stripWwwFromHost("www.norwaytravelguide.no")).toBe("norwaytravelguide.no");
    expect(stripWwwFromHost("www.guidetoeurope.com")).toBe("guidetoeurope.com");
  });
  it("should should not remove www if it's not in the start of url", () => {
    expect(stripWwwFromHost("norwaytravelguide.no/book-trips-holiday-www-test")).toBe(
      "norwaytravelguide.no/book-trips-holiday-www-test"
    );
    expect(stripWwwFromHost("hello.com/www.com")).toBe("hello.com/www.com");
  });
});

describe("prepareGraphCmsAsPath", () => {
  it("should return the same asPath for GTE", () => {
    expect(prepareGraphCmsAsPath("/zh/best-flights", false)).toBe("/zh/best-flights");
    expect(prepareGraphCmsAsPath("/zh/best-flights/from-ukraine", false)).toBe(
      "/zh/best-flights/from-ukraine"
    );
  });
  it("should remove zh or zh_CN for GTI", () => {
    expect(prepareGraphCmsAsPath("/zh/best-flights", true)).toBe("/best-flights");
    expect(prepareGraphCmsAsPath("/zh/best-flights/from-ukraine", true)).toBe(
      "/best-flights/from-ukraine"
    );
    expect(prepareGraphCmsAsPath("/zh_CN/best-flights", true)).toBe("/best-flights");
    expect(prepareGraphCmsAsPath("/zh_CN/best-flights/from-ukraine", true)).toBe(
      "/best-flights/from-ukraine"
    );
  });
});
