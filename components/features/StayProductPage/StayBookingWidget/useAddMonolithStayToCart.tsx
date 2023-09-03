import { useCallback } from "react";
import { useMutation } from "@apollo/react-hooks";

import MonolithAddStayToCartMutation from "./queries/monolithAddStayToCart.graphql";
import { useStayBookingWidgetContext } from "./StayBookingWidgetStateContext";
import { constructGTIStayCartInput } from "./utils/cartUtils";

import { Product, SupportedCurrencies } from "types/enums";
import { datalayerAddProductToCart } from "components/ui/Tracking/trackingUtils";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import useActiveLocale from "hooks/useActiveLocale";
import { getLanguagePrefix, addLeadingSlashIfNotPresent } from "utils/helperUtils";
import { useSettings } from "contexts/SettingsContext";

const useAddMonolithStayToCart = ({
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
  const activeLocale = useActiveLocale();
  const { marketplace } = useSettings();
  const { currencyCode } = useCurrencyWithDefault();
  const { groupedRates, roomTypes, selectedDates, occupancies, price } =
    useStayBookingWidgetContext();
  const languagePrefix = getLanguagePrefix(activeLocale, marketplace);
  const [
    monolithAddStayToCartMutation,
    { data: monolithData, loading: monolithLoading, error: monolithError },
  ] = useMutation<
    {
      monolithAddStayToCart: {
        success: boolean;
        available: boolean;
        priceChanged: boolean;
        price: number;
      };
    },
    {
      input: StayBookingWidgetTypes.MutationAddStayToCartInput;
    }
  >(MonolithAddStayToCartMutation, {
    onCompleted: ({ monolithAddStayToCart }) => {
      if (monolithAddStayToCart.success) {
        const cartLink = addLeadingSlashIfNotPresent(`${languagePrefix}cart`);
        // eslint-disable-next-line functional/immutable-data
        window.location.href = cartLink;
      }
    },
  });

  const monolithAddToCart = useCallback(() => {
    const input = constructGTIStayCartInput({
      groupedRates,
      roomTypes,
      selectedDates,
      occupancies,
      productPageUri,
      productId,
      cartItemId,
    });
    datalayerAddProductToCart(
      {
        id: productId.toString(),
        name: title,
        productType: Product.STAY,
        price: price.toString(),
        marketplace,
      },
      currencyCode as SupportedCurrencies
    );
    monolithAddStayToCartMutation({
      variables: {
        input,
      },
      fetchPolicy: "no-cache",
    });
  }, [
    monolithAddStayToCartMutation,
    cartItemId,
    productPageUri,
    groupedRates,
    selectedDates,
    productId,
    roomTypes,
    occupancies,
    currencyCode,
    marketplace,
    price,
    title,
  ]);
  const success = Boolean(monolithData?.monolithAddStayToCart?.success) && !monolithError;
  const available = Boolean(monolithData?.monolithAddStayToCart?.available ?? true);
  const priceChanged = Boolean(monolithData?.monolithAddStayToCart?.priceChanged ?? false);
  const priceAfterChange = monolithData?.monolithAddStayToCart?.price;
  const hasPriceChanged = success === false && priceChanged && priceAfterChange !== undefined;
  return {
    monolithAddToCartMutation: monolithAddToCart,
    monolithAddToCartLoading: monolithLoading,
    isMonolithStayNotAvailable: (monolithError || !available) && !success && !hasPriceChanged,
    hasMonolithPriceChanged: hasPriceChanged,
    monolithPriceAfterChange: priceAfterChange,
  };
};

export default useAddMonolithStayToCart;
