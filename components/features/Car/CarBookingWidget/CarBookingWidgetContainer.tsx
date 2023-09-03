import React, { useContext, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";

import CarExpiredModal from "../CarExpiredModal";

import CarBookingWidgetStateContext from "./contexts/CarBookingWidgetStateContext";
import CarBookingWidgetCallbackContext from "./contexts/CarBookingWidgetCallbackContext";
import CarBookingWidgetConstantContext from "./contexts/CarBookingWidgetConstantContext";
import CarBookingWidgetDesktop from "./CarBookingWidgetDesktop";
import CarBookingWidgetMobile from "./CarBookingWidgetMobile";
import useAddCarToCart from "./useAddCarToCart";
import { getFormError } from "./utils/carBookingWidgetUtils";
import useCarEditItem from "./hooks/useCarEditItem";

import { breakpointsMax } from "styles/variables";
import { CarProvider, Marketplace, Product, SupportedCurrencies } from "types/enums";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { getSearchPageLink } from "components/ui/CarSearchWidget/utils/carSearchWidgetUtils";
import {
  datalayerProductView,
  productDetailsDataLayerPush,
} from "components/ui/Tracking/trackingUtils";
import { useSettings } from "contexts/SettingsContext";
import BookingWidgetForm from "components/ui/BookingWidget/BookingWidgetForm";
import useRemoveItemFromCart from "components/features/Cart/hooks/useRemoveItemFromCart";
import { emptyFunction } from "utils/helperUtils";

const CarBookingWidgetContainer = ({ provider }: { provider: CarProvider }) => {
  const { t } = useTranslation(Namespaces.carBookingWidgetNs);
  const { addToCartMutation, isNotSuccessful } = useAddCarToCart(provider);
  const { marketplace, marketplaceBaseCurrency } = useSettings();

  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const { removeItemFromCartMutation, loading: isRemoveFromCartLoading } = useRemoveItemFromCart({
    onCompleted: emptyFunction,
  });
  const {
    searchPageUrl,
    from,
    to,
    queryPickupId,
    queryDropoffId,
    driverAge,
    driverCountryCode,
    id,
    title,
    pickupLocation,
    dropoffLocation,
    editCarOfferCartId,
  } = useContext(CarBookingWidgetConstantContext);
  const searchLink = getSearchPageLink({
    searchLink: searchPageUrl,
    selectedDates: { from, to },
    pickupId: String(queryPickupId),
    dropoffId: String(queryDropoffId),
    driverAge: driverAge ? Number(driverAge) : undefined,
    driverCountry: driverCountryCode,
    pickupLocationName: pickupLocation,
    dropoffLocationName: dropoffLocation,
  });
  const {
    isFormLoading,
    selectedExtras,
    extras,
    selectedInsurances,
    insurances,
    formErrors,
    price,
  } = useContext(CarBookingWidgetStateContext);
  const {
    toggleIsFormLoading,
    setSelectedExtra,
    setSelectedInsurance,
    setSelectedExtraQuestionAnswers,
  } = useContext(CarBookingWidgetCallbackContext);

  const onAddToCart = () => {
    addToCartMutation();
    toggleIsFormLoading();
  };

  const handleOnAddToCart = async () => {
    if (!isFormLoading) {
      if (
        marketplace !== Marketplace.GUIDE_TO_THE_PHILIPPINES &&
        editCarOfferCartId?.length &&
        !isRemoveFromCartLoading
      ) {
        removeItemFromCartMutation({
          variables: {
            cartItemId: `cars-${editCarOfferCartId}`,
          },
        }).finally(onAddToCart);
      } else if (!editCarOfferCartId?.length) {
        onAddToCart();
      }
    }
  };

  useCarEditItem();

  const formError = getFormError(formErrors, t);

  const prevPrice = usePreviousState(price);

  useEffect(() => {
    if (prevPrice === 0 && price > 0) {
      datalayerProductView(
        {
          id,
          name: title,
          price: price.toString(),
          productType: Product.CAR,
          marketplace,
        },
        marketplaceBaseCurrency as SupportedCurrencies
      );
      productDetailsDataLayerPush({
        name: title,
        id,
        price,
        category: Product.CAR,
      });
    }
  }, [id, marketplace, marketplaceBaseCurrency, prevPrice, price, title]);
  return (
    <>
      {isNotSuccessful && <CarExpiredModal carSearchUrl={searchLink} />}
      <BookingWidgetForm
        id="booking-widget-form"
        method="POST"
        onSubmit={e => {
          e.preventDefault();
          if (formErrors.length === 0 && !isFormLoading) {
            toggleIsFormLoading();
            handleOnAddToCart();
          }
        }}
      >
        {isMobile ? (
          <CarBookingWidgetMobile
            selectedExtras={selectedExtras}
            onSetSelectedExtra={setSelectedExtra}
            extras={extras}
            selectedInsurances={selectedInsurances}
            onSetSelectedInsurance={setSelectedInsurance}
            insurances={insurances}
            onAddToCart={handleOnAddToCart}
            onSetSelectedExtraQuestionAnswers={setSelectedExtraQuestionAnswers}
          />
        ) : (
          <CarBookingWidgetDesktop
            selectedExtras={selectedExtras}
            onSetSelectedExtra={setSelectedExtra}
            extras={extras}
            selectedInsurances={selectedInsurances}
            onSetSelectedInsurance={setSelectedInsurance}
            insurances={insurances}
            onSetSelectedExtraQuestionAnswers={setSelectedExtraQuestionAnswers}
            formError={formError}
          />
        )}
      </BookingWidgetForm>
    </>
  );
};

export default CarBookingWidgetContainer;
