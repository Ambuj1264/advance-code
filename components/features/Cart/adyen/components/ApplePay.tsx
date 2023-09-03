import React, { useEffect } from "react";
import { ApplePayElementProps } from "@adyen/adyen-web/dist/types/components/ApplePay/types";
import Core from "@adyen/adyen-web/dist/types/core";

import { PaymentMethodType } from "../../types/cartEnums";
import { PaymentMethodContainer } from "../adyenStyles";
import { normalizeAdyenConfiguration } from "../../utils/cartUtils";

const APPLE_PAY_CONTAINER = "apple-pay-container";

const ApplePay = ({
  checkoutRef,
  adyenRef,
  paymentMethods,
  websiteName,
  countryCode,
  amount,
  currency,
  setLoadingForm,
}: {
  checkoutRef: React.RefObject<Core>;
  adyenRef: React.MutableRefObject<CartTypes.AdyenRefType | null>;
  paymentMethods: CartTypes.PaymentMethod[];
  websiteName: string;
  countryCode: string;
  amount: number;
  currency: string;
  setLoadingForm: (loading: boolean) => void;
}) => {
  const applePayPaymentMethod = paymentMethods.find(
    ({ type }) => type === PaymentMethodType.APPLE_PAY
  );

  useEffect(() => {
    if (applePayPaymentMethod && checkoutRef.current) {
      setLoadingForm(true);
      const applePayConfig: ApplePayElementProps = {
        amount: {
          value: amount,
          currency,
        },
        countryCode,
        totalPriceLabel: websiteName,
        configuration: normalizeAdyenConfiguration(
          applePayPaymentMethod.configuration
        ) as ApplePayElementProps["configuration"],
      };

      // eslint-disable-next-line no-param-reassign
      adyenRef.current = {
        ...adyenRef.current,
        [PaymentMethodType.APPLE_PAY]: checkoutRef.current.create(
          PaymentMethodType.APPLE_PAY,
          applePayConfig
        ),
      };

      adyenRef.current[PaymentMethodType.APPLE_PAY]
        .isAvailable()
        .then(() => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          adyenRef.current![PaymentMethodType.APPLE_PAY].mount(`#${APPLE_PAY_CONTAINER}`);
          setLoadingForm(false);
        })
        .catch(() => {
          setLoadingForm(false);
        });
    }

    return () => {
      setLoadingForm(false);
    };
  }, [
    adyenRef,
    amount,
    applePayPaymentMethod,
    checkoutRef,
    countryCode,
    currency,
    setLoadingForm,
    websiteName,
  ]);

  if (!applePayPaymentMethod) {
    return null;
  }

  return <PaymentMethodContainer id={APPLE_PAY_CONTAINER} />;
};

export default ApplePay;
