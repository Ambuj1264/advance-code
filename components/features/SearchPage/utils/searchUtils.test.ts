import { defaultSEOImage } from "../../../ui/LandingPages/utils/landingPageUtils";

import {
  normalizeCategoryHeaderData,
  constructDisabledFilter,
  constructFilters,
  constructSearchTour,
  getTotalSaved,
  constructClientTours,
  normalizeTourAutocompleteResults,
  getIsTourSearchPageIndexed,
} from "./searchUtils";
import {
  mockDurationFilter0,
  mockFilters0,
  mockActivitiesFilter0,
  mockAttractionsFilter0,
  mockQueryTourAutoCompleteLocations,
  mockTourAutoCompleteLocations,
} from "./mockSearchPageData";

import {
  mockQueryProductSpecs0,
  mockProductSpecs0,
  mockQueryProductProps0,
  mockProductProps0,
} from "utils/mockData/mockGlobalData";

const mockTourCategoryHeaderQueryData: SearchPageTypes.QueryCategoryHeader = {
  tourCategoryHeader: {
    id: 10,
    name: "mock-name",
    description: "mock-description",
    url: "https://guidetoiceland.is/mock-url",
    imageUrl: "https://guidetoiceland.is/mock-image",
    averageReviewScore: 50,
    reviewCount: 99,
  },
};

const mockTourCategoryHeaderData = {
  title: "mock-name",
  description: "mock-description",
  images: [
    {
      id: "0",
      url: "https://guidetoiceland.is/mock-image",
      name: "mock-name",
    },
  ],
  reviewTotalScore: 50,
  reviewTotalCount: 99,
};

const mockQuerySearchTour0: SharedTypes.QueryTour = {
  id: 11,
  name: "mock-name",
  description: "mock-description",
  linkUrl: "mock-link",
  averageRating: "4.1",
  reviewsCount: 12,
  price: 13,
  ssrPrice: 13,
  image: {
    id: 123,
    url: "mock-imageUrl",
    alt: "1337",
  },
  banner: {
    text: "mock-banner-text",
  },

  specs: mockQueryProductSpecs0,
  props: mockQueryProductProps0,
};

const mockSearchTour0: SharedTypes.Product = {
  id: 11,
  headline: "mock-name",
  description: "mock-description",
  linkUrl: "mock-link",
  averageRating: 4.1,
  reviewsCount: 12,
  price: 13,
  ssrPrice: 13,
  image: {
    id: "123",
    url: "mock-imageUrl",
    name: "1337",
  },
  ribbonLabelText: "mock-banner-text",

  specs: mockProductSpecs0,
  props: mockProductProps0,
};

describe("normalizeCategoryHeaderData", () => {
  it("should normalize the query data", () => {
    expect(normalizeCategoryHeaderData(mockTourCategoryHeaderQueryData)).toEqual(
      mockTourCategoryHeaderData
    );
  });
});

describe("constructTour", () => {
  it("should correctly convert from a querySearchTour to a searchTour", () => {
    expect(constructSearchTour(mockQuerySearchTour0)).toEqual(mockSearchTour0);
  });
});

describe("getTotalSaved", () => {
  it("should return undefined if price is undefined", () => {
    expect(getTotalSaved(undefined, 1000)).toEqual(undefined);
  });
  it("should return undefined if basePrice is undefined", () => {
    expect(getTotalSaved(1000, undefined)).toEqual(undefined);
  });
  it("should return undefined if basePrice and price is the same", () => {
    expect(getTotalSaved(1000, 1000)).toEqual(undefined);
  });
  it("should return the correct difference", () => {
    expect(getTotalSaved(1000, 1750)).toEqual(750);
  });
});

describe("constructTopTours", () => {
  const mockQuerySearchTopTour0: SharedTypes.QueryTour = {
    id: 11,
    name: "mock-name",
    description: "mock-description",
    linkUrl: "mock-link",
    averageRating: "4.1",
    reviewsCount: 12,
    ssrPrice: 1000,
    image: {
      id: 123,
      url: "mock-imageUrl",
      alt: "1337",
    },

    specs: mockQueryProductSpecs0,
    props: mockQueryProductProps0,
  };

  const mockSearchTopTour0: SharedTypes.Product = {
    id: 11,
    headline: "mock-name",
    description: "mock-description",
    linkUrl: "mock-link",
    averageRating: 4.1,
    reviewsCount: 12,
    price: 900,
    image: {
      id: "123",
      url: "mock-imageUrl",
      name: "1337",
    },
    ssrPrice: 1000,
    ribbonLabelText: "10% discount",
    totalSaved: 100,
    specs: mockProductSpecs0,
    props: mockProductProps0,
  };

  it("should construct the tours the same as constructTours if client results is undefiend", () => {
    expect(constructClientTours([mockQuerySearchTour0])).toEqual([mockSearchTour0]);
  });

  it("should construct the dynamic variables need on the client and add them to the tour", () => {
    expect(
      constructClientTours(
        [mockQuerySearchTopTour0],
        [
          {
            id: 11,
            price: 900,
            basePrice: 1000,
            banner: {
              text: "10% discount",
            },
          },
        ]
      )
    ).toEqual([mockSearchTopTour0]);
  });
});

