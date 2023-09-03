import React from "react";
import { none } from "fp-ts/lib/Option";
import styled from "@emotion/styled";

import StayDatePickerContainer from "./StayDatePickerContainer";
import StayRoomAndGuestPicker from "./StayRoomAndGuestPicker";
import StayAvailabilityContainer from "./StayAvailability/StayAvailabilityContainer";
import { useStayBookingWidgetContext } from "./StayBookingWidgetStateContext";
import { getPriceSubtext, getFormErrorText } from "./utils/stayBookingWidgetUtils";
import { useStayPrice } from "./stayHooks";

import { gutters } from "styles/variables";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import BookingWidgetDesktopContainer from "components/ui/BookingWidget/BookingWidgetDesktopContainer";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

const BookingWidgetBody = styled.div`
  margin: 0 ${gutters.large}px ${gutters.large * 2}px ${gutters.large}px;
`;

const StayBookingWidgetDesktop = ({
  isFormLoading,
  onAddToCart,
  onlyGuestSelection,
  categoryId,
  productId,
  productTitle,
}: {
  isFormLoading: boolean;
  onAddToCart: () => void;
  onlyGuestSelection: boolean;
  categoryId?: number;
  productId: number;
  productTitle?: string;
}) => {
  const { t } = useTranslation(Namespaces.accommodationBookingWidgetNs);
  const { t: commonBookingT } = useTranslation(Namespaces.commonBookingWidgetNs);
  const { currencyCode } = useCurrencyWithDefault();
  const {
    price,
    totalPrice,
    occupancies,
    roomCombinations,
    selectedDates,
    isAvailabilityLoading,
    roomTypes,
  } = useStayBookingWidgetContext();
  const stayPrice = useStayPrice();
  return (
    <BookingWidgetDesktopContainer
      footerText={commonBookingT("Continue")}
      price={stayPrice}
      priceDisplayValue={totalPrice?.priceDisplayValue}
      discount={none}
      isPriceLoading={isAvailabilityLoading}
      isFormLoading={isFormLoading}
      isTotalPrice={price > 0}
      currency={currencyCode}
      priceSubtext={getPriceSubtext(price, occupancies, selectedDates, t)}
      onFooterButtonClick={onAddToCart}
      error={getFormErrorText(selectedDates, price, roomTypes, roomCombinations, occupancies, t)}
      isButtonDisabled={roomTypes.length === 0 && roomCombinations.length === 0}
    >
      <StayDatePickerContainer />
      <StayRoomAndGuestPicker onlyGuestSelection={onlyGuestSelection} />
      <BookingWidgetBody>
        <StayAvailabilityContainer
          categoryId={categoryId}
          productId={productId}
          productTitle={productTitle}
        />
      </BookingWidgetBody>
    </BookingWidgetDesktopContainer>
  );
};

export default StayBookingWidgetDesktop;
