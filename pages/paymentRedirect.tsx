import React from "react";
import { NextPageContext } from "next";

import PaymentRedirectContainer from "components/features/Cart/PaymentRedirectContainer";
import { constructFinalizeCheckoutInput } from "components/features/Cart/utils/cartUtils";
import NoIndex from "components/features/SEO/NoIndex";
import { Namespaces } from "shared/namespaces";

const PaymentRedirectPage = ({
  finalizeCheckoutInput,
}: {
  finalizeCheckoutInput?: CartTypes.FinalizeCheckoutInput;
}) => {
  return (
    <>
      <NoIndex />
      <PaymentRedirectContainer finalizeCheckoutInput={finalizeCheckoutInput} />
    </>
  );
};

PaymentRedirectPage.getInitialProps = async (ctx: NextPageContext) => {
  const finalizeCheckoutInput = await constructFinalizeCheckoutInput(ctx);
  return {
    isTopServicesHidden: true,
    isSubscriptionFormHidden: true,
    hidePageFooter: true,
    isContactUsHidden: true,
    namespacesRequired: [Namespaces.orderNs],
    contactUsButtonPosition: undefined,
    finalizeCheckoutInput,
  };
};

export default PaymentRedirectPage;
