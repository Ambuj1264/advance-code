import { getPrevPageInfo, hasNextPageCheck } from "./SearchResultUtils";

describe("getPrevPageInfo", () => {
  test("returns first page when current page is less than the limit", () => {
    expect(getPrevPageInfo(9, "1")).toEqual({ hasPreviousPage: false, prevPageCursor: "1" });
  });
  test("returns the previous page cursor based on the total results per page (currentPage - limit)", () => {
    expect(getPrevPageInfo(9, "28")).toEqual({ hasPreviousPage: true, prevPageCursor: "19" });
    expect(getPrevPageInfo(10, "21")).toEqual({ hasPreviousPage: true, prevPageCursor: "11" });
  });
  test("returns first page cursor when handling country/city page 2 (currentPage > 0 && currentPage < limit)", () => {
    expect(getPrevPageInfo(9, "4")).toEqual({ hasPreviousPage: true, prevPageCursor: "1" });
    expect(getPrevPageInfo(10, "5")).toEqual({ hasPreviousPage: true, prevPageCursor: "1" });
  });
});

describe("checkIfNextPage", () => {
  test("should return if next page based on nextPageNumber, limit and lastSearchResultPage", () => {
    expect(hasNextPageCheck("10", 9, "1")).toEqual(true);
    expect(hasNextPageCheck("40", 9, "37")).toEqual(false);
    expect(hasNextPageCheck(null, 9, "37")).toEqual(false);
  });
  test("should return false for next page because of maximum results from API(100)", () => {
    expect(hasNextPageCheck("100", 9, "91")).toEqual(false);
  });
});
