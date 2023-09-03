import {
  constructVacationSearchFilters,
  constructFiltersWithDaysDisabled,
  addAllDaysToDayFilters,
  encodeVPTypeFilterValue,
  decodeVpFilterTypeValues,
} from "./vacationSearchFilterUtils";

import NotImportantIcon from "components/icons/traveler.svg";
import {
  FilterSectionListItemType,
  FilterSectionListType,
} from "components/ui/Filters/FilterTypes";
import { FilterType } from "types/enums";

const filters: QueryVacationPackagesSearchTypes.VacationPackageSearchFilters = {
  destinationsList: [
    {
      id: [2580605],
      name: "Reykjavik",
      available: true,
    },
    {
      id: [2580615],
      name: "Keflavik",
      available: true,
    },
  ],
  activitiesList: [
    {
      id: ["ChIJnXOkuUwL1kgRKT9vWdb_DnI"],
      name: "Perlan",
      available: true,
    },
    {
      id: ["ChIJOyxLnhVCzUgRoOQvu5-Krk0"],
      name: "Icelandic Phallological Museum",
      available: false,
    },
  ],
  numberOfDays: [2, 3],
  allDays: [2, 3, 4, 5, 6, 7],
  price: [
    {
      maxValue: 21.088630952380946,
      count: 1,
      minValue: 0,
    },
    {
      maxValue: 42.17726190476189,
      count: 0,
      minValue: 21.088630952380946,
    },
    {
      maxValue: 105.44315476190474,
      count: 1,
      minValue: 84.35452380952378,
    },
    {
      maxValue: 126.53178571428569,
      count: 0,
      minValue: 105.44315476190474,
    },
  ],
};

const translateFunc = (label: string, options: { [key: string]: number }) =>
  `${label}${options ? JSON.stringify(options) : ""}`;

const expectedDestinations: FilterSectionListItemType = {
  Icon: NotImportantIcon,
  filters: [
    { id: "2580605", name: "Reykjavik", disabled: false, idList: ["2580605"] },
    { id: "2580615", name: "Keflavik", disabled: false, idList: ["2580615"] },
  ],
  sectionId: "destinationIds",
  placeholder: "Search",
  title: "Destinations",
  type: FilterType.CHECKBOX,
};

const expectedActivities: FilterSectionListItemType = {
  Icon: NotImportantIcon,
  filters: [
    {
      id: "ChIJnXOkuUwL1kgRKT9vWdb_DnI",
      name: "Perlan",
      disabled: false,
      idList: ["ChIJnXOkuUwL1kgRKT9vWdb_DnI"],
    },
    {
      id: "ChIJOyxLnhVCzUgRoOQvu5-Krk0",
      name: "Icelandic Phallological Museum",
      disabled: true,
      idList: ["ChIJOyxLnhVCzUgRoOQvu5-Krk0"],
    },
  ],
  sectionId: "activityIds",
  placeholder: "Search",
  title: "Attractions",
  type: FilterType.CHECKBOX,
};

const expectedDuration: FilterSectionListItemType = {
  Icon: NotImportantIcon,
  filters: [
    { id: "2", name: '{numberOfDays} days{"numberOfDays":2}' },
    { id: "3", name: '{numberOfDays} days{"numberOfDays":3}' },
    { id: "4", name: '{numberOfDays} days{"numberOfDays":4}' },
    { id: "5", name: '{numberOfDays} days{"numberOfDays":5}' },
    { id: "6", name: '{numberOfDays} days{"numberOfDays":6}' },
    { id: "7", name: '{numberOfDays} days{"numberOfDays":7}' },
  ],
  sectionId: "numberOfDays",
  title: "Duration",
  type: FilterType.BUTTONS,
};

const expectedPriceRange: FilterSectionListItemType = {
  Icon: NotImportantIcon,
  filters: [
    {
      count: 1,
      id: "21.088630952380946",
    },
    {
      count: 1,
      id: "105.44315476190474",
    },
  ],
  max: 105.44315476190474,
  min: 0,
  sectionId: "price",
  title: "Price",
  type: FilterType.RANGE,
};

