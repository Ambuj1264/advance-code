import { useMutation } from "@apollo/react-hooks";
import { ApolloError } from "apollo-client";
import { MutableRefObject, useCallback } from "react";

import CheckoutAndSaveCardMutation from "../queries/CheckoutAndSaveCardMutation.graphql";
import PayForPaymentLinkMutation from "../../PaymentLink/queries/PayForPaymentLinkMutation.graphql";
import {
  CardType,
  OrderPaymentProvider,
  OrderResultCode,
  PaymentMethodType,
} from "../types/cartEnums";
import {
  constructPaymentRedirectUrl,
  getCurrentSessionId,
  normalizeAdyen3dsFormData,
  normalizeSaltPay3dsFormData,
} from "../utils/cartUtils";

import lazyCaptureException from "lib/lazyCaptureException";
import { PageType, SupportedLanguages } from "types/enums";
import { useSettings } from "contexts/SettingsContext";

type MutationData = SharedTypes.Either<
  {
    payForPayByLink?: PaymentLinkTypes.PayForPaymentLinkQuery;
  },
  {
    checkoutAndSaveCards?: CartTypes.CheckoutQuery;
  }
>;

const getParsedData = (jsonAction: string, pageName: string, paymentLinkId?: string) => {
  try {
    return JSON.parse(jsonAction);
  } catch (error) {
    lazyCaptureException(new Error(`Error on ${pageName} page while parsing jsonAction data`), {
      errorInfo: {
        jsonAction,
        paymentLinkId,
        // @ts-ignore
        errorMessage: error.message,
      },
    });

    return null;
  }
};

