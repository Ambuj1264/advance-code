import { getProductCardCurrencyConversionProps } from "../productGridUtils";

const convertCurrency = (value: number) => value;

describe("getProductCardCurrencyConversionProps", () => {
  test("should return converted prices for product", () => {
    const currency = "USD";
    const isCurrencyFallback = false;
    const product = {
      totalSaved: 12543.400000000001,
      price: 50173.6,
    };

    expect(
      getProductCardCurrencyConversionProps(
        currency,
        convertCurrency,
        product.totalSaved,
        product.price,
        isCurrencyFallback
      )
    ).toEqual({
      totalSaved: 12543.400000000001,
      price: 50173.6,
      currency: "USD",
    });
  });

  test("should return empty prices for product when isCurrencyFallback=true", () => {
    const currency = "USD";
    const isCurrencyFallback = true;
    const product = {
      totalSaved: 12543.400000000001,
      price: 50173.6,
    };

    expect(
      getProductCardCurrencyConversionProps(
        currency,
        convertCurrency,
        product.totalSaved,
        product.price,
        isCurrencyFallback
      )
    ).toEqual({
      totalSaved: undefined,
      price: undefined,
      currency: "USD",
    });
  });

  test("should return empty prices for product when prices are empty", () => {
    const currency = "USD";
    const isCurrencyFallback = true;
    const product = {
      totalSaved: undefined,
      price: undefined,
    };

    expect(
      getProductCardCurrencyConversionProps(
        currency,
        convertCurrency,
        product.totalSaved,
        product.price,
        isCurrencyFallback
      )
    ).toEqual({
      totalSaved: undefined,
      price: undefined,
      currency: "USD",
    });
  });
});
