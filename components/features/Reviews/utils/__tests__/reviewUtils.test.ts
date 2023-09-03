import {
  constructReviewScoreText,
  constructReviews,
  shouldShowSeeMoreReviewsButton,
  filterReviewLocales,
  shouldShowEmptyReviewsMessage,
} from "../reviewUtils";
import {
  mockReviewScore0,
  mockReviewScoreText0,
  mockReviewScore1,
  mockReviewScoreText1,
  mockReviewScore2,
  mockReviewScoreText2,
  mockReviewScore3,
  mockReviewScoreText3,
  mockReviewScore4,
  mockReviewScoreText4,
  mockQueryReviews0,
  mockReviews0,
} from "../mockData/mockReviewData";

describe("constructReviewScoreText", () => {
  test("should return correct text when reviewScore is 1", () => {
    expect(constructReviewScoreText(mockReviewScore0)).toEqual(mockReviewScoreText0);
  });
  test("should return correct text when reviewScore is 2", () => {
    expect(constructReviewScoreText(mockReviewScore1)).toEqual(mockReviewScoreText1);
  });
  test("should return correct text when reviewScore is 3", () => {
    expect(constructReviewScoreText(mockReviewScore2)).toEqual(mockReviewScoreText2);
  });
  test("should return correct text when reviewScore is 4", () => {
    expect(constructReviewScoreText(mockReviewScore3)).toEqual(mockReviewScoreText3);
  });
  test("should return correct text when reviewScore is 5", () => {
    expect(constructReviewScoreText(mockReviewScore4)).toEqual(mockReviewScoreText4);
  });
});

describe("constructReviews", () => {
  test("should return correctly constructed reviews", () => {
    expect(constructReviews(mockQueryReviews0)).toEqual(mockReviews0);
  });
});

describe("shouldShowSeeMoreReviewsButton", () => {
  test("should return false if total number of reviews is the same as the state length", () => {
    expect(
      shouldShowSeeMoreReviewsButton({
        stateReviewsLength: 100,
        reviewTotalCount: 100,
        responseReviewsLength: 0,
        limit: 10,
        showEmptyReviewsMessage: false,
      })
    ).toEqual(false);
  });
  test("should return false if the fetched reviews are less than the limit", () => {
    expect(
      shouldShowSeeMoreReviewsButton({
        stateReviewsLength: 50,
        reviewTotalCount: 100,
        responseReviewsLength: 5,
        limit: 10,
        showEmptyReviewsMessage: false,
      })
    ).toEqual(false);
  });
  test("should return true if all conditions match", () => {
    expect(
      shouldShowSeeMoreReviewsButton({
        stateReviewsLength: 50,
        reviewTotalCount: 100,
        responseReviewsLength: 10,
        limit: 10,
        showEmptyReviewsMessage: false,
      })
    ).toEqual(true);
  });
  test("should return false if all conditions match but show empty reviews is true", () => {
    expect(
      shouldShowSeeMoreReviewsButton({
        stateReviewsLength: 50,
        reviewTotalCount: 100,
        responseReviewsLength: 10,
        limit: 10,
        showEmptyReviewsMessage: true,
      })
    ).toEqual(false);
  });
});

describe("shouldShowEmptyReviews", () => {
  test("should return false if reviews length is not 0", () => {
    expect(shouldShowEmptyReviewsMessage(5, false)).toEqual(false);
  });
  test("should return false if reviews are loading", () => {
    expect(shouldShowEmptyReviewsMessage(0, true)).toEqual(false);
  });
  test("should return true if reviews are not loading and reviews length is 0", () => {
    expect(shouldShowEmptyReviewsMessage(0, true)).toEqual(false);
  });
});

describe("filterReviewLocales", () => {
  const locales = [
    { code: "it", name: "Italian" },
    { code: "en", name: "English" },
    { code: "de", name: "Deutsch" },
  ];
  const localeOptions = ["en", "it"];
  const result = [
    { code: "it", name: "Italian" },
    { code: "en", name: "English" },
  ];
  test("should return correct text when reviewScore is 1", () => {
    expect(filterReviewLocales(locales, localeOptions)).toEqual(result);
  });
  test("should return correct text when reviewScore is 2", () => {
    expect(filterReviewLocales([], localeOptions)).toEqual([]);
  });
  test("should return correct text when reviewScore is 3", () => {
    expect(filterReviewLocales(locales, [])).toEqual([]);
  });
  test("should return correct text when reviewScore is 3", () => {
    expect(filterReviewLocales([], [])).toEqual([]);
  });
});
