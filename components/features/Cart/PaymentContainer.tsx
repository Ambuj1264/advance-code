import React from "react";
import { StringParam, useQueryParams } from "use-query-params";

import PaymentLinkContainer from "../PaymentLink/PaymentLinkContainer";

import CartContainer from "./CartContainer";
import PaymentPageDefaultHeadTags from "./PaymentPageDefaultHeadTags";

import { PaymentLinkQueryParam } from "types/enums";

const PaymentContainer = ({
  finalizeCheckoutInput,
  isMobilePayment,
  ssrPaymentLinkId,
}: {
  finalizeCheckoutInput?: CartTypes.FinalizeCheckoutInput;
  isMobilePayment?: boolean;
  ssrPaymentLinkId?: string;
}) => {
  const [{ paymentLinkId: queryParamPaymentLinkId }] = useQueryParams({
    [PaymentLinkQueryParam.PAYMENT_LINK_ID]: StringParam,
  });
  const isPaymentLink = Boolean(ssrPaymentLinkId || queryParamPaymentLinkId);
  return (
    <>
      <PaymentPageDefaultHeadTags isPaymentLink={isPaymentLink} />
      {isPaymentLink ? (
        <PaymentLinkContainer
          isPayment={isMobilePayment}
          finalizeCheckoutInput={finalizeCheckoutInput}
        />
      ) : (
        <CartContainer isPayment={isMobilePayment} finalizeCheckoutInput={finalizeCheckoutInput} />
      )}
    </>
  );
};

export default PaymentContainer;
