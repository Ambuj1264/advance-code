import { isNone } from "fp-ts/lib/Option";

import useCurrency, { useCurrencyWithDefault } from "./useCurrency";

export const useCurrencyWithSSR = (currencyCode?: string) => {
  const { currencyCode: userCurrencyCode } = useCurrency();
  const { currencyCode: defaultCurrencyCode } = useCurrencyWithDefault();
  const { convertCurrency: convertUserCurrency } = useCurrencyWithDefault();

  if (currencyCode) {
    return {
      currencyCode,
      convertCurrency: (value: number) => value,
      isCurrencyFallback: false,
    };
  }
  return {
    currencyCode: defaultCurrencyCode,
    convertCurrency: convertUserCurrency,
    isCurrencyFallback: isNone(userCurrencyCode),
  };
};
