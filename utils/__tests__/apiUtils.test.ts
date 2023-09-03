/* eslint-disable functional/immutable-data */
import { IncomingMessage } from "http";

import { Marketplace, SupportedLanguages } from "../../types/enums";

import {
  getAbsoluteUrl,
  getClientApiUri,
  getCnSubdomainUrl,
  getStrippedUrlPath,
  prependChineseToGTI,
  urlToRelative,
  urlWithChineseLocale,
  constructGtiCnCanonicalUrl,
  shouldSkipBreadcrumbsQuery,
} from "utils/apiUtils";

describe("urlWithChineseLocale", () => {
  test("should return with locale code if it's incorrect", () => {
    const url = "/zh/book-this-trip";
    expect(urlWithChineseLocale(url)).toEqual(`/zh_CN/book-this-trip`);
  });
  test("should return the url if it contains the locale code", () => {
    const url = "/zh_CN/book-this-trip";
    expect(urlWithChineseLocale(url)).toEqual(url);
  });
  test("should correct url for front page", () => {
    const url = "/zh";
    expect(urlWithChineseLocale(url)).toEqual("/zh_CN");
  });
});

describe("urlWithChineseLocale", () => {
  test("should prepend the chinese locale for cn.guidetoiceland", () => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      href: "https://cn.guidetoiceland.is/awesome-tour",
    };

    const url = "/awesome-tour";
    expect(prependChineseToGTI(url)).toEqual(`/zh_CN/awesome-tour`);
  });
  test("should not prepend the chinese locale for non gti", () => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      href: "https://norwaytravelguide.no/awesome-tour",
    };
    const url = "/awesome-tour";
    expect(prependChineseToGTI(url)).toEqual(`/awesome-tour`);
  });
  test("should not prepend even though cn is in the string", () => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      href: "https://norwaytravelcncncncnncguide.no/awesome-tour",
    };
    const url = "/awesome-tour";
    expect(prependChineseToGTI(url)).toEqual(`/awesome-tour`);
  });
});

describe("getStrippedUrlPath", () => {
  const url = "/book-holiday-trips/8-day-self-drive-tour-circle-of-iceland";
  test("should remove hash from url", () => {
    expect(getStrippedUrlPath(`${url}#reviews`)).toBe(url);
  });
  test("should remove ? from url", () => {
    expect(getStrippedUrlPath(`${url}?reviews&amp=1`)).toBe(url);
  });
  test("should return empty string if url is undefined", () => {
    expect(getStrippedUrlPath(undefined)).toBe("");
  });
  test("should remove trailing /", () => {
    expect(getStrippedUrlPath("/")).toBe("");
  });
  test("should remove trailing /", () => {
    expect(getStrippedUrlPath("/book-trips-holiday/")).toBe("/book-trips-holiday");
  });
});

describe("getAbsoluteUrl", () => {
  test("should return correct url for localhost", () => {
    const req = {
      headers: {
        host: "localhost:3000",
      },
    };
    expect(getAbsoluteUrl(req as IncomingMessage)).toBe("http://localhost:3000");
  });
  test("should return correct url for dev.guidetoiceland", () => {
    const req = {
      headers: {
        host: "dev.guidetoiceland.is:3000",
      },
    };
    expect(getAbsoluteUrl(req as IncomingMessage)).toBe("http://dev.guidetoiceland.is:3000");
  });
  test("should return correct url guidetoiceland with https", () => {
    const req = {
      headers: {
        host: "guidetoiceland.is",
      },
    };
    expect(getAbsoluteUrl(req as IncomingMessage)).toBe("https://guidetoiceland.is");
  });
});

