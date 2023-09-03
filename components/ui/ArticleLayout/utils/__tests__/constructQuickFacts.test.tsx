import { getDistanceTranslationLabelWithValue } from "../constructQuickFacts";

import { fakeTranslateWithValues } from "utils/testUtils";

describe("getDistanceTranslationLabelWithValue", () => {
  it("returns translation string with meters when quickfact matches meters pattern", () => {
    expect(getDistanceTranslationLabelWithValue(fakeTranslateWithValues, "10 m")).toBe(
      'label:{distance} m, options:{"distance":"10"}'
    );
    expect(getDistanceTranslationLabelWithValue(fakeTranslateWithValues, "10.5 m")).toBe(
      'label:{distance} m, options:{"distance":"10.5"}'
    );
    expect(getDistanceTranslationLabelWithValue(fakeTranslateWithValues, "10,5 m")).toBe(
      'label:{distance} m, options:{"distance":"10,5"}'
    );
  });
  it("returns translation string with kilometers when quickfact matches kilometers pattern", () => {
    expect(getDistanceTranslationLabelWithValue(fakeTranslateWithValues, "10 km")).toBe(
      'label:{distance} km, options:{"distance":"10"}'
    );
    expect(getDistanceTranslationLabelWithValue(fakeTranslateWithValues, "10.1 km")).toBe(
      'label:{distance} km, options:{"distance":"10.1"}'
    );
    expect(getDistanceTranslationLabelWithValue(fakeTranslateWithValues, "10,12 km")).toBe(
      'label:{distance} km, options:{"distance":"10,12"}'
    );
  });
  it("returns translation string as is when quickfact value does not match the pattern", () => {
    expect(getDistanceTranslationLabelWithValue(fakeTranslateWithValues, "m")).toBe(
      'label:m, options:"m"'
    );
    expect(getDistanceTranslationLabelWithValue(fakeTranslateWithValues, "10 km driving")).toBe(
      'label:10 km driving, options:"10 km driving"'
    );

    expect(getDistanceTranslationLabelWithValue(fakeTranslateWithValues, "20 m walking")).toBe(
      'label:20 m walking, options:"20 m walking"'
    );
  });
});
