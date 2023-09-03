import { mockQueryCategory0, mockCategory0 } from "../utils/mockSearchPageData";

import { constructCategories } from "./SearchPageCategoriesContainer";

describe("constructReviews", () => {
  test("should return correctly constructed reviews", () => {
    expect(constructCategories([mockQueryCategory0])).toEqual([mockCategory0]);
  });
});
