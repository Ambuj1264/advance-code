import React, { useCallback } from "react";
import styled from "@emotion/styled";

import GTETourBookingWidgetFooterMobileContainer from "./GTETourBookingWidgetFooterMobileContainer";
import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import { useOnBookingWidgetViewChange } from "./gteTourHooks";

import { ModalContentWrapper } from "components/ui/Modal/Modal";
import BookingWidgetMobile, {
  OnCurrentStepChangeType,
} from "components/ui/BookingWidget/BookingWidgetMobile";
import BookingWidgetView from "components/features/TourBookingWidget/types/enums";
import { gutters } from "styles/variables";
import CustomNextDynamic from "lib/CustomNextDynamic";
import {
  DropdownLoading,
  DropdownLoadingLabel,
  LoadingSectionContent,
  LoadingSectionContentWrapper,
  LoadingSectionLabel,
} from "components/ui/BookingWidget/BookingWidgetLoadingContainer";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";

const StyledBookingWidgetMobile = styled(BookingWidgetMobile)`
  ${ModalContentWrapper} {
    margin-bottom: ${gutters.large * 3}px;
  }
`;

const GTETourBookingWidgetMobileStepsChunk = CustomNextDynamic(
  () => import("./GTETourBookingWidgetMobileSteps"),
  {
    ssr: false,
    loading: () => (
      <>
        <MobileSectionHeading>
          <LoadingSectionLabel />
        </MobileSectionHeading>
        <LoadingSectionContentWrapper>
          <DropdownLoadingLabel />
          <DropdownLoading />
          <DropdownLoadingLabel />
          <DropdownLoading css={{ marginBottom: 0 }} />
        </LoadingSectionContentWrapper>
        <MobileSectionHeading>
          <LoadingSectionLabel />
        </MobileSectionHeading>
        <LoadingSectionContentWrapper>
          <DropdownLoadingLabel />
          <DropdownLoading />
          <LoadingSectionContent />
        </LoadingSectionContentWrapper>
      </>
    ),
  }
);

const GTETourBookingWidgetMobile = ({
  toggleModal,
  isModalOpen,
  onAddToCart,
  numberOfDays,
  productId,
  formErrorText,
  isFormLoading,
  hideContent,
  travelerErrorMessage,
  fromPrice,
}: {
  toggleModal: () => void;
  isModalOpen: boolean;
  onAddToCart: () => void;
  numberOfDays: number;
  productId: string;
  formErrorText?: string;
  isFormLoading: boolean;
  hideContent: boolean;
  travelerErrorMessage?: string;
  fromPrice: number;
}) => {
  const { bookingWidgetView, isError, selectedDates } = useGTETourBookingWidgetContext();
  const onBookingWidgetViewChange = useOnBookingWidgetViewChange();

  const onPreviousClick = useCallback(() => {
    if (bookingWidgetView === BookingWidgetView.Dates && !selectedDates.from) {
      toggleModal();
    } else {
      onBookingWidgetViewChange(BookingWidgetView.Default);
    }
  }, [bookingWidgetView, onBookingWidgetViewChange, selectedDates.from, toggleModal]);

  const onModalClose = () => {
    if (
      (bookingWidgetView === BookingWidgetView.Dates && selectedDates.from) ||
      bookingWidgetView === BookingWidgetView.Travelers
    ) {
      onBookingWidgetViewChange(BookingWidgetView.Default);
    } else {
      toggleModal();
    }
  };

  const onCurrentStepChange: OnCurrentStepChangeType = useCallback((modal, newStep) => {
    if (newStep !== BookingWidgetView.Dates) {
      modal.current?.scrollTo({ top: 0 });
    }
  }, []);

  return (
    <StyledBookingWidgetMobile
      onModalClose={onModalClose}
      onPreviousClick={onPreviousClick}
      currentStep={bookingWidgetView}
      onCurrentStepChange={onCurrentStepChange}
      footer={
        <GTETourBookingWidgetFooterMobileContainer
          toggleModal={onModalClose}
          isModalOpen={isModalOpen}
          onAddToCart={onAddToCart}
          formErrorText={formErrorText}
          isFormLoading={isFormLoading}
          travelerErrorMessage={travelerErrorMessage}
          fromPrice={fromPrice}
        />
      }
    >
      <GTETourBookingWidgetMobileStepsChunk
        bookingWidgetView={bookingWidgetView}
        numberOfDays={numberOfDays}
        productId={productId}
        hideContent={hideContent}
        isError={isError}
      />
    </StyledBookingWidgetMobile>
  );
};

export default GTETourBookingWidgetMobile;
