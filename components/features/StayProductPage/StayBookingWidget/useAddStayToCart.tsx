import useAddGTEStayToCart from "./useAddGTEStayToCart";
import useAddMonolithStayToCart from "./useAddMonolithStayToCart";

import { useSettings } from "contexts/SettingsContext";
import { Marketplace } from "types/enums";

const useAddStayToCart = ({
  cartItemId,
  productPageUri,
  productId,
  title = "",
}: {
  cartItemId?: string;
  productPageUri: string;
  productId: number;
  title?: string;
}) => {
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const { addToCartMutation, addToCartLoading, isNotAvailable } = useAddGTEStayToCart({
    productId,
    title,
  });
  const {
    monolithAddToCartMutation,
    monolithAddToCartLoading,
    isMonolithStayNotAvailable,
    hasMonolithPriceChanged,
    monolithPriceAfterChange,
  } = useAddMonolithStayToCart({
    cartItemId,
    productPageUri,
    productId,
    title,
  });
  if (isGTE) {
    return {
      addToCartMutation,
      addToCartLoading,
      isNotAvailable,
      hasPriceChanged: false,
      priceAfterChange: undefined,
    };
  }
  return {
    addToCartMutation: monolithAddToCartMutation,
    addToCartLoading: monolithAddToCartLoading,
    isNotAvailable: isMonolithStayNotAvailable,
    hasPriceChanged: hasMonolithPriceChanged,
    priceAfterChange: monolithPriceAfterChange,
  };
};

export default useAddStayToCart;
