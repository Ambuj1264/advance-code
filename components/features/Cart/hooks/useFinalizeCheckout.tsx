import { useCallback, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { isNone } from "fp-ts/lib/Option";
import { ApolloError } from "apollo-client";

import FinalizeCheckoutMutation from "../queries/FinalizeCheckoutMutation.graphql";
import FinalizePaymentLinkMutation from "../../PaymentLink/queries/FinalizePaymentLinkMutation.graphql";
import { OrderPaymentProvider, OrderResultCode } from "../types/cartEnums";
import { getCurrentSessionId } from "../utils/cartUtils";

import useSession from "hooks/useSession";
import useCurrency from "hooks/useCurrency";
import lazyCaptureException from "lib/lazyCaptureException";
import { useSettings } from "contexts/SettingsContext";
import { PageType } from "types/enums";

const useFinalizeCheckout = ({
  onSuccesfullCheckout,
  finalizeCheckoutInput,
  paymentLinkId,
}: {
  onSuccesfullCheckout: (
    voucherId?: string,
    bookedProducts?: CartTypes.CheckoutBookedProducts[],
    forgotPasswordLink?: string,
    hasAccount?: boolean
  ) => void;
  finalizeCheckoutInput?: CartTypes.FinalizeCheckoutInput;
  paymentLinkId?: string;
}) => {
  const { currencyCode } = useCurrency();
  const { marketplace } = useSettings();
  const { queryCompleted: isUserQueryCompleted } = useSession();
  const sessionId = getCurrentSessionId(marketplace);
  const pageType = paymentLinkId ? PageType.PAYMENT_LINK : PageType.CART;

  const onMutationError = useCallback(
    (error: ApolloError) => {
      lazyCaptureException(new Error(`Error on ${pageType} page while finalizing checkout`), {
        tags: {
          sendToAsana: true,
        },
        errorInfo: {
          apolloError: error,
          sessionId,
        },
      });
    },
    [pageType, sessionId]
  );

  const [
    finalizePaymentLinkMutation,
    {
      data: finalizedPaymentLinkData,
      loading: finalizedPaymentLinkLoading,
      error: finalizedPaymentLinkError,
    },
  ] = useMutation<
    {
      finalizePayByLink: PaymentLinkTypes.PayForPaymentLinkQuery;
    },
    {
      input: {
        additionalDataJson?: CartTypes.FinalizeCheckoutInput;
        payByLinkId: string;
      };
    }
  >(FinalizePaymentLinkMutation, {
    onError: onMutationError,
    onCompleted: payByLinkData => {
      if (payByLinkData.finalizePayByLink?.resultCode === OrderResultCode.AUTHORISED) {
        onSuccesfullCheckout();
      }
    },
  });

  const [
    finalizeCheckoutMutation,
    {
      loading: finalizeCheckoutLoading,
      data: finalizedCheckoutData,
      error: finalizedCheckoutError,
    },
  ] = useMutation<
    {
      finalizeCheckout: CartTypes.CheckoutQuery;
    },
    {
      input: {
        additionalDataJson?: CartTypes.FinalizeCheckoutInput;
      };
    }
  >(FinalizeCheckoutMutation, {
    onCompleted: checkoutData => {
      if (checkoutData.finalizeCheckout?.voucherId) {
        onSuccesfullCheckout(
          checkoutData.finalizeCheckout.voucherId,
          checkoutData.finalizeCheckout.bookedProducts,
          checkoutData.finalizeCheckout.forgotPasswordUrl,
          checkoutData.finalizeCheckout.userCreated
        );
      }
    },
    onError: onMutationError,
  });

  useEffect(() => {
    if (finalizeCheckoutInput) {
      const normalizedFinalizeCheckoutInput =
        finalizeCheckoutInput === OrderPaymentProvider.PAYMAYA ? undefined : finalizeCheckoutInput;
      if (paymentLinkId) {
        finalizePaymentLinkMutation({
          variables: {
            input: {
              additionalDataJson: normalizedFinalizeCheckoutInput,
              payByLinkId: paymentLinkId,
            },
          },
        });
      } else {
        finalizeCheckoutMutation({
          variables: {
            input: {
              additionalDataJson: normalizedFinalizeCheckoutInput,
            },
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalizeCheckoutInput, paymentLinkId]);

  const resultCode = paymentLinkId
    ? finalizedPaymentLinkData?.finalizePayByLink?.resultCode
    : finalizedCheckoutData?.finalizeCheckout?.resultCode;

  const isUserSpecificDataLoading = isNone(currencyCode) || !isUserQueryCompleted;

  const isOrderAuthorised = resultCode === OrderResultCode.AUTHORISED;
  const isOrderPending = resultCode === OrderResultCode.PENDING;

  const isWaitingToBeSentToVoucher = isOrderAuthorised || isOrderPending;

  const isWaitingToIssueFinalizeCheckoutQuery =
    isUserSpecificDataLoading &&
    finalizeCheckoutInput &&
    !finalizedCheckoutData &&
    !finalizedPaymentLinkData;

  const isMutationLoading = finalizeCheckoutLoading || finalizedPaymentLinkLoading;

  const isFinalizedCheckoutLoading =
    isWaitingToIssueFinalizeCheckoutQuery || isMutationLoading || isWaitingToBeSentToVoucher;

  const hasUnsuccessfulCheckoutResponse =
    (finalizedCheckoutData?.finalizeCheckout || finalizedPaymentLinkData?.finalizePayByLink) &&
    !isWaitingToBeSentToVoucher;

  if (
    hasUnsuccessfulCheckoutResponse ||
    finalizedCheckoutError !== undefined ||
    finalizedPaymentLinkError !== undefined
  ) {
    return {
      isFinalizedCheckoutLoading,
      finalizedCheckoutError: {
        errorMessage: finalizedCheckoutData?.finalizeCheckout?.refusalReason,
      },
      finalizedPaymentLinkError: {
        errorMessage: finalizedPaymentLinkData?.finalizePayByLink?.refusalReason,
      },
    };
  }

  return {
    isFinalizedCheckoutLoading,
    isOrderAuthorised,
    finalizedCheckoutError: undefined,
    finalizePaymentLinkError: undefined,
  };
};

export default useFinalizeCheckout;
