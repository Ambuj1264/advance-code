import React from "react";

import Voucher from "./Voucher";
import {
  constructGTEStayVoucher,
  constructStayVoucher,
  useProductTitle,
} from "./utils/voucherUtils";
import { EditableStatus } from "./types/VoucherEnums";

import { decodeHtmlEntity } from "utils/helperUtils";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import HotelIcon from "components/icons/house-heart.svg";
import { Namespaces } from "shared/namespaces";
import { SupportedLanguages } from "types/enums";
import useDynamicTranslation from "hooks/useDynamicTranslation";

const StayVoucher = ({
  queryStay,
  queryGTEStay,
  customerInfoSection,
  voucherId,
  defaultEmail,
  pdfUrl,
  orderInfo,
  isVoucherReady,
  voucherColor,
  isPaymentDetailsHidden,
  isGTE,
  className,
  resendVoucherModalCustomZIndex,
}: {
  queryStay?: VoucherTypes.VoucherQueryStay;
  queryGTEStay?: VoucherTypes.VoucherQueryGTEStay;
  customerInfoSection: OrderTypes.VoucherProduct;
  voucherId: string;
  defaultEmail: string;
  pdfUrl?: string;
  orderInfo: VoucherTypes.OrderInfo;
  isVoucherReady: boolean;
  voucherColor?: string;
  isPaymentDetailsHidden?: boolean;
  isGTE: boolean;
  className?: string;
  resendVoucherModalCustomZIndex?: number;
}) => {
  const { t } = useDynamicTranslation({
    locale: SupportedLanguages.English,
    namespace: Namespaces.orderNs,
  });
  const { convertCurrency, currencyCode: currency } = useCurrencyWithDefault();
  const title = queryStay?.cart.title || queryGTEStay?.cart.title || "";
  const editableStatus =
    queryStay?.editableStatus || queryGTEStay?.editableStatus || EditableStatus.UNAVAILABLE;

  const productTitle = title ? decodeHtmlEntity(title) : "";

  const displayedProductTitle = useProductTitle(productTitle);
  let voucherSections = [] as OrderTypes.VoucherProduct[];
  if (queryStay) {
    voucherSections = constructStayVoucher({
      queryStay,
      t,
      customerInfoSection,
      currency,
      convertCurrency,
      activeLocale: SupportedLanguages.English,
      orderInfo,
      isPaymentDetailsHidden,
      productTitle: displayedProductTitle,
      isGTE,
    });
  } else if (queryGTEStay) {
    voucherSections = constructGTEStayVoucher({
      queryStay: queryGTEStay,
      t,
      customerInfoSection,
      currency,
      convertCurrency,
      activeLocale: SupportedLanguages.English,
      orderInfo,
      isPaymentDetailsHidden,
      productTitle: displayedProductTitle,
    });
  }
  return (
    <Voucher
      voucherSections={voucherSections}
      editableStatus={editableStatus}
      voucherId={voucherId}
      defaultEmail={defaultEmail}
      Icon={HotelIcon}
      productTitle={productTitle}
      isVoucherReady={isVoucherReady}
      pdfUrl={pdfUrl}
      voucherColor={voucherColor}
      className={className}
      resendVoucherModalCustomZIndex={resendVoucherModalCustomZIndex}
    />
  );
};

export default StayVoucher;
