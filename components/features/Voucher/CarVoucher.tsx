import React, { useCallback } from "react";
import { useRouter } from "next/router";

import Voucher from "./Voucher";
import { constructCarVoucher, createEditVoucherUrl, useProductTitle } from "./utils/voucherUtils";
import { EditableStatus } from "./types/VoucherEnums";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import CarIcon from "components/icons/car.svg";
import { Namespaces } from "shared/namespaces";
import { SupportedLanguages } from "types/enums";
import useDynamicTranslation from "hooks/useDynamicTranslation";

const CarVoucher = ({
  queryCar,
  customerInfoSection,
  carSearchBaseUrl,
  voucherId,
  defaultEmail,
  pdfUrl,
  orderInfo,
  isVoucherReady,
  voucherColor,
  isPaymentDetailsHidden,
  className,
  resendVoucherModalCustomZIndex,
}: {
  queryCar: VoucherTypes.VoucherQueryCar;
  customerInfoSection: OrderTypes.VoucherProduct;
  carSearchBaseUrl?: string;
  voucherId: string;
  defaultEmail: string;
  pdfUrl?: string;
  orderInfo: VoucherTypes.OrderInfo;
  isVoucherReady: boolean;
  voucherColor?: string;
  isPaymentDetailsHidden?: boolean;
  className?: string;
  resendVoucherModalCustomZIndex?: number;
}) => {
  const Router = useRouter();
  const { t } = useDynamicTranslation({
    locale: SupportedLanguages.English,
    namespace: Namespaces.orderNs,
  });
  const { t: carnectT } = useDynamicTranslation({
    locale: SupportedLanguages.English,
    namespace: Namespaces.carnectNs,
  });
  const { convertCurrency, currencyCode: currency } = useCurrencyWithDefault();
  const voucherSections = constructCarVoucher({
    queryCar,
    t,
    carnectT,
    customerInfoSection,
    currency,
    convertCurrency,
    activeLocale: SupportedLanguages.English,
    orderInfo,
    isPaymentDetailsHidden,
    productTitle: useProductTitle(queryCar.cart.title),
  });

  const baseUrl = `${carSearchBaseUrl || ""}/search-results/book/${queryCar.cart.title}`;

  const onEditClick = useCallback(
    () => Router.push(createEditVoucherUrl({ baseUrl, bookingNumber: queryCar.bookingNumber })),
    [Router, baseUrl, queryCar.bookingNumber]
  );

  return (
    <Voucher
      voucherSections={voucherSections}
      advanceNoticeSec={queryCar.cart.advanceNoticeSec}
      editableStatus={
        carSearchBaseUrl?.length ? queryCar.editableStatus : EditableStatus.UNAVAILABLE
      }
      onEditClick={onEditClick}
      voucherId={voucherId}
      defaultEmail={defaultEmail}
      productTitle={queryCar.cart.title}
      Icon={CarIcon}
      pdfUrl={pdfUrl}
      voucherColor={voucherColor}
      isVoucherReady={isVoucherReady}
      className={className}
      resendVoucherModalCustomZIndex={resendVoucherModalCustomZIndex}
    />
  );
};

export default CarVoucher;
