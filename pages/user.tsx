import React from "react";
import { NextPageContext } from "next";

import Header from "components/features/Header/MainHeader";
import { Namespaces } from "shared/namespaces";
import { Direction } from "types/enums";
import UserContainer from "components/features/User/UserContainer";
import NoIndex from "components/features/SEO/NoIndex";
import SavedCardsContainer from "components/features/SavedCards/SavedCardsContainer";

const UserPage = (props: { isPaymentMethods: boolean }) => {
  const { isPaymentMethods } = props;
  return (
    <>
      <NoIndex />
      <Header />
      {isPaymentMethods ? <SavedCardsContainer /> : <UserContainer />}
    </>
  );
};

UserPage.getInitialProps = (ctx: NextPageContext) => {
  return {
    isTopServicesHidden: true,
    isSubscriptionFormHidden: true,
    namespacesRequired: [
      Namespaces.commonNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.commonSearchNs,
      Namespaces.orderNs,
      Namespaces.voucherNs,
    ],
    contactUsButtonPosition: Direction.Right,
    queries: [],
    isPaymentMethods: ctx.asPath?.includes("/payment-methods"),
  };
};

export default UserPage;