describe("getClientApiUri", () => {
  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = {
    hostname: "",
  };

  describe("localhost", () => {
    const localhostArgs = {
      isDev: true,
      absoluteUrl: "localhost:3000",
      isServerlessEnv: false,
      currentRequestUrl: "currentRequestUrl",
      internalUri: "internalUri/client-api",
    };

    it("non serverless — client relative, ssr internal", () => {
      window.location.hostname = "localhost";
      expect(
        getClientApiUri({
          ...localhostArgs,
          isBrowser: true,
        })
      ).toBe("/client-api");

      expect(
        getClientApiUri({
          ...localhostArgs,
          isBrowser: false,
        })
      ).toBe("internalUri/client-api");
    });

    it("serverless - client relative, ssr localhost absoluteUrl", () => {
      window.location.hostname = "localhost";
      expect(
        getClientApiUri({
          ...localhostArgs,
          isServerlessEnv: true,
          isBrowser: true,
        })
      ).toBe("/client-api");

      expect(
        getClientApiUri({
          ...localhostArgs,
          isServerlessEnv: true,
          isBrowser: false,
        })
      ).toBe("localhost:3000/client-api");
    });
  });

  it("branch deployment — client relative, ssr internal", () => {
    const branchDeploymentArgs = {
      isDev: true,
      absoluteUrl: "https://master-web.branch.dev.traveldev.org",
      isServerless: false,
      currentRequestUrl: "currentRequestUrl",
      internalUri: "internalUri/client-api",
    };
    window.location.hostname = "master-web.branch.dev.traveldev.org";

    expect(
      getClientApiUri({
        ...branchDeploymentArgs,
        isBrowser: true,
      })
    ).toBe("/client-api");

    expect(
      getClientApiUri({
        ...branchDeploymentArgs,
        isBrowser: false,
      })
    ).toBe("internalUri/client-api");
  });

  describe("production", () => {
    const prodArgs = {
      isDev: false,
      absoluteUrl: "https://guidetoiceland.is",
      currentRequestUrl: "currentRequestUrl",
      internalUri: "internalUri/client-api",
    };

    it("serverless — both absolute", () => {
      window.location.hostname = "guidetoiceland.is";
      expect(
        getClientApiUri({
          ...prodArgs,
          isServerlessEnv: true,
          isBrowser: true,
        })
      ).toBe("https://guidetoiceland.is/client-api");

      expect(
        getClientApiUri({
          ...prodArgs,
          isServerlessEnv: true,
          isBrowser: false,
        })
      ).toBe("https://guidetoiceland.is/client-api");
    });

    it("non-serverless — client relative; ssr internalUri ", () => {
      window.location.hostname = "guidetoiceland.is";
      expect(
        getClientApiUri({
          ...prodArgs,
          isBrowser: true,
          isServerlessEnv: false,
        })
      ).toBe("internalUri/client-api");

      expect(
        getClientApiUri({
          ...prodArgs,
          isBrowser: false,
          isServerlessEnv: false,
        })
      ).toBe("internalUri/client-api");
    });
  });

  it("GTI CN prod serverless — both absoluteUrl", () => {
    const cnProdArgs = {
      isDev: false,
      absoluteUrl: "https://cn.guidetoiceland.is",
      isServerlessEnv: true,
      currentRequestUrl: "currentRequestUrl",
      internalUri: "internalUri/client-api",
    };
    window.location.hostname = "cn.guidetoiceland.is";

    expect(
      getClientApiUri({
        ...cnProdArgs,
        isBrowser: true,
      })
    ).toBe("https://cn.guidetoiceland.is/client-api");

    expect(
      getClientApiUri({
        ...cnProdArgs,
        isBrowser: false,
      })
    ).toBe("https://cn.guidetoiceland.is/client-api");
  });

  it("host hack on layer0 - client relative; ssr absolute", () => {
    const hostHackArgs = {
      isDev: false,
      absoluteUrl: "https://travelshift-travelshift-web-artur-test.moovweb-edge.io",
      currentRequestUrl: "currentRequestUrl",
      isServerlessEnv: true,
      internalUri: "internalUri/client-api",
    };
    window.location.hostname = "test.guidetoiceland.is";

    expect(
      getClientApiUri({
        ...hostHackArgs,
        isBrowser: true,
      })
    ).toBe("/client-api");

    expect(
      getClientApiUri({
        ...hostHackArgs,
        isBrowser: false,
      })
    ).toBe("https://travelshift-travelshift-web-artur-test.moovweb-edge.io/client-api");
  });

  it("GTI CN prod with incorrect absoluteUrl — client relative, ssr absoluteUrl", () => {
    const prodArgs = {
      isDev: false,
      // incorrect absoluteUrl
      absoluteUrl: "https://guidetoiceland.is",
      isServerlessEnv: true,
      currentRequestUrl: "currentRequestUrl",
      internalUri: "internalUri/client-api",
    };
    window.location.hostname = "cn.guidetoiceland.is";

    expect(
      getClientApiUri({
        ...prodArgs,
        isBrowser: true,
      })
    ).toBe("/client-api");

    expect(
      getClientApiUri({
        ...prodArgs,
        isBrowser: false,
      })
    ).toBe("https://guidetoiceland.is/client-api");
  });
});

