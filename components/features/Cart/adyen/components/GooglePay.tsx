import React, { useEffect } from "react";
import {
  GooglePayProps,
  GooglePayPropsConfiguration,
} from "@adyen/adyen-web/dist/types/components/GooglePay/types";
import Core from "@adyen/adyen-web/dist/types/core";

import { normalizeAdyenConfiguration } from "../../utils/cartUtils";

import { PaymentMethodContainer } from "components/features/Cart/adyen/adyenStyles";
import {
  AdyenGooglePayEnvironment,
  OrderPaymentEnvironment,
  PaymentMethodType,
} from "components/features/Cart/types/cartEnums";

const GOOGLE_PAY_CONTAINER = "google-pay-container";

const GooglePay = ({
  checkoutRef,
  adyenRef,
  paymentMethods,
  paymentConfig,
  websiteName,
  countryCode,
  amount,
  currency,
  setLoadingForm,
}: {
  checkoutRef: React.RefObject<Core>;
  adyenRef: React.MutableRefObject<CartTypes.AdyenRefType | null>;
  paymentMethods: CartTypes.PaymentMethod[];
  paymentConfig: CartTypes.QueryPaymentProviderConfig;
  websiteName: string;
  countryCode: string;
  amount: number;
  currency: string;
  setLoadingForm: (loading: boolean) => void;
}) => {
  const googlePayPaymentMethod = paymentMethods.find(
    ({ type }) => type === PaymentMethodType.GOOGLE_PAY
  );

  useEffect(() => {
    if (googlePayPaymentMethod && checkoutRef.current) {
      setLoadingForm(true);
      const googlePayConfig: GooglePayProps = {
        amount: {
          value: amount,
          currency,
        },
        countryCode,
        billingAddressRequired: false,
        shippingAddressRequired: false,
        emailRequired: false,
        shippingOptionRequired: false,
        existingPaymentMethodRequired: false,
        environment:
          paymentConfig.environment === OrderPaymentEnvironment.LIVE
            ? AdyenGooglePayEnvironment.LIVE
            : AdyenGooglePayEnvironment.TEST,
        configuration: normalizeAdyenConfiguration(
          googlePayPaymentMethod.configuration
        ) as GooglePayPropsConfiguration,
      };

      // eslint-disable-next-line no-param-reassign
      adyenRef.current = {
        ...adyenRef.current,
        [PaymentMethodType.GOOGLE_PAY]: checkoutRef.current.create(
          PaymentMethodType.GOOGLE_PAY,
          googlePayConfig
        ),
      };

      adyenRef.current[PaymentMethodType.GOOGLE_PAY]
        .isAvailable()
        .then(() => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          adyenRef.current![PaymentMethodType.GOOGLE_PAY].mount(`#${GOOGLE_PAY_CONTAINER}`);
          setLoadingForm(false);
        })
        .catch(() => {
          setLoadingForm(false);
        });
    }

    return () => {
      setLoadingForm(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    checkoutRef,
    adyenRef,
    paymentConfig,
    websiteName,
    countryCode,
    amount,
    currency,
    setLoadingForm,
  ]);

  if (!googlePayPaymentMethod) {
    return null;
  }

  return <PaymentMethodContainer id={GOOGLE_PAY_CONTAINER} />;
};

export default GooglePay;
