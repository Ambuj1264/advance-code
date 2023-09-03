import { checkIfScrollPositionHasReachedFooter, createDateCaption } from "../bookingWidgetUtils";

describe("checkIfScrollPositionHasReachedFooter", () => {
  /* eslint-disable functional/immutable-data */
  test("Should return false when user has not scroll at all", () => {
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 1000,
    });
    jest.spyOn(document.documentElement, "scrollHeight", "get").mockImplementation(() => 2000);
    expect(checkIfScrollPositionHasReachedFooter(0, 911)).toBeFalsy();
  });
  test("Should return false when user has scrolled but not enough to view the footer", () => {
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 1000,
    });
    jest.spyOn(document.documentElement, "scrollHeight", "get").mockImplementation(() => 2000);
    expect(checkIfScrollPositionHasReachedFooter(88, 911)).toBeFalsy();
  });
  test("Should return true when user has scrolled the footer into view", () => {
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 2000,
    });
    jest.spyOn(document.documentElement, "scrollHeight", "get").mockImplementation(() => 2000);
    expect(checkIfScrollPositionHasReachedFooter(111, 911)).toBeTruthy();
  });
  /* eslint-enable functional/immutable-data */
});

describe("createDateCaption", () => {
  const dateString0 = "Oct 13";
  const dateString1 = "Oct 19";
  test("Should create a caption with both start and end date", () => {
    expect(createDateCaption(dateString0, dateString1)).toEqual("Oct 13 - Oct 19");
  });
  test("Should create a caption with only startDate", () => {
    expect(createDateCaption(dateString0, dateString0)).toEqual("Oct 13");
  });
  test("Should create a caption with only startDate when start date is set but not end date", () => {
    expect(createDateCaption(dateString0, undefined)).toEqual("Oct 13");
  });
});
