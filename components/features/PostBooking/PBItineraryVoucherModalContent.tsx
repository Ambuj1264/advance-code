import React from "react";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";
import { useTranslation } from "react-i18next";

import GTETourVoucher from "../Voucher/GTETourVoucher";

import { PBError, StyledError } from "components/features/PostBooking/components/PBError";
import { SupportedLanguages } from "types/enums";
import { Namespaces } from "shared/namespaces";
import CarVoucher from "components/features/Voucher/CarVoucher";
import StayVoucher from "components/features/Voucher/StayVoucher";
import FlightVoucher from "components/features/Voucher/FlightVoucher";
import { mqMax } from "styles/base";
import { PB_CARD_TYPE } from "components/features/PostBooking/types/postBookingEnums";
import useDynamicTranslation from "hooks/useDynamicTranslation";
import {
  constructPBCarVoucherData,
  constructPBFlightVoucherData,
  constructPBStayProductVoucherData,
  constructPBStayVoucherData,
  constructPBTourVoucherData,
} from "components/features/PostBooking/utils/postBookingUtils";
import { gutters, zIndex } from "styles/variables";
import PBVoucherModalSkeleton from "components/features/PostBooking/components/PBVoucherModalSkeleton";
import { PostBookingTypes } from "components/features/PostBooking/types/postBookingTypes";
import { commonVoucherStyles } from "components/features/PostBooking/components/PBSharedComponents";

const CarVoucherStyled = styled(CarVoucher)([commonVoucherStyles]);
const StayVoucherStyled = styled(StayVoucher)([commonVoucherStyles]);
const FlightVoucherStyled = styled(FlightVoucher)([commonVoucherStyles]);
const GTETourVoucherStyled = styled(GTETourVoucher)([commonVoucherStyles]);

const VoucherWrapper = styled.div`
  min-height: 100%;
  overflow-y: scroll;
  ${mqMax.large} {
    padding-right: ${gutters.small}px;
    padding-bottom: 100px;
    padding-left: ${gutters.small}px;
  }
`;

export const PBErrorStyled = styled(PBError)`
  height: 100%;
  ${StyledError} {
    transform: none;
  }
`;

