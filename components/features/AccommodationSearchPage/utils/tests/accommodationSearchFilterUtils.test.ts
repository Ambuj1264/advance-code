import {
  mergeDefaultFiltersWithSearchResultFilters,
  isFilterGroupOptionDisabled,
  isOptionDisabled,
  shouldDisableDefaultCheckedFilter,
  combineFilters,
} from "../accommodationSearchFilterUtils";
import {
  mockAccommodationFiltersApi,
  mockApiCombinedAccommodationFilters,
} from "../mockAccommodationsData";

import { mockProductProps0, mockProductSpecs0, mockImage0 } from "utils/mockData/mockGlobalData";
import { FilterType, AccommodationFilterQueryEnum } from "types/enums";

describe("mergeDefaultFiltersWithSearchResultFilters", () => {
  const mockDefaultFilters0 = [
    {
      type: FilterType.CHECKBOX,
      sectionId: "0",
      title: "0",
      Icon: () => null,
      filters: [
        {
          id: "0",
          name: "0",
          disabled: false,
          checked: false,
        },
        {
          id: "1",
          name: "1",
          disabled: false,
          checked: false,
        },
        {
          id: "2",
          name: "2",
          disabled: false,
          checked: false,
        },
        {
          id: "3",
          name: "3",
          disabled: false,
          checked: false,
        },
        {
          id: "4",
          name: "4",
          disabled: false,
          checked: false,
        },
      ],
    },
  ];
  const mockSearchResultFilters0 = [
    {
      type: FilterType.CHECKBOX,
      sectionId: "0",
      title: "0",
      Icon: () => null,
      filters: [
        {
          id: "0",
          name: "0",
          disabled: false,
          checked: false,
        },
        {
          id: "1",
          name: "1",
          disabled: false,
          checked: false,
        },
        {
          id: "2",
          name: "2",
          disabled: false,
          checked: false,
        },
      ],
    },
  ];

  it("should return return the search result filters if the default filters are empty", () => {
    expect(
      mergeDefaultFiltersWithSearchResultFilters({
        defaultFiltersSections: [],
        filtersSections: mockSearchResultFilters0,
      })
    ).toEqual(mockSearchResultFilters0);
  });
  it("should return the search result filters if it is the same as the defaultFilters", () => {
    expect(
      mergeDefaultFiltersWithSearchResultFilters({
        defaultFiltersSections: mockSearchResultFilters0,
        filtersSections: mockSearchResultFilters0,
      })
    ).toEqual(mockSearchResultFilters0);
  });
  it("should disable the filters that cannot be found in the search result filter section", () => {
    const mockResult2 = [
      {
        type: FilterType.CHECKBOX,
        sectionId: "0",
        title: "0",
        Icon: () => null,
        filters: [
          {
            id: "0",
            name: "0",
            disabled: false,
            checked: false,
          },
          {
            id: "1",
            name: "1",
            disabled: false,
            checked: false,
          },
          {
            id: "2",
            name: "2",
            disabled: false,
            checked: false,
          },
          {
            id: "3",
            name: "3",
            disabled: true,
            checked: false,
          },
          {
            id: "4",
            name: "4",
            disabled: true,
            checked: false,
          },
        ],
      },
    ];
    // We need to stringify the object to aboid false negative in test: https://github.com/facebook/jest/issues/8475
    expect(
      JSON.stringify(
        mergeDefaultFiltersWithSearchResultFilters({
          defaultFiltersSections: mockDefaultFilters0,
          filtersSections: mockSearchResultFilters0,
        })
      )
    ).toEqual(JSON.stringify(mockResult2));
  });
});

