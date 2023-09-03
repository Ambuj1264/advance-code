import {
  dummyCompanionArray,
  dummyCompanion,
  mockConstructedUpdatedInput,
  mockConstructedUserData,
  mockQueryResult,
  mockUpdatedUserData,
  mockTravelInterests,
  updatedMockTravelInterests,
  constructedDateObject,
  constructedDateStringInput,
  minMaxPrice,
  mockQueryBudget,
  mockQueryPreferences,
  mockConstructedPreferences,
  mockUserInput,
  mockInvalidUserInput,
  mockInvalidCompanionInput,
} from "../mockUserData";

import {
  addTravelCompanion,
  constructDateInput,
  constructDateObject,
  constructTravelPreferences,
  constructUserBudget,
  isFormInvalid,
  removeTravelcompanion,
  toggleTravelOption,
} from "./userUtils";
import { constructUserQueryContent } from "./constructUserQueryContent";
import { constructMutationIntput } from "./constructMutationIntput";

describe("constructUserQueryContent", () => {
  test("should return correctly constructed user profile data", () => {
    expect(constructUserQueryContent(mockQueryResult.userProfile)).toEqual(mockConstructedUserData);
  });
});

describe("constructMutationIntput", () => {
  test("should return correctly constructed input for user profile mutation", () => {
    expect(
      constructMutationIntput(
        mockUpdatedUserData.mainUser,
        mockUpdatedUserData.frequentTravelers,
        mockUpdatedUserData.travelStyle,
        mockUpdatedUserData.travelInterests,
        mockUpdatedUserData.travelBudget
      )
    ).toEqual(mockConstructedUpdatedInput);
  });
});

// couldn't use toEqual since we generate a UUID when we create a new travel companion..
describe("addTravelCompanion", () => {
  test("should return array containing newly created empty travel comapnion", () => {
    expect(addTravelCompanion(dummyCompanion)).toHaveLength(2);
  });
});

describe("removeTravelcompanion", () => {
  test("should remove element with the specified id and return new array", () => {
    expect(
      removeTravelcompanion(dummyCompanionArray, "a773cb87-03e4-4dc1-08e3-73ffbde4aa69")
    ).toEqual(dummyCompanion);
  });
});

describe("toggleTravelOption", () => {
  test("should return updated array of preferences with the selected options checked field set as true", () => {
    expect(toggleTravelOption("CULTURAL_ATTRACTIONS", mockTravelInterests)).toEqual(
      updatedMockTravelInterests
    );
  });
});

describe("constructDateObject", () => {
  test("should return correctly structured date object ready for use by the dropdowns", () => {
    expect(constructDateObject("2027-06-05T00:00:00Z")).toEqual(constructedDateObject);
  });
});

describe("constructDateInput", () => {
  test("should return correctly structured date string ready to be sent to the backend", () => {
    expect(constructDateInput(constructedDateObject)).toEqual(constructedDateStringInput);
  });
});

describe("constructUserBudget", () => {
  test("should return correctly structured budget object ready for use by the budget slider", () => {
    expect(constructUserBudget(mockQueryBudget)).toEqual(minMaxPrice);
  });
});

describe("constructTravelPreferences", () => {
  test("should return string array containing only ids of preferences", () => {
    expect(constructTravelPreferences(mockQueryPreferences)).toEqual(mockConstructedPreferences);
  });
});

describe("isFormInvalid", () => {
  test("should return false because the form is valid", () => {
    expect(isFormInvalid(mockUserInput, dummyCompanion)).toEqual(false);
  });
  test("should return true because the companions email is invalid", () => {
    expect(isFormInvalid(mockUserInput, mockInvalidCompanionInput)).toEqual(true);
  });
  test("should return true because the users last name is missing", () => {
    expect(isFormInvalid(mockInvalidUserInput, dummyCompanion)).toEqual(true);
  });
});
