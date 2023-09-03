import React, { useCallback, useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { BookingWidgetView } from "../types/CarEnums";

import CarBookingWidgetStateContext from "./contexts/CarBookingWidgetStateContext";
import CarBookingWidgetCallbackContext from "./contexts/CarBookingWidgetCallbackContext";
import CarBookingWidgetConstantContext from "./contexts/CarBookingWidgetConstantContext";
import CarBookingWidgetFooterMobile from "./CarBookingWidgetFooterMobile";
import ExtrasContainer from "./Options/Extras/ExtrasContainer";
import InsurancesContainer from "./Options/Insurances/InsurancesContainer";
import TravelDetailsContainer from "./TravelDetails/TravelDetailsContainer";
import PickupDetailsContainer from "./Options/PickupDetails/PickupDetailsContainer";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import CarSearchWidgetMobile from "components/ui/CarSearchWidget/CarSearchWidgetMobile";
import BookingWidgetMobile from "components/ui/BookingWidget/BookingWidgetMobile";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { whiteColor, zIndex } from "styles/variables";
import { checkShouldFormatPrice } from "utils/helperUtils";

const WidgetsWrapper = styled.div(
  ({ theme }) =>
    css`
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: ${zIndex.max};
      background: ${whiteColor};

      &:before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 40px;
        background: ${theme.colors.primary};
      }
    `
);

const CarBookingWidgetMobile = ({
  selectedExtras,
  onSetSelectedExtra,
  extras,
  selectedInsurances,
  onSetSelectedInsurance,
  insurances,
  onAddToCart,
  onSetSelectedExtraQuestionAnswers,
}: {
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[];
  onSetSelectedExtra: CarBookingWidgetTypes.OnSetSelectedExtra;
  extras: OptionsTypes.Option[];
  selectedInsurances: CarBookingWidgetTypes.SelectedInsurance[];
  onSetSelectedInsurance: CarBookingWidgetTypes.OnSetSelectedInsurance;
  insurances: OptionsTypes.Option[];
  onAddToCart: () => void;
  onSetSelectedExtraQuestionAnswers: CarBookingWidgetTypes.OnSetSelectedExtraQuestionAnswers;
}) => {
  const { currencyCode } = useCurrencyWithDefault();
  const { toggleModal, setBookingWidgetView } = useContext(CarBookingWidgetCallbackContext);
  const { isModalOpen, bookingWidgetView } = useContext(CarBookingWidgetStateContext);
  const { searchPageUrl, isCarnect } = useContext(CarBookingWidgetConstantContext);
  const { t } = useTranslation(Namespaces.carBookingWidgetNs);
  const shouldFormatPrice = checkShouldFormatPrice(isCarnect, currencyCode);

  const onModalClose = useCallback(() => {
    setBookingWidgetView(BookingWidgetView.Default);
    toggleModal(false);
  }, [setBookingWidgetView, toggleModal]);

  const onPreviousClick = useCallback(() => {
    setBookingWidgetView(bookingWidgetView - 1);
  }, [setBookingWidgetView, bookingWidgetView]);

  const onFooterButtonClick = useCallback(() => {
    if (bookingWidgetView !== BookingWidgetView.PickupInfo)
      setBookingWidgetView(bookingWidgetView + 1);
  }, [bookingWidgetView, setBookingWidgetView]);

  const closeModal = useCallback(() => {
    toggleModal(false);
  }, [toggleModal]);

  return isModalOpen ? (
    <>
      {/* This wrapper prevents flickering between modals */}
      <WidgetsWrapper>
        {bookingWidgetView === BookingWidgetView.Extras ? (
          <BookingWidgetMobile
            onModalClose={closeModal}
            footer={<CarBookingWidgetFooterMobile onAddToCart={onAddToCart} />}
          >
            <TravelDetailsContainer />
            <PickupDetailsContainer />
            <InsurancesContainer
              title={t("Choose insurances")}
              selectedInsurances={selectedInsurances}
              onSetSelectedInsurance={onSetSelectedInsurance}
              options={insurances}
              shouldFormatPrice={shouldFormatPrice}
            />
            <ExtrasContainer
              title={t("Choose extras")}
              selectedExtras={selectedExtras}
              onSetSelectedExtra={onSetSelectedExtra}
              options={extras}
              onSetSelectedExtraQuestionAnswers={onSetSelectedExtraQuestionAnswers}
              shouldFormatPrice={shouldFormatPrice}
            />
          </BookingWidgetMobile>
        ) : (
          <CarSearchWidgetMobile
            currentStep={bookingWidgetView}
            onModalClose={onModalClose}
            onPreviousClick={onPreviousClick}
            onFooterButtonClick={onFooterButtonClick}
            searchWidgetView={
              bookingWidgetView === BookingWidgetView.PickupInfo ? "pickupInfo" : "dates"
            }
            isBookingWidgetView
            showBackButtonOnFirstStep
            searchLink={searchPageUrl}
          />
        )}
      </WidgetsWrapper>
    </>
  ) : null;
};

export default CarBookingWidgetMobile;
