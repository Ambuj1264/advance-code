export const localizedPriceString = ({
  price,
  locale,
  options,
}: {
  price: number;
  locale?: string;
  options?: { currency: string };
}) => {
  return price.toLocaleString(locale, options);
};

// eslint-disable-next-line default-param-last
const formatCurrency = (price?: number, locale = "en-US", options?: { currency: string }) =>
  price !== undefined ? localizedPriceString({ price: Math.ceil(price), locale, options }) : price;

export const roundPrice = (price?: number) =>
  price !== undefined ? (Math.round(price * 100) / 100).toLocaleString() : price;

const ceilPriceToInteger = (price: number) => (price !== undefined ? Math.ceil(price) : price);

export const roundPriceToInteger = (price: number): number => Math.round(price);

export const getPriceSign = (price: number) => (Math.sign(price) >= 0 ? "+" : "-");

export const formatPrice = (
  price?: number,
  shouldFormatPrice?: boolean,
  // eslint-disable-next-line default-param-last
  locale = "en-US",
  options?: { currency: string }
): number | string => {
  if (!price) return 0;
  return shouldFormatPrice
    ? formatCurrency(price, locale, options) ?? 0
    : localizedPriceString({ price: roundPriceToInteger(price), locale, options });
};

export const formatPriceAsInt = (price?: number, shouldFormatPrice?: boolean): number => {
  if (!price) return 0;
  return shouldFormatPrice ? ceilPriceToInteger(price) : roundPriceToInteger(price);
};

export default formatCurrency;
