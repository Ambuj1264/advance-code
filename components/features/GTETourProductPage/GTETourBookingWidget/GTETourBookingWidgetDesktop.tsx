import React from "react";
import { none } from "fp-ts/lib/Option";

import { useDropdownActiveState } from "./gteTourHooks";
import GTETourDatePickerContainer from "./GTETourDatePickerContainer";
import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import { getTravelerPriceText } from "./utils/gteTourBookingWidgetUtils";
import GTETourBookingWidgetSharedBody from "./GTETourBookingWidgetSharedBody";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import BookingWidgetDesktopContainer from "components/ui/BookingWidget/BookingWidgetDesktopContainer";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

const GTETourBookingWidgetDesktop = ({
  onAddToCart,
  isFormLoading,
  numberOfDays,
  productId,
  formErrorText,
  hideContent,
  travelerErrorMessage,
  fromPrice,
}: {
  onAddToCart: () => void;
  isFormLoading: boolean;
  numberOfDays: number;
  productId: string;
  formErrorText?: string;
  hideContent: boolean;
  travelerErrorMessage?: string;
  fromPrice: number;
}) => {
  const { t: commonBookingT } = useTranslation(Namespaces.commonBookingWidgetNs);
  const { t } = useTranslation(Namespaces.tourBookingWidgetNs);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const {
    activeDropdown,
    onDatesOpenStateChangeHandler,
    onTravelersOpenStateChangeHandler,
    onOptionsOpenStateChangeHandler,
    onTimesOpenStateChangeHandler,
    onGuidedLanguagesOpenStateChangeHandler,
    onArrivalDropdownOpenStateChangeHandler,
    onDepartureDropdownOpenStateChangeHandler,
  } = useDropdownActiveState();
  const { totalPrice, isAvailabilityLoading, numberOfTravelers, isError } =
    useGTETourBookingWidgetContext();
  const hasTotalPrice = totalPrice > 0;
  const price = hasTotalPrice ? totalPrice : fromPrice;
  return (
    <BookingWidgetDesktopContainer
      footerText={commonBookingT("Continue")}
      price={convertCurrency(price)}
      discount={none}
      isPriceLoading={isAvailabilityLoading}
      isFormLoading={isFormLoading}
      isTotalPrice={hasTotalPrice}
      currency={currencyCode}
      priceSubtext={getTravelerPriceText(numberOfTravelers, t)}
      onFooterButtonClick={onAddToCart}
      showOverlay={Boolean(activeDropdown)}
      error={formErrorText}
      isButtonDisabled={isError}
    >
      <GTETourDatePickerContainer
        lengthOfTour={numberOfDays}
        activeDropdown={activeDropdown}
        onOpenStateChange={onDatesOpenStateChangeHandler}
        productId={productId}
      />
      <GTETourBookingWidgetSharedBody
        productId={productId}
        hideContent={hideContent}
        travelerErrorMessage={travelerErrorMessage}
        activeDropdown={activeDropdown}
        onTravelersOpenStateChangeHandler={onTravelersOpenStateChangeHandler}
        onOptionsOpenStateChangeHandler={onOptionsOpenStateChangeHandler}
        onTimesOpenStateChangeHandler={onTimesOpenStateChangeHandler}
        onGuidedLanguagesOpenStateChangeHandler={onGuidedLanguagesOpenStateChangeHandler}
        onArrivalDropdownOpenStateChangeHandler={onArrivalDropdownOpenStateChangeHandler}
        onDepartureDropdownOpenStateChangeHandler={onDepartureDropdownOpenStateChangeHandler}
      />
    </BookingWidgetDesktopContainer>
  );
};

export default GTETourBookingWidgetDesktop;
