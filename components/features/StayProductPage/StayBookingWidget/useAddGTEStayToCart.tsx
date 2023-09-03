import { useCallback } from "react";
import { useMutation } from "@apollo/react-hooks";

import AddStayToCartMutation from "./queries/addStayToCart.graphql";
import { useStayBookingWidgetContext } from "./StayBookingWidgetStateContext";
import { constructStayCartInput } from "./utils/cartUtils";

import { Product, SupportedCurrencies } from "types/enums";
import useActiveLocale from "hooks/useActiveLocale";
import { getLanguagePrefix, addLeadingSlashIfNotPresent } from "utils/helperUtils";
import { useSettings } from "contexts/SettingsContext";
import { datalayerAddProductToCart } from "components/ui/Tracking/trackingUtils";
import { useCurrencyWithDefault } from "hooks/useCurrency";

const useAddGTEStayToCart = ({ productId, title = "" }: { productId: number; title?: string }) => {
  const activeLocale = useActiveLocale();
  const { marketplace } = useSettings();
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const { roomCombinations, price } = useStayBookingWidgetContext();
  const languagePrefix = getLanguagePrefix(activeLocale, marketplace);
  const [addToCartMutation, { data, loading, error }] = useMutation<
    {
      addStayProductToCart: {
        success: boolean;
        message: string;
      };
    },
    {
      input: StayBookingWidgetTypes.MutationAddStayProductToCartInput;
    }
  >(AddStayToCartMutation, {
    onCompleted: ({ addStayProductToCart }) => {
      if (addStayProductToCart.success) {
        const cartLink = addLeadingSlashIfNotPresent(`${languagePrefix}cart`);
        // eslint-disable-next-line functional/immutable-data
        window.location.href = cartLink;
      }
    },
  });
  const addToCart = useCallback(() => {
    datalayerAddProductToCart(
      {
        id: String(productId),
        name: title,
        productType: Product.STAY,
        price: convertCurrency(price).toString(),
        marketplace,
      },
      currencyCode as SupportedCurrencies
    );
    const input = constructStayCartInput({
      productId,
      roomCombinations,
    });
    addToCartMutation({
      variables: {
        input,
      },
      fetchPolicy: "no-cache",
    });
  }, [
    addToCartMutation,
    productId,
    roomCombinations,
    convertCurrency,
    marketplace,
    currencyCode,
    price,
    title,
  ]);

  const success = Boolean(data?.addStayProductToCart?.success) && !error;
  return {
    addToCartMutation: addToCart,
    addToCartLoading: loading,
    isNotAvailable: (!success && data !== undefined) || error !== undefined,
  };
};

export default useAddGTEStayToCart;
