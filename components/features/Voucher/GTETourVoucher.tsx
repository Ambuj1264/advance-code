import React, { useCallback } from "react";
import { useRouter } from "next/router";

import Voucher from "./Voucher";
import {
  constructGTETourVoucher,
  createEditVoucherUrl,
  useProductTitle,
} from "./utils/voucherUtils";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import DayTourIcon from "components/icons/traveler.svg";
import useDynamicTranslation from "hooks/useDynamicTranslation";
import { Namespaces } from "shared/namespaces";
import { SupportedLanguages } from "types/enums";

const GTETourVoucher = ({
  queryTour,
  voucherId,
  defaultEmail,
  isVoucherReady,
  pdfUrl,
  orderInfo,
  voucherColor,
  isPaymentDetailsHidden,
  resendVoucherModalCustomZIndex,
  className,
  customerInfo,
}: {
  queryTour: VoucherTypes.VoucherQueryGTETour;
  voucherId: string;
  defaultEmail: string;
  isVoucherReady: boolean;
  pdfUrl?: string;
  orderInfo: VoucherTypes.OrderInfo;
  voucherColor?: string;
  isPaymentDetailsHidden?: boolean;
  resendVoucherModalCustomZIndex?: number;
  className?: string;
  customerInfo?: OrderTypes.CustomerInfo;
}) => {
  const Router = useRouter();
  const { t } = useDynamicTranslation({
    locale: SupportedLanguages.English,
    namespace: Namespaces.orderNs,
  });
  const { convertCurrency, currencyCode: currency } = useCurrencyWithDefault();
  const voucherSections = constructGTETourVoucher({
    queryTour,
    t,
    currency,
    convertCurrency,
    activeLocale: SupportedLanguages.English,
    orderInfo,
    productTitle: useProductTitle(queryTour.cart.title),
    isPaymentDetailsHidden,
    customerInfo,
  });
  const onEditClick = useCallback(
    () =>
      Router.push(
        createEditVoucherUrl({
          baseUrl: queryTour.cart.linkUrl,
          bookingNumber: queryTour.bookingNumber,
        })
      ),
    [Router, queryTour.bookingNumber, queryTour.cart.linkUrl]
  );

  return (
    <Voucher
      className={className}
      voucherSections={voucherSections}
      editableStatus={queryTour.editableStatus}
      onEditClick={onEditClick}
      voucherId={voucherId}
      defaultEmail={defaultEmail}
      Icon={DayTourIcon}
      productTitle={queryTour.cart.title}
      pdfUrl={pdfUrl}
      isVoucherReady={isVoucherReady}
      voucherColor={voucherColor}
      resendVoucherModalCustomZIndex={resendVoucherModalCustomZIndex}
    />
  );
};

export default GTETourVoucher;
