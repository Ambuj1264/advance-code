import React from "react";
import { useRouter } from "next/router";

import NoIndex from "../components/features/SEO/NoIndex";
import useLocaleLinks from "../components/features/Header/Header/useLocaleLinksQuery";
import { getStrippedUrlPath, urlToRelative } from "../utils/apiUtils";

import Header from "components/features/Header/MainHeader";
import { getInitialProps } from "components/features/Cart/utils/cartUtils";
import { useSettings } from "contexts/SettingsContext";
import { Marketplace } from "types/enums";
import PaymentLinkContainer from "components/features/PaymentLink/PaymentLinkContainer";
import PaymentPageDefaultHeadTags from "components/features/Cart/PaymentPageDefaultHeadTags";

const PaymentLinkPage = ({
  finalizeCheckoutInput,
}: {
  finalizeCheckoutInput?: CartTypes.FinalizeCheckoutInput;
}) => {
  const { marketplace } = useSettings();
  const { asPath } = useRouter();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const localeLinks = useLocaleLinks(getStrippedUrlPath(asPath)).map(link => ({
    ...link,
    uri: isGTE ? urlToRelative(link.uri) : link.uri,
  }));
  return (
    <>
      <NoIndex />
      <PaymentPageDefaultHeadTags isPaymentLink />
      <Header gteLocaleLinks={localeLinks} />
      <PaymentLinkContainer finalizeCheckoutInput={finalizeCheckoutInput} />
    </>
  );
};

PaymentLinkPage.getInitialProps = getInitialProps;

export default PaymentLinkPage;
