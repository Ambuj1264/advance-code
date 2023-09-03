import React, { useContext, useState } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { BookingWidgetView } from "../types/CarEnums";

import CarBookingWidgetConstantContext from "./contexts/CarBookingWidgetConstantContext";
import CarBookingWidgetStateContext from "./contexts/CarBookingWidgetStateContext";
import CarBookingWidgetCallbackContext from "./contexts/CarBookingWidgetCallbackContext";
import CarBookingWidgetPriceBreakdown from "./CarBookingWidgetPriceBreakdown";
import { getFormError } from "./utils/carBookingWidgetUtils";

import useRepositionContactUsButton from "hooks/useRepositionContactUsButton";
import currencyFormatter, { roundPrice } from "utils/currencyFormatUtils";
import BookingWidgetFooterMobile from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterMobile";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { useTranslation, Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { gutters, blackColor } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import BookingWidgetFooterPriceWithInfo from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterPriceWithInfo";
import { ContactUsMobileMargin } from "components/features/ContactUs/ContactUsButton";
import { checkShouldFormatPrice } from "utils/helperUtils";

const PayNowPrice = styled.span([
  typographySubtitle2,
  css`
    margin-right: ${gutters.small / 4}px;
    color: ${rgba(blackColor, 0.7)};
    font-weight: bold;
  `,
]);

const CarBookingWidgetFooterMobile = ({ onAddToCart }: { onAddToCart?: () => void }) => {
  const {
    price,
    isFormLoading,
    isPriceLoading,
    bookingWidgetView,
    isModalOpen,
    fullPrice,
    priceOnArrival,
    payOnArrival,
    priceBreakdown,
    formErrors,
  } = useContext(CarBookingWidgetStateContext);
  const { setBookingWidgetView, toggleModal } = useContext(CarBookingWidgetCallbackContext);
  const { isCarnect, priceSubtext } = useContext(CarBookingWidgetConstantContext);

  useRepositionContactUsButton({
    bottomPosition:
      payOnArrival && payOnArrival.length ? ContactUsMobileMargin.WideFooter : undefined,
    isMobileFooterShown: true,
  });

  const { t } = useTranslation(Namespaces.commonBookingWidgetNs);
  const { t: carT } = useTranslation(Namespaces.carBookingWidgetNs);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const [showFormErrors, toggleShowFormErrors] = useState(false);
  const buttonText = isModalOpen ? t("Continue") : t("Add to Cart");
  const formError =
    bookingWidgetView === BookingWidgetView.Extras && showFormErrors
      ? getFormError(formErrors, carT)
      : undefined;

  const handleButtonClick = () => {
    if (!isModalOpen) {
      toggleModal();
      if (bookingWidgetView === BookingWidgetView.Default) {
        setBookingWidgetView(bookingWidgetView + 1);
      }
    } else if (bookingWidgetView === BookingWidgetView.Extras && formErrors.length > 0) {
      toggleShowFormErrors(true);
    } else if (bookingWidgetView === BookingWidgetView.Extras) {
      toggleShowFormErrors(false);
      onAddToCart?.();
    }
  };
  const shouldFormatPrice = checkShouldFormatPrice(isCarnect, currencyCode);
  const convertedPrice = convertCurrency(price);
  const convertedFullPrice = fullPrice ? convertCurrency(fullPrice) : undefined;
  const convertedPriceOnArrival = convertCurrency(priceOnArrival);
  return (
    <BookingWidgetFooterMobile
      showDates={false}
      buttonCallToAction={buttonText}
      isButtonLoading={isFormLoading}
      onButtonClick={handleButtonClick}
      formError={formError}
      footerLeftContent={
        priceOnArrival ? (
          <BookingWidgetFooterPriceWithInfo
            price={
              priceOnArrival && priceOnArrival > 0
                ? convertedPrice + convertedPriceOnArrival
                : convertedPrice
            }
            isPriceLoading={isPriceLoading}
            currency={currencyCode}
            isTotalPrice
            shouldFormatPrice={shouldFormatPrice}
            info={
              <div>
                <Trans
                  ns={Namespaces.carBookingWidgetNs}
                  i18nKey="Pay now {price}"
                  defaults="Pay now <0>{price}</0>"
                  components={[<PayNowPrice>price</PayNowPrice>]}
                  values={{
                    price: shouldFormatPrice
                      ? currencyFormatter(convertedPrice)
                      : roundPrice(convertedPrice),
                  }}
                />
                {currencyCode}
              </div>
            }
          />
        ) : (
          <BookingWidgetFooterPriceWithInfo
            price={convertedPrice}
            currency={currencyCode}
            isPriceLoading={isPriceLoading}
            isTotalPrice
            shouldFormatPrice={shouldFormatPrice}
            info={priceSubtext}
          />
        )
      }
      footerBannerContent={
        fullPrice && fullPrice > price ? (
          <Trans
            values={{
              amountToSave: shouldFormatPrice
                ? currencyFormatter(convertedFullPrice! - convertedPrice)
                : roundPrice(convertedPrice),
              currency: currencyCode,
            }}
            i18nKey="Save {amountToSave}"
            defaults="Save <0>{amountToSave}</0> {currency}"
            components={[<>amountToSave</>]}
          />
        ) : undefined
      }
      footerBelowContent={
        payOnArrival.length > 0 ? (
          <CarBookingWidgetPriceBreakdown
            payNowItems={priceBreakdown}
            payOnArrivalItems={payOnArrival}
            currency={currencyCode}
            shouldFormatPrice={shouldFormatPrice}
            convertCurrency={convertCurrency}
          />
        ) : undefined
      }
    />
  );
};

export default CarBookingWidgetFooterMobile;
