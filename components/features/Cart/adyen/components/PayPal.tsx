import React, { useEffect } from "react";
import { Global } from "@emotion/core";
import {
  PayPalElementProps,
  PayPalConfig,
} from "@adyen/adyen-web/dist/types/components/PayPal/types";
import Core from "@adyen/adyen-web/dist/types/core";

import { payPalStyles } from "../adyenStyles";

import { PaymentMethodType } from "components/features/Cart/types/cartEnums";
import { zIndex } from "styles/variables";

const PAYPAL_CONTAINER = "paypal-container";

// So we have transparent paypal button always on top of our submit button and when
// user fill all inputs we enable pointer events on paypal button.
export const setPayPalStyles = ({ isPayPalEnabled }: { isPayPalEnabled: boolean }) => {
  const paypalContainer = document.querySelector<HTMLElement>(".adyen-checkout__paypal");
  if (paypalContainer) {
    // eslint-disable-next-line functional/immutable-data
    paypalContainer.style.zIndex = isPayPalEnabled ? `${zIndex.max + 1}` : "-1";
    // eslint-disable-next-line functional/immutable-data
    paypalContainer.style.pointerEvents = isPayPalEnabled ? "all" : "none";
  }
};

const PayPal = ({
  checkoutRef,
  adyenRef,
  paymentMethods,
  paymentConfig,
  countryCode,
  amount,
  currency,
  setFinalizeCheckoutInput,
  setLoadingForm,
  setPaymentError,
  isFormInvalid,
}: {
  checkoutRef: React.RefObject<Core>;
  adyenRef: React.MutableRefObject<CartTypes.AdyenRefType | null>;
  paymentMethods: CartTypes.PaymentMethod[];
  paymentConfig: CartTypes.QueryPaymentProviderConfig;
  countryCode: string;
  amount: number;
  currency: string;
  setFinalizeCheckoutInput: (finalizeCheckoutInput: CartTypes.FinalizeCheckoutInput) => void;
  setLoadingForm: (loading: boolean) => void;
  setPaymentError: (error?: { errorMessage?: string }) => void;
  isFormInvalid: boolean;
}) => {
  const payPalPaymentMethod = paymentMethods.find(({ type }) => type === PaymentMethodType.PAYPAL);

  useEffect(() => {
    if (payPalPaymentMethod && checkoutRef.current) {
      setLoadingForm(true);

      const paypalConfiguration: PayPalElementProps = {
        amount: {
          value: amount,
          currency,
        },
        countryCode,
        environment: paymentConfig.environment,
        configuration: payPalPaymentMethod.configuration as unknown as PayPalConfig,
        style: {
          height: 50,
        },
        onInit: () => {
          if (!isFormInvalid) {
            setPayPalStyles({ isPayPalEnabled: true });
          }
          setLoadingForm(false);
        },
        onClick: () => {
          setPaymentError();
          setLoadingForm(true);
        },
        onAdditionalDetails: (state: any) => {
          // TODO: add sentry logging
          setFinalizeCheckoutInput(JSON.stringify(state.data.details));
        },
      };

      // eslint-disable-next-line no-param-reassign
      adyenRef.current = {
        ...adyenRef.current,
        [PaymentMethodType.PAYPAL]: checkoutRef.current
          .create(PaymentMethodType.PAYPAL, paypalConfiguration)
          .mount(`#${PAYPAL_CONTAINER}`),
      };
    }

    return () => {
      setLoadingForm(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    adyenRef,
    amount,
    checkoutRef,
    countryCode,
    currency,
    paymentConfig.environment,
    payPalPaymentMethod,
    setFinalizeCheckoutInput,
    setLoadingForm,
    setPaymentError,
  ]);

  useEffect(() => {
    if (isFormInvalid) {
      setPayPalStyles({ isPayPalEnabled: false });
    } else {
      setPayPalStyles({ isPayPalEnabled: true });
    }
  }, [isFormInvalid]);

  if (!payPalPaymentMethod) {
    return null;
  }

  return (
    <>
      <Global styles={payPalStyles} />
      <div id={PAYPAL_CONTAINER} />
    </>
  );
};

export default PayPal;
