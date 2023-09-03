import { useMemo, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { pipe } from "fp-ts/lib/pipeable";
import { fromNullable, mapNullable, toUndefined } from "fp-ts/lib/Option";

import { constructCartItem, getCartItem, getCartItemId } from "../utils/tourCartUtils";
import currentCartQuery from "../queries/CurrentCart.graphql";

import { noCacheHeaders } from "utils/apiUtils";

const useTourEditItem = ({
  id,
  onTourCartQueryCompleted,
}: {
  id: number;
  onTourCartQueryCompleted(tourCartItem: TourBookingWidgetTypes.EditItem): void;
}) => {
  const cartItemId = useMemo(getCartItemId, []);
  const [editItem, setEditItem] = useState<TourBookingWidgetTypes.EditItem>();

  const { loading: isCurrentCartQueryLoading } = useQuery<TourCartTypes.QueryCart>(
    currentCartQuery,
    {
      skip: cartItemId === undefined,
      fetchPolicy: "no-cache",
      context: {
        headers: noCacheHeaders,
      },
      onCompleted: data => {
        const tourCartItem = pipe(
          fromNullable(data),
          mapNullable(cart => getCartItem(cart.currentCart.items, id, cartItemId)),
          mapNullable(queryCartItem => constructCartItem(queryCartItem)),
          toUndefined
        );

        if (tourCartItem) {
          setEditItem(tourCartItem);
          onTourCartQueryCompleted(tourCartItem);
        }
      },
    }
  );

  return { editItem, isCurrentCartQueryLoading };
};

export default useTourEditItem;
