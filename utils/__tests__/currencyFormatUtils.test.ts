import formatPrice, { getPriceSign } from "../currencyFormatUtils";

describe("formatPrice", () => {
  test("should return correctly formatted price with one comma", () => {
    expect(formatPrice(1499)).toBe("1,499");
  });
  test("should return correctly formatted price with two commas", () => {
    expect(formatPrice(14999999)).toBe("14,999,999");
  });
});

describe("getPriceSign", () => {
  test("should return '+'", () => {
    expect(getPriceSign(1499)).toBe("+");
    expect(getPriceSign(0)).toBe("+");
  });
  test("should return '-'", () => {
    expect(getPriceSign(-1499)).toBe("-");
  });
});
