import { updateChildrenAgesValue, changeChildrenAgesLength } from "../sharedAccommodationUtils";

describe("updateChildrenAges", () => {
  const children = [5, 3, 17, 1];
  test("should replace value at the correct index", () => {
    expect(updateChildrenAgesValue(children, 15, 2)).toEqual([5, 3, 15, 1]);
  });
});

describe("changeChildrenAgesLength", () => {
  const children = [5, 3, 17, 1];
  test("should add one item to the array of age 9", () => {
    expect(changeChildrenAgesLength(children, 5)).toEqual([5, 3, 17, 1, 9]);
  });
  test("should remove the last item of the array", () => {
    expect(changeChildrenAgesLength(children, 3)).toEqual([5, 3, 17]);
  });
});
