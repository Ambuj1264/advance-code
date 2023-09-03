import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { productIsVoucher } from "../utils/postBookingUtils";

import usePBModalManagerHook from "./hooks/usePBModalManagerHook";

import PBItineraryVoucherModal from "components/features/PostBooking/PBItineraryVoucherModal";
import PBItineraryVoucherModalContent from "components/features/PostBooking/PBItineraryVoucherModalContent";
import { PBError, StyledError } from "components/features/PostBooking/components/PBError";
import VPTravelStopModalManager from "components/features/VacationPackageProductPage/VPTravelStopModal/VPTravelStopModalManager";
import { RightButtonWrapper } from "components/ui/Modal/Modal";
import {
  PB_ACTIVE_MODAL,
  PB_CARD_TYPE,
} from "components/features/PostBooking/types/postBookingEnums";
import { StyledArrow } from "components/features/VacationPackageProductPage/VPTravelStopModal/VPTravelStopModal";
import { mqMax } from "styles/base";
import { constructTravelStopAttractions } from "components/ui/TravelStop/travelStopUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import VPToursInfoModalContent from "components/features/VacationPackageProductPage/VPToursSection/VPToursInfoModalContent";
import VPProductCardModal from "components/features/VacationPackageProductPage/VPProductCardModal";
import PersonWalkingIcon from "components/icons/traveler.svg";
import { ModalHistoryProvider } from "contexts/ModalHistoryContext";

const VPTravelStopModalManagerStyled = styled(VPTravelStopModalManager)(
  () => css`
    ${StyledArrow} {
      display: none;
    }
    ${RightButtonWrapper} {
      ${mqMax.large} {
        display: none;
      }
    }
  `
);

const StyledPBError = styled(PBError)`
  ${StyledError} {
    transform: initial;
  }
`;

const PBItineraryModalManager = ({
  modalId,
  modalTitle,
  toggleModal,
  productType,
  bookingId = 0,
  orderId = 0,
  googlePlaceId = "",
  tourId = "",
  modalType,
}: {
  modalId: string | number;
  modalTitle: string;
  toggleModal: () => void;
  productType: PB_CARD_TYPE;
  bookingId?: number;
  orderId?: number;
  googlePlaceId?: string;
  tourId?: string;
  modalType: PB_ACTIVE_MODAL;
}) => {
  const { t } = useTranslation(Namespaces.postBookingNs);

  // TODO : likely to split "Info" and "Booking" modals
  const isVoucher =
    productIsVoucher(productType) &&
    !(productType === PB_CARD_TYPE.TOUR && modalType === PB_ACTIVE_MODAL.INFO);

  const id = bookingId || googlePlaceId;
  const modalData = usePBModalManagerHook({
    productType,
    id,
    orderId,
  });

  const { data, loading } = modalData;

  if (isVoucher) {
    return (
      <PBItineraryVoucherModal
        modalContent={
          <PBItineraryVoucherModalContent
            modalData={modalData}
            productType={productType}
            voucherBookingId={id}
          />
        }
        modalId={`${modalId}-voucher`}
        onClose={toggleModal}
        modalTitle={modalTitle}
        productType={productType}
        data={data}
      />
    );
  }

  if (productType === PB_CARD_TYPE.ATTRACTION) {
    const attractionLandingPage =
      data && "attractionLandingPage" in data ? [data.attractionLandingPage] : [];
    const formattedAttractions = constructTravelStopAttractions(attractionLandingPage, t, loading);

    return (
      <VPTravelStopModalManagerStyled
        clickedIcon={formattedAttractions[0]}
        onToggleModal={toggleModal}
        onSetClickedIcon={() => {}}
        items={formattedAttractions}
        className="PBStopModalManager"
      />
    );
  }

  if (productType === PB_CARD_TYPE.TOUR) {
    return (
      <ModalHistoryProvider>
        <VPProductCardModal
          modalId="pb-tour-info-modal"
          modalContent={
            <VPToursInfoModalContent queryCondition={{ tourId }} ErrorComponent={StyledPBError} />
          }
          onToggleModal={toggleModal}
          withModalFooter={false}
          modalTitle={{ Icon: PersonWalkingIcon, title: modalTitle }}
        />
      </ModalHistoryProvider>
    );
  }

  return null;
};

export default PBItineraryModalManager;
