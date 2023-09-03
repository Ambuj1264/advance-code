import { shouldUseGetForQueries } from "./middlewares";

import { SupportedLanguages } from "types/enums";

describe("shouldUseGetForQueries", () => {
  it("should return false for Chinese locales and browser", () => {
    expect(shouldUseGetForQueries(SupportedLanguages.Chinese, true)).toBe(false);
    expect(shouldUseGetForQueries(SupportedLanguages.Chinese, false)).toBe(true);
    expect(shouldUseGetForQueries(SupportedLanguages.LegacyChinese, true)).toBe(false);
    expect(shouldUseGetForQueries(SupportedLanguages.LegacyChinese, false)).toBe(true);
  });

  it("should return true for any other language, regardless SSR or browser", () => {
    expect(shouldUseGetForQueries(SupportedLanguages.English, true)).toBe(true);
    expect(shouldUseGetForQueries(SupportedLanguages.English, false)).toBe(true);
    expect(shouldUseGetForQueries(SupportedLanguages.French, true)).toBe(true);
    expect(shouldUseGetForQueries(SupportedLanguages.French, false)).toBe(true);
  });
});
