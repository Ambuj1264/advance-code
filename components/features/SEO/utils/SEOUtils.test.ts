import { constructHrefLangs } from "./SEOUtils";

describe("constructHrefLangs", () => {
  const translations: LocaleLink[] = [
    {
      locale: "en",
      uri: "/someUrl",
    },
    {
      locale: "zh_CN",
      uri: "/someUrl",
    },
  ];
  test("should construct correct hreflangs", () => {
    const host = "guidetoiceland.is";
    const hrefLangs = [
      {
        locale: "en",
        uri: "https://guidetoiceland.is/someUrl",
      },
      {
        locale: "zh_CN",
        uri: "https://cn.guidetoiceland.is/someUrl",
      },
    ];
    expect(constructHrefLangs(translations, host, "en")).toEqual(hrefLangs);
  });
  test("should construct correct hreflangs and not prepend cn. to chinese locale for host that is not guidetoiceland.is", () => {
    const host = "guidetoeurope.com";
    const hrefLangs = [
      {
        locale: "en",
        uri: "https://guidetoeurope.com/someUrl",
      },
      {
        locale: "zh_CN",
        uri: "https://guidetoeurope.com/someUrl",
      },
    ];
    expect(constructHrefLangs(translations, host, "en")).toEqual(hrefLangs);
  });
  test("should construct correct hreflangs and remove .cn from locales that are not chinese", () => {
    const host = "cn.guidetoiceland.is";
    const hrefLangs = [
      {
        locale: "en",
        uri: "https://guidetoiceland.is/someUrl",
      },
      {
        locale: "zh_CN",
        uri: "https://cn.guidetoiceland.is/someUrl",
      },
    ];
    expect(constructHrefLangs(translations, host, "zh_CN")).toEqual(hrefLangs);
  });

  test("should construct correct hreflangs and bypass absolute uri of translation links", () => {
    const host = "cn.guidetoiceland.is";
    const hrefLangs = [
      {
        locale: "en",
        uri: "https://guidetoiceland.is/someUrl",
      },
      {
        locale: "zh_CN",
        uri: "https://cn.guidetoiceland.is/someUrl",
      },
    ];
    expect(
      constructHrefLangs(
        [
          ...translations,
          {
            uri: "https://guidetoiceland.is/ko/someUrl",
            locale: "ko",
          },
        ],
        host,
        "zh_CN"
      )
    ).toEqual([
      ...hrefLangs,
      {
        locale: "ko",
        uri: "https://guidetoiceland.is/ko/someUrl",
      },
    ]);
  });
});
