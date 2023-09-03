import React from "react";
import Core from "@adyen/adyen-web/dist/types/core";

import { PaymentMethodType } from "../../types/cartEnums";
import { PaymentMethodContainer } from "../adyenStyles";

import useEffectOnce from "hooks/useEffectOnce";

const ALI_PAY_CONTAINER = "alipay-container";

const AliPay = ({
  checkoutRef,
  adyenRef,
  paymentMethods,
}: {
  checkoutRef: React.RefObject<Core>;
  adyenRef: React.MutableRefObject<CartTypes.AdyenRefType | null>;
  paymentMethods: CartTypes.PaymentMethod[];
}) => {
  const aliPayPaymentMethod = paymentMethods.find(
    ({ type }) => type === PaymentMethodType.ALI_PAY || type === PaymentMethodType.ALI_PAY_MOBILE
  );

  useEffectOnce(() => {
    if (aliPayPaymentMethod && checkoutRef.current) {
      // eslint-disable-next-line no-param-reassign
      adyenRef.current = {
        ...adyenRef.current,
        [aliPayPaymentMethod.type]: checkoutRef.current
          .create(PaymentMethodType.ALI_PAY)
          .mount(`#${ALI_PAY_CONTAINER}`),
      };
    }
  });

  if (!aliPayPaymentMethod) {
    return null;
  }

  return <PaymentMethodContainer id={ALI_PAY_CONTAINER} />;
};

export default AliPay;
