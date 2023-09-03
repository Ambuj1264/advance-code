import { validatePasswordStrength } from "./auth0Utils";

const noSpecialChar = "Guide12345";
const noNumber = "Guidetoeu...";
const ShortPW = "Gte.23";
const noUpper = "guide.europe123";
const tooLongPW21Chars = "Guide.europe123Guide.";
const validPW = "Guide.europe123";
const validUpperbound = "Guide.europe123Guide";

describe("validatePasswordStrength", () => {
  test("returns false when password is less than 8 characters", () => {
    expect(validatePasswordStrength(ShortPW)).toBeFalsy();
  });

  test("returns false when password does not contain uppercase letter", () => {
    expect(validatePasswordStrength(noUpper)).toBeFalsy();
  });

  test("returns false when password is too long, but valid otherwise", () => {
    expect(validatePasswordStrength(tooLongPW21Chars)).toBeFalsy();
  });

  test("returns true when password is valid and ready for submission", () => {
    expect(validatePasswordStrength(validPW)).toBeTruthy();
  });

  test("returns true when password contains digits and no special characters", () => {
    expect(validatePasswordStrength(noSpecialChar)).toBeTruthy();
  });

  test("returns true when password contains special characters and no digits", () => {
    expect(validatePasswordStrength(noNumber)).toBeTruthy();
  });

  test("returns true when password is exactly 20 chars long", () => {
    expect(validatePasswordStrength(validUpperbound)).toBeTruthy();
  });
});
