import React from "react";

import Voucher from "./Voucher";
import { constructVacationPackageVoucher, useProductTitle } from "./utils/voucherUtils";

import RouteIcon from "components/icons/tour-route.svg";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import useDynamicTranslation from "hooks/useDynamicTranslation";
import useDynamicUrl from "hooks/useDynamicUrl";
import { Namespaces } from "shared/namespaces";
import { PageType, SupportedLanguages } from "types/enums";

const VacationPackageVoucher = ({
  queryVacationPackage,
  voucherId,
  defaultEmail,
  pdfUrl,
  orderInfo,
  carSearchBaseUrl,
  isVoucherReady,
  customerInfo,
  isPaymentDetailsHidden,
}: {
  queryVacationPackage: VoucherTypes.VoucherQueryVacationPackages;
  voucherId: string;
  defaultEmail: string;
  pdfUrl?: string;
  orderInfo: VoucherTypes.OrderInfo;
  carSearchBaseUrl: string;
  isVoucherReady: boolean;
  customerInfo: OrderTypes.CustomerInfo;
  isPaymentDetailsHidden?: boolean;
}) => {
  const { t } = useDynamicTranslation({
    locale: SupportedLanguages.English,
    namespace: Namespaces.orderNs,
  });
  const { t: flightT } = useDynamicTranslation({
    locale: SupportedLanguages.English,
    namespace: Namespaces.flightNs,
  });
  const { t: carnectT } = useDynamicTranslation({
    locale: SupportedLanguages.English,
    namespace: Namespaces.carnectNs,
  });
  const flightSearchBaseUrl = useDynamicUrl(PageType.FLIGHTSEARCH);
  const { convertCurrency, currencyCode: currency } = useCurrencyWithDefault();
  const voucherSections = constructVacationPackageVoucher({
    activeLocale: SupportedLanguages.English,
    convertCurrency,
    currency,
    queryVacationPackage,
    t,
    carnectT,
    flightT,
    orderInfo,
    productTitle: useProductTitle(queryVacationPackage.cart.title),
    carSearchBaseUrl,
    flightSearchBaseUrl,
    isVoucherReady,
    customerInfo,
    isPaymentDetailsHidden,
  });

  return (
    <Voucher
      voucherSections={voucherSections}
      editableStatus={queryVacationPackage.editableStatus}
      voucherId={voucherId}
      defaultEmail={defaultEmail}
      productTitle={queryVacationPackage.cart.title}
      Icon={RouteIcon}
      pdfUrl={pdfUrl}
      isVoucherReady={isVoucherReady}
    />
  );
};

export default VacationPackageVoucher;
