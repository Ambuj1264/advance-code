import { constructTypeOfBlogs, constructCategoriesFilter } from "../bloggerSearchUtils";

describe("constructTypeOfBlogs", () => {
  test("should return undefiend if array is empty", () => {
    expect(constructTypeOfBlogs([])).toEqual("all");
  });
  test("should return all if array has both local and travel", () => {
    expect(constructTypeOfBlogs(["local", "travel"])).toEqual("all");
  });
  test("should return all local if only local in array", () => {
    expect(constructTypeOfBlogs(["local"])).toEqual("local");
  });
  test("should return all travel if only travel in array", () => {
    expect(constructTypeOfBlogs(["travel"])).toEqual("travel");
  });
});

const mockCategories = {
  localCategories: [
    {
      id: 1035,
      name: "Travel Photography",
    },
    {
      id: 1036,
      name: "Best of Iceland",
    },
  ],
  travelCategories: [
    {
      id: 1337,
      name: "Travel Dancing",
    },
    {
      id: 1036,
      name: "Best of Iceland",
    },
  ],
};

describe("constructCategoriesFilter", () => {
  test("should return empty array if categories are undefined", () => {
    expect(constructCategoriesFilter("all", undefined)).toEqual([]);
  });
  test("should return all categories if blogType is all", () => {
    expect(constructCategoriesFilter("all", mockCategories)).toEqual([
      {
        id: "1035",
        name: "Travel Photography",
        disabled: false,
      },
      {
        id: "1036",
        name: "Best of Iceland",
        disabled: false,
      },
      {
        id: "1337",
        name: "Travel Dancing",
        disabled: false,
      },
    ]);
  });
  test("should return only return local categories", () => {
    expect(constructCategoriesFilter("local", mockCategories)).toEqual([
      {
        id: "1035",
        name: "Travel Photography",
        disabled: false,
      },
      {
        id: "1036",
        name: "Best of Iceland",
        disabled: false,
      },
      {
        id: "1337",
        name: "Travel Dancing",
        disabled: true,
      },
    ]);
  });
  test("should return only return travel categories", () => {
    expect(constructCategoriesFilter("travel", mockCategories)).toEqual([
      {
        id: "1035",
        name: "Travel Photography",
        disabled: true,
      },
      {
        id: "1036",
        name: "Best of Iceland",
        disabled: false,
      },
      {
        id: "1337",
        name: "Travel Dancing",
        disabled: false,
      },
    ]);
  });
});
