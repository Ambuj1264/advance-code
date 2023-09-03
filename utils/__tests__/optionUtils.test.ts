import { none, some } from "fp-ts/lib/Option";

import { getOptionValue } from "utils/optionUtils";

describe("getDefaultValue", () => {
  test("should return default string", () => {
    expect(getOptionValue(none, "")).toEqual("");
  });
  test("should return value", () => {
    expect(getOptionValue(some("Test string"), "")).toEqual("Test string");
  });
  test("should return the proper type", () => {
    expect(typeof getOptionValue(some("Test string"), "")).toBe("string");
  });
});
