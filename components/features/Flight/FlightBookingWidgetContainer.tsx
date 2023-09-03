import React, { useContext, useEffect } from "react";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";

import FlightChangedModal from "./FlightChangedModal";
import FlightStateContext from "./contexts/FlightStateContext";
import FlightCallbackContext from "./contexts/FlightCallbackContext";
import FlightConstantContext from "./contexts/FlightConstantContext";
import { getFormError } from "./utils/flightUtils";
import useAddFlightToCart from "./useAddFlightToCart";
import FlightBookingWidgetDesktop from "./FlightBookingWidgetDesktop";

import BookingWidgetFooterPrice from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterPrice";
import BookingWidgetFooterMobile from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterMobile";
import BookingWidgetErrorBoundary from "components/ui/BookingWidget/BookingWidgetErrorBoundary";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { useSettings } from "contexts/SettingsContext";
import {
  datalayerProductView,
  productDetailsDataLayerPush,
} from "components/ui/Tracking/trackingUtils";
import { Product, SupportedCurrencies } from "types/enums";
import BookingWidgetForm from "components/ui/BookingWidget/BookingWidgetForm";

const FlightBookingWidgetContainer = ({
  departureDate,
  returnDate,
  departureTime,
  returnTime,
  bookingToken,
  isFlightChecked,
  cartLink,
  flightSearchUrl,
  title,
  id,
  price,
  cartItemId,
  sessionId,
  showHealthDeclaration,
  flightLoading,
}: {
  departureDate: string;
  returnDate?: string;
  departureTime: string;
  returnTime?: string;
  bookingToken?: string;
  isFlightChecked: boolean;
  cartLink: string;
  flightSearchUrl: string;
  title: string;
  id: string;
  price: number;
  cartItemId?: string;
  sessionId?: string;
  showHealthDeclaration: boolean;
  flightLoading: boolean;
}) => {
  const isMobile = useIsMobile();
  const { marketplace, marketplaceBaseCurrency } = useSettings();
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const { t: commonT } = useTranslation(Namespaces.commonBookingWidgetNs);
  const { t } = useTranslation(Namespaces.flightNs);
  const { passengers, formErrors, contactDetails, formSubmitted } = useContext(FlightStateContext);
  const { onFormSubmit } = useContext(FlightCallbackContext);
  const { passportRequired } = useContext(FlightConstantContext);
  const formError = getFormError(formErrors, t);
  const datalayerProduct = {
    id,
    name: title,
    price: price.toString(),
    productType: Product.FLIGHT,
    marketplace,
  };
  const { addToCartMutation, addToCartLoading, notAvailable, isError } = useAddFlightToCart({
    passengers,
    contactDetails,
    bookingToken: bookingToken || "",
    cartLink,
    passportRequired,
    datalayerProduct,
    cartItemId,
    sessionId,
  });
  const prevPrice = usePreviousState(price);
  useEffect(() => {
    if (prevPrice === 0 && price > 0) {
      datalayerProductView(datalayerProduct, marketplaceBaseCurrency as SupportedCurrencies);
      productDetailsDataLayerPush({
        name: title,
        id: id.toString(),
        price,
        category: Product.FLIGHT,
      });
    }
  }, [datalayerProduct, id, title, price, prevPrice, marketplaceBaseCurrency]);
  const isPriceLoading = !isFlightChecked || flightLoading;
  return (
    <BookingWidgetErrorBoundary>
      {(notAvailable || isError) && (
        <FlightChangedModal
          isInvalid
          flightSearchUrl={flightSearchUrl}
          price={price}
          onModalClose={() => {}}
        />
      )}
      <BookingWidgetForm
        id="booking-widget-form"
        method="POST"
        onSubmit={e => {
          e.preventDefault();
          onFormSubmit();
          if (!formError && bookingToken !== undefined) {
            addToCartMutation();
          }
        }}
      >
        {isMobile ? (
          <BookingWidgetFooterMobile
            showDates={false}
            buttonCallToAction={commonT("Continue")}
            isButtonLoading={addToCartLoading || Boolean(flightLoading)}
            onButtonClick={() => {}}
            formError={formSubmitted ? formError : undefined}
            footerLeftContent={
              <BookingWidgetFooterPrice
                price={convertCurrency(price)}
                currency={currencyCode}
                isPriceLoading={isPriceLoading}
                isTotalPrice
              />
            }
            type="submit"
          />
        ) : (
          <FlightBookingWidgetDesktop
            departureDate={departureDate}
            departureTime={departureTime}
            returnDate={returnDate}
            returnTime={returnTime}
            price={convertCurrency(price)}
            formError={formError}
            isFormLoading={addToCartLoading}
            isPriceLoading={!isFlightChecked || Boolean(flightLoading)}
            showHealthDeclaration={showHealthDeclaration}
            flightLoading={flightLoading}
          />
        )}
      </BookingWidgetForm>
    </BookingWidgetErrorBoundary>
  );
};
export default FlightBookingWidgetContainer;