describe("getCnSubdomainUrl", () => {
  test("should return cn subdomain for Chinese locale on GTI", () => {
    expect(
      getCnSubdomainUrl(
        "/best-flights",
        "https://guidetoiceland.is",
        SupportedLanguages.LegacyChinese
      )
    ).toEqual("https://cn.guidetoiceland.is/best-flights");
    expect(
      getCnSubdomainUrl("/best-flights", "https://guidetoiceland.is", SupportedLanguages.Chinese)
    ).toEqual("https://cn.guidetoiceland.is/best-flights");
  });

  test("should return regular url for non Chinese locale", () => {
    expect(
      getCnSubdomainUrl("/it/best-flights", "https://guidetoiceland.is", SupportedLanguages.Italian)
    ).toEqual("https://guidetoiceland.is/it/best-flights");
    expect(
      getCnSubdomainUrl("/best-flights", "https://guidetoiceland.is", SupportedLanguages.English)
    ).toEqual("https://guidetoiceland.is/best-flights");
  });
});

describe("urlToRelative", () => {
  it("transforms http://a.com/pathA/pathB to /pathA/pathB", () => {
    expect(urlToRelative("http://a.com/pathA/pathB")).toEqual("/pathA/pathB");
    expect(urlToRelative("https://a.com/pathA/pathB")).toEqual("/pathA/pathB");
  });

  it("transforms http://a.com/ to /", () => {
    expect(urlToRelative("http://a.com/")).toEqual("/");
    expect(urlToRelative("https://a.com/")).toEqual("/");
  });

  it("transforms http://a.com to /", () => {
    expect(urlToRelative("http://a.com")).toEqual("/");
    expect(urlToRelative("https://a.com")).toEqual("/");
  });
});

describe("shouldSkipBreadcrumbsQuery", () => {
  it("returns true when the only type is defined", () => {
    expect(shouldSkipBreadcrumbsQuery({ type: "something" })).toBeTruthy();
    expect(shouldSkipBreadcrumbsQuery({ id: undefined, slug: "", type: "something" })).toBeTruthy();
  });

  it("returns false for the rest of conditions as we don't care about it and it's handled by the graphql schema", () => {
    expect(shouldSkipBreadcrumbsQuery({})).toBeFalsy();
    expect(shouldSkipBreadcrumbsQuery({ type: "something", id: 0 })).toBeFalsy();
    expect(shouldSkipBreadcrumbsQuery({ type: "something", slug: "/slug" })).toBeFalsy();
    expect(shouldSkipBreadcrumbsQuery({ slug: "/slug" })).toBeFalsy();
    expect(shouldSkipBreadcrumbsQuery({ id: 10 })).toBeFalsy();
  });
});

