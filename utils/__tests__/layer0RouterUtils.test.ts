import { getLayer0Paths, getProxyByHost, createHostMatcher } from "../layer0RoutesUtils";
import { getHostsByOrigin, getBackendName } from "../layer0RoutesAdditionalUtils";
import { mockLayer0Paths, mockGTELayer0Paths } from "../mockData/mockRouteData";

import { MarketplaceName } from "types/enums";

jest.mock("../../shared/routes", () => {
  // eslint-disable-next-line global-require
  return require("../mockData/mockRouteData").mockRoutes;
});

describe("getLayer0Paths", () => {
  it("should return paths without marketplace set", () => {
    expect(getLayer0Paths(undefined)).toEqual(new Set<string>(mockLayer0Paths));
  });
  it("should return only specific matketplace paths", () => {
    expect(getLayer0Paths(MarketplaceName.GUIDE_TO_EUROPE)).toEqual(
      new Set<string>(mockGTELayer0Paths)
    );
  });
});

describe("getHostsByOrigin", () => {
  it("should return array with joined hosts", () => {
    const HostToOriginMap = {
      "guidetoiceland.is": "origin.guidetoiceland.is",
      "www.guidetoiceland.is": "origin.guidetoiceland.is",
      "cn.guidetoiceland.is": "origin.guidetoiceland.is",
      "admin.guidetoiceland.is": "origin.guidetoiceland.is",

      "uniquetrips.com": "origin.uniquetrips.com",
      "www.uniquetrips.com": "origin.uniquetrips.com",
      "cn.uniquetrips.com": "origin.uniquetrips.com",
      "admin.uniquetrips.com": "origin.uniquetrips.com",
    };

    expect(getHostsByOrigin(HostToOriginMap)).toEqual(["guidetoiceland", "uniquetrips"]);
  });
  it("should return array with joined hosts for one origin", () => {
    const HostToOriginMap = {
      "guidetoiceland.is": "origin.guidetoiceland.is",
      "www.guidetoiceland.is": "origin.guidetoiceland.is",
      "cn.guidetoiceland.is": "origin.guidetoiceland.is",
      "admin.guidetoiceland.is": "origin.guidetoiceland.is",
    };

    expect(getHostsByOrigin(HostToOriginMap)).toEqual(["guidetoiceland"]);
  });
});

describe("getBackendName", () => {
  it("should return normalized backend name", () => {
    expect(getBackendName("guidetoiceland.is")).toEqual("guidetoiceland_is");
    expect(getBackendName("cn.guidetoiceland.is")).toEqual("cn_guidetoiceland_is");
    expect(getBackendName("www.guidetoiceland.is")).toEqual("www_guidetoiceland_is");
  });
});

describe("getProxyByHost", () => {
  it("should return proxy by host", () => {
    expect(getProxyByHost("guidetoiceland")).toEqual("guidetoiceland_is");
    expect(getProxyByHost("guidetoeurope")).toEqual("guidetoeurope_com");
    expect(getProxyByHost("somehost")).toEqual("guidetoiceland_is");
  });
});

describe("createHostMatcher", () => {
  it("should run domain specific matcher with string path", () => {
    const mockRouterMatch = jest.fn();
    const mockHandler = () => {};
    createHostMatcher(/any-domain/)(
      // @ts-ignore
      { match: mockRouterMatch },
      "testPath",
      mockHandler
    );
    expect(mockRouterMatch).toHaveBeenCalledTimes(1);
    expect(mockRouterMatch).toHaveBeenCalledWith(
      {
        headers: {
          host: /any-domain/,
        },
        path: "testPath",
      },
      mockHandler
    );
  });

  it("should run domain specific matcher with array or Set of paths", () => {
    const mockRouterMatch = jest.fn();
    const mockHandler = () => {};
    createHostMatcher(/any-domain/)(
      // @ts-ignore
      { match: mockRouterMatch },
      ["testPath1", "testPath2"],
      mockHandler
    );
    expect(mockRouterMatch).toHaveBeenCalledTimes(2);
    expect(mockRouterMatch).toHaveBeenNthCalledWith(
      1,
      {
        headers: {
          host: /any-domain/,
        },
        path: "testPath1",
      },
      mockHandler
    );
    expect(mockRouterMatch).toHaveBeenNthCalledWith(
      2,
      {
        headers: {
          host: /any-domain/,
        },
        path: "testPath2",
      },
      mockHandler
    );

    const mockSetRouterMatch = jest.fn();
    createHostMatcher(/any-domain/)(
      // @ts-ignore
      { match: mockSetRouterMatch },
      new Set(["testPath1", "testPath2"]),
      mockHandler
    );
    expect(mockSetRouterMatch).toHaveBeenCalledTimes(2);
    expect(mockSetRouterMatch).toHaveBeenNthCalledWith(
      1,
      {
        headers: {
          host: /any-domain/,
        },
        path: "testPath1",
      },
      mockHandler
    );
    expect(mockSetRouterMatch).toHaveBeenNthCalledWith(
      2,
      {
        headers: {
          host: /any-domain/,
        },
        path: "testPath2",
      },
      mockHandler
    );
  });
});
