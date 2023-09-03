import {
  constructCarCategoryInfo,
  removeDuplicateCarFilterOptions,
  areCarTypeOptionsOnCar,
  areOptionsOnCar,
  mergeQueryParamFilters,
  isOptionDisabled,
  areDepositAmountOptionsOnCar,
  shouldDisableDefaultCheckedFilter,
  getDefaultLocations,
} from "./carSearchUtils";

import {
  byPriceConstructor,
  byPriceDescConstructor,
  byRating,
  byPopularityConstructor,
} from "components/ui/Sort/sortUtils";
import {
  mockProductProps0,
  mockProductSpecs0,
  mockImage0,
  mockQueryImage0,
} from "utils/mockData/mockGlobalData";
import { FilterType, CarProvider } from "types/enums";

const mockSearchProduct: CarSearchTypes.CarSearch = {
  id: 11,
  vehicleCategory: "1",
  provider: CarProvider.MONOLITH,
  headline: "mock-name",
  linkUrl: "mock-link",
  averageRating: 4.1,
  reviewsCount: 12,
  price: 13,
  image: {
    id: "mock-imageUrl",
    url: "mock-imageUrl",
    name: "1337",
  },
  carSpecs: mockProductSpecs0,
  carProps: mockProductProps0,
  establishment: {
    name: "car rental",
    image: mockImage0,
  },
  recommendedOrderScore: 3.0,
  priceOrderScore: 2.0,
  filters: [{ filterId: "carType", items: ["small"] }],
};

describe("byPrice", () => {
  it("should return 1 because a has higher price score than b", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, priceOrderScore: 1.0 };
    expect(byPriceConstructor("priceOrderScore")(a, b)).toEqual(1);
  });
  it("should return -1 because b has higher price score than a", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, priceOrderScore: 5.0 };
    expect(byPriceConstructor("priceOrderScore")(a, b)).toEqual(-1);
  });
  it("should return -1 because b has the same price score as a", () => {
    const a = mockSearchProduct;
    const b = mockSearchProduct;
    expect(byPriceConstructor("priceOrderScore")(a, b)).toEqual(-1);
  });
});

describe("byPriceDesc", () => {
  it("should return 1 because a has lower price than b", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, priceOrderScore: 5.0 };
    expect(byPriceDescConstructor("priceOrderScore")(a, b)).toEqual(1);
  });
  it("should return -1 because b has lower price than a", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, priceOrderScore: 1.0 };
    expect(byPriceDescConstructor("priceOrderScore")(a, b)).toEqual(-1);
  });
  it("should return -1 because b has the same price as a", () => {
    const a = mockSearchProduct;
    const b = mockSearchProduct;
    expect(byPriceDescConstructor("priceOrderScore")(a, b)).toEqual(-1);
  });
});

describe("byRating", () => {
  it("should return -1 because a has higher rating than b", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, averageRating: 1.0 };
    expect(byRating(a, b)).toEqual(-1);
  });
  it("should return 1 because b has higher rating than a", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, averageRating: 5.0 };
    expect(byRating(a, b)).toEqual(1);
  });
  it("should return 1 because b has the same rating as a", () => {
    const a = mockSearchProduct;
    const b = mockSearchProduct;
    expect(byRating(a, b)).toEqual(1);
  });
});

describe("byPopularity", () => {
  it("should return 1 because a has higher recommended score than b", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, recommendedOrderScore: 1.0 };
    expect(byPopularityConstructor("recommendedOrderScore")(a, b)).toEqual(1);
  });
  it("should return -1 because b has higher recommended score than a", () => {
    const a = mockSearchProduct;
    const b = { ...mockSearchProduct, recommendedOrderScore: 5.0 };
    expect(byPopularityConstructor("recommendedOrderScore")(a, b)).toEqual(-1);
  });
  it("should return -1 because b has the same recommended score as a", () => {
    const a = mockSearchProduct;
    const b = mockSearchProduct;
    expect(byPopularityConstructor("recommendedOrderScore")(a, b)).toEqual(-1);
  });
});

