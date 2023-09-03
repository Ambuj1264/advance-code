import React from "react";

import NoIndex from "../components/features/SEO/NoIndex";

import Header from "components/features/Header/MainHeader";
import { getInitialProps } from "components/features/Cart/utils/cartUtils";
import PaymentContainer from "components/features/Cart/PaymentContainer";

const PaymentPage = ({
  finalizeCheckoutInput,
  paymentLinkId,
}: {
  finalizeCheckoutInput?: CartTypes.FinalizeCheckoutInput;
  paymentLinkId?: string;
}) => {
  return (
    <>
      <NoIndex />
      <Header />
      <PaymentContainer
        isMobilePayment
        ssrPaymentLinkId={paymentLinkId}
        finalizeCheckoutInput={finalizeCheckoutInput}
      />
    </>
  );
};

PaymentPage.getInitialProps = getInitialProps;

export default PaymentPage;
