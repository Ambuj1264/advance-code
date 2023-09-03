import React, { useCallback } from "react";
import { useRouter } from "next/router";

import Voucher from "./Voucher";
import { constructTourVoucher, createEditVoucherUrl, useProductTitle } from "./utils/voucherUtils";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import { getTourIconByType } from "components/ui/Order/utils/orderUtils";
import useDynamicTranslation from "hooks/useDynamicTranslation";
import { Namespaces } from "shared/namespaces";
import { SupportedLanguages } from "types/enums";

const TourVoucher = ({
  queryTour,
  customerInfoSection,
  voucherId,
  defaultEmail,
  isVoucherReady,
  pdfUrl,
  orderInfo,
  isPaymentDetailsHidden,
}: {
  queryTour: VoucherTypes.VoucherQueryTour;
  customerInfoSection: OrderTypes.VoucherProduct;
  voucherId: string;
  defaultEmail: string;
  isVoucherReady: boolean;
  pdfUrl?: string;
  orderInfo: VoucherTypes.OrderInfo;
  isPaymentDetailsHidden?: boolean;
}) => {
  const Router = useRouter();
  const { t } = useDynamicTranslation({
    locale: SupportedLanguages.English,
    namespace: Namespaces.orderNs,
  });
  const { convertCurrency, currencyCode: currency } = useCurrencyWithDefault();
  const voucherSections = constructTourVoucher({
    queryTour,
    t,
    customerInfoSection,
    currency,
    convertCurrency,
    activeLocale: SupportedLanguages.English,
    orderInfo,
    productTitle: useProductTitle(queryTour.cart.title),
    isPaymentDetailsHidden,
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
      voucherSections={voucherSections}
      editableStatus={queryTour.editableStatus}
      advanceNoticeSec={queryTour.cart.advanceNoticeSec}
      onEditClick={onEditClick}
      voucherId={voucherId}
      defaultEmail={defaultEmail}
      Icon={getTourIconByType(queryTour.cart.type)}
      productTitle={queryTour.cart.title}
      pdfUrl={pdfUrl}
      isVoucherReady={isVoucherReady}
    />
  );
};

export default TourVoucher;
