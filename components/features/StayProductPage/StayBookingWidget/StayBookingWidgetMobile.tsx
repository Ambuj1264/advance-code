import React from "react";

import { BookingWidgetView } from "./types/enums";
import StayBookingWidgetFooterMobile from "./StayBookingWidgetFooterMobile";
import { useToggleIsOpen, useSetBookingWidgetView } from "./stayHooks";
import { useStayBookingWidgetContext } from "./StayBookingWidgetStateContext";
import StayRoomAndGuestPicker from "./StayRoomAndGuestPicker";
import StayDatePickerContainer from "./StayDatePickerContainer";
import StayAvailabilityContainer from "./StayAvailability/StayAvailabilityContainer";

import BookingWidgetMobile from "components/ui/BookingWidget/BookingWidgetMobile";

const StayBookingWidgetMobile = ({
  onAddToCart,
  onlyGuestSelection = false,
  productId,
  productTitle,
}: {
  onAddToCart: () => void;
  onlyGuestSelection?: boolean;
  productId: number;
  productTitle?: string;
}) => {
  const { isModalOpen, bookingWidgetView } = useStayBookingWidgetContext();
  const toggleModal = useToggleIsOpen();
  const setBookingWidgetView = useSetBookingWidgetView();
  return isModalOpen ? (
    <BookingWidgetMobile
      onModalClose={toggleModal}
      onPreviousClick={() => {
        if (bookingWidgetView === BookingWidgetView.Dates) {
          toggleModal();
        }
        setBookingWidgetView(bookingWidgetView - 1);
      }}
      currentStep={bookingWidgetView - 1}
      footer={<StayBookingWidgetFooterMobile onAddToCart={onAddToCart} />}
    >
      {bookingWidgetView === BookingWidgetView.Dates && <StayDatePickerContainer />}
      {bookingWidgetView === BookingWidgetView.Details && (
        <StayRoomAndGuestPicker onlyGuestSelection={onlyGuestSelection} />
      )}
      {bookingWidgetView === BookingWidgetView.RoomTypes && (
        <StayAvailabilityContainer productId={productId} productTitle={productTitle} />
      )}
    </BookingWidgetMobile>
  ) : null;
};

export default StayBookingWidgetMobile;
