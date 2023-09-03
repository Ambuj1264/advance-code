/* eslint-disable functional/immutable-data */
import { getCartItemId } from "../tourCartUtils";

const { location } = window;

describe("getCartItemId", () => {
  test("Should return undefined since there is no cart item id in the query parameters", () => {
    // @ts-ignore
    delete window.location;
    window.location = { ...location, search: "" };
    expect(getCartItemId()).toBeUndefined();
    window.location = location;
  });
  test("Should return undefined since there is no cart item id in the query parameters", () => {
    // @ts-ignore
    delete window.location;
    window.location = { ...location, search: "?cart_item=3" };
    expect(getCartItemId()).toEqual("3");
    window.location = location;
  });
});
