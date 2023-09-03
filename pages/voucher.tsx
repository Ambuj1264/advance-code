import React from "react";
import { NextPageContext } from "next";
import { useRouter } from "next/router";

import Header from "components/features/Header/MainHeader";
import VoucherContainer from "components/features/Voucher/VoucherContainer";
import MarketplaceInformationQuery from "components/ui/Order/graphql/MarketplaceInformationQuery.graphql";
import { Namespaces } from "shared/namespaces";
import { Direction } from "types/enums";
import {
  getLanguageFromContext,
  getMarketplaceUrl,
  getStrippedUrlPath,
  urlToRelative,
} from "utils/apiUtils";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import useLocaleLinks from "components/features/Header/Header/useLocaleLinksQuery";

const VoucherPage = ({ isPaymentLinkVoucher }: { isPaymentLinkVoucher: boolean }) => {
  const { asPath } = useRouter();
  const localeLinks = useLocaleLinks(getStrippedUrlPath(asPath)).map(link => ({
    ...link,
    uri: urlToRelative(link.uri),
  }));

  return (
    <>
      <Header gteLocaleLinks={localeLinks} />
      <VoucherContainer isPaymentLinkVoucher={isPaymentLinkVoucher} />
    </>
  );
};

VoucherPage.getInitialProps = (ctx: NextPageContext) => {
  const locale = normalizeGraphCMSLocale(getLanguageFromContext(ctx));
  const marketplaceUrl = getMarketplaceUrl(ctx);
  const { paymentLinkId } = ctx.query;

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
    isPaymentLinkVoucher: paymentLinkId != null,
    queries: [
      {
        query: MarketplaceInformationQuery,
        variables: {
          url: marketplaceUrl,
          locale,
        },
      },
    ],
  };
};

export default VoucherPage;
