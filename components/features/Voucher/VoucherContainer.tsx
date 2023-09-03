import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useQueryParams, StringParam } from "use-query-params";

import VoucherHeader from "./VoucherHeader";
import VoucherListContainer from "./VoucherListContainer";
import { constructOrderInfo } from "./utils/voucherUtils";
import VoucherUpsell from "./VoucherUpsell";
import useVoucherQueries from "./utils/useVoucherQueries";

import { Marketplace, PageType, PaymentLinkQueryParam, VoucherQueryParam } from "types/enums";
import useDynamicUrl from "hooks/useDynamicUrl";
import DefaultHeadTags from "lib/DefaultHeadTags";
import NoIndex from "components/features/SEO/NoIndex";
import { useSettings } from "contexts/SettingsContext";
import { column, DefaultMarginTop } from "styles/base";
import Row from "components/ui/Grid/Row";
import DefaultPageLoading from "components/ui/Loading/DefaultLoadingPage";
import Container from "components/ui/Grid/Container";
import { Namespaces } from "shared/namespaces";
import OrderErrorBoundary, { OrderErrorComponent } from "components/ui/Order/OrderErrorBoundary";
import { useTranslation } from "i18n";

const StyledContainer = styled(Container)<{
  isGTE: boolean;
}>(({ isGTE }) => [
  // GTE has <FooterImage /> component in footer
  !isGTE &&
    css`
      margin-bottom: 120px;
    `,
]);

const StyledRow = styled(Row)([
  DefaultMarginTop,
  css`
    justify-content: center;
  `,
]);

const Column = styled.div([
  css`
    position: relative;
  `,
  column({ small: 1, large: 10 / 12 }),
]);

const VoucherContainer = ({ isPaymentLinkVoucher }: { isPaymentLinkVoucher: boolean }) => {
  const { t } = useTranslation(Namespaces.orderNs);
  const { websiteName, marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const [{ voucherId, pdf, paymentLinkId }] = useQueryParams({
    [VoucherQueryParam.VOUCHER_ID]: StringParam,
    [VoucherQueryParam.PDF]: StringParam,
    [PaymentLinkQueryParam.PAYMENT_LINK_ID]: StringParam,
  });
  const isPDF = pdf === "1";

  const {
    voucherData,
    voucherUpsellLoading,
    voucherUpsellData,
    voucherUpsellError,
    carSearchUrlError,
    carSearchUrlLoading,
    voucherLoading,
    voucherError,
    refetchVoucher,
    isUserSessionQueryCompleted,
    carSearchUrl,
    payByLinkType,
    payerInfo,
    vpSlug,
  } = useVoucherQueries({
    voucherId,
    isGTE,
    isPDF,
    paymentLinkId,
  });
  const flightSearchBaseUrl = useDynamicUrl(PageType.FLIGHTSEARCH);
  const tourSearchBaseUrl = useDynamicUrl("tourSearchLegacy" as PageType);
  const accommodationSearchBaseUrl = useDynamicUrl("accommodation" as PageType);
  const carSearchBaseUrl = carSearchUrl;
  const isVoucherReady = voucherData?.voucherReady || false;
  const paymentReceiptId = voucherId ?? paymentLinkId;
  const isPaymentLink = isPaymentLinkVoucher || paymentLinkId;
  const paymentLinkHeader = isPaymentLink ? "Your payment is confirmed!" : undefined;

  const needsCarSearchUrl =
    voucherData &&
    (("cars" in voucherData ? voucherData.cars.length > 0 : false) ||
      ("vacationPackages" in voucherData ? voucherData.vacationPackages.length > 0 : false));

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (voucherData && !isVoucherReady) {
      const voucherRefetchInterval = setInterval(() => {
        refetchVoucher();
      }, 2000);

      return () => {
        clearInterval(voucherRefetchInterval);
      };
    }
  }, [voucherData, isVoucherReady, refetchVoucher]);

  const shouldShowLoadingPage =
    (voucherLoading ||
      !isUserSessionQueryCompleted ||
      !paymentReceiptId ||
      (needsCarSearchUrl && !carSearchUrlError && !carSearchBaseUrl)) &&
    !voucherError;
  if (shouldShowLoadingPage || !voucherData) {
    return (
      <DefaultPageLoading
        title={t(`Your ${isPaymentLink ? "payment" : "booking"} confirmation will appear soon...`)}
      />
    );
  }

  if (voucherError || (!voucherData && !voucherLoading)) {
    return <OrderErrorComponent />;
  }

  const queryTours = "tours" in voucherData ? voucherData.tours : [];
  const queryStays = "stays" in voucherData ? voucherData.stays : [];
  const queryGTEStays = "gteStays" in voucherData ? voucherData.gteStays : [];
  const queryToursAndTickets = "toursAndTickets" in voucherData ? voucherData.toursAndTickets : [];
  const queryVacationPackages =
    "vacationPackages" in voucherData ? voucherData.vacationPackages : [];

  const orderInfo = constructOrderInfo({ orderInfo: voucherData.orderInfo });
  return (
    <OrderErrorBoundary componentName="voucherContainer">
      {/* the element below is used by the backend to crawl the voucher's pdf, do not change without consulting with the backend first */}
      {isVoucherReady && <div id="voucherReady" />}
      <DefaultHeadTags title={websiteName} />
      <NoIndex />
      <StyledContainer isGTE={isGTE}>
        <StyledRow>
          <Column>
            <VoucherHeader
              customHeader={paymentLinkHeader}
              numberOfItems={voucherData.numberOfItems}
              orderInfo={orderInfo}
            />
            <VoucherListContainer
              queryFlights={voucherData.flights}
              queryTours={!isGTE ? queryTours : []}
              queryCars={voucherData.cars}
              queryStays={!isGTE ? queryStays : []}
              queryGTEStays={isGTE ? queryGTEStays : []}
              queryCustomProducts={voucherData.customs}
              paymentLinkType={payByLinkType}
              queryVacationPackages={isGTE ? queryVacationPackages : []}
              queryToursAndTickets={isGTE ? queryToursAndTickets : []}
              customerInfo={voucherData.customerInfo}
              payerInfo={payerInfo}
              paymentReceiptId={paymentReceiptId ?? ""}
              pdfUrl={voucherData.pdfUrl}
              carSearchBaseUrl={carSearchBaseUrl ?? ""}
              orderInfo={orderInfo}
              isVoucherReady={isVoucherReady}
            />
            <VoucherUpsell
              items={voucherUpsellData?.voucherUpsells[0]?.voucherUpsellItems}
              voucherData={voucherData}
              flightSearchBaseUrl={flightSearchBaseUrl}
              tourSearchBaseUrl={tourSearchBaseUrl}
              accommodationSearchBaseUrl={accommodationSearchBaseUrl}
              carSearchBaseUrl={carSearchBaseUrl}
              vacationPackagesSlug={vpSlug}
              isVoucherUpsellLoading={
                voucherUpsellLoading || (needsCarSearchUrl && carSearchUrlLoading)
              }
              isVoucherUpsellError={Boolean(
                voucherUpsellError || (needsCarSearchUrl && carSearchUrlError)
              )}
            />
          </Column>
        </StyledRow>
      </StyledContainer>
    </OrderErrorBoundary>
  );
};

export default VoucherContainer;
