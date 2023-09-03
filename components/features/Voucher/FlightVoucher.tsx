import React from "react";

import Voucher from "./Voucher";
import { constructFlightVoucher, useProductTitle } from "./utils/voucherUtils";

import FlightIcon from "components/icons/plane-1.svg";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import useDynamicTranslation from "hooks/useDynamicTranslation";
import { Namespaces } from "shared/namespaces";
import { SupportedLanguages } from "types/enums";

const FlightVoucher = ({
  queryFlight,
  voucherId,
  defaultEmail,
  pdfUrl,
  orderInfo,
  voucherColor,
  isPaymentDetailsHidden,
  isVoucherReady,
  className,
  resendVoucherModalCustomZIndex,
  customerInfo,
}: {
  queryFlight: VoucherTypes.VoucherQueryFlight;
  voucherId: string;
  defaultEmail: string;
  pdfUrl?: string;
  orderInfo: VoucherTypes.OrderInfo;
  voucherColor?: string;
  isPaymentDetailsHidden?: boolean;
  isVoucherReady: boolean;
  className?: string;
  resendVoucherModalCustomZIndex?: number;
  customerInfo?: OrderTypes.CustomerInfo;
}) => {
  const { t } = useDynamicTranslation({
    locale: SupportedLanguages.English,
    namespace: Namespaces.orderNs,
  });
  const { convertCurrency, currencyCode: currency } = useCurrencyWithDefault();
  const voucherSections = constructFlightVoucher({
    activeLocale: SupportedLanguages.English,
    convertCurrency,
    currency,
    queryFlight,
    t,
    orderInfo,
    isPaymentDetailsHidden,
    productTitle: useProductTitle(queryFlight.cart.title),
    isVoucherReady,
    customerInfo,
  });

  return (
    <Voucher
      voucherSections={voucherSections}
      editableStatus={queryFlight.editableStatus}
      voucherId={voucherId}
      defaultEmail={defaultEmail}
      productTitle={queryFlight.cart.title}
      Icon={FlightIcon}
      pdfUrl={pdfUrl}
      voucherColor={voucherColor}
      isVoucherReady={isVoucherReady}
      className={className}
      resendVoucherModalCustomZIndex={resendVoucherModalCustomZIndex}
    />
  );
};

export default FlightVoucher;
