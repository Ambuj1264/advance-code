import { pipe } from "fp-ts/lib/pipeable";
import { findFirst } from "fp-ts/lib/Array";
import { toUndefined, map } from "fp-ts/lib/Option";
import dateFnsParse from "date-fns/parse";

import { yearMonthDayFormat } from "utils/dateUtils";
import { getQueryParams } from "utils/helperUtils";

export const constructCartItem = (item: TourCartTypes.QueryItem) => ({
  itemId: item.itemId,
  productId: item.productId,
  type: item.type,
  name: item.name,
  persons: item.persons,
  adults: item.adults,
  teenagers: item.teenagers || 0,
  children: item.children || 0,
  date: dateFnsParse(item.date, yearMonthDayFormat, new Date()),
  time: item.time,
  tourDetails: {
    pickupType: item.tourDetails.pickupType,
    tourPickup: item.tourDetails.tourPickup,
    placeId: item.tourDetails.placeId || 0,
    placeName: item?.tourDetails.placeName?.trim() ?? "",
    options: item.tourDetails.options ?? [],
  },
});

export const getCartItem = (
  cartItems: TourCartTypes.QueryItem[],
  productId: number,
  cartItemId?: string | string[]
) =>
  pipe(
    cartItems,
    findFirst(
      (cartItem: TourCartTypes.QueryItem) =>
        String(cartItem.itemId) === cartItemId && cartItem.productId === productId
    ),
    toUndefined
  );

export const getCartItemId = () =>
  pipe(
    getQueryParams(),
    findFirst(([key]) => key === "cart_item"),
    map(([, value]) => value),
    toUndefined
  );
