import { useCallback } from "react";
import { Option, toUndefined } from "fp-ts/lib/Option";

import PaymentLinkWithPaymentProvidersQuery from "../../PaymentLink/queries/PaymentLinkWithPaymentProvidersQuery.graphql";
import { onCompletedCartQuery } from "../utils/cartUtils";
import CartWithProvidersQuery from "../queries/CartWithProvidersQuery.graphql";
import { BroadcastChannelCartActions, OrderPaymentProvider } from "../types/cartEnums";

import { BroadcastChannelNames, SupportedCurrencies } from "types/enums";
import { noCacheHeaders } from "utils/apiUtils";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import lazyCaptureException from "lib/lazyCaptureException";
import useBroadcastChannel from "hooks/useBroadcastChannel";
import useQueryClient from "hooks/useQueryClient";

const useFetchCartData = ({
  isPaymentLink = false,
  currencyCode,
  isCurrencyEmpty,
  finalizeCheckoutInputState,
  queryParamsCartId,
  savedCartId,
  queryParamPaymentLinkId,
  onPaymentLinkAlreadyPaid,
  queryParamPaymentProvider,
}: {
  onPaymentLinkAlreadyPaid?: () => void;
  isPaymentLink?: boolean;
  currencyCode: Option<string>;
  isCurrencyEmpty: boolean;
  finalizeCheckoutInputState?: CartTypes.FinalizeCheckoutInput;
  queryParamsCartId?: string;
  savedCartId?: string;
  queryParamPaymentLinkId?: string;
  queryParamPaymentProvider?: OrderPaymentProvider;
}) => {
  const { marketplace } = useSettings();
  const activeLocale = useActiveLocale();
  const isMobile = useIsMobile();

  const onFetchDataComplete = useCallback(
    (cartData?: CartTypes.CartData) => {
      if (!finalizeCheckoutInputState && cartData && Object.keys(cartData).length !== 0) {
        onCompletedCartQuery({
          cartData,
          marketplace,
          activeLocale,
          isMobile,
          paymentLinkId: queryParamPaymentLinkId,
          paymentProvider: queryParamPaymentProvider,
        });
      }
    },
    [
      activeLocale,
      finalizeCheckoutInputState,
      isMobile,
      marketplace,
      queryParamPaymentLinkId,
      queryParamPaymentProvider,
    ]
  );

  const {
    error: cartError,
    data: cartWithProvidersData,
    refetch,
    loading: cartDataLoading,
  } = useQueryClient<CartTypes.QueryCartWithProviders>(CartWithProvidersQuery, {
    context: {
      headers: noCacheHeaders,
      fetchOptions: {
        method: "POST",
      },
    },
    variables: {
      currencyCode: toUndefined(currencyCode) as SupportedCurrencies,
      cartId: queryParamsCartId,
    },
    skip: isPaymentLink || isCurrencyEmpty || Boolean(savedCartId),
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    onCompleted: dataQueryCart => onFetchDataComplete(dataQueryCart.cartWithPaymentProviders?.cart),
  });

  // Work around for "Unhandled Rejection (TypeError): Cannot read property 'refetch' of undefined"
  // https://github.com/apollographql/react-apollo/issues/3862#issuecomment-629856710
  const fetchCartData = useCallback(() => {
    setTimeout(refetch);
  }, [refetch]);

  const {
    error: paymentLinkError,
    data: paymentLinkWithProvidersData,
    refetch: fetchPaymentLinkData,
    loading: paymentLinkDataLoading,
  } = useQueryClient<PaymentLinkTypes.QueryPaymentLinkWithProviders>(
    PaymentLinkWithPaymentProvidersQuery,
    {
      context: {
        headers: noCacheHeaders,
        fetchOptions: {
          method: "POST",
        },
      },
      variables: {
        currencyCode: toUndefined(currencyCode) as SupportedCurrencies,
        payByLinkId: queryParamPaymentLinkId,
      },
      skip: !isPaymentLink || isCurrencyEmpty || !queryParamPaymentLinkId,
      fetchPolicy: "no-cache",
      notifyOnNetworkStatusChange: true,
      onError: apolloError => {
        lazyCaptureException(
          new Error(
            `Error on payment link page while fetching PaymentLinkWithPaymentProvidersQuery`
          ),
          {
            errorInfo: {
              apolloError,
              payByLinkId: queryParamPaymentLinkId,
            },
          }
        );
      },
      onCompleted: dataPaymentLink => {
        if (dataPaymentLink.payByLinkWithPaymentProviders.payByLink.paid) {
          onPaymentLinkAlreadyPaid?.();
          return;
        }
        onFetchDataComplete(dataPaymentLink.payByLinkWithPaymentProviders.payByLink.cart);
      },
    }
  );

  const updateCartItems = useCallback(
    (msgEvent: MessageEvent<SharedTypes.BroadcastChannelMessageData>) => {
      if (
        msgEvent.origin === window.origin &&
        msgEvent.data?.actionName === BroadcastChannelCartActions.REFETCH_CART_DATA
      ) {
        fetchCartData();
      }
    },
    [fetchCartData]
  );

  useBroadcastChannel({
    channelName: BroadcastChannelNames.MINICART,
    handleMessage: updateCartItems,
  });

  const cart = isPaymentLink
    ? paymentLinkWithProvidersData?.payByLinkWithPaymentProviders?.payByLink?.cart
    : cartWithProvidersData?.cartWithPaymentProviders?.cart;

  return {
    cart,
    error: cartError || paymentLinkError,
    paymentLinkWithProvidersData,
    cartWithProvidersData,
    loading: cartDataLoading || paymentLinkDataLoading,
    fetchCartData,
    fetchPaymentLinkData,
  };
};

export default useFetchCartData;
