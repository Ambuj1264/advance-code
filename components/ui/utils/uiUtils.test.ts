import { checkIsPhoneNumberValid, getReplacedLocale, normalisePhoneNumber } from "./uiUtils";

import { SupportedLanguages } from "types/enums";

describe("checkIsPhoneNumberValid", () => {
  test("should return true because phone number is valid", () => {
    expect(checkIsPhoneNumberValid("2", "+222")).toEqual(true);
    expect(checkIsPhoneNumberValid("3", "+38093")).toEqual(true);
    expect(checkIsPhoneNumberValid("+", "")).toEqual(true);
    expect(checkIsPhoneNumberValid("+", undefined)).toEqual(true);
  });

  test("should return true because phone number is valid without optional '+' symbol", () => {
    expect(checkIsPhoneNumberValid("3", "38093")).toEqual(true);
  });

  test("should return true because phone number is valid by max lenght", () => {
    expect(checkIsPhoneNumberValid("9", "+12345678", 10)).toEqual(true);
  });

  test("should return false because phone number is not valid", () => {
    expect(checkIsPhoneNumberValid("a", "123")).toEqual(false);
    expect(checkIsPhoneNumberValid("-", "2")).toEqual(false);
    expect(checkIsPhoneNumberValid("$", "222")).toEqual(false);
    expect(checkIsPhoneNumberValid("/", "38093")).toEqual(false);
    expect(checkIsPhoneNumberValid("+", "+38093")).toEqual(false);
  });

  test("should return false because phone number is not valid by max lenght", () => {
    expect(checkIsPhoneNumberValid("9", "+1234567811", 10)).toEqual(false);
  });
});

describe("normalisePhoneNumber", () => {
  test("should return the same string if it is empty", () => {
    expect(normalisePhoneNumber("")).toEqual("");
  });
  test("should return the same phone number if number starts with '+' ", () => {
    expect(normalisePhoneNumber("+123123")).toEqual("+123123");
  });
  test("should add '+' to the same phone number if it doesn't have '+' symbol", () => {
    expect(normalisePhoneNumber("123123")).toEqual("+123123");
  });
});

describe("getReplacedLocale", () => {
  it("replaces new locale for the given if there's a replacement for it", () => {
    expect(
      getReplacedLocale(SupportedLanguages.English, [
        {
          old: SupportedLanguages.Chinese,
          new: SupportedLanguages.LegacyChinese,
        },
        { old: SupportedLanguages.English, new: SupportedLanguages.Icelandic },
        { old: SupportedLanguages.Dutch, new: SupportedLanguages.Danish },
      ])
    ).toEqual(SupportedLanguages.Icelandic);
  });

  it("returns given locale if it's not found in replaced locales", () => {
    expect(
      getReplacedLocale(SupportedLanguages.English, [
        { old: SupportedLanguages.Chinese, new: SupportedLanguages.Icelandic },
      ])
    ).toEqual(SupportedLanguages.English);
  });

  it("returns given locale if there's no replaced locales", () => {
    expect(getReplacedLocale(SupportedLanguages.English)).toEqual(SupportedLanguages.English);
  });
});