describe("removeDuplicateCarFilterOptions", () => {
  const results: CarSearchTypes.CarFilterOption[] = [
    { filterOptionId: "0", name: "0", isPrefilled: false },
    { filterOptionId: "2", name: "0", isPrefilled: false },
    { filterOptionId: "3", name: "0", isPrefilled: false },
    { filterOptionId: "4", name: "0", isPrefilled: false },
  ];

  it("should filter out objects with duplicate ids", () => {
    const arrayWithDuplicates: CarSearchTypes.CarFilterOption[] = [
      { filterOptionId: "0", name: "0", isPrefilled: false },
      { filterOptionId: "0", name: "0", isPrefilled: false },
      { filterOptionId: "0", name: "0", isPrefilled: false },
      { filterOptionId: "2", name: "0", isPrefilled: false },
      { filterOptionId: "3", name: "0", isPrefilled: false },
      { filterOptionId: "4", name: "0", isPrefilled: false },
    ];
    expect(removeDuplicateCarFilterOptions(arrayWithDuplicates)).toEqual(results);
  });
  it("should return the same array since there are no duplicates", () => {
    expect(removeDuplicateCarFilterOptions(results)).toEqual(results);
  });
});

describe("constructCarCategoryInfo", () => {
  it("should return -1 because a has higher recommended score than b", () => {
    const queryCategoryInfo = {
      id: 0,
      categoryName: "All of the small cars are here",
      name: "Small cars",
      informationTitle: "Small cars",
      information: "We have a lot of small cars",
      description: "Come get small cars",
      image: mockQueryImage0,
      reviews: {
        rating: 4.7,
        count: 1500,
      },
    };
    const result: SharedTypes.SearchCategoryInfo = {
      id: 0,
      categoryName: "All of the small cars are here",
      informationTitle: "Small cars",
      information: "We have a lot of small cars",
      cover: {
        name: "Small cars",
        description: "Come get small cars",
        image: {
          id: mockQueryImage0.id.toString(),
          url: mockQueryImage0.url,
          name: mockQueryImage0.name,
        },
      },
    };
    expect(constructCarCategoryInfo(queryCategoryInfo)).toEqual(result);
  });
});

describe("areCarTypeOptionsOnCar", () => {
  const carFilters = [
    {
      filterId: "carType",
      items: ["1", "3", "4"],
    },
    {
      filterId: "includedExtras",
      items: ["5"],
    },
  ];
  it("should return true because type small is a filter for this car", () => {
    const queryCarType = ["1", "5"];
    expect(areCarTypeOptionsOnCar(carFilters, queryCarType)).toEqual(true);
  });
  it("should return false because type estate is not a filter for this car", () => {
    const queryCarType = ["5"];
    expect(areCarTypeOptionsOnCar(carFilters, queryCarType)).toEqual(false);
  });
  it("should return true because there are no query parameters", () => {
    expect(areCarTypeOptionsOnCar(carFilters, undefined)).toEqual(true);
  });
});

describe("areOptionsOnCar", () => {
  const carFilters = [
    {
      filterId: "includedInsurances",
      items: ["cdw", "tp", "gp"],
    },
    {
      filterId: "seats",
      items: ["<4", "4-5", "6+"],
    },
    {
      filterId: "carFeatures",
      items: ["automatic", "manual", "diesel"],
    },
  ];
  it("should return true because car has both filters in queryParams", () => {
    const queryParams = ["cdw", "automatic"];
    expect(areOptionsOnCar(carFilters, queryParams)).toEqual(true);
  });
  it("should return false because car does not have filter 4+doors", () => {
    const queryParams = ["cdw", "automatic", "4+doors"];
    expect(areOptionsOnCar(carFilters, queryParams)).toEqual(false);
  });
  it("should return true because there are no query parameters", () => {
    expect(areOptionsOnCar(carFilters, undefined)).toEqual(true);
  });
});

describe("mergeQueryParamFilters", () => {
  const queryParamFilters = {
    carType: undefined,
    includedInsurances: ["cdw", "tp", "gp"],
    seats: ["<4", "4-5", "6+"],
    supplier: undefined,
    carFeatures: ["automatic", "manual", "diesel"],
    includedExtras: undefined,
    supplierLocation: undefined,
    fuelPolicy: undefined,
    milage: undefined,
  };
  it("should return string list with all values from queyParamFilters", () => {
    const results = ["cdw", "tp", "gp", "<4", "4-5", "6+", "automatic", "manual", "diesel"];
    expect(mergeQueryParamFilters(queryParamFilters)).toEqual(results);
  });
});

