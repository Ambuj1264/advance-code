import React from "react";

import { OrderPayByLinkType } from "../Cart/types/cartEnums";

import FlightVoucher from "./FlightVoucher";
import TourVoucher from "./TourVoucher";
import GTETourVoucher from "./GTETourVoucher";
import CarVoucher from "./CarVoucher";
import StayVoucher from "./StayVoucher";
import CustomProductVoucher from "./CustomProductVoucher";
import VacationPackageVoucher from "./VacationPackageVoucher";
import {
  constructCustomerInfoSection,
  constructFlightCustomerInfo,
  constructFlightCustomerInfoSection,
} from "./utils/voucherUtils";

import { Namespaces } from "shared/namespaces";
import { Marketplace, SupportedLanguages } from "types/enums";
import useDynamicTranslation from "hooks/useDynamicTranslation";
import { useSettings } from "contexts/SettingsContext";
import { greenColor } from "styles/variables";

const VoucherListContainer = ({
  queryFlights,
  queryTours,
  customerInfo,
  queryCars,
  queryStays,
  queryGTEStays,
  queryCustomProducts,
  queryVacationPackages,
  queryToursAndTickets,
  paymentReceiptId,
  pdfUrl,
  carSearchBaseUrl,
  orderInfo,
  isVoucherReady,
  paymentLinkType,
  payerInfo,
}: {
  queryFlights: VoucherTypes.VoucherQueryFlight[];
  queryTours: VoucherTypes.VoucherQueryTour[];
  queryCars: VoucherTypes.VoucherQueryCar[];
  queryStays: VoucherTypes.VoucherQueryStay[];
  queryGTEStays: VoucherTypes.VoucherQueryGTEStay[];
  queryCustomProducts: VoucherTypes.VoucherQueryCustomProduct[];
  queryVacationPackages: VoucherTypes.VoucherQueryVacationPackages[];
  queryToursAndTickets: VoucherTypes.VoucherQueryGTETour[];
  customerInfo: OrderTypes.CustomerInfo;
  paymentReceiptId: string;
  pdfUrl?: string;
  carSearchBaseUrl: string;
  orderInfo: VoucherTypes.OrderInfo;
  isVoucherReady: boolean;
  paymentLinkType?: OrderPayByLinkType;
  payerInfo?: OrderTypes.CustomerInfo;
}) => {
  const { t } = useDynamicTranslation({
    locale: SupportedLanguages.English,
    namespace: Namespaces.orderNs,
  });
  const customerInfoSection = constructCustomerInfoSection({
    customerInfo,
    t,
  });
  const payerInfoSection = payerInfo
    ? constructCustomerInfoSection({
        customerInfo: payerInfo,
        t,
        isPayerInfo: true,
      })
    : undefined;
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const isPaymentDetailsHidden = paymentLinkType === OrderPayByLinkType.INVOICE;
  return (
    <>
      {paymentLinkType
        ? queryCustomProducts.map((queryCustomProduct, customProductIndex) => (
            <CustomProductVoucher
              key={`${
                queryCustomProduct.bookingNumber ||
                queryCustomProduct.cart?.bookingId ||
                queryCustomProduct.cart?.invoiceNumber
              }-customProductsVoucher-${customProductIndex.toString()}`}
              queryCustomProduct={queryCustomProduct}
              customerInfoSection={customerInfoSection}
              voucherId={paymentReceiptId}
              defaultEmail={customerInfo.email!}
              pdfUrl={pdfUrl}
              orderInfo={orderInfo}
              isVoucherReady={isVoucherReady}
              paymentLinkType={paymentLinkType}
              payerInfoSection={payerInfoSection}
            />
          ))
        : null}
      {queryVacationPackages.map((queryVacationPackage, vpIndex) => {
        const vpFlight = queryVacationPackage.flights?.[0];
        const customerInfoSectionVP =
          vpFlight !== undefined
            ? constructFlightCustomerInfoSection({
                customerInfo: constructFlightCustomerInfo({
                  customerInfo,
                  passengers: vpFlight.passengers,
                }),
                t,
                isVoucherReady,
              })
            : customerInfoSection;
        return (
          <React.Fragment key={`${queryVacationPackage.bookingNumber}-wrapper`}>
            <VacationPackageVoucher
              key={`${queryVacationPackage.bookingNumber}-vpVoucher-${vpIndex.toString()}`}
              queryVacationPackage={queryVacationPackage}
              voucherId={paymentReceiptId}
              defaultEmail={customerInfo.email!}
              customerInfo={customerInfo}
              pdfUrl={pdfUrl}
              orderInfo={orderInfo}
              carSearchBaseUrl={carSearchBaseUrl}
              isVoucherReady={isVoucherReady}
              isPaymentDetailsHidden={isPaymentDetailsHidden}
            />
            {queryVacationPackage.flights?.map(
              (vacationPackageFlight, vacationPackageFlightIndex) => (
                <FlightVoucher
                  key={`${
                    vacationPackageFlight.bookingNumber
                  }-vpFlightVoucher-${vacationPackageFlightIndex.toString()}`}
                  queryFlight={vacationPackageFlight}
                  voucherId={paymentReceiptId}
                  defaultEmail={customerInfo.email!}
                  pdfUrl={pdfUrl}
                  orderInfo={orderInfo}
                  voucherColor={greenColor}
                  isVoucherReady={isVoucherReady}
                  customerInfo={customerInfo}
                  isPaymentDetailsHidden
                />
              )
            )}
            {queryVacationPackage.cars.map((vacationPackageCar, vacationPackageCarIndex) => (
              <CarVoucher
                key={`${
                  vacationPackageCar.bookingNumber
                }-vpCarsVoucher-${vacationPackageCarIndex.toString()}`}
                queryCar={vacationPackageCar}
                customerInfoSection={customerInfoSectionVP}
                carSearchBaseUrl={carSearchBaseUrl}
                voucherId={paymentReceiptId}
                defaultEmail={customerInfo.email!}
                pdfUrl={pdfUrl}
                orderInfo={orderInfo}
                voucherColor={greenColor}
                isVoucherReady={isVoucherReady}
                isPaymentDetailsHidden
              />
            ))}
            {queryVacationPackage.stays.map((queryStay, staysIndex) => (
              <StayVoucher
                key={`${queryStay.bookingNumber}-vpStaysVoucher-${staysIndex.toString()}`}
                queryStay={queryStay}
                customerInfoSection={customerInfoSectionVP}
                voucherId={paymentReceiptId}
                defaultEmail={customerInfo.email!}
                pdfUrl={pdfUrl}
                orderInfo={orderInfo}
                isGTE={isGTE}
                isVoucherReady={isVoucherReady}
                isPaymentDetailsHidden={isPaymentDetailsHidden}
              />
            ))}
            {queryVacationPackage.gteStays.map((vacationPackageStay, vacationPackageStayIndex) => (
              <StayVoucher
                key={`${
                  vacationPackageStay.bookingNumber
                }-vpGTEStaysVoucher-${vacationPackageStayIndex.toString()}`}
                queryGTEStay={vacationPackageStay}
                customerInfoSection={customerInfoSectionVP}
                voucherId={paymentReceiptId}
                defaultEmail={customerInfo.email!}
                pdfUrl={pdfUrl}
                orderInfo={orderInfo}
                voucherColor={greenColor}
                isGTE={isGTE}
                isVoucherReady={isVoucherReady}
                isPaymentDetailsHidden
              />
            ))}
            {queryVacationPackage.toursAndTickets.map(
              (vacationPackageTour, vacationPackageTourIndex) => (
                <GTETourVoucher
                  key={`${
                    vacationPackageTour.bookingNumber
                  }-vpToursVoucher-${vacationPackageTourIndex.toString()}`}
                  queryTour={vacationPackageTour}
                  voucherId={paymentReceiptId}
                  defaultEmail={customerInfo.email!}
                  customerInfo={customerInfo}
                  pdfUrl={pdfUrl}
                  orderInfo={orderInfo}
                  isVoucherReady={isVoucherReady}
                  voucherColor={greenColor}
                  isPaymentDetailsHidden
                />
              )
            )}
          </React.Fragment>
        );
      })}
      {queryFlights.map((queryFlight, flightIndex) => (
        <FlightVoucher
          key={`${queryFlight.bookingNumber}-flightsVoucher-${flightIndex.toString()}`}
          queryFlight={queryFlight}
          voucherId={paymentReceiptId}
          defaultEmail={customerInfo.email!}
          pdfUrl={pdfUrl}
          orderInfo={orderInfo}
          isVoucherReady={isVoucherReady}
          customerInfo={customerInfo}
          isPaymentDetailsHidden={isPaymentDetailsHidden}
        />
      ))}
      {queryTours.map((queryTour, tourIndex) => (
        <TourVoucher
          key={`${queryTour.bookingNumber}-toursVoucher-${tourIndex.toString()}`}
          queryTour={queryTour}
          customerInfoSection={customerInfoSection}
          voucherId={paymentReceiptId}
          defaultEmail={customerInfo.email!}
          pdfUrl={pdfUrl}
          orderInfo={orderInfo}
          isVoucherReady={isVoucherReady}
          isPaymentDetailsHidden={isPaymentDetailsHidden}
        />
      ))}
      {queryToursAndTickets.map((queryTour, tourIndex) => (
        <GTETourVoucher
          key={`${queryTour.bookingNumber}-toursVoucher-${tourIndex.toString()}`}
          queryTour={queryTour}
          voucherId={paymentReceiptId}
          defaultEmail={customerInfo.email!}
          customerInfo={customerInfo}
          pdfUrl={pdfUrl}
          orderInfo={orderInfo}
          isVoucherReady={isVoucherReady}
          isPaymentDetailsHidden={isPaymentDetailsHidden}
        />
      ))}
      {queryCars.map((queryCar, carsIndex) => (
        <CarVoucher
          key={`${queryCar.bookingNumber}-carsVoucher-${carsIndex.toString()}`}
          queryCar={queryCar}
          customerInfoSection={customerInfoSection}
          carSearchBaseUrl={carSearchBaseUrl}
          voucherId={paymentReceiptId}
          defaultEmail={customerInfo.email!}
          pdfUrl={pdfUrl}
          orderInfo={orderInfo}
          isVoucherReady={isVoucherReady}
          isPaymentDetailsHidden={isPaymentDetailsHidden}
        />
      ))}
      {queryStays.map((queryStay, staysIndex) => (
        <StayVoucher
          key={`${queryStay.bookingNumber}-staysVoucher-${staysIndex.toString()}`}
          queryStay={queryStay}
          customerInfoSection={customerInfoSection}
          voucherId={paymentReceiptId}
          defaultEmail={customerInfo.email!}
          pdfUrl={pdfUrl}
          orderInfo={orderInfo}
          isGTE={isGTE}
          isVoucherReady={isVoucherReady}
          isPaymentDetailsHidden={isPaymentDetailsHidden}
        />
      ))}
      {queryGTEStays.map((queryGTEStay: VoucherTypes.VoucherQueryGTEStay, staysIndex) => (
        <StayVoucher
          key={`${queryGTEStay.bookingNumber}-staysVoucher-${staysIndex.toString()}`}
          queryGTEStay={queryGTEStay}
          customerInfoSection={customerInfoSection}
          voucherId={paymentReceiptId}
          defaultEmail={customerInfo.email!}
          pdfUrl={pdfUrl}
          orderInfo={orderInfo}
          isVoucherReady={isVoucherReady}
          isGTE
          isPaymentDetailsHidden={isPaymentDetailsHidden}
        />
      ))}
      {!paymentLinkType
        ? queryCustomProducts.map((queryCustomProduct, customProductIndex) => (
            <CustomProductVoucher
              key={`${
                queryCustomProduct.bookingNumber ||
                queryCustomProduct.cart?.bookingId ||
                queryCustomProduct.cart?.invoiceNumber
              }-customProductsVoucher-${customProductIndex.toString()}`}
              queryCustomProduct={queryCustomProduct}
              customerInfoSection={customerInfoSection}
              voucherId={paymentReceiptId}
              defaultEmail={customerInfo.email!}
              pdfUrl={pdfUrl}
              orderInfo={orderInfo}
              isVoucherReady={isVoucherReady}
            />
          ))
        : null}
    </>
  );
};

export default VoucherListContainer;
