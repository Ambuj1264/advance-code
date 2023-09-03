import React, { useContext, useState } from "react";
import { pipe } from "fp-ts/lib/pipeable";
import { fromNullable, map } from "fp-ts/lib/Option";

import bookingWidgetStateContext from "./contexts/BookingWidgetStateContext";
import bookingWidgetCallbackContext from "./contexts/BookingWidgetCallbackContext";
import BookingWidgetView from "./types/enums";
import {
  isValidMobileFormError,
  getFormErrorText,
  getSelectedPickupTimeMinTravelers,
} from "./utils/tourBookingWidgetUtils";
import { getTotalNumberOfTravelers } from "./Travelers/utils/travelersUtils";

import BookingWidgetFooterMobile from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterMobile";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import BookingWidgetFooterPrice from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterPrice";
import BookingWidgetFooterPriceWithInfo from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterPriceWithInfo";
import useBookingWidgetDiscount from "components/ui/BookingWidget/BookingWidgetFooter/hooks/useBookingWidgetDiscount";

type Props = {
  toggleModal: () => void;
  isModalOpen: boolean;
};

const BookingWidgetFooterMobileContainer = ({ toggleModal, isModalOpen }: Props) => {
  const { t } = useTranslation(Namespaces.commonBookingWidgetNs);
  const { t: tourT } = useTranslation(Namespaces.tourBookingWidgetNs);
  // We need this state to be able to only show errors on button click
  const [showFormErrors, toggleShowFormErrors] = useState(false);
  const {
    bookingWidgetView,
    selectedDates,
    price,
    isPriceLoading,
    currency,
    formErrors,
    isFormLoading,
    isDiscountLoading,
    fullPrice,
    availableTimes,
    selectedPickupTime,
    numberOfTravelers,
    discount,
    discountValue,
    hasPickup,
  } = useContext(bookingWidgetStateContext);
  const { toggleIsFormLoading, setBookingWidgetView } = useContext(bookingWidgetCallbackContext);

  const buttonCallToAction = () => {
    if (bookingWidgetView === BookingWidgetView.Default && !selectedPickupTime) {
      return t("Add to Cart");
    }

    if (isModalOpen && bookingWidgetView !== BookingWidgetView.Default) {
      return t("Apply");
    }
    return t("Continue");
  };

  const formError = () => {
    if (
      isModalOpen &&
      formErrors.length > 0 &&
      showFormErrors &&
      isValidMobileFormError(formErrors, bookingWidgetView)
    ) {
      return getFormErrorText(
        formErrors,
        t,
        getSelectedPickupTimeMinTravelers(availableTimes.times, hasPickup, selectedPickupTime)
      );
    }
    return undefined;
  };

  const onButtonClick = () => {
    if (!isModalOpen) {
      toggleModal();
    } else {
      if (isValidMobileFormError(formErrors, bookingWidgetView)) {
        toggleShowFormErrors(true);
        return;
      }

      if (bookingWidgetView !== BookingWidgetView.Default) {
        setBookingWidgetView(BookingWidgetView.Default);
        return;
      }

      if (!isFormLoading) {
        toggleIsFormLoading();
        pipe(
          document.getElementById("booking-widget-form") as HTMLFormElement,
          fromNullable,
          map(elem => elem.submit())
        );
      }
    }
  };
  const showDates = Boolean(bookingWidgetView === BookingWidgetView.Dates && selectedDates.from);

  const footerPriceCommonProps = {
    price,
    isPriceLoading: isDiscountLoading || isPriceLoading,
    currency,
    isTotalPrice: selectedDates.from !== undefined,
  };

  const footerLeftContent =
    bookingWidgetView !== BookingWidgetView.Dates ? (
      <BookingWidgetFooterPriceWithInfo
        {...footerPriceCommonProps}
        info={tourT("Price for {numberOfTravelers} travelers", {
          numberOfTravelers: getTotalNumberOfTravelers(numberOfTravelers),
        })}
      />
    ) : (
      <BookingWidgetFooterPrice {...footerPriceCommonProps} />
    );

  const isDefaultWidgetView = bookingWidgetView === BookingWidgetView.Default;
  const { hasDiscount, DiscountLabel } = useBookingWidgetDiscount({
    price,
    fullPrice,
    discount,
    discountValue,
    currency,
  });

  return (
    <BookingWidgetFooterMobile
      onButtonClick={onButtonClick}
      selectedDates={selectedDates}
      showDates={showDates}
      formError={formError()}
      buttonCallToAction={buttonCallToAction()}
      isButtonLoading={isDefaultWidgetView ? isFormLoading : false}
      footerLeftContent={footerLeftContent}
      footerBannerContent={hasDiscount && isDefaultWidgetView ? <DiscountLabel /> : undefined}
    />
  );
};

export default BookingWidgetFooterMobileContainer;