describe("isFilterGroupOptionDisabled", () => {
  it("should return true because its a category filter and it has a prefilled category", () => {
    const sectionId = AccommodationFilterQueryEnum.CATEGORIES;
    const optionCount = 3;
    const hasPrefilledCategory = true;
    expect(isFilterGroupOptionDisabled(sectionId, optionCount, hasPrefilledCategory)).toEqual(true);
  });
  it("should return false because its a star filter", () => {
    const sectionId = AccommodationFilterQueryEnum.STARS;
    const optionCount = 0;
    const hasPrefilledCategory = false;
    expect(isFilterGroupOptionDisabled(sectionId, optionCount, hasPrefilledCategory)).toEqual(
      false
    );
  });
  it("should return true because its not a category or star filter and count is 0", () => {
    const sectionId = AccommodationFilterQueryEnum.AMENITIES;
    const optionCount = 0;
    const hasPrefilledCategory = true;
    expect(isFilterGroupOptionDisabled(sectionId, optionCount, hasPrefilledCategory)).toEqual(true);
  });
});
describe("isOptionDisabled", () => {
  const commonAccommodation = {
    id: 0,
    image: mockImage0,
    linkUrl: "",
    headline: "",
    description: "",
    ssrPrice: 0,
    specs: mockProductSpecs0,
    props: mockProductProps0,
  };
  const accommodation1 = {
    ...commonAccommodation,
    categoryId: 1,
    stars: 3,
    amenityIds: [123, 234, 345, 456, 789],
  };
  const accommodation2 = {
    ...commonAccommodation,
    categoryId: 2,
    stars: 4,
    amenityIds: [456, 567, 678, 789],
  };
  const accommodation3 = {
    ...commonAccommodation,
    categoryId: 4,
    stars: 0,
    amenityIds: [456, 567, 678, 789],
  };
  it("should return false because optionId is in some accommodation", () => {
    expect(
      isOptionDisabled(
        456,
        [accommodation1, accommodation2],
        AccommodationFilterQueryEnum.AMENITIES,
        false
      )
    ).toEqual(false);
  });
  it("should return false category optionId is in some accommodation", () => {
    expect(
      isOptionDisabled(
        1,
        [accommodation1, accommodation2],
        AccommodationFilterQueryEnum.CATEGORIES,
        false
      )
    ).toEqual(false);
  });
  it("should return true because some category option is prefilled", () => {
    expect(
      isOptionDisabled(
        1,
        [accommodation1, accommodation2],
        AccommodationFilterQueryEnum.STARS,
        true
      )
    ).toEqual(true);
  });
  it("should return true because star optionId is not in some accommodation", () => {
    expect(
      isOptionDisabled(
        1,
        [accommodation1, accommodation2],
        AccommodationFilterQueryEnum.STARS,
        false
      )
    ).toEqual(true);
  });
  it("should return false because star optionId is in some accommodation", () => {
    expect(
      isOptionDisabled(
        3,
        [accommodation1, accommodation2, accommodation3],
        AccommodationFilterQueryEnum.STARS,
        false
      )
    ).toEqual(false);
    expect(
      isOptionDisabled(
        0,
        [accommodation1, accommodation2, accommodation3],
        AccommodationFilterQueryEnum.STARS,
        false
      )
    ).toEqual(false);
  });
});

describe("shouldDisableDefaultCheckedFilter", () => {
  const commonfilter = {
    type: FilterType.BUTTONS,
    sectionId: "category_ids",
    title: "Categories",
    Icon: () => null,
  };
  const filter1 = {
    ...commonfilter,
    filters: [
      {
        id: "0",
        name: "0",
        disabled: false,
        checked: false,
      },
      {
        id: "4",
        name: "4",
        disabled: true,
        checked: true,
      },
    ],
  };
  const filter2 = {
    ...commonfilter,
    filters: [
      {
        id: "0",
        name: "0",
        disabled: false,
        checked: false,
      },
      {
        id: "4",
        name: "4",
        disabled: false,
        checked: true,
      },
    ],
  };
  const filter3 = {
    ...commonfilter,
    sectionId: "stars_ids",
    filters: [
      {
        id: "0",
        name: "0",
        disabled: false,
        checked: false,
      },
      {
        id: "4",
        name: "4",
        disabled: false,
        checked: true,
      },
    ],
  };
  it("should return false because optionId is in some accommodation", () => {
    expect(shouldDisableDefaultCheckedFilter([filter1, filter3])).toEqual(true);
  });
  it("should return false because optionId is in some accommodation", () => {
    expect(shouldDisableDefaultCheckedFilter([filter2, filter3])).toEqual(false);
  });
});

describe("combineFilters", () => {
  it("should combine filters with same name", () => {
    expect(combineFilters(mockAccommodationFiltersApi)).toEqual(
      mockApiCombinedAccommodationFilters
    );
  });
});
