import { ServerResponse, IncomingMessage } from "http";

import { normalizeRedirectQueriesData, redirectHandler } from "../apollo/redirectCheck";

describe("redirectHandler", () => {
  test("Should return fallbackStatusCode (without redirect)", () => {
    const url = "https://guidetoiceland.is/";

    expect(
      redirectHandler({
        data: { code: 301, url: undefined },
        fallbackStatusCode: 200,
        req: { url } as IncomingMessage,
        res: {} as ServerResponse,
        locale: "en",
      })
    ).toEqual({ statusCode: 200, redirectUrl: undefined });
  });

  test("Should return correct redirect", () => {
    const url = "https://guidetoiceland.is/book-holiday-trips/easy-1-hour-tour";
    const redirectUrl = "https://guidetoiceland.is/";

    expect(
      redirectHandler({
        data: {
          code: 301,
          url: redirectUrl,
        },
        fallbackStatusCode: 200,
        req: { url } as IncomingMessage,
        res: {} as ServerResponse,
        locale: "zh_CN",
      })
    ).toEqual({ statusCode: 301, redirectUrl });
  });

  test("Should redirect to the provided url keeping the failed requests' query params", () => {
    const url =
      "https://guidetoiceland.is/nl/boeken-trips-vakantie/tour-calendar/september-tours?page=3";
    const redirectUrl =
      "https://guidetoiceland.is/nl/boeken-trips-vakantie/tour-calendar/reizen-in-september";
    const redirectUrlWithParams = `${redirectUrl}?page=3`;

    expect(
      redirectHandler({
        data: {
          code: 301,
          url: redirectUrl,
        },
        fallbackStatusCode: 200,
        req: { url } as IncomingMessage,
        res: {} as ServerResponse,
        locale: "nl",
      })
    ).toEqual({ statusCode: 301, redirectUrl: redirectUrlWithParams });

    const urlNoParams =
      "https://guidetoiceland.is/nl/boeken-trips-vakantie/tour-calendar/september-tours";
    const redirectUrlNoParams =
      "https://guidetoiceland.is/nl/boeken-trips-vakantie/tour-calendar/reizen-in-september";

    expect(
      redirectHandler({
        data: {
          code: 301,
          url: redirectUrlNoParams,
        },
        fallbackStatusCode: 200,
        req: { url: urlNoParams } as IncomingMessage,
        res: {} as ServerResponse,
        locale: "nl",
      })
    ).toEqual({ statusCode: 301, redirectUrl: redirectUrlNoParams });
  });

  test("Should use the redirect url's query instead of the failed request's", () => {
    const url =
      "https://guidetoiceland.is/it/prenota-un-tour-in-islanda/tour-calendar/september-tours?activityIds=15&attractionIds=31";
    const redirectUrl =
      "https://guidetoiceland.is/it/prenota-un-tour-in-islanda/tour-calendar/tour-a-settembre?durationIds=1";
    expect(
      redirectHandler({
        data: {
          code: 301,
          url: redirectUrl,
        },
        fallbackStatusCode: 200,
        req: { url } as IncomingMessage,
        res: {} as ServerResponse,
        locale: "it",
      })
    ).toEqual({ statusCode: 301, redirectUrl });
  });

  test("Should return 404 if url is the same", () => {
    const url = "https://cn.guidetoiceland.is/book-holiday-trips/easy-1-hour-tour";

    expect(
      redirectHandler({
        data: {
          code: 301,
          url: "https://cn.guidetoiceland.is/zh_CN/book-holiday-trips/easy-1-hour-tour",
        },
        fallbackStatusCode: 200,
        req: { url } as IncomingMessage,
        res: {} as ServerResponse,
        locale: "zh_CN",
      })
    ).toEqual({ statusCode: 404, redirectUrl: url });

    const url1 = "https://guidetoiceland.is/book-holiday-trips/easy-1-hour-tour";

    expect(
      redirectHandler({
        data: {
          code: 301,
          url: url1,
        },
        fallbackStatusCode: 200,
        req: { url: url1 } as IncomingMessage,
        res: {} as ServerResponse,
        locale: "zh_CN",
      })
    ).toEqual({ statusCode: 404, redirectUrl: url1 });
  });
});

describe("normalizeRedirectQueriesData", () => {
  it("returns [{url,code}] from the given valid apollo queryResults Array", () => {
    const getRedirectQueryResponse = {
      data: {
        redirects: [
          {
            to: "http://guidetoeurope.com/",
            code: 301,
            otherProp: "not-important",
          },
        ],
      },
    };
    const redirectQueryResponse = {
      data: {
        getRedirectUrl: {
          url: "http://guidetoiceland.is/",
          code: 301,
          otherProp: "not-important",
        },
      },
    };
    expect(normalizeRedirectQueriesData([getRedirectQueryResponse, redirectQueryResponse])).toEqual(
      [
        {
          url: "http://guidetoeurope.com/",
          code: 301,
        },
        {
          url: "http://guidetoiceland.is/",
          code: 301,
        },
      ]
    );
  });

  it("returns [{url, code}] when some of data is absent", () => {
    const getRedirectQueryEmptyResponse1 = {
      data: {
        redirects: [],
      },
    };
    const getRedirectQueryEmptyResponse2 = {
      data: null,
    };
    const redirectQueryEmptyResponse1 = {
      data: {
        getRedirectUrl: null,
      },
    };
    const redirectQueryEmptyResponse2 = {
      data: null,
    };

    expect(
      normalizeRedirectQueriesData([
        {},
        getRedirectQueryEmptyResponse1,
        getRedirectQueryEmptyResponse2,
        redirectQueryEmptyResponse1,
        redirectQueryEmptyResponse2,
      ])
    ).toEqual([
      {
        url: undefined,
        code: undefined,
      },
      {
        url: undefined,
        code: undefined,
      },
      {
        url: undefined,
        code: undefined,
      },
      {
        url: undefined,
        code: undefined,
      },
      {
        url: undefined,
        code: undefined,
      },
    ]);
  });
});