describe("isOptionDisabled", () => {
  const commonCar = {
    id: 1,
    vehicleCategory: "1",
    provider: CarProvider.MONOLITH,
    headline: "",
    orSimilar: false,
    image: mockImage0,
    linkUrl: "",
    carSpecs: mockProductSpecs0,
    carProps: mockProductProps0,
    averageRating: 3,
    reviewsCount: 0,
    price: 123,
    currency: "USD",
    establishment: {
      name: "",
      image: mockImage0,
    },
    recommendedOrderScore: 0,
    priceOrderScore: 0,
  };
  const carTypeFilter = {
    filterId: "carType",
    items: ["small", "medium", "van"],
  };
  const insuranceFilter = {
    filterId: "includedInsurances",
    items: ["cdw", "tp", "gp"],
  };
  const seatsFilter = {
    filterId: "seats",
    items: ["<4", "4-5", "6+"],
  };
  const car1 = {
    ...commonCar,
    filters: [carTypeFilter, insuranceFilter, seatsFilter],
  };
  const car2 = {
    ...commonCar,
    filters: [carTypeFilter, insuranceFilter],
  };
  const car3 = {
    ...commonCar,
    filters: [carTypeFilter, seatsFilter],
  };
  const optionId = "<4";
  it("should return false because there is a car with option id", () => {
    expect(isOptionDisabled(optionId, [car1, car2, car3], false, false)).toEqual(false);
  });
  it("should return true because its a carType filter and there is some carType filter prefilled ", () => {
    expect(isOptionDisabled(optionId, [car1, car2, car3], true, true)).toEqual(true);
  });
  it("should return true because there is no car with option id", () => {
    expect(isOptionDisabled(optionId, [car2], false, false)).toEqual(true);
  });
});

describe("areDepositAmountOptionsOnCar", () => {
  const carTypeFilter = {
    filterId: "carType",
    items: ["small", "medium", "van"],
  };
  const insuranceFilter = {
    filterId: "includedInsurances",
    items: ["cdw", "tp", "gp"],
  };
  const depositAmountFilter = {
    filterId: "depositAmount",
    items: ["100", "3000", "50000"],
  };
  const queryDepositAmount1 = ["0", "2000"];
  const queryDepositAmount2 = ["3500", "4000"];
  it("should return false because there is a car with option id", () => {
    expect(areDepositAmountOptionsOnCar([carTypeFilter, insuranceFilter], undefined)).toEqual(true);
  });
  it("should return true because its a carType filter and there is some carType filter prefilled ", () => {
    expect(
      areDepositAmountOptionsOnCar(
        [carTypeFilter, insuranceFilter, depositAmountFilter],
        queryDepositAmount1
      )
    ).toEqual(true);
  });
  it("should return true because there is no car with option id", () => {
    expect(
      areDepositAmountOptionsOnCar(
        [carTypeFilter, insuranceFilter, depositAmountFilter],
        queryDepositAmount2
      )
    ).toEqual(false);
  });
});

describe("shouldDisableDefaultCheckedFilter", () => {
  const commonfilter = {
    type: FilterType.BUTTONS,
    sectionId: "carType",
    title: "Car Types",
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
    sectionId: "seats",
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

describe("getDefaultLocations", () => {
  it("should return false because there is a car with option id", () => {
    expect(getDefaultLocations(undefined)).toEqual({
      defaultPickupId: undefined,
      defaultDropoffId: undefined,
    });
  });
  const autofilter = `{"car_type_ids": [1, 2, 3], "categoryFilters": ["1", "2"], "defaultPickupLocation": "1", "defaultDropoffLocation": "1"}`;
  it("should return true because its a carType filter and there is some carType filter prefilled ", () => {
    expect(getDefaultLocations(autofilter)).toEqual({
      defaultPickupId: "1",
      defaultDropoffId: "1",
    });
  });
  it("should return true because there is no car with option id", () => {
    expect(getDefaultLocations("")).toEqual({
      defaultPickupId: undefined,
      defaultDropoffId: undefined,
    });
  });
});
