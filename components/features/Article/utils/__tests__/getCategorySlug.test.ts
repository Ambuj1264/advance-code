import { NextPageContext } from "next";

import { getCategorySlug } from "../getInitialProps";

import { SupportedLanguages } from "types/enums";

const mockArticleURIData = [
  {
    uri: "/travel-info/covid-19-information-support",
    category: "",
    slug: "covid-19-information-support",
  },
  {
    uri: "/nature-info/what-to-do-in-iceland#1-explore-the-lake-myvatn-geothermal-area",
    category: "nature-info",
    slug: "what-to-do-in-iceland",
  },
  {
    uri: "/articles/photography-tutorials/ultimate-guide-to-photographing-the-northern-lights",
    category: "",
    slug: "ultimate-guide-to-photographing-the-northern-lights",
  },
  {
    uri: "/zh_CN/travel-info/covid-19-information-support",
    category: "",
    slug: "covid-19-information-support",
  },
];

const mockNextPageContext = (index: number) => {
  // @ts-ignore
  const ctx: NextPageContext = {
    query: {
      slug: mockArticleURIData[index].slug,
      category: mockArticleURIData[index].category,
    },
    asPath: mockArticleURIData[index].uri,
  };
  return ctx;
};

beforeAll(() => {
  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data
  global.window.__NEXT_DATA__ = [];
});

describe("getCategorySlug", () => {
  const mockCtx = mockNextPageContext(0);
  const mockCtx1 = mockNextPageContext(1);
  const mockCtx2 = mockNextPageContext(2);
  const mockCtx3 = mockNextPageContext(3);

  it("should return the correct category from the URL", () => {
    expect(getCategorySlug(mockCtx, SupportedLanguages.English)).toEqual("travel-info");
  });

  it("should use the category object within the context's query object over the URL param", () => {
    expect(getCategorySlug(mockCtx1, SupportedLanguages.English)).toEqual("nature-info");
  });

  it("should return the correct category from the url skipping /articles", () => {
    expect(getCategorySlug(mockCtx2, SupportedLanguages.English)).toEqual("photography-tutorials");
  });

  it("should return the correct category without locale", () => {
    expect(getCategorySlug(mockCtx3, SupportedLanguages.Chinese)).toEqual("travel-info");
  });
});
