import React, { useContext } from "react";

import { VPStateContext } from "../contexts/VPStateContext";
import { VPPriceStateContext } from "../contexts/VPPriceStateContext";
import { VPModalStateContext, VPModalCallbackContext } from "../contexts/VPModalStateContext";
import { VPStayStateContext } from "../contexts/VPStayStateContext";

import { BookingWidgetView, getVPFooterPrice } from "./utils/vpBookingWidgetUtils";
import VPBookingWidgetFooterPriceWithInfo from "./VPBookingWidgetFooterPriceWithInfo";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import BookingWidgetFooterMobile from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterMobile";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const VPMobileFooter = ({
  onAddToCart,
  isAddToCartLoading,
  isVPPriceAvailable,
}: {
  isVPPriceAvailable: boolean;
  onAddToCart: () => void;
  isAddToCartLoading: boolean;
}) => {
  const { t: commonT } = useTranslation(Namespaces.commonNs);
  const { selectedDates, isFormLoading, isSadPathWithoutParams } = useContext(VPStateContext);
  const { bookingWidgetView, isMobileSearchOpen } = useContext(VPModalStateContext);
  const { vpPrice, fromPrice } = useContext(VPPriceStateContext);
  const { onToggleIsVPMobileSearchOpen } = useContext(VPModalCallbackContext);
  const { occupancies } = useContext(VPStayStateContext);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const priceWithCurrency = convertCurrency(vpPrice);

  const priceSubtext = getVPFooterPrice(vpPrice, occupancies, selectedDates, commonT);

  const footerLeftContent = (
    <VPBookingWidgetFooterPriceWithInfo
      price={!isSadPathWithoutParams ? priceWithCurrency : convertCurrency(fromPrice)}
      currency={currencyCode}
      isPriceLoading={!isVPPriceAvailable && !isSadPathWithoutParams}
      isTotalPrice={!isSadPathWithoutParams}
      info={priceSubtext}
    />
  );

  const isAddToCartButton = Boolean(
    selectedDates.from && selectedDates.to && isMobileSearchOpen && !isSadPathWithoutParams
  );
  const buttonText = () => {
    if (isAddToCartButton) {
      return commonT("Continue");
    }
    if (isSadPathWithoutParams) {
      return commonT("Select dates");
    }
    return commonT("Continue");
  };
  const handleButtonClick = () => {
    if (!isMobileSearchOpen || isSadPathWithoutParams) {
      onToggleIsVPMobileSearchOpen();
    } else {
      onAddToCart();
    }
  };
  const isButtonDisabled = (vpPrice === 0 || vpPrice === undefined) && !isSadPathWithoutParams;
  const isButtonLoading =
    (isFormLoading || !isVPPriceAvailable || vpPrice === undefined) && !isSadPathWithoutParams;
  return (
    <BookingWidgetFooterMobile
      showDates={bookingWidgetView === BookingWidgetView.SearchStep}
      selectedDates={selectedDates}
      buttonCallToAction={buttonText()}
      isButtonLoading={isButtonLoading || isAddToCartLoading}
      onButtonClick={handleButtonClick}
      disabled={isButtonDisabled}
      footerLeftContent={footerLeftContent}
    />
  );
};

export default VPMobileFooter;
