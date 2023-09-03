import React from "react";
import { useTranslation } from "react-i18next";

import { getHTMLCartTitle } from "./utils/cartUtils";

import { useSettings } from "contexts/SettingsContext";
import { Namespaces } from "shared/namespaces";
import DefaultHeadTags from "lib/DefaultHeadTags";
import { getMetadataTitle } from "components/ui/utils/uiUtils";

const PaymentPageDefaultHeadTags = ({ isPaymentLink }: { isPaymentLink?: boolean }) => {
  const { marketplace, websiteName } = useSettings();
  const { t } = useTranslation(Namespaces.cartNs);
  const htmlTitle = isPaymentLink
    ? getMetadataTitle(t("Payment link"), websiteName)
    : getHTMLCartTitle(marketplace, websiteName, t);

  return <DefaultHeadTags title={htmlTitle} />;
};

export default PaymentPageDefaultHeadTags;
