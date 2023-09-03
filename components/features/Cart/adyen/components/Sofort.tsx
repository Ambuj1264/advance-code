import React from "react";
import Core from "@adyen/adyen-web/dist/types/core";

import { PaymentMethodType } from "../../types/cartEnums";
import { PaymentMethodContainer } from "../adyenStyles";

import useEffectOnce from "hooks/useEffectOnce";

const SOFORT_CONTAINER = "sofort-container";

const Sofort = ({
  checkoutRef,
  adyenRef,
}: {
  checkoutRef: React.RefObject<Core>;
  adyenRef: React.MutableRefObject<CartTypes.AdyenRefType | null>;
}) => {
  useEffectOnce(() => {
    if (checkoutRef.current) {
      // eslint-disable-next-line no-param-reassign
      adyenRef.current = {
        ...adyenRef.current,
        [PaymentMethodType.SOFORT]: checkoutRef.current
          .create(PaymentMethodType.SOFORT)
          .mount(`#${SOFORT_CONTAINER}`),
      };
    }
  });

  return <PaymentMethodContainer id={SOFORT_CONTAINER} />;
};

export default Sofort;