const useCheckout = ({
  onError,
  onSuccesfullCheckout,
  on3dsRedirect,
  onPayMayaCheckout,
  activePaymentMethod,
  adyenRef,
  activeLocale,
  paymentLinkId,
  creditCardType,
}: {
  onError: (error: { errorMessage?: string }) => void;
  onSuccesfullCheckout: (
    voucherId?: string,
    bookedProducts?: CartTypes.CheckoutBookedProducts[],
    forgotPasswordLink?: string,
    userCreated?: boolean
  ) => void;
  on3dsRedirect: (normalized3dsData: CartTypes.NormalizedForm3dsData) => void;
  onPayMayaCheckout: (url: string) => void;
  activePaymentMethod: CartTypes.PaymentMethod;
  adyenRef: MutableRefObject<CartTypes.AdyenRefType | null>;
  activeLocale: SupportedLanguages;
  paymentLinkId?: string;
  creditCardType?: CardType;
}) => {
  const { marketplace } = useSettings();
  const sessionId = getCurrentSessionId(marketplace);
  const pageType = paymentLinkId ? PageType.PAYMENT_LINK : PageType.CART;
  const isMayaPaymentType =
    activePaymentMethod.type === PaymentMethodType.MAYA_CREDIT_CARD ||
    activePaymentMethod.type === PaymentMethodType.MAYA_QR ||
    activePaymentMethod.type === PaymentMethodType.MAYA_WALLET_SINGLE_PAYMENT;

  const onMutationError = useCallback(
    (error: ApolloError) => {
      onError({ errorMessage: undefined });
      lazyCaptureException(new Error(`Error on ${pageType} page while checking out`), {
        tags: {
          sendToAsana: true,
        },
        errorInfo: {
          activePaymentMethod,
          creditCardType,
          apolloError: error,
          sessionId,
          paymentLinkId,
        },
      });
    },
    [onError, pageType, activePaymentMethod, creditCardType, sessionId, paymentLinkId]
  );

  const onMutationComplete = useCallback(
    ({
      paymentProvider,
      resultCode,
      jsonAction,
      refusalReason,
      data,
    }: {
      paymentProvider?: OrderPaymentProvider;
      resultCode?: OrderResultCode;
      jsonAction?: string;
      refusalReason?: string;
      data: MutationData;
    }) => {
      if (resultCode === OrderResultCode.ERROR) {
        onError({
          errorMessage:
            refusalReason ||
            "Unfortunately, your reservation failed. You have not been charged. Please try again or choose a different payment method",
        });
        return;
      }
      if (!jsonAction && resultCode === OrderResultCode.REDIRECT) {
        lazyCaptureException(
          new Error(`No jsonAction & REDIRECT - Error on ${pageType} page while checking out`),
          {
            tags: {
              sendToAsana: true,
            },
            errorInfo: {
              activePaymentMethod,
              sessionId,
              receivedData: data,
            },
          }
        );
        onError({ errorMessage: undefined });
        return;
      }
      // This will be called in all Pay Maya cases
      if (
        isMayaPaymentType &&
        resultCode === OrderResultCode.REDIRECT &&
        jsonAction &&
        paymentProvider === OrderPaymentProvider.PAYMAYA
      ) {
        onPayMayaCheckout(jsonAction);
        return;
      }

      if (
        (activePaymentMethod.type === PaymentMethodType.CREDIT_CARD ||
          activePaymentMethod.type === PaymentMethodType.SAVED_CARD) &&
        resultCode === OrderResultCode.REDIRECT &&
        jsonAction
      ) {
        const data3ds = getParsedData(jsonAction, pageType, paymentLinkId);

        if (data3ds) {
          const normalizedData3ds =
            paymentProvider === OrderPaymentProvider.ADYEN
              ? normalizeAdyen3dsFormData(
                  data3ds,
                  constructPaymentRedirectUrl({ activeLocale, paymentLinkId })
                )
              : normalizeSaltPay3dsFormData(data3ds);

          on3dsRedirect(normalizedData3ds);
        } else {
          onError({ errorMessage: undefined });
        }
        return;
      }

      if (resultCode === OrderResultCode.AUTHORISED && !jsonAction) {
        if (data.checkoutAndSaveCards && data.checkoutAndSaveCards.voucherId) {
          // cart
          const { bookedProducts, forgotPasswordUrl, userCreated, voucherId } =
            data.checkoutAndSaveCards;
          onSuccesfullCheckout(voucherId, bookedProducts, forgotPasswordUrl, userCreated);
          return;
        }
        // payment link
        onSuccesfullCheckout();
        return;
      }

      if (paymentProvider === OrderPaymentProvider.ADYEN && jsonAction) {
        const additionalData = getParsedData(jsonAction, pageType, paymentLinkId);
        const { type } = activePaymentMethod as unknown as {
          type: CartTypes.AdditionalDataPaymentMethodType;
        };

        if (additionalData && adyenRef?.current?.[type]) {
          adyenRef.current[type].handleAction(additionalData);
        } else {
          onError({ errorMessage: undefined });
        }
      }
      // Checkout shouldn't return PENDING status
      // Paypal, Sofort, Klarna, iDEAL, Alipay all return the REDIRECT status, but it's not an error
      if (resultCode !== OrderResultCode.AUTHORISED && resultCode !== OrderResultCode.REDIRECT) {
        onError({
          errorMessage: refusalReason,
        });
      }
    },
    [
      isMayaPaymentType,
      activePaymentMethod,
      pageType,
      sessionId,
      onError,
      onPayMayaCheckout,
      paymentLinkId,
      activeLocale,
      on3dsRedirect,
      onSuccesfullCheckout,
      adyenRef,
    ]
  );

  const [payForPaymentLinkMutation] = useMutation<
    {
      payForPayByLink: PaymentLinkTypes.PayForPaymentLinkQuery;
    },
    PaymentLinkTypes.PayForPaymentLinkParams
  >(PayForPaymentLinkMutation, {
    onCompleted: data => {
      const paymentProvider = data.payForPayByLink?.paymentProvider as OrderPaymentProvider;
      const resultCode = data.payForPayByLink?.resultCode as OrderResultCode;
      const jsonAction = data.payForPayByLink?.jsonAction as string;
      const refusalReason = data.payForPayByLink?.refusalReason as string;
      onMutationComplete({ paymentProvider, resultCode, jsonAction, refusalReason, data });
    },
    onError: onMutationError,
  });

  const [checkoutMutation] = useMutation<
    {
      checkoutAndSaveCards: CartTypes.CheckoutQuery;
    },
    CartTypes.CheckoutWithSaveCardParams
  >(CheckoutAndSaveCardMutation, {
    onCompleted: data => {
      const paymentProvider = data.checkoutAndSaveCards?.paymentProvider;
      const resultCode = data.checkoutAndSaveCards?.resultCode;
      const jsonAction = data.checkoutAndSaveCards?.jsonAction;
      const refusalReason = data.checkoutAndSaveCards?.refusalReason;
      onMutationComplete({ paymentProvider, resultCode, jsonAction, refusalReason, data });
    },
    onError: onMutationError,
  });

  const handlePaymentMutation = useCallback(
    async (
      inputVariables:
        | CartTypes.CheckoutWithSaveCardParams
        | PaymentLinkTypes.PayForPaymentLinkParams
    ) => {
      if (paymentLinkId) {
        return payForPaymentLinkMutation({
          variables: inputVariables as PaymentLinkTypes.PayForPaymentLinkParams,
        });
      }
      return checkoutMutation({
        variables: inputVariables as CartTypes.CheckoutWithSaveCardParams,
      });
    },
    [checkoutMutation, payForPaymentLinkMutation, paymentLinkId]
  );

  return handlePaymentMutation;
};

export default useCheckout;
