export const getProductCardCurrencyConversionProps = (
  currency: string,
  convertCurrency: (value: number) => number,
  totalSaved?: number,
  price?: number,
  isCurrencyFallback?: boolean
) => ({
  totalSaved: totalSaved && !isCurrencyFallback ? convertCurrency(totalSaved) : undefined,
  price: price && !isCurrencyFallback ? convertCurrency(price!) : undefined,
  currency,
});