describe("constructDisabledFilter", () => {
  it("should return disabled for all except the first filter", () => {
    expect(constructDisabledFilter(mockDurationFilter0, [mockDurationFilter0[1]])).toEqual([
      {
        id: "1",
        name: "Day tour",
        disabled: true,
      },
      {
        id: "2",
        name: "2 days",
        disabled: false,
      },
      {
        id: "3",
        name: "3 days",
        disabled: true,
      },
    ]);
  });
});

describe("constructFilters", () => {
  it("should return the defaultFilters if the activeFilters are undefined", () => {
    expect(constructFilters(mockFilters0, undefined)).toEqual(mockFilters0);
  });
  it("should return the filters with the correctly disabled options", () => {
    expect(
      constructFilters(mockFilters0, {
        durations: mockDurationFilter0,
        activities: [mockActivitiesFilter0[1]],
        attractions: [mockAttractionsFilter0[2]],
      })
    ).toEqual({
      durations: mockDurationFilter0.map(duration => ({
        ...duration,
        disabled: false,
      })),
      activities: [
        { ...mockActivitiesFilter0[0], disabled: true },
        { ...mockActivitiesFilter0[1], disabled: false },
        { ...mockActivitiesFilter0[2], disabled: true },
      ],
      attractions: [
        { ...mockAttractionsFilter0[0], disabled: true },
        { ...mockAttractionsFilter0[1], disabled: true },
        { ...mockAttractionsFilter0[2], disabled: false },
      ],
    });
  });
});

describe("normalizeTourAutocompleteResults", () => {
  it("should return return normalized tour autocomplete results", () => {
    expect(normalizeTourAutocompleteResults(mockQueryTourAutoCompleteLocations)).toEqual(
      mockTourAutoCompleteLocations
    );
  });
  it("should return return an empty array in case of tour autocomplete results are empty", () => {
    // @ts-ignore
    expect(normalizeTourAutocompleteResults(undefined)).toEqual([]);
    expect(
      // @ts-ignore
      normalizeTourAutocompleteResults({ tourStartingLocations: undefined })
    ).toEqual([]);
  });
});

describe("getIsTourSearchPageIndexed", () => {
  const pageMetadata = {
    title: "",
    description: "",
    isIndexed: true,
    hreflangs: [],
    ogImage: defaultSEOImage,
  };

  it("should favor value from metadata over internal criteria", () => {
    expect(
      getIsTourSearchPageIndexed({
        metadata: {
          pageMetadata: { ...pageMetadata, isIndexed: true },
        },
        isTourCategory: true,
        page: 1,
        totalPages: 5,
      })
    ).toBe(true);

    expect(
      getIsTourSearchPageIndexed({
        metadata: {
          pageMetadata: { ...pageMetadata, isIndexed: false },
        },
        isTourCategory: true,
        page: 1,
        totalPages: 5,
      })
    ).toBe(false);
  });

  it("should return true in case metadata value is undefined and page is not bigger than totalPages", () => {
    expect(
      getIsTourSearchPageIndexed({
        metadata: {
          // @ts-ignore
          pageMetadata: { ...pageMetadata, isIndexed: null },
        },
        isTourCategory: true,
        page: 1,
        totalPages: 5,
      })
    ).toBe(true);
  });

  it("should return false in case page bigger than totalPages", () => {
    expect(
      getIsTourSearchPageIndexed({
        metadata: {
          // @ts-ignore
          pageMetadata: { ...pageMetadata, isIndexed: true },
        },
        isTourCategory: true,
        page: 555,
        totalPages: 5,
      })
    ).toBe(false);
  });

  it("should return false in case metadata value is undefined and page bigger than totalPages", () => {
    expect(
      getIsTourSearchPageIndexed({
        metadata: {
          // @ts-ignore
          pageMetadata: { ...pageMetadata, isIndexed: null },
        },
        isTourCategory: true,
        page: 555,
        totalPages: 5,
      })
    ).toBe(false);
  });

  it("should return false for search pages", () => {
    expect(
      getIsTourSearchPageIndexed({
        metadata: {
          pageMetadata: { ...pageMetadata, isIndexed: true },
        },
        isTourCategory: false,
        page: undefined,
        totalPages: 1,
      })
    ).toBe(false);

    expect(
      getIsTourSearchPageIndexed({
        metadata: {
          pageMetadata: { ...pageMetadata, isIndexed: false },
        },
        isTourCategory: false,
        page: undefined,
        totalPages: 1,
      })
    ).toBe(false);
  });
});
