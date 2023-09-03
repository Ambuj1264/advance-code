import { FilterSectionListType } from "../FilterTypes";

import {
  onFilterToggle,
  isFilterDisabled,
  getBarHeight,
  getSectionTypeFilters,
  getSectionTypeSelectedFilters,
  getPriceSelectedFilter,
} from "./filtersUtils";

import StayDefaultIcon from "components/icons/extras.svg";
import { FilterType } from "types/enums";

describe("onFilterToggle", () => {
  test("should return an array with a single id", () => {
    const mockSet = jest.fn();
    onFilterToggle(["1337"], mockSet, []);
    expect(mockSet).toBeCalledWith(["1337"]);
  });
  test("should return an empty array when toggling the filter off", () => {
    const mockSet = jest.fn();
    onFilterToggle(["1337"], mockSet, ["1337"]);
    expect(mockSet).toBeCalledWith([]);
  });
});

describe("isFilterDisabled", () => {
  test("should return true because filter is default checked and disabled and has disableDefaultCheckedFilter checked", () => {
    const disabled = true;
    const defaultChecked = true;
    const disableDefaultCheckedFilter = true;
    expect(isFilterDisabled(disabled, defaultChecked, disableDefaultCheckedFilter)).toEqual(true);
  });
  test("should return true because filter is disabled and not default checked", () => {
    const disabled = true;
    const defaultChecked = false;
    const disableDefaultCheckedFilter = true;
    expect(isFilterDisabled(disabled, defaultChecked, disableDefaultCheckedFilter)).toEqual(true);
  });
  test("should return false because filter is default checked and disabled and does not have disableDefaultCheckedFilter checked", () => {
    const disabled = true;
    const defaultChecked = true;
    const disableDefaultCheckedFilter = false;
    expect(isFilterDisabled(disabled, defaultChecked, disableDefaultCheckedFilter)).toEqual(false);
  });
  test("should return true because filter is disabled and not default checked", () => {
    const disabled = true;
    const defaultChecked = false;
    const disableDefaultCheckedFilter = false;
    expect(isFilterDisabled(disabled, defaultChecked, disableDefaultCheckedFilter)).toEqual(true);
  });
  test("should return false because filter is not disabled", () => {
    const disabled = false;
    const defaultChecked = false;
    const disableDefaultCheckedFilter = true;
    expect(isFilterDisabled(disabled, defaultChecked, disableDefaultCheckedFilter)).toEqual(false);
  });
});

describe("getBarHeight", () => {
  const filters = [
    {
      id: "100",
      count: 4,
    },
    {
      id: "50",
      count: 10,
    },
    {
      id: "1000",
      count: 6,
    },
    {
      id: "500",
      count: 20,
    },
  ];
  test("should return barHeight for filter values 50 and 100", () => {
    expect(getBarHeight(filters, 1, 100, false)).toEqual(76);
  });
  test("should return barheight for filter value 1000", () => {
    expect(getBarHeight(filters, 950, 100, false)).toEqual(44);
  });
  test("should return 0 because no filter has value between 2000 and 2100", () => {
    expect(getBarHeight(filters, 2000, 100, false)).toEqual(0);
  });
});

describe("getSectionTypeFilters", () => {
  const starFilters = [
    {
      id: "1Star",
      name: "1 star",
    },
    {
      id: "2Star",
      name: "2 stars",
    },
  ];
  const categoryFilters = [
    {
      id: "hotel",
      name: "Hotel",
    },
    {
      id: "Apartment",
      name: "apartment",
    },
  ];
  const filters = [
    {
      sectionId: "stars",
      title: "Stars",
      Icon: StayDefaultIcon,
      filters: starFilters,
    },
    {
      sectionId: "categories",
      title: "Categories",
      Icon: StayDefaultIcon,
      filters: categoryFilters,
    },
  ] as FilterSectionListType;
  test("should return star filters", () => {
    expect(getSectionTypeFilters(filters, "stars")).toEqual(starFilters);
  });
  test("should return category filters", () => {
    expect(getSectionTypeFilters(filters, "categories")).toEqual(categoryFilters);
  });
  test("should return empty list since filters do not contain sectionid", () => {
    expect(getSectionTypeFilters(filters, "amenities")).toEqual([]);
  });
});

describe("getSectionTypeSelectedFilters", () => {
  const starFilters = [
    {
      id: "1Star",
      name: "1 star",
    },
    {
      id: "2Star",
      name: "2 stars",
    },
  ];
  const categoryFilters = [
    {
      id: "hotel",
      name: "Hotel",
    },
    {
      id: "apartment",
      name: "Apartment",
    },
  ];
  const starQueryParamFilters = ["1Star"];
  const categoryQueryParamFilters = ["apartment"];
  const starSelectedFilters = [
    {
      sectionId: "stars",
      value: ["1Star"],
      name: "1 star",
      queryParamList: starQueryParamFilters,
      filterType: FilterType.BUTTONS,
    },
  ];
  test("should return star selected filters", () => {
    expect(
      getSectionTypeSelectedFilters(starFilters, starQueryParamFilters, "stars", FilterType.BUTTONS)
    ).toEqual(starSelectedFilters);
  });
  const categorySelectedFilters = [
    {
      sectionId: "categories",
      value: ["apartment"],
      name: "Apartment",
      queryParamList: categoryQueryParamFilters,
      filterType: FilterType.CHECKBOX,
    },
  ];
  test("should return categories selected filters", () => {
    expect(
      getSectionTypeSelectedFilters(
        categoryFilters,
        categoryQueryParamFilters,
        "categories",
        FilterType.CHECKBOX
      )
    ).toEqual(categorySelectedFilters);
  });
  test("should return empty array since there are no selected filters", () => {
    expect(
      getSectionTypeSelectedFilters(categoryFilters, [], "categories", FilterType.CHECKBOX)
    ).toEqual([]);
  });
});

describe("getPriceSelectedFilter", () => {
  const priceQueryParamFilters = ["15", "103"];
  const priceSelectedFilter = {
    sectionId: "price",
    value: ["15", "103"],
    name: "15-103 EUR",
    queryParamList: priceQueryParamFilters,
    filterType: FilterType.RANGE,
  };
  test("should return selected price filter", () => {
    expect(
      getPriceSelectedFilter("price", "EUR", (value: number) => value, priceQueryParamFilters)
    ).toEqual(priceSelectedFilter);
  });
  test("should return undefined since the are no selected price filters", () => {
    expect(getPriceSelectedFilter("price", "EUR", (value: number) => value)).toEqual(undefined);
  });
});
