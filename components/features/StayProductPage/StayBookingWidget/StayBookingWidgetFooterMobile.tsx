import React from "react";
import { addDays } from "date-fns";

import { BookingWidgetView } from "./types/enums";
import { useStayBookingWidgetContext } from "./StayBookingWidgetStateContext";
import {
  useToggleIsOpen,
  useSetBookingWidgetView,
  useOnDateSelection,
  useStayPrice,
} from "./stayHooks";
import { getFormErrorText } from "./utils/stayBookingWidgetUtils";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import BookingWidgetFooterMobile from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterMobile";
import BookingWidgetFooterPrice from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterPrice";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const StayBookingWidgetFooterMobile = ({ onAddToCart }: { onAddToCart?: () => void }) => {
  const { t: commonBookingT } = useTranslation(Namespaces.commonBookingWidgetNs);
  const { t } = useTranslation(Namespaces.accommodationBookingWidgetNs);
  const {
    selectedDates,
    bookingWidgetView,
    isModalOpen,
    isFormLoading,
    price,
    isAvailabilityLoading,
    roomTypes,
    roomCombinations,
    occupancies,
    totalPrice,
  } = useStayBookingWidgetContext();
  const { currencyCode } = useCurrencyWithDefault();
  const toggleModal = useToggleIsOpen();
  const setBookingWidgetView = useSetBookingWidgetView();
  const onDateSelection = useOnDateSelection();
  const stayPrice = useStayPrice();
  const formError =
    bookingWidgetView === BookingWidgetView.RoomTypes
      ? getFormErrorText(selectedDates, price, roomTypes, roomCombinations, occupancies, t)
      : undefined;
  const footerLeftContent = (
    <BookingWidgetFooterPrice
      price={stayPrice}
      currency={currencyCode}
      isPriceLoading={false}
      isTotalPrice={price > 0}
      priceDisplayValue={totalPrice?.priceDisplayValue}
    />
  );
  const buttonText = () => {
    if (
      !selectedDates.from &&
      !selectedDates.from &&
      bookingWidgetView === BookingWidgetView.Default
    ) {
      return commonBookingT("Add to Cart");
    }
    return commonBookingT("Continue");
  };
  const handleButtonClick = () => {
    const onlyFromDaySet = selectedDates.from && !selectedDates.to;
    if (!isModalOpen) {
      toggleModal();
      if (bookingWidgetView === BookingWidgetView.Default) {
        setBookingWidgetView(bookingWidgetView + 1);
      }
    } else if (bookingWidgetView === BookingWidgetView.RoomTypes) {
      onAddToCart?.();
    } else if (bookingWidgetView === BookingWidgetView.Dates && onlyFromDaySet) {
      onDateSelection({
        from: selectedDates.from,
        to: addDays(selectedDates.from!, 1),
      });
      setBookingWidgetView(bookingWidgetView + 1);
    } else {
      setBookingWidgetView(bookingWidgetView + 1);
    }
  };
  const isButtonDisabled =
    bookingWidgetView === BookingWidgetView.RoomTypes && (price === 0 || formError !== undefined);
  const isButtonLoading = bookingWidgetView === BookingWidgetView.Details && isAvailabilityLoading;
  const showDates =
    !selectedDates.from || !selectedDates.to
      ? false
      : bookingWidgetView === BookingWidgetView.Dates;
  return (
    <BookingWidgetFooterMobile
      showDates={showDates}
      selectedDates={selectedDates}
      buttonCallToAction={buttonText()}
      isButtonLoading={isButtonLoading || isFormLoading}
      onButtonClick={handleButtonClick}
      disabled={isButtonDisabled}
      footerLeftContent={footerLeftContent}
      formError={formError}
    />
  );
};

export default StayBookingWidgetFooterMobile;