const PBItineraryVoucherModalContent = ({
  modalData,
  productType,
  voucherBookingId,
}: {
  modalData: PostBookingTypes.PBInfoModalData;
  productType: PB_CARD_TYPE;
  voucherBookingId: string | number;
}) => {
  const theme: Theme = useTheme();
  const { t } = useDynamicTranslation({
    locale: SupportedLanguages.English,
    namespace: Namespaces.orderNs,
  });
  const { data, loading, error } = modalData as PostBookingTypes.PBInfoModalData;
  const { t: postBookingT } = useTranslation(Namespaces.postBookingNs);

  if (loading) {
    return <PBVoucherModalSkeleton />;
  }

  if (error || !data) {
    return (
      <PBErrorStyled
        text={postBookingT("Voucher loading failed")}
        error={error ?? new Error("No data found for the voucher")}
        errorInfo={{
          productType,
          voucherBookingId,
        }}
      />
    );
  }

  if (productType === PB_CARD_TYPE.CAR_RENTAL && "carVoucher" in data) {
    const { queryCar, customerInfoSection, orderInfo } = constructPBCarVoucherData({
      data,
      t,
    });
    const { carVoucher } = data;

    if (queryCar && customerInfoSection && orderInfo) {
      return (
        <VoucherWrapper>
          <CarVoucherStyled
            queryCar={queryCar}
            customerInfoSection={customerInfoSection}
            voucherId={carVoucher?.bookingDetails?.voucherInfo?.[0].voucherId ?? ""}
            pdfUrl={carVoucher?.bookingDetails?.voucherInfo?.[0].url ?? ""}
            defaultEmail={carVoucher?.travelersDetails?.email ?? ""}
            orderInfo={orderInfo}
            voucherColor={theme.colors.primary}
            isVoucherReady
            resendVoucherModalCustomZIndex={zIndex.max + 1}
            isPaymentDetailsHidden
          />
        </VoucherWrapper>
      );
    }
  }

  if (productType === PB_CARD_TYPE.STAY && "stayVoucher" in data) {
    const { queryStay, customerInfoSection, orderInfo } = constructPBStayVoucherData({
      data,
      t,
    });

    const { stayVoucher } = data;
    if (queryStay && customerInfoSection && orderInfo) {
      return (
        <VoucherWrapper>
          <StayVoucherStyled
            queryStay={queryStay}
            customerInfoSection={customerInfoSection}
            voucherId={stayVoucher?.bookingDetails?.voucherInfo?.[0].voucherId ?? ""}
            pdfUrl={stayVoucher?.bookingDetails?.voucherInfo?.[0].url ?? ""}
            defaultEmail={stayVoucher?.travelersDetails?.email ?? ""}
            orderInfo={orderInfo}
            isVoucherReady
            isGTE
            resendVoucherModalCustomZIndex={zIndex.max + 1}
            isPaymentDetailsHidden
          />
        </VoucherWrapper>
      );
    }
  }

  if (productType === PB_CARD_TYPE.STAY_PRODUCT && "stayProductVoucher" in data) {
    const { queryStay, customerInfoSection, orderInfo } = constructPBStayProductVoucherData({
      data,
      t,
    });
    const { stayProductVoucher } = data;
    if (queryStay && customerInfoSection && orderInfo) {
      return (
        <VoucherWrapper>
          <StayVoucherStyled
            queryGTEStay={queryStay}
            customerInfoSection={customerInfoSection}
            voucherId={stayProductVoucher?.bookingDetails?.voucherInfo?.[0].voucherId ?? ""}
            pdfUrl={stayProductVoucher?.bookingDetails?.voucherInfo?.[0].url ?? ""}
            defaultEmail={stayProductVoucher?.travelersDetails?.email ?? ""}
            orderInfo={orderInfo}
            isVoucherReady
            isGTE
            resendVoucherModalCustomZIndex={zIndex.max + 1}
            isPaymentDetailsHidden={stayProductVoucher.paymentDetails.totalPrice <= 0}
          />
        </VoucherWrapper>
      );
    }
  }

  if (
    (productType === PB_CARD_TYPE.FLIGHT_RETURN || productType === PB_CARD_TYPE.FLIGHT_ARRIVING) &&
    (productType === PB_CARD_TYPE.FLIGHT_RETURN || productType === PB_CARD_TYPE.FLIGHT_ARRIVING) &&
    "flightVoucher" in data
  ) {
    const { queryFlight, orderInfo } = constructPBFlightVoucherData({
      data,
    });

    const { flightVoucher } = data;
    if (queryFlight && orderInfo) {
      return (
        <VoucherWrapper>
          <FlightVoucherStyled
            queryFlight={queryFlight}
            voucherId={flightVoucher?.bookingDetails?.voucherInfo?.[0].voucherId ?? ""}
            pdfUrl={flightVoucher?.bookingDetails?.voucherInfo?.[0].url ?? ""}
            defaultEmail={flightVoucher?.travelersDetails?.email ?? ""}
            orderInfo={orderInfo}
            isVoucherReady
            resendVoucherModalCustomZIndex={zIndex.max + 1}
            isPaymentDetailsHidden
          />
        </VoucherWrapper>
      );
    }
  }

  if (productType === PB_CARD_TYPE.TOUR && "tourVoucher" in data) {
    const tourVoucherDetails = constructPBTourVoucherData(data);

    if (tourVoucherDetails) {
      return (
        <VoucherWrapper>
          <GTETourVoucherStyled
            {...tourVoucherDetails}
            resendVoucherModalCustomZIndex={zIndex.max + 1}
            isPaymentDetailsHidden
          />
        </VoucherWrapper>
      );
    }
  }

  return null;
};

export default PBItineraryVoucherModalContent;