describe("constructVacationSearchFilters", () => {
  it("constructs all available filters with all days selected", () => {
    expect(
      constructVacationSearchFilters(
        filters as QueryVacationPackagesSearchTypes.VacationPackageSearchFilters,
        translateFunc as TFunction
      )
    ).toEqual([expectedDestinations, expectedActivities, expectedDuration, expectedPriceRange]);
  });

  it("does not produce empty filters if ones are unavailable", () => {
    const resultFilters = { activitiesList: filters.activitiesList };
    expect(
      constructVacationSearchFilters(
        resultFilters as QueryVacationPackagesSearchTypes.VacationPackageSearchFilters,
        translateFunc as TFunction
      )
    ).toEqual([expectedActivities]);
  });
});

describe("constructFiltersWithDaysDisabled", () => {
  const allDaysFilters = {
    Icon: NotImportantIcon,
    filters: [
      {
        id: "2",
        name: "not important",
      },
      {
        id: "3",
        name: "not important",
      },
      {
        id: "4",
        name: "not important",
      },
    ],
    sectionId: "numberOfDays",
    title: "Duration",
    type: "buttons",
  };

  const expectedAllDaysFilters = {
    Icon: NotImportantIcon,
    filters: [
      {
        id: "2",
        name: "not important",
        disabled: true,
      },
      {
        id: "3",
        name: "not important",
        disabled: false,
      },
      {
        id: "4",
        name: "not important",
        disabled: true,
      },
    ],
    sectionId: "numberOfDays",
    title: "Duration",
    type: "buttons",
  };

  const untouchedFilter = {
    Icon: NotImportantIcon,
    filters: [
      { id: "2", name: "Perlan" },
      {
        id: "3",
        name: "Icelandic Phallological Museum",
      },
      {
        id: "4",
        name: "Icelandic Phallological Museum",
      },
    ],
    sectionId: "activityIds",
    title: "Activities",
    type: "checkbox",
  };

  it("marks some days of only filter with numberOfDays section as disabled", () => {
    const allFilters = [allDaysFilters, untouchedFilter];

    expect(constructFiltersWithDaysDisabled(allFilters as FilterSectionListType, [3])).toEqual([
      expectedAllDaysFilters,
      untouchedFilter,
    ]);
  });
});

describe("addAllDaysToDayFilters", () => {
  it("adds the All days extra filter to numberOfDays section", () => {
    const allDaySection = {
      ...expectedDuration,
    };

    const notImportantSection = expectedDestinations;
    expect(
      addAllDaysToDayFilters(
        [notImportantSection, allDaySection, notImportantSection],
        translateFunc as TFunction
      )
    ).toEqual([
      notImportantSection,
      {
        ...allDaySection,
        filters: [
          ...allDaySection.filters,
          {
            id: "all-days-filter",
            name: "All days",
            resetFilterSection: true,
          },
        ],
      },
      notImportantSection,
    ]);
  });
});

describe("encodeVPTypeFilterValue", () => {
  it("should encode id and categotyType into single scring", () => {
    expect(encodeVPTypeFilterValue("111", "VariationSelectors")).toBe(
      "id:111-type:VariationSelectors"
    );
  });
});

describe("decodeVpFilterTypeValues", () => {
  it("should decode id and categoryType from array of strings to an object", () => {
    expect(
      decodeVpFilterTypeValues([
        "id:111-type:VariationSelectors",
        "id:1111-type:VariationSelectors",
        "id:222-type:Variation",
        "id:333-type:SubType",
        "id:33333-type:SubType",
        "id:000-type:UnknownRandomType",
      ])
    ).toEqual({
      VariationSelectors: ["111", "1111"],
      Variation: ["222"],
      SubType: ["333", "33333"],
      UnknownRandomType: ["000"],
    });
  });

  it("should handle incorrect formats", () => {
    expect(decodeVpFilterTypeValues(["id:111___type:VariationSelectors", "id:1111"])).toEqual({});
  });
});
