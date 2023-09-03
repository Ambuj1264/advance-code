import React, { useEffect, FormEvent, useCallback, useState } from "react";

import StayBookingWidgetFooterMobile from "./StayBookingWidgetFooterMobile";
import StayBookingWidgetMobile from "./StayBookingWidgetMobile";
import { useStayBookingWidgetContext } from "./StayBookingWidgetStateContext";
import { useToggleIsFormLoading, useShouldOpenAcceptModal } from "./stayHooks";
import useAddStayToCart from "./useAddStayToCart";
import StayChangedModal from "./StayChangedModal";
import useCartItem from "./useCartItem";
import StayBookingWidgetDesktop from "./StayBookingWidgetDesktop";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import BookingWidgetForm from "components/ui/BookingWidget/BookingWidgetForm";
import { AccommodationCategoryTypes } from "types/enums";
import { getOccupanciesFromGuests } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";

const StayBookingWidgetContainer = ({
  title,
  productId,
  productPageUri,
  categoryId,
}: {
  title?: string;
  productId: number;
  productPageUri: string;
  categoryId?: number;
}) => {
  const isMobile = useIsMobile();
  const [isChangeModalOpen, onOpenChangeModal] = useState(false);
  const [hasAcceptedChange, onAcceptChange] = useState(false);
  const {
    isModalOpen,
    selectedDates,
    isFormLoading,
    price,
    cartItem: stateCartItem,
    setContextState,
  } = useStayBookingWidgetContext();
  const toggleIsFormLoading = useToggleIsFormLoading();
  const { cartItem, cartDateFrom, cartDateTo, cartRooms } = useCartItem();
  const { addToCartMutation, addToCartLoading, isNotAvailable, hasPriceChanged, priceAfterChange } =
    useAddStayToCart({
      cartItemId: cartItem?.cartItemId,
      productPageUri,
      productId,
      title,
    });
  const onAddToCart = useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      onAcceptChange(false);
      e?.preventDefault();
      if (!isFormLoading && price > 0) {
        addToCartMutation();
        toggleIsFormLoading();
      }
    },
    [addToCartMutation, isFormLoading, price, toggleIsFormLoading]
  );

  useEffect(() => {
    if (!addToCartLoading && isFormLoading && (isNotAvailable || hasPriceChanged)) {
      toggleIsFormLoading();
    }
  }, [addToCartLoading, isFormLoading, isNotAvailable, hasPriceChanged, toggleIsFormLoading]);
  useEffect(() => {
    if (cartItem && !stateCartItem) {
      const occupancies = getOccupanciesFromGuests(
        cartRooms || 1,
        cartItem.numberOfAdults || 1,
        cartItem.childrenAges || []
      );
      setContextState({
        cartItem,
        selectedDates:
          cartDateFrom && cartDateTo
            ? { from: new Date(cartDateFrom), to: new Date(cartDateTo) }
            : selectedDates,
        occupancies,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItem, stateCartItem]);

  useShouldOpenAcceptModal(
    hasPriceChanged,
    isNotAvailable,
    hasAcceptedChange,
    isChangeModalOpen,
    onOpenChangeModal
  );

  const onChangeModalClose = useCallback(() => {
    onAcceptChange(true);
    onOpenChangeModal(false);
  }, []);

  const shouldShowOnlyGuestSelection =
    categoryId === AccommodationCategoryTypes.COTTAGE ||
    categoryId === AccommodationCategoryTypes.APARTMENT;

  return (
    <>
      {isChangeModalOpen && (
        <StayChangedModal
          isInvalid={isNotAvailable}
          searchUrl=""
          price={priceAfterChange || 0}
          onModalClose={onChangeModalClose}
        />
      )}
      <BookingWidgetForm id="booking-widget-form" method="POST" onSubmit={onAddToCart}>
        <div style={{ display: "contents" }}>
          {(!isMobile || isModalOpen) && (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {isMobile && isModalOpen ? (
                <StayBookingWidgetMobile
                  onAddToCart={onAddToCart}
                  onlyGuestSelection={shouldShowOnlyGuestSelection}
                  productTitle={title}
                  productId={productId}
                />
              ) : (
                <StayBookingWidgetDesktop
                  isFormLoading={isFormLoading}
                  onAddToCart={onAddToCart}
                  onlyGuestSelection={shouldShowOnlyGuestSelection}
                  categoryId={categoryId}
                  productTitle={title}
                  productId={productId}
                />
              )}
            </>
          )}
          {isMobile && !isModalOpen && <StayBookingWidgetFooterMobile />}
        </div>
      </BookingWidgetForm>
    </>
  );
};

export default StayBookingWidgetContainer;
