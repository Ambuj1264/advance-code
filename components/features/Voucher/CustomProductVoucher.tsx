import React from "react";

import { OrderPayByLinkType } from "../Cart/types/cartEnums";

import Voucher from "./Voucher";
import { constructCustomProductVoucher, useProductTitle } from "./utils/voucherUtils";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import CheckList from "components/icons/checklist.svg";
import useDynamicTranslation from "hooks/useDynamicTranslation";
import { Namespaces } from "shared/namespaces";
import { SupportedLanguages } from "types/enums";

const CustomProductVoucher = ({
  queryCustomProduct,
  customerInfoSection,
  voucherId,
  defaultEmail,
  isVoucherReady,
  pdfUrl,
  orderInfo,
  paymentLinkType,
  payerInfoSection,
}: {
  queryCustomProduct: VoucherTypes.VoucherQueryCustomProduct;
  customerInfoSection: OrderTypes.VoucherProduct;
  voucherId: string;
  defaultEmail: string;
  isVoucherReady: boolean;
  pdfUrl?: string;
  orderInfo: VoucherTypes.OrderInfo;
  paymentLinkType?: OrderPayByLinkType;
  payerInfoSection?: OrderTypes.VoucherProduct;
}) => {
  const { t } = useDynamicTranslation({
    locale: SupportedLanguages.English,
    namespace: Namespaces.orderNs,
  });
  const { convertCurrency, currencyCode: currency } = useCurrencyWithDefault();
  const productTitle = useProductTitle(queryCustomProduct.cart.title);

  const voucherSections = constructCustomProductVoucher({
    queryCustomProduct,
    t,
    customerInfoSection,
    payerInfoSection,
    currency,
    convertCurrency,
    orderInfo,
    productTitle,
    isPaymentLinkInvoice: paymentLinkType === OrderPayByLinkType.INVOICE,
  });

  return (
    <Voucher
      voucherSections={voucherSections}
      editableStatus={queryCustomProduct.editableStatus}
      voucherId={voucherId}
      defaultEmail={defaultEmail}
      Icon={CheckList}
      productTitle={queryCustomProduct.cart.title}
      pdfUrl={pdfUrl}
      isVoucherReady={isVoucherReady}
    />
  );
};

export default CustomProductVoucher;
