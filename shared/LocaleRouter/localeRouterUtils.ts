import { SupportedLanguages } from "../../types/enums";

export const getCnLocaleFromUri = (
  queryLocale: SupportedLanguages,
  currentRequestUrl: string
): SupportedLanguages => {
  const legacyCnRegExp = /(iceland-photo-tours|guidetoiceland)/;
  return queryLocale === "zh" && currentRequestUrl.match(legacyCnRegExp)
    ? SupportedLanguages.Chinese
    : queryLocale;
};