describe("constructGtiCnCanonicalUrl", () => {
  describe("when GTI marketplace", () => {
    describe("when matches /zh/ or /zh_CN/ locales", () => {
      it("removes /zh/ or /zh_CN/ from URI for zh or zh_CH locale", () => {
        expect(
          constructGtiCnCanonicalUrl({
            marketplace: Marketplace.GUIDE_TO_ICELAND,
            activeLocale: SupportedLanguages.Chinese,
            marketplaceUrl: "https://guidetoiceland.is",
            asPath: "/zh/build-your-dreams?query=not-important",
            shouldCleanAsPath: true,
            defaultNonGtiCnCanonicalUrl: "not-used-here",
          })
        ).toBe("https://cn.guidetoiceland.is/build-your-dreams");

        expect(
          constructGtiCnCanonicalUrl({
            marketplace: Marketplace.GUIDE_TO_ICELAND,
            activeLocale: SupportedLanguages.LegacyChinese,
            marketplaceUrl: "https://guidetoiceland.is",
            asPath: "/zh/build-your-dreams?query=not-important",
            shouldCleanAsPath: true,
            defaultNonGtiCnCanonicalUrl: "not-used-here",
          })
        ).toBe("https://cn.guidetoiceland.is/build-your-dreams");

        expect(
          constructGtiCnCanonicalUrl({
            marketplace: Marketplace.GUIDE_TO_ICELAND,
            activeLocale: SupportedLanguages.LegacyChinese,
            marketplaceUrl: "https://guidetoiceland.is",
            asPath: "/zh_CN/build-your-dreams?query=not-important",
            shouldCleanAsPath: true,
            defaultNonGtiCnCanonicalUrl: "not-used-here",
          })
        ).toBe("https://cn.guidetoiceland.is/build-your-dreams");

        expect(
          constructGtiCnCanonicalUrl({
            marketplace: Marketplace.GUIDE_TO_ICELAND,
            activeLocale: SupportedLanguages.Chinese,
            marketplaceUrl: "https://guidetoiceland.is",
            asPath: "/zh_CN/build-your-dreams?query=not-important",
            shouldCleanAsPath: true,
            defaultNonGtiCnCanonicalUrl: "not-used-here",
          })
        ).toBe("https://cn.guidetoiceland.is/build-your-dreams");
      });

      it("returns alternateGtiCnCanonicalUrl for gtiCn", () => {
        expect(
          constructGtiCnCanonicalUrl({
            marketplace: Marketplace.GUIDE_TO_ICELAND,
            activeLocale: SupportedLanguages.Chinese,
            marketplaceUrl: "https://guidetoiceland.is",
            asPath: "/zh/build-your-dreams?query=not-important",
            shouldCleanAsPath: true,
            alternateGtiCnCanonicalUrl: "http://guidetoiceland.is/build-your-dreams",
            defaultNonGtiCnCanonicalUrl: "not-used-here",
          })
        ).toBe("http://guidetoiceland.is/build-your-dreams");
      });
    });

    it("returns defaultNonGtiCnCanonicalUrl for non-zh locales", () => {
      expect(
        constructGtiCnCanonicalUrl({
          marketplace: Marketplace.GUIDE_TO_ICELAND,
          activeLocale: SupportedLanguages.English,
          marketplaceUrl: "https://guidetoiceland.is",
          asPath: "/zh/build-your-dreams?query=not-important",
          shouldCleanAsPath: true,
          alternateGtiCnCanonicalUrl: "not-important",
          defaultNonGtiCnCanonicalUrl: "https://guidetoiceland.is/some/default/url",
        })
      ).toBe("https://guidetoiceland.is/some/default/url");
    });
  });
  it("returns default URL for non-GTI marketplaces", () => {
    expect(
      constructGtiCnCanonicalUrl({
        marketplace: Marketplace.GUIDE_TO_EUROPE,
        activeLocale: SupportedLanguages.Chinese,
        marketplaceUrl: "not-important",
        asPath: "not-important",
        shouldCleanAsPath: true,
        alternateGtiCnCanonicalUrl: "not-important",
        defaultNonGtiCnCanonicalUrl: "https://guidetoeurope.com/some/default/url",
      })
    ).toBe("https://guidetoeurope.com/some/default/url");
  });
});
