import {
  adjustPercentageValue,
  formatInputToValidFloatString,
  isFloatOrIntPattern,
} from "../utils";

describe("formatInputToValidFloatString", () => {
  it("should return the same value if the number is shorter than 2 characters", () => {
    expect(formatInputToValidFloatString("22")).toEqual("22");
  });
  it("should add a '.' character if the number is longer than 2 characters", () => {
    expect(formatInputToValidFloatString("222")).toEqual("22.2");
  });
  it("should not add a '.' character if the string already contains it", () => {
    expect(formatInputToValidFloatString("1.23")).toEqual("1.23");
  });
  it("should return an empty string if the value starts with the '.' character", () => {
    expect(formatInputToValidFloatString(".")).toEqual("");
  });
  it("should return an empty string if the value starts with the '0' character", () => {
    expect(formatInputToValidFloatString("0")).toEqual("");
  });
  it("should return an empty string if the string contains non alphanumeric characters except for '.'", () => {
    expect(formatInputToValidFloatString("`?.þ+```")).toEqual("");
  });
  it("should not add the last character if the input already contains 2 decimal places", () => {
    expect(formatInputToValidFloatString("1.445")).toEqual("1.44");
  });
});

describe("isFloatOrIntPattern", () => {
  it("should be falsy if it's an alphabetic character", () => {
    expect(isFloatOrIntPattern("a", "")).toBeFalsy();
  });
  it("should be truthy if it's a numeric character", () => {
    expect(isFloatOrIntPattern("1", "")).toBeTruthy();
  });
  it("should be truthy if it's the '.' character", () => {
    expect(isFloatOrIntPattern(".", "")).toBeTruthy();
  });
  it("should be falsy if it's the '.' character but the previous character in the existing string is '.'", () => {
    expect(isFloatOrIntPattern(".", ".")).toBeFalsy();
  });
});

describe("adjustPercentageValue", () => {
  it("should return 16.67 as the remainder when the sum of adjusted percentages equals 50 and we have 3 additional payers + lead traveler (4)", () => {
    expect(
      adjustPercentageValue({
        numberOfCustomPercentages: 1,
        numberOfExtraPayers: 4,
        sumOfPayerAdjustedPercentages: 50,
      })
    ).toEqual(16.67);
  });
  it("should return -40 as the remainder when the sum of adjusted percentages equals 140 and we have 2 additional payers + lead traveler (3)", () => {
    expect(
      adjustPercentageValue({
        numberOfCustomPercentages: 1,
        numberOfExtraPayers: 2,
        sumOfPayerAdjustedPercentages: 140,
      })
    ).toEqual(-40);
  });
  it("should return 0 as the remainder when the sum of adjusted percentages equals 100 and we have 3 additional payers + lead traveler (4)", () => {
    expect(
      adjustPercentageValue({
        numberOfCustomPercentages: 2,
        numberOfExtraPayers: 4,
        sumOfPayerAdjustedPercentages: 100,
      })
    ).toEqual(0);
  });
});
