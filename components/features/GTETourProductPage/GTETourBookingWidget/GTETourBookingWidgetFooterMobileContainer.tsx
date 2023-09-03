import React, { useState, useEffect } from "react";

import { getTotalTravelers } from "./utils/gteTourBookingWidgetUtils";
import { useOnBookingWidgetViewChange } from "./gteTourHooks";
import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import { getDateError } from "./utils/cartUtils";

import BookingWidgetView from "components/features/TourBookingWidget/types/enums";
import BookingWidgetFooterMobile from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterMobile";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import BookingWidgetFooterPrice from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterPrice";
import BookingWidgetFooterPriceWithInfo from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterPriceWithInfo";
import { useCurrencyWithDefault } from "hooks/useCurrency";

const GTETourBookingWidgetFooterMobileContainer = ({
  toggleModal,
  isModalOpen,
  onAddToCart,
  formErrorText,
  isFormLoading,
  travelerErrorMessage,
  fromPrice,
}: {
  toggleModal: () => void;
  isModalOpen: boolean;
  onAddToCart?: () => void;
  formErrorText?: string;
  isFormLoading: boolean;
  travelerErrorMessage?: string;
  fromPrice: number;
}) => {
  const { t } = useTranslation(Namespaces.commonBookingWidgetNs);
  const { t: tourT } = useTranslation(Namespaces.tourBookingWidgetNs);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const {
    bookingWidgetView,
    selectedDates,
    numberOfTravelers,
    totalPrice,
    isAvailabilityLoading,
    isError,
  } = useGTETourBookingWidgetContext();
  const [showFormErrors, toggleShowFormErrors] = useState(false);
  const [showCustomErrors, toggleShowCustomErrors] = useState(false);
  const totalTravelers = getTotalTravelers(numberOfTravelers);
  const hasDatesAndTravelersSet = Boolean(totalTravelers > 0 && selectedDates.from);
  const canDisplayTotalPricing = Boolean(
    bookingWidgetView === BookingWidgetView.Default && hasDatesAndTravelersSet
  );
  const onBookingWidgetViewChange = useOnBookingWidgetViewChange();
  const dateError = getDateError(selectedDates, tourT);
  const buttonCallToAction = () => {
    if (bookingWidgetView === BookingWidgetView.Default) {
      return t("Add to Cart");
    }
    if (
      bookingWidgetView === BookingWidgetView.Dates ||
      bookingWidgetView === BookingWidgetView.Travelers
    ) {
      return t(isModalOpen ? "Apply" : "Continue");
    }
    return t("Continue");
  };
  const isButtonDisabled =
    isModalOpen && isError && bookingWidgetView === BookingWidgetView.Default;

  useEffect(() => {
    toggleShowCustomErrors(false);
    toggleShowFormErrors(false);
  }, [bookingWidgetView]);

  const onButtonClick = () => {
    if (!isModalOpen) {
      onBookingWidgetViewChange(
        selectedDates.from !== undefined ? BookingWidgetView.Default : BookingWidgetView.Dates
      );
      toggleModal();
      return;
    }

    if (
      (bookingWidgetView === BookingWidgetView.Dates && dateError) ||
      (bookingWidgetView === BookingWidgetView.Travelers && travelerErrorMessage)
    ) {
      toggleShowCustomErrors(true);
      return;
    }

    if (
      bookingWidgetView === BookingWidgetView.Dates ||
      bookingWidgetView === BookingWidgetView.Travelers
    ) {
      onBookingWidgetViewChange(BookingWidgetView.Default);
      return;
    }

    if (formErrorText || !selectedDates.from) {
      toggleShowFormErrors(true);
      return;
    }

    toggleShowFormErrors(false);
    onAddToCart?.();
  };
  const showDates = Boolean(
    bookingWidgetView === BookingWidgetView.Dates && selectedDates.from && selectedDates.to
  );

  const hasTotalPrice = totalPrice > 0;
  const price = hasTotalPrice ? totalPrice : fromPrice;
  const footerPriceCommonProps = {
    price: convertCurrency(price),
    isPriceLoading: isAvailabilityLoading,
    currency: currencyCode,
    isTotalPrice:
      bookingWidgetView !== BookingWidgetView.Dates && hasDatesAndTravelersSet && hasTotalPrice,
  };

  const footerLeftContent = canDisplayTotalPricing ? (
    <BookingWidgetFooterPriceWithInfo
      {...footerPriceCommonProps}
      info={tourT("Price for {numberOfTravelers} travelers", {
        numberOfTravelers: getTotalTravelers(numberOfTravelers),
      })}
    />
  ) : (
    <BookingWidgetFooterPrice {...footerPriceCommonProps} />
  );
  const formError = showFormErrors ? formErrorText : undefined;
  const customError = showCustomErrors ? dateError || travelerErrorMessage : undefined;
  return (
    <BookingWidgetFooterMobile
      onButtonClick={onButtonClick}
      selectedDates={selectedDates}
      showDates={showDates}
      buttonCallToAction={buttonCallToAction()}
      isButtonLoading={isFormLoading}
      footerLeftContent={footerLeftContent}
      formError={customError || formError}
      disabled={isButtonDisabled}
    />
  );
};

export default GTETourBookingWidgetFooterMobileContainer;
