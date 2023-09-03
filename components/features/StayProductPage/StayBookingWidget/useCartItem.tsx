import { useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";
import { pipe } from "fp-ts/lib/pipeable";
import { toUndefined, mapNullable, fromNullable } from "fp-ts/lib/Option";

import CurrentStaysCartQuery from "./queries/CurrentStaysCartQuery.graphql";
import { getCartItemIdFromQuery, getCartItem } from "./utils/cartUtils";

import { noCacheHeaders } from "utils/apiUtils";
import { yearMonthDayFormat, getFormattedDate } from "utils/dateUtils";

const useCartItem = () => {
  const cartItemId = useMemo(getCartItemIdFromQuery, []);
  const { data: cartData } = useQuery<StayBookingWidgetTypes.QueryCurrentCart>(
    CurrentStaysCartQuery,
    {
      skip: cartItemId === undefined,
      fetchPolicy: "no-cache",
      context: {
        headers: {
          ...noCacheHeaders,
        },
      },
    }
  );
  const cartItem = useMemo(() => {
    if (!cartItemId) return undefined;
    return pipe(
      fromNullable(cartData),
      mapNullable(cart => getCartItem(cart?.cart?.stays, cartItemId)),
      toUndefined
    );
  }, [cartData, cartItemId]);
  const from = cartItem?.from
    ? getFormattedDate(new Date(cartItem.from), yearMonthDayFormat)
    : undefined;
  const to = cartItem?.to ? getFormattedDate(new Date(cartItem.to), yearMonthDayFormat) : undefined;
  const cartRooms = cartItem?.rooms?.length;
  return {
    cartItem,
    cartDateFrom: from,
    cartDateTo: to,
    cartRooms,
  };
};

export default useCartItem;
