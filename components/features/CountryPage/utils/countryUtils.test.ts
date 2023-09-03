import { normalizeCountryHeaderData } from "./countryUtils";

const mockHeaderQueryData: CountryPageTypes.QueryCategoryHeader = {
  metadata: {
    title: "mock-name",
    subtitle: "mock-description",
  },
  image: {
    id: "0",
    name: "mock-name",
    url: "https://guidetoiceland.is/mock-image",
  },
};

const mockHeaderData: SharedTypes.CategoryHeaderData = {
  title: "mock-name",
  description: "mock-description",
  images: [
    {
      id: "0",
      url: "https://guidetoiceland.is/mock-image",
      name: "mock-name",
    },
  ],
};

describe("normalizeCountryHeaderData", () => {
  it("should normalize the query data", () => {
    expect(normalizeCountryHeaderData(mockHeaderQueryData)).toEqual(mockHeaderData);
  });
});
